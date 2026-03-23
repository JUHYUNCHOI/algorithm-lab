// ===== 우선순위 큐 토픽 모듈 =====
var priorityQueueTopic = {
    id: 'priorityqueue',
    title: '우선순위 큐',
    icon: '🏥',
    category: '심화 (Gold~Platinum)',
    order: 16,
    description: '가장 중요한 것부터 꺼내는 자료구조',
    relatedNote: '우선순위 큐는 다익스트라, 허프만 코딩, 중앙값 유지, 작업 스케줄링 등 다양한 알고리즘의 핵심 도구입니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-11279': { type: '기본 힙',        color: 'var(--accent)', vizMethod: '_renderVizMaxHeap' },
        'boj-1927':  { type: '기본 힙',        color: 'var(--accent)', vizMethod: '_renderVizMinHeap' },
        'boj-11286': { type: '커스텀 힙',      color: 'var(--green)',  vizMethod: '_renderVizAbsHeap' },
        'boj-2075':  { type: '크기 제한 힙',   color: '#e17055',       vizMethod: '_renderVizNthLargest' },
        'boj-2696':  { type: '두 개의 힙',     color: '#6c5ce7',       vizMethod: '_renderVizMedianHeap' },
        'boj-1202':  { type: '그리디 + 힙',    color: '#fdcb6e',       vizMethod: '_renderVizJewelThief' }
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
            sim:     { intro: prob.simIntro || '우선순위 큐가 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
        container.innerHTML = '\
            <div class="hero">\
                <h2>\uD83C\uDFE5 우선순위 큐 (Priority Queue)</h2>\
                <p class="hero-sub">가장 중요한 것부터 먼저 꺼내는 특별한 줄서기입니다</p>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> 우선순위 큐란?</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 응급실에서는 먼저 온 사람이 아니라, <strong>가장 위급한 환자</strong>부터 치료합니다.<br><br>\
                    편의점 계산대에서는 먼저 온 순서대로 계산하지요? (FIFO)<br>\
                    하지만 응급실에서는 감기 환자보다 골절 환자가 먼저, 골절 환자보다 심정지 환자가 먼저입니다!<br><br>\
                    이처럼 <strong>우선순위가 높은 것부터 먼저 꺼내는</strong> 자료구조가 바로 <strong>우선순위 큐</strong>입니다.<br>\
                    넣을 때는 아무 순서로 넣어도 되지만, 꺼낼 때는 항상 <strong>가장 우선순위가 높은 것</strong>이 나옵니다.\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="18" width="40" height="12" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="12" cy="24" r="3" fill="currentColor"/><circle cx="22" cy="24" r="3" fill="currentColor"/><circle cx="32" cy="24" r="3" fill="currentColor"/><path d="M40 24l6-4M40 24l6 4" stroke="currentColor" stroke-width="2" fill="none"/></svg></span></div>\
                        <h3>일반 큐 (FIFO)</h3>\
                        <p>먼저 들어온 것이 먼저 나갑니다.<br>편의점 계산대처럼 순서대로!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="14" width="40" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><text x="12" y="28" font-size="10" font-weight="bold" fill="currentColor">3</text><text x="22" y="28" font-size="10" font-weight="bold" fill="currentColor">1</text><text x="32" y="28" font-size="14" font-weight="bold" fill="#e74c3c">\u2605</text><path d="M40 24l6-4M40 24l6 4" stroke="#e74c3c" stroke-width="2.5" fill="none"/></svg></span></div>\
                        <h3>우선순위 큐</h3>\
                        <p>우선순위가 높은 것이 먼저 나갑니다.<br>응급실처럼 위급한 순서대로!</p>\
                    </div>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">응급실에 감기(위험도 1), 골절(위험도 5), 심정지(위험도 10) 환자가 왔습니다. 어떤 순서로 치료할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        심정지(10) \u2192 골절(5) \u2192 감기(1) 순서입니다!<br>\
                        이것이 바로 <strong>최대 우선순위 큐</strong>입니다. 숫자가 클수록 먼저 나옵니다.<br>\
                        반대로 숫자가 작을수록 먼저 나오는 것은 <strong>최소 우선순위 큐</strong>입니다.\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 일반 큐 vs 우선순위 큐</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="text" id="pq-demo-qcmp-input" value="3,7,1,5,2" placeholder="쉼표로 구분" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:150px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="pq-demo-qcmp-btn">넣고 빼기</button>\
                        <button class="concept-demo-btn green" id="pq-demo-qcmp-reset" style="display:none;">다시</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:8px;">일반 큐 (FIFO)</div>\
                                <div id="pq-demo-qcmp-fifo" style="display:flex;gap:4px;flex-wrap:wrap;min-height:44px;"></div>\
                                <div id="pq-demo-qcmp-fifo-out" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>\
                            </div>\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:8px;">우선순위 큐 (Min-Heap)</div>\
                                <div id="pq-demo-qcmp-pq" style="display:flex;gap:4px;flex-wrap:wrap;min-height:44px;"></div>\
                                <div id="pq-demo-qcmp-pq-out" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="pq-demo-qcmp-msg">같은 값들을 넣고 하나씩 빼면, 큐는 넣은 순서대로, 우선순위 큐는 작은 순서대로 나옵니다!</div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> 힙(Heap)의 구조</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 힙은 <strong>완전 이진 트리</strong>라는 특별한 나무 모양입니다.<br>\
                    회사 조직도를 생각해 보세요! 사장님이 맨 위에, 그 아래에 부장님들, 그 아래에 과장님들...<br><br>\
                    <strong>최소 힙</strong>에서는 부모가 항상 자식보다 작습니다.<br>\
                    즉, 맨 위(루트)에 항상 <strong>가장 작은 값</strong>이 있습니다!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="36" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><line x1="20" y1="15" x2="15" y2="25" stroke="currentColor" stroke-width="2"/><line x1="28" y1="15" x2="33" y2="25" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>완전 이진 트리</h3>\
                        <p>왼쪽부터 빈틈없이 채우는<br>이진 트리입니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="#00b894" stroke-width="2.5"/><text x="24" y="14" text-anchor="middle" font-size="9" font-weight="bold" fill="#00b894">1</text><circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="14" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor">3</text><circle cx="34" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor">5</text><line x1="20" y1="15" x2="17" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="31" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>힙 속성</h3>\
                        <p>최소 힙: 부모 \u2264 자식<br>루트가 항상 최솟값!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="2" y="18" width="44" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><text x="10" y="28" font-size="8" font-weight="bold" fill="currentColor">1</text><text x="20" y="28" font-size="8" font-weight="bold" fill="currentColor">3</text><text x="30" y="28" font-size="8" font-weight="bold" fill="currentColor">5</text><text x="40" y="28" font-size="8" font-weight="bold" fill="currentColor">7</text><text x="10" y="14" font-size="7" fill="currentColor">0</text><text x="20" y="14" font-size="7" fill="currentColor">1</text><text x="30" y="14" font-size="7" fill="currentColor">2</text><text x="40" y="14" font-size="7" fill="currentColor">3</text></svg></span></div>\
                        <h3>배열로 저장</h3>\
                        <p>부모 = i//2<br>왼쪽 자식 = 2*i, 오른쪽 = 2*i+1</p>\
                    </div>\
                </div>\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 힙을 배열로 저장하기 (1-indexed)\n#\n#        1          <- 인덱스 1 (루트)\n#       / \\\\\n#      3    5       <- 인덱스 2, 3\n#     / \\\\  /\n#    7   9 8       <- 인덱스 4, 5, 6\n#\n# 배열: [-, 1, 3, 5, 7, 9, 8]  (0번 인덱스는 사용 안 함)\n#\n# 부모 인덱스:    i // 2\n# 왼쪽 자식:      i * 2\n# 오른쪽 자식:    i * 2 + 1</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 힙을 배열로 저장하기 (1-indexed)\n//\n//        1          &lt;- 인덱스 1 (루트)\n//       / \\\\\n//      3    5       &lt;- 인덱스 2, 3\n//     / \\\\  /\n//    7   9 8       &lt;- 인덱스 4, 5, 6\n//\n// 배열: {-, 1, 3, 5, 7, 9, 8}  (0번 인덱스는 사용 안 함)\n//\n// 부모 인덱스:    i / 2\n// 왼쪽 자식:      i * 2\n// 오른쪽 자식:    i * 2 + 1</code></pre></div></span>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">배열 [-, 2, 5, 3, 8, 7]에서 인덱스 2(값 5)의 부모와 자식은 무엇일까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        부모 = 2 // 2 = <strong>인덱스 1 \u2192 값 2</strong><br>\
                        왼쪽 자식 = 2 \u00D7 2 = <strong>인덱스 4 \u2192 값 8</strong><br>\
                        오른쪽 자식 = 2 \u00D7 2 + 1 = <strong>인덱스 5 \u2192 값 7</strong>\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 배열 인덱스와 트리 위치</div>\
                    <p style="color:var(--text2);font-size:0.85rem;margin-bottom:10px;">배열의 칸을 클릭하면 트리에서의 위치와 부모/자식 관계를 보여줍니다.</p>\
                    <div class="concept-demo-body">\
                        <div style="margin-bottom:8px;font-weight:600;">배열 (1-indexed)</div>\
                        <div id="pq-demo-a2t-arr" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>\
                        <div style="margin-bottom:8px;font-weight:600;">트리 구조</div>\
                        <div id="pq-demo-a2t-tree" style="position:relative;width:100%;height:150px;margin-bottom:8px;"></div>\
                        <div id="pq-demo-a2t-info" style="padding:8px 12px;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;min-height:1.5em;"></div>\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> 힙의 동작: 삽입과 삭제</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card" style="border-left:4px solid var(--green)">\
                        <h3>삽입 (Push) \u2014 위로 올라가기</h3>\
                        <p>\u2460 배열 맨 끝에 새 값을 추가합니다<br>\u2461 부모와 비교합니다<br>\u2462 부모보다 작으면 교환! (최소 힙)<br>\u2463 루트까지 반복합니다 (Sift-Up)</p>\
                    </div>\
                    <div class="concept-card" style="border-left:4px solid var(--red)">\
                        <h3>삭제 (Pop) \u2014 아래로 내려가기</h3>\
                        <p>\u2460 루트(최솟값)를 꺼냅니다<br>\u2461 마지막 원소를 루트로 이동합니다<br>\u2462 더 작은 자식과 비교합니다<br>\u2463 자식보다 크면 교환! (Sift-Down)</p>\
                    </div>\
                </div>\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 최소 힙 삽입 (Sift-Up)\ndef push(heap, val):\n    heap.append(val)\n    i = len(heap) - 1\n    while i > 1 and heap[i] < heap[i // 2]:\n        heap[i], heap[i // 2] = heap[i // 2], heap[i]\n        i = i // 2\n\n# 최소 힙 삭제 (Sift-Down)\ndef pop(heap):\n    if len(heap) <= 1:\n        return None\n    root = heap[1]\n    heap[1] = heap[-1]\n    heap.pop()\n    i = 1\n    while i * 2 < len(heap):\n        child = i * 2\n        if child + 1 < len(heap) and heap[child + 1] < heap[child]:\n            child += 1\n        if heap[i] > heap[child]:\n            heap[i], heap[child] = heap[child], heap[i]\n            i = child\n        else:\n            break\n    return root</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 최소 힙 삽입 (Sift-Up)\nvoid push(vector&lt;int&gt;&amp; heap, int val) {\n    heap.push_back(val);\n    int i = heap.size() - 1;\n    while (i &gt; 1 &amp;&amp; heap[i] &lt; heap[i / 2]) {\n        swap(heap[i], heap[i / 2]);\n        i = i / 2;\n    }\n}\n\n// 최소 힙 삭제 (Sift-Down)\nint pop(vector&lt;int&gt;&amp; heap) {\n    if (heap.size() &lt;= 1) return -1;\n    int root = heap[1];\n    heap[1] = heap.back();\n    heap.pop_back();\n    int i = 1;\n    while (i * 2 &lt; (int)heap.size()) {\n        int child = i * 2;\n        if (child + 1 &lt; (int)heap.size() &amp;&amp; heap[child + 1] &lt; heap[child])\n            child++;\n        if (heap[i] &gt; heap[child]) {\n            swap(heap[i], heap[child]);\n            i = child;\n        } else break;\n    }\n    return root;\n}</code></pre></div></span>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">최소 힙 [-, 1, 3, 5, 7]에 2를 삽입하면 어떻게 될까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        \u2460 끝에 추가: [-, 1, 3, 5, 7, <strong>2</strong>] (인덱스 5)<br>\
                        \u2461 부모(인덱스 2) = 3, 2 < 3이므로 교환!<br>\
                        \u2192 [-, 1, <strong>2</strong>, 5, 7, <strong>3</strong>]<br>\
                        \u2462 부모(인덱스 1) = 1, 2 > 1이므로 끝!<br>\
                        결과: [-, 1, 2, 5, 7, 3]\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — Sift-Up 삽입 애니메이션</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <label style="font-size:0.85rem;color:var(--text2);">현재 힙:</label>\
                        <input type="text" id="pq-demo-sift-heap" value="1,3,5,7,9" placeholder="쉼표로 구분" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:140px;background:var(--card);color:var(--text);">\
                        <label style="font-size:0.85rem;color:var(--text2);">삽입할 값:</label>\
                        <input type="number" id="pq-demo-sift-val" value="2" style="padding:6px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="pq-demo-sift-btn">삽입!</button>\
                        <button class="concept-demo-btn green" id="pq-demo-sift-reset" style="display:none;">다시</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;">힙 배열</div>\
                        <div id="pq-demo-sift-arr" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;min-height:44px;"></div>\
                        <div id="pq-demo-sift-info" style="padding:8px 12px;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="pq-demo-sift-msg">값을 넣으면 맨 끝에 추가한 뒤, 부모와 비교하며 위로 올라가는 Sift-Up 과정을 봅니다.</div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> <span class="lang-py">파이썬의 heapq</span><span class="lang-cpp">C++의 priority_queue</span> 사용법</div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 최소 힙 vs 최대 힙</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">숫자를 push하고, 최소 힙 / 최대 힙에서 pop하면 어떤 순서로 나오는지 비교하세요!</p>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">\
                            <input type="text" id="pq-s4-input" value="5,1,8,3" placeholder="쉼표 구분" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:120px;background:var(--card);color:var(--text);">\
                            <button class="concept-demo-btn" id="pq-s4-go">Push 후 전부 Pop</button>\
                        </div>\
                        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:140px;">\
                                <div style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">최소 힙 (Min)</div>\
                                <div id="pq-s4-min" style="font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                            </div>\
                            <div style="flex:1;min-width:140px;">\
                                <div style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">최대 힙 (Max)</div>\
                                <div id="pq-s4-max" style="font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="pq-s4-msg"><span class="lang-py">Python heapq는 기본 최소 힙. 최대 힙은 -1 곱하기 트릭!</span><span class="lang-cpp">C++ priority_queue는 기본 최대 힙. 최소 힙은 greater&lt;&gt; 사용!</span></div>\
                </div>\
            </div>\
            <span class="lang-py"><div class="concept-section" style="margin-top:0;">\
                <div class="concept-section-title"><span class="section-num">4</span> 파이썬의 heapq 사용법</div>\
                <div style="margin:0.5rem 0 0.8rem;">\
                    <a href="https://docs.python.org/3/library/heapq.html" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: heapq ↗</a>\
                    <p style="font-size:0.85rem;color:var(--text2);margin-top:4px;"><code>heapq</code> \u2014 Python 표준 라이브러리의 최소 힙 구현 모듈입니다.</p>\
                </div>\
                <div class="code-block"><pre><code class="language-python">import heapq\n\nheap = []\nheapq.heappush(heap, 5)\nheapq.heappush(heap, 1)\nheapq.heappush(heap, 3)\nprint(heapq.heappop(heap))  # 1 (가장 작은 값)\n\n# 최대 힙 트릭: -1을 곱해서 넣고, 꺼낼 때 다시 -1을 곱합니다\nmax_heap = []\nheapq.heappush(max_heap, -5)\nprint(-heapq.heappop(max_heap))  # 5\n\n# 튜플로 정렬 기준 바꾸기\nabs_heap = []\nheapq.heappush(abs_heap, (abs(-3), -3))\nheapq.heappush(abs_heap, (abs(2), 2))\nval = heapq.heappop(abs_heap)  # (2, 2)</code></pre></div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card"><h3>heappush / heappop</h3><p>둘 다 O(log N)입니다.<br>Python heapq는 항상 <strong>최소 힙</strong>입니다!</p></div>\
                    <div class="concept-card"><h3>최대 힙 트릭</h3><p>값에 <strong>-1을 곱해서</strong> 넣고,<br>꺼낼 때 다시 -1을 곱합니다!</p></div>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">heapq로 절댓값이 가장 작은 수를 먼저 꺼내려면 어떻게 해야 할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>(abs(x), x)</strong> 튜플을 넣으면 됩니다!<br>\
                        절댓값이 같으면 두 번째 원소(실제 값)가 작은 것이 먼저 나옵니다.<br>\
                        이것이 바로 <strong>절댓값 힙</strong> 문제의 핵심입니다!\
                    </div>\
                </div>\
            </div></span>\
            <span class="lang-cpp"><div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> C++의 priority_queue 사용법</div>\
                <div style="margin:0.5rem 0 0.8rem;">\
                    <a href="https://en.cppreference.com/w/cpp/container/priority_queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: priority_queue ↗</a>\
                    <p style="font-size:0.85rem;color:var(--text2);margin-top:4px;"><code>priority_queue</code> \u2014 &lt;queue&gt; 헤더에 있는 C++ 표준 라이브러리의 힙 기반 컨테이너 어댑터입니다.</p>\
                </div>\
                <div class="code-block"><pre><code class="language-cpp">#include &lt;queue&gt;\n#include &lt;vector&gt;\n#include &lt;iostream&gt;\nusing namespace std;\n\n// 기본: 최대 힙\npriority_queue&lt;int&gt; maxPQ;\nmaxPQ.push(5);\nmaxPQ.push(1);\nmaxPQ.push(3);\ncout &lt;&lt; maxPQ.top() &lt;&lt; endl;  // 5 (가장 큰 값)\nmaxPQ.pop();\n\n// 최소 힙: greater 비교자 사용\npriority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; minPQ;\nminPQ.push(5);\nminPQ.push(1);\nminPQ.push(3);\ncout &lt;&lt; minPQ.top() &lt;&lt; endl;  // 1 (가장 작은 값)\nminPQ.pop();\n\n// pair로 정렬 기준 바꾸기\npriority_queue&lt;pair&lt;int,int&gt;, vector&lt;pair&lt;int,int&gt;&gt;, greater&lt;pair&lt;int,int&gt;&gt;&gt; absPQ;\nabsPQ.push({abs(-3), -3});\nabsPQ.push({abs(2), 2});\nauto val = absPQ.top();  // {2, 2}\nabsPQ.pop();</code></pre></div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card"><h3>push / top / pop</h3><p>push, pop은 O(log N), top은 O(1)입니다.<br>C++ priority_queue는 기본 <strong>최대 힙</strong>입니다!</p></div>\
                    <div class="concept-card"><h3>최소 힙 만들기</h3><p><code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code>로<br><strong>최소 힙</strong>을 만들 수 있습니다!</p></div>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">priority_queue로 절댓값이 가장 작은 수를 먼저 꺼내려면 어떻게 해야 할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>{abs(x), x}</strong> pair를 최소 힙에 넣으면 됩니다!<br>\
                        절댓값이 같으면 두 번째 원소(실제 값)가 작은 것이 먼저 나옵니다.<br>\
                        이것이 바로 <strong>절댓값 힙</strong> 문제의 핵심입니다!\
                    </div>\
                </div>\
            </div></span>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> 힙 시뮬레이터</div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — Push / Pop 시뮬레이터</div>\
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="number" id="pq-demo-sim-val" value="4" style="padding:6px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="pq-demo-sim-push">Push</button>\
                        <button class="concept-demo-btn" id="pq-demo-sim-pop" style="background:var(--red);color:#fff;">Pop</button>\
                        <button class="concept-demo-btn green" id="pq-demo-sim-clear">Clear</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:200px;">\
                                <div style="font-weight:600;margin-bottom:8px;">트리 뷰</div>\
                                <div id="pq-demo-sim-tree" style="position:relative;width:100%;min-height:140px;margin-bottom:8px;"></div>\
                            </div>\
                            <div style="flex:1;min-width:150px;">\
                                <div style="font-weight:600;margin-bottom:8px;">배열 뷰</div>\
                                <div id="pq-demo-sim-arr" style="display:flex;gap:4px;flex-wrap:wrap;min-height:44px;margin-bottom:8px;"></div>\
                            </div>\
                        </div>\
                        <div id="pq-demo-sim-log" style="padding:8px 12px;background:var(--bg);border-radius:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;max-height:100px;overflow-y:auto;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="pq-demo-sim-msg">Push로 값을 넣고, Pop으로 최솟값을 꺼내 봅니다. 트리와 배열이 동시에 변합니다!</div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">6</span> 우선순위 큐 문제 푸는 팁</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <span class="lang-py"><div class="concept-card"><h3>\u2460 기본 힙 연산</h3><p>heappush/heappop으로<br>최대\u00B7최소\u00B7절댓값 힙을 구현합니다.</p></div></span>\
                    <span class="lang-cpp"><div class="concept-card"><h3>\u2460 기본 힙 연산</h3><p>push/top/pop으로<br>최대\u00B7최소\u00B7절댓값 힙을 구현합니다.</p></div></span>\
                    <div class="concept-card"><h3>\u2461 크기 제한 힙</h3><p>힙 크기를 N개로 유지하여<br><strong>N번째 큰 수</strong>를 효율적으로 구합니다.</p></div>\
                    <div class="concept-card"><h3>\u2462 두 개의 힙</h3><p>최대 힙 + 최소 힙으로<br><strong>중앙값</strong>을 실시간으로 구합니다.</p></div>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">보석 도둑 문제에서 왜 그리디 + 힙이 필요할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        가방을 <strong>용량이 작은 순서</strong>로 처리합니다.<br>\
                        각 가방에 들어갈 수 있는 보석들을 <strong>최대 힙</strong>에 넣고, 가장 비싼 것을 꺼냅니다.<br><br>\
                        작은 가방에 넣을 수 있는 보석은 큰 가방에도 넣을 수 있으므로,<br>\
                        한 번 힙에 넣은 보석은 다시 빼지 않아도 됩니다!\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">유형 맞추기 퀴즈</div>\
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">각 문제에 가장 적합한 힙/우선순위 큐 패턴을 골라보세요!</p>\
                    <div id="pq-demo-quiz" style="display:flex;flex-direction:column;gap:12px;"></div>\
                    <div id="pq-demo-quiz-score" style="margin-top:12px;padding:8px 12px;background:var(--bg);border-radius:8px;text-align:center;min-height:1.5em;font-size:0.9rem;"></div>\
                </div>\
            </div>\
        ';
        this._initConceptInteractions(container);
        this._initConceptDemos(container);
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

    _initConceptDemos: function(container) {
        // Helper: render tree from array (1-indexed)
        function renderTree(treeEl, heap, highlightIdx) {
            treeEl.innerHTML = '';
            if (heap.length <= 1) { treeEl.innerHTML = '<span style="color:var(--text3);">비어있음</span>'; return; }
            var levels = Math.ceil(Math.log2(heap.length));
            var nodeW = 40, nodeH = 40;
            var totalW = treeEl.offsetWidth || 300;
            // Draw edges first, then nodes
            for (var i = 1; i < heap.length; i++) {
                var level = Math.floor(Math.log2(i));
                var posInLevel = i - Math.pow(2, level);
                var totalInLevel = Math.pow(2, level);
                var x = totalW * (posInLevel + 0.5) / totalInLevel;
                var y = level * 45 + 10;
                // Edge to parent
                if (i > 1) {
                    var pi = Math.floor(i / 2);
                    var pLevel = Math.floor(Math.log2(pi));
                    var pPos = pi - Math.pow(2, pLevel);
                    var pTotal = Math.pow(2, pLevel);
                    var px = totalW * (pPos + 0.5) / pTotal;
                    var py = pLevel * 45 + 10;
                    var line = document.createElement('div');
                    line.style.cssText = 'position:absolute;height:2px;background:var(--border);transform-origin:0 0;';
                    var dx = x - px, dy = y - py;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    line.style.width = dist + 'px';
                    line.style.left = px + 'px';
                    line.style.top = (py + nodeH / 2) + 'px';
                    line.style.transform = 'rotate(' + angle + 'deg)';
                    treeEl.appendChild(line);
                }
            }
            for (var i = 1; i < heap.length; i++) {
                var level = Math.floor(Math.log2(i));
                var posInLevel = i - Math.pow(2, level);
                var totalInLevel = Math.pow(2, level);
                var x = totalW * (posInLevel + 0.5) / totalInLevel;
                var y = level * 45 + 10;
                var node = document.createElement('div');
                node.style.cssText = 'position:absolute;width:' + nodeW + 'px;height:' + nodeH + 'px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;transition:all 0.3s ease;';
                node.style.left = (x - nodeW / 2) + 'px';
                node.style.top = y + 'px';
                if (highlightIdx === i) {
                    node.style.background = 'var(--yellow)';
                    node.style.color = '#333';
                    node.style.boxShadow = '0 0 10px var(--yellow)80';
                } else {
                    node.style.background = 'var(--accent)';
                    node.style.color = '#fff';
                }
                node.textContent = heap[i];
                treeEl.appendChild(node);
            }
            treeEl.style.height = (levels * 45 + 20) + 'px';
        }

        function renderArrBoxes(arrEl, heap, highlightIdx) {
            arrEl.innerHTML = '';
            for (var i = 1; i < heap.length; i++) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.style.cssText = 'min-width:36px;text-align:center;transition:all 0.3s ease;';
                if (highlightIdx === i) {
                    box.style.background = 'var(--yellow)20';
                    box.style.boxShadow = '0 0 6px var(--yellow)60';
                }
                box.innerHTML = '<div class="str-char-idx" style="font-size:0.6rem;">' + i + '</div><div class="str-char-val">' + heap[i] + '</div>';
                arrEl.appendChild(box);
            }
            if (heap.length <= 1) arrEl.innerHTML = '<span style="color:var(--text3);">비어있음</span>';
        }

        // ===== 섹션 4 데모: 최소 힙 vs 최대 힙 =====
        (function() {
            var inputEl = container.querySelector('#pq-s4-input');
            var minEl = container.querySelector('#pq-s4-min');
            var maxEl = container.querySelector('#pq-s4-max');
            var goBtn = container.querySelector('#pq-s4-go');
            if (!goBtn) return;
            goBtn.addEventListener('click', function() {
                var vals = inputEl.value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
                if (!vals.length) return;
                var sorted = vals.slice().sort(function(a,b) { return a-b; });
                var rSorted = vals.slice().sort(function(a,b) { return b-a; });
                var minBoxes = sorted.map(function(v,i) {
                    return '<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:var(--green);color:#fff;font-weight:700;font-size:0.9rem;">' + v + '</span>';
                }).join(' → ');
                var maxBoxes = rSorted.map(function(v,i) {
                    return '<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:var(--accent);color:#fff;font-weight:700;font-size:0.9rem;">' + v + '</span>';
                }).join(' → ');
                minEl.innerHTML = 'Pop 순서: ' + minBoxes;
                maxEl.innerHTML = 'Pop 순서: ' + maxBoxes;
            });
        })();

        // ===== Demo 1: 큐 vs 우선순위 큐 =====
        {
            var qcmpBtn = container.querySelector('#pq-demo-qcmp-btn');
            var qcmpReset = container.querySelector('#pq-demo-qcmp-reset');
            var qcmpInput = container.querySelector('#pq-demo-qcmp-input');
            var fifoEl = container.querySelector('#pq-demo-qcmp-fifo');
            var pqEl = container.querySelector('#pq-demo-qcmp-pq');
            var fifoOut = container.querySelector('#pq-demo-qcmp-fifo-out');
            var pqOut = container.querySelector('#pq-demo-qcmp-pq-out');
            var qcmpMsg = container.querySelector('#pq-demo-qcmp-msg');
            var qcmpAnimating = false;

            function parseQArr(str) {
                return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
            }
            function makeBox(val, bg) {
                return '<div style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:' + bg + ';color:#fff;font-weight:700;font-size:0.9rem;transition:all 0.3s ease;">' + val + '</div>';
            }

            if (qcmpBtn) {
                qcmpBtn.addEventListener('click', function() {
                    if (qcmpAnimating) return;
                    qcmpAnimating = true;
                    qcmpBtn.style.display = 'none';
                    qcmpReset.style.display = '';
                    var vals = parseQArr(qcmpInput.value);
                    if (vals.length === 0) { qcmpMsg.textContent = '값을 입력해주세요!'; qcmpAnimating = false; qcmpBtn.style.display = ''; qcmpReset.style.display = 'none'; return; }

                    // Phase 1: Insert all
                    fifoEl.innerHTML = '';
                    pqEl.innerHTML = '';
                    fifoOut.textContent = '';
                    pqOut.textContent = '';
                    var fifoQueue = [];
                    var pqArr = [];
                    var insertStep = 0;

                    function insertNext() {
                        if (insertStep >= vals.length) {
                            fifoOut.textContent = '모두 넣었습니다! 이제 하나씩 뺍니다...';
                            pqOut.textContent = '모두 넣었습니다! 이제 하나씩 뺍니다...';
                            setTimeout(popNext, 800);
                            return;
                        }
                        var v = vals[insertStep];
                        fifoQueue.push(v);
                        pqArr.push(v);
                        pqArr.sort(function(a, b) { return a - b; });
                        fifoEl.innerHTML = fifoQueue.map(function(x) { return makeBox(x, 'var(--accent)'); }).join('');
                        pqEl.innerHTML = pqArr.map(function(x) { return makeBox(x, 'var(--green)'); }).join('');
                        insertStep++;
                        setTimeout(insertNext, 500);
                    }

                    // Phase 2: Pop all
                    var fifoPopped = [];
                    var pqPopped = [];
                    function popNext() {
                        if (fifoQueue.length === 0) {
                            fifoOut.innerHTML = '나온 순서: <strong>' + fifoPopped.join(' \u2192 ') + '</strong>';
                            pqOut.innerHTML = '나온 순서: <strong style="color:var(--green);">' + pqPopped.join(' \u2192 ') + '</strong>';
                            qcmpMsg.textContent = '큐는 넣은 순서 그대로, 우선순위 큐는 작은 값부터 나옵니다!';
                            qcmpAnimating = false;
                            return;
                        }
                        var fv = fifoQueue.shift();
                        fifoPopped.push(fv);
                        var pv = pqArr.shift();
                        pqPopped.push(pv);
                        fifoEl.innerHTML = fifoQueue.map(function(x) { return makeBox(x, 'var(--accent)'); }).join('');
                        pqEl.innerHTML = pqArr.map(function(x) { return makeBox(x, 'var(--green)'); }).join('');
                        if (fifoQueue.length === 0) { fifoEl.innerHTML = '<span style="color:var(--text3);">비어있음</span>'; pqEl.innerHTML = '<span style="color:var(--text3);">비어있음</span>'; }
                        fifoOut.innerHTML = '나온 값: ' + fifoPopped.join(' \u2192 ');
                        pqOut.innerHTML = '나온 값: ' + pqPopped.join(' \u2192 ');
                        setTimeout(popNext, 600);
                    }

                    insertNext();
                });

                qcmpReset.addEventListener('click', function() {
                    qcmpAnimating = false;
                    qcmpBtn.style.display = '';
                    qcmpReset.style.display = 'none';
                    fifoEl.innerHTML = '';
                    pqEl.innerHTML = '';
                    fifoOut.textContent = '';
                    pqOut.textContent = '';
                    qcmpMsg.textContent = '같은 값들을 넣고 하나씩 빼면, 큐는 넣은 순서대로, 우선순위 큐는 작은 순서대로 나옵니다!';
                });
            }
        }

        // ===== Demo 2: 배열 <-> 트리 변환 =====
        {
            var a2tArr = container.querySelector('#pq-demo-a2t-arr');
            var a2tTree = container.querySelector('#pq-demo-a2t-tree');
            var a2tInfo = container.querySelector('#pq-demo-a2t-info');
            var heapVals = [null, 1, 3, 5, 7, 9, 8]; // 1-indexed

            if (a2tArr) {
                function renderA2T(highlightIdx) {
                    a2tArr.innerHTML = '';
                    for (var i = 1; i < heapVals.length; i++) {
                        var box = document.createElement('div');
                        box.className = 'str-char-box';
                        box.style.cssText = 'min-width:38px;text-align:center;cursor:pointer;transition:all 0.3s ease;';
                        box.dataset.idx = i;
                        if (highlightIdx === i) {
                            box.style.background = 'var(--yellow)20';
                            box.style.boxShadow = '0 0 8px var(--yellow)60';
                        }
                        box.innerHTML = '<div class="str-char-idx" style="font-size:0.6rem;">i=' + i + '</div><div class="str-char-val">' + heapVals[i] + '</div>';
                        box.addEventListener('click', function() {
                            var idx = parseInt(this.dataset.idx);
                            renderA2T(idx);
                            var parent = Math.floor(idx / 2);
                            var left = idx * 2;
                            var right = idx * 2 + 1;
                            var info = '<strong>인덱스 ' + idx + '</strong> (값: ' + heapVals[idx] + ')<br>';
                            info += '부모: ' + (parent >= 1 ? 'i/' + 2 + ' = 인덱스 ' + parent + ' (값: ' + heapVals[parent] + ')' : '없음 (루트)') + '<br>';
                            info += '왼쪽 자식: ' + (left < heapVals.length ? '2*i = 인덱스 ' + left + ' (값: ' + heapVals[left] + ')' : '없음') + '<br>';
                            info += '오른쪽 자식: ' + (right < heapVals.length ? '2*i+1 = 인덱스 ' + right + ' (값: ' + heapVals[right] + ')' : '없음');
                            a2tInfo.innerHTML = info;
                        });
                        a2tArr.appendChild(box);
                    }
                    renderTree(a2tTree, heapVals, highlightIdx);
                }
                renderA2T(null);
                a2tInfo.innerHTML = '배열의 칸을 클릭해보세요!';
            }
        }

        // ===== Demo 3: Sift-Up 삽입 =====
        {
            var siftBtn = container.querySelector('#pq-demo-sift-btn');
            var siftReset = container.querySelector('#pq-demo-sift-reset');
            var siftHeapInput = container.querySelector('#pq-demo-sift-heap');
            var siftValInput = container.querySelector('#pq-demo-sift-val');
            var siftArrEl = container.querySelector('#pq-demo-sift-arr');
            var siftInfo = container.querySelector('#pq-demo-sift-info');
            var siftMsg = container.querySelector('#pq-demo-sift-msg');
            var siftAnimating = false;

            function parseSiftArr(str) {
                return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
            }
            function renderSiftArr(heap, highlightIdx) {
                renderArrBoxes(siftArrEl, heap, highlightIdx);
            }

            if (siftBtn) {
                var initHeap = parseSiftArr(siftHeapInput.value);
                var h0 = [null].concat(initHeap);
                renderSiftArr(h0, null);
                siftInfo.innerHTML = '삽입 버튼을 눌러 Sift-Up을 확인하세요';

                siftBtn.addEventListener('click', function() {
                    if (siftAnimating) return;
                    siftAnimating = true;
                    siftBtn.style.display = 'none';
                    siftReset.style.display = '';
                    var heapArr = parseSiftArr(siftHeapInput.value);
                    var val = parseInt(siftValInput.value);
                    if (isNaN(val)) { siftMsg.textContent = '삽입할 값을 입력하세요!'; siftAnimating = false; siftBtn.style.display = ''; siftReset.style.display = 'none'; return; }
                    var heap = [null].concat(heapArr);
                    heap.push(val);
                    var idx = heap.length - 1;
                    renderSiftArr(heap, idx);
                    siftInfo.innerHTML = '<strong>' + val + '</strong>을 맨 끝(인덱스 ' + idx + ')에 추가했습니다';

                    function siftStep() {
                        if (idx <= 1) { siftInfo.innerHTML = '<strong style="color:var(--green);">루트에 도달! Sift-Up 완료.</strong> 결과: [' + heap.slice(1).join(', ') + ']'; siftAnimating = false; return; }
                        var parent = Math.floor(idx / 2);
                        if (heap[idx] < heap[parent]) {
                            siftInfo.innerHTML = heap[idx] + ' < ' + heap[parent] + ' (부모) \u2192 <strong>교환!</strong>';
                            var tmp = heap[idx]; heap[idx] = heap[parent]; heap[parent] = tmp;
                            idx = parent;
                            renderSiftArr(heap, idx);
                            setTimeout(siftStep, 800);
                        } else {
                            siftInfo.innerHTML = heap[idx] + ' \u2265 ' + heap[parent] + ' (부모) \u2192 <strong style="color:var(--green);">Sift-Up 완료!</strong> 결과: [' + heap.slice(1).join(', ') + ']';
                            renderSiftArr(heap, null);
                            siftAnimating = false;
                        }
                    }
                    setTimeout(siftStep, 800);
                });

                siftReset.addEventListener('click', function() {
                    siftAnimating = false;
                    siftBtn.style.display = '';
                    siftReset.style.display = 'none';
                    var h = [null].concat(parseSiftArr(siftHeapInput.value));
                    renderSiftArr(h, null);
                    siftInfo.innerHTML = '삽입 버튼을 눌러 Sift-Up을 확인하세요';
                    siftMsg.textContent = '값을 넣으면 맨 끝에 추가한 뒤, 부모와 비교하며 위로 올라가는 Sift-Up 과정을 봅니다.';
                });
            }
        }

        // ===== Demo 4: Push/Pop 시뮬레이터 =====
        {
            var simPush = container.querySelector('#pq-demo-sim-push');
            var simPop = container.querySelector('#pq-demo-sim-pop');
            var simClear = container.querySelector('#pq-demo-sim-clear');
            var simValInput = container.querySelector('#pq-demo-sim-val');
            var simTreeEl = container.querySelector('#pq-demo-sim-tree');
            var simArrEl = container.querySelector('#pq-demo-sim-arr');
            var simLog = container.querySelector('#pq-demo-sim-log');
            var simHeap = [null]; // 1-indexed

            function siftUp(heap, idx) {
                while (idx > 1) {
                    var parent = Math.floor(idx / 2);
                    if (heap[idx] < heap[parent]) {
                        var tmp = heap[idx]; heap[idx] = heap[parent]; heap[parent] = tmp;
                        idx = parent;
                    } else break;
                }
            }
            function siftDown(heap, idx) {
                while (idx * 2 < heap.length) {
                    var child = idx * 2;
                    if (child + 1 < heap.length && heap[child + 1] < heap[child]) child++;
                    if (heap[idx] > heap[child]) {
                        var tmp = heap[idx]; heap[idx] = heap[child]; heap[child] = tmp;
                        idx = child;
                    } else break;
                }
            }
            function renderSim(hl) {
                renderTree(simTreeEl, simHeap, hl);
                renderArrBoxes(simArrEl, simHeap, hl);
            }

            if (simPush) {
                renderSim(null);
                simLog.textContent = 'Push/Pop 버튼으로 힙을 조작해보세요.';

                simPush.addEventListener('click', function() {
                    var val = parseInt(simValInput.value);
                    if (isNaN(val)) return;
                    simHeap.push(val);
                    siftUp(simHeap, simHeap.length - 1);
                    renderSim(simHeap.length - 1);
                    simLog.innerHTML = 'Push(' + val + ') \u2192 배열: [' + simHeap.slice(1).join(', ') + ']<br>' + simLog.innerHTML;
                });

                simPop.addEventListener('click', function() {
                    if (simHeap.length <= 1) { simLog.innerHTML = '힙이 비어있습니다!<br>' + simLog.innerHTML; return; }
                    var popped = simHeap[1];
                    simHeap[1] = simHeap[simHeap.length - 1];
                    simHeap.pop();
                    if (simHeap.length > 1) siftDown(simHeap, 1);
                    renderSim(1);
                    simLog.innerHTML = 'Pop() \u2192 <strong>' + popped + '</strong> 꺼냄! 남은 배열: [' + simHeap.slice(1).join(', ') + ']<br>' + simLog.innerHTML;
                });

                simClear.addEventListener('click', function() {
                    simHeap = [null];
                    renderSim(null);
                    simLog.textContent = '힙을 초기화했습니다.';
                });
            }
        }

        // ===== Demo 5: 유형 맞추기 퀴즈 =====
        {
            var quizEl = container.querySelector('#pq-demo-quiz');
            var quizScore = container.querySelector('#pq-demo-quiz-score');
            if (quizEl) {
                var quizData = [
                    { q: '"계속 숫자가 들어오는데, 매번 가장 큰 수를 출력하라"', a: '최대 힙', choices: ['최대 힙', '최소 힙', '정렬', '스택'] },
                    { q: '"N개 중 K번째로 큰 수를 구하라"', a: '크기 제한 힙', choices: ['완전 탐색', '크기 제한 힙', '이분 탐색', '정렬'] },
                    { q: '"계속 숫자가 들어오고, 매번 중앙값을 출력하라"', a: '두 개의 힙', choices: ['정렬', '최소 힙', '두 개의 힙', '이분 탐색'] },
                    { q: '"가방에 넣을 수 있는 보석 중 가장 비싼 것을 선택하라"', a: '그리디 + 힙', choices: ['DP', '그리디 + 힙', 'BFS', '투 포인터'] },
                    { q: '"그래프에서 가중치가 가장 작은 간선부터 처리하라"', a: '최소 힙', choices: ['스택', 'DFS', '최소 힙', '큐'] }
                ];
                var correct = 0;
                var answered = 0;

                quizData.forEach(function(item, idx) {
                    var qDiv = document.createElement('div');
                    qDiv.style.cssText = 'padding:12px 16px;background:var(--bg2);border-radius:10px;border:1px solid var(--border);';
                    var qText = document.createElement('div');
                    qText.style.cssText = 'font-weight:600;margin-bottom:8px;font-size:0.9rem;';
                    qText.textContent = (idx + 1) + '. ' + item.q;
                    qDiv.appendChild(qText);
                    var btnsDiv = document.createElement('div');
                    btnsDiv.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
                    item.choices.forEach(function(ch) {
                        var btn = document.createElement('button');
                        btn.className = 'concept-demo-btn';
                        btn.style.cssText = 'font-size:0.8rem;padding:4px 12px;';
                        btn.textContent = ch;
                        btn.addEventListener('click', function() {
                            if (qDiv.dataset.done) return;
                            qDiv.dataset.done = '1';
                            answered++;
                            var isCorrect = (ch === item.a);
                            if (isCorrect) {
                                correct++;
                                btn.style.background = 'var(--green)';
                                btn.style.color = '#fff';
                                btn.style.boxShadow = '0 0 8px var(--green)60';
                            } else {
                                btn.style.background = 'var(--red)';
                                btn.style.color = '#fff';
                                btnsDiv.querySelectorAll('button').forEach(function(b) {
                                    if (b.textContent === item.a) { b.style.background = 'var(--green)'; b.style.color = '#fff'; }
                                });
                            }
                            if (answered === quizData.length) {
                                quizScore.innerHTML = '<strong>' + correct + '/' + quizData.length + '</strong> 정답! ' + (correct === quizData.length ? '완벽합니다!' : '틀린 문제를 다시 확인해보세요.');
                                quizScore.style.color = correct === quizData.length ? 'var(--green)' : 'var(--text)';
                            } else {
                                quizScore.textContent = correct + '/' + answered + ' 정답 (' + (quizData.length - answered) + '문제 남음)';
                            }
                        });
                        btnsDiv.appendChild(btn);
                    });
                    qDiv.appendChild(btnsDiv);
                    quizEl.appendChild(qDiv);
                });
            }
        }
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

    // ====================================================================
    // 시뮬레이션 1: 최대 힙 (boj-11279)
    // ====================================================================
    _renderVizMaxHeap: function(container) {
        var self = this, suffix = '-maxheap';
        var DEFAULT_OPS = '1 1, 1 2, 1 3, 0, 0, 0';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">연산: <input type="text" id="pq-maxh-input" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;"></label>' +
            '<button class="btn btn-primary" id="pq-maxh-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">형식: "1 값" = 삽입, "0" = 삭제 (쉼표 구분). 예: 1 5, 1 3, 0, 1 7, 0</p>' +
            self._createStepDesc(suffix) +
            '<div id="mxh-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="mxh-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#mxh-arr' + suffix);
        var infoEl = container.querySelector('#mxh-info' + suffix);
        function renderHeap(h, msg) {
            arrEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">비어있음</span>' :
                h.map(function(v) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--accent);color:white;font-weight:700;">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseOps(str) {
            return str.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; }).map(function(s) {
                var parts = s.split(/\s+/);
                if (parts[0] === '0') return { type: 'pop' };
                return { type: 'push', val: parseInt(parts[1]) || 0 };
            });
        }
        function buildSteps(ops) {
            var heap = [], states = [{ h: [], msg: '최대 힙에 값을 넣고 빼봅니다.' }];
            ops.forEach(function(op) {
                if (op.type === 'push') {
                    heap.push(op.val); heap.sort(function(a, b) { return b - a; });
                    states.push({ h: heap.slice(), msg: op.val + ' 삽입 후 정렬 유지! 힙: [' + heap.join(', ') + '] — 최대 힙이므로 가장 큰 값이 항상 맨 앞' });
                } else {
                    if (heap.length === 0) {
                        states.push({ h: [], msg: '힙이 비어있어 0 출력 — 삭제할 원소가 없는 경우' });
                    } else {
                        var popped = heap.shift();
                        states.push({ h: heap.slice(), msg: '최댓값 ' + popped + ' 꺼냄! — 최대 힙의 루트가 항상 최댓값이므로 O(log N)에 제거' });
                    }
                }
            });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({
                        description: cur.msg,
                        action: function() { renderHeap(cur.h, cur.msg); },
                        undo: function() { renderHeap(prev.h, prev.msg); }
                    });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(opsStr) {
            var ops = parseOps(opsStr);
            var result = buildSteps(ops);
            renderHeap(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-maxh-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-maxh-input').value);
        });
        runSim(DEFAULT_OPS);
    },

    // ====================================================================
    // 시뮬레이션 2: 최소 힙 (boj-1927)
    // ====================================================================
    _renderVizMinHeap: function(container) {
        var self = this, suffix = '-minheap';
        var DEFAULT_OPS = '1 5, 1 1, 1 3, 1 2, 0, 0, 0, 0';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">연산: <input type="text" id="pq-minh-input" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;"></label>' +
            '<button class="btn btn-primary" id="pq-minh-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">형식: "1 값" = 삽입, "0" = 삭제 (쉼표 구분). 예: 1 5, 1 1, 0, 1 3, 0</p>' +
            self._createStepDesc(suffix) +
            '<div id="mnh-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="mnh-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#mnh-arr' + suffix);
        var infoEl = container.querySelector('#mnh-info' + suffix);
        function renderHeap(h, msg) {
            arrEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">비어있음</span>' :
                h.map(function(v) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--green);color:white;font-weight:700;">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseOps(str) {
            return str.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; }).map(function(s) {
                var parts = s.split(/\s+/);
                if (parts[0] === '0') return { type: 'pop' };
                return { type: 'push', val: parseInt(parts[1]) || 0 };
            });
        }
        function buildSteps(ops) {
            var heap = [], states = [{ h: [], msg: '최소 힙에 값을 넣고 빼봅니다.' }];
            ops.forEach(function(op) {
                if (op.type === 'push') {
                    heap.push(op.val); heap.sort(function(a, b) { return a - b; });
                    states.push({ h: heap.slice(), msg: op.val + ' 삽입 후 정렬 유지! 힙: [' + heap.join(', ') + '] — 최소 힙이므로 가장 작은 값이 항상 맨 앞' });
                } else {
                    if (heap.length === 0) {
                        states.push({ h: [], msg: '힙이 비어있어 0 출력 — 삭제할 원소가 없는 경우' });
                    } else {
                        var popped = heap.shift();
                        states.push({ h: heap.slice(), msg: '최솟값 ' + popped + ' 꺼냄! — 최소 힙의 루트가 항상 최솟값이므로 O(log N)에 제거' });
                    }
                }
            });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({
                        description: cur.msg,
                        action: function() { renderHeap(cur.h, cur.msg); },
                        undo: function() { renderHeap(prev.h, prev.msg); }
                    });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(opsStr) {
            var ops = parseOps(opsStr);
            var result = buildSteps(ops);
            renderHeap(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-minh-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-minh-input').value);
        });
        runSim(DEFAULT_OPS);
    },

    // ====================================================================
    // 시뮬레이션 3: 절댓값 힙 (boj-11286)
    // ====================================================================
    _renderVizAbsHeap: function(container) {
        var self = this, suffix = '-absheap';
        var DEFAULT_OPS = '1, -1, 0, 0, 0';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">연산: <input type="text" id="pq-absh-input" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;"></label>' +
            '<button class="btn btn-primary" id="pq-absh-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">형식: 0이 아닌 정수 = 삽입, 0 = 삭제 (쉼표 구분). 예: 1, -1, 0, -2, 3, 0</p>' +
            self._createStepDesc(suffix) +
            '<div id="abh-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="abh-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#abh-arr' + suffix);
        var infoEl = container.querySelector('#abh-info' + suffix);
        function renderHeap(h, msg) {
            arrEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">비어있음</span>' :
                h.map(function(v) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--green);color:white;font-weight:700;">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function absSort(a, b) { if (Math.abs(a) !== Math.abs(b)) return Math.abs(a) - Math.abs(b); return a - b; }
        function parseOps(str) {
            return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
        }
        function buildSteps(seq) {
            var heap = [], states = [{ h: [], msg: '절댓값 힙 시뮬레이션을 시작합니다.' }];
            seq.forEach(function(x) {
                if (x !== 0) {
                    heap.push(x); heap.sort(absSort);
                    states.push({ h: heap.slice(), msg: x + ' 삽입! 힙: [' + heap.join(', ') + ']' });
                } else {
                    if (heap.length === 0) {
                        states.push({ h: [], msg: '힙이 비어있어 0 출력' });
                    } else {
                        var popped = heap.shift();
                        states.push({ h: heap.slice(), msg: '절댓값 최소 ' + popped + ' 꺼냄! 힙: [' + (heap.length ? heap.join(', ') : '비어있음') + ']' });
                    }
                }
            });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({ description: cur.msg, action: function() { renderHeap(cur.h, cur.msg); }, undo: function() { renderHeap(prev.h, prev.msg); } });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(opsStr) {
            var seq = parseOps(opsStr);
            var result = buildSteps(seq);
            renderHeap(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-absh-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-absh-input').value);
        });
        runSim(DEFAULT_OPS);
    },

    // ====================================================================
    // 시뮬레이션 4: N번째 큰 수 (boj-2075)
    // ====================================================================
    _renderVizNthLargest: function(container) {
        var self = this, suffix = '-nth';
        var DEFAULT_N = 3;
        var DEFAULT_ROWS = '12 7 9, 13 8 11, 21 10 26';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="pq-nth-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">행 데이터: <input type="text" id="pq-nth-rows" value="' + DEFAULT_ROWS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="pq-nth-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">행은 쉼표로 구분, 행 내부는 공백으로 구분. 예: 12 7 9, 13 8 11, 21 10 26</p>' +
            self._createStepDesc(suffix) +
            '<div id="nth-heap' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="nth-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var heapEl = container.querySelector('#nth-heap' + suffix);
        var infoEl = container.querySelector('#nth-info' + suffix);
        function renderH(h, msg) {
            heapEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">비어있음</span>' :
                h.map(function(v, i) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:' + (i === 0 ? 'var(--accent)' : 'var(--bg2)') + ';color:' + (i === 0 ? 'white' : 'var(--text)') + ';font-weight:700;border:2px solid var(--accent);">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseRows(str) {
            return str.split(',').map(function(s) {
                return s.trim().split(/\s+/).map(Number).filter(function(n) { return !isNaN(n); });
            }).filter(function(row) { return row.length > 0; });
        }
        function buildSteps(N, rows) {
            var heap = [], states = [{ h: [], msg: '크기 ' + N + '인 최소 힙을 유지하면서 처리합니다.' }];
            rows.forEach(function(row) {
                row.forEach(function(x) {
                    if (heap.length < N) {
                        heap.push(x); heap.sort(function(a, b) { return a - b; });
                        states.push({ h: heap.slice(), msg: x + ' 삽입 (힙 크기 &lt; ' + N + '). 힙: [' + heap.join(', ') + ']' });
                    } else if (x > heap[0]) {
                        var old = heap[0]; heap[0] = x; heap.sort(function(a, b) { return a - b; });
                        states.push({ h: heap.slice(), msg: x + ' &gt; 루트(' + old + '). 교체! 힙: [' + heap.join(', ') + ']' });
                    } else {
                        states.push({ h: heap.slice(), msg: x + ' \u2264 루트(' + heap[0] + '). 무시!' });
                    }
                });
            });
            states.push({ h: heap.slice(), msg: '<strong style="color:var(--green);">\u2705 N번째 큰 수 = ' + heap[0] + ' (힙 루트)</strong>' });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({ description: cur.msg.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>'), action: function() { renderH(cur.h, cur.msg); }, undo: function() { renderH(prev.h, prev.msg); } });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(nVal, rowsStr) {
            var N = parseInt(nVal) || 1;
            var rows = parseRows(rowsStr);
            var result = buildSteps(N, rows);
            renderH(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-nth-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-nth-n').value, container.querySelector('#pq-nth-rows').value);
        });
        runSim(DEFAULT_N, DEFAULT_ROWS);
    },

    // ====================================================================
    // 시뮬레이션 5: 중앙값 구하기 (boj-2696)
    // ====================================================================
    _renderVizMedianHeap: function(container) {
        var self = this, suffix = '-median';
        var DEFAULT_NUMS = '1, 5, 4, 3, 2';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">수열: <input type="text" id="pq-median-input" value="' + DEFAULT_NUMS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="pq-median-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">쉼표로 구분된 정수. 홀수 번째마다 중앙값을 출력합니다.</p>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;">' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(108,92,231,0.1);color:var(--primary);margin-bottom:4px;">최대 힙 (작은 절반)</div><div id="md-max' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;"></div></div>' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(0,184,148,0.1);color:var(--green);margin-bottom:4px;">최소 힙 (큰 절반)</div><div id="md-min' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;"></div></div></div>' +
            self._createStepDesc(suffix) +
            '<div id="md-val' + suffix + '" style="text-align:center;font-size:1.2rem;font-weight:700;padding:10px;background:linear-gradient(135deg,rgba(108,92,231,0.08),rgba(0,184,148,0.08));border:2px solid var(--primary);border-radius:12px;margin-bottom:12px;">현재 중앙값: ?</div>' +
            '<div id="md-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var maxEl = container.querySelector('#md-max' + suffix);
        var minEl = container.querySelector('#md-min' + suffix);
        var valEl = container.querySelector('#md-val' + suffix);
        var infoEl = container.querySelector('#md-info' + suffix);
        function renderBubbles(el, arr, color) {
            if (arr.length === 0) { el.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">비어있음</span>'; return; }
            el.innerHTML = arr.map(function(v, i) { return '<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:' + (i === 0 ? color : 'var(--bg2)') + ';color:' + (i === 0 ? '#fff' : 'var(--text)') + ';font-weight:700;border:2px solid ' + color + ';">' + v + '</span>'; }).join('');
        }
        function renderState(maxH, minH, med, msg) {
            var mxSorted = maxH.slice().sort(function(a, b) { return b - a; });
            var mnSorted = minH.slice().sort(function(a, b) { return a - b; });
            renderBubbles(maxEl, mxSorted, 'var(--primary)');
            renderBubbles(minEl, mnSorted, 'var(--green)');
            valEl.innerHTML = med !== null ? '\uD604\uC7AC \uC911\uC559\uAC12: <span style="color:var(--primary);font-size:1.4rem;">' + med + '</span>' : '\uD604\uC7AC \uC911\uC559\uAC12: ?';
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseNums(str) {
            return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
        }
        function buildSteps(nums) {
            var maxH = [], minH = [], medians = [];
            var states = [{ mx: [], mn: [], med: null, msg: '수열을 하나씩 넣으며 중앙값을 구합니다.' }];
            nums.forEach(function(x, idx) {
                if (maxH.length === 0 || x <= Math.max.apply(null, maxH)) { maxH.push(x); } else { minH.push(x); }
                if (maxH.length > minH.length + 1) { var mv = Math.max.apply(null, maxH); maxH.splice(maxH.indexOf(mv), 1); minH.push(mv); }
                else if (minH.length > maxH.length) { var mv2 = Math.min.apply(null, minH); minH.splice(minH.indexOf(mv2), 1); maxH.push(mv2); }
                var med = Math.max.apply(null, maxH);
                var isOdd = (idx + 1) % 2 === 1;
                if (isOdd) medians.push(med);
                states.push({ mx: maxH.slice(), mn: minH.slice(), med: med, msg: x + ' 삽입. ' + (isOdd ? '\uC911\uC559\uAC12 = ' + med : '\uC544\uC9C1 \uD640\uC218 \uBC88\uC9F8 \uC544\uB2D8') });
            });
            states.push({ mx: maxH.slice(), mn: minH.slice(), med: Math.max.apply(null, maxH), msg: '<strong style="color:var(--green);">\u2705 \uC644\uB8CC! \uC911\uC559\uAC12 \uCD9C\uB825: ' + medians.join(', ') + '</strong>' });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({ description: cur.msg.replace(/<[^>]+>/g, ''), action: function() { renderState(cur.mx, cur.mn, cur.med, cur.msg); }, undo: function() { renderState(prev.mx, prev.mn, prev.med, prev.msg); } });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(numsStr) {
            var nums = parseNums(numsStr);
            if (nums.length === 0) return;
            var result = buildSteps(nums);
            renderState(result.initial.mx, result.initial.mn, result.initial.med, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-median-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-median-input').value);
        });
        runSim(DEFAULT_NUMS);
    },

    // ====================================================================
    // 시뮬레이션 6: 보석 도둑 (boj-1202)
    // ====================================================================
    _renderVizJewelThief: function(container) {
        var self = this, suffix = '-jewel';
        var DEFAULT_JEWELS = '1 65, 5 23, 2 99';
        var DEFAULT_BAGS = '10, 2';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">보석 (무게 가격): <input type="text" id="pq-jewel-jewels" value="' + DEFAULT_JEWELS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<label style="font-weight:600;">가방 용량: <input type="text" id="pq-jewel-bags" value="' + DEFAULT_BAGS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:120px;"></label>' +
            '<button class="btn btn-primary" id="pq-jewel-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">보석: "무게 가격" 쌍을 쉼표로 구분. 가방: 용량을 쉼표로 구분.</p>' +
            self._createStepDesc(suffix) +
            '<div id="jw-heap' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="jw-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var heapEl = container.querySelector('#jw-heap' + suffix);
        var infoEl = container.querySelector('#jw-info' + suffix);
        function renderH(h, msg) {
            heapEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">힙 비어있음</span>' :
                h.map(function(v) { return '<div style="padding:6px 12px;border-radius:8px;background:var(--accent)15;border:2px solid var(--accent);font-weight:600;">\uAC00\uACA9:' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseJewels(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/).map(Number);
                return parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1]) ? [parts[0], parts[1]] : null;
            }).filter(function(j) { return j !== null; });
        }
        function parseBags(str) {
            return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
        }
        function buildSteps(jewels, bags) {
            var sortedJ = jewels.slice().sort(function(a, b) { return a[0] - b[0]; });
            var sortedB = bags.slice().sort(function(a, b) { return a - b; });
            var states = [{ h: [], msg: '\uBCF4\uC11D: \uBB34\uAC8C\uC21C \uC815\uB82C ' + sortedJ.map(function(j) { return '(' + j[0] + ',' + j[1] + ')'; }).join(', ') + '. \uAC00\uBC29: \uC6A9\uB7C9\uC21C \uC815\uB82C [' + sortedB.join(', ') + ']' }];
            var heap2 = [], j2 = 0, answer = 0;
            sortedB.forEach(function(bag) {
                while (j2 < sortedJ.length && sortedJ[j2][0] <= bag) {
                    heap2.push(sortedJ[j2][1]); heap2.sort(function(a, b) { return b - a; });
                    states.push({ h: heap2.slice(), msg: '\uAC00\uBC29 \uC6A9\uB7C9 ' + bag + ': \uBCF4\uC11D(\uBB34\uAC8C ' + sortedJ[j2][0] + ', \uAC00\uACA9 ' + sortedJ[j2][1] + ') \uD799\uC5D0 \uCD94\uAC00. \uD799: [' + heap2.join(', ') + ']' });
                    j2++;
                }
                if (heap2.length > 0) {
                    var picked = heap2.shift();
                    answer += picked;
                    states.push({ h: heap2.slice(), msg: '\uAC00\uBC29 \uC6A9\uB7C9 ' + bag + ': \uAC00\uC7A5 \uBE44\uC2FC \uBCF4\uC11D ' + picked + ' \uC120\uD0DD! \uB204\uC801: ' + answer });
                } else {
                    states.push({ h: heap2.slice(), msg: '\uAC00\uBC29 \uC6A9\uB7C9 ' + bag + ': \uB123\uC744 \uBCF4\uC11D \uC5C6\uC74C' });
                }
            });
            states.push({ h: [], msg: '<strong style="color:var(--green);">\u2705 \uCD5C\uB300 \uAC00\uACA9 = ' + answer + '</strong>' });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({ description: cur.msg.replace(/<[^>]+>/g, ''), action: function() { renderH(cur.h, cur.msg); }, undo: function() { renderH(prev.h, prev.msg); } });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(jewelsStr, bagsStr) {
            var jewels = parseJewels(jewelsStr);
            var bags = parseBags(bagsStr);
            if (jewels.length === 0 || bags.length === 0) return;
            var result = buildSteps(jewels, bags);
            renderH(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-jewel-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-jewel-jewels').value, container.querySelector('#pq-jewel-bags').value);
        });
        runSim(DEFAULT_JEWELS, DEFAULT_BAGS);
    },

    // ===== 시각화 탭 =====
    renderVisualize: function(container) {
        this._clearVizState();
        var self = this;
        var suffix = 'concept-pq';
        container.innerHTML =
            '<div class="viz-tabs">' +
            '<button class="viz-tab active" data-viz="minheap">최소 힙 삽입/삭제</button>' +
            '<button class="viz-tab" data-viz="median">두 개의 힙으로 중앙값</button>' +
            '</div>' +
            '<div id="pq-viz-content-' + suffix + '"></div>';
        var vizContent = container.querySelector('#pq-viz-content-' + suffix);
        var tabs = container.querySelectorAll('.viz-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                self._clearVizState();
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                if (tab.dataset.viz === 'minheap') self._renderVizConceptMinHeap(vizContent, suffix);
                else self._renderVizConceptMedian(vizContent, suffix);
            });
        });
        self._renderVizConceptMinHeap(vizContent, suffix);
    },

    renderProblem: function(container) {},

    _renderVizConceptMinHeap: function(container, suffix) {
        var self = this;
        var heap = [null, 3, 5, 7, 9, 8];
        var INITIAL = [null, 3, 5, 7, 9, 8];
        container.innerHTML =
            '<div class="viz-card"><h3>최소 힙 삽입/삭제</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">숫자를 삽입하거나 최솟값을 삭제하면서 힙의 동작을 관찰합니다.</p>' +
            '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px;">' +
            '<label>값: <input type="number" id="pq-insert-val-' + suffix + '" value="2" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>' +
            '<button class="btn btn-primary" id="pq-insert-btn-' + suffix + '">삽입</button>' +
            '<button class="btn" id="pq-delete-btn-' + suffix + '" style="background:var(--red);color:#fff;">삭제 (최솟값)</button>' +
            '<button class="btn" id="pq-reset-btn-' + suffix + '">초기화</button></div>' +
            '<div id="pq-arr-' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="pq-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:var(--radius);min-height:36px;text-align:center;font-weight:600;"></div>' +
            self._createStepDesc(suffix) + self._createStepControls(suffix) + '</div>';
        var arrEl = container.querySelector('#pq-arr-' + suffix);
        var infoEl = container.querySelector('#pq-info-' + suffix);
        function renderAll(h, msg) {
            arrEl.innerHTML = h.length <= 1 ? '<span style="color:var(--text3);">비어있음</span>' :
                h.slice(1).map(function(v, i) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--green);color:white;font-weight:700;">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        renderAll(heap, '힙: [' + heap.slice(1).join(', ') + '] \u2014 삽입 또는 삭제를 눌러보세요.');
        container.querySelector('#pq-insert-btn-' + suffix).addEventListener('click', function() {
            self._clearVizState();
            var val = parseInt(container.querySelector('#pq-insert-val-' + suffix).value);
            if (isNaN(val)) return;
            var h = heap.slice(); h.push(val);
            var swaps = [], idx = h.length - 1;
            while (idx > 1) { var p = Math.floor(idx / 2); if (h[idx] < h[p]) { swaps.push({ ci: idx, pi: p, cv: h[idx], pv: h[p] }); var t = h[idx]; h[idx] = h[p]; h[p] = t; idx = p; } else break; }
            var steps = [], afterAdd = heap.slice(); afterAdd.push(val);
            steps.push({ description: val + '을(를) 배열 끝에 추가 — 힙은 완전이진트리이므로 항상 마지막 위치에 삽입', action: function() { renderAll(afterAdd, val + ' 추가! 힙 성질 유지를 위해 부모와 비교합니다.'); }, undo: function() { renderAll(heap, '삽입 전 상태'); } });
            var sim = afterAdd.slice(), ci = afterAdd.length - 1;
            swaps.forEach(function(sw) { var pi = Math.floor(ci / 2); var cv = sim[ci], pv = sim[pi]; var t2 = sim[ci]; sim[ci] = sim[pi]; sim[pi] = t2; var after = sim.slice(); var next = pi;
                steps.push({ description: cv + ' < ' + pv + ' → 교환! 최소 힙에서는 부모가 자식보다 작아야 하므로 위로 올림(sift-up)', action: function() { renderAll(after, cv + ' < ' + pv + ' → 힙 성질 위반! 교환하여 위로 올립니다.'); }, undo: function() { renderAll(afterAdd, '교환 전'); } }); ci = next; });
            var fin = sim.slice();
            steps.push({ description: '삽입 완료! 부모≤자식 조건이 만족되어 힙 성질 복원됨', action: function() { heap = fin.slice(); renderAll(heap, '\u2705 삽입 완료! 힙: [' + heap.slice(1).join(', ') + ']'); }, undo: function() { renderAll(sim, '삽입 완료 전'); } });
            self._initStepController(container, steps, suffix);
        });
        container.querySelector('#pq-delete-btn-' + suffix).addEventListener('click', function() {
            self._clearVizState();
            if (heap.length <= 1) { infoEl.innerHTML = '\u274C 힙이 비어있습니다!'; return; }
            var rootVal = heap[1], lastVal = heap[heap.length - 1], orig = heap.slice();
            var h2 = heap.slice(); h2[1] = h2[h2.length - 1]; h2.pop();
            var swaps2 = [], idx2 = 1, hc = h2.slice();
            while (idx2 * 2 < hc.length) { var c = idx2 * 2; if (c + 1 < hc.length && hc[c + 1] < hc[c]) c++; if (hc[idx2] > hc[c]) { swaps2.push({ pi: idx2, ci: c }); var t3 = hc[idx2]; hc[idx2] = hc[c]; hc[c] = t3; idx2 = c; } else break; }
            var steps2 = [];
            steps2.push({ description: '루트(' + rootVal + ')를 꺼냄 — 최소 힙에서 루트가 항상 최솟값이므로 O(1)에 최솟값 접근', action: function() { renderAll(orig, rootVal + '을(를) 꺼냅니다! 루트가 최솟값이라서 바로 꺼낼 수 있습니다.'); }, undo: function() { renderAll(orig, '삭제 전'); } });
            var afterMove = orig.slice(); afterMove[1] = afterMove[afterMove.length - 1]; afterMove.pop();
            steps2.push({ description: lastVal + '을(를) 루트로 이동 — 완전이진트리 모양을 유지하기 위해 마지막 원소를 루트로 올림', action: function() { renderAll(afterMove, lastVal + '을(를) 루트로! 힙 성질 복원을 위해 자식과 비교합니다.'); }, undo: function() { renderAll(orig, rootVal + '을(를) 꺼냅니다!'); } });
            var sim2 = afterMove.slice(), ci2 = 1;
            swaps2.forEach(function() { var c2 = ci2 * 2; if (c2 + 1 < sim2.length && sim2[c2 + 1] < sim2[c2]) c2++; var pv2 = sim2[ci2], cv2 = sim2[c2]; var t4 = sim2[ci2]; sim2[ci2] = sim2[c2]; sim2[c2] = t4; var af = sim2.slice();
                steps2.push({ description: pv2 + ' > ' + cv2 + ' → 교환! 부모가 자식보다 크면 힙 성질 위반이므로 아래로 내림(sift-down)', action: function() { renderAll(af, pv2 + ' > ' + cv2 + ' → 힙 성질 위반! 더 작은 자식과 교환합니다.'); }, undo: function() { renderAll(afterMove, '교환 전'); } }); ci2 = c2; });
            var fin2 = sim2.slice();
            steps2.push({ description: '삭제 완료! 꺼낸 최솟값: ' + rootVal + ' — sift-down으로 힙 성질 복원됨', action: function() { heap = fin2.slice(); renderAll(heap, '\u2705 삭제 완료! 꺼낸 값: ' + rootVal + '. 힙: [' + heap.slice(1).join(', ') + ']'); }, undo: function() { renderAll(sim2, '삭제 완료 전'); } });
            self._initStepController(container, steps2, suffix);
        });
        container.querySelector('#pq-reset-btn-' + suffix).addEventListener('click', function() {
            self._clearVizState(); heap = INITIAL.slice();
            renderAll(heap, '힙: [' + heap.slice(1).join(', ') + '] \u2014 초기 상태로 돌아왔습니다.');
        });
    },

    _renderVizConceptMedian: function(container, suffix) {
        var self = this;
        container.innerHTML =
            '<div class="viz-card"><h3>두 개의 힙으로 중앙값 구하기</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">숫자를 하나씩 넣으면서 중앙값을 실시간으로 구합니다.</p>' +
            '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px;">' +
            '<label>입력 수열: <input type="text" id="pq-median-input-' + suffix + '" value="1 5 2 8 3 6 4 7" style="width:220px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>' +
            '<button class="btn btn-primary" id="pq-median-start-' + suffix + '">시작</button></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;">' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(108,92,231,0.1);color:var(--primary);margin-bottom:4px;">최대 힙 (작은 절반)</div>' +
            '<div id="cm-max-' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;"></div></div>' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(0,184,148,0.1);color:var(--green);margin-bottom:4px;">최소 힙 (큰 절반)</div>' +
            '<div id="cm-min-' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;"></div></div></div>' +
            '<div id="cm-val-' + suffix + '" style="text-align:center;font-size:1.2rem;font-weight:700;padding:10px;border:2px solid var(--primary);border-radius:12px;margin-bottom:12px;">현재 중앙값: ?</div>' +
            '<div id="cm-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepDesc(suffix) + self._createStepControls(suffix) + '</div>';
        var maxEl = container.querySelector('#cm-max-' + suffix);
        var minEl = container.querySelector('#cm-min-' + suffix);
        var valEl = container.querySelector('#cm-val-' + suffix);
        var infoEl = container.querySelector('#cm-info-' + suffix);
        function renderBubbles(el, arr, color) {
            if (arr.length === 0) { el.innerHTML = '<span style="color:var(--text3);">비어있음</span>'; return; }
            el.innerHTML = arr.map(function(v, i) { return '<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:' + (i === 0 ? color : 'var(--bg2)') + ';color:' + (i === 0 ? '#fff' : 'var(--text)') + ';font-weight:700;border:2px solid ' + color + ';">' + v + '</span>'; }).join('');
        }
        function renderState(mxH, mnH, med, msg) {
            renderBubbles(maxEl, mxH.slice().sort(function(a, b) { return b - a; }), 'var(--primary)');
            renderBubbles(minEl, mnH.slice().sort(function(a, b) { return a - b; }), 'var(--green)');
            valEl.innerHTML = med !== null ? '현재 중앙값: <span style="color:var(--primary);font-size:1.4rem;">' + med + '</span>' : '현재 중앙값: ?';
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        renderState([], [], null, '수열을 입력하고 시작을 누르세요.');
        container.querySelector('#pq-median-start-' + suffix).addEventListener('click', function() {
            self._clearVizState();
            var input = container.querySelector('#pq-median-input-' + suffix).value.trim();
            var nums = input.split(/[\s,]+/).map(Number).filter(function(n) { return !isNaN(n); });
            if (nums.length === 0) return;
            var mxH = [], mnH = [], allSteps = [];
            nums.forEach(function(val) {
                if (mxH.length === 0 || val <= Math.max.apply(null, mxH)) { mxH.push(val); allSteps.push({ mx: mxH.slice(), mn: mnH.slice(), med: null, desc: val + '을(를) 최대 힙에 넣습니다.' }); }
                else { mnH.push(val); allSteps.push({ mx: mxH.slice(), mn: mnH.slice(), med: null, desc: val + '을(를) 최소 힙에 넣습니다.' }); }
                if (mxH.length > mnH.length + 1) { var mv = Math.max.apply(null, mxH); mxH.splice(mxH.indexOf(mv), 1); mnH.push(mv);
                    allSteps.push({ mx: mxH.slice(), mn: mnH.slice(), med: null, desc: mv + '을(를) 최대 힙 \u2192 최소 힙으로 이동' }); }
                else if (mnH.length > mxH.length) { var mv2 = Math.min.apply(null, mnH); mnH.splice(mnH.indexOf(mv2), 1); mxH.push(mv2);
                    allSteps.push({ mx: mxH.slice(), mn: mnH.slice(), med: null, desc: mv2 + '을(를) 최소 힙 \u2192 최대 힙으로 이동' }); }
                var med = Math.max.apply(null, mxH);
                allSteps[allSteps.length - 1].med = med;
                allSteps[allSteps.length - 1].desc += ' \u2192 중앙값 = ' + med;
            });
            var steps = [];
            for (var i = 0; i < allSteps.length; i++) {
                var st = allSteps[i], prev = i > 0 ? allSteps[i - 1] : { mx: [], mn: [], med: null, desc: '' };
                (function(st2, prev2) {
                    steps.push({ description: st2.desc, action: function() { renderState(st2.mx, st2.mn, st2.med, st2.desc); }, undo: function() { renderState(prev2.mx, prev2.mn, prev2.med, prev2.desc || '수열을 입력하고 시작을 누르세요.'); } });
                })(st, prev);
            }
            var finalMed = Math.max.apply(null, mxH);
            steps.push({ description: '\u2705 완료! 최종 중앙값: ' + finalMed,
                action: function() { var ls = allSteps[allSteps.length - 1]; renderState(ls.mx, ls.mn, finalMed, '\u2705 모든 숫자를 넣었습니다! 최종 중앙값: ' + finalMed); },
                undo: function() { var ls = allSteps[allSteps.length - 1]; renderState(ls.mx, ls.mn, ls.med, ls.desc); }
            });
            self._initStepController(container, steps, suffix);
        });
    },

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '기본 힙 연산', desc: '최대/최소/절댓값 힙 (Silver II)', problemIds: ['boj-11279', 'boj-1927', 'boj-11286'] },
        { num: 2, title: '힙 활용', desc: '크기 제한 힙, 두 개의 힙 (Gold)', problemIds: ['boj-2075', 'boj-2696'] },
        { num: 3, title: '그리디 + 힙', desc: '정렬 + 힙으로 최적해 (Gold II)', problemIds: ['boj-1202'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        {
            id: 'boj-11279', title: 'BOJ 11279 - 최대 힙', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11279',
            simIntro: '최대 힙에서 삽입과 삭제가 어떻게 동작하는지 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>널리 잘 알려진 자료구조 중 최대 힙이 있다. 최대 힙을 이용하여 다음과 같은 연산을 지원하는 프로그램을 작성하시오.</p>
                <p>배열에 자연수 x를 넣는다. 배열에서 가장 큰 값을 출력하고, 그 값을 배열에서 제거한다.</p>
                <p>프로그램은 처음에 비어있는 배열에서 시작하게 된다.</p>
                <p>x가 자연수라면 배열에 x를 넣는(추가하는) 연산이고, x가 0이라면 배열에서 가장 큰 값을 출력하고 그 값을 배열에서 제거하는 경우이다. 만약 배열이 비어 있는 경우인데 가장 큰 값을 출력하라고 한 경우에는 0을 출력하면 된다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 연산의 개수 N(1 &le; N &le; 100,000)이 주어진다. 다음 N개의 줄에는 연산에 대한 정보를 나타내는 정수 x가 주어진다. 만약 x가 자연수라면 배열에 x라는 값을 넣는(추가하는) 연산이고, x가 0이라면 배열에서 가장 큰 값을 출력하고, 그 값을 배열에서 제거하는 경우이다. x는 2<sup>31</sup>보다 작은 자연수 또는 0이고, 음의 정수는 입력으로 주어지지 않는다.</p>
                <h4>출력</h4>
                <p>입력에서 0이 주어진 회수만큼 답을 한 줄에 하나씩 출력한다. 만약 배열이 비어 있는 경우인데 가장 큰 값을 출력하라고 한 경우에는 0을 출력하면 된다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>13
1
2
0
0
3
2
1
0
0
0
0
0
0</pre></div>
                    <div><strong>출력</strong><pre>2
1
3
2
1
0
0</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>x는 자연수 또는 0</li>
                    <li>x ≤ 2<sup>31</sup> - 1</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '"가장 큰 값을 출력하라"니까... 배열에 숫자를 넣고, 0이 나올 때마다 <strong>배열 전체를 뒤져서 최댓값</strong>을 찾으면 되지 않을까?<br><br>매번 <code>max()</code>로 찾고, 그 값을 제거하면 될 것 같아!' },
                { title: '근데 이러면 문제가 있어', content: '배열에서 최댓값 찾기 = <strong>O(N)</strong>, 제거도 <strong>O(N)</strong>이야.<br>연산이 최대 10만 번이고, 매번 O(N)이면 <strong>10만 × 10만 = 100억 번</strong>... 시간 초과!<br><br><div style="display:flex;align-items:flex-end;gap:18px;justify-content:center;margin:12px 0 8px;"><div style="text-align:center;"><div style="width:48px;height:120px;background:var(--red);border-radius:6px 6px 0 0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;color:#fff;font-weight:700;font-size:0.8em;">10<sup>10</sup></div><div style="font-size:0.78em;color:var(--text2);margin-top:4px;">배열<br>O(N) &times; N</div></div><div style="text-align:center;"><div style="width:48px;height:30px;background:var(--green);border-radius:6px 6px 0 0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;color:#fff;font-weight:700;font-size:0.8em;">10<sup>5</sup></div><div style="font-size:0.78em;color:var(--text2);margin-top:4px;">힙<br>O(log N) &times; N</div></div></div>넣을 때는 빠르지만, <strong>꺼낼 때마다 전부 뒤지는 게 병목</strong>이야.' },
                { title: '이렇게 하면 어떨까?', content: '<strong>힙(Heap)</strong>을 쓰면 삽입도 O(log N), 최댓값 꺼내기도 O(log N)이야!<br>힙은 "항상 최댓값(또는 최솟값)이 맨 위에 있는" 특별한 트리 구조거든.<br><br>그런데 주의할 점이 하나 있어:<br><span class="lang-py">Python의 <code>heapq</code>는 <strong>최소 힙</strong>만 지원해. 최대 힙이 필요한데 어떡하지? 🤔<br>→ <strong>-1을 곱해서</strong> 넣으면 돼! 가장 작은 음수 = 원래 가장 큰 수니까!</span><span class="lang-cpp">C++의 <code>priority_queue&lt;int&gt;</code>는 <strong>기본이 최대 힙</strong>이라 그대로 쓰면 돼! Python보다 오히려 간단하지.</span>' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span>에선 이렇게!', content: '<span class="lang-py"><code>heapq.heappush(heap, <strong>-x</strong>)</code>로 넣고, 꺼낼 때 <code><strong>-</strong>heapq.heappop(heap)</code>으로 부호를 되돌려주면 끝!<br>삽입/삭제 모두 <strong>O(log N)</strong>이라 전체 <strong>O(N log N)</strong>으로 여유있게 통과해.</span><span class="lang-cpp"><code>pq.push(x)</code>로 넣고, <code>pq.top()</code>으로 최댓값 확인 후 <code>pq.pop()</code>으로 제거하면 끝!<br>삽입/삭제 모두 <strong>O(log N)</strong>이라 전체 <strong>O(N log N)</strong>으로 여유있게 통과해.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, -x)\n    else:\n        if heap:\n            print(-heapq.heappop(heap))\n        else:\n            print(0)',
                cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int> pq;\n    while (n--) {\n        cin >> x;\n        if (x > 0) pq.push(x);\n        else { if (!pq.empty()) { cout << pq.top() << "\\n"; pq.pop(); } else cout << 0 << "\\n"; }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '\uCD5C\uB300 \uD799 (-1 \uACF1\uD558\uAE30)',
                description: 'heapq\uC5D0 -x\uB97C \uB123\uACE0 \uAEBC\uB0BC \uB54C -1\uC744 \uACF1\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', desc: 'heapq는 최소 힙이므로 -1을 곱해 넣으면 최대 힙처럼 동작합니다.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: '\uC5F0\uC0B0 \uCC98\uB9AC', desc: 'x > 0이면 -x를 push하여 최대 힙 효과를 냅니다.', code: 'for _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, -x)' },
                        { title: '\uCD9C\uB825', desc: '꺼낸 값에 다시 -1을 곱해 원래 값을 복원합니다.', code: '    else:\n        if heap:\n            print(-heapq.heappop(heap))\n        else:\n            print(0)' }
                    ],
                    cpp: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', desc: 'C++ priority_queue\uB294 \uAE30\uBCF8\uC774 \uCD5C\uB300 \uD799 \u2192 -1 \uACF1\uD560 \uD544\uC694 \uC5C6\uC74C.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, x;\n    cin >> n;\n    priority_queue<int> pq;  // \uAE30\uBCF8: \uCD5C\uB300 \uD799' },
                        { title: '\uC5F0\uC0B0 \uCC98\uB9AC', desc: 'x > 0이면 그대로 push. 기본 최대 힙이라 별도 변환 불필요.', code: '    while (n--) {\n        cin >> x;\n        if (x > 0) {\n            pq.push(x);\n        }' },
                        { title: '\uCD9C\uB825', desc: 'top()으로 최댓값을 확인하고 pop()으로 제거합니다.', code: '        else {\n            if (!pq.empty()) {\n                cout << pq.top() << \'\\n\';\n                pq.pop();\n            } else {\n                cout << 0 << \'\\n\';\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-1927', title: 'BOJ 1927 - 최소 힙', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1927',
            simIntro: '최소 힙에서 삽입과 삭제가 어떻게 동작하는지 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>널리 잘 알려진 자료구조 중 최소 힙이 있다. 최소 힙을 이용하여 다음과 같은 연산을 지원하는 프로그램을 작성하시오.</p>
                <p>배열에 자연수 x를 넣는다. 배열에서 가장 작은 값을 출력하고, 그 값을 배열에서 제거한다.</p>
                <p>x가 자연수라면 배열에 x를 넣고, x가 0이라면 배열에서 가장 작은 값을 출력하고 제거한다. 배열이 비어있으면 0을 출력한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 연산의 개수 N(1 &le; N &le; 100,000)이 주어진다. 다음 N개의 줄에는 연산에 대한 정보를 나타내는 정수 x가 주어진다. 만약 x가 자연수라면 배열에 x라는 값을 넣는(추가하는) 연산이고, x가 0이라면 배열에서 가장 작은 값을 출력하고, 그 값을 배열에서 제거하는 경우이다. x는 2<sup>31</sup>보다 작은 자연수 또는 0이고, 음의 정수는 입력으로 주어지지 않는다.</p>
                <h4>출력</h4>
                <p>입력에서 0이 주어진 회수만큼 답을 한 줄에 하나씩 출력한다. 만약 배열이 비어 있는 경우인데 가장 작은 값을 출력하라고 한 경우에는 0을 출력하면 된다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>9
0
12345678
1
2
0
0
0
0
32</pre></div>
                    <div><strong>출력</strong><pre>0
1
2
12345678
0</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ x ≤ 2<sup>31</sup> - 1</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '"가장 작은 값을 출력하라"니까... 숫자를 배열에 넣고, 0이 나오면 <strong>배열을 정렬해서 맨 앞</strong>을 꺼내면 되지 않을까?<br><br>아니면 매번 <code>min()</code>으로 최솟값을 찾아서 제거하거나!' },
                { title: '근데 이러면 문제가 있어', content: '매번 정렬하면 <strong>O(N log N)</strong>, min()으로 찾아도 <strong>O(N)</strong>이야.<br>연산이 최대 10만 번이면 <strong>최악 10만 × 10만 = 100억 번</strong>... 너무 느려!<br><br>최대 힙 문제랑 똑같은 상황이야. <strong>"매번 전체를 뒤지는"</strong> 게 문제지.' },
                { title: '이렇게 하면 어떨까?', content: '<strong>최소 힙</strong>을 쓰면 삽입 O(log N), 최솟값 꺼내기 O(log N)으로 해결돼!<br>힙은 "맨 위에 항상 최솟값(또는 최댓값)이 있는" 구조라서, 매번 전체를 안 뒤져도 바로 꺼낼 수 있어.<br><br>최대 힙 문제에선 -1 곱하기 트릭이 필요했는데, <strong>최소 힙은 그냥 넣으면 돼!</strong>' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span>에선 이렇게!', content: '<span class="lang-py"><code>heapq</code>가 기본으로 <strong>최소 힙</strong>이라서, 아무 트릭 없이 <code>heappush(heap, x)</code>로 넣고 <code>heappop(heap)</code>으로 꺼내면 끝!<br>최대 힙보다 오히려 더 간단해. 전체 <strong>O(N log N)</strong>.</span><span class="lang-cpp">C++ <code>priority_queue</code>는 기본이 최대 힙이라, 최소 힙으로 바꿔야 해.<br><code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code>처럼 <strong>greater&lt;int&gt;</strong>를 넣어주면 최소 힙이 돼!<br>그 뒤로는 <code>pq.push(x)</code>, <code>pq.top()</code>, <code>pq.pop()</code> 그대로 사용. 전체 <strong>O(N log N)</strong>.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, x)\n    else:\n        if heap:\n            print(heapq.heappop(heap))\n        else:\n            print(0)',
                cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int, vector<int>, greater<int>> pq;\n    while (n--) {\n        cin >> x;\n        if (x > 0) pq.push(x);\n        else { if (!pq.empty()) { cout << pq.top() << "\\n"; pq.pop(); } else cout << 0 << "\\n"; }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '\uCD5C\uC18C \uD799 (heapq \uAE30\uBCF8)',
                description: 'heapq\uB97C \uADF8\uB300\uB85C \uC0AC\uC6A9\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', desc: 'heapq는 기본이 최소 힙이므로 그대로 사용하면 됩니다.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: '\uC5F0\uC0B0 \uCC98\uB9AC', desc: 'x가 자연수이면 heappush로 최소 힙에 삽입합니다.', code: 'for _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, x)' },
                        { title: '\uCD9C\uB825', desc: 'heappop은 항상 가장 작은 값을 꺼냅니다. 비어있으면 0 출력.', code: '    else:\n        if heap:\n            print(heapq.heappop(heap))\n        else:\n            print(0)' }
                    ],
                    cpp: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', desc: 'greater<int>\uB97C \uB123\uC73C\uBA74 \uCD5C\uC18C \uD799.\nPython heapq\uC640 \uAC19\uC740 \uB3D9\uC791.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, x;\n    cin >> n;\n    // greater<int> \u2192 \uCD5C\uC18C \uD799 (Python heapq \uAE30\uBCF8\uACFC \uB3D9\uC77C)\n    priority_queue<int, vector<int>, greater<int>> pq;' },
                        { title: '\uC5F0\uC0B0 \uCC98\uB9AC', desc: 'x > 0이면 push. greater<int> 덕분에 자동으로 최솟값이 top.', code: '    while (n--) {\n        cin >> x;\n        if (x > 0) {\n            pq.push(x);\n        }' },
                        { title: '\uCD9C\uB825', desc: 'top()이 최솟값. pop()으로 제거 후 출력합니다.', code: '        else {\n            if (!pq.empty()) {\n                cout << pq.top() << \'\\n\';\n                pq.pop();\n            } else {\n                cout << 0 << \'\\n\';\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-11286', title: 'BOJ 11286 - 절댓값 힙', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11286',
            simIntro: '절댓값 힙에서 (abs(x), x) 튜플이 어떻게 정렬되는지 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>절댓값 힙은 다음과 같은 연산을 지원하는 자료구조이다.</p>
                <p>배열에 정수 x (x ≠ 0)를 넣는다. 배열에서 절댓값이 가장 작은 값을 출력하고, 그 값을 배열에서 제거한다. 절댓값이 가장 작은 값이 여러개일 때는, 가장 작은 수를 출력하고 그 값을 배열에서 제거한다.</p>
                <p>x가 0이 아니라면 배열에 x를 넣고, x가 0이라면 절댓값이 가장 작은 값을 출력하고 제거한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 연산의 개수 N(1 &le; N &le; 100,000)이 주어진다. 다음 N개의 줄에는 연산에 대한 정보를 나타내는 정수 x가 주어진다. 만약 x가 0이 아니라면 배열에 x라는 값을 넣는(추가하는) 연산이고, x가 0이라면 배열에서 절댓값이 가장 작은 값을 출력하고, 그 값을 배열에서 제거하는 경우이다. 입력되는 정수는 -2<sup>31</sup>보다 크고, 2<sup>31</sup>보다 작다.</p>
                <h4>출력</h4>
                <p>입력에서 0이 주어진 회수만큼 답을 한 줄에 하나씩 출력한다. 만약 배열이 비어 있는 경우인데 절댓값이 가장 작은 값을 출력하라고 한 경우에는 0을 출력하면 된다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>18
1
-1
0
0
0
1
1
-1
-1
2
-2
0
0
0
0
0
0
0</pre></div>
                    <div><strong>출력</strong><pre>-1
1
0
-1
-1
1
1
-2
2
0</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>-2<sup>31</sup> < x < 2<sup>31</sup></li>
                    <li>x ≠ 0 (입력에서 0은 출력 명령)</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '"절댓값이 가장 작은 값을 꺼내라"니까... 배열에 숫자를 넣고, 0이 나오면 <strong>전부 절댓값을 비교해서</strong> 가장 작은 걸 찾으면 되지 않을까?<br><br>절댓값이 같은 게 여러 개면 그중 실제 값이 작은 걸 고르면 되고!' },
                { title: '근데 이러면 문제가 있어', content: '매번 전체를 훑으면 <strong>O(N)</strong>이야. 연산이 최대 10만 번이면 또 시간 초과!<br><br>힙을 쓰면 될 것 같은데... 문제는 <strong>"절댓값 기준"</strong>이라는 거야.<br>일반 최소 힙은 실제 값 기준으로 정렬하니까, -1과 1 중에 -1을 먼저 꺼내버려. 우리는 둘 다 절댓값이 1이니까 동점 처리가 필요한데!' },
                { title: '이렇게 하면 어떨까?', content: '힙에 숫자를 그냥 넣지 말고, <strong>(절댓값, 실제 값)</strong> 쌍으로 넣으면 어떨까?<br><br><div style="margin:10px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="margin-bottom:6px;font-weight:600;color:var(--text);">입력 → 튜플 변환:</div><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;"><div style="padding:4px 10px;background:var(--bg);border:1px solid var(--bg3);border-radius:6px;"><code>1</code> → <code>(1, 1)</code></div><div style="padding:4px 10px;background:var(--bg);border:1px solid var(--bg3);border-radius:6px;"><code>-1</code> → <code>(1, -1)</code></div><div style="padding:4px 10px;background:var(--bg);border:1px solid var(--bg3);border-radius:6px;"><code>3</code> → <code>(3, 3)</code></div><div style="padding:4px 10px;background:var(--bg);border:1px solid var(--bg3);border-radius:6px;"><code>-3</code> → <code>(3, -3)</code></div></div><div style="margin-top:8px;font-weight:600;color:var(--text);">힙 정렬 순서 (위 → 아래):</div><div style="display:flex;gap:6px;margin-top:4px;justify-content:center;"><div style="padding:4px 10px;background:var(--green);color:#fff;border-radius:6px;font-weight:600;">(1,-1)</div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;">(1, 1)</div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;">(3,-3)</div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;">(3, 3)</div></div></div>힙이 첫 번째 값(절댓값)으로 먼저 정렬하고, 같으면 두 번째 값(실제 값)으로 정렬하니까, <strong>절댓값이 같을 때 음수가 먼저</strong> 나오게 돼! 정확히 문제가 원하는 동작이야.' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span>에선 이렇게!', content: '<span class="lang-py"><code>heapq.heappush(heap, (abs(x), x))</code>로 튜플을 넣고, 꺼낼 때 <code>heappop(heap)[1]</code>로 원래 값만 가져오면 끝!<br>Python 튜플 비교가 자동으로 (절댓값 → 실제 값) 순서로 정렬해줘서 코드가 아주 깔끔해.</span><span class="lang-cpp">C++에선 <strong>커스텀 비교 구조체</strong>를 만들어야 해:<br><code>struct cmp { bool operator()(int a, int b) { if(abs(a)==abs(b)) return a&gt;b; return abs(a)&gt;abs(b); } };</code><br>이러면 <code>priority_queue&lt;int, vector&lt;int&gt;, cmp&gt;</code>로 절댓값 기준 최소 힙을 만들 수 있어!<br>Python 튜플처럼 자동 비교가 안 되니까, 비교 함수를 직접 정의하는 거야.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    x = int(input())\n    if x != 0:\n        heapq.heappush(heap, (abs(x), x))\n    else:\n        if heap:\n            print(heapq.heappop(heap)[1])\n        else:\n            print(0)',
                cpp: '#include <iostream>\n#include <queue>\n#include <cstdlib>\nusing namespace std;\nstruct cmp { bool operator()(int a, int b) { if (abs(a)==abs(b)) return a>b; return abs(a)>abs(b); } };\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int, vector<int>, cmp> pq;\n    while (n--) { cin >> x; if (x!=0) pq.push(x); else { if (!pq.empty()) { cout << pq.top() << "\\n"; pq.pop(); } else cout << 0 << "\\n"; } }\n    return 0;\n}'
            },
            solutions: [{
                approach: '\uD29C\uD50C (abs(x), x)',
                description: '\uC808\uB313\uAC12\uACFC \uC2E4\uC81C \uAC12\uC744 \uD29C\uD50C\uB85C \uBB36\uC5B4 \uD799\uC5D0 \uB123\uC2B5\uB2C8\uB2E4.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', desc: '(|x|, x) 튜플을 힙에 넣어 절댓값 기준 정렬을 구현합니다.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: '\uC5F0\uC0B0 \uCC98\uB9AC', desc: '튜플 비교: 첫 번째 값(절댓값)으로 정렬, 같으면 두 번째 값(원래 값)으로 정렬.', code: 'for _ in range(n):\n    x = int(input())\n    if x != 0:\n        heapq.heappush(heap, (abs(x), x))' },
                        { title: '\uCD9C\uB825', desc: 'heappop()[1]로 튜플에서 원래 값만 꺼냅니다.', code: '    else:\n        if heap:\n            print(heapq.heappop(heap)[1])\n        else:\n            print(0)' }
                    ],
                    cpp: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', desc: '\uCEE4\uC2A4\uD140 \uBE44\uAD50 \uD568\uC218\uB85C \uC808\uB313\uAC12 \uAE30\uC900 \uCD5C\uC18C \uD799 \uAD6C\uD604.\n\uC808\uB313\uAC12 \uAC19\uC73C\uBA74 \uC2E4\uC81C \uAC12\uC774 \uC791\uC740 \uAC83 \uC6B0\uC120.', code: '#include <iostream>\n#include <queue>\n#include <cstdlib>\nusing namespace std;\n\n// \uCEE4\uC2A4\uD140 \uBE44\uAD50: |a|==|b|\uC774\uBA74 \uC2E4\uC81C \uAC12 \uC791\uC740 \uAC83 \uC6B0\uC120\nstruct cmp {\n    bool operator()(int a, int b) {\n        if (abs(a) == abs(b)) return a > b;\n        return abs(a) > abs(b);\n    }\n};\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, x;\n    cin >> n;\n    priority_queue<int, vector<int>, cmp> pq;' },
                        { title: '\uC5F0\uC0B0 \uCC98\uB9AC', desc: 'cmp 구조체 덕분에 push만 하면 절댓값 기준으로 자동 정렬됩니다.', code: '    while (n--) {\n        cin >> x;\n        if (x != 0) {\n            pq.push(x);\n        }' },
                        { title: '\uCD9C\uB825', desc: 'top()이 절댓값이 가장 작은 값. Python 튜플 방식과 동일한 결과.', code: '        else {\n            if (!pq.empty()) {\n                cout << pq.top() << \'\\n\';\n                pq.pop();\n            } else {\n                cout << 0 << \'\\n\';\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-2075', title: 'BOJ 2075 - N번째 큰 수', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2075',
            simIntro: '크기 N인 최소 힙을 유지하면서 N번째 큰 수를 구하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×N의 표에 수 N<sup>2</sup>개 채워져 있다. 채워진 수에는 한 가지 특징이 있는데, 모든 수는 자신의 한 칸 위에 있는 수보다 크다는 것이다. N번째 큰 수를 찾아라.</p>
                <p>메모리 제한은 12MB이다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 N(1 &le; N &le; 1,500)이 주어진다. 다음 N개의 줄에는 각 줄마다 N개의 수가 주어진다. 표에 적힌 수는 -10억보다 크거나 같고, 10억보다 작거나 같은 정수이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 N번째 큰 수를 출력한다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5
12 22 31 36 44
11 26 27 28 45
16 25 33 34 46
15 29 30 35 47
14 24 32 39 48</pre></div>
                    <div><strong>출력</strong><pre>35</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,500</li>
                    <li>표에 채워진 수는 모두 -10억 이상 10억 이하</li>
                    <li>메모리 제한 12MB</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: 'N번째 큰 수를 찾으라니까... N\u00B2개 숫자를 <strong>전부 배열에 넣고 정렬</strong>해서 N번째를 꺼내면 되지 않을까?<br><br>N이 1,500이면 숫자가 1,500 \u00D7 1,500 = <strong>225만 개</strong>. 정렬하면 답은 나올 것 같아!' },
                { title: '근데 이러면 문제가 있어', content: '문제를 다시 보면... <strong>메모리 제한이 12MB</strong>야!<br>int 225만 개 = 약 9MB인데, 배열 자체만으로도 빠듯하고 정렬에 추가 메모리까지 필요하면 초과할 수 있어.<br><br>핵심은 "225만 개를 <strong>전부 저장하지 않고</strong>도 N번째 큰 수를 찾을 수 있느냐"야!' },
                { title: '이렇게 하면 어떨까?', content: '생각해보면, <strong>"상위 N개"만 기억</strong>하면 되잖아!<br><br><strong>크기 N짜리 최소 힙</strong>을 유지하는 거야:<br>1. 힙 크기가 N 미만이면 그냥 넣기<br>2. 힙 크기가 N이면, 새 값이 힙의 최솟값(루트)보다 <strong>클 때만</strong> 교체<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;text-align:center;font-size:0.88em;"><div style="font-weight:600;margin-bottom:8px;">크기 3 최소 힙 유지 과정 (N=3)</div><div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;"><div><div style="color:var(--text2);font-size:0.8em;">입력: 5,2,8</div><div style="display:flex;gap:4px;margin-top:4px;justify-content:center;"><span style="padding:3px 8px;background:var(--green);color:#fff;border-radius:4px;font-weight:600;">2</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">5</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">8</span></div></div><div style="display:flex;align-items:center;font-size:1.2em;color:var(--text2);">→</div><div><div style="color:var(--text2);font-size:0.8em;">입력: 9 (9 &gt; 2, 교체!)</div><div style="display:flex;gap:4px;margin-top:4px;justify-content:center;"><span style="padding:3px 8px;background:var(--green);color:#fff;border-radius:4px;font-weight:600;">5</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">8</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">9</span></div></div><div style="display:flex;align-items:center;font-size:1.2em;color:var(--text2);">→</div><div><div style="color:var(--text2);font-size:0.8em;">입력: 1 (1 &lt; 5, 무시)</div><div style="display:flex;gap:4px;margin-top:4px;justify-content:center;"><span style="padding:3px 8px;background:var(--green);color:#fff;border-radius:4px;font-weight:600;">5</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">8</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">9</span></div></div></div><div style="margin-top:6px;color:var(--green);font-weight:600;">루트(5) = 3번째 큰 수!</div></div>이러면 힙에는 항상 "지금까지 본 숫자 중 가장 큰 N개"만 남아. 다 읽은 후 <strong>힙의 루트(최솟값) = N번째 큰 수</strong>!<br>메모리도 N개만 저장하니까 12MB 여유있게 통과해.' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span>에선 이렇게!', content: '<span class="lang-py">힙 크기 &lt; N이면 <code>heappush</code>, 아니면 새 값 &gt; <code>heap[0]</code>(루트)일 때만 <code>heapreplace(heap, x)</code>로 교체!<br><code>heapreplace</code>는 pop+push를 한 번에 해줘서 효율적이야.<br>마지막에 <code>heap[0]</code>이 정답. 전체 <strong>O(N\u00B2 log N)</strong>.</span><span class="lang-cpp"><code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code>로 최소 힙을 만들어.<br>힙 크기 &lt; N이면 <code>pq.push(x)</code>, 아니면 <code>x &gt; pq.top()</code>일 때 <code>pq.pop(); pq.push(x);</code>로 교체!<br>마지막에 <code>pq.top()</code>이 정답. 전체 <strong>O(N\u00B2 log N)</strong>.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    row = list(map(int, input().split()))\n    for x in row:\n        if len(heap) < n:\n            heapq.heappush(heap, x)\n        elif x > heap[0]:\n            heapq.heapreplace(heap, x)\nprint(heap[0])',
                cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 0; i < n*n; i++) { cin >> x; if ((int)pq.size()<n) pq.push(x); else if (x>pq.top()) { pq.pop(); pq.push(x); } }\n    cout << pq.top() << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '\uD06C\uAE30 \uC81C\uD55C \uCD5C\uC18C \uD799',
                description: '\uD799 \uD06C\uAE30\uB97C N\uC73C\uB85C \uC720\uC9C0\uD558\uBA70 N\uBC88\uC9F8 \uD070 \uC218\uB97C \uAD6C\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O(N\u00B2 log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825', desc: '힙 크기를 N으로 제한하여 메모리 12MB 제한을 지킵니다.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: '\uD799 \uC720\uC9C0', desc: '힙 크기 < N이면 push, 아니면 새 값 > 루트일 때만 heapreplace로 교체합니다.', code: 'for _ in range(n):\n    row = list(map(int, input().split()))\n    for x in row:\n        if len(heap) < n:\n            heapq.heappush(heap, x)\n        elif x > heap[0]:\n            heapq.heapreplace(heap, x)' },
                        { title: '\uCD9C\uB825', desc: '크기 N 최소 힙의 루트가 곧 N번째 큰 수입니다.', code: 'print(heap[0])' }
                    ],
                    cpp: [
                        { title: '\uC785\uB825', desc: '\uCD5C\uC18C \uD799\uC73C\uB85C \uD06C\uAE30 N\uC744 \uC720\uC9C0.\nN\u00B2\uAC1C\uB97C \uB2E4 \uC800\uC7A5\uD558\uBA74 \uBA54\uBAA8\uB9AC \uCD08\uACFC(12MB)!', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, x;\n    cin >> n;\n    // \uCD5C\uC18C \uD799: \uD06C\uAE30 N\uC744 \uC720\uC9C0\uD558\uBA74 \uB8E8\uD2B8 = N\uBC88\uC9F8 \uD070 \uC218\n    priority_queue<int, vector<int>, greater<int>> pq;' },
                        { title: '\uD799 \uC720\uC9C0', desc: '\uD799 \uD06C\uAE30 < N\uC774\uBA74 \uADF8\uB0E5 push.\n\uC0C8 \uAC12 > \uD799 \uB8E8\uD2B8\uC77C \uB54C\uB9CC pop \uD6C4 push (heapreplace \uB300\uC751).', code: '    for (int i = 0; i < n * n; i++) {\n        cin >> x;\n        if ((int)pq.size() < n) {\n            pq.push(x);\n        } else if (x > pq.top()) {\n            pq.pop();   // \uAC00\uC7A5 \uC791\uC740 \uAC12 \uC81C\uAC70\n            pq.push(x); // \uB354 \uD070 \uAC12\uC73C\uB85C \uAD50\uCCB4\n        }\n    }' },
                        { title: '\uCD9C\uB825', desc: 'top()이 N번째 큰 수. Python의 heap[0]과 동일한 역할.', code: '    cout << pq.top() << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-2696', title: 'BOJ 2696 - 중앙값 구하기', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2696',
            simIntro: '최대 힙 + 최소 힙으로 중앙값을 실시간으로 구하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>어떤 수열을 읽고, 홀수 번째 수를 읽을 때마다 지금까지 읽은 값의 중앙값을 출력하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 테스트 케이스의 개수 T가 주어진다. 각 테스트 케이스의 첫째 줄에는 수열의 크기 M이 주어지고, 그 다음 줄부터 수열의 원소가 한 줄에 10개씩 나누어 주어진다. M은 9999 이하의 홀수이다.</p>
                <h4>출력</h4>
                <p>각 테스트 케이스에 대해, 첫째 줄에 중앙값의 개수를 출력하고, 그 다음 줄부터 중앙값을 한 줄에 10개씩 출력한다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3
9
1 2 3 4 5 6 7 8 9
9
9 8 7 6 5 4 3 2 1
23
23 41 13 22 -3 24 -31 -11 -8 -7
3 5 103 211 -311 -45 0 1 2 3
0 -2 99</pre></div>
                    <div><strong>출력</strong><pre>5
1 2 3 4 5
5
9 9 8 7 6
12
23 23 22 22 13 3 5 5 3 0 0 -2</pre></div>
                </div>
                <p class="example-explain">출력 첫 줄: 중앙값 개수, 이후 줄: 중앙값을 한 줄에 최대 10개씩 출력한다.</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>T ≤ 1,000 (테스트 케이스 수)</li>
                    <li>M은 9,999 이하의 홀수</li>
                    <li>수열의 각 값은 -32,768 ~ 32,767</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '홀수 번째 수를 읽을 때마다 "지금까지의 중앙값"을 출력하라니까...<br>매번 <strong>지금까지 읽은 숫자를 정렬</strong>하고 가운데 값을 꺼내면 되지 않을까?<br><br>예: [1, 2, 3, 4, 5] → 정렬 → 가운데(3번째) = 3!' },
                { title: '근데 이러면 문제가 있어', content: '숫자가 하나 들어올 때마다 전체를 정렬하면 <strong>O(N log N)</strong>이야.<br>M이 최대 9,999이면 매 홀수 번째마다 정렬 → 약 5,000 \u00D7 10,000 \u00D7 log(10,000) \u2248 <strong>6억 번</strong>... 시간 초과 위험!<br><br>숫자가 하나 추가될 때마다 <strong>정렬을 다시 하는 건 낭비</strong>야. 이미 정렬된 상태에서 하나만 추가되는 건데...' },
                { title: '이렇게 하면 어떨까?', content: '핵심 아이디어: 수열을 <strong>절반으로 나눠서</strong> 관리하자!<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="display:flex;gap:20px;justify-content:center;align-items:flex-start;flex-wrap:wrap;"><div style="text-align:center;flex:1;min-width:120px;"><div style="font-weight:700;color:var(--accent);margin-bottom:6px;">최대 힙 (maxH)</div><div style="font-size:0.82em;color:var(--text2);margin-bottom:6px;">작은 쪽 절반</div><div style="display:flex;flex-direction:column;align-items:center;gap:3px;"><span style="padding:4px 14px;background:var(--green);color:#fff;border-radius:6px;font-weight:700;font-size:1.1em;">3 ← 루트</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">1</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">2</span></div></div><div style="display:flex;align-items:center;font-size:1.5em;color:var(--text2);padding-top:30px;">|</div><div style="text-align:center;flex:1;min-width:120px;"><div style="font-weight:700;color:var(--accent);margin-bottom:6px;">최소 힙 (minH)</div><div style="font-size:0.82em;color:var(--text2);margin-bottom:6px;">큰 쪽 절반</div><div style="display:flex;flex-direction:column;align-items:center;gap:3px;"><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">5</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">7</span></div></div></div><div style="text-align:center;margin-top:8px;color:var(--green);font-weight:600;">maxH 루트(3) = 중앙값!</div></div>\u2022 <strong>최대 힙(maxH)</strong>: 작은 쪽 절반 → 이 중 가장 큰 값이 루트<br>\u2022 <strong>최소 힙(minH)</strong>: 큰 쪽 절반 → 이 중 가장 작은 값이 루트<br><br>두 힙의 크기를 균형 맞추면 (maxH 크기 \u2265 minH 크기), <strong>maxH의 루트가 바로 중앙값</strong>이야!<br><br>새 숫자가 들어오면:<br>1. maxH 루트보다 작으면 maxH에, 크면 minH에 넣기<br>2. 크기가 불균형하면 한쪽에서 다른 쪽으로 옮기기<br><br>삽입+균형 맞추기가 <strong>O(log N)</strong>이라서 전체 <strong>O(M log M)</strong>으로 해결!' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span>에선 이렇게!', content: '<span class="lang-py"><code>heapq</code>는 최소 힙이라, maxH는 <strong>-1 곱하기 트릭</strong>을 써야 해.<br><code>heappush(maxH, -x)</code>로 넣고, 루트는 <code>-maxH[0]</code>으로 확인.<br>균형 맞추기: maxH가 2개 더 많으면 minH로, minH가 더 많으면 maxH로 옮기기!</span><span class="lang-cpp">C++은 <code>priority_queue&lt;int&gt;</code>가 기본 최대 힙이라 maxH는 그대로!<br>minH는 <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code>로 최소 힙.<br><code>maxH.top()</code>이 곧 중앙값. Python처럼 -1 곱할 필요가 없어서 더 직관적이야.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    M = int(input())\n    nums = []\n    while len(nums) < M:\n        nums.extend(map(int, input().split()))\n    maxH, minH, medians = [], [], []\n    for i, x in enumerate(nums):\n        if not maxH or x <= -maxH[0]:\n            heapq.heappush(maxH, -x)\n        else:\n            heapq.heappush(minH, x)\n        if len(maxH) > len(minH) + 1:\n            heapq.heappush(minH, -heapq.heappop(maxH))\n        elif len(minH) > len(maxH):\n            heapq.heappush(maxH, -heapq.heappop(minH))\n        if (i + 1) % 2 == 1:\n            medians.append(-maxH[0])\n    print(len(medians))\n    for i in range(0, len(medians), 10):\n        print(\' \'.join(map(str, medians[i:i+10])))',
                cpp: '#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int T; cin >> T;\n    while (T--) {\n        int M; cin >> M;\n        priority_queue<int> maxH;\n        priority_queue<int, vector<int>, greater<int>> minH;\n        vector<int> med;\n        for (int i = 0; i < M; i++) {\n            int x; cin >> x;\n            if (maxH.empty()||x<=maxH.top()) maxH.push(x); else minH.push(x);\n            if ((int)maxH.size()>(int)minH.size()+1){minH.push(maxH.top());maxH.pop();}\n            else if ((int)minH.size()>(int)maxH.size()){maxH.push(minH.top());minH.pop();}\n            if ((i+1)%2==1) med.push_back(maxH.top());\n        }\n        cout << med.size() << "\\n";\n        for (int i=0;i<(int)med.size();i++){cout<<med[i];if((i+1)%10==0||i==(int)med.size()-1)cout<<"\\n";else cout<<" ";}\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '\uB450 \uAC1C\uC758 \uD799',
                description: '\uCD5C\uB300 \uD799 + \uCD5C\uC18C \uD799\uC73C\uB85C \uC911\uC559\uAC12\uC744 \uC2E4\uC2DC\uAC04 \uC720\uC9C0\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O(M log M)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', desc: '두 개의 힙(최대 힙 + 최소 힙)으로 중앙값을 실시간 유지합니다.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    M = int(input())\n    nums = []\n    while len(nums) < M:\n        nums.extend(map(int, input().split()))' },
                        { title: '\uD799 \uC0BD\uC785 \uBC0F \uADE0\uD615', desc: 'maxH(작은 절반)과 minH(큰 절반) 크기를 균형 맞춰 maxH 루트 = 중앙값.', code: '    maxH, minH, medians = [], [], []\n    for i, x in enumerate(nums):\n        if not maxH or x <= -maxH[0]:\n            heapq.heappush(maxH, -x)\n        else:\n            heapq.heappush(minH, x)\n        if len(maxH) > len(minH) + 1:\n            heapq.heappush(minH, -heapq.heappop(maxH))\n        elif len(minH) > len(maxH):\n            heapq.heappush(maxH, -heapq.heappop(minH))' },
                        { title: '\uC911\uC559\uAC12 \uCD9C\uB825', desc: '홀수 번째마다 maxH 루트(-maxH[0])가 중앙값. 10개씩 줄바꿈 출력.', code: '        if (i + 1) % 2 == 1:\n            medians.append(-maxH[0])\n    print(len(medians))\n    for i in range(0, len(medians), 10):\n        print(\' \'.join(map(str, medians[i:i+10])))' }
                    ],
                    cpp: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', desc: 'C++ priority_queue\uB294 \uAE30\uBCF8\uC774 \uCD5C\uB300 \uD799 \u2192 maxH\uB294 \uADF8\uB300\uB85C.\nminH\uB294 greater<int>\uB85C \uCD5C\uC18C \uD799.', code: '#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int T;\n    cin >> T;\n    while (T--) {\n        int M;\n        cin >> M;\n        priority_queue<int> maxH;  // \uCD5C\uB300 \uD799 (\uC791\uC740 \uC808\uBC18)\n        priority_queue<int, vector<int>, greater<int>> minH;  // \uCD5C\uC18C \uD799 (\uD070 \uC808\uBC18)\n        vector<int> med;' },
                        { title: '\uD799 \uC0BD\uC785 \uBC0F \uADE0\uD615', desc: 'maxH \uD06C\uAE30 \u2265 minH \uD06C\uAE30 \uC720\uC9C0.\nmaxH\uC758 top = \uC911\uC559\uAC12.', code: '        for (int i = 0; i < M; i++) {\n            int x;\n            cin >> x;\n            // \uC791\uC740 \uC808\uBC18 \uB610\uB294 \uD070 \uC808\uBC18\uC5D0 \uC0BD\uC785\n            if (maxH.empty() || x <= maxH.top())\n                maxH.push(x);\n            else\n                minH.push(x);\n            // \uADE0\uD615 \uB9DE\uCD94\uAE30: maxH \uD06C\uAE30 \u2265 minH \uD06C\uAE30\n            if ((int)maxH.size() > (int)minH.size() + 1) {\n                minH.push(maxH.top()); maxH.pop();\n            } else if ((int)minH.size() > (int)maxH.size()) {\n                maxH.push(minH.top()); minH.pop();\n            }' },
                        { title: '\uC911\uC559\uAC12 \uCD9C\uB825', desc: '홀수 번째마다 maxH.top()이 중앙값. 한 줄에 10개씩 출력합니다.', code: '            if ((i + 1) % 2 == 1)\n                med.push_back(maxH.top());\n        }\n        cout << med.size() << \'\\n\';\n        for (int i = 0; i < (int)med.size(); i++) {\n            cout << med[i];\n            if ((i + 1) % 10 == 0 || i == (int)med.size() - 1)\n                cout << \'\\n\';\n            else\n                cout << \' \';\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-1202', title: 'BOJ 1202 - 보석 도둑', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1202',
            simIntro: '가방을 작은 순서대로 처리하면서 그리디 + 힙으로 최적해를 구하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>세계적인 도둑 상덕이는 보석점을 털기로 했다. 보석점에 있는 보석 개수는 총 N개이다. 각 보석은 무게 M<sub>i</sub>와 가격 V<sub>i</sub>를 가지고 있다. 상덕이는 가방을 K개 가지고 있고, 각 가방에 담을 수 있는 최대 무게는 C<sub>i</sub>이다. 가방에는 최대 한 개의 보석만 넣을 수 있다.</p>
                <p>상덕이가 훔칠 수 있는 보석의 최대 가격을 구하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 N과 K가 주어진다. (1 &le; N, K &le; 300,000)</p>
                <p>다음 N개 줄에는 각 보석의 무게 M<sub>i</sub>와 가격 V<sub>i</sub>가 주어진다. (0 &le; M<sub>i</sub>, V<sub>i</sub> &le; 1,000,000)</p>
                <p>다음 K개 줄에는 가방에 담을 수 있는 최대 무게 C<sub>i</sub>가 주어진다. (1 &le; C<sub>i</sub> &le; 100,000,000)</p>
                <h4>출력</h4>
                <p>첫째 줄에 상덕이가 훔칠 수 있는 보석 가격의 합의 최댓값을 출력한다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2 1
5 10
100 100
11</pre></div>
                    <div><strong>출력</strong><pre>10</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 2
1 65
5 23
2 99
10
2</pre></div>
                    <div><strong>출력</strong><pre>164</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N, K ≤ 300,000</li>
                    <li>0 ≤ M<sub>i</sub>, V<sub>i</sub> ≤ 1,000,000</li>
                    <li>1 ≤ C<sub>i</sub> ≤ 100,000,000</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '가방마다 보석 하나씩 넣으니까... 각 가방에 <strong>들어갈 수 있는 보석 중 가장 비싼 걸</strong> 넣으면 최대 이득 아닌가?<br><br>가방마다 모든 보석을 확인해서 "무게가 맞고 가장 비싼 것"을 골라 넣자!' },
                { title: '근데 이러면 문제가 있어', content: 'N, K가 최대 30만이면, 가방 30만 개 \u00D7 보석 30만 개 = <strong>900억 번</strong> 비교... 완전히 시간 초과!<br><br>게다가 한 보석을 가방 A에 넣으면 가방 B에 못 넣으니까, <strong>어떤 가방에 어떤 보석을 배정하느냐</strong>가 중요해. 단순 완전 탐색으론 안 돼.' },
                { title: '이렇게 하면 어떨까?', content: '<strong>그리디 전략</strong>: 가방을 <strong>용량이 작은 순서</strong>대로 처리하자!<br><br>왜 작은 가방부터? 작은 가방에 들어가는 보석은 큰 가방에도 들어가지만, 반대는 아니거든. 그래서 <strong>선택지가 적은 가방부터</strong> 처리하는 게 최적이야.<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.85em;"><div style="font-weight:600;margin-bottom:8px;text-align:center;">가방 용량순 처리 예시</div><table style="border-collapse:collapse;width:100%;"><tr style="background:var(--bg3);"><th style="padding:5px 8px;border:1px solid var(--bg3);font-size:0.9em;">단계</th><th style="padding:5px 8px;border:1px solid var(--bg3);font-size:0.9em;">가방 용량</th><th style="padding:5px 8px;border:1px solid var(--bg3);font-size:0.9em;">힙에 추가</th><th style="padding:5px 8px;border:1px solid var(--bg3);font-size:0.9em;">선택</th></tr><tr><td style="padding:5px 8px;border:1px solid var(--bg3);text-align:center;">1</td><td style="padding:5px 8px;border:1px solid var(--bg3);text-align:center;">2</td><td style="padding:5px 8px;border:1px solid var(--bg3);">무게≤2: (1,65), (2,99)</td><td style="padding:5px 8px;border:1px solid var(--bg3);color:var(--green);font-weight:600;">99 선택!</td></tr><tr><td style="padding:5px 8px;border:1px solid var(--bg3);text-align:center;">2</td><td style="padding:5px 8px;border:1px solid var(--bg3);text-align:center;">10</td><td style="padding:5px 8px;border:1px solid var(--bg3);">무게≤10: (5,23) 추가</td><td style="padding:5px 8px;border:1px solid var(--bg3);color:var(--green);font-weight:600;">65 선택!</td></tr></table><div style="margin-top:6px;text-align:center;color:var(--green);font-weight:600;">합계 = 99 + 65 = 164</div></div>각 가방을 처리할 때:<br>1. 이 가방에 <strong>무게가 맞는 보석</strong>을 전부 최대 힙에 넣기<br>2. 힙에서 <strong>가장 비싼 보석</strong>을 하나 꺼내기<br><br>보석도 무게순 정렬해두면, 포인터 하나로 "아직 안 넣은 보석 중 무게가 맞는 것"을 순서대로 넣을 수 있어!' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span>에선 이렇게!', content: '<span class="lang-py">보석은 무게순 정렬, 가방은 용량순 정렬.<br>포인터 <code>j</code>로 보석을 순서대로 탐색하면서 <code>heappush(heap, -v)</code>로 가격을 최대 힙에 넣기. (-1 곱하기 트릭!)<br>각 가방마다 <code>-heappop(heap)</code>으로 가장 비싼 보석 선택.<br>전체 <strong>O((N+K) log N)</strong>으로 통과!</span><span class="lang-cpp">C++ <code>priority_queue&lt;int&gt;</code>는 기본이 최대 힙이라 가격을 그대로 넣으면 돼!<br>포인터 <code>j</code>로 보석을 무게순 탐색하면서 <code>pq.push(v)</code>로 넣고, 각 가방마다 <code>pq.top()</code>으로 가장 비싼 보석 선택.<br>답이 int 범위를 넘을 수 있으니 <code>long long</code> 사용! 전체 <strong>O((N+K) log N)</strong>.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\njewels = []\nfor _ in range(N):\n    m, v = map(int, input().split())\n    jewels.append((m, v))\nbags = [int(input()) for _ in range(K)]\n\njewels.sort()\nbags.sort()\n\nanswer = 0\nheap = []\nj = 0\nfor bag in bags:\n    while j < N and jewels[j][0] <= bag:\n        heapq.heappush(heap, -jewels[j][1])\n        j += 1\n    if heap:\n        answer += -heapq.heappop(heap)\nprint(answer)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N, K; cin >> N >> K;\n    vector<pair<int,int>> jewels(N); vector<int> bags(K);\n    for (int i=0;i<N;i++) cin >> jewels[i].first >> jewels[i].second;\n    for (int i=0;i<K;i++) cin >> bags[i];\n    sort(jewels.begin(),jewels.end()); sort(bags.begin(),bags.end());\n    priority_queue<int> pq; long long ans=0; int j=0;\n    for (int i=0;i<K;i++){while(j<N&&jewels[j].first<=bags[i]){pq.push(jewels[j].second);j++;}if(!pq.empty()){ans+=pq.top();pq.pop();}}\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '\uADF8\uB9AC\uB514 + \uCD5C\uB300 \uD799',
                description: '\uAC00\uBC29 \uC21C\uC11C\uB300\uB85C \uCC98\uB9AC\uD558\uBA70 \uCD5C\uB300 \uD799\uC73C\uB85C \uAC00\uC7A5 \uBE44\uC2FC \uBCF4\uC11D\uC744 \uC120\uD0DD\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O((N+K) log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uC815\uB82C', desc: '보석은 무게순, 가방은 용량순 정렬. 작은 가방부터 처리하기 위함.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\njewels = []\nfor _ in range(N):\n    m, v = map(int, input().split())\n    jewels.append((m, v))\nbags = [int(input()) for _ in range(K)]\njewels.sort()\nbags.sort()' },
                        { title: '\uADF8\uB9AC\uB514 + \uD799', desc: '가방마다 담을 수 있는 보석을 최대 힙에 넣고, 가장 비싼 것을 선택합니다.', code: 'answer = 0\nheap = []\nj = 0\nfor bag in bags:\n    while j < N and jewels[j][0] <= bag:\n        heapq.heappush(heap, -jewels[j][1])\n        j += 1\n    if heap:\n        answer += -heapq.heappop(heap)' },
                        { title: '\uCD9C\uB825', desc: '모든 가방을 처리한 뒤 누적 가격 합을 출력합니다.', code: 'print(answer)' }
                    ],
                    cpp: [
                        { title: '\uC785\uB825 \uBC0F \uC815\uB82C', desc: 'pair<\uBB34\uAC8C, \uAC00\uACA9>\uC73C\uB85C \uC815\uB82C \u2192 \uBB34\uAC8C \uAE30\uC900 \uC790\uB3D9 \uC815\uB82C.\n\uAC00\uBC29\uB3C4 \uC6A9\uB7C9 \uC791\uC740 \uC21C\uC11C\uB85C \uC815\uB82C.', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, K;\n    cin >> N >> K;\n    vector<pair<int,int>> jewels(N);  // {\uBB34\uAC8C, \uAC00\uACA9}\n    vector<int> bags(K);\n    for (int i = 0; i < N; i++)\n        cin >> jewels[i].first >> jewels[i].second;\n    for (int i = 0; i < K; i++)\n        cin >> bags[i];\n    sort(jewels.begin(), jewels.end());\n    sort(bags.begin(), bags.end());' },
                        { title: '\uADF8\uB9AC\uB514 + \uD799', desc: '\uAC00\uBC29\uB9C8\uB2E4 \uB4E4\uC5B4\uAC08 \uC218 \uC788\uB294 \uBCF4\uC11D\uC744 \uCD5C\uB300 \uD799\uC5D0 \uB123\uACE0,\n\uAC00\uC7A5 \uBE44\uC2FC \uBCF4\uC11D\uC744 \uAEBC\uB0C4.\nC++ priority_queue\uB294 \uAE30\uBCF8\uC774 \uCD5C\uB300 \uD799\uC774\uB77C -1 \uACF1\uD560 \uD544\uC694 \uC5C6\uC74C.', code: '    priority_queue<int> pq;  // \uCD5C\uB300 \uD799: \uAC00\uC7A5 \uBE44\uC2FC \uBCF4\uC11D\uC774 top\n    long long ans = 0;\n    int j = 0;\n    for (int i = 0; i < K; i++) {\n        // \uD604\uC7AC \uAC00\uBC29\uC5D0 \uB4E4\uC5B4\uAC08 \uC218 \uC788\uB294 \uBCF4\uC11D \uBAA8\uB450 \uD799\uC5D0 \uB123\uAE30\n        while (j < N && jewels[j].first <= bags[i]) {\n            pq.push(jewels[j].second);\n            j++;\n        }\n        if (!pq.empty()) {\n            ans += pq.top();\n            pq.pop();\n        }\n    }' },
                        { title: '\uCD9C\uB825', desc: 'long long으로 누적한 총 가격을 출력합니다.', code: '    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[5].templates; }
            }]
        }
    ],

    _renderProblemDetail: function(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', function() { priorityQueueTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.priorityqueue = priorityQueueTopic;
