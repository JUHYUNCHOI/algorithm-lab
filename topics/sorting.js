// =========================================================
// 정렬 (Sorting) 토픽 모듈
// =========================================================
const sortingTopic = {
    id: 'sorting',
    title: '정렬',
    icon: '🔢',
    category: '탐색 (Silver)',
    order: 7,
    description: '버블/선택/삽입 정렬부터 병합/퀵 정렬까지, 정렬의 모든 것',
    relatedNote: '이 외에도 카운팅 정렬, 기수 정렬 등 특수 정렬과 정렬의 안정성(stability) 개념이 중요합니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-25305': { type: '정렬 활용',    color: '#00b894',      vizMethod: '_renderVizCutline' },
        'boj-2750':  { type: '기본 정렬',    color: 'var(--accent)', vizMethod: '_renderVizSelection' },
        'boj-11650': { type: '커스텀 정렬',   color: 'var(--green)',  vizMethod: '_renderVizCoordSort' },
        'lc-56':     { type: '구간 병합',     color: '#e17055',      vizMethod: '_renderVizMergeIntervals' },
        'boj-10814': { type: '안정 정렬',     color: '#6c5ce7',      vizMethod: '_renderVizStableSort' }
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
        var diffMap = { bronze: 'Bronze', gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '힌트에서 배운 개념이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
        var isLC = prob.link.includes('leetcode');
        var wrapper = document.createElement('div');
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
                <h2>🔢 정렬 (Sorting)</h2>
                <p class="hero-sub">데이터를 순서대로 나열하는 다양한 방법을 배워봅시다!</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 기본 정렬 <small style="font-weight:400;">(10개면 100번 비교해야 하는 느린 방법들)</small></div>
                <div class="analogy-box">
                    카드를 크기순으로 정리하는 방법을 세 가지 배워 볼 거예요!
                    <em>선택 정렬</em>은 "가장 작은 카드를 찾아서 맨 앞에 놓기",
                    <em>삽입 정렬</em>은 "새 카드를 알맞은 자리에 끼워넣기",
                    <em>버블 정렬</em>은 "옆에 있는 카드랑 비교해서 바꾸기"예요.
                    10개면 대략 100번, 100개면 10,000번 비교해야 해서 느리지만, 원리가 간단해서 처음 배우기 좋아요!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--accent)">선택</text></svg></div>
                        <h3>선택 정렬</h3>
                        <p>전체를 쭉 훑어서 <strong>가장 작은 걸 골라</strong> 맨 앞에 놓아요. 그다음 나머지에서 또 가장 작은 걸 골라요. 단순하지만 매번 전부 봐야 해서 느려요.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--green)">삽입</text></svg></div>
                        <h3>삽입 정렬</h3>
                        <p>새 카드를 받으면 <strong>알맞은 자리에 끼워넣어요</strong>. 이미 거의 정리되어 있으면 옮길 게 별로 없어서 엄청 빨라요!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">버블</text></svg></div>
                        <h3>버블 정렬</h3>
                        <p>바로 옆에 있는 것끼리 <strong>비교해서 큰 게 뒤로</strong> 가요. 탄산음료 거품이 위로 올라가듯, 큰 수가 점점 뒤로 떠올라요!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 선택 정렬 (Selection Sort)
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

# 삽입 정렬 (Insertion Sort)
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// 선택 정렬 (Selection Sort)
#include &lt;vector&gt;
#include &lt;algorithm&gt;
using namespace std;

void selection_sort(vector&lt;int&gt;&amp; arr) {
    int n = arr.size();
    for (int i = 0; i &lt; n; i++) {
        int min_idx = i;
        for (int j = i + 1; j &lt; n; j++) {
            if (arr[j] &lt; arr[min_idx])
                min_idx = j;
        }
        swap(arr[i], arr[min_idx]);
    }
}

// 삽입 정렬 (Insertion Sort)
void insertion_sort(vector&lt;int&gt;&amp; arr) {
    for (int i = 1; i &lt; (int)arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j &gt;= 0 &amp;&amp; arr[j] &gt; key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}</code></pre>
                </div></span>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 세 가지 O(n²) 정렬 중, 실제로 가장 많이 쓰이는 것은?
                    삽입 정렬! 데이터가 거의 정렬되어 있으면 O(n)이고, 작은 배열에서 빠릅니다.
                    <span class="lang-py">Python의 <code>sort()</code>도 내부적으로 삽입 정렬을 활용합니다(TimSort).</span>
                    <span class="lang-cpp">C++의 <code>std::sort()</code>도 작은 구간에서는 삽입 정렬을 활용합니다(IntroSort).</span>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">세 정렬, 뭐가 다를까?</div>
                    <div style="margin-top:1rem;overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                            <thead><tr style="background:var(--bg2);">
                                <th style="padding:10px;text-align:left;border:1px solid var(--bg3);">비교 항목</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">선택 정렬</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">삽입 정렬</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">버블 정렬</th>
                            </tr></thead>
                            <tbody>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">최선 시간</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);font-weight:600;">O(n) ✨</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">최악 시간</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">안정 정렬?</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--red);">❌</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">✅</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">✅</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">핵심 장점</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">교환 횟수 최소</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">거의 정렬된 데이터에 빠름</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">구현이 가장 단순</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">동작 방식</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">최솟값 찾아서 앞에 배치</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">정렬된 부분에 삽입</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">인접한 쌍 교환</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="margin-top:1rem;padding:10px 14px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:6px;font-size:0.88rem;line-height:1.7;">
                        <strong>핵심 차이:</strong> 삽입 정렬만 최선 O(n)이 가능합니다! 이미 정렬된 데이터에서는 비교만 하고 이동이 없기 때문입니다. 그래서 실전 정렬 알고리즘(TimSort, IntroSort)도 작은 구간에서 삽입 정렬을 활용합니다. 선택 정렬은 교환 횟수가 O(n)으로 가장 적어서, 교환 비용이 큰 경우에 유리합니다.
                    </div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">선택 정렬 미니 데모</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        매 라운드마다 <strong>남은 원소 중 최솟값</strong>을 찾아 맨 앞과 교환합니다.<br>
                        "Step" 버튼을 눌러 <em>한 비교씩</em> 따라가 보세요 — 최솟값이 어떻게 갱신되는지 확인!
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-sel-step">다음 ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-sel-reset">처음으로 ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="position:relative;">
                            <div id="sort-demo-sel-arr" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;min-height:50px;"></div>
                            <div id="sort-demo-sel-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-sel-msg">▶ Step을 눌러 선택 정렬을 시작하세요!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">삽입 정렬 미니 데모</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        왼쪽부터 <strong>정렬된 부분</strong>(초록)을 넓혀갑니다. 새 원소를 <em>꺼내서</em> 위에 올려놓고, 정렬된 부분에서 올바른 자리를 찾아 <em>끼워넣기</em>!<br>
                        큰 원소들이 오른쪽으로 밀리는 과정을 한 스텝씩 확인하세요.
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-ins-step">다음 ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-ins-reset">처음으로 ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="position:relative;">
                            <div id="sort-demo-ins-key" style="display:flex;justify-content:center;min-height:52px;margin-bottom:8px;align-items:center;"></div>
                            <div id="sort-demo-ins-arr" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;min-height:50px;"></div>
                            <div id="sort-demo-ins-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-ins-msg">▶ Step을 눌러 삽입 정렬을 시작하세요!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">버블 정렬 미니 데모</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        인접한 두 원소를 비교해서, 왼쪽이 크면 <strong>교환</strong>합니다. 한 패스가 끝나면 가장 큰 원소가 맨 뒤로 "떠오릅니다".<br>
                        한 비교씩 따라가 보세요!
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-bub-step">다음 ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-bub-reset">처음으로 ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="position:relative;">
                            <div id="sort-demo-bub-arr" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;min-height:50px;"></div>
                            <div id="sort-demo-bub-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-bub-msg">▶ Step을 눌러 버블 정렬을 시작하세요!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">속도 비교: 선택 vs 삽입 vs 버블</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        같은 배열을 세 가지 정렬로 동시에 정렬합니다. 각 알고리즘의 <strong>비교 횟수</strong>와 <strong>교환 횟수</strong>가 얼마나 다른지 확인해보세요!<br>
                        모두 O(n²)이지만, 실제 연산 수는 다릅니다.
                    </p>
                    <div style="display:flex;gap:12px;justify-content:center;align-items:center;margin-bottom:8px;">
                        <button class="concept-demo-btn" id="sort-demo-race-prev">← 이전</button>
                        <span id="sort-demo-race-counter" style="font-size:0.85rem;color:var(--text2);min-width:80px;text-align:center;">시작 전</span>
                        <button class="concept-demo-btn" id="sort-demo-race-next">다음 →</button>
                        <button class="concept-demo-btn danger" id="sort-demo-race-reset" style="margin-left:8px;">🔄</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:8px;">
                            <div style="text-align:center;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--accent);">선택 정렬</div>
                                <div id="sort-demo-race-sel" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;min-height:44px;"></div>
                                <div style="margin-top:6px;font-size:0.82rem;">비교: <span id="sort-demo-race-sel-cmp" style="font-weight:700;color:var(--accent);">0</span> · 교환: <span id="sort-demo-race-sel-swp" style="font-weight:700;color:var(--red);">0</span></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--green);">삽입 정렬</div>
                                <div id="sort-demo-race-ins" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;min-height:44px;"></div>
                                <div style="margin-top:6px;font-size:0.82rem;">비교: <span id="sort-demo-race-ins-cmp" style="font-weight:700;color:var(--accent);">0</span> · 이동: <span id="sort-demo-race-ins-swp" style="font-weight:700;color:var(--red);">0</span></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--yellow);">버블 정렬</div>
                                <div id="sort-demo-race-bub" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;min-height:44px;"></div>
                                <div style="margin-top:6px;font-size:0.82rem;">비교: <span id="sort-demo-race-bub-cmp" style="font-weight:700;color:var(--accent);">0</span> · 교환: <span id="sort-demo-race-bub-swp" style="font-weight:700;color:var(--red);">0</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-race-msg">▶ "다음 →" 버튼을 눌러 세 정렬을 비교해보세요!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 병합 정렬: O(n log n) <small style="font-weight:400;">(빠른 정렬 수준)</small></div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 병합 정렬은 <em>"반으로 나누고, 정렬하고, 합치기"</em>입니다!
                    카드 더미를 반으로 나누고, 각각 정렬한 뒤, 두 더미를 비교하며 합칩니다.
                    이것이 <strong>분할 정복(Divide &amp; Conquer — 나누어서 정복하기)</strong>의 대표 예시입니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="14" font-weight="bold" fill="var(--accent)">÷2</text></svg></div>
                        <h3>분할 (Divide)</h3>
                        <p>배열을 <strong>반으로 나눕니다</strong>. 원소가 1개가 될 때까지 재귀적으로!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="14" font-weight="bold" fill="var(--green)">↗↗</text></svg></div>
                        <h3>정렬 (Conquer)</h3>
                        <p>원소 1개짜리 배열은 이미 정렬되어 있습니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="14" font-weight="bold" fill="var(--yellow)">⊕</text></svg></div>
                        <h3>합치기 (Merge)</h3>
                        <p>정렬된 두 배열을 <strong>하나로 합칩니다</strong>. 앞에서부터 비교하며 O(n)!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python">def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])    # 왼쪽 반 정렬
    right = merge_sort(arr[mid:])   # 오른쪽 반 정렬

    # 합치기 (Merge)
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
using namespace std;

void merge(vector&lt;int&gt;&amp; arr, int l, int m, int r) {
    vector&lt;int&gt; left(arr.begin() + l, arr.begin() + m + 1);
    vector&lt;int&gt; right(arr.begin() + m + 1, arr.begin() + r + 1);

    int i = 0, j = 0, k = l;
    while (i &lt; (int)left.size() &amp;&amp; j &lt; (int)right.size()) {
        if (left[i] &lt;= right[j])   // 안정 정렬을 위해 &lt;=
            arr[k++] = left[i++];
        else
            arr[k++] = right[j++];
    }
    while (i &lt; (int)left.size()) arr[k++] = left[i++];
    while (j &lt; (int)right.size()) arr[k++] = right[j++];
}

void merge_sort(vector&lt;int&gt;&amp; arr, int l, int r) {
    if (l &gt;= r) return;

    int m = l + (r - l) / 2;
    merge_sort(arr, l, m);       // 왼쪽 반 정렬
    merge_sort(arr, m + 1, r);   // 오른쪽 반 정렬
    merge(arr, l, m, r);         // 합치기 (Merge)
}</code></pre>
                </div></span>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 병합 정렬은 항상 O(n log n)입니다!
                    최악의 경우에도 안정적이지만, 추가 메모리 O(n)이 필요하다는 단점이 있습니다.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">병합 정렬 미니 데모</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        배열 [38, 27, 43, 3, 9, 82, 10]을 <strong>반으로 나누고 → 합치는</strong> 과정을 한 스텝씩 따라가 보세요!<br>
                        합칠 때 두 배열의 앞 원소를 비교해서 작은 쪽을 먼저 넣는 것이 핵심입니다.
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-merge-step">다음 ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-merge-reset">처음으로 ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="sort-demo-merge-viz" style="min-height:120px;overflow-x:auto;"></div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-merge-msg">▶ Step을 눌러 병합 정렬을 시작하세요!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 퀵 정렬: 평균 O(n log n)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 퀵 정렬은 <em>"기준을 정해서 좌우로 나누기"</em>입니다!
                    피벗(기준값)을 하나 고르고, 작은 것은 왼쪽, 큰 것은 오른쪽으로 보냅니다.
                    그 후 왼쪽과 오른쪽을 각각 다시 정렬합니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">pivot</text></svg></div>
                        <h3>피벗 선택</h3>
                        <p>기준값을 고릅니다. 보통 맨 앞, 맨 뒤, 또는 중간값을 선택합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">O(n²)</text></svg></div>
                        <h3>최악의 경우</h3>
                        <p>이미 정렬된 배열에서 피벗이 맨 끝이면 O(n²)! 랜덤 피벗으로 방지합니다.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python">def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]  # 중간값을 피벗으로
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + mid + quick_sort(right)

# 실전에서는 Python의 내장 정렬을 씁니다!
arr = [38, 27, 43, 3, 9, 82, 10]
arr.sort()          # 제자리 정렬 (TimSort, O(n log n))
sorted_arr = sorted(arr)  # 새 리스트 반환</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
using namespace std;

int partition(vector&lt;int&gt;&amp; arr, int lo, int hi) {
    int pivot = arr[hi];  // 마지막 원소를 피벗으로
    int i = lo - 1;
    for (int j = lo; j &lt; hi; j++) {
        if (arr[j] &lt; pivot)
            swap(arr[++i], arr[j]);
    }
    swap(arr[i + 1], arr[hi]);
    return i + 1;
}

void quick_sort(vector&lt;int&gt;&amp; arr, int lo, int hi) {
    if (lo &gt;= hi) return;
    int p = partition(arr, lo, hi);
    quick_sort(arr, lo, p - 1);
    quick_sort(arr, p + 1, hi);
}

// 실전에서는 C++의 내장 정렬을 씁니다!
vector&lt;int&gt; arr = {38, 27, 43, 3, 9, 82, 10};
sort(arr.begin(), arr.end());  // IntroSort, O(n log n)</code></pre>
                </div></span>
                <div style="margin-top:10px;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#list.sort" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: list.sort() / sorted() ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/sort" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: std::sort() ↗</a></span>
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 코딩 테스트에서는 대부분 <code>sort()</code>를 사용합니다!
                    하지만 정렬 알고리즘의 원리를 알면 <strong>정렬 기준 커스터마이즈</strong><span class="lang-py">(<code>key</code>, <code>lambda</code>)</span><span class="lang-cpp">(비교 함수, 람다)</span>를
                    자유자재로 활용할 수 있습니다.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">퀵 정렬 미니 데모</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        배열 [38, 27, 43, 3, 9, 82, 10]에서 <strong>피벗을 선택</strong>하고, 피벗보다 작은 것은 왼쪽, 큰 것은 오른쪽으로 보내는 과정을 한 스텝씩 따라가 보세요!
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-quick-step">다음 ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-quick-reset">처음으로 ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="sort-demo-quick-viz" style="min-height:120px;overflow-x:auto;"></div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-quick-msg">▶ Step을 눌러 퀵 정렬을 시작하세요!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">병합 정렬 vs 퀵 정렬, 뭐가 다를까?</div>
                    <div style="margin-top:1rem;overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                            <thead><tr style="background:var(--bg2);">
                                <th style="padding:10px;text-align:left;border:1px solid var(--bg3);">비교 항목</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">병합 정렬</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">퀵 정렬</th>
                            </tr></thead>
                            <tbody>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">평균 시간</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n log n)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n log n)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">최악 시간</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">O(n log n)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--red);font-weight:600;">O(n²) ⚠️</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">추가 메모리</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">O(log n)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">안정 정렬?</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">✅</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--red);">❌</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">핵심 장점</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">항상 O(n log n) 보장</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">실전에서 가장 빠름 (캐시 효율)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">동작 방식</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">분할 → 정렬 → 합치기</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">피벗 기준 분할 → 재귀</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="margin-top:1rem;padding:10px 14px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:6px;font-size:0.88rem;line-height:1.7;">
                        <strong>실전에서는 퀵 정렬이 보통 더 빠른 이유:</strong> 같은 O(n log n)이지만, 퀵 정렬은 제자리(in-place) 정렬이라 캐시 히트율이 높아서 실제 속도가 빠릅니다. 병합 정렬은 합칠 때마다 새 배열을 만들어야 해서 메모리 접근이 분산됩니다.
                    </div>
                    <div style="margin-top:0.7rem;padding:10px 14px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:6px;font-size:0.88rem;line-height:1.7;">
                        <strong>하지만 최악 O(n²)을 피하려면?</strong> 피벗을 랜덤으로 고르거나, median-of-three 전략(맨 앞·중간·맨 뒤 중 중간값 선택)을 씁니다. C++의 <code>std::sort()</code>는 이런 문제를 해결하기 위해 퀵 정렬 + 힙 정렬을 합친 IntroSort를 사용합니다.
                    </div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 정렬 활용 패턴</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 정렬은 그 자체가 목적이 아니라 <em>"다른 문제를 풀기 위한 전처리"</em>입니다!
                    정렬해놓으면 이분 탐색, 투 포인터, 그룹화 등 다양한 기법을 적용할 수 있습니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--accent)">key=</text></svg></div>
                        <h3>커스텀 정렬</h3>
                        <p><span class="lang-py"><code>sort(key=lambda x: ...)</code>로 원하는 기준으로 정렬!</span><span class="lang-cpp"><code>sort(begin, end, 비교함수)</code>로 원하는 기준으로 정렬!</span> 좌표 정렬, 문자열 정렬 등.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--green)">stable</text></svg></div>
                        <h3>안정 정렬</h3>
                        <p>같은 값의 원래 순서가 유지됩니다. <span class="lang-py">Python의 sort()는 안정 정렬(TimSort)!</span><span class="lang-cpp">C++의 <code>stable_sort()</code>가 안정 정렬! (<code>sort()</code>는 불안정)</span></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 커스텀 정렬 예시
coords = [(3, 4), (1, 2), (3, 1), (1, 5)]

# x좌표 기준, 같으면 y좌표 기준
coords.sort(key=lambda p: (p[0], p[1]))
# [(1, 2), (1, 5), (3, 1), (3, 4)]

# 문자열 길이 기준
words = ["banana", "pie", "apple", "fig"]
words.sort(key=len)  # ["pie", "fig", "apple", "banana"]

# 여러 기준: 길이 오름차순 → 같으면 사전순
words.sort(key=lambda w: (len(w), w))</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// 커스텀 정렬 예시
#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;string&gt;
using namespace std;

vector&lt;pair&lt;int,int&gt;&gt; coords = {{3,4},{1,2},{3,1},{1,5}};

// x좌표 기준, 같으면 y좌표 기준
sort(coords.begin(), coords.end());
// pair는 기본적으로 first → second 순 비교
// {{1,2},{1,5},{3,1},{3,4}}

// 문자열 길이 기준
vector&lt;string&gt; words = {"banana","pie","apple","fig"};
sort(words.begin(), words.end(),
    [](const string&amp; a, const string&amp; b) {
        return a.size() &lt; b.size();
    });
// {"pie","fig","apple","banana"}

// 여러 기준: 길이 오름차순 → 같으면 사전순
sort(words.begin(), words.end(),
    [](const string&amp; a, const string&amp; b) {
        if (a.size() != b.size()) return a.size() &lt; b.size();
        return a &lt; b;
    });</code></pre>
                </div></span>

                <div class="concept-demo">
                    <div class="concept-demo-title">커스텀 정렬 체험하기</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        같은 데이터도 <strong>정렬 기준(key)</strong>에 따라 순서가 완전히 달라집니다!<br>
                        버튼을 눌러 기준을 바꿔보세요 — 어떤 기준으로 정렬하느냐에 따라 결과가 어떻게 달라지는지 확인!
                    </p>
                    <div class="concept-demo-btns" id="sort-demo-custom-btns">
                        <button class="concept-demo-btn" data-key="score">점수순 ▼</button>
                        <button class="concept-demo-btn" data-key="name">이름순 (ㄱ-ㄴ)</button>
                        <button class="concept-demo-btn" data-key="length">이름 길이순</button>
                        <button class="concept-demo-btn danger" data-key="reset">원래 순서 ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="sort-demo-custom-arr" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;min-height:70px;transition:opacity 0.2s;"></div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-custom-msg">버튼을 눌러 정렬 기준을 바꿔보세요!</div>
                </div>

                <div class="think-box">
                    <strong>💡 생각해보기:</strong>
                    <span class="lang-py">C++의 <code>sort()</code>에서 커스텀 비교 함수를 쓸 때는
                    <code>sort(v.begin(), v.end(), [](auto& a, auto& b) { ... })</code> 형태입니다.</span>
                    <span class="lang-cpp">Python의 <code>sort()</code>에서 커스텀 정렬을 쓸 때는
                    <code>sort(key=lambda x: ...)</code> 형태로, 비교 함수 대신 키 함수를 씁니다.</span>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 실전: Python과 C++의 sort()는 어떤 정렬?</div>
                <div class="analogy-box">
                    <strong>핵심:</strong> 우리가 직접 선택/삽입/버블 정렬을 구현할 일은 거의 없습니다.
                    실전에서는 언어가 제공하는 <code>sort()</code>를 씁니다.
                    그런데 이 <code>sort()</code>는 내부적으로 <em>어떤 정렬 알고리즘</em>을 쓸까요?
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card" style="border-left:3px solid var(--yellow);">
                        <h3>🐍 Python: TimSort</h3>
                        <p><strong>삽입 정렬 + 병합 정렬</strong>의 하이브리드</p>
                        <ul style="font-size:0.88rem;margin-top:8px;padding-left:1.2rem;">
                            <li>데이터에서 이미 정렬된 구간(<strong>run</strong>)을 찾아 활용</li>
                            <li>작은 구간은 <strong>삽입 정렬</strong>로 빠르게 정렬</li>
                            <li>큰 구간은 <strong>병합 정렬</strong>로 합침</li>
                            <li><strong>안정 정렬</strong> → 같은 키이면 원래 순서 유지</li>
                        </ul>
                        <div style="margin-top:8px;padding:6px 10px;background:rgba(243,156,18,0.08);border-radius:8px;font-size:0.82rem;">
                            💡 실세계 데이터는 부분적으로 정렬되어 있는 경우가 많아서,<br>
                            이를 활용하는 TimSort가 실전에서 매우 빠릅니다!
                        </div>
                    </div>
                    <div class="concept-card" style="border-left:3px solid var(--accent);">
                        <h3>⚡ C++: IntroSort</h3>
                        <p><strong>퀵 정렬 + 힙 정렬 + 삽입 정렬</strong>의 하이브리드</p>
                        <ul style="font-size:0.88rem;margin-top:8px;padding-left:1.2rem;">
                            <li>기본은 <strong>퀵 정렬</strong> (평균적으로 가장 빠름)</li>
                            <li>재귀 깊이가 깊어지면 <strong>힙 정렬</strong>로 전환 → 최악 O(n²) 방지</li>
                            <li>작은 구간은 <strong>삽입 정렬</strong>로 마무리</li>
                            <li><strong>불안정 정렬</strong> → 안정 정렬이 필요하면 <code>stable_sort()</code> 사용</li>
                        </ul>
                        <div style="margin-top:8px;padding:6px 10px;background:rgba(108,92,231,0.08);border-radius:8px;font-size:0.82rem;">
                            💡 <code>std::sort()</code>는 불안정! 순서 보장이 필요하면<br>
                            <code>std::stable_sort()</code>를 써야 합니다.
                        </div>
                    </div>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">비교: Python vs C++ 정렬</div>
                    <div style="overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.88rem;margin-top:8px;">
                            <tr style="background:var(--bg2);">
                                <th style="padding:8px 12px;text-align:left;border-bottom:2px solid var(--border);"></th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">🐍 Python <code>sort()</code></th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">⚡ C++ <code>std::sort()</code></th>
                            </tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);font-weight:600;">알고리즘</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">TimSort</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">IntroSort</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);font-weight:600;">평균</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">O(n log n)</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">O(n log n)</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);font-weight:600;">최악</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">O(n log n)</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">O(n log n)</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);font-weight:600;">안정 정렬?</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;color:var(--green);">✅ 안정</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;color:var(--red);">❌ 불안정</td></tr>
                            <tr><td style="padding:6px 12px;font-weight:600;">안정 버전</td><td style="padding:6px 12px;text-align:center;">기본이 안정!</td><td style="padding:6px 12px;text-align:center;"><code>stable_sort()</code></td></tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });

        // ── 선택 정렬 미니 데모 ──
        {
            var selArr = [64, 25, 12, 22, 11];
            var selState = { arr: selArr.slice(), i: 0, j: 0, minIdx: 0, phase: 'start', done: false };
            var selArrEl = container.querySelector('#sort-demo-sel-arr');
            var selFlyEl = container.querySelector('#sort-demo-sel-fly');
            var selMsg = container.querySelector('#sort-demo-sel-msg');

            var selStepBtn = container.querySelector('#sort-demo-sel-step');
            var selAnimating = false;

            function renderSelArr() {
                selArrEl.innerHTML = selState.arr.map(function(v, idx) {
                    var cls = 'str-char-box';
                    var extra = '';
                    var showLabels = (selState.phase === 'compare' || selState.phase === 'ready_swap');
                    if (selState.done || idx < selState.i) {
                        cls += ' matched';
                        if (selState.phase === 'swapped' && idx === selState.i - 1) {
                            extra = 'border-color:var(--green);box-shadow:0 0 14px var(--green);transform:scale(1.1);';
                        }
                    } else if (selState.phase === 'swap' && (idx === selState.i || idx === selState.minIdx)) {
                        extra = 'border-color:var(--accent);box-shadow:0 0 12px var(--accent);transform:scale(1.08);';
                    } else if (idx === selState.minIdx && showLabels) {
                        extra = 'border-color:var(--yellow);box-shadow:0 0 8px var(--yellow);';
                    }
                    if (idx === selState.j && selState.phase === 'compare' && idx !== selState.minIdx) {
                        extra = 'border-color:var(--red);box-shadow:0 0 6px var(--red);';
                    }
                    var label = '';
                    if (idx === selState.minIdx && showLabels) label = '<div style="font-size:0.65rem;color:var(--yellow);margin-top:2px;">min</div>';
                    if (idx === selState.j && selState.phase === 'compare') label += '<div style="font-size:0.65rem;color:var(--red);margin-top:2px;">j</div>';
                    if (selState.phase === 'swap' && idx === selState.i && selState.i !== selState.minIdx) label = '<div style="font-size:0.65rem;color:var(--accent);margin-top:2px;">i</div>';
                    if (selState.phase === 'swap' && idx === selState.minIdx) label += '<div style="font-size:0.65rem;color:var(--accent);margin-top:2px;">min</div>';
                    return '<div style="display:flex;flex-direction:column;align-items:center;">' +
                        '<div class="' + cls + '" id="sel-box-' + idx + '" style="' + extra + '">' + v + '</div>' + label + '</div>';
                }).join('');
            }

            function animateConceptSwap(arrEl, flyEl, idxA, idxB, valA, valB, colorA, colorB, onDone) {
                var elA = arrEl.querySelector('#sel-box-' + idxA);
                var elB = arrEl.querySelector('#sel-box-' + idxB);
                var wrapRect = arrEl.parentElement.getBoundingClientRect();
                if (!elA || !elB) { if (onDone) onDone(); return; }
                var rectA = elA.getBoundingClientRect();
                var rectB = elB.getBoundingClientRect();
                elA.style.opacity = '0.15'; elB.style.opacity = '0.15';
                function mkGhost(val, rect, color) {
                    var g = document.createElement('div');
                    g.textContent = val;
                    g.className = 'str-char-box';
                    g.style.cssText = 'position:absolute;z-index:20;margin:0;' +
                        'left:' + (rect.left - wrapRect.left) + 'px;' +
                        'top:' + (rect.top - wrapRect.top) + 'px;' +
                        'width:' + rect.width + 'px;height:' + rect.height + 'px;' +
                        'display:flex;align-items:center;justify-content:center;' +
                        'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);' +
                        'background:' + color + ';color:white;border-color:' + color + ';' +
                        'box-shadow:0 0 12px ' + color + ';transform:scale(1.1);';
                    return g;
                }
                var gA = mkGhost(valA, rectA, colorA);
                var gB = mkGhost(valB, rectB, colorB);
                flyEl.appendChild(gA); flyEl.appendChild(gB);
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        gA.style.left = (rectB.left - wrapRect.left) + 'px';
                        gB.style.left = (rectA.left - wrapRect.left) + 'px';
                    });
                });
                setTimeout(function() {
                    if (gA.parentNode) gA.parentNode.removeChild(gA);
                    if (gB.parentNode) gB.parentNode.removeChild(gB);
                    if (onDone) onDone();
                }, 550);
            }

            function selStep() {
                if (selState.done || selAnimating) return;
                if (selState.phase === 'start') {
                    selState.i = 0; selState.minIdx = 0; selState.j = 1;
                    selState.phase = 'compare';
                    selMsg.textContent = 'Round 0: ' + selState.arr[0] + '을(를) 임시 최솟값으로 설정. j=1(' + selState.arr[1] + ')과 비교합니다.';
                    renderSelArr();
                    return;
                }
                if (selState.phase === 'swapped') {
                    selState.minIdx = selState.i;
                    selState.j = selState.i + 1;
                    selState.phase = 'compare';
                    selMsg.textContent = 'Round ' + selState.i + ': ' + selState.arr[selState.i] + '을(를) 임시 최솟값으로 설정. j=' + (selState.i + 1) + '(' + selState.arr[selState.i + 1] + ')과 비교합니다.';
                    renderSelArr();
                    return;
                }
                if (selState.phase === 'compare') {
                    if (selState.j < selState.arr.length) {
                        if (selState.arr[selState.j] < selState.arr[selState.minIdx]) {
                            selState.minIdx = selState.j;
                            selMsg.textContent = selState.arr[selState.j] + ' < 현재 최솟값 → 최솟값을 ' + selState.arr[selState.j] + '(인덱스 ' + selState.j + ')으로 갱신!';
                        } else {
                            selMsg.textContent = selState.arr[selState.j] + ' >= 현재 최솟값 ' + selState.arr[selState.minIdx] + ' → 변경 없음.';
                        }
                        selState.j++;
                        if (selState.j >= selState.arr.length) {
                            // 비교 끝 — 아직 swap으로 넘기지 않고 min 라벨 유지
                            selState.phase = 'ready_swap';
                        }
                        renderSelArr();
                        return;
                    }
                    selState.phase = 'ready_swap';
                }
                // 비교 완료 → "최솟값 찾았다!" 안내 (min 라벨 유지)
                if (selState.phase === 'ready_swap') {
                    var a = selState.i, b = selState.minIdx;
                    if (a !== b) {
                        selMsg.textContent = '비교 완료! 최솟값 = ' + selState.arr[b] + ' (인덱스 ' + b + '). 다음 Step에서 arr[' + a + ']=' + selState.arr[a] + '과 교환합니다.';
                    } else {
                        selMsg.textContent = '비교 완료! 최솟값 = ' + selState.arr[b] + ' — 이미 제자리입니다. 위치 ' + a + ' 확정!';
                    }
                    selState.phase = 'swap';
                    renderSelArr();
                    return;
                }
                if (selState.phase === 'swap') {
                    var a = selState.i, b = selState.minIdx;
                    if (a !== b) {
                        selMsg.textContent = '교환! arr[' + a + ']=' + selState.arr[a] + ' ↔ arr[' + b + ']=' + selState.arr[b];
                        var valA = selState.arr[a], valB = selState.arr[b];
                        selFlyEl.innerHTML = '';
                        selAnimating = true;
                        selStepBtn.disabled = true;
                        selStepBtn.style.opacity = '0.5';
                        animateConceptSwap(selArrEl, selFlyEl, a, b, valA, valB, '#e17055', 'var(--yellow)', function() {
                            selAnimating = false;
                            selStepBtn.disabled = false;
                            selStepBtn.style.opacity = '';
                            var tmp = selState.arr[a]; selState.arr[a] = selState.arr[b]; selState.arr[b] = tmp;
                            selState.i++;
                            if (selState.i >= selState.arr.length - 1) {
                                selState.done = true;
                                selMsg.textContent = '정렬 완료! [' + selState.arr.join(', ') + '] — 총 비교 횟수: n(n-1)/2';
                            } else {
                                selState.phase = 'swapped';
                                selMsg.textContent = '위치 ' + (a) + ' 확정: ' + selState.arr[a] + '. Step을 눌러 다음 라운드!';
                            }
                            renderSelArr();
                        });
                    } else {
                        selState.i++;
                        if (selState.i >= selState.arr.length - 1) {
                            selState.done = true;
                            selMsg.textContent = '정렬 완료! [' + selState.arr.join(', ') + '] — 총 비교 횟수: n(n-1)/2';
                        } else {
                            selState.phase = 'swapped';
                            selMsg.textContent = '위치 ' + (selState.i - 1) + ' 확정: ' + selState.arr[selState.i - 1] + '. Step을 눌러 다음 라운드!';
                        }
                        renderSelArr();
                    }
                }
            }

            function selReset() {
                selState = { arr: [64, 25, 12, 22, 11], i: 0, j: 0, minIdx: 0, phase: 'start', done: false };
                selMsg.textContent = '▶ Step을 눌러 선택 정렬을 시작하세요!';
                renderSelArr();
            }

            container.querySelector('#sort-demo-sel-step').addEventListener('click', selStep);
            container.querySelector('#sort-demo-sel-reset').addEventListener('click', selReset);
            renderSelArr();
        }

        // ── 삽입 정렬 미니 데모 ──
        // key를 배열 위에 떠있게 보여주고, 빈 칸(hole)을 만들어서 이동 과정을 명확히 표현
        {
            var insInitArr = [64, 25, 12, 22, 11];
            // phase: 'pick' = 다음 key 선택 대기, 'compare' = j와 비교 중, 'shift' = 밀기 애니메이션, 'insert' = key 삽입
            var insState = { arr: insInitArr.slice(), i: 1, j: -1, key: -1, hole: -1, phase: 'pick', done: false };
            var insArrEl = container.querySelector('#sort-demo-ins-arr');
            var insKeyEl = container.querySelector('#sort-demo-ins-key');
            var insFlyEl = container.querySelector('#sort-demo-ins-fly');
            var insMsg = container.querySelector('#sort-demo-ins-msg');

            function renderInsArr() {
                // key 영역: key를 꺼냈으면 배열 위에 표시
                if (insState.phase !== 'pick' && !insState.done) {
                    insKeyEl.innerHTML =
                        '<div style="display:flex;flex-direction:column;align-items:center;">' +
                            '<div style="font-size:0.6rem;color:var(--yellow);margin-bottom:2px;font-weight:700;">key</div>' +
                            '<div class="str-char-box" style="border-color:var(--yellow);box-shadow:0 0 12px var(--yellow);background:rgba(253,203,110,0.15);font-weight:700;">' + insState.key + '</div>' +
                        '</div>';
                } else {
                    insKeyEl.innerHTML = '';
                }

                // 배열 영역
                insArrEl.innerHTML = insState.arr.map(function(v, idx) {
                    var cls = 'str-char-box';
                    var extra = '';
                    var content = v;
                    var label = '';

                    if (insState.done) {
                        // 완료: 전부 초록
                        cls += ' matched';
                    } else if (insState.phase === 'pick') {
                        // pick 대기: i 미만은 정렬됨(초록), i는 다음 후보(노랑)
                        if (idx < insState.i) cls += ' matched';
                        if (idx === insState.i) extra = 'border-color:var(--yellow);box-shadow:0 0 8px var(--yellow);';
                    } else {
                        // key를 꺼낸 상태
                        if (idx === insState.hole) {
                            // 빈 칸 표시
                            content = '';
                            extra = 'border:2px dashed var(--text3);background:transparent;color:transparent;box-shadow:none;';
                            label = '<div style="font-size:0.55rem;color:var(--text3);margin-top:2px;">빈 칸</div>';
                        } else if (idx < insState.i && idx !== insState.hole) {
                            // 정렬된 부분
                            cls += ' matched';
                            // 비교 중인 원소 강조
                            if (insState.phase === 'compare' && idx === insState.j) {
                                extra = 'border-color:var(--red);box-shadow:0 0 10px var(--red);';
                                label = '<div style="font-size:0.55rem;color:var(--red);margin-top:2px;">비교</div>';
                            }
                        }
                    }
                    return '<div style="display:flex;flex-direction:column;align-items:center;">' +
                        '<div class="' + cls + '" id="ins-box-' + idx + '" style="' + extra + '">' + content + '</div>' + label + '</div>';
                }).join('');
            }

            var insStepBtn = container.querySelector('#sort-demo-ins-step');
            var insAnimating = false;

            function insStep() {
                if (insState.done || insAnimating) return;

                if (insState.phase === 'pick') {
                    // 다음 원소를 key로 꺼내기
                    if (insState.i >= insState.arr.length) {
                        insState.done = true;
                        insMsg.textContent = '✅ 정렬 완료! [' + insState.arr.join(', ') + '] — 거의 정렬된 데이터라면 거의 O(n)!';
                        renderInsArr();
                        return;
                    }
                    insState.key = insState.arr[insState.i];
                    insState.hole = insState.i;
                    insState.j = insState.i - 1;
                    insMsg.textContent = '🃏 key = ' + insState.key + '을(를) 꺼냈습니다 (인덱스 ' + insState.i + '). 왼쪽 정렬된 부분에서 들어갈 자리를 찾아봅니다.';
                    insState.phase = 'compare';
                    renderInsArr();
                    return;
                }

                if (insState.phase === 'compare') {
                    // j와 key 비교
                    if (insState.j >= 0 && insState.arr[insState.j] > insState.key) {
                        insMsg.textContent = '🔍 ' + insState.arr[insState.j] + ' > key(' + insState.key + ') → ' + insState.arr[insState.j] + '이(가) 더 크니까 오른쪽으로 밀어야 합니다!';
                        insState.phase = 'shift';
                        renderInsArr();
                    } else if (insState.j >= 0) {
                        insMsg.textContent = '✓ ' + insState.arr[insState.j] + ' ≤ key(' + insState.key + ') → 여기가 key의 자리! 빈 칸에 삽입합니다.';
                        insState.phase = 'insert';
                        renderInsArr();
                    } else {
                        insMsg.textContent = '✓ 맨 앞까지 왔습니다! 인덱스 0이 key의 자리입니다.';
                        insState.phase = 'insert';
                        renderInsArr();
                    }
                    return;
                }

                if (insState.phase === 'shift') {
                    // j번 원소를 오른쪽(hole)으로 밀기 — 애니메이션
                    var srcIdx = insState.j;
                    var destIdx = insState.hole;
                    var shiftVal = insState.arr[srcIdx];
                    insFlyEl.innerHTML = '';

                    var elSrc = insArrEl.querySelector('#ins-box-' + srcIdx);
                    var wrapRect = insArrEl.parentElement.getBoundingClientRect();
                    if (elSrc) {
                        var rectSrc = elSrc.getBoundingClientRect();
                        var elDest = insArrEl.querySelector('#ins-box-' + destIdx);
                        var rectDest = elDest ? elDest.getBoundingClientRect() : rectSrc;
                        elSrc.style.opacity = '0.15';
                        var g = document.createElement('div');
                        g.textContent = shiftVal;
                        g.className = 'str-char-box';
                        g.style.cssText = 'position:absolute;z-index:20;margin:0;' +
                            'left:' + (rectSrc.left - wrapRect.left) + 'px;' +
                            'top:' + (rectSrc.top - wrapRect.top) + 'px;' +
                            'width:' + rectSrc.width + 'px;height:' + rectSrc.height + 'px;' +
                            'display:flex;align-items:center;justify-content:center;' +
                            'transition:left 0.4s cubic-bezier(.4,0,.2,1);' +
                            'background:#e17055;color:white;border-color:#e17055;' +
                            'box-shadow:0 0 10px #e17055;transform:scale(1.05);';
                        insFlyEl.appendChild(g);
                        insAnimating = true;
                        insStepBtn.disabled = true;
                        insStepBtn.style.opacity = '0.5';
                        requestAnimationFrame(function() {
                            requestAnimationFrame(function() {
                                g.style.left = (rectDest.left - wrapRect.left) + 'px';
                            });
                        });
                        setTimeout(function() {
                            insAnimating = false;
                            insStepBtn.disabled = false;
                            insStepBtn.style.opacity = '';
                            if (g.parentNode) g.parentNode.removeChild(g);
                            // 실제 배열 업데이트: hole에 값 넣고, j가 새 hole
                            insState.arr[destIdx] = shiftVal;
                            insState.hole = srcIdx;
                            insState.j--;
                            insMsg.textContent = '→ ' + shiftVal + '을(를) 오른쪽으로 밀었습니다. 빈 칸이 왼쪽으로 이동했어요.';
                            insState.phase = 'compare';
                            renderInsArr();
                        }, 450);
                    }
                    return;
                }

                if (insState.phase === 'insert') {
                    // key를 빈 칸에 삽입
                    insState.arr[insState.hole] = insState.key;
                    insMsg.textContent = '📥 key=' + insState.key + '을(를) 인덱스 ' + insState.hole + '에 삽입! → [' + insState.arr.join(', ') + ']';
                    insState.i++;
                    insState.phase = 'pick';
                    insState.hole = -1;
                    insFlyEl.innerHTML = '';
                    renderInsArr();
                }
            }

            function insReset() {
                insState = { arr: insInitArr.slice(), i: 1, j: -1, key: -1, hole: -1, phase: 'pick', done: false };
                insMsg.textContent = '▶ Step을 눌러 삽입 정렬을 시작하세요!';
                insFlyEl.innerHTML = '';
                renderInsArr();
            }

            container.querySelector('#sort-demo-ins-step').addEventListener('click', insStep);
            container.querySelector('#sort-demo-ins-reset').addEventListener('click', insReset);
            renderInsArr();
        }

        // ── 버블 정렬 미니 데모 ──
        {
            var bubInitArr = [64, 25, 12, 22, 11];
            var bubState = { arr: bubInitArr.slice(), pass: 0, j: 0, phase: 'compare', done: false };
            var bubArrEl = container.querySelector('#sort-demo-bub-arr');
            var bubFlyEl = container.querySelector('#sort-demo-bub-fly');
            var bubMsg = container.querySelector('#sort-demo-bub-msg');

            var bubStepBtn = container.querySelector('#sort-demo-bub-step');
            var bubAnimating = false;

            function renderBubArr() {
                var n = bubState.arr.length;
                bubArrEl.innerHTML = bubState.arr.map(function(v, idx) {
                    var cls = 'str-char-box';
                    var extra = '';
                    if (bubState.done || idx >= n - bubState.pass) {
                        cls += ' matched';
                    }
                    if (!bubState.done && (idx === bubState.j || idx === bubState.j + 1) && idx < n - bubState.pass) {
                        if (bubState.phase === 'need_swap') {
                            extra = 'border-color:var(--red);box-shadow:0 0 10px var(--red);transform:scale(1.08);';
                        } else {
                            extra = 'border-color:var(--yellow);box-shadow:0 0 8px var(--yellow);';
                        }
                    }
                    return '<div class="' + cls + '" id="bub-box-' + idx + '" style="' + extra + '">' + v + '</div>';
                }).join('');
            }

            function bubAdvanceJ() {
                var n = bubState.arr.length;
                bubState.j++;
                if (bubState.j >= n - 1 - bubState.pass) {
                    bubState.pass++;
                    bubState.j = 0;
                    if (bubState.pass >= n - 1) {
                        bubState.done = true;
                        bubMsg.textContent = '정렬 완료! [' + bubState.arr.join(', ') + '] — 총 ' + bubState.pass + '번의 패스를 거쳤습니다.';
                    }
                }
                bubState.phase = 'compare';
            }

            function bubStep() {
                if (bubState.done || bubAnimating) return;
                var n = bubState.arr.length;
                if (bubState.pass >= n - 1) {
                    bubState.done = true;
                    bubMsg.textContent = '정렬 완료! [' + bubState.arr.join(', ') + ']';
                    renderBubArr();
                    return;
                }
                // §5: 비교 스텝 — 비교만 하고 결과를 보여준다
                if (bubState.phase === 'compare') {
                    var a = bubState.j, b = bubState.j + 1;
                    if (bubState.arr[a] > bubState.arr[b]) {
                        bubMsg.textContent = bubState.arr[a] + ' > ' + bubState.arr[b] + ' → 교환이 필요합니다! (Pass ' + (bubState.pass + 1) + ', 비교 ' + (bubState.j + 1) + ')';
                        bubState.phase = 'need_swap';
                    } else {
                        bubMsg.textContent = bubState.arr[a] + ' <= ' + bubState.arr[b] + ' → 교환 없음. (Pass ' + (bubState.pass + 1) + ', 비교 ' + (bubState.j + 1) + ')';
                        bubAdvanceJ();
                    }
                    renderBubArr();
                    return;
                }
                // §5: 교환 스텝 — 실제 교환 애니메이션
                if (bubState.phase === 'need_swap') {
                    var a = bubState.j, b = bubState.j + 1;
                    var valA = bubState.arr[a], valB = bubState.arr[b];
                    bubMsg.textContent = bubState.arr[a] + '과 ' + bubState.arr[b] + '을(를) 교환합니다!';
                    bubFlyEl.innerHTML = '';
                    bubAnimating = true;
                    bubStepBtn.disabled = true;
                    bubStepBtn.style.opacity = '0.5';
                    (function(idxA, idxB) {
                        var elA = bubArrEl.querySelector('#bub-box-' + idxA);
                        var elB = bubArrEl.querySelector('#bub-box-' + idxB);
                        var wrapRect = bubArrEl.parentElement.getBoundingClientRect();
                        if (!elA || !elB) { bubAnimating = false; bubStepBtn.disabled = false; bubStepBtn.style.opacity = ''; return; }
                        var rectA = elA.getBoundingClientRect();
                        var rectB = elB.getBoundingClientRect();
                        elA.style.opacity = '0.15'; elB.style.opacity = '0.15';
                        function mkG(val, rect, color) {
                            var g = document.createElement('div');
                            g.textContent = val;
                            g.className = 'str-char-box';
                            g.style.cssText = 'position:absolute;z-index:20;margin:0;' +
                                'left:' + (rect.left - wrapRect.left) + 'px;' +
                                'top:' + (rect.top - wrapRect.top) + 'px;' +
                                'width:' + rect.width + 'px;height:' + rect.height + 'px;' +
                                'display:flex;align-items:center;justify-content:center;' +
                                'transition:left 0.5s cubic-bezier(.4,0,.2,1);' +
                                'background:' + color + ';color:white;border-color:' + color + ';' +
                                'box-shadow:0 0 12px ' + color + ';transform:scale(1.1);';
                            return g;
                        }
                        var gA = mkG(valA, rectA, '#e17055');
                        var gB = mkG(valB, rectB, 'var(--yellow)');
                        bubFlyEl.appendChild(gA); bubFlyEl.appendChild(gB);
                        requestAnimationFrame(function() {
                            requestAnimationFrame(function() {
                                gA.style.left = (rectB.left - wrapRect.left) + 'px';
                                gB.style.left = (rectA.left - wrapRect.left) + 'px';
                            });
                        });
                        setTimeout(function() {
                            bubAnimating = false;
                            bubStepBtn.disabled = false;
                            bubStepBtn.style.opacity = '';
                            if (gA.parentNode) gA.parentNode.removeChild(gA);
                            if (gB.parentNode) gB.parentNode.removeChild(gB);
                            var tmp = bubState.arr[idxA]; bubState.arr[idxA] = bubState.arr[idxB]; bubState.arr[idxB] = tmp;
                            bubAdvanceJ();
                            renderBubArr();
                        }, 550);
                    })(a, b);
                }
            }

            function bubReset() {
                bubState = { arr: bubInitArr.slice(), pass: 0, j: 0, phase: 'compare', done: false };
                bubMsg.textContent = '▶ Step을 눌러 버블 정렬을 시작하세요!';
                renderBubArr();
            }

            container.querySelector('#sort-demo-bub-step').addEventListener('click', bubStep);
            container.querySelector('#sort-demo-bub-reset').addEventListener('click', bubReset);
            renderBubArr();
        }

        // ── 속도 비교 레이스 데모 ──
        {
            var raceInitArr = [64, 34, 25, 12, 22, 11, 90];

            function renderRaceArr(elId, arr, highlights) {
                var el = container.querySelector('#' + elId);
                if (!el) return;
                el.innerHTML = arr.map(function(v, idx) {
                    var cls = 'str-char-box';
                    var extra = 'font-size:0.78rem;min-width:28px;padding:4px 6px;';
                    if (highlights && highlights.sorted && idx < highlights.sorted) cls += ' matched';
                    if (highlights && highlights.active && highlights.active.indexOf(idx) >= 0) extra += 'border-color:var(--yellow);box-shadow:0 0 6px var(--yellow);';
                    return '<div class="' + cls + '" style="' + extra + '">' + v + '</div>';
                }).join('');
            }

            // Pre-compute all race steps once
            var raceSelSteps = [], raceInsSteps = [], raceBubSteps = [];
            var raceAllSteps = []; // unified steps array (one per tick)

            function raceBuildSteps() {
                raceSelSteps = []; raceInsSteps = []; raceBubSteps = [];

                // Selection sort steps
                (function() {
                    var a = raceInitArr.slice(), sw = 0;
                    for (var i = 0; i < a.length - 1; i++) {
                        var mi = i;
                        for (var j = i + 1; j < a.length; j++) {
                            raceSelSteps.push({ arr: a.slice(), cmp: raceSelSteps.length + 1, swp: sw, sorted: i, active: [mi, j] });
                            if (a[j] < a[mi]) mi = j;
                        }
                        if (mi !== i) { var t = a[i]; a[i] = a[mi]; a[mi] = t; sw++; }
                        raceSelSteps.push({ arr: a.slice(), cmp: raceSelSteps.length + 1, swp: sw, sorted: i + 1, active: [] });
                    }
                    raceSelSteps.push({ arr: a.slice(), cmp: raceSelSteps.length, swp: sw, sorted: a.length, active: [] });
                })();

                // Insertion sort steps
                (function() {
                    var a = raceInitArr.slice(), sw = 0;
                    for (var i = 1; i < a.length; i++) {
                        var key = a[i], j = i - 1;
                        while (j >= 0 && a[j] > key) {
                            raceInsSteps.push({ arr: a.slice(), cmp: raceInsSteps.length + 1, swp: sw, sorted: i, active: [j, j + 1] });
                            a[j + 1] = a[j]; j--; sw++;
                        }
                        raceInsSteps.push({ arr: a.slice(), cmp: raceInsSteps.length + 1, swp: sw, sorted: i, active: [j + 1] });
                        a[j + 1] = key;
                    }
                    raceInsSteps.push({ arr: a.slice(), cmp: raceInsSteps.length, swp: sw, sorted: a.length, active: [] });
                })();

                // Bubble sort steps
                (function() {
                    var a = raceInitArr.slice(), sw = 0;
                    for (var i = 0; i < a.length - 1; i++) {
                        for (var j = 0; j < a.length - 1 - i; j++) {
                            raceBubSteps.push({ arr: a.slice(), cmp: raceBubSteps.length + 1, swp: sw, sorted: a.length - i, active: [j, j + 1] });
                            if (a[j] > a[j + 1]) { var t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; sw++; }
                        }
                    }
                    raceBubSteps.push({ arr: a.slice(), cmp: raceBubSteps.length, swp: sw, sorted: 0, active: [] });
                })();

                var maxLen = Math.max(raceSelSteps.length, raceInsSteps.length, raceBubSteps.length);
                raceAllSteps = [];
                for (var t = 0; t < maxLen; t++) {
                    raceAllSteps.push(t);
                }
            }

            var raceStep = -1;

            function raceRenderStep(idx) {
                var maxLen = raceAllSteps.length;
                var si = Math.min(idx, raceSelSteps.length - 1);
                var ii = Math.min(idx, raceInsSteps.length - 1);
                var bi = Math.min(idx, raceBubSteps.length - 1);
                var ss = raceSelSteps[si], is2 = raceInsSteps[ii], bs = raceBubSteps[bi];
                renderRaceArr('sort-demo-race-sel', ss.arr, { sorted: ss.sorted, active: ss.active });
                container.querySelector('#sort-demo-race-sel-cmp').textContent = ss.cmp;
                container.querySelector('#sort-demo-race-sel-swp').textContent = ss.swp;
                renderRaceArr('sort-demo-race-ins', is2.arr, { sorted: is2.sorted, active: is2.active });
                container.querySelector('#sort-demo-race-ins-cmp').textContent = is2.cmp;
                container.querySelector('#sort-demo-race-ins-swp').textContent = is2.swp;
                renderRaceArr('sort-demo-race-bub', bs.arr, { sorted: bs.sorted, active: bs.active });
                container.querySelector('#sort-demo-race-bub-cmp').textContent = bs.cmp;
                container.querySelector('#sort-demo-race-bub-swp').textContent = bs.swp;
            }

            function raceUpdateUI() {
                var counterEl = container.querySelector('#sort-demo-race-counter');
                var msgEl = container.querySelector('#sort-demo-race-msg');
                var prevBtn = container.querySelector('#sort-demo-race-prev');
                var nextBtn = container.querySelector('#sort-demo-race-next');
                var maxLen = raceAllSteps.length;

                if (raceStep < 0) {
                    counterEl.textContent = '시작 전';
                    msgEl.textContent = '▶ "다음 →" 버튼을 눌러 세 정렬을 비교해보세요!';
                    renderRaceArr('sort-demo-race-sel', raceInitArr, {});
                    renderRaceArr('sort-demo-race-ins', raceInitArr, {});
                    renderRaceArr('sort-demo-race-bub', raceInitArr, {});
                    container.querySelector('#sort-demo-race-sel-cmp').textContent = '0';
                    container.querySelector('#sort-demo-race-sel-swp').textContent = '0';
                    container.querySelector('#sort-demo-race-ins-cmp').textContent = '0';
                    container.querySelector('#sort-demo-race-ins-swp').textContent = '0';
                    container.querySelector('#sort-demo-race-bub-cmp').textContent = '0';
                    container.querySelector('#sort-demo-race-bub-swp').textContent = '0';
                } else {
                    counterEl.textContent = (raceStep + 1) + ' / ' + maxLen;
                    raceRenderStep(raceStep);
                    if (raceStep >= maxLen - 1) {
                        var selF = raceSelSteps[raceSelSteps.length - 1], insF = raceInsSteps[raceInsSteps.length - 1], bubF = raceBubSteps[raceBubSteps.length - 1];
                        msgEl.textContent = '완료! 선택: 비교 ' + selF.cmp + '·교환 ' + selF.swp + ' | 삽입: 비교 ' + insF.cmp + '·이동 ' + insF.swp + ' | 버블: 비교 ' + bubF.cmp + '·교환 ' + bubF.swp;
                    } else {
                        msgEl.textContent = '경주 진행 중... 세 정렬이 동시에 한 단계씩 진행됩니다.';
                    }
                }
                prevBtn.disabled = raceStep < 0;
                nextBtn.disabled = raceStep >= maxLen - 1;
            }

            function raceReset() {
                raceStep = -1;
                raceUpdateUI();
            }

            raceBuildSteps();

            container.querySelector('#sort-demo-race-next').addEventListener('click', function() {
                if (raceStep < raceAllSteps.length - 1) { raceStep++; raceUpdateUI(); }
            });
            container.querySelector('#sort-demo-race-prev').addEventListener('click', function() {
                if (raceStep >= 0) { raceStep--; raceUpdateUI(); }
            });
            container.querySelector('#sort-demo-race-reset').addEventListener('click', raceReset);
            raceReset();
        }

        // ── 병합 정렬 미니 데모 (트리 시각화) ──
        {
            var mergeInitArr = [38, 27, 43, 3, 9, 82, 10];
            var mergeSteps = [];
            var mergeStepIdx = -1;
            var mergeVizEl = container.querySelector('#sort-demo-merge-viz');
            var mergeMsg = container.querySelector('#sort-demo-merge-msg');
            var mergeStepBtn = container.querySelector('#sort-demo-merge-step');

            // 트리 노드: { arr, left, right, merged, id }
            var mergeTree = null;
            var mergeNodeId = 0;

            function mergeBuildTree(arr) {
                var node = { arr: arr.slice(), left: null, right: null, merged: null, id: mergeNodeId++ };
                if (arr.length <= 1) { node.merged = arr.slice(); return node; }
                var mid = Math.floor(arr.length / 2);
                node.left = mergeBuildTree(arr.slice(0, mid));
                node.right = mergeBuildTree(arr.slice(mid));
                return node;
            }

            function mergeGetLevels(root) {
                // BFS로 레벨별 노드 수집
                var levels = [];
                var queue = [{ node: root, depth: 0 }];
                while (queue.length) {
                    var item = queue.shift();
                    if (!levels[item.depth]) levels[item.depth] = [];
                    levels[item.depth].push(item.node);
                    if (item.node.left) queue.push({ node: item.node.left, depth: item.depth + 1 });
                    if (item.node.right) queue.push({ node: item.node.right, depth: item.depth + 1 });
                }
                return levels;
            }

            function mergeBuildSteps() {
                mergeSteps = [];
                mergeNodeId = 0;
                mergeTree = mergeBuildTree(mergeInitArr);
                var levels = mergeGetLevels(mergeTree);

                // 초기: 전체 트리 레벨0만 보이기
                mergeSteps.push({ type: 'init', visibleDepth: 0, activeId: -1, mergeDetail: null, desc: '초기 배열: [' + mergeInitArr.join(', ') + ']. 반으로 나누어 가겠습니다!' });

                // 분할 단계: 한 레벨씩 펼치기
                for (var d = 1; d < levels.length; d++) {
                    mergeSteps.push({ type: 'split', visibleDepth: d, activeId: -1, mergeDetail: null, desc: '분할 (레벨 ' + d + '): 각 그룹을 반으로 나눕니다 → ' + levels[d].map(function(n) { return '[' + n.arr.join(',') + ']'; }).join('  ') });
                }

                // 합치기 단계: 가장 깊은 레벨부터 올라가며 합치기
                // 각 합치기는: 1) 합칠 대상 하이라이트, 2) 비교 디테일, 3) 합치기 완료
                function mergeCollect(node) {
                    if (!node.left || !node.right) return;
                    // 자식부터 먼저 합치기
                    mergeCollect(node.left);
                    mergeCollect(node.right);
                    // 이 노드에서 합치기
                    var a = node.left.merged, b = node.right.merged;
                    mergeSteps.push({ type: 'mergeStart', visibleDepth: levels.length - 1, activeId: node.id, focusIds: [node.id, node.left.id, node.right.id], mergeDetail: null, desc: '합치기: [' + a.join(',') + '] 와 [' + b.join(',') + '] 을 비교하며 합칩니다.' });
                    // 비교 스텝
                    var result = [], ai = 0, bi = 0;
                    while (ai < a.length && bi < b.length) {
                        var pick = a[ai] <= b[bi] ? 'left' : 'right';
                        var pickDesc = pick === 'left'
                            ? a[ai] + ' \u2264 ' + b[bi] + ' \u2192 \uc67c\ucabd(' + a[ai] + ')\uc744 \uacb0\uacfc\uc5d0 \ucd94\uac00'
                            : b[bi] + ' < ' + a[ai] + ' \u2192 \uc624\ub978\ucabd(' + b[bi] + ')\uc744 \uacb0\uacfc\uc5d0 \ucd94\uac00';
                        mergeSteps.push({ type: 'mergeCompare', visibleDepth: levels.length - 1, activeId: node.id, focusIds: [node.id, node.left.id, node.right.id], mergeDetail: { left: a.slice(), right: b.slice(), li: ai, ri: bi, result: result.slice(), pick: pick }, desc: '비교: ' + pickDesc });
                        if (pick === 'left') { result.push(a[ai]); ai++; }
                        else { result.push(b[bi]); bi++; }
                    }
                    while (ai < a.length) { result.push(a[ai]); ai++; }
                    while (bi < b.length) { result.push(b[bi]); bi++; }
                    node.merged = result;
                    mergeSteps.push({ type: 'mergeDone', visibleDepth: levels.length - 1, activeId: node.id, focusIds: [node.id, node.left.id, node.right.id], mergeDetail: null, desc: '합치기 완료! \u2192 [' + result.join(', ') + ']' });
                }
                mergeCollect(mergeTree);
                mergeSteps.push({ type: 'done', visibleDepth: 0, activeId: mergeTree.id, mergeDetail: null, desc: '정렬 완료! [' + mergeTree.merged.join(', ') + '] \u2014 O(n log n) 시간, O(n) 추가 메모리' });
            }

            function renderMergeTreeLevel(nodes, step) {
                var html = '';
                var hasFocus = step.focusIds && step.focusIds.length > 0;
                for (var i = 0; i < nodes.length; i++) {
                    var n = nodes[i];
                    var isMerged = n.merged !== null;
                    var isActive = step.activeId === n.id;
                    var isDone = step.type === 'done';
                    var isFocused = !hasFocus || step.focusIds.indexOf(n.id) >= 0;
                    var dimStyle = (!isFocused && !isDone) ? 'opacity:0.3;' : '';
                    var vals = isMerged ? n.merged : n.arr;
                    var borderColor = 'var(--bg3)';
                    var shadow = '';
                    if (isDone) { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 10px var(--green);'; }
                    else if (isActive && step.type === 'mergeDone') { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 10px var(--green);'; }
                    else if (isActive && (step.type === 'mergeStart' || step.type === 'mergeCompare')) { borderColor = 'var(--yellow)'; shadow = 'box-shadow:0 0 8px var(--yellow);'; }
                    html += '<div style="display:flex;gap:3px;padding:4px 8px;border-radius:8px;border:2px solid ' + borderColor + ';background:var(--bg2);' + shadow + dimStyle + 'transition:opacity 0.3s;" data-merge-node="' + n.id + '">';
                    for (var j = 0; j < vals.length; j++) {
                        var ecls = 'str-char-box';
                        var estyle = 'min-width:28px;padding:3px 6px;font-size:0.82rem;';
                        if (isDone || (isActive && step.type === 'mergeDone')) ecls += ' matched';
                        html += '<div class="' + ecls + '" style="' + estyle + '">' + vals[j] + '</div>';
                    }
                    html += '</div>';
                }
                return html;
            }

            function renderMergeViz(step) {
                if (!step) { mergeVizEl.innerHTML = ''; return; }
                var levels = mergeGetLevels(mergeTree);
                var maxDepth = step.visibleDepth;
                // 분할/합치기 구분: 합치기 단계에서는 모든 레벨 표시
                if (step.type === 'mergeStart' || step.type === 'mergeCompare' || step.type === 'mergeDone' || step.type === 'done') {
                    maxDepth = levels.length - 1;
                }

                var html = '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;min-width:fit-content;">';
                for (var d = 0; d <= maxDepth && d < levels.length; d++) {
                    // 레벨 라벨
                    html += '<div style="display:flex;align-items:center;gap:10px;width:100%;justify-content:center;">';
                    html += '<span style="font-size:0.65rem;color:var(--text3);min-width:14px;text-align:right;">L' + d + '</span>';
                    html += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:nowrap;">';
                    html += renderMergeTreeLevel(levels[d], step);
                    html += '</div></div>';
                    // 연결선 (다음 레벨이 있을 때)
                    if (d < maxDepth && d + 1 < levels.length) {
                        html += '<div style="text-align:center;color:var(--text3);font-size:0.7rem;line-height:1;letter-spacing:2px;">';
                        var connectors = [];
                        for (var ni = 0; ni < levels[d].length; ni++) {
                            if (levels[d][ni].left) connectors.push('\u2571\u2572');
                            else connectors.push('\u2502');
                        }
                        html += connectors.join('&nbsp;&nbsp;&nbsp;&nbsp;');
                        html += '</div>';
                    }
                }

                // 합치기 디테일 (비교 진행 중이면 트리 아래에 표시)
                if (step.mergeDetail) {
                    var d2 = step.mergeDetail;
                    var leftVal = d2.left[d2.li];
                    var rightVal = d2.right[d2.ri];
                    var pickedVal = d2.pick === 'left' ? leftVal : rightVal;
                    var isLeftSmaller = d2.pick === 'left';
                    html += '<div style="margin-top:12px;padding:14px 18px;border:2px solid var(--yellow);border-radius:10px;background:var(--bg2);">';
                    // 비교 영역: 왼쪽 값 vs 오른쪽 값
                    html += '<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px;">';
                    html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
                    html += '<span style="font-size:0.65rem;color:var(--accent);font-weight:700;">왼쪽</span>';
                    html += '<div class="str-char-box" style="min-width:36px;padding:6px 10px;font-size:1rem;font-weight:700;' + (isLeftSmaller ? 'border-color:var(--green);box-shadow:0 0 12px var(--green);background:rgba(0,184,148,0.15);' : 'border-color:var(--bg3);') + '">' + leftVal + '</div>';
                    if (isLeftSmaller) html += '<span style="font-size:0.6rem;color:var(--green);font-weight:700;">✓ 더 작음!</span>';
                    html += '</div>';
                    html += '<span style="font-size:1.2rem;font-weight:700;color:var(--text3);">vs</span>';
                    html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
                    html += '<span style="font-size:0.65rem;color:var(--yellow);font-weight:700;">오른쪽</span>';
                    html += '<div class="str-char-box" style="min-width:36px;padding:6px 10px;font-size:1rem;font-weight:700;' + (!isLeftSmaller ? 'border-color:var(--green);box-shadow:0 0 12px var(--green);background:rgba(0,184,148,0.15);' : 'border-color:var(--bg3);') + '">' + rightVal + '</div>';
                    if (!isLeftSmaller) html += '<span style="font-size:0.6rem;color:var(--green);font-weight:700;">✓ 더 작음!</span>';
                    html += '</div>';
                    html += '</div>';
                    // 화살표 → 결과
                    html += '<div style="text-align:center;color:var(--green);font-size:0.9rem;margin-bottom:8px;">↓ 결과에 추가</div>';
                    // 결과 배열
                    html += '<div style="display:flex;gap:6px;align-items:center;justify-content:center;">';
                    html += '<span style="font-size:0.72rem;color:var(--green);font-weight:700;">결과</span>';
                    for (var r = 0; r < d2.result.length; r++) {
                        html += '<div class="str-char-box matched" style="min-width:28px;padding:3px 6px;font-size:0.82rem;">' + d2.result[r] + '</div>';
                    }
                    html += '<div class="str-char-box" style="min-width:28px;padding:3px 6px;font-size:0.82rem;border-color:var(--green);box-shadow:0 0 10px var(--green);background:rgba(0,184,148,0.15);">' + pickedVal + '</div>';
                    html += '</div>';
                    html += '</div>';
                }

                html += '</div>';
                mergeVizEl.innerHTML = html;
            }

            function mergeResetTree() {
                // 트리의 merged를 리셋 (리프 제외)
                function resetNode(node) {
                    if (!node) return;
                    if (node.left || node.right) node.merged = null;
                    else node.merged = node.arr.slice();
                    resetNode(node.left);
                    resetNode(node.right);
                }
                resetNode(mergeTree);
            }

            function mergeFindNode(node, id) {
                if (!node) return null;
                if (node.id === id) return node;
                return mergeFindNode(node.left, id) || mergeFindNode(node.right, id);
            }

            function mergeApplyStepsUpTo(idx) {
                mergeResetTree();
                for (var si = 0; si <= idx; si++) {
                    var s = mergeSteps[si];
                    if (s.type === 'mergeDone') {
                        // 해당 노드의 merged를 계산하여 설정
                        var nd = mergeFindNode(mergeTree, s.activeId);
                        if (nd && nd.left && nd.right && nd.left.merged && nd.right.merged) {
                            var a = nd.left.merged, b = nd.right.merged;
                            var result = [], ai = 0, bi = 0;
                            while (ai < a.length && bi < b.length) {
                                if (a[ai] <= b[bi]) { result.push(a[ai]); ai++; }
                                else { result.push(b[bi]); bi++; }
                            }
                            while (ai < a.length) { result.push(a[ai]); ai++; }
                            while (bi < b.length) { result.push(b[bi]); bi++; }
                            nd.merged = result;
                        }
                    }
                }
            }

            function mergeStep() {
                if (mergeStepIdx >= mergeSteps.length - 1) return;
                mergeStepIdx++;
                mergeApplyStepsUpTo(mergeStepIdx);
                var s = mergeSteps[mergeStepIdx];
                mergeMsg.textContent = s.desc;
                renderMergeViz(s);
            }

            function mergeReset() {
                mergeStepIdx = -1;
                mergeResetTree();
                mergeBuildSteps();
                mergeMsg.textContent = '\u25B6 Step\uc744 \ub20c\ub7ec \ubcd1\ud569 \uc815\ub82c\uc744 \uc2dc\uc791\ud558\uc138\uc694!';
                mergeVizEl.innerHTML = '';
            }

            mergeBuildSteps();
            mergeStepBtn.addEventListener('click', mergeStep);
            container.querySelector('#sort-demo-merge-reset').addEventListener('click', mergeReset);
        }

        // ── 퀵 정렬 미니 데모 (트리 시각화) ──
        {
            var quickInitArr = [38, 27, 43, 3, 9, 82, 10];
            var quickSteps = [];
            var quickStepIdx = -1;
            var quickVizEl = container.querySelector('#sort-demo-quick-viz');
            var quickMsg = container.querySelector('#sort-demo-quick-msg');
            var quickStepBtn = container.querySelector('#sort-demo-quick-step');

            // 퀵 정렬 트리 노드: { arr, pivot, left, pivotNode, right, sorted, id, depth }
            var quickTree = null;
            var quickNodeId = 0;

            function quickBuildTree(arr, depth) {
                var node = { arr: arr.slice(), pivot: null, left: null, pivotNode: null, right: null, sorted: null, id: quickNodeId++, depth: depth };
                if (arr.length <= 1) { node.sorted = arr.slice(); return node; }
                var pivotIdx = Math.floor(arr.length / 2);
                var pivot = arr[pivotIdx];
                node.pivot = pivot;
                var leftArr = [], equalArr = [], rightArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] < pivot) leftArr.push(arr[i]);
                    else if (arr[i] > pivot) rightArr.push(arr[i]);
                    else equalArr.push(arr[i]);
                }
                node.left = quickBuildTree(leftArr, depth + 1);
                node.pivotNode = { arr: equalArr.slice(), sorted: equalArr.slice(), id: quickNodeId++, depth: depth + 1, pivot: null, left: null, pivotNode: null, right: null };
                node.right = quickBuildTree(rightArr, depth + 1);
                return node;
            }

            function quickGetLevels(root) {
                var levels = [];
                var queue = [{ node: root, depth: 0, type: 'main' }];
                while (queue.length) {
                    var item = queue.shift();
                    if (!levels[item.depth]) levels[item.depth] = [];
                    levels[item.depth].push({ node: item.node, type: item.type });
                    if (item.node.left) queue.push({ node: item.node.left, depth: item.depth + 1, type: 'left' });
                    if (item.node.pivotNode) queue.push({ node: item.node.pivotNode, depth: item.depth + 1, type: 'pivot' });
                    if (item.node.right) queue.push({ node: item.node.right, depth: item.depth + 1, type: 'right' });
                }
                return levels;
            }

            function quickBuildSteps() {
                quickSteps = [];
                quickNodeId = 0;
                quickTree = quickBuildTree(quickInitArr, 0);

                quickSteps.push({ type: 'init', activeId: -1, scanDetail: null, desc: '초기 배열: [' + quickInitArr.join(', ') + ']. 퀵 정렬을 시작합니다!' });

                function processNode(node, label) {
                    if (node.arr.length <= 1) {
                        if (node.arr.length === 1) {
                            node.sorted = node.arr.slice();
                            quickSteps.push({ type: 'base', activeId: node.id, scanDetail: null, desc: label + '[' + node.arr[0] + '] \u2014 \uc6d0\uc18c 1\uac1c\ub294 \uc774\ubbf8 \uc815\ub82c\ub418\uc5b4 \uc788\uc2b5\ub2c8\ub2e4!' });
                        }
                        return;
                    }
                    // 피벗 선택
                    quickSteps.push({ type: 'choose', activeId: node.id, scanDetail: null, desc: label + '배열 [' + node.arr.join(', ') + ']에서 피벗 = ' + node.pivot + ' (중간값) 을 선택합니다.' });

                    // 스캔 — 각 원소를 좌/우/피벗으로 분류
                    var leftSoFar = [], equalSoFar = [], rightSoFar = [];
                    for (var i = 0; i < node.arr.length; i++) {
                        var v = node.arr[i];
                        var side = v < node.pivot ? 'left' : (v > node.pivot ? 'right' : 'equal');
                        if (side === 'left') leftSoFar.push(v);
                        else if (side === 'right') rightSoFar.push(v);
                        else equalSoFar.push(v);
                        quickSteps.push({
                            type: 'scan', activeId: node.id,
                            scanDetail: { sub: node.arr, pivot: node.pivot, scanIdx: i, left: leftSoFar.slice(), right: rightSoFar.slice(), equal: equalSoFar.slice() },
                            desc: v + (side === 'left' ? ' < ' + node.pivot + ' \u2192 \uc67c\ucabd\uc73c\ub85c' : (side === 'right' ? ' > ' + node.pivot + ' \u2192 \uc624\ub978\ucabd\uc73c\ub85c' : ' == ' + node.pivot + ' \u2192 \ud53c\ubc97 \uadf8\ub8f9\uc73c\ub85c'))
                        });
                    }

                    // 파티션 완료 — 트리에 자식 레벨 보이기
                    quickSteps.push({ type: 'partitioned', activeId: node.id, scanDetail: null, desc: '파티션 완료! 왼쪽[' + node.left.arr.join(',') + '] | 피벗[' + node.pivotNode.arr.join(',') + '] | 오른쪽[' + node.right.arr.join(',') + ']' });

                    // 왼쪽 재귀
                    processNode(node.left, '왼쪽 부분: ');
                    // 오른쪽 재귀
                    processNode(node.right, '오른쪽 부분: ');

                    // 결합
                    var sortedLeft = node.left.sorted || [];
                    var sortedRight = node.right.sorted || [];
                    var pivotArr = node.pivotNode.sorted || [];
                    node.sorted = sortedLeft.concat(pivotArr).concat(sortedRight);
                    quickSteps.push({ type: 'combined', activeId: node.id, scanDetail: null, desc: '결합: [' + sortedLeft.join(',') + '] + [' + pivotArr.join(',') + '] + [' + sortedRight.join(',') + '] = [' + node.sorted.join(', ') + ']' });
                }

                processNode(quickTree, '');
                quickSteps.push({ type: 'done', activeId: quickTree.id, scanDetail: null, desc: '정렬 완료! [' + quickTree.sorted.join(', ') + '] \u2014 평균 O(n log n)' });
            }

            function renderQuickNodeBox(node, step, isPivotChild) {
                var isActive = step.activeId === node.id;
                var isSorted = node.sorted !== null;
                var isDone = step.type === 'done';
                var vals = isSorted ? node.sorted : node.arr;
                var borderColor = 'var(--bg3)';
                var shadow = '';
                var pivotLabel = '';
                if (isDone) { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 10px var(--green);'; }
                else if (isActive && step.type === 'combined') { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 10px var(--green);'; }
                else if (isActive && step.type === 'choose') { borderColor = 'var(--yellow)'; shadow = 'box-shadow:0 0 8px var(--yellow);'; }
                else if (isActive && (step.type === 'scan' || step.type === 'partitioned')) { borderColor = 'var(--yellow)'; shadow = 'box-shadow:0 0 8px var(--yellow);'; }
                else if (isActive && step.type === 'base') { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 8px var(--green);'; }
                if (isPivotChild) { borderColor = 'var(--yellow)'; shadow = 'box-shadow:0 0 6px var(--yellow);'; pivotLabel = '<div style="font-size:0.6rem;color:var(--yellow);font-weight:700;text-align:center;">pivot</div>'; }

                var html = '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div style="display:flex;gap:3px;padding:4px 8px;border-radius:8px;border:2px solid ' + borderColor + ';background:var(--bg2);' + shadow + '">';
                for (var j = 0; j < vals.length; j++) {
                    var ecls = 'str-char-box';
                    var estyle = 'min-width:28px;padding:3px 6px;font-size:0.82rem;';
                    if (isDone || (isActive && step.type === 'combined') || (isActive && step.type === 'base')) ecls += ' matched';
                    html += '<div class="' + ecls + '" style="' + estyle + '">' + vals[j] + '</div>';
                }
                if (vals.length === 0) html += '<span style="color:var(--text3);font-size:0.75rem;">빈</span>';
                html += '</div>' + pivotLabel + '</div>';
                return html;
            }

            function renderQuickViz(step) {
                if (!step) { quickVizEl.innerHTML = ''; return; }

                // 스캔 디테일이 있으면 트리 + 디테일 모두 표시
                var html = '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;min-width:fit-content;">';

                // 트리를 DFS로 렌더링 (각 레벨)
                function collectVisible(node) {
                    if (!node) return [];
                    var result = [{ node: node, children: [] }];
                    if (node._expanded) {
                        var leftChildren = collectVisible(node.left);
                        var pivotChildren = node.pivotNode ? [{ node: node.pivotNode, children: [], isPivot: true }] : [];
                        var rightChildren = collectVisible(node.right);
                        result[0].children = leftChildren.concat(pivotChildren).concat(rightChildren);
                    }
                    return result;
                }

                function renderLevel(items, step, depth) {
                    if (!items.length) return '';
                    var h = '<div style="display:flex;align-items:flex-start;gap:10px;width:100%;justify-content:center;">';
                    h += '<span style="font-size:0.65rem;color:var(--text3);min-width:14px;text-align:right;">L' + depth + '</span>';
                    h += '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:nowrap;">';
                    for (var i = 0; i < items.length; i++) {
                        h += renderQuickNodeBox(items[i].node, step, items[i].isPivot || false);
                    }
                    h += '</div></div>';
                    // 연결선
                    var hasChildren = items.some(function(it) { return it.children && it.children.length > 0; });
                    if (hasChildren) {
                        h += '<div style="text-align:center;color:var(--text3);font-size:0.7rem;line-height:1;letter-spacing:2px;">';
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].children && items[i].children.length > 0) h += '\u2571\u2502\u2572';
                            else h += '\u2502';
                            if (i < items.length - 1) h += '&nbsp;&nbsp;';
                        }
                        h += '</div>';
                        // 다음 레벨
                        var nextItems = [];
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].children) nextItems = nextItems.concat(items[i].children);
                        }
                        h += renderLevel(nextItems, step, depth + 1);
                    }
                    return h;
                }

                var tree = collectVisible(quickTree);
                html += renderLevel(tree, step, 0);

                // 스캔 디테일
                if (step.scanDetail) {
                    var sd = step.scanDetail;
                    html += '<div style="margin-top:12px;padding:10px 16px;border:2px solid var(--yellow);border-radius:10px;background:var(--bg2);">';
                    html += '<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">';
                    for (var i = 0; i < sd.sub.length; i++) {
                        var ex = '';
                        if (i === sd.scanIdx) ex = 'border-color:var(--accent);box-shadow:0 0 10px var(--accent);transform:scale(1.1);';
                        else if (i < sd.scanIdx) ex = 'opacity:0.4;';
                        html += '<div class="str-char-box" style="min-width:28px;padding:3px 6px;font-size:0.82rem;' + ex + '">' + sd.sub[i] + '</div>';
                    }
                    html += '</div>';
                    html += '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">';
                    html += '<div style="text-align:center;"><div style="font-size:0.68rem;color:var(--accent);font-weight:700;margin-bottom:3px;">왼쪽 (&lt;' + sd.pivot + ')</div><div style="display:flex;gap:3px;justify-content:center;min-height:30px;padding:3px 6px;border:1.5px dashed var(--accent);border-radius:8px;">';
                    sd.left.forEach(function(v) { html += '<div class="str-char-box" style="font-size:0.78rem;min-width:26px;padding:2px 4px;">' + v + '</div>'; });
                    html += '</div></div>';
                    html += '<div style="text-align:center;"><div style="font-size:0.68rem;color:var(--yellow);font-weight:700;margin-bottom:3px;">피벗 (=' + sd.pivot + ')</div><div style="display:flex;gap:3px;justify-content:center;min-height:30px;padding:3px 6px;border:1.5px dashed var(--yellow);border-radius:8px;">';
                    sd.equal.forEach(function(v) { html += '<div class="str-char-box" style="font-size:0.78rem;min-width:26px;padding:2px 4px;border-color:var(--yellow);">' + v + '</div>'; });
                    html += '</div></div>';
                    html += '<div style="text-align:center;"><div style="font-size:0.68rem;color:var(--red);font-weight:700;margin-bottom:3px;">오른쪽 (&gt;' + sd.pivot + ')</div><div style="display:flex;gap:3px;justify-content:center;min-height:30px;padding:3px 6px;border:1.5px dashed var(--red, #e17055);border-radius:8px;">';
                    sd.right.forEach(function(v) { html += '<div class="str-char-box" style="font-size:0.78rem;min-width:26px;padding:2px 4px;">' + v + '</div>'; });
                    html += '</div></div></div></div>';
                }

                html += '</div>';
                quickVizEl.innerHTML = html;
            }

            // 트리의 _expanded 상태를 스텝에 맞춰 업데이트
            function quickResetExpanded(node) {
                if (!node) return;
                node._expanded = false;
                quickResetExpanded(node.left);
                quickResetExpanded(node.pivotNode);
                quickResetExpanded(node.right);
            }

            function quickApplyStepsUpTo(idx) {
                quickResetExpanded(quickTree);
                // sorted도 리셋
                function resetSorted(n) {
                    if (!n) return;
                    if (n.left || n.right) n.sorted = null;
                    else if (n.arr.length <= 1) n.sorted = n.arr.slice();
                    resetSorted(n.left);
                    resetSorted(n.pivotNode);
                    resetSorted(n.right);
                }
                resetSorted(quickTree);

                // 스텝을 순서대로 적용하여 expanded/sorted 상태 복원
                for (var si = 0; si <= idx; si++) {
                    var s = quickSteps[si];
                    if (s.type === 'partitioned') {
                        // 해당 노드를 찾아 expanded 설정
                        var nd = quickFindNode(quickTree, s.activeId);
                        if (nd) nd._expanded = true;
                    } else if (s.type === 'combined') {
                        var nd2 = quickFindNode(quickTree, s.activeId);
                        if (nd2 && nd2.left && nd2.right && nd2.pivotNode) {
                            var sl = nd2.left.sorted || [];
                            var sr = nd2.right.sorted || [];
                            var sp = nd2.pivotNode.sorted || [];
                            nd2.sorted = sl.concat(sp).concat(sr);
                        }
                    } else if (s.type === 'base') {
                        var nd3 = quickFindNode(quickTree, s.activeId);
                        if (nd3) nd3.sorted = nd3.arr.slice();
                    } else if (s.type === 'done') {
                        // 전체 sorted 완료
                        var nd4 = quickFindNode(quickTree, s.activeId);
                        if (nd4 && !nd4.sorted) {
                            var sl2 = nd4.left ? (nd4.left.sorted || []) : [];
                            var sr2 = nd4.right ? (nd4.right.sorted || []) : [];
                            var sp2 = nd4.pivotNode ? (nd4.pivotNode.sorted || []) : [];
                            nd4.sorted = sl2.concat(sp2).concat(sr2);
                        }
                    }
                }
            }

            function quickFindNode(node, id) {
                if (!node) return null;
                if (node.id === id) return node;
                return quickFindNode(node.left, id) || quickFindNode(node.pivotNode, id) || quickFindNode(node.right, id);
            }

            function quickStep() {
                if (quickStepIdx >= quickSteps.length - 1) return;
                quickStepIdx++;
                var s = quickSteps[quickStepIdx];
                quickApplyStepsUpTo(quickStepIdx);
                quickMsg.textContent = s.desc;
                renderQuickViz(s);
            }

            function quickReset() {
                quickStepIdx = -1;
                quickResetExpanded(quickTree);
                quickBuildSteps();
                quickMsg.textContent = '\u25B6 Step\uc744 \ub20c\ub7ec \ud035 \uc815\ub82c\uc744 \uc2dc\uc791\ud558\uc138\uc694!';
                quickVizEl.innerHTML = '';
            }

            quickBuildSteps();
            quickStepBtn.addEventListener('click', quickStep);
            container.querySelector('#sort-demo-quick-reset').addEventListener('click', quickReset);
        }

        // ── 커스텀 정렬 미니 데모 ──
        {
            var customData = [
                { name: '민수', score: 72 },
                { name: '지은', score: 95 },
                { name: '서연', score: 88 },
                { name: '하준', score: 65 },
                { name: '소율', score: 91 },
                { name: '예준', score: 80 }
            ];
            var customOriginal = customData.slice();
            var customArrEl = container.querySelector('#sort-demo-custom-arr');
            var customMsg = container.querySelector('#sort-demo-custom-msg');
            var customBtns = container.querySelector('#sort-demo-custom-btns');
            var customActiveKey = null;

            function renderCustomArr(data, highlightKey) {
                customArrEl.style.opacity = '0';
                setTimeout(function() {
                    customArrEl.innerHTML = data.map(function(s, i) {
                        var keyVal = highlightKey === 'score' ? s.score + '점'
                                   : highlightKey === 'length' ? s.name.length + '글자'
                                   : '';
                        return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">' +
                            '<div class="str-char-box" style="min-width:56px;padding:8px 10px;font-size:0.88rem;' +
                            'border-color:var(--accent);box-shadow:0 0 6px rgba(108,92,231,0.15);">' +
                            '<strong>' + s.name + '</strong><br>' +
                            '<span style="font-size:0.78rem;color:var(--text2);">' + s.score + '점</span></div>' +
                            (keyVal ? '<span style="font-size:0.72rem;color:var(--accent);font-weight:600;">key: ' + keyVal + '</span>' : '') +
                            '</div>';
                    }).join('');
                    customArrEl.style.opacity = '1';
                }, 180);
            }

            function customSortBy(key) {
                var sorted = customData.slice();
                if (key === 'score') {
                    sorted.sort(function(a, b) { return a.score - b.score; });
                    customMsg.innerHTML = '<span class="lang-py"><code>sort(key=lambda x: x.score)</code> → 점수가 낮은 순서대로!</span>' +
                        '<span class="lang-cpp"><code>sort(…, [](auto& a, auto& b){ return a.score < b.score; })</code> → 점수가 낮은 순서대로!</span>';
                } else if (key === 'name') {
                    sorted.sort(function(a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
                    customMsg.innerHTML = '<span class="lang-py"><code>sort(key=lambda x: x.name)</code> → 이름 가나다순!</span>' +
                        '<span class="lang-cpp"><code>sort(…, [](auto& a, auto& b){ return a.name < b.name; })</code> → 이름 사전순!</span>';
                } else if (key === 'length') {
                    sorted.sort(function(a, b) { return a.name.length - b.name.length; });
                    customMsg.innerHTML = '<span class="lang-py"><code>sort(key=lambda x: len(x.name))</code> → 이름이 짧은 순서대로!</span>' +
                        '<span class="lang-cpp"><code>sort(…, [](auto& a, auto& b){ return a.name.size() < b.name.size(); })</code> → 이름이 짧은 순서대로!</span>';
                } else {
                    sorted = customOriginal.slice();
                    customMsg.textContent = '원래 순서로 돌아왔습니다.';
                }
                customData = sorted;
                renderCustomArr(sorted, key === 'reset' ? null : key);
            }

            renderCustomArr(customOriginal, null);

            customBtns.addEventListener('click', function(e) {
                var btn = e.target.closest('[data-key]');
                if (!btn) return;
                var key = btn.getAttribute('data-key');
                customActiveKey = key === 'reset' ? null : key;
                customBtns.querySelectorAll('.concept-demo-btn:not(.danger)').forEach(function(b) {
                    b.style.background = b.getAttribute('data-key') === customActiveKey ? 'var(--accent)' : '';
                    b.style.color = b.getAttribute('data-key') === customActiveKey ? 'white' : '';
                });
                customSortBy(key);
            });
        }
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

    _createStepDesc(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25B6 다음 버튼을 눌러 시작하세요</div>';
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
        var s = suffix || '';
        var current = -1;
        var actionDelay = 350;
        var counter = container.querySelector('#viz-step-counter' + s);
        var prevBtn = container.querySelector('#viz-prev' + s);
        var nextBtn = container.querySelector('#viz-next' + s);
        if (!counter || !prevBtn || !nextBtn) return;
        var total = steps.length;
        var self = this;
        var descEl = container.querySelector('#viz-step-desc' + s);
        var updateUI = function() {
            if (current < 0) {
                counter.textContent = '시작 전';
                if (descEl) descEl.innerHTML = '\u25B6 다음 버튼을 눌러 시작하세요';
                prevBtn.disabled = true;
                nextBtn.disabled = false;
            } else {
                counter.textContent = (current + 1) + ' / ' + total;
                if (descEl && steps[current].description) descEl.innerHTML = steps[current].description;
                prevBtn.disabled = current === 0;
                nextBtn.disabled = current >= total - 1;
            }
            self._vizState.currentStep = current;
        };
        nextBtn.addEventListener('click', function() {
            if (current >= total - 1) return;
            current++;
            updateUI();
            setTimeout(function() { steps[current].action(); }, actionDelay);
        });
        prevBtn.addEventListener('click', function() {
            if (current < 0) return;
            current--;
            updateUI();
            setTimeout(function() {
                if (current >= 0) {
                    steps[current].action();
                }
            }, actionDelay);
        });
        var keyHandler = function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ') { nextBtn.click(); e.preventDefault(); }
            if (e.key === 'ArrowLeft') { prevBtn.click(); e.preventDefault(); }
        };
        document.addEventListener('keydown', keyHandler);
        self._vizState.keydownHandler = keyHandler;
        self._vizState.steps = steps;
        updateUI();
    },

    // ── 바 차트 렌더 유틸 ──
    _renderBars(el, arr, sortedUpTo, comparing, minIdx) {
        var maxVal = Math.max.apply(null, arr);
        el.innerHTML = arr.map(function(v, i) {
            var bg = 'var(--accent)';
            if (i <= sortedUpTo) bg = 'var(--green)';
            else if (i === minIdx) bg = 'var(--yellow)';
            else if (comparing && comparing.indexOf(i) >= 0) bg = 'var(--red, #e17055)';
            var h = Math.max(20, (v / maxVal) * 160);
            return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">' +
                '<span style="font-size:0.8rem;font-weight:600;">' + v + '</span>' +
                '<div style="width:36px;height:' + h + 'px;background:' + bg + ';border-radius:4px 4px 0 0;transition:all 0.3s;"></div></div>';
        }).join('');
    },

    // ── 커트라인 (boj-25305) ──
    _renderVizCutline(container) {
        var self = this;
        var DEFAULT_SCORES = [100, 76, 85, 93, 98];
        var DEFAULT_K = 2;

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">점수: <input type="text" id="sort-cut-input" value="' + DEFAULT_SCORES.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<label style="font-weight:600;">k: <input type="number" id="sort-cut-k" value="' + DEFAULT_K + '" min="1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
                '<button class="btn btn-primary" id="sort-cut-reset">\uD83D\uDD04</button>' +
            '</div>' +
            self._createStepDesc('-cut') +
            '<div class="viz-area" style="position:relative;">' +
                '<div id="sort-bars-cut" style="display:flex;gap:6px;align-items:flex-end;justify-content:center;min-height:220px;padding:20px 0;"></div>' +
                '<div id="sort-fly-cut" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            self._createStepControls('-cut');

        var barsEl = container.querySelector('#sort-bars-cut');
        var flyEl = container.querySelector('#sort-fly-cut');

        function renderCutBars(arr, highlights) {
            // highlights: { sorted: bool, kIdx: number, counting: number[], answer: number }
            var hl = highlights || {};
            var maxVal = Math.max.apply(null, arr);
            barsEl.innerHTML = arr.map(function(v, i) {
                var bg = 'var(--accent)';
                var glow = '';
                var lbl = '<span style="font-size:0.65rem;color:var(--text2);">[' + i + ']</span>';
                if (hl.answer === i) {
                    bg = 'var(--green)';
                    glow = 'box-shadow:0 0 16px var(--green);';
                    lbl = '<span style="font-size:0.6rem;color:var(--green);font-weight:700;">k=' + (i + 1) + ' \u2713</span>';
                } else if (hl.counting && hl.counting.indexOf(i) >= 0) {
                    bg = 'var(--yellow)';
                    glow = 'box-shadow:0 0 10px var(--yellow);';
                    lbl = '<span style="font-size:0.6rem;color:var(--yellow);font-weight:700;">' + (i + 1) + '\uBC88\uC9F8</span>';
                } else if (hl.sorted) {
                    bg = '#636e72';
                }
                var h = Math.max(20, (v / maxVal) * 160);
                return '<div id="sort-bar-cut-' + i + '" style="display:flex;flex-direction:column;align-items:center;gap:4px;transition:opacity 0.3s;">' +
                    '<span style="font-size:0.8rem;font-weight:600;">' + v + '</span>' +
                    '<div style="width:36px;height:' + h + 'px;background:' + bg + ';border-radius:4px 4px 0 0;transition:all 0.3s;' + glow + '"></div>' +
                    lbl + '</div>';
            }).join('');
        }

        function buildCutlineSteps(scores, k) {
            var steps = [];
            var arr = scores.slice();
            var n = arr.length;
            if (k < 1) k = 1;
            if (k > n) k = n;

            // Step 0: show original
            steps.push({
                description: '\uCD08\uAE30 \uBC30\uC5F4: [' + arr.join(', ') + ']. N=' + n + '\uBA85\uC758 \uC810\uC218\uAC00 \uC8FC\uC5B4\uC84C\uACE0, \uC0C1\uC704 k=' + k + '\uBA85\uC5D0\uAC8C \uC0C1\uC744 \uC900\uB2E4.',
                action: function() { renderCutBars(arr, {}); }
            });

            // Step 1: why sort?
            steps.push({
                description: '\uC0C1\uC704 ' + k + '\uBA85\uC744 \uCC3E\uC73C\uB824\uBA74 \uB0B4\uB9BC\uCC28\uC21C\uC73C\uB85C \uC815\uB82C\uD574\uC57C \uD569\uB2C8\uB2E4. \uAC00\uC7A5 \uB192\uC740 \uC810\uC218\uAC00 \uC55E\uC73C\uB85C \uC624\uB3C4\uB85D!',
                action: function() { renderCutBars(arr, {}); }
            });

            // Step 2: sort descending
            var sorted = arr.slice().sort(function(a, b) { return b - a; });
            steps.push({
                description: '\uB0B4\uB9BC\uCC28\uC21C \uC815\uB82C \uC644\uB8CC! [' + sorted.join(', ') + ']. \uC774\uC81C \uC55E\uC5D0\uC11C\uBD80\uD130 k\uBC88\uC9F8\uAE4C\uC9C0\uAC00 \uC0C1\uC744 \uBC1B\uB294 \uC0AC\uB78C\uB4E4\uC785\uB2C8\uB2E4.',
                action: function() { renderCutBars(sorted, { sorted: true }); }
            });

            // Steps 3~3+k-1: count k positions one by one
            for (var c = 0; c < k; c++) {
                (function(idx) {
                    var countArr = [];
                    for (var ci = 0; ci <= idx; ci++) countArr.push(ci);
                    var isLast = idx === k - 1;
                    var desc = (idx + 1) + '\uBC88\uC9F8: \uC810\uC218 ' + sorted[idx] + (isLast ? ' \u2190 \uC774\uAC83\uC774 \uCEE4\uD2B8\uB77C\uC778! \uC0C1\uC744 \uBC1B\uB294 \uAC00\uC7A5 \uB0AE\uC740 \uC810\uC218\uC785\uB2C8\uB2E4.' : '');
                    steps.push({
                        description: desc,
                        action: function() {
                            renderCutBars(sorted, { sorted: true, counting: countArr, answer: isLast ? idx : -1 });
                        }
                    });
                })(c);
            }

            // Final step
            steps.push({
                description: '\uC815\uB2F5: \uCEE4\uD2B8\uB77C\uC778\uC740 ' + sorted[k - 1] + '\uC785\uB2C8\uB2E4! \uB0B4\uB9BC\uCC28\uC21C \uC815\uB82C \uD6C4 ' + k + '\uBC88\uC9F8 \uC6D0\uC18C(0-indexed: arr[' + (k - 1) + '])\uB97C \uCD9C\uB825\uD558\uBA74 \uB429\uB2C8\uB2E4.',
                action: function() {
                    renderCutBars(sorted, { sorted: true, answer: k - 1 });
                }
            });

            return steps;
        }

        function resetCutline() {
            var raw = container.querySelector('#sort-cut-input').value;
            var parsed = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (parsed.length < 2) parsed = DEFAULT_SCORES.slice();
            var k = parseInt(container.querySelector('#sort-cut-k').value, 10);
            if (isNaN(k) || k < 1) k = 1;
            if (k > parsed.length) k = parsed.length;
            barsEl.innerHTML = '';
            flyEl.innerHTML = '';
            var steps = buildCutlineSteps(parsed, k);
            self._initStepController(container, steps, '-cut');
        }

        container.querySelector('#sort-cut-reset').addEventListener('click', resetCutline);
        resetCutline();
    },

    // ── 선택 정렬 (boj-2750) ──
    _renderVizSelection(container) {
        var self = this;
        var DEFAULT_SEL_ARR = [38, 27, 43, 3, 9, 82, 10];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">배열: <input type="text" id="sort-sel-input" value="' + DEFAULT_SEL_ARR.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="sort-sel-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc('-sel') +
            '<div class="viz-area" style="position:relative;">' +
                '<div id="sort-bars-sel" style="display:flex;gap:6px;align-items:flex-end;justify-content:center;min-height:220px;padding:20px 0;"></div>' +
                '<div id="sort-fly-sel" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            self._createStepControls('-sel');

        var barsEl = container.querySelector('#sort-bars-sel');
        var flyEl = container.querySelector('#sort-fly-sel');
        var wrapEl = container.querySelector('.viz-area');

        function renderBars(arr, sortedUpTo, comparing, minIdx) {
            var maxVal = Math.max.apply(null, arr);
            barsEl.innerHTML = arr.map(function(v, i) {
                var bg = 'var(--accent)';
                var glow = '';
                if (i <= sortedUpTo) bg = 'var(--green)';
                else if (i === minIdx) { bg = 'var(--yellow)'; glow = 'box-shadow:0 0 12px var(--yellow);'; }
                else if (comparing.indexOf(i) >= 0) { bg = '#e17055'; glow = 'box-shadow:0 0 12px #e1705580;'; }
                var h = Math.max(20, (v / maxVal) * 160);
                var lbl = (i === minIdx && minIdx >= 0) ? '<span style="font-size:0.6rem;color:var(--yellow);font-weight:700;">min</span>'
                    : '<span style="font-size:0.65rem;color:var(--text2);">[' + i + ']</span>';
                return '<div id="sort-bar-sel-' + i + '" style="display:flex;flex-direction:column;align-items:center;gap:4px;transition:opacity 0.2s;">' +
                    '<span style="font-size:0.8rem;font-weight:600;">' + v + '</span>' +
                    '<div style="width:36px;height:' + h + 'px;background:' + bg + ';border-radius:4px 4px 0 0;transition:background 0.3s;' + glow + '"></div>' +
                    lbl + '</div>';
            }).join('');
        }

        function animateSwap(beforeArr, idxA, idxB, onDone) {
            var elA = container.querySelector('#sort-bar-sel-' + idxA);
            var elB = container.querySelector('#sort-bar-sel-' + idxB);
            if (!elA || !elB) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var rectA = elA.getBoundingClientRect();
            var rectB = elB.getBoundingClientRect();
            elA.style.opacity = '0.15';
            elB.style.opacity = '0.15';
            function mkGhost(val, rect, color) {
                var g = document.createElement('div');
                g.textContent = val;
                g.style.cssText = 'position:absolute;z-index:20;width:' + rect.width + 'px;height:' + rect.height + 'px;' +
                    'left:' + (rect.left - wrapRect.left) + 'px;top:' + (rect.top - wrapRect.top) + 'px;' +
                    'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                    'background:' + color + ';color:white;border-radius:8px;' +
                    'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
                return g;
            }
            var gA = mkGhost(beforeArr[idxA], rectA, '#e17055');
            var gB = mkGhost(beforeArr[idxB], rectB, 'var(--yellow)');
            flyEl.appendChild(gA);
            flyEl.appendChild(gB);
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    gA.style.left = (rectB.left - wrapRect.left) + 'px';
                    gB.style.left = (rectA.left - wrapRect.left) + 'px';
                });
            });
            setTimeout(function() {
                if (gA.parentNode) gA.parentNode.removeChild(gA);
                if (gB.parentNode) gB.parentNode.removeChild(gB);
                if (onDone) onDone();
            }, 550);
        }

        function buildSelectionSteps(original) {
            var stepData = [];
            var arr = original.slice();
            var n = arr.length;

            stepData.push({ arr: arr.slice(), sortedUpTo: -1, comparing: [], minIdx: -1,
                desc: '초기 배열: [' + arr.join(', ') + ']. 선택 정렬을 시작합니다!', swapInfo: null });

            for (var i = 0; i < n - 1; i++) {
                var minIdx = i;
                // 라운드 시작: 현재 후보 안내
                stepData.push({ arr: arr.slice(), sortedUpTo: i - 1, comparing: [], minIdx: i,
                    desc: i + '번 위치: 나머지 중 최솟값을 찾습니다. 현재 후보 A[' + i + ']=' + arr[i], swapInfo: null });

                // 매 비교를 개별 스텝으로
                for (var j = i + 1; j < n; j++) {
                    var isSmaller = arr[j] < arr[minIdx];
                    var prevMin = minIdx;
                    if (isSmaller) minIdx = j;
                    stepData.push({
                        arr: arr.slice(), sortedUpTo: i - 1, comparing: [j, prevMin], minIdx: minIdx,
                        desc: isSmaller
                            ? 'A[' + j + ']=' + arr[j] + ' < 현재 최소 A[' + prevMin + ']=' + arr[prevMin] + ' → 최솟값 갱신! min=A[' + j + ']'
                            : 'A[' + j + ']=' + arr[j] + ' ≥ 현재 최소 A[' + minIdx + ']=' + arr[minIdx] + ' → 유지',
                        swapInfo: null
                    });
                }

                // 교환 스텝 (비교와 분리)
                var beforeArr = arr.slice();
                if (i !== minIdx) {
                    var tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
                    stepData.push({
                        arr: arr.slice(), sortedUpTo: i, comparing: [], minIdx: -1,
                        desc: '교환! A[' + i + ']=' + beforeArr[i] + ' ↔ A[' + minIdx + ']=' + beforeArr[minIdx] + ' → ' + i + '번 위치 확정: ' + arr[i],
                        swapInfo: { a: i, b: minIdx, beforeArr: beforeArr }
                    });
                } else {
                    stepData.push({
                        arr: arr.slice(), sortedUpTo: i, comparing: [], minIdx: -1,
                        desc: 'A[' + i + ']=' + arr[i] + '이 이미 최솟값! 교환 불필요. ' + i + '번 위치 확정.',
                        swapInfo: null
                    });
                }
            }

            stepData.push({ arr: arr.slice(), sortedUpTo: n - 1, comparing: [], minIdx: -1,
                desc: '정렬 완료! [' + arr.join(', ') + ']. 선택 정렬의 시간복잡도는 항상 O(n²)입니다.', swapInfo: null });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        if (st.swapInfo && dir === 'forward') {
                            renderBars(st.swapInfo.beforeArr, st.sortedUpTo - 1, [st.swapInfo.a, st.swapInfo.b], -1);
                            requestAnimationFrame(function() {
                                animateSwap(st.swapInfo.beforeArr, st.swapInfo.a, st.swapInfo.b, function() {
                                    renderBars(st.arr, st.sortedUpTo, [], -1);
                                });
                            });
                        } else {
                            renderBars(st.arr, st.sortedUpTo, st.comparing, st.minIdx);
                        }
                    }
                };
            });
        }

        function resetSelection() {
            var raw = container.querySelector('#sort-sel-input').value;
            var parsed = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (parsed.length < 2) parsed = DEFAULT_SEL_ARR.slice();
            barsEl.innerHTML = '';
            flyEl.innerHTML = '';
            var steps = buildSelectionSteps(parsed);
            self._initStepController(container, steps, '-sel');
        }

        container.querySelector('#sort-sel-reset').addEventListener('click', resetSelection);
        resetSelection();
    },

    // ── 좌표 정렬 (boj-11650) ──
    _renderVizCoordSort(container) {
        var self = this;
        var DEFAULT_COORDS = [[3,4],[1,1],[1,-1],[2,2],[3,3]];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">좌표 (x y 쌍): <input type="text" id="sort-coord-input" value="' + DEFAULT_COORDS.map(function(c) { return c[0] + ' ' + c[1]; }).join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
                '<button class="btn btn-primary" id="sort-coord-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc('-coord') +
            '<div class="viz-area" style="position:relative;">' +
                '<div style="font-weight:600;margin-bottom:8px;">좌표 배열</div>' +
                '<div id="sort-coords" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:50px;padding:12px 0;"></div>' +
                '<div id="sort-fly-coord" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            self._createStepControls('-coord');

        var coordsEl = container.querySelector('#sort-coords');
        var flyEl = container.querySelector('#sort-fly-coord');
        var wrapEl = container.querySelector('.viz-area');

        function renderCoords(arr, sortedUpTo, comparingIdx, shiftIdx) {
            coordsEl.innerHTML = arr.map(function(c, i) {
                var cls = 'str-char-box';
                if (i <= sortedUpTo) cls += ' matched';
                else if (i === comparingIdx) cls += ' comparing';
                if (i === shiftIdx) cls += ' comparing';
                return '<div id="sort-coord-' + i + '" class="' + cls + '" style="min-width:60px;text-align:center;font-size:0.9rem;">(' + c[0] + ', ' + c[1] + ')</div>';
            }).join('');
        }

        function coordStr(c) { return '(' + c[0] + ',' + c[1] + ')'; }
        function coordGt(a, b) { return a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]); }

        function animateMove(srcIdx, destIdx, value, onDone) {
            var srcEl = container.querySelector('#sort-coord-' + srcIdx);
            var destEl = container.querySelector('#sort-coord-' + destIdx);
            if (!srcEl || !destEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var srcRect = srcEl.getBoundingClientRect();
            var destRect = destEl.getBoundingClientRect();
            srcEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = value;
            ghost.className = 'str-char-box comparing';
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:60px;text-align:center;font-size:0.9rem;' +
                'left:' + (srcRect.left - wrapRect.left) + 'px;top:' + (srcRect.top - wrapRect.top) + 'px;' +
                'transition:left 0.4s cubic-bezier(.4,0,.2,1),top 0.4s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    ghost.style.left = (destRect.left - wrapRect.left) + 'px';
                    ghost.style.top = (destRect.top - wrapRect.top) + 'px';
                });
            });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 450);
        }

        function buildCoordSteps(coords) {
            var stepData = [];
            var simArr = coords.map(function(c) { return c.slice(); });
            var snap = function() { return simArr.map(function(c) { return c.slice(); }); };

            stepData.push({ arr: snap(), sortedUpTo: -1, comp: -1, shift: -1,
                desc: '초기 좌표: ' + simArr.map(coordStr).join(', ') + '. 삽입 정렬을 시작합니다!', moveInfo: null });

            for (var i = 1; i < simArr.length; i++) {
                var key = simArr[i].slice();
                // 삽입할 원소 안내
                stepData.push({ arr: snap(), sortedUpTo: i - 1, comp: i, shift: -1,
                    desc: coordStr(key) + '을 정렬된 부분에 삽입합니다.', moveInfo: null });

                var j = i - 1;
                while (j >= 0 && coordGt(simArr[j], key)) {
                    // 비교 스텝
                    stepData.push({ arr: snap(), sortedUpTo: i - 1, comp: i, shift: j,
                        desc: coordStr(simArr[j]) + ' > ' + coordStr(key) + ' → ' + coordStr(simArr[j]) + '을 오른쪽으로 밀기',
                        moveInfo: { from: j, to: j + 1, label: coordStr(simArr[j]) } });
                    simArr[j + 1] = simArr[j];
                    j--;
                }
                simArr[j + 1] = key;
                // 삽입 완료 스텝
                stepData.push({ arr: snap(), sortedUpTo: i, comp: -1, shift: -1,
                    desc: coordStr(key) + '을 [' + (j + 1) + '] 위치에 삽입! → ' + simArr.slice(0, i + 1).map(coordStr).join(', '),
                    moveInfo: null });
            }
            stepData.push({ arr: snap(), sortedUpTo: simArr.length - 1, comp: -1, shift: -1,
                desc: '정렬 완료! ' + simArr.map(coordStr).join(', ') + ' ✓', moveInfo: null });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        if (st.moveInfo && dir === 'forward') {
                            var mi = st.moveInfo;
                            renderCoords(st.arr, st.sortedUpTo, st.comp, mi.from);
                            requestAnimationFrame(function() {
                                animateMove(mi.from, mi.to, mi.label, function() {
                                    renderCoords(st.arr, st.sortedUpTo, st.comp, -1);
                                });
                            });
                        } else {
                            renderCoords(st.arr, st.sortedUpTo, st.comp, -1);
                        }
                    }
                };
            });
        }

        function resetCoord() {
            var raw = container.querySelector('#sort-coord-input').value;
            var parsed = raw.split(',').map(function(pair) {
                var parts = pair.trim().split(/\s+/);
                if (parts.length >= 2) return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
                return null;
            }).filter(function(c) { return c !== null && !isNaN(c[0]) && !isNaN(c[1]); });
            if (parsed.length < 2) parsed = DEFAULT_COORDS.map(function(c) { return c.slice(); });
            coordsEl.innerHTML = '';
            flyEl.innerHTML = '';
            var steps = buildCoordSteps(parsed);
            self._initStepController(container, steps, '-coord');
        }

        container.querySelector('#sort-coord-reset').addEventListener('click', resetCoord);
        resetCoord();
    },

    // ── 구간 병합 (lc-56) ──
    _renderVizMergeIntervals(container) {
        var self = this;
        var DEFAULT_INTERVALS = [[1,3],[2,6],[8,10],[15,18]];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">구간 (start end 쌍): <input type="text" id="sort-merge-input" value="' + DEFAULT_INTERVALS.map(function(iv) { return iv[0] + ' ' + iv[1]; }).join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
                '<button class="btn btn-primary" id="sort-merge-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc('-intv') +
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">구간 배열 (시작점 정렬 후)</div>' +
                '<div id="sort-intervals" style="position:relative;min-height:60px;padding:20px 0;"></div>' +
                '<div style="font-weight:600;margin-top:12px;margin-bottom:8px;">병합 결과</div>' +
                '<div id="sort-merged" style="position:relative;min-height:60px;padding:8px 0;"></div>' +
            '</div>' +
            self._createStepControls('-intv');

        var intervalsEl = container.querySelector('#sort-intervals');
        var mergedEl = container.querySelector('#sort-merged');
        var descEl = container.querySelector('#viz-step-desc-intv');

        function renderIntervalBar(el, intArr, highlightIdx) {
            var maxVal = 0;
            intArr.forEach(function(iv) { if (iv[1] > maxVal) maxVal = iv[1]; });
            var scale = maxVal > 0 ? Math.min(30, Math.floor(500 / maxVal)) : 30;
            el.innerHTML = intArr.map(function(iv, i) {
                var w = Math.max(40, (iv[1] - iv[0]) * scale);
                var l = iv[0] * scale;
                var bg = i === highlightIdx ? 'var(--accent)' : 'var(--green)';
                return '<div style="position:absolute;left:' + l + 'px;width:' + w + 'px;height:28px;background:' + bg + ';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600;color:white;">[' + iv[0] + ',' + iv[1] + ']</div>';
            }).join('');
        }

        function buildMergeSteps(intervals) {
            // Sort by start point first
            intervals = intervals.slice().sort(function(a, b) { return a[0] - b[0] || a[1] - b[1]; });

            var states = [];
            var merged = [];
            states.push({ intervals: intervals, merged: [], highlight: -1,
                desc: '구간: ' + intervals.map(function(v) { return '[' + v + ']'; }).join(', ') + '. 시작점으로 정렬되어 있습니다.' });

            merged.push(intervals[0].slice());
            states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: 0,
                desc: '첫 구간 [' + intervals[0] + ']을 결과에 추가합니다.' });

            for (var i = 1; i < intervals.length; i++) {
                var cur = intervals[i];
                var last = merged[merged.length - 1];
                if (cur[0] <= last[1]) {
                    last[1] = Math.max(last[1], cur[1]);
                    states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: i,
                        desc: '[' + cur + '] 시작(' + cur[0] + ') \u2264 이전 끝(' + last[1] + ') \u2192 겹침! 병합하여 [' + last[0] + ',' + last[1] + ']' });
                } else {
                    merged.push(cur.slice());
                    states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: i,
                        desc: '[' + cur + '] 시작(' + cur[0] + ') > 이전 끝 \u2192 겹치지 않음. 새 구간 추가!' });
                }
            }
            states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: -1,
                desc: '병합 완료! 결과: ' + merged.map(function(v) { return '[' + v + ']'; }).join(', ') + ' \u2713' });

            return states.map(function(st) {
                return { description: st.desc, action: function() {
                    renderIntervalBar(intervalsEl, st.intervals, st.highlight);
                    renderIntervalBar(mergedEl, st.merged, -1);
                    descEl.innerHTML = st.desc;
                }};
            });
        }

        function resetMerge() {
            var raw = container.querySelector('#sort-merge-input').value;
            // Parse "start end, start end, ..." format
            var parsed = raw.split(',').map(function(pair) {
                var parts = pair.trim().split(/\s+/);
                if (parts.length >= 2) return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
                return null;
            }).filter(function(iv) { return iv !== null && !isNaN(iv[0]) && !isNaN(iv[1]) && iv[0] <= iv[1]; });
            if (parsed.length < 1) parsed = DEFAULT_INTERVALS.map(function(iv) { return iv.slice(); });
            intervalsEl.innerHTML = '';
            mergedEl.innerHTML = '';
            descEl.innerHTML = '';
            var steps = buildMergeSteps(parsed);
            self._initStepController(container, steps, '-intv');
        }

        container.querySelector('#sort-merge-reset').addEventListener('click', resetMerge);
        resetMerge();
    },

    // ── 안정 정렬 (boj-10814) ──
    _renderVizStableSort(container) {
        var self = this;
        var DEFAULT_STABLE = '21 Junkyu, 21 Dohyun, 20 Sunyoung, 22 Alice, 20 Bob';
        var PALETTE = ['var(--accent)', 'var(--green)', '#e17055', '#6c5ce7', 'var(--yellow)', '#00b894', '#fdcb6e', '#e84393', '#0984e3', '#636e72'];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">나이 이름 목록: <input type="text" id="sort-stable-input" value="' + DEFAULT_STABLE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:360px;"></label>' +
                '<button class="btn btn-primary" id="sort-stable-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc('-stable') +
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">회원 목록 (입력 순서)</div>' +
                '<div id="sort-members" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;padding:12px 0;"></div>' +
            '</div>' +
            self._createStepControls('-stable');

        var membersEl = container.querySelector('#sort-members');
        var descEl = container.querySelector('#viz-step-desc-stable');

        function renderMembers(arr, sortedUpTo) {
            membersEl.innerHTML = arr.map(function(m, i) {
                var cls = 'str-char-box' + (i <= sortedUpTo ? ' matched' : '');
                var color = PALETTE[m.order % PALETTE.length];
                return '<div class="' + cls + '" style="min-width:100px;text-align:center;font-size:0.85rem;border-left:3px solid ' + color + ';">' +
                    '<div style="font-weight:600;">' + m.age + '</div>' +
                    '<div style="font-size:0.75rem;color:var(--text-secondary);">' + m.name + '</div></div>';
            }).join('');
        }

        function buildStableSteps(members) {
            var stepData = [];
            var simArr = members.map(function(m) { return { age: m.age, name: m.name, order: m.order }; });
            var snap = function() { return simArr.map(function(m) { return { age: m.age, name: m.name, order: m.order }; }); };

            stepData.push({ arr: snap(), sortedUpTo: -1,
                desc: '초기 입력: ' + simArr.map(function(m) { return m.age + ' ' + m.name; }).join(', ') + '. 나이 기준 안정 정렬 시작!' });

            // Insertion sort by age only (stable) — 매 비교를 개별 스텝으로
            for (var i = 1; i < simArr.length; i++) {
                var key = { age: simArr[i].age, name: simArr[i].name, order: simArr[i].order };
                stepData.push({ arr: snap(), sortedUpTo: i - 1,
                    desc: key.age + ' ' + key.name + '을 정렬된 부분에 삽입합니다.' });

                var j = i - 1;
                while (j >= 0 && simArr[j].age > key.age) {
                    stepData.push({ arr: snap(), sortedUpTo: i - 1,
                        desc: simArr[j].age + ' ' + simArr[j].name + '(나이 ' + simArr[j].age + ') > ' + key.name + '(나이 ' + key.age + ') → 오른쪽으로 밀기' });
                    simArr[j + 1] = simArr[j];
                    j--;
                }
                if (j >= 0 && simArr[j].age === key.age) {
                    stepData.push({ arr: snap(), sortedUpTo: i - 1,
                        desc: simArr[j].age + ' ' + simArr[j].name + '(나이 ' + simArr[j].age + ') = ' + key.age + ' → 같은 나이! 입력 순서 유지를 위해 멈춤 (안정 정렬)' });
                }
                simArr[j + 1] = key;
                stepData.push({ arr: snap(), sortedUpTo: i,
                    desc: key.age + ' ' + key.name + '을 [' + (j + 1) + '] 위치에 삽입 완료!' });
            }

            var ageGroups = {};
            simArr.forEach(function(m) {
                if (!ageGroups[m.age]) ageGroups[m.age] = [];
                ageGroups[m.age].push(m.name);
            });
            var stableNote = '';
            Object.keys(ageGroups).forEach(function(age) {
                if (ageGroups[age].length > 1) {
                    stableNote += ' 나이 ' + age + '인 ' + ageGroups[age].join(', ') + '의 입력 순서가 유지됩니다.';
                }
            });
            stepData.push({ arr: snap(), sortedUpTo: simArr.length - 1,
                desc: '정렬 완료! ' + simArr.map(function(m) { return m.age + ' ' + m.name; }).join(', ') + '.' + (stableNote || '') + ' \u2713' });

            return stepData.map(function(st) {
                return { description: st.desc, action: function() {
                    renderMembers(st.arr, st.sortedUpTo);
                }};
            });
        }

        function parseStableInput(raw) {
            // Parse "age name, age name, ..." format
            return raw.split(',').map(function(entry, idx) {
                var parts = entry.trim().split(/\s+/);
                if (parts.length >= 2) {
                    var age = parseInt(parts[0], 10);
                    var name = parts.slice(1).join(' ');
                    if (!isNaN(age) && name) return { age: age, name: name, order: idx };
                }
                return null;
            }).filter(function(m) { return m !== null; });
        }

        function resetStable() {
            var raw = container.querySelector('#sort-stable-input').value;
            var parsed = parseStableInput(raw);
            if (parsed.length < 2) parsed = parseStableInput(DEFAULT_STABLE);
            membersEl.innerHTML = '';
            descEl.innerHTML = '';
            var steps = buildStableSteps(parsed);
            self._initStepController(container, steps, '-stable');
        }

        container.querySelector('#sort-stable-reset').addEventListener('click', resetStable);
        resetStable();
    },

    // ===== 문제 탭 =====
    stages: [
        { num: 1, title: '커트라인', desc: '정렬 후 인덱싱', problemIds: ['boj-25305'] },
        { num: 2, title: '기본 정렬', desc: '정렬 구현과 커스텀 정렬 (Bronze~Silver)', problemIds: ['boj-2750', 'boj-11650', 'boj-10814'] },
        { num: 3, title: '정렬 응용', desc: '정렬 기반 문제 풀이 (Medium)', problemIds: ['lc-56'] }
    ],

    problems: [
        {
            id: 'boj-25305',
            title: 'BOJ 25305 - 커트라인',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/25305',
            simIntro: '점수를 내림차순으로 정렬한 뒤, k번째 점수를 찾아 커트라인을 구하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>2022 연세대학교 미래캠퍼스 슬기로운 코딩생활에 N명의 학생들이 응시했다.</p>
                <p>이들 중 점수가 가장 높은 k명은 상을 받을 것이다. 이 때, 상을 받는 커트라인이 몇 점인지 구하라.</p>
                <p>커트라인이란 상을 받는 사람들 중 가장 낮은 점수를 말한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에는 응시자의 수 N과 상을 받는 사람의 수 k가 공백을 사이에 두고 주어진다.</p>
                <p>둘째 줄에는 각 학생의 점수 x가 공백을 사이에 두고 주어진다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 2\n100 76 85 93 98</pre></div>
                    <div><strong>출력</strong><pre>98</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; k &le; N &le; 1,000</li>
                    <li>1 &le; x &le; 10,000</li>
                </ul>
            `,
            hints: [
                { title: '가장 먼저 떠오르는 방법', content: '상위 k명을 찾아야 하니까, 일단 점수를 큰 순서대로 나열하면 되지 않을까요?<br><strong>내림차순 정렬</strong>하면 가장 높은 점수가 맨 앞에 오겠죠!<div style="display:flex;gap:6px;justify-content:center;margin-top:12px;flex-wrap:wrap;"><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">100</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">76</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">85</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">93</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">98</div></div><div style="text-align:center;margin:8px 0;font-size:1.2rem;">↓ 내림차순 정렬</div><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;"><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;font-size:0.9rem;">100</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;font-size:0.9rem;">98</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">93</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">85</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">76</div></div>' },
                { title: '정렬 후 어디를 보면 될까?', content: '내림차순으로 정렬하면 앞에서 k번째가 상을 받는 사람 중 가장 낮은 점수, 즉 <strong>커트라인</strong>이에요.<br>배열 인덱스는 0부터 시작하니까 <code>arr[k-1]</code>이 답입니다!<div style="display:flex;gap:6px;justify-content:center;margin-top:12px;align-items:flex-end;flex-wrap:wrap;"><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[0]</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">100</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--yellow);font-weight:700;">[k-1] ← 커트라인!</div><div style="padding:6px 14px;border-radius:8px;border:2px solid var(--yellow);box-shadow:0 0 8px var(--yellow);font-weight:700;">98</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[2]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">93</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[3]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">85</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[4]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">76</div></div></div>' },
                { title: '오름차순으로도 가능!', content: '오름차순 정렬을 했다면? 뒤에서 k번째를 보면 돼요!<br><span class="lang-py"><code>arr[N-k]</code> 또는 <code>arr[-k]</code> (Python 음수 인덱스)</span><span class="lang-cpp"><code>arr[N-k]</code>를 출력하면 됩니다</span><div style="display:flex;gap:6px;justify-content:center;margin-top:12px;align-items:flex-end;flex-wrap:wrap;"><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[0]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">76</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[1]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">85</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[2]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">93</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--yellow);font-weight:700;"><span class="lang-py">[-k]</span><span class="lang-cpp">[N-k]</span> ← 커트라인!</div><div style="padding:6px 14px;border-radius:8px;border:2px solid var(--yellow);box-shadow:0 0 8px var(--yellow);font-weight:700;">98</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[4]</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">100</div></div></div>' },
                { title: '시간 복잡도', content: 'N \u2264 1,000이므로 어떤 정렬을 써도 충분해요. 내장 sort는 O(N log N)이라 넉넉합니다.<div style="margin-top:10px;overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;"><tr style="background:var(--bg2);"><th style="padding:6px 10px;text-align:left;border:1px solid var(--bg3);">방법</th><th style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">시간</th><th style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">N=1000</th></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">O(n²) 정렬</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n²)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">1,000,000 ✅</td></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);"><span class="lang-py">sort()</span><span class="lang-cpp">sort()</span></td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n log n)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:700;">~10,000 ✅✅</td></tr></table></div>' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort(reverse=True)  # 내림차순 정렬\nprint(scores[k - 1])  # k번째가 커트라인`,
                cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end(), greater<int>());  // 내림차순\n    cout << scores[k - 1] << endl;  // k번째가 커트라인\n}`
            },
            solutions: [
                {
                    approach: '내림차순 정렬 + 인덱싱',
                    description: '점수를 내림차순 정렬하면 앞에서 k번째가 커트라인입니다.',
                    timeComplexity: 'O(N log N)',
                    spaceComplexity: 'O(N)',
                    get templates() { return sortingTopic.problems[0].templates; },
                    codeSteps: {
                        python: [
                            { title: '입력 받기', desc: 'N, k와 점수 배열을 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))' },
                            { title: '내림차순 정렬', desc: 'reverse=True로 큰 점수가 앞에 오도록 정렬합니다. 상위 k명을 쉽게 찾기 위해!', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort(reverse=True)  # 큰 점수가 앞으로!' },
                            { title: '커트라인 출력', desc: '0-indexed이므로 arr[k-1]이 k번째로 높은 점수 = 커트라인입니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort(reverse=True)\nprint(scores[k - 1])  # k번째 = 커트라인' }
                        ],
                        cpp: [
                            { title: '입력 받기', desc: 'N, k와 점수 배열을 입력받습니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];' },
                            { title: '내림차순 정렬', desc: 'greater<int>()로 큰 점수가 앞에 오도록 정렬합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end(), greater<int>());  // 내림차순' },
                            { title: '커트라인 출력', desc: '0-indexed이므로 scores[k-1]이 k번째로 높은 점수 = 커트라인입니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end(), greater<int>());\n    cout << scores[k - 1] << endl;  // k번째 = 커트라인\n}' }
                        ]
                    }
                },
                {
                    approach: '오름차순 정렬 + 뒤에서 k번째',
                    description: '오름차순 정렬 후 뒤에서 k번째 원소를 출력합니다.',
                    timeComplexity: 'O(N log N)',
                    spaceComplexity: 'O(N)',
                    templates: {
                        python: `import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort()  # 오름차순 정렬\nprint(scores[-k])  # 뒤에서 k번째 = 커트라인`,
                        cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end());  // 오름차순\n    cout << scores[N - k] << endl;  // 뒤에서 k번째 = 커트라인\n}`
                    },
                    codeSteps: {
                        python: [
                            { title: '입력 받기', desc: 'N, k와 점수 배열을 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))' },
                            { title: '오름차순 정렬', desc: '기본 sort()는 오름차순입니다. 작은 점수가 앞에 옵니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort()  # 오름차순 정렬' },
                            { title: '뒤에서 k번째 출력', desc: 'Python 음수 인덱스를 활용! scores[-k]는 뒤에서 k번째 원소입니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort()\nprint(scores[-k])  # 뒤에서 k번째 = 커트라인' }
                        ],
                        cpp: [
                            { title: '입력 받기', desc: 'N, k와 점수 배열을 입력받습니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];' },
                            { title: '오름차순 정렬', desc: '기본 sort()는 오름차순입니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end());  // 오름차순' },
                            { title: '뒤에서 k번째 출력', desc: 'C++에서는 scores[N-k]로 뒤에서 k번째 원소에 접근합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end());\n    cout << scores[N - k] << endl;  // 뒤에서 k번째 = 커트라인\n}' }
                        ]
                    }
                }
            ]
        },
        {
            id: 'boj-2750',
            title: 'BOJ 2750 - 수 정렬하기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2750',
            simIntro: '선택 정렬로 배열을 정렬하는 과정을 관찰하세요. 매번 최솟값을 찾아 교환합니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 수가 주어졌을 때, 이를 오름차순으로 정렬하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 수의 개수 N(1 ≤ N ≤ 1,000)이 주어진다. 둘째 줄부터 N개의 줄에는 수가 주어진다. 이 수는 절댓값이 1,000보다 작거나 같은 정수이다. 수는 중복되지 않는다.</p>
                <h4>출력</h4>
                <p>첫째 줄부터 N개의 줄에 오름차순으로 정렬한 결과를 한 줄에 하나씩 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5\n5\n2\n3\n4\n1</pre></div>
                    <div><strong>출력</strong><pre>1\n2\n3\n4\n5</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; N &le; 1,000</li>
                    <li>|수| &le; 1,000</li>
                    <li>수는 중복되지 않는다.</li>
                </ul>
            `,
            hints: [
                { title: '가장 단순한 방법', content: '아는 정렬 아무거나 쓰면 돼요! 선택 정렬, 삽입 정렬, 버블 정렬 — 뭘 쓰든 OK.<br>N &le; 1,000이라서 O(n&sup2;)도 시간 안에 충분히 들어와요. 직접 구현해보는 좋은 연습 문제!<div style="display:flex;gap:6px;justify-content:center;margin-top:12px;flex-wrap:wrap;"><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">5</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">2</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">3</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">4</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">1</div></div><div style="text-align:center;margin:6px 0;font-size:1.2rem;">↓ 아무 정렬이나!</div><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;"><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">1</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">2</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">3</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">4</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">5</div></div>' },
                { title: '더 빠른 정렬도 가능', content: '직접 구현 대신 내장 정렬을 쓰면 O(n log n)으로 훨씬 빨라요.<br><span class="lang-py">Python: <code>sorted()</code>나 <code>.sort()</code>는 O(n log n) Timsort를 사용합니다.</span><span class="lang-cpp">C++: <code>sort()</code>는 O(n log n) IntroSort를 사용합니다. <code>&lt;algorithm&gt;</code> 헤더 필요!</span><div style="margin-top:10px;overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;"><tr style="background:var(--bg2);"><th style="padding:6px 10px;text-align:left;border:1px solid var(--bg3);">방법</th><th style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">시간</th><th style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">추천?</th></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">직접 구현 (O(n²))</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n²)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">연습용 ✏️</td></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);"><span class="lang-py">sort()</span><span class="lang-cpp">sort()</span></td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n log n)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:700;">실전 추천 ✅</td></tr></table></div>' },
                { title: '입출력 최적화', content: '정렬은 맞는데 시간 초과? 입출력이 병목일 수 있어요!<br><span class="lang-py">Python: <code>sys.stdin.readline</code>으로 빠른 입력 + <code>"\\n".join()</code>으로 한 번에 출력<div style="margin-top:8px;padding:8px 12px;background:var(--bg2);border-radius:8px;font-size:0.85rem;font-family:monospace;"><span style="color:var(--green);">import</span> sys<br>input = sys.stdin.readline &nbsp; <span style="color:var(--text3);"># 빠른 입력!</span><br>print(<span style="color:var(--yellow);">\'\\n\'</span>.join(map(str, arr))) &nbsp; <span style="color:var(--text3);"># 한 번에 출력!</span></div></span><span class="lang-cpp">C++: <code>ios::sync_with_stdio(false)</code>와 <code>cin.tie(nullptr)</code>로 빠른 입출력<div style="margin-top:8px;padding:8px 12px;background:var(--bg2);border-radius:8px;font-size:0.85rem;font-family:monospace;"><span style="color:var(--green);">ios</span>::sync_with_stdio(<span style="color:var(--red);">false</span>);<br>cin.tie(<span style="color:var(--red);">nullptr</span>); &nbsp; <span style="color:var(--text3);">// 빠른 입출력!</span></div></span>' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]\narr.sort()\nprint('\\n'.join(map(str, arr)))`,
                cpp: `#include <iostream>
#include <vector>
#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n    sort(arr.begin(), arr.end());\n    for (int x : arr) printf("%d\\n", x);\n}`
            },
            solutions: [{
                approach: '내장 sort 사용',
                description: '리스트에 입력을 담고 sort()를 호출합니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                get templates() { return sortingTopic.problems[1].templates; },
                codeSteps: {
                    python: [
                        { title: '입력 받기', desc: 'sys.stdin.readline으로 빠른 입력을 받아 배열에 저장합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]' },
                        { title: '정렬', desc: '내장 sort()는 TimSort(O(n log n))를 사용하므로 가장 빠르고 간편합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]\narr.sort()' },
                        { title: '출력', desc: 'join으로 한 번에 출력하면 print를 반복하는 것보다 훨씬 빠릅니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]\narr.sort()\nprint(\'\\n\'.join(map(str, arr)))' }
                    ],
                    cpp: [
                        { title: '입력 받기', desc: 'vector에 N개의 정수를 입력받아 저장합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) cin >> arr[i];' },
                        { title: '정렬', desc: 'STL sort()는 IntroSort(O(n log n))를 사용하므로 직접 구현보다 빠르고 안전합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) cin >> arr[i];\n\n    sort(arr.begin(), arr.end());  // O(n log n) IntroSort' },
                        { title: '출력', desc: '"\\n"을 사용해 줄바꿈 출력합니다. endl보다 빠릅니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) cin >> arr[i];\n\n    sort(arr.begin(), arr.end());\n\n    for (int x : arr) cout << x << "\\n";\n}' }
                    ]
                }
            }]
        },
        {
            id: 'boj-11650',
            title: 'BOJ 11650 - 좌표 정렬하기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11650',
            simIntro: '좌표를 (x, y) 튜플로 만들고 정렬하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>2차원 평면 위의 점 N개가 주어진다. 좌표를 x좌표가 증가하는 순으로, x좌표가 같으면 y좌표가 증가하는 순서로 정렬한 다음 출력하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 점의 개수 N (1 ≤ N ≤ 100,000)이 주어진다. 둘째 줄부터 N개의 줄에는 i번점의 위치 x<sub>i</sub>와 y<sub>i</sub>가 주어진다. (-100,000 ≤ x<sub>i</sub>, y<sub>i</sub> ≤ 100,000) 좌표는 항상 정수이고, 위치가 같은 두 점은 없다.</p>
                <h4>출력</h4>
                <p>첫째 줄부터 N개의 줄에 점을 정렬한 결과를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5\n3 4\n1 1\n1 -1\n2 2\n3 3</pre></div>
                    <div><strong>출력</strong><pre>1 -1\n1 1\n2 2\n3 3\n3 4</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; N &le; 100,000</li>
                    <li>-100,000 &le; x, y &le; 100,000</li>
                    <li>좌표는 정수이다.</li>
                </ul>
            `,
            hints: [
                { title: '좌표 정렬 = 비교 기준이 2개', content: 'x좌표 먼저 비교하고, 같으면 y좌표를 비교해야 해요. 비교 함수를 직접 만들어야 할까?<div style="margin-top:12px;overflow-x:auto;"><table style="border-collapse:collapse;font-size:0.85rem;margin:0 auto;"><tr style="background:var(--bg2);"><th style="padding:6px 12px;border:1px solid var(--bg3);">좌표</th><th style="padding:6px 12px;border:1px solid var(--bg3);">1차 비교 (x)</th><th style="padding:6px 12px;border:1px solid var(--bg3);">2차 비교 (y)</th></tr><tr><td style="padding:6px 12px;border:1px solid var(--bg3);text-align:center;">(1, -1) vs (1, 1)</td><td style="padding:6px 12px;border:1px solid var(--bg3);text-align:center;">x = x → 같다!</td><td style="padding:6px 12px;border:1px solid var(--bg3);text-align:center;color:var(--green);">-1 < 1 → (1,-1) 먼저</td></tr><tr><td style="padding:6px 12px;border:1px solid var(--bg3);text-align:center;">(1, 1) vs (3, 3)</td><td style="padding:6px 12px;border:1px solid var(--bg3);text-align:center;color:var(--green);">1 < 3 → (1,1) 먼저</td><td style="padding:6px 12px;border:1px solid var(--bg3);text-align:center;color:var(--text3);">비교 불필요</td></tr></table></div>' },
                { title: '튜플/pair 정렬의 마법', content: '직접 비교 함수를 만들 필요 없어요!<br><span class="lang-py">Python: <code>(x, y)</code> 튜플을 정렬하면 자동으로 x 우선, y 차선으로 정렬돼요. 그냥 <code>coords.sort()</code> 한 줄이면 끝!</span><span class="lang-cpp">C++: <code>pair&lt;int,int&gt;</code>를 <code>sort()</code>하면 first 기준 정렬, 같으면 second 기준으로 자동 정렬돼요!</span><div style="display:flex;gap:8px;justify-content:center;margin-top:12px;align-items:center;flex-wrap:wrap;"><div style="padding:6px 12px;border-radius:8px;background:var(--bg2);font-size:0.85rem;">(3,4)</div><div style="padding:6px 12px;border-radius:8px;background:var(--bg2);font-size:0.85rem;">(1,1)</div><div style="padding:6px 12px;border-radius:8px;background:var(--bg2);font-size:0.85rem;">(1,-1)</div><div style="padding:6px 12px;border-radius:8px;background:var(--bg2);font-size:0.85rem;">(2,2)</div><div style="padding:6px 12px;border-radius:8px;background:var(--bg2);font-size:0.85rem;">(3,3)</div></div><div style="text-align:center;margin:6px 0;font-size:1.1rem;"><span class="lang-py">↓ coords.sort()</span><span class="lang-cpp">↓ sort(coords.begin(), coords.end())</span></div><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;"><div style="padding:6px 12px;border-radius:8px;background:var(--green);color:white;font-size:0.85rem;">(1,-1)</div><div style="padding:6px 12px;border-radius:8px;background:var(--green);color:white;font-size:0.85rem;">(1,1)</div><div style="padding:6px 12px;border-radius:8px;background:var(--green);color:white;font-size:0.85rem;">(2,2)</div><div style="padding:6px 12px;border-radius:8px;background:var(--green);color:white;font-size:0.85rem;">(3,3)</div><div style="padding:6px 12px;border-radius:8px;background:var(--green);color:white;font-size:0.85rem;">(3,4)</div></div>' },
                { title: '입출력이 핵심', content: 'N이 최대 100,000이므로 빠른 입출력이 필수예요. 느린 입출력을 쓰면 정답인데도 시간 초과!<br><span class="lang-py">Python: <code>sys.stdin.readline</code>으로 빠른 입력</span><span class="lang-cpp">C++: <code>ios::sync_with_stdio(false)</code>와 <code>cin.tie(nullptr)</code>로 빠른 입출력</span><div style="margin-top:10px;overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;"><tr style="background:var(--bg2);"><th style="padding:6px 10px;text-align:left;border:1px solid var(--bg3);">입출력 방법</th><th style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">속도</th></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);"><span class="lang-py"><code>input()</code></span><span class="lang-cpp"><code>cin</code> (동기화 해제 안 함)</span></td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);color:var(--red);">느림 ❌</td></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);"><span class="lang-py"><code>sys.stdin.readline</code></span><span class="lang-cpp"><code>scanf</code> 또는 동기화 해제</span></td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:700;">빠름 ✅</td></tr></table></div>' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))\n\ncoords.sort()  # 튜플은 자동으로 (x, y) 순 정렬!\n\noutput = []\nfor x, y in coords:\n    output.append(f"{x} {y}")\nprint('\\n'.join(output))`,
                cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>\nusing namespace std;\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    vector<pair<int,int>> coords(N);\n    for (int i = 0; i < N; i++)\n        scanf("%d %d", &coords[i].first, &coords[i].second);\n    sort(coords.begin(), coords.end());\n    for (auto& [x, y] : coords)\n        printf("%d %d\\n", x, y);\n}`
            },
            solutions: [{
                approach: '튜플 정렬',
                description: '좌표를 (x, y) 튜플로 만들면 자동으로 x → y 순으로 정렬됩니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                get templates() { return sortingTopic.problems[2].templates; },
                codeSteps: {
                    python: [
                        { title: '입력 받기', desc: '좌표를 (x, y) 튜플로 저장하면 정렬 시 자동으로 x → y 순 비교됩니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))' },
                        { title: '튜플 정렬', desc: 'Python 튜플은 첫 번째 원소부터 순서대로 비교하므로 별도 key 없이 sort()만 호출하면 됩니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))\n\ncoords.sort()  # (x, y) 순 자동 정렬!' },
                        { title: '출력', desc: 'f-string으로 포맷팅 후 join으로 한 번에 출력하여 속도를 높입니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))\n\ncoords.sort()\n\noutput = []\nfor x, y in coords:\n    output.append(f"{x} {y}")\nprint(\'\\n\'.join(output))' }
                    ],
                    cpp: [
                        { title: '입력 받기', desc: 'pair<int,int>로 좌표를 저장하면 정렬 시 first → second 순으로 자동 비교됩니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int,int>> coords(N);\n    for (int i = 0; i < N; i++)\n        cin >> coords[i].first >> coords[i].second;' },
                        { title: 'pair 정렬', desc: 'STL sort()는 pair를 자동으로 first 우선, 같으면 second 순으로 비교합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int,int>> coords(N);\n    for (int i = 0; i < N; i++)\n        cin >> coords[i].first >> coords[i].second;\n\n    sort(coords.begin(), coords.end());  // pair 자동 정렬 (first 먼저, 같으면 second)' },
                        { title: '출력', desc: '구조화 바인딩(auto& [x, y])으로 깔끔하게 출력합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int,int>> coords(N);\n    for (int i = 0; i < N; i++)\n        cin >> coords[i].first >> coords[i].second;\n\n    sort(coords.begin(), coords.end());\n\n    for (auto& [x, y] : coords)\n        cout << x << " " << y << "\\n";\n}' }
                    ]
                }
            }]
        },
        {
            id: 'boj-10814',
            title: 'BOJ 10814 - 나이순 정렬',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10814',
            simIntro: '안정 정렬(Stable Sort)로 나이 기준 정렬 시 입력 순서가 유지되는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>온라인 저지에 가입한 사람들의 나이와 이름이 가입한 순서대로 주어진다. 이때, 회원들을 나이가 증가하는 순으로, 나이가 같으면 먼저 가입한 사람이 앞에 오는 순서로 정렬하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 온라인 저지 회원의 수 N이 주어진다. (1 ≤ N ≤ 100,000)</p>
                <p>둘째 줄부터 N개의 줄에는 각 회원의 나이와 이름이 공백으로 구분되어 주어진다. 나이는 1보다 크거나 같고, 200보다 작거나 같은 정수이고, 이름은 알파벳 대소문자로만 이루어져 있고, 길이가 100보다 작거나 같은 문자열이다. 입력은 가입한 순서로 주어진다.</p>
                <h4>출력</h4>
                <p>첫째 줄부터 N개의 줄에 회원들을 나이 순, 나이가 같으면 가입한 순으로 한 줄에 한 명씩 나이와 이름을 공백으로 구분하여 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3\n21 Junkyu\n21 Dohyun\n20 Sunyoung</pre></div>
                    <div><strong>출력</strong><pre>20 Sunyoung\n21 Junkyu\n21 Dohyun</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; N &le; 100,000</li>
                    <li>1 &le; 나이 &le; 200</li>
                    <li>이름은 알파벳 대소문자로만 이루어져 있고, 길이는 100 이하이다.</li>
                </ul>
            `,
            hints: [
                { title: '나이순 정렬인데, 같은 나이는?', content: '나이 기준으로 정렬하는 건 쉬워요. 그런데 문제를 잘 보면 — 같은 나이일 때 <strong>먼저 가입한 사람이 앞</strong>에 와야 해요. 즉, 같은 나이면 입력 순서를 유지해야 해요. 이런 정렬을 <strong>"안정 정렬(stable sort)"</strong>이라고 해요.<div style="margin-top:12px;"><div style="font-size:0.8rem;color:var(--text2);margin-bottom:6px;">입력 순서 (가입 순):</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"><div style="padding:6px 12px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><strong>21</strong> Junkyu <span style="font-size:0.7rem;color:var(--text3);">①</span></div><div style="padding:6px 12px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><strong>21</strong> Dohyun <span style="font-size:0.7rem;color:var(--text3);">②</span></div><div style="padding:6px 12px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><strong>20</strong> Sunyoung</div></div><div style="font-size:0.8rem;color:var(--green);margin-bottom:6px;">정렬 후 (같은 나이 21: 가입 순 유지!)</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><div style="padding:6px 12px;border-radius:8px;background:var(--green);color:white;font-size:0.85rem;"><strong>20</strong> Sunyoung</div><div style="padding:6px 12px;border-radius:8px;border:2px solid var(--yellow);font-size:0.85rem;"><strong>21</strong> Junkyu <span style="font-size:0.7rem;color:var(--yellow);">①</span></div><div style="padding:6px 12px;border-radius:8px;border:2px solid var(--yellow);font-size:0.85rem;"><strong>21</strong> Dohyun <span style="font-size:0.7rem;color:var(--yellow);">②</span></div></div></div>' },
                { title: '안정 정렬 활용', content: '나이만 기준(key)으로 정렬하면, 안정 정렬 덕분에 같은 나이끼리는 원래 순서가 유지돼요!<br><span class="lang-py">Python: <code>sorted()</code>와 <code>.sort()</code>는 기본이 안정 정렬(TimSort)! <code>key=lambda x: int(x.split()[0])</code>이면 끝.</span><span class="lang-cpp">C++: <code>stable_sort()</code>를 사용하면 돼요. 주의: <code>sort()</code>는 불안정 정렬이라 같은 나이 순서가 바뀔 수 있어요!</span><div style="margin-top:10px;overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;"><tr style="background:var(--bg2);"><th style="padding:6px 10px;text-align:left;border:1px solid var(--bg3);">언어</th><th style="padding:6px 10px;text-align:left;border:1px solid var(--bg3);">안정 정렬?</th><th style="padding:6px 10px;text-align:left;border:1px solid var(--bg3);">사용법</th></tr><tr class="lang-py"><td style="padding:6px 10px;border:1px solid var(--bg3);">Python</td><td style="padding:6px 10px;border:1px solid var(--bg3);color:var(--green);">✅ 기본 안정</td><td style="padding:6px 10px;border:1px solid var(--bg3);"><code>sort(key=lambda x: x[0])</code></td></tr><tr class="lang-cpp"><td style="padding:6px 10px;border:1px solid var(--bg3);">C++</td><td style="padding:6px 10px;border:1px solid var(--bg3);color:var(--red);">sort() ❌ 불안정</td><td style="padding:6px 10px;border:1px solid var(--bg3);"><code>stable_sort()</code> 필수!</td></tr></table></div>' },
                { title: '시간 복잡도', content: 'O(n log n)이면 충분해요. N &le; 100,000이므로 넉넉합니다.<div style="margin-top:8px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:6px;font-size:0.85rem;line-height:1.7;">핵심: 나이만 key로 주고 이름은 key에 포함하지 않는 것이 포인트! 안정 정렬이 같은 key에 대해 입력 순서를 자동으로 유지해줍니다.</div>' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))\n\n# Python sort는 안정 정렬 → 나이만 기준으로 정렬해도 입력 순서 유지\nmembers.sort(key=lambda x: x[0])\n\nfor age, name in members:\n    print(age, name)`,
                cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>\nusing namespace std;\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    vector<pair<int, string>> v(N);\n    for (int i = 0; i < N; i++)\n        cin >> v[i].first >> v[i].second;\n\n    // stable_sort: 같은 나이면 입력 순서 유지\n    stable_sort(v.begin(), v.end(), [](auto& a, auto& b) {\n        return a.first < b.first;\n    });\n\n    for (auto& [age, name] : v)\n        printf("%d %s\\n", age, name.c_str());\n}`
            },
            solutions: [{
                approach: '안정 정렬 활용',
                description: '나이만 기준으로 sort()하면 안정 정렬 덕분에 입력 순서가 자동 유지됩니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                get templates() { return sortingTopic.problems[4].templates; },
                codeSteps: {
                    python: [
                        { title: '입력 받기', desc: '나이(int)와 이름(str)을 튜플로 저장합니다. 나이만 정렬 키로 쓸 예정입니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))' },
                        { title: '나이 기준 정렬 (안정)', desc: 'Python sort()는 안정 정렬(TimSort)이므로, 나이만 key로 주면 같은 나이끼리 입력 순서가 유지됩니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))\n\n# Python sort는 안정 정렬!\nmembers.sort(key=lambda x: x[0])' },
                        { title: '출력', desc: '정렬된 결과를 나이와 이름 순서로 출력합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))\n\nmembers.sort(key=lambda x: x[0])\n\nfor age, name in members:\n    print(age, name)' }
                    ],
                    cpp: [
                        { title: '입력 받기', desc: 'pair<int, string>으로 나이와 이름을 함께 저장합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int, string>> v(N);\n    for (int i = 0; i < N; i++)\n        cin >> v[i].first >> v[i].second;' },
                        { title: '나이 기준 안정 정렬', desc: 'C++ sort()는 불안정 정렬이므로 stable_sort()를 써야 같은 나이끼리 입력 순서가 보장됩니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int, string>> v(N);\n    for (int i = 0; i < N; i++)\n        cin >> v[i].first >> v[i].second;\n\n    // stable_sort: 같은 키이면 입력 순서 유지!\n    stable_sort(v.begin(), v.end(), [](auto& a, auto& b) {\n        return a.first < b.first;\n    });' },
                        { title: '출력', desc: '구조화 바인딩으로 나이와 이름을 깔끔하게 출력합니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int, string>> v(N);\n    for (int i = 0; i < N; i++)\n        cin >> v[i].first >> v[i].second;\n\n    stable_sort(v.begin(), v.end(), [](auto& a, auto& b) {\n        return a.first < b.first;\n    });\n\n    for (auto& [age, name] : v)\n        cout << age << " " << name << "\\n";\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-56',
            title: 'LeetCode 56 - Merge Intervals',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/merge-intervals/',
            simIntro: '시작점으로 정렬한 뒤, 겹치는 구간을 순서대로 병합하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>구간 배열 <code>intervals</code>가 주어집니다. <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>입니다. 겹치는 구간을 모두 합치고, 겹치지 않는 구간만 남긴 배열을 반환하세요.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>intervals = [[1,3],[2,6],[8,10],[15,18]]</pre></div>
                    <div><strong>출력</strong><pre>[[1,6],[8,10],[15,18]]</pre></div>
                </div><p class="example-explain">구간 [1,3]과 [2,6]이 겹치므로 [1,6]으로 합칩니다.</p></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>intervals = [[1,4],[4,5]]</pre></div>
                    <div><strong>출력</strong><pre>[[1,5]]</pre></div>
                </div><p class="example-explain">구간 [1,4]와 [4,5]는 겹치는 것으로 간주합니다.</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; intervals.length &le; 10<sup>4</sup></li>
                    <li>intervals[i].length == 2</li>
                    <li>0 &le; start<sub>i</sub> &le; end<sub>i</sub> &le; 10<sup>4</sup></li>
                </ul>
            `,
            hints: [
                { title: '처음 생각: 하나씩 비교?', content: '모든 구간 쌍을 하나씩 비교하면 겹치는지 알 수 있어요. 하지만 구간이 n개면 비교 횟수가 O(n&sup2;)... 구간이 10,000개면 1억 번 비교!<div style="margin-top:10px;overflow-x:auto;"><table style="border-collapse:collapse;font-size:0.85rem;margin:0 auto;"><tr style="background:var(--bg2);"><th style="padding:6px 10px;border:1px solid var(--bg3);">방법</th><th style="padding:6px 10px;border:1px solid var(--bg3);">비교 횟수</th><th style="padding:6px 10px;border:1px solid var(--bg3);">n=10,000</th></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">모든 쌍 비교</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n²)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);color:var(--red);">~1억 ❌</td></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">정렬 후 순회</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n log n)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:700;">~13만 ✅</td></tr></table></div>' },
                { title: '정렬하면 쉬워진다!', content: '<strong>시작점 기준으로 정렬</strong>하면, 겹치는 구간은 반드시 연속으로 나열돼요. 그러면 앞에서부터 한 번만 스캔하면서 합치면 끝!<div style="margin-top:12px;"><div style="font-size:0.8rem;color:var(--text2);margin-bottom:4px;">정렬 전: 순서가 뒤죽박죽</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"><div style="padding:4px 10px;border-radius:6px;background:var(--bg2);font-size:0.85rem;">[1,3]</div><div style="padding:4px 10px;border-radius:6px;background:var(--bg2);font-size:0.85rem;">[8,10]</div><div style="padding:4px 10px;border-radius:6px;background:var(--bg2);font-size:0.85rem;">[2,6]</div><div style="padding:4px 10px;border-radius:6px;background:var(--bg2);font-size:0.85rem;">[15,18]</div></div><div style="font-size:0.8rem;color:var(--green);margin-bottom:4px;">정렬 후: 겹치는 구간이 나란히!</div><div style="display:flex;gap:6px;flex-wrap:wrap;"><div style="padding:4px 10px;border-radius:6px;border:2px solid var(--yellow);font-size:0.85rem;">[1,3]</div><div style="padding:4px 10px;border-radius:6px;border:2px solid var(--yellow);font-size:0.85rem;">[2,6]</div><div style="padding:4px 10px;border-radius:6px;background:var(--bg2);font-size:0.85rem;">[8,10]</div><div style="padding:4px 10px;border-radius:6px;background:var(--bg2);font-size:0.85rem;">[15,18]</div></div></div>' },
                { title: '합치기 로직', content: '현재 구간의 끝 &ge; 다음 구간의 시작이면 겹치니까 합쳐요 → <code>끝 = max(현재 끝, 다음 끝)</code>.<br>겹치지 않으면? 새 구간을 결과에 추가하고 다음으로 넘어가면 돼요.<div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><div style="padding:4px 10px;border-radius:6px;border:2px solid var(--yellow);font-size:0.85rem;">[1,3]</div><div style="font-size:0.85rem;">+</div><div style="padding:4px 10px;border-radius:6px;border:2px solid var(--yellow);font-size:0.85rem;">[2,6]</div><div style="font-size:1rem;">→</div><div style="font-size:0.85rem;color:var(--text2);">3 &ge; 2 겹침!</div><div style="font-size:1rem;">→</div><div style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;font-size:0.85rem;">[1, max(3,6)] = [1,6]</div></div><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><div style="padding:4px 10px;border-radius:6px;border:2px solid var(--accent);font-size:0.85rem;">[1,6]</div><div style="font-size:0.85rem;">+</div><div style="padding:4px 10px;border-radius:6px;background:var(--bg2);font-size:0.85rem;">[8,10]</div><div style="font-size:1rem;">→</div><div style="font-size:0.85rem;color:var(--text2);">6 < 8 안 겹침</div><div style="font-size:1rem;">→</div><div style="font-size:0.85rem;color:var(--accent);">새 구간 추가</div></div></div>' }
            ],
            templates: {
                python: `class Solution:\n    def merge(self, intervals):\n        intervals.sort(key=lambda x: x[0])  # 시작점 기준 정렬\n        merged = [intervals[0]]\n\n        for start, end in intervals[1:]:\n            if start <= merged[-1][1]:  # 겹침!\n                merged[-1][1] = max(merged[-1][1], end)\n            else:\n                merged.append([start, end])\n\n        return merged`,
                cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged = {intervals[0]};\n\n        for (int i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] <= merged.back()[1])\n                merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n            else\n                merged.push_back(intervals[i]);\n        }\n        return merged;\n    }\n};`
            },
            solutions: [{
                approach: '정렬 + 순차 병합',
                description: '시작점 기준 정렬 후, 겹치면 end를 max로 갱신합니다.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                get templates() { return sortingTopic.problems[3].templates; },
                codeSteps: {
                    python: [
                        { title: '시작점 정렬', desc: '시작점 기준으로 정렬하면 겹치는 구간이 연속으로 나와 한 번의 순회로 병합할 수 있습니다.', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])' },
                        { title: '첫 구간 추가', desc: '결과 리스트에 첫 구간을 넣어 비교의 시작점을 만듭니다.', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]' },
                        { title: '겹침 판별 + 병합', desc: '현재 구간의 시작이 이전 구간의 끝 이하이면 겹치므로, end를 max로 확장합니다.', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:  # 겹침!\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])' },
                        { title: '결과 반환', desc: '병합이 완료된 구간 리스트를 반환합니다.', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n\n    return merged' }
                    ],
                    cpp: [
                        { title: '시작점 정렬', desc: '시작점 기준으로 정렬하면 겹치는 구간이 연속으로 나와 한 번의 순회로 병합할 수 있습니다.', code: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());' },
                        { title: '첫 구간 추가', desc: '결과 벡터에 첫 구간을 넣어 비교의 시작점을 만듭니다.', code: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n\n    vector<vector<int>> merged = {intervals[0]};' },
                        { title: '겹침 판별 + 병합', desc: '현재 구간의 시작이 이전 구간의 끝 이하이면 겹치므로, end를 max로 확장합니다.', code: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n\n    vector<vector<int>> merged = {intervals[0]};\n\n    for (int i = 1; i < intervals.size(); i++) {\n        if (intervals[i][0] <= merged.back()[1])\n            merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n        else\n            merged.push_back(intervals[i]);\n    }' },
                        { title: '결과 반환', desc: '병합이 완료된 구간 벡터를 반환합니다.', code: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n\n    vector<vector<int>> merged = {intervals[0]};\n\n    for (int i = 1; i < intervals.size(); i++) {\n        if (intervals[i][0] <= merged.back()[1])\n            merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n        else\n            merged.push_back(intervals[i]);\n    }\n\n    return merged;\n}' }
                    ]
                }
            }]
        }
    ],

    renderProblem(container) { container.innerHTML = ''; },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', function() { sortingTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.sorting = sortingTopic;
