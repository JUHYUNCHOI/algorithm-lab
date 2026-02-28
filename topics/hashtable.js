// =========================================================
// 해시 테이블 (Hash Table) 토픽 모듈
// =========================================================
const hashTableTopic = {
    id: 'hashtable',
    title: '해시 테이블',
    icon: '🗂️',
    category: '자료구조 활용',
    order: 3,
    description: '딕셔너리와 집합을 활용한 O(1) 탐색과 카운팅 기법',
    relatedNote: '해시맵은 투 포인터, 슬라이딩 윈도우와 함께 쓰이는 경우가 많고, 정렬 대신 O(1) 탐색으로 시간을 줄이는 핵심 도구입니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
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

    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🗂️ 해시 테이블 (Hash Table)</h2>
                <p class="hero-sub">키 하나로 값을 즉시 찾는 마법 같은 자료구조를 배워봅시다!</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 해시 테이블이란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 해시 테이블은 <em>"이름표가 붙은 서랍장"</em>입니다!
                    "사과" 서랍을 열면 바로 사과 정보가 나옵니다. 모든 서랍을 열어볼 필요 없이
                    이름표만 보면 됩니다. 이것이 <strong>O(1) 접근</strong>의 비밀입니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">key→val</text></svg></div>
                        <h3>키-값 쌍</h3>
                        <p>키(key)로 값(value)을 저장하고 즉시 꺼냅니다. Python의 <code>dict</code>, Java의 <code>HashMap</code>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--green)">O(1)</text></svg></div>
                        <h3>평균 O(1)</h3>
                        <p>삽입, 삭제, 검색 모두 평균 O(1)입니다. 배열의 O(n) 탐색보다 훨씬 빠릅니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--yellow)">#</text></svg></div>
                        <h3>해시 함수</h3>
                        <p>키를 숫자(해시값)로 변환합니다. 같은 키는 항상 같은 해시값을 줍니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">set{}</text></svg></div>
                        <h3>집합 (Set)</h3>
                        <p>값만 저장하고 <strong>중복을 허용하지 않습니다</strong>. <code>in</code> 연산이 O(1)!</p>
                    </div>
                </div>
                <div class="code-block">
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
                </div>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">배열에서 원소가 있는지 확인하면 O(n)인데, 집합(set)에서는 O(1)인 이유는?</span></div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">배열은 처음부터 끝까지 하나씩 비교해야 하지만, 집합은 <strong>해시 함수</strong>로 바로 위치를 계산합니다! 전화번호부에서 이름으로 바로 찾는 것과 같습니다.</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 해시맵 활용 패턴</div>
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
                        <p>Two Sum에서 "target - num이 이미 있는가?"를 O(1)에 확인합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">a↔b</text></svg></div>
                        <h3>매핑</h3>
                        <p>값→인덱스, 문자→빈도 등 두 정보를 연결합니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 패턴 1: 빈도수 세기
from collections import Counter
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
freq = Counter(words)
print(freq.most_common(1))  # [('apple', 3)]

# 패턴 2: Two Sum을 해시맵으로 O(n)에 풀기
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
                </div>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">Two Sum을 이중 for문(O(n²))이 아닌 해시맵(O(n))으로 풀 수 있는 이유는?</span></div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">이중 for문은 "모든 쌍"을 비교하지만, 해시맵은 <strong>한 번 순회</strong>하면서 "이 숫자의 짝이 이미 있나?"를 O(1)에 확인합니다. n번 × O(1) = O(n)!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 해시 충돌과 주의사항</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 두 사람의 이름이 같으면 서랍이 겹칩니다!
                    이것을 <em>"해시 충돌"</em>이라 합니다. 해결법: 같은 서랍에 이름표를 여러 개 붙이거나(체이닝),
                    빈 서랍을 찾아갑니다(오픈 어드레싱). Python의 dict는 이를 자동으로 처리합니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">충돌!</text></svg></div>
                        <h3>해시 충돌</h3>
                        <p>다른 키가 같은 해시값을 가질 수 있습니다. 최악의 경우 O(n)이 될 수 있지만 극히 드뭅니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">순서</text></svg></div>
                        <h3>순서 보장</h3>
                        <p>Python 3.7+의 dict는 삽입 순서를 보장합니다! 하지만 정렬된 순서는 아닙니다.</p>
                    </div>
                </div>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">해시 테이블의 최악 시간 복잡도는 O(n)인데, 왜 "O(1)"이라고 할까요?</span></div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">O(n)은 모든 키가 같은 해시값을 가지는 극히 드문 최악의 경우입니다. <strong>평균적으로는 O(1)</strong>이고, 좋은 해시 함수를 쓰면 충돌이 거의 없습니다!</div>
                </div>
            </div>
        `;
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => { const box = btn.closest('.think-box'); box.classList.toggle('open'); btn.style.display = 'none'; });
        });
    },

    // ===== 시각화 탭 (개념 탭용 — 스텁) =====
    renderVisualize(container) { container.innerHTML = ''; },

    // ===== 해시 테이블 삽입 시각화 (개념 탭 전용) =====
    _renderVizHashTableInsert(container) {
        const self = this;
        self._clearVizState();

        const ITEMS = [
            { key: 'apple', val: 3 }, { key: 'banana', val: 5 }, { key: 'cherry', val: 2 },
            { key: 'date', val: 8 }, { key: 'elderberry', val: 1 }
        ];
        const TABLE_SIZE = 7;

        function simpleHash(key) {
            let h = 0;
            for (let i = 0; i < key.length; i++) h = (h + key.charCodeAt(i)) % TABLE_SIZE;
            return h;
        }

        container.innerHTML = `
            <div class="hero" style="padding-bottom:12px;">
                <h2>해시 테이블 삽입 시각화</h2>
                <p class="hero-sub">키를 해시 함수로 변환하여 테이블에 넣는 과정을 봅시다.</p>
            </div>
            <button class="btn btn-primary" id="ht-start">삽입 시작</button>

            <div style="display:flex;gap:24px;margin-top:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:200px;">
                    <div style="font-weight:700;margin-bottom:8px;">해시 테이블 (크기 ${TABLE_SIZE})</div>
                    <div id="ht-table" style="display:flex;flex-direction:column;gap:4px;"></div>
                </div>
                <div style="flex:1;min-width:150px;">
                    <div style="font-weight:700;margin-bottom:8px;">현재 작업</div>
                    <div id="ht-info" class="graph-queue-display" style="min-height:60px;padding:12px;font-size:0.95rem;">시작을 눌러주세요</div>
                </div>
            </div>

            ${self._createStepControls()}
        `;

        const tableEl = container.querySelector('#ht-table');
        const infoEl = container.querySelector('#ht-info');

        // Render empty table
        for (let i = 0; i < TABLE_SIZE; i++) {
            const row = document.createElement('div');
            row.className = 'str-char-box';
            row.dataset.idx = i;
            row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
            row.innerHTML = `<span style="font-weight:700;color:var(--text3);min-width:20px;">[${i}]</span><span class="ht-content" style="font-weight:600;">—</span>`;
            tableEl.appendChild(row);
        }

        function setSlot(idx, text, cls) {
            const row = tableEl.querySelector(`[data-idx="${idx}"]`);
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

        container.querySelector('#ht-start').addEventListener('click', function() {
            self._clearVizState();
            // Reset table
            for (let i = 0; i < TABLE_SIZE; i++) setSlot(i, '—', '');

            const steps = [];
            const stored = {};

            ITEMS.forEach(item => {
                const h = simpleHash(item.key);
                steps.push({
                    description: `"${item.key}" → hash = ${h}, 테이블[${h}]에 저장`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        // Reset active states
                        for (let i = 0; i < TABLE_SIZE; i++) {
                            const row = tableEl.querySelector(`[data-idx="${i}"]`);
                            if (row && row.classList.contains('comparing')) {
                                row.className = 'str-char-box' + (stored[i] ? ' matched' : '');
                                row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
                            }
                        }
                        stored[h] = stored[h] ? stored[h] + ', ' + `${item.key}:${item.val}` : `${item.key}:${item.val}`;
                        setSlot(h, stored[h], 'comparing');
                        infoEl.innerHTML = `hash("${item.key}") = <strong>${h}</strong><br>→ 테이블[${h}] = ${item.key}:${item.val}`;
                    },
                    undo: function() { restoreState(this._before); }
                });

                steps.push({
                    description: `"${item.key}" 저장 완료!`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        setSlot(h, stored[h], 'matched');
                        infoEl.innerHTML = `✓ "${item.key}" 저장 완료`;
                    },
                    undo: function() { restoreState(this._before); }
                });
            });

            steps.push({
                description: '모든 항목 삽입 완료!',
                _before: null,
                action: function() {
                    this._before = saveState();
                    infoEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;">✓ 모든 항목 삽입 완료!</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        });
    },

    _vizState: { steps: [], currentStep: -1, keydownHandler: null },
    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },
    _createStepControls(suffix) {
        const s = suffix || '';
        return `<div class="viz-step-controls"><button class="btn viz-step-btn" id="viz-prev${s}" disabled>&larr; 이전</button><span id="viz-step-counter${s}" class="viz-step-counter">시작 전</span><button class="btn btn-primary viz-step-btn" id="viz-next${s}">다음 &rarr;</button></div><div id="viz-step-desc${s}" class="viz-step-desc">▶ 위의 버튼을 눌러 시작하세요</div>`;
    },
    _initStepController(el, steps, suffix) {
        const s = suffix || '';
        const state = this._vizState; state.steps = steps; state.currentStep = -1;
        const prevBtn = el.querySelector('#viz-prev' + s), nextBtn = el.querySelector('#viz-next' + s);
        const counter = el.querySelector('#viz-step-counter' + s), desc = el.querySelector('#viz-step-desc' + s);
        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0); nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { counter.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { counter.textContent = `Step ${idx + 1} / ${total}`; desc.textContent = state.steps[idx].description; }
        };
        nextBtn.addEventListener('click', () => { if (state.currentStep >= state.steps.length - 1) return; state.currentStep++; state.steps[state.currentStep].action(); updateUI(); });
        prevBtn.addEventListener('click', () => { if (state.currentStep < 0) return; state.steps[state.currentStep].undo(); state.currentStep--; updateUI(); });
        const handleKeydown = (e) => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); } else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); } };
        document.addEventListener('keydown', handleKeydown); state.keydownHandler = handleKeydown; updateUI();
    },

    // ===== 문제별 시뮬레이션: Contains Duplicate =====
    _renderVizContainsDup(container) {
        const self = this;
        const DEFAULT_ARR = [1, 2, 3, 1];
        container.innerHTML = `
            <div style="margin-bottom:16px;">
                <label>배열: <input type="text" id="ht-cd-input" value="${DEFAULT_ARR.join(', ')}" style="width:200px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                <button class="btn btn-primary" id="ht-cd-start" style="margin-left:8px;">시작</button>
            </div>
            <div id="ht-cd-boxes" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>
            <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px;">
                <div>HashSet: <span id="ht-cd-set" style="font-weight:600;color:var(--accent);">{ }</span></div>
                <div>결과: <span id="ht-cd-result" style="font-weight:600;">—</span></div>
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
            let found = false;
            arr.forEach((v, i) => {
                if (found) return;
                steps.push({ description: `[${i}] = ${v} 확인: ${seen.has(v) ? '이미 set에 있음! → 중복 발견!' : 'set에 없음 → 추가'}`,
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
                steps.push({ description: '모든 원소 확인 완료 → 중복 없음 → false', _before: null,
                    action: function() { this._before = saveState(); resultEl.innerHTML = '<span style="color:var(--accent);">중복 없음 → false</span>'; },
                    undo: function() { restoreState(this._before); }
                });
            }
            self._initStepController(container, steps, '-cd');
        });
    },

    // ===== 문제별 시뮬레이션: Longest Substring Without Repeating =====
    _renderVizLongestSub(container) {
        const self = this;
        const DEFAULT_STR = 'abcabcbb';
        container.innerHTML = `
            <div style="margin-bottom:16px;">
                <label>문자열: <input type="text" id="ht-ls-input" value="${DEFAULT_STR}" style="width:200px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                <button class="btn btn-primary" id="ht-ls-start" style="margin-left:8px;">시작</button>
            </div>
            <div id="ht-ls-boxes" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>
            <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px;">
                <div>seen: <span id="ht-ls-map" style="font-weight:600;color:var(--accent);">{ }</span></div>
                <div>start = <span id="ht-ls-start-val" style="font-weight:600;">0</span></div>
                <div>최대 길이 = <span id="ht-ls-max" style="font-weight:600;color:var(--green);">0</span></div>
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
                steps.push({ description: `i=${i}, "${c}": ${movedStart ? 'start를 ' + capturedStart + '로 이동, ' : ''}윈도우 [${capturedStart}..${i}] 길이=${curLen}${curLen === capturedMax && curLen > 0 ? ' (최대!)' : ''}`,
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
            steps.push({ description: `완료! 최대 길이 = ${maxLen}`, _before: null,
                action: function() { this._before = saveState(); maxEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;">✓ ' + maxLen + '</span>'; },
                undo: function() { restoreState(this._before); }
            });
            self._initStepController(container, steps, '-ls');
        });
    },

    // ===== 문제별 시뮬레이션: Subarray Sum Equals K =====
    _renderVizSubarraySum(container) {
        const self = this;
        const DEFAULT_ARR = [1, 1, 1];
        const DEFAULT_K = 2;
        container.innerHTML = `
            <div style="margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
                <label>배열: <input type="text" id="ht-ss-input" value="${DEFAULT_ARR.join(', ')}" style="width:160px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                <label>k: <input type="number" id="ht-ss-k" value="${DEFAULT_K}" style="width:60px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                <button class="btn btn-primary" id="ht-ss-start">시작</button>
            </div>
            <div id="ht-ss-boxes" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>
            <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px;">
                <div>prefix_sum = <span id="ht-ss-sum" style="font-weight:600;">0</span></div>
                <div>prefix_count: <span id="ht-ss-pc" style="font-weight:600;color:var(--accent);">{0: 1}</span></div>
                <div>count = <span id="ht-ss-cnt" style="font-weight:600;color:var(--green);">0</span></div>
            </div>
            ${self._createStepControls('-ss')}
        `;
        const boxesEl = container.querySelector('#ht-ss-boxes');
        const sumEl = container.querySelector('#ht-ss-sum');
        const pcEl = container.querySelector('#ht-ss-pc');
        const cntEl = container.querySelector('#ht-ss-cnt');

        container.querySelector('#ht-ss-start').addEventListener('click', function() {
            self._clearVizState();
            const arr = container.querySelector('#ht-ss-input').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const k = parseInt(container.querySelector('#ht-ss-k').value) || 0;
            boxesEl.innerHTML = '';
            arr.forEach((v, i) => { const b = document.createElement('div'); b.className = 'str-char-box'; b.textContent = v; b.dataset.idx = i; boxesEl.appendChild(b); });
            sumEl.textContent = '0'; pcEl.textContent = '{0: 1}'; cntEl.textContent = '0';

            function saveState() {
                return { boxes: Array.from(boxesEl.children).map(b => b.className), sum: sumEl.textContent, pc: pcEl.textContent, cnt: cntEl.textContent };
            }
            function restoreState(s) {
                Array.from(boxesEl.children).forEach((b, i) => b.className = s.boxes[i]);
                sumEl.textContent = s.sum; pcEl.textContent = s.pc; cntEl.textContent = s.cnt;
            }

            const steps = [];
            const prefixCount = { 0: 1 };
            let prefixSum = 0, count = 0;
            arr.forEach((num, i) => {
                prefixSum += num;
                const diff = prefixSum - k;
                const found = prefixCount[diff] || 0;
                count += found;
                prefixCount[prefixSum] = (prefixCount[prefixSum] || 0) + 1;
                const pcCopy = JSON.parse(JSON.stringify(prefixCount));
                const capturedSum = prefixSum, capturedCount = count;
                steps.push({ description: `[${i}]=${num}: sum=${capturedSum}, sum-k=${diff}${found > 0 ? ' → prefix_count에 ' + found + '번 있음! count+=' + found : ' → 없음'}, count=${capturedCount}`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        Array.from(boxesEl.children).forEach((b, j) => b.className = 'str-char-box' + (j <= i ? ' matched' : ''));
                        boxesEl.children[i].className = 'str-char-box comparing';
                        sumEl.textContent = capturedSum;
                        pcEl.textContent = JSON.stringify(pcCopy).replace(/"/g, '');
                        cntEl.textContent = capturedCount;
                    },
                    undo: function() { restoreState(this._before); }
                });
            });
            steps.push({ description: `완료! 합이 ${k}인 부분 배열: ${count}개`, _before: null,
                action: function() { this._before = saveState(); cntEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;">✓ ' + count + '</span>'; },
                undo: function() { restoreState(this._before); }
            });
            self._initStepController(container, steps, '-ss');
        });
    },

    // ===== 문제별 시뮬레이션: 회사에 있는 사람 =====
    _renderVizCompany(container) {
        const self = this;
        const LOGS = [
            { name: 'Baha', action: 'enter' }, { name: 'Asber', action: 'enter' },
            { name: 'Baha', action: 'leave' }, { name: 'Artem', action: 'enter' }
        ];
        container.innerHTML = `
            <div style="margin-bottom:16px;">
                <button class="btn btn-primary" id="ht-co-start">시뮬레이션 시작</button>
            </div>
            <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:16px;">
                <div style="flex:1;min-width:180px;">
                    <div style="font-weight:700;margin-bottom:8px;">출입 기록</div>
                    <div id="ht-co-logs" style="display:flex;flex-direction:column;gap:4px;"></div>
                </div>
                <div style="flex:1;min-width:180px;">
                    <div style="font-weight:700;margin-bottom:8px;">회사에 있는 사람 (Set)</div>
                    <div id="ht-co-set" class="graph-queue-display" style="min-height:60px;padding:12px;font-size:0.95rem;">{ }</div>
                </div>
            </div>
            <div>결과 (사전 역순): <span id="ht-co-result" style="font-weight:600;">—</span></div>
            ${self._createStepControls('-co')}
        `;
        const logsEl = container.querySelector('#ht-co-logs');
        const setEl = container.querySelector('#ht-co-set');
        const resultEl = container.querySelector('#ht-co-result');

        LOGS.forEach((log, i) => {
            const row = document.createElement('div');
            row.className = 'str-char-box';
            row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
            row.innerHTML = `<span style="font-weight:600;">${log.name}</span> <span style="color:${log.action === 'enter' ? 'var(--green)' : 'var(--red, #e17055)'}">${log.action}</span>`;
            row.dataset.idx = i;
            logsEl.appendChild(row);
        });

        container.querySelector('#ht-co-start').addEventListener('click', function() {
            self._clearVizState();
            Array.from(logsEl.children).forEach(r => r.className = 'str-char-box');
            Array.from(logsEl.children).forEach(r => r.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;');
            setEl.textContent = '{ }'; resultEl.textContent = '—';

            function saveState() {
                return { logs: Array.from(logsEl.children).map(r => r.className), set: setEl.textContent, result: resultEl.textContent };
            }
            function restoreState(s) {
                Array.from(logsEl.children).forEach((r, i) => { r.className = s.logs[i]; r.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;'; });
                setEl.textContent = s.set; resultEl.textContent = s.result;
            }

            const steps = [];
            const company = new Set();
            LOGS.forEach((log, i) => {
                const isEnter = log.action === 'enter';
                steps.push({ description: `${log.name} ${isEnter ? '입장 → set.add' : '퇴장 → set.remove'}`,
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
            steps.push({ description: '사전 역순 정렬하여 출력!', _before: null,
                action: function() {
                    this._before = saveState();
                    const sorted = Array.from(company).sort().reverse();
                    resultEl.innerHTML = '<span style="color:var(--green);">' + sorted.join(', ') + '</span>';
                },
                undo: function() { restoreState(this._before); }
            });
            self._initStepController(container, steps, '-co');
        });
    },

    // ===== 문제풀이 탭 =====
    stages: [
        { num: 1, title: '해시맵 기본', desc: '빈도수, 존재 확인, 매핑 (Easy~Silver)', problemIds: ['lc-217', 'lc-3'] },
        { num: 2, title: '해시맵 응용', desc: '패턴 매칭, 연속 부분 배열 (Medium~Gold)', problemIds: ['lc-560', 'boj-7785'] }
    ],

    problems: [
        {
            id: 'lc-217',
            title: 'LeetCode 217 - Contains Duplicate',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/contains-duplicate/',
            descriptionHTML: `<h3>문제</h3><p>정수 배열에 <strong>중복된 원소</strong>가 있으면 true, 없으면 false를 반환하세요.</p>
                <div class="problem-io"><div><h4>입력</h4><p>[1, 2, 3, 1]</p></div><div><h4>출력</h4><p>true</p></div></div>`,
            hints: [
                { title: '가장 간단한 방법', content: '<code>set</code>으로 변환 후 길이 비교! <code>len(set(nums)) != len(nums)</code>' },
                { title: '해시셋 풀이', content: '순회하면서 <code>seen</code> set에 넣고, 이미 있으면 True 반환. O(n)!' },
                { title: '정렬 풀이도 가능', content: '정렬 후 인접한 원소 비교. O(n log n)이지만 추가 공간 없음.' }
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
};`,
                java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int n : nums) {
            if (!seen.add(n)) return true;
        }
        return false;
    }
}`
            },
            solutions: [{
                approach: '해시셋',
                description: '해시셋으로 O(1) 존재 확인하며 순회',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                get templates() { return hashTableTopic.problems[0].templates; },
                codeSteps: {
                    python: [
                        { title: '함수 정의', desc: '클래스와 메서드를 선언합니다.', code: 'class Solution:\n    def containsDuplicate(self, nums):' },
                        { title: '해시셋 초기화', desc: '본 적 있는 숫자를 저장할 set을 만듭니다.', code: 'class Solution:\n    def containsDuplicate(self, nums):\n        seen = set()' },
                        { title: '순회하며 중복 체크', desc: '각 숫자가 이미 seen에 있으면 True, 없으면 추가합니다.', code: 'class Solution:\n    def containsDuplicate(self, nums):\n        seen = set()\n        for n in nums:\n            if n in seen:\n                return True\n            seen.add(n)' },
                        { title: '결과 반환', desc: '중복 없이 끝나면 False를 반환합니다.', code: 'class Solution:\n    def containsDuplicate(self, nums):\n        seen = set()\n        for n in nums:\n            if n in seen:\n                return True\n            seen.add(n)\n        return False' }
                    ],
                    cpp: [
                        { title: '함수 정의 + 셋 초기화', desc: 'unordered_set으로 본 적 있는 숫자를 관리합니다.', code: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;' },
                        { title: '순회하며 중복 체크', desc: '각 원소가 이미 있으면 true, 아니면 삽입합니다.', code: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true;\n            seen.insert(n);\n        }' },
                        { title: '결과 반환', desc: '중복 없이 끝나면 false를 반환합니다.', code: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true;\n            seen.insert(n);\n        }\n        return false;\n    }\n};' }
                    ],
                    java: [
                        { title: '함수 정의 + 셋 초기화', desc: 'HashSet으로 본 적 있는 숫자를 관리합니다.', code: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();' },
                        { title: '순회하며 중복 체크', desc: 'add()가 false를 반환하면 이미 존재하는 원소입니다.', code: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int n : nums) {\n            if (!seen.add(n)) return true;\n        }' },
                        { title: '결과 반환', desc: '중복 없이 끝나면 false를 반환합니다.', code: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int n : nums) {\n            if (!seen.add(n)) return true;\n        }\n        return false;\n    }\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-3',
            title: 'LeetCode 3 - Longest Substring Without Repeating',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
            descriptionHTML: `<h3>문제</h3><p>문자열 <code>s</code>에서 <strong>같은 글자가 없는 가장 긴 부분 문자열</strong>의 길이를 구하세요.</p>
                <div class="problem-io"><div><h4>입력</h4><p>"abcabcbb"</p></div><div><h4>출력</h4><p>3 ("abc")</p></div></div>`,
            hints: [
                { title: '슬라이딩 윈도우!', content: 'start~end 윈도우를 유지하며, 중복이 생기면 start를 옮깁니다.' },
                { title: '해시맵으로 위치 기록', content: '각 문자의 <strong>마지막 등장 위치</strong>를 해시맵에 저장합니다. 중복 발견 시 start를 그 다음으로 이동!' },
                { title: '시간 복잡도', content: 'O(n). 각 문자를 최대 한 번씩만 처리합니다.' }
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
};`,
                java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> seen = new HashMap<>();
        int start = 0, maxLen = 0;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (seen.containsKey(c) && seen.get(c) >= start)
                start = seen.get(c) + 1;
            seen.put(c, i);
            maxLen = Math.max(maxLen, i - start + 1);
        }
        return maxLen;
    }
}`
            },
            solutions: [{
                approach: '슬라이딩 윈도우 + 해시맵',
                description: '해시맵으로 마지막 등장 위치를 기록하며 윈도우 확장',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(min(m,n))',
                get templates() { return hashTableTopic.problems[1].templates; },
                codeSteps: {
                    python: [
                        { title: '함수 정의', desc: '클래스와 메서드를 선언합니다.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:' },
                        { title: '변수 초기화', desc: 'seen 딕셔너리, 윈도우 시작점, 최대 길이를 초기화합니다.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0' },
                        { title: '문자열 순회', desc: '각 문자에 대해 중복이면 start를 이동하고, 위치를 기록합니다.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):\n            if c in seen and seen[c] >= start:\n                start = seen[c] + 1\n            seen[c] = i' },
                        { title: '최대 길이 갱신', desc: '현재 윈도우 크기와 최대 길이를 비교합니다.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):\n            if c in seen and seen[c] >= start:\n                start = seen[c] + 1\n            seen[c] = i\n            max_len = max(max_len, i - start + 1)\n        return max_len' }
                    ],
                    cpp: [
                        { title: '함수 정의 + 초기화', desc: 'unordered_map과 변수들을 초기화합니다.', code: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen;\n        int start = 0, maxLen = 0;' },
                        { title: '순회 + 중복 처리 + 갱신', desc: '중복이면 start 이동, 위치 기록, 최대값 갱신합니다.', code: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen;\n        int start = 0, maxLen = 0;\n        for (int i = 0; i < s.size(); i++) {\n            if (seen.count(s[i]) && seen[s[i]] >= start)\n                start = seen[s[i]] + 1;\n            seen[s[i]] = i;\n            maxLen = max(maxLen, i - start + 1);\n        }' },
                        { title: '결과 반환', desc: '최대 길이를 반환합니다.', code: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen;\n        int start = 0, maxLen = 0;\n        for (int i = 0; i < s.size(); i++) {\n            if (seen.count(s[i]) && seen[s[i]] >= start)\n                start = seen[s[i]] + 1;\n            seen[s[i]] = i;\n            maxLen = max(maxLen, i - start + 1);\n        }\n        return maxLen;\n    }\n};' }
                    ],
                    java: [
                        { title: '함수 정의 + 초기화', desc: 'HashMap과 변수들을 초기화합니다.', code: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> seen = new HashMap<>();\n        int start = 0, maxLen = 0;' },
                        { title: '순회 + 중복 처리 + 갱신', desc: '중복이면 start 이동, 위치 기록, 최대값 갱신합니다.', code: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> seen = new HashMap<>();\n        int start = 0, maxLen = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (seen.containsKey(c) && seen.get(c) >= start)\n                start = seen.get(c) + 1;\n            seen.put(c, i);\n            maxLen = Math.max(maxLen, i - start + 1);\n        }' },
                        { title: '결과 반환', desc: '최대 길이를 반환합니다.', code: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> seen = new HashMap<>();\n        int start = 0, maxLen = 0;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (seen.containsKey(c) && seen.get(c) >= start)\n                start = seen.get(c) + 1;\n            seen.put(c, i);\n            maxLen = Math.max(maxLen, i - start + 1);\n        }\n        return maxLen;\n    }\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-560',
            title: 'LeetCode 560 - Subarray Sum Equals K',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/subarray-sum-equals-k/',
            descriptionHTML: `<h3>문제</h3><p>정수 배열과 정수 k가 주어집니다. 합이 k인 <strong>연속 부분 배열의 개수</strong>를 구하세요.</p>
                <div class="problem-io"><div><h4>입력</h4><p>nums=[1,1,1], k=2</p></div><div><h4>출력</h4><p>2</p></div></div>`,
            hints: [
                { title: '누적합 + 해시맵', content: '누적합 prefix_sum을 계산하면서, <code>prefix_sum - k</code>가 이전에 나온 적 있는지 확인합니다!' },
                { title: '왜 해시맵?', content: '누적합의 차이가 k이면 그 구간의 합이 k입니다. 해시맵에 각 누적합의 등장 횟수를 저장합니다.' },
                { title: '초기값', content: '<code>prefix_count = {0: 1}</code>로 시작! 누적합 자체가 k인 경우를 처리합니다.' }
            ],
            simIntro: '누적합과 해시맵을 사용하여 합이 k인 부분 배열을 세는 과정을 단계별로 확인해보세요!',
            inputDefault: 0, solve() { return '2'; },
            templates: {
                python: `class Solution:
    def subarraySum(self, nums, k):
        prefix_count = {0: 1}  # 누적합 → 등장 횟수
        prefix_sum = 0
        count = 0
        for num in nums:
            prefix_sum += num
            # prefix_sum - k가 이전에 나왔다면, 그 구간의 합이 k
            count += prefix_count.get(prefix_sum - k, 0)
            prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1
        return count`,
                cpp: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> pc;
        pc[0] = 1;
        int sum = 0, cnt = 0;
        for (int n : nums) {
            sum += n;
            if (pc.count(sum - k)) cnt += pc[sum - k];
            pc[sum]++;
        }
        return cnt;
    }
};`,
                java: `class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> pc = new HashMap<>();
        pc.put(0, 1);
        int sum = 0, cnt = 0;
        for (int n : nums) {
            sum += n;
            cnt += pc.getOrDefault(sum - k, 0);
            pc.merge(sum, 1, Integer::sum);
        }
        return cnt;
    }
}`
            },
            solutions: [{
                approach: '누적합 + 해시맵',
                description: '누적합의 차이를 해시맵으로 O(1)에 확인',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                get templates() { return hashTableTopic.problems[2].templates; },
                codeSteps: {
                    python: [
                        { title: '함수 정의', desc: '클래스와 메서드를 선언합니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):' },
                        { title: '초기화', desc: '누적합 카운트 딕셔너리(0:1로 시작), 누적합, 결과 카운트를 초기화합니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0' },
                        { title: '순회 + 누적합 계산', desc: '각 원소를 더하면서 prefix_sum - k가 이전에 나왔는지 확인합니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            prefix_sum += num\n            count += prefix_count.get(prefix_sum - k, 0)' },
                        { title: '누적합 기록 + 반환', desc: '현재 누적합의 등장 횟수를 갱신하고 결과를 반환합니다.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            prefix_sum += num\n            count += prefix_count.get(prefix_sum - k, 0)\n            prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1\n        return count' }
                    ],
                    cpp: [
                        { title: '함수 정의 + 초기화', desc: 'unordered_map과 변수들을 초기화합니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0;' },
                        { title: '순회 + 누적합 + 카운팅', desc: '누적합 계산, 차이값 확인, 기록합니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n;\n            if (pc.count(sum - k)) cnt += pc[sum - k];\n            pc[sum]++;\n        }' },
                        { title: '결과 반환', desc: '총 개수를 반환합니다.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n;\n            if (pc.count(sum - k)) cnt += pc[sum - k];\n            pc[sum]++;\n        }\n        return cnt;\n    }\n};' }
                    ],
                    java: [
                        { title: '함수 정의 + 초기화', desc: 'HashMap과 변수들을 초기화합니다.', code: 'class Solution {\n    public int subarraySum(int[] nums, int k) {\n        Map<Integer, Integer> pc = new HashMap<>();\n        pc.put(0, 1);\n        int sum = 0, cnt = 0;' },
                        { title: '순회 + 누적합 + 카운팅', desc: '누적합 계산, 차이값 확인, 기록합니다.', code: 'class Solution {\n    public int subarraySum(int[] nums, int k) {\n        Map<Integer, Integer> pc = new HashMap<>();\n        pc.put(0, 1);\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n;\n            cnt += pc.getOrDefault(sum - k, 0);\n            pc.merge(sum, 1, Integer::sum);\n        }' },
                        { title: '결과 반환', desc: '총 개수를 반환합니다.', code: 'class Solution {\n    public int subarraySum(int[] nums, int k) {\n        Map<Integer, Integer> pc = new HashMap<>();\n        pc.put(0, 1);\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n;\n            cnt += pc.getOrDefault(sum - k, 0);\n            pc.merge(sum, 1, Integer::sum);\n        }\n        return cnt;\n    }\n}' }
                    ]
                }
            }]
        },
        {
            id: 'boj-7785',
            title: 'BOJ 7785 - 회사에 있는 사람',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/7785',
            descriptionHTML: `<h3>문제</h3><p>출입 기록이 주어집니다. "enter"면 입장, "leave"면 퇴장입니다. 현재 회사에 남아있는 사람을 사전 역순으로 출력하세요.</p>
                <div class="problem-io"><div><h4>입력</h4><p>첫째 줄: n (로그 수)<br>이후 n줄: 이름 enter/leave</p></div><div><h4>출력</h4><p>회사에 남은 사람 (사전 역순)</p></div></div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4\nBaha enter\nAsber enter\nBaha leave\nArtem enter</pre></div><div><strong>출력</strong><pre>Asber\nArtem</pre></div></div></div>`,
            hints: [
                { title: 'set 활용!', content: 'enter면 <code>set.add(name)</code>, leave면 <code>set.remove(name)</code>. 간단합니다!' },
                { title: '사전 역순 출력', content: '<code>sorted(company, reverse=True)</code>로 정렬 후 출력합니다.' },
                { title: '시간 복잡도', content: 'O(n log n). set 연산 O(n) + 정렬 O(n log n).' }
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
                cpp: `#include <bits/stdc++.h>
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
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        TreeSet<String> company = new TreeSet<>(Collections.reverseOrder());
        for (int i = 0; i < n; i++) {
            String[] parts = br.readLine().split(" ");
            if (parts[1].equals("enter")) company.add(parts[0]);
            else company.remove(parts[0]);
        }
        StringBuilder sb = new StringBuilder();
        for (String s : company) sb.append(s).append("\\n");
        System.out.print(sb);
    }
}`
            },
            solutions: [{
                approach: '집합(Set) 활용',
                description: 'enter시 add, leave시 remove 후 사전 역순 정렬',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                get templates() { return hashTableTopic.problems[3].templates; },
                codeSteps: {
                    python: [
                        { title: '입력 설정', desc: '빠른 입력을 위해 sys.stdin.readline을 사용합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())' },
                        { title: '집합 초기화', desc: '현재 회사에 있는 사람들을 관리할 set을 만듭니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncompany = set()' },
                        { title: '출입 기록 처리', desc: 'enter면 추가, leave면 제거합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncompany = set()\n\nfor _ in range(n):\n    name, action = input().split()\n    if action == "enter":\n        company.add(name)\n    else:\n        company.discard(name)' },
                        { title: '사전 역순 출력', desc: '남은 사람을 사전 역순으로 정렬하여 출력합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncompany = set()\n\nfor _ in range(n):\n    name, action = input().split()\n    if action == "enter":\n        company.add(name)\n    else:\n        company.discard(name)\n\nfor name in sorted(company, reverse=True):\n    print(name)' }
                    ],
                    cpp: [
                        { title: '헤더 + 역순 set', desc: 'greater<string>으로 사전 역순 자동 정렬 set을 사용합니다.', code: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    set<string, greater<string>> company;' },
                        { title: '출입 기록 처리', desc: 'enter면 삽입, leave면 삭제합니다.', code: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    set<string, greater<string>> company;\n    while (n--) {\n        char name[20], action[10];\n        scanf("%s %s", name, action);\n        if (action[0] == \'e\') company.insert(name);\n        else company.erase(name);\n    }' },
                        { title: '결과 출력', desc: 'set은 이미 역순 정렬이므로 그대로 출력합니다.', code: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    set<string, greater<string>> company;\n    while (n--) {\n        char name[20], action[10];\n        scanf("%s %s", name, action);\n        if (action[0] == \'e\') company.insert(name);\n        else company.erase(name);\n    }\n    for (auto& s : company) printf("%s\\n", s.c_str());\n}' }
                    ],
                    java: [
                        { title: '클래스 + TreeSet', desc: 'reverseOrder TreeSet으로 사전 역순 자동 정렬합니다.', code: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        TreeSet<String> company = new TreeSet<>(Collections.reverseOrder());' },
                        { title: '출입 기록 처리', desc: 'enter면 add, leave면 remove합니다.', code: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        TreeSet<String> company = new TreeSet<>(Collections.reverseOrder());\n        for (int i = 0; i < n; i++) {\n            String[] parts = br.readLine().split(" ");\n            if (parts[1].equals("enter")) company.add(parts[0]);\n            else company.remove(parts[0]);\n        }' },
                        { title: '결과 출력', desc: 'StringBuilder로 모아서 출력합니다.', code: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int n = Integer.parseInt(br.readLine().trim());\n        TreeSet<String> company = new TreeSet<>(Collections.reverseOrder());\n        for (int i = 0; i < n; i++) {\n            String[] parts = br.readLine().split(" ");\n            if (parts[1].equals("enter")) company.add(parts[0]);\n            else company.remove(parts[0]);\n        }\n        StringBuilder sb = new StringBuilder();\n        for (String s : company) sb.append(s).append("\\n");\n        System.out.print(sb);\n    }\n}' }
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
        sa.innerHTML = `<div class="editor-header"><h3>풀이 작성</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option><option value="java">Java</option></select></div><textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea><div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ 실행</button><button id="check-btn" class="btn btn-success">✓ 정답 확인</button></div><div id="output-area" class="output-area"><div class="output-label">실행 결과</div><pre id="output-text"></pre></div>`;
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
