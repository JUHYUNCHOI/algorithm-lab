// ===== 이분 탐색 토픽 모듈 =====
const binarySearchTopic = {
    id: 'binarysearch',
    title: '이분 탐색',
    icon: '🔍',
    category: '정렬과 탐색',
    order: 7,
    description: '정렬된 데이터에서 원하는 값을 빠르게 찾는 기법',
    relatedNote: '이분 탐색은 최적화 문제에서 결정 문제로 변환하는 매개변수 탐색(Parametric Search) 기법으로 자주 확장됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

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
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    renderProblemContent(container, problemId, tabId) {
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
            sim:     { intro: prob.simIntro || '이분 탐색이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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

    _renderProblemTab(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
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

    _renderCodeTab(contentEl, prob) {
        if (window.renderSolutionsCodeTab) {
            window.renderSolutionsCodeTab(contentEl, prob);
        } else {
            contentEl.innerHTML = '<p>코드 탭 로딩 중...</p>';
        }
    },

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🔍 이분 탐색 (Binary Search)</h2>
                <p class="hero-sub">절반씩 버리면, 아무리 많은 데이터에서도 빠르게 찾을 수 있습니다</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 이분 탐색이란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 국어사전에서 "사과"를 찾는다고 생각해 보세요.<br><br>
                    첫 페이지부터 한 장씩 넘기면? 몇 천 페이지를 넘겨야 합니다!<br>
                    하지만 <strong>사전의 중간</strong>을 펴면? "ㅁ" 근처가 나옵니다.<br>
                    "사"는 "ㅁ"보다 뒤에 있으니 → <strong>앞 절반은 버립니다!</strong><br>
                    다시 남은 절반의 중간을 펴고... 이것을 반복하면 금방 찾습니다!<br><br>
                    이것이 바로 <strong>이분 탐색</strong>입니다. 매번 <strong>절반을 버리기</strong> 때문에 매우 빠릅니다.
                </div>
                <div class="code-block"><pre><code class="language-python"># 이분 탐색 기본 코드
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1</code></pre></div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">100만 개의 정렬된 숫자에서 하나를 찾으려면, 이분 탐색은 최대 몇 번 비교하면 될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
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
                <div class="concept-section-title"><span class="section-num">3</span> 시간 복잡도</div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <h3>O(log N)</h3>
                        <p>매번 탐색 범위가 <strong>절반</strong>으로 줄어듭니다.<br>N=10억이어도 최대 <strong>30번</strong>이면 찾습니다!</p>
                    </div>
                    <div class="concept-card">
                        <h3>vs 순차 탐색 O(N)</h3>
                        <p>하나씩 찾으면 최악 N번.<br>이분 탐색은 <strong>log₂N번</strong>이면 충분합니다.</p>
                    </div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 매개변수 탐색 (Parametric Search)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "업다운 게임"을 생각해 보세요!<br><br>
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
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
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
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ 이전</button>' +
            '<span id="str-indicator-' + suffix + '">시작 전</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ 다음 버튼을 눌러 시작하세요</div>';
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
    // 시뮬레이션 1: 기본 이분 탐색 (boj-1920)
    // ====================================================================
    _renderVizBasicSearch(container) {
        var self = this;
        var arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
        var target = 23;
        var suffix = '-bs1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">기본 이분 탐색</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">정렬된 배열에서 <strong>' + target + '</strong>을 찾습니다.</p>' +
            '<div id="bs-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="bs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bs-arr' + suffix);
        var infoEl = container.querySelector('#bs-info' + suffix);
        function cell(v, i, cls) { return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;font-size:0.9rem;transition:all 0.3s;' + cls + '"><div>' + v + '</div><div style="font-size:0.7rem;color:var(--text3);">[' + i + ']</div></div>'; }
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
        var lo = 0, hi = arr.length - 1, round = 0;
        while (lo <= hi) {
            var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
            round++;
            if (arr[mid] === target) {
                (function(cLo, cHi, mid, round) {
                    steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + arr[mid] + ' == ' + target + ' → 찾았습니다! ✅',
                        action: function() { renderArr(cLo, cHi, -1, mid); infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.1rem;">✅ 찾았습니다! arr[' + mid + '] = ' + target + '</strong>'; },
                        undo: function() { renderArr(cLo, cHi, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">배열에서 <strong>' + target + '</strong>을 찾습니다.</span>'; }
                    });
                })(cLo, cHi, mid, round);
                break;
            } else if (arr[mid] < target) {
                (function(cLo, cHi, mid, newLo, round) {
                    steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + arr[mid] + ' < ' + target + ' → 오른쪽! (lo=' + newLo + ')',
                        action: function() { renderArr(newLo, cHi, mid, -1); infoEl.innerHTML = 'arr[' + mid + ']=' + arr[mid] + ' < ' + target + ' → <strong>왼쪽 절반 제거!</strong>'; },
                        undo: function() { renderArr(cLo, cHi, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">배열에서 <strong>' + target + '</strong>을 찾습니다.</span>'; }
                    });
                })(cLo, cHi, mid, mid + 1, round);
                lo = mid + 1;
            } else {
                (function(cLo, cHi, mid, newHi, round) {
                    steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + arr[mid] + ' > ' + target + ' → 왼쪽! (hi=' + newHi + ')',
                        action: function() { renderArr(cLo, newHi, mid, -1); infoEl.innerHTML = 'arr[' + mid + ']=' + arr[mid] + ' > ' + target + ' → <strong>오른쪽 절반 제거!</strong>'; },
                        undo: function() { renderArr(cLo, cHi, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">배열에서 <strong>' + target + '</strong>을 찾습니다.</span>'; }
                    });
                })(cLo, cHi, mid, mid - 1, round);
                hi = mid - 1;
            }
        }
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: Lower/Upper Bound (boj-10816)
    // ====================================================================
    _renderVizBounds(container) {
        var self = this, suffix = '-bound';
        var arr = [-10, -10, 2, 3, 3, 6, 7, 10, 10, 10];
        var target = 10;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Lower/Upper Bound</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">정렬 배열에서 <strong>' + target + '</strong>의 개수를 bisect_left/right로 구합니다.</p>' +
            '<div id="bd-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="bd-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bd-arr' + suffix);
        var infoEl = container.querySelector('#bd-info' + suffix);
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
        var leftIdx = 7, rightIdx = 10; // bisect_left=7, bisect_right=10
        var steps = [
            { description: 'bisect_left(' + target + '): ' + target + ' 이상인 첫 위치를 찾습니다.',
              action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); infoEl.innerHTML = 'bisect_left = <strong>' + leftIdx + '</strong> (arr[' + leftIdx + ']=' + arr[leftIdx] + '이 처음으로 ' + target + ' ≥)'; },
              undo: function() { renderArr(null); infoEl.innerHTML = '<span style="color:var(--text2);">bisect_left와 bisect_right로 ' + target + '의 개수를 구합니다.</span>'; }
            },
            { description: 'bisect_right(' + target + '): ' + target + ' 초과인 첫 위치를 찾습니다.',
              action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } renderArr(h); infoEl.innerHTML = 'bisect_right = <strong>' + rightIdx + '</strong> (배열 끝 다음). 범위: [' + leftIdx + ', ' + rightIdx + ')'; },
              undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); infoEl.innerHTML = 'bisect_left = <strong>' + leftIdx + '</strong>'; }
            },
            { description: '개수 = bisect_right - bisect_left = ' + rightIdx + ' - ' + leftIdx + ' = ' + (rightIdx - leftIdx),
              action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;box-shadow:0 0 8px var(--green)40;'; else h[i] = 'background:var(--bg2);opacity:0.4;'; } renderArr(h); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ ' + target + '의 개수 = ' + rightIdx + ' - ' + leftIdx + ' = ' + (rightIdx - leftIdx) + '개</strong>'; },
              undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } renderArr(h); infoEl.innerHTML = 'bisect_right = <strong>' + rightIdx + '</strong>'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 랜선 자르기 (boj-1654)
    // ====================================================================
    _renderVizCable(container) {
        var self = this, suffix = '-cable';
        var cables = [802, 743, 457, 539], N = 11;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">랜선 자르기 — 매개변수 탐색</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">길이 x로 잘라 ' + N + '개 이상 만들 수 있는 최대 x를 찾습니다.</p>' +
            '<div id="cb-bars' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="cb-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#cb-bars' + suffix);
        var infoEl = container.querySelector('#cb-info' + suffix);
        var maxC = Math.max.apply(null, cables);
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
                    steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + count + '개 < ' + N + ' → NO! (hi=' + (mid - 1) + ')',
                        action: function() { renderBars(mid); infoEl.innerHTML = 'x=' + mid + 'cm → <strong>' + count + '개</strong> < ' + N + ' → <span style="color:var(--red);">NO</span>'; },
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
    },

    // ====================================================================
    // 시뮬레이션 4: 나무 자르기 (boj-2805)
    // ====================================================================
    _renderVizTreeCut(container) {
        var self = this, suffix = '-tree';
        var trees = [20, 15, 10, 17], M = 7;
        var maxH = Math.max.apply(null, trees);
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">나무 자르기 — 매개변수 탐색</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">절단기 높이 H를 이분 탐색합니다. 필요: ' + M + 'm</p>' +
            '<div id="tr-chart' + suffix + '" style="display:flex;gap:16px;justify-content:center;align-items:flex-end;height:160px;margin-bottom:12px;position:relative;"></div>' +
            '<div id="tr-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var chartEl = container.querySelector('#tr-chart' + suffix);
        var infoEl = container.querySelector('#tr-info' + suffix);
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
                    steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + gained + 'm < ' + M + ' → NO (hi=' + (mid - 1) + ')',
                        action: function() { renderTrees(mid); infoEl.innerHTML = 'H=' + mid + ' → 잘린 양 = <strong>' + gained + 'm</strong> < ' + M + ' → <span style="color:var(--red);">NO</span>'; },
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
    },

    // ====================================================================
    // 시뮬레이션 5: 공유기 설치 (boj-2110)
    // ====================================================================
    _renderVizRouter(container) {
        var self = this, suffix = '-router';
        var houses = [1, 2, 4, 8, 9], C = 3;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">공유기 설치 — 최적화 탐색</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">집 위치: [' + houses.join(', ') + '], 공유기 ' + C + '개. 최소 거리 d 이상으로 설치 가능?</p>' +
            '<div id="rt-line' + suffix + '" style="position:relative;height:80px;margin:16px 0;"></div>' +
            '<div id="rt-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var lineEl = container.querySelector('#rt-line' + suffix);
        var infoEl = container.querySelector('#rt-info' + suffix);
        var maxPos = houses[houses.length - 1];
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
                    steps.push({ description: round + '회차: d=' + mid + ' → ' + placed.length + '개 설치 < ' + C + ' → NO',
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
    },

    // ====================================================================
    // 시뮬레이션 6: K번째 수 (boj-1300)
    // ====================================================================
    _renderVizKth(container) {
        var self = this, suffix = '-kth';
        var N = 3, k = 7;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">K번째 수 — N×N 곱셈표</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">' + N + '×' + N + ' 곱셈표에서 k=' + k + '번째로 작은 수를 구합니다.</p>' +
            '<div id="kt-table' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="kt-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var tableEl = container.querySelector('#kt-table' + suffix);
        var infoEl = container.querySelector('#kt-info' + suffix);
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
                    steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + cnt + '개 < ' + k + ' → lo=' + (mid + 1),
                        action: function() { renderTable(mid); infoEl.innerHTML = 'x=' + mid + ' → <strong>' + cnt + '개</strong> < ' + k + ' → <span style="color:var(--red);">lo=' + (mid + 1) + '</span>'; },
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
    },

    // ====================================================================
    // 시뮬레이션 7: LIS (boj-12015)
    // ====================================================================
    _renderVizLIS(container) {
        var self = this, suffix = '-lis';
        var A = [10, 20, 10, 30, 20, 50];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">LIS + 이분 탐색</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">수열: [' + A.join(', ') + ']. tails 배열을 이분 탐색으로 구축합니다.</p>' +
            '<div style="margin-bottom:8px;"><strong>원본 수열</strong></div>' +
            '<div id="lis-arr' + suffix + '" style="display:flex;gap:4px;margin-bottom:16px;"></div>' +
            '<div style="margin-bottom:8px;"><strong>tails 배열</strong></div>' +
            '<div id="lis-tails' + suffix + '" style="display:flex;gap:4px;margin-bottom:12px;min-height:48px;"></div>' +
            '<div id="lis-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#lis-arr' + suffix);
        var tailsEl = container.querySelector('#lis-tails' + suffix);
        var infoEl = container.querySelector('#lis-info' + suffix);
        function box(v, hl) { return '<div style="width:48px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:600;' + (hl || 'background:var(--bg2);') + '">' + v + '</div>'; }
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
                        action: function() { renderArr(idx); renderTails(newTails, pos); infoEl.innerHTML = x + ' > tails 끝 → <strong>append</strong>. LIS 길이 = ' + newTails.length; },
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
    },

    // ===== 빈 스텁 =====
    renderVisualize(container) {},
    renderProblem(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '기본 이분 탐색', desc: '배열에서 값 찾기 (Silver IV)', problemIds: ['boj-1920', 'boj-10816'] },
        { num: 2, title: '매개변수 탐색 입문', desc: '최적값을 이분 탐색으로 (Silver II)', problemIds: ['boj-1654', 'boj-2805'] },
        { num: 3, title: '매개변수 탐색 심화', desc: '복잡한 판별 함수 (Gold)', problemIds: ['boj-2110', 'boj-1300'] },
        { num: 4, title: '응용', desc: 'LIS + 이분 탐색 (Gold II)', problemIds: ['boj-12015'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        {
            id: 'boj-1920', title: 'BOJ 1920 - 수 찾기', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1920',
            simIntro: '정렬된 배열에서 이분 탐색으로 값을 찾는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N개의 정수 A[1]~A[N]이 주어져 있을 때, X라는 정수가 A 안에 존재하는지 알아내는 프로그램을 작성하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N (1 ≤ N ≤ 100,000). 다음 줄에 N개의 정수. 다음 줄에 M. 다음 줄에 M개의 정수.</p></div><div><h4>출력</h4><p>M개의 줄에 존재하면 1, 존재하지 않으면 0을 출력.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5\n4 1 5 2 3\n5\n1 3 7 9 5</pre></div><div><strong>출력</strong><pre>1\n1\n0\n0\n1</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '배열을 <strong>정렬</strong>한 뒤, 각 질문에 대해 <strong>이분 탐색</strong>으로 존재 여부를 확인합니다.' },
                { title: '핵심 코드', content: 'Python의 <code>bisect_left</code>를 사용하거나, 직접 이분 탐색을 구현합니다.' },
                { title: '시간 복잡도', content: '정렬 O(N log N) + 탐색 M × O(log N) = <strong>O((N+M) log N)</strong>' }
            ],
            templates: {
                python: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = sorted(list(map(int, input().split())))\nM = int(input())\nqueries = list(map(int, input().split()))\n\nfor x in queries:\n    idx = bisect_left(A, x)\n    if idx < N and A[idx] == x:\n        print(1)\n    else:\n        print(0)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, M, A[100001];\nbool bsearch(int target) {\n    int lo = 0, hi = N - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (A[mid] == target) return true;\n        else if (A[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return false;\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    sort(A, A + N);\n    cin >> M;\n    for (int i = 0; i < M; i++) { int x; cin >> x; cout << (bsearch(x) ? 1 : 0) << "\\n"; }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int[] A = new int[N];\n        for (int i = 0; i < N; i++) A[i] = Integer.parseInt(st.nextToken());\n        Arrays.sort(A);\n        int M = Integer.parseInt(br.readLine().trim());\n        st = new StringTokenizer(br.readLine());\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < M; i++) {\n            int x = Integer.parseInt(st.nextToken());\n            sb.append(Arrays.binarySearch(A, x) >= 0 ? 1 : 0).append(\'\\n\');\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '정렬 + 이분 탐색',
                description: '배열을 정렬한 뒤 bisect_left로 존재 여부를 확인합니다.',
                timeComplexity: 'O((N+M) log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 정렬', code: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = sorted(list(map(int, input().split())))' },
                        { title: '쿼리 입력', code: 'M = int(input())\nqueries = list(map(int, input().split()))' },
                        { title: '이분 탐색으로 탐색', code: 'for x in queries:\n    idx = bisect_left(A, x)\n    if idx < N and A[idx] == x:\n        print(1)\n    else:\n        print(0)' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-10816', title: 'BOJ 10816 - 숫자 카드 2', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10816',
            simIntro: 'bisect_left와 bisect_right의 차이를 시각적으로 확인하세요.',
            descriptionHTML: '<h3>문제</h3><p>숫자 카드 N장이 있습니다. 정수 M개가 주어졌을 때, 각 정수가 적힌 숫자 카드를 몇 장 가지고 있는지 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N (1 ≤ N ≤ 500,000). 다음 줄에 N개의 정수. 다음 줄에 M. 다음 줄에 M개의 정수.</p></div><div><h4>출력</h4><p>각 수가 적힌 카드의 개수를 공백으로 구분하여 출력.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>10\n6 3 2 10 10 10 -10 -10 7 3\n8\n10 9 -5 2 3 4 5 -10</pre></div><div><strong>출력</strong><pre>3 0 0 1 2 0 0 2</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '<strong>lower_bound와 upper_bound</strong>를 사용합니다. 개수 = upper_bound - lower_bound' },
                { title: '핵심 코드', content: 'Python: <code>bisect_right(x) - bisect_left(x)</code>' }
            ],
            templates: {
                python: 'import sys\nfrom bisect import bisect_left, bisect_right\ninput = sys.stdin.readline\n\nN = int(input())\ncards = sorted(list(map(int, input().split())))\nM = int(input())\nqueries = list(map(int, input().split()))\n\nresult = []\nfor x in queries:\n    result.append(bisect_right(cards, x) - bisect_left(cards, x))\n\nprint(\' \'.join(map(str, result)))',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N; cin >> N;\n    int cards[500001];\n    for (int i = 0; i < N; i++) cin >> cards[i];\n    sort(cards, cards + N);\n    int M; cin >> M;\n    for (int i = 0; i < M; i++) {\n        int x; cin >> x;\n        int cnt = upper_bound(cards, cards + N, x) - lower_bound(cards, cards + N, x);\n        cout << cnt << (i < M - 1 ? " " : "\\n");\n    }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    static int lowerBound(int[] a, int t) { int lo=0,hi=a.length; while(lo<hi){int m=(lo+hi)/2;if(a[m]<t)lo=m+1;else hi=m;} return lo; }\n    static int upperBound(int[] a, int t) { int lo=0,hi=a.length; while(lo<hi){int m=(lo+hi)/2;if(a[m]<=t)lo=m+1;else hi=m;} return lo; }\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        int[] cards = new int[N];\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        for (int i = 0; i < N; i++) cards[i] = Integer.parseInt(st.nextToken());\n        Arrays.sort(cards);\n        int M = Integer.parseInt(br.readLine().trim());\n        st = new StringTokenizer(br.readLine());\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < M; i++) {\n            int x = Integer.parseInt(st.nextToken());\n            if (i > 0) sb.append(\' \');\n            sb.append(upperBound(cards, x) - lowerBound(cards, x));\n        }\n        System.out.println(sb);\n    }\n}'
            },
            solutions: [{
                approach: 'bisect_left + bisect_right',
                description: '정렬 후 upper_bound - lower_bound로 개수를 구합니다.',
                timeComplexity: 'O((N+M) log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 정렬', code: 'import sys\nfrom bisect import bisect_left, bisect_right\ninput = sys.stdin.readline\n\nN = int(input())\ncards = sorted(list(map(int, input().split())))' },
                        { title: '쿼리 처리', code: 'M = int(input())\nqueries = list(map(int, input().split()))' },
                        { title: '개수 계산 및 출력', code: 'result = []\nfor x in queries:\n    result.append(bisect_right(cards, x) - bisect_left(cards, x))\n\nprint(\' \'.join(map(str, result)))' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1654', title: 'BOJ 1654 - 랜선 자르기', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1654',
            simIntro: '랜선 길이를 이분 탐색으로 결정하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>이미 가지고 있는 K개의 랜선을 잘라서 N개의 같은 길이의 랜선을 만들려 합니다. 만들 수 있는 최대 랜선의 길이를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 K, N. 이후 K줄에 각 랜선의 길이.</p></div><div><h4>출력</h4><p>N개를 만들 수 있는 랜선의 최대 길이.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4 11\n802\n743\n457\n539</pre></div><div><strong>출력</strong><pre>200</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '<strong>매개변수 탐색!</strong> "길이 x로 잘랐을 때 N개 이상 만들 수 있는가?"' },
                { title: '판별 함수', content: '<code>check(x) = sum(각 랜선 // x) >= N</code>' },
                { title: '범위 주의', content: 'lo=1, hi=max(랜선). <strong>lo=0이면 0으로 나누기 에러!</strong>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nK, N = map(int, input().split())\ncables = [int(input()) for _ in range(K)]\n\nlo, hi = 1, max(cables)\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    count = sum(c // mid for c in cables)\n    if count >= N:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1\n\nprint(answer)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    int K, N; cin >> K >> N;\n    ll cables[10001], maxLen = 0;\n    for (int i = 0; i < K; i++) { cin >> cables[i]; maxLen = max(maxLen, cables[i]); }\n    ll lo = 1, hi = maxLen, answer = 0;\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2, count = 0;\n        for (int i = 0; i < K; i++) count += cables[i] / mid;\n        if (count >= N) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    cout << answer << endl;\n    return 0;\n}',
                java: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int K = sc.nextInt(), N = sc.nextInt();\n        long[] cables = new long[K]; long maxLen = 0;\n        for (int i = 0; i < K; i++) { cables[i] = sc.nextLong(); maxLen = Math.max(maxLen, cables[i]); }\n        long lo = 1, hi = maxLen, answer = 0;\n        while (lo <= hi) {\n            long mid = (lo + hi) / 2, count = 0;\n            for (long c : cables) count += c / mid;\n            if (count >= N) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n        }\n        System.out.println(answer);\n    }\n}'
            },
            solutions: [{
                approach: '매개변수 탐색',
                description: '길이 x로 잘랐을 때 N개 이상 가능한지 이분 탐색합니다.',
                timeComplexity: 'O(K log max)',
                spaceComplexity: 'O(K)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nK, N = map(int, input().split())\ncables = [int(input()) for _ in range(K)]' },
                        { title: '이분 탐색 범위', code: 'lo, hi = 1, max(cables)\nanswer = 0' },
                        { title: '이분 탐색 + 판별', code: 'while lo <= hi:\n    mid = (lo + hi) // 2\n    count = sum(c // mid for c in cables)\n    if count >= N:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1' },
                        { title: '출력', code: 'print(answer)' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-2805', title: 'BOJ 2805 - 나무 자르기', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2805',
            simIntro: '절단기 높이를 이분 탐색으로 결정하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>목재절단기에 높이 H를 설정하면 H보다 높은 나무의 윗부분이 잘립니다. 적어도 M미터의 나무를 가져가기 위한 높이의 최댓값을 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>N, M. 둘째 줄에 나무 높이들.</p></div><div><h4>출력</h4><p>절단기 높이의 최댓값.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4 7\n20 15 10 17</pre></div><div><strong>출력</strong><pre>15</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '<strong>매개변수 탐색!</strong> "높이 H로 잘랐을 때 M미터 이상 얻을 수 있는가?"' },
                { title: '판별 함수', content: '<code>check(H) = sum(max(0, tree - H)) >= M</code>' },
                { title: '범위', content: 'lo=0, hi=max(나무). <strong>합계가 int 범위를 넘을 수 있으므로 long 사용!</strong>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ntrees = list(map(int, input().split()))\n\nlo, hi = 0, max(trees)\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    gained = sum(max(0, t - mid) for t in trees)\n    if gained >= M:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1\n\nprint(answer)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N; ll M; cin >> N >> M;\n    int trees[1000001]; int maxH = 0;\n    for (int i = 0; i < N; i++) { cin >> trees[i]; maxH = max(maxH, trees[i]); }\n    ll lo = 0, hi = maxH, answer = 0;\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2, gained = 0;\n        for (int i = 0; i < N; i++) if (trees[i] > mid) gained += trees[i] - mid;\n        if (gained >= M) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    cout << answer << endl;\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken()); long M = Long.parseLong(st.nextToken());\n        st = new StringTokenizer(br.readLine());\n        int[] trees = new int[N]; int maxH = 0;\n        for (int i = 0; i < N; i++) { trees[i] = Integer.parseInt(st.nextToken()); maxH = Math.max(maxH, trees[i]); }\n        long lo = 0, hi = maxH, answer = 0;\n        while (lo <= hi) {\n            long mid = (lo + hi) / 2, gained = 0;\n            for (int t : trees) if (t > mid) gained += t - mid;\n            if (gained >= M) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n        }\n        System.out.println(answer);\n    }\n}'
            },
            solutions: [{
                approach: '매개변수 탐색',
                description: '절단 높이 H에 대해 잘린 양이 M 이상인지 이분 탐색합니다.',
                timeComplexity: 'O(N log max)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ntrees = list(map(int, input().split()))' },
                        { title: '이분 탐색', code: 'lo, hi = 0, max(trees)\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    gained = sum(max(0, t - mid) for t in trees)\n    if gained >= M:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1' },
                        { title: '출력', code: 'print(answer)' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-2110', title: 'BOJ 2110 - 공유기 설치', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2110',
            simIntro: '최소 거리 d를 이분 탐색하여 공유기를 배치하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N개의 집에 C개의 공유기를 설치하려 합니다. 가장 인접한 두 공유기 사이의 거리를 최대화하시오.</p><div class="problem-io"><div><h4>입력</h4><p>N, C. 이후 N줄에 집의 좌표.</p></div><div><h4>출력</h4><p>가장 인접한 두 공유기 사이의 최대 거리.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5 3\n1\n2\n8\n4\n9</pre></div><div><strong>출력</strong><pre>3</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '<strong>"최소 거리 d 이상으로 C개를 설치할 수 있는가?"</strong>를 이분 탐색합니다.' },
                { title: '판별 함수', content: '집을 정렬 후, 첫 집부터 d 이상 떨어진 집에 설치. 설치 수 ≥ C면 YES.' },
                { title: '범위', content: 'lo=1, hi=max-min. YES면 lo=mid+1, NO면 hi=mid-1.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, C = map(int, input().split())\nhouses = sorted([int(input()) for _ in range(N)])\n\nlo, hi = 1, houses[-1] - houses[0]\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    count = 1\n    last = houses[0]\n    for i in range(1, N):\n        if houses[i] - last >= mid:\n            count += 1\n            last = houses[i]\n    if count >= C:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1\n\nprint(answer)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, C, houses[200001];\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);\n    long long lo = 1, hi = houses[N-1] - houses[0], answer = 0;\n    while (lo <= hi) {\n        long long mid = (lo + hi) / 2;\n        int count = 1, last = houses[0];\n        for (int i = 1; i < N; i++) { if (houses[i] - last >= mid) { count++; last = houses[i]; } }\n        if (count >= C) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    cout << answer << endl;\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken()), C = Integer.parseInt(st.nextToken());\n        int[] houses = new int[N];\n        for (int i = 0; i < N; i++) houses[i] = Integer.parseInt(br.readLine().trim());\n        Arrays.sort(houses);\n        long lo = 1, hi = houses[N-1] - houses[0], answer = 0;\n        while (lo <= hi) {\n            long mid = (lo + hi) / 2;\n            int count = 1, last = houses[0];\n            for (int i = 1; i < N; i++) { if (houses[i] - last >= mid) { count++; last = houses[i]; } }\n            if (count >= C) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n        }\n        System.out.println(answer);\n    }\n}'
            },
            solutions: [{
                approach: '매개변수 탐색 (거리)',
                description: '최소 거리 d 이상으로 C개를 설치할 수 있는지 이분 탐색합니다.',
                timeComplexity: 'O(N log(max-min))',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 정렬', code: 'import sys\ninput = sys.stdin.readline\n\nN, C = map(int, input().split())\nhouses = sorted([int(input()) for _ in range(N)])' },
                        { title: '이분 탐색 범위', code: 'lo, hi = 1, houses[-1] - houses[0]\nanswer = 0' },
                        { title: '탐색 + 그리디 판별', code: 'while lo <= hi:\n    mid = (lo + hi) // 2\n    count = 1\n    last = houses[0]\n    for i in range(1, N):\n        if houses[i] - last >= mid:\n            count += 1\n            last = houses[i]\n    if count >= C:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1' },
                        { title: '출력', code: 'print(answer)' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-1300', title: 'BOJ 1300 - K번째 수', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1300',
            simIntro: 'N×N 곱셈표에서 x 이하인 수의 개수를 이분 탐색으로 구하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N×N 배열 A에서 A[i][j] = i × j입니다. 이 배열을 일차원으로 펼치고 오름차순 정렬했을 때, k번째 수를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>N (≤ 10^5). k (≤ min(10^9, N^2)).</p></div><div><h4>출력</h4><p>k번째 수.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>3\n7</pre></div><div><strong>출력</strong><pre>6</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '<strong>"x 이하인 수가 k개 이상인가?"</strong>를 이분 탐색합니다.' },
                { title: '판별 함수', content: 'i행에서 i×j ≤ x인 j의 개수 = min(x÷i, N).<br><code>sum(min(x//i, N) for i in 1..N)</code>' },
                { title: '범위', content: 'lo=1, hi=k (답은 항상 k 이하). lower_bound 형태.' }
            ],
            templates: {
                python: 'N = int(input())\nk = int(input())\n\nlo, hi = 1, k\n\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    count = 0\n    for i in range(1, N + 1):\n        count += min(mid // i, N)\n    if count >= k:\n        hi = mid\n    else:\n        lo = mid + 1\n\nprint(lo)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    ll N, k; cin >> N >> k;\n    ll lo = 1, hi = k;\n    while (lo < hi) {\n        ll mid = (lo + hi) / 2, count = 0;\n        for (ll i = 1; i <= N; i++) count += min(mid / i, N);\n        if (count >= k) hi = mid; else lo = mid + 1;\n    }\n    cout << lo << endl;\n    return 0;\n}',
                java: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long N = sc.nextLong(), k = sc.nextLong();\n        long lo = 1, hi = k;\n        while (lo < hi) {\n            long mid = (lo + hi) / 2, count = 0;\n            for (long i = 1; i <= N; i++) count += Math.min(mid / i, N);\n            if (count >= k) hi = mid; else lo = mid + 1;\n        }\n        System.out.println(lo);\n    }\n}'
            },
            solutions: [{
                approach: '결정 문제 + 이분 탐색',
                description: 'x 이하인 수의 개수를 O(N)에 세고, 그 값이 k 이상인 최소 x를 이분 탐색합니다.',
                timeComplexity: 'O(N log k)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'N = int(input())\nk = int(input())' },
                        { title: '이분 탐색 (lower_bound)', code: 'lo, hi = 1, k\n\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    count = 0\n    for i in range(1, N + 1):\n        count += min(mid // i, N)\n    if count >= k:\n        hi = mid\n    else:\n        lo = mid + 1' },
                        { title: '출력', code: 'print(lo)' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-12015', title: 'BOJ 12015 - 가장 긴 증가하는 부분 수열 2', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/12015',
            simIntro: 'tails 배열에 이분 탐색으로 원소를 삽입하는 LIS 알고리즘을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열(LIS)의 길이를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>N (1 ≤ N ≤ 1,000,000). 수열 A.</p></div><div><h4>출력</h4><p>LIS의 길이.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>6\n10 20 10 30 20 50</pre></div><div><strong>출력</strong><pre>4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'DP O(N²)은 시간 초과. <strong>이분 탐색</strong>으로 O(N log N)에 풀어야 합니다.' },
                { title: '핵심 아이디어', content: '<code>tails</code> 배열: tails[i] = 길이 i+1인 LIS의 마지막 최솟값.<br>bisect_left로 위치를 찾습니다.' },
                { title: '구현', content: 'tails 끝보다 크면 append, 아니면 교체. 최종 답 = len(tails).' }
            ],
            templates: {
                python: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = list(map(int, input().split()))\n\ntails = []\n\nfor x in A:\n    pos = bisect_left(tails, x)\n    if pos == len(tails):\n        tails.append(x)\n    else:\n        tails[pos] = x\n\nprint(len(tails))',
                cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N; cin >> N;\n    vector<int> tails;\n    for (int i = 0; i < N; i++) {\n        int x; cin >> x;\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    cout << tails.size() << endl;\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        List<Integer> tails = new ArrayList<>();\n        for (int i = 0; i < N; i++) {\n            int x = Integer.parseInt(st.nextToken());\n            int pos = Collections.binarySearch(tails, x);\n            if (pos < 0) pos = -(pos + 1);\n            if (pos == tails.size()) tails.add(x);\n            else tails.set(pos, x);\n        }\n        System.out.println(tails.size());\n    }\n}'
            },
            solutions: [{
                approach: 'tails 배열 + bisect_left',
                description: 'tails 배열을 유지하며 이분 탐색으로 O(N log N)에 LIS 길이를 구합니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = list(map(int, input().split()))' },
                        { title: 'tails 배열 초기화', code: 'tails = []' },
                        { title: 'LIS 구축', code: 'for x in A:\n    pos = bisect_left(tails, x)\n    if pos == len(tails):\n        tails.append(x)    # LIS 길이 증가\n    else:\n        tails[pos] = x     # 더 작은 값으로 교체' },
                        { title: '출력', code: 'print(len(tails))' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[6].templates; }
            }]
        }
    ],

    // ===== 역호환 스텁 =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', function() { binarySearchTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.binarysearch = binarySearchTopic;
