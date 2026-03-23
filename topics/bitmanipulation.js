// =========================================================
// 비트 조작 (Bit Manipulation) 토픽 모듈
// =========================================================
var bitManipulationTopic = {
    id: 'bitmanipulation',
    title: '비트 조작',
    icon: '💻',
    category: '심화 (Gold~Platinum)',
    order: 20,
    description: '비트 연산과 비트 마스크를 활용한 효율적인 문제 해결 기법',
    relatedNote: '비트 연산은 비트마스크 DP, 부분집합 열거, XOR 트릭 등 다양한 최적화 기법의 기반이 됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'lc-191':    { type: '비트 세기',     color: 'var(--accent)', vizMethod: '_renderVizHammingWeight' },
        'lc-136':    { type: 'XOR 트릭',      color: 'var(--green)',  vizMethod: '_renderVizSingleNumber' },
        'boj-11723': { type: '비트 마스크',    color: '#e17055',       vizMethod: '_renderVizBitmaskSet' },
        'lc-78':     { type: '부분집합 열거',  color: '#6c5ce7',       vizMethod: '_renderVizSubsets' }
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
            sim:     { intro: prob.simIntro || '비트 연산이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';        container.appendChild(contentDiv);
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
                '<span class="hint-step-toggle">▶</span></div>' +
                '<div class="hint-step-content">' + hint.content + '</div>';
            step.querySelector('.hint-step-header').addEventListener('click', function() {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('open') ? '▼' : '▶';
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
        if (window.renderSolutionsCodeTab) {
            window.renderSolutionsCodeTab(contentEl, prob);
        } else {
            contentEl.innerHTML = '<p>코드 탭 로딩 중...</p>';
        }
    },

    // ===== 개념 설명 렌더링 =====
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
                    <span class="lang-py"><div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--accent)">bin()</text></svg>
                        </div>
                        <h3>bin() 함수</h3>
                        <p>Python에서 <code>bin(10)</code>은 <code>'0b1010'</code>을 반환합니다. 2진수를 쉽게 확인할 수 있습니다!<br>
                        <a href="https://docs.python.org/3/library/functions.html#bin" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: bin() ↗</a></p>
                    </div></span>
                    <span class="lang-cpp"><div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--accent)">bitset</text></svg>
                        </div>
                        <h3>bitset 클래스</h3>
                        <p>C++에서 <code>bitset&lt;8&gt;(10)</code>은 <code>00001010</code>을 출력합니다. 2진수를 쉽게 확인할 수 있습니다!<br>
                        <a href="https://en.cppreference.com/w/cpp/utility/bitset" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: bitset ↗</a></p>
                    </div></span>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 2진수 표현
print(bin(10))      # '0b1010' — 10을 2진수로
print(bin(255))     # '0b11111111' — 8비트 최대값
print(0b1010)       # 10 — 2진수를 10진수로

# 2진수 문자열로 변환
print(format(10, '08b'))  # '00001010' — 8자리로 맞추기
print(f"{10:08b}")        # '00001010' — f-string 방법</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;bitset&gt;
using namespace std;

int main() {
    // 2진수 표현
    cout &lt;&lt; bitset&lt;8&gt;(10) &lt;&lt; endl;   // 00001010 — 10을 2진수로
    cout &lt;&lt; bitset&lt;8&gt;(255) &lt;&lt; endl;  // 11111111 — 8비트 최대값
    cout &lt;&lt; 0b1010 &lt;&lt; endl;           // 10 — 2진수를 10진수로

    // 특정 자릿수로 맞추기
    cout &lt;&lt; bitset&lt;8&gt;(10) &lt;&lt; endl;   // 00001010 — 자동 8자리
    cout &lt;&lt; bitset&lt;4&gt;(10) &lt;&lt; endl;   // 1010 — 4자리
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — 10진수 ↔ 2진수 변환기</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">숫자를 입력하면 즉시 2진수로, 2진수를 입력하면 10진수로 변환합니다!</p>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                            <div style="display:flex;flex-direction:column;gap:4px;">
                                <label style="font-size:0.75rem;color:var(--text2);">10진수</label>
                                <input type="number" id="bit-s1-dec" value="10" min="0" max="255" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;background:var(--card);color:var(--text);">
                            </div>
                            <span style="font-size:1.2rem;color:var(--accent);font-weight:700;">⇄</span>
                            <div style="display:flex;flex-direction:column;gap:4px;">
                                <label style="font-size:0.75rem;color:var(--text2);">2진수 (8비트)</label>
                                <div id="bit-s1-bits" style="display:flex;gap:2px;"></div>
                            </div>
                        </div>
                        <div id="bit-s1-calc" style="margin-top:8px;font-size:0.85rem;color:var(--text2);"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-s1-msg">10진수를 바꾸거나 비트를 클릭해서 변환 과정을 확인하세요!</div>
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
                        <p>0은 1로, 1은 0으로 뒤집습니다.<br><code>~1010 = 0101</code> (비트 반전)<br>
                        <a href="https://en.wikipedia.org/wiki/Two%27s_complement" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: 2의 보수 (Two's complement) ↗</a></p>
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
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;bitset&gt;
using namespace std;

int main() {
    int a = 0b1010;  // 10
    int b = 0b1100;  // 12

    cout &lt;&lt; bitset&lt;4&gt;(a & b) &lt;&lt; endl;  // 1000 → 8  (AND)
    cout &lt;&lt; bitset&lt;4&gt;(a | b) &lt;&lt; endl;  // 1110 → 14 (OR)
    cout &lt;&lt; bitset&lt;4&gt;(a ^ b) &lt;&lt; endl;  // 0110 → 6  (XOR)
    cout &lt;&lt; bitset&lt;4&gt;(~a) &lt;&lt; endl;     // 0101     (NOT, 반전)

    // 시프트 연산
    cout &lt;&lt; (1 &lt;&lt; 3) &lt;&lt; endl;   // 8  (1을 왼쪽으로 3칸 → 2³)
    cout &lt;&lt; (16 >> 2) &lt;&lt; endl;  // 4  (16을 오른쪽으로 2칸 → 16÷4)
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — 비트 연산 퀴즈</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">두 수의 비트 연산 결과를 맞춰보세요!</p>
                    <div class="concept-demo-body">
                        <div id="bit-s2-quiz" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;"></div>
                        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;" id="bit-s2-choices"></div>
                        <div id="bit-s2-feedback" style="margin-top:8px;text-align:center;font-size:0.9rem;min-height:1.5em;"></div>
                    </div>
                    <div style="margin-top:8px;text-align:center;"><button class="concept-demo-btn" id="bit-s2-new">🎲 새 문제</button></div>
                    <div class="concept-demo-msg" id="bit-s2-msg">정답을 고르면 비트 단위로 왜 그 결과가 나오는지 설명합니다!</div>
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
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;bitset&gt;
using namespace std;

int main() {
    int S = 0b10110;  // 집합 {1, 2, 4}

    // i번째 비트 확인 (i=2 확인)
    cout &lt;&lt; ((S & (1 &lt;&lt; 2)) != 0) &lt;&lt; endl;  // 1 — 2번 비트가 1

    // i번째 비트 설정 (i=0 추가)
    S = S | (1 &lt;&lt; 0);
    cout &lt;&lt; bitset&lt;5&gt;(S) &lt;&lt; endl;  // 10111 — {0, 1, 2, 4}

    // i번째 비트 토글 (i=1 반전)
    S = S ^ (1 &lt;&lt; 1);
    cout &lt;&lt; bitset&lt;5&gt;(S) &lt;&lt; endl;  // 10101 — {0, 2, 4}

    // i번째 비트 제거 (i=2 제거)
    S = S & ~(1 &lt;&lt; 2);
    cout &lt;&lt; bitset&lt;5&gt;(S) &lt;&lt; endl;  // 10001 — {0, 4}

    // 전체 집합 (원소 5개: {0,1,2,3,4})
    int ALL = (1 &lt;&lt; 5) - 1;  // 0b11111 = 31
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — 비트 마스크 연산 실습</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">집합에 원소를 추가/제거/토글하고, 비트 마스크가 어떻게 변하는지 확인하세요!</p>
                    <div class="concept-demo-body">
                        <div style="margin-bottom:8px;font-size:0.85rem;">현재 집합: <strong id="bit-s3-set">{}</strong> = <code id="bit-s3-bin">00000</code> = <strong id="bit-s3-dec">0</strong></div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;" id="bit-s3-elems"></div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;">
                            <select id="bit-s3-op" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.85rem;background:var(--card);color:var(--text);">
                                <option value="add">추가 (OR)</option>
                                <option value="remove">제거 (AND ~)</option>
                                <option value="toggle">토글 (XOR)</option>
                                <option value="check">확인 (AND)</option>
                            </select>
                            <select id="bit-s3-idx" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.85rem;background:var(--card);color:var(--text);">
                                <option>0</option><option>1</option><option>2</option><option>3</option><option>4</option>
                            </select>
                            <button class="concept-demo-btn" id="bit-s3-go">실행</button>
                            <button class="concept-demo-btn green" id="bit-s3-reset">↺</button>
                        </div>
                        <div id="bit-s3-log" style="margin-top:8px;font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-s3-msg">연산을 선택하고 원소 번호를 골라 "실행"을 누르세요!</div>
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
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;bitset&gt;
using namespace std;

int main() {
    // XOR 성질
    cout &lt;&lt; (7 ^ 7) &lt;&lt; endl;    // 0 — 같은 수 XOR = 0
    cout &lt;&lt; (7 ^ 0) &lt;&lt; endl;    // 7 — 0과 XOR = 자기자신

    // 중복 없는 수 찾기 (Single Number)
    int nums[] = {2, 3, 1, 3, 2};
    int result = 0;
    for (int n : nums)
        result ^= n;     // 2^3^1^3^2 = (2^2)^(3^3)^1 = 0^0^1 = 1
    cout &lt;&lt; result &lt;&lt; endl;  // 1 — 짝이 없는 수!

    // XOR로 swap (임시 변수 없이!)
    int a = 5, b = 10;
    a ^= b;    // a = 5^10
    b ^= a;    // b = 10^(5^10) = 5
    a ^= b;    // a = (5^10)^5 = 10
    cout &lt;&lt; a &lt;&lt; " " &lt;&lt; b &lt;&lt; endl;  // 10, 5

    // n & (n-1): 가장 낮은 1 비트 제거
    int n = 0b10110;  // 22
    cout &lt;&lt; bitset&lt;5&gt;(n & (n - 1)) &lt;&lt; endl;  // 10100 → 20 (마지막 1이 사라짐!)
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — XOR 성질 체험</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">두 수를 XOR하면 어떤 결과가 나오는지, 같은 수를 두 번 XOR하면 어떻게 되는지 확인하세요!</p>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;">
                            <input type="number" id="bit-s4-a" value="7" min="0" max="255" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:60px;background:var(--card);color:var(--text);">
                            <span style="font-weight:700;color:var(--yellow);">^</span>
                            <input type="number" id="bit-s4-b" value="7" min="0" max="255" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:60px;background:var(--card);color:var(--text);">
                            <span style="font-weight:700;">=</span>
                            <span id="bit-s4-result" style="font-weight:700;font-size:1.1rem;color:var(--accent);"></span>
                            <button class="concept-demo-btn" id="bit-s4-calc">계산</button>
                        </div>
                        <div id="bit-s4-detail" style="font-size:0.85rem;color:var(--text2);font-family:monospace;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-s4-msg">같은 수(7^7)를 넣어보세요 → 0! 그리고 다른 수도 넣어보세요!</div>
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

            <!-- 섹션 5: 데모 — 2진수 변환 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">5</span> 데모: 10진수 → 2진수 변환
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 2로 나누기 애니메이션</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="number" id="bit-demo-conv-input" value="42" min="0" max="255" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:80px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="bit-demo-conv-btn">⚙️ 변환 시작</button>
                        <button class="concept-demo-btn green" id="bit-demo-conv-reset" style="display:none;">↺ 다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="bit-demo-conv-steps" style="font-family:monospace;font-size:0.9rem;color:var(--text);line-height:2;"></div>
                        <div id="bit-demo-conv-result" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-demo-conv-msg">👆 숫자를 입력하고 "변환 시작"을 눌러보세요! 2로 나누기를 반복하며 나머지를 모아 2진수를 만드는 과정을 확인하세요.</div>
                </div>
            </div>

            <!-- 섹션 6: 데모 — 비트 연산 시각화 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">6</span> 데모: 비트 연산 시각화
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — AND, OR, XOR, NOT, 시프트</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="number" id="bit-demo-op-a" value="10" min="0" max="255" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:70px;background:var(--card);color:var(--text);">
                        <select id="bit-demo-op-sel" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--card);color:var(--text);">
                            <option value="and">AND (&)</option>
                            <option value="or">OR (|)</option>
                            <option value="xor">XOR (^)</option>
                            <option value="not">NOT (~)</option>
                            <option value="shl">왼쪽 시프트 (<<)</option>
                            <option value="shr">오른쪽 시프트 (>>)</option>
                        </select>
                        <input type="number" id="bit-demo-op-b" value="12" min="0" max="255" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:70px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="bit-demo-op-btn">⚡ 계산</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="bit-demo-op-viz" style="font-family:monospace;font-size:0.95rem;line-height:2;color:var(--text);"></div>
                        <div id="bit-demo-op-result" style="margin-top:8px;font-size:0.9rem;color:var(--text2);"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-demo-op-msg">👆 두 숫자와 연산을 선택하고 "계산"을 눌러보세요! 비트 단위로 어떻게 동작하는지 확인하세요.</div>
                </div>
            </div>

            <!-- 섹션 7: 데모 — 비트 마스크 집합 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">7</span> 데모: 비트 마스크 = 집합
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 비트를 토글하여 원소 추가/제거</div>
                    <div style="margin-bottom:12px;">
                        <div id="bit-demo-mask-bits" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;"></div>
                        <div id="bit-demo-mask-info" style="font-size:0.9rem;color:var(--text2);margin-bottom:8px;font-family:monospace;"></div>
                        <div id="bit-demo-mask-set" style="font-size:0.9rem;color:var(--text);padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-demo-mask-msg">👆 비트를 클릭해서 켜고 끄세요! 켜진 비트의 위치가 집합의 원소입니다.</div>
                </div>
            </div>

            <!-- 섹션 8: 데모 — XOR 짝 없는 수 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">8</span> 데모: XOR로 짝 없는 수 찾기
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 모든 수를 XOR하면 짝 없는 수만 남는다</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="text" id="bit-demo-xor-input" value="4,1,2,1,2" placeholder="쉼표 구분 숫자" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:180px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="bit-demo-xor-btn">Step ▶</button>
                        <button class="concept-demo-btn green" id="bit-demo-xor-reset">Reset ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="bit-demo-xor-arr" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>
                        <div id="bit-demo-xor-steps" style="font-family:monospace;font-size:0.9rem;color:var(--text);line-height:2;"></div>
                        <div id="bit-demo-xor-result" style="margin-top:8px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-demo-xor-msg">숫자를 바꿔보고 "Step"을 눌러 한 단계씩 진행해보세요! 짝이 있는 수는 사라지고 혼자인 수만 남습니다.</div>
                </div>
            </div>
        `;
        this._initConceptInteractions(container);
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // ====== 섹션 1 데모: 10진수 ↔ 2진수 변환기 ======
        (function() {
            var decInput = container.querySelector('#bit-s1-dec');
            var bitsEl = container.querySelector('#bit-s1-bits');
            var calcEl = container.querySelector('#bit-s1-calc');
            if (!decInput) return;
            function pad8(n) { var s = n.toString(2); while (s.length < 8) s = '0' + s; return s; }
            function render(val) {
                var bin = pad8(val);
                bitsEl.innerHTML = '';
                for (var i = 0; i < 8; i++) {
                    var b = document.createElement('span');
                    b.textContent = bin[i];
                    b.setAttribute('data-i', i);
                    b.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;cursor:pointer;font-weight:700;font-size:0.95rem;' +
                        (bin[i]==='1' ? 'background:var(--accent);color:#fff;' : 'background:var(--bg2);color:var(--text2);');
                    b.addEventListener('click', function() {
                        var idx = parseInt(this.getAttribute('data-i'));
                        var cur = pad8(parseInt(decInput.value) || 0);
                        var arr = cur.split('');
                        arr[idx] = arr[idx] === '1' ? '0' : '1';
                        var nv = parseInt(arr.join(''), 2);
                        decInput.value = nv;
                        render(nv);
                    });
                    bitsEl.appendChild(b);
                }
                var parts = [];
                for (var j = 0; j < 8; j++) {
                    if (bin[j] === '1') parts.push('2^' + (7-j) + '(' + Math.pow(2,7-j) + ')');
                }
                calcEl.textContent = parts.length ? parts.join(' + ') + ' = ' + val : '0';
            }
            render(parseInt(decInput.value) || 0);
            decInput.addEventListener('input', function() { render(Math.min(255, Math.max(0, parseInt(this.value) || 0))); });
        })();

        // ====== 섹션 2 데모: 비트 연산 퀴즈 ======
        (function() {
            var quizEl = container.querySelector('#bit-s2-quiz');
            var choicesEl = container.querySelector('#bit-s2-choices');
            var feedbackEl = container.querySelector('#bit-s2-feedback');
            var newBtn = container.querySelector('#bit-s2-new');
            if (!quizEl) return;
            var ops = ['&', '|', '^'];
            var opNames = {'&':'AND','|':'OR','^':'XOR'};
            function genQuiz() {
                var a = Math.floor(Math.random()*14)+1;
                var b = Math.floor(Math.random()*14)+1;
                var op = ops[Math.floor(Math.random()*3)];
                var ans;
                if (op==='&') ans=a&b; else if (op==='|') ans=a|b; else ans=a^b;
                quizEl.textContent = a + ' ' + op + ' ' + b + ' = ?';
                var wrong = new Set([ans]);
                while (wrong.size < 4) wrong.add(Math.floor(Math.random()*16));
                var choices = Array.from(wrong);
                choices.sort(function() { return Math.random()-0.5; });
                choicesEl.innerHTML = '';
                feedbackEl.textContent = '';
                choices.forEach(function(c) {
                    var btn = document.createElement('button');
                    btn.className = 'concept-demo-btn';
                    btn.textContent = c;
                    btn.style.minWidth = '44px';
                    btn.addEventListener('click', function() {
                        if (c === ans) {
                            function pad4(n) { var s = n.toString(2); while (s.length<4) s='0'+s; return s; }
                            feedbackEl.innerHTML = '<span style="color:var(--green);font-weight:700;">정답!</span> ' + pad4(a) + ' ' + opNames[op] + ' ' + pad4(b) + ' = ' + pad4(ans) + ' (' + ans + ')';
                        } else {
                            feedbackEl.innerHTML = '<span style="color:var(--red);">오답!</span> 정답은 <strong>' + ans + '</strong>입니다.';
                        }
                    });
                    choicesEl.appendChild(btn);
                });
            }
            genQuiz();
            newBtn.addEventListener('click', genQuiz);
        })();

        // ====== 섹션 3 데모: 비트 마스크 연산 실습 ======
        (function() {
            var setEl = container.querySelector('#bit-s3-set');
            var binEl = container.querySelector('#bit-s3-bin');
            var decEl = container.querySelector('#bit-s3-dec');
            var logEl = container.querySelector('#bit-s3-log');
            if (!setEl) return;
            var S = 0;
            function render() {
                var elems = [];
                for (var i = 0; i < 5; i++) if (S & (1 << i)) elems.push(i);
                setEl.textContent = '{' + elems.join(', ') + '}';
                var b = S.toString(2); while (b.length < 5) b = '0' + b;
                binEl.textContent = b;
                decEl.textContent = S;
            }
            render();
            container.querySelector('#bit-s3-go').addEventListener('click', function() {
                var op = container.querySelector('#bit-s3-op').value;
                var idx = parseInt(container.querySelector('#bit-s3-idx').value);
                if (op === 'add') { S = S | (1 << idx); logEl.innerHTML = 'S | (1<<' + idx + ') → 원소 ' + idx + ' 추가!'; }
                else if (op === 'remove') { S = S & ~(1 << idx); logEl.innerHTML = 'S & ~(1<<' + idx + ') → 원소 ' + idx + ' 제거!'; }
                else if (op === 'toggle') { S = S ^ (1 << idx); logEl.innerHTML = 'S ^ (1<<' + idx + ') → 원소 ' + idx + ' 토글!'; }
                else { logEl.innerHTML = 'S & (1<<' + idx + ') = ' + (S & (1<<idx)) + ' → 원소 ' + idx + (S & (1<<idx) ? ' 있음!' : ' 없음!'); return; }
                render();
            });
            container.querySelector('#bit-s3-reset').addEventListener('click', function() { S = 0; render(); logEl.textContent = ''; });
        })();

        // ====== 섹션 4 데모: XOR 성질 체험 ======
        (function() {
            var aInput = container.querySelector('#bit-s4-a');
            var bInput = container.querySelector('#bit-s4-b');
            var resultEl = container.querySelector('#bit-s4-result');
            var detailEl = container.querySelector('#bit-s4-detail');
            var calcBtn = container.querySelector('#bit-s4-calc');
            if (!calcBtn) return;
            function doCalc() {
                var a = parseInt(aInput.value) || 0;
                var b = parseInt(bInput.value) || 0;
                var r = a ^ b;
                resultEl.textContent = r;
                function pad8(n) { var s = n.toString(2); while (s.length < 8) s = '0' + s; return s; }
                detailEl.innerHTML = '  ' + pad8(a) + '  (' + a + ')<br>^ ' + pad8(b) + '  (' + b + ')<br>= ' + pad8(r) + '  (' + r + ')' +
                    (a === b ? '<br><span style="color:var(--green);">같은 수끼리 XOR → 0!</span>' : '');
            }
            doCalc();
            calcBtn.addEventListener('click', doCalc);
        })();

        // ====== 데모 1: 2진수 변환 ======
        (function() {
            var convBtn = container.querySelector('#bit-demo-conv-btn');
            var resetBtn = container.querySelector('#bit-demo-conv-reset');
            var inputEl = container.querySelector('#bit-demo-conv-input');
            var stepsEl = container.querySelector('#bit-demo-conv-steps');
            var resultEl = container.querySelector('#bit-demo-conv-result');
            var animating = false;

            convBtn.addEventListener('click', function() {
                if (animating) return;
                animating = true;
                convBtn.style.display = 'none';
                resetBtn.style.display = '';
                var num = parseInt(inputEl.value) || 0;
                if (num < 0) num = 0;
                if (num > 255) num = 255;
                stepsEl.innerHTML = '';
                resultEl.textContent = '';

                if (num === 0) {
                    stepsEl.innerHTML = '<div>0은 2진수로도 <strong>0</strong>입니다!</div>';
                    resultEl.innerHTML = '<strong>결과:</strong> 0 → <strong style="color:var(--green);">0</strong>';
                    animating = false;
                    return;
                }

                var steps = [];
                var n = num;
                while (n > 0) {
                    var remainder = n % 2;
                    var quotient = Math.floor(n / 2);
                    steps.push({ n: n, q: quotient, r: remainder });
                    n = quotient;
                }

                var idx = 0;
                function showStep() {
                    if (idx >= steps.length) {
                        var binary = steps.map(function(s) { return s.r; }).reverse().join('');
                        resultEl.innerHTML = '<strong>결과:</strong> ' + num + ' → <strong style="color:var(--green);">' + binary + '</strong> (나머지를 아래에서 위로 읽습니다!)';
                        animating = false;
                        return;
                    }
                    var s = steps[idx];
                    var line = document.createElement('div');
                    line.style.animation = 'fadeIn 0.3s ease';
                    line.innerHTML = s.n + ' ÷ 2 = ' + s.q + ' ... <strong style="color:var(--accent);">나머지 ' + s.r + '</strong>';
                    stepsEl.appendChild(line);
                    idx++;
                    setTimeout(showStep, 400);
                }
                showStep();
            });

            resetBtn.addEventListener('click', function() {
                animating = false;
                convBtn.style.display = '';
                resetBtn.style.display = 'none';
                stepsEl.innerHTML = '';
                resultEl.textContent = '';
            });
        })();

        // ====== 데모 2: 비트 연산 시각화 ======
        (function() {
            var opBtn = container.querySelector('#bit-demo-op-btn');
            var aInput = container.querySelector('#bit-demo-op-a');
            var bInput = container.querySelector('#bit-demo-op-b');
            var selEl = container.querySelector('#bit-demo-op-sel');
            var vizEl = container.querySelector('#bit-demo-op-viz');
            var resultEl = container.querySelector('#bit-demo-op-result');

            function toBin(n, bits) {
                var s = (n >>> 0).toString(2);
                while (s.length < bits) s = '0' + s;
                return s.slice(-bits);
            }

            function colorBits(binStr, highlights) {
                return binStr.split('').map(function(b, i) {
                    var color = highlights && highlights[i] ? highlights[i] : 'var(--text)';
                    return '<span style="color:' + color + ';font-weight:700;">' + b + '</span>';
                }).join('');
            }

            opBtn.addEventListener('click', function() {
                var a = parseInt(aInput.value) || 0;
                var b = parseInt(bInput.value) || 0;
                var op = selEl.value;
                var bits = 8;
                var result, opSymbol, bitsA = toBin(a, bits), bitsB = toBin(b, bits);
                var lines = [];
                var showB = true;

                switch (op) {
                    case 'and': result = a & b; opSymbol = '&'; break;
                    case 'or': result = a | b; opSymbol = '|'; break;
                    case 'xor': result = a ^ b; opSymbol = '^'; break;
                    case 'not': result = (~a) & 0xFF; opSymbol = '~'; showB = false; break;
                    case 'shl': result = (a << b) & 0xFF; opSymbol = '<<'; break;
                    case 'shr': result = a >> b; opSymbol = '>>'; break;
                }

                var bitsR = toBin(result, bits);

                // Color bits based on result
                var hA = {}, hB = {}, hR = {};
                for (var i = 0; i < bits; i++) {
                    if (op === 'and') {
                        if (bitsA[i] === '1' && bitsB[i] === '1') { hR[i] = 'var(--green)'; }
                    } else if (op === 'or') {
                        if (bitsA[i] === '1' || bitsB[i] === '1') { hR[i] = 'var(--green)'; }
                    } else if (op === 'xor') {
                        if (bitsA[i] !== bitsB[i]) { hR[i] = 'var(--yellow)'; }
                    } else if (op === 'not') {
                        hR[i] = bitsR[i] === '1' ? 'var(--green)' : 'var(--red)';
                    }
                }

                lines.push('&nbsp;&nbsp;' + colorBits(bitsA, hA) + '  ← ' + a);
                if (showB && (op !== 'shl' && op !== 'shr')) {
                    lines.push(opSymbol + ' ' + colorBits(bitsB, hB) + '  ← ' + b);
                } else if (op === 'shl' || op === 'shr') {
                    lines.push(opSymbol + ' ' + b + '칸');
                } else {
                    lines.push(opSymbol);
                }
                lines.push('─'.repeat(bits + 2));
                lines.push('= ' + colorBits(bitsR, hR) + '  ← <strong>' + result + '</strong>');

                vizEl.innerHTML = lines.map(function(l) { return '<div>' + l + '</div>'; }).join('');

                var explanations = {
                    and: '둘 다 1인 자리만 1이 됩니다.',
                    or: '하나라도 1이면 1이 됩니다.',
                    xor: '서로 다른 자리만 1이 됩니다.',
                    not: '0과 1이 뒤집힙니다. (8비트 기준)',
                    shl: '비트를 왼쪽으로 ' + b + '칸 밀어 ×2' + (b > 1 ? '^' + b : '') + ' 효과.',
                    shr: '비트를 오른쪽으로 ' + b + '칸 밀어 ÷2' + (b > 1 ? '^' + b : '') + ' 효과.'
                };
                resultEl.textContent = explanations[op];
            });
        })();

        // ====== 데모 3: 비트 마스크 집합 ======
        (function() {
            var BITS = 6;
            var mask = 0;
            var bitsEl = container.querySelector('#bit-demo-mask-bits');
            var infoEl = container.querySelector('#bit-demo-mask-info');
            var setEl = container.querySelector('#bit-demo-mask-set');

            function render() {
                bitsEl.innerHTML = '';
                for (var i = BITS - 1; i >= 0; i--) {
                    var isOn = (mask >> i) & 1;
                    var bit = document.createElement('div');
                    bit.style.cssText = 'width:44px;height:44px;border-radius:8px;border:2px solid ' + (isOn ? 'var(--green)' : 'var(--border)') +
                        ';display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s ease;' +
                        'background:' + (isOn ? 'rgba(0,184,148,0.15)' : 'var(--card)') + ';user-select:none;';
                    if (isOn) bit.style.boxShadow = '0 0 6px var(--green)';
                    bit.innerHTML = '<div style="font-size:0.6rem;color:var(--text3);">' + i + '</div><div style="font-size:1.1rem;font-weight:700;color:' + (isOn ? 'var(--green)' : 'var(--text3)') + ';">' + isOn + '</div>';
                    bit.dataset.idx = i;
                    bit.addEventListener('click', function() {
                        var idx = parseInt(this.dataset.idx);
                        mask ^= (1 << idx);
                        render();
                    });
                    bitsEl.appendChild(bit);
                }

                infoEl.textContent = '2진수: ' + (mask >>> 0).toString(2).padStart(BITS, '0') + ' | 10진수: ' + mask;

                var elements = [];
                for (var i = 0; i < BITS; i++) {
                    if ((mask >> i) & 1) elements.push(i);
                }
                setEl.innerHTML = '집합: <strong>{' + (elements.length ? elements.join(', ') : '비어있음') + '}</strong>' +
                    ' | 원소 수: ' + elements.length;
            }
            render();
        })();

        // ====== 데모 4: XOR 짝 없는 수 찾기 ======
        (function() {
            var xorBtn = container.querySelector('#bit-demo-xor-btn');
            var resetBtn = container.querySelector('#bit-demo-xor-reset');
            var inputEl = container.querySelector('#bit-demo-xor-input');
            var arrEl = container.querySelector('#bit-demo-xor-arr');
            var stepsEl = container.querySelector('#bit-demo-xor-steps');
            var resultEl = container.querySelector('#bit-demo-xor-result');

            var xorState = { nums: [], stepIdx: -1, xorVal: 0, initialized: false };

            function xorInitDemo() {
                var nums = inputEl.value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
                if (nums.length < 2) { resultEl.textContent = '숫자를 2개 이상 입력해주세요!'; return false; }
                xorState.nums = nums;
                xorState.stepIdx = -1;
                xorState.xorVal = 0;
                xorState.initialized = true;

                arrEl.innerHTML = '';
                nums.forEach(function(n) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.innerHTML = '<div class="str-char-val">' + n + '</div>';
                    arrEl.appendChild(box);
                });
                stepsEl.innerHTML = '';
                resultEl.textContent = '';
                return true;
            }

            function xorAdvanceStep() {
                if (!xorState.initialized) {
                    if (!xorInitDemo()) return;
                }
                var nums = xorState.nums;
                xorState.stepIdx++;
                if (xorState.stepIdx >= nums.length) {
                    // Already finished — do nothing on extra clicks
                    xorState.stepIdx = nums.length;
                    return;
                }
                var idx = xorState.stepIdx;
                var prev = xorState.xorVal;
                xorState.xorVal ^= nums[idx];
                var line = document.createElement('div');
                line.style.animation = 'fadeIn 0.3s ease';
                line.innerHTML = prev + ' ^ ' + nums[idx] + ' = <strong style="color:var(--accent);">' + xorState.xorVal + '</strong>';
                stepsEl.appendChild(line);

                // Highlight current in array
                var boxes = arrEl.querySelectorAll('.str-char-box');
                boxes.forEach(function(b) { b.style.borderColor = ''; b.style.boxShadow = ''; });
                if (boxes[idx]) {
                    boxes[idx].style.borderColor = 'var(--yellow)';
                    boxes[idx].style.boxShadow = '0 0 6px var(--yellow)';
                }

                // If last step, show result
                if (xorState.stepIdx >= nums.length - 1) {
                    resultEl.innerHTML = '<strong style="color:var(--green);">짝 없는 수: ' + xorState.xorVal + '</strong> — 짝이 있는 수는 XOR로 사라지고, 혼자인 수만 남습니다!';
                    boxes.forEach(function(box) {
                        if (box.textContent.trim() == String(xorState.xorVal)) {
                            box.style.borderColor = 'var(--green)';
                            box.style.boxShadow = '0 0 8px var(--green)';
                        }
                    });
                }
            }

            xorBtn.addEventListener('click', xorAdvanceStep);

            resetBtn.addEventListener('click', function() {
                xorState.initialized = false;
                xorState.stepIdx = -1;
                xorState.xorVal = 0;
                arrEl.innerHTML = '';
                stepsEl.innerHTML = '';
                resultEl.textContent = '';
            });
        })();
    },

    // ===== 시각화 탭 =====
    renderVisualize(container) {
        var self = this;
        self._clearVizState();
        var suffix = 'concept-bit';

        container.innerHTML =
            '<div class="hero" style="padding-bottom:12px;">' +
            '<h2>XOR로 중복 없는 수 찾기 시각화</h2>' +
            '<p class="hero-sub">배열의 모든 원소를 XOR하면 짝이 없는 수만 남는 과정을 단계별로 봅시다.</p>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: ' +
            '<input type="text" id="bit-viz-input-' + suffix + '" value="4, 1, 2, 1, 2, 3, 4" ' +
            'style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;">' +
            '</label>' +
            '<button class="btn btn-primary" id="bit-viz-start-' + suffix + '">시작</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div class="graph-svg-container" style="min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">' +
            '<div id="bit-array-display-' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="bit-xor-display-' + suffix + '" style="display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:150px;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">상태</div>' +
            '<div id="bit-status-' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">시작을 눌러주세요</div>' +
            '</div></div>' +
            self._createStepControls(suffix) +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 현재 XOR 중</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 처리 완료</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(108,92,231,0.3);border:2px solid var(--accent);vertical-align:middle;"></span> 변경된 비트</span>' +
            '</div>';

        var arrayDisplay = container.querySelector('#bit-array-display-' + suffix);
        var xorDisplay = container.querySelector('#bit-xor-display-' + suffix);
        var statusEl = container.querySelector('#bit-status-' + suffix);

        var MAX_BITS = 8;

        function toBinStr(num) {
            var s = (num >>> 0).toString(2);
            while (s.length < MAX_BITS) s = '0' + s;
            return s.slice(-MAX_BITS);
        }

        function renderArrayBoxes(nums) {
            arrayDisplay.innerHTML = '';
            nums.forEach(function(n, idx) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = idx;
                box.innerHTML =
                    '<div class="str-char-idx">[' + idx + ']</div>' +
                    '<div class="str-char-val">' + n + '</div>';
                arrayDisplay.appendChild(box);
            });
        }

        function renderBitRow(label, num, highlightBits) {
            var binStr = toBinStr(num);
            var html = '<div style="display:flex;align-items:center;gap:8px;">';
            html += '<span style="min-width:100px;text-align:right;font-weight:600;color:var(--text2);font-size:0.9rem;">' + label + '</span>';
            html += '<div style="display:flex;gap:3px;">';
            for (var i = 0; i < binStr.length; i++) {
                var hl = highlightBits && highlightBits.has(i);
                html += '<div class="str-char-box' + (hl ? ' comparing' : '') + '" style="width:32px;height:36px;font-size:1rem;">' +
                    '<div class="str-char-val">' + binStr[i] + '</div></div>';
            }
            html += '</div>';
            html += '<span style="min-width:40px;font-weight:700;color:var(--accent);font-size:1rem;">= ' + num + '</span>';
            html += '</div>';
            return html;
        }

        function setArrayBoxState(idx, cls) {
            var box = arrayDisplay.querySelector('[data-idx="' + idx + '"]');
            if (box) box.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }

        function saveState() {
            return {
                arrayBoxes: Array.from(arrayDisplay.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                xorHTML: xorDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            var boxes = arrayDisplay.querySelectorAll('.str-char-box');
            boxes.forEach(function(b, i) { if (s.arrayBoxes[i]) b.className = s.arrayBoxes[i]; });
            xorDisplay.innerHTML = s.xorHTML;
            statusEl.innerHTML = s.status;
        }

        container.querySelector('#bit-viz-start-' + suffix).addEventListener('click', function() {
            self._clearVizState();

            var raw = container.querySelector('#bit-viz-input-' + suffix).value;
            var nums = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (nums.length === 0) {
                statusEl.innerHTML = '<span style="color:var(--red,#e17055);">숫자를 입력해주세요!</span>';
                return;
            }

            renderArrayBoxes(nums);
            xorDisplay.innerHTML = '';
            statusEl.innerHTML = '준비 완료';

            var steps = [];
            var runningXor = 0;

            steps.push({
                description: 'result = 0으로 시작합니다. <em>XOR의 항등원이 0</em>이므로 (a ^ 0 = a), 어떤 수와 XOR해도 그 수 자체가 됩니다.',
                _before: null,
                action: function() {
                    this._before = saveState();
                    xorDisplay.innerHTML = renderBitRow('result = 0', 0, null);
                    statusEl.innerHTML = 'result를 0으로 초기화했습니다.';
                },
                undo: function() { restoreState(this._before); }
            });

            for (var i = 0; i < nums.length; i++) {
                var num = nums[i];
                var prevXor = runningXor;
                var newXor = prevXor ^ num;
                var prevBin = toBinStr(prevXor);
                var numBin = toBinStr(num);
                var newBin = toBinStr(newXor);

                var changedBits = new Set();
                for (var b = 0; b < MAX_BITS; b++) {
                    if (prevBin[b] !== newBin[b]) changedBits.add(b);
                }

                (function(idx, num, prevXor, newXor, prevBin, numBin, newBin, changedBits) {
                    steps.push({
                        description: 'result ^= ' + num + ': XOR은 같은 비트끼리 만나면 0, 다르면 1이 됩니다. ' + prevXor + ' ^ ' + num + ' = <strong>' + newXor + '</strong> — 짝이 있는 수는 두 번 XOR되어 상쇄(0)되고, 짝 없는 수만 남습니다.',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < nums.length; j++) {
                                if (j < idx) setArrayBoxState(j, 'matched');
                                else if (j === idx) setArrayBoxState(j, 'comparing');
                                else setArrayBoxState(j, '');
                            }
                            var html = '';
                            html += renderBitRow('result', prevXor, null);
                            html += '<div style="font-weight:700;color:var(--yellow);font-size:1.1rem;">XOR (^)</div>';
                            html += renderBitRow('nums[' + idx + '] = ' + num, num, null);
                            html += '<div style="border-top:2px solid var(--border);width:80%;margin:4px 0;"></div>';
                            html += renderBitRow('result = ' + newXor, newXor, changedBits);
                            xorDisplay.innerHTML = html;
                            statusEl.innerHTML = 'result ^= ' + num + ' → <strong>' + newXor + '</strong> (2진수: ' + newBin + ')';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                })(i, num, prevXor, newXor, prevBin, numBin, newBin, changedBits);

                runningXor = newXor;
            }

            var finalResult = runningXor;
            steps.push({
                description: '완료! 모든 원소를 XOR한 결과: <strong>' + finalResult + '</strong>. 짝이 있는 수는 a ^ a = 0으로 서로 상쇄되어 사라지고, 짝 없는 수 하나만 남습니다.',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < nums.length; j++) setArrayBoxState(j, 'matched');
                    var html = renderBitRow('최종 result', finalResult, null);
                    xorDisplay.innerHTML = html;
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.2rem;">✓ 짝이 없는 수는 <strong>' + finalResult + '</strong>입니다!</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            self._initStepController(container, steps, suffix);
        });
    },

    // ===== 시각화 상태 관리 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepDesc(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 &rarr;</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix) {
        var state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var prevBtn = container.querySelector('#viz-prev' + suffix);
        var nextBtn = container.querySelector('#viz-next' + suffix);
        var counter = container.querySelector('#viz-step-counter' + suffix);
        var desc = container.querySelector('#viz-step-desc' + suffix);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { counter.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { counter.textContent = (idx + 1) + ' / ' + total; desc.innerHTML = '<span>' + state.steps[idx].description + '</span>'; }
        }
        var actionDelay = 350;
        nextBtn.addEventListener('click', function() {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; updateUI(); setTimeout(function() { state.steps[state.currentStep].action(); }, actionDelay);
        });
        prevBtn.addEventListener('click', function() {
            if (state.currentStep < 0) return;
            var stepToUndo = state.currentStep; state.currentStep--; updateUI(); setTimeout(function() { state.steps[stepToUndo].undo(); }, actionDelay);
        });
        var handleKey = function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
        };
        document.addEventListener('keydown', handleKey);
        state.keydownHandler = handleKey;
        updateUI();
    },

    // ====================================================================
    // 시뮬레이션 1: Number of 1 Bits (lc-191)
    // ====================================================================
    _renderVizHammingWeight(container) {
        var self = this, suffix = '-hw1';
        var DEFAULT_N = 11;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">n & (n-1) 트릭으로 1 비트 세기</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">n: <input type="number" id="bit-hw-input" value="' + DEFAULT_N + '" min="0" max="1023" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:100px;"></label>' +
            '<button class="btn btn-primary" id="bit-hw-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<p id="hw-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></p>' +
            '<div id="hw-bits' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="hw-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var bitsEl = container.querySelector('#hw-bits' + suffix);
        var infoEl = container.querySelector('#hw-info' + suffix);
        var descEl = container.querySelector('#hw-desc' + suffix);
        var NUM_BITS = 8;

        function renderBits(val, highlightIdx, numBits) {
            var s = (val >>> 0).toString(2);
            while (s.length < numBits) s = '0' + s;
            s = s.slice(-numBits);
            bitsEl.innerHTML = s.split('').map(function(bit, i) {
                var style = 'width:48px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:700;font-size:1.1rem;transition:all 0.3s;';
                if (highlightIdx === i) style += 'background:var(--yellow);color:white;';
                else if (bit === '1') style += 'background:var(--accent)15;border:2px solid var(--accent);color:var(--accent);';
                else style += 'background:var(--bg2);color:var(--text3);';
                return '<div style="' + style + '"><div>' + bit + '</div><div style="font-size:0.65rem;color:var(--text3);">2<sup>' + (numBits - 1 - i) + '</sup></div></div>';
            }).join('');
        }

        function buildSteps(n) {
            var numBits = Math.max(8, (n >>> 0).toString(2).length);
            NUM_BITS = numBits;

            function pad(v) {
                var s = (v >>> 0).toString(2);
                while (s.length < numBits) s = '0' + s;
                return s.slice(-numBits);
            }

            var steps = [];
            var cur = n, count = 0;
            while (cur > 0) {
                var prev = cur;
                var next = cur & (cur - 1);
                count++;
                var prevBin = pad(prev);
                var prevMinusBin = pad(prev - 1);
                var nextBin = pad(next);
                var removedBit = -1;
                for (var b = numBits - 1; b >= 0; b--) {
                    if (prevBin[b] === '1' && nextBin[b] === '0') { removedBit = b; break; }
                }
                (function(prev, next, count, removedBit, prevBin, prevMinusBin, nextBin, numBits) {
                    steps.push({
                        description: '<strong>n & (n-1)</strong>은 가장 오른쪽 1비트를 지우는 트릭입니다. n=' + prev + ' (' + prevBin + ')에서 (n-1)=' + (prev - 1) + ' (' + prevMinusBin + ')을 AND하면, 마지막 1비트만 꺼져서 ' + next + ' (' + nextBin + ')이 됩니다. → count=' + count,
                        action: function() { renderBits(next, removedBit, numBits); infoEl.innerHTML = 'n = ' + prev + ' & ' + (prev - 1) + ' = <strong>' + next + '</strong> — count = <strong>' + count + '</strong>'; },
                        undo: function() { renderBits(prev, -1, numBits); infoEl.innerHTML = '<span style="color:var(--text2);">n = ' + prev + ', count = ' + (count - 1) + '</span>'; }
                    });
                })(prev, next, count, removedBit, prevBin, prevMinusBin, nextBin, numBits);
                cur = next;
            }
            var finalCount = count;
            steps.push({
                description: '완료! n이 0이 되면 더 이상 지울 1비트가 없으므로 종료합니다. <strong>n & (n-1)</strong>을 반복한 횟수 = <strong>' + finalCount + '</strong>이 곧 1비트 개수입니다.',
                action: function() { renderBits(0, -1, numBits); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 1 비트 개수 = ' + finalCount + '</strong>'; },
                undo: function() { renderBits(0, -1, numBits); infoEl.innerHTML = 'n = 0, count = ' + finalCount; }
            });
            return steps;
        }

        function initSim(n) {
            descEl.innerHTML = 'n = ' + n + ' (2진수: ' + (n >>> 0).toString(2) + ')의 1비트 개수를 셉니다. <em>n & (n-1)</em>은 매번 가장 오른쪽 1비트를 하나씩 제거하므로, 반복 횟수가 곧 1비트 개수입니다.';
            var numBits = Math.max(8, (n >>> 0).toString(2).length);
            renderBits(n, -1, numBits);
            infoEl.innerHTML = '<span style="color:var(--text2);">n = ' + n + ', count = 0 — n & (n-1)을 반복합니다.</span>';
            var steps = buildSteps(n);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#bit-hw-reset').addEventListener('click', function() {
            self._clearVizState();
            var val = parseInt(container.querySelector('#bit-hw-input').value, 10);
            if (isNaN(val) || val < 0) val = 0;
            if (val > 1023) val = 1023;
            container.querySelector('#bit-hw-input').value = val;
            initSim(val);
        });

        initSim(DEFAULT_N);
    },

    // ====================================================================
    // 시뮬레이션 2: Single Number — XOR (lc-136)
    // ====================================================================
    _renderVizSingleNumber(container) {
        var self = this, suffix = '-sn1';
        var DEFAULT_NUMS = '2, 3, 1, 3, 2';
        var MAX_BITS = 8;

        function toBinStr(num) {
            var s = (num >>> 0).toString(2);
            while (s.length < MAX_BITS) s = '0' + s;
            return s.slice(-MAX_BITS);
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">XOR로 짝 없는 수 찾기</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="bit-single-input" value="' + DEFAULT_NUMS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="bit-single-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<p id="sn-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></p>' +
            '<div id="sn-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sn-xor' + suffix + '" style="display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;margin-bottom:8px;"></div>' +
            '<div id="sn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#sn-arr' + suffix);
        var xorEl = container.querySelector('#sn-xor' + suffix);
        var infoEl = container.querySelector('#sn-info' + suffix);
        var descEl = container.querySelector('#sn-desc' + suffix);

        function renderArrayBoxes(nums) {
            arrEl.innerHTML = nums.map(function(n, i) {
                return '<div class="str-char-box" data-idx="' + i + '">' +
                    '<div class="str-char-idx">[' + i + ']</div>' +
                    '<div class="str-char-val">' + n + '</div></div>';
            }).join('');
        }

        function setArrState(idx, cls) {
            var box = arrEl.querySelector('[data-idx="' + idx + '"]');
            if (box) box.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }

        function renderBitRow(label, num, hlBits) {
            var bin = toBinStr(num);
            var html = '<div style="display:flex;align-items:center;gap:8px;">';
            html += '<span style="min-width:100px;text-align:right;font-weight:600;color:var(--text2);font-size:0.9rem;">' + label + '</span>';
            html += '<div style="display:flex;gap:3px;">';
            for (var i = 0; i < bin.length; i++) {
                var hl = hlBits && hlBits.has(i);
                html += '<div class="str-char-box' + (hl ? ' comparing' : '') + '" style="width:32px;height:36px;font-size:1rem;">' +
                    '<div class="str-char-val">' + bin[i] + '</div></div>';
            }
            html += '</div>';
            html += '<span style="min-width:40px;font-weight:700;color:var(--accent);font-size:1rem;">= ' + num + '</span>';
            html += '</div>';
            return html;
        }

        function saveState() {
            return {
                arr: Array.from(arrEl.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                xor: xorEl.innerHTML,
                info: infoEl.innerHTML
            };
        }
        function restoreState(s) {
            arrEl.querySelectorAll('.str-char-box').forEach(function(b, i) { if (s.arr[i]) b.className = s.arr[i]; });
            xorEl.innerHTML = s.xor;
            infoEl.innerHTML = s.info;
        }

        function buildSteps(nums) {
            var steps = [];
            var runXor = 0;

            steps.push({
                description: 'result = 0으로 시작합니다. <em>XOR의 항등원이 0</em>이므로 (a ^ 0 = a), 어떤 수와 XOR해도 그 수 자체가 됩니다.',
                _before: null,
                action: function() { this._before = saveState(); xorEl.innerHTML = renderBitRow('result = 0', 0, null); infoEl.innerHTML = 'result를 0으로 초기화했습니다.'; },
                undo: function() { restoreState(this._before); }
            });

            for (var i = 0; i < nums.length; i++) {
                var num = nums[i];
                var prevXor = runXor;
                var newXor = prevXor ^ num;
                var prevBin = toBinStr(prevXor);
                var newBin = toBinStr(newXor);
                var changed = new Set();
                for (var b = 0; b < MAX_BITS; b++) { if (prevBin[b] !== newBin[b]) changed.add(b); }

                (function(idx, num, prevXor, newXor, prevBin, newBin, changed, numsRef) {
                    steps.push({
                        description: 'result ^= ' + num + ': XOR은 같은 비트끼리 만나면 0, 다르면 1이 됩니다. ' + prevXor + ' ^ ' + num + ' = <strong>' + newXor + '</strong> — 짝이 있는 수는 두 번 XOR되어 상쇄되고, 짝 없는 수만 남습니다.',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < numsRef.length; j++) {
                                if (j < idx) setArrState(j, 'matched');
                                else if (j === idx) setArrState(j, 'comparing');
                                else setArrState(j, '');
                            }
                            var html = renderBitRow('result', prevXor, null);
                            html += '<div style="font-weight:700;color:var(--yellow);font-size:1.1rem;">XOR (^)</div>';
                            html += renderBitRow('nums[' + idx + '] = ' + num, num, null);
                            html += '<div style="border-top:2px solid var(--border);width:80%;margin:4px 0;"></div>';
                            html += renderBitRow('result = ' + newXor, newXor, changed);
                            xorEl.innerHTML = html;
                            infoEl.innerHTML = 'result ^= ' + num + ' → <strong>' + newXor + '</strong>';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                })(i, num, prevXor, newXor, prevBin, newBin, changed, nums);

                runXor = newXor;
            }

            var finalResult = runXor;
            var numsLen = nums.length;
            steps.push({
                description: '완료! 짝이 있는 수들은 a ^ a = 0으로 모두 상쇄되어, 짝 없는 수 <strong>' + finalResult + '</strong>만 남았습니다.',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < numsLen; j++) setArrState(j, 'matched');
                    xorEl.innerHTML = renderBitRow('최종 result', finalResult, null);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 짝이 없는 수 = ' + finalResult + '</strong>';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        function initSim(nums) {
            descEl.textContent = '배열 [' + nums.join(', ') + ']의 모든 원소를 XOR합니다.';
            renderArrayBoxes(nums);
            xorEl.innerHTML = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">result = 0 부터 시작합니다.</span>';
            var steps = buildSteps(nums);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#bit-single-reset').addEventListener('click', function() {
            self._clearVizState();
            var raw = container.querySelector('#bit-single-input').value;
            var nums = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (nums.length === 0) {
                infoEl.innerHTML = '<span style="color:var(--red,#e17055);">숫자를 입력해주세요! (예: 2, 3, 1, 3, 2)</span>';
                return;
            }
            initSim(nums);
        });

        var defaultNums = DEFAULT_NUMS.split(',').map(function(s) { return parseInt(s.trim(), 10); });
        initSim(defaultNums);
    },

    // ====================================================================
    // 시뮬레이션 3: 비트마스크 집합 (boj-11723)
    // ====================================================================
    _renderVizBitmaskSet(container) {
        var self = this, suffix = '-bms';
        var DEFAULT_OPS = 'add 1, add 2, check 1, toggle 3, remove 2, all, check 10, empty';
        var SHOW_BITS = 8;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">비트마스크로 집합 연산</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">연산: <input type="text" id="bit-mask-input" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:400px;"></label>' +
            '<button class="btn btn-primary" id="bit-mask-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-top:-12px;margin-bottom:16px;">형식: add N, remove N, check N, toggle N, all, empty (쉼표로 구분)</p>' +
            self._createStepDesc(suffix) +
            '<p id="bms-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;">정수 하나로 집합을 표현하고 add/remove/toggle/check 연산을 수행합니다.</p>' +
            '<div id="bms-bits' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="bms-set' + suffix + '" style="text-align:center;margin-bottom:8px;font-weight:600;color:var(--accent);"></div>' +
            '<div id="bms-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var bitsEl = container.querySelector('#bms-bits' + suffix);
        var setEl = container.querySelector('#bms-set' + suffix);
        var infoEl = container.querySelector('#bms-info' + suffix);

        function renderBits(S, hlBit, showBits) {
            var html = '';
            for (var i = showBits - 1; i >= 0; i--) {
                var on = (S >> i) & 1;
                var style = 'width:42px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:700;font-size:1rem;transition:all 0.3s;';
                if (i === hlBit) style += 'background:var(--yellow);color:white;';
                else if (on) style += 'background:var(--accent)15;border:2px solid var(--accent);color:var(--accent);';
                else style += 'background:var(--bg2);color:var(--text3);';
                html += '<div style="' + style + '"><div>' + on + '</div><div style="font-size:0.6rem;color:var(--text3);">' + i + '</div></div>';
            }
            bitsEl.innerHTML = html;
        }

        function renderSet(S, showBits) {
            var elems = [];
            for (var i = 0; i < showBits; i++) { if ((S >> i) & 1) elems.push(i); }
            setEl.textContent = 'S = {' + elems.join(', ') + '} (정수: ' + S + ')';
        }

        function parseOps(str) {
            var parts = str.split(',');
            var ops = [];
            for (var i = 0; i < parts.length; i++) {
                var tokens = parts[i].trim().split(/\s+/);
                if (tokens.length === 0 || !tokens[0]) continue;
                var cmd = tokens[0].toLowerCase();
                if (cmd === 'add' || cmd === 'remove' || cmd === 'check' || cmd === 'toggle') {
                    var x = parseInt(tokens[1], 10);
                    if (!isNaN(x) && x >= 0) ops.push({ cmd: cmd, x: x });
                } else if (cmd === 'all' || cmd === 'empty') {
                    ops.push({ cmd: cmd });
                }
            }
            return ops;
        }

        function buildSteps(ops) {
            // Determine SHOW_BITS based on max referenced bit
            var maxBit = 7;
            for (var i = 0; i < ops.length; i++) {
                if (ops[i].x !== undefined && ops[i].x > maxBit) maxBit = ops[i].x;
                if (ops[i].cmd === 'all' && maxBit < 7) maxBit = 7;
            }
            var showBits = Math.min(maxBit + 1, 21);

            var steps = [];
            var S = 0;

            for (var i = 0; i < ops.length; i++) {
                var op = ops[i];
                var prevS = S;
                var desc = '', hlBit = -1, newS = S, infoText = '';

                if (op.cmd === 'add') {
                    newS = S | (1 << op.x);
                    desc = 'add ' + op.x + ': OR로 특정 비트를 켭니다. <code>1 &lt;&lt; ' + op.x + '</code>은 ' + op.x + '번 위치만 1인 마스크이므로, OR하면 <strong>다른 비트는 그대로 두고</strong> ' + op.x + '번만 1로 설정됩니다. → S = ' + newS;
                    hlBit = op.x;
                    infoText = 'add ' + op.x + ': S |= (1 &lt;&lt; ' + op.x + ') — OR은 0|1=1이므로 ' + op.x + '번 비트만 켜짐';
                } else if (op.cmd === 'remove') {
                    newS = S & ~(1 << op.x);
                    desc = 'remove ' + op.x + ': NOT으로 마스크를 뒤집은 뒤 AND합니다. <code>~(1 &lt;&lt; ' + op.x + ')</code>은 ' + op.x + '번만 0이고 나머지는 1이므로, AND하면 <strong>' + op.x + '번만 꺼지고</strong> 나머지는 보존됩니다. → S = ' + newS;
                    hlBit = op.x;
                    infoText = 'remove ' + op.x + ': S &= ~(1 &lt;&lt; ' + op.x + ') — AND는 1&0=0이므로 ' + op.x + '번만 꺼짐';
                } else if (op.cmd === 'toggle') {
                    newS = S ^ (1 << op.x);
                    desc = 'toggle ' + op.x + ': XOR은 같으면 0, 다르면 1이므로, 현재 비트를 <strong>반전</strong>시킵니다. ' + op.x + '번이 1이었으면 0으로, 0이었으면 1로 바뀝니다. → S = ' + newS;
                    hlBit = op.x;
                    infoText = 'toggle ' + op.x + ': S ^= (1 &lt;&lt; ' + op.x + ') — XOR은 1^1=0, 0^1=1이므로 반전';
                } else if (op.cmd === 'check') {
                    var result = (S >> op.x) & 1;
                    newS = S;
                    desc = 'check ' + op.x + ': 오른쪽으로 ' + op.x + '칸 시프트하면 ' + op.x + '번 비트가 맨 끝으로 오고, <code>& 1</code>로 그 비트만 추출합니다. → ' + result + ' (' + (result ? '집합에 있음' : '집합에 없음') + ')';
                    hlBit = op.x < showBits ? op.x : -1;
                    infoText = 'check ' + op.x + ' → <strong>' + result + '</strong> — 시프트 후 AND 1로 특정 비트 확인 (' + (result ? '있음' : '없음') + ')';
                } else if (op.cmd === 'all') {
                    newS = (1 << showBits) - 1;
                    desc = 'all: <code>(1 &lt;&lt; ' + showBits + ') - 1</code>은 하위 ' + showBits + '비트가 모두 1인 수입니다. 이렇게 하면 0~' + (showBits-1) + ' 모든 원소가 집합에 포함됩니다. → S = ' + newS;
                    infoText = 'all: 2<sup>' + showBits + '</sup>-1 = ' + newS + ' → 모든 비트가 1 (전체 집합)';
                } else if (op.cmd === 'empty') {
                    newS = 0;
                    desc = 'empty: S를 0으로 설정하면 모든 비트가 0이 되어 <strong>공집합</strong>이 됩니다. 비트마스크에서 0 = 아무 원소도 없는 상태입니다.';
                    infoText = 'empty: S = 0 → 모든 비트 0 (공집합)';
                }

                (function(prevS, newS, desc, hlBit, infoText, showBits) {
                    steps.push({
                        description: desc,
                        action: function() { renderBits(newS, hlBit, showBits); renderSet(newS, showBits); infoEl.innerHTML = infoText; },
                        undo: function() { renderBits(prevS, -1, showBits); renderSet(prevS, showBits); infoEl.innerHTML = '<span style="color:var(--text2);">S = ' + prevS + '</span>'; }
                    });
                })(prevS, newS, desc, hlBit, infoText, showBits);

                S = newS;
            }

            return { steps: steps, showBits: showBits };
        }

        function initSim(ops) {
            var result = buildSteps(ops);
            renderBits(0, -1, result.showBits);
            renderSet(0, result.showBits);
            infoEl.innerHTML = '<span style="color:var(--text2);">S = 0 (공집합)에서 시작합니다.</span>';
            self._initStepController(container, result.steps, suffix);
        }

        container.querySelector('#bit-mask-reset').addEventListener('click', function() {
            self._clearVizState();
            var raw = container.querySelector('#bit-mask-input').value;
            var ops = parseOps(raw);
            if (ops.length === 0) {
                infoEl.innerHTML = '<span style="color:var(--red,#e17055);">연산을 입력해주세요! (예: add 1, add 3, check 1)</span>';
                return;
            }
            initSim(ops);
        });

        initSim(parseOps(DEFAULT_OPS));
    },

    // ====================================================================
    // 시뮬레이션 4: 부분집합 열거 (lc-78)
    // ====================================================================
    _renderVizSubsets(container) {
        var self = this, suffix = '-sub';
        var DEFAULT_NUMS = '1, 2, 3';
        var MAX_ELEMENTS = 6;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">비트마스크로 부분집합 열거</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="bit-subset-input" value="' + DEFAULT_NUMS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
            '<button class="btn btn-primary" id="bit-subset-reset">🔄</button>' +
            '<span style="font-size:0.8rem;color:var(--text3);">최대 ' + MAX_ELEMENTS + '개 원소</span>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<p id="sub-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></p>' +
            '<div id="sub-mask' + suffix + '" style="display:flex;gap:4px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sub-arr' + suffix + '" style="display:flex;gap:6px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sub-result' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sub-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var maskEl = container.querySelector('#sub-mask' + suffix);
        var arrEl = container.querySelector('#sub-arr' + suffix);
        var resultEl = container.querySelector('#sub-result' + suffix);
        var infoEl = container.querySelector('#sub-info' + suffix);
        var descEl = container.querySelector('#sub-desc' + suffix);

        var collectedSubsets = [];

        function renderMask(mask, n) {
            var html = '';
            for (var i = n - 1; i >= 0; i--) {
                var on = (mask >> i) & 1;
                var style = 'width:44px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:700;font-size:1.1rem;transition:all 0.3s;';
                if (on) style += 'background:var(--accent);color:white;';
                else style += 'background:var(--bg2);color:var(--text3);';
                html += '<div style="' + style + '"><div>' + on + '</div><div style="font-size:0.6rem;color:' + (on ? 'rgba(255,255,255,0.7)' : 'var(--text3)') + ';">bit ' + i + '</div></div>';
            }
            maskEl.innerHTML = html;
        }

        function renderArr(mask, nums) {
            arrEl.innerHTML = nums.map(function(v, i) {
                var selected = (mask >> i) & 1;
                var style = 'width:52px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:700;font-size:1.1rem;transition:all 0.3s;';
                if (selected) style += 'background:var(--green);color:white;';
                else style += 'background:var(--bg2);color:var(--text3);opacity:0.5;';
                return '<div style="' + style + '"><div>' + v + '</div><div style="font-size:0.65rem;">nums[' + i + ']</div></div>';
            }).join('');
        }

        function renderCollected() {
            resultEl.innerHTML = collectedSubsets.map(function(sub) {
                return '<span style="padding:4px 10px;background:var(--card);border:1px solid var(--border);border-radius:6px;font-size:0.85rem;">[' + sub.join(', ') + ']</span>';
            }).join('');
        }

        function buildSteps(nums) {
            var n = nums.length;
            var steps = [];

            for (var mask = 0; mask < (1 << n); mask++) {
                var subset = [];
                for (var j = 0; j < n; j++) { if (mask & (1 << j)) subset.push(nums[j]); }
                var maskBin = '';
                for (var b = n - 1; b >= 0; b--) maskBin += ((mask >> b) & 1);

                (function(mask, subset, maskBin, snapSubsets, nums, n) {
                    steps.push({
                        description: 'mask = ' + mask + ' (' + maskBin + '): 각 비트가 해당 위치의 원소를 <strong>포함(1)/제외(0)</strong> 결정합니다. → 부분집합: [' + subset.join(', ') + ']',
                        action: function() {
                            renderMask(mask, n);
                            renderArr(mask, nums);
                            collectedSubsets = snapSubsets.concat([subset]);
                            renderCollected();
                            infoEl.innerHTML = 'mask = ' + mask + ' (' + maskBin + ') → <strong>[' + subset.join(', ') + ']</strong>';
                        },
                        undo: function() {
                            collectedSubsets = snapSubsets;
                            renderCollected();
                            if (mask > 0) {
                                renderMask(mask - 1, n);
                                renderArr(mask - 1, nums);
                            } else {
                                renderMask(0, n);
                                renderArr(0, nums);
                            }
                            infoEl.innerHTML = '<span style="color:var(--text2);">mask = 0 ~ ' + ((1 << n) - 1) + '을 순회합니다.</span>';
                        }
                    });
                })(mask, subset, maskBin, collectedSubsets.slice(), nums, n);
                collectedSubsets.push(subset);
            }

            // Reset collectedSubsets for interactivity
            collectedSubsets = [];

            var total = (1 << n);
            steps.push({
                description: '완료! n개 원소의 부분집합은 2<sup>n</sup> = <strong>' + total + '</strong>개입니다. 0부터 2<sup>n</sup>-1까지의 정수가 각각 하나의 부분집합에 대응하므로, 비트마스크로 빠짐없이 열거할 수 있습니다.',
                action: function() {
                    collectedSubsets = [];
                    for (var m = 0; m < (1 << n); m++) {
                        var s = [];
                        for (var j = 0; j < n; j++) { if (m & (1 << j)) s.push(nums[j]); }
                        collectedSubsets.push(s);
                    }
                    renderCollected();
                    renderMask((1 << n) - 1, n);
                    renderArr((1 << n) - 1, nums);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 총 ' + total + '개의 부분집합 열거 완료!</strong>';
                },
                undo: function() {
                    collectedSubsets = [];
                    for (var m = 0; m < (1 << n); m++) {
                        var s = [];
                        for (var j = 0; j < n; j++) { if (m & (1 << j)) s.push(nums[j]); }
                        collectedSubsets.push(s);
                    }
                    renderCollected();
                    renderMask((1 << n) - 1, n);
                    renderArr((1 << n) - 1, nums);
                    infoEl.innerHTML = 'mask = ' + ((1 << n) - 1);
                }
            });

            return steps;
        }

        function initSim(nums) {
            var n = nums.length;
            collectedSubsets = [];
            descEl.textContent = 'nums = [' + nums.join(', ') + ']의 모든 부분집합을 비트 마스크 0~' + ((1 << n) - 1) + '로 열거합니다.';
            renderMask(0, n);
            renderArr(0, nums);
            resultEl.innerHTML = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">mask = 0 ~ ' + ((1 << n) - 1) + '을 순회하며 부분집합을 생성합니다.</span>';
            var steps = buildSteps(nums);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#bit-subset-reset').addEventListener('click', function() {
            self._clearVizState();
            var raw = container.querySelector('#bit-subset-input').value;
            var nums = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (nums.length === 0) {
                infoEl.innerHTML = '<span style="color:var(--red,#e17055);">숫자를 입력해주세요! (예: 1, 2, 3)</span>';
                return;
            }
            if (nums.length > MAX_ELEMENTS) {
                nums = nums.slice(0, MAX_ELEMENTS);
                container.querySelector('#bit-subset-input').value = nums.join(', ');
                infoEl.innerHTML = '<span style="color:var(--yellow);">원소가 ' + MAX_ELEMENTS + '개를 초과하여 앞 ' + MAX_ELEMENTS + '개만 사용합니다.</span>';
            }
            initSim(nums);
        });

        var defaultNums = DEFAULT_NUMS.split(',').map(function(s) { return parseInt(s.trim(), 10); });
        initSim(defaultNums);
    },

    // ===== 문제 목록 =====
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
            simIntro: 'n & (n-1) 트릭으로 1 비트를 하나씩 제거하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>양의 정수 <code>n</code>의 이진 표현에서 1인 비트의 개수(해밍 가중치)를 반환하세요.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>n = 11</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div><p>11의 이진 표현은 1011이므로 1비트가 3개입니다.</p></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>n = 128</pre></div>
                    <div><strong>출력</strong><pre>1</pre></div>
                </div><p>128의 이진 표현은 10000000이므로 1비트가 1개입니다.</p></div>
                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>n = 2147483645</pre></div>
                    <div><strong>출력</strong><pre>30</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 &le; n &le; 2<sup>31</sup> - 1</li></ul>
                <h4>Follow-up</h4>
                <p>입력이 여러 번 주어진다면, 어떻게 최적화할 수 있을까요?</p>
            `,
            hints: [
                {
                    title: '처음 떠오르는 방법',
                    content: '이진수에서 1의 개수를 세야 하니까... 일단 각 비트를 하나씩 확인하면 되지 않을까요?<br><br>맨 오른쪽 비트부터 <code>&amp; 1</code>로 1인지 확인하고, 오른쪽 시프트(<code>&gt;&gt; 1</code>)로 다음 비트를 확인하는 거예요.<br>32비트 정수라면 32번 반복하면 되겠죠!'
                },
                {
                    title: '근데 이러면 아쉬운 점이 있어',
                    content: '32번 반복이 느린 건 아니지만, 만약 1 비트가 딱 2개뿐인데도 32번 돌아야 해요.<br><br>예를 들어 <code>10000000 00000000 00000000 00000001</code>은 1이 2개뿐인데, 나머지 30개의 0도 다 확인하는 거죠. <strong>1 비트 개수만큼만 반복</strong>할 수는 없을까요?'
                },
                {
                    title: '이렇게 하면 어떨까?',
                    content: '마법 같은 트릭이 있어요: <code>n &amp; (n-1)</code>을 하면 <strong>가장 낮은 1 비트가 딱 하나 사라져요!</strong><br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-family:monospace;font-size:0.9em;"><div style="margin-bottom:10px;font-weight:600;font-family:inherit;text-align:center;">n &amp; (n-1) 동작 과정</div><div style="display:flex;flex-direction:column;gap:4px;align-items:center;"><div style="display:flex;gap:4px;"><span style="color:var(--text2);width:70px;text-align:right;">n&nbsp;&nbsp;=</span> <span style="padding:2px 4px;background:var(--accent);color:#fff;border-radius:3px;">1</span><span style="padding:2px 4px;background:var(--accent);color:#fff;border-radius:3px;">1</span><span style="padding:2px 4px;background:var(--yellow);color:#000;border-radius:3px;font-weight:700;">0</span><span style="padding:2px 4px;background:var(--yellow);color:#000;border-radius:3px;font-weight:700;">0</span></div><div style="display:flex;gap:4px;"><span style="color:var(--text2);width:70px;text-align:right;">n-1 =</span> <span style="padding:2px 4px;background:var(--accent);color:#fff;border-radius:3px;">1</span><span style="padding:2px 4px;background:var(--red);color:#fff;border-radius:3px;">0</span><span style="padding:2px 4px;background:var(--red);color:#fff;border-radius:3px;">1</span><span style="padding:2px 4px;background:var(--red);color:#fff;border-radius:3px;">1</span></div><div style="border-top:2px solid var(--text2);width:180px;margin:4px 0;"></div><div style="display:flex;gap:4px;"><span style="color:var(--text2);width:70px;text-align:right;">AND =</span> <span style="padding:2px 4px;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">1</span><span style="padding:2px 4px;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">0</span><span style="padding:2px 4px;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">0</span><span style="padding:2px 4px;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">0</span></div></div><div style="text-align:center;margin-top:6px;color:var(--green);font-weight:600;font-family:inherit;">가장 낮은 1 비트가 제거됐다!</div></div>왜 그럴까요? <code>n-1</code>은 가장 낮은 1 비트를 0으로 바꾸고 그 아래를 전부 1로 만들거든요.<br>이걸 <strong>n이 0이 될 때까지</strong> 반복하면, 반복 횟수 = 1 비트 개수! O(k)로 끝나요 (k = 1의 개수).'
                },
                {
                    title: 'Python/C++에선 이렇게!',
                    content: '원리를 이해했다면, 사실 내장 함수도 있어요:<br><br><span class="lang-py">Python: <code>bin(n).count("1")</code> — 이진 문자열로 바꿔서 "1" 개수를 세는 한 줄 풀이!</span><span class="lang-cpp">C++: <code>__builtin_popcount(n)</code> — GCC 내장 함수로 1 비트 개수를 바로 반환!</span><br><br>하지만 면접에서는 <code>n &amp; (n-1)</code> 트릭을 직접 구현하는 걸 기대하니, 둘 다 알아두세요!'
                }
            ],
            templates: {
                python: 'class Solution:\n    def hammingWeight(self, n: int) -> int:\n        # 방법 1: n & (n-1) 트릭\n        count = 0\n        while n:\n            n &= (n - 1)  # 가장 낮은 1 비트 제거\n            count += 1\n        return count\n\n    # 방법 2: 간단한 방법\n    # def hammingWeight(self, n: int) -> int:\n    #     return bin(n).count(\'1\')',
                cpp: 'class Solution {\npublic:\n    int hammingWeight(int n) {\n        int count = 0;\n        while (n) {\n            n &= (n - 1);  // 가장 낮은 1 비트 제거\n            count++;\n        }\n        return count;\n    }\n};'
            },
            solutions: [{
                approach: 'n & (n-1) 트릭',
                description: 'n & (n-1)로 가장 낮은 1 비트를 하나씩 제거하며 카운트합니다.',
                timeComplexity: 'O(k) (k = 1 비트 개수)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '초기화', desc: '1 비트의 개수를 셀 카운터를 준비합니다.', code: 'count = 0' },
                        { title: 'n & (n-1) 반복', desc: 'n & (n-1)은 가장 낮은 1 비트를 하나 제거하는 트릭입니다.\n비트가 전부 0이 될 때까지 반복하면 1의 개수를 알 수 있습니다.', code: 'while n:\n    n &= (n - 1)  # 가장 낮은 1 비트 제거\n    count += 1' },
                        { title: '결과 반환', desc: '제거 횟수 = 1 비트의 개수이므로 그대로 반환합니다.', code: 'return count' }
                    ],
                    cpp: [
                        { title: '초기화', desc: 'int로 카운터 선언. unsigned int로 받으면 음수 처리 불필요.', code: 'int count = 0;' },
                        { title: 'n & (n-1) 반복', desc: 'n &= (n-1)은 가장 낮은 1 비트를 제거.\n비트가 0이 될 때까지 반복.', code: 'while (n) {\n    n &= (n - 1);  // 가장 낮은 1 비트 제거\n    count++;\n}' },
                        { title: '결과 반환', desc: '__builtin_popcount(n)으로 한 줄로도 가능하지만,\n트릭의 원리를 이해하는 것이 중요합니다.', code: 'return count;\n// 한 줄 풀이: return __builtin_popcount(n);' }
                    ]
                },
                get templates() { return bitManipulationTopic.problems[0].templates; }
            }]
        },
        {
            id: 'lc-136',
            title: 'LeetCode 136 - Single Number',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/single-number/',
            simIntro: 'XOR로 배열의 모든 원소를 순회하며 짝 없는 수를 찾는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>비어 있지 않은 정수 배열 <code>nums</code>가 주어집니다. 모든 원소는 두 번씩 나타나고, 하나의 원소만 한 번 나타납니다. 한 번만 나타나는 원소를 찾으세요.</p>
                <p>반드시 선형 시간복잡도로 구현하고, 추가 메모리 없이 풀어야 합니다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [2,2,1]</pre></div>
                    <div><strong>출력</strong><pre>1</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [4,1,2,1,2]</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [1]</pre></div>
                    <div><strong>출력</strong><pre>1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; nums.length &le; 3 &times; 10<sup>4</sup></li>
                    <li>-3 &times; 10<sup>4</sup> &le; nums[i] &le; 3 &times; 10<sup>4</sup></li>
                    <li>하나의 원소만 한 번 나타남</li>
                </ul>
            `,
            hints: [
                {
                    title: '처음 떠오르는 방법',
                    content: '모든 원소가 2번씩 나오고 하나만 1번 나온다면... 각 숫자가 몇 번 나왔는지 세면 되지 않을까요?<br><br>딕셔너리(해시맵)로 빈도수를 세고, 1번만 나온 숫자를 찾으면 끝! O(n) 시간에 풀 수 있어요.'
                },
                {
                    title: '근데 이러면 문제가 있어',
                    content: '딕셔너리 풀이는 잘 동작하지만, 문제 조건을 다시 보세요: <strong>"추가 메모리 없이 풀어야 합니다"</strong>.<br><br>딕셔너리는 O(n) 공간을 쓰니까 조건에 맞지 않아요. 배열을 정렬해서 인접 비교하는 방법도 O(n log n)이라 아쉽고요. <strong>O(n) 시간 + O(1) 공간</strong>으로 풀 수 있는 방법이 있을까요?'
                },
                {
                    title: '이렇게 하면 어떨까?',
                    content: '비트 연산 XOR(^)의 두 가지 성질을 떠올려 봅시다:<br><br>1. <code>a ^ a = 0</code> — 같은 수끼리 XOR하면 0!<br>2. <code>a ^ 0 = a</code> — 0과 XOR하면 자기 자신!<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">XOR 누적 과정: [4, 1, 2, 1, 2]</div><div style="display:flex;flex-direction:column;gap:4px;align-items:center;font-family:monospace;"><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">0 ^ <strong>4</strong> =</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">4 (100)</span></div><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">4 ^ <strong>1</strong> =</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">5 (101)</span></div><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">5 ^ <strong>2</strong> =</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">7 (111)</span></div><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">7 ^ <strong>1</strong> =</span><span style="padding:3px 10px;background:var(--yellow);color:#000;border-radius:4px;">6 (110)</span><span style="color:var(--text2);font-size:0.85em;">← 1 상쇄!</span></div><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">6 ^ <strong>2</strong> =</span><span style="padding:3px 10px;background:var(--green);color:#fff;border-radius:4px;font-weight:700;">4 (100)</span><span style="color:var(--text2);font-size:0.85em;">← 2도 상쇄! 4만 남음</span></div></div></div>그렇다면... 배열의 <strong>모든 원소를 전부 XOR</strong>하면 어떻게 될까요?<br>2번 나오는 수끼리는 상쇄되어 0이 되고, 1번만 나오는 수만 남아요!'
                },
                {
                    title: 'Python/C++에선 이렇게!',
                    content: '<span class="lang-py">Python: <code>functools.reduce(lambda a, b: a ^ b, nums)</code>로 한 줄에 전부 XOR할 수 있어요!<br><code>reduce</code>는 리스트를 하나의 값으로 축약하는 함수예요.</span><span class="lang-cpp">C++: <code>accumulate(nums.begin(), nums.end(), 0, bit_xor&lt;int&gt;())</code>로 한 줄 풀이가 가능해요!<br><code>&lt;numeric&gt;</code>과 <code>&lt;functional&gt;</code> 헤더가 필요합니다.</span>'
                }
            ],
            templates: {
                python: 'class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        result = 0\n        for n in nums:\n            result ^= n  # 같은 수끼리 상쇄 → 혼자인 수만 남음\n        return result\n\n    # 한 줄 풀이:\n    # from functools import reduce\n    # def singleNumber(self, nums): return reduce(lambda a,b: a^b, nums)',
                cpp: 'class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int result = 0;\n        for (int n : nums) {\n            result ^= n;  // 같은 수끼리 상쇄\n        }\n        return result;\n    }\n};'
            },
            solutions: [{
                approach: 'XOR 전체 순회',
                description: '모든 원소를 XOR하면 짝이 있는 수는 상쇄되고 유일한 수만 남습니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '초기화', desc: 'result를 0으로 시작합니다.\na ^ 0 = a이므로 0은 XOR의 항등원입니다.', code: 'result = 0' },
                        { title: '전체 XOR', desc: 'a ^ a = 0이므로 2번 나오는 수는 상쇄됩니다.\n결국 1번만 나오는 수만 남게 됩니다.', code: 'for n in nums:\n    result ^= n  # 같은 수끼리 상쇄' },
                        { title: '결과 반환', desc: 'O(n) 시간, O(1) 공간으로 유일한 수를 찾았습니다.', code: 'return result' }
                    ],
                    cpp: [
                        { title: '초기화', desc: 'XOR의 항등원 0으로 시작합니다.', code: 'int result = 0;' },
                        { title: '전체 XOR', desc: 'range-based for로 간결하게.\na ^ a = 0이라 짝수개는 상쇄.', code: 'for (int n : nums) {\n    result ^= n;  // 같은 수끼리 상쇄\n}' },
                        { title: '결과 반환', desc: '짝이 있는 수는 모두 0으로 상쇄되어 유일한 수만 남습니다.', code: 'return result;' }
                    ]
                },
                get templates() { return bitManipulationTopic.problems[1].templates; }
            }]
        },

        // ===== 2단계: 비트 마스크 응용 =====
        {
            id: 'boj-11723',
            title: 'BOJ 11723 - 집합',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11723',
            simIntro: '비트마스크로 add, remove, toggle, check, all, empty 연산이 동작하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>비어있는 공집합 S가 주어졌을 때, 아래 연산을 수행하는 프로그램을 작성하시오.</p>
                <ul style="margin:8px 0 8px 20px;">
                    <li><code>add x</code>: S에 x를 추가</li>
                    <li><code>remove x</code>: S에서 x를 제거</li>
                    <li><code>check x</code>: S에 x가 있으면 1, 없으면 0 출력</li>
                    <li><code>toggle x</code>: S에 x가 있으면 제거, 없으면 추가</li>
                    <li><code>all</code>: S를 {1, 2, ..., 20}으로 변경</li>
                    <li><code>empty</code>: S를 공집합으로 변경</li>
                </ul>
                <h4>입력</h4>
                <p>첫째 줄에 수행해야 하는 연산의 수 M (1 &le; M &le; 3,000,000)이 주어진다.</p>
                <p>둘째 줄부터 M개의 줄에 수행해야 하는 연산이 한 줄에 하나씩 주어진다.</p>
                <h4>출력</h4>
                <p><code>check</code> 연산이 주어질때마다, 결과를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>26\nadd 1\nadd 2\ncheck 1\ncheck 2\nremove 2\ncheck 1\ncheck 2\ntoggle 3\ncheck 1\ncheck 2\ncheck 3\ncheck 4\nall\ncheck 10\ncheck 15\nempty\ncheck 1\ntoggle 1\ncheck 1\ntoggle 1\ncheck 1\nall\ncheck 5\ntoggle 5\ncheck 5\ncheck 1</pre></div>
                    <div><strong>출력</strong><pre>1\n1\n1\n0\n1\n0\n1\n0\n1\n1\n0\n1\n1\n0\n1\n0\n1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; M &le; 3,000,000</li>
                    <li>1 &le; x &le; 20</li>
                </ul>
            `,
            hints: [
                {
                    title: '처음 떠오르는 방법',
                    content: '집합 연산이니까... <span class="lang-py">Python의 <code>set()</code></span><span class="lang-cpp">C++의 <code>set&lt;int&gt;</code></span>을 쓰면 되지 않을까요?<br><br><code>add</code>, <code>remove</code>, <code>check</code> 다 기본 제공되니까 바로 구현할 수 있어요. 원소도 1~20뿐이라 간단해 보여요!'
                },
                {
                    title: '근데 이러면 문제가 있어',
                    content: 'M이 최대 <strong>300만</strong>이에요! set 자료구조는 각 연산이 O(log n)이라 느릴 수 있고, 메모리 오버헤드도 있어요.<br><br>그런데 원소 범위가 1~20뿐이라는 점을 주목하세요. 겨우 20개짜리 집합인데 set 같은 무거운 자료구조를 쓸 필요가 있을까요? <strong>정수 하나</strong>로 집합을 표현할 수 있다면 모든 연산이 O(1)이 될 텐데...'
                },
                {
                    title: '이렇게 하면 어떨까?',
                    content: '정수 S의 비트로 집합을 표현해요! x번째 비트가 1이면 x가 집합에 있는 거예요.<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.85em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">비트마스크로 집합 표현 (S = {1, 3, 4})</div><div style="display:flex;gap:2px;justify-content:center;font-family:monospace;margin-bottom:10px;"><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">5</div><div style="padding:3px 0;background:var(--bg3);border-radius:3px;">0</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">4</div><div style="padding:3px 0;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">1</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">3</div><div style="padding:3px 0;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">1</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">2</div><div style="padding:3px 0;background:var(--bg3);border-radius:3px;">0</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">1</div><div style="padding:3px 0;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">1</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">0</div><div style="padding:3px 0;background:var(--bg3);border-radius:3px;">0</div></div></div><div style="text-align:center;font-family:monospace;color:var(--text2);">S = 0b011010 = 26</div></div>각 연산이 비트 연산 한 줄로 바뀝니다:<br>• <code>add x</code> → <code>S |= (1 &lt;&lt; x)</code> — x번째 비트를 1로 켜기<br>• <code>remove x</code> → <code>S &amp;= ~(1 &lt;&lt; x)</code> — x번째 비트를 0으로 끄기<br>• <code>check x</code> → <code>(S &gt;&gt; x) &amp; 1</code> — x번째 비트가 1인지 확인<br>• <code>toggle x</code> → <code>S ^= (1 &lt;&lt; x)</code> — x번째 비트 반전<br>• <code>all</code> → <code>S = (1 &lt;&lt; 21) - 1</code> — 1~20번 비트 전부 1<br>• <code>empty</code> → <code>S = 0</code> — 전부 0으로 초기화'
                },
                {
                    title: '시간 초과를 피하려면!',
                    content: 'M이 300만이라 입출력 속도가 중요해요!<br><br><span class="lang-py">Python: <code>sys.stdin.readline</code>을 반드시 사용하세요. 기본 <code>input()</code>은 너무 느려요!<br>출력도 리스트에 모았다가 <code>"\\n".join(out)</code>으로 한 번에 출력하면 훨씬 빨라요.</span><span class="lang-cpp">C++: <code>ios::sync_with_stdio(false)</code>와 <code>cin.tie(nullptr)</code>로 입출력 속도를 높이세요!</span>'
                }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nM = int(input())\nS = 0\nout = []\n\nfor _ in range(M):\n    line = input().split()\n    cmd = line[0]\n\n    if cmd == \'add\':\n        x = int(line[1])\n        S |= (1 << x)\n    elif cmd == \'remove\':\n        x = int(line[1])\n        S &= ~(1 << x)\n    elif cmd == \'check\':\n        x = int(line[1])\n        out.append(\'1\' if (S >> x) & 1 else \'0\')\n    elif cmd == \'toggle\':\n        x = int(line[1])\n        S ^= (1 << x)\n    elif cmd == \'all\':\n        S = (1 << 21) - 1\n    elif cmd == \'empty\':\n        S = 0\n\nprint(\'\\n\'.join(out))',
                cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int M;\n    cin >> M;\n    int S = 0;\n\n    while (M--) {\n        string cmd;\n        cin >> cmd;\n\n        if (cmd == "add") {\n            int x; cin >> x;\n            S |= (1 << x);\n        } else if (cmd == "remove") {\n            int x; cin >> x;\n            S &= ~(1 << x);\n        } else if (cmd == "check") {\n            int x; cin >> x;\n            cout << ((S >> x) & 1) << \'\\n\';\n        } else if (cmd == "toggle") {\n            int x; cin >> x;\n            S ^= (1 << x);\n        } else if (cmd == "all") {\n            S = (1 << 21) - 1;\n        } else { // empty\n            S = 0;\n        }\n    }\n}'
            },
            solutions: [{
                approach: '비트마스크 집합 연산',
                description: '정수 하나의 비트로 집합을 표현하여 각 연산을 O(1)로 처리합니다.',
                timeComplexity: 'O(M)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기화', desc: 'M이 최대 300만이므로 sys.stdin.readline 필수입니다.\n집합 S를 정수 0으로 시작하여 비트마스크로 관리합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nM = int(input())\nS = 0\nout = []' },
                        { title: '연산 처리', desc: '각 연산을 비트 연산 한 줄로 처리합니다.\nOR(추가), AND+NOT(제거), XOR(토글), 시프트(체크).', code: 'for _ in range(M):\n    line = input().split()\n    cmd = line[0]\n    if cmd == \'add\':     S |= (1 << int(line[1]))\n    elif cmd == \'remove\': S &= ~(1 << int(line[1]))\n    elif cmd == \'check\':  out.append(str((S >> int(line[1])) & 1))\n    elif cmd == \'toggle\': S ^= (1 << int(line[1]))\n    elif cmd == \'all\':    S = (1 << 21) - 1\n    elif cmd == \'empty\':  S = 0' },
                        { title: '출력', desc: '리스트에 모아서 한 번에 출력하면 I/O 횟수가 줄어 빠릅니다.', code: 'print(\'\\n\'.join(out))' }
                    ],
                    cpp: [
                        { title: '입력 및 초기화', desc: 'ios::sync_with_stdio(false)로 입출력 속도 향상.\nM이 300만이라 빠른 입출력 필수!', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int M, S = 0;\n    cin >> M;' },
                        { title: '연산 처리', desc: '비트 연산은 Python과 완전히 동일!', code: '    while (M--) {\n        string cmd; cin >> cmd;\n        if (cmd == "add")    { int x; cin >> x; S |= (1 << x); }\n        else if (cmd == "remove") { int x; cin >> x; S &= ~(1 << x); }\n        else if (cmd == "check")  { int x; cin >> x; cout << ((S >> x) & 1) << \'\\n\'; }\n        else if (cmd == "toggle") { int x; cin >> x; S ^= (1 << x); }\n        else if (cmd == "all")    S = (1 << 21) - 1;\n        else S = 0;  // empty\n    }' },
                        { title: '출력', desc: 'C++은 check마다 바로 출력하므로 별도 출력 단계 없이 종료합니다.', code: '    return 0;\n}' }
                    ]
                },
                get templates() { return bitManipulationTopic.problems[2].templates; }
            }]
        },
        {
            id: 'lc-78',
            title: 'LeetCode 78 - Subsets',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/subsets/',
            simIntro: '비트 마스크 0부터 2^n-1까지 순회하며 모든 부분집합을 열거하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수 배열 <code>nums</code>가 주어집니다. 이 배열에는 중복 원소가 없습니다. 모든 부분집합(멱집합)을 반환하세요. 결과에 중복 부분집합이 포함되면 안 됩니다. 부분집합은 어떤 순서로 반환해도 됩니다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [1,2,3]</pre></div>
                    <div><strong>출력</strong><pre>[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>nums = [0]</pre></div>
                    <div><strong>출력</strong><pre>[[],[0]]</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; nums.length &le; 10</li>
                    <li>-10 &le; nums[i] &le; 10</li>
                    <li>모든 원소는 고유</li>
                </ul>
            `,
            hints: [
                {
                    title: '처음 떠오르는 방법',
                    content: '모든 부분집합을 만들어야 하니까... 백트래킹(재귀)으로 풀 수 있지 않을까요?<br><br>각 원소를 "포함할지 / 안 할지" 결정하면서 재귀적으로 탐색하면 모든 조합을 만들 수 있어요. 실제로 이 방법은 잘 동작합니다!'
                },
                {
                    title: '근데 더 간단한 방법이 없을까?',
                    content: '백트래킹도 좋지만, 재귀 호출 구조가 복잡해질 수 있어요.<br><br>잠깐, 각 원소는 "포함(1)" 또는 "미포함(0)" 두 가지 선택뿐이잖아요?<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.85em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">nums = [a, b, c] → 이진수 = 부분집합</div><table style="border-collapse:collapse;width:100%;font-family:monospace;"><tr style="background:var(--bg3);"><th style="padding:4px 8px;border:1px solid var(--bg3);">마스크</th><th style="padding:4px 8px;border:1px solid var(--bg3);">이진수</th><th style="padding:4px 8px;border:1px solid var(--bg3);">선택</th><th style="padding:4px 8px;border:1px solid var(--bg3);">부분집합</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">0</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">000</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">___</td><td style="padding:4px 8px;border:1px solid var(--bg3);">[]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">1</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">00<span style="color:var(--green);font-weight:700;">1</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">__a</td><td style="padding:4px 8px;border:1px solid var(--bg3);">[a]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">5</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;"><span style="color:var(--green);font-weight:700;">1</span>0<span style="color:var(--green);font-weight:700;">1</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">c_a</td><td style="padding:4px 8px;border:1px solid var(--bg3);">[a, c]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">7</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;"><span style="color:var(--green);font-weight:700;">111</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">cba</td><td style="padding:4px 8px;border:1px solid var(--bg3);">[a, b, c]</td></tr></table></div>원소가 n개면 부분집합은 2<sup>n</sup>개 — 이건 <strong>n비트 이진수의 모든 조합</strong>과 정확히 대응돼요!'
                },
                {
                    title: '이렇게 하면 어떨까?',
                    content: '0부터 2<sup>n</sup>-1까지의 정수를 "비트 마스크"로 사용해요!<br><br>각 정수의 j번째 비트가 1이면 nums[j]를 포함하는 거예요.<br>예: <code>[1,2,3]</code>에서 마스크 <code>101</code>(=5) → 0번째와 2번째 비트가 1 → <code>[1, 3]</code> 선택!<br><br>이렇게 하면 재귀 없이 <strong>이중 for문</strong>만으로 모든 부분집합을 만들 수 있어요:<br>바깥 루프: mask를 0~2<sup>n</sup>-1까지 순회<br>안쪽 루프: 각 비트가 1인지 확인 → <code>mask &amp; (1 &lt;&lt; j)</code>'
                },
                {
                    title: 'Python/C++에선 이렇게!',
                    content: '<span class="lang-py">Python: <code>for mask in range(1 &lt;&lt; n)</code>으로 모든 마스크를 순회하고,<br><code>if mask &amp; (1 &lt;&lt; j)</code>로 j번째 원소 포함 여부를 확인해요.<br>리스트 컴프리헨션으로도 가능: <code>[nums[j] for j in range(n) if mask &amp; (1 &lt;&lt; j)]</code></span><span class="lang-cpp">C++: <code>for (int mask = 0; mask &lt; (1 &lt;&lt; n); mask++)</code>로 순회하고,<br><code>if (mask &amp; (1 &lt;&lt; j))</code>로 선택 여부를 판단해요.<br>결과를 <code>vector&lt;vector&lt;int&gt;&gt;</code>에 담으면 됩니다.</span>'
                }
            ],
            templates: {
                python: 'class Solution:\n    def subsets(self, nums: list[int]) -> list[list[int]]:\n        n = len(nums)\n        result = []\n\n        for mask in range(1 << n):  # 0 ~ 2^n - 1\n            subset = []\n            for j in range(n):\n                if mask & (1 << j):  # j번째 비트가 1이면 선택\n                    subset.append(nums[j])\n            result.append(subset)\n\n        return result\n\n    # 백트래킹 풀이 (비교용):\n    # def subsets(self, nums):\n    #     res = []\n    #     def bt(start, curr):\n    #         res.append(curr[:])\n    #         for i in range(start, len(nums)):\n    #             curr.append(nums[i])\n    #             bt(i + 1, curr)\n    #             curr.pop()\n    #     bt(0, [])\n    #     return res',
                cpp: 'class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        int n = nums.size();\n        vector<vector<int>> result;\n\n        for (int mask = 0; mask < (1 << n); mask++) {\n            vector<int> subset;\n            for (int j = 0; j < n; j++) {\n                if (mask & (1 << j)) {\n                    subset.push_back(nums[j]);\n                }\n            }\n            result.push_back(subset);\n        }\n\n        return result;\n    }\n};'
            },
            solutions: [{
                approach: '비트마스크 부분집합 열거',
                description: '0 ~ 2^n-1까지 순회하며 각 비트에 대응하는 원소를 선택합니다.',
                timeComplexity: 'O(n * 2^n)',
                spaceComplexity: 'O(n * 2^n)',
                codeSteps: {
                    python: [
                        { title: '초기화', desc: '원소 n개 → 부분집합 2^n개.\n0부터 2^n-1까지의 비트 마스크가 각 부분집합에 대응합니다.', code: 'n = len(nums)\nresult = []' },
                        { title: '마스크 순회', desc: '각 마스크에서 j번째 비트가 1이면 nums[j]를 포함합니다.\n예: 마스크 101 → nums[0]과 nums[2] 선택.', code: 'for mask in range(1 << n):  # 0 ~ 2^n - 1\n    subset = []\n    for j in range(n):\n        if mask & (1 << j):  # j번째 비트가 1이면 선택\n            subset.append(nums[j])\n    result.append(subset)' },
                        { title: '결과 반환', desc: '2^n개의 부분집합이 모두 담긴 리스트를 반환합니다.', code: 'return result' }
                    ],
                    cpp: [
                        { title: '초기화', desc: 'nums.size()로 원소 수를 구하고 결과 벡터를 준비합니다.', code: 'int n = nums.size();\nvector<vector<int>> result;' },
                        { title: '마스크 순회', desc: '0~2^n-1까지 모든 비트 조합을 순회.\nj번째 비트가 1이면 nums[j] 포함.', code: 'for (int mask = 0; mask < (1 << n); mask++) {\n    vector<int> subset;\n    for (int j = 0; j < n; j++) {\n        if (mask & (1 << j))  // j번째 비트가 1이면 선택\n            subset.push_back(nums[j]);\n    }\n    result.push_back(subset);\n}' },
                        { title: '결과 반환', desc: '모든 비트 조합을 순회했으므로 2^n개의 부분집합이 완성됩니다.', code: 'return result;' }
                    ]
                },
                get templates() { return bitManipulationTopic.problems[3].templates; }
            }]
        }
    ],

    renderProblem(container) {},

    _showOutput(container, text, status) {
        var area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.bitmanipulation = bitManipulationTopic;
