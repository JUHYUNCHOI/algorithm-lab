// =========================================================
// 최단 경로 (Shortest Path) 토픽 모듈 — 4탭 시스템
// =========================================================
var shortestPathTopic = {
    id: 'shortestpath',
    title: '최단 경로',
    icon: '🛤️',
    category: '고급 자료구조와 그래프',
    order: 18,
    description: '가중치 그래프에서 최소 비용 경로를 찾는 알고리즘',
    relatedNote: '이 외에도 벨만-포드(음수 간선), SPFA, A* 탐색 등의 최단 경로 알고리즘이 있습니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-1753': { type: '다익스트라 기본',   color: 'var(--accent)', vizMethod: '_renderVizDijkstra' },
        'boj-11404':{ type: '플로이드-워셜',     color: 'var(--green)',  vizMethod: '_renderVizFloyd' },
        'boj-1916': { type: '다익스트라 응용',   color: '#e17055',       vizMethod: '_renderVizMinCost' },
        'lc-743':   { type: '다익스트라 응용',   color: '#6c5ce7',       vizMethod: '_renderVizDelay' }
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
            sim:     { intro: prob.simIntro || '최단 경로 알고리즘이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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

    // ===== 공통 탭 렌더러 =====
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
                <h2>🛤️ 최단 경로 (Shortest Path)</h2>\
                <p class="hero-sub">가중치 그래프에서 최소 비용으로 목적지까지 가는 방법을 배워봅시다!</p>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">1</span> 최단 경로란?\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 자동차 <strong>네비게이션</strong>을 생각해 보세요!<br><br>\
                    집에서 학교까지 가는 길이 여러 개 있습니다. 어떤 길은 거리가 짧고, 어떤 길은 멀지요.<br>\
                    네비게이션은 모든 길을 비교해서 <strong>가장 빠른(비용이 적은) 경로</strong>를 찾아줍니다.<br><br>\
                    이것이 바로 <strong>최단 경로 알고리즘</strong>입니다!<br>\
                    그래프의 간선에 <strong>가중치(비용)</strong>가 있을 때, 출발지에서 목적지까지 <strong>비용 합이 최소</strong>인 경로를 찾습니다.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="19" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="30" cy="19" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="13" y1="19" x2="25" y2="19" stroke="var(--green)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--green)">3</text></svg>\
                        </div>\
                        <h3>양수 가중치</h3>\
                        <p>간선의 비용이 모두 0 이상입니다.<br><strong>다익스트라 알고리즘</strong>으로 해결합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="30" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><line x1="13" y1="19" x2="25" y2="19" stroke="var(--red, #e17055)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--red, #e17055)">-2</text></svg>\
                        </div>\
                        <h3>음수 가중치</h3>\
                        <p>간선의 비용이 음수일 수 있습니다.<br><strong>벨만-포드 알고리즘</strong>이 필요합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="10" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="10" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="19" cy="30" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="15" y1="10" x2="23" y2="10" stroke="var(--accent)" stroke-width="2"/><line x1="12" y1="15" x2="17" y2="25" stroke="var(--accent)" stroke-width="2"/><line x1="26" y1="15" x2="21" y2="25" stroke="var(--accent)" stroke-width="2"/></svg>\
                        </div>\
                        <h3>단일 출발점</h3>\
                        <p>하나의 시작점에서 모든 정점까지의 최단 거리를 구합니다.<br>다익스트라, 벨만-포드가 해당됩니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2"/><line x1="4" y1="15" x2="34" y2="15" stroke="var(--yellow)" stroke-width="1"/><line x1="4" y1="26" x2="34" y2="26" stroke="var(--yellow)" stroke-width="1"/><line x1="15" y1="4" x2="15" y2="34" stroke="var(--yellow)" stroke-width="1"/><line x1="26" y1="4" x2="26" y2="34" stroke="var(--yellow)" stroke-width="1"/><text x="10" y="12" text-anchor="middle" font-size="7" fill="var(--yellow)">0</text><text x="21" y="12" text-anchor="middle" font-size="7" fill="var(--yellow)">3</text><text x="10" y="23" text-anchor="middle" font-size="7" fill="var(--yellow)">5</text></svg>\
                        </div>\
                        <h3>모든 쌍 최단경로</h3>\
                        <p>모든 정점 쌍 사이의 최단 거리를 구합니다.<br><strong>플로이드-워셜 알고리즘</strong>이 해당됩니다.</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">BFS로도 최단 경로를 구할 수 있는데, 다익스트라는 왜 필요할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        BFS는 <strong>모든 간선의 가중치가 1일 때만</strong> 최단 경로를 보장합니다!<br>\
                        간선마다 비용이 다르면 BFS로는 최단 경로를 구할 수 없습니다.<br>\
                        예: A→B 비용 1, A→C 비용 10이면, BFS는 둘 다 "1칸"으로 취급합니다.<br>\
                        <strong>가중치가 다를 때</strong>는 다익스트라가 필요합니다!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">2</span> 다익스트라 알고리즘 (Dijkstra)\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> "가장 가까운 곳부터 탐색하기"를 생각해 보세요!<br><br>\
                    여러분이 동네 지도를 갖고 있다고 합시다. 집에서 출발해서 가장 가까운 편의점에 먼저 가고,<br>\
                    그다음 가까운 곳을 방문하고... 이렇게 <strong>항상 현재까지 가장 가까운 미방문 장소</strong>부터 처리합니다.<br><br>\
                    이것이 다익스트라 알고리즘의 핵심입니다! 단, <strong>가중치가 모두 양수(0 이상)</strong>일 때만 올바르게 동작합니다.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="var(--accent)">+</text></svg>\
                        </div>\
                        <h3>양수 가중치 전용</h3>\
                        <p>간선 가중치가 음수이면 올바른 결과를 보장하지 않습니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="12" r="6" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="8" font-weight="bold" fill="var(--green)">min</text><circle cx="10" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="2"/><circle cx="28" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="2"/><line x1="16" y1="17" x2="12" y2="25" stroke="var(--border)" stroke-width="1.5"/><line x1="22" y1="17" x2="26" y2="25" stroke="var(--border)" stroke-width="1.5"/></svg>\
                        </div>\
                        <h3>최소 힙(heapq) 사용</h3>\
                        <p>거리가 가장 짧은 정점을 빠르게 꺼냅니다. 우선순위 큐를 사용합니다!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="24" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--accent)">O((V+E)</text><text x="19" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--accent)">log V)</text></svg>\
                        </div>\
                        <h3>시간 복잡도</h3>\
                        <p>우선순위 큐를 사용하면 O((V+E)logV)입니다. 매우 효율적입니다!</p>\
                    </div>\
                </div>\
\
                <div class="code-block">\
                    <pre><code class="language-python"># 다익스트라 알고리즘 (최소 힙 사용)\
\nimport heapq\
\nimport sys\
\ninput = sys.stdin.readline\
\nINF = float(\'inf\')\
\n\
\ndef dijkstra(start, graph, N):\
\n    dist = [INF] * (N + 1)\
\n    dist[start] = 0\
\n    heap = [(0, start)]\
\n\
\n    while heap:\
\n        d, v = heapq.heappop(heap)\
\n        if d > dist[v]:\
\n            continue\
\n        for u, w in graph[v]:\
\n            nd = d + w\
\n            if nd < dist[u]:\
\n                dist[u] = nd\
\n                heapq.heappush(heap, (nd, u))\
\n    return dist</code></pre>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">다익스트라에서 <code>if d > dist[v]: continue</code>는 왜 필요할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        힙에는 같은 정점이 여러 번 들어갈 수 있습니다!<br>\
                        예: A→B 비용 5로 (5, B)를 넣었는데, 나중에 A→C→B 비용 3으로 (3, B)를 또 넣습니다.<br>\
                        (3, B)가 먼저 처리된 후 (5, B)가 나오면, 이미 더 짧은 경로로 처리되었으므로 <strong>무시</strong>합니다.<br>\
                        이 조건이 없으면 불필요한 연산이 많아져 느려집니다!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">3</span> 벨만-포드 알고리즘 (Bellman-Ford)\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> "모든 길을 반복해서 확인하기"를 생각해 보세요!<br><br>\
                    네비게이션이 고장나서, 한 번에 가장 가까운 곳을 못 찾습니다.<br>\
                    대신 <strong>모든 도로를 한 바퀴씩 돌면서</strong> "더 짧은 길이 있나?" 확인합니다.<br>\
                    이걸 <strong>V-1번</strong> 반복하면 모든 최단 경로를 찾을 수 있습니다!<br><br>\
                    장점: <strong>음수 가중치</strong>가 있어도 동작합니다.<br>\
                    V번째 반복에서도 거리가 줄어들면? <strong>음수 사이클</strong>이 존재하는 것입니다!\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="var(--green)">-</text></svg>\
                        </div>\
                        <h3>음수 가중치 OK</h3>\
                        <p>다익스트라와 달리 간선 가중치가 음수여도 정확히 동작합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="15" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--accent)">V-1</text><text x="19" y="30" text-anchor="middle" font-size="9" fill="var(--text2)">번 반복</text></svg>\
                        </div>\
                        <h3>V-1번 완화</h3>\
                        <p>모든 간선을 V-1번 반복하며 거리를 갱신(완화)합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="12" cy="12" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="26" cy="12" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="19" cy="28" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><path d="M16 14 L24 14 M24 16 L21 24 M17 24 L14 16" stroke="var(--red, #e17055)" stroke-width="1.5"/><text x="19" y="37" text-anchor="middle" font-size="7" fill="var(--red, #e17055)">음수사이클</text></svg>\
                        </div>\
                        <h3>음수 사이클 탐지</h3>\
                        <p>V번째에도 갱신이 되면 음수 사이클이 존재합니다! O(VE)</p>\
                    </div>\
                </div>\
\
                <div class="code-block">\
                    <pre><code class="language-python"># 벨만-포드 알고리즘\
\nimport sys\
\ninput = sys.stdin.readline\
\nINF = float(\'inf\')\
\n\
\nN, M = map(int, input().split())\
\nedges = []\
\nfor _ in range(M):\
\n    u, v, w = map(int, input().split())\
\n    edges.append((u, v, w))\
\n\
\ndist = [INF] * (N + 1)\
\ndist[1] = 0\
\n\
\nfor i in range(N - 1):\
\n    for u, v, w in edges:\
\n        if dist[u] != INF and dist[u] + w < dist[v]:\
\n            dist[v] = dist[u] + w\
\n\
\nhas_negative_cycle = False\
\nfor u, v, w in edges:\
\n    if dist[u] != INF and dist[u] + w < dist[v]:\
\n        has_negative_cycle = True\
\n        break</code></pre>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">왜 V-1번 반복하면 모든 최단 경로를 찾을 수 있을까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        최단 경로는 최대 <strong>V-1개의 간선</strong>을 지나갑니다 (V개 정점을 거치므로).<br>\
                        1번 반복하면 간선 1개짜리 최단 경로가 확정되고,<br>\
                        2번 반복하면 간선 2개짜리 최단 경로가 확정되고...<br>\
                        V-1번 반복하면 모든 최단 경로가 확정됩니다!<br>\
                        만약 V번째에도 갱신이 되면, 간선을 무한히 지나갈수록 비용이 줄어드는 <strong>음수 사이클</strong>이 있다는 뜻입니다.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">4</span> 플로이드-워셜 알고리즘 (Floyd-Warshall)\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> "경유지를 하나씩 추가하기"를 생각해 보세요!<br><br>\
                    서울에서 부산까지 바로 가면 5시간이 걸립니다.<br>\
                    그런데 <strong>대전을 경유</strong>하면? 서울→대전 2시간 + 대전→부산 2시간 = 4시간!<br>\
                    이렇게 모든 정점을 경유지 후보로 넣어보면서, 더 짧은 경로가 있으면 갱신합니다.<br><br>\
                    <strong>모든 쌍</strong>의 최단 경로를 한 번에 구할 수 있습니다!\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="4" y1="15" x2="34" y2="15" stroke="var(--accent)" stroke-width="1"/><line x1="4" y1="26" x2="34" y2="26" stroke="var(--accent)" stroke-width="1"/><line x1="15" y1="4" x2="15" y2="34" stroke="var(--accent)" stroke-width="1"/><line x1="26" y1="4" x2="26" y2="34" stroke="var(--accent)" stroke-width="1"/></svg>\
                        </div>\
                        <h3>2차원 배열 dp[i][j]</h3>\
                        <p>dp[i][j] = i에서 j까지의 최단 거리. 모든 쌍을 저장합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="16" text-anchor="middle" font-size="8" fill="var(--accent)">for k</text><text x="19" y="25" text-anchor="middle" font-size="8" fill="var(--accent)">for i</text><text x="19" y="34" text-anchor="middle" font-size="8" fill="var(--accent)">for j</text></svg>\
                        </div>\
                        <h3>3중 for문</h3>\
                        <p>경유지 k를 바깥 루프에 놓습니다. 순서가 매우 중요합니다!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--accent)">O(V³)</text></svg>\
                        </div>\
                        <h3>시간 복잡도 O(V³)</h3>\
                        <p>정점이 많으면 느리지만, 코드가 매우 간단합니다. V ≤ 500 정도면 사용 가능합니다.</p>\
                    </div>\
                </div>\
\
                <div class="code-block">\
                    <pre><code class="language-python"># 플로이드-워셜 알고리즘\
\nINF = float(\'inf\')\
\n\
\n# dp[i][j] = i에서 j까지의 최단 거리\
\nfor k in range(1, N + 1):       # 경유지\
\n    for i in range(1, N + 1):   # 출발지\
\n        for j in range(1, N + 1):  # 도착지\
\n            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])</code></pre>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">플로이드-워셜에서 왜 경유지 k가 가장 바깥 루프여야 할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>k가 바깥 루프</strong>에 있어야 "1번 정점만 경유 → 1,2번 정점만 경유 → ... → 모든 정점 경유"로<br>\
                        점차 경유 가능한 정점을 늘려가며 <strong>DP를 올바르게 갱신</strong>할 수 있습니다!<br><br>\
                        만약 k를 안쪽에 넣으면, 아직 갱신되지 않은 dp[i][k]를 사용하게 되어 잘못된 결과가 나옵니다.<br>\
                        <strong>반드시 k → i → j 순서</strong>를 지켜야 합니다!\
                    </div>\
                </div>\
            </div>\
        ';

        this._initConceptInteractions(container);
    },

    _initConceptInteractions: function(container) {
        container.querySelectorAll('.think-box').forEach(function(box) {
            var trigger = box.querySelector('.think-box-trigger');
            var answer = box.querySelector('.think-box-answer');
            if (trigger && answer) {
                trigger.addEventListener('click', function() {
                    answer.classList.toggle('show');
                    trigger.textContent = answer.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
                });
            }
        });
        container.querySelectorAll('pre code').forEach(function(el) {
            if (window.hljs) hljs.highlightElement(el);
        });
    },

    // ===== 시각화 탭 (concept suffix) =====
    renderVisualize: function(container) {
        var self = this;
        var suffix = 'concept-sp';
        var NODES = ['A', 'B', 'C', 'D', 'E'];
        var INF = Infinity;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">다익스트라 알고리즘 시각화</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">5개 노드의 방향 그래프에서 A를 출발점으로 최단 경로를 찾습니다.</p>' +
            '<div id="sp-dist-' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">' +
            NODES.map(function(n, i) {
                return '<div class="str-char-box" data-node="' + i + '" style="min-width:52px;text-align:center;">' +
                    '<div style="font-weight:700;font-size:0.85rem;">' + n + '</div>' +
                    '<div class="sp-dist-val" style="font-size:1.1rem;font-weight:600;color:var(--accent);">&infin;</div></div>';
            }).join('') +
            '</div>' +
            '<div id="sp-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;">' +
            '<span style="color:var(--text2);">A에서 출발하여 다익스트라를 실행합니다.</span></div>' +
            self._createStepControls(suffix);

        var distEl = container.querySelector('#sp-dist-' + suffix);
        var infoEl = container.querySelector('#sp-info-' + suffix);

        var adj = [
            [[1,4],[2,2]],
            [[3,3],[4,1]],
            [[1,1],[3,5]],
            [[4,2]],
            []
        ];

        // Pre-simulate dijkstra
        var simDist = [0, INF, INF, INF, INF];
        var simVisited = [];
        var simHeap = [[0, 0]];
        var steps = [];

        function renderDist(dist, highlight) {
            distEl.innerHTML = NODES.map(function(n, i) {
                var val = dist[i] === INF ? '\u221E' : dist[i];
                var cls = highlight === i ? ' updated' : '';
                return '<div class="str-char-box" data-node="' + i + '" style="min-width:52px;text-align:center;">' +
                    '<div style="font-weight:700;font-size:0.85rem;">' + n + '</div>' +
                    '<div class="sp-dist-val' + cls + '" style="font-size:1.1rem;font-weight:600;color:var(--accent);">' + val + '</div></div>';
            }).join('');
        }

        var savedStates = [];
        function saveSnapshot() {
            return { dist: simDist.slice(), visited: simVisited.slice(), heap: simHeap.map(function(h) { return h.slice(); }), info: infoEl.innerHTML, distHTML: distEl.innerHTML };
        }
        function restoreSnapshot(s) {
            simDist = s.dist.slice(); simVisited = s.visited.slice(); simHeap = s.heap.map(function(h) { return h.slice(); });
            infoEl.innerHTML = s.info; distEl.innerHTML = s.distHTML;
        }

        // Step 0: init
        var snap0 = saveSnapshot();
        steps.push({
            description: '초기화: dist[A]=0, 나머지=\u221E. 힙에 (0, A)를 넣습니다.',
            action: function() { renderDist(simDist, 0); infoEl.innerHTML = 'dist = [0, \u221E, \u221E, \u221E, \u221E], heap = [(0, A)]'; },
            undo: function() { restoreSnapshot(snap0); }
        });

        // Process each node
        var processOrder = [];
        var tmpDist = [0, INF, INF, INF, INF];
        var tmpVis = [false, false, false, false, false];
        var tmpHeap = [[0, 0]];
        while (tmpHeap.length > 0) {
            tmpHeap.sort(function(a, b) { return a[0] - b[0]; });
            var top = tmpHeap.shift();
            var d = top[0], v = top[1];
            if (tmpVis[v]) continue;
            tmpVis[v] = true;
            var updates = [];
            for (var ei = 0; ei < adj[v].length; ei++) {
                var u = adj[v][ei][0], w = adj[v][ei][1];
                var nd = d + w;
                if (nd < tmpDist[u]) {
                    updates.push({ node: u, oldDist: tmpDist[u], newDist: nd });
                    tmpDist[u] = nd;
                    tmpHeap.push([nd, u]);
                }
            }
            processOrder.push({ node: v, dist: d, updates: updates });
        }

        processOrder.forEach(function(step) {
            var v = step.node, d = step.dist;
            // Pop + process
            (function(v, d, updates) {
                var snapBefore;
                steps.push({
                    description: '힙에서 (' + d + ', ' + NODES[v] + ')을 꺼내 처리합니다. ' +
                        (updates.length > 0 ?
                            updates.map(function(u) {
                                return NODES[v] + '\u2192' + NODES[u.node] + ': dist=' + (u.oldDist === INF ? '\u221E' : u.oldDist) + ' \u2192 ' + u.newDist;
                            }).join(', ') :
                            '갱신할 이웃이 없습니다.'),
                    action: function() {
                        snapBefore = saveSnapshot();
                        simVisited.push(v);
                        for (var i = 0; i < updates.length; i++) {
                            simDist[updates[i].node] = updates[i].newDist;
                        }
                        renderDist(simDist, updates.length > 0 ? updates[updates.length - 1].node : -1);
                        var visitedStr = simVisited.map(function(vi) { return NODES[vi]; }).join(', ');
                        infoEl.innerHTML = '<strong>' + NODES[v] + ' 방문 완료 (dist=' + d + ')</strong>. 방문: {' + visitedStr + '}';
                    },
                    undo: function() { restoreSnapshot(snapBefore); }
                });
            })(v, d, step.updates);
        });

        // Final
        var snapFinal;
        steps.push({
            description: '다익스트라 완료! A=0, B=3, C=2, D=6, E=4',
            action: function() {
                snapFinal = saveSnapshot();
                infoEl.innerHTML = '<strong style="color:var(--green);">완료! dist = [0, 3, 2, 6, 4]</strong>';
            },
            undo: function() { restoreSnapshot(snapFinal); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ===== 시각화 상태 관리 =====
    _vizState: {
        steps: [],
        currentStep: -1,
        keydownHandler: null
    },

    _clearVizState: function() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls: function(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>\u25C0 이전</button>' +
            '<span id="str-indicator-' + suffix + '">시작 전</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 \u25B6</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">\u25B6 다음 버튼을 눌러 시작하세요</div>';
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
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '\u25B6 다음 버튼을 눌러 시작하세요'; }
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
    // 시뮬레이션 1: 다익스트라 기본 (boj-1753)
    // ====================================================================
    _renderVizDijkstra: function(container) {
        var self = this;
        var suffix = '-dijk';
        var NODES = ['1', '2', '3', '4', '5'];
        var INF = Infinity;
        // Graph: 1->2(2), 1->3(3), 2->3(4), 2->4(5), 3->4(6), start=1
        var adj = [
            [[1,2],[2,3]],
            [[2,4],[3,5]],
            [[3,6]],
            [],
            []
        ];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">다익스트라: BOJ 1753 예제</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">정점 1에서 출발하여 모든 정점까지의 최단 거리를 구합니다.</p>' +
            '<div id="sp-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="sp-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#sp-arr' + suffix);
        var infoEl = container.querySelector('#sp-info' + suffix);

        function renderDist(dist, hlIdx) {
            arrEl.innerHTML = NODES.map(function(n, i) {
                var val = dist[i] === INF ? '\u221E' : dist[i];
                var bg = hlIdx === i ? 'background:var(--green);color:white;' : 'background:var(--bg2);';
                return '<div style="min-width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;' + bg + '"><div>' + n + '</div><div style="font-size:0.85rem;">' + val + '</div></div>';
            }).join('');
        }

        var dist = [0, INF, INF, INF, INF];
        renderDist(dist, -1);
        infoEl.innerHTML = '<span style="color:var(--text2);">정점 1에서 다익스트라를 시작합니다.</span>';

        // Pre-simulate
        var steps = [];
        var simDist = [0, INF, INF, INF, INF];
        var simVis = [false, false, false, false, false];
        var simHeap = [[0, 0]];
        var snapshots = [];

        function snap() { return { d: simDist.slice(), info: infoEl.innerHTML, html: arrEl.innerHTML }; }
        function restore(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; arrEl.innerHTML = s.html; }

        var s0 = snap();
        steps.push({
            description: '초기화: dist[1]=0, 나머지=\u221E. 힙에 (0, 1)을 넣습니다.',
            action: function() { renderDist(simDist, 0); infoEl.innerHTML = 'dist=[0, \u221E, \u221E, \u221E, \u221E], heap=[(0,1)]'; },
            undo: function() { restore(s0); }
        });

        var processOrder = [];
        var td = [0, INF, INF, INF, INF], tv = [false,false,false,false,false], th = [[0,0]];
        while (th.length > 0) {
            th.sort(function(a,b) { return a[0]-b[0]; });
            var top = th.shift(), dd = top[0], vv = top[1];
            if (tv[vv]) continue;
            tv[vv] = true;
            var upd = [];
            for (var i = 0; i < adj[vv].length; i++) {
                var uu = adj[vv][i][0], ww = adj[vv][i][1], nnd = dd + ww;
                if (nnd < td[uu]) { upd.push({node:uu, old:td[uu], nw:nnd}); td[uu] = nnd; th.push([nnd,uu]); }
            }
            processOrder.push({node:vv, dist:dd, updates:upd});
        }

        processOrder.forEach(function(st) {
            (function(v, d, updates) {
                var sb;
                steps.push({
                    description: '(' + d + ', ' + NODES[v] + ') 처리: ' +
                        (updates.length > 0 ? updates.map(function(u) { return NODES[v]+'\u2192'+NODES[u.node]+' dist='+(u.old===INF?'\u221E':u.old)+'\u2192'+u.nw; }).join(', ') : '갱신 없음'),
                    action: function() {
                        sb = snap();
                        updates.forEach(function(u) { simDist[u.node] = u.nw; });
                        renderDist(simDist, v);
                        infoEl.innerHTML = '<strong>' + NODES[v] + ' 방문 (dist=' + d + ')</strong>';
                    },
                    undo: function() { restore(sb); }
                });
            })(st.node, st.dist, st.updates);
        });

        var sf;
        steps.push({
            description: '완료! dist = [0, 2, 3, 7, INF]',
            action: function() { sf = snap(); infoEl.innerHTML = '<strong style="color:var(--green);">완료! dist=[0, 2, 3, 7, INF]</strong>'; },
            undo: function() { restore(sf); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: 플로이드-워셜 (boj-11404)
    // ====================================================================
    _renderVizFloyd: function(container) {
        var self = this;
        var suffix = '-floyd';
        var N = 3;
        var INF = Infinity;
        // Small 3-node example: 1->2:4, 1->3:11, 2->1:6, 2->3:2, 3->1:3
        var dp = [[0,4,11],[6,0,2],[3,INF,0]];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">플로이드-워셜: 3개 노드 예제</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">경유지 k=1,2,3을 차례로 고려하며 모든 쌍의 최단 거리를 갱신합니다.</p>' +
            '<div id="sp-grid' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="sp-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var gridEl = container.querySelector('#sp-grid' + suffix);
        var infoEl = container.querySelector('#sp-info' + suffix);

        function renderGrid(dp, hlI, hlJ) {
            var html = '<table style="border-collapse:collapse;margin:0 auto;"><tr><th style="padding:6px 12px;"></th>';
            for (var j = 0; j < N; j++) html += '<th style="padding:6px 12px;font-weight:600;">' + (j+1) + '</th>';
            html += '</tr>';
            for (var i = 0; i < N; i++) {
                html += '<tr><th style="padding:6px 12px;font-weight:600;">' + (i+1) + '</th>';
                for (var j2 = 0; j2 < N; j2++) {
                    var bg = (i === hlI && j2 === hlJ) ? 'background:var(--green);color:white;' : '';
                    var val = dp[i][j2] === INF ? '\u221E' : dp[i][j2];
                    html += '<td style="padding:6px 12px;text-align:center;border:1px solid var(--border);font-weight:600;' + bg + '">' + val + '</td>';
                }
                html += '</tr>';
            }
            html += '</table>';
            gridEl.innerHTML = html;
        }

        renderGrid(dp, -1, -1);
        infoEl.innerHTML = '<span style="color:var(--text2);">초기 거리 행렬입니다.</span>';

        var steps = [];
        var curDp = dp.map(function(r) { return r.slice(); });

        function snapF() { return { dp: curDp.map(function(r) { return r.slice(); }), info: infoEl.innerHTML, grid: gridEl.innerHTML }; }
        function restoreF(s) { curDp = s.dp.map(function(r) { return r.slice(); }); infoEl.innerHTML = s.info; gridEl.innerHTML = s.grid; }

        var s0 = snapF();
        steps.push({
            description: '초기 상태: 직접 간선으로 구한 거리 행렬입니다.',
            action: function() { renderGrid(curDp, -1, -1); infoEl.innerHTML = '초기 거리 행렬'; },
            undo: function() { restoreF(s0); }
        });

        // k=0,1,2 (0-indexed)
        for (var k = 0; k < N; k++) {
            (function(k) {
                var updated = [];
                for (var i = 0; i < N; i++) {
                    for (var j = 0; j < N; j++) {
                        if (i === j) continue;
                        var via = curDp[i][k] + curDp[k][j];
                        if (via < curDp[i][j]) {
                            updated.push({i:i, j:j, old:curDp[i][j], nw:via});
                            curDp[i][j] = via;
                        }
                    }
                }
                var sb;
                var desc = '경유지 k=' + (k+1) + ': ';
                if (updated.length > 0) {
                    desc += updated.map(function(u) {
                        return 'dp[' + (u.i+1) + '][' + (u.j+1) + '] ' + (u.old===INF?'\u221E':u.old) + '\u2192' + u.nw;
                    }).join(', ');
                } else {
                    desc += '갱신 없음';
                }
                var snapDp = curDp.map(function(r) { return r.slice(); });
                var lastUpd = updated.length > 0 ? updated[updated.length - 1] : null;
                steps.push({
                    description: desc,
                    action: function() {
                        sb = snapF();
                        curDp = snapDp.map(function(r) { return r.slice(); });
                        renderGrid(curDp, lastUpd ? lastUpd.i : -1, lastUpd ? lastUpd.j : -1);
                        infoEl.innerHTML = '<strong>경유지 k=' + (k+1) + ' 처리 완료</strong>';
                    },
                    undo: function() { restoreF(sb); }
                });
            })(k);
        }

        var sfF;
        steps.push({
            description: '플로이드-워셜 완료! 모든 쌍의 최단 거리가 확정되었습니다.',
            action: function() { sfF = snapF(); infoEl.innerHTML = '<strong style="color:var(--green);">완료!</strong>'; },
            undo: function() { restoreF(sfF); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 최소비용 구하기 (boj-1916)
    // ====================================================================
    _renderVizMinCost: function(container) {
        var self = this;
        var suffix = '-mincost';
        var NODES = ['1', '2', '3', '4', '5'];
        var INF = Infinity;
        // Graph from example: 1->2:2, 1->3:3, 1->4:1, 1->5:10, 2->4:2, 3->4:1, 3->5:1, 4->5:3. Start=1, End=5
        var adj = [
            [[1,2],[2,3],[3,1],[4,10]],
            [[3,2]],
            [[3,1],[4,1]],
            [[4,3]],
            []
        ];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">최소비용 구하기: BOJ 1916 예제</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">정점 1에서 5까지의 최소 비용을 다익스트라로 구합니다.</p>' +
            '<div id="sp-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="sp-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#sp-arr' + suffix);
        var infoEl = container.querySelector('#sp-info' + suffix);

        function renderDist(dist, hlIdx) {
            arrEl.innerHTML = NODES.map(function(n, i) {
                var val = dist[i] === INF ? '\u221E' : dist[i];
                var bg = hlIdx === i ? 'background:var(--green);color:white;' : 'background:var(--bg2);';
                return '<div style="min-width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;' + bg + '"><div>' + n + '</div><div style="font-size:0.85rem;">' + val + '</div></div>';
            }).join('');
        }

        var simDist = [0, INF, INF, INF, INF];
        renderDist(simDist, -1);
        infoEl.innerHTML = '<span style="color:var(--text2);">정점 1에서 다익스트라를 시작합니다. 목표: 정점 5</span>';

        var steps = [];
        function snap() { return { d: simDist.slice(), info: infoEl.innerHTML, html: arrEl.innerHTML }; }
        function restore(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; arrEl.innerHTML = s.html; }

        var s0 = snap();
        steps.push({
            description: '초기화: dist[1]=0, 나머지=\u221E.',
            action: function() { renderDist(simDist, 0); infoEl.innerHTML = 'dist=[0, \u221E, \u221E, \u221E, \u221E]'; },
            undo: function() { restore(s0); }
        });

        // Pre-simulate
        var processOrder = [];
        var td = [0, INF, INF, INF, INF], tv = [false,false,false,false,false], th = [[0,0]];
        while (th.length > 0) {
            th.sort(function(a,b) { return a[0]-b[0]; });
            var top = th.shift(), dd = top[0], vv = top[1];
            if (tv[vv]) continue;
            tv[vv] = true;
            var upd = [];
            for (var i = 0; i < adj[vv].length; i++) {
                var uu = adj[vv][i][0], ww = adj[vv][i][1], nnd = dd + ww;
                if (nnd < td[uu]) { upd.push({node:uu, old:td[uu], nw:nnd}); td[uu] = nnd; th.push([nnd,uu]); }
            }
            processOrder.push({node:vv, dist:dd, updates:upd});
        }

        processOrder.forEach(function(st) {
            (function(v, d, updates) {
                var sb;
                steps.push({
                    description: '(' + d + ', ' + NODES[v] + ') 처리: ' +
                        (updates.length > 0 ? updates.map(function(u) { return NODES[v]+'\u2192'+NODES[u.node]+' dist='+(u.old===INF?'\u221E':u.old)+'\u2192'+u.nw; }).join(', ') : '갱신 없음'),
                    action: function() {
                        sb = snap();
                        updates.forEach(function(u) { simDist[u.node] = u.nw; });
                        renderDist(simDist, v);
                        infoEl.innerHTML = '<strong>' + NODES[v] + ' 방문 (dist=' + d + ')</strong>';
                    },
                    undo: function() { restore(sb); }
                });
            })(st.node, st.dist, st.updates);
        });

        var sf;
        steps.push({
            description: '완료! dist[5] = 4 가 최소 비용입니다.',
            action: function() { sf = snap(); infoEl.innerHTML = '<strong style="color:var(--green);">완료! 1\u21925 최소비용 = ' + simDist[4] + '</strong>'; },
            undo: function() { restore(sf); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: Network Delay Time (lc-743)
    // ====================================================================
    _renderVizDelay: function(container) {
        var self = this;
        var suffix = '-delay';
        var NODES = ['1', '2', '3', '4'];
        var INF = Infinity;
        // times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2
        var adj = [
            [],
            [[0,1],[2,1]],
            [[3,1]],
            []
        ];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Network Delay Time: LC 743 예제</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">노드 2에서 신호를 보냅니다. 모든 노드가 받는 최소 시간 = max(dist).</p>' +
            '<div id="sp-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="sp-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#sp-arr' + suffix);
        var infoEl = container.querySelector('#sp-info' + suffix);

        function renderDist(dist, hlIdx) {
            arrEl.innerHTML = NODES.map(function(n, i) {
                var val = dist[i] === INF ? '\u221E' : dist[i];
                var bg = hlIdx === i ? 'background:var(--green);color:white;' : 'background:var(--bg2);';
                return '<div style="min-width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;' + bg + '"><div>' + n + '</div><div style="font-size:0.85rem;">' + val + '</div></div>';
            }).join('');
        }

        var simDist = [INF, 0, INF, INF]; // start=2 (index 1)
        renderDist(simDist, -1);
        infoEl.innerHTML = '<span style="color:var(--text2);">노드 2에서 다익스트라를 시작합니다.</span>';

        var steps = [];
        function snap() { return { d: simDist.slice(), info: infoEl.innerHTML, html: arrEl.innerHTML }; }
        function restore(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; arrEl.innerHTML = s.html; }

        var s0 = snap();
        steps.push({
            description: '초기화: dist[2]=0, 나머지=\u221E.',
            action: function() { renderDist(simDist, 1); infoEl.innerHTML = 'dist=[\u221E, 0, \u221E, \u221E]'; },
            undo: function() { restore(s0); }
        });

        // Pre-simulate from node 1 (index 1)
        var processOrder = [];
        var td = [INF, 0, INF, INF], tv = [false,false,false,false], th = [[0,1]];
        while (th.length > 0) {
            th.sort(function(a,b) { return a[0]-b[0]; });
            var top = th.shift(), dd = top[0], vv = top[1];
            if (tv[vv]) continue;
            tv[vv] = true;
            var upd = [];
            for (var i = 0; i < adj[vv].length; i++) {
                var uu = adj[vv][i][0], ww = adj[vv][i][1], nnd = dd + ww;
                if (nnd < td[uu]) { upd.push({node:uu, old:td[uu], nw:nnd}); td[uu] = nnd; th.push([nnd,uu]); }
            }
            processOrder.push({node:vv, dist:dd, updates:upd});
        }

        processOrder.forEach(function(st) {
            (function(v, d, updates) {
                var sb;
                steps.push({
                    description: '(' + d + ', ' + NODES[v] + ') 처리: ' +
                        (updates.length > 0 ? updates.map(function(u) { return NODES[v]+'\u2192'+NODES[u.node]+' dist='+(u.old===INF?'\u221E':u.old)+'\u2192'+u.nw; }).join(', ') : '갱신 없음'),
                    action: function() {
                        sb = snap();
                        updates.forEach(function(u) { simDist[u.node] = u.nw; });
                        renderDist(simDist, v);
                        infoEl.innerHTML = '<strong>' + NODES[v] + ' 방문 (dist=' + d + ')</strong>';
                    },
                    undo: function() { restore(sb); }
                });
            })(st.node, st.dist, st.updates);
        });

        var sf;
        steps.push({
            description: '완료! max(dist) = 2. 모든 노드가 신호를 받는 시간 = 2.',
            action: function() { sf = snap(); infoEl.innerHTML = '<strong style="color:var(--green);">완료! max(dist)=2 \u2192 답: 2</strong>'; },
            undo: function() { restore(sf); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ===== 빈 스텁 =====
    renderProblem: function(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '기본 최단 경로', desc: '다익스트라와 플로이드-워셜의 기본 구현을 연습합니다 (Gold IV~V)', problemIds: ['boj-1753', 'boj-11404'] },
        { num: 2, title: '최단 경로 응용', desc: '다익스트라를 다양한 상황에 응용합니다 (Gold V ~ Medium)', problemIds: ['boj-1916', 'lc-743'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ===== 1단계: 기본 최단 경로 =====
        {
            id: 'boj-1753',
            title: 'BOJ 1753 - 최단경로',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1753',
            simIntro: '다익스트라가 정점을 하나씩 처리하며 최단 거리를 확정하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>방향 그래프가 주어지면, 주어진 시작점에서 다른 모든 정점으로의 최단 경로를 구하는 프로그램을 작성하세요.</p><p>단, 모든 간선의 가중치는 10 이하의 자연수입니다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄: V E (정점 수, 간선 수, V&le;20,000, E&le;300,000)<br>둘째 줄: 시작 정점 번호 K<br>이후 E줄: u v w (u\u2192v 가중치 w)</p></div><div><h4>출력</h4><p>i번째 줄에 시작점에서 i번 정점으로의 최단 경로값 출력 (경로 없으면 INF)</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5 6\n1\n5 1 1\n1 2 2\n1 3 3\n2 3 4\n2 4 5\n3 4 6</pre></div><div><strong>출력</strong><pre>0\n2\n3\n7\nINF</pre></div></div></div>',
            hints: [
                { title: '어떤 알고리즘을 쓸까?', content: '한 시작점에서 다른 모든 정점까지의 최단 경로 \u2192 <strong>다익스트라 알고리즘</strong>입니다! 가중치가 모두 양수이므로 다익스트라를 사용할 수 있습니다.' },
                { title: '핵심 아이디어', content: '인접 리스트와 <strong>최소 힙(heapq)</strong>을 사용합니다.<br>힙에서 (거리, 정점)을 꺼내고, 이미 확정된 거리보다 크면 무시합니다.<br>이웃 정점의 거리를 갱신하면 힙에 추가합니다.' },
                { title: '정답 코드 구조', content: '<code>dist = [INF] * (V+1), dist[K] = 0</code>으로 초기화.<br><code>heapq.heappush(heap, (0, K))</code>로 시작.<br>힙에서 꺼낸 (d, v)에서 <code>d > dist[v]</code>이면 continue.<br>이웃 (u, w)에 대해 <code>d + w < dist[u]</code>이면 갱신.' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nV, E = map(int, input().split())\nK = int(input())\ngraph = [[] for _ in range(V + 1)]\nfor _ in range(E):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))\n\ndist = [INF] * (V + 1)\ndist[K] = 0\nheap = [(0, K)]\n\nwhile heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))\n\nfor i in range(1, V + 1):\n    print(dist[i] if dist[i] != INF else "INF")',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int V, E, K;\n    scanf("%d %d %d", &V, &E, &K);\n    vector<vector<pii>> graph(V + 1);\n    for (int i = 0; i < E; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }\n\n    vector<int> dist(V + 1, INF);\n    dist[K] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, K});\n\n    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }\n\n    for (int i = 1; i <= V; i++) {\n        if (dist[i] == INF) puts("INF");\n        else printf("%d\\n", dist[i]);\n    }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int V = Integer.parseInt(st.nextToken());\n        int E = Integer.parseInt(st.nextToken());\n        int K = Integer.parseInt(br.readLine().trim());\n\n        List<List<int[]>> graph = new ArrayList<>();\n        for (int i = 0; i <= V; i++) graph.add(new ArrayList<>());\n        for (int i = 0; i < E; i++) {\n            st = new StringTokenizer(br.readLine());\n            int u = Integer.parseInt(st.nextToken());\n            int v = Integer.parseInt(st.nextToken());\n            int w = Integer.parseInt(st.nextToken());\n            graph.get(u).add(new int[]{v, w});\n        }\n\n        int[] dist = new int[V + 1];\n        int INF = (int)1e9;\n        Arrays.fill(dist, INF);\n        dist[K] = 0;\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n        pq.offer(new int[]{0, K});\n\n        while (!pq.isEmpty()) {\n            int[] cur = pq.poll();\n            int d = cur[0], v = cur[1];\n            if (d > dist[v]) continue;\n            for (int[] edge : graph.get(v)) {\n                int u = edge[0], w = edge[1];\n                int nd = d + w;\n                if (nd < dist[u]) {\n                    dist[u] = nd;\n                    pq.offer(new int[]{nd, u});\n                }\n            }\n        }\n\n        StringBuilder sb = new StringBuilder();\n        for (int i = 1; i <= V; i++) {\n            sb.append(dist[i] == INF ? "INF" : dist[i]).append("\\n");\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '다익스트라 (최소 힙)',
                description: '시작점에서 heapq를 이용하여 모든 정점까지의 최단 거리를 구합니다.',
                timeComplexity: 'O((V+E) log V)',
                spaceComplexity: 'O(V+E)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구성', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nV, E = map(int, input().split())\nK = int(input())\ngraph = [[] for _ in range(V + 1)]\nfor _ in range(E):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))' },
                        { title: '다익스트라 초기화', code: 'dist = [INF] * (V + 1)\ndist[K] = 0\nheap = [(0, K)]' },
                        { title: '다익스트라 실행', code: 'while heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-11404',
            title: 'BOJ 11404 - 플로이드',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11404',
            simIntro: '경유지 k를 하나씩 추가하며 거리 행렬이 갱신되는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>n개의 도시가 있습니다. 한 도시에서 출발하여 다른 도시에 도착하는 m개의 버스가 있습니다. 각 버스는 한 번 사용할 때 필요한 비용이 있습니다.</p><p>모든 도시의 쌍 (A, B)에 대해서 도시 A에서 도시 B로 가는데 필요한 비용의 최솟값을 구하세요.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄: n (도시 수, n&le;100)<br>둘째 줄: m (버스 수, m&le;100,000)<br>이후 m줄: a b c (a\u2192b 비용 c)</p></div><div><h4>출력</h4><p>n줄에 걸쳐 n\u00D7n 행렬로 출력 (갈 수 없으면 0)</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5\n14\n1 2 2\n1 3 3\n1 4 1\n1 5 10\n2 4 2\n3 4 1\n3 5 1\n4 5 3\n3 5 10\n3 1 8\n1 4 2\n5 1 7\n3 4 2\n5 2 4</pre></div><div><strong>출력</strong><pre>0 2 3 1 4\n12 0 15 2 5\n8 5 0 1 1\n10 7 13 0 3\n7 4 10 6 0</pre></div></div></div>',
            hints: [
                { title: '어떤 알고리즘을 쓸까?', content: '<strong>모든 쌍</strong>의 최단 경로를 구해야 합니다 \u2192 <strong>플로이드-워셜 알고리즘</strong>! n이 100 이하이므로 O(n\u00B3)으로 충분합니다.' },
                { title: '핵심 아이디어', content: '2차원 배열 dp[i][j]를 INF로 초기화하고, 입력 간선으로 갱신합니다.<br><strong>같은 출발-도착에 여러 간선이 있으면 최솟값</strong>을 저장합니다!<br>3중 for문: k(경유지) \u2192 i(출발) \u2192 j(도착) 순서로 <code>dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])</code>' },
                { title: '정답 코드 구조', content: '<code>dp[i][j] = min(dp[i][j], c)</code>로 초기화 (같은 간선 중 최소).<br>3중 for문 돌린 후, INF는 0으로 바꿔서 출력합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nn = int(input())\nm = int(input())\ndp = [[INF] * (n + 1) for _ in range(n + 1)]\nfor i in range(1, n + 1):\n    dp[i][i] = 0\n\nfor _ in range(m):\n    a, b, c = map(int, input().split())\n    dp[a][b] = min(dp[a][b], c)\n\nfor k in range(1, n + 1):\n    for i in range(1, n + 1):\n        for j in range(1, n + 1):\n            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])\n\nfor i in range(1, n + 1):\n    print(\' \'.join(str(x) if x != INF else \'0\' for x in dp[i][1:n+1]))',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\nconst int INF = 1e9;\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    vector<vector<int>> dp(n + 1, vector<int>(n + 1, INF));\n    for (int i = 1; i <= n; i++) dp[i][i] = 0;\n\n    for (int i = 0; i < m; i++) {\n        int a, b, c;\n        scanf("%d %d %d", &a, &b, &c);\n        dp[a][b] = min(dp[a][b], c);\n    }\n\n    for (int k = 1; k <= n; k++)\n        for (int i = 1; i <= n; i++)\n            for (int j = 1; j <= n; j++)\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]);\n\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= n; j++) {\n            printf("%d ", dp[i][j] == INF ? 0 : dp[i][j]);\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        int m = Integer.parseInt(br.readLine().trim());\n        int INF = (int)1e9;\n        int[][] dp = new int[n + 1][n + 1];\n        for (int[] row : dp) Arrays.fill(row, INF);\n        for (int i = 1; i <= n; i++) dp[i][i] = 0;\n\n        for (int i = 0; i < m; i++) {\n            StringTokenizer st = new StringTokenizer(br.readLine());\n            int a = Integer.parseInt(st.nextToken());\n            int b = Integer.parseInt(st.nextToken());\n            int c = Integer.parseInt(st.nextToken());\n            dp[a][b] = Math.min(dp[a][b], c);\n        }\n\n        for (int k = 1; k <= n; k++)\n            for (int i = 1; i <= n; i++)\n                for (int j = 1; j <= n; j++)\n                    dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j]);\n\n        StringBuilder sb = new StringBuilder();\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= n; j++) {\n                sb.append(dp[i][j] == INF ? 0 : dp[i][j]);\n                if (j < n) sb.append(\' \');\n            }\n            sb.append(\'\\n\');\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '플로이드-워셜',
                description: '3중 for문으로 모든 쌍의 최단 거리를 O(N\u00B3)에 구합니다.',
                timeComplexity: 'O(N\u00B3)',
                spaceComplexity: 'O(N\u00B2)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기화', code: 'import sys\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nn = int(input())\nm = int(input())\ndp = [[INF] * (n + 1) for _ in range(n + 1)]\nfor i in range(1, n + 1):\n    dp[i][i] = 0' },
                        { title: '간선 입력', code: 'for _ in range(m):\n    a, b, c = map(int, input().split())\n    dp[a][b] = min(dp[a][b], c)' },
                        { title: '플로이드-워셜 실행', code: 'for k in range(1, n + 1):\n    for i in range(1, n + 1):\n        for j in range(1, n + 1):\n            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[1].templates; }
            }]
        },

        // ===== 2단계: 최단 경로 응용 =====
        {
            id: 'boj-1916',
            title: 'BOJ 1916 - 최소비용 구하기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1916',
            simIntro: '다익스트라로 출발점에서 도착점까지의 최소 비용을 구하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N개의 도시가 있습니다. 한 도시에서 출발하여 다른 도시에 도착하는 M개의 버스가 있습니다. A번째 도시에서 B번째 도시까지 가는데 드는 버스 비용을 최소화하려고 합니다.</p><p>A번째 도시에서 B번째 도시까지 가는데 드는 최소비용을 출력하세요.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄: N (도시 수, N&le;1,000)<br>둘째 줄: M (버스 수, M&le;100,000)<br>이후 M줄: 출발 도착 비용<br>마지막 줄: 출발 도시 도착 도시</p></div><div><h4>출력</h4><p>출발 도시에서 도착 도시까지의 최소 비용</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5\n8\n1 2 2\n1 3 3\n1 4 1\n1 5 10\n2 4 2\n3 4 1\n3 5 1\n4 5 3\n1 5</pre></div><div><strong>출력</strong><pre>4</pre></div></div></div>',
            hints: [
                { title: '어떤 알고리즘을 쓸까?', content: '한 도시에서 다른 한 도시까지의 최소 비용 \u2192 <strong>다익스트라 알고리즘</strong>입니다! 출발점에서 다익스트라를 돌리고 도착점의 거리를 출력하면 됩니다.' },
                { title: '핵심 아이디어', content: 'BOJ 1753번과 거의 같은 구조입니다!<br>다만 마지막에 <strong>모든 정점의 거리</strong>가 아닌 <strong>특정 도착 도시</strong>의 거리만 출력합니다.<br>같은 출발-도착에 여러 버스가 있을 수 있으므로, 인접 리스트에 모두 추가합니다.' },
                { title: '정답 코드 구조', content: '1753번과 동일한 다익스트라 코드를 사용합니다.<br>마지막 줄에서 출발 도시와 도착 도시를 입력받고,<br><code>print(dist[\uB3C4\uCC29\uB3C4\uC2DC])</code>로 결과를 출력합니다.' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nN = int(input())\nM = int(input())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))\n\nS, E = map(int, input().split())\n\ndist = [INF] * (N + 1)\ndist[S] = 0\nheap = [(0, S)]\n\nwhile heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))\n\nprint(dist[E])',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<pii>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }\n    int S, E;\n    scanf("%d %d", &S, &E);\n\n    vector<int> dist(N + 1, INF);\n    dist[S] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, S});\n\n    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }\n\n    printf("%d\\n", dist[E]);\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        int M = Integer.parseInt(br.readLine().trim());\n\n        List<List<int[]>> graph = new ArrayList<>();\n        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());\n        for (int i = 0; i < M; i++) {\n            StringTokenizer st = new StringTokenizer(br.readLine());\n            int u = Integer.parseInt(st.nextToken());\n            int v = Integer.parseInt(st.nextToken());\n            int w = Integer.parseInt(st.nextToken());\n            graph.get(u).add(new int[]{v, w});\n        }\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int S = Integer.parseInt(st.nextToken());\n        int E = Integer.parseInt(st.nextToken());\n\n        int INF = (int)1e9;\n        int[] dist = new int[N + 1];\n        Arrays.fill(dist, INF);\n        dist[S] = 0;\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n        pq.offer(new int[]{0, S});\n\n        while (!pq.isEmpty()) {\n            int[] cur = pq.poll();\n            int d = cur[0], v = cur[1];\n            if (d > dist[v]) continue;\n            for (int[] edge : graph.get(v)) {\n                int u = edge[0], w = edge[1];\n                int nd = d + w;\n                if (nd < dist[u]) {\n                    dist[u] = nd;\n                    pq.offer(new int[]{nd, u});\n                }\n            }\n        }\n\n        System.out.println(dist[E]);\n    }\n}'
            },
            solutions: [{
                approach: '다익스트라 (특정 도착점)',
                description: '다익스트라를 돌린 뒤 도착 도시의 dist 값만 출력합니다.',
                timeComplexity: 'O((N+M) log N)',
                spaceComplexity: 'O(N+M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구성', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nN = int(input())\nM = int(input())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))' },
                        { title: '출발/도착 입력 및 초기화', code: 'S, E = map(int, input().split())\n\ndist = [INF] * (N + 1)\ndist[S] = 0\nheap = [(0, S)]' },
                        { title: '다익스트라 + 출력', code: 'while heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))\n\nprint(dist[E])' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[2].templates; }
            }]
        },
        {
            id: 'lc-743',
            title: 'LeetCode 743 - Network Delay Time',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/network-delay-time/',
            simIntro: '다익스트라 결과에서 max(dist)를 구해 답을 도출하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>n개의 노드로 구성된 네트워크가 있습니다. times[i] = (u, v, w)는 노드 u에서 v로 신호를 보내는 데 w 시간이 걸린다는 뜻입니다.</p><p>노드 k에서 신호를 보냈을 때, 모든 노드가 신호를 받는 데 걸리는 최소 시간을 구하세요. 모든 노드가 신호를 받을 수 없으면 -1을 반환합니다.</p><div class="problem-io"><div><h4>입력</h4><p>times: 간선 목록 [[u,v,w], ...]<br>n: 노드 수 (1 \u2264 n \u2264 100)<br>k: 시작 노드</p></div><div><h4>출력</h4><p>모든 노드가 신호를 받는 최소 시간 (불가능하면 -1)</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>times = [[2,1,1],[2,3,1],[3,4,1]]\nn = 4, k = 2</pre></div><div><strong>출력</strong><pre>2</pre></div></div></div>',
            hints: [
                { title: '어떤 알고리즘을 쓸까?', content: '한 시작점(k)에서 모든 노드까지의 최단 거리를 구하고, 그 중 <strong>최댓값</strong>이 정답입니다 \u2192 <strong>다익스트라 알고리즘</strong>!' },
                { title: '핵심 아이디어', content: '다익스트라로 k에서 모든 노드까지의 최단 거리를 구합니다.<br>모든 거리 중 <strong>최댓값</strong>이 "모든 노드가 신호를 받는 시간"입니다.<br>도달 불가능한 노드가 있으면 -1을 반환합니다.' },
                { title: '정답 코드 구조', content: '인접 리스트를 만들고 다익스트라를 실행합니다.<br><code>max(dist[1:n+1])</code>이 INF이면 -1, 아니면 그 값을 반환합니다.' }
            ],
            templates: {
                python: 'class Solution:\n    def networkDelayTime(self, times, n, k):\n        import heapq\n        INF = float(\'inf\')\n        graph = [[] for _ in range(n + 1)]\n        for u, v, w in times:\n            graph[u].append((v, w))\n\n        dist = [INF] * (n + 1)\n        dist[k] = 0\n        heap = [(0, k)]\n\n        while heap:\n            d, v = heapq.heappop(heap)\n            if d > dist[v]:\n                continue\n            for u, w in graph[v]:\n                nd = d + w\n                if nd < dist[u]:\n                    dist[u] = nd\n                    heapq.heappush(heap, (nd, u))\n\n        ans = max(dist[1:n+1])\n        return ans if ans != INF else -1',
                cpp: 'class Solution {\npublic:\n    int networkDelayTime(vector<vector<int>>& times, int n, int k) {\n        const int INF = 1e9;\n        vector<vector<pair<int,int>>> graph(n + 1);\n        for (auto& t : times) {\n            graph[t[0]].push_back({t[1], t[2]});\n        }\n\n        vector<int> dist(n + 1, INF);\n        dist[k] = 0;\n        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n        pq.push({0, k});\n\n        while (!pq.empty()) {\n            auto [d, v] = pq.top(); pq.pop();\n            if (d > dist[v]) continue;\n            for (auto [u, w] : graph[v]) {\n                int nd = d + w;\n                if (nd < dist[u]) {\n                    dist[u] = nd;\n                    pq.push({nd, u});\n                }\n            }\n        }\n\n        int ans = *max_element(dist.begin() + 1, dist.end());\n        return ans == INF ? -1 : ans;\n    }\n};',
                java: 'class Solution {\n    public int networkDelayTime(int[][] times, int n, int k) {\n        int INF = (int)1e9;\n        List<List<int[]>> graph = new ArrayList<>();\n        for (int i = 0; i <= n; i++) graph.add(new ArrayList<>());\n        for (int[] t : times) {\n            graph.get(t[0]).add(new int[]{t[1], t[2]});\n        }\n\n        int[] dist = new int[n + 1];\n        Arrays.fill(dist, INF);\n        dist[k] = 0;\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n        pq.offer(new int[]{0, k});\n\n        while (!pq.isEmpty()) {\n            int[] cur = pq.poll();\n            int d = cur[0], v = cur[1];\n            if (d > dist[v]) continue;\n            for (int[] edge : graph.get(v)) {\n                int u = edge[0], w = edge[1];\n                int nd = d + w;\n                if (nd < dist[u]) {\n                    dist[u] = nd;\n                    pq.offer(new int[]{nd, u});\n                }\n            }\n        }\n\n        int ans = 0;\n        for (int i = 1; i <= n; i++) {\n            ans = Math.max(ans, dist[i]);\n        }\n        return ans == INF ? -1 : ans;\n    }\n}'
            },
            solutions: [{
                approach: '다익스트라 + max',
                description: '다익스트라로 모든 노드까지의 최단 거리를 구한 뒤 최댓값을 반환합니다.',
                timeComplexity: 'O((V+E) log V)',
                spaceComplexity: 'O(V+E)',
                codeSteps: {
                    python: [
                        { title: '그래프 구성', code: 'import heapq\nINF = float(\'inf\')\ngraph = [[] for _ in range(n + 1)]\nfor u, v, w in times:\n    graph[u].append((v, w))' },
                        { title: '다익스트라 실행', code: 'dist = [INF] * (n + 1)\ndist[k] = 0\nheap = [(0, k)]\n\nwhile heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))' },
                        { title: '결과 반환', code: 'ans = max(dist[1:n+1])\nreturn ans if ans != INF else -1' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[3].templates; }
            }]
        }
    ]
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.shortestpath = shortestPathTopic;
