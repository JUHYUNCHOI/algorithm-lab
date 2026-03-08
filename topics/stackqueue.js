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

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-10773': { type: '스택 기본',   color: 'var(--accent)', vizMethod: '_renderVizZero' },
        'lc-20':     { type: '괄호 검증',   color: '#e17055',      vizMethod: '_renderVizParentheses' },
        'boj-2164':  { type: '큐 활용',     color: '#6c5ce7',      vizMethod: '_renderVizCard2' },
        'lc-155':    { type: '보조 스택',   color: 'var(--green)',  vizMethod: '_renderVizMinStack' }
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
        const self = this;
        const prob = self.problems.find(p => p.id === problemId);
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }
        const meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }
        self._clearVizState();
        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        const flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '힌트에서 배운 개념이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
            code:    { intro: '이제 앞에서 정리한 풀이를 코드로 옮겨봅시다!', icon: '💻' }
        };
        const ft = flowMap[tabId];
        if (ft) {
            const introDiv = document.createElement('div');
            introDiv.className = 'flow-intro';
            introDiv.innerHTML = '<span class="flow-intro-icon">' + ft.icon + '</span><span>' + ft.intro + '</span>';
            container.appendChild(introDiv);
        }
        const contentDiv = document.createElement('div');
        container.appendChild(contentDiv);
        switch (tabId) {
            case 'problem': self._renderProblemTab(contentDiv, prob); break;
            case 'think':   self._renderThinkTab(contentDiv, prob); break;
            case 'sim':     self[meta.vizMethod](contentDiv); break;
            case 'code':    self._renderCodeTab(contentDiv, prob); break;
        }
        const tabOrder = ['problem', 'think', 'sim', 'code'];
        const tabLabels = { problem: '문제', think: '생각해볼것', sim: '시뮬레이션', code: '코드' };
        const ctaTexts = { problem: '문제를 이해했다면', think: '힌트를 모두 확인했다면', sim: '동작 원리를 파악했다면' };
        const curIdx = tabOrder.indexOf(tabId);
        if (curIdx >= 0 && curIdx < tabOrder.length - 1) {
            const nextId = tabOrder[curIdx + 1];
            const nextDiv = document.createElement('div');
            nextDiv.className = 'flow-next';
            nextDiv.innerHTML = '<button class="flow-next-btn">' + ctaTexts[tabId] + ' → ' + tabLabels[nextId] + ' →</button>';
            nextDiv.querySelector('button').addEventListener('click', function() { window._switchToTab(nextId); });
            container.appendChild(nextDiv);
        }
    },

    _renderProblemTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
        const guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = '단계별로 눌러서 힌트를 확인하세요';
        contentEl.appendChild(guide);
        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';
        const openedState = {};
        prob.hints.forEach(function(hint, idx) {
            const step = document.createElement('div');
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
        const isLC = prob.link.includes('leetcode');
        const wrapper = document.createElement('div');
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — Push & Pop</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sq-demo-push">📥 Push</button>
                        <button class="concept-demo-btn danger" id="sq-demo-pop" disabled>📤 Pop</button>
                        <button class="concept-demo-btn green" id="sq-demo-peek" disabled>👀 Peek</button>
                    </div>
                    <div class="concept-demo-body">
                        <div class="demo-stack-wrap">
                            <div class="demo-stack-label">스택</div>
                            <div class="demo-stack" id="sq-demo-stack">
                                <div class="demo-stack-empty">(비어있음)</div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sq-demo-stack-msg">👆 Push 버튼을 눌러 스택에 숫자를 넣어보세요!</div>
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — Enqueue & Dequeue</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sq-demo-enqueue">📥 Enqueue (뒤에 추가)</button>
                        <button class="concept-demo-btn danger" id="sq-demo-dequeue" disabled>📤 Dequeue (앞에서 제거)</button>
                    </div>
                    <div class="concept-demo-body">
                        <div class="demo-queue-wrap">
                            <div class="demo-queue" id="sq-demo-queue">
                                <div class="demo-queue-empty">(비어있음)</div>
                            </div>
                            <div class="demo-queue-pointers" id="sq-demo-queue-ptrs" style="display:none;">
                                <div class="demo-pointer" style="color:var(--red);">▲ front</div>
                                <div class="demo-pointer" style="color:var(--green);">▲ back</div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sq-demo-queue-msg">👆 Enqueue 버튼을 눌러 큐에 데이터를 넣어보세요!</div>
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 양방향 삽입/삭제</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sq-demo-appendleft">◀ appendleft</button>
                        <button class="concept-demo-btn" id="sq-demo-append">append ▶</button>
                        <button class="concept-demo-btn danger" id="sq-demo-popleft" disabled>◀ popleft</button>
                        <button class="concept-demo-btn danger" id="sq-demo-popright" disabled>pop ▶</button>
                    </div>
                    <div class="concept-demo-body">
                        <div class="demo-queue-wrap">
                            <div class="demo-queue" id="sq-demo-deque">
                                <div class="demo-queue-empty">(비어있음)</div>
                            </div>
                            <div class="demo-queue-pointers" id="sq-demo-deque-ptrs" style="display:none;">
                                <div class="demo-pointer" style="color:var(--red);">▲ front</div>
                                <div class="demo-pointer" style="color:var(--green);">▲ back</div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sq-demo-deque-msg">👆 양쪽 버튼을 눌러 앞/뒤로 자유롭게 넣고 빼보세요!</div>
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 괄호 검증 시뮬레이션</div>
                    <div class="demo-paren-input" id="sq-demo-paren-input"></div>
                    <div style="display:flex;gap:12px;align-items:center;justify-content:center;margin-bottom:0.8rem;">
                        <div class="demo-paren-stack-label">스택:</div>
                        <div class="demo-paren-stack" id="sq-demo-paren-stack">
                            <span style="color:var(--text3);font-size:0.85rem;">(비어있음)</span>
                        </div>
                    </div>
                    <div class="demo-paren-step-info">
                        <div class="concept-demo-btns" style="margin-bottom:0;">
                            <button class="concept-demo-btn" id="sq-demo-paren-next">다음 스텝 →</button>
                            <button class="concept-demo-btn green" id="sq-demo-paren-reset" style="display:none;">↺ 처음부터</button>
                        </div>
                        <span id="sq-demo-paren-counter" style="font-size:0.85rem;color:var(--text2);font-weight:600;"></span>
                    </div>
                    <div class="concept-demo-msg" id="sq-demo-paren-msg">👆 "다음 스텝" 버튼을 눌러 괄호를 하나씩 확인해보세요!</div>
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

        // ========== 인라인 데모 인터랙션 ==========

        // ── 공통 헬퍼: DOM 요소 생성 ──
        const _mkItem = (text, enterCls) => {
            const el = document.createElement('div');
            el.className = 'demo-item' + (enterCls ? ' ' + enterCls : '');
            el.textContent = text;
            // 진입 애니메이션 끝나면 클래스 제거 (재사용 대비)
            if (enterCls) el.addEventListener('animationend', () => el.classList.remove(enterCls), { once: true });
            return el;
        };
        const _removeItem = (el, removeCls, onDone) => {
            if (!el) { if (onDone) onDone(); return; }
            el.classList.add(removeCls);
            el.addEventListener('animationend', () => { el.remove(); if (onDone) onDone(); }, { once: true });
        };

        // --- 1. 스택 Push/Pop 데모 (DOM 직접 조작) ---
        {
            const stackEl = container.querySelector('#sq-demo-stack');
            const pushBtn = container.querySelector('#sq-demo-push');
            const popBtn = container.querySelector('#sq-demo-pop');
            const peekBtn = container.querySelector('#sq-demo-peek');
            const msgEl = container.querySelector('#sq-demo-stack-msg');
            const values = [1, 5, 3, 7, 2, 9];
            let pushIdx = 0;
            let stack = [];
            let animating = false;
            stackEl.innerHTML = '<div class="demo-stack-empty">(비어있음)</div>';

            const updateStackTags = () => {
                const items = stackEl.querySelectorAll('.demo-item');
                items.forEach((el, i) => {
                    el.classList.remove('top-item');
                    const tag = el.querySelector('.item-tag');
                    if (tag) tag.remove();
                });
                if (items.length > 0) {
                    const topEl = items[items.length - 1];
                    topEl.classList.add('top-item');
                    const tag = document.createElement('span');
                    tag.className = 'item-tag';
                    tag.style.color = 'var(--accent)';
                    tag.textContent = '← top';
                    topEl.appendChild(tag);
                }
                popBtn.disabled = stack.length === 0 || animating;
                peekBtn.disabled = stack.length === 0 || animating;
                pushBtn.disabled = stack.length >= 6 || animating;
            };

            pushBtn.addEventListener('click', () => {
                if (stack.length >= 6 || animating) return;
                // 비어있음 표시 제거
                const empty = stackEl.querySelector('.demo-stack-empty');
                if (empty) empty.remove();
                const val = values[pushIdx % values.length];
                pushIdx++;
                stack.push(val);
                const el = _mkItem(val, 'enter-stack');
                stackEl.appendChild(el);
                updateStackTags();
                msgEl.textContent = 'push(' + val + ') → 스택 맨 위에 ' + val + '을(를) 넣었습니다. 스택: [' + stack.join(', ') + ']';
            });

            popBtn.addEventListener('click', () => {
                if (stack.length === 0 || animating) return;
                animating = true;
                const val = stack.pop();
                const topEl = stackEl.querySelector('.demo-item:last-child');
                pushBtn.disabled = true; popBtn.disabled = true; peekBtn.disabled = true;
                _removeItem(topEl, 'remove-up', () => {
                    animating = false;
                    if (stack.length === 0) stackEl.innerHTML = '<div class="demo-stack-empty">(비어있음)</div>';
                    updateStackTags();
                });
                msgEl.textContent = 'pop() → 맨 위의 ' + val + '을(를) 꺼냈습니다! (LIFO) 스택: [' + stack.join(', ') + ']';
            });

            peekBtn.addEventListener('click', () => {
                if (stack.length === 0) return;
                const val = stack[stack.length - 1];
                msgEl.textContent = 'peek() → 맨 위 원소는 ' + val + '입니다. (꺼내지 않고 확인만!)';
                const topEl = stackEl.querySelector('.top-item');
                if (topEl) {
                    topEl.style.transform = 'scale(1.15)';
                    topEl.style.transition = 'transform 0.15s ease';
                    setTimeout(() => { topEl.style.transform = ''; }, 300);
                }
            });
        }

        // --- 2. 큐 Enqueue/Dequeue 데모 (DOM 직접 조작) ---
        {
            const queueEl = container.querySelector('#sq-demo-queue');
            const enqBtn = container.querySelector('#sq-demo-enqueue');
            const deqBtn = container.querySelector('#sq-demo-dequeue');
            const ptrsEl = container.querySelector('#sq-demo-queue-ptrs');
            const msgEl = container.querySelector('#sq-demo-queue-msg');
            const letters = 'ABCDEFGH';
            let enqIdx = 0;
            let queue = [];
            let animating = false;
            queueEl.innerHTML = '<div class="demo-queue-empty">(비어있음)</div>';

            const updateQueueTags = () => {
                const items = queueEl.querySelectorAll('.demo-item');
                items.forEach(el => el.classList.remove('front-item', 'back-item'));
                if (items.length >= 2) {
                    items[0].classList.add('front-item');
                    items[items.length - 1].classList.add('back-item');
                } else if (items.length === 1) {
                    items[0].classList.add('front-item');
                }
                ptrsEl.style.display = items.length > 1 ? 'flex' : 'none';
                deqBtn.disabled = queue.length === 0 || animating;
                enqBtn.disabled = queue.length >= 6 || animating;
            };

            enqBtn.addEventListener('click', () => {
                if (queue.length >= 6 || animating) return;
                const empty = queueEl.querySelector('.demo-queue-empty');
                if (empty) empty.remove();
                const val = letters[enqIdx % letters.length];
                enqIdx++;
                queue.push(val);
                const el = _mkItem(val, 'enter-right');
                queueEl.appendChild(el);
                updateQueueTags();
                msgEl.textContent = 'enqueue("' + val + '") → 뒤(back)에 추가! 큐: [' + queue.join(', ') + ']';
            });

            deqBtn.addEventListener('click', () => {
                if (queue.length === 0 || animating) return;
                animating = true;
                const val = queue.shift();
                const firstEl = queueEl.querySelector('.demo-item');
                enqBtn.disabled = true; deqBtn.disabled = true;
                _removeItem(firstEl, 'remove-left', () => {
                    animating = false;
                    if (queue.length === 0) queueEl.innerHTML = '<div class="demo-queue-empty">(비어있음)</div>';
                    updateQueueTags();
                });
                msgEl.textContent = 'dequeue() → 앞(front)의 "' + val + '"을(를) 꺼냈습니다! (FIFO) 큐: [' + queue.join(', ') + ']';
            });
        }

        // --- 3. 덱 양방향 데모 (DOM 직접 조작) ---
        {
            const dequeEl = container.querySelector('#sq-demo-deque');
            const appendLeftBtn = container.querySelector('#sq-demo-appendleft');
            const appendBtn = container.querySelector('#sq-demo-append');
            const popLeftBtn = container.querySelector('#sq-demo-popleft');
            const popRightBtn = container.querySelector('#sq-demo-popright');
            const ptrsEl = container.querySelector('#sq-demo-deque-ptrs');
            const msgEl = container.querySelector('#sq-demo-deque-msg');
            let nextNum = 1;
            let deque = [];
            let animating = false;
            dequeEl.innerHTML = '<div class="demo-queue-empty">(비어있음)</div>';

            const updateDequeTags = () => {
                const items = dequeEl.querySelectorAll('.demo-item');
                items.forEach(el => el.classList.remove('front-item', 'back-item'));
                if (items.length >= 2) {
                    items[0].classList.add('front-item');
                    items[items.length - 1].classList.add('back-item');
                } else if (items.length === 1) {
                    items[0].classList.add('front-item');
                }
                ptrsEl.style.display = items.length > 1 ? 'flex' : 'none';
                popLeftBtn.disabled = deque.length === 0 || animating;
                popRightBtn.disabled = deque.length === 0 || animating;
                appendLeftBtn.disabled = deque.length >= 7 || animating;
                appendBtn.disabled = deque.length >= 7 || animating;
            };

            appendLeftBtn.addEventListener('click', () => {
                if (deque.length >= 7 || animating) return;
                const empty = dequeEl.querySelector('.demo-queue-empty');
                if (empty) empty.remove();
                const val = nextNum++;
                deque.unshift(val);
                const el = _mkItem(val, 'enter-left');
                dequeEl.prepend(el);
                updateDequeTags();
                msgEl.textContent = 'appendleft(' + val + ') → 앞(front)에 추가! O(1) 덱: [' + deque.join(', ') + ']';
            });

            appendBtn.addEventListener('click', () => {
                if (deque.length >= 7 || animating) return;
                const empty = dequeEl.querySelector('.demo-queue-empty');
                if (empty) empty.remove();
                const val = nextNum++;
                deque.push(val);
                const el = _mkItem(val, 'enter-right');
                dequeEl.appendChild(el);
                updateDequeTags();
                msgEl.textContent = 'append(' + val + ') → 뒤(back)에 추가! O(1) 덱: [' + deque.join(', ') + ']';
            });

            popLeftBtn.addEventListener('click', () => {
                if (deque.length === 0 || animating) return;
                animating = true;
                const val = deque.shift();
                const firstEl = dequeEl.querySelector('.demo-item');
                appendLeftBtn.disabled = true; appendBtn.disabled = true;
                popLeftBtn.disabled = true; popRightBtn.disabled = true;
                _removeItem(firstEl, 'remove-left', () => {
                    animating = false;
                    if (deque.length === 0) dequeEl.innerHTML = '<div class="demo-queue-empty">(비어있음)</div>';
                    updateDequeTags();
                });
                msgEl.textContent = 'popleft() → 앞의 ' + val + '을(를) 제거! O(1) 덱: [' + deque.join(', ') + ']';
            });

            popRightBtn.addEventListener('click', () => {
                if (deque.length === 0 || animating) return;
                animating = true;
                const val = deque.pop();
                const lastEl = dequeEl.querySelector('.demo-item:last-child');
                appendLeftBtn.disabled = true; appendBtn.disabled = true;
                popLeftBtn.disabled = true; popRightBtn.disabled = true;
                _removeItem(lastEl, 'remove-right', () => {
                    animating = false;
                    if (deque.length === 0) dequeEl.innerHTML = '<div class="demo-queue-empty">(비어있음)</div>';
                    updateDequeTags();
                });
                msgEl.textContent = 'pop() → 뒤의 ' + val + '을(를) 제거! O(1) 덱: [' + deque.join(', ') + ']';
            });
        }

        // --- 4. 괄호 검증 스텝 데모 ---
        {
            const input = '([{}])';
            const chars = input.split('');
            const pairs = { ')': '(', ']': '[', '}': '{' };
            const inputEl = container.querySelector('#sq-demo-paren-input');
            const stackEl = container.querySelector('#sq-demo-paren-stack');
            const nextBtn = container.querySelector('#sq-demo-paren-next');
            const resetBtn = container.querySelector('#sq-demo-paren-reset');
            const counterEl = container.querySelector('#sq-demo-paren-counter');
            const msgEl = container.querySelector('#sq-demo-paren-msg');
            let step = 0;
            let stack = [];
            let matchedIndices = [];

            // 초기 렌더
            inputEl.innerHTML = chars.map(c => '<div class="demo-paren-char">' + c + '</div>').join('');
            counterEl.textContent = '0 / ' + (chars.length + 1);

            const renderParenState = () => {
                // 입력 문자열 렌더
                const charEls = inputEl.querySelectorAll('.demo-paren-char');
                charEls.forEach((el, i) => {
                    el.className = 'demo-paren-char';
                    if (i === step - 1 && step <= chars.length) el.classList.add('active');
                    if (matchedIndices.includes(i)) el.classList.add('done');
                });

                // 스택 렌더
                if (stack.length === 0) {
                    stackEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">(비어있음)</span>';
                } else {
                    stackEl.innerHTML = stack.map(v =>
                        '<div class="demo-item" style="min-width:32px;padding:4px 8px;font-size:1.1rem;">' + v + '</div>'
                    ).join('');
                }
                counterEl.textContent = step + ' / ' + (chars.length + 1);
            };

            nextBtn.addEventListener('click', () => {
                if (step > chars.length) return;

                if (step < chars.length) {
                    const c = chars[step];
                    if ('([{'.includes(c)) {
                        stack.push(c);
                        step++;
                        renderParenState();
                        msgEl.textContent = '"' + c + '" → 여는 괄호! 스택에 push 합니다. 스택: [' + stack.join(', ') + ']';
                    } else {
                        const top = stack[stack.length - 1];
                        stack.pop();
                        // 짝 인덱스 찾기
                        const openIdx = chars.lastIndexOf(pairs[c], step - 1);
                        for (let j = step - 1; j >= 0; j--) {
                            if (chars[j] === pairs[c] && !matchedIndices.includes(j)) {
                                matchedIndices.push(j);
                                break;
                            }
                        }
                        matchedIndices.push(step);
                        step++;
                        renderParenState();
                        msgEl.textContent = '"' + c + '" → 닫는 괄호! pop "' + top + '" → 짝이 맞습니다 ✓ 스택: [' + stack.join(', ') + ']';
                    }
                } else {
                    // 최종 판정
                    step++;
                    renderParenState();
                    if (stack.length === 0) {
                        msgEl.innerHTML = '✅ <strong>스택이 비었으므로 모든 괄호가 유효합니다!</strong> → return true';
                    } else {
                        msgEl.innerHTML = '❌ <strong>스택에 남은 괄호가 있어 유효하지 않습니다!</strong> → return false';
                    }
                    nextBtn.style.display = 'none';
                    resetBtn.style.display = '';
                }
            });

            resetBtn.addEventListener('click', () => {
                step = 0;
                stack = [];
                matchedIndices = [];
                renderParenState();
                msgEl.textContent = '👆 "다음 스텝" 버튼을 눌러 괄호를 하나씩 확인해보세요!';
                nextBtn.style.display = '';
                resetBtn.style.display = 'none';
            });
        }

        // think-box 토글
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                if (box) box.classList.toggle('revealed');
            });
        });
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

    // ── 애니메이션 헬퍼: DOM 요소를 HTML 문자열 기준으로 업데이트 ──
    _updateElFromHTML(existingEl, htmlString) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = htmlString;
        const newEl = wrapper.firstElementChild;
        if (!newEl) return;
        existingEl.className = newEl.className;
        existingEl.innerHTML = newEl.innerHTML;
        const newStyle = newEl.getAttribute('style');
        if (newStyle) existingEl.setAttribute('style', newStyle);
        else existingEl.removeAttribute('style');
    },

    // ── 애니메이션 헬퍼: 컨테이너의 자식을 목표 상태로 동기화 ──
    // targetItems: [{html: '<div class="str-char-box ...">값</div>'}]
    // opts: { enterClass, removeClass, removePosition('end'|'start'), emptyHTML, animate }
    _syncContainer(containerEl, targetItems, opts) {
        const self = this;
        const o = opts || {};
        const enterCls = o.enterClass || '';
        const removeCls = o.removeClass || '';
        const removePos = o.removePosition || 'end';
        const emptyHTML = o.emptyHTML || '';
        const animate = o.animate !== false;

        // 1. 진행 중인 퇴장 애니메이션 즉시 정리
        containerEl.querySelectorAll('.anim-removing').forEach(el => el.remove());
        // 진행 중인 진입 애니메이션 클래스도 정리
        containerEl.querySelectorAll('.anim-enter-stack, .anim-enter-right').forEach(el => {
            el.classList.remove('anim-enter-stack', 'anim-enter-right');
        });

        // 2. 빈 상태 플레이스홀더 제거
        const placeholder = containerEl.querySelector('[data-empty]');
        if (placeholder) placeholder.remove();

        // 3. 현재 .str-char-box 요소들
        const currentChildren = Array.from(containerEl.querySelectorAll(':scope > .str-char-box'));
        const currentCount = currentChildren.length;
        const targetCount = targetItems.length;

        // 4. 목표가 비어있는 경우
        if (targetCount === 0) {
            if (animate && currentCount > 0 && removeCls) {
                // 마지막/첫 요소에 퇴장 애니메이션
                const idx = removePos === 'start' ? 0 : currentCount - 1;
                const el = currentChildren[idx];
                el.classList.add(removeCls, 'anim-removing');
                el.addEventListener('animationend', () => {
                    el.remove();
                    if (containerEl.querySelectorAll(':scope > .str-char-box').length === 0 && emptyHTML) {
                        containerEl.innerHTML = emptyHTML;
                    }
                }, { once: true });
                // 나머지는 즉시 제거
                currentChildren.forEach((c, i) => { if (i !== idx) c.remove(); });
            } else {
                containerEl.innerHTML = emptyHTML;
            }
            return;
        }

        // 5. 현재 비어있는 경우 → 전부 새로 생성
        if (currentCount === 0) {
            containerEl.innerHTML = '';
            targetItems.forEach((item, i) => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = item.html;
                const el = wrapper.firstElementChild;
                if (animate && enterCls && i === targetCount - 1) {
                    el.classList.add(enterCls);
                    el.addEventListener('animationend', () => el.classList.remove(enterCls), { once: true });
                }
                containerEl.appendChild(el);
            });
            return;
        }

        // 6. 요소 추가 (push / enqueue)
        if (targetCount > currentCount) {
            // 기존 요소 업데이트
            for (let i = 0; i < currentCount; i++) {
                self._updateElFromHTML(currentChildren[i], targetItems[i].html);
            }
            // 새 요소 추가
            for (let i = currentCount; i < targetCount; i++) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = targetItems[i].html;
                const el = wrapper.firstElementChild;
                if (animate && enterCls) {
                    el.classList.add(enterCls);
                    el.addEventListener('animationend', () => el.classList.remove(enterCls), { once: true });
                }
                containerEl.appendChild(el);
            }
            return;
        }

        // 7. 요소 삭제 (pop / dequeue)
        if (targetCount < currentCount) {
            if (removePos === 'start') {
                // 큐: 앞에서 제거
                const removedCount = currentCount - targetCount;
                for (let i = 0; i < removedCount; i++) {
                    const el = currentChildren[i];
                    if (animate && removeCls) {
                        el.classList.add(removeCls, 'anim-removing');
                        el.addEventListener('animationend', () => el.remove(), { once: true });
                    } else {
                        el.remove();
                    }
                }
                // 나머지 업데이트
                for (let i = removedCount; i < currentCount; i++) {
                    self._updateElFromHTML(currentChildren[i], targetItems[i - removedCount].html);
                }
            } else {
                // 스택: 끝에서 제거
                for (let i = currentCount - 1; i >= targetCount; i--) {
                    const el = currentChildren[i];
                    if (animate && removeCls) {
                        el.classList.add(removeCls, 'anim-removing');
                        el.addEventListener('animationend', () => el.remove(), { once: true });
                    } else {
                        el.remove();
                    }
                }
                // 나머지 업데이트
                for (let i = 0; i < targetCount; i++) {
                    self._updateElFromHTML(currentChildren[i], targetItems[i].html);
                }
            }
            return;
        }

        // 8. 같은 개수 → in-place 업데이트 (CSS transition이 색 전환 처리)
        for (let i = 0; i < targetCount; i++) {
            self._updateElFromHTML(currentChildren[i], targetItems[i].html);
        }
    },

    _createStepDesc(suffix) {
        const s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls(suffix) {
        const s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 &rarr;</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix, resetAction) {
        const s = suffix || '';
        const state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        const prevBtn = container.querySelector('#viz-prev' + s);
        const nextBtn = container.querySelector('#viz-next' + s);
        const counter = container.querySelector('#viz-step-counter' + s);
        const desc = container.querySelector('#viz-step-desc' + s);
        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) {
                counter.textContent = '시작 전';
                desc.textContent = '▶ 다음 버튼을 눌러 시작하세요';
            } else {
                counter.textContent = 'Step ' + (idx + 1) + ' / ' + total;
                desc.textContent = state.steps[idx].description;
            }
        };
        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            state.steps[state.currentStep].action('forward');
            updateUI();
        });
        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            state.currentStep--;
            if (state.currentStep >= 0) {
                state.steps[state.currentStep].action('backward');
            } else if (resetAction) {
                resetAction();
            }
            updateUI();
        });
        const keyHandler = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
        };
        document.addEventListener('keydown', keyHandler);
        state.keydownHandler = keyHandler;
        updateUI();
    },

    // ── 제로 (BOJ 10773) 시각화 ──
    _renderVizZero(container) {
        const self = this;
        const nums = [1, 3, 5, 4, 0, 0, 7, 0, 0, 6];
        const vizHTML = '<div class="sim-card">' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="flex:1;min-width:200px;max-width:320px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">입력 수열</div>' +
            '<div id="sq-input-zero" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">스택</div>' +
            '<div id="sq-stack-zero" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:80px;width:100px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="flex:0 0 auto;">' +
            '<div style="font-weight:600;color:var(--text-secondary);">sum = <span id="sq-sum-zero">0</span></div>' +
            '</div></div></div>';
        container.innerHTML = self._createStepDesc('-zero') + vizHTML + self._createStepControls('-zero');

        const inputEl = container.querySelector('#sq-input-zero');
        const stackEl = container.querySelector('#sq-stack-zero');
        const sumEl = container.querySelector('#sq-sum-zero');

        const states = [];
        let stack = [];
        states.push({ stack: [], highlight: -1, desc: '스택으로 수를 관리합니다. 0이 입력되면 가장 최근 수를 pop합니다.' });

        nums.forEach((n, i) => {
            if (n === 0) {
                const popped = stack[stack.length - 1];
                stack = stack.slice(0, -1);
                states.push({ stack: [...stack], highlight: i, desc: '입력: 0 → pop() → ' + popped + ' 제거! 스택: [' + stack.join(', ') + ']' });
            } else {
                stack = [...stack, n];
                states.push({ stack: [...stack], highlight: i, desc: 'push(' + n + ') → 스택: [' + stack.join(', ') + ']' });
            }
        });
        const finalSum = stack.reduce((a, b) => a + b, 0);
        states.push({ stack: [...stack], highlight: -1, desc: '완료! 남은 수의 합 = ' + finalSum });

        const steps = states.map((st, idx) => ({
            description: st.desc,
            action() {
                inputEl.innerHTML = nums.map((n, i) =>
                    '<div class="str-char-box' + (i === st.highlight ? ' comparing' : (i < st.highlight || (st.highlight === -1 && idx === states.length - 1) ? ' matched' : '')) + '" style="width:32px;text-align:center;">' + n + '</div>'
                ).join('');
                if (st.stack.length === 0) {
                    stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(비어있음)</div>';
                } else {
                    stackEl.innerHTML = st.stack.map((v, i) =>
                        '<div class="str-char-box' + (i === st.stack.length - 1 ? ' comparing' : '') + '" style="text-align:center;font-weight:600;">' + v + (i === st.stack.length - 1 ? ' ←top' : '') + '</div>'
                    ).join('');
                }
                sumEl.textContent = st.stack.reduce((a, b) => a + b, 0);
            }
        }));
        self._initStepController(container, steps, '-zero');
    },

    // ── Valid Parentheses (LeetCode 20) 시각화 ──
    _renderVizParentheses(container) {
        const self = this;
        const input = '([{}])';
        const chars = input.split('');

        const vizHTML = '<div class="sim-card">' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">입력 문자열</div>' +
            '<div id="sq-input-paren" style="display:flex;gap:4px;"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">스택</div>' +
            '<div id="sq-stack-paren" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:80px;width:80px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div></div></div>';
        container.innerHTML = self._createStepDesc('-paren') + vizHTML + self._createStepControls('-paren');

        const inputEl = container.querySelector('#sq-input-paren');
        const stackEl = container.querySelector('#sq-stack-paren');

        const states = [];
        let stack = [];
        let matchedPairs = [];
        states.push({ stack: [], charIdx: -1, desc: '문자열의 각 문자를 순서대로 확인합니다.', matchedPairs: [] });

        chars.forEach((c, i) => {
            if ('([{'.includes(c)) {
                stack = [...stack, c];
                states.push({ stack: [...stack], charIdx: i, desc: '"' + c + '" → 여는 괄호! 스택에 push합니다.', matchedPairs: [...matchedPairs] });
            } else {
                const top = stack[stack.length - 1];
                stack = stack.slice(0, -1);
                matchedPairs = [...matchedPairs, i];
                states.push({ stack: [...stack], charIdx: i, desc: '"' + c + '" → 닫는 괄호! pop "' + top + '" → 짝이 맞습니다 ✓', matchedPairs: [...matchedPairs] });
            }
        });
        states.push({ stack: [...stack], charIdx: -1, desc: '스택이 비어있으므로 유효한 괄호! → true ✓', matchedPairs: [...matchedPairs] });

        const steps = states.map(st => ({
            description: st.desc,
            action() {
                inputEl.innerHTML = chars.map((c, i) =>
                    '<div class="str-char-box' + (i === st.charIdx ? ' comparing' : (st.matchedPairs.includes(i) ? ' matched' : '')) + '" style="width:32px;text-align:center;font-size:1.2rem;">' + c + '</div>'
                ).join('');
                if (st.stack.length === 0) {
                    stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(비어있음)</div>';
                } else {
                    stackEl.innerHTML = st.stack.map((v, i) =>
                        '<div class="str-char-box' + (i === st.stack.length - 1 ? ' comparing' : '') + '" style="text-align:center;font-weight:600;font-size:1.2rem;">' + v + '</div>'
                    ).join('');
                }
            }
        }));
        self._initStepController(container, steps, '-paren');
    },

    // ── 카드2 (BOJ 2164) 시각화 ──
    _renderVizCard2(container) {
        const self = this;
        const N = 6;

        const vizHTML = '<div class="sim-card">' +
            '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div>' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);text-align:center;">큐 (앞 ← → 뒤)</div>' +
            '<div id="sq-queue-card" style="display:flex;gap:4px;justify-content:center;min-height:44px;align-items:center;"></div>' +
            '</div>' +
            '<div>버린 카드: <span id="sq-discarded-card" style="color:var(--red,#e17055);font-weight:600;"></span></div>' +
            '</div></div>';
        container.innerHTML = self._createStepDesc('-card') + vizHTML + self._createStepControls('-card');

        const queueEl = container.querySelector('#sq-queue-card');
        const discardedEl = container.querySelector('#sq-discarded-card');

        const states = [];
        let q = [];
        for (let i = 1; i <= N; i++) q.push(i);
        let discarded = [];
        states.push({ queue: [...q], discarded: [], desc: '카드 1~' + N + '이 위에서부터 순서대로 놓여있습니다.', highlightFront: false, highlightBack: false });

        while (q.length > 1) {
            const removed = q.shift();
            discarded = [...discarded, removed];
            states.push({ queue: [...q], discarded: [...discarded], desc: '맨 위 카드 ' + removed + '을(를) 버립니다.', highlightFront: true, highlightBack: false });
            if (q.length > 1) {
                const moved = q.shift();
                q.push(moved);
                states.push({ queue: [...q], discarded: [...discarded], desc: '다음 카드 ' + moved + '을(를) 맨 아래로 옮깁니다.', highlightFront: false, highlightBack: true });
            }
        }
        states.push({ queue: [...q], discarded: [...discarded], desc: '마지막 남은 카드는 ' + q[0] + '! 🎉', highlightFront: false, highlightBack: false });

        const steps = states.map(st => ({
            description: st.desc,
            action() {
                if (st.queue.length === 0) {
                    queueEl.innerHTML = '<div style="color:var(--text-secondary);">(비어있음)</div>';
                } else {
                    queueEl.innerHTML = st.queue.map((v, i) =>
                        '<div class="str-char-box' +
                        ((st.highlightFront && i === 0) ? ' comparing' : '') +
                        ((st.highlightBack && i === st.queue.length - 1) ? ' matched' : '') +
                        (st.queue.length === 1 ? ' matched' : '') +
                        '" style="width:40px;text-align:center;font-weight:600;">' + v +
                        (i === 0 ? '<div style="font-size:0.65rem;color:var(--text-secondary);">앞</div>' : '') +
                        (i === st.queue.length - 1 && st.queue.length > 1 ? '<div style="font-size:0.65rem;color:var(--text-secondary);">뒤</div>' : '') +
                        '</div>'
                    ).join('');
                }
                discardedEl.textContent = st.discarded.join(', ');
            }
        }));
        self._initStepController(container, steps, '-card');
    },

    // ── Min Stack (LeetCode 155) 시각화 ──
    _renderVizMinStack(container) {
        const self = this;
        const ops = [
            { op: 'push', val: -2 },
            { op: 'push', val: 0 },
            { op: 'push', val: -3 },
            { op: 'getMin', result: -3 },
            { op: 'pop' },
            { op: 'top', result: 0 },
            { op: 'getMin', result: -2 }
        ];

        const vizHTML = '<div class="sim-card">' +
            '<div style="display:flex;gap:30px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">메인 스택</div>' +
            '<div id="sq-main-ms" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:120px;width:80px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--green);">최솟값 스택</div>' +
            '<div id="sq-min-ms" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:120px;width:80px;border:2px solid var(--green);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="flex:0 0 auto;">' +
            '<div id="sq-result-ms" style="padding:10px;background:rgba(108,92,231,0.06);border-radius:8px;font-weight:600;color:var(--accent);min-height:30px;"></div>' +
            '</div></div></div>';
        container.innerHTML = self._createStepDesc('-ms') + vizHTML + self._createStepControls('-ms');

        const mainEl = container.querySelector('#sq-main-ms');
        const minEl = container.querySelector('#sq-min-ms');
        const resultEl = container.querySelector('#sq-result-ms');

        const states = [];
        let mainStack = [];
        let minStack = [];
        states.push({ main: [], min: [], desc: '두 개의 스택: 메인 스택과 최솟값 추적 스택을 준비합니다.', result: '' });

        ops.forEach(o => {
            if (o.op === 'push') {
                mainStack = [...mainStack, o.val];
                const curMin = minStack.length === 0 ? o.val : Math.min(o.val, minStack[minStack.length - 1]);
                minStack = [...minStack, curMin];
                states.push({ main: [...mainStack], min: [...minStack], desc: 'push(' + o.val + ') → 메인에 ' + o.val + ', 최솟값 스택에 min(' + o.val + ', ' + (minStack.length > 1 ? minStack[minStack.length - 2] : '∅') + ') = ' + curMin, result: '' });
            } else if (o.op === 'pop') {
                const popped = mainStack[mainStack.length - 1];
                mainStack = mainStack.slice(0, -1);
                minStack = minStack.slice(0, -1);
                states.push({ main: [...mainStack], min: [...minStack], desc: 'pop() → ' + popped + ' 제거. 두 스택 모두 pop!', result: '' });
            } else if (o.op === 'top') {
                states.push({ main: [...mainStack], min: [...minStack], desc: 'top() → 메인 스택 맨 위 값 확인', result: 'top() = ' + o.result });
            } else if (o.op === 'getMin') {
                states.push({ main: [...mainStack], min: [...minStack], desc: 'getMin() → 최솟값 스택 맨 위 = 현재 최솟값!', result: 'getMin() = ' + o.result });
            }
        });
        states.push({ main: [...mainStack], min: [...minStack], desc: '보조 스택 덕분에 getMin()이 항상 O(1)! 🎉', result: '' });

        function renderStack(el, arr) {
            if (arr.length === 0) {
                el.innerHTML = '<div style="color:var(--text-secondary);font-size:0.8rem;text-align:center;padding:20px 0;">(빈)</div>';
            } else {
                el.innerHTML = arr.map((v, i) =>
                    '<div class="str-char-box' + (i === arr.length - 1 ? ' comparing' : '') + '" style="text-align:center;font-weight:600;">' + v + '</div>'
                ).join('');
            }
        }

        const steps = states.map(st => ({
            description: st.desc,
            action() {
                renderStack(mainEl, st.main);
                renderStack(minEl, st.min);
                resultEl.textContent = st.result;
            }
        }));
        self._initStepController(container, steps, '-ms');
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
            simIntro: '0이 입력되면 가장 최근 수를 스택에서 pop하는 과정을 확인해보세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>나코더 기장 , , , 재현이는 , 동아리 회식을 준비하기 위해서 장부를 관리하는 중이다.</p>
                <p>재현이는 재민이에게 인건비를 계산하라고 시켰다. 재민이는 급여를 계산하는 중에,
                항상 정신없는 재현이는 <strong>수를 잘못 부르는 사고</strong>를 치기 일쑤이다.</p>
                <p>재현이는 잘못된 수를 부를 때마다 <strong>0을 외쳐서</strong>, 가장 최근에 쓴 수를 지우게 시킨다.</p>
                <p>재민이는 이렇게 모든 수를 받아 적은 후 <strong>그 수의 합</strong>을 알고 싶어 한다. 재민이를 도와주자.</p>

                <div class="problem-io">
                    <div>
                        <h4>입력</h4>
                        <p>첫째 줄에 정수 K가 주어진다. (1 &le; K &le; 100,000)</p>
                        <p>이후 K개의 줄에 정수가 하나씩 주어진다. 정수는 0에서 1,000,000 사이의 값을 가지며,
                        정수가 "0" 일 경우에는 가장 최근에 쓴 수를 지우고, 아닐 경우 해당 수를 쓴다.</p>
                        <p>정수가 "0"일 경우에 지울 수 있는 수가 있음을 보장할 수 있다.</p>
                    </div>
                    <div>
                        <h4>출력</h4>
                        <p>재민이가 최종적으로 적어 낸 수의 합을 출력한다. 합은 2<sup>31</sup>-1보다 작거나 같은 정수이다.</p>
                    </div>
                </div>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4\n3\n0\n4\n0</pre></div>
                    <div><strong>출력</strong><pre>0</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>10\n1\n3\n5\n4\n0\n0\n7\n0\n0\n6</pre></div>
                    <div><strong>출력</strong><pre>7</pre></div>
                </div></div>
            `,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: '재현이가 숫자를 부르면 적고, <strong>0을 부르면 "가장 최근에 적은 수를 지운다"</strong>는 규칙이에요.<br><br>예를 들어 3, 0이 들어오면? → 3을 적었다가 지움 (남은 건 없음)<br>1, 5, 0이 들어오면? → 1, 5를 적었다가 <strong>5를 지움</strong> (1만 남음)<br><br>핵심은 <strong>"가장 최근에"</strong>라는 부분이에요!' },
                { title: '리스트에 넣으면 되지 않을까?', content: '숫자가 들어오면 리스트에 <code>append</code>하고, 0이 나오면 마지막 걸 지우면 되겠죠?<br><br>그런데 "마지막에 넣은 걸 빼는" 이 연산… 뭔가 익숙하지 않나요?<br>리스트 끝에서만 넣고(<code>append</code>) 빼는(<code>pop</code>) 패턴이에요.' },
                { title: '그게 바로 스택이야!', content: '"가장 최근에 넣은 것을 빼는" 패턴 = <strong>LIFO</strong> = <strong>스택</strong>!<br><br>① 0이 아닌 수 → <code>stack.append(x)</code> (push)<br>② 0이면 → <code>stack.pop()</code><br>③ 마지막에 → <code>sum(stack)</code><br><br>문제 조건상 0일 때 스택이 비어있지 않음이 보장되므로, 별도 체크는 불필요해요!' },
                { title: '정리하면', content: '<code>for</code>문으로 K개의 수를 받으면서:<br>• 0이 아니면 → push<br>• 0이면 → pop<br><br>반복이 끝나면 스택에 남은 수들의 합이 정답!<br>시간 복잡도: <strong>O(K)</strong> — 각 연산이 O(1)이니까요.' }
            ],
            inputDefault: 0,
            solve() { return '0'; },
            solutions: [
                {
                    approach: '스택 활용',
                    description: '0이 나오면 pop, 아니면 push한 뒤 남은 합을 구합니다.',
                    timeComplexity: 'O(K)',
                    spaceComplexity: 'O(K)',
                    get templates() { return stackQueueTopic.problems[0].templates; },
                    codeSteps: {
                        python: [
                            { title: '입력 설정', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # 스택: 마지막에 넣은 걸 먼저 꺼냄 (LIFO)', desc: '왜 스택? → 0이 나오면 "가장 최근 수"를 지워야 하니까!\nLIFO(후입선출) 구조가 딱 맞습니다.' },
                            { title: '반복문', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # 스택: 마지막에 넣은 걸 먼저 꺼냄 (LIFO)\n\nfor _ in range(K):\n    n = int(input())  # 각 수를 하나씩 입력', desc: 'K번 반복하며 각 숫자를 입력받습니다.\n수가 0인지 아닌지에 따라 동작이 달라집니다.' },
                            { title: '조건 분기', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # 스택: 마지막에 넣은 걸 먼저 꺼냄 (LIFO)\n\nfor _ in range(K):\n    n = int(input())\n    if n == 0:          # 0 = "직전 수를 지워라!"\n        stack.pop()     # LIFO → 가장 최근 수가 빠짐\n    else:\n        stack.append(n) # 0이 아니면 일단 쌓아둔다', desc: '핵심 로직: 0이면 pop, 아니면 push!\npop()은 항상 가장 최근에 넣은 수를 제거합니다.\n→ 스택이라서 가능한 O(1) 연산!' },
                            { title: '결과 출력', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # 스택: 마지막에 넣은 걸 먼저 꺼냄 (LIFO)\n\nfor _ in range(K):\n    n = int(input())\n    if n == 0:          # 0 = "직전 수를 지워라!"\n        stack.pop()     # LIFO → 가장 최근 수가 빠짐\n    else:\n        stack.append(n) # 0이 아니면 일단 쌓아둔다\n\nprint(sum(stack))  # 지우기 끝난 뒤 남은 수들의 합', desc: '모든 0 처리가 끝난 뒤 스택에 남아있는 수들의 합!' }
                        ]
                    }
                }
            ],
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
            simIntro: '여는 괄호를 스택에 push하고, 닫는 괄호가 나오면 짝이 맞는지 확인하는 과정을 살펴보세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p><code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code>, <code>']'</code>
                로만 이루어진 문자열 <code>s</code>가 주어질 때, 입력 문자열이 유효한지 판별하세요.</p>
                <p>입력 문자열은 다음 조건을 모두 만족할 때 유효합니다:</p>
                <ol>
                    <li>여는 괄호는 <strong>같은 종류의 닫는 괄호</strong>로 닫혀야 합니다.</li>
                    <li>여는 괄호는 <strong>올바른 순서</strong>로 닫혀야 합니다.</li>
                    <li>모든 닫는 괄호에는 대응하는 <strong>같은 종류의 여는 괄호</strong>가 있어야 합니다.</li>
                </ol>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "()"</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "()[]{}"</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "(]"</pre></div>
                    <div><strong>Output</strong><pre>false</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 4</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "([])"</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div></div>

                <div class="problem-io">
                    <div>
                        <h4>Constraints</h4>
                        <ul>
                            <li>1 &le; s.length &le; 10<sup>4</sup></li>
                            <li><code>s</code>는 괄호 문자 <code>'()[]{}'</code>로만 이루어져 있습니다.</li>
                        </ul>
                    </div>
                </div>
            `,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: '<code>"()"</code> → 유효 ✓, <code>"()[]{}"</code> → 유효 ✓, <code>"(]"</code> → 유효하지 않음 ✗<br><br>규칙: 여는 괄호를 열었으면, <strong>같은 종류의 닫는 괄호</strong>로 닫아야 해요.<br>순서도 중요합니다! <code>"([)]"</code>은 왜 안 될까요? → 안쪽 괄호를 먼저 닫아야 해요.' },
                { title: '개수만 세면 되지 않을까?', content: '여는 괄호랑 닫는 괄호 <strong>개수가 같으면</strong> 유효한 거 아닐까요?<br><br><code>"(]"</code> → 여는 괄호 1개, 닫는 괄호 1개… 개수는 맞는데 유효하지 않아요!<br>개수만으로는 <strong>"종류"</strong>와 <strong>"순서"</strong>를 확인할 수 없습니다.' },
                { title: '"가장 최근에 연 괄호"랑 비교해야 해', content: '<code>"([{}])"</code>를 보면: <code>(</code> → <code>[</code> → <code>{</code> 순서로 열었으니,<br><code>}</code> → <code>]</code> → <code>)</code> 순서로 닫아야 해요.<br><br>"가장 최근에 연 괄호"를 빼서 비교… 이 패턴, 어디서 본 것 같지 않나요? → <strong>스택</strong>!<br>여는 괄호 → push, 닫는 괄호 → pop해서 짝이 맞나 확인하면 돼요.' },
                { title: '짝을 쉽게 비교하는 방법', content: '딕셔너리로 짝을 미리 저장해두면 편해요:<br><code>pairs = {")" : "(", "]" : "[", "}" : "{"}</code><br><br>닫는 괄호가 나오면 → 스택에서 pop한 값이 <code>pairs[닫는괄호]</code>와 같은지 확인!<br>같으면 매칭 성공, 다르면 False.' },
                { title: '놓치기 쉬운 예외 케이스', content: '① 닫는 괄호인데 <strong>스택이 비어있으면?</strong> → 짝이 없으므로 <code>False</code><br>② 끝까지 봤는데 <strong>스택에 남아있으면?</strong> → 안 닫힌 괄호가 있으므로 <code>False</code><br><br>이 두 가지만 잘 처리하면 완성이에요!' }
            ],
            inputDefault: 0,
            solve() { return 'true'; },
            solutions: [
                {
                    approach: '스택 기반 괄호 매칭',
                    description: '여는 괄호는 push, 닫는 괄호가 나오면 top과 비교하여 매칭합니다.',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    get templates() { return stackQueueTopic.problems[1].templates; },
                    codeSteps: {
                        python: [
                            { title: '초기 설정', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑', desc: '왜 딕셔너리? → 닫는 괄호가 나왔을 때 짝을 O(1)로 찾으려고!\npairs[")"] = "(" 이런 식으로 매핑합니다.' },
                            { title: '문자 순회', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑\n\n        for c in s:  # 한 글자씩 확인', desc: '문자열의 각 문자를 하나씩 확인합니다.\n여는 괄호인지 닫는 괄호인지에 따라 처리가 다릅니다.' },
                            { title: '여는 괄호 push', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)  # 나중에 짝을 확인할 때까지 보관', desc: '왜 push? → 여는 괄호는 아직 짝을 모르니까 일단 보관!\n나중에 닫는 괄호가 나올 때 꺼내서 비교합니다.' },
                            { title: '닫는 괄호 검증', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)  # 나중에 짝을 확인할 때까지 보관\n            elif c in \')]}\':\n                if not stack or stack[-1] != pairs[c]:  # 스택 비었거나 짝 불일치\n                    return False\n                stack.pop()  # 짝 맞으면 소비!', desc: '핵심: 닫는 괄호가 나오면 스택 top과 비교!\nnot stack → 짝 지을 여는 괄호가 없음 → 실패\nstack[-1] != pairs[c] → 가장 최근 여는 괄호와 짝이 안 맞음 → 실패' },
                            { title: '최종 판정', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)  # 나중에 짝을 확인할 때까지 보관\n            elif c in \')]}\':\n                if not stack or stack[-1] != pairs[c]:  # 스택 비었거나 짝 불일치\n                    return False\n                stack.pop()  # 짝 맞으면 소비!\n\n        return len(stack) == 0  # 남은 여는 괄호 있으면 실패!', desc: '왜 len(stack) == 0?\n→ 스택에 여는 괄호가 남아있으면 짝을 못 찾은 것!\n"(()" 같은 경우 스택에 "("가 남아있어서 False.' }
                        ]
                    }
                }
            ],
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
            simIntro: '큐에서 맨 위 카드를 버리고, 다음 카드를 맨 아래로 보내는 과정을 관찰해보세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N장의 카드가 있다. 각각의 카드는 차례로 1부터 N까지의 번호가 붙어 있으며,
                1번 카드가 제일 위에, N번 카드가 제일 아래인 상태로 순서대로 카드가 놓여 있다.</p>
                <p>이제 다음과 같은 동작을 카드가 한 장 남을 때까지 반복하게 된다.
                우선, 제일 위에 있는 카드를 <strong>바닥에 버린다</strong>.
                그 다음, 제일 위에 있는 카드를 <strong>제일 아래에 있는 카드 밑으로 옮긴다</strong>.</p>
                <p>예를 들어 N=4인 경우를 생각해 보자. 카드는 제일 위에서부터 1234 의 순서로 놓여있다.
                1을 버리면 234가 남는다. 여기서 2를 제일 아래로 옮기면 342가 된다.
                3을 버리면 42가 되고, 4를 밑으로 옮기면 24가 된다. 마지막으로 2를 버리면 남는 카드는 <strong>4</strong>가 된다.</p>
                <p>N이 주어졌을 때, 제일 마지막에 남게 되는 카드를 구하는 프로그램을 작성하시오.</p>

                <div class="problem-io">
                    <div>
                        <h4>입력</h4>
                        <p>첫째 줄에 정수 N(1 &le; N &le; 500,000)이 주어진다.</p>
                    </div>
                    <div>
                        <h4>출력</h4>
                        <p>첫째 줄에 남게 되는 카드의 번호를 출력한다.</p>
                    </div>
                </div>

                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
            `,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: 'N=4일 때 카드가 [1, 2, 3, 4]로 놓여있어요.<br>"<strong>맨 위를 버리고 → 그다음 맨 위를 맨 아래로</strong>" 반복!<br><br>1 버림 → 2를 아래로 → [3, 4, 2]<br>3 버림 → 4를 아래로 → [2, 4]<br>2 버림 → 답: <strong>4</strong><br><br>한쪽(위)에서 빼서 다른 쪽(아래)으로 넣는 패턴이에요!' },
                { title: '리스트로 해볼까?', content: '리스트 앞에서 빼기: <code>list.pop(0)</code><br>리스트 뒤에 넣기: <code>list.append()</code><br><br>이러면 동작은 하는데… <code>pop(0)</code>이 매번 뭘 하는지 생각해봐요.' },
                { title: 'pop(0)의 함정!', content: '<code>list.pop(0)</code>은 맨 앞을 빼면 <strong>나머지를 전부 한 칸씩 앞으로 당겨야</strong> 해요 → <strong>O(n)</strong><br><br>카드가 <strong>50만 장</strong>이면? 매번 O(n)씩 반복하면 총 O(n²) → <strong>시간 초과!</strong> 😱<br>"앞에서 빼는 게 빠른" 자료구조가 필요합니다.' },
                { title: '큐(deque)를 쓰면 해결!', content: '<code>collections.deque</code>의 <code>popleft()</code>는 <strong>O(1)</strong>!<br><br><code>popleft()</code>로 앞에서 빼고, <code>append()</code>로 뒤에 넣으면 돼요.<br>스택은 한쪽 끝만 사용하지만, 이 문제는 <strong>양쪽을 사용</strong> → 큐가 필요한 이유!' },
                { title: 'deque가 뭔데 이렇게 빠른 거야?', content: '<strong>deque</strong> = Double-Ended Queue (양쪽 끝 큐)<br>내부적으로 양쪽 끝 삽입/삭제가 <strong>O(1)</strong>이 되도록 설계된 자료구조예요.<br><br><code>from collections import deque</code>로 사용합니다.<br>리스트의 <code>pop(0)</code>이 O(n)인 반면, deque의 <code>popleft()</code>는 O(1)이라 <strong>큰 데이터에서 차이가 어마어마</strong>해요!' }
            ],
            inputDefault: 0,
            solve() { return '4'; },
            solutions: [
                {
                    approach: '큐(deque) 시뮬레이션',
                    description: '맨 앞 카드를 버리고, 다음 카드를 뒤로 보내는 과정을 반복합니다.',
                    timeComplexity: 'O(N)',
                    spaceComplexity: 'O(N)',
                    get templates() { return stackQueueTopic.problems[2].templates; },
                    codeSteps: {
                        python: [
                            { title: '초기 설정', code: 'from collections import deque  # 양쪽 끝 O(1) 삽입/삭제\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # 1~N 카드를 큐에 (앞=맨 위)', desc: '왜 deque? → 리스트의 pop(0)은 O(n)이지만 deque.popleft()는 O(1)!\n카드를 앞에서 빼는 연산이 핵심이라 deque가 필수입니다.' },
                            { title: '반복 조건', code: 'from collections import deque  # 양쪽 끝 O(1) 삽입/삭제\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # 1~N 카드를 큐에 (앞=맨 위)\n\nwhile len(q) > 1:  # 카드 1장 남을 때까지', desc: '카드가 1장 남으면 그게 정답!\n매 반복마다 카드가 1장씩 줄어듭니다 (버리기 때문).' },
                            { title: '카드 조작', code: 'from collections import deque  # 양쪽 끝 O(1) 삽입/삭제\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # 1~N 카드를 큐에 (앞=맨 위)\n\nwhile len(q) > 1:\n    q.popleft()            # ① 맨 위 카드 버리기 (O(1))\n    q.append(q.popleft())  # ② 다음 카드를 맨 아래로 이동', desc: '핵심 2단계:\n① popleft() → 맨 위 카드를 버림\n② popleft()로 꺼내서 append()로 맨 뒤에 → 맨 아래로 이동\n모두 O(1)이라 전체 O(N)!' },
                            { title: '결과 출력', code: 'from collections import deque  # 양쪽 끝 O(1) 삽입/삭제\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # 1~N 카드를 큐에 (앞=맨 위)\n\nwhile len(q) > 1:\n    q.popleft()            # ① 맨 위 카드 버리기 (O(1))\n    q.append(q.popleft())  # ② 다음 카드를 맨 아래로 이동\n\nprint(q[0])  # 마지막 남은 카드!', desc: '마지막 남은 한 장이 정답입니다.' }
                        ]
                    }
                }
            ],
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
            simIntro: '메인 스택과 최솟값 추적 보조 스택이 함께 동작하는 모습을 확인해보세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p><code>push</code>, <code>pop</code>, <code>top</code> 연산과 더불어
                <strong>상수 시간에 최솟값을 조회</strong>할 수 있는 스택을 설계하세요.</p>
                <p><code>MinStack</code> 클래스를 구현하세요:</p>
                <ul>
                    <li><code>MinStack()</code> — 스택 객체를 초기화합니다.</li>
                    <li><code>void push(int val)</code> — 원소 <code>val</code>을 스택에 push합니다.</li>
                    <li><code>void pop()</code> — 스택의 top 원소를 제거합니다.</li>
                    <li><code>int top()</code> — 스택의 top 원소를 반환합니다.</li>
                    <li><code>int getMin()</code> — 스택에서 <strong>최솟값</strong>을 반환합니다.</li>
                </ul>
                <p><strong>각 함수는 O(1) 시간 복잡도</strong>로 동작하는 풀이를 구현해야 합니다.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[], [-2], [0], [-3], [], [], [], []]</pre></div>
                    <div><strong>Output</strong><pre>[null, null, null, null, -3, null, 0, -2]</pre></div>
                </div>
                <div style="margin-top: 0.8rem; padding: 0.8rem 1rem; background: var(--bg); border-radius: 8px; font-size: 0.9rem;">
                    <strong>Explanation</strong><br>
                    <code>MinStack minStack = new MinStack();</code><br>
                    <code>minStack.push(-2);</code><br>
                    <code>minStack.push(0);</code><br>
                    <code>minStack.push(-3);</code><br>
                    <code>minStack.getMin();</code> → <strong>-3</strong> 반환<br>
                    <code>minStack.pop();</code><br>
                    <code>minStack.top();</code> → <strong>0</strong> 반환<br>
                    <code>minStack.getMin();</code> → <strong>-2</strong> 반환
                </div></div>

                <div class="problem-io">
                    <div>
                        <h4>Constraints</h4>
                        <ul>
                            <li>-2<sup>31</sup> &le; val &le; 2<sup>31</sup> - 1</li>
                            <li><code>pop</code>, <code>top</code>, <code>getMin</code> 연산은 항상 <strong>비어있지 않은 스택</strong>에서 호출됩니다.</li>
                            <li><code>push</code>, <code>pop</code>, <code>top</code>, <code>getMin</code>에 대해 최대 <strong>3 × 10<sup>4</sup></strong>회 호출됩니다.</li>
                        </ul>
                    </div>
                </div>
            `,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: '<code>push</code>, <code>pop</code>, <code>top</code>은 일반 스택이랑 똑같아요. 어려운 건 <strong>getMin()</strong>!<br><br><code>getMin()</code>이 항상 현재 스택에서 <strong>가장 작은 값을 O(1)에 반환</strong>해야 해요.<br>보통 최솟값을 찾으려면 전체를 봐야 하는데… O(1)이라고?' },
                { title: 'min 변수 하나면 되지 않을까?', content: '스택에 값을 넣을 때마다 <code>min_val = min(min_val, x)</code>로 갱신하면?<br><br><code>push(5)</code>, <code>push(2)</code>, <code>push(7)</code> → min_val = 2 ✓<br>근데 <code>pop()</code>으로 <strong>2를 빼면?</strong> min_val이 2인데 2는 이제 없잖아요!' },
                { title: 'pop하면 이전 최솟값을 어떻게 알지?', content: '2를 pop했으면 그 전의 최솟값(5)으로 <strong>돌아가야</strong> 해요.<br><br>"이전 상태로 돌아간다"… 뭔가 <strong>스택스러운</strong> 느낌이 들지 않나요?<br>각 시점의 최솟값을 "기억"해두면 어떨까요?' },
                { title: '보조 스택으로 각 시점의 최솟값 기억하기', content: '<strong>min_stack</strong>이라는 스택을 하나 더 만들자!<br><br><code>push(x)</code>할 때: min_stack에도 <code>min(x, 현재 min_stack의 top)</code>을 push<br><code>pop()</code>할 때: min_stack에서도 pop → 자동으로 이전 최솟값이 top!<br><code>getMin()</code>: min_stack의 top을 보면 끝 → <strong>O(1)!</strong>' },
                { title: '예시로 확인해보자', content: '<code>push(5)</code>: stack=[5], min_stack=[<strong>5</strong>]<br><code>push(2)</code>: stack=[5,2], min_stack=[5,<strong>2</strong>] ← min(2,5)=2<br><code>push(7)</code>: stack=[5,2,7], min_stack=[5,2,<strong>2</strong>] ← min(7,2)=2<br><br><code>pop()</code>: stack=[5,2], min_stack=[5,<strong>2</strong>] → getMin()=2 ✓<br><code>pop()</code>: stack=[5], min_stack=[<strong>5</strong>] → getMin()=5 ✓<br><br>2가 빠졌는데 자동으로 최솟값이 5로 복원돼요! 🎉' }
            ],
            inputDefault: 0,
            solve() { return '-3, 0, -2'; },
            solutions: [
                {
                    approach: '보조 스택으로 최솟값 추적',
                    description: '메인 스택과 별도로 최솟값 스택을 유지하여 O(1) getMin을 구현합니다.',
                    timeComplexity: 'O(1) per op',
                    spaceComplexity: 'O(n)',
                    get templates() { return stackQueueTopic.problems[3].templates; },
                    codeSteps: {
                        python: [
                            { title: '초기화', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # 메인 스택: 실제 데이터\n        self.min_stack = []  # 보조 스택: 각 시점의 최솟값 기록', desc: '왜 스택 2개? → getMin()을 O(1)로 하려면 "지금 최솟값이 뭔지" 항상 알아야!\nmin_stack의 top이 항상 현재 최솟값을 가리킵니다.' },
                            { title: 'push 구현', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # 메인 스택: 실제 데이터\n        self.min_stack = []  # 보조 스택: 각 시점의 최솟값 기록\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)              # 새로운 최솟값!\n        else:\n            self.min_stack.append(self.min_stack[-1])  # 최솟값 변동 없음 → 그대로 복사', desc: '핵심: push할 때 min_stack에도 항상 함께 push!\nval이 현재 최솟값 이하면 → val을 넣고\n아니면 → 기존 최솟값을 그대로 복사해서 넣음\n→ 두 스택의 높이가 항상 같다!' },
                            { title: 'pop 구현', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # 메인 스택: 실제 데이터\n        self.min_stack = []  # 보조 스택: 각 시점의 최솟값 기록\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n        else:\n            self.min_stack.append(self.min_stack[-1])\n\n    def pop(self) -> None:\n        self.stack.pop()      # 메인에서 제거\n        self.min_stack.pop()  # 보조도 같이 제거 → 높이 동기화!', desc: '왜 둘 다 pop?\n→ 두 스택 높이를 항상 동기화해야 하니까!\npop 후에도 min_stack[-1]이 정확한 최솟값을 가리킵니다.' },
                            { title: 'top과 getMin', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # 메인 스택: 실제 데이터\n        self.min_stack = []  # 보조 스택: 각 시점의 최솟값 기록\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n        else:\n            self.min_stack.append(self.min_stack[-1])\n\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()\n\n    def top(self) -> int:\n        return self.stack[-1]      # 메인 스택의 top\n\n    def getMin(self) -> int:\n        return self.min_stack[-1]  # 보조 스택의 top = 현재 최솟값! O(1)', desc: '모든 연산이 O(1)!\ntop() → stack[-1], getMin() → min_stack[-1]\n보조 스택 덕분에 최솟값을 매번 탐색할 필요가 없습니다.' }
                        ]
                    }
                }
            ],
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

    renderProblem(container) { container.innerHTML = ''; },

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
