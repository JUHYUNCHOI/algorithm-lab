// ===== 우선순위 큐 토픽 모듈 =====
var priorityQueueTopic = {
    id: 'priorityqueue',
    title: '우선순위 큐',
    icon: '🏥',
    category: '고급 자료구조와 그래프',
    order: 15,
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
                <div class="code-block"><pre><code class="language-python"># 힙을 배열로 저장하기 (1-indexed)\n#\n#        1          <- 인덱스 1 (루트)\n#       / \\\\\n#      3    5       <- 인덱스 2, 3\n#     / \\\\  /\n#    7   9 8       <- 인덱스 4, 5, 6\n#\n# 배열: [-, 1, 3, 5, 7, 9, 8]  (0번 인덱스는 사용 안 함)\n#\n# 부모 인덱스:    i // 2\n# 왼쪽 자식:      i * 2\n# 오른쪽 자식:    i * 2 + 1</code></pre></div>\
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
                <div class="code-block"><pre><code class="language-python"># 최소 힙 삽입 (Sift-Up)\ndef push(heap, val):\n    heap.append(val)\n    i = len(heap) - 1\n    while i > 1 and heap[i] < heap[i // 2]:\n        heap[i], heap[i // 2] = heap[i // 2], heap[i]\n        i = i // 2\n\n# 최소 힙 삭제 (Sift-Down)\ndef pop(heap):\n    if len(heap) <= 1:\n        return None\n    root = heap[1]\n    heap[1] = heap[-1]\n    heap.pop()\n    i = 1\n    while i * 2 < len(heap):\n        child = i * 2\n        if child + 1 < len(heap) and heap[child + 1] < heap[child]:\n            child += 1\n        if heap[i] > heap[child]:\n            heap[i], heap[child] = heap[child], heap[i]\n            i = child\n        else:\n            break\n    return root</code></pre></div>\
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
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> 파이썬의 heapq 사용법</div>\
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
                        이것이 바로 <strong>BOJ 11286 절댓값 힙</strong>의 핵심입니다!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> 우선순위 큐 문제 푸는 팁</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card"><h3>\u2460 기본 힙 연산</h3><p>heappush/heappop으로<br>최대\u00B7최소\u00B7절댓값 힙을 구현합니다.</p></div>\
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
            </div>\
        ';
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

    // ====================================================================
    // 시뮬레이션 1: 최대 힙 (boj-11279)
    // ====================================================================
    _renderVizMaxHeap: function(container) {
        var self = this, suffix = '-maxheap';
        var ops = [0, 1, 0, 2, 0, 3, 0, 0, 0];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">최대 힙 동작</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">연산: 삽입(1), 삽입(2), 삽입(3), 삭제 3회</p>' +
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
        var heap = [], states = [{ h: [], msg: '최대 힙에 값을 넣고 빼봅니다.' }];
        var sequence = [1, 2, 3];
        sequence.forEach(function(v) {
            heap.push(v); heap.sort(function(a, b) { return b - a; });
            states.push({ h: heap.slice(), msg: v + '을(를) 삽입! 힙: [' + heap.join(', ') + ']' });
        });
        for (var r = 0; r < 3 && heap.length > 0; r++) {
            var popped = heap.shift();
            states.push({ h: heap.slice(), msg: '최댓값 ' + popped + '을(를) 꺼냄! 힙: [' + (heap.length ? heap.join(', ') : '비어있음') + ']' });
        }
        renderHeap(states[0].h, states[0].msg);
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
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: 최소 힙 (boj-1927)
    // ====================================================================
    _renderVizMinHeap: function(container) {
        var self = this, suffix = '-minheap';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">최소 힙 동작</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">삽입: 5, 1, 3, 2 후 삭제 4회</p>' +
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
        var heap = [], states = [{ h: [], msg: '최소 힙에 값을 넣고 빼봅니다.' }];
        var seq = [5, 1, 3, 2];
        seq.forEach(function(v) {
            heap.push(v); heap.sort(function(a, b) { return a - b; });
            states.push({ h: heap.slice(), msg: v + ' 삽입! 힙: [' + heap.join(', ') + ']' });
        });
        for (var r = 0; r < 4 && heap.length > 0; r++) {
            var popped = heap.shift();
            states.push({ h: heap.slice(), msg: '최솟값 ' + popped + ' 꺼냄! 힙: [' + (heap.length ? heap.join(', ') : '비어있음') + ']' });
        }
        renderHeap(states[0].h, states[0].msg);
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
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 절댓값 힙 (boj-11286)
    // ====================================================================
    _renderVizAbsHeap: function(container) {
        var self = this, suffix = '-absheap';
        var seq = [1, -1, 0, 0, 0];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">절댓값 힙</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">입력: 1, -1, 0(꺼내기), 0, 0 \u2014 절댓값이 작은 것 우선, 같으면 실제 값이 작은 것 우선</p>' +
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
        var heap = [], states = [{ h: [], msg: '절댓값 힙 시뮬레이션을 시작합니다.' }];
        function absSort(a, b) { if (Math.abs(a) !== Math.abs(b)) return Math.abs(a) - Math.abs(b); return a - b; }
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
        renderHeap(states[0].h, states[0].msg);
        var steps = [];
        for (var i = 1; i < states.length; i++) {
            (function(cur, prev) {
                steps.push({ description: cur.msg, action: function() { renderHeap(cur.h, cur.msg); }, undo: function() { renderHeap(prev.h, prev.msg); } });
            })(states[i], states[i - 1]);
        }
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: N번째 큰 수 (boj-2075)
    // ====================================================================
    _renderVizNthLargest: function(container) {
        var self = this, suffix = '-nth';
        var N = 3;
        var rows = [[12, 7, 9], [13, 8, 11], [21, 10, 26]];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">N번째 큰 수 \u2014 크기 제한 힙</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">N=' + N + '. 크기 ' + N + '인 최소 힙을 유지하면서 각 행을 처리합니다.</p>' +
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
        var heap = [], states = [{ h: [], msg: '크기 ' + N + '인 최소 힙을 유지하면서 처리합니다.' }];
        rows.forEach(function(row, ri) {
            row.forEach(function(x) {
                if (heap.length < N) {
                    heap.push(x); heap.sort(function(a, b) { return a - b; });
                    states.push({ h: heap.slice(), msg: x + ' 삽입 (힙 크기 < ' + N + '). 힙: [' + heap.join(', ') + ']' });
                } else if (x > heap[0]) {
                    var old = heap[0]; heap[0] = x; heap.sort(function(a, b) { return a - b; });
                    states.push({ h: heap.slice(), msg: x + ' > 루트(' + old + '). 교체! 힙: [' + heap.join(', ') + ']' });
                } else {
                    states.push({ h: heap.slice(), msg: x + ' \u2264 루트(' + heap[0] + '). 무시!' });
                }
            });
        });
        states.push({ h: heap.slice(), msg: '<strong style="color:var(--green);">\u2705 N번째 큰 수 = ' + heap[0] + ' (힙 루트)</strong>' });
        renderH(states[0].h, states[0].msg);
        var steps = [];
        for (var i = 1; i < states.length; i++) {
            (function(cur, prev) {
                steps.push({ description: cur.msg.replace(/<[^>]+>/g, ''), action: function() { renderH(cur.h, cur.msg); }, undo: function() { renderH(prev.h, prev.msg); } });
            })(states[i], states[i - 1]);
        }
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 5: 중앙값 구하기 (boj-2696)
    // ====================================================================
    _renderVizMedianHeap: function(container) {
        var self = this, suffix = '-median';
        var nums = [1, 5, 4, 3, 2];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">두 개의 힙으로 중앙값</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">수열: [' + nums.join(', ') + ']. 홀수 번째마다 중앙값을 출력합니다.</p>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;">' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(108,92,231,0.1);color:var(--primary);margin-bottom:4px;">최대 힙 (작은 절반)</div><div id="md-max' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;"></div></div>' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(0,184,148,0.1);color:var(--green);margin-bottom:4px;">최소 힙 (큰 절반)</div><div id="md-min' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;"></div></div></div>' +
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
        var maxH = [], minH = [];
        var states = [{ mx: [], mn: [], med: null, msg: '수열을 하나씩 넣으며 중앙값을 구합니다.' }];
        nums.forEach(function(x, idx) {
            if (maxH.length === 0 || x <= Math.max.apply(null, maxH)) { maxH.push(x); } else { minH.push(x); }
            if (maxH.length > minH.length + 1) { var mv = Math.max.apply(null, maxH); maxH.splice(maxH.indexOf(mv), 1); minH.push(mv); }
            else if (minH.length > maxH.length) { var mv2 = Math.min.apply(null, minH); minH.splice(minH.indexOf(mv2), 1); maxH.push(mv2); }
            var med = Math.max.apply(null, maxH);
            var isOdd = (idx + 1) % 2 === 1;
            states.push({ mx: maxH.slice(), mn: minH.slice(), med: med, msg: x + ' 삽입. ' + (isOdd ? '\uC911\uC559\uAC12 = ' + med : '\uC544\uC9C1 \uD640\uC218 \uBC88\uC9F8 \uC544\uB2D8') });
        });
        states.push({ mx: maxH.slice(), mn: minH.slice(), med: Math.max.apply(null, maxH), msg: '<strong style="color:var(--green);">\u2705 \uC644\uB8CC! \uC911\uC559\uAC12 \uCD9C\uB825: 1, 4, 3</strong>' });
        renderState(states[0].mx, states[0].mn, states[0].med, states[0].msg);
        var steps = [];
        for (var i = 1; i < states.length; i++) {
            (function(cur, prev) {
                steps.push({ description: cur.msg.replace(/<[^>]+>/g, ''), action: function() { renderState(cur.mx, cur.mn, cur.med, cur.msg); }, undo: function() { renderState(prev.mx, prev.mn, prev.med, prev.msg); } });
            })(states[i], states[i - 1]);
        }
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 6: 보석 도둑 (boj-1202)
    // ====================================================================
    _renderVizJewelThief: function(container) {
        var self = this, suffix = '-jewel';
        var jewels = [[1, 65], [5, 23], [2, 99]];
        var bags = [10, 2];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">보석 도둑 \u2014 그리디 + 힙</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">보석: (무게,가격) = ' + jewels.map(function(j) { return '(' + j[0] + ',' + j[1] + ')'; }).join(', ') + '. 가방 용량: [' + bags.join(', ') + ']</p>' +
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
        renderH(states[0].h, states[0].msg);
        var steps = [];
        for (var i = 1; i < states.length; i++) {
            (function(cur, prev) {
                steps.push({ description: cur.msg.replace(/<[^>]+>/g, ''), action: function() { renderH(cur.h, cur.msg); }, undo: function() { renderH(prev.h, prev.msg); } });
            })(states[i], states[i - 1]);
        }
        self._initStepController(container, steps, suffix);
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
            self._createStepControls(suffix) + '</div>';
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
            steps.push({ description: val + '을(를) 배열 끝에 추가', action: function() { renderAll(afterAdd, val + ' 추가! 부모와 비교합니다.'); }, undo: function() { renderAll(heap, '삽입 전 상태'); } });
            var sim = afterAdd.slice(), ci = afterAdd.length - 1;
            swaps.forEach(function(sw) { var pi = Math.floor(ci / 2); var cv = sim[ci], pv = sim[pi]; var t2 = sim[ci]; sim[ci] = sim[pi]; sim[pi] = t2; var after = sim.slice(); var next = pi;
                steps.push({ description: cv + ' < ' + pv + ' 교환!', action: function() { renderAll(after, cv + '과 ' + pv + '을 교환!'); }, undo: function() { renderAll(afterAdd, '교환 전'); } }); ci = next; });
            var fin = sim.slice();
            steps.push({ description: '삽입 완료!', action: function() { heap = fin.slice(); renderAll(heap, '\u2705 삽입 완료! 힙: [' + heap.slice(1).join(', ') + ']'); }, undo: function() { renderAll(sim, '삽입 완료 전'); } });
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
            steps2.push({ description: '루트(' + rootVal + ')를 꺼냄', action: function() { renderAll(orig, rootVal + '을(를) 꺼냅니다!'); }, undo: function() { renderAll(orig, '삭제 전'); } });
            var afterMove = orig.slice(); afterMove[1] = afterMove[afterMove.length - 1]; afterMove.pop();
            steps2.push({ description: lastVal + '을(를) 루트로 이동', action: function() { renderAll(afterMove, lastVal + '을(를) 루트로! 자식과 비교합니다.'); }, undo: function() { renderAll(orig, rootVal + '을(를) 꺼냅니다!'); } });
            var sim2 = afterMove.slice(), ci2 = 1;
            swaps2.forEach(function() { var c2 = ci2 * 2; if (c2 + 1 < sim2.length && sim2[c2 + 1] < sim2[c2]) c2++; var pv2 = sim2[ci2], cv2 = sim2[c2]; var t4 = sim2[ci2]; sim2[ci2] = sim2[c2]; sim2[c2] = t4; var af = sim2.slice();
                steps2.push({ description: pv2 + ' > ' + cv2 + ' 교환!', action: function() { renderAll(af, pv2 + '과 ' + cv2 + '을 교환!'); }, undo: function() { renderAll(afterMove, '교환 전'); } }); ci2 = c2; });
            var fin2 = sim2.slice();
            steps2.push({ description: '삭제 완료! 꺼낸 값: ' + rootVal, action: function() { heap = fin2.slice(); renderAll(heap, '\u2705 삭제 완료! 꺼낸 값: ' + rootVal + '. 힙: [' + heap.slice(1).join(', ') + ']'); }, undo: function() { renderAll(sim2, '삭제 완료 전'); } });
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
            self._createStepControls(suffix) + '</div>';
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
            descriptionHTML: '<h3>문제</h3><p>최대 힙을 이용하여 다음과 같은 연산을 지원하는 프로그램을 작성하시오.</p><p>자연수 x를 넣는다. 배열에서 가장 큰 값을 출력하고 제거한다. x가 0이면 가장 큰 값을 출력하고 제거.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 연산의 개수 N (1 \u2264 N \u2264 100,000). 다음 N개의 줄에 정수 x.</p></div><div><h4>출력</h4><p>입력에서 0이 주어질 때마다 가장 큰 값을 출력. 비어있으면 0.</p></div></div>',
            hints: [
                { title: '접근법', content: 'Python heapq는 <strong>최소 힙</strong>만 지원합니다. <strong>-1을 곱해서</strong> 넣으면 최대 힙처럼 동작합니다!' },
                { title: '핵심 코드', content: '<code>heappush(heap, -x)</code>로 넣고 <code>-heappop(heap)</code>로 꺼냅니다.' },
                { title: '시간 복잡도', content: 'O(N log N)입니다.' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, -x)\n    else:\n        if heap:\n            print(-heapq.heappop(heap))\n        else:\n            print(0)',
                cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int> pq;\n    while (n--) {\n        cin >> x;\n        if (x > 0) pq.push(x);\n        else { if (!pq.empty()) { cout << pq.top() << "\\n"; pq.pop(); } else cout << 0 << "\\n"; }\n    }\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        int n = Integer.parseInt(br.readLine().trim());\n        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());\n        for (int i = 0; i < n; i++) {\n            int x = Integer.parseInt(br.readLine().trim());\n            if (x > 0) pq.offer(x);\n            else sb.append(pq.isEmpty() ? 0 : pq.poll()).append(\'\\n\');\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '\uCD5C\uB300 \uD799 (-1 \uACF1\uD558\uAE30)',
                description: 'heapq\uC5D0 -x\uB97C \uB123\uACE0 \uAEBC\uB0BC \uB54C -1\uC744 \uACF1\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: '\uC5F0\uC0B0 \uCC98\uB9AC', code: 'for _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, -x)' },
                        { title: '\uCD9C\uB825', code: '    else:\n        if heap:\n            print(-heapq.heappop(heap))\n        else:\n            print(0)' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-1927', title: 'BOJ 1927 - 최소 힙', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1927',
            simIntro: '최소 힙에서 삽입과 삭제가 어떻게 동작하는지 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>최소 힙을 이용하여 다음과 같은 연산을 지원하는 프로그램을 작성하시오.</p><p>배열에 자연수 x를 넣는다. 배열에서 가장 작은 값을 출력하고 제거한다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 연산의 개수 N. 다음 N개의 줄에 정수 x. x가 자연수이면 넣고, 0이면 가장 작은 값을 출력하고 제거.</p></div><div><h4>출력</h4><p>0이 주어질 때마다 가장 작은 값 출력. 비어있으면 0.</p></div></div>',
            hints: [
                { title: '접근법', content: 'Python heapq는 기본이 <strong>최소 힙</strong>이므로 그대로 사용하면 됩니다!' },
                { title: '핵심 코드', content: '<code>heapq.heappush(heap, x)</code>로 넣고 <code>heapq.heappop(heap)</code>로 꺼냅니다.' },
                { title: '시간 복잡도', content: 'O(N log N)입니다.' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, x)\n    else:\n        if heap:\n            print(heapq.heappop(heap))\n        else:\n            print(0)',
                cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int, vector<int>, greater<int>> pq;\n    while (n--) {\n        cin >> x;\n        if (x > 0) pq.push(x);\n        else { if (!pq.empty()) { cout << pq.top() << "\\n"; pq.pop(); } else cout << 0 << "\\n"; }\n    }\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        int n = Integer.parseInt(br.readLine().trim());\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int i = 0; i < n; i++) {\n            int x = Integer.parseInt(br.readLine().trim());\n            if (x > 0) pq.offer(x);\n            else sb.append(pq.isEmpty() ? 0 : pq.poll()).append(\'\\n\');\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '\uCD5C\uC18C \uD799 (heapq \uAE30\uBCF8)',
                description: 'heapq\uB97C \uADF8\uB300\uB85C \uC0AC\uC6A9\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: '\uC5F0\uC0B0 \uCC98\uB9AC', code: 'for _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, x)' },
                        { title: '\uCD9C\uB825', code: '    else:\n        if heap:\n            print(heapq.heappop(heap))\n        else:\n            print(0)' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-11286', title: 'BOJ 11286 - 절댓값 힙', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11286',
            simIntro: '절댓값 힙에서 (abs(x), x) 튜플이 어떻게 정렬되는지 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>절댓값 힙은 다음과 같은 연산을 지원합니다.</p><p>\u2460 배열에 정수 x를 넣는다. \u2461 절댓값이 가장 작은 값을 출력하고 제거. 같으면 실제 값이 작은 것 우선.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N. 다음 N줄에 정수 x. 0이 아니면 넣고, 0이면 절댓값 최솟값 출력.</p></div><div><h4>출력</h4><p>0이 주어질 때마다 답 출력. 비어있으면 0.</p></div></div>',
            hints: [
                { title: '접근법', content: '<strong>(abs(x), x)</strong> 튜플을 힙에 넣으면 자동으로 해결됩니다.' },
                { title: '핵심 코드', content: '<code>heapq.heappush(heap, (abs(x), x))</code>로 넣고 <code>heapq.heappop(heap)[1]</code>로 꺼냅니다.' },
                { title: '시간 복잡도', content: 'O(N log N)입니다.' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    x = int(input())\n    if x != 0:\n        heapq.heappush(heap, (abs(x), x))\n    else:\n        if heap:\n            print(heapq.heappop(heap)[1])\n        else:\n            print(0)',
                cpp: '#include <iostream>\n#include <queue>\n#include <cstdlib>\nusing namespace std;\nstruct cmp { bool operator()(int a, int b) { if (abs(a)==abs(b)) return a>b; return abs(a)>abs(b); } };\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int, vector<int>, cmp> pq;\n    while (n--) { cin >> x; if (x!=0) pq.push(x); else { if (!pq.empty()) { cout << pq.top() << "\\n"; pq.pop(); } else cout << 0 << "\\n"; } }\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        int n = Integer.parseInt(br.readLine().trim());\n        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> { if (Math.abs(a)!=Math.abs(b)) return Math.abs(a)-Math.abs(b); return a-b; });\n        for (int i = 0; i < n; i++) { int x = Integer.parseInt(br.readLine().trim()); if (x!=0) pq.offer(x); else sb.append(pq.isEmpty()?0:pq.poll()).append(\'\\n\'); }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '\uD29C\uD50C (abs(x), x)',
                description: '\uC808\uB313\uAC12\uACFC \uC2E4\uC81C \uAC12\uC744 \uD29C\uD50C\uB85C \uBB36\uC5B4 \uD799\uC5D0 \uB123\uC2B5\uB2C8\uB2E4.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: '\uC5F0\uC0B0 \uCC98\uB9AC', code: 'for _ in range(n):\n    x = int(input())\n    if x != 0:\n        heapq.heappush(heap, (abs(x), x))' },
                        { title: '\uCD9C\uB825', code: '    else:\n        if heap:\n            print(heapq.heappop(heap)[1])\n        else:\n            print(0)' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-2075', title: 'BOJ 2075 - N번째 큰 수', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2075',
            simIntro: '크기 N인 최소 힙을 유지하면서 N번째 큰 수를 구하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N\u00D7N 표에서 N번째로 큰 수를 찾으시오. 메모리 제한 12MB!</p><div class="problem-io"><div><h4>입력</h4><p>N. 다음 N줄에 각 N개의 수.</p></div><div><h4>출력</h4><p>N번째 큰 수.</p></div></div>',
            hints: [
                { title: '접근법', content: '<strong>크기 N인 최소 힙</strong>을 유지합니다. N\u00B2개를 다 저장하면 메모리 초과!' },
                { title: '핵심 코드', content: '\uD799 \uD06C\uAE30 < N\uC774\uBA74 heappush, \uC544\uB2C8\uBA74 \uC0C8 \uAC12 > \uD799 \uB8E8\uD2B8\uC77C \uB54C\uB9CC heapreplace.' },
                { title: '시간 복잡도', content: 'O(N\u00B2 log N). \uD799 \uB8E8\uD2B8 = N\uBC88\uC9F8 \uD070 \uC218.' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    row = list(map(int, input().split()))\n    for x in row:\n        if len(heap) < n:\n            heapq.heappush(heap, x)\n        elif x > heap[0]:\n            heapq.heapreplace(heap, x)\nprint(heap[0])',
                cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 0; i < n*n; i++) { cin >> x; if ((int)pq.size()<n) pq.push(x); else if (x>pq.top()) { pq.pop(); pq.push(x); } }\n    cout << pq.top() << endl;\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int i = 0; i < n; i++) { StringTokenizer st = new StringTokenizer(br.readLine()); while (st.hasMoreTokens()) { int x = Integer.parseInt(st.nextToken()); if (pq.size()<n) pq.offer(x); else if (x>pq.peek()) { pq.poll(); pq.offer(x); } } }\n        System.out.println(pq.peek());\n    }\n}'
            },
            solutions: [{
                approach: '\uD06C\uAE30 \uC81C\uD55C \uCD5C\uC18C \uD799',
                description: '\uD799 \uD06C\uAE30\uB97C N\uC73C\uB85C \uC720\uC9C0\uD558\uBA70 N\uBC88\uC9F8 \uD070 \uC218\uB97C \uAD6C\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O(N\u00B2 log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: '\uD799 \uC720\uC9C0', code: 'for _ in range(n):\n    row = list(map(int, input().split()))\n    for x in row:\n        if len(heap) < n:\n            heapq.heappush(heap, x)\n        elif x > heap[0]:\n            heapq.heapreplace(heap, x)' },
                        { title: '\uCD9C\uB825', code: 'print(heap[0])' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-2696', title: 'BOJ 2696 - 중앙값 구하기', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2696',
            simIntro: '최대 힙 + 최소 힙으로 중앙값을 실시간으로 구하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>수열을 읽고, 홀수 번째 수를 읽을 때마다 지금까지 읽은 값의 중앙값을 출력합니다.</p><div class="problem-io"><div><h4>입력</h4><p>T. 각 테스트 케이스: M과 수열.</p></div><div><h4>출력</h4><p>중앙값 개수와 중앙값들 (한 줄에 10개씩).</p></div></div>',
            hints: [
                { title: '접근법', content: '<strong>\uB450 \uAC1C\uC758 \uD799</strong>: \uCD5C\uB300 \uD799(\uC791\uC740 \uC808\uBC18) + \uCD5C\uC18C \uD799(\uD070 \uC808\uBC18).' },
                { title: '핵심 코드', content: '\uCD5C\uB300 \uD799 \uD06C\uAE30 \u2265 \uCD5C\uC18C \uD799 \uD06C\uAE30 \uC720\uC9C0. \uCD5C\uB300 \uD799 \uB8E8\uD2B8 = \uC911\uC559\uAC12.' },
                { title: '시간 복잡도', content: '\uAC01 \uC0BD\uC785 O(log N), \uC804\uCCB4 O(M log M).' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    M = int(input())\n    nums = []\n    while len(nums) < M:\n        nums.extend(map(int, input().split()))\n    maxH, minH, medians = [], [], []\n    for i, x in enumerate(nums):\n        if not maxH or x <= -maxH[0]:\n            heapq.heappush(maxH, -x)\n        else:\n            heapq.heappush(minH, x)\n        if len(maxH) > len(minH) + 1:\n            heapq.heappush(minH, -heapq.heappop(maxH))\n        elif len(minH) > len(maxH):\n            heapq.heappush(maxH, -heapq.heappop(minH))\n        if (i + 1) % 2 == 1:\n            medians.append(-maxH[0])\n    print(len(medians))\n    for i in range(0, len(medians), 10):\n        print(\' \'.join(map(str, medians[i:i+10])))',
                cpp: '#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int T; cin >> T;\n    while (T--) {\n        int M; cin >> M;\n        priority_queue<int> maxH;\n        priority_queue<int, vector<int>, greater<int>> minH;\n        vector<int> med;\n        for (int i = 0; i < M; i++) {\n            int x; cin >> x;\n            if (maxH.empty()||x<=maxH.top()) maxH.push(x); else minH.push(x);\n            if ((int)maxH.size()>(int)minH.size()+1){minH.push(maxH.top());maxH.pop();}\n            else if ((int)minH.size()>(int)maxH.size()){maxH.push(minH.top());minH.pop();}\n            if ((i+1)%2==1) med.push_back(maxH.top());\n        }\n        cout << med.size() << "\\n";\n        for (int i=0;i<(int)med.size();i++){cout<<med[i];if((i+1)%10==0||i==(int)med.size()-1)cout<<"\\n";else cout<<" ";}\n    }\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        int T = Integer.parseInt(br.readLine().trim());\n        while (T-- > 0) {\n            int M = Integer.parseInt(br.readLine().trim());\n            PriorityQueue<Integer> maxH = new PriorityQueue<>(Collections.reverseOrder());\n            PriorityQueue<Integer> minH = new PriorityQueue<>();\n            List<Integer> nums = new ArrayList<>(), med = new ArrayList<>();\n            while (nums.size()<M){StringTokenizer st=new StringTokenizer(br.readLine());while(st.hasMoreTokens())nums.add(Integer.parseInt(st.nextToken()));}\n            for (int i=0;i<M;i++){int x=nums.get(i);if(maxH.isEmpty()||x<=maxH.peek())maxH.offer(x);else minH.offer(x);if(maxH.size()>minH.size()+1){minH.offer(maxH.poll());}else if(minH.size()>maxH.size()){maxH.offer(minH.poll());}if((i+1)%2==1)med.add(maxH.peek());}\n            sb.append(med.size()).append(\'\\n\');\n            for(int i=0;i<med.size();i++){sb.append(med.get(i));if((i+1)%10==0||i==med.size()-1)sb.append(\'\\n\');else sb.append(\' \');}\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '\uB450 \uAC1C\uC758 \uD799',
                description: '\uCD5C\uB300 \uD799 + \uCD5C\uC18C \uD799\uC73C\uB85C \uC911\uC559\uAC12\uC744 \uC2E4\uC2DC\uAC04 \uC720\uC9C0\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O(M log M)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uCD08\uAE30\uD654', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    M = int(input())\n    nums = []\n    while len(nums) < M:\n        nums.extend(map(int, input().split()))' },
                        { title: '\uD799 \uC0BD\uC785 \uBC0F \uADE0\uD615', code: '    maxH, minH, medians = [], [], []\n    for i, x in enumerate(nums):\n        if not maxH or x <= -maxH[0]:\n            heapq.heappush(maxH, -x)\n        else:\n            heapq.heappush(minH, x)\n        if len(maxH) > len(minH) + 1:\n            heapq.heappush(minH, -heapq.heappop(maxH))\n        elif len(minH) > len(maxH):\n            heapq.heappush(maxH, -heapq.heappop(minH))' },
                        { title: '\uC911\uC559\uAC12 \uCD9C\uB825', code: '        if (i + 1) % 2 == 1:\n            medians.append(-maxH[0])\n    print(len(medians))\n    for i in range(0, len(medians), 10):\n        print(\' \'.join(map(str, medians[i:i+10])))' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-1202', title: 'BOJ 1202 - 보석 도둑', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1202',
            simIntro: '가방을 작은 순서대로 처리하면서 그리디 + 힙으로 최적해를 구하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N개의 보석(무게, 가격)과 K개의 가방(용량). 가방에는 최대 1개의 보석. 훔칠 수 있는 최대 가격 합을 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>N, K. N줄에 무게와 가격. K줄에 가방 용량.</p></div><div><h4>출력</h4><p>최대 가격 합.</p></div></div>',
            hints: [
                { title: '접근법', content: '\uAC00\uBC29\uC744 <strong>\uC6A9\uB7C9\uC774 \uC791\uC740 \uC21C\uC11C</strong>\uB85C, \uBCF4\uC11D\uC744 <strong>\uBB34\uAC8C \uC21C\uC11C</strong>\uB85C \uC815\uB82C\uD569\uB2C8\uB2E4.' },
                { title: '핵심 코드', content: '\uAC01 \uAC00\uBC29\uB9C8\uB2E4 \uB4E4\uC5B4\uAC08 \uC218 \uC788\uB294 \uBCF4\uC11D\uC744 <strong>\uCD5C\uB300 \uD799</strong>\uC5D0 \uB123\uACE0, \uAC00\uC7A5 \uBE44\uC2FC \uAC83\uC744 \uAEBC\uB0C5\uB2C8\uB2E4.' },
                { title: '시간 복잡도', content: 'O((N+K) log N)' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\njewels = []\nfor _ in range(N):\n    m, v = map(int, input().split())\n    jewels.append((m, v))\nbags = [int(input()) for _ in range(K)]\n\njewels.sort()\nbags.sort()\n\nanswer = 0\nheap = []\nj = 0\nfor bag in bags:\n    while j < N and jewels[j][0] <= bag:\n        heapq.heappush(heap, -jewels[j][1])\n        j += 1\n    if heap:\n        answer += -heapq.heappop(heap)\nprint(answer)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N, K; cin >> N >> K;\n    vector<pair<int,int>> jewels(N); vector<int> bags(K);\n    for (int i=0;i<N;i++) cin >> jewels[i].first >> jewels[i].second;\n    for (int i=0;i<K;i++) cin >> bags[i];\n    sort(jewels.begin(),jewels.end()); sort(bags.begin(),bags.end());\n    priority_queue<int> pq; long long ans=0; int j=0;\n    for (int i=0;i<K;i++){while(j<N&&jewels[j].first<=bags[i]){pq.push(jewels[j].second);j++;}if(!pq.empty()){ans+=pq.top();pq.pop();}}\n    cout << ans << endl;\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N=Integer.parseInt(st.nextToken()),K=Integer.parseInt(st.nextToken());\n        int[][] jewels=new int[N][2]; for(int i=0;i<N;i++){st=new StringTokenizer(br.readLine());jewels[i][0]=Integer.parseInt(st.nextToken());jewels[i][1]=Integer.parseInt(st.nextToken());}\n        int[] bags=new int[K]; for(int i=0;i<K;i++) bags[i]=Integer.parseInt(br.readLine().trim());\n        Arrays.sort(jewels,(a,b)->a[0]-b[0]); Arrays.sort(bags);\n        PriorityQueue<Integer> pq=new PriorityQueue<>(Collections.reverseOrder()); long ans=0; int j=0;\n        for(int bag:bags){while(j<N&&jewels[j][0]<=bag){pq.offer(jewels[j][1]);j++;}if(!pq.isEmpty())ans+=pq.poll();}\n        System.out.println(ans);\n    }\n}'
            },
            solutions: [{
                approach: '\uADF8\uB9AC\uB514 + \uCD5C\uB300 \uD799',
                description: '\uAC00\uBC29 \uC21C\uC11C\uB300\uB85C \uCC98\uB9AC\uD558\uBA70 \uCD5C\uB300 \uD799\uC73C\uB85C \uAC00\uC7A5 \uBE44\uC2FC \uBCF4\uC11D\uC744 \uC120\uD0DD\uD569\uB2C8\uB2E4.',
                timeComplexity: 'O((N+K) log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '\uC785\uB825 \uBC0F \uC815\uB82C', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\njewels = []\nfor _ in range(N):\n    m, v = map(int, input().split())\n    jewels.append((m, v))\nbags = [int(input()) for _ in range(K)]\njewels.sort()\nbags.sort()' },
                        { title: '\uADF8\uB9AC\uB514 + \uD799', code: 'answer = 0\nheap = []\nj = 0\nfor bag in bags:\n    while j < N and jewels[j][0] <= bag:\n        heapq.heappush(heap, -jewels[j][1])\n        j += 1\n    if heap:\n        answer += -heapq.heappop(heap)' },
                        { title: '\uCD9C\uB825', code: 'print(answer)' }
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
