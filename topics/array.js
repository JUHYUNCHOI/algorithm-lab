// =========================================================
// 배열 (Array) 토픽 모듈
// =========================================================
const arrayTopic = {
    id: 'array',
    title: '배열',
    icon: '📊',
    category: '기초 (Bronze~Silver)',
    order: 2,
    description: '배열을 활용한 투 포인터, 슬라이딩 윈도우, 구간 처리 기법',
    relatedNote: '이 외에도 카데인 알고리즘, 모노톤 스택, Dutch National Flag 등의 기법이 배열 문제에 활용됩니다.',

    sidebarExpandable: true,

    // 단일 통합 탭 (토픽 개요용)
    tabs: [{ id: 'concept', label: '학습하기' }],

    // 문제-유형 매핑
    problemMeta: {
        'boj-10818': { type: '최솟값/최댓값', color: '#00b894', vizMethod: '_renderVizMinMax' },
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

        const diffMap = { bronze: 'Bronze', gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

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
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';
        container.appendChild(contentDiv);

        switch (tabId) {
            case 'problem': self._renderProblemTab(contentDiv, prob); break;
            case 'think':   self._renderThinkTab(contentDiv, prob); break;
            case 'sim':     if (meta.vizMethod) self[meta.vizMethod](contentDiv); break;
            case 'code':    self._renderCodeTab(contentDiv, prob); break;
        }

        // 다음 탭 이동 버튼
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

            // viz가 있으면 컨테이너 미리 추가
            if (hint.viz) {
                var vizArea = document.createElement('div');
                vizArea.className = 'hint-viz-area';
                step.querySelector('.hint-step-body').appendChild(vizArea);
            }

            step.querySelector('.hint-step-header').addEventListener('click', function() {
                if (step.classList.contains('locked')) return;
                var wasOpened = step.classList.contains('opened');
                step.classList.toggle('opened');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('opened') ? '▴' : '▾';
                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < prob.hints.length) {
                        var nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
                // viz 생명주기 관리
                if (hint.viz) {
                    var va = step.querySelector('.hint-viz-area');
                    if (!wasOpened) {
                        // 열림 → viz 시작 (이전 것 정리 후)
                        if (step._vizCtrl) { step._vizCtrl.destroy(); }
                        va.innerHTML = '';
                        step._vizCtrl = hint.viz(va);
                    } else {
                        // 닫힘 → viz 정지
                        if (step._vizCtrl) { step._vizCtrl.stop(); }
                    }
                }
            });
            hintsDiv.appendChild(step);
        });
        contentEl.appendChild(hintsDiv);

        // 코드 블록에 hljs 하이라이팅 + 라인별 애니메이션 적용
        if (window.hljs) {
            hintsDiv.querySelectorAll('pre code').forEach(function(codeEl) {
                hljs.highlightElement(codeEl);
                var lines = codeEl.innerHTML.split('\n');
                codeEl.innerHTML = lines.map(function(line, i) {
                    return '<div class="code-line" style="--i:' + i + '">' + (line || '&nbsp;') + '</div>';
                }).join('');
            });
        }
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
            '<option value="python">Python</option><option value="cpp">C++</option></select>' +
            '<a href="' + prob.link + '" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>' +
            '<div class="code-block"><pre><code class="language-python"></code></pre></div>';
        var codeEl = wrapper.querySelector('code');
        codeEl.textContent = prob.templates.python;
        if (window.hljs) hljs.highlightElement(codeEl);
        wrapper.querySelector('.str-lang-select').addEventListener('change', function() {
            var lang = this.value;
            var langMap = { python: 'language-python', cpp: 'language-cpp' };
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
                    배열은 번호가 적힌 사물함이에요! 0번, 1번, 2번... 순서대로 줄지어 있죠.
                    3번 사물함을 열고 싶으면? 3번으로 바로 가면 돼요! 앞에서부터 세지 않아도 됩니다.
                    다만 중간에 새 사물함을 끼워넣으려면, 뒤에 있는 사물함을 전부 한 칸씩 밀어야 해서 좀 귀찮아요.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 인덱스로 O(1) 접근 vs 값 검색 O(n)</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-index-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">인덱스:
                                <input type="number" id="arr-demo-index-input" min="0" max="7" value="0" style="width:56px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                            </label>
                            <button class="concept-demo-btn" id="arr-demo-index-go">⚡ 번호로 바로 찾기</button>
                            <button class="concept-demo-btn" id="arr-demo-index-search" style="background:var(--yellow);color:#333;">🔍 하나씩 찾아보기</button>
                        </div>
                        <div id="arr-demo-search-controls" style="display:none;gap:12px;justify-content:center;align-items:center;margin-top:4px;">
                            <button id="arr-demo-search-prev" class="concept-demo-btn">← 이전</button>
                            <span id="arr-demo-search-counter" style="font-size:0.85rem;color:var(--text2);">시작 전</span>
                            <button id="arr-demo-search-next" class="concept-demo-btn">다음 →</button>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-index-msg">👆 인덱스를 입력하고 버튼을 눌러보세요! "바로 접근"과 "값 검색"의 차이를 느껴보세요.</div>
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.3"/><rect x="14" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.6"/><rect x="26" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.9"/></svg>
                        </div>
                        <h3>인덱스 접근 O(1)</h3>
                        <p><code>arr[3]</code>하면 3번 칸을 바로 열 수 있어요. 번호만 알면 한 번에 찾으니까 엄청 빨라요!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">O(n)</text></svg>
                        </div>
                        <h3>순회</h3>
                        <p>배열에 있는 걸 전부 한 번씩 확인하는 거예요. 10개가 있으면 10번 봐야 하죠. 배열 문제의 기본이에요!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="12" font-weight="bold" fill="var(--yellow)">insert</text></svg>
                        </div>
                        <h3>삽입/삭제 O(n)</h3>
                        <p>중간에 끼워넣으려면 뒤에 있는 것들을 전부 한 칸씩 밀어야 해요. 맨 끝에 넣는 건 밀 필요 없으니 빨라요!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">sorted</text></svg>
                        </div>
                        <h3>정렬된 배열</h3>
                        <p>크기순으로 줄 세워져 있으면 반씩 쪼개가며 찾을 수 있어요. 100만 개도 20번이면 찾아요! 양쪽 끝에서 동시에 좁혀오는 방법도 쓸 수 있고요.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
using namespace std;

int main() {
    vector&lt;int&gt; arr = {3, 1, 4, 1, 5, 9, 2, 6};

    cout &lt;&lt; arr[0] &lt;&lt; endl;       // 3 — 첫 원소
    cout &lt;&lt; arr.back() &lt;&lt; endl;   // 6 — 마지막 원소
    cout &lt;&lt; arr.size() &lt;&lt; endl;   // 8 — 길이

    arr.push_back(7);              // 끝에 추가: O(1)
    sort(arr.begin(), arr.end());  // 정렬: O(n log n)

    // 짝수만 골라내기
    vector&lt;int&gt; evens;
    for (int x : arr) {
        if (x % 2 == 0) evens.push_back(x);
    }
    // evens = {2, 4, 6}
}</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#list" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: list ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/vector" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: vector ↗</a></span>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 삽입/삭제 비용 체감</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-insert-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;min-height:60px;align-items:flex-end;"></div>
                        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <button class="concept-demo-btn" id="arr-demo-insert-mid">📥 중간에 삽입 (O(n))</button>
                            <button class="concept-demo-btn green" id="arr-demo-insert-end">📥 끝에 추가 (O(1))</button>
                            <button class="concept-demo-btn danger" id="arr-demo-insert-reset">🔄 초기화</button>
                        </div>
                        <div id="arr-demo-insert-controls" style="display:none;gap:12px;justify-content:center;align-items:center;margin-top:4px;">
                            <button id="arr-demo-insert-prev" class="concept-demo-btn">← 이전</button>
                            <span id="arr-demo-insert-counter" style="font-size:0.85rem;color:var(--text2);">시작 전</span>
                            <button id="arr-demo-insert-next" class="concept-demo-btn">다음 →</button>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-insert-msg">👆 "중간에 삽입"을 눌러보세요. 뒤의 원소들이 하나씩 밀리는 과정을 확인할 수 있습니다!</div>
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
                    양쪽 끝에서 두 사람이 동시에 걸어오면서 찾는다고 생각해 보세요!
                    두 수를 더했는데 너무 크면? 오른쪽 사람이 한 걸음 왼쪽으로. 너무 작으면? 왼쪽 사람이 한 걸음 오른쪽으로.
                    이렇게 하면 모든 짝을 일일이 확인하지 않아도 돼요. 100개면 100번이면 충분해요!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 투 포인터로 합 찾기</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">목표 합:
                                <input type="number" id="arr-demo-tp-target" value="10" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                            </label>
                            <button class="concept-demo-btn" id="arr-demo-tp-step">▶ 다음 스텝</button>
                            <button class="concept-demo-btn danger" id="arr-demo-tp-reset">🔄 초기화</button>
                        </div>
                        <div id="arr-demo-tp-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div id="arr-demo-tp-pointers" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;font-size:0.75rem;font-weight:700;min-height:20px;"></div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-tp-msg">👆 "다음 스텝" 버튼을 눌러 L, R 포인터가 어떻게 이동하는지 확인해보세요!</div>
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">L→</text></svg>
                        </div>
                        <h3>왼쪽에서 시작</h3>
                        <p>한 사람은 맨 왼쪽에서 출발해요. <code>left = 0</code>부터 오른쪽으로 한 칸씩 이동해요.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">←R</text></svg>
                        </div>
                        <h3>오른쪽에서 시작</h3>
                        <p>다른 사람은 맨 오른쪽에서 출발해요. <code>right = n-1</code>부터 왼쪽으로 이동하죠.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="22" font-size="18" font-weight="bold" fill="var(--yellow)">↔</text></svg>
                        </div>
                        <h3>조건에 따라 이동</h3>
                        <p>합이 너무 크면 큰 쪽을 줄이고, 너무 작으면 작은 쪽을 키워요. 딱 맞으면 찾은 거예요!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;iostream&gt;
using namespace std;

// 투 포인터: 정렬된 배열에서 합이 target인 두 수 찾기
vector&lt;int&gt; two_sum_sorted(vector&lt;int&gt;&amp; arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left &lt; right) {
        int s = arr[left] + arr[right];
        if (s == target)
            return {left, right};
        else if (s &lt; target)
            left++;        // 합이 작으니 왼쪽을 키움
        else
            right--;       // 합이 크니 오른쪽을 줄임
    }
    return {-1, -1};       // 못 찾음
}

int main() {
    vector&lt;int&gt; arr = {1, 2, 4, 6, 8, 10};
    auto res = two_sum_sorted(arr, 10);
    cout &lt;&lt; res[0] &lt;&lt; ", " &lt;&lt; res[1] &lt;&lt; endl;  // 1, 4 → 2+8=10
}</code></pre>
                </div></span>
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
                    <span class="section-num">3</span> 슬라이딩 윈도우(구간을 밀면서 확인하기)
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> <em>"창문을 옆으로 밀면서 바깥 풍경 보기"</em>입니다!
                    크기가 고정된 창문(윈도우)을 배열 위에서 한 칸씩 밀면서,
                    창문 안에 보이는 원소들의 합/최대/최소를 계속 추적합니다.
                    매번 처음부터 다시 세지 않고, 빠진 것은 빼고 들어온 것은 더합니다!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 슬라이딩 윈도우로 최대 합 찾기</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;margin-bottom:8px;">
                        <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">윈도우 크기 K:
                            <input type="number" id="arr-demo-sw-k" min="2" max="5" value="3" style="width:56px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                        </label>
                        <button class="concept-demo-btn" id="arr-demo-sw-step">▶ 다음 스텝</button>
                        <button class="concept-demo-btn danger" id="arr-demo-sw-reset">🔄 초기화</button>
                    </div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-sw-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <span style="font-size:0.9rem;font-weight:600;">현재 합: <span id="arr-demo-sw-sum" style="color:var(--accent);font-size:1.1rem;">—</span></span>
                            <span style="font-size:0.9rem;font-weight:600;">최대 합: <span id="arr-demo-sw-max" style="color:var(--green);font-size:1.1rem;">—</span></span>
                        </div>
                        <div id="arr-demo-sw-calc" style="font-size:0.85rem;color:var(--text2);min-height:20px;text-align:center;"></div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-sw-msg">👆 "다음 스텝"을 눌러 윈도우가 한 칸씩 밀리면서 합이 갱신되는 과정을 확인해보세요!</div>
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
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;iostream&gt;
using namespace std;

// 슬라이딩 윈도우: 크기 K인 부분 배열의 최대 합
int max_subarray_sum(vector&lt;int&gt;&amp; arr, int k) {
    // 처음 윈도우의 합
    int window_sum = 0;
    for (int i = 0; i &lt; k; i++)
        window_sum += arr[i];
    int max_sum = window_sum;

    // 한 칸씩 밀기: 새로 들어온 건 더하고, 나간 건 빼기
    for (int i = k; i &lt; (int)arr.size(); i++) {
        window_sum += arr[i] - arr[i - k];
        max_sum = max(max_sum, window_sum);
    }
    return max_sum;
}

int main() {
    vector&lt;int&gt; arr = {2, 1, 5, 1, 3, 2};
    cout &lt;&lt; max_subarray_sum(arr, 3) &lt;&lt; endl;  // 9 (= 5+1+3)
}</code></pre>
                </div></span>
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 주식 최대 이익 (최솟값 추적)</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;margin-bottom:8px;">
                        <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">가격 배열:
                            <input type="text" id="arr-demo-stock-input" value="7,1,5,3,6,4" style="width:180px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                        </label>
                        <button class="concept-demo-btn" id="arr-demo-stock-step">▶ 다음 스텝</button>
                        <button class="concept-demo-btn danger" id="arr-demo-stock-reset">🔄 초기화</button>
                    </div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-stock-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <span style="font-size:0.9rem;font-weight:600;">최저가: <span id="arr-demo-stock-min" style="color:var(--accent);font-size:1.1rem;">—</span></span>
                            <span style="font-size:0.9rem;font-weight:600;">현재 이익: <span id="arr-demo-stock-cur" style="color:var(--yellow);font-size:1.1rem;">—</span></span>
                            <span style="font-size:0.9rem;font-weight:600;">최대 이익: <span id="arr-demo-stock-profit" style="color:var(--green);font-size:1.1rem;">—</span></span>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-stock-msg">👆 "다음 스텝"을 눌러 배열을 순회하면서 최저가를 추적하고 최대 이익을 갱신하는 과정을 확인해보세요!</div>
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
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;climits&gt;
#include &lt;iostream&gt;
using namespace std;

// 예시: 주식 최대 이익 (한 번 순회, 최솟값 추적)
int max_profit(vector&lt;int&gt;&amp; prices) {
    int min_price = INT_MAX;
    int profit = 0;
    for (int price : prices) {
        min_price = min(min_price, price);        // 지금까지 최저가
        profit = max(profit, price - min_price);   // 지금 팔면?
    }
    return profit;
}

int main() {
    vector&lt;int&gt; prices = {7, 1, 5, 3, 6, 4};
    cout &lt;&lt; max_profit(prices) &lt;&lt; endl;  // 5 (1에 사서 6에 판다)
}</code></pre>
                </div></span>
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
                box.classList.add('revealed');
                btn.style.display = 'none';
            });
        });

        // --- helper: 배열 박스 생성 ---
        var _mkBox = function(val, idx) {
            var d = document.createElement('div');
            d.className = 'str-char-box';
            d.innerHTML = '<span class="str-char-idx">' + idx + '</span><span class="str-char-val">' + val + '</span>';
            return d;
        };

        // --- 1. 인덱스 O(1) 접근 데모 ---
        {
            var idxArr = [10, 25, 8, 42, 17, 33, 5, 61];
            var boxesEl = container.querySelector('#arr-demo-index-boxes');
            var inputEl = container.querySelector('#arr-demo-index-input');
            var goBtn = container.querySelector('#arr-demo-index-go');
            var searchBtn = container.querySelector('#arr-demo-index-search');
            var msgEl = container.querySelector('#arr-demo-index-msg');
            var animating = false;

            var renderBoxes = function() {
                boxesEl.innerHTML = '';
                for (var i = 0; i < idxArr.length; i++) {
                    boxesEl.appendChild(_mkBox(idxArr[i], i));
                }
            };
            renderBoxes();

            var clearHighlights = function() {
                boxesEl.querySelectorAll('.str-char-box').forEach(function(b) {
                    b.classList.remove('comparing', 'matched');
                    b.style.borderColor = '';
                    b.style.background = '';
                    b.style.transform = '';
                    b.style.boxShadow = '';
                });
            };

            goBtn.addEventListener('click', function() {
                if (animating) return;
                clearHighlights();
                var idx = parseInt(inputEl.value);
                if (isNaN(idx) || idx < 0 || idx >= idxArr.length) {
                    msgEl.textContent = '인덱스는 0~' + (idxArr.length - 1) + ' 사이로 입력하세요!';
                    return;
                }
                var boxes = boxesEl.querySelectorAll('.str-char-box');
                boxes[idx].classList.add('matched');
                msgEl.textContent = 'arr[' + idx + '] = ' + idxArr[idx] + ' → 바로 접근! 비교 0번, O(1)입니다. 인덱스만 알면 즉시 찾습니다.';
            });

            // --- Linear search: manual step controls ---
            var searchControlsEl = container.querySelector('#arr-demo-search-controls');
            var searchPrevBtn = container.querySelector('#arr-demo-search-prev');
            var searchNextBtn = container.querySelector('#arr-demo-search-next');
            var searchCounterEl = container.querySelector('#arr-demo-search-counter');
            var searchSteps = [];
            var searchStep = -1;
            var searchActive = false;

            var buildSearchSteps = function(targetIdx) {
                var targetVal = idxArr[targetIdx];
                var steps = [];
                for (var i = 0; i <= targetIdx; i++) {
                    (function(si) {
                        if (si < targetIdx) {
                            steps.push({
                                desc: 'arr[' + si + '] = ' + idxArr[si] + ' → ' + targetVal + '이(가) 아닙니다. 다음!',
                                action: function() {
                                    var boxes = boxesEl.querySelectorAll('.str-char-box');
                                    boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                                    for (var j = 0; j < si; j++) { boxes[j].style.opacity = '0.5'; }
                                    boxes[si].style.opacity = '';
                                    boxes[si].classList.add('comparing');
                                    for (var j = si + 1; j < boxes.length; j++) { boxes[j].style.opacity = ''; }
                                }
                            });
                        } else {
                            steps.push({
                                desc: '값 ' + targetVal + ' 발견! ' + (si + 1) + '번 비교했습니다. O(n) — 최악의 경우 ' + idxArr.length + '번 비교해야 합니다!',
                                action: function() {
                                    var boxes = boxesEl.querySelectorAll('.str-char-box');
                                    boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                                    for (var j = 0; j < si; j++) { boxes[j].style.opacity = '0.5'; }
                                    boxes[si].style.opacity = '';
                                    boxes[si].classList.add('matched');
                                    for (var j = si + 1; j < boxes.length; j++) { boxes[j].style.opacity = ''; }
                                }
                            });
                        }
                    })(i);
                }
                return steps;
            };

            var updateSearchUI = function() {
                if (searchStep < 0) {
                    searchCounterEl.textContent = '시작 전';
                    searchPrevBtn.disabled = true;
                    searchNextBtn.disabled = false;
                } else if (searchStep >= searchSteps.length - 1) {
                    searchCounterEl.textContent = (searchStep + 1) + ' / ' + searchSteps.length;
                    searchPrevBtn.disabled = false;
                    searchNextBtn.disabled = true;
                } else {
                    searchCounterEl.textContent = (searchStep + 1) + ' / ' + searchSteps.length;
                    searchPrevBtn.disabled = false;
                    searchNextBtn.disabled = false;
                }
                if (searchStep >= 0 && searchStep < searchSteps.length) {
                    msgEl.textContent = searchSteps[searchStep].desc;
                    searchSteps[searchStep].action();
                } else {
                    clearHighlights();
                    boxesEl.querySelectorAll('.str-char-box').forEach(function(b) { b.style.opacity = ''; });
                }
            };

            var resetSearch = function() {
                searchActive = false;
                searchStep = -1;
                searchSteps = [];
                searchControlsEl.style.display = 'none';
                goBtn.disabled = false;
                searchBtn.disabled = false;
                searchBtn.textContent = '🔍 하나씩 찾아보기';
                inputEl.disabled = false;
                clearHighlights();
                boxesEl.querySelectorAll('.str-char-box').forEach(function(b) { b.style.opacity = ''; });
                msgEl.textContent = '👆 인덱스를 입력하고 버튼을 눌러보세요! "바로 접근"과 "값 검색"의 차이를 느껴보세요.';
            };

            searchBtn.addEventListener('click', function() {
                if (searchActive) {
                    resetSearch();
                    return;
                }
                clearHighlights();
                var idx = parseInt(inputEl.value);
                if (isNaN(idx) || idx < 0 || idx >= idxArr.length) {
                    msgEl.textContent = '인덱스는 0~' + (idxArr.length - 1) + ' 사이로 입력하세요!';
                    return;
                }
                searchSteps = buildSearchSteps(idx);
                searchStep = -1;
                searchActive = true;
                goBtn.disabled = true;
                inputEl.disabled = true;
                searchBtn.textContent = '🔄 검색 초기화';
                searchControlsEl.style.display = 'flex';
                msgEl.textContent = '값 ' + idxArr[idx] + '을(를) 찾기 위해 앞에서부터 하나씩 확인합니다. "다음 →"을 눌러보세요!';
                updateSearchUI();
            });

            searchNextBtn.addEventListener('click', function() {
                if (searchStep < searchSteps.length - 1) {
                    searchStep++;
                    updateSearchUI();
                }
            });

            searchPrevBtn.addEventListener('click', function() {
                if (searchStep > -1) {
                    searchStep--;
                    updateSearchUI();
                    if (searchStep < 0) {
                        msgEl.textContent = '값을 찾기 위해 앞에서부터 하나씩 확인합니다. "다음 →"을 눌러보세요!';
                    }
                }
            });
        }

        // --- 2. 삽입/삭제 비용 데모 ---
        {
            var insertArr = [3, 7, 1, 9, 4, 6];
            var insertBoxesEl = container.querySelector('#arr-demo-insert-boxes');
            var insertMidBtn = container.querySelector('#arr-demo-insert-mid');
            var insertEndBtn = container.querySelector('#arr-demo-insert-end');
            var insertResetBtn = container.querySelector('#arr-demo-insert-reset');
            var insertMsgEl = container.querySelector('#arr-demo-insert-msg');
            var insertControlsEl = container.querySelector('#arr-demo-insert-controls');
            var insertPrevBtn = container.querySelector('#arr-demo-insert-prev');
            var insertNextBtn = container.querySelector('#arr-demo-insert-next');
            var insertCounterEl = container.querySelector('#arr-demo-insert-counter');
            var insertCount = 0;
            var insertSteps = [];
            var insertStep = -1;
            var insertActive = false;

            var renderInsertBoxes = function() {
                insertBoxesEl.innerHTML = '';
                for (var i = 0; i < insertArr.length; i++) {
                    insertBoxesEl.appendChild(_mkBox(insertArr[i], i));
                }
            };
            renderInsertBoxes();

            var buildInsertSteps = function(arr, midIdx, newVal) {
                var steps = [];
                var arrCopy = arr.slice();
                // Step for each element shifting (from right to left)
                for (var si = arrCopy.length - 1; si >= midIdx; si--) {
                    (function(shiftI, totalShifts) {
                        steps.push({
                            desc: 'arr[' + shiftI + '] = ' + arrCopy[shiftI] + '을(를) 한 칸 오른쪽으로 밀고 있습니다... (' + (arrCopy.length - shiftI) + '/' + totalShifts + ')',
                            action: function() {
                                var boxes = insertBoxesEl.querySelectorAll('.str-char-box');
                                boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                                if (boxes[shiftI]) {
                                    boxes[shiftI].classList.add('comparing');
                                }
                            }
                        });
                    })(si, arrCopy.length - midIdx);
                }
                // Final step: insert the element
                steps.push({
                    desc: newVal + '을(를) 인덱스 ' + midIdx + '에 삽입 완료! ' + (arrCopy.length - midIdx) + '개 원소를 밀었습니다 → O(n)',
                    action: function() {
                        insertArr.splice(midIdx, 0, newVal);
                        renderInsertBoxes();
                        var newBoxes = insertBoxesEl.querySelectorAll('.str-char-box');
                        newBoxes[midIdx].classList.add('matched');
                    },
                    isFinal: true
                });
                return steps;
            };

            var updateInsertUI = function() {
                if (insertStep < 0) {
                    insertCounterEl.textContent = '시작 전';
                    insertPrevBtn.disabled = true;
                    insertNextBtn.disabled = false;
                } else if (insertStep >= insertSteps.length - 1) {
                    insertCounterEl.textContent = (insertStep + 1) + ' / ' + insertSteps.length;
                    insertPrevBtn.disabled = false;
                    insertNextBtn.disabled = true;
                } else {
                    insertCounterEl.textContent = (insertStep + 1) + ' / ' + insertSteps.length;
                    insertPrevBtn.disabled = false;
                    insertNextBtn.disabled = false;
                }
                if (insertStep >= 0 && insertStep < insertSteps.length) {
                    insertMsgEl.textContent = insertSteps[insertStep].desc;
                    insertSteps[insertStep].action();
                }
            };

            var resetInsertDemo = function() {
                insertActive = false;
                insertStep = -1;
                insertSteps = [];
                insertControlsEl.style.display = 'none';
                insertMidBtn.disabled = insertArr.length >= 10;
                insertEndBtn.disabled = insertArr.length >= 10;
                insertMidBtn.textContent = '📥 중간에 삽입 (O(n))';
                var boxes = insertBoxesEl.querySelectorAll('.str-char-box');
                boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                insertMsgEl.textContent = '👆 "중간에 삽입"을 눌러보세요. 뒤의 원소들이 하나씩 밀리는 과정을 확인할 수 있습니다!';
            };

            insertMidBtn.addEventListener('click', function() {
                if (insertArr.length >= 10) return;
                if (insertActive) {
                    // Reset without completing - revert array if final step not reached
                    resetInsertDemo();
                    return;
                }
                var midIdx = Math.floor(insertArr.length / 2);
                var newVal = [0, 8, 2, 5, 11, 15][insertCount % 6];
                insertSteps = buildInsertSteps(insertArr, midIdx, newVal);
                insertStep = -1;
                insertActive = true;
                insertEndBtn.disabled = true;
                insertMidBtn.textContent = '🔄 삽입 초기화';
                insertControlsEl.style.display = 'flex';
                insertMsgEl.textContent = '인덱스 ' + midIdx + '에 ' + newVal + '을(를) 삽입합니다. 먼저 뒤의 원소들을 밀어야 합니다! "다음 →"을 눌러보세요.';
                updateInsertUI();
            });

            insertNextBtn.addEventListener('click', function() {
                if (insertStep < insertSteps.length - 1) {
                    insertStep++;
                    updateInsertUI();
                    // If final step reached, finish the insertion
                    if (insertSteps[insertStep] && insertSteps[insertStep].isFinal) {
                        insertCount++;
                        // Auto-finish after a moment
                        setTimeout(function() {
                            insertActive = false;
                            insertSteps = [];
                            insertStep = -1;
                            insertControlsEl.style.display = 'none';
                            insertMidBtn.textContent = '📥 중간에 삽입 (O(n))';
                            insertMidBtn.disabled = insertArr.length >= 10;
                            insertEndBtn.disabled = insertArr.length >= 10;
                        }, 1200);
                    }
                }
            });

            insertPrevBtn.addEventListener('click', function() {
                if (insertStep > -1) {
                    // If we were on the final step, undo the splice
                    if (insertSteps[insertStep] && insertSteps[insertStep].isFinal) {
                        var midIdx = Math.floor((insertArr.length - 1) / 2);
                        insertArr.splice(midIdx, 1);
                        renderInsertBoxes();
                        insertCount--;
                    }
                    insertStep--;
                    if (insertStep >= 0) {
                        updateInsertUI();
                    } else {
                        insertCounterEl.textContent = '시작 전';
                        insertPrevBtn.disabled = true;
                        insertNextBtn.disabled = false;
                        var boxes = insertBoxesEl.querySelectorAll('.str-char-box');
                        boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                        insertMsgEl.textContent = '인덱스에 값을 삽입합니다. "다음 →"을 눌러보세요.';
                    }
                }
            });

            insertEndBtn.addEventListener('click', function() {
                if (insertActive || insertArr.length >= 10) return;
                var newVal = [0, 8, 2, 5, 11, 15][insertCount % 6];
                insertArr.push(newVal);
                renderInsertBoxes();
                var newBoxes = insertBoxesEl.querySelectorAll('.str-char-box');
                newBoxes[newBoxes.length - 1].classList.add('matched');
                insertMsgEl.textContent = newVal + '을(를) 끝에 추가! 아무것도 밀 필요 없음 → O(1). 뒤에 그냥 붙이면 됩니다!';
                insertMidBtn.disabled = insertArr.length >= 10;
                insertEndBtn.disabled = insertArr.length >= 10;
                insertCount++;
            });

            insertResetBtn.addEventListener('click', function() {
                if (insertActive) {
                    resetInsertDemo();
                }
                insertArr = [3, 7, 1, 9, 4, 6];
                insertCount = 0;
                renderInsertBoxes();
                resetInsertDemo();
            });
        }

        // --- 3. 투 포인터 데모 ---
        {
            var tpArr = [1, 2, 4, 6, 8, 10, 13, 15];
            var tpBoxesEl = container.querySelector('#arr-demo-tp-boxes');
            var tpPointersEl = container.querySelector('#arr-demo-tp-pointers');
            var tpStepBtn = container.querySelector('#arr-demo-tp-step');
            var tpResetBtn = container.querySelector('#arr-demo-tp-reset');
            var tpTargetEl = container.querySelector('#arr-demo-tp-target');
            var tpMsgEl = container.querySelector('#arr-demo-tp-msg');
            var tpL, tpR, tpDone;

            var renderTpBoxes = function() {
                tpBoxesEl.innerHTML = '';
                tpPointersEl.innerHTML = '';
                for (var i = 0; i < tpArr.length; i++) {
                    tpBoxesEl.appendChild(_mkBox(tpArr[i], i));
                    var ptr = document.createElement('span');
                    ptr.style.cssText = 'display:inline-block;width:44px;text-align:center;';
                    ptr.id = 'arr-demo-tp-ptr-' + i;
                    tpPointersEl.appendChild(ptr);
                }
            };

            var updateTpPointers = function() {
                for (var i = 0; i < tpArr.length; i++) {
                    var ptr = container.querySelector('#arr-demo-tp-ptr-' + i);
                    if (ptr) {
                        var labels = [];
                        if (i === tpL) labels.push('L');
                        if (i === tpR) labels.push('R');
                        ptr.textContent = labels.join(' ');
                        ptr.style.color = i === tpL ? 'var(--green)' : i === tpR ? 'var(--accent)' : '';
                    }
                }
                var boxes = tpBoxesEl.querySelectorAll('.str-char-box');
                boxes.forEach(function(b, idx) {
                    b.classList.remove('comparing', 'matched');
                    b.style.borderColor = '';
                    b.style.boxShadow = '';
                    if (idx === tpL) {
                        b.style.borderColor = 'var(--green)';
                        b.style.boxShadow = '0 0 8px rgba(0,184,148,0.4)';
                    }
                    if (idx === tpR) {
                        b.style.borderColor = 'var(--accent)';
                        b.style.boxShadow = '0 0 8px rgba(108,92,231,0.4)';
                    }
                });
            };

            var tpInit = function() {
                tpL = 0;
                tpR = tpArr.length - 1;
                tpDone = false;
                renderTpBoxes();
                updateTpPointers();
                tpStepBtn.disabled = false;
                tpMsgEl.textContent = '👆 "다음 스텝" 버튼을 눌러 L, R 포인터가 어떻게 이동하는지 확인해보세요!';
            };
            tpInit();

            tpStepBtn.addEventListener('click', function() {
                if (tpDone || tpL >= tpR) {
                    tpMsgEl.textContent = '탐색이 끝났습니다! 🔄 초기화를 눌러 다시 시도해보세요.';
                    tpStepBtn.disabled = true;
                    return;
                }
                var target = parseInt(tpTargetEl.value) || 10;
                var sum = tpArr[tpL] + tpArr[tpR];
                var boxes = tpBoxesEl.querySelectorAll('.str-char-box');

                if (sum === target) {
                    boxes[tpL].classList.add('matched');
                    boxes[tpR].classList.add('matched');
                    tpMsgEl.textContent = 'arr[' + tpL + '] + arr[' + tpR + '] = ' + tpArr[tpL] + ' + ' + tpArr[tpR] + ' = ' + sum + ' ✓ 정답을 찾았습니다!';
                    tpDone = true;
                    tpStepBtn.disabled = true;
                } else if (sum < target) {
                    boxes[tpL].classList.add('comparing');
                    boxes[tpR].classList.add('comparing');
                    tpMsgEl.textContent = 'arr[' + tpL + '] + arr[' + tpR + '] = ' + tpArr[tpL] + ' + ' + tpArr[tpR] + ' = ' + sum + ' < ' + target + ' → 합이 작으니 L을 오른쪽으로!';
                    setTimeout(function() {
                        tpL++;
                        updateTpPointers();
                    }, 500);
                } else {
                    boxes[tpL].classList.add('comparing');
                    boxes[tpR].classList.add('comparing');
                    tpMsgEl.textContent = 'arr[' + tpL + '] + arr[' + tpR + '] = ' + tpArr[tpL] + ' + ' + tpArr[tpR] + ' = ' + sum + ' > ' + target + ' → 합이 크니 R을 왼쪽으로!';
                    setTimeout(function() {
                        tpR--;
                        updateTpPointers();
                    }, 500);
                }
            });

            tpResetBtn.addEventListener('click', function() {
                tpInit();
            });
        }

        // --- 4. 슬라이딩 윈도우 데모 ---
        {
            var swArr = [2, 1, 5, 1, 3, 2];
            var swBoxesEl = container.querySelector('#arr-demo-sw-boxes');
            var swStepBtn = container.querySelector('#arr-demo-sw-step');
            var swResetBtn = container.querySelector('#arr-demo-sw-reset');
            var swKInput = container.querySelector('#arr-demo-sw-k');
            var swSumEl = container.querySelector('#arr-demo-sw-sum');
            var swMaxEl = container.querySelector('#arr-demo-sw-max');
            var swCalcEl = container.querySelector('#arr-demo-sw-calc');
            var swMsgEl = container.querySelector('#arr-demo-sw-msg');
            var swPos = -1, swSum = 0, swMaxSum = 0, swK = 3;
            var swBoxes = [];

            function swInit() {
                swK = parseInt(swKInput.value) || 3;
                if (swK < 2) swK = 2;
                if (swK > swArr.length) swK = swArr.length;
                swPos = -1; swSum = 0; swMaxSum = 0;
                swBoxesEl.innerHTML = '';
                swBoxes = [];
                for (var i = 0; i < swArr.length; i++) {
                    var b = _mkBox(swArr[i], i);
                    swBoxesEl.appendChild(b);
                    swBoxes.push(b);
                }
                swSumEl.textContent = '—';
                swMaxEl.textContent = '—';
                swCalcEl.textContent = '';
                swMsgEl.textContent = '👆 "다음 스텝"을 눌러 윈도우가 한 칸씩 밀리면서 합이 갱신되는 과정을 확인해보세요!';
            }
            swInit();

            swStepBtn.addEventListener('click', function() {
                swPos++;
                // 초기 윈도우 구성 (pos 0)
                if (swPos === 0) {
                    swSum = 0;
                    for (var i = 0; i < swK; i++) swSum += swArr[i];
                    swMaxSum = swSum;
                    swBoxes.forEach(function(b) { b.className = 'str-char-box'; });
                    for (var i = 0; i < swK; i++) swBoxes[i].classList.add('comparing');
                    swSumEl.textContent = swSum;
                    swMaxEl.textContent = swMaxSum;
                    var parts = swArr.slice(0, swK).join(' + ');
                    swCalcEl.textContent = '초기 윈도우: ' + parts + ' = ' + swSum;
                    swMsgEl.textContent = '크기 ' + swK + ' 윈도우의 초기 합 = ' + swSum + '. 이제 한 칸씩 밀어봅시다!';
                    return;
                }
                // 윈도우 슬라이드
                var slideIdx = swPos - 1 + swK; // 새로 들어오는 인덱스
                if (slideIdx >= swArr.length) {
                    swMsgEl.textContent = '완료! 최대 합은 ' + swMaxSum + '입니다 🎉';
                    swBoxes.forEach(function(b) { b.classList.remove('comparing'); b.classList.add('matched'); });
                    swCalcEl.textContent = '';
                    return;
                }
                var outIdx = swPos - 1; // 빠지는 인덱스
                var outVal = swArr[outIdx];
                var inVal = swArr[slideIdx];
                swSum = swSum - outVal + inVal;
                var oldMax = swMaxSum;
                swMaxSum = Math.max(swMaxSum, swSum);
                // 하이라이트 업데이트
                swBoxes.forEach(function(b) { b.className = 'str-char-box'; });
                swBoxes[outIdx].style.opacity = '0.4';
                for (var i = swPos; i <= slideIdx; i++) swBoxes[i].classList.add('comparing');
                swSumEl.textContent = swSum;
                swMaxEl.textContent = swMaxSum;
                swCalcEl.innerHTML = '이전 합 <b>' + (swSum + outVal - inVal) + '</b> − 빠진 <b>' + outVal + '</b> + 들어온 <b>' + inVal + '</b> = <b>' + swSum + '</b>';
                var isNew = swMaxSum > oldMax;
                swMsgEl.textContent = '윈도우 [' + swPos + '~' + slideIdx + '] 합 = ' + swSum + (isNew ? ' → 최대 합 갱신!' : ' (최대 합 ' + swMaxSum + ' 유지)');
            });

            swResetBtn.addEventListener('click', swInit);
        }

        // --- 5. 주식 최대 이익 데모 ---
        {
            var stockArr = [7, 1, 5, 3, 6, 4];
            var stockBoxesEl = container.querySelector('#arr-demo-stock-boxes');
            var stockStepBtn = container.querySelector('#arr-demo-stock-step');
            var stockResetBtn = container.querySelector('#arr-demo-stock-reset');
            var stockInputEl = container.querySelector('#arr-demo-stock-input');
            var stockMinEl = container.querySelector('#arr-demo-stock-min');
            var stockCurEl = container.querySelector('#arr-demo-stock-cur');
            var stockProfitEl = container.querySelector('#arr-demo-stock-profit');
            var stockMsgEl = container.querySelector('#arr-demo-stock-msg');
            var stockPos = -1, stockMin = Infinity, stockProfit = 0;
            var stockBoxes = [];

            function stockInit() {
                var raw = stockInputEl.value.split(',').map(function(v) { return parseInt(v.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length >= 2) stockArr = raw;
                stockPos = -1; stockMin = Infinity; stockProfit = 0;
                stockBoxesEl.innerHTML = '';
                stockBoxes = [];
                for (var i = 0; i < stockArr.length; i++) {
                    var b = _mkBox(stockArr[i], i);
                    stockBoxesEl.appendChild(b);
                    stockBoxes.push(b);
                }
                stockMinEl.textContent = '—';
                stockCurEl.textContent = '—';
                stockProfitEl.textContent = '—';
                stockMsgEl.textContent = '👆 "다음 스텝"을 눌러 배열을 순회하면서 최저가를 추적하고 최대 이익을 갱신하는 과정을 확인해보세요!';
            }
            stockInit();

            stockStepBtn.addEventListener('click', function() {
                stockPos++;
                if (stockPos >= stockArr.length) {
                    stockMsgEl.textContent = '완료! 최대 이익은 ' + stockProfit + '입니다 🎉';
                    stockBoxes.forEach(function(b) { b.classList.remove('comparing'); b.classList.add('matched'); });
                    return;
                }
                var price = stockArr[stockPos];
                var isNewMin = price < stockMin;
                stockMin = Math.min(stockMin, price);
                var curProfit = price - stockMin;
                var isNewMax = curProfit > stockProfit;
                stockProfit = Math.max(stockProfit, curProfit);

                stockBoxes.forEach(function(b, i) {
                    b.className = 'str-char-box';
                    if (i < stockPos) b.style.opacity = '0.5';
                    else b.style.opacity = '1';
                });
                stockBoxes[stockPos].classList.add('comparing');
                // 최저가 위치 하이라이트
                for (var mi = 0; mi <= stockPos; mi++) {
                    if (stockArr[mi] === stockMin) {
                        stockBoxes[mi].style.opacity = '1';
                        stockBoxes[mi].classList.add('matched');
                        break;
                    }
                }

                stockMinEl.textContent = stockMin;
                stockCurEl.textContent = curProfit;
                stockProfitEl.textContent = stockProfit;

                if (isNewMin) {
                    stockMsgEl.textContent = '가격 ' + price + ' → 새로운 최저가! 여기서 사면 가장 싸다.';
                } else if (isNewMax) {
                    stockMsgEl.textContent = '가격 ' + price + ' − 최저가 ' + stockMin + ' = 이익 ' + curProfit + ' → 최대 이익 갱신!';
                } else {
                    stockMsgEl.textContent = '가격 ' + price + ' − 최저가 ' + stockMin + ' = 이익 ' + curProfit + ' (최대 이익 ' + stockProfit + ' 유지)';
                }
            });

            stockResetBtn.addEventListener('click', stockInit);
        }
    },

    // ===== 시각화 탭 =====
    renderVisualize(container) { container.innerHTML = ''; },

    // ===== 시각화: 최솟값/최댓값 (BOJ 10818) =====
    _renderVizMinMax(container) {
        const self = this;
        self._clearVizState();
        const DEFAULT_ARR = [5, 20, -1, 7, 3, -8, 15];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="minmax-input" value="5, 20, -1, 7, 3, -8, 15" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;">' +
            '<button class="viz-input-reset" id="minmax-reset" title="입력 변경 후 다시 시작">🔄</button></label></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> 확인 중</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> 현재 최솟값</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--accent);background:rgba(108,92,231,0.15);vertical-align:middle;"></span> 현재 최댓값</span></div>' +
            '<div id="minmax-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">현재 최솟값</div>' +
            '<div id="minmax-min" style="font-weight:700;font-size:1.1rem;color:var(--green);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">현재 최댓값</div>' +
            '<div id="minmax-max" style="font-weight:700;font-size:1.1rem;color:var(--accent);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

        var boxesEl = container.querySelector('#minmax-boxes');
        var minEl = container.querySelector('#minmax-min');
        var maxEl = container.querySelector('#minmax-max');

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
        function setBoxState(idx, cls) {
            var b = boxesEl.querySelector('[data-idx="' + idx + '"]');
            if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }
        function saveState(data) {
            return {
                boxClasses: Array.from(boxesEl.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                min: minEl.innerHTML,
                max: maxEl.innerHTML
            };
        }
        function restoreState(s) {
            boxesEl.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.boxClasses[i]; });
            minEl.innerHTML = s.min;
            maxEl.innerHTML = s.max;
        }

        function buildSteps() {
            var input = container.querySelector('#minmax-input').value;
            var data = input.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (data.length < 1) { data = DEFAULT_ARR; }
            renderBoxes(data);
            minEl.textContent = '—';
            maxEl.textContent = '—';

            var steps = [];
            var curMin = data[0], curMax = data[0], minIdx = 0, maxIdx = 0;

            // Step 0: 첫 번째 원소를 초기값으로 설정
            (function() {
                var _val = data[0];
                steps.push({
                    description: '첫 번째 원소 arr[0]=' + _val + '을 최솟값이자 최댓값의 초기값으로 설정합니다. 아직 하나밖에 안 봤으니 이 값이 현재 최소이자 최대!',
                    _before: null,
                    action: function() {
                        this._before = saveState(data);
                        for (var j = 0; j < data.length; j++) setBoxState(j, '');
                        setBoxState(0, 'matched');
                        minEl.innerHTML = '<strong>' + _val + '</strong> (idx 0)';
                        maxEl.innerHTML = '<strong>' + _val + '</strong> (idx 0)';
                    },
                    undo: function() { restoreState(this._before); }
                });
            })();

            // 나머지 원소를 하나씩 비교
            for (var i = 1; i < data.length; i++) {
                (function(idx) {
                    var val = data[idx];
                    var prevMin = curMin, prevMax = curMax, prevMinIdx = minIdx, prevMaxIdx = maxIdx;
                    var isNewMin = val < curMin;
                    var isNewMax = val > curMax;

                    // 비교 스텝: 현재 값을 min/max와 비교
                    steps.push({
                        description: 'arr[' + idx + ']=' + val + '을 확인합니다. 현재 최솟값 ' + prevMin + '과 비교: ' +
                            (val < prevMin ? val + ' < ' + prevMin + ' → 더 작다! 최솟값 갱신 필요!' : val + ' ≥ ' + prevMin + ' → 최솟값 유지.') +
                            ' 현재 최댓값 ' + prevMax + '과 비교: ' +
                            (val > prevMax ? val + ' > ' + prevMax + ' → 더 크다! 최댓값 갱신 필요!' : val + ' ≤ ' + prevMax + ' → 최댓값 유지.'),
                        _before: null,
                        action: function() {
                            this._before = saveState(data);
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(idx, 'comparing');
                            setBoxState(prevMinIdx, 'matched');
                            if (prevMaxIdx !== prevMinIdx) setBoxState(prevMaxIdx, 'visited');
                            minEl.innerHTML = '<strong>' + prevMin + '</strong> (idx ' + prevMinIdx + ')';
                            maxEl.innerHTML = '<strong>' + prevMax + '</strong> (idx ' + prevMaxIdx + ')';
                        },
                        undo: function() { restoreState(this._before); }
                    });

                    // 갱신 스텝: 실제로 min/max 값이 바뀌었으면 보여주기
                    if (isNewMin || isNewMax) {
                        var newMin = isNewMin ? val : prevMin;
                        var newMax = isNewMax ? val : prevMax;
                        var newMinIdx = isNewMin ? idx : prevMinIdx;
                        var newMaxIdx = isNewMax ? idx : prevMaxIdx;
                        steps.push({
                            description: (isNewMin ? '최솟값 갱신! ' + prevMin + ' → ' + val : '') +
                                (isNewMin && isNewMax ? ' / ' : '') +
                                (isNewMax ? '최댓값 갱신! ' + prevMax + ' → ' + val : ''),
                            _before: null,
                            action: function() {
                                this._before = saveState(data);
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(newMinIdx, 'matched');
                                if (newMaxIdx !== newMinIdx) setBoxState(newMaxIdx, 'visited');
                                minEl.innerHTML = '<strong>' + newMin + '</strong> (idx ' + newMinIdx + ')';
                                maxEl.innerHTML = '<strong>' + newMax + '</strong> (idx ' + newMaxIdx + ')';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                    }

                    if (isNewMin) { curMin = val; minIdx = idx; }
                    if (isNewMax) { curMax = val; maxIdx = idx; }
                })(i);
            }

            // 최종 결과
            var finalMin = curMin, finalMax = curMax, finalMinIdx = minIdx, finalMaxIdx = maxIdx;
            steps.push({
                description: '순회 완료! 최솟값 = ' + finalMin + ', 최댓값 = ' + finalMax + '. 배열을 딱 한 번 훑어서 O(n)에 해결!',
                _before: null,
                action: function() {
                    this._before = saveState(data);
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    setBoxState(finalMinIdx, 'matched');
                    if (finalMaxIdx !== finalMinIdx) setBoxState(finalMaxIdx, 'visited');
                    minEl.innerHTML = '<strong style="font-size:1.3rem;">' + finalMin + '</strong> ✅';
                    maxEl.innerHTML = '<strong style="font-size:1.3rem;">' + finalMax + '</strong> ✅';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // 리셋 버튼
        container.querySelector('#minmax-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            var input = container.querySelector('#minmax-input').value;
            var data = input.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (data.length < 1) { data = DEFAULT_ARR; }
            renderBoxes(data);
            minEl.textContent = '—';
            maxEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(DEFAULT_ARR);
        self._initStepController(container, buildSteps);
    },

    // ===== 시각화: Two Sum (해시맵) =====
    _renderVizTwoSum(container) {
        const self = this;
        self._clearVizState();

        const DEFAULT_ARR = [2, 7, 11, 4, 1, 5, 3, 8];

        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">목표 합:
                    <input type="number" id="arr-target" value="9"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;">
                    <button class="viz-input-reset" id="arr-viz-reset" title="입력 변경 후 다시 시작">🔄</button>
                </label>
            </div>

            ${self._createStepDesc()}
            <div id="arr-sim-box" class="sim-card" style="overflow:visible;padding:0;position:relative;">
                <div id="arr-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>
                <div style="padding:24px;display:flex;flex-direction:column;align-items:center;gap:16px;">
                    <div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">
                        <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--accent);background:rgba(108,92,231,0.15);vertical-align:middle;"></span> 확인 중</span>
                        <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> 정답</span>
                    </div>
                    <div id="arr-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                    <div id="arr-pointer-info" style="font-size:1.1rem;font-weight:600;color:var(--text2);text-align:center;min-height:28px;"></div>
                </div>

                <div style="display:flex;gap:24px;padding:0 24px 16px;flex-wrap:wrap;">
                    <div style="flex:1;min-width:150px;">
                        <div style="font-weight:700;margin-bottom:6px;font-size:0.85rem;color:var(--text3);">seen (해시맵)</div>
                        <div id="sw-seen" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 12px;font-family:'SF Mono','Consolas',monospace;font-size:0.85rem;">{ }</div>
                    </div>
                    <div style="flex:1;min-width:150px;">
                        <div style="font-weight:700;margin-bottom:6px;font-size:0.85rem;color:var(--text3);">상태</div>
                        <div id="arr-status" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">—</div>
                    </div>
                </div>

                <div id="arr-step-bar" style="display:flex;align-items:center;justify-content:center;gap:1rem;padding:12px 24px;border-top:1px solid var(--bg3);background:var(--bg1);">
                    <button id="arr-prev-btn" class="btn code-step-btn" disabled style="font-size:0.85rem;">← 이전</button>
                    <span id="arr-step-counter" style="font-size:0.85rem;font-weight:600;color:var(--accent);min-width:60px;text-align:center;">시작 전</span>
                    <button id="arr-next-btn" class="btn btn-primary code-step-btn" style="font-size:0.85rem;">다음 →</button>
                </div>
            </div>
        `;

        const boxes = container.querySelector('#arr-boxes');
        const ptrEl = container.querySelector('#arr-pointer-info');
        const seenEl = container.querySelector('#sw-seen');
        const statusEl = container.querySelector('#arr-status');
        const flyEl = container.querySelector('#arr-fly');
        const wrapEl = container.querySelector('#arr-sim-box');

        function renderBoxes(arr) {
            boxes.innerHTML = '';
            arr.forEach((v, i) => {
                const box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = `<div class="str-char-idx">${i}</div><div class="str-char-val">${v}</div>`;
                boxes.appendChild(box);
            });
        }

        function setBoxState(idx, cls) {
            const box = boxes.querySelector(`[data-idx="${idx}"]`);
            if (box) box.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }

        function renderSeen(seen) {
            if (Object.keys(seen).length === 0) { seenEl.innerHTML = '{ }'; return; }
            seenEl.innerHTML = Object.entries(seen).map(([k, v]) =>
                `<span id="seen-key-${k}" style="background:rgba(0,0,0,0.05);padding:2px 8px;border-radius:5px;border:1px solid rgba(0,0,0,0.08);transition:all 0.3s;"><span style="color:#d63384;font-weight:600;">${k}</span><span style="color:#999;">:</span><span style="color:#0d6efd;">${v}</span></span>`
            ).join(' ');
        }

        function highlightSeenKey(key, found) {
            const el = seenEl.querySelector('#seen-key-' + key);
            if (found && el) {
                el.style.background = 'rgba(0,184,148,0.4)';
                el.style.transform = 'scale(1.15)';
                el.style.display = 'inline-block';
            } else {
                // not found — briefly dim all
                seenEl.querySelectorAll('span[id^="seen-key"]').forEach(s => { s.style.opacity = '0.4'; });
            }
        }

        function clearSeenHighlight() {
            seenEl.querySelectorAll('span[id^="seen-key"]').forEach(s => {
                s.style.background = 'rgba(0,0,0,0.05)'; s.style.transform = ''; s.style.opacity = '';
            });
        }

        function saveState() {
            return {
                boxClasses: Array.from(boxes.querySelectorAll('.str-char-box')).map(b => b.className),
                pointer: ptrEl.innerHTML,
                seen: seenEl.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            boxes.querySelectorAll('.str-char-box').forEach((b, i) => { b.className = s.boxClasses[i]; });
            ptrEl.innerHTML = s.pointer;
            seenEl.innerHTML = s.seen;
            statusEl.innerHTML = s.status;
        }

        renderBoxes(DEFAULT_ARR);

        const prevBtn = container.querySelector('#arr-prev-btn');
        const nextBtn = container.querySelector('#arr-next-btn');
        const stepCounter = container.querySelector('#arr-step-counter');
        const state = self._vizState;

        function buildSteps() {
            const target = parseInt(container.querySelector('#arr-target').value) || 9;
            const nums = DEFAULT_ARR;
            const steps = [];
            const seen = {};

            for (let idx = 0; idx < nums.length; idx++) {
                const i = idx, num = nums[i], comp = target - num;
                const found = seen.hasOwnProperty(comp);
                const foundIdx = found ? seen[comp] : -1;

                steps.push({
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        flyEl.innerHTML = '';
                        for (let j = 0; j < nums.length; j++) setBoxState(j, '');
                        setBoxState(i, 'current');
                        ptrEl.innerHTML = `<strong>${num}</strong>의 짝꿍 <strong>${comp}</strong> 찾는 중…`;
                        if (found) {
                            highlightSeenKey(comp, true);
                            statusEl.innerHTML = `<span style="color:var(--green);">${comp} 있다! 🎉</span>`;
                        } else {
                            highlightSeenKey(comp, false);
                            statusEl.innerHTML = `<span style="color:var(--text3);">${comp} 없다 → 저장하고 넘어가자</span>`;
                        }
                    },
                    undo: function() { flyEl.innerHTML = ''; restoreState(this._before); }
                });

                if (found) {
                    steps.push({
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            flyEl.innerHTML = '';
                            for (let j = 0; j < nums.length; j++) setBoxState(j, '');
                            setBoxState(foundIdx, 'matched');
                            setBoxState(i, 'matched');
                            clearSeenHighlight();
                            ptrEl.innerHTML = `<span style="color:var(--green);">${nums[foundIdx]} + ${num} = ${target} ✅</span>`;
                            statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;">정답! [${foundIdx}, ${i}]</span>`;
                        },
                        undo: function() { flyEl.innerHTML = ''; restoreState(this._before); }
                    });
                    break;
                } else {
                    const seenSnap = Object.assign({}, seen);
                    seenSnap[num] = i;
                    steps.push({
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            flyEl.innerHTML = '';
                            var srcBox = boxes.querySelector('[data-idx="' + i + '"]');
                            var srcRect = srcBox ? srcBox.getBoundingClientRect() : null;
                            clearSeenHighlight();
                            setBoxState(i, '');
                            renderSeen(seenSnap);
                            statusEl.innerHTML = `seen에 ${num} 저장 ✓`;
                            // Flying ghost: array box → hashmap entry
                            var dstKey = seenEl.querySelector('#seen-key-' + num);
                            if (srcRect && dstKey && wrapEl) {
                                var wr = wrapEl.getBoundingClientRect();
                                var dr = dstKey.getBoundingClientRect();
                                dstKey.style.opacity = '0';
                                var ghost = document.createElement('div');
                                ghost.textContent = num;
                                ghost.style.cssText = 'position:absolute;z-index:20;padding:4px 10px;' +
                                    'left:' + (srcRect.left - wr.left) + 'px;top:' + (srcRect.top - wr.top) + 'px;' +
                                    'font-weight:700;font-size:0.9rem;background:var(--accent);color:white;border-radius:8px;' +
                                    'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
                                flyEl.appendChild(ghost);
                                requestAnimationFrame(function() { requestAnimationFrame(function() {
                                    ghost.style.left = (dr.left - wr.left) + 'px';
                                    ghost.style.top = (dr.top - wr.top) + 'px';
                                }); });
                                setTimeout(function() {
                                    if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                                    if (dstKey) {
                                        dstKey.style.opacity = '1';
                                        dstKey.style.background = 'rgba(108,92,231,0.3)';
                                        dstKey.style.transform = 'scale(1.15)';
                                        dstKey.style.display = 'inline-block';
                                        setTimeout(function() {
                                            dstKey.style.background = 'rgba(0,0,0,0.05)';
                                            dstKey.style.transform = '';
                                        }, 400);
                                    }
                                }, 550);
                            }
                        },
                        undo: function() { flyEl.innerHTML = ''; restoreState(this._before); }
                    });
                    seen[num] = i;
                }
            }
            return steps;
        }

        function resetAll() {
            state.steps = [];
            state.currentStep = -1;
            flyEl.innerHTML = '';
            renderBoxes(DEFAULT_ARR);
            ptrEl.textContent = ''; seenEl.innerHTML = '{ }'; statusEl.textContent = '—';
            stepCounter.textContent = '시작 전';
            prevBtn.disabled = true;
            nextBtn.disabled = false;
            nextBtn.textContent = '다음 →';
        }

        function updateUI() {
            const idx = state.currentStep;
            const total = state.steps.length;
            prevBtn.disabled = idx <= 0;
            nextBtn.disabled = idx >= total - 1;
            if (idx >= 0) {
                stepCounter.textContent = `${idx + 1} / ${total}`;
            }
            if (idx >= total - 1) {
                nextBtn.disabled = false;
                nextBtn.textContent = '▶ 다시';
            } else {
                nextBtn.textContent = '다음 →';
            }
        }

        // 다음 버튼
        nextBtn.addEventListener('click', function() {
            // 첫 클릭 → 스텝 빌드
            if (state.steps.length === 0) {
                renderBoxes(DEFAULT_ARR);
                ptrEl.textContent = ''; seenEl.innerHTML = '{ }'; statusEl.textContent = '탐색 준비 완료';
                state.steps = buildSteps();
                state.currentStep = -1;
            }
            // 마지막이면 리셋
            if (state.currentStep >= state.steps.length - 1) {
                resetAll();
                return;
            }
            state.currentStep++;
            state.steps[state.currentStep].action();
            updateUI();
        });

        // 이전 버튼
        prevBtn.addEventListener('click', function() {
            if (state.currentStep > 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
                updateUI();
            }
        });

        // 리셋 버튼
        container.querySelector('#arr-viz-reset').addEventListener('click', resetAll);

        // 키보드 지원
        state.keydownHandler = function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ') { nextBtn.click(); e.preventDefault(); }
            if (e.key === 'ArrowLeft') { prevBtn.click(); e.preventDefault(); }
        };
        document.addEventListener('keydown', state.keydownHandler);
    },

    // ===== 시각화 상태 관리 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null, buildSteps: null },

    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1; s.buildSteps = null;
        // 힌트 미니 시뮬레이션 정리
        document.querySelectorAll('.hint-step').forEach(function(step) {
            if (step._vizCtrl && step._vizCtrl.destroy) { step._vizCtrl.destroy(); step._vizCtrl = null; }
        });
    },

    _createStepDesc(suffix) {
        const s = suffix || '';
        return `<div class="viz-step-desc" data-role="desc" data-step-group="${s}" style="display:none;"></div>`;
    },
    _createStepControls(suffix) {
        const s = suffix || '';
        return `
            <div class="viz-step-controls initial-state" data-step-group="${s}">
                <button class="btn viz-step-btn viz-step-prev" data-role="prev" disabled>&larr; 이전</button>
                <span class="viz-step-counter" data-role="counter"></span>
                <button class="btn btn-primary viz-step-btn" data-role="next">다음 &rarr;</button>
            </div>
        `;
    },

    // stepsOrFn: steps 배열 또는 buildSteps 콜백 함수
    _initStepController(el, stepsOrFn, suffix) {
        const state = this._vizState;
        // 기존 키보드 핸들러 정리
        if (state.keydownHandler) {
            document.removeEventListener('keydown', state.keydownHandler);
            state.keydownHandler = null;
        }
        const group = suffix || '';
        const isLazy = typeof stepsOrFn === 'function';
        state.steps = isLazy ? [] : stepsOrFn;
        state.buildSteps = isLazy ? stepsOrFn : null;
        state.currentStep = -1;

        const controls = el.querySelector(`.viz-step-controls[data-step-group="${group}"]`);
        const prevBtn = controls.querySelector('[data-role="prev"]');
        const nextBtn = controls.querySelector('[data-role="next"]');
        const counter = controls.querySelector('[data-role="counter"]');
        const desc = el.querySelector(`.viz-step-desc[data-step-group="${group}"]`);

        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            const isInitial = idx < 0;
            const isLast = total > 0 && idx >= total - 1;

            // 초기 상태 토글
            controls.classList.toggle('initial-state', isInitial);

            // 이전 버튼
            prevBtn.disabled = (idx <= 0);

            // 다음/다시시작 버튼
            if (isLast) {
                nextBtn.innerHTML = '🔄 다시 시작';
                nextBtn.classList.remove('btn-primary');
                nextBtn.classList.add('restart-btn');
                nextBtn.disabled = false;
            } else {
                nextBtn.innerHTML = '다음 &rarr;';
                nextBtn.classList.add('btn-primary');
                nextBtn.classList.remove('restart-btn');
                nextBtn.disabled = false;
            }

            // 카운터 + 설명
            if (isInitial) {
                counter.textContent = '';
                if (desc) desc.style.display = 'none';
            } else {
                counter.textContent = `${idx + 1} / ${total}`;
                if (desc) { desc.innerHTML = '<span>' + state.steps[idx].description + '</span>'; desc.style.display = ''; }
            }
        };

        var actionDelay = 350;
        nextBtn.addEventListener('click', () => {
            // 마지막 스텝 → 다시 시작
            if (state.steps.length > 0 && state.currentStep >= state.steps.length - 1) {
                while (state.currentStep >= 0) {
                    if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                    state.currentStep--;
                }
                if (state.buildSteps) state.steps = [];
                updateUI();
                return;
            }
            // 초기 상태 + lazy → steps 빌드
            if (state.currentStep === -1 && state.buildSteps && state.steps.length === 0) {
                state.steps = state.buildSteps();
                if (!state.steps || state.steps.length === 0) return;
            }
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            updateUI();
            setTimeout(() => { state.steps[state.currentStep].action(); }, actionDelay);
        });

        prevBtn.addEventListener('click', () => {
            if (state.currentStep <= 0) {
                // Step 0에서 이전 → 초기 상태로
                var stepToUndo = state.currentStep;
                state.currentStep = -1;
                updateUI();
                setTimeout(() => {
                    if (stepToUndo === 0 && state.steps[0] && state.steps[0].undo) state.steps[0].undo();
                    if (state.buildSteps) state.steps = [];
                }, actionDelay);
                return;
            }
            var stepToUndo = state.currentStep;
            state.currentStep--;
            updateUI();
            setTimeout(() => { if (state.steps[stepToUndo] && state.steps[stepToUndo].undo) state.steps[stepToUndo].undo(); }, actionDelay);
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
        const PRICES = [7, 1, 5, 3, 6, 4, 2, 8, 1];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">가격 배열: <input type="text" id="stock-input" value="7, 1, 5, 3, 6, 4, 2, 8, 1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;">' +
            '<button class="viz-input-reset" id="stock-reset" title="입력 변경 후 다시 시작">🔄</button></label></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> 확인 중</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> 최소가</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--accent);background:rgba(108,92,231,0.15);vertical-align:middle;"></span> 최적 매도</span></div>' +
            '<div id="stock-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">최소 가격</div>' +
            '<div id="stock-min" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">현재 이익</div>' +
            '<div id="stock-profit" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">최대 이익</div>' +
            '<div id="stock-maxprofit" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

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

        function buildSteps() {
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
                    description: _newProfit ? '가격 ' + _price + ', 최저가(' + _minPrice + ')에 사서 지금 팔면 이익 ' + _profit + ' → 지금까지 최고 이익 갱신! 🎉' : _newMin ? '가격 ' + _price + ' → 지금까지 본 가격 중 가장 싸므로 최저가 갱신! 이후에 비싸게 팔 기회를 노립니다. 🏷️' : _profit > 0 ? '가격 ' + _price + ', 최저가(' + _minPrice + ')에 사서 팔면 이익 ' + _profit + '이지만 최고(' + _maxProfit + ')보다 작아서 갱신 안 함' : '가격 ' + _price + ', 최저가(' + _minPrice + ') 이하라 이익 없음, 패스',
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

            return steps;
        }

        // 🔄 리셋 버튼
        container.querySelector('#stock-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderBoxes(PRICES);
            minEl.textContent = '—'; profitEl.textContent = '—'; maxProfitEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(PRICES);
        self._initStepController(container, buildSteps);
    },

    // ===== 시각화: 3Sum =====
    _renderViz3Sum(container) {
        const self = this;
        self._clearVizState();
        const DEFAULT_DATA = [-1, 0, 1, 2, -1, -4, 3, -2];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="three-input" value="-1, 0, 1, 2, -1, -4, 3, -2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;">' +
            '<button class="viz-input-reset" id="three-reset" title="입력 변경 후 다시 시작">🔄</button></label></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid #e17055;background:rgba(225,112,85,0.2);vertical-align:middle;"></span> i (고정)</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> L / R</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> 찾음</span></div>' +
            '<div id="three-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="three-pointer" style="font-size:0.95rem;font-weight:600;color:var(--text2);text-align:center;min-height:24px;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">현재 합</div>' +
            '<div id="three-sum" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">찾은 조합</div>' +
            '<div id="three-results" style="font-weight:600;font-size:0.9rem;color:var(--text2);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

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

        function buildSteps() {
            var input = container.querySelector('#three-input').value;
            var data = input.split(',').map(function(s){return parseInt(s.trim());}).filter(function(n){return !isNaN(n);});
            if (data.length < 3) data = DEFAULT_DATA.slice();
            data.sort(function(a,b){return a-b;});
            renderBoxes(data);
            ptrEl.textContent = ''; sumEl.textContent = '—'; resultsEl.textContent = '—';

            var steps = [];
            var foundResults = [];

            // helper: 음수 괄호 표시
            function fv(v) { return v < 0 ? '(' + v + ')' : '' + v; }

            // Step 1: 정렬
            steps.push({
                description: '먼저 배열을 정렬합니다',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '정렬 완료';
                    sumEl.textContent = '—'; resultsEl.textContent = '—';
                },
                undo: function() { restoreState(this._before); }
            });

            for (var i = 0; i < data.length - 2; i++) {
                // 중복 i 건너뛰기
                if (i > 0 && data[i] === data[i-1]) {
                    let _i = i;
                    steps.push({
                        description: 'i=' + _i + '은 이전 값과 같으므로 건너뜀',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_i, 'fixed');
                            ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + ' (중복 건너뜀)</span>';
                            sumEl.textContent = '—';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    continue;
                }

                var left = i + 1, right = data.length - 1;

                // i 고정 + 포인터 세팅 스텝
                (function(_i, _l, _r) {
                    steps.push({
                        description: 'i=' + _i + ' (' + data[_i] + ') 고정, 양쪽에서 좁혀갑니다',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_i, 'fixed');
                            setBoxState(_l, 'comparing');
                            setBoxState(_r, 'comparing');
                            ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--yellow);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                            sumEl.textContent = '—';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                })(i, left, right);

                while (left < right) {
                    var s = data[i] + data[left] + data[right];
                    let _i = i, _l = left, _r = right, _s = s, _match = (s === 0);
                    let _foundBefore = foundResults.slice();

                    if (_match) {
                        let _foundAfter = _foundBefore.slice();
                        _foundAfter.push('[' + data[_i] + ',' + data[_l] + ',' + data[_r] + ']');

                        steps.push({
                            description: '합 = 0! 조합 발견 🎉',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(_i, 'matched');
                                setBoxState(_l, 'matched');
                                setBoxState(_r, 'matched');
                                ptrEl.innerHTML = '<span style="color:var(--green);">i=' + _i + '</span> &nbsp; <span style="color:var(--green);">L=' + _l + '</span> &nbsp; <span style="color:var(--green);">R=' + _r + '</span>';
                                sumEl.innerHTML = data[_i] + ' + ' + fv(data[_l]) + ' + ' + fv(data[_r]) + ' = <strong style="color:var(--green);">0</strong>';
                                resultsEl.innerHTML = _foundAfter.join(', ');
                            },
                            undo: function() { restoreState(this._before); }
                        });

                        foundResults.push('[' + data[i] + ',' + data[left] + ',' + data[right] + ']');
                        while (left < right && data[left] === data[left+1]) left++;
                        while (left < right && data[right] === data[right-1]) right--;
                        left++; right--;
                    } else if (s < 0) {
                        let _foundCopy = _foundBefore.slice();
                        steps.push({
                            description: '합 = ' + _s + ' → 너무 작다! L 오른쪽으로',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(_i, 'fixed');
                                setBoxState(_l, 'comparing');
                                setBoxState(_r, 'comparing');
                                ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--yellow);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                                sumEl.innerHTML = data[_i] + ' + ' + fv(data[_l]) + ' + ' + fv(data[_r]) + ' = <strong>' + _s + '</strong>';
                                resultsEl.innerHTML = _foundCopy.length > 0 ? _foundCopy.join(', ') : '—';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                        left++;
                    } else {
                        let _foundCopy = _foundBefore.slice();
                        steps.push({
                            description: '합 = ' + _s + ' → 너무 크다! R 왼쪽으로',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(_i, 'fixed');
                                setBoxState(_l, 'comparing');
                                setBoxState(_r, 'comparing');
                                ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--yellow);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                                sumEl.innerHTML = data[_i] + ' + ' + fv(data[_l]) + ' + ' + fv(data[_r]) + ' = <strong>' + _s + '</strong>';
                                resultsEl.innerHTML = _foundCopy.length > 0 ? _foundCopy.join(', ') : '—';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                        right--;
                    }
                }
            }

            // 최종 완료 스텝
            var _finalResults = foundResults.slice();
            steps.push({
                description: '완료! ' + (_finalResults.length > 0 ? _finalResults.length + '개 조합 발견' : '조합 없음'),
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '<span style="color:var(--green);">✓ 탐색 완료</span>';
                    sumEl.textContent = '—';
                    resultsEl.innerHTML = _finalResults.length > 0 ? _finalResults.join(', ') : '없음';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // 🔄 리셋 버튼
        container.querySelector('#three-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderBoxes(DEFAULT_DATA);
            ptrEl.textContent = ''; sumEl.textContent = '—'; resultsEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(DEFAULT_DATA);
        self._initStepController(container, buildSteps);
    },

    // ===== 시각화: 슬라이딩 윈도우 (수들의 합) =====
    _renderVizSlidingWindow(container) {
        const self = this;
        self._clearVizState();
        const DEFAULT_ARR = [1, 2, 3, 1, 1, 2, 1, 3];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="sw-arr" value="1, 2, 3, 1, 1, 2, 1, 3" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<label style="font-weight:600;">목표 합 M: <input type="number" id="sw-target" value="5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="viz-input-reset" id="sw-reset" title="입력 변경 후 다시 시작">🔄</button></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> 윈도우</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> 합 = M</span></div>' +
            '<div id="sw-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="sw-pointer" style="font-size:0.95rem;font-weight:600;color:var(--text2);text-align:center;min-height:24px;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:100px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">구간 합</div>' +
            '<div id="sw-sum" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:100px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">매치 횟수</div>' +
            '<div id="sw-count" style="font-weight:700;font-size:1.1rem;color:var(--text);">0</div></div>' +
            '<div style="flex:1;min-width:100px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">상태</div>' +
            '<div id="sw-status" style="font-weight:600;font-size:0.9rem;color:var(--text2);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

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

        function buildSteps() {
            var input = container.querySelector('#sw-arr').value;
            var data = input.split(',').map(function(s){return parseInt(s.trim());}).filter(function(n){return !isNaN(n);});
            if (data.length < 1) data = DEFAULT_ARR.slice();
            var M = parseInt(container.querySelector('#sw-target').value) || 3;
            renderBoxes(data);
            ptrEl.textContent = ''; sumEl.textContent = '—'; countEl.textContent = '0'; statusEl.textContent = '—';

            var steps = [];
            var start = 0, end = 0, curSum = 0, count = 0;

            // Step 0: 초기 상태
            steps.push({
                description: '배열 [' + data.join(', ') + ']에서 합이 ' + M + '인 연속 구간을 찾아봐요!',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '<span style="color:var(--green);">start=0</span> &nbsp; <span style="color:var(--accent);">end=0</span>';
                    sumEl.textContent = '0'; countEl.textContent = '0'; statusEl.textContent = '두 포인터 준비!';
                },
                undo: function() { restoreState(this._before); }
            });

            while (true) {
                if (curSum >= M) {
                    let _s = start, _e = end, _sum = curSum, _matched = (curSum === M);
                    if (_matched) {
                        count++;
                        // 매치 발견 전용 스텝 (초록)
                        let _cnt = count;
                        let windowStr = '[' + data.slice(_s, _e).join(', ') + ']';
                        steps.push({
                            description: '🎉 ' + windowStr + ' = ' + _sum + ' 찾았다! (count=' + _cnt + ')',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                for (var j = _s; j < _e; j++) setBoxState(j, 'matched');
                                ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + '</span> &nbsp; <span style="color:var(--accent);">end=' + _e + '</span>';
                                sumEl.innerHTML = '<strong style="color:var(--green);">' + _sum + '</strong>';
                                countEl.innerHTML = '<strong style="color:var(--green);">' + _cnt + '</strong>';
                                statusEl.innerHTML = '<span style="color:var(--green);">✓ 합 = ' + M + '! count++</span>';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                    }
                    // start 이동 스텝
                    let _cnt2 = count, _removeVal = data[start];
                    let _sAfter = start + 1;
                    steps.push({
                        description: (_matched ? '다음 구간 찾기 위해' : '합(' + _sum + ') > M(' + M + ')이니까') + ' arr[' + _s + ']=' + _removeVal + ' 빼기 → start 이동',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_s, 'removing');
                            for (var j = _sAfter; j < _e; j++) setBoxState(j, 'comparing');
                            ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + ' → ' + _sAfter + '</span> &nbsp; <span style="color:var(--accent);">end=' + _e + '</span>';
                            sumEl.innerHTML = '<strong>' + (_sum - _removeVal) + '</strong>';
                            countEl.innerHTML = '<strong>' + _cnt2 + '</strong>';
                            statusEl.innerHTML = _sum + ' - ' + _removeVal + ' = ' + (_sum - _removeVal);
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    curSum -= data[start]; start++;
                } else if (end >= data.length) {
                    break;
                } else {
                    let _s = start, _e = end, _val = data[end];
                    curSum += data[end]; end++;
                    let _sum = curSum, _endAfter = end;
                    let windowStr = '[' + data.slice(_s, _endAfter).join(', ') + ']';
                    let desc = 'arr[' + _e + ']=' + _val + ' 추가 → ' + windowStr + ' 합 = ' + _sum;
                    if (_sum < M) desc += ' (M보다 작으니 더 넣자!)';
                    else if (_sum === M) desc += ' (딱 맞다!)';
                    steps.push({
                        description: desc, _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            for (var j = _s; j < _endAfter; j++) setBoxState(j, 'comparing');
                            ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + '</span> &nbsp; <span style="color:var(--accent);">end=' + _endAfter + '</span>';
                            sumEl.innerHTML = '<strong>' + _sum + '</strong>';
                            statusEl.innerHTML = _sum < M ? '합 < M → 오른쪽으로 확장!' : _sum === M ? '합 = M! 다음 스텝에서 확인' : '합 ≥ M → 줄여야 해요';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                }
            }

            // 최종 완료 스텝
            let _finalCount = count;
            steps.push({
                description: '✅ 탐색 완료! 합이 ' + M + '인 연속 구간 = 총 ' + _finalCount + '개',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '<span style="color:var(--green);">✓ 탐색 완료</span>';
                    sumEl.textContent = '—';
                    countEl.innerHTML = '<strong style="color:var(--green);font-size:1.3rem;">' + _finalCount + '</strong>';
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.05rem;">✓ 총 ' + _finalCount + '개 발견!</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // 🔄 리셋 버튼
        container.querySelector('#sw-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderBoxes(DEFAULT_ARR);
            ptrEl.textContent = ''; sumEl.textContent = '—'; countEl.textContent = '0'; statusEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(DEFAULT_ARR);
        self._initStepController(container, buildSteps);
    },

    // ===== 문제풀이 탭 =====
    stages: [
        { num: 1, title: '최솟값/최댓값', desc: '배열 순회 입문', problemIds: ['boj-10818'] },
        { num: 2, title: '배열 기본', desc: '한 번 순회, 투 포인터 기본 (Easy~Silver)', problemIds: ['lc-1', 'lc-121'] },
        { num: 3, title: '배열 심화', desc: '투 포인터 심화, 전처리 (Medium~Gold)', problemIds: ['boj-2003', 'lc-15'] }
    ],

    problems: [
        {
            id: 'boj-10818',
            title: 'BOJ 10818 - 최소, 최대',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/10818',
            simIntro: '배열을 처음부터 끝까지 순회하면서 최솟값과 최댓값을 추적하는 과정을 단계별로 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정수가 주어진다. 이때, 최솟값과 최댓값을 구하는 프로그램을 작성하시오.</p>

                <h4>입력</h4>
                <p>첫째 줄에 정수의 개수 N (1 ≤ N ≤ 1,000,000)이 주어진다. 둘째 줄에는 N개의 정수를 공백으로 구분해서 주어진다. 모든 정수는 -1,000,000보다 크거나 같고, 1,000,000보다 작거나 같은 정수이다.</p>

                <h4>출력</h4>
                <p>첫째 줄에 최솟값과 최댓값을 공백으로 구분해 출력한다.</p>

                <div class="problem-example"><h4>예제 입력 1</h4>
                <pre>5
20 10 35 30 7</pre></div>

                <div class="problem-example"><h4>예제 출력 1</h4>
                <pre>7 35</pre></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>-1,000,000 ≤ 각 정수 ≤ 1,000,000</li>
                </ul>
            `,
            inputDefault: 0,
            solve() { return '7 35'; },
            hints: [
                { title: '문제 이해: 뭘 구해야 할까?', content: '<div class="hint-key">💡 N개의 정수 중에서 가장 작은 수와 가장 큰 수를 찾으면 됩니다!</div><p>예시: [20, 10, 35, 30, 7] → 최솟값 <strong>7</strong>, 최댓값 <strong>35</strong></p><p>배열 전체를 한 번 살펴보면서 두 값을 동시에 찾을 수 있을까요?</p>' },
                { title: '초기값은 어떻게 정할까?', content: '<div class="hint-key">🤔 비교를 시작하려면 기준이 필요해요!</div><p>첫 번째 원소를 <strong>최솟값이자 최댓값의 초기값</strong>으로 설정합니다.</p><p>아직 다른 수를 보지 않았으니, 첫 번째 수가 현재까지의 최소이자 최대인 것이 맞습니다.</p><span class="lang-py"><pre><code class="language-python">min_val = nums[0]  # 초기 최솟값\nmax_val = nums[0]  # 초기 최댓값</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">int minVal = nums[0]; // 초기 최솟값\nint maxVal = nums[0]; // 초기 최댓값</code></pre></span>' },
                { title: '순회하며 비교!', content: '<div class="hint-key">🔄 두 번째 원소부터 끝까지 하나씩 비교합니다</div><p>각 원소를 볼 때마다 두 가지를 확인합니다:</p><ul><li>현재 최솟값보다 <strong>작으면</strong> → 최솟값 갱신</li><li>현재 최댓값보다 <strong>크면</strong> → 최댓값 갱신</li></ul><div style="display:flex;gap:4px;align-items:end;margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;flex-wrap:wrap;justify-content:center;"><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">20</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=0</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">10</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=1</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">35</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=2</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">30</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=3</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">7</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=4</div></div></div><div style="display:flex;gap:12px;justify-content:center;margin-bottom:8px;"><span style="color:#00b894;font-weight:700;">min=7</span> <span style="color:#e17055;font-weight:700;">max=35</span></div><p>이렇게 하면 배열을 <strong>딱 한 번</strong>만 순회해서 O(n)에 해결!</p>' },
                { title: '더 간단한 방법도 있다!', content: '<div class="hint-key">💡 대부분의 언어에 최솟값/최댓값을 구하는 내장 함수가 있습니다!</div><span class="lang-py"><p>Python: <code>min()</code>과 <code>max()</code> — 리스트를 넣으면 바로 최솟값/최댓값을 반환합니다.</p></span><span class="lang-cpp"><p>C++: <code>*min_element()</code>과 <code>*max_element()</code> — <code>&lt;algorithm&gt;</code> 헤더에 있습니다.</p></span><p>내장 함수도 내부적으로는 배열을 한 번 순회하면서 비교합니다. 시간 복잡도는 동일하게 <strong>O(n)</strong>이지만, 코드가 훨씬 짧고 가독성이 좋습니다!</p>' }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

n = int(input())
nums = list(map(int, input().split()))

# 첫 번째 원소로 초기화 후 순회하며 갱신
min_val = nums[0]
max_val = nums[0]
for x in nums[1:]:
    if x < min_val:
        min_val = x
    if x > max_val:
        max_val = x

print(min_val, max_val)`,
                cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // 첫 번째 원소로 초기화 후 순회하며 갱신
    int minVal = nums[0], maxVal = nums[0];
    for (int i = 1; i < n; i++) {
        if (nums[i] < minVal) minVal = nums[i];
        if (nums[i] > maxVal) maxVal = nums[i];
    }
    cout << minVal << " " << maxVal << endl;
    return 0;
}`
            },
            solutions: [{
                approach: '직접 순회',
                description: '배열을 처음부터 끝까지 한 번 순회하며 최솟값과 최댓값을 추적',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                hints: [
                    { title: '문제 이해: 뭘 구해야 할까?', content: '<div class="hint-key">💡 N개의 정수 중에서 가장 작은 수와 가장 큰 수를 찾으면 됩니다!</div><p>예시: [20, 10, 35, 30, 7] → 최솟값 <strong>7</strong>, 최댓값 <strong>35</strong></p><p>배열 전체를 한 번 살펴보면서 두 값을 동시에 찾을 수 있을까요?</p>' },
                    { title: '초기값은 어떻게 정할까?', content: '<div class="hint-key">🤔 비교를 시작하려면 기준이 필요해요!</div><p>첫 번째 원소를 <strong>최솟값이자 최댓값의 초기값</strong>으로 설정합니다.</p><p>아직 다른 수를 보지 않았으니, 첫 번째 수가 현재까지의 최소이자 최대인 것이 맞습니다.</p><span class="lang-py"><pre><code class="language-python">min_val = nums[0]  # 초기 최솟값\nmax_val = nums[0]  # 초기 최댓값</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">int minVal = nums[0]; // 초기 최솟값\nint maxVal = nums[0]; // 초기 최댓값</code></pre></span>' },
                    { title: '순회하며 비교!', content: '<div class="hint-key">🔄 두 번째 원소부터 끝까지 하나씩 비교합니다</div><p>각 원소를 볼 때마다 두 가지를 확인합니다:</p><ul><li>현재 최솟값보다 <strong>작으면</strong> → 최솟값 갱신</li><li>현재 최댓값보다 <strong>크면</strong> → 최댓값 갱신</li></ul><p>이렇게 하면 배열을 <strong>딱 한 번</strong>만 순회해서 O(n)에 해결!</p>' },
                    { title: '결과 출력', content: '<div class="hint-key">✅ 순회가 끝나면 최솟값과 최댓값이 확정됩니다!</div><p>공백으로 구분하여 출력하면 끝!</p><span class="lang-py"><pre><code class="language-python">print(min_val, max_val)  # 예: 7 35</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">cout << minVal << " " << maxVal << endl;</code></pre></span>' }
                ],
                vizMethod: '_renderVizMinMax',
                simIntro: '배열을 순회하며 최솟값과 최댓값을 찾아가는 과정을 확인해보세요!',
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\n\n# 첫 번째 원소로 초기화 후 순회하며 갱신\nmin_val = nums[0]\nmax_val = nums[0]\nfor x in nums[1:]:\n    if x < min_val:\n        min_val = x\n    if x > max_val:\n        max_val = x\n\nprint(min_val, max_val)`,
                    cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n\n    // 첫 번째 원소로 초기화 후 순회하며 갱신\n    int minVal = nums[0], maxVal = nums[0];\n    for (int i = 1; i < n; i++) {\n        if (nums[i] < minVal) minVal = nums[i];\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }\n    cout << minVal << " " << maxVal << endl;\n    return 0;\n}`
                },
                codeSteps: {
                    python: [
                        { title: '입력 받기', desc: 'N과 N개의 정수를 입력받습니다.\nsys.stdin.readline을 쓰는 이유: N이 최대 100만이라 빠른 입력이 필요!', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))' },
                        { title: '초기값 설정', desc: '첫 번째 원소를 최솟값과 최댓값의 기준으로 삼습니다.\n아직 하나밖에 안 봤으니 그 수가 현재 최소이자 최대!', code: 'min_val = nums[0]  # 비교 기준: 첫 번째 원소\nmax_val = nums[0]' },
                        { title: '순회하며 비교', desc: '두 번째 원소부터 끝까지 하나씩 비교합니다.\n각 원소마다 최솟값/최댓값과 비교 → 갱신!', code: 'for x in nums[1:]:\n    if x < min_val:   # 현재 최솟값보다 작으면?\n        min_val = x    # → 최솟값 갱신!\n    if x > max_val:   # 현재 최댓값보다 크면?\n        max_val = x    # → 최댓값 갱신!' },
                        { title: '결과 출력', desc: '순회가 끝나면 min_val, max_val이 정답!\nO(n) — 배열을 딱 한 번만 봅니다.', code: 'print(min_val, max_val)  # 공백 구분 출력' }
                    ],
                    cpp: [
                        { title: '입력 받기', desc: 'N과 N개의 정수를 입력받습니다.\nios::sync_with_stdio(false)로 빠른 입출력 설정!', code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];' },
                        { title: '초기값 설정', desc: '첫 번째 원소를 최솟값과 최댓값의 기준으로 삼습니다.', code: '    int minVal = nums[0], maxVal = nums[0];' },
                        { title: '순회하며 비교', desc: '두 번째 원소부터 끝까지 비교하며 갱신.\nif문 두 개로 최솟값/최댓값을 동시에 추적!', code: '    for (int i = 1; i < n; i++) {\n        if (nums[i] < minVal) minVal = nums[i];\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }' },
                        { title: '결과 출력', desc: 'O(n) 한 번 순회로 최솟값, 최댓값을 구했습니다.', code: '    cout << minVal << " " << maxVal << endl;\n    return 0;\n}' }
                    ]
                }
            }, {
                approach: '내장 함수',
                description: 'Python min()/max() 또는 C++ algorithm 라이브러리 활용',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                hints: [
                    { title: '더 간단한 방법이 있다!', content: '<div class="hint-key">💡 대부분의 언어에 최솟값/최댓값을 구하는 내장 함수가 있습니다!</div><span class="lang-py"><p>Python: <code>min()</code>과 <code>max()</code> — 리스트를 넣으면 바로 최솟값/최댓값을 반환합니다.</p></span><span class="lang-cpp"><p>C++: <code>*min_element()</code>과 <code>*max_element()</code> — <code>&lt;algorithm&gt;</code> 헤더에 있습니다.</p></span>' },
                    { title: '내부적으로 같은 원리!', content: '<p>내장 함수도 내부적으로는 배열을 한 번 순회하면서 비교합니다. 시간 복잡도는 동일하게 <strong>O(n)</strong>입니다.</p><p>직접 순회와 성능은 같지만, 코드가 훨씬 짧고 가독성이 좋습니다!</p>' }
                ],
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\n\n# min(), max() 내장 함수로 간단하게!\nprint(min(nums), max(nums))`,
                    cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n\n    // min_element, max_element로 간단하게!\n    cout << *min_element(nums.begin(), nums.end()) << " "\n         << *max_element(nums.begin(), nums.end()) << endl;\n    return 0;\n}`
                },
                codeSteps: {
                    python: [
                        { title: '입력 받기', desc: '이전 접근법과 동일하게 입력을 받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))' },
                        { title: '내장 함수로 바로 출력!', desc: 'min()은 리스트에서 최솟값, max()는 최댓값을 반환.\n내부적으로 O(n) 순회 — 직접 순회와 동일한 성능!', code: 'print(min(nums), max(nums))  # 한 줄로 끝!' }
                    ],
                    cpp: [
                        { title: '입력 받기', desc: '이전 접근법과 동일하게 입력을 받습니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>  // min_element, max_element\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];' },
                        { title: 'algorithm으로 바로 출력!', desc: 'min_element/max_element는 반복자를 반환 → *로 값을 꺼냄.\n내부적으로 O(n) 순회 — 직접 순회와 동일한 성능!', code: '    cout << *min_element(nums.begin(), nums.end()) << " "\n         << *max_element(nums.begin(), nums.end()) << endl;\n    return 0;\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-1',
            title: 'LeetCode 1 - Two Sum',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/two-sum/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수 배열 <code>nums</code>와 정수 <code>target</code>이 주어집니다.
                합이 <code>target</code>이 되는 <strong>두 수의 인덱스</strong>를 반환하세요.</p>
                <p>같은 원소를 두 번 사용할 수 없고, 정답은 정확히 하나 존재합니다.
                답은 어떤 순서로 반환해도 됩니다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [2,7,11,15], target = 9</pre></div>
                    <div><strong>출력</strong><pre>[0, 1]</pre></div>
                </div>
                <p class="example-explain">nums[0] + nums[1] = 2 + 7 = 9 이므로 [0, 1]을 반환합니다.</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [3,2,4], target = 6</pre></div>
                    <div><strong>출력</strong><pre>[1, 2]</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [3,3], target = 6</pre></div>
                    <div><strong>출력</strong><pre>[0, 1]</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>2 ≤ nums.length ≤ 10<sup>4</sup></li>
                    <li>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li>
                    <li>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></li>
                    <li>정답은 정확히 하나만 존재합니다.</li>
                </ul>

                <div class="hint-key">💡 Follow-up</div>
                <p>O(n²)보다 빠른 알고리즘을 만들 수 있을까요?</p>
            `,
            inputDefault: 0,
            solve() { return '[0, 1]'; },
            hints: [
                { title: '처음 생각: 이중 for문', content: '<div class="hint-key">💡 가장 단순한 방법: 모든 쌍을 전부 확인!</div><p>배열의 모든 두 수 조합을 하나씩 비교하면 됩니다.</p><span class="lang-py"><pre><code class="language-python">for i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n        if nums[i] + nums[j] == target:\n            return [i, j]</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">for (int i = 0; i < nums.size(); i++)\n    for (int j = i+1; j < nums.size(); j++)\n        if (nums[i] + nums[j] == target)\n            return {i, j};</code></pre></span>' },
                {
                    title: '직접 해보기 — 브루트포스로 얼마나 걸릴까?',
                    content: '<div class="hint-key">🔍 Brute Force로 직접 찾아보자!</div><div class="hint-sub">탭하면서 한 쌍씩 비교해보세요</div>',
                    viz: function(container) {
                        var nums = [1, 3, 4, 9, 2, 7], target = 9;
                        container.setAttribute('data-clickable', '');
                        container.innerHTML =
                            '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                            '<div class="hint-viz-cells"></div>' +
                            '<div class="hint-viz-msg"></div>' +
                            '<div class="hint-viz-tap">👆 탭하여 다음 비교</div>' +
                            '<div class="hint-viz-replay" style="display:none"><button>▶ 처음부터</button></div>';
                        var cellsEl = container.querySelector('.hint-viz-cells');
                        var msgEl = container.querySelector('.hint-viz-msg');
                        var tapEl = container.querySelector('.hint-viz-tap');
                        var replayEl = container.querySelector('.hint-viz-replay');
                        nums.forEach(function(v, i) {
                            var cell = document.createElement('div');
                            cell.className = 'hint-viz-cell';
                            cell.dataset.idx = i;
                            cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                            cellsEl.appendChild(cell);
                        });
                        function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                        function clearCells() {
                            cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                        }
                        var pairs = [];
                        for (var i = 0; i < nums.length; i++) {
                            for (var j = i + 1; j < nums.length; j++) {
                                pairs.push([i, j]);
                                if (nums[i] + nums[j] === target) { i = nums.length; break; }
                            }
                        }
                        var si = 0, done = false, timer = null;
                        function advance() {
                            if (done) return;
                            if (si >= pairs.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                            var pi = pairs[si][0], pj = pairs[si][1];
                            var sum = nums[pi] + nums[pj];
                            var isMatch = sum === target;
                            var c = si + 1;
                            clearCells();
                            getCell(pi).classList.add('comparing');
                            getCell(pj).classList.add('comparing');
                            msgEl.innerHTML = '<span style="color:var(--text3)">#' + c + '</span> i=' + pi + ', j=' + pj + ': <strong>' + nums[pi] + ' + ' + nums[pj] + ' = ' + sum + '</strong>';
                            clearTimeout(timer);
                            timer = setTimeout(function() {
                                if (isMatch) {
                                    getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                    getCell(pi).classList.add('matched'); getCell(pj).classList.add('matched');
                                    msgEl.innerHTML = '<span class="viz-result">✅ 정답! [' + pi + ', ' + pj + '] — ' + c + '번 비교</span>';
                                    done = true; tapEl.style.display = 'none'; replayEl.style.display = '';
                                } else {
                                    getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                    getCell(pi).classList.add('mismatch'); getCell(pj).classList.add('mismatch');
                                    msgEl.innerHTML += ' ❌';
                                }
                            }, 400);
                            si++;
                        }
                        function reset() {
                            clearTimeout(timer); si = 0; done = false;
                            clearCells(); msgEl.innerHTML = '';
                            tapEl.style.display = ''; replayEl.style.display = 'none';
                        }
                        container.addEventListener('click', function(e) {
                            if (e.target.closest('.hint-viz-replay')) return;
                            advance();
                        });
                        replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                        return {
                            stop: function() { clearTimeout(timer); },
                            reset: function() { reset(); },
                            play: function() {},
                            destroy: function() { clearTimeout(timer); }
                        };
                    }
                },
                { title: '문제 발견! 너무 느리다', content: '<p>n이 <strong>10,000</strong>이면 약 <strong>5천만 번</strong> 비교! 😱</p><p>매번 나머지 수를 전부 훑어야 하니 시간 초과가 발생합니다.</p><div class="hint-key">💡 "이미 본 수를 기억해둘 수 없을까?"</div><p>핵심 관찰: 숫자 하나를 볼 때마다 <strong>target - 그 수 = 짝꿍</strong>을 계산해서,<br>이미 본 수 중에 짝꿍이 있는지 <strong>해시맵으로 O(1)에 확인</strong>하면 끝!</p>' },
                {
                    title: '해시맵으로 한번에!',
                    content: '<div class="hint-key">✨ 해시맵으로 "짝꿍" 찾기</div><div class="hint-sub">각 수마다 짝꿍이 이미 나왔는지 즉시 확인!<br>브루트포스 15번 vs 해시맵 몇 번? 탭하며 비교!</div>',
                    viz: function(container) {
                        var nums = [1, 3, 4, 9, 2, 7], target = 9;
                        container.setAttribute('data-clickable', '');
                        container.innerHTML =
                            '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                            '<div class="hint-viz-split">' +
                            '  <div><div class="hint-viz-label" style="margin-bottom:4px">배열</div><div class="hint-viz-cells"></div></div>' +
                            '  <div><div class="hint-viz-label" style="margin-bottom:4px">seen { }</div><div class="hint-viz-hashmap"></div></div>' +
                            '</div>' +
                            '<div class="hint-viz-msg"></div>' +
                            '<div class="hint-viz-tap">👆 탭하여 다음 단계</div>' +
                            '<div class="hint-viz-replay" style="display:none"><button>▶ 처음부터</button></div>';
                        var cellsEl = container.querySelector('.hint-viz-cells');
                        var hmEl = container.querySelector('.hint-viz-hashmap');
                        var msgEl = container.querySelector('.hint-viz-msg');
                        var tapEl = container.querySelector('.hint-viz-tap');
                        var replayEl = container.querySelector('.hint-viz-replay');
                        nums.forEach(function(v, i) {
                            var cell = document.createElement('div');
                            cell.className = 'hint-viz-cell';
                            cell.dataset.idx = i;
                            cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                            cellsEl.appendChild(cell);
                        });
                        function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                        function clearCells() {
                            cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                        }
                        function addHmRow(key, val) {
                            var row = document.createElement('div');
                            row.className = 'hm-row';
                            row.dataset.key = key;
                            row.innerHTML = '<span class="hm-key">' + key + '</span><span class="hm-val">→ ' + val + '</span>';
                            hmEl.appendChild(row);
                        }
                        function clearHmHighlight() {
                            hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.remove('hm-found', 'hm-miss'); });
                        }
                        function highlightHmRow(key, found) {
                            clearHmHighlight();
                            if (found) {
                                var row = hmEl.querySelector('[data-key="' + key + '"]');
                                if (row) row.classList.add('hm-found');
                            } else {
                                hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.add('hm-miss'); });
                            }
                        }
                        var steps = [], seen = {}, foundI = -1, foundJ = -1;
                        for (var idx = 0; idx < nums.length; idx++) {
                            (function(i) {
                                var num = nums[i], comp = target - num;
                                if (seen.hasOwnProperty(comp)) {
                                    foundI = seen[comp]; foundJ = i;
                                    steps.push(function() {
                                        clearCells(); getCell(i).classList.add('current');
                                        highlightHmRow(comp, true);
                                        msgEl.innerHTML = '<strong>' + num + '</strong>의 짝꿍 = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 seen에서 찾는다… ✨ <strong>있다!</strong>';
                                    });
                                    steps.push(function() {
                                        clearHmHighlight();
                                        getCell(foundI).classList.add('matched');
                                        getCell(i).classList.remove('current'); getCell(i).classList.add('matched');
                                        msgEl.innerHTML = '<span class="viz-result">✅ 정답! [' + foundI + ', ' + i + '] — 딱 ' + (i + 1) + '번 보고 끝! (브루트포스는 15번)</span>';
                                    });
                                } else {
                                    steps.push(function() {
                                        clearCells(); getCell(i).classList.add('current');
                                        highlightHmRow(comp, false);
                                        msgEl.innerHTML = '<strong>' + num + '</strong>의 짝꿍 = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 seen에서 찾는다… 없음';
                                    });
                                    steps.push(function() {
                                        clearHmHighlight();
                                        addHmRow(num, i);
                                        msgEl.innerHTML = num + '을 seen에 기억해두자 → seen[' + num + '] = ' + i;
                                    });
                                    seen[num] = i;
                                }
                                if (foundJ >= 0) return;
                            })(idx);
                            if (foundJ >= 0) break;
                        }
                        var si = 0, done = false;
                        function advance() {
                            if (done) return;
                            if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                            steps[si]();
                            si++;
                            if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; }
                        }
                        function reset() {
                            si = 0; done = false;
                            clearCells(); hmEl.innerHTML = ''; msgEl.innerHTML = '';
                            tapEl.style.display = ''; replayEl.style.display = 'none';
                            steps = []; seen = {}; foundI = -1; foundJ = -1;
                            for (var idx2 = 0; idx2 < nums.length; idx2++) {
                                (function(i) {
                                    var num = nums[i], comp = target - num;
                                    if (seen.hasOwnProperty(comp)) {
                                        foundI = seen[comp]; foundJ = i;
                                        steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, true); msgEl.innerHTML = '<strong>' + num + '</strong>의 짝꿍 = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 seen에서 찾는다… ✨ <strong>있다!</strong>'; });
                                        steps.push(function() { clearHmHighlight(); getCell(foundI).classList.add('matched'); getCell(i).classList.remove('current'); getCell(i).classList.add('matched'); msgEl.innerHTML = '<span class="viz-result">✅ 정답! [' + foundI + ', ' + i + '] — 딱 ' + (i + 1) + '번 보고 끝! (브루트포스는 15번)</span>'; });
                                    } else {
                                        steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, false); msgEl.innerHTML = '<strong>' + num + '</strong>의 짝꿍 = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 seen에서 찾는다… 없음'; });
                                        steps.push(function() { clearHmHighlight(); addHmRow(num, i); msgEl.innerHTML = num + '을 seen에 기억해두자 → seen[' + num + '] = ' + i; });
                                        seen[num] = i;
                                    }
                                    if (foundJ >= 0) return;
                                })(idx2);
                                if (foundJ >= 0) break;
                            }
                        }
                        container.addEventListener('click', function(e) {
                            if (e.target.closest('.hint-viz-replay')) return;
                            advance();
                        });
                        replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                        return {
                            stop: function() {},
                            reset: function() { reset(); },
                            play: function() {},
                            destroy: function() {}
                        };
                    }
                }
            ],
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
};`
            },
            solutions: [{
                approach: '브루트포스',
                description: '이중 for문으로 모든 쌍을 확인하여 합이 target인 쌍을 찾는다',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                hints: [
                    { title: '처음 생각: 이중 for문', content: '<div class="hint-key">💡 가장 단순한 방법: 모든 쌍을 전부 확인!</div><p>배열의 모든 두 수 조합을 하나씩 비교하면 됩니다.</p><span class="lang-py"><pre><code class="language-python">for i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n        if nums[i] + nums[j] == target:\n            return [i, j]</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">for (int i = 0; i < nums.size(); i++)\n    for (int j = i+1; j < nums.size(); j++)\n        if (nums[i] + nums[j] == target)\n            return {i, j};</code></pre></span>' },
                    {
                        title: '직접 해보기',
                        content: '<div class="hint-key">🔍 Brute Force로 직접 찾아보자!</div><div class="hint-sub">탭하면서 한 쌍씩 비교해보세요</div>',
                        viz: function(container) {
                            var nums = [1, 3, 4, 9, 2, 7], target = 9;
                            container.setAttribute('data-clickable', '');
                            container.innerHTML =
                                '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                                '<div class="hint-viz-cells"></div>' +
                                '<div class="hint-viz-msg"></div>' +
                                '<div class="hint-viz-tap">👆 탭하여 다음 비교</div>' +
                                '<div class="hint-viz-replay" style="display:none"><button>▶ 처음부터</button></div>';
                            var cellsEl = container.querySelector('.hint-viz-cells');
                            var msgEl = container.querySelector('.hint-viz-msg');
                            var tapEl = container.querySelector('.hint-viz-tap');
                            var replayEl = container.querySelector('.hint-viz-replay');
                            nums.forEach(function(v, i) {
                                var cell = document.createElement('div');
                                cell.className = 'hint-viz-cell';
                                cell.dataset.idx = i;
                                cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                                cellsEl.appendChild(cell);
                            });
                            function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                            function clearCells() {
                                cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                            }
                            // 브루트포스 전 쌍 생성
                            var pairs = [];
                            for (var i = 0; i < nums.length; i++) {
                                for (var j = i + 1; j < nums.length; j++) {
                                    pairs.push([i, j]);
                                    if (nums[i] + nums[j] === target) { i = nums.length; break; }
                                }
                            }
                            var si = 0, done = false, timer = null;
                            function advance() {
                                if (done) return;
                                if (si >= pairs.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                                var pi = pairs[si][0], pj = pairs[si][1];
                                var sum = nums[pi] + nums[pj];
                                var isMatch = sum === target;
                                var c = si + 1;
                                // 비교: 노랑
                                clearCells();
                                getCell(pi).classList.add('comparing');
                                getCell(pj).classList.add('comparing');
                                msgEl.innerHTML = '<span style="color:var(--text3)">#' + c + '</span> i=' + pi + ', j=' + pj + ': <strong>' + nums[pi] + ' + ' + nums[pj] + ' = ' + sum + '</strong>';
                                // 잠깐 후 결과 표시
                                clearTimeout(timer);
                                timer = setTimeout(function() {
                                    if (isMatch) {
                                        getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                        getCell(pi).classList.add('matched'); getCell(pj).classList.add('matched');
                                        msgEl.innerHTML = '<span class="viz-result">✅ 정답! [' + pi + ', ' + pj + '] — ' + c + '번 비교</span>';
                                        done = true; tapEl.style.display = 'none'; replayEl.style.display = '';
                                    } else {
                                        getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                        getCell(pi).classList.add('mismatch'); getCell(pj).classList.add('mismatch');
                                        msgEl.innerHTML += ' ❌';
                                    }
                                }, 400);
                                si++;
                            }
                            function reset() {
                                clearTimeout(timer); si = 0; done = false;
                                clearCells(); msgEl.innerHTML = '';
                                tapEl.style.display = ''; replayEl.style.display = 'none';
                            }
                            container.addEventListener('click', function(e) {
                                if (e.target.closest('.hint-viz-replay')) return;
                                advance();
                            });
                            replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                            return {
                                stop: function() { clearTimeout(timer); },
                                reset: function() { reset(); },
                                play: function() {},
                                destroy: function() { clearTimeout(timer); }
                            };
                        }
                    }
                ],
                limitation: '<p>n이 <strong>10,000</strong>이면 약 <strong>5천만 번</strong> 비교! 😱</p><p>매번 나머지 수를 전부 훑어야 하니 시간 초과가 발생합니다.</p><div class="hint-key">💡 "이미 본 수를 기억해둘 수 없을까?"</div>',
                templates: {
                    python: `class Solution:\n    def twoSum(self, nums, target):\n        for i in range(len(nums)):\n            for j in range(i + 1, len(nums)):\n                if nums[i] + nums[j] == target:\n                    return [i, j]`,
                    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        for (int i = 0; i < nums.size(); i++) {\n            for (int j = i + 1; j < nums.size(); j++) {\n                if (nums[i] + nums[j] == target)\n                    return {i, j};\n            }\n        }\n        return {};\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: '첫 번째 수 선택', desc: '가능한 모든 쌍을 확인하기 위해\n첫 번째 수를 하나씩 고정합니다.', code: 'class Solution:\n    def twoSum(self, nums, target):\n        # 모든 쌍 (i, j) 확인 → O(n²)\n        for i in range(len(nums)):' },
                        { title: '두 번째 수 탐색', desc: 'i보다 뒤에 있는 수만 확인합니다.\nj = i+1부터 시작 → 같은 쌍을 두 번 확인하지 않음!', code: '            for j in range(i + 1, len(nums)):' },
                        { title: '합 확인 + 반환', desc: '두 수의 합이 target이면 인덱스를 즉시 반환!\n문제에서 "정확히 하나의 답이 있다"고 보장하므로 바로 return.', code: '                if nums[i] + nums[j] == target:\n                    return [i, j]' }
                    ],
                    cpp: [
                        { title: '첫 번째 수 선택', desc: '모든 쌍을 확인하기 위해 i를 고정합니다.\nO(n²)이지만 가장 직관적인 방법입니다.', code: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // 모든 쌍 (i, j) 확인 → O(n²)\n        for (int i = 0; i < nums.size(); i++) {' },
                        { title: '두 번째 수 탐색', desc: 'j = i+1부터 → 같은 쌍을 두 번 확인하지 않음', code: '            for (int j = i + 1; j < nums.size(); j++) {' },
                        { title: '합 확인 + 반환', desc: '합이 target이면 즉시 반환!', code: '                if (nums[i] + nums[j] == target)\n                    return {i, j};\n            }\n        }\n        return {};\n    }\n};' }
                    ]
                }
            }, {
                approach: '해시맵',
                description: '한 번 순회하면서 해시맵(딕셔너리)으로 complement를 확인',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                hints: [
                    { title: '핵심 아이디어: "짝꿍"을 기억하자!', content: '<div class="hint-key">💡 target - num = 짝꿍</div><p>숫자 하나를 볼 때마다 <strong>target - 그 수 = 짝꿍</strong>을 계산해서,<br>이미 본 수 중에 짝꿍이 있는지 <strong>해시맵으로 O(1)에 확인</strong>하면 끝!</p>' },
                    {
                        title: '해시맵으로 한번에!',
                        content: '<div class="hint-key">✨ 해시맵으로 "짝꿍" 찾기</div><div class="hint-sub">각 수마다 짝꿍이 이미 나왔는지 즉시 확인!<br>브루트포스 15번 vs 해시맵 몇 번? 탭하며 비교!</div>',
                        viz: function(container) {
                            var nums = [1, 3, 4, 9, 2, 7], target = 9;
                            container.setAttribute('data-clickable', '');
                            container.innerHTML =
                                '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                                '<div class="hint-viz-split">' +
                                '  <div><div class="hint-viz-label" style="margin-bottom:4px">배열</div><div class="hint-viz-cells"></div></div>' +
                                '  <div><div class="hint-viz-label" style="margin-bottom:4px">seen { }</div><div class="hint-viz-hashmap"></div></div>' +
                                '</div>' +
                                '<div class="hint-viz-msg"></div>' +
                                '<div class="hint-viz-tap">👆 탭하여 다음 단계</div>' +
                                '<div class="hint-viz-replay" style="display:none"><button>▶ 처음부터</button></div>';
                            var cellsEl = container.querySelector('.hint-viz-cells');
                            var hmEl = container.querySelector('.hint-viz-hashmap');
                            var msgEl = container.querySelector('.hint-viz-msg');
                            var tapEl = container.querySelector('.hint-viz-tap');
                            var replayEl = container.querySelector('.hint-viz-replay');
                            nums.forEach(function(v, i) {
                                var cell = document.createElement('div');
                                cell.className = 'hint-viz-cell';
                                cell.dataset.idx = i;
                                cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                                cellsEl.appendChild(cell);
                            });
                            function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                            function clearCells() {
                                cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                            }
                            function addHmRow(key, val) {
                                var row = document.createElement('div');
                                row.className = 'hm-row';
                                row.dataset.key = key;
                                row.innerHTML = '<span class="hm-key">' + key + '</span><span class="hm-val">→ ' + val + '</span>';
                                hmEl.appendChild(row);
                            }
                            function clearHmHighlight() {
                                hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.remove('hm-found', 'hm-miss'); });
                            }
                            function highlightHmRow(key, found) {
                                clearHmHighlight();
                                if (found) {
                                    var row = hmEl.querySelector('[data-key="' + key + '"]');
                                    if (row) row.classList.add('hm-found');
                                } else {
                                    hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.add('hm-miss'); });
                                }
                            }
                            // 스텝 미리 생성
                            var steps = [], seen = {}, foundI = -1, foundJ = -1;
                            for (var idx = 0; idx < nums.length; idx++) {
                                (function(i) {
                                    var num = nums[i], comp = target - num;
                                    if (seen.hasOwnProperty(comp)) {
                                        foundI = seen[comp]; foundJ = i;
                                        steps.push(function() {
                                            clearCells(); getCell(i).classList.add('current');
                                            highlightHmRow(comp, true);
                                            msgEl.innerHTML = '<strong>' + num + '</strong>의 짝꿍 = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 seen에서 찾는다… ✨ <strong>있다!</strong>';
                                        });
                                        steps.push(function() {
                                            clearHmHighlight();
                                            getCell(foundI).classList.add('matched');
                                            getCell(i).classList.remove('current'); getCell(i).classList.add('matched');
                                            msgEl.innerHTML = '<span class="viz-result">✅ 정답! [' + foundI + ', ' + i + '] — 딱 ' + (i + 1) + '번 보고 끝! (브루트포스는 15번)</span>';
                                        });
                                    } else {
                                        steps.push(function() {
                                            clearCells(); getCell(i).classList.add('current');
                                            highlightHmRow(comp, false);
                                            msgEl.innerHTML = '<strong>' + num + '</strong>의 짝꿍 = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 seen에서 찾는다… 없음';
                                        });
                                        steps.push(function() {
                                            clearHmHighlight();
                                            addHmRow(num, i);
                                            msgEl.innerHTML = num + '을 seen에 기억해두자 → seen[' + num + '] = ' + i;
                                        });
                                        seen[num] = i;
                                    }
                                    if (foundJ >= 0) return;
                                })(idx);
                                if (foundJ >= 0) break;
                            }
                            var si = 0, done = false;
                            function advance() {
                                if (done) return;
                                if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                                steps[si]();
                                si++;
                                if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; }
                            }
                            function reset() {
                                si = 0; done = false;
                                clearCells(); hmEl.innerHTML = ''; msgEl.innerHTML = '';
                                tapEl.style.display = ''; replayEl.style.display = 'none';
                                // 스텝 재생성 (seen 리셋)
                                steps = []; seen = {}; foundI = -1; foundJ = -1;
                                for (var idx2 = 0; idx2 < nums.length; idx2++) {
                                    (function(i) {
                                        var num = nums[i], comp = target - num;
                                        if (seen.hasOwnProperty(comp)) {
                                            foundI = seen[comp]; foundJ = i;
                                            steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, true); msgEl.innerHTML = '<strong>' + num + '</strong>의 짝꿍 = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 seen에서 찾는다… ✨ <strong>있다!</strong>'; });
                                            steps.push(function() { clearHmHighlight(); getCell(foundI).classList.add('matched'); getCell(i).classList.remove('current'); getCell(i).classList.add('matched'); msgEl.innerHTML = '<span class="viz-result">✅ 정답! [' + foundI + ', ' + i + '] — 딱 ' + (i + 1) + '번 보고 끝! (브루트포스는 15번)</span>'; });
                                        } else {
                                            steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, false); msgEl.innerHTML = '<strong>' + num + '</strong>의 짝꿍 = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 seen에서 찾는다… 없음'; });
                                            steps.push(function() { clearHmHighlight(); addHmRow(num, i); msgEl.innerHTML = num + '을 seen에 기억해두자 → seen[' + num + '] = ' + i; });
                                            seen[num] = i;
                                        }
                                        if (foundJ >= 0) return;
                                    })(idx2);
                                    if (foundJ >= 0) break;
                                }
                            }
                            container.addEventListener('click', function(e) {
                                if (e.target.closest('.hint-viz-replay')) return;
                                advance();
                            });
                            replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                            return {
                                stop: function() {},
                                reset: function() { reset(); },
                                play: function() {},
                                destroy: function() {}
                            };
                        }
                    }
                ],
                vizMethod: '_renderVizTwoSum',
                simIntro: '해시맵으로 짝꿍(complement)을 찾아가는 과정을 단계별로 확인해보세요!',
                comparison: '<p><strong>O(n²) → O(n)</strong> — 공간(해시맵)으로 시간을 절약!</p><p>브루트포스는 15번 비교했지만, 해시맵은 단 <strong>6번</strong>만에 답을 찾습니다.</p>',
                templates: {
                    python: `class Solution:\n    def twoSum(self, nums, target):\n        seen = {}  # 값 → 인덱스\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in seen:\n                return [seen[complement], i]\n            seen[num] = i`,
                    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: '해시맵 초기화', desc: '핵심 아이디어: "이 숫자 본 적 있나?"를 O(1)에 확인!\n딕셔너리에 {값: 인덱스}를 저장합니다.', code: 'class Solution:\n    def twoSum(self, nums, target):\n        seen = {}  # {값: 인덱스} → O(1) 조회' },
                        { title: '배열 순회', desc: 'enumerate로 인덱스(i)와 값(num)을 동시에 가져옵니다.', code: '        for i, num in enumerate(nums):' },
                        { title: 'complement 계산 + 확인', desc: '핵심: target - num = "짝꿍"!\n이 짝꿍이 이미 seen에 있다면 → 정답 발견!\n해시맵 조회는 O(1)이므로 전체 O(n).', code: '            complement = target - num  # 짝꿍 계산\n            if complement in seen:      # O(1) 조회!\n                return [seen[complement], i]' },
                        { title: '현재 값 저장', desc: '짝을 못 찾았으면 현재 값을 기록해둡니다.\n→ 뒤에 올 숫자가 이 값을 짝꿍으로 찾을 수 있음!', code: '            seen[num] = i  # 나중에 짝꿍으로 찾아질 수 있도록 저장' }
                    ],
                    cpp: [
                        { title: '해시맵 초기화', desc: 'unordered_map → O(1) 조회!\n{값: 인덱스}를 저장하여 짝꿍을 빠르게 찾습니다.', code: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen; // {값: 인덱스}' },
                        { title: '배열 순회', desc: 'for문으로 인덱스와 값을 순회합니다.', code: '        for (int i = 0; i < nums.size(); i++) {' },
                        { title: 'complement 계산 + 확인', desc: '핵심: target - nums[i] = 짝꿍!\nseen에 짝꿍이 있으면 정답 반환 (O(1) 조회).', code: '            int comp = target - nums[i]; // 짝꿍\n            if (seen.count(comp)) return {seen[comp], i};' },
                        { title: '현재 값 저장 + 마무리', desc: '못 찾으면 현재 값을 기록 → 뒤의 숫자가 찾을 수 있음', code: '            seen[nums[i]] = i; // 나중에 찾아질 수 있도록 저장\n        }\n        return {};\n    }\n};' }
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
                <p>주식 가격 배열 <code>prices</code>가 주어집니다.
                <code>prices[i]</code>는 i번째 날의 주가입니다.</p>
                <p>한 번 사고 한 번 팔아서 얻을 수 있는 <strong>최대 이익</strong>을 반환하세요.
                이익을 낼 수 없으면 <code>0</code>을 반환합니다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>prices = [7,1,5,3,6,4]</pre></div>
                    <div><strong>출력</strong><pre>5</pre></div>
                </div>
                <p class="example-explain">1일에 사서(가격 1) 4일에 팔면(가격 6) 이익 = 6 - 1 = 5</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>prices = [7,6,4,3,1]</pre></div>
                    <div><strong>출력</strong><pre>0</pre></div>
                </div>
                <p class="example-explain">가격이 계속 하락하므로 이익을 낼 수 없습니다.</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ prices.length ≤ 10⁵</li>
                    <li>0 ≤ prices[i] ≤ 10⁴</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>배열을 한 번만 순회하면서 풀 수 있을까요?</p>
            `,
            hints: [
                { title: '처음 생각: 어떻게 풀까?', content: '어떤 날 사서 그 뒤의 어떤 날 팔아야 합니다. 가장 단순한 방법은? 모든 (매수일, 매도일) 조합을 확인하는 이중 for문입니다!<br><code>profit = prices[j] - prices[i]</code> (j &gt; i)의 최댓값을 구하면 됩니다.' },
                { title: '한번 해볼까?', content: '<code>prices = [7, 1, 5, 3, 6, 4]</code>로 해볼게요:<br>• 7에 사면? → 1(-6), 5(-2), 3(-4), 6(-1), 4(-3) → 전부 손해!<br>• 1에 사면? → 5(+4), 3(+2), 6(<strong>+5</strong>), 4(+3) → 최대 +5!<br>• 나머지도 확인... 결국 1에 사서 6에 파는 게 최고입니다.' },
                { title: '문제 발견!', content: '이중 for문은 <strong>O(n²)</strong>입니다. n이 100,000이면 약 50억 번 연산!<div style="display:flex;gap:14px;margin:14px 0;align-items:end;justify-content:center;"><div style="text-align:center;"><div style="background:#ff6b6b;width:52px;height:90px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;color:white;font-size:0.8rem;font-weight:700;">O(n²)</div><div style="font-size:0.75rem;margin-top:4px;color:var(--text3);">이중 for</div></div><div style="text-align:center;"><div style="background:#51cf66;width:52px;height:18px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:4px;color:white;font-size:0.8rem;font-weight:700;">O(n)</div><div style="font-size:0.75rem;margin-top:4px;color:var(--text3);">한 번 순회</div></div></div>핵심 관찰: 어떤 날에 팔 때, 가장 이익이 큰 경우는 <strong>"그 날 이전까지의 최저값에 산 경우"</strong>입니다.<br>그러면 순회하면서 지금까지의 최저값만 기억해두면 되지 않을까?' },
                { title: '더 좋은 방법 발견!', content: '배열을 <strong>한 번만</strong> 순회하면서:<br>• <code>min_price</code>: 순회하면서 지금까지의 최저값을 추적<br>• <code>max_profit</code>: 지금까지의 최대 이익을 추적<br><br>각 날에 <code>price - min_price</code>가 현재 최대 이익보다 크면 갱신합니다.' },
                { title: '핵심 아이디어 정리', content: '변수 2개만으로 해결하는 "상태 추적" 패턴:<br>① <code>min_price = min(min_price, price)</code> — 지금까지의 최저값 갱신<br>② <code>max_profit = max(max_profit, price - min_price)</code> — 최대 이익 갱신<br><br><strong>O(n²) → O(n) 시간, O(1) 공간</strong> — 추가 자료구조 없이 변수만으로 해결!' }
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
};`
            },
            solutions: [{
                approach: '브루트포스',
                description: '이중 for문으로 모든 (매수일, 매도일) 조합을 확인',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def maxProfit(self, prices):\n        max_profit = 0\n        for i in range(len(prices)):\n            for j in range(i + 1, len(prices)):\n                profit = prices[j] - prices[i]\n                max_profit = max(max_profit, profit)\n        return max_profit`,
                    cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int maxP = 0;\n        for (int i = 0; i < prices.size(); i++) {\n            for (int j = i + 1; j < prices.size(); j++) {\n                maxP = max(maxP, prices[j] - prices[i]);\n            }\n        }\n        return maxP;\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: '최대 이익 초기화', desc: '이익을 낼 수 없는 경우를 대비해 0으로 시작.\n문제에서 "이익 없으면 0 반환"이라고 했으므로!', code: 'class Solution:\n    def maxProfit(self, prices):\n        max_profit = 0  # 이익 없으면 0 반환' },
                        { title: '매수일 선택', desc: 'i번째 날에 사는 경우를 하나씩 시도합니다.\n모든 날을 매수일로 고려합니다.', code: '        for i in range(len(prices)):' },
                        { title: '매도일 탐색', desc: '매수일 이후의 날에만 팔 수 있으므로 j = i+1부터.\n과거로 돌아가서 팔 수 없습니다!', code: '            for j in range(i + 1, len(prices)):' },
                        { title: '이익 계산 + 최대값 갱신', desc: '(판매가 - 구매가)를 계산하고, 최대 이익을 갱신.\nO(n²) — 모든 쌍을 확인하므로 느림', code: '                profit = prices[j] - prices[i]\n                max_profit = max(max_profit, profit)\n        return max_profit' }
                    ],
                    cpp: [
                        { title: '초기화', desc: '이익 없으면 0 반환을 위해 0으로 시작', code: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int maxP = 0; // 이익 없으면 0' },
                        { title: '이중 for문', desc: '모든 (매수일 i, 매도일 j) 조합을 확인.\nj = i+1 → 과거에 팔 수 없으므로', code: '        for (int i = 0; i < prices.size(); i++) {\n            for (int j = i + 1; j < prices.size(); j++) {' },
                        { title: '이익 계산 + 반환', desc: '판매가 - 구매가의 최대값을 갱신하고 반환', code: '                maxP = max(maxP, prices[j] - prices[i]);\n            }\n        }\n        return maxP;\n    }\n};' }
                    ]
                }
            }, {
                approach: '한 번 순회',
                description: '최솟값을 추적하면서 현재 가격과의 차이로 최대 이익을 계산',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def maxProfit(self, prices):\n        min_price = float('inf')\n        max_profit = 0\n        for price in prices:\n            min_price = min(min_price, price)\n            max_profit = max(max_profit, price - min_price)\n        return max_profit`,
                    cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: '변수 초기화', desc: '핵심 아이디어: "지금까지 가장 싼 날"을 기억하자!\nmin_price = ∞ → 어떤 가격이든 처음에 갱신됨.\nmax_profit = 0 → 이익 없으면 0 반환.', code: 'class Solution:\n    def maxProfit(self, prices):\n        min_price = float(\'inf\')  # 지금까지 본 최저가\n        max_profit = 0             # 최대 이익' },
                        { title: '가격 순회', desc: '한 번의 순회로 해결! O(n)\n각 날의 가격을 "오늘 팔면 얼마 벌지?"로 판단합니다.', code: '        for price in prices:' },
                        { title: '최솟값 갱신', desc: '오늘 가격이 지금까지 최저가보다 싸면 갱신.\n→ 이후의 날들이 이 가격에 사서 팔 수 있음!', code: '            min_price = min(min_price, price)  # 최저가 갱신' },
                        { title: '이익 계산', desc: '핵심: "오늘 판다면?" → price - min_price\n이 값이 지금까지 최대 이익보다 크면 갱신합니다.', code: '            max_profit = max(max_profit, price - min_price)  # 오늘 팔면?' },
                        { title: '결과 반환', desc: '한 번 순회만으로 최대 이익을 찾았습니다!\nO(n) 시간, O(1) 공간 — 최적 풀이.', code: '        return max_profit' }
                    ],
                    cpp: [
                        { title: '변수 초기화', desc: '핵심: "지금까지 가장 싼 날"을 기억!\nINT_MAX → 어떤 가격이든 처음에 갱신됨.', code: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0; // 최저가, 최대이익' },
                        { title: '순회 + 최솟값 갱신', desc: '각 가격에서 최저가를 갱신.\n→ 이후의 날들이 이 가격에 사서 팔 수 있음', code: '        for (int p : prices) {\n            minP = min(minP, p); // 최저가 갱신' },
                        { title: '이익 계산 + 결과', desc: '"오늘 판다면?" → p - minP\nO(n) 한 번 순회로 최적 해를 구합니다.', code: '            maxP = max(maxP, p - minP); // 오늘 팔면?\n        }\n        return maxP;\n    }\n};' }
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
                <p>N개의 수로 이루어진 수열에서,
                <strong>연속된 수들의 부분합</strong> 중 합이 M이 되는 경우의 수를 구하세요.</p>
                <h4>입력</h4>
                <p>첫째 줄에 N(1 &le; N &le; 10,000), M(1 &le; M &le; 300,000,000)이 주어진다. 다음 줄에는 A[1], A[2], ..., A[N]이 공백으로 분리되어 주어진다. 각각의 A[x]는 30,000을 넘지 않는 자연수이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 경우의 수를 출력한다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>N = 4, M = 2
수열 = [1, 1, 1, 1]</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">[1,1](인덱스 0~1), [1,1](1~2), [1,1](2~3) → 총 3가지</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>N = 10, M = 5
수열 = [1, 2, 3, 4, 2, 5, 3, 1, 1, 2]</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">[2,3](인덱스 1~2), [3,2](3~4), [5](5) → 총 3가지</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 10,000</li>
                    <li>1 ≤ M ≤ 300,000,000</li>
                    <li>수열의 각 원소는 자연수 (≥ 1)</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>O(n²)보다 빠르게 풀 수 있을까요? (투 포인터/슬라이딩 윈도우)</p>
            `,
            hints: [
                {
                    title: '연속된 부분합이 뭐야?',
                    content: `<strong>"연속된 수들의 합"</strong>이 핵심이에요. 아무 수나 골라 더하는 게 아니라, <strong>붙어있는 수들</strong>만 더할 수 있어요!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:16px 0;">
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i>=1&&i<=2?'#6c5ce7':'#dfe6e9'};color:${i>=1&&i<=2?'white':'#636e72'};border-radius:8px;font-weight:700;font-size:1.1em;">${v}</span>`).join('')}
                        </div>
                        <div style="font-weight:600;">[2, 3] → 합 = <strong style="color:var(--green);">5</strong> ✅ 연속이니까 OK!</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:12px 0;padding:12px;background:rgba(255,118,117,0.08);border-radius:10px;">
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i===0||i===3?'#e17055':'#dfe6e9'};color:${i===0||i===3?'white':'#636e72'};border-radius:8px;font-weight:700;font-size:1.1em;">${v}</span>`).join('')}
                        </div>
                        <div style="color:#e17055;font-weight:600;">[1, 4] → 합 = 5이지만 ❌ 떨어져 있어서 안 돼요!</div>
                    </div>
                    <p style="margin-top:16px;padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">이런 연속 구간을 전부 확인해서, 합이 M인 것을 세면 돼요! 🤔<br>그럼 어떻게 모든 연속 구간을 확인할까요?</p>`
                },
                {
                    title: '가장 쉬운 방법: 다 해보기!',
                    content: `모든 시작점에서 하나씩 늘려가며 합을 구하면 돼요.<br>왜? <strong>연속이니까 시작점만 정하면 끝점을 하나씩 늘리면서 합을 확인</strong>할 수 있거든요!
                    <div style="margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;font-size:0.9em;line-height:1.8;border:1px solid var(--bg3);">
                        <code>[1, 2, 3, 4, 2]</code>, M=5 일 때:<br>
                        • i=0부터: [1]=1, [1,2]=3, [1,2,3]=6... 5 못 찾음<br>
                        • i=1부터: [2]=2, [<strong>2,3</strong>]=<strong style="color:var(--green);">5 ✅</strong><br>
                        • i=2부터: [3]=3, [3,4]=7... 못 찾음<br>
                        • i=3부터: [4]=4, [<strong>4,2</strong>... 아 6이네] 못 찾음<br>
                        • 아 아까 못 봤는데 [5] 혼자서도 5! → i=4에서 아 아 아닌데 위에 빠진 게 있을 수도..
                    </div>
                    <p style="margin-top:10px;">이렇게 <strong>이중 for문</strong>으로 가능해요. 그런데...</p>
                    <p style="margin-top:8px;padding:10px 14px;background:rgba(255,118,117,0.1);border-radius:8px;font-size:0.92em;color:#e17055;">⏱ 시간복잡도가 <strong>O(n²)</strong>! N이 10,000이면 1억번 계산... 느릴 수 있어요!</p>`
                },
                {
                    title: '핵심 관찰: 윈도우를 밀어보자!',
                    content: `잠깐, 구간을 한 칸 오른쪽으로 밀면 어떻게 될까요?
                    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin:14px 0;">
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i>=0&&i<=2?'var(--yellow)':'#dfe6e9'};color:${i>=0&&i<=2?'var(--text)':'#636e72'};border-radius:8px;font-weight:700;">${v}</span>`).join('')}
                        </div>
                        <div>[1,2,3] 합 = 6</div>
                        <div style="font-size:1.5em;">⬇️ 한 칸 밀면?</div>
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i>=1&&i<=3?'var(--yellow)':'#dfe6e9'};color:${i>=1&&i<=3?'var(--text)':'#636e72'};border-radius:8px;font-weight:700;">${v}</span>`).join('')}
                        </div>
                        <div>[2,3,4] 합 = 6 - <strong style="color:#e17055;">1</strong> + <strong style="color:var(--green);">4</strong> = 9</div>
                    </div>
                    <p style="margin-top:10px;padding:12px 14px;background:rgba(0,184,148,0.1);border-radius:8px;">💡 <strong>매번 처음부터 다시 더할 필요 없어요!</strong><br>앞에 빠지는 수는 빼고, 뒤에 들어오는 수만 더하면 돼요.<br>이게 바로 <strong>"슬라이딩 윈도우"</strong> 아이디어예요!</p>`
                },
                {
                    title: '투 포인터로 똑똑하게!',
                    content: `start와 end 두 포인터로 윈도우 크기를 조절해요!
                    <div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:10px;font-size:0.93em;line-height:2;border:1px solid var(--bg3);">
                        📌 <strong>합이 M보다 작으면</strong> → end를 오른쪽으로 (수를 더 넣어서 합 키우기)<br>
                        📌 <strong>합이 M 이상이면</strong> → start를 오른쪽으로 (앞에서 빼서 합 줄이기)<br>
                        📌 <strong>합이 딱 M이면</strong> → 찾았다! count++
                    </div>
                    <p style="margin-top:10px;">왜 이게 되냐면? 수가 전부 <strong>자연수(1 이상)</strong>이기 때문이에요!<br>수를 더하면 합이 커지고, 빼면 작아진다는 게 보장돼요.</p>
                    <p style="margin-top:12px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;">⏱ start와 end 각각 최대 N번만 이동 → <strong>O(n)</strong>!<br>O(n²)에서 O(n)으로, 엄청난 개선이에요 💪</p>
                    <p style="margin-top:8px;font-size:0.88em;color:var(--text3);">📝 시뮬레이션 탭에서 직접 윈도우가 밀리는 과정을 확인해보세요!</p>`
                }
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
                cpp: `#include <iostream>
#include <vector>
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
}`
            },
            solutions: [{
                approach: '브루트포스',
                description: '이중 for문으로 모든 연속 부분합을 확인',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\ncount = 0\nfor i in range(N):\n    total = 0\n    for j in range(i, N):\n        total += arr[j]\n        if total == M:\n            count += 1\n\nprint(count)`,
                    cpp: `#include <iostream>
#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int cnt = 0;\n    for (int i = 0; i < N; i++) {\n        int total = 0;\n        for (int j = i; j < N; j++) {\n            total += arr[j];\n            if (total == M) cnt++;\n        }\n    }\n    printf("%d\\n", cnt);\n}`
                },
                codeSteps: {
                    python: [
                        { title: '입력 + 초기화', desc: 'N, M과 배열을 읽고 카운트를 0으로 초기화.\nsys.stdin.readline → 입력이 많을 때 빠름.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\ncount = 0' },
                        { title: '시작점 순회', desc: 'i번째 원소부터 시작하는 연속 부분합을 확인.\n각 시작점마다 total을 0으로 리셋합니다.', code: 'for i in range(N):\n    total = 0  # 새 시작점마다 합 리셋' },
                        { title: '끝점 확장 + 합 확인', desc: 'j를 i부터 끝까지 확장하며 누적합을 계산.\nO(n²) — 모든 연속 구간을 다 확인합니다.', code: '    for j in range(i, N):\n        total += arr[j]       # 구간 [i..j] 합\n        if total == M:\n            count += 1' },
                        { title: '결과 출력', desc: '합이 M인 연속 부분 구간의 개수를 출력.', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: '입력 + 초기화', desc: 'N, M과 배열을 입력받고 카운트 초기화.', code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int cnt = 0;' },
                        { title: '이중 for문으로 부분합 확인', desc: '모든 시작점 i에서 끝점 j까지 누적합 계산.\ntotal을 계속 더해가므로 내부 루프에서 O(1)에 갱신.', code: '    for (int i = 0; i < N; i++) {\n        int total = 0; // 새 시작점마다 리셋\n        for (int j = i; j < N; j++) {\n            total += arr[j]; // 구간 [i..j] 합\n            if (total == M) cnt++;\n        }\n    }' },
                        { title: '결과 출력', desc: '합이 M인 연속 구간의 개수를 출력.', code: '    printf("%d\\n", cnt);\n}' }
                    ]
                }
            }, {
                approach: '투 포인터',
                description: '두 포인터로 구간 합을 유지하면서 M인 경우를 찾는다',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\nstart, end = 0, 0\ncurrent_sum = 0\ncount = 0\n\nwhile True:\n    if current_sum >= M:\n        current_sum -= arr[start]\n        start += 1\n    elif end >= N:\n        break\n    else:\n        current_sum += arr[end]\n        end += 1\n\n    if current_sum == M:\n        count += 1\n\nprint(count)`,
                    cpp: `#include <iostream>
#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int s = 0, e = 0, sum = 0, cnt = 0;\n    while (true) {\n        if (sum >= M) sum -= arr[s++];\n        else if (e >= N) break;\n        else sum += arr[e++];\n        if (sum == M) cnt++;\n    }\n    printf("%d\\n", cnt);\n}`
                },
                codeSteps: {
                    python: [
                        { title: '입력 + 포인터 초기화', desc: '핵심 아이디어: start, end 두 포인터로 구간을 조절!\n구간 합이 작으면 end 확장, 크면 start 축소.\nO(n) — 각 포인터가 최대 N번만 이동하므로.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\nstart, end = 0, 0    # 구간 [start, end)\ncurrent_sum = 0       # 현재 구간 합\ncount = 0' },
                        { title: '메인 루프: 구간 조절', desc: '합 ≥ M → 구간이 너무 크다 → start를 빼고 전진.\nend가 끝이면 종료.\n합 < M → 구간이 부족 → end를 더하고 확장.', code: 'while True:\n    if current_sum >= M:\n        current_sum -= arr[start]  # start 원소 빼기\n        start += 1                 # 구간 축소\n    elif end >= N:\n        break                      # 더 확장 불가 → 종료\n    else:\n        current_sum += arr[end]    # end 원소 추가\n        end += 1                   # 구간 확장' },
                        { title: '합 확인', desc: '구간 조절 후 현재 합이 정확히 M이면 카운트!\nif문이 매 반복마다 실행됩니다.', code: '    if current_sum == M:\n        count += 1  # 합이 M인 구간 발견!' },
                        { title: '결과 출력', desc: 'O(n) 한 번 순회로 모든 구간을 찾았습니다.\nstart, end 각각 최대 N번 이동 → O(2N) = O(n).', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: '입력 + 포인터 초기화', desc: '두 포인터 s, e로 구간 [s, e)을 관리.\n합이 작으면 e 확장, 크면 s 축소 → O(n).', code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int s = 0, e = 0, sum = 0, cnt = 0; // 구간 [s, e)' },
                        { title: '메인 루프 + 합 확인', desc: '합 ≥ M → s 빼고 전진 (구간 축소).\ne가 끝이면 종료.\n합 < M → e 더하고 확장.\n매 반복 합 == M 확인.', code: '    while (true) {\n        if (sum >= M) sum -= arr[s++];     // 구간 축소\n        else if (e >= N) break;            // 종료\n        else sum += arr[e++];              // 구간 확장\n        if (sum == M) cnt++;               // 합이 M!\n    }' },
                        { title: '결과 출력', desc: 'O(n) — s와 e 각각 최대 N번만 이동.', code: '    printf("%d\\n", cnt);\n}' }
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
                <p>정수 배열 <code>nums</code>에서 합이 <code>0</code>이 되는
                <strong>세 수의 조합</strong>을 모두 찾으세요.</p>
                <p>중복되는 조합은 제거해야 합니다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [-1,0,1,2,-1,-4]</pre></div>
                    <div><strong>출력</strong><pre>[[-1,-1,2],[-1,0,1]]</pre></div>
                </div>
                <p class="example-explain">(-1)+(-1)+2 = 0, (-1)+0+1 = 0</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [0,1,1]</pre></div>
                    <div><strong>출력</strong><pre>[]</pre></div>
                </div>
                <p class="example-explain">합이 0이 되는 세 수 조합이 없습니다.</p>
                </div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [0,0,0]</pre></div>
                    <div><strong>출력</strong><pre>[[0,0,0]]</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>3 ≤ nums.length ≤ 3000</li>
                    <li>-10⁵ ≤ nums[i] ≤ 10⁵</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>O(n³)보다 빠르게 풀 수 있을까요?</p>
            `,
            hints: [
                { title: '처음 생각: 어떻게 풀까?', content: '세 수의 합이 0이 되는 조합을 모두 찾아야 합니다. 가장 단순한 방법은? 삼중 for문으로 모든 세 수 조합을 확인하는 것!<br><code>if nums[i] + nums[j] + nums[k] == 0</code>이면 결과에 추가합니다.' },
                { title: '한번 해볼까?', content: '<code>nums = [-1, 0, 1, 2, -1, -4]</code>로 해볼게요:<br>• (-1)+0+1=0 ✅, (-1)+2+(-1)=0 ✅, 0+1+(-1)=0 → 이건 위와 같은 조합!<br><br>중복이 생깁니다! [-1, 0, 1]이 여러 번 나올 수 있어요. Set을 써서 중복을 제거할 수 있지만... 삼중 for문 자체가 너무 느립니다.' },
                { title: '문제 발견!', content: '삼중 for문은 <strong>O(n³)</strong>입니다! n이 3,000이면 270억 번 연산! 😱<br><br><strong>핵심 질문:</strong> 배열을 정렬하면 뭐가 좋아질까?<br>정렬하면 ① 중복 건너뛰기가 쉬워지고 ② 두 수를 고르는 데 <strong>투 포인터</strong>를 쓸 수 있습니다!' },
                { title: '더 좋은 방법 발견!', content: '정렬 후 <strong>하나를 고정</strong>하고, 나머지 두 수를 <strong>투 포인터</strong>로 찾습니다!<div style="display:flex;gap:4px;align-items:center;margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;justify-content:center;flex-wrap:wrap;"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#e17055;color:white;border-radius:8px;font-weight:700;font-size:0.9em;">-4</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#fdcb6e;color:#2d3436;border-radius:8px;font-weight:700;font-size:0.9em;box-shadow:0 0 0 2px #e17055;">-1</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:0.9em;box-shadow:0 0 0 2px #00b894;">-1</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#dfe6e9;color:#636e72;border-radius:8px;font-weight:700;font-size:0.9em;">0</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#dfe6e9;color:#636e72;border-radius:8px;font-weight:700;font-size:0.9em;">1</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:0.9em;box-shadow:0 0 0 2px #00b894;">2</span></div><div style="display:flex;justify-content:center;gap:12px;margin-bottom:8px;font-size:0.85em;"><span style="color:#e17055;font-weight:600;">i(고정)</span><span style="color:#00b894;font-weight:600;">L→ ←R (투 포인터)</span></div>• i를 고정 → left=i+1, right=끝<br>• 세 수의 합이 0보다 작으면 left++, 크면 right--<br><br>이렇게 하면 O(n) × O(n) = <strong>O(n²)</strong>!' },
                { title: '핵심 아이디어 정리', content: '① 배열을 정렬합니다 — O(n log n)<br>② i를 0부터 순회하며, <code>nums[i] == nums[i-1]</code>이면 건너뜁니다 (중복 제거)<br>③ left=i+1, right=끝으로 투 포인터 탐색<br>④ 합이 0이면 결과 추가 + left/right 중복도 건너뜀<br><br><strong>O(n³) → O(n²)</strong>으로 개선! 정렬이 핵심입니다.' }
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
};`
            },
            solutions: [{
                approach: '브루트포스',
                description: '삼중 for문으로 모든 세 수 조합을 확인하고 Set으로 중복 제거',
                timeComplexity: 'O(n³)',
                spaceComplexity: 'O(n)',
                templates: {
                    python: `class Solution:\n    def threeSum(self, nums):\n        result = set()\n        n = len(nums)\n        for i in range(n):\n            for j in range(i + 1, n):\n                for k in range(j + 1, n):\n                    if nums[i] + nums[j] + nums[k] == 0:\n                        triplet = tuple(sorted([nums[i], nums[j], nums[k]]))\n                        result.add(triplet)\n        return [list(t) for t in result]`,
                    cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        set<vector<int>> resultSet;\n        int n = nums.size();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                for (int k = j + 1; k < n; k++) {\n                    if (nums[i] + nums[j] + nums[k] == 0) {\n                        vector<int> triplet = {nums[i], nums[j], nums[k]};\n                        sort(triplet.begin(), triplet.end());\n                        resultSet.insert(triplet);\n                    }\n                }\n            }\n        }\n        return vector<vector<int>>(resultSet.begin(), resultSet.end());\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: '결과 Set 초기화', desc: '중복 조합 방지를 위해 set 사용.\n[-1,0,1]과 [0,-1,1]은 같은 조합 → 정렬 후 set에 넣으면 중복 제거!', code: 'class Solution:\n    def threeSum(self, nums):\n        result = set()  # 중복 조합 자동 제거\n        n = len(nums)' },
                        { title: '삼중 for문', desc: '모든 (i, j, k) 조합을 하나씩 확인.\nO(n³) — 가장 직관적이지만 느린 방법.', code: '        for i in range(n):\n            for j in range(i + 1, n):\n                for k in range(j + 1, n):' },
                        { title: '합 확인 + 중복 제거', desc: '합이 0이면 정렬된 튜플로 set에 추가.\nsorted → 순서 무관하게 같은 조합이면 같은 튜플!', code: '                    if nums[i] + nums[j] + nums[k] == 0:\n                        triplet = tuple(sorted([nums[i], nums[j], nums[k]]))\n                        result.add(triplet)  # set이므로 중복 자동 제거' },
                        { title: '결과 변환', desc: 'set의 튜플들을 리스트로 변환하여 반환.', code: '        return [list(t) for t in result]' }
                    ],
                    cpp: [
                        { title: 'Set 초기화', desc: '중복 제거를 위해 set<vector<int>> 사용.\n정렬된 vector를 넣으면 동일 조합 자동 제거.', code: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        set<vector<int>> resultSet; // 중복 제거\n        int n = nums.size();' },
                        { title: '삼중 for문 + 합 확인', desc: '모든 (i,j,k) 조합을 확인 → O(n³).\n합이 0이면 정렬 후 set에 삽입.', code: '        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                for (int k = j + 1; k < n; k++) {\n                    if (nums[i] + nums[j] + nums[k] == 0) {\n                        vector<int> triplet = {nums[i], nums[j], nums[k]};\n                        sort(triplet.begin(), triplet.end());\n                        resultSet.insert(triplet);\n                    }\n                }\n            }\n        }' },
                        { title: '결과 반환', desc: 'set → vector로 변환하여 반환.', code: '        return vector<vector<int>>(resultSet.begin(), resultSet.end());\n    }\n};' }
                    ]
                }
            }, {
                approach: '정렬 + 투 포인터',
                description: '정렬 후 하나를 고정하고, 나머지 두 수를 투 포인터로 탐색',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def threeSum(self, nums):\n        nums.sort()\n        result = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:\n                continue\n            left, right = i + 1, len(nums) - 1\n            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s == 0:\n                    result.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]: left += 1\n                    while left < right and nums[right] == nums[right - 1]: right -= 1\n                    left += 1; right -= 1\n                elif s < 0:\n                    left += 1\n                else:\n                    right -= 1\n        return result`,
                    cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: '정렬', desc: '핵심: 정렬하면 투 포인터를 쓸 수 있다!\n정렬된 배열에서 합이 작으면 left↑, 크면 right↓로 좁히기.', code: 'class Solution:\n    def threeSum(self, nums):\n        nums.sort()  # 정렬 → 투 포인터 사용 가능!\n        result = []' },
                        { title: '첫 번째 수 고정 + 중복 건너뛰기', desc: 'i를 하나 고정하고 나머지 두 수를 투 포인터로 찾습니다.\n같은 값의 i를 건너뛰어야 중복 조합 방지!', code: '        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:  # 중복 건너뛰기\n                continue' },
                        { title: '투 포인터 설정', desc: 'left = i 바로 다음, right = 배열 끝.\n이 두 포인터가 서로 만날 때까지 좁혀갑니다.', code: '            left, right = i + 1, len(nums) - 1' },
                        { title: '합 비교 + 포인터 이동', desc: '합 == 0 → 정답! 결과에 추가 후 중복 건너뛰기.\n합 < 0 → 더 큰 값 필요 → left++\n합 > 0 → 더 작은 값 필요 → right--', code: '            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s == 0:\n                    result.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]: left += 1\n                    while left < right and nums[right] == nums[right - 1]: right -= 1\n                    left += 1; right -= 1\n                elif s < 0:   # 합이 작다 → left 오른쪽으로\n                    left += 1\n                else:          # 합이 크다 → right 왼쪽으로\n                    right -= 1' },
                        { title: '결과 반환', desc: 'O(n²) — 정렬 O(n log n) + 각 i에 투 포인터 O(n)\nO(n³) 브루트포스보다 훨씬 빠릅니다!', code: '        return result' }
                    ],
                    cpp: [
                        { title: '정렬 + 초기화', desc: '정렬하면 투 포인터 사용 가능!\n합이 작으면 left↑, 크면 right↓로 좁히기.', code: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end()); // 정렬 → 투 포인터!\n        vector<vector<int>> res;' },
                        { title: 'i 고정 + 중복 건너뛰기', desc: 'i를 고정 후 나머지를 투 포인터로 찾음.\n같은 값 건너뛰기 → 중복 조합 방지!', code: '        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue; // 중복 skip' },
                        { title: '투 포인터 탐색', desc: '합 == 0 → 정답! 중복 건너뛰고 양쪽 이동.\n합 < 0 → left++, 합 > 0 → right--', code: '            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;  // 합 작다 → left 이동\n                else r--;               // 합 크다 → right 이동\n            }\n        }\n        return res;\n    }\n};' }
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
            <div class="editor-header"><h3>풀이 작성</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option></select></div>
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
