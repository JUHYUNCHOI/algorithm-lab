// ===== DP Topic Module =====
var dpTopic = {
    id: 'dp',
    title: 'Dynamic Programming',
    icon: '🧩',
    category: 'Problem Solving (Silver~Gold)',
    order: 12,
    description: 'A technique for solving problems efficiently by eliminating redundant computation',
    relatedNote: 'DP covers fundamental problems like Fibonacci, stair climbing, and LIS, up to knapsack and LCS. It appears in nearly every coding test.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-24416': { type: 'Fibonacci', color: 'var(--accent)', vizMethod: '_renderVizFib1', suffix: '-fib1' },
        'boj-9184':  { type: 'Memoization', color: 'var(--green)', vizMethod: '_renderVizFun', suffix: '-fun' },
        'boj-1463':  { type: 'BFS/DP', color: '#e17055', vizMethod: '_renderViz1to', suffix: '-1to' },
        'boj-1904':  { type: 'Recurrence', color: '#6c5ce7', vizMethod: '_renderVizTile', suffix: '-tile' },
        'boj-2579':  { type: 'Conditional DP', color: '#fdcb6e', vizMethod: '_renderVizStair', suffix: '-stair' },
        'boj-2156':  { type: 'Conditional DP', color: '#00b894', vizMethod: '_renderVizWine', suffix: '-wine' },
        'boj-1912':  { type: 'Kadane Algorithm', color: '#d63031', vizMethod: '_renderVizMaxSub', suffix: '-maxsub' },
        'boj-10844': { type: 'Digit DP', color: '#0984e3', vizMethod: '_renderVizEasyStair', suffix: '-estair' },
        'boj-1149':  { type: 'Selection DP', color: '#e84393', vizMethod: '_renderVizRGB', suffix: '-rgb' },
        'boj-1932':  { type: 'Path DP', color: '#fab1a0', vizMethod: '_renderVizTriangle', suffix: '-tri' },
        'boj-11053': { type: 'LIS', color: '#74b9ff', vizMethod: '_renderVizLIS', suffix: '-lis' },
        'boj-11054': { type: 'Bidirectional LIS', color: '#a29bfe', vizMethod: '_renderVizBitonic', suffix: '-bito' },
        'boj-2565':  { type: 'LIS Application', color: '#55efc4', vizMethod: '_renderVizWire', suffix: '-wire' },
        'boj-9251':  { type: 'LCS', color: '#fd79a8', vizMethod: '_renderVizLCS', suffix: '-lcs' },
        'boj-12865': { type: 'Knapsack', color: '#636e72', vizMethod: '_renderVizKnapsack', suffix: '-knap' }
    },

    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Approach', icon: '💡' },
            { id: 'sim', label: 'Simulation', icon: '🎮' },
            { id: 'code', label: 'Code', icon: '💻' }
        ];
    },

    renderProblemContent(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>Problem not found.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>Problem metadata not found.</p>'; return; }
        self._clearVizState();
        var diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the I/O format.', icon: '📋' },
            think:   { intro: 'Don\'t jump to coding — open the hints step by step to build your strategy.', icon: '💡' },
            sim:     { intro: prob.simIntro || 'See how DP actually works step by step.', icon: '🎮' },
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
            case 'problem': self._renderProblemTab(contentDiv, prob); break;
            case 'think':   self._renderThinkTab(contentDiv, prob); break;
            case 'sim':     self[meta.vizMethod](contentDiv); break;
            case 'code':    self._renderCodeTab(contentDiv, prob); break;
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

    _renderProblemTab(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

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
            contentEl.innerHTML = '<p>Loading code tab...</p>';
        }
    },

    // ===== Render Concept Page =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>Dynamic Programming</h2>
                <p class="hero-sub">Break big problems into small pieces, and never solve the same thing twice!<br><span style="font-size:0.85em;color:var(--text2);">DP = remember answers you already found, so you never redo the work</span></p>
            </div>

            <!-- Section 1: What is DP? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> What is DP?</div>
                <div class="analogy-box">
                    Say you just added up 1+1+1+1+1 and got 5. Now someone asks, "What's 1+1+1+1+1+1?" Would you start over from the beginning? Of course not -- you'd just take your 5 and add one more to get 6!<br><br>
                    That's the whole idea behind Dynamic Programming: <strong>remember answers you already figured out, so you never do the same work twice</strong>. It sounds simple, but this one trick can turn a problem that takes millions of steps into one that takes just a few hundred.
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Fibonacci Memoization Table</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Watch the DP table being filled one cell at a time. Already computed values are never recomputed!</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">N:
                            <input type="number" id="dp-demo-fib-input" value="8" min="3" max="12" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-fib-go">Fill Table</button>
                        <button class="concept-demo-btn green" id="dp-demo-fib-reset" style="display:none;">Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="dp-demo-fib-table" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;"></div>
                        <div id="dp-demo-fib-formula" style="text-align:center;font-size:0.95rem;color:var(--text);font-weight:600;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-fib-msg">dp[i] = dp[i-1] + dp[i-2]. Fill from the smallest values first.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">When computing Fibonacci numbers recursively, if you call fib(5), how many times is fib(3) called in total?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>2 times</strong>!<br>
                        fib(5) → fib(4) + fib(3)<br>
                        fib(4) → fib(3) + fib(2)<br>
                        So fib(3) is called 2 times. As n grows, the redundancy explodes.<br>
                        The <code>same computation repeats</code>. DP eliminates this repetition.
                    </div>
                </div>
            </div>

            <!-- Section 2: Two Conditions for DP -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> Two Conditions for DP</div>
                <div class="analogy-box">
                    Not every problem benefits from DP -- it only helps when two things are true. Think of it like a notebook of answers: it only saves you time if you keep running into the <em>same questions</em>, and if the answer to a big question can be built from answers to smaller ones.
                </div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="30" cy="40" r="20" fill="none" stroke="var(--accent)" stroke-width="2" opacity="0.6"/>
                                <circle cx="50" cy="40" r="20" fill="none" stroke="var(--accent2)" stroke-width="2" opacity="0.6"/>
                            </svg>
                        </div>
                        <h3>Overlapping Subproblems</h3>
                        <p>The same mini-problems keep popping up again and again. Without DP, you'd solve them from scratch every time. With DP, you write the answer down once and just look it up next time.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="50" width="15" height="20" rx="2" fill="var(--accent)" opacity="0.4"/>
                                <rect x="32" y="35" width="15" height="35" rx="2" fill="var(--accent)" opacity="0.6"/>
                                <rect x="54" y="15" width="15" height="55" rx="2" fill="var(--accent)" opacity="0.9"/>
                            </svg>
                        </div>
                        <h3>Optimal Substructure</h3>
                        <p>The best answer to a big problem is built by combining the best answers to smaller problems. Solve the small pieces well, snap them together, and you've got the answer to the whole thing.</p>
                    </div>
                </div>

                <div style="margin:1rem 0;font-size:0.85rem;color:var(--text2);">
                    <strong>References:</strong>
                    <a href="https://en.wikipedia.org/wiki/Dynamic_programming" target="_blank" style="color:var(--accent);text-decoration:underline;">Wikipedia: Dynamic Programming ↗</a> ·
                    <a href="https://en.wikipedia.org/wiki/Overlapping_subproblems" target="_blank" style="color:var(--accent);text-decoration:underline;">Overlapping Subproblems ↗</a> ·
                    <a href="https://en.wikipedia.org/wiki/Optimal_substructure" target="_blank" style="color:var(--accent);text-decoration:underline;">Optimal Substructure ↗</a> ·
                    <span class="lang-py"><a href="https://docs.python.org/3/library/functools.html#functools.lru_cache" target="_blank" style="color:var(--accent);text-decoration:underline;">Python functools.lru_cache ↗</a></span>
                    <span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="color:var(--accent);text-decoration:underline;">C++ unordered_map ↗</a></span>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Fibonacci Call Tree: See the Overlap!</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">When you call fib(N) recursively, the same values are called multiple times. Nodes in <strong style="color:var(--red);">red</strong> are duplicate calls!</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">N:
                            <input type="number" id="dp-demo-calltree-input" value="5" min="3" max="7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-calltree-go">Show Call Tree</button>
                        <button class="concept-demo-btn green" id="dp-demo-calltree-reset" style="display:none;">Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="dp-demo-calltree-viz" style="overflow-x:auto;padding:10px 0;"></div>
                        <div id="dp-demo-calltree-stats" style="text-align:center;font-size:0.9rem;color:var(--text2);margin-top:8px;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-calltree-msg">Overlapping subproblems: the same fib(k) is called multiple times. DP eliminates this redundancy!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Recursion vs DP: See the Difference!</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Compare how many function calls <strong>plain recursion</strong> makes vs <strong>DP (memoization)</strong> for the same fib(N).</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">N:
                            <input type="number" id="dp-demo-recvsdp-input" value="5" min="3" max="7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-recvsdp-rec" style="background:var(--red);color:white;">Solve with Recursion</button>
                        <button class="concept-demo-btn" id="dp-demo-recvsdp-dp" style="background:var(--green);color:white;">Solve with DP</button>
                        <button class="concept-demo-btn green" id="dp-demo-recvsdp-reset" style="display:none;">Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;align-items:flex-start;">
                            <div style="flex:1;min-width:200px;">
                                <div style="font-weight:600;margin-bottom:6px;font-size:0.9rem;">Call Log</div>
                                <div id="dp-demo-recvsdp-log" style="font-size:0.8rem;color:var(--text2);max-height:180px;overflow-y:auto;padding:8px 10px;background:var(--bg2);border-radius:8px;border:1px solid var(--border);min-height:60px;"></div>
                            </div>
                            <div style="flex:0 0 auto;min-width:140px;text-align:center;">
                                <div style="font-weight:600;margin-bottom:6px;font-size:0.9rem;">Memo Table</div>
                                <div id="dp-demo-recvsdp-memo" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;min-height:44px;"></div>
                            </div>
                        </div>
                        <div id="dp-demo-recvsdp-counter" style="text-align:center;font-size:1rem;font-weight:700;margin-top:12px;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-recvsdp-msg">Recursion: repeats the same computation. DP: compute once, store, and reuse — drastically fewer calls!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">Which of these problems can be solved with DP? Click to check!</span>
                    </div>
                    <div class="quiz-cards">
                        <div class="quiz-card" data-isdp="true">
                            <div><span class="quiz-text">"How many ways to reach the nth step if you can climb 1 or 2 steps at a time?"</span><div class="quiz-explain">The answers to small problems (steps n-1, n-2) repeat, and small answers build up to the big answer.</div></div>
                            <span class="quiz-badge">Click!</span><span class="quiz-result">OK: DP works!</span>
                        </div>
                        <div class="quiz-card" data-isdp="false">
                            <div><span class="quiz-text">"Finding the largest number in an array"</span><div class="quiz-explain">A simple problem solved by comparing one by one. No repeated computation.</div></div>
                            <span class="quiz-badge">Click!</span><span class="quiz-result">No: DP not needed</span>
                        </div>
                        <div class="quiz-card" data-isdp="true">
                            <div><span class="quiz-text">"Given coin denominations, find the minimum number of coins to make amount n"</span><div class="quiz-explain">Making amount n breaks into smaller amounts, and the same amounts appear repeatedly.</div></div>
                            <span class="quiz-badge">Click!</span><span class="quiz-result">OK: DP works!</span>
                        </div>
                        <div class="quiz-card" data-isdp="false">
                            <div><span class="quiz-text">"Sorting a given array in ascending order"</span><div class="quiz-explain">Sorting is solved by comparing and swapping elements, not a DP problem.</div></div>
                            <span class="quiz-badge">Click!</span><span class="quiz-result">No: DP not needed</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 3: 4 Steps to Solve DP Problems -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 4 Steps to Solve DP Problems</div>
                <p style="color:var(--text2); margin-bottom:1rem;">When you encounter a DP problem, follow these 4 steps in order. We will use Fibonacci as an example.</p>

                <div class="steps-flow">
                    <div class="step-card">
                        <div class="step-card-header"><span class="step-num">1</span><h4>Define the Cell Meaning</h4></div>
                        <p>Decide "what value to store in dp[i]." This is the most important step.</p>
                        <div class="think-box" style="margin:0.8rem 0 0">
                            <div class="think-box-question">
                                <span class="think-box-question-icon">Q</span>
                                <span class="think-box-question-text">What does dp[i] mean for Fibonacci?</span>
                            </div>
                            <button class="think-box-trigger">🤔 Think first, then click!</button>
                            <div class="think-box-answer"><code>dp[i]</code> = the i-th Fibonacci number. That is, it stores the value of fib(i).</div>
                        </div>
                    </div>

                    <div class="step-card">
                        <div class="step-card-header"><span class="step-num">2</span><h4>Find the Recurrence Relation</h4></div>
                        <p>Find the rule for computing dp[i] from previous values (dp[i-1], dp[i-2], etc.).</p>
                        <div class="think-box" style="margin:0.8rem 0 0">
                            <div class="think-box-question">
                                <span class="think-box-question-icon">Q</span>
                                <span class="think-box-question-text">What is the recurrence relation for Fibonacci?</span>
                            </div>
                            <button class="think-box-trigger">🤔 Think first, then click!</button>
                            <div class="think-box-answer"><code>dp[i] = dp[i-1] + dp[i-2]</code><br>The i-th Fibonacci number = sum of the two preceding numbers</div>
                        </div>
                    </div>

                    <div class="step-card">
                        <div class="step-card-header"><span class="step-num">3</span><h4>Set Initial Values</h4></div>
                        <p>Define the base cases needed to start the recurrence.</p>
                        <div class="think-box" style="margin:0.8rem 0 0">
                            <div class="think-box-question">
                                <span class="think-box-question-icon">Q</span>
                                <span class="think-box-question-text">What are the base cases for Fibonacci? What are dp[1] and dp[2]?</span>
                            </div>
                            <button class="think-box-trigger">🤔 Think first, then click!</button>
                            <div class="think-box-answer"><code>dp[1] = 1, dp[2] = 1</code><br>These two values are needed so we can compute dp[3] = dp[2] + dp[1] and onwards.</div>
                        </div>
                    </div>

                    <div class="step-card">
                        <div class="step-card-header"><span class="step-num">4</span><h4>Determine Computation Order</h4></div>
                        <p>Decide the order to fill the dp table. From small problems to big problems!</p>
                        <div class="think-box" style="margin:0.8rem 0 0">
                            <div class="think-box-question">
                                <span class="think-box-question-icon">Q</span>
                                <span class="think-box-question-text">To compute dp[i], we need dp[i-1] and dp[i-2] first. In what order should we fill?</span>
                            </div>
                            <button class="think-box-trigger">🤔 Think first, then click!</button>
                            <div class="think-box-answer"><strong>From i = 3 to n, in order!</strong><br>We must fill from small indices first so the values needed for larger indices are already available.</div>
                        </div>
                    </div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Climbing Stairs in 4 Steps</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">When you can climb 1 or 2 steps at a time, find the number of ways to reach each step.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">Steps:
                            <input type="number" id="dp-demo-stair-input" value="6" min="2" max="10" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-stair-go">Start Filling</button>
                        <button class="concept-demo-btn green" id="dp-demo-stair-reset" style="display:none;">Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="dp-demo-stair-viz" style="display:flex;align-items:flex-end;gap:6px;flex-wrap:wrap;min-height:120px;padding-bottom:10px;"></div>
                        <div id="dp-demo-stair-formula" style="text-align:center;font-size:0.95rem;color:var(--text);font-weight:600;min-height:1.5em;margin-top:8px;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-stair-msg">dp[i] = dp[i-1] + dp[i-2]. Step i can be reached by climbing 1 from (i-1) or 2 from (i-2)!</div>
                </div>
            </div>

            <!-- Section 4: Top-Down vs Bottom-Up -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> Top-Down vs Bottom-Up</div>
                <p style="margin-bottom:1rem; color:var(--text2);">In the Top-Down approach, the technique of storing results is called <strong>Memoization</strong> — remember what you already computed! It means "memorizing results that have already been computed." <span class="lang-py">In Python, you can automate memoization with the <code>functools.lru_cache</code> decorator.</span></p>
                <div style="margin-bottom:1.2rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/functools.html#functools.lru_cache" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: functools.lru_cache ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: unordered_map ↗</a></span>
                </div>

                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔽 Top-Down</h3>
                        <p class="approach-desc">Recursion + caching. Start from the big problem and solve smaller ones only when needed</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">memo = {}
def fib(n):
    if n in memo:
        return memo[n]
    if n &lt;= 2:
        return 1
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">#include &lt;unordered_map&gt;
using namespace std;

unordered_map&lt;int, int&gt; memo;
int fib(int n) {
    if (memo.count(n)) return memo[n];
    if (n &lt;= 2) return 1;
    memo[n] = fib(n-1) + fib(n-2);
    return memo[n];
}</code></pre></div></span>
                    </div>
                    <div class="approach-card">
                        <h3>🔼 Bottom-Up</h3>
                        <p class="approach-desc">Loop + table filling. Fill from the smallest problems upward in order</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">def fib(n):
    dp = [0] * (n+1)
    dp[1] = dp[2] = 1
    for i in range(3, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">#include &lt;vector&gt;
using namespace std;

int fib(int n) {
    vector&lt;int&gt; dp(n+1, 0);
    dp[1] = dp[2] = 1;
    for (int i = 3; i &lt;= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}</code></pre></div></span>
                    </div>
                </div>

                <div class="execution-flow-compare">
                    <h4>What happens when we compute fib(5) with each approach?</h4>
                    <div class="flow-grid">
                        <div class="flow-card topdown-flow">
                            <div class="flow-label">🔽 Top-Down Execution Flow</div>
                            <div class="flow-trace">
                                <div>Call fib(5)</div>
                                <div>&nbsp;&nbsp;→ Need fib(4) → Need fib(3)</div>
                                <div>&nbsp;&nbsp;&nbsp;&nbsp;→ fib(2) = 1 ✓ fib(1) = 1 ✓</div>
                                <div>&nbsp;&nbsp;&nbsp;&nbsp;← fib(3) = 2 stored!</div>
                                <div>&nbsp;&nbsp;→ fib(2) = <strong>memo!</strong> instant return</div>
                                <div>&nbsp;&nbsp;← fib(4) = 3 stored!</div>
                                <div>→ fib(3) = <strong>memo!</strong> instant return</div>
                                <div>← fib(5) = 5</div>
                            </div>
                            <div class="flow-point">Digs from top to bottom, computing only what is needed</div>
                        </div>
                        <div class="flow-card bottomup-flow">
                            <div class="flow-label">🔼 Bottom-Up Execution Flow</div>
                            <div class="flow-trace">
                                <div>dp[1] = 1</div>
                                <div>dp[2] = 1</div>
                                <div>dp[3] = dp[2] + dp[1] = 2</div>
                                <div>dp[4] = dp[3] + dp[2] = 3</div>
                                <div>dp[5] = dp[4] + dp[3] = 5</div>
                            </div>
                            <div class="flow-point">Fills from smallest to largest, computing everything in order</div>
                        </div>
                    </div>
                </div>

                <div class="key-difference-box">
                    <div>🔽 <strong>Top-Down</strong>: "Follow what the big problem needs" and compute on demand (only when needed)</div>
                    <div>🔼 <strong>Bottom-Up</strong>: "Prepare all small problems in advance" and build up (compute everything)</div>
                    <div>💡 The result is the same, but Top-Down uses <strong>recursion</strong>, Bottom-Up uses <strong>loops</strong>. In most cases Bottom-Up is faster and safer.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What problem occurs if you solve fib(5000) with Top-Down in <span class="lang-py">Python</span><span class="lang-cpp">C++</span>?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <span class="lang-py">Python has a <strong>default recursion depth limit of 1000</strong>.<br>
                        fib(100) is fine with depth 100, but fib(5000) will crash with a <code>RecursionError</code>!</span>
                        <span class="lang-cpp">C++ does not have an explicit recursion depth limit, but it depends on <strong>stack memory size</strong> (default ~1MB).<br>
                        fib(5000) would recurse too deeply and may cause a <code>Stack Overflow</code>!</span><br><br>
                        Bottom-Up uses a <strong>for loop</strong>, so there is no such concern.<br>
                        <strong>Practical tip:</strong> In most contests and coding tests, Bottom-Up is preferred. Loops are faster, and there is no risk of stack overflow like with deep recursion.
                    </div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Top-Down vs Bottom-Up</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Compare how two approaches compute fib(N) -- see how the computation order differs.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">N:
                            <input type="number" id="dp-demo-compare-input" value="6" min="3" max="8" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-compare-go">Start Comparison</button>
                        <button class="concept-demo-btn green" id="dp-demo-compare-reset" style="display:none;">Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;">Top-Down (recursion+memo)</div>
                                <div id="dp-demo-td-cells" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;"></div>
                                <div id="dp-demo-td-log" style="font-size:0.8rem;color:var(--text2);min-height:3em;max-height:100px;overflow-y:auto;"></div>
                            </div>
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;">Bottom-Up (loop)</div>
                                <div id="dp-demo-bu-cells" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;"></div>
                                <div id="dp-demo-bu-log" style="font-size:0.8rem;color:var(--text2);min-height:3em;max-height:100px;overflow-y:auto;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-compare-msg">Top-Down computes only what is needed, Bottom-Up computes everything from the smallest up.</div>
                </div>
            </div>

            <!-- Section 5: Performance Comparison -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> Recursion vs DP Performance</div>
                <div class="comparison-container">
                    <div class="compare-card bad">
                        <div class="compare-header"><span class="compare-emoji">🐢</span><h3>Recursion (Brute Force — try every possibility)</h3></div>
                        <div class="compare-body"><div class="complexity">O(2<sup>n</sup>)</div><p>Repeats the same computation</p></div>
                    </div>
                    <div class="vs-badge">VS</div>
                    <div class="compare-card good">
                        <div class="compare-header"><span class="compare-emoji">🚀</span><h3>DP (Store and Reuse)</h3></div>
                        <div class="compare-body"><div class="complexity">O(n)</div><p>Compute once, store, reuse</p></div>
                    </div>
                </div>
                <div class="perf-demo">
                    <p class="perf-label">fib(<span id="perf-n">10</span>) Call count comparison - try moving the slider!</p>
                    <div class="perf-slider-wrap"><input type="range" id="perf-slider" min="3" max="25" value="10"></div>
                    <div class="perf-result">
                        <div class="perf-bar-wrapper"><span class="perf-bar-label">Recursion</span><div class="perf-bar recursive-bar"><span id="recursive-count"></span></div></div>
                        <div class="perf-bar-wrapper"><span class="perf-bar-label">DP</span><div class="perf-bar dp-bar"><span id="dp-count"></span></div></div>
                    </div>
                </div>
            </div>

            <!-- Section 6: DP Type Roadmap -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">6</span> DP Type Classification Roadmap</div>
                <p style="color:var(--text2); margin-bottom:1rem;">DP problems can be broadly classified into the following types. Try solving problems of each type in the Problems tab!</p>
                <div class="dp-roadmap">
                    <div class="roadmap-item"><div class="roadmap-icon">🔢</div><h4>1D DP</h4><p>Fibonacci, 01 Tile, Make It 1</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">🪜</div><h4>Conditional 1D DP</h4><p>Climbing Stairs, Wine Tasting, Contiguous Sum</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">📊</div><h4>2D DP</h4><p>RGB Street, Integer Triangle, Staircase Numbers</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">📈</div><h4>Longest Increasing Subsequence (LIS)</h4><p>Increasing Subsequence, Bitonic Sequence, Electric Wires</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">🔤</div><h4>Longest Common Subsequence (LCS)</h4><p>Comparing two strings, 2D table</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">🎒</div><h4>Knapsack Problem</h4><p>Choosing the most valuable items within a weight limit</p></div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — DP Type Matching Quiz</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Read the problem description and guess which DP type it belongs to!</p>
                    <div class="concept-demo-body">
                        <div id="dp-demo-quiz-cards" style="display:flex;flex-direction:column;gap:10px;"></div>
                        <div id="dp-demo-quiz-score" style="text-align:center;font-size:1rem;font-weight:600;margin-top:12px;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-quiz-msg">Click a problem to see the answer. Green for correct, red for wrong!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">When you encounter a new DP problem, how can you identify its type?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>The key is "how you define the state":</strong><br>
                        - If dp[i] alone is enough → <strong>1D DP</strong><br>
                        - If you need 2+ variables like dp[i][j] → <strong>2D DP</strong><br>
                        - If you see keywords like "increasing/decreasing order" → <strong>LIS family</strong><br>
                        - If it involves "comparing two strings/sequences" → <strong>LCS family</strong><br>
                        - If it involves "weight/capacity limit + selection" → <strong>Knapsack</strong><br><br>
                        With practice, you will start recognizing these naturally!
                    </div>
                </div>
            </div>
        `;

        // Performance comparison slider event
        var slider = container.querySelector('#perf-slider');
        var self = this;
        var updatePerf = function() {
            var n = parseInt(slider.value);
            container.querySelector('#perf-n').textContent = n;
            var recCount = self._fib(n);
            var dpC = n - 2;
            container.querySelector('#recursive-count').textContent = recCount.toLocaleString();
            container.querySelector('#dp-count').textContent = dpC;
            container.querySelector('.recursive-bar').style.width = '100%';
            container.querySelector('.dp-bar').style.width = Math.max((dpC / recCount) * 100, 3) + '%';
        };
        slider.addEventListener('input', updatePerf);
        updatePerf();

        // think-box interactions
        this._initConceptInteractions(container);

        // syntax highlighting
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // concept demos
        this._initConceptDemos(container);
    },

    _initConceptDemos(container) {
        var self = this;

        // === Demo 1: Fibonacci Memoization Table ===
        {
            var fibGoBtn = container.querySelector('#dp-demo-fib-go');
            var fibResetBtn = container.querySelector('#dp-demo-fib-reset');
            var fibInput = container.querySelector('#dp-demo-fib-input');
            var fibTable = container.querySelector('#dp-demo-fib-table');
            var fibFormula = container.querySelector('#dp-demo-fib-formula');
            var fibMsg = container.querySelector('#dp-demo-fib-msg');

            function cellStyle(state) {
                var bg = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : 'var(--bg2)');
                var border = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : 'var(--border)');
                var color = (state === 'active' || state === 'done') ? 'white' : 'var(--text3)';
                var shadow = state === 'active' ? 'box-shadow:0 0 10px var(--yellow)50;transform:scale(1.08);' : '';
                return 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:52px;height:52px;border-radius:10px;border:2px solid ' + border + ';background:' + bg + ';color:' + color + ';font-weight:700;font-size:0.9rem;transition:all 0.3s;' + shadow;
            }

            function renderCells(n, dp, activeIdx) {
                fibTable.innerHTML = '';
                for (var i = 1; i <= n; i++) {
                    var state = (i === activeIdx) ? 'active' : (dp[i] !== undefined ? 'done' : 'empty');
                    var div = document.createElement('div');
                    div.style.cssText = cellStyle(state);
                    div.innerHTML = '<div style="font-size:0.65rem;opacity:0.7;">dp[' + i + ']</div><div>' + (dp[i] !== undefined ? dp[i] : '?') + '</div>';
                    fibTable.appendChild(div);
                }
            }

            fibGoBtn.addEventListener('click', function() {
                fibGoBtn.style.display = 'none';
                fibResetBtn.style.display = '';
                var n = Math.max(3, Math.min(12, parseInt(fibInput.value) || 8));
                var dp = {};
                dp[1] = 1; dp[2] = 1;
                renderCells(n, dp);
                fibFormula.textContent = 'dp[1] = 1, dp[2] = 1 (initial values)';

                var idx = 3;
                function nextFill() {
                    if (idx > n) {
                        renderCells(n, dp);
                        fibFormula.innerHTML = 'fib(' + n + ') = <strong style="color:var(--green);">' + dp[n] + '</strong>';
                        fibMsg.textContent = 'Done! Filled the dp table from smallest to find fib(' + n + ').';
                        return;
                    }
                    renderCells(n, dp, idx);
                    fibFormula.textContent = 'dp[' + idx + '] = dp[' + (idx - 1) + '](' + dp[idx - 1] + ') + dp[' + (idx - 2) + '](' + dp[idx - 2] + ') = ' + (dp[idx - 1] + dp[idx - 2]);
                    setTimeout(function() {
                        dp[idx] = dp[idx - 1] + dp[idx - 2];
                        renderCells(n, dp);
                        idx++;
                        setTimeout(nextFill, 450);
                    }, 400);
                }
                setTimeout(nextFill, 600);
            });

            fibResetBtn.addEventListener('click', function() {
                fibGoBtn.style.display = '';
                fibResetBtn.style.display = 'none';
                fibTable.innerHTML = '';
                fibFormula.textContent = '';
                fibMsg.textContent = 'dp[i] = dp[i-1] + dp[i-2]. Fill from the smallest values first.';
            });
        }

        // === Demo 2: Climbing Stairs ===
        {
            var stairGoBtn = container.querySelector('#dp-demo-stair-go');
            var stairResetBtn = container.querySelector('#dp-demo-stair-reset');
            var stairInput = container.querySelector('#dp-demo-stair-input');
            var stairViz = container.querySelector('#dp-demo-stair-viz');
            var stairFormula = container.querySelector('#dp-demo-stair-formula');
            var stairMsg = container.querySelector('#dp-demo-stair-msg');

            function renderStairs(n, dp, activeIdx) {
                stairViz.innerHTML = '';
                for (var i = 0; i <= n; i++) {
                    var h = 30 + i * 14;
                    var state = (i === activeIdx) ? 'active' : (dp[i] !== undefined ? 'done' : 'empty');
                    var bg = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--accent)' : 'var(--bg3)');
                    var color = (state === 'active' || state === 'done') ? 'white' : 'var(--text3)';
                    var shadow = state === 'active' ? 'box-shadow:0 0 12px var(--yellow)50;' : '';
                    var div = document.createElement('div');
                    div.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;width:50px;height:' + h + 'px;background:' + bg + ';border-radius:8px 8px 0 0;color:' + color + ';font-weight:700;padding-bottom:6px;transition:all 0.3s;' + shadow;
                    div.innerHTML = '<div style="font-size:0.65rem;opacity:0.8;">' + (i === 0 ? 'ground' : 'step ' + i) + '</div><div style="font-size:0.9rem;">' + (dp[i] !== undefined ? dp[i] : '?') + '</div>';
                    stairViz.appendChild(div);
                }
            }

            stairGoBtn.addEventListener('click', function() {
                stairGoBtn.style.display = 'none';
                stairResetBtn.style.display = '';
                var n = Math.max(2, Math.min(10, parseInt(stairInput.value) || 6));
                var dp = {};
                dp[0] = 1; dp[1] = 1;
                renderStairs(n, dp);
                stairFormula.textContent = 'dp[0] = 1 (ground), dp[1] = 1 (1 way)';

                var idx = 2;
                function nextStep() {
                    if (idx > n) {
                        renderStairs(n, dp);
                        stairFormula.innerHTML = 'Ways to reach step ' + n + ': <strong style="color:var(--green);">' + dp[n] + ' ways</strong>';
                        stairMsg.textContent = 'Done! Ways for each step = sum of one below (1 step) + two below (2 steps).';
                        return;
                    }
                    renderStairs(n, dp, idx);
                    dp[idx] = dp[idx - 1] + dp[idx - 2];
                    stairFormula.textContent = 'dp[' + idx + '] = dp[' + (idx - 1) + '](' + dp[idx - 1] + ') + dp[' + (idx - 2) + '](' + dp[idx - 2] + ') = ' + dp[idx];
                    setTimeout(function() {
                        renderStairs(n, dp);
                        idx++;
                        setTimeout(nextStep, 450);
                    }, 400);
                }
                setTimeout(nextStep, 600);
            });

            stairResetBtn.addEventListener('click', function() {
                stairGoBtn.style.display = '';
                stairResetBtn.style.display = 'none';
                stairViz.innerHTML = '';
                stairFormula.textContent = '';
                stairMsg.textContent = 'dp[i] = dp[i-1] + dp[i-2]. Step i can be reached by climbing 1 from (i-1) or 2 from (i-2)!';
            });
        }

        // === Demo 3: Top-Down vs Bottom-Up Comparison ===
        {
            var cmpGoBtn = container.querySelector('#dp-demo-compare-go');
            var cmpResetBtn = container.querySelector('#dp-demo-compare-reset');
            var cmpInput = container.querySelector('#dp-demo-compare-input');
            var tdCells = container.querySelector('#dp-demo-td-cells');
            var buCells = container.querySelector('#dp-demo-bu-cells');
            var tdLog = container.querySelector('#dp-demo-td-log');
            var buLog = container.querySelector('#dp-demo-bu-log');
            var cmpMsg = container.querySelector('#dp-demo-compare-msg');

            function cmpCellStyle(state) {
                var bg = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : (state === 'memo' ? 'var(--accent)' : 'var(--bg2)'));
                var border = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : (state === 'memo' ? 'var(--accent)' : 'var(--border)'));
                var color = state !== 'empty' ? 'white' : 'var(--text3)';
                var shadow = state === 'active' ? 'box-shadow:0 0 8px var(--yellow)50;' : '';
                return 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:44px;height:44px;border-radius:8px;border:2px solid ' + border + ';background:' + bg + ';color:' + color + ';font-weight:700;font-size:0.8rem;transition:all 0.3s;' + shadow;
            }

            function renderCmpCells(el, n, vals, activeIdx) {
                el.innerHTML = '';
                for (var i = 1; i <= n; i++) {
                    var state = (i === activeIdx) ? 'active' : (vals[i] !== undefined ? 'done' : 'empty');
                    var div = document.createElement('div');
                    div.style.cssText = cmpCellStyle(state);
                    div.innerHTML = '<div style="font-size:0.6rem;opacity:0.7;">[' + i + ']</div>' + (vals[i] !== undefined ? vals[i] : '?');
                    el.appendChild(div);
                }
            }

            cmpGoBtn.addEventListener('click', function() {
                cmpGoBtn.style.display = 'none';
                cmpResetBtn.style.display = '';
                var n = Math.max(3, Math.min(8, parseInt(cmpInput.value) || 6));
                var tdVals = {}, buVals = {};
                tdLog.innerHTML = '';
                buLog.innerHTML = '';
                renderCmpCells(tdCells, n, tdVals);
                renderCmpCells(buCells, n, buVals);

                // Bottom-Up: straightforward i=1..n
                var buSteps = [];
                buSteps.push({ i: 1, val: 1, log: 'dp[1] = 1 (base case)' });
                buSteps.push({ i: 2, val: 1, log: 'dp[2] = 1 (base case)' });
                for (var bi = 3; bi <= n; bi++) {
                    var bprev = buSteps[bi - 2].val, bprev2 = buSteps[bi - 3].val;
                    buSteps.push({ i: bi, val: bprev + bprev2, log: 'dp[' + bi + '] = dp[' + (bi - 1) + '] + dp[' + (bi - 2) + '] = ' + (bprev + bprev2) });
                }

                // Top-Down: simulate recursive call order for fib(n) with memoization
                var tdSteps = [];
                var memo = {};
                function simTD(x) {
                    if (memo[x] !== undefined) {
                        tdSteps.push({ i: x, val: memo[x], log: 'fib(' + x + ') = memo[' + x + '] = ' + memo[x] + ' (cached!)' });
                        return memo[x];
                    }
                    if (x <= 2) { memo[x] = 1; tdSteps.push({ i: x, val: 1, log: 'fib(' + x + ') = 1 (base)' }); return 1; }
                    var a = simTD(x - 1);
                    var b = simTD(x - 2);
                    memo[x] = a + b;
                    tdSteps.push({ i: x, val: a + b, log: 'fib(' + x + ') = ' + a + ' + ' + b + ' = ' + (a + b) });
                    return a + b;
                }
                simTD(n);

                var maxSteps = Math.max(tdSteps.length, buSteps.length);
                var step = 0;
                var tdDone = {}, buDone2 = {};

                function animateStep() {
                    if (step >= maxSteps) {
                        cmpMsg.textContent = 'Top-Down: ' + tdSteps.length + ' steps, Bottom-Up: ' + buSteps.length + ' steps. Same result, different computation order!';
                        return;
                    }
                    if (step < tdSteps.length) {
                        var ts = tdSteps[step];
                        tdDone[ts.i] = ts.val;
                        renderCmpCells(tdCells, n, tdDone, ts.i);
                        tdLog.innerHTML += '<div>' + ts.log + '</div>';
                        tdLog.scrollTop = tdLog.scrollHeight;
                    }
                    if (step < buSteps.length) {
                        var bs = buSteps[step];
                        buDone2[bs.i] = bs.val;
                        renderCmpCells(buCells, n, buDone2, bs.i);
                        buLog.innerHTML += '<div>' + bs.log + '</div>';
                        buLog.scrollTop = buLog.scrollHeight;
                    }
                    step++;
                    setTimeout(animateStep, 600);
                }
                animateStep();
            });

            cmpResetBtn.addEventListener('click', function() {
                cmpGoBtn.style.display = '';
                cmpResetBtn.style.display = 'none';
                tdCells.innerHTML = '';
                buCells.innerHTML = '';
                tdLog.innerHTML = '';
                buLog.innerHTML = '';
                cmpMsg.textContent = 'Top-Down computes only what is needed, Bottom-Up computes everything from the smallest up.';
            });
        }

        // === Demo 4: DP Type Matching Quiz ===
        {
            var quizData = [
                { q: 'Find the Nth Fibonacci number', answer: '1D DP', options: ['1D DP', '2D DP', 'LIS', 'Knapsack'] },
                { q: 'Maximum sum path from top to bottom of a triangle', answer: '2D DP', options: ['1D DP', '2D DP', 'LCS', 'Knapsack'] },
                { q: 'Length of the longest increasing subsequence', answer: 'LIS', options: ['1D DP', 'LIS', 'LCS', 'Knapsack'] },
                { q: 'Length of the longest common subsequence of two strings', answer: 'LCS', options: ['1D DP', 'LIS', 'LCS', '2D DP'] },
                { q: 'Maximize value in a bag with weight limit', answer: 'Knapsack', options: ['1D DP', '2D DP', 'LCS', 'Knapsack'] }
            ];
            var quizCards = container.querySelector('#dp-demo-quiz-cards');
            var quizScore = container.querySelector('#dp-demo-quiz-score');
            var quizMsgEl = container.querySelector('#dp-demo-quiz-msg');
            var totalCorrect = 0, totalAnswered = 0;

            quizData.forEach(function(item, qIdx) {
                var card = document.createElement('div');
                card.style.cssText = 'padding:14px 18px;border-radius:12px;border:2px solid var(--border);background:var(--bg2);transition:all 0.3s;';
                var qDiv = document.createElement('div');
                qDiv.style.cssText = 'font-weight:600;font-size:0.95rem;margin-bottom:10px;color:var(--text);';
                qDiv.textContent = (qIdx + 1) + '. ' + item.q;
                card.appendChild(qDiv);
                var optWrap = document.createElement('div');
                optWrap.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';

                item.options.forEach(function(opt) {
                    var btn = document.createElement('button');
                    btn.style.cssText = 'padding:6px 14px;border-radius:8px;border:1.5px solid var(--border);background:var(--card);color:var(--text);font-size:0.85rem;cursor:pointer;transition:all 0.2s;';
                    btn.textContent = opt;
                    btn.addEventListener('click', function() {
                        if (card.dataset.answered) return;
                        card.dataset.answered = 'true';
                        totalAnswered++;
                        var correct = (opt === item.answer);
                        if (correct) {
                            totalCorrect++;
                            btn.style.background = 'var(--green)';
                            btn.style.color = 'white';
                            btn.style.borderColor = 'var(--green)';
                            card.style.borderColor = 'var(--green)';
                        } else {
                            btn.style.background = 'var(--red)';
                            btn.style.color = 'white';
                            btn.style.borderColor = 'var(--red)';
                            card.style.borderColor = 'var(--red)';
                            optWrap.querySelectorAll('button').forEach(function(b) {
                                if (b.textContent === item.answer) {
                                    b.style.background = 'var(--green)';
                                    b.style.color = 'white';
                                    b.style.borderColor = 'var(--green)';
                                }
                            });
                        }
                        quizScore.innerHTML = totalCorrect + ' / ' + totalAnswered + ' correct' + (totalAnswered === quizData.length ? ' — ' + (totalCorrect === quizData.length ? '<span style="color:var(--green);">All correct!</span>' : '<span style="color:var(--accent);">Try again!</span>') : '');
                    });
                    optWrap.appendChild(btn);
                });
                card.appendChild(optWrap);
                quizCards.appendChild(card);
            });
        }

        // === Demo 5: Fibonacci Call Tree (Overlapping Subproblems) ===
        {
            var ctGoBtn = container.querySelector('#dp-demo-calltree-go');
            var ctResetBtn = container.querySelector('#dp-demo-calltree-reset');
            var ctInput = container.querySelector('#dp-demo-calltree-input');
            var ctViz = container.querySelector('#dp-demo-calltree-viz');
            var ctStats = container.querySelector('#dp-demo-calltree-stats');
            var ctMsg = container.querySelector('#dp-demo-calltree-msg');

            function buildTree(n) {
                if (n <= 1) return { val: n, left: null, right: null };
                return { val: n, left: buildTree(n - 1), right: buildTree(n - 2) };
            }

            function countCalls(node, counts) {
                if (!node) return;
                counts[node.val] = (counts[node.val] || 0) + 1;
                countCalls(node.left, counts);
                countCalls(node.right, counts);
            }

            function totalNodes(node) {
                if (!node) return 0;
                return 1 + totalNodes(node.left) + totalNodes(node.right);
            }

            function renderTree(node, counts, depth) {
                if (!node) return '';
                var isDup = counts[node.val] > 1;
                var bg = isDup ? 'var(--red)' : 'var(--green)';
                var glow = isDup ? 'box-shadow:0 0 8px var(--red);' : '';
                var label = isDup ? ' title="Duplicate! Called ' + counts[node.val] + ' times"' : '';
                var html = '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
                html += '<div' + label + ' style="display:inline-flex;align-items:center;justify-content:center;width:' + (depth > 4 ? 32 : 38) + 'px;height:' + (depth > 4 ? 32 : 38) + 'px;border-radius:50%;background:' + bg + ';color:white;font-weight:700;font-size:' + (depth > 4 ? '0.7' : '0.8') + 'rem;' + glow + 'cursor:default;">f(' + node.val + ')</div>';
                if (node.left || node.right) {
                    html += '<div style="width:1px;height:8px;background:var(--border);"></div>';
                    html += '<div style="display:flex;gap:' + Math.max(2, 12 - depth * 2) + 'px;">';
                    if (node.left) html += renderTree(node.left, counts, depth + 1);
                    if (node.right) html += renderTree(node.right, counts, depth + 1);
                    html += '</div>';
                }
                html += '</div>';
                return html;
            }

            if (ctGoBtn) ctGoBtn.addEventListener('click', function() {
                ctGoBtn.style.display = 'none';
                ctResetBtn.style.display = '';
                var n = Math.max(3, Math.min(7, parseInt(ctInput.value) || 5));
                var tree = buildTree(n);
                var counts = {};
                countCalls(tree, counts);
                var total = totalNodes(tree);
                var dupCount = 0;
                for (var k in counts) if (counts[k] > 1) dupCount += (counts[k] - 1);
                ctViz.innerHTML = renderTree(tree, counts, 0);
                ctStats.innerHTML = 'Total <strong>' + total + '</strong> calls, <strong style="color:var(--red);">' + dupCount + '</strong> are duplicates! With DP, only <strong style="color:var(--green);">' + (n + 1) + '</strong> calls needed.';
                ctMsg.textContent = 'Red nodes are duplicate calls. As N grows, redundancy explodes!';
            });

            if (ctResetBtn) ctResetBtn.addEventListener('click', function() {
                ctGoBtn.style.display = '';
                ctResetBtn.style.display = 'none';
                ctViz.innerHTML = '';
                ctStats.innerHTML = '';
                ctMsg.textContent = 'Overlapping subproblems: the same fib(k) is called multiple times. DP eliminates this redundancy!';
            });
        }

        // === Demo 6: Recursion vs DP duplicate elimination ===
        {
            var rvdRecBtn = container.querySelector('#dp-demo-recvsdp-rec');
            var rvdDpBtn = container.querySelector('#dp-demo-recvsdp-dp');
            var rvdResetBtn = container.querySelector('#dp-demo-recvsdp-reset');
            var rvdInput = container.querySelector('#dp-demo-recvsdp-input');
            var rvdLog = container.querySelector('#dp-demo-recvsdp-log');
            var rvdMemo = container.querySelector('#dp-demo-recvsdp-memo');
            var rvdCounter = container.querySelector('#dp-demo-recvsdp-counter');
            var rvdMsg = container.querySelector('#dp-demo-recvsdp-msg');
            var rvdTimer = null;

            function rvdMemoCell(i, val, state) {
                var bg = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : 'var(--bg2)');
                var border = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : 'var(--border)');
                var color = (state === 'active' || state === 'done') ? 'white' : 'var(--text3)';
                var shadow = state === 'active' ? 'box-shadow:0 0 8px var(--yellow)50;transform:scale(1.08);' : '';
                return '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:44px;height:44px;border-radius:8px;border:2px solid ' + border + ';background:' + bg + ';color:' + color + ';font-weight:700;font-size:0.8rem;transition:all 0.3s;' + shadow + '"><div style="font-size:0.6rem;opacity:0.7;">[' + i + ']</div>' + (val !== undefined ? val : '?') + '</div>';
            }

            function rvdRenderMemo(n, memo, activeIdx) {
                var html = '';
                for (var i = 0; i <= n; i++) {
                    var state = (i === activeIdx) ? 'active' : (memo[i] !== undefined ? 'done' : 'empty');
                    html += rvdMemoCell(i, memo[i], state);
                }
                rvdMemo.innerHTML = html;
            }

            function rvdReset() {
                if (rvdTimer) clearTimeout(rvdTimer);
                rvdTimer = null;
                rvdRecBtn.style.display = '';
                rvdDpBtn.style.display = '';
                rvdResetBtn.style.display = 'none';
                rvdLog.innerHTML = '';
                rvdMemo.innerHTML = '';
                rvdCounter.innerHTML = '';
                rvdMsg.textContent = 'Recursion: repeats the same computation. DP: compute once, store, and reuse — drastically fewer calls!';
            }

            function rvdTraceRecursive(n) {
                var calls = [];
                function fib(x, depth) {
                    var indent = '';
                    for (var d = 0; d < depth; d++) indent += '&nbsp;&nbsp;';
                    if (x <= 1) {
                        calls.push({ text: indent + 'fib(' + x + ') = ' + x + ' <span style="color:var(--green);">(base)</span>', val: x, idx: x, isDup: false });
                        return x;
                    }
                    calls.push({ text: indent + 'fib(' + x + ') called...', val: undefined, idx: x, isDup: false, isCall: true });
                    var a = fib(x - 1, depth + 1);
                    var b = fib(x - 2, depth + 1);
                    calls.push({ text: indent + 'fib(' + x + ') = ' + a + ' + ' + b + ' = <strong>' + (a + b) + '</strong>', val: a + b, idx: x, isDup: false });
                    return a + b;
                }
                fib(n, 0);
                var seen = {};
                for (var i = 0; i < calls.length; i++) {
                    if (calls[i].isCall) {
                        if (seen[calls[i].idx]) calls[i].isDup = true;
                        seen[calls[i].idx] = true;
                    }
                }
                return calls;
            }

            function rvdTraceDP(n) {
                var calls = [];
                var memo = {};
                function fib(x, depth) {
                    var indent = '';
                    for (var d = 0; d < depth; d++) indent += '&nbsp;&nbsp;';
                    if (memo[x] !== undefined) {
                        calls.push({ text: indent + 'fib(' + x + ') → memo[' + x + '] = ' + memo[x] + ' <span style="color:var(--accent);font-weight:600;">cached!</span>', val: memo[x], idx: x, isMemo: true });
                        return memo[x];
                    }
                    if (x <= 1) {
                        memo[x] = x;
                        calls.push({ text: indent + 'fib(' + x + ') = ' + x + ' <span style="color:var(--green);">(base) → stored</span>', val: x, idx: x, save: true });
                        return x;
                    }
                    calls.push({ text: indent + 'fib(' + x + ') called...', val: undefined, idx: x, isCall: true });
                    var a = fib(x - 1, depth + 1);
                    var b = fib(x - 2, depth + 1);
                    memo[x] = a + b;
                    calls.push({ text: indent + 'fib(' + x + ') = ' + a + ' + ' + b + ' = <strong>' + (a + b) + '</strong> → <span style="color:var(--green);">stored!</span>', val: a + b, idx: x, save: true });
                    return a + b;
                }
                fib(n, 0);
                return { calls: calls, memo: memo };
            }

            function rvdAnimate(steps, isDP) {
                rvdRecBtn.style.display = 'none';
                rvdDpBtn.style.display = 'none';
                rvdResetBtn.style.display = '';
                rvdLog.innerHTML = '';
                rvdMemo.innerHTML = '';
                var n = Math.max(3, Math.min(7, parseInt(rvdInput.value) || 5));
                var memoState = {};
                if (isDP) rvdRenderMemo(n, memoState);
                var callCount = 0;
                var idx = 0;

                var traceData = isDP ? rvdTraceDP(n) : { calls: rvdTraceRecursive(n) };
                var allCalls = traceData.calls || traceData;

                function tick() {
                    if (idx >= allCalls.length) {
                        var label = isDP ? 'DP (Memoization)' : 'Plain Recursion';
                        rvdCounter.innerHTML = label + ': <strong>' + callCount + '</strong> total calls';
                        if (isDP) {
                            rvdMsg.innerHTML = 'DP retrieves stored values instantly, so <strong style="color:var(--green);">the number of calls is drastically reduced</strong>!';
                        } else {
                            rvdMsg.innerHTML = 'The same values are computed multiple times. Now click <strong>"Solve with DP"</strong> to compare!';
                            rvdRecBtn.style.display = 'none';
                            rvdDpBtn.style.display = '';
                        }
                        return;
                    }
                    var step = allCalls[idx];
                    callCount++;
                    var color = step.isDup ? 'color:var(--red);' : (step.isMemo ? 'color:var(--accent);' : '');
                    var dupTag = step.isDup ? ' <span style="color:var(--red);font-weight:600;">← duplicate!</span>' : '';
                    rvdLog.innerHTML += '<div style="' + color + '">' + step.text + dupTag + '</div>';
                    rvdLog.scrollTop = rvdLog.scrollHeight;

                    if (isDP && (step.save || step.isMemo) && step.val !== undefined) {
                        memoState[step.idx] = step.val;
                        rvdRenderMemo(n, memoState, step.isMemo ? undefined : step.idx);
                    }

                    rvdCounter.innerHTML = (isDP ? 'DP' : 'Recursion') + ': call <strong>#' + callCount + '</strong>';
                    idx++;
                    rvdTimer = setTimeout(tick, 350);
                }
                tick();
            }

            if (rvdRecBtn) rvdRecBtn.addEventListener('click', function() {
                rvdAnimate(null, false);
            });
            if (rvdDpBtn) rvdDpBtn.addEventListener('click', function() {
                rvdAnimate(null, true);
            });
            if (rvdResetBtn) rvdResetBtn.addEventListener('click', rvdReset);
        }
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var box = btn.closest('.think-box');
                if (!box.classList.contains('revealed')) {
                    box.classList.add('revealed');
                    btn.textContent = 'Answer revealed';
                }
            });
        });
        container.querySelectorAll('.quiz-card').forEach(function(card) {
            card.addEventListener('click', function() {
                if (card.classList.contains('answered')) return;
                card.classList.add('answered');
                card.classList.add(card.dataset.isdp === 'true' ? 'correct' : 'wrong');
            });
        });
    },

    // ===== Empty Stub =====
    renderVisualize(container) {},
    renderProblem(container) {},

    // ===== Visualization State =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepDesc(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25b6 Click Next to start</div>';
    },

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; Prev</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">Before start</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">Next &rarr;</button>' +
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
            if (idx < 0) { counter.textContent = 'Before start'; desc.textContent = '\u25b6 Click Next to start'; }
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
    // Simulation 1: Fibonacci Number 1 (boj-24416)
    // ====================================================================
    _renderVizFib1(container) {
        var self = this, suffix = '-fib1';
        var DEFAULT_N = 5;

        function fibVal(n) { if (n <= 2) return 1; var a=1,b=1; for(var i=3;i<=n;i++){var t=a+b;a=b;b=t;} return b; }

        function buildCallTree(n) {
            var nodes = [], edges = [], nodeId = 0;
            function layout(val, depth, xCenter, xSpan) {
                var id = nodeId++;
                nodes.push({ id: id, val: val, x: xCenter, y: depth * 50 + 24, depth: depth });
                if (val <= 1) return id;
                var leftId = layout(val - 1, depth + 1, xCenter - xSpan / 2, xSpan / 2);
                edges.push({ from: id, to: leftId });
                var rightId = layout(val - 2, depth + 1, xCenter + xSpan / 2, xSpan / 2);
                edges.push({ from: id, to: rightId });
                return id;
            }
            var totalWidth = Math.max(300, Math.pow(2, Math.min(n, 7)) * 32);
            var totalHeight = (Math.min(n, 7) + 1) * 50 + 16;
            layout(n, 0, totalWidth / 2, totalWidth / 3);
            return { nodes: nodes, edges: edges, width: totalWidth, height: totalHeight };
        }

        function renderCallTreeSVG(tree) {
            var svgNS = 'http://www.w3.org/2000/svg';
            var svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('width', tree.width);
            svg.setAttribute('height', tree.height);
            svg.style.cssText = 'display:block;margin:0 auto;';
            for (var e = 0; e < tree.edges.length; e++) {
                var fromN = tree.nodes[tree.edges[e].from];
                var toN = tree.nodes[tree.edges[e].to];
                var line = document.createElementNS(svgNS, 'line');
                line.setAttribute('x1', fromN.x); line.setAttribute('y1', fromN.y + 12);
                line.setAttribute('x2', toN.x); line.setAttribute('y2', toN.y - 12);
                line.setAttribute('stroke', 'var(--border)'); line.setAttribute('stroke-width', '1.5');
                svg.appendChild(line);
            }
            var seen = {};
            for (var i = 0; i < tree.nodes.length; i++) {
                var nd = tree.nodes[i];
                var isDup = seen[nd.val] === true;
                seen[nd.val] = true;
                var g = document.createElementNS(svgNS, 'g');
                var circle = document.createElementNS(svgNS, 'circle');
                circle.setAttribute('cx', nd.x); circle.setAttribute('cy', nd.y);
                circle.setAttribute('r', 13);
                circle.setAttribute('fill', isDup ? 'rgba(214,48,49,0.15)' : 'var(--bg2)');
                circle.setAttribute('stroke', isDup ? 'var(--red)' : 'var(--border)');
                circle.setAttribute('stroke-width', isDup ? '2' : '1.5');
                g.appendChild(circle);
                var text = document.createElementNS(svgNS, 'text');
                text.setAttribute('x', nd.x); text.setAttribute('y', nd.y + 4);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '10'); text.setAttribute('font-family', 'monospace');
                text.setAttribute('fill', isDup ? 'var(--red)' : 'var(--text)');
                text.textContent = 'f(' + nd.val + ')';
                g.appendChild(text);
                svg.appendChild(g);
            }
            return svg;
        }

        function renderDpTable(n) {
            var dp = [0, 1, 1];
            for (var i = 3; i <= n; i++) dp.push(dp[i-1] + dp[i-2]);
            var html = '<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;">';
            for (var i = 1; i <= n; i++) {
                html += '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div style="font-size:0.65rem;color:var(--text3);">dp[' + i + ']</div>';
                html += '<div style="min-width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:2px solid var(--green);border-radius:8px;font-weight:700;font-size:0.85rem;background:rgba(0,184,148,0.1);color:var(--green);">' + dp[i] + '</div>';
                if (i >= 3) {
                    html += '<div style="font-size:0.6rem;color:var(--text3);">' + dp[i-1] + '+' + dp[i-2] + '</div>';
                }
                html += '</div>';
            }
            html += '</div>';
            return html;
        }

        function buildSteps(n, vizAreaEl, recValEl, dpValEl, infoEl) {
            var recCount = fibVal(n);
            var dpCount = Math.max(n - 2, 0);
            var bigN = Math.min(n + 20, 40);
            var bigRec = fibVal(bigN);
            var bigDp = Math.max(bigN - 2, 0);
            var ratio = bigDp > 0 ? Math.round(bigRec / bigDp) : 0;
            var showTree = (n <= 8);
            return [
                { description: 'When computing fib(' + n + ') recursively, <strong>the same subproblems are recomputed</strong>, causing the call count to grow exponentially.',
                  action: function() {
                      infoEl.innerHTML = 'Recursion: fib(' + n + ')=fib(' + (n-1) + ')+fib(' + (n-2) + '), ... duplicates occur.';
                      vizAreaEl.innerHTML = '<div style="text-align:center;color:var(--text2);padding:20px;font-size:0.9rem;">The recursive call tree will appear in the next step.</div>';
                  },
                  undo: function() { infoEl.innerHTML = ''; vizAreaEl.innerHTML = ''; } },
                { description: 'Recursion <strong>independently recomputes</strong> fib(' + (n-1) + ') and fib(' + (n-2) + ') each time, so the total call count reaches ' + recCount.toLocaleString() + '. <span style="color:var(--red);">Red nodes = duplicate calls</span>',
                  action: function() {
                      recValEl.textContent = recCount.toLocaleString();
                      infoEl.innerHTML = 'Leaf count (return 1) of recursive call tree = <strong>' + recCount.toLocaleString() + '</strong>';
                      if (showTree) {
                          var tree = buildCallTree(n);
                          vizAreaEl.innerHTML = '<div style="font-weight:600;font-size:0.85rem;color:var(--red);margin-bottom:6px;text-align:center;">Recursive Call Tree — red nodes are duplicates</div>';
                          vizAreaEl.querySelector('div').style.overflow = 'auto';
                          vizAreaEl.appendChild(renderCallTreeSVG(tree));
                      } else {
                          vizAreaEl.innerHTML = '<div style="text-align:center;color:var(--red);padding:16px;font-size:0.9rem;">n=' + n + ' makes the tree too large to display.<br>Call count: <strong>' + recCount.toLocaleString() + '</strong>!</div>';
                      }
                  },
                  undo: function() { recValEl.textContent = '?'; infoEl.innerHTML = ''; vizAreaEl.innerHTML = ''; } },
                { description: 'DP <strong>stores previously computed values and reuses them</strong>, so from 3 to ' + n + ' only ' + dpCount + ' additions are needed.',
                  action: function() {
                      dpValEl.textContent = dpCount;
                      infoEl.innerHTML = 'DP: dp[3]=dp[2]+dp[1], ..., dp[' + n + '] \u2192 <strong>' + dpCount + ' times</strong>';
                      vizAreaEl.innerHTML = '<div style="font-weight:600;font-size:0.85rem;color:var(--green);margin-bottom:6px;text-align:center;">DP Table — each value computed once</div>' + renderDpTable(n);
                  },
                  undo: function() { dpValEl.textContent = '?'; } },
                { description: 'Scale up to n=' + bigN + '? Recursion <strong>explodes exponentially</strong> to ' + bigRec.toLocaleString() + ' calls, but DP still finishes in just ' + bigDp + '.',
                  action: function() {
                      infoEl.innerHTML = '<strong style="color:var(--green);">n=' + bigN + ': Recursion ' + bigRec.toLocaleString() + ' times vs DP ' + bigDp + ' times. DP is ' + ratio.toLocaleString() + 'x faster!</strong>';
                      vizAreaEl.innerHTML = '<div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;align-items:center;">' +
                          '<div style="text-align:center;padding:12px 20px;border:2px solid var(--red);border-radius:12px;background:rgba(214,48,49,0.05);"><div style="font-size:0.8rem;color:var(--red);font-weight:600;">Recursion (n=' + bigN + ')</div><div style="font-size:1.3rem;font-weight:700;color:var(--red);">' + bigRec.toLocaleString() + ' calls</div></div>' +
                          '<div style="font-size:1.5rem;color:var(--text3);">vs</div>' +
                          '<div style="text-align:center;padding:12px 20px;border:2px solid var(--green);border-radius:12px;background:rgba(0,184,148,0.05);"><div style="font-size:0.8rem;color:var(--green);font-weight:600;">DP (n=' + bigN + ')</div><div style="font-size:1.3rem;font-weight:700;color:var(--green);">' + bigDp + ' ops</div></div>' +
                          '</div>';
                  },
                  undo: function() { infoEl.innerHTML = 'DP: dp[3]=dp[2]+dp[1], ..., dp[' + n + '] \u2192 <strong>' + dpCount + ' times</strong>'; } }
            ];
        }

        function init(n) {
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N: <input type="number" id="dp-fib-n" value="' + n + '" min="3" max="40" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="dp-fib-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">fib(' + n + ') call count: Recursion vs DP</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">Recursion has explosive duplicate calls, but DP needs only n-2 operations.</p>' +
                '<div id="fib1-area' + suffix + '" style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">' +
                '<div id="fib1-rec' + suffix + '" style="text-align:center;"><div style="font-weight:600;margin-bottom:6px;">Recursive calls</div><div id="fib1-rec-val' + suffix + '" style="font-size:2rem;color:var(--red);font-weight:700;">?</div></div>' +
                '<div id="fib1-dp' + suffix + '" style="text-align:center;"><div style="font-weight:600;margin-bottom:6px;">DP operations</div><div id="fib1-dp-val' + suffix + '" style="font-size:2rem;color:var(--green);font-weight:700;">?</div></div>' +
                '</div>' +
                '<div id="fib1-viz' + suffix + '" style="overflow-x:auto;margin-bottom:12px;min-height:60px;"></div>' +
                '<div id="fib1-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var recValEl = container.querySelector('#fib1-rec-val' + suffix);
            var dpValEl = container.querySelector('#fib1-dp-val' + suffix);
            var vizAreaEl = container.querySelector('#fib1-viz' + suffix);
            var infoEl = container.querySelector('#fib1-info' + suffix);
            var steps = buildSteps(n, vizAreaEl, recValEl, dpValEl, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-fib-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#dp-fib-n').value) || DEFAULT_N;
                if (val < 3) val = 3; if (val > 40) val = 40;
                self._clearVizState(); init(val);
            });
        }
        init(DEFAULT_N);
    },

    // ====================================================================
    // Simulation 2: Exciting Function Execution (boj-9184)
    // ====================================================================
    _renderVizFun(container) {
        var self = this, suffix = '-fun';
        var DEFAULT_A = 2, DEFAULT_B = 2, DEFAULT_C = 2;

        function wFunc(a, b, c, memo) {
            if (a <= 0 || b <= 0 || c <= 0) return 1;
            if (a > 20 || b > 20 || c > 20) return wFunc(20, 20, 20, memo);
            var key = a + ',' + b + ',' + c;
            if (memo[key] !== undefined) return memo[key];
            var res;
            if (a < b && b < c) res = wFunc(a, b, c-1, memo) + wFunc(a, b-1, c-1, memo) - wFunc(a, b-1, c, memo);
            else res = wFunc(a-1, b, c, memo) + wFunc(a-1, b-1, c, memo) + wFunc(a-1, b, c-1, memo) - wFunc(a-1, b-1, c-1, memo);
            memo[key] = res;
            return res;
        }

        function buildSteps(a, b, c, logEl) {
            var memo = {};
            var result = wFunc(a, b, c, memo);
            var lines = [];
            var isAsc = (a < b && b < c);
            var subCalls, subDesc;
            if (isAsc) {
                subCalls = 'w(' + a + ',' + b + ',' + (c-1) + '), w(' + a + ',' + (b-1) + ',' + (c-1) + '), w(' + a + ',' + (b-1) + ',' + c + ')';
                subDesc = 'Since a&lt;b&lt;c, need w(a,b,c-1)+w(a,b-1,c-1)-w(a,b-1,c)';
            } else {
                subCalls = 'w(' + (a-1) + ',' + b + ',' + c + '), w(' + (a-1) + ',' + (b-1) + ',' + c + '), w(' + (a-1) + ',' + b + ',' + (c-1) + '), w(' + (a-1) + ',' + (b-1) + ',' + (c-1) + ')';
                subDesc = 'Since a&lt;b&lt;c is false, need w(a-1,b,c)+w(a-1,b-1,c)+w(a-1,b,c-1)-w(a-1,b-1,c-1)';
            }
            var memoEntries = Object.keys(memo).slice(0, 4).map(function(k) { return 'w(' + k + ')=' + memo[k]; }).join(', ');
            return [
                { description: 'Call w(' + a + ',' + b + ',' + c + ') — not found in memo, so we must <strong>decompose it into subproblems</strong> to compute.',
                  action: function() { lines.push('-> Call w(' + a + ',' + b + ',' + c + ')'); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
                { description: subDesc,
                  action: function() { lines.push('  Need: ' + subCalls); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
                { description: 'Sub-call results are <strong>stored in the memo table</strong>, so future calls with the same arguments skip recomputation entirely.',
                  action: function() { lines.push('  ' + memoEntries + ' stored!'); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
                { description: 'Combining all sub-results gives w(' + a + ',' + b + ',' + c + ') = ' + result + '. Storing this in memo <strong>prevents any future duplicate calls</strong>.',
                  action: function() { lines.push('<- w(' + a + ',' + b + ',' + c + ') = ' + result + ' Stored!'); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } }
            ];
        }

        function init(a, b, c) {
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">a: <input type="number" id="dp-fun-a" value="' + a + '" min="-1" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
                '<label style="font-weight:600;">b: <input type="number" id="dp-fun-b" value="' + b + '" min="-1" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
                '<label style="font-weight:600;">c: <input type="number" id="dp-fun-c" value="' + c + '" min="-1" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
                '<button class="btn btn-primary" id="dp-fun-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">w(' + a + ',' + b + ',' + c + ') Memoization</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">Storing in the memo table skips duplicate calls.</p>' +
                '<div id="fun-log' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;font-size:0.85rem;min-height:60px;margin-bottom:12px;white-space:pre-line;"></div>' +
                self._createStepControls(suffix);
            var logEl = container.querySelector('#fun-log' + suffix);
            var steps = buildSteps(a, b, c, logEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-fun-reset').addEventListener('click', function() {
                var va = parseInt(container.querySelector('#dp-fun-a').value);
                var vb = parseInt(container.querySelector('#dp-fun-b').value);
                var vc = parseInt(container.querySelector('#dp-fun-c').value);
                if (isNaN(va)) va = DEFAULT_A; if (isNaN(vb)) vb = DEFAULT_B; if (isNaN(vc)) vc = DEFAULT_C;
                self._clearVizState(); init(va, vb, vc);
            });
        }
        init(DEFAULT_A, DEFAULT_B, DEFAULT_C);
    },

    // ====================================================================
    // Simulation 3: Make It 1 (boj-1463)
    // ====================================================================
    _renderViz1to(container) {
        var self = this, suffix = '-1to';
        var DEFAULT_N = 10;

        function computeDP(n) {
            var dp = new Array(n + 1).fill(0);
            for (var i = 2; i <= n; i++) {
                dp[i] = dp[i - 1] + 1;
                if (i % 2 === 0) dp[i] = Math.min(dp[i], dp[i / 2] + 1);
                if (i % 3 === 0) dp[i] = Math.min(dp[i], dp[i / 3] + 1);
            }
            return dp;
        }

        function tracePath(dp, n) {
            var path = [n];
            var cur = n;
            while (cur > 1) {
                if (cur % 3 === 0 && dp[cur / 3] === dp[cur] - 1) { cur = cur / 3; }
                else if (cur % 2 === 0 && dp[cur / 2] === dp[cur] - 1) { cur = cur / 2; }
                else { cur = cur - 1; }
                path.push(cur);
            }
            return path;
        }

        function buildSteps(n, dp, cellsEl, infoEl) {
            var path = tracePath(dp, n);
            var pathSet = {}; path.forEach(function(v) { pathSet[v] = true; });
            function setCell(num, val, bg) { var c = container.querySelector('#to1-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = val; if(bg) c.style.background = bg;} }
            function resetCell(num) { var c = container.querySelector('#to1-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = '?'; c.style.background = 'var(--bg2)';} }
            var steps = [];
            // Step 1: dp[1]=0
            steps.push({ description: 'dp[1]=0: We have <strong>already reached the target</strong> (1), so no operations are needed.',
              action: function() { setCell(1, '0', 'var(--accent)15'); infoEl.innerHTML = 'dp[1] = 0'; },
              undo: function() { resetCell(1); infoEl.innerHTML = ''; } });
            // Individual steps: fill each dp[k] separately
            for (var k = 2; k <= n - 1; k++) {
                (function(idx) {
                    var ops = [];
                    if (idx % 3 === 0) ops.push('÷3→dp[' + (idx/3) + ']=' + dp[idx/3]);
                    if (idx % 2 === 0) ops.push('÷2→dp[' + (idx/2) + ']=' + dp[idx/2]);
                    ops.push('-1→dp[' + (idx-1) + ']=' + dp[idx-1]);
                    var desc = 'To make ' + idx + ' into 1, we try all <strong>three reverse operations</strong> (÷3, ÷2, -1) and pick the path with the fewest prior steps. dp[' + idx + '] = min(' + ops.join(', ') + ')+1 = ' + dp[idx];
                    steps.push({
                        description: desc,
                        action: function() { setCell(idx, dp[idx], 'var(--accent)15'); infoEl.innerHTML = desc; },
                        undo: function() { resetCell(idx); }
                    });
                })(k);
            }
            // Final step: show answer and path
            var pathStr = path.join('→');
            steps.push({ description: '<strong>Final answer</strong>: ' + n + ' to 1 takes at minimum ' + dp[n] + ' operations. The optimal path picks the fewest-step option at each number: ' + pathStr,
              action: function() { setCell(n, dp[n], 'var(--green)'); for(var k=0;k<path.length;k++) setCell(path[k], dp[path[k]], 'var(--green)'); infoEl.innerHTML = '<strong style="color:var(--green);">dp[' + n + ']=' + dp[n] + ', Path: ' + pathStr + '</strong>'; },
              undo: function() { setCell(n, dp[n], 'var(--accent)15'); for(var k=0;k<path.length;k++) if(path[k] !== n) setCell(path[k], dp[path[k]], 'var(--accent)15'); } });
            return steps;
        }

        function init(n) {
            if (n < 2) n = 2; if (n > 20) n = 20;
            var dp = computeDP(n);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N: <input type="number" id="dp-1to-n" value="' + n + '" min="2" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="dp-1to-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">' + n + ' to 1: Minimum Operations</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[i] = minimum number of operations to make i into 1</p>' +
                '<div id="to1-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="to1-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#to1-cells' + suffix);
            var infoEl = container.querySelector('#to1-info' + suffix);
            for (var i = 1; i <= n; i++) {
                cellsEl.innerHTML += '<div id="to1-c' + i + suffix + '" style="width:48px;text-align:center;padding:8px 4px;border-radius:8px;background:var(--bg2);font-weight:600;"><div style="font-size:0.7rem;color:var(--text3);">' + i + '</div><div>?</div></div>';
            }
            var steps = buildSteps(n, dp, cellsEl, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-1to-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#dp-1to-n').value) || DEFAULT_N;
                if (val < 2) val = 2; if (val > 20) val = 20;
                self._clearVizState(); init(val);
            });
        }
        init(DEFAULT_N);
    },

    // ====================================================================
    // Simulation 4: 01 Tile (boj-1904)
    // ====================================================================
    _renderVizTile(container) {
        var self = this, suffix = '-tile';
        var DEFAULT_N = 4;

        function computeTile(n) {
            var dp = [0, 1, 2];
            for (var i = 3; i <= n; i++) dp[i] = (dp[i-1] + dp[i-2]) % 15746;
            return dp;
        }

        function buildSteps(n, dp, infoEl) {
            function setTile(num, v, bg) { var c = container.querySelector('#tile-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = v; if(bg)c.style.background=bg;} }
            function resetTile(num) { var c = container.querySelector('#tile-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = '?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'dp[1]=1: A length-1 sequence can only be <strong>"1"</strong>. A standalone "0" is impossible because "00" is a single tile.', action: function() { setTile(1,'1','#6c5ce715'); infoEl.innerHTML = 'dp[1]=1 (sequence: 1)'; }, undo: function() { resetTile(1); infoEl.innerHTML=''; } });
            steps.push({ description: 'dp[2]=2: A length-2 sequence can be <strong>"1"+"1" or "00" tile</strong> — two ways. These are the base cases.', action: function() { setTile(2,'2','#6c5ce715'); infoEl.innerHTML = 'dp[2]=2 (sequences: 11, 00)'; }, undo: function() { resetTile(2); } });
            for (var i = 3; i < n; i++) {
                (function(idx) {
                    steps.push({ description: 'dp[' + idx + ']: <strong>Append "1"</strong> to sequences of length ' + (idx-1) + ' (dp[' + (idx-1) + '] ways) + <strong>append "00"</strong> to sequences of length ' + (idx-2) + ' (dp[' + (idx-2) + '] ways) = ' + dp[idx],
                      action: function() { setTile(idx, dp[idx], '#6c5ce715'); infoEl.innerHTML = 'dp[' + idx + ']=' + dp[idx-1] + '+' + dp[idx-2] + '=' + dp[idx]; },
                      undo: function() { resetTile(idx); } });
                })(i);
            }
            steps.push({ description: '<strong>Final answer</strong> dp[' + n + ']: append "1" (' + dp[n-1] + ' ways) + append "00" (' + dp[n-2] + ' ways) = ' + dp[n],
              action: function() { setTile(n, dp[n], 'var(--green)'); infoEl.innerHTML = '<strong style="color:var(--green);">✅ dp[' + n + ']=' + dp[n-1] + '+' + dp[n-2] + '=' + dp[n] + '</strong>'; },
              undo: function() { resetTile(n); } });
            return steps;
        }

        function init(n) {
            if (n < 3) n = 3; if (n > 15) n = 15;
            var dp = computeTile(n);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N: <input type="number" id="dp-tile-n" value="' + n + '" min="3" max="15" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="dp-tile-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">01 Tile: Sequences of length N=' + n + '</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[i] = dp[i-1] + dp[i-2] (same as Fibonacci!)</p>' +
                '<div id="tile-cells' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="tile-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#tile-cells' + suffix);
            var infoEl = container.querySelector('#tile-info' + suffix);
            for (var i = 1; i <= n; i++) cellsEl.innerHTML += '<div id="tile-c' + i + suffix + '" style="width:56px;text-align:center;padding:8px;border-radius:8px;background:var(--bg2);font-weight:600;"><div style="font-size:0.7rem;color:var(--text3);">dp[' + i + ']</div><div>?</div></div>';
            var steps = buildSteps(n, dp, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-tile-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#dp-tile-n').value) || DEFAULT_N;
                if (val < 3) val = 3; if (val > 15) val = 15;
                self._clearVizState(); init(val);
            });
        }
        init(DEFAULT_N);
    },

    // ====================================================================
    // Simulation 5: Climbing Stairs (boj-2579)
    // ====================================================================
    _renderVizStair(container) {
        var self = this, suffix = '-stair';
        var DEFAULT_SC = [10,20,15,25,10,20];

        function computeStair(sc) {
            var n = sc.length;
            var dp = new Array(n + 1).fill(0);
            dp[1] = sc[0];
            if (n >= 2) dp[2] = sc[0] + sc[1];
            if (n >= 3) dp[3] = Math.max(sc[0], sc[1]) + sc[2];
            for (var i = 4; i <= n; i++) dp[i] = Math.max(dp[i-2] + sc[i-1], dp[i-3] + sc[i-2] + sc[i-1]);
            return dp;
        }

        function buildSteps(sc, dp, infoEl) {
            var n = sc.length;
            function setSt(num, v, bg) { var c = container.querySelector('#st-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = 'dp:'+v; if(bg)c.style.background=bg;} }
            function resetSt(num) { var c = container.querySelector('#st-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = 'dp:?'; c.style.background='var(--bg2)';} }
            var steps = [];
            // Initial values
            steps.push({ description: 'Base cases: dp[1]=' + dp[1] + ' (only step 1 is taken)' + (n>=2 ? ', dp[2]=' + dp[2] + ' (2 consecutive is allowed, so take both)' : ''),
              action: function() { setSt(1, dp[1], '#fdcb6e15'); if(n>=2) setSt(2, dp[2], '#fdcb6e15'); infoEl.innerHTML='dp[1]=' + sc[0] + (n>=2 ? ', dp[2]=' + sc[0] + '+' + sc[1] + '=' + dp[2] : ''); },
              undo: function() { resetSt(1); if(n>=2) resetSt(2); infoEl.innerHTML=''; } });
            if (n >= 3) {
                steps.push({ description: 'dp[3]: The <strong>no-3-consecutive rule</strong> means we can only take one of step 1 or step 2 before step 3 → max(' + sc[0] + ',' + sc[1] + ')+' + sc[2] + '=' + dp[3],
                  action: function() { setSt(3, dp[3], '#fdcb6e15'); infoEl.innerHTML='dp[3]=max(' + sc[0] + ',' + sc[1] + ')+' + sc[2] + '=' + dp[3]; },
                  undo: function() { resetSt(3); } });
            }
            for (var i = 4; i < n; i++) {
                (function(idx) {
                    var opt1 = dp[idx-2] + sc[idx-1];
                    var opt2 = dp[idx-3] + sc[idx-2] + sc[idx-1];
                    steps.push({ description: 'dp[' + idx + ']: <strong>Jump from 2 back</strong> (dp[' + (idx-2) + ']+' + sc[idx-1] + '=' + opt1 + ') vs <strong>continue from 1 back</strong> (dp[' + (idx-3) + ']+' + sc[idx-2] + '+' + sc[idx-1] + '=' + opt2 + ') → pick the larger = ' + dp[idx],
                      action: function() { setSt(idx, dp[idx], '#fdcb6e15'); infoEl.innerHTML='dp[' + idx + ']=max(' + opt1 + ',' + opt2 + ')=' + dp[idx]; },
                      undo: function() { resetSt(idx); } });
                })(i);
            }
            // Final step
            if (n >= 4) {
                var fopt1 = dp[n-2] + sc[n-1];
                var fopt2 = dp[n-3] + sc[n-2] + sc[n-1];
                steps.push({ description: '<strong>Final answer</strong> dp[' + n + ']: jump from 2 back (' + (dp[n-2]+sc[n-1]) + ') vs continue from 1 back (' + (dp[n-3]+sc[n-2]+sc[n-1]) + ') → maximum score = ' + dp[n],
                  action: function() { setSt(n, dp[n], 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ dp[' + n + ']=' + dp[n] + '</strong>'; },
                  undo: function() { resetSt(n); } });
            } else if (n >= 1) {
                steps.push({ description: '<strong>Final answer</strong>: dp[' + n + ']=' + dp[n],
                  action: function() { setSt(n, dp[n], 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ dp[' + n + ']=' + dp[n] + '</strong>'; },
                  undo: function() { resetSt(n); } });
            }
            return steps;
        }

        function init(sc) {
            var n = sc.length;
            var dp = computeStair(sc);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Scores (comma-separated): <input type="text" id="dp-stair-input" value="' + sc.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<button class="btn btn-primary" id="dp-stair-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">Climbing Stairs (no 3 consecutive)</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">Scores: [' + sc.join(',') + ']</p>' +
                '<div id="st-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="st-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#st-cells' + suffix);
            var infoEl = container.querySelector('#st-info' + suffix);
            for (var i = 1; i <= n; i++) cellsEl.innerHTML += '<div id="st-c' + i + suffix + '" style="width:56px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-weight:600;">' + sc[i-1] + '</div><div style="font-size:0.7rem;color:var(--text3);">dp:?</div></div>';
            var steps = buildSteps(sc, dp, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-stair-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-stair-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 1) raw = DEFAULT_SC.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_SC);
    },

    // ====================================================================
    // Simulation 6: Wine Tasting (boj-2156)
    // ====================================================================
    _renderVizWine(container) {
        var self = this, suffix = '-wine';
        var DEFAULT_W = [6,10,13,9,8,1];

        function computeWine(w) {
            var n = w.length;
            var dp = new Array(n + 1).fill(0);
            dp[1] = w[0];
            if (n >= 2) dp[2] = w[0] + w[1];
            for (var i = 3; i <= n; i++) dp[i] = Math.max(dp[i-1], dp[i-2] + w[i-1], dp[i-3] + w[i-2] + w[i-1]);
            return dp;
        }

        function buildSteps(w, dp, infoEl) {
            var n = w.length;
            function setWn(num,v,bg) { var c = container.querySelector('#wn-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent='dp:'+v; if(bg)c.style.background=bg;} }
            function resetWn(num) { var c = container.querySelector('#wn-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent='dp:?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'Base cases: dp[1]=' + dp[1] + ' (obviously drink the first glass)' + (n>=2 ? ', dp[2]=' + dp[2] + ' (2 consecutive is allowed, so drink both)' : ''),
              action: function() { setWn(1, dp[1], '#00b89415'); if(n>=2) setWn(2, dp[2], '#00b89415'); infoEl.innerHTML='dp[1]=' + w[0] + (n>=2 ? ', dp[2]=' + w[0] + '+' + w[1] + '=' + dp[2] : ''); },
              undo: function() { resetWn(1); if(n>=2) resetWn(2); infoEl.innerHTML=''; } });
            for (var i = 3; i < n; i++) {
                (function(idx) {
                    var o1 = dp[idx-1], o2 = dp[idx-2] + w[idx-1], o3 = dp[idx-3] + w[idx-2] + w[idx-1];
                    steps.push({ description: 'dp[' + idx + ']: Three choices — (1)<strong>skip this glass</strong> (' + o1 + '), (2)<strong>drink only this one</strong> (skip prev, dp[' + (idx-2) + ']+' + w[idx-1] + '=' + o2 + '), (3)<strong>drink prev+this consecutively</strong> (dp[' + (idx-3) + ']+' + w[idx-2] + '+' + w[idx-1] + '=' + o3 + ') → max=' + dp[idx],
                      action: function() { setWn(idx, dp[idx], '#00b89415'); infoEl.innerHTML='dp[' + idx + ']=max(' + o1 + ', ' + o2 + ', ' + o3 + ')=' + dp[idx]; },
                      undo: function() { resetWn(idx); } });
                })(i);
            }
            // Final
            var fo1 = dp[n-1], fo2 = dp[n-2] + w[n-1], fo3 = (n>=3 ? dp[n-3] + w[n-2] + w[n-1] : 0);
            steps.push({ description: '<strong>Final answer</strong> dp[' + n + ']: skip (' + fo1 + ') / drink only this (' + fo2 + ') / drink consecutive (' + fo3 + ') → maximum = ' + dp[n],
              action: function() { setWn(n, dp[n], 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ dp[' + n + ']=' + dp[n] + '</strong>'; },
              undo: function() { resetWn(n); } });
            return steps;
        }

        function init(w) {
            var n = w.length;
            var dp = computeWine(w);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Wine amounts (comma-separated): <input type="text" id="dp-wine-input" value="' + w.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<button class="btn btn-primary" id="dp-wine-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">Wine Tasting (no 3 consecutive)</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">Glasses: [' + w.join(',') + ']. You can also choose to skip!</p>' +
                '<div id="wn-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="wn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#wn-cells' + suffix);
            var infoEl = container.querySelector('#wn-info' + suffix);
            for (var i = 1; i <= n; i++) cellsEl.innerHTML += '<div id="wn-c' + i + suffix + '" style="width:56px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-weight:600;">' + w[i-1] + '</div><div style="font-size:0.7rem;color:var(--text3);">dp:?</div></div>';
            var steps = buildSteps(w, dp, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-wine-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-wine-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 1) raw = DEFAULT_W.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_W);
    },

    // ====================================================================
    // Simulation 7: Maximum Subarray Sum (boj-1912)
    // ====================================================================
    _renderVizMaxSub(container) {
        var self = this, suffix = '-maxsub';
        var DEFAULT_A = [10,-4,3,1,5,6,-35,12,21,-1];

        function computeKadane(a) {
            var n = a.length;
            var curArr = new Array(n);
            curArr[0] = a[0];
            var ans = a[0], ansEnd = 0;
            for (var i = 1; i < n; i++) {
                curArr[i] = Math.max(curArr[i-1] + a[i], a[i]);
                if (curArr[i] > ans) { ans = curArr[i]; ansEnd = i; }
            }
            // find start
            var sum = 0, ansStart = ansEnd;
            for (var i = ansEnd; i >= 0; i--) {
                sum += a[i];
                if (sum === ans) { ansStart = i; }
            }
            return { curArr: curArr, ans: ans, ansStart: ansStart, ansEnd: ansEnd };
        }

        function buildSteps(a, infoEl) {
            var n = a.length;
            var res = computeKadane(a);
            var curArr = res.curArr;
            function setMs(i,v,bg) { var c = container.querySelector('#ms-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent=v; if(bg)c.style.background=bg;} }
            function resetMs(i) { var c = container.querySelector('#ms-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'dp[0]=' + a[0] + ': At the first element, there is <strong>no previous subarray</strong>, so the element itself is the maximum contiguous sum.',
              action: function() { setMs(0, curArr[0], '#d6303115'); infoEl.innerHTML='cur=' + curArr[0] + ', ans=' + curArr[0]; },
              undo: function() { resetMs(0); infoEl.innerHTML=''; } });
            // Process in steps of ~3
            var step = Math.max(1, Math.floor((n - 1) / 4));
            var start = 1;
            var runAns = curArr[0];
            while (start < n) {
                var end = Math.min(start + step - 1, n - 1);
                var isLast = (end === n - 1);
                (function(s, e, prevAns, lastStep) {
                    var newAns = prevAns;
                    for (var k = s; k <= e; k++) newAns = Math.max(newAns, curArr[k]);
                    var details = [];
                    for (var k = s; k <= e; k++) {
                        var extended = (k > 0 ? curArr[k-1] + a[k] : a[k]);
                        var alone = a[k];
                        if (k > 0 && extended > alone) details.push('dp[' + k + ']: extending the prev sum is better (' + extended + ')>' + alone + ' → ' + curArr[k]);
                        else if (k > 0) details.push('dp[' + k + ']: <strong>starting fresh</strong> is better (' + alone + '>=' + extended + ') → ' + curArr[k]);
                        else details.push('dp[' + k + ']=' + curArr[k]);
                    }
                    var desc = details.join(', ');
                    if (lastStep) desc += '. <strong>Final answer</strong>=' + res.ans;
                    steps.push({
                        description: desc,
                        action: function() {
                            for (var k = s; k <= e; k++) {
                                var bg = (lastStep && k === res.ansEnd) ? 'var(--green)' : (curArr[k] < 0 ? 'var(--bg2)' : '#d6303115');
                                setMs(k, curArr[k], bg);
                            }
                            if (lastStep) infoEl.innerHTML = '<strong style="color:var(--green);">Max subarray sum = ' + res.ans + ' (range: [' + res.ansStart + '~' + res.ansEnd + '])</strong>';
                            else infoEl.innerHTML = details.join(', ') + ' | ans=' + newAns;
                        },
                        undo: function() { for (var k = s; k <= e; k++) resetMs(k); }
                    });
                })(start, end, runAns, isLast);
                for (var k = start; k <= end; k++) runAns = Math.max(runAns, curArr[k]);
                start = end + 1;
            }
            return steps;
        }

        function init(a) {
            var n = a.length;
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Array (comma-separated): <input type="text" id="dp-maxsub-input" value="' + a.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="dp-maxsub-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">Maximum Subarray Sum (Kadane Algorithm)</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">[' + a.join(',') + ']</p>' +
                '<div id="ms-cells' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="ms-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#ms-cells' + suffix);
            var infoEl = container.querySelector('#ms-info' + suffix);
            for (var i = 0; i < n; i++) cellsEl.innerHTML += '<div id="ms-c' + i + suffix + '" style="width:44px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-size:0.8rem;"><div style="font-weight:600;">' + a[i] + '</div><div style="font-size:0.65rem;color:var(--text3);">?</div></div>';
            var steps = buildSteps(a, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-maxsub-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-maxsub-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 1) raw = DEFAULT_A.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_A);
    },

    // ====================================================================
    // Simulation 8: Easy Staircase Number (boj-10844)
    // ====================================================================
    _renderVizEasyStair(container) {
        var self = this, suffix = '-estair';
        var DEFAULT_N = 2;
        var MOD = 1000000000;

        function computeEasyStair(n) {
            var dp = [];
            for (var i = 0; i <= n; i++) { dp[i] = []; for (var j = 0; j <= 9; j++) dp[i][j] = 0; }
            for (var j = 1; j <= 9; j++) dp[1][j] = 1;
            for (var i = 2; i <= n; i++) {
                dp[i][0] = dp[i-1][1] % MOD;
                dp[i][9] = dp[i-1][8] % MOD;
                for (var j = 1; j <= 8; j++) dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD;
            }
            return dp;
        }

        function buildSteps(n, dpTable, infoEl) {
            function setEs(j,v,bg) { var c = container.querySelector('#es-c' + j + suffix); if(c){c.querySelector('div:last-child').textContent=v; if(bg)c.style.background=bg;} }
            function resetEs(j) { var c = container.querySelector('#es-c' + j + suffix); if(c){c.querySelector('div:last-child').textContent='?'; c.style.background='var(--bg2)';} }
            var steps = [];
            // Step 1: length 1
            steps.push({ description: 'Base case: Each digit 1~9 forms one staircase number of length 1. dp[1][0]=0 because <strong>numbers cannot start with 0</strong>.',
              action: function() { setEs(0,'0','var(--bg2)'); for(var j=1;j<=9;j++) setEs(j,'1','#0984e315'); infoEl.innerHTML='Staircase numbers of length 1: 1,2,...,9 (9 total)'; },
              undo: function() { for(var j=0;j<=9;j++) resetEs(j); infoEl.innerHTML=''; } });
            // Steps for each length up to n
            for (var len = 2; len <= n; len++) {
                (function(l) {
                    var isLast = (l === n);
                    steps.push({ description: 'Length ' + l + ' boundaries: Ending digit 0 can <strong>only come from 1</strong> (dp[' + l + '][0]=' + dpTable[l][0] + '), ending digit 9 can <strong>only come from 8</strong> (dp[' + l + '][9]=' + dpTable[l][9] + ').',
                      action: function() { setEs(0, dpTable[l][0], '#0984e315'); setEs(9, dpTable[l][9], '#0984e315'); infoEl.innerHTML='End 0: only from 1=' + dpTable[l][0] + ', End 9: only from 8=' + dpTable[l][9]; },
                      undo: function() { var prev = l > 1 ? dpTable[l-1] : null; setEs(0, prev ? prev[0] : '0', prev && prev[0] > 0 ? '#0984e315' : 'var(--bg2)'); setEs(9, prev ? prev[9] : '?', '#0984e315'); } });
                    steps.push({ description: 'Length ' + l + ', digits 1~8: Each digit can <strong>come from two adjacent digits (j-1 and j+1)</strong>, so we sum both.',
                      action: function() { for(var j=1;j<=8;j++) setEs(j, dpTable[l][j], '#0984e315'); infoEl.innerHTML='Digits 1~8 come from both neighbors'; },
                      undo: function() { var prev = l > 1 ? dpTable[l-1] : null; for(var j=1;j<=8;j++) setEs(j, prev ? prev[j] : '?', prev ? '#0984e315' : 'var(--bg2)'); } });
                    if (isLast) {
                        var total = 0; for(var j=0;j<=9;j++) total = (total + dpTable[l][j]) % MOD;
                        steps.push({ description: '<strong>Final answer</strong>: Sum all ending digits for length ' + l + ' staircase numbers = ' + total,
                          action: function() { infoEl.innerHTML='<strong style="color:var(--green);">Length ' + l + ' staircase numbers = ' + total.toLocaleString() + '</strong>'; },
                          undo: function() { infoEl.innerHTML='Digits 1~8 come from both neighbors'; } });
                    }
                })(len);
            }
            return steps;
        }

        function init(n) {
            if (n < 1) n = 1; if (n > 10) n = 10;
            var dpTable = computeEasyStair(n);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N (digits): <input type="number" id="dp-easystair-n" value="' + n + '" min="1" max="10" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="dp-easystair-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">Easy Staircase Number: Length ' + n + '</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[length][last_digit]: transition from digit j to j-1, j+1</p>' +
                '<div id="es-grid' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="es-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var gridEl = container.querySelector('#es-grid' + suffix);
            var infoEl = container.querySelector('#es-info' + suffix);
            for (var j = 0; j <= 9; j++) gridEl.innerHTML += '<div id="es-c' + j + suffix + '" style="width:44px;text-align:center;padding:6px;border-radius:6px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">end=' + j + '</div><div style="font-weight:600;">?</div></div>';
            var steps = buildSteps(n, dpTable, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-easystair-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#dp-easystair-n').value) || DEFAULT_N;
                if (val < 1) val = 1; if (val > 10) val = 10;
                self._clearVizState(); init(val);
            });
        }
        init(DEFAULT_N);
    },

    // ====================================================================
    // Simulation 9: RGB Street (boj-1149)
    // ====================================================================
    _renderVizRGB(container) {
        var self = this, suffix = '-rgb';
        var DEFAULT_COSTS = [[26,40,83],[49,60,57],[13,89,99]];
        var colorNames = ['R','G','B'];

        function computeRGB(costs) {
            var n = costs.length;
            var dp = [];
            for (var i = 0; i < n; i++) dp[i] = [0,0,0];
            dp[0] = costs[0].slice();
            for (var i = 1; i < n; i++) {
                dp[i][0] = Math.min(dp[i-1][1], dp[i-1][2]) + costs[i][0];
                dp[i][1] = Math.min(dp[i-1][0], dp[i-1][2]) + costs[i][1];
                dp[i][2] = Math.min(dp[i-1][0], dp[i-1][1]) + costs[i][2];
            }
            return dp;
        }

        function buildSteps(costs, dpArr, infoEl) {
            var n = costs.length;
            function setRgb(i,j,txt,bg) { var c = container.querySelector('#rgb-' + i + '-' + j + suffix); if(c){if(txt)c.querySelector('div:last-child').textContent=txt; if(bg)c.style.background=bg;} }
            function resetRgb(i,j) { var c = container.querySelector('#rgb-' + i + '-' + j + suffix); if(c){c.querySelector('div:last-child').textContent=costs[i][j]; c.style.background='var(--bg2)';} }
            var steps = [];
            // First house
            steps.push({ description: 'Base case — House 1: No previous house, so there are <strong>no constraints</strong>. Each color cost becomes the dp value directly. R=' + costs[0][0] + ', G=' + costs[0][1] + ', B=' + costs[0][2],
              action: function() { for(var j=0;j<3;j++) setRgb(0,j,costs[0][j]+'','#e8439315'); infoEl.innerHTML='First house: no constraint, cost = dp value'; },
              undo: function() { for(var j=0;j<3;j++) resetRgb(0,j); infoEl.innerHTML=''; } });
            // Each subsequent house
            for (var i = 1; i < n; i++) {
                (function(idx) {
                    var isLast = (idx === n - 1);
                    steps.push({ description: 'House ' + (idx+1) + ': <strong>Must differ from neighbor</strong>, so each color takes the min of the previous house\'s <em>other two colors</em> + its own cost. R=' + dpArr[idx][0] + ', G=' + dpArr[idx][1] + ', B=' + dpArr[idx][2],
                      action: function() { for(var j=0;j<3;j++) setRgb(idx,j,dpArr[idx][j]+'','#e8439315'); infoEl.innerHTML='dp[' + (idx+1) + '][R]=' + dpArr[idx][0] + ', dp[' + (idx+1) + '][G]=' + dpArr[idx][1] + ', dp[' + (idx+1) + '][B]=' + dpArr[idx][2]; },
                      undo: function() { for(var j=0;j<3;j++) resetRgb(idx,j); } });
                })(i);
            }
            // Final: find min and trace path
            var lastRow = dpArr[n-1];
            var minVal = Math.min(lastRow[0], lastRow[1], lastRow[2]);
            var minIdx = lastRow.indexOf(minVal);
            // trace back path
            var path = [minIdx];
            for (var i = n - 1; i > 0; i--) {
                var prev = path[path.length - 1];
                var cands = [0,1,2].filter(function(j) { return j !== prev; });
                var best = cands[0];
                if (dpArr[i-1][cands[1]] < dpArr[i-1][best]) best = cands[1];
                path.push(best);
            }
            path.reverse();
            var pathStr = path.map(function(j) { return colorNames[j]; }).join('→');
            steps.push({ description: '<strong>Final answer</strong>: Pick the minimum among the last house\'s R/G/B = ' + minVal + '. The optimal path satisfying the neighbor constraint: ' + pathStr,
              action: function() { for(var i=0;i<n;i++) setRgb(i, path[i], dpArr[i][path[i]]+'', 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">Min cost=' + minVal + ' (' + pathStr + ')</strong>'; },
              undo: function() { for(var i=0;i<n;i++) setRgb(i, path[i], dpArr[i][path[i]]+'', '#e8439315'); } });
            return steps;
        }

        function init(costs) {
            var n = costs.length;
            var dpArr = computeRGB(costs);
            var costStrs = costs.map(function(r) { return r.join(' '); });
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Costs (rows separated by ;): <input type="text" id="dp-rgb-input" value="' + costStrs.join('; ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
                '<button class="btn btn-primary" id="dp-rgb-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">RGB Street: Min cost for ' + n + ' houses</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">Neighbors must be different colors!</p>' +
                '<div id="rgb-grid' + suffix + '" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:300px;margin:0 auto 12px;"></div>' +
                '<div id="rgb-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var gridEl = container.querySelector('#rgb-grid' + suffix);
            var infoEl = container.querySelector('#rgb-info' + suffix);
            for (var i = 0; i < n; i++) for (var j = 0; j < 3; j++) gridEl.innerHTML += '<div id="rgb-' + i + '-' + j + suffix + '" style="padding:8px;text-align:center;border-radius:6px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">H' + (i+1) + colorNames[j] + '</div><div style="font-weight:600;">' + costs[i][j] + '</div></div>';
            var steps = buildSteps(costs, dpArr, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-rgb-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-rgb-input').value;
                var rows = raw.split(';').map(function(r) { return r.trim().split(/\s+/).map(function(s) { return parseInt(s); }); });
                rows = rows.filter(function(r) { return r.length === 3 && r.every(function(v) { return !isNaN(v); }); });
                if (rows.length < 2) rows = DEFAULT_COSTS.slice();
                if (rows.length > 10) rows = rows.slice(0, 10);
                self._clearVizState(); init(rows);
            });
        }
        init(DEFAULT_COSTS);
    },

    // ====================================================================
    // Simulation 10: Integer Triangle (boj-1932)
    // ====================================================================
    _renderVizTriangle(container) {
        var self = this, suffix = '-tri';
        var DEFAULT_TRI = [[7],[3,8],[8,1,0],[2,7,4,4],[4,5,2,6,5]];

        function computeTriangle(tri) {
            var n = tri.length;
            var dp = tri.map(function(r) { return r.slice(); });
            for (var i = n - 2; i >= 0; i--) {
                for (var j = 0; j <= i; j++) dp[i][j] += Math.max(dp[i+1][j], dp[i+1][j+1]);
            }
            return dp;
        }

        function buildSteps(tri, dpArr, infoEl) {
            var n = tri.length;
            function setTri(i,j,v,bg) { var c = container.querySelector('#tri-' + i + '-' + j + suffix); if(c){c.textContent=v; if(bg)c.style.background=bg;} }
            function resetTri(i,j) { var c = container.querySelector('#tri-' + i + '-' + j + suffix); if(c){c.textContent=tri[i][j]; c.style.background='var(--bg2)';} }
            var steps = [];
            // Bottom row
            steps.push({ description: 'Base case: Row ' + n + ' (bottom) has <strong>nowhere further to go</strong>, so each value is its own maximum sum.',
              action: function() { for(var j=0;j<tri[n-1].length;j++) setTri(n-1,j,tri[n-1][j],'#fab1a015'); infoEl.innerHTML='Bottom row: value = dp value (no children)'; },
              undo: function() { for(var j=0;j<tri[n-1].length;j++) resetTri(n-1,j); infoEl.innerHTML=''; } });
            // Each row from bottom-1 to 1
            for (var i = n - 2; i >= 1; i--) {
                (function(row) {
                    var details = [];
                    for (var j = 0; j <= row; j++) details.push(tri[row][j] + '+max(' + dpArr[row+1][j] + ',' + dpArr[row+1][j+1] + ')=' + dpArr[row][j]);
                    steps.push({ description: 'Row ' + (row+1) + ': Each cell picks the <strong>larger of its two children below</strong> and adds its own value. ' + details.join(', '),
                      action: function() { for(var j=0;j<=row;j++) setTri(row,j,dpArr[row][j],'#fab1a015'); infoEl.innerHTML=details.join(', '); },
                      undo: function() { for(var j=0;j<=row;j++) resetTri(row,j); } });
                })(i);
            }
            // Top: answer
            steps.push({ description: '<strong>Top</strong>: ' + tri[0][0] + ' + max(' + dpArr[1][0] + ',' + dpArr[1][1] + ') = ' + dpArr[0][0] + '. All maximum sums from below converge here.',
              action: function() { setTri(0,0,dpArr[0][0],'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">Maximum sum = ' + dpArr[0][0] + '</strong>'; },
              undo: function() { resetTri(0,0); } });
            return steps;
        }

        function init(tri) {
            var n = tri.length;
            var dpArr = computeTriangle(tri);
            var triStrs = tri.map(function(r) { return r.join(' '); });
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Triangle (rows separated by ;): <input type="text" id="dp-tri-input" value="' + triStrs.join('; ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
                '<button class="btn btn-primary" id="dp-tri-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">Integer Triangle: Bottom-Up Max Path</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">Building up from bottom to top to find maximum sum.</p>' +
                '<div id="tri-grid' + suffix + '" style="text-align:center;margin-bottom:12px;"></div>' +
                '<div id="tri-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var gridEl = container.querySelector('#tri-grid' + suffix);
            var infoEl = container.querySelector('#tri-info' + suffix);
            var html = '';
            for (var i = 0; i < n; i++) {
                html += '<div style="display:flex;justify-content:center;gap:4px;margin-bottom:4px;">';
                for (var j = 0; j <= i; j++) html += '<div id="tri-' + i + '-' + j + suffix + '" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:var(--bg2);font-weight:600;font-size:0.85rem;">' + tri[i][j] + '</div>';
                html += '</div>';
            }
            gridEl.innerHTML = html;
            var steps = buildSteps(tri, dpArr, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-tri-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-tri-input').value;
                var rows = raw.split(';').map(function(r) { return r.trim().split(/\s+/).map(function(s) { return parseInt(s); }).filter(function(v) { return !isNaN(v); }); });
                rows = rows.filter(function(r) { return r.length > 0; });
                // Validate triangle shape
                var valid = true;
                for (var i = 0; i < rows.length; i++) { if (rows[i].length !== i + 1) valid = false; }
                if (!valid || rows.length < 2) rows = DEFAULT_TRI.map(function(r) { return r.slice(); });
                if (rows.length > 8) rows = rows.slice(0, 8);
                self._clearVizState(); init(rows);
            });
        }
        init(DEFAULT_TRI);
    },

    // ====================================================================
    // Simulation 11: Longest Increasing Subsequence (boj-11053)
    // ====================================================================
    _renderVizLIS(container) {
        var self = this, suffix = '-lis';
        var DEFAULT_A = [10,20,10,30,20,50];

        function computeLIS(a) {
            var n = a.length;
            var dp = new Array(n).fill(1);
            for (var i = 1; i < n; i++)
                for (var j = 0; j < i; j++)
                    if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            return dp;
        }

        function buildSteps(a, dp, infoEl) {
            var n = a.length;
            var maxLen = Math.max.apply(null, dp);
            function setLis(i,v,bg) { var c = container.querySelector('#lis-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:'+v; if(bg)c.style.background=bg;} }
            function resetLis(i) { var c = container.querySelector('#lis-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:?'; c.style.background='var(--bg2)';} }
            var steps = [];
            // Step for each element
            for (var i = 0; i < n - 1; i++) {
                (function(idx) {
                    var reason = 'dp[' + idx + ']=' + dp[idx];
                    if (dp[idx] === 1) reason += ': <strong>no smaller value exists</strong> before a[' + idx + ']=' + a[idx] + ', so it starts its own subsequence';
                    else {
                        for (var j = 0; j < idx; j++) {
                            if (a[j] < a[idx] && dp[j] + 1 === dp[idx]) { reason += ': The increasing subsequence ending at a[' + j + ']=' + a[j] + ' (length ' + dp[j] + ') <strong>can be extended by ' + a[idx] + '</strong>, so +1'; break; }
                        }
                    }
                    steps.push({ description: reason,
                      action: function() { setLis(idx, dp[idx], '#74b9ff15'); infoEl.innerHTML=reason; },
                      undo: function() { resetLis(idx); } });
                })(i);
            }
            // Final step: show answer with LIS path highlighted
            var lisPath = [];
            var cur = maxLen;
            for (var i = n - 1; i >= 0; i--) { if (dp[i] === cur) { lisPath.unshift(i); cur--; } }
            var lisVals = lisPath.map(function(i) { return a[i]; });
            steps.push({ description: '<strong>Final answer</strong>: The maximum dp value gives the LIS length = ' + maxLen + '. Actual subsequence: {' + lisVals.join(',') + '}',
              action: function() {
                  setLis(n-1, dp[n-1], '#74b9ff15');
                  for (var k = 0; k < lisPath.length; k++) setLis(lisPath[k], dp[lisPath[k]], 'var(--green)');
                  infoEl.innerHTML='<strong style="color:var(--green);">LIS length = ' + maxLen + ': {' + lisVals.join(', ') + '}</strong>';
              },
              undo: function() { resetLis(n-1); } });
            return steps;
        }

        function init(a) {
            var n = a.length;
            var dp = computeLIS(a);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Array (comma-separated): <input type="text" id="dp-lis-input" value="' + a.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="dp-lis-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">LIS: [' + a.join(',') + ']</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[i] = length of longest increasing subsequence ending at a[i]</p>' +
                '<div id="lis-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="lis-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#lis-cells' + suffix);
            var infoEl = container.querySelector('#lis-info' + suffix);
            for (var i = 0; i < n; i++) cellsEl.innerHTML += '<div id="lis-c' + i + suffix + '" style="width:52px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-weight:600;">' + a[i] + '</div><div style="font-size:0.7rem;color:var(--text3);">dp:?</div></div>';
            var steps = buildSteps(a, dp, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-lis-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-lis-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 2) raw = DEFAULT_A.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_A);
    },

    // ====================================================================
    // Simulation 12: Longest Bitonic Subsequence (boj-11054)
    // ====================================================================
    _renderVizBitonic(container) {
        var self = this, suffix = '-bito';
        var DEFAULT_A = [1,5,2,1,4,3,4,5,2,1];

        function computeBitonic(a) {
            var n = a.length;
            var lis = new Array(n).fill(1), lds = new Array(n).fill(1);
            for (var i = 1; i < n; i++)
                for (var j = 0; j < i; j++)
                    if (a[j] < a[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
            for (var i = n - 2; i >= 0; i--)
                for (var j = n - 1; j > i; j--)
                    if (a[j] < a[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
            var sums = [];
            var maxVal = 0, maxIdx = 0;
            for (var i = 0; i < n; i++) {
                sums[i] = lis[i] + lds[i] - 1;
                if (sums[i] > maxVal) { maxVal = sums[i]; maxIdx = i; }
            }
            return { lis: lis, lds: lds, sums: sums, maxVal: maxVal, maxIdx: maxIdx };
        }

        function buildSteps(a, res, infoEl) {
            var n = a.length;
            function setBi(i,txt,bg) { var c = container.querySelector('#bi-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent=txt; if(bg)c.style.background=bg;} }
            function resetBi(i) { var c = container.querySelector('#bi-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='?/?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'First, compute the <strong>left-to-right LIS</strong>. Each position shows the max length of an increasing run ending here. [' + res.lis.join(',') + ']',
              action: function() { for(var i=0;i<n;i++) setBi(i,'L:'+res.lis[i],'#a29bfe15'); infoEl.innerHTML='LIS array: [' + res.lis.join(',') + ']'; },
              undo: function() { for(var i=0;i<n;i++) resetBi(i); infoEl.innerHTML=''; } });
            steps.push({ description: 'Next, compute the <strong>right-to-left LIS (=LDS)</strong>. Each position shows the max length of a decreasing run starting here. [' + res.lds.join(',') + ']',
              action: function() { for(var i=0;i<n;i++) setBi(i,res.lis[i]+'/'+res.lds[i],'#a29bfe15'); infoEl.innerHTML='LDS array: [' + res.lds.join(',') + ']'; },
              undo: function() { for(var i=0;i<n;i++) setBi(i,'L:'+res.lis[i],'#a29bfe15'); } });
            steps.push({ description: '<strong>lis[i]+lds[i]-1</strong>: Using each position as the peak, the total bitonic length is "ascending length + descending length - 1 (to avoid counting self twice)". [' + res.sums.join(',') + '] → i=' + res.maxIdx + ' is the maximum (' + res.maxVal + ')',
              action: function() { for(var i=0;i<n;i++) setBi(i,res.sums[i],(res.sums[i]>=res.maxVal-1?'#a29bfe30':'#a29bfe15')); infoEl.innerHTML='Sum: [' + res.sums.join(',') + '] -> i=' + res.maxIdx + ' is max'; },
              undo: function() { for(var i=0;i<n;i++) setBi(i,res.lis[i]+'/'+res.lds[i],'#a29bfe15'); } });
            steps.push({ description: '<strong>Final answer</strong>: With peak at a[' + res.maxIdx + ']=' + a[res.maxIdx] + ', the longest bitonic subsequence (goes up then down) = ' + res.maxVal,
              action: function() { for(var i=0;i<n;i++) setBi(i,a[i],'var(--bg2)'); setBi(res.maxIdx, a[res.maxIdx], 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">Longest bitonic = ' + res.maxVal + ' (peak: a[' + res.maxIdx + ']=' + a[res.maxIdx] + ')</strong>'; },
              undo: function() { for(var i=0;i<n;i++) setBi(i,res.sums[i],(res.sums[i]>=res.maxVal-1?'#a29bfe30':'#a29bfe15')); } });
            return steps;
        }

        function init(a) {
            var n = a.length;
            var res = computeBitonic(a);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Array (comma-separated): <input type="text" id="dp-bitonic-input" value="' + a.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:240px;"></label>' +
                '<button class="btn btn-primary" id="dp-bitonic-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">Bitonic Subsequence: LIS + LDS</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">[' + a.join(',') + ']. max of lis[i]+lds[i]-1</p>' +
                '<div id="bi-cells' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="bi-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#bi-cells' + suffix);
            var infoEl = container.querySelector('#bi-info' + suffix);
            for (var i = 0; i < n; i++) cellsEl.innerHTML += '<div id="bi-c' + i + suffix + '" style="width:44px;text-align:center;padding:4px 2px;border-radius:6px;background:var(--bg2);font-size:0.8rem;"><div style="font-weight:600;">' + a[i] + '</div><div style="font-size:0.6rem;color:var(--text3);">?/?</div></div>';
            var steps = buildSteps(a, res, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-bitonic-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-bitonic-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 2) raw = DEFAULT_A.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_A);
    },

    // ====================================================================
    // Simulation 13: Electric Wires (boj-2565)
    // ====================================================================
    _renderVizWire(container) {
        var self = this, suffix = '-wire';
        var DEFAULT_WIRES = [[1,8],[2,2],[3,9],[4,1],[6,4],[7,6],[9,7],[10,10]];

        function computeWire(wires) {
            var sorted = wires.slice().sort(function(a, b) { return a[0] - b[0]; });
            var apos = sorted.map(function(w) { return w[0]; });
            var b = sorted.map(function(w) { return w[1]; });
            var n = b.length;
            var dp = new Array(n).fill(1);
            for (var i = 1; i < n; i++)
                for (var j = 0; j < i; j++)
                    if (b[j] < b[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            var lisLen = Math.max.apply(null, dp);
            return { apos: apos, b: b, dp: dp, lisLen: lisLen, n: n };
        }

        function buildSteps(res, infoEl) {
            var n = res.n, dp = res.dp, b = res.b, apos = res.apos;
            function setWr(i,v,bg) { var c = container.querySelector('#wr-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:'+v; if(bg)c.style.background=bg;} }
            function resetWr(i) { var c = container.querySelector('#wr-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'After sorting by A, <strong>wires whose B values are increasing never cross</strong>. So finding the LIS of B gives the maximum non-crossing set.',
              action: function() { infoEl.innerHTML='B = [' + b.join(', ') + ']. LIS of B = max non-crossing wires!'; },
              undo: function() { infoEl.innerHTML=''; } });
            // Fill dp individually — each element gets its own step
            for (var k = 0; k < n - 1; k++) {
                (function(idx) {
                    var comparisons = [];
                    for (var j = 0; j < idx; j++) {
                        if (b[j] < b[idx]) comparisons.push('B[' + j + ']=' + b[j] + '<' + b[idx]);
                    }
                    var desc = 'dp[' + idx + ']=' + dp[idx] + (comparisons.length ? ': ' + comparisons.join(', ') + ' → <strong>can extend after a smaller B value</strong>' : ': no smaller B value before, so <strong>starts alone</strong>');
                    steps.push({ description: desc,
                      action: function() { setWr(idx, dp[idx], '#55efc415'); infoEl.innerHTML = desc; },
                      undo: function() { resetWr(idx); } });
                })(k);
            }
            // Final
            var remove = n - res.lisLen;
            steps.push({ description: '<strong>Final answer</strong>: LIS=' + res.lisLen + ' (max non-crossing wires). Total ' + n + ' wires minus ' + res.lisLen + ' kept = <strong>' + remove + ' wires to remove</strong>.',
              action: function() {
                  setWr(n-1, dp[n-1], '#55efc415');
                  // Highlight LIS path
                  var cur = res.lisLen;
                  for (var i = n-1; i >= 0; i--) { if (dp[i] === cur) { setWr(i, dp[i], 'var(--green)'); cur--; } }
                  infoEl.innerHTML='<strong style="color:var(--green);">LIS=' + res.lisLen + ', wires to remove = ' + remove + '</strong>';
              },
              undo: function() { for(var k=0;k<n;k++) setWr(k,dp[k],'#55efc415'); } });
            return steps;
        }

        function init(wires) {
            var res = computeWire(wires);
            var wireStr = wires.map(function(w) { return w[0] + ' ' + w[1]; }).join(', ');
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Wires (A B pairs, comma-separated): <input type="text" id="dp-wire-input" value="' + wireStr + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
                '<button class="btn btn-primary" id="dp-wire-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">Electric Wires: LIS of B after sorting by A</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">Sorted by A: B=[' + res.b.join(',') + ']. Find LIS length then N-LIS</p>' +
                '<div id="wr-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="wr-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#wr-cells' + suffix);
            var infoEl = container.querySelector('#wr-info' + suffix);
            for (var i = 0; i < res.n; i++) cellsEl.innerHTML += '<div id="wr-c' + i + suffix + '" style="width:52px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">A=' + res.apos[i] + '</div><div style="font-weight:600;">B=' + res.b[i] + '</div><div style="font-size:0.65rem;color:var(--text3);">dp:?</div></div>';
            var steps = buildSteps(res, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-wire-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-wire-input').value;
                var pairs = raw.split(',').map(function(s) {
                    var parts = s.trim().split(/\s+/).map(function(p) { return parseInt(p); });
                    return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) ? parts : null;
                }).filter(function(p) { return p !== null; });
                if (pairs.length < 2) pairs = DEFAULT_WIRES.slice();
                if (pairs.length > 12) pairs = pairs.slice(0, 12);
                self._clearVizState(); init(pairs);
            });
        }
        init(DEFAULT_WIRES);
    },

    // ====================================================================
    // Simulation 14: LCS (boj-9251)
    // ====================================================================
    _renderVizLCS(container) {
        var self = this, suffix = '-lcs';
        var DEFAULT_A = 'ACAYKP', DEFAULT_B = 'CAPCAK';

        function computeLCS(a, b) {
            var n = a.length, m = b.length;
            var dp = [];
            for (var i = 0; i <= n; i++) {
                dp[i] = [];
                for (var j = 0; j <= m; j++) dp[i][j] = 0;
            }
            for (var i = 1; i <= n; i++) {
                for (var j = 1; j <= m; j++) {
                    if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
                    else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
            // Backtrack to find LCS string
            var lcsStr = '';
            var ci = n, cj = m;
            while (ci > 0 && cj > 0) {
                if (a[ci-1] === b[cj-1]) { lcsStr = a[ci-1] + lcsStr; ci--; cj--; }
                else if (dp[ci-1][cj] > dp[ci][cj-1]) ci--;
                else cj--;
            }
            return { dp: dp, lcs: lcsStr };
        }

        function renderGrid(a, b) {
            var n = a.length, m = b.length;
            var tbl = '<table style="border-collapse:collapse;margin:0 auto;font-size:0.75rem;"><tr><td></td><td style="padding:4px;font-weight:600;">""</td>';
            for (var j = 0; j < m; j++) tbl += '<td style="padding:4px;font-weight:600;">' + b[j] + '</td>';
            tbl += '</tr>';
            tbl += '<tr><td style="padding:4px;font-weight:600;">""</td>';
            for (var j = 0; j <= m; j++) tbl += '<td id="lcs-0-' + j + suffix + '" style="padding:4px 6px;border:1px solid var(--border);text-align:center;">0</td>';
            tbl += '</tr>';
            for (var i = 1; i <= n; i++) {
                tbl += '<tr><td style="padding:4px;font-weight:600;">' + a[i-1] + '</td>';
                for (var j = 0; j <= m; j++) tbl += '<td id="lcs-' + i + '-' + j + suffix + '" style="padding:4px 6px;border:1px solid var(--border);text-align:center;">' + (j===0?'0':'?') + '</td>';
                tbl += '</tr>';
            }
            tbl += '</table>';
            return tbl;
        }

        function setLcs(i,j,v,bg) { var c = container.querySelector('#lcs-' + i + '-' + j + suffix); if(c){c.textContent=v; if(bg)c.style.background=bg;} }

        function buildSteps(a, b) {
            var result = computeLCS(a, b);
            var dp = result.dp;
            var lcsStr = result.lcs;
            var n = a.length, m = b.length;
            var steps = [];

            for (var i = 1; i <= n; i++) {
                (function(row) {
                    var matchCols = [];
                    for (var j = 1; j <= m; j++) {
                        if (a[row-1] === b[j-1]) matchCols.push(j);
                    }
                    var matchDesc = matchCols.length > 0
                        ? matchCols.map(function(j){ return 'j=' + j + ': ' + a[row-1] + '=' + b[j-1] + '->diagonal+1=' + dp[row][j]; }).join(', ')
                        : a[row-1] + ' has no match in B->left/up max';
                    steps.push({
                        description: 'Row ' + row + ': Compare A[' + row + ']="' + a[row-1] + '" against each character in B. ' + (matchCols.length > 0 ? '<strong>When characters match</strong>, take the diagonal (both strings\' previous state) + 1. Otherwise, keep the max of left/above.' : 'No matching character found, so all cells keep the max of left/above.'),
                        action: function(dir) {
                            if (dir === 'forward') {
                                for (var j = 1; j <= m; j++) setLcs(row, j, dp[row][j], '#fd79a815');
                                infoEl.innerHTML = matchDesc;
                            }
                        },
                        undo: function() {
                            for (var j = 1; j <= m; j++) setLcs(row, j, '?', '');
                            if (row === 1) infoEl.innerHTML = '';
                            else {
                                // restore prev row info
                                infoEl.innerHTML = '';
                            }
                        }
                    });
                })(i);
            }

            // Final step: highlight result
            steps.push({
                description: '<strong>Final answer</strong>: dp[' + n + '][' + m + ']=' + dp[n][m] + '. The longest common subsequence of both strings has length ' + dp[n][m] + (lcsStr ? ' (LCS: ' + lcsStr + ')' : ''),
                action: function(dir) {
                    if (dir === 'forward') {
                        setLcs(n, m, dp[n][m], 'var(--green)');
                        infoEl.innerHTML = '<strong style="color:var(--green);">LCS length = ' + dp[n][m] + (lcsStr ? ' (' + lcsStr + ')' : '') + '</strong>';
                    }
                },
                undo: function() {
                    setLcs(n, m, dp[n][m], '#fd79a815');
                    infoEl.innerHTML = '';
                }
            });

            return steps;
        }

        function init(a, b) {
            container.innerHTML =
                '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">' +
                    '<label style="font-size:0.85rem;font-weight:600;">String A:</label>' +
                    '<input id="dp-lcs-a' + suffix + '" type="text" value="' + a + '" style="width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;">' +
                    '<label style="font-size:0.85rem;font-weight:600;">String B:</label>' +
                    '<input id="dp-lcs-b' + suffix + '" type="text" value="' + b + '" style="width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;">' +
                    '<button id="dp-lcs-reset' + suffix + '" style="padding:4px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg2);cursor:pointer;font-size:0.85rem;" title="Reset with input values">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">LCS: ' + a + ' vs ' + b + '</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[i][j] = LCS length of A[:i] and B[:j]</p>' +
                '<div id="lcs-grid' + suffix + '" style="overflow-x:auto;margin-bottom:12px;"></div>' +
                '<div id="lcs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);

            var gridEl = container.querySelector('#lcs-grid' + suffix);
            infoEl = container.querySelector('#lcs-info' + suffix);

            gridEl.innerHTML = renderGrid(a, b);

            var steps = buildSteps(a, b);
            self._initStepController(container, steps, suffix);

            container.querySelector('#dp-lcs-reset' + suffix).addEventListener('click', function() {
                var newA = (container.querySelector('#dp-lcs-a' + suffix).value || '').toUpperCase().replace(/[^A-Z]/g, '');
                var newB = (container.querySelector('#dp-lcs-b' + suffix).value || '').toUpperCase().replace(/[^A-Z]/g, '');
                if (!newA) newA = DEFAULT_A;
                if (!newB) newB = DEFAULT_B;
                if (newA.length > 12) newA = newA.substring(0, 12);
                if (newB.length > 12) newB = newB.substring(0, 12);
                self._clearVizState();
                init(newA, newB);
            });
        }

        var infoEl;
        init(DEFAULT_A, DEFAULT_B);
    },

    // ====================================================================
    // Simulation 15: Standard Knapsack (boj-12865)
    // ====================================================================
    _renderVizKnapsack(container) {
        var self = this, suffix = '-knap';
        var DEFAULT_ITEMS = [{w:6,v:13},{w:4,v:8},{w:3,v:6},{w:5,v:12}];
        var DEFAULT_W = 7;
        var DEFAULT_ITEMS_STR = '6 13, 4 8, 3 6, 5 12';

        function computeKnapsack(items, W) {
            var dp = [];
            for (var w = 0; w <= W; w++) dp[w] = 0;
            // Store dp state after each item for step visualization
            var snapshots = [dp.slice()]; // initial state
            for (var i = 0; i < items.length; i++) {
                var prevDp = dp.slice();
                for (var w = W; w >= items[i].w; w--) {
                    dp[w] = Math.max(dp[w], dp[w - items[i].w] + items[i].v);
                }
                snapshots.push(dp.slice());
            }
            // Backtrack to find selected items
            var selected = [];
            var remain = W;
            for (var i = items.length - 1; i >= 0; i--) {
                if (i === 0) {
                    if (snapshots[i + 1][remain] !== snapshots[i][remain]) {
                        selected.unshift(i);
                        remain -= items[i].w;
                    }
                } else {
                    if (snapshots[i + 1][remain] !== snapshots[i][remain]) {
                        selected.unshift(i);
                        remain -= items[i].w;
                    }
                }
            }
            return { dp: dp, snapshots: snapshots, selected: selected };
        }

        function buildSteps(items, W) {
            var result = computeKnapsack(items, W);
            var snapshots = result.snapshots;
            var finalDp = result.dp;
            var selected = result.selected;
            var steps = [];

            for (var i = 0; i < items.length; i++) {
                (function(idx) {
                    var item = items[idx];
                    var prev = snapshots[idx];
                    var curr = snapshots[idx + 1];
                    var changes = [];
                    for (var w = 0; w <= W; w++) {
                        if (curr[w] !== prev[w]) changes.push('dp[' + w + ']=' + curr[w]);
                    }
                    var changeStr = changes.length > 0 ? changes.join(', ') : 'no update';
                    steps.push({
                        description: 'Item ' + (idx+1) + ' (' + item.w + 'kg, value ' + item.v + '): For each capacity w, decide "<strong>include this item or not</strong>" — if dp[w-' + item.w + ']+' + item.v + ' exceeds current dp[w], update. ' + changeStr,
                        action: function(dir) {
                            if (dir === 'forward') {
                                for (var w = 0; w <= W; w++) {
                                    var bg = curr[w] !== prev[w] ? '#636e7230' : (curr[w] > 0 ? '#636e7215' : 'var(--bg2)');
                                    setKn(w, curr[w], bg);
                                }
                                var details = [];
                                for (var w = W; w >= item.w; w--) {
                                    if (curr[w] !== prev[w]) {
                                        details.push('dp[' + w + ']=max(' + prev[w] + ', dp[' + (w - item.w) + ']+' + item.v + ')=' + curr[w] + (curr[w] > prev[w] ? ' updated!' : ''));
                                    }
                                }
                                infoEl.innerHTML = details.length > 0 ? details.join(', ') : 'No cells can be updated with this item';
                            }
                        },
                        undo: function() {
                            for (var w = 0; w <= W; w++) {
                                var bg = prev[w] > 0 ? '#636e7215' : 'var(--bg2)';
                                setKn(w, prev[w], bg);
                            }
                            if (idx === 0) infoEl.innerHTML = '';
                        }
                    });
                })(i);
            }

            // Final step
            var selDesc = selected.map(function(idx) { return 'Item ' + (idx+1) + '(' + items[idx].w + 'kg,' + items[idx].v + ')'; }).join(' + ');
            var totalW = 0, totalV = 0;
            selected.forEach(function(idx) { totalW += items[idx].w; totalV += items[idx].v; });
            steps.push({
                description: '<strong>Final answer</strong>: Maximum value with capacity ' + W + 'kg = ' + finalDp[W] + '.' + (selDesc ? ' Selected: ' + selDesc : ''),
                action: function(dir) {
                    if (dir === 'forward') {
                        setKn(W, finalDp[W], 'var(--green)');
                        infoEl.innerHTML = '<strong style="color:var(--green);">✅ Max value = ' + finalDp[W] + (selDesc ? ' (' + selDesc + ' = ' + totalW + 'kg, ' + totalV + ')' : '') + '</strong>';
                    }
                },
                undo: function() {
                    var last = snapshots[snapshots.length - 1];
                    setKn(W, last[W], '#636e7215');
                    infoEl.innerHTML = '';
                }
            });

            return steps;
        }

        function setKn(w,v,bg) { var c = container.querySelector('#kn-c' + w + suffix); if(c){c.querySelector('div:last-child').textContent=v; if(bg)c.style.background=bg;} }

        function renderCells(W) {
            var html = '';
            for (var w = 0; w <= W; w++) html += '<div id="kn-c' + w + suffix + '" style="width:44px;text-align:center;padding:6px;border-radius:6px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">w=' + w + '</div><div style="font-weight:600;">0</div></div>';
            return html;
        }

        function init(items, W) {
            var itemsDesc = items.map(function(it) { return '(' + it.w + 'kg,' + it.v + ')'; }).join(', ');
            var itemsStr = items.map(function(it) { return it.w + ' ' + it.v; }).join(', ');
            container.innerHTML =
                '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">' +
                    '<label style="font-size:0.85rem;font-weight:600;">Items (weight value):</label>' +
                    '<input id="dp-knapsack-items' + suffix + '" type="text" value="' + itemsStr + '" style="width:200px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;" placeholder="6 13, 4 8, 3 6">' +
                    '<label style="font-size:0.85rem;font-weight:600;">Capacity W:</label>' +
                    '<input id="dp-knapsack-w' + suffix + '" type="number" value="' + W + '" min="1" max="30" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;">' +
                    '<button id="dp-knapsack-reset' + suffix + '" style="padding:4px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg2);cursor:pointer;font-size:0.85rem;" title="Reset with input values">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">0/1 Knapsack: capacity ' + W + '</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">Items: ' + itemsDesc + '. Solving with 1D DP</p>' +
                '<div id="kn-cells' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="kn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);

            var cellsEl = container.querySelector('#kn-cells' + suffix);
            infoEl = container.querySelector('#kn-info' + suffix);
            cellsEl.innerHTML = renderCells(W);

            var steps = buildSteps(items, W);
            self._initStepController(container, steps, suffix);

            container.querySelector('#dp-knapsack-reset' + suffix).addEventListener('click', function() {
                var rawItems = container.querySelector('#dp-knapsack-items' + suffix).value || '';
                var newW = parseInt(container.querySelector('#dp-knapsack-w' + suffix).value) || DEFAULT_W;
                if (newW < 1) newW = 1;
                if (newW > 30) newW = 30;
                var newItems = [];
                rawItems.split(',').forEach(function(pair) {
                    var parts = pair.trim().split(/\s+/);
                    if (parts.length >= 2) {
                        var w = parseInt(parts[0]), v = parseInt(parts[1]);
                        if (!isNaN(w) && !isNaN(v) && w > 0 && v > 0) newItems.push({w:w, v:v});
                    }
                });
                if (newItems.length === 0) newItems = DEFAULT_ITEMS.slice();
                if (newItems.length > 10) newItems = newItems.slice(0, 10);
                self._clearVizState();
                init(newItems, newW);
            });
        }

        var infoEl;
        init(DEFAULT_ITEMS, DEFAULT_W);
    },

    // ===== 5-Stage Problem Set =====
    stages: [
        { num: 1, title: 'DP Intro', desc: 'Practice basic computation rules', problemIds: ['boj-24416', 'boj-9184', 'boj-1463', 'boj-1904'] },
        { num: 2, title: '1D DP Advanced', desc: 'Conditional 1D DP', problemIds: ['boj-2579', 'boj-2156', 'boj-1912', 'boj-10844'] },
        { num: 3, title: '2D DP', desc: 'Extending the table to 2D', problemIds: ['boj-1149', 'boj-1932'] },
        { num: 4, title: 'Longest Increasing Subsequence', desc: 'Finding increasing subsequences', problemIds: ['boj-11053', 'boj-11054', 'boj-2565'] },
        { num: 5, title: 'Classic DP', desc: 'LCS and Knapsack problems', problemIds: ['boj-9251', 'boj-12865'] }
    ],

    // ===== Problem List =====
    problems: [
        // ========== Stage 1: DP Intro ==========
        {
            id: 'boj-24416',
            title: 'BOJ 24416 - Algorithm Class: Fibonacci 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24416',
            simIntro: 'Compare the operation counts of recursion vs DP step by step.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Seojun is a teaching assistant for a dynamic programming class. Let us verify how much faster DP is compared to recursive calls. Print the number of base-case executions of the recursive Fibonacci function and the number of assignments in the DP version for the nth Fibonacci number.</p>
    <h4>Input</h4>
    <p>The first line contains n. (5 ≤ n ≤ 40)</p>
    <h4>Output</h4>
    <p>Print the number of base-case operations for the recursive call and the number of base-case operations for dynamic programming, separated by a space, on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>5</pre></div>
        <div><strong>Output</strong><pre>5 3</pre></div>
    </div></div>
    <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
        <div><strong>Input</strong><pre>30</pre></div>
        <div><strong>Output</strong><pre>832040 28</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>5 ≤ n ≤ 40</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'The problem says "count the base operations." So let us just run the recursive code as-is. We count each time <code>return 1</code> executes in <code>fib(n)</code>. For the DP side, we count each time <code>f[i] = f[i-1] + f[i-2]</code> executes.' },
                { title: 'But there\'s a problem with this', content: 'Wait, do we really need a separate counter for the recursion? If you think about it, the number of times <code>return 1</code> executes equals <strong>fib(n) itself</strong>! The number of leaf nodes reached = fib(n). So we do not need a separate counter at all.<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;"><div style="text-align:center;"><div style="font-size:0.8rem;color:var(--text3);">Recursive ops</div><div style="font-size:1.3rem;font-weight:700;color:var(--red);">fib(n)</div></div><div style="font-size:1.2rem;color:var(--text3);">vs</div><div style="text-align:center;"><div style="font-size:0.8rem;color:var(--text3);">DP ops</div><div style="font-size:1.3rem;font-weight:700;color:var(--green);">n − 2</div></div></div>' },
                { title: 'What if we try this?', content: 'The DP side is even simpler. The loop runs from <code>i = 3</code> to <code>i = n</code> executing <code>f[i] = f[i-1] + f[i-2]</code>, so the total count is simply <strong>n - 2</strong>. Nothing else to compute!<br><br>Summary:<br>- Recursive base operations = <code>fib(n)</code> value<br>- DP base operations = <code>n - 2</code>' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Just implement <code>fib(n)</code> recursively in Python. Since n is at most 40, recursion finishes within the time limit. No need for <code>sys.setrecursionlimit</code> here.</span><span class="lang-cpp">In C++, <code>fib(40)</code> is about 100 million, so you must use <code>long long</code> to avoid overflow. Using <code>int</code> may cause wrong answers!</span>' }
            ],
            inputLabel: 'Input (n)',
            inputMin: 5, inputMax: 40, inputDefault: 5,
            solve(n) {
                function fibRec(n) { if (n <= 2) return 1; return fibRec(n-1) + fibRec(n-2); }
                return fibRec(n) + ' ' + (n - 2);
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# Write your solution here\n# Find the base operation count of recursion and DP\n',
                cpp: '#include <iostream>\nusing namespace std;\n\n// Write your solution here\n\nint main() {\n    int n;\n    cin >> n;\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Recursive fib + simple calculation',
                description: 'The value of recursive fib(n) equals the recursive base operation count, and DP is n-2.',
                timeComplexity: 'O(2^n) recursion / O(n) DP',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'Define recursive function', desc: 'The number of recursive fib(n) calls itself equals the base operation count.\nBase case: return 1 when n is 1 or 2.', code: 'import sys\ninput = sys.stdin.readline\n\ndef fib(n):\n    if n == 1 or n == 2:\n        return 1\n    return fib(n-1) + fib(n-2)' },
                        { title: 'Read input', desc: 'Read n as an integer.', code: 'n = int(input())' },
                        { title: 'Output Result', desc: 'fib(n) is the recursive base op count, n-2 is the DP base op count.\nDP loops from i=3 to n, exactly n-2 times.', code: 'print(fib(n), n - 2)' }
                    ],
                    cpp: [
                        { title: 'Define recursive function', desc: 'Use long long: fib(40) can exceed int range.\nRecursive call count = fib(n) value itself.', code: '#include <iostream>\nusing namespace std;\n\n// Recursive fib: call count itself is the base operation count\nlong long fib(int n) {\n    if (n == 1 || n == 2) return 1;\n    return fib(n-1) + fib(n-2);\n}' },
                        { title: 'Read input', desc: 'Read n and start the main function.', code: 'int main() {\n    int n;\n    cin >> n;' },
                        { title: 'Output Result', desc: 'Print recursive base op count (fib(n)) and DP base op count (n-2).', code: '    cout << fib(n) << " " << n - 2 << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-9184',
            title: 'BOJ 9184 - Fun Function Execution',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/9184',
            simIntro: 'See how memoization eliminates redundancy during the w(2,2,2) call.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Compute the result of the recursive function w(a, b, c). Use memoization for efficient computation. Input repeats until EOF, and terminates when a=b=c=-1.</p>
    <h4>Input</h4>
    <p>The input consists of multiple test cases. Each test case contains three integers a, b, c on one line. The input ends with -1 -1 -1, which should not be processed. (-50 ≤ a, b, c ≤ 50)</p>
    <h4>Output</h4>
    <p>For each test case, print the value of w(a, b, c). See the example for the output format.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>1 1 1
2 2 2
10 4 6
50 50 50
-1 -1 -1</pre></div>
        <div><strong>Output</strong><pre>w(1, 1, 1) = 2
w(2, 2, 2) = 4
w(10, 4, 6) = 523
w(50, 50, 50) = 1048576</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>-50 ≤ a, b, c ≤ 50</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'The problem already gives us the recursive function code, so we just implement it directly! Translate the conditions as-is:<br>- If any of a, b, c &le; 0, return 1<br>- If any &gt; 20, return w(20, 20, 20)<br>- If a &lt; b &lt; c, w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c)<br>- Otherwise: w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1)' },
                { title: 'But there\'s a problem with this', content: 'If we just run the recursion as-is, the same (a, b, c) combinations are called countless times.<br><br><div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);margin-bottom:2px;">Pure recursion</div><div style="font-size:0.75rem;">Repeated calls</div><div style="font-weight:700;color:var(--red);font-size:1.1rem;">O(3<sup>n</sup>)</div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:2px;">Memoization</div><div style="font-size:0.75rem;">Compute once</div><div style="font-weight:700;color:var(--green);font-size:1.1rem;">O(21<sup>3</sup>)</div></div></div><strong>Recomputing already computed values is wasteful</strong>!' },
                { title: 'What if we try this?', content: 'Store the result of w(a,b,c) once computed, and return it directly on subsequent calls \u2014 this is <strong>memoization</strong>!<br><br>Store results in <code>dp[a][b][c]</code>. Since a, b, c range from 0 to 20, a <code>dp[21][21][21]</code> array is sufficient. Just add one line at the function start to check "already computed?" and you are done!<br><br><div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.85rem;"><div style="padding:6px 10px;border-radius:8px;background:var(--yellow);color:white;font-weight:600;">w(2,2,2) call</div><div>\u2192</div><div style="padding:6px 10px;border-radius:8px;background:var(--accent);color:white;">Store in dp</div><div>\u2192</div><div style="padding:6px 10px;border-radius:8px;background:var(--yellow);color:white;font-weight:600;">w(2,2,2) again</div><div>\u2192</div><div style="padding:6px 10px;border-radius:8px;background:var(--green);color:white;font-weight:600;">Return from dp!</div></div>' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python makes memoization easy with a dictionary. Use the <code>(a,b,c)</code> tuple as a key \u2014 no separate visited array needed:<br><code>if (a,b,c) in dp: return dp[(a,b,c)]</code></span><span class="lang-cpp">In C++, declare a 3D array <code>dp[21][21][21]</code> and <code>visited[21][21][21]</code>. If visited is true, return the dp value directly. Use <code>printf("w(%d, %d, %d) = %d\\n", ...)</code> for the output format.</span>' }
            ],
            inputLabel: 'Value of a',
            inputMin: -1, inputMax: 50, inputDefault: 1,
            solve(a) {
                var memo = {};
                function w(a, b, c) {
                    if (a <= 0 || b <= 0 || c <= 0) return 1;
                    if (a > 20 || b > 20 || c > 20) return w(20, 20, 20);
                    var key = a + ',' + b + ',' + c;
                    if (memo[key] !== undefined) return memo[key];
                    var res;
                    if (a < b && b < c) res = w(a, b, c-1) + w(a, b-1, c-1) - w(a, b-1, c);
                    else res = w(a-1, b, c) + w(a-1, b-1, c) + w(a-1, b, c-1) - w(a-1, b-1, c-1);
                    memo[key] = res;
                    return res;
                }
                return 'w(' + a + ', ' + a + ', ' + a + ') = ' + w(a, a, a);
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\n# 3D array or dictionary to store values\n# dp = [[[0]*21 for _ in range(21)] for _ in range(21)]\n\ndef w(a, b, c):\n    # Write your memoized function here\n    pass\n\nwhile True:\n    a, b, c = map(int, input().split())\n    if a == -1 and b == -1 and c == -1:\n        break\n    print(f"w({a}, {b}, {c}) = {w(a, b, c)}")\n',
                cpp: '#include <iostream>\nusing namespace std;\n\nint dp[21][21][21];\nbool visited[21][21][21];\n\nint w(int a, int b, int c) {\n    // Write your memoized function here\n    return 0;\n}\n\nint main() {\n    int a, b, c;\n    while (cin >> a >> b >> c) {\n        if (a == -1 && b == -1 && c == -1) break;\n        printf("w(%d, %d, %d) = %d\\n", a, b, c, w(a, b, c));\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Memoization (Top-Down DP)',
                description: 'Store computed results in a 3D array to eliminate redundant calls.',
                timeComplexity: 'O(21^3)',
                spaceComplexity: 'O(21^3)',
                codeSteps: {
                    python: [
                        { title: 'Initialize memo table', desc: 'Python uses a dictionary for memoization.\nUsing (a,b,c) tuple as key eliminates the need for a separate visited array.', code: 'import sys\ninput = sys.stdin.readline\n\ndp = {}' },
                        { title: 'Implement w function (memoized)', desc: 'Implement the conditions given in the problem,\nbut retrieve already computed values from dp to eliminate redundant calls.', code: 'def w(a, b, c):\n    if a <= 0 or b <= 0 or c <= 0:\n        return 1\n    if a > 20 or b > 20 or c > 20:\n        return w(20, 20, 20)\n    if (a, b, c) in dp:\n        return dp[(a, b, c)]\n    if a < b < c:\n        dp[(a,b,c)] = w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c)\n    else:\n        dp[(a,b,c)] = w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1)\n    return dp[(a,b,c)]' },
                        { title: 'I/O handling', desc: 'Read input repeatedly until -1 -1 -1.\nUse f-string to match the output format.', code: 'while True:\n    a, b, c = map(int, input().split())\n    if a == -1 and b == -1 and c == -1:\n        break\n    print(f"w({a}, {b}, {c}) = {w(a, b, c)}")' }
                    ],
                    cpp: [
                        { title: 'Initialize memo table', desc: 'C++ uses a 3D array + visited array for memoization', code: '#include <iostream>\nusing namespace std;\n\n// Only need to store range 0~20, so 21^3 size\nint dp[21][21][21];\nbool visited[21][21][21];' },
                        { title: 'Implement w function (memoized)', desc: 'Check the visited array to prevent redundant calls.\nBranch with if-else following the problem conditions.', code: 'int w(int a, int b, int c) {\n    if (a <= 0 || b <= 0 || c <= 0) return 1;\n    if (a > 20 || b > 20 || c > 20) return w(20, 20, 20);\n    // If already computed, return immediately\n    if (visited[a][b][c]) return dp[a][b][c];\n    visited[a][b][c] = true;\n    if (a < b && b < c)\n        dp[a][b][c] = w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c);\n    else\n        dp[a][b][c] = w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1);\n    return dp[a][b][c];\n}' },
                        { title: 'I/O handling', desc: 'C++ uses printf to match the output format', code: 'int main() {\n    int a, b, c;\n    while (cin >> a >> b >> c) {\n        if (a == -1 && b == -1 && c == -1) break;\n        printf("w(%d, %d, %d) = %d\\n", a, b, c, w(a, b, c));\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1463',
            title: 'BOJ 1463 - Make It 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1463',
            simIntro: 'See how the DP table finds the minimum operations to reduce 10 to 1.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>There are three operations available for integer X: if X is divisible by 3, divide by 3; if X is divisible by 2, divide by 2; subtract 1. Given integer N, find the minimum number of operations to reduce it to 1.</p>
    <h4>Input</h4>
    <p>The first line contains the integer N. (1 ≤ N ≤ 10<sup>6</sup>)</p>
    <h4>Output</h4>
    <p>Print the minimum number of operations on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>2</pre></div>
        <div><strong>Output</strong><pre>1</pre></div>
    </div></div>
    <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
        <div><strong>Input</strong><pre>10</pre></div>
        <div><strong>Output</strong><pre>3</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 10<sup>6</sup></li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'With three operations (\u00f73, \u00f72, -1), would a greedy approach of "divide by the largest possible number" be fast enough? For example, divide by 3 if possible, otherwise by 2, and subtract 1 if neither works.' },
                { title: 'But there\'s a problem with this', content: 'Think about 10.<br><div style="display:flex;flex-direction:column;gap:6px;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;"><span style="font-weight:600;color:var(--red);">Greedy:</span><span style="padding:3px 8px;border-radius:6px;background:var(--red);color:white;font-weight:600;">10</span><span>\u2192-1\u2192</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">5</span><span>\u2192-1\u2192</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">4</span><span>\u2192\u00f72\u2192</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">2</span><span>\u2192\u00f72\u2192</span><span style="padding:3px 8px;border-radius:6px;background:var(--red);color:white;">1</span><span style="font-weight:600;color:var(--red);">= 4 steps</span></div><div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;"><span style="font-weight:600;color:var(--green);">Optimal:</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">10</span><span>\u2192-1\u2192</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">9</span><span>\u2192\u00f73\u2192</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">3</span><span>\u2192\u00f73\u2192</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;">1</span><span style="font-weight:600;color:var(--green);">= 3 steps</span></div></div>Dividing by the largest number is not always best! Sometimes subtracting 1 to make it a multiple of 3 is better. We must consider all cases.' },
                { title: 'What if we try this?', content: 'Define <code>dp[i]</code> = minimum operations to reduce integer i to 1. dp[1] = 0 (already 1).<br><br>Try all three operations from i and pick the minimum:<br>- Subtract 1: <code>dp[i] = dp[i-1] + 1</code><br>- Divide by 2 (when possible): <code>dp[i] = min(dp[i], dp[i/2] + 1)</code><br>- Divide by 3 (when possible): <code>dp[i] = min(dp[i], dp[i/3] + 1)</code><br><br>Fill from i = 2 to N in order (Bottom-Up).' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Create a list <code>dp = [0] * (n + 1)</code> in Python and iterate with <code>range(2, n + 1)</code>. Use <code>//</code> for integer division.</span><span class="lang-cpp">In C++, since N can be up to 10<sup>6</sup>, declare a global array <code>int dp[1000001]</code>. Use <code>min()</code> from the <code>algorithm</code> header.</span>' }
            ],
            inputLabel: 'Integer N',
            inputMin: 1, inputMax: 1000000, inputDefault: 10,
            solve(n) {
                var dp = new Array(n + 1).fill(0);
                for (var i = 2; i <= n; i++) {
                    dp[i] = dp[i - 1] + 1;
                    if (i % 2 === 0) dp[i] = Math.min(dp[i], dp[i / 2] + 1);
                    if (i % 3 === 0) dp[i] = Math.min(dp[i], dp[i / 3] + 1);
                }
                return '' + dp[n];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# dp[i] = minimum operations to reduce i to 1\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[1000001];\n\nint main() {\n    int n;\n    cin >> n;\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Bottom-Up DP',
                description: 'Starting from dp[1]=0, fill dp[N] by taking the minimum of three operations.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input and DP array', desc: 'dp[i] = min operations to reduce i to 1.\ndp[1] = 0 (already 1, no operations needed).', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ndp = [0] * (n + 1)' },
                        { title: 'Fill DP table', desc: 'Try all three operations (-1, \u00f72, \u00f73) at each i\nand store the minimum. This is why DP, not greedy, is needed.', code: 'for i in range(2, n + 1):\n    dp[i] = dp[i-1] + 1\n    if i % 2 == 0:\n        dp[i] = min(dp[i], dp[i//2] + 1)\n    if i % 3 == 0:\n        dp[i] = min(dp[i], dp[i//3] + 1)' },
                        { title: 'Output Result', desc: 'dp[n] is the minimum number of operations to reduce N to 1.', code: 'print(dp[n])' }
                    ],
                    cpp: [
                        { title: 'Input and DP array', desc: 'Use a global array since N can be up to 10^6', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\n// N up to 10^6 -> declare as global array\nint dp[1000001];\n\nint main() {\n    int n;\n    cin >> n;' },
                        { title: 'Fill DP table', desc: 'Subtract 1 as default, divide by 2 / divide by 3 only when possible.\nMust try all three operations to guarantee the optimal solution.', code: '    for (int i = 2; i <= n; i++) {\n        dp[i] = dp[i-1] + 1;          // subtract 1\n        if (i % 2 == 0)\n            dp[i] = min(dp[i], dp[i/2] + 1);  // divide by 2\n        if (i % 3 == 0)\n            dp[i] = min(dp[i], dp[i/3] + 1);  // divide by 3\n    }' },
                        { title: 'Output Result', desc: 'dp[n] is the minimum number of operations to reduce N to 1.', code: '    cout << dp[n] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-1904',
            title: 'BOJ 1904 - 01 Tile',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1904',
            simIntro: 'See how the 01 Tile problem has the same structure as Fibonacci by filling the dp array.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>A binary sequence is given. This sequence consists of 0s and 1s. Using "00" tiles and "1" tiles, output the number of ways to create a sequence of length N, modulo 15746.</p>
    <h4>Input</h4>
    <p>The first line contains the natural number N. (1 ≤ N ≤ 1,000,000)</p>
    <h4>Output</h4>
    <p>Print the number of all binary sequences of length N that Jiwon can create, modulo 15746, on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>4</pre></div>
        <div><strong>Output</strong><pre>5</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 1,000,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'The available tiles are "1" (length 1) and "00" (length 2). We need to build a sequence of length N... should we try all combinations? From using N tiles of length 1, to using as many "00" tiles as possible.' },
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>1,000,000</strong>! Trying to count all combinations means an enormous number of cases. But wait, what if we focus on the <strong>last tile placed</strong>?<br><br><div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:8px 12px;"><div style="font-weight:600;color:var(--accent);margin-bottom:4px;">Last = "1"</div><div style="display:flex;gap:3px;align-items:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--text);">N-1</span><span style="padding:3px 8px;border-radius:4px;background:var(--accent);color:white;font-weight:600;">1</span></div><div style="font-size:0.75rem;margin-top:3px;">= dp[N-1] ways</div></div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:8px 12px;"><div style="font-weight:600;color:var(--green);margin-bottom:4px;">Last = "00"</div><div style="display:flex;gap:3px;align-items:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--text);">N-2</span><span style="padding:3px 8px;border-radius:4px;background:var(--green);color:white;font-weight:600;">00</span></div><div style="font-size:0.75rem;margin-top:3px;">= dp[N-2] ways</div></div></div>Does this look familiar? <code>dp[N] = dp[N-1] + dp[N-2]</code> -- Fibonacci!' },
                { title: 'What if we try this?', content: 'This is exactly the <strong>Fibonacci</strong> structure!<br><br>Define <code>dp[i]</code> = number of sequences of length i:<br><code>dp[i] = dp[i-1] + dp[i-2]</code><br><br><div style="display:flex;gap:4px;align-items:flex-end;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;"><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[1]</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">1</div></div><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[2]</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">2</div></div><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[3]</div><div style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;font-weight:600;">3</div></div><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[4]</div><div style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;font-weight:600;">5</div></div><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[5]</div><div style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;font-weight:600;">8</div></div></div>Initial values: dp[1] = 1 (just "1"), dp[2] = 2 ("11", "00")<br><br>Do not forget to take <strong>modulo 15746</strong> at every step! Without it, the numbers grow astronomically.' },
                { title: 'In Python/C++!', content: 'With N up to 1 million, you could use an array, but since only the last two values are needed, you can do it in <strong>O(1) space with just 2 variables</strong>.<br><span class="lang-py">Start with <code>a, b = 1, 2</code> and repeat <code>a, b = b, (a + b) % 15746</code>.</span><span class="lang-cpp">Start with <code>int a = 1, b = 2;</code> and repeat <code>int t = (a + b) % 15746; a = b; b = t;</code>.</span>' }
            ],
            inputLabel: 'Length N',
            inputMin: 1, inputMax: 1000000, inputDefault: 4,
            solve(n) {
                if (n === 1) return '1';
                var a = 1, b = 2;
                for (var i = 3; i <= n; i++) { var t = (a + b) % 15746; a = b; b = t; }
                return '' + b;
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# dp[i] = number of binary sequences of length i\n# Write your solution here\n',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Fibonacci (Bottom-Up)',
                description: 'dp[i] = dp[i-1] + dp[i-2] (mod 15746). Same recurrence as Fibonacci.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Use fast input since N can be up to 1 million.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())' },
                        { title: 'DP computation', desc: 'Same structure as Fibonacci: dp[i] = dp[i-1] + dp[i-2].\nSpace O(1) optimization with 2 variables, MOD at every step.', code: 'if n == 1:\n    print(1)\nelse:\n    a, b = 1, 2\n    for i in range(3, n + 1):\n        a, b = b, (a + b) % 15746' },
                        { title: 'Output', desc: 'b holds the value of dp[n].', code: '    print(b)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Read N.', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;' },
                        { title: 'DP computation', desc: 'Space optimization with 2 variables, MOD at every step', code: '    if (n == 1) {\n        cout << 1 << endl;\n        return 0;\n    }\n    // Fibonacci with 2 variables (space O(1))\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int t = (a + b) % 15746;\n        a = b;\n        b = t;\n    }' },
                        { title: 'Output', desc: 'b holds the result of dp[n].', code: '    cout << b << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[3].templates; }
            }]
        },

        // ========== Stage 2: 1D DP Advanced ==========
        {
            id: 'boj-2579',
            title: 'BOJ 2579 - Climbing Stairs',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2579',
            simIntro: 'See how DP finds the optimal path under the no-3-consecutive constraint.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>The stair climbing game goes from the starting point below the stairs to the destination at the top. Stepping on a stair earns the score written on it. You cannot step on three consecutive stairs. You must step on the last stair. Find the maximum total score.</p>
    <h4>Input</h4>
    <p>The first line contains the number of stairs. From the second line, one score per line is given in order starting from the bottom stair. The number of stairs is a natural number ≤ 300, and each score is a natural number ≤ 10,000.</p>
    <h4>Output</h4>
    <p>Print the maximum total score obtainable in the stair climbing game on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>6
10
20
15
25
10
20</pre></div>
        <div><strong>Output</strong><pre>75</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 300</li><li>Each stair score \u2264 10,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'With only 6 stairs, should we try all combinations of steps? Pick only those satisfying "no 3 consecutive" + "must step on last" and find the maximum sum. For example, stepping on stairs 1,2,4,6 or 1,3,5,6... and so on.' },
                { title: 'But there\'s a problem with this', content: 'With N up to 300, the combinations explode -- brute force is impossible. Instead, when stepping on stair i, there are only <strong>two cases</strong>:<br><br><div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--accent);margin-bottom:4px;">Case 1: 2-step jump</div><div style="display:flex;gap:3px;align-items:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--accent);color:white;">i-2</span><span style="color:var(--text3);">···</span><span style="padding:3px 8px;border-radius:4px;background:var(--yellow);color:white;font-weight:600;">i</span></div></div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:4px;">Case 2: 1+1 steps</div><div style="display:flex;gap:3px;align-items:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--green);color:white;">i-1</span><span style="padding:3px 8px;border-radius:4px;background:var(--yellow);color:white;font-weight:600;">i</span></div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i-2 must be skipped!</div></div></div>' },
                { title: 'What if we try this?', content: 'Define <code>dp[i]</code> = max score when stepping on stair i:<br><br><div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:8px 12px;"><div style="font-weight:600;color:var(--accent);margin-bottom:4px;">Case 1: 2-step jump</div><div style="display:flex;gap:4px;align-items:center;"><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">i-2</span><span style="color:var(--text3);">\u00b7\u00b7\u00b7</span><span style="padding:3px 8px;border-radius:6px;background:var(--yellow);color:white;">i</span></div><div style="margin-top:4px;font-size:0.8rem;"><code>dp[i-2] + s[i]</code></div></div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:8px 12px;"><div style="font-weight:600;color:var(--green);margin-bottom:4px;">Case 2: 1+1 steps</div><div style="display:flex;gap:4px;align-items:center;"><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;">i-3</span><span style="color:var(--text3);">\u00b7</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;">i-1</span><span style="padding:3px 8px;border-radius:6px;background:var(--yellow);color:white;">i</span></div><div style="margin-top:4px;font-size:0.8rem;"><code>dp[i-3] + s[i-1] + s[i]</code></div></div></div><code>dp[i] = max(Case 1, Case 2)</code><br><br>Just manually fill 3 initial values:<br>dp[1] = score[1], dp[2] = score[1]+score[2], dp[3] = max(score[1], score[2])+score[3]' },
                { title: 'In Python/C++!', content: '1-indexed implementation aligns perfectly with the recurrence.<br><span class="lang-py"><code>scores = [0] + [int(input()) for _ in range(n)]</code> pads index 0 so indices stay clean.</span><span class="lang-cpp">Declare <code>int score[301], dp[301];</code> globally and read input starting from index 1. Use <code>max()</code> from <code>&lt;algorithm&gt;</code>.</span>' }
            ],
            inputLabel: 'Number of stairs N',
            inputMin: 1, inputMax: 300, inputDefault: 6,
            solve(n) {
                var scores = [0, 10, 20, 15, 25, 10, 20];
                if (n > scores.length - 1) return '(test input out of range)';
                var dp = new Array(n + 1).fill(0);
                dp[1] = scores[1];
                if (n >= 2) dp[2] = scores[1] + scores[2];
                if (n >= 3) dp[3] = Math.max(scores[1], scores[2]) + scores[3];
                for (var i = 4; i <= n; i++) {
                    dp[i] = Math.max(dp[i-2] + scores[i], dp[i-3] + scores[i-1] + scores[i]);
                }
                return '' + dp[n];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nscores = [0] + [int(input()) for _ in range(n)]\n\n# dp[i] = max score when stepping on stair i\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint score[301], dp[301];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> score[i];\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Bottom-Up DP',
                description: 'At each stair, choose the max between a 2-step jump vs 1+1 step.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: '1-indexed: pad scores[0]=0 to align indices.\nRead each stair score line by line.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nscores = [0] + [int(input()) for _ in range(n)]\ndp = [0] * (n + 1)' },
                        { title: 'Initial values and DP', desc: 'No 3 consecutive \u2192 only two cases:\n1) 2-step jump from i-2, 2) i-3\u2192i-1\u2192i (1+1 step).\nSet 3 initial values manually, then apply recurrence from i=4.', code: 'dp[1] = scores[1]\nif n >= 2: dp[2] = scores[1] + scores[2]\nif n >= 3: dp[3] = max(scores[1], scores[2]) + scores[3]\nfor i in range(4, n + 1):\n    dp[i] = max(dp[i-2] + scores[i], dp[i-3] + scores[i-1] + scores[i])' },
                        { title: 'Output', desc: 'dp[n] is the maximum score when stepping on the last stair.', code: 'print(dp[n])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'N is at most 300, so a global array is sufficient.\nRead with 1-indexed.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint score[301], dp[301];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> score[i];' },
                        { title: 'Initial values and DP', desc: 'Set 3 initial values, then apply recurrence from i=4.\nChoose max between 2-step jump vs 1+1 step (skip i-2).', code: '    dp[1] = score[1];\n    if (n >= 2) dp[2] = score[1] + score[2];\n    if (n >= 3) dp[3] = max(score[1], score[2]) + score[3];\n    for (int i = 4; i <= n; i++) {\n        // 2-step jump vs 1+1 step (skip i-2)\n        dp[i] = max(dp[i-2] + score[i],\n                    dp[i-3] + score[i-1] + score[i]);\n    }' },
                        { title: 'Output', desc: 'dp[n] is the maximum score up to the last stair.', code: '    cout << dp[n] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-2156',
            title: 'BOJ 2156 - Wine Tasting',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2156',
            simIntro: 'See how DP works with the added "skip" option, unlike the Climbing Stairs problem.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Wine glasses are lined up in a row, and you want to drink wine following these rules. When you select a glass, you must drink all the wine in it, then put it back in its original position. You cannot drink from 3 consecutive glasses. Find the maximum amount of wine you can drink.</p>
    <h4>Input</h4>
    <p>The first line contains the number of wine glasses n. (1 ≤ n ≤ 10,000) From the second line to the (n+1)-th line, the amount of wine in each glass is given in order. The wine amount is a non-negative integer ≤ 1,000.</p>
    <h4>Output</h4>
    <p>Print the maximum amount of wine that can be consumed on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>6
6
10
13
9
8
1</pre></div>
        <div><strong>Output</strong><pre>33</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ n ≤ 10,000</li><li>0 \u2264 wine amount \u2264 1,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'This looks similar to "Climbing Stairs"! The no-3-consecutive condition is the same, so cannot we solve it the same way? Set dp[i] = max amount up to the i-th glass, and look at two cases just like Climbing Stairs...' },
                { title: 'But there\'s a problem with this', content: 'Wait, there is a <strong>critical difference</strong> from Climbing Stairs!<br><br><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--accent);margin-bottom:3px;">Climbing Stairs</div><div style="font-size:0.75rem;"><strong>Must</strong> step on last stair</div><div style="font-size:0.75rem;color:var(--text3);">→ 2 cases</div></div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">Wine Tasting</div><div style="font-size:0.75rem;"><strong>Can skip</strong> glass i</div><div style="font-size:0.75rem;color:var(--text3);">→ 3 cases</div></div></div>Because of this, the "skip glass i" case is added. Using the Climbing Stairs recurrence as-is will miss this case and give wrong answers!' },
                { title: 'What if we try this?', content: 'Define <code>dp[i]</code> = max amount when <strong>considering</strong> glasses 1 through i (you may or may not drink glass i!). This gives 3 cases:<br><br><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="border:1.5px solid var(--text3);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;margin-bottom:3px;">Case 1: Skip</div><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);color:var(--text3);">i</span><div style="margin-top:3px;"><code>dp[i-1]</code></div></div><div style="border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;margin-bottom:3px;">Case 2: One</div><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);color:var(--text3);">i-1</span> <span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">i</span><div style="margin-top:3px;"><code>dp[i-2]+w[i]</code></div></div><div style="border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;margin-bottom:3px;">Case 3: Two</div><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;">i-1</span> <span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;">i</span><div style="margin-top:3px;"><code>dp[i-3]+w[i-1]+w[i]</code></div></div></div><code>dp[i] = max(Case 1, Case 2, Case 3)</code><br><br>Compared to Climbing Stairs, Case 1 (skip) is the added case!' },
                { title: 'In Python/C++!', content: '<span class="lang-py"><code>dp[i] = max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i])</code> fits cleanly in one line. Be careful with initial values to avoid index errors when n is 1 or 2.</span><span class="lang-cpp">Use an initializer list: <code>max({dp[i-1], dp[i-2]+wine[i], dp[i-3]+wine[i-1]+wine[i]})</code> to compare all 3. Requires the <code>&lt;algorithm&gt;</code> header.</span>' }
            ],
            inputLabel: 'Number of glasses n',
            inputMin: 1, inputMax: 10000, inputDefault: 6,
            solve(n) {
                var wine = [0, 6, 10, 13, 9, 8, 1];
                if (n > wine.length - 1) return '(test input out of range)';
                var dp = new Array(n + 1).fill(0);
                dp[1] = wine[1];
                if (n >= 2) dp[2] = wine[1] + wine[2];
                for (var i = 3; i <= n; i++) {
                    dp[i] = Math.max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i]);
                }
                return '' + dp[n];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwine = [0] + [int(input()) for _ in range(n)]\n\n# dp[i] = max wine amount considering glasses 1..i\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint wine[10001], dp[10001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> wine[i];\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Bottom-Up DP (3 cases)',
                description: 'Choose the max among: skip / drink only current / drink 2 consecutive.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: '1-indexed with wine[0]=0 padding.\nRead each glass wine amount line by line.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwine = [0] + [int(input()) for _ in range(n)]\ndp = [0] * (n + 1)' },
                        { title: 'Fill DP', desc: 'Unlike Climbing Stairs, "skip" (dp[i-1]) case is added.\n3 cases: 1) skip 2) drink only i 3) drink i-1 and i consecutive.\nThe key difference is that glass i does not have to be included.', code: 'dp[1] = wine[1]\nif n >= 2: dp[2] = wine[1] + wine[2]\nfor i in range(3, n + 1):\n    dp[i] = max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i])' },
                        { title: 'Output', desc: 'dp[n] is the maximum amount of wine that can be consumed.', code: 'print(dp[n])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Use global array since N can be up to 10,000.\nRead with 1-indexed.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint wine[10001], dp[10001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> wine[i];' },
                        { title: 'Fill DP', desc: 'Compare 3 values with max({...}) initializer list.\nChoose max among skip / only current / 2 consecutive.', code: '    dp[1] = wine[1];\n    if (n >= 2) dp[2] = wine[1] + wine[2];\n    for (int i = 3; i <= n; i++) {\n        // 3 cases: skip / drink 1 / drink 2 consecutive\n        dp[i] = max({dp[i-1],\n                     dp[i-2] + wine[i],\n                     dp[i-3] + wine[i-1] + wine[i]});\n    }' },
                        { title: 'Output', desc: 'dp[n] is the maximum wine amount.', code: '    cout << dp[n] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-1912',
            title: 'BOJ 1912 - Contiguous Sum',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1912',
            simIntro: 'See step by step how Kadane\'s algorithm tracks the maximum contiguous sum.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Given a sequence of n integers, find the largest sum obtainable by selecting some consecutive numbers. At least one number must be selected.</p>
    <h4>Input</h4>
    <p>The first line contains the integer n (1 ≤ n ≤ 100,000), and the second line contains a sequence of n integers. Each number is an integer ≥ -1,000 and ≤ 1,000.</p>
    <h4>Output</h4>
    <p>Print the answer on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>10
10 -4 3 1 5 6 -35 12 21 -1</pre></div>
        <div><strong>Output</strong><pre>33</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ n ≤ 100,000</li><li>-1,000 \u2264 each number \u2264 1,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'We need to find the maximum sum of consecutive numbers... how about trying all possible intervals (i, j)? Fix a starting point i and ending point j, compute the sum in between, and find the maximum. A double for loop to search all intervals should work.' },
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>100,000</strong>! A double for loop is O(N<sup>2</sup>) = 10 billion operations -- way too slow.<br><br><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><div style="text-align:center;"><div style="font-size:0.8rem;font-weight:600;color:var(--red);">Double loop</div><div style="font-size:1.1rem;font-weight:700;color:var(--red);">O(N<sup>2</sup>)</div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-size:0.8rem;font-weight:600;color:var(--green);">Kadane\'s</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">O(N)</div></div></div>At each position, decide: "Is the running sum positive or negative?" If negative, <strong>start fresh</strong>. If positive, <strong>extend</strong>!' },
                { title: 'What if we try this?', content: 'Define <code>dp[i]</code> = maximum contiguous sum <strong>ending at</strong> element i:<br><br><code>dp[i] = max(dp[i-1] + a[i], a[i])</code><br><br>- <code>dp[i-1] + a[i]</code>: extend the previous contiguous sum<br>- <code>a[i]</code>: start fresh from here<br><br>The final answer is <code>max(dp[0], dp[1], ..., dp[n-1])</code>. This is exactly <strong>Kadane\'s Algorithm</strong>. It finishes in O(N)!' },
                { title: 'In Python/C++!', content: 'You do not even need an array! Two variables are enough.<br><span class="lang-py">Start with <code>cur = a[0]</code>, <code>ans = a[0]</code> then<br><code>cur = max(cur + a[i], a[i])</code><br><code>ans = max(ans, cur)</code><br>Even all-negative cases are handled automatically (the largest negative becomes the answer).</span><span class="lang-cpp">Same logic: start with <code>int cur = a[0], ans = a[0];</code>. Use <code>max()</code> from <code>&lt;algorithm&gt;</code>.</span>' }
            ],
            inputLabel: 'Value of n',
            inputMin: 1, inputMax: 100000, inputDefault: 10,
            solve(n) {
                var arr = [10, -4, 3, 1, 5, 6, -35, 12, 21, -1];
                if (n > arr.length) return '(test input out of range)';
                var cur = arr[0], ans = arr[0];
                for (var i = 1; i < n; i++) {
                    cur = Math.max(cur + arr[i], arr[i]);
                    ans = Math.max(ans, cur);
                }
                return '' + ans;
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\n\n# dp[i] = max contiguous sum ending at element i\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Kadane\'s Algorithm',
                description: 'Choose max between extending vs starting fresh, while tracking the global maximum.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read n integers on a single line.\nNote that numbers can be negative.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))' },
                        { title: 'Kadane\'s Algorithm', desc: 'Key: choose the larger between "extend" vs "start fresh".\ncur = max contiguous sum ending here, ans = global maximum.\nSolved in O(1) space with just 2 variables, no array needed.', code: 'cur = a[0]\nans = a[0]\nfor i in range(1, n):\n    cur = max(cur + a[i], a[i])\n    ans = max(ans, cur)' },
                        { title: 'Output', desc: 'ans is the maximum contiguous sum.', code: 'print(ans)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'N is at most 100K, so a local array works.\nRead with 0-indexed.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int a[100001];\n    for (int i = 0; i < n; i++) cin >> a[i];' },
                        { title: 'Kadane\'s Algorithm', desc: 'Choose max between extend (cur+a[i]) vs start fresh (a[i]).\nTrack the global maximum with ans. O(N) time, O(1) space.', code: '    // choose max between extend vs start fresh\n    int cur = a[0], ans = a[0];\n    for (int i = 1; i < n; i++) {\n        cur = max(cur + a[i], a[i]);\n        ans = max(ans, cur);\n    }' },
                        { title: 'Output', desc: 'ans is the maximum contiguous sum.', code: '    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[6].templates; }
            }]
        },
        {
            id: 'boj-10844',
            title: 'BOJ 10844 - Easy Staircase Number',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10844',
            simIntro: 'See how 2D DP works through digit-by-digit transitions.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Consider the number 45656. Every pair of adjacent digits differs by exactly 1. Such numbers are called staircase numbers. Given N, find how many staircase numbers of length N exist. Numbers starting with 0 are not staircase numbers. Print the answer modulo 1,000,000,000.</p>
    <h4>Input</h4>
    <p>The first line contains N. N is a natural number between 1 and 100 inclusive.</p>
    <h4>Output</h4>
    <p>Print the answer modulo 1,000,000,000 on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>1</pre></div>
        <div><strong>Output</strong><pre>9</pre></div>
    </div></div>
    <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
        <div><strong>Input</strong><pre>2</pre></div>
        <div><strong>Output</strong><pre>17</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 100</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'We need to count staircase numbers where "adjacent digits differ by 1". Should we generate all numbers of length N one by one and check the condition? For example, if N=2, generate 12, 21, 23, 32, ... and check if each is a staircase number.' },
                { title: 'But there\'s a problem with this', content: 'If N is up to 100, there can be up to 10<sup>100</sup> numbers! Generating them all is obviously impossible.<br><br>But the next digit of a staircase number <strong>depends only on the last digit</strong>.<br><br><div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><span style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">...3</span><span style="font-size:1.2rem;color:var(--text3);">→</span><span style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;">2</span><span style="color:var(--text3);">or</span><span style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;">4</span><span style="color:var(--text3);font-size:0.8rem;">(only ±1)</span></div>So what if we <strong>track the last digit as our state</strong>?' },
                { title: 'What if we try this?', content: 'Define <code>dp[i][j]</code> = count of staircase numbers of length i ending with digit j!<br><br>Transition rules:<br>- j = 0: only 1 can precede \u2192 <code>dp[i][0] = dp[i-1][1]</code><br>- j = 9: only 8 can precede \u2192 <code>dp[i][9] = dp[i-1][8]</code><br>- 1\u20138: <code>dp[i][j] = dp[i-1][j-1] + dp[i-1][j+1]</code><br><br>Initial values: dp[1][1\u20139] = 1 (numbers starting with 0 are not staircase numbers!)<br>Answer: <code>dp[N][0] + dp[N][1] + ... + dp[N][9]</code>' },
                { title: 'In Python/C++!', content: 'The answer gets very large, so take <code>% 1,000,000,000</code> at every computation.<br><span class="lang-py">Create a 2D list with <code>dp = [[0]*10 for _ in range(n+1)]</code> and output <code>sum(dp[n]) % MOD</code> at the end.</span><span class="lang-cpp">Use <code>long long dp[101][10]</code>. Using <code>int</code> for summation may cause overflow!</span>' }
            ],
            inputLabel: 'Length N',
            inputMin: 1, inputMax: 100, inputDefault: 1,
            solve(n) {
                var MOD = 1000000000;
                var dp = [];
                for (var i = 0; i <= n; i++) { dp[i] = []; for (var j = 0; j <= 9; j++) dp[i][j] = 0; }
                for (var j = 1; j <= 9; j++) dp[1][j] = 1;
                for (var i = 2; i <= n; i++) {
                    dp[i][0] = dp[i-1][1];
                    dp[i][9] = dp[i-1][8];
                    for (var j = 1; j <= 8; j++) dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD;
                }
                var ans = 0;
                for (var j = 0; j <= 9; j++) ans = (ans + dp[n][j]) % MOD;
                return '' + ans;
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nMOD = 1_000_000_000\n\n# dp[i][j] = count of staircase numbers of length i ending with digit j\n# Write your solution here\n',
                cpp: '#include <iostream>\nusing namespace std;\n\nconst int MOD = 1000000000;\nlong long dp[101][10];\n\nint main() {\n    int n;\n    cin >> n;\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '2D DP (digit transition)',
                description: 'Handle boundary cases for digits 0 and 9 carefully during transitions.',
                timeComplexity: 'O(10N)',
                spaceComplexity: 'O(10N)',
                codeSteps: {
                    python: [
                        { title: 'Input and initialization', desc: 'dp[i][j] = count of staircase numbers of length i ending with j.\nNumbers starting with 0 are excluded, so dp[1][0]=0.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nMOD = 1_000_000_000\ndp = [[0]*10 for _ in range(n+1)]\nfor j in range(1, 10):\n    dp[1][j] = 1' },
                        { title: 'DP transition', desc: 'Digit 0 can only come from 1, digit 9 only from 8.\nOther digits j transition from j-1 or j+1. MOD at every step.', code: 'for i in range(2, n+1):\n    dp[i][0] = dp[i-1][1]\n    dp[i][9] = dp[i-1][8]\n    for j in range(1, 9):\n        dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD' },
                        { title: 'Sum and output', desc: 'All staircase numbers of length N = dp[N][0] + dp[N][1] + ... + dp[N][9].', code: 'print(sum(dp[n]) % MOD)' }
                    ],
                    cpp: [
                        { title: 'Input and initialization', desc: 'Use long long: sum may exceed int range', code: '#include <iostream>\nusing namespace std;\n\nconst int MOD = 1000000000;\n// long long: prevent int overflow during summation\nlong long dp[101][10];\n\nint main() {\n    int n;\n    cin >> n;\n    // numbers starting with 0 are not staircase numbers\n    for (int j = 1; j <= 9; j++) dp[1][j] = 1;' },
                        { title: 'DP transition', desc: 'Boundary cases: after 0 only 1, after 9 only 8.\nOther digits receive transitions from both neighbors.', code: '    for (int i = 2; i <= n; i++) {\n        dp[i][0] = dp[i-1][1];           // after 0, only 1 is possible\n        dp[i][9] = dp[i-1][8];           // after 9, only 8 is possible\n        for (int j = 1; j <= 8; j++)\n            dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD;\n    }' },
                        { title: 'Sum and output', desc: 'Sum counts for all ending digits 0~9.\nUse long long to prevent overflow during summation.', code: '    long long ans = 0;\n    for (int j = 0; j <= 9; j++)\n        ans = (ans + dp[n][j]) % MOD;\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[7].templates; }
            }]
        },

        // ========== Stage 3: 2D DP ==========
        {
            id: 'boj-1149',
            title: 'BOJ 1149 - RGB Street',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1149',
            simIntro: 'See how 2D DP selects the minimum cost under the neighbor-color constraint.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>There are N houses on RGB Street. The street is a line segment with houses 1 through N in order. Each house must be painted one of red, green, or blue. Adjacent houses cannot be the same color. Given the cost of painting each house red, green, or blue, find the minimum total cost of painting all houses.</p>
    <h4>Input</h4>
    <p>The first line contains the number of houses N (2 ≤ N ≤ 1,000). From the second line, N lines each contain the cost of painting each house red, green, and blue, one house per line starting from house 1. The painting cost is a natural number ≤ 1,000.</p>
    <h4>Output</h4>
    <p>Print the minimum cost of painting all houses on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>3
26 40 83
49 60 57
13 89 99</pre></div>
        <div><strong>Output</strong><pre>96</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>2 ≤ N ≤ 1,000</li><li>1 \u2264 cost \u2264 1,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'Since each house is painted one of R, G, B, should we try all combinations? N houses with 3 colors means 3<sup>N</sup> cases to check \u2014 find the one satisfying "no same color neighbors" with minimum cost.' },
                { title: 'But there\'s a problem with this', content: 'If N is up to 1000, 3<sup>1000</sup>... that would take longer than the age of the universe!<br><br><div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;"><div style="font-weight:600;color:var(--red);">Brute force</div><div style="font-size:1.1rem;font-weight:700;color:var(--red);">3<sup>1000</sup></div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-weight:600;color:var(--green);">DP</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">N × 3</div></div></div>When choosing the color of house i, only <strong>house i-1\'s color</strong> matters. Just remember "the last color painted"!' },
                { title: 'What if we try this?', content: 'Define <code>dp[i][c]</code> = minimum total cost when painting house i with color c (R=0, G=1, B=2)<br><br>Since adjacent colors must differ:<br>- Red: <code>dp[i][0] = min(dp[i-1][1], dp[i-1][2]) + cost[i][0]</code><br>- Green: <code>dp[i][1] = min(dp[i-1][0], dp[i-1][2]) + cost[i][1]</code><br>- Blue: <code>dp[i][2] = min(dp[i-1][0], dp[i-1][1]) + cost[i][2]</code><br><br>Answer: <code>min(dp[N][0], dp[N][1], dp[N][2])</code>' },
                { title: 'In Python/C++!', content: 'Since we only reference the previous row, space optimization with <strong>a single 1D array</strong> is sufficient!<br><span class="lang-py">Start with <code>dp = list(cost[0])</code>, and for each house create <code>ndp</code> and swap it in. Use <code>min(dp)</code> for the final answer.</span><span class="lang-cpp">Declare <code>int dp[1001][3]</code> globally, or optimize with two 1D arrays. Output with <code>min({dp[n-1][0], dp[n-1][1], dp[n-1][2]})</code>.</span>' }
            ],
            inputLabel: 'Number of houses N',
            inputMin: 2, inputMax: 1000, inputDefault: 3,
            solve(n) {
                var costs = [[26,40,83],[49,60,57],[13,89,99]];
                if (n > costs.length) return '(test input out of range)';
                var dp = [costs[0][0], costs[0][1], costs[0][2]];
                for (var i = 1; i < n; i++) {
                    var ndp = [
                        Math.min(dp[1], dp[2]) + costs[i][0],
                        Math.min(dp[0], dp[2]) + costs[i][1],
                        Math.min(dp[0], dp[1]) + costs[i][2]
                    ];
                    dp = ndp;
                }
                return '' + Math.min(dp[0], dp[1], dp[2]);
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncost = [list(map(int, input().split())) for _ in range(n)]\n\n# dp[i][c] = min cost when painting house i with color c\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint cost[1001][3], dp[1001][3];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> cost[i][0] >> cost[i][1] >> cost[i][2];\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '2D DP (color selection)',
                description: 'For each house, select min cost of a different color from the previous house + current cost.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read R, G, B costs for N houses into a 2D list.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncost = [list(map(int, input().split())) for _ in range(n)]' },
                        { title: 'DP computation', desc: 'Space optimization with 1D array since only previous row is referenced.\nFor each color, min cost of different color from prev house + current cost.', code: 'dp = list(cost[0])\nfor i in range(1, n):\n    ndp = [\n        min(dp[1], dp[2]) + cost[i][0],\n        min(dp[0], dp[2]) + cost[i][1],\n        min(dp[0], dp[1]) + cost[i][2]\n    ]\n    dp = ndp' },
                        { title: 'Output', desc: 'The answer is the minimum among R, G, B costs for the last house.', code: 'print(min(dp))' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Use a global 2D array since N is at most 1000.\nRead R, G, B costs for each house.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint cost[1001][3], dp[1001][3];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> cost[i][0] >> cost[i][1] >> cost[i][2];' },
                        { title: 'DP computation', desc: 'Adjacent houses cannot be same color \u2192 choose min of the other 2 colors.\nInitialize the first house with its costs directly.', code: '    // initialize first house\n    for (int c = 0; c < 3; c++) dp[0][c] = cost[0][c];\n    for (int i = 1; i < n; i++) {\n        // adjacent house must differ -> choose min of other 2 colors\n        dp[i][0] = min(dp[i-1][1], dp[i-1][2]) + cost[i][0];\n        dp[i][1] = min(dp[i-1][0], dp[i-1][2]) + cost[i][1];\n        dp[i][2] = min(dp[i-1][0], dp[i-1][1]) + cost[i][2];\n    }' },
                        { title: 'Output', desc: 'Output the minimum of 3 colors using min({...}) initializer list.', code: '    cout << min({dp[n-1][0], dp[n-1][1], dp[n-1][2]}) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[8].templates; }
            }]
        },
        {
            id: 'boj-1932',
            title: 'BOJ 1932 - Integer Triangle',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1932',
            simIntro: 'See the process of finding the maximum path sum by going bottom-up through the triangle.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Moving from the top of an integer triangle downward, only moving diagonally left or right, find the path that maximizes the sum of selected numbers.</p>
    <h4>Input</h4>
    <p>The first line contains the size of the triangle n (1 ≤ n ≤ 500), and from the second line to the (n+1)-th line, the integer triangle is given.</p>
    <h4>Output</h4>
    <p>Print the maximum sum of numbers along the path on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>5
7
3 8
8 1 0
2 7 4 4
4 5 2 6 5</pre></div>
        <div><strong>Output</strong><pre>30</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ n ≤ 500</li><li>0 \u2264 number \u2264 9,999</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'Should we explore all paths from top to bottom? At each level we move diagonally left or right, so if the depth is n, there are 2<sup>n-1</sup> paths. Compute the sum of each path and find the maximum.' },
                { title: 'But there\'s a problem with this', content: 'If n is up to 500, that means 2<sup>499</sup> paths... impossible!<br><br>But each cell (i, j) can only come from <strong>two places</strong>:<br><br><div style="text-align:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="display:flex;gap:20px;justify-content:center;align-items:end;"><div style="text-align:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--accent);color:white;">i-1,j-1</span><div style="font-size:0.7rem;color:var(--text3);">upper-left</div></div><div style="text-align:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--accent);color:white;">i-1,j</span><div style="font-size:0.7rem;color:var(--text3);">directly above</div></div></div><div style="font-size:1.2rem;color:var(--text3);">↘ ↙</div><div><span style="padding:4px 10px;border-radius:6px;background:var(--yellow);color:white;font-weight:600;">i, j</span></div></div>If you know the max sum up to the previous cells, you can compute the current cell immediately!' },
                { title: 'What if we try this?', content: 'You could solve top\u2192down, but going <strong>bottom\u2192up</strong> is simpler!<br><br>Starting from the bottom row, add the larger of the two children below to each cell:<br><code>tri[i][j] += max(tri[i+1][j], tri[i+1][j+1])</code><br><br>This eliminates boundary handling, and the final answer collects neatly in <code>tri[0][0]</code>!' },
                { title: 'In Python/C++!', content: 'Modify the triangle array in-place and no extra memory is needed.<br><span class="lang-py">Use <code>for i in range(n-2, -1, -1):</code> to go bottom-up. Read input as <code>tri = [list(map(int, input().split())) for _ in range(n)]</code> into a 2D list.</span><span class="lang-cpp">Use <code>for (int i = n-2; i &gt;= 0; i--)</code> to iterate in reverse. Accumulate directly in a global array <code>int tri[501][501]</code>.</span>' }
            ],
            inputLabel: 'Triangle size n',
            inputMin: 1, inputMax: 500, inputDefault: 5,
            solve(n) {
                var tri = [[7],[3,8],[8,1,0],[2,7,4,4],[4,5,2,6,5]];
                if (n > tri.length) return '(test input out of range)';
                var dp = tri.map(function(row) { return row.slice(); });
                for (var i = n - 2; i >= 0; i--) {
                    for (var j = 0; j <= i; j++) {
                        dp[i][j] += Math.max(dp[i+1][j], dp[i+1][j+1]);
                    }
                }
                return '' + dp[0][0];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ntri = [list(map(int, input().split())) for _ in range(n)]\n\n# dp[i][j] = max sum up to row i, column j\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint tri[501][501];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j <= i; j++)\n            cin >> tri[i][j];\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Bottom-Up (bottom to top)',
                description: 'Accumulate max values going upward from the bottom row.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read the triangle as a 2D list.\nRow i has i+1 numbers.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ntri = [list(map(int, input().split())) for _ in range(n)]' },
                        { title: 'Bottom-up DP', desc: 'Going bottom-up eliminates boundary handling,\nand tri[0][0] directly becomes the answer.\nModify the original array in-place so no extra space is needed.', code: 'for i in range(n-2, -1, -1):\n    for j in range(i+1):\n        tri[i][j] += max(tri[i+1][j], tri[i+1][j+1])' },
                        { title: 'Output', desc: 'The maximum sum is accumulated at the top (tri[0][0]).', code: 'print(tri[0][0])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Use a global 2D array since N is at most 500.\nRead in triangle form.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint tri[501][501];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j <= i; j++)\n            cin >> tri[i][j];' },
                        { title: 'Bottom-up DP', desc: 'Accumulate max going upward from the bottom row.\nBottom-up approach: no boundary handling, tri[0][0] is the answer.', code: '    // accumulate max going upward from the bottom row\n    for (int i = n-2; i >= 0; i--)\n        for (int j = 0; j <= i; j++)\n            tri[i][j] += max(tri[i+1][j], tri[i+1][j+1]);' },
                        { title: 'Output', desc: 'The maximum path sum is accumulated in tri[0][0].', code: '    cout << tri[0][0] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[9].templates; }
            }]
        },

        // ========== Stage 4: LIS Family ==========
        {
            id: 'boj-11053',
            title: 'BOJ 11053 - Longest Increasing Subsequence',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11053',
            simIntro: 'See the process of filling dp[i] to find the longest increasing subsequence.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Given sequence A, write a program to find the length of the longest increasing subsequence (LIS). For example, if A = {10, 20, 10, 30, 20, 50}, the LIS is {10, 20, 30, 50} with length 4.</p>
    <h4>Input</h4>
    <p>The first line contains the size of sequence A, N (1 ≤ N ≤ 1,000). The second line contains the elements A<sub>i</sub> of the sequence. (1 ≤ A<sub>i</sub> ≤ 1,000)</p>
    <h4>Output</h4>
    <p>Print the length of the longest increasing subsequence of sequence A on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>6
10 20 10 30 20 50</pre></div>
        <div><strong>Output</strong><pre>4</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 1,000</li><li>1 ≤ A<sub>i</sub> ≤ 1,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'We need to find the longest increasing subsequence (LIS). Should we generate all subsequences, check if each is "increasing," and find the longest one? For sequence {10, 20, 10, 30, 20, 50}, subsequences include {10}, {10, 20}, {10, 20, 30}, {10, 20, 30, 50}, ...' },
                { title: 'But there\'s a problem with this', content: 'A sequence of N elements has 2<sup>N</sup> subsequences. If N=1000... absolutely impossible!<br><br>Instead, compute the LIS ending at each element.<br><br><div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">10</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">20</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">10</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">30</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">20</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">50</span></div><div style="text-align:center;font-size:0.75rem;color:var(--text3);">LIS = {10, 20, 30, 50} length 4</div>To find the LIS ending at element i, look at all previous elements that are <strong>smaller than i</strong> and reference their LIS lengths!' },
                { title: 'What if we try this?', content: 'Define <code>dp[i]</code> = length of the LIS <strong>ending at</strong> element i.<br><br>Initial value: dp[i] = 1 (just the element itself)<br>For all j where 0 &le; j &lt; i:<br>If <code>A[j] &lt; A[i]</code> \u2192 <code>dp[i] = max(dp[i], dp[j] + 1)</code><br><br>Answer: <code>max(dp[0], dp[1], ..., dp[n-1])</code><br><br>Double for loop gives O(N<sup>2</sup>). Since N \u2264 1000, this is fast enough!' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Initialize with <code>dp = [1] * n</code> and run a double for loop. Output with <code>print(max(dp))</code> \u2014 simple!</span><span class="lang-cpp">Declare <code>int dp[1001]</code> globally and in the inner loop update <code>dp[i] = max(dp[i], dp[j] + 1)</code>. Use <code>*max_element(dp, dp + n)</code> to find the max.</span>' }
            ],
            inputLabel: 'Sequence size N',
            inputMin: 1, inputMax: 1000, inputDefault: 6,
            solve(n) {
                var a = [10, 20, 10, 30, 20, 50];
                if (n > a.length) return '(test input out of range)';
                var dp = new Array(n).fill(1);
                for (var i = 1; i < n; i++)
                    for (var j = 0; j < i; j++)
                        if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
                return '' + Math.max.apply(null, dp);
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\n\n# dp[i] = length of LIS ending at a[i]\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], dp[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'O(N^2) DP',
                description: 'For each element, check all previous elements to compute the LIS.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read sequence size N and N integers.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))' },
                        { title: 'LIS DP', desc: 'dp[i] = LIS length ending at a[i].\nFor each element, find max dp value among smaller previous elements + 1.\nDouble loop O(N^2), sufficient since N <= 1000.', code: 'dp = [1] * n\nfor i in range(1, n):\n    for j in range(i):\n        if a[j] < a[i]:\n            dp[i] = max(dp[i], dp[j] + 1)' },
                        { title: 'Output', desc: 'The max value in the dp array is the LIS length.', code: 'print(max(dp))' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Use global array since N is at most 1000.\nRead with 0-indexed.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], dp[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];' },
                        { title: 'LIS DP', desc: 'For each element, find smaller previous elements and update dp.\nInitial value dp[i]=1 (self only). O(N^2) double loop.', code: '    // dp[i] = LIS length ending at a[i]\n    for (int i = 0; i < n; i++) {\n        dp[i] = 1;  // just the element itself\n        for (int j = 0; j < i; j++)\n            if (a[j] < a[i])\n                dp[i] = max(dp[i], dp[j] + 1);\n    }' },
                        { title: 'Output', desc: 'Use max_element to find the maximum value in the dp array.', code: '    cout << *max_element(dp, dp + n) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[10].templates; }
            }]
        },
        {
            id: 'boj-11054',
            title: 'BOJ 11054 - Longest Bitonic Subsequence',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11054',
            simIntro: 'See how combining LIS and LDS finds the longest bitonic subsequence.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Sequence S is called bitonic if for some S<sub>k</sub>, S<sub>1</sub> &lt; S<sub>2</sub> &lt; ... &lt; S<sub>k-1</sub> &lt; S<sub>k</sub> &gt; S<sub>k+1</sub> &gt; ... &gt; S<sub>N-1</sub> &gt; S<sub>N</sub>. Given a sequence, find the length of the longest bitonic subsequence.</p>
    <h4>Input</h4>
    <p>The first line contains the size of sequence A, N, and the second line contains the elements A<sub>i</sub> of the sequence. (1 ≤ N ≤ 1,000, 1 ≤ A<sub>i</sub> ≤ 1,000)</p>
    <h4>Output</h4>
    <p>Print the length of the longest bitonic subsequence of sequence A on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>10
1 5 2 1 4 3 4 5 2 1</pre></div>
        <div><strong>Output</strong><pre>7</pre></div>
    </div></div>
    <p><strong>Explanation:</strong> {1, 2, 3, 4, 5, 2, 1}</p>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 1,000</li><li>1 ≤ A<sub>i</sub> ≤ 1,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'A bitonic sequence "goes up then comes down." It increases to a peak k, then decreases. So what if we try every position k as the peak, and for each, find the left increasing subsequence + right decreasing subsequence with the largest total?' },
                { title: 'But there\'s a problem with this', content: 'Computing left LIS and right decreasing sequence from scratch for every peak k gives O(N<sup>3</sup>).<br><br><div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);">Recompute each time</div><div style="font-size:0.75rem;">N times x O(N<sup>2</sup>)</div><div style="font-weight:700;color:var(--red);">O(N<sup>3</sup>)</div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);">Precompute once</div><div style="font-size:0.75rem;">LIS 1x + LDS 1x</div><div style="font-weight:700;color:var(--green);">O(N<sup>2</sup>)</div></div></div>Precompute <strong>LIS from left</strong> and <strong>LIS from right</strong> (= decreasing) just <strong>once each</strong>, then combining is O(N)!' },
                { title: 'What if we try this?', content: 'Precompute two arrays:<br>- <code>lis[i]</code> = LIS length ending at i (left to right)<br>- <code>lds[i]</code> = LIS length ending at i from right to left (= length of decreasing subsequence starting at i)<br><br>Then the bitonic subsequence length with peak at i is:<br><code>lis[i] + lds[i] - 1</code><br>(-1 because the peak is double-counted in both sides)<br><br>Answer: the maximum of this value over all i!' },
                { title: 'In Python/C++!', content: 'Just compute LIS <strong>twice</strong> \u2014 forward and backward.<br><span class="lang-py">Reverse LIS uses <code>for i in range(n-2, -1, -1):</code> to iterate from the back. Output with <code>max(lis[i] + lds[i] - 1 for i in range(n))</code> in one line!</span><span class="lang-cpp">Forward uses <code>lis[1001]</code>, reverse uses <code>lds[1001]</code> as global arrays. Combine with <code>max(ans, lis[i] + lds[i] - 1)</code>.</span>' }
            ],
            inputLabel: 'Sequence size N',
            inputMin: 1, inputMax: 1000, inputDefault: 10,
            solve(n) {
                var a = [1, 5, 2, 1, 4, 3, 4, 5, 2, 1];
                if (n > a.length) return '(test input out of range)';
                var lis = new Array(n).fill(1), lds = new Array(n).fill(1);
                for (var i = 1; i < n; i++)
                    for (var j = 0; j < i; j++)
                        if (a[j] < a[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
                for (var i = n - 2; i >= 0; i--)
                    for (var j = n - 1; j > i; j--)
                        if (a[j] < a[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
                var ans = 0;
                for (var i = 0; i < n; i++) ans = Math.max(ans, lis[i] + lds[i] - 1);
                return '' + ans;
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\n\n# lis[i] = left-to-right LIS, lds[i] = right-to-left LIS\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], lis[1001], lds[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Combining LIS + LDS',
                description: 'Compute forward LIS and reverse LIS, then combine them.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input and LIS', desc: 'First compute forward LIS.\nlis[i] = length of increasing subsequence ending at i.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\nlis = [1] * n\nfor i in range(1, n):\n    for j in range(i):\n        if a[j] < a[i]: lis[i] = max(lis[i], lis[j]+1)' },
                        { title: 'LDS (reverse LIS)', desc: 'Increasing subsequence from back = decreasing from front.\nlds[i] = length of decreasing subsequence starting at i.', code: 'lds = [1] * n\nfor i in range(n-2, -1, -1):\n    for j in range(n-1, i, -1):\n        if a[j] < a[i]: lds[i] = max(lds[i], lds[j]+1)' },
                        { title: 'Combine and output', desc: 'Max of lis[i]+lds[i]-1 for peak i.\n-1 because the peak is counted in both sides.', code: 'print(max(lis[i] + lds[i] - 1 for i in range(n)))' }
                    ],
                    cpp: [
                        { title: 'Input and LIS', desc: 'Compute forward LIS first.\nlis[i] = increasing subsequence length ending at a[i].', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], lis[1001], lds[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // forward LIS\n    for (int i = 0; i < n; i++) {\n        lis[i] = 1;\n        for (int j = 0; j < i; j++)\n            if (a[j] < a[i]) lis[i] = max(lis[i], lis[j] + 1);\n    }' },
                        { title: 'LDS (reverse LIS)', desc: 'Computing LIS in reverse gives decreasing subsequence length.\nlds[i] = decreasing subsequence length starting at a[i].', code: '    // reverse LIS = decreasing subsequence length\n    for (int i = n-1; i >= 0; i--) {\n        lds[i] = 1;\n        for (int j = n-1; j > i; j--)\n            if (a[j] < a[i]) lds[i] = max(lds[i], lds[j] + 1);\n    }' },
                        { title: 'Combine and output', desc: 'Sum increasing+decreasing at peak i, -1 to remove overlap.\nFind the max over all i.', code: '    // max of lis[i]+lds[i]-1 over all peaks i\n    int ans = 0;\n    for (int i = 0; i < n; i++)\n        ans = max(ans, lis[i] + lds[i] - 1);\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[11].templates; }
            }]
        },
        {
            id: 'boj-2565',
            title: 'BOJ 2565 - Electric Wires',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2565',
            simIntro: 'Sort by pole A, then find LIS in the B array to determine how many wires to remove.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>There are electric wires between two utility poles A and B. To eliminate all crossings, some wires need to be removed. Find the minimum number of wires to remove.</p>
    <h4>Input</h4>
    <p>The first line contains the number of electric wires between the two poles. The number is a natural number ≤ 100. From the second line, one wire per line is given as the position number on pole A and pole B, in order. Position numbers are natural numbers ≤ 500, and no two wires connect to the same position.</p>
    <h4>Output</h4>
    <p>Print the minimum number of wires to remove so that no remaining wires cross on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>8
1 8
3 9
2 2
4 1
6 4
10 10
9 7
7 6</pre></div>
        <div><strong>Output</strong><pre>3</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 100</li><li>Position number \u2264 500</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'Should we find all crossing wire pairs and decide which wires to remove? Thinking of crossing pairs as a graph... hmm, this gets complicated. We would need to figure out which combination of wires to remove so that the remaining ones do not cross.' },
                { title: 'But there\'s a problem with this', content: 'Trying all removal combinations gives 2<sup>N</sup> which is too slow. <strong>Let us flip the perspective</strong>!<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);">Min to remove?</div><div style="font-size:0.75rem;color:var(--text3);">Hard to compute directly</div></div><div style="font-size:1.2rem;color:var(--text3);">⟺</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);">Max to keep!</div><div style="font-size:0.75rem;color:var(--text3);">N − kept = answer</div></div></div>So what structure does "the maximum set of non-crossing wires" have?' },
                { title: 'What if we try this?', content: 'Sort the wires by pole A. Then for wires not to cross, the B-side numbers must also be <strong>increasing</strong>!<br><br>Example: After sorting by A, B = [8, 2, 9, 1, 4, 6, 7, 10]<br>The increasing subsequence = non-crossing wires!<br><br>This is just finding the <strong>LIS in the B array</strong>!<br>Answer: <code>N - LIS length</code>' },
                { title: 'In Python/C++!', content: 'The key is to <strong>sort by A first</strong>!<br><span class="lang-py"><code>wires.sort()</code> auto-sorts by the first value (A). Then find LIS in <code>b = [w[1] for w in wires]</code>.</span><span class="lang-cpp">Using <code>pair&lt;int,int&gt;</code>, <code>sort()</code> auto-sorts by first. Find LIS in <code>wires[i].second</code>.</span>' }
            ],
            inputLabel: 'Number of wires N',
            inputMin: 1, inputMax: 100, inputDefault: 8,
            solve(n) {
                var wires = [[1,8],[3,9],[2,2],[4,1],[6,4],[10,10],[9,7],[7,6]];
                if (n > wires.length) return '(test input out of range)';
                var sorted = wires.slice(0, n).sort(function(a, b) { return a[0] - b[0]; });
                var b = sorted.map(function(w) { return w[1]; });
                var dp = new Array(n).fill(1);
                for (var i = 1; i < n; i++)
                    for (var j = 0; j < i; j++)
                        if (b[j] < b[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
                return '' + (n - Math.max.apply(null, dp));
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwires = [list(map(int, input().split())) for _ in range(n)]\n\n# Sort by A, then find LIS in B values\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\npair<int,int> wires[101];\nint dp[101];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> wires[i].first >> wires[i].second;\n    sort(wires, wires + n);\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Sort + LIS',
                description: 'Sort by A, find LIS in B array, and subtract from N.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input and sort', desc: 'Sorting by pole A transforms the problem into\nfinding LIS in the B array. Crossing = non-increasing part of B.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwires = [list(map(int, input().split())) for _ in range(n)]\nwires.sort()' },
                        { title: 'LIS in B array', desc: 'After sorting by A, LIS in B = max non-crossing wires.\nApply standard O(N^2) LIS DP.', code: 'b = [w[1] for w in wires]\ndp = [1] * n\nfor i in range(1, n):\n    for j in range(i):\n        if b[j] < b[i]: dp[i] = max(dp[i], dp[j]+1)' },
                        { title: 'Output', desc: 'Wires to remove = total N - max non-crossing (LIS).', code: 'print(n - max(dp))' }
                    ],
                    cpp: [
                        { title: 'Input and sort', desc: 'pair sorts automatically by first element', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\npair<int,int> wires[101];\nint dp[101];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> wires[i].first >> wires[i].second;\n    // pair auto-sorts by first element\n    sort(wires, wires + n);' },
                        { title: 'LIS in B array', desc: 'Find LIS in pair\'s second (B values).\nLIS length = max non-crossing wires.', code: '    // find LIS in B (second) after sorting by A\n    for (int i = 0; i < n; i++) {\n        dp[i] = 1;\n        for (int j = 0; j < i; j++)\n            if (wires[j].second < wires[i].second)\n                dp[i] = max(dp[i], dp[j] + 1);\n    }' },
                        { title: 'Output', desc: 'Subtract LIS length from total N for minimum wires to remove.', code: '    // wires to remove = total - max non-crossing (LIS)\n    cout << n - *max_element(dp, dp + n) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[12].templates; }
            }]
        },

        // ========== Stage 5: Classic DP ==========
        {
            id: 'boj-9251',
            title: 'BOJ 9251 - LCS',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/9251',
            simIntro: 'See the process of filling the 2D DP table to find the LCS.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>The LCS (Longest Common Subsequence) problem is to find the longest subsequence that is common to both given sequences.</p>
    <h4>Input</h4>
    <p>Two strings are given on the first and second lines. The strings consist of uppercase letters only and have a maximum length of 1,000 characters.</p>
    <h4>Output</h4>
    <p>Print the length of the LCS of the two input strings on the first line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>ACAYKP
CAPCAK</pre></div>
        <div><strong>Output</strong><pre>4</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>Length of both strings \u2264 1,000</li><li>Consists of uppercase letters only</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'We need to find the longest common subsequence of two strings. First generate all subsequences of A, then check if each is also a subsequence of B? Subsequences of A = "ACAYKP" include {A, C, AC, AY, ACK, ...} and so on.' },
                { title: 'But there\'s a problem with this', content: 'A string of length N has 2<sup>N</sup> subsequences! If N is 1000, absolutely impossible.<br><br>Instead, compare A[i] and B[j]:<br><br><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">A[i] == B[j]</div><div style="font-size:0.75rem;">Include! Advance both</div><div><code>dp[i-1][j-1] + 1</code></div></div><div style="text-align:center;border:1.5px solid var(--text3);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;margin-bottom:3px;">A[i] != B[j]</div><div style="font-size:0.75rem;">Take better option</div><div><code>max(dp[i-1][j], dp[i][j-1])</code></div></div></div>What if we organize this in a table?' },
                { title: 'What if we try this?', content: 'Define <code>dp[i][j]</code> = LCS length of the first i characters of A and first j characters of B:<br><br>- <code>A[i] == B[j]</code>: same character found! \u2192 <code>dp[i][j] = dp[i-1][j-1] + 1</code><br>- <code>A[i] != B[j]</code>: take the better side \u2192 <code>dp[i][j] = max(dp[i-1][j], dp[i][j-1])</code><br><br>Row 0 and column 0 are all 0 (LCS with empty string = 0)<br>Answer: <code>dp[len(A)][len(B)]</code>' },
                { title: 'In Python/C++!', content: '1-indexed implementation makes boundary handling natural.<br><span class="lang-py">Initialize with <code>dp = [[0]*(len(b)+1) for _ in range(len(a)+1)]</code>. Comparing <code>a[i-1] == b[j-1]</code> makes row 0 and column 0 automatically 0.</span><span class="lang-cpp">Declaring <code>int dp[1001][1001]</code> globally auto-initializes to 0. Compare with <code>a[i-1] == b[j-1]</code>. Using <code>string</code> type for input is convenient.</span>' }
            ],
            inputLabel: '(using built-in example)',
            inputMin: 0, inputMax: 0, inputDefault: 0,
            solve() {
                var a = 'ACAYKP', b = 'CAPCAK';
                var m = a.length, n = b.length;
                var dp = [];
                for (var i = 0; i <= m; i++) { dp[i] = []; for (var j = 0; j <= n; j++) dp[i][j] = 0; }
                for (var i = 1; i <= m; i++)
                    for (var j = 1; j <= n; j++)
                        if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
                        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                return '' + dp[m][n];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\na = input().strip()\nb = input().strip()\n\n# dp[i][j] = LCS length of a[:i] and b[:j]\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\n#include <cstring>\nusing namespace std;\n\nint dp[1001][1001];\n\nint main() {\n    string a, b;\n    cin >> a >> b;\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '2D DP',
                description: 'If characters match: diagonal+1, otherwise: max of left and top.',
                timeComplexity: 'O(N*M)',
                spaceComplexity: 'O(N*M)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read two strings, one per line.\nUse strip() to remove newline characters.', code: 'import sys\ninput = sys.stdin.readline\n\na = input().strip()\nb = input().strip()' },
                        { title: 'Fill DP table', desc: 'If same character: diagonal (dp[i-1][j-1])+1,\notherwise: max of left (dp[i][j-1]) and top (dp[i-1][j]).\nRow 0 and column 0 are all 0 (LCS with empty string).', code: 'dp = [[0]*(len(b)+1) for _ in range(len(a)+1)]\nfor i in range(1, len(a)+1):\n    for j in range(1, len(b)+1):\n        if a[i-1] == b[j-1]:\n            dp[i][j] = dp[i-1][j-1] + 1\n        else:\n            dp[i][j] = max(dp[i-1][j], dp[i][j-1])' },
                        { title: 'Output', desc: 'dp[len(a)][len(b)] is the LCS length.', code: 'print(dp[len(a)][len(b)])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Declare DP table as global 2D array.\nRead two strings using string type.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[1001][1001];\n\nint main() {\n    string a, b;\n    cin >> a >> b;\n    int m = a.size(), n = b.size();' },
                        { title: 'Fill DP table', desc: 'Match: diagonal+1 (common char found), mismatch: max of left/top.\n1-indexed implementation avoids explicit 0th row/col initialization.', code: '    // match: diagonal+1, mismatch: max of left/top\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (a[i-1] == b[j-1])\n                dp[i][j] = dp[i-1][j-1] + 1;\n            else\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);\n        }\n    }' },
                        { title: 'Output', desc: 'dp[m][n] is the LCS length of both strings.', code: '    cout << dp[m][n] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[13].templates; }
            }]
        },
        {
            id: 'boj-12865',
            title: 'BOJ 12865 - Standard Knapsack',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/12865',
            simIntro: 'See how the 1D DP array solves the knapsack problem step by step.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Junseo has N items he thinks are needed for a trip. Each item has weight W and value V. Find the maximum total value of items that can be placed in the knapsack. The weight limit is K.</p>
    <h4>Input</h4>
    <p>The first line contains the number of items N (1 ≤ N ≤ 100) and the maximum weight K (1 ≤ K ≤ 100,000) that Junseo can carry. From the second line, N lines each contain the weight W (1 ≤ W ≤ 100,000) and value V (0 ≤ V ≤ 1,000) of each item.</p>
    <h4>Output</h4>
    <p>Print the maximum total value of items that can fit in the knapsack on one line.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>4 7
6 13
4 8
3 6
5 12</pre></div>
        <div><strong>Output</strong><pre>14</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 100</li><li>1 ≤ K ≤ 100,000</li><li>1 ≤ W ≤ 100,000</li><li>0 ≤ V ≤ 1,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'We need to pick items from N items. Each item has two choices: "take" or "leave," so should we try all 2<sup>N</sup> combinations? Among combinations whose total weight is at most K, pick the one with maximum value.' },
                { title: 'But there\'s a problem with this', content: 'If N is up to 100, 2<sup>100</sup> = about 10<sup>30</sup>... trying all of them is impossible!<br><br><div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;"><div style="font-weight:600;color:var(--red);">Brute force</div><div style="font-size:1.1rem;font-weight:700;color:var(--red);">2<sup>100</sup></div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-weight:600;color:var(--green);">DP (items x capacity)</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">N × K</div></div></div>When considering the i-th item, only <strong>the remaining capacity</strong> matters. Our state: "items considered + current capacity"!' },
                { title: 'What if we try this?', content: 'Define <code>dp[i][w]</code> = max value considering the first i items with knapsack capacity w<br><br>For the i-th item (weight W[i], value V[i]):<br>- Skip: <code>dp[i-1][w]</code><br>- Take (when w &ge; W[i]): <code>dp[i-1][w - W[i]] + V[i]</code><br><br><code>dp[i][w] = max(skip, take)</code><br><br>This is the famous <strong>0/1 Knapsack Problem</strong>!' },
                { title: 'In Python/C++!', content: 'Instead of a 2D array, we can <strong>optimize space with a 1D array</strong>! Key: iterate w in <strong>reverse</strong> to prevent using the same item twice.<br><span class="lang-py">Just one 1D array: <code>dp = [0] * (K + 1)</code>. For each item, iterate <code>for w in range(K, wi-1, -1):</code> in reverse and update <code>dp[w] = max(dp[w], dp[w-wi] + vi)</code>.</span><span class="lang-cpp">Declare <code>int dp[100001] = {0};</code>. Iterate <code>for (int j = K; j &gt;= w; j--)</code> in reverse. Watch the array size since K can be up to 100K.</span>' }
            ],
            inputLabel: '(using built-in example)',
            inputMin: 0, inputMax: 0, inputDefault: 0,
            solve() {
                var items = [[6,13],[4,8],[3,6],[5,12]];
                var K = 7;
                var dp = new Array(K + 1).fill(0);
                for (var idx = 0; idx < items.length; idx++) {
                    var w = items[idx][0], v = items[idx][1];
                    for (var j = K; j >= w; j--) dp[j] = Math.max(dp[j], dp[j - w] + v);
                }
                return '' + dp[K];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, k = map(int, input().split())\nitems = [list(map(int, input().split())) for _ in range(n)]\n\n# dp[i][w] = max value considering first i items with capacity w\n# Write your solution here\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[100001];\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Write your solution here\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '1D DP (reverse traversal)',
                description: 'For each item, update the dp array in reverse to optimize space.',
                timeComplexity: 'O(NK)',
                spaceComplexity: 'O(K)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read N items as (weight, value) pairs and knapsack capacity K.', code: 'import sys\ninput = sys.stdin.readline\n\nn, k = map(int, input().split())\nitems = [list(map(int, input().split())) for _ in range(n)]' },
                        { title: '1D DP (reverse)', desc: 'Key: reverse traversal prevents using the same item twice.\nForward would cause dp[j-w] to already be updated, leading to duplication.\ndp[j] = max value with capacity j.', code: 'dp = [0] * (k + 1)\nfor w, v in items:\n    for j in range(k, w - 1, -1):\n        dp[j] = max(dp[j], dp[j-w] + v)' },
                        { title: 'Output', desc: 'dp[k] is the maximum value within knapsack capacity K.', code: 'print(dp[k])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Use global array dp[100001] since K can be up to 100K.\nRead N and K.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[100001];\n\nint main() {\n    int n, k;\n    cin >> n >> k;' },
                        { title: '1D DP (reverse)', desc: 'Reverse traversal: prevents using the same item twice', code: '    for (int i = 0; i < n; i++) {\n        int w, v;\n        cin >> w >> v;\n        // reverse traversal prevents duplicate item usage\n        for (int j = k; j >= w; j--)\n            dp[j] = max(dp[j], dp[j-w] + v);\n    }' },
                        { title: 'Output', desc: 'dp[k] is the maximum value within knapsack capacity K.', code: '    cout << dp[k] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[14].templates; }
            }]
        }
    ],

    // ===== Utilities =====
    _fib(n) {
        if (n <= 2) return 1;
        return this._fib(n - 1) + this._fib(n - 2);
    }
};

// Global registration
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.dp = dpTopic;
