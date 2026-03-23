// ===== 그래프와 순회 토픽 모듈 =====
var graphTopic = {
    id: 'graph',
    title: '그래프와 순회',
    icon: '🕸️',
    category: '탐색 (Silver)',
    order: 9,
    description: '정점과 간선으로 이루어진 그래프를 DFS/BFS로 탐색하는 기법',
    relatedNote: '이 외에도 위상 정렬, 최단 경로, 최소 신장 트리, 강한 연결 요소 등의 심화 그래프 알고리즘이 있습니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-2606':  { type: 'DFS 기초',    color: 'var(--accent)', vizMethod: '_renderVizVirus',     suffix: '-virus' },
        'boj-24479': { type: 'DFS',          color: 'var(--green)',  vizMethod: '_renderVizDFS1',      suffix: '-dfs1' },
        'boj-24480': { type: 'DFS',          color: '#e17055',       vizMethod: '_renderVizDFS2',      suffix: '-dfs2' },
        'boj-24444': { type: 'BFS',          color: '#6c5ce7',       vizMethod: '_renderVizBFS1',      suffix: '-bfs1' },
        'boj-24445': { type: 'BFS',          color: '#fdcb6e',       vizMethod: '_renderVizBFS2',      suffix: '-bfs2' },
        'boj-1260':  { type: 'DFS+BFS',      color: '#00b894',       vizMethod: '_renderVizDFSBFS',    suffix: '-dfsbfs' },
        'boj-1012':  { type: '연결 요소',    color: '#d63031',       vizMethod: '_renderVizCabbage',   suffix: '-cab' },
        'boj-2667':  { type: '연결 요소',    color: '#0984e3',       vizMethod: '_renderVizComplex',   suffix: '-cpx' },
        'boj-2178':  { type: '최단 BFS',     color: '#e84393',       vizMethod: '_renderVizMaze',      suffix: '-maze' },
        'boj-1697':  { type: '최단 BFS',     color: '#fab1a0',       vizMethod: '_renderVizHide',      suffix: '-hide' },
        'boj-7562':  { type: '최단 BFS',     color: '#74b9ff',       vizMethod: '_renderVizKnight',    suffix: '-knight' },
        'boj-7576':  { type: '다중 BFS',     color: '#a29bfe',       vizMethod: '_renderVizTomato',    suffix: '-tom' },
        'boj-7569':  { type: '3D BFS',       color: '#55efc4',       vizMethod: '_renderVizTomato3',   suffix: '-tom3' },
        'boj-16928': { type: '그래프 BFS',   color: '#fd79a8',       vizMethod: '_renderVizSnake',     suffix: '-snake' },
        'boj-1707':  { type: '이분 그래프',  color: '#636e72',       vizMethod: '_renderVizBipartite', suffix: '-bip' },
        'boj-2206':  { type: '상태 BFS',     color: '#2d3436',       vizMethod: '_renderVizWall',      suffix: '-wall' }
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
            sim:     { intro: prob.simIntro || '그래프 탐색이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
                <h2>\uD83D\uDD78\uFE0F 그래프와 순회 (Graph Traversal)</h2>\
                <p class="hero-sub">정점과 간선으로 이루어진 그래프를 빠짐없이 탐색하는 방법을 배웁니다</p>\
            </div>\
\
            <!-- ① 그래프란? -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> 그래프란?</div>\
                <div class="analogy-box">\
                    여러분의 <strong>친구 관계</strong>를 그림으로 그려 볼까요?<br><br>\
                    각 사람을 <strong>점</strong>으로, 친구 사이를 <strong>줄</strong>로 연결하면 돼요.<br>\
                    예를 들어, 민수가 영희랑 친구이고, 영희가 철수랑 친구이면:<br>\
                    <strong>민수 — 영희 — 철수</strong> 이렇게 줄로 이어져요.<br><br>\
                    이런 그림을 <strong>그래프</strong>라고 해요. SNS 친구 관계, 지하철 노선도, 인터넷 연결 같은 게 다 그래프예요!\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="14" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="34" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="19" y1="14" x2="29" y2="14" stroke="currentColor" stroke-width="2"/><line x1="16" y1="19" x2="22" y2="29" stroke="currentColor" stroke-width="2"/><line x1="32" y1="19" x2="26" y2="29" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>정점과 간선</h3>\
                        <p>점 하나하나가 정점이고, 점과 점을 잇는 줄이 간선이에요.<br>사람이 N명, 친구 관계가 M개라고 생각하면 돼요!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="14" cy="24" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="24" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="19" y1="22" x2="29" y2="22" stroke="currentColor" stroke-width="2"/><line x1="19" y1="26" x2="29" y2="26" stroke="currentColor" stroke-width="2"/><polygon points="29,20 33,22 29,24" fill="currentColor"/><polygon points="19,24 15,26 19,28" fill="currentColor"/></svg></span></div>\
                        <h3>방향 vs 무방향 그래프</h3>\
                        <p>친구 관계는 서로 왔다갔다 할 수 있죠? 그게 무방향!<br>SNS 팔로우처럼 한쪽만 가능하면 방향 그래프예요.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><text x="4" y="14" font-size="10" fill="currentColor">1:</text><text x="16" y="14" font-size="10" fill="currentColor">[2, 3]</text><text x="4" y="28" font-size="10" fill="currentColor">2:</text><text x="16" y="28" font-size="10" fill="currentColor">[1, 4]</text><text x="4" y="42" font-size="10" fill="currentColor">3:</text><text x="16" y="42" font-size="10" fill="currentColor">[1]</text></svg></span></div>\
                        <h3>인접 리스트</h3>\
                        <p>각 사람마다 "내 친구 목록"을 따로 적어두는 거예요.<br>필요한 만큼만 저장하니까 효율적이에요!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="4" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="18" x2="44" y2="18" stroke="currentColor" stroke-width="1"/><line x1="4" y1="32" x2="44" y2="32" stroke="currentColor" stroke-width="1"/><line x1="18" y1="4" x2="18" y2="44" stroke="currentColor" stroke-width="1"/><line x1="32" y1="4" x2="32" y2="44" stroke="currentColor" stroke-width="1"/><text x="25" y="14" text-anchor="middle" font-size="9" fill="currentColor">1</text><text x="11" y="28" text-anchor="middle" font-size="9" fill="currentColor">1</text></svg></span></div>\
                        <h3>인접 행렬</h3>\
                        <p>N명 전체의 관계를 큰 표에 적어요. 친구면 1, 아니면 0!<br>사람이 많으면 표가 너무 커져서 비효율적이에요.</p>\
                    </div>\
                </div>\
\
                <div style="margin:1.5rem 0;overflow-x:auto;">\
                    <p style="font-weight:600;font-size:0.95rem;margin-bottom:0.8rem;color:var(--text);">인접 리스트 vs 인접 행렬 — 언제 뭘 쓸까?</p>\
                    <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">\
                    <thead><tr style="background:var(--bg2);">\
                        <th style="padding:10px;text-align:left;border:1px solid var(--bg3);"></th>\
                        <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">인접 리스트</th>\
                        <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">인접 행렬</th>\
                    </tr></thead>\
                    <tbody>\
                        <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">메모리</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(V+E)</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(V\u00B2)</td></tr>\
                        <tr style="background:var(--bg2);"><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">간선 존재 확인</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(차수)</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(1)</td></tr>\
                        <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">적합한 경우</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">간선이 적은 그래프 (희소)</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">간선이 많은 그래프 (밀집)</td></tr>\
                    </tbody>\
                    </table>\
                    <p style="margin-top:0.6rem;font-size:0.85rem;color:var(--text2);">\
                        대부분의 알고리즘 문제에서는 간선이 적은 희소 그래프이므로 <strong>인접 리스트</strong>를 주로 사용합니다.\
                    </p>\
                </div>\
\
                <p style="margin:0.5rem 0 0.8rem; font-size:0.9rem; color:var(--text2);">\
                    <span class="lang-py">Python에서는 <code>defaultdict(list)</code>를 쓰면 키 존재 여부를 체크하지 않아도 되어 편리합니다.</span>\
                    <span class="lang-cpp">C++에서는 <code>vector&lt;vector&lt;int&gt;&gt;</code>로 인접 리스트를 구현합니다.</span>\
                </p>\
                <div style="margin-bottom:0.8rem;">\
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.defaultdict" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: collections.defaultdict ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/vector" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: vector ↗</a></span>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 인접 리스트 만들기 (무방향 그래프)\nimport sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())  # 정점 수, 간선 수\ngraph = [[] for _ in range(N + 1)]\n\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)  # 무방향이므로 양쪽 다 추가</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 인접 리스트 만들기 (무방향 그래프)\n#include &lt;iostream&gt;\n#include &lt;vector&gt;\nusing namespace std;\n\nint main() {\n    int N, M;  // 정점 수, 간선 수\n    cin &gt;&gt; N &gt;&gt; M;\n    vector&lt;vector&lt;int&gt;&gt; graph(N + 1);\n\n    for (int i = 0; i &lt; M; i++) {\n        int u, v;\n        cin &gt;&gt; u &gt;&gt; v;\n        graph[u].push_back(v);\n        graph[v].push_back(u);  // 무방향이므로 양쪽 다 추가\n    }\n    return 0;\n}</code></pre></div></span>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 인접 리스트 만들기</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">정점 번호 두 개를 입력하고 "간선 추가"를 눌러보세요! 그래프와 인접 리스트가 어떻게 변하는지 확인하세요.</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="number" id="graph-demo-adj-u" value="1" min="1" max="6" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <span style="font-weight:600;">—</span>\
                        <input type="number" id="graph-demo-adj-v" value="2" min="1" max="6" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="graph-demo-adj-add">+ 간선 추가</button>\
                        <button class="concept-demo-btn" id="graph-demo-adj-reset" style="background:var(--bg2);color:var(--text2);">초기화</button>\
                    </div>\
                    <div class="concept-demo-body" style="display:flex;gap:2rem;flex-wrap:wrap;">\
                        <div style="flex:1;min-width:220px;">\
                            <div style="font-weight:600;margin-bottom:8px;color:var(--text);">그래프 시각화</div>\
                            <svg id="graph-demo-adj-svg" width="280" height="220" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></svg>\
                        </div>\
                        <div style="flex:1;min-width:200px;">\
                            <div style="font-weight:600;margin-bottom:8px;color:var(--text);">인접 리스트</div>\
                            <div id="graph-demo-adj-list" style="font-family:monospace;font-size:0.9rem;line-height:1.8;color:var(--text);"></div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-adj-msg">정점 1~6 사이의 간선을 추가해보세요! 무방향 그래프이므로 양쪽 모두에 추가됩니다.</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">5명의 학생(1~5번)이 있고, 친구 관계가 (1,2), (1,3), (2,4), (3,5)일 때, 1번의 인접 리스트는 무엇일까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        1번의 인접 리스트는 <strong>[2, 3]</strong>입니다!<br>\
                        1번과 직접 연결된 정점은 2번과 3번이기 때문입니다.<br>\
                        4번과 5번은 1번과 직접 연결되지 않았으므로 포함되지 않습니다.\
                    </div>\
                </div>\
            </div>\
\
            <!-- ② DFS (깊이 우선 탐색) -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> DFS (깊이 우선 탐색 — 한 길을 끝까지)</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 미로를 탐험한다고 생각해 보세요!<br><br>\
                    갈림길이 나오면 <strong>한 방향으로 끝까지</strong> 가봅니다.<br>\
                    막다른 길이면? <strong>되돌아와서</strong> 다른 방향으로 갑니다!<br><br>\
                    이것이 바로 <strong>DFS(깊이 우선 탐색)</strong>입니다.<br>\
                    "깊이" 우선이니까, 한 방향으로 최대한 <strong>깊이</strong> 들어갑니다.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="14" y="4" width="20" height="40" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="18" y="8" width="12" height="6" rx="2" fill="currentColor" opacity="0.3"/><rect x="18" y="18" width="12" height="6" rx="2" fill="currentColor" opacity="0.5"/><rect x="18" y="28" width="12" height="6" rx="2" fill="currentColor" opacity="0.8"/><path d="M24 38l-4-4h8z" fill="currentColor"/></svg></span></div>\
                        <h3>스택 / 재귀</h3>\
                        <p>DFS는 <strong>스택</strong> 또는 <strong>재귀</strong>로 구현합니다.<br>가장 최근 방문한 곳부터 탐색!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 24l4 4 8-8" stroke="#00b894" stroke-width="3" fill="none"/></svg></span></div>\
                        <h3>방문 체크 (visited)</h3>\
                        <p>한 번 방문한 정점은 다시 방문하지 않습니다.<br><strong>visited 배열</strong>로 체크합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><path d="M10 38 L24 8 L38 38" fill="none" stroke="currentColor" stroke-width="2"/><path d="M24 8 L24 28" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/><path d="M24 28 L10 38" stroke="#e74c3c" stroke-width="2.5"/><circle cx="24" cy="28" r="3" fill="#e74c3c"/></svg></span></div>\
                        <h3>백트래킹</h3>\
                        <p>막다른 길에 도달하면 되돌아갑니다.<br>스택/재귀가 자동으로 처리해 줍니다!</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># DFS \u2014 재귀 방식\ndef dfs(v):\n    visited[v] = True\n    for u in graph[v]:\n        if not visited[u]:\n            dfs(u)\n\n# DFS \u2014 스택 방식\ndef dfs_stack(start):\n    stack = [start]\n    visited[start] = True\n    while stack:\n        v = stack.pop()\n        for u in graph[v]:\n            if not visited[u]:\n                visited[u] = True\n                stack.append(u)</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// DFS \u2014 재귀 방식\nvoid dfs(int v, vector&lt;vector&lt;int&gt;&gt;&amp; graph, vector&lt;bool&gt;&amp; visited) {\n    visited[v] = true;\n    for (int u : graph[v]) {\n        if (!visited[u]) {\n            dfs(u, graph, visited);\n        }\n    }\n}\n\n// DFS \u2014 스택 방식\nvoid dfs_stack(int start, vector&lt;vector&lt;int&gt;&gt;&amp; graph, vector&lt;bool&gt;&amp; visited) {\n    stack&lt;int&gt; stk;\n    stk.push(start);\n    visited[start] = true;\n    while (!stk.empty()) {\n        int v = stk.top(); stk.pop();\n        for (int u : graph[v]) {\n            if (!visited[u]) {\n                visited[u] = true;\n                stk.push(u);\n            }\n        }\n    }\n}</code></pre></div></span>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — DFS 따라가기</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">1번에서 DFS를 시작합니다. 한 방향으로 깊이 들어갔다가, 막다른 길이면 돌아오는 과정을 관찰하세요!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="graph-demo-dfs-step">다음 스텝 ▶</button>\
                        <button class="concept-demo-btn" id="graph-demo-dfs-reset" style="background:var(--bg2);color:var(--text2);">초기화</button>\
                        <span id="graph-demo-dfs-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">\
                            <div style="flex:1;min-width:220px;">\
                                <svg id="graph-demo-dfs-svg" width="300" height="220" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></svg>\
                            </div>\
                            <div style="flex:1;min-width:160px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--text);">스택</div>\
                                <div id="graph-demo-dfs-stack" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:40px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></div>\
                                <div style="font-weight:600;margin:10px 0 6px;color:var(--text);">방문 순서</div>\
                                <div id="graph-demo-dfs-order" style="display:flex;gap:6px;flex-wrap:wrap;min-height:32px;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-dfs-msg">그래프: 1-2, 1-3, 2-4, 2-5 (작은 번호 우선). "다음 스텝"을 눌러 DFS 과정을 한 단계씩 따라가세요!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">그래프가 1-2, 1-3, 2-4, 2-5일 때, 1번에서 DFS를 시작하면 방문 순서는? (작은 번호부터 방문)</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>1 \u2192 2 \u2192 4 \u2192 5 \u2192 3</strong> 순서입니다!<br>\
                        1에서 시작 \u2192 이웃 중 작은 2로 이동 \u2192 2의 이웃 중 미방문인 4로 \u2192 4는 막다른 길이니 돌아와서 5로 \u2192 돌아와서 3으로!<br>\
                        한 길로 끝까지 간 다음 돌아오는 모습이 보이시나요?\
                    </div>\
                </div>\
            </div>\
\
            <!-- ③ BFS (너비 우선 탐색) -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> BFS (너비 우선 탐색 — 가까운 곳부터)</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 연못에 돌멩이를 던지면 <strong>동그란 물결</strong>이 점점 퍼져나갑니다!<br><br>\
                    BFS도 마찬가지입니다. 시작점에서 <strong>가까운 곳부터</strong> 차례대로 탐색합니다.<br>\
                    거리 1인 곳을 모두 방문 \u2192 거리 2인 곳을 모두 방문 \u2192 거리 3인 곳을 ... <br><br>\
                    그래서 BFS로 탐색하면 <strong>최단 거리</strong>를 자동으로 구할 수 있습니다!\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="16" width="40" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="24" r="4" fill="currentColor" opacity="0.3"/><circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.5"/><circle cx="36" cy="24" r="4" fill="currentColor" opacity="0.8"/><path d="M4 24l-2-3M4 24l-2 3" stroke="currentColor" stroke-width="2"/><path d="M44 24l2-3M44 24l2 3" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>큐(Queue) 사용</h3>\
                        <p>BFS는 <strong>큐</strong>를 사용합니다.<br>먼저 넣은 것을 먼저 꺼냅니다 (FIFO).</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="12" r="6" fill="none" stroke="#00b894" stroke-width="2"/><text x="24" y="15" text-anchor="middle" font-size="9" fill="#00b894">0</text><circle cx="14" cy="30" r="6" fill="none" stroke="#0984e3" stroke-width="2"/><text x="14" y="33" text-anchor="middle" font-size="9" fill="#0984e3">1</text><circle cx="34" cy="30" r="6" fill="none" stroke="#0984e3" stroke-width="2"/><text x="34" y="33" text-anchor="middle" font-size="9" fill="#0984e3">1</text><line x1="20" y1="17" x2="17" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="17" x2="31" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>거리(Level) 계산</h3>\
                        <p>시작점 거리 = 0<br>이웃의 거리 = 현재 거리 + 1</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="8" cy="24" r="4" fill="#00b894"/><circle cx="24" cy="24" r="4" fill="#fdcb6e"/><circle cx="40" cy="24" r="4" fill="#e17055"/><path d="M12 24h8M28 24h8" stroke="currentColor" stroke-width="2"/><text x="24" y="40" text-anchor="middle" font-size="8" fill="currentColor">최단!</text></svg></span></div>\
                        <h3>최단 거리 보장</h3>\
                        <p>간선 가중치가 모두 1일 때<br>BFS = <strong>최단 거리</strong>를 보장합니다!</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># BFS \u2014 큐 사용\nfrom collections import deque\n\ndef bfs(start):\n    queue = deque([start])\n    visited[start] = True\n    dist[start] = 0\n\n    while queue:\n        v = queue.popleft()\n        for u in graph[v]:\n            if not visited[u]:\n                visited[u] = True\n                dist[u] = dist[v] + 1\n                queue.append(u)</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// BFS \u2014 큐 사용\n#include &lt;queue&gt;\n\nvoid bfs(int start, vector&lt;vector&lt;int&gt;&gt;&amp; graph,\n         vector&lt;bool&gt;&amp; visited, vector&lt;int&gt;&amp; dist) {\n    queue&lt;int&gt; q;\n    q.push(start);\n    visited[start] = true;\n    dist[start] = 0;\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop();  // front()로 꺼내고 pop()으로 제거\n        for (int u : graph[v]) {\n            if (!visited[u]) {\n                visited[u] = true;\n                dist[u] = dist[v] + 1;\n                q.push(u);\n            }\n        }\n    }\n}</code></pre></div></span>\
                <div style="margin-top:0.6rem;">\
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: collections.deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: queue ↗</a></span>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — BFS 따라가기</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">1번에서 BFS를 시작합니다. 가까운 정점부터 차례대로 방문하는 과정을 큐와 함께 관찰하세요!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="graph-demo-bfs-step">다음 스텝 ▶</button>\
                        <button class="concept-demo-btn" id="graph-demo-bfs-reset" style="background:var(--bg2);color:var(--text2);">초기화</button>\
                        <span id="graph-demo-bfs-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">\
                            <div style="flex:1;min-width:220px;">\
                                <svg id="graph-demo-bfs-svg" width="300" height="220" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></svg>\
                            </div>\
                            <div style="flex:1;min-width:160px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--text);">큐 (Queue)</div>\
                                <div id="graph-demo-bfs-queue" style="display:flex;gap:4px;min-height:40px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);flex-wrap:wrap;"></div>\
                                <div style="font-weight:600;margin:10px 0 6px;color:var(--text);">방문 순서 (거리)</div>\
                                <div id="graph-demo-bfs-order" style="display:flex;gap:6px;flex-wrap:wrap;min-height:32px;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-bfs-msg">그래프: 1-2, 1-3, 2-4, 3-5, 4-6 (작은 번호 우선). "다음 스텝"을 눌러 BFS 과정을 따라가세요!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">DFS와 BFS 중, 미로에서 출구까지의 최단 경로를 찾으려면 어떤 것을 써야 할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>BFS</strong>를 써야 합니다!<br>\
                        BFS는 가까운 곳부터 탐색하므로, 출구에 처음 도달했을 때가 <strong>최단 거리</strong>입니다.<br>\
                        DFS는 한 방향으로 깊이 들어가므로, 먼 길을 돌아갈 수도 있습니다.\
                    </div>\
                </div>\
\
                <div class="analogy-box" style="margin-top:1.5rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);">\
                    <strong>왜 BFS는 최단 거리를 보장할까?</strong><br><br>\
                    BFS는 큐에서 꺼내는 순서가 곧 <strong>거리 순서</strong>입니다:<br>\
                    <strong>1단계)</strong> 거리 0인 노드(시작점)를 먼저 다 처리합니다.<br>\
                    <strong>2단계)</strong> 거리 0 노드의 이웃들 = 거리 1인 노드를 큐에 넣고, 차례로 처리합니다.<br>\
                    <strong>3단계)</strong> 거리 1 노드의 이웃들 = 거리 2인 노드를 큐에 넣고, 차례로 처리합니다.<br>\
                    <strong>...</strong><br><br>\
                    이렇게 레벨 단위로 탐색하기 때문에, 어떤 노드에 <strong>처음 도달한 순간</strong>이 곧 <strong>최단 경로</strong>입니다.<br>\
                    그보다 짧은 경로가 있었다면 이전 레벨에서 이미 방문했을 테니까요!<br><br>\
                    <span style="font-size:0.85rem;color:var(--text2);">\u26A0\uFE0F 단, 이건 모든 간선의 가중치가 <strong>1(동일)</strong>일 때만 성립합니다. 가중치가 다르면 다익스트라 등 다른 알고리즘이 필요합니다.</span>\
                </div>\
            </div>\
\
            <!-- DFS vs BFS 비교 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num" style="background:var(--accent);">\u2194\uFE0F</span> DFS vs BFS \u2014 뭐가 다를까?</div>\
                <p style="font-size:0.92rem;color:var(--text2);margin-bottom:1rem;">DFS와 BFS는 둘 다 그래프 전체를 탐색하는 방법이지만, 탐색 순서와 적합한 문제가 다릅니다.</p>\
                <div style="overflow-x:auto;">\
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">\
                <thead><tr style="background:var(--bg2);">\
                    <th style="padding:10px;text-align:left;border:1px solid var(--bg3);">비교 항목</th>\
                    <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">DFS</th>\
                    <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">BFS</th>\
                </tr></thead>\
                <tbody>\
                    <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">자료구조</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">스택 / 재귀</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">큐</td></tr>\
                    <tr style="background:var(--bg2);"><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">탐색 순서</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">깊이 우선</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">너비 우선 (레벨 순)</td></tr>\
                    <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">최단 경로?</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;color:var(--text2);">보장 안 됨</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;color:var(--green);font-weight:600;">\u2705 보장 (가중치 없을 때)</td></tr>\
                    <tr style="background:var(--bg2);"><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">메모리 사용</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(깊이)</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(너비)</td></tr>\
                    <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">적합한 문제</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">연결 요소, 사이클 탐지, 위상 정렬</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">최단 거리, 레벨별 처리</td></tr>\
                    <tr style="background:var(--bg2);"><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">시간 복잡도</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(V+E)</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(V+E)</td></tr>\
                </tbody>\
                </table>\
                </div>\
\
                <div class="concept-demo" style="margin-top:1.5rem;">\
                    <div class="concept-demo-title">직접 해보기 — 같은 그래프에서 DFS vs BFS</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">같은 그래프에서 DFS와 BFS를 실행해보세요. 탐색 순서가 어떻게 달라지는지 비교해 봅시다!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="graph-demo-cmp-dfs" style="background:var(--accent);">DFS로 탐색</button>\
                        <button class="concept-demo-btn" id="graph-demo-cmp-bfs" style="background:#00b894;">BFS로 탐색</button>\
                        <button class="concept-demo-btn" id="graph-demo-cmp-reset" style="background:var(--bg2);color:var(--text2);">초기화</button>\
                        <span id="graph-demo-cmp-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">\
                            <div style="flex:1;min-width:240px;">\
                                <svg id="graph-demo-cmp-svg" width="320" height="220" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></svg>\
                            </div>\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--text);" id="graph-demo-cmp-ds-label">자료구조</div>\
                                <div id="graph-demo-cmp-ds" style="display:flex;gap:4px;flex-wrap:wrap;min-height:36px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></div>\
                                <div style="font-weight:600;margin:10px 0 6px;color:var(--text);">방문 순서</div>\
                                <div id="graph-demo-cmp-order" style="display:flex;gap:6px;flex-wrap:wrap;min-height:32px;"></div>\
                                <div id="graph-demo-cmp-result" style="margin-top:12px;padding:10px 14px;border-radius:8px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);font-size:0.88rem;display:none;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-cmp-msg">그래프: 1-2, 1-3, 2-4, 3-5, 4-6. "DFS로 탐색" 또는 "BFS로 탐색" 버튼을 눌러 같은 그래프에서 탐색 순서를 비교하세요!</div>\
                </div>\
\
                <div class="think-box" style="margin-top:1.2rem;">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">그래프에서 사이클(순환)이 있는지 확인하려면 DFS와 BFS 중 어떤 것이 더 적합할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>DFS</strong>가 더 적합합니다!<br>\
                        DFS는 한 경로를 깊이 따라가므로, 탐색 중에 <strong>이미 방문한 노드</strong>를 다시 만나면 사이클이 있다는 뜻입니다.<br>\
                        BFS로도 가능하지만, DFS가 구현이 더 자연스럽고 직관적입니다.\
                    </div>\
                </div>\
            </div>\
\
            <!-- ④ 그리드에서의 탐색 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> 그리드에서의 탐색</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 바둑판 위에서 상하좌우로 이동한다고 생각해 보세요!<br><br>\
                    격자(Grid)에서는 각 칸이 <strong>정점</strong>이고, 상하좌우 이웃 칸으로 가는 것이 <strong>간선</strong>입니다.<br>\
                    "이 칸에서 갈 수 있는 곳"은 위, 아래, 왼쪽, 오른쪽 4방향뿐입니다!<br><br>\
                    격자 밖으로 나가거나 벽을 통과하면 안 되니까 <strong>범위 체크</strong>가 중요합니다.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="24" r="4" fill="#0984e3"/><path d="M24 16v-6M24 32v6M16 24h-6M32 24h6" stroke="#0984e3" stroke-width="2.5" stroke-linecap="round"/><text x="24" y="8" text-anchor="middle" font-size="7" fill="currentColor">\u2191</text><text x="24" y="46" text-anchor="middle" font-size="7" fill="currentColor">\u2193</text><text x="4" y="27" text-anchor="middle" font-size="7" fill="currentColor">\u2190</text><text x="44" y="27" text-anchor="middle" font-size="7" fill="currentColor">\u2192</text></svg></span></div>\
                        <h3>dx/dy 배열</h3>\
                        <p>상하좌우 이동을 배열로 표현합니다.<br>dx = [0, 0, 1, -1]<br>dy = [1, -1, 0, 0]</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="8" y="8" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,2"/><circle cx="24" cy="24" r="3" fill="#00b894"/><line x1="24" y1="24" x2="24" y2="8" stroke="#e74c3c" stroke-width="2"/><text x="28" y="12" font-size="8" fill="#e74c3c">\u2717</text></svg></span></div>\
                        <h3>범위 체크</h3>\
                        <p>이동할 칸이 격자 안에 있는지,<br>벽이 아닌지 반드시 확인합니다!</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 격자 탐색 패턴 (BFS)\ndx = [0, 0, 1, -1]  # 상하좌우\ndy = [1, -1, 0, 0]\n\nfor d in range(4):\n    nx, ny = x + dx[d], y + dy[d]\n    # 범위 체크: 격자 안에 있는지?\n    if 0 <= nx < N and 0 <= ny < M:\n        # 벽이 아니고, 방문하지 않았으면?\n        if grid[nx][ny] != 0 and not visited[nx][ny]:\n            visited[nx][ny] = True\n            queue.append((nx, ny))</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 격자 탐색 패턴 (BFS)\nint dx[] = {0, 0, 1, -1};  // 상하좌우\nint dy[] = {1, -1, 0, 0};\n\nfor (int d = 0; d &lt; 4; d++) {\n    int nx = x + dx[d], ny = y + dy[d];\n    // 범위 체크: 격자 안에 있는지?\n    if (nx &gt;= 0 &amp;&amp; nx &lt; N &amp;&amp; ny &gt;= 0 &amp;&amp; ny &lt; M) {\n        // 벽이 아니고, 방문하지 않았으면?\n        if (grid[nx][ny] != 0 &amp;&amp; !visited[nx][ny]) {\n            visited[nx][ny] = true;\n            q.push({nx, ny});\n        }\n    }\n}</code></pre></div></span>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 격자 BFS (Flood Fill)</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">시작 칸(파란색)을 클릭해서 선택한 뒤 "BFS 시작"을 누르세요. 물결이 퍼지듯 상하좌우로 탐색합니다! 검은 칸은 벽입니다(클릭으로 토글).</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="graph-demo-grid-start">BFS 시작</button>\
                        <button class="concept-demo-btn" id="graph-demo-grid-step" style="display:none;">다음 스텝 ▶</button>\
                        <button class="concept-demo-btn" id="graph-demo-grid-reset" style="background:var(--bg2);color:var(--text2);">초기화</button>\
                        <span id="graph-demo-grid-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="graph-demo-grid-area" style="display:inline-grid;grid-template-columns:repeat(7,36px);gap:3px;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-grid-msg">칸을 클릭하면 벽(검정)을 토글합니다. 파란 칸이 시작점입니다. 숫자는 시작점으로부터의 거리를 나타냅니다!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">5\u00D75 격자에서 (2, 3) 칸의 상하좌우 이웃은 어디일까요? (0-indexed)</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        상: (1, 3), 하: (3, 3), 좌: (2, 2), 우: (2, 4)<br>\
                        모두 0~4 범위 안에 있으므로 4개 다 유효합니다!<br>\
                        만약 (0, 0)이었다면? 상: (-1, 0)과 좌: (0, -1)은 범위 밖이므로 2개만 유효합니다.\
                    </div>\
                </div>\
            </div>\
\
            <!-- ⑤ 문제 유형 정리 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> 그래프 탐색 문제 유형 정리</div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="12" cy="14" r="4" fill="#0984e3"/><circle cx="24" cy="14" r="4" fill="#0984e3"/><line x1="16" y1="14" x2="20" y2="14" stroke="#0984e3" stroke-width="2"/><circle cx="12" cy="34" r="4" fill="#e17055"/><circle cx="24" cy="34" r="4" fill="#e17055"/><circle cx="36" cy="34" r="4" fill="#e17055"/><line x1="16" y1="34" x2="20" y2="34" stroke="#e17055" stroke-width="2"/><line x1="28" y1="34" x2="32" y2="34" stroke="#e17055" stroke-width="2"/></svg></span></div>\
                        <h3>\u2460 연결 요소 세기</h3>\
                        <p>DFS/BFS로 한 덩어리씩 탐색하여 <strong>몇 개의 그룹</strong>이 있는지 셉니다.<br>예: 바이러스 전파, 단지 수 세기</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="8" cy="24" r="5" fill="#00b894"/><circle cx="24" cy="24" r="5" fill="#fdcb6e"/><circle cx="40" cy="24" r="5" fill="#e17055"/><path d="M13 24h6M29 24h6" stroke="currentColor" stroke-width="2"/><text x="8" y="27" text-anchor="middle" font-size="8" fill="white">0</text><text x="24" y="27" text-anchor="middle" font-size="8" fill="white">1</text><text x="40" y="27" text-anchor="middle" font-size="8" fill="white">2</text></svg></span></div>\
                        <h3>\u2461 BFS 최단 거리</h3>\
                        <p>모든 간선 가중치가 1일 때, BFS로 <strong>최단 거리</strong>를 구합니다.<br>예: 미로 탈출, 숨바꼭질</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="12" cy="14" r="5" fill="#e74c3c"/><circle cx="36" cy="14" r="5" fill="#e74c3c"/><circle cx="24" cy="38" r="5" fill="#fdcb6e"/><path d="M14 19l8 14M34 19l-8 14" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,2"/></svg></span></div>\
                        <h3>\u2462 다중 시작점 BFS</h3>\
                        <p>여러 시작점을 큐에 동시에 넣고 BFS합니다.<br>예: 토마토 익히기 (여러 곳에서 동시에 퍼짐)</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="26" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="26" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="26" y="26" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><text x="13" y="17" text-anchor="middle" font-size="7" fill="currentColor">x,y</text><text x="35" y="17" text-anchor="middle" font-size="7" fill="currentColor">x,y</text><text x="13" y="39" text-anchor="middle" font-size="7" fill="#e74c3c">+상태</text><text x="35" y="39" text-anchor="middle" font-size="7" fill="#e74c3c">+상태</text></svg></span></div>\
                        <h3>\u2463 상태 확장 BFS</h3>\
                        <p>방문 배열에 추가 정보를 넣습니다.<br>예: visited[x][y][벽을 부쉈는지]</p>\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 유형 맞추기 퀴즈</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">문제 설명을 읽고, DFS / BFS / 둘 다 중 어떤 탐색이 적합한지 골라보세요!</p>\
                    <div id="graph-demo-quiz-area" style="display:flex;flex-direction:column;gap:16px;"></div>\
                    <div style="margin-top:12px;text-align:center;">\
                        <button class="concept-demo-btn" id="graph-demo-quiz-check">정답 확인</button>\
                        <button class="concept-demo-btn" id="graph-demo-quiz-retry" style="display:none;background:var(--bg2);color:var(--text2);">다시 풀기</button>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-quiz-msg">각 문제에 가장 적합한 탐색 방법을 선택한 뒤 "정답 확인"을 눌러보세요!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">"격자에서 1인 칸끼리 연결된 덩어리가 몇 개인지 세기" \u2014 어떤 유형의 문제일까요?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>\u2460 연결 요소 세기</strong> 유형입니다!<br>\
                        격자를 순회하면서 아직 방문하지 않은 1을 발견하면 DFS/BFS로 연결된 모든 1을 방문합니다.<br>\
                        이것을 <strong>Flood Fill</strong>이라고도 합니다. DFS/BFS를 시작한 횟수가 곧 덩어리 수입니다!\
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
                btn.textContent = ans.classList.contains('show') ? '\uD83D\uDD3C 접기' : '\uD83E\uDD14 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // ========== Demo 1: 인접 리스트 만들기 ==========
        (function() {
            var NODE_COUNT = 6;
            var positions = [
                {x:140,y:30},{x:60,y:90},{x:220,y:90},
                {x:30,y:180},{x:140,y:180},{x:250,y:180}
            ];
            var adj = {};
            var edgeSet = {};
            for (var i = 1; i <= NODE_COUNT; i++) adj[i] = [];

            var svgEl = container.querySelector('#graph-demo-adj-svg');
            var listEl = container.querySelector('#graph-demo-adj-list');
            var msgEl = container.querySelector('#graph-demo-adj-msg');
            var addBtn = container.querySelector('#graph-demo-adj-add');
            var resetBtn = container.querySelector('#graph-demo-adj-reset');
            var uInput = container.querySelector('#graph-demo-adj-u');
            var vInput = container.querySelector('#graph-demo-adj-v');

            function render() {
                var html = '';
                // edges
                for (var key in edgeSet) {
                    var parts = key.split('-');
                    var a = parseInt(parts[0]) - 1, b = parseInt(parts[1]) - 1;
                    html += '<line x1="' + positions[a].x + '" y1="' + positions[a].y + '" x2="' + positions[b].x + '" y2="' + positions[b].y + '" stroke="var(--accent)" stroke-width="2.5" opacity="0.6"/>';
                }
                // nodes
                for (var i = 0; i < NODE_COUNT; i++) {
                    html += '<circle cx="' + positions[i].x + '" cy="' + positions[i].y + '" r="18" fill="var(--card)" stroke="var(--accent)" stroke-width="2.5"/>';
                    html += '<text x="' + positions[i].x + '" y="' + (positions[i].y + 5) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--accent)">' + (i + 1) + '</text>';
                }
                svgEl.innerHTML = html;

                // adjacency list
                var listHtml = '';
                for (var i = 1; i <= NODE_COUNT; i++) {
                    var neighbors = adj[i].slice().sort(function(a,b){return a-b;});
                    listHtml += '<div style="padding:3px 0;' + (neighbors.length > 0 ? 'color:var(--text);' : 'color:var(--text3);') + '">' +
                        '<span style="color:var(--accent);font-weight:700;">' + i + '</span>: [' + neighbors.join(', ') + ']</div>';
                }
                listEl.innerHTML = listHtml;
            }
            render();

            addBtn.addEventListener('click', function() {
                var u = parseInt(uInput.value), v = parseInt(vInput.value);
                if (isNaN(u) || isNaN(v) || u < 1 || u > NODE_COUNT || v < 1 || v > NODE_COUNT || u === v) {
                    msgEl.textContent = '1~' + NODE_COUNT + ' 사이의 서로 다른 정점 번호를 입력하세요!';
                    msgEl.style.color = 'var(--red)';
                    return;
                }
                var key = Math.min(u,v) + '-' + Math.max(u,v);
                if (edgeSet[key]) {
                    msgEl.textContent = u + '-' + v + ' 간선은 이미 있습니다!';
                    msgEl.style.color = 'var(--yellow)';
                    return;
                }
                edgeSet[key] = true;
                adj[u].push(v);
                adj[v].push(u);
                msgEl.textContent = u + ' — ' + v + ' 간선 추가! 양쪽 인접 리스트에 모두 추가됩니다 (무방향).';
                msgEl.style.color = 'var(--green)';
                render();
            });

            resetBtn.addEventListener('click', function() {
                adj = {}; edgeSet = {};
                for (var i = 1; i <= NODE_COUNT; i++) adj[i] = [];
                msgEl.textContent = '초기화 완료! 간선을 추가해보세요.';
                msgEl.style.color = 'var(--text2)';
                render();
            });
        })();

        // ========== Demo 2: DFS 따라가기 ==========
        (function() {
            var dfsAdj = {1:[2,3], 2:[1,4,5], 3:[1], 4:[2], 5:[2]};
            var positions = [{x:150,y:30},{x:70,y:100},{x:230,y:100},{x:40,y:190},{x:130,y:190}];
            var edges = [[1,2],[1,3],[2,4],[2,5]];
            var nodeLabels = [1,2,3,4,5];

            var svgEl = container.querySelector('#graph-demo-dfs-svg');
            var stackEl = container.querySelector('#graph-demo-dfs-stack');
            var orderEl = container.querySelector('#graph-demo-dfs-order');
            var stepBtn = container.querySelector('#graph-demo-dfs-step');
            var resetBtn = container.querySelector('#graph-demo-dfs-reset');
            var counterEl = container.querySelector('#graph-demo-dfs-counter');
            var msgEl = container.querySelector('#graph-demo-dfs-msg');

            var visited, stack, visitOrder, dfsSteps, stepIdx;

            function buildDfsSteps() {
                visited = {}; stack = [1]; visitOrder = []; dfsSteps = []; stepIdx = -1;
                var vis = {}, stk = [1], ord = [];
                vis[1] = true;
                // pre-compute steps
                dfsSteps.push({type:'init', node:1, stack:[1], order:[], desc:'시작: 1번을 스택에 넣고 방문 표시합니다.'});
                while (stk.length > 0) {
                    var v = stk.pop();
                    ord.push(v);
                    var snap = stk.slice();
                    dfsSteps.push({type:'pop', node:v, stack:snap.slice(), order:ord.slice(), desc:v + '번을 스택에서 꺼내 처리합니다. 방문 순서: ' + ord.join(' → ')});
                    var neighbors = dfsAdj[v].slice().sort(function(a,b){return b-a;}); // reverse for stack
                    neighbors.forEach(function(u) {
                        if (!vis[u]) {
                            vis[u] = true;
                            stk.push(u);
                            snap = stk.slice();
                            dfsSteps.push({type:'push', node:u, from:v, stack:snap.slice(), order:ord.slice(), desc:v + '번의 이웃 ' + u + '번을 스택에 넣고 방문 표시합니다.'});
                        }
                    });
                }
                dfsSteps.push({type:'done', stack:[], order:ord.slice(), desc:'DFS 완료! 방문 순서: ' + ord.join(' → ')});
            }

            function renderDfs(step) {
                var html = '';
                // edges
                edges.forEach(function(e) {
                    var a = e[0]-1, b = e[1]-1;
                    html += '<line x1="'+positions[a].x+'" y1="'+positions[a].y+'" x2="'+positions[b].x+'" y2="'+positions[b].y+'" stroke="var(--bg3)" stroke-width="2.5"/>';
                });
                // nodes
                for (var i = 0; i < 5; i++) {
                    var nd = nodeLabels[i];
                    var fill = 'var(--card)', stroke = 'var(--bg3)', txtColor = 'var(--text)';
                    if (step && step.order && step.order.indexOf(nd) >= 0) {
                        fill = 'var(--green)'; stroke = 'var(--green)'; txtColor = 'white';
                    }
                    if (step && step.node === nd && step.type === 'pop') {
                        fill = 'var(--yellow)'; stroke = 'var(--yellow)'; txtColor = '#333';
                    }
                    if (step && step.node === nd && step.type === 'push') {
                        stroke = 'var(--accent)';
                    }
                    html += '<circle cx="'+positions[i].x+'" cy="'+positions[i].y+'" r="20" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
                    html += '<text x="'+positions[i].x+'" y="'+(positions[i].y+6)+'" text-anchor="middle" font-size="15" font-weight="700" fill="'+txtColor+'">'+nd+'</text>';
                }
                svgEl.innerHTML = html;

                // stack
                stackEl.innerHTML = '';
                if (step && step.stack) {
                    step.stack.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'padding:6px 14px;background:var(--accent);color:white;border-radius:6px;font-weight:700;text-align:center;font-size:0.9rem;';
                        div.textContent = nd;
                        stackEl.appendChild(div);
                    });
                }
                if (!step || !step.stack || step.stack.length === 0) {
                    stackEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">비어있음</span>';
                }

                // order
                orderEl.innerHTML = '';
                if (step && step.order) {
                    step.order.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'width:32px;height:32px;border-radius:50%;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;';
                        div.textContent = nd;
                        orderEl.appendChild(div);
                    });
                }
            }

            function reset() {
                buildDfsSteps();
                stepIdx = -1;
                renderDfs(null);
                counterEl.textContent = '';
                msgEl.textContent = '그래프: 1-2, 1-3, 2-4, 2-5 (작은 번호 우선). "다음 스텝"을 눌러 DFS 과정을 한 단계씩 따라가세요!';
                stepBtn.disabled = false;
            }

            stepBtn.addEventListener('click', function() {
                stepIdx++;
                if (stepIdx >= dfsSteps.length) { stepBtn.disabled = true; return; }
                var s = dfsSteps[stepIdx];
                renderDfs(s);
                counterEl.textContent = (stepIdx + 1) + ' / ' + dfsSteps.length;
                msgEl.textContent = s.desc;
                if (stepIdx >= dfsSteps.length - 1) stepBtn.disabled = true;
            });
            resetBtn.addEventListener('click', reset);
            reset();
        })();

        // ========== Demo 3: BFS 따라가기 ==========
        (function() {
            var bfsAdj = {1:[2,3], 2:[1,4], 3:[1,5], 4:[2,6], 5:[3], 6:[4]};
            var positions = [{x:150,y:25},{x:70,y:95},{x:230,y:95},{x:40,y:180},{x:230,y:180},{x:120,y:180}];
            var edges = [[1,2],[1,3],[2,4],[3,5],[4,6]];
            var nodeLabels = [1,2,3,4,5,6];

            var svgEl = container.querySelector('#graph-demo-bfs-svg');
            var queueEl = container.querySelector('#graph-demo-bfs-queue');
            var orderEl = container.querySelector('#graph-demo-bfs-order');
            var stepBtn = container.querySelector('#graph-demo-bfs-step');
            var resetBtn = container.querySelector('#graph-demo-bfs-reset');
            var counterEl = container.querySelector('#graph-demo-bfs-counter');
            var msgEl = container.querySelector('#graph-demo-bfs-msg');

            var bfsSteps, stepIdx, dist;

            function buildBfsSteps() {
                bfsSteps = []; dist = {};
                var vis = {}, queue = [1], ord = [];
                vis[1] = true; dist[1] = 0;
                bfsSteps.push({type:'init', node:1, queue:[1], order:[], dist:{1:0}, desc:'시작: 1번을 큐에 넣고 방문 표시합니다. 거리=0.'});
                while (queue.length > 0) {
                    var v = queue.shift();
                    ord.push(v);
                    var snap = queue.slice();
                    var dSnap = {};
                    for (var k in dist) dSnap[k] = dist[k];
                    bfsSteps.push({type:'dequeue', node:v, queue:snap.slice(), order:ord.slice(), dist:Object.assign({},dSnap), desc:v + '번을 큐에서 꺼내 처리합니다. 거리=' + dist[v] + '. 방문 순서: ' + ord.join(' → ')});
                    var neighbors = bfsAdj[v].slice().sort(function(a,b){return a-b;});
                    neighbors.forEach(function(u) {
                        if (!vis[u]) {
                            vis[u] = true;
                            dist[u] = dist[v] + 1;
                            queue.push(u);
                            snap = queue.slice();
                            dSnap = {};
                            for (var k in dist) dSnap[k] = dist[k];
                            bfsSteps.push({type:'enqueue', node:u, from:v, queue:snap.slice(), order:ord.slice(), dist:Object.assign({},dSnap), desc:v + '번의 이웃 ' + u + '번을 큐에 넣습니다. 거리=' + dist[u] + '.'});
                        }
                    });
                }
                bfsSteps.push({type:'done', queue:[], order:ord.slice(), dist:Object.assign({},dist), desc:'BFS 완료! 방문 순서: ' + ord.join(' → ') + '. 모든 정점의 최단 거리가 계산되었습니다.'});
            }

            function renderBfs(step) {
                var html = '';
                edges.forEach(function(e) {
                    var a = e[0]-1, b = e[1]-1;
                    html += '<line x1="'+positions[a].x+'" y1="'+positions[a].y+'" x2="'+positions[b].x+'" y2="'+positions[b].y+'" stroke="var(--bg3)" stroke-width="2.5"/>';
                });
                for (var i = 0; i < nodeLabels.length; i++) {
                    var nd = nodeLabels[i];
                    var fill = 'var(--card)', stroke = 'var(--bg3)', txtColor = 'var(--text)';
                    if (step && step.order && step.order.indexOf(nd) >= 0) {
                        fill = 'var(--green)'; stroke = 'var(--green)'; txtColor = 'white';
                    }
                    if (step && step.node === nd && step.type === 'dequeue') {
                        fill = 'var(--yellow)'; stroke = 'var(--yellow)'; txtColor = '#333';
                    }
                    if (step && step.node === nd && step.type === 'enqueue') {
                        stroke = 'var(--accent)'; if (step.order.indexOf(nd) < 0) fill = 'var(--accent)15';
                    }
                    html += '<circle cx="'+positions[i].x+'" cy="'+positions[i].y+'" r="20" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
                    html += '<text x="'+positions[i].x+'" y="'+(positions[i].y+6)+'" text-anchor="middle" font-size="15" font-weight="700" fill="'+txtColor+'">'+nd+'</text>';
                    // distance label
                    if (step && step.dist && step.dist[nd] !== undefined) {
                        html += '<text x="'+(positions[i].x+22)+'" y="'+(positions[i].y-14)+'" text-anchor="middle" font-size="10" fill="var(--accent)" font-weight="600">d='+step.dist[nd]+'</text>';
                    }
                }
                svgEl.innerHTML = html;

                // queue
                queueEl.innerHTML = '';
                if (step && step.queue && step.queue.length > 0) {
                    step.queue.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'padding:6px 14px;background:var(--accent);color:white;border-radius:6px;font-weight:700;font-size:0.9rem;';
                        div.textContent = nd;
                        queueEl.appendChild(div);
                    });
                } else {
                    queueEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">비어있음</span>';
                }

                // order with distance
                orderEl.innerHTML = '';
                if (step && step.order) {
                    step.order.forEach(function(nd) {
                        var d = step.dist && step.dist[nd] !== undefined ? step.dist[nd] : '?';
                        var div = document.createElement('div');
                        div.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';
                        div.innerHTML = '<div style="width:32px;height:32px;border-radius:50%;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;">'+nd+'</div><span style="font-size:0.7rem;color:var(--text2);">d='+d+'</span>';
                        orderEl.appendChild(div);
                    });
                }
            }

            function reset() {
                buildBfsSteps();
                stepIdx = -1;
                renderBfs(null);
                counterEl.textContent = '';
                msgEl.textContent = '그래프: 1-2, 1-3, 2-4, 3-5, 4-6 (작은 번호 우선). "다음 스텝"을 눌러 BFS 과정을 따라가세요!';
                stepBtn.disabled = false;
            }

            stepBtn.addEventListener('click', function() {
                stepIdx++;
                if (stepIdx >= bfsSteps.length) { stepBtn.disabled = true; return; }
                var s = bfsSteps[stepIdx];
                renderBfs(s);
                counterEl.textContent = (stepIdx + 1) + ' / ' + bfsSteps.length;
                msgEl.textContent = s.desc;
                if (stepIdx >= bfsSteps.length - 1) stepBtn.disabled = true;
            });
            resetBtn.addEventListener('click', reset);
            reset();
        })();

        // ========== Demo 4: 격자 BFS (Flood Fill) ==========
        (function() {
            var ROWS = 6, COLS = 7;
            var grid, dist, startR, startC, bfsQueue, bfsRunning, bfsStepIdx;
            var areaEl = container.querySelector('#graph-demo-grid-area');
            var startBtn = container.querySelector('#graph-demo-grid-start');
            var stepBtn = container.querySelector('#graph-demo-grid-step');
            var resetBtn = container.querySelector('#graph-demo-grid-reset');
            var counterEl = container.querySelector('#graph-demo-grid-counter');
            var msgEl = container.querySelector('#graph-demo-grid-msg');
            var dx = [-1,1,0,0], dy = [0,0,-1,1];

            function initGrid() {
                grid = []; dist = [];
                for (var r = 0; r < ROWS; r++) {
                    grid[r] = []; dist[r] = [];
                    for (var c = 0; c < COLS; c++) { grid[r][c] = 0; dist[r][c] = -1; }
                }
                // some walls
                [[1,2],[1,3],[2,3],[3,1],[3,4],[4,4]].forEach(function(w) { grid[w[0]][w[1]] = 1; });
                startR = 0; startC = 0;
                bfsQueue = []; bfsRunning = false; bfsStepIdx = 0;
            }

            function renderGrid() {
                areaEl.innerHTML = '';
                for (var r = 0; r < ROWS; r++) {
                    for (var c = 0; c < COLS; c++) {
                        var cell = document.createElement('div');
                        cell.dataset.r = r; cell.dataset.c = c;
                        cell.style.cssText = 'width:36px;height:36px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;cursor:pointer;transition:all 0.2s;border:2px solid var(--bg3);';
                        if (grid[r][c] === 1) {
                            cell.style.background = '#333'; cell.style.color = '#666';
                        } else if (r === startR && c === startC) {
                            cell.style.background = 'var(--accent)'; cell.style.color = 'white';
                            cell.textContent = 'S';
                        } else if (dist[r][c] >= 0) {
                            var hue = 120 + dist[r][c] * 30;
                            cell.style.background = 'hsl(' + (hue % 360) + ', 60%, 55%)';
                            cell.style.color = 'white';
                            cell.textContent = dist[r][c];
                        } else {
                            cell.style.background = 'var(--card)'; cell.style.color = 'var(--text3)';
                        }
                        if (!bfsRunning) {
                            cell.addEventListener('click', (function(rr,cc) {
                                return function() {
                                    if (rr === startR && cc === startC) return;
                                    grid[rr][cc] = grid[rr][cc] === 1 ? 0 : 1;
                                    renderGrid();
                                };
                            })(r,c));
                        }
                        areaEl.appendChild(cell);
                    }
                }
            }

            function reset() {
                initGrid();
                renderGrid();
                startBtn.style.display = '';
                stepBtn.style.display = 'none';
                counterEl.textContent = '';
                msgEl.textContent = '칸을 클릭하면 벽(검정)을 토글합니다. 파란 칸이 시작점입니다.';
                msgEl.style.color = 'var(--text2)';
            }

            startBtn.addEventListener('click', function() {
                bfsRunning = true;
                dist = [];
                for (var r = 0; r < ROWS; r++) { dist[r] = []; for (var c = 0; c < COLS; c++) dist[r][c] = -1; }
                dist[startR][startC] = 0;
                bfsQueue = [{r:startR, c:startC}];
                bfsStepIdx = 0;
                startBtn.style.display = 'none';
                stepBtn.style.display = '';
                renderGrid();
                msgEl.textContent = 'BFS 시작! 시작점 (' + startR + ',' + startC + ')에서 출발합니다. "다음 스텝"으로 물결이 퍼지는 과정을 보세요.';
                msgEl.style.color = 'var(--accent)';
            });

            stepBtn.addEventListener('click', function() {
                if (bfsQueue.length === 0) {
                    msgEl.textContent = 'BFS 완료! 도달 가능한 모든 칸의 최단 거리가 표시되었습니다.';
                    msgEl.style.color = 'var(--green)';
                    stepBtn.disabled = true;
                    return;
                }
                var cur = bfsQueue.shift();
                bfsStepIdx++;
                var added = [];
                for (var d = 0; d < 4; d++) {
                    var nr = cur.r + dx[d], nc = cur.c + dy[d];
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === 0 && dist[nr][nc] < 0) {
                        dist[nr][nc] = dist[cur.r][cur.c] + 1;
                        bfsQueue.push({r:nr, c:nc});
                        added.push('(' + nr + ',' + nc + ')');
                    }
                }
                renderGrid();
                counterEl.textContent = 'Step ' + bfsStepIdx + ' | 큐: ' + bfsQueue.length + '개';
                if (added.length > 0) {
                    msgEl.textContent = '(' + cur.r + ',' + cur.c + ') 처리 (거리 ' + dist[cur.r][cur.c] + '). 이웃 ' + added.join(', ') + '을 큐에 추가.';
                } else {
                    msgEl.textContent = '(' + cur.r + ',' + cur.c + ') 처리 (거리 ' + dist[cur.r][cur.c] + '). 새로 추가할 이웃이 없습니다.';
                }
                msgEl.style.color = 'var(--text)';
            });

            resetBtn.addEventListener('click', function() {
                bfsRunning = false;
                stepBtn.disabled = false;
                reset();
            });
            reset();
        })();

        // ========== Demo: DFS vs BFS 비교 데모 ==========
        (function() {
            var adj = {1:[2,3], 2:[1,4], 3:[1,5], 4:[2,6], 5:[3], 6:[4]};
            var positions = [{x:160,y:25},{x:70,y:90},{x:250,y:90},{x:40,y:175},{x:250,y:175},{x:130,y:175}];
            var edgeList = [[1,2],[1,3],[2,4],[3,5],[4,6]];
            var nodeLabels = [1,2,3,4,5,6];

            var svgEl = container.querySelector('#graph-demo-cmp-svg');
            var dsEl = container.querySelector('#graph-demo-cmp-ds');
            var dsLabel = container.querySelector('#graph-demo-cmp-ds-label');
            var orderEl = container.querySelector('#graph-demo-cmp-order');
            var resultEl = container.querySelector('#graph-demo-cmp-result');
            var dfsBtn = container.querySelector('#graph-demo-cmp-dfs');
            var bfsBtn = container.querySelector('#graph-demo-cmp-bfs');
            var resetBtn = container.querySelector('#graph-demo-cmp-reset');
            var counterEl = container.querySelector('#graph-demo-cmp-counter');
            var msgEl = container.querySelector('#graph-demo-cmp-msg');

            var steps, stepIdx, mode, autoTimer, dfsResult, bfsResult;

            function buildDfsSteps() {
                steps = []; mode = 'DFS'; dsLabel.textContent = '스택 (Stack)';
                var vis = {}, stk = [1], ord = [];
                vis[1] = true;
                steps.push({node:1, ds:[1], order:[], desc:'DFS 시작: 1번을 스택에 넣고 방문 표시합니다.', highlight:1, visited:{}});
                while (stk.length > 0) {
                    var v = stk.pop();
                    ord.push(v);
                    var visSnap = {}; for (var k in vis) visSnap[k]=true; ord.forEach(function(o){visSnap[o]=true;});
                    steps.push({node:v, ds:stk.slice(), order:ord.slice(), desc:v + '번을 스택에서 꺼냅니다. 방문 순서: ' + ord.join(' → '), highlight:v, visited:visSnap});
                    var neighbors = adj[v].slice().sort(function(a,b){return b-a;});
                    neighbors.forEach(function(u) {
                        if (!vis[u]) {
                            vis[u] = true;
                            stk.push(u);
                            var visSnap2 = {}; for (var k in vis) visSnap2[k]=true;
                            steps.push({node:u, ds:stk.slice(), order:ord.slice(), desc:v + '의 이웃 ' + u + '번을 스택에 추가합니다.', highlight:u, visited:visSnap2});
                        }
                    });
                }
                steps.push({node:null, ds:[], order:ord.slice(), desc:'DFS 완료! 방문 순서: ' + ord.join(' → '), highlight:null, visited:vis});
                dfsResult = ord.slice();
            }

            function buildBfsSteps() {
                steps = []; mode = 'BFS'; dsLabel.textContent = '큐 (Queue)';
                var vis = {}, queue = [1], ord = [];
                vis[1] = true;
                steps.push({node:1, ds:[1], order:[], desc:'BFS 시작: 1번을 큐에 넣고 방문 표시합니다.', highlight:1, visited:{}});
                while (queue.length > 0) {
                    var v = queue.shift();
                    ord.push(v);
                    var visSnap = {}; for (var k in vis) visSnap[k]=true; ord.forEach(function(o){visSnap[o]=true;});
                    steps.push({node:v, ds:queue.slice(), order:ord.slice(), desc:v + '번을 큐에서 꺼냅니다. 방문 순서: ' + ord.join(' → '), highlight:v, visited:visSnap});
                    var neighbors = adj[v].slice().sort(function(a,b){return a-b;});
                    neighbors.forEach(function(u) {
                        if (!vis[u]) {
                            vis[u] = true;
                            queue.push(u);
                            var visSnap2 = {}; for (var k in vis) visSnap2[k]=true;
                            steps.push({node:u, ds:queue.slice(), order:ord.slice(), desc:v + '의 이웃 ' + u + '번을 큐에 추가합니다.', highlight:u, visited:visSnap2});
                        }
                    });
                }
                steps.push({node:null, ds:[], order:ord.slice(), desc:'BFS 완료! 방문 순서: ' + ord.join(' → '), highlight:null, visited:vis});
                bfsResult = ord.slice();
            }

            function renderCmpGraph(step) {
                var html = '';
                edgeList.forEach(function(e) {
                    var a = e[0]-1, b = e[1]-1;
                    html += '<line x1="'+positions[a].x+'" y1="'+positions[a].y+'" x2="'+positions[b].x+'" y2="'+positions[b].y+'" stroke="var(--bg3)" stroke-width="2.5"/>';
                });
                for (var i = 0; i < nodeLabels.length; i++) {
                    var nd = nodeLabels[i];
                    var fill = 'var(--card)', stroke = 'var(--bg3)', txtColor = 'var(--text)';
                    if (step && step.visited && step.visited[nd]) {
                        fill = 'var(--green)'; stroke = 'var(--green)'; txtColor = 'white';
                    }
                    if (step && step.highlight === nd) {
                        fill = 'var(--yellow)'; stroke = 'var(--yellow)'; txtColor = '#333';
                    }
                    html += '<circle cx="'+positions[i].x+'" cy="'+positions[i].y+'" r="22" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
                    html += '<text x="'+positions[i].x+'" y="'+(positions[i].y+6)+'" text-anchor="middle" font-size="15" font-weight="700" fill="'+txtColor+'">'+nd+'</text>';
                }
                svgEl.innerHTML = html;

                dsEl.innerHTML = '';
                if (step && step.ds && step.ds.length > 0) {
                    step.ds.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'padding:5px 12px;background:' + (mode === 'DFS' ? 'var(--accent)' : '#00b894') + ';color:white;border-radius:6px;font-weight:700;font-size:0.88rem;';
                        div.textContent = nd;
                        dsEl.appendChild(div);
                    });
                } else {
                    dsEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">비어있음</span>';
                }

                orderEl.innerHTML = '';
                if (step && step.order) {
                    step.order.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'width:30px;height:30px;border-radius:50%;background:' + (mode === 'DFS' ? 'var(--accent)' : '#00b894') + ';color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;';
                        div.textContent = nd;
                        orderEl.appendChild(div);
                    });
                }
            }

            function showResult() {
                if (dfsResult && bfsResult) {
                    resultEl.style.display = 'block';
                    resultEl.innerHTML = '<strong>비교 결과</strong><br><span style="color:var(--accent);font-weight:600;">DFS:</span> ' + dfsResult.join(' → ') + '<br><span style="color:#00b894;font-weight:600;">BFS:</span> ' + bfsResult.join(' → ') + '<br><span style="font-size:0.85rem;color:var(--text2);margin-top:4px;display:inline-block;">같은 그래프인데 탐색 순서가 다릅니다!</span>';
                }
            }

            function runAuto() {
                if (autoTimer) clearInterval(autoTimer);
                stepIdx = -1;
                dfsBtn.disabled = true; bfsBtn.disabled = true;
                autoTimer = setInterval(function() {
                    stepIdx++;
                    if (stepIdx >= steps.length) {
                        clearInterval(autoTimer);
                        dfsBtn.disabled = false; bfsBtn.disabled = false;
                        showResult();
                        return;
                    }
                    var s = steps[stepIdx];
                    renderCmpGraph(s);
                    counterEl.textContent = (stepIdx + 1) + ' / ' + steps.length;
                    msgEl.textContent = s.desc;
                }, 600);
            }

            function reset() {
                if (autoTimer) clearInterval(autoTimer);
                steps = []; stepIdx = -1; mode = '';
                dfsResult = null; bfsResult = null;
                dsLabel.textContent = '자료구조';
                resultEl.style.display = 'none';
                renderCmpGraph(null);
                counterEl.textContent = '';
                msgEl.textContent = '그래프: 1-2, 1-3, 2-4, 3-5, 4-6. "DFS로 탐색" 또는 "BFS로 탐색" 버튼을 눌러 같은 그래프에서 탐색 순서를 비교하세요!';
                dfsBtn.disabled = false; bfsBtn.disabled = false;
            }

            dfsBtn.addEventListener('click', function() { buildDfsSteps(); runAuto(); });
            bfsBtn.addEventListener('click', function() { buildBfsSteps(); runAuto(); });
            resetBtn.addEventListener('click', reset);
            reset();
        })();

        // ========== Demo 5: 유형 맞추기 퀴즈 ==========
        (function() {
            var quizData = [
                {q:'미로에서 출구까지 최단 거리 구하기', answer:'BFS', why:'BFS는 가까운 곳부터 탐색하므로 최단 거리를 보장합니다.'},
                {q:'그래프에서 연결된 덩어리(컴포넌트) 수 세기', answer:'둘 다', why:'연결 요소는 DFS든 BFS든 탐색 가능합니다. 둘 다 OK!'},
                {q:'사이클이 있는지 탐지하기', answer:'DFS', why:'DFS는 한 경로를 깊이 따라가므로 사이클 탐지에 자연스럽습니다.'},
                {q:'토마토가 여러 곳에서 동시에 익어감', answer:'BFS', why:'다중 시작점 BFS! 시작점을 모두 큐에 넣고 시작합니다.'},
                {q:'격자에서 물이 동시에 퍼져나가는 시뮬레이션', answer:'BFS', why:'동시에 퍼지는 현상은 BFS의 레벨별 탐색과 동일합니다.'}
            ];
            var choices = ['DFS', 'BFS', '둘 다'];
            var quizArea = container.querySelector('#graph-demo-quiz-area');
            var checkBtn = container.querySelector('#graph-demo-quiz-check');
            var retryBtn = container.querySelector('#graph-demo-quiz-retry');
            var quizMsg = container.querySelector('#graph-demo-quiz-msg');
            var userAnswers = [];

            function renderQuiz() {
                quizArea.innerHTML = '';
                userAnswers = [];
                quizData.forEach(function(item, idx) {
                    userAnswers.push(null);
                    var card = document.createElement('div');
                    card.style.cssText = 'padding:14px 18px;background:var(--card);border-radius:10px;border:1.5px solid var(--bg3);';
                    card.id = 'graph-demo-quiz-q' + idx;
                    var html = '<div style="font-weight:600;color:var(--text);margin-bottom:8px;">' + (idx+1) + '. ' + item.q + '</div>';
                    html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
                    choices.forEach(function(ch) {
                        html += '<button class="concept-demo-btn graph-demo-quiz-opt" data-idx="' + idx + '" data-val="' + ch + '" style="padding:6px 16px;font-size:0.85rem;background:var(--bg2);color:var(--text);border:1.5px solid var(--bg3);">' + ch + '</button>';
                    });
                    html += '</div>';
                    html += '<div class="graph-demo-quiz-feedback" style="margin-top:8px;font-size:0.85rem;color:var(--text2);display:none;"></div>';
                    card.innerHTML = html;
                    quizArea.appendChild(card);
                });
                // bind option buttons
                quizArea.querySelectorAll('.graph-demo-quiz-opt').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var idx = parseInt(btn.dataset.idx);
                        var val = btn.dataset.val;
                        userAnswers[idx] = val;
                        // highlight selected
                        var card = container.querySelector('#graph-demo-quiz-q' + idx);
                        card.querySelectorAll('.graph-demo-quiz-opt').forEach(function(b) {
                            b.style.background = 'var(--bg2)'; b.style.borderColor = 'var(--bg3)'; b.style.color = 'var(--text)';
                        });
                        btn.style.background = 'var(--accent)'; btn.style.color = 'white'; btn.style.borderColor = 'var(--accent)';
                    });
                });
            }

            checkBtn.addEventListener('click', function() {
                var score = 0;
                quizData.forEach(function(item, idx) {
                    var card = container.querySelector('#graph-demo-quiz-q' + idx);
                    var fb = card.querySelector('.graph-demo-quiz-feedback');
                    fb.style.display = 'block';
                    if (userAnswers[idx] === item.answer) {
                        score++;
                        fb.innerHTML = '<span style="color:var(--green);font-weight:600;">정답!</span> ' + item.why;
                        card.style.borderColor = 'var(--green)';
                    } else if (userAnswers[idx] === null) {
                        fb.innerHTML = '<span style="color:var(--text2);">선택하지 않았습니다.</span> 정답: <strong>' + item.answer + '</strong>. ' + item.why;
                        card.style.borderColor = 'var(--yellow)';
                    } else {
                        fb.innerHTML = '<span style="color:var(--red);font-weight:600;">오답!</span> 정답: <strong>' + item.answer + '</strong>. ' + item.why;
                        card.style.borderColor = 'var(--red)';
                    }
                    // disable buttons
                    card.querySelectorAll('.graph-demo-quiz-opt').forEach(function(b) { b.disabled = true; });
                });
                quizMsg.textContent = quizData.length + '문제 중 ' + score + '개 정답!';
                quizMsg.style.color = score === quizData.length ? 'var(--green)' : 'var(--accent)';
                checkBtn.style.display = 'none';
                retryBtn.style.display = '';
            });

            retryBtn.addEventListener('click', function() {
                renderQuiz();
                quizMsg.textContent = '각 문제에 가장 적합한 탐색 방법을 선택한 뒤 "정답 확인"을 눌러보세요!';
                quizMsg.style.color = 'var(--text2)';
                checkBtn.style.display = '';
                retryBtn.style.display = 'none';
            });

            renderQuiz();
        })();
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
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25B6 다음 버튼을 눌러 시작하세요</div>';
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
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '\u25B6 다음 버튼을 눌러 시작하세요'; }
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
    // 시뮬레이션 1: 바이러스 (boj-2606)
    // ====================================================================
    _renderVizVirus: function(container) {
        var self = this, suffix = '-virus';
        var DEFAULT_N = 7, DEFAULT_EDGES = '1 2, 2 3, 1 5, 5 2, 5 6, 4 7';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">바이러스 전파 (BFS)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">1번 컴퓨터에서 시작하여 연결된 컴퓨터를 모두 감염시킵니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-virus-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">간선: <input type="text" id="gr-virus-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:240px;"></label>' +
            '<button class="btn btn-primary" id="gr-virus-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) {
            return s.split(',').map(function(e) { var p = e.trim().split(/\s+/); return [parseInt(p[0]), parseInt(p[1])]; }).filter(function(e) { return !isNaN(e[0]) && !isNaN(e[1]); });
        }
        function buildAdj(n, edges) {
            var adj = {}; for (var i = 1; i <= n; i++) adj[i] = [];
            edges.forEach(function(e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
            for (var i = 1; i <= n; i++) adj[i].sort(function(a,b){return a-b;});
            return adj;
        }
        function renderNodes(n, vis, current, q) {
            var nodes = []; for (var i = 1; i <= n; i++) nodes.push(i);
            areaEl.innerHTML = '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">' + nodes.map(function(nd) {
                var bg = 'var(--bg2)';
                if (vis[nd]) bg = 'linear-gradient(135deg,var(--accent-vivid),var(--accent2))';
                if (nd === current) bg = 'var(--yellow)';
                return '<div style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;background:' + bg + ';color:' + (vis[nd] ? 'white' : 'var(--text)') + ';">' + nd + '</div>';
            }).join('') + '</div>' + (q.length ? '<div style="margin-top:8px;font-size:0.85rem;color:var(--text2);">\uD050: [' + q.join(', ') + ']</div>' : '');
        }
        function buildSteps(n, edges) {
            var adj = buildAdj(n, edges);
            var steps = [], visited = {}, queue = [];
            // BFS from node 1
            steps.push({ description: '<strong>1번</strong>이 감염 시작점 — 큐에 넣어 이웃 탐색을 준비합니다. BFS는 <em>가까운 이웃부터</em> 퍼져나가므로 연결된 모든 컴퓨터를 빠짐없이 찾을 수 있습니다.',
                action: function() { visited = {1:true}; queue = [1]; renderNodes(n, visited, 1, queue); infoEl.innerHTML = 'visited[1] = True, 큐 = [1]'; },
                undo: function() { visited = {}; queue = []; renderNodes(n, {}, null, []); infoEl.innerHTML = ''; } });
            // simulate BFS to generate steps
            var simVis = {1:true}, simQ = [1];
            while (simQ.length > 0) {
                var v = simQ.shift();
                var neighbors = (adj[v] || []).filter(function(u) { return !simVis[u]; });
                if (neighbors.length > 0) {
                    (function(cv, nb) {
                        var addedNodes = nb.slice();
                        steps.push({
                            description: '큐의 <strong>맨 앞</strong>인 ' + cv + '를 꺼냄 — FIFO 순서로 가까운 노드부터 처리하기 위해. 이웃 <strong>' + nb.join(', ') + '</strong>이 아직 미방문이므로 감염시키고 큐에 추가합니다.',
                            action: function() { addedNodes.forEach(function(u) { visited[u] = true; }); queue = simQ.slice(); renderNodes(n, visited, cv, queue); infoEl.innerHTML = cv + '의 미방문 이웃: ' + nb.join(', ') + ' → 감염!'; },
                            undo: function() { addedNodes.forEach(function(u) { delete visited[u]; }); renderNodes(n, visited, null, []); infoEl.innerHTML = ''; }
                        });
                    })(v, neighbors);
                    neighbors.forEach(function(u) { simVis[u] = true; simQ.push(u); });
                } else if (v !== 1) {
                    (function(cv) {
                        steps.push({
                            description: '큐에서 ' + cv + '를 꺼냄 — 이웃이 <em>모두 이미 방문됨</em>. 중복 방문을 막기 위해 visited 체크를 하므로, 이 노드에서는 더 이상 퍼뜨릴 곳이 없습니다.',
                            action: function() { renderNodes(n, visited, cv, simQ.slice()); infoEl.innerHTML = cv + '의 이웃 모두 방문됨'; },
                            undo: function() { renderNodes(n, visited, null, []); infoEl.innerHTML = ''; }
                        });
                    })(v);
                }
            }
            // final step
            var infectedCount = Object.keys(simVis).length - 1;
            var infectedList = Object.keys(simVis).filter(function(k){return k!=='1';}).join(',');
            steps.push({ description: 'BFS 큐가 비었으므로 <strong>탐색 완료</strong> — 1번에서 도달 가능한 모든 컴퓨터를 방문했습니다. 감염된 컴퓨터 = <strong>' + infectedCount + '대</strong>',
                action: function() { queue = []; renderNodes(n, visited, null, []); infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.1rem;">\u2705 감염된 컴퓨터 = ' + infectedCount + '대 (' + infectedList + ')</strong>'; },
                undo: function() { renderNodes(n, visited, null, []); infoEl.innerHTML = ''; } });
            return steps;
        }
        function init() {
            var n = parseInt(container.querySelector('#gr-virus-n').value) || DEFAULT_N;
            var edges = parseEdges(container.querySelector('#gr-virus-edges').value);
            renderNodes(n, {}, null, []);
            infoEl.innerHTML = '';
            var steps = buildSteps(n, edges);
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#gr-virus-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // 시뮬레이션 2: DFS 오름차순 (boj-24479)
    // ====================================================================
    _renderVizDFS1: function(container) {
        var self = this, suffix = '-dfs1';
        var DEFAULT_N = 5, DEFAULT_START = 1, DEFAULT_EDGES = '1 4, 1 2, 2 3, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">DFS 오름차순 방문</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">오름차순 DFS 방문 순서를 기록합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-dfs1-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">시작: <input type="number" id="gr-dfs1-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">간선: <input type="text" id="gr-dfs1-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-dfs1-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return a-b;});
            return adj;
        }
        function renderNodes(n, ord, cur) {
            var nodes=[]; for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'+nodes.map(function(nd){
                var bg=ord[nd]?'var(--accent)':'var(--bg2)'; if(nd===cur) bg='var(--yellow)';
                return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;background:'+bg+';color:'+(ord[nd]?'white':'var(--text)')+';">'+
                '<div>'+nd+'</div><div style="font-size:0.7rem;">'+(ord[nd]?'order='+ord[nd]:'')+'</div></div>';
            }).join('')+'</div>';
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [], order = {}, cnt = 0;
            // DFS simulation
            var simOrder = {}, simCnt = 0, visitLog = [];
            function dfs(v, from) {
                simCnt++; simOrder[v] = simCnt;
                visitLog.push({ node: v, order: simCnt, from: from, neighbors: (adj[v]||[]).slice() });
                (adj[v]||[]).forEach(function(u) { if (!simOrder[u]) dfs(u, v); });
            }
            dfs(start, -1);
            visitLog.forEach(function(entry, idx) {
                (function(e, i) {
                    var desc;
                    if (e.from === -1) {
                        desc = '<strong>' + e.node + '번</strong>에서 DFS 시작 — 재귀 호출로 <em>갈 수 있는 가장 깊은 곳까지</em> 먼저 탐색합니다. order[' + e.node + ']=' + e.order;
                    } else {
                        desc = e.from + '의 이웃 중 <strong>오름차순</strong>으로 가장 작은 미방문 노드 <strong>' + e.node + '</strong>으로 깊이 진입 — DFS는 한 방향을 끝까지 파고들기 때문. order[' + e.node + ']=' + e.order;
                    }
                    steps.push({
                        description: desc,
                        action: function() { order[e.node] = e.order; renderNodes(n, order, e.node); infoEl.innerHTML = 'order[' + e.node + '] = ' + e.order; },
                        undo: function() { delete order[e.node]; var prev = i > 0 ? visitLog[i-1] : null; renderNodes(n, order, prev ? prev.node : null); infoEl.innerHTML = prev ? 'order[' + prev.node + '] = ' + prev.order : ''; }
                    });
                })(entry, idx);
            });
            // final
            var result = []; for (var i=1;i<=n;i++) result.push(simOrder[i]||0);
            steps.push({ description: '모든 재귀 호출이 끝나 <strong>탐색 완료</strong> — 오름차순 DFS이므로 작은 번호 이웃을 먼저 방문했습니다. 방문 순서: <strong>' + result.join(',') + '</strong>',
                action: function() { renderNodes(n, order, null); infoEl.innerHTML = '<strong style="color:var(--green);">\u2705 방문 순서: ' + result.join(',') + '</strong>'; },
                undo: function() { var last = visitLog[visitLog.length-1]; renderNodes(n, order, last.node); infoEl.innerHTML = 'order[' + last.node + '] = ' + last.order; } });
            return steps;
        }
        function init() {
            var n = parseInt(container.querySelector('#gr-dfs1-n').value)||DEFAULT_N;
            var start = parseInt(container.querySelector('#gr-dfs1-start').value)||DEFAULT_START;
            var edges = parseEdges(container.querySelector('#gr-dfs1-edges').value);
            renderNodes(n, {}, null); infoEl.innerHTML = '';
            self._initStepController(container, buildSteps(n, start, edges), suffix);
        }
        container.querySelector('#gr-dfs1-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // 시뮬레이션 3: DFS 내림차순 (boj-24480)
    // ====================================================================
    _renderVizDFS2: function(container) {
        var self = this, suffix = '-dfs2';
        var DEFAULT_N = 5, DEFAULT_START = 1, DEFAULT_EDGES = '1 4, 1 2, 2 3, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">DFS 내림차순 방문</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">내림차순 DFS 방문 순서를 기록합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-dfs2-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">시작: <input type="number" id="gr-dfs2-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">간선: <input type="text" id="gr-dfs2-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-dfs2-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return b-a;}); // descending
            return adj;
        }
        function renderNodes(n, ord, cur) {
            var nodes=[]; for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'+nodes.map(function(nd){
                var bg=ord[nd]?'#e17055':'var(--bg2)'; if(nd===cur) bg='var(--yellow)';
                return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;background:'+bg+';color:'+(ord[nd]?'white':'var(--text)')+';">'+
                '<div>'+nd+'</div><div style="font-size:0.7rem;">'+(ord[nd]?'order='+ord[nd]:'')+'</div></div>';
            }).join('')+'</div>';
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [], order = {};
            var simOrder = {}, simCnt = 0, visitLog = [];
            function dfs(v, from) {
                simCnt++; simOrder[v] = simCnt;
                visitLog.push({ node: v, order: simCnt, from: from });
                (adj[v]||[]).forEach(function(u) { if (!simOrder[u]) dfs(u, v); });
            }
            dfs(start, -1);
            visitLog.forEach(function(entry, idx) {
                (function(e, i) {
                    var desc;
                    if (e.from === -1) {
                        desc = '<strong>' + e.node + '번</strong>에서 DFS 시작 — 이번에는 이웃을 <em>내림차순</em>으로 방문합니다. 같은 그래프라도 방문 순서가 달라집니다. order[' + e.node + ']=' + e.order;
                    } else {
                        desc = e.from + '의 이웃 중 <strong>내림차순</strong>으로 가장 큰 미방문 노드 <strong>' + e.node + '</strong>으로 깊이 진입. order[' + e.node + ']=' + e.order;
                    }
                    steps.push({
                        description: desc,
                        action: function() { order[e.node] = e.order; renderNodes(n, order, e.node); infoEl.innerHTML = 'order[' + e.node + '] = ' + e.order; },
                        undo: function() { delete order[e.node]; var prev = i > 0 ? visitLog[i-1] : null; renderNodes(n, order, prev ? prev.node : null); infoEl.innerHTML = prev ? 'order[' + prev.node + '] = ' + prev.order : ''; }
                    });
                })(entry, idx);
            });
            var result = []; for (var i=1;i<=n;i++) result.push(simOrder[i]||0);
            steps.push({ description: '탐색 완료 — 내림차순이므로 큰 번호 이웃을 먼저 방문했습니다. 오름차순 DFS와 <em>방문 순서가 다른 것</em>을 비교해보세요! 결과: <strong>' + result.join(',') + '</strong>',
                action: function() { renderNodes(n, order, null); infoEl.innerHTML = '<strong style="color:var(--green);">\u2705 방문 순서: ' + result.join(',') + '</strong>'; },
                undo: function() { var last = visitLog[visitLog.length-1]; renderNodes(n, order, last.node); infoEl.innerHTML = 'order[' + last.node + '] = ' + last.order; } });
            return steps;
        }
        function init() {
            var n = parseInt(container.querySelector('#gr-dfs2-n').value)||DEFAULT_N;
            var start = parseInt(container.querySelector('#gr-dfs2-start').value)||DEFAULT_START;
            var edges = parseEdges(container.querySelector('#gr-dfs2-edges').value);
            renderNodes(n, {}, null); infoEl.innerHTML = '';
            self._initStepController(container, buildSteps(n, start, edges), suffix);
        }
        container.querySelector('#gr-dfs2-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // 시뮬레이션 4: BFS 오름차순 (boj-24444)
    // ====================================================================
    _renderVizBFS1: function(container) {
        var self = this, suffix = '-bfs1';
        var DEFAULT_N = 5, DEFAULT_START = 1, DEFAULT_EDGES = '1 4, 1 2, 2 3, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">BFS 오름차순 방문</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">오름차순 BFS 방문 순서를 기록합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-bfs1-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">시작: <input type="number" id="gr-bfs1-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">간선: <input type="text" id="gr-bfs1-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-bfs1-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return a-b;});
            return adj;
        }
        function renderNodes(n, ord, cur, q) {
            var nodes=[]; for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'+nodes.map(function(nd){
                var bg=ord[nd]?'#6c5ce7':'var(--bg2)'; if(nd===cur) bg='var(--yellow)';
                return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;background:'+bg+';color:'+(ord[nd]?'white':'var(--text)')+';">'+
                '<div>'+nd+'</div><div style="font-size:0.7rem;">'+(ord[nd]?'order='+ord[nd]:'')+'</div></div>';
            }).join('')+'</div>'+(q&&q.length?'<div style="margin-top:8px;font-size:0.85rem;color:var(--text2);">\uD050: ['+q.join(', ')+']</div>':'');
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [], order = {};
            // BFS simulation
            var simOrder = {}, simCnt = 0, simQ = [start], simVis = {};
            simVis[start] = true; simCnt++; simOrder[start] = simCnt;
            var bfsLog = [{ type: 'start', node: start, order: simCnt, queue: simQ.slice() }];
            while (simQ.length > 0) {
                var v = simQ.shift();
                var added = [];
                (adj[v]||[]).forEach(function(u) {
                    if (!simVis[u]) { simVis[u] = true; simCnt++; simOrder[u] = simCnt; simQ.push(u); added.push(u); }
                });
                bfsLog.push({ type: 'process', node: v, added: added, queue: simQ.slice() });
            }
            bfsLog.forEach(function(entry, idx) {
                (function(e, i) {
                    if (e.type === 'start') {
                        steps.push({ description: '<strong>' + e.node + '번</strong>에서 BFS 시작 — 큐에 넣고 방문 처리. BFS는 큐(FIFO)를 사용해 <em>가까운 노드부터 순서대로</em> 탐색합니다. order[' + e.node + ']=1',
                            action: function() { order[e.node] = 1; renderNodes(n, order, e.node, [e.node]); infoEl.innerHTML = 'order[' + e.node + '] = 1, 큐 = [' + e.node + ']'; },
                            undo: function() { order = {}; renderNodes(n, {}, null, []); infoEl.innerHTML = ''; } });
                    } else {
                        var addedDesc = e.added.length > 0 ? '미방문 이웃 <strong>' + e.added.join(', ') + '</strong>을 큐 뒤쪽에 추가 — 오름차순이므로 작은 번호부터' : '이웃이 모두 방문됨 — 중복 방문을 막아 무한 루프 방지';
                        steps.push({ description: '큐 맨 앞의 <strong>' + e.node + '</strong>을 꺼냄 (FIFO: 먼저 들어온 노드 먼저 처리) \u2192 ' + addedDesc,
                            action: function() { e.added.forEach(function(u) { order[u] = simOrder[u]; }); renderNodes(n, order, e.node, e.queue); infoEl.innerHTML = addedDesc + '. 큐 = [' + e.queue.join(', ') + ']'; },
                            undo: function() { e.added.forEach(function(u) { delete order[u]; }); renderNodes(n, order, null, []); infoEl.innerHTML = ''; } });
                    }
                })(entry, idx);
            });
            var result = []; for (var i=1;i<=n;i++) result.push(simOrder[i]||0);
            steps.push({ description: '큐가 비어 <strong>탐색 완료</strong> — BFS의 FIFO 특성 덕분에 거리 1인 노드 → 거리 2인 노드 → ... 순서로 방문했습니다. 결과: <strong>' + result.join(',') + '</strong>',
                action: function() { renderNodes(n, order, null, []); infoEl.innerHTML = '<strong style="color:var(--green);">\u2705 방문 순서: ' + result.join(',') + '</strong>'; },
                undo: function() { renderNodes(n, order, null, []); infoEl.innerHTML = ''; } });
            return steps;
        }
        function init() {
            var n = parseInt(container.querySelector('#gr-bfs1-n').value)||DEFAULT_N;
            var start = parseInt(container.querySelector('#gr-bfs1-start').value)||DEFAULT_START;
            var edges = parseEdges(container.querySelector('#gr-bfs1-edges').value);
            renderNodes(n, {}, null, []); infoEl.innerHTML = '';
            self._initStepController(container, buildSteps(n, start, edges), suffix);
        }
        container.querySelector('#gr-bfs1-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // 시뮬레이션 5: BFS 내림차순 (boj-24445)
    // ====================================================================
    _renderVizBFS2: function(container) {
        var self = this, suffix = '-bfs2';
        var DEFAULT_N = 5, DEFAULT_START = 1, DEFAULT_EDGES = '1 4, 1 2, 2 3, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">BFS 내림차순 방문</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">내림차순 BFS 방문 순서를 기록합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-bfs2-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">시작: <input type="number" id="gr-bfs2-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">간선: <input type="text" id="gr-bfs2-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-bfs2-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return b-a;}); // descending
            return adj;
        }
        function renderNodes(n, ord, cur, q) {
            var nodes=[]; for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'+nodes.map(function(nd){
                var bg=ord[nd]?'#fdcb6e':'var(--bg2)'; if(nd===cur) bg='var(--yellow)';
                return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;background:'+bg+';color:'+(ord[nd]?'#2d3436':'var(--text)')+';">'+
                '<div>'+nd+'</div><div style="font-size:0.7rem;">'+(ord[nd]?'order='+ord[nd]:'')+'</div></div>';
            }).join('')+'</div>'+(q&&q.length?'<div style="margin-top:8px;font-size:0.85rem;color:var(--text2);">\uD050: ['+q.join(', ')+']</div>':'');
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [], order = {};
            var simOrder = {}, simCnt = 0, simQ = [start], simVis = {};
            simVis[start] = true; simCnt++; simOrder[start] = simCnt;
            var bfsLog = [{ type: 'start', node: start, order: simCnt, queue: simQ.slice() }];
            while (simQ.length > 0) {
                var v = simQ.shift(); var added = [];
                (adj[v]||[]).forEach(function(u) { if (!simVis[u]) { simVis[u]=true; simCnt++; simOrder[u]=simCnt; simQ.push(u); added.push(u); } });
                bfsLog.push({ type:'process', node:v, added:added, queue:simQ.slice() });
            }
            bfsLog.forEach(function(entry) {
                (function(e) {
                    if (e.type==='start') {
                        steps.push({ description: '<strong>'+e.node+'번</strong>에서 BFS 시작 — 이번에는 이웃을 <em>내림차순</em>으로 탐색합니다. 큐에 넣는 순서가 달라지면 방문 순서도 달라집니다.',
                            action: function() { order[e.node]=1; renderNodes(n,order,e.node,[e.node]); infoEl.innerHTML='order['+e.node+'] = 1'; },
                            undo: function() { order={}; renderNodes(n,{},null,[]); infoEl.innerHTML=''; } });
                    } else {
                        var addedDesc = e.added.length>0 ? '미방문 이웃 <strong>'+e.added.join(', ')+'</strong>을 내림차순으로 큐에 추가' : '이웃 모두 방문됨 — 더 이상 퍼뜨릴 곳 없음';
                        steps.push({ description: '큐 맨 앞의 <strong>'+e.node+'</strong>을 꺼내 처리 (FIFO) \u2192 '+addedDesc,
                            action: function() { e.added.forEach(function(u){order[u]=simOrder[u];}); renderNodes(n,order,e.node,e.queue); infoEl.innerHTML=addedDesc; },
                            undo: function() { e.added.forEach(function(u){delete order[u];}); renderNodes(n,order,null,[]); infoEl.innerHTML=''; } });
                    }
                })(entry);
            });
            var result=[]; for(var i=1;i<=n;i++) result.push(simOrder[i]||0);
            steps.push({ description: '탐색 완료 — 오름차순 BFS와 비교하면 <em>방문 순서가 다릅니다</em>. 인접 리스트 정렬 순서가 BFS 결과에 영향을 줍니다. 결과: <strong>'+result.join(',')+'</strong>',
                action: function() { renderNodes(n,order,null,[]); infoEl.innerHTML='<strong style="color:var(--green);">\u2705 방문 순서: '+result.join(',')+'</strong>'; },
                undo: function() { renderNodes(n,order,null,[]); infoEl.innerHTML=''; } });
            return steps;
        }
        function init() {
            var n=parseInt(container.querySelector('#gr-bfs2-n').value)||DEFAULT_N;
            var start=parseInt(container.querySelector('#gr-bfs2-start').value)||DEFAULT_START;
            var edges=parseEdges(container.querySelector('#gr-bfs2-edges').value);
            renderNodes(n,{},null,[]); infoEl.innerHTML='';
            self._initStepController(container, buildSteps(n,start,edges), suffix);
        }
        container.querySelector('#gr-bfs2-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // 시뮬레이션 6: DFS와 BFS (boj-1260)
    // ====================================================================
    _renderVizDFSBFS: function(container) {
        var self = this, suffix = '-dfsbfs';
        var DEFAULT_N = 4, DEFAULT_START = 1, DEFAULT_EDGES = '1 2, 1 3, 1 4, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">DFS vs BFS 비교</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">DFS와 BFS 방문 순서를 비교합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-dfsbfs-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">시작: <input type="number" id="gr-dfsbfs-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">간선: <input type="text" id="gr-dfsbfs-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-dfsbfs-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return a-b;});
            return adj;
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [];
            // DFS
            var dfsResult = [], dfsVis = {};
            function dfs(v) { dfsVis[v]=true; dfsResult.push(v); (adj[v]||[]).forEach(function(u){if(!dfsVis[u]) dfs(u);}); }
            dfs(start);
            // BFS
            var bfsResult = [], bfsVis = {}, bfsQ = [start]; bfsVis[start]=true; bfsResult.push(start);
            while(bfsQ.length>0) { var v=bfsQ.shift(); (adj[v]||[]).forEach(function(u){if(!bfsVis[u]){bfsVis[u]=true;bfsResult.push(u);bfsQ.push(u);}}); }

            var dfsShown = [];
            dfsResult.forEach(function(node, idx) {
                (function(nd, i) {
                    steps.push({
                        description: 'DFS: ' + (i===0 ? '<strong>' + nd + '</strong>에서 출발 — 재귀/스택으로 <em>한 방향을 끝까지</em> 파고듭니다' : '→ <strong>' + nd + '</strong>로 깊이 진입 — 더 깊이 갈 곳이 있으면 계속 들어갑니다'),
                        action: function() { dfsShown = dfsResult.slice(0,i+1); areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsShown.join(' \u2192 '); infoEl.innerHTML = 'DFS 진행 중...'; },
                        undo: function() { dfsShown = dfsResult.slice(0,i); areaEl.innerHTML = i>0 ? '<strong>DFS:</strong> ' + dfsShown.join(' \u2192 ') : ''; infoEl.innerHTML = ''; }
                    });
                })(node, idx);
            });
            var bfsShown = [];
            bfsResult.forEach(function(node, idx) {
                (function(nd, i) {
                    steps.push({
                        description: 'BFS: ' + (i===0 ? '<strong>' + nd + '</strong>에서 출발 — 큐(FIFO)로 <em>같은 거리의 노드를 먼저</em> 모두 방문합니다' : '→ <strong>' + nd + '</strong> 방문 — 큐 순서대로 가까운 노드부터 처리하므로 DFS와 방문 순서가 다릅니다'),
                        action: function() { bfsShown = bfsResult.slice(0,i+1); areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsResult.join(' ') + '<br><strong>BFS:</strong> ' + bfsShown.join(' \u2192 '); infoEl.innerHTML = 'BFS 진행 중...'; },
                        undo: function() { bfsShown = bfsResult.slice(0,i); areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsResult.join(' \u2192 ') + (i>0?'<br><strong>BFS:</strong> '+bfsShown.join(' \u2192 '):''); infoEl.innerHTML = ''; }
                    });
                })(node, idx);
            });
            steps.push({ description: '<strong>비교 완료!</strong> DFS는 깊이 우선으로 한 경로를 끝까지 탐색한 반면, BFS는 거리 순서대로 넓게 퍼져나갔습니다. 같은 그래프에서 <em>탐색 순서가 다릅니다</em>.',
                action: function() { areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsResult.join(' ') + '<br><strong>BFS:</strong> ' + bfsResult.join(' '); infoEl.innerHTML = '<strong style="color:var(--green);">\u2705 DFS: ' + dfsResult.join(' ') + ' / BFS: ' + bfsResult.join(' ') + '</strong>'; },
                undo: function() { areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsResult.join(' ') + '<br><strong>BFS:</strong> ' + bfsResult.join(' \u2192 '); infoEl.innerHTML = ''; } });
            return steps;
        }
        function init() {
            var n=parseInt(container.querySelector('#gr-dfsbfs-n').value)||DEFAULT_N;
            var start=parseInt(container.querySelector('#gr-dfsbfs-start').value)||DEFAULT_START;
            var edges=parseEdges(container.querySelector('#gr-dfsbfs-edges').value);
            areaEl.innerHTML=''; infoEl.innerHTML='';
            self._initStepController(container, buildSteps(n,start,edges), suffix);
        }
        container.querySelector('#gr-dfsbfs-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // 시뮬레이션 7: 유기농 배추 (boj-1012)
    // ====================================================================
    _renderVizCabbage: function(container) {
        var self = this, suffix = '-cab';
        var DEFAULT_GRID = '1 1 0 0; 0 1 0 1; 0 0 0 1; 1 0 0 0';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">유기농 배추 — Flood Fill</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">배추 덩어리(연결 요소)를 세는 과정입니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자 (행은 ; 구분): <input type="text" id="gr-cab-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-cab-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseGrid(s) { return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);}); }
        var palette = ['var(--bg2)', '#d63031', '#0984e3', '#00b894', '#e17055', '#6c5ce7', '#fdcb6e', '#00cec9'];
        function renderGrid(grid, colors) {
            var cols = grid[0].length;
            areaEl.innerHTML = '<div style="display:inline-grid;grid-template-columns:repeat('+cols+',44px);gap:3px;">' + grid.map(function(row,r) {
                return row.map(function(v,c) {
                    var bg = colors[r][c] ? palette[colors[r][c] % palette.length] : (v ? '#dfe6e9' : 'var(--bg2)');
                    return '<div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;background:'+bg+';color:'+(colors[r][c]?'white':'var(--text3)')+';">'+(v?'\uD83E\uDD66':'')+'</div>';
                }).join('');
            }).join('') + '</div>';
        }
        function buildSteps(grid) {
            var R = grid.length, C = grid[0].length;
            var vis = [], colors = [];
            for (var r=0;r<R;r++) { vis.push([]); colors.push([]); for(var c=0;c<C;c++) { vis[r].push(false); colors[r].push(0); } }
            var dx=[0,0,1,-1], dy=[1,-1,0,0], steps=[], groupId=0;
            for (var r=0;r<R;r++) for(var c=0;c<C;c++) {
                if (grid[r][c]===1 && !vis[r][c]) {
                    groupId++;
                    // BFS to find component
                    var q=[[r,c]], comp=[];
                    vis[r][c]=true;
                    while(q.length>0) { var cur=q.shift(); comp.push(cur); for(var d=0;d<4;d++){var nr=cur[0]+dx[d],nc=cur[1]+dy[d]; if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]===1&&!vis[nr][nc]){vis[nr][nc]=true;q.push([nr,nc]);}}}
                    (function(gid, cells) {
                        var cellStr = cells.map(function(p){return '('+p[0]+','+p[1]+')';}).join(',');
                        steps.push({
                            description: '('+cells[0][0]+','+cells[0][1]+')에서 <strong>아직 방문하지 않은 배추</strong> 발견 — 새로운 연결 요소이므로 BFS/DFS로 이어진 배추를 <em>모두 탐색</em>합니다. '+gid+'번 덩어리: <strong>'+cells.length+'칸</strong>. 하나의 지렁이가 이 덩어리를 담당합니다.',
                            action: function() { cells.forEach(function(p){colors[p[0]][p[1]]=gid;}); renderGrid(grid,colors); infoEl.innerHTML=gid+'번 덩어리: '+cellStr+' → '+cells.length+'칸'; },
                            undo: function() { cells.forEach(function(p){colors[p[0]][p[1]]=0;}); renderGrid(grid,colors); infoEl.innerHTML=''; }
                        });
                    })(groupId, comp);
                }
            }
            var totalGroups = groupId;
            steps.push({ description: '격자 전체를 순회했으므로 <strong>탐색 완료</strong> — 연결 요소 하나 = 지렁이 하나이므로, 총 <strong>'+totalGroups+'마리</strong>가 필요합니다.',
                action: function() { renderGrid(grid,colors); infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 필요한 지렁이 = '+totalGroups+'마리</strong>'; },
                undo: function() { renderGrid(grid,colors); infoEl.innerHTML=''; } });
            return steps;
        }
        function init() {
            var grid = parseGrid(container.querySelector('#gr-cab-grid').value);
            var emptyColors = grid.map(function(row){return row.map(function(){return 0;});});
            renderGrid(grid, emptyColors); infoEl.innerHTML='';
            self._initStepController(container, buildSteps(grid), suffix);
        }
        container.querySelector('#gr-cab-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // 시뮬레이션 8: 단지번호붙이기 (boj-2667)
    // ====================================================================
    _renderVizComplex: function(container) {
        var self = this, suffix = '-cpx';
        var DEFAULT_GRID = '0 1 1 0 1 0 0; 0 1 1 0 1 0 1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">단지번호 붙이기</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">연결 요소의 개수와 각 크기를 구합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자 (행은 ; 구분): <input type="text" id="gr-cpx-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-cpx-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        function parseGrid(s) { return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);}); }
        var palette = ['var(--bg2)', '#0984e3', '#d63031', '#00b894', '#e17055', '#6c5ce7', '#fdcb6e'];
        function renderGrid(grid, colors) {
            var cols=grid[0].length;
            areaEl.innerHTML='<div style="display:inline-grid;grid-template-columns:repeat('+cols+',40px);gap:2px;">'+grid.map(function(row,r){
                return row.map(function(v,c){
                    var bg=colors[r][c]?palette[colors[r][c]%palette.length]:(v?'#dfe6e9':'var(--bg2)');
                    return '<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:5px;font-weight:600;font-size:0.85rem;background:'+bg+';color:'+(colors[r][c]?'white':'var(--text3)')+';">'+(v?v:'')+'</div>';
                }).join('');
            }).join('')+'</div>';
        }
        function buildSteps(grid) {
            var R=grid.length, C=grid[0].length, vis=[], colors=[];
            for(var r=0;r<R;r++){vis.push([]);colors.push([]);for(var c=0;c<C;c++){vis[r].push(false);colors[r].push(0);}}
            var dx=[0,0,1,-1],dy=[1,-1,0,0],steps=[],groupId=0,sizes=[];
            for(var r=0;r<R;r++) for(var c=0;c<C;c++){
                if(grid[r][c]===1&&!vis[r][c]){
                    groupId++;
                    var q=[[r,c]],comp=[];vis[r][c]=true;
                    while(q.length>0){var cur=q.shift();comp.push(cur);for(var d=0;d<4;d++){var nr=cur[0]+dx[d],nc=cur[1]+dy[d];if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]===1&&!vis[nr][nc]){vis[nr][nc]=true;q.push([nr,nc]);}}}
                    sizes.push(comp.length);
                    (function(gid,cells){
                        steps.push({
                            description:'('+cells[0][0]+','+cells[0][1]+')에서 <strong>미방문 집</strong> 발견 — 상하좌우로 이어진 집을 BFS로 모두 탐색하면 하나의 단지가 됩니다. '+gid+'번 단지: <strong>'+cells.length+'칸</strong>',
                            action:function(){cells.forEach(function(p){colors[p[0]][p[1]]=gid;});renderGrid(grid,colors);infoEl.innerHTML=gid+'번 단지: '+cells.length+'칸';},
                            undo:function(){cells.forEach(function(p){colors[p[0]][p[1]]=0;});renderGrid(grid,colors);infoEl.innerHTML='';}
                        });
                    })(groupId,comp);
                }
            }
            var sortedSizes=sizes.slice().sort(function(a,b){return a-b;});
            steps.push({description:'격자 순회 완료 — 연결 요소 = 단지이므로 <strong>'+groupId+'개 단지</strong>. 크기를 오름차순 정렬하면: <strong>'+sortedSizes.join(', ')+'</strong>',
                action:function(){renderGrid(grid,colors);infoEl.innerHTML='<strong style="color:var(--green);">\u2705 단지 수: '+groupId+' / 크기(오름차순): '+sortedSizes.join(', ')+'</strong>';},
                undo:function(){renderGrid(grid,colors);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var grid=parseGrid(container.querySelector('#gr-cpx-grid').value);
            var emptyColors=grid.map(function(row){return row.map(function(){return 0;});});
            renderGrid(grid,emptyColors);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(grid),suffix);
        }
        container.querySelector('#gr-cpx-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // 시뮬레이션 9: 미로 탐색 (boj-2178)
    // ====================================================================
    _renderVizMaze: function(container) {
        var self = this, suffix = '-maze';
        var DEFAULT_GRID = '1 0 1 1; 1 1 1 0; 0 1 0 1; 0 1 1 1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">미로 탐색 — BFS 최단 거리</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">(0,0)에서 (N-1,M-1)까지 BFS 최단 경로를 구합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자 (1=길, 0=벽; 행은 ; 구분): <input type="text" id="gr-maze-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-maze-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        function parseGrid(s){return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);});}
        function renderMaze(maze, dist){
            var C=maze[0].length;
            areaEl.innerHTML='<div style="display:inline-grid;grid-template-columns:repeat('+C+',48px);gap:3px;">'+maze.map(function(row,r){
                return row.map(function(v,c){
                    var bg=v===0?'#2d3436':(dist[r][c]>=0?'#e84393':'#dfe6e9');
                    return '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;font-size:0.85rem;background:'+bg+';color:'+(dist[r][c]>=0?'white':(v===0?'#636e72':'var(--text)'))+';">'+(dist[r][c]>=0?dist[r][c]:(v===0?'\u2588':'\u00B7'))+'</div>';
                }).join('');
            }).join('')+'</div>';
        }
        function buildSteps(maze){
            var R=maze.length, C=maze[0].length, dist=[];
            for(var r=0;r<R;r++){dist.push([]);for(var c=0;c<C;c++) dist[r].push(-1);}
            var dx=[0,0,1,-1],dy=[1,-1,0,0],steps=[];
            // BFS simulation level by level
            dist[0][0]=1;
            var q=[[0,0]], level=1;
            var bfsLevels=[[{r:0,c:0,d:1}]];
            while(q.length>0){
                var nextQ=[], nextLevel=[];
                q.forEach(function(pos){
                    for(var d=0;d<4;d++){
                        var nr=pos[0]+dx[d],nc=pos[1]+dy[d];
                        if(nr>=0&&nr<R&&nc>=0&&nc<C&&maze[nr][nc]===1&&dist[nr][nc]<0){
                            dist[nr][nc]=dist[pos[0]][pos[1]]+1;
                            nextQ.push([nr,nc]);
                            nextLevel.push({r:nr,c:nc,d:dist[nr][nc]});
                        }
                    }
                });
                if(nextLevel.length>0) bfsLevels.push(nextLevel);
                q=nextQ;
            }
            var finalDist=dist[R-1][C-1];
            // reset dist for step-by-step
            for(var r=0;r<R;r++) for(var c=0;c<C;c++) dist[r][c]=-1;

            bfsLevels.forEach(function(levelCells, li){
                (function(cells,idx){
                    var cellsStr=cells.map(function(p){return '('+p.r+','+p.c+')='+p.d;}).join(', ');
                    steps.push({
                        description: idx===0?'(0,0)에서 BFS 시작 — BFS는 <em>가까운 칸부터</em> 탐색하므로 처음 도착한 거리가 곧 최단 거리가 됩니다. dist=1':'<strong>거리 '+idx+'</strong>인 칸들을 확장: '+cellsStr+' — 이전 레벨에서 상하좌우로 한 칸 이동 가능한 미방문 길을 모두 발견합니다.',
                        action:function(){cells.forEach(function(p){dist[p.r][p.c]=p.d;});renderMaze(maze,dist);infoEl.innerHTML=cellsStr;},
                        undo:function(){cells.forEach(function(p){dist[p.r][p.c]=-1;});renderMaze(maze,dist);infoEl.innerHTML='';}
                    });
                })(levelCells,li);
            });
            steps.push({description:'BFS 탐색 완료 — <strong>(0,0)→('+(R-1)+','+(C-1)+')</strong> 최단 거리 = <strong>'+(finalDist>=0?finalDist+'칸':'도달 불가')+'</strong>. BFS는 레벨별로 확장하므로 가장 먼저 도착한 경로가 최단입니다.',
                action:function(){renderMaze(maze,dist);infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 최단 거리 = '+(finalDist>=0?finalDist+'칸':'도달 불가')+'</strong>';},
                undo:function(){renderMaze(maze,dist);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var maze=parseGrid(container.querySelector('#gr-maze-grid').value);
            var emptyDist=maze.map(function(row){return row.map(function(){return -1;});});
            renderMaze(maze,emptyDist);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(maze),suffix);
        }
        container.querySelector('#gr-maze-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // 시뮬레이션 10: 숨바꼭질 (boj-1697)
    // ====================================================================
    _renderVizHide: function(container) {
        var self = this, suffix = '-hide';
        var DEFAULT_N = 5, DEFAULT_K = 17;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">숨바꼭질 — 좌표 BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">N에서 K까지 (X-1, X+1, 2*X) 이동합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (시작): <input type="number" id="gr-hide-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">K (목표): <input type="number" id="gr-hide-k" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="gr-hide-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function buildSteps(startN, targetK) {
            // BFS to find shortest path then trace back
            var MAX = Math.max(startN, targetK) * 2 + 5;
            if (MAX > 200001) MAX = 200001;
            var dist = new Array(MAX); for(var i=0;i<MAX;i++) dist[i]=-1;
            var prev = new Array(MAX); for(var i=0;i<MAX;i++) prev[i]=-1;
            dist[startN]=0;
            var q=[startN];
            while(q.length>0){
                var v=q.shift();
                if(v===targetK) break;
                var nexts=[v-1,v+1,v*2];
                nexts.forEach(function(nv){
                    if(nv>=0&&nv<MAX&&dist[nv]<0){dist[nv]=dist[v]+1;prev[nv]=v;q.push(nv);}
                });
            }
            // trace path
            var path=[];
            if(dist[targetK]>=0){
                var cur=targetK; while(cur!==-1){path.unshift(cur);cur=prev[cur];}
            } else {
                path=[startN];
            }
            var steps=[], shown=[];
            path.forEach(function(node, idx){
                (function(nd,i){
                    var desc;
                    if(i===0) desc='위치 <strong>'+nd+'</strong>에서 시작 — X-1, X+1, 2*X 세 가지 이동을 BFS로 탐색하면 <em>최소 이동 횟수</em>를 보장합니다.';
                    else {
                        var prevNode=path[i-1];
                        if(nd===prevNode*2) desc=prevNode+'\u00D72=<strong>'+nd+'</strong>으로 순간이동 ('+i+'초) — 곱하기가 더 빠르게 접근할 수 있어 BFS가 이 경로를 선택했습니다.';
                        else if(nd===prevNode+1) desc=prevNode+'+1=<strong>'+nd+'</strong>으로 한 칸 전진 ('+i+'초) — 이 시점에서 +1이 최단 경로의 일부입니다.';
                        else desc=prevNode+'-1=<strong>'+nd+'</strong>으로 한 칸 후퇴 ('+i+'초) — 순간이동을 위해 뒤로 갔다가 2배 점프하는 것이 더 빠를 수 있습니다.';
                    }
                    steps.push({
                        description:desc,
                        action:function(){ shown=path.slice(0,i+1); areaEl.innerHTML=shown.map(function(p,j){return j===shown.length-1?'<strong>'+p+'</strong>':p;}).join(' \u2192 '); infoEl.innerHTML='dist['+nd+'] = '+i; },
                        undo:function(){ shown=path.slice(0,i); areaEl.innerHTML=shown.length>0?shown.map(function(p,j){return j===shown.length-1?'<strong>'+p+'</strong>':p;}).join(' \u2192 '):''; infoEl.innerHTML=i>0?'dist['+path[i-1]+'] = '+(i-1):''; }
                    });
                })(node,idx);
            });
            if(dist[targetK]>=0){
                steps.push({description:'<strong>목표 도착!</strong> BFS는 모든 이동을 비용 1로 취급하므로, 처음 도달한 경로가 곧 <em>최단 경로</em>입니다. 최소 시간 = <strong>'+dist[targetK]+'초</strong>',
                    action:function(){areaEl.innerHTML=path.join(' \u2192 ');infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 최소 시간 = '+dist[targetK]+'초</strong>';},
                    undo:function(){areaEl.innerHTML=path.map(function(p,j){return j===path.length-1?'<strong>'+p+'</strong>':p;}).join(' \u2192 ');infoEl.innerHTML='';}});
            }
            return steps;
        }
        function init(){
            var n=parseInt(container.querySelector('#gr-hide-n').value); if(isNaN(n)) n=DEFAULT_N;
            var k=parseInt(container.querySelector('#gr-hide-k').value); if(isNaN(k)) k=DEFAULT_K;
            areaEl.innerHTML='';infoEl.innerHTML='';
            self._initStepController(container,buildSteps(n,k),suffix);
        }
        container.querySelector('#gr-hide-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // 시뮬레이션 11: 나이트의 이동 (boj-7562)
    // ====================================================================
    _renderVizKnight: function(container) {
        var self = this, suffix = '-knight';
        var DEFAULT_SIZE = 8, DEFAULT_SR = 0, DEFAULT_SC = 0, DEFAULT_ER = 7, DEFAULT_EC = 0;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">나이트의 이동 — BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">체스판에서 나이트 이동 최소 횟수를 구합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">크기: <input type="number" id="gr-knight-size" value="' + DEFAULT_SIZE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">시작(r,c): <input type="text" id="gr-knight-start" value="' + DEFAULT_SR + ',' + DEFAULT_SC + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">목표(r,c): <input type="text" id="gr-knight-end" value="' + DEFAULT_ER + ',' + DEFAULT_EC + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="gr-knight-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        var kdr=[-2,-2,-1,-1,1,1,2,2],kdc=[-1,1,-2,2,-2,2,-1,1];

        function buildSteps(sz, sr, sc, er, ec) {
            var dist=[]; for(var r=0;r<sz;r++){dist.push([]);for(var c=0;c<sz;c++) dist[r].push(-1);}
            var prev=[]; for(var r=0;r<sz;r++){prev.push([]);for(var c=0;c<sz;c++) prev[r].push(null);}
            dist[sr][sc]=0;
            var q=[[sr,sc]];
            // BFS level by level
            var levels=[[{r:sr,c:sc}]];
            var found=false;
            while(q.length>0&&!found){
                var nextQ=[],nextLevel=[];
                q.forEach(function(pos){
                    for(var d=0;d<8;d++){
                        var nr=pos[0]+kdr[d],nc=pos[1]+kdc[d];
                        if(nr>=0&&nr<sz&&nc>=0&&nc<sz&&dist[nr][nc]<0){
                            dist[nr][nc]=dist[pos[0]][pos[1]]+1;
                            prev[nr][nc]=[pos[0],pos[1]];
                            nextQ.push([nr,nc]);
                            nextLevel.push({r:nr,c:nc});
                            if(nr===er&&nc===ec) found=true;
                        }
                    }
                });
                if(nextLevel.length>0) levels.push(nextLevel);
                q=nextQ;
            }
            var finalDist=dist[er][ec];
            var steps=[];
            // Show level by level (but max ~6 levels to keep concise)
            var maxLevels = Math.min(levels.length, finalDist >= 0 ? finalDist + 2 : levels.length);
            for(var li=0;li<maxLevels;li++){
                (function(levelIdx, cells){
                    var cellsStr = cells.length<=6 ? cells.map(function(p){return '('+p.r+','+p.c+')';}).join(', ') : cells.length+'개 위치';
                    steps.push({
                        description: levelIdx===0 ? '('+sr+','+sc+')에서 시작 — 나이트는 L자로 8방향 이동 가능. BFS로 탐색하면 <em>이동 횟수가 적은 칸부터</em> 발견하므로 최소 이동 횟수를 보장합니다.' : '<strong>'+levelIdx+'번째 이동</strong>으로 도달할 수 있는 위치: '+cellsStr+' — 이전 레벨의 모든 위치에서 L자 8방향을 시도한 미방문 칸들입니다.',
                        action: function() { areaEl.innerHTML = levelIdx+'번 이동: '+cellsStr; infoEl.innerHTML = 'dist='+levelIdx+' 위치 '+cells.length+'개'; },
                        undo: function() { areaEl.innerHTML = ''; infoEl.innerHTML = ''; }
                    });
                })(li, levels[li]);
            }
            steps.push({description: finalDist>=0 ? 'BFS 완료 — <strong>'+finalDist+'번 이동</strong>으로 ('+er+','+ec+') 도달! BFS가 보장하는 최단 이동 횟수입니다.' : '('+er+','+ec+')에 <strong>도달 불가</strong> — 나이트의 L자 이동으로는 해당 위치에 갈 수 없습니다.',
                action: function() { areaEl.innerHTML = '('+sr+','+sc+') \u2192 ('+er+','+ec+')<br><strong>'+finalDist+'번 이동</strong>'; infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.1rem;">\u2705 최소 이동 = '+finalDist+'번</strong>'; },
                undo: function() { areaEl.innerHTML = ''; infoEl.innerHTML = ''; }});
            return steps;
        }
        function init(){
            var sz=parseInt(container.querySelector('#gr-knight-size').value)||DEFAULT_SIZE;
            var sp=container.querySelector('#gr-knight-start').value.split(',').map(Number);
            var ep=container.querySelector('#gr-knight-end').value.split(',').map(Number);
            var sr=sp[0]||0,sc=sp[1]||0,er=ep[0]||0,ec=ep[1]||0;
            areaEl.innerHTML='';infoEl.innerHTML='';
            self._initStepController(container,buildSteps(sz,sr,sc,er,ec),suffix);
        }
        container.querySelector('#gr-knight-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // 시뮬레이션 12: 토마토 (boj-7576)
    // ====================================================================
    _renderVizTomato: function(container) {
        var self = this, suffix = '-tom';
        var DEFAULT_GRID = '0 0 0 1; 0 -1 0 0; 0 0 0 0; 1 0 0 0';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">토마토 — 다중 시작점 BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">1=익은, 0=안익은, -1=빈칸. 익은 토마토에서 동시에 BFS.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자 (행은 ; 구분): <input type="text" id="gr-tom-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-tom-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        function parseGrid(s){return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);});}
        function renderTomato(grid, dist){
            var C=grid[0].length;
            areaEl.innerHTML='<div style="display:inline-grid;grid-template-columns:repeat('+C+',48px);gap:3px;">'+grid.map(function(row,r){
                return row.map(function(v,c){
                    var bg=v===-1?'#2d3436':(dist[r][c]>=0?'#a29bfe':'#dfe6e9');
                    var txt=v===-1?'X':(dist[r][c]>=0?dist[r][c]:'\uD83C\uDF45');
                    return '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;font-size:0.85rem;background:'+bg+';color:'+(dist[r][c]>=0?'white':(v===-1?'#636e72':'var(--text)'))+';">'+txt+'</div>';
                }).join('');
            }).join('')+'</div>';
        }
        function buildSteps(grid){
            var R=grid.length,C=grid[0].length,dist=[],dx=[0,0,1,-1],dy=[1,-1,0,0];
            for(var r=0;r<R;r++){dist.push([]);for(var c=0;c<C;c++) dist[r].push(-1);}
            var q=[];
            for(var r=0;r<R;r++) for(var c=0;c<C;c++) if(grid[r][c]===1){dist[r][c]=0;q.push([r,c]);}
            // BFS level by level
            var levels=[q.map(function(p){return {r:p[0],c:p[1]};})];
            while(q.length>0){
                var nextQ=[],nextLevel=[];
                q.forEach(function(pos){
                    for(var d=0;d<4;d++){var nr=pos[0]+dx[d],nc=pos[1]+dy[d];
                        if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]===0&&dist[nr][nc]<0){dist[nr][nc]=dist[pos[0]][pos[1]]+1;nextQ.push([nr,nc]);nextLevel.push({r:nr,c:nc,d:dist[nr][nc],pr:pos[0],pc:pos[1]});}}
                });
                if(nextLevel.length>0) levels.push(nextLevel);
                q=nextQ;
            }
            var maxDist=0,impossible=false;
            for(var r=0;r<R;r++) for(var c=0;c<C;c++){if(grid[r][c]===0&&dist[r][c]<0) impossible=true; if(dist[r][c]>maxDist) maxDist=dist[r][c];}
            // reset dist for step-by-step
            for(var r=0;r<R;r++) for(var c=0;c<C;c++) dist[r][c]=-1;
            var steps=[];
            // level 0: initial ripe tomatoes
            var initCells=levels[0];
            steps.push({
                description:'<strong>다중 시작점 BFS</strong> — 이미 익은 토마토 <strong>'+initCells.length+'개</strong>를 모두 큐에 넣어 <em>동시에</em> 퍼뜨리기 시작합니다. 시작점이 여러 개여도 BFS 하나로 해결됩니다.',
                action:function(){initCells.forEach(function(p){dist[p.r][p.c]=0;});renderTomato(grid,dist);infoEl.innerHTML='시작점 '+initCells.length+'개';},
                undo:function(){initCells.forEach(function(p){dist[p.r][p.c]=-1;});renderTomato(grid,dist);infoEl.innerHTML='';}
            });
            // each subsequent cell individually
            for(var li=1;li<levels.length;li++){
                for(var ci=0;ci<levels[li].length;ci++){
                    (function(cell,levelIdx){
                        var desc='<strong>'+levelIdx+'일째</strong>: ('+cell.r+','+cell.c+')가 인접한 ('+cell.pr+','+cell.pc+')에서 익음 — 상하좌우로 하루에 한 칸씩 전파되므로 BFS 레벨 = 경과 일수입니다.';
                        steps.push({
                            description:desc,
                            action:function(){dist[cell.r][cell.c]=cell.d;renderTomato(grid,dist);infoEl.innerHTML=desc;},
                            undo:function(){dist[cell.r][cell.c]=-1;renderTomato(grid,dist);infoEl.innerHTML='';}
                        });
                    })(levels[li][ci],li);
                }
            }
            steps.push({description:impossible?'BFS가 끝났는데 <strong>안 익은 토마토가 남아있음</strong> — 벽(-1)으로 막혀 전파가 불가능한 칸이 있으므로 답은 <strong>-1</strong>':'BFS 완료! 마지막으로 익은 토마토의 거리가 답 — 모든 토마토 익는 <strong>최소 일수 = '+maxDist+'</strong>',
                action:function(){renderTomato(grid,dist);infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 '+(impossible?'결과 = -1 (불가능)':'최소 일수 = '+maxDist)+'</strong>';},
                undo:function(){renderTomato(grid,dist);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var grid=parseGrid(container.querySelector('#gr-tom-grid').value);
            var emptyDist=grid.map(function(row){return row.map(function(){return -1;});});
            renderTomato(grid,emptyDist);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(grid),suffix);
        }
        container.querySelector('#gr-tom-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // 시뮬레이션 13: 토마토 3D (boj-7569)
    // ====================================================================
    _renderVizTomato3: function(container) {
        var self = this, suffix = '-tom3';
        var DEFAULT_LAYERS = '0 0 0, 0 0 0 | 0 0 1, 0 0 0';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">토마토 3D — 6방향 BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">층은 | 구분, 행은 , 구분. 6방향(상하좌우+위아래).</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">3D 격자: <input type="text" id="gr-tom3-layers" value="' + DEFAULT_LAYERS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
            '<button class="btn btn-primary" id="gr-tom3-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseLayers(s){
            return s.split('|').map(function(layer){
                return layer.trim().split(',').map(function(row){return row.trim().split(/\s+/).map(Number);});
            });
        }
        function render3D(layers, dist){
            var html='';
            layers.forEach(function(layer,h){
                var C=layer[0].length;
                html+='<div style="margin-bottom:8px;"><strong style="font-size:0.8rem;color:var(--text3);">'+(h+1)+'층</strong><div style="display:inline-grid;grid-template-columns:repeat('+C+',36px);gap:2px;margin-top:4px;">';
                layer.forEach(function(row,r){
                    row.forEach(function(v,c){
                        var bg=v===-1?'#2d3436':(dist[h][r][c]>=0?'#55efc4':'#dfe6e9');
                        var txt=v===-1?'X':(dist[h][r][c]>=0?dist[h][r][c]:(v===1?'1':'\u00B7'));
                        html+='<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:5px;font-weight:600;font-size:0.75rem;background:'+bg+';color:'+(dist[h][r][c]>=0?'#2d3436':(v===-1?'#636e72':'var(--text)'))+';">'+txt+'</div>';
                    });
                });
                html+='</div></div>';
            });
            areaEl.innerHTML=html;
        }
        function buildSteps(layers){
            var H=layers.length, R=layers[0].length, C=layers[0][0].length;
            var dist=[]; for(var h=0;h<H;h++){dist.push([]);for(var r=0;r<R;r++){dist[h].push([]);for(var c=0;c<C;c++) dist[h][r].push(-1);}}
            var dh=[0,0,0,0,1,-1],dr=[0,0,1,-1,0,0],dc=[1,-1,0,0,0,0];
            var q=[];
            for(var h=0;h<H;h++) for(var r=0;r<R;r++) for(var c=0;c<C;c++) if(layers[h][r][c]===1){dist[h][r][c]=0;q.push([h,r,c]);}
            var levels=[q.map(function(p){return {h:p[0],r:p[1],c:p[2]};})];
            while(q.length>0){
                var nextQ=[],nextLevel=[];
                q.forEach(function(pos){
                    for(var d=0;d<6;d++){var nh=pos[0]+dh[d],nr=pos[1]+dr[d],nc=pos[2]+dc[d];
                        if(nh>=0&&nh<H&&nr>=0&&nr<R&&nc>=0&&nc<C&&layers[nh][nr][nc]===0&&dist[nh][nr][nc]<0){
                            dist[nh][nr][nc]=dist[pos[0]][pos[1]][pos[2]]+1;nextQ.push([nh,nr,nc]);nextLevel.push({h:nh,r:nr,c:nc,d:dist[nh][nr][nc],ph:pos[0],pr:pos[1],pc:pos[2]});}}
                });
                if(nextLevel.length>0) levels.push(nextLevel);
                q=nextQ;
            }
            var maxDist=0,impossible=false;
            for(var h=0;h<H;h++) for(var r=0;r<R;r++) for(var c=0;c<C;c++){if(layers[h][r][c]===0&&dist[h][r][c]<0) impossible=true; if(dist[h][r][c]>maxDist) maxDist=dist[h][r][c];}
            // reset for step-by-step
            for(var h=0;h<H;h++) for(var r=0;r<R;r++) for(var c=0;c<C;c++) dist[h][r][c]=-1;
            var steps=[];
            // level 0: initial ripe tomatoes
            var initCells3=levels[0];
            steps.push({
                description:'<strong>3D 다중 시작점 BFS</strong> — 익은 토마토 <strong>'+initCells3.length+'개</strong>를 큐에 넣습니다. 2D와 같은 원리이지만 위/아래 층도 포함해 <em>6방향</em>으로 전파합니다.',
                action:function(){initCells3.forEach(function(p){dist[p.h][p.r][p.c]=0;});render3D(layers,dist);infoEl.innerHTML='시작점 '+initCells3.length+'개';},
                undo:function(){initCells3.forEach(function(p){dist[p.h][p.r][p.c]=-1;});render3D(layers,dist);infoEl.innerHTML='';}
            });
            // each subsequent cell individually
            for(var li=1;li<levels.length;li++){
                for(var ci=0;ci<levels[li].length;ci++){
                    (function(cell,levelIdx){
                        var desc='<strong>'+levelIdx+'일째</strong>: '+cell.h+'층('+cell.r+','+cell.c+')가 '+cell.ph+'층('+cell.pr+','+cell.pc+')에서 익음 — '+(cell.h!==cell.ph?'위/아래 층 간 전파 (6방향 중 상하)':'같은 층 내 상하좌우 전파');
                        steps.push({
                            description:desc,
                            action:function(){dist[cell.h][cell.r][cell.c]=cell.d;render3D(layers,dist);infoEl.innerHTML=desc;},
                            undo:function(){dist[cell.h][cell.r][cell.c]=-1;render3D(layers,dist);infoEl.innerHTML='';}
                        });
                    })(levels[li][ci],li);
                }
            }
            steps.push({description:impossible?'<strong>전파 불가능한 토마토 존재</strong> — 6방향으로도 도달할 수 없는 칸이 있으므로 답은 <strong>-1</strong>':'3D BFS 완료! 6방향 전파의 최대 거리가 답 — <strong>최소 일수 = '+maxDist+'</strong>',
                action:function(){render3D(layers,dist);infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 '+(impossible?'결과 = -1':'3D BFS 최소 일수 = '+maxDist)+'</strong>';},
                undo:function(){render3D(layers,dist);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var layers=parseLayers(container.querySelector('#gr-tom3-layers').value);
            var emptyDist=layers.map(function(l){return l.map(function(r){return r.map(function(){return -1;});});});
            render3D(layers,emptyDist);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(layers),suffix);
        }
        container.querySelector('#gr-tom3-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // 시뮬레이션 14: 뱀과 사다리 (boj-16928)
    // ====================================================================
    _renderVizSnake: function(container) {
        var self = this, suffix = '-snake';
        var DEFAULT_LADDERS = '12 98, 32 62, 42 68';
        var DEFAULT_SNAKES = '95 13, 97 25, 93 37';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">뱀과 사다리 게임 — BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">1번→100번 칸까지 최소 주사위 횟수를 BFS로 구합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">사다리 (a b, ...): <input type="text" id="gr-snake-ladders" value="' + DEFAULT_LADDERS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<label style="font-weight:600;">뱀 (a b, ...): <input type="text" id="gr-snake-snakes" value="' + DEFAULT_SNAKES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<button class="btn btn-primary" id="gr-snake-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parsePairs(s){return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);});}
        function buildSteps(ladders, snakes){
            var warp={};
            ladders.forEach(function(p){warp[p[0]]=p[1];});
            snakes.forEach(function(p){warp[p[0]]=p[1];});
            // BFS
            var dist=new Array(101); for(var i=0;i<=100;i++) dist[i]=-1;
            var prev=new Array(101); for(var i=0;i<=100;i++) prev[i]=-1;
            var warpUsed=new Array(101); for(var i=0;i<=100;i++) warpUsed[i]=null;
            dist[1]=0; var q=[1];
            while(q.length>0){
                var v=q.shift(); if(v===100) break;
                for(var dice=1;dice<=6;dice++){
                    var nv=v+dice; if(nv>100) continue;
                    var actual=warp[nv]!==undefined?warp[nv]:nv;
                    if(dist[actual]<0){dist[actual]=dist[v]+1;prev[actual]=v;if(warp[nv]!==undefined) warpUsed[actual]=nv;q.push(actual);}
                }
            }
            // trace path
            var path=[]; var cur=100;
            while(cur!==-1){path.unshift(cur);cur=prev[cur];}
            if(path[0]!==1) path=[1]; // no path found

            var steps=[], shown=[];
            var ladderSummary=ladders.map(function(p){return p[0]+'\u2192'+p[1];}).join(', ');
            var snakeSummary=snakes.map(function(p){return p[0]+'\u2192'+p[1];}).join(', ');
            areaEl.innerHTML='\uD83E\uDE9C 사다리: '+ladderSummary+'<br>\uD83D\uDC0D 뱀: '+snakeSummary;

            path.forEach(function(node,idx){
                (function(nd,i){
                    var desc;
                    if(i===0) desc='<strong>1번 칸</strong>에서 시작 — 주사위 1~6을 BFS의 6가지 간선으로 모델링합니다. 사다리/뱀은 <em>자동 이동</em>이므로 같은 간선 비용(1회) 안에 포함됩니다.';
                    else {
                        var prevNode=path[i-1];
                        if(warpUsed[nd]!==null){
                            var wp=warpUsed[nd];
                            var isLadder=ladders.some(function(l){return l[0]===wp;});
                            desc='<strong>'+i+'회째</strong>: '+prevNode+' → '+wp+(isLadder?' → \uD83E\uDE9C사다리로 <strong>'+nd+'</strong>까지 점프! 사다리 덕분에 비용 없이 이동합니다.':' → \uD83D\uDC0D뱀에 물려 <strong>'+nd+'</strong>으로 후퇴! BFS는 이 상황도 고려하여 최적 경로를 찾습니다.');
                        } else {
                            desc='<strong>'+i+'회째</strong>: '+prevNode+' → <strong>'+nd+'</strong>으로 주사위 이동 — BFS가 찾은 최단 경로의 일부입니다.';
                        }
                    }
                    steps.push({
                        description:desc,
                        action:function(){shown=path.slice(0,i+1);areaEl.innerHTML=shown.map(function(p,j){return j===shown.length-1?'<strong>'+p+'</strong>':''+p;}).join(' \u2192 ');infoEl.innerHTML='dist['+nd+'] = '+i;},
                        undo:function(){shown=path.slice(0,i);areaEl.innerHTML=shown.length>0?shown.join(' \u2192 '):'\uD83E\uDE9C 사다리: '+ladderSummary+'<br>\uD83D\uDC0D 뱀: '+snakeSummary;infoEl.innerHTML='';}
                    });
                })(node,idx);
            });
            if(dist[100]>=0){
                steps.push({description:'<strong>100번 도착!</strong> BFS는 주사위 횟수를 비용으로 취급하므로 사다리/뱀을 고려한 <em>최소 주사위 횟수</em> = <strong>'+dist[100]+'회</strong>',
                    action:function(){areaEl.innerHTML=path.join(' \u2192 ')+' \uD83C\uDFC1';infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 최소 주사위 횟수 = '+dist[100]+'</strong>';},
                    undo:function(){areaEl.innerHTML=path.join(' \u2192 ');infoEl.innerHTML='';}});
            }
            return steps;
        }
        function init(){
            var ladders=parsePairs(container.querySelector('#gr-snake-ladders').value);
            var snakes=parsePairs(container.querySelector('#gr-snake-snakes').value);
            var ladderSummary=ladders.map(function(p){return p[0]+'\u2192'+p[1];}).join(', ');
            var snakeSummary=snakes.map(function(p){return p[0]+'\u2192'+p[1];}).join(', ');
            areaEl.innerHTML='\uD83E\uDE9C 사다리: '+ladderSummary+'<br>\uD83D\uDC0D 뱀: '+snakeSummary;
            infoEl.innerHTML='';
            self._initStepController(container,buildSteps(ladders,snakes),suffix);
        }
        container.querySelector('#gr-snake-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // 시뮬레이션 15: 이분 그래프 (boj-1707)
    // ====================================================================
    _renderVizBipartite: function(container) {
        var self = this, suffix = '-bip';
        var DEFAULT_N = 3, DEFAULT_EDGES = '1 3, 2 3';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">이분 그래프 판별 — 2-Coloring</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">인접 정점을 서로 다른 색으로 칠할 수 있는지 확인합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-bip-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">간선: <input type="text" id="gr-bip-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-bip-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s){return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);});}
        function buildAdj(n,edges){var adj={};for(var i=1;i<=n;i++) adj[i]=[];edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});return adj;}
        function renderBip(n, colors){
            var nodes=[];for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:8px;">'+nodes.map(function(nd){
                var bg=colors[nd]===0?'#636e72':(colors[nd]===1?'#d63031':'var(--bg2)');
                return '<div style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;background:'+bg+';color:'+(colors[nd]!==undefined?'white':'var(--text)')+';">'+nd+'</div>';
            }).join('')+'</div>';
        }
        function buildSteps(n, edges){
            var adj=buildAdj(n,edges), steps=[], colors={};
            // BFS 2-coloring
            var simColors={}, colorLog=[], isBipartite=true;
            for(var start=1;start<=n;start++){
                if(simColors[start]!==undefined) continue;
                simColors[start]=0;
                colorLog.push({node:start,color:0});
                var q=[start];
                while(q.length>0){
                    var v=q.shift();
                    (adj[v]||[]).forEach(function(u){
                        if(simColors[u]===undefined){
                            simColors[u]=1-simColors[v];
                            colorLog.push({node:u,color:simColors[u],from:v});
                            q.push(u);
                        } else if(simColors[u]===simColors[v]){
                            isBipartite=false;
                        }
                    });
                }
            }
            colorLog.forEach(function(entry,idx){
                (function(e,i){
                    var colorName=e.color===0?'0(회색)':'1(빨강)';
                    var desc=e.from?e.from+'의 이웃 <strong>'+e.node+'번</strong>을 <em>반대 색</em> '+colorName+'으로 칠합니다 — 이분 그래프라면 인접한 노드는 항상 다른 색이어야 하기 때문입니다.':'<strong>'+e.node+'번</strong>을 색 '+colorName+'으로 시작 — 아직 색이 없는 노드에서 BFS 2-coloring을 시작합니다.';
                    steps.push({
                        description:desc,
                        action:function(){colors[e.node]=e.color;renderBip(n,colors);infoEl.innerHTML='color['+e.node+'] = '+e.color+(e.from?' ('+e.from+'과 다른 색)':'');},
                        undo:function(){delete colors[e.node];renderBip(n,colors);infoEl.innerHTML='';}
                    });
                })(entry,idx);
            });
            steps.push({description:isBipartite?'모든 인접 노드가 <em>서로 다른 색</em>으로 칠해졌으므로 → <strong>이분 그래프 YES!</strong> 두 그룹으로 분리할 수 있습니다.':'인접한 두 노드가 <em>같은 색</em>이 되는 충돌 발생 → <strong>이분 그래프 NO!</strong> 홀수 길이 사이클이 존재합니다.',
                action:function(){renderBip(n,colors);infoEl.innerHTML='<strong style="color:'+(isBipartite?'var(--green)':'var(--red)')+';font-size:1.1rem;">'+(isBipartite?'\u2705 이분 그래프입니다 (YES)':'\u274C 이분 그래프가 아닙니다 (NO)')+'</strong>';},
                undo:function(){renderBip(n,colors);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var n=parseInt(container.querySelector('#gr-bip-n').value)||DEFAULT_N;
            var edges=parseEdges(container.querySelector('#gr-bip-edges').value);
            renderBip(n,{});infoEl.innerHTML='';
            self._initStepController(container,buildSteps(n,edges),suffix);
        }
        container.querySelector('#gr-bip-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // 시뮬레이션 16: 벽 부수고 이동하기 (boj-2206)
    // ====================================================================
    _renderVizWall: function(container) {
        var self = this, suffix = '-wall';
        var DEFAULT_GRID = '0 1 0; 0 1 0; 0 0 0';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">벽 부수고 이동하기 — 상태 BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">visited[r][c][broken] 3차원 방문 배열. 0=길, 1=벽.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자 (행은 ; 구분): <input type="text" id="gr-wall-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-wall-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        function parseGrid(s){return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);});}
        function renderWall(grid, dist0, dist1){
            var C=grid[0].length;
            var html='<div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;">';
            html+='<div><div style="font-size:0.8rem;color:var(--text3);margin-bottom:4px;font-weight:600;">벽 안 부숨</div>';
            html+='<div style="display:inline-grid;grid-template-columns:repeat('+C+',40px);gap:2px;">';
            grid.forEach(function(row,r){row.forEach(function(v,c){
                var bg=v===1?'#e74c3c':(dist0[r][c]>=0?'#2d3436':'#dfe6e9');
                html+='<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:5px;font-weight:600;font-size:0.75rem;background:'+bg+';color:'+(dist0[r][c]>=0||v===1?'white':'var(--text)')+';">'+(v===1?'\u2588':(dist0[r][c]>=0?dist0[r][c]:'\u00B7'))+'</div>';
            });});
            html+='</div></div>';
            html+='<div><div style="font-size:0.8rem;color:var(--text3);margin-bottom:4px;font-weight:600;">벽 부숨</div>';
            html+='<div style="display:inline-grid;grid-template-columns:repeat('+C+',40px);gap:2px;">';
            grid.forEach(function(row,r){row.forEach(function(v,c){
                var bg=v===1?'#e74c3c':(dist1[r][c]>=0?'#6c5ce7':'#dfe6e9');
                html+='<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:5px;font-weight:600;font-size:0.75rem;background:'+bg+';color:'+(dist1[r][c]>=0||v===1?'white':'var(--text)')+';">'+(v===1?'\u2588':(dist1[r][c]>=0?dist1[r][c]:'\u00B7'))+'</div>';
            });});
            html+='</div></div></div>';
            areaEl.innerHTML=html;
        }
        function buildSteps(grid){
            var R=grid.length,C=grid[0].length,dx=[0,0,1,-1],dy=[1,-1,0,0];
            // 3D BFS: dist[r][c][b]
            var dist3=[];for(var r=0;r<R;r++){dist3.push([]);for(var c=0;c<C;c++){dist3[r].push([-1,-1]);}}
            dist3[0][0][0]=1;
            var q=[[0,0,0]]; // r,c,broken
            var levels=[[{r:0,c:0,b:0,d:1}]];
            while(q.length>0){
                var nextQ=[],nextLevel=[];
                q.forEach(function(pos){
                    var cr=pos[0],cc=pos[1],cb=pos[2];
                    for(var d=0;d<4;d++){
                        var nr=cr+dx[d],nc=cc+dy[d];
                        if(nr<0||nr>=R||nc<0||nc>=C) continue;
                        if(grid[nr][nc]===0&&dist3[nr][nc][cb]<0){
                            dist3[nr][nc][cb]=dist3[cr][cc][cb]+1;
                            nextQ.push([nr,nc,cb]);
                            nextLevel.push({r:nr,c:nc,b:cb,d:dist3[nr][nc][cb],pr:cr,pc:cc});
                        }
                        if(grid[nr][nc]===1&&cb===0&&dist3[nr][nc][1]<0){
                            dist3[nr][nc][1]=dist3[cr][cc][cb]+1;
                            nextQ.push([nr,nc,1]);
                            nextLevel.push({r:nr,c:nc,b:1,d:dist3[nr][nc][1],pr:cr,pc:cc});
                        }
                    }
                });
                if(nextLevel.length>0) levels.push(nextLevel);
                q=nextQ;
            }
            var ans=-1;
            if(dist3[R-1][C-1][0]>=0) ans=dist3[R-1][C-1][0];
            if(dist3[R-1][C-1][1]>=0&&(ans<0||dist3[R-1][C-1][1]<ans)) ans=dist3[R-1][C-1][1];

            // reset for step-by-step
            for(var r=0;r<R;r++) for(var c=0;c<C;c++){dist3[r][c][0]=-1;dist3[r][c][1]=-1;}
            var dist0=[],dist1=[];
            for(var r=0;r<R;r++){dist0.push([]);dist1.push([]);for(var c=0;c<C;c++){dist0[r].push(-1);dist1[r].push(-1);}}

            var steps=[];
            // level 0: start at (0,0)
            var initW=levels[0];
            steps.push({
                description:'(0,0)에서 시작 — <strong>상태 BFS</strong>: visited[r][c][<em>벽 부숨 여부</em>]로 관리합니다. 같은 칸이라도 벽을 부쉈는지 여부에 따라 <em>다른 상태</em>이므로 3차원 방문 배열이 필요합니다.',
                action:function(){initW.forEach(function(p){dist3[p.r][p.c][p.b]=p.d;if(p.b===0) dist0[p.r][p.c]=p.d; else dist1[p.r][p.c]=p.d;});renderWall(grid,dist0,dist1);infoEl.innerHTML='dist[0][0][0] = 1';},
                undo:function(){initW.forEach(function(p){dist3[p.r][p.c][p.b]=-1;if(p.b===0) dist0[p.r][p.c]=-1; else dist1[p.r][p.c]=-1;});renderWall(grid,dist0,dist1);infoEl.innerHTML='';}
            });
            // each subsequent cell individually
            for(var li=1;li<levels.length;li++){
                for(var ci=0;ci<levels[li].length;ci++){
                    (function(cell){
                        var broke=cell.b===1;
                        var desc=broke?'('+cell.r+','+cell.c+') <strong>벽을 부수고</strong> 진입 ← ('+cell.pr+','+cell.pc+')에서. 벽 부숨 기회를 사용했으므로 이후에는 벽을 더 부술 수 없습니다. dist='+cell.d:'('+cell.r+','+cell.c+') 길로 이동 ← ('+cell.pr+','+cell.pc+')에서. 벽을 아직 안 부순 상태를 유지합니다. dist='+cell.d;
                        steps.push({
                            description:desc,
                            action:function(){dist3[cell.r][cell.c][cell.b]=cell.d;if(cell.b===0) dist0[cell.r][cell.c]=cell.d; else dist1[cell.r][cell.c]=cell.d;renderWall(grid,dist0,dist1);infoEl.innerHTML=desc;},
                            undo:function(){dist3[cell.r][cell.c][cell.b]=-1;if(cell.b===0) dist0[cell.r][cell.c]=-1; else dist1[cell.r][cell.c]=-1;renderWall(grid,dist0,dist1);infoEl.innerHTML='';}
                        });
                    })(levels[li][ci]);
                }
            }
            steps.push({description:ans>=0?'상태 BFS 완료 — 벽을 부순 경로와 안 부순 경로 중 <em>더 짧은 것</em>이 답. <strong>최단 경로 = '+ans+'칸</strong>':'두 상태 모두에서 <strong>도달 불가</strong> — 벽을 하나 부숴도 경로를 만들 수 없습니다. 답: <strong>-1</strong>',
                action:function(){renderWall(grid,dist0,dist1);infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 '+(ans>=0?'최단 경로 = '+ans+'칸':'도달 불가 (-1)')+'</strong>';},
                undo:function(){renderWall(grid,dist0,dist1);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var grid=parseGrid(container.querySelector('#gr-wall-grid').value);
            var empty0=grid.map(function(r){return r.map(function(){return -1;});});
            var empty1=grid.map(function(r){return r.map(function(){return -1;});});
            renderWall(grid,empty0,empty1);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(grid),suffix);
        }
        container.querySelector('#gr-wall-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ===== 빈 스텁 =====
    renderVisualize: function(container) {},
    renderProblem: function(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: 'DFS/BFS 기본', desc: 'DFS와 BFS의 기본 구현을 연습합니다 (Silver II~III)', problemIds: ['boj-2606', 'boj-24479', 'boj-24480', 'boj-24444', 'boj-24445', 'boj-1260'] },
        { num: 2, title: '그리드 탐색과 Flood Fill', desc: '격자에서 연결 요소를 탐색합니다 (Silver I~II)', problemIds: ['boj-1012', 'boj-2667'] },
        { num: 3, title: 'BFS 최단 거리', desc: 'BFS로 최단 거리를 구합니다 (Silver I)', problemIds: ['boj-2178', 'boj-1697', 'boj-7562'] },
        { num: 4, title: '심화 BFS', desc: '다중 시작점, 상태 확장 BFS (Gold III~V)', problemIds: ['boj-7576', 'boj-7569', 'boj-16928', 'boj-1707', 'boj-2206'] }
    ],

    problems: [
        {
            id: 'boj-2606',
            title: 'BOJ 2606 - 바이러스',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2606',
            simIntro: '1번 컴퓨터에서 시작해 연결된 컴퓨터로 바이러스가 퍼지는 BFS 탐색 과정을 시뮬레이션합니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>신종 바이러스인 웜 바이러스는 네트워크를 통해 전파됩니다. 한 컴퓨터가 웜 바이러스에 걸리면 그 컴퓨터와 네트워크 상에서 연결되어 있는 모든 컴퓨터는 웜 바이러스에 걸리게 됩니다.</p>
                <p>예를 들어 7대의 컴퓨터가 <그림 1>과 같이 네트워크 상에서 연결되어 있다고 하자. 1번 컴퓨터가 웜 바이러스에 걸리면 웜 바이러스는 2번과 5번 컴퓨터를 거쳐 3번과 6번 컴퓨터까지 전파되어 2, 3, 5, 6 네 대의 컴퓨터는 웜 바이러스에 걸리게 된다. 하지만 4번과 7번 컴퓨터는 1번 컴퓨터와 네트워크상에서 연결되어 있지 않기 때문에 영향을 받지 않는다.</p>
                <p>어느 날 1번 컴퓨터가 웜 바이러스에 걸렸다. 컴퓨터의 수와 네트워크 상에서 서로 연결되어 있는 정보가 주어질 때, 1번 컴퓨터를 통해 웜 바이러스에 걸리게 되는 컴퓨터의 수를 출력하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에는 컴퓨터의 수가 주어진다. 컴퓨터의 수는 100 이하인 양의 정수이고 각 컴퓨터에는 1번 부터 차례대로 번호가 매겨진다. 둘째 줄에는 네트워크 상에서 직접 연결되어 있는 컴퓨터 쌍의 수가 주어진다. 이어서 그 수만큼 한 줄에 한 쌍씩 네트워크 상에서 직접 연결되어 있는 컴퓨터의 번호 쌍이 주어진다.</p>
                <h4>출력</h4>
                <p>1번 컴퓨터가 웜 바이러스에 걸렸을 때, 1번 컴퓨터를 통해 웜 바이러스에 걸리게 되는 컴퓨터의 수를 첫째 줄에 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>7
6
1 2
2 3
1 5
5 2
5 6
4 7</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3
0</pre></div>
                    <div><strong>출력</strong><pre>0</pre></div>
                </div><p class="example-explain">연결된 컴퓨터가 없으므로 아무 컴퓨터도 감염되지 않습니다.</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ 컴퓨터 수 ≤ 100</li>
                    <li>1 ≤ 연결 수 ≤ 100 × 99 / 2</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '1번 컴퓨터에서 바이러스가 퍼지니까... 1번과 연결된 컴퓨터를 찾고, 그 컴퓨터와 연결된 컴퓨터도 찾고... 이걸 반복하면 되지 않을까?<br><br>맞아요! <strong>"연결된 모든 컴퓨터를 찾는 것"</strong>이 핵심입니다. 이런 문제를 <strong>그래프 탐색</strong>이라고 해요.<br><br><div style="display:flex;gap:8px;align-items:center;justify-content:center;padding:10px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);flex-wrap:wrap;"><div style="width:36px;height:36px;border-radius:50%;background:var(--red);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">1</div><span style="color:var(--text2);font-size:0.9rem;">→</span><div style="width:36px;height:36px;border-radius:50%;background:var(--yellow);color:#333;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">2</div><span style="color:var(--text2);font-size:0.9rem;">→</span><div style="width:36px;height:36px;border-radius:50%;background:var(--yellow);color:#333;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">3</div><span style="color:var(--text2);font-size:0.9rem;">→</span><div style="width:36px;height:36px;border-radius:50%;background:var(--yellow);color:#333;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">5</div><span style="color:var(--text3);font-size:0.8rem;margin-left:8px;">감염 전파!</span></div>' },
                { title: '근데 어떻게 빠짐없이 찾지?', content: '연결된 컴퓨터를 하나씩 따라가다 보면 빠뜨리거나 같은 곳을 두 번 방문할 수 있어요.<br><br>이걸 체계적으로 하는 방법이 <strong>BFS(너비 우선 탐색)</strong>와 <strong>DFS(깊이 우선 탐색)</strong>입니다!<br>둘 다 <strong>visited 배열</strong>로 이미 방문한 곳을 체크하면 중복 방문을 막을 수 있어요.<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><span style="font-weight:600;color:var(--text);">visited:</span><span style="padding:3px 10px;background:var(--green);color:white;border-radius:4px;">T</span><span style="padding:3px 10px;background:var(--green);color:white;border-radius:4px;">T</span><span style="padding:3px 10px;background:var(--bg2);color:var(--text2);border-radius:4px;">F</span><span style="padding:3px 10px;background:var(--green);color:white;border-radius:4px;">T</span><span style="padding:3px 10px;background:var(--bg2);color:var(--text2);border-radius:4px;">F</span><span style="color:var(--text3);margin-left:6px;">← 방문한 곳 체크!</span></div>' },
                { title: '이렇게 하면 어떨까?', content: '1번 컴퓨터를 큐에 넣고 BFS를 시작합니다:<br>1. 큐에서 컴퓨터를 꺼낸다<br>2. 그 컴퓨터와 연결된 이웃 중 방문하지 않은 것을 큐에 넣는다<br>3. 큐가 빌 때까지 반복!<br><br>방문한 컴퓨터 수에서 자기 자신(1번)을 빼면 정답이에요.' },
                { title: '구현 팁', content: '양방향 연결이니까 인접 리스트에 양쪽 다 추가해야 해요:<br><span class="lang-py">Python: <code>graph[u].append(v)</code>와 <code>graph[v].append(u)</code> 둘 다! BFS에는 <code>deque</code>를 사용합니다.</span><span class="lang-cpp">C++: <code>graph[u].push_back(v)</code>와 <code>graph[v].push_back(u)</code> 둘 다! BFS에는 <code>queue&lt;int&gt;</code>를 사용합니다.</span>' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N = int(input())
M = int(input())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

visited = [False] * (N + 1)
queue = deque([1])
visited[1] = True
count = 0

while queue:
    v = queue.popleft()
    for u in graph[v]:
        if not visited[u]:
            visited[u] = True
            queue.append(u)
            count += 1

print(count)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<vector<int>> graph(N + 1);
    for (int i = 0; i < M; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }

    vector<bool> visited(N + 1, false);
    queue<int> q;
    q.push(1);
    visited[1] = true;
    int count = 0;

    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : graph[v]) {
            if (!visited[u]) {
                visited[u] = true;
                q.push(u);
                count++;
            }
        }
    }
    printf("%d\\n", count);
    return 0;
}`
            },
            solutions: [{
                approach: 'BFS 탐색',
                description: '1번 컴퓨터에서 BFS로 연결된 모든 컴퓨터를 방문하여 감염 수를 셉니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구성', desc: '양방향 간선이므로 양쪽 모두 인접 리스트에 추가합니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN = int(input())\nM = int(input())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)' },
                        { title: 'BFS 초기화', desc: '1번 컴퓨터에서 출발하므로 deque에 1을 넣고 시작합니다.', code: 'visited = [False] * (N + 1)\nqueue = deque([1])\nvisited[1] = True\ncount = 0' },
                        { title: 'BFS 탐색 및 출력', desc: '연결된 모든 컴퓨터를 방문하며 감염 수를 세고 출력합니다.', code: 'while queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        if not visited[u]:\n            visited[u] = True\n            queue.append(u)\n            count += 1\nprint(count)' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 구성', desc: 'vector 인접 리스트와 scanf로 빠른 입력', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    // 인접 리스트: vector 배열로 그래프 저장\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }' },
                        { title: 'BFS 초기화', desc: 'deque 대신 queue<int> 사용', code: '    vector<bool> visited(N + 1, false);\n    queue<int> q;\n    q.push(1);\n    visited[1] = true;\n    int count = 0;' },
                        { title: 'BFS 탐색 및 출력', desc: '큐가 빌 때까지 탐색하며 감염된 컴퓨터 수를 셉니다.', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            if (!visited[u]) {\n                visited[u] = true;\n                q.push(u);\n                count++;\n            }\n        }\n    }\n    printf("%d\\n", count);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-24479',
            title: 'BOJ 24479 - 깊이 우선 탐색 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24479',
            simIntro: '시작 정점에서 오름차순 DFS를 수행하며 각 정점의 방문 순서를 기록하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정점과 M개의 간선으로 구성된 무방향 그래프가 주어집니다. 정점 R에서 시작하여 깊이 우선 탐색(DFS)으로 노드를 방문할 때, 각 노드의 방문 순서를 출력하는 프로그램을 작성하시오.</p>
                <p>인접 정점은 <strong>오름차순</strong>으로 방문합니다. 시작 정점의 방문 순서는 1이다. 시작 정점에서 방문할 수 없는 경우 0을 출력합니다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 정점의 수 N (5 ≤ N ≤ 100,000), 간선의 수 M (1 ≤ M ≤ 200,000), 시작 정점 R (1 ≤ R ≤ N)이 주어진다.</p>
                <p>다음 M개 줄에 간선 정보 u v가 주어지며 정점 u와 정점 v의 가중치 1인 양방향 간선을 나타낸다. (1 ≤ u < v ≤ N, u ≠ v) 모든 간선의 (u, v) 쌍의 값은 서로 다르다.</p>
                <h4>출력</h4>
                <p>첫째 줄부터 N개의 줄에 정수를 한 개씩 출력한다. i번째 줄에는 정점 i의 방문 순서를 출력한다. 시작 정점의 방문 순서는 1이다. 시작 정점에서 방문할 수 없는 경우 0을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1
2
3
4
0</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 200,000</li>
                    <li>1 ≤ R ≤ N</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '시작 정점 R에서 DFS를 돌리면서, 방문할 때마다 순서를 1, 2, 3... 이렇게 매기면 되겠다!<br><br>맞아요. <code>order[v]</code> 배열에 각 정점의 방문 순서를 기록하면 됩니다. 방문하지 못한 정점은 0을 출력하면 되고요.<br><br><div style="display:flex;gap:4px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><span style="font-weight:600;color:var(--text);">order:</span><span style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">1</span><span style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">2</span><span style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">3</span><span style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">4</span><span style="padding:3px 8px;background:var(--bg2);color:var(--text2);border-radius:4px;">0</span><span style="color:var(--text3);margin-left:4px;">← 5번은 미방문</span></div>' },
                { title: '근데 이러면 문제가 있어', content: '문제에서 인접 정점을 <strong>오름차순</strong>으로 방문하라고 했어요. DFS를 그냥 돌리면 인접 리스트에 들어온 순서대로 방문하게 되니까, 정렬을 안 하면 순서가 달라질 수 있어요!<br><br><div style="display:flex;gap:12px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div><span style="color:var(--red);">정렬 전:</span> [4, 2, 3]</div><span style="font-size:1.1rem;">→</span><div><span style="color:var(--green);">정렬 후:</span> [2, 3, 4]</div></div>' },
                { title: '이렇게 하면 어떨까?', content: 'DFS 전에 각 정점의 인접 리스트를 <strong>오름차순 정렬</strong>하면 됩니다!<br><br>그러면 DFS가 자연스럽게 작은 번호부터 방문해요:<br><span class="lang-py">Python: <code>graph[i].sort()</code>로 정렬 후, 재귀 DFS에서 <code>global cnt</code>로 순서를 매깁니다.</span><span class="lang-cpp">C++: <code>sort(graph[i].begin(), graph[i].end())</code>로 정렬 후, 전역 변수 <code>cnt</code>로 순서를 매깁니다.</span>' },
                { title: '주의할 점', content: '정점 수가 최대 100,000이므로 <span class="lang-py">Python에서는 <code>sys.setrecursionlimit(200000)</code>으로 재귀 한도를 늘려야 합니다!</span><span class="lang-cpp">C++에서는 기본 스택 크기로 충분하지만, 전역 배열을 사용하면 더 안전합니다.</span>' }
            ],
            templates: {
                python: `import sys
sys.setrecursionlimit(200000)
input = sys.stdin.readline

N, M, R = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort()  # 오름차순 정렬

order = [0] * (N + 1)
cnt = 0

def dfs(v):
    global cnt
    cnt += 1
    order[v] = cnt
    for u in graph[v]:
        if order[u] == 0:
            dfs(u)

dfs(R)
for i in range(1, N + 1):
    print(order[i])`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int N, M, R, cnt = 0;
vector<int> graph[100001];
int order_arr[100001];

void dfs(int v) {
    order_arr[v] = ++cnt;
    for (int u : graph[v]) {
        if (order_arr[u] == 0) dfs(u);
    }
}

int main() {
    scanf("%d %d %d", &N, &M, &R);
    for (int i = 0; i < M; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].begin(), graph[i].end());
    dfs(R);
    for (int i = 1; i <= N; i++) printf("%d\\n", order_arr[i]);
    return 0;
}`
            },
            solutions: [{
                approach: '오름차순 DFS',
                description: '인접 리스트를 오름차순 정렬한 뒤 재귀 DFS로 방문 순서를 기록합니다.',
                timeComplexity: 'O(N + M log M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 정렬', desc: '오름차순 방문을 위해 인접 리스트를 sort()합니다.', code: 'import sys\nsys.setrecursionlimit(200000)\ninput = sys.stdin.readline\n\nN, M, R = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)\nfor i in range(1, N + 1):\n    graph[i].sort()' },
                        { title: 'DFS 함수 정의', desc: 'order 배열에 방문 순서를 기록하는 재귀 DFS입니다.', code: 'order = [0] * (N + 1)\ncnt = 0\n\ndef dfs(v):\n    global cnt\n    cnt += 1\n    order[v] = cnt\n    for u in graph[v]:\n        if order[u] == 0:\n            dfs(u)' },
                        { title: 'DFS 실행 및 출력', desc: '시작 정점 R에서 DFS를 실행하고 각 정점의 방문 순서를 출력합니다.', code: 'dfs(R)\nfor i in range(1, N + 1):\n    print(order[i])' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 정렬', desc: '전역 배열 + sort()로 오름차순 정렬', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint N, M, R, cnt = 0;\nvector<int> graph[100001];\nint order_arr[100001]; // 방문 순서 기록 배열' },
                        { title: 'DFS 함수 정의', desc: 'global 대신 전역 변수 cnt 사용', code: 'void dfs(int v) {\n    order_arr[v] = ++cnt; // 방문 순서 기록\n    for (int u : graph[v]) {\n        if (order_arr[u] == 0) dfs(u);\n    }\n}' },
                        { title: 'DFS 실행 및 출력', desc: 'main에서 입력·정렬·DFS·출력을 순서대로 처리합니다.', code: 'int main() {\n    scanf("%d %d %d", &N, &M, &R);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    // 오름차순 정렬: 작은 번호부터 방문하기 위해\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].begin(), graph[i].end());\n    dfs(R);\n    for (int i = 1; i <= N; i++)\n        printf("%d\\n", order_arr[i]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-24480',
            title: 'BOJ 24480 - 깊이 우선 탐색 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24480',
            simIntro: '시작 정점에서 내림차순 DFS를 수행하며 각 정점의 방문 순서를 기록하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정점과 M개의 간선으로 구성된 무방향 그래프가 주어집니다. 정점 R에서 시작하여 깊이 우선 탐색(DFS)으로 노드를 방문할 때, 각 노드의 방문 순서를 출력하는 프로그램을 작성하시오.</p>
                <p>인접 정점은 <strong>내림차순</strong>으로 방문합니다. 시작 정점의 방문 순서는 1이다. 시작 정점에서 방문할 수 없는 경우 0을 출력합니다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 정점의 수 N (5 ≤ N ≤ 100,000), 간선의 수 M (1 ≤ M ≤ 200,000), 시작 정점 R (1 ≤ R ≤ N)이 주어진다.</p>
                <p>다음 M개 줄에 간선 정보 u v가 주어지며 정점 u와 정점 v의 가중치 1인 양방향 간선을 나타낸다. (1 ≤ u < v ≤ N, u ≠ v) 모든 간선의 (u, v) 쌍의 값은 서로 다르다.</p>
                <h4>출력</h4>
                <p>첫째 줄부터 N개의 줄에 정수를 한 개씩 출력한다. i번째 줄에는 정점 i의 방문 순서를 출력한다. 시작 정점의 방문 순서는 1이다. 시작 정점에서 방문할 수 없는 경우 0을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1
4
3
2
0</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 200,000</li>
                    <li>1 ≤ R ≤ N</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '24479번(깊이 우선 탐색 1)을 이미 풀었다면, 같은 방식으로 DFS를 돌리면 될 것 같아요. 방문 순서를 <code>order</code> 배열에 기록하는 건 동일하고요.' },
                { title: '근데 이러면 문제가 있어', content: '이번에는 인접 정점을 <strong>내림차순</strong>으로 방문해야 해요! 24479번처럼 오름차순으로 정렬하면 방문 순서가 달라집니다.<br><br>결국 정렬 방향 <strong>한 줄</strong>만 바꾸면 되는 문제예요.<br><br><div style="display:flex;gap:12px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div><span style="color:var(--text2);">오름차순:</span> [2, 3, 4]</div><span style="font-size:1.1rem;">→</span><div><span style="color:var(--accent);font-weight:600;">내림차순:</span> [4, 3, 2]</div></div>' },
                { title: '이렇게 하면 어떨까?', content: '24479번 코드에서 정렬 부분만 내림차순으로 바꿉니다:<br><span class="lang-py">Python: <code>graph[i].sort(reverse=True)</code></span><span class="lang-cpp">C++: <code>sort(graph[i].rbegin(), graph[i].rend())</code></span><br><br>나머지 DFS 로직은 완전히 동일합니다!' }
            ],
            templates: {
                python: `import sys
sys.setrecursionlimit(200000)
input = sys.stdin.readline

N, M, R = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort(reverse=True)  # 내림차순 정렬!

order = [0] * (N + 1)
cnt = 0

def dfs(v):
    global cnt
    cnt += 1
    order[v] = cnt
    for u in graph[v]:
        if order[u] == 0:
            dfs(u)

dfs(R)
for i in range(1, N + 1):
    print(order[i])`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int N, M, R, cnt = 0;
vector<int> graph[100001];
int order_arr[100001];

void dfs(int v) {
    order_arr[v] = ++cnt;
    for (int u : graph[v]) {
        if (order_arr[u] == 0) dfs(u);
    }
}

int main() {
    scanf("%d %d %d", &N, &M, &R);
    for (int i = 0; i < M; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].rbegin(), graph[i].rend()); // 내림차순!
    dfs(R);
    for (int i = 1; i <= N; i++) printf("%d\\n", order_arr[i]);
    return 0;
}`
            },
            solutions: [{
                approach: '내림차순 DFS',
                description: '인접 리스트를 내림차순 정렬한 뒤 재귀 DFS로 방문 순서를 기록합니다.',
                timeComplexity: 'O(N + M log M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 내림차순 정렬', desc: '내림차순 방문을 위해 reverse=True로 정렬합니다.', code: 'import sys\nsys.setrecursionlimit(200000)\ninput = sys.stdin.readline\n\nN, M, R = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)\nfor i in range(1, N + 1):\n    graph[i].sort(reverse=True)' },
                        { title: 'DFS 함수 정의', desc: '24479번과 동일한 재귀 DFS, 정렬 방향만 다릅니다.', code: 'order = [0] * (N + 1)\ncnt = 0\n\ndef dfs(v):\n    global cnt\n    cnt += 1\n    order[v] = cnt\n    for u in graph[v]:\n        if order[u] == 0:\n            dfs(u)' },
                        { title: 'DFS 실행 및 출력', desc: '시작 정점 R에서 DFS 실행 후 각 정점의 방문 순서를 출력합니다.', code: 'dfs(R)\nfor i in range(1, N + 1):\n    print(order[i])' }
                    ],
                    cpp: [
                        { title: '입력 및 내림차순 정렬', desc: 'rbegin()/rend()로 내림차순 정렬', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint N, M, R, cnt = 0;\nvector<int> graph[100001];\nint order_arr[100001];' },
                        { title: 'DFS 함수 정의', desc: '24479번과 동일한 재귀 DFS 구조입니다.', code: 'void dfs(int v) {\n    order_arr[v] = ++cnt;\n    for (int u : graph[v]) {\n        if (order_arr[u] == 0) dfs(u);\n    }\n}' },
                        { title: 'DFS 실행 및 출력', desc: 'rbegin/rend 역순 정렬 후 DFS 실행, 결과 출력합니다.', code: 'int main() {\n    scanf("%d %d %d", &N, &M, &R);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    // 내림차순: rbegin/rend로 역순 정렬\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].rbegin(), graph[i].rend());\n    dfs(R);\n    for (int i = 1; i <= N; i++)\n        printf("%d\\n", order_arr[i]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-24444',
            title: 'BOJ 24444 - 너비 우선 탐색 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24444',
            simIntro: '시작 정점에서 오름차순 BFS를 수행하며 각 정점의 방문 순서를 기록하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정점과 M개의 간선으로 구성된 무방향 그래프가 주어집니다. 정점 R에서 시작하여 너비 우선 탐색(BFS)으로 노드를 방문할 때, 각 노드의 방문 순서를 출력하는 프로그램을 작성하시오.</p>
                <p>인접 정점은 <strong>오름차순</strong>으로 방문합니다. 시작 정점의 방문 순서는 1이다. 시작 정점에서 방문할 수 없는 경우 0을 출력합니다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 정점의 수 N (5 ≤ N ≤ 100,000), 간선의 수 M (1 ≤ M ≤ 200,000), 시작 정점 R (1 ≤ R ≤ N)이 주어진다.</p>
                <p>다음 M개 줄에 간선 정보 u v가 주어지며 정점 u와 정점 v의 가중치 1인 양방향 간선을 나타낸다. (1 ≤ u < v ≤ N, u ≠ v) 모든 간선의 (u, v) 쌍의 값은 서로 다르다.</p>
                <h4>출력</h4>
                <p>첫째 줄부터 N개의 줄에 정수를 한 개씩 출력한다. i번째 줄에는 정점 i의 방문 순서를 출력한다. 시작 정점의 방문 순서는 1이다. 시작 정점에서 방문할 수 없는 경우 0을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1
2
3
4
0</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 200,000</li>
                    <li>1 ≤ R ≤ N</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '24479번처럼 DFS로... 잠깐, 이번엔 <strong>BFS(너비 우선 탐색)</strong>로 방문 순서를 구해야 해요!<br><br>BFS는 시작 정점에서 가까운 정점부터 차례로 방문하는 방식입니다. 큐(queue)를 사용해요.<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><span style="font-weight:600;color:var(--text);">큐:</span><span style="padding:3px 10px;background:#00b894;color:white;border-radius:4px;">R</span><span style="color:var(--text3);">→</span><span style="padding:3px 10px;background:var(--bg2);color:var(--text);border-radius:4px;">2</span><span style="padding:3px 10px;background:var(--bg2);color:var(--text);border-radius:4px;">3</span><span style="color:var(--text3);margin-left:4px;">← 가까운 순서대로!</span></div>' },
                { title: '근데 순서가 중요해', content: '문제에서 인접 정점을 <strong>오름차순</strong>으로 방문하라고 했으니, DFS 문제와 마찬가지로 인접 리스트를 먼저 정렬해야 합니다. 정렬 안 하면 순서가 달라져요!' },
                { title: '이렇게 하면 어떨까?', content: '1. 인접 리스트를 오름차순 정렬<br>2. 시작 정점 R을 큐에 넣고 <code>order[R] = 1</code><br>3. 큐에서 꺼낸 정점의 이웃 중 미방문 정점을 순서대로 큐에 넣으며 방문 순서를 기록<br><br><span class="lang-py">Python: <code>deque</code>로 BFS, <code>popleft()</code>로 큐에서 꺼냅니다.</span><span class="lang-cpp">C++: <code>queue&lt;int&gt;</code>로 BFS, <code>q.front(); q.pop();</code>으로 큐에서 꺼냅니다.</span>' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N, M, R = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort()  # 오름차순

order = [0] * (N + 1)
cnt = 0

queue = deque([R])
visited = [False] * (N + 1)
visited[R] = True
cnt += 1
order[R] = cnt

while queue:
    v = queue.popleft()
    for u in graph[v]:
        if not visited[u]:
            visited[u] = True
            cnt += 1
            order[u] = cnt
            queue.append(u)

for i in range(1, N + 1):
    print(order[i])`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int N, M, R;
    scanf("%d %d %d", &N, &M, &R);
    vector<vector<int>> graph(N + 1);
    for (int i = 0; i < M; i++) {
        int u, v; scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].begin(), graph[i].end());

    vector<int> order_arr(N + 1, 0);
    vector<bool> visited(N + 1, false);
    queue<int> q;
    q.push(R); visited[R] = true;
    int cnt = 0;
    order_arr[R] = ++cnt;

    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : graph[v]) {
            if (!visited[u]) {
                visited[u] = true;
                order_arr[u] = ++cnt;
                q.push(u);
            }
        }
    }
    for (int i = 1; i <= N; i++) printf("%d\\n", order_arr[i]);
    return 0;
}`
            },
            solutions: [{
                approach: '오름차순 BFS',
                description: '인접 리스트를 오름차순 정렬한 뒤 BFS로 방문 순서를 기록합니다.',
                timeComplexity: 'O(N + M log M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 정렬', desc: '오름차순 BFS를 위해 인접 리스트를 정렬합니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M, R = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)\nfor i in range(1, N + 1):\n    graph[i].sort()' },
                        { title: 'BFS 초기화', desc: '시작 정점 R을 큐에 넣고 방문 순서 1을 기록합니다.', code: 'order = [0] * (N + 1)\ncnt = 0\nqueue = deque([R])\ncnt += 1\norder[R] = cnt' },
                        { title: 'BFS 탐색 및 출력', desc: '큐에서 꺼낸 정점의 이웃을 오름차순으로 방문합니다.', code: 'while queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        if order[u] == 0:\n            cnt += 1\n            order[u] = cnt\n            queue.append(u)\nfor i in range(1, N + 1):\n    print(order[i])' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 정렬', desc: 'vector<vector<int>>와 sort()로 오름차순 정렬', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M, R;\n    scanf("%d %d %d", &N, &M, &R);\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].begin(), graph[i].end());' },
                        { title: 'BFS 초기화', desc: 'deque 대신 queue 사용', code: '    vector<int> order_arr(N + 1, 0);\n    int cnt = 0;\n    queue<int> q;\n    q.push(R);\n    order_arr[R] = ++cnt;' },
                        { title: 'BFS 탐색 및 출력', desc: '방문 순서를 기록하며 BFS 수행 후 결과를 출력합니다.', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            if (order_arr[u] == 0) {\n                order_arr[u] = ++cnt;\n                q.push(u);\n            }\n        }\n    }\n    for (int i = 1; i <= N; i++)\n        printf("%d\\n", order_arr[i]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-24445',
            title: 'BOJ 24445 - 너비 우선 탐색 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24445',
            simIntro: '시작 정점에서 내림차순 BFS를 수행하며 각 정점의 방문 순서를 기록하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정점과 M개의 간선으로 구성된 무방향 그래프가 주어집니다. 정점 R에서 시작하여 너비 우선 탐색(BFS)으로 노드를 방문할 때, 각 노드의 방문 순서를 출력하는 프로그램을 작성하시오.</p>
                <p>인접 정점은 <strong>내림차순</strong>으로 방문합니다. 시작 정점의 방문 순서는 1이다. 시작 정점에서 방문할 수 없는 경우 0을 출력합니다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 정점의 수 N (5 ≤ N ≤ 100,000), 간선의 수 M (1 ≤ M ≤ 200,000), 시작 정점 R (1 ≤ R ≤ N)이 주어진다.</p>
                <p>다음 M개 줄에 간선 정보 u v가 주어지며 정점 u와 정점 v의 가중치 1인 양방향 간선을 나타낸다. (1 ≤ u < v ≤ N, u ≠ v) 모든 간선의 (u, v) 쌍의 값은 서로 다르다.</p>
                <h4>출력</h4>
                <p>첫째 줄부터 N개의 줄에 정수를 한 개씩 출력한다. i번째 줄에는 정점 i의 방문 순서를 출력한다. 시작 정점의 방문 순서는 1이다. 시작 정점에서 방문할 수 없는 경우 0을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1
3
4
2
0</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 200,000</li>
                    <li>1 ≤ R ≤ N</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '24444번(너비 우선 탐색 1)을 풀었다면, 같은 BFS 로직을 그대로 쓰면 될 것 같아요. 큐에서 꺼내고 이웃을 넣고...' },
                { title: '근데 이러면 문제가 있어', content: '이번에는 인접 정점을 <strong>내림차순</strong>으로 방문해야 합니다! 오름차순 정렬을 그대로 쓰면 방문 순서가 완전히 달라져요.<br><br>24444번 코드에서 딱 <strong>한 줄</strong>만 바꾸면 됩니다.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><span class="lang-py"><code>graph[i].sort()</code> → <code style="color:var(--accent);font-weight:600;">graph[i].sort(reverse=True)</code></span><span class="lang-cpp"><code>sort(g.begin(), g.end())</code> → <code style="color:var(--accent);font-weight:600;">sort(g.rbegin(), g.rend())</code></span></div>' },
                { title: '이렇게 하면 어떨까?', content: '정렬 방향만 내림차순으로 변경하면 끝!<br><span class="lang-py">Python: <code>graph[i].sort(reverse=True)</code></span><span class="lang-cpp">C++: <code>sort(graph[i].rbegin(), graph[i].rend())</code></span><br><br>BFS 로직 자체는 24444번과 완전히 동일합니다.' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N, M, R = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort(reverse=True)  # 내림차순!

order = [0] * (N + 1)
cnt = 0
queue = deque([R])
visited = [False] * (N + 1)
visited[R] = True
cnt += 1
order[R] = cnt

while queue:
    v = queue.popleft()
    for u in graph[v]:
        if not visited[u]:
            visited[u] = True
            cnt += 1
            order[u] = cnt
            queue.append(u)

for i in range(1, N + 1):
    print(order[i])`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int N, M, R;
    scanf("%d %d %d", &N, &M, &R);
    vector<vector<int>> graph(N + 1);
    for (int i = 0; i < M; i++) {
        int u, v; scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].rbegin(), graph[i].rend()); // 내림차순!

    vector<int> order_arr(N + 1, 0);
    vector<bool> visited(N + 1, false);
    queue<int> q;
    q.push(R); visited[R] = true;
    int cnt = 0; order_arr[R] = ++cnt;

    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : graph[v]) {
            if (!visited[u]) {
                visited[u] = true;
                order_arr[u] = ++cnt;
                q.push(u);
            }
        }
    }
    for (int i = 1; i <= N; i++) printf("%d\\n", order_arr[i]);
    return 0;
}`
            },
            solutions: [{
                approach: '내림차순 BFS',
                description: '인접 리스트를 내림차순 정렬한 뒤 BFS로 방문 순서를 기록합니다.',
                timeComplexity: 'O(N + M log M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 내림차순 정렬', desc: '내림차순 BFS를 위해 reverse=True로 정렬합니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M, R = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)\nfor i in range(1, N + 1):\n    graph[i].sort(reverse=True)' },
                        { title: 'BFS 초기화', desc: '시작 정점 R을 큐에 넣고 방문 순서 1을 기록합니다.', code: 'order = [0] * (N + 1)\ncnt = 0\nqueue = deque([R])\ncnt += 1\norder[R] = cnt' },
                        { title: 'BFS 탐색 및 출력', desc: '큐에서 꺼낸 정점의 이웃을 내림차순으로 방문합니다.', code: 'while queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        if order[u] == 0:\n            cnt += 1\n            order[u] = cnt\n            queue.append(u)\nfor i in range(1, N + 1):\n    print(order[i])' }
                    ],
                    cpp: [
                        { title: '입력 및 내림차순 정렬', desc: 'rbegin()/rend()로 내림차순 정렬', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M, R;\n    scanf("%d %d %d", &N, &M, &R);\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    // 내림차순: rbegin/rend로 역순 정렬\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].rbegin(), graph[i].rend());' },
                        { title: 'BFS 초기화', desc: '시작 정점을 큐에 넣고 방문 순서를 기록합니다.', code: '    vector<int> order_arr(N + 1, 0);\n    int cnt = 0;\n    queue<int> q;\n    q.push(R);\n    order_arr[R] = ++cnt;' },
                        { title: 'BFS 탐색 및 출력', desc: '내림차순 인접 리스트로 BFS 수행 후 결과 출력합니다.', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            if (order_arr[u] == 0) {\n                order_arr[u] = ++cnt;\n                q.push(u);\n            }\n        }\n    }\n    for (int i = 1; i <= N; i++)\n        printf("%d\\n", order_arr[i]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-1260',
            title: 'BOJ 1260 - DFS와 BFS',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1260',
            simIntro: 'DFS와 BFS를 모두 수행하여 각각의 탐색 순서를 비교하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>그래프를 DFS로 탐색한 결과와 BFS로 탐색한 결과를 출력하는 프로그램을 작성하시오. 방문할 수 있는 정점이 여러 개인 경우에는 정점 번호가 작은 것을 먼저 방문하고, 더 이상 방문할 수 있는 점이 없는 경우 종료한다. 정점 번호는 1번부터 N번까지이다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 정점의 개수 N(1 ≤ N ≤ 1,000), 간선의 개수 M(1 ≤ M ≤ 10,000), 탐색을 시작할 정점의 번호 V가 주어진다. 다음 M개의 줄에는 간선이 연결하는 두 정점의 번호가 주어진다. 어떤 두 정점 사이에 여러 개의 간선이 있을 수 있다. 입력으로 주어지는 간선은 양방향이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 DFS를 수행한 결과를, 그 다음 줄에는 BFS를 수행한 결과를 출력한다. V부터 방문된 점을 순서대로 출력하면 된다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 5 1
1 2
1 3
1 4
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1 2 4 3
1 2 3 4</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 5 3
5 4
5 2
1 2
3 4
3 1</pre></div>
                    <div><strong>출력</strong><pre>3 1 2 5 4
3 1 4 2 5</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>1000 1 1000
999 1000</pre></div>
                    <div><strong>출력</strong><pre>1000 999
1000 999</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000</li>
                    <li>1 ≤ M ≤ 10,000</li>
                    <li>1 ≤ V ≤ N</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: 'DFS 결과와 BFS 결과를 각각 출력하라고 하니까, 앞에서 배운 DFS와 BFS를 둘 다 구현하면 되겠다!<br><br>인접 리스트를 만들고, 정점 번호가 작은 것부터 방문하니까 오름차순 정렬도 해야겠네요.' },
                { title: '근데 이러면 문제가 있어', content: 'DFS를 먼저 돌리면 visited 배열이 전부 True로 채워지잖아요. 그 상태에서 BFS를 돌리면 아무 곳도 방문 못 해요!<br><br>DFS와 BFS에서 <strong>별도의 visited 배열</strong>을 사용하거나, DFS 후에 visited를 초기화해야 합니다.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="margin-bottom:4px;"><span style="color:var(--red);">DFS 후:</span> visited = <span style="padding:2px 6px;background:var(--green);color:white;border-radius:3px;font-size:0.8rem;">T T T T T</span> ← 전부 True!</div><div><span style="color:var(--accent);">해결:</span> visited를 <strong>초기화</strong>하거나 <strong>별도 배열</strong> 사용</div></div>' },
                { title: '이렇게 하면 어떨까?', content: '1. 인접 리스트를 오름차순 정렬<br>2. DFS(재귀)를 수행하며 방문 순서를 기록<br>3. visited를 초기화하고 BFS(큐)를 수행하며 방문 순서를 기록<br>4. 각 결과를 공백으로 구분하여 출력<br><br><span class="lang-py">Python: DFS는 재귀 함수, BFS는 <code>deque</code>로 구현합니다.</span><span class="lang-cpp">C++: DFS는 재귀 함수, BFS는 <code>queue</code>로 구현하고, <code>memset(vis, false, sizeof(vis))</code>로 초기화합니다.</span>' }
            ],
            templates: {
                python: `import sys
from collections import deque
sys.setrecursionlimit(10000)
input = sys.stdin.readline

N, M, V = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort()

# DFS
dfs_result = []
visited_dfs = [False] * (N + 1)

def dfs(v):
    visited_dfs[v] = True
    dfs_result.append(v)
    for u in graph[v]:
        if not visited_dfs[u]:
            dfs(u)

dfs(V)

# BFS
bfs_result = []
visited_bfs = [False] * (N + 1)
queue = deque([V])
visited_bfs[V] = True

while queue:
    v = queue.popleft()
    bfs_result.append(v)
    for u in graph[v]:
        if not visited_bfs[u]:
            visited_bfs[u] = True
            queue.append(u)

print(*dfs_result)
print(*bfs_result)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int N, M, V;
vector<int> graph[1001];
bool vis[1001];

vector<int> dfs_result, bfs_result;

void dfs(int v) {
    vis[v] = true;
    dfs_result.push_back(v);
    for (int u : graph[v])
        if (!vis[u]) dfs(u);
}

void bfs(int start) {
    memset(vis, false, sizeof(vis));
    queue<int> q;
    q.push(start); vis[start] = true;
    while (!q.empty()) {
        int v = q.front(); q.pop();
        bfs_result.push_back(v);
        for (int u : graph[v]) {
            if (!vis[u]) { vis[u] = true; q.push(u); }
        }
    }
}

int main() {
    scanf("%d %d %d", &N, &M, &V);
    for (int i = 0; i < M; i++) {
        int u, v; scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].begin(), graph[i].end());

    dfs(V);
    bfs(V);

    for (int i = 0; i < (int)dfs_result.size(); i++) printf("%d%c", dfs_result[i], i+1<(int)dfs_result.size()?' ':'\\n');
    for (int i = 0; i < (int)bfs_result.size(); i++) printf("%d%c", bfs_result[i], i+1<(int)bfs_result.size()?' ':'\\n');
    return 0;
}`
            },
            solutions: [{
                approach: 'DFS + BFS',
                description: '하나의 그래프에서 DFS와 BFS를 모두 수행하여 방문 순서를 각각 출력합니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구성', desc: '오름차순 방문을 위해 인접 리스트를 정렬합니다.', code: 'import sys\nfrom collections import deque\nsys.setrecursionlimit(10000)\ninput = sys.stdin.readline\n\nN, M, V = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    graph[b].append(a)\nfor i in range(1, N + 1):\n    graph[i].sort()' },
                        { title: 'DFS 수행', desc: '재귀 DFS로 방문 순서를 dfs_result에 기록합니다.', code: 'dfs_result = []\nvisited = [False] * (N + 1)\ndef dfs(v):\n    visited[v] = True\n    dfs_result.append(v)\n    for u in graph[v]:\n        if not visited[u]:\n            dfs(u)\ndfs(V)' },
                        { title: 'BFS 수행 및 출력', desc: '별도의 visited로 BFS를 수행하고 DFS/BFS 결과를 출력합니다.', code: 'bfs_result = []\nvisited2 = [False] * (N + 1)\nq = deque([V])\nvisited2[V] = True\nwhile q:\n    v = q.popleft()\n    bfs_result.append(v)\n    for u in graph[v]:\n        if not visited2[u]:\n            visited2[u] = True\n            q.append(u)\nprint(*dfs_result)\nprint(*bfs_result)' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 구성', desc: '전역 배열 + memset으로 visited 관리', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\n#include <cstring>\nusing namespace std;\n\nint N, M, V;\nvector<int> graph[1001];\nbool vis[1001];\nvector<int> dfs_result, bfs_result;' },
                        { title: 'DFS 수행', desc: '재귀 DFS로 방문 순서를 vector에 기록합니다.', code: 'void dfs(int v) {\n    vis[v] = true;\n    dfs_result.push_back(v);\n    for (int u : graph[v])\n        if (!vis[u]) dfs(u);\n}' },
                        { title: 'BFS 수행 및 출력', desc: 'memset으로 visited 초기화 후 BFS 별도 수행', code: 'int main() {\n    scanf("%d %d %d", &N, &M, &V);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].begin(), graph[i].end());\n\n    dfs(V);\n\n    // BFS: visited\uB97C \uCD08\uAE30\uD654\uD558\uACE0 \uB2E4\uC2DC \uD0D0\uC0C9\n    memset(vis, false, sizeof(vis));\n    queue<int> q;\n    q.push(V); vis[V] = true;\n    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        bfs_result.push_back(v);\n        for (int u : graph[v]) {\n            if (!vis[u]) { vis[u] = true; q.push(u); }\n        }\n    }\n\n    for (int i = 0; i < (int)dfs_result.size(); i++)\n        printf(i ? " %d" : "%d", dfs_result[i]);\n    puts("");\n    for (int i = 0; i < (int)bfs_result.size(); i++)\n        printf(i ? " %d" : "%d", bfs_result[i]);\n    puts("");\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-1012',
            title: 'BOJ 1012 - 유기농 배추',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1012',
            simIntro: '배추밭을 탐색하며 연결된 배추 영역(연결 요소)을 카운트하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>차세대 영농인 한나는 강원도 고랭지에서 , , , 유기농 배추를 재배하기로 하였다. 농약을 쓰지 않고 배추를 재배하려면 배추를 해충으로부터 보호하는 것이 중요하기 때문에, 한나는 해충 방지에 효과적인 배추흰지렁이를 구입하기로 결심한다. 이 지렁이는 배추근처에 서식하며 해충을 잡아 먹음으로써 배추를 보호한다.</p>
                <p>어떤 배추에 배추흰지렁이가 한 마리라도 살고 있으면 이 지렁이는 인접한 다른 배추로 이동할 수 있어, 그 배추들 역시 해충으로부터 보호받을 수 있다. 한 배추의 상하좌우 네 방향에 다른 배추가 위치한 경우에 서로 인접해있는 것이다.</p>
                <p>한나가 배추를 재배하는 땅은 고르지 못해서 배추를 군데군데 , 심어 놓았다. 배추들이 모여있는 곳에는 배추흰지렁이가 한 마리만 있으면 되므로 서로 인접해있는 배추들이 몇 군데에 퍼져있는지 조사하면 총 몇 마리의 지렁이가 필요한지 알 수 있다. 예를 들어 배추밭이 아래와 같이 구성되어 있으면 최소 5마리의 배추흰지렁이가 필요하다.</p>
                <h4>입력</h4>
                <p>입력의 첫 줄에는 테스트 케이스의 개수 T가 주어진다. 그 다음 줄부터 각각의 테스트 케이스에 대해 첫째 줄에는 배추를 심은 배추밭의 가로길이 M(1 ≤ M ≤ 50)과 세로길이 N(1 ≤ N ≤ 50), 그리고 배추가 심어져 있는 위치의 개수 K(1 ≤ K ≤ 2500)이 주어진다. 그 다음 K줄에는 배추의 위치 X(0 ≤ X ≤ M-1), Y(0 ≤ Y ≤ N-1)가 주어진다. 두 배추의 위치가 같은 경우는 없다.</p>
                <h4>출력</h4>
                <p>각 테스트 케이스에 대해 필요한 최소의 배추흰지렁이 마리 수를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>1
5 3 6
0 2
1 2
2 2
3 2
4 2
4 0</pre></div>
                    <div><strong>출력</strong><pre>2</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ T ≤ 10</li>
                    <li>1 ≤ M, N ≤ 50</li>
                    <li>1 ≤ K ≤ 2,500</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '배추밭을 쭉 훑으면서 배추가 있는 칸(1)을 만나면, 거기서부터 상하좌우로 연결된 배추를 전부 찾아야 해요.<br><br>이건 <strong>"연결된 덩어리가 몇 개인가?"</strong>를 묻는 문제네요! 한 덩어리에 지렁이 한 마리면 되니까요.<br><br><div style="display:inline-grid;grid-template-columns:repeat(5,28px);gap:2px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><span style="text-align:center;padding:4px;background:var(--green);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--green);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span></div> <span style="font-size:0.82rem;color:var(--text2);">← 2개 덩어리 = 지렁이 2마리</span>' },
                { title: '근데 어떻게 덩어리를 세지?', content: '격자를 (0,0)부터 쭉 돌면서 배추(1)를 만날 때마다, 그 배추와 연결된 모든 배추를 BFS/DFS로 방문 처리합니다.<br><br>BFS/DFS를 <strong>새로 시작한 횟수</strong> = 덩어리(연결 요소) 수 = 필요한 지렁이 수!' },
                { title: '이렇게 하면 어떨까?', content: '1. 격자를 순회하며 방문하지 않은 배추(1)를 발견<br>2. 그 칸에서 BFS 시작 → 연결된 배추 모두 방문 처리<br>3. count += 1<br>4. 격자 전체를 다 돌 때까지 반복<br><br>4방향 이동: <code>dx = [0, 0, 1, -1]</code>, <code>dy = [1, -1, 0, 0]</code>' },
                { title: '주의할 점', content: '테스트 케이스가 여러 개이므로 매번 <strong>visited 배열을 초기화</strong>해야 해요!<br><br>또한 좌표가 (x, y) 형태로 주어지므로 <code>grid[y][x] = 1</code>로 저장해야 합니다. 행(row)이 y, 열(column)이 x인 거 헷갈리지 마세요!' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]

T = int(input())
for _ in range(T):
    M, N, K = map(int, input().split())
    grid = [[0] * M for _ in range(N)]
    for _ in range(K):
        x, y = map(int, input().split())
        grid[y][x] = 1

    visited = [[False] * M for _ in range(N)]
    count = 0

    for r in range(N):
        for c in range(M):
            if grid[r][c] == 1 and not visited[r][c]:
                # BFS로 연결된 배추 모두 방문
                queue = deque([(r, c)])
                visited[r][c] = True
                while queue:
                    cr, cc = queue.popleft()
                    for d in range(4):
                        nr, nc = cr + dx[d], cc + dy[d]
                        if 0 <= nr < N and 0 <= nc < M:
                            if grid[nr][nc] == 1 and not visited[nr][nc]:
                                visited[nr][nc] = True
                                queue.append((nr, nc))
                count += 1

    print(count)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int dx[] = {0,0,1,-1};
int dy[] = {1,-1,0,0};

int main() {
    int T; scanf("%d", &T);
    while (T--) {
        int M, N, K;
        scanf("%d %d %d", &M, &N, &K);
        vector<vector<int>> grid(N, vector<int>(M, 0));
        vector<vector<bool>> vis(N, vector<bool>(M, false));
        for (int i = 0; i < K; i++) {
            int x, y; scanf("%d %d", &x, &y);
            grid[y][x] = 1;
        }
        int count = 0;
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < M; c++) {
                if (grid[r][c] == 1 && !vis[r][c]) {
                    queue<pair<int,int>> q;
                    q.push({r, c}); vis[r][c] = true;
                    while (!q.empty()) {
                        auto [cr, cc] = q.front(); q.pop();
                        for (int d = 0; d < 4; d++) {
                            int nr = cr+dx[d], nc = cc+dy[d];
                            if (nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nr][nc]==1&&!vis[nr][nc]) {
                                vis[nr][nc] = true;
                                q.push({nr, nc});
                            }
                        }
                    }
                    count++;
                }
            }
        }
        printf("%d\\n", count);
    }
    return 0;
}`
            },
            solutions: [{
                approach: 'BFS 연결 요소',
                description: '배추밭을 BFS로 탐색하며 연결된 배추 영역의 개수를 셉니다.',
                timeComplexity: 'O(N * M)',
                spaceComplexity: 'O(N * M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 맵 구성', desc: '테스트 케이스마다 배추밭 격자를 생성합니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    M, N, K = map(int, input().split())\n    field = [[0] * M for _ in range(N)]\n    for _ in range(K):\n        x, y = map(int, input().split())\n        field[y][x] = 1' },
                        { title: 'BFS 함수 정의', desc: '배추 1을 만나면 BFS로 연결된 영역을 모두 방문합니다.', code: '    dx = [0, 0, 1, -1]\n    dy = [1, -1, 0, 0]\n    visited = [[False]*M for _ in range(N)]\n    def bfs(sy, sx):\n        q = deque([(sy, sx)])\n        visited[sy][sx] = True\n        while q:\n            y, x = q.popleft()\n            for d in range(4):\n                ny, nx = y+dy[d], x+dx[d]\n                if 0<=ny<N and 0<=nx<M and not visited[ny][nx] and field[ny][nx]==1:\n                    visited[ny][nx] = True\n                    q.append((ny, nx))' },
                        { title: '연결 요소 카운트', desc: '미방문 배추를 발견할 때마다 BFS 시작 → 지렁이 수 증가.', code: '    count = 0\n    for i in range(N):\n        for j in range(M):\n            if field[i][j] == 1 and not visited[i][j]:\n                bfs(i, j)\n                count += 1\n    print(count)' }
                    ],
                    cpp: [
                        { title: '입력 및 맵 구성', desc: 'pair<int,int>로 BFS 큐 구성', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint dx[] = {0, 0, 1, -1};\nint dy[] = {1, -1, 0, 0};\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int M, N, K;\n        scanf("%d %d %d", &M, &N, &K);\n        vector<vector<int>> field(N, vector<int>(M, 0));\n        vector<vector<bool>> vis(N, vector<bool>(M, false));\n        for (int i = 0; i < K; i++) {\n            int x, y;\n            scanf("%d %d", &x, &y);\n            field[y][x] = 1;\n        }' },
                        { title: 'BFS 함수 정의', desc: 'queue<pair<int,int>>와 structured binding 사용', code: '        int count = 0;\n        for (int r = 0; r < N; r++) {\n            for (int c = 0; c < M; c++) {\n                if (field[r][c] == 1 && !vis[r][c]) {\n                    // BFS\uB85C \uC5F0\uACB0\uB41C \uBC30\uCD94 \uBAA8\uB450 \uBC29\uBB38\n                    queue<pair<int,int>> q;\n                    q.push({r, c});\n                    vis[r][c] = true;\n                    while (!q.empty()) {\n                        auto [cr, cc] = q.front(); q.pop();\n                        for (int d = 0; d < 4; d++) {\n                            int nr = cr+dx[d], nc = cc+dy[d];\n                            if (nr>=0 && nr<N && nc>=0 && nc<M\n                                && field[nr][nc]==1 && !vis[nr][nc]) {\n                                vis[nr][nc] = true;\n                                q.push({nr, nc});\n                            }\n                        }\n                    }' },
                        { title: '연결 요소 카운트', desc: 'BFS가 끝날 때마다 count를 증가시켜 영역 수를 셉니다.', code: '                    count++;\n                }\n            }\n        }\n        printf("%d\\n", count);\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[6].templates; }
            }]
        },
        {
            id: 'boj-2667',
            title: 'BOJ 2667 - 단지번호붙이기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2667',
            simIntro: '지도에서 연결된 집 단지를 찾고, 각 단지의 크기를 계산하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p><그림 1>과 같이 정사각형 모양의 지도가 있다. 1은 집이 있는 곳을, 0은 집이 없는 곳을 나타낸다. 철수는 이 지도를 가지고 연결된 집의 모임인 단지를 정의하고, 단지에 번호를 붙이려 한다. 여기서 연결되었다는 것은 어떤 집이 좌우, 혹은 아래위로 다른 집이 있는 경우를 말한다. 대각선상에 집이 있는 경우는 연결된 것이 아니다.</p>
                <p>지도를 입력하여 단지수를 출력하고, 각 단지에 속하는 집의 수를 오름차순으로 정렬하여 출력하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫 번째 줄에는 지도의 크기 N(정사각형이므로 가로와 세로의 크기는 같으며 5 ≤ N ≤ 25)이 입력되고, 그 다음 N줄에는 각각 N개의 자료(0 혹은 1)가 입력된다.</p>
                <h4>출력</h4>
                <p>첫 번째 줄에는 총 단지수를 출력하시오. 그리고 각 단지내 집의 수를 오름차순으로 정렬하여 한 줄에 하나씩 출력하시오.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>7
0110100
0110101
1110101
0000111
0100000
0111110
0111000</pre></div>
                    <div><strong>출력</strong><pre>3
7
8
9</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>5 ≤ N ≤ 25</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '1012번(유기농 배추)처럼 연결된 집 덩어리(단지)를 찾으면 되겠다! 격자를 훑으면서 집(1)을 만나면 BFS/DFS로 연결된 집을 전부 탐색하고...' },
                { title: '근데 이러면 문제가 있어', content: '1012번과 달리 이번에는 단지의 <strong>개수</strong>뿐만 아니라, 각 단지에 속하는 <strong>집의 수</strong>도 구해야 해요!<br><br>그리고 결과를 <strong>오름차순 정렬</strong>해서 출력해야 합니다.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="margin-bottom:4px;">BFS 탐색 중 방문 칸 수를 <code>cnt</code>로 세기:</div><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;"><span style="padding:3px 10px;background:var(--accent);color:white;border-radius:4px;">단지1: 7</span><span style="padding:3px 10px;background:#00b894;color:white;border-radius:4px;">단지2: 8</span><span style="padding:3px 10px;background:var(--yellow);color:#333;border-radius:4px;">단지3: 9</span><span style="color:var(--text3);">→ 정렬: 7, 8, 9</span></div></div>' },
                { title: '이렇게 하면 어떨까?', content: 'BFS를 돌릴 때 방문한 칸의 수를 세면 됩니다:<br>1. 격자 순회 중 방문하지 않은 집(1) 발견<br>2. BFS 시작, 방문하는 칸마다 <code>cnt += 1</code><br>3. BFS 끝나면 <code>sizes.append(cnt)</code><br>4. 모든 탐색 후 <code>sizes</code>를 오름차순 정렬하여 출력<br><br><span class="lang-py">Python: <code>sizes.sort()</code>로 정렬 후 출력</span><span class="lang-cpp">C++: <code>sort(sizes.begin(), sizes.end())</code>로 정렬 후 출력</span>' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N = int(input())
grid = []
for _ in range(N):
    grid.append(list(map(int, input().strip())))

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]
visited = [[False] * N for _ in range(N)]
sizes = []

for r in range(N):
    for c in range(N):
        if grid[r][c] == 1 and not visited[r][c]:
            queue = deque([(r, c)])
            visited[r][c] = True
            cnt = 0
            while queue:
                cr, cc = queue.popleft()
                cnt += 1
                for d in range(4):
                    nr, nc = cr + dx[d], cc + dy[d]
                    if 0 <= nr < N and 0 <= nc < N:
                        if grid[nr][nc] == 1 and not visited[nr][nc]:
                            visited[nr][nc] = True
                            queue.append((nr, nc))
            sizes.append(cnt)

sizes.sort()
print(len(sizes))
for s in sizes:
    print(s)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int N;
int grid[25][25];
bool vis[25][25];
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int main() {
    scanf("%d", &N);
    for (int i = 0; i < N; i++) {
        char s[30]; scanf("%s", s);
        for (int j = 0; j < N; j++) grid[i][j] = s[j] - '0';
    }

    vector<int> sizes;
    for (int r = 0; r < N; r++) for (int c = 0; c < N; c++) {
        if (grid[r][c] == 1 && !vis[r][c]) {
            queue<pair<int,int>> q;
            q.push({r, c}); vis[r][c] = true;
            int cnt = 0;
            while (!q.empty()) {
                auto [cr, cc] = q.front(); q.pop();
                cnt++;
                for (int d = 0; d < 4; d++) {
                    int nr = cr+dx[d], nc = cc+dy[d];
                    if (nr>=0&&nr<N&&nc>=0&&nc<N&&grid[nr][nc]==1&&!vis[nr][nc]) {
                        vis[nr][nc] = true; q.push({nr,nc});
                    }
                }
            }
            sizes.push_back(cnt);
        }
    }
    sort(sizes.begin(), sizes.end());
    printf("%d\\n", (int)sizes.size());
    for (int s : sizes) printf("%d\\n", s);
    return 0;
}`
            },
            solutions: [{
                approach: 'BFS 연결 요소 + 크기',
                description: '지도에서 BFS로 연결된 집 단지를 찾고 각 단지의 크기를 오름차순 출력합니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: '입력 및 지도 구성', desc: '문자열을 리스트로 변환하여 격자를 만듭니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN = int(input())\nboard = []\nfor _ in range(N):\n    board.append(list(input().strip()))' },
                        { title: 'BFS 탐색 함수', desc: 'BFS로 연결된 집을 모두 방문하며 단지 크기를 반환합니다.', code: 'dx = [0, 0, 1, -1]\ndy = [1, -1, 0, 0]\nvisited = [[False]*N for _ in range(N)]\n\ndef bfs(sy, sx):\n    q = deque([(sy, sx)])\n    visited[sy][sx] = True\n    cnt = 1\n    while q:\n        y, x = q.popleft()\n        for d in range(4):\n            ny, nx = y+dy[d], x+dx[d]\n            if 0<=ny<N and 0<=nx<N and not visited[ny][nx] and board[ny][nx]=="1":\n                visited[ny][nx] = True\n                q.append((ny, nx))\n                cnt += 1\n    return cnt' },
                        { title: '단지 찾기 및 출력', desc: '각 단지 크기를 수집하고 오름차순 정렬하여 출력합니다.', code: 'sizes = []\nfor i in range(N):\n    for j in range(N):\n        if board[i][j] == "1" and not visited[i][j]:\n            sizes.append(bfs(i, j))\nsizes.sort()\nprint(len(sizes))\nfor s in sizes:\n    print(s)' }
                    ],
                    cpp: [
                        { title: '입력 및 지도 구성', desc: 'char 배열로 문자열 입력 후 숫자 변환', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint N;\nint grid[25][25];\nbool vis[25][25];\nint dx[] = {0, 0, 1, -1};\nint dy[] = {1, -1, 0, 0};\n\nint main() {\n    scanf("%d", &N);\n    for (int i = 0; i < N; i++) {\n        char s[30];\n        scanf("%s", s);\n        for (int j = 0; j < N; j++)\n            grid[i][j] = s[j] - \'0\'; // \uBB38\uC790 -> \uC22B\uC790 \uBCC0\uD658\n    }' },
                        { title: 'BFS 탐색 함수', desc: 'pair<int,int> \uD050\uB85C \uACA9\uC790 BFS', code: '    vector<int> sizes;\n    for (int r = 0; r < N; r++) {\n        for (int c = 0; c < N; c++) {\n            if (grid[r][c] == 1 && !vis[r][c]) {\n                queue<pair<int,int>> q;\n                q.push({r, c});\n                vis[r][c] = true;\n                int cnt = 0;\n                while (!q.empty()) {\n                    auto [cr, cc] = q.front(); q.pop();\n                    cnt++;\n                    for (int d = 0; d < 4; d++) {\n                        int nr = cr+dx[d], nc = cc+dy[d];\n                        if (nr>=0 && nr<N && nc>=0 && nc<N\n                            && grid[nr][nc]==1 && !vis[nr][nc]) {\n                            vis[nr][nc] = true;\n                            q.push({nr, nc});\n                        }\n                    }\n                }\n                sizes.push_back(cnt);\n            }\n        }\n    }' },
                        { title: '단지 찾기 및 출력', desc: '크기 배열을 정렬하여 단지 수와 각 크기를 출력합니다.', code: '    sort(sizes.begin(), sizes.end());\n    printf("%d\\n", (int)sizes.size());\n    for (int s : sizes)\n        printf("%d\\n", s);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[7].templates; }
            }]
        },
        {
            id: 'boj-2178',
            title: 'BOJ 2178 - 미로 탐색',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2178',
            simIntro: '미로에서 (1,1)부터 (N,M)까지 BFS 최단 경로를 탐색하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×M크기의 배열로 표현되는 미로가 있다. 미로에서 1은 이동할 수 있는 칸을 나타내고, 0은 이동할 수 없는 칸을 나타낸다. 이러한 미로가 주어졌을 때, (1, 1)에서 출발하여 (N, M)의 위치로 이동할 때 지나야 하는 최소의 칸 수를 구하는 프로그램을 작성하시오. 한 칸에서 다른 칸으로 이동할 때, 서로 인접한 칸으로만 이동할 수 있다.</p>
                <p>위의 예에서는 15칸을 지나야 (N, M)의 위치로 이동할 수 있다. 칸을 셀 때에는 시작 위치와 도착 위치도 포함한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 두 정수 N, M(2 ≤ N, M ≤ 100)이 주어진다. 다음 N개의 줄에는 M개의 정수로 미로가 주어진다. 각각의 수들은 <strong>붙어서</strong> 입력으로 주어진다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 지나야 하는 최소의 칸 수를 출력한다. 항상 도착위치로 이동할 수 있는 경우만 입력으로 주어진다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 6
101111
101010
101011
111011</pre></div>
                    <div><strong>출력</strong><pre>15</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 6
110110
110110
111111
111101</pre></div>
                    <div><strong>출력</strong><pre>9</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>2 ≤ N, M ≤ 100</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '미로에서 (1,1)부터 (N,M)까지 가는 <strong>최단 경로</strong>를 찾아야 해요. DFS로 모든 경로를 탐색하고 그중 가장 짧은 걸 고르면 되지 않을까?' },
                { title: '근데 이러면 문제가 있어', content: 'DFS는 모든 가능한 경로를 탐색하니까 시간이 오래 걸려요. 미로가 100x100이면 경로 수가 엄청나게 많아질 수 있어요!<br><br>최단 거리를 구할 때는 <strong>BFS</strong>가 훨씬 효율적입니다. BFS는 가까운 곳부터 탐색하니까, 도착점에 처음 도달했을 때가 바로 최단 거리!<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><span style="color:var(--red);">DFS:</span> <span style="color:var(--text2);">모든 경로 탐색 → 느림</span></div><div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap;"><span style="color:var(--green);font-weight:600;">BFS:</span> <span style="color:var(--text);">가까운 곳부터 → 처음 도달 = 최단!</span></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '(0,0)에서 BFS를 시작하고, 이동할 때마다 거리를 +1씩 기록합니다:<br><code>dist[nr][nc] = dist[r][c] + 1</code><br><br>시작칸도 포함해서 세니까 <code>dist[0][0] = 1</code>로 시작하고, <code>dist[N-1][M-1]</code>이 정답입니다.' },
                { title: '구현 팁', content: '입력이 공백 없이 붙어 있으므로 한 줄씩 읽어서 문자 단위로 파싱해야 해요:<br><span class="lang-py">Python: <code>list(map(int, input().strip()))</code>으로 각 자릿수를 리스트로 변환</span><span class="lang-cpp">C++: <code>char s[110]; scanf("%s", s);</code>로 문자열로 읽은 뒤 <code>s[j] - \'0\'</code>으로 숫자 변환</span>' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N, M = map(int, input().split())
grid = []
for _ in range(N):
    grid.append(list(map(int, input().strip())))

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]
dist = [[-1] * M for _ in range(N)]
dist[0][0] = 1
queue = deque([(0, 0)])

while queue:
    r, c = queue.popleft()
    for d in range(4):
        nr, nc = r + dx[d], c + dy[d]
        if 0 <= nr < N and 0 <= nc < M:
            if grid[nr][nc] == 1 and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))

print(dist[N-1][M-1])`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<string> grid(N);
    for (int i = 0; i < N; i++) { char s[110]; scanf("%s", s); grid[i] = s; }

    int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};
    vector<vector<int>> dist(N, vector<int>(M, -1));
    dist[0][0] = 1;
    queue<pair<int,int>> q;
    q.push({0, 0});

    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r+dx[d], nc = c+dy[d];
            if (nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nr][nc]=='1'&&dist[nr][nc]==-1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
    printf("%d\\n", dist[N-1][M-1]);
    return 0;
}`
            },
            solutions: [{
                approach: 'BFS 최단 거리',
                description: 'BFS로 미로의 (1,1)에서 (N,M)까지 최단 경로를 탐색합니다.',
                timeComplexity: 'O(N * M)',
                spaceComplexity: 'O(N * M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 미로 구성', desc: '공백 없이 붙어있는 입력을 리스트로 변환합니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\nmaze = []\nfor _ in range(N):\n    maze.append(list(input().strip()))' },
                        { title: 'BFS 탐색', desc: '시작칸 (0,0)을 1로 세팅하고 BFS를 준비합니다.', code: 'dist = [[0]*M for _ in range(N)]\ndist[0][0] = 1\nq = deque([(0, 0)])\ndx = [0, 0, 1, -1]\ndy = [1, -1, 0, 0]' },
                        { title: 'BFS 루프 및 출력', desc: '인접 칸의 거리를 +1씩 기록하며 도착점 거리를 출력합니다.', code: 'while q:\n    y, x = q.popleft()\n    for d in range(4):\n        ny, nx = y+dy[d], x+dx[d]\n        if 0<=ny<N and 0<=nx<M and maze[ny][nx]=="1" and dist[ny][nx]==0:\n            dist[ny][nx] = dist[y][x] + 1\n            q.append((ny, nx))\nprint(dist[N-1][M-1])' }
                    ],
                    cpp: [
                        { title: '입력 및 미로 구성', desc: 'char \uBC30\uC5F4\uB85C \uBB38\uC790\uC5F4 \uC785\uB825, string \uB300\uC2E0 scanf', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<string> maze(N);\n    for (int i = 0; i < N; i++) {\n        char s[110];\n        scanf("%s", s);\n        maze[i] = s;\n    }' },
                        { title: 'BFS 탐색', desc: 'dist를 -1로 초기화, 시작칸은 1로 세팅합니다.', code: '    int dx[] = {0, 0, 1, -1};\n    int dy[] = {1, -1, 0, 0};\n    // dist \uBC30\uC5F4: -1\uC774\uBA74 \uBBF8\uBC29\uBB38, 1\uBD80\uD130 \uC2DC\uC791(\uC2DC\uC791\uCE78 \uD3EC\uD568)\n    vector<vector<int>> dist(N, vector<int>(M, -1));\n    dist[0][0] = 1;\n    queue<pair<int,int>> q;\n    q.push({0, 0});' },
                        { title: 'BFS 루프 및 출력', desc: '4방향 탐색으로 최단 거리를 기록하고 도착점 값을 출력합니다.', code: '    while (!q.empty()) {\n        auto [r, c] = q.front(); q.pop();\n        for (int d = 0; d < 4; d++) {\n            int nr = r+dx[d], nc = c+dy[d];\n            if (nr>=0 && nr<N && nc>=0 && nc<M\n                && maze[nr][nc]==\'1\' && dist[nr][nc]==-1) {\n                dist[nr][nc] = dist[r][c] + 1;\n                q.push({nr, nc});\n            }\n        }\n    }\n    printf("%d\\n", dist[N-1][M-1]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[8].templates; }
            }]
        },
        {
            id: 'boj-1697',
            title: 'BOJ 1697 - 숨바꼭질',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1697',
            simIntro: '수빈이가 동생을 찾기 위해 BFS로 최소 이동 횟수를 구하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>수빈이는 현재 점 N(0 ≤ N ≤ 100,000)에 있고, 동생은 점 K(0 ≤ K ≤ 100,000)에 있다. 수빈이는 걷거나 순간이동을 할 수 있다. 만약 수빈이의 위치가 X일 때 걷는다면 1초 후에 X-1 또는 X+1로 이동하게 된다. 순간이동을 하는 경우에는 1초 후에 2*X의 위치로 이동하게 된다.</p>
                <p>수빈이와 동생의 위치가 주어졌을 때, 수빈이가 동생을 찾을 수 있는 가장 빠른 시간이 몇 초 후인지 구하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫 번째 줄에 수빈이가 있는 위치 N과 동생이 있는 위치 K가 주어진다. N과 K는 정수이다.</p>
                <h4>출력</h4>
                <p>수빈이가 동생을 찾는 가장 빠른 시간을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 17</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>0 0</pre></div>
                    <div><strong>출력</strong><pre>0</pre></div>
                </div><p class="example-explain">수빈이와 동생이 같은 위치에 있으면 이동할 필요가 없습니다.</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>0 ≤ N ≤ 100,000</li>
                    <li>0 ≤ K ≤ 100,000</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '수빈이는 현재 위치 N에서 X-1, X+1, 2*X 세 가지로 이동할 수 있어요. 모든 가능한 이동을 시도해서 동생 K에 도달하면 되지 않을까?<br><br>근데 이건 어디서 많이 본 것 같지 않아요?' },
                { title: '근데 이러면 문제가 있어', content: '무작정 모든 이동을 시도하면 같은 위치를 계속 왔다 갔다 할 수 있어요. 그리고 <strong>가장 빠른</strong> 시간을 구해야 하니까...<br><br>잠깐, 이건 <strong>그래프 문제</strong>로 바꿀 수 있어요! 각 좌표를 <strong>정점</strong>, 이동(X-1, X+1, 2X)을 <strong>간선</strong>으로 생각하면 BFS로 최단 거리를 구할 수 있습니다!<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div style="width:30px;height:30px;border-radius:50%;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">5</div><span style="color:var(--text3);">→</span><div style="padding:2px 8px;background:var(--bg2);border-radius:4px;font-size:0.8rem;">-1</div><div style="padding:2px 8px;background:var(--bg2);border-radius:4px;font-size:0.8rem;">+1</div><div style="padding:2px 8px;background:var(--yellow);color:#333;border-radius:4px;font-size:0.8rem;font-weight:600;">x2</div><span style="color:var(--text3);margin-left:4px;">← 3가지 이동 = 3개 간선</span></div>' },
                { title: '이렇게 하면 어떨까?', content: 'N에서 BFS를 시작하고, 각 위치에서 세 방향으로 이동합니다:<br>1. X-1 (뒤로 걷기)<br>2. X+1 (앞으로 걷기)<br>3. 2*X (순간이동)<br><br>BFS이니까 K에 처음 도달했을 때가 바로 최소 시간입니다!<br>예: 5 → 10 → 9 → 18 → 17 (4초)' },
                { title: '주의할 점', content: '위치 범위가 0~100,000이므로 <code>dist</code> 배열 크기를 100,001로 잡아야 해요.<br>이동한 위치가 0 미만이거나 100,000을 초과하면 무시해야 합니다!<br><br><span class="lang-py">Python: <code>for nx in (x-1, x+1, x*2):</code>로 세 방향 이동</span><span class="lang-cpp">C++: <code>for (int nx : {x-1, x+1, 2*x}):</code>로 세 방향 이동</span>' }
            ],
            templates: {
                python: `from collections import deque

N, K = map(int, input().split())

MAX = 100001
dist = [-1] * MAX
dist[N] = 0
queue = deque([N])

while queue:
    x = queue.popleft()
    if x == K:
        print(dist[x])
        break
    for nx in [x - 1, x + 1, 2 * x]:
        if 0 <= nx < MAX and dist[nx] == -1:
            dist[nx] = dist[x] + 1
            queue.append(nx)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int dist[100001];

int main() {
    int N, K;
    scanf("%d %d", &N, &K);
    memset(dist, -1, sizeof(dist));
    dist[N] = 0;
    queue<int> q;
    q.push(N);

    while (!q.empty()) {
        int x = q.front(); q.pop();
        if (x == K) { printf("%d\\n", dist[x]); return 0; }
        for (int nx : {x-1, x+1, 2*x}) {
            if (nx >= 0 && nx <= 100000 && dist[nx] == -1) {
                dist[nx] = dist[x] + 1;
                q.push(nx);
            }
        }
    }
    return 0;
}`
            },
            solutions: [{
                approach: 'BFS 최단 이동',
                description: '수빈이의 위치에서 +1, -1, *2 이동을 BFS로 탐색하여 최소 시간을 구합니다.',
                timeComplexity: 'O(max_pos)',
                spaceComplexity: 'O(max_pos)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '수빈이 위치 N과 동생 위치 K를 입력받습니다.', code: 'from collections import deque\n\nN, K = map(int, input().split())' },
                        { title: 'BFS 탐색', desc: 'visited를 -1로 초기화, 시작점을 0으로 설정합니다.', code: 'MAX = 100001\nvisited = [-1] * MAX\nvisited[N] = 0\nq = deque([N])' },
                        { title: 'BFS 루프 및 출력', desc: 'X-1, X+1, 2*X 세 방향 이동을 BFS로 탐색합니다.', code: 'while q:\n    x = q.popleft()\n    if x == K:\n        print(visited[x])\n        break\n    for nx in (x-1, x+1, x*2):\n        if 0 <= nx < MAX and visited[nx] == -1:\n            visited[nx] = visited[x] + 1\n            q.append(nx)' }
                    ],
                    cpp: [
                        { title: '입력', desc: '전역 dist 배열로 0~100000 범위의 거리를 관리합니다.', code: '#include <iostream>\n#include <queue>\n#include <cstring>\nusing namespace std;\n\nint dist[100001]; // \uAC01 \uC704\uCE58\uAE4C\uC9C0\uC758 \uCD5C\uC18C \uC774\uB3D9 \uD69F\uC218\n\nint main() {\n    int N, K;\n    scanf("%d %d", &N, &K);' },
                        { title: 'BFS 탐색', desc: 'memset\uC73C\uB85C -1 \uCD08\uAE30\uD654, initializer list\uB85C 3\uBC29\uD5A5 \uC774\uB3D9', code: '    memset(dist, -1, sizeof(dist));\n    dist[N] = 0;\n    queue<int> q;\n    q.push(N);' },
                        { title: 'BFS 루프 및 출력', desc: '목표 위치 K에 도달하면 최소 이동 횟수를 출력합니다.', code: '    while (!q.empty()) {\n        int x = q.front(); q.pop();\n        if (x == K) {\n            printf("%d\\n", dist[x]);\n            return 0;\n        }\n        // X-1, X+1, 2*X \uC138 \uBC29\uD5A5 \uC774\uB3D9\n        for (int nx : {x-1, x+1, 2*x}) {\n            if (nx >= 0 && nx <= 100000 && dist[nx] == -1) {\n                dist[nx] = dist[x] + 1;\n                q.push(nx);\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[9].templates; }
            }]
        },
        {
            id: 'boj-7562',
            title: 'BOJ 7562 - 나이트의 이동',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/7562',
            simIntro: '체스판 위 나이트가 BFS로 목표 위치까지 최소 이동 횟수를 구하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>체스판 위에 한 나이트가 놓여져 있다. 나이트가 한 번에 이동할 수 있는 칸은 아래 그림에 나와있다. 나이트가 이동하려고 하는 칸이 주어진다. 나이트는 몇 번 움직이면 이 칸으로 이동할 수 있을까?</p>
                <h4>입력</h4>
                <p>입력의 첫째 줄에는 테스트 케이스의 개수가 주어진다.</p>
                <p>각 테스트 케이스는 세 줄로 이루어져 있다. 첫째 줄에는 체스판의 한 변의 길이 l(4 ≤ l ≤ 300)이 주어진다. 체스판의 크기는 l × l이다. 체스판의 각 칸은 두 수의 쌍 {0, ..., l-1} × {0, ..., l-1}로 나타낼 수 있다. 둘째 줄과 셋째 줄에는 나이트가 현재 있는 칸, 나이트가 이동하려고 하는 칸이 주어진다.</p>
                <h4>출력</h4>
                <p>각 테스트 케이스마다 나이트가 최소 몇 번만에 이동할 수 있는지 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3
8
0 0
7 0
100
0 0
30 50
10
1 1
1 1</pre></div>
                    <div><strong>출력</strong><pre>5
28
0</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>4 ≤ I ≤ 300 (체스판 한 변의 길이)</li>
                    <li>T ≤ 100 (테스트 케이스 수)</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '나이트가 목표 칸까지 가는 <strong>최소 이동 횟수</strong>를 구해야 해요. 나이트는 L자 모양으로 8방향 이동이 가능하죠.<br><br>이전 문제(숨바꼭질)처럼 <strong>최단 거리 = BFS</strong>를 떠올려 봅시다!' },
                { title: '근데 이러면 문제가 있어', content: '미로 탐색은 상하좌우 4방향이었는데, 나이트는 <strong>8방향</strong>이에요. 이 8방향을 어떻게 표현하지?<br><br>나이트는 가로 2 + 세로 1, 또는 가로 1 + 세로 2로 이동하니까 dx/dy 배열로 8가지 조합을 만들면 됩니다!<br><br><div style="display:inline-grid;grid-template-columns:repeat(5,24px);gap:2px;padding:6px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--accent);color:white;font-size:0.7rem;border-radius:3px;font-weight:700;">N</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span></div> <span style="font-size:0.82rem;color:var(--text2);">← 나이트 8방향</span>' },
                { title: '이렇게 하면 어떨까?', content: '나이트의 8방향 이동:<br><code>dx = [-2, -2, -1, -1, 1, 1, 2, 2]</code><br><code>dy = [-1, 1, -2, 2, -2, 2, -1, 1]</code><br><br>시작칸에서 BFS를 돌리면, 목표칸에 처음 도달했을 때가 최소 이동 횟수입니다. 미로 탐색과 동일한 패턴이에요!' },
                { title: '주의할 점', content: '시작 위치와 도착 위치가 같으면 0을 바로 출력해야 해요!<br><br>테스트 케이스가 여러 개이므로, 매번 <code>dist</code> 배열을 새로 초기화해야 합니다.' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

dx = [-2, -2, -1, -1, 1, 1, 2, 2]
dy = [-1, 1, -2, 2, -2, 2, -1, 1]

T = int(input())
for _ in range(T):
    I = int(input())
    sr, sc = map(int, input().split())
    er, ec = map(int, input().split())

    if sr == er and sc == ec:
        print(0)
        continue

    dist = [[-1] * I for _ in range(I)]
    dist[sr][sc] = 0
    queue = deque([(sr, sc)])

    while queue:
        r, c = queue.popleft()
        if r == er and c == ec:
            print(dist[r][c])
            break
        for d in range(8):
            nr, nc = r + dx[d], c + dy[d]
            if 0 <= nr < I and 0 <= nc < I and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int dx[] = {-2,-2,-1,-1,1,1,2,2};
int dy[] = {-1,1,-2,2,-2,2,-1,1};

int main() {
    int T; scanf("%d", &T);
    while (T--) {
        int I; scanf("%d", &I);
        int sr, sc, er, ec;
        scanf("%d %d %d %d", &sr, &sc, &er, &ec);
        if (sr==er && sc==ec) { puts("0"); continue; }

        vector<vector<int>> dist(I, vector<int>(I, -1));
        dist[sr][sc] = 0;
        queue<pair<int,int>> q;
        q.push({sr, sc});

        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            if (r==er && c==ec) { printf("%d\\n", dist[r][c]); break; }
            for (int d = 0; d < 8; d++) {
                int nr = r+dx[d], nc = c+dy[d];
                if (nr>=0&&nr<I&&nc>=0&&nc<I&&dist[nr][nc]==-1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    q.push({nr, nc});
                }
            }
        }
    }
    return 0;
}`
            },
            solutions: [{
                approach: 'BFS 나이트 이동',
                description: '체스판에서 나이트의 8방향 이동을 BFS로 탐색하여 최소 이동 수를 구합니다.',
                timeComplexity: 'O(L^2)',
                spaceComplexity: 'O(L^2)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기화', desc: '나이트의 8방향 이동을 튜플 리스트로 정의합니다.', code: 'from collections import deque\nimport sys\ninput = sys.stdin.readline\n\nT = int(input())\nmoves = [(-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1)]' },
                        { title: 'BFS 탐색', desc: '테스트 케이스마다 dist 배열을 초기화하고 BFS를 준비합니다.', code: 'for _ in range(T):\n    L = int(input())\n    sx, sy = map(int, input().split())\n    ex, ey = map(int, input().split())\n    dist = [[-1]*L for _ in range(L)]\n    dist[sx][sy] = 0\n    q = deque([(sx, sy)])' },
                        { title: 'BFS 루프 및 출력', desc: '8방향 이동으로 목표에 도달하면 최소 이동 수를 출력합니다.', code: '    while q:\n        x, y = q.popleft()\n        if x == ex and y == ey:\n            print(dist[x][y])\n            break\n        for dx, dy in moves:\n            nx, ny = x+dx, y+dy\n            if 0<=nx<L and 0<=ny<L and dist[nx][ny]==-1:\n                dist[nx][ny] = dist[x][y] + 1\n                q.append((nx, ny))' }
                    ],
                    cpp: [
                        { title: '입력 및 초기화', desc: '\uB098\uC774\uD2B8 8\uBC29\uD5A5 \uC774\uB3D9\uC744 dx/dy \uBC30\uC5F4\uB85C \uC815\uC758', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\n// \uB098\uC774\uD2B8\uC758 8\uBC29\uD5A5 \uC774\uB3D9\nint dx[] = {-2, -2, -1, -1, 1, 1, 2, 2};\nint dy[] = {-1, 1, -2, 2, -2, 2, -1, 1};\n\nint main() {\n    int T;\n    scanf("%d", &T);' },
                        { title: 'BFS 탐색', desc: '시작==도착이면 바로 0 출력, 아니면 BFS 시작합니다.', code: '    while (T--) {\n        int L;\n        scanf("%d", &L);\n        int sr, sc, er, ec;\n        scanf("%d %d %d %d", &sr, &sc, &er, &ec);\n        if (sr == er && sc == ec) { puts("0"); continue; }\n\n        vector<vector<int>> dist(L, vector<int>(L, -1));\n        dist[sr][sc] = 0;\n        queue<pair<int,int>> q;\n        q.push({sr, sc});' },
                        { title: 'BFS 루프 및 출력', desc: '8방향 BFS로 목표 도달 시 최소 이동 수를 출력합니다.', code: '        while (!q.empty()) {\n            auto [r, c] = q.front(); q.pop();\n            if (r == er && c == ec) {\n                printf("%d\\n", dist[r][c]);\n                break;\n            }\n            for (int d = 0; d < 8; d++) {\n                int nr = r+dx[d], nc = c+dy[d];\n                if (nr>=0 && nr<L && nc>=0 && nc<L && dist[nr][nc]==-1) {\n                    dist[nr][nc] = dist[r][c] + 1;\n                    q.push({nr, nc});\n                }\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[10].templates; }
            }]
        },
        {
            id: 'boj-7576',
            title: 'BOJ 7576 - 토마토',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/7576',
            simIntro: '여러 익은 토마토에서 동시에 BFS를 시작하여 모든 토마토가 익는 최소 일수를 구합니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>철수의 토마토 농장에서는 토마토를 보관하는 큰 창고를 가지고 있다. 토마토는 아래의 그림과 같이 격자 모양 상자의 칸에 하나씩 넣어서 창고에 보관한다.</p>
                <p>창고에 보관되는 토마토들 중에는 잘 익은 것도 있지만, 아직 익지 않은 토마토들도 있을 수 있다. 보관 후 하루가 지나면, 익은 토마토들의 인접한 곳에 있는 익지 않은 토마토들은 익은 토마토의 영향을 받아 익게 된다. 하나의 토마토의 인접한 곳은 왼쪽, 오른쪽, 앞, 뒤 네 방향에 있는 토마토를 의미한다. 대각선 방향에 있는 토마토들에게는 영향을 주지 못하며, 토마토가 혼자 저절로 익는 경우는 없다고 가정한다.</p>
                <p>창고에 보관된 토마토들이 며칠이 지나면 다 익게 되는지, 그 최소 일수를 구하는 프로그램을 작성하라. 단, 상자의 일부 칸에는 토마토가 들어있지 않을 수도 있다. 정수 1은 익은 토마토, 정수 0은 익지 않은 토마토, 정수 -1은 토마토가 들어있지 않은 칸을 나타낸다.</p>
                <p>토마토가 모두 익지는 못하는 상황이면 -1을 출력한다. 저장될 때부터 모든 토마토가 익어있는 상태이면 0을 출력한다.</p>
                <h4>입력</h4>
                <p>첫 줄에는 상자의 크기를 나타내는 두 정수 M, N이 주어진다. M은 상자의 가로 칸의 수, N은 상자의 세로 칸의 수를 나타낸다. 단, 2 ≤ M, N ≤ 1,000 이다. 둘째 줄부터는 하나의 상자에 저장된 토마토들의 정보가 주어진다. 즉, 둘째 줄부터 N개의 줄에는 상자에 담긴 토마토의 정보가 주어진다. 하나의 줄에는 상자 가로줄에 들어있는 토마토의 상태가 M개의 정수로 주어진다. 정수 1은 익은 토마토, 정수 0은 익지 않은 토마토, 정수 -1은 토마토가 들어있지 않은 칸을 나타낸다.</p>
                <p>토마토가 하나 이상 있는 경우만 입력으로 주어진다.</p>
                <h4>출력</h4>
                <p>여러분은 토마토가 모두 익을 때까지의 최소 날짜를 출력해야 한다. 만약, 저장될 때부터 모든 토마토가 익어있는 상태이면 0을 출력해야 하고, 토마토가 모두 익지는 못하는 상황이면 -1을 출력해야 한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6 4
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 1</pre></div>
                    <div><strong>출력</strong><pre>8</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6 4
0 0 -1 0 0 0
0 0 1 0 -1 0
0 0 -1 0 0 0
0 0 0 0 -1 1</pre></div>
                    <div><strong>출력</strong><pre>6</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6 4
1 -1 0 0 0 0
0 -1 0 0 0 0
0 0 0 0 -1 0
0 0 0 0 -1 1</pre></div>
                    <div><strong>출력</strong><pre>-1</pre></div>
                </div><p class="example-explain">벽(-1)으로 막혀서 일부 토마토에 도달할 수 없습니다.</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>2 ≤ M, N ≤ 1,000</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '익은 토마토 하나를 골라서 BFS를 돌리면... 잠깐, 익은 토마토가 <strong>여러 개</strong>일 수 있잖아! 각 토마토에서 하나씩 BFS를 돌려야 하나?' },
                { title: '근데 이러면 문제가 있어', content: '익은 토마토마다 따로 BFS를 돌리면 비효율적이에요. 그리고 문제를 자세히 보면, 익은 토마토들이 <strong>동시에</strong> 주변을 익히잖아요!<br><br>즉, 하루에 모든 익은 토마토의 인접 칸이 동시에 익어야 합니다. 하나씩 순서대로 퍼뜨리면 답이 달라져요!<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;"><span style="font-weight:600;">다중 시작점 BFS:</span><span style="padding:3px 8px;background:var(--red);color:white;border-radius:4px;">토마토A</span><span style="padding:3px 8px;background:var(--red);color:white;border-radius:4px;">토마토B</span><span style="color:var(--text3);">→ 큐에 동시에!</span></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '<strong>다중 시작점 BFS</strong>를 사용합니다! 처음부터 모든 익은 토마토(1)를 큐에 넣고 BFS를 한 번만 돌립니다:<br><br>1. 격자를 읽으면서 값이 1인 칸을 전부 큐에 넣기 (dist = 0)<br>2. BFS: 인접한 안 익은 토마토(0)를 익히며 거리 기록<br>3. BFS 후 아직 0인 칸이 있으면 -1, 없으면 최대 거리가 정답' },
                { title: '왜 이게 맞을까?', content: 'BFS는 거리가 가까운 칸부터 처리하니까, 모든 시작점을 동시에 넣으면 자연스럽게 "동시에 퍼지는" 효과가 나요.<br><br>시간 복잡도는 O(N*M) — 각 칸을 딱 한 번만 방문하니까 매우 효율적입니다!' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

M, N = map(int, input().split())
grid = []
queue = deque()

for r in range(N):
    row = list(map(int, input().split()))
    grid.append(row)
    for c in range(M):
        if row[c] == 1:
            queue.append((r, c))  # 다중 시작점!

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]
dist = [[-1] * M for _ in range(N)]

# 초기 익은 토마토의 거리 = 0
for r, c in queue:
    dist[r][c] = 0

while queue:
    r, c = queue.popleft()
    for d in range(4):
        nr, nc = r + dx[d], c + dy[d]
        if 0 <= nr < N and 0 <= nc < M:
            if grid[nr][nc] == 0 and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                grid[nr][nc] = 1
                queue.append((nr, nc))

ans = 0
for r in range(N):
    for c in range(M):
        if grid[r][c] == 0:
            print(-1)
            exit()
        ans = max(ans, dist[r][c])

print(ans)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int M, N;
    scanf("%d %d", &M, &N);
    vector<vector<int>> grid(N, vector<int>(M));
    vector<vector<int>> dist(N, vector<int>(M, -1));
    queue<pair<int,int>> q;
    int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

    for (int r = 0; r < N; r++)
        for (int c = 0; c < M; c++) {
            scanf("%d", &grid[r][c]);
            if (grid[r][c] == 1) { q.push({r, c}); dist[r][c] = 0; }
        }

    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r+dx[d], nc = c+dy[d];
            if (nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nr][nc]==0&&dist[nr][nc]==-1) {
                dist[nr][nc] = dist[r][c] + 1;
                grid[nr][nc] = 1;
                q.push({nr, nc});
            }
        }
    }

    int ans = 0;
    for (int r = 0; r < N; r++)
        for (int c = 0; c < M; c++) {
            if (grid[r][c] == 0) { puts("-1"); return 0; }
            ans = max(ans, dist[r][c]);
        }
    printf("%d\\n", ans);
    return 0;
}`
            },
            solutions: [{
                approach: '다중 시작 BFS',
                description: '모든 익은 토마토를 시작점으로 동시에 BFS를 수행하여 최소 일수를 구합니다.',
                timeComplexity: 'O(N * M)',
                spaceComplexity: 'O(N * M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기 토마토 수집', desc: '익은 토마토(1)를 모두 큐에 넣어 다중 시작점을 만듭니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nM, N = map(int, input().split())\nbox = []\nq = deque()\nfor i in range(N):\n    row = list(map(int, input().split()))\n    box.append(row)\n    for j in range(M):\n        if row[j] == 1:\n            q.append((i, j))' },
                        { title: 'BFS 탐색', desc: '4방향으로 안 익은 토마토를 익히며 날짜를 기록합니다.', code: 'dx = [0, 0, 1, -1]\ndy = [1, -1, 0, 0]\nwhile q:\n    y, x = q.popleft()\n    for d in range(4):\n        ny, nx = y+dy[d], x+dx[d]\n        if 0<=ny<N and 0<=nx<M and box[ny][nx]==0:\n            box[ny][nx] = box[y][x] + 1\n            q.append((ny, nx))' },
                        { title: '결과 계산 및 출력', desc: '안 익은 토마토가 남으면 -1, 아니면 최대 날짜를 출력합니다.', code: 'ans = 0\nfor i in range(N):\n    for j in range(M):\n        if box[i][j] == 0:\n            print(-1)\n            exit()\n        ans = max(ans, box[i][j])\nprint(ans - 1)' }
                    ],
                    cpp: [
                        { title: '입력 및 초기 토마토 수집', desc: '\uB2E4\uC911 \uC2DC\uC791\uC810 BFS: \uC775\uC740 \uD1A0\uB9C8\uD1A0\uB97C \uBAA8\uB450 \uD050\uC5D0 \uB123\uACE0 \uC2DC\uC791', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int M, N;\n    scanf("%d %d", &M, &N);\n    vector<vector<int>> box(N, vector<int>(M));\n    queue<pair<int,int>> q;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < M; j++) {\n            scanf("%d", &box[i][j]);\n            if (box[i][j] == 1)\n                q.push({i, j}); // \uC775\uC740 \uD1A0\uB9C8\uD1A0 \uBAA8\uB450 \uD050\uC5D0 \uB123\uAE30\n        }' },
                        { title: 'BFS 탐색', desc: '4방향 BFS로 인접 토마토를 익히며 날짜를 기록합니다.', code: '    int dx[] = {0, 0, 1, -1};\n    int dy[] = {1, -1, 0, 0};\n    while (!q.empty()) {\n        auto [y, x] = q.front(); q.pop();\n        for (int d = 0; d < 4; d++) {\n            int ny = y+dx[d], nx = x+dy[d];\n            if (ny>=0 && ny<N && nx>=0 && nx<M && box[ny][nx]==0) {\n                box[ny][nx] = box[y][x] + 1;\n                q.push({ny, nx});\n            }\n        }\n    }' },
                        { title: '결과 계산 및 출력', desc: '0이 남아있으면 -1, 아니면 최대값-1이 정답입니다.', code: '    int ans = 0;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < M; j++) {\n            if (box[i][j] == 0) { puts("-1"); return 0; }\n            ans = max(ans, box[i][j]);\n        }\n    printf("%d\\n", ans - 1);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[11].templates; }
            }]
        },
        {
            id: 'boj-7569',
            title: 'BOJ 7569 - 토마토 (3D)',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/7569',
            simIntro: '3차원 상자에서 여러 익은 토마토가 6방향으로 BFS를 수행하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>철수의 토마토 농장에서는 토마토를 보관하는 큰 창고를 가지고 있다. 토마토는 격자 모양 상자의 칸에 하나씩 넣어서 창고에 보관한다.</p>
                <p>창고에 보관되는 토마토들 중에는 잘 익은 것도 있지만, 아직 익지 않은 토마토들도 있을 수 있다. 보관 후 하루가 지나면, 익은 토마토들의 인접한 곳에 있는 익지 않은 토마토들은 익은 토마토의 영향을 받아 익게 된다. 하나의 토마토에 인접한 곳은 위, 아래, 왼쪽, 오른쪽, 앞, 뒤 <strong>여섯 방향</strong>에 있는 토마토를 의미한다. 대각선 방향에 있는 토마토들에게는 영향을 주지 못하며, 토마토가 혼자 저절로 익는 경우는 없다고 가정한다.</p>
                <p>창고에 보관된 토마토들이 며칠이 지나면 다 익게 되는지, 그 최소 일수를 구하는 프로그램을 작성하라. 단, 상자의 일부 칸에는 토마토가 들어있지 않을 수도 있다.</p>
                <h4>입력</h4>
                <p>첫 줄에는 상자의 크기를 나타내는 두 정수 M, N과 쌓아올려지는 상자의 수를 나타내는 H가 주어진다. M은 상자의 가로 칸의 수, N은 상자의 세로 칸의 수를 나타낸다. 단, 2 ≤ M, N ≤ 100, 1 ≤ H ≤ 100 이다. 둘째 줄부터는 가장 밑의 상자부터 가장 위의 상자까지에 저장된 토마토들의 정보가 주어진다. 즉, 둘째 줄부터 N개의 줄에는 하나의 상자에 담긴 토마토의 정보가 주어진다. 하나의 줄에는 상자 가로줄에 들어있는 토마토의 상태가 M개의 정수로 주어진다. 정수 1은 익은 토마토, 정수 0은 익지 않은 토마토, 정수 -1은 토마토가 들어있지 않은 칸을 나타낸다.</p>
                <p>토마토가 하나 이상 있는 경우만 입력으로 주어진다.</p>
                <h4>출력</h4>
                <p>여러분은 토마토가 모두 익을 때까지의 최소 날짜를 출력해야 한다. 만약, 저장될 때부터 모든 토마토가 익어있는 상태이면 0을 출력해야 하고, 토마토가 모두 익지는 못하는 상황이면 -1을 출력해야 한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 3 2
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 1 0 0
0 0 0 0 0</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>2 ≤ M, N ≤ 100</li>
                    <li>1 ≤ H ≤ 100</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '7576번(토마토 2D)을 풀었다면, 같은 다중 시작점 BFS를 쓰면 될 것 같아요. 익은 토마토를 전부 큐에 넣고 BFS를 돌리면...' },
                { title: '근데 이러면 문제가 있어', content: '이번에는 상자가 <strong>여러 층</strong>으로 쌓여 있어요! 2D에서는 상하좌우 4방향이었는데, 3D에서는 <strong>위층/아래층</strong>까지 합쳐서 <strong>6방향</strong>으로 확장해야 합니다.<br><br>배열도 2차원에서 3차원으로 바뀌어요: <code>grid[h][r][c]</code><br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><span style="color:var(--text2);">2D: 4방향</span> <span style="padding:2px 8px;background:var(--bg2);border-radius:4px;">상하좌우</span></div><div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap;"><span style="color:var(--accent);font-weight:600;">3D: 6방향</span> <span style="padding:2px 8px;background:var(--bg2);border-radius:4px;">상하좌우</span><span style="padding:2px 8px;background:var(--yellow);color:#333;border-radius:4px;font-weight:600;">+ 위층/아래층</span></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '7576번 코드에서 두 가지만 바꿉니다:<br><br>1. 방향 배열에 위/아래 추가:<br><code>dh = [0,0,0,0,1,-1]</code> (위층 +1, 아래층 -1)<br><code>dr = [0,0,1,-1,0,0]</code><br><code>dc = [1,-1,0,0,0,0]</code><br><br>2. 큐에 <code>(h, r, c)</code> 3개 좌표를 넣기<br><br>나머지 다중 시작점 BFS 로직은 7576번과 완전히 동일합니다!' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

M, N, H = map(int, input().split())
grid = []
queue = deque()

for h in range(H):
    layer = []
    for r in range(N):
        row = list(map(int, input().split()))
        layer.append(row)
        for c in range(M):
            if row[c] == 1:
                queue.append((h, r, c))
    grid.append(layer)

# 6방향: 상하좌우 + 위/아래층
dh = [0, 0, 0, 0, 1, -1]
dr = [0, 0, 1, -1, 0, 0]
dc = [1, -1, 0, 0, 0, 0]

dist = [[[-1]*M for _ in range(N)] for _ in range(H)]
for h, r, c in queue:
    dist[h][r][c] = 0

while queue:
    h, r, c = queue.popleft()
    for d in range(6):
        nh, nr, nc = h+dh[d], r+dr[d], c+dc[d]
        if 0<=nh<H and 0<=nr<N and 0<=nc<M:
            if grid[nh][nr][nc] == 0 and dist[nh][nr][nc] == -1:
                dist[nh][nr][nc] = dist[h][r][c] + 1
                grid[nh][nr][nc] = 1
                queue.append((nh, nr, nc))

ans = 0
for h in range(H):
    for r in range(N):
        for c in range(M):
            if grid[h][r][c] == 0:
                print(-1)
                exit()
            ans = max(ans, dist[h][r][c])
print(ans)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int grid[100][100][100], dist_arr[100][100][100];
int dh[]={0,0,0,0,1,-1}, dr[]={0,0,1,-1,0,0}, dc[]={1,-1,0,0,0,0};

int main() {
    int M, N, H;
    scanf("%d %d %d", &M, &N, &H);
    queue<tuple<int,int,int>> q;
    memset(dist_arr, -1, sizeof(dist_arr));

    for (int h = 0; h < H; h++)
        for (int r = 0; r < N; r++)
            for (int c = 0; c < M; c++) {
                scanf("%d", &grid[h][r][c]);
                if (grid[h][r][c] == 1) { q.push({h,r,c}); dist_arr[h][r][c] = 0; }
            }

    while (!q.empty()) {
        auto [h,r,c] = q.front(); q.pop();
        for (int d = 0; d < 6; d++) {
            int nh=h+dh[d], nr=r+dr[d], nc=c+dc[d];
            if (nh>=0&&nh<H&&nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nh][nr][nc]==0&&dist_arr[nh][nr][nc]==-1) {
                dist_arr[nh][nr][nc] = dist_arr[h][r][c]+1;
                grid[nh][nr][nc] = 1;
                q.push({nh,nr,nc});
            }
        }
    }

    int ans = 0;
    for (int h = 0; h < H; h++)
        for (int r = 0; r < N; r++)
            for (int c = 0; c < M; c++) {
                if (grid[h][r][c] == 0) { puts("-1"); return 0; }
                ans = max(ans, dist_arr[h][r][c]);
            }
    printf("%d\\n", ans);
    return 0;
}`
            },
            solutions: [{
                approach: '3D 다중 BFS',
                description: '3차원 상자에서 익은 토마토를 시작점으로 6방향 BFS를 수행합니다.',
                timeComplexity: 'O(H * N * M)',
                spaceComplexity: 'O(H * N * M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기 토마토 수집', desc: '3차원 상자를 층별로 읽으며 익은 토마토를 큐에 넣습니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nM, N, H = map(int, input().split())\nbox = []\nq = deque()\nfor h in range(H):\n    layer = []\n    for i in range(N):\n        row = list(map(int, input().split()))\n        layer.append(row)\n        for j in range(M):\n            if row[j] == 1:\n                q.append((h, i, j))\n    box.append(layer)' },
                        { title: '6방향 BFS 탐색', desc: '상하좌우 + 위층/아래층 6방향으로 토마토를 익힙니다.', code: 'dz = [0, 0, 0, 0, 1, -1]\ndy = [1, -1, 0, 0, 0, 0]\ndx = [0, 0, 1, -1, 0, 0]\nwhile q:\n    z, y, x = q.popleft()\n    for d in range(6):\n        nz, ny, nx = z+dz[d], y+dy[d], x+dx[d]\n        if 0<=nz<H and 0<=ny<N and 0<=nx<M and box[nz][ny][nx]==0:\n            box[nz][ny][nx] = box[z][y][x] + 1\n            q.append((nz, ny, nx))' },
                        { title: '결과 계산 및 출력', desc: '3중 루프로 안 익은 토마토를 확인하고 최대 날짜를 출력합니다.', code: 'ans = 0\nfor h in range(H):\n    for i in range(N):\n        for j in range(M):\n            if box[h][i][j] == 0:\n                print(-1)\n                exit()\n            ans = max(ans, box[h][i][j])\nprint(ans - 1)' }
                    ],
                    cpp: [
                        { title: '입력 및 초기 토마토 수집', desc: 'tuple<int,int,int> \uD050\uB85C 3\uCC28\uC6D0 BFS, \uC804\uC5ED \uBC30\uC5F4\uB85C \uBA54\uBAA8\uB9AC \uD655\uBCF4', code: '#include <iostream>\n#include <queue>\n#include <tuple>\n#include <algorithm>\n#include <cstring>\nusing namespace std;\n\nint grid[100][100][100];\nint dh[] = {0,0,0,0,1,-1};\nint dr[] = {0,0,1,-1,0,0};\nint dc[] = {1,-1,0,0,0,0};\n\nint main() {\n    int M, N, H;\n    scanf("%d %d %d", &M, &N, &H);\n    queue<tuple<int,int,int>> q;\n\n    for (int h = 0; h < H; h++)\n        for (int r = 0; r < N; r++)\n            for (int c = 0; c < M; c++) {\n                scanf("%d", &grid[h][r][c]);\n                if (grid[h][r][c] == 1)\n                    q.push({h, r, c});\n            }' },
                        { title: '6방향 BFS 탐색', desc: '상하좌우 + 위아래 층 6방향으로 BFS를 수행합니다.', code: '    while (!q.empty()) {\n        auto [h, r, c] = q.front(); q.pop();\n        for (int d = 0; d < 6; d++) {\n            int nh = h+dh[d], nr = r+dr[d], nc = c+dc[d];\n            if (nh>=0 && nh<H && nr>=0 && nr<N && nc>=0 && nc<M\n                && grid[nh][nr][nc] == 0) {\n                grid[nh][nr][nc] = grid[h][r][c] + 1;\n                q.push({nh, nr, nc});\n            }\n        }\n    }' },
                        { title: '결과 계산 및 출력', desc: '3중 루프로 0이 남아있는지 확인 후 최대값-1을 출력합니다.', code: '    int ans = 0;\n    for (int h = 0; h < H; h++)\n        for (int r = 0; r < N; r++)\n            for (int c = 0; c < M; c++) {\n                if (grid[h][r][c] == 0) {\n                    puts("-1"); return 0;\n                }\n                ans = max(ans, grid[h][r][c]);\n            }\n    printf("%d\\n", ans - 1);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[12].templates; }
            }]
        },
        {
            id: 'boj-16928',
            title: 'BOJ 16928 - 뱀과 사다리 게임',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/16928',
            simIntro: '뱀과 사다리 게임판을 그래프로 모델링하여 BFS 최단 이동을 구하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>뱀과 사다리 게임을 즐겨 하는 큐브러버는 , 어느 게임 보드에서든 달성 가능한 게임 1번 칸에서 게임 100번 칸에 도착하기 위해 게임판에 주사위를 최소 몇 번 굴려야 하는지 궁금해졌다.</p>
                <p>게임은 게임판 위에서 주사위를 굴려 나온 수만큼 이동시키는 것이다. 이동한 칸에 뱀이 있는 경우, 뱀을 따라서 내려가게 된다. 이동한 칸에 사다리가 있는 경우, 사다리를 따라서 올라가게 된다. 게임판 위에 게임말이 있는 상태에서 주사위를 굴려, 주사위의 값이 이동해야 하는 칸 수를 나타낸다. 게임말이 100번 칸을 넘어가는 이동은 할 수 없다. 게임말이 도착한 칸이 사다리면 반드시 올라가야 하고, 뱀이면 반드시 내려가야 한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 게임판에 있는 사다리의 수 N(1 ≤ N ≤ 15)과 뱀의 수 M(1 ≤ M ≤ 15)이 주어진다.</p>
                <p>둘째 줄부터 N개의 줄에는 사다리의 정보를 의미하는 x, y (x < y)가 주어진다. x번 칸에 도착하면, y번 칸으로 이동한다는 의미이다.</p>
                <p>다음 M개의 줄에는 뱀의 정보를 의미하는 u, v (u > v)가 주어진다. u번 칸에 도착하면, v번 칸으로 이동한다는 의미이다.</p>
                <p>1번 칸과 100번 칸은 사다리 또는 뱀이 없다. 사다리 또는 뱀은 게임판 위의 어떤 칸에도 2개 이상 존재하지 않는다. 즉, 게임판의 게임말이 위치할 수 있는 칸 중 사다리 또는 뱀이 있는 칸의 번호는 모두 다르다.</p>
                <h4>출력</h4>
                <p>게임판 1번 칸에서 100번 칸까지 가는데 주사위를 최소 몇 번 굴려야 하는지를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 7
32 62
42 68
12 98
95 13
97 25
93 37
79 27
75 19
49 47
67 17</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N, M ≤ 15</li>
                    <li>사다리와 뱀의 시작과 끝은 모두 다름</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '1번 칸에서 주사위를 굴려서 100번 칸에 가야 해요. 주사위로 1~6칸 이동하는데, 사다리를 타면 위로 올라가고 뱀을 만나면 아래로 내려가고...<br><br>최소 주사위 굴림 횟수를 구해야 하니까 모든 경우를 다 해봐야 하나?' },
                { title: '근데 이러면 문제가 있어', content: '무작정 모든 경우를 탐색하면 경우의 수가 너무 많아요. 잠깐, 이 문제를 <strong>그래프</strong>로 볼 수 있지 않을까?<br><br>칸 번호(1~100)를 <strong>정점</strong>, 주사위 이동(1~6)을 <strong>간선</strong>으로 생각하면, <strong>최단 거리 = BFS</strong>로 풀 수 있어요!<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;">칸3</div><span style="color:var(--text3);">→ 주사위</span><div style="padding:3px 8px;background:var(--bg2);border-radius:4px;">칸7</div><span style="color:var(--text3);">→ 사다리!</span><div style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">칸32</div></div>' },
                { title: '이렇게 하면 어떨까?', content: '1번 칸에서 BFS를 시작합니다:<br>1. 현재 칸에서 주사위 1~6으로 다음 칸 계산<br>2. 다음 칸에 사다리/뱀이 있으면 → 목적지로 <strong>강제 이동</strong><br>3. 아직 방문하지 않은 칸이면 큐에 넣기<br>4. 100번 칸에 도달하면 거리 출력!<br><br><span class="lang-py">Python: 사다리/뱀을 <code>dict</code>에 저장: <code>teleport[x] = y</code></span><span class="lang-cpp">C++: 배열에 저장: <code>teleport[x] = y</code> (0이면 사다리/뱀 없음)</span>' }
            ],
            templates: {
                python: `from collections import deque

N, M = map(int, input().split())
teleport = {}
for _ in range(N + M):
    x, y = map(int, input().split())
    teleport[x] = y

dist = [-1] * 101
dist[1] = 0
queue = deque([1])

while queue:
    pos = queue.popleft()
    if pos == 100:
        print(dist[pos])
        break
    for dice in range(1, 7):
        npos = pos + dice
        if npos > 100:
            continue
        # 사다리 또는 뱀이 있으면 강제 이동
        if npos in teleport:
            npos = teleport[npos]
        if dist[npos] == -1:
            dist[npos] = dist[pos] + 1
            queue.append(npos)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    int teleport[101] = {};
    for (int i = 0; i < N + M; i++) {
        int x, y; scanf("%d %d", &x, &y);
        teleport[x] = y;
    }

    int dist[101];
    memset(dist, -1, sizeof(dist));
    dist[1] = 0;
    queue<int> q;
    q.push(1);

    while (!q.empty()) {
        int pos = q.front(); q.pop();
        if (pos == 100) { printf("%d\\n", dist[pos]); return 0; }
        for (int d = 1; d <= 6; d++) {
            int npos = pos + d;
            if (npos > 100) continue;
            if (teleport[npos]) npos = teleport[npos];
            if (dist[npos] == -1) {
                dist[npos] = dist[pos] + 1;
                q.push(npos);
            }
        }
    }
    return 0;
}`
            },
            solutions: [{
                approach: 'BFS 그래프 탐색',
                description: '뱀과 사다리를 간선으로 모델링하여 BFS로 1번에서 100번까지 최소 이동을 구합니다.',
                timeComplexity: 'O(100)',
                spaceComplexity: 'O(100)',
                codeSteps: {
                    python: [
                        { title: '입력 및 뱀/사다리 구성', desc: 'move 배열에 사다리/뱀의 이동 목적지를 저장합니다.', code: 'from collections import deque\n\nN, M = map(int, input().split())\nmove = [0] * 101\nfor _ in range(N + M):\n    a, b = map(int, input().split())\n    move[a] = b' },
                        { title: 'BFS 초기화', desc: '1번 칸에서 시작하므로 dist[1]=0으로 설정합니다.', code: 'dist = [-1] * 101\ndist[1] = 0\nq = deque([1])' },
                        { title: 'BFS 탐색 및 출력', desc: '주사위 1~6으로 이동하되, 사다리/뱀이면 강제 이동합니다.', code: 'while q:\n    x = q.popleft()\n    for dice in range(1, 7):\n        nx = x + dice\n        if nx > 100: continue\n        if move[nx] != 0: nx = move[nx]\n        if dist[nx] == -1:\n            dist[nx] = dist[x] + 1\n            q.append(nx)\nprint(dist[100])' }
                    ],
                    cpp: [
                        { title: '입력 및 뱀/사다리 구성', desc: '\uBC30\uC5F4\uB85C \uC0AC\uB2E4\uB9AC/\uBC40 \uB9F5\uD551 \uC800\uC7A5', code: '#include <iostream>\n#include <queue>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    int teleport[101] = {}; // \uC0AC\uB2E4\uB9AC/\uBC40 \uC774\uB3D9 \uB9F5\uD551\n    for (int i = 0; i < N + M; i++) {\n        int x, y;\n        scanf("%d %d", &x, &y);\n        teleport[x] = y;\n    }' },
                        { title: 'BFS 초기화', desc: 'memset으로 dist를 -1로 초기화, 1번 칸부터 시작합니다.', code: '    int dist[101];\n    memset(dist, -1, sizeof(dist));\n    dist[1] = 0;\n    queue<int> q;\n    q.push(1);' },
                        { title: 'BFS 탐색 및 출력', desc: '주사위 1~6 이동 후 teleport 배열로 강제 이동을 처리합니다.', code: '    while (!q.empty()) {\n        int pos = q.front(); q.pop();\n        if (pos == 100) {\n            printf("%d\\n", dist[pos]);\n            return 0;\n        }\n        for (int d = 1; d <= 6; d++) {\n            int npos = pos + d;\n            if (npos > 100) continue;\n            // \uC0AC\uB2E4\uB9AC/\uBC40\uC774 \uC788\uC73C\uBA74 \uAC15\uC81C \uC774\uB3D9\n            if (teleport[npos]) npos = teleport[npos];\n            if (dist[npos] == -1) {\n                dist[npos] = dist[pos] + 1;\n                q.push(npos);\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[13].templates; }
            }]
        },
        {
            id: 'boj-1707',
            title: 'BOJ 1707 - 이분 그래프',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1707',
            simIntro: '그래프를 2색으로 칠하면서 이분 그래프 여부를 판별하는 BFS 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>그래프의 정점의 집합을 둘로 분할하여, 각 집합에 속한 정점끼리는 서로 인접하지 않도록 분할할 수 있을 때, 그러한 그래프를 특별히 이분 그래프 (Bipartite Graph) 라 부른다.</p>
                <p>그래프가 입력으로 주어졌을 때, 이 그래프가 이분 그래프인지 아닌지 판별하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>입력은 여러 개의 테스트 케이스로 구성되어 있는데, 첫째 줄에 테스트 케이스의 개수 K가 주어진다. 각 테스트 케이스의 첫째 줄에는 그래프의 정점의 개수 V와 간선의 개수 E가 빈 칸을 사이에 두고 순서대로 주어진다. 각 정점에는 1부터 V까지 차례로 번호가 붙어 있다. 이어서 둘째 줄부터 E개의 줄에 걸쳐 간선에 대한 정보가 주어지는데, 각 줄에 인접한 두 정점의 번호 u, v (1 ≤ u, v ≤ V)가 빈 칸을 사이에 두고 주어진다.</p>
                <h4>출력</h4>
                <p>K개의 테스트 케이스마다 해당 그래프가 이분 그래프이면 YES, 아니면 NO를 순서대로 한 줄에 하나씩 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2
3 2
1 3
2 3
4 4
1 2
2 3
3 4
4 2</pre></div>
                    <div><strong>출력</strong><pre>YES
NO</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ K ≤ 5</li>
                    <li>1 ≤ V ≤ 20,000</li>
                    <li>1 ≤ E ≤ 200,000</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '이분 그래프란 정점을 두 그룹으로 나눌 수 있고, 같은 그룹끼리는 간선이 없는 그래프예요.<br><br>모든 가능한 2가지 분할을 시도해 보면 되지 않을까? 정점이 V개면 2^V가지 경우...' },
                { title: '근데 이러면 문제가 있어', content: 'V가 최대 20,000이면 2^20000가지?! 이건 절대 불가능해요.<br><br>다르게 생각해 봅시다. 이분 그래프는 정점을 <strong>두 가지 색</strong>으로 칠할 수 있는 그래프예요. 인접한 정점끼리 항상 다른 색이면 이분 그래프!<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div style="width:28px;height:28px;border-radius:50%;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">A</div><span style="color:var(--text3);">—</span><div style="width:28px;height:28px;border-radius:50%;background:#00b894;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">B</div><span style="color:var(--text3);">—</span><div style="width:28px;height:28px;border-radius:50%;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">C</div><span style="color:var(--text3);margin-left:6px;">← 번갈아 칠하기!</span></div>' },
                { title: '이렇게 하면 어떨까?', content: '<strong>2-coloring BFS</strong>를 사용합니다:<br>1. 시작 정점을 색 0으로 칠하기<br>2. BFS로 이웃을 색 1로, 그 이웃을 색 0으로... 번갈아 칠하기<br>3. 이미 칠해진 이웃의 색이 나와 <strong>같으면</strong> → 이분 그래프가 아님! (NO)<br>4. 충돌 없이 끝나면 → 이분 그래프 (YES)' },
                { title: '주의할 점', content: '그래프가 <strong>연결 그래프가 아닐 수</strong> 있어요! 즉, 떨어진 컴포넌트가 여러 개일 수 있습니다.<br><br>모든 정점을 순회하면서, 아직 색칠 안 된 정점이 있으면 거기서 새로 BFS를 시작해야 해요.<br>각 테스트 케이스마다 <code>color</code> 배열을 초기화하는 것도 잊지 마세요!' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

K = int(input())
for _ in range(K):
    V, E = map(int, input().split())
    graph = [[] for _ in range(V + 1)]
    for _ in range(E):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

    color = [-1] * (V + 1)
    is_bipartite = True

    for start in range(1, V + 1):
        if color[start] != -1:
            continue
        color[start] = 0
        queue = deque([start])
        while queue:
            v = queue.popleft()
            for u in graph[v]:
                if color[u] == -1:
                    color[u] = 1 - color[v]  # 반대 색
                    queue.append(u)
                elif color[u] == color[v]:
                    is_bipartite = False
                    break
            if not is_bipartite:
                break
        if not is_bipartite:
            break

    print("YES" if is_bipartite else "NO")`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    int K; scanf("%d", &K);
    while (K--) {
        int V, E; scanf("%d %d", &V, &E);
        vector<vector<int>> graph(V + 1);
        for (int i = 0; i < E; i++) {
            int u, v; scanf("%d %d", &u, &v);
            graph[u].push_back(v);
            graph[v].push_back(u);
        }

        vector<int> color(V + 1, -1);
        bool ok = true;

        for (int s = 1; s <= V && ok; s++) {
            if (color[s] != -1) continue;
            color[s] = 0;
            queue<int> q;
            q.push(s);
            while (!q.empty() && ok) {
                int v = q.front(); q.pop();
                for (int u : graph[v]) {
                    if (color[u] == -1) {
                        color[u] = 1 - color[v];
                        q.push(u);
                    } else if (color[u] == color[v]) {
                        ok = false;
                    }
                }
            }
        }
        puts(ok ? "YES" : "NO");
    }
    return 0;
}`
            },
            solutions: [{
                approach: 'BFS 이분 그래프 판별',
                description: '그래프를 2색으로 칠하면서 인접한 정점이 같은 색인지 검사합니다.',
                timeComplexity: 'O(V + E)',
                spaceComplexity: 'O(V + E)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구성', desc: '테스트 케이스마다 그래프를 새로 생성합니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nK = int(input())\nfor _ in range(K):\n    V, E = map(int, input().split())\n    graph = [[] for _ in range(V + 1)]\n    for _ in range(E):\n        u, v = map(int, input().split())\n        graph[u].append(v)\n        graph[v].append(u)' },
                        { title: 'BFS 2색 칠하기', desc: '인접한 정점에 반대 색을 칠하고, 충돌 시 이분 그래프가 아닙니다.', code: '    color = [0] * (V + 1)\n    is_bipartite = True\n    for start in range(1, V + 1):\n        if color[start] != 0: continue\n        q = deque([start])\n        color[start] = 1\n        while q and is_bipartite:\n            v = q.popleft()\n            for u in graph[v]:\n                if color[u] == 0:\n                    color[u] = -color[v]\n                    q.append(u)\n                elif color[u] == color[v]:\n                    is_bipartite = False' },
                        { title: '결과 출력', desc: '이분 그래프 판별 결과에 따라 YES/NO를 출력합니다.', code: '    print("YES" if is_bipartite else "NO")' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 구성', desc: '테스트 케이스별로 vector 그래프를 생성합니다.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int K;\n    scanf("%d", &K);\n    while (K--) {\n        int V, E;\n        scanf("%d %d", &V, &E);\n        vector<vector<int>> graph(V + 1);\n        for (int i = 0; i < E; i++) {\n            int u, v;\n            scanf("%d %d", &u, &v);\n            graph[u].push_back(v);\n            graph[v].push_back(u);\n        }' },
                        { title: 'BFS 2색 칠하기', desc: 'vector<int> color\uB85C 0/1/-1 \uC0C9 \uAD00\uB9AC', code: '        // 0: \uBBF8\uBC29\uBB38, 1/-1: \uB450 \uAC00\uC9C0 \uC0C9\n        vector<int> color(V + 1, 0);\n        bool ok = true;\n        for (int s = 1; s <= V && ok; s++) {\n            if (color[s] != 0) continue;\n            color[s] = 1;\n            queue<int> q;\n            q.push(s);\n            while (!q.empty() && ok) {\n                int v = q.front(); q.pop();\n                for (int u : graph[v]) {\n                    if (color[u] == 0) {\n                        color[u] = -color[v]; // \uBC18\uB300 \uC0C9 \uCE60\uD558\uAE30\n                        q.push(u);\n                    } else if (color[u] == color[v]) {\n                        ok = false; // \uAC19\uC740 \uC0C9\uC774\uBA74 \uC774\uBD84 \uADF8\uB798\uD504 X\n                    }\n                }\n            }\n        }' },
                        { title: '결과 출력', desc: '판별 결과를 YES/NO로 출력합니다.', code: '        puts(ok ? "YES" : "NO");\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[14].templates; }
            }]
        },
        {
            id: 'boj-2206',
            title: 'BOJ 2206 - 벽 부수고 이동하기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2206',
            simIntro: '벽을 부순 상태와 부수지 않은 상태를 분리하여 3차원 BFS를 수행하는 과정입니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×M의 행렬로 표현되는 맵이 있다. 맵에서 0은 이동할 수 있는 곳을 나타내고, 1은 이동할 수 없는 벽이 있는 곳을 나타낸다. 당신은 (1, 1)에서 (N, M)의 위치까지 이동하려 하는데, 이때 최단 경로로 이동하려 한다. 최단 경로는 맵에서 가장 적은 개수의 칸을 지나는 경로를 말하는데, 이때 시작하는 칸과 끝나는 칸도 포함해서 센다.</p>
                <p>만약 이동하는 도중에 한 개의 벽을 부수고 이동하는 것이 좀 더 경로가 짧아진다면, 벽을 한 개 까지 부수고 이동하여도 된다.</p>
                <p>한 칸에서 이동할 수 있는 칸은 상하좌우로 인접한 칸이다. 맵이 주어졌을 때, 최단 경로를 구해 내는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 N(1 ≤ N ≤ 1,000), M(1 ≤ M ≤ 1,000)이 주어진다. 다음 N개의 줄에 M개의 숫자로 맵이 주어진다. (1, 1)과 (N, M)은 항상 0이라고 가정한다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 최단 거리를 출력한다. 불가능할 때는 -1을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6 4
0100
0110
0000
0010
0100
0000</pre></div>
                    <div><strong>출력</strong><pre>15</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 4
0111
1111
1111
1110</pre></div>
                    <div><strong>출력</strong><pre>-1</pre></div>
                </div><p class="example-explain">벽을 하나만 부술 수 있으므로 (1,1)에서 (4,4)까지 도달할 수 없습니다.</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N, M ≤ 1,000</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법', content: '(1,1)에서 (N,M)까지 최단 경로를 구해야 해요. 벽을 하나까지 부술 수 있으니까... 일단 벽 안 부수고 BFS, 그다음 벽을 하나씩 부숴보면서 BFS를 반복하면 되지 않을까?' },
                { title: '근데 이러면 문제가 있어', content: '벽이 엄청 많으면 각 벽을 부술 때마다 BFS를 돌려야 해요. N, M이 최대 1,000이면 격자에 벽이 수십만 개일 수 있으니까, 벽 수 * O(NM) = 시간 초과!<br><br>벽을 부수는 것을 BFS <strong>안에서</strong> 처리할 방법은 없을까?<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="margin-bottom:4px;font-weight:600;color:var(--accent);">상태 확장: (r, c, broken)</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><span style="padding:3px 8px;background:var(--bg2);border-radius:4px;">(3,2,0) 벽 안 부숨</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;">(3,2,1) 벽 부숨</span></div><div style="margin-top:4px;color:var(--text2);">같은 위치라도 다른 상태!</div></div>' },
                { title: '이렇게 하면 어떨까?', content: '<strong>상태 확장 BFS</strong>를 사용합니다! 위치 (r, c)에 "벽을 부쉈는지 여부"를 추가해서 3차원 상태로 관리해요:<br><br><code>dist[r][c][broken]</code> (broken: 0=아직 안 부숨, 1=이미 부숨)<br><br>이동 규칙:<br>- 빈 칸(0) → 그냥 이동 (broken 유지)<br>- 벽(1) + broken=0 → 벽을 부수고 이동 (broken을 1로 변경)<br>- 벽(1) + broken=1 → 이동 불가 (이미 한 번 부숨)' },
                { title: '왜 이게 맞을까?', content: '같은 (r, c)라도 <strong>벽을 부쉈느냐 아니냐</strong>에 따라 완전히 다른 상태예요!<br><br>예를 들어, (3, 4)에 벽을 안 부수고 도착한 것과, 벽을 부수고 도착한 것은 앞으로 갈 수 있는 경로가 달라요. 그래서 별도 상태로 관리해야 합니다.<br><br>BFS 큐에 <code>(r, c, broken)</code>을 넣으면, 도착점에 처음 도달했을 때가 최단 거리입니다.' }
            ],
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N, M = map(int, input().split())
grid = []
for _ in range(N):
    grid.append(list(map(int, input().strip())))

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]

# dist[r][c][broken]: broken=0(아직 안 부숨), broken=1(이미 부숨)
dist = [[[-1] * 2 for _ in range(M)] for _ in range(N)]
dist[0][0][0] = 1
queue = deque([(0, 0, 0)])  # (r, c, broken)

while queue:
    r, c, broken = queue.popleft()
    if r == N - 1 and c == M - 1:
        print(dist[r][c][broken])
        exit()

    for d in range(4):
        nr, nc = r + dx[d], c + dy[d]
        if 0 <= nr < N and 0 <= nc < M:
            if grid[nr][nc] == 0 and dist[nr][nc][broken] == -1:
                # 빈 칸으로 이동
                dist[nr][nc][broken] = dist[r][c][broken] + 1
                queue.append((nr, nc, broken))
            elif grid[nr][nc] == 1 and broken == 0 and dist[nr][nc][1] == -1:
                # 벽을 부수고 이동 (한 번만 가능)
                dist[nr][nc][1] = dist[r][c][broken] + 1
                queue.append((nr, nc, 1))

print(-1)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int N, M;
char grid[1000][1001];
int dist_arr[1000][1000][2];
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int main() {
    scanf("%d %d", &N, &M);
    for (int i = 0; i < N; i++) scanf("%s", grid[i]);
    memset(dist_arr, -1, sizeof(dist_arr));

    dist_arr[0][0][0] = 1;
    queue<tuple<int,int,int>> q;
    q.push({0, 0, 0});

    while (!q.empty()) {
        auto [r, c, b] = q.front(); q.pop();
        if (r == N-1 && c == M-1) {
            printf("%d\\n", dist_arr[r][c][b]);
            return 0;
        }
        for (int d = 0; d < 4; d++) {
            int nr = r+dx[d], nc = c+dy[d];
            if (nr<0||nr>=N||nc<0||nc>=M) continue;
            if (grid[nr][nc]=='0' && dist_arr[nr][nc][b]==-1) {
                dist_arr[nr][nc][b] = dist_arr[r][c][b]+1;
                q.push({nr,nc,b});
            }
            if (grid[nr][nc]=='1' && b==0 && dist_arr[nr][nc][1]==-1) {
                dist_arr[nr][nc][1] = dist_arr[r][c][b]+1;
                q.push({nr,nc,1});
            }
        }
    }
    puts("-1");
    return 0;
}`
            },
            solutions: [{
                approach: '상태 BFS (벽 부수기)',
                description: '(y, x, 벽부순여부) 3차원 상태 공간에서 BFS로 최단 거리를 구합니다.',
                timeComplexity: 'O(N * M)',
                spaceComplexity: 'O(N * M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기화', desc: 'dist[y][x][벽부순여부] 3차원 배열로 상태를 관리합니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\nboard = []\nfor _ in range(N):\n    board.append(list(input().strip()))\n\ndist = [[[0]*2 for _ in range(M)] for _ in range(N)]\ndist[0][0][0] = 1' },
                        { title: 'BFS 탐색', desc: '(y, x, broken) 상태를 큐에서 꺼내며 도착 여부를 확인합니다.', code: 'q = deque([(0, 0, 0)])  # y, x, broken\ndx = [0, 0, 1, -1]\ndy = [1, -1, 0, 0]\nwhile q:\n    y, x, broken = q.popleft()\n    if y == N-1 and x == M-1:\n        print(dist[y][x][broken])\n        exit()' },
                        { title: '벽 처리 및 이동', desc: '빈 칸이면 그대로, 벽이면 아직 안 부쉈을 때만 부수고 이동합니다.', code: '    for d in range(4):\n        ny, nx = y+dy[d], x+dx[d]\n        if 0<=ny<N and 0<=nx<M:\n            if board[ny][nx]=="0" and dist[ny][nx][broken]==0:\n                dist[ny][nx][broken] = dist[y][x][broken] + 1\n                q.append((ny, nx, broken))\n            elif board[ny][nx]=="1" and broken==0 and dist[ny][nx][1]==0:\n                dist[ny][nx][1] = dist[y][x][broken] + 1\n                q.append((ny, nx, 1))\nprint(-1)' }
                    ],
                    cpp: [
                        { title: '입력 및 초기화', desc: '3\uCC28\uC6D0 \uBC30\uC5F4 dist[r][c][broken]\uC73C\uB85C \uC0C1\uD0DC \uD655\uC7A5 BFS', code: '#include <iostream>\n#include <queue>\n#include <tuple>\n#include <cstring>\nusing namespace std;\n\nint N, M;\nchar grid[1000][1001];\nint dist[1000][1000][2]; // [y][x][\uBCBD \uBD80\uC22C \uC5EC\uBD80]\nint dx[] = {0, 0, 1, -1};\nint dy[] = {1, -1, 0, 0};\n\nint main() {\n    scanf("%d %d", &N, &M);\n    for (int i = 0; i < N; i++) scanf("%s", grid[i]);\n    memset(dist, -1, sizeof(dist));\n    dist[0][0][0] = 1;' },
                        { title: 'BFS 탐색', desc: 'tuple<int,int,int>\uC73C\uB85C (y, x, broken) \uC0C1\uD0DC \uAD00\uB9AC', code: '    queue<tuple<int,int,int>> q;\n    q.push({0, 0, 0});\n\n    while (!q.empty()) {\n        auto [r, c, b] = q.front(); q.pop();\n        if (r == N-1 && c == M-1) {\n            printf("%d\\n", dist[r][c][b]);\n            return 0;\n        }' },
                        { title: '벽 처리 및 이동', desc: '빈 칸은 그대로, 벽은 b==0일 때만 부수고 이동합니다.', code: '        for (int d = 0; d < 4; d++) {\n            int nr = r+dx[d], nc = c+dy[d];\n            if (nr<0 || nr>=N || nc<0 || nc>=M) continue;\n            // \uBE48 \uCE78: \uADF8\uB0E5 \uC774\uB3D9\n            if (grid[nr][nc]==\'0\' && dist[nr][nc][b]==-1) {\n                dist[nr][nc][b] = dist[r][c][b] + 1;\n                q.push({nr, nc, b});\n            }\n            // \uBCBD: \uC544\uC9C1 \uC548 \uBD80\uC20C\uC744 \uB54C\uB9CC \uBD80\uC218\uACE0 \uC774\uB3D9\n            if (grid[nr][nc]==\'1\' && b==0 && dist[nr][nc][1]==-1) {\n                dist[nr][nc][1] = dist[r][c][b] + 1;\n                q.push({nr, nc, 1});\n            }\n        }\n    }\n    puts("-1");\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[15].templates; }
            }]
        }
    ],

    // ===== 호환 스텁 =====
    _renderProblemDetail: function() {}
};

// ===== 등록 =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.graph = graphTopic;
