// =========================================================
// 배열 (Array) 토픽 모듈
// =========================================================
const arrayTopic = {
    id: 'array',
    title: '배열',
    icon: '📊',
    category: '자료구조 활용',
    order: 2,
    description: '배열을 활용한 투 포인터, 슬라이딩 윈도우, 구간 처리 기법',
    relatedNote: '이 외에도 카데인 알고리즘, 모노톤 스택, Dutch National Flag 등의 기법이 배열 문제에 활용됩니다.',

    sidebarExpandable: true,

    // 단일 통합 탭 (토픽 개요용)
    tabs: [{ id: 'concept', label: '학습하기' }],

    // 문제-유형 매핑
    problemMeta: {
        'lc-1':     { type: '해시맵 탐색',    color: 'var(--accent)', vizMethod: '_renderVizTwoSum' },
        'lc-121':   { type: '한 번 순회',     color: 'var(--green)',  vizMethod: '_renderVizStock' },
        'lc-15':    { type: '투 포인터',      color: '#e17055',      vizMethod: '_renderViz3Sum' },
        'boj-2003': { type: '슬라이딩 윈도우', color: '#6c5ce7',      vizMethod: '_renderVizSlidingWindow' }
    },

    // ===== 문제별 탭 정의 =====
    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    // ===== 문제별 콘텐츠 렌더링 (app.js에서 호출) =====
    renderProblemContent(container, problemId, tabId) {
        const self = this;
        const prob = self.problems.find(p => p.id === problemId);
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }

        const meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }

        self._clearVizState();

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);

        const flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '힌트에서 배운 개념이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
            code:    { intro: '이제 앞에서 정리한 풀이를 코드로 옮겨봅시다!', icon: '💻' }
        };
        const ft = flowMap[tabId];
        if (ft) {
            const introDiv = document.createElement('div');
            introDiv.className = 'flow-intro';
            introDiv.innerHTML = '<span class="flow-intro-icon">' + ft.icon + '</span><span>' + ft.intro + '</span>';
            container.appendChild(introDiv);
        }

        const contentDiv = document.createElement('div');
        container.appendChild(contentDiv);
        switch (tabId) {
            case 'problem': self._renderProblemTab(contentDiv, prob); break;
            case 'think':   self._renderThinkTab(contentDiv, prob); break;
            case 'sim':     self[meta.vizMethod](contentDiv); break;
            case 'code':    self._renderCodeTab(contentDiv, prob); break;
        }

        const tabOrder = ['problem', 'think', 'sim', 'code'];
        const tabLabels = { problem: '문제', think: '생각해볼것', sim: '시뮬레이션', code: '코드' };
        const ctaTexts = { problem: '문제를 이해했다면', think: '힌트를 모두 확인했다면', sim: '동작 원리를 파악했다면' };
        const curIdx = tabOrder.indexOf(tabId);
        if (curIdx >= 0 && curIdx < tabOrder.length - 1) {
            const nextId = tabOrder[curIdx + 1];
            const nextDiv = document.createElement('div');
            nextDiv.className = 'flow-next';
            nextDiv.innerHTML = '<button class="flow-next-btn">' + ctaTexts[tabId] + ' → ' + tabLabels[nextId] + ' →</button>';
            nextDiv.querySelector('button').addEventListener('click', function() { window._switchToTab(nextId); });
            container.appendChild(nextDiv);
        }
    },

    // ===== 문제 서브탭: 문제 =====
    _renderProblemTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    // ===== 문제 서브탭: 생각해볼것 =====
    _renderThinkTab(contentEl, prob) {
        const guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = '단계별로 눌러서 힌트를 확인하세요';
        contentEl.appendChild(guide);

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';
        const openedState = {};

        prob.hints.forEach(function(hint, idx) {
            const step = document.createElement('div');
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

    // ===== 문제 서브탭: 코드 =====
    _renderCodeTab(contentEl, prob) {
        if (prob.solutions && prob.solutions.length > 0) {
            window.renderSolutionsCodeTab(contentEl, prob);
            return;
        }
        const isLC = prob.link.includes('leetcode');
        const wrapper = document.createElement('div');
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
            var langMap = { python: 'language-python', cpp: 'language-cpp', java: 'language-java' };
            codeEl.className = langMap[lang];
            codeEl.textContent = prob.templates[lang];
            if (window.hljs) hljs.highlightElement(codeEl);
        });
        contentEl.appendChild(wrapper);
    },

    // ===== 개념 설명 탭 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>📊 배열 (Array)</h2>
                <p class="hero-sub">배열 위에서 효율적으로 문제를 푸는 핵심 패턴을 배워봅시다!</p>
            </div>

            <!-- 섹션 1: 배열 기초 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> 배열 기초
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 배열은 <em>"번호가 적힌 사물함"</em>입니다!
                    0번 사물함, 1번 사물함... 순서대로 나란히 있고, 번호만 알면 바로 열어볼 수 있습니다(O(1)).
                    다만 중간에 사물함을 끼워넣으려면 뒤의 것들을 모두 밀어야 합니다(O(n)).
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.3"/><rect x="14" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.6"/><rect x="26" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.9"/></svg>
                        </div>
                        <h3>인덱스 접근 O(1)</h3>
                        <p><code>arr[i]</code>로 어떤 위치든 바로 접근할 수 있습니다. 배열의 가장 큰 장점입니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">O(n)</text></svg>
                        </div>
                        <h3>순회</h3>
                        <p>배열의 모든 원소를 한 번씩 보면 O(n)입니다. 대부분의 배열 문제의 기본입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="12" font-weight="bold" fill="var(--yellow)">insert</text></svg>
                        </div>
                        <h3>삽입/삭제 O(n)</h3>
                        <p>중간에 넣거나 빼려면 뒤의 원소를 모두 밀어야 합니다. 끝에서의 작업은 O(1)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">sorted</text></svg>
                        </div>
                        <h3>정렬된 배열</h3>
                        <p>정렬되어 있으면 이분 탐색(O(log n))이 가능합니다. 투 포인터도 정렬 후 사용합니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 배열(리스트) 기본 조작
arr = [3, 1, 4, 1, 5, 9, 2, 6]

print(arr[0])       # 3 — 첫 원소
print(arr[-1])      # 6 — 마지막 원소
print(len(arr))     # 8 — 길이

arr.append(7)       # 끝에 추가: O(1)
arr.sort()          # 정렬: O(n log n)
print(arr)          # [1, 1, 2, 3, 4, 5, 6, 7, 9]

# 리스트 컴프리헨션 — 짝수만 골라내기
evens = [x for x in arr if x % 2 == 0]
print(evens)        # [2, 4, 6]</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">배열의 중간(인덱스 3)에 원소를 삽입하면 시간 복잡도는? 왜 그럴까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>O(n)</strong>입니다! 인덱스 3 이후의 모든 원소를 한 칸씩 뒤로 밀어야 하기 때문입니다.
                        배열 길이가 n이면 최대 n-3개의 원소를 이동해야 합니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 2: 투 포인터 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> 투 포인터 (Two Pointers)
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> <em>"양쪽 끝에서 동시에 걸어오는 두 사람"</em>입니다!
                    정렬된 배열에서 두 수의 합을 찾을 때, 합이 너무 크면 오른쪽을 줄이고, 너무 작으면 왼쪽을 늘립니다.
                    이중 for문(O(n²)) 대신 <strong>O(n)</strong>에 해결할 수 있습니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">L→</text></svg>
                        </div>
                        <h3>왼쪽에서 시작</h3>
                        <p><code>left = 0</code>에서 시작하여 오른쪽으로 이동합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">←R</text></svg>
                        </div>
                        <h3>오른쪽에서 시작</h3>
                        <p><code>right = n-1</code>에서 시작하여 왼쪽으로 이동합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="22" font-size="18" font-weight="bold" fill="var(--yellow)">↔</text></svg>
                        </div>
                        <h3>조건에 따라 이동</h3>
                        <p>합이 크면 right--, 작으면 left++. O(n)에 완료!</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 투 포인터: 정렬된 배열에서 합이 target인 두 수 찾기
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1      # 합이 작으니 왼쪽을 키움
        else:
            right -= 1     # 합이 크니 오른쪽을 줄임
    return [-1, -1]        # 못 찾음

arr = [1, 2, 4, 6, 8, 10]
print(two_sum_sorted(arr, 10))  # [1, 4] → 2+8=10</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">정렬된 [1, 3, 5, 7, 9]에서 합이 12인 두 수를 투 포인터로 찾으면 몇 번 비교할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>3번</strong>입니다! 1+9=10(작음→L++), 3+9=12(찾음!). 실제로는 2번만에 찾습니다.
                        이중 for문이라면 최대 10번 비교해야 할 것을 훨씬 빠르게 해결합니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 3: 슬라이딩 윈도우 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> 슬라이딩 윈도우 (Sliding Window)
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> <em>"창문을 옆으로 밀면서 바깥 풍경 보기"</em>입니다!
                    크기가 고정된 창문(윈도우)을 배열 위에서 한 칸씩 밀면서,
                    창문 안에 보이는 원소들의 합/최대/최소를 계속 추적합니다.
                    매번 처음부터 다시 세지 않고, 빠진 것은 빼고 들어온 것은 더합니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="12" width="20" height="14" rx="3" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4,2"/><rect x="6" y="14" width="6" height="10" rx="1" fill="var(--green)" opacity="0.4"/><rect x="13" y="14" width="6" height="10" rx="1" fill="var(--green)" opacity="0.4"/></svg>
                        </div>
                        <h3>고정 크기 윈도우</h3>
                        <p>크기 K인 윈도우를 한 칸씩 밀며 합을 갱신합니다. O(n)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="12" width="28" height="14" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="4,2"/><text x="10" y="22" font-size="8" fill="var(--text2)">가변</text></svg>
                        </div>
                        <h3>가변 크기 윈도우</h3>
                        <p>조건을 만족하면 왼쪽을 줄이고, 아니면 오른쪽을 늘립니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 슬라이딩 윈도우: 크기 K인 부분 배열의 최대 합
def max_subarray_sum(arr, k):
    # 처음 윈도우의 합
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # 한 칸씩 밀기: 새로 들어온 건 더하고, 나간 건 빼기
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

arr = [2, 1, 5, 1, 3, 2]
print(max_subarray_sum(arr, 3))  # 9 (= 5+1+3)</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">[1, 4, 2, 10, 2, 3, 1, 0, 20]에서 크기 4인 부분 배열의 최대 합은?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>24</strong>입니다! [2, 3, 1, 0, 20]에서 윈도우 [3, 1, 0, 20] = 24가 아니라,
                        [10, 2, 3, 1] = 16, [2, 3, 1, 0] = 6, [3, 1, 0, 20] = 24. 정답은 24!
                    </div>
                </div>
            </div>

            <!-- 섹션 4: 배열 문제 풀이 전략 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> 배열 문제 풀이 전략
                </div>
                <div class="analogy-box">
                    <strong>패턴을 알면 풀이가 보입니다!</strong> 배열 문제를 보면 먼저 이런 질문을 해보세요:
                    정렬하면 쉬워지나? → 투 포인터. 구간을 보는 건가? → 슬라이딩 윈도우.
                    각 원소에서 결과를 미리 계산? → 전처리(누적합/곱 배열).
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">sort</text></svg>
                        </div>
                        <h3>정렬 후 탐색</h3>
                        <p>정렬 O(n log n) 후 투 포인터 O(n) = 전체 O(n log n). 브루트 포스 O(n²)보다 빠릅니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">←→</text></svg>
                        </div>
                        <h3>좌우 전처리</h3>
                        <p>왼쪽→오른쪽, 오른쪽→왼쪽 두 번 훑으면 각 위치의 정보를 미리 계산할 수 있습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">max</text></svg>
                        </div>
                        <h3>상태 추적</h3>
                        <p>순회하면서 최솟값/최댓값/누적값을 변수에 추적하면 한 번에 답을 구할 수 있습니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 예시: 주식 최대 이익 (한 번 순회, 최솟값 추적)
def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)        # 지금까지 최저가
        max_profit = max(max_profit, price - min_price)  # 지금 팔면?
    return max_profit

prices = [7, 1, 5, 3, 6, 4]
print(max_profit(prices))  # 5 (1에 사서 6에 판다)</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">주식 문제를 이중 for문으로 풀면 O(n²)인데, 위의 풀이는 O(?)입니다. 왜 그럴까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>O(n)</strong>입니다! 배열을 딱 한 번만 순회하면서, "지금까지의 최솟값"을 변수 하나로 추적하기 때문입니다.
                        각 위치에서 "지금 팔면 이익이 얼마?"를 바로 계산할 수 있습니다.
                    </div>
                </div>
            </div>
        `;

        container.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                box.classList.toggle('open');
                btn.style.display = 'none';
            });
        });
    },

    // ===== 시각화 탭 =====
    renderVisualize(container) { container.innerHTML = ''; },

    // ===== 시각화: Two Sum (해시맵 or 투 포인터) =====
    _renderVizTwoSum(container) {
        const self = this;
        self._clearVizState();

        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">목표 합:
                    <input type="number" id="arr-target" value="9"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;">
                </label>
                <button class="btn btn-primary" id="arr-viz-start">탐색 시작</button>
            </div>

            <div class="graph-svg-container" style="min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">
                <div id="arr-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                <div id="arr-pointer-info" style="font-size:1.1rem;font-weight:600;color:var(--text2);text-align:center;min-height:28px;"></div>
            </div>

            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:150px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 합</div>
                    <div id="arr-sum-display" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;">시작을 눌러주세요</div>
                </div>
                <div style="flex:1;min-width:150px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">상태</div>
                    <div id="arr-status" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">—</div>
                </div>
            </div>

            ${self._createStepControls()}

            <div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 미검사</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 현재 포인터</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 정답 찾음</span>
            </div>
        `;

        const DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const boxes = container.querySelector('#arr-boxes');
        const pointerInfo = container.querySelector('#arr-pointer-info');
        const sumDisplay = container.querySelector('#arr-sum-display');
        const statusEl = container.querySelector('#arr-status');

        function renderBoxes() {
            boxes.innerHTML = '';
            DATA.forEach((v, i) => {
                const box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = `
                    <div class="str-char-idx">${i}</div>
                    <div class="str-char-val">${v}</div>
                `;
                boxes.appendChild(box);
            });
        }

        function setBoxState(idx, cls) {
            const box = boxes.querySelector(`[data-idx="${idx}"]`);
            if (box) box.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }

        function saveState() {
            return {
                boxClasses: Array.from(boxes.querySelectorAll('.str-char-box')).map(b => b.className),
                pointer: pointerInfo.innerHTML,
                sum: sumDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            boxes.querySelectorAll('.str-char-box').forEach((b, i) => { b.className = s.boxClasses[i]; });
            pointerInfo.innerHTML = s.pointer;
            sumDisplay.innerHTML = s.sum;
            statusEl.innerHTML = s.status;
        }

        renderBoxes();

        container.querySelector('#arr-viz-start').addEventListener('click', function() {
            self._clearVizState();
            renderBoxes();

            const target = parseInt(container.querySelector('#arr-target').value) || 9;
            pointerInfo.textContent = '';
            sumDisplay.textContent = '—';
            statusEl.textContent = '탐색 준비 완료';

            let left = 0, right = DATA.length - 1;
            const steps = [];
            let found = false;

            while (left < right) {
                const l = left, r = right;
                const s = DATA[l] + DATA[r];
                const match = s === target;
                const tooSmall = s < target;

                steps.push({
                    description: `left=${l}(${DATA[l]}) + right=${r}(${DATA[r]}) = ${s} ${match ? '= ' + target + ' 찾음!' : tooSmall ? '< ' + target + ' → left++' : '> ' + target + ' → right--'}`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        for (let i = 0; i < DATA.length; i++) setBoxState(i, '');
                        setBoxState(l, match ? 'matched' : 'comparing');
                        setBoxState(r, match ? 'matched' : 'comparing');
                        pointerInfo.innerHTML = `<span style="color:var(--green);">L→ ${l}</span> &nbsp;&nbsp; <span style="color:var(--accent);">R→ ${r}</span>`;
                        sumDisplay.innerHTML = `${DATA[l]} + ${DATA[r]} = <strong>${s}</strong>`;
                        if (match) {
                            statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;">✓ 찾았습니다! ${DATA[l]} + ${DATA[r]} = ${target}</span>`;
                        } else if (tooSmall) {
                            statusEl.innerHTML = `${s} < ${target} → <span style="color:var(--green);">left를 오른쪽으로!</span>`;
                        } else {
                            statusEl.innerHTML = `${s} > ${target} → <span style="color:var(--accent);">right를 왼쪽으로!</span>`;
                        }
                    },
                    undo: function() { restoreState(this._before); }
                });

                if (match) { found = true; break; }
                if (tooSmall) left++;
                else right--;
            }

            if (!found) {
                steps.push({
                    description: `합이 ${target}인 두 수를 찾을 수 없습니다.`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        statusEl.innerHTML = '<span style="color:var(--red,#e17055);">✗ 찾을 수 없습니다</span>';
                    },
                    undo: function() { restoreState(this._before); }
                });
            }

            self._initStepController(container, steps);
        });
    },

    // ===== 시각화 상태 관리 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls(suffix) {
        const s = suffix || '';
        return `
            <div class="viz-step-controls">
                <button class="btn viz-step-btn" id="viz-prev${s}" disabled>&larr; 이전</button>
                <span id="viz-step-counter${s}" class="viz-step-counter">시작 전</span>
                <button class="btn btn-primary viz-step-btn" id="viz-next${s}">다음 &rarr;</button>
            </div>
            <div id="viz-step-desc${s}" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>
        `;
    },

    _initStepController(el, steps) {
        const state = this._vizState;
        state.steps = steps; state.currentStep = -1;
        const prevBtn = el.querySelector('#viz-prev');
        const nextBtn = el.querySelector('#viz-next');
        const counter = el.querySelector('#viz-step-counter');
        const desc = el.querySelector('#viz-step-desc');

        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { counter.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { counter.textContent = `Step ${idx + 1} / ${total}`; desc.textContent = state.steps[idx].description; }
        };

        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; state.steps[state.currentStep].action(); updateUI();
        });
        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo(); state.currentStep--; updateUI();
        });

        const handleKeydown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
        };
        document.addEventListener('keydown', handleKeydown);
        state.keydownHandler = handleKeydown;
        updateUI();
    },

    // ===== 시각화: Best Time to Buy and Sell Stock =====
    _renderVizStock(container) {
        const self = this;
        self._clearVizState();
        const PRICES = [7, 1, 5, 3, 6, 4];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">가격 배열: <input type="text" id="stock-input" value="7, 1, 5, 3, 6, 4" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<button class="btn btn-primary" id="stock-start">시작</button></div>' +
            '<div class="graph-svg-container" style="min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">' +
            '<div id="stock-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div></div>' +
            '<div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:150px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">최소 가격</div><div id="stock-min" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;">—</div></div>' +
            '<div style="flex:1;min-width:150px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 이익</div><div id="stock-profit" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;">—</div></div>' +
            '<div style="flex:1;min-width:150px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">최대 이익</div><div id="stock-maxprofit" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;">—</div></div></div>' +
            self._createStepControls() +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);vertical-align:middle;"></span> 현재 확인 중</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--green);vertical-align:middle;"></span> 최소 가격</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--accent);vertical-align:middle;"></span> 최적 매도</span></div>';

        const boxes = container.querySelector('#stock-boxes');
        const minEl = container.querySelector('#stock-min');
        const profitEl = container.querySelector('#stock-profit');
        const maxProfitEl = container.querySelector('#stock-maxprofit');

        function renderBoxes(data) {
            boxes.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">Day ' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxes.appendChild(box);
            });
        }
        function setBoxState(idx, cls) { var b = boxes.querySelector('[data-idx="' + idx + '"]'); if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : ''); }
        function saveState(data) {
            return { boxClasses: Array.from(boxes.querySelectorAll('.str-char-box')).map(function(b){return b.className;}), min: minEl.innerHTML, profit: profitEl.innerHTML, maxP: maxProfitEl.innerHTML };
        }
        function restoreState(s) {
            boxes.querySelectorAll('.str-char-box').forEach(function(b,i){ b.className = s.boxClasses[i]; });
            minEl.innerHTML = s.min; profitEl.innerHTML = s.profit; maxProfitEl.innerHTML = s.maxP;
        }

        container.querySelector('#stock-start').addEventListener('click', function() {
            self._clearVizState();
            var input = container.querySelector('#stock-input').value;
            var data = input.split(',').map(function(s){ return parseInt(s.trim()); }).filter(function(n){ return !isNaN(n); });
            if (data.length < 2) { data = PRICES; }
            renderBoxes(data);
            minEl.textContent = '—'; profitEl.textContent = '—'; maxProfitEl.textContent = '—';

            var minPrice = Infinity, maxProfit = 0, minIdx = -1, bestBuy = -1, bestSell = -1;
            var steps = [];

            data.forEach(function(price, i) {
                var curMin = minPrice, curMinIdx = minIdx, curMax = maxProfit, curBestBuy = bestBuy, curBestSell = bestSell;
                var newMin = false, newProfit = false;
                if (price < minPrice) { minPrice = price; minIdx = i; newMin = true; }
                var profit = price - minPrice;
                if (profit > maxProfit) { maxProfit = profit; bestBuy = minIdx; bestSell = i; newProfit = true; }
                var _i = i, _price = price, _minPrice = minPrice, _minIdx = minIdx, _profit = profit, _maxProfit = maxProfit, _newMin = newMin, _newProfit = newProfit, _bestBuy = bestBuy, _bestSell = bestSell;

                steps.push({
                    description: 'Day ' + _i + ': 가격=' + _price + (_newMin ? ' → 새 최솟값!' : '') + ', 이익=' + _profit + (_newProfit ? ' → 새 최대이익!' : ''),
                    _before: null,
                    action: function() {
                        this._before = saveState(data);
                        for (var j = 0; j < data.length; j++) setBoxState(j, '');
                        setBoxState(_minIdx, 'matched');
                        setBoxState(_i, 'comparing');
                        if (_bestSell >= 0 && _bestSell !== _i) setBoxState(_bestSell, 'visited');
                        minEl.innerHTML = '<strong>' + _minPrice + '</strong> (Day ' + _minIdx + ')';
                        profitEl.innerHTML = _price + ' - ' + _minPrice + ' = <strong>' + _profit + '</strong>';
                        maxProfitEl.innerHTML = '<strong>' + _maxProfit + '</strong>' + (_bestBuy >= 0 ? ' (Day ' + _bestBuy + '→' + _bestSell + ')' : '');
                    },
                    undo: function() { restoreState(this._before); }
                });
            });

            self._initStepController(container, steps);
        });
    },

    // ===== 시각화: 3Sum =====
    _renderViz3Sum(container) {
        const self = this;
        self._clearVizState();

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="three-input" value="-1, 0, 1, 2, -1, -4" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:240px;"></label>' +
            '<button class="btn btn-primary" id="three-start">탐색 시작</button></div>' +
            '<div class="graph-svg-container" style="min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">' +
            '<div id="three-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="three-pointer" style="font-size:1.1rem;font-weight:600;color:var(--text2);text-align:center;min-height:28px;"></div></div>' +
            '<div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:150px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 합</div><div id="three-sum" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;">—</div></div>' +
            '<div style="flex:1;min-width:150px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">찾은 조합</div><div id="three-results" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.95rem;color:var(--text2);">—</div></div></div>' +
            self._createStepControls() +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:#e17055;vertical-align:middle;"></span> i (고정)</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);vertical-align:middle;"></span> L / R (포인터)</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--green);vertical-align:middle;"></span> 합 = 0 찾음</span></div>';

        var boxesEl = container.querySelector('#three-boxes');
        var ptrEl = container.querySelector('#three-pointer');
        var sumEl = container.querySelector('#three-sum');
        var resultsEl = container.querySelector('#three-results');

        function renderBoxes(data) {
            boxesEl.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxesEl.appendChild(box);
            });
        }
        function setBoxState(idx, cls) { var b = boxesEl.querySelector('[data-idx="' + idx + '"]'); if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : ''); }
        function saveState() {
            return { bc: Array.from(boxesEl.querySelectorAll('.str-char-box')).map(function(b){return b.className;}), ptr: ptrEl.innerHTML, sum: sumEl.innerHTML, res: resultsEl.innerHTML };
        }
        function restoreState(s) {
            boxesEl.querySelectorAll('.str-char-box').forEach(function(b,i){b.className=s.bc[i];}); ptrEl.innerHTML=s.ptr; sumEl.innerHTML=s.sum; resultsEl.innerHTML=s.res;
        }

        container.querySelector('#three-start').addEventListener('click', function() {
            self._clearVizState();
            var input = container.querySelector('#three-input').value;
            var data = input.split(',').map(function(s){return parseInt(s.trim());}).filter(function(n){return !isNaN(n);});
            if (data.length < 3) data = [-1, 0, 1, 2, -1, -4];
            data.sort(function(a,b){return a-b;});
            renderBoxes(data);
            ptrEl.textContent = '정렬 완료: [' + data.join(', ') + ']';
            sumEl.textContent = '—'; resultsEl.textContent = '—';

            var steps = [];
            var foundResults = [];

            for (var i = 0; i < data.length - 2; i++) {
                if (i > 0 && data[i] === data[i-1]) continue;
                var left = i + 1, right = data.length - 1;
                while (left < right) {
                    var s = data[i] + data[left] + data[right];
                    var _i = i, _l = left, _r = right, _s = s, _match = (s === 0);
                    var _foundSoFar = foundResults.slice();
                    if (_match) _foundSoFar.push('[' + data[i] + ',' + data[left] + ',' + data[right] + ']');
                    var _foundCopy = _foundSoFar.slice();
                    steps.push({
                        description: 'i=' + _i + '(' + data[_i] + '), L=' + _l + '(' + data[_l] + '), R=' + _r + '(' + data[_r] + ') → 합=' + _s + (_match ? ' = 0 찾음!' : (_s < 0 ? ' < 0 → L++' : ' > 0 → R--')),
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_i, _match ? 'matched' : 'visited');
                            setBoxState(_l, _match ? 'matched' : 'comparing');
                            setBoxState(_r, _match ? 'matched' : 'comparing');
                            ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--green);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                            sumEl.innerHTML = data[_i] + ' + ' + data[_l] + ' + ' + data[_r] + ' = <strong>' + _s + '</strong>';
                            resultsEl.innerHTML = _foundCopy.length > 0 ? _foundCopy.join(', ') : '—';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    if (_match) { foundResults.push('[' + data[i] + ',' + data[left] + ',' + data[right] + ']'); while (left < right && data[left] === data[left+1]) left++; while (left < right && data[right] === data[right-1]) right--; left++; right--; }
                    else if (s < 0) left++;
                    else right--;
                }
            }
            if (steps.length === 0) steps.push({ description: '조합을 찾을 수 없습니다.', _before: null, action: function(){this._before=saveState();resultsEl.textContent='없음';}, undo: function(){restoreState(this._before);} });
            self._initStepController(container, steps);
        });
    },

    // ===== 시각화: 슬라이딩 윈도우 (수들의 합) =====
    _renderVizSlidingWindow(container) {
        const self = this;
        self._clearVizState();

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="sw-arr" value="1, 1, 1, 1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
            '<label style="font-weight:600;">목표 합 M: <input type="number" id="sw-target" value="2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="sw-start">시작</button></div>' +
            '<div class="graph-svg-container" style="min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">' +
            '<div id="sw-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="sw-pointer" style="font-size:1.1rem;font-weight:600;color:var(--text2);text-align:center;min-height:28px;"></div></div>' +
            '<div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">구간 합</div><div id="sw-sum" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;">—</div></div>' +
            '<div style="flex:1;min-width:120px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">매치 횟수</div><div id="sw-count" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;">0</div></div>' +
            '<div style="flex:1;min-width:120px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">상태</div><div id="sw-status" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:0.95rem;color:var(--text2);">—</div></div></div>' +
            self._createStepControls() +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);vertical-align:middle;"></span> 현재 윈도우</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--green);vertical-align:middle;"></span> 합 = M</span></div>';

        var boxesEl = container.querySelector('#sw-boxes');
        var ptrEl = container.querySelector('#sw-pointer');
        var sumEl = container.querySelector('#sw-sum');
        var countEl = container.querySelector('#sw-count');
        var statusEl = container.querySelector('#sw-status');

        function renderBoxes(data) {
            boxesEl.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxesEl.appendChild(box);
            });
        }
        function setBoxState(idx, cls) { var b = boxesEl.querySelector('[data-idx="' + idx + '"]'); if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : ''); }
        function saveState() {
            return { bc: Array.from(boxesEl.querySelectorAll('.str-char-box')).map(function(b){return b.className;}), ptr: ptrEl.innerHTML, sum: sumEl.innerHTML, cnt: countEl.innerHTML, st: statusEl.innerHTML };
        }
        function restoreState(s) {
            boxesEl.querySelectorAll('.str-char-box').forEach(function(b,i){b.className=s.bc[i];}); ptrEl.innerHTML=s.ptr; sumEl.innerHTML=s.sum; countEl.innerHTML=s.cnt; statusEl.innerHTML=s.st;
        }

        container.querySelector('#sw-start').addEventListener('click', function() {
            self._clearVizState();
            var input = container.querySelector('#sw-arr').value;
            var data = input.split(',').map(function(s){return parseInt(s.trim());}).filter(function(n){return !isNaN(n);});
            if (data.length < 1) data = [1, 1, 1, 1];
            var M = parseInt(container.querySelector('#sw-target').value) || 2;
            renderBoxes(data);
            ptrEl.textContent = ''; sumEl.textContent = '—'; countEl.textContent = '0'; statusEl.textContent = '준비 완료';

            var steps = [];
            var start = 0, end = 0, curSum = 0, count = 0;

            while (true) {
                var action, desc;
                if (curSum >= M) {
                    var _s = start, _e = end, _sum = curSum, _cnt = count, _matched = (curSum === M);
                    if (_matched) count++;
                    var _cntAfter = count;
                    desc = 'sum=' + _sum + (_matched ? ' = ' + M + ' → count++! ' : ' >= ' + M + ' → ') + 'start++ (arr[' + _s + ']=' + data[_s] + ' 제거)';
                    steps.push({
                        description: desc, _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            for (var j = _s; j < _e; j++) setBoxState(j, _matched ? 'matched' : 'comparing');
                            ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + '</span> &nbsp; <span style="color:var(--accent);">end=' + _e + '</span>';
                            sumEl.innerHTML = '<strong>' + _sum + '</strong>';
                            countEl.innerHTML = '<strong>' + _cntAfter + '</strong>';
                            statusEl.innerHTML = _matched ? '<span style="color:var(--green);">✓ 합 = ' + M + '!</span>' : 'sum ≥ M → start 이동';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    curSum -= data[start]; start++;
                } else if (end >= data.length) {
                    break;
                } else {
                    var _s = start, _e = end, _val = data[end];
                    curSum += data[end]; end++;
                    var _sum = curSum, _endAfter = end;
                    desc = 'arr[' + _e + ']=' + _val + ' 추가 → sum=' + _sum;
                    steps.push({
                        description: desc, _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            for (var j = _s; j < _endAfter; j++) setBoxState(j, 'comparing');
                            ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + '</span> &nbsp; <span style="color:var(--accent);">end=' + _endAfter + '</span>';
                            sumEl.innerHTML = '<strong>' + _sum + '</strong>';
                            statusEl.innerHTML = _sum < M ? 'sum < M → end 확장' : 'sum ≥ M';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                }
            }
            // Final match check
            if (curSum === M) {
                count++;
                var _cnt = count;
                steps.push({ description: '최종 확인: sum=' + curSum + ' = ' + M + ' → count=' + _cnt, _before: null,
                    action: function() { this._before = saveState(); countEl.innerHTML = '<strong>' + _cnt + '</strong>'; statusEl.innerHTML = '<span style="color:var(--green);">완료! 총 ' + _cnt + '개</span>'; },
                    undo: function() { restoreState(this._before); }
                });
            }
            steps.push({ description: '탐색 완료! 합이 ' + M + '인 부분합: ' + count + '개', _before: null,
                action: function() { this._before = saveState(); statusEl.innerHTML = '<span style="color:var(--green);font-size:1.05rem;">✓ 총 ' + count + '개 발견</span>'; },
                undo: function() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        });
    },

    // ===== 문제풀이 탭 =====
    stages: [
        { num: 1, title: '배열 기본', desc: '한 번 순회, 투 포인터 기본 (Easy~Silver)', problemIds: ['lc-1', 'lc-121'] },
        { num: 2, title: '배열 심화', desc: '투 포인터 심화, 전처리 (Medium~Gold)', problemIds: ['lc-15', 'boj-2003'] }
    ],

    problems: [
        {
            id: 'lc-1',
            title: 'LeetCode 1 - Two Sum',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/two-sum/',
            simIntro: '정렬된 배열에서 투 포인터가 두 수의 합을 어떻게 찾는지 단계별로 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수 배열 <code>nums</code>와 정수 <code>target</code>이 주어집니다.
                합이 <code>target</code>이 되는 <strong>두 수의 인덱스</strong>를 반환하세요.</p>
                <p>같은 원소를 두 번 사용할 수 없고, 정답은 정확히 하나 존재합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>nums = [2,7,11,15], target = 9</p></div>
                    <div><h4>출력</h4><p>[0, 1]  (nums[0]+nums[1]=2+7=9)</p></div>
                </div>
            `,
            hints: [
                { title: '브루트 포스', content: '이중 for문으로 모든 쌍을 확인하면 O(n²)에 풀 수 있습니다. 하지만 더 빠른 방법이 있습니다!' },
                { title: '해시맵 활용', content: '순회하면서 <code>target - nums[i]</code>가 이미 해시맵에 있는지 확인합니다. 있으면 바로 정답!' },
                { title: '시간 복잡도', content: '해시맵 풀이: O(n) 시간, O(n) 공간. 한 번 순회로 끝!' }
            ],
            inputDefault: 0,
            solve() { return '[0, 1]'; },
            templates: {
                python: `class Solution:
    def twoSum(self, nums, target):
        seen = {}  # 값 → 인덱스
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i`,
                cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums[i];
            if (seen.count(comp)) return {seen[comp], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
                java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`
            },
            solutions: [{
                approach: '해시맵',
                description: '한 번 순회하면서 해시맵(딕셔너리)으로 complement를 확인',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                templates: {
                    python: `class Solution:\n    def twoSum(self, nums, target):\n        seen = {}  # 값 → 인덱스\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in seen:\n                return [seen[complement], i]\n            seen[num] = i`,
                    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
                    java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`
                },
                codeSteps: {
                    python: [
                        { title: '해시맵 초기화', desc: '값→인덱스를 저장할 딕셔너리 생성', code: 'class Solution:\n    def twoSum(self, nums, target):\n        seen = {}  # 값 → 인덱스' },
                        { title: '배열 순회', desc: 'enumerate로 인덱스와 값을 동시에 순회', code: '        for i, num in enumerate(nums):' },
                        { title: 'complement 계산 + 확인', desc: 'target - num이 이미 해시맵에 있으면 정답!', code: '            complement = target - num\n            if complement in seen:\n                return [seen[complement], i]' },
                        { title: '현재 값 저장', desc: '짝을 못 찾았으면 현재 값을 해시맵에 저장', code: '            seen[num] = i' }
                    ],
                    cpp: [
                        { title: '해시맵 초기화', desc: 'unordered_map으로 값→인덱스 저장', code: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;' },
                        { title: '배열 순회', desc: 'for문으로 인덱스와 값을 순회', code: '        for (int i = 0; i < nums.size(); i++) {' },
                        { title: 'complement 계산 + 확인', desc: 'target - nums[i]가 해시맵에 있으면 반환', code: '            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};' },
                        { title: '현재 값 저장 + 마무리', desc: '못 찾으면 현재 값을 해시맵에 추가', code: '            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};' }
                    ],
                    java: [
                        { title: '해시맵 초기화', desc: 'HashMap으로 값→인덱스 저장', code: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();' },
                        { title: '배열 순회', desc: 'for문으로 인덱스와 값을 순회', code: '        for (int i = 0; i < nums.length; i++) {' },
                        { title: 'complement 계산 + 확인', desc: 'target - nums[i]가 해시맵에 있으면 반환', code: '            int comp = target - nums[i];\n            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};' },
                        { title: '현재 값 저장 + 마무리', desc: '못 찾으면 현재 값을 해시맵에 추가', code: '            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-121',
            title: 'LeetCode 121 - Best Time to Buy and Sell Stock',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
            simIntro: '최솟값을 추적하면서 이익을 계산하는 과정을 단계별로 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>주식 가격 배열 <code>prices</code>가 주어집니다. <code>prices[i]</code>는 i번째 날의 주가입니다.</p>
                <p>한 번 사고 한 번 팔아서 얻을 수 있는 <strong>최대 이익</strong>을 반환하세요.
                이익을 낼 수 없으면 0을 반환합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>prices = [7, 1, 5, 3, 6, 4]</p></div>
                    <div><h4>출력</h4><p>5  (1에 사서 6에 판다)</p></div>
                </div>
            `,
            hints: [
                { title: '핵심 관찰', content: '팔기 전에 사야 합니다! 즉, <strong>앞에서 최솟값</strong>을 추적하면서 "지금 팔면 얼마?"를 계속 계산합니다.' },
                { title: '한 번 순회', content: '<code>min_price</code>를 유지하면서, 각 날의 <code>price - min_price</code>가 현재 최대 이익보다 크면 갱신합니다.' },
                { title: '시간 복잡도', content: 'O(n) 시간, O(1) 공간. 변수 2개만으로 해결!' }
            ],
            inputDefault: 0,
            solve() { return '5'; },
            templates: {
                python: `class Solution:
    def maxProfit(self, prices):
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit`,
                cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minP = INT_MAX, maxP = 0;
        for (int p : prices) {
            minP = min(minP, p);
            maxP = max(maxP, p - minP);
        }
        return maxP;
    }
};`,
                java: `class Solution {
    public int maxProfit(int[] prices) {
        int minP = Integer.MAX_VALUE, maxP = 0;
        for (int p : prices) {
            minP = Math.min(minP, p);
            maxP = Math.max(maxP, p - minP);
        }
        return maxP;
    }
}`
            },
            solutions: [{
                approach: '한 번 순회',
                description: '최솟값을 추적하면서 현재 가격과의 차이로 최대 이익을 계산',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def maxProfit(self, prices):\n        min_price = float('inf')\n        max_profit = 0\n        for price in prices:\n            min_price = min(min_price, price)\n            max_profit = max(max_profit, price - min_price)\n        return max_profit`,
                    cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};`,
                    java: `class Solution {\n    public int maxProfit(int[] prices) {\n        int minP = Integer.MAX_VALUE, maxP = 0;\n        for (int p : prices) {\n            minP = Math.min(minP, p);\n            maxP = Math.max(maxP, p - minP);\n        }\n        return maxP;\n    }\n}`
                },
                codeSteps: {
                    python: [
                        { title: '변수 초기화', desc: '최소 가격을 무한대, 최대 이익을 0으로 초기화', code: 'class Solution:\n    def maxProfit(self, prices):\n        min_price = float(\'inf\')\n        max_profit = 0' },
                        { title: '가격 순회', desc: '각 날의 가격을 하나씩 확인', code: '        for price in prices:' },
                        { title: '최솟값 갱신', desc: '지금까지의 최저가를 추적', code: '            min_price = min(min_price, price)' },
                        { title: '이익 계산', desc: '현재 가격에 팔면 이익이 얼마인지 계산하고 최대값 갱신', code: '            max_profit = max(max_profit, price - min_price)' },
                        { title: '결과 반환', desc: '순회 완료 후 최대 이익을 반환', code: '        return max_profit' }
                    ],
                    cpp: [
                        { title: '변수 초기화', desc: '최소 가격 INT_MAX, 최대 이익 0', code: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;' },
                        { title: '순회 + 최솟값 갱신', desc: '각 가격에서 최저가를 추적', code: '        for (int p : prices) {\n            minP = min(minP, p);' },
                        { title: '이익 계산 + 결과', desc: '현재 이익을 계산하고 최대값 갱신', code: '            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};' }
                    ],
                    java: [
                        { title: '변수 초기화', desc: '최소 가격 MAX_VALUE, 최대 이익 0', code: 'class Solution {\n    public int maxProfit(int[] prices) {\n        int minP = Integer.MAX_VALUE, maxP = 0;' },
                        { title: '순회 + 최솟값 갱신', desc: '각 가격에서 최저가를 추적', code: '        for (int p : prices) {\n            minP = Math.min(minP, p);' },
                        { title: '이익 계산 + 결과', desc: '현재 이익을 계산하고 최대값 갱신', code: '            maxP = Math.max(maxP, p - minP);\n        }\n        return maxP;\n    }\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-15',
            title: 'LeetCode 15 - 3Sum',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/3sum/',
            simIntro: '정렬 후 하나를 고정하고 투 포인터로 좁혀가는 과정을 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수 배열 <code>nums</code>에서 합이 0이 되는 <strong>세 수의 조합</strong>을 모두 찾으세요.</p>
                <p>중복되는 조합은 제거해야 합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>nums = [-1, 0, 1, 2, -1, -4]</p></div>
                    <div><h4>출력</h4><p>[[-1, -1, 2], [-1, 0, 1]]</p></div>
                </div>
            `,
            hints: [
                { title: '정렬이 핵심!', content: '먼저 배열을 정렬합니다. 그러면 중복 제거와 투 포인터 사용이 모두 쉬워집니다!' },
                { title: '하나 고정 + 투 포인터', content: 'i를 고정하고, <code>left=i+1</code>, <code>right=n-1</code>로 투 포인터. 세 수의 합이 0보다 크면 right--, 작으면 left++.' },
                { title: '중복 제거', content: '같은 값의 i는 건너뜁니다: <code>if i > 0 and nums[i] == nums[i-1]: continue</code>. left/right도 마찬가지!' }
            ],
            inputDefault: 0,
            solve() { return '[[-1, -1, 2], [-1, 0, 1]]'; },
            templates: {
                python: `class Solution:
    def threeSum(self, nums):
        nums.sort()
        result = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue  # 중복 건너뛰기
            left, right = i + 1, len(nums) - 1
            while left < right:
                s = nums[i] + nums[left] + nums[right]
                if s == 0:
                    result.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]: left += 1
                    while left < right and nums[right] == nums[right - 1]: right -= 1
                    left += 1; right -= 1
                elif s < 0:
                    left += 1
                else:
                    right -= 1
        return result`,
                cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                } else if (s < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
                java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (s < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`
            },
            solutions: [{
                approach: '정렬 + 투 포인터',
                description: '정렬 후 하나를 고정하고, 나머지 두 수를 투 포인터로 탐색',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def threeSum(self, nums):\n        nums.sort()\n        result = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:\n                continue\n            left, right = i + 1, len(nums) - 1\n            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s == 0:\n                    result.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]: left += 1\n                    while left < right and nums[right] == nums[right - 1]: right -= 1\n                    left += 1; right -= 1\n                elif s < 0:\n                    left += 1\n                else:\n                    right -= 1\n        return result`,
                    cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};`,
                    java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}`
                },
                codeSteps: {
                    python: [
                        { title: '정렬', desc: '투 포인터 사용을 위해 배열을 정렬', code: 'class Solution:\n    def threeSum(self, nums):\n        nums.sort()\n        result = []' },
                        { title: '첫 번째 수 고정 + 중복 건너뛰기', desc: 'i를 고정하고 같은 값은 건너뜀', code: '        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:\n                continue' },
                        { title: '투 포인터 설정', desc: 'left=i+1, right=끝으로 설정', code: '            left, right = i + 1, len(nums) - 1' },
                        { title: '합 비교 + 포인터 이동', desc: '합이 0이면 추가, 작으면 left++, 크면 right--', code: '            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s == 0:\n                    result.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]: left += 1\n                    while left < right and nums[right] == nums[right - 1]: right -= 1\n                    left += 1; right -= 1\n                elif s < 0:\n                    left += 1\n                else:\n                    right -= 1' },
                        { title: '결과 반환', desc: '모든 조합을 찾아서 반환', code: '        return result' }
                    ],
                    cpp: [
                        { title: '정렬 + 초기화', desc: '배열을 정렬하고 결과 벡터 준비', code: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;' },
                        { title: 'i 고정 + 중복 건너뛰기', desc: '같은 값의 i는 건너뜀', code: '        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;' },
                        { title: '투 포인터 탐색', desc: '합 비교 후 포인터 이동', code: '            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};' }
                    ],
                    java: [
                        { title: '정렬 + 초기화', desc: '배열을 정렬하고 결과 리스트 준비', code: 'class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();' },
                        { title: 'i 고정 + 중복 건너뛰기', desc: '같은 값의 i는 건너뜀', code: '        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;' },
                        { title: '투 포인터 탐색', desc: '합 비교 후 포인터 이동', code: '            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}' }
                    ]
                }
            }]
        },
        {
            id: 'boj-2003',
            title: 'BOJ 2003 - 수들의 합 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2003',
            simIntro: '슬라이딩 윈도우가 합을 유지하며 이동하는 과정을 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 수로 이루어진 수열에서, 연속된 수들의 부분합 중 합이 M이 되는 경우의 수를 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: N M (1&le;N&le;10,000, 1&le;M&le;300,000,000)<br>
                    둘째 줄: N개의 자연수</p></div>
                    <div><h4>출력</h4><p>합이 M이 되는 부분합의 개수</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 2\n1 1 1 1</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div></div>
            `,
            hints: [
                { title: '투 포인터/슬라이딩 윈도우', content: '<code>start</code>와 <code>end</code> 두 포인터를 둡니다. 합이 M보다 작으면 end를 늘리고, 크거나 같으면 start를 줄입니다.' },
                { title: '핵심 아이디어', content: '구간 합이 M이면 카운트 증가! 그리고 start를 한 칸 오른쪽으로 이동시켜서 다음 경우를 찾습니다.' },
                { title: '시간 복잡도', content: 'O(n). start와 end 모두 최대 n번만 이동하므로 전체 2n번 연산!' }
            ],
            inputDefault: 0,
            solve() { return '3'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M = map(int, input().split())
arr = list(map(int, input().split()))

start, end = 0, 0
current_sum = 0
count = 0

while True:
    if current_sum >= M:
        current_sum -= arr[start]
        start += 1
    elif end >= N:
        break
    else:
        current_sum += arr[end]
        end += 1

    if current_sum == M:
        count += 1

print(count)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<int> arr(N);
    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);

    int s = 0, e = 0, sum = 0, cnt = 0;
    while (true) {
        if (sum >= M) sum -= arr[s++];
        else if (e >= N) break;
        else sum += arr[e++];
        if (sum == M) cnt++;
    }
    printf("%d\\n", cnt);
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        int[] arr = new int[N];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < N; i++) arr[i] = Integer.parseInt(st.nextToken());

        int s = 0, e = 0, sum = 0, cnt = 0;
        while (true) {
            if (sum >= M) sum -= arr[s++];
            else if (e >= N) break;
            else sum += arr[e++];
            if (sum == M) cnt++;
        }
        System.out.println(cnt);
    }
}`
            },
            solutions: [{
                approach: '투 포인터',
                description: '두 포인터로 구간 합을 유지하면서 M인 경우를 찾는다',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\nstart, end = 0, 0\ncurrent_sum = 0\ncount = 0\n\nwhile True:\n    if current_sum >= M:\n        current_sum -= arr[start]\n        start += 1\n    elif end >= N:\n        break\n    else:\n        current_sum += arr[end]\n        end += 1\n\n    if current_sum == M:\n        count += 1\n\nprint(count)`,
                    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int s = 0, e = 0, sum = 0, cnt = 0;\n    while (true) {\n        if (sum >= M) sum -= arr[s++];\n        else if (e >= N) break;\n        else sum += arr[e++];\n        if (sum == M) cnt++;\n    }\n    printf("%d\\n", cnt);\n}`,
                    java: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int M = Integer.parseInt(st.nextToken());\n        int[] arr = new int[N];\n        st = new StringTokenizer(br.readLine());\n        for (int i = 0; i < N; i++) arr[i] = Integer.parseInt(st.nextToken());\n\n        int s = 0, e = 0, sum = 0, cnt = 0;\n        while (true) {\n            if (sum >= M) sum -= arr[s++];\n            else if (e >= N) break;\n            else sum += arr[e++];\n            if (sum == M) cnt++;\n        }\n        System.out.println(cnt);\n    }\n}`
                },
                codeSteps: {
                    python: [
                        { title: '입력 + 초기화', desc: 'N, M과 배열을 읽고 포인터/합/카운트 초기화', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\nstart, end = 0, 0\ncurrent_sum = 0\ncount = 0' },
                        { title: '메인 루프', desc: '합이 M 이상이면 start 이동, end가 끝이면 종료, 아니면 end 확장', code: 'while True:\n    if current_sum >= M:\n        current_sum -= arr[start]\n        start += 1\n    elif end >= N:\n        break\n    else:\n        current_sum += arr[end]\n        end += 1' },
                        { title: '합 확인', desc: '현재 구간 합이 M이면 카운트 증가', code: '    if current_sum == M:\n        count += 1' },
                        { title: '결과 출력', desc: '찾은 개수를 출력', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: '입력 + 초기화', desc: 'N, M과 배열을 읽고 변수 초기화', code: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int s = 0, e = 0, sum = 0, cnt = 0;' },
                        { title: '메인 루프 + 합 확인', desc: '구간 합을 유지하며 M인 경우 카운트', code: '    while (true) {\n        if (sum >= M) sum -= arr[s++];\n        else if (e >= N) break;\n        else sum += arr[e++];\n        if (sum == M) cnt++;\n    }' },
                        { title: '결과 출력', desc: '찾은 개수를 출력', code: '    printf("%d\\n", cnt);\n}' }
                    ],
                    java: [
                        { title: '입력 + 초기화', desc: 'N, M과 배열을 읽고 변수 초기화', code: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int M = Integer.parseInt(st.nextToken());\n        int[] arr = new int[N];\n        st = new StringTokenizer(br.readLine());\n        for (int i = 0; i < N; i++) arr[i] = Integer.parseInt(st.nextToken());\n\n        int s = 0, e = 0, sum = 0, cnt = 0;' },
                        { title: '메인 루프 + 합 확인', desc: '구간 합을 유지하며 M인 경우 카운트', code: '        while (true) {\n            if (sum >= M) sum -= arr[s++];\n            else if (e >= N) break;\n            else sum += arr[e++];\n            if (sum == M) cnt++;\n        }' },
                        { title: '결과 출력', desc: '찾은 개수를 출력', code: '        System.out.println(cnt);\n    }\n}' }
                    ]
                }
            }]
        }
    ],

    renderProblem(container) {
        container.innerHTML = '';
        const stageList = document.createElement('div');
        stageList.className = 'problem-stages';

        this.stages.forEach(stage => {
            const stageCard = document.createElement('div');
            stageCard.className = 'stage-card';
            stageCard.innerHTML = `
                <div class="stage-header">
                    <span class="stage-num">단계 ${stage.num}</span>
                    <h3>${stage.title}</h3>
                    <p>${stage.desc}</p>
                </div>
                <div class="stage-problems"></div>
            `;
            const problemsDiv = stageCard.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid);
                if (!prob) return;
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                const btn = document.createElement('button');
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `<span class="problem-title">${prob.title}</span><span class="problem-diff">${diffMap[prob.difficulty] || prob.difficulty}</span>`;
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob));
                problemsDiv.appendChild(btn);
            });
            stageList.appendChild(stageCard);
        });
        container.appendChild(stageList);
    },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        const backBtn = document.createElement('button');
        backBtn.className = 'btn'; backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLC = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}</a></div>${problem.descriptionHTML}`;
        container.appendChild(descDiv);

        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>단계별 힌트</h3>';
        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hints-steps';
        const openedState = {};

        problem.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `<div class="hint-step-header"><span class="hint-step-num">${idx + 1}</span><span class="hint-step-title">${hint.title}</span><span class="hint-step-toggle">▶</span></div><div class="hint-step-content">${hint.content}</div>`;
            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('open') ? '▼' : '▶';
                if (!openedState[idx]) { openedState[idx] = true; if (idx + 1 < problem.hints.length) { const ns = hintsDiv.children[idx + 1]; if (ns) ns.classList.remove('locked'); } }
            });
            hintsDiv.appendChild(step);
        });
        hintsSection.appendChild(hintsDiv);
        container.appendChild(hintsSection);

        const solveArea = document.createElement('div');
        solveArea.className = 'solve-area';
        solveArea.innerHTML = `
            <div class="editor-header"><h3>풀이 작성</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option><option value="java">Java</option></select></div>
            <textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea>
            <div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ 실행</button><button id="check-btn" class="btn btn-success">✓ 정답 확인</button></div>
            <div id="output-area" class="output-area"><div class="output-label">실행 결과</div><pre id="output-text"></pre></div>
        `;
        container.appendChild(solveArea);

        container.querySelectorAll('pre code').forEach(codeEl => { if (window.hljs) hljs.highlightElement(codeEl); });

        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;
        langSelect.addEventListener('change', () => { editor.value = problem.templates[langSelect.value]; });
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 4; }
        });

        const site = isLC ? 'LeetCode' : 'BOJ';
        container.querySelector('#run-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });
        container.querySelector('#check-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n💡 코드를 ${site}에 제출하여 정답을 확인하세요!`);
        });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.array = arrayTopic;
