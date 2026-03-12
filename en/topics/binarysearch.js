// ===== 이분 탐색 토픽 모듈 =====
const binarySearchTopic = {
    id: 'binarysearch',
    title: '이분 탐색',
    icon: '🔍',
    category: 'Sorting & Searching',
    order: 7,
    description: '정렬된 데이터에서 원하는 값을 빠르게 찾는 기법',
    relatedNote: '이분 탐색은 최적화 문제에서 결정 문제로 변환하는 매개변수 탐색(Parametric Search) 기법으로 자주 확장됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-1920':  { type: '기본 탐색',       color: 'var(--accent)', vizMethod: '_renderVizBasicSearch' },
        'boj-10816': { type: 'Lower/Upper Bound', color: 'var(--green)',  vizMethod: '_renderVizBounds' },
        'boj-1654':  { type: '매개변수 탐색',    color: '#e17055',       vizMethod: '_renderVizCable' },
        'boj-2805':  { type: '매개변수 탐색',    color: '#e17055',       vizMethod: '_renderVizTreeCut' },
        'boj-2110':  { type: '최적화 탐색',      color: '#6c5ce7',       vizMethod: '_renderVizRouter' },
        'boj-1300':  { type: '결정 문제',        color: '#fdcb6e',       vizMethod: '_renderVizKth' },
        'boj-12015': { type: 'LIS + 이분 탐색',  color: '#00b894',       vizMethod: '_renderVizLIS' }
    },

    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Approach', icon: '💡' },
            { id: 'sim', label: 'Simulation', icon: '🎮' },
            { id: 'code', label: 'Code', icon: '💻' }
        ];
    },

    renderProblemContent(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>Problem not found.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>Problem metadata not found.</p>'; return; }
        self._clearVizState();
        var diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the I/O format.', icon: '📋' },
            think:   { intro: 'Don\'t jump to coding — open the hints step by step to build your strategy.', icon: '💡' },
            sim:     { intro: prob.simIntro || '이분 탐색이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
            code:    { intro: 'Now let\'s turn the approach into code!', icon: '💻' }
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
        var tabLabels = { problem: 'Problem', think: 'Approach', sim: 'Simulation', code: 'Code' };
        var ctaTexts = { problem: 'Once you understand the problem,', think: 'Once you\'ve reviewed all hints,', sim: 'Once you understand how it works,' };
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
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
        var guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click each step to reveal hints';
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

    _renderCodeTab(contentEl, prob) {
        if (window.renderSolutionsCodeTab) {
            window.renderSolutionsCodeTab(contentEl, prob);
        } else {
            contentEl.innerHTML = '<p>Loading code tab...</p>';
        }
    },

    // ===== Render Concept Page =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🔍 이분 탐색 (Binary Search)</h2>
                <p class="hero-sub">절반씩 버리면, 아무리 많은 데이터에서도 빠르게 찾을 수 있습니다</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 이분 탐색이란?</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> 국어사전에서 "사과"를 찾는다고 생각해 보세요.<br><br>
                    첫 페이지부터 한 장씩 넘기면? 몇 천 페이지를 넘겨야 합니다!<br>
                    하지만 <strong>사전의 중간</strong>을 펴면? "ㅁ" 근처가 나옵니다.<br>
                    "사"는 "ㅁ"보다 뒤에 있으니 → <strong>앞 절반은 버립니다!</strong><br>
                    다시 남은 절반의 중간을 펴고... 이것을 반복하면 금방 찾습니다!<br><br>
                    이것이 바로 <strong>이분 탐색</strong>입니다. 매번 <strong>절반을 버리기</strong> 때문에 매우 빠릅니다.
                </div>
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 이분 탐색 기본 코드
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo &lt;= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] &lt; target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1</code></pre></div></span>
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 이분 탐색 기본 코드
#include &lt;vector&gt;
using namespace std;

int binary_search(vector&lt;int&gt;&amp; arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo &lt;= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] &lt; target)
            lo = mid + 1;
        else
            hi = mid - 1;
    }
    return -1;
}</code></pre></div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">100만 개의 정렬된 숫자에서 하나를 찾으려면, 이분 탐색은 최대 몇 번 비교하면 될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>최대 20번</strong>이면 충분합니다!<br>
                        log₂(1,000,000) ≈ 20<br><br>
                        하나씩 찾으면 최대 <strong>100만 번</strong>인데,<br>
                        이분 탐색으로는 <strong>20번</strong>이면 됩니다. 5만 배나 빠릅니다!
                    </div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 이분 탐색의 동작 원리</div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <h3>① 정렬 필수!</h3>
                        <p>이분 탐색은 <strong>정렬된 배열</strong>에서만 작동합니다.</p>
                    </div>
                    <div class="concept-card">
                        <h3>② 중간값 확인</h3>
                        <p><strong>mid = (lo + hi) / 2</strong><br>중간값과 비교하여 절반을 버립니다.</p>
                    </div>
                    <div class="concept-card">
                        <h3>③ 범위 축소</h3>
                        <p>target이 mid보다 크면 <strong>lo = mid+1</strong><br>작으면 <strong>hi = mid-1</strong></p>
                    </div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 시간 복잡도: O(log N)은 얼마나 빠를까?</div>
                <div class="analogy-box">
                    <strong>Key Point:</strong> 이분 탐색은 매번 탐색 범위를 <strong>절반</strong>으로 줄입니다.
                    "절반씩 줄인다"가 왜 그렇게 빠를까요?
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">순차 탐색 O(N) vs 이분 탐색 O(log N) 비교</div>
                    <div style="overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.88rem;margin-top:8px;">
                            <tr style="background:var(--bg2);">
                                <th style="padding:8px 12px;text-align:left;border-bottom:2px solid var(--border);">데이터 크기 N</th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">순차 탐색<br>(최악)</th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">이분 탐색<br>(최악)</th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">차이</th>
                            </tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);">1,000</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--red);">1,000번</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--green);font-weight:700;">~10번</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);">100배</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);">100만</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--red);">1,000,000번</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--green);font-weight:700;">~20번</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);">5만배</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);">10억</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--red);">1,000,000,000번</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--green);font-weight:700;">~30번</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);">3천만배!</td></tr>
                        </table>
                    </div>
                    <div class="concept-demo-msg" style="margin-top:12px;">
                        <strong>왜 이렇게 빠를까?</strong> 절반씩 줄이면:<br>
                        2<sup>10</sup> = 1,024 → <strong>10번이면 1천 개</strong> 커버<br>
                        2<sup>20</sup> = 1,048,576 → <strong>20번이면 100만 개</strong> 커버<br>
                        2<sup>30</sup> = 1,073,741,824 → <strong>30번이면 10억 개</strong> 커버!
                    </div>
                </div>
                <div class="concept-grid">
                    <span class="lang-py"><div class="concept-card">
                        <h3>Python: bisect</h3>
                        <p><code>from bisect import bisect_left, bisect_right</code><br>
                        정렬된 배열에서 O(log N) 탐색.<br>
                        <code>bisect_left(arr, x)</code> → x 이상인 첫 위치<br>
                        <code>bisect_right(arr, x)</code> → x 초과인 첫 위치</p>
                        <a href="https://docs.python.org/3/library/bisect.html" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: bisect ↗</a>
                    </div></span>
                    <span class="lang-cpp"><div class="concept-card">
                        <h3>C++: &lt;algorithm&gt;</h3>
                        <p><code>lower_bound(begin, end, x)</code> → x 이상인 첫 위치<br>
                        <code>upper_bound(begin, end, x)</code> → x 초과인 첫 위치<br>
                        <code>binary_search(begin, end, x)</code> → 존재 여부</p>
                        <a href="https://en.cppreference.com/w/cpp/algorithm/lower_bound" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: lower_bound / upper_bound ↗</a>
                    </div></span>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 매개변수 탐색 (Parametric Search)</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> "업다운 게임"을 생각해 보세요!<br><br>
                    <strong>"최적값을 구하라"</strong> → <strong>"이 값이 가능한가? (YES/NO)"</strong>로 바꿉니다.<br>
                    그리고 YES/NO 경계를 이분 탐색으로 찾으면 됩니다!
                </div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <h3>YES/NO 판별</h3>
                        <p>"길이 x로 잘라서 N개를 만들 수 있나?"<br>"높이 H로 잘라서 M미터를 얻을 수 있나?"</p>
                    </div>
                    <div class="concept-card">
                        <h3>경계 찾기</h3>
                        <p>YES와 NO의 <strong>경계</strong>에 최적값이 있습니다.<br>이 경계를 이분 탐색으로 빠르게 찾습니다!</p>
                    </div>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"랜선 4개 (802, 743, 457, 539cm)를 잘라서 11개를 만들 때 최대 길이"를 매개변수 탐색으로 바꾸면?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>"길이 x cm로 잘랐을 때 11개 이상 만들 수 있는가?"</strong>로 바꿉니다!<br><br>
                        x=200이면? 802/200 + 743/200 + 457/200 + 539/200 = 4+3+2+2 = <strong>11개 → YES</strong><br>
                        x=201이면? 3+3+2+2 = <strong>10개 → NO</strong><br>
                        따라서 YES→NO 경계인 <strong>200</strong>이 정답입니다!
                    </div>
                </div>
            </div>
        `;
        this._initConceptInteractions(container);
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== Visualization State =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ 이전</button>' +
            '<span id="str-indicator-' + suffix + '">Before Start</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ Click Next to start</div>';
    },

    _initStepController(container, steps, suffix) {
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
            if (idx < 0) { indicator.textContent = 'Before Start'; desc.textContent = '▶ Click Next to start'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
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
    // Simulation 1: 기본 이분 탐색 (boj-1920)
    // ====================================================================
    _renderVizBasicSearch(container) {
        var self = this;
        var DEFAULT_ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
        var DEFAULT_TARGET = 23;
        var suffix = '-bs1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">기본 이분 탐색</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">배열: <input type="text" id="bs-basic-arr" value="' + DEFAULT_ARR.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<label style="font-weight:600;">target: <input type="number" id="bs-basic-target" value="' + DEFAULT_TARGET + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-basic-reset">🔄</button>' +
            '</div>' +
            '<div id="bs-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="bs-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="bs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bs-arr' + suffix);
        var infoEl = container.querySelector('#bs-info' + suffix);
        var descEl = container.querySelector('#bs-desc' + suffix);
        function cell(v, i, cls) { return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;font-size:0.9rem;transition:all 0.3s;' + cls + '"><div>' + v + '</div><div style="font-size:0.7rem;color:var(--text3);">[' + i + ']</div></div>'; }
        function rebuild() {
            var rawArr = container.querySelector('#bs-basic-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            var arr = rawArr.slice().sort(function(a, b) { return a - b; });
            var target = parseInt(container.querySelector('#bs-basic-target').value);
            if (isNaN(target)) target = DEFAULT_TARGET;
            if (arr.length === 0) arr = DEFAULT_ARR.slice();
            descEl.innerHTML = '정렬된 배열에서 <strong>' + target + '</strong>을 찾습니다.';
            function renderArr(lo, hi, mid, foundIdx) {
                arrEl.innerHTML = arr.map(function(v, i) {
                    if (foundIdx === i) return cell(v, i, 'background:var(--green);color:white;');
                    if (i === mid) return cell(v, i, 'background:var(--accent);color:white;');
                    if (i >= lo && i <= hi) return cell(v, i, 'background:var(--accent)15;border:2px solid var(--accent);');
                    return cell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.5;');
                }).join('');
            }
            renderArr(0, arr.length - 1, -1, -1);
            infoEl.innerHTML = '<span style="color:var(--text2)">배열에서 <strong>' + target + '</strong>을 찾습니다.</span>';
            var steps = [];
            var lo = 0, hi = arr.length - 1, round = 0, found = false;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                round++;
                if (arr[mid] === target) {
                    (function(cLo, cHi, mid, round, a, t) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' == ' + t + ' → 찾았습니다! ✅',
                            action: function() { renderArr(cLo, cHi, -1, mid); infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.1rem;">✅ 찾았습니다! arr[' + mid + '] = ' + t + '</strong>'; },
                            undo: function() { renderArr(cLo, cHi, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">배열에서 <strong>' + t + '</strong>을 찾습니다.</span>'; }
                        });
                    })(cLo, cHi, mid, round, arr, target);
                    found = true;
                    break;
                } else if (arr[mid] < target) {
                    (function(cLo, cHi, mid, newLo, round, a, t) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' &lt; ' + t + ' → 오른쪽! (lo=' + newLo + ')',
                            action: function() { renderArr(newLo, cHi, mid, -1); infoEl.innerHTML = 'arr[' + mid + ']=' + a[mid] + ' &lt; ' + t + ' → <strong>왼쪽 절반 제거!</strong>'; },
                            undo: function() { renderArr(cLo, cHi, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">배열에서 <strong>' + t + '</strong>을 찾습니다.</span>'; }
                        });
                    })(cLo, cHi, mid, mid + 1, round, arr, target);
                    lo = mid + 1;
                } else {
                    (function(cLo, cHi, mid, newHi, round, a, t) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' &gt; ' + t + ' → 왼쪽! (hi=' + newHi + ')',
                            action: function() { renderArr(cLo, newHi, mid, -1); infoEl.innerHTML = 'arr[' + mid + ']=' + a[mid] + ' &gt; ' + t + ' → <strong>오른쪽 절반 제거!</strong>'; },
                            undo: function() { renderArr(cLo, cHi, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">배열에서 <strong>' + t + '</strong>을 찾습니다.</span>'; }
                        });
                    })(cLo, cHi, mid, mid - 1, round, arr, target);
                    hi = mid - 1;
                }
            }
            if (!found) {
                (function(t) {
                    steps.push({ description: '탐색 종료: lo &gt; hi → ' + t + '은(는) 배열에 없습니다. ❌',
                        action: function() { arrEl.innerHTML = arr.map(function(v, i) { return cell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.5;'); }).join(''); infoEl.innerHTML = '<strong style="color:var(--red);font-size:1.1rem;">❌ ' + t + '은(는) 배열에 없습니다.</strong>'; },
                        undo: function() { renderArr(0, arr.length - 1, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">배열에서 <strong>' + t + '</strong>을 찾습니다.</span>'; }
                    });
                })(target);
            }
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-basic-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 2: Lower/Upper Bound (boj-10816)
    // ====================================================================
    _renderVizBounds(container) {
        var self = this, suffix = '-bound';
        var DEFAULT_ARR = [-10, -10, 2, 3, 3, 6, 7, 10, 10, 10];
        var DEFAULT_TARGET = 10;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Lower/Upper Bound</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">배열: <input type="text" id="bs-bound-arr" value="' + DEFAULT_ARR.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:240px;"></label>' +
                '<label style="font-weight:600;">target: <input type="number" id="bs-bound-target" value="' + DEFAULT_TARGET + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-bound-reset">🔄</button>' +
            '</div>' +
            '<div id="bd-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="bd-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="bd-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bd-arr' + suffix);
        var infoEl = container.querySelector('#bd-info' + suffix);
        var descEl = container.querySelector('#bd-desc' + suffix);
        function rebuild() {
            var rawArr = container.querySelector('#bs-bound-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            var arr = rawArr.slice().sort(function(a, b) { return a - b; });
            var target = parseInt(container.querySelector('#bs-bound-target').value);
            if (isNaN(target)) target = DEFAULT_TARGET;
            if (arr.length === 0) arr = DEFAULT_ARR.slice();
            descEl.innerHTML = '정렬 배열에서 <strong>' + target + '</strong>의 개수를 bisect_left/right로 구합니다.';
            function renderArr(highlights) {
                arrEl.innerHTML = arr.map(function(v, i) {
                    var st = 'width:48px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;font-size:0.85rem;transition:all 0.3s;';
                    if (highlights && highlights[i]) st += highlights[i];
                    else st += 'background:var(--bg2);';
                    return '<div style="' + st + '"><div>' + v + '</div><div style="font-size:0.65rem;color:var(--text3);">[' + i + ']</div></div>';
                }).join('');
            }
            renderArr(null);
            infoEl.innerHTML = '<span style="color:var(--text2);">bisect_left와 bisect_right로 ' + target + '의 개수를 구합니다.</span>';
            // compute bisect_left
            var leftIdx = 0;
            { var blo = 0, bhi = arr.length; while (blo < bhi) { var bm = Math.floor((blo + bhi) / 2); if (arr[bm] < target) blo = bm + 1; else bhi = bm; } leftIdx = blo; }
            // compute bisect_right
            var rightIdx = 0;
            { var blo = 0, bhi = arr.length; while (blo < bhi) { var bm = Math.floor((blo + bhi) / 2); if (arr[bm] <= target) blo = bm + 1; else bhi = bm; } rightIdx = blo; }
            var count = rightIdx - leftIdx;
            var steps = [
                { description: 'bisect_left(' + target + '): ' + target + ' 이상인 첫 위치를 찾습니다.',
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } if (leftIdx < arr.length) h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); infoEl.innerHTML = 'bisect_left = <strong>' + leftIdx + '</strong>' + (leftIdx < arr.length ? ' (arr[' + leftIdx + ']=' + arr[leftIdx] + '이 처음으로 ' + target + ' ≥)' : ' (배열 끝)'); },
                  undo: function() { renderArr(null); infoEl.innerHTML = '<span style="color:var(--text2);">bisect_left와 bisect_right로 ' + target + '의 개수를 구합니다.</span>'; }
                },
                { description: 'bisect_right(' + target + '): ' + target + ' 초과인 첫 위치를 찾습니다.',
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } renderArr(h); infoEl.innerHTML = 'bisect_right = <strong>' + rightIdx + '</strong>' + (rightIdx >= arr.length ? ' (배열 끝 다음)' : '') + '. 범위: [' + leftIdx + ', ' + rightIdx + ')'; },
                  undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } if (leftIdx < arr.length) h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); infoEl.innerHTML = 'bisect_left = <strong>' + leftIdx + '</strong>'; }
                },
                { description: '개수 = bisect_right - bisect_left = ' + rightIdx + ' - ' + leftIdx + ' = ' + count,
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;box-shadow:0 0 8px var(--green)40;'; else h[i] = 'background:var(--bg2);opacity:0.4;'; } renderArr(h); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ ' + target + '의 개수 = ' + rightIdx + ' - ' + leftIdx + ' = ' + count + '개</strong>'; },
                  undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } renderArr(h); infoEl.innerHTML = 'bisect_right = <strong>' + rightIdx + '</strong>'; }
                }
            ];
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-bound-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 3: 랜선 자르기 (boj-1654)
    // ====================================================================
    _renderVizCable(container) {
        var self = this, suffix = '-cable';
        var DEFAULT_CABLES = [802, 743, 457, 539], DEFAULT_N = 11;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">랜선 자르기 — 매개변수 탐색</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">랜선 길이: <input type="text" id="bs-cable-arr" value="' + DEFAULT_CABLES.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<label style="font-weight:600;">필요 개수 N: <input type="number" id="bs-cable-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-cable-reset">🔄</button>' +
            '</div>' +
            '<div id="cb-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="cb-bars' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="cb-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#cb-bars' + suffix);
        var infoEl = container.querySelector('#cb-info' + suffix);
        var descEl = container.querySelector('#cb-desc' + suffix);
        function rebuild() {
            var cables = container.querySelector('#bs-cable-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            var N = parseInt(container.querySelector('#bs-cable-n').value);
            if (isNaN(N) || N < 1) N = DEFAULT_N;
            if (cables.length === 0) cables = DEFAULT_CABLES.slice();
            var maxC = Math.max.apply(null, cables);
            descEl.innerHTML = '길이 x로 잘라 ' + N + '개 이상 만들 수 있는 최대 x를 찾습니다.';
            function renderBars(cutLen) {
                barsEl.innerHTML = cables.map(function(c, i) {
                    var pct = (c / maxC) * 100;
                    var pieces = cutLen > 0 ? Math.floor(c / cutLen) : 0;
                    var segs = '';
                    if (cutLen > 0) {
                        for (var j = 0; j < pieces; j++) {
                            var segPct = (cutLen / c) * 100;
                            segs += '<div style="width:' + segPct + '%;height:100%;background:var(--accent);border-right:2px solid white;"></div>';
                        }
                    }
                    return '<div style="margin-bottom:6px;">' +
                        '<div style="font-size:0.8rem;color:var(--text3);margin-bottom:2px;">' + c + 'cm → ' + pieces + '조각</div>' +
                        '<div style="width:' + pct + '%;height:24px;border-radius:6px;overflow:hidden;display:flex;background:var(--bg2);">' + segs + '</div></div>';
                }).join('');
            }
            renderBars(0);
            infoEl.innerHTML = '<span style="color:var(--text2);">이분 탐색으로 최적 길이를 찾습니다.</span>';
            var steps = [], lo = 1, hi = maxC, answer = 0, round = 0;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var count = cables.reduce(function(s, c) { return s + Math.floor(c / mid); }, 0);
                round++;
                if (count >= N) {
                    answer = mid; lo = mid + 1;
                    (function(cLo, cHi, mid, count, round) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + count + '개 ≥ ' + N + ' → YES! (lo=' + (mid + 1) + ')',
                            action: function() { renderBars(mid); infoEl.innerHTML = 'x=' + mid + 'cm → <strong>' + count + '개</strong> ≥ ' + N + ' → <span style="color:var(--green);">YES</span> (정답 후보)'; },
                            undo: function() { renderBars(0); infoEl.innerHTML = '<span style="color:var(--text2);">이분 탐색으로 최적 길이를 찾습니다.</span>'; }
                        });
                    })(cLo, cHi, mid, count, round);
                } else {
                    hi = mid - 1;
                    (function(cLo, cHi, mid, count, round) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + count + '개 &lt; ' + N + ' → NO! (hi=' + (mid - 1) + ')',
                            action: function() { renderBars(mid); infoEl.innerHTML = 'x=' + mid + 'cm → <strong>' + count + '개</strong> &lt; ' + N + ' → <span style="color:var(--red);">NO</span>'; },
                            undo: function() { renderBars(0); infoEl.innerHTML = '<span style="color:var(--text2);">이분 탐색으로 최적 길이를 찾습니다.</span>'; }
                        });
                    })(cLo, cHi, mid, count, round);
                }
            }
            var fa = answer, fc = cables.reduce(function(s, c) { return s + Math.floor(c / fa); }, 0);
            steps.push({ description: '완성! 최대 길이 = ' + fa + 'cm (' + fc + '조각)',
                action: function() { renderBars(fa); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 정답: x = ' + fa + 'cm (' + fc + '조각 ≥ ' + N + ')</strong>'; },
                undo: function() { renderBars(0); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-cable-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 4: 나무 자르기 (boj-2805)
    // ====================================================================
    _renderVizTreeCut(container) {
        var self = this, suffix = '-tree';
        var DEFAULT_TREES = [20, 15, 10, 17], DEFAULT_M = 7;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">나무 자르기 — 매개변수 탐색</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">나무 높이: <input type="text" id="bs-tree-arr" value="' + DEFAULT_TREES.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
                '<label style="font-weight:600;">필요량 M: <input type="number" id="bs-tree-m" value="' + DEFAULT_M + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-tree-reset">🔄</button>' +
            '</div>' +
            '<div id="tr-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="tr-chart' + suffix + '" style="display:flex;gap:16px;justify-content:center;align-items:flex-end;height:160px;margin-bottom:12px;position:relative;"></div>' +
            '<div id="tr-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var chartEl = container.querySelector('#tr-chart' + suffix);
        var infoEl = container.querySelector('#tr-info' + suffix);
        var descEl = container.querySelector('#tr-desc' + suffix);
        function rebuild() {
            var trees = container.querySelector('#bs-tree-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            var M = parseInt(container.querySelector('#bs-tree-m').value);
            if (isNaN(M) || M < 1) M = DEFAULT_M;
            if (trees.length === 0) trees = DEFAULT_TREES.slice();
            var maxH = Math.max.apply(null, trees);
            descEl.innerHTML = '절단기 높이 H를 이분 탐색합니다. 필요: ' + M + 'm';
            function renderTrees(H) {
                chartEl.innerHTML = trees.map(function(h) {
                    var pct = (h / maxH) * 100;
                    var cutPct = H >= 0 && h > H ? ((h - H) / maxH) * 100 : 0;
                    var mainPct = pct - cutPct;
                    return '<div style="display:flex;flex-direction:column;align-items:center;width:48px;">' +
                        '<div style="font-size:0.8rem;font-weight:600;margin-bottom:2px;">' + h + 'm</div>' +
                        (cutPct > 0 ? '<div style="width:100%;height:' + (cutPct / 100 * 160) + 'px;background:var(--red)30;border:2px dashed var(--red);border-radius:4px 4px 0 0;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:var(--red);font-weight:600;">' + (h - H) + '</div>' : '') +
                        '<div style="width:100%;height:' + (mainPct / 100 * 160) + 'px;background:var(--green);border-radius:' + (cutPct > 0 ? '0 0' : '4px 4px') + ' 4px 4px;"></div></div>';
                }).join('');
                if (H >= 0) {
                    var lineTop = ((maxH - H) / maxH) * 160;
                    chartEl.innerHTML += '<div style="position:absolute;left:0;right:0;top:' + lineTop + 'px;border-top:2px dashed var(--accent);font-size:0.75rem;color:var(--accent);text-align:right;padding-right:4px;">H=' + H + '</div>';
                }
            }
            renderTrees(-1);
            infoEl.innerHTML = '<span style="color:var(--text2);">높이 H를 이분 탐색하여 최소 ' + M + 'm를 얻습니다.</span>';
            var steps = [], lo = 0, hi = maxH, answer = 0, round = 0;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var gained = trees.reduce(function(s, h) { return s + Math.max(0, h - mid); }, 0);
                round++;
                if (gained >= M) {
                    answer = mid; lo = mid + 1;
                    (function(mid, gained, cLo, cHi, round) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + gained + 'm ≥ ' + M + ' → YES (lo=' + (mid + 1) + ')',
                            action: function() { renderTrees(mid); infoEl.innerHTML = 'H=' + mid + ' → 잘린 양 = <strong>' + gained + 'm</strong> ≥ ' + M + ' → <span style="color:var(--green);">YES</span>'; },
                            undo: function() { renderTrees(-1); infoEl.innerHTML = '<span style="color:var(--text2);">높이 H를 이분 탐색합니다.</span>'; }
                        });
                    })(mid, gained, cLo, cHi, round);
                } else {
                    hi = mid - 1;
                    (function(mid, gained, cLo, cHi, round) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + gained + 'm &lt; ' + M + ' → NO (hi=' + (mid - 1) + ')',
                            action: function() { renderTrees(mid); infoEl.innerHTML = 'H=' + mid + ' → 잘린 양 = <strong>' + gained + 'm</strong> &lt; ' + M + ' → <span style="color:var(--red);">NO</span>'; },
                            undo: function() { renderTrees(-1); infoEl.innerHTML = '<span style="color:var(--text2);">높이 H를 이분 탐색합니다.</span>'; }
                        });
                    })(mid, gained, cLo, cHi, round);
                }
            }
            var fa = answer, fg = trees.reduce(function(s, h) { return s + Math.max(0, h - fa); }, 0);
            steps.push({ description: '완성! H = ' + fa + 'm (잘린 양: ' + fg + 'm)',
                action: function() { renderTrees(fa); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 정답: H = ' + fa + 'm (잘린 양: ' + fg + 'm ≥ ' + M + ')</strong>'; },
                undo: function() { renderTrees(-1); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-tree-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 5: 공유기 설치 (boj-2110)
    // ====================================================================
    _renderVizRouter(container) {
        var self = this, suffix = '-router';
        var DEFAULT_HOUSES = [1, 2, 4, 8, 9], DEFAULT_C = 3;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">공유기 설치 — 최적화 탐색</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">집 위치: <input type="text" id="bs-router-arr" value="' + DEFAULT_HOUSES.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
                '<label style="font-weight:600;">공유기 C: <input type="number" id="bs-router-c" value="' + DEFAULT_C + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-router-reset">🔄</button>' +
            '</div>' +
            '<div id="rt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="rt-line' + suffix + '" style="position:relative;height:80px;margin:16px 0;"></div>' +
            '<div id="rt-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var lineEl = container.querySelector('#rt-line' + suffix);
        var infoEl = container.querySelector('#rt-info' + suffix);
        var descEl = container.querySelector('#rt-desc' + suffix);
        function rebuild() {
            var houses = container.querySelector('#bs-router-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            houses.sort(function(a, b) { return a - b; });
            var C = parseInt(container.querySelector('#bs-router-c').value);
            if (isNaN(C) || C < 2) C = DEFAULT_C;
            if (houses.length < 2) houses = DEFAULT_HOUSES.slice();
            var maxPos = houses[houses.length - 1];
            descEl.innerHTML = '집 위치: [' + houses.join(', ') + '], 공유기 ' + C + '개. 최소 거리 d 이상으로 설치 가능?';
            function renderLine(d, placed) {
                var html = '<div style="position:absolute;left:5%;right:5%;top:35px;height:4px;background:var(--border);border-radius:2px;"></div>';
                houses.forEach(function(h) {
                    var pct = 5 + (h / maxPos) * 90;
                    var isPlaced = placed && placed.indexOf(h) >= 0;
                    html += '<div style="position:absolute;left:' + pct + '%;top:20px;transform:translateX(-50%);text-align:center;">' +
                        '<div style="width:12px;height:12px;border-radius:50%;margin:0 auto;background:' + (isPlaced ? 'var(--accent)' : 'var(--text3)') + ';"></div>' +
                        (isPlaced ? '<div style="font-size:1.2rem;margin-top:2px;">📡</div>' : '') +
                        '<div style="font-size:0.75rem;color:var(--text3);margin-top:2px;">' + h + '</div></div>';
                });
                if (d > 0 && placed && placed.length >= 2) {
                    html += '<div style="position:absolute;left:5%;right:5%;top:62px;font-size:0.75rem;color:var(--text2);text-align:center;">최소 거리 d = ' + d + '</div>';
                }
                lineEl.innerHTML = html;
            }
            renderLine(0, []);
            infoEl.innerHTML = '<span style="color:var(--text2);">최소 거리 d를 이분 탐색합니다.</span>';
            function tryPlace(d) {
                var placed = [houses[0]], last = houses[0];
                for (var i = 1; i < houses.length; i++) {
                    if (houses[i] - last >= d) { placed.push(houses[i]); last = houses[i]; }
                }
                return placed;
            }
            var steps = [], lo = 1, hi = maxPos - houses[0], answer = 0, round = 0;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var placed = tryPlace(mid);
                round++;
                if (placed.length >= C) {
                    answer = mid; lo = mid + 1;
                    (function(mid, placed, cLo, cHi, round) {
                        steps.push({ description: round + '회차: d=' + mid + ' → ' + placed.length + '개 설치 [' + placed.join(',') + '] ≥ ' + C + ' → YES',
                            action: function() { renderLine(mid, placed); infoEl.innerHTML = 'd=' + mid + ' → <strong>' + placed.length + '개 설치</strong> → <span style="color:var(--green);">YES</span> (lo=' + (mid + 1) + ')'; },
                            undo: function() { renderLine(0, []); infoEl.innerHTML = '<span style="color:var(--text2);">최소 거리 d를 이분 탐색합니다.</span>'; }
                        });
                    })(mid, placed, cLo, cHi, round);
                } else {
                    hi = mid - 1;
                    (function(mid, placed, cLo, cHi, round) {
                        steps.push({ description: round + '회차: d=' + mid + ' → ' + placed.length + '개 설치 &lt; ' + C + ' → NO',
                            action: function() { renderLine(mid, placed); infoEl.innerHTML = 'd=' + mid + ' → <strong>' + placed.length + '개 설치</strong> → <span style="color:var(--red);">NO</span> (hi=' + (mid - 1) + ')'; },
                            undo: function() { renderLine(0, []); infoEl.innerHTML = '<span style="color:var(--text2);">최소 거리 d를 이분 탐색합니다.</span>'; }
                        });
                    })(mid, placed, cLo, cHi, round);
                }
            }
            var fp = tryPlace(answer);
            steps.push({ description: '완성! 최대 최소 거리 d = ' + answer,
                action: function() { renderLine(answer, fp); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 정답: d = ' + answer + ' (설치: [' + fp.join(', ') + '])</strong>'; },
                undo: function() { renderLine(0, []); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-router-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 6: K번째 수 (boj-1300)
    // ====================================================================
    _renderVizKth(container) {
        var self = this, suffix = '-kth';
        var DEFAULT_N = 3, DEFAULT_K = 7;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">K번째 수 — N×N 곱셈표</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N: <input type="number" id="bs-kth-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;" min="1" max="8"></label>' +
                '<label style="font-weight:600;">K: <input type="number" id="bs-kth-k" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-kth-reset">🔄</button>' +
            '</div>' +
            '<div id="kt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="kt-table' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="kt-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var tableEl = container.querySelector('#kt-table' + suffix);
        var infoEl = container.querySelector('#kt-info' + suffix);
        var descEl = container.querySelector('#kt-desc' + suffix);
        function rebuild() {
            var N = parseInt(container.querySelector('#bs-kth-n').value);
            var k = parseInt(container.querySelector('#bs-kth-k').value);
            if (isNaN(N) || N < 1) N = DEFAULT_N;
            if (N > 8) N = 8; // cap for visual display
            if (isNaN(k) || k < 1) k = DEFAULT_K;
            if (k > N * N) k = N * N;
            descEl.innerHTML = N + '×' + N + ' 곱셈표에서 k=' + k + '번째로 작은 수를 구합니다.';
            function renderTable(x) {
                var html = '<table style="border-collapse:collapse;margin:0 auto;">';
                html += '<tr><td style="padding:6px 12px;font-weight:600;color:var(--text3);">×</td>';
                for (var j = 1; j <= N; j++) html += '<td style="padding:6px 12px;font-weight:600;color:var(--text3);">' + j + '</td>';
                html += '</tr>';
                for (var i = 1; i <= N; i++) {
                    html += '<tr><td style="padding:6px 12px;font-weight:600;color:var(--text3);">' + i + '</td>';
                    for (var j = 1; j <= N; j++) {
                        var v = i * j;
                        var bg = x >= 0 && v <= x ? 'background:var(--accent)20;' : '';
                        html += '<td style="padding:6px 12px;text-align:center;border:1px solid var(--border);border-radius:4px;' + bg + '">' + v + '</td>';
                    }
                    html += '</tr>';
                }
                html += '</table>';
                if (x >= 0) {
                    var cnt = 0;
                    for (var i = 1; i <= N; i++) cnt += Math.min(Math.floor(x / i), N);
                    html += '<div style="text-align:center;margin-top:8px;font-size:0.85rem;color:var(--text2);">' + x + ' 이하: <strong>' + cnt + '개</strong></div>';
                }
                tableEl.innerHTML = html;
            }
            renderTable(-1);
            infoEl.innerHTML = '<span style="color:var(--text2);">x 이하인 수가 ' + k + '개 이상인 최소 x를 찾습니다.</span>';
            var steps = [], lo = 1, hi = k, round = 0;
            while (lo < hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var cnt = 0;
                for (var i = 1; i <= N; i++) cnt += Math.min(Math.floor(mid / i), N);
                round++;
                if (cnt >= k) {
                    hi = mid;
                    (function(mid, cnt, cLo, cHi, round) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + cnt + '개 ≥ ' + k + ' → hi=' + mid,
                            action: function() { renderTable(mid); infoEl.innerHTML = 'x=' + mid + ' → <strong>' + cnt + '개</strong> ≥ ' + k + ' → <span style="color:var(--green);">hi=' + mid + '</span>'; },
                            undo: function() { renderTable(-1); infoEl.innerHTML = '<span style="color:var(--text2);">x 이하인 수가 ' + k + '개 이상인 최소 x를 찾습니다.</span>'; }
                        });
                    })(mid, cnt, cLo, cHi, round);
                } else {
                    lo = mid + 1;
                    (function(mid, cnt, cLo, cHi, round) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + cnt + '개 &lt; ' + k + ' → lo=' + (mid + 1),
                            action: function() { renderTable(mid); infoEl.innerHTML = 'x=' + mid + ' → <strong>' + cnt + '개</strong> &lt; ' + k + ' → <span style="color:var(--red);">lo=' + (mid + 1) + '</span>'; },
                            undo: function() { renderTable(-1); infoEl.innerHTML = '<span style="color:var(--text2);">x 이하인 수가 ' + k + '개 이상인 최소 x를 찾습니다.</span>'; }
                        });
                    })(mid, cnt, cLo, cHi, round);
                }
            }
            steps.push({ description: '완성! k=' + k + '번째 수 = ' + lo,
                action: function() { renderTable(lo); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 정답: ' + k + '번째 수 = ' + lo + '</strong>'; },
                undo: function() { renderTable(-1); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-kth-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 7: LIS (boj-12015)
    // ====================================================================
    _renderVizLIS(container) {
        var self = this, suffix = '-lis';
        var DEFAULT_A = [10, 20, 10, 30, 20, 50];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">LIS + 이분 탐색</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">수열: <input type="text" id="bs-lis-arr" value="' + DEFAULT_A.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="bs-lis-reset">🔄</button>' +
            '</div>' +
            '<div id="lis-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div style="margin-bottom:8px;"><strong>원본 수열</strong></div>' +
            '<div id="lis-arr' + suffix + '" style="display:flex;gap:4px;margin-bottom:16px;"></div>' +
            '<div style="margin-bottom:8px;"><strong>tails 배열</strong></div>' +
            '<div id="lis-tails' + suffix + '" style="display:flex;gap:4px;margin-bottom:12px;min-height:48px;"></div>' +
            '<div id="lis-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#lis-arr' + suffix);
        var tailsEl = container.querySelector('#lis-tails' + suffix);
        var infoEl = container.querySelector('#lis-info' + suffix);
        var descEl = container.querySelector('#lis-desc' + suffix);
        function box(v, hl) { return '<div style="width:48px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:600;' + (hl || 'background:var(--bg2);') + '">' + v + '</div>'; }
        function rebuild() {
            var A = container.querySelector('#bs-lis-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (A.length === 0) A = DEFAULT_A.slice();
            descEl.innerHTML = '수열: [' + A.join(', ') + ']. tails 배열을 이분 탐색으로 구축합니다.';
            function renderArr(curIdx) {
                arrEl.innerHTML = A.map(function(v, i) {
                    if (i === curIdx) return box(v, 'background:var(--accent);color:white;');
                    if (i < curIdx) return box(v, 'background:var(--bg2);opacity:0.5;');
                    return box(v, 'background:var(--bg2);');
                }).join('');
            }
            function renderTails(tails, hlIdx) {
                if (tails.length === 0) { tailsEl.innerHTML = '<div style="color:var(--text3);padding:10px;">비어있음</div>'; return; }
                tailsEl.innerHTML = tails.map(function(v, i) {
                    if (i === hlIdx) return box(v, 'background:var(--green);color:white;');
                    return box(v, 'background:var(--green)20;border:2px solid var(--green);');
                }).join('');
            }
            renderArr(-1);
            renderTails([], -1);
            infoEl.innerHTML = '<span style="color:var(--text2);">각 원소를 순회하며 tails 배열을 구축합니다.</span>';
            var steps = [], tails = [];
            A.forEach(function(x, idx) {
                var prevTails = tails.slice();
                // bisect_left
                var pos = 0, lo2 = 0, hi2 = tails.length;
                while (lo2 < hi2) { var m = Math.floor((lo2 + hi2) / 2); if (tails[m] < x) lo2 = m + 1; else hi2 = m; }
                pos = lo2;
                if (pos === tails.length) {
                    tails.push(x);
                    var newTails = tails.slice();
                    (function(idx, x, pos, prevTails, newTails) {
                        steps.push({ description: 'A[' + idx + ']=' + x + ': tails 끝보다 큼 → append. tails=[' + newTails.join(',') + '] (길이 ' + newTails.length + ')',
                            action: function() { renderArr(idx); renderTails(newTails, pos); infoEl.innerHTML = x + ' &gt; tails 끝 → <strong>append</strong>. LIS 길이 = ' + newTails.length; },
                            undo: function() { renderArr(-1); renderTails(prevTails, -1); infoEl.innerHTML = '<span style="color:var(--text2);">각 원소를 순회하며 tails 배열을 구축합니다.</span>'; }
                        });
                    })(idx, x, pos, prevTails, newTails);
                } else {
                    tails[pos] = x;
                    var newTails = tails.slice();
                    (function(idx, x, pos, prevTails, newTails) {
                        steps.push({ description: 'A[' + idx + ']=' + x + ': bisect_left → pos=' + pos + ', tails[' + pos + ']=' + x + '로 교체. tails=[' + newTails.join(',') + ']',
                            action: function() { renderArr(idx); renderTails(newTails, pos); infoEl.innerHTML = x + ' → tails[' + pos + ']에 <strong>교체</strong>. LIS 길이 = ' + newTails.length; },
                            undo: function() { renderArr(-1); renderTails(prevTails, -1); infoEl.innerHTML = '<span style="color:var(--text2);">각 원소를 순회하며 tails 배열을 구축합니다.</span>'; }
                        });
                    })(idx, x, pos, prevTails, newTails);
                }
            });
            var ft = tails.slice();
            steps.push({ description: '완성! LIS 길이 = ' + ft.length,
                action: function() { renderArr(A.length); renderTails(ft, -1); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ LIS 길이 = ' + ft.length + ' (tails=[' + ft.join(',') + '])</strong>'; },
                undo: function() { renderArr(-1); renderTails(ft, -1); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-lis-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ===== Empty Stub =====
    renderVisualize(container) {},
    renderProblem(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: '기본 이분 탐색', desc: '배열에서 값 찾기 (Silver IV)', problemIds: ['boj-1920', 'boj-10816'] },
        { num: 2, title: '매개변수 탐색 입문', desc: '최적값을 이분 탐색으로 (Silver II)', problemIds: ['boj-1654', 'boj-2805'] },
        { num: 3, title: '매개변수 탐색 심화', desc: '복잡한 판별 함수 (Gold)', problemIds: ['boj-2110', 'boj-1300'] },
        { num: 4, title: '응용', desc: 'LIS + 이분 탐색 (Gold II)', problemIds: ['boj-12015'] }
    ],

    // ===== Problem List =====
    problems: [
        {
            id: 'boj-1920', title: 'BOJ 1920 - 수 찾기', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1920',
            simIntro: '정렬된 배열에서 이분 탐색으로 값을 찾는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>N개의 정수 A[1], A[2], …, A[N]이 주어져 있을 때, 이 안에 X라는 정수가 존재하는지 알아내는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5\n4 1 5 2 3\n5\n1 3 7 9 5</pre></div>
                    <div><strong>Output</strong><pre>1\n1\n0\n0\n1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>-2<sup>31</sup> ≤ 원소 ≤ 2<sup>31</sup></li>
                    <li>1 ≤ M ≤ 100,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: '각 질문마다 배열을 <strong>처음부터 끝까지 훑으면서</strong> 같은 수가 있는지 확인하면 되겠지?<br>M개의 질문 × N개의 원소를 하나씩 비교 → 이중 반복문으로 해결!' },
                { title: 'But there\'s a problem with this', content: 'N, M이 최대 <strong>100,000</strong>이야. 최악의 경우 100,000 × 100,000 = <strong>100억 번</strong> 비교해야 해.<br>시간 제한 안에 절대 못 끝나! O(N × M)은 너무 느려.' },
                { title: 'What if we try this?', content: '배열을 <strong>미리 정렬</strong>해두면? 정렬된 배열에서는 <strong>이분 탐색</strong>으로 한 번에 절반씩 범위를 줄일 수 있어!<br>한 번의 탐색이 O(log N)이니까, M개 질문 전체가 O(M log N). 정렬 O(N log N)까지 합쳐도 <strong>O((N+M) log N)</strong>으로 충분해.' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: <code>bisect_left(A, x)</code>로 x가 들어갈 위치를 찾고, 그 위치의 값이 x와 같은지 확인하면 끝!</span><span class="lang-cpp">C++: <code>binary_search(A, A+N, x)</code>로 한 줄이면 존재 여부를 바로 판별할 수 있어! 또는 <code>lower_bound()</code>로 위치를 찾아서 비교해도 돼.</span>' }
            ],
            templates: {
                python: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = sorted(list(map(int, input().split())))\nM = int(input())\nqueries = list(map(int, input().split()))\n\nfor x in queries:\n    idx = bisect_left(A, x)\n    if idx < N and A[idx] == x:\n        print(1)\n    else:\n        print(0)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, M, A[100001];\nbool bsearch(int target) {\n    int lo = 0, hi = N - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (A[mid] == target) return true;\n        else if (A[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return false;\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    sort(A, A + N);\n    cin >> M;\n    for (int i = 0; i < M; i++) { int x; cin >> x; cout << (bsearch(x) ? 1 : 0) << "\\n"; }\n    return 0;\n}'
            },
            solutions: [{
                approach: '정렬 + 이분 탐색',
                description: '배열을 정렬한 뒤 bisect_left로 존재 여부를 확인합니다.',
                timeComplexity: 'O((N+M) log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 정렬', desc: '이분 탐색은 정렬된 배열에서만 동작합니다.\n입력을 받으면서 바로 정렬해둡니다.', code: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = sorted(list(map(int, input().split())))' },
                        { title: '쿼리 입력', desc: '존재 여부를 확인할 M개의 수를 입력받습니다.', code: 'M = int(input())\nqueries = list(map(int, input().split()))' },
                        { title: '이분 탐색으로 탐색', desc: 'bisect_left로 x가 들어갈 위치를 찾고, 그 위치의 값이 x와 같은지 확인합니다.\n일일이 순회하면 O(N)이지만, 이분 탐색으로 O(log N)에 판별합니다.', code: 'for x in queries:\n    idx = bisect_left(A, x)\n    if idx < N and A[idx] == x:\n        print(1)\n    else:\n        print(0)' }
                    ],
                    cpp: [
                        { title: '입력 및 정렬', desc: '이분 탐색은 정렬된 배열에서만 동작합니다.\nsort()로 오름차순 정렬 후 탐색 준비를 합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, A[100001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    sort(A, A + N);  // 이분 탐색 전 정렬 필수!' },
                        { title: '쿼리 입력', desc: '존재 여부를 확인할 M개의 수를 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, A[100001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    sort(A, A + N);\n\n    int M;\n    cin >> M;' },
                        { title: '이분 탐색으로 탐색', desc: '<algorithm>의 binary_search 함수로 존재 여부를 O(log N)에 판별합니다.\n직접 구현 대신 STL을 활용하면 코드가 간결해집니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, A[100001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    sort(A, A + N);\n\n    int M;\n    cin >> M;\n\n    while (M--) {\n        int x;\n        cin >> x;\n        // binary_search: <algorithm>의 이분 탐색 함수\n        cout << (binary_search(A, A + N, x) ? 1 : 0) << "\\n";\n    }\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-10816', title: 'BOJ 10816 - 숫자 카드 2', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10816',
            simIntro: 'lower_bound와 upper_bound의 차이를 시각적으로 확인하세요.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>숫자 카드는 정수 하나가 적혀져 있는 카드이다. 상근이는 숫자 카드 N개를 가지고 있다. 정수 M개가 주어졌을 때, 이 수가 적혀있는 숫자 카드를 상근이가 몇 개 가지고 있는지 구하는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10\n6 3 2 10 10 10 -10 -10 7 3\n8\n10 9 -5 2 3 4 5 -10</pre></div>
                    <div><strong>Output</strong><pre>3 0 0 1 2 0 0 2</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 500,000</li>
                    <li>1 ≤ M ≤ 500,000</li>
                    <li>-10<sup>7</sup> ≤ 카드 값 ≤ 10<sup>7</sup></li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: '각 질문마다 카드 배열을 <strong>처음부터 끝까지 돌면서</strong> 같은 숫자가 몇 개인지 세면 되겠지?<br>간단한 반복문 하나면 개수를 셀 수 있어!' },
                { title: 'But there\'s a problem with this', content: 'N, M이 최대 <strong>500,000</strong>이야. 매 질문마다 50만 개를 순회하면 500,000 × 500,000 = <strong>2,500억 번</strong>!<br>O(N × M)은 시간 초과 확정이야.' },
                { title: 'What if we try this?', content: '배열을 <strong>정렬</strong>하면 같은 숫자가 <strong>연속으로 모여</strong> 있잖아!<br>그러면 "x가 시작하는 위치"와 "x가 끝나는 다음 위치"만 찾으면 개수 = 끝 위치 - 시작 위치야.<br>이 두 위치를 이분 탐색으로 찾으면 각각 O(log N)이니까 전체 <strong>O((N+M) log N)</strong>으로 충분해!' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: <code>bisect_right(cards, x) - bisect_left(cards, x)</code> 한 줄이면 x의 개수를 바로 구할 수 있어!<br><code>bisect_left</code>는 x가 시작하는 위치, <code>bisect_right</code>는 x 다음 값이 시작하는 위치를 알려줘.</span><span class="lang-cpp">C++: <code>upper_bound(cards, cards+N, x) - lower_bound(cards, cards+N, x)</code>로 동일하게 구간 길이를 구할 수 있어!<br><code>lower_bound</code>는 x 이상 첫 위치, <code>upper_bound</code>는 x 초과 첫 위치를 반환해.</span>' }
            ],
            templates: {
                python: 'import sys\nfrom bisect import bisect_left, bisect_right\ninput = sys.stdin.readline\n\nN = int(input())\ncards = sorted(list(map(int, input().split())))\nM = int(input())\nqueries = list(map(int, input().split()))\n\nresult = []\nfor x in queries:\n    result.append(bisect_right(cards, x) - bisect_left(cards, x))\n\nprint(\' \'.join(map(str, result)))',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N; cin >> N;\n    int cards[500001];\n    for (int i = 0; i < N; i++) cin >> cards[i];\n    sort(cards, cards + N);\n    int M; cin >> M;\n    for (int i = 0; i < M; i++) {\n        int x; cin >> x;\n        int cnt = upper_bound(cards, cards + N, x) - lower_bound(cards, cards + N, x);\n        cout << cnt << (i < M - 1 ? " " : "\\n");\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'bisect_left + bisect_right',
                description: '정렬 후 upper_bound - lower_bound로 개수를 구합니다.',
                timeComplexity: 'O((N+M) log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 정렬', desc: '이분 탐색을 위해 카드 배열을 정렬합니다.\n정렬하면 같은 숫자가 연속으로 모이므로 구간으로 개수를 셀 수 있습니다.', code: 'import sys\nfrom bisect import bisect_left, bisect_right\ninput = sys.stdin.readline\n\nN = int(input())\ncards = sorted(list(map(int, input().split())))' },
                        { title: '쿼리 처리', desc: '개수를 확인할 M개의 숫자를 입력받습니다.', code: 'M = int(input())\nqueries = list(map(int, input().split()))' },
                        { title: '개수 계산 및 출력', desc: 'bisect_right(x) - bisect_left(x) = x가 나타나는 구간의 길이 = 개수.\n정렬된 배열에서 같은 값은 연속 구간이므로, 양 끝 위치의 차이가 곧 개수입니다.', code: 'result = []\nfor x in queries:\n    result.append(bisect_right(cards, x) - bisect_left(cards, x))\n\nprint(\' \'.join(map(str, result)))' }
                    ],
                    cpp: [
                        { title: '입력 및 정렬', desc: '이분 탐색을 위해 카드 배열을 정렬합니다.\n정렬하면 같은 숫자가 연속으로 모이므로 구간으로 개수를 셀 수 있습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, cards[500001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> cards[i];\n    sort(cards, cards + N);' },
                        { title: '쿼리 처리', desc: '개수를 확인할 M개의 숫자를 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, cards[500001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> cards[i];\n    sort(cards, cards + N);\n\n    int M;\n    cin >> M;' },
                        { title: '개수 계산 및 출력', desc: 'upper_bound - lower_bound로 해당 값의 개수를 O(log N)에 구합니다.\nSTL의 upper_bound는 x 초과 첫 위치, lower_bound는 x 이상 첫 위치를 반환합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, cards[500001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> cards[i];\n    sort(cards, cards + N);\n\n    int M;\n    cin >> M;\n\n    while (M--) {\n        int x;\n        cin >> x;\n        // upper_bound - lower_bound = 해당 값의 개수\n        int cnt = upper_bound(cards, cards + N, x) - lower_bound(cards, cards + N, x);\n        cout << cnt;\n        if (M) cout << " ";\n    }\n    cout << "\\n";\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1654', title: 'BOJ 1654 - 랜선 자르기', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1654',
            simIntro: '랜선 길이를 이분 탐색으로 결정하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>집에서 시간을 보내던 오영식은 이미 가지고 있는 K개의 랜선을 잘라서 N개의 같은 길이의 랜선을 만들려고 한다. 편의를 위해 랜선을 자르거나 만들 때 손실되는 길이는 없다고 가정하며, 기존의 K개의 랜선으로 N개의 랜선을 만들 수 없는 경우는 없다고 가정하자. N개보다 많이 만드는 것도 N개를 만드는 것에 포함된다. 만들 수 있는 최대 랜선의 길이를 구하시오.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 11\n802\n743\n457\n539</pre></div>
                    <div><strong>Output</strong><pre>200</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ K ≤ 10,000</li>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>랜선 길이는 2<sup>31</sup> - 1 이하의 자연수</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: '길이를 1cm부터 시작해서 1씩 늘려가면서, 그 길이로 잘랐을 때 N개 이상 만들 수 있는지 확인하면 되지 않을까?<br>가능한 가장 긴 길이를 찾을 때까지 반복!' },
                { title: 'But there\'s a problem with this', content: '랜선 길이가 최대 <strong>2<sup>31</sup> - 1</strong> (약 21억)이야. 1부터 21억까지 하나씩 다 시도하면?<br>최악의 경우 21억 번 × K개 랜선 확인 = <strong>수십억 번 연산</strong>... 시간 초과야!' },
                { title: 'What if we try this?', content: '"길이 x로 잘랐을 때 N개 이상 만들 수 있는가?" — 이 질문의 답은 x가 작으면 YES, 커지면 어느 순간 NO로 바뀌어.<br>이런 <strong>단조성</strong>이 있으면 <strong>이분 탐색(매개변수 탐색)</strong>으로 경계를 찾을 수 있어!<br>lo=1, hi=max(랜선)으로 범위를 잡고, mid로 잘랐을 때 개수 = sum(각 랜선 // mid).<br>N개 이상이면 더 긴 길이를 시도(lo=mid+1), 부족하면 줄여(hi=mid-1).<br>⚠️ <strong>lo=0이면 0으로 나누기 에러!</strong> 반드시 lo=1부터 시작해야 해.' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: <code>sum(c // mid for c in cables)</code>로 한 줄에 개수를 셀 수 있어. 정수 나눗셈 <code>//</code>가 핵심!</span><span class="lang-cpp">C++: 랜선 길이가 2<sup>31</sup>-1까지이므로 <code>long long</code>을 써야 해. <code>for</code>문으로 <code>cables[i] / mid</code>를 누적하면 돼.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nK, N = map(int, input().split())\ncables = [int(input()) for _ in range(K)]\n\nlo, hi = 1, max(cables)\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    count = sum(c // mid for c in cables)\n    if count >= N:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1\n\nprint(answer)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    int K, N; cin >> K >> N;\n    ll cables[10001], maxLen = 0;\n    for (int i = 0; i < K; i++) { cin >> cables[i]; maxLen = max(maxLen, cables[i]); }\n    ll lo = 1, hi = maxLen, answer = 0;\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2, count = 0;\n        for (int i = 0; i < K; i++) count += cables[i] / mid;\n        if (count >= N) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    cout << answer << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '매개변수 탐색',
                description: '길이 x로 잘랐을 때 N개 이상 가능한지 이분 탐색합니다.',
                timeComplexity: 'O(K log max)',
                spaceComplexity: 'O(K)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'K개의 랜선 길이를 입력받습니다.\n각 랜선을 잘라서 N개를 만들어야 합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nK, N = map(int, input().split())\ncables = [int(input()) for _ in range(K)]' },
                        { title: '이분 탐색 범위', desc: '매개변수 탐색: "길이 x로 잘랐을 때 N개 이상 만들 수 있는가?"를 이분 탐색합니다.\nlo=1(최소 길이), hi=max(cables)(가장 긴 랜선). lo=0이면 0으로 나누기 에러!', code: 'lo, hi = 1, max(cables)\nanswer = 0' },
                        { title: '이분 탐색 + 판별', desc: '각 랜선을 mid로 나눈 몫의 합이 N 이상이면 가능 → 더 긴 길이를 시도합니다.\n불가능하면 더 짧은 길이로 줄입니다. 가능한 최대 길이를 answer에 저장합니다.', code: 'while lo <= hi:\n    mid = (lo + hi) // 2\n    count = sum(c // mid for c in cables)\n    if count >= N:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1' },
                        { title: '출력', desc: '조건을 만족하는 최대 랜선 길이를 출력합니다.', code: 'print(answer)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'K개의 랜선 길이를 입력받습니다.\n랜선 길이가 2^31-1까지이므로 long long을 사용합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    int K, N;\n    cin >> K >> N;\n    ll cables[10001];\n    ll maxLen = 0;\n    for (int i = 0; i < K; i++) {\n        cin >> cables[i];\n        maxLen = max(maxLen, cables[i]);\n    }' },
                        { title: '이분 탐색 범위', desc: '매개변수 탐색: "길이 x로 잘랐을 때 N개 이상 만들 수 있는가?"를 이분 탐색합니다.\nlo=1, hi=최대 랜선 길이. 오버플로우 방지를 위해 long long 사용합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    int K, N;\n    cin >> K >> N;\n    ll cables[10001];\n    ll maxLen = 0;\n    for (int i = 0; i < K; i++) {\n        cin >> cables[i];\n        maxLen = max(maxLen, cables[i]);\n    }\n\n    ll lo = 1, hi = maxLen;\n    ll answer = 0;' },
                        { title: '이분 탐색 + 판별', desc: '각 랜선을 mid로 나눈 몫의 합이 N 이상이면 → 더 긴 길이 시도(lo = mid + 1).\n불가능하면 → 더 짧게(hi = mid - 1). 가능할 때마다 answer를 갱신합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    int K, N;\n    cin >> K >> N;\n    ll cables[10001];\n    ll maxLen = 0;\n    for (int i = 0; i < K; i++) {\n        cin >> cables[i];\n        maxLen = max(maxLen, cables[i]);\n    }\n\n    ll lo = 1, hi = maxLen;\n    ll answer = 0;\n\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2;\n        ll count = 0;\n        for (int i = 0; i < K; i++) count += cables[i] / mid;\n        if (count >= N) {\n            answer = mid;  // 가능! 더 긴 길이 시도\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;  // 불가능 → 더 짧게\n        }\n    }' },
                        { title: '출력', desc: '조건을 만족하는 최대 랜선 길이를 출력합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    int K, N;\n    cin >> K >> N;\n    ll cables[10001];\n    ll maxLen = 0;\n    for (int i = 0; i < K; i++) {\n        cin >> cables[i];\n        maxLen = max(maxLen, cables[i]);\n    }\n\n    ll lo = 1, hi = maxLen;\n    ll answer = 0;\n\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2;\n        ll count = 0;\n        for (int i = 0; i < K; i++) count += cables[i] / mid;\n        if (count >= N) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n\n    cout << answer << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-2805', title: 'BOJ 2805 - 나무 자르기', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2805',
            simIntro: '절단기 높이를 이분 탐색으로 결정하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>상근이는 나무 M 미터가 필요하다. 절단기에 높이 H를 지정하면 한 줄에 연속해있는 나무를 모두 높이 H 위의 부분이 잘린다. H보다 작은 나무는 잘리지 않는다. 적어도 M 미터의 나무를 집에 가져가기 위해서 절단기에 설정할 수 있는 높이의 최댓값을 구하시오.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 7\n20 15 10 17</pre></div>
                    <div><strong>Output</strong><pre>15</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 20\n4 42 40 26 46</pre></div>
                    <div><strong>Output</strong><pre>36</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>1 ≤ M ≤ 2,000,000,000</li>
                    <li>0 ≤ 나무 높이 ≤ 1,000,000,000</li>
                    <li>M은 항상 나무를 잘라서 얻을 수 있는 양</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: '절단기 높이를 0부터 시작해서 1씩 올려가면서, 그 높이로 잘랐을 때 나무를 M미터 이상 얻을 수 있는지 확인하면 되지 않을까?<br>각 나무에서 <code>max(0, 나무높이 - H)</code>만큼 가져갈 수 있으니까, 전부 더하면 총 획득량이야.' },
                { title: 'But there\'s a problem with this', content: '나무 높이가 최대 <strong>10억</strong>이야! 높이를 0부터 10억까지 1씩 올려가면 최악의 경우 <strong>10억 번</strong> × N개 나무 확인...<br>N도 최대 100만이라 연산 횟수가 어마어마해. 시간 초과 확정이야!' },
                { title: 'What if we try this?', content: '랜선 자르기와 같은 패턴이야! "높이 H로 잘랐을 때 M미터 이상 얻을 수 있는가?"<br>H가 낮으면 많이 얻고(YES), H가 높으면 적게 얻어(NO) — <strong>단조성</strong>이 있지!<br>이분 탐색으로 lo=0, hi=max(나무)에서 시작. mid 높이로 잘랐을 때 합계 = sum(max(0, tree - mid)).<br>M 이상이면 더 높이 시도(lo=mid+1), 부족하면 낮춰(hi=mid-1).<br>⚠️ <span class="lang-py">Python은 정수 오버플로우가 없지만,</span><span class="lang-cpp">C++에서는 나무 합계가 <strong>int 범위를 넘을 수 있으므로 long long</strong>을 써야 해!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ntrees = list(map(int, input().split()))\n\nlo, hi = 0, max(trees)\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    gained = sum(max(0, t - mid) for t in trees)\n    if gained >= M:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1\n\nprint(answer)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N; ll M; cin >> N >> M;\n    int trees[1000001]; int maxH = 0;\n    for (int i = 0; i < N; i++) { cin >> trees[i]; maxH = max(maxH, trees[i]); }\n    ll lo = 0, hi = maxH, answer = 0;\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2, gained = 0;\n        for (int i = 0; i < N; i++) if (trees[i] > mid) gained += trees[i] - mid;\n        if (gained >= M) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    cout << answer << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '매개변수 탐색',
                description: '절단 높이 H에 대해 잘린 양이 M 이상인지 이분 탐색합니다.',
                timeComplexity: 'O(N log max)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N개의 나무 높이와 필요한 나무 양 M을 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ntrees = list(map(int, input().split()))' },
                        { title: '이분 탐색', desc: '매개변수 탐색: "높이 H로 잘랐을 때 M미터 이상 얻을 수 있는가?".\n가능하면 더 높은 H를 시도(lo=mid+1), 불가능하면 더 낮게(hi=mid-1).\n높이를 최대화해야 하므로, 가능할 때마다 answer를 갱신합니다.', code: 'lo, hi = 0, max(trees)\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    gained = sum(max(0, t - mid) for t in trees)\n    if gained >= M:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1' },
                        { title: '출력', desc: '조건을 만족하는 절단기 높이의 최댓값을 출력합니다.', code: 'print(answer)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N개의 나무 높이와 필요한 나무 양 M을 입력받습니다.\n나무 합이 int 범위를 넘을 수 있으므로 M은 long long으로 선언합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    ll M;\n    cin >> N >> M;\n    int trees[1000001];\n    int maxH = 0;\n    for (int i = 0; i < N; i++) {\n        cin >> trees[i];\n        maxH = max(maxH, trees[i]);\n    }' },
                        { title: '이분 탐색', desc: '매개변수 탐색: "높이 mid로 잘랐을 때 M미터 이상 얻을 수 있는가?".\n잘린 양(gained)이 int 범위를 넘을 수 있으므로 long long으로 누적합니다.\n가능하면 더 높이 시도, 불가능하면 더 낮게 조정합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    ll M;\n    cin >> N >> M;\n    int trees[1000001];\n    int maxH = 0;\n    for (int i = 0; i < N; i++) {\n        cin >> trees[i];\n        maxH = max(maxH, trees[i]);\n    }\n\n    ll lo = 0, hi = maxH;\n    ll answer = 0;\n\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2;\n        ll gained = 0;\n        for (int i = 0; i < N; i++)\n            if (trees[i] > mid) gained += trees[i] - mid;\n        if (gained >= M) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }' },
                        { title: '출력', desc: '조건을 만족하는 절단기 높이의 최댓값을 출력합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    ll M;\n    cin >> N >> M;\n    int trees[1000001];\n    int maxH = 0;\n    for (int i = 0; i < N; i++) {\n        cin >> trees[i];\n        maxH = max(maxH, trees[i]);\n    }\n\n    ll lo = 0, hi = maxH;\n    ll answer = 0;\n\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2;\n        ll gained = 0;\n        for (int i = 0; i < N; i++)\n            if (trees[i] > mid) gained += trees[i] - mid;\n        if (gained >= M) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n\n    cout << answer << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-2110', title: 'BOJ 2110 - 공유기 설치', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2110',
            simIntro: '최소 거리 d를 이분 탐색하여 공유기를 배치하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>도현이의 집 N개가 수직선 위에 있다. 집의 좌표가 주어졌을 때, C개의 공유기를 설치하려고 한다. 가장 인접한 두 공유기 사이의 거리를 가능한 한 크게 하여 설치하려고 할 때, 가장 인접한 두 공유기 사이의 최대 거리를 출력하시오.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 3\n1\n2\n8\n4\n9</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div><p class="example-explain">1, 4, 8에 설치하면 가장 인접한 거리는 3.</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ N ≤ 200,000</li>
                    <li>2 ≤ C ≤ N</li>
                    <li>0 ≤ 좌표 ≤ 1,000,000,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'N개 집 중에서 C개를 골라서 공유기를 설치하는 <strong>모든 조합</strong>을 시도해볼까?<br>각 조합마다 가장 인접한 두 공유기 거리를 구하고, 그 중 최대를 찾으면 되잖아!' },
                { title: 'But there\'s a problem with this', content: 'N이 최대 <strong>200,000</strong>이야. N개 중 C개를 고르는 조합 수는... 상상을 초월해!<br>예를 들어 200,000개 중 100,000개를 고르는 경우의 수? <strong>절대 불가능</strong>한 수준이야.' },
                { title: 'What if we try this?', content: '발상을 전환하자! 조합을 시도하는 대신, <strong>"최소 거리가 d 이상이 되도록 C개를 설치할 수 있는가?"</strong>를 물어보는 거야.<br>판별법은 간단해: 집을 정렬하고, 첫 집에 설치한 뒤 d 이상 떨어진 다음 집에 <strong>그리디하게</strong> 설치를 반복해.<br>설치 수 &ge; C면 가능! 가능하면 더 넓은 거리를 시도(lo=mid+1), 불가능하면 줄여(hi=mid-1).<br>범위: lo=1, hi=가장 먼 두 집 사이 거리.' },
                { title: 'In Python/C++!', content: '핵심은 정렬 후 그리디 판별 함수를 만드는 거야:<br><span class="lang-py">Python: 정렬 후 <code>for</code>문으로 순회하면서 <code>houses[i] - last &gt;= mid</code>이면 설치하고 <code>last</code>를 갱신해.</span><span class="lang-cpp">C++: 동일한 로직인데, 좌표가 최대 10억이므로 거리 계산 시 <code>long long</code>을 사용하면 안전해.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, C = map(int, input().split())\nhouses = sorted([int(input()) for _ in range(N)])\n\nlo, hi = 1, houses[-1] - houses[0]\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    count = 1\n    last = houses[0]\n    for i in range(1, N):\n        if houses[i] - last >= mid:\n            count += 1\n            last = houses[i]\n    if count >= C:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1\n\nprint(answer)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, C, houses[200001];\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);\n    long long lo = 1, hi = houses[N-1] - houses[0], answer = 0;\n    while (lo <= hi) {\n        long long mid = (lo + hi) / 2;\n        int count = 1, last = houses[0];\n        for (int i = 1; i < N; i++) { if (houses[i] - last >= mid) { count++; last = houses[i]; } }\n        if (count >= C) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    cout << answer << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '매개변수 탐색 (거리)',
                description: '최소 거리 d 이상으로 C개를 설치할 수 있는지 이분 탐색합니다.',
                timeComplexity: 'O(N log(max-min))',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 정렬', desc: '집 좌표를 정렬합니다.\n정렬해야 왼쪽부터 그리디하게 공유기를 배치할 수 있습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, C = map(int, input().split())\nhouses = sorted([int(input()) for _ in range(N)])' },
                        { title: '이분 탐색 범위', desc: '매개변수 탐색: "최소 거리 d 이상으로 C개를 설치할 수 있는가?".\nlo=1(최소 거리), hi=가장 먼 두 집 사이 거리.', code: 'lo, hi = 1, houses[-1] - houses[0]\nanswer = 0' },
                        { title: '탐색 + 그리디 판별', desc: '그리디로 판별: 첫 집에 설치 후, d 이상 떨어진 다음 집에 설치를 반복합니다.\n설치 수 >= C이면 가능 → 더 넓은 거리 시도, 아니면 더 좁게 줄입니다.', code: 'while lo <= hi:\n    mid = (lo + hi) // 2\n    count = 1\n    last = houses[0]\n    for i in range(1, N):\n        if houses[i] - last >= mid:\n            count += 1\n            last = houses[i]\n    if count >= C:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1' },
                        { title: '출력', desc: '가장 인접한 두 공유기 사이의 최대 거리를 출력합니다.', code: 'print(answer)' }
                    ],
                    cpp: [
                        { title: '입력 및 정렬', desc: '집 좌표를 정렬합니다.\n정렬해야 왼쪽부터 그리디하게 공유기를 배치할 수 있습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint houses[200001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N, C;\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);' },
                        { title: '이분 탐색 범위', desc: '매개변수 탐색: "최소 거리 mid 이상으로 C개를 설치할 수 있는가?".\nlo=1, hi=가장 먼 두 집 사이 거리. long long으로 오버플로우를 방지합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint houses[200001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N, C;\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);\n\n    long long lo = 1, hi = houses[N-1] - houses[0];\n    long long answer = 0;' },
                        { title: '탐색 + 그리디 판별', desc: '그리디로 판별: 첫 집에 설치 후, mid 이상 떨어진 다음 집에 설치를 반복합니다.\n설치 수 >= C이면 가능 → 더 넓은 거리 시도, 아니면 더 좁게 줄입니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint houses[200001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N, C;\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);\n\n    long long lo = 1, hi = houses[N-1] - houses[0];\n    long long answer = 0;\n\n    while (lo <= hi) {\n        long long mid = (lo + hi) / 2;\n        int count = 1, last = houses[0];\n        for (int i = 1; i < N; i++) {\n            if (houses[i] - last >= mid) {\n                count++;\n                last = houses[i];\n            }\n        }\n        if (count >= C) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }' },
                        { title: '출력', desc: '가장 인접한 두 공유기 사이의 최대 거리를 출력합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint houses[200001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N, C;\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);\n\n    long long lo = 1, hi = houses[N-1] - houses[0];\n    long long answer = 0;\n\n    while (lo <= hi) {\n        long long mid = (lo + hi) / 2;\n        int count = 1, last = houses[0];\n        for (int i = 1; i < N; i++) {\n            if (houses[i] - last >= mid) {\n                count++;\n                last = houses[i];\n            }\n        }\n        if (count >= C) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n\n    cout << answer << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-1300', title: 'BOJ 1300 - K번째 수', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1300',
            simIntro: 'N×N 곱셈표에서 x 이하인 수의 개수를 이분 탐색으로 구하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>세준이는 크기가 N×N인 배열 A를 만들었다. 배열에 들어있는 수 A[i][j] = i × j 이다. 이 수를 일차원 배열 B에 넣으면 B의 크기는 N×N이 된다. B를 오름차순 정렬했을 때, B[k]를 구해보자. 배열 A와 B의 인덱스는 1부터 시작한다.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3\n7</pre></div>
                    <div><strong>Output</strong><pre>6</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 10<sup>5</sup></li>
                    <li>1 ≤ k ≤ min(10<sup>9</sup>, N<sup>2</sup>)</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'N×N 곱셈표의 모든 값을 배열에 넣고 <strong>정렬</strong>한 다음, k번째를 꺼내면 되지 않을까?<br>A[i][j] = i × j이니까, 이중 반복문으로 N² 개를 전부 만들어서 정렬하면 끝!' },
                { title: 'But there\'s a problem with this', content: 'N이 최대 <strong>10<sup>5</sup></strong>이야. N² = <strong>10<sup>10</sup></strong>(100억) 개의 수를 배열에 담으면?<br>메모리도 수십 GB 필요하고, 정렬은 더 오래 걸려. <strong>메모리 초과 + 시간 초과</strong> 모두야!' },
                { title: 'What if we try this?', content: '모든 값을 만들 필요 없이, <strong>"x 이하인 수가 몇 개인가?"</strong>만 빠르게 셀 수 있으면 돼!<br>i행에서 i×j &le; x인 j의 개수 = min(x &divide; i, N). 이걸 i = 1부터 N까지 더하면 O(N)에 "x 이하 개수"를 알 수 있어.<br>그러면 <strong>"x 이하인 수가 k개 이상인 최소 x"</strong>를 이분 탐색으로 찾으면 그게 답이야!<br>범위: lo=1, hi=k (k번째 수는 항상 k 이하). <code>count &ge; k</code>이면 hi=mid, 아니면 lo=mid+1 (lower_bound 형태).' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: <code>count = sum(min(mid // i, N) for i in range(1, N+1))</code> 한 줄이면 x 이하 개수를 셀 수 있어!</span><span class="lang-cpp">C++: <code>for (ll i = 1; i &lt;= N; i++) count += min(mid / i, N);</code>로 동일하게 구현. N, k가 크므로 <code>long long</code>을 사용해야 해.</span>' }
            ],
            templates: {
                python: 'N = int(input())\nk = int(input())\n\nlo, hi = 1, k\n\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    count = 0\n    for i in range(1, N + 1):\n        count += min(mid // i, N)\n    if count >= k:\n        hi = mid\n    else:\n        lo = mid + 1\n\nprint(lo)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    ll N, k; cin >> N >> k;\n    ll lo = 1, hi = k;\n    while (lo < hi) {\n        ll mid = (lo + hi) / 2, count = 0;\n        for (ll i = 1; i <= N; i++) count += min(mid / i, N);\n        if (count >= k) hi = mid; else lo = mid + 1;\n    }\n    cout << lo << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '결정 문제 + 이분 탐색',
                description: 'x 이하인 수의 개수를 O(N)에 세고, 그 값이 k 이상인 최소 x를 이분 탐색합니다.',
                timeComplexity: 'O(N log k)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N×N 곱셈표에서 k번째로 작은 수를 찾아야 합니다.\nN²개를 정렬하면 메모리 초과 → 이분 탐색으로 접근합니다.', code: 'N = int(input())\nk = int(input())' },
                        { title: '이분 탐색 (lower_bound)', desc: '"x 이하인 수가 k개 이상인 최소 x"를 찾는 lower_bound 형태입니다.\ni행에서 i×j ≤ x인 j의 개수 = min(x//i, N)으로 O(N)에 셀 수 있습니다.\nhi=k인 이유: k번째 수는 항상 k 이하입니다.', code: 'lo, hi = 1, k\n\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    count = 0\n    for i in range(1, N + 1):\n        count += min(mid // i, N)\n    if count >= k:\n        hi = mid\n    else:\n        lo = mid + 1' },
                        { title: '출력', desc: 'lo == hi가 되면 그 값이 k번째 수입니다.', code: 'print(lo)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N×N 곱셈표에서 k번째로 작은 수를 찾아야 합니다.\nN이 최대 10^5이므로 N²개를 정렬하면 메모리 초과 → 이분 탐색으로 접근합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ll N, k;\n    cin >> N >> k;' },
                        { title: '이분 탐색 (lower_bound)', desc: '"x 이하인 수가 k개 이상인 최소 x"를 찾는 lower_bound 형태입니다.\ni행에서 i×j <= x인 j의 개수 = min(mid/i, N)으로 O(N)에 셀 수 있습니다.\ncount >= k이면 hi = mid, 아니면 lo = mid + 1.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ll N, k;\n    cin >> N >> k;\n\n    ll lo = 1, hi = k;\n\n    while (lo < hi) {\n        ll mid = (lo + hi) / 2;\n        ll count = 0;\n        for (ll i = 1; i <= N; i++)\n            count += min(mid / i, N);  // i행에서 mid 이하인 수\n        if (count >= k)\n            hi = mid;\n        else\n            lo = mid + 1;\n    }' },
                        { title: '출력', desc: 'lo == hi가 되면 그 값이 k번째 수입니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ll N, k;\n    cin >> N >> k;\n\n    ll lo = 1, hi = k;\n\n    while (lo < hi) {\n        ll mid = (lo + hi) / 2;\n        ll count = 0;\n        for (ll i = 1; i <= N; i++)\n            count += min(mid / i, N);\n        if (count >= k)\n            hi = mid;\n        else\n            lo = mid + 1;\n    }\n\n    cout << lo << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-12015', title: 'BOJ 12015 - 가장 긴 증가하는 부분 수열 2', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/12015',
            simIntro: 'tails 배열에 이분 탐색으로 원소를 삽입하는 LIS 알고리즘을 관찰하세요.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열을 구하는 프로그램을 작성하시오. 예를 들어, 수열 A = {10, 20, 10, 30, 20, 50} 인 경우에 가장 긴 증가하는 부분 수열은 A = {<strong>10</strong>, <strong>20</strong>, 10, <strong>30</strong>, 20, <strong>50</strong>} 이고, 길이는 4이다.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6\n10 20 10 30 20 50</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>1 ≤ A<sub>i</sub> ≤ 1,000,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: '<strong>DP</strong>로 풀 수 있어! dp[i] = "i번째 원소를 마지막으로 하는 LIS 길이"로 정의하고,<br>각 원소마다 앞에 있는 모든 원소를 확인해서 <code>A[j] &lt; A[i]</code>인 경우 <code>dp[i] = max(dp[i], dp[j] + 1)</code>로 갱신하면 돼.' },
                { title: 'But there\'s a problem with this', content: 'N이 최대 <strong>1,000,000</strong>(100만)이야! DP의 이중 반복문은 O(N²) = <strong>1조 번</strong> 연산...<br>이건 몇 분이 걸려도 끝나지 않아. 더 빠른 방법이 필요해!' },
                { title: 'What if we try this?', content: '<code>tails</code>라는 배열을 유지하는 거야. tails[i] = "길이 i+1인 증가 부분 수열의 마지막 원소 <strong>최솟값</strong>".<br>새 원소 x를 볼 때:<br>- tails 끝보다 크면? LIS가 늘어나니까 <strong>뒤에 추가</strong>!<br>- 아니면? tails에서 x가 들어갈 위치를 <strong>이분 탐색</strong>으로 찾아서 <strong>교체</strong>해.<br>교체하면 당장 LIS가 바뀌진 않지만, 나중에 더 긴 LIS를 만들 가능성이 높아져!<br>tails는 항상 정렬 상태이므로 이분 탐색이 가능하고, 전체 <strong>O(N log N)</strong>이야.' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: <code>bisect_left(tails, x)</code>로 교체할 위치를 O(log N)에 찾아. pos == len(tails)이면 <code>append</code>, 아니면 <code>tails[pos] = x</code>로 교체!</span><span class="lang-cpp">C++: <code>lower_bound(tails.begin(), tails.end(), x)</code>가 Python의 bisect_left와 동일한 역할이야. 끝이면 <code>push_back</code>, 아니면 <code>*it = x</code>로 교체!</span>' }
            ],
            templates: {
                python: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = list(map(int, input().split()))\n\ntails = []\n\nfor x in A:\n    pos = bisect_left(tails, x)\n    if pos == len(tails):\n        tails.append(x)\n    else:\n        tails[pos] = x\n\nprint(len(tails))',
                cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N; cin >> N;\n    vector<int> tails;\n    for (int i = 0; i < N; i++) {\n        int x; cin >> x;\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    cout << tails.size() << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'tails 배열 + bisect_left',
                description: 'tails 배열을 유지하며 이분 탐색으로 O(N log N)에 LIS 길이를 구합니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N이 최대 100만이므로 O(N^2) DP는 시간 초과입니다.\n이분 탐색 기반 O(N log N) 알고리즘을 사용합니다.', code: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = list(map(int, input().split()))' },
                        { title: 'tails 배열 초기화', desc: 'tails[i] = "길이 i+1인 증가 부분 수열의 마지막 원소 최솟값".\ntails를 항상 정렬 상태로 유지해서 이분 탐색이 가능하게 합니다.', code: 'tails = []' },
                        { title: 'LIS 구축', desc: '새 원소 x가 tails 끝보다 크면 LIS 길이 증가(append).\n아니면 bisect_left로 교체할 위치를 찾아 더 작은 값으로 대체합니다.\n교체하면 이후에 더 긴 LIS를 만들 가능성이 높아집니다.', code: 'for x in A:\n    pos = bisect_left(tails, x)\n    if pos == len(tails):\n        tails.append(x)    # LIS 길이 증가\n    else:\n        tails[pos] = x     # 더 작은 값으로 교체' },
                        { title: '출력', desc: 'tails 배열의 길이가 곧 LIS의 길이입니다.\n(tails의 실제 내용은 LIS 자체가 아닐 수 있지만, 길이는 정확합니다.)', code: 'print(len(tails))' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N이 최대 100만이므로 O(N^2) DP는 시간 초과입니다.\n이분 탐색 기반 O(N log N) 알고리즘을 사용합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    cin >> N;\n    vector<int> A(N);\n    for (int i = 0; i < N; i++) cin >> A[i];' },
                        { title: 'tails 배열 초기화', desc: 'tails[i] = "길이 i+1인 증가 부분 수열의 마지막 원소 최솟값".\nvector로 선언하여 동적으로 크기를 늘려갑니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    cin >> N;\n    vector<int> A(N);\n    for (int i = 0; i < N; i++) cin >> A[i];\n\n    vector<int> tails;  // tails[i] = 길이 i+1인 LIS의 마지막 최솟값' },
                        { title: 'LIS 구축', desc: 'lower_bound(= Python의 bisect_left)로 x가 들어갈 위치를 찾습니다.\ntails 끝을 넘으면 push_back(LIS 연장), 아니면 해당 위치 값을 교체합니다.\n교체하면 이후에 더 긴 LIS를 만들 가능성이 높아집니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    cin >> N;\n    vector<int> A(N);\n    for (int i = 0; i < N; i++) cin >> A[i];\n\n    vector<int> tails;\n\n    for (int x : A) {\n        // lower_bound: x 이상인 첫 위치 (= Python의 bisect_left)\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end())\n            tails.push_back(x);   // LIS 길이 증가\n        else\n            *it = x;              // 더 작은 값으로 교체\n    }' },
                        { title: '출력', desc: 'tails 배열의 크기가 곧 LIS의 길이입니다.\ntails의 실제 내용은 LIS 자체가 아닐 수 있지만, 길이는 정확합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    cin >> N;\n    vector<int> A(N);\n    for (int i = 0; i < N; i++) cin >> A[i];\n\n    vector<int> tails;\n\n    for (int x : A) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end())\n            tails.push_back(x);\n        else\n            *it = x;\n    }\n\n    cout << tails.size() << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[6].templates; }
            }]
        }
    ],

    // ===== Legacy Stub =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', function() { binarySearchTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.binarysearch = binarySearchTopic;
