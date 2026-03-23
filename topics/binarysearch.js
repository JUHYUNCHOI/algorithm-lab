// ===== 이분 탐색 토픽 모듈 =====
const binarySearchTopic = {
    id: 'binarysearch',
    title: '이분 탐색',
    icon: '🔍',
    category: '탐색 (Silver)',
    order: 8,
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
                    국어사전에서 "사과"를 찾는다고 생각해 보세요.<br><br>
                    첫 페이지부터 한 장씩 넘기면? 몇 천 페이지를 넘겨야 해요!<br>
                    그런데 <strong>딱 중간</strong>을 펴면? "ㅁ" 근처가 나와요.<br>
                    "사"는 "ㅁ"보다 뒤에 있으니까 → <strong>앞 절반은 안 봐도 돼요!</strong><br>
                    남은 절반의 중간을 또 펴고... 이걸 반복하면 금방 찾을 수 있어요!<br><br>
                    이게 바로 <strong>이분 탐색</strong>이에요. 매번 <strong>반을 버리니까</strong> 엄청나게 빨라요.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 이분 탐색으로 값 찾기</div>
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">
                        정렬된 배열에서 target을 찾는 과정을 한 스텝씩 따라가 보세요.<br>
                        매 스텝마다 <strong>절반이 버려지는 것</strong>을 눈으로 확인할 수 있습니다!
                    </p>
                    <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">
                        <label style="font-weight:600;font-size:0.9rem;">배열:
                            <input type="text" id="bs-demo-intro-arr" value="2, 5, 8, 12, 16, 23, 38, 56, 72, 91" style="padding:5px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:260px;">
                        </label>
                        <label style="font-weight:600;font-size:0.9rem;">target:
                            <input type="number" id="bs-demo-intro-target" value="23" style="padding:5px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:70px;">
                        </label>
                    </div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bs-demo-intro-step">다음 ▶</button>
                        <button class="concept-demo-btn danger" id="bs-demo-intro-reset">처음으로 ↺</button>
                    </div>
                    <div id="bs-demo-intro-arr-viz" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>
                    <div id="bs-demo-intro-pointers" style="font-size:0.85rem;color:var(--text2);margin-bottom:6px;min-height:22px;"></div>
                    <div id="bs-demo-intro-log" style="padding:12px;background:var(--bg);border-radius:8px;font-size:0.88rem;line-height:1.7;min-height:40px;max-height:220px;overflow-y:auto;"></div>
                    <div class="concept-demo-msg" id="bs-demo-intro-msg">👆 Step을 눌러 이분 탐색이 절반씩 버리며 찾아가는 과정을 확인하세요!</div>
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 탐색 실패 체험 — 없는 값을 찾으면?</div>
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">
                        배열에 <strong>없는 값</strong>을 찾으면 어떻게 될까요? lo와 hi가 좁혀지다가 <strong>lo &gt; hi</strong>가 되면 "없다!"고 판단합니다.
                        직접 target을 바꿔가며 실패 과정을 확인해보세요.
                    </p>
                    <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">
                        <label style="font-weight:600;font-size:0.9rem;">정렬된 배열: <span style="color:var(--accent);font-weight:700;">[1, 3, 5, 7, 9, 11, 13]</span></label>
                        <label style="font-weight:600;font-size:0.9rem;">target:
                            <input type="number" id="bs-demo-fail-target" value="6" style="padding:5px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:70px;">
                        </label>
                    </div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bs-demo-fail-step">다음 ▶</button>
                        <button class="concept-demo-btn danger" id="bs-demo-fail-reset">처음으로 ↺</button>
                    </div>
                    <div id="bs-demo-fail-arr" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>
                    <div id="bs-demo-fail-pointers" style="font-size:0.85rem;color:var(--text2);margin-bottom:6px;min-height:22px;"></div>
                    <div id="bs-demo-fail-log" style="padding:12px;background:var(--bg);border-radius:8px;font-size:0.88rem;line-height:1.7;min-height:40px;max-height:220px;overflow-y:auto;"></div>
                    <div class="concept-demo-msg" id="bs-demo-fail-msg">👆 target에 배열에 없는 값(예: 6, 4, 0)을 넣고 탐색해보세요!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 시간 복잡도: O(log N)<small style="font-weight:400;">(반씩 줄여가며 찾기)</small>은 얼마나 빠를까?</div>
                <div class="analogy-box">
                    <strong>핵심:</strong> 이분 탐색은 매번 탐색 범위를 <strong>절반</strong>으로 줄입니다.
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 크기 비교 — N을 바꿔보며 차이를 체감하세요</div>
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">
                        데이터가 많아질수록 순차 탐색과 이분 탐색의 차이는 <strong>폭발적</strong>으로 벌어집니다.
                        슬라이더를 움직여서 N이 커질 때 비교 횟수가 어떻게 변하는지 직접 확인해보세요.
                    </p>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
                        <label style="font-weight:600;font-size:0.9rem;">데이터 크기 N:</label>
                        <input type="range" id="bs-demo-speed-slider" min="1" max="30" value="10" style="flex:1;min-width:150px;">
                        <span id="bs-demo-speed-n" style="font-weight:700;color:var(--accent);font-size:1rem;min-width:100px;">1,024</span>
                    </div>
                    <div style="display:flex;gap:20px;align-items:flex-end;margin-bottom:12px;min-height:180px;" id="bs-demo-speed-chart">
                        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
                            <div id="bs-demo-speed-linear-count" style="font-weight:700;font-size:0.85rem;color:var(--red);"></div>
                            <div style="width:100%;background:var(--bg2);border-radius:8px;position:relative;height:160px;overflow:hidden;">
                                <div id="bs-demo-speed-linear-bar" style="position:absolute;bottom:0;width:100%;background:var(--red);border-radius:8px;transition:height 0.4s;"></div>
                            </div>
                            <div style="font-size:0.8rem;font-weight:600;color:var(--text2);">순차 탐색<br>O(N)</div>
                        </div>
                        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
                            <div id="bs-demo-speed-binary-count" style="font-weight:700;font-size:0.85rem;color:var(--green);"></div>
                            <div style="width:100%;background:var(--bg2);border-radius:8px;position:relative;height:160px;overflow:hidden;">
                                <div id="bs-demo-speed-binary-bar" style="position:absolute;bottom:0;width:100%;background:var(--green);border-radius:8px;transition:height 0.4s;"></div>
                            </div>
                            <div style="font-size:0.8rem;font-weight:600;color:var(--text2);">이분 탐색<br>O(log N)</div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bs-demo-speed-msg">슬라이더를 움직여 N을 바꿔보세요!</div>
                </div>
                <div class="concept-grid">
                    <span class="lang-py"><div class="concept-card">
                        <h3>Python: bisect</h3>
                        <p><code>from bisect import bisect_left, bisect_right</code><br>
                        정렬된 배열에서 O(log N) 탐색.<br>
                        <code>bisect_left(arr, x)</code> → x 이상인 첫 위치<br>
                        <code>bisect_right(arr, x)</code> → x 초과인 첫 위치</p>
                        <a href="https://docs.python.org/3/library/bisect.html" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: bisect ↗</a>
                    </div></span>
                    <span class="lang-cpp"><div class="concept-card">
                        <h3>C++: &lt;algorithm&gt;</h3>
                        <p><code>lower_bound(begin, end, x)</code> → x 이상인 첫 위치<br>
                        <code>upper_bound(begin, end, x)</code> → x 초과인 첫 위치<br>
                        <code>binary_search(begin, end, x)</code> → 존재 여부</p>
                        <a href="https://en.cppreference.com/w/cpp/algorithm/lower_bound" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: lower_bound / upper_bound ↗</a>
                    </div></span>
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 조건이 바뀌는 경계 찾기</div>
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">
                        배낭에 짐을 실을 수 있을까요? 무게가 커지면 어느 순간부터 "불가능(NO)"이 됩니다.<br>
                        <strong>NO→YES 또는 YES→NO로 바뀌는 경계</strong>를 이분 탐색으로 찾는 것이 매개변수 탐색입니다.
                        아래에서 이분 탐색이 경계를 어떻게 찾는지 한 스텝씩 따라가 보세요.
                    </p>
                    <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">
                        <label style="font-weight:600;font-size:0.9rem;">배낭 용량:
                            <input type="number" id="bs-demo-param-capacity" value="15" min="1" max="50" style="padding:5px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:70px;"> kg
                        </label>
                        <span style="font-size:0.85rem;color:var(--text3);">짐 무게: [2, 4, 5, 7, 8, 10, 12, 15, 18, 20] kg</span>
                    </div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bs-demo-param-step">다음 ▶</button>
                        <button class="concept-demo-btn danger" id="bs-demo-param-reset">처음으로 ↺</button>
                    </div>
                    <div style="margin-bottom:6px;font-size:0.85rem;color:var(--text2);" id="bs-demo-param-question"></div>
                    <div id="bs-demo-param-arr" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:10px;"></div>
                    <div id="bs-demo-param-pointers" style="font-size:0.85rem;color:var(--text2);margin-bottom:6px;min-height:22px;"></div>
                    <div id="bs-demo-param-log" style="padding:12px;background:var(--bg);border-radius:8px;font-size:0.88rem;line-height:1.7;min-height:40px;max-height:220px;overflow-y:auto;"></div>
                    <div class="concept-demo-msg" id="bs-demo-param-msg">👆 배낭 용량을 설정하고 "경계 찾기"를 눌러보세요!</div>
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

        // ── Demo 0: 이분 탐색 기본 체험 (섹션 1) ──
        (function() {
            var introArrInput = container.querySelector('#bs-demo-intro-arr');
            var introTargetInput = container.querySelector('#bs-demo-intro-target');
            var introStepBtn = container.querySelector('#bs-demo-intro-step');
            var introResetBtn = container.querySelector('#bs-demo-intro-reset');
            var introArrViz = container.querySelector('#bs-demo-intro-arr-viz');
            var introPointers = container.querySelector('#bs-demo-intro-pointers');
            var introLog = container.querySelector('#bs-demo-intro-log');
            var introMsg = container.querySelector('#bs-demo-intro-msg');
            if (!introStepBtn) return;

            var introState = { arr: [], steps: [], stepIdx: -1, logLines: [], target: 23 };

            function parseArr(str) {
                return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            }

            function introCell(v, i, style) {
                return '<div style="width:44px;text-align:center;padding:7px 3px;border-radius:8px;font-weight:600;font-size:0.88rem;transition:all 0.3s;' + style + '"><div>' + v + '</div><div style="font-size:0.65rem;color:var(--text3);">[' + i + ']</div></div>';
            }

            function renderIntroArr(arr, lo, hi, mid, foundIdx) {
                introArrViz.innerHTML = arr.map(function(v, i) {
                    if (foundIdx === i) return introCell(v, i, 'background:var(--green);color:white;box-shadow:0 0 10px var(--green);');
                    if (i === mid) return introCell(v, i, 'background:var(--yellow);color:#333;box-shadow:0 0 8px var(--yellow);');
                    if (i >= lo && i <= hi) return introCell(v, i, 'background:var(--accent)15;border:2px solid var(--accent);');
                    return introCell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.5;');
                }).join('');
            }

            function buildIntroSteps() {
                var arr = parseArr(introArrInput.value);
                if (arr.length < 2) { introMsg.textContent = '배열에 최소 2개 이상의 숫자를 입력하세요!'; return; }
                arr.sort(function(a, b) { return a - b; });
                var target = parseInt(introTargetInput.value);
                if (isNaN(target)) { introMsg.textContent = 'target에 숫자를 입력하세요!'; return; }

                introState.arr = arr;
                introState.target = target;
                introState.steps = [];
                introState.stepIdx = -1;
                introState.logLines = [];

                var lo = 0, hi = arr.length - 1;
                var round = 0;
                while (lo <= hi) {
                    var mid = Math.floor((lo + hi) / 2);
                    round++;
                    if (arr[mid] === target) {
                        introState.steps.push({ lo: lo, hi: hi, mid: mid, found: true, round: round });
                        break;
                    } else if (arr[mid] < target) {
                        introState.steps.push({ lo: lo, hi: hi, mid: mid, found: false, round: round, dir: 'right', newLo: mid + 1, newHi: hi, eliminated: mid - lo + 1 });
                        lo = mid + 1;
                    } else {
                        introState.steps.push({ lo: lo, hi: hi, mid: mid, found: false, round: round, dir: 'left', newLo: lo, newHi: mid - 1, eliminated: hi - mid + 1 });
                        hi = mid - 1;
                    }
                }
                if (!introState.steps.length || !introState.steps[introState.steps.length - 1].found) {
                    introState.steps.push({ failed: true, round: round + 1 });
                }

                renderIntroArr(arr, 0, arr.length - 1, -1, -1);
                introPointers.innerHTML = 'lo=0, hi=' + (arr.length - 1) + ' — 전체 범위에서 시작합니다';
                introLog.innerHTML = '';
                introMsg.textContent = 'Step을 눌러 target=' + target + ' 탐색을 시작하세요! (' + introState.steps.length + '단계)';
            }

            function introStep() {
                if (introState.steps.length === 0 || introState.stepIdx >= introState.steps.length - 1) {
                    buildIntroSteps();
                    return;
                }
                introState.stepIdx++;
                var s = introState.steps[introState.stepIdx];
                var arr = introState.arr;
                var target = introState.target;

                if (s.failed) {
                    renderIntroArr(arr, 0, 0, -1, -1);
                    introPointers.innerHTML = '<strong style="color:var(--red);">lo > hi → 탐색 범위 소진!</strong>';
                    introState.logLines.push('<span style="color:var(--red);font-weight:700;">결과: ' + target + '은(는) 배열에 없습니다!</span>');
                    introMsg.innerHTML = '<strong style="color:var(--red);">이분 탐색 완료 — 값을 찾지 못했습니다.</strong>';
                } else if (s.found) {
                    renderIntroArr(arr, s.lo, s.hi, -1, s.mid);
                    introPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    introState.logLines.push('<span style="color:var(--green);font-weight:700;">' + s.round + '회차: arr[' + s.mid + ']=' + arr[s.mid] + ' == ' + target + ' → 찾았습니다! 🎉</span>');
                    introMsg.innerHTML = '<strong style="color:var(--green);">단 ' + s.round + '번 만에 찾았습니다!</strong> ' + arr.length + '개 중 절반씩 버려가며 빠르게 도착했습니다.';
                } else {
                    renderIntroArr(arr, s.lo, s.hi, s.mid, -1);
                    introPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    var dirText = s.dir === 'right'
                        ? arr[s.mid] + ' < ' + target + ' → mid 왼쪽 절반(' + s.eliminated + '개)을 버립니다!'
                        : arr[s.mid] + ' > ' + target + ' → mid 오른쪽 절반(' + s.eliminated + '개)을 버립니다!';
                    introState.logLines.push(s.round + '회차: arr[' + s.mid + ']=' + dirText + ' → 범위 [' + s.newLo + '~' + s.newHi + ']');
                    var remaining = s.newHi - s.newLo + 1;
                    introMsg.textContent = s.eliminated + '개를 한 번에 제거! 남은 범위: ' + remaining + '개. Step을 눌러 계속하세요.';
                }
                introLog.innerHTML = introState.logLines.join('<br>');
                introLog.scrollTop = introLog.scrollHeight;
            }

            function introReset() {
                var arr = parseArr(introArrInput.value);
                if (arr.length < 2) arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
                arr.sort(function(a, b) { return a - b; });
                introState = { arr: arr, steps: [], stepIdx: -1, logLines: [], target: parseInt(introTargetInput.value) || 23 };
                renderIntroArr(arr, 0, arr.length - 1, -1, -1);
                introPointers.innerHTML = '';
                introLog.innerHTML = '';
                introMsg.textContent = 'Step을 눌러 이분 탐색이 절반씩 버리며 찾아가는 과정을 확인하세요!';
            }

            var defaultArr = parseArr(introArrInput.value);
            defaultArr.sort(function(a, b) { return a - b; });
            introState.arr = defaultArr;
            renderIntroArr(defaultArr, 0, defaultArr.length - 1, -1, -1);
            introStepBtn.addEventListener('click', introStep);
            introResetBtn.addEventListener('click', introReset);
        })();

        // ── Demo 1: 탐색 실패 체험 ──
        (function() {
            var FAIL_ARR = [1, 3, 5, 7, 9, 11, 13];
            var failTargetInput = container.querySelector('#bs-demo-fail-target');
            var failStepBtn = container.querySelector('#bs-demo-fail-step');
            var failResetBtn = container.querySelector('#bs-demo-fail-reset');
            var failArrEl = container.querySelector('#bs-demo-fail-arr');
            var failPointers = container.querySelector('#bs-demo-fail-pointers');
            var failLog = container.querySelector('#bs-demo-fail-log');
            var failMsg = container.querySelector('#bs-demo-fail-msg');
            if (!failStepBtn) return;

            var failState = { steps: [], stepIdx: -1, logLines: [], target: 6 };

            function failCell(v, i, style) {
                return '<div style="width:44px;text-align:center;padding:7px 3px;border-radius:8px;font-weight:600;font-size:0.88rem;transition:all 0.3s;' + style + '"><div>' + v + '</div><div style="font-size:0.65rem;color:var(--text3);">[' + i + ']</div></div>';
            }

            function renderFailArr(lo, hi, mid, dimAll) {
                failArrEl.innerHTML = FAIL_ARR.map(function(v, i) {
                    if (dimAll) return failCell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.7;');
                    if (i === mid) return failCell(v, i, 'background:var(--yellow);color:#333;box-shadow:0 0 8px var(--yellow);');
                    if (i >= lo && i <= hi) return failCell(v, i, 'background:var(--accent)15;border:2px solid var(--accent);');
                    return failCell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.75;');
                }).join('');
            }

            function buildFailSteps() {
                var target = parseInt(failTargetInput.value);
                if (isNaN(target)) { failMsg.textContent = 'target에 숫자를 입력해주세요!'; return; }
                failState.target = target;
                failState.steps = [];
                failState.stepIdx = -1;
                failState.logLines = [];

                var found = FAIL_ARR.indexOf(target) !== -1;
                var lo = 0, hi = FAIL_ARR.length - 1;
                var round = 0;
                while (lo <= hi) {
                    var mid = Math.floor((lo + hi) / 2);
                    round++;
                    if (FAIL_ARR[mid] === target) {
                        failState.steps.push({ lo: lo, hi: hi, mid: mid, found: true, round: round });
                        break;
                    } else if (FAIL_ARR[mid] < target) {
                        failState.steps.push({ lo: lo, hi: hi, mid: mid, found: false, round: round, newLo: mid + 1, newHi: hi });
                        lo = mid + 1;
                    } else {
                        failState.steps.push({ lo: lo, hi: hi, mid: mid, found: false, round: round, newLo: lo, newHi: mid - 1 });
                        hi = mid - 1;
                    }
                }
                if (!found) {
                    failState.steps.push({ failed: true, round: round + 1 });
                }
                // 초기 상태 렌더
                renderFailArr(0, FAIL_ARR.length - 1, -1, false);
                failPointers.innerHTML = '';
                failLog.innerHTML = '';
                failMsg.textContent = 'Step을 눌러 target=' + target + ' 탐색을 한 단계씩 진행하세요. (' + failState.steps.length + '단계)';
            }

            function failStep() {
                // 첫 클릭 시 스텝 생성
                if (failState.steps.length === 0 || failState.stepIdx >= failState.steps.length - 1) {
                    buildFailSteps();
                    return;
                }
                failState.stepIdx++;
                var s = failState.steps[failState.stepIdx];
                var target = failState.target;
                if (s.failed) {
                    failPointers.innerHTML = '<strong style="color:var(--red);">lo > hi → 탐색 범위가 사라졌습니다!</strong>';
                    renderFailArr(0, 0, -1, true);
                    failState.logLines.push('<span style="color:var(--red);font-weight:700;">결과: ' + target + '은(는) 배열에 없습니다! → return -1</span>');
                    failMsg.innerHTML = '<strong style="color:var(--red);">lo > hi가 되면 "없다"고 판단합니다.</strong> 이것이 이분 탐색이 -1을 반환하는 이유입니다.';
                } else if (s.found) {
                    renderFailArr(s.lo, s.hi, s.mid, false);
                    failPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    failState.logLines.push('<span style="color:var(--green);font-weight:700;">' + s.round + '회차: arr[' + s.mid + ']=' + FAIL_ARR[s.mid] + ' == ' + target + ' → 찾았습니다!</span>');
                    failMsg.innerHTML = '<strong style="color:var(--green);">찾았습니다!</strong> 배열에 있는 값이라 탐색 성공. 없는 값을 넣어보세요!';
                } else {
                    renderFailArr(s.lo, s.hi, s.mid, false);
                    failPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    var cmp = FAIL_ARR[s.mid] < target ? (FAIL_ARR[s.mid] + ' < ' + target + ' → 오른쪽으로!') : (FAIL_ARR[s.mid] + ' > ' + target + ' → 왼쪽으로!');
                    failState.logLines.push(s.round + '회차: arr[' + s.mid + ']=' + cmp + ' (lo=' + s.newLo + ', hi=' + s.newHi + ')');
                    if (s.newLo > s.newHi) {
                        failMsg.innerHTML = 'lo=' + s.newLo + ' > hi=' + s.newHi + ' → <strong>범위가 사라질 예정!</strong>';
                    } else {
                        failMsg.textContent = '범위가 [' + s.newLo + '~' + s.newHi + ']로 좁혀졌습니다. Step을 눌러 계속 진행하세요.';
                    }
                }
                failLog.innerHTML = failState.logLines.join('<br>');
                failLog.scrollTop = failLog.scrollHeight;
            }

            function failReset() {
                failState = { steps: [], stepIdx: -1, logLines: [], target: parseInt(failTargetInput.value) || 6 };
                renderFailArr(0, FAIL_ARR.length - 1, -1, false);
                failPointers.innerHTML = '';
                failLog.innerHTML = '';
                failMsg.textContent = 'target에 배열에 없는 값(예: 6, 4, 0)을 넣고 Step을 눌러보세요!';
            }

            renderFailArr(0, FAIL_ARR.length - 1, -1, false);
            failStepBtn.addEventListener('click', failStep);
            failResetBtn.addEventListener('click', failReset);
        })();

        // ── Demo 2: 크기 비교 (슬라이더) ──
        (function() {
            var slider = container.querySelector('#bs-demo-speed-slider');
            var nLabel = container.querySelector('#bs-demo-speed-n');
            var linearBar = container.querySelector('#bs-demo-speed-linear-bar');
            var binaryBar = container.querySelector('#bs-demo-speed-binary-bar');
            var linearCount = container.querySelector('#bs-demo-speed-linear-count');
            var binaryCount = container.querySelector('#bs-demo-speed-binary-count');
            var speedMsg = container.querySelector('#bs-demo-speed-msg');
            if (!slider) return;

            function formatNum(n) {
                if (n >= 1e9) return (n / 1e9).toFixed(1) + '억';
                if (n >= 1e8) return (n / 1e8).toFixed(1) + '억';
                if (n >= 1e4) return (n / 1e4).toFixed(0) + '만';
                if (n >= 1e3) return n.toLocaleString();
                return '' + n;
            }

            function updateSpeedChart() {
                var exp = parseInt(slider.value);
                var N = Math.pow(2, exp);
                var logN = exp;
                nLabel.textContent = formatNum(N) + ' (2^' + exp + ')';

                // Linear bar height: always 100% (it's the baseline)
                // Binary bar height: proportional to logN/N
                linearBar.style.height = '100%';
                // Scale binary bar relative: logN vs N. Min 1px visible.
                var binaryPct = Math.max((logN / N) * 100, 0.5);
                binaryBar.style.height = binaryPct + '%';

                linearCount.textContent = formatNum(N) + '번';
                binaryCount.textContent = logN + '번';

                var ratio = Math.floor(N / logN);
                if (exp <= 3) {
                    speedMsg.textContent = 'N=' + N + '일 때는 차이가 작습니다. 슬라이더를 오른쪽으로 더 올려보세요!';
                } else if (exp <= 15) {
                    speedMsg.innerHTML = '순차 탐색은 <strong>' + formatNum(N) + '번</strong>, 이분 탐색은 <strong>' + logN + '번</strong>. 약 <strong>' + formatNum(ratio) + '배</strong> 차이!';
                } else {
                    speedMsg.innerHTML = '<strong style="color:var(--red);">' + formatNum(N) + '번</strong> vs <strong style="color:var(--green);">' + logN + '번</strong> — 무려 <strong>' + formatNum(ratio) + '배</strong> 차이! 이것이 O(log N)의 위력입니다.';
                }
            }

            slider.addEventListener('input', updateSpeedChart);
            updateSpeedChart();
        })();

        // ── Demo 3: 매개변수 탐색 (경계 찾기) ──
        (function() {
            var WEIGHTS = [2, 4, 5, 7, 8, 10, 12, 15, 18, 20];
            var capacityInput = container.querySelector('#bs-demo-param-capacity');
            var paramStepBtn = container.querySelector('#bs-demo-param-step');
            var paramResetBtn = container.querySelector('#bs-demo-param-reset');
            var paramArrEl = container.querySelector('#bs-demo-param-arr');
            var paramPointers = container.querySelector('#bs-demo-param-pointers');
            var paramLog = container.querySelector('#bs-demo-param-log');
            var paramMsg = container.querySelector('#bs-demo-param-msg');
            var paramQuestion = container.querySelector('#bs-demo-param-question');
            if (!paramStepBtn) return;

            var paramState = { steps: [], stepIdx: -1, logLines: [], capacity: 15 };

            function paramCell(v, i, canCarry, style) {
                var label = canCarry ? '<span style="color:var(--green);font-weight:700;">YES</span>' : '<span style="color:var(--red);font-weight:700;">NO</span>';
                return '<div style="width:52px;text-align:center;padding:6px 3px;border-radius:8px;font-size:0.82rem;transition:all 0.3s;' + style + '"><div style="font-weight:600;">' + v + 'kg</div><div>' + label + '</div><div style="font-size:0.6rem;color:var(--text3);">[' + i + ']</div></div>';
            }

            function renderParamArr(capacity, lo, hi, mid, boundaryIdx) {
                paramArrEl.innerHTML = WEIGHTS.map(function(w, i) {
                    var canCarry = w <= capacity;
                    if (boundaryIdx !== -1 && i === boundaryIdx) return paramCell(w, i, canCarry, 'background:var(--green);color:white;box-shadow:0 0 10px var(--green);');
                    if (i === mid) return paramCell(w, i, canCarry, 'background:var(--yellow);color:#333;box-shadow:0 0 8px var(--yellow);');
                    if (lo !== -1 && i >= lo && i <= hi) return paramCell(w, i, canCarry, 'background:var(--accent)15;border:2px solid var(--accent);');
                    return paramCell(w, i, canCarry, 'background:var(--bg2);');
                }).join('');
            }

            function showInitialArr(capacity) {
                paramArrEl.innerHTML = WEIGHTS.map(function(w, i) {
                    var canCarry = w <= capacity;
                    var bg = canCarry ? 'background:var(--green)18;border:1.5px solid var(--green);' : 'background:var(--red)18;border:1.5px solid var(--red);';
                    return paramCell(w, i, canCarry, bg);
                }).join('');
            }

            function buildParamSteps() {
                var capacity = parseInt(capacityInput.value);
                if (isNaN(capacity) || capacity < 1) { paramMsg.textContent = '배낭 용량에 양수를 입력해주세요!'; return; }
                paramState.capacity = capacity;
                paramState.steps = [];
                paramState.stepIdx = -1;
                paramState.logLines = [];
                paramQuestion.innerHTML = '<strong>"무게 X kg을 배낭(용량 ' + capacity + 'kg)에 넣을 수 있는가?"</strong> → YES가 가능한 <strong>가장 큰 X</strong>를 찾습니다.';

                var lo = 0, hi = WEIGHTS.length - 1;
                var answer = -1;
                var round = 0;
                while (lo <= hi) {
                    var mid = Math.floor((lo + hi) / 2);
                    round++;
                    if (WEIGHTS[mid] <= capacity) {
                        answer = mid;
                        paramState.steps.push({ lo: lo, hi: hi, mid: mid, canCarry: true, round: round, newLo: mid + 1, newHi: hi });
                        lo = mid + 1;
                    } else {
                        paramState.steps.push({ lo: lo, hi: hi, mid: mid, canCarry: false, round: round, newLo: lo, newHi: mid - 1 });
                        hi = mid - 1;
                    }
                }
                paramState.steps.push({ done: true, answer: answer });
                showInitialArr(capacity);
                paramPointers.innerHTML = '';
                paramLog.innerHTML = '';
                paramMsg.textContent = 'Step을 눌러 경계 탐색을 한 단계씩 진행하세요. (' + paramState.steps.length + '단계)';
            }

            function paramStep() {
                if (paramState.steps.length === 0 || paramState.stepIdx >= paramState.steps.length - 1) {
                    buildParamSteps();
                    return;
                }
                paramState.stepIdx++;
                var s = paramState.steps[paramState.stepIdx];
                var capacity = paramState.capacity;
                if (s.done) {
                    if (s.answer === -1) {
                        renderParamArr(capacity, -1, -1, -1, -1);
                        paramState.logLines.push('<span style="color:var(--red);font-weight:700;">어떤 짐도 넣을 수 없습니다!</span>');
                        paramMsg.innerHTML = '<strong style="color:var(--red);">배낭 용량이 너무 작아 아무것도 넣을 수 없습니다.</strong>';
                    } else {
                        renderParamArr(capacity, -1, -1, -1, s.answer);
                        paramState.logLines.push('<span style="color:var(--green);font-weight:700;">경계 발견! 넣을 수 있는 가장 무거운 짐: ' + WEIGHTS[s.answer] + 'kg (인덱스 ' + s.answer + ')</span>');
                        paramMsg.innerHTML = '<strong style="color:var(--green);">YES→NO 경계를 찾았습니다!</strong> ' + WEIGHTS[s.answer] + 'kg까지 가능, ' + (s.answer + 1 < WEIGHTS.length ? WEIGHTS[s.answer + 1] + 'kg부터 불가능' : '모두 가능') + '. 이것이 매개변수 탐색!';
                    }
                    paramPointers.innerHTML = '';
                } else {
                    renderParamArr(capacity, s.lo, s.hi, s.mid, -1);
                    paramPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    if (s.canCarry) {
                        paramState.logLines.push(s.round + '회차: ' + WEIGHTS[s.mid] + 'kg <= ' + capacity + 'kg → <span style="color:var(--green);font-weight:600;">YES!</span> 더 무거운 쪽 탐색 (lo=' + s.newLo + ')');
                        paramMsg.textContent = WEIGHTS[s.mid] + 'kg은 넣을 수 있습니다! 더 무거운 것도 가능할까요? Step을 눌러보세요.';
                    } else {
                        paramState.logLines.push(s.round + '회차: ' + WEIGHTS[s.mid] + 'kg > ' + capacity + 'kg → <span style="color:var(--red);font-weight:600;">NO!</span> 더 가벼운 쪽 탐색 (hi=' + s.newHi + ')');
                        paramMsg.textContent = WEIGHTS[s.mid] + 'kg은 넣을 수 없습니다! Step을 눌러 더 가벼운 쪽으로 이동하세요.';
                    }
                }
                paramLog.innerHTML = paramState.logLines.join('<br>');
                paramLog.scrollTop = paramLog.scrollHeight;
            }

            function paramReset() {
                paramState = { steps: [], stepIdx: -1, logLines: [], capacity: parseInt(capacityInput.value) || 15 };
                showInitialArr(paramState.capacity);
                paramPointers.innerHTML = '';
                paramLog.innerHTML = '';
                paramQuestion.innerHTML = '<strong>"무게 X kg을 배낭(용량 ' + paramState.capacity + 'kg)에 넣을 수 있는가?"</strong> → YES가 가능한 <strong>가장 큰 X</strong>를 찾습니다.';
                paramMsg.textContent = '배낭 용량을 설정하고 Step을 눌러보세요!';
            }

            showInitialArr(15);
            paramQuestion.innerHTML = '<strong>"무게 X kg을 배낭(용량 15kg)에 넣을 수 있는가?"</strong> → YES가 가능한 <strong>가장 큰 X</strong>를 찾습니다.';
            paramStepBtn.addEventListener('click', paramStep);
            paramResetBtn.addEventListener('click', paramReset);
        })();
    },

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepDesc(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 &rarr;</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix) {
        var state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var prevBtn = container.querySelector('#viz-prev' + suffix);
        var nextBtn = container.querySelector('#viz-next' + suffix);
        var counter = container.querySelector('#viz-step-counter' + suffix);
        var desc = container.querySelector('#viz-step-desc' + suffix);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { counter.textContent = '시작 전'; desc.innerHTML = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { counter.textContent = (idx + 1) + ' / ' + total; desc.innerHTML = '<span>' + state.steps[idx].description + '</span>'; }
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
    // 시뮬레이션 1: 기본 이분 탐색 (boj-1920)
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
            self._createStepDesc(suffix) +
            '<div id="bs-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="bs-arr' + suffix + '" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bs-arr' + suffix);
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
                    return cell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.75;');
                }).join('');
            }
            renderArr(0, arr.length - 1, -1, -1);
            var steps = [];
            var lo = 0, hi = arr.length - 1, round = 0, found = false;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                round++;
                if (arr[mid] === target) {
                    (function(cLo, cHi, mid, round, a, t) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' == ' + t + ' → <strong style="color:var(--green);">찾았습니다!</strong> ✅',
                            action: function() { renderArr(cLo, cHi, -1, mid); },
                            undo: function() { renderArr(cLo, cHi, -1, -1); }
                        });
                    })(cLo, cHi, mid, round, arr, target);
                    found = true;
                    break;
                } else if (arr[mid] < target) {
                    (function(cLo, cHi, mid, newLo, round, a, t) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' &lt; ' + t + ' → <strong>왼쪽 절반 제거!</strong> (lo=' + newLo + ')',
                            action: function() { renderArr(newLo, cHi, mid, -1); },
                            undo: function() { renderArr(cLo, cHi, -1, -1); }
                        });
                    })(cLo, cHi, mid, mid + 1, round, arr, target);
                    lo = mid + 1;
                } else {
                    (function(cLo, cHi, mid, newHi, round, a, t) {
                        steps.push({ description: round + '회차: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' &gt; ' + t + ' → <strong>오른쪽 절반 제거!</strong> (hi=' + newHi + ')',
                            action: function() { renderArr(cLo, newHi, mid, -1); },
                            undo: function() { renderArr(cLo, cHi, -1, -1); }
                        });
                    })(cLo, cHi, mid, mid - 1, round, arr, target);
                    hi = mid - 1;
                }
            }
            if (!found) {
                (function(t) {
                    steps.push({ description: '탐색 종료: lo &gt; hi → <strong style="color:var(--red);">' + t + '은(는) 배열에 없습니다.</strong> ❌',
                        action: function() { arrEl.innerHTML = arr.map(function(v, i) { return cell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.75;'); }).join(''); },
                        undo: function() { renderArr(0, arr.length - 1, -1, -1); }
                    });
                })(target);
            }
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-basic-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // 시뮬레이션 2: Lower/Upper Bound (boj-10816)
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
            self._createStepDesc(suffix) +
            '<div id="bd-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="bd-arr' + suffix + '" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bd-arr' + suffix);
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
            // compute bisect_left
            var leftIdx = 0;
            { var blo = 0, bhi = arr.length; while (blo < bhi) { var bm = Math.floor((blo + bhi) / 2); if (arr[bm] < target) blo = bm + 1; else bhi = bm; } leftIdx = blo; }
            // compute bisect_right
            var rightIdx = 0;
            { var blo = 0, bhi = arr.length; while (blo < bhi) { var bm = Math.floor((blo + bhi) / 2); if (arr[bm] <= target) blo = bm + 1; else bhi = bm; } rightIdx = blo; }
            var count = rightIdx - leftIdx;
            var steps = [
                { description: 'bisect_left(' + target + '): ' + target + ' 이상인 첫 위치 → bisect_left = <strong>' + leftIdx + '</strong>' + (leftIdx < arr.length ? ' (arr[' + leftIdx + ']=' + arr[leftIdx] + ')' : ' (배열 끝)'),
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.75;'; } if (leftIdx < arr.length) h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); },
                  undo: function() { renderArr(null); }
                },
                { description: 'bisect_right(' + target + '): ' + target + ' 초과인 첫 위치 → bisect_right = <strong>' + rightIdx + '</strong>' + (rightIdx >= arr.length ? ' (배열 끝 다음)' : '') + '. 범위: [' + leftIdx + ', ' + rightIdx + ')',
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.75;'; } renderArr(h); },
                  undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.75;'; } if (leftIdx < arr.length) h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); }
                },
                { description: '<strong style="color:var(--green);">✅ ' + target + '의 개수 = ' + rightIdx + ' - ' + leftIdx + ' = ' + count + '개</strong>',
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;box-shadow:0 0 8px var(--green)40;'; else h[i] = 'background:var(--bg2);opacity:0.7;'; } renderArr(h); },
                  undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.75;'; } renderArr(h); }
                }
            ];
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-bound-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // 시뮬레이션 3: 랜선 자르기 (boj-1654)
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
            self._createStepDesc(suffix) +
            '<div id="cb-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="cb-bars' + suffix + '" style="margin-bottom:12px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#cb-bars' + suffix);
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
            var steps = [], lo = 1, hi = maxC, answer = 0, round = 0;
            // Step 0: 초기 탐색 범위 설명
            steps.push({
                description: '잘라낼 길이 x의 범위를 정합니다. 최소 <strong>1cm</strong>부터, 가장 긴 랜선 <strong>' + maxC + 'cm</strong>까지 가능하므로 → <strong>lo=1, hi=' + maxC + '</strong>',
                action: function() { renderBars(0); },
                undo: function() { renderBars(0); }
            });
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var count = cables.reduce(function(s, c) { return s + Math.floor(c / mid); }, 0);
                var piecesDetail = cables.map(function(c) { return c + '÷' + mid + '=' + Math.floor(c / mid); }).join(', ');
                var piecesSum = cables.map(function(c) { return Math.floor(c / mid); }).join('+');
                round++;
                // Step A: mid 계산
                (function(cLo, cHi, mid, round) {
                    steps.push({
                        description: '<strong>' + round + '회차</strong> — lo=' + cLo + ', hi=' + cHi + ' → mid = ⌊(' + cLo + '+' + cHi + ')/2⌋ = <strong>' + mid + '</strong>. 길이 ' + mid + 'cm로 잘라봅니다.',
                        action: function() { renderBars(0); },
                        undo: function() { renderBars(0); }
                    });
                })(cLo, cHi, mid, round);
                // Step B: 각 랜선 자르기
                (function(mid, piecesDetail, piecesSum, count) {
                    steps.push({
                        description: '각 랜선을 ' + mid + 'cm로 자르기: ' + piecesDetail + ' → 총 <strong>' + piecesSum + ' = ' + count + '개</strong>',
                        action: function() { renderBars(mid); },
                        undo: function() { renderBars(0); }
                    });
                })(mid, piecesDetail, piecesSum, count);
                // Step C: 판정
                if (count >= N) {
                    answer = mid; lo = mid + 1;
                    (function(mid, count, round, newLo) {
                        steps.push({
                            description: '<strong>' + count + '개</strong> ≥ ' + N + '(필요 개수) → <span style="color:var(--green);">충분하다!</span> ' + mid + 'cm는 정답 후보. 혹시 더 긴 길이도 될까? ' + mid + '은 이미 확인했으니 그 다음부터 → lo = mid+1 = ' + mid + '+1 = <strong>' + newLo + '</strong>',
                            action: function() { renderBars(mid); },
                            undo: function() { renderBars(mid); }
                        });
                    })(mid, count, round, lo);
                } else {
                    hi = mid - 1;
                    (function(mid, count, round, newHi) {
                        steps.push({
                            description: '<strong>' + count + '개</strong> &lt; ' + N + '(필요 개수) → <span style="color:var(--red);">부족하다!</span> ' + mid + 'cm는 너무 길어서 정답이 될 수 없다. ' + mid + '을 빼고 그 아래부터 → hi = mid−1 = ' + mid + '−1 = <strong>' + newHi + '</strong>',
                            action: function() { renderBars(mid); },
                            undo: function() { renderBars(mid); }
                        });
                    })(mid, count, round, hi);
                }
            }
            var fa = answer, fc = cables.reduce(function(s, c) { return s + Math.floor(c / fa); }, 0);
            steps.push({ description: 'lo &gt; hi → 탐색 종료! <strong style="color:var(--green);">✅ 정답: x = ' + fa + 'cm (' + fc + '조각 ≥ ' + N + ')</strong>',
                action: function() { renderBars(fa); },
                undo: function() { renderBars(0); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-cable-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // 시뮬레이션 4: 나무 자르기 (boj-2805)
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
            self._createStepDesc(suffix) +
            '<div id="tr-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="tr-chart' + suffix + '" style="display:flex;gap:16px;justify-content:center;align-items:flex-end;height:160px;margin-bottom:12px;position:relative;"></div>' +
            self._createStepControls(suffix);
        var chartEl = container.querySelector('#tr-chart' + suffix);
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
            var steps = [], lo = 0, hi = maxH, answer = 0, round = 0;
            // Step 0: 초기 탐색 범위 설명
            steps.push({
                description: '절단기 높이 H의 범위를 정합니다. <strong>0m</strong>(전부 자름)부터 가장 높은 나무 <strong>' + maxH + 'm</strong>까지 가능 → <strong>lo=0, hi=' + maxH + '</strong>',
                action: function() { renderTrees(-1); },
                undo: function() { renderTrees(-1); }
            });
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var gained = trees.reduce(function(s, h) { return s + Math.max(0, h - mid); }, 0);
                var gainsDetail = trees.map(function(h) { return h > mid ? h + '-' + mid + '=' + (h - mid) + 'm' : h + '-' + mid + '=0'; }).join(', ');
                var gainsSum = trees.map(function(h) { return Math.max(0, h - mid); }).join('+');
                round++;
                // Step A: mid 계산
                (function(cLo, cHi, mid, round) {
                    steps.push({
                        description: '<strong>' + round + '회차</strong> — lo=' + cLo + ', hi=' + cHi + ' → mid = ⌊(' + cLo + '+' + cHi + ')/2⌋ = <strong>' + mid + '</strong>. 높이 ' + mid + 'm로 잘라봅니다.',
                        action: function() { renderTrees(-1); },
                        undo: function() { renderTrees(-1); }
                    });
                })(cLo, cHi, mid, round);
                // Step B: 각 나무 자르기
                (function(mid, gainsDetail, gainsSum, gained) {
                    steps.push({
                        description: '각 나무를 ' + mid + 'm 높이로 자르기: ' + gainsDetail + ' → 총 <strong>' + gainsSum + ' = ' + gained + 'm</strong>',
                        action: function() { renderTrees(mid); },
                        undo: function() { renderTrees(-1); }
                    });
                })(mid, gainsDetail, gainsSum, gained);
                // Step C: 판정
                if (gained >= M) {
                    answer = mid; lo = mid + 1;
                    (function(mid, gained, round, newLo) {
                        steps.push({
                            description: '<strong>' + gained + 'm</strong> ≥ ' + M + '(필요량) → <span style="color:var(--green);">충분하다!</span> ' + mid + 'm는 정답 후보. 혹시 더 높이 잘라도 될까? ' + mid + '은 확인했으니 그 위부터 → lo = mid+1 = ' + mid + '+1 = <strong>' + newLo + '</strong>',
                            action: function() { renderTrees(mid); },
                            undo: function() { renderTrees(mid); }
                        });
                    })(mid, gained, round, lo);
                } else {
                    hi = mid - 1;
                    (function(mid, gained, round, newHi) {
                        steps.push({
                            description: '<strong>' + gained + 'm</strong> &lt; ' + M + '(필요량) → <span style="color:var(--red);">부족하다!</span> ' + mid + 'm는 너무 높아서 정답이 될 수 없다. ' + mid + '을 빼고 그 아래부터 → hi = mid−1 = ' + mid + '−1 = <strong>' + newHi + '</strong>',
                            action: function() { renderTrees(mid); },
                            undo: function() { renderTrees(mid); }
                        });
                    })(mid, gained, round, hi);
                }
            }
            var fa = answer, fg = trees.reduce(function(s, h) { return s + Math.max(0, h - fa); }, 0);
            steps.push({ description: 'lo &gt; hi → 탐색 종료! <strong style="color:var(--green);">✅ 정답: H = ' + fa + 'm (잘린 양: ' + fg + 'm ≥ ' + M + ')</strong>',
                action: function() { renderTrees(fa); },
                undo: function() { renderTrees(-1); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-tree-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // 시뮬레이션 5: 공유기 설치 (boj-2110)
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
            self._createStepDesc(suffix) +
            '<div id="rt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="rt-line' + suffix + '" style="position:relative;height:80px;margin:16px 0;"></div>' +
            self._createStepControls(suffix);
        var lineEl = container.querySelector('#rt-line' + suffix);
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
            function tryPlace(d) {
                var placed = [houses[0]], last = houses[0];
                for (var i = 1; i < houses.length; i++) {
                    if (houses[i] - last >= d) { placed.push(houses[i]); last = houses[i]; }
                }
                return placed;
            }
            var steps = [], lo = 1, hi = maxPos - houses[0], answer = 0, round = 0;
            // Step 0: 초기 탐색 범위 설명
            steps.push({
                description: '최소 거리 d의 범위를 정합니다. 최소 <strong>1</strong>부터, 가장 먼 두 집의 차이 <strong>' + maxPos + '−' + houses[0] + ' = ' + (maxPos - houses[0]) + '</strong>까지 → <strong>lo=1, hi=' + (maxPos - houses[0]) + '</strong>',
                action: function() { renderLine(0, []); },
                undo: function() { renderLine(0, []); }
            });
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var placed = tryPlace(mid);
                round++;
                // Step A: mid 계산
                (function(cLo, cHi, mid, round) {
                    steps.push({
                        description: '<strong>' + round + '회차</strong> — lo=' + cLo + ', hi=' + cHi + ' → mid = ⌊(' + cLo + '+' + cHi + ')/2⌋ = <strong>' + mid + '</strong>. 최소 거리 ' + mid + '로 설치해봅니다.',
                        action: function() { renderLine(0, []); },
                        undo: function() { renderLine(0, []); }
                    });
                })(cLo, cHi, mid, round);
                // Step B: 배치 시뮬레이션
                (function(mid, placed) {
                    steps.push({
                        description: '거리 ' + mid + ' 이상 간격으로 배치: [' + placed.join(', ') + '] → 총 <strong>' + placed.length + '개</strong> 설치',
                        action: function() { renderLine(mid, placed); },
                        undo: function() { renderLine(0, []); }
                    });
                })(mid, placed);
                // Step C: 판정
                if (placed.length >= C) {
                    answer = mid; lo = mid + 1;
                    (function(mid, placed, round, newLo) {
                        steps.push({
                            description: '<strong>' + placed.length + '개</strong> ≥ ' + C + '(필요 개수) → <span style="color:var(--green);">충분하다!</span> 거리 ' + mid + '는 정답 후보. 혹시 더 넓게도 가능할까? ' + mid + '은 확인했으니 그 위부터 → lo = mid+1 = ' + mid + '+1 = <strong>' + newLo + '</strong>',
                            action: function() { renderLine(mid, placed); },
                            undo: function() { renderLine(mid, placed); }
                        });
                    })(mid, placed, round, lo);
                } else {
                    hi = mid - 1;
                    (function(mid, placed, round, newHi) {
                        steps.push({
                            description: '<strong>' + placed.length + '개</strong> &lt; ' + C + '(필요 개수) → <span style="color:var(--red);">부족하다!</span> 거리 ' + mid + '는 너무 커서 정답이 될 수 없다. ' + mid + '을 빼고 그 아래부터 → hi = mid−1 = ' + mid + '−1 = <strong>' + newHi + '</strong>',
                            action: function() { renderLine(mid, placed); },
                            undo: function() { renderLine(mid, placed); }
                        });
                    })(mid, placed, round, hi);
                }
            }
            var fp = tryPlace(answer);
            steps.push({ description: 'lo &gt; hi → 탐색 종료! <strong style="color:var(--green);">✅ 정답: d = ' + answer + ' (설치: [' + fp.join(', ') + '])</strong>',
                action: function() { renderLine(answer, fp); },
                undo: function() { renderLine(0, []); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-router-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // 시뮬레이션 6: K번째 수 (boj-1300)
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
            self._createStepDesc(suffix) +
            '<div id="kt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="kt-table' + suffix + '" style="margin-bottom:12px;"></div>' +
            self._createStepControls(suffix);
        var tableEl = container.querySelector('#kt-table' + suffix);
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
            var steps = [], lo = 1, hi = k, round = 0;
            // Step 0: 초기 탐색 범위 설명
            steps.push({
                description: '정답 x의 범위를 정합니다. 최소 <strong>1</strong>부터, K번째이므로 최대 <strong>' + k + '</strong>까지 가능 → <strong>lo=1, hi=' + k + '</strong>',
                action: function() { renderTable(-1); },
                undo: function() { renderTable(-1); }
            });
            while (lo < hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var cnt = 0;
                var cntDetail = [];
                for (var i = 1; i <= N; i++) {
                    var rowCnt = Math.min(Math.floor(mid / i), N);
                    cntDetail.push('min(⌊' + mid + '÷' + i + '⌋,' + N + ')=' + rowCnt);
                    cnt += rowCnt;
                }
                var cntSum = [];
                for (var i = 1; i <= N; i++) cntSum.push(Math.min(Math.floor(mid / i), N));
                round++;
                // Step A: mid 계산
                (function(cLo, cHi, mid, round) {
                    steps.push({
                        description: '<strong>' + round + '회차</strong> — lo=' + cLo + ', hi=' + cHi + ' → mid = ⌊(' + cLo + '+' + cHi + ')/2⌋ = <strong>' + mid + '</strong>.',
                        action: function() { renderTable(-1); },
                        undo: function() { renderTable(-1); }
                    });
                })(cLo, cHi, mid, round);
                // Step B: x=mid 이하인 수 세기
                (function(mid, cntDetail, cntSum, cnt) {
                    steps.push({
                        description: 'x=' + mid + ' 이하인 수 세기: ' + cntDetail.join(', ') + ' → 총 <strong>' + cntSum.join('+') + ' = ' + cnt + '개</strong>',
                        action: function() { renderTable(mid); },
                        undo: function() { renderTable(-1); }
                    });
                })(mid, cntDetail, cntSum, cnt);
                // Step C: 판정
                if (cnt >= k) {
                    hi = mid;
                    (function(mid, cnt, round) {
                        steps.push({
                            description: '<strong>' + cnt + '개</strong> ≥ ' + k + '(K) → <span style="color:var(--green);">충분하다!</span> 정답은 ' + mid + ' 이하에 있다. ' + mid + '도 정답일 수 있으니 포함해서 → hi = mid = <strong>' + mid + '</strong>',
                            action: function() { renderTable(mid); },
                            undo: function() { renderTable(mid); }
                        });
                    })(mid, cnt, round);
                } else {
                    lo = mid + 1;
                    (function(mid, cnt, round, newLo) {
                        steps.push({
                            description: '<strong>' + cnt + '개</strong> &lt; ' + k + '(K) → <span style="color:var(--red);">부족하다!</span> 정답은 ' + mid + '보다 크다. ' + mid + '은 정답이 될 수 없으니 그 위부터 → lo = mid+1 = ' + mid + '+1 = <strong>' + newLo + '</strong>',
                            action: function() { renderTable(mid); },
                            undo: function() { renderTable(mid); }
                        });
                    })(mid, cnt, round, lo);
                }
            }
            steps.push({ description: 'lo ≥ hi → 탐색 종료! <strong style="color:var(--green);">✅ 정답: ' + k + '번째 수 = ' + lo + '</strong>',
                action: function() { renderTable(lo); },
                undo: function() { renderTable(-1); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-kth-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // 시뮬레이션 7: LIS (boj-12015)
    // ====================================================================
    _renderVizLIS(container) {
        var self = this, suffix = '-lis';
        var DEFAULT_A = [10, 20, 10, 30, 20, 50];
        var BOX_W = 52, BOX_GAP = 6;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">LIS + 이분 탐색</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">수열: <input type="text" id="bs-lis-arr" value="' + DEFAULT_A.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="bs-lis-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="lis-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div style="position:relative;">' +
                '<div style="margin-bottom:8px;"><strong>원본 수열</strong></div>' +
                '<div id="lis-arr' + suffix + '" style="display:flex;gap:' + BOX_GAP + 'px;margin-bottom:24px;position:relative;"></div>' +
                '<div style="margin-bottom:8px;"><strong>tails 배열</strong></div>' +
                '<div id="lis-tails' + suffix + '" style="display:flex;gap:' + BOX_GAP + 'px;margin-bottom:12px;min-height:48px;position:relative;"></div>' +
                '<div id="lis-flying' + suffix + '" style="position:absolute;top:0;left:0;pointer-events:none;z-index:10;"></div>' +
            '</div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#lis-arr' + suffix);
        var tailsEl = container.querySelector('#lis-tails' + suffix);
        var flyEl = container.querySelector('#lis-flying' + suffix);
        var descEl = container.querySelector('#lis-desc' + suffix);
        var wrapEl = flyEl.parentElement;
        function boxHtml(v, hl, id) {
            return '<div' + (id ? ' id="' + id + '"' : '') + ' style="width:' + BOX_W + 'px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:600;transition:opacity 0.3s,background 0.3s,transform 0.3s;' + (hl || 'background:var(--bg2);') + '">' + v + '</div>';
        }
        function rebuild() {
            var A = container.querySelector('#bs-lis-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (A.length === 0) A = DEFAULT_A.slice();
            descEl.innerHTML = '수열: [' + A.join(', ') + ']. tails 배열을 이분 탐색으로 구축합니다.';
            // 배열/tails 렌더링 (애니 없이 즉시)
            function renderArr(curIdx) {
                arrEl.innerHTML = A.map(function(v, i) {
                    if (i === curIdx) return boxHtml(v, 'background:var(--accent);color:white;', 'lis-a-' + i);
                    if (curIdx >= 0 && i < curIdx) return boxHtml(v, 'background:var(--bg2);opacity:0.7;', 'lis-a-' + i);
                    return boxHtml(v, 'background:var(--bg2);', 'lis-a-' + i);
                }).join('');
            }
            function renderTails(tails, hlIdx) {
                if (tails.length === 0) { tailsEl.innerHTML = '<div style="color:var(--text3);padding:10px;">비어있음</div>'; return; }
                tailsEl.innerHTML = tails.map(function(v, i) {
                    if (i === hlIdx) return boxHtml(v, 'background:var(--green);color:white;', 'lis-t-' + i);
                    return boxHtml(v, 'background:var(--green)20;border:2px solid var(--green);', 'lis-t-' + i);
                }).join('');
            }
            // 이동 애니메이션: srcEl 위치에서 destEl 위치로 복제 요소가 날아감
            function animateMove(value, srcId, destId, color, onDone) {
                var srcEl = container.querySelector('#' + srcId);
                var wrapRect = wrapEl.getBoundingClientRect();
                if (!srcEl) { if (onDone) onDone(); return; }
                var srcRect = srcEl.getBoundingClientRect();
                var ghost = document.createElement('div');
                ghost.textContent = value;
                ghost.style.cssText = 'position:absolute;width:' + BOX_W + 'px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:700;font-size:inherit;z-index:20;' +
                    'background:' + color + ';color:white;box-shadow:0 4px 20px ' + color + '60;' +
                    'left:' + (srcRect.left - wrapRect.left) + 'px;top:' + (srcRect.top - wrapRect.top) + 'px;' +
                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s;transform:scale(1.15);';
                flyEl.appendChild(ghost);
                // 도착점 계산 (destId가 아직 없으면 tails 끝 위치 추정)
                requestAnimationFrame(function() {
                    var destEl = container.querySelector('#' + destId);
                    var destLeft, destTop;
                    if (destEl) {
                        var destRect = destEl.getBoundingClientRect();
                        destLeft = destRect.left - wrapRect.left;
                        destTop = destRect.top - wrapRect.top;
                    } else {
                        // tails 배열 끝에 추가되는 경우: tailsEl 기준으로 계산
                        var tailsRect = tailsEl.getBoundingClientRect();
                        var tailsChildren = tailsEl.children.length;
                        destLeft = tailsRect.left - wrapRect.left + tailsChildren * (BOX_W + BOX_GAP);
                        destTop = tailsRect.top - wrapRect.top;
                    }
                    requestAnimationFrame(function() {
                        ghost.style.left = destLeft + 'px';
                        ghost.style.top = destTop + 'px';
                        ghost.style.transform = 'scale(1)';
                    });
                    setTimeout(function() {
                        if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                        if (onDone) onDone();
                    }, 550);
                });
            }
            renderArr(-1);
            renderTails([], -1);
            var steps = [], tails = [];
            A.forEach(function(x, idx) {
                var prevTails = tails.slice();
                var pos = 0, lo2 = 0, hi2 = tails.length;
                while (lo2 < hi2) { var m = Math.floor((lo2 + hi2) / 2); if (tails[m] < x) lo2 = m + 1; else hi2 = m; }
                pos = lo2;
                if (pos === tails.length) {
                    tails.push(x);
                    var newTails = tails.slice();
                    (function(idx, x, pos, prevTails, newTails) {
                        steps.push({
                            description: 'A[' + idx + ']=' + x + ': ' + x + ' &gt; tails 끝 → <strong>append!</strong> tails=[' + newTails.join(',') + '] (길이 ' + newTails.length + ')',
                            action: function(dir) {
                                flyEl.innerHTML = '';
                                renderArr(idx);
                                if (dir === 'forward') {
                                    renderTails(prevTails, -1);
                                    animateMove(x, 'lis-a-' + idx, 'lis-t-' + pos, 'var(--green)', function() {
                                        renderTails(newTails, pos);
                                    });
                                } else {
                                    renderTails(newTails, pos);
                                }
                            },
                            undo: function() { flyEl.innerHTML = ''; renderArr(-1); renderTails(prevTails, -1); }
                        });
                    })(idx, x, pos, prevTails, newTails);
                } else {
                    tails[pos] = x;
                    var newTails = tails.slice();
                    (function(idx, x, pos, prevTails, newTails) {
                        steps.push({
                            description: 'A[' + idx + ']=' + x + ': bisect_left → pos=' + pos + ', tails[' + pos + ']를 ' + x + '로 <strong>교체!</strong> tails=[' + newTails.join(',') + ']',
                            action: function(dir) {
                                flyEl.innerHTML = '';
                                renderArr(idx);
                                if (dir === 'forward') {
                                    renderTails(prevTails, pos);
                                    animateMove(x, 'lis-a-' + idx, 'lis-t-' + pos, 'var(--accent)', function() {
                                        renderTails(newTails, pos);
                                    });
                                } else {
                                    renderTails(newTails, pos);
                                }
                            },
                            undo: function() { flyEl.innerHTML = ''; renderArr(-1); renderTails(prevTails, -1); }
                        });
                    })(idx, x, pos, prevTails, newTails);
                }
            });
            var ft = tails.slice();
            steps.push({ description: '<strong style="color:var(--green);">✅ LIS 길이 = ' + ft.length + ' (tails=[' + ft.join(',') + '])</strong>',
                action: function() { flyEl.innerHTML = ''; renderArr(A.length); renderTails(ft, -1); },
                undo: function() { flyEl.innerHTML = ''; renderArr(-1); renderTails(ft, -1); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-lis-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정수 A[1], A[2], …, A[N]이 주어져 있을 때, 이 안에 X라는 정수가 존재하는지 알아내는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 자연수 N(1 ≤ N ≤ 100,000)이 주어진다. 다음 줄에는 N개의 정수 A[1], A[2], …, A[N]이 주어진다. 다음 줄에는 M(1 ≤ M ≤ 100,000)이 주어진다. 다음 줄에는 M개의 수들이 주어지는데, 이 수들이 A안에 존재하는지 알아내면 된다. 모든 정수의 범위는 -2<sup>31</sup> 보다 크거나 같고 2<sup>31</sup>보다 작다.</p>
                <h4>출력</h4>
                <p>M개의 줄에 답을 출력한다. 존재하면 1을, 존재하지 않으면 0을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5\n4 1 5 2 3\n5\n1 3 7 9 5</pre></div>
                    <div><strong>출력</strong><pre>1\n1\n0\n0\n1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>-2<sup>31</sup> ≤ 원소 ≤ 2<sup>31</sup></li>
                    <li>1 ≤ M ≤ 100,000</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '각 질문마다 배열을 <strong>처음부터 끝까지 훑으면서</strong> 같은 수가 있는지 확인하면 되겠지?<br>M개의 질문 × N개의 원소를 하나씩 비교 → 이중 반복문으로 해결!' },
                { title: '근데 이러면 문제가 있어', content: 'N, M이 최대 <strong>100,000</strong>이야. 최악의 경우 100,000 × 100,000 = <strong>100억 번</strong> 비교해야 해.<br>시간 제한 안에 절대 못 끝나! O(N × M)은 너무 느려.<br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:40px;height:120px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.75rem;color:var(--text2);margin-top:4px;">O(NM)<br>100억</div></div><div style="text-align:center;"><div style="width:40px;height:20px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.75rem;color:var(--text2);margin-top:4px;">O(MlogN)<br>170만</div></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '배열을 <strong>미리 정렬</strong>해두면? 정렬된 배열에서는 <strong>이분 탐색</strong>으로 한 번에 절반씩 범위를 줄일 수 있어!<br>한 번의 탐색이 O(log N)이니까, M개 질문 전체가 O(M log N). 정렬 O(N log N)까지 합쳐도 <strong>O((N+M) log N)</strong>으로 충분해.' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python: <code>bisect_left(A, x)</code>로 x가 들어갈 위치를 찾고, 그 위치의 값이 x와 같은지 확인하면 끝!</span><span class="lang-cpp">C++: <code>binary_search(A, A+N, x)</code>로 한 줄이면 존재 여부를 바로 판별할 수 있어! 또는 <code>lower_bound()</code>로 위치를 찾아서 비교해도 돼.</span>' }
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
                <h3>문제</h3>
                <p>숫자 카드는 정수 하나가 적혀져 있는 카드이다. 상근이는 숫자 카드 N개를 가지고 있다. 정수 M개가 주어졌을 때, 이 수가 적혀있는 숫자 카드를 상근이가 몇 개 가지고 있는지 구하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 숫자 카드의 개수 N(1 ≤ N ≤ 500,000)이 주어진다. 둘째 줄에는 숫자 카드에 적혀있는 정수가 주어진다. 숫자 카드에 적혀있는 수는 -10,000,000보다 크거나 같고, 10,000,000보다 작거나 같다. 셋째 줄에는 M(1 ≤ M ≤ 500,000)이 주어진다. 넷째 줄에는 상근이가 몇 개 가지고 있는 숫자 카드인지 구해야 할 M개의 정수가 주어지며, 이 수는 공백으로 구분되어져 있다. 이 수도 -10,000,000보다 크거나 같고, 10,000,000보다 작거나 같다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 입력으로 주어진 M개의 수에 대해서, 각 수가 적힌 숫자 카드를 상근이가 몇 개 가지고 있는지를 공백으로 구분해 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>10\n6 3 2 10 10 10 -10 -10 7 3\n8\n10 9 -5 2 3 4 5 -10</pre></div>
                    <div><strong>출력</strong><pre>3 0 0 1 2 0 0 2</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 500,000</li>
                    <li>1 ≤ M ≤ 500,000</li>
                    <li>-10<sup>7</sup> ≤ 카드 값 ≤ 10<sup>7</sup></li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '각 질문마다 카드 배열을 <strong>처음부터 끝까지 돌면서</strong> 같은 숫자가 몇 개인지 세면 되겠지?<br>간단한 반복문 하나면 개수를 셀 수 있어!' },
                { title: '근데 이러면 문제가 있어', content: 'N, M이 최대 <strong>500,000</strong>이야. 매 질문마다 50만 개를 순회하면 500,000 × 500,000 = <strong>2,500억 번</strong>!<br>O(N × M)은 시간 초과 확정이야.' },
                { title: '이렇게 하면 어떨까?', content: '배열을 <strong>정렬</strong>하면 같은 숫자가 <strong>연속으로 모여</strong> 있잖아!<br>그러면 "x가 시작하는 위치"와 "x가 끝나는 다음 위치"만 찾으면 개수 = 끝 위치 - 시작 위치야.<br>이 두 위치를 이분 탐색으로 찾으면 각각 O(log N)이니까 전체 <strong>O((N+M) log N)</strong>으로 충분해!<br><br><div style="display:flex;gap:3px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;flex-wrap:wrap;"><span style="padding:3px 8px;background:var(--bg2);border-radius:4px;">2</span><span style="padding:3px 8px;background:var(--bg2);border-radius:4px;">3</span><span style="padding:3px 8px;background:var(--bg2);border-radius:4px;">3</span><span style="padding:3px 8px;border:2px solid var(--accent);border-radius:4px;font-weight:700;">10</span><span style="padding:3px 8px;border:2px solid var(--accent);border-radius:4px;font-weight:700;">10</span><span style="padding:3px 8px;border:2px solid var(--accent);border-radius:4px;font-weight:700;">10</span><span style="padding:3px 8px;background:var(--bg2);border-radius:4px;">11</span><span style="margin:0 4px;color:var(--text3);font-size:0.75rem;">↑L &nbsp; &nbsp; &nbsp; ↑R</span><span style="color:var(--accent);font-weight:600;margin-left:6px;">R - L = 3개!</span></div>' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python: <code>bisect_right(cards, x) - bisect_left(cards, x)</code> 한 줄이면 x의 개수를 바로 구할 수 있어!<br><code>bisect_left</code>는 x가 시작하는 위치, <code>bisect_right</code>는 x 다음 값이 시작하는 위치를 알려줘.</span><span class="lang-cpp">C++: <code>upper_bound(cards, cards+N, x) - lower_bound(cards, cards+N, x)</code>로 동일하게 구간 길이를 구할 수 있어!<br><code>lower_bound</code>는 x 이상 첫 위치, <code>upper_bound</code>는 x 초과 첫 위치를 반환해.</span>' }
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
                <h3>문제</h3>
                <p>집에서 시간을 보내던 오영식은 이미 가지고 있는 K개의 랜선을 잘라서 N개의 같은 길이의 랜선을 만들려고 한다. 편의를 위해 랜선을 자르거나 만들 때 손실되는 길이는 없다고 가정하며, 기존의 K개의 랜선으로 N개의 랜선을 만들 수 없는 경우는 없다고 가정하자. N개보다 많이 만드는 것도 N개를 만드는 것에 포함된다. 만들 수 있는 최대 랜선의 길이를 구하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에는 오영식이 이미 가지고 있는 랜선의 개수 K, 그리고 필요한 랜선의 개수 N이 입력된다. K는 1이상 10,000이하의 정수이고, N은 1이상 1,000,000이하의 정수이다. 그리고 항상 K ≤ N 이다. 그 후 K줄에 걸쳐 이미 가지고 있는 각 랜선의 길이가 센티미터 단위의 정수로 입력된다. 랜선의 길이는 2<sup>31</sup>-1보다 작거나 같은 자연수이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 N개를 만들 수 있는 랜선의 최대 길이를 센티미터 단위의 정수로 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 11\n802\n743\n457\n539</pre></div>
                    <div><strong>출력</strong><pre>200</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ K ≤ 10,000</li>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>랜선 길이는 2<sup>31</sup> - 1 이하의 자연수</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '길이를 1cm부터 시작해서 1씩 늘려가면서, 그 길이로 잘랐을 때 N개 이상 만들 수 있는지 확인하면 되지 않을까?<br>가능한 가장 긴 길이를 찾을 때까지 반복!' },
                { title: '근데 이러면 문제가 있어', content: '랜선 길이가 최대 <strong>2<sup>31</sup> - 1</strong> (약 21억)이야. 1부터 21억까지 하나씩 다 시도하면?<br>최악의 경우 21억 번 × K개 랜선 확인 = <strong>수십억 번 연산</strong>... 시간 초과야!' },
                { title: '이렇게 하면 어떨까?', content: '"길이 x로 잘랐을 때 N개 이상 만들 수 있는가?" — 이 질문의 답은 x가 작으면 YES, 커지면 어느 순간 NO로 바뀌어.<br>이런 <strong>단조성</strong>이 있으면 <strong>이분 탐색(매개변수 탐색)</strong>으로 경계를 찾을 수 있어!<br>lo=1, hi=max(랜선)으로 범위를 잡고, mid로 잘랐을 때 개수 = sum(각 랜선 // mid).<br>N개 이상이면 더 긴 길이를 시도(lo=mid+1), 부족하면 줄여(hi=mid-1).<br>⚠️ <strong>lo=0이면 0으로 나누기 에러!</strong> 반드시 lo=1부터 시작해야 해.<br><br><div style="display:flex;gap:2px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.8rem;flex-wrap:wrap;"><span style="padding:2px 6px;background:var(--green);color:white;border-radius:3px;">YES</span><span style="padding:2px 6px;background:var(--green);color:white;border-radius:3px;">YES</span><span style="padding:2px 6px;background:var(--green);color:white;border-radius:3px;">YES</span><span style="padding:2px 6px;background:var(--yellow);color:#333;border-radius:3px;font-weight:700;border:2px solid var(--accent);">YES</span><span style="padding:2px 6px;background:var(--red);color:white;border-radius:3px;opacity:0.7;">NO</span><span style="padding:2px 6px;background:var(--red);color:white;border-radius:3px;opacity:0.7;">NO</span><span style="padding:2px 6px;background:var(--red);color:white;border-radius:3px;opacity:0.7;">NO</span><span style="color:var(--text3);margin-left:4px;">← 경계를 이분 탐색!</span></div>' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python: <code>sum(c // mid for c in cables)</code>로 한 줄에 개수를 셀 수 있어. 정수 나눗셈 <code>//</code>가 핵심!</span><span class="lang-cpp">C++: 랜선 길이가 2<sup>31</sup>-1까지이므로 <code>long long</code>을 써야 해. <code>for</code>문으로 <code>cables[i] / mid</code>를 누적하면 돼.</span>' }
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
                <h3>문제</h3>
                <p>상근이는 나무 M 미터가 필요하다. 절단기에 높이 H를 지정하면 한 줄에 연속해있는 나무를 모두 높이 H 위의 부분이 잘린다. H보다 작은 나무는 잘리지 않는다. 적어도 M 미터의 나무를 집에 가져가기 위해서 절단기에 설정할 수 있는 높이의 최댓값을 구하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 나무의 수 N과 상근이가 집으로 가져가려고 하는 나무의 길이 M이 주어진다. (1 ≤ N ≤ 1,000,000, 1 ≤ M ≤ 2,000,000,000)</p>
                <p>둘째 줄에는 나무의 높이가 주어진다. 나무의 높이의 합은 항상 M보다 크거나 같으므로, 상근이는 집에 필요한 나무를 항상 가져갈 수 있다. 높이는 1,000,000,000보다 작거나 같은 양의 정수 또는 0이다.</p>
                <h4>출력</h4>
                <p>적어도 M미터의 나무를 집에 가져가기 위해서 절단기에 설정할 수 있는 높이의 최댓값을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 7\n20 15 10 17</pre></div>
                    <div><strong>출력</strong><pre>15</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 20\n4 42 40 26 46</pre></div>
                    <div><strong>출력</strong><pre>36</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>1 ≤ M ≤ 2,000,000,000</li>
                    <li>0 ≤ 나무 높이 ≤ 1,000,000,000</li>
                    <li>M은 항상 나무를 잘라서 얻을 수 있는 양</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '절단기 높이를 0부터 시작해서 1씩 올려가면서, 그 높이로 잘랐을 때 나무를 M미터 이상 얻을 수 있는지 확인하면 되지 않을까?<br>각 나무에서 <code>max(0, 나무높이 - H)</code>만큼 가져갈 수 있으니까, 전부 더하면 총 획득량이야.' },
                { title: '근데 이러면 문제가 있어', content: '나무 높이가 최대 <strong>10억</strong>이야! 높이를 0부터 10억까지 1씩 올려가면 최악의 경우 <strong>10억 번</strong> × N개 나무 확인...<br>N도 최대 100만이라 연산 횟수가 어마어마해. 시간 초과 확정이야!<br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:40px;height:100px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">순차탐색<br>10억×N</div></div><div style="text-align:center;"><div style="width:40px;height:12px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">이분탐색<br>30×N</div></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '랜선 자르기와 같은 패턴이야! "높이 H로 잘랐을 때 M미터 이상 얻을 수 있는가?"<br>H가 낮으면 많이 얻고(YES), H가 높으면 적게 얻어(NO) — <strong>단조성</strong>이 있지!<br>이분 탐색으로 lo=0, hi=max(나무)에서 시작. mid 높이로 잘랐을 때 합계 = sum(max(0, tree - mid)).<br>M 이상이면 더 높이 시도(lo=mid+1), 부족하면 낮춰(hi=mid-1).<br>⚠️ <span class="lang-py">Python은 정수 오버플로우가 없지만,</span><span class="lang-cpp">C++에서는 나무 합계가 <strong>int 범위를 넘을 수 있으므로 long long</strong>을 써야 해!</span>' }
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
                <h3>문제</h3>
                <p>도현이의 집 N개가 수직선 위에 있다. 집의 좌표가 주어졌을 때, C개의 공유기를 설치하려고 한다. 가장 인접한 두 공유기 사이의 거리를 가능한 한 크게 하여 설치하려고 할 때, 가장 인접한 두 공유기 사이의 최대 거리를 출력하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 집의 개수 N (2 ≤ N ≤ 200,000)과 공유기의 개수 C (2 ≤ C ≤ N)이 하나 이상의 빈 칸을 사이에 두고 주어진다. 둘째 줄부터 N개의 줄에는 집의 좌표를 나타내는 x<sub>i</sub> (0 ≤ x<sub>i</sub> ≤ 1,000,000,000)가 한 줄에 하나씩 주어진다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 가장 인접한 두 공유기 사이의 최대 거리를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 3\n1\n2\n8\n4\n9</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div><p class="example-explain">1, 4, 8에 설치하면 가장 인접한 거리는 3.</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>2 ≤ N ≤ 200,000</li>
                    <li>2 ≤ C ≤ N</li>
                    <li>0 ≤ 좌표 ≤ 1,000,000,000</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: 'N개 집 중에서 C개를 골라서 공유기를 설치하는 <strong>모든 조합</strong>을 시도해볼까?<br>각 조합마다 가장 인접한 두 공유기 거리를 구하고, 그 중 최대를 찾으면 되잖아!' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 <strong>200,000</strong>이야. N개 중 C개를 고르는 조합 수는... 상상을 초월해!<br>예를 들어 200,000개 중 100,000개를 고르는 경우의 수? <strong>절대 불가능</strong>한 수준이야.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><span style="color:var(--red);font-weight:600;">조합:</span> <span style="color:var(--text2);">C(200000, 100000) = ∞ 수준</span></div><div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap;"><span style="color:var(--green);font-weight:600;">매개변수 탐색:</span> <span style="color:var(--text);">O(N log D) ≈ 수백만</span></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '발상을 전환하자! 조합을 시도하는 대신, <strong>"최소 거리가 d 이상이 되도록 C개를 설치할 수 있는가?"</strong>를 물어보는 거야.<br>판별법은 간단해: 집을 정렬하고, 첫 집에 설치한 뒤 d 이상 떨어진 다음 집에 <strong>그리디하게</strong> 설치를 반복해.<br>설치 수 &ge; C면 가능! 가능하면 더 넓은 거리를 시도(lo=mid+1), 불가능하면 줄여(hi=mid-1).<br>범위: lo=1, hi=가장 먼 두 집 사이 거리.' },
                { title: 'Python/C++에선 이렇게!', content: '핵심은 정렬 후 그리디 판별 함수를 만드는 거야:<br><span class="lang-py">Python: 정렬 후 <code>for</code>문으로 순회하면서 <code>houses[i] - last &gt;= mid</code>이면 설치하고 <code>last</code>를 갱신해.</span><span class="lang-cpp">C++: 동일한 로직인데, 좌표가 최대 10억이므로 거리 계산 시 <code>long long</code>을 사용하면 안전해.</span>' }
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
                <h3>문제</h3>
                <p>세준이는 크기가 N×N인 배열 A를 만들었다. 배열에 들어있는 수 A[i][j] = i × j 이다. 이 수를 일차원 배열 B에 넣으면 B의 크기는 N×N이 된다. B를 오름차순 정렬했을 때, B[k]를 구해보자. 배열 A와 B의 인덱스는 1부터 시작한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 배열의 크기 N이 주어진다. N은 10<sup>5</sup>보다 작거나 같은 자연수이다. 둘째 줄에 k가 주어진다. k는 min(10<sup>9</sup>, N<sup>2</sup>)보다 작거나 같은 자연수이다.</p>
                <h4>출력</h4>
                <p>B[k]를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3\n7</pre></div>
                    <div><strong>출력</strong><pre>6</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 10<sup>5</sup></li>
                    <li>1 ≤ k ≤ min(10<sup>9</sup>, N<sup>2</sup>)</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: 'N×N 곱셈표의 모든 값을 배열에 넣고 <strong>정렬</strong>한 다음, k번째를 꺼내면 되지 않을까?<br>A[i][j] = i × j이니까, 이중 반복문으로 N² 개를 전부 만들어서 정렬하면 끝!' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 <strong>10<sup>5</sup></strong>이야. N² = <strong>10<sup>10</sup></strong>(100억) 개의 수를 배열에 담으면?<br>메모리도 수십 GB 필요하고, 정렬은 더 오래 걸려. <strong>메모리 초과 + 시간 초과</strong> 모두야!<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;"><table style="border-collapse:collapse;width:100%;"><tr><td style="padding:4px 8px;color:var(--text2);">방법</td><td style="padding:4px 8px;color:var(--text2);">시간</td><td style="padding:4px 8px;color:var(--text2);">메모리</td></tr><tr><td style="padding:4px 8px;color:var(--red);font-weight:600;">전부 정렬</td><td style="padding:4px 8px;">O(N² log N²)</td><td style="padding:4px 8px;">수십 GB</td></tr><tr><td style="padding:4px 8px;color:var(--green);font-weight:600;">이분 탐색</td><td style="padding:4px 8px;">O(N log k)</td><td style="padding:4px 8px;">O(1)</td></tr></table></div>' },
                { title: '이렇게 하면 어떨까?', content: '모든 값을 만들 필요 없이, <strong>"x 이하인 수가 몇 개인가?"</strong>만 빠르게 셀 수 있으면 돼!<br>i행에서 i×j &le; x인 j의 개수 = min(x &divide; i, N). 이걸 i = 1부터 N까지 더하면 O(N)에 "x 이하 개수"를 알 수 있어.<br>그러면 <strong>"x 이하인 수가 k개 이상인 최소 x"</strong>를 이분 탐색으로 찾으면 그게 답이야!<br>범위: lo=1, hi=k (k번째 수는 항상 k 이하). <code>count &ge; k</code>이면 hi=mid, 아니면 lo=mid+1 (lower_bound 형태).' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python: <code>count = sum(min(mid // i, N) for i in range(1, N+1))</code> 한 줄이면 x 이하 개수를 셀 수 있어!</span><span class="lang-cpp">C++: <code>for (ll i = 1; i &lt;= N; i++) count += min(mid / i, N);</code>로 동일하게 구현. N, k가 크므로 <code>long long</code>을 사용해야 해.</span>' }
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
                <h3>문제</h3>
                <p>수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열을 구하는 프로그램을 작성하시오. 예를 들어, 수열 A = {10, 20, 10, 30, 20, 50} 인 경우에 가장 긴 증가하는 부분 수열은 A = {<strong>10</strong>, <strong>20</strong>, 10, <strong>30</strong>, 20, <strong>50</strong>} 이고, 길이는 4이다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 수열 A의 크기 N (1 ≤ N ≤ 1,000,000)이 주어진다. 둘째 줄에는 수열 A를 이루고 있는 A<sub>i</sub>가 주어진다. (1 ≤ A<sub>i</sub> ≤ 1,000,000)</p>
                <h4>출력</h4>
                <p>첫째 줄에 수열 A의 가장 긴 증가하는 부분 수열의 길이를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6\n10 20 10 30 20 50</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>1 ≤ A<sub>i</sub> ≤ 1,000,000</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '<strong>DP</strong>로 풀 수 있어! dp[i] = "i번째 원소를 마지막으로 하는 LIS 길이"로 정의하고,<br>각 원소마다 앞에 있는 모든 원소를 확인해서 <code>A[j] &lt; A[i]</code>인 경우 <code>dp[i] = max(dp[i], dp[j] + 1)</code>로 갱신하면 돼.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 <strong>1,000,000</strong>(100만)이야! DP의 이중 반복문은 O(N²) = <strong>1조 번</strong> 연산...<br>이건 몇 분이 걸려도 끝나지 않아. 더 빠른 방법이 필요해!<br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:40px;height:100px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">DP O(N²)<br>1조</div></div><div style="text-align:center;"><div style="width:40px;height:8px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">tails+BS<br>2천만</div></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '<code>tails</code>라는 배열을 유지하는 거야. tails[i] = "길이 i+1인 증가 부분 수열의 마지막 원소 <strong>최솟값</strong>".<br>새 원소 x를 볼 때:<br>- tails 끝보다 크면? LIS가 늘어나니까 <strong>뒤에 추가</strong>!<br>- 아니면? tails에서 x가 들어갈 위치를 <strong>이분 탐색</strong>으로 찾아서 <strong>교체</strong>해.<br>교체하면 당장 LIS가 바뀌진 않지만, 나중에 더 긴 LIS를 만들 가능성이 높아져!<br>tails는 항상 정렬 상태이므로 이분 탐색이 가능하고, 전체 <strong>O(N log N)</strong>이야.' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python: <code>bisect_left(tails, x)</code>로 교체할 위치를 O(log N)에 찾아. pos == len(tails)이면 <code>append</code>, 아니면 <code>tails[pos] = x</code>로 교체!</span><span class="lang-cpp">C++: <code>lower_bound(tails.begin(), tails.end(), x)</code>가 Python의 bisect_left와 동일한 역할이야. 끝이면 <code>push_back</code>, 아니면 <code>*it = x</code>로 교체!</span>' }
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
