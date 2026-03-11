// =========================================================
// 정렬 (Sorting) 토픽 모듈
// =========================================================
const sortingTopic = {
    id: 'sorting',
    title: '정렬',
    icon: '🔢',
    category: '정렬과 탐색',
    order: 6,
    description: '버블/선택/삽입 정렬부터 병합/퀵 정렬까지, 정렬의 모든 것',
    relatedNote: '이 외에도 카운팅 정렬, 기수 정렬 등 특수 정렬과 정렬의 안정성(stability) 개념이 중요합니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
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
                <div class="concept-section-title"><span class="section-num">1</span> 기본 정렬: O(n²)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 카드를 정렬한다고 생각해봅시다!
                    <em>선택 정렬</em>은 "가장 작은 카드를 찾아서 맨 앞에 놓기",
                    <em>삽입 정렬</em>은 "새 카드를 올바른 위치에 끼워넣기",
                    <em>버블 정렬</em>은 "옆 카드와 비교해서 교환하기"입니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--accent)">선택</text></svg></div>
                        <h3>선택 정렬</h3>
                        <p>매번 <strong>최솟값을 찾아서</strong> 앞으로 옮깁니다. 비교 횟수가 항상 같아서 안정적이지만 느립니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--green)">삽입</text></svg></div>
                        <h3>삽입 정렬</h3>
                        <p>카드를 <strong>올바른 위치에 끼워넣기</strong>. 거의 정렬된 데이터에서는 O(n)으로 매우 빠릅니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">버블</text></svg></div>
                        <h3>버블 정렬</h3>
                        <p>인접한 두 원소를 <strong>비교·교환</strong>. 큰 원소가 거품처럼 뒤로 올라갑니다. 교육용으로 좋습니다.</p>
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
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 병합 정렬: O(n log n)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 병합 정렬은 <em>"반으로 나누고, 정렬하고, 합치기"</em>입니다!
                    카드 더미를 반으로 나누고, 각각 정렬한 뒤, 두 더미를 비교하며 합칩니다.
                    이것이 <strong>분할 정복(Divide & Conquer)</strong>의 대표 예시입니다.
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

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="str-step-controls" id="str-step-controls' + s + '" style="position:fixed;bottom:0;left:var(--sidebar-w,280px);right:0;background:var(--card);border-top:1px solid var(--border);padding:10px 20px;display:flex;align-items:center;justify-content:center;gap:12px;z-index:100;">' +
            '<button class="btn" id="str-prev' + s + '">◀ 이전</button>' +
            '<span id="str-indicator' + s + '" style="font-size:0.9rem;color:var(--text-secondary);min-width:60px;text-align:center;">0 / 0</span>' +
            '<button class="btn" id="str-next' + s + '">다음 ▶</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix) {
        var s = suffix || '';
        var current = -1;
        var actionDelay = 350;
        var indicator = container.querySelector('#str-indicator' + s);
        var prevBtn = container.querySelector('#str-prev' + s);
        var nextBtn = container.querySelector('#str-next' + s);
        if (!indicator || !prevBtn || !nextBtn) return;
        var total = steps.length;
        var self = this;
        var descEl = container.querySelector('[id$="desc' + s + '"]');
        var updateUI = function() {
            if (current < 0) {
                indicator.textContent = '시작 전';
                if (descEl) descEl.innerHTML = '▶ 다음 버튼을 눌러 시뮬레이션을 시작하세요.';
                prevBtn.disabled = true;
                nextBtn.disabled = false;
            } else {
                indicator.textContent = (current + 1) + ' / ' + total;
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

    // ── 선택 정렬 (boj-2750) ──
    _renderVizSelection(container) {
        var self = this;
        var DEFAULT_SEL_ARR = [38, 27, 43, 3, 9, 82, 10];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">배열: <input type="text" id="sort-sel-input" value="' + DEFAULT_SEL_ARR.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="sort-sel-reset">🔄</button>' +
            '</div>' +
            '<div class="viz-area">' +
                '<div id="sort-bars-sel" style="display:flex;gap:6px;align-items:flex-end;justify-content:center;min-height:200px;padding:20px 0;"></div>' +
                '<div id="sort-desc-sel" style="padding:14px;background:var(--bg-secondary);border-radius:8px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>' +
            self._createStepControls('-sel');

        var barsEl = container.querySelector('#sort-bars-sel');
        var descEl = container.querySelector('#sort-desc-sel');

        function buildSelectionSteps(original) {
            var states = [];
            var simArr = original.slice();
            states.push({ arr: simArr.slice(), sortedUpTo: -1, minIdx: -1, desc: '초기 배열: [' + original.join(', ') + ']. 선택 정렬을 시작합니다!' });

            for (var i = 0; i < simArr.length - 1; i++) {
                var minIdx = i;
                for (var j = i + 1; j < simArr.length; j++) {
                    if (simArr[j] < simArr[minIdx]) minIdx = j;
                }
                states.push({ arr: simArr.slice(), sortedUpTo: i - 1, minIdx: minIdx,
                    desc: i + '번 위치: 최솟값 ' + simArr[minIdx] + '을(를) 찾았습니다! (인덱스 ' + minIdx + ')' });
                var tmp = simArr[i]; simArr[i] = simArr[minIdx]; simArr[minIdx] = tmp;
                states.push({ arr: simArr.slice(), sortedUpTo: i, minIdx: -1,
                    desc: '교환 완료 → [' + simArr.join(', ') + ']. ' + i + '번 위치 확정!' });
            }
            states.push({ arr: simArr.slice(), sortedUpTo: simArr.length - 1, minIdx: -1,
                desc: '정렬 완료! [' + simArr.join(', ') + ']. 선택 정렬의 시간복잡도는 항상 O(n²)입니다.' });

            return states.map(function(st) {
                return { description: st.desc, action: function() {
                    self._renderBars(barsEl, st.arr, st.sortedUpTo, [], st.minIdx);
                    descEl.innerHTML = st.desc;
                }};
            });
        }

        function resetSelection() {
            var raw = container.querySelector('#sort-sel-input').value;
            var parsed = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (parsed.length < 2) parsed = DEFAULT_SEL_ARR.slice();
            barsEl.innerHTML = '';
            descEl.innerHTML = '';
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
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">좌표 배열</div>' +
                '<div id="sort-coords" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:50px;padding:12px 0;"></div>' +
                '<div id="sort-desc-coord" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>' +
            self._createStepControls('-coord');

        var coordsEl = container.querySelector('#sort-coords');
        var descEl = container.querySelector('#sort-desc-coord');

        function renderCoords(arr, sortedUpTo, comparingIdx) {
            coordsEl.innerHTML = arr.map(function(c, i) {
                var cls = 'str-char-box';
                if (i <= sortedUpTo) cls += ' matched';
                else if (i === comparingIdx) cls += ' comparing';
                return '<div class="' + cls + '" style="min-width:60px;text-align:center;font-size:0.9rem;">(' + c[0] + ', ' + c[1] + ')</div>';
            }).join('');
        }

        function buildCoordSteps(coords) {
            var states = [];
            var simArr = coords.map(function(c) { return c.slice(); });
            states.push({ arr: simArr.map(function(c) { return c.slice(); }), sortedUpTo: -1, comp: -1,
                desc: '초기 좌표: ' + simArr.map(function(c) { return '(' + c.join(',') + ')'; }).join(', ') + '. 튜플 정렬을 시작합니다!' });

            for (var i = 1; i < simArr.length; i++) {
                var key = simArr[i].slice();
                var j = i - 1;
                states.push({ arr: simArr.map(function(c) { return c.slice(); }), sortedUpTo: i - 1, comp: i,
                    desc: '(' + key[0] + ', ' + key[1] + ')을 올바른 위치에 삽입합니다.' });
                while (j >= 0 && (simArr[j][0] > key[0] || (simArr[j][0] === key[0] && simArr[j][1] > key[1]))) {
                    simArr[j + 1] = simArr[j];
                    j--;
                }
                simArr[j + 1] = key;
                states.push({ arr: simArr.map(function(c) { return c.slice(); }), sortedUpTo: i, comp: -1,
                    desc: '삽입 완료: ' + simArr.slice(0, i + 1).map(function(c) { return '(' + c.join(',') + ')'; }).join(', ') });
            }
            states.push({ arr: simArr.map(function(c) { return c.slice(); }), sortedUpTo: simArr.length - 1, comp: -1,
                desc: '정렬 완료! ' + simArr.map(function(c) { return '(' + c.join(',') + ')'; }).join(', ') + ' ✓' });

            return states.map(function(st) {
                return { description: st.desc, action: function() {
                    renderCoords(st.arr, st.sortedUpTo, st.comp);
                    descEl.innerHTML = st.desc;
                }};
            });
        }

        function resetCoord() {
            var raw = container.querySelector('#sort-coord-input').value;
            // Parse "x y, x y, ..." format
            var parsed = raw.split(',').map(function(pair) {
                var parts = pair.trim().split(/\s+/);
                if (parts.length >= 2) return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
                return null;
            }).filter(function(c) { return c !== null && !isNaN(c[0]) && !isNaN(c[1]); });
            if (parsed.length < 2) parsed = DEFAULT_COORDS.map(function(c) { return c.slice(); });
            coordsEl.innerHTML = '';
            descEl.innerHTML = '';
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
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">구간 배열 (시작점 정렬 후)</div>' +
                '<div id="sort-intervals" style="position:relative;min-height:60px;padding:20px 0;"></div>' +
                '<div style="font-weight:600;margin-top:12px;margin-bottom:8px;">병합 결과</div>' +
                '<div id="sort-merged" style="position:relative;min-height:60px;padding:8px 0;"></div>' +
                '<div id="sort-desc-intv" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>' +
            self._createStepControls('-intv');

        var intervalsEl = container.querySelector('#sort-intervals');
        var mergedEl = container.querySelector('#sort-merged');
        var descEl = container.querySelector('#sort-desc-intv');

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
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">회원 목록 (입력 순서)</div>' +
                '<div id="sort-members" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;padding:12px 0;"></div>' +
                '<div id="sort-desc-stable" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>' +
            self._createStepControls('-stable');

        var membersEl = container.querySelector('#sort-members');
        var descEl = container.querySelector('#sort-desc-stable');

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
            var states = [];
            var simArr = members.map(function(m) { return { age: m.age, name: m.name, order: m.order }; });
            states.push({ arr: simArr.slice(), sortedUpTo: -1,
                desc: '초기 입력: ' + simArr.map(function(m) { return m.age + ' ' + m.name; }).join(', ') + '. 나이 기준 안정 정렬 시작!' });

            // Insertion sort by age only (stable)
            for (var i = 1; i < simArr.length; i++) {
                var key = simArr[i];
                var j = i - 1;
                while (j >= 0 && simArr[j].age > key.age) {
                    simArr[j + 1] = simArr[j];
                    j--;
                }
                simArr[j + 1] = key;
                states.push({ arr: simArr.map(function(m) { return { age: m.age, name: m.name, order: m.order }; }), sortedUpTo: i,
                    desc: key.age + ' ' + key.name + '을 삽입 \u2192 나이 같은 경우 입력 순서 유지! (안정 정렬)' });
            }
            // Find same-age groups for final description
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
            states.push({ arr: simArr.map(function(m) { return { age: m.age, name: m.name, order: m.order }; }), sortedUpTo: simArr.length - 1,
                desc: '정렬 완료! ' + simArr.map(function(m) { return m.age + ' ' + m.name; }).join(', ') + '.' + (stableNote || '') + ' \u2713' });

            return states.map(function(st) {
                return { description: st.desc, action: function() {
                    renderMembers(st.arr, st.sortedUpTo);
                    descEl.innerHTML = st.desc;
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
        { num: 1, title: '기본 정렬', desc: '정렬 구현과 커스텀 정렬 (Bronze~Silver)', problemIds: ['boj-2750', 'boj-11650'] },
        { num: 2, title: '정렬 응용', desc: '정렬 기반 문제 풀이 (Easy~Medium)', problemIds: ['lc-56', 'boj-10814'] }
    ],

    problems: [
        {
            id: 'boj-2750',
            title: 'BOJ 2750 - 수 정렬하기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2750',
            simIntro: '선택 정렬로 배열을 정렬하는 과정을 관찰하세요. 매번 최솟값을 찾아 교환합니다.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 수가 주어졌을 때, 이를 오름차순으로 정렬하는 프로그램을 작성하시오.</p>
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
                { title: '가장 단순한 방법', content: '아는 정렬 아무거나 쓰면 돼요! 선택 정렬, 삽입 정렬, 버블 정렬 — 뭘 쓰든 OK.<br>N &le; 1,000이라서 O(n&sup2;)도 시간 안에 충분히 들어와요. 직접 구현해보는 좋은 연습 문제!' },
                { title: '더 빠른 정렬도 가능', content: '직접 구현 대신 내장 정렬을 쓰면 O(n log n)으로 훨씬 빨라요.<br><span class="lang-py">Python: <code>sorted()</code>나 <code>.sort()</code>는 O(n log n) Timsort를 사용합니다.</span><span class="lang-cpp">C++: <code>sort()</code>는 O(n log n) IntroSort를 사용합니다. <code>&lt;algorithm&gt;</code> 헤더 필요!</span>' },
                { title: '입출력 최적화', content: '정렬은 맞는데 시간 초과? 입출력이 병목일 수 있어요!<br><span class="lang-py">Python: <code>sys.stdin.readline</code>으로 빠른 입력 + <code>"\\n".join()</code>으로 한 번에 출력</span><span class="lang-cpp">C++: <code>ios::sync_with_stdio(false)</code>와 <code>cin.tie(nullptr)</code>로 빠른 입출력</span>' }
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
                get templates() { return sortingTopic.problems[0].templates; },
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
                { title: '좌표 정렬 = 비교 기준이 2개', content: 'x좌표 먼저 비교하고, 같으면 y좌표를 비교해야 해요. 비교 함수를 직접 만들어야 할까?' },
                { title: '튜플/pair 정렬의 마법', content: '직접 비교 함수를 만들 필요 없어요!<br><span class="lang-py">Python: <code>(x, y)</code> 튜플을 정렬하면 자동으로 x 우선, y 차선으로 정렬돼요. 그냥 <code>coords.sort()</code> 한 줄이면 끝!</span><span class="lang-cpp">C++: <code>pair&lt;int,int&gt;</code>를 <code>sort()</code>하면 first 기준 정렬, 같으면 second 기준으로 자동 정렬돼요!</span>' },
                { title: '입출력이 핵심', content: 'N이 최대 100,000이므로 빠른 입출력이 필수예요. 느린 입출력을 쓰면 정답인데도 시간 초과!<br><span class="lang-py">Python: <code>sys.stdin.readline</code>으로 빠른 입력</span><span class="lang-cpp">C++: <code>ios::sync_with_stdio(false)</code>와 <code>cin.tie(nullptr)</code>로 빠른 입출력</span>' }
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
                get templates() { return sortingTopic.problems[1].templates; },
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
                { title: '처음 생각: 하나씩 비교?', content: '모든 구간 쌍을 하나씩 비교하면 겹치는지 알 수 있어요. 하지만 구간이 n개면 비교 횟수가 O(n&sup2;)... 구간이 10,000개면 1억 번 비교!' },
                { title: '정렬하면 쉬워진다!', content: '<strong>시작점 기준으로 정렬</strong>하면, 겹치는 구간은 반드시 연속으로 나열돼요. 그러면 앞에서부터 한 번만 스캔하면서 합치면 끝! 정렬 O(n log n) + 순회 O(n) = <strong>O(n log n)</strong>' },
                { title: '합치기 로직', content: '현재 구간의 끝 &ge; 다음 구간의 시작이면 겹치니까 합쳐요 → <code>끝 = max(현재 끝, 다음 끝)</code>.<br>겹치지 않으면? 새 구간을 결과에 추가하고 다음으로 넘어가면 돼요.' }
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
                get templates() { return sortingTopic.problems[2].templates; },
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
                { title: '나이순 정렬인데, 같은 나이는?', content: '나이 기준으로 정렬하는 건 쉬워요. 그런데 문제를 잘 보면 — 같은 나이일 때 <strong>먼저 가입한 사람이 앞</strong>에 와야 해요. 즉, 같은 나이면 입력 순서를 유지해야 해요. 이런 정렬을 <strong>"안정 정렬(stable sort)"</strong>이라고 해요.' },
                { title: '안정 정렬 활용', content: '나이만 기준(key)으로 정렬하면, 안정 정렬 덕분에 같은 나이끼리는 원래 순서가 유지돼요!<br><span class="lang-py">Python: <code>sorted()</code>와 <code>.sort()</code>는 기본이 안정 정렬(TimSort)! <code>key=lambda x: int(x.split()[0])</code>이면 끝.</span><span class="lang-cpp">C++: <code>stable_sort()</code>를 사용하면 돼요. 주의: <code>sort()</code>는 불안정 정렬이라 같은 나이 순서가 바뀔 수 있어요!</span>' },
                { title: '시간 복잡도', content: 'O(n log n)이면 충분해요. N &le; 100,000이므로 넉넉합니다.' }
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
                get templates() { return sortingTopic.problems[3].templates; },
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
