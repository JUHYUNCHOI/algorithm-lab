// =========================================================
// 비트 조작 (Bit Manipulation) 토픽 모듈
// =========================================================
var bitManipulationTopic = {
    id: 'bitmanipulation',
    title: '비트 조작',
    icon: '💻',
    category: '심화 선택',
    order: 19,
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
        container.appendChild(contentDiv);
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
                description: 'result = 0 으로 시작합니다.',
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
                        description: 'result ^= ' + num + ' → ' + prevXor + ' ^ ' + num + ' = ' + newXor + ' (2진수: ' + prevBin + ' ^ ' + numBin + ' = ' + newBin + ')',
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
                description: '완료! 모든 원소를 XOR한 결과: ' + finalResult + ' — 이것이 짝이 없는 수입니다!',
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

    _createStepControls(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ 이전</button>' +
            '<span id="str-indicator-' + suffix + '">시작 전</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _initStepController(container, steps, suffix) {
        var state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var prevBtn = container.querySelector('#str-prev-' + suffix);
        var nextBtn = container.querySelector('#str-next-' + suffix);
        var indicator = container.querySelector('#str-indicator-' + suffix);
        var desc = container.querySelector('#str-desc-' + suffix);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
        }
        nextBtn.addEventListener('click', function() {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; state.steps[state.currentStep].action(); updateUI();
        });
        prevBtn.addEventListener('click', function() {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo(); state.currentStep--; updateUI();
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
        var n = 11;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">n & (n-1) 트릭으로 1 비트 세기</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">n = <strong>' + n + '</strong> (2진수: ' + (n >>> 0).toString(2) + ')의 1 비트 개수를 셉니다.</p>' +
            '<div id="hw-bits' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="hw-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var bitsEl = container.querySelector('#hw-bits' + suffix);
        var infoEl = container.querySelector('#hw-info' + suffix);

        function renderBits(val, highlightIdx) {
            var s = (val >>> 0).toString(2);
            while (s.length < 8) s = '0' + s;
            bitsEl.innerHTML = s.split('').map(function(bit, i) {
                var style = 'width:48px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:700;font-size:1.1rem;transition:all 0.3s;';
                if (highlightIdx === i) style += 'background:var(--yellow);color:white;';
                else if (bit === '1') style += 'background:var(--accent)15;border:2px solid var(--accent);color:var(--accent);';
                else style += 'background:var(--bg2);color:var(--text3);';
                return '<div style="' + style + '"><div>' + bit + '</div><div style="font-size:0.65rem;color:var(--text3);">2<sup>' + (7 - i) + '</sup></div></div>';
            }).join('');
        }

        renderBits(n, -1);
        infoEl.innerHTML = '<span style="color:var(--text2);">n = ' + n + ', count = 0 — n & (n-1)을 반복합니다.</span>';

        var steps = [];
        var cur = n, count = 0;
        while (cur > 0) {
            var prev = cur;
            var next = cur & (cur - 1);
            count++;
            var prevBin = (prev >>> 0).toString(2);
            var prevMinusBin = ((prev - 1) >>> 0).toString(2);
            while (prevBin.length < 8) prevBin = '0' + prevBin;
            while (prevMinusBin.length < 8) prevMinusBin = '0' + prevMinusBin;
            // Find which bit was removed
            var removedBit = -1;
            var nextBin = (next >>> 0).toString(2);
            while (nextBin.length < 8) nextBin = '0' + nextBin;
            for (var b = 7; b >= 0; b--) {
                if (prevBin[b] === '1' && nextBin[b] === '0') { removedBit = b; break; }
            }
            (function(prev, next, count, removedBit, prevBin, prevMinusBin, nextBin) {
                steps.push({
                    description: 'count=' + count + ': n=' + prev + ' (' + prevBin + ') & (n-1)=' + (prev - 1) + ' (' + prevMinusBin + ') = ' + next + ' (' + nextBin + ')',
                    action: function() { renderBits(next, removedBit); infoEl.innerHTML = 'n = ' + prev + ' & ' + (prev - 1) + ' = <strong>' + next + '</strong> — count = <strong>' + count + '</strong>'; },
                    undo: function() { renderBits(prev, -1); infoEl.innerHTML = '<span style="color:var(--text2);">n = ' + prev + ', count = ' + (count - 1) + '</span>'; }
                });
            })(prev, next, count, removedBit, prevBin, prevMinusBin, nextBin);
            cur = next;
        }
        var finalCount = count;
        steps.push({
            description: '완료! n = 0이 되었으므로 종료. 1 비트 개수 = ' + finalCount,
            action: function() { renderBits(0, -1); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 1 비트 개수 = ' + finalCount + '</strong>'; },
            undo: function() { renderBits(0, -1); infoEl.innerHTML = 'n = 0, count = ' + finalCount; }
        });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: Single Number — XOR (lc-136)
    // ====================================================================
    _renderVizSingleNumber(container) {
        var self = this, suffix = '-sn1';
        var nums = [2, 3, 1, 3, 2];
        var MAX_BITS = 8;

        function toBinStr(num) {
            var s = (num >>> 0).toString(2);
            while (s.length < MAX_BITS) s = '0' + s;
            return s.slice(-MAX_BITS);
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">XOR로 짝 없는 수 찾기</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">배열 [' + nums.join(', ') + ']의 모든 원소를 XOR합니다.</p>' +
            '<div id="sn-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sn-xor' + suffix + '" style="display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;margin-bottom:8px;"></div>' +
            '<div id="sn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#sn-arr' + suffix);
        var xorEl = container.querySelector('#sn-xor' + suffix);
        var infoEl = container.querySelector('#sn-info' + suffix);

        // Render array boxes
        arrEl.innerHTML = nums.map(function(n, i) {
            return '<div class="str-char-box" data-idx="' + i + '">' +
                '<div class="str-char-idx">[' + i + ']</div>' +
                '<div class="str-char-val">' + n + '</div></div>';
        }).join('');

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

        infoEl.innerHTML = '<span style="color:var(--text2);">result = 0 부터 시작합니다.</span>';

        var steps = [];
        var runXor = 0;

        steps.push({
            description: 'result = 0 으로 시작합니다.',
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

            (function(idx, num, prevXor, newXor, prevBin, newBin, changed) {
                steps.push({
                    description: 'result ^= ' + num + ' → ' + prevXor + ' ^ ' + num + ' = ' + newXor,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        for (var j = 0; j < nums.length; j++) {
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
            })(i, num, prevXor, newXor, prevBin, newBin, changed);

            runXor = newXor;
        }

        var finalResult = runXor;
        steps.push({
            description: '완료! 짝이 없는 수는 ' + finalResult + '입니다!',
            _before: null,
            action: function() {
                this._before = saveState();
                for (var j = 0; j < nums.length; j++) setArrState(j, 'matched');
                xorEl.innerHTML = renderBitRow('최종 result', finalResult, null);
                infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 짝이 없는 수 = ' + finalResult + '</strong>';
            },
            undo: function() { restoreState(this._before); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 비트마스크 집합 (boj-11723)
    // ====================================================================
    _renderVizBitmaskSet(container) {
        var self = this, suffix = '-bms';
        var ops = [
            { cmd: 'add', x: 1 }, { cmd: 'add', x: 2 }, { cmd: 'check', x: 1 },
            { cmd: 'toggle', x: 3 }, { cmd: 'remove', x: 2 }, { cmd: 'all' },
            { cmd: 'check', x: 10 }, { cmd: 'empty' }
        ];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">비트마스크로 집합 연산</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">정수 하나로 집합을 표현하고 add/remove/toggle/check 연산을 수행합니다.</p>' +
            '<div id="bms-bits' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="bms-set' + suffix + '" style="text-align:center;margin-bottom:8px;font-weight:600;color:var(--accent);"></div>' +
            '<div id="bms-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var bitsEl = container.querySelector('#bms-bits' + suffix);
        var setEl = container.querySelector('#bms-set' + suffix);
        var infoEl = container.querySelector('#bms-info' + suffix);

        var SHOW_BITS = 8;

        function renderBits(S, hlBit) {
            var html = '';
            for (var i = SHOW_BITS - 1; i >= 0; i--) {
                var on = (S >> i) & 1;
                var style = 'width:42px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:700;font-size:1rem;transition:all 0.3s;';
                if (i === hlBit) style += 'background:var(--yellow);color:white;';
                else if (on) style += 'background:var(--accent)15;border:2px solid var(--accent);color:var(--accent);';
                else style += 'background:var(--bg2);color:var(--text3);';
                html += '<div style="' + style + '"><div>' + on + '</div><div style="font-size:0.6rem;color:var(--text3);">' + i + '</div></div>';
            }
            bitsEl.innerHTML = html;
        }

        function renderSet(S) {
            var elems = [];
            for (var i = 0; i < SHOW_BITS; i++) { if ((S >> i) & 1) elems.push(i); }
            setEl.textContent = 'S = {' + elems.join(', ') + '} (정수: ' + S + ')';
        }

        renderBits(0, -1);
        renderSet(0);
        infoEl.innerHTML = '<span style="color:var(--text2);">S = 0 (공집합)에서 시작합니다.</span>';

        var steps = [];
        var S = 0;

        for (var i = 0; i < ops.length; i++) {
            var op = ops[i];
            var prevS = S;
            var desc = '', hlBit = -1, newS = S, infoText = '';

            if (op.cmd === 'add') {
                newS = S | (1 << op.x);
                desc = 'add ' + op.x + ': S |= (1 << ' + op.x + ') → S = ' + newS;
                hlBit = op.x;
                infoText = 'add ' + op.x + ': S |= (1 << ' + op.x + ') — ' + op.x + '번 비트를 1로 설정';
            } else if (op.cmd === 'remove') {
                newS = S & ~(1 << op.x);
                desc = 'remove ' + op.x + ': S &= ~(1 << ' + op.x + ') → S = ' + newS;
                hlBit = op.x;
                infoText = 'remove ' + op.x + ': S &= ~(1 << ' + op.x + ') — ' + op.x + '번 비트를 0으로';
            } else if (op.cmd === 'toggle') {
                newS = S ^ (1 << op.x);
                desc = 'toggle ' + op.x + ': S ^= (1 << ' + op.x + ') → S = ' + newS;
                hlBit = op.x;
                infoText = 'toggle ' + op.x + ': S ^= (1 << ' + op.x + ') — ' + op.x + '번 비트 반전';
            } else if (op.cmd === 'check') {
                var result = (S >> op.x) & 1;
                newS = S;
                desc = 'check ' + op.x + ': (S >> ' + op.x + ') & 1 = ' + result;
                hlBit = op.x;
                infoText = 'check ' + op.x + ' → <strong>' + result + '</strong> (' + (result ? '있음' : '없음') + ')';
            } else if (op.cmd === 'all') {
                newS = (1 << (SHOW_BITS)) - 1;
                desc = 'all: S = (1 << ' + SHOW_BITS + ') - 1 → S = ' + newS;
                infoText = 'all: 모든 비트를 1로 설정 → S = ' + newS;
            } else if (op.cmd === 'empty') {
                newS = 0;
                desc = 'empty: S = 0';
                infoText = 'empty: 모든 비트를 0으로 → S = 0';
            }

            (function(prevS, newS, desc, hlBit, infoText) {
                steps.push({
                    description: desc,
                    action: function() { renderBits(newS, hlBit); renderSet(newS); infoEl.innerHTML = infoText; },
                    undo: function() { renderBits(prevS, -1); renderSet(prevS); infoEl.innerHTML = '<span style="color:var(--text2);">S = ' + prevS + '</span>'; }
                });
            })(prevS, newS, desc, hlBit, infoText);

            S = newS;
        }

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: 부분집합 열거 (lc-78)
    // ====================================================================
    _renderVizSubsets(container) {
        var self = this, suffix = '-sub';
        var nums = [1, 2, 3];
        var n = nums.length;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">비트마스크로 부분집합 열거</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">nums = [' + nums.join(', ') + ']의 모든 부분집합을 비트 마스크 0~' + ((1 << n) - 1) + '로 열거합니다.</p>' +
            '<div id="sub-mask' + suffix + '" style="display:flex;gap:4px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sub-arr' + suffix + '" style="display:flex;gap:6px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sub-result' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sub-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var maskEl = container.querySelector('#sub-mask' + suffix);
        var arrEl = container.querySelector('#sub-arr' + suffix);
        var resultEl = container.querySelector('#sub-result' + suffix);
        var infoEl = container.querySelector('#sub-info' + suffix);

        function renderMask(mask) {
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

        function renderArr(mask) {
            arrEl.innerHTML = nums.map(function(v, i) {
                var selected = (mask >> i) & 1;
                var style = 'width:52px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:700;font-size:1.1rem;transition:all 0.3s;';
                if (selected) style += 'background:var(--green);color:white;';
                else style += 'background:var(--bg2);color:var(--text3);opacity:0.5;';
                return '<div style="' + style + '"><div>' + v + '</div><div style="font-size:0.65rem;">nums[' + i + ']</div></div>';
            }).join('');
        }

        var collectedSubsets = [];
        function renderCollected() {
            resultEl.innerHTML = collectedSubsets.map(function(sub) {
                return '<span style="padding:4px 10px;background:var(--card);border:1px solid var(--border);border-radius:6px;font-size:0.85rem;">[' + sub.join(', ') + ']</span>';
            }).join('');
        }

        renderMask(0);
        renderArr(0);
        infoEl.innerHTML = '<span style="color:var(--text2);">mask = 0 ~ ' + ((1 << n) - 1) + '을 순회하며 부분집합을 생성합니다.</span>';

        var steps = [];

        for (var mask = 0; mask < (1 << n); mask++) {
            var subset = [];
            for (var j = 0; j < n; j++) { if (mask & (1 << j)) subset.push(nums[j]); }
            var maskBin = '';
            for (var b = n - 1; b >= 0; b--) maskBin += ((mask >> b) & 1);

            (function(mask, subset, maskBin, snapSubsets) {
                steps.push({
                    description: 'mask = ' + mask + ' (' + maskBin + ') → 부분집합: [' + subset.join(', ') + ']',
                    action: function() {
                        renderMask(mask);
                        renderArr(mask);
                        collectedSubsets = snapSubsets.concat([subset]);
                        renderCollected();
                        infoEl.innerHTML = 'mask = ' + mask + ' (' + maskBin + ') → <strong>[' + subset.join(', ') + ']</strong>';
                    },
                    undo: function() {
                        collectedSubsets = snapSubsets;
                        renderCollected();
                        if (mask > 0) {
                            renderMask(mask - 1);
                            renderArr(mask - 1);
                        } else {
                            renderMask(0);
                            renderArr(0);
                        }
                        infoEl.innerHTML = '<span style="color:var(--text2);">mask = 0 ~ ' + ((1 << n) - 1) + '을 순회합니다.</span>';
                    }
                });
            })(mask, subset, maskBin, collectedSubsets.slice());
            collectedSubsets.push(subset);
        }

        // Reset collectedSubsets for interactivity
        collectedSubsets = [];

        var total = (1 << n);
        steps.push({
            description: '완료! 총 ' + total + '개의 부분집합을 모두 열거했습니다.',
            action: function() {
                // rebuild all
                collectedSubsets = [];
                for (var m = 0; m < (1 << n); m++) {
                    var s = [];
                    for (var j = 0; j < n; j++) { if (m & (1 << j)) s.push(nums[j]); }
                    collectedSubsets.push(s);
                }
                renderCollected();
                renderMask((1 << n) - 1);
                renderArr((1 << n) - 1);
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
                renderMask((1 << n) - 1);
                renderArr((1 << n) - 1);
                infoEl.innerHTML = 'mask = ' + ((1 << n) - 1);
            }
        });

        self._initStepController(container, steps, suffix);
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
            descriptionHTML: '<h3>문제</h3>' +
                '<p>양의 정수 <code>n</code>이 주어집니다. ' +
                '이 수의 2진수 표현에서 <strong>1인 비트의 개수</strong>(해밍 가중치)를 반환하세요.</p>' +
                '<div class="problem-io">' +
                '<div><h4>입력</h4><p>양의 정수 n</p></div>' +
                '<div><h4>출력</h4><p>2진수에서 1의 개수</p></div></div>' +
                '<div class="problem-example"><h4>예제</h4><div class="example-grid">' +
                '<div><strong>입력</strong><pre>n = 11 (2진수: 1011)</pre></div>' +
                '<div><strong>출력</strong><pre>3</pre></div></div></div>',
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
            templates: {
                python: 'class Solution:\n    def hammingWeight(self, n: int) -> int:\n        # 방법 1: n & (n-1) 트릭\n        count = 0\n        while n:\n            n &= (n - 1)  # 가장 낮은 1 비트 제거\n            count += 1\n        return count\n\n    # 방법 2: 간단한 방법\n    # def hammingWeight(self, n: int) -> int:\n    #     return bin(n).count(\'1\')',
                cpp: 'class Solution {\npublic:\n    int hammingWeight(int n) {\n        int count = 0;\n        while (n) {\n            n &= (n - 1);  // 가장 낮은 1 비트 제거\n            count++;\n        }\n        return count;\n    }\n};',
                java: 'class Solution {\n    public int hammingWeight(int n) {\n        int count = 0;\n        while (n != 0) {\n            n &= (n - 1);  // 가장 낮은 1 비트 제거\n            count++;\n        }\n        return count;\n    }\n}'
            },
            solutions: [{
                approach: 'n & (n-1) 트릭',
                description: 'n & (n-1)로 가장 낮은 1 비트를 하나씩 제거하며 카운트합니다.',
                timeComplexity: 'O(k) (k = 1 비트 개수)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '초기화', code: 'count = 0' },
                        { title: 'n & (n-1) 반복', code: 'while n:\n    n &= (n - 1)  # 가장 낮은 1 비트 제거\n    count += 1' },
                        { title: '결과 반환', code: 'return count' }
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
            descriptionHTML: '<h3>문제</h3>' +
                '<p>비어 있지 않은 정수 배열 <code>nums</code>가 주어집니다. ' +
                '모든 원소가 <strong>정확히 2번</strong> 나타나고, <strong>딱 하나만 1번</strong> 나타납니다. ' +
                '그 하나의 원소를 찾으세요.</p>' +
                '<p>시간 복잡도 O(n), 공간 복잡도 O(1)로 풀어야 합니다.</p>' +
                '<div class="problem-io">' +
                '<div><h4>입력</h4><p>정수 배열 nums (1 &le; len &le; 30,000)</p></div>' +
                '<div><h4>출력</h4><p>1번만 나타나는 원소</p></div></div>' +
                '<div class="problem-example"><h4>예제</h4><div class="example-grid">' +
                '<div><strong>입력</strong><pre>[2, 2, 1]</pre></div>' +
                '<div><strong>출력</strong><pre>1</pre></div></div></div>',
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
            templates: {
                python: 'class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        result = 0\n        for n in nums:\n            result ^= n  # 같은 수끼리 상쇄 → 혼자인 수만 남음\n        return result\n\n    # 한 줄 풀이:\n    # from functools import reduce\n    # def singleNumber(self, nums): return reduce(lambda a,b: a^b, nums)',
                cpp: 'class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int result = 0;\n        for (int n : nums) {\n            result ^= n;  // 같은 수끼리 상쇄\n        }\n        return result;\n    }\n};',
                java: 'class Solution {\n    public int singleNumber(int[] nums) {\n        int result = 0;\n        for (int n : nums) {\n            result ^= n;  // 같은 수끼리 상쇄\n        }\n        return result;\n    }\n}'
            },
            solutions: [{
                approach: 'XOR 전체 순회',
                description: '모든 원소를 XOR하면 짝이 있는 수는 상쇄되고 유일한 수만 남습니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '초기화', code: 'result = 0' },
                        { title: '전체 XOR', code: 'for n in nums:\n    result ^= n  # 같은 수끼리 상쇄' },
                        { title: '결과 반환', code: 'return result' }
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
            descriptionHTML: '<h3>문제</h3>' +
                '<p>비어있는 공집합 S가 주어졌을 때, 아래 연산을 수행하세요.</p>' +
                '<ul style="margin:8px 0 8px 20px;">' +
                '<li><code>add x</code>: S에 x를 추가 (1 &le; x &le; 20)</li>' +
                '<li><code>remove x</code>: S에서 x를 제거</li>' +
                '<li><code>check x</code>: S에 x가 있으면 1, 없으면 0 출력</li>' +
                '<li><code>toggle x</code>: S에 x가 있으면 제거, 없으면 추가</li>' +
                '<li><code>all</code>: S = {1, 2, ..., 20}</li>' +
                '<li><code>empty</code>: S = 공집합</li></ul>' +
                '<div class="problem-io">' +
                '<div><h4>입력</h4><p>연산의 수 M (1 &le; M &le; 3,000,000)</p></div>' +
                '<div><h4>출력</h4><p>check 연산의 결과를 한 줄에 하나씩 출력</p></div></div>' +
                '<div class="problem-example"><h4>예제</h4><div class="example-grid">' +
                '<div><strong>입력</strong><pre>26\nadd 1\nadd 2\ncheck 1\ncheck 2\nremove 2\ncheck 1\ncheck 2\ntoggle 3\ncheck 1\ncheck 2\ncheck 3\ncheck 4\nall\ncheck 10\ncheck 20\ntoggle 10\nremove 20\ncheck 10\ncheck 20\nempty\ncheck 1\ntoggle 3\ncheck 3\ncheck 4\nall\ncheck 20</pre></div>' +
                '<div><strong>출력</strong><pre>1\n1\n1\n0\n1\n0\n1\n0\n1\n1\n0\n0\n0\n1\n0\n1</pre></div></div></div>',
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
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nM = int(input())\nS = 0\nout = []\n\nfor _ in range(M):\n    line = input().split()\n    cmd = line[0]\n\n    if cmd == \'add\':\n        x = int(line[1])\n        S |= (1 << x)\n    elif cmd == \'remove\':\n        x = int(line[1])\n        S &= ~(1 << x)\n    elif cmd == \'check\':\n        x = int(line[1])\n        out.append(\'1\' if (S >> x) & 1 else \'0\')\n    elif cmd == \'toggle\':\n        x = int(line[1])\n        S ^= (1 << x)\n    elif cmd == \'all\':\n        S = (1 << 21) - 1\n    elif cmd == \'empty\':\n        S = 0\n\nprint(\'\\n\'.join(out))',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int M;\n    cin >> M;\n    int S = 0;\n\n    while (M--) {\n        string cmd;\n        cin >> cmd;\n\n        if (cmd == "add") {\n            int x; cin >> x;\n            S |= (1 << x);\n        } else if (cmd == "remove") {\n            int x; cin >> x;\n            S &= ~(1 << x);\n        } else if (cmd == "check") {\n            int x; cin >> x;\n            cout << ((S >> x) & 1) << \'\\n\';\n        } else if (cmd == "toggle") {\n            int x; cin >> x;\n            S ^= (1 << x);\n        } else if (cmd == "all") {\n            S = (1 << 21) - 1;\n        } else { // empty\n            S = 0;\n        }\n    }\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        int M = Integer.parseInt(br.readLine().trim());\n        int S = 0;\n\n        while (M-- > 0) {\n            String[] line = br.readLine().split(" ");\n            String cmd = line[0];\n\n            if (cmd.equals("add")) {\n                int x = Integer.parseInt(line[1]);\n                S |= (1 << x);\n            } else if (cmd.equals("remove")) {\n                int x = Integer.parseInt(line[1]);\n                S &= ~(1 << x);\n            } else if (cmd.equals("check")) {\n                int x = Integer.parseInt(line[1]);\n                sb.append((S >> x) & 1).append(\'\\n\');\n            } else if (cmd.equals("toggle")) {\n                int x = Integer.parseInt(line[1]);\n                S ^= (1 << x);\n            } else if (cmd.equals("all")) {\n                S = (1 << 21) - 1;\n            } else { // empty\n                S = 0;\n            }\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '비트마스크 집합 연산',
                description: '정수 하나의 비트로 집합을 표현하여 각 연산을 O(1)로 처리합니다.',
                timeComplexity: 'O(M)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기화', code: 'import sys\ninput = sys.stdin.readline\n\nM = int(input())\nS = 0\nout = []' },
                        { title: '연산 처리', code: 'for _ in range(M):\n    line = input().split()\n    cmd = line[0]\n    if cmd == \'add\':     S |= (1 << int(line[1]))\n    elif cmd == \'remove\': S &= ~(1 << int(line[1]))\n    elif cmd == \'check\':  out.append(str((S >> int(line[1])) & 1))\n    elif cmd == \'toggle\': S ^= (1 << int(line[1]))\n    elif cmd == \'all\':    S = (1 << 21) - 1\n    elif cmd == \'empty\':  S = 0' },
                        { title: '출력', code: 'print(\'\\n\'.join(out))' }
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
            descriptionHTML: '<h3>문제</h3>' +
                '<p>중복이 없는 정수 배열 <code>nums</code>가 주어집니다. ' +
                '모든 가능한 <strong>부분집합(power set)</strong>을 반환하세요.</p>' +
                '<p>결과에 중복된 부분집합이 없어야 합니다.</p>' +
                '<div class="problem-io">' +
                '<div><h4>입력</h4><p>정수 배열 nums (1 &le; len &le; 10)</p></div>' +
                '<div><h4>출력</h4><p>모든 부분집합의 리스트</p></div></div>' +
                '<div class="problem-example"><h4>예제</h4><div class="example-grid">' +
                '<div><strong>입력</strong><pre>[1, 2, 3]</pre></div>' +
                '<div><strong>출력</strong><pre>[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]</pre></div></div></div>',
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
            templates: {
                python: 'class Solution:\n    def subsets(self, nums: list[int]) -> list[list[int]]:\n        n = len(nums)\n        result = []\n\n        for mask in range(1 << n):  # 0 ~ 2^n - 1\n            subset = []\n            for j in range(n):\n                if mask & (1 << j):  # j번째 비트가 1이면 선택\n                    subset.append(nums[j])\n            result.append(subset)\n\n        return result\n\n    # 백트래킹 풀이 (비교용):\n    # def subsets(self, nums):\n    #     res = []\n    #     def bt(start, curr):\n    #         res.append(curr[:])\n    #         for i in range(start, len(nums)):\n    #             curr.append(nums[i])\n    #             bt(i + 1, curr)\n    #             curr.pop()\n    #     bt(0, [])\n    #     return res',
                cpp: 'class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        int n = nums.size();\n        vector<vector<int>> result;\n\n        for (int mask = 0; mask < (1 << n); mask++) {\n            vector<int> subset;\n            for (int j = 0; j < n; j++) {\n                if (mask & (1 << j)) {\n                    subset.push_back(nums[j]);\n                }\n            }\n            result.push_back(subset);\n        }\n\n        return result;\n    }\n};',
                java: 'class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        int n = nums.length;\n        List<List<Integer>> result = new ArrayList<>();\n\n        for (int mask = 0; mask < (1 << n); mask++) {\n            List<Integer> subset = new ArrayList<>();\n            for (int j = 0; j < n; j++) {\n                if ((mask & (1 << j)) != 0) {\n                    subset.add(nums[j]);\n                }\n            }\n            result.add(subset);\n        }\n\n        return result;\n    }\n}'
            },
            solutions: [{
                approach: '비트마스크 부분집합 열거',
                description: '0 ~ 2^n-1까지 순회하며 각 비트에 대응하는 원소를 선택합니다.',
                timeComplexity: 'O(n * 2^n)',
                spaceComplexity: 'O(n * 2^n)',
                codeSteps: {
                    python: [
                        { title: '초기화', code: 'n = len(nums)\nresult = []' },
                        { title: '마스크 순회', code: 'for mask in range(1 << n):  # 0 ~ 2^n - 1\n    subset = []\n    for j in range(n):\n        if mask & (1 << j):  # j번째 비트가 1이면 선택\n            subset.append(nums[j])\n    result.append(subset)' },
                        { title: '결과 반환', code: 'return result' }
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
