// =========================================================
// 해시 테이블 (Hash Table) 토픽 모듈
// =========================================================
const hashTableTopic = {
    id: 'hashtable',
    title: '해시 테이블',
    icon: '🗂️',
    category: '기초 (Bronze~Silver)',
    order: 4,
    description: '이름표를 붙여서 한 번에 찾기! 딕셔너리와 집합 활용',
    relatedNote: '해시맵은 투 포인터, 슬라이딩 윈도우와 함께 쓰이는 경우가 많고, 정렬 대신 O(1) 탐색으로 시간을 줄이는 핵심 도구입니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-10815': { type: '집합 탐색',      color: '#00b894',      vizMethod: '_renderVizNumCard' },
        'lc-217':   { type: '해시셋 활용',    color: 'var(--accent)', vizMethod: '_renderVizContainsDup' },
        'lc-3':     { type: '슬라이딩 윈도우', color: '#6c5ce7',      vizMethod: '_renderVizLongestSub' },
        'lc-560':   { type: '누적합+해시맵',   color: '#e17055',      vizMethod: '_renderVizSubarraySum' },
        'boj-7785': { type: '집합 관리',       color: 'var(--green)',  vizMethod: '_renderVizCompany' }
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

    _renderProblemTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

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
            codeEl.className = 'language-' + (lang === 'cpp' ? 'cpp' : lang);
            codeEl.textContent = prob.templates[lang];
            if (window.hljs) hljs.highlightElement(codeEl);
        });
        contentEl.appendChild(wrapper);
    },

    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🗂️ 해시 테이블 (Hash Table)</h2>
                <p class="hero-sub">키 하나로 값을 즉시 찾는 마법 같은 자료구조를 배워봅시다!</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 해시 테이블이란?</div>
                <div class="analogy-box">
                    이름표가 붙은 서랍장을 생각해 보세요! "사과" 서랍을 열면 바로 사과 정보가 나와요.
                    배열에서 뭔가를 찾으려면 하나씩 열어봐야 하잖아요? 100개면 100번 확인해야 해요.
                    그런데 해시 테이블은 이름표만 보면 바로 찾을 수 있어서, 100개든 10만 개든 한 번이면 돼요!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">key→val</text></svg></div>
                        <h3>키-값 쌍</h3>
                        <p>"사과"라는 이름으로 3을 저장하고, 나중에 "사과"로 바로 꺼내요. <span class="lang-py">Python에서는 <code>dict</code></span><span class="lang-cpp">C++에서는 <code>unordered_map</code></span>이 이 역할을 해요.</p>
                        <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#dict" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: dict ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: unordered_map ↗</a></span>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--green)">O(1)</text></svg></div>
                        <h3>한 번에 바로 찾기!</h3>
                        <p>넣기, 빼기, 찾기가 전부 한 번이면 돼요. 배열은 100개면 최대 100번 확인해야 하는데, 여기선 딱 1번이면 끝!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--yellow)">#</text></svg></div>
                        <h3>해시 함수</h3>
                        <p>이름표를 서랍 번호로 바꿔주는 규칙이에요. "사과"를 넣으면 항상 같은 번호가 나와서, 그 서랍만 열면 돼요!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">set{}</text></svg></div>
                        <h3>집합 (Set)</h3>
                        <p>같은 것을 두 번 넣어도 하나만 남아요. "이거 이미 본 적 있나?" 확인하는 게 엄청 빨라요! <span class="lang-py"><code>in</code>으로 한 번에 확인!</span><span class="lang-cpp"><code>count()</code>로 한 번에 확인!</span></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 해시 테이블 기본 사용
d = {}
d["apple"] = 3       # 삽입: O(1)
d["banana"] = 5
print(d["apple"])     # 조회: O(1) → 3
print("apple" in d)   # 존재 확인: O(1) → True

# 집합 (Set) — 중복 제거, 빠른 존재 확인
s = set([1, 2, 2, 3, 3, 3])
print(s)              # {1, 2, 3}
print(2 in s)         # O(1) → True</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;unordered_map&gt;
#include &lt;unordered_set&gt;
using namespace std;

int main() {
    // 해시 테이블 기본 사용
    unordered_map&lt;string, int&gt; d;
    d["apple"] = 3;        // 삽입: O(1)
    d["banana"] = 5;
    cout &lt;&lt; d["apple"] &lt;&lt; endl;         // 조회: O(1) → 3
    cout &lt;&lt; (d.count("apple") ? "true" : "false") &lt;&lt; endl;  // 존재 확인: O(1)

    // 집합 (Set) — 중복 제거, 빠른 존재 확인
    unordered_set&lt;int&gt; s = {1, 2, 2, 3, 3, 3};
    // s에는 {1, 2, 3}만 저장됨
    cout &lt;&lt; (s.count(2) ? "true" : "false") &lt;&lt; endl;  // O(1)
    return 0;
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 배열 vs 딕셔너리 검색 속도</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="text" id="ht-demo-search-input" value="grape" placeholder="검색할 값" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:120px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="ht-demo-search-btn">🔍 검색 시작</button>
                        <button class="concept-demo-btn green" id="ht-demo-search-reset" style="display:none;">↺ 다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:200px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">배열 탐색 <span style="color:var(--red);font-size:0.85rem;">O(n)</span></div>
                                <div id="ht-demo-arr-boxes" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
                                <div id="ht-demo-arr-count" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>
                            </div>
                            <div style="flex:1;min-width:200px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">딕셔너리 검색 <span style="color:var(--green);font-size:0.85rem;">O(1)</span></div>
                                <div id="ht-demo-dict-boxes" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
                                <div id="ht-demo-dict-count" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="ht-demo-search-msg">👆 검색할 값을 입력하고 "검색 시작" 버튼을 눌러보세요! 배열과 딕셔너리의 속도 차이를 느껴보세요.</div>
                </div>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">배열에서 원소가 있는지 확인하면 O(n)인데, 집합(set)에서는 O(1)인 이유는?</span></div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">배열은 처음부터 끝까지 하나씩 비교해야 하지만, 집합은 <strong>해시 함수</strong>로 바로 위치를 계산합니다! 전화번호부에서 이름으로 바로 찾는 것과 같습니다.</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 해시 함수는 어떻게 동작할까?</div>
                <div class="analogy-box">
                    <strong>핵심 질문:</strong> 문자열 <code>"apple"</code>을 어떻게 <strong>숫자</strong>로 바꿀까?
                    해시 함수는 3단계로 동작합니다: <em>쪼개고 → 섞고 → 맞추고</em>.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">a=97</text></svg></div>
                        <h3>① 쪼개기</h3>
                        <p>각 글자를 숫자(ASCII)로 변환합니다.<br><code>a→97, p→112, l→108, e→101</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">Σ=530</text></svg></div>
                        <h3>② 섞기</h3>
                        <p>숫자들을 합쳐서 하나의 값으로 만듭니다.<br><code>97+112+112+108+101 = 530</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--green)">%10=0</text></svg></div>
                        <h3>③ 맞추기</h3>
                        <p>테이블 크기로 나머지 연산을 합니다.<br><code>530 % 10 = 0</code> → <strong>0번 칸!</strong></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 해시 함수의 원리 (간단 버전)
def simple_hash(key, table_size):
    total = 0
    for ch in key:
        total += ord(ch)      # 글자 → 숫자 (쪼개기 + 섞기)
    return total % table_size  # 테이블 크기에 맞추기

# 테이블 크기가 10일 때
print(simple_hash("apple", 10))   # 530 % 10 = 0 → 0번 칸
print(simple_hash("banana", 10))  # 609 % 10 = 9 → 9번 칸
print(simple_hash("grape", 10))   # 527 % 10 = 7 → 7번 칸</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

// 해시 함수의 원리 (간단 버전)
int simple_hash(const string&amp; key, int table_size) {
    int total = 0;
    for (char ch : key) {
        total += (int)ch;      // 글자 → 숫자 (쪼개기 + 섞기)
    }
    return total % table_size;  // 테이블 크기에 맞추기
}

int main() {
    // 테이블 크기가 10일 때
    cout &lt;&lt; simple_hash("apple", 10) &lt;&lt; endl;   // 530 % 10 = 0 → 0번 칸
    cout &lt;&lt; simple_hash("banana", 10) &lt;&lt; endl;  // 609 % 10 = 9 → 9번 칸
    cout &lt;&lt; simple_hash("grape", 10) &lt;&lt; endl;   // 527 % 10 = 7 → 7번 칸
    return 0;
}</code></pre>
                </div></span>
                <div class="analogy-box" style="border-left-color: var(--green);">
                    <strong>왜 빠를까?</strong> 배열에서 <code>"apple"</code>을 찾으려면 처음부터 하나씩 비교해야 합니다 (O(n)).
                    하지만 해시 테이블은 <code>hash("apple") = 0</code>을 계산해서 <strong>0번 칸을 바로 열어봅니다</strong> (O(1)).
                    도서관에서 책을 한 권씩 넘기는 게 아니라, 서가 번호를 계산해서 바로 가는 것과 같습니다! 📚→🎯
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 해시 함수 시각화</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="text" id="ht-demo-hash-input" value="apple" placeholder="키 입력" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:140px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="ht-demo-hash-btn">⚙️ 해시 계산</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="margin-bottom:12px;">
                            <div style="font-weight:600;margin-bottom:8px;color:var(--text);">① 글자를 ASCII 숫자로 변환</div>
                            <div id="ht-demo-hash-chars" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
                        </div>
                        <div style="margin-bottom:12px;">
                            <div style="font-weight:600;margin-bottom:8px;color:var(--text);">② 합산 & 나머지</div>
                            <div id="ht-demo-hash-calc" style="font-size:0.95rem;color:var(--text2);min-height:1.5em;"></div>
                        </div>
                        <div>
                            <div style="font-weight:600;margin-bottom:8px;color:var(--text);">③ 버킷 배치 (테이블 크기: 7)</div>
                            <div id="ht-demo-hash-buckets" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="ht-demo-hash-msg">👆 키를 입력하고 "해시 계산" 버튼을 눌러보세요! 여러 키를 넣어서 어떤 버킷에 배치되는지 확인하세요.</div>
                </div>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">테이블이 10칸인데 데이터가 100개면 어떻게 될까요?</span></div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">한 칸에 평균 10개씩 들어가서 성능이 나빠집니다! 그래서 실제로는 <strong>데이터 수보다 테이블을 충분히 크게</strong> 만들고, 데이터가 많아지면 테이블을 자동으로 늘립니다 (리사이징). <span class="lang-py">Python의 <code>dict</code>가 자동으로 이 작업을 해줍니다.</span><span class="lang-cpp">C++의 <code>unordered_map</code>이 자동으로 이 작업(rehash)을 해줍니다.</span></div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 해시맵 활용 패턴</div>
                <div class="analogy-box">
                    <strong>패턴을 알면 문제가 쉬워집니다!</strong> 해시맵의 3대 활용:
                    (1) <em>빈도수 세기</em> — Counter 대신 직접 구현,
                    (2) <em>존재 확인</em> — "이 값을 본 적 있나?",
                    (3) <em>매핑</em> — "이 값의 인덱스/보충값은?"
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--green)">count</text></svg></div>
                        <h3>빈도수 세기</h3>
                        <p>"가장 많은 원소", "중복 찾기" 등의 문제에서 사용합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">in?</text></svg></div>
                        <h3>존재 확인</h3>
                        <p>"찾는 값이 이미 있는가?"를 O(1)에 확인합니다. 보수(complement) 탐색의 핵심!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">a↔b</text></svg></div>
                        <h3>매핑</h3>
                        <p>값→인덱스, 문자→빈도 등 두 정보를 연결합니다.</p>
                    </div>
                </div>
                <div style="margin-bottom:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.Counter" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: Counter ↗</a></span>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 패턴 1: 빈도수 세기
from collections import Counter
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
freq = Counter(words)
print(freq.most_common(1))  # [('apple', 3)]

# 패턴 2: 보수(complement) 탐색 — O(n)으로 짝 찾기
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:          # O(1) 존재 확인!
            return [seen[comp], i]
        seen[num] = i             # 값 → 인덱스 매핑
    return []

# 패턴 3: 중복 없는 가장 긴 부분 문자열
def longest_unique(s):
    seen = {}
    start = max_len = 0
    for i, c in enumerate(s):
        if c in seen and seen[c] >= start:
            start = seen[c] + 1
        seen[c] = i
        max_len = max(max_len, i - start + 1)
    return max_len</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;string&gt;
#include &lt;unordered_map&gt;
#include &lt;algorithm&gt;
using namespace std;

// 패턴 1: 빈도수 세기 — unordered_map으로 직접 카운팅
vector&lt;string&gt; words = {"apple", "banana", "apple", "cherry", "banana", "apple"};
unordered_map&lt;string, int&gt; freq;
for (auto&amp; w : words) freq[w]++;
// freq["apple"] = 3, freq["banana"] = 2, freq["cherry"] = 1

// 패턴 2: 보수(complement) 탐색 — O(n)으로 짝 찾기
vector&lt;int&gt; two_sum(vector&lt;int&gt;&amp; nums, int target) {
    unordered_map&lt;int, int&gt; seen;
    for (int i = 0; i &lt; nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp))      // O(1) 존재 확인!
            return {seen[comp], i};
        seen[nums[i]] = i;         // 값 → 인덱스 매핑
    }
    return {};
}

// 패턴 3: 중복 없는 가장 긴 부분 문자열
int longest_unique(const string&amp; s) {
    unordered_map&lt;char, int&gt; seen;
    int start = 0, max_len = 0;
    for (int i = 0; i &lt; s.size(); i++) {
        if (seen.count(s[i]) &amp;&amp; seen[s[i]] &gt;= start)
            start = seen[s[i]] + 1;
        seen[s[i]] = i;
        max_len = max(max_len, i - start + 1);
    }
    return max_len;
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 빈도수 세기</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="text" id="ht-demo-freq-input" value="banana" placeholder="문자열 입력" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:160px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="ht-demo-freq-btn">📊 세기 시작</button>
                        <button class="concept-demo-btn green" id="ht-demo-freq-reset" style="display:none;">↺ 다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="margin-bottom:12px;">
                            <div style="font-weight:600;margin-bottom:8px;color:var(--text);">문자열</div>
                            <div id="ht-demo-freq-chars" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
                        </div>
                        <div>
                            <div style="font-weight:600;margin-bottom:8px;color:var(--text);">빈도수 딕셔너리</div>
                            <div id="ht-demo-freq-dict" style="display:flex;gap:8px;flex-wrap:wrap;min-height:50px;align-items:flex-end;"></div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="ht-demo-freq-msg">👆 문자열을 입력하고 "세기 시작"을 눌러보세요! 한 글자씩 빈도수를 세는 과정을 볼 수 있습니다.</div>
                </div>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">"합이 target인 두 수 찾기"를 이중 for문(O(n²)) 대신 해시맵(O(n))으로 풀 수 있는 이유는?</span></div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">이중 for문은 "모든 쌍"을 비교하지만, 해시맵은 <strong>한 번 순회</strong>하면서 "이 숫자의 보수(target - num)가 이미 있나?"를 O(1)에 확인합니다. n번 × O(1) = O(n)!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 해시 충돌과 해결</div>
                <div class="analogy-box">
                    <strong>문제 상황:</strong> 테이블이 10칸인데 <code>"apple"</code>과 <code>"melon"</code>이 모두 <strong>0번 칸</strong>에 배정되면?
                    이것이 <em>"해시 충돌(Collision)"</em>입니다. 두 가지 해결법이 있습니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">→→</text></svg></div>
                        <h3>① 체이닝</h3>
                        <p>같은 칸에 <strong>리스트로 연결</strong>합니다.<br>
                        <code>[0] → apple → melon</code><br>
                        <code>[7] → grape</code><br>
                        실제 해시테이블 구현에서 가장 많이 사용되는 방식입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">↓↓</text></svg></div>
                        <h3>② 오픈 어드레싱</h3>
                        <p>칸이 차있으면 <strong>다음 빈 칸</strong>을 찾습니다.<br>
                        <code>[0] apple</code> ← 먼저 옴<br>
                        <code>[1] melon</code> ← 0번 찼으니 1번에!<br>
                        <span class="lang-py">Python의 <code>dict</code>가 이 방식입니다.</span><span class="lang-cpp">C++의 <code>unordered_map</code>도 이 방식(오픈 어드레싱 변형)을 사용합니다.</span></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 체이닝 방식 — 직접 구현해보기
class HashTable:
    def __init__(self, size=10):
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return sum(ord(c) for c in key) % len(self.table)

    def put(self, key, value):
        idx = self._hash(key)
        # 같은 칸의 리스트에서 키가 있으면 업데이트, 없으면 추가
        for pair in self.table[idx]:
            if pair[0] == key:
                pair[1] = value
                return
        self.table[idx].append([key, value])

    def get(self, key):
        idx = self._hash(key)
        for pair in self.table[idx]:
            if pair[0] == key:
                return pair[1]
        return None</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;string&gt;
#include &lt;list&gt;
using namespace std;

// 체이닝 방식 — 직접 구현해보기
struct HashTable {
    int size;
    vector&lt;list&lt;pair&lt;string, int&gt;&gt;&gt; table;  // 각 칸이 연결 리스트

    HashTable(int sz = 10) : size(sz), table(sz) {}

    int _hash(const string&amp; key) {
        int total = 0;
        for (char c : key) total += (int)c;
        return total % size;
    }

    void put(const string&amp; key, int value) {
        int idx = _hash(key);
        // 같은 칸의 리스트에서 키가 있으면 업데이트, 없으면 추가
        for (auto&amp; p : table[idx]) {
            if (p.first == key) { p.second = value; return; }
        }
        table[idx].push_back({key, value});
    }

    int get(const string&amp; key) {
        int idx = _hash(key);
        for (auto&amp; p : table[idx]) {
            if (p.first == key) return p.second;
        }
        return -1;  // nullptr 대신 -1 반환 (찾지 못함)
    }
};</code></pre>
                </div></span>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">O(n)?</text></svg></div>
                        <h3>충돌이 많으면?</h3>
                        <p>한 칸에 데이터가 몰리면 그 칸에서 하나씩 찾아야 합니다. 최악 O(n) — 하지만 <strong>좋은 해시 함수 + 넉넉한 테이블 크기</strong>로 거의 발생하지 않습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">순서</text></svg></div>
                        <h3>순서 보장</h3>
                        <p><span class="lang-py">Python 3.7+의 <code>dict</code>는 삽입 순서를 보장합니다!</span><span class="lang-cpp">C++의 <code>unordered_map</code>은 순서를 보장하지 않지만, <code>map</code>은 키 정렬 순서를 유지합니다.</span> 하지만 해시테이블 자체는 정렬된 순서가 아닙니다.</p>
                    </div>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 충돌 & 체이닝</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="text" id="ht-demo-chain-input" value="apple" placeholder="키 입력" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:120px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="ht-demo-chain-add">➕ 삽입</button>
                        <button class="concept-demo-btn danger" id="ht-demo-chain-clear">🗑️ 초기화</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">해시 테이블 (크기: 5) — 체이닝 방식</div>
                        <div id="ht-demo-chain-table" style="display:flex;flex-direction:column;gap:6px;"></div>
                    </div>
                    <div class="concept-demo-msg" id="ht-demo-chain-msg">👆 키를 입력하고 "삽입" 버튼을 반복해서 눌러보세요! 같은 버킷에 여러 키가 들어가면 체이닝이 발생합니다. 추천: apple, melon, plum, fig, kiwi</div>
                </div>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">해시 테이블의 최악 시간 복잡도는 O(n)인데, 왜 "O(1)"이라고 할까요?</span></div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">O(n)은 모든 키가 같은 해시값을 가지는 극히 드문 최악의 경우입니다. <strong>평균적으로는 O(1)</strong>이고, 좋은 해시 함수를 쓰면 충돌이 거의 없습니다! <span class="lang-py">실제로 Python <code>dict</code>는 데이터가 2/3 이상 차면 자동으로 테이블을 2배로 늘려 충돌을 방지합니다.</span><span class="lang-cpp">실제로 C++ <code>unordered_map</code>은 load factor(기본 1.0)를 초과하면 자동으로 버킷 수를 늘려(rehash) 충돌을 방지합니다.</span></div>
                </div>
            </div>
        `;
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => { const box = btn.closest('.think-box'); box.classList.add('revealed'); btn.style.display = 'none'; });
        });

        // ========== 인라인 데모 인터랙션 ==========

        // --- 1. 배열 vs 딕셔너리 검색 속도 데모 ---
        {
            const arrData = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'];
            const dictData = {};
            arrData.forEach(function(v) { dictData[v] = true; });
            const searchBtn = container.querySelector('#ht-demo-search-btn');
            const resetBtn = container.querySelector('#ht-demo-search-reset');
            const inputEl = container.querySelector('#ht-demo-search-input');
            const arrBoxes = container.querySelector('#ht-demo-arr-boxes');
            const dictBoxes = container.querySelector('#ht-demo-dict-boxes');
            const arrCount = container.querySelector('#ht-demo-arr-count');
            const dictCount = container.querySelector('#ht-demo-dict-count');
            const msgEl = container.querySelector('#ht-demo-search-msg');

            var searchAnimating = false;

            function renderArrBoxes() {
                arrBoxes.innerHTML = '';
                arrData.forEach(function(v) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.innerHTML = '<div class="str-char-val">' + v + '</div>';
                    box.dataset.val = v;
                    arrBoxes.appendChild(box);
                });
            }
            function renderDictBoxes() {
                dictBoxes.innerHTML = '';
                arrData.forEach(function(v) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.innerHTML = '<div class="str-char-idx" style="font-size:0.65rem;">#' + (function(k) { var h = 0; for (var i = 0; i < k.length; i++) h += k.charCodeAt(i); return h % 10; })(v) + '</div><div class="str-char-val">' + v + '</div>';
                    box.dataset.val = v;
                    dictBoxes.appendChild(box);
                });
            }
            renderArrBoxes();
            renderDictBoxes();

            searchBtn.addEventListener('click', function() {
                if (searchAnimating) return;
                searchAnimating = true;
                var target = inputEl.value.trim().toLowerCase();
                if (!target) { msgEl.textContent = '검색할 값을 입력해주세요!'; searchAnimating = false; return; }
                searchBtn.style.display = 'none';
                resetBtn.style.display = '';
                renderArrBoxes();
                renderDictBoxes();
                arrCount.textContent = '';
                dictCount.textContent = '';

                // 배열: 한 칸씩 비교 (애니메이션)
                var arrItems = arrBoxes.querySelectorAll('.str-char-box');
                var found = false;
                var step = 0;
                var comparisons = 0;

                function arrStep() {
                    if (step >= arrItems.length) {
                        arrCount.textContent = found ? '찾음! 비교 횟수: ' + comparisons + '회' : '없음! 비교 횟수: ' + comparisons + '회 (전부 확인)';
                        if (!found) arrCount.style.color = 'var(--red)';
                        return;
                    }
                    // 이전 스텝 하이라이트 제거
                    if (step > 0) arrItems[step - 1].classList.remove('comparing');
                    arrItems[step].classList.add('comparing');
                    comparisons++;
                    if (arrItems[step].dataset.val === target) {
                        found = true;
                        arrItems[step].classList.remove('comparing');
                        arrItems[step].classList.add('matched');
                        arrCount.textContent = '찾음! 비교 횟수: ' + comparisons + '회';
                        arrCount.style.color = 'var(--green)';
                        msgEl.textContent = '배열은 ' + comparisons + '번 비교해야 찾았지만, 딕셔너리는 해시 함수로 1번에 찾습니다!';
                        return;
                    }
                    step++;
                    setTimeout(arrStep, 350);
                }

                // 딕셔너리: 바로 찾기 (약간의 딜레이 후 즉시)
                setTimeout(function() {
                    var dictItems = dictBoxes.querySelectorAll('.str-char-box');
                    var dictFound = false;
                    dictItems.forEach(function(box) {
                        if (box.dataset.val === target) {
                            box.classList.add('matched');
                            dictFound = true;
                        }
                    });
                    if (dictFound) {
                        dictCount.textContent = '해시 계산 1번으로 즉시 찾음!';
                        dictCount.style.color = 'var(--green)';
                    } else {
                        dictCount.textContent = '해시 계산 1번 → 없음 확인!';
                        dictCount.style.color = 'var(--red)';
                    }
                    searchAnimating = false;
                }, 200);

                arrStep();
            });

            resetBtn.addEventListener('click', function() {
                searchAnimating = false;
                searchBtn.style.display = '';
                resetBtn.style.display = 'none';
                renderArrBoxes();
                renderDictBoxes();
                arrCount.textContent = '';
                arrCount.style.color = '';
                dictCount.textContent = '';
                dictCount.style.color = '';
                msgEl.textContent = '👆 검색할 값을 입력하고 "검색 시작" 버튼을 눌러보세요! 배열과 딕셔너리의 속도 차이를 느껴보세요.';
            });
        }

        // --- 2. 해시 함수 시각화 데모 ---
        {
            var HASH_TABLE_SIZE = 7;
            var hashBucketData = [[], [], [], [], [], [], []];
            var hashBtn = container.querySelector('#ht-demo-hash-btn');
            var hashInput = container.querySelector('#ht-demo-hash-input');
            var hashChars = container.querySelector('#ht-demo-hash-chars');
            var hashCalc = container.querySelector('#ht-demo-hash-calc');
            var hashBuckets = container.querySelector('#ht-demo-hash-buckets');
            var hashMsg = container.querySelector('#ht-demo-hash-msg');

            function renderHashBuckets() {
                hashBuckets.innerHTML = '';
                for (var i = 0; i < HASH_TABLE_SIZE; i++) {
                    var bkt = document.createElement('div');
                    bkt.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;min-width:60px;';
                    var label = document.createElement('div');
                    label.style.cssText = 'font-size:0.75rem;color:var(--text3);font-weight:600;';
                    label.textContent = '[' + i + ']';
                    var slot = document.createElement('div');
                    slot.className = 'str-char-box';
                    slot.id = 'ht-demo-hash-bucket-' + i;
                    slot.style.cssText = 'min-width:55px;min-height:36px;transition:all 0.3s ease;';
                    var keysInBucket = hashBucketData[i];
                    if (keysInBucket.length > 0) {
                        slot.innerHTML = '<div class="str-char-val" style="font-size:0.75rem;">' + keysInBucket.join(', ') + '</div>';
                    } else {
                        slot.innerHTML = '<div class="str-char-val" style="font-size:0.75rem;color:var(--text3);">—</div>';
                    }
                    bkt.appendChild(label);
                    bkt.appendChild(slot);
                    hashBuckets.appendChild(bkt);
                }
            }
            renderHashBuckets();

            hashBtn.addEventListener('click', function() {
                var key = hashInput.value.trim();
                if (!key) { hashMsg.textContent = '키를 입력해주세요!'; return; }

                // Step 1: 글자별 ASCII
                hashChars.innerHTML = '';
                var total = 0;
                var parts = [];
                for (var i = 0; i < key.length; i++) {
                    var ch = key[i];
                    var code = key.charCodeAt(i);
                    total += code;
                    parts.push(code);
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.innerHTML = '<div class="str-char-idx">' + ch + '</div><div class="str-char-val">' + code + '</div>';
                    box.style.animation = 'fadeIn 0.3s ease ' + (i * 0.1) + 's both';
                    hashChars.appendChild(box);
                }

                // Step 2: 합산 & 나머지
                var idx = total % HASH_TABLE_SIZE;
                hashCalc.innerHTML = parts.join(' + ') + ' = <strong>' + total + '</strong> → ' + total + ' % ' + HASH_TABLE_SIZE + ' = <strong style="color:var(--green);">' + idx + '번 버킷</strong>';

                // Step 3: 버킷에 배치
                if (hashBucketData[idx].indexOf(key) === -1) {
                    hashBucketData[idx].push(key);
                }
                renderHashBuckets();
                var targetSlot = container.querySelector('#ht-demo-hash-bucket-' + idx);
                if (targetSlot) {
                    targetSlot.classList.add('matched');
                    setTimeout(function() { targetSlot.classList.remove('matched'); }, 1500);
                }

                // 충돌 확인
                if (hashBucketData[idx].length > 1) {
                    hashMsg.textContent = '충돌 발생! "' + key + '"가 ' + idx + '번 버킷에 들어갔는데, 이미 "' + hashBucketData[idx].filter(function(k) { return k !== key; }).join(', ') + '"이(가) 있습니다!';
                } else {
                    hashMsg.textContent = '"' + key + '" → ASCII 합: ' + total + ' → ' + idx + '번 버킷에 배치! 다른 키도 넣어보세요.';
                }
                hashInput.value = '';
                hashInput.focus();
            });
        }

        // --- 3. 빈도수 세기 데모 ---
        {
            var freqBtn = container.querySelector('#ht-demo-freq-btn');
            var freqReset = container.querySelector('#ht-demo-freq-reset');
            var freqInput = container.querySelector('#ht-demo-freq-input');
            var freqChars = container.querySelector('#ht-demo-freq-chars');
            var freqDict = container.querySelector('#ht-demo-freq-dict');
            var freqMsg = container.querySelector('#ht-demo-freq-msg');
            var freqAnimating = false;

            function renderFreqChars(str) {
                freqChars.innerHTML = '';
                for (var i = 0; i < str.length; i++) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + str[i] + '</div>';
                    freqChars.appendChild(box);
                }
            }

            function renderFreqDict(freq, highlightKey) {
                freqDict.innerHTML = '';
                var keys = Object.keys(freq);
                if (keys.length === 0) {
                    freqDict.innerHTML = '<div style="color:var(--text3);font-size:0.85rem;">(비어있음)</div>';
                    return;
                }
                keys.forEach(function(k) {
                    var col = document.createElement('div');
                    col.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';
                    // 바 높이를 빈도수에 비례
                    var barH = freq[k] * 28;
                    var bar = document.createElement('div');
                    bar.style.cssText = 'width:36px;height:' + barH + 'px;background:var(--accent);border-radius:6px 6px 0 0;transition:height 0.3s ease;display:flex;align-items:flex-start;justify-content:center;padding-top:4px;color:#fff;font-weight:700;font-size:0.85rem;';
                    if (k === highlightKey) bar.style.background = 'var(--green)';
                    bar.textContent = freq[k];
                    var label = document.createElement('div');
                    label.style.cssText = 'font-size:0.85rem;font-weight:600;color:var(--text);';
                    label.textContent = '"' + k + '"';
                    col.appendChild(bar);
                    col.appendChild(label);
                    freqDict.appendChild(col);
                });
            }

            freqBtn.addEventListener('click', function() {
                if (freqAnimating) return;
                var str = freqInput.value.trim();
                if (!str) { freqMsg.textContent = '문자열을 입력해주세요!'; return; }
                freqAnimating = true;
                freqBtn.style.display = 'none';
                freqReset.style.display = '';
                renderFreqChars(str);
                var freq = {};
                var step = 0;
                var charBoxes = freqChars.querySelectorAll('.str-char-box');

                function nextStep() {
                    if (step >= str.length) {
                        freqMsg.textContent = '완료! 총 ' + Object.keys(freq).length + '종류의 문자가 있습니다. 결과: ' + Object.keys(freq).map(function(k) { return '"' + k + '":' + freq[k]; }).join(', ');
                        freqAnimating = false;
                        return;
                    }
                    // 이전 스텝 하이라이트 제거
                    if (step > 0) charBoxes[step - 1].classList.remove('comparing');
                    charBoxes[step].classList.add('comparing');
                    var ch = str[step];
                    if (!freq[ch]) freq[ch] = 0;
                    freq[ch]++;
                    renderFreqDict(freq, ch);
                    freqMsg.textContent = '문자 "' + ch + '" 발견 → freq["' + ch + '"] = ' + freq[ch] + (freq[ch] > 1 ? ' (이미 있으니 +1 증가!)' : ' (처음 등장, 새로 추가!)');
                    step++;
                    setTimeout(nextStep, 450);
                }
                nextStep();
            });

            freqReset.addEventListener('click', function() {
                freqAnimating = false;
                freqBtn.style.display = '';
                freqReset.style.display = 'none';
                renderFreqChars(freqInput.value.trim() || 'banana');
                freqDict.innerHTML = '<div style="color:var(--text3);font-size:0.85rem;">(비어있음)</div>';
                freqMsg.textContent = '👆 문자열을 입력하고 "세기 시작"을 눌러보세요! 한 글자씩 빈도수를 세는 과정을 볼 수 있습니다.';
            });
            renderFreqDict({});
        }

        // --- 4. 충돌 & 체이닝 데모 ---
        {
            var CHAIN_SIZE = 5;
            var chainTable = [[], [], [], [], []];
            var chainAddBtn = container.querySelector('#ht-demo-chain-add');
            var chainClearBtn = container.querySelector('#ht-demo-chain-clear');
            var chainInput = container.querySelector('#ht-demo-chain-input');
            var chainTableEl = container.querySelector('#ht-demo-chain-table');
            var chainMsg = container.querySelector('#ht-demo-chain-msg');

            function chainHash(key) {
                var h = 0;
                for (var i = 0; i < key.length; i++) h += key.charCodeAt(i);
                return h % CHAIN_SIZE;
            }

            function renderChainTable(highlightBucket, highlightKey) {
                chainTableEl.innerHTML = '';
                for (var i = 0; i < CHAIN_SIZE; i++) {
                    var row = document.createElement('div');
                    row.style.cssText = 'display:flex;align-items:center;gap:8px;';
                    var label = document.createElement('div');
                    label.style.cssText = 'font-weight:700;font-size:0.85rem;color:var(--text2);min-width:30px;text-align:center;';
                    label.textContent = '[' + i + ']';
                    row.appendChild(label);

                    if (chainTable[i].length === 0) {
                        var empty = document.createElement('div');
                        empty.style.cssText = 'font-size:0.8rem;color:var(--text3);padding:6px 12px;border:1px dashed var(--border);border-radius:8px;';
                        empty.textContent = '비어있음';
                        row.appendChild(empty);
                    } else {
                        chainTable[i].forEach(function(key, idx) {
                            if (idx > 0) {
                                var arrow = document.createElement('span');
                                arrow.style.cssText = 'color:var(--accent);font-weight:700;font-size:1.1rem;';
                                arrow.textContent = '→';
                                row.appendChild(arrow);
                            }
                            var box = document.createElement('div');
                            box.className = 'str-char-box';
                            box.innerHTML = '<div class="str-char-val">' + key + '</div>';
                            box.style.transition = 'all 0.3s ease';
                            if (i === highlightBucket && key === highlightKey) {
                                box.classList.add('matched');
                            }
                            row.appendChild(box);
                        });
                        if (chainTable[i].length > 1) {
                            var badge = document.createElement('span');
                            badge.style.cssText = 'font-size:0.7rem;padding:2px 8px;background:var(--red);color:#fff;border-radius:10px;font-weight:600;margin-left:4px;';
                            badge.textContent = '충돌!';
                            row.appendChild(badge);
                        }
                    }
                    chainTableEl.appendChild(row);
                }
            }
            renderChainTable(-1, '');

            chainAddBtn.addEventListener('click', function() {
                var key = chainInput.value.trim();
                if (!key) { chainMsg.textContent = '키를 입력해주세요!'; return; }
                var idx = chainHash(key);
                // 중복 방지
                if (chainTable[idx].indexOf(key) !== -1) {
                    chainMsg.textContent = '"' + key + '"은(는) 이미 ' + idx + '번 버킷에 있습니다! 다른 키를 넣어보세요.';
                    renderChainTable(idx, key);
                    return;
                }
                var hadCollision = chainTable[idx].length > 0;
                chainTable[idx].push(key);
                renderChainTable(idx, key);
                if (hadCollision) {
                    chainMsg.textContent = '충돌! "' + key + '" → hash = ' + idx + '번 버킷에 이미 "' + chainTable[idx].filter(function(k) { return k !== key; }).join(', ') + '"이(가) 있어서 체이닝으로 연결했습니다!';
                } else {
                    chainMsg.textContent = '"' + key + '" → hash = ' + idx + '번 버킷에 저장! (총 ASCII 합: ' + (function(k) { var s = 0; for (var i = 0; i < k.length; i++) s += k.charCodeAt(i); return s; })(key) + ' % ' + CHAIN_SIZE + ' = ' + idx + ')';
                }
                chainInput.value = '';
                chainInput.focus();
            });

            chainClearBtn.addEventListener('click', function() {
                chainTable = [[], [], [], [], []];
                renderChainTable(-1, '');
                chainMsg.textContent = '초기화 완료! 키를 입력하고 "삽입" 버튼을 눌러보세요.';
                chainInput.value = '';
            });
        }
    },

    // ===== 시각화 탭 (개념 탭용 — 스텁) =====
    renderVisualize(container) { container.innerHTML = ''; },

    // ===== 해시 테이블 삽입 시각화 (개념 탭 전용) =====
    _renderVizHashTableInsert(container) {
        const self = this;
        self._clearVizState();

        const DEFAULT_ITEMS = 'apple 3, banana 5, cherry 2, date 8, elderberry 1';
        const TABLE_SIZE = 7;

        function simpleHash(key) {
            let h = 0;
            for (let i = 0; i < key.length; i++) h = (h + key.charCodeAt(i)) % TABLE_SIZE;
            return h;
        }

        function parseItems(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/);
                if (parts.length < 2) return null;
                return { key: parts[0], val: parts.slice(1).join(' ') };
            }).filter(function(x) { return x !== null && x.key; });
        }

        container.innerHTML = `
            <div class="hero" style="padding-bottom:12px;">
                <h2>해시 테이블 삽입 시각화</h2>
                <p class="hero-sub">키를 해시 함수로 변환하여 테이블에 넣는 과정을 봅시다.</p>
            </div>
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">
                <label style="font-weight:600;">키-값 쌍: <input type="text" id="ht-insert-input" value="${DEFAULT_ITEMS}" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:380px;background:var(--card);color:var(--text);"></label>
                <button class="btn btn-primary" id="ht-insert-reset">🔄</button>
            </div>
            ${self._createStepDesc()}
            <div class="sim-card">
                <div style="display:flex;gap:24px;margin-top:0;flex-wrap:wrap;width:100%;">
                    <div style="flex:1;min-width:200px;">
                        <div style="font-weight:700;margin-bottom:8px;">해시 테이블 (크기 ${TABLE_SIZE})</div>
                        <div id="ht-table" style="display:flex;flex-direction:column;gap:4px;"></div>
                    </div>
                    <div style="flex:1;min-width:150px;">
                        <div style="font-weight:700;margin-bottom:8px;">현재 작업</div>
                        <div id="ht-info" class="graph-queue-display" style="min-height:60px;padding:12px;font-size:0.95rem;">▶ 다음 버튼을 눌러 시작하세요</div>
                    </div>
                </div>
            </div>
            ${self._createStepControls()}
        `;

        const tableEl = container.querySelector('#ht-table');
        const infoEl = container.querySelector('#ht-info');

        function renderEmptyTable() {
            tableEl.innerHTML = '';
            for (let i = 0; i < TABLE_SIZE; i++) {
                const row = document.createElement('div');
                row.className = 'str-char-box';
                row.dataset.idx = i;
                row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
                row.innerHTML = '<span style="font-weight:700;color:var(--text3);min-width:20px;">[' + i + ']</span><span class="ht-content" style="font-weight:600;">\u2014</span>';
                tableEl.appendChild(row);
            }
        }

        function setSlot(idx, text, cls) {
            const row = tableEl.querySelector('[data-idx="' + idx + '"]');
            if (row) {
                row.querySelector('.ht-content').textContent = text;
                row.className = 'str-char-box' + (cls ? ' ' + cls : '');
                row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
            }
        }

        function saveState() {
            return {
                table: Array.from(tableEl.querySelectorAll('.str-char-box')).map(r => ({ cls: r.className, text: r.querySelector('.ht-content').textContent })),
                info: infoEl.innerHTML
            };
        }
        function restoreState(s) {
            tableEl.querySelectorAll('.str-char-box').forEach((r, i) => {
                r.className = s.table[i].cls;
                r.querySelector('.ht-content').textContent = s.table[i].text;
            });
            infoEl.innerHTML = s.info;
        }

        function buildAndRun() {
            self._clearVizState();
            var items = parseItems(container.querySelector('#ht-insert-input').value);
            if (items.length === 0) items = parseItems(DEFAULT_ITEMS);

            renderEmptyTable();
            infoEl.innerHTML = '▶ 다음 버튼을 눌러 시작하세요';

            const steps = [];
            const stored = {};

            items.forEach(function(item) {
                const h = simpleHash(item.key);
                steps.push({
                    description: '"' + item.key + '" → 해시 함수로 위치를 계산합니다. hash("' + item.key + '") = ' + h + '이므로 ' + h + '번 칸에 저장해야 합니다.',
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        for (let i = 0; i < TABLE_SIZE; i++) {
                            const row = tableEl.querySelector('[data-idx="' + i + '"]');
                            if (row && row.classList.contains('comparing')) {
                                row.className = 'str-char-box' + (stored[i] ? ' matched' : '');
                                row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
                            }
                        }
                        stored[h] = stored[h] ? stored[h] + ', ' + item.key + ':' + item.val : item.key + ':' + item.val;
                        setSlot(h, stored[h], 'comparing');
                        infoEl.innerHTML = 'hash("' + item.key + '") = <strong>' + h + '</strong><br>\u2192 테이블[' + h + '] = ' + item.key + ':' + item.val;
                    },
                    undo: function() { restoreState(this._before); }
                });

                steps.push({
                    description: '"' + item.key + '" → ' + h + '번 칸에 저장 완료! 나중에 이 키를 찾을 때 해시 함수만 돌리면 바로 위치를 알 수 있어요.',
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        setSlot(h, stored[h], 'matched');
                        infoEl.innerHTML = '\u2713 "' + item.key + '" 저장 완료';
                    },
                    undo: function() { restoreState(this._before); }
                });
            });

            steps.push({
                description: '전부 삽입 완료! 🎉',
                _before: null,
                action: function() {
                    this._before = saveState();
                    infoEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;">\u2713 모든 항목 삽입 완료!</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        }

        container.querySelector('#ht-insert-reset').addEventListener('click', buildAndRun);
        buildAndRun();
    },

    _vizState: { steps: [], currentStep: -1, keydownHandler: null },
    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },
    _createStepDesc(suffix) {
        const s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },
    _createStepControls(suffix) {
        const s = suffix || '';
        return '<div class="viz-step-controls"><button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; 이전</button><span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span><button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 &rarr;</button></div>';
    },
    _initStepController(el, steps, suffix) {
        const s = suffix || '';
        const state = this._vizState; state.steps = steps; state.currentStep = -1;
        const prevBtn = el.querySelector('#viz-prev' + s), nextBtn = el.querySelector('#viz-next' + s);
        const counter = el.querySelector('#viz-step-counter' + s), desc = el.querySelector('#viz-step-desc' + s);
        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0); nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { counter.textContent = '시작 전'; desc.innerHTML = '<span>▶ 다음 버튼을 눌러 시작하세요</span>'; }
            else { counter.textContent = `Step ${idx + 1} / ${total}`; desc.innerHTML = '<span>' + state.steps[idx].description + '</span>'; }
        };
        var actionDelay = 350;
        nextBtn.addEventListener('click', () => { if (state.currentStep >= state.steps.length - 1) return; state.currentStep++; updateUI(); setTimeout(() => { state.steps[state.currentStep].action(); }, actionDelay); });
        prevBtn.addEventListener('click', () => { if (state.currentStep < 0) return; var stepToUndo = state.currentStep; state.currentStep--; updateUI(); setTimeout(() => { state.steps[stepToUndo].undo(); }, actionDelay); });
        const handleKeydown = (e) => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); } else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); } };
        document.addEventListener('keydown', handleKeydown); state.keydownHandler = handleKeydown; updateUI();
    },

    // ===== 문제별 시뮬레이션: 숫자 카드 (BOJ 10815) =====
    _renderVizNumCard(container) {
        const self = this;
        const DEFAULT_CARDS = '6,3,2,10,-10';
        const DEFAULT_QUERIES = '10,9,-5,2,3,4,5,-10';
        container.innerHTML = `
            ${self._createStepDesc('-nc')}
            <div class="sim-card">
                <div style="margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
                    <label>카드: <input type="text" id="ht-nc-cards" value="${DEFAULT_CARDS}" style="width:200px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <label>확인할 수: <input type="text" id="ht-nc-queries" value="${DEFAULT_QUERIES}" style="width:240px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <button class="btn btn-primary" id="ht-nc-start">🔄</button>
                </div>
                <div style="margin-bottom:16px;">
                    <div style="font-weight:700;margin-bottom:8px;">카드 (원본 배열)</div>
                    <div id="ht-nc-card-boxes" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
                </div>
                <div style="margin-bottom:16px;">
                    <div style="font-weight:700;margin-bottom:8px;">카드 Set</div>
                    <div id="ht-nc-set" class="graph-queue-display" style="min-height:40px;padding:12px;font-size:0.95rem;">{ }</div>
                </div>
                <div style="margin-bottom:16px;">
                    <div style="font-weight:700;margin-bottom:8px;">확인할 수</div>
                    <div id="ht-nc-query-boxes" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
                </div>
                <div>결과: <span id="ht-nc-result" style="font-weight:600;">—</span></div>
            </div>
            ${self._createStepControls('-nc')}
        `;
        const cardBoxesEl = container.querySelector('#ht-nc-card-boxes');
        const setEl = container.querySelector('#ht-nc-set');
        const queryBoxesEl = container.querySelector('#ht-nc-query-boxes');
        const resultEl = container.querySelector('#ht-nc-result');

        function buildAndRun() {
            self._clearVizState();
            const cards = container.querySelector('#ht-nc-cards').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const queries = container.querySelector('#ht-nc-queries').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

            cardBoxesEl.innerHTML = '';
            cards.forEach((v, i) => { const b = document.createElement('div'); b.className = 'str-char-box'; b.textContent = v; b.dataset.idx = i; cardBoxesEl.appendChild(b); });
            queryBoxesEl.innerHTML = '';
            queries.forEach((v, i) => { const b = document.createElement('div'); b.className = 'str-char-box'; b.textContent = v; b.dataset.idx = i; queryBoxesEl.appendChild(b); });
            setEl.textContent = '{ }';
            resultEl.textContent = '—';

            function saveState() {
                return {
                    cardBoxes: Array.from(cardBoxesEl.children).map(b => ({ cls: b.className, bg: b.style.background, color: b.style.color })),
                    queryBoxes: Array.from(queryBoxesEl.children).map(b => ({ cls: b.className, bg: b.style.background, color: b.style.color })),
                    set: setEl.textContent, result: resultEl.innerHTML
                };
            }
            function restoreState(s) {
                Array.from(cardBoxesEl.children).forEach((b, i) => { b.className = s.cardBoxes[i].cls; b.style.background = s.cardBoxes[i].bg; b.style.color = s.cardBoxes[i].color; });
                Array.from(queryBoxesEl.children).forEach((b, i) => { b.className = s.queryBoxes[i].cls; b.style.background = s.queryBoxes[i].bg; b.style.color = s.queryBoxes[i].color; });
                setEl.textContent = s.set; resultEl.innerHTML = s.result;
            }

            const steps = [];
            const cardSet = new Set();

            // Step 1: Build set from cards
            steps.push({
                description: '카드 N장을 set에 넣습니다. set은 O(1)에 존재 여부를 확인할 수 있어요!',
                _before: null,
                action: function() {
                    this._before = saveState();
                    cards.forEach(v => cardSet.add(v));
                    setEl.textContent = '{ ' + Array.from(cardSet).join(', ') + ' }';
                    Array.from(cardBoxesEl.children).forEach(b => { b.className = 'str-char-box matched'; });
                },
                undo: function() { restoreState(this._before); cardSet.clear(); }
            });

            // Steps for each query
            const results = [];
            queries.forEach((q, i) => {
                const found = cards.indexOf(q) !== -1;
                steps.push({
                    description: q + '이(가) set에 ' + (found ? '있습니다! → 1 ✓' : '없습니다! → 0 ✗') + '  (O(1) 조회)',
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        // Reset previous query highlight
                        Array.from(queryBoxesEl.children).forEach(b => {
                            if (b.classList.contains('comparing')) {
                                b.classList.remove('comparing');
                            }
                        });
                        queryBoxesEl.children[i].classList.add('comparing');
                        if (found) {
                            queryBoxesEl.children[i].style.background = 'var(--green)';
                            queryBoxesEl.children[i].style.color = '#fff';
                        } else {
                            queryBoxesEl.children[i].style.background = 'var(--red, #e17055)';
                            queryBoxesEl.children[i].style.color = '#fff';
                        }
                        results.push(found ? 1 : 0);
                        resultEl.innerHTML = '<span style="font-family:monospace;">' + results.join(' ') + '</span>';
                    },
                    undo: function() { restoreState(this._before); results.pop(); }
                });
            });

            // Final step
            steps.push({
                description: '완료! 모든 수에 대해 카드 보유 여부를 O(1)에 확인했습니다. 총 시간: O(N + M)',
                _before: null,
                action: function() {
                    this._before = saveState();
                    Array.from(queryBoxesEl.children).forEach(b => { b.classList.remove('comparing'); });
                    resultEl.innerHTML = '<span style="color:var(--green);font-family:monospace;font-weight:700;">' + results.join(' ') + '</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            self._initStepController(container, steps, '-nc');
        }

        container.querySelector('#ht-nc-start').addEventListener('click', buildAndRun);
        buildAndRun();
    },

    // ===== 문제별 시뮬레이션: Contains Duplicate =====
    _renderVizContainsDup(container) {
        const self = this;
        const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6];
        container.innerHTML = `
            ${self._createStepDesc('-cd')}
            <div class="sim-card">
                <div style="margin-bottom:16px;">
                    <label>배열: <input type="text" id="ht-cd-input" value="${DEFAULT_ARR.join(', ')}" style="width:280px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <button class="btn btn-primary" id="ht-cd-start" style="margin-left:8px;">🔄</button>
                </div>
                <div id="ht-cd-boxes" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>
                <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px;">
                    <div>HashSet: <span id="ht-cd-set" style="font-weight:600;color:var(--accent);">{ }</span></div>
                    <div>결과: <span id="ht-cd-result" style="font-weight:600;">—</span></div>
                </div>
            </div>
            ${self._createStepControls('-cd')}
        `;
        const boxesEl = container.querySelector('#ht-cd-boxes');
        const setEl = container.querySelector('#ht-cd-set');
        const resultEl = container.querySelector('#ht-cd-result');

        container.querySelector('#ht-cd-start').addEventListener('click', function() {
            self._clearVizState();
            const arr = container.querySelector('#ht-cd-input').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            boxesEl.innerHTML = '';
            arr.forEach((v, i) => { const b = document.createElement('div'); b.className = 'str-char-box'; b.textContent = v; b.dataset.idx = i; boxesEl.appendChild(b); });
            setEl.textContent = '{ }'; resultEl.textContent = '—';

            function saveState() {
                return { boxes: Array.from(boxesEl.children).map(b => b.className), set: setEl.textContent, result: resultEl.textContent };
            }
            function restoreState(s) {
                Array.from(boxesEl.children).forEach((b, i) => b.className = s.boxes[i]);
                setEl.textContent = s.set; resultEl.textContent = s.result;
            }

            const steps = [];
            const seen = new Set();
            const buildSeen = new Set();
            let found = false;
            arr.forEach((v, i) => {
                if (found) return;
                const isDup = buildSeen.has(v);
                buildSeen.add(v);
                if (isDup) found = true;
                steps.push({ description: isDup ? `${v} → set에 이미 있으므로 중복 발견! 🎉` : `${v} → set에 없으므로 처음 보는 값! set에 저장해서 나중에 같은 값이 오면 잡을 수 있게 합니다.`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        Array.from(boxesEl.children).forEach(b => { if (b.classList.contains('comparing')) b.className = 'str-char-box matched'; });
                        boxesEl.children[i].className = 'str-char-box comparing';
                        if (seen.has(v)) {
                            resultEl.innerHTML = '<span style="color:var(--green);">✓ 중복 발견! → true</span>';
                            boxesEl.children[i].className = 'str-char-box' + ' comparing';
                            boxesEl.children[i].style.background = '#e17055'; boxesEl.children[i].style.color = '#fff';
                            found = true;
                        } else {
                            seen.add(v);
                            setEl.textContent = '{ ' + Array.from(seen).join(', ') + ' }';
                        }
                    },
                    undo: function() { restoreState(this._before); if (found) { found = false; seen.delete(v); } boxesEl.children[i].style.background = ''; boxesEl.children[i].style.color = ''; }
                });
            });
            if (!found) {
                steps.push({ description: '전부 확인 → 중복 없음!', _before: null,
                    action: function() { this._before = saveState(); resultEl.innerHTML = '<span style="color:var(--accent);">중복 없음 → false</span>'; },
                    undo: function() { restoreState(this._before); }
                });
            }
            found = false;
            self._initStepController(container, steps, '-cd');
        });
        container.querySelector('#ht-cd-start').click();
    },

    // ===== 문제별 시뮬레이션: Longest Substring Without Repeating =====
    _renderVizLongestSub(container) {
        const self = this;
        const DEFAULT_STR = 'abcabcbb';
        container.innerHTML = `
            ${self._createStepDesc('-ls')}
            <div class="sim-card">
                <div style="margin-bottom:16px;">
                    <label>문자열: <input type="text" id="ht-ls-input" value="${DEFAULT_STR}" style="width:200px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <button class="btn btn-primary" id="ht-ls-start" style="margin-left:8px;">🔄</button>
                </div>
                <div id="ht-ls-boxes" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>
                <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px;">
                    <div>seen: <span id="ht-ls-map" style="font-weight:600;color:var(--accent);">{ }</span></div>
                    <div>start = <span id="ht-ls-start-val" style="font-weight:600;">0</span></div>
                    <div>최대 길이 = <span id="ht-ls-max" style="font-weight:600;color:var(--green);">0</span></div>
                </div>
            </div>
            ${self._createStepControls('-ls')}
        `;
        const boxesEl = container.querySelector('#ht-ls-boxes');
        const mapEl = container.querySelector('#ht-ls-map');
        const startValEl = container.querySelector('#ht-ls-start-val');
        const maxEl = container.querySelector('#ht-ls-max');

        container.querySelector('#ht-ls-start').addEventListener('click', function() {
            self._clearVizState();
            const s = container.querySelector('#ht-ls-input').value;
            boxesEl.innerHTML = '';
            s.split('').forEach((c, i) => { const b = document.createElement('div'); b.className = 'str-char-box'; b.textContent = c; b.dataset.idx = i; boxesEl.appendChild(b); });
            mapEl.textContent = '{ }'; startValEl.textContent = '0'; maxEl.textContent = '0';

            function saveState() {
                return { boxes: Array.from(boxesEl.children).map(b => b.className), map: mapEl.textContent, start: startValEl.textContent, max: maxEl.textContent };
            }
            function restoreState(st) {
                Array.from(boxesEl.children).forEach((b, i) => b.className = st.boxes[i]);
                mapEl.textContent = st.map; startValEl.textContent = st.start; maxEl.textContent = st.max;
            }

            const steps = [];
            const seen = {};
            let start = 0, maxLen = 0;
            for (let i = 0; i < s.length; i++) {
                const c = s[i];
                const oldStart = start;
                if (seen[c] !== undefined && seen[c] >= start) start = seen[c] + 1;
                seen[c] = i;
                const curLen = i - start + 1;
                if (curLen > maxLen) maxLen = curLen;

                const capturedStart = start, capturedMax = maxLen, capturedSeen = JSON.parse(JSON.stringify(seen));
                const movedStart = start !== oldStart;
                steps.push({ description: `'${c}' → ${movedStart ? '이전에 본 적 있으므로 윈도우 시작을 중복 다음으로 이동! ' : '새 문자이므로 윈도우 확장. '}현재 윈도우 길이 ${curLen}${curLen === capturedMax && curLen > 0 ? ' → 최대 갱신! 🎉' : ''}`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        Array.from(boxesEl.children).forEach((b, j) => {
                            b.className = 'str-char-box' + (j >= capturedStart && j <= i ? ' matched' : '');
                        });
                        boxesEl.children[i].className = 'str-char-box comparing';
                        const mapEntries = Object.entries(capturedSeen).map(([k, v]) => `'${k}':${v}`).join(', ');
                        mapEl.textContent = '{ ' + mapEntries + ' }';
                        startValEl.textContent = capturedStart;
                        maxEl.textContent = capturedMax;
                    },
                    undo: function() { restoreState(this._before); }
                });
            }
            steps.push({ description: `완료! 최대 ${maxLen} 🎉`, _before: null,
                action: function() { this._before = saveState(); maxEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;">✓ ' + maxLen + '</span>'; },
                undo: function() { restoreState(this._before); }
            });
            self._initStepController(container, steps, '-ls');
        });
        container.querySelector('#ht-ls-start').click();
    },

    // ===== 문제별 시뮬레이션: Subarray Sum Equals K =====
    _renderVizSubarraySum(container) {
        const self = this;
        const DEFAULT_ARR = [1, 2, 1, 3, 2, 1, 1, 2];
        const DEFAULT_K = 3;
        container.innerHTML = `
            ${self._createStepDesc('-ss')}
            <div class="sim-card">
                <div style="margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
                    <label>배열: <input type="text" id="ht-ss-input" value="${DEFAULT_ARR.join(', ')}" style="width:280px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <label>k: <input type="number" id="ht-ss-k" value="${DEFAULT_K}" style="width:60px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <button class="btn btn-primary" id="ht-ss-start">🔄</button>
                    <span style="margin-left:auto;font-size:0.88rem;color:var(--text2);">찾은 부분배열: <strong id="ht-ss-cnt" style="color:var(--green);">0</strong></span>
                </div>
                <div id="ht-ss-boxes" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>
                <div id="ht-ss-bars" style="margin-bottom:16px;width:100%;"></div>
                <div style="margin-bottom:12px;width:100%;">
                    <div style="font-weight:600;margin-bottom:6px;font-size:0.88rem;color:var(--text2);">합 기록 <span style="font-weight:400;font-size:0.82rem;">(여기까지의 합이 X였던 적이 몇 번?)</span></div>
                    <div id="ht-ss-pc" style="display:flex;flex-direction:column;gap:3px;"></div>
                </div>
            </div>
            ${self._createStepControls('-ss')}
        `;
        const boxesEl = container.querySelector('#ht-ss-boxes');
        const barsEl = container.querySelector('#ht-ss-bars');
        const pcEl = container.querySelector('#ht-ss-pc');
        const cntEl = container.querySelector('#ht-ss-cnt');

        container.querySelector('#ht-ss-start').addEventListener('click', function() {
            self._clearVizState();
            const arr = container.querySelector('#ht-ss-input').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const k = parseInt(container.querySelector('#ht-ss-k').value) || 0;
            boxesEl.innerHTML = '';
            arr.forEach((v, i) => { const b = document.createElement('div'); b.className = 'str-char-box'; b.textContent = v; b.dataset.idx = i; boxesEl.appendChild(b); });
            // ──── 누적합 바 차트 ────
            var prefixSums = [];
            var runSum = 0;
            arr.forEach(function(v) { runSum += v; prefixSums.push(runSum); });
            var maxPS = Math.max.apply(null, prefixSums);
            if (maxPS <= 0) maxPS = 1;

            function renderBars(upToIdx, matchStart, matchEnd, matchPrevSum) {
                if (upToIdx < 0) { barsEl.innerHTML = ''; return; }
                var html = '<div style="display:flex;flex-direction:column;gap:5px;padding:12px 0;">';
                for (var bi = 0; bi <= upToIdx && bi < prefixSums.length; bi++) {
                    var ps = prefixSums[bi];
                    var pct = Math.max(Math.round((ps / maxPS) * 100), 10);
                    var isMatch = (matchStart !== undefined && bi >= matchStart && bi <= matchEnd);
                    var isCurrent = (bi === upToIdx);
                    var barColor = isCurrent ? 'var(--accent)' : 'rgba(108,92,231,0.45)';
                    html += '<div style="display:flex;align-items:center;gap:10px;">';
                    html += '<span style="font-size:0.82rem;color:var(--text2);min-width:20px;text-align:right;font-weight:600;">' + bi + '</span>';
                    if (isMatch && matchPrevSum !== undefined && isCurrent) {
                        var prevPct = Math.max(Math.round((matchPrevSum / maxPS) * 100), 0);
                        var kPct = pct - prevPct;
                        if (kPct < 8) kPct = 8;
                        html += '<div style="flex:0 0 ' + pct + '%;display:flex;height:36px;align-items:stretch;">';
                        if (matchPrevSum > 0) {
                            html += '<div style="flex:0 0 ' + prevPct + '%;background:rgba(108,92,231,0.3);border-radius:8px 0 0 8px;display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:0.85rem;font-weight:700;border-right:2px dashed rgba(255,255,255,0.8);">' + matchPrevSum + '</div>';
                        }
                        html += '<div style="flex:0 0 ' + kPct + '%;background:var(--green);border-radius:' + (matchPrevSum > 0 ? '0 8px 8px 0' : '8px') + ';display:flex;align-items:center;justify-content:center;color:white;font-size:1rem;font-weight:800;box-shadow:0 0 16px rgba(0,184,148,0.4);">' + (ps - matchPrevSum) + '</div>';
                        html += '</div>';
                        html += '<span style="font-size:0.95rem;font-weight:800;color:var(--green);">' + matchPrevSum + ' + <u>' + (ps - matchPrevSum) + '</u> = ' + ps + '</span>';
                    } else {
                        html += '<div style="flex:0 0 ' + pct + '%;height:36px;background:' + barColor + ';border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:0.92rem;font-weight:700;' + (isCurrent ? 'box-shadow:0 0 10px rgba(108,92,231,0.4);' : '') + '">' + ps + '</div>';
                    }
                    html += '</div>';
                }
                html += '</div>';
                barsEl.innerHTML = html;
            }

            function renderPcTable(pc, highlightKey) {
                return Object.entries(pc).map(function(e) {
                    var key = e[0], val = e[1];
                    var isHL = highlightKey !== undefined && String(key) === String(highlightKey);
                    return '<div style="display:flex;gap:8px;align-items:center;padding:5px 12px;border-radius:6px;font-size:0.9rem;' +
                        (isHL ? 'background:rgba(108,92,231,0.15);border:1px solid var(--accent);' : 'background:var(--bg);border:1px solid var(--border);') +
                        '"><span style="color:var(--text2);">합이</span>' +
                        '<span style="font-weight:700;min-width:20px;text-align:center;">' + key + '</span>' +
                        '<span style="color:var(--text2);">이었던 적:</span>' +
                        '<span style="font-weight:700;color:' + (isHL ? 'var(--accent)' : 'var(--text)') + ';">' + val + '번</span>' +
                        (isHL ? '<span style="color:var(--accent);font-weight:600;margin-left:auto;">← 찾음!</span>' : '') + '</div>';
                }).join('');
            }
            pcEl.innerHTML = renderPcTable({0: 1}); cntEl.textContent = '0';

            function saveState() {
                return { boxes: Array.from(boxesEl.children).map(b => ({ cls: b.className, st: b.style.cssText })),
                    pc: pcEl.innerHTML, cnt: cntEl.innerHTML, bars: barsEl.innerHTML };
            }
            function restoreState(s) {
                Array.from(boxesEl.children).forEach((b, i) => { b.className = s.boxes[i].cls; b.style.cssText = s.boxes[i].st; });
                pcEl.innerHTML = s.pc; cntEl.innerHTML = s.cnt; barsEl.innerHTML = s.bars;
            }

            const steps = [];
            const prefixCount = { 0: 1 };
            const prefixLastPos = { 0: -1 };
            let prefixSum = 0, count = 0;

            // ──── 스텝 0: 핵심 아이디어 설명 ────
            steps.push({ description: '<strong>핵심 아이디어</strong> — 구간합 = (여기까지 누적합) − (시작점 누적합). 구간합이 k가 되려면? <strong>시작점 누적합 = 현재 누적합 − k</strong>여야 한다! 그래서 매번 누적합을 해시맵에 저장하고, <strong>현재 − k</strong>가 이전에 있었는지 찾는다. {0:1}은 "합=0인 상태가 1번 있었다"는 뜻.',
                _before: null,
                action: function() {
                    this._before = saveState();
                    pcEl.innerHTML = renderPcTable({0: 1});
                    cntEl.textContent = '0';
                    renderBars(-1);
                },
                undo: function() { restoreState(this._before); }
            });

            arr.forEach((num, i) => {
                prefixSum += num;
                const diff = prefixSum - k;
                const found = prefixCount[diff] || 0;
                var subStart = -1, subEnd = -1;
                if (found > 0 && diff in prefixLastPos) { subStart = prefixLastPos[diff] + 1; subEnd = i; }

                const countBefore = count;
                count += found;
                const countAfter = count;

                const pcBeforeRecord = JSON.parse(JSON.stringify(prefixCount));
                prefixCount[prefixSum] = (prefixCount[prefixSum] || 0) + 1;
                if (!(prefixSum in prefixLastPos)) prefixLastPos[prefixSum] = i;
                const pcAfterRecord = JSON.parse(JSON.stringify(prefixCount));

                // 캡처
                const cs = prefixSum, cd = diff, cf = found;
                const cSS = subStart, cSE = subEnd;
                var formula = arr.slice(0, i + 1).join(' + ') + ' = <strong>' + cs + '</strong>';
                var prevPos = cSS >= 0 ? cSS - 1 : -99;
                var prevPosLabel = prevPos < 0 ? '시작 전' : prevPos + '번 인덱스';

                // ──── 스텝 A: 더하기 ────
                (function(ci, ccs, cformula, cpcBefore, ccountBefore) {
                steps.push({ description: '<strong>[' + ci + '번]</strong> 누적합 = ' + cformula,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        Array.from(boxesEl.children).forEach(function(b, j) { b.className = 'str-char-box' + (j < ci ? ' matched' : ''); b.style.cssText = ''; });
                        boxesEl.children[ci].className = 'str-char-box comparing';
                        pcEl.innerHTML = renderPcTable(cpcBefore);
                        cntEl.textContent = ccountBefore;
                        renderBars(ci);
                    },
                    undo: function() { restoreState(this._before); }
                });
                })(i, cs, formula, pcBeforeRecord, countBefore);

                if (cf > 0) {
                    // ──── 스텝 B: 찾기 (매치 있음) ────
                    (function(ci, ccs, ccd, cprevPosLabel, cpcBefore, ccountBefore) {
                    steps.push({ description: ccs + ' − k(' + k + ') = <strong>' + ccd + '</strong> → 해시맵에 있나? <span style="color:var(--green);font-weight:700;">있다!</span> (' + cprevPosLabel + ')',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            Array.from(boxesEl.children).forEach(function(b, j) { b.className = 'str-char-box' + (j < ci ? ' matched' : ''); b.style.cssText = ''; });
                            boxesEl.children[ci].className = 'str-char-box comparing';
                            pcEl.innerHTML = renderPcTable(cpcBefore, ccd);
                            cntEl.textContent = ccountBefore;
                            renderBars(ci);
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    })(i, cs, cd, prevPosLabel, pcBeforeRecord, countBefore);

                    // ──── 스텝 C: 발견! — 바 차트에서 k 부분을 분리해서 보여줌 ────
                    var subArr = arr.slice(cSS, cSE + 1);

                    (function(ci, ccs, ccd, ccSS, ccSE, csubArr, cpcAfter, ccountAfter) {
                    steps.push({ description: '<span style="color:var(--green);font-weight:700;">🎯 발견!</span> [' + csubArr.join(', ') + '] → 합 = ' + ccs + ' − ' + ccd + ' = <strong>' + k + '</strong> = k!',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            Array.from(boxesEl.children).forEach(function(b, j) { b.className = 'str-char-box' + (j <= ci ? ' matched' : ''); b.style.cssText = ''; });
                            boxesEl.children[ci].className = 'str-char-box comparing';
                            for (var j = ccSS; j <= ccSE; j++) {
                                boxesEl.children[j].style.cssText = 'border-bottom:3px solid var(--green);background:rgba(0,184,148,0.12);';
                            }
                            pcEl.innerHTML = renderPcTable(cpcAfter);
                            cntEl.textContent = ccountAfter;
                            renderBars(ci, ccSS, ccSE, ccd);
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    })(i, cs, cd, cSS, cSE, subArr, pcAfterRecord, countAfter);
                } else {
                    // ──── 스텝 B: 찾기 (매치 없음) ────
                    (function(ci, ccs, ccd, cpcAfter, ccountAfter) {
                    steps.push({ description: ccs + ' − k(' + k + ') = <strong>' + ccd + '</strong> → 해시맵에 있나? <span style="color:var(--text3);">없다.</span> 누적합 ' + ccs + ' 기록 후 다음으로.',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            Array.from(boxesEl.children).forEach(function(b, j) { b.className = 'str-char-box' + (j <= ci ? ' matched' : ''); b.style.cssText = ''; });
                            boxesEl.children[ci].className = 'str-char-box comparing';
                            pcEl.innerHTML = renderPcTable(cpcAfter);
                            cntEl.textContent = ccountAfter;
                            renderBars(ci);
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    })(i, cs, cd, pcAfterRecord, countAfter);
                }
            });

            steps.push({ description: '완료! 합 ' + k + '인 부분배열 총 ' + count + '개 🎉', _before: null,
                action: function() {
                    this._before = saveState();
                    Array.from(boxesEl.children).forEach(function(b) { b.className = 'str-char-box matched'; b.style.cssText = ''; });
                    cntEl.innerHTML = '<span style="color:var(--green);">' + count + '</span>';
                },
                undo: function() { restoreState(this._before); }
            });
            self._initStepController(container, steps, '-ss');
        });
        container.querySelector('#ht-ss-start').click();
    },

    // ===== 문제별 시뮬레이션: 회사에 있는 사람 =====
    _renderVizCompany(container) {
        const self = this;
        const DEFAULT_LOGS = 'Baha enter, Asber enter, Baha leave, Artem enter';

        function parseLogs(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/);
                if (parts.length < 2) return null;
                var name = parts[0];
                var action = parts[1].toLowerCase();
                if (action !== 'enter' && action !== 'leave') return null;
                return { name: name, action: action };
            }).filter(function(x) { return x !== null; });
        }

        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">
                <label style="font-weight:600;">출입 기록: <input type="text" id="ht-company-input" value="${DEFAULT_LOGS}" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:380px;background:var(--card);color:var(--text);"></label>
                <button class="btn btn-primary" id="ht-company-reset">🔄</button>
            </div>
            ${self._createStepDesc('-co')}
            <div class="sim-card">
                <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:16px;width:100%;">
                    <div style="flex:1;min-width:180px;">
                        <div style="font-weight:700;margin-bottom:8px;">출입 기록</div>
                        <div id="ht-co-logs" style="display:flex;flex-direction:column;gap:4px;"></div>
                    </div>
                    <div style="flex:1;min-width:180px;">
                        <div style="font-weight:700;margin-bottom:8px;">회사에 있는 사람 (Set)</div>
                        <div id="ht-co-set" class="graph-queue-display" style="min-height:60px;padding:12px;font-size:0.95rem;">{ }</div>
                    </div>
                </div>
                <div>결과 (사전 역순): <span id="ht-co-result" style="font-weight:600;">\u2014</span></div>
            </div>
            ${self._createStepControls('-co')}
        `;
        const logsEl = container.querySelector('#ht-co-logs');
        const setEl = container.querySelector('#ht-co-set');
        const resultEl = container.querySelector('#ht-co-result');

        function renderLogRows(logs) {
            logsEl.innerHTML = '';
            logs.forEach(function(log, i) {
                const row = document.createElement('div');
                row.className = 'str-char-box';
                row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
                row.innerHTML = '<span style="font-weight:600;">' + log.name + '</span> <span style="color:' + (log.action === 'enter' ? 'var(--green)' : 'var(--red, #e17055)') + '">' + log.action + '</span>';
                row.dataset.idx = i;
                logsEl.appendChild(row);
            });
        }

        function saveState() {
            return { logs: Array.from(logsEl.children).map(r => r.className), set: setEl.textContent, result: resultEl.textContent };
        }
        function restoreState(s) {
            Array.from(logsEl.children).forEach((r, i) => { r.className = s.logs[i]; r.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;'; });
            setEl.textContent = s.set; resultEl.textContent = s.result;
        }

        function buildAndRun() {
            self._clearVizState();
            var logs = parseLogs(container.querySelector('#ht-company-input').value);
            if (logs.length === 0) logs = parseLogs(DEFAULT_LOGS);

            renderLogRows(logs);
            setEl.textContent = '{ }';
            resultEl.textContent = '\u2014';

            const steps = [];
            const company = new Set();
            logs.forEach(function(log, i) {
                const isEnter = log.action === 'enter';
                steps.push({ description: log.name + ' ' + (isEnter ? '입장! 📥 set에 추가하여 현재 회사에 있는 사람으로 기록합니다.' : '퇴장! 📤 set에서 제거하여 더 이상 회사에 없음을 표시합니다.'),
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        Array.from(logsEl.children).forEach(r => { if (r.classList.contains('comparing')) { r.className = 'str-char-box matched'; r.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;'; } });
                        logsEl.children[i].className = 'str-char-box comparing';
                        logsEl.children[i].style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
                        if (isEnter) company.add(log.name); else company.delete(log.name);
                        setEl.textContent = company.size > 0 ? '{ ' + Array.from(company).join(', ') + ' }' : '{ }';
                    },
                    undo: function() { restoreState(this._before); if (isEnter) company.delete(log.name); else company.add(log.name); }
                });
            });
            steps.push({ description: '사전 역순 정렬! 🎉', _before: null,
                action: function() {
                    this._before = saveState();
                    const sorted = Array.from(company).sort().reverse();
                    resultEl.innerHTML = '<span style="color:var(--green);">' + sorted.join(', ') + '</span>';
                },
                undo: function() { restoreState(this._before); }
            });
            self._initStepController(container, steps, '-co');
        }

        container.querySelector('#ht-company-reset').addEventListener('click', buildAndRun);
        buildAndRun();
    },

    // ===== 문제풀이 탭 =====
    stages: [
        { num: 1, title: '숫자 카드', desc: '해시 기반 O(1) 탐색', problemIds: ['boj-10815'] },
        { num: 2, title: '해시맵 기본', desc: '빈도수, 존재 확인, 집합 (Easy~Silver)', problemIds: ['lc-217', 'boj-7785'] },
        { num: 3, title: '해시맵 응용', desc: '슬라이딩 윈도우, 연속 부분 배열 (Medium~Gold)', problemIds: ['lc-3', 'lc-560'] }
    ],

    problems: [
        {
            id: 'boj-10815',
            title: 'BOJ 10815 - 숫자 카드',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10815',
            descriptionHTML: `<h3>문제</h3>
                <p>숫자 카드는 정수 하나가 적혀져 있는 카드이다. 상근이는 숫자 카드 N장을 가지고 있다. 정수 M개가 주어졌을 때, 이 수가 적혀있는 숫자 카드를 상근이가 가지고 있는지 아닌지를 구하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 상근이가 가지고 있는 숫자 카드의 개수 N (1 &le; N &le; 500,000)이 주어진다. 둘째 줄에는 숫자 카드에 적혀있는 정수가 주어진다. 숫자 카드에 적혀있는 수는 -10,000,000보다 크거나 같고, 10,000,000보다 작거나 같다.</p>
                <p>셋째 줄에는 M (1 &le; M &le; 500,000)이 주어진다. 넷째 줄에는 상근이가 가지고 있는 숫자 카드인지 아닌지를 구해야 할 M개의 정수가 주어지며, 이 수는 공백으로 구분되어 있다. 이 수도 -10,000,000보다 크거나 같고, 10,000,000보다 작거나 같다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 입력으로 주어진 M개의 수에 대해서, 각 수가 적힌 숫자 카드를 상근이가 가지고 있으면 1을, 아니면 0을 공백으로 구분해 출력한다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5
6 3 2 10 -10
8
10 9 -5 2 3 4 5 -10</pre></div>
                    <div><strong>출력</strong><pre>1 0 0 1 1 0 0 1</pre></div>
                </div>
                <p class="example-explain">카드 {6, 3, 2, 10, -10}을 가지고 있을 때, 10→있음(1), 9→없음(0), -5→없음(0), 2→있음(1), 3→있음(1), 4→없음(0), 5→없음(0), -10→있음(1)</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 500,000</li>
                    <li>1 ≤ M ≤ 500,000</li>
                    <li>카드에 적힌 수: -10,000,000 ≤ x ≤ 10,000,000</li>
                </ul>`,
            hints: [
                { title: '처음 떠오르는 방법은?', content: 'M개의 수 각각에 대해 N장의 카드를 하나씩 비교하면 될 것 같아요.<br>이중 for문으로 모든 조합을 확인하면 됩니다!<br><br>근데… N과 M이 최대 <strong>50만</strong>이면?<div style="display:flex;gap:14px;margin:14px 0;align-items:end;justify-content:center;"><div style="text-align:center;"><div style="background:#ff6b6b;width:52px;height:90px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;color:white;font-size:0.75rem;font-weight:700;">O(N×M)</div><div style="font-size:0.75rem;margin-top:4px;color:var(--text3);">이중 for문</div></div><div style="text-align:center;"><div style="background:#51cf66;width:52px;height:18px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:4px;color:white;font-size:0.75rem;font-weight:700;">O(N+M)</div><div style="font-size:0.75rem;margin-top:4px;color:var(--text3);">Set 활용</div></div></div>2,500억 번 비교… 시간 초과!' },
                { title: '"가지고 있나?" → 빠르게 찾는 방법', content: '카드 번호들을 <strong>어딘가에 저장</strong>해두고, 각 수에 대해 "이 번호가 있나?"를 빠르게 확인하면 돼요.<br><br>배열을 처음부터 끝까지 보는 건 O(n)… 더 빠른 방법이 있을까요?<br><br><strong>Set(집합)</strong>을 쓰면 "이 값이 있나?"를 <strong>O(1)</strong>에 확인할 수 있어요!<br><span class="lang-py">Python: <code>set()</code>의 <code>in</code> 연산자 → O(1)</span><span class="lang-cpp">C++: <code>unordered_set</code>의 <code>count()</code> → O(1)</span>' },
                { title: 'Set으로 풀어보자', content: '① 카드 N장의 숫자를 set에 넣는다 → O(N)<br>② M개의 수 각각에 대해 set에 있는지 확인 → O(1) × M = O(M)<br><br>전체: <strong>O(N + M)</strong> — 이중 for문의 O(N×M)보다 훨씬 빠릅니다!<br><br><span class="lang-py"><code>cards = set(map(int, input().split()))</code><br><code>1 if x in cards else 0</code></span><span class="lang-cpp"><code>unordered_set&lt;int&gt; cards(arr, arr+n);</code><br><code>cards.count(x) ? 1 : 0</code></span>' },
                { title: '정렬 + 이분탐색으로도 풀 수 있어요', content: '카드를 <strong>정렬</strong>한 뒤, 각 수에 대해 <strong>이분탐색</strong>으로 찾으면?<br>정렬 O(N log N) + 탐색 O(M log N) = <strong>O((N+M) log N)</strong><br><br>Set 풀이의 O(N+M)보다는 느리지만, 충분히 빠르고 추가 메모리도 적게 씁니다.<br><br><span class="lang-py"><code>bisect_left</code>: 정렬된 배열에서 삽입 위치를 이분탐색으로 찾는 함수</span><span class="lang-cpp"><code>binary_search</code>: 정렬된 배열에서 값이 존재하는지 이분탐색으로 확인</span>' }
            ],
            simIntro: '카드를 set에 넣고, 각 수에 대해 O(1) 탐색하는 과정을 확인해보세요!',
            inputDefault: 0, solve() { return '1 0 0 1 1 0 0 1'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

n = int(input())
cards = set(map(int, input().split()))  # set에 카드 저장 → O(N)
m = int(input())
queries = list(map(int, input().split()))

# 각 수에 대해 set에 있는지 O(1) 확인
print(' '.join('1' if x in cards else '0' for x in queries))`,
                cpp: `#include <iostream>
#include <unordered_set>
using namespace std;

int main() {
    int n; scanf("%d", &n);
    unordered_set<int> cards;
    for (int i = 0; i < n; i++) {
        int x; scanf("%d", &x);
        cards.insert(x);  // set에 카드 저장 → O(1) 삽입
    }
    int m; scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        int x; scanf("%d", &x);
        // O(1) 존재 확인
        printf("%d ", cards.count(x) ? 1 : 0);
    }
}`
            },
            solutions: [{
                approach: '브루트포스',
                description: '각 수에 대해 카드 배열을 전부 탐색하여 존재 여부 확인',
                timeComplexity: 'O(N × M)',
                spaceComplexity: 'O(N)',
                templates: {
                    python: `import sys
input = sys.stdin.readline

n = int(input())
cards = list(map(int, input().split()))
m = int(input())
queries = list(map(int, input().split()))

result = []
for q in queries:
    found = 0
    for c in cards:       # 매번 N장 전부 확인 → O(N)
        if c == q:
            found = 1
            break
    result.append(str(found))
print(' '.join(result))`,
                    cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n; scanf("%d", &n);
    vector<int> cards(n);
    for (int i = 0; i < n; i++) scanf("%d", &cards[i]);
    int m; scanf("%d", &m);
    for (int i = 0; i < m; i++) {
        int x; scanf("%d", &x);
        int found = 0;
        for (int j = 0; j < n; j++) {  // 매번 N장 전부 확인
            if (cards[j] == x) { found = 1; break; }
        }
        printf("%d ", found);
    }
}`
                }
            }, {
                approach: 'Set 활용',
                description: '카드를 set에 저장하고 O(1)에 존재 여부 확인',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N)',
                get templates() { return hashTableTopic.problems[0].templates; },
                codeSteps: {
                    python: [
                        { title: '입력 받기', desc: 'BOJ는 입력이 많을 수 있으므로 sys.stdin.readline으로\n빠른 입력을 설정합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())' },
                        { title: '카드를 set에 저장', desc: '핵심: set은 "이 값이 있나?"를 O(1)에 확인!\nN장의 카드를 set에 넣으면 이후 조회가 빠릅니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncards = set(map(int, input().split()))  # O(N)으로 set 생성' },
                        { title: 'M개의 수 확인', desc: '각 수에 대해 "in cards"로 O(1) 확인!\nset의 해시 기반 조회 덕분에 전체 O(M)으로 처리됩니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncards = set(map(int, input().split()))  # O(N)으로 set 생성\nm = int(input())\nqueries = list(map(int, input().split()))\n\n# 각 수: set에 있나? → O(1) × M번 = O(M)\nprint(\' \'.join(\'1\' if x in cards else \'0\' for x in queries))' }
                    ],
                    cpp: [
                        { title: '헤더 + set 선언', desc: 'unordered_set은 해시 기반이라 조회가 O(1)!\nset(트리 기반)은 O(log N)이므로 unordered_set을 선택합니다.', code: '#include <iostream>\n#include <unordered_set>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    unordered_set<int> cards;' },
                        { title: '카드 저장', desc: 'N장의 카드를 하나씩 읽어서 unordered_set에 삽입합니다.\n삽입도 평균 O(1)이므로 전체 O(N).', code: '#include <iostream>\n#include <unordered_set>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    unordered_set<int> cards;\n    for (int i = 0; i < n; i++) {\n        int x; scanf("%d", &x);\n        cards.insert(x);  // O(1) 삽입\n    }' },
                        { title: '쿼리 처리 + 출력', desc: 'count()로 존재 여부를 O(1)에 확인.\n있으면 1, 없으면 0을 출력합니다.', code: '#include <iostream>\n#include <unordered_set>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    unordered_set<int> cards;\n    for (int i = 0; i < n; i++) {\n        int x; scanf("%d", &x);\n        cards.insert(x);  // O(1) 삽입\n    }\n    int m; scanf("%d", &m);\n    for (int i = 0; i < m; i++) {\n        int x; scanf("%d", &x);\n        printf("%d ", cards.count(x) ? 1 : 0);  // O(1) 조회\n    }\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-217',
            title: 'LeetCode 217 - Contains Duplicate',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/contains-duplicate/',
            descriptionHTML: `<h3>문제</h3>
                <p>정수 배열 <code>nums</code>에 <strong>중복된 원소</strong>가 있으면 <code>true</code>, 없으면 <code>false</code>를 반환하세요.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [1,2,3,1]</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [1,2,3,4]</pre></div>
                    <div><strong>출력</strong><pre>false</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [1,1,1,3,3,4,3,2,4,2]</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ nums.length ≤ 10⁵</li>
                    <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>정렬을 이용하면 추가 공간 없이 풀 수 있을까요?</p>`,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: '<code>[1, 2, 3, 1]</code>에서 <strong>1이 두 번</strong> 나오니까 중복이 있어요 → <code>true</code>.<br><code>[1, 2, 3, 4]</code>는 전부 다른 숫자 → <code>false</code>.<br>결국 <strong>"같은 숫자가 두 번 이상 나오는지"</strong>만 확인하면 됩니다!' },
                { title: '가장 단순한 방법은?', content: '모든 숫자 쌍을 비교하는 거예요. 첫 번째 숫자를 나머지 전부와 비교, 두 번째도 전부와 비교…<br>이중 for문이면 되지만, 숫자가 <strong>10만 개</strong>면 약 <strong>50억 번</strong> 비교해야 해요! 너무 느립니다 😱' },
                { title: '"전에 본 적 있나?" 기억하기', content: '숫자를 하나씩 보면서, <strong>"이 숫자를 전에 본 적 있나?"</strong>를 확인하면 어떨까요?<br>본 숫자들을 어딘가에 저장해두면 됩니다. 어떤 자료구조가 좋을까요?' },
                { title: 'Set(집합)을 쓰면 O(1)!', content: 'Set은 "이 값이 있나?"를 <strong>O(1)</strong>에 확인해줘요!<div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:10px;"><div style="display:flex;gap:4px;margin-bottom:10px;align-items:center;justify-content:center;"><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;">1</span><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;">2</span><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;">3</span><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#fdcb6e;color:#2d3436;border-radius:8px;font-weight:700;box-shadow:0 0 8px rgba(253,203,110,0.5);">1</span><span style="font-size:1.2em;margin-left:6px;">← 확인!</span></div><div style="text-align:center;"><span style="background:#00b894;color:white;padding:4px 12px;border-radius:6px;font-weight:600;font-size:0.85em;">seen = {1, 2, 3}</span><span style="margin-left:8px;">→ 1이 있다! <strong>중복!</strong></span></div></div>① 숫자를 하나 꺼냄<br>② set에 이미 있나? → 있으면 <code>true</code> 반환!<br>③ 없으면 set에 추가하고 다음 숫자로<br><br><span class="lang-py">Python: <code>set()</code> → <code>in</code>으로 확인, <code>add()</code>로 추가</span><span class="lang-cpp">C++: <code>unordered_set&lt;int&gt;</code> → <code>count()</code>로 확인, <code>insert()</code>로 추가</span><br><br>배열 전체를 한 번만 보니까 <strong>O(n)</strong>이에요.' },
                { title: '정렬로도 풀 수 있어요', content: '배열을 정렬하면 같은 숫자가 <strong>나란히</strong> 놓입니다.<br><code>[1, 3, 1, 2]</code> → 정렬 → <code>[1, 1, 2, 3]</code><br>옆 칸이랑만 비교하면 되니까 간단해요!<br>대신 정렬에 <strong>O(n log n)</strong>이 걸리고, set 풀이의 O(n)보다는 느립니다.' }
            ],
            simIntro: '배열을 순회하면서 해시셋에 원소를 넣고, 중복을 탐지하는 과정을 확인해보세요!',
            inputDefault: 0, solve() { return 'true'; },
            templates: {
                python: `class Solution:
    def containsDuplicate(self, nums):
        seen = set()
        for n in nums:
            if n in seen: return True
            seen.add(n)
        return False`,
                cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int n : nums) {
            if (seen.count(n)) return true;
            seen.insert(n);
        }
        return false;
    }
};`
            },
            solutions: [{
                approach: '브루트포스',
                description: '이중 for문으로 모든 쌍을 비교하여 중복을 확인',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:
    def containsDuplicate(self, nums):
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] == nums[j]:
                    return True
        return False`,
                    cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        for (int i = 0; i < nums.size(); i++)
            for (int j = i + 1; j < nums.size(); j++)
                if (nums[i] == nums[j]) return true;
        return false;
    }
};`
                }
            }, {
                approach: '해시셋',
                description: '해시셋으로 O(1) 존재 확인하며 순회',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                get templates() { return hashTableTopic.problems[1].templates; },
                codeSteps: {
                    python: [
                        { title: '함수 정의', desc: '정수 배열 nums에 중복이 있는지 확인합니다.', code: 'class Solution:\n    def containsDuplicate(self, nums):' },
                        { title: '해시셋 초기화', desc: 'set은 "이 숫자 본 적 있나?"를 O(1)에 확인 가능!\n리스트의 in은 O(n)이지만 set의 in은 O(1)입니다.', code: 'class Solution:\n    def containsDuplicate(self, nums):\n        # set → O(1)로 포함 여부 확인 가능\n        seen = set()' },
                        { title: '순회하며 중복 체크', desc: '이미 본 숫자면 바로 True 반환 (중복 발견!)\n처음 보는 숫자면 set에 추가하여 기록합니다.', code: 'class Solution:\n    def containsDuplicate(self, nums):\n        seen = set()\n        for n in nums:\n            if n in seen:      # 이미 본 적 있으면 → 중복!\n                return True\n            seen.add(n)        # 처음 보는 숫자 → 기록' },
                        { title: '결과 반환', desc: '모든 숫자를 확인했는데 중복이 없었으면 False입니다.', code: 'class Solution:\n    def containsDuplicate(self, nums):\n        seen = set()\n        for n in nums:\n            if n in seen:\n                return True\n            seen.add(n)\n        return False  # 끝까지 중복 없음' }
                    ],
                    cpp: [
                        { title: '함수 정의 + 셋 초기화', desc: 'unordered_set은 O(1)로 포함 여부 확인이 가능합니다.', code: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // O(1) 조회 가능한 해시셋\n        unordered_set<int> seen;' },
                        { title: '순회하며 중복 체크', desc: '이미 있으면 true (중복!), 없으면 삽입하여 기록합니다.', code: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true; // 중복!\n            seen.insert(n); // 기록\n        }' },
                        { title: '결과 반환', desc: '끝까지 중복 없으면 false입니다.', code: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true;\n            seen.insert(n);\n        }\n        return false;\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'boj-7785',
            title: 'BOJ 7785 - 회사에 있는 사람',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/7785',
            descriptionHTML: `<h3>문제</h3>
                <p>출입 기록이 주어집니다. <code>"enter"</code>면 입장, <code>"leave"</code>면 퇴장입니다.
                현재 회사에 <strong>남아있는 사람</strong>을 사전 역순으로 출력하세요.</p>
                <h4>입력</h4>
                <p>첫째 줄에 출입 기록의 수 n (1 &le; n &le; 10<sup>6</sup>)이 주어진다. 다음 n개의 줄에는 각 직원의 이름과 "enter" 또는 "leave"가 주어진다. 이름은 알파벳 대소문자로 이루어져 있으며, 길이는 1 이상 20 이하이다.</p>
                <h4>출력</h4>
                <p>현재 회사에 있는 모든 사람을 사전 역순으로 한 줄에 한 명씩 출력한다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4
Baha enter
Asber enter
Baha leave
Artem enter</pre></div>
                    <div><strong>출력</strong><pre>Asber
Artem</pre></div>
                </div>
                <p class="example-explain">Baha는 퇴장했으므로, 남은 Asber와 Artem을 사전 역순으로 출력</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2
Kim enter
Kim leave</pre></div>
                    <div><strong>출력</strong><pre>(없음)</pre></div>
                </div>
                <p class="example-explain">모든 사람이 퇴장하여 아무도 남지 않음</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ n ≤ 10⁶</li>
                    <li>이름은 알파벳 대소문자, 길이 1~20</li>
                    <li>같은 이름이 두 번 enter하는 경우는 없음</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>삽입/삭제가 O(1)인 자료구조는 무엇일까요?</p>`,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: '회사 출입문에 카드를 찍어요.<br><code>enter</code> = 출근 (회사에 들어옴)<br><code>leave</code> = 퇴근 (회사에서 나감)<br><br>모든 기록을 다 처리한 뒤, <strong>지금 회사에 남아있는 사람</strong>을 출력하면 됩니다!' },
                { title: '어떤 자료구조가 좋을까?', content: '사람이 <strong>들어오면 추가, 나가면 제거</strong>해야 해요.<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0;"><div style="background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);border-radius:10px;padding:12px;text-align:center;"><div style="font-weight:700;color:#ff6b6b;margin-bottom:4px;">리스트</div><div style="font-size:0.85em;">제거: O(n) — 이름 찾기 느림</div></div><div style="background:rgba(81,207,102,0.1);border:1px solid rgba(81,207,102,0.3);border-radius:10px;padding:12px;text-align:center;"><div style="font-weight:700;color:#51cf66;margin-bottom:4px;">Set(집합)</div><div style="font-size:0.85em;">추가/제거: O(1) — 빠름!</div></div></div><span class="lang-py">Python: <code>set.add()</code> / <code>set.discard()</code></span><span class="lang-cpp">C++: <code>set&lt;string&gt;</code>의 <code>insert()</code> / <code>erase()</code></span>' },
                { title: 'Set으로 풀어보자', content: '빈 set을 만들고, 기록을 하나씩 읽어요:<br><br>① <code>"Baha enter"</code> → set에 Baha 추가<br>② <code>"Asher enter"</code> → set에 Asher 추가<br>③ <code>"Baha leave"</code> → set에서 Baha 제거<br><br>끝! set에 남은 사람 = 회사에 있는 사람' },
                { title: '사전 역순으로 출력하기', content: '남은 사람들을 <strong>사전 역순(Z→A)</strong>으로 출력해야 해요.<br><span class="lang-py">Python: <code>sorted(company, reverse=True)</code></span><span class="lang-cpp">C++: <code>set&lt;string, greater&lt;string&gt;&gt;</code>로 자동 역순, 또는 <code>rbegin()</code>~<code>rend()</code>로 역순 순회</span><br><br>예: {Asher, Cam} → 역순 → Cam, Asher 순서로 출력!' },
                { title: '시간 복잡도', content: '기록 n개를 처리: set 추가/제거 각 O(1) → <strong>O(n)</strong><br>남은 m명 정렬: <strong>O(m log m)</strong><br><br>전체: <strong>O(n + m log m)</strong>이에요.' }
            ],
            simIntro: '출입 기록을 처리하면서 집합(set)에 사람을 추가/제거하는 과정을 확인해보세요!',
            inputDefault: 0, solve() { return 'Asber\\nArtem'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

n = int(input())
company = set()

for _ in range(n):
    name, action = input().split()
    if action == 'enter':
        company.add(name)
    else:
        company.discard(name)

for name in sorted(company, reverse=True):
    print(name)`,
                cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <set>
using namespace std;

int main() {
    int n; scanf("%d", &n);
    set<string, greater<string>> company;
    while (n--) {
        char name[20], action[10];
        scanf("%s %s", name, action);
        if (action[0] == 'e') company.insert(name);
        else company.erase(name);
    }
    for (auto& s : company) printf("%s\\n", s.c_str());
}`
            },
            solutions: [{
                approach: '브루트포스 (리스트)',
                description: '리스트에 추가/선형 탐색 제거 후 정렬',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(n)',
                templates: {
                    python: `import sys
input = sys.stdin.readline

n = int(input())
company = []

for _ in range(n):
    name, action = input().split()
    if action == 'enter':
        company.append(name)
    else:
        company.remove(name)  # O(n) 선형 탐색

company.sort(reverse=True)
for name in company:
    print(name)`,
                    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

int main() {
    int n; scanf("%d", &n);
    vector<string> company;
    while (n--) {
        char name[20], action[10];
        scanf("%s %s", name, action);
        if (action[0] == 'e') {
            company.push_back(name);
        } else {
            // O(n) 선형 탐색 + 삭제
            auto it = find(company.begin(), company.end(), string(name));
            if (it != company.end()) company.erase(it);
        }
    }
    sort(company.rbegin(), company.rend());
    for (auto& s : company) printf("%s\\n", s.c_str());
}`
                }
            }, {
                approach: '집합(Set) 활용',
                description: 'enter시 add, leave시 remove 후 사전 역순 정렬',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                get templates() { return hashTableTopic.problems[4].templates; },
                codeSteps: {
                    python: [
                        { title: '입력 설정', desc: 'BOJ는 입력이 많을 수 있으므로 sys.stdin.readline으로\n빠른 입력을 설정합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())' },
                        { title: '집합(Set) 초기화', desc: '핵심: set은 add/discard가 O(1)!\n리스트의 remove는 O(n)이므로, 출입이 잦으면 set이 훨씬 빠릅니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncompany = set()  # set → add/discard O(1)' },
                        { title: '출입 기록 처리', desc: 'enter → add로 추가, leave → discard로 제거.\ndiscard는 없는 원소여도 에러가 나지 않아 안전합니다.\n(remove는 없으면 KeyError 발생!)', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncompany = set()  # set → add/discard O(1)\n\nfor _ in range(n):\n    name, action = input().split()\n    if action == "enter":\n        company.add(name)      # O(1) 추가\n    else:\n        company.discard(name)  # O(1) 제거 (없어도 OK)' },
                        { title: '사전 역순 출력', desc: 'sorted()로 정렬 후 reverse=True로 역순 출력.\nset은 순서가 없으므로 출력 전 반드시 정렬해야 합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncompany = set()  # set → add/discard O(1)\n\nfor _ in range(n):\n    name, action = input().split()\n    if action == "enter":\n        company.add(name)      # O(1) 추가\n    else:\n        company.discard(name)  # O(1) 제거 (없어도 OK)\n\n# set은 순서 없음 → sorted()로 정렬 필요\nfor name in sorted(company, reverse=True):\n    print(name)' }
                    ],
                    cpp: [
                        { title: '헤더 + 역순 set', desc: 'C++ set은 자동 정렬됨! greater<string>을 넣으면\n삽입할 때마다 사전 역순으로 자동 정렬됩니다.\n→ 마지막에 따로 sort할 필요 없음', code: '#include <iostream>\n#include <string>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    // greater → 삽입 시 자동 역순 정렬\n    set<string, greater<string>> company;' },
                        { title: '출입 기록 처리', desc: 'insert/erase 모두 O(log n) — 리스트의 O(n)보다 빠름.\naction[0] == \'e\'로 간단히 enter/leave 구분합니다.', code: '#include <iostream>\n#include <string>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    // greater → 삽입 시 자동 역순 정렬\n    set<string, greater<string>> company;\n    while (n--) {\n        char name[20], action[10];\n        scanf("%s %s", name, action);\n        if (action[0] == \'e\') company.insert(name);  // O(log n)\n        else company.erase(name);                     // O(log n)\n    }' },
                        { title: '결과 출력', desc: 'set<greater>는 이미 역순 정렬 상태!\n추가 정렬 없이 순서대로 출력하면 됩니다.', code: '#include <iostream>\n#include <string>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    // greater → 삽입 시 자동 역순 정렬\n    set<string, greater<string>> company;\n    while (n--) {\n        char name[20], action[10];\n        scanf("%s %s", name, action);\n        if (action[0] == \'e\') company.insert(name);  // O(log n)\n        else company.erase(name);                     // O(log n)\n    }\n    // 이미 역순 정렬 → 그대로 출력\n    for (auto& s : company) printf("%s\\n", s.c_str());\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-3',
            title: 'LeetCode 3 - Longest Substring Without Repeating',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
            descriptionHTML: `<h3>문제</h3>
                <p>문자열 <code>s</code>에서 <strong>같은 글자가 없는 가장 긴 부분 문자열</strong>의 길이를 구하세요.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>s = "abcabcbb"</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">"abc"가 가장 긴 중복 없는 부분 문자열입니다.</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>s = "bbbbb"</pre></div>
                    <div><strong>출력</strong><pre>1</pre></div>
                </div>
                <p class="example-explain">"b" 한 글자가 최대입니다.</p>
                </div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>s = "pwwkew"</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">"wke"가 답입니다. "pwke"는 부분 수열이지 부분 문자열이 아닙니다.</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>0 ≤ s.length ≤ 5 × 10⁴</li>
                    <li>s는 영문자, 숫자, 기호, 공백으로 구성</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>O(n)으로 한 번 순회하면서 풀 수 있을까요?</p>`,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: '<code>"abcabcbb"</code>에서 중복 없는 구간을 찾아보세요.<br><code>"abc"</code> → 3글자 (중복 없음 ✓)<br><code>"abca"</code> → a가 두 번! (중복 ✗)<br>이런 식으로 <strong>중복 없이 가장 긴 구간</strong>의 길이를 구하면 돼요.' },
                { title: '모든 구간을 다 확인하면?', content: '시작점과 끝점을 잡아서 모든 부분 문자열을 만들어볼 수 있어요.<br>근데 길이가 n이면 부분 문자열이 약 <strong>n²개</strong>… 너무 많습니다!' },
                { title: '슬라이딩 윈도우 아이디어', content: '창문을 밀듯이 <strong>시작점(L)</strong>과 <strong>끝점(R)</strong>을 오른쪽으로 이동해요.<div style="display:flex;gap:3px;align-items:center;margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;justify-content:center;flex-wrap:wrap;"><span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#dfe6e9;color:#b2bec3;border-radius:6px;font-weight:700;text-decoration:line-through;">p</span><span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;box-shadow:0 0 0 2px var(--green);">w</span><span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">k</span><span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;box-shadow:0 0 0 2px var(--green);">e</span><span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#dfe6e9;color:#b2bec3;border-radius:6px;font-weight:700;">w</span></div><div style="display:flex;justify-content:center;gap:12px;margin-bottom:8px;font-size:0.85em;"><span style="color:var(--green);font-weight:600;">L→</span><span style="color:#6c5ce7;font-weight:600;">[w,k,e] = 3</span><span style="color:var(--green);font-weight:600;">←R</span></div>① 중복 없으면 → R을 오른쪽으로 (창문 넓히기)<br>② 중복 발생하면 → L을 오른쪽으로 (창문 좁히기)<br><br>이렇게 하면 모든 구간을 다 안 봐도 답을 찾을 수 있어요!' },
                { title: '해시맵으로 중복 위치 기억하기', content: '글자가 <strong>마지막으로 나타난 위치</strong>를 해시맵에 저장해두면,<br>중복이 생겼을 때 L을 어디로 옮겨야 하는지 바로 알 수 있어요!<br><br><span class="lang-py">Python: <code>seen = {"a": 0, "b": 1}</code> (dict)</span><span class="lang-cpp">C++: <code>unordered_map&lt;char, int&gt; seen;</code></span><br><br>"a"가 또 나오면 → L을 <code>seen["a"] + 1</code>로 이동!' },
                { title: '시간 복잡도는 O(n)', content: 'R이 오른쪽으로만 이동하고, L도 오른쪽으로만 이동합니다.<br>각 글자를 딱 한 번씩만 처리하니까 <strong>O(n)</strong>이에요!' }
            ],
            simIntro: '슬라이딩 윈도우와 해시맵으로 중복 없는 가장 긴 부분 문자열을 찾는 과정을 확인해보세요!',
            inputDefault: 0, solve() { return '3'; },
            templates: {
                python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = {}
        start = max_len = 0
        for i, c in enumerate(s):
            if c in seen and seen[c] >= start:
                start = seen[c] + 1
            seen[c] = i
            max_len = max(max_len, i - start + 1)
        return max_len`,
                cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> seen;
        int start = 0, maxLen = 0;
        for (int i = 0; i < s.size(); i++) {
            if (seen.count(s[i]) && seen[s[i]] >= start)
                start = seen[s[i]] + 1;
            seen[s[i]] = i;
            maxLen = max(maxLen, i - start + 1);
        }
        return maxLen;
    }
};`
            },
            solutions: [{
                approach: '브루트포스',
                description: '모든 부분 문자열을 확인하여 중복 없는 최대 길이를 탐색',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(min(m,n))',
                templates: {
                    python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        max_len = 0
        for i in range(len(s)):
            seen = set()
            for j in range(i, len(s)):
                if s[j] in seen:
                    break
                seen.add(s[j])
            max_len = max(max_len, len(seen))
        return max_len`,
                    cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int maxLen = 0;
        for (int i = 0; i < s.size(); i++) {
            unordered_set<char> seen;
            for (int j = i; j < s.size(); j++) {
                if (seen.count(s[j])) break;
                seen.insert(s[j]);
            }
            maxLen = max(maxLen, (int)seen.size());
        }
        return maxLen;
    }
};`
                }
            }, {
                approach: '슬라이딩 윈도우 + 해시맵',
                description: '해시맵으로 마지막 등장 위치를 기록하며 윈도우 확장',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(min(m,n))',
                get templates() { return hashTableTopic.problems[2].templates; },
                codeSteps: {
                    python: [
                        { title: '함수 정의', desc: '문자열 s에서 중복 없는 가장 긴 부분 문자열의 길이를 구합니다.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:' },
                        { title: '변수 초기화', desc: 'seen: 문자 → 마지막 등장 위치 (중복 체크용)\nstart: 현재 윈도우의 시작점\nmax_len: 지금까지 찾은 최대 길이', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}          # {문자: 마지막 위치}\n        start = max_len = 0' },
                        { title: '문자열 순회', desc: '한 글자씩 보면서 슬라이딩 윈도우를 관리합니다.\ni는 윈도우의 끝(오른쪽), start는 시작(왼쪽)입니다.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):' },
                        { title: '핵심: 중복 문자 처리', desc: '핵심! 이미 본 문자가 현재 윈도우 안에 있다면,\nstart를 그 문자 다음으로 이동 → 중복 제거!\nseen[c] >= start 조건이 "윈도우 안에 있는가"를 확인합니다.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):\n            # 윈도우 안에 같은 문자가 있으면\n            # → start를 그 다음으로 이동 (중복 제거)\n            if c in seen and seen[c] >= start:\n                start = seen[c] + 1' },
                        { title: '위치 기록 + 길이 갱신', desc: '현재 문자 위치를 기록하고,\n윈도우 크기(i - start + 1)와 최대 길이를 비교합니다.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):\n            if c in seen and seen[c] >= start:\n                start = seen[c] + 1\n            seen[c] = i  # 현재 위치 기록\n            max_len = max(max_len, i - start + 1)' },
                        { title: '결과 반환', desc: '중복 없는 가장 긴 부분 문자열의 길이를 반환합니다.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):\n            if c in seen and seen[c] >= start:\n                start = seen[c] + 1\n            seen[c] = i\n            max_len = max(max_len, i - start + 1)\n        return max_len' }
                    ],
                    cpp: [
                        { title: '함수 정의 + 초기화', desc: 'seen: 문자의 마지막 위치 기록 (O(1) 조회)\nstart: 윈도우 시작점, maxLen: 최대 길이', code: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen; // {문자: 위치}\n        int start = 0, maxLen = 0;' },
                        { title: '순회 + 중복 처리', desc: '윈도우 안에 같은 문자가 있으면 start를 이동하여 중복 제거,\n현재 위치 기록 후 윈도우 크기를 최대값과 비교합니다.', code: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen;\n        int start = 0, maxLen = 0;\n        for (int i = 0; i < s.size(); i++) {\n            // 윈도우 안에 중복 → start 이동\n            if (seen.count(s[i]) && seen[s[i]] >= start)\n                start = seen[s[i]] + 1;\n            seen[s[i]] = i; // 위치 기록\n            maxLen = max(maxLen, i - start + 1);\n        }' },
                        { title: '결과 반환', desc: '최대 길이를 반환합니다.', code: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen;\n        int start = 0, maxLen = 0;\n        for (int i = 0; i < s.size(); i++) {\n            if (seen.count(s[i]) && seen[s[i]] >= start)\n                start = seen[s[i]] + 1;\n            seen[s[i]] = i;\n            maxLen = max(maxLen, i - start + 1);\n        }\n        return maxLen;\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'lc-560',
            title: 'LeetCode 560 - Subarray Sum Equals K',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/subarray-sum-equals-k/',
            descriptionHTML: `<h3>문제</h3>
                <p>정수 배열 <code>nums</code>와 정수 <code>k</code>가 주어집니다. 합이 <code>k</code>인 <strong>연속 부분 배열의 개수</strong>를 구하세요.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [1,1,1], k = 2</pre></div>
                    <div><strong>출력</strong><pre>2</pre></div>
                </div>
                <p class="example-explain">[1,1](인덱스 0~1)과 [1,1](1~2) 두 가지</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [1,2,3], k = 3</pre></div>
                    <div><strong>출력</strong><pre>2</pre></div>
                </div>
                <p class="example-explain">[1,2](인덱스 0~1)과 [3](2) 두 가지</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ nums.length ≤ 2 × 10⁴</li>
                    <li>-1000 ≤ nums[i] ≤ 1000</li>
                    <li>-10⁷ ≤ k ≤ 10⁷</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>음수가 있어서 투 포인터가 안 됩니다. 누적합을 활용해보세요!</p>`,
            hints: [
                { title: '문제를 쉽게 이해해보자', content: '<code>[1, 1, 1]</code>에서 합이 2인 <strong>연속 구간</strong>을 찾아보세요.<br><code>[1,1]</code>(0~1번) 합 = 2 ✓<br><code>[1,1]</code>(1~2번) 합 = 2 ✓<br>→ 답은 <strong>2개</strong>입니다!' },
                { title: '모든 구간을 다 확인하면?', content: '시작점 i부터 끝점 j까지 합을 구하면 되지만,<br>이중 for문이라 <strong>O(n²)</strong>이에요. 더 빠른 방법이 있을까요?' },
                { title: '누적합이란?', content: '처음부터 현재까지의 합을 계속 기록하는 거예요.<div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:10px;"><div style="display:flex;gap:4px;margin-bottom:8px;justify-content:center;"><span style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;">1</span><span style="font-size:0.7rem;color:var(--text3);">idx 0</span></span><span style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;">2</span><span style="font-size:0.7rem;color:var(--text3);">idx 1</span></span><span style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;">3</span><span style="font-size:0.7rem;color:var(--text3);">idx 2</span></span></div><div style="text-align:center;margin:6px 0;">⬇️ 누적합</div><div style="display:flex;gap:4px;justify-content:center;"><span style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#00b894;color:white;border-radius:8px;font-weight:700;">1</span></span><span style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#00b894;color:white;border-radius:8px;font-weight:700;">3</span></span><span style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#00b894;color:white;border-radius:8px;font-weight:700;">6</span></span></div></div>구간 [1~2]의 합 = 누적합[2] - 누적합[0] = 6 - 1 = <strong>5</strong><br>이렇게 뺄셈 한 번으로 구간 합을 바로 구할 수 있어요!' },
                { title: '핵심 아이디어: 누적합 - k', content: '지금까지 누적합이 <code>sum</code>인데,<br>이전에 <code>sum - k</code>인 지점이 있었다면?<br>그 지점부터 현재까지의 합이 정확히 <strong>k</strong>가 돼요!<br><br>해시맵에 {누적합: 등장 횟수}를 저장하면<br>"sum - k가 몇 번 나왔나?"를 <strong>O(1)</strong>에 확인 가능!' },
                { title: '초기값을 잊지 마세요', content: '<code>{0: 1}</code>로 시작해야 해요.<br>왜? 누적합 자체가 k인 경우를 놓치지 않기 위해서!<br><br>예: <code>[3]</code>, k=3 → 누적합 3, 3-3=0이 있어야 카운트됨.<br>{0: 1}이 없으면 이 경우를 못 찾아요.' }
            ],
            simIntro: '누적합과 해시맵을 사용하여 합이 k인 부분 배열을 세는 과정을 단계별로 확인해보세요!',
            inputDefault: 0, solve() { return '2'; },
            templates: {
                python: `class Solution:
    def subarraySum(self, nums, k):
        # {누적합: 등장 횟수} 기록
        # {0: 1} → 시작 전(합=0)이 1번 있음
        prefix_count = {0: 1}
        prefix_sum = 0  # 처음~현재까지의 누적합
        count = 0       # 합이 k인 부분 배열 개수
        for num in nums:
            prefix_sum += num  # 누적합 갱신
            # 핵심: prefix_sum - k가 이전에 나왔다면
            # → 그 지점 ~ 현재 구간의 합 = k!
            if (prefix_sum - k) in prefix_count:
                count += prefix_count[prefix_sum - k]
            # 현재 누적합 기록 → 뒤의 원소가 이 값을 찾음
            if prefix_sum in prefix_count:
                prefix_count[prefix_sum] += 1
            else:
                prefix_count[prefix_sum] = 1
        return count`,
                cpp: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        // {누적합: 등장 횟수} - 합=0인 시작점 1개
        unordered_map<int, int> pc;
        pc[0] = 1;
        int sum = 0, cnt = 0; // 누적합, 결과 카운트
        for (int n : nums) {
            sum += n; // 누적합 갱신
            // sum - k가 이전에 나왔다면 → 구간 합 = k
            if (pc.count(sum - k)) cnt += pc[sum - k];
            pc[sum]++; // 현재 누적합 기록
        }
        return cnt;
    }
};`
            },
            solutions: [{
                approach: '브루트포스',
                description: '이중 for문으로 모든 연속 부분 배열의 합을 확인',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:
    def subarraySum(self, nums, k):
        count = 0
        for i in range(len(nums)):
            total = 0
            for j in range(i, len(nums)):
                total += nums[j]
                if total == k:
                    count += 1
        return count`,
                    cpp: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        int cnt = 0;
        for (int i = 0; i < nums.size(); i++) {
            int sum = 0;
            for (int j = i; j < nums.size(); j++) {
                sum += nums[j];
                if (sum == k) cnt++;
            }
        }
        return cnt;
    }
};`
                },
                codeSteps: {
                    python: [
                        { title: '함수 정의 + 카운트', desc: '합이 k인 연속 부분 배열의 개수를 셀 변수를 만듭니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        count = 0  # 합이 k인 부분 배열 개수' },
                        { title: '시작점 i 순회', desc: '부분 배열의 시작 위치를 0부터 끝까지 시도합니다.\n시작할 때마다 구간 합을 0으로 초기화합니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        count = 0\n        # 가능한 모든 시작점 i\n        for i in range(len(nums)):\n            total = 0  # i부터의 구간 합을 새로 시작' },
                        { title: '끝점 j 확장 + 합 비교', desc: '끝점 j를 하나씩 늘리며 합을 누적합니다.\n합이 k이면 카운트를 증가시킵니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        count = 0\n        for i in range(len(nums)):\n            total = 0\n            # 끝점 j를 하나씩 늘리면서 합 확인\n            for j in range(i, len(nums)):\n                total += nums[j]   # 원소를 하나 더 포함\n                if total == k:     # 구간 합 = k이면 카운트!\n                    count += 1' },
                        { title: '결과 반환', desc: '모든 시작-끝 조합을 확인한 후 총 개수를 반환합니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        count = 0\n        for i in range(len(nums)):\n            total = 0\n            for j in range(i, len(nums)):\n                total += nums[j]\n                if total == k:\n                    count += 1\n        return count' }
                    ],
                    cpp: [
                        { title: '함수 정의 + 카운트', desc: '합이 k인 부분 배열을 셀 카운트를 초기화합니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        int cnt = 0; // 합이 k인 부분 배열 개수' },
                        { title: '이중 반복 + 합 비교', desc: '모든 시작점 i와 끝점 j를 시도하며 구간 합을 확인합니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        int cnt = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            int sum = 0; // i부터의 구간 합\n            for (int j = i; j < nums.size(); j++) {\n                sum += nums[j]; // 원소 추가\n                if (sum == k) cnt++; // 합 = k이면 카운트\n            }\n        }' },
                        { title: '결과 반환', desc: '총 개수를 반환합니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        int cnt = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            int sum = 0;\n            for (int j = i; j < nums.size(); j++) {\n                sum += nums[j];\n                if (sum == k) cnt++;\n            }\n        }\n        return cnt;\n    }\n};' }
                    ]
                }
            }, {
                approach: '누적합 + 해시맵',
                description: '누적합의 차이를 해시맵으로 O(1)에 확인',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                get templates() { return hashTableTopic.problems[3].templates; },
                codeSteps: {
                    python: [
                        { title: '함수 정의', desc: '정수 배열 nums와 목표 합 k를 받습니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):' },
                        { title: '누적합 기록 초기화', desc: '{0: 1}은 "시작 전, 합이 0인 지점이 1개 있다"는 뜻입니다.\n이게 없으면 배열 처음부터의 구간 합이 k인 경우를 놓칩니다!', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        # {누적합: 등장 횟수} 기록\n        # {0: 1} → 시작 전(합=0)이 1번 있음\n        prefix_count = {0: 1}' },
                        { title: '변수 초기화', desc: 'prefix_sum: 처음~현재까지의 합을 추적\ncount: 합이 k인 부분 배열 개수', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0  # 처음~현재까지의 누적합\n        count = 0       # 합이 k인 부분 배열 개수' },
                        { title: '반복문 + 누적합 갱신', desc: '배열을 순회하며 원소를 하나씩 더해\n"처음~현재"까지의 합을 구합니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            # 현재 원소를 더해 누적합 갱신\n            prefix_sum += num' },
                        { title: '핵심: 이전 누적합에서 찾기', desc: '핵심 아이디어!\n이전에 "prefix_sum - k"인 누적합이 있었다면,\n그 지점 ~ 현재까지의 구간 합이 정확히 k!\n해시맵 덕분에 O(1)에 확인 가능!', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            prefix_sum += num\n            # 핵심: prefix_sum - k가 이전에 나왔다면\n            # → 그 지점 ~ 현재 구간의 합 = k!\n            if (prefix_sum - k) in prefix_count:\n                count += prefix_count[prefix_sum - k]' },
                        { title: '현재 누적합 기록', desc: '현재 누적합을 딕셔너리에 기록합니다.\n뒤에 오는 원소들이 "prefix_sum - k"로 이 값을 찾게 됩니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            prefix_sum += num\n            if (prefix_sum - k) in prefix_count:\n                count += prefix_count[prefix_sum - k]\n            # 현재 누적합 기록 → 뒤의 원소가 이 값을 찾음\n            if prefix_sum in prefix_count:\n                prefix_count[prefix_sum] += 1\n            else:\n                prefix_count[prefix_sum] = 1' },
                        { title: '결과 반환', desc: '합이 k인 연속 부분 배열의 총 개수를 반환합니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            prefix_sum += num\n            # 핵심: prefix_sum - k가 이전에 나왔다면\n            # → 그 지점 ~ 현재 구간의 합 = k!\n            if (prefix_sum - k) in prefix_count:\n                count += prefix_count[prefix_sum - k]\n            # 현재 누적합 기록 → 뒤의 원소가 이 값을 찾음\n            if prefix_sum in prefix_count:\n                prefix_count[prefix_sum] += 1\n            else:\n                prefix_count[prefix_sum] = 1\n        return count' }
                    ],
                    cpp: [
                        { title: '함수 정의', desc: '정수 배열과 목표 합 k를 받습니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {' },
                        { title: '누적합 기록 초기화', desc: '{0: 1}은 "시작 전, 합이 0인 지점이 1개".\n이 없으면 처음부터의 구간 합이 k인 경우를 놓칩니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        // {누적합: 등장 횟수} - 합=0인 시작점 1개\n        unordered_map<int, int> pc;\n        pc[0] = 1;' },
                        { title: '변수 초기화', desc: 'sum은 처음~현재의 누적합, cnt는 결과 카운트입니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0; // 누적합, 결과 카운트' },
                        { title: '반복 + 누적합 갱신', desc: '원소를 하나씩 더해 "처음~현재"까지의 합을 구합니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n; // 누적합 갱신' },
                        { title: '핵심: 이전 누적합 찾기 + 기록', desc: 'sum - k가 이전에 나왔다면 그 구간 합이 k!\n현재 누적합도 기록해서 뒤의 원소가 찾을 수 있게 합니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n;\n            // sum - k가 이전에 나왔다면 → 구간 합 = k\n            if (pc.count(sum - k)) cnt += pc[sum - k];\n            pc[sum]++; // 현재 누적합 기록\n        }' },
                        { title: '결과 반환', desc: '총 개수를 반환합니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n;\n            if (pc.count(sum - k)) cnt += pc[sum - k];\n            pc[sum]++;\n        }\n        return cnt;\n    }\n};' }
                    ]
                }
            }]
        }
    ],

    renderProblem(container) {
        container.innerHTML = '';
        const stageList = document.createElement('div'); stageList.className = 'problem-stages';
        this.stages.forEach(stage => {
            const sc = document.createElement('div'); sc.className = 'stage-card';
            sc.innerHTML = `<div class="stage-header"><span class="stage-num">단계 ${stage.num}</span><h3>${stage.title}</h3><p>${stage.desc}</p></div><div class="stage-problems"></div>`;
            const pd = sc.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid); if (!prob) return;
                const dm = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                const btn = document.createElement('button'); btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `<span class="problem-title">${prob.title}</span><span class="problem-diff">${dm[prob.difficulty]||prob.difficulty}</span>`;
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob)); pd.appendChild(btn);
            });
            stageList.appendChild(sc);
        });
        container.appendChild(stageList);
    },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        const bb = document.createElement('button'); bb.className = 'btn'; bb.textContent = '← 문제 목록으로';
        bb.addEventListener('click', () => this.renderProblem(container)); container.appendChild(bb);
        const isLC = problem.link.includes('leetcode');
        const dd = document.createElement('div'); dd.className = 'problem-detail';
        dd.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLC?'LeetCode에서 풀기 ↗':'BOJ에서 풀기 ↗'}</a></div>${problem.descriptionHTML}`;
        container.appendChild(dd);

        const hs = document.createElement('div'); hs.className = 'hints-section'; hs.innerHTML = '<h3>단계별 힌트</h3>';
        const hd = document.createElement('div'); hd.className = 'hints-steps'; const os = {};
        problem.hints.forEach((h, i) => {
            const st = document.createElement('div'); st.className = 'hint-step' + (i > 0 ? ' locked' : '');
            st.innerHTML = `<div class="hint-step-header"><span class="hint-step-num">${i+1}</span><span class="hint-step-title">${h.title}</span><span class="hint-step-toggle">▶</span></div><div class="hint-step-content">${h.content}</div>`;
            st.querySelector('.hint-step-header').addEventListener('click', () => {
                if (st.classList.contains('locked')) return; st.classList.toggle('open');
                st.querySelector('.hint-step-toggle').textContent = st.classList.contains('open') ? '▼' : '▶';
                if (!os[i]) { os[i] = true; if (i+1 < problem.hints.length) { const ns = hd.children[i+1]; if (ns) ns.classList.remove('locked'); } }
            });
            hd.appendChild(st);
        });
        hs.appendChild(hd); container.appendChild(hs);

        const sa = document.createElement('div'); sa.className = 'solve-area';
        sa.innerHTML = `<div class="editor-header"><h3>풀이 작성</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option></select></div><textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea><div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ 실행</button><button id="check-btn" class="btn btn-success">✓ 정답 확인</button></div><div id="output-area" class="output-area"><div class="output-label">실행 결과</div><pre id="output-text"></pre></div>`;
        container.appendChild(sa);
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });
        const ed = container.querySelector('#code-editor'), ls = container.querySelector('#lang-select');
        ed.value = problem.templates.python;
        ls.addEventListener('change', () => { ed.value = problem.templates[ls.value]; });
        ed.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = ed.selectionStart; ed.value = ed.value.substring(0, s) + '    ' + ed.value.substring(ed.selectionEnd); ed.selectionStart = ed.selectionEnd = s + 4; } });
        const site = isLC ? 'LeetCode' : 'BOJ';
        container.querySelector('#run-btn').addEventListener('click', () => { this._showOutput(container, `예상 정답:\n${problem.solve(0)}\n\n(코드가 위 결과를 출력하면 정답입니다)`); });
        container.querySelector('#check-btn').addEventListener('click', () => { this._showOutput(container, `예상 정답:\n${problem.solve(0)}\n\n💡 코드를 ${site}에 제출하여 정답을 확인하세요!`); });
    },

    _showOutput(container, text) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.hashtable = hashTableTopic;
