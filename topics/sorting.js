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

    // ===== 시각화 탭 =====
    _vizState: null,
    _clearVizState() { this._vizState = null; },

    renderVisualize(container) {
        this._clearVizState();
        container.innerHTML = '';

        const vizArea = document.createElement('div');
        vizArea.className = 'viz-area';
        vizArea.innerHTML = `
            <h3>선택 정렬 시각화</h3>
            <p>매 단계에서 최솟값을 찾아 앞으로 옮기는 선택 정렬을 관찰하세요.</p>
            <div class="sort-viz-container" style="padding:20px 0;">
                <div class="sort-bars" style="display:flex; gap:6px; align-items:flex-end; justify-content:center; min-height:200px;"></div>
                <div class="sort-step-desc" style="padding:14px; background:var(--bg-secondary); border-radius:8px; margin-top:16px; font-size:0.95rem;"></div>
            </div>
        `;
        container.appendChild(vizArea);

        const barsEl = vizArea.querySelector('.sort-bars');
        const descEl = vizArea.querySelector('.sort-step-desc');

        const original = [38, 27, 43, 3, 9, 82, 10];
        let arr = [...original];
        let sortedUpTo = -1;

        function renderBars(comparing = [], minIdx = -1) {
            const maxVal = Math.max(...arr);
            barsEl.innerHTML = arr.map((v, i) => {
                let bg = 'var(--accent)';
                if (i <= sortedUpTo) bg = 'var(--green)';
                else if (i === minIdx) bg = 'var(--yellow)';
                else if (comparing.includes(i)) bg = 'var(--red, #e17055)';
                const h = Math.max(20, (v / maxVal) * 160);
                return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                    <span style="font-size:0.8rem;font-weight:600;">${v}</span>
                    <div style="width:36px;height:${h}px;background:${bg};border-radius:4px 4px 0 0;transition:all 0.3s;"></div>
                </div>`;
            }).join('');
        }

        // Build steps for selection sort
        const steps = [];
        let simArr = [...original];
        let simSorted = -1;

        steps.push({
            description: '초기 배열: [38, 27, 43, 3, 9, 82, 10]. 선택 정렬을 시작합니다!',
            action() { arr = [...original]; sortedUpTo = -1; renderBars(); descEl.innerHTML = this.description; },
            undo() { arr = [...original]; sortedUpTo = -1; renderBars(); }
        });

        for (let i = 0; i < simArr.length - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < simArr.length; j++) {
                if (simArr[j] < simArr[minIdx]) minIdx = j;
            }

            const snapBefore = [...simArr];
            const mi = minIdx;
            const si = i;

            // Find min step
            steps.push({
                description: `${si}번 위치: 정렬 안 된 부분에서 최솟값 ${simArr[mi]}을(를) 찾았습니다! (인덱스 ${mi})`,
                action() {
                    arr = [...snapBefore]; sortedUpTo = si - 1;
                    renderBars([], mi);
                    descEl.innerHTML = this.description;
                },
                undo() {
                    arr = [...snapBefore]; sortedUpTo = si - 1;
                    renderBars();
                }
            });

            // Swap step
            [simArr[i], simArr[minIdx]] = [simArr[minIdx], simArr[i]];
            const snapAfter = [...simArr];

            steps.push({
                description: `${snapBefore[si]}과 ${snapBefore[mi]}을(를) 교환합니다 → [${simArr.join(', ')}]. ${si}번 위치 확정!`,
                action() {
                    arr = [...snapAfter]; sortedUpTo = si;
                    renderBars();
                    descEl.innerHTML = this.description;
                },
                undo() {
                    arr = [...snapBefore]; sortedUpTo = si - 1;
                    renderBars([], mi);
                }
            });
        }

        steps.push({
            description: '정렬 완료! [3, 9, 10, 27, 38, 43, 82]. 선택 정렬의 시간복잡도는 항상 O(n²)입니다.',
            action() {
                sortedUpTo = arr.length - 1;
                renderBars();
                descEl.innerHTML = this.description;
            },
            undo() {}
        });

        this._initStepController(container, steps);
    },

    _createStepControls(container, totalSteps) {
        const controls = document.createElement('div');
        controls.className = 'step-controls';
        controls.innerHTML = `<button class="btn" id="viz-prev">◀ 이전</button><span class="step-indicator">0 / ${totalSteps - 1}</span><button class="btn" id="viz-next">다음 ▶</button><button class="btn btn-primary" id="viz-auto">▶ 자동 재생</button>`;
        container.appendChild(controls);
        return controls;
    },

    _initStepController(container, steps) {
        const controls = this._createStepControls(container, steps.length);
        let current = 0;
        let autoTimer = null;
        const indicator = controls.querySelector('.step-indicator');
        const prevBtn = controls.querySelector('#viz-prev');
        const nextBtn = controls.querySelector('#viz-next');
        const autoBtn = controls.querySelector('#viz-auto');

        const go = (idx) => {
            if (idx < 0 || idx >= steps.length) return;
            while (current < idx) { current++; steps[current].action(); }
            while (current > idx) { steps[current].undo(); current--; }
            indicator.textContent = `${current} / ${steps.length - 1}`;
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === steps.length - 1;
        };

        steps[0].action();
        indicator.textContent = `0 / ${steps.length - 1}`;
        prevBtn.disabled = true;

        prevBtn.addEventListener('click', () => { stopAuto(); go(current - 1); });
        nextBtn.addEventListener('click', () => { stopAuto(); go(current + 1); });
        const stopAuto = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; autoBtn.textContent = '▶ 자동 재생'; } };
        autoBtn.addEventListener('click', () => {
            if (autoTimer) { stopAuto(); return; }
            autoBtn.textContent = '⏸ 일시정지';
            autoTimer = setInterval(() => { if (current >= steps.length - 1) { stopAuto(); return; } go(current + 1); }, 900);
        });
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
            inputDefault: 0,
            solve() { return '1\n2\n3\n4\n5'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
arr = [int(input()) for _ in range(N)]
arr.sort()
print('\\n'.join(map(str, arr)))`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N;
    scanf("%d", &N);
    vector<int> arr(N);
    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);
    sort(arr.begin(), arr.end());
    for (int x : arr) printf("%d\\n", x);
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        int[] arr = new int[N];
        for (int i = 0; i < N; i++) arr[i] = Integer.parseInt(br.readLine().trim());
        Arrays.sort(arr);
        StringBuilder sb = new StringBuilder();
        for (int x : arr) sb.append(x).append("\\n");
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-11650',
            title: 'BOJ 11650 - 좌표 정렬하기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11650',
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
            inputDefault: 0,
            solve() { return '1 -1\n1 1\n2 2\n3 3\n3 4'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
coords = []
for _ in range(N):
    x, y = map(int, input().split())
    coords.append((x, y))

coords.sort()  # 튜플은 자동으로 (x, y) 순 정렬!

output = []
for x, y in coords:
    output.append(f"{x} {y}")
print('\\n'.join(output))`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N;
    scanf("%d", &N);
    vector<pair<int,int>> coords(N);
    for (int i = 0; i < N; i++)
        scanf("%d %d", &coords[i].first, &coords[i].second);
    sort(coords.begin(), coords.end());
    for (auto& [x, y] : coords)
        printf("%d %d\\n", x, y);
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        int[][] coords = new int[N][2];
        for (int i = 0; i < N; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            coords[i][0] = Integer.parseInt(st.nextToken());
            coords[i][1] = Integer.parseInt(st.nextToken());
        }
        Arrays.sort(coords, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        StringBuilder sb = new StringBuilder();
        for (int[] c : coords) sb.append(c[0]).append(" ").append(c[1]).append("\\n");
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'lc-56',
            title: 'LeetCode 56 - Merge Intervals',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/merge-intervals/',
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
            inputDefault: 0,
            solve() { return '[[1,6],[8,10],[15,18]]'; },
            templates: {
                python: `class Solution:
    def merge(self, intervals):
        intervals.sort(key=lambda x: x[0])  # 시작점 기준 정렬
        merged = [intervals[0]]

        for start, end in intervals[1:]:
            if start <= merged[-1][1]:  # 겹침!
                merged[-1][1] = max(merged[-1][1], end)
            else:
                merged.append([start, end])

        return merged`,
                cpp: `class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged = {intervals[0]};

        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] <= merged.back()[1])
                merged.back()[1] = max(merged.back()[1], intervals[i][1]);
            else
                merged.push_back(intervals[i]);
        }
        return merged;
    }
};`,
                java: `class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> merged = new ArrayList<>();
        merged.add(intervals[0]);

        for (int i = 1; i < intervals.length; i++) {
            int[] last = merged.get(merged.size() - 1);
            if (intervals[i][0] <= last[1])
                last[1] = Math.max(last[1], intervals[i][1]);
            else
                merged.add(intervals[i]);
        }
        return merged.toArray(new int[0][]);
    }
}`
            }
        },
        {
            id: 'boj-10814',
            title: 'BOJ 10814 - 나이순 정렬',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10814',
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
            inputDefault: 0,
            solve() { return '20 Sunyoung\n21 Junkyu\n21 Dohyun'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
members = []
for _ in range(N):
    line = input().split()
    members.append((int(line[0]), line[1]))

# Python sort는 안정 정렬 → 나이만 기준으로 정렬해도 입력 순서 유지
members.sort(key=lambda x: x[0])

for age, name in members:
    print(age, name)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N;
    scanf("%d", &N);
    vector<pair<int, string>> v(N);
    for (int i = 0; i < N; i++)
        cin >> v[i].first >> v[i].second;

    // stable_sort: 같은 나이면 입력 순서 유지
    stable_sort(v.begin(), v.end(), [](auto& a, auto& b) {
        return a.first < b.first;
    });

    for (auto& [age, name] : v)
        printf("%d %s\\n", age, name.c_str());
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        String[][] members = new String[N][2];
        for (int i = 0; i < N; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            members[i][0] = st.nextToken(); // age
            members[i][1] = st.nextToken(); // name
        }
        // Arrays.sort(Object[])는 안정 정렬 (TimSort)
        Arrays.sort(members, (a, b) -> Integer.parseInt(a[0]) - Integer.parseInt(b[0]));

        StringBuilder sb = new StringBuilder();
        for (String[] m : members)
            sb.append(m[0]).append(' ').append(m[1]).append('\\n');
        System.out.print(sb);
    }
}`
            }
        }
    ],

    renderProblem(container) {
        container.innerHTML = '';
        const stageList = document.createElement('div');
        stageList.className = 'problem-stages';
        this.stages.forEach(stage => {
            const stageCard = document.createElement('div');
            stageCard.className = 'stage-card';
            stageCard.innerHTML = `<div class="stage-header"><span class="stage-num">단계 ${stage.num}</span><h3>${stage.title}</h3><p>${stage.desc}</p></div><div class="stage-problems"></div>`;
            const problemsDiv = stageCard.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid);
                if (!prob) return;
                const btn = document.createElement('button');
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
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
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLeetCode = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLeetCode ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}</a></div>${problem.descriptionHTML}`;
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
        solveArea.innerHTML = `<div class="editor-header"><h3>풀이 작성</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option><option value="java">Java</option></select></div><textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea><div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ 실행</button><button id="check-btn" class="btn btn-success">✓ 정답 확인</button></div><div id="output-area" class="output-area"><div class="output-label">실행 결과</div><pre id="output-text"></pre></div>`;
        container.appendChild(solveArea);
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });
        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;
        langSelect.addEventListener('change', () => { editor.value = problem.templates[langSelect.value]; });
        editor.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 4; } });
        container.querySelector('#run-btn').addEventListener('click', () => { const expected = problem.solve(problem.inputDefault); this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`); });
        container.querySelector('#check-btn').addEventListener('click', () => { const expected = problem.solve(problem.inputDefault); const site = isLeetCode ? 'LeetCode' : 'BOJ'; this._showOutput(container, `예상 정답:\n${expected}\n\n💡 코드를 ${site}에 제출하여 정답을 확인하세요!`); });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.sorting = sortingTopic;
