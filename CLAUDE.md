# Algorithm Lab — 작업 가이드라인

> 새 토픽이나 문제를 추가/수정할 때 아래 체크리스트를 **반드시** 따른다.

---

## 1. 시각 우선 설명 (Visual-First Explanation)

- **글보다 그림/애니로 먼저 보여준다.**
  - 생각해볼것, 개념 설명 등에서 텍스트 단독 설명은 최후의 수단.
  - 가능하면 인라인 인터랙티브 데모(클릭/스텝형)를 먼저 넣는다.
  - 참고: 재귀(마트료시카), 백트래킹(의사결정 트리), 스택큐(push/pop 데모) 패턴.
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
  - 예제도 원본에 있는 것을 **전부** 포함한다 (보통 2~3개, 많으면 전부).
  - 제약 조건(Constraints)도 빠짐없이 넣는다.
  - Follow-up 질문이 원본에 있으면 함께 넣는다.
- **`descriptionHTML` 필수 구성:**
  1. 문제 설명 (원문 번역, 줄이지 않기)
  2. 예제 **전부** (입력/출력 + 설명)
  3. 제약 조건
  4. Follow-up (있으면)

## 4. 시뮬레이션 예제 길이

- **너무 짧으면 문제를 파악할 수 없다.**
  - 최소 요소 수: 배열/문자열 6~10개, 트리/그래프 5~7 노드.
  - 문제의 핵심 케이스(경계, 실패, 성공)가 모두 포함되도록 예제 구성.
- **너무 길면 지루하다.**
  - 최대 12~15개 요소. 그 이상은 불필요.

## 5. 시뮬레이션 단계 — 더 자세하게

- 한 스텝에 여러 동작을 묶지 않는다.
  - **1 스텝 = 1 동작 + 그 동작의 설명**
  - 예: "i=2 확인 → nums[2]=11, 11+? → target 아님" (동작) + "아직 짝을 못 찾았으니 다음으로" (이유)
- 각 스텝의 설명 메시지에는 **"왜 이걸 하는지"** 를 반드시 포함.

## 6. 개념 페이지 — 충분한 깊이

- 표면적 정의만 하지 않는다.
  - "해시테이블은 키-값 저장소" ← 부족
  - "왜 빠른지(O(1) 평균 조회)", "해싱이란 무엇인지", "충돌은 어떻게 해결하는지" 까지.
- 학생이 **"왜?"** 라고 물을 만한 부분을 미리 짚어준다.

## 7. 생각해볼것 탭 — 점진적 사고 유도

- **아이의 자연스러운 생각 흐름을 따라간다.** 정답을 바로 알려주지 않는다.
- 힌트는 **이야기식으로 점증적**으로 구성한다:
  1. **"처음 떠오르는 방법"** — 아이가 가장 먼저 생각할 법한 보편적/직관적 접근
     - 예: "일단 전부 비교하면 되지 않나?" / "이중 for문으로 다 해보면?"
  2. **"근데 이러면 문제가 있어"** — 그 방법의 한계를 스스로 느끼게
     - 예: "N이 10만이면 이중 for문은 100억 번... 시간 초과!"
  3. **"이렇게 하면 어떨까?"** — 개선된 접근을 자연스럽게 제안
     - 예: "이미 본 숫자를 기억해두면? → 딕셔너리!"
  4. **(선택) "Python에선 이런 것도 있어"** — 라이브러리/모듈 활용
- **각 힌트는 이전 힌트를 읽었다는 전제** 하에 작성한다.
  - 힌트 1만 보고 도전해볼 수 있고, 안 되면 힌트 2를 열어보는 구조.
  - 힌트끼리 흐름이 이어져야 한다 (독립적인 팁 나열 X).
- 학생이 떠올리기 어려운 비효율적 코드는 굳이 보여주지 않는다.
  - 학생이 실제로 생각할 법한 접근만 다룬다.

## 8. 사고 흐름 — 코드 탭 적용

- 코드 탭(`codeSteps`)에서도 동일한 점증적 흐름을 유지한다:
  1. **직관적 접근** (브루트포스) — "일단 이렇게 하면 되지 않나?"
  2. **문제 인식** — "근데 이러면 느리네 / 이런 케이스가 안 되네"
  3. **개선된 접근** — "이렇게 하면 더 빠르다"
  4. **(선택) 라이브러리/모듈** — "Python에선 Counter로 한 줄에 해결 가능"
- 학생이 처음부터 최적해를 모르는 게 정상. 직관적 방법을 먼저 보여주고 왜 안 되는지 느끼게 한 후 개선.

## 9. 읽기 최적화 (Typography & Spacing)

- 매 작업 후 아래 항목을 체크:
  - [ ] **줄 간격**: `line-height` 본문 1.7~1.8, 코드 1.6
  - [ ] **블록 간 여백**: concept-section 사이 2.5rem 이상, 카드 내부 padding 2rem
  - [ ] **폰트 크기**: 본문 0.95rem+, 코드 0.85rem+, 제목 1.2rem+
  - [ ] **색 대비**: 본문 `var(--text)` (거의 검정), 보조 `var(--text2)`, 코드 구문 하이라이팅 선명
  - [ ] **코드 블록**: 배경 대비 확실, 테두리 있음, padding 충분
  - [ ] **모바일 반응형**: 카드 1열, 코드 가로 스크롤, 버튼 터치 가능 크기(44px+)

## 10. 시뮬레이션 레이아웃

### 전체 구조 — desc → sim-card → controls

시뮬레이션 영역은 아래 순서로 배치한다 (위에서 아래):
1. **`viz-step-desc`** — 현재 스텝 설명 (시각화 **위**에 배치, 분할주의 효과 방지)
2. **`sim-card`** — 시각화 메인 영역 (카드 컨테이너)
3. **`viz-step-controls`** — 이전/다음 버튼 (sticky, 하단 고정)

```
container.innerHTML = self._createStepDesc(suffix) + vizHTML + self._createStepControls(suffix);
```

### sim-card (시각화 카드 컨테이너)

- **클래스**: `.sim-card` — 시각화 콘텐츠를 감싸는 카드
- **비율**: 가로 대비 세로가 납작하면 불편 → **min-height: max(320px, 40vh)** 로 뷰포트 반응형
  - 작은 창(800px) → 320px, 큰 창(1080px) → 432px
  - 편안한 카드 비율: **2.5:1 ~ 3:1** (16:9 ~ 3:2 사이)
- **내부 정렬**: `display: flex; align-items: center; justify-content: center` → 콘텐츠 중앙 배치
- **패딩**: `2.5rem 3rem` — 좌우/상하 여유 충분히
- **스타일**: `background: var(--bg2); border: 1px solid var(--bg3); border-radius: var(--radius)`

### 간격과 여백

- **간격과 여백을 충분히** — 요소끼리 붙어있으면 복잡해 보인다.
  - sim-card 내부 padding: 최소 2.5rem
  - 요소 간 gap: 최소 12px
  - 설명 텍스트와 시각화 사이: 최소 1rem
- **색 구분을 확실히** — 현재 확인 중(노랑), 정답/매칭(초록), 실패/제거(빨강), 기본(보라/회색)
- **포인터/라벨** — top, front, back, L, R 등은 항상 표시

## 11. 하이라이트 & 강조

- **코드 스텝에서 새로 추가된 줄**: 배경 하이라이트 + 왼쪽 보더 (현재 적용됨)
- **시뮬에서 현재 처리 중인 요소**: `box-shadow` + `border-color` 변경 + 약간의 `scale`
- **매칭/성공**: 초록 글로우 (`var(--green-glow)`)
- **실패/제거**: 빨강 글로우 + opacity 감소
- 강조가 안 보이면 의미가 없다 → **글로우 강도, 색 대비를 넉넉히**

## 12. 모든 처리에는 이유를

- 코드의 WHY-comment: `# deque: 양쪽 O(1) 삽입/삭제라서 선택`
- 시뮬 스텝 설명: "왜 이 값을 비교하는가", "왜 이 자료구조를 쓰는가"
- 개념 설명: "전처리가 필요한 이유", "정렬하는 이유", "딕셔너리를 쓰는 이유"
- **"무엇을 했다"만 쓰지 말고 "왜 했다"를 반드시 함께.**

---

## 파일 구조 참고

```
topics/
  string.js       — 문자열 조작 (4문제)
  array.js        — 배열 (4문제)
  hashtable.js    — 해시테이블 (4~5문제)
  stackqueue.js   — 스택과 큐 (4문제)
  ...
style.css          — 전역 스타일
app.js             — 라우팅, 랜딩 페이지, 탭 전환
```

## 코드 패턴 참고

- **codeSteps**: `{ title, desc, code }` — code에 WHY-comment 포함
- **개념 페이지 인라인 데모**: HTML은 `renderConcept`의 innerHTML 안, JS 인터랙션은 innerHTML 뒤에 작성
- **CSS 클래스**: `.concept-demo`, `.concept-demo-btn`, `.demo-item`, `.demo-stack`, `.demo-queue`

### 시뮬레이션 스텝 컨트롤 (통일 패턴)

**적용 완료**: `string.js`, `array.js`, `hashtable.js`, `stackqueue.js` — 4개 토픽 전체 시뮬레이션에 적용됨.

**HTML 생성** — `_createStepDesc(suffix)` + `_createStepControls(suffix)` (분리):
```html
<!-- _createStepDesc: 시각화 위에 배치 -->
<div id="viz-step-desc{suffix}" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>

<!-- sim-card: 시각화 메인 영역 -->
<div class="sim-card">...</div>

<!-- _createStepControls: 시각화 아래에 배치 -->
<div class="viz-step-controls">
  <button class="btn viz-step-btn" id="viz-prev{suffix}">← 이전</button>
  <span class="viz-step-counter" id="viz-step-counter{suffix}">시작 전</span>
  <button class="btn btn-primary viz-step-btn" id="viz-next{suffix}">다음 →</button>
</div>
```

**스텝 객체 구조**:
```js
{
  action: () => { /* 시각화 업데이트 로직 */ },
  description: '이 스텝에서 무슨 일이 일어나는지 설명'
}
```

**컨트롤러 초기화** — `_initStepController(container, steps, suffix)`:
- `currentStep = -1`로 시작 → "시작 전" 상태
- "다음" 클릭 → `currentStep++`, `steps[i].action()` 실행, `viz-step-desc`에 `description` 표시
- "이전" 클릭 → `currentStep--`, 해당 스텝의 `action()` 재실행
- 키보드: `→` / `Space` = 다음, `←` = 이전

**CSS 클래스** (style.css에 정의됨):
- `.sim-card` — 시각화 카드 컨테이너 (`min-height: max(320px, 40vh)`, flex 중앙 정렬, `var(--bg2)` 배경)
- `.viz-step-controls` — `position: sticky; bottom: 12px` (콘텐츠 안에 위치, ~~`position: fixed` 사용 금지~~)
- `.viz-step-btn` — 이전/다음 버튼 스타일 (컴팩트: font-size 0.82rem, min-width 72px)
- `.viz-step-counter` — "Step 1 / 12" 카운터 (accent 색상, bold, font-size 0.85rem)
- `.viz-step-desc` — 설명 영역 (연한 보라 배경 + 왼쪽 보더, 시각화 **위**에 배치)

**파일별 구현 차이**:
- `stackqueue.js` / `hashtable.js` — id 기반 셀렉터 (`#viz-prev-cd`, `#viz-step-desc-cd` 등)
- `array.js` — data-attribute 기반 셀렉터 (`data-step-group`, `data-role`), 기존 카드 래퍼에 `class="sim-card"` + `style="overflow:hidden;padding:0;"` 추가
- `string.js` — id 기반, `_initLocalStepController` 사용 (파일 전용 로컬 스텝 컨트롤러)

**⚠️ 디자인 원칙 — 주인공은 시각화**:
- 컨트롤/설명은 **보조 역할** → 메인 시각화보다 눈에 띄면 안 됨
- 컨트롤 바: 컴팩트하게 (버튼 작게, 패딩 최소)
- 설명 영역: 연한 배경 + 왼쪽 보더 (진한 보라 배경에 흰 글씨 금지)
- `position: fixed; bottom: 0` 사용 금지 — sticky로 콘텐츠 안에 배치
- desc와 controls는 반드시 **별도 메서드**(`_createStepDesc`, `_createStepControls`)로 분리
