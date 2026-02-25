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

    // ===== 시각화 탭 =====
    renderVisualize(container) {
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
    _createStepControls() {
        return `<div class="viz-step-controls"><button class="btn viz-step-btn" id="viz-prev" disabled>&larr; 이전</button><span id="viz-step-counter" class="viz-step-counter">시작 전</span><button class="btn btn-primary viz-step-btn" id="viz-next">다음 &rarr;</button></div><div id="viz-step-desc" class="viz-step-desc">▶ 위의 버튼을 눌러 시작하세요</div>`;
    },
    _initStepController(el, steps) {
        const state = this._vizState; state.steps = steps; state.currentStep = -1;
        const prevBtn = el.querySelector('#viz-prev'), nextBtn = el.querySelector('#viz-next');
        const counter = el.querySelector('#viz-step-counter'), desc = el.querySelector('#viz-step-desc');
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
            inputDefault: 0, solve() { return 'true'; },
            templates: {
                python: `class Solution:
    def containsDuplicate(self, nums):
        return len(set(nums)) != len(nums)

    # 또는 해시셋으로 직접 확인
    def containsDuplicate_v2(self, nums):
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
            }
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
            }
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
            }
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
            }
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
