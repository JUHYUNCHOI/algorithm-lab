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
            '<option value="python">Python</option><option value="cpp">C++</option><option value="java">Java</option></select>' +
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
                <div class="code-block">
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
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 세 가지 O(n²) 정렬 중, 실제로 가장 많이 쓰이는 것은?
                    삽입 정렬! 데이터가 거의 정렬되어 있으면 O(n)이고, 작은 배열에서 빠릅니다.
                    Python의 <code>sort()</code>도 내부적으로 삽입 정렬을 활용합니다(TimSort).
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
                <div class="code-block">
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
                </div>
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
                <div class="code-block">
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
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 코딩 테스트에서는 대부분 <code>sort()</code>를 사용합니다!
                    하지만 정렬 알고리즘의 원리를 알면 <strong>정렬 기준 커스터마이즈</strong>(key, lambda)를
                    자유자재로 활용할 수 있습니다.
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
                        <p><code>sort(key=lambda x: ...)</code>로 원하는 기준으로 정렬! 좌표 정렬, 문자열 정렬 등.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--green)">stable</text></svg></div>
                        <h3>안정 정렬</h3>
                        <p>같은 값의 원래 순서가 유지됩니다. Python의 sort()는 안정 정렬(TimSort)!</p>
                    </div>
                </div>
                <div class="code-block">
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
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> C++의 <code>sort()</code>에서 커스텀 비교 함수를 쓸 때는
                    <code>sort(v.begin(), v.end(), [](auto& a, auto& b) { ... })</code> 형태입니다.
                    Java는 <code>Collections.sort(list, (a, b) -> ...)</code>를 씁니다.
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
        var indicator = container.querySelector('#str-indicator' + s);
        var prevBtn = container.querySelector('#str-prev' + s);
        var nextBtn = container.querySelector('#str-next' + s);
        if (!indicator || !prevBtn || !nextBtn) return;
        var total = steps.length;
        var self = this;
        var go = function(idx) {
            if (idx < 0 || idx >= total) return;
            current = idx;
            steps[current].action();
            indicator.textContent = (current + 1) + ' / ' + total;
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === total - 1;
        };
        go(0);
        prevBtn.addEventListener('click', function() { go(current - 1); });
        nextBtn.addEventListener('click', function() { go(current + 1); });
        var keyHandler = function(e) {
            if (e.key === 'ArrowLeft') go(current - 1);
            if (e.key === 'ArrowRight') go(current + 1);
        };
        document.addEventListener('keydown', keyHandler);
        self._vizState.keydownHandler = keyHandler;
        self._vizState.steps = steps;
        self._vizState.currentStep = 0;
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
        var original = [38, 27, 43, 3, 9, 82, 10];
        var vizHTML = '<div class="viz-area">' +
            '<div id="sort-bars-sel" style="display:flex;gap:6px;align-items:flex-end;justify-content:center;min-height:200px;padding:20px 0;"></div>' +
            '<div id="sort-desc-sel" style="padding:14px;background:var(--bg-secondary);border-radius:8px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>';
        container.innerHTML = vizHTML + self._createStepControls('-sel');

        var barsEl = container.querySelector('#sort-bars-sel');
        var descEl = container.querySelector('#sort-desc-sel');

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

        var steps = states.map(function(st) {
            return { action: function() {
                self._renderBars(barsEl, st.arr, st.sortedUpTo, [], st.minIdx);
                descEl.innerHTML = st.desc;
            }};
        });
        self._initStepController(container, steps, '-sel');
    },

    // ── 좌표 정렬 (boj-11650) ──
    _renderVizCoordSort(container) {
        var self = this;
        var coords = [[3,4],[1,1],[1,-1],[2,2],[3,3]];
        var vizHTML = '<div class="viz-area">' +
            '<div style="font-weight:600;margin-bottom:8px;">좌표 배열</div>' +
            '<div id="sort-coords" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:50px;padding:12px 0;"></div>' +
            '<div id="sort-desc-coord" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>';
        container.innerHTML = vizHTML + self._createStepControls('-coord');

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

        // Simulate insertion sort by x then y (stable)
        var states = [];
        var simArr = coords.map(function(c) { return c.slice(); });
        states.push({ arr: simArr.map(function(c) { return c.slice(); }), sortedUpTo: -1, comp: -1,
            desc: '초기 좌표: ' + simArr.map(function(c) { return '(' + c.join(',') + ')'; }).join(', ') + '. 튜플 정렬을 시작합니다!' });

        // Simple insertion sort simulation
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

        var steps = states.map(function(st) {
            return { action: function() {
                renderCoords(st.arr, st.sortedUpTo, st.comp);
                descEl.innerHTML = st.desc;
            }};
        });
        self._initStepController(container, steps, '-coord');
    },

    // ── 구간 병합 (lc-56) ──
    _renderVizMergeIntervals(container) {
        var self = this;
        var intervals = [[1,3],[2,6],[8,10],[15,18]];
        var vizHTML = '<div class="viz-area">' +
            '<div style="font-weight:600;margin-bottom:8px;">구간 배열 (시작점 정렬 후)</div>' +
            '<div id="sort-intervals" style="position:relative;min-height:60px;padding:20px 0;"></div>' +
            '<div style="font-weight:600;margin-top:12px;margin-bottom:8px;">병합 결과</div>' +
            '<div id="sort-merged" style="position:relative;min-height:60px;padding:8px 0;"></div>' +
            '<div id="sort-desc-intv" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>';
        container.innerHTML = vizHTML + self._createStepControls('-intv');

        var intervalsEl = container.querySelector('#sort-intervals');
        var mergedEl = container.querySelector('#sort-merged');
        var descEl = container.querySelector('#sort-desc-intv');

        var scale = 30; // px per unit
        function renderIntervalBar(el, intArr, highlightIdx) {
            el.innerHTML = intArr.map(function(iv, i) {
                var w = (iv[1] - iv[0]) * scale;
                var l = iv[0] * scale;
                var bg = i === highlightIdx ? 'var(--accent)' : 'var(--green)';
                return '<div style="position:absolute;left:' + l + 'px;width:' + w + 'px;height:28px;background:' + bg + ';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600;color:white;">[' + iv[0] + ',' + iv[1] + ']</div>';
            }).join('');
        }

        var states = [];
        var merged = [];
        states.push({ intervals: intervals, merged: [], highlight: -1,
            desc: '구간: ' + intervals.map(function(v) { return '[' + v + ']'; }).join(', ') + '. 시작점으로 이미 정렬되어 있습니다.' });

        merged.push(intervals[0].slice());
        states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: 0,
            desc: '첫 구간 [' + intervals[0] + ']을 결과에 추가합니다.' });

        for (var i = 1; i < intervals.length; i++) {
            var cur = intervals[i];
            var last = merged[merged.length - 1];
            if (cur[0] <= last[1]) {
                last[1] = Math.max(last[1], cur[1]);
                states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: i,
                    desc: '[' + cur + '] 시작(' + cur[0] + ') ≤ 이전 끝(' + last[1] + ') → 겹침! 병합하여 [' + last[0] + ',' + last[1] + ']' });
            } else {
                merged.push(cur.slice());
                states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: i,
                    desc: '[' + cur + '] 시작(' + cur[0] + ') > 이전 끝 → 겹치지 않음. 새 구간 추가!' });
            }
        }
        states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: -1,
            desc: '병합 완료! 결과: ' + merged.map(function(v) { return '[' + v + ']'; }).join(', ') + ' ✓' });

        var steps = states.map(function(st) {
            return { action: function() {
                renderIntervalBar(intervalsEl, st.intervals, st.highlight);
                renderIntervalBar(mergedEl, st.merged, -1);
                descEl.innerHTML = st.desc;
            }};
        });
        self._initStepController(container, steps, '-intv');
    },

    // ── 안정 정렬 (boj-10814) ──
    _renderVizStableSort(container) {
        var self = this;
        var members = [
            { age: 21, name: 'Junkyu', order: 0 },
            { age: 21, name: 'Dohyun', order: 1 },
            { age: 20, name: 'Sunyoung', order: 2 },
            { age: 22, name: 'Alice', order: 3 },
            { age: 20, name: 'Bob', order: 4 }
        ];
        var vizHTML = '<div class="viz-area">' +
            '<div style="font-weight:600;margin-bottom:8px;">회원 목록 (입력 순서)</div>' +
            '<div id="sort-members" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;padding:12px 0;"></div>' +
            '<div id="sort-desc-stable" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>';
        container.innerHTML = vizHTML + self._createStepControls('-stable');

        var membersEl = container.querySelector('#sort-members');
        var descEl = container.querySelector('#sort-desc-stable');

        var colors = ['var(--accent)', 'var(--green)', '#e17055', '#6c5ce7', 'var(--yellow)'];

        function renderMembers(arr, sortedUpTo) {
            membersEl.innerHTML = arr.map(function(m, i) {
                var cls = 'str-char-box' + (i <= sortedUpTo ? ' matched' : '');
                return '<div class="' + cls + '" style="min-width:100px;text-align:center;font-size:0.85rem;border-left:3px solid ' + colors[m.order] + ';">' +
                    '<div style="font-weight:600;">' + m.age + '</div>' +
                    '<div style="font-size:0.75rem;color:var(--text-secondary);">' + m.name + '</div></div>';
            }).join('');
        }

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
                desc: key.age + ' ' + key.name + '을 삽입 → 나이 같은 경우 입력 순서 유지! (안정 정렬)' });
        }
        states.push({ arr: simArr.map(function(m) { return { age: m.age, name: m.name, order: m.order }; }), sortedUpTo: simArr.length - 1,
            desc: '정렬 완료! ' + simArr.map(function(m) { return m.age + ' ' + m.name; }).join(', ') + '. 나이 같은 Junkyu, Dohyun의 입력 순서가 유지됩니다 ✓' });

        var steps = states.map(function(st) {
            return { action: function() {
                renderMembers(st.arr, st.sortedUpTo);
                descEl.innerHTML = st.desc;
            }};
        });
        self._initStepController(container, steps, '-stable');
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
                <p>N개의 수가 주어집니다. 이를 <strong>오름차순으로 정렬</strong>해서 출력하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄: N (1 &le; N &le; 1,000)<br>다음 N줄: 정수</p></div>
                    <div><h4>출력</h4><p>오름차순으로 정렬한 결과를 한 줄에 하나씩</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5\n5\n2\n3\n4\n1</pre></div>
                    <div><strong>출력</strong><pre>1\n2\n3\n4\n5</pre></div>
                </div></div>
            `,
            hints: [
                { title: '가장 간단한 방법', content: 'Python: 리스트에 넣고 <code>sort()</code> 호출! O(n log n)' },
                { title: '직접 구현해보기', content: 'N &le; 1,000이므로 O(n²) 정렬도 가능합니다. 선택, 삽입, 버블 정렬 중 하나를 직접 구현해보세요!' },
                { title: '출력 최적화', content: 'Python에서 <code>print()</code>를 반복 호출하면 느릴 수 있습니다. <code>"\\n".join(map(str, arr))</code>로 한 번에!' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]\narr.sort()\nprint('\\n'.join(map(str, arr)))`,
                cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n    sort(arr.begin(), arr.end());\n    for (int x : arr) printf("%d\\n", x);\n}`,
                java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        int[] arr = new int[N];\n        for (int i = 0; i < N; i++) arr[i] = Integer.parseInt(br.readLine().trim());\n        Arrays.sort(arr);\n        StringBuilder sb = new StringBuilder();\n        for (int x : arr) sb.append(x).append("\\n");\n        System.out.print(sb);\n    }\n}`
            },
            solutions: [{
                approach: '내장 sort 사용',
                description: '리스트에 입력을 담고 sort()를 호출합니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                get templates() { return sortingTopic.problems[0].templates; },
                codeSteps: {
                    python: [
                        { title: '입력 받기', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]' },
                        { title: '정렬', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]\narr.sort()' },
                        { title: '출력', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]\narr.sort()\nprint(\'\\n\'.join(map(str, arr)))' }
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
                <p>2차원 평면 위의 점 N개가 주어집니다.
                <strong>x좌표가 증가하는 순</strong>으로, 같으면 <strong>y좌표가 증가하는 순</strong>으로 정렬하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄: N (1 &le; N &le; 100,000)<br>다음 N줄: x y</p></div>
                    <div><h4>출력</h4><p>정렬된 좌표를 한 줄에 하나씩</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5\n3 4\n1 1\n1 -1\n2 2\n3 3</pre></div>
                    <div><strong>출력</strong><pre>1 -1\n1 1\n2 2\n3 3\n3 4</pre></div>
                </div></div>
            `,
            hints: [
                { title: '튜플 정렬!', content: 'Python에서 튜플 리스트를 <code>sort()</code>하면 자동으로 첫 번째 기준 → 두 번째 기준으로 정렬됩니다!' },
                { title: '핵심 코드', content: '<code>coords = [(x, y) for ...]</code>로 만들고 <code>coords.sort()</code>하면 끝!' },
                { title: '입출력 최적화', content: 'N이 10만이므로 <code>sys.stdin.readline</code>과 한 번에 출력하는 것이 중요합니다.' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))\n\ncoords.sort()  # 튜플은 자동으로 (x, y) 순 정렬!\n\noutput = []\nfor x, y in coords:\n    output.append(f"{x} {y}")\nprint('\\n'.join(output))`,
                cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    vector<pair<int,int>> coords(N);\n    for (int i = 0; i < N; i++)\n        scanf("%d %d", &coords[i].first, &coords[i].second);\n    sort(coords.begin(), coords.end());\n    for (auto& [x, y] : coords)\n        printf("%d %d\\n", x, y);\n}`,
                java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        int[][] coords = new int[N][2];\n        for (int i = 0; i < N; i++) {\n            StringTokenizer st = new StringTokenizer(br.readLine());\n            coords[i][0] = Integer.parseInt(st.nextToken());\n            coords[i][1] = Integer.parseInt(st.nextToken());\n        }\n        Arrays.sort(coords, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);\n        StringBuilder sb = new StringBuilder();\n        for (int[] c : coords) sb.append(c[0]).append(" ").append(c[1]).append("\\n");\n        System.out.print(sb);\n    }\n}`
            },
            solutions: [{
                approach: '튜플 정렬',
                description: '좌표를 (x, y) 튜플로 만들면 자동으로 x → y 순으로 정렬됩니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                get templates() { return sortingTopic.problems[1].templates; },
                codeSteps: {
                    python: [
                        { title: '입력 받기', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))' },
                        { title: '튜플 정렬', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))\n\ncoords.sort()  # (x, y) 순 자동 정렬!' },
                        { title: '출력', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))\n\ncoords.sort()\n\noutput = []\nfor x, y in coords:\n    output.append(f"{x} {y}")\nprint(\'\\n\'.join(output))' }
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
                <p>구간 배열 <code>intervals</code>가 주어집니다.
                <strong>겹치는 구간을 합쳐서</strong> 반환하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>구간 배열 (각 구간 [start, end])</p></div>
                    <div><h4>출력</h4><p>합쳐진 구간 배열</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>[[1,3],[2,6],[8,10],[15,18]]</pre></div>
                    <div><strong>출력</strong><pre>[[1,6],[8,10],[15,18]]</pre></div>
                </div></div>
            `,
            hints: [
                { title: '정렬이 핵심!', content: '구간을 <strong>시작점 기준으로 정렬</strong>하면, 겹치는 구간이 연속으로 나옵니다!' },
                { title: '합치기 조건', content: '현재 구간의 시작 &le; 이전 구간의 끝이면 겹칩니다 → end를 max로 갱신!' },
                { title: '시간 복잡도', content: '정렬 O(n log n) + 순회 O(n) = <strong>O(n log n)</strong>' }
            ],
            templates: {
                python: `class Solution:\n    def merge(self, intervals):\n        intervals.sort(key=lambda x: x[0])  # 시작점 기준 정렬\n        merged = [intervals[0]]\n\n        for start, end in intervals[1:]:\n            if start <= merged[-1][1]:  # 겹침!\n                merged[-1][1] = max(merged[-1][1], end)\n            else:\n                merged.append([start, end])\n\n        return merged`,
                cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged = {intervals[0]};\n\n        for (int i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] <= merged.back()[1])\n                merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n            else\n                merged.push_back(intervals[i]);\n        }\n        return merged;\n    }\n};`,
                java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n        List<int[]> merged = new ArrayList<>();\n        merged.add(intervals[0]);\n\n        for (int i = 1; i < intervals.length; i++) {\n            int[] last = merged.get(merged.size() - 1);\n            if (intervals[i][0] <= last[1])\n                last[1] = Math.max(last[1], intervals[i][1]);\n            else\n                merged.add(intervals[i]);\n        }\n        return merged.toArray(new int[0][]);\n    }\n}`
            },
            solutions: [{
                approach: '정렬 + 순차 병합',
                description: '시작점 기준 정렬 후, 겹치면 end를 max로 갱신합니다.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                get templates() { return sortingTopic.problems[2].templates; },
                codeSteps: {
                    python: [
                        { title: '시작점 정렬', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])' },
                        { title: '첫 구간 추가', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]' },
                        { title: '겹침 판별 + 병합', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:  # 겹침!\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])' },
                        { title: '결과 반환', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n\n    return merged' }
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
                <p>온라인 저지에 가입한 사람들의 <strong>나이와 이름</strong>이 주어집니다.
                <strong>나이순</strong>으로 정렬하되, 나이가 같으면 <strong>가입한 순서(입력 순서)</strong>대로 출력하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄: 회원 수 N (1 &le; N &le; 100,000)<br>다음 N줄: 나이 이름</p></div>
                    <div><h4>출력</h4><p>나이순 정렬 결과 (나이 같으면 입력 순서)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3\n21 Junkyu\n21 Dohyun\n20 Sunyoung</pre></div>
                    <div><strong>출력</strong><pre>20 Sunyoung\n21 Junkyu\n21 Dohyun</pre></div>
                </div></div>
            `,
            hints: [
                { title: '안정 정렬이란?', content: '같은 키의 원소들이 <strong>원래 순서를 유지</strong>하는 정렬을 안정(stable) 정렬이라 합니다. Python의 sort, Java의 Arrays.sort(Object[])는 안정 정렬입니다!' },
                { title: '핵심 아이디어', content: '나이만 기준으로 정렬하면, 안정 정렬 덕분에 같은 나이인 사람들은 <strong>입력 순서가 유지</strong>됩니다.' },
                { title: '주의: C++ sort', content: 'C++의 <code>sort</code>는 불안정 정렬입니다. <code>stable_sort</code>를 쓰거나, 비교 함수에 입력 순서 인덱스를 포함해야 합니다.' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))\n\n# Python sort는 안정 정렬 → 나이만 기준으로 정렬해도 입력 순서 유지\nmembers.sort(key=lambda x: x[0])\n\nfor age, name in members:\n    print(age, name)`,
                cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    vector<pair<int, string>> v(N);\n    for (int i = 0; i < N; i++)\n        cin >> v[i].first >> v[i].second;\n\n    // stable_sort: 같은 나이면 입력 순서 유지\n    stable_sort(v.begin(), v.end(), [](auto& a, auto& b) {\n        return a.first < b.first;\n    });\n\n    for (auto& [age, name] : v)\n        printf("%d %s\\n", age, name.c_str());\n}`,
                java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        String[][] members = new String[N][2];\n        for (int i = 0; i < N; i++) {\n            StringTokenizer st = new StringTokenizer(br.readLine());\n            members[i][0] = st.nextToken();\n            members[i][1] = st.nextToken();\n        }\n        Arrays.sort(members, (a, b) -> Integer.parseInt(a[0]) - Integer.parseInt(b[0]));\n\n        StringBuilder sb = new StringBuilder();\n        for (String[] m : members)\n            sb.append(m[0]).append(' ').append(m[1]).append('\\n');\n        System.out.print(sb);\n    }\n}`
            },
            solutions: [{
                approach: '안정 정렬 활용',
                description: '나이만 기준으로 sort()하면 안정 정렬 덕분에 입력 순서가 자동 유지됩니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                get templates() { return sortingTopic.problems[3].templates; },
                codeSteps: {
                    python: [
                        { title: '입력 받기', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))' },
                        { title: '나이 기준 정렬 (안정)', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))\n\n# Python sort는 안정 정렬!\nmembers.sort(key=lambda x: x[0])' },
                        { title: '출력', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))\n\nmembers.sort(key=lambda x: x[0])\n\nfor age, name in members:\n    print(age, name)' }
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
