# Algorithm Lab — 작업 가이드라인

> 새 토픽이나 문제를 추가/수정할 때 아래 체크리스트를 **반드시** 따른다.
> 이 가이드라인은 **모든 토픽(문자열, 배열, 해시, 스택큐, 연결리스트, ...)** 에 공통 적용된다.

---

## 1. 시각 우선 설명

- **글보다 그림/애니로 먼저 보여준다.**
  - 개념 설명, 생각해볼것 등에서 텍스트 단독 설명은 최후의 수단.
  - **개념 페이지의 모든 섹션에 최소 1개 인터랙티브 데모 필수.** 텍스트만 있는 개념 섹션은 미완성으로 간주한다.
  - "이 개념은 데모가 어렵다"는 핑계 X — 어떤 개념이든 시각화 가능.
  - 참고 패턴: 스택큐(push/pop 데모), 연결리스트(순회/뒤집기/사이클 데모), 정렬(선택/삽입/버블/병합/퀵 데모)
- **코드 결과도 눈으로 보여준다.**
  - 코드만 있는 설명 X → 코드 실행 결과를 시각적으로 보여주는 요소 필수.

## 2. 새 개념 등장 시 참조 링크 & 설명

- ASCII, ord(), Counter, deque 등 **처음 등장하는 개념/함수**에는:
  - 간단한 인라인 설명 (한두 문장)
  - 가능하면 공식 문서 또는 참고 링크를 옆에 배치
  - 예: `ord()` → "문자를 ASCII 숫자로 변환. `ord('A')` → 65" + [Python 공식 문서 링크]

## 3. 문제 설명 — 원본 그대로

- **문제를 임의로 줄이거나 요약하지 않는다.**
  - LeetCode, BOJ 등 원본 문제의 설명을 **그대로** 가져온다.
  - 예제도 원본에 있는 것을 **전부** 포함한다 (보통 2~3개).
  - 제약 조건(Constraints)도 빠짐없이 넣는다.
  - Follow-up 질문이 원본에 있으면 함께 넣는다.

## 4. 시뮬레이션 예제 크기

- **최소**: 배열/문자열 6~10개, 트리/그래프 5~7 노드, 연결 리스트 5 노드
- **최대**: 12~15개 요소. 그 이상은 불필요.
- 핵심 케이스(경계, 실패, 성공)가 모두 포함되도록 예제 구성.

## 5. 시뮬레이션 & 데모 단계

- **1 스텝 = 1 동작 + 그 동작의 설명**. 여러 동작을 묶지 않는다.
- 각 스텝 설명에 **"왜 이걸 하는지"** 를 반드시 포함.
- **설명 먼저 → 동작은 나중에**: "다음" 클릭 시 설명 텍스트를 먼저 표시하고, 짧은 딜레이(~350ms) 후 시각화를 업데이트한다. 설명과 동작이 동시에 일어나면 읽기 어렵다.
- **모든 애니메이션/데모는 세부 동작까지 자세히 보여준다:**
  - 중간 과정을 건너뛰지 않는다. 알고리즘의 **매 비교, 매 이동, 매 판단**을 한 스텝으로 보여준다.
  - **"한꺼번에 결과만 보여주기" 절대 금지** — 과정이 핵심이다.
  - 예: 선택 정렬 — "최솟값을 찾습니다 → 찾았습니다" ✗ (과정 생략)
    - 올바른 방식: "64와 비교 → 25가 더 작으니 최솟값 갱신 → 12와 비교 → ..." 각 비교를 한 스텝씩 보여준다 ✓
  - 예: 이분 탐색 — "mid를 계산 → 비교 → 범위 조정"을 매 반복마다 보여준다.
  - 예: 병합정렬 — "왼쪽 2 vs 오른쪽 1 비교 → 1이 더 작으니 결과에 추가 → 다음 비교..." 한 번에 합치지 않는다.
  - 예: DFS/BFS — "노드 A 방문 → 인접 노드 확인 → B로 이동 → ..." 탐색 경로를 한 노드씩 보여준다.
  - 예: DP — "dp[3] = dp[2] + dp[1] = 2 + 1 = 3" 각 칸의 계산 과정을 보여준다.
  - **스텝 수가 많아지는 것을 두려워하지 않는다.** 20~30 스텝이어도 괜찮다. 과정을 생략하는 것보다 낫다.
  - **개념 페이지의 인라인 데모에도 동일하게 적용한다.** 개념 데모라고 과정을 압축하지 않는다.
- **비교와 이동은 별도 스텝으로 분리한다:**
  - "비교 후 교환"을 한 스텝에 넣지 않는다.
  - 스텝 1: "A[i]와 A[j]를 비교한다 → A[i] > A[j]이므로 교환이 필요하다" (비교 하이라이트)
  - 스텝 2: "A[i]와 A[j]를 교환한다" (이동 애니메이션 실행)
  - 이렇게 해야 학생이 "왜 교환하는지" 이해한 후 "교환 결과"를 본다.

## 6. 개념 페이지 — 충분한 깊이 + 단계적 설명

- 표면적 정의만 하지 않는다.
  - "해시테이블은 키-값 저장소" ← 부족
  - "왜 빠른지(O(1) 평균 조회)", "해싱이란 무엇인지", "충돌은 어떻게 해결하는지" 까지.
- 학생이 **"왜?"** 라고 물을 만한 부분을 미리 짚어준다.
- **개념 설명에는 반드시 인터랙티브 데모를 포함한다** (§1 시각 우선 원칙).
- **개념 도입 시 "이게 없으면 뭐가 불편한지"부터 보여준다.**
  - 자료구조/알고리즘의 존재 이유를 먼저 체감시킨다.
  - 예: 해시테이블 → "배열에서 찾으면 이렇게 느리다" 데모 먼저 → "그래서 해시"
  - 예: 힙 → "매번 정렬하면 이렇게 느리다" → "그래서 힙"
- **비슷한 알고리즘/자료구조가 2개 이상이면 비교 섹션 필수.**
  - 표(방식, 시간복잡도, 장단점) + 핵심 차이 설명
  - "뭐가 다른데?"를 학생이 물어보기 전에 먼저 보여준다.
  - 예: 정렬(선택 vs 삽입 vs 버블 비교표), 탐색(BFS vs DFS), 자료구조(스택 vs 큐 vs 덱)
- **"빠르다/느리다"는 반드시 단계적으로 설명한다:**
  1. **무엇을 하는 연산인지** — "배열에서 특정 값을 찾는 연산"
  2. **기본 방법은 어떻게 동작하는지** — "앞에서부터 하나씩 확인 → O(n)"
  3. **이 자료구조/알고리즘은 어떻게 다른지** — "해시 함수로 위치를 바로 계산"
  4. **그래서 왜 빠른지** — "계산 한 번이면 바로 찾으니까 O(1)"
  - 예: "딕셔너리가 빠르다" → ① 값 찾기 연산 → ② 배열은 하나씩 확인 O(n) → ③ 딕셔너리는 해시 함수로 위치 계산 → ④ 그래서 O(1)
  - **"O(1)이라서 빠르다"로 끝내지 않는다.** 왜 O(1)인지까지.

## 7. 생각해볼것 탭 — 점진적 사고 유도

- **아이의 자연스러운 생각 흐름을 따라간다.** 정답을 바로 알려주지 않는다.
- 힌트는 **이야기식으로 점증적**으로 구성한다:
  1. **"처음 떠오르는 방법"** — 아이가 가장 먼저 생각할 법한 직관적 접근
     - 예: "일단 전부 비교하면 되지 않나?" / "이중 for문으로 다 해보면?"
  2. **"근데 이러면 문제가 있어"** — 그 방법의 한계를 스스로 느끼게
     - 예: "N이 10만이면 이중 for문은 100억 번... 시간 초과!"
  3. **"이렇게 하면 어떨까?"** — 개선된 접근을 자연스럽게 제안
     - 예: "이미 본 숫자를 기억해두면? → 딕셔너리!"
  4. **(선택) "Python에선 이런 것도 있어"** — 라이브러리/모듈 활용
- **각 힌트는 이전 힌트를 읽었다는 전제**로 작성한다.
  - 힌트 1만 보고 도전해볼 수 있고, 안 되면 힌트 2를 열어보는 구조.
  - 힌트끼리 흐름이 이어져야 한다 (독립적인 팁 나열 X).
- 학생이 떠올리기 어려운 비효율적 코드는 굳이 보여주지 않는다.
  - 학생이 실제로 생각할 법한 접근만 다룬다.
- **힌트 안에서도 시각 우선 원칙을 적용한다** (§1):
  - 텍스트로만 설명하지 말고, 간단한 인라인 시각화나 비유 이미지를 함께.
  - 예: 시간 복잡도 비교 → 표/그래프, 자료구조 동작 → 단계별 그림.
  - 이미 구현된 패턴: 스택큐(push/pop 데모), 연결리스트(순회/뒤집기/사이클 데모), 정렬(선택/삽입/버블 비교 데모)

## 8. 코드 탭 — 점진적 코드 흐름

- 코드 탭(`codeSteps`)에서도 동일한 점증적 흐름:
  1. **직관적 접근** (브루트포스)
  2. **문제 인식** ("근데 이러면 느리네")
  3. **개선된 접근**
  4. **(선택) 라이브러리/모듈**
- 학생이 처음부터 최적해를 모르는 게 정상.
- **코드가 길면 탭/스텝으로 분리한다:**
  - 한 화면에 코드 전체를 보여주면 압도감 → `codeSteps` 배열로 단계별 표시.
  - 각 스텝에는 `title`(어떤 접근인지), `desc`(왜 이렇게 하는지), `code`(코드 본문).
  - "다음" 탭을 눌러서 코드를 한 단계씩 볼 수 있게 구성.
  - 새로 추가된 줄은 하이라이트(§11)로 시각적으로 구분.

---

## 9. 디자인 시스템

### 매 작업 후 체크리스트

- [ ] **줄 간격**: `line-height` 본문 1.75, 코드 1.6
- [ ] **블록 간 여백**: concept-section 사이 2.5rem+, 카드 내부 padding 2rem+
- [ ] **폰트 크기**: 본문 0.95rem+, 코드 0.85rem+, 제목 1.2rem+
- [ ] **색 대비**: 본문 `var(--text)` (거의 검정), 보조 `var(--text2)`, 코드 구문 하이라이팅 선명
- [ ] **코드 블록**: 배경 대비 확실, 테두리 있음, padding 충분
- [ ] **모바일 반응형**: 카드 1열, 코드 가로 스크롤, 버튼 터치 가능 크기(44px+)

### 타이포그래피

| 요소 | 크기 | line-height |
|------|------|-------------|
| 본문 | 0.95rem+ | 1.75 |
| 코드 블록 | 0.85rem+ | 1.6~1.8 |
| 제목 | 1.2rem+ | — |
| 라벨/뱃지 | 0.65~0.85rem | — |

### 간격 원칙

- **컴포넌트 사이는 충분히 띄운다** — 붙어있으면 복잡해 보인다.
  - `concept-section` 사이: 2.5rem+
  - 카드 내부 padding: 2rem+ (모바일: 1.5rem)
  - sim-card 내부 padding: 2.5rem 3rem (모바일: 1.5rem 1rem)
  - 요소 간 gap: 최소 12px
  - 설명 텍스트와 시각화 사이: 최소 1rem
- **모바일 반응형** (768px 이하):
  - `main` padding: 1rem
  - 카드 1열 레이아웃, 코드 가로 스크롤
  - 버튼 터치 가능 크기: min-height 44px+

### 색상 체계

| 용도 | 색상 |
|------|------|
| 현재 처리 중 | 노랑 (`var(--yellow)`) + 글로우 |
| 정답/매칭/성공 | 초록 (`var(--green)`) + 글로우 |
| 실패/제거 | 빨강 (`var(--red)`) + opacity 감소 |
| 기본/강조 | 보라 (`var(--accent)`) |
| 스텝 설명 영역 | 따뜻한 노랑 (`var(--warm-bg)` + `var(--warm-accent)` 왼쪽 보더) |

### CSS 변수 (`:root`)

```
--bg / --bg2 / --bg3          배경 (페이지 / 카드 / 테두리)
--text / --text2 / --text3    텍스트 (본문 / 보조 / 라벨)
--accent / --accent2           보라 메인 / 짙은 보라
--green / --red / --yellow     상태 색상
--warm-bg / --warm-border / --warm-accent  스텝 설명 색상
--radius                       14px (공통 border-radius)
```

---

## 10. 시뮬레이션 레이아웃

### 구조 (위에서 아래)

1. **사용자 입력 영역** — 시뮬레이션 데이터를 바꿀 수 있는 input 필드 + 🔄 버튼
2. **`viz-step-desc`** — 현재 스텝 설명 (시각화 **위**에 배치)
3. **`sim-card`** — 시각화 메인 영역
4. **`viz-step-controls`** — 이전/다음 버튼 (sticky, 하단 고정)

### 사용자 커스텀 입력 (필수)

- **모든 시뮬레이션에 사용자 입력 필드를 제공한다.**
  - 학생이 직접 값을 바꿔보면서 동작을 이해하는 게 핵심.
  - 고정 데이터만 보여주면 "이 예제에서만 되는 건가?" 하는 의문 해소 불가.
- **입력 구성**:
  - 배열/문자열 → `<input type="text">` (쉼표 구분, 예: "1,3,5,7")
  - 숫자 1개 (target, K 등) → `<input type="number">`
  - 🔄 리셋 버튼: 입력값으로 시뮬레이션을 재생성
- **입력 변경 시**: 스텝을 초기화하고 새 데이터로 시뮬레이션 스텝 재구성.
- **기본값**: 문제의 대표 예제를 기본값으로 세팅.
- 참고 패턴: `array.js`(Two Sum — 배열 + target), `hashtable.js`(Subarray Sum — 배열 + k), `string.js`(palindrome — 문자열 input)

### 핵심 원칙

- **주인공은 시각화** — 컨트롤/설명은 보조 역할. 시각화보다 눈에 띄면 안 됨.
- **desc와 sim-card는 시각적으로 연결** — desc 하단 border 제거, sim-card 상단 radius 제거.
- `position: fixed; bottom: 0` 사용 금지 — sticky로 콘텐츠 안에 배치.
- 포인터/라벨(top, front, back, L, R, prev, curr, head 등)은 항상 표시.

### 스텝 컨트롤러

- `_createStepDesc(suffix)` + `_createStepControls(suffix)` 로 분리 생성
- `_initStepController(container, steps, suffix, resetAction)` 로 초기화
- `currentStep = -1`로 시작 → "시작 전" 상태
- 키보드: `→` / `Space` = 다음, `←` = 이전

### 개념 페이지 인라인 데모

- HTML은 `renderConcept`의 innerHTML 안, JS 인터랙션은 innerHTML 설정 후 작성
- CSS 클래스: `.concept-demo`, `.concept-demo-btn`, `.concept-demo-msg`
- 데모별 CSS: `.demo-item`(스택/큐), `.demo-ll-node-box`(연결리스트), `.sort-concept-arr`(정렬), 등

---

## 11. 이동 애니메이션 (Flying Ghost)

- **값이 한 위치에서 다른 위치로 이동하는 동작은 반드시 애니메이션으로 보여준다.**
  - 즉시 상태 변경 X → 원본 위치에서 목적지까지 날아가는 시각적 이동 필수.
  - 예: 정렬(swap), LIS(tails 배열에 삽입/교체), 병합정렬(합치기), 스택/큐(push/pop)
- **"그냥 바뀌는" 것은 안 된다** — 학생이 "어디서 어디로 갔는지" 눈으로 따라갈 수 있어야 한다.

### FLIP 애니메이션 구현 패턴

```js
function animateMove(value, srcId, destId, color, onDone) {
    var srcEl = container.querySelector('#' + srcId);
    var wrapRect = wrapEl.getBoundingClientRect();  // position:relative 래퍼
    if (!srcEl) { if (onDone) onDone(); return; }
    var srcRect = srcEl.getBoundingClientRect();

    // 1. 고스트 생성 — 원본 위치에 absolute로 배치
    var ghost = document.createElement('div');
    ghost.textContent = value;
    ghost.style.cssText = 'position:absolute;z-index:20;' +
        'left:' + (srcRect.left - wrapRect.left) + 'px;' +
        'top:' + (srcRect.top - wrapRect.top) + 'px;' +
        'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);' +
        'background:' + color + ';color:white;transform:scale(1.15);';
    flyEl.appendChild(ghost);  // position:absolute 오버레이 컨테이너

    // 2. 목적지 좌표 계산 → CSS transition으로 이동
    requestAnimationFrame(function() {
        var destEl = container.querySelector('#' + destId);
        var destRect = destEl.getBoundingClientRect();
        requestAnimationFrame(function() {
            ghost.style.left = (destRect.left - wrapRect.left) + 'px';
            ghost.style.top = (destRect.top - wrapRect.top) + 'px';
            ghost.style.transform = 'scale(1)';
        });
        // 3. 애니메이션 완료 후 고스트 제거 + 실제 DOM 업데이트
        setTimeout(function() {
            if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
            if (onDone) onDone();
        }, 550);
    });
}
```

### 핵심 규칙

- **래퍼**: 시각화 영역에 `position: relative` 래퍼 + `position: absolute` 오버레이(`flyEl`) 필수
- **좌표 계산**: `getBoundingClientRect()`로 source/dest 위치를 구하고 래퍼 기준으로 변환
- **방향 분기**: `action(dir)` — `dir === 'forward'`일 때만 애니메이션, 아니면 즉시 반영 (뒤로가기 시)
- **타이밍**: CSS `transition` 0.5s + `setTimeout` 550ms 후 정리
- **참조 구현**: `binarysearch.js` — `_renderVizLIS`의 `animateMove()` 함수

### 적용 대상

| 유형 | 이동 애니메이션 |
|------|----------------|
| 정렬 (swap) | 두 요소가 서로 교차하며 날아감 |
| LIS/tails | 원본 배열 → tails 배열로 값이 날아감 |
| 병합정렬 | 분할된 조각 → 병합 결과로 이동 |
| 스택/큐 push | 새 요소가 날아와서 삽입 |
| 스택/큐 pop | 요소가 날아가며 제거 |
| 트리 삽입 | 새 노드가 부모에서 자식 위치로 이동 |
| 그래프 BFS/DFS | 현재 노드에서 다음 노드로 탐색 이동 |

---

## 12. 하이라이트 & 강조

- **시뮬 현재 처리 중**: `box-shadow` + `border-color` 변경 + 약간의 `scale`
- **코드 새로 추가된 줄**: 배경 하이라이트 + 왼쪽 보더
- **매칭/성공**: 초록 글로우 (`var(--green-glow)`)
- **실패/제거**: 빨강 글로우 + opacity 감소
- 강조가 안 보이면 의미가 없다 → 글로우 강도, 색 대비를 넉넉히.

## 13. 모든 처리에는 이유를

- 코드의 WHY-comment: `# deque: 양쪽 O(1) 삽입/삭제라서 선택`
- 시뮬 스텝 설명: "왜 이 값을 비교하는가", "왜 이 자료구조를 쓰는가"
- 개념 설명: "전처리가 필요한 이유", "정렬하는 이유", "딕셔너리를 쓰는 이유"
- **"무엇을 했다"만 쓰지 말고 "왜 했다"를 반드시 함께.**

---

## 파일 구조

```
topics/
  string.js       — 문자열 조작
  array.js        — 배열
  hashtable.js    — 해시테이블
  stackqueue.js   — 스택과 큐
  linkedlist.js   — 연결 리스트
  ...
style.css          — 전역 스타일 (CSS 변수, 컴포넌트 스타일)
app.js             — 라우팅, 랜딩 페이지, 탭 전환, 타자 효과
```

## 코드 패턴

- **codeSteps**: `{ title, desc, code }` — code에 WHY-comment 포함
- **스텝 객체**: `{ action: (direction) => {}, description: '설명' }`
- 각 토픽 파일은 동일한 구조: `renderConcept`, `_renderViz*`, `_initStepController`

### 언어 지원: Python + C++ (Java 제거됨)

- **지원 언어**: Python과 C++ **두 가지만** 제공한다.
- **Java는 사용하지 않는다** — langNames, templates, codeSteps 모두에서 제거됨.
- **codeSteps 구조**:
  ```js
  codeSteps: {
      python: [{ title, desc, code }, ...],
      cpp: [{ title, desc, code }, ...]
  }
  ```
- **C++ 코드 스타일**:
  - 표준 라이브러리만 사용: `#include <iostream>`, `#include <vector>`, `#include <algorithm>` 등
  - `#include <bits/stdc++.h>` **사용 금지** (시험 대비 표준 스타일)
  - `using namespace std;` 허용
  - WHY-comment 포함 (§12)
- **언어별 차이 포인트** (codeSteps에 반영):
  - Python `dict` → C++ `unordered_map`
  - Python `bisect_left` → C++ `lower_bound`
  - Python `sort(key=)` → C++ `sort()` + 람다 비교 함수
  - Python `deque` → C++ `queue`/`deque`
  - Python 클래스 → C++ 포인터, `nullptr`, `->`

### 전역 언어 선택 (Python / C++ 토글)

- **전역 상태**: `window._algoLang` (`'python'` 또는 `'cpp'`), `localStorage`에 저장
- **body 속성**: `document.body.setAttribute('data-lang', lang)` → CSS로 토글
- **토글 UI**: 문제 페이지 탭바 옆에 `🐍 Python | ⚡ C++` 버튼 (app.js)
- **CSS 규칙** (style.css):
  ```css
  body[data-lang="python"] .lang-cpp { display: none !important; }
  body[data-lang="cpp"] .lang-py { display: none !important; }
  ```
- **힌트 content에서 언어별 내용 분리**:
  ```html
  <span class="lang-py">Python: <code>heapq.heappush</code></span>
  <span class="lang-cpp">C++: <code>pq.push()</code></span>
  ```
  - Python 전용 코드/설명은 반드시 `<span class="lang-py">` 안에
  - C++ 전용 코드/설명은 반드시 `<span class="lang-cpp">` 안에
  - 언어 무관한 알고리즘 설명은 span 없이 작성
- **코드 탭 연동**: `renderSolutionsCodeTab`이 `window._algoLang`을 읽어 기본 언어 설정, 변경 시 `window._setAlgoLang()` 호출로 양방향 동기화

### "설명 먼저 → 동작 나중" 구현 패턴 (§5)

모든 `_initStepController`에서 "다음" / "이전" 클릭 시:
```js
var actionDelay = 350;
nextBtn.addEventListener('click', () => {
    state.currentStep++;
    updateUI();  // 설명(viz-step-desc) + 카운터 먼저 업데이트
    setTimeout(() => {
        state.steps[state.currentStep].action('forward');
    }, actionDelay);  // 350ms 뒤에 시각화 애니메이션 실행
});
```
- `updateUI()`가 `action()` 보다 **반드시 먼저** 실행된다.
- 이 패턴은 **모든 토픽 파일**의 `_initStepController`에 동일 적용.

### 사용자 입력 → 시뮬레이션 재구성 패턴 (§10)

```js
resetBtn.addEventListener('click', () => {
    const newData = parseInput(inputEl.value);  // 입력값 파싱
    const newSteps = buildSteps(newData);        // 새 스텝 배열 생성
    state.steps = newSteps;
    state.currentStep = -1;
    resetVisualization();                         // 시각화 초기화
    updateUI();                                   // UI 리셋
});
```

---

## 14. 참조 구현 (Quality Bar)

모든 토픽의 개념 페이지는 아래 수준을 **최소 기준**으로 삼는다. 미달 토픽은 미완성으로 간주하고 보강한다.

| 토픽 | 최소 데모 | 참조 |
|------|-----------|------|
| 문자열 | 3개 (인덱스/슬라이싱, ord/chr, 문자비교) | `string.js` |
| 배열 | 3개 (인덱스 O(1), 삽입/삭제 비용, 투포인터) | `array.js` |
| 스택큐 | 4개 (Push/Pop, Enqueue/Dequeue, 양방향, 괄호검증) | `stackqueue.js` |
| 연결리스트 | 3개 (순회, 뒤집기, 토끼와 거북이) | `linkedlist.js` |
| 해시테이블 | 4개 (배열vs딕셔너리, 해시함수, 빈도수세기, 충돌/체이닝) | `hashtable.js` |
| 이분탐색 | 4개 (이분탐색, 탐색실패, 크기비교, 매개변수탐색) | `binarysearch.js` |
| 정렬 | 7개 (선택/삽입/버블 + 비교표 + 속도비교 + 병합/퀵) | `sorting.js` |
| 재귀 | 5개 (마트료시카, 멈추는조건비교, 콜스택, 재귀vs반복, 3단계피보나치) | `recursion.js` |
| 트리 | 4개 (용어확인, 노드추가, 전위순회, DFS깊이) | `tree.js` |
| 백트래킹 | 6개 (결정트리, 3요소따라가기, 사이클데모, 가지치기비교, 실행비교, 4Queen) | `backtracking.js` |
| 분할정복 | 5개 (이진탐색, 합병정렬3단계, 겹침비교, 빠른거듭제곱, 색종이쿼드트리) | `divideconquer.js` |
| 그리디 | 5개 (거스름돈, 실패경우비교, 활동선택타임라인, ATM줄서기, 3단계회의실) | `greedy.js` |
| DP | 4개 (피보나치테이블, 4단계계단오르기, TopDown-vs-BottomUp, 유형맞추기) | `dp.js` |
| 그래프 | 5개 (인접리스트만들기, DFS따라가기, BFS따라가기, 격자BFS, 유형맞추기퀴즈) | `graph.js` |
| 트라이 | 3개 (트라이만들기, 검색따라가기, 자동완성) | `trie.js` |
| 누적합 | 5개 (누적합만들기, 쌓기과정, 반복문vs누적합, 2D포함배제, 유형맞추기) | `prefixsum.js` |
| 위상정렬 | 4개 (DAG진입차수, 순서맞추기, Kahn따라가기, 큐vs힙비교) | `topologicalsort.js` |
| 우선순위큐 | 5개 (큐vs우선순위큐, 배열트리변환, SiftUp삽입, heapq시뮬레이터, 유형맞추기) | `priorityqueue.js` |
| 유니온파인드 | 3개 (Union&Find체험, 경로압축, 사이클탐지) | `unionfind.js` |
| 최단경로 | 4개 (BFS vs 다익스트라, 다익스트라스텝, 그리디증명, 벨만포드완화) | `shortestpath.js` |
| 비트조작 | 4개 (2진수변환, 비트연산시각화, 비트마스크집합, XOR짝없는수) | `bitmanipulation.js` |

- **새 토픽 추가 시**: 개념 섹션 수 ≥ 데모 수. 텍스트만 있는 섹션이 있으면 데모를 추가한 뒤 완료로 간주.
- **비교 가능한 개념이 2개 이상이면**: 비교표 + 핵심 차이 섹션 필수 (정렬의 "세 정렬, 뭐가 다를까?" 참조).
