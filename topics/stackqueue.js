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
        const s = suffix || '';
        return '<div class="str-step-controls" id="str-step-controls' + s + '" style="position:fixed;bottom:0;left:var(--sidebar-w,280px);right:0;background:var(--card);border-top:1px solid var(--border);padding:10px 20px;display:flex;align-items:center;justify-content:center;gap:12px;z-index:100;">' +
            '<button class="btn" id="str-prev' + s + '">◀ 이전</button>' +
            '<span id="str-indicator' + s + '" style="font-size:0.9rem;color:var(--text-secondary);min-width:60px;text-align:center;">0 / 0</span>' +
            '<button class="btn" id="str-next' + s + '">다음 ▶</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix) {
        const s = suffix || '';
        let current = -1;
        const indicator = container.querySelector('#str-indicator' + s);
        const prevBtn = container.querySelector('#str-prev' + s);
        const nextBtn = container.querySelector('#str-next' + s);
        if (!indicator || !prevBtn || !nextBtn) return;
        const total = steps.length;
        const go = (idx) => {
            if (idx < 0 || idx >= total) return;
            current = idx;
            steps[current].action();
            indicator.textContent = (current + 1) + ' / ' + total;
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === total - 1;
        };
        go(0);
        prevBtn.addEventListener('click', () => go(current - 1));
        nextBtn.addEventListener('click', () => go(current + 1));
        const keyHandler = (e) => {
            if (e.key === 'ArrowLeft') go(current - 1);
            if (e.key === 'ArrowRight') go(current + 1);
        };
        document.addEventListener('keydown', keyHandler);
        this._vizState.keydownHandler = keyHandler;
        this._vizState.steps = steps;
        this._vizState.currentStep = 0;
    },

    // ── 제로 (BOJ 10773) 시각화 ──
    _renderVizZero(container) {
        const self = this;
        const nums = [1, 3, 5, 4, 0, 0, 7, 0, 0, 6];
        const vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="flex:1;min-width:200px;max-width:320px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">입력 수열</div>' +
            '<div id="sq-input-zero" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">스택</div>' +
            '<div id="sq-stack-zero" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:200px;width:100px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="flex:1;min-width:180px;max-width:260px;">' +
            '<div id="sq-desc-zero" style="padding:14px;background:var(--bg-secondary);border-radius:8px;min-height:60px;font-size:0.95rem;margin-bottom:12px;"></div>' +
            '<div style="font-weight:600;color:var(--text-secondary);">sum = <span id="sq-sum-zero">0</span></div>' +
            '</div></div></div>';
        container.innerHTML = vizHTML + self._createStepControls('-zero');

        const inputEl = container.querySelector('#sq-input-zero');
        const stackEl = container.querySelector('#sq-stack-zero');
        const descEl = container.querySelector('#sq-desc-zero');
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
                descEl.textContent = st.desc;
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

        const vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">입력 문자열</div>' +
            '<div id="sq-input-paren" style="display:flex;gap:4px;"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">스택</div>' +
            '<div id="sq-stack-paren" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:200px;width:80px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="flex:1;min-width:180px;max-width:300px;">' +
            '<div id="sq-desc-paren" style="padding:14px;background:var(--bg-secondary);border-radius:8px;min-height:60px;font-size:0.95rem;"></div>' +
            '</div></div></div>';
        container.innerHTML = vizHTML + self._createStepControls('-paren');

        const inputEl = container.querySelector('#sq-input-paren');
        const stackEl = container.querySelector('#sq-stack-paren');
        const descEl = container.querySelector('#sq-desc-paren');

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
                descEl.textContent = st.desc;
            }
        }));
        self._initStepController(container, steps, '-paren');
    },

    // ── 카드2 (BOJ 2164) 시각화 ──
    _renderVizCard2(container) {
        const self = this;
        const N = 6;

        const vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div>' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);text-align:center;">큐 (앞 ← → 뒤)</div>' +
            '<div id="sq-queue-card" style="display:flex;gap:4px;justify-content:center;min-height:44px;align-items:center;"></div>' +
            '</div>' +
            '<div id="sq-desc-card" style="padding:14px;background:var(--bg-secondary);border-radius:8px;min-height:60px;font-size:0.95rem;max-width:500px;width:100%;text-align:center;"></div>' +
            '<div>버린 카드: <span id="sq-discarded-card" style="color:var(--red,#e17055);font-weight:600;"></span></div>' +
            '</div></div>';
        container.innerHTML = vizHTML + self._createStepControls('-card');

        const queueEl = container.querySelector('#sq-queue-card');
        const descEl = container.querySelector('#sq-desc-card');
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
                descEl.textContent = st.desc;
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

        const vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:30px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">메인 스택</div>' +
            '<div id="sq-main-ms" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:180px;width:80px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--green);">최솟값 스택</div>' +
            '<div id="sq-min-ms" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:180px;width:80px;border:2px solid var(--green);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="flex:1;min-width:200px;max-width:350px;">' +
            '<div id="sq-desc-ms" style="padding:14px;background:var(--bg-secondary);border-radius:8px;min-height:60px;font-size:0.95rem;margin-bottom:12px;"></div>' +
            '<div id="sq-result-ms" style="padding:10px;background:var(--accent)10;border-radius:8px;font-weight:600;color:var(--accent);min-height:30px;"></div>' +
            '</div></div></div>';
        container.innerHTML = vizHTML + self._createStepControls('-ms');

        const mainEl = container.querySelector('#sq-main-ms');
        const minEl = container.querySelector('#sq-min-ms');
        const descEl = container.querySelector('#sq-desc-ms');
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
            action() {
                renderStack(mainEl, st.main);
                renderStack(minEl, st.min);
                descEl.textContent = st.desc;
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
            solutions: [
                {
                    approach: '스택 활용',
                    description: '0이 나오면 pop, 아니면 push한 뒤 남은 합을 구합니다.',
                    timeComplexity: 'O(K)',
                    spaceComplexity: 'O(K)',
                    get templates() { return stackQueueTopic.problems[0].templates; },
                    codeSteps: {
                        python: [
                            { title: '입력 설정', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []', desc: 'K개의 수를 입력받을 준비와 빈 스택을 생성합니다.' },
                            { title: '반복문', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []\n\nfor _ in range(K):\n    n = int(input())', desc: 'K번 반복하며 각 숫자를 입력받습니다.' },
                            { title: '조건 분기', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []\n\nfor _ in range(K):\n    n = int(input())\n    if n == 0:\n        stack.pop()\n    else:\n        stack.append(n)', desc: '0이면 가장 최근 수를 제거(pop), 아니면 스택에 추가(push)합니다.' },
                            { title: '결과 출력', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []\n\nfor _ in range(K):\n    n = int(input())\n    if n == 0:\n        stack.pop()\n    else:\n        stack.append(n)\n\nprint(sum(stack))', desc: '스택에 남아있는 모든 수의 합을 출력합니다.' }
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
            solutions: [
                {
                    approach: '스택 기반 괄호 매칭',
                    description: '여는 괄호는 push, 닫는 괄호가 나오면 top과 비교하여 매칭합니다.',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    get templates() { return stackQueueTopic.problems[1].templates; },
                    codeSteps: {
                        python: [
                            { title: '초기 설정', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}', desc: '빈 스택과 닫는→여는 괄호 매핑 딕셔너리를 준비합니다.' },
                            { title: '문자 순회', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}\n\n        for c in s:', desc: '문자열의 각 문자를 하나씩 확인합니다.' },
                            { title: '여는 괄호 push', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)', desc: '여는 괄호 (, [, {를 만나면 스택에 push합니다.' },
                            { title: '닫는 괄호 검증', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)\n            elif c in \')]}\':\n                if not stack or stack[-1] != pairs[c]:\n                    return False\n                stack.pop()', desc: '닫는 괄호를 만나면 스택 top과 짝이 맞는지 확인합니다.' },
                            { title: '최종 판정', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)\n            elif c in \')]}\':\n                if not stack or stack[-1] != pairs[c]:\n                    return False\n                stack.pop()\n\n        return len(stack) == 0', desc: '모든 문자 확인 후 스택이 비어있으면 유효합니다!' }
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
            solutions: [
                {
                    approach: '큐(deque) 시뮬레이션',
                    description: '맨 앞 카드를 버리고, 다음 카드를 뒤로 보내는 과정을 반복합니다.',
                    timeComplexity: 'O(N)',
                    spaceComplexity: 'O(N)',
                    get templates() { return stackQueueTopic.problems[2].templates; },
                    codeSteps: {
                        python: [
                            { title: '초기 설정', code: 'from collections import deque\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))', desc: '1~N 카드를 deque에 넣어 큐를 만듭니다.' },
                            { title: '반복 조건', code: 'from collections import deque\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))\n\nwhile len(q) > 1:', desc: '카드가 1장 남을 때까지 반복합니다.' },
                            { title: '카드 조작', code: 'from collections import deque\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))\n\nwhile len(q) > 1:\n    q.popleft()          # 맨 위 카드 버리기\n    q.append(q.popleft()) # 다음 카드를 맨 아래로', desc: 'popleft()로 버리고, 다음 카드를 popleft() → append()로 맨 아래에 넣습니다.' },
                            { title: '결과 출력', code: 'from collections import deque\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))\n\nwhile len(q) > 1:\n    q.popleft()          # 맨 위 카드 버리기\n    q.append(q.popleft()) # 다음 카드를 맨 아래로\n\nprint(q[0])', desc: '마지막 남은 카드 번호를 출력합니다.' }
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
            solutions: [
                {
                    approach: '보조 스택으로 최솟값 추적',
                    description: '메인 스택과 별도로 최솟값 스택을 유지하여 O(1) getMin을 구현합니다.',
                    timeComplexity: 'O(1) per op',
                    spaceComplexity: 'O(n)',
                    get templates() { return stackQueueTopic.problems[3].templates; },
                    codeSteps: {
                        python: [
                            { title: '초기화', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []  # 보조 스택: 각 시점의 최솟값', desc: '메인 스택과 최솟값 추적용 보조 스택을 준비합니다.' },
                            { title: 'push 구현', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n        else:\n            self.min_stack.append(self.min_stack[-1])', desc: 'push할 때 min_stack에는 현재까지의 최솟값을 함께 push합니다.' },
                            { title: 'pop 구현', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n        else:\n            self.min_stack.append(self.min_stack[-1])\n\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()', desc: 'pop할 때 두 스택 모두 pop합니다.' },
                            { title: 'top과 getMin', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n        else:\n            self.min_stack.append(self.min_stack[-1])\n\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()\n\n    def top(self) -> int:\n        return self.stack[-1]\n\n    def getMin(self) -> int:\n        return self.min_stack[-1]', desc: 'top()은 메인 스택[-1], getMin()은 min_stack[-1]로 O(1)!' }
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
