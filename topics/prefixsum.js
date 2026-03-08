// ===== 누적합 토픽 모듈 =====
var prefixSumTopic = {
    id: 'prefixsum',
    title: '누적합',
    icon: '📊',
    category: '알고리즘 기법',
    order: 14,
    description: '구간의 합을 한 번에 구하는 기법',
    relatedNote: '누적합은 IMOS법(차분 배열), 2차원 확장, 나머지 연산과의 조합 등으로 다양하게 응용됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-11659': { type: '1D 누적합', color: 'var(--accent)', vizMethod: '_renderVizRange', suffix: '-range' },
        'boj-2559':  { type: '구간 합', color: 'var(--green)', vizMethod: '_renderVizWindow', suffix: '-win' },
        'boj-16139': { type: '문자별 누적', color: '#e17055', vizMethod: '_renderVizCharSum', suffix: '-char' },
        'boj-10986': { type: '나머지 합', color: '#6c5ce7', vizMethod: '_renderVizModSum', suffix: '-mod' },
        'boj-11660': { type: '2D 누적합', color: '#00b894', vizMethod: '_renderViz2DSum', suffix: '-2d' },
        'boj-25682': { type: '2D 응용', color: '#d63031', vizMethod: '_renderVizChess', suffix: '-chess' }
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
            sim:     { intro: prob.simIntro || '누적합이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
                <h2>📊 누적합 (Prefix Sum)</h2>\
                <p class="hero-sub">미리 합을 쌓아두면, 어떤 구간의 합이든 한 번에 구할 수 있습니다</p>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> 누적합이란?</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 여러분이 매일 용돈을 저금통에 넣는다고 생각해 보세요.<br>\
                    월요일에 3원, 화요일에 1원, 수요일에 4원, 목요일에 1원, 금요일에 5원.<br><br>\
                    저금통에는 매일 <strong>지금까지 모은 총 금액</strong>이 적혀 있습니다:<br>\
                    <code>0원 → 3원 → 4원 → 8원 → 9원 → 14원</code><br><br>\
                    이제 "화요일부터 목요일까지 모은 돈"을 알고 싶다면?<br>\
                    <strong>목요일까지 총액(9원) - 월요일까지 총액(3원) = 6원</strong><br>\
                    이것이 바로 <strong>누적합</strong>입니다!\
                </div>\
\
                <div class="code-block"><pre><code class="language-python"># 원래 배열\n\
arr    = [3, 1, 4, 1, 5]\n\
\n\
# 누적합 배열 (맨 앞에 0을 추가)\n\
prefix = [0, 3, 4, 8, 9, 14]\n\
#         ↑  ↑  ↑  ↑  ↑   ↑\n\
#         0  3 3+1 4+4 8+1 9+5\n\
\n\
# 2번째~4번째 합 = prefix[4] - prefix[1] = 9 - 3 = 6</code></pre></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">배열 [3, 1, 4, 1, 5]에서 3번째부터 5번째까지의 합은 얼마입니까?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>10</strong>입니다!<br>\
                        누적합 배열: [0, 3, 4, 8, 9, 14]<br>\
                        prefix[5] - prefix[2] = 14 - 4 = <strong>10</strong><br>\
                        실제로 4 + 1 + 5 = 10 맞습니다!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> 누적합 만드는 방법</div>\
                <div class="concept-grid">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="5" y="50" width="12" height="20" rx="2" fill="var(--accent)" opacity="0.4"/>\
                                <rect x="22" y="40" width="12" height="30" rx="2" fill="var(--accent)" opacity="0.55"/>\
                                <rect x="39" y="25" width="12" height="45" rx="2" fill="var(--accent)" opacity="0.7"/>\
                                <rect x="56" y="10" width="12" height="60" rx="2" fill="var(--accent)" opacity="0.9"/>\
                            </svg>\
                        </div>\
                        <h3>하나씩 쌓아 올리기</h3>\
                        <p><code>prefix[i] = prefix[i-1] + arr[i]</code><br>이전까지의 합에 현재 값을 더하면 됩니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <circle cx="40" cy="40" r="25" fill="none" stroke="var(--green)" stroke-width="3"/>\
                                <text x="40" y="46" text-anchor="middle" fill="var(--green)" font-size="24" font-weight="bold">O(N)</text>\
                            </svg>\
                        </div>\
                        <h3>딱 한 번이면 충분</h3>\
                        <p>누적합 배열을 만드는 데 배열을 <strong>한 번만</strong> 쭉 훑으면 됩니다.</p>\
                    </div>\
                </div>\
\
                <div class="code-block"><pre><code class="language-python"># 누적합 배열 만들기\n\
N = len(arr)\n\
prefix = [0] * (N + 1)       # 길이를 N+1로 (0번 칸은 0)\n\
\n\
for i in range(1, N + 1):\n\
    prefix[i] = prefix[i - 1] + arr[i - 1]\n\
\n\
# 결과: prefix = [0, 3, 4, 8, 9, 14]</code></pre></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">누적합 배열의 맨 앞에 왜 0을 넣을까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>첫 번째 원소부터의 구간 합</strong>을 구할 때 편하기 때문입니다!<br>\
                        예를 들어 1번째~3번째 합 = prefix[3] - prefix[0] = 8 - 0 = 8<br>\
                        0이 없으면 1번째부터 시작하는 구간에서 예외 처리가 필요합니다.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> 구간 합을 한 번에!</div>\
                <div class="approach-grid">\
                    <div class="approach-card">\
                        <h4>😰 반복문으로 구하기</h4>\
                        <div class="code-block"><pre><code class="language-python"># L번째 ~ R번째 합 구하기\n\
total = 0\n\
for i in range(L, R + 1):\n\
    total += arr[i]\n\
# 시간: O(N) — 질문마다 처음부터 더해야 합니다</code></pre></div>\
                        <p class="approach-note">질문이 M개면 총 <strong>O(N × M)</strong> → 느립니다!</p>\
                    </div>\
                    <div class="approach-card featured">\
                        <h4>😎 누적합으로 구하기</h4>\
                        <div class="code-block"><pre><code class="language-python"># L번째 ~ R번째 합 구하기\n\
total = prefix[R] - prefix[L - 1]\n\
# 시간: O(1) — 뺄셈 한 번이면 끝!</code></pre></div>\
                        <p class="approach-note">질문이 M개여도 총 <strong>O(N + M)</strong> → 빠릅니다!</p>\
                    </div>\
                </div>\
\
                <div class="key-difference-box">\
                    <strong>핵심 공식:</strong>\
                    <code>arr[L] + arr[L+1] + ... + arr[R] = prefix[R] - prefix[L-1]</code><br>\
                    <span style="color:var(--text2)">R까지의 합에서 L-1까지의 합을 빼면, L부터 R까지의 합만 남습니다!</span>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">배열 크기가 100,000이고 질문이 100,000개라면, 반복문은 몇 번 계산하고 누적합은 몇 번 계산할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        반복문: 최대 <strong>100,000 × 100,000 = 100억 번</strong> (시간 초과!)<br>\
                        누적합: <strong>100,000 + 100,000 = 200,000번</strong> (한순간!)<br><br>\
                        이 차이가 바로 누적합을 쓰는 이유입니다.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> 2차원 누적합</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 격자 모양 지도에서 각 칸에 보물이 있다고 생각해 보세요.<br>\
                    "이 직사각형 영역 안에 보물이 총 몇 개인가?" 하는 질문에 빠르게 답하려면,<br>\
                    <strong>왼쪽 위 모서리(1,1)부터 각 칸까지의 보물 합계</strong>를 미리 구해두면 됩니다!\
                </div>\
\
                <p style="margin: 1rem 0 0.5rem; font-weight: 600;">2차원 누적합 공식 (포함-배제 원리)</p>\
                <div class="ps-2d-formula">\
                    <div class="ps-2d-step">\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area full">전체</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r2][c2]</span>\
                    </div>\
                    <div class="ps-2d-step">\
                        <span class="ps-2d-minus">−</span>\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area sub-top">위쪽</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r1-1][c2]</span>\
                    </div>\
                    <div class="ps-2d-step">\
                        <span class="ps-2d-minus">−</span>\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area sub-left">왼쪽</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r2][c1-1]</span>\
                    </div>\
                    <div class="ps-2d-step">\
                        <span class="ps-2d-minus">+</span>\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area add-corner">겹침</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r1-1][c1-1]</span>\
                    </div>\
                </div>\
\
                <div class="code-block"><pre><code class="language-python"># 2차원 누적합 만들기\n\
for i in range(1, N + 1):\n\
    for j in range(1, M + 1):\n\
        prefix[i][j] = (arr[i][j]\n\
                       + prefix[i-1][j]\n\
                       + prefix[i][j-1]\n\
                       - prefix[i-1][j-1])\n\
\n\
# (r1, c1) ~ (r2, c2) 영역의 합\n\
def query(r1, c1, r2, c2):\n\
    return (prefix[r2][c2]\n\
          - prefix[r1-1][c2]\n\
          - prefix[r2][c1-1]\n\
          + prefix[r1-1][c1-1])</code></pre></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">2차원에서 왜 빼고 나서 다시 더하는 부분이 있을까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        위쪽과 왼쪽을 빼면 <strong>왼쪽 위 모서리 부분이 두 번 빠지기</strong> 때문입니다!<br>\
                        한 번 빼진 것을 다시 더해서 정확한 값을 구하는 것입니다.<br>\
                        이것을 <strong>포함-배제 원리</strong>라고 합니다.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> 누적합 문제 푸는 3단계</div>\
                <p style="color:var(--text2); margin-bottom:1rem;">누적합 문제를 만나면 이 3단계를 따라가세요.</p>\
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr 1fr;">\
                    <div class="concept-card">\
                        <h3>① 누적합 배열 만들기</h3>\
                        <p>원래 배열을 쭉 훑으면서 합을 쌓아 올립니다. 2차원이면 행/열 방향으로 쌓습니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <h3>② 공식 적용하기</h3>\
                        <p>1차원: <code>prefix[R] - prefix[L-1]</code><br>2차원: 포함-배제 공식을 적용합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <h3>③ 예외 확인하기</h3>\
                        <p>인덱스가 0 이하가 되지 않는지, 나머지 연산 등 특수 조건을 확인합니다.</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">"구간 합을 여러 번 물어보는 문제"를 보면 가장 먼저 어떤 방법을 떠올려야 할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>누적합</strong>입니다!<br>\
                        "구간 합"이라는 키워드가 보이면 거의 반사적으로 누적합을 떠올리면 됩니다.<br>\
                        특히 "여러 번 물어본다"는 말이 있으면 반복문으로는 느리고, 누적합이 필수입니다.\
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

    // ===== 시각화 (concept suffix) =====
    renderVisualize: function(container) {
        var self = this;
        var suffix = 'concept-ps';
        container.innerHTML =
            '<h2>누적합 시각화</h2>' +
            '<div class="viz-type-selector">' +
            '<button class="viz-type-btn active" data-viz="ps1d">1차원 누적합</button>' +
            '<button class="viz-type-btn" data-viz="ps2d">2차원 누적합</button>' +
            '</div>' +
            '<div id="viz-content-' + suffix + '"></div>';
        var vizContent = container.querySelector('#viz-content-' + suffix);
        var buttons = container.querySelectorAll('.viz-type-btn');
        var switchViz = function(type) {
            self._clearVizState();
            buttons.forEach(function(b) { b.classList.toggle('active', b.dataset.viz === type); });
            vizContent.innerHTML = '';
            if (type === 'ps1d') self._renderConceptViz1D(vizContent, suffix);
            else self._renderConceptViz2D(vizContent, suffix);
        };
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() { switchViz(btn.dataset.viz); });
        });
        switchViz('ps1d');
    },

    _renderConceptViz1D: function(container, suffix) {
        var self = this;
        var arr = [3, 1, 4, 1, 5, 9, 2, 6];
        var prefix = [0];
        var i;
        for (i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
        container.innerHTML =
            '<div class="viz-card"><h3>1차원 누적합</h3>' +
            '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;" id="cv1d-arr-' + suffix + '"></div>' +
            '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;" id="cv1d-pref-' + suffix + '"></div>' +
            '<div id="cv1d-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix) + '</div>';
        var arrEl = container.querySelector('#cv1d-arr-' + suffix);
        var prefEl = container.querySelector('#cv1d-pref-' + suffix);
        var infoEl = container.querySelector('#cv1d-info-' + suffix);
        arrEl.innerHTML = '<span style="width:60px;font-weight:600;line-height:40px;">arr:</span>' + arr.map(function(v, idx) { return '<div class="ps-cell" style="width:40px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);">' + v + '</div>'; }).join('');
        prefEl.innerHTML = '<span style="width:60px;font-weight:600;line-height:40px;">prefix:</span>' + prefix.map(function(v, idx) { return '<div class="ps-cell" style="width:40px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);">?</div>'; }).join('');
        var steps = [];
        var prefCells = function() { return prefEl.querySelectorAll('.ps-cell'); };
        steps.push({ description: 'prefix[0] = 0 (시작값)', action: function() { prefCells()[0].textContent = '0'; prefCells()[0].style.background = 'var(--accent)15'; infoEl.innerHTML = 'prefix[0] = 0'; }, undo: function() { prefCells()[0].textContent = '?'; prefCells()[0].style.background = 'var(--bg2)'; infoEl.innerHTML = ''; } });
        for (i = 0; i < arr.length; i++) {
            (function(idx) {
                steps.push({ description: 'prefix[' + (idx+1) + '] = prefix[' + idx + '] + arr[' + (idx+1) + '] = ' + prefix[idx] + ' + ' + arr[idx] + ' = ' + prefix[idx+1],
                    action: function() { prefCells()[idx+1].textContent = prefix[idx+1]; prefCells()[idx+1].style.background = 'var(--green)20'; infoEl.innerHTML = 'prefix[' + (idx+1) + '] = ' + prefix[idx] + ' + ' + arr[idx] + ' = <strong>' + prefix[idx+1] + '</strong>'; },
                    undo: function() { prefCells()[idx+1].textContent = '?'; prefCells()[idx+1].style.background = 'var(--bg2)'; infoEl.innerHTML = idx > 0 ? 'prefix[' + idx + '] = ' + prefix[idx] : 'prefix[0] = 0'; }
                });
            })(i);
        }
        steps.push({ description: '누적합 완성! 구간 합 예시: arr[2]~arr[5] = prefix[5] - prefix[1] = ' + prefix[5] + ' - ' + prefix[1] + ' = ' + (prefix[5]-prefix[1]),
            action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">arr[2]~arr[5] = prefix[5] - prefix[1] = ' + prefix[5] + ' - ' + prefix[1] + ' = ' + (prefix[5]-prefix[1]) + '</strong>'; },
            undo: function() { infoEl.innerHTML = 'prefix[' + arr.length + '] = ' + prefix[arr.length]; }
        });
        self._initStepController(container, steps, suffix);
    },

    _renderConceptViz2D: function(container, suffix) {
        var self = this;
        container.innerHTML =
            '<div class="viz-card"><h3>2차원 누적합</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">2차원 누적합과 포함-배제 원리로 영역 합을 구합니다.</p>' +
            '<div id="cv2d-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix) + '</div>';
        var infoEl = container.querySelector('#cv2d-info-' + suffix);
        var grid = [[1,2,3],[4,5,6],[7,8,9]];
        var prefix = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        var r, c;
        for (r = 1; r <= 3; r++) for (c = 1; c <= 3; c++) prefix[r][c] = grid[r-1][c-1] + prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1];
        var steps = [];
        steps.push({ description: '3x3 격자의 2차원 누적합을 구합니다.', action: function() { infoEl.innerHTML = '격자: [[1,2,3],[4,5,6],[7,8,9]]'; }, undo: function() { infoEl.innerHTML = ''; } });
        steps.push({ description: '0번 행/열 = 0으로 초기화', action: function() { infoEl.innerHTML = 'prefix[0][*] = prefix[*][0] = 0'; }, undo: function() { infoEl.innerHTML = '격자: [[1,2,3],[4,5,6],[7,8,9]]'; } });
        steps.push({ description: 'prefix[1][1] = 1+0+0-0 = 1', action: function() { infoEl.innerHTML = 'prefix[1][1] = grid[1][1] + prefix[0][1] + prefix[1][0] - prefix[0][0] = <strong>1</strong>'; }, undo: function() { infoEl.innerHTML = 'prefix[0][*] = prefix[*][0] = 0'; } });
        steps.push({ description: '영역 (1,1)~(2,2) 합 = prefix[2][2] - prefix[0][2] - prefix[2][0] + prefix[0][0] = ' + prefix[2][2] + ' - 0 - 0 + 0 = ' + prefix[2][2],
            action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">(1,1)~(2,2) 합 = ' + prefix[2][2] + ' (= 1+2+4+5 = 12)</strong>'; },
            undo: function() { infoEl.innerHTML = 'prefix[1][1] = <strong>1</strong>'; }
        });
        steps.push({ description: '영역 (2,2)~(3,3) 합 = prefix[3][3] - prefix[1][3] - prefix[3][1] + prefix[1][1] = ' + prefix[3][3] + ' - ' + prefix[1][3] + ' - ' + prefix[3][1] + ' + ' + prefix[1][1] + ' = ' + (prefix[3][3]-prefix[1][3]-prefix[3][1]+prefix[1][1]),
            action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">(2,2)~(3,3) 합 = ' + (prefix[3][3]-prefix[1][3]-prefix[3][1]+prefix[1][1]) + ' (= 5+6+8+9 = 28)</strong>'; },
            undo: function() { infoEl.innerHTML = '<strong style="color:var(--green)">(1,1)~(2,2) 합 = ' + prefix[2][2] + '</strong>'; }
        });
        self._initStepController(container, steps, suffix);
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
    // 시뮬레이션 1: 1D 구간 합 (boj-11659)
    // ====================================================================
    _renderVizRange: function(container) {
        var self = this, suffix = '-range';
        var arr = [5, 4, 3, 2, 1];
        var prefix = [0]; var i;
        for (i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
        var queries = [[1,3],[2,4],[5,5]];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">1D 구간 합 (BOJ 11659)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">배열 [5,4,3,2,1]에서 구간 합을 구합니다.</p>' +
            '<div id="rng-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="rng-pref' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="rng-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#rng-arr' + suffix);
        var prefEl = container.querySelector('#rng-pref' + suffix);
        var infoEl = container.querySelector('#rng-info' + suffix);
        function renderCells(el, label, vals) { el.innerHTML = '<span style="width:60px;font-weight:600;line-height:40px;">' + label + '</span>' + vals.map(function(v) { return '<div style="width:44px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-weight:600;">' + v + '</div>'; }).join(''); }
        renderCells(arrEl, 'arr:', arr);
        renderCells(prefEl, 'prefix:', prefix);
        infoEl.innerHTML = '<span style="color:var(--text2)">누적합으로 구간 합을 O(1)에 구합니다.</span>';
        var steps = [];
        steps.push({ description: '누적합 배열: prefix = [' + prefix.join(', ') + ']', action: function() { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = '<span style="color:var(--text2)">누적합으로 구간 합을 O(1)에 구합니다.</span>'; } });
        queries.forEach(function(q) {
            var L = q[0], R = q[1];
            var ans = prefix[R] - prefix[L-1];
            steps.push({ description: 'arr[' + L + ']~arr[' + R + '] = prefix[' + R + '] - prefix[' + (L-1) + '] = ' + prefix[R] + ' - ' + prefix[L-1] + ' = ' + ans,
                action: function() { infoEl.innerHTML = 'arr[' + L + ']~arr[' + R + '] = prefix[' + R + '] - prefix[' + (L-1) + '] = ' + prefix[R] + ' - ' + prefix[L-1] + ' = <strong>' + ans + '</strong>'; },
                undo: function() { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; }
            });
        });
        steps.push({ description: '모든 쿼리를 O(1)로 처리 완료!', action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 결과: 12, 9, 1</strong>'; }, undo: function() { var q = queries[queries.length-1]; infoEl.innerHTML = 'arr[' + q[0] + ']~arr[' + q[1] + '] = ' + (prefix[q[1]] - prefix[q[0]-1]); } });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: 구간 합 최대 (boj-2559)
    // ====================================================================
    _renderVizWindow: function(container) {
        var self = this, suffix = '-win';
        var arr = [3, -2, -4, -9, 0, 3, 7, 13, 8, -3];
        var K = 2;
        var prefix = [0]; var i;
        for (i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">연속 K일 최대 합 (BOJ 2559)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">K=2일 때 연속 2일 합의 최대값을 구합니다.</p>' +
            '<div id="win-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="win-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#win-arr' + suffix);
        var infoEl = container.querySelector('#win-info' + suffix);
        arrEl.innerHTML = arr.map(function(v, idx) { return '<div style="width:40px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-weight:600;font-size:0.85rem;">' + v + '</div>'; }).join('');
        var steps = [];
        var maxVal = -Infinity, maxPos = -1;
        steps.push({ description: '누적합 배열을 만들고 길이 2인 모든 구간의 합을 구합니다.', action: function() { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
        for (i = 1; i <= arr.length - K + 1; i++) {
            (function(idx) {
                var sum = prefix[idx + K - 1] - prefix[idx - 1];
                if (sum > maxVal) { maxVal = sum; maxPos = idx; }
                steps.push({ description: 'i=' + idx + ': prefix[' + (idx+K-1) + '] - prefix[' + (idx-1) + '] = ' + prefix[idx+K-1] + ' - ' + prefix[idx-1] + ' = ' + sum,
                    action: function() { infoEl.innerHTML = 'arr[' + idx + ']~arr[' + (idx+K-1) + '] 합 = <strong>' + sum + '</strong>' + (sum === maxVal && idx === maxPos ? ' ← 현재 최대!' : ''); },
                    undo: function() { infoEl.innerHTML = idx > 1 ? 'arr[' + (idx-1) + ']~arr[' + (idx+K-2) + '] 합 = ' + (prefix[idx+K-2] - prefix[idx-2]) : 'prefix = [' + prefix.join(', ') + ']'; }
                });
            })(i);
        }
        steps.push({ description: '최대값 = ' + maxVal + ' (위치: arr[' + maxPos + ']~arr[' + (maxPos+K-1) + '])', action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 최대 합 = ' + maxVal + ' (arr[' + maxPos + ']~arr[' + (maxPos+K-1) + '] = ' + arr[maxPos-1] + '+' + arr[maxPos] + ')</strong>'; }, undo: function() { var last = arr.length - K + 1; infoEl.innerHTML = 'arr[' + last + ']~arr[' + (last+K-1) + '] 합 = ' + (prefix[last+K-1] - prefix[last-1]); } });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 문자별 누적합 (boj-16139)
    // ====================================================================
    _renderVizCharSum: function(container) {
        var self = this, suffix = '-char';
        var S = 'seungjaehwang';
        var queries = [['a',0,12],['s',0,12],['a',3,7],['a',0,5]];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">문자별 누적합 (BOJ 16139)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">문자열 "' + S + '"에서 특정 문자의 구간별 등장 횟수를 구합니다.</p>' +
            '<div id="ch-str' + suffix + '" style="display:flex;gap:2px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="ch-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var strEl = container.querySelector('#ch-str' + suffix);
        var infoEl = container.querySelector('#ch-info' + suffix);
        strEl.innerHTML = S.split('').map(function(c, i) { return '<div style="width:28px;text-align:center;padding:4px 2px;border-radius:4px;background:var(--bg2);font-family:monospace;font-weight:600;">' + c + '</div>'; }).join('');
        // 26개 알파벳 누적합
        var count = [];
        var c;
        for (c = 0; c < 26; c++) { count[c] = [0]; for (var j = 0; j < S.length; j++) { count[c].push(count[c][j] + (S.charCodeAt(j) - 97 === c ? 1 : 0)); } }
        var steps = [];
        steps.push({ description: '26개 알파벳 각각에 대해 누적합 배열을 만듭니다.', action: function() { infoEl.innerHTML = '각 알파벳별로 누적합 배열을 구축합니다.'; }, undo: function() { infoEl.innerHTML = ''; } });
        steps.push({ description: '예: "a"의 누적합 = [' + count[0].join(',') + ']', action: function() { infoEl.innerHTML = 'count["a"] = [' + count[0].join(', ') + ']'; }, undo: function() { infoEl.innerHTML = '각 알파벳별로 누적합 배열을 구축합니다.'; } });
        queries.forEach(function(q, qi) {
            var ch = q[0], l = q[1], r = q[2];
            var ci = ch.charCodeAt(0) - 97;
            var ans = count[ci][r+1] - count[ci][l];
            steps.push({ description: '"' + ch + '" in [' + l + ',' + r + '] = count["' + ch + '"][' + (r+1) + '] - count["' + ch + '"][' + l + '] = ' + count[ci][r+1] + ' - ' + count[ci][l] + ' = ' + ans,
                action: function() { infoEl.innerHTML = '"' + ch + '" in S[' + l + '..' + r + '] = <strong>' + ans + '</strong>'; },
                undo: function() { if (qi === 0) infoEl.innerHTML = 'count["a"] = [' + count[0].join(', ') + ']'; else { var pq = queries[qi-1]; var pci = pq[0].charCodeAt(0)-97; infoEl.innerHTML = '"' + pq[0] + '" in S[' + pq[1] + '..' + pq[2] + '] = ' + (count[pci][pq[2]+1] - count[pci][pq[1]]); } }
            });
        });
        steps.push({ description: '결과: 2, 1, 0, 1', action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 결과: 2, 1, 0, 1</strong>'; }, undo: function() { var q = queries[queries.length-1]; var ci = q[0].charCodeAt(0)-97; infoEl.innerHTML = '"' + q[0] + '" in S[' + q[1] + '..' + q[2] + '] = ' + (count[ci][q[2]+1] - count[ci][q[1]]); } });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: 나머지 합 (boj-10986)
    // ====================================================================
    _renderVizModSum: function(container) {
        var self = this, suffix = '-mod';
        var arr = [1, 2, 3, 1, 2];
        var M = 3;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">나머지 합 (BOJ 10986)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">배열 [1,2,3,1,2]에서 합이 3의 배수인 구간의 수를 구합니다.</p>' +
            '<div id="mod-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="mod-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#mod-arr' + suffix);
        var infoEl = container.querySelector('#mod-info' + suffix);
        arrEl.innerHTML = arr.map(function(v) { return '<div style="width:44px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-weight:600;">' + v + '</div>'; }).join('');
        var prefMod = [0]; var cnt = [0,0,0]; cnt[0] = 1;
        var i;
        for (i = 0; i < arr.length; i++) { prefMod.push((prefMod[i] + arr[i]) % M); cnt[prefMod[i+1]]++; }
        var steps = [];
        steps.push({ description: 'prefix_mod 배열을 만듭니다 (각 누적합을 M=3으로 나눈 나머지).', action: function() { infoEl.innerHTML = 'prefix_mod = [' + prefMod.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
        steps.push({ description: '나머지별 개수: cnt[0]=' + cnt[0] + ', cnt[1]=' + cnt[1] + ', cnt[2]=' + cnt[2], action: function() { infoEl.innerHTML = 'cnt = [' + cnt.join(', ') + '] (나머지 0, 1, 2의 개수)'; }, undo: function() { infoEl.innerHTML = 'prefix_mod = [' + prefMod.join(', ') + ']'; } });
        steps.push({ description: '나머지가 같은 쌍 = nC2: ' + cnt[0] + 'C2 + ' + cnt[1] + 'C2 + ' + cnt[2] + 'C2', action: function() { var ans = 0; for (var r = 0; r < M; r++) ans += cnt[r]*(cnt[r]-1)/2; infoEl.innerHTML = cnt[0] + 'C2 + ' + cnt[1] + 'C2 + ' + cnt[2] + 'C2 = ' + (cnt[0]*(cnt[0]-1)/2) + ' + ' + (cnt[1]*(cnt[1]-1)/2) + ' + ' + (cnt[2]*(cnt[2]-1)/2) + ' = <strong>' + ans + '</strong>'; }, undo: function() { infoEl.innerHTML = 'cnt = [' + cnt.join(', ') + ']'; } });
        steps.push({ description: '답: 7', action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 합이 3의 배수인 구간 = 7개</strong>'; }, undo: function() { var ans = 0; for (var r = 0; r < M; r++) ans += cnt[r]*(cnt[r]-1)/2; infoEl.innerHTML = '답 = ' + ans; } });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 5: 2D 누적합 (boj-11660)
    // ====================================================================
    _renderViz2DSum: function(container) {
        var self = this, suffix = '-2d';
        var grid = [[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7]];
        var N = 4;
        var prefix = []; var i, j;
        for (i = 0; i <= N; i++) { prefix[i] = []; for (j = 0; j <= N; j++) prefix[i][j] = 0; }
        for (i = 1; i <= N; i++) for (j = 1; j <= N; j++) prefix[i][j] = grid[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
        var queries = [[2,2,3,4],[3,4,3,4],[1,1,4,4]];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">2D 구간 합 (BOJ 11660)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4x4 표에서 2차원 누적합으로 영역 합을 구합니다.</p>' +
            '<div id="d2-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var infoEl = container.querySelector('#d2-info' + suffix);
        var steps = [];
        steps.push({ description: '4x4 격자에서 2차원 누적합을 구축합니다.', action: function() { infoEl.innerHTML = '격자: [[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7]]'; }, undo: function() { infoEl.innerHTML = ''; } });
        steps.push({ description: '2차원 누적합 배열 완성', action: function() { infoEl.innerHTML = '포함-배제 공식으로 각 칸의 누적합을 구했습니다.'; }, undo: function() { infoEl.innerHTML = '격자: [[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7]]'; } });
        queries.forEach(function(q, qi) {
            var x1 = q[0], y1 = q[1], x2 = q[2], y2 = q[3];
            var ans = prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1];
            steps.push({ description: '(' + x1 + ',' + y1 + ')~(' + x2 + ',' + y2 + '): prefix[' + x2 + '][' + y2 + '] - prefix[' + (x1-1) + '][' + y2 + '] - prefix[' + x2 + '][' + (y1-1) + '] + prefix[' + (x1-1) + '][' + (y1-1) + '] = ' + ans,
                action: function() { infoEl.innerHTML = '(' + x1 + ',' + y1 + ')~(' + x2 + ',' + y2 + ') = ' + prefix[x2][y2] + ' - ' + prefix[x1-1][y2] + ' - ' + prefix[x2][y1-1] + ' + ' + prefix[x1-1][y1-1] + ' = <strong>' + ans + '</strong>'; },
                undo: function() { if (qi === 0) infoEl.innerHTML = '포함-배제 공식으로 각 칸의 누적합을 구했습니다.'; else { var pq = queries[qi-1]; var pa = prefix[pq[2]][pq[3]] - prefix[pq[0]-1][pq[3]] - prefix[pq[2]][pq[1]-1] + prefix[pq[0]-1][pq[1]-1]; infoEl.innerHTML = '(' + pq[0] + ',' + pq[1] + ')~(' + pq[2] + ',' + pq[3] + ') = ' + pa; } }
            });
        });
        steps.push({ description: '결과: 27, 6, 64', action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 결과: 27, 6, 64</strong>'; }, undo: function() { var q = queries[queries.length-1]; var a = prefix[q[2]][q[3]] - prefix[q[0]-1][q[3]] - prefix[q[2]][q[1]-1] + prefix[q[0]-1][q[1]-1]; infoEl.innerHTML = '(' + q[0] + ',' + q[1] + ')~(' + q[2] + ',' + q[3] + ') = ' + a; } });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 6: 체스판 (boj-25682)
    // ====================================================================
    _renderVizChess: function(container) {
        var self = this, suffix = '-chess';
        var board = ['BBBB','BBBB','BBBB','BBBB'];
        var N = 4, M2 = 4, K = 3;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">체스판 다시 칠하기 (BOJ 25682)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4x4 보드(전부 B)에서 3x3 체스판을 만들기 위해 최소 몇 칸을 다시 칠해야 하는지 구합니다.</p>' +
            '<div id="cs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var infoEl = container.querySelector('#cs-info' + suffix);
        // diff 배열: (i+j)짝수=B 패턴 기준으로 다른 칸이면 1
        var diff = []; var prefix = [];
        var i, j;
        for (i = 0; i <= N; i++) { diff[i] = []; prefix[i] = []; for (j = 0; j <= M2; j++) { diff[i][j] = 0; prefix[i][j] = 0; } }
        for (i = 1; i <= N; i++) for (j = 1; j <= M2; j++) { var exp = (i+j) % 2 === 0 ? 'B' : 'W'; diff[i][j] = board[i-1][j-1] !== exp ? 1 : 0; }
        for (i = 1; i <= N; i++) for (j = 1; j <= M2; j++) prefix[i][j] = diff[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
        var steps = [];
        steps.push({ description: '(i+j) 짝수=B 패턴 기준으로 "다른 칸" 배열(diff)을 만듭니다.', action: function() { var rows = []; for (var r = 1; r <= N; r++) { var row = []; for (var c = 1; c <= M2; c++) row.push(diff[r][c]); rows.push('[' + row.join(',') + ']'); } infoEl.innerHTML = 'diff = [' + rows.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
        steps.push({ description: 'diff 배열의 2차원 누적합을 구합니다.', action: function() { infoEl.innerHTML = '2차원 누적합 배열 완성'; }, undo: function() { var rows = []; for (var r = 1; r <= N; r++) { var row = []; for (var c = 1; c <= M2; c++) row.push(diff[r][c]); rows.push('[' + row.join(',') + ']'); } infoEl.innerHTML = 'diff = [' + rows.join(', ') + ']'; } });
        // 모든 K×K 영역 스캔
        var bestCost = N * M2, bestI = 1, bestJ = 1;
        var results = [];
        for (i = 1; i <= N - K + 1; i++) {
            for (j = 1; j <= M2 - K + 1; j++) {
                var cost1 = prefix[i+K-1][j+K-1] - prefix[i-1][j+K-1] - prefix[i+K-1][j-1] + prefix[i-1][j-1];
                var cost2 = K*K - cost1;
                var best = Math.min(cost1, cost2);
                results.push({i:i, j:j, cost1:cost1, cost2:cost2, best:best});
                if (best < bestCost) { bestCost = best; bestI = i; bestJ = j; }
            }
        }
        results.forEach(function(r, ri) {
            steps.push({ description: '영역 (' + r.i + ',' + r.j + ')~(' + (r.i+K-1) + ',' + (r.j+K-1) + '): 패턴1=' + r.cost1 + ', 패턴2=' + r.cost2 + ', min=' + r.best,
                action: function() { infoEl.innerHTML = '(' + r.i + ',' + r.j + ')~(' + (r.i+K-1) + ',' + (r.j+K-1) + '): 패턴1=' + r.cost1 + ', 패턴2=' + r.cost2 + ' → <strong>' + r.best + '</strong>'; },
                undo: function() { if (ri === 0) infoEl.innerHTML = '2차원 누적합 배열 완성'; else { var p = results[ri-1]; infoEl.innerHTML = '(' + p.i + ',' + p.j + ')~(' + (p.i+K-1) + ',' + (p.j+K-1) + '): min=' + p.best; } }
            });
        });
        steps.push({ description: '최소 비용 = ' + bestCost, action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 최소 다시 칠할 칸 = ' + bestCost + '</strong>'; }, undo: function() { var last = results[results.length-1]; infoEl.innerHTML = '(' + last.i + ',' + last.j + '): min=' + last.best; } });
        self._initStepController(container, steps, suffix);
    },

    // ===== 빈 스텁 =====
    renderProblem: function(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '1차원 입문', desc: '기본 누적합 (Silver III)', problemIds: ['boj-11659', 'boj-2559'] },
        { num: 2, title: '응용', desc: '누적합 활용 (Silver I ~ Gold III)', problemIds: ['boj-16139', 'boj-10986'] },
        { num: 3, title: '2차원', desc: '2차원 누적합 (Silver I ~ Gold V)', problemIds: ['boj-11660', 'boj-25682'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 1차원 입문 ==========
        {
            id: 'boj-11659', title: 'BOJ 11659 - 구간 합 구하기 4', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11659',
            simIntro: '누적합 배열을 만들고 구간 합 쿼리를 O(1)로 처리하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>수 N개가 주어졌을 때, i번째 수부터 j번째 수까지의 합을 구하는 프로그램을 작성하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 수의 개수 N과 합을 구해야 하는 횟수 M이 주어진다. (1 ≤ N ≤ 100,000, 1 ≤ M ≤ 100,000)<br>둘째 줄에 N개의 수가 주어진다. 각 수는 1,000 이하의 자연수이다.<br>셋째 줄부터 M개의 줄에는 합을 구해야 하는 구간 i와 j가 주어진다.</p></div><div><h4>출력</h4><p>총 M개의 줄에 입력으로 주어진 i번째 수부터 j번째 수까지의 합을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5 3\n5 4 3 2 1\n1 3\n2 4\n5 5</pre></div><div><strong>출력</strong><pre>12\n9\n1</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '질문이 최대 100,000번이므로 매번 반복문으로 합을 구하면 시간 초과입니다. <strong>누적합</strong>을 미리 만들어 두세요.' },
                { title: '핵심 공식', content: '<code>prefix[j] - prefix[i-1]</code>로 i번째~j번째의 합을 O(1)에 구할 수 있습니다.' },
                { title: '주의할 점', content: '인덱스가 1부터 시작합니다. <code>prefix[0] = 0</code>으로 두면 예외 처리 없이 깔끔하게 풀 수 있습니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\n# 누적합 배열 만들기\nprefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]\n\n# 각 질문에 답하기\nfor _ in range(M):\n    i, j = map(int, input().split())\n    print(prefix[j] - prefix[i - 1])',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;\n    }\n\n    while (M--) {\n        int i, j;\n        cin >> i >> j;\n        cout << prefix[j] - prefix[i - 1] << \'\\n\';\n    }\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int M = Integer.parseInt(st.nextToken());\n\n        long[] prefix = new long[N + 1];\n        st = new StringTokenizer(br.readLine());\n        for (int i = 1; i <= N; i++) {\n            prefix[i] = prefix[i - 1] + Integer.parseInt(st.nextToken());\n        }\n\n        StringBuilder sb = new StringBuilder();\n        for (int q = 0; q < M; q++) {\n            st = new StringTokenizer(br.readLine());\n            int i = Integer.parseInt(st.nextToken());\n            int j = Integer.parseInt(st.nextToken());\n            sb.append(prefix[j] - prefix[i - 1]).append(\'\\n\');\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '1D 누적합',
                description: '누적합 배열을 만든 뒤 prefix[j] - prefix[i-1]로 O(1) 쿼리 처리합니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))' },
                        { title: '누적합 배열 만들기', code: 'prefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]' },
                        { title: '쿼리 처리', code: 'for _ in range(M):\n    i, j = map(int, input().split())\n    print(prefix[j] - prefix[i - 1])' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-2559', title: 'BOJ 2559 - 수열', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2559',
            simIntro: '누적합으로 길이 K인 모든 구간의 합을 구하고 최대값을 찾는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>매일 측정한 온도가 N일 동안 주어졌을 때, 연속적인 K일 동안의 온도의 합이 가장 큰 값을 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N과 K가 주어진다. (1 ≤ K ≤ N ≤ 100,000)<br>둘째 줄에 N개의 정수가 주어진다. (-100 ≤ 각 값 ≤ 100)</p></div><div><h4>출력</h4><p>연속적인 K일의 온도 합의 최대값을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>10 2\n3 -2 -4 -9 0 3 7 13 8 -3</pre></div><div><strong>출력</strong><pre>21</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '연속 K일의 합 = 길이가 K인 구간의 합입니다. 누적합을 만들어 모든 길이 K 구간의 합을 구하고 최대값을 찾으세요.' },
                { title: '핵심 공식', content: 'i번째부터 K개 합 = <code>prefix[i + K - 1] - prefix[i - 1]</code><br>이것을 i = 1부터 N - K + 1까지 반복하며 최대값을 구합니다.' },
                { title: '다른 방법', content: '슬라이딩 윈도우로도 풀 수 있습니다. 하지만 누적합을 쓰면 코드가 더 간단합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\narr = list(map(int, input().split()))\n\n# 누적합 배열 만들기\nprefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]\n\n# 길이 K인 모든 구간의 합 중 최대값\nans = -float(\'inf\')\nfor i in range(1, N - K + 2):\n    ans = max(ans, prefix[i + K - 1] - prefix[i - 1])\n\nprint(ans)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n\n    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;\n    }\n\n    long long ans = -1e18;\n    for (int i = 1; i <= N - K + 1; i++) {\n        ans = max(ans, prefix[i + K - 1] - prefix[i - 1]);\n    }\n    cout << ans << endl;\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int K = Integer.parseInt(st.nextToken());\n\n        long[] prefix = new long[N + 1];\n        st = new StringTokenizer(br.readLine());\n        for (int i = 1; i <= N; i++) {\n            prefix[i] = prefix[i - 1] + Integer.parseInt(st.nextToken());\n        }\n\n        long ans = Long.MIN_VALUE;\n        for (int i = 1; i <= N - K + 1; i++) {\n            ans = Math.max(ans, prefix[i + K - 1] - prefix[i - 1]);\n        }\n        System.out.println(ans);\n    }\n}'
            },
            solutions: [{
                approach: '누적합 + 슬라이딩',
                description: '누적합 배열에서 길이 K 구간의 합을 모두 구해 최대값을 찾습니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\narr = list(map(int, input().split()))' },
                        { title: '누적합', code: 'prefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]' },
                        { title: '최대 구간 합', code: 'ans = -float(\'inf\')\nfor i in range(1, N - K + 2):\n    ans = max(ans, prefix[i + K - 1] - prefix[i - 1])\n\nprint(ans)' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[1].templates; }
            }]
        },

        // ========== 2단계: 응용 ==========
        {
            id: 'boj-16139', title: 'BOJ 16139 - 인간-컴퓨터 상호작용', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/16139',
            simIntro: '26개 알파벳 각각에 대한 누적합으로 문자 빈도 쿼리를 처리하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>문자열 S와 질문이 주어집니다. 각 질문은 알파벳 하나와 구간 [l, r]로 이루어져 있으며, S의 l번째부터 r번째까지에서 그 알파벳이 몇 번 나오는지 구해야 합니다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 문자열 S (길이 ≤ 200,000)<br>둘째 줄에 질문의 수 q (≤ 200,000)<br>다음 q줄에 알파벳, l, r이 주어진다.</p></div><div><h4>출력</h4><p>각 질문에 대한 답을 한 줄에 하나씩 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>seungjaehwang\n4\na 0 12\ns 0 12\na 3 7\na 0 5</pre></div><div><strong>출력</strong><pre>2\n1\n0\n1</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '알파벳 하나에 대한 누적합이 아니라, <strong>26개 알파벳 각각에 대해 누적합 배열</strong>을 만들어야 합니다.' },
                { title: '핵심 아이디어', content: '<code>count[c][i]</code> = 문자열의 처음부터 i번째까지 알파벳 c가 나온 횟수<br>답: <code>count[c][r+1] - count[c][l]</code>' },
                { title: '구현 팁', content: '인덱스가 0부터 시작합니다. 누적합 배열은 길이를 N+1로 만들면 편합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nS = input().strip()\nN = len(S)\nq = int(input())\n\n# 26개 알파벳별 누적합\ncount = [[0] * (N + 1) for _ in range(26)]\nfor i in range(N):\n    for c in range(26):\n        count[c][i + 1] = count[c][i]\n    count[ord(S[i]) - ord(\'a\')][i + 1] += 1\n\nfor _ in range(q):\n    parts = input().split()\n    c = ord(parts[0]) - ord(\'a\')\n    l, r = int(parts[1]), int(parts[2])\n    print(count[c][r + 1] - count[c][l])',
                cpp: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint count[26][200002];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    string S;\n    cin >> S;\n    int N = S.size();\n    int q;\n    cin >> q;\n\n    for (int i = 0; i < N; i++) {\n        for (int c = 0; c < 26; c++)\n            count[c][i + 1] = count[c][i];\n        count[S[i] - \'a\'][i + 1]++;\n    }\n\n    while (q--) {\n        char ch;\n        int l, r;\n        cin >> ch >> l >> r;\n        cout << count[ch - \'a\'][r + 1] - count[ch - \'a\'][l] << \'\\n\';\n    }\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String S = br.readLine().trim();\n        int N = S.length();\n        int q = Integer.parseInt(br.readLine().trim());\n\n        int[][] count = new int[26][N + 1];\n        for (int i = 0; i < N; i++) {\n            for (int c = 0; c < 26; c++)\n                count[c][i + 1] = count[c][i];\n            count[S.charAt(i) - \'a\'][i + 1]++;\n        }\n\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < q; i++) {\n            StringTokenizer st = new StringTokenizer(br.readLine());\n            int c = st.nextToken().charAt(0) - \'a\';\n            int l = Integer.parseInt(st.nextToken());\n            int r = Integer.parseInt(st.nextToken());\n            sb.append(count[c][r + 1] - count[c][l]).append(\'\\n\');\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '문자별 누적합',
                description: '26개 알파벳 각각에 대한 누적합 배열을 만들어 O(1) 쿼리 처리합니다.',
                timeComplexity: 'O(26N + Q)',
                spaceComplexity: 'O(26N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nS = input().strip()\nN = len(S)\nq = int(input())' },
                        { title: '26개 알파벳 누적합', code: 'count = [[0] * (N + 1) for _ in range(26)]\nfor i in range(N):\n    for c in range(26):\n        count[c][i + 1] = count[c][i]\n    count[ord(S[i]) - ord(\'a\')][i + 1] += 1' },
                        { title: '쿼리 처리', code: 'for _ in range(q):\n    parts = input().split()\n    c = ord(parts[0]) - ord(\'a\')\n    l, r = int(parts[1]), int(parts[2])\n    print(count[c][r + 1] - count[c][l])' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-10986', title: 'BOJ 10986 - 나머지 합', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/10986',
            simIntro: '누적합의 나머지가 같은 쌍을 세는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>수 N개가 주어졌을 때, 연속된 부분 구간의 합이 M으로 나누어 떨어지는 구간의 개수를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N과 M이 주어진다. (1 ≤ N ≤ 1,000,000, 2 ≤ M ≤ 1,000)<br>둘째 줄에 N개의 수가 주어진다. (0 ≤ 각 수 ≤ 1,000,000,000)</p></div><div><h4>출력</h4><p>M으로 나누어 떨어지는 구간의 수를 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5 3\n1 2 3 1 2</pre></div><div><strong>출력</strong><pre>7</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '구간 합 = <code>prefix[j] - prefix[i]</code>가 M의 배수 ⟺ <code>prefix[j] % M == prefix[i] % M</code>입니다.' },
                { title: '핵심 아이디어', content: '누적합의 나머지가 같은 것끼리 짝을 지으면 됩니다!<br><code>cnt[r]</code> = 나머지가 r인 prefix 값의 개수<br>답 = Σ <code>cnt[r] × (cnt[r]-1) / 2</code> (나머지가 같은 쌍의 수)' },
                { title: '주의할 점', content: '<code>prefix[0] = 0</code>도 포함해야 합니다 (나머지 0).<br>또한 답이 매우 커질 수 있으므로 <strong>long long</strong> 타입을 사용하세요.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\n# 나머지별 개수 세기\ncnt = [0] * M\nprefix_mod = 0\ncnt[0] = 1  # prefix[0] = 0의 나머지는 0\n\nfor x in arr:\n    prefix_mod = (prefix_mod + x) % M\n    cnt[prefix_mod] += 1\n\n# 나머지가 같은 쌍의 수 = nC2\nans = 0\nfor c in cnt:\n    ans += c * (c - 1) // 2\n\nprint(ans)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    long long cnt[1001] = {0};\n    cnt[0] = 1;\n    long long prefix_mod = 0;\n\n    for (int i = 0; i < N; i++) {\n        long long x;\n        cin >> x;\n        prefix_mod = (prefix_mod + x) % M;\n        cnt[prefix_mod]++;\n    }\n\n    long long ans = 0;\n    for (int r = 0; r < M; r++) {\n        ans += cnt[r] * (cnt[r] - 1) / 2;\n    }\n    cout << ans << endl;\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int M = Integer.parseInt(st.nextToken());\n\n        long[] cnt = new long[M];\n        cnt[0] = 1;\n        long prefixMod = 0;\n\n        st = new StringTokenizer(br.readLine());\n        for (int i = 0; i < N; i++) {\n            prefixMod = (prefixMod + Long.parseLong(st.nextToken())) % M;\n            cnt[(int) prefixMod]++;\n        }\n\n        long ans = 0;\n        for (int r = 0; r < M; r++) {\n            ans += cnt[r] * (cnt[r] - 1) / 2;\n        }\n        System.out.println(ans);\n    }\n}'
            },
            solutions: [{
                approach: '나머지 분류',
                description: '누적합의 나머지가 같은 쌍의 수를 조합(nC2)으로 구합니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))' },
                        { title: '나머지별 개수', code: 'cnt = [0] * M\nprefix_mod = 0\ncnt[0] = 1\n\nfor x in arr:\n    prefix_mod = (prefix_mod + x) % M\n    cnt[prefix_mod] += 1' },
                        { title: '조합 계산', code: 'ans = 0\nfor c in cnt:\n    ans += c * (c - 1) // 2\n\nprint(ans)' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[3].templates; }
            }]
        },

        // ========== 3단계: 2차원 ==========
        {
            id: 'boj-11660', title: 'BOJ 11660 - 구간 합 구하기 5', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11660',
            simIntro: '2차원 누적합과 포함-배제 공식으로 영역 합을 구하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N×N 표에 수가 채워져 있습니다. (x1, y1)부터 (x2, y2)까지 합을 구하는 프로그램을 작성하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 표의 크기 N과 합을 구해야 하는 횟수 M이 주어진다. (1 ≤ N ≤ 1024, 1 ≤ M ≤ 100,000)<br>다음 N줄에 표의 수가 주어진다.<br>다음 M줄에 x1, y1, x2, y2가 주어진다.</p></div><div><h4>출력</h4><p>총 M줄에 걸쳐 (x1, y1)부터 (x2, y2)까지의 합을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4 3\n1 2 3 4\n2 3 4 5\n3 4 5 6\n4 5 6 7\n2 2 3 4\n3 4 3 4\n1 1 4 4</pre></div><div><strong>출력</strong><pre>27\n6\n64</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '<strong>2차원 누적합</strong>을 사용합니다. 개념 설명에서 배운 포함-배제 공식을 그대로 적용하세요.' },
                { title: '누적합 만들기', content: '<code>prefix[i][j] = arr[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]</code>' },
                { title: '쿼리 공식', content: '<code>prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1]</code>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\n\n# 2차원 누적합 만들기\nprefix = [[0] * (N + 1) for _ in range(N + 1)]\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(1, N + 1):\n        prefix[i][j] = (row[j - 1]\n                        + prefix[i - 1][j]\n                        + prefix[i][j - 1]\n                        - prefix[i - 1][j - 1])\n\n# 각 질문에 답하기\nfor _ in range(M):\n    x1, y1, x2, y2 = map(int, input().split())\n    ans = (prefix[x2][y2]\n          - prefix[x1 - 1][y2]\n          - prefix[x2][y1 - 1]\n          + prefix[x1 - 1][y1 - 1])\n    print(ans)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint prefix[1025][1025];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    for (int i = 1; i <= N; i++) {\n        for (int j = 1; j <= N; j++) {\n            int x;\n            cin >> x;\n            prefix[i][j] = x + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];\n        }\n    }\n\n    while (M--) {\n        int x1, y1, x2, y2;\n        cin >> x1 >> y1 >> x2 >> y2;\n        cout << prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1] << \'\\n\';\n    }\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int M = Integer.parseInt(st.nextToken());\n\n        int[][] prefix = new int[N + 1][N + 1];\n        for (int i = 1; i <= N; i++) {\n            st = new StringTokenizer(br.readLine());\n            for (int j = 1; j <= N; j++) {\n                int x = Integer.parseInt(st.nextToken());\n                prefix[i][j] = x + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];\n            }\n        }\n\n        StringBuilder sb = new StringBuilder();\n        for (int q = 0; q < M; q++) {\n            st = new StringTokenizer(br.readLine());\n            int x1 = Integer.parseInt(st.nextToken());\n            int y1 = Integer.parseInt(st.nextToken());\n            int x2 = Integer.parseInt(st.nextToken());\n            int y2 = Integer.parseInt(st.nextToken());\n            sb.append(prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1]).append(\'\\n\');\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '2차원 누적합',
                description: '2차원 누적합 + 포함-배제 공식으로 영역 합을 O(1)에 구합니다.',
                timeComplexity: 'O(N^2 + M)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())' },
                        { title: '2차원 누적합', code: 'prefix = [[0] * (N + 1) for _ in range(N + 1)]\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(1, N + 1):\n        prefix[i][j] = row[j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]' },
                        { title: '쿼리 처리', code: 'for _ in range(M):\n    x1, y1, x2, y2 = map(int, input().split())\n    print(prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1])' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-25682', title: 'BOJ 25682 - 체스판 다시 칠하기 2', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/25682',
            simIntro: '2차원 누적합으로 체스판 패턴과 다른 칸의 수를 빠르게 구하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N×M 보드에서 K×K 크기로 잘라 체스판을 만들려 합니다. 체스판은 검은색과 흰색이 번갈아 칠해져 있어야 합니다. 다시 칠해야 하는 칸의 최소 개수를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N, M, K가 주어진다. (1 ≤ K ≤ N, M ≤ 2,000)<br>다음 N줄에 보드의 상태가 B(검정) 또는 W(흰색)로 주어진다.</p></div><div><h4>출력</h4><p>다시 칠해야 하는 칸의 최소 개수를 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4 4 3\nBBBB\nBBBB\nBBBB\nBBBB</pre></div><div><strong>출력</strong><pre>4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '체스판 패턴은 2가지입니다: (1) 왼쪽 위가 검정, (2) 왼쪽 위가 흰색. 각 패턴에 대해 "다시 칠해야 하는 칸"을 0/1로 만든 뒤, <strong>2차원 누적합</strong>으로 K×K 영역의 합을 빠르게 구합니다.' },
                { title: '핵심 아이디어', content: '(i+j)가 짝수인 칸이 B인지 W인지로 체스판 패턴과 다른지 판단합니다.<br>칸 (i,j)에서 기대 색이 아니면 1, 맞으면 0인 배열을 만든 뒤 2차원 누적합을 구합니다.' },
                { title: '최적화', content: '패턴 1의 "다시 칠할 수"가 x이면, 패턴 2의 "다시 칠할 수"는 K×K - x입니다. 그래서 한 번만 누적합을 만들면 됩니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M, K = map(int, input().split())\nboard = [input().strip() for _ in range(N)]\n\n# (i+j)가 짝수인 칸에 B가 와야 하는 패턴 기준\ndiff = [[0] * (M + 1) for _ in range(N + 1)]\nfor i in range(N):\n    for j in range(M):\n        expected = \'B\' if (i + j) % 2 == 0 else \'W\'\n        diff[i + 1][j + 1] = 1 if board[i][j] != expected else 0\n\n# 2차원 누적합\nprefix = [[0] * (M + 1) for _ in range(N + 1)]\nfor i in range(1, N + 1):\n    for j in range(1, M + 1):\n        prefix[i][j] = (diff[i][j]\n                        + prefix[i-1][j]\n                        + prefix[i][j-1]\n                        - prefix[i-1][j-1])\n\nans = float(\'inf\')\nfor i in range(1, N - K + 2):\n    for j in range(1, M - K + 2):\n        cost1 = (prefix[i+K-1][j+K-1]\n                - prefix[i-1][j+K-1]\n                - prefix[i+K-1][j-1]\n                + prefix[i-1][j-1])\n        cost2 = K * K - cost1\n        ans = min(ans, cost1, cost2)\n\nprint(ans)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint prefix[2001][2001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M, K;\n    cin >> N >> M >> K;\n\n    for (int i = 1; i <= N; i++) {\n        string row;\n        cin >> row;\n        for (int j = 1; j <= M; j++) {\n            char expected = ((i + j) % 2 == 0) ? \'B\' : \'W\';\n            int diff = (row[j - 1] != expected) ? 1 : 0;\n            prefix[i][j] = diff + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];\n        }\n    }\n\n    int ans = N * M;\n    for (int i = 1; i <= N - K + 1; i++) {\n        for (int j = 1; j <= M - K + 1; j++) {\n            int cost1 = prefix[i+K-1][j+K-1] - prefix[i-1][j+K-1] - prefix[i+K-1][j-1] + prefix[i-1][j-1];\n            int cost2 = K * K - cost1;\n            ans = min({ans, cost1, cost2});\n        }\n    }\n    cout << ans << endl;\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int M = Integer.parseInt(st.nextToken());\n        int K = Integer.parseInt(st.nextToken());\n\n        int[][] prefix = new int[N + 1][M + 1];\n        for (int i = 1; i <= N; i++) {\n            String row = br.readLine().trim();\n            for (int j = 1; j <= M; j++) {\n                char expected = ((i + j) % 2 == 0) ? \'B\' : \'W\';\n                int diff = (row.charAt(j - 1) != expected) ? 1 : 0;\n                prefix[i][j] = diff + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];\n            }\n        }\n\n        int ans = N * M;\n        for (int i = 1; i <= N - K + 1; i++) {\n            for (int j = 1; j <= M - K + 1; j++) {\n                int cost1 = prefix[i+K-1][j+K-1] - prefix[i-1][j+K-1] - prefix[i+K-1][j-1] + prefix[i-1][j-1];\n                int cost2 = K * K - cost1;\n                ans = Math.min(ans, Math.min(cost1, cost2));\n            }\n        }\n        System.out.println(ans);\n    }\n}'
            },
            solutions: [{
                approach: '2차원 누적합 + 체스판 패턴',
                description: '체스판 패턴과 다른 칸을 0/1 배열로 만들고 2차원 누적합으로 최소 비용을 구합니다.',
                timeComplexity: 'O(N*M)',
                spaceComplexity: 'O(N*M)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN, M, K = map(int, input().split())\nboard = [input().strip() for _ in range(N)]' },
                        { title: 'diff + 누적합', code: 'diff = [[0]*(M+1) for _ in range(N+1)]\nfor i in range(N):\n    for j in range(M):\n        expected = \'B\' if (i+j)%2==0 else \'W\'\n        diff[i+1][j+1] = 1 if board[i][j] != expected else 0\n\nprefix = [[0]*(M+1) for _ in range(N+1)]\nfor i in range(1,N+1):\n    for j in range(1,M+1):\n        prefix[i][j] = diff[i][j]+prefix[i-1][j]+prefix[i][j-1]-prefix[i-1][j-1]' },
                        { title: 'K×K 영역 최소', code: 'ans = float(\'inf\')\nfor i in range(1, N-K+2):\n    for j in range(1, M-K+2):\n        cost1 = prefix[i+K-1][j+K-1]-prefix[i-1][j+K-1]-prefix[i+K-1][j-1]+prefix[i-1][j-1]\n        ans = min(ans, cost1, K*K-cost1)\nprint(ans)' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[5].templates; }
            }]
        }
    ]
};

// ===== 등록 =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.prefixsum = prefixSumTopic;
