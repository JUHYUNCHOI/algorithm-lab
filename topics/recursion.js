// Recursion Topic Module
const recursionTopic = {
    id: 'recursion',
    title: '재귀 함수',
    icon: '🔄',
    category: '탐색 (Silver)',
    order: 6,
    description: '자기 자신을 호출하여 문제를 쪼개는 기법',
    relatedNote: '재귀는 트리 순회, 백트래킹, 분할정복, DP(메모이제이션) 등 거의 모든 알고리즘의 기반이 됩니다.',

    sidebarExpandable: true,
    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-27433': { type: '기본 재귀', color: 'var(--accent)', vizMethod: '_renderVizFactorialSim' },
        'boj-10870': { type: '기본 재귀', color: 'var(--green)', vizMethod: '_renderVizFibSim' },
        'boj-25501': { type: '재귀 추적', color: '#e17055', vizMethod: '_renderVizPalindromeSim' },
        'boj-24060': { type: '분할 정복', color: '#6c5ce7', vizMethod: '_renderVizMergeSim' },
        'boj-4779':  { type: '프랙탈', color: '#fdcb6e', vizMethod: '_renderVizCantorSim' },
        'boj-2447':  { type: '프랙탈', color: '#fdcb6e', vizMethod: '_renderVizStarSim' },
        'boj-11729': { type: '하노이 탑', color: '#00b894', vizMethod: '_renderVizHanoiSim' }
    },

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>재귀 함수 (Recursion)</h2>
                <p class="hero-sub">함수가 자기 자신을 다시 불러서 문제를 점점 작게 쪼개는 방법</p>
            </div>

            <!-- ① 재귀란 무엇인가? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 재귀란 무엇인가?</div>
                <div class="analogy-box matryoshka-section">
                    러시아 인형(마트료시카) 본 적 있나요? 큰 인형을 열면 안에 작은 인형이 들어 있어요!

                    <div class="matryoshka-container">
                        <div class="matryoshka-dolls" id="matryoshka-dolls">
                            <div class="doll-wrapper" data-doll="0">
                                <div class="doll" style="--doll-size:90px;--doll-color:var(--accent);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(5)</div>
                                    <div class="doll-value">5 × ?</div>
                                </div>
                                <div class="doll-arrow">→</div>
                            </div>
                            <div class="doll-wrapper hidden" data-doll="1">
                                <div class="doll" style="--doll-size:76px;--doll-color:var(--blue);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(4)</div>
                                    <div class="doll-value">4 × ?</div>
                                </div>
                                <div class="doll-arrow">→</div>
                            </div>
                            <div class="doll-wrapper hidden" data-doll="2">
                                <div class="doll" style="--doll-size:62px;--doll-color:var(--yellow-vivid);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(3)</div>
                                    <div class="doll-value">3 × ?</div>
                                </div>
                                <div class="doll-arrow">→</div>
                            </div>
                            <div class="doll-wrapper hidden" data-doll="3">
                                <div class="doll" style="--doll-size:50px;--doll-color:var(--red);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(2)</div>
                                    <div class="doll-value">2 × ?</div>
                                </div>
                                <div class="doll-arrow">→</div>
                            </div>
                            <div class="doll-wrapper hidden" data-doll="4">
                                <div class="doll base-case" style="--doll-size:40px;--doll-color:var(--green);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(1)</div>
                                    <div class="doll-value">= 1 ✓</div>
                                </div>
                            </div>
                        </div>
                        <div class="matryoshka-instruction" id="matryoshka-instruction">👆 인형을 클릭하여 열어보세요!</div>
                        <button class="matryoshka-reset hidden" id="matryoshka-reset">↺ 다시 보기</button>
                    </div>

                    <div class="matryoshka-text">
                        재귀도 똑같아요. <strong>함수가 자기 자신을 부르면서</strong> 문제를 점점 작게 만들다가, <strong>더 이상 작아질 수 없으면</strong> 멈춰요.
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">5! (5 팩토리얼)을 재귀로 표현하면?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <code>5! = 5 × 4!</code><br>
                        <code>4! = 4 × 3!</code><br>
                        <code>3! = 3 × 2!</code><br>
                        <code>2! = 2 × 1!</code><br>
                        <code>1! = 1</code> ← <strong>여기서 멈춤!</strong><br><br>
                        즉, <code>factorial(n) = n × factorial(n-1)</code>이고,<br>
                        <code>factorial(1) = 1</code>이 되면 더 이상 부르지 않습니다.
                    </div>
                </div>

                <div class="try-problem-link" style="margin-top:1.5rem;padding:1rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.3rem;">🎯</span>
                    <div>
                        <div style="font-weight:700;color:var(--text);margin-bottom:2px;">바로 풀어보기</div>
                        <div style="font-size:0.85rem;color:var(--text2);">팩토리얼 — 방금 배운 재귀를 직접 써보세요!</div>
                    </div>
                    <button onclick="if(window.selectProblem) window.selectProblem('recursion','boj-27433');" style="margin-left:auto;padding:8px 20px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem;">풀러 가기 →</button>
                </div>
            </div>

            <!-- ② 재귀의 두 가지 필수 요소 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 재귀에 꼭 필요한 두 가지</div>

                <!-- 데모 2: 멈추는 조건 비교 (데모 먼저!) -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 멈추는 조건이 있을 때 vs 없을 때</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <button class="concept-demo-btn" id="rec-demo-basecase-run">▶ 실행</button>
                        <button class="concept-demo-btn green" id="rec-demo-basecase-reset" style="display:none;">↺ 다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:220px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--green);">✅ 멈추는 조건 있음</div>
                                <div style="font-size:0.82rem;color:var(--text2);margin-bottom:6px;font-family:monospace;">if n &lt;= 1: return 1</div>
                                <div id="rec-demo-bc-good" style="display:flex;flex-direction:column;gap:4px;min-height:200px;"></div>
                                <div id="rec-demo-bc-good-msg" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>
                            </div>
                            <div style="flex:1;min-width:220px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--red);">❌ 멈추는 조건 없음</div>
                                <div style="font-size:0.82rem;color:var(--text2);margin-bottom:6px;font-family:monospace;">return n * factorial(n-1)</div>
                                <div id="rec-demo-bc-bad" style="display:flex;flex-direction:column;gap:4px;min-height:200px;"></div>
                                <div id="rec-demo-bc-bad-msg" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="rec-demo-basecase-msg">👆 "실행" 버튼을 눌러 factorial(5)를 두 가지 방식으로 비교해보세요!</div>
                </div>

                <p style="margin:1.2rem 0 0.8rem;line-height:1.75;">방금 봤죠? 멈추는 조건이 없으면 끝없이 돌아요. 재귀에는 <strong>🛑 멈추는 조건</strong>과 <strong>🔄 자기를 다시 부르기</strong>, 이 두 가지가 꼭 필요해요.</p>

                <div class="concept-grid">
                    <div class="concept-card">
                        <h3>🛑 멈추는 조건</h3>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">if n &lt;= 1:      # ← 여기서 멈춤!
    return 1</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">if (n &lt;= 1)      // ← 여기서 멈춤!
    return 1;</code></pre></div></span>
                    </div>
                    <div class="concept-card">
                        <h3>🔄 자기 자신 부르기</h3>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">return n * factorial(n - 1)  # ← 재귀!</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">return n * factorial(n - 1);  // ← 재귀!</code></pre></div></span>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">멈추는 조건 없이 factorial(5)를 부르면 어떻게 될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>끝없이 자기 자신을 부릅니다!</strong><br>
                        factorial(5) → factorial(4) → ... → factorial(0) → factorial(-1) → factorial(-2) → ...<br><br>
                        멈추라는 말이 없으니까 계속 가는 겁니다! 결국 컴퓨터가 "너무 많이 불렀어!" 하고 에러를 냅니다.<br>
                        그래서 멈추는 조건은 <strong>반드시</strong> 있어야 합니다.
                    </div>
                </div>

                <div class="try-problem-link" style="margin-top:1.5rem;padding:1rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.3rem;">🎯</span>
                    <div>
                        <div style="font-weight:700;color:var(--text);margin-bottom:2px;">바로 풀어보기</div>
                        <div style="font-size:0.85rem;color:var(--text2);">피보나치 수 — 멈추는 조건 두 개가 필요한 재귀!</div>
                    </div>
                    <button onclick="if(window.selectProblem) window.selectProblem('recursion','boj-10870');" style="margin-left:auto;padding:8px 20px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem;">풀러 가기 →</button>
                </div>
            </div>

            <!-- ③ 재귀의 동작 원리: 콜 스택 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 재귀는 어떻게 동작할까?</div>

                <!-- 데모 3: 콜 스택 시각화 (데모 먼저!) -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 콜 스택 쌓고 꺼내기</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-size:0.85rem;color:var(--text2);">n =</label>
                        <input type="number" id="rec-demo-cs-input" value="4" min="2" max="7" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="rec-demo-cs-step">▶ 다음 단계</button>
                        <button class="concept-demo-btn green" id="rec-demo-cs-reset">↺ 처음부터</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">
                            <div style="flex:0 0 180px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);text-align:center;">콜 스택</div>
                                <div id="rec-demo-cs-stack" style="display:flex;flex-direction:column;gap:4px;min-height:220px;border:2px dashed var(--border);border-radius:10px;padding:12px;justify-content:flex-end;transition:border-color 0.3s;"></div>
                            </div>
                            <div style="flex:1;min-width:200px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">실행 과정</div>
                                <div id="rec-demo-cs-log" style="font-family:monospace;font-size:0.85rem;line-height:1.8;color:var(--text2);min-height:220px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="rec-demo-cs-msg">👆 "다음 단계" 버튼을 눌러 factorial(4)의 콜 스택이 쌓이고 꺼내지는 과정을 관찰하세요!</div>
                </div>

                <p style="margin:1.2rem 0 0.8rem;line-height:1.75;">함수가 자기를 부를 때마다 <strong>접시처럼 쌓이고</strong>, 멈추는 조건에서부터 <strong>위에서 하나씩 꺼내며</strong> 답을 돌려줘요.</p>

                <div class="key-difference-box">
                    <div>📥 <strong>부르기</strong>: 큰 문제 → 작은 문제로 파고듭니다 (접시가 쌓입니다)</div>
                    <div>📤 <strong>돌려주기</strong>: 멈추는 조건부터 거꾸로 답을 돌려줍니다 (접시를 꺼냅니다)</div>
                    <div>💡 너무 많이 쌓이면? 컴퓨터가 감당을 못합니다! (<span class="lang-py">파이썬은 최대 1000번까지 — <code>sys.setrecursionlimit()</code>으로 늘릴 수 있습니다</span><span class="lang-cpp">C++은 스택 크기에 따라 수만~수십만 번까지 가능하지만, 그래도 넘치면 크래시!</span>)</div>
                    <div style="margin-top:8px;"><span class="lang-py"><a href="https://docs.python.org/3/library/sys.html#sys.setrecursionlimit" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: sys.setrecursionlimit() ↗</a></span></div>
                </div>

                <div class="try-problem-link" style="margin-top:1.5rem;padding:1rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.3rem;">🎯</span>
                    <div>
                        <div style="font-weight:700;color:var(--text);margin-bottom:2px;">바로 풀어보기</div>
                        <div style="font-size:0.85rem;color:var(--text2);">재귀의 귀재 — 콜 스택이 몇 번 쌓이는지 직접 세보세요!</div>
                    </div>
                    <button onclick="if(window.selectProblem) window.selectProblem('recursion','boj-25501');" style="margin-left:auto;padding:8px 20px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem;">풀러 가기 →</button>
                </div>
            </div>

            <!-- ④ 재귀 vs 반복문 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 재귀 vs 반복문</div>
                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔄 재귀 (Recursion)</h3>
                        <p class="approach-desc">자기 자신을 부르는 방법. 코드가 짧고 읽기 쉽습니다</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">def factorial(n):
    if n &lt;= 1:
        return 1
    return n * factorial(n - 1)</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">int factorial(int n) {
    if (n &lt;= 1)
        return 1;
    return n * factorial(n - 1);
}</code></pre></div></span>
                    </div>
                    <div class="approach-card">
                        <h3>🔁 반복문 (Iteration)</h3>
                        <p class="approach-desc">for/while 반복문 사용. 빠르지만 코드가 길어질 수 있습니다</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">int factorial(int n) {
    int result = 1;
    for (int i = 2; i &lt;= n; i++)
        result *= i;
    return result;
}</code></pre></div></span>
                    </div>
                </div>

                <!-- 데모 4: 재귀 vs 반복문 실행 비교 -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 재귀 vs 반복문 실행 과정 비교</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-size:0.85rem;color:var(--text2);">n =</label>
                        <input type="number" id="rec-demo-vs-input" value="5" min="2" max="8" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="rec-demo-vs-run">▶ 동시 실행</button>
                        <button class="concept-demo-btn green" id="rec-demo-vs-reset" style="display:none;">↺ 다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:220px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--accent);">🔄 재귀</div>
                                <div id="rec-demo-vs-rec" style="font-family:monospace;font-size:0.82rem;line-height:1.8;min-height:180px;"></div>
                                <div id="rec-demo-vs-rec-result" style="margin-top:8px;font-size:0.9rem;font-weight:600;color:var(--accent);min-height:1.5em;"></div>
                            </div>
                            <div style="width:1px;background:var(--border);"></div>
                            <div style="flex:1;min-width:220px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--green);">🔁 반복문</div>
                                <div id="rec-demo-vs-iter" style="font-family:monospace;font-size:0.82rem;line-height:1.8;min-height:180px;"></div>
                                <div id="rec-demo-vs-iter-result" style="margin-top:8px;font-size:0.9rem;font-weight:600;color:var(--green);min-height:1.5em;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="rec-demo-vs-msg">👆 "동시 실행"을 눌러 같은 계산을 재귀와 반복문이 어떻게 다르게 처리하는지 비교해보세요!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">팩토리얼은 반복문이 더 쉬운데, 재귀는 언제 유리할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        재귀가 빛나는 경우:<br>
                        <strong>1. 같은 모양이 반복되는 그림</strong> — 별 찍기, 칸토어 집합처럼 큰 것 안에 작은 것이 있는 패턴<br>
                        <strong>2. 반으로 쪼개는 문제</strong> — 정렬할 때 반씩 나누어 정리하기<br>
                        <strong>3. 하노이 탑</strong> — 반복문으로 짜면 매우 복잡하지만 재귀는 단 3줄!<br>
                        <strong>4. 미로 탐색</strong> — 갈림길에서 한 쪽을 먼저 끝까지 가보기<br><br>
                        정리: <strong>문제 안에 같은 종류의 작은 문제</strong>가 들어있으면 재귀를 쓰세요!
                    </div>
                </div>
            </div>

            <!-- ⑤ 재귀 문제 풀이 3단계 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 재귀 문제 푸는 3단계</div>
                <div class="step-cards">
                    <div class="step-card">
                        <span class="step-num">1</span>
                        <h4>언제 멈출지 정하기</h4>
                        <p>가장 쉬운 경우의 답을 바로 알려주기</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">2</span>
                        <h4>반복 규칙 찾기</h4>
                        <p>"큰 문제 = 작은 문제 + 작은 문제" 형태 만들기</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">3</span>
                        <h4>점점 작게 만들기</h4>
                        <p>부를 때마다 반드시 멈추는 조건에 가까워지기!</p>
                    </div>
                </div>

                <!-- 데모 5: 3단계 피보나치 트리 -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 피보나치 호출 트리 펼치기</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-size:0.85rem;color:var(--text2);">fib(</label>
                        <input type="number" id="rec-demo-fib-input" value="5" min="2" max="7" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        <label style="font-size:0.85rem;color:var(--text2);">)</label>
                        <button class="concept-demo-btn" id="rec-demo-fib-step">▶ 다음 단계</button>
                        <button class="concept-demo-btn green" id="rec-demo-fib-reset">↺ 처음부터</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">
                            <div style="flex:1;min-width:280px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">호출 트리</div>
                                <div id="rec-demo-fib-tree" style="overflow-x:auto;padding:12px 0;min-height:180px;"></div>
                            </div>
                            <div style="flex:0 0 200px;min-width:160px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">호출 횟수</div>
                                <div id="rec-demo-fib-counts" style="display:flex;flex-direction:column;gap:6px;"></div>
                                <div id="rec-demo-fib-total" style="margin-top:12px;font-size:0.9rem;font-weight:600;color:var(--accent);"></div>
                                <div id="rec-demo-fib-dup" style="margin-top:6px;font-size:0.85rem;color:var(--red);min-height:1.5em;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="rec-demo-fib-msg">👆 "다음 단계"를 눌러 fib(5)가 어떻게 쪼개지고, 같은 계산이 반복되는지 확인하세요! 이 중복이 DP로 해결됩니다.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">피보나치 수를 위 3단계로 정리해보세요.</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>1. 멈추는 조건:</strong> fib(0) = 0, fib(1) = 1<br>
                        <strong>2. 반복 규칙:</strong> fib(n) = fib(n-1) + fib(n-2)<br>
                        <strong>3. 점점 작게:</strong> n → n-1, n-2 (매번 줄어듦)<br><br>
                        이 패턴을 잘 기억하세요! 나중에 DP를 배울 때 그대로 쓰게 됩니다.
                    </div>
                </div>

                <div class="try-problem-link" style="margin-top:1.5rem;padding:1rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.3rem;">🎯</span>
                    <div>
                        <div style="font-weight:700;color:var(--text);margin-bottom:2px;">바로 풀어보기</div>
                        <div style="font-size:0.85rem;color:var(--text2);">병합 정렬 — 재귀로 반씩 쪼개서 정렬하는 문제!</div>
                    </div>
                    <button onclick="if(window.selectProblem) window.selectProblem('recursion','boj-24060');" style="margin-left:auto;padding:8px 20px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem;">풀러 가기 →</button>
                </div>
            </div>
        `;

        // 인터랙티브 요소 초기화
        this._initConceptInteractions(container);
    },

    _initConceptInteractions(container) {
        // Think-box 토글
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                box.classList.toggle('revealed');
            });
        });

        // ============================
        // 데모 1: 마트료시카 인형 인터랙션
        // ============================
        const dollContainer = container.querySelector('#matryoshka-dolls');
        const instructionEl = container.querySelector('#matryoshka-instruction');
        const resetBtn = container.querySelector('#matryoshka-reset');

        if (dollContainer) {
            const wrappers = dollContainer.querySelectorAll('.doll-wrapper');
            const factValues = [120, 24, 6, 2, 1];
            let currentDoll = 0;
            let phase = 'open';
            let returnIdx = 4;

            const advance = () => {
                if (phase === 'open' && currentDoll < wrappers.length - 1) {
                    wrappers[currentDoll].classList.add('opening');
                    setTimeout(() => {
                        wrappers[currentDoll].classList.remove('opening');
                        wrappers[currentDoll].classList.add('opened');
                        currentDoll++;
                        wrappers[currentDoll].classList.remove('hidden');
                        if (currentDoll === wrappers.length - 1) {
                            phase = 'return';
                            returnIdx = wrappers.length - 1;
                            instructionEl.textContent = '🎯 멈추는 조건 도달! 클릭하여 값을 되돌려 보세요';
                            instructionEl.classList.add('phase-return');
                        } else {
                            instructionEl.textContent = '👆 계속 클릭하여 다음 인형을 열어보세요';
                        }
                    }, 350);
                } else if (phase === 'return') {
                    const w = wrappers[returnIdx];
                    const valueEl = w.querySelector('.doll-value');
                    w.classList.remove('opened');
                    w.classList.add('returned');
                    valueEl.textContent = '= ' + factValues[returnIdx];
                    returnIdx--;
                    if (returnIdx < 0) {
                        instructionEl.textContent = '✅ 완료! factorial(5) = 120';
                        resetBtn.classList.remove('hidden');
                        phase = 'done';
                    } else {
                        instructionEl.textContent = '📤 값이 반환되었습니다. 계속 클릭!';
                    }
                }
            };

            dollContainer.addEventListener('click', () => {
                if (phase !== 'done') advance();
            });

            resetBtn.addEventListener('click', () => {
                const labels = [5, 4, 3, 2, 1];
                wrappers.forEach((w, i) => {
                    w.classList.remove('opening', 'opened', 'returned');
                    if (i > 0) w.classList.add('hidden');
                    const v = w.querySelector('.doll-value');
                    v.textContent = labels[i] === 1 ? '= 1 ✓' : labels[i] + ' × ?';
                });
                currentDoll = 0;
                phase = 'open';
                returnIdx = 4;
                instructionEl.textContent = '👆 인형을 클릭하여 열어보세요!';
                instructionEl.classList.remove('phase-return');
                resetBtn.classList.add('hidden');
            });
        }

        // ============================
        // 데모 2: 멈추는 조건 비교
        // ============================
        (function() {
            var bcRunBtn = container.querySelector('#rec-demo-basecase-run');
            var bcResetBtn = container.querySelector('#rec-demo-basecase-reset');
            var bcGoodEl = container.querySelector('#rec-demo-bc-good');
            var bcBadEl = container.querySelector('#rec-demo-bc-bad');
            var bcGoodMsg = container.querySelector('#rec-demo-bc-good-msg');
            var bcBadMsg = container.querySelector('#rec-demo-bc-bad-msg');
            var bcMsg = container.querySelector('#rec-demo-basecase-msg');
            if (!bcRunBtn) return;

            var bcTimers = [];

            function bcReset() {
                bcTimers.forEach(function(t) { clearTimeout(t); });
                bcTimers = [];
                bcGoodEl.innerHTML = '';
                bcBadEl.innerHTML = '';
                bcGoodMsg.textContent = '';
                bcBadMsg.textContent = '';
                bcRunBtn.style.display = '';
                bcResetBtn.style.display = 'none';
                bcMsg.textContent = '👆 "실행" 버튼을 눌러 factorial(5)를 두 가지 방식으로 비교해보세요!';
            }

            function makeFrame(text, color, glow) {
                var el = document.createElement('div');
                el.style.cssText = 'padding:6px 12px;border-radius:8px;font-family:monospace;font-size:0.82rem;' +
                    'border:2px solid ' + color + ';background:' + color + '15;color:var(--text);' +
                    'opacity:0;transform:translateX(-10px);transition:all 0.3s ease;';
                el.textContent = text;
                if (glow) el.style.boxShadow = '0 0 8px ' + color + '40';
                setTimeout(function() { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, 30);
                return el;
            }

            bcRunBtn.addEventListener('click', function() {
                bcRunBtn.style.display = 'none';
                bcResetBtn.style.display = '';
                bcMsg.textContent = '두 방식을 비교해보세요...';

                // 좋은 쪽: 멈추는 조건 있음 — factorial(5)→...→factorial(1) 멈춤
                var goodCalls = [
                    { text: 'factorial(5) 호출', delay: 0 },
                    { text: '  → factorial(4) 호출', delay: 400 },
                    { text: '    → factorial(3) 호출', delay: 800 },
                    { text: '      → factorial(2) 호출', delay: 1200 },
                    { text: '        → factorial(1) 호출', delay: 1600 },
                    { text: '        ✅ n<=1! return 1', delay: 2000, color: 'var(--green)', glow: true },
                    { text: '      ← return 2 × 1 = 2', delay: 2400, color: 'var(--green)' },
                    { text: '    ← return 3 × 2 = 6', delay: 2800, color: 'var(--green)' },
                    { text: '  ← return 4 × 6 = 24', delay: 3200, color: 'var(--green)' },
                    { text: '← return 5 × 24 = 120', delay: 3600, color: 'var(--green)', glow: true }
                ];

                goodCalls.forEach(function(c) {
                    var t = setTimeout(function() {
                        bcGoodEl.appendChild(makeFrame(c.text, c.color || 'var(--accent)', c.glow));
                        if (c.text.indexOf('120') !== -1) {
                            bcGoodMsg.textContent = '결과: 120 (정상 종료!)';
                            bcGoodMsg.style.color = 'var(--green)';
                        }
                    }, c.delay);
                    bcTimers.push(t);
                });

                // 나쁜 쪽: 멈추는 조건 없음 — 끝없이 호출
                var badCalls = [
                    { text: 'factorial(5) 호출', delay: 0 },
                    { text: '  → factorial(4) 호출', delay: 400 },
                    { text: '    → factorial(3) 호출', delay: 800 },
                    { text: '      → factorial(2) 호출', delay: 1200 },
                    { text: '        → factorial(1) 호출', delay: 1600 },
                    { text: '          → factorial(0) 호출', delay: 2000 },
                    { text: '            → factorial(-1) 호출', delay: 2400 },
                    { text: '              → factorial(-2) 호출', delay: 2800 },
                    { text: '                → factorial(-3)...', delay: 3200 },
                    { text: '💥 RecursionError! 스택 터짐!', delay: 3600, color: 'var(--red)', glow: true }
                ];

                badCalls.forEach(function(c) {
                    var t = setTimeout(function() {
                        bcBadEl.appendChild(makeFrame(c.text, c.color || 'var(--red)', c.glow));
                        if (c.text.indexOf('RecursionError') !== -1) {
                            bcBadMsg.textContent = '💥 멈추지 않아서 스택 오버플로!';
                            bcBadMsg.style.color = 'var(--red)';
                            bcMsg.textContent = '왼쪽은 멈추는 조건(n<=1)에서 깔끔하게 끝나지만, 오른쪽은 끝없이 호출하다가 터집니다!';
                        }
                    }, c.delay);
                    bcTimers.push(t);
                });
            });

            bcResetBtn.addEventListener('click', bcReset);
        })();

        // ============================
        // 데모 3: 콜 스택 시각화
        // ============================
        (function() {
            var csStepBtn = container.querySelector('#rec-demo-cs-step');
            var csResetBtn = container.querySelector('#rec-demo-cs-reset');
            var csInput = container.querySelector('#rec-demo-cs-input');
            var csStack = container.querySelector('#rec-demo-cs-stack');
            var csLog = container.querySelector('#rec-demo-cs-log');
            var csMsg = container.querySelector('#rec-demo-cs-msg');
            if (!csStepBtn) return;

            var csState = { steps: [], idx: -1 };

            function csBuild(n) {
                csStack.innerHTML = '';
                csLog.innerHTML = '';
                csState.idx = -1;

                var fact = [1];
                for (var i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;

                var steps = [];
                // 쌓는 단계: factorial(n)→...→factorial(1)
                for (var k = n; k >= 1; k--) {
                    (function(ci, fv) {
                        steps.push({
                            phase: 'push',
                            desc: ci === 1
                                ? 'factorial(1) 호출 — 멈추는 조건! return 1'
                                : 'factorial(' + ci + ') 호출 — ' + ci + ' × factorial(' + (ci - 1) + ')이 필요하니 더 들어감',
                            run: function() {
                                var frame = document.createElement('div');
                                frame.style.cssText = 'padding:8px 14px;border-radius:8px;font-family:monospace;font-size:0.82rem;' +
                                    'border:2px solid ' + (ci === 1 ? 'var(--green)' : 'var(--accent)') + ';' +
                                    'background:' + (ci === 1 ? 'var(--green)' : 'var(--accent)') + '12;color:var(--text);' +
                                    'text-align:center;animation:fadeSlideUp 0.3s ease;';
                                frame.textContent = ci === 1 ? 'factorial(1) = 1 ✓' : 'factorial(' + ci + ') = ' + ci + ' × ?';
                                frame.dataset.ci = ci;
                                csStack.prepend(frame);
                                var line = document.createElement('div');
                                line.style.cssText = 'color:var(--accent);';
                                line.textContent = '\u00A0\u00A0'.repeat(n - ci) + '→ factorial(' + ci + ') 호출';
                                csLog.appendChild(line);
                            }
                        });
                    })(k, fact);
                }
                // 꺼내는 단계: factorial(1)→...→factorial(n)
                for (var k = 1; k <= n; k++) {
                    (function(ci, fv) {
                        steps.push({
                            phase: 'pop',
                            desc: ci === 1
                                ? 'factorial(1) = 1 반환 (멈추는 조건)'
                                : 'factorial(' + ci + ') = ' + ci + ' × ' + fv[ci - 1] + ' = ' + fv[ci] + ' 반환 — 접시 꺼냄!',
                            run: function() {
                                var top = csStack.firstChild;
                                if (top) {
                                    top.textContent = 'factorial(' + ci + ') = ' + fv[ci] + ' ✓';
                                    top.style.borderColor = 'var(--green)';
                                    top.style.background = 'var(--green)15';
                                    top.style.boxShadow = '0 0 8px var(--green)40';
                                    setTimeout(function() {
                                        top.style.opacity = '0';
                                        top.style.transform = 'translateX(20px)';
                                        top.style.transition = 'all 0.3s ease';
                                        setTimeout(function() { top.remove(); }, 300);
                                    }, 500);
                                }
                                var line = document.createElement('div');
                                line.style.cssText = 'color:var(--green);';
                                line.textContent = '\u00A0\u00A0'.repeat(n - ci) + '← factorial(' + ci + ') = ' + fv[ci];
                                csLog.appendChild(line);
                            }
                        });
                    })(k, fact);
                }
                // 완료
                steps.push({
                    phase: 'done',
                    desc: '완료! factorial(' + n + ') = ' + fact[n],
                    run: function() {}
                });

                csState.steps = steps;
                csMsg.textContent = '👆 "다음 단계" 버튼을 눌러 factorial(' + n + ')의 콜 스택을 관찰하세요!';
            }

            csStepBtn.addEventListener('click', function() {
                if (csState.idx >= csState.steps.length - 1) return;
                csState.idx++;
                var s = csState.steps[csState.idx];
                csMsg.textContent = s.desc;
                setTimeout(function() { s.run(); }, 200);
                if (csState.idx >= csState.steps.length - 1) {
                    csStepBtn.disabled = true;
                }
            });

            csResetBtn.addEventListener('click', function() {
                csStepBtn.disabled = false;
                var n = parseInt(csInput.value) || 4;
                if (n < 2) n = 2;
                if (n > 7) n = 7;
                csBuild(n);
            });

            csInput.addEventListener('change', function() {
                csStepBtn.disabled = false;
                var n = parseInt(csInput.value) || 4;
                if (n < 2) n = 2;
                if (n > 7) n = 7;
                csBuild(n);
            });

            csBuild(4);
        })();

        // ============================
        // 데모 4: 재귀 vs 반복문
        // ============================
        (function() {
            var vsRunBtn = container.querySelector('#rec-demo-vs-run');
            var vsResetBtn = container.querySelector('#rec-demo-vs-reset');
            var vsInput = container.querySelector('#rec-demo-vs-input');
            var vsRecEl = container.querySelector('#rec-demo-vs-rec');
            var vsIterEl = container.querySelector('#rec-demo-vs-iter');
            var vsRecResult = container.querySelector('#rec-demo-vs-rec-result');
            var vsIterResult = container.querySelector('#rec-demo-vs-iter-result');
            var vsMsg = container.querySelector('#rec-demo-vs-msg');
            if (!vsRunBtn) return;

            var vsTimers = [];

            function vsReset() {
                vsTimers.forEach(function(t) { clearTimeout(t); });
                vsTimers = [];
                vsRecEl.innerHTML = '';
                vsIterEl.innerHTML = '';
                vsRecResult.textContent = '';
                vsIterResult.textContent = '';
                vsRunBtn.style.display = '';
                vsResetBtn.style.display = 'none';
                vsMsg.textContent = '👆 "동시 실행"을 눌러 같은 계산을 재귀와 반복문이 어떻게 다르게 처리하는지 비교해보세요!';
            }

            function addLine(parent, text, color, delay) {
                var t = setTimeout(function() {
                    var el = document.createElement('div');
                    el.style.cssText = 'opacity:0;transform:translateX(-8px);transition:all 0.25s ease;color:' + (color || 'var(--text2)') + ';';
                    el.textContent = text;
                    parent.appendChild(el);
                    setTimeout(function() { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, 30);
                }, delay);
                vsTimers.push(t);
            }

            vsRunBtn.addEventListener('click', function() {
                var n = parseInt(vsInput.value) || 5;
                if (n < 2) n = 2;
                if (n > 8) n = 8;
                vsRunBtn.style.display = 'none';
                vsResetBtn.style.display = '';
                vsMsg.textContent = '실행 중... 두 방식을 비교해보세요!';

                // 재귀 쪽: 호출 스택 깊이로 들어갔다가 돌아옴
                var fact = [1];
                for (var i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
                var delay = 0;
                var step = 350;
                // 호출 단계
                for (var i = n; i >= 1; i--) {
                    var indent = '\u00A0\u00A0'.repeat(n - i);
                    if (i === 1) {
                        addLine(vsRecEl, indent + '→ factorial(1) → 멈춤! return 1', 'var(--green)', delay);
                    } else {
                        addLine(vsRecEl, indent + '→ factorial(' + i + ') 호출', 'var(--accent)', delay);
                    }
                    delay += step;
                }
                // 반환 단계
                for (var i = 1; i <= n; i++) {
                    var indent = '\u00A0\u00A0'.repeat(n - i);
                    addLine(vsRecEl, indent + '← factorial(' + i + ') = ' + fact[i], 'var(--green)', delay);
                    delay += step;
                }
                var recDone = delay;
                var t1 = setTimeout(function() {
                    vsRecResult.textContent = '결과: ' + fact[n] + ' (스택 깊이: ' + n + ')';
                }, recDone);
                vsTimers.push(t1);

                // 반복문 쪽: 단순 곱셈 반복
                var iterDelay = 0;
                addLine(vsIterEl, 'result = 1', 'var(--text2)', iterDelay);
                iterDelay += step;
                var result = 1;
                for (var i = 2; i <= n; i++) {
                    result *= i;
                    addLine(vsIterEl, 'i=' + i + ': result = result × ' + i + ' = ' + result, 'var(--green)', iterDelay);
                    iterDelay += step;
                }
                var iterDone = iterDelay;
                var t2 = setTimeout(function() {
                    vsIterResult.textContent = '결과: ' + result + ' (스택 깊이: 0)';
                }, iterDone);
                vsTimers.push(t2);

                var maxDone = Math.max(recDone, iterDone) + 200;
                var t3 = setTimeout(function() {
                    vsMsg.textContent = '재귀는 스택을 ' + n + '단 쌓지만, 반복문은 스택 없이 변수 하나로 계산합니다. 팩토리얼처럼 단순한 문제는 반복문이 효율적!';
                }, maxDone);
                vsTimers.push(t3);
            });

            vsResetBtn.addEventListener('click', vsReset);
        })();

        // ============================
        // 데모 5: 3단계 피보나치 트리
        // ============================
        (function() {
            var fibStepBtn = container.querySelector('#rec-demo-fib-step');
            var fibResetBtn = container.querySelector('#rec-demo-fib-reset');
            var fibInput = container.querySelector('#rec-demo-fib-input');
            var fibTree = container.querySelector('#rec-demo-fib-tree');
            var fibCounts = container.querySelector('#rec-demo-fib-counts');
            var fibTotal = container.querySelector('#rec-demo-fib-total');
            var fibDup = container.querySelector('#rec-demo-fib-dup');
            var fibMsg = container.querySelector('#rec-demo-fib-msg');
            if (!fibStepBtn) return;

            var fibState = { steps: [], idx: -1, nodeEls: {}, countEls: {}, counts: {}, totalCount: 0 };

            function fibBuild(n) {
                fibTree.innerHTML = '';
                fibCounts.innerHTML = '';
                fibTotal.textContent = '';
                fibDup.textContent = '';
                fibState.idx = -1;
                fibState.nodeEls = {};
                fibState.countEls = {};
                fibState.counts = {};
                fibState.totalCount = 0;

                // 호출 카운터 UI
                for (var i = 0; i <= n; i++) {
                    fibState.counts[i] = 0;
                    var row = document.createElement('div');
                    row.style.cssText = 'display:flex;align-items:center;gap:8px;';
                    row.innerHTML = '<span style="font-family:monospace;font-size:0.82rem;min-width:50px;">fib(' + i + ')</span>' +
                        '<div style="flex:1;height:16px;background:var(--bg2);border-radius:4px;overflow:hidden;">' +
                        '<div id="rec-demo-fib-bar-' + i + '" style="height:100%;width:0%;background:var(--accent);border-radius:4px;transition:width 0.3s;"></div></div>' +
                        '<span id="rec-demo-fib-cnt-' + i + '" style="font-family:monospace;font-size:0.82rem;min-width:20px;text-align:right;">0</span>';
                    fibCounts.appendChild(row);
                    fibState.countEls[i] = {
                        bar: row.querySelector('#rec-demo-fib-bar-' + i),
                        cnt: row.querySelector('#rec-demo-fib-cnt-' + i)
                    };
                }

                // 트리를 SVG로 생성 — 노드 위치를 먼저 계산
                var nodes = [];
                var edges = [];
                var nodeId = 0;

                function layoutTree(val, depth, xCenter, xSpan) {
                    var id = nodeId++;
                    nodes.push({ id: id, val: val, x: xCenter, y: depth * 60 + 30, depth: depth });
                    if (val <= 1) return id;
                    var leftId = layoutTree(val - 1, depth + 1, xCenter - xSpan / 2, xSpan / 2);
                    edges.push({ from: id, to: leftId });
                    var rightId = layoutTree(val - 2, depth + 1, xCenter + xSpan / 2, xSpan / 2);
                    edges.push({ from: id, to: rightId });
                    return id;
                }

                var totalWidth = Math.max(400, Math.pow(2, n) * 40);
                var totalHeight = (n + 1) * 60 + 20;
                layoutTree(n, 0, totalWidth / 2, totalWidth / 3);

                var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', totalWidth);
                svg.setAttribute('height', totalHeight);
                svg.style.cssText = 'display:block;margin:0 auto;';

                // 엣지 그리기 (처음에는 숨김)
                edges.forEach(function(e) {
                    var fromNode = nodes[e.from];
                    var toNode = nodes[e.to];
                    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', fromNode.x);
                    line.setAttribute('y1', fromNode.y + 14);
                    line.setAttribute('x2', toNode.x);
                    line.setAttribute('y2', toNode.y - 14);
                    line.setAttribute('stroke', 'var(--border)');
                    line.setAttribute('stroke-width', '2');
                    line.style.opacity = '0';
                    line.dataset.from = e.from;
                    line.dataset.to = e.to;
                    svg.appendChild(line);
                });

                // 노드 그리기 (처음에는 숨김)
                nodes.forEach(function(nd) {
                    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    g.style.opacity = '0';
                    g.style.transition = 'opacity 0.3s ease';

                    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', nd.x);
                    circle.setAttribute('cy', nd.y);
                    circle.setAttribute('r', 16);
                    circle.setAttribute('fill', 'var(--bg2)');
                    circle.setAttribute('stroke', 'var(--border)');
                    circle.setAttribute('stroke-width', '2');
                    g.appendChild(circle);

                    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', nd.x);
                    text.setAttribute('y', nd.y + 4);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-size', '11');
                    text.setAttribute('font-family', 'monospace');
                    text.setAttribute('fill', 'var(--text)');
                    text.textContent = 'f(' + nd.val + ')';
                    g.appendChild(text);

                    svg.appendChild(g);
                    fibState.nodeEls[nd.id] = { g: g, circle: circle, text: text };
                });

                fibTree.appendChild(svg);

                // 스텝 생성: DFS 순서로 노드를 보여줌
                var steps = [];
                function buildSteps(nodeIdx) {
                    var nd = nodes[nodeIdx];
                    // 노드 표시
                    steps.push({
                        desc: nd.val <= 1
                            ? 'fib(' + nd.val + ') — 멈추는 조건! 바로 ' + nd.val + ' 반환'
                            : 'fib(' + nd.val + ') 호출 — fib(' + (nd.val - 1) + ') + fib(' + (nd.val - 2) + ')으로 쪼갬',
                        nodeId: nodeIdx,
                        val: nd.val,
                        isBase: nd.val <= 1
                    });
                    if (nd.val > 1) {
                        // 자식 엣지 + 재귀
                        var childEdges = edges.filter(function(e) { return e.from === nodeIdx; });
                        childEdges.forEach(function(ce) {
                            buildSteps(ce.to);
                        });
                        // 결과 합산 스텝
                        var fibVal = [0, 1];
                        for (var i = 2; i <= n; i++) fibVal[i] = fibVal[i - 1] + fibVal[i - 2];
                        steps.push({
                            desc: 'fib(' + nd.val + ') = fib(' + (nd.val - 1) + ') + fib(' + (nd.val - 2) + ') = ' + fibVal[nd.val - 1] + ' + ' + fibVal[nd.val - 2] + ' = ' + fibVal[nd.val] + ' 반환',
                            nodeId: nodeIdx,
                            val: nd.val,
                            isReturn: true,
                            result: fibVal[nd.val]
                        });
                    }
                }
                buildSteps(0);

                fibState.steps = steps;
                fibMsg.textContent = '👆 "다음 단계"를 눌러 fib(' + n + ')의 호출 트리가 펼쳐지는 과정을 관찰하세요!';
                fibStepBtn.disabled = false;

                // 엣지 lookup
                fibState.edges = edges;
                fibState.svg = svg;
                fibState.nodes = nodes;
            }

            fibStepBtn.addEventListener('click', function() {
                if (fibState.idx >= fibState.steps.length - 1) return;
                fibState.idx++;
                var s = fibState.steps[fibState.idx];
                fibMsg.textContent = s.desc;

                setTimeout(function() {
                    var nodeEl = fibState.nodeEls[s.nodeId];
                    if (!nodeEl) return;

                    if (s.isReturn) {
                        // 반환: 노드를 초록으로
                        nodeEl.circle.setAttribute('stroke', 'var(--green)');
                        nodeEl.circle.setAttribute('fill', 'var(--green)15');
                        nodeEl.circle.setAttribute('stroke-width', '3');
                    } else {
                        // 노드 표시
                        nodeEl.g.style.opacity = '1';
                        // 연결 엣지도 표시
                        var parentEdge = fibState.edges.filter(function(e) { return e.to === s.nodeId; });
                        parentEdge.forEach(function(pe) {
                            fibState.svg.querySelectorAll('line').forEach(function(line) {
                                if (parseInt(line.dataset.from) === pe.from && parseInt(line.dataset.to) === pe.to) {
                                    line.style.opacity = '1';
                                    line.style.transition = 'opacity 0.3s ease';
                                }
                            });
                        });
                        // 호출 카운트 업데이트
                        fibState.counts[s.val]++;
                        fibState.totalCount++;
                        var ce = fibState.countEls[s.val];
                        if (ce) {
                            ce.cnt.textContent = fibState.counts[s.val];
                            // 최대 호출 수로 비율 계산 (최대 8로 제한)
                            var maxCalls = 8;
                            ce.bar.style.width = Math.min(100, (fibState.counts[s.val] / maxCalls) * 100) + '%';
                            if (fibState.counts[s.val] > 1) {
                                ce.bar.style.background = 'var(--red)';
                                nodeEl.circle.setAttribute('stroke', 'var(--yellow)');
                                nodeEl.circle.setAttribute('fill', 'var(--yellow)20');
                            }
                        }
                        fibTotal.textContent = '총 호출: ' + fibState.totalCount + '번';
                        // 중복 체크
                        var dups = [];
                        for (var k in fibState.counts) {
                            if (fibState.counts[k] > 1) dups.push('fib(' + k + ')=' + fibState.counts[k] + '번');
                        }
                        fibDup.textContent = dups.length > 0 ? '중복: ' + dups.join(', ') : '';

                        if (s.isBase) {
                            nodeEl.circle.setAttribute('stroke', 'var(--green)');
                            nodeEl.circle.setAttribute('fill', 'var(--green)15');
                        } else {
                            nodeEl.circle.setAttribute('stroke', fibState.counts[s.val] > 1 ? 'var(--yellow)' : 'var(--accent)');
                        }
                    }
                }, 200);

                if (fibState.idx >= fibState.steps.length - 1) {
                    fibStepBtn.disabled = true;
                    setTimeout(function() {
                        fibMsg.textContent = '완료! 같은 fib 값이 여러 번 계산되었죠? 이 중복을 없애는 것이 바로 DP(메모이제이션 — 계산 결과를 기억해두기)입니다!';
                    }, 400);
                }
            });

            fibResetBtn.addEventListener('click', function() {
                var n = parseInt(fibInput.value) || 5;
                if (n < 2) n = 2;
                if (n > 7) n = 7;
                fibBuild(n);
            });

            fibInput.addEventListener('change', function() {
                var n = parseInt(fibInput.value) || 5;
                if (n < 2) n = 2;
                if (n > 7) n = 7;
                fibBuild(n);
            });

            fibBuild(5);
        })();
    },

    // ===== 시각화 상태 =====
    _vizState: {
        steps: [],
        currentStep: -1,
        keydownHandler: null
    },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) {
            document.removeEventListener('keydown', s.keydownHandler);
            s.keydownHandler = null;
        }
        s.steps = [];
        s.currentStep = -1;
    },

    _createStepDesc(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>◀ 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 ▶</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix) {
        var self = this;
        var state = self._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var s = suffix || '';
        var prevBtn = container.querySelector('#viz-prev' + s);
        var nextBtn = container.querySelector('#viz-next' + s);
        var counter = container.querySelector('#viz-step-counter' + s);
        var desc = container.querySelector('#viz-step-desc' + s);

        var updateUI = function() {
            var idx = state.currentStep;
            var total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) {
                counter.textContent = '시작 전';
                desc.textContent = '▶ 다음 버튼을 눌러 시작하세요';
            } else {
                counter.textContent = 'Step ' + (idx + 1) + ' / ' + total;
                desc.innerHTML = '<span>' + state.steps[idx].description + '</span>';
            }
        };

        var actionDelay = 350;
        nextBtn.addEventListener('click', function() {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            updateUI();
            setTimeout(function() { state.steps[state.currentStep].action(); }, actionDelay);
        });

        prevBtn.addEventListener('click', function() {
            if (state.currentStep < 0) return;
            var stepToUndo = state.currentStep;
            state.currentStep--;
            updateUI();
            setTimeout(function() { state.steps[stepToUndo].undo(); }, actionDelay);
        });

        var handleKeydown = function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
        };
        document.addEventListener('keydown', handleKeydown);
        state.keydownHandler = handleKeydown;

        updateUI();
    },

    // ===== 사용하지 않는 탭 (통합됨) =====
    renderVisualize(container) {},
    renderProblem(container) {},

    _renderVizType(el, type) {
        switch(type) {
            case 'factorial': this._renderVizFactorial(el); break;
            case 'fibonacci': this._renderVizFibonacci(el); break;
            case 'hanoi': this._renderVizHanoi(el); break;
        }
    },

    // ===== 팩토리얼 시각화 (concept tab) =====
    _renderVizFactorial(el) {
        const self = this;
        const initViz = (n) => {
            el.innerHTML = `
                <div class="viz-controls">
                    <div class="viz-control-group">
                        <label>n = <span id="viz-n-label">${n}</span></label>
                        <input type="range" id="viz-n-slider" min="1" max="10" value="${n}">
                    </div>
                </div>
                <div class="viz-panels-grid">
                    <div class="viz-panel">
                        <div class="viz-panel-header"><h3>콜 스택</h3></div>
                        <div class="viz-panel-body">
                            <div id="call-stack" class="viz-call-stack"></div>
                        </div>
                    </div>
                    <div class="viz-panel">
                        <div class="viz-panel-header"><h3>호출 로그</h3></div>
                        <div class="viz-panel-body">
                            <div id="call-log" class="viz-call-log"></div>
                        </div>
                    </div>
                </div>
                ${self._createStepDesc('concept-fact')}
                ${self._createStepControls('concept-fact')}
            `;

            const stackEl = el.querySelector('#call-stack');
            const logEl = el.querySelector('#call-log');

            const fact = [1];
            for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;

            const steps = [];
            const stackFrames = [];
            const logLines = [];

            for (let i = n; i >= 1; i--) {
                const ci = i;
                steps.push({
                    description: ci === 1
                        ? `factorial(1) 호출 → <strong>기저 조건</strong>: n=1이면 더 쪼갤 수 없으므로 재귀 없이 바로 1 반환`
                        : `factorial(${ci}) 호출 → ${ci} × factorial(${ci - 1})이 필요하므로, 작은 문제를 먼저 풀기 위해 재귀 호출`,
                    action() {
                        const frame = document.createElement('div');
                        frame.className = 'stack-frame' + (ci === 1 ? ' base' : '');
                        frame.textContent = ci === 1 ? `factorial(1) = 1 ✓` : `factorial(${ci}) = ${ci} × ?`;
                        stackEl.prepend(frame);
                        stackFrames.push(frame);
                        const line = document.createElement('div');
                        line.className = 'log-line call';
                        line.textContent = '\u00A0\u00A0'.repeat(n - ci) + `→ factorial(${ci}) 호출`;
                        logEl.appendChild(line);
                        logLines.push(line);
                        logEl.scrollTop = logEl.scrollHeight;
                    },
                    undo() {
                        const frame = stackFrames.pop();
                        if (frame) frame.remove();
                        const line = logLines.pop();
                        if (line) line.remove();
                    }
                });
            }

            for (let i = 1; i <= n; i++) {
                const ci = i;
                steps.push({
                    description: ci === 1
                        ? `factorial(1) = 1 반환 — 기저 조건이므로 재귀 없이 즉시 값을 돌려줌`
                        : `factorial(${ci}) = ${ci} × ${fact[ci - 1]} = ${fact[ci]} 반환 — 아래 호출 결과를 받아 곱한 뒤 위로 전달`,
                    action() {
                        const topFrame = stackEl.firstChild;
                        if (topFrame) {
                            topFrame.textContent = `factorial(${ci}) = ${fact[ci]} ✓`;
                            topFrame.classList.add('returning');
                        }
                        const line = document.createElement('div');
                        line.className = 'log-line return-val';
                        line.textContent = '\u00A0\u00A0'.repeat(n - ci) + `← factorial(${ci}) = ${fact[ci]}`;
                        logEl.appendChild(line);
                        logLines.push(line);
                        logEl.scrollTop = logEl.scrollHeight;
                    },
                    undo() {
                        const topFrame = stackEl.firstChild;
                        if (topFrame) {
                            topFrame.classList.remove('returning');
                            topFrame.textContent = ci === 1 ? `factorial(1) = 1 ✓` : `factorial(${ci}) = ${ci} × ?`;
                        }
                        const line = logLines.pop();
                        if (line) line.remove();
                    }
                });
            }

            steps.push({
                description: `✅ 완료! factorial(${n}) = ${fact[n]} — 기저→반환이 연쇄적으로 올라오며 최종 결과 완성`,
                action() {},
                undo() {}
            });

            self._initStepController(el, steps, 'concept-fact');
        };

        initViz(5);
        el.addEventListener('input', (e) => {
            if (e.target.id === 'viz-n-slider') {
                self._clearVizState();
                initViz(parseInt(e.target.value));
            }
        });
    },

    // ===== 피보나치 재귀 트리 시각화 (concept tab) =====
    _renderVizFibonacci(el) {
        const self = this;
        const initViz = (n) => {
            el.innerHTML = `
                <div class="viz-controls">
                    <div class="viz-control-group">
                        <label>n = <span id="viz-n-label">${n}</span></label>
                        <input type="range" id="viz-n-slider" min="2" max="7" value="${n}">
                    </div>
                </div>
                <div class="viz-panels-grid">
                    <div class="viz-panel">
                        <div class="viz-panel-header"><h3>재귀 트리</h3>
                        <div class="counter">호출: <span id="call-count" class="counter-num">0</span>번</div></div>
                        <div class="viz-panel-body">
                            <div id="concept-fib-tree" style="overflow-x:auto;padding:12px 0;min-height:200px;"></div>
                        </div>
                    </div>
                    <div class="viz-panel">
                        <div class="viz-panel-header">
                            <h3>호출 횟수</h3>
                        </div>
                        <div class="viz-panel-body">
                            <div id="call-counts" class="dp-table-container" style="flex-wrap:wrap;gap:8px;"></div>
                        </div>
                    </div>
                </div>
                ${self._createStepDesc('concept-fib')}
                ${self._createStepControls('concept-fib')}
            `;

            const treeEl = el.querySelector('#concept-fib-tree');
            const countsEl = el.querySelector('#call-counts');
            const totalEl = el.querySelector('#call-count');

            // 호출 횟수 셀 생성
            const countCells = [];
            for (let i = 0; i <= n; i++) {
                const cell = document.createElement('div');
                cell.className = 'dp-cell';
                cell.innerHTML = `<div class="dp-cell-index">fib(${i})</div><div class="dp-cell-value">0</div>`;
                countsEl.appendChild(cell);
                countCells.push(cell);
            }

            // 트리 노드 레이아웃 계산
            const treeNodes = [];
            const treeEdges = [];
            let treeNodeId = 0;

            function layoutTree(val, depth, xCenter, xSpan) {
                const id = treeNodeId++;
                treeNodes.push({ id, val, x: xCenter, y: depth * 64 + 30, depth });
                if (val <= 1) return id;
                const leftId = layoutTree(val - 1, depth + 1, xCenter - xSpan / 2, xSpan / 2);
                treeEdges.push({ from: id, to: leftId });
                const rightId = layoutTree(val - 2, depth + 1, xCenter + xSpan / 2, xSpan / 2);
                treeEdges.push({ from: id, to: rightId });
                return id;
            }

            const totalWidth = Math.max(400, Math.pow(2, n) * 44);
            const totalHeight = (n + 1) * 64 + 20;
            layoutTree(n, 0, totalWidth / 2, totalWidth / 3);

            // SVG 생성
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', totalWidth);
            svg.setAttribute('height', totalHeight);
            svg.style.cssText = 'display:block;margin:0 auto;';

            // 엣지 (처음에 숨김)
            treeEdges.forEach(e => {
                const fromNode = treeNodes[e.from];
                const toNode = treeNodes[e.to];
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', fromNode.x);
                line.setAttribute('y1', fromNode.y + 16);
                line.setAttribute('x2', toNode.x);
                line.setAttribute('y2', toNode.y - 16);
                line.setAttribute('stroke', 'var(--border)');
                line.setAttribute('stroke-width', '2');
                line.style.opacity = '0';
                line.style.transition = 'opacity 0.3s ease';
                line.dataset.from = e.from;
                line.dataset.to = e.to;
                svg.appendChild(line);
            });

            // 노드 (처음에 숨김)
            const nodeEls = {};
            treeNodes.forEach(nd => {
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.style.opacity = '0';
                g.style.transition = 'opacity 0.3s ease';

                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', nd.x);
                circle.setAttribute('cy', nd.y);
                circle.setAttribute('r', 18);
                circle.setAttribute('fill', 'var(--bg2)');
                circle.setAttribute('stroke', 'var(--border)');
                circle.setAttribute('stroke-width', '2');
                g.appendChild(circle);

                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', nd.x);
                text.setAttribute('y', nd.y + 5);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '12');
                text.setAttribute('font-family', 'monospace');
                text.setAttribute('fill', 'var(--text)');
                text.textContent = 'f(' + nd.val + ')';
                g.appendChild(text);

                svg.appendChild(g);
                nodeEls[nd.id] = { g, circle, text };
            });

            treeEl.appendChild(svg);

            // 피보나치 값 미리 계산
            const fibVals = [0, 1];
            for (let fi = 2; fi <= n; fi++) fibVals[fi] = fibVals[fi - 1] + fibVals[fi - 2];

            // 스텝 생성 (DFS 순서)
            const steps = [];
            let callCount = 0;
            const callCounts = new Array(n + 1).fill(0);

            function buildSteps(nodeIdx) {
                const nd = treeNodes[nodeIdx];
                const nIdx = nodeIdx;
                const nVal = nd.val;
                const isBase = nVal <= 1;

                // 호출 스텝
                const descCall = isBase
                    ? `fib(${nVal}) 호출 — <strong>기저 조건</strong>: 바로 ${nVal} 반환`
                    : `fib(${nVal}) 호출 — fib(${nVal - 1}) + fib(${nVal - 2})를 알아야 하므로 재귀로 내려감`;

                steps.push({
                    description: descCall,
                    action() {
                        callCount++;
                        callCounts[nVal]++;
                        totalEl.textContent = callCount;
                        countCells[nVal].querySelector('.dp-cell-value').textContent = callCounts[nVal];
                        if (callCounts[nVal] > 1) countCells[nVal].classList.add('memo-hit');
                        if (isBase) countCells[nVal].classList.add('base');
                        // 노드 표시
                        const nel = nodeEls[nIdx];
                        nel.g.style.opacity = '1';
                        // 엣지 표시
                        svg.querySelectorAll('line').forEach(line => {
                            if (parseInt(line.dataset.to) === nIdx) line.style.opacity = '1';
                        });
                        // 색상 결정
                        if (isBase) {
                            nel.circle.setAttribute('stroke', 'var(--green)');
                            nel.circle.setAttribute('fill', 'var(--green)');
                            nel.circle.setAttribute('fill-opacity', '0.15');
                            nel.circle.setAttribute('stroke-width', '3');
                        } else if (callCounts[nVal] > 1) {
                            nel.circle.setAttribute('stroke', 'var(--red)');
                            nel.circle.setAttribute('fill', 'var(--red)');
                            nel.circle.setAttribute('fill-opacity', '0.15');
                            nel.circle.setAttribute('stroke-width', '3');
                        } else {
                            nel.circle.setAttribute('stroke', 'var(--yellow)');
                            nel.circle.setAttribute('fill', 'var(--yellow)');
                            nel.circle.setAttribute('fill-opacity', '0.15');
                            nel.circle.setAttribute('stroke-width', '3');
                        }
                    },
                    undo() {
                        callCount--;
                        callCounts[nVal]--;
                        totalEl.textContent = callCount;
                        countCells[nVal].querySelector('.dp-cell-value').textContent = callCounts[nVal];
                        if (callCounts[nVal] <= 1) countCells[nVal].classList.remove('memo-hit');
                        if (isBase && callCounts[nVal] <= 0) countCells[nVal].classList.remove('base');
                        const nel = nodeEls[nIdx];
                        nel.g.style.opacity = '0';
                        svg.querySelectorAll('line').forEach(line => {
                            if (parseInt(line.dataset.to) === nIdx) line.style.opacity = '0';
                        });
                        nel.circle.setAttribute('stroke', 'var(--border)');
                        nel.circle.setAttribute('fill', 'var(--bg2)');
                        nel.circle.setAttribute('fill-opacity', '1');
                        nel.circle.setAttribute('stroke-width', '2');
                    }
                });

                if (nVal > 1) {
                    // 자식 재귀
                    const childEdges = treeEdges.filter(e => e.from === nodeIdx);
                    childEdges.forEach(ce => buildSteps(ce.to));

                    // 반환 스텝
                    const result = fibVals[nVal];
                    steps.push({
                        description: `fib(${nVal}) = fib(${nVal - 1}) + fib(${nVal - 2}) = ${fibVals[nVal - 1]} + ${fibVals[nVal - 2]} = ${result} 반환 — 두 하위 결과를 합쳐 상위 호출에 전달`,
                        action() {
                            countCells[nVal].classList.add('filled');
                            const nel = nodeEls[nIdx];
                            nel.circle.setAttribute('stroke', 'var(--green)');
                            nel.circle.setAttribute('fill', 'var(--green)');
                            nel.circle.setAttribute('fill-opacity', '0.15');
                            nel.circle.setAttribute('stroke-width', '3');
                            nel.text.textContent = String(result);
                        },
                        undo() {
                            countCells[nVal].classList.remove('filled');
                            const nel = nodeEls[nIdx];
                            if (callCounts[nVal] > 1) {
                                nel.circle.setAttribute('stroke', 'var(--red)');
                                nel.circle.setAttribute('fill', 'var(--red)');
                            } else {
                                nel.circle.setAttribute('stroke', 'var(--yellow)');
                                nel.circle.setAttribute('fill', 'var(--yellow)');
                            }
                            nel.circle.setAttribute('fill-opacity', '0.15');
                            nel.circle.setAttribute('stroke-width', '3');
                            nel.text.textContent = 'f(' + nVal + ')';
                        }
                    });
                }
            }
            buildSteps(0);

            const totalNodeCount = treeNodes.length;
            steps.push({
                description: `✅ fib(${n}) = ${fibVals[n]}, 총 ${totalNodeCount}번 호출! 중복이 많죠? → 이것을 DP로 해결합니다`,
                action() {},
                undo() {}
            });

            self._initStepController(el, steps, 'concept-fib');
        };

        initViz(5);
        el.addEventListener('input', (e) => {
            if (e.target.id === 'viz-n-slider') {
                self._clearVizState();
                initViz(parseInt(e.target.value));
            }
        });
    },

    // ===== 하노이 탑 시각화 (concept tab) =====
    _renderVizHanoi(el) {
        const self = this;
        const initViz = (n) => {
            el.innerHTML = `
                <div class="viz-controls">
                    <div class="viz-control-group">
                        <label>원판 수 = <span id="viz-n-label">${n}</span></label>
                        <input type="range" id="viz-n-slider" min="1" max="5" value="${n}">
                    </div>
                </div>
                <div class="viz-panel">
                    <div class="viz-panel-header">
                        <h3>하노이 탑</h3>
                        <div class="counter">이동: <span id="move-count" class="counter-num">0</span> / ${Math.pow(2, n) - 1}</div>
                    </div>
                    <div class="viz-panel-body">
                        <div id="hanoi-pegs" class="hanoi-pegs">
                            <div class="hanoi-peg" data-peg="1"><div class="peg-label">1</div><div class="peg-rod"></div><div class="peg-disks" id="peg-1"></div></div>
                            <div class="hanoi-peg" data-peg="2"><div class="peg-label">2</div><div class="peg-rod"></div><div class="peg-disks" id="peg-2"></div></div>
                            <div class="hanoi-peg" data-peg="3"><div class="peg-label">3</div><div class="peg-rod"></div><div class="peg-disks" id="peg-3"></div></div>
                        </div>
                    </div>
                </div>
                ${self._createStepDesc('concept-hanoi')}
                ${self._createStepControls('concept-hanoi')}
            `;

            const colors = ['var(--accent)', 'var(--green)', 'var(--red)', 'var(--yellow)', 'var(--blue)'];

            const pegs = { 1: [], 2: [], 3: [] };
            const peg1El = el.querySelector('#peg-1');
            for (let i = n; i >= 1; i--) {
                pegs[1].push(i);
                const disk = document.createElement('div');
                disk.className = 'hanoi-disk';
                disk.style.width = (30 + i * 18) + 'px';
                disk.style.background = colors[(i - 1) % colors.length];
                disk.dataset.size = i;
                disk.textContent = i;
                peg1El.appendChild(disk);
            }

            const moveCountEl = el.querySelector('#move-count');

            const moves = [];
            const hanoiSolve = (n, from, to, via) => {
                if (n === 0) return;
                hanoiSolve(n - 1, from, via, to);
                moves.push({ disk: n, from, to });
                hanoiSolve(n - 1, via, to, from);
            };
            hanoiSolve(n, 1, 3, 2);

            let moveNum = 0;

            const steps = moves.map((m, idx) => {
                return {
                    description: `원판 ${m.disk}을 ${m.from}번 → ${m.to}번 기둥으로 이동 — 위의 작은 원판들을 먼저 치워야 큰 원판을 옮길 수 있으므로`,
                    action() {
                        const fromEl = el.querySelector(`#peg-${m.from}`);
                        const toEl = el.querySelector(`#peg-${m.to}`);
                        const disk = fromEl.lastChild;
                        if (disk) {
                            toEl.appendChild(disk);
                        }
                        moveNum++;
                        moveCountEl.textContent = moveNum;
                    },
                    undo() {
                        const fromEl = el.querySelector(`#peg-${m.from}`);
                        const toEl = el.querySelector(`#peg-${m.to}`);
                        const disk = toEl.lastChild;
                        if (disk) {
                            fromEl.appendChild(disk);
                        }
                        moveNum--;
                        moveCountEl.textContent = moveNum;
                    }
                };
            });

            steps.push({
                description: `✅ 완료! ${n}개 원판을 ${moves.length}번 만에 이동 (최소 횟수 = 2^${n} - 1 = ${Math.pow(2, n) - 1})`,
                action() {},
                undo() {}
            });

            self._initStepController(el, steps, 'concept-hanoi');
        };

        initViz(3);
        el.addEventListener('input', (e) => {
            if (e.target.id === 'viz-n-slider') {
                self._clearVizState();
                initViz(parseInt(e.target.value));
            }
        });
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

    // ===== 문제별 콘텐츠 렌더링 =====
    renderProblemContent(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }

        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }

        self._clearVizState();

        var diffMap = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold' };

        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);

        var flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '힌트에서 배운 개념이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
            case 'problem':
                self._renderProblemTab(contentDiv, prob);
                break;
            case 'think':
                self._renderThinkTab(contentDiv, prob);
                break;
            case 'sim':
                self[meta.vizMethod](contentDiv);
                break;
            case 'code':
                self._renderCodeTab(contentDiv, prob);
                break;
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

    // ===== 문제 서브탭: 문제 =====
    _renderProblemTab(contentEl, prob) {
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
                '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
                    'BOJ에서 풀기 ↗' +
                '</a>' +
            '</div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) {
            if (window.hljs) hljs.highlightElement(codeEl);
        });
    },

    // ===== 문제 서브탭: 생각해볼것 =====
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
                    '<span class="hint-step-toggle">▾</span>' +
                '</div>' +
                '<div class="hint-step-body">' + hint.content + '</div>';

            step.querySelector('.hint-step-header').addEventListener('click', function() {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('opened');
                step.querySelector('.hint-step-toggle').textContent =
                    step.classList.contains('opened') ? '▴' : '▾';

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

    // ===== 문제 서브탭: 코드 =====
    _renderCodeTab(contentEl, prob) {
        if (prob.solutions && prob.solutions.length > 0) {
            window.renderSolutionsCodeTab(contentEl, prob);
            return;
        }
        var wrapper = document.createElement('div');
        wrapper.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">' +
                '<select class="str-lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--card);color:var(--text);">' +
                    '<option value="python">Python</option>' +
                    '<option value="cpp">C++</option>' +
                '</select>' +
                '<a href="' + prob.link + '" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">BOJ에서 풀기 ↗</a>' +
            '</div>' +
            '<div class="code-block"><pre><code class="language-python"></code></pre></div>';

        var codeEl = wrapper.querySelector('code');
        codeEl.textContent = prob.templates.python;
        if (window.hljs) hljs.highlightElement(codeEl);

        var select = wrapper.querySelector('.str-lang-select');
        select.addEventListener('change', function() {
            var lang = select.value;
            var langMap = { python: 'language-python', cpp: 'language-cpp' };
            codeEl.className = langMap[lang];
            codeEl.textContent = prob.templates[lang];
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        contentEl.appendChild(wrapper);
    },

    _showOutput(container, text, status) {
        var area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    },

    // ===== 7 Per-Problem Simulation Methods =====

    // 1. Factorial Simulation (boj-27433)
    _renderVizFactorialSim(container) {
        var self = this;
        var DEFAULT_N = 5;

        function buildAndRender(n) {
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                    '<label style="font-weight:600;">N: <input type="number" id="rec-fact-n" value="' + n + '" min="1" max="10" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;background:var(--card);color:var(--text);"></label>' +
                    '<button class="btn btn-primary" id="rec-fact-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('fact') +
                '<div class="viz-panel"><div class="viz-panel-header"><h3>factorial(' + n + ') 콜 스택</h3></div>' +
                '<div class="viz-panel-body"><div id="sim-stack-fact" class="viz-call-stack"></div></div></div>' +
                self._createStepControls('fact');

            var stackEl = container.querySelector('#sim-stack-fact');
            var factVals = [1];
            for (var f = 1; f <= n; f++) factVals[f] = factVals[f - 1] * f;
            var frames = [];
            var steps = [];

            // Call phase: n down to 1
            for (var i = n; i >= 1; i--) {
                (function(ci) {
                    steps.push({
                        description: ci === 1
                            ? 'factorial(1) 호출 → <strong>기저 조건</strong>: n=1이면 더 쪼갤 수 없으므로 재귀 없이 바로 1 반환'
                            : 'factorial(' + ci + ') 호출 → ' + ci + ' × factorial(' + (ci-1) + ')이 필요하므로, 작은 문제를 먼저 풀기 위해 재귀 호출',
                        action: function() {
                            var fr = document.createElement('div');
                            fr.className = 'stack-frame' + (ci === 1 ? ' base' : '');
                            fr.textContent = ci === 1 ? 'factorial(1) = 1 ✓' : 'factorial(' + ci + ') = ' + ci + ' × ?';
                            stackEl.prepend(fr);
                            frames.push(fr);
                        },
                        undo: function() {
                            var fr = frames.pop();
                            if (fr) fr.remove();
                        }
                    });
                })(i);
            }

            // Return phase: 1 up to n
            for (var i = 1; i <= n; i++) {
                (function(ci) {
                    steps.push({
                        description: ci === 1
                            ? 'factorial(1) = 1 반환 — 기저 조건이므로 재귀 없이 즉시 값을 돌려줌'
                            : 'factorial(' + ci + ') = ' + ci + ' × ' + factVals[ci-1] + ' = ' + factVals[ci] + ' 반환 — 아래 호출 결과를 받아 곱한 뒤 위로 전달',
                        action: function() {
                            var top = stackEl.firstChild;
                            if (top) {
                                top.textContent = 'factorial(' + ci + ') = ' + factVals[ci] + ' ✓';
                                top.classList.add('returning');
                            }
                        },
                        undo: function() {
                            var top = stackEl.firstChild;
                            if (top) {
                                top.classList.remove('returning');
                                top.textContent = ci === 1 ? 'factorial(1) = 1 ✓' : 'factorial(' + ci + ') = ' + ci + ' × ?';
                            }
                        }
                    });
                })(i);
            }

            steps.push({ description: '✅ 완료! factorial(' + n + ') = ' + factVals[n], action: function(){}, undo: function(){} });
            self._initStepController(container, steps, 'fact');

            container.querySelector('#rec-fact-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#rec-fact-n').value);
                if (isNaN(val) || val < 1) val = 1;
                if (val > 10) val = 10;
                self._clearVizState();
                buildAndRender(val);
            });
        }

        buildAndRender(DEFAULT_N);
    },

    // 2. Fibonacci Simulation (boj-10870)
    _renderVizFibSim(container) {
        var self = this;
        var DEFAULT_N = 5;

        function buildAndRender(n) {
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                    '<label style="font-weight:600;">N: <input type="number" id="rec-fib-n" value="' + n + '" min="2" max="7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;background:var(--card);color:var(--text);"></label>' +
                    '<button class="btn btn-primary" id="rec-fib-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('fib') +
                '<div class="viz-panel"><div class="viz-panel-header"><h3>fib(' + n + ') 재귀 트리</h3>' +
                '<div class="counter">호출: <span id="sim-fib-cnt">0</span>번</div></div>' +
                '<div class="viz-panel-body"><div id="sim-fib-tree" style="overflow-x:auto;padding:12px 0;min-height:200px;"></div></div></div>' +
                self._createStepControls('fib');

            var treeEl = container.querySelector('#sim-fib-tree');
            var cntEl = container.querySelector('#sim-fib-cnt');

            // 트리 노드 구축 — 재귀적으로 이진 트리 생성
            var nodes = [];
            var edges = [];
            var nodeId = 0;

            function layoutTree(val, depth, xCenter, xSpan) {
                var id = nodeId++;
                nodes.push({ id: id, val: val, x: xCenter, y: depth * 64 + 30, depth: depth });
                if (val <= 1) return id;
                var leftId = layoutTree(val - 1, depth + 1, xCenter - xSpan / 2, xSpan / 2);
                edges.push({ from: id, to: leftId });
                var rightId = layoutTree(val - 2, depth + 1, xCenter + xSpan / 2, xSpan / 2);
                edges.push({ from: id, to: rightId });
                return id;
            }

            var totalWidth = Math.max(400, Math.pow(2, n) * 44);
            var totalHeight = (n + 1) * 64 + 20;
            layoutTree(n, 0, totalWidth / 2, totalWidth / 3);

            // SVG 생성
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', totalWidth);
            svg.setAttribute('height', totalHeight);
            svg.style.cssText = 'display:block;margin:0 auto;';

            // 엣지 — 처음에는 숨김
            edges.forEach(function(e) {
                var fromNode = nodes[e.from];
                var toNode = nodes[e.to];
                var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', fromNode.x);
                line.setAttribute('y1', fromNode.y + 16);
                line.setAttribute('x2', toNode.x);
                line.setAttribute('y2', toNode.y - 16);
                line.setAttribute('stroke', 'var(--border)');
                line.setAttribute('stroke-width', '2');
                line.style.opacity = '0';
                line.style.transition = 'opacity 0.3s ease';
                line.dataset.from = e.from;
                line.dataset.to = e.to;
                svg.appendChild(line);
            });

            // 노드 — 처음에는 숨김
            var nodeEls = {};
            nodes.forEach(function(nd) {
                var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.style.opacity = '0';
                g.style.transition = 'opacity 0.3s ease';

                var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', nd.x);
                circle.setAttribute('cy', nd.y);
                circle.setAttribute('r', 18);
                circle.setAttribute('fill', 'var(--bg2)');
                circle.setAttribute('stroke', 'var(--border)');
                circle.setAttribute('stroke-width', '2');
                g.appendChild(circle);

                var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', nd.x);
                text.setAttribute('y', nd.y + 5);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '12');
                text.setAttribute('font-family', 'monospace');
                text.setAttribute('fill', 'var(--text)');
                text.textContent = 'f(' + nd.val + ')';
                g.appendChild(text);

                svg.appendChild(g);
                nodeEls[nd.id] = { g: g, circle: circle, text: text };
            });

            treeEl.appendChild(svg);

            // 호출 순서대로 스텝 생성 (DFS 순서)
            var fibVals = [0, 1];
            for (var fi = 2; fi <= n; fi++) fibVals[fi] = fibVals[fi - 1] + fibVals[fi - 2];

            var steps = [];
            var callCount = 0;
            var callCounts = {}; // fib(k)가 몇 번 호출되었는지
            for (var ci = 0; ci <= n; ci++) callCounts[ci] = 0;

            function buildSteps(nodeIdx) {
                var nd = nodes[nodeIdx];
                // 호출 스텝: 노드 표시 + 엣지 표시
                (function(nIdx, nVal) {
                    var isBase = nVal <= 1;
                    var descCall = isBase
                        ? 'fib(' + nVal + ') 호출 — <strong>기저 조건</strong>: 바로 ' + nVal + ' 반환'
                        : 'fib(' + nVal + ') 호출 — fib(' + (nVal - 1) + ') + fib(' + (nVal - 2) + ')를 알아야 하므로 재귀로 내려감';
                    steps.push({
                        description: descCall,
                        action: function() {
                            callCount++;
                            cntEl.textContent = callCount;
                            callCounts[nVal]++;
                            // 노드 표시
                            var nel = nodeEls[nIdx];
                            nel.g.style.opacity = '1';
                            // 부모→이 노드 엣지 표시
                            svg.querySelectorAll('line').forEach(function(line) {
                                if (parseInt(line.dataset.to) === nIdx) {
                                    line.style.opacity = '1';
                                }
                            });
                            // 색상: 기저=초록, 중복=빨강, 현재=노랑
                            if (isBase) {
                                nel.circle.setAttribute('stroke', 'var(--green)');
                                nel.circle.setAttribute('fill', 'var(--green)');
                                nel.circle.setAttribute('fill-opacity', '0.15');
                                nel.circle.setAttribute('stroke-width', '3');
                            } else if (callCounts[nVal] > 1) {
                                nel.circle.setAttribute('stroke', 'var(--red)');
                                nel.circle.setAttribute('fill', 'var(--red)');
                                nel.circle.setAttribute('fill-opacity', '0.15');
                                nel.circle.setAttribute('stroke-width', '3');
                            } else {
                                nel.circle.setAttribute('stroke', 'var(--yellow)');
                                nel.circle.setAttribute('fill', 'var(--yellow)');
                                nel.circle.setAttribute('fill-opacity', '0.15');
                                nel.circle.setAttribute('stroke-width', '3');
                            }
                        },
                        undo: function() {
                            callCount--;
                            cntEl.textContent = callCount;
                            callCounts[nVal]--;
                            var nel = nodeEls[nIdx];
                            nel.g.style.opacity = '0';
                            svg.querySelectorAll('line').forEach(function(line) {
                                if (parseInt(line.dataset.to) === nIdx) {
                                    line.style.opacity = '0';
                                }
                            });
                            // 색상 리셋
                            nel.circle.setAttribute('stroke', 'var(--border)');
                            nel.circle.setAttribute('fill', 'var(--bg2)');
                            nel.circle.setAttribute('fill-opacity', '1');
                            nel.circle.setAttribute('stroke-width', '2');
                        }
                    });
                })(nodeIdx, nd.val);

                if (nd.val > 1) {
                    // 자식 재귀
                    var childEdges = edges.filter(function(e) { return e.from === nodeIdx; });
                    childEdges.forEach(function(ce) {
                        buildSteps(ce.to);
                    });
                    // 결과 합산 — 노드를 초록으로
                    (function(nIdx, nVal) {
                        var result = fibVals[nVal];
                        steps.push({
                            description: 'fib(' + nVal + ') = fib(' + (nVal - 1) + ') + fib(' + (nVal - 2) + ') = ' + fibVals[nVal - 1] + ' + ' + fibVals[nVal - 2] + ' = ' + result + ' 반환 — 두 하위 결과를 합쳐 상위 호출에 전달',
                            action: function() {
                                var nel = nodeEls[nIdx];
                                nel.circle.setAttribute('stroke', 'var(--green)');
                                nel.circle.setAttribute('fill', 'var(--green)');
                                nel.circle.setAttribute('fill-opacity', '0.15');
                                nel.circle.setAttribute('stroke-width', '3');
                                nel.text.textContent = result;
                            },
                            undo: function() {
                                var nel = nodeEls[nIdx];
                                // 되돌리기: 중복이면 빨강, 아니면 노랑
                                if (callCounts[nVal] > 1) {
                                    nel.circle.setAttribute('stroke', 'var(--red)');
                                    nel.circle.setAttribute('fill', 'var(--red)');
                                } else {
                                    nel.circle.setAttribute('stroke', 'var(--yellow)');
                                    nel.circle.setAttribute('fill', 'var(--yellow)');
                                }
                                nel.circle.setAttribute('fill-opacity', '0.15');
                                nel.circle.setAttribute('stroke-width', '3');
                                nel.text.textContent = 'f(' + nVal + ')';
                            }
                        });
                    })(nodeIdx, nd.val);
                }
            }
            buildSteps(0);

            var totalCalls = nodes.length;
            var fibResult = fibVals[n];
            steps.push({ description: '✅ fib(' + n + ') = ' + fibResult + ', 총 ' + totalCalls + '번 호출! 같은 값이 여러 번 계산되는 중복이 보이시나요?', action: function(){}, undo: function(){} });
            self._initStepController(container, steps, 'fib');

            container.querySelector('#rec-fib-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#rec-fib-n').value);
                if (isNaN(val) || val < 2) val = 2;
                if (val > 7) val = 7;
                self._clearVizState();
                buildAndRender(val);
            });
        }

        buildAndRender(DEFAULT_N);
    },

    // 3. Palindrome Simulation (boj-25501)
    _renderVizPalindromeSim(container) {
        var self = this;
        var DEFAULT_STR = 'ABCBA';

        function buildAndRender(str) {
            str = str.toUpperCase();
            if (str.length === 0) str = 'A';

            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                    '<label style="font-weight:600;">문자열: <input type="text" id="rec-pal-input" value="' + str + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;background:var(--card);color:var(--text);"></label>' +
                    '<button class="btn btn-primary" id="rec-pal-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('pal') +
                '<div class="viz-panel"><div class="viz-panel-header"><h3>회문 검사: "' + str + '"</h3>' +
                '<div class="counter">호출: <span id="sim-pal-cnt">0</span>번</div></div>' +
                '<div class="viz-panel-body">' +
                '<div id="sim-pal-chars" style="display:flex;gap:4px;justify-content:center;margin-bottom:16px;font-family:monospace;font-size:1.3rem;flex-wrap:wrap;"></div>' +
                '<div id="sim-pal-log" class="viz-call-log"></div>' +
                '</div></div>' +
                self._createStepControls('pal');

            var charsEl = container.querySelector('#sim-pal-chars');
            var logEl = container.querySelector('#sim-pal-log');
            var cntEl = container.querySelector('#sim-pal-cnt');

            var charDivs = [];
            for (var i = 0; i < str.length; i++) {
                var d = document.createElement('div');
                d.style.cssText = 'width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:2px solid var(--border);border-radius:6px;transition:all 0.3s;';
                d.textContent = str[i];
                charsEl.appendChild(d);
                charDivs.push(d);
            }

            // Build pairs by simulating the recursion
            var pairs = [];
            var isPalin = 1;
            var l = 0, r = str.length - 1;
            while (true) {
                pairs.push([l, r]);
                if (l >= r) { break; }
                if (str[l] !== str[r]) { isPalin = 0; break; }
                l++; r--;
            }

            var totalCalls = pairs.length;
            var steps = [];
            var logLines = [];
            var callCnt = 0;

            pairs.forEach(function(pair, idx) {
                var pl = pair[0], pr = pair[1];
                var match = str[pl] === str[pr];
                var desc;
                if (pl >= pr) {
                    desc = 'recursion("' + str + '", ' + pl + ', ' + pr + ') → l≥r이므로 <strong>기저 조건</strong>: 가운데까지 모두 일치했으니 회문!';
                } else if (!match) {
                    desc = 'recursion("' + str + '", ' + pl + ', ' + pr + ') → s[' + pl + ']=' + str[pl] + ' vs s[' + pr + ']=' + str[pr] + ' → 양끝이 다르므로 회문 아님 (즉시 종료)';
                } else {
                    desc = 'recursion("' + str + '", ' + pl + ', ' + pr + ') → s[' + pl + ']=' + str[pl] + ' vs s[' + pr + ']=' + str[pr] + ' → 양끝이 같으므로 안쪽을 더 확인해야 함';
                }
                steps.push({
                    description: desc,
                    action: function() {
                        callCnt++;
                        cntEl.textContent = callCnt;
                        var color = match ? 'var(--accent)' : 'var(--red)';
                        charDivs[pl].style.borderColor = color;
                        charDivs[pl].style.background = color + '15';
                        if (pr !== pl) {
                            charDivs[pr].style.borderColor = color;
                            charDivs[pr].style.background = color + '15';
                        }
                        var line = document.createElement('div');
                        line.className = 'log-line call';
                        var suffix = pl >= pr ? ' ✓ 멈춤' : (match ? ' ✓' : ' ✗');
                        line.textContent = '  '.repeat(idx) + '→ recursion(s, ' + pl + ', ' + pr + ') : ' + str[pl] + (pl === pr ? '' : '==' + str[pr]) + suffix;
                        logEl.appendChild(line);
                        logLines.push(line);
                    },
                    undo: function() {
                        callCnt--;
                        cntEl.textContent = callCnt;
                        charDivs[pl].style.borderColor = 'var(--border)';
                        charDivs[pl].style.background = '';
                        if (pr !== pl) {
                            charDivs[pr].style.borderColor = 'var(--border)';
                            charDivs[pr].style.background = '';
                        }
                        var line = logLines.pop();
                        if (line) line.remove();
                    }
                });
            });

            steps.push({
                description: '결과: isPalindrome = ' + isPalin + ', 호출 횟수 = ' + totalCalls,
                action: function() {
                    var line = document.createElement('div');
                    line.className = 'log-line return-val';
                    line.textContent = '← 결과: ' + isPalin + ' ' + totalCalls;
                    logEl.appendChild(line);
                    logLines.push(line);
                },
                undo: function() {
                    var line = logLines.pop();
                    if (line) line.remove();
                }
            });

            var finalMsg = isPalin ? '✅ "' + str + '"는 회문! recursion ' + totalCalls + '번 호출' : '✅ "' + str + '"는 회문이 아님! recursion ' + totalCalls + '번 호출';
            steps.push({ description: finalMsg, action: function(){}, undo: function(){} });
            self._initStepController(container, steps, 'pal');

            container.querySelector('#rec-pal-reset').addEventListener('click', function() {
                var val = container.querySelector('#rec-pal-input').value.trim();
                if (!val) val = DEFAULT_STR;
                self._clearVizState();
                buildAndRender(val);
            });
        }

        buildAndRender(DEFAULT_STR);
    },

    // 4. Merge Sort Simulation (boj-24060)
    _renderVizMergeSim(container) {
        var self = this;
        var DEFAULT_ARR = [5, 3, 8, 1, 2];
        var DEFAULT_K = 7;

        var boxStyle = 'display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:10px;font-weight:700;font-size:1rem;border:2px solid var(--border);background:var(--card);color:var(--text);margin:3px;transition:all 0.3s;';
        var boxActiveStyle = boxStyle + 'border-color:var(--yellow);background:rgba(253,203,110,0.18);box-shadow:0 0 8px var(--yellow);';
        var boxMergedStyle = boxStyle + 'border-color:var(--green);background:rgba(0,206,158,0.13);box-shadow:0 0 8px var(--green);';
        var boxKthStyle = boxStyle + 'border-color:var(--accent);background:rgba(108,92,231,0.18);box-shadow:0 0 12px var(--accent);';
        var boxDimStyle = boxStyle + 'opacity:0.35;';
        var labelStyle = 'font-size:0.7rem;color:var(--text3);text-align:center;';

        function renderBoxes(arr, highlights) {
            var h = highlights || {};
            var html = '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:2px;">';
            for (var i = 0; i < arr.length; i++) {
                var st = boxStyle;
                if (h.kth === i) st = boxKthStyle;
                else if (h.merged && i >= h.merged[0] && i <= h.merged[1]) st = boxMergedStyle;
                else if (h.active && i >= h.active[0] && i <= h.active[1]) st = boxActiveStyle;
                else if (h.dim && (i < h.dim[0] || i > h.dim[1])) st = boxDimStyle;
                html += '<div style="display:inline-flex;flex-direction:column;align-items:center;">';
                html += '<div style="' + st + '">' + arr[i] + '</div>';
                html += '<div style="' + labelStyle + '">[' + i + ']</div>';
                html += '</div>';
            }
            html += '</div>';
            return html;
        }

        function renderTmpBoxes(tmp, pointer, style) {
            var html = '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:2px;margin-top:8px;">';
            html += '<span style="font-size:0.8rem;color:var(--text2);margin-right:6px;align-self:center;">tmp:</span>';
            for (var i = 0; i < tmp.length; i++) {
                var st = (i === pointer) ? (style || boxActiveStyle) : boxMergedStyle;
                html += '<div style="' + st + '">' + tmp[i] + '</div>';
            }
            if (tmp.length === 0) html += '<span style="color:var(--text3);font-size:0.85rem;">(비어있음)</span>';
            html += '</div>';
            return html;
        }

        function renderPointers(arr, ptrs) {
            var html = '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:2px;">';
            for (var i = 0; i < arr.length; i++) {
                var lbl = '';
                for (var p = 0; p < ptrs.length; p++) {
                    if (ptrs[p].idx === i) lbl += (lbl ? ',' : '') + ptrs[p].name;
                }
                html += '<div style="width:44px;margin:3px;text-align:center;">';
                if (lbl) html += '<div style="font-size:0.7rem;color:var(--accent);font-weight:700;">▲ ' + lbl + '</div>';
                else html += '<div style="height:16px;"></div>';
                html += '</div>';
            }
            html += '</div>';
            return html;
        }

        function buildAndRender(arr, k) {
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                    '<label style="font-weight:600;">배열: <input type="text" id="rec-merge-input" value="' + arr.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;background:var(--card);color:var(--text);"></label>' +
                    '<label style="font-weight:600;">K: <input type="number" id="rec-merge-k" value="' + k + '" min="1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;background:var(--card);color:var(--text);"></label>' +
                    '<button class="btn btn-primary" id="rec-merge-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('merge') +
                '<div class="sim-card" style="min-height:220px;">' +
                '<div style="font-weight:600;font-size:0.85rem;color:var(--text2);margin-bottom:6px;">분할 트리 — 현재 처리 중인 노드 강조</div>' +
                '<div id="sim-merge-tree" style="overflow-x:auto;margin-bottom:16px;padding:8px 0;min-height:60px;"></div>' +
                '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">' +
                    '<h3 style="margin:0;font-size:1rem;">배열 A</h3>' +
                    '<span id="sim-merge-cnt" style="font-size:0.85rem;color:var(--text2);"></span>' +
                '</div>' +
                '<div id="sim-merge-main"></div>' +
                '<div id="sim-merge-tmp" style="margin-top:12px;"></div>' +
                '<div id="sim-merge-info" style="margin-top:12px;font-size:0.9rem;"></div>' +
                '</div>' +
                self._createStepControls('merge');

            var mainEl = container.querySelector('#sim-merge-main');
            var tmpEl = container.querySelector('#sim-merge-tmp');
            var infoEl = container.querySelector('#sim-merge-info');
            var cntEl = container.querySelector('#sim-merge-cnt');
            var mergeTreeEl = container.querySelector('#sim-merge-tree');

            // --- 분할 트리 구축 ---
            var treeNodes = []; // { id, p, r, depth, parentId, children[] }
            var treeNodeId = 0;
            function buildTree(p, r, depth, parentId) {
                var id = treeNodeId++;
                treeNodes.push({ id: id, p: p, r: r, depth: depth, parentId: parentId, children: [] });
                if (p < r) {
                    var q = Math.floor((p + r) / 2);
                    var leftId = buildTree(p, q, depth + 1, id);
                    var rightId = buildTree(q + 1, r, depth + 1, id);
                    treeNodes[id].children = [leftId, rightId];
                }
                return id;
            }
            buildTree(0, arr.length - 1, 0, -1);

            // BFS로 레벨별 그룹
            function getTreeLevels() {
                var levels = [];
                var queue = [{ id: 0, depth: 0 }];
                while (queue.length) {
                    var item = queue.shift();
                    if (!levels[item.depth]) levels[item.depth] = [];
                    levels[item.depth].push(treeNodes[item.id]);
                    var ch = treeNodes[item.id].children;
                    for (var c = 0; c < ch.length; c++) queue.push({ id: ch[c], depth: item.depth + 1 });
                }
                return levels;
            }

            // 트리 렌더링: 레벨별 수평 배치 (sorting.js 병합정렬 패턴과 동일)
            function renderMergeTree(activeNodeP, activeNodeR, status) {
                var levels = getTreeLevels();
                var boxStyle = 'display:inline-flex;gap:2px;padding:3px 6px;border-radius:6px;border:1.5px solid var(--border);background:var(--bg2);font-size:0.75rem;font-family:monospace;transition:all 0.3s;';
                var html = '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;min-width:fit-content;">';
                for (var d = 0; d < levels.length; d++) {
                    html += '<div style="display:flex;align-items:center;gap:8px;justify-content:center;">';
                    html += '<span style="font-size:0.6rem;color:var(--text3);min-width:14px;text-align:right;">L' + d + '</span>';
                    html += '<div style="display:flex;gap:6px;justify-content:center;flex-wrap:nowrap;">';
                    for (var i = 0; i < levels[d].length; i++) {
                        var nd = levels[d][i];
                        var isActive = (nd.p === activeNodeP && nd.r === activeNodeR);
                        var border = 'var(--border)';
                        var shadow = '';
                        var bg = 'var(--bg2)';
                        if (isActive && status === 'split') { border = 'var(--accent)'; shadow = 'box-shadow:0 0 8px var(--accent);'; }
                        else if (isActive && status === 'merge') { border = 'var(--yellow)'; shadow = 'box-shadow:0 0 8px var(--yellow);'; bg = 'rgba(253,203,110,0.15)'; }
                        else if (isActive && status === 'done') { border = 'var(--green)'; shadow = 'box-shadow:0 0 8px var(--green);'; bg = 'rgba(0,184,148,0.1)'; }
                        html += '<div style="' + boxStyle + 'border-color:' + border + ';' + shadow + 'background:' + bg + ';">';
                        html += '[' + nd.p + '..' + nd.r + ']';
                        html += '</div>';
                    }
                    html += '</div></div>';
                    if (d < levels.length - 1) {
                        html += '<div style="text-align:center;color:var(--text3);font-size:0.6rem;line-height:1;">\u2502</div>';
                    }
                }
                html += '</div>';
                mergeTreeEl.innerHTML = html;
            }
            renderMergeTree(-1, -1, '');

            // --- 병합 정렬 실행하면서 세부 스텝 기록 ---
            var vizSteps = [];
            var a = arr.slice();
            var saveCnt = 0;
            var kthValue = null;
            var foundK = false;

            function addStep(desc, renderFn) {
                vizSteps.push({ description: desc, render: renderFn });
            }

            // 초기 상태
            var initSnap = a.slice();
            addStep('초기 배열 A = [' + arr.join(', ') + ']. 이 배열을 병합 정렬합니다.', function() {
                mainEl.innerHTML = renderBoxes(initSnap, {});
                tmpEl.innerHTML = '';
                infoEl.innerHTML = '';
                cntEl.textContent = '';
                renderMergeTree(-1, -1, '');
            });

            function recordMergeSort(p, r, depth) {
                if (p >= r) return;
                var q = Math.floor((p + r) / 2);

                // 분할 스텝 — 스냅샷 캡처
                var splitSnap = a.slice();
                var depthLabel = depth === 0 ? '' : ' (깊이 ' + depth + ')';
                addStep(
                    '분할' + depthLabel + ': A[' + p + '..' + r + ']을 A[' + p + '..' + q + ']과 A[' + (q+1) + '..' + r + ']로 나눕니다. 가운데 = (' + p + '+' + r + ')÷2 = ' + q,
                    (function(snap, pp, qq, rr) { return function() {
                        mainEl.innerHTML = renderBoxes(snap, { active: [pp, rr] }) +
                            '<div style="display:flex;justify-content:center;gap:20px;margin-top:10px;">' +
                            '<span style="font-size:0.85rem;color:var(--accent);border:1px dashed var(--accent);border-radius:8px;padding:4px 10px;">왼쪽 [' + pp + '..' + qq + ']</span>' +
                            '<span style="font-size:0.85rem;color:var(--green);border:1px dashed var(--green);border-radius:8px;padding:4px 10px;">오른쪽 [' + (qq+1) + '..' + rr + ']</span>' +
                            '</div>';
                        tmpEl.innerHTML = '';
                        infoEl.innerHTML = '';
                        renderMergeTree(pp, rr, 'split');
                    }; })(splitSnap, p, q, r)
                );

                recordMergeSort(p, q, depth + 1);
                recordMergeSort(q + 1, r, depth + 1);

                // --- 병합 단계: 세부 비교를 매 스텝 기록 ---
                var leftArr = a.slice(p, q + 1);
                var rightArr = a.slice(q + 1, r + 1);
                var mergeStartSnap = a.slice();
                addStep(
                    '병합 시작: 왼쪽 [' + leftArr.join(', ') + ']과 오른쪽 [' + rightArr.join(', ') + ']을 합칩니다.',
                    (function(snap, pp, qq, rr, la, ra) { return function() {
                        mainEl.innerHTML = renderBoxes(snap, { active: [pp, rr] }) +
                            '<div style="display:flex;justify-content:center;gap:20px;margin-top:10px;">' +
                            '<span style="font-size:0.85rem;color:var(--accent);border:1px dashed var(--accent);border-radius:8px;padding:4px 10px;">왼쪽 [' + la.join(', ') + ']</span>' +
                            '<span style="font-size:0.85rem;color:var(--green);border:1px dashed var(--green);border-radius:8px;padding:4px 10px;">오른쪽 [' + ra.join(', ') + ']</span>' +
                            '</div>';
                        tmpEl.innerHTML = renderTmpBoxes([], -1);
                        infoEl.innerHTML = '<span style="color:var(--text2);">i=' + pp + ', j=' + (qq+1) + ' — 양쪽 첫 원소부터 비교합니다</span>';
                        renderMergeTree(pp, rr, 'merge');
                    }; })(mergeStartSnap, p, q, r, leftArr, rightArr)
                );

                var tmp = [];
                var li = 0, ri = 0;
                var leftCopy = leftArr.slice();
                var rightCopy = rightArr.slice();

                // 양쪽 비교 스텝들
                while (li < leftCopy.length && ri < rightCopy.length) {
                    var lv = leftCopy[li], rv = rightCopy[ri];
                    var chosen, side;
                    if (lv <= rv) {
                        chosen = lv; side = 'left'; li++;
                    } else {
                        chosen = rv; side = 'right'; ri++;
                    }
                    tmp.push(chosen);
                    var tmpSnapshot = tmp.slice();
                    var liSnap = li, riSnap = ri;
                    var cmpSnap = mergeStartSnap;

                    addStep(
                        '비교: ' + lv + (side === 'left' ? ' ≤ ' : ' > ') + rv + ' → ' +
                        (side === 'left' ? '왼쪽 ' + chosen : '오른쪽 ' + chosen) +
                        '을 tmp에 넣습니다',
                        (function(snap, pp, rr, ts, lis, ris, lc, rc) { return function() {
                            mainEl.innerHTML = renderBoxes(snap, { active: [pp, rr] });
                            tmpEl.innerHTML = renderTmpBoxes(ts, ts.length - 1);
                            var nextInfo = '';
                            if (lis < lc.length && ris < rc.length) {
                                nextInfo = '다음 비교: 왼쪽[' + lis + ']=' + lc[lis] + ' vs 오른쪽[' + ris + ']=' + rc[ris];
                            } else if (lis < lc.length) {
                                nextInfo = '오른쪽 소진! 왼쪽 나머지를 그대로 tmp에 넣습니다';
                            } else {
                                nextInfo = '왼쪽 소진! 오른쪽 나머지를 그대로 tmp에 넣습니다';
                            }
                            infoEl.innerHTML = '<span style="color:var(--text2);">' + nextInfo + '</span>';
                        }; })(cmpSnap, p, r, tmpSnapshot, liSnap, riSnap, leftCopy, rightCopy)
                    );
                }

                // 나머지 원소 추가
                while (li < leftCopy.length) {
                    tmp.push(leftCopy[li]);
                    li++;
                    var tmpSnap2 = tmp.slice();
                    addStep(
                        '왼쪽 나머지 ' + leftCopy[li - 1] + '을 tmp에 넣습니다',
                        (function(snap, ts, pp, rr) { return function() {
                            mainEl.innerHTML = renderBoxes(snap, { active: [pp, rr] });
                            tmpEl.innerHTML = renderTmpBoxes(ts, ts.length - 1);
                            infoEl.innerHTML = '';
                        }; })(mergeStartSnap, tmpSnap2, p, r)
                    );
                }
                while (ri < rightCopy.length) {
                    tmp.push(rightCopy[ri]);
                    ri++;
                    var tmpSnap3 = tmp.slice();
                    addStep(
                        '오른쪽 나머지 ' + rightCopy[ri - 1] + '을 tmp에 넣습니다',
                        (function(snap, ts, pp, rr) { return function() {
                            mainEl.innerHTML = renderBoxes(snap, { active: [pp, rr] });
                            tmpEl.innerHTML = renderTmpBoxes(ts, ts.length - 1);
                            infoEl.innerHTML = '';
                        }; })(mergeStartSnap, tmpSnap3, p, r)
                    );
                }

                // tmp → A로 복사 (개별 스텝)
                for (var x = 0; x < tmp.length; x++) {
                    a[p + x] = tmp[x];
                    saveCnt++;
                    var isKth = (saveCnt === k);
                    if (isKth) kthValue = tmp[x];
                    var arrSnap = a.slice();
                    var curCnt = saveCnt;
                    var curVal = tmp[x];
                    var curIdx = p + x;

                    addStep(
                        'A[' + curIdx + '] = ' + curVal + ' 저장 (저장 ' + curCnt + '번째)' + (isKth ? ' ← K번째!' : ''),
                        (function(as, ci, cv, cc, ik, pp, rr) { return function() {
                            var hl = {};
                            if (ik) hl.kth = ci;
                            else hl.merged = [pp, rr];
                            mainEl.innerHTML = renderBoxes(as, hl) +
                                renderPointers(as, [{ idx: ci, name: 'A[' + ci + ']' }]);
                            tmpEl.innerHTML = '';
                            cntEl.textContent = '저장 횟수: ' + cc;
                            if (ik) {
                                infoEl.innerHTML = '<div style="padding:8px 14px;background:rgba(108,92,231,0.1);border-radius:10px;border:1px solid var(--accent);color:var(--accent);font-weight:700;">🎯 K=' + cc + '번째 저장값 = ' + cv + '</div>';
                            } else {
                                infoEl.innerHTML = '';
                            }
                            renderMergeTree(pp, rr, 'merge');
                        }; })(arrSnap, curIdx, curVal, curCnt, isKth, p, r)
                    );
                }
            }

            recordMergeSort(0, arr.length - 1, 0);

            // 최종 결과
            var finalKth = kthValue;
            var finalCnt = saveCnt;
            addStep(
                kthValue !== null
                    ? '✅ 완료! 총 ' + finalCnt + '회 저장. K=' + k + '번째 저장값: ' + finalKth
                    : '✅ 완료! 총 ' + finalCnt + '회 저장. K=' + k + '보다 적어서 결과는 -1',
                function() {
                    mainEl.innerHTML = renderBoxes(a, {});
                    tmpEl.innerHTML = '';
                    cntEl.textContent = '저장 횟수: ' + finalCnt;
                    if (finalKth !== null) {
                        infoEl.innerHTML = '<div style="padding:10px 16px;background:rgba(0,206,158,0.1);border-radius:10px;border:1px solid var(--green);color:var(--green);font-weight:700;font-size:1.1rem;">정답: ' + finalKth + '</div>';
                    } else {
                        infoEl.innerHTML = '<div style="padding:10px 16px;background:rgba(255,71,87,0.08);border-radius:10px;border:1px solid var(--red);color:var(--red);font-weight:700;">저장 횟수(' + finalCnt + ')가 K(' + k + ')보다 적습니다 → -1</div>';
                    }
                    renderMergeTree(0, arr.length - 1, 'done');
                }
            );

            // vizSteps를 action/undo 형태로 변환
            var steps = [];
            vizSteps.forEach(function(s, i) {
                steps.push({
                    description: s.description,
                    action: function(dir) { s.render(); },
                    undo: function() { if (i > 0) vizSteps[i - 1].render(); }
                });
            });

            self._initStepController(container, steps, 'merge');

            container.querySelector('#rec-merge-reset').addEventListener('click', function() {
                var arrVal = container.querySelector('#rec-merge-input').value.split(',').map(function(s){ return parseInt(s.trim()); }).filter(function(n){ return !isNaN(n); });
                var kVal = parseInt(container.querySelector('#rec-merge-k').value);
                if (arrVal.length < 2) arrVal = DEFAULT_ARR.slice();
                if (isNaN(kVal) || kVal < 1) kVal = 1;
                self._clearVizState();
                buildAndRender(arrVal, kVal);
            });
        }

        buildAndRender(DEFAULT_ARR, DEFAULT_K);
    },

    // 5. Cantor Set Simulation (boj-4779)
    _renderVizCantorSim(container) {
        var self = this;
        var DEFAULT_N = 2;

        function buildAndRender(n) {
            if (n < 0) n = 0;
            if (n > 3) n = 3;
            var len = Math.pow(3, n);

            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                    '<label style="font-weight:600;">N: <input type="number" id="rec-cantor-n" value="' + n + '" min="0" max="3" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;background:var(--card);color:var(--text);"></label>' +
                    '<button class="btn btn-primary" id="rec-cantor-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('cantor') +
                '<div class="viz-panel"><div class="viz-panel-header"><h3>칸토어 집합 (N=' + n + ', 길이 ' + len + ')</h3></div>' +
                '<div class="viz-panel-body">' +
                '<div id="sim-cantor-display" style="font-family:monospace;font-size:1.1rem;line-height:2.5;letter-spacing:2px;"></div>' +
                '</div></div>' +
                self._createStepControls('cantor');

            var displayEl = container.querySelector('#sim-cantor-display');

            // Build cantor states step by step using BFS-like level processing
            var states = [];
            var arr = [];
            for (var i = 0; i < len; i++) arr.push('-');
            states.push({ desc: '초기: 길이 ' + len + '의 대시 문자열', text: arr.join('') });

            // Recursively gather operations level by level
            var queue = [];
            if (len > 1) queue.push({ start: 0, size: len });

            while (queue.length > 0) {
                var nextQueue = [];
                var arrCopy = arr.slice();
                var descParts = [];
                for (var qi = 0; qi < queue.length; qi++) {
                    var item = queue[qi];
                    var third = item.size / 3;
                    for (var j = item.start + third; j < item.start + 2 * third; j++) {
                        arr[j] = ' ';
                    }
                    descParts.push('cantor(' + item.start + ', ' + item.size + ')');
                    if (third > 1) {
                        nextQueue.push({ start: item.start, size: third });
                        nextQueue.push({ start: item.start + 2 * third, size: third });
                    }
                }
                states.push({
                    desc: descParts.join(', ') + ': 가운데 ' + (queue[0].size / 3) + '칸을 공백으로',
                    text: arr.join('')
                });
                queue = nextQueue;
            }

            function renderText(text) {
                var colored = '';
                for (var j = 0; j < text.length; j++) {
                    if (text[j] === '-') colored += '<span style="background:var(--accent);color:var(--accent);">-</span>';
                    else colored += '<span style="color:var(--text-muted);">\u00B7</span>';
                }
                return '<div>' + colored + '</div>';
            }

            var steps = [];
            states.forEach(function(s, i) {
                steps.push({
                    description: s.desc,
                    action: function() { displayEl.innerHTML = renderText(s.text); },
                    undo: function() {
                        if (i > 0) displayEl.innerHTML = renderText(states[i-1].text);
                        else displayEl.innerHTML = '';
                    }
                });
            });

            if (n === 0) {
                steps.push({ description: '✅ N=0이면 길이 1의 대시 하나!', action: function(){}, undo: function(){} });
            } else {
                steps.push({ description: '✅ 완료! 길이 1이면 더 이상 쪼갤 수 없으므로 멈춤', action: function(){}, undo: function(){} });
            }

            self._initStepController(container, steps, 'cantor');

            container.querySelector('#rec-cantor-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#rec-cantor-n').value);
                if (isNaN(val) || val < 0) val = 0;
                if (val > 3) val = 3;
                self._clearVizState();
                buildAndRender(val);
            });
        }

        buildAndRender(DEFAULT_N);
    },

    // 6. Star Pattern Simulation (boj-2447)
    _renderVizStarSim(container) {
        var self = this;
        var DEFAULT_N = 9;

        function buildAndRender(n) {
            // Validate: must be power of 3
            var validSizes = [3, 9, 27];
            if (validSizes.indexOf(n) === -1) n = 9;

            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                    '<label style="font-weight:600;">N (3의 거듭제곱): ' +
                    '<select id="rec-star-n" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;background:var(--card);color:var(--text);">' +
                        '<option value="3"' + (n===3?' selected':'') + '>3</option>' +
                        '<option value="9"' + (n===9?' selected':'') + '>9</option>' +
                        '<option value="27"' + (n===27?' selected':'') + '>27</option>' +
                    '</select></label>' +
                    '<button class="btn btn-primary" id="rec-star-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('star') +
                '<div class="viz-panel"><div class="viz-panel-header"><h3>별 찍기 - 10 (N=' + n + ')</h3></div>' +
                '<div class="viz-panel-body">' +
                '<pre id="sim-star-display" style="font-family:monospace;font-size:' + (n <= 9 ? '0.75rem' : '0.4rem') + ';line-height:1.2;letter-spacing:1px;"></pre>' +
                '</div></div>' +
                self._createStepControls('star');

            var displayEl = container.querySelector('#sim-star-display');

            function makeGrid(sz) {
                var g = [];
                for (var i = 0; i < sz; i++) {
                    g[i] = [];
                    for (var j = 0; j < sz; j++) g[i][j] = '*';
                }
                return g;
            }

            function blankCenter(grid, r, c, size) {
                var t = size / 3;
                for (var i = r + t; i < r + 2 * t; i++)
                    for (var j = c + t; j < c + 2 * t; j++) grid[i][j] = ' ';
            }

            function gridToStr(grid) {
                return grid.map(function(row) { return row.join(''); }).join('\n');
            }

            // Build level-by-level snapshots
            var states = [];
            var grid = makeGrid(n);
            states.push({ desc: '초기: ' + n + '\u00D7' + n + ' 전체를 *로 채움', text: gridToStr(grid) });

            // Process level by level: first level is the whole grid, then sub-blocks
            var queue = [{ r: 0, c: 0, size: n }];
            while (queue.length > 0) {
                var nextQueue = [];
                var third = queue[0].size / 3;
                if (third < 1) break;
                var descParts = [];
                for (var qi = 0; qi < queue.length; qi++) {
                    var item = queue[qi];
                    blankCenter(grid, item.r, item.c, item.size);
                    if (queue.length <= 8) descParts.push('star(' + item.r + ',' + item.c + ',' + item.size + ')');
                    if (third >= 3) {
                        for (var bi = 0; bi < 3; bi++)
                            for (var bj = 0; bj < 3; bj++)
                                if (bi !== 1 || bj !== 1)
                                    nextQueue.push({ r: item.r + bi * third, c: item.c + bj * third, size: third });
                    }
                }
                var levelDesc = descParts.length <= 8
                    ? descParts.join(', ') + ': 가운데 ' + third + '\u00D7' + third + ' 블록을 공백으로'
                    : queue.length + '개 블록의 가운데 ' + third + '\u00D7' + third + '을 공백으로';
                states.push({ desc: levelDesc, text: gridToStr(grid) });
                queue = nextQueue;
            }

            states.push({ desc: '✅ 완료! 크기 1이면 더 이상 쪼갤 수 없으므로 멈춤', text: gridToStr(grid) });

            var steps = [];
            states.forEach(function(s, i) {
                steps.push({
                    description: s.desc,
                    action: function() { displayEl.textContent = s.text; },
                    undo: function() {
                        if (i > 0) displayEl.textContent = states[i-1].text;
                        else displayEl.textContent = '';
                    }
                });
            });

            self._initStepController(container, steps, 'star');

            container.querySelector('#rec-star-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#rec-star-n').value);
                self._clearVizState();
                buildAndRender(val);
            });
        }

        buildAndRender(DEFAULT_N);
    },

    // 7. Hanoi Tower Simulation (boj-11729)
    _renderVizHanoiSim(container) {
        var self = this;
        var DEFAULT_N = 3;

        function buildAndRender(n) {
            if (n < 1) n = 1;
            if (n > 5) n = 5;
            var totalMoves = Math.pow(2, n) - 1;

            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                    '<label style="font-weight:600;">원판 수: <input type="number" id="rec-hanoi-n" value="' + n + '" min="1" max="5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;background:var(--card);color:var(--text);"></label>' +
                    '<button class="btn btn-primary" id="rec-hanoi-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('hanoi2') +
                '<div class="viz-panel"><div class="viz-panel-header"><h3>하노이 탑 (' + n + '개 원판)</h3>' +
                '<div class="counter">이동: <span id="sim-hanoi-cnt">0</span> / ' + totalMoves + '</div></div>' +
                '<div class="viz-panel-body">' +
                '<div id="sim-hanoi-pegs" class="hanoi-pegs">' +
                    '<div class="hanoi-peg"><div class="peg-label">1</div><div class="peg-rod"></div><div class="peg-disks" id="sim-peg-1"></div></div>' +
                    '<div class="hanoi-peg"><div class="peg-label">2</div><div class="peg-rod"></div><div class="peg-disks" id="sim-peg-2"></div></div>' +
                    '<div class="hanoi-peg"><div class="peg-label">3</div><div class="peg-rod"></div><div class="peg-disks" id="sim-peg-3"></div></div>' +
                '</div></div></div>' +
                self._createStepControls('hanoi2');

            var colors = ['var(--accent)', 'var(--green)', 'var(--red)', 'var(--yellow)', '#00b4d8'];
            var peg1El = container.querySelector('#sim-peg-1');

            for (var i = n; i >= 1; i--) {
                var disk = document.createElement('div');
                disk.className = 'hanoi-disk';
                disk.style.width = (30 + i * 18) + 'px';
                disk.style.background = colors[(i - 1) % colors.length];
                disk.dataset.size = i;
                disk.textContent = i;
                peg1El.appendChild(disk);
            }

            var cntEl = container.querySelector('#sim-hanoi-cnt');
            var moveNum = 0;

            // Generate moves via recursion
            var moves = [];
            var hanoiSolve = function(nd, from, to, via) {
                if (nd === 0) return;
                hanoiSolve(nd - 1, from, via, to);
                moves.push({ disk: nd, from: from, to: to });
                hanoiSolve(nd - 1, via, to, from);
            };
            hanoiSolve(n, 1, 3, 2);

            var steps = [];
            moves.forEach(function(m) {
                steps.push({
                    description: '원판 ' + m.disk + '을 ' + m.from + '번 → ' + m.to + '번 기둥으로 이동 — 위의 작은 원판들을 먼저 치워야 큰 원판을 옮길 수 있으므로',
                    action: function() {
                        var fromEl = container.querySelector('#sim-peg-' + m.from);
                        var toEl = container.querySelector('#sim-peg-' + m.to);
                        var dsk = fromEl.lastChild;
                        if (dsk) toEl.appendChild(dsk);
                        moveNum++;
                        cntEl.textContent = moveNum;
                    },
                    undo: function() {
                        var fromEl = container.querySelector('#sim-peg-' + m.from);
                        var toEl = container.querySelector('#sim-peg-' + m.to);
                        var dsk = toEl.lastChild;
                        if (dsk) fromEl.appendChild(dsk);
                        moveNum--;
                        cntEl.textContent = moveNum;
                    }
                });
            });

            steps.push({ description: '✅ 완료! ' + n + '개 원판을 ' + totalMoves + '번(= 2^' + n + '-1)에 이동', action: function(){}, undo: function(){} });
            self._initStepController(container, steps, 'hanoi2');

            container.querySelector('#rec-hanoi-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#rec-hanoi-n').value);
                if (isNaN(val) || val < 1) val = 1;
                if (val > 5) val = 5;
                self._clearVizState();
                buildAndRender(val);
            });
        }

        buildAndRender(DEFAULT_N);
    },

    // ===== 3단계 문제 구성 =====
    stages: [
        { num: 1, title: '재귀 입문', desc: '기본 재귀 함수 연습', problemIds: ['boj-27433', 'boj-10870'] },
        { num: 2, title: '재귀 활용', desc: '재귀 호출 추적과 이해', problemIds: ['boj-25501', 'boj-24060'] },
        { num: 3, title: '나누어 풀기', desc: '재귀적 패턴과 하노이 탑', problemIds: ['boj-4779', 'boj-2447', 'boj-11729'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 재귀 입문 ==========
        {
            id: 'boj-27433',
            title: 'BOJ 27433 - 팩토리얼 2',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/27433',
            simIntro: 'factorial(5)의 콜 스택이 어떻게 쌓이고 풀리는지 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>0보다 크거나 같은 정수 N이 주어진다. 이때, N!을 출력하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 정수 N(0 ≤ N ≤ 20)이 주어진다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 N!을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>10</pre></div>
                    <div><strong>출력</strong><pre>3628800</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>0</pre></div>
                    <div><strong>출력</strong><pre>1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>0 ≤ N ≤ 20</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '<code>5! = 5 × 4 × 3 × 2 × 1</code>이니까 for문으로 곱하면 되지 않을까? 맞아, 그것도 방법이야! 근데 이 문제는 <strong>재귀</strong>를 연습하는 문제야.' },
                { title: '근데 재귀로는 어떻게?', content: '잘 보면 <code>5! = 5 × 4!</code>이고, <code>4! = 4 × 3!</code>이야. 즉 <code>n! = n × (n-1)!</code> — 큰 문제가 작은 문제로 쪼개지는 구조! 이게 바로 재귀의 핵심이야.<br><br><div style="display:flex;flex-direction:column;gap:2px;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;align-items:center;gap:6px;"><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;">5!</span><span>=</span><span>5</span><span>×</span><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.85;">4!</span></div><div style="display:flex;align-items:center;gap:6px;padding-left:20px;"><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.85;">4!</span><span>=</span><span>4</span><span>×</span><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.7;">3!</span></div><div style="display:flex;align-items:center;gap:6px;padding-left:40px;"><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.7;">3!</span><span>=</span><span>3</span><span>×</span><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.55;">2!</span></div><div style="display:flex;align-items:center;gap:6px;padding-left:60px;"><span style="padding:2px 8px;background:var(--green);color:white;border-radius:4px;">1!</span><span>=</span><span style="font-weight:700;">1</span><span style="color:var(--text3);margin-left:4px;">← 멈춤!</span></div></div>' },
                { title: '멈추는 조건은?', content: '재귀는 반드시 <strong>멈추는 조건</strong>이 필요해. 안 그러면 무한히 호출돼! <code>0! = 1</code>, <code>1! = 1</code>이니까, n이 0 또는 1이면 곱하기를 멈추고 1을 반환하면 돼.' },
                { title: '주의할 점', content: '20!은 약 2,432,902,008,176,640,000이야 — 엄청 큰 수! <span class="lang-py">Python은 큰 수를 자동으로 처리하니까 걱정 없어.</span><span class="lang-cpp">C++에서 <code>int</code>는 약 21억까지만 저장 가능해서 터져! <code>long long</code>을 써야 해 (약 9.2 × 10<sup>18</sup>까지).</span>' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 0, inputMax: 20, inputDefault: 10,
            solve(n) {
                let r = 1;
                for (let i = 2; i <= n; i++) r *= i;
                return `${r}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\ndef factorial(n):\n    # 여기에 재귀 함수를 작성하세요\n    pass\n\nprint(factorial(n))\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    // 여기에 재귀 함수를 작성하세요\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}`
            },
            solutions: [{
                approach: '재귀 풀이',
                description: '팩토리얼의 재귀 정의를 그대로 구현한다',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '함수 정의 + 멈추는 조건', desc: 'n이 1 이하이면 1을 반환', code: 'def factorial(n):\n    if n <= 1:\n        return 1' },
                        { title: '재귀 호출', desc: 'n * factorial(n-1)로 재귀', code: '    return n * factorial(n - 1)' },
                        { title: '입출력', desc: '입력받고 결과 출력', code: 'n = int(input())\nprint(factorial(n))' }
                    ],
                    cpp: [
                        { title: '함수 정의 + 멈추는 조건', desc: 'long long: 20! = 약 2.4×10^18이라 int 범위 초과.', code: '#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    if (n <= 1) return 1;  // 멈추는 조건' },
                        { title: '재귀 호출', desc: 'n * factorial(n-1)로 재귀', code: '    return (long long)n * factorial(n - 1);\n}' },
                        { title: '입출력', desc: 'cin/cout으로 입출력. Python과 달리 main 함수가 필요.', code: 'int main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-10870',
            title: 'BOJ 10870 - 피보나치 수 5',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/10870',
            simIntro: 'fib(5)의 재귀 호출 트리가 어떻게 펼쳐지는지 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>피보나치 수는 0과 1로 시작한다. 0번째 피보나치 수는 0이고, 1번째 피보나치 수는 1이다. 그 다음 2번째부터는 바로 앞 두 피보나치 수의 합이 된다.</p>
                <p>이를 식으로 써보면 Fn = Fn-1 + Fn-2 (n ≥ 2)가 된다.</p>
                <p>n이 주어졌을 때, n번째 피보나치 수를 구하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 n이 주어진다. n은 20보다 작거나 같은 자연수 또는 0이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 n번째 피보나치 수를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>10</pre></div>
                    <div><strong>출력</strong><pre>55</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>0 ≤ n ≤ 20</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '피보나치 수열은 <code>0, 1, 1, 2, 3, 5, 8, 13, ...</code> — 앞 두 수를 더하면 다음 수가 나와! for문으로 앞에서부터 하나씩 구하면 될 것 같은데?' },
                { title: '근데 재귀로는 어떻게?', content: '정의를 다시 보면: <code>fib(n) = fib(n-1) + fib(n-2)</code>. n번째를 구하려면 (n-1)번째와 (n-2)번째가 필요하고, 그것들도 같은 방식으로 구해! 이게 재귀적 구조야.' },
                { title: '멈추는 조건이 두 개!', content: '팩토리얼은 멈추는 조건이 1개였지만, 피보나치는 <strong>2개</strong> 필요해: <code>fib(0) = 0</code>, <code>fib(1) = 1</code>. 두 개가 없으면 <code>fib(1) → fib(0) + fib(-1)</code>로 끝없이 내려가!' },
                { title: '이 풀이의 한계는?', content: 'n ≤ 20이라 이 문제에선 괜찮지만, 순수 재귀는 <strong>같은 값을 여러 번 계산</strong>해. fib(5)를 구하면 fib(2)를 3번이나 계산해! n이 커지면 시간 복잡도가 O(2<sup>n</sup>)으로 폭발해. 나중에 DP(동적 프로그래밍)에서 이걸 해결하는 법을 배울 거야!<br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:32px;height:20px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.7rem;color:var(--text2);margin-top:3px;">n=5<br>15번</div></div><div style="text-align:center;"><div style="width:32px;height:50px;background:var(--yellow);border-radius:4px 4px 0 0;"></div><div style="font-size:0.7rem;color:var(--text2);margin-top:3px;">n=10<br>177번</div></div><div style="text-align:center;"><div style="width:32px;height:100px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.7rem;color:var(--text2);margin-top:3px;">n=20<br>2만번</div></div><div style="text-align:center;"><div style="width:32px;height:130px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.6;"></div><div style="font-size:0.7rem;color:var(--text2);margin-top:3px;">n=40<br>3억번!</div></div></div>' }
            ],
            inputLabel: '입력값 (n)',
            inputMin: 0, inputMax: 20, inputDefault: 10,
            solve(n) {
                function fib(n) { if (n <= 1) return n; return fib(n-1) + fib(n-2); }
                return `${fib(n)}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\ndef fib(n):\n    # 여기에 재귀 함수를 작성하세요\n    pass\n\nprint(fib(n))\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    // 여기에 재귀 함수를 작성하세요\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << fib(n) << endl;\n    return 0;\n}`
            },
            solutions: [{
                approach: '재귀 풀이',
                description: '피보나치의 재귀 정의를 그대로 구현한다',
                timeComplexity: 'O(2^n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '함수 정의 + 멈추는 조건', desc: 'n이 0이면 0, 1이면 1 반환', code: 'def fib(n):\n    if n == 0: return 0\n    if n == 1: return 1' },
                        { title: '재귀 호출', desc: 'fib(n-1) + fib(n-2)로 재귀', code: '    return fib(n-1) + fib(n-2)' },
                        { title: '입출력', desc: '입력받고 결과 출력', code: 'n = int(input())\nprint(fib(n))' }
                    ],
                    cpp: [
                        { title: '함수 정의 + 멈추는 조건', desc: 'n ≤ 20이므로 int 범위 충분.', code: '#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;' },
                        { title: '재귀 호출', desc: '앞 두 피보나치 수의 합을 재귀로 구한다.', code: '    return fib(n - 1) + fib(n - 2);\n}' },
                        { title: '입출력', desc: 'cin/cout으로 입출력. main 함수에서 fib 호출.', code: 'int main() {\n    int n;\n    cin >> n;\n    cout << fib(n) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[1].templates; }
            }]
        },
        // ========== 2단계: 재귀 활용 ==========
        {
            id: 'boj-25501',
            title: 'BOJ 25501 - 재귀의 귀재',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/25501',
            simIntro: '회문 검사 재귀가 양쪽 끝에서 어떻게 좁혀가는지 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수를 문자열로 변환한 다음, 그 문자열이 팰린드롬인지 재귀 함수를 이용해 판별하려 한다. 아래와 같이 재귀 함수 isPalindrome과 recursion이 주어졌을 때, 각 문자열에 대해 팰린드롬 여부(1 또는 0)와 재귀 함수 recursion의 호출 횟수를 출력하시오.</p>
                <pre style="background:var(--bg);padding:1rem;border-radius:8px;border:1px solid var(--border);font-size:0.85rem;line-height:1.6;overflow-x:auto;">recursion(s, l, r){
    if(l >= r) return 1
    else if(s[l] != s[r]) return 0
    else return recursion(s, l+1, r-1)
}

isPalindrome(s){
    return recursion(s, 0, length(s)-1)
}</pre>
                <p>위 의사 코드에서 <code>recursion</code> 함수의 호출 횟수를 세는 것이 핵심이다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 테스트케이스의 개수 T가 주어진다. (1 ≤ T ≤ 1,000)</p>
                <p>둘째 줄부터 T개의 줄에 알파벳 대문자로 구성된 문자열 S가 주어진다. (1 ≤ |S| ≤ 1,000)</p>
                <h4>출력</h4>
                <p>각 테스트케이스마다, isPalindrome 함수의 반환값과 recursion 함수의 호출 횟수를 한 줄에 공백으로 구분하여 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3
AAA
ABBA
ABCDA</pre></div>
                    <div><strong>출력</strong><pre>1 2
1 3
0 3</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ T ≤ 1,000</li>
                    <li>1 ≤ 문자열 길이 ≤ 1,000</li>
                    <li>문자열은 알파벳 대문자</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '문제에서 재귀 함수 <code>recursion(s, l, r)</code>이 이미 주어졌어! 양쪽 끝 글자를 비교하고, 같으면 안쪽으로 좁혀가는 구조야. 일단 그대로 구현하면 회문 판별은 되는데... 호출 횟수는 어떻게 세지?' },
                { title: '근데 호출 횟수를 어떻게 세?', content: '<code>recursion</code> 함수가 실행될 때마다 "나 한 번 호출됐어!"를 기록하면 돼. 함수 안 맨 첫 줄에 카운터를 1 증가시키면, 호출될 때마다 자동으로 세지!<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;flex-wrap:wrap;"><span style="color:var(--text2);">A<u>B</u>BA:</span><span style="padding:2px 8px;background:var(--green);color:white;border-radius:4px;">A=A ✓</span><span style="padding:2px 8px;background:var(--green);color:white;border-radius:4px;">B=B ✓</span><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;">끝!</span><span style="color:var(--text3);margin-left:4px;">cnt = 3</span></div> <span class="lang-py"><code>global cnt</code>로 전역 변수를 쓰거나</span><span class="lang-cpp">전역 변수 <code>int cnt</code>를 쓰거나</span> 하면 돼.' },
                { title: '이렇게 하면 어떨까?', content: '매 테스트케이스마다 카운터를 0으로 <strong>초기화</strong>하는 걸 잊지 마! 안 그러면 이전 문자열의 횟수가 누적돼. <code>isPalindrome</code> 안에서 <code>cnt = 0</code>으로 리셋하고 <code>recursion</code>을 호출하면 깔끔해.' },
                { title: '호출 횟수 패턴', content: '회문이면 양쪽 끝에서 가운데까지 가니까 <code>(길이+1)//2</code>번 호출돼. 회문이 아니면? 불일치가 발생하는 위치까지만! 예: "ABCDA"는 A=A → B≠D에서 멈추니까 3번 (첫 호출 포함 — l=0 비교, l=1 비교에서 불일치).' }
            ],
            inputLabel: '입력값 (n)',
            inputMin: 1, inputMax: 1, inputDefault: 1,
            solve(n) { return `1 2`; },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\ndef recursion(s, l, r):\n    # 주어진 코드를 구현하되, 호출 횟수를 세세요\n    pass\n\ndef isPalindrome(s):\n    return recursion(s, 0, len(s)-1)\n\nT = int(input())\nfor _ in range(T):\n    s = input().strip()\n    # 결과와 호출 횟수를 출력하세요\n`,
                cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint cnt;\n\nint recursion(string s, int l, int r) {\n    cnt++;\n    // 여기에 재귀 함수를 작성하세요\n    return 0;\n}\n\nint main() {\n    int T;\n    cin >> T;\n    while (T--) {\n        string s;\n        cin >> s;\n        cnt = 0;\n        int result = recursion(s, 0, s.length()-1);\n        cout << result << " " << cnt << endl;\n    }\n    return 0;\n}`
            },
            solutions: [{
                approach: '재귀 + 카운터',
                description: '주어진 재귀 함수에 전역 카운터를 추가하여 호출 횟수를 센다',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'recursion 함수', desc: '전역 카운터를 두고 재귀 호출마다 증가', code: 'cnt = 0\ndef recursion(s, l, r):\n    global cnt\n    cnt += 1\n    if l >= r: return 1\n    if s[l] != s[r]: return 0\n    return recursion(s, l+1, r-1)' },
                        { title: 'isPalindrome', desc: '카운터를 초기화하고 recursion 호출', code: 'def isPalindrome(s):\n    global cnt\n    cnt = 0\n    return recursion(s, 0, len(s)-1)' },
                        { title: '입출력', desc: 'T개의 문자열에 대해 결과 출력', code: 'T = int(input())\nfor _ in range(T):\n    s = input()\n    print(isPalindrome(s), cnt)' }
                    ],
                    cpp: [
                        { title: 'recursion 함수', desc: '전역 cnt로 호출 횟수 카운팅.\nstring을 참조(&)로 전달하여 복사 비용 절감.', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint cnt;  // 전역 카운터\n\nint recursion(string& s, int l, int r) {\n    cnt++;  // 호출될 때마다 증가\n    if (l >= r) return 1;       // 회문\n    if (s[l] != s[r]) return 0; // 불일치\n    return recursion(s, l + 1, r - 1);\n}' },
                        { title: '입출력', desc: 'while(T--)로 테스트케이스 반복. 매번 cnt를 0으로 초기화.', code: 'int main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int T;\n    cin >> T;\n    while (T--) {\n        string s;\n        cin >> s;\n        cnt = 0;  // 매 테스트케이스마다 초기화\n        int result = recursion(s, 0, s.length() - 1);\n        cout << result << " " << cnt << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-24060',
            title: 'BOJ 24060 - 알고리즘 수업: 병합 정렬 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24060',
            simIntro: '병합 정렬의 분할과 병합 과정에서 값이 저장되는 순서를 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>오늘도 서준이는 병합 정렬 수업 조교를 맡았다. 아래는 오름차순으로 정렬하는 병합 정렬 의사 코드이다.</p>
                <pre style="background:var(--bg);padding:1rem;border-radius:8px;border:1px solid var(--border);font-size:0.85rem;line-height:1.6;overflow-x:auto;">merge_sort(A, p, r):
    if p < r
        q = ⌊(p + r) / 2⌋
        merge_sort(A, p, q)
        merge_sort(A, q + 1, r)
        merge(A, p, q, r)

merge(A, p, q, r):
    i = p, j = q + 1, t = 1
    while i ≤ q and j ≤ r
        if A[i] ≤ A[j]
            tmp[t++] = A[i++]
        else
            tmp[t++] = A[j++]
    while i ≤ q
        tmp[t++] = A[i++]
    while j ≤ r
        tmp[t++] = A[j++]
    i = p, t = 1
    while i ≤ r
        A[i++] = tmp[t++]    # 이 부분이 "저장"</pre>
                <p>배열 A가 주어졌을 때, 병합 정렬로 배열을 오름차순으로 정렬할 경우 배열 A에 K번째로 저장되는 수를 구하는 프로그램을 작성하시오. 저장 횟수가 K보다 작으면 -1을 출력한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 배열 A의 크기 N(5 ≤ N ≤ 500,000), 저장 횟수 K(1 ≤ K ≤ 10<sup>8</sup>)가 주어진다.</p>
                <p>다음 줄에 서로 다른 배열 A의 원소 A<sub>1</sub>, A<sub>2</sub>, ..., A<sub>N</sub>이 주어진다. (1 ≤ A<sub>i</sub> ≤ 10<sup>9</sup>)</p>
                <h4>출력</h4>
                <p>배열 A에 K번째 저장 되는 수를 출력한다. 저장 횟수가 K보다 작으면 -1을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 7
4 5 1 3 2</pre></div>
                    <div><strong>출력</strong><pre>-1</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 6
4 5 1 3 2</pre></div>
                    <div><strong>출력</strong><pre>2</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 500,000</li>
                    <li>1 ≤ K ≤ N²</li>
                    <li>1 ≤ A[i] ≤ 10<sup>9</sup></li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '병합 정렬을 그냥 구현하면 정렬은 되는데... 문제는 "K번째로 저장되는 수"를 찾는 거야. 정렬 과정에서 배열에 값이 <strong>써지는 순서</strong>를 추적해야 해. 어디서 값이 써지지?' },
                { title: '어디서 값이 저장되는 걸까?', content: '<strong>merge 단계</strong>에서야! 병합 정렬은 "나누기(분할)"와 "합치기(병합)" 두 단계인데, 실제로 배열 A에 값이 복사되는 건 merge 할 때뿐이야. 임시 배열에서 A로 값을 옮겨 쓸 때마다 1번 저장되는 거지.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;"><div style="display:flex;gap:4px;margin-bottom:6px;"><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;">4</span><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;">5</span><span style="color:var(--text3);margin:0 4px;">+</span><span style="padding:3px 8px;background:#00b894;color:white;border-radius:4px;">1</span><span style="padding:3px 8px;background:#00b894;color:white;border-radius:4px;">3</span></div><div style="display:flex;gap:4px;align-items:center;"><span style="color:var(--text3);">→</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;border:1px solid var(--yellow);">1</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;border:1px solid var(--yellow);">3</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;border:1px solid var(--yellow);">4</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;border:1px solid var(--yellow);">5</span><span style="color:var(--text3);margin-left:4px;">저장 4번!</span></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '전역 카운터 <code>cnt</code>를 만들어서, merge에서 A에 값을 쓸 때마다 <code>cnt += 1</code>. cnt가 K가 되는 순간의 값을 <code>result</code>에 저장하면 끝! merge_sort 자체의 재귀 구조(<code>q = (p+r)//2</code>로 반 나누고, 왼쪽/오른쪽 각각 정렬 후 merge)는 교과서 그대로 구현하면 돼.' },
                { title: '주의할 점', content: '총 저장 횟수가 K보다 적으면 <code>-1</code>을 출력해야 해. result 초기값을 -1로 두면 K번째가 없을 때 자동으로 -1이 출력돼서 편해! <span class="lang-py">N이 50만이라 재귀 깊이가 깊어질 수 있어 — <code>sys.setrecursionlimit(600000)</code>을 잊지 마!</span><span class="lang-cpp">전역 배열을 사용하면 스택 오버플로 걱정 없이 깔끔해.</span>' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 5, inputMax: 20, inputDefault: 5,
            solve(n) {
                const arr = [4, 5, 1, 3, 2];
                const saved = [];
                const mergeSort = (a, p, r) => {
                    if (p >= r) return;
                    const q = Math.floor((p + r) / 2);
                    mergeSort(a, p, q);
                    mergeSort(a, q + 1, r);
                    const tmp = [];
                    let i = p, j = q + 1;
                    while (i <= q && j <= r) {
                        if (a[i] <= a[j]) tmp.push(a[i++]);
                        else tmp.push(a[j++]);
                    }
                    while (i <= q) tmp.push(a[i++]);
                    while (j <= r) tmp.push(a[j++]);
                    for (let k = 0; k < tmp.length; k++) {
                        a[p + k] = tmp[k];
                        saved.push(tmp[k]);
                    }
                };
                mergeSort([...arr], 0, arr.length - 1);
                return saved.length >= 7 ? `${saved[6]}` : '-1';
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(600000)\n\nN, K = map(int, input().split())\nA = list(map(int, input().split()))\n\ncnt = 0\nresult = -1\n\ndef merge_sort(A, p, r):\n    # 여기에 병합 정렬을 구현하세요\n    # merge 단계에서 A에 저장할 때마다 cnt를 증가\n    pass\n\nmerge_sort(A, 0, N-1)\nprint(result)\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nint A[500001], tmp[500001];\nint N, K, cnt = 0, result = -1;\n\nvoid merge(int p, int q, int r) {\n    // 여기에 병합 함수를 작성하세요\n}\n\nvoid merge_sort(int p, int r) {\n    if (p >= r) return;\n    int q = (p + r) / 2;\n    merge_sort(p, q);\n    merge_sort(q + 1, r);\n    merge(p, q, r);\n}\n\nint main() {\n    cin >> N >> K;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    merge_sort(0, N-1);\n    cout << result << endl;\n    return 0;\n}`
            },
            solutions: [{
                approach: '병합 정렬 추적',
                description: '병합 정렬을 구현하면서 merge 단계의 저장 순서를 카운팅한다',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'merge 함수', desc: '두 정렬된 구간을 병합하며 저장 횟수 카운팅', code: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(600000)\n\ncnt = 0\nresult = -1\n\ndef merge(A, p, q, r):\n    global cnt, result\n    tmp = []\n    i, j = p, q + 1\n    while i <= q and j <= r:\n        if A[i] <= A[j]:\n            tmp.append(A[i]); i += 1\n        else:\n            tmp.append(A[j]); j += 1\n    while i <= q:\n        tmp.append(A[i]); i += 1\n    while j <= r:\n        tmp.append(A[j]); j += 1\n    for k in range(len(tmp)):\n        A[p + k] = tmp[k]\n        cnt += 1\n        if cnt == K:\n            result = tmp[k]' },
                        { title: 'merge_sort 재귀', desc: '반으로 나눠서 각각 정렬 후 병합', code: 'def merge_sort(A, p, r):\n    if p >= r: return\n    q = (p + r) // 2\n    merge_sort(A, p, q)\n    merge_sort(A, q + 1, r)\n    merge(A, p, q, r)' },
                        { title: 'K번째 체크', desc: '결과가 이미 나왔으면 바로 종료할 수도 있음', code: '# K번째 저장값을 찾으면 result에 저장됨' },
                        { title: '입출력', desc: '입력 받고 merge_sort 실행 후 결과 출력', code: 'N, K = map(int, input().split())\nA = list(map(int, input().split()))\nmerge_sort(A, 0, N - 1)\nprint(result)' }
                    ],
                    cpp: [
                        { title: 'merge 함수', desc: '전역 배열 A, tmp로 병합.\n저장할 때마다 cnt 증가, K번째면 result에 저장.', code: '#include <iostream>\nusing namespace std;\n\nint A[500001], tmp[500001];\nint N, K, cnt = 0, result = -1;\n\nvoid merge(int p, int q, int r) {\n    int i = p, j = q + 1, idx = p;\n    while (i <= q && j <= r) {\n        if (A[i] <= A[j]) tmp[idx++] = A[i++];\n        else tmp[idx++] = A[j++];\n    }\n    while (i <= q) tmp[idx++] = A[i++];\n    while (j <= r) tmp[idx++] = A[j++];\n    // A에 복사하면서 카운팅\n    for (int k = p; k <= r; k++) {\n        A[k] = tmp[k];\n        cnt++;\n        if (cnt == K) result = tmp[k];\n    }\n}' },
                        { title: 'merge_sort 재귀', desc: '반으로 나눠서 각각 정렬 후 merge로 합친다.', code: 'void merge_sort(int p, int r) {\n    if (p >= r) return;\n    int q = (p + r) / 2;\n    merge_sort(p, q);\n    merge_sort(q + 1, r);\n    merge(p, q, r);\n}' },
                        { title: '입출력', desc: '전역 배열에 입력 후 merge_sort 실행, result 출력.', code: 'int main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    cin >> N >> K;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    merge_sort(0, N - 1);\n    cout << result << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[3].templates; }
            }]
        },
        // ========== 3단계: 나누어 풀기 ==========
        {
            id: 'boj-4779',
            title: 'BOJ 4779 - 칸토어 집합',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/4779',
            simIntro: '칸토어 집합에서 가운데 1/3이 어떻게 재귀적으로 빠지는지 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>칸토어 집합은 0과 1 사이의 실수로 이루어진 집합으로, [0, 1]에서 시작하여 각 구간을 3등분하여 가운데 구간을 제거하는 작업을 무한히 반복하여 얻어진다. 길이가 3^N인 문자열에서 시작하여, 가운데 1/3을 공백으로 바꾸는 과정을 반복한다. 입력이 없을 때까지 반복.</p>
                <h4>입력</h4>
                <p>입력을 여러 줄로 이루어져 있다. 각 줄에 N이 주어진다. 파일의 끝에서 입력을 멈춘다. N은 0보다 크거나 같고, 12보다 작거나 같은 정수이다.</p>
                <h4>출력</h4>
                <p>입력으로 주어진 N에 대해서, 해당하는 칸토어 집합의 근사를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>0</pre></div>
                    <div><strong>출력</strong><pre>-</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>1</pre></div>
                    <div><strong>출력</strong><pre>- -</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3</pre></div>
                    <div><strong>출력</strong><pre>- -   - -         - -   - -</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>0 ≤ N ≤ 12</li>
                    <li>입력이 없을 때까지 반복 (EOF)</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: 'N=2면 길이 9짜리 <code>---------</code>에서 가운데 3개를 공백으로 바꾸면... <code>---   ---</code>? 근데 양쪽 <code>---</code> 안에서도 또 가운데를 빼야 해! 한 번만 하는 게 아니라 <strong>반복적으로 쪼개야</strong> 하는 구조네.' },
                { title: '이건 재귀 구조야!', content: '길이 len인 구간을 3등분해서: ① 왼쪽 1/3에 재귀 ② 가운데 1/3을 공백으로 ③ 오른쪽 1/3에 재귀. "전체에서 가운데를 빼고, 남은 양쪽에서도 같은 걸 반복" — 전형적인 분할 정복이야!<br><br><div style="display:flex;flex-direction:column;gap:4px;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;font-family:monospace;"><div><span style="color:var(--accent);">N=0:</span> <span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span></div><div><span style="color:var(--accent);">N=1:</span> <span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span><span style="opacity:0.3;"> </span><span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span></div><div><span style="color:var(--accent);">N=2:</span> <span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span><span style="opacity:0.3;"> </span><span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span><span style="opacity:0.3;">   </span><span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span><span style="opacity:0.3;"> </span><span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span></div></div>' },
                { title: '멈추는 조건은?', content: '길이가 1이면 더 이상 3등분할 수 없어 — 그냥 <code>-</code> 하나니까 return! 구현 팁: 처음에 길이 3<sup>N</sup>짜리 배열을 전부 <code>-</code>로 채운 뒤, 재귀적으로 가운데를 공백으로 <strong>덮어쓰는</strong> 방식이 깔끔해.' },
                { title: 'EOF 입력 처리', content: '이 문제는 입력이 여러 줄이고, 몇 줄인지 안 알려줘 (EOF까지 반복). <span class="lang-py">Python: <code>while True: try: ... except: break</code>로 입력이 없을 때까지 반복!</span><span class="lang-cpp">C++: <code>while(cin &gt;&gt; n)</code>으로 EOF까지 반복! 입력이 없으면 자동으로 루프가 끝나.</span>' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 0, inputMax: 5, inputDefault: 2,
            solve(n) {
                const len = Math.pow(3, n);
                const arr = new Array(len).fill('-');
                const cantor = (start, size) => {
                    if (size <= 1) return;
                    const third = size / 3;
                    for (let i = start + third; i < start + 2 * third; i++) arr[i] = ' ';
                    cantor(start, third);
                    cantor(start + 2 * third, third);
                };
                cantor(0, len);
                return arr.join('');
            },
            templates: {
                python: `import sys\n\ndef cantor(arr, start, size):\n    # 여기에 재귀 함수를 작성하세요\n    # 가운데 1/3을 공백으로 바꾸고, 양쪽 1/3에 대해 재귀\n    pass\n\nwhile True:\n    try:\n        n = int(input())\n        length = 3 ** n\n        arr = list('-' * length)\n        cantor(arr, 0, length)\n        print(''.join(arr))\n    except:\n        break\n`,
                cpp: `#include <iostream>\n#include <cstring>\n#include <cmath>\nusing namespace std;\n\nchar arr[600000];\n\nvoid cantor(int start, int size) {\n    // 여기에 재귀 함수를 작성하세요\n}\n\nint main() {\n    int n;\n    while (cin >> n) {\n        int len = pow(3, n);\n        memset(arr, '-', len);\n        arr[len] = '\\0';\n        cantor(0, len);\n        cout << arr << endl;\n    }\n    return 0;\n}`
            },
            solutions: [{
                approach: '배열 재귀',
                description: '배열을 만들고 재귀적으로 가운데 1/3을 공백으로 바꾼다',
                timeComplexity: 'O(3^n)',
                spaceComplexity: 'O(3^n)',
                codeSteps: {
                    python: [
                        { title: 'cantor 재귀 함수', desc: '가운데 1/3을 공백으로 바꾸고 양쪽에 재귀', code: 'def cantor(arr, start, size):\n    if size <= 1:\n        return\n    third = size // 3\n    for i in range(start + third, start + 2 * third):\n        arr[i] = " "\n    cantor(arr, start, third)\n    cantor(arr, start + 2 * third, third)' },
                        { title: '문자열 초기화 + 호출', desc: '대시 배열을 만들고 cantor 호출', code: 'n = int(input())\nlength = 3 ** n\narr = list("-" * length)\ncantor(arr, 0, length)\nprint("".join(arr))' },
                        { title: 'EOF 처리', desc: 'try/except로 여러 줄 입력 처리', code: 'while True:\n    try:\n        n = int(input())\n        length = 3 ** n\n        arr = list("-" * length)\n        cantor(arr, 0, length)\n        print("".join(arr))\n    except:\n        break' }
                    ],
                    cpp: [
                        { title: 'cantor 재귀 함수', desc: 'memset으로 가운데 1/3을 공백으로.\n양쪽 1/3에 대해 재귀 호출.', code: '#include <iostream>\n#include <cstring>\n#include <cmath>\nusing namespace std;\n\nchar arr[600000];\n\nvoid cantor(int start, int size) {\n    if (size <= 1) return;\n    int t = size / 3;\n    // 가운데 1/3을 공백으로\n    memset(arr + start + t, \' \', t);\n    cantor(start, t);         // 왼쪽 1/3\n    cantor(start + 2 * t, t); // 오른쪽 1/3\n}' },
                        { title: 'EOF 처리 + 출력', desc: 'while(cin >> n)으로 EOF까지 반복.\nmemset으로 대시 초기화 후 cantor 호출.', code: 'int main() {\n    int n;\n    while (cin >> n) {\n        int len = (int)pow(3, n);\n        memset(arr, \'-\', len);  // 대시로 초기화\n        arr[len] = \'\\0\';       // 널 종료\n        cantor(0, len);\n        cout << arr << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-2447',
            title: 'BOJ 2447 - 별 찍기 - 10',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2447',
            simIntro: '9x9 별 패턴에서 가운데 블록이 재귀적으로 비워지는 과정을 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>재귀적인 패턴으로 별을 찍어 보자. N이 3의 거듭제곱(3, 9, 27, ...)이라고 할 때, 크기 N의 패턴은 N×N 정사각형 모양이다. 크기 3의 패턴은 가운데가 비어있는 3×3 패턴이고, 크기 N의 패턴은 가운데가 비어있는 (N/3)×(N/3) 패턴을 크기 N/3의 패턴 8개로 둘러싼 형태이다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 N이 주어진다. N은 3의 거듭제곱이다. 즉 어떤 정수 k에 대해 N=3<sup>k</sup>이며, 이때 1 ≤ k < 8이다.</p>
                <h4>출력</h4>
                <p>첫째 줄부터 N번째 줄까지 별을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>27</pre></div>
                    <div><strong>출력</strong><pre>(27×27 star pattern)</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>N은 3의 거듭제곱</li>
                    <li>3 ≤ N ≤ 2,187 (3<sup>7</sup>)</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '크기 3이면 가운데만 비운 3×3 패턴이야. 크기 9면? 9×9를 3×3 블록 9개로 나눠서 가운데 블록을 통째로 비우고, 나머지 8개 블록 안에서도 같은 패턴을 반복... 이거 칸토어 집합이랑 비슷한데, 1차원이 아니라 <strong>2차원</strong>이네!' },
                { title: '이건 2D 재귀야!', content: '칸토어 집합은 3등분(1D)이었다면, 이건 <strong>9등분(3×3, 2D)</strong>이야! 크기 size의 블록을 <code>third = size / 3</code>으로 나눠서, 가운데(i=1, j=1) 블록을 공백으로 채우고, 나머지 8개 블록에 재귀. 전체를 <code>*</code>로 먼저 채운 뒤 공백으로 "파내는" 방식이 편해.<br><br><div style="display:inline-grid;grid-template-columns:repeat(3,28px);gap:2px;padding:6px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">★</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">★</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">★</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">★</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;"> </span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">★</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">★</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">★</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">★</span></div> <span style="font-size:0.82rem;color:var(--text2);">← 가운데만 비움!</span>' },
                { title: '좌표 계산은 어떻게?', content: '(row, col)에서 시작하는 size×size 블록이면, 9개 블록은 <code>(row + i*third, col + j*third)</code>에서 i,j = 0,1,2. 가운데는 i=1, j=1일 때! 나머지 8개(<code>i != 1 || j != 1</code>)에 대해 재귀하면 돼.' },
                { title: '멈추는 조건 + 구현 팁', content: 'size가 1이면 더 이상 쪼갤 수 없으니 return! <span class="lang-py">Python: 2D 리스트 <code>[["*"] * n for _ in range(n)]</code>으로 초기화.</span><span class="lang-cpp">C++: 전역 <code>char grid[2200][2200]</code>을 <code>memset(grid, \'*\', sizeof(grid))</code>로 초기화. 출력 시 각 행 끝에 <code>grid[i][N] = \'\\0\'</code>을 넣어줘야 깔끔하게 잘려.</span>' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 3, inputMax: 27, inputDefault: 9,
            solve(n) {
                const grid = Array.from({ length: n }, () => new Array(n).fill('*'));
                const star = (r, c, size) => {
                    if (size <= 1) return;
                    const t = size / 3;
                    for (let i = r + t; i < r + 2 * t; i++)
                        for (let j = c + t; j < c + 2 * t; j++) grid[i][j] = ' ';
                    for (let i = 0; i < 3; i++)
                        for (let j = 0; j < 3; j++)
                            if (i !== 1 || j !== 1) star(r + i * t, c + j * t, t);
                };
                star(0, 0, n);
                return grid.map(row => row.join('')).join('\n');
            },
            templates: {
                python: `import sys\n\nn = int(input())\ngrid = [['*'] * n for _ in range(n)]\n\ndef star(r, c, size):\n    # 여기에 재귀 함수를 작성하세요\n    # 가운데 블록을 공백으로 바꾸고, 나머지 8블록에 재귀\n    pass\n\nstar(0, 0, n)\nfor row in grid:\n    print(''.join(row))\n`,
                cpp: `#include <iostream>\n#include <cstring>\nusing namespace std;\n\nchar grid[2200][2200];\nint N;\n\nvoid star(int r, int c, int size) {\n    // 여기에 재귀 함수를 작성하세요\n}\n\nint main() {\n    cin >> N;\n    memset(grid, '*', sizeof(grid));\n    star(0, 0, N);\n    for (int i = 0; i < N; i++) {\n        grid[i][N] = '\\0';\n        cout << grid[i] << '\\n';\n    }\n    return 0;\n}`
            },
            solutions: [{
                approach: '2D 배열 재귀',
                description: '전체를 *로 채운 뒤 재귀적으로 가운데 블록을 공백으로 바꾼다',
                timeComplexity: 'O(n^2)',
                spaceComplexity: 'O(n^2)',
                codeSteps: {
                    python: [
                        { title: 'star 재귀 함수', desc: '가운데 블록을 공백으로 바꾸고 8개 블록에 재귀', code: 'def star(r, c, size):\n    if size <= 1:\n        return\n    t = size // 3\n    for i in range(r + t, r + 2 * t):\n        for j in range(c + t, c + 2 * t):\n            grid[i][j] = " "\n    for i in range(3):\n        for j in range(3):\n            if i != 1 or j != 1:\n                star(r + i * t, c + j * t, t)' },
                        { title: '그리드 생성 + 호출', desc: 'N×N 그리드를 *로 채우고 star 호출', code: 'n = int(input())\ngrid = [["*"] * n for _ in range(n)]\nstar(0, 0, n)' },
                        { title: '출력', desc: '각 행을 문자열로 변환하여 출력', code: 'for row in grid:\n    print("".join(row))' }
                    ],
                    cpp: [
                        { title: 'star 재귀 함수', desc: '2D char 배열에서 가운데 블록을 공백으로.\n9블록 중 가운데(i=1,j=1) 제외 8개에 재귀.', code: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nchar grid[2200][2200];  // 전역: 3^7 = 2187\nint N;\n\nvoid star(int r, int c, int size) {\n    if (size <= 1) return;\n    int t = size / 3;\n    // 가운데 블록을 공백으로\n    for (int i = r + t; i < r + 2 * t; i++)\n        for (int j = c + t; j < c + 2 * t; j++)\n            grid[i][j] = \' \';\n    // 나머지 8개 블록에 재귀\n    for (int i = 0; i < 3; i++)\n        for (int j = 0; j < 3; j++)\n            if (i != 1 || j != 1)\n                star(r + i * t, c + j * t, t);\n}' },
                        { title: '그리드 생성 + 출력', desc: 'memset으로 * 초기화 후 star 호출.\n각 행 끝에 널 문자로 잘라서 출력.', code: 'int main() {\n    cin >> N;\n    memset(grid, \'*\', sizeof(grid));\n    star(0, 0, N);\n    for (int i = 0; i < N; i++) {\n        grid[i][N] = \'\\0\';  // 행 끝 표시\n        cout << grid[i] << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-11729',
            title: 'BOJ 11729 - 하노이 탑 이동 순서',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11729',
            simIntro: '3개 원판의 하노이 탑이 7번의 이동으로 어떻게 옮겨지는지 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>세 개의 장대가 있고 첫 번째 장대에 반경이 서로 다른 n개의 원판이 쌓여 있다. 이 원판을 다음과 같은 규칙에 따라 세 번째 장대로 옮기려 한다. 한 번에 한 개의 원판만을 다른 탑으로 옮길 수 있다. 쌓아 놓은 원판은 항상 위의 것이 아래의 것보다 작아야 한다. 이 작업을 수행하는데 필요한 이동 순서를 출력하는 프로그램을 작성하라. 단, 이동 횟수는 최소가 되어야 한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 첫 번째 장대에 쌓인 원판의 개수 N (1 ≤ N ≤ 20)이 주어진다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 옮긴 횟수 K를 출력한다.</p>
                <p>두 번째 줄부터 수행 과정을 출력한다. 두 번째 줄부터 K개의 줄에 걸쳐 두 정수 A B를 빈칸을 사이에 두고 출력하는데, 이는 A번째 탑의 가장 위에 있는 원판을 B번째 탑의 가장 위로 옮긴다는 뜻이다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3</pre></div>
                    <div><strong>출력</strong><pre>7
1 3
1 2
3 2
1 3
2 1
2 3
1 3</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ N ≤ 20</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '원판 1개는 쉬워 — 그냥 옮기면 돼. 원판 2개도 해볼 만해: 작은 걸 보조 기둥에, 큰 걸 목표에, 작은 걸 다시 목표에. 근데 원판 3개, 4개는... 머리가 복잡해지는데, 일일이 시뮬레이션하지 않고 <strong>패턴</strong>을 찾을 수 없을까?' },
                { title: '핵심 아이디어', content: 'N개의 원판을 1번→3번으로 옮기는 문제를 <strong>3단계</strong>로 쪼개면 돼! ① 위 N-1개를 2번 기둥으로 (가장 큰 원판이 드러나도록) ② 가장 큰 원판을 3번으로 ③ 2번에 있는 N-1개를 다시 3번으로. "위 N-1개를 옮기는 것"도 같은 문제 — 이게 재귀야!<br><br><div style="display:flex;gap:16px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.8rem;flex-wrap:wrap;"><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);margin-bottom:2px;">①</div><div style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;">N-1 → 보조</div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);margin-bottom:2px;">②</div><div style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;font-weight:700;">큰판 → 목표</div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);margin-bottom:2px;">③</div><div style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">N-1 → 목표</div></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '<code>hanoi(n, from, to, via)</code> 함수를 만들어: n개를 from→to로, 보조 기둥은 via. 멈추는 조건은 <code>n = 0</code>이면 옮길 게 없으니 return. <code>n = 1</code>이면 바로 from→to 출력해도 되지만, n=0으로 멈춰도 자연스럽게 동작해!' },
                { title: '이동 횟수는 미리 알 수 있어!', content: '최소 이동 횟수는 <code>2<sup>N</sup> - 1</code>이야. 왜냐하면 <code>T(N) = 2 × T(N-1) + 1</code>이거든 (N-1개 옮기기 × 2 + 큰 원판 1번). 이 점화식을 풀면 <code>2<sup>N</sup> - 1</code>! 먼저 이 숫자를 출력하고, 그 다음에 이동 순서를 출력하면 돼.' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 1, inputMax: 10, inputDefault: 3,
            solve(n) {
                const moves = [];
                const hanoi = (n, from, to, via) => {
                    if (n === 0) return;
                    hanoi(n - 1, from, via, to);
                    moves.push(`${from} ${to}`);
                    hanoi(n - 1, via, to, from);
                };
                hanoi(n, 1, 3, 2);
                return `${moves.length}\n${moves.join('\n')}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nmoves = []\n\ndef hanoi(n, fr, to, via):\n    # 여기에 재귀 함수를 작성하세요\n    pass\n\nhanoi(n, 1, 3, 2)\nprint(len(moves))\nprint('\\n'.join(moves))\n`,
                cpp: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\nvoid hanoi(int n, int from, int to, int via) {\n    // 여기에 재귀 함수를 작성하세요\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << (int)pow(2, n) - 1 << '\\n';\n    hanoi(n, 1, 3, 2);\n    return 0;\n}`
            },
            solutions: [{
                approach: '재귀 풀이',
                description: 'hanoi(n, from, to, via) 재귀로 이동 순서를 구한다',
                timeComplexity: 'O(2^n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'hanoi 함수', desc: 'N-1개를 via로, 가장 큰 원판을 to로, N-1개를 to로', code: 'import sys\ninput = sys.stdin.readline\n\nmoves = []\n\ndef hanoi(n, fr, to, via):\n    if n == 0:\n        return\n    hanoi(n - 1, fr, via, to)\n    moves.append(f"{fr} {to}")\n    hanoi(n - 1, via, to, fr)' },
                        { title: '이동 횟수 + 호출', desc: '2^n - 1 출력 후 hanoi 호출', code: 'n = int(input())\nprint(2 ** n - 1)\nhanoi(n, 1, 3, 2)' },
                        { title: '출력', desc: '이동 순서를 줄바꿈으로 출력', code: 'print("\\n".join(moves))' }
                    ],
                    cpp: [
                        { title: 'hanoi 함수', desc: 'Python과 동일한 재귀 구조.\ncout으로 바로 출력 (배열에 저장 불필요).', code: '#include <iostream>\n#include <cmath>\nusing namespace std;\n\nvoid hanoi(int n, int from, int to, int via) {\n    if (n == 0) return;\n    hanoi(n - 1, from, via, to);     // 위 N-1개를 via로\n    cout << from << " " << to << \'\\n\'; // 가장 큰 원판 이동\n    hanoi(n - 1, via, to, from);     // N-1개를 to로\n}' },
                        { title: '이동 횟수 + 호출', desc: 'pow(2,n)-1 = 최소 이동 횟수.\n먼저 출력하고 hanoi 재귀 시작.', code: 'int main() {\n    int n;\n    cin >> n;\n    cout << (int)pow(2, n) - 1 << \'\\n\';\n    hanoi(n, 1, 3, 2);\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[6].templates; }
            }]
        }
    ]
};

// 전역 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.recursion = recursionTopic;
