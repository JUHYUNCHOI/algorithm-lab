// Recursion Topic Module
const recursionTopic = {
    id: 'recursion',
    title: 'Recursion',
    icon: '🔄',
    category: 'Search (Silver)',
    order: 6,
    description: 'A technique that breaks down problems by calling itself',
    relatedNote: 'Recursion is the foundation of nearly all algorithms: tree traversal, backtracking, divide and conquer, DP (memoization), and more.',

    sidebarExpandable: true,
    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-27433': { type: 'Basic Recursion', color: 'var(--accent)', vizMethod: '_renderVizFactorialSim' },
        'boj-10870': { type: 'Basic Recursion', color: 'var(--green)', vizMethod: '_renderVizFibSim' },
        'boj-25501': { type: 'Recursion Tracing', color: '#e17055', vizMethod: '_renderVizPalindromeSim' },
        'boj-24060': { type: 'Divide & Conquer', color: '#6c5ce7', vizMethod: '_renderVizMergeSim' },
        'boj-4779':  { type: 'Fractal', color: '#fdcb6e', vizMethod: '_renderVizCantorSim' },
        'boj-2447':  { type: 'Fractal', color: '#fdcb6e', vizMethod: '_renderVizStarSim' },
        'boj-11729': { type: 'Tower of Hanoi', color: '#00b894', vizMethod: '_renderVizHanoiSim' }
    },

    // ===== Render Concept Page =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>Recursion</h2>
                <p class="hero-sub">A method where a function calls itself to break problems into smaller and smaller pieces</p>
            </div>

            <!-- ① What is Recursion? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> What is Recursion?</div>
                <div class="analogy-box matryoshka-section">
                    You know those Russian nesting dolls? Open one up, and there's a smaller one inside. Open that, and there's an even smaller one. You keep going until you reach the tiniest doll that doesn't open -- that's where you stop!

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
                        <div class="matryoshka-instruction" id="matryoshka-instruction">👆 Click the doll to open it!</div>
                        <button class="matryoshka-reset hidden" id="matryoshka-reset">↺ Watch Again</button>
                    </div>

                    <div class="matryoshka-text">
                        Recursion works the same way. A function <strong>calls itself</strong>, making the problem smaller each time, until it hits the <strong>base case</strong> and stops.
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">How would you express 5! (5 factorial) recursively?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <code>5! = 5 × 4!</code><br>
                        <code>4! = 4 × 3!</code><br>
                        <code>3! = 3 × 2!</code><br>
                        <code>2! = 2 × 1!</code><br>
                        <code>1! = 1</code> ← <strong>Stop here!</strong><br><br>
                        So, <code>factorial(n) = n × factorial(n-1)</code>, and<br>
                        when <code>factorial(1) = 1</code>, it stops calling itself.
                    </div>
                </div>

                <div class="try-problem-link" style="margin-top:1.5rem;padding:1rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.3rem;">🎯</span>
                    <div>
                        <div style="font-weight:700;color:var(--text);margin-bottom:2px;">Try It Now</div>
                        <div style="font-size:0.85rem;color:var(--text2);">Factorial — use the recursion you just learned!</div>
                    </div>
                    <button onclick="if(window.selectProblem) window.selectProblem('recursion','boj-27433');" style="margin-left:auto;padding:8px 20px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem;">Solve →</button>
                </div>
            </div>

            <!-- ② Two Essential Elements of Recursion -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> Two Essential Elements of Recursion</div>

                <!-- Demo 2: Base Case Comparison (demo first!) -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — With Base Case vs Without</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <button class="concept-demo-btn" id="rec-demo-basecase-run">▶ Run</button>
                        <button class="concept-demo-btn green" id="rec-demo-basecase-reset" style="display:none;">↺ Again</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:220px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--green);">✅ With Base Case</div>
                                <div style="font-size:0.82rem;color:var(--text2);margin-bottom:6px;font-family:monospace;">if n &lt;= 1: return 1</div>
                                <div id="rec-demo-bc-good" style="display:flex;flex-direction:column;gap:4px;min-height:200px;"></div>
                                <div id="rec-demo-bc-good-msg" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>
                            </div>
                            <div style="flex:1;min-width:220px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--red);">❌ Without Base Case</div>
                                <div style="font-size:0.82rem;color:var(--text2);margin-bottom:6px;font-family:monospace;">return n * factorial(n-1)</div>
                                <div id="rec-demo-bc-bad" style="display:flex;flex-direction:column;gap:4px;min-height:200px;"></div>
                                <div id="rec-demo-bc-bad-msg" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="rec-demo-basecase-msg">👆 Click "Run" to compare factorial(5) with and without a base case!</div>
                </div>

                <p style="margin:1.2rem 0 0.8rem;line-height:1.75;">See that? Without a base case it runs forever. Every recursion needs two things: a <strong>🛑 Base Case</strong> (when to stop) and a <strong>🔄 Recursive Call</strong> (calling itself with a smaller problem).</p>

                <div class="concept-grid">
                    <div class="concept-card">
                        <h3>🛑 Base Case</h3>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">if n &lt;= 1:      # ← Stop here!
    return 1</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">if (n &lt;= 1)      // ← Stop here!
    return 1;</code></pre></div></span>
                    </div>
                    <div class="concept-card">
                        <h3>🔄 Calling Itself</h3>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">return n * factorial(n - 1)  # ← Recursion!</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">return n * factorial(n - 1);  // ← Recursion!</code></pre></div></span>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What happens if you call factorial(5) without a base case?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>It calls itself endlessly!</strong><br>
                        factorial(5) → factorial(4) → ... → factorial(0) → factorial(-1) → factorial(-2) → ...<br><br>
                        Since there's no instruction to stop, it keeps going! Eventually the computer says "too many calls!" and throws an error.<br>
                        That's why a base case is <strong>absolutely required</strong>.
                    </div>
                </div>

                <div class="try-problem-link" style="margin-top:1.5rem;padding:1rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.3rem;">🎯</span>
                    <div>
                        <div style="font-weight:700;color:var(--text);margin-bottom:2px;">Try It Now</div>
                        <div style="font-size:0.85rem;color:var(--text2);">Fibonacci — recursion with two base cases!</div>
                    </div>
                    <button onclick="if(window.selectProblem) window.selectProblem('recursion','boj-10870');" style="margin-left:auto;padding:8px 20px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem;">Solve →</button>
                </div>
            </div>

            <!-- ③ How Recursion Works: The Call Stack -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> How Does Recursion Work?</div>

                <!-- Demo 3: Call Stack Visualization (demo first!) -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Building and Unwinding the Call Stack</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-size:0.85rem;color:var(--text2);">n =</label>
                        <input type="number" id="rec-demo-cs-input" value="4" min="2" max="7" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="rec-demo-cs-step">▶ Next Step</button>
                        <button class="concept-demo-btn green" id="rec-demo-cs-reset">↺ Start Over</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">
                            <div style="flex:0 0 180px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);text-align:center;">Call Stack</div>
                                <div id="rec-demo-cs-stack" style="display:flex;flex-direction:column;gap:4px;min-height:220px;border:2px dashed var(--border);border-radius:10px;padding:12px;justify-content:flex-end;transition:border-color 0.3s;"></div>
                            </div>
                            <div style="flex:1;min-width:200px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Execution Trace</div>
                                <div id="rec-demo-cs-log" style="font-family:monospace;font-size:0.85rem;line-height:1.8;color:var(--text2);min-height:220px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="rec-demo-cs-msg">👆 Click "Next Step" to watch the call stack build and unwind for factorial(4)!</div>
                </div>

                <p style="margin:1.2rem 0 0.8rem;line-height:1.75;">Each recursive call <strong>stacks up like plates</strong>. When the base case is reached, answers come back <strong>from the top down</strong>.</p>

                <div class="key-difference-box">
                    <div>📥 <strong>Calling</strong>: Digs from the big problem into smaller ones (plates stack up)</div>
                    <div>📤 <strong>Returning</strong>: Returns answers starting from the base case going back up (plates are removed)</div>
                    <div>💡 What if too many stack up? The computer can't handle it! (<span class="lang-py">Python allows up to 1000 by default — you can increase it with <code>sys.setrecursionlimit()</code></span><span class="lang-cpp">C++ can handle tens of thousands depending on stack size, but it will crash if it overflows!</span>)</div>
                    <div style="margin-top:8px;"><span class="lang-py"><a href="https://docs.python.org/3/library/sys.html#sys.setrecursionlimit" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: sys.setrecursionlimit() ↗</a></span></div>
                </div>

                <div class="try-problem-link" style="margin-top:1.5rem;padding:1rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.3rem;">🎯</span>
                    <div>
                        <div style="font-weight:700;color:var(--text);margin-bottom:2px;">Try It Now</div>
                        <div style="font-size:0.85rem;color:var(--text2);">Recursion Expert — count how many times the call stack builds up!</div>
                    </div>
                    <button onclick="if(window.selectProblem) window.selectProblem('recursion','boj-25501');" style="margin-left:auto;padding:8px 20px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem;">Solve →</button>
                </div>
            </div>

            <!-- ④ Recursion vs Iteration -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> Recursion vs Iteration</div>
                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔄 Recursion</h3>
                        <p class="approach-desc">Calls itself. Code is short and easy to read</p>
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
                        <h3>🔁 Iteration</h3>
                        <p class="approach-desc">Uses for/while loops. Faster but code can be longer</p>
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

                <!-- Demo 4: Recursion vs Iteration -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Recursion vs Iteration Side by Side</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-size:0.85rem;color:var(--text2);">n =</label>
                        <input type="number" id="rec-demo-vs-input" value="5" min="2" max="8" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="rec-demo-vs-run">▶ Run Both</button>
                        <button class="concept-demo-btn green" id="rec-demo-vs-reset" style="display:none;">↺ Again</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:220px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--accent);">🔄 Recursion</div>
                                <div id="rec-demo-vs-rec" style="font-family:monospace;font-size:0.82rem;line-height:1.8;min-height:180px;"></div>
                                <div id="rec-demo-vs-rec-result" style="margin-top:8px;font-size:0.9rem;font-weight:600;color:var(--accent);min-height:1.5em;"></div>
                            </div>
                            <div style="width:1px;background:var(--border);"></div>
                            <div style="flex:1;min-width:220px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--green);">🔁 Iteration</div>
                                <div id="rec-demo-vs-iter" style="font-family:monospace;font-size:0.82rem;line-height:1.8;min-height:180px;"></div>
                                <div id="rec-demo-vs-iter-result" style="margin-top:8px;font-size:0.9rem;font-weight:600;color:var(--green);min-height:1.5em;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="rec-demo-vs-msg">👆 Click "Run Both" to see how recursion and iteration handle the same calculation differently!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">Factorial is easier with a loop, so when is recursion more useful?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Recursion shines in these cases:<br>
                        <strong>1. Self-similar patterns</strong> — Star printing, Cantor set — patterns where a big thing contains smaller versions of itself<br>
                        <strong>2. Divide-in-half problems</strong> — Sorting by splitting into halves<br>
                        <strong>3. Tower of Hanoi</strong> — Very complex with loops, but only 3 lines with recursion!<br>
                        <strong>4. Maze traversal</strong> — At a fork, explore one path all the way to the end first<br><br>
                        Summary: Use recursion when <strong>a problem contains smaller sub-problems of the same kind</strong>!
                    </div>
                </div>
            </div>

            <!-- ⑤ 3 Steps to Solve Recursion Problems -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 3 Steps to Solve Recursion Problems</div>
                <div class="step-cards">
                    <div class="step-card">
                        <span class="step-num">1</span>
                        <h4>Define the Base Case</h4>
                        <p>Provide the answer directly for the simplest case</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">2</span>
                        <h4>Find the Recurrence</h4>
                        <p>Express it as "big problem = small problem + small problem"</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">3</span>
                        <h4>Make It Smaller</h4>
                        <p>Each call must get closer to the base case!</p>
                    </div>
                </div>

                <!-- Demo 5: Fibonacci Call Tree -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Unfolding the Fibonacci Call Tree</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-size:0.85rem;color:var(--text2);">fib(</label>
                        <input type="number" id="rec-demo-fib-input" value="5" min="2" max="7" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        <label style="font-size:0.85rem;color:var(--text2);">)</label>
                        <button class="concept-demo-btn" id="rec-demo-fib-step">▶ Next Step</button>
                        <button class="concept-demo-btn green" id="rec-demo-fib-reset">↺ Start Over</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">
                            <div style="flex:1;min-width:280px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Call Tree</div>
                                <div id="rec-demo-fib-tree" style="overflow-x:auto;padding:12px 0;min-height:180px;"></div>
                            </div>
                            <div style="flex:0 0 200px;min-width:160px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Call Counts</div>
                                <div id="rec-demo-fib-counts" style="display:flex;flex-direction:column;gap:6px;"></div>
                                <div id="rec-demo-fib-total" style="margin-top:12px;font-size:0.9rem;font-weight:600;color:var(--accent);"></div>
                                <div id="rec-demo-fib-dup" style="margin-top:6px;font-size:0.85rem;color:var(--red);min-height:1.5em;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="rec-demo-fib-msg">👆 Click "Next Step" to see how fib(5) splits apart, and notice the duplicate calculations! This redundancy is solved by DP.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">Apply the 3 steps above to Fibonacci numbers.</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>1. Base case:</strong> fib(0) = 0, fib(1) = 1<br>
                        <strong>2. Recurrence:</strong> fib(n) = fib(n-1) + fib(n-2)<br>
                        <strong>3. Getting smaller:</strong> n → n-1, n-2 (decreases each time)<br><br>
                        Remember this pattern! You'll use it again when you learn DP.
                    </div>
                </div>

                <div class="try-problem-link" style="margin-top:1.5rem;padding:1rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.3rem;">🎯</span>
                    <div>
                        <div style="font-weight:700;color:var(--text);margin-bottom:2px;">Try It Now</div>
                        <div style="font-size:0.85rem;color:var(--text2);">Merge Sort — split in half recursively to sort!</div>
                    </div>
                    <button onclick="if(window.selectProblem) window.selectProblem('recursion','boj-24060');" style="margin-left:auto;padding:8px 20px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.9rem;">Solve →</button>
                </div>
            </div>
        `;

        // Initialize interactive elements
        this._initConceptInteractions(container);
    },

    _initConceptInteractions(container) {
        // Think-box toggle
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                box.classList.toggle('revealed');
            });
        });

        // Matryoshka doll interaction
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
                            instructionEl.textContent = '🎯 Base case reached! Click to return the values';
                            instructionEl.classList.add('phase-return');
                        } else {
                            instructionEl.textContent = '👆 Keep clicking to open the next doll';
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
                        instructionEl.textContent = '✅ Done! factorial(5) = 120';
                        resetBtn.classList.remove('hidden');
                        phase = 'done';
                    } else {
                        instructionEl.textContent = '📤 Value returned. Keep clicking!';
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
                instructionEl.textContent = '👆 Click the doll to open it!';
                instructionEl.classList.remove('phase-return');
                resetBtn.classList.add('hidden');
            });
        }

        // ============================
        // Demo 2: Base Case Comparison
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
                bcMsg.textContent = '👆 Click "Run" to compare factorial(5) with and without a base case!';
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
                bcMsg.textContent = 'Comparing the two approaches...';

                var goodCalls = [
                    { text: 'factorial(5) called', delay: 0 },
                    { text: '  → factorial(4) called', delay: 400 },
                    { text: '    → factorial(3) called', delay: 800 },
                    { text: '      → factorial(2) called', delay: 1200 },
                    { text: '        → factorial(1) called', delay: 1600 },
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
                            bcGoodMsg.textContent = 'Result: 120 (terminated normally!)';
                            bcGoodMsg.style.color = 'var(--green)';
                        }
                    }, c.delay);
                    bcTimers.push(t);
                });

                var badCalls = [
                    { text: 'factorial(5) called', delay: 0 },
                    { text: '  → factorial(4) called', delay: 400 },
                    { text: '    → factorial(3) called', delay: 800 },
                    { text: '      → factorial(2) called', delay: 1200 },
                    { text: '        → factorial(1) called', delay: 1600 },
                    { text: '          → factorial(0) called', delay: 2000 },
                    { text: '            → factorial(-1) called', delay: 2400 },
                    { text: '              → factorial(-2) called', delay: 2800 },
                    { text: '                → factorial(-3)...', delay: 3200 },
                    { text: '💥 RecursionError! Stack overflow!', delay: 3600, color: 'var(--red)', glow: true }
                ];

                badCalls.forEach(function(c) {
                    var t = setTimeout(function() {
                        bcBadEl.appendChild(makeFrame(c.text, c.color || 'var(--red)', c.glow));
                        if (c.text.indexOf('RecursionError') !== -1) {
                            bcBadMsg.textContent = '💥 Never stops — stack overflow!';
                            bcBadMsg.style.color = 'var(--red)';
                            bcMsg.textContent = 'The left side stops cleanly at the base case (n<=1), but the right side calls forever until it crashes!';
                        }
                    }, c.delay);
                    bcTimers.push(t);
                });
            });

            bcResetBtn.addEventListener('click', bcReset);
        })();

        // ============================
        // Demo 3: Call Stack Visualization
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
                // Push phase: factorial(n)→...→factorial(1)
                for (var k = n; k >= 1; k--) {
                    (function(ci, fv) {
                        steps.push({
                            phase: 'push',
                            desc: ci === 1
                                ? 'factorial(1) called — base case! return 1'
                                : 'factorial(' + ci + ') called — needs ' + ci + ' × factorial(' + (ci - 1) + '), so go deeper',
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
                                line.textContent = '\u00A0\u00A0'.repeat(n - ci) + '→ factorial(' + ci + ') called';
                                csLog.appendChild(line);
                            }
                        });
                    })(k, fact);
                }
                // Pop phase: factorial(1)→...→factorial(n)
                for (var k = 1; k <= n; k++) {
                    (function(ci, fv) {
                        steps.push({
                            phase: 'pop',
                            desc: ci === 1
                                ? 'factorial(1) = 1 returned (base case)'
                                : 'factorial(' + ci + ') = ' + ci + ' × ' + fv[ci - 1] + ' = ' + fv[ci] + ' returned — plate removed!',
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
                // Done
                steps.push({
                    phase: 'done',
                    desc: 'Done! factorial(' + n + ') = ' + fact[n],
                    run: function() {}
                });

                csState.steps = steps;
                csMsg.textContent = '👆 Click "Next Step" to watch the call stack for factorial(' + n + ')!';
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
        // Demo 4: Recursion vs Iteration
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
                vsMsg.textContent = '👆 Click "Run Both" to see how recursion and iteration handle the same calculation differently!';
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
                vsMsg.textContent = 'Running... compare the two approaches!';

                // Recursion side: dive into the call stack then return
                var fact = [1];
                for (var i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
                var delay = 0;
                var step = 350;
                // Calling phase
                for (var i = n; i >= 1; i--) {
                    var indent = '\u00A0\u00A0'.repeat(n - i);
                    if (i === 1) {
                        addLine(vsRecEl, indent + '→ factorial(1) → stop! return 1', 'var(--green)', delay);
                    } else {
                        addLine(vsRecEl, indent + '→ factorial(' + i + ') called', 'var(--accent)', delay);
                    }
                    delay += step;
                }
                // Return phase
                for (var i = 1; i <= n; i++) {
                    var indent = '\u00A0\u00A0'.repeat(n - i);
                    addLine(vsRecEl, indent + '← factorial(' + i + ') = ' + fact[i], 'var(--green)', delay);
                    delay += step;
                }
                var recDone = delay;
                var t1 = setTimeout(function() {
                    vsRecResult.textContent = 'Result: ' + fact[n] + ' (stack depth: ' + n + ')';
                }, recDone);
                vsTimers.push(t1);

                // Iteration side: simple multiplication loop
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
                    vsIterResult.textContent = 'Result: ' + result + ' (stack depth: 0)';
                }, iterDone);
                vsTimers.push(t2);

                var maxDone = Math.max(recDone, iterDone) + 200;
                var t3 = setTimeout(function() {
                    vsMsg.textContent = 'Recursion stacks ' + n + ' frames deep, but iteration uses just one variable with no stack. For simple problems like factorial, iteration is more efficient!';
                }, maxDone);
                vsTimers.push(t3);
            });

            vsResetBtn.addEventListener('click', vsReset);
        })();

        // ============================
        // Demo 5: Fibonacci Call Tree
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

                // Call counter UI
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

                // Build SVG tree — calculate node positions first
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

                // Draw edges (hidden initially)
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

                // Draw nodes (hidden initially)
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

                // Build steps: show nodes in DFS order
                var steps = [];
                function buildSteps(nodeIdx) {
                    var nd = nodes[nodeIdx];
                    steps.push({
                        desc: nd.val <= 1
                            ? 'fib(' + nd.val + ') — base case! return ' + nd.val + ' immediately'
                            : 'fib(' + nd.val + ') called — splits into fib(' + (nd.val - 1) + ') + fib(' + (nd.val - 2) + ')',
                        nodeId: nodeIdx,
                        val: nd.val,
                        isBase: nd.val <= 1
                    });
                    if (nd.val > 1) {
                        var childEdges = edges.filter(function(e) { return e.from === nodeIdx; });
                        childEdges.forEach(function(ce) {
                            buildSteps(ce.to);
                        });
                        var fibVal = [0, 1];
                        for (var i = 2; i <= n; i++) fibVal[i] = fibVal[i - 1] + fibVal[i - 2];
                        steps.push({
                            desc: 'fib(' + nd.val + ') = fib(' + (nd.val - 1) + ') + fib(' + (nd.val - 2) + ') = ' + fibVal[nd.val - 1] + ' + ' + fibVal[nd.val - 2] + ' = ' + fibVal[nd.val] + ' returned',
                            nodeId: nodeIdx,
                            val: nd.val,
                            isReturn: true,
                            result: fibVal[nd.val]
                        });
                    }
                }
                buildSteps(0);

                fibState.steps = steps;
                fibMsg.textContent = '👆 Click "Next Step" to watch fib(' + n + ')\'s call tree unfold!';
                fibStepBtn.disabled = false;

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
                        nodeEl.circle.setAttribute('stroke', 'var(--green)');
                        nodeEl.circle.setAttribute('fill', 'var(--green)15');
                        nodeEl.circle.setAttribute('stroke-width', '3');
                    } else {
                        nodeEl.g.style.opacity = '1';
                        var parentEdge = fibState.edges.filter(function(e) { return e.to === s.nodeId; });
                        parentEdge.forEach(function(pe) {
                            fibState.svg.querySelectorAll('line').forEach(function(line) {
                                if (parseInt(line.dataset.from) === pe.from && parseInt(line.dataset.to) === pe.to) {
                                    line.style.opacity = '1';
                                    line.style.transition = 'opacity 0.3s ease';
                                }
                            });
                        });
                        fibState.counts[s.val]++;
                        fibState.totalCount++;
                        var ce = fibState.countEls[s.val];
                        if (ce) {
                            ce.cnt.textContent = fibState.counts[s.val];
                            var maxCalls = 8;
                            ce.bar.style.width = Math.min(100, (fibState.counts[s.val] / maxCalls) * 100) + '%';
                            if (fibState.counts[s.val] > 1) {
                                ce.bar.style.background = 'var(--red)';
                                nodeEl.circle.setAttribute('stroke', 'var(--yellow)');
                                nodeEl.circle.setAttribute('fill', 'var(--yellow)20');
                            }
                        }
                        fibTotal.textContent = 'Total calls: ' + fibState.totalCount;
                        var dups = [];
                        for (var k in fibState.counts) {
                            if (fibState.counts[k] > 1) dups.push('fib(' + k + ')=' + fibState.counts[k] + 'x');
                        }
                        fibDup.textContent = dups.length > 0 ? 'Duplicates: ' + dups.join(', ') : '';

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
                        fibMsg.textContent = 'Done! Notice how the same fib values were computed multiple times? Eliminating this redundancy is exactly what DP (memoization) does!';
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

    // ===== Visualization State =====
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
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ Click Next to start</div>';
    },

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>◀ Prev</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">Before start</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">Next ▶</button>' +
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
                counter.textContent = 'Before start';
                desc.textContent = '▶ Click Next to start';
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

    // ===== Unused tabs (merged) =====
    renderVisualize(container) {},
    renderProblem(container) {},

    _renderVizType(el, type) {
        switch(type) {
            case 'factorial': this._renderVizFactorial(el); break;
            case 'fibonacci': this._renderVizFibonacci(el); break;
            case 'hanoi': this._renderVizHanoi(el); break;
        }
    },

    // ===== Factorial Visualization (concept tab) =====
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
                        <div class="viz-panel-header"><h3>Call Stack</h3></div>
                        <div class="viz-panel-body">
                            <div id="call-stack" class="viz-call-stack"></div>
                        </div>
                    </div>
                    <div class="viz-panel">
                        <div class="viz-panel-header"><h3>Call Log</h3></div>
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
                        ? `Call factorial(1) → <strong>Base case</strong>: n=1 cannot be broken down further, so return 1 immediately without recursion`
                        : `Call factorial(${ci}) → needs ${ci} × factorial(${ci - 1}), so we recurse to solve the smaller subproblem first`,
                    action() {
                        const frame = document.createElement('div');
                        frame.className = 'stack-frame' + (ci === 1 ? ' base' : '');
                        frame.textContent = ci === 1 ? `factorial(1) = 1 ✓` : `factorial(${ci}) = ${ci} × ?`;
                        stackEl.prepend(frame);
                        stackFrames.push(frame);
                        const line = document.createElement('div');
                        line.className = 'log-line call';
                        line.textContent = '\u00A0\u00A0'.repeat(n - ci) + `→ Call factorial(${ci})`;
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
                        ? `factorial(1) = 1 returned — base case, so the value is returned immediately without recursion`
                        : `factorial(${ci}) = ${ci} × ${fact[ci - 1]} = ${fact[ci]} returned — multiplies the result from the call below and passes it up`,
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
                description: `✅ Done! factorial(${n}) = ${fact[n]} — base case returns chain upward through each call to produce the final result`,
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

    // ===== Fibonacci Recursive Tree Visualization (concept tab) =====
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
                        <div class="viz-panel-header"><h3>Recursion Tree</h3>
                        <div class="counter">Calls: <span id="call-count" class="counter-num">0</span></div></div>
                        <div class="viz-panel-body">
                            <div id="concept-fib-tree" style="overflow-x:auto;padding:12px 0;min-height:200px;"></div>
                        </div>
                    </div>
                    <div class="viz-panel">
                        <div class="viz-panel-header">
                            <h3>Call Count</h3>
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

            // Call count cells
            const countCells = [];
            for (let i = 0; i <= n; i++) {
                const cell = document.createElement('div');
                cell.className = 'dp-cell';
                cell.innerHTML = `<div class="dp-cell-index">fib(${i})</div><div class="dp-cell-value">0</div>`;
                countsEl.appendChild(cell);
                countCells.push(cell);
            }

            // Tree node layout
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

            // Create SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', totalWidth);
            svg.setAttribute('height', totalHeight);
            svg.style.cssText = 'display:block;margin:0 auto;';

            // Edges (hidden initially)
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

            // Nodes (hidden initially)
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

            // Precompute fib values
            const fibVals = [0, 1];
            for (let fi = 2; fi <= n; fi++) fibVals[fi] = fibVals[fi - 1] + fibVals[fi - 2];

            // Build steps (DFS order)
            const steps = [];
            let callCount = 0;
            const callCounts = new Array(n + 1).fill(0);

            function buildSteps(nodeIdx) {
                const nd = treeNodes[nodeIdx];
                const nIdx = nodeIdx;
                const nVal = nd.val;
                const isBase = nVal <= 1;

                const descCall = isBase
                    ? `Call fib(${nVal}) — <strong>base case</strong>: return ${nVal} immediately`
                    : `Call fib(${nVal}) — need fib(${nVal - 1}) + fib(${nVal - 2}), so we recurse deeper`;

                steps.push({
                    description: descCall,
                    action() {
                        callCount++;
                        callCounts[nVal]++;
                        totalEl.textContent = callCount;
                        countCells[nVal].querySelector('.dp-cell-value').textContent = callCounts[nVal];
                        if (callCounts[nVal] > 1) countCells[nVal].classList.add('memo-hit');
                        if (isBase) countCells[nVal].classList.add('base');
                        const nel = nodeEls[nIdx];
                        nel.g.style.opacity = '1';
                        svg.querySelectorAll('line').forEach(line => {
                            if (parseInt(line.dataset.to) === nIdx) line.style.opacity = '1';
                        });
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
                    const childEdges = treeEdges.filter(e => e.from === nodeIdx);
                    childEdges.forEach(ce => buildSteps(ce.to));

                    const result = fibVals[nVal];
                    steps.push({
                        description: `fib(${nVal}) = fib(${nVal - 1}) + fib(${nVal - 2}) = ${fibVals[nVal - 1]} + ${fibVals[nVal - 2]} = ${result} returned — combines both sub-results and passes up to the caller`,
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
                description: `✅ fib(${n}) = ${fibVals[n]}, total ${totalNodeCount} calls! Lots of duplicates, right? → This is solved with DP`,
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

    // ===== Tower of Hanoi Visualization (concept tab) =====
    _renderVizHanoi(el) {
        const self = this;
        const initViz = (n) => {
            el.innerHTML = `
                <div class="viz-controls">
                    <div class="viz-control-group">
                        <label>Disks = <span id="viz-n-label">${n}</span></label>
                        <input type="range" id="viz-n-slider" min="1" max="5" value="${n}">
                    </div>
                </div>
                <div class="viz-panel">
                    <div class="viz-panel-header">
                        <h3>Tower of Hanoi</h3>
                        <div class="counter">Moves: <span id="move-count" class="counter-num">0</span> / ${Math.pow(2, n) - 1}</div>
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
                    description: `Move disk ${m.disk} from peg ${m.from} → peg ${m.to} — must clear smaller disks first before moving a larger one`,
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
                description: `✅ Done! Moved ${n} disks in ${moves.length} moves (minimum = 2^${n} - 1 = ${Math.pow(2, n) - 1})`,
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

    // ===== Problem Tab Definitions =====
    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Approach', icon: '💡' },
            { id: 'sim', label: 'Simulation', icon: '🎮' },
            { id: 'code', label: 'Code', icon: '💻' }
        ];
    },

    // ===== Problem Content Rendering =====
    renderProblemContent(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>Problem not found.</p>'; return; }

        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>Problem metadata not found.</p>'; return; }

        self._clearVizState();

        var diffMap = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold' };

        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);

        var flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the I/O format.', icon: '📋' },
            think:   { intro: 'Don\'t jump to coding — open the hints step by step to build your strategy.', icon: '💡' },
            sim:     { intro: prob.simIntro || 'See how the concepts from the hints actually work in practice.', icon: '🎮' },
            code:    { intro: 'Now let\'s turn the approach into code!', icon: '💻' }
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
        var tabLabels = { problem: 'Problem', think: 'Approach', sim: 'Simulation', code: 'Code' };
        var ctaTexts = { problem: 'Once you understand the problem,', think: 'Once you\'ve reviewed all hints,', sim: 'Once you understand how it works,' };
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

    // ===== Problem sub-tab: Problem =====
    _renderProblemTab(contentEl, prob) {
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
                '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
                    'Solve on BOJ ↗' +
                '</a>' +
            '</div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) {
            if (window.hljs) hljs.highlightElement(codeEl);
        });
    },

    // ===== Problem sub-tab: Hints =====
    _renderThinkTab(contentEl, prob) {
        var guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click each step to reveal hints';
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

    // ===== Problem sub-tab: Code =====
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
                '<a href="' + prob.link + '" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">Solve on BOJ ↗</a>' +
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
                '<div class="viz-panel"><div class="viz-panel-header"><h3>factorial(' + n + ') Call Stack</h3></div>' +
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
                            ? 'Call factorial(1) → <strong>Base case</strong>: n=1 cannot be split further, return 1 immediately'
                            : 'Call factorial(' + ci + ') → needs ' + ci + ' × factorial(' + (ci-1) + '), so we recurse to solve the smaller subproblem first',
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
                            ? 'Return factorial(1) = 1 — base case returns immediately without recursion'
                            : 'Return factorial(' + ci + ') = ' + ci + ' × ' + factVals[ci-1] + ' = ' + factVals[ci] + ' — receives result from below, multiplies, and passes up',
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

            steps.push({ description: '✅ Done! factorial(' + n + ') = ' + factVals[n], action: function(){}, undo: function(){} });
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
                '<div class="viz-panel"><div class="viz-panel-header"><h3>fib(' + n + ') Recursion Tree</h3>' +
                '<div class="counter">Calls: <span id="sim-fib-cnt">0</span></div></div>' +
                '<div class="viz-panel-body"><div id="sim-fib-tree" style="overflow-x:auto;padding:12px 0;min-height:200px;"></div></div></div>' +
                self._createStepControls('fib');

            var treeEl = container.querySelector('#sim-fib-tree');
            var cntEl = container.querySelector('#sim-fib-cnt');

            // Build tree nodes recursively
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

            // Create SVG
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', totalWidth);
            svg.setAttribute('height', totalHeight);
            svg.style.cssText = 'display:block;margin:0 auto;';

            // Edges (hidden initially)
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

            // Nodes (hidden initially)
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

            // Precompute fib values
            var fibVals = [0, 1];
            for (var fi = 2; fi <= n; fi++) fibVals[fi] = fibVals[fi - 1] + fibVals[fi - 2];

            // Build steps in DFS order
            var steps = [];
            var callCount = 0;
            var callCounts = {};
            for (var ci = 0; ci <= n; ci++) callCounts[ci] = 0;

            function buildSteps(nodeIdx) {
                var nd = nodes[nodeIdx];
                (function(nIdx, nVal) {
                    var isBase = nVal <= 1;
                    var descCall = isBase
                        ? 'Call fib(' + nVal + ') — <strong>base case</strong>: return ' + nVal + ' immediately'
                        : 'Call fib(' + nVal + ') — need fib(' + (nVal - 1) + ') + fib(' + (nVal - 2) + '), so we recurse deeper';
                    steps.push({
                        description: descCall,
                        action: function() {
                            callCount++;
                            cntEl.textContent = callCount;
                            callCounts[nVal]++;
                            var nel = nodeEls[nIdx];
                            nel.g.style.opacity = '1';
                            svg.querySelectorAll('line').forEach(function(line) {
                                if (parseInt(line.dataset.to) === nIdx) line.style.opacity = '1';
                            });
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
                                if (parseInt(line.dataset.to) === nIdx) line.style.opacity = '0';
                            });
                            nel.circle.setAttribute('stroke', 'var(--border)');
                            nel.circle.setAttribute('fill', 'var(--bg2)');
                            nel.circle.setAttribute('fill-opacity', '1');
                            nel.circle.setAttribute('stroke-width', '2');
                        }
                    });
                })(nodeIdx, nd.val);

                if (nd.val > 1) {
                    var childEdges = edges.filter(function(e) { return e.from === nodeIdx; });
                    childEdges.forEach(function(ce) { buildSteps(ce.to); });
                    (function(nIdx, nVal) {
                        var result = fibVals[nVal];
                        steps.push({
                            description: 'fib(' + nVal + ') = fib(' + (nVal - 1) + ') + fib(' + (nVal - 2) + ') = ' + fibVals[nVal - 1] + ' + ' + fibVals[nVal - 2] + ' = ' + result + ' returned — combines both sub-results and passes up',
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
            steps.push({ description: '✅ fib(' + n + ') = ' + fibResult + ', total ' + totalCalls + ' calls! Can you see the duplicated computations?', action: function(){}, undo: function(){} });
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
                    '<label style="font-weight:600;">String: <input type="text" id="rec-pal-input" value="' + str + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;background:var(--card);color:var(--text);"></label>' +
                    '<button class="btn btn-primary" id="rec-pal-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('pal') +
                '<div class="viz-panel"><div class="viz-panel-header"><h3>Palindrome Check: "' + str + '"</h3>' +
                '<div class="counter">Calls: <span id="sim-pal-cnt">0</span></div></div>' +
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
                    desc = 'recursion("' + str + '", ' + pl + ', ' + pr + ') → l>=r, palindrome!';
                } else if (!match) {
                    desc = 'recursion("' + str + '", ' + pl + ', ' + pr + ') → s[' + pl + ']=' + str[pl] + ' vs s[' + pr + ']=' + str[pr] + ' → different! Not a palindrome';
                } else {
                    desc = 'recursion("' + str + '", ' + pl + ', ' + pr + ') → s[' + pl + ']=' + str[pl] + ' vs s[' + pr + ']=' + str[pr] + ' → match! Continue';
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
                        var suffix = pl >= pr ? ' ✓ stop' : (match ? ' ✓' : ' ✗');
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
                description: 'Result: isPalindrome = ' + isPalin + ', call count = ' + totalCalls,
                action: function() {
                    var line = document.createElement('div');
                    line.className = 'log-line return-val';
                    line.textContent = '← Result: ' + isPalin + ' ' + totalCalls;
                    logEl.appendChild(line);
                    logLines.push(line);
                },
                undo: function() {
                    var line = logLines.pop();
                    if (line) line.remove();
                }
            });

            var finalMsg = isPalin ? '✅ "' + str + '" is a palindrome! recursion called ' + totalCalls + ' times' : '✅ "' + str + '" is NOT a palindrome! recursion called ' + totalCalls + ' times';
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
            if (tmp.length === 0) html += '<span style="color:var(--text3);font-size:0.85rem;">(empty)</span>';
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
                    '<label style="font-weight:600;">Array: <input type="text" id="rec-merge-input" value="' + arr.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;background:var(--card);color:var(--text);"></label>' +
                    '<label style="font-weight:600;">K: <input type="number" id="rec-merge-k" value="' + k + '" min="1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;background:var(--card);color:var(--text);"></label>' +
                    '<button class="btn btn-primary" id="rec-merge-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('merge') +
                '<div class="sim-card" style="min-height:220px;">' +
                '<div style="font-weight:600;font-size:0.85rem;color:var(--text2);margin-bottom:6px;">Split Tree — current node highlighted</div>' +
                '<div id="sim-merge-tree" style="overflow-x:auto;margin-bottom:16px;padding:8px 0;min-height:60px;"></div>' +
                '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">' +
                    '<h3 style="margin:0;font-size:1rem;">Array A</h3>' +
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

            // --- Build split tree ---
            var treeNodes = [];
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

            // --- Run merge sort and record detailed steps ---
            var vizSteps = [];
            var a = arr.slice();
            var saveCnt = 0;
            var kthValue = null;
            var foundK = false;

            function addStep(desc, renderFn) {
                vizSteps.push({ description: desc, render: renderFn });
            }

            // Initial state
            var initSnap = a.slice();
            addStep('Initial array A = [' + arr.join(', ') + ']. We will merge sort this array.', function() {
                mainEl.innerHTML = renderBoxes(initSnap, {});
                tmpEl.innerHTML = '';
                infoEl.innerHTML = '';
                cntEl.textContent = '';
                renderMergeTree(-1, -1, '');
            });

            function recordMergeSort(p, r, depth) {
                if (p >= r) return;
                var q = Math.floor((p + r) / 2);

                // Split step — capture snapshot
                var splitSnap = a.slice();
                var depthLabel = depth === 0 ? '' : ' (depth ' + depth + ')';
                addStep(
                    'Split' + depthLabel + ': A[' + p + '..' + r + '] into A[' + p + '..' + q + '] and A[' + (q+1) + '..' + r + ']. mid = (' + p + '+' + r + ')÷2 = ' + q,
                    (function(snap, pp, qq, rr) { return function() {
                        mainEl.innerHTML = renderBoxes(snap, { active: [pp, rr] }) +
                            '<div style="display:flex;justify-content:center;gap:20px;margin-top:10px;">' +
                            '<span style="font-size:0.85rem;color:var(--accent);border:1px dashed var(--accent);border-radius:8px;padding:4px 10px;">Left [' + pp + '..' + qq + ']</span>' +
                            '<span style="font-size:0.85rem;color:var(--green);border:1px dashed var(--green);border-radius:8px;padding:4px 10px;">Right [' + (qq+1) + '..' + rr + ']</span>' +
                            '</div>';
                        tmpEl.innerHTML = '';
                        infoEl.innerHTML = '';
                        renderMergeTree(pp, rr, 'split');
                    }; })(splitSnap, p, q, r)
                );

                recordMergeSort(p, q, depth + 1);
                recordMergeSort(q + 1, r, depth + 1);

                // --- Merge phase: record each comparison step ---
                var leftArr = a.slice(p, q + 1);
                var rightArr = a.slice(q + 1, r + 1);
                var mergeStartSnap = a.slice();
                addStep(
                    'Merge: combining left [' + leftArr.join(', ') + '] and right [' + rightArr.join(', ') + '].',
                    (function(snap, pp, qq, rr, la, ra) { return function() {
                        mainEl.innerHTML = renderBoxes(snap, { active: [pp, rr] }) +
                            '<div style="display:flex;justify-content:center;gap:20px;margin-top:10px;">' +
                            '<span style="font-size:0.85rem;color:var(--accent);border:1px dashed var(--accent);border-radius:8px;padding:4px 10px;">Left [' + la.join(', ') + ']</span>' +
                            '<span style="font-size:0.85rem;color:var(--green);border:1px dashed var(--green);border-radius:8px;padding:4px 10px;">Right [' + ra.join(', ') + ']</span>' +
                            '</div>';
                        tmpEl.innerHTML = renderTmpBoxes([], -1);
                        infoEl.innerHTML = '<span style="color:var(--text2);">i=' + pp + ', j=' + (qq+1) + ' — compare from first elements</span>';
                        renderMergeTree(pp, rr, 'merge');
                    }; })(mergeStartSnap, p, q, r, leftArr, rightArr)
                );

                var tmp = [];
                var li = 0, ri = 0;
                var leftCopy = leftArr.slice();
                var rightCopy = rightArr.slice();

                // Comparison steps
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
                        'Compare: ' + lv + (side === 'left' ? ' ≤ ' : ' > ') + rv + ' → put ' +
                        (side === 'left' ? 'left ' + chosen : 'right ' + chosen) +
                        ' into tmp',
                        (function(snap, pp, rr, ts, lis, ris, lc, rc) { return function() {
                            mainEl.innerHTML = renderBoxes(snap, { active: [pp, rr] });
                            tmpEl.innerHTML = renderTmpBoxes(ts, ts.length - 1);
                            var nextInfo = '';
                            if (lis < lc.length && ris < rc.length) {
                                nextInfo = 'Next: left[' + lis + ']=' + lc[lis] + ' vs right[' + ris + ']=' + rc[ris];
                            } else if (lis < lc.length) {
                                nextInfo = 'Right exhausted! Copy remaining left elements to tmp';
                            } else {
                                nextInfo = 'Left exhausted! Copy remaining right elements to tmp';
                            }
                            infoEl.innerHTML = '<span style="color:var(--text2);">' + nextInfo + '</span>';
                        }; })(cmpSnap, p, r, tmpSnapshot, liSnap, riSnap, leftCopy, rightCopy)
                    );
                }

                // Remaining elements
                while (li < leftCopy.length) {
                    tmp.push(leftCopy[li]);
                    li++;
                    var tmpSnap2 = tmp.slice();
                    addStep(
                        'Remaining left ' + leftCopy[li - 1] + ' goes to tmp',
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
                        'Remaining right ' + rightCopy[ri - 1] + ' goes to tmp',
                        (function(snap, ts, pp, rr) { return function() {
                            mainEl.innerHTML = renderBoxes(snap, { active: [pp, rr] });
                            tmpEl.innerHTML = renderTmpBoxes(ts, ts.length - 1);
                            infoEl.innerHTML = '';
                        }; })(mergeStartSnap, tmpSnap3, p, r)
                    );
                }

                // Copy tmp → A (individual steps)
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
                        'A[' + curIdx + '] = ' + curVal + ' saved (save #' + curCnt + ')' + (isKth ? ' ← K-th!' : ''),
                        (function(as, ci, cv, cc, ik, pp, rr) { return function() {
                            var hl = {};
                            if (ik) hl.kth = ci;
                            else hl.merged = [pp, rr];
                            mainEl.innerHTML = renderBoxes(as, hl) +
                                renderPointers(as, [{ idx: ci, name: 'A[' + ci + ']' }]);
                            tmpEl.innerHTML = '';
                            cntEl.textContent = 'Save count: ' + cc;
                            if (ik) {
                                infoEl.innerHTML = '<div style="padding:8px 14px;background:rgba(108,92,231,0.1);border-radius:10px;border:1px solid var(--accent);color:var(--accent);font-weight:700;">🎯 K=' + cc + ' saved value = ' + cv + '</div>';
                            } else {
                                infoEl.innerHTML = '';
                            }
                            renderMergeTree(pp, rr, 'merge');
                        }; })(arrSnap, curIdx, curVal, curCnt, isKth, p, r)
                    );
                }
            }

            recordMergeSort(0, arr.length - 1, 0);

            // Final result
            var finalKth = kthValue;
            var finalCnt = saveCnt;
            addStep(
                kthValue !== null
                    ? '✅ Done! Total ' + finalCnt + ' saves. K=' + k + ' saved value: ' + finalKth
                    : '✅ Done! Total ' + finalCnt + ' saves. Fewer than K=' + k + ', result is -1',
                function() {
                    mainEl.innerHTML = renderBoxes(a, {});
                    tmpEl.innerHTML = '';
                    cntEl.textContent = 'Save count: ' + finalCnt;
                    if (finalKth !== null) {
                        infoEl.innerHTML = '<div style="padding:10px 16px;background:rgba(0,206,158,0.1);border-radius:10px;border:1px solid var(--green);color:var(--green);font-weight:700;font-size:1.1rem;">Answer: ' + finalKth + '</div>';
                    } else {
                        infoEl.innerHTML = '<div style="padding:10px 16px;background:rgba(255,71,87,0.08);border-radius:10px;border:1px solid var(--red);color:var(--red);font-weight:700;">Save count (' + finalCnt + ') is less than K (' + k + ') → -1</div>';
                    }
                    renderMergeTree(0, arr.length - 1, 'done');
                }
            );

            // Convert vizSteps to action/undo format
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
                '<div class="viz-panel"><div class="viz-panel-header"><h3>Cantor Set (N=' + n + ', length ' + len + ')</h3></div>' +
                '<div class="viz-panel-body">' +
                '<div id="sim-cantor-display" style="font-family:monospace;font-size:1.1rem;line-height:2.5;letter-spacing:2px;"></div>' +
                '</div></div>' +
                self._createStepControls('cantor');

            var displayEl = container.querySelector('#sim-cantor-display');

            // Build cantor states step by step using BFS-like level processing
            var states = [];
            var arr = [];
            for (var i = 0; i < len; i++) arr.push('-');
            states.push({ desc: 'Initial: dash string of length ' + len, text: arr.join('') });

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
                    desc: descParts.join(', ') + ': replace middle ' + (queue[0].size / 3) + ' chars with spaces',
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
                steps.push({ description: '✅ N=0 means just a single dash of length 1!', action: function(){}, undo: function(){} });
            } else {
                steps.push({ description: '✅ Done! Length 1 cannot be split further, so we stop', action: function(){}, undo: function(){} });
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
                    '<label style="font-weight:600;">N (power of 3): ' +
                    '<select id="rec-star-n" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;background:var(--card);color:var(--text);">' +
                        '<option value="3"' + (n===3?' selected':'') + '>3</option>' +
                        '<option value="9"' + (n===9?' selected':'') + '>9</option>' +
                        '<option value="27"' + (n===27?' selected':'') + '>27</option>' +
                    '</select></label>' +
                    '<button class="btn btn-primary" id="rec-star-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('star') +
                '<div class="viz-panel"><div class="viz-panel-header"><h3>Star Pattern - 10 (N=' + n + ')</h3></div>' +
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
            states.push({ desc: 'Initial: fill entire ' + n + '\u00D7' + n + ' grid with *', text: gridToStr(grid) });

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
                    ? descParts.join(', ') + ': blank center ' + third + '\u00D7' + third + ' block'
                    : queue.length + ' blocks: blank center ' + third + '\u00D7' + third;
                states.push({ desc: levelDesc, text: gridToStr(grid) });
                queue = nextQueue;
            }

            states.push({ desc: '✅ Done! Size 1 cannot be split further, so we stop', text: gridToStr(grid) });

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
                    '<label style="font-weight:600;">Disks: <input type="number" id="rec-hanoi-n" value="' + n + '" min="1" max="5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;background:var(--card);color:var(--text);"></label>' +
                    '<button class="btn btn-primary" id="rec-hanoi-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc('hanoi2') +
                '<div class="viz-panel"><div class="viz-panel-header"><h3>Tower of Hanoi (' + n + ' disks)</h3>' +
                '<div class="counter">Moves: <span id="sim-hanoi-cnt">0</span> / ' + totalMoves + '</div></div>' +
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
                    description: 'Move disk ' + m.disk + ' from peg ' + m.from + ' → peg ' + m.to + ' — must clear smaller disks above before moving a larger one',
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

            steps.push({ description: '✅ Done! Moved ' + n + ' disks in ' + totalMoves + ' moves (= 2^' + n + '-1)', action: function(){}, undo: function(){} });
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

    // ===== 3-Stage Problem Structure =====
    stages: [
        { num: 1, title: 'Recursion Basics', desc: 'Practice basic recursive functions', problemIds: ['boj-27433', 'boj-10870'] },
        { num: 2, title: 'Applying Recursion', desc: 'Tracing and understanding recursive calls', problemIds: ['boj-25501', 'boj-24060'] },
        { num: 3, title: 'Divide and Solve', desc: 'Recursive patterns and Tower of Hanoi', problemIds: ['boj-4779', 'boj-2447', 'boj-11729'] }
    ],

    // ===== Problem List =====
    problems: [
        // ========== Stage 1: Recursion Basics ==========
        {
            id: 'boj-27433',
            title: 'BOJ 27433 - Factorial 2',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/27433',
            simIntro: 'See how the call stack builds up and unwinds for factorial(5)!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a non-negative integer N, write a program that outputs N!.</p>
                <h4>Input</h4>
                <p>The first line contains the integer N (0 ≤ N ≤ 20).</p>
                <h4>Output</h4>
                <p>Print N! on the first line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10</pre></div>
                    <div><strong>Output</strong><pre>3628800</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>0</pre></div>
                    <div><strong>Output</strong><pre>1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>0 ≤ N ≤ 20</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Since <code>5! = 5 × 4 × 3 × 2 × 1</code>, can\'t we just multiply in a for loop? Yes, that works! But this problem is meant to practice <strong>recursion</strong>.' },
                { title: 'But how with recursion?', content: 'Look closely: <code>5! = 5 × 4!</code>, and <code>4! = 4 × 3!</code>. In other words, <code>n! = n × (n-1)!</code> — the big problem breaks down into a smaller problem! This is the core of recursion.<br><br><div style="display:flex;flex-direction:column;gap:2px;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;align-items:center;gap:6px;"><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;">5!</span><span>=</span><span>5</span><span>×</span><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.85;">4!</span></div><div style="display:flex;align-items:center;gap:6px;padding-left:20px;"><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.85;">4!</span><span>=</span><span>4</span><span>×</span><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.7;">3!</span></div><div style="display:flex;align-items:center;gap:6px;padding-left:40px;"><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.7;">3!</span><span>=</span><span>3</span><span>×</span><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.55;">2!</span></div><div style="display:flex;align-items:center;gap:6px;padding-left:60px;"><span style="padding:2px 8px;background:var(--green);color:white;border-radius:4px;">1!</span><span>=</span><span style="font-weight:700;">1</span><span style="color:var(--text3);margin-left:4px;">← base case!</span></div></div>' },
                { title: 'What about the base case?', content: 'Recursion must have a <strong>base case</strong>. Otherwise it calls itself forever! Since <code>0! = 1</code> and <code>1! = 1</code>, when n is 0 or 1, stop multiplying and return 1.' },
                { title: 'Watch out', content: '20! is about 2,432,902,008,176,640,000 — a huge number! <span class="lang-py">Python handles big numbers automatically, so no worries.</span><span class="lang-cpp">In C++, <code>int</code> can only store up to about 2.1 billion, so it overflows! You need <code>long long</code> (up to about 9.2 × 10<sup>18</sup>).</span>' }
            ],
            inputLabel: 'Input (N)',
            inputMin: 0, inputMax: 20, inputDefault: 10,
            solve(n) {
                let r = 1;
                for (let i = 2; i <= n; i++) r *= i;
                return `${r}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\ndef factorial(n):\n    # Write the recursive function here\n    pass\n\nprint(factorial(n))\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    // Write the recursive function here\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}`
            },
            solutions: [{
                approach: 'Recursive',
                description: 'Directly implement the recursive definition of factorial',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'Function definition + Base case', desc: 'Return 1 if n is 1 or less', code: 'def factorial(n):\n    if n <= 1:\n        return 1' },
                        { title: 'Recursive call', desc: 'Recurse with n * factorial(n-1)', code: '    return n * factorial(n - 1)' },
                        { title: 'I/O', desc: 'Read input and print the result', code: 'n = int(input())\nprint(factorial(n))' }
                    ],
                    cpp: [
                        { title: 'Function definition + Base case', desc: 'long long: 20! is about 2.4x10^18, which exceeds int range.', code: '#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    if (n <= 1) return 1;  // Base case' },
                        { title: 'Recursive call', desc: 'Recurse with n * factorial(n-1)', code: '    return (long long)n * factorial(n - 1);\n}' },
                        { title: 'I/O', desc: 'I/O with cin/cout. Unlike Python, a main function is needed.', code: 'int main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-10870',
            title: 'BOJ 10870 - Fibonacci Number 5',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/10870',
            simIntro: 'See how the recursive call tree of fib(5) unfolds!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>The Fibonacci sequence starts with 0 and 1. The 0th Fibonacci number is 0 and the 1st is 1. From the 2nd onward, each number is the sum of the two preceding Fibonacci numbers.</p>
                <p>Expressed as a formula: Fn = Fn-1 + Fn-2 (n ≥ 2).</p>
                <p>Given n, write a program that computes the nth Fibonacci number.</p>
                <h4>Input</h4>
                <p>The first line contains n. n is a non-negative integer ≤ 20.</p>
                <h4>Output</h4>
                <p>Print the nth Fibonacci number on the first line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10</pre></div>
                    <div><strong>Output</strong><pre>55</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>0 ≤ n ≤ 20</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'The Fibonacci sequence is <code>0, 1, 1, 2, 3, 5, 8, 13, ...</code> — you add the two previous numbers to get the next one! It seems like we could just use a for loop to compute them one by one from the start.' },
                { title: 'But how do we do it recursively?', content: 'Look at the definition again: <code>fib(n) = fib(n-1) + fib(n-2)</code>. To get the nth number, you need the (n-1)th and (n-2)th, and those are computed the same way! That is a recursive structure.' },
                { title: 'Two base cases!', content: 'Factorial had 1 base case, but Fibonacci needs <strong>2</strong>: <code>fib(0) = 0</code>, <code>fib(1) = 1</code>. Without both, <code>fib(1) would call fib(0) + fib(-1)</code> and recurse endlessly!' },
                { title: 'Limitations of this approach?', content: 'Since n ≤ 20, it is fine for this problem, but pure recursion <strong>recomputes the same values multiple times</strong>. Computing fib(5) calculates fib(2) three times! As n grows, time complexity explodes to O(2<sup>n</sup>). Later, you will learn how to fix this with DP (Dynamic Programming)!<br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:32px;height:20px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.7rem;color:var(--text2);margin-top:3px;">n=5<br>15</div></div><div style="text-align:center;"><div style="width:32px;height:50px;background:var(--yellow);border-radius:4px 4px 0 0;"></div><div style="font-size:0.7rem;color:var(--text2);margin-top:3px;">n=10<br>177</div></div><div style="text-align:center;"><div style="width:32px;height:100px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.7rem;color:var(--text2);margin-top:3px;">n=20<br>20K</div></div><div style="text-align:center;"><div style="width:32px;height:130px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.6;"></div><div style="font-size:0.7rem;color:var(--text2);margin-top:3px;">n=40<br>300M!</div></div></div>' }
            ],
            inputLabel: 'Input (n)',
            inputMin: 0, inputMax: 20, inputDefault: 10,
            solve(n) {
                function fib(n) { if (n <= 1) return n; return fib(n-1) + fib(n-2); }
                return `${fib(n)}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\ndef fib(n):\n    # Write the recursive function here\n    pass\n\nprint(fib(n))\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    // Write the recursive function here\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << fib(n) << endl;\n    return 0;\n}`
            },
            solutions: [{
                approach: 'Recursive',
                description: 'Directly implement the recursive definition of Fibonacci',
                timeComplexity: 'O(2^n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'Function definition + Base cases', desc: 'Return 0 if n is 0, return 1 if n is 1', code: 'def fib(n):\n    if n == 0: return 0\n    if n == 1: return 1' },
                        { title: 'Recursive call', desc: 'Recurse with fib(n-1) + fib(n-2)', code: '    return fib(n-1) + fib(n-2)' },
                        { title: 'I/O', desc: 'Read input and print the result', code: 'n = int(input())\nprint(fib(n))' }
                    ],
                    cpp: [
                        { title: 'Function definition + Base cases', desc: 'n ≤ 20, so int range is sufficient.', code: '#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;' },
                        { title: 'Recursive call', desc: 'Recursively compute the sum of the two preceding Fibonacci numbers.', code: '    return fib(n - 1) + fib(n - 2);\n}' },
                        { title: 'I/O', desc: 'I/O with cin/cout. Call fib from main function.', code: 'int main() {\n    int n;\n    cin >> n;\n    cout << fib(n) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[1].templates; }
            }]
        },
        // ========== Stage 2: Applying Recursion ==========
        {
            id: 'boj-25501',
            title: 'BOJ 25501 - Recursion Master',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/25501',
            simIntro: 'See how the palindrome-checking recursion narrows in from both ends!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>We want to convert an integer to a string and determine whether that string is a palindrome using a recursive function. The following isPalindrome and recursion functions are given. For each string, output the palindrome result (1 or 0) and the number of times the recursion function is called.</p>
                <pre style="background:var(--bg);padding:1rem;border-radius:8px;border:1px solid var(--border);font-size:0.85rem;line-height:1.6;overflow-x:auto;">recursion(s, l, r){
    if(l >= r) return 1
    else if(s[l] != s[r]) return 0
    else return recursion(s, l+1, r-1)
}

isPalindrome(s){
    return recursion(s, 0, length(s)-1)
}</pre>
                <p>The key task is to count the number of times the <code>recursion</code> function is called in the pseudocode above.</p>
                <h4>Input</h4>
                <p>The first line contains the number of test cases T (1 ≤ T ≤ 1,000).</p>
                <p>From the second line, T lines each contain a string S consisting of uppercase letters. (1 ≤ |S| ≤ 1,000)</p>
                <h4>Output</h4>
                <p>For each test case, print the return value of isPalindrome and the number of times the recursion function is called, separated by a space, on one line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3
AAA
ABBA
ABCDA</pre></div>
                    <div><strong>Output</strong><pre>1 2
1 3
0 3</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ T ≤ 1,000</li>
                    <li>1 ≤ string length ≤ 1,000</li>
                    <li>Strings consist of uppercase letters</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'The problem already gives us the recursive function <code>recursion(s, l, r)</code>! It compares characters at both ends and narrows inward if they match. Implementing it directly handles palindrome detection, but... how do we count the number of calls?' },
                { title: 'How do we count calls?', content: 'Every time the <code>recursion</code> function runs, we record "I was called once!" Just increment a counter at the very first line of the function, and it counts automatically with each call!<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;flex-wrap:wrap;"><span style="color:var(--text2);">A<u>B</u>BA:</span><span style="padding:2px 8px;background:var(--green);color:white;border-radius:4px;">A=A ✓</span><span style="padding:2px 8px;background:var(--green);color:white;border-radius:4px;">B=B ✓</span><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:4px;">done!</span><span style="color:var(--text3);margin-left:4px;">cnt = 3</span></div> <span class="lang-py">Use a global variable with <code>global cnt</code></span><span class="lang-cpp">Use a global variable <code>int cnt</code></span> to keep track.' },
                { title: 'What if we try this?', content: 'Do not forget to <strong>reset</strong> the counter to 0 for every test case! Otherwise the counts from previous strings will accumulate. Reset <code>cnt = 0</code> inside <code>isPalindrome</code> before calling <code>recursion</code> for a clean solution.' },
                { title: 'Call count pattern', content: 'For palindromes, recursion goes from both ends to the middle, so it is called <code>(length+1)//2</code> times. For non-palindromes? Only until the mismatch position! Example: "ABCDA" checks A=A, then B!=D and stops, so 3 calls (including the initial call at l=0, then l=1 where the mismatch occurs).' }
            ],
            inputLabel: 'Input (n)',
            inputMin: 1, inputMax: 1, inputDefault: 1,
            solve(n) { return `1 2`; },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\ndef recursion(s, l, r):\n    # Implement the given code and count call count\n    pass\n\ndef isPalindrome(s):\n    return recursion(s, 0, len(s)-1)\n\nT = int(input())\nfor _ in range(T):\n    s = input().strip()\n    # Print result and call count\n`,
                cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint cnt;\n\nint recursion(string s, int l, int r) {\n    cnt++;\n    // Write the recursive function here\n    return 0;\n}\n\nint main() {\n    int T;\n    cin >> T;\n    while (T--) {\n        string s;\n        cin >> s;\n        cnt = 0;\n        int result = recursion(s, 0, s.length()-1);\n        cout << result << " " << cnt << endl;\n    }\n    return 0;\n}`
            },
            solutions: [{
                approach: 'Recursion + Counter',
                description: 'Add a global counter to the given recursive function to count calls',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'recursion function', desc: 'Use a global counter and increment on each recursive call', code: 'cnt = 0\ndef recursion(s, l, r):\n    global cnt\n    cnt += 1\n    if l >= r: return 1\n    if s[l] != s[r]: return 0\n    return recursion(s, l+1, r-1)' },
                        { title: 'isPalindrome', desc: 'Reset the counter and call recursion', code: 'def isPalindrome(s):\n    global cnt\n    cnt = 0\n    return recursion(s, 0, len(s)-1)' },
                        { title: 'I/O', desc: 'Output results for T strings', code: 'T = int(input())\nfor _ in range(T):\n    s = input()\n    print(isPalindrome(s), cnt)' }
                    ],
                    cpp: [
                        { title: 'recursion function', desc: 'Global cnt for counting calls.\nPass string by reference (&) to avoid copy overhead.', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint cnt;  // Global counter\n\nint recursion(string& s, int l, int r) {\n    cnt++;  // Increment on each call\n    if (l >= r) return 1;       // Palindrome\n    if (s[l] != s[r]) return 0; // Mismatch\n    return recursion(s, l + 1, r - 1);\n}' },
                        { title: 'I/O', desc: 'Loop test cases with while(T--). Reset cnt to 0 each time.', code: 'int main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int T;\n    cin >> T;\n    while (T--) {\n        string s;\n        cin >> s;\n        cnt = 0;  // Reset for each test case\n        int result = recursion(s, 0, s.length() - 1);\n        cout << result << " " << cnt << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-24060',
            title: 'BOJ 24060 - Algorithm Class: Merge Sort 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24060',
            simIntro: 'Watch the order in which values are stored during the split and merge phases of merge sort!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Seojun is again a TA for the merge sort class. Below is the pseudocode for merge sort that sorts in ascending order.</p>
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
        A[i++] = tmp[t++]    # This is the "store"</pre>
                <p>Given array A, write a program that finds the Kth value stored into array A when sorting it in ascending order using merge sort. If the total number of stores is less than K, output -1.</p>
                <h4>Input</h4>
                <p>The first line contains the size of array A, N (5 ≤ N ≤ 500,000), and the store count K (1 ≤ K ≤ 10<sup>8</sup>).</p>
                <p>The next line contains N distinct elements A<sub>1</sub>, A<sub>2</sub>, ..., A<sub>N</sub>. (1 ≤ A<sub>i</sub> ≤ 10<sup>9</sup>)</p>
                <h4>Output</h4>
                <p>Print the Kth value stored into array A. If the number of stores is less than K, print -1.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 7
4 5 1 3 2</pre></div>
                    <div><strong>Output</strong><pre>-1</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 6
4 5 1 3 2</pre></div>
                    <div><strong>Output</strong><pre>2</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 500,000</li>
                    <li>1 ≤ K ≤ N²</li>
                    <li>1 ≤ A[i] ≤ 10<sup>9</sup></li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'If we just implement merge sort, the array gets sorted... but the problem is finding "the Kth value stored." We need to track the <strong>order in which values are written</strong> into the array during sorting. Where do values get written?' },
                { title: 'Where are values stored?', content: 'In the <strong>merge step</strong>! Merge sort has two phases: "splitting (divide)" and "combining (merge)." Values are actually copied into array A only during the merge step. Each time a value is moved from the temporary array back to A counts as one store.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;"><div style="display:flex;gap:4px;margin-bottom:6px;"><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;">4</span><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;">5</span><span style="color:var(--text3);margin:0 4px;">+</span><span style="padding:3px 8px;background:#00b894;color:white;border-radius:4px;">1</span><span style="padding:3px 8px;background:#00b894;color:white;border-radius:4px;">3</span></div><div style="display:flex;gap:4px;align-items:center;"><span style="color:var(--text3);">→</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;border:1px solid var(--yellow);">1</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;border:1px solid var(--yellow);">3</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;border:1px solid var(--yellow);">4</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;border:1px solid var(--yellow);">5</span><span style="color:var(--text3);margin-left:4px;">4 saves!</span></div></div>' },
                { title: 'What if we try this?', content: 'Create a global counter <code>cnt</code>, and every time a value is written to A during merge, do <code>cnt += 1</code>. The moment cnt equals K, save that value to <code>result</code> and you are done! The recursive structure of merge_sort itself (split in half with <code>q = (p+r)//2</code>, sort left/right, then merge) is implemented straight from the textbook.' },
                { title: 'Things to watch out for', content: 'If the total number of stores is less than K, you must output <code>-1</code>. If you initialize result to -1, it automatically outputs -1 when the Kth store does not exist! <span class="lang-py">With N up to 500,000, recursion depth can get deep — do not forget <code>sys.setrecursionlimit(600000)</code>!</span><span class="lang-cpp">Using global arrays avoids stack overflow concerns cleanly.</span>' }
            ],
            inputLabel: 'Input (N)',
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
                python: `import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(600000)\n\nN, K = map(int, input().split())\nA = list(map(int, input().split()))\n\ncnt = 0\nresult = -1\n\ndef merge_sort(A, p, r):\n    # Implement merge sort here\n    # Increment cnt each time a value is stored into A during merge\n    pass\n\nmerge_sort(A, 0, N-1)\nprint(result)\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nint A[500001], tmp[500001];\nint N, K, cnt = 0, result = -1;\n\nvoid merge(int p, int q, int r) {\n    // Write the merge function here\n}\n\nvoid merge_sort(int p, int r) {\n    if (p >= r) return;\n    int q = (p + r) / 2;\n    merge_sort(p, q);\n    merge_sort(q + 1, r);\n    merge(p, q, r);\n}\n\nint main() {\n    cin >> N >> K;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    merge_sort(0, N-1);\n    cout << result << endl;\n    return 0;\n}`
            },
            solutions: [{
                approach: 'Merge Sort Tracking',
                description: 'Implement merge sort while counting the order of stores during merge steps',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'merge function', desc: 'Merge two sorted segments while counting stores', code: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(600000)\n\ncnt = 0\nresult = -1\n\ndef merge(A, p, q, r):\n    global cnt, result\n    tmp = []\n    i, j = p, q + 1\n    while i <= q and j <= r:\n        if A[i] <= A[j]:\n            tmp.append(A[i]); i += 1\n        else:\n            tmp.append(A[j]); j += 1\n    while i <= q:\n        tmp.append(A[i]); i += 1\n    while j <= r:\n        tmp.append(A[j]); j += 1\n    for k in range(len(tmp)):\n        A[p + k] = tmp[k]\n        cnt += 1\n        if cnt == K:\n            result = tmp[k]' },
                        { title: 'merge_sort recursion', desc: 'Split in half, sort each half, then merge', code: 'def merge_sort(A, p, r):\n    if p >= r: return\n    q = (p + r) // 2\n    merge_sort(A, p, q)\n    merge_sort(A, q + 1, r)\n    merge(A, p, q, r)' },
                        { title: 'Kth check', desc: 'If result is already found, we could exit early', code: '# When the Kth stored value is found, it is saved in result' },
                        { title: 'I/O', desc: 'Read input, run merge_sort, and print result', code: 'N, K = map(int, input().split())\nA = list(map(int, input().split()))\nmerge_sort(A, 0, N - 1)\nprint(result)' }
                    ],
                    cpp: [
                        { title: 'merge function', desc: 'Merge using global arrays A and tmp.\nIncrement cnt on each store; save to result when cnt == K.', code: '#include <iostream>\nusing namespace std;\n\nint A[500001], tmp[500001];\nint N, K, cnt = 0, result = -1;\n\nvoid merge(int p, int q, int r) {\n    int i = p, j = q + 1, idx = p;\n    while (i <= q && j <= r) {\n        if (A[i] <= A[j]) tmp[idx++] = A[i++];\n        else tmp[idx++] = A[j++];\n    }\n    while (i <= q) tmp[idx++] = A[i++];\n    while (j <= r) tmp[idx++] = A[j++];\n    // Copy back to A while counting\n    for (int k = p; k <= r; k++) {\n        A[k] = tmp[k];\n        cnt++;\n        if (cnt == K) result = tmp[k];\n    }\n}' },
                        { title: 'merge_sort recursion', desc: 'Split in half, sort each half, then combine with merge.', code: 'void merge_sort(int p, int r) {\n    if (p >= r) return;\n    int q = (p + r) / 2;\n    merge_sort(p, q);\n    merge_sort(q + 1, r);\n    merge(p, q, r);\n}' },
                        { title: 'I/O', desc: 'Read into global array, run merge_sort, print result.', code: 'int main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    cin >> N >> K;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    merge_sort(0, N - 1);\n    cout << result << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[3].templates; }
            }]
        },
        // ========== Stage 3: Divide and Solve ==========
        {
            id: 'boj-4779',
            title: 'BOJ 4779 - Cantor Set',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/4779',
            simIntro: 'See how the middle 1/3 is recursively removed in the Cantor set!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>The Cantor set is a set of real numbers between 0 and 1, obtained by starting with [0, 1] and infinitely repeating the process of dividing each segment into three equal parts and removing the middle segment. Starting with a string of length 3^N, repeatedly replace the middle 1/3 with spaces. Repeat until there is no more input.</p>
                <h4>Input</h4>
                <p>The input consists of multiple lines. Each line contains N. Input stops at end of file. N is a non-negative integer ≤ 12.</p>
                <h4>Output</h4>
                <p>For each input N, print the corresponding Cantor set approximation.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>0</pre></div>
                    <div><strong>Output</strong><pre>-</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>1</pre></div>
                    <div><strong>Output</strong><pre>- -</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3</pre></div>
                    <div><strong>Output</strong><pre>- -   - -         - -   - -</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>0 ≤ N ≤ 12</li>
                    <li>Repeat until no more input (EOF)</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'If N=2, we start with length-9 <code>---------</code> and replace the middle 3 with spaces to get <code>---   ---</code>. But within each <code>---</code> on both sides, we also need to remove the middle! This is not a one-time operation — it is a structure that <strong>needs to be split repeatedly</strong>.' },
                { title: 'This is a recursive structure!', content: 'Divide a segment of length len into three parts: 1) recurse on the left 1/3, 2) replace the middle 1/3 with spaces, 3) recurse on the right 1/3. "Remove the middle from the whole, then repeat on both remaining sides" — classic divide and conquer!<br><br><div style="display:flex;flex-direction:column;gap:4px;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;font-family:monospace;"><div><span style="color:var(--accent);">N=0:</span> <span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span></div><div><span style="color:var(--accent);">N=1:</span> <span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span><span style="opacity:0.3;"> </span><span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span></div><div><span style="color:var(--accent);">N=2:</span> <span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span><span style="opacity:0.3;"> </span><span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span><span style="opacity:0.3;">   </span><span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span><span style="opacity:0.3;"> </span><span style="background:var(--accent);color:white;padding:1px 3px;border-radius:2px;">-</span></div></div>' },
                { title: 'What is the base case?', content: 'When the length is 1, you cannot divide into three anymore — it is just a single <code>-</code>, so return! Implementation tip: start by filling an array of length 3<sup>N</sup> entirely with <code>-</code>, then recursively <strong>overwrite</strong> the middle portions with spaces.' },
                { title: 'Handling EOF input', content: 'This problem has multiple lines of input, and does not tell you how many (repeat until EOF). <span class="lang-py">Python: Use <code>while True: try: ... except: break</code> to keep reading until there is no more input!</span><span class="lang-cpp">C++: Use <code>while(cin &gt;&gt; n)</code> to repeat until EOF! The loop ends automatically when there is no input.</span>' }
            ],
            inputLabel: 'Input (N)',
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
                python: `import sys\n\ndef cantor(arr, start, size):\n    # Write the recursive function here\n    # Replace the middle 1/3 with spaces and recurse on both sides\n    pass\n\nwhile True:\n    try:\n        n = int(input())\n        length = 3 ** n\n        arr = list('-' * length)\n        cantor(arr, 0, length)\n        print(''.join(arr))\n    except:\n        break\n`,
                cpp: `#include <iostream>\n#include <cstring>\n#include <cmath>\nusing namespace std;\n\nchar arr[600000];\n\nvoid cantor(int start, int size) {\n    // Write the recursive function here\n}\n\nint main() {\n    int n;\n    while (cin >> n) {\n        int len = pow(3, n);\n        memset(arr, '-', len);\n        arr[len] = '\\0';\n        cantor(0, len);\n        cout << arr << endl;\n    }\n    return 0;\n}`
            },
            solutions: [{
                approach: 'Array Recursion',
                description: 'Create an array and recursively replace the middle 1/3 with spaces',
                timeComplexity: 'O(3^n)',
                spaceComplexity: 'O(3^n)',
                codeSteps: {
                    python: [
                        { title: 'cantor recursive function', desc: 'Replace the middle 1/3 with spaces, then recurse on both sides', code: 'def cantor(arr, start, size):\n    if size <= 1:\n        return\n    third = size // 3\n    for i in range(start + third, start + 2 * third):\n        arr[i] = " "\n    cantor(arr, start, third)\n    cantor(arr, start + 2 * third, third)' },
                        { title: 'String initialization + call', desc: 'Create a dash array and call cantor', code: 'n = int(input())\nlength = 3 ** n\narr = list("-" * length)\ncantor(arr, 0, length)\nprint("".join(arr))' },
                        { title: 'EOF handling', desc: 'Handle multiple lines of input with try/except', code: 'while True:\n    try:\n        n = int(input())\n        length = 3 ** n\n        arr = list("-" * length)\n        cantor(arr, 0, length)\n        print("".join(arr))\n    except:\n        break' }
                    ],
                    cpp: [
                        { title: 'cantor recursive function', desc: 'Use memset to replace middle 1/3 with spaces.\nRecurse on both left and right 1/3.', code: '#include <iostream>\n#include <cstring>\n#include <cmath>\nusing namespace std;\n\nchar arr[600000];\n\nvoid cantor(int start, int size) {\n    if (size <= 1) return;\n    int t = size / 3;\n    // Replace middle 1/3 with spaces\n    memset(arr + start + t, \' \', t);\n    cantor(start, t);         // Left 1/3\n    cantor(start + 2 * t, t); // Right 1/3\n}' },
                        { title: 'EOF handling + output', desc: 'Loop until EOF with while(cin >> n).\nInitialize with dashes using memset, then call cantor.', code: 'int main() {\n    int n;\n    while (cin >> n) {\n        int len = (int)pow(3, n);\n        memset(arr, \'-\', len);  // Initialize with dashes\n        arr[len] = \'\\0\';       // Null terminate\n        cantor(0, len);\n        cout << arr << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-2447',
            title: 'BOJ 2447 - Star Pattern 10',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2447',
            simIntro: 'Watch how the center block is recursively emptied in the 9x9 star pattern!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Let us print stars in a recursive pattern. When N is a power of 3 (3, 9, 27, ...), the pattern of size N is an N x N square. The size-3 pattern is a 3x3 pattern with the center empty, and the size-N pattern consists of 8 patterns of size N/3 surrounding an empty (N/3) x (N/3) center.</p>
                <h4>Input</h4>
                <p>The first line contains N. N is a power of 3, i.e., N = 3<sup>k</sup> for some integer k, where 1 ≤ k &lt; 8.</p>
                <h4>Output</h4>
                <p>Print the star pattern from the first line to the Nth line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>27</pre></div>
                    <div><strong>Output</strong><pre>(27×27 star pattern)</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>N is a power of 3</li>
                    <li>3 ≤ N ≤ 2,187 (3<sup>7</sup>)</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'For size 3, it is a 3x3 pattern with just the center empty. For size 9? Divide 9x9 into nine 3x3 blocks, empty the center block entirely, and repeat the same pattern inside the remaining 8 blocks... This is similar to the Cantor set, but in <strong>2 dimensions</strong> instead of 1!' },
                { title: 'This is 2D recursion!', content: 'The Cantor set divided into 3 parts (1D), but this divides into <strong>9 parts (3x3, 2D)</strong>! Split a block of size into <code>third = size / 3</code>, fill the center block (i=1, j=1) with spaces, and recurse on the remaining 8 blocks. It is easiest to fill the entire grid with <code>*</code> first, then "carve out" spaces recursively.<br><br><div style="display:inline-grid;grid-template-columns:repeat(3,28px);gap:2px;padding:6px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">*</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">*</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">*</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">*</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;"> </span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">*</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">*</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">*</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">*</span></div> <span style="font-size:0.82rem;color:var(--text2);">← center is empty!</span>' },
                { title: 'How to calculate coordinates?', content: 'For a size x size block starting at (row, col), the 9 sub-blocks start at <code>(row + i*third, col + j*third)</code> where i,j = 0,1,2. The center is when i=1, j=1! Recurse on the remaining 8 blocks (<code>i != 1 || j != 1</code>).' },
                { title: 'Base case + implementation tips', content: 'When size is 1, there is nothing left to split, so return! <span class="lang-py">Python: Initialize with a 2D list <code>[["*"] * n for _ in range(n)]</code>.</span><span class="lang-cpp">C++: Initialize global <code>char grid[2200][2200]</code> with <code>memset(grid, \'*\', sizeof(grid))</code>. When printing, set <code>grid[i][N] = \'\\0\'</code> at the end of each row so it gets trimmed cleanly.</span>' }
            ],
            inputLabel: 'Input (N)',
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
                python: `import sys\n\nn = int(input())\ngrid = [['*'] * n for _ in range(n)]\n\ndef star(r, c, size):\n    # Write the recursive function here\n    # Replace center block with spaces, recurse on 8 remaining blocks\n    pass\n\nstar(0, 0, n)\nfor row in grid:\n    print(''.join(row))\n`,
                cpp: `#include <iostream>\n#include <cstring>\nusing namespace std;\n\nchar grid[2200][2200];\nint N;\n\nvoid star(int r, int c, int size) {\n    // Write the recursive function here\n}\n\nint main() {\n    cin >> N;\n    memset(grid, '*', sizeof(grid));\n    star(0, 0, N);\n    for (int i = 0; i < N; i++) {\n        grid[i][N] = '\\0';\n        cout << grid[i] << '\\n';\n    }\n    return 0;\n}`
            },
            solutions: [{
                approach: '2D Array Recursion',
                description: 'Fill everything with * then recursively replace center blocks with spaces',
                timeComplexity: 'O(n^2)',
                spaceComplexity: 'O(n^2)',
                codeSteps: {
                    python: [
                        { title: 'star recursive function', desc: 'Replace center block with spaces, recurse on 8 blocks', code: 'def star(r, c, size):\n    if size <= 1:\n        return\n    t = size // 3\n    for i in range(r + t, r + 2 * t):\n        for j in range(c + t, c + 2 * t):\n            grid[i][j] = " "\n    for i in range(3):\n        for j in range(3):\n            if i != 1 or j != 1:\n                star(r + i * t, c + j * t, t)' },
                        { title: 'Grid creation + call', desc: 'Fill N x N grid with * and call star', code: 'n = int(input())\ngrid = [["*"] * n for _ in range(n)]\nstar(0, 0, n)' },
                        { title: 'Output', desc: 'Convert each row to a string and print', code: 'for row in grid:\n    print("".join(row))' }
                    ],
                    cpp: [
                        { title: 'star recursive function', desc: 'Replace center block with spaces in 2D char array.\nRecurse on 8 of 9 blocks, excluding center (i=1,j=1).', code: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nchar grid[2200][2200];  // Global: 3^7 = 2187\nint N;\n\nvoid star(int r, int c, int size) {\n    if (size <= 1) return;\n    int t = size / 3;\n    // Replace center block with spaces\n    for (int i = r + t; i < r + 2 * t; i++)\n        for (int j = c + t; j < c + 2 * t; j++)\n            grid[i][j] = \' \';\n    // Recurse on remaining 8 blocks\n    for (int i = 0; i < 3; i++)\n        for (int j = 0; j < 3; j++)\n            if (i != 1 || j != 1)\n                star(r + i * t, c + j * t, t);\n}' },
                        { title: 'Grid creation + output', desc: 'Initialize with * using memset, then call star.\nNull-terminate each row end for clean output.', code: 'int main() {\n    cin >> N;\n    memset(grid, \'*\', sizeof(grid));\n    star(0, 0, N);\n    for (int i = 0; i < N; i++) {\n        grid[i][N] = \'\\0\';  // Mark row end\n        cout << grid[i] << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-11729',
            title: 'BOJ 11729 - Tower of Hanoi Move Sequence',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11729',
            simIntro: 'Watch how 3 disks are moved in 7 steps in the Tower of Hanoi!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There are three pegs, and n disks of different radii are stacked on the first peg. We want to move these disks to the third peg following these rules: only one disk can be moved at a time, and a larger disk can never be placed on top of a smaller one. Write a program that outputs the move sequence needed to accomplish this. The number of moves must be minimized.</p>
                <h4>Input</h4>
                <p>The first line contains the number of disks stacked on the first peg, N (1 ≤ N ≤ 20).</p>
                <h4>Output</h4>
                <p>Print the number of moves K on the first line.</p>
                <p>From the second line, print K lines each containing two integers A B separated by a space, meaning move the topmost disk from peg A to the top of peg B.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3</pre></div>
                    <div><strong>Output</strong><pre>7
1 3
1 2
3 2
1 3
2 1
2 3
1 3</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 ≤ N ≤ 20</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: '1 disk is easy — just move it. 2 disks are manageable: move the small one to the auxiliary peg, the big one to the target, then the small one back to the target. But with 3 or 4 disks, it gets complicated. Can we find a <strong>pattern</strong> instead of simulating every move?' },
                { title: 'Key idea', content: 'Break the problem of moving N disks from peg 1 to peg 3 into <strong>3 steps</strong>! 1) Move the top N-1 disks to peg 2 (so the largest disk is exposed), 2) Move the largest disk to peg 3, 3) Move the N-1 disks from peg 2 to peg 3. "Moving the top N-1 disks" is the same problem — that is recursion!<br><br><div style="display:flex;gap:16px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.8rem;flex-wrap:wrap;"><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);margin-bottom:2px;">①</div><div style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;">N-1 → aux</div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);margin-bottom:2px;">②</div><div style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;font-weight:700;">big → target</div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);margin-bottom:2px;">③</div><div style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">N-1 → target</div></div></div>' },
                { title: 'What if we try this?', content: 'Create a function <code>hanoi(n, from, to, via)</code>: move n disks from "from" to "to", using "via" as auxiliary. Base case: if <code>n = 0</code>, there is nothing to move, so return. You could also stop at <code>n = 1</code> and print from to to directly, but stopping at n=0 works naturally too!' },
                { title: 'The move count is predictable!', content: 'The minimum number of moves is <code>2<sup>N</sup> - 1</code>. This is because <code>T(N) = 2 x T(N-1) + 1</code> (move N-1 disks twice + 1 move for the largest disk). Solving this recurrence gives <code>2<sup>N</sup> - 1</code>! Print this number first, then output the move sequence.' }
            ],
            inputLabel: 'Input (N)',
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
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nmoves = []\n\ndef hanoi(n, fr, to, via):\n    # Write the recursive function here\n    pass\n\nhanoi(n, 1, 3, 2)\nprint(len(moves))\nprint('\\n'.join(moves))\n`,
                cpp: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\nvoid hanoi(int n, int from, int to, int via) {\n    // Write the recursive function here\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << (int)pow(2, n) - 1 << '\\n';\n    hanoi(n, 1, 3, 2);\n    return 0;\n}`
            },
            solutions: [{
                approach: 'Recursive',
                description: 'Use hanoi(n, from, to, via) recursion to find the move sequence',
                timeComplexity: 'O(2^n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'hanoi function', desc: 'Move N-1 to via, move largest to to, move N-1 to to', code: 'import sys\ninput = sys.stdin.readline\n\nmoves = []\n\ndef hanoi(n, fr, to, via):\n    if n == 0:\n        return\n    hanoi(n - 1, fr, via, to)\n    moves.append(f"{fr} {to}")\n    hanoi(n - 1, via, to, fr)' },
                        { title: 'Move count + call', desc: 'Print 2^n - 1, then call hanoi', code: 'n = int(input())\nprint(2 ** n - 1)\nhanoi(n, 1, 3, 2)' },
                        { title: 'Output', desc: 'Print move sequence with newlines', code: 'print("\\n".join(moves))' }
                    ],
                    cpp: [
                        { title: 'hanoi function', desc: 'Same recursive structure as Python.\nPrint directly with cout (no need to store in array).', code: '#include <iostream>\n#include <cmath>\nusing namespace std;\n\nvoid hanoi(int n, int from, int to, int via) {\n    if (n == 0) return;\n    hanoi(n - 1, from, via, to);     // Move top N-1 to via\n    cout << from << " " << to << \'\\n\'; // Move largest disk\n    hanoi(n - 1, via, to, from);     // Move N-1 to to\n}' },
                        { title: 'Move count + call', desc: 'pow(2,n)-1 = minimum number of moves.\nPrint first, then start hanoi recursion.', code: 'int main() {\n    int n;\n    cin >> n;\n    cout << (int)pow(2, n) - 1 << \'\\n\';\n    hanoi(n, 1, 3, 2);\n    return 0;\n}' }
                    ]
                },
                get templates() { return recursionTopic.problems[6].templates; }
            }]
        }
    ]
};

// Global registration
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.recursion = recursionTopic;
