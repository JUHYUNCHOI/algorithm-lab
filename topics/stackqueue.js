// =========================================================
// 스택과 큐 (Stack & Queue) 토픽 모듈
// =========================================================
const stackQueueTopic = {
    id: 'stackqueue',
    title: '스택과 큐',
    icon: '📦',
    category: '기초 (Bronze~Silver)',
    order: 3,
    description: 'LIFO 스택과 FIFO 큐의 원리, 괄호 검증, 덱 활용',
    relatedNote: '이 외에도 모노톤 스택, 후위 표기식 변환, 슬라이딩 윈도우 최대값(덱) 등이 스택/큐 문제에 자주 출제됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-10828': { type: '스택 구현',   color: '#00b894',      vizMethod: '_renderVizStackImpl' },
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
        const diffMap = { bronze: 'Bronze', gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
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
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';
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
                <h2>📦 스택과 큐 (Stack & Queue)</h2>
                <p class="hero-sub">데이터를 넣고 빼는 두 가지 규칙을 배워봅시다!</p>
            </div>

            <!-- 섹션 1: 스택 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 스택 (Stack)</div>
                <div class="analogy-box">
                    접시를 쌓는 걸 생각해 보세요! 접시를 위에 올리고, 꺼낼 때도 맨 위에서 꺼내잖아요?
                    맨 아래 접시를 먼저 꺼내려면 위에 있는 것을 전부 치워야 하죠.
                    그래서 <strong>마지막에 올린 접시가 가장 먼저 나와요</strong>. 이게 바로 스택이에요!
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
                        <p>접시를 맨 위에 올려요! <span class="lang-py">Python에서는 <code>append()</code></span><span class="lang-cpp">C++에서는 <code>push()</code></span>를 써요.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">pop</text></svg></div>
                        <h3>pop()</h3>
                        <p>맨 위 접시를 쏙 꺼내요! 접시가 하나도 없으면 꺼낼 수 없으니 에러가 나요. 꺼내는 건 한 번이면 돼요.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">peek</text></svg></div>
                        <h3>peek / top</h3>
                        <p>맨 위에 뭐가 있는지 살짝 들여다봐요. 꺼내는 건 아니에요! <span class="lang-py">Python: <code>stack[-1]</code></span><span class="lang-cpp">C++: <code>stk.top()</code></span></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">LIFO</text></svg></div>
                        <h3>활용 예시</h3>
                        <p>괄호가 짝이 맞는지 확인하기, 웹 브라우저의 뒤로가기 버튼, 미로에서 한 길을 끝까지 가보는 탐색 같은 곳에서 써요!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 스택 기본 사용 (Python은 리스트가 스택!)
stack = []
stack.append(1)   # push → [1]
stack.append(2)   # push → [1, 2]
stack.append(3)   # push → [1, 2, 3]
top = stack[-1]   # peek → 3
val = stack.pop() # pop  → 3, stack = [1, 2]
print(len(stack)) # size → 2</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;stack&gt;
using namespace std;

stack&lt;int&gt; stk;
stk.push(1);          // push → {1}
stk.push(2);          // push → {1, 2}
stk.push(3);          // push → {1, 2, 3}
int top = stk.top();  // peek → 3
stk.pop();            // pop  → {1, 2}
cout &lt;&lt; stk.size();   // size → 2</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: 리스트를 스택으로 사용하기 ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/stack" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: stack ↗</a></span>
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
                    편의점에서 줄을 서면 <strong>먼저 온 사람이 먼저 계산</strong>하잖아요?
                    새로 온 사람은 맨 뒤에 서고, 맨 앞 사람부터 나가요.
                    이게 바로 큐예요! 순서를 지키는 착한 줄 서기라고 생각하면 돼요.
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
                        <p>줄 맨 뒤에 서는 거예요! <span class="lang-py"><code>append()</code></span><span class="lang-cpp"><code>push()</code></span>로 넣어요.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--red, #e17055)">dequeue</text></svg></div>
                        <h3>dequeue()</h3>
                        <p>줄 맨 앞 사람이 나가는 거예요! <span class="lang-py"><code>deque</code>의 <code>popleft()</code></span><span class="lang-cpp"><code>queue</code>의 <code>front()</code> + <code>pop()</code></span>으로 꺼내요.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">FIFO</text></svg></div>
                        <h3>활용 예시</h3>
                        <p>가까운 곳부터 차례대로 탐색하기, 프린터에서 먼저 보낸 문서 먼저 출력하기 같은 곳에서 써요!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python">from collections import deque

q = deque()
q.append(1)     # enqueue → [1]
q.append(2)     # enqueue → [1, 2]
q.append(3)     # enqueue → [1, 2, 3]
val = q.popleft()  # dequeue → 1, q = [2, 3]
front = q[0]       # peek   → 2

# ⚠️ list의 pop(0)은 O(n)이라 느립니다!
# deque의 popleft()는 O(1)이므로 반드시 deque를 쓰세요.</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;queue&gt;
using namespace std;

queue&lt;int&gt; q;
q.push(1);           // enqueue → {1}
q.push(2);           // enqueue → {1, 2}
q.push(3);           // enqueue → {1, 2, 3}
int val = q.front(); // peek   → 1
q.pop();             // dequeue → {2, 3}
int f = q.front();   // peek   → 2

// C++ queue는 front()로 확인, pop()으로 제거
// front()+pop() 모두 O(1) 연산입니다.</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: queue ↗</a></span>
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> <span class="lang-py">Python에서 <code>list.pop(0)</code>이 느린 이유는?
                    맨 앞 원소를 빼면 나머지 원소를 한 칸씩 앞으로 밀어야 하기 때문입니다 → O(n)!</span><span class="lang-cpp">큐에서 <code>front()</code>와 <code>pop()</code>이 분리된 이유는?
                    예외 안전성(exception safety) 때문입니다 — 값 반환과 제거를 분리해야 안전합니다!</span>
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
                        <p><span class="lang-py"><code>appendleft(x)</code>: 앞에 추가, <code>append(x)</code>: 뒤에 추가.</span><span class="lang-cpp"><code>push_front(x)</code>: 앞에 추가, <code>push_back(x)</code>: 뒤에 추가.</span> 모두 O(1)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--red, #e17055)">←pop→</text></svg></div>
                        <h3>양방향 삭제</h3>
                        <p><span class="lang-py"><code>popleft()</code>: 앞에서 제거, <code>pop()</code>: 뒤에서 제거.</span><span class="lang-cpp"><code>pop_front()</code>: 앞에서 제거, <code>pop_back()</code>: 뒤에서 제거.</span> 모두 O(1)!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;deque&gt;
using namespace std;

deque&lt;int&gt; dq = {1, 2, 3};
dq.push_front(0);  // {0, 1, 2, 3}
dq.push_back(4);   // {0, 1, 2, 3, 4}
dq.pop_front();    // 0 제거, dq = {1, 2, 3, 4}
dq.pop_back();     // 4 제거, dq = {1, 2, 3}

// 덱은 슬라이딩 윈도우 최대/최소에도 활용!
// C++에서는 크기 제한을 직접 관리합니다.
deque&lt;int&gt; dq2;
dq2.push_back(1); dq2.push_back(2); dq2.push_back(3);
dq2.push_back(4);
if (dq2.size() > 3) dq2.pop_front();
// dq2 = {2, 3, 4} ← 1이 수동으로 빠짐!</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: collections.deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: deque ↗</a></span>
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> "스택을 구현하세요"라는 문제가 나오면?
                    <span class="lang-py">Python에서는 그냥 리스트를 쓰면 됩니다! <code>append()</code>와 <code>pop()</code>이 O(1)이니까요.
                    큐를 구현할 때만 <code>deque</code>를 쓰면 됩니다.</span><span class="lang-cpp">C++에서는 <code>stack&lt;int&gt;</code>를 쓰면 됩니다! <code>push()</code>와 <code>pop()</code>이 O(1)이니까요.
                    큐를 구현할 때는 <code>queue&lt;int&gt;</code>, 덱은 <code>deque&lt;int&gt;</code>를 쓰면 됩니다.</span>
                </div>
            </div>

            <!-- 섹션 3.5: 스택 vs 큐 vs 덱 비교 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3.5</span> 스택 vs 큐 vs 덱 — 뭐가 다를까?</div>
                <p style="margin-bottom:1.2rem;line-height:1.75;">세 자료구조 모두 <strong>데이터를 넣고 빼는</strong> 역할을 합니다. 하지만 <em>어디에서 넣고 빼는지</em>가 다릅니다. 아래 표를 보면 한눈에 비교할 수 있습니다.</p>
                <div style="overflow-x:auto;margin-bottom:1.5rem;">
                    <table style="width:100%;border-collapse:collapse;font-size:0.9rem;line-height:1.75;">
                        <thead>
                            <tr style="background:var(--bg2);border-bottom:2px solid var(--accent);">
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">자료구조</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">삽입 위치</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">삭제 위치</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">시간복잡도</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">대표 활용</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">구현</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid var(--bg3);">
                                <td style="padding:12px 16px;font-weight:600;">스택 (Stack)</td>
                                <td style="padding:12px 16px;">뒤(top)</td>
                                <td style="padding:12px 16px;">뒤(top)</td>
                                <td style="padding:12px 16px;"><code>O(1)</code> push/pop</td>
                                <td style="padding:12px 16px;">괄호 검증, DFS, 뒤로가기</td>
                                <td style="padding:12px 16px;"><span class="lang-py"><code>list</code> (append/pop)</span><span class="lang-cpp"><code>stack&lt;T&gt;</code></span></td>
                            </tr>
                            <tr style="border-bottom:1px solid var(--bg3);">
                                <td style="padding:12px 16px;font-weight:600;">큐 (Queue)</td>
                                <td style="padding:12px 16px;">뒤(back)</td>
                                <td style="padding:12px 16px;">앞(front)</td>
                                <td style="padding:12px 16px;"><code>O(1)</code> enqueue/dequeue</td>
                                <td style="padding:12px 16px;">BFS, 프린터 큐, 스케줄링</td>
                                <td style="padding:12px 16px;"><span class="lang-py"><code>collections.deque</code></span><span class="lang-cpp"><code>queue&lt;T&gt;</code></span></td>
                            </tr>
                            <tr>
                                <td style="padding:12px 16px;font-weight:600;">덱 (Deque)</td>
                                <td style="padding:12px 16px;">앞 + 뒤 모두</td>
                                <td style="padding:12px 16px;">앞 + 뒤 모두</td>
                                <td style="padding:12px 16px;"><code>O(1)</code> 양쪽 모두</td>
                                <td style="padding:12px 16px;">슬라이딩 윈도우, 스택+큐 겸용</td>
                                <td style="padding:12px 16px;"><span class="lang-py"><code>collections.deque</code></span><span class="lang-cpp"><code>deque&lt;T&gt;</code></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="think-box">
                    <strong>핵심 차이:</strong>
                    <ul style="margin:0.5rem 0 0 1.2rem;line-height:1.75;">
                        <li><strong>스택</strong>은 한쪽(top)에서만 넣고 뺍니다 → <strong>LIFO</strong></li>
                        <li><strong>큐</strong>는 뒤에서 넣고 앞에서 뺍니다 → <strong>FIFO</strong></li>
                        <li><strong>덱</strong>은 양쪽 모두에서 넣고 뺄 수 있습니다 → 스택과 큐를 모두 대체 가능!</li>
                    </ul>
                    <p style="margin-top:0.8rem;"><span class="lang-py">Python에서는 <code>collections.deque</code> 하나로 스택, 큐, 덱을 모두 구현할 수 있습니다. 스택만 필요하면 리스트도 OK!</span><span class="lang-cpp">C++에서는 용도에 맞는 컨테이너를 선택하세요: <code>stack</code>, <code>queue</code>, <code>deque</code>가 각각 제공됩니다.</span></p>
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
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;stack&gt;
#include &lt;string&gt;
#include &lt;unordered_map&gt;
using namespace std;

bool isValid(string s) {
    stack&lt;char&gt; stk;
    unordered_map&lt;char, char&gt; pairs = {
        {')', '('}, {']', '['}, {'}', '{'}
    };

    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            stk.push(c);        // 여는 괄호 → push
        } else if (pairs.count(c)) {
            if (stk.empty() || stk.top() != pairs[c])
                return false;    // 짝이 안 맞음!
            stk.pop();           // 짝이 맞으면 pop
        }
    }
    return stk.empty();  // 남은 괄호가 없어야 함
}

// isValid("([{}])") → true
// isValid("([)]")   → false</code></pre>
                </div></span>
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
                desc.innerHTML = '<span>' + state.steps[idx].description + '</span>';
            }
        };
        var actionDelay = 350;
        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            updateUI();
            setTimeout(() => { state.steps[state.currentStep].action('forward'); }, actionDelay);
        });
        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            var stepToUndo = state.currentStep;
            state.currentStep--;
            updateUI();
            setTimeout(() => {
                if (stepToUndo > 0 && state.currentStep >= 0) {
                    state.steps[state.currentStep].action('backward');
                } else if (resetAction) {
                    resetAction();
                }
            }, actionDelay);
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
    // ── 스택 구현 (BOJ 10828) 시각화 ──
    _renderVizStackImpl(container) {
        const self = this;
        var DEFAULT_CMDS = 'push 1\npush 2\ntop\nsize\npop\npush 3\nempty';

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">명령어 입력:<br><textarea id="sq-impl-input" style="padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:220px;height:120px;font-family:monospace;resize:vertical;">' + DEFAULT_CMDS + '</textarea></label>' +
            '<button class="btn btn-primary" id="sq-impl-reset" style="margin-top:22px;">🔄</button>' +
            '</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-impl-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">스택</div>' +
            '<div id="sq-stack-impl" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:100px;width:110px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="flex:0 0 auto;min-width:160px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">출력</div>' +
            '<div id="sq-output-impl" style="font-family:monospace;font-size:0.95rem;line-height:1.8;color:var(--text);min-height:40px;"></div>' +
            '</div></div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-impl') + vizHTML + self._createStepControls('-impl');

        var stackEl = container.querySelector('#sq-stack-impl');
        var outputEl = container.querySelector('#sq-output-impl');
        var flyEl = container.querySelector('#sq-impl-fly');
        var wrapEl = flyEl.parentElement;

        function parseCmds() {
            var raw = container.querySelector('#sq-impl-input').value;
            return raw.split('\n').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
        }

        function renderStack(arr, hideIdx) {
            if (arr.length === 0) {
                stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(비어있음)</div>';
            } else {
                stackEl.innerHTML = arr.map(function(v, i) {
                    var hide = (i === hideIdx) ? 'opacity:0;' : '';
                    var isTip = (i === arr.length - 1);
                    return '<div class="str-char-box' + (isTip ? ' comparing' : '') + '" id="sq-impl-stk-' + i + '" style="text-align:center;font-weight:600;' + hide + '">' + v + (isTip ? ' \u2190top' : '') + '</div>';
                }).join('');
            }
        }

        function renderOutput(lines) {
            outputEl.innerHTML = lines.map(function(l, i) {
                return '<div' + (i === lines.length - 1 ? ' style="color:var(--accent);font-weight:700;"' : '') + '>' + l + '</div>';
            }).join('');
        }

        function animatePush(value, afterArr, onDone) {
            renderStack(afterArr, afterArr.length - 1);
            var dstEl = stackEl.querySelector('#sq-impl-stk-' + (afterArr.length - 1));
            if (!dstEl) { renderStack(afterArr); if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var dr = dstEl.getBoundingClientRect();
            var ghost = document.createElement('div');
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + dr.width + 'px;height:' + dr.height + 'px;' +
                'left:' + (dr.left - wr.left) + 'px;top:' + (dr.top - wr.top - 60) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--accent);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);opacity:0;' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.3s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (dr.top - wr.top) + 'px';
                ghost.style.opacity = '1';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                renderStack(afterArr);
                if (onDone) onDone();
            }, 550);
        }

        function animatePop(beforeArr, onDone) {
            renderStack(beforeArr);
            var topEl = stackEl.querySelector('#sq-impl-stk-' + (beforeArr.length - 1));
            if (!topEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = topEl.getBoundingClientRect();
            topEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeArr[beforeArr.length - 1];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--red,#e17055);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (sr.top - wr.top - 60) + 'px';
                ghost.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function buildImplSteps(cmds) {
            var stepData = [];
            var stack = [];
            var outputs = [];
            stepData.push({ arr: [], outputs: [], cmd: '', desc: '스택 명령어를 하나씩 처리합니다. push, pop, size, empty, top 5가지 명령어가 있습니다.', pushVal: null, isPop: false });

            cmds.forEach(function(cmd) {
                var parts = cmd.split(/\s+/);
                var op = parts[0];
                if (op === 'push') {
                    var val = parseInt(parts[1], 10);
                    stack = [].concat(stack, [val]);
                    stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>push ' + val + '</strong> \u2014 ' + val + '을(를) 스택에 넣습니다. 출력 없음.', pushVal: val, isPop: false });
                } else if (op === 'pop') {
                    if (stack.length === 0) {
                        outputs = [].concat(outputs, ['-1']);
                        stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>pop</strong> \u2014 스택이 비어있으므로 <span style="color:var(--red);font-weight:700;">-1</span>을 출력합니다.', pushVal: null, isPop: false });
                    } else {
                        var popped = stack[stack.length - 1];
                        var before = [].concat(stack);
                        stack = stack.slice(0, -1);
                        outputs = [].concat(outputs, [String(popped)]);
                        stepData.push({ arr: [].concat(stack), beforeArr: before, outputs: [].concat(outputs), cmd: cmd, desc: '<strong>pop</strong> \u2014 꼭대기 값 <span style="color:var(--red);font-weight:700;">' + popped + '</span>을 출력하고 제거합니다.', pushVal: null, isPop: true });
                    }
                } else if (op === 'size') {
                    outputs = [].concat(outputs, [String(stack.length)]);
                    stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>size</strong> \u2014 현재 스택에 ' + stack.length + '개의 원소가 있으므로 <span style="color:var(--accent);font-weight:700;">' + stack.length + '</span>을 출력합니다.', pushVal: null, isPop: false });
                } else if (op === 'empty') {
                    var res = stack.length === 0 ? '1' : '0';
                    outputs = [].concat(outputs, [res]);
                    stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>empty</strong> \u2014 스택이 ' + (stack.length === 0 ? '비어있으므로' : '비어있지 않으므로') + ' <span style="color:var(--accent);font-weight:700;">' + res + '</span>을 출력합니다.', pushVal: null, isPop: false });
                } else if (op === 'top') {
                    if (stack.length === 0) {
                        outputs = [].concat(outputs, ['-1']);
                        stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>top</strong> \u2014 스택이 비어있으므로 <span style="color:var(--red);font-weight:700;">-1</span>을 출력합니다.', pushVal: null, isPop: false });
                    } else {
                        var topVal = stack[stack.length - 1];
                        outputs = [].concat(outputs, [String(topVal)]);
                        stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>top</strong> \u2014 꼭대기 값은 <span style="color:var(--green);font-weight:700;">' + topVal + '</span>입니다. 제거하지 않고 출력만 합니다.', pushVal: null, isPop: false });
                    }
                }
            });
            stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: '', desc: '모든 명령어 처리 완료! 출력 결과: <strong>' + outputs.join(', ') + '</strong>', pushVal: null, isPop: false });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderOutput(st.outputs);
                        if (dir === 'forward' && st.pushVal !== null) {
                            animatePush(st.pushVal, st.arr, null);
                        } else if (dir === 'forward' && st.isPop && st.beforeArr) {
                            animatePop(st.beforeArr, function() { renderStack(st.arr); });
                        } else {
                            renderStack(st.arr);
                        }
                    }
                };
            });
        }

        function resetImplViz() {
            var cmds = parseCmds();
            if (cmds.length === 0) return;
            flyEl.innerHTML = '';
            stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(비어있음)</div>';
            outputEl.innerHTML = '';
            var steps = buildImplSteps(cmds);
            self._initStepController(container, steps, '-impl');
        }

        container.querySelector('#sq-impl-reset').addEventListener('click', resetImplViz);
        resetImplViz();
    },

    _renderVizZero(container) {
        const self = this;
        var DEFAULT_ZERO_NUMS = '1, 3, 5, 4, 0, 0, 7, 0, 0, 6';

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">입력 수열: <input type="text" id="sq-zero-input" value="' + DEFAULT_ZERO_NUMS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="sq-zero-reset">🔄</button>' +
            '</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-zero-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
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
            '</div></div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-zero') + vizHTML + self._createStepControls('-zero');

        var inputEl = container.querySelector('#sq-input-zero');
        var stackEl = container.querySelector('#sq-stack-zero');
        var sumEl = container.querySelector('#sq-sum-zero');
        var flyEl = container.querySelector('#sq-zero-fly');
        var wrapEl = flyEl.parentElement;

        function parseZeroInput() {
            var raw = container.querySelector('#sq-zero-input').value;
            return raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
        }

        function renderInput(nums, highlightIdx, allDone) {
            inputEl.innerHTML = nums.map(function(n, i) {
                var cls = 'str-char-box';
                if (i === highlightIdx) cls += ' comparing';
                else if (i < highlightIdx || allDone) cls += ' matched';
                return '<div class="' + cls + '" id="sq-zero-inp-' + i + '" style="width:32px;text-align:center;">' + n + '</div>';
            }).join('');
        }

        function renderStack(arr, hideIdx) {
            if (arr.length === 0) {
                stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(비어있음)</div>';
            } else {
                stackEl.innerHTML = arr.map(function(v, i) {
                    var hide = (i === hideIdx) ? 'opacity:0;' : '';
                    return '<div class="str-char-box' + (i === arr.length - 1 ? ' comparing' : '') + '" id="sq-zero-stk-' + i + '" style="text-align:center;font-weight:600;' + hide + '">' + v + (i === arr.length - 1 ? ' \u2190top' : '') + '</div>';
                }).join('');
            }
        }

        function animatePush(inputIdx, value, afterArr, onDone) {
            renderStack(afterArr, afterArr.length - 1);
            var srcEl = inputEl.querySelector('#sq-zero-inp-' + inputIdx);
            var dstEl = stackEl.querySelector('#sq-zero-stk-' + (afterArr.length - 1));
            if (!srcEl || !dstEl) { renderStack(afterArr); if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = srcEl.getBoundingClientRect();
            var dr = dstEl.getBoundingClientRect();
            var ghost = document.createElement('div');
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--accent);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.left = (dr.left - wr.left) + 'px';
                ghost.style.top = (dr.top - wr.top) + 'px';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                renderStack(afterArr);
                if (onDone) onDone();
            }, 550);
        }

        function animatePop(beforeArr, onDone) {
            renderStack(beforeArr);
            var topEl = stackEl.querySelector('#sq-zero-stk-' + (beforeArr.length - 1));
            if (!topEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = topEl.getBoundingClientRect();
            topEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeArr[beforeArr.length - 1];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--red,#e17055);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (sr.top - wr.top - 60) + 'px';
                ghost.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function buildZeroSteps(nums) {
            var stepData = [];
            var stack = [];
            stepData.push({ arr: [], beforeArr: null, highlight: -1, desc: '스택으로 수를 관리합니다. 0이 입력되면 가장 최근 수를 pop합니다.', pushInfo: null, popInfo: null });

            nums.forEach(function(n, i) {
                if (n === 0) {
                    var popped = stack[stack.length - 1];
                    var before = [].concat(stack);
                    stack = stack.slice(0, -1);
                    stepData.push({ arr: [].concat(stack), beforeArr: before, highlight: i, desc: '입력: 0 → pop() → ' + popped + ' 제거! 스택: [' + stack.join(', ') + ']', pushInfo: null, popInfo: { value: popped, inputIdx: i } });
                } else {
                    var before = [].concat(stack);
                    stack = [].concat(stack, [n]);
                    stepData.push({ arr: [].concat(stack), beforeArr: before, highlight: i, desc: 'push(' + n + ') → 스택: [' + stack.join(', ') + ']', pushInfo: { value: n, inputIdx: i }, popInfo: null });
                }
            });
            var finalSum = stack.reduce(function(a, b) { return a + b; }, 0);
            stepData.push({ arr: [].concat(stack), beforeArr: null, highlight: -1, desc: '완료! 남은 수의 합 = ' + finalSum, pushInfo: null, popInfo: null });

            return stepData.map(function(st, idx) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderInput(nums, st.highlight, st.highlight === -1 && idx === stepData.length - 1);
                        sumEl.textContent = st.arr.reduce(function(a, b) { return a + b; }, 0);
                        if (dir === 'forward' && st.pushInfo) {
                            animatePush(st.pushInfo.inputIdx, st.pushInfo.value, st.arr, null);
                        } else if (dir === 'forward' && st.popInfo) {
                            animatePop(st.beforeArr, function() { renderStack(st.arr); });
                        } else {
                            renderStack(st.arr);
                        }
                    }
                };
            });
        }

        function resetZeroViz() {
            var nums = parseZeroInput();
            if (nums.length === 0) return;
            flyEl.innerHTML = '';
            inputEl.innerHTML = '';
            stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(비어있음)</div>';
            sumEl.textContent = '0';
            var steps = buildZeroSteps(nums);
            self._initStepController(container, steps, '-zero');
        }

        container.querySelector('#sq-zero-reset').addEventListener('click', resetZeroViz);
        resetZeroViz();
    },

    // ── Valid Parentheses (LeetCode 20) 시각화 ──
    _renderVizParentheses(container) {
        const self = this;
        var DEFAULT_PAREN_STR = '([{}])';

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">괄호 문자열: <input type="text" id="sq-paren-input" value="' + DEFAULT_PAREN_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<button class="btn btn-primary" id="sq-paren-reset">🔄</button>' +
            '</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-paren-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">입력 문자열</div>' +
            '<div id="sq-input-paren" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">스택</div>' +
            '<div id="sq-stack-paren" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:80px;width:80px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div></div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-paren') + vizHTML + self._createStepControls('-paren');

        var inputEl = container.querySelector('#sq-input-paren');
        var stackEl = container.querySelector('#sq-stack-paren');
        var flyEl = container.querySelector('#sq-paren-fly');
        var wrapEl = flyEl.parentElement;

        function parseParenInput() {
            var raw = container.querySelector('#sq-paren-input').value;
            return raw.replace(/[^()\[\]{}]/g, '').split('');
        }

        function renderInput(chars, highlightIdx, matchedPairs) {
            inputEl.innerHTML = chars.map(function(c, i) {
                var cls = 'str-char-box';
                if (i === highlightIdx) cls += ' comparing';
                else if (matchedPairs.indexOf(i) >= 0) cls += ' matched';
                return '<div class="' + cls + '" id="sq-paren-inp-' + i + '" style="width:32px;text-align:center;font-size:1.2rem;">' + c + '</div>';
            }).join('');
        }

        function renderStack(arr, hideIdx) {
            if (arr.length === 0) {
                stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(비어있음)</div>';
            } else {
                stackEl.innerHTML = arr.map(function(v, i) {
                    var hide = (i === hideIdx) ? 'opacity:0;' : '';
                    return '<div class="str-char-box' + (i === arr.length - 1 ? ' comparing' : '') + '" id="sq-paren-stk-' + i + '" style="text-align:center;font-weight:600;font-size:1.2rem;' + hide + '">' + v + '</div>';
                }).join('');
            }
        }

        function animatePush(charIdx, value, afterStack, onDone) {
            renderStack(afterStack, afterStack.length - 1);
            var srcEl = inputEl.querySelector('#sq-paren-inp-' + charIdx);
            var dstEl = stackEl.querySelector('#sq-paren-stk-' + (afterStack.length - 1));
            if (!srcEl || !dstEl) { renderStack(afterStack); if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = srcEl.getBoundingClientRect();
            var dr = dstEl.getBoundingClientRect();
            var ghost = document.createElement('div');
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;' +
                'background:var(--accent);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.left = (dr.left - wr.left) + 'px';
                ghost.style.top = (dr.top - wr.top) + 'px';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                renderStack(afterStack);
                if (onDone) onDone();
            }, 550);
        }

        function animatePop(beforeStack, onDone) {
            renderStack(beforeStack);
            var topEl = stackEl.querySelector('#sq-paren-stk-' + (beforeStack.length - 1));
            if (!topEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = topEl.getBoundingClientRect();
            topEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeStack[beforeStack.length - 1];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;' +
                'background:var(--green);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (sr.top - wr.top - 60) + 'px';
                ghost.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function buildParenSteps(chars) {
            var pairs = { ')': '(', ']': '[', '}': '{' };
            var stepData = [];
            var stack = [];
            var matchedPairs = [];
            var failed = false;
            stepData.push({ arr: [], beforeArr: null, charIdx: -1, desc: '문자열의 각 문자를 순서대로 확인합니다.', matchedPairs: [], pushInfo: null, popInfo: null });

            for (var i = 0; i < chars.length; i++) {
                var c = chars[i];
                if ('([{'.indexOf(c) >= 0) {
                    var before = [].concat(stack);
                    stack = [].concat(stack, [c]);
                    stepData.push({ arr: [].concat(stack), beforeArr: before, charIdx: i, desc: '"' + c + '" \u2192 여는 괄호! 스택에 push합니다.', matchedPairs: [].concat(matchedPairs), pushInfo: { value: c, charIdx: i }, popInfo: null });
                } else if (')]}'.indexOf(c) >= 0) {
                    if (stack.length === 0 || stack[stack.length - 1] !== pairs[c]) {
                        var topVal = stack.length > 0 ? stack[stack.length - 1] : '없음';
                        stepData.push({ arr: [].concat(stack), beforeArr: [].concat(stack), charIdx: i, desc: '"' + c + '" \u2192 닫는 괄호! 스택 top "' + topVal + '" \u2192 짝이 안 맞습니다 \u2717 \u2192 false', matchedPairs: [].concat(matchedPairs), pushInfo: null, popInfo: null });
                        failed = true;
                        break;
                    }
                    var top = stack[stack.length - 1];
                    var before = [].concat(stack);
                    stack = stack.slice(0, -1);
                    matchedPairs = [].concat(matchedPairs, [i]);
                    stepData.push({ arr: [].concat(stack), beforeArr: before, charIdx: i, desc: '"' + c + '" \u2192 닫는 괄호! pop "' + top + '" \u2192 짝이 맞습니다 \u2713', matchedPairs: [].concat(matchedPairs), pushInfo: null, popInfo: { value: top, charIdx: i } });
                }
            }
            if (!failed) {
                if (stack.length === 0) {
                    stepData.push({ arr: [], beforeArr: null, charIdx: -1, desc: '스택이 비어있으므로 유효한 괄호! \u2192 true \u2713', matchedPairs: [].concat(matchedPairs), pushInfo: null, popInfo: null });
                } else {
                    stepData.push({ arr: [].concat(stack), beforeArr: null, charIdx: -1, desc: '스택에 남은 괄호가 있으므로 유효하지 않습니다! \u2192 false \u2717', matchedPairs: [].concat(matchedPairs), pushInfo: null, popInfo: null });
                }
            }

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderInput(chars, st.charIdx, st.matchedPairs);
                        if (dir === 'forward' && st.pushInfo) {
                            animatePush(st.pushInfo.charIdx, st.pushInfo.value, st.arr, null);
                        } else if (dir === 'forward' && st.popInfo) {
                            animatePop(st.beforeArr, function() { renderStack(st.arr); });
                        } else {
                            renderStack(st.arr);
                        }
                    }
                };
            });
        }

        function resetParenViz() {
            var chars = parseParenInput();
            if (chars.length === 0) return;
            flyEl.innerHTML = '';
            inputEl.innerHTML = '';
            stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(비어있음)</div>';
            var steps = buildParenSteps(chars);
            self._initStepController(container, steps, '-paren');
        }

        container.querySelector('#sq-paren-reset').addEventListener('click', resetParenViz);
        resetParenViz();
    },

    // ── 카드2 (BOJ 2164) 시각화 ──
    _renderVizCard2(container) {
        const self = this;
        var DEFAULT_CARD_N = 6;

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (카드 수): <input type="number" id="sq-card-input" value="' + DEFAULT_CARD_N + '" min="2" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="sq-card-reset">🔄</button>' +
            '</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-card-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div>' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);text-align:center;">큐 (앞 \u2190 \u2192 뒤)</div>' +
            '<div id="sq-queue-card" style="display:flex;gap:4px;justify-content:center;min-height:44px;align-items:center;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div>버린 카드: <span id="sq-discarded-card" style="color:var(--red,#e17055);font-weight:600;"></span></div>' +
            '</div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-card') + vizHTML + self._createStepControls('-card');

        var queueEl = container.querySelector('#sq-queue-card');
        var discardedEl = container.querySelector('#sq-discarded-card');
        var flyEl = container.querySelector('#sq-card-fly');
        var wrapEl = flyEl.parentElement;

        function parseCardInput() {
            var val = parseInt(container.querySelector('#sq-card-input').value, 10);
            if (isNaN(val) || val < 2) val = 2;
            if (val > 20) val = 20;
            return val;
        }

        function renderQueue(arr, highlightFront, highlightBack) {
            if (arr.length === 0) {
                queueEl.innerHTML = '<div style="color:var(--text-secondary);">(비어있음)</div>';
            } else {
                queueEl.innerHTML = arr.map(function(v, i) {
                    var cls = 'str-char-box';
                    if (highlightFront && i === 0) cls += ' comparing';
                    if (highlightBack && i === arr.length - 1) cls += ' matched';
                    if (arr.length === 1 && !highlightFront && !highlightBack) cls += ' matched';
                    return '<div class="' + cls + '" id="sq-card-q-' + i + '" style="width:40px;text-align:center;font-weight:600;">' + v +
                        (i === 0 ? '<div style="font-size:0.65rem;color:var(--text-secondary);">\uC55E</div>' : '') +
                        (i === arr.length - 1 && arr.length > 1 ? '<div style="font-size:0.65rem;color:var(--text-secondary);">\uB4A4</div>' : '') +
                        '</div>';
                }).join('');
            }
        }

        function animateDiscard(beforeQueue, onDone) {
            renderQueue(beforeQueue, true, false);
            var frontEl = queueEl.querySelector('#sq-card-q-0');
            if (!frontEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = frontEl.getBoundingClientRect();
            frontEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeQueue[0];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--red,#e17055);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (sr.top - wr.top - 60) + 'px';
                ghost.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function animateMove(beforeQueue, afterQueue, onDone) {
            renderQueue(beforeQueue, true, false);
            var frontEl = queueEl.querySelector('#sq-card-q-0');
            if (!frontEl) { if (onDone) onDone(); return; }
            // Render after state to get destination position (last element)
            renderQueue(afterQueue, false, true);
            var backEl = queueEl.querySelector('#sq-card-q-' + (afterQueue.length - 1));
            if (!backEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var dr = backEl.getBoundingClientRect();
            // Render before state again
            renderQueue(beforeQueue, true, false);
            frontEl = queueEl.querySelector('#sq-card-q-0');
            var sr = frontEl.getBoundingClientRect();
            frontEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeQueue[0];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--accent);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.left = (dr.left - wr.left) + 'px';
                ghost.style.top = (dr.top - wr.top) + 'px';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                renderQueue(afterQueue, false, true);
                if (onDone) onDone();
            }, 550);
        }

        function buildCardSteps(N) {
            var stepData = [];
            var q = [];
            for (var i = 1; i <= N; i++) q.push(i);
            var discarded = [];
            stepData.push({ queue: [].concat(q), discarded: [], desc: '카드 1~' + N + '이 위에서부터 순서대로 놓여있습니다.', beforeQueue: null, animType: null });

            while (q.length > 1) {
                var beforeQ = [].concat(q);
                var removed = q.shift();
                discarded = [].concat(discarded, [removed]);
                stepData.push({ queue: [].concat(q), discarded: [].concat(discarded), desc: '맨 위 카드 ' + removed + '을(를) 버립니다.', beforeQueue: beforeQ, animType: 'discard' });
                if (q.length > 1) {
                    var beforeQ2 = [].concat(q);
                    var moved = q.shift();
                    q.push(moved);
                    stepData.push({ queue: [].concat(q), discarded: [].concat(discarded), desc: '다음 카드 ' + moved + '을(를) 맨 아래로 옮깁니다.', beforeQueue: beforeQ2, animType: 'move' });
                }
            }
            stepData.push({ queue: [].concat(q), discarded: [].concat(discarded), desc: '마지막 남은 카드는 ' + q[0] + '!', beforeQueue: null, animType: null });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        discardedEl.textContent = st.discarded.join(', ');
                        if (dir === 'forward' && st.animType === 'discard') {
                            animateDiscard(st.beforeQueue, function() { renderQueue(st.queue, false, false); });
                        } else if (dir === 'forward' && st.animType === 'move') {
                            animateMove(st.beforeQueue, st.queue, null);
                        } else {
                            var hf = st.animType === 'discard';
                            var hb = st.animType === 'move';
                            renderQueue(st.queue, hf, hb);
                        }
                    }
                };
            });
        }

        function resetCardViz() {
            var N = parseCardInput();
            flyEl.innerHTML = '';
            queueEl.innerHTML = '';
            discardedEl.textContent = '';
            var steps = buildCardSteps(N);
            self._initStepController(container, steps, '-card');
        }

        container.querySelector('#sq-card-reset').addEventListener('click', resetCardViz);
        resetCardViz();
    },

    // ── Min Stack (LeetCode 155) 시각화 ──
    _renderVizMinStack(container) {
        const self = this;
        var DEFAULT_MS_OPS = 'push -2, push 0, push -3, getMin, pop, top, getMin';

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">연산: <input type="text" id="sq-minstack-input" value="' + DEFAULT_MS_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:420px;"></label>' +
            '<button class="btn btn-primary" id="sq-minstack-reset">🔄</button>' +
            '</div>' +
            '<div style="font-size:0.8rem;color:var(--text3);margin-bottom:12px;margin-top:-12px;">형식: push 값, pop, top, getMin (쉼표로 구분)</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-ms-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
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
            '</div></div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-ms') + vizHTML + self._createStepControls('-ms');

        var mainEl = container.querySelector('#sq-main-ms');
        var minEl = container.querySelector('#sq-min-ms');
        var resultEl = container.querySelector('#sq-result-ms');
        var flyEl = container.querySelector('#sq-ms-fly');
        var wrapEl = flyEl.parentElement;

        function parseMsInput() {
            var raw = container.querySelector('#sq-minstack-input').value;
            var parts = raw.split(',');
            var ops = [];
            for (var i = 0; i < parts.length; i++) {
                var trimmed = parts[i].trim().toLowerCase();
                if (!trimmed) continue;
                if (trimmed.indexOf('push') === 0) {
                    var valStr = trimmed.replace('push', '').trim();
                    var val = parseInt(valStr, 10);
                    if (!isNaN(val)) ops.push({ op: 'push', val: val });
                } else if (trimmed === 'pop') {
                    ops.push({ op: 'pop' });
                } else if (trimmed === 'top') {
                    ops.push({ op: 'top' });
                } else if (trimmed === 'getmin') {
                    ops.push({ op: 'getMin' });
                }
            }
            return ops;
        }

        function renderMsStack(el, arr, prefix, hideIdx) {
            if (arr.length === 0) {
                el.innerHTML = '<div style="color:var(--text-secondary);font-size:0.8rem;text-align:center;padding:20px 0;">(빈)</div>';
            } else {
                el.innerHTML = arr.map(function(v, i) {
                    var hide = (i === hideIdx) ? 'opacity:0;' : '';
                    return '<div class="str-char-box' + (i === arr.length - 1 ? ' comparing' : '') + '" id="sq-ms-' + prefix + '-' + i + '" style="text-align:center;font-weight:600;' + hide + '">' + v + '</div>';
                }).join('');
            }
        }

        function animateMsPush(mainArr, minArr, value, minValue, onDone) {
            renderMsStack(mainEl, mainArr, 'main', mainArr.length - 1);
            renderMsStack(minEl, minArr, 'min', minArr.length - 1);
            var mainDst = mainEl.querySelector('#sq-ms-main-' + (mainArr.length - 1));
            var minDst = minEl.querySelector('#sq-ms-min-' + (minArr.length - 1));
            if (!mainDst || !minDst) {
                renderMsStack(mainEl, mainArr, 'main', -1);
                renderMsStack(minEl, minArr, 'min', -1);
                if (onDone) onDone(); return;
            }
            var wr = wrapEl.getBoundingClientRect();
            var mdr = mainDst.getBoundingClientRect();
            var ndr = minDst.getBoundingClientRect();
            function mkGhost(val, dstRect, color, startX) {
                var g = document.createElement('div');
                g.textContent = val;
                g.style.cssText = 'position:absolute;z-index:20;min-width:' + dstRect.width + 'px;height:' + dstRect.height + 'px;' +
                    'left:' + startX + 'px;top:' + (dstRect.top - wr.top - 60) + 'px;' +
                    'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                    'background:' + color + ';color:white;border-radius:8px;padding:0 6px;opacity:0.3;' +
                    'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.3s ease;';
                return g;
            }
            var gMain = mkGhost(value, mdr, 'var(--accent)', mdr.left - wr.left);
            var gMin = mkGhost(minValue, ndr, 'var(--green)', ndr.left - wr.left);
            flyEl.appendChild(gMain);
            flyEl.appendChild(gMin);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                gMain.style.top = (mdr.top - wr.top) + 'px';
                gMain.style.opacity = '1';
                gMin.style.top = (ndr.top - wr.top) + 'px';
                gMin.style.opacity = '1';
            }); });
            setTimeout(function() {
                if (gMain.parentNode) gMain.parentNode.removeChild(gMain);
                if (gMin.parentNode) gMin.parentNode.removeChild(gMin);
                renderMsStack(mainEl, mainArr, 'main', -1);
                renderMsStack(minEl, minArr, 'min', -1);
                if (onDone) onDone();
            }, 550);
        }

        function animateMsPop(beforeMain, beforeMin, onDone) {
            renderMsStack(mainEl, beforeMain, 'main', -1);
            renderMsStack(minEl, beforeMin, 'min', -1);
            var mainTop = mainEl.querySelector('#sq-ms-main-' + (beforeMain.length - 1));
            var minTop = minEl.querySelector('#sq-ms-min-' + (beforeMin.length - 1));
            if (!mainTop || !minTop) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var mr = mainTop.getBoundingClientRect();
            var nr = minTop.getBoundingClientRect();
            mainTop.style.opacity = '0.15';
            minTop.style.opacity = '0.15';
            function mkGhost(val, rect, color) {
                var g = document.createElement('div');
                g.textContent = val;
                g.style.cssText = 'position:absolute;z-index:20;min-width:' + rect.width + 'px;height:' + rect.height + 'px;' +
                    'left:' + (rect.left - wr.left) + 'px;top:' + (rect.top - wr.top) + 'px;' +
                    'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                    'background:' + color + ';color:white;border-radius:8px;padding:0 6px;' +
                    'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                    'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
                return g;
            }
            var gMain = mkGhost(beforeMain[beforeMain.length - 1], mr, 'var(--red,#e17055)');
            var gMin = mkGhost(beforeMin[beforeMin.length - 1], nr, 'var(--red,#e17055)');
            flyEl.appendChild(gMain);
            flyEl.appendChild(gMin);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                gMain.style.top = (mr.top - wr.top - 60) + 'px';
                gMain.style.opacity = '0';
                gMin.style.top = (nr.top - wr.top - 60) + 'px';
                gMin.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (gMain.parentNode) gMain.parentNode.removeChild(gMain);
                if (gMin.parentNode) gMin.parentNode.removeChild(gMin);
                if (onDone) onDone();
            }, 550);
        }

        function buildMsSteps(ops) {
            var stepData = [];
            var mainStack = [];
            var minStack = [];
            stepData.push({ main: [], min: [], beforeMain: null, beforeMin: null, desc: '두 개의 스택: 메인 스택과 최솟값 추적 스택을 준비합니다.', result: '', animType: null });

            for (var i = 0; i < ops.length; i++) {
                var o = ops[i];
                if (o.op === 'push') {
                    var bm = [].concat(mainStack);
                    var bn = [].concat(minStack);
                    mainStack = [].concat(mainStack, [o.val]);
                    var curMin = minStack.length === 0 ? o.val : Math.min(o.val, minStack[minStack.length - 1]);
                    minStack = [].concat(minStack, [curMin]);
                    stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: bm, beforeMin: bn, desc: 'push(' + o.val + ') \u2192 메인에 ' + o.val + ', 최솟값 스택에 min(' + o.val + ', ' + (minStack.length > 1 ? minStack[minStack.length - 2] : '\u2205') + ') = ' + curMin, result: '', animType: 'push', pushVal: o.val, pushMin: curMin });
                } else if (o.op === 'pop') {
                    if (mainStack.length === 0) {
                        stepData.push({ main: [], min: [], beforeMain: null, beforeMin: null, desc: 'pop() \u2192 스택이 비어있어 실행할 수 없습니다!', result: '', animType: null });
                    } else {
                        var bm = [].concat(mainStack);
                        var bn = [].concat(minStack);
                        var popped = mainStack[mainStack.length - 1];
                        mainStack = mainStack.slice(0, -1);
                        minStack = minStack.slice(0, -1);
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: bm, beforeMin: bn, desc: 'pop() \u2192 ' + popped + ' 제거. 두 스택 모두 pop!', result: '', animType: 'pop' });
                    }
                } else if (o.op === 'top') {
                    if (mainStack.length === 0) {
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: 'top() \u2192 스택이 비어있어 실행할 수 없습니다!', result: '', animType: null });
                    } else {
                        var topVal = mainStack[mainStack.length - 1];
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: 'top() \u2192 메인 스택 맨 위 값 확인', result: 'top() = ' + topVal, animType: 'highlight' });
                    }
                } else if (o.op === 'getMin') {
                    if (minStack.length === 0) {
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: 'getMin() \u2192 스택이 비어있어 실행할 수 없습니다!', result: '', animType: null });
                    } else {
                        var minVal = minStack[minStack.length - 1];
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: 'getMin() \u2192 최솟값 스택 맨 위 = 현재 최솟값!', result: 'getMin() = ' + minVal, animType: 'highlight' });
                    }
                }
            }
            stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: '보조 스택 덕분에 getMin()이 항상 O(1)!', result: '', animType: null });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        resultEl.textContent = st.result;
                        if (dir === 'forward' && st.animType === 'push') {
                            animateMsPush(st.main, st.min, st.pushVal, st.pushMin, null);
                        } else if (dir === 'forward' && st.animType === 'pop') {
                            animateMsPop(st.beforeMain, st.beforeMin, function() {
                                renderMsStack(mainEl, st.main, 'main', -1);
                                renderMsStack(minEl, st.min, 'min', -1);
                            });
                        } else {
                            renderMsStack(mainEl, st.main, 'main', -1);
                            renderMsStack(minEl, st.min, 'min', -1);
                        }
                    }
                };
            });
        }

        function resetMsViz() {
            var ops = parseMsInput();
            if (ops.length === 0) return;
            flyEl.innerHTML = '';
            mainEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.8rem;text-align:center;padding:20px 0;">(빈)</div>';
            minEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.8rem;text-align:center;padding:20px 0;">(빈)</div>';
            resultEl.textContent = '';
            var steps = buildMsSteps(ops);
            self._initStepController(container, steps, '-ms');
        }

        container.querySelector('#sq-minstack-reset').addEventListener('click', resetMsViz);
        resetMsViz();
    },

    // ===== 문제 탭 =====
    stages: [
        { num: 1, title: '스택 구현하기', desc: '스택의 기본 명령어를 직접 구현해보기 (Silver IV)', problemIds: ['boj-10828'] },
        { num: 2, title: '기본 스택·큐 다루기', desc: '스택과 큐의 기본 연산과 괄호 검증 (Silver~Easy)', problemIds: ['boj-10773', 'lc-20'] },
        { num: 3, title: '스택·큐 응용', desc: '덱 활용과 단조 스택 (Silver~Medium)', problemIds: ['boj-2164', 'lc-155'] }
    ],

    problems: [
        {
            id: 'boj-10828',
            title: 'BOJ 10828 - 스택',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10828',
            simIntro: 'push, pop, size, empty, top 명령어가 스택에서 어떻게 동작하는지 한 단계씩 확인해보세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수를 저장하는 스택을 구현한 다음, 입력으로 주어지는 명령을 처리하는 프로그램을 작성하시오.</p>
                <p>명령은 총 다섯 가지이다.</p>
                <ul>
                    <li><code>push X</code>: 정수 X를 스택에 넣는 연산이다.</li>
                    <li><code>pop</code>: 스택에서 가장 위에 있는 정수를 빼고, 그 수를 출력한다. 만약 스택이 비어있는 경우에는 -1을 출력한다.</li>
                    <li><code>size</code>: 스택에 들어있는 정수의 개수를 출력한다.</li>
                    <li><code>empty</code>: 스택이 비어있으면 1, 아니면 0을 출력한다.</li>
                    <li><code>top</code>: 스택의 가장 위에 있는 정수를 출력한다. 만약 스택이 비어있는 경우에는 -1을 출력한다.</li>
                </ul>
                <h4>입력</h4>
                <p>첫째 줄에 주어지는 명령의 수 N (1 &le; N &le; 10,000)이 주어진다. 둘째 줄부터 N개의 줄에는 명령이 하나씩 주어진다. 주어지는 정수는 1보다 크거나 같고, 100,000보다 작거나 같다. 문제에 나와있지 않은 명령이 주어지는 경우는 없다.</p>
                <h4>출력</h4>
                <p>출력해야하는 명령이 주어질 때마다, 한 줄에 하나씩 출력한다.</p>

                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>14\npush 1\npush 2\ntop\nsize\npop\npush 3\nempty\npop\npop\npop\npush 4\nempty\ntop\npop</pre></div>
                    <div><strong>출력</strong><pre>2\n2\n2\n0\n3\n1\n-1\n0\n4\n4</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; N &le; 10,000</li>
                    <li>1 &le; X &le; 100,000</li>
                </ul>
            `,
            hints: [
                { title: '스택이 뭐지?', content: '스택은 <strong>"접시 쌓기"</strong>와 같아요!<br><br>접시를 위에 하나씩 쌓고, 뺄 때도 맨 위에서만 빼요.<br>마지막에 넣은 것을 가장 먼저 빼는 구조 — 이걸 <strong>LIFO (Last In, First Out)</strong>라고 합니다.<div style="display:flex;justify-content:center;margin:12px 0 8px;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="font-size:0.75rem;color:var(--text3);">← top</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 16px;border:2px solid var(--bg3);border-radius:8px;min-height:80px;background:var(--bg2);"><div style="padding:4px 18px;background:var(--accent);color:white;border-radius:6px;font-size:0.85rem;font-weight:600;">1</div><div style="padding:4px 18px;background:var(--accent);color:white;border-radius:6px;font-size:0.85rem;font-weight:600;">2</div><div style="padding:4px 18px;background:var(--green);color:white;border-radius:6px;font-size:0.85rem;font-weight:600;">3</div></div><div style="font-size:0.75rem;color:var(--text3);margin-top:2px;">push 순서: 1→2→3</div></div></div>이 문제는 이 LIFO 구조를 직접 구현해서 5가지 명령어를 처리하는 거예요!' },
                { title: '5가지 명령어 정리', content: '각 명령어가 하는 일을 정리하면:<br><br>📥 <strong>push X</strong> → 스택 맨 위에 X를 넣는다 (출력 없음)<br>📤 <strong>pop</strong> → 맨 위 값을 출력하고 제거. 비어있으면 -1<br>📏 <strong>size</strong> → 현재 스택에 들어있는 개수 출력<br>❓ <strong>empty</strong> → 비어있으면 1, 아니면 0 출력<br>👀 <strong>top</strong> → 맨 위 값을 출력 (제거 안 함). 비어있으면 -1<div style="display:flex;justify-content:center;gap:24px;margin:12px 0 8px;flex-wrap:wrap;"><div style="text-align:center;"><div style="font-size:0.8rem;color:var(--text2);font-weight:600;margin-bottom:4px;">pop (꺼내고 제거)</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 14px;border:2px solid var(--bg3);border-radius:8px;min-height:60px;background:var(--bg2);"><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">A</div><div style="padding:3px 14px;background:var(--red);color:white;border-radius:5px;font-size:0.8rem;opacity:0.5;text-decoration:line-through;">B</div></div></div><div style="text-align:center;"><div style="font-size:0.8rem;color:var(--text2);font-weight:600;margin-bottom:4px;">top (보기만)</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 14px;border:2px solid var(--bg3);border-radius:8px;min-height:60px;background:var(--bg2);"><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">A</div><div style="padding:3px 14px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;box-shadow:0 0 6px var(--yellow);">B</div></div></div></div><strong>pop과 top의 차이</strong>: pop은 꺼내고 제거, top은 보기만!' },
                { title: '어떤 자료구조로 구현하지?', content: '<span class="lang-py">Python에서는 <strong>리스트(list)</strong>가 곧 스택입니다!<br><br><code>append(x)</code> → push (맨 뒤에 추가)<br><code>pop()</code> → pop (맨 뒤에서 제거 + 반환)<br><code>stack[-1]</code> → top (맨 뒤 값 확인)<br><code>len(stack)</code> → size<br><br>모두 <strong>O(1)</strong>이라 빠릅니다!<br><a href="https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks" target="_blank" style="font-size:0.85rem;color:var(--accent);">Python 공식 문서: 리스트를 스택으로 쓰기 ↗</a></span><span class="lang-cpp">C++에서는 <code>vector&lt;int&gt;</code>나 <code>stack&lt;int&gt;</code>를 쓸 수 있어요.<br><br><code>push_back(x)</code> / <code>push(x)</code> → push<br><code>pop_back()</code> / <code>pop()</code> → pop (값은 미리 저장!)<br><code>back()</code> / <code>top()</code> → top<br><code>size()</code> → size<br><br>모두 <strong>O(1)</strong> 연산입니다!<br><a href="https://en.cppreference.com/w/cpp/container/stack" target="_blank" style="font-size:0.85rem;color:var(--accent);">C++ stack 레퍼런스 ↗</a></span>' },
                { title: '빈 스택 처리가 핵심!', content: '<strong>pop</strong>과 <strong>top</strong>은 스택이 비어있을 때 -1을 출력해야 해요.<br><br>이걸 빠뜨리면 런타임 에러가 나요! (빈 스택에서 꺼내려고 하니까)<div style="display:flex;justify-content:center;margin:10px 0;"><div style="padding:8px 16px;background:var(--red);color:white;border-radius:8px;font-size:0.85rem;opacity:0.9;">⚠️ 빈 스택에서 pop() → 런타임 에러!</div></div>처리 순서:<br>1. 명령어 파싱 (push일 때 숫자도 읽기)<br>2. if-else로 5가지 명령 분기<br>3. <strong>pop/top에서 empty 체크 필수!</strong><br><br><span class="lang-py">Python: <code>if not stack:</code>으로 빈 스택 체크</span><span class="lang-cpp">C++: <code>if (st.empty())</code>으로 빈 스택 체크</span>' }
            ],
            inputDefault: 0,
            solve() { return '2\n2\n2\n0\n3\n1\n-1\n0\n4\n4'; },
            solutions: [
                {
                    approach: '리스트/배열로 스택 구현',
                    description: '리스트를 스택으로 사용하여 5가지 명령어를 처리합니다.',
                    timeComplexity: 'O(N)',
                    spaceComplexity: 'O(N)',
                    get templates() { return stackQueueTopic.problems[0].templates; },
                    codeSteps: {
                        python: [
                            { title: '입력 설정', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nstack = []  # 리스트를 스택으로 사용 (LIFO)', desc: 'sys.stdin.readline으로 빠른 입력.\n리스트가 곧 스택! append/pop이 O(1)이라 효율적입니다.' },
                            { title: 'push 처리', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nstack = []\n\nfor _ in range(N):\n    cmd = input().split()\n    if cmd[0] == "push":\n        stack.append(int(cmd[1]))  # 맨 위에 값 추가', desc: '명령어를 split()으로 나눠서 첫 단어로 분기합니다.\npush는 두 번째 값을 정수로 변환해서 append!' },
                            { title: 'pop / top 처리', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nstack = []\n\nfor _ in range(N):\n    cmd = input().split()\n    if cmd[0] == "push":\n        stack.append(int(cmd[1]))\n    elif cmd[0] == "pop":\n        # 비어있으면 -1, 아니면 꺼내서 출력\n        print(-1 if not stack else stack.pop())\n    elif cmd[0] == "top":\n        # 비어있으면 -1, 아니면 맨 위 값 (제거 안 함!)\n        print(-1 if not stack else stack[-1])', desc: 'pop과 top 모두 빈 스택 체크가 필수!\npop()은 값을 꺼내고 제거, stack[-1]은 보기만 합니다.' },
                            { title: 'size / empty 처리', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nstack = []\n\nfor _ in range(N):\n    cmd = input().split()\n    if cmd[0] == "push":\n        stack.append(int(cmd[1]))\n    elif cmd[0] == "pop":\n        print(-1 if not stack else stack.pop())\n    elif cmd[0] == "size":\n        print(len(stack))  # 현재 원소 개수\n    elif cmd[0] == "empty":\n        print(1 if not stack else 0)  # 비어있으면 1\n    elif cmd[0] == "top":\n        print(-1 if not stack else stack[-1])', desc: 'size는 len(), empty는 비어있는지 확인.\n모든 연산이 O(1)이므로 전체 O(N)에 해결!' }
                        ],
                        cpp: [
                            { title: '입력 설정', code: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    stack<int> st;  // C++ 표준 스택 사용', desc: 'C++ <stack> 라이브러리를 사용합니다.\npush/pop/top/size/empty 모두 O(1) 연산입니다.' },
                            { title: 'push 처리', code: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    stack<int> st;\n\n    while (N--) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == "push") {\n            int x;\n            cin >> x;\n            st.push(x);  // 스택 맨 위에 추가\n        }', desc: 'string으로 명령어를 읽고 분기합니다.\npush일 때만 추가로 정수 x를 입력받습니다.' },
                            { title: 'pop / top 처리', code: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    stack<int> st;\n\n    while (N--) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == "push") {\n            int x; cin >> x;\n            st.push(x);\n        } else if (cmd == "pop") {\n            if (st.empty()) cout << -1 << "\\n";\n            else { cout << st.top() << "\\n"; st.pop(); }\n            // top()으로 값 확인 후 pop()으로 제거!\n        } else if (cmd == "top") {\n            if (st.empty()) cout << -1 << "\\n";\n            else cout << st.top() << "\\n";\n            // top은 제거하지 않고 보기만\n        }', desc: 'C++의 pop()은 값을 반환하지 않아요!\n반드시 top()으로 먼저 값을 읽고, 그 다음 pop()으로 제거합니다.\n빈 스택 체크를 잊으면 런타임 에러!' },
                            { title: 'size / empty + 전체 코드', code: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    stack<int> st;\n\n    while (N--) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == "push") {\n            int x; cin >> x;\n            st.push(x);\n        } else if (cmd == "pop") {\n            if (st.empty()) cout << -1 << "\\n";\n            else { cout << st.top() << "\\n"; st.pop(); }\n        } else if (cmd == "size") {\n            cout << st.size() << "\\n";\n        } else if (cmd == "empty") {\n            cout << (st.empty() ? 1 : 0) << "\\n";\n        } else if (cmd == "top") {\n            if (st.empty()) cout << -1 << "\\n";\n            else cout << st.top() << "\\n";\n        }\n    }\n    return 0;\n}', desc: 'size()와 empty()는 간단합니다.\n"\\n"을 사용하면 endl보다 빠릅니다!\n전체 시간복잡도: O(N) — 모든 연산이 O(1)!' }
                        ]
                    }
                }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
stack = []

for _ in range(N):
    cmd = input().split()
    if cmd[0] == "push":
        stack.append(int(cmd[1]))
    elif cmd[0] == "pop":
        print(-1 if not stack else stack.pop())
    elif cmd[0] == "size":
        print(len(stack))
    elif cmd[0] == "empty":
        print(1 if not stack else 0)
    elif cmd[0] == "top":
        print(-1 if not stack else stack[-1])`,
                cpp: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    int N;
    cin >> N;
    stack<int> st;

    while (N--) {
        string cmd;
        cin >> cmd;
        if (cmd == "push") {
            int x; cin >> x;
            st.push(x);
        } else if (cmd == "pop") {
            if (st.empty()) cout << -1 << "\\n";
            else { cout << st.top() << "\\n"; st.pop(); }
        } else if (cmd == "size") {
            cout << st.size() << "\\n";
        } else if (cmd == "empty") {
            cout << (st.empty() ? 1 : 0) << "\\n";
        } else if (cmd == "top") {
            if (st.empty()) cout << -1 << "\\n";
            else cout << st.top() << "\\n";
        }
    }
    return 0;
}`
            }
        },
        {
            id: 'boj-10773',
            title: 'BOJ 10773 - 제로',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10773',
            simIntro: '0이 입력되면 가장 최근 수를 스택에서 pop하는 과정을 확인해보세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>나코더 기장 재민이는 장부를 정리하는 중이다. 그런데 재민이는 매우 활발하여 재미있는 일을 생각해냈다. 재민이가 K개의 수를 불러준다. 어떤 수가 "0"이 아닌 경우에는 해당 수를 장부에 적고, "0"인 경우에는 가장 최근에 적은 수를 지운다. 재민이가 게임을 끝마쳤을 때, 장부에 적혀 있는 수의 합을 구하는 프로그램을 작성하시오. 0을 입력받을 때 지울 수가 반드시 존재한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 정수 K가 주어진다. (1 &le; K &le; 100,000)</p>
                <p>이후 K개의 줄에 정수가 한 개씩 주어진다. 정수는 0에서 100,000 사이의 값을 가지며, 정수가 "0"일 경우에는 가장 최근에 쓴 수를 지우고, 아닐 경우 해당 수를 쓴다. 정수가 "0"일 경우에 지울 수 있는 수가 있음을 보장할 수 있다.</p>
                <h4>출력</h4>
                <p>재민이가 게임을 마쳤을 때, 장부에 적혀 있는 수의 합을 출력한다. 이 값은 2<sup>31</sup> - 1보다 작거나 같은 정수이다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4\n3\n0\n4\n0</pre></div>
                    <div><strong>출력</strong><pre>0</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>10\n1\n3\n5\n4\n0\n0\n7\n0\n0\n6</pre></div>
                    <div><strong>출력</strong><pre>7</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; K &le; 100,000</li>
                    <li>1 &le; 수 &le; 100,000</li>
                    <li>0을 입력받을 때 지울 수가 반드시 존재</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '숫자를 부르면 적고, 0을 부르면 지운다… 일단 <strong>리스트에 숫자를 넣으면</strong> 되지 않을까?<br><br>예를 들어: 3이 들어오면 → [3], 다음에 0이 오면 → 3을 지움 → []<br>1, 5, 0이 들어오면 → [1, 5] → 0이니까 지움 → [1]<br><br>그런데 "지운다"가 정확히 뭘 지우는 걸까요? <strong>"가장 최근에 적은 수"</strong>를 지우는 거예요!' },
                { title: '근데 "가장 최근"을 어떻게 빼지?', content: '"가장 최근에 넣은 걸 빼는" 이 패턴… 뭔가 익숙하지 않나요?<br><br>접시를 쌓아놓고 <strong>맨 위에 있는 접시부터 빼는 것</strong>과 같아요!<br>한쪽 끝에서만 넣고, 한쪽 끝에서만 빼는 패턴 — 바로 <strong>LIFO(후입선출) = 스택</strong>이에요!<div style="display:flex;justify-content:center;gap:24px;margin:12px 0;flex-wrap:wrap;align-items:flex-end;"><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);margin-bottom:4px;">push 1, 3, 5 후</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 14px;border:2px solid var(--bg3);border-radius:8px;min-height:60px;background:var(--bg2);"><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">1</div><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">3</div><div style="padding:3px 14px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;font-weight:600;box-shadow:0 0 6px var(--yellow);">5</div></div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">top → 5</div></div><div style="font-size:1.2rem;color:var(--text3);">→ pop</div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--green);margin-bottom:4px;">5가 빠짐 (가장 최근!)</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 14px;border:2px solid var(--bg3);border-radius:8px;min-height:60px;background:var(--bg2);"><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">1</div><div style="padding:3px 14px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;font-weight:600;box-shadow:0 0 6px var(--yellow);">3</div></div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">top → 3</div></div></div>숫자가 오면 push, 0이 오면 pop하면 자연스럽게 "가장 최근 수"가 빠집니다.' },
                { title: '스택으로 구현하면 이렇게!', content: '① 0이 아닌 수 → <code>push(x)</code><br>② 0이면 → <code>pop()</code> (가장 최근 수가 빠짐)<br>③ K번 반복 후 → 스택에 남은 수들의 합이 정답!<div style="display:flex;justify-content:center;margin:12px 0;"><div style="display:flex;align-items:flex-end;gap:16px;"><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);margin-bottom:3px;">입력: 1, 3, 0, 5</div><div style="display:flex;gap:4px;justify-content:center;"><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">1</div><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">3</div><div style="padding:3px 10px;background:var(--red);color:white;border-radius:5px;font-size:0.8rem;text-decoration:line-through;opacity:0.5;">0</div><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">5</div></div></div><div style="font-size:1.2rem;color:var(--text3);margin-bottom:2px;">→</div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);margin-bottom:3px;">스택 결과</div><div style="display:flex;gap:4px;justify-content:center;"><div style="padding:3px 10px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">1</div><div style="padding:3px 10px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">5</div></div><div style="font-size:0.75rem;color:var(--green);margin-top:3px;">합 = 6</div></div></div></div>문제 조건상 0일 때 스택이 비어있지 않음이 보장되므로, 별도 체크는 불필요해요.<br>시간 복잡도: <strong>O(K)</strong> — push/pop 모두 O(1)이라 K번 반복이면 O(K)!' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python에선 <code>list</code>가 곧 스택!<br><code>append(x)</code>로 push, <code>pop()</code>으로 pop — 둘 다 O(1)이에요.<br>마지막에 <code>sum(stack)</code>으로 남은 수의 합을 구하면 끝!</span><span class="lang-cpp">C++에선 <code>stack&lt;int&gt;</code>를 사용!<br><code>push(x)</code>로 넣고, <code>pop()</code>으로 빼요.<br>다만 <code>sum()</code>이 없으므로, <code>while (!st.empty())</code>로 하나씩 꺼내서 합산합니다.</span>' }
            ],
            inputDefault: 0,
            solve() { return '0'; },
            solutions: [
                {
                    approach: '스택 활용',
                    description: '0이 나오면 pop, 아니면 push한 뒤 남은 합을 구합니다.',
                    timeComplexity: 'O(K)',
                    spaceComplexity: 'O(K)',
                    get templates() { return stackQueueTopic.problems[1].templates; },
                    codeSteps: {
                        python: [
                            { title: '입력 설정', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # 스택: 마지막에 넣은 걸 먼저 꺼냄 (LIFO)', desc: '왜 스택? → 0이 나오면 "가장 최근 수"를 지워야 하니까!\nLIFO(후입선출) 구조가 딱 맞습니다.' },
                            { title: '반복문', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # 스택: 마지막에 넣은 걸 먼저 꺼냄 (LIFO)\n\nfor _ in range(K):\n    n = int(input())  # 각 수를 하나씩 입력', desc: 'K번 반복하며 각 숫자를 입력받습니다.\n수가 0인지 아닌지에 따라 동작이 달라집니다.' },
                            { title: '조건 분기', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # 스택: 마지막에 넣은 걸 먼저 꺼냄 (LIFO)\n\nfor _ in range(K):\n    n = int(input())\n    if n == 0:          # 0 = "직전 수를 지워라!"\n        stack.pop()     # LIFO → 가장 최근 수가 빠짐\n    else:\n        stack.append(n) # 0이 아니면 일단 쌓아둔다', desc: '핵심 로직: 0이면 pop, 아니면 push!\npop()은 항상 가장 최근에 넣은 수를 제거합니다.\n→ 스택이라서 가능한 O(1) 연산!' },
                            { title: '결과 출력', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # 스택: 마지막에 넣은 걸 먼저 꺼냄 (LIFO)\n\nfor _ in range(K):\n    n = int(input())\n    if n == 0:          # 0 = "직전 수를 지워라!"\n        stack.pop()     # LIFO → 가장 최근 수가 빠짐\n    else:\n        stack.append(n) # 0이 아니면 일단 쌓아둔다\n\nprint(sum(stack))  # 지우기 끝난 뒤 남은 수들의 합', desc: '모든 0 처리가 끝난 뒤 스택에 남아있는 수들의 합!' }
                        ],
                        cpp: [
                            { title: '입력 설정', code: '#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int K;\n    cin >> K;\n    stack<int> st;  // 스택: LIFO (후입선출)', desc: '왜 스택? → 0이 나오면 "가장 최근 수"를 지워야 하니까!\nLIFO(후입선출) 구조가 딱 맞습니다.\nC++의 stack은 <stack> 헤더에서 제공합니다.' },
                            { title: '반복문', code: '#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int K;\n    cin >> K;\n    stack<int> st;  // 스택: LIFO (후입선출)\n\n    while (K--) {       // K번 반복\n        int n;\n        cin >> n;       // 각 수를 하나씩 입력', desc: 'while (K--)는 K를 하나씩 줄이면서 0이 될 때까지 반복합니다.\n수가 0인지 아닌지에 따라 동작이 달라집니다.' },
                            { title: '조건 분기', code: '#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int K;\n    cin >> K;\n    stack<int> st;  // 스택: LIFO (후입선출)\n\n    while (K--) {\n        int n;\n        cin >> n;\n        if (n == 0)       // 0 → "직전 수를 지워라!"\n            st.pop();     // LIFO → 가장 최근 수가 빠짐\n        else\n            st.push(n);   // 0이 아니면 쌓아둔다', desc: '핵심 로직: 0이면 pop, 아니면 push!\nC++에서는 push()로 넣고 pop()으로 뺍니다.\npop()은 항상 가장 최근에 넣은 수를 제거 → O(1) 연산!' },
                            { title: '결과 출력', code: '#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int K;\n    cin >> K;\n    stack<int> st;  // 스택: LIFO (후입선출)\n\n    while (K--) {\n        int n;\n        cin >> n;\n        if (n == 0)       // 0 → "직전 수를 지워라!"\n            st.pop();     // LIFO → 가장 최근 수가 빠짐\n        else\n            st.push(n);   // 0이 아니면 쌓아둔다\n    }\n\n    int total = 0;\n    while (!st.empty()) {   // 스택이 빌 때까지\n        total += st.top();  // top()으로 값 읽고\n        st.pop();           // pop()으로 제거\n    }\n    cout << total << endl;  // 남은 수들의 합 출력', desc: 'C++ stack은 sum()이 없으므로 하나씩 꺼내서 더합니다.\ntop()은 값만 반환(제거 X), pop()은 제거만 (반환 X)!\n이 차이가 Python의 pop()과 다른 점입니다.' }
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
                cpp: `#include <iostream>
#include <stack>
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
                <p>문자열 <code>s</code>가 <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code>, <code>']'</code>로만 이루어져 있을 때, 입력 문자열이 유효한지 판별하세요.</p>
                <p>유효한 조건:</p>
                <ol>
                    <li>열린 괄호는 <strong>같은 종류의 괄호</strong>로 닫혀야 한다.</li>
                    <li>열린 괄호는 <strong>올바른 순서</strong>로 닫혀야 한다.</li>
                    <li>모든 닫힌 괄호에는 <strong>같은 유형의 열린 괄호</strong>가 있어야 한다.</li>
                </ol>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>s = "()"</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>s = "()[]{}"</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>s = "(]"</pre></div>
                    <div><strong>출력</strong><pre>false</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; s.length &le; 10<sup>4</sup></li>
                    <li><code>s</code>는 <code>'()[]{}'</code> 문자로만 구성</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '여는 괄호랑 닫는 괄호 <strong>개수가 같으면</strong> 유효한 거 아닐까?<br><br><code>"()"</code> → 여는 1개, 닫는 1개 → 유효 ✓<br><code>"()[]{}"</code> → 여는 3개, 닫는 3개 → 유효 ✓<div style="display:flex;justify-content:center;gap:16px;margin:12px 0;flex-wrap:wrap;"><div style="text-align:center;padding:8px 14px;background:var(--bg2);border-radius:8px;"><div style="font-family:monospace;font-size:1.1rem;letter-spacing:3px;margin-bottom:4px;"><span style="color:var(--accent);">(</span> <span style="color:var(--green);">)</span></div><div style="font-size:0.75rem;color:var(--text3);">여는 1 = 닫는 1 ✓</div></div><div style="text-align:center;padding:8px 14px;background:var(--bg2);border-radius:8px;"><div style="font-family:monospace;font-size:1.1rem;letter-spacing:3px;margin-bottom:4px;"><span style="color:var(--accent);">(</span><span style="color:var(--green);">)</span><span style="color:var(--accent);">[</span><span style="color:var(--green);">]</span><span style="color:var(--accent);">{</span><span style="color:var(--green);">}</span></div><div style="font-size:0.75rem;color:var(--text3);">여는 3 = 닫는 3 ✓</div></div></div>개수만 세면 간단하게 풀 수 있을 것 같은데…' },
                { title: '근데 이러면 문제가 있어', content: '<code>"(]"</code> → 여는 괄호 1개, 닫는 괄호 1개… <strong>개수는 맞는데 유효하지 않아요!</strong><br><code>"([)]"</code> → 여는 2개, 닫는 2개… 역시 개수는 맞지만 유효하지 않아요!<div style="display:flex;justify-content:center;gap:20px;margin:12px 0;flex-wrap:wrap;"><div style="text-align:center;padding:8px 14px;background:var(--bg2);border:2px solid var(--green);border-radius:8px;"><div style="font-size:0.8rem;color:var(--green);font-weight:600;margin-bottom:4px;">유효 ✓</div><div style="font-size:1.1rem;font-family:monospace;letter-spacing:2px;"><span style="color:var(--accent);">(</span><span style="color:var(--accent);">[</span><span style="color:var(--green);">]</span><span style="color:var(--green);">)</span></div></div><div style="text-align:center;padding:8px 14px;background:var(--bg2);border:2px solid var(--red);border-radius:8px;"><div style="font-size:0.8rem;color:var(--red);font-weight:600;margin-bottom:4px;">무효 ✗</div><div style="font-size:1.1rem;font-family:monospace;letter-spacing:2px;"><span style="color:var(--accent);">(</span><span style="color:var(--accent);">[</span><span style="color:var(--red);">)</span><span style="color:var(--red);">]</span></div></div></div>개수만으로는 <strong>"종류"</strong>(괄호 모양이 같은지)와 <strong>"순서"</strong>(안쪽 괄호를 먼저 닫는지)를 확인할 수 없습니다.<br>그럼 종류와 순서를 둘 다 체크하려면 어떻게 해야 할까요?' },
                { title: '이렇게 하면 어떨까?', content: '<code>"([{}])"</code>를 보면: <code>(</code> → <code>[</code> → <code>{</code> 순서로 열었으니,<br><code>}</code> → <code>]</code> → <code>)</code> 순서로, <strong>가장 최근에 연 괄호부터</strong> 닫아야 해요.<div style="display:flex;justify-content:center;margin:12px 0;"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="font-size:0.7rem;color:var(--text3);">스택</div><div style="display:flex;flex-direction:column-reverse;gap:2px;padding:6px 10px;border:2px solid var(--bg3);border-radius:6px;min-height:50px;background:var(--bg2);"><div style="padding:2px 10px;background:var(--accent);color:white;border-radius:4px;font-size:0.8rem;">(</div><div style="padding:2px 10px;background:var(--accent);color:white;border-radius:4px;font-size:0.8rem;">[</div><div style="padding:2px 10px;background:var(--yellow);color:var(--text);border-radius:4px;font-size:0.8rem;font-weight:600;">{</div></div></div><div style="font-size:0.85rem;color:var(--text2);max-width:180px;line-height:1.5;"><code>}</code> 등장!<br>스택 top = <code>{</code><br>짝이 맞으니 pop!</div></div></div>"가장 최근에 넣은 것을 빼서 비교"… 이 패턴, 어디서 본 것 같지 않나요? → <strong>스택</strong>!<br>여는 괄호 → push, 닫는 괄호가 나오면 → pop해서 짝이 맞나 확인하면 돼요.<br><br>주의할 점 두 가지:<br>① 닫는 괄호인데 <strong>스택이 비어있으면?</strong> → 짝이 없으니 실패<br>② 끝까지 봤는데 <strong>스택에 남아있으면?</strong> → 안 닫힌 괄호가 있으니 실패' },
                { title: 'Python/C++에선 이렇게!', content: '짝을 매핑해두면 닫는 괄호가 나왔을 때 O(1)로 비교할 수 있어요:<br><br><span class="lang-py">Python: <code>pairs = {")" : "(", "]" : "[", "}" : "{"}</code> (<a href="https://docs.python.org/3/library/stdtypes.html#dict" target="_blank" style="color:var(--accent);">딕셔너리</a>)<br>스택은 <code>list</code>의 <code>append/pop</code>으로 구현!<br>닫는 괄호 → <code>stack[-1] != pairs[c]</code>이면 짝 불일치 → <code>False</code></span><span class="lang-cpp">C++: <code><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="color:var(--accent);">unordered_map</a>&lt;char,char&gt;</code>로 매핑하거나 if/else로 비교<br>스택은 <code>stack&lt;char&gt;</code>의 <code>push/top/pop</code>으로 구현!<br>닫는 괄호 → <code>st.top() != pairs[c]</code>이면 짝 불일치 → <code>false</code></span>' }
            ],
            inputDefault: 0,
            solve() { return 'true'; },
            solutions: [
                {
                    approach: '스택 기반 괄호 매칭',
                    description: '여는 괄호는 push, 닫는 괄호가 나오면 top과 비교하여 매칭합니다.',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    get templates() { return stackQueueTopic.problems[2].templates; },
                    codeSteps: {
                        python: [
                            { title: '초기 설정', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑', desc: '왜 딕셔너리? → 닫는 괄호가 나왔을 때 짝을 O(1)로 찾으려고!\npairs[")"] = "(" 이런 식으로 매핑합니다.' },
                            { title: '문자 순회', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑\n\n        for c in s:  # 한 글자씩 확인', desc: '문자열의 각 문자를 하나씩 확인합니다.\n여는 괄호인지 닫는 괄호인지에 따라 처리가 다릅니다.' },
                            { title: '여는 괄호 push', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)  # 나중에 짝을 확인할 때까지 보관', desc: '왜 push? → 여는 괄호는 아직 짝을 모르니까 일단 보관!\n나중에 닫는 괄호가 나올 때 꺼내서 비교합니다.' },
                            { title: '닫는 괄호 검증', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)  # 나중에 짝을 확인할 때까지 보관\n            elif c in \')]}\':\n                if not stack or stack[-1] != pairs[c]:  # 스택 비었거나 짝 불일치\n                    return False\n                stack.pop()  # 짝 맞으면 소비!', desc: '핵심: 닫는 괄호가 나오면 스택 top과 비교!\nnot stack → 짝 지을 여는 괄호가 없음 → 실패\nstack[-1] != pairs[c] → 가장 최근 여는 괄호와 짝이 안 맞음 → 실패' },
                            { title: '최종 판정', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # 여는 괄호를 쌓아두는 스택\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # 닫는→여는 매핑\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)  # 나중에 짝을 확인할 때까지 보관\n            elif c in \')]}\':\n                if not stack or stack[-1] != pairs[c]:  # 스택 비었거나 짝 불일치\n                    return False\n                stack.pop()  # 짝 맞으면 소비!\n\n        return len(stack) == 0  # 남은 여는 괄호 있으면 실패!', desc: '왜 len(stack) == 0?\n→ 스택에 여는 괄호가 남아있으면 짝을 못 찾은 것!\n"(()" 같은 경우 스택에 "("가 남아있어서 False.' }
                        ],
                        cpp: [
                            { title: '초기 설정', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;  // 여는 괄호를 쌓아두는 스택\n        // 닫는→여는 괄호 매핑 (O(1) 조회용)\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };', desc: '왜 unordered_map? → 닫는 괄호가 나왔을 때 짝을 O(1)로 찾으려고!\npairs[\')\'] = \'(\' 이런 식으로 매핑합니다.\nC++에서는 stack<char>로 문자 스택을 만듭니다.' },
                            { title: '문자 순회', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };\n\n        for (char c : s) {  // 한 글자씩 확인', desc: 'range-based for문으로 문자열의 각 문자를 순회합니다.\n여는 괄호인지 닫는 괄호인지에 따라 처리가 다릅니다.' },
                            { title: '여는 괄호 push', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };\n\n        for (char c : s) {\n            if (c == \'(\' || c == \'[\' || c == \'{\')\n                st.push(c);  // 나중에 짝을 확인할 때까지 보관', desc: '왜 push? → 여는 괄호는 아직 짝을 모르니까 일단 보관!\n나중에 닫는 괄호가 나올 때 꺼내서 비교합니다.' },
                            { title: '닫는 괄호 검증', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };\n\n        for (char c : s) {\n            if (c == \'(\' || c == \'[\' || c == \'{\')\n                st.push(c);  // 나중에 짝을 확인할 때까지 보관\n            else {\n                // 스택 비었거나 짝 불일치 → 실패\n                if (st.empty() || st.top() != pairs[c])\n                    return false;\n                st.pop();    // 짝 맞으면 소비!', desc: '핵심: 닫는 괄호가 나오면 스택 top과 비교!\nst.empty() → 짝 지을 여는 괄호가 없음 → 실패\nst.top() != pairs[c] → 가장 최근 여는 괄호와 짝이 안 맞음 → 실패' },
                            { title: '최종 판정', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };\n\n        for (char c : s) {\n            if (c == \'(\' || c == \'[\' || c == \'{\')\n                st.push(c);\n            else {\n                if (st.empty() || st.top() != pairs[c])\n                    return false;\n                st.pop();\n            }\n        }\n\n        return st.empty();  // 남은 여는 괄호 있으면 실패!\n    }\n};', desc: '왜 st.empty()?\n→ 스택에 여는 괄호가 남아있으면 짝을 못 찾은 것!\n"(()" 같은 경우 스택에 \'(\'가 남아있어서 false.' }
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
};`
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
                <p>N장의 카드가 있다. 각 카드는 차례로 1부터 N까지의 번호가 붙어 있으며, 1번 카드가 제일 위에, N번 카드가 제일 아래인 상태로 놓여 있다. 이제 다음과 같은 동작을 카드가 한 장 남을 때까지 반복하게 된다. 우선 제일 위에 있는 카드를 바닥에 버린다. 그 다음 제일 위에 있는 카드를 제일 아래에 있는 카드 밑으로 옮긴다. 마지막에 남게 되는 카드를 구하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 정수 N(1 &le; N &le; 500,000)이 주어진다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 남게 되는 카드의 번호를 출력한다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; N &le; 500,000</li>
                </ul>
            `,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: 'N=4일 때 카드가 [1, 2, 3, 4]로 놓여있어요.<br>"<strong>맨 위를 버리고 → 그다음 맨 위를 맨 아래로</strong>" 반복!<div style="margin:12px 0;overflow-x:auto;"><table style="border-collapse:collapse;font-size:0.82rem;width:100%;"><thead><tr style="background:var(--bg2);"><th style="padding:5px 8px;border:1px solid var(--bg3);">단계</th><th style="padding:5px 8px;border:1px solid var(--bg3);">동작</th><th style="padding:5px 8px;border:1px solid var(--bg3);">큐 상태</th></tr></thead><tbody><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">초기</td><td style="padding:4px 8px;border:1px solid var(--bg3);">-</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[1, 2, 3, 4]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">1</td><td style="padding:4px 8px;border:1px solid var(--bg3);"><span style="color:var(--red);">1 버림</span>, 2→아래로</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[3, 4, 2]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">2</td><td style="padding:4px 8px;border:1px solid var(--bg3);"><span style="color:var(--red);">3 버림</span>, 4→아래로</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[2, 4]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">3</td><td style="padding:4px 8px;border:1px solid var(--bg3);"><span style="color:var(--red);">2 버림</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;color:var(--green);font-weight:600;">[4] ← 정답!</td></tr></tbody></table></div>한쪽(위)에서 빼서 다른 쪽(아래)으로 넣는 패턴이에요!' },
                { title: '배열로 해볼까?', content: '배열 앞에서 빼고 뒤에 넣으면 동작은 하겠죠?<br>(<span class="lang-py">Python: <code>list.pop(0)</code></span><span class="lang-cpp">C++: <code>erase(v.begin())</code></span>)<br><br>근데 "앞에서 빼기"가 매번 뭘 하는지 생각해봐요…' },
                { title: '배열 앞에서 빼기의 함정!', content: '배열 앞에서 빼면 <strong>나머지를 전부 한 칸씩 앞으로 당겨야</strong> 해요 → <strong>O(n)</strong><div style="display:flex;justify-content:center;margin:10px 0;"><div style="display:flex;align-items:center;gap:6px;"><div style="padding:3px 10px;background:var(--red);color:white;border-radius:5px;font-size:0.8rem;opacity:0.4;text-decoration:line-through;">1</div><div style="padding:3px 10px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;">2</div><div style="font-size:0.8rem;color:var(--text3);">←</div><div style="padding:3px 10px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;">3</div><div style="font-size:0.8rem;color:var(--text3);">←</div><div style="padding:3px 10px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;">4</div><div style="font-size:0.75rem;color:var(--red);margin-left:8px;font-weight:600;">전부 이동! O(n)</div></div></div>(<span class="lang-py">Python: <code>list.pop(0)</code></span><span class="lang-cpp">C++: <code>vector.erase(begin())</code></span> 둘 다 O(n))<br><br>카드가 <strong>50만 장</strong>이면? 매번 O(n)씩 반복 → 총 O(n^2) → <strong>시간 초과!</strong><br>"앞에서 빼는 게 빠른" 자료구조가 필요합니다.' },
                { title: '큐(Queue)를 쓰면 해결!', content: '큐를 쓰면 앞에서 빼기가 <strong>O(1)</strong>!<div style="display:flex;justify-content:center;margin:10px 0;"><div style="display:flex;align-items:center;gap:4px;padding:8px 12px;background:var(--bg2);border:2px solid var(--bg3);border-radius:8px;"><div style="font-size:0.75rem;color:var(--red);margin-right:4px;">← out</div><div style="padding:3px 10px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">3</div><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">4</div><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">2</div><div style="font-size:0.75rem;color:var(--accent);margin-left:4px;">in →</div></div></div><span class="lang-py">Python: <code><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="color:var(--accent);">collections.deque</a></code>의 <code>popleft()</code></span><span class="lang-cpp">C++: <code><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="color:var(--accent);">queue&lt;int&gt;</a></code>의 <code>front()</code> + <code>pop()</code></span><br><br>앞에서 빼고 뒤에 넣는 FIFO 구조가 이 문제에 딱 맞습니다!' },
                { title: '큐가 뭔데 이렇게 빠른 거야?', content: '<strong>큐(Queue)</strong> = FIFO (선입선출) 자료구조<br>앞에서 빼기와 뒤에 넣기가 모두 <strong>O(1)</strong>이에요.<div style="display:flex;justify-content:center;margin:10px 0;"><div style="display:flex;flex-direction:column;gap:6px;align-items:center;"><div style="display:flex;align-items:center;gap:12px;"><div style="font-size:0.8rem;color:var(--red);font-weight:600;width:90px;text-align:right;">배열 pop(0)</div><div style="padding:3px 16px;background:var(--red);color:white;border-radius:5px;font-size:0.85rem;opacity:0.8;">O(n)</div></div><div style="display:flex;align-items:center;gap:12px;"><div style="font-size:0.8rem;color:var(--green);font-weight:600;width:90px;text-align:right;">큐 popleft()</div><div style="padding:3px 16px;background:var(--green);color:white;border-radius:5px;font-size:0.85rem;">O(1)</div></div></div></div><span class="lang-py">Python: <code>from collections import deque</code> → <code>popleft()</code> O(1)</span><span class="lang-cpp">C++: <code>#include &lt;queue&gt;</code> → <code>front()</code> + <code>pop()</code> O(1)</span><br><br>배열의 앞에서 빼기 O(n)과 비교하면 <strong>큰 데이터에서 차이가 어마어마</strong>해요!' }
            ],
            inputDefault: 0,
            solve() { return '4'; },
            solutions: [
                {
                    approach: '큐(deque) 시뮬레이션',
                    description: '맨 앞 카드를 버리고, 다음 카드를 뒤로 보내는 과정을 반복합니다.',
                    timeComplexity: 'O(N)',
                    spaceComplexity: 'O(N)',
                    get templates() { return stackQueueTopic.problems[3].templates; },
                    codeSteps: {
                        python: [
                            { title: '초기 설정', code: 'from collections import deque  # 양쪽 끝 O(1) 삽입/삭제\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # 1~N 카드를 큐에 (앞=맨 위)', desc: '왜 deque? → 리스트의 pop(0)은 O(n)이지만 deque.popleft()는 O(1)!\n카드를 앞에서 빼는 연산이 핵심이라 deque가 필수입니다.' },
                            { title: '반복 조건', code: 'from collections import deque  # 양쪽 끝 O(1) 삽입/삭제\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # 1~N 카드를 큐에 (앞=맨 위)\n\nwhile len(q) > 1:  # 카드 1장 남을 때까지', desc: '카드가 1장 남으면 그게 정답!\n매 반복마다 카드가 1장씩 줄어듭니다 (버리기 때문).' },
                            { title: '카드 조작', code: 'from collections import deque  # 양쪽 끝 O(1) 삽입/삭제\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # 1~N 카드를 큐에 (앞=맨 위)\n\nwhile len(q) > 1:\n    q.popleft()            # ① 맨 위 카드 버리기 (O(1))\n    q.append(q.popleft())  # ② 다음 카드를 맨 아래로 이동', desc: '핵심 2단계:\n① popleft() → 맨 위 카드를 버림\n② popleft()로 꺼내서 append()로 맨 뒤에 → 맨 아래로 이동\n모두 O(1)이라 전체 O(N)!' },
                            { title: '결과 출력', code: 'from collections import deque  # 양쪽 끝 O(1) 삽입/삭제\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # 1~N 카드를 큐에 (앞=맨 위)\n\nwhile len(q) > 1:\n    q.popleft()            # ① 맨 위 카드 버리기 (O(1))\n    q.append(q.popleft())  # ② 다음 카드를 맨 아래로 이동\n\nprint(q[0])  # 마지막 남은 카드!', desc: '마지막 남은 한 장이 정답입니다.' }
                        ],
                        cpp: [
                            { title: '초기 설정', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    queue<int> q;  // 큐: FIFO (선입선출)\n    for (int i = 1; i <= N; i++)\n        q.push(i);  // 1~N 카드를 큐에 넣기', desc: '왜 queue? → 앞에서 빼고(pop) 뒤에 넣는(push) 구조!\nC++의 queue는 <queue> 헤더에서 제공합니다.\nfront()로 맨 앞을 확인하고 pop()으로 제거합니다.' },
                            { title: '반복 조건', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    queue<int> q;  // 큐: FIFO (선입선출)\n    for (int i = 1; i <= N; i++)\n        q.push(i);\n\n    while (q.size() > 1) {  // 카드 1장 남을 때까지', desc: '카드가 1장 남으면 그게 정답!\n매 반복마다 카드가 1장씩 줄어듭니다 (버리기 때문).' },
                            { title: '카드 조작', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    queue<int> q;  // 큐: FIFO (선입선출)\n    for (int i = 1; i <= N; i++)\n        q.push(i);\n\n    while (q.size() > 1) {\n        q.pop();              // ① 맨 위 카드 버리기\n        q.push(q.front());    // ② 다음 카드를 맨 아래로 이동\n        q.pop();              // ② front를 제거 (push 후)', desc: '핵심 3단계:\n① pop() → 맨 위 카드를 버림\n② front()로 값을 읽어서 push()로 맨 뒤에 넣고\n   다시 pop()으로 원래 위치에서 제거\nC++의 pop()은 값을 반환하지 않으므로 front()로 먼저 읽어야 합니다!' },
                            { title: '결과 출력', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    queue<int> q;  // 큐: FIFO (선입선출)\n    for (int i = 1; i <= N; i++)\n        q.push(i);\n\n    while (q.size() > 1) {\n        q.pop();              // ① 맨 위 카드 버리기\n        q.push(q.front());    // ② 다음 카드를 맨 아래로 이동\n        q.pop();              // ② front를 제거\n    }\n\n    cout << q.front() << endl;  // 마지막 남은 카드!', desc: '마지막 남은 한 장이 정답입니다.\nq.front()로 큐의 맨 앞 값을 확인합니다.' }
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
                cpp: `#include <iostream>
#include <queue>
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
                <p>다음 연산을 지원하는 <code>MinStack</code> 클래스를 설계하세요.</p>
                <ul>
                    <li><code>MinStack()</code> — 스택 객체를 초기화합니다.</li>
                    <li><code>void push(int val)</code> — <code>val</code>을 스택에 넣습니다.</li>
                    <li><code>void pop()</code> — 스택의 맨 위 원소를 제거합니다.</li>
                    <li><code>int top()</code> — 스택의 맨 위 원소를 가져옵니다.</li>
                    <li><code>int getMin()</code> — 스택에서 최솟값을 가져옵니다.</li>
                </ul>
                <p>각 함수는 <strong>O(1) 시간</strong>에 동작해야 합니다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[], [-2], [0], [-3], [], [], [], []]</pre></div>
                    <div><strong>출력</strong><pre>[null, null, null, null, -3, null, 0, -2]</pre></div>
                </div><p class="example-explain">push(-2), push(0), push(-3) → getMin()=-3 → pop() → top()=0 → getMin()=-2</p></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>-2<sup>31</sup> &le; val &le; 2<sup>31</sup> - 1</li>
                    <li><code>pop</code>, <code>top</code>, <code>getMin</code>은 비어있지 않은 스택에서만 호출</li>
                    <li>최대 3 × 10<sup>4</sup>번 호출</li>
                </ul>
            `,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: '<code>push</code>, <code>pop</code>, <code>top</code>은 일반 스택이랑 똑같아요. 어려운 건 <strong>getMin()</strong>!<br><br><code>getMin()</code>이 항상 현재 스택에서 <strong>가장 작은 값을 O(1)에 반환</strong>해야 해요.<br>보통 최솟값을 찾으려면 전체를 봐야 하는데… O(1)이라고?' },
                { title: 'min 변수 하나면 되지 않을까?', content: '스택에 값을 넣을 때마다 <code>min_val = min(min_val, x)</code>로 갱신하면?<br><br><code>push(5)</code>, <code>push(2)</code>, <code>push(7)</code> → min_val = 2 ✓<br>근데 <code>pop()</code>으로 <strong>2를 빼면?</strong> min_val이 2인데 2는 이제 없잖아요!<div style="display:flex;justify-content:center;margin:10px 0;"><div style="padding:8px 14px;background:var(--red);color:white;border-radius:8px;font-size:0.85rem;opacity:0.9;">min_val=2인데 2가 사라짐 → 틀린 최솟값!</div></div>' },
                { title: 'pop하면 이전 최솟값을 어떻게 알지?', content: '2를 pop했으면 그 전의 최솟값(5)으로 <strong>돌아가야</strong> 해요.<br><br>"이전 상태로 돌아간다"… 뭔가 <strong>스택스러운</strong> 느낌이 들지 않나요?<br>각 시점의 최솟값을 "기억"해두면 어떨까요?' },
                { title: '보조 스택으로 각 시점의 최솟값 기억하기', content: '<strong>min_stack</strong>이라는 스택을 하나 더 만들자!<br><br><code>push(x)</code>할 때: min_stack에도 <code>min(x, 현재 min_stack의 top)</code>을 push<br><code>pop()</code>할 때: min_stack에서도 pop → 자동으로 이전 최솟값이 top!<br><code>getMin()</code>: min_stack의 top을 보면 끝 → <strong>O(1)!</strong><div style="display:flex;justify-content:center;gap:20px;margin:12px 0;flex-wrap:wrap;align-items:flex-end;"><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text2);font-weight:600;margin-bottom:4px;">stack</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 12px;border:2px solid var(--bg3);border-radius:8px;background:var(--bg2);"><div style="padding:3px 12px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">5</div><div style="padding:3px 12px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">2</div><div style="padding:3px 12px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;font-weight:600;">7</div></div></div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--green);font-weight:600;margin-bottom:4px;">min_stack</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 12px;border:2px solid var(--green);border-radius:8px;background:var(--bg2);"><div style="padding:3px 12px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">5</div><div style="padding:3px 12px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">2</div><div style="padding:3px 12px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;font-weight:600;box-shadow:0 0 6px var(--green);">2</div></div><div style="font-size:0.7rem;color:var(--green);margin-top:2px;">top = 현재 최솟값!</div></div></div>' },
                { title: '예시로 확인해보자', content: '<div style="overflow-x:auto;margin-bottom:10px;"><table style="border-collapse:collapse;font-size:0.82rem;width:100%;"><thead><tr style="background:var(--bg2);"><th style="padding:5px 8px;border:1px solid var(--bg3);">연산</th><th style="padding:5px 8px;border:1px solid var(--bg3);">stack</th><th style="padding:5px 8px;border:1px solid var(--bg3);">min_stack</th><th style="padding:5px 8px;border:1px solid var(--bg3);">getMin()</th></tr></thead><tbody><tr><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">push(5)</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[5]</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;color:var(--accent);font-weight:600;">[5]</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;font-weight:600;">5</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">push(2)</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[5, 2]</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;color:var(--accent);font-weight:600;">[5, 2]</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;font-weight:600;">2</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">push(7)</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[5, 2, 7]</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;color:var(--accent);font-weight:600;">[5, 2, 2]</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;font-weight:600;">2</td></tr><tr style="background:var(--warm-bg);"><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;color:var(--red);">pop()</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[5, 2]</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;color:var(--green);font-weight:600;">[5, 2]</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;font-weight:600;color:var(--green);">2 ✓</td></tr><tr style="background:var(--warm-bg);"><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;color:var(--red);">pop()</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[5]</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;color:var(--green);font-weight:600;">[5]</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;font-weight:600;color:var(--green);">5 ✓</td></tr></tbody></table></div>2가 빠졌는데 자동으로 최솟값이 5로 복원돼요!<br>보조 스택의 top이 항상 현재 최솟값을 가리키는 게 핵심입니다.' }
            ],
            inputDefault: 0,
            solve() { return '-3, 0, -2'; },
            solutions: [
                {
                    approach: '보조 스택으로 최솟값 추적',
                    description: '메인 스택과 별도로 최솟값 스택을 유지하여 O(1) getMin을 구현합니다.',
                    timeComplexity: 'O(1) per op',
                    spaceComplexity: 'O(n)',
                    get templates() { return stackQueueTopic.problems[4].templates; },
                    codeSteps: {
                        python: [
                            { title: '초기화', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # 메인 스택: 실제 데이터\n        self.min_stack = []  # 보조 스택: 각 시점의 최솟값 기록', desc: '왜 스택 2개? → getMin()을 O(1)로 하려면 "지금 최솟값이 뭔지" 항상 알아야!\nmin_stack의 top이 항상 현재 최솟값을 가리킵니다.' },
                            { title: 'push 구현', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # 메인 스택: 실제 데이터\n        self.min_stack = []  # 보조 스택: 각 시점의 최솟값 기록\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)              # 새로운 최솟값!\n        else:\n            self.min_stack.append(self.min_stack[-1])  # 최솟값 변동 없음 → 그대로 복사', desc: '핵심: push할 때 min_stack에도 항상 함께 push!\nval이 현재 최솟값 이하면 → val을 넣고\n아니면 → 기존 최솟값을 그대로 복사해서 넣음\n→ 두 스택의 높이가 항상 같다!' },
                            { title: 'pop 구현', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # 메인 스택: 실제 데이터\n        self.min_stack = []  # 보조 스택: 각 시점의 최솟값 기록\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n        else:\n            self.min_stack.append(self.min_stack[-1])\n\n    def pop(self) -> None:\n        self.stack.pop()      # 메인에서 제거\n        self.min_stack.pop()  # 보조도 같이 제거 → 높이 동기화!', desc: '왜 둘 다 pop?\n→ 두 스택 높이를 항상 동기화해야 하니까!\npop 후에도 min_stack[-1]이 정확한 최솟값을 가리킵니다.' },
                            { title: 'top과 getMin', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # 메인 스택: 실제 데이터\n        self.min_stack = []  # 보조 스택: 각 시점의 최솟값 기록\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n        else:\n            self.min_stack.append(self.min_stack[-1])\n\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()\n\n    def top(self) -> int:\n        return self.stack[-1]      # 메인 스택의 top\n\n    def getMin(self) -> int:\n        return self.min_stack[-1]  # 보조 스택의 top = 현재 최솟값! O(1)', desc: '모든 연산이 O(1)!\ntop() → stack[-1], getMin() → min_stack[-1]\n보조 스택 덕분에 최솟값을 매번 탐색할 필요가 없습니다.' }
                        ],
                        cpp: [
                            { title: '초기화', code: '#include <stack>\nusing namespace std;\n\nclass MinStack {\n    stack<int> st;       // 메인 스택: 실제 데이터\n    stack<int> minSt;    // 보조 스택: 각 시점의 최솟값 기록', desc: '왜 스택 2개? → getMin()을 O(1)로 하려면 "지금 최솟값이 뭔지" 항상 알아야!\nminSt의 top()이 항상 현재 최솟값을 가리킵니다.\nC++에서는 stack<int>로 정수 스택을 만듭니다.' },
                            { title: 'push 구현', code: '#include <stack>\nusing namespace std;\n\nclass MinStack {\n    stack<int> st;       // 메인 스택\n    stack<int> minSt;    // 보조 스택: 각 시점의 최솟값\n\npublic:\n    void push(int val) {\n        st.push(val);\n        // 보조 스택이 비었거나 새 값이 최솟값 이하면 갱신\n        if (minSt.empty() || val <= minSt.top())\n            minSt.push(val);              // 새로운 최솟값!\n        else\n            minSt.push(minSt.top());      // 기존 최솟값 유지 → 그대로 복사', desc: '핵심: push할 때 minSt에도 항상 함께 push!\nval이 현재 최솟값 이하면 → val을 넣고\n아니면 → 기존 최솟값을 그대로 복사해서 넣음\n→ 두 스택의 높이가 항상 같다!' },
                            { title: 'pop 구현', code: '#include <stack>\nusing namespace std;\n\nclass MinStack {\n    stack<int> st;       // 메인 스택\n    stack<int> minSt;    // 보조 스택: 각 시점의 최솟값\n\npublic:\n    void push(int val) {\n        st.push(val);\n        if (minSt.empty() || val <= minSt.top())\n            minSt.push(val);\n        else\n            minSt.push(minSt.top());\n    }\n\n    void pop() {\n        st.pop();      // 메인에서 제거\n        minSt.pop();   // 보조도 같이 제거 → 높이 동기화!', desc: '왜 둘 다 pop?\n→ 두 스택 높이를 항상 동기화해야 하니까!\npop 후에도 minSt.top()이 정확한 최솟값을 가리킵니다.' },
                            { title: 'top과 getMin', code: '#include <stack>\nusing namespace std;\n\nclass MinStack {\n    stack<int> st;       // 메인 스택\n    stack<int> minSt;    // 보조 스택: 각 시점의 최솟값\n\npublic:\n    void push(int val) {\n        st.push(val);\n        if (minSt.empty() || val <= minSt.top())\n            minSt.push(val);\n        else\n            minSt.push(minSt.top());\n    }\n\n    void pop() {\n        st.pop();\n        minSt.pop();\n    }\n\n    int top() {\n        return st.top();       // 메인 스택의 top\n    }\n\n    int getMin() {\n        return minSt.top();    // 보조 스택의 top = 현재 최솟값! O(1)\n    }\n};', desc: '모든 연산이 O(1)!\ntop() → st.top(), getMin() → minSt.top()\n보조 스택 덕분에 최솟값을 매번 탐색할 필요가 없습니다.' }
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
};`
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
        solveArea.innerHTML = `<div class="editor-header"><h3>풀이 작성</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option></select></div><textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea><div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ 실행</button><button id="check-btn" class="btn btn-success">✓ 정답 확인</button></div><div id="output-area" class="output-area"><div class="output-label">실행 결과</div><pre id="output-text"></pre></div>`;
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
