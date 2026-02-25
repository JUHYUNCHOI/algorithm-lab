// =========================================================
// 비트 조작 (Bit Manipulation) 토픽 모듈
// =========================================================
const bitManipulationTopic = {
    id: 'bitmanipulation',
    title: '비트 조작',
    icon: '💻',
    category: '심화 선택',
    order: 19,
    description: '비트 연산과 비트 마스크를 활용한 효율적인 문제 해결 기법',
    relatedNote: '비트 연산은 비트마스크 DP, 부분집합 열거, XOR 트릭 등 다양한 최적화 기법의 기반이 됩니다.',

    // ===== 개념 설명 탭 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>💻 비트 조작 (Bit Manipulation)</h2>
                <p class="hero-sub">컴퓨터의 언어인 0과 1을 직접 다뤄봅시다!</p>
            </div>

            <!-- 섹션 1: 비트란? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> 비트란?
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 비트는 <em>"전등 스위치"</em>와 같습니다!
                    스위치는 <strong>켜짐(1)</strong>과 <strong>꺼짐(0)</strong>, 두 가지 상태만 있습니다.
                    전등 스위치 8개를 나란히 놓으면 0부터 255까지의 숫자를 표현할 수 있습니다.
                    예를 들어 <code>00001010</code>은 스위치 2번과 4번이 켜져 있는 것으로, 숫자 10을 의미합니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">0 1</text></svg>
                        </div>
                        <h3>비트(Bit)</h3>
                        <p>컴퓨터가 다루는 가장 작은 단위입니다. 0 또는 1, 딱 두 가지 값만 가집니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--green)">8 bit</text></svg>
                        </div>
                        <h3>바이트(Byte)</h3>
                        <p>8개의 비트를 묶으면 1바이트입니다. 8비트로 0부터 255(2<sup>8</sup>-1)까지 표현할 수 있습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">1010₂</text></svg>
                        </div>
                        <h3>2진수</h3>
                        <p>우리가 쓰는 10진수 대신, 0과 1만 사용합니다. <code>1010₂</code> = 8+0+2+0 = <strong>10</strong>입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--accent)">bin()</text></svg>
                        </div>
                        <h3>bin() 함수</h3>
                        <p>Python에서 <code>bin(10)</code>은 <code>'0b1010'</code>을 반환합니다. 2진수를 쉽게 확인할 수 있습니다!</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 2진수 표현
print(bin(10))      # '0b1010' — 10을 2진수로
print(bin(255))     # '0b11111111' — 8비트 최대값
print(0b1010)       # 10 — 2진수를 10진수로

# 2진수 문자열로 변환
print(format(10, '08b'))  # '00001010' — 8자리로 맞추기
print(f"{10:08b}")        # '00001010' — f-string 방법</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text"><code>0b11001</code>은 10진수로 얼마일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        정답은 <strong>25</strong>입니다!
                        <code>1×16 + 1×8 + 0×4 + 0×2 + 1×1 = 25</code>입니다.
                        오른쪽부터 1, 2, 4, 8, 16… 자릿값을 곱해서 더하면 됩니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 2: 비트 연산자 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> 비트 연산자
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 비트 연산은 <em>"전등 스위치를 규칙에 따라 조작하는 것"</em>입니다!
                    AND는 "둘 다 켜져야 켜짐", OR는 "하나라도 켜지면 켜짐",
                    XOR는 "서로 다를 때만 켜짐"이라고 생각하면 됩니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="26" font-size="18" font-weight="bold" fill="var(--accent)">&amp;</text></svg>
                        </div>
                        <h3>AND (&)</h3>
                        <p>둘 다 1이면 1, 아니면 0입니다.<br><code>1010 & 1100 = 1000</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="10" y="26" font-size="18" font-weight="bold" fill="var(--green)">|</text></svg>
                        </div>
                        <h3>OR (|)</h3>
                        <p>하나라도 1이면 1입니다.<br><code>1010 | 1100 = 1110</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="8" y="26" font-size="18" font-weight="bold" fill="var(--yellow)">^</text></svg>
                        </div>
                        <h3>XOR (^)</h3>
                        <p>서로 다르면 1, 같으면 0입니다.<br><code>1010 ^ 1100 = 0110</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="8" y="26" font-size="18" font-weight="bold" fill="var(--red, #e17055)">~</text></svg>
                        </div>
                        <h3>NOT (~)</h3>
                        <p>0은 1로, 1은 0으로 뒤집습니다.<br><code>~1010 = 0101</code> (비트 반전)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="26" font-size="14" font-weight="bold" fill="var(--accent)">&lt;&lt;</text></svg>
                        </div>
                        <h3>왼쪽 시프트 (&lt;&lt;)</h3>
                        <p>비트를 왼쪽으로 밀고 0을 채웁니다.<br><code>1 &lt;&lt; 3 = 1000₂ = 8</code> (×2<sup>n</sup>)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="26" font-size="14" font-weight="bold" fill="var(--green)">&gt;&gt;</text></svg>
                        </div>
                        <h3>오른쪽 시프트 (&gt;&gt;)</h3>
                        <p>비트를 오른쪽으로 밀어냅니다.<br><code>8 &gt;&gt; 2 = 10₂ = 2</code> (÷2<sup>n</sup>)</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 비트 연산자 예시
a = 0b1010  # 10
b = 0b1100  # 12

print(bin(a & b))   # '0b1000' → 8  (AND)
print(bin(a | b))   # '0b1110' → 14 (OR)
print(bin(a ^ b))   # '0b0110' → 6  (XOR)
print(bin(~a))      # '-0b1011'     (NOT, 보수)

# 시프트 연산
print(1 << 3)       # 8  (1을 왼쪽으로 3칸 → 2³)
print(16 >> 2)      # 4  (16을 오른쪽으로 2칸 → 16÷4)</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text"><code>5 & 3</code>의 결과는 무엇일까요? 2진수로 풀어보세요!</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        정답은 <strong>1</strong>입니다!
                        5 = <code>101</code>, 3 = <code>011</code>이므로
                        <code>101 & 011 = 001</code> = 1입니다. 둘 다 1인 자리만 1이 됩니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 3: 비트 마스크 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> 비트 마스크
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 비트 마스크는 <em>"체크리스트"</em>와 같습니다!
                    체크리스트에 할 일 5개가 있다면, 각 칸에 체크(1) 또는 미체크(0)를 표시합니다.
                    예를 들어 <code>10110</code>이면 1번, 2번, 4번 항목이 완료된 것입니다.
                    이렇게 <strong>집합을 하나의 정수</strong>로 표현할 수 있습니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">확인</text></svg>
                        </div>
                        <h3>i번째 비트 확인</h3>
                        <p><code>num & (1 &lt;&lt; i)</code>로 i번째 비트가 1인지 확인합니다. 0이 아니면 설정된 것입니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--green)">설정</text></svg>
                        </div>
                        <h3>i번째 비트 설정</h3>
                        <p><code>num | (1 &lt;&lt; i)</code>로 i번째 비트를 1로 켭니다. 이미 1이어도 괜찮습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">토글</text></svg>
                        </div>
                        <h3>i번째 비트 토글</h3>
                        <p><code>num ^ (1 &lt;&lt; i)</code>로 i번째 비트를 반전합니다. 0→1, 1→0이 됩니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--red, #e17055)">제거</text></svg>
                        </div>
                        <h3>i번째 비트 제거</h3>
                        <p><code>num & ~(1 &lt;&lt; i)</code>로 i번째 비트를 0으로 끕니다. 이미 0이어도 괜찮습니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 비트 마스크 기본 연산
S = 0b10110  # 집합 {1, 2, 4}

# i번째 비트 확인 (i=2 확인)
print(bool(S & (1 << 2)))  # True — 2번 비트가 1

# i번째 비트 설정 (i=0 추가)
S = S | (1 << 0)
print(bin(S))  # '0b10111' — {0, 1, 2, 4}

# i번째 비트 토글 (i=1 반전)
S = S ^ (1 << 1)
print(bin(S))  # '0b10101' — {0, 2, 4}

# i번째 비트 제거 (i=2 제거)
S = S & ~(1 << 2)
print(bin(S))  # '0b10001' — {0, 4}

# 전체 집합 (원소 5개: {0,1,2,3,4})
ALL = (1 << 5) - 1  # 0b11111 = 31</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">집합 {0, 3, 4}를 비트 마스크로 표현하면 2진수와 10진수로 각각 얼마일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        2진수: <strong>11001</strong>, 10진수: <strong>25</strong>입니다!
                        0번 비트(1) + 3번 비트(8) + 4번 비트(16) = 25입니다.
                        <code>1 | (1 &lt;&lt; 3) | (1 &lt;&lt; 4) = 25</code>로 만들 수 있습니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 4: XOR의 마법 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> XOR의 마법
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> XOR은 <em>"짝꿍 찾기 게임"</em>과 같습니다!
                    같은 숫자끼리 XOR하면 사라지고(0이 되고), 짝이 없는 숫자만 남습니다.
                    마치 짝꿍끼리 손을 잡고 나가면 혼자 남은 아이를 찾을 수 있는 것과 같습니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">a^a=0</text></svg>
                        </div>
                        <h3>자기 자신과 XOR</h3>
                        <p>같은 수끼리 XOR하면 0이 됩니다. 모든 비트가 같으므로 결과가 모두 0입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--green)">a^0=a</text></svg>
                        </div>
                        <h3>0과 XOR</h3>
                        <p>어떤 수와 0을 XOR하면 원래 수가 그대로 나옵니다. 0은 아무 영향을 주지 않습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">유일!</text></svg>
                        </div>
                        <h3>중복 없는 수 찾기</h3>
                        <p>모든 수가 2번씩 나오고 1개만 1번 나올 때, 전부 XOR하면 그 수만 남습니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--red, #e17055)">swap</text></svg>
                        </div>
                        <h3>XOR로 swap</h3>
                        <p>임시 변수 없이 두 변수를 교환할 수 있습니다. <code>a^=b; b^=a; a^=b;</code></p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># XOR 성질
print(7 ^ 7)    # 0 — 같은 수 XOR = 0
print(7 ^ 0)    # 7 — 0과 XOR = 자기자신

# 중복 없는 수 찾기 (Single Number)
nums = [2, 3, 1, 3, 2]
result = 0
for n in nums:
    result ^= n     # 2^3^1^3^2 = (2^2)^(3^3)^1 = 0^0^1 = 1
print(result)       # 1 — 짝이 없는 수!

# XOR로 swap (임시 변수 없이!)
a, b = 5, 10
a ^= b    # a = 5^10
b ^= a    # b = 10^(5^10) = 5
a ^= b    # a = (5^10)^5 = 10
print(a, b)  # 10, 5

# n & (n-1): 가장 낮은 1 비트 제거
n = 0b10110  # 22
print(bin(n & (n - 1)))  # '0b10100' → 20 (마지막 1이 사라짐!)</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">배열 [4, 1, 2, 1, 2]를 모두 XOR하면 결과는 무엇일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        정답은 <strong>4</strong>입니다!
                        <code>4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4</code>입니다.
                        짝이 있는 1과 2는 사라지고, 혼자인 4만 남습니다.
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
    renderVisualize(container) {
        const self = this;
        self._clearVizState();

        container.innerHTML = `
            <div class="hero" style="padding-bottom:12px;">
                <h2>XOR로 중복 없는 수 찾기 시각화</h2>
                <p class="hero-sub">배열의 모든 원소를 XOR하면 짝이 없는 수만 남는 과정을 단계별로 봅시다.</p>
            </div>

            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">배열:
                    <input type="text" id="bit-viz-input" value="2, 3, 1, 3, 2"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;">
                </label>
                <button class="btn btn-primary" id="bit-viz-start">시작</button>
            </div>

            <div class="graph-svg-container" style="min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">
                <div id="bit-array-display" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>
                <div id="bit-xor-display" style="display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;"></div>
            </div>

            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:150px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">상태</div>
                    <div id="bit-status" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">시작을 눌러주세요</div>
                </div>
            </div>

            ${self._createStepControls()}

            <div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 현재 XOR 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 처리 완료</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(108,92,231,0.3);border:2px solid var(--accent);vertical-align:middle;"></span> 변경된 비트</span>
            </div>
        `;

        const arrayDisplay = container.querySelector('#bit-array-display');
        const xorDisplay = container.querySelector('#bit-xor-display');
        const statusEl = container.querySelector('#bit-status');

        const MAX_BITS = 8;

        function toBinStr(num) {
            let s = (num >>> 0).toString(2);
            while (s.length < MAX_BITS) s = '0' + s;
            return s.slice(-MAX_BITS);
        }

        function renderArrayBoxes(nums) {
            arrayDisplay.innerHTML = '';
            nums.forEach((n, idx) => {
                const box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = idx;
                box.innerHTML = `
                    <div class="str-char-idx">[${idx}]</div>
                    <div class="str-char-val">${n}</div>
                `;
                arrayDisplay.appendChild(box);
            });
        }

        function renderBitRow(label, num, highlightBits) {
            const binStr = toBinStr(num);
            let html = `<div style="display:flex;align-items:center;gap:8px;">`;
            html += `<span style="min-width:100px;text-align:right;font-weight:600;color:var(--text2);font-size:0.9rem;">${label}</span>`;
            html += `<div style="display:flex;gap:3px;">`;
            for (let i = 0; i < binStr.length; i++) {
                const hl = highlightBits && highlightBits.has(i);
                html += `<div class="str-char-box${hl ? ' comparing' : ''}" style="width:32px;height:36px;font-size:1rem;">
                    <div class="str-char-val">${binStr[i]}</div>
                </div>`;
            }
            html += `</div>`;
            html += `<span style="min-width:40px;font-weight:700;color:var(--accent);font-size:1rem;">= ${num}</span>`;
            html += `</div>`;
            return html;
        }

        function setArrayBoxState(idx, cls) {
            const box = arrayDisplay.querySelector(`[data-idx="${idx}"]`);
            if (box) box.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }

        function saveState() {
            return {
                arrayBoxes: Array.from(arrayDisplay.querySelectorAll('.str-char-box')).map(b => b.className),
                xorHTML: xorDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            const boxes = arrayDisplay.querySelectorAll('.str-char-box');
            boxes.forEach((b, i) => { if (s.arrayBoxes[i]) b.className = s.arrayBoxes[i]; });
            xorDisplay.innerHTML = s.xorHTML;
            statusEl.innerHTML = s.status;
        }

        container.querySelector('#bit-viz-start').addEventListener('click', function() {
            self._clearVizState();

            const raw = container.querySelector('#bit-viz-input').value;
            const nums = raw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
            if (nums.length === 0) {
                statusEl.innerHTML = '<span style="color:var(--red,#e17055);">숫자를 입력해주세요!</span>';
                return;
            }

            renderArrayBoxes(nums);
            xorDisplay.innerHTML = '';
            statusEl.innerHTML = '준비 완료';

            const steps = [];
            let runningXor = 0;

            // Initial step: show result = 0
            steps.push({
                description: 'result = 0 으로 시작합니다.',
                _before: null,
                action: function() {
                    this._before = saveState();
                    xorDisplay.innerHTML = renderBitRow('result = 0', 0, null);
                    statusEl.innerHTML = 'result를 0으로 초기화했습니다.';
                },
                undo: function() { restoreState(this._before); }
            });

            // XOR each element
            for (let i = 0; i < nums.length; i++) {
                const idx = i;
                const num = nums[i];
                const prevXor = runningXor;
                const newXor = prevXor ^ num;
                const prevBin = toBinStr(prevXor);
                const numBin = toBinStr(num);
                const newBin = toBinStr(newXor);

                // Find which bits changed
                const changedBits = new Set();
                for (let b = 0; b < MAX_BITS; b++) {
                    if (prevBin[b] !== newBin[b]) changedBits.add(b);
                }

                steps.push({
                    description: `result ^= ${num} → ${prevXor} ^ ${num} = ${newXor} (2진수: ${prevBin} ^ ${numBin} = ${newBin})`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        // Highlight current element in array
                        for (let j = 0; j < nums.length; j++) {
                            if (j < idx) setArrayBoxState(j, 'matched');
                            else if (j === idx) setArrayBoxState(j, 'comparing');
                            else setArrayBoxState(j, '');
                        }
                        // Show XOR computation
                        let html = '';
                        html += renderBitRow('result', prevXor, null);
                        html += `<div style="font-weight:700;color:var(--yellow);font-size:1.1rem;">XOR (^)</div>`;
                        html += renderBitRow('nums[' + idx + '] = ' + num, num, null);
                        html += `<div style="border-top:2px solid var(--border);width:80%;margin:4px 0;"></div>`;
                        html += renderBitRow('result = ' + newXor, newXor, changedBits);
                        xorDisplay.innerHTML = html;
                        statusEl.innerHTML = `result ^= ${num} → <strong>${newXor}</strong> (2진수: ${newBin})`;
                    },
                    undo: function() { restoreState(this._before); }
                });

                runningXor = newXor;
            }

            // Final step
            const finalResult = runningXor;
            steps.push({
                description: `완료! 모든 원소를 XOR한 결과: ${finalResult} — 이것이 짝이 없는 수입니다!`,
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (let j = 0; j < nums.length; j++) setArrayBoxState(j, 'matched');
                    let html = renderBitRow('최종 result', finalResult, null);
                    xorDisplay.innerHTML = html;
                    statusEl.innerHTML = `<span style="color:var(--green);font-size:1.2rem;">✓ 짝이 없는 수는 <strong>${finalResult}</strong>입니다!</span>`;
                },
                undo: function() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        });
    },

    // ===== 시각화 상태 관리 =====
    _vizState: {
        steps: [],
        currentStep: -1,
        keydownHandler: null
    },

    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) {
            document.removeEventListener('keydown', s.keydownHandler);
            s.keydownHandler = null;
        }
        s.steps = [];
        s.currentStep = -1;
    },

    _createStepControls() {
        return `
            <div class="viz-step-controls">
                <button class="btn viz-step-btn" id="viz-prev" disabled>&larr; 이전</button>
                <span id="viz-step-counter" class="viz-step-counter">시작 전</span>
                <button class="btn btn-primary viz-step-btn" id="viz-next">다음 &rarr;</button>
            </div>
            <div id="viz-step-desc" class="viz-step-desc">▶ 위의 버튼을 눌러 시작하세요</div>
        `;
    },

    _initStepController(el, steps) {
        const state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;

        const prevBtn = el.querySelector('#viz-prev');
        const nextBtn = el.querySelector('#viz-next');
        const counter = el.querySelector('#viz-step-counter');
        const desc = el.querySelector('#viz-step-desc');

        const updateUI = () => {
            const idx = state.currentStep;
            const total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) {
                counter.textContent = '시작 전';
                desc.textContent = '▶ 다음 버튼을 눌러 시작하세요';
            } else {
                counter.textContent = `Step ${idx + 1} / ${total}`;
                desc.textContent = state.steps[idx].description;
            }
        };

        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            state.steps[state.currentStep].action();
            updateUI();
        });

        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo();
            state.currentStep--;
            updateUI();
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

    // ===== 문제풀이 탭 =====
    stages: [
        {
            num: 1,
            title: '기본 비트 연산',
            desc: '비트 연산의 기초와 XOR 활용 (Easy)',
            problemIds: ['lc-191', 'lc-136']
        },
        {
            num: 2,
            title: '비트 마스크 응용',
            desc: '비트 마스크로 집합과 부분집합 다루기 (Silver~Medium)',
            problemIds: ['boj-11723', 'lc-78']
        }
    ],

    problems: [
        // ===== 1단계: 기본 비트 연산 =====
        {
            id: 'lc-191',
            title: 'LeetCode 191 - Number of 1 Bits',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/number-of-1-bits/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>양의 정수 <code>n</code>이 주어집니다.
                이 수의 2진수 표현에서 <strong>1인 비트의 개수</strong>(해밍 가중치)를 반환하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>양의 정수 n</p></div>
                    <div><h4>출력</h4>
                    <p>2진수에서 1의 개수</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>n = 11 (2진수: 1011)</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '가장 간단한 방법은?',
                    content: 'Python에서는 <code>bin(n).count("1")</code>로 한 줄에 풀 수 있습니다! 하지만 비트 연산을 배우기 위해 다른 방법도 알아봅시다.'
                },
                {
                    title: 'n & (n-1) 트릭',
                    content: '<code>n & (n-1)</code>을 하면 n의 가장 낮은 1 비트가 제거됩니다!<br>예: <code>1100 & 1011 = 1000</code>. 이것을 n이 0이 될 때까지 반복하면 1의 개수를 셀 수 있습니다.'
                },
                {
                    title: '정답 코드 구조',
                    content: '<code>count = 0</code> → <code>while n: n &= (n-1); count += 1</code> → count 반환. 매번 가장 낮은 1비트를 하나씩 제거합니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '3'; },
            templates: {
                python: `class Solution:
    def hammingWeight(self, n: int) -> int:
        # 방법 1: n & (n-1) 트릭
        count = 0
        while n:
            n &= (n - 1)  # 가장 낮은 1 비트 제거
            count += 1
        return count

    # 방법 2: 간단한 방법
    # def hammingWeight(self, n: int) -> int:
    #     return bin(n).count('1')`,
                cpp: `class Solution {
public:
    int hammingWeight(int n) {
        int count = 0;
        while (n) {
            n &= (n - 1);  // 가장 낮은 1 비트 제거
            count++;
        }
        return count;
    }
};`,
                java: `class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0) {
            n &= (n - 1);  // 가장 낮은 1 비트 제거
            count++;
        }
        return count;
    }
}`
            }
        },
        {
            id: 'lc-136',
            title: 'LeetCode 136 - Single Number',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/single-number/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>비어 있지 않은 정수 배열 <code>nums</code>가 주어집니다.
                모든 원소가 <strong>정확히 2번</strong> 나타나고, <strong>딱 하나만 1번</strong> 나타납니다.
                그 하나의 원소를 찾으세요.</p>
                <p>시간 복잡도 O(n), 공간 복잡도 O(1)로 풀어야 합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>정수 배열 nums (1 &le; len &le; 30,000)</p></div>
                    <div><h4>출력</h4>
                    <p>1번만 나타나는 원소</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>[2, 2, 1]</pre></div>
                    <div><strong>출력</strong><pre>1</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: 'XOR의 성질을 떠올려봅시다!',
                    content: '<code>a ^ a = 0</code> (같은 수 XOR = 0), <code>a ^ 0 = a</code> (0과 XOR = 자기자신). 이 두 가지 성질이 핵심입니다!'
                },
                {
                    title: '전부 XOR하면?',
                    content: '배열의 모든 원소를 XOR하면, 2번 나오는 수끼리는 상쇄되어 0이 되고,<br>1번만 나오는 수만 남습니다! <code>2^2^1 = 0^1 = 1</code>'
                },
                {
                    title: '정답 코드',
                    content: '<code>result = 0; for n in nums: result ^= n; return result</code> — 단 3줄이면 됩니다! O(n) 시간, O(1) 공간.'
                }
            ],
            inputDefault: 0,
            solve() { return '1'; },
            templates: {
                python: `class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        result = 0
        for n in nums:
            result ^= n  # 같은 수끼리 상쇄 → 혼자인 수만 남음
        return result

    # 한 줄 풀이:
    # from functools import reduce
    # def singleNumber(self, nums): return reduce(lambda a,b: a^b, nums)`,
                cpp: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int result = 0;
        for (int n : nums) {
            result ^= n;  // 같은 수끼리 상쇄
        }
        return result;
    }
};`,
                java: `class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int n : nums) {
            result ^= n;  // 같은 수끼리 상쇄
        }
        return result;
    }
}`
            }
        },

        // ===== 2단계: 비트 마스크 응용 =====
        {
            id: 'boj-11723',
            title: 'BOJ 11723 - 집합',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11723',
            descriptionHTML: `
                <h3>문제</h3>
                <p>비어있는 공집합 S가 주어졌을 때, 아래 연산을 수행하세요.</p>
                <ul style="margin:8px 0 8px 20px;">
                    <li><code>add x</code>: S에 x를 추가 (1 &le; x &le; 20)</li>
                    <li><code>remove x</code>: S에서 x를 제거</li>
                    <li><code>check x</code>: S에 x가 있으면 1, 없으면 0 출력</li>
                    <li><code>toggle x</code>: S에 x가 있으면 제거, 없으면 추가</li>
                    <li><code>all</code>: S = {1, 2, ..., 20}</li>
                    <li><code>empty</code>: S = 공집합</li>
                </ul>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>연산의 수 M (1 &le; M &le; 3,000,000)</p></div>
                    <div><h4>출력</h4>
                    <p>check 연산의 결과를 한 줄에 하나씩 출력</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>26
add 1
add 2
check 1
check 2
remove 2
check 1
check 2
toggle 3
check 1
check 2
check 3
check 4
all
check 10
check 20
toggle 10
remove 20
check 10
check 20
empty
check 1
toggle 3
check 3
check 4
all
check 20</pre></div>
                    <div><strong>출력</strong><pre>1
1
1
0
1
0
1
0
1
1
0
0
0
1
0
1</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '비트 마스크로 집합을 표현하자!',
                    content: '정수 하나(S)로 집합을 표현합니다. x가 집합에 있으면 x번째 비트가 1입니다.<br><code>add x</code> → <code>S |= (1 &lt;&lt; x)</code>'
                },
                {
                    title: '각 연산의 비트 마스크 표현',
                    content: '<code>add</code>: <code>S |= (1&lt;&lt;x)</code>, <code>remove</code>: <code>S &= ~(1&lt;&lt;x)</code><br><code>check</code>: <code>(S>>x)&1</code>, <code>toggle</code>: <code>S ^= (1&lt;&lt;x)</code><br><code>all</code>: <code>S = (1&lt;&lt;21)-1</code>, <code>empty</code>: <code>S = 0</code>'
                },
                {
                    title: '시간 초과 주의!',
                    content: 'M이 최대 300만이므로 <strong>sys.stdin.readline</strong>을 사용해야 합니다.<br>출력도 리스트에 모아서 한 번에 출력하면 더 빠릅니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '1'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

M = int(input())
S = 0
out = []

for _ in range(M):
    line = input().split()
    cmd = line[0]

    if cmd == 'add':
        x = int(line[1])
        S |= (1 << x)
    elif cmd == 'remove':
        x = int(line[1])
        S &= ~(1 << x)
    elif cmd == 'check':
        x = int(line[1])
        out.append('1' if (S >> x) & 1 else '0')
    elif cmd == 'toggle':
        x = int(line[1])
        S ^= (1 << x)
    elif cmd == 'all':
        S = (1 << 21) - 1
    elif cmd == 'empty':
        S = 0

print('\\n'.join(out))`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int M;
    cin >> M;
    int S = 0;

    while (M--) {
        string cmd;
        cin >> cmd;

        if (cmd == "add") {
            int x; cin >> x;
            S |= (1 << x);
        } else if (cmd == "remove") {
            int x; cin >> x;
            S &= ~(1 << x);
        } else if (cmd == "check") {
            int x; cin >> x;
            cout << ((S >> x) & 1) << '\\n';
        } else if (cmd == "toggle") {
            int x; cin >> x;
            S ^= (1 << x);
        } else if (cmd == "all") {
            S = (1 << 21) - 1;
        } else { // empty
            S = 0;
        }
    }
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        int M = Integer.parseInt(br.readLine().trim());
        int S = 0;

        while (M-- > 0) {
            String[] line = br.readLine().split(" ");
            String cmd = line[0];

            if (cmd.equals("add")) {
                int x = Integer.parseInt(line[1]);
                S |= (1 << x);
            } else if (cmd.equals("remove")) {
                int x = Integer.parseInt(line[1]);
                S &= ~(1 << x);
            } else if (cmd.equals("check")) {
                int x = Integer.parseInt(line[1]);
                sb.append((S >> x) & 1).append('\\n');
            } else if (cmd.equals("toggle")) {
                int x = Integer.parseInt(line[1]);
                S ^= (1 << x);
            } else if (cmd.equals("all")) {
                S = (1 << 21) - 1;
            } else { // empty
                S = 0;
            }
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'lc-78',
            title: 'LeetCode 78 - Subsets',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/subsets/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>중복이 없는 정수 배열 <code>nums</code>가 주어집니다.
                모든 가능한 <strong>부분집합(power set)</strong>을 반환하세요.</p>
                <p>결과에 중복된 부분집합이 없어야 합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>정수 배열 nums (1 &le; len &le; 10)</p></div>
                    <div><h4>출력</h4>
                    <p>모든 부분집합의 리스트</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>[1, 2, 3]</pre></div>
                    <div><strong>출력</strong><pre>[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '부분집합의 개수는?',
                    content: '원소가 n개이면 부분집합은 <strong>2<sup>n</sup></strong>개입니다! 각 원소를 "포함(1)" 또는 "미포함(0)"으로 결정하면 됩니다. 이것은 비트 마스크와 완벽하게 대응됩니다.'
                },
                {
                    title: '비트 마스크로 부분집합 생성',
                    content: '0부터 2<sup>n</sup>-1까지의 모든 정수를 순회합니다.<br>각 정수의 j번째 비트가 1이면 nums[j]를 포함합니다.<br>예: 마스크 <code>101</code> → nums[0]과 nums[2]를 선택!'
                },
                {
                    title: '정답 코드 구조',
                    content: '<code>for mask in range(1 &lt;&lt; n):</code> → 내부에서 <code>for j in range(n): if mask & (1 &lt;&lt; j):</code>로 선택된 원소를 모읍니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]'; },
            templates: {
                python: `class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        n = len(nums)
        result = []

        for mask in range(1 << n):  # 0 ~ 2^n - 1
            subset = []
            for j in range(n):
                if mask & (1 << j):  # j번째 비트가 1이면 선택
                    subset.append(nums[j])
            result.append(subset)

        return result

    # 백트래킹 풀이 (비교용):
    # def subsets(self, nums):
    #     res = []
    #     def bt(start, curr):
    #         res.append(curr[:])
    #         for i in range(start, len(nums)):
    #             curr.append(nums[i])
    #             bt(i + 1, curr)
    #             curr.pop()
    #     bt(0, [])
    #     return res`,
                cpp: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        int n = nums.size();
        vector<vector<int>> result;

        for (int mask = 0; mask < (1 << n); mask++) {
            vector<int> subset;
            for (int j = 0; j < n; j++) {
                if (mask & (1 << j)) {
                    subset.push_back(nums[j]);
                }
            }
            result.push_back(subset);
        }

        return result;
    }
};`,
                java: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        int n = nums.length;
        List<List<Integer>> result = new ArrayList<>();

        for (int mask = 0; mask < (1 << n); mask++) {
            List<Integer> subset = new ArrayList<>();
            for (int j = 0; j < n; j++) {
                if ((mask & (1 << j)) != 0) {
                    subset.add(nums[j]);
                }
            }
            result.add(subset);
        }

        return result;
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
                const btn = document.createElement('button');
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `
                    <span class="problem-title">${prob.title}</span>
                    <span class="problem-diff">${diffMap[prob.difficulty] || prob.difficulty}</span>
                `;
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob));
                problemsDiv.appendChild(btn);
            });

            stageList.appendChild(stageCard);
        });

        container.appendChild(stageList);
    },

    // ===== 문제 상세 렌더링 =====
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
        descDiv.innerHTML = `
            <div class="problem-meta">
                <a href="${problem.link}" target="_blank" class="btn btn-primary">${isLeetCode ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}</a>
            </div>
            ${problem.descriptionHTML}
        `;
        container.appendChild(descDiv);

        // 힌트 섹션
        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>단계별 힌트</h3>';

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hints-steps';
        const openedState = {};

        problem.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `
                <div class="hint-step-header">
                    <span class="hint-step-num">${idx + 1}</span>
                    <span class="hint-step-title">${hint.title}</span>
                    <span class="hint-step-toggle">▶</span>
                </div>
                <div class="hint-step-content">${hint.content}</div>
            `;

            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent =
                    step.classList.contains('open') ? '▼' : '▶';

                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < problem.hints.length) {
                        const nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
            });
            hintsDiv.appendChild(step);
        });

        hintsSection.appendChild(hintsDiv);
        container.appendChild(hintsSection);

        // 코드 에디터
        const solveArea = document.createElement('div');
        solveArea.className = 'solve-area';
        solveArea.innerHTML = `
            <div class="editor-header">
                <h3>풀이 작성</h3>
                <select id="lang-select">
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                </select>
            </div>
            <textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea>
            <div class="editor-actions">
                <button id="run-btn" class="btn btn-primary">▶ 실행</button>
                <button id="check-btn" class="btn btn-success">✓ 정답 확인</button>
            </div>
            <div id="output-area" class="output-area">
                <div class="output-label">실행 결과</div>
                <pre id="output-text"></pre>
            </div>
        `;
        container.appendChild(solveArea);

        container.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;

        langSelect.addEventListener('change', () => {
            editor.value = problem.templates[langSelect.value];
        });

        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = editor.selectionStart;
                editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = s + 4;
            }
        });

        container.querySelector('#run-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });

        container.querySelector('#check-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            const site = isLeetCode ? 'LeetCode' : 'BOJ';
            this._showOutput(container, `예상 정답:\n${expected}\n\n💡 코드를 ${site}에 제출하여 정답을 확인하세요!`);
        });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.bitmanipulation = bitManipulationTopic;
