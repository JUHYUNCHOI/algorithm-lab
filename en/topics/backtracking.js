// ===== Backtracking Topic Module =====
var backtrackingTopic = {
    id: 'backtracking',
    title: 'Backtracking',
    icon: '🔙',
    category: 'Problem Solving (Silver~Gold)',
    order: 11,
    description: 'A technique that tries every path and backtracks when stuck to explore alternatives',
    relatedNote: 'Backtracking is widely used in generating permutations/combinations, constraint satisfaction problems (CSP), game tree searches, and more.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-15649': { type: 'Permutation',       color: 'var(--accent)', vizMethod: '_renderVizNM1', suffix: '-nm1' },
        'boj-15650': { type: 'Combination',       color: 'var(--green)',  vizMethod: '_renderVizNM2', suffix: '-nm2' },
        'boj-15651': { type: 'Perm. w/ Repetition',   color: '#e17055',      vizMethod: '_renderVizNM3', suffix: '-nm3' },
        'boj-15652': { type: 'Comb. w/ Repetition',   color: '#fdcb6e',      vizMethod: '_renderVizNM4', suffix: '-nm4' },
        'boj-14888': { type: 'Operator Placement', color: '#6c5ce7',      vizMethod: '_renderVizOperator', suffix: '-op' },
        'boj-14889': { type: 'Team Split',    color: '#00b894',      vizMethod: '_renderVizTeam', suffix: '-team' },
        'boj-9663':  { type: 'N-Queen',    color: '#d63031',      vizMethod: '_renderVizNQueen', suffix: '-nq' },
        'boj-2580':  { type: 'Sudoku',     color: '#0984e3',      vizMethod: '_renderVizSudoku', suffix: '-sdk' }
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
            sim:     { intro: prob.simIntro || 'See how backtracking actually works in action.', icon: '🎮' },
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
                <h2>🔙 Backtracking</h2>
                <p class="hero-sub">Try every path to the end, and if it fails, go back and try a different one</p>
            </div>

            <!-- 1. What is Backtracking? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> What is Backtracking?</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Imagine you reach a fork in a maze.<br>
                    You pick one path and <strong>follow it all the way</strong>.
                    Dead end? You <strong>go back to the fork</strong> and try the other path.<br><br>
                    Backtracking works the same way. You push one choice as far as it goes,
                    and <strong>if it fails, go back and push a different choice to the end</strong>.
                    Repeat until you find the answer.
                </div>

                <p style="margin: 1rem 0 0.5rem; font-weight: 600;">Example: Pick 2 from {1, 2, 3} and arrange them in order</p>
                <div class="bt-maze-container" id="bt-decision-tree-container">
                    <div class="bt-decision-tree" id="bt-decision-tree"></div>
                    <div class="bt-tree-instruction" id="bt-tree-instruction">👆 Click a node to make a selection!</div>
                    <div class="bt-tree-results" id="bt-tree-results"></div>
                    <button class="matryoshka-reset hidden" id="bt-tree-reset">↺ Try Again</button>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">At what moment does "backtracking" occur in the process above?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        After picking up to the second number to complete one sequence,
                        backtracking occurs when you <strong>undo</strong> that choice and try a different second number.<br>
                        It also occurs when you've tried all choices for the second slot,
                        undo even the first slot's choice, and try a different first number.<br><br>
                        That is exactly what <strong>backtracking</strong> is!
                    </div>
                </div>
            </div>

            <!-- 2. The 3 Core Elements of Backtracking -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> The 3 Core Elements of Backtracking</div>
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="35" r="18" fill="none" stroke="var(--accent)" stroke-width="3"/>
                                <path d="M40 53 L40 65" stroke="var(--accent)" stroke-width="3"/>
                                <path d="M32 60 L48 60" stroke="var(--accent)" stroke-width="3"/>
                            </svg>
                        </div>
                        <h3>☝️ Choose</h3>
                        <p>Pick one option from the available choices.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="40" r="22" fill="none" stroke="var(--green)" stroke-width="3"/>
                                <path d="M30 40 L37 48 L52 32" fill="none" stroke="var(--green)" stroke-width="3"/>
                            </svg>
                        </div>
                        <h3>✅ Check Constraints</h3>
                        <p>Verify whether this choice satisfies the constraints. If not, discard it.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <path d="M50 25 A20 20 0 1 0 55 45" fill="none" stroke="var(--red)" stroke-width="3"/>
                                <polygon points="55,38 55,52 48,45" fill="var(--red)"/>
                            </svg>
                        </div>
                        <h3>↩️ Undo (Backtrack)</h3>
                        <p>Undo the choice, return to the previous state, and try a different option.</p>
                    </div>
                </div>

                <span class="lang-py"><div class="code-block"><pre><code class="language-python">def backtrack(current_state):
    if found_answer:
        add_to_results
        return

    for choice in choices:
        if is_valid(choice):        # ✅ Check constraints
            make_choice(choice)     # ☝️ Choose
            backtrack(next_state)   # Recurse to next step
            undo_choice(choice)     # ↩️ Backtrack</code></pre></div></span>
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">void backtrack(State&amp; current_state) {
    if (found_answer) {
        add_to_results;
        return;
    }

    for (auto&amp; choice : choices) {
        if (is_valid(choice)) {        // ✅ Check constraints
            make_choice(choice);       // ☝️ Choose
            backtrack(next_state);     // Recurse to next step
            undo_choice(choice);       // ↩️ Backtrack
        }
    }
}</code></pre></div></span>
                <div style="margin-top:0.6rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/itertools.html#itertools.permutations" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: itertools.permutations ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/next_permutation" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: next_permutation ↗</a></span>
                </div>

                <!-- Demo 2: 3-element follow -->
                <div class="concept-demo" style="margin-top:1.5rem;">
                    <div class="concept-demo-title">🎮 Try It — Follow along building permutations of 3 elements</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bt-demo-3elem-next">▶ Next Step</button>
                        <button class="concept-demo-btn green" id="bt-demo-3elem-reset">↺ Start Over</button>
                    </div>
                    <div class="concept-demo-body">
                        <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Follow the Choose/Check/Undo cycle for picking 2 from {1, 2, 3}</p>
                        <div style="display:flex;gap:16px;justify-content:center;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
                            <div>
                                <div style="font-size:0.75rem;color:var(--text3);margin-bottom:4px;text-align:center;">Available</div>
                                <div id="bt-demo-3elem-pool" style="display:flex;gap:6px;justify-content:center;"></div>
                            </div>
                            <div style="font-size:1.2rem;color:var(--text3);">→</div>
                            <div>
                                <div style="font-size:0.75rem;color:var(--text3);margin-bottom:4px;text-align:center;">Current Path</div>
                                <div id="bt-demo-3elem-path" style="display:flex;gap:6px;justify-content:center;min-width:80px;min-height:38px;border:2px dashed var(--border);border-radius:10px;padding:4px 10px;align-items:center;"></div>
                            </div>
                        </div>
                        <div id="bt-demo-3elem-used" style="display:flex;gap:6px;justify-content:center;margin-bottom:8px;"></div>
                        <div id="bt-demo-3elem-results" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:28px;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-3elem-msg">👆 Click "Next Step" to follow how Choose/Check/Undo work step by step!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What happens if you remove the "undo_choice(choice)" line from the code above?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Without undoing, the previous choice stays in place.
                        So the next attempt proceeds from an incorrect state.<br>
                        For example, if [1, 2] was chosen and you add 3 without undoing 2,
                        you get [1, 2, 3] instead of [1, 3], which is what we actually want!<br><br>
                        <strong>Undoing is the core of backtracking</strong>.
                    </div>
                </div>
            </div>

            <!-- 3. How to avoid revisiting the same element? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> How to Avoid Revisiting the Same Element?</div>
                <p style="margin-bottom: 1rem;">
                    When building permutations, <strong>you must not use the same number twice</strong>.
                    A <code>used[]</code> array remembers which numbers are already chosen.
                    If <code>used[i] = true</code>, the i-th number is already in the path, so we skip it.
                </p>

                <!-- Demo 3: Cycle prevention demo -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Preventing duplicates with the used array</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bt-demo-cycle-toggle1">Select 1</button>
                        <button class="concept-demo-btn" id="bt-demo-cycle-toggle2">Select 2</button>
                        <button class="concept-demo-btn" id="bt-demo-cycle-toggle3">Select 3</button>
                        <button class="concept-demo-btn danger" id="bt-demo-cycle-clear">🗑️ Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Selecting a number updates the used array. What happens if you click an already-selected number?</p>
                        <div style="display:flex;gap:24px;justify-content:center;align-items:flex-start;flex-wrap:wrap;">
                            <div>
                                <div style="font-size:0.8rem;font-weight:600;margin-bottom:6px;text-align:center;">used array</div>
                                <div id="bt-demo-cycle-used" style="display:flex;gap:4px;justify-content:center;"></div>
                            </div>
                            <div>
                                <div style="font-size:0.8rem;font-weight:600;margin-bottom:6px;text-align:center;">Current Path</div>
                                <div id="bt-demo-cycle-path" style="display:flex;gap:4px;justify-content:center;min-height:38px;align-items:center;font-size:1.1rem;font-weight:600;color:var(--accent);"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-cycle-msg">👆 Click the number buttons to select them! If you click an already-selected number, the used array will block it.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">Instead of the used array, can't we just check if a number is in the path each time?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        You can, but the performance is different!<br>
                        <code>used[i]</code> checks instantly in <strong>O(1)</strong>,
                        but searching inside the path (<code>i in path</code>) takes <strong>O(path length)</strong>.<br>
                        The larger N gets, the bigger the difference, so using the used array is more efficient.
                    </div>
                </div>
            </div>

            <!-- 4. What is Pruning? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> What is Pruning?</div>
                <p style="margin-bottom: 1rem;">The most important technique in backtracking is
                    <strong>pruning</strong>.
                    It means <strong>filtering out invalid choices early</strong> so they are never explored at all.</p>

                <!-- Demo 4: Pruning comparison -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — With vs Without Pruning</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bt-demo-prune-run">▶ Start Search</button>
                        <button class="concept-demo-btn green" id="bt-demo-prune-reset">↺ Again</button>
                    </div>
                    <div class="concept-demo-body">
                        <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;">Permutations of 2 from {1,2,3} — left explores all without pruning, right prunes with used[]</p>
                        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
                            <div style="flex:1;min-width:200px;max-width:280px;">
                                <div style="text-align:center;font-weight:600;font-size:0.85rem;margin-bottom:6px;color:var(--red);">❌ No Pruning</div>
                                <div id="bt-demo-prune-nop" style="font-size:0.82rem;line-height:1.8;padding:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border);min-height:120px;"></div>
                                <div id="bt-demo-prune-nop-count" style="text-align:center;margin-top:6px;font-size:0.85rem;font-weight:600;color:var(--red);">Explored: 0</div>
                            </div>
                            <div style="flex:1;min-width:200px;max-width:280px;">
                                <div style="text-align:center;font-weight:600;font-size:0.85rem;margin-bottom:6px;color:var(--green);">✂️ With Pruning</div>
                                <div id="bt-demo-prune-yes" style="font-size:0.82rem;line-height:1.8;padding:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border);min-height:120px;"></div>
                                <div id="bt-demo-prune-yes-count" style="text-align:center;margin-top:6px;font-size:0.85rem;font-weight:600;color:var(--green);">Explored: 0</div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-prune-msg">👆 Click "Start Search" to compare how pruning reduces the search space!</div>
                </div>

                <div class="execution-flow-compare">
                    <div class="flow-grid">
                        <div class="flow-card topdown-flow">
                            <div class="flow-label">❌ Without Pruning (explore all cases)</div>
                            <div class="flow-trace">
                                <div>1→1 (same number! duplicate)</div>
                                <div>1→2 ✓</div>
                                <div>1→3 ✓</div>
                                <div>2→1 ✓</div>
                                <div>2→2 (same number! duplicate)</div>
                                <div>2→3 ✓</div>
                                <div>3→1 ✓</div>
                                <div>3→2 ✓</div>
                                <div>3→3 (same number! duplicate)</div>
                                <div style="margin-top:6px;font-weight:700;">→ Must check all 9 cases</div>
                            </div>
                        </div>
                        <div class="flow-card bottomup-flow">
                            <div class="flow-label">✂️ With Pruning (skip invalid choices)</div>
                            <div class="flow-trace">
                                <div>1→1 ✕ Already used! <strong>Skip</strong></div>
                                <div>1→2 ✓</div>
                                <div>1→3 ✓</div>
                                <div>2→1 ✓</div>
                                <div>2→2 ✕ Already used! <strong>Skip</strong></div>
                                <div>2→3 ✓</div>
                                <div>3→1 ✓</div>
                                <div>3→2 ✓</div>
                                <div>3→3 ✕ Already used! <strong>Skip</strong></div>
                                <div style="margin-top:6px;font-weight:700;">→ Only 6 cases to check</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="key-difference-box">
                    <div>✂️ Good pruning drastically reduces the search space and makes things much faster</div>
                    <div>📊 N-Queen (8x8): All cases ~<strong>16.8 million</strong> → With pruning, only ~<strong>15,000</strong> explored</div>
                    <div>💡 The sooner you realize "this choice is already invalid," the better the performance</div>
                </div>
                <div style="margin-top:0.6rem;">
                    <a href="https://en.wikipedia.org/wiki/Backtracking" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Backtracking Algorithm ↗</a>
                </div>
            </div>

            <!-- 5. Backtracking vs Brute Force -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> Backtracking vs Brute Force</div>
                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔍 Brute Force</h3>
                        <p class="approach-desc">Generate all possible cases first, then check each one</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Nested loops to generate all cases
for i in range(1, n+1):
    for j in range(1, n+1):
        if i != j:  # Check after generating
            print(i, j)</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Nested loops to generate all cases
for (int i = 1; i &lt;= n; i++) {
    for (int j = 1; j &lt;= n; j++) {
        if (i != j)  // Check after generating
            cout &lt;&lt; i &lt;&lt; " " &lt;&lt; j &lt;&lt; endl;
    }
}</code></pre></div></span>
                    </div>
                    <div class="approach-card">
                        <h3>🔙 Backtracking</h3>
                        <p class="approach-desc">If a choice violates the constraint, backtrack immediately</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">def solve(path, used):
    if len(path) == 2:
        print(*path)
        return
    for i in range(1, n+1):
        if not used[i]:   # Check first!
            used[i] = True
            path.append(i)
            solve(path, used)
            path.pop()       # Undo
            used[i] = False  # Undo</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">void solve(vector&lt;int&gt;&amp; path, vector&lt;bool&gt;&amp; used, int n) {
    if (path.size() == 2) {
        for (int x : path) cout &lt;&lt; x &lt;&lt; " ";
        cout &lt;&lt; endl;
        return;
    }
    for (int i = 1; i &lt;= n; i++) {
        if (!used[i]) {       // Check first!
            used[i] = true;
            path.push_back(i);
            solve(path, used, n);
            path.pop_back();  // Undo
            used[i] = false;  // Undo
        }
    }
}</code></pre></div></span>
                    </div>
                </div>

                <!-- Demo 5: Execution comparison -->
                <div class="concept-demo" style="margin-top:1.5rem;">
                    <div class="concept-demo-title">🎮 Try It — Compare Execution Counts (Change N)</div>
                    <div class="concept-demo-btns">
                        <label style="font-size:0.85rem;color:var(--text2);display:flex;align-items:center;gap:6px;">N =
                            <input type="number" id="bt-demo-exec-n" value="4" min="2" max="8" style="width:50px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;background:var(--card);color:var(--text);">
                        </label>
                        <label style="font-size:0.85rem;color:var(--text2);display:flex;align-items:center;gap:6px;">M =
                            <input type="number" id="bt-demo-exec-m" value="2" min="1" max="6" style="width:50px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="bt-demo-exec-run">📊 Compare</button>
                    </div>
                    <div class="concept-demo-body">
                        <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;">Picking M from N in order: compare brute force vs backtracking exploration counts</p>
                        <div style="display:flex;gap:24px;justify-content:center;align-items:flex-end;flex-wrap:wrap;">
                            <div style="text-align:center;">
                                <div id="bt-demo-exec-bar-brute" style="width:60px;background:var(--red);border-radius:6px 6px 0 0;transition:height 0.6s;height:0px;margin:0 auto;"></div>
                                <div style="font-size:0.8rem;font-weight:600;margin-top:6px;color:var(--red);">Brute Force</div>
                                <div id="bt-demo-exec-val-brute" style="font-size:1.1rem;font-weight:700;color:var(--red);">0</div>
                            </div>
                            <div style="text-align:center;">
                                <div id="bt-demo-exec-bar-bt" style="width:60px;background:var(--green);border-radius:6px 6px 0 0;transition:height 0.6s;height:0px;margin:0 auto;"></div>
                                <div style="font-size:0.8rem;font-weight:600;margin-top:6px;color:var(--green);">Backtracking</div>
                                <div id="bt-demo-exec-val-bt" style="font-size:1.1rem;font-weight:700;color:var(--green);">0</div>
                            </div>
                            <div style="text-align:center;">
                                <div id="bt-demo-exec-saved" style="font-size:0.9rem;color:var(--accent);font-weight:600;min-height:24px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-exec-msg">👆 Change N and M, then click "Compare"! As N grows, the difference becomes dramatic.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">As N grows, how much difference is there between brute force and backtracking?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Picking 2 from N=10 in order (permutation):<br>
                        Brute force: 10x10 = <strong>100 cases</strong> generated, then filtered<br>
                        Backtracking: 10x9 = only <strong>90 cases</strong> explored (10 are never generated)<br><br>
                        The difference seems small, but for complex problems like N-Queen,
                        backtracking can reduce exploration by <strong>hundreds to thousands of times</strong>.
                    </div>
                </div>
            </div>

            <!-- 6. 4-Queen Experience -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">6</span> 4-Queen Problem</div>
                <p style="margin-bottom:0.5rem;">Try placing 4 queens on a 4x4 chessboard so that <strong>none of them can attack each other</strong>.
                    A queen attacks any piece in the same row, column, or diagonal.</p>
                <p style="margin-bottom:1rem;font-size:0.9rem;color:var(--text2);">
                    Place them yourself, or click "Auto Solve" to watch how backtracking solves it!</p>

                <!-- Demo 6: 4-Queen -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — 4-Queen Backtracking</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bt-demo-4q-auto">Step ▶</button>
                        <button class="concept-demo-btn danger" id="bt-demo-4q-clear">Reset ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="bt-demo-4q-board" style="display:inline-grid;grid-template-columns:repeat(4,1fr);gap:2px;margin:0 auto;"></div>
                        <div id="bt-demo-4q-info" style="margin-top:10px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;font-size:0.85rem;">
                            <span>Queens placed: <strong id="bt-demo-4q-placed">0</strong>/4</span>
                            <span>Attempts: <strong id="bt-demo-4q-tries">0</strong></span>
                            <span>Backtracks: <strong id="bt-demo-4q-backs">0</strong></span>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-4q-msg">👆 Click a cell to place a queen! Attack ranges are shown in red. Or click "Step" to watch the backtracking process step by step.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">How many solutions does 4-Queen have? What about 8-Queen?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        4-Queen has <strong>2 solutions</strong> (including symmetry).<br>
                        8-Queen has <strong>92 solutions</strong>!<br><br>
                        As N grows, the number of cases explodes,
                        but backtracking + pruning lets us search efficiently.
                    </div>
                </div>
            </div>

            <!-- 7. 4 Steps to Solve Backtracking Problems -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">7</span> 4 Steps to Solve Backtracking Problems</div>
                <div class="step-cards">
                    <div class="step-card">
                        <span class="step-num">1</span>
                        <h4>Identify Choices</h4>
                        <p>Figure out what options are available at each step</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">2</span>
                        <h4>Define Constraints</h4>
                        <p>Create conditions to check whether a choice is valid (pruning criteria)</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">3</span>
                        <h4>Recurse to Next Step</h4>
                        <p>After committing to a choice, recurse to proceed to the next step</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">4</span>
                        <h4>Undo (Backtrack)</h4>
                        <p>When recursion returns, undo the choice and try a different one</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">Apply the 4 steps above to the N-Queen problem. (Place N queens on an NxN board so none attack each other)</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>1. Choices:</strong> Column number (0 ~ N-1) to place a queen in each row<br>
                        <strong>2. Constraints:</strong> No queen in the same column, and no queen on the diagonals<br>
                        <strong>3. Recurse:</strong> Place a queen in the current row, then move to the next row<br>
                        <strong>4. Undo:</strong> If the next row fails, move the current row's queen to a different column<br><br>
                        Remember this pattern well! You can see it in action in the Simulation tab.
                    </div>
                </div>
            </div>
        `;

        this._initConceptInteractions(container);
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });

        var treeContainer = container.querySelector('#bt-decision-tree');
        var instructionEl = container.querySelector('#bt-tree-instruction');
        var resultsEl = container.querySelector('#bt-tree-results');
        var resetBtn = container.querySelector('#bt-tree-reset');

        if (treeContainer) {
            this._buildDecisionTree(treeContainer, instructionEl, resultsEl, resetBtn);
        }

        // ========== Demo 2: 3-element follow ==========
        {
            var poolEl = container.querySelector('#bt-demo-3elem-pool');
            var pathEl = container.querySelector('#bt-demo-3elem-path');
            var usedEl = container.querySelector('#bt-demo-3elem-used');
            var resultsEl2 = container.querySelector('#bt-demo-3elem-results');
            var msgEl = container.querySelector('#bt-demo-3elem-msg');
            var nextBtn2 = container.querySelector('#bt-demo-3elem-next');
            var resetBtn2 = container.querySelector('#bt-demo-3elem-reset');

            if (poolEl && nextBtn2) {
                var nums = [1, 2, 3];
                var M3 = 2;
                var allSteps = [];
                (function buildSteps3() {
                    var used3 = [false, false, false];
                    var path3 = [];
                    function gen(depth) {
                        for (var i = 0; i < 3; i++) {
                            if (used3[i]) {
                                allSteps.push({ type: 'skip', idx: i, path: path3.slice(), used: used3.slice(), reason: nums[i] + ' is already in use (used[' + i + ']=true), skip it — ✅ Check Constraints' });
                                continue;
                            }
                            allSteps.push({ type: 'choose', idx: i, path: path3.slice(), used: used3.slice(), reason: 'Choose ' + nums[i] + ' — ☝️ Choose' });
                            path3.push(nums[i]);
                            used3[i] = true;
                            if (depth + 1 === M3) {
                                allSteps.push({ type: 'found', idx: i, path: path3.slice(), used: used3.slice(), reason: '[' + path3.join(', ') + '] complete!' });
                                allSteps.push({ type: 'undo', idx: i, path: path3.slice(), used: used3.slice(), reason: 'Undo ' + nums[i] + ' — ↩️ Backtrack' });
                                path3.pop();
                                used3[i] = false;
                            } else {
                                gen(depth + 1);
                                allSteps.push({ type: 'undo', idx: i, path: path3.slice(), used: used3.slice(), reason: 'Undo ' + nums[i] + ' — ↩️ Backtrack' });
                                path3.pop();
                                used3[i] = false;
                            }
                        }
                    }
                    gen(0);
                    allSteps.push({ type: 'done', idx: -1, path: [], used: [false, false, false], reason: 'All cases explored!' });
                })();

                var stepIdx3 = -1;
                var foundResults3 = [];

                function makeBox(val, cls) {
                    return '<div style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;font-weight:700;font-size:1rem;' +
                        (cls === 'used' ? 'background:var(--accent);color:white;' :
                         cls === 'skip' ? 'background:var(--red);color:white;opacity:0.6;' :
                         cls === 'choose' ? 'background:var(--yellow);color:#333;box-shadow:0 0 8px var(--yellow);' :
                         cls === 'undo' ? 'background:var(--bg2);color:var(--text3);border:2px dashed var(--red);' :
                         'background:var(--bg2);color:var(--text);border:1px solid var(--border);') +
                        '">' + val + '</div>';
                }

                function render3(step) {
                    poolEl.innerHTML = '';
                    for (var i = 0; i < 3; i++) {
                        var cls = '';
                        if (step && step.used[i]) cls = 'used';
                        if (step && step.type === 'skip' && step.idx === i) cls = 'skip';
                        if (step && step.type === 'choose' && step.idx === i) cls = 'choose';
                        if (step && step.type === 'undo' && step.idx === i) cls = 'undo';
                        poolEl.innerHTML += makeBox(nums[i], cls);
                    }
                    if (!step || step.path.length === 0) {
                        pathEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">Empty</span>';
                    } else {
                        pathEl.innerHTML = step.path.map(function(v) { return makeBox(v, 'used'); }).join('');
                    }
                    if (step) {
                        usedEl.innerHTML = '<span style="font-size:0.75rem;color:var(--text3);">used = [' +
                            step.used.map(function(u, i) { return '<span style="color:' + (u ? 'var(--accent);font-weight:700' : 'var(--text3)') + ';">' + (u ? 'T' : 'F') + '</span>'; }).join(', ') + ']</span>';
                    } else {
                        usedEl.innerHTML = '<span style="font-size:0.75rem;color:var(--text3);">used = [F, F, F]</span>';
                    }
                    resultsEl2.innerHTML = foundResults3.map(function(r) {
                        return '<span style="display:inline-block;padding:3px 10px;background:var(--green);color:white;border-radius:6px;font-size:0.82rem;font-weight:600;">[' + r.join(', ') + ']</span>';
                    }).join(' ');
                    if (step) {
                        msgEl.textContent = step.reason;
                        msgEl.style.borderLeftColor = step.type === 'choose' ? 'var(--yellow)' : step.type === 'undo' ? 'var(--red)' : step.type === 'found' ? 'var(--green)' : step.type === 'skip' ? 'var(--red)' : 'var(--accent)';
                    }
                }

                render3(null);

                nextBtn2.addEventListener('click', function() {
                    if (stepIdx3 >= allSteps.length - 1) return;
                    stepIdx3++;
                    var step = allSteps[stepIdx3];
                    if (step.type === 'found') foundResults3.push(step.path.slice());
                    render3(step);
                    if (stepIdx3 >= allSteps.length - 1) {
                        nextBtn2.disabled = true;
                    }
                });

                resetBtn2.addEventListener('click', function() {
                    stepIdx3 = -1;
                    foundResults3 = [];
                    nextBtn2.disabled = false;
                    msgEl.textContent = '👆 Click "Next Step" to follow how Choose/Check/Undo work step by step!';
                    msgEl.style.borderLeftColor = '';
                    render3(null);
                });
            }
        }

        // ========== Demo 3: Cycle prevention (used array) ==========
        {
            var cycleUsedEl = container.querySelector('#bt-demo-cycle-used');
            var cyclePathEl = container.querySelector('#bt-demo-cycle-path');
            var cycleMsgEl = container.querySelector('#bt-demo-cycle-msg');
            var cycleClearBtn = container.querySelector('#bt-demo-cycle-clear');
            var cycleBtn1 = container.querySelector('#bt-demo-cycle-toggle1');
            var cycleBtn2 = container.querySelector('#bt-demo-cycle-toggle2');
            var cycleBtn3 = container.querySelector('#bt-demo-cycle-toggle3');

            if (cycleUsedEl && cycleBtn1) {
                var cycleUsed = [false, false, false];
                var cyclePath = [];

                function renderCycleDemo() {
                    cycleUsedEl.innerHTML = '';
                    for (var i = 0; i < 3; i++) {
                        cycleUsedEl.innerHTML += '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;">' +
                            '<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:8px;font-weight:700;font-size:1rem;' +
                            (cycleUsed[i] ? 'background:var(--accent);color:white;box-shadow:0 0 8px var(--accent);' : 'background:var(--bg2);color:var(--text);border:1px solid var(--border);') +
                            '">' + (i + 1) + '</div>' +
                            '<span style="font-size:0.7rem;color:' + (cycleUsed[i] ? 'var(--accent)' : 'var(--text3)') + ';">' + (cycleUsed[i] ? 'true' : 'false') + '</span></div>';
                    }
                    cyclePathEl.textContent = cyclePath.length > 0 ? '[ ' + cyclePath.join(', ') + ' ]' : '[ ]';
                }

                function cycleSelect(idx) {
                    if (cycleUsed[idx]) {
                        cycleMsgEl.textContent = '❌ used[' + idx + '] = true → ' + (idx + 1) + ' is already in use! Skip. This is how duplicates are prevented.';
                        cycleMsgEl.style.borderLeftColor = 'var(--red)';
                        var boxes = cycleUsedEl.querySelectorAll('div > div');
                        if (boxes[idx]) {
                            boxes[idx].style.background = 'var(--red)';
                            setTimeout(function() { renderCycleDemo(); }, 500);
                        }
                        return;
                    }
                    cycleUsed[idx] = true;
                    cyclePath.push(idx + 1);
                    cycleMsgEl.textContent = '✅ Selected ' + (idx + 1) + '! used[' + idx + '] = true. Path: [' + cyclePath.join(', ') + ']';
                    cycleMsgEl.style.borderLeftColor = 'var(--green)';
                    renderCycleDemo();
                }

                renderCycleDemo();

                cycleBtn1.addEventListener('click', function() { cycleSelect(0); });
                cycleBtn2.addEventListener('click', function() { cycleSelect(1); });
                cycleBtn3.addEventListener('click', function() { cycleSelect(2); });
                cycleClearBtn.addEventListener('click', function() {
                    cycleUsed = [false, false, false];
                    cyclePath = [];
                    cycleMsgEl.textContent = '👆 Click the number buttons to select them! If you click an already-selected number, the used array will block it.';
                    cycleMsgEl.style.borderLeftColor = '';
                    renderCycleDemo();
                });
            }
        }

        // ========== Demo 4: Pruning comparison ==========
        {
            var pruneNopEl = container.querySelector('#bt-demo-prune-nop');
            var pruneYesEl = container.querySelector('#bt-demo-prune-yes');
            var pruneNopCount = container.querySelector('#bt-demo-prune-nop-count');
            var pruneYesCount = container.querySelector('#bt-demo-prune-yes-count');
            var pruneRunBtn = container.querySelector('#bt-demo-prune-run');
            var pruneResetBtn = container.querySelector('#bt-demo-prune-reset');
            var pruneMsgEl = container.querySelector('#bt-demo-prune-msg');

            if (pruneNopEl && pruneRunBtn) {
                var pruneAnimating = false;

                pruneRunBtn.addEventListener('click', function() {
                    if (pruneAnimating) return;
                    pruneAnimating = true;
                    pruneRunBtn.disabled = true;
                    pruneNopEl.innerHTML = '';
                    pruneYesEl.innerHTML = '';

                    var nopTraces = [];
                    for (var i = 1; i <= 3; i++) {
                        for (var j = 1; j <= 3; j++) {
                            var ok = i !== j;
                            nopTraces.push({ text: i + ' → ' + j, ok: ok, reason: ok ? '✓ Valid' : '✕ Duplicate' });
                        }
                    }
                    var yesTraces = [];
                    for (var i = 1; i <= 3; i++) {
                        for (var j = 1; j <= 3; j++) {
                            if (i === j) {
                                yesTraces.push({ text: i + ' → ' + j, ok: false, skip: true, reason: '✂️ Skipped' });
                            } else {
                                yesTraces.push({ text: i + ' → ' + j, ok: true, skip: false, reason: '✓ Valid' });
                            }
                        }
                    }

                    var maxLen = Math.max(nopTraces.length, yesTraces.length);
                    var nopCount = 0, yesCount = 0;
                    var idx = 0;

                    function animStep() {
                        if (idx >= maxLen) {
                            pruneMsgEl.textContent = 'Done! Without pruning: ' + nopCount + ' explorations, with pruning: only ' + yesCount + '. Saved: ' + (nopCount - yesCount) + '!';
                            pruneMsgEl.style.borderLeftColor = 'var(--green)';
                            pruneAnimating = false;
                            return;
                        }
                        if (idx < nopTraces.length) {
                            var t = nopTraces[idx];
                            nopCount++;
                            var div = document.createElement('div');
                            div.textContent = t.text + ' ' + t.reason;
                            div.style.cssText = 'padding:2px 6px;border-radius:4px;' + (t.ok ? 'color:var(--green);' : 'color:var(--red);');
                            pruneNopEl.appendChild(div);
                            pruneNopCount.textContent = 'Explored: ' + nopCount;
                        }
                        if (idx < yesTraces.length) {
                            var t2 = yesTraces[idx];
                            var div2 = document.createElement('div');
                            if (t2.skip) {
                                div2.textContent = t2.text + ' ' + t2.reason;
                                div2.style.cssText = 'padding:2px 6px;border-radius:4px;color:var(--text3);text-decoration:line-through;opacity:0.5;';
                            } else {
                                yesCount++;
                                div2.textContent = t2.text + ' ' + t2.reason;
                                div2.style.cssText = 'padding:2px 6px;border-radius:4px;color:var(--green);';
                            }
                            pruneYesEl.appendChild(div2);
                            pruneYesCount.textContent = 'Explored: ' + yesCount;
                        }
                        idx++;
                        setTimeout(animStep, 300);
                    }
                    animStep();
                });

                pruneResetBtn.addEventListener('click', function() {
                    pruneAnimating = false;
                    pruneRunBtn.disabled = false;
                    pruneNopEl.innerHTML = '';
                    pruneYesEl.innerHTML = '';
                    pruneNopCount.textContent = 'Explored: 0';
                    pruneYesCount.textContent = 'Explored: 0';
                    pruneMsgEl.textContent = '👆 Click "Start Search" to compare how pruning reduces the search space!';
                    pruneMsgEl.style.borderLeftColor = '';
                });
            }
        }

        // ========== Demo 5: Execution comparison (N,M) ==========
        {
            var execRunBtn = container.querySelector('#bt-demo-exec-run');
            var execNInput = container.querySelector('#bt-demo-exec-n');
            var execMInput = container.querySelector('#bt-demo-exec-m');
            var execBarBrute = container.querySelector('#bt-demo-exec-bar-brute');
            var execBarBt = container.querySelector('#bt-demo-exec-bar-bt');
            var execValBrute = container.querySelector('#bt-demo-exec-val-brute');
            var execValBt = container.querySelector('#bt-demo-exec-val-bt');
            var execSaved = container.querySelector('#bt-demo-exec-saved');
            var execMsgEl = container.querySelector('#bt-demo-exec-msg');

            if (execRunBtn && execNInput) {
                execRunBtn.addEventListener('click', function() {
                    var N = parseInt(execNInput.value) || 4;
                    var M = parseInt(execMInput.value) || 2;
                    if (N < 2) N = 2; if (N > 8) N = 8;
                    if (M < 1) M = 1; if (M > N) M = N; if (M > 6) M = 6;
                    execNInput.value = N;
                    execMInput.value = M;

                    var bruteCount = Math.pow(N, M);
                    var btCount = 1;
                    for (var i = 0; i < M; i++) btCount *= (N - i);

                    var maxVal = Math.max(bruteCount, btCount);
                    var maxH = 160;

                    execBarBrute.style.height = Math.max(10, Math.round(bruteCount / maxVal * maxH)) + 'px';
                    execBarBt.style.height = Math.max(10, Math.round(btCount / maxVal * maxH)) + 'px';
                    execValBrute.textContent = bruteCount.toLocaleString();
                    execValBt.textContent = btCount.toLocaleString();

                    var saved = bruteCount - btCount;
                    var pct = bruteCount > 0 ? Math.round(saved / bruteCount * 100) : 0;
                    execSaved.textContent = saved > 0 ? (saved.toLocaleString() + ' saved (' + pct + '%)') : 'Same';

                    execMsgEl.textContent = 'N=' + N + ', M=' + M + ' → Brute force: ' + bruteCount.toLocaleString() + ', Backtracking: ' + btCount.toLocaleString() + '. ' + (saved > 0 ? pct + '% saved!' : '');
                    execMsgEl.style.borderLeftColor = 'var(--accent)';
                });
            }
        }

        // ========== Demo 6: 4-Queen ==========
        {
            var boardEl = container.querySelector('#bt-demo-4q-board');
            var autoBtn = container.querySelector('#bt-demo-4q-auto');
            var clearBtn4q = container.querySelector('#bt-demo-4q-clear');
            var placedEl = container.querySelector('#bt-demo-4q-placed');
            var triesEl = container.querySelector('#bt-demo-4q-tries');
            var backsEl = container.querySelector('#bt-demo-4q-backs');
            var msgEl4q = container.querySelector('#bt-demo-4q-msg');

            if (boardEl && autoBtn) {
                var N4 = 4;
                var queens = [];
                var tries4q = 0, backs4q = 0;
                var autoRunning = false;

                function isSafe(r, c, qs) {
                    for (var k = 0; k < qs.length; k++) {
                        var q = qs[k];
                        if (q.c === c) return false;
                        if (Math.abs(q.r - r) === Math.abs(q.c - c)) return false;
                    }
                    return true;
                }

                function getAttacked(qs) {
                    var set = {};
                    for (var k = 0; k < qs.length; k++) {
                        var q = qs[k];
                        for (var i = 0; i < N4; i++) {
                            for (var j = 0; j < N4; j++) {
                                if (i === q.r && j === q.c) continue;
                                if (i === q.r || j === q.c || Math.abs(i - q.r) === Math.abs(j - q.c)) {
                                    set[i + ',' + j] = true;
                                }
                            }
                        }
                    }
                    return set;
                }

                function renderBoard(highlight) {
                    boardEl.innerHTML = '';
                    boardEl.style.cssText = 'display:inline-grid;grid-template-columns:repeat(4,1fr);gap:2px;margin:0 auto;';
                    var attacked = getAttacked(queens);
                    for (var r = 0; r < N4; r++) {
                        for (var c = 0; c < N4; c++) {
                            var cell = document.createElement('div');
                            var isQueen = queens.some(function(q) { return q.r === r && q.c === c; });
                            var isAttacked = attacked[r + ',' + c];
                            var isHighlight = highlight && highlight.r === r && highlight.c === c;
                            cell.style.cssText = 'width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-size:1.4rem;cursor:pointer;transition:all 0.2s;border:2px solid transparent;' +
                                ((r + c) % 2 === 0 ? 'background:var(--bg2);' : 'background:var(--bg3,var(--border));') +
                                (isQueen ? 'background:var(--accent);border-color:var(--accent);box-shadow:0 0 10px var(--accent);' : '') +
                                (isAttacked && !isQueen ? 'background:rgba(231,76,60,0.15);border-color:rgba(231,76,60,0.3);' : '') +
                                (isHighlight ? 'background:var(--yellow);border-color:var(--yellow);box-shadow:0 0 12px var(--yellow);' : '');
                            cell.textContent = isQueen ? '♛' : '';
                            cell.dataset.r = r;
                            cell.dataset.c = c;
                            if (!autoRunning) {
                                (function(rr, cc) {
                                    cell.addEventListener('click', function() {
                                        handleCellClick(rr, cc);
                                    });
                                })(r, c);
                            }
                            boardEl.appendChild(cell);
                        }
                    }
                    placedEl.textContent = queens.length;
                    triesEl.textContent = tries4q;
                    backsEl.textContent = backs4q;
                }

                function handleCellClick(r, c) {
                    if (autoRunning) return;
                    var existIdx = -1;
                    for (var k = 0; k < queens.length; k++) {
                        if (queens[k].r === r && queens[k].c === c) { existIdx = k; break; }
                    }
                    if (existIdx >= 0) {
                        queens.splice(existIdx, 1);
                        msgEl4q.textContent = '♛ Removed queen at (' + r + ',' + c + ').';
                        renderBoard(null);
                        return;
                    }
                    for (var k = 0; k < queens.length; k++) {
                        if (queens[k].r === r) {
                            msgEl4q.textContent = '❌ Row ' + r + ' already has a queen! Only one per row.';
                            msgEl4q.style.borderLeftColor = 'var(--red)';
                            return;
                        }
                    }
                    tries4q++;
                    if (!isSafe(r, c, queens)) {
                        msgEl4q.textContent = '❌ (' + r + ',' + c + ') is in another queen\'s attack range! Check columns and diagonals.';
                        msgEl4q.style.borderLeftColor = 'var(--red)';
                        renderBoard({ r: r, c: c });
                        setTimeout(function() { renderBoard(null); }, 600);
                        return;
                    }
                    queens.push({ r: r, c: c });
                    if (queens.length === N4) {
                        msgEl4q.textContent = '🎉 Success! All 4 queens placed safely!';
                        msgEl4q.style.borderLeftColor = 'var(--green)';
                    } else {
                        msgEl4q.textContent = '✅ Queen placed at (' + r + ',' + c + '). Red areas show attack ranges. (' + queens.length + '/4)';
                        msgEl4q.style.borderLeftColor = 'var(--accent)';
                    }
                    renderBoard(null);
                }

                // Step-by-step solve with backtracking
                var solveState = { steps: null, stepIdx: -1 };

                function buildSolveSteps() {
                    var steps = [];
                    function solve4(row, qs) {
                        if (row === N4) {
                            steps.push({ type: 'done', queens: qs.slice() });
                            return true;
                        }
                        for (var c = 0; c < N4; c++) {
                            steps.push({ type: 'try', r: row, c: c, queens: qs.slice() });
                            if (isSafe(row, c, qs)) {
                                qs.push({ r: row, c: c });
                                steps.push({ type: 'place', r: row, c: c, queens: qs.slice() });
                                if (solve4(row + 1, qs)) return true;
                                qs.pop();
                                steps.push({ type: 'back', r: row, c: c, queens: qs.slice() });
                            } else {
                                steps.push({ type: 'fail', r: row, c: c, queens: qs.slice() });
                            }
                        }
                        return false;
                    }
                    solve4(0, []);
                    return steps;
                }

                function applyStep(s) {
                    queens = s.queens.slice();
                    if (s.type === 'try') {
                        tries4q++;
                        msgEl4q.textContent = 'Trying row ' + s.r + ', col ' + s.c + '...';
                        msgEl4q.style.borderLeftColor = 'var(--yellow)';
                        renderBoard({ r: s.r, c: s.c });
                    } else if (s.type === 'place') {
                        msgEl4q.textContent = 'Placed queen at (' + s.r + ',' + s.c + ')! (' + queens.length + '/4)';
                        msgEl4q.style.borderLeftColor = 'var(--green)';
                        renderBoard(null);
                    } else if (s.type === 'fail') {
                        msgEl4q.textContent = '(' + s.r + ',' + s.c + ') in attack range — skip';
                        msgEl4q.style.borderLeftColor = 'var(--red)';
                        renderBoard({ r: s.r, c: s.c });
                    } else if (s.type === 'back') {
                        backs4q++;
                        msgEl4q.textContent = 'Backtrack from (' + s.r + ',' + s.c + ')! Try another column';
                        msgEl4q.style.borderLeftColor = 'var(--red)';
                        renderBoard(null);
                    } else if (s.type === 'done') {
                        msgEl4q.textContent = 'Solved! ' + tries4q + ' attempts, ' + backs4q + ' backtracks. Backtracking found it efficiently!';
                        msgEl4q.style.borderLeftColor = 'var(--green)';
                        renderBoard(null);
                    }
                }

                autoBtn.addEventListener('click', function() {
                    // First click: build steps and enter step mode
                    if (!solveState.steps) {
                        autoRunning = true;
                        queens = [];
                        tries4q = 0;
                        backs4q = 0;
                        renderBoard(null);
                        solveState.steps = buildSolveSteps();
                        solveState.stepIdx = -1;
                    }
                    // Advance one step
                    solveState.stepIdx++;
                    if (solveState.stepIdx >= solveState.steps.length) {
                        // Already finished, do nothing
                        solveState.stepIdx = solveState.steps.length - 1;
                        return;
                    }
                    applyStep(solveState.steps[solveState.stepIdx]);
                    // If done, allow reset
                    if (solveState.stepIdx >= solveState.steps.length - 1) {
                        autoRunning = false;
                    }
                });

                clearBtn4q.addEventListener('click', function() {
                    autoRunning = false;
                    solveState.steps = null;
                    solveState.stepIdx = -1;
                    queens = [];
                    tries4q = 0;
                    backs4q = 0;
                    msgEl4q.textContent = '👆 Click a cell to place a queen! Attack ranges are shown in red. Or click "Step" to watch the backtracking process step by step.';
                    msgEl4q.style.borderLeftColor = '';
                    renderBoard(null);
                });

                renderBoard(null);
            }
        }
    },
    _buildDecisionTree(treeContainer, instructionEl, resultsEl, resetBtn) {
        var N = 3, M = 2;
        var results = [];
        var currentDepth = 0;
        var path = [];
        var nodeData = [];

        var renderTree = function() {
            treeContainer.innerHTML = '';
            nodeData = [];
            var rootRow = document.createElement('div');
            rootRow.className = 'bt-tree-row';
            var rootNode = document.createElement('div');
            rootNode.className = 'bt-tree-node expanded';
            rootNode.textContent = 'Start';
            rootRow.appendChild(rootNode);
            treeContainer.appendChild(rootRow);

            var level1Row = document.createElement('div');
            level1Row.className = 'bt-tree-row';
            for (var i = 1; i <= N; i++) {
                var node = document.createElement('div');
                node.className = 'bt-tree-node';
                node.textContent = i;
                node.dataset.depth = '0';
                node.dataset.value = i;
                if (currentDepth === 0 && path.length === 0) {
                    (function(val) { node.addEventListener('click', function() { selectNode(0, val); }); })(i);
                } else if (path.length > 0 && path[0] === i) {
                    node.classList.add('expanded');
                } else if (path.length > 0) {
                    node.classList.add('disabled');
                }
                level1Row.appendChild(node);
                nodeData.push({ depth: 0, value: i, el: node });
            }
            treeContainer.appendChild(level1Row);

            if (path.length >= 1) {
                var level2Row = document.createElement('div');
                level2Row.className = 'bt-tree-row';
                for (var i = 1; i <= N; i++) {
                    var node = document.createElement('div');
                    node.dataset.depth = '1';
                    node.dataset.value = i;
                    if (i === path[0]) {
                        node.className = 'bt-tree-node pruned';
                        node.textContent = i + '✕';
                    } else if (path.length === 2 && path[1] === i) {
                        node.className = 'bt-tree-node leaf';
                        node.textContent = path[0] + ',' + i;
                    } else if (path.length === 1) {
                        node.className = 'bt-tree-node';
                        node.textContent = i;
                        (function(val) { node.addEventListener('click', function() { selectNode(1, val); }); })(i);
                    } else {
                        node.className = 'bt-tree-node disabled';
                        node.textContent = i;
                    }
                    level2Row.appendChild(node);
                    nodeData.push({ depth: 1, value: i, el: node });
                }
                treeContainer.appendChild(level2Row);
            }
        };

        var selectNode = function(depth, value) {
            if (depth === 0) {
                path = [value];
                currentDepth = 1;
                instructionEl.textContent = 'You chose ' + value + ' as the first number. Now pick the second!';
            } else if (depth === 1) {
                path = [path[0], value];
                results.push(path.slice());
                updateResults();
                instructionEl.textContent = '[' + path.join(', ') + '] complete! Click to backtrack';
                currentDepth = 2;
            }
            renderTree();
            if (depth === 1) {
                setTimeout(function() {
                    if (currentDepth !== 2) return;
                    doBacktrack();
                }, 1200);
            }
        };

        var doBacktrack = function() {
            if (path.length === 2) {
                var first = path[0];
                var second = path[1];
                var nextSecond = null;
                for (var i = second + 1; i <= N; i++) {
                    if (i !== first) { nextSecond = i; break; }
                }
                if (nextSecond) {
                    path = [first];
                    currentDepth = 1;
                    instructionEl.textContent = 'Backtracked! Pick the next second number';
                    renderTree();
                } else {
                    var nextFirst = null;
                    for (var i = first + 1; i <= N; i++) { nextFirst = i; break; }
                    if (nextFirst) {
                        path = [];
                        currentDepth = 0;
                        instructionEl.textContent = 'Backtracked the first choice too! Pick the next first number';
                        renderTree();
                    } else {
                        path = [];
                        currentDepth = -1;
                        instructionEl.textContent = '✅ Found all cases! Total: ' + results.length;
                        resetBtn.classList.remove('hidden');
                        renderTree();
                    }
                }
            }
        };

        var updateResults = function() {
            resultsEl.innerHTML = 'Found sequences: ' + results.map(function(r) { return '<span class="bt-result-tag">[' + r.join(', ') + ']</span>'; }).join(' ');
        };

        resetBtn.addEventListener('click', function() {
            results.length = 0;
            path = [];
            currentDepth = 0;
            resultsEl.innerHTML = '';
            instructionEl.textContent = '👆 Click a node to make a selection!';
            resetBtn.classList.add('hidden');
            renderTree();
        });

        renderTree();
    },

    // ===== Visualization Rendering (Concept Tab Only) =====
    renderVisualize(container) {
        var self = this;
        var suffix = '-concept-bt';
        container.innerHTML =
            '<h2>Backtracking Visualization</h2>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Backtracking process for generating permutations with N=4, M=2.</p>' +
            self._createStepDesc(suffix) +
            '<div id="bt-path' + suffix + '" style="text-align:center;font-size:1.2rem;font-weight:600;margin-bottom:8px;">path = [ ]</div>' +
            '<div id="bt-used' + suffix + '" style="text-align:center;margin-bottom:12px;"></div>' +
            '<div id="bt-results' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;min-height:36px;margin-bottom:12px;text-align:center;"></div>' +
            self._createStepControls(suffix);
        var pathEl = container.querySelector('#bt-path' + suffix);
        var usedEl = container.querySelector('#bt-used' + suffix);
        var resultsEl = container.querySelector('#bt-results' + suffix);
        var N = 4, M = 2;
        function renderUsed(used) {
            usedEl.innerHTML = '';
            for (var i = 1; i <= N; i++) {
                usedEl.innerHTML += '<span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;margin:2px;border-radius:6px;font-weight:600;' + (used[i] ? 'background:var(--accent);color:white;' : 'background:var(--bg2);') + '">' + i + '</span>';
            }
        }
        renderUsed([false, false, false, false, false]);
        resultsEl.innerHTML = '<span style="color:var(--text3);">Found sequences will appear here</span>';
        var steps = [];
        var path = [], used = [false, false, false, false, false];
        var foundResults = [];
        var solve = function(depth) {
            if (depth === M) {
                var snap = path.slice();
                var rc = foundResults.length + 1;
                foundResults.push(snap);
                (function(snap, rc) {
                    steps.push({
                        description: 'Sequence [' + snap.join(', ') + '] complete! (#' + rc + ')',
                        action: function() {
                            pathEl.textContent = 'path = [ ' + snap.join(', ') + ' ] ✓';
                            pathEl.style.color = 'var(--green)';
                            resultsEl.innerHTML = foundResults.slice(0, rc).map(function(r) { return '<span style="display:inline-block;padding:4px 8px;margin:2px;background:var(--green)15;border-radius:6px;font-size:0.85rem;">[' + r.join(', ') + ']</span>'; }).join(' ');
                        },
                        undo: function() {
                            var prev = snap.slice(0, -1);
                            pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]';
                            pathEl.style.color = '';
                            resultsEl.innerHTML = foundResults.slice(0, rc - 1).length > 0 ? foundResults.slice(0, rc - 1).map(function(r) { return '<span style="display:inline-block;padding:4px 8px;margin:2px;background:var(--green)15;border-radius:6px;font-size:0.85rem;">[' + r.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">Found sequences will appear here</span>';
                        }
                    });
                })(snap, rc);
                return;
            }
            for (var i = 1; i <= N; i++) {
                if (used[i]) {
                    (function(ci, snapPath, snapUsed) {
                        steps.push({
                            description: 'Number ' + ci + ' is already in use → Skip',
                            action: function() { pathEl.textContent = 'path = [ ' + snapPath.join(', ') + (snapPath.length > 0 ? ', ' : '') + ci + '? ]'; pathEl.style.color = 'var(--red)'; setTimeout(function() { pathEl.textContent = 'path = [ ' + (snapPath.length > 0 ? snapPath.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = ''; }, 300); renderUsed(snapUsed); },
                            undo: function() { pathEl.textContent = 'path = [ ' + (snapPath.length > 0 ? snapPath.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = ''; renderUsed(snapUsed); }
                        });
                    })(i, path.slice(), used.slice());
                    continue;
                }
                used[i] = true;
                path.push(i);
                (function(ci, snapPath, snapUsed) {
                    steps.push({
                        description: 'Choose number ' + ci + ' → path = [' + snapPath.join(', ') + ']',
                        action: function() { pathEl.textContent = 'path = [ ' + snapPath.join(', ') + (snapPath.length < M ? ', ___' : '') + ' ]'; pathEl.style.color = ''; renderUsed(snapUsed); },
                        undo: function() { var prev = snapPath.slice(0, -1); pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]'; var prevUsed = snapUsed.slice(); prevUsed[ci] = false; renderUsed(prevUsed); }
                    });
                })(i, path.slice(), used.slice());
                solve(depth + 1);
                path.pop();
                used[i] = false;
                (function(ci, snapPath, snapUsed) {
                    steps.push({
                        description: 'Undo number ' + ci + ' → path = [' + (snapPath.length > 0 ? snapPath.join(', ') + ', ___' : '___') + ']',
                        action: function() { pathEl.textContent = 'path = [ ' + (snapPath.length > 0 ? snapPath.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = ''; renderUsed(snapUsed); },
                        undo: function() { var restored = snapPath.slice(); restored.push(ci); pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ]'; var restoredUsed = snapUsed.slice(); restoredUsed[ci] = true; renderUsed(restoredUsed); }
                    });
                })(i, path.slice(), used.slice());
            }
        };
        solve(0);
        steps.push({ description: 'Search complete! Total:' + foundResults.length + ' sequences found', action: function() {}, undo: function() {} });
        self._initStepController(container, steps, suffix);
    },

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
    // Decision Tree Common Rendering Helpers
    // ====================================================================
    _layoutTree(nodes) {
        var nodeW = 42, nodeH = 42, gapX = 6, gapY = 56;
        var maxDepth = 0;
        for (var i = 0; i < nodes.length; i++) if (nodes[i].depth > maxDepth) maxDepth = nodes[i].depth;
        var byId = {};
        for (var i = 0; i < nodes.length; i++) byId[nodes[i].id] = nodes[i];
        var leafX = 0;
        function layout(nid) {
            var n = byId[nid];
            if (!n.children || n.children.length === 0) {
                n.x = leafX; leafX += nodeW + gapX;
                n.y = n.depth * gapY;
                return;
            }
            for (var c = 0; c < n.children.length; c++) layout(n.children[c]);
            var first = byId[n.children[0]], last = byId[n.children[n.children.length - 1]];
            n.x = (first.x + last.x) / 2;
            n.y = n.depth * gapY;
        }
        layout(nodes[0].id);
        var totalW = leafX - gapX + nodeW;
        var totalH = (maxDepth + 1) * gapY + nodeH;
        return { totalW: totalW, totalH: totalH, nodeW: nodeW, nodeH: nodeH };
    },

    _renderTree(container, nodes, suffix) {
        var byId = {};
        for (var i = 0; i < nodes.length; i++) byId[nodes[i].id] = nodes[i];
        var dims = this._layoutTree(nodes);
        var treeEl = container.querySelector('#sim-tree' + suffix);
        if (!treeEl) return;
        treeEl.innerHTML = '';
        treeEl.style.width = dims.totalW + 'px';
        treeEl.style.height = dims.totalH + 'px';
        treeEl.style.minWidth = dims.totalW + 'px';
        var svgNS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'sim-tree-edges');
        svg.setAttribute('width', dims.totalW);
        svg.setAttribute('height', dims.totalH);
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.parentId !== null) {
                var p = byId[n.parentId];
                var line = document.createElementNS(svgNS, 'line');
                line.setAttribute('x1', p.x + dims.nodeW / 2);
                line.setAttribute('y1', p.y + dims.nodeH);
                line.setAttribute('x2', n.x + dims.nodeW / 2);
                line.setAttribute('y2', n.y);
                line.id = 'edge' + suffix + '-' + n.id;
                svg.appendChild(line);
            }
        }
        treeEl.appendChild(svg);
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            var div = document.createElement('div');
            div.className = 'sim-tree-node node-hidden';
            if (n.isRoot) div.className += ' node-root';
            if (n.isLeaf) div.className += ' node-leaf';
            div.id = 'tnode' + suffix + '-' + n.id;
            div.style.left = n.x + 'px';
            div.style.top = n.y + 'px';
            div.textContent = n.label;
            treeEl.appendChild(div);
        }
    },

    _setNodeState(container, suffix, nodeId, state) {
        var el = container.querySelector('#tnode' + suffix + '-' + nodeId);
        if (!el) return;
        el.className = el.className.replace(/node-hidden|node-current|node-visited|node-complete|node-backtracked|node-pruned/g, '').trim();
        if (state) el.className += ' ' + state;
    },

    _setEdgeState(container, suffix, nodeId, state) {
        var el = container.querySelector('#edge' + suffix + '-' + nodeId);
        if (!el) return;
        el.className.baseVal = (el.className.baseVal || '').replace(/edge-active|edge-complete|edge-backtracked/g, '').trim();
        if (state) el.className.baseVal += ' ' + state;
    },

    _applyTreeSnapshot(container, suffix, snapshot) {
        for (var id in snapshot) {
            this._setNodeState(container, suffix, id, snapshot[id].node);
            if (snapshot[id].edge) this._setEdgeState(container, suffix, id, snapshot[id].edge);
        }
    },

    // ====================================================================
    // Common: NM Decision Tree Simulation Builder
    // ====================================================================
    _buildNMTreeViz(contentEl, opts) {
        var self = this;
        var suffix = opts.suffix;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">' + opts.title + '</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="bt' + suffix + '-n" value="' + opts.defaultN + '" min="1" max="' + opts.maxN + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">M: <input type="number" id="bt' + suffix + '-m" value="' + opts.defaultM + '" min="1" max="' + opts.maxM + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt' + suffix + '-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div class="sim-card" style="padding:1.5rem;margin-bottom:12px;">' +
            '<div class="sim-tree-wrapper"><div id="sim-tree' + suffix + '" style="position:relative;"></div></div>' +
            '<div id="nm-path' + suffix + '" class="sim-tree-path-display">path = [ ]</div>' +
            '</div>' +
            '<div id="nm-results' + suffix + '" class="sim-tree-results"><span style="color:var(--text3);">' + opts.emptyLabel + '</span></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm-path' + suffix);
        var resultsEl = contentEl.querySelector('#nm-results' + suffix);
        var inputN = contentEl.querySelector('#bt' + suffix + '-n');
        var inputM = contentEl.querySelector('#bt' + suffix + '-m');
        var resetBtn = contentEl.querySelector('#bt' + suffix + '-reset');

        function buildAndRun(N, M) {
            pathEl.textContent = 'path = [ ]'; pathEl.style.color = '';
            resultsEl.innerHTML = '<span style="color:var(--text3);">' + opts.emptyLabel + '</span>';
            var solver = opts.solverFactory(N, M);
            solver.solve();
            var nodes = solver.getNodes();
            var steps = solver.getSteps();
            self._renderTree(contentEl, nodes, suffix);
            self._setNodeState(contentEl, suffix, nodes[0].id, 'node-root');
            self._initStepController(contentEl, steps, suffix);
        }

        resetBtn.addEventListener('click', function() {
            var N = Math.max(1, Math.min(opts.maxN, parseInt(inputN.value) || opts.defaultN));
            var M = Math.max(1, Math.min(opts.maxM < 0 ? N : opts.maxM, parseInt(inputM.value) || opts.defaultM));
            if (M > N) M = N;
            inputN.value = N; inputM.value = M;
            self._clearVizState();
            buildAndRun(N, M);
        });
        buildAndRun(opts.defaultN, opts.defaultM);
    },

    // ====================================================================
    // Simulation 1: N and M (1) — Permutation (boj-15649)
    // ====================================================================
    _renderVizNM1(contentEl) {
        var self = this;
        self._buildNMTreeViz(contentEl, {
            suffix: '-nm1',
            title: 'N and M (1) — Permutation Generation',
            defaultN: 4, defaultM: 2, maxN: 6, maxM: -1,
            emptyLabel: 'Sequences will appear here',
            solverFactory: function(N, M) {
                var nodes = [{ id: 0, label: 'root', depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
                var nodeId = 1;
                var steps = [], path = [], used = [], found = [];
                for (var i = 0; i <= N; i++) used.push(false);
                var pathEl, resultsEl, sfx = '-nm1';

                function solve(depth, parentNid) {
                    if (depth === M) {
                        var snap = path.slice(); found.push(snap); var rc = found.length;
                        var leafNid = nodeId++;
                        var leafLabel = '[' + snap.join(',') + ']';
                        nodes.push({ id: leafNid, label: leafLabel, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                        nodes[parentNid].children.push(leafNid);
                        (function(s, r, lid) {
                            steps.push({
                                description: 'Sequence [' + s.join(', ') + '] complete! (#' + r + ') — All M numbers chosen, adding to results',
                                action: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-complete');
                                    self._setEdgeState(contentEl, sfx, lid, 'edge-complete');
                                    pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓';
                                    pathEl.style.color = 'var(--green)';
                                    resultsEl.innerHTML = found.slice(0, r).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ');
                                },
                                undo: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, lid, '');
                                    var prev = s.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]';
                                    pathEl.style.color = '';
                                    resultsEl.innerHTML = r > 1 ? found.slice(0, r - 1).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">Sequences will appear here</span>';
                                }
                            });
                        })(snap, rc, leafNid);
                        return;
                    }
                    for (var i = 1; i <= N; i++) {
                        if (used[i]) {
                            var prunedNid = nodeId++;
                            nodes.push({ id: prunedNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                            nodes[parentNid].children.push(prunedNid);
                            (function(ci, sp, pid) {
                                steps.push({
                                    description: ci + ' is already in use → Skip (pruning). Why? No-repeat permutation cannot reuse the same number',
                                    action: function() {
                                        pathEl = contentEl.querySelector('#nm-path' + sfx);
                                        self._setNodeState(contentEl, sfx, pid, 'node-pruned');
                                        self._setEdgeState(contentEl, sfx, pid, 'edge-backtracked');
                                        pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ' : '') + ci + '? ]';
                                        pathEl.style.color = 'var(--red)';
                                    },
                                    undo: function() {
                                        pathEl = contentEl.querySelector('#nm-path' + sfx);
                                        self._setNodeState(contentEl, sfx, pid, 'node-hidden');
                                        self._setEdgeState(contentEl, sfx, pid, '');
                                        pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ]';
                                        pathEl.style.color = '';
                                    }
                                });
                            })(i, path.slice(), prunedNid);
                            continue;
                        }
                        var choiceNid = nodeId++;
                        nodes.push({ id: choiceNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        nodes[parentNid].children.push(choiceNid);
                        used[i] = true; path.push(i);
                        (function(ci, sp, nid) {
                            steps.push({
                                description: 'Choose ' + ci + ' → path = [' + sp.join(', ') + ']. Why? This number is not yet used, so it can be selected',
                                action: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length < M ? ', ___' : '') + ' ]';
                                    pathEl.style.color = '';
                                },
                                undo: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, nid, '');
                                    var prev = sp.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]';
                                    pathEl.style.color = '';
                                }
                            });
                        })(i, path.slice(), choiceNid);
                        solve(depth + 1, choiceNid);
                        path.pop(); used[i] = false;
                        (function(ci, sp, nid) {
                            steps.push({
                                description: 'Undo ' + ci + '. Why? This branch is fully explored, so we try a different choice',
                                action: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-backtracked');
                                    pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ]';
                                    pathEl.style.color = '';
                                },
                                undo: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    var restored = sp.slice(); restored.push(ci);
                                    pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ]';
                                }
                            });
                        })(i, path.slice(), choiceNid);
                    }
                }
                return {
                    solve: function() { solve(0, 0); steps.push({ description: 'Search complete! Total: ' + found.length + ' permutations', action: function() {}, undo: function() {} }); },
                    getNodes: function() { return nodes; },
                    getSteps: function() { return steps; },
                    getFound: function() { return found; }
                };
            }
        });
    },

    // ====================================================================
    // Simulation 2: N and M (2) — Combination (boj-15650)
    // ====================================================================
    _renderVizNM2(contentEl) {
        var self = this;
        self._buildNMTreeViz(contentEl, {
            suffix: '-nm2',
            title: 'N and M (2) — Combination Generation',
            defaultN: 4, defaultM: 2, maxN: 6, maxM: -1,
            emptyLabel: 'Combinations will appear here',
            solverFactory: function(N, M) {
                var nodes = [{ id: 0, label: 'root', depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
                var nodeId = 1;
                var steps = [], path = [], found = [];
                var sfx = '-nm2';

                function solve(start, depth, parentNid) {
                    if (depth === M) {
                        var snap = path.slice(); found.push(snap); var rc = found.length;
                        var leafNid = nodeId++;
                        nodes.push({ id: leafNid, label: '[' + snap.join(',') + ']', depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                        nodes[parentNid].children.push(leafNid);
                        (function(s, r, lid) {
                            steps.push({
                                description: 'Combination [' + s.join(', ') + '] complete! (#' + r + ') — All M numbers chosen, adding to results',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-complete');
                                    self._setEdgeState(contentEl, sfx, lid, 'edge-complete');
                                    pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓';
                                    pathEl.style.color = 'var(--green)';
                                    resultsEl.innerHTML = found.slice(0, r).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ');
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, lid, '');
                                    var prev = s.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]';
                                    pathEl.style.color = '';
                                    resultsEl.innerHTML = r > 1 ? found.slice(0, r - 1).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">Combinations will appear here</span>';
                                }
                            });
                        })(snap, rc, leafNid);
                        return;
                    }
                    for (var i = start; i <= N; i++) {
                        var choiceNid = nodeId++;
                        nodes.push({ id: choiceNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        nodes[parentNid].children.push(choiceNid);
                        path.push(i);
                        (function(ci, sp, nid, st) {
                            steps.push({
                                description: 'Choose ' + ci + ' (start=' + st + ') → path = [' + sp.join(', ') + ']. Why? Starting from ' + st + ' guarantees ascending order',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length < M ? ', ___' : '') + ' ], start = ' + (ci + 1);
                                    pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, nid, '');
                                    var prev = sp.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ], start = ' + st;
                                    pathEl.style.color = '';
                                }
                            });
                        })(i, path.slice(), choiceNid, start);
                        solve(i + 1, depth + 1, choiceNid);
                        path.pop();
                        (function(ci, sp, nid, st) {
                            steps.push({
                                description: 'Undo ' + ci + '. Why? This branch is fully explored, trying the next number',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-backtracked');
                                    pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ], start = ' + st;
                                    pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    var restored = sp.slice(); restored.push(ci);
                                    pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ], start = ' + (ci + 1);
                                }
                            });
                        })(i, path.slice(), choiceNid, start);
                    }
                }
                return {
                    solve: function() { solve(1, 0, 0); steps.push({ description: 'Search complete! Total: ' + found.length + ' combinations', action: function() {}, undo: function() {} }); },
                    getNodes: function() { return nodes; },
                    getSteps: function() { return steps; },
                    getFound: function() { return found; }
                };
            }
        });
    },

    // ====================================================================
    // Simulation 3: N and M (3) — Perm. w/ Repetition (boj-15651)
    // ====================================================================
    _renderVizNM3(contentEl) {
        var self = this;
        self._buildNMTreeViz(contentEl, {
            suffix: '-nm3',
            title: 'N and M (3) — Perm. w/ Repetition',
            defaultN: 3, defaultM: 2, maxN: 4, maxM: 3,
            emptyLabel: 'Permutations w/ repetition will appear here',
            solverFactory: function(N, M) {
                var nodes = [{ id: 0, label: 'root', depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
                var nodeId = 1;
                var steps = [], path = [], found = [];
                var sfx = '-nm3';

                function solve(depth, parentNid) {
                    if (depth === M) {
                        var snap = path.slice(); found.push(snap); var rc = found.length;
                        var leafNid = nodeId++;
                        nodes.push({ id: leafNid, label: '[' + snap.join(',') + ']', depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                        nodes[parentNid].children.push(leafNid);
                        (function(s, r, lid) {
                            steps.push({
                                description: '[' + s.join(', ') + '] complete! (#' + r + ') — Repetition allowed, so the same number can appear multiple times',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-complete');
                                    self._setEdgeState(contentEl, sfx, lid, 'edge-complete');
                                    pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)';
                                    resultsEl.innerHTML = found.slice(0, r).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ');
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, lid, '');
                                    var prev = s.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = '';
                                    resultsEl.innerHTML = r > 1 ? found.slice(0, r - 1).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">Permutations w/ repetition will appear here</span>';
                                }
                            });
                        })(snap, rc, leafNid);
                        return;
                    }
                    for (var i = 1; i <= N; i++) {
                        var choiceNid = nodeId++;
                        nodes.push({ id: choiceNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        nodes[parentNid].children.push(choiceNid);
                        path.push(i);
                        (function(ci, sp, nid) {
                            steps.push({
                                description: 'Choose ' + ci + ' → path = [' + sp.join(', ') + ']. Why? No used check, so every number is available each time',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length < M ? ', ___' : '') + ' ]'; pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, nid, '');
                                    var prev = sp.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = '';
                                }
                            });
                        })(i, path.slice(), choiceNid);
                        solve(depth + 1, choiceNid);
                        path.pop();
                        (function(ci, sp, nid) {
                            steps.push({
                                description: 'Undo ' + ci + '. Why? Undoing the current choice to try the next number',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-backtracked');
                                    pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    var restored = sp.slice(); restored.push(ci);
                                    pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ]';
                                }
                            });
                        })(i, path.slice(), choiceNid);
                    }
                }
                return {
                    solve: function() { solve(0, 0); steps.push({ description: 'Search complete! Total: ' + found.length + ' (N^M = ' + N + '^' + M + ' = ' + Math.pow(N, M) + ')', action: function() {}, undo: function() {} }); },
                    getNodes: function() { return nodes; },
                    getSteps: function() { return steps; },
                    getFound: function() { return found; }
                };
            }
        });
    },

    // ====================================================================
    // Simulation 4: N and M (4) — Comb. w/ Repetition (boj-15652)
    // ====================================================================
    _renderVizNM4(contentEl) {
        var self = this;
        self._buildNMTreeViz(contentEl, {
            suffix: '-nm4',
            title: 'N and M (4) — Comb. w/ Repetition',
            defaultN: 3, defaultM: 2, maxN: 4, maxM: 3,
            emptyLabel: 'Combinations w/ repetition will appear here',
            solverFactory: function(N, M) {
                var nodes = [{ id: 0, label: 'root', depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
                var nodeId = 1;
                var steps = [], path = [], found = [];
                var sfx = '-nm4';

                function solve(start, depth, parentNid) {
                    if (depth === M) {
                        var snap = path.slice(); found.push(snap); var rc = found.length;
                        var leafNid = nodeId++;
                        nodes.push({ id: leafNid, label: '[' + snap.join(',') + ']', depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                        nodes[parentNid].children.push(leafNid);
                        (function(s, r, lid) {
                            steps.push({
                                description: '[' + s.join(', ') + '] complete! (#' + r + ') — Non-decreasing + repetition allowed combination',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-complete');
                                    self._setEdgeState(contentEl, sfx, lid, 'edge-complete');
                                    pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)';
                                    resultsEl.innerHTML = found.slice(0, r).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ');
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, lid, '');
                                    var prev = s.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ], start = ' + s[s.length - 1]; pathEl.style.color = '';
                                    resultsEl.innerHTML = r > 1 ? found.slice(0, r - 1).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">Combinations w/ repetition will appear here</span>';
                                }
                            });
                        })(snap, rc, leafNid);
                        return;
                    }
                    for (var i = start; i <= N; i++) {
                        var choiceNid = nodeId++;
                        nodes.push({ id: choiceNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        nodes[parentNid].children.push(choiceNid);
                        path.push(i);
                        (function(ci, sp, nid, st) {
                            steps.push({
                                description: 'Choose ' + ci + ' (start=' + st + ') → path = [' + sp.join(', ') + ']. Why? Next recursion passes start=' + ci + ' to guarantee non-decreasing order (i, not i+1!)',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length < M ? ', ___' : '') + ' ], start = ' + ci; pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, nid, '');
                                    var prev = sp.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ], start = ' + st; pathEl.style.color = '';
                                }
                            });
                        })(i, path.slice(), choiceNid, start);
                        solve(i, depth + 1, choiceNid);
                        path.pop();
                        (function(ci, sp, nid, st) {
                            steps.push({
                                description: 'Undo ' + ci + '. Why? This branch is fully explored, trying the next number',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-backtracked');
                                    pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ], start = ' + st; pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    var restored = sp.slice(); restored.push(ci);
                                    pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ], start = ' + ci;
                                }
                            });
                        })(i, path.slice(), choiceNid, start);
                    }
                }
                return {
                    solve: function() { solve(1, 0, 0); steps.push({ description: 'Search complete! Total: ' + found.length + ' combinations w/ repetition', action: function() {}, undo: function() {} }); },
                    getNodes: function() { return nodes; },
                    getSteps: function() { return steps; },
                    getFound: function() { return found; }
                };
            }
        });
    },

    // ====================================================================
    // Simulation 5: Operator Insertion (boj-14888)
    // ====================================================================
    _renderVizOperator(contentEl) {
        var self = this, suffix = '-op';
        var defaultNums = [1, 2, 3], defaultOps = [1, 1, 0, 0];
        var opSyms = ['+', '-', '*', '/'];
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">Operator Insertion</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Numbers: <input type="text" id="bt-op-nums" value="' + defaultNums.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:120px;" placeholder="1,2,3"></label>' +
            '<label style="font-weight:600;">Operators(+,-,*,/): <input type="text" id="bt-op-ops" value="' + defaultOps.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:100px;" placeholder="1,1,0,0"></label>' +
            '<button class="btn btn-primary" id="bt-op-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div class="sim-card" style="padding:1.5rem;margin-bottom:12px;">' +
            '<div class="sim-tree-wrapper"><div id="sim-tree' + suffix + '" style="position:relative;"></div></div>' +
            '<div id="op-expr' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:4px;"></div>' +
            '<div id="op-ops' + suffix + '" style="text-align:center;margin-bottom:4px;font-size:0.85rem;"></div>' +
            '</div>' +
            '<div id="op-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var exprEl = contentEl.querySelector('#op-expr' + suffix);
        var opsEl = contentEl.querySelector('#op-ops' + suffix);
        var infoEl = contentEl.querySelector('#op-info' + suffix);
        var inputNums = contentEl.querySelector('#bt-op-nums');
        var inputOps = contentEl.querySelector('#bt-op-ops');
        var resetBtn = contentEl.querySelector('#bt-op-reset');

        function buildAndRun(nums, ops) {
            var initExpr = nums.join(' ☐ ');
            exprEl.textContent = initExpr; exprEl.style.color = '';
            function renderOps(o) { opsEl.innerHTML = 'Remaining: + ' + o[0] + ', - ' + o[1] + ', * ' + o[2] + ', / ' + o[3]; }
            renderOps(ops);
            infoEl.innerHTML = '<span style="color:var(--text2);">Finding max and min values</span>';

            var treeNodes = [{ id: 0, label: '' + nums[0], depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
            var nodeId = 1;
            var steps = [], results = [], maxV = -Infinity, minV = Infinity;
            var curOps = ops.slice();

            var solve = function(idx, current, expr, parentNid) {
                if (idx === nums.length) {
                    results.push({ expr: expr, val: current });
                    if (current > maxV) maxV = current;
                    if (current < minV) minV = current;
                    var rc = results.length, cm = maxV, cn = minV, ce = expr, cv = current;
                    var leafNid = nodeId++;
                    treeNodes.push({ id: leafNid, label: '=' + cv, depth: idx - 1, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                    treeNodes[parentNid].children.push(leafNid);
                    (function(rc, cm, cn, ce, cv, lid) {
                        steps.push({
                            description: ce + ' = ' + cv + ' (current max=' + cm + ', min=' + cn + '). Why? All operators placed — this is one complete expression',
                            action: function() {
                                self._setNodeState(contentEl, suffix, lid, 'node-complete');
                                self._setEdgeState(contentEl, suffix, lid, 'edge-complete');
                                exprEl.textContent = ce + ' = ' + cv; exprEl.style.color = 'var(--green)';
                                infoEl.innerHTML = 'Results: ' + rc + ' | <strong>max = ' + cm + '</strong>, <strong>min = ' + cn + '</strong>';
                            },
                            undo: function() {
                                self._setNodeState(contentEl, suffix, lid, 'node-hidden');
                                self._setEdgeState(contentEl, suffix, lid, '');
                                exprEl.textContent = initExpr; exprEl.style.color = '';
                                infoEl.innerHTML = rc > 1 ? 'Results: ' + (rc - 1) : '<span style="color:var(--text2);">Finding max and min values</span>';
                            }
                        });
                    })(rc, cm, cn, ce, cv, leafNid);
                    return;
                }
                for (var i = 0; i < 4; i++) {
                    if (curOps[i] > 0) {
                        curOps[i]--;
                        var nxt;
                        if (i === 0) nxt = current + nums[idx];
                        else if (i === 1) nxt = current - nums[idx];
                        else if (i === 2) nxt = current * nums[idx];
                        else nxt = (current / nums[idx]) | 0;
                        var newExpr = expr + ' ' + opSyms[i] + ' ' + nums[idx];
                        var snapOps = curOps.slice();
                        var choiceNid = nodeId++;
                        treeNodes.push({ id: choiceNid, label: opSyms[i] + nums[idx], depth: idx - 1, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        treeNodes[parentNid].children.push(choiceNid);
                        (function(ci, ne, so, prevExpr, nid) {
                            steps.push({
                                description: opSyms[ci] + ' ' + nums[idx] + ' try → ' + ne + '. Why? There is a remaining ' + opSyms[ci] + ' operator to try',
                                action: function() {
                                    self._setNodeState(contentEl, suffix, nid, 'node-current');
                                    self._setEdgeState(contentEl, suffix, nid, 'edge-active');
                                    exprEl.textContent = ne + (idx < nums.length - 1 ? ' ☐ ...' : ''); exprEl.style.color = '';
                                    renderOps(so);
                                },
                                undo: function() {
                                    self._setNodeState(contentEl, suffix, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, suffix, nid, '');
                                    var po = so.slice(); po[ci]++;
                                    exprEl.textContent = prevExpr + (idx > 1 ? ' ☐ ...' : ' ☐ ...'); renderOps(po);
                                }
                            });
                        })(i, newExpr, snapOps, expr, choiceNid);
                        solve(idx + 1, nxt, newExpr, choiceNid);
                        curOps[i]++;
                        (function(nid, so) {
                            steps.push({
                                description: 'Undo. Why? This operator branch is fully explored, trying another operator',
                                action: function() {
                                    self._setNodeState(contentEl, suffix, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, suffix, nid, 'edge-backtracked');
                                    renderOps(so);
                                },
                                undo: function() {
                                    self._setNodeState(contentEl, suffix, nid, 'node-current');
                                    self._setEdgeState(contentEl, suffix, nid, 'edge-active');
                                }
                            });
                        })(choiceNid, curOps.slice());
                    }
                }
            };
            solve(1, nums[0], '' + nums[0], 0);
            var fm = maxV, fn = minV;
            steps.push({
                description: 'Done! max = ' + fm + ', min = ' + fn,
                action: function() { exprEl.textContent = 'max = ' + fm + ', min = ' + fn; exprEl.style.color = 'var(--green)'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">max = ' + fm + ', min = ' + fn + '</strong>'; },
                undo: function() { exprEl.textContent = initExpr; exprEl.style.color = ''; }
            });
            self._renderTree(contentEl, treeNodes, suffix);
            self._setNodeState(contentEl, suffix, 0, 'node-root');
            self._initStepController(contentEl, steps, suffix);
        }

        resetBtn.addEventListener('click', function() {
            var nums = inputNums.value.split(',').map(function(x) { return parseInt(x.trim()); }).filter(function(x) { return !isNaN(x); });
            if (nums.length < 2) nums = defaultNums.slice();
            if (nums.length > 6) nums = nums.slice(0, 6);
            var opsArr = inputOps.value.split(',').map(function(x) { return Math.max(0, parseInt(x.trim()) || 0); });
            while (opsArr.length < 4) opsArr.push(0);
            opsArr = opsArr.slice(0, 4);
            var totalOps = opsArr[0] + opsArr[1] + opsArr[2] + opsArr[3];
            if (totalOps !== nums.length - 1) {
                alert('Total operator count must be ' + (nums.length - 1) + ' (numbers: ' + nums.length + ' - 1). Current: ' + totalOps);
                return;
            }
            inputNums.value = nums.join(',');
            inputOps.value = opsArr.join(',');
            self._clearVizState();
            buildAndRun(nums, opsArr);
        });
        buildAndRun(defaultNums, defaultOps);
    },

    // ====================================================================
    // Simulation 6: Start and Link (boj-14889)
    // ====================================================================
    _renderVizTeam(contentEl) {
        var self = this, suffix = '-team';
        var defaultN = 4;
        var defaultS = [[0,1,2,3],[4,0,5,6],[7,1,0,2],[3,4,5,0]];
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">Start and Link — Team Split</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (even):<input type="number" id="bt-team-n" value="' + defaultN + '" min="4" max="8" step="2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt-team-reset">🔄</button>' +
            '<span style="font-size:0.8rem;color:var(--text3);">Changing N generates a random synergy matrix</span>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<p id="tm-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></p>' +
            '<div id="tm-teams' + suffix + '" style="display:flex;gap:16px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="tm-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var teamsEl = contentEl.querySelector('#tm-teams' + suffix);
        var infoEl = contentEl.querySelector('#tm-info' + suffix);
        var descEl = contentEl.querySelector('#tm-desc' + suffix);
        var inputN = contentEl.querySelector('#bt-team-n');
        var resetBtn = contentEl.querySelector('#bt-team-reset');
        function generateMatrix(N) {
            var S = [];
            for (var i = 0; i < N; i++) { S.push([]); for (var j = 0; j < N; j++) S[i].push(i === j ? 0 : Math.floor(Math.random() * 10)); }
            return S;
        }
        function buildAndRun(N, S) {
            descEl.textContent = N + ' people into' + (N/2) + ' each. Minimize the synergy difference.';
            function renderTeams(startT, linkT, s1, s2) {
                teamsEl.innerHTML =
                    '<div style="flex:1;text-align:center;padding:10px;border-radius:8px;background:var(--accent)10;border:2px solid var(--accent);">' +
                    '<div style="font-weight:600;margin-bottom:4px;color:var(--accent);">Start Team</div>' +
                    '<div>' + (startT.length > 0 ? startT.map(function(x){return '<span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;margin:2px;border-radius:50%;background:var(--accent);color:white;font-weight:600;font-size:0.8rem;">' + (x+1) + '</span>';}).join('') : '-') + '</div>' +
                    (s1 !== null ? '<div style="font-size:0.85rem;margin-top:4px;">Synergy:' + s1 + '</div>' : '') + '</div>' +
                    '<div style="flex:1;text-align:center;padding:10px;border-radius:8px;background:var(--green)10;border:2px solid var(--green);">' +
                    '<div style="font-weight:600;margin-bottom:4px;color:var(--green);">Link Team</div>' +
                    '<div>' + (linkT.length > 0 ? linkT.map(function(x){return '<span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;margin:2px;border-radius:50%;background:var(--green);color:white;font-weight:600;font-size:0.8rem;">' + (x+1) + '</span>';}).join('') : '-') + '</div>' +
                    (s2 !== null ? '<div style="font-size:0.85rem;margin-top:4px;">Synergy:' + s2 + '</div>' : '') + '</div>';
            }
            renderTeams([], [], null, null);
            infoEl.innerHTML = '<span style="color:var(--text2);">Finding the minimum synergy difference</span>';
            function calcSynergy(team) { var t = 0; for (var i = 0; i < team.length; i++) for (var j = i+1; j < team.length; j++) t += S[team[i]][team[j]] + S[team[j]][team[i]]; return t; }
            var steps = [], ans = Infinity;
            // enumerate C(N, N/2) combinations
            var half = N / 2;
            var combos = [];
            (function genCombos(start, combo) {
                if (combo.length === half) { combos.push(combo.slice()); return; }
                for (var i = start; i < N; i++) { combo.push(i); genCombos(i + 1, combo); combo.pop(); }
            })(0, []);
            for (var ci = 0; ci < combos.length; ci++) {
                var startT = combos[ci];
                var linkT = [];
                for (var j = 0; j < N; j++) { if (startT.indexOf(j) < 0) linkT.push(j); }
                var s1 = calcSynergy(startT), s2 = calcSynergy(linkT);
                var diff = Math.abs(s1 - s2);
                if (diff < ans) ans = diff;
                (function(st, lt, s1, s2, diff, ca) {
                    steps.push({ description: 'Start=[' + st.map(function(x){return x+1;}).join(',') + '] Link=[' + lt.map(function(x){return x+1;}).join(',') + '] → synergy diff = |' + s1 + '-' + s2 + '| = ' + diff + (diff === ca ? ' (current min!)' : ''),
                        action: function() { renderTeams(st, lt, s1, s2); infoEl.innerHTML = 'diff = |' + s1 + ' - ' + s2 + '| = <strong>' + diff + '</strong>' + (diff === ca ? ' <span style="color:var(--green);">← min!</span>' : '') + ' | current min =' + ca; },
                        undo: function() { renderTeams([], [], null, null); infoEl.innerHTML = '<span style="color:var(--text2);">Finding the minimum synergy difference</span>'; }
                    });
                })(startT, linkT, s1, s2, diff, ans);
            }
            var fa = ans;
            steps.push({ description: 'Done! Minimum difference =' + fa,
                action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Min synergy difference =' + fa + '</strong>'; },
                undo: function() {}
            });
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var N = parseInt(inputN.value) || defaultN;
            if (N % 2 !== 0) N = N + 1;
            N = Math.max(4, Math.min(8, N));
            inputN.value = N;
            var S = (N === defaultN) ? defaultS : generateMatrix(N);
            self._clearVizState();
            buildAndRun(N, S);
        });
        buildAndRun(defaultN, defaultS);
    },

    // ====================================================================
    // Simulation 7: N-Queen (boj-9663)
    // ====================================================================
    _renderVizNQueen(contentEl) {
        var self = this, suffix = '-nq';
        var defaultN = 4;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N-Queen</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="bt-queen-n" value="' + defaultN + '" min="4" max="8" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt-queen-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<p id="nq-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></p>' +
            '<div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div><div style="font-weight:600;font-size:0.85rem;color:var(--text2);margin-bottom:6px;text-align:center;">Chessboard</div>' +
            '<div id="nq-board' + suffix + '" style="display:grid;gap:2px;justify-content:center;margin-bottom:8px;"></div></div>' +
            '<div style="flex:1;min-width:200px;max-width:500px;"><div style="font-weight:600;font-size:0.85rem;color:var(--text2);margin-bottom:6px;text-align:center;">Search Tree</div>' +
            '<div id="nq-tree' + suffix + '" style="overflow-x:auto;padding:8px 0;min-height:120px;font-family:monospace;font-size:0.78rem;line-height:1.6;white-space:pre;"></div></div>' +
            '</div>' +
            '<div id="nq-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var boardEl = contentEl.querySelector('#nq-board' + suffix);
        var infoEl = contentEl.querySelector('#nq-info' + suffix);
        var descEl = contentEl.querySelector('#nq-desc' + suffix);
        var treeEl = contentEl.querySelector('#nq-tree' + suffix);
        var inputN = contentEl.querySelector('#bt-queen-n');
        var resetBtn = contentEl.querySelector('#bt-queen-reset');
        function buildAndRun(n) {
            descEl.textContent = n + '\u00d7' + n + ' chessboard: place ' + n + ' queens so none attack each other.';
            var cellSize = n <= 5 ? 48 : (n <= 6 ? 42 : 36);
            boardEl.style.gridTemplateColumns = 'repeat(' + n + ',' + cellSize + 'px)';
            boardEl.innerHTML = '';
            for (var r = 0; r < n; r++) {
                for (var c = 0; c < n; c++) {
                    var cell = document.createElement('div');
                    cell.style.cssText = 'width:' + cellSize + 'px;height:' + cellSize + 'px;display:flex;align-items:center;justify-content:center;font-size:' + (cellSize > 40 ? '1.4' : '1.1') + 'rem;border-radius:4px;transition:all 0.3s;' + ((r+c)%2===0 ? 'background:#f0d9b5;' : 'background:#b58863;');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    boardEl.appendChild(cell);
                }
            }
            function getCell(r, c) { return boardEl.querySelector('[data-row="' + r + '"][data-col="' + c + '"]'); }
            infoEl.innerHTML = '<span style="color:var(--text2);">Placing queens row by row.</span>';

            // Search tree data
            var treeNodes = [];
            var treeNodeId = 0;
            treeNodes.push({ id: treeNodeId++, label: 'Start', depth: 0, parentId: -1, status: 'root' });

            var steps = [], queens = [], solCount = 0;
            for (var i = 0; i < n; i++) queens.push(-1);
            function isValid(row, col) { for (var r = 0; r < row; r++) { if (queens[r] === col || Math.abs(queens[r]-col) === Math.abs(r-row)) return false; } return true; }

            // Text-based tree rendering
            function renderTree(highlightId, highlightStatus) {
                var byParent = {};
                for (var i = 0; i < treeNodes.length; i++) {
                    var pid = treeNodes[i].parentId;
                    if (!byParent[pid]) byParent[pid] = [];
                    byParent[pid].push(treeNodes[i]);
                }
                var lines = [];
                function drawNode(node, prefix, isLast) {
                    var connector = node.parentId < 0 ? '' : (isLast ? '\u2514\u2500 ' : '\u251c\u2500 ');
                    var color = 'var(--text2)';
                    var weight = '400';
                    if (node.status === 'solution') { color = 'var(--green)'; weight = '700'; }
                    else if (node.status === 'fail') { color = 'var(--red)'; }
                    else if (node.status === 'backtrack') { color = 'var(--red)'; }
                    else if (node.status === 'place') { color = 'var(--accent)'; weight = '600'; }
                    else if (node.status === 'root') { color = 'var(--accent)'; weight = '700'; }
                    var isHighlight = (node.id === highlightId);
                    var bg = isHighlight ? 'background:var(--yellow);color:#333;padding:0 4px;border-radius:3px;' : '';
                    lines.push('<span style="color:' + color + ';font-weight:' + weight + ';' + bg + '">' + prefix + connector + node.label + '</span>');
                    var children = byParent[node.id] || [];
                    for (var c = 0; c < children.length; c++) {
                        var childPrefix = node.parentId < 0 ? '' : (prefix + (isLast ? '   ' : '\u2502  '));
                        drawNode(children[c], childPrefix, c === children.length - 1);
                    }
                }
                drawNode(treeNodes[0], '', true);
                treeEl.innerHTML = lines.join('\n');
            }

            var parentStack = [0];

            var solve = function(row) {
                if (row === n) {
                    solCount++;
                    var sc = solCount, qs = queens.slice();
                    var solNodeId = treeNodeId++;
                    treeNodes.push({ id: solNodeId, label: '\u2705 Solution #' + sc, depth: row + 1, parentId: parentStack[parentStack.length - 1], status: 'solution' });
                    (function(sc, qs, nid) {
                        steps.push({ description: 'Solution #' + sc + ' found!',
                            action: function() { for (var r = 0; r < n; r++) getCell(r, qs[r]).style.background = '#00b894'; infoEl.innerHTML = '<strong style="color:var(--green);">Solution #' + sc + ' found!</strong>'; renderTree(nid, 'solution'); },
                            undo: function() { for (var r = 0; r < n; r++) getCell(r, qs[r]).style.background = (r+qs[r])%2===0 ? '#f0d9b5' : '#b58863'; }
                        });
                    })(sc, qs, solNodeId);
                    return;
                }
                for (var col = 0; col < n; col++) {
                    var cr = row, cc = col;
                    var tryNodeId = treeNodeId++;
                    var curParent = parentStack[parentStack.length - 1];
                    treeNodes.push({ id: tryNodeId, label: 'R' + (cr+1) + 'C' + (cc+1) + '?', depth: row + 1, parentId: curParent, status: 'try' });
                    (function(cr, cc, nid) {
                        steps.push({ description: 'Row ' + (cr+1) + ' Col ' + (cc+1) + ': try queen...',
                            action: function() { getCell(cr, cc).textContent = '?'; getCell(cr, cc).style.background = '#fdcb6e'; renderTree(nid, 'try'); },
                            undo: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }
                        });
                    })(cr, cc, tryNodeId);
                    if (isValid(row, col)) {
                        queens[row] = col;
                        treeNodes[tryNodeId].status = 'place';
                        treeNodes[tryNodeId].label = 'R' + (cr+1) + 'C' + (cc+1) + ' \u265b';
                        (function(cr, cc, nid) {
                            steps.push({ description: '\u2705 Row ' + (cr+1) + ' Col ' + (cc+1) + ': No conflict! Place queen',
                                action: function() { getCell(cr, cc).textContent = '\u265b'; getCell(cr, cc).style.background = '#d63031'; getCell(cr,cc).style.color = 'white'; renderTree(nid, 'place'); },
                                undo: function() { getCell(cr, cc).textContent = '?'; getCell(cr, cc).style.background = '#fdcb6e'; getCell(cr,cc).style.color = ''; }
                            });
                        })(cr, cc, tryNodeId);
                        parentStack.push(tryNodeId);
                        solve(row + 1);
                        parentStack.pop();
                        queens[row] = -1;
                        treeNodes[tryNodeId].status = 'backtrack';
                        treeNodes[tryNodeId].label = 'R' + (cr+1) + 'C' + (cc+1) + ' \u21a9';
                        (function(cr, cc, nid) {
                            steps.push({ description: '\u21a9\ufe0f Row ' + (cr+1) + ' Col ' + (cc+1) + ': remove queen (backtrack)',
                                action: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; getCell(cr,cc).style.color = ''; renderTree(nid, 'backtrack'); },
                                undo: function() { getCell(cr, cc).textContent = '\u265b'; getCell(cr, cc).style.background = '#d63031'; getCell(cr,cc).style.color = 'white'; }
                            });
                        })(cr, cc, tryNodeId);
                    } else {
                        treeNodes[tryNodeId].status = 'fail';
                        treeNodes[tryNodeId].label = 'R' + (cr+1) + 'C' + (cc+1) + ' \u2715';
                        (function(cr, cc, nid) {
                            steps.push({ description: '\u274c Row ' + (cr+1) + ' Col ' + (cc+1) + ': Conflict! Skip',
                                action: function() { getCell(cr, cc).textContent = '\u2715'; getCell(cr, cc).style.background = '#e17055'; renderTree(nid, 'fail'); setTimeout(function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }, 400); },
                                undo: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }
                            });
                        })(cr, cc, tryNodeId);
                    }
                }
            };
            solve(0);
            var fsc = solCount;
            steps.push({ description: 'Search complete! ' + fsc + ' solutions found', action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">\u2705 Total: ' + fsc + ' solutions</strong>'; renderTree(-1, ''); }, undo: function(){} });
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var n = Math.max(4, Math.min(8, parseInt(inputN.value) || defaultN));
            inputN.value = n;
            self._clearVizState();
            buildAndRun(n);
        });
        buildAndRun(defaultN);
    },

    // ====================================================================
    // Simulation 8: Sudoku (boj-2580)
    // ====================================================================
    _renderVizSudoku(contentEl) {
        var self = this, suffix = '-sdk';
        // 4x4 mini sudoku presets
        var presets = [
            { name: 'Puzzle 1 (8 blanks)', board: [[1,0,0,4],[0,4,1,0],[0,1,4,0],[4,0,0,1]] },
            { name: 'Puzzle 2 (10 blanks)', board: [[0,0,3,0],[0,3,0,1],[1,0,0,0],[0,0,1,0]] },
            { name: 'Puzzle 3 (6 blanks)', board: [[0,2,0,4],[3,0,0,2],[2,0,0,3],[0,3,0,1]] }
        ];
        var selectOptions = presets.map(function(p, i) { return '<option value="' + i + '">' + p.name + '</option>'; }).join('');
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">Sudoku (4\u00d74 mini)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Select puzzle:<select id="bt-sudo-preset" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;">' + selectOptions + '</select></label>' +
            '<button class="btn btn-primary" id="bt-sudo-reset">\ud83d\udd04</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<p style="color:var(--text2);margin-bottom:12px;">4\u00d74 Sudoku: fill blank cells using backtracking. Each row, column, 2\u00d72 box must contain 1-4 exactly once.</p>' +
            '<div id="sdk-board' + suffix + '" style="display:grid;grid-template-columns:repeat(4,48px);gap:2px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sdk-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var boardEl = contentEl.querySelector('#sdk-board' + suffix);
        var infoEl = contentEl.querySelector('#sdk-info' + suffix);
        var presetSelect = contentEl.querySelector('#bt-sudo-preset');
        var resetBtn = contentEl.querySelector('#bt-sudo-reset');
        function buildAndRun(board) {
            var gridState = board.map(function(row) { return row.slice(); });
            boardEl.innerHTML = '';
            for (var r = 0; r < 4; r++) {
                for (var c = 0; c < 4; c++) {
                    var cell = document.createElement('div');
                    var borderR = c === 1 ? '2px solid #333;' : '1px solid var(--border);';
                    var borderB = r === 1 ? '2px solid #333;' : '1px solid var(--border);';
                    cell.style.cssText = 'width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:600;border-right:' + borderR + 'border-bottom:' + borderB + 'background:' + (board[r][c] !== 0 ? 'var(--bg2)' : 'white') + ';';
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    cell.textContent = board[r][c] !== 0 ? board[r][c] : '';
                    boardEl.appendChild(cell);
                }
            }
            function getCell(r, c) { return boardEl.querySelector('[data-row="' + r + '"][data-col="' + c + '"]'); }
            infoEl.innerHTML = '<span style="color:var(--text2);">Trying 1-4 in empty cells.</span>';
            var blanks = [];
            for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (board[r][c] === 0) blanks.push([r, c]);
            var steps = [];
            function isValid(r, c, num) {
                for (var i = 0; i < 4; i++) { if (gridState[r][i] === num || gridState[i][c] === num) return false; }
                var sr = (r < 2) ? 0 : 2, sc = (c < 2) ? 0 : 2;
                for (var i = sr; i < sr + 2; i++) for (var j = sc; j < sc + 2; j++) if (gridState[i][j] === num) return false;
                return true;
            }
            var solved = false;
            var solve = function(idx) {
                if (solved) return;
                if (idx === blanks.length) {
                    solved = true;
                    steps.push({ description: '\u2705 Sudoku complete!',
                        action: function() { for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var cl = getCell(r,c); if (board[r][c] === 0) cl.style.color = 'var(--green)'; } infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">\u2705 Sudoku complete!</strong>'; },
                        undo: function() { for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var cl = getCell(r,c); cl.style.color = ''; } }
                    });
                    return;
                }
                var br = blanks[idx][0], bc = blanks[idx][1];
                for (var num = 1; num <= 4; num++) {
                    if (solved) return;
                    (function(br, bc, num) {
                        steps.push({ description: '(' + (br+1) + ',' + (bc+1) + ')' + num + ' trying...',
                            action: function() { getCell(br, bc).textContent = num; getCell(br, bc).style.color = '#6c5ce7'; infoEl.innerHTML = '(' + (br+1) + ',' + (bc+1) + ')' + num + ' trying...'; },
                            undo: function() { getCell(br, bc).textContent = ''; getCell(br, bc).style.color = ''; }
                        });
                    })(br, bc, num);
                    if (isValid(br, bc, num)) {
                        gridState[br][bc] = num;
                        (function(br, bc, num) {
                            steps.push({ description: '\u2705 (' + (br+1) + ',' + (bc+1) + ') = ' + num + ' valid! Place',
                                action: function() { getCell(br, bc).textContent = num; getCell(br, bc).style.color = 'var(--accent)'; },
                                undo: function() { getCell(br, bc).textContent = num; getCell(br, bc).style.color = '#6c5ce7'; }
                            });
                        })(br, bc, num);
                        solve(idx + 1);
                        if (solved) return;
                        gridState[br][bc] = 0;
                        (function(br, bc) {
                            steps.push({ description: '\u21a9\ufe0f (' + (br+1) + ',' + (bc+1) + ') undo',
                                action: function() { getCell(br, bc).textContent = ''; getCell(br, bc).style.color = ''; },
                                undo: function() {}
                            });
                        })(br, bc);
                    } else {
                        (function(br, bc, num) {
                            steps.push({ description: '\u274c (' + (br+1) + ',' + (bc+1) + ')' + num + ' invalid (conflict)',
                                action: function() { getCell(br, bc).style.background = '#e1705530'; setTimeout(function() { getCell(br, bc).style.background = 'white'; getCell(br, bc).textContent = ''; getCell(br,bc).style.color = ''; }, 300); },
                                undo: function() { getCell(br, bc).textContent = ''; getCell(br, bc).style.color = ''; getCell(br, bc).style.background = 'white'; }
                            });
                        })(br, bc, num);
                    }
                }
            };
            solve(0);
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var idx = parseInt(presetSelect.value) || 0;
            var board = presets[idx].board;
            self._clearVizState();
            buildAndRun(board);
        });
        buildAndRun(presets[0].board);
    },
    // ===== Empty Stub =====
    renderProblem(container) {},

    // ===== 3-Stage Problem Structure =====
    stages: [
        { num: 1, title: 'Basic Backtracking', desc: 'N and M Series (Silver III)', problemIds: ['boj-15649', 'boj-15650', 'boj-15651', 'boj-15652'] },
        { num: 2, title: 'Applied Backtracking', desc: 'Complex constraint problems (Silver I)', problemIds: ['boj-14888', 'boj-14889'] },
        { num: 3, title: 'Advanced Backtracking', desc: 'Classic backtracking problems (Gold IV~V)', problemIds: ['boj-9663', 'boj-2580'] }
    ],

    // ===== Problem List =====
    problems: [
        // ========== Stage 1: Basic Backtracking ==========
        {
            id: 'boj-15649',
            title: 'BOJ 15649 - N and M (1)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15649',
            simIntro: 'Observe the backtracking process of permutation generation using a used array.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given natural numbers N and M, write a program that prints all sequences of length M satisfying the following condition.</p>
                <ul><li>A sequence of M numbers chosen from 1 to N without repetition</li></ul>
                <h4>Input</h4>
                <p>The first line contains natural numbers N and M. (1 ≤ M ≤ N ≤ 8)</p>
                <h4>Output</h4>
                <p>Print one sequence per line satisfying the condition. Do not print duplicate sequences, and separate numbers in each sequence with spaces.</p>
                <p>Sequences must be printed in lexicographic (dictionary) ascending order.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3 1</pre></div>
                    <div><strong>Output</strong><pre>1\n2\n3</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 2</pre></div>
                    <div><strong>Output</strong><pre>1 2\n1 3\n1 4\n2 1\n2 3\n2 4\n3 1\n3 2\n3 4\n4 1\n4 2\n4 3</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 ≤ M ≤ N ≤ 8</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'We need to generate all sequences of M numbers from 1~N. The most intuitive approach? M nested for loops! For example, if M=3, just use <code>for i / for j / for k</code> to try everything, right?' },
                { title: 'But there\'s a problem with this', content: 'M is given as <strong>input</strong>. If M=2 we need 2 nested loops, if M=5 we need 5 nested loops... we can\'t write "M nested for loops" in code! Plus we\'d need to manually check for duplicates each time.<br><br><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">M=2</div><code>for i: for j:</code></div><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">M=3</div><code>for i: for j: for k:</code></div><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">M=?</div><code>for ...: ???</code></div></div>' },
                { title: 'What if we try this?', content: 'If we use <strong>recursion</strong> instead of for loops, the depth is flexible! The <code>backtrack()</code> function calls itself, filling one position at a time. And by using a <code>used</code> array to mark "already used numbers," duplicate prevention is clean.<br><br>Core pattern: <strong>Choose → Recurse → Undo</strong><br>Pick a number → recurse to the next position → when returning, restore with <code>used[i] = False</code> and <code>path.pop()</code> to try other numbers.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\nused = [False] * (n + 1)\n\ndef backtrack():\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(1, n + 1):\n        if not used[i]:\n            used[i] = True\n            path.append(i)\n            backtrack()\n            path.pop()\n            used[i] = False\n\nbacktrack()',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\nbool used[9];\n\nvoid backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        if (!used[i]) {\n            used[i] = true;\n            path[depth] = i;\n            backtrack(depth + 1);\n            used[i] = false;\n        }\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0);\n}'
            },
            solutions: [{
                approach: 'Backtracking with used array',
                description: 'Generate permutations by tracking usage with a used array',
                timeComplexity: 'O(N!/(N-M)!)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: 'Setup', desc: 'Track each number\'s usage status with the used array.', code: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\nused = [False] * (n + 1)' },
                        { title: 'Backtracking function', desc: 'If length equals M, print; otherwise, explore unused numbers from 1~N.', code: 'def backtrack():\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(1, n + 1):\n        if not used[i]:' },
                        { title: 'Choose and Undo', desc: 'Choose a number and recurse; on return, restore to try other choices.', code: '            used[i] = True\n            path.append(i)\n            backtrack()\n            path.pop()\n            used[i] = False\n\nbacktrack()' }
                    ],
                    cpp: [
                        { title: 'Setup', desc: 'Manage path by depth index.\nTrack usage with used array.', code: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\nbool used[9];' },
                        { title: 'Backtracking function', desc: 'If depth equals M, print; otherwise, iterate through unused numbers.', code: 'void backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        if (!used[i]) {' },
                        { title: 'Choose and Undo', desc: 'Choose \u2192 Recurse \u2192 Restore: the core backtracking pattern.', code: '            used[i] = true;\n            path[depth] = i;\n            backtrack(depth + 1);\n            used[i] = false;  // Undo\n        }\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0);\n}' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-15650',
            title: 'BOJ 15650 - N and M (2)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15650',
            simIntro: 'Observe the process of generating ascending combinations using the start parameter.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given natural numbers N and M, write a program that prints all sequences of length M satisfying the following conditions.</p>
                <ul><li>A sequence of M numbers chosen from 1 to N without repetition</li><li>The chosen sequence must be in ascending order.</li></ul>
                <h4>Input</h4>
                <p>The first line contains natural numbers N and M. (1 ≤ M ≤ N ≤ 8)</p>
                <h4>Output</h4>
                <p>Print one sequence per line satisfying the conditions. Do not print duplicate sequences, and separate numbers in each sequence with spaces.</p>
                <p>Sequences must be printed in lexicographic (dictionary) ascending order.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3 1</pre></div>
                    <div><strong>Output</strong><pre>1\n2\n3</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 2</pre></div>
                    <div><strong>Output</strong><pre>1 2\n1 3\n1 4\n2 3\n2 4\n3 4</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 ≤ M ≤ N ≤ 8</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Like N and M (1), what if we generate all sequences and just filter out the non-ascending ones? Make permutations with the <code>used</code> array, then check if they\'re sorted before printing.' },
                { title: 'But there\'s a problem with this', content: 'Then we\'d generate N!/(N-M)! sequences and discard most of them. For example, with N=8, M=4, that\'s generating 1680 to keep only 70. Can\'t we filter <strong>before generating</strong>?<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.85rem;"><div style="text-align:center;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">All permutations</div><div style="font-size:1.3rem;font-weight:700;color:var(--red);">1680</div></div><div style="font-size:1.5rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">Ascending only</div><div style="font-size:1.3rem;font-weight:700;color:var(--green);">70</div></div><div style="font-size:0.75rem;color:var(--text3);">96% discarded!</div></div>' },
                { title: 'What if we try this?', content: 'Key idea: if we only pick numbers <strong>greater than</strong> the previous choice, the result is automatically ascending!<br><br>In <code>backtrack(start)</code>, start the loop from <code>start</code>, and pass <code>i+1</code> when recursing. Then we don\'t even need the <code>used</code> array! The <code>start</code> parameter restricts the range to "pick only from here onwards."' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\n\ndef backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):\n        path.append(i)\n        backtrack(i + 1)\n        path.pop()\n\nbacktrack(1)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\n\nvoid backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1, i + 1);\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0, 1);\n}'
            },
            solutions: [{
                approach: 'Combination with start parameter',
                description: 'Generate only ascending combinations using the start parameter',
                timeComplexity: 'O(C(N,M))',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: 'Setup', desc: 'No used array needed -- the start parameter alone controls combinations.', code: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []' },
                        { title: 'start parameter', desc: 'Iterating from start ensures we never re-pick previous numbers, guaranteeing ascending order.', code: 'def backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):' },
                        { title: 'Recurse with i+1', desc: 'Passing i+1 ensures only numbers greater than the current are chosen, producing duplicate-free combinations.', code: '        path.append(i)\n        backtrack(i + 1)  # i+1 guarantees ascending order\n        path.pop()\n\nbacktrack(1)' }
                    ],
                    cpp: [
                        { title: 'Setup', desc: 'No used array needed -- start parameter controls ordering.', code: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];' },
                        { title: 'start parameter', desc: 'No used array needed -- start prevents duplicates.', code: 'void backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {' },
                        { title: 'Recurse with i+1', desc: 'Passing i+1 selects only numbers greater than current \u2192 ascending combinations.', code: '        path[depth] = i;\n        backtrack(depth + 1, i + 1);  // i+1 guarantees ascending order\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0, 1);\n}' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-15651',
            title: 'BOJ 15651 - N and M (3)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15651',
            simIntro: 'Observe the permutation generation process with repetition allowed. No used array!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given natural numbers N and M, write a program that prints all sequences of length M satisfying the following conditions.</p>
                <ul><li>A sequence of M numbers chosen from 1 to N</li><li>The same number can be chosen multiple times.</li></ul>
                <h4>Input</h4>
                <p>The first line contains natural numbers N and M. (1 ≤ M ≤ N ≤ 7)</p>
                <h4>Output</h4>
                <p>Print one sequence per line satisfying the conditions. Do not print duplicate sequences, and separate numbers in each sequence with spaces.</p>
                <p>Sequences must be printed in lexicographic (dictionary) ascending order.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3 1</pre></div>
                    <div><strong>Output</strong><pre>1\n2\n3</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 2</pre></div>
                    <div><strong>Output</strong><pre>1 1\n1 2\n1 3\n1 4\n2 1\n2 2\n2 3\n2 4\n3 1\n3 2\n3 3\n3 4\n4 1\n4 2\n4 3\n4 4</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 ≤ M ≤ N ≤ 7</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Similar to N and M (1), but this time we can use the same number multiple times! So use a <code>used</code> array like (1), but re-allow the number after returning from recursion?' },
                { title: 'But there\'s a problem with this', content: 'Wait, using and restoring <code>used</code> is what (1) already does! Since repetition is <strong>allowed</strong>, we don\'t even need to check "was this number used" at all.' },
                { title: 'What if we try this?', content: 'Just <strong>completely remove</strong> the <code>used</code> array! Freely pick from all of 1~N every time. The code is actually simpler than (1).<br><br><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--accent);margin-bottom:3px;">(1) No repeats</div><code>used[i]</code> check needed</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">(3) Repeats OK</div><code>used</code> not needed!</div></div><br>However, the output can be enormous (N<sup>M</sup> sequences), so fast output is essential!<br><span class="lang-py">Python: Collect results and print all at once with <code>sys.stdout.write()</code></span><span class="lang-cpp">C++: Use <code>printf</code> or <code>ios::sync_with_stdio(false)</code></span>' }
            ],
            templates: {
                python: 'import sys\n\nn, m = map(int, sys.stdin.readline().split())\npath = []\nresult = []\n\ndef backtrack():\n    if len(path) == m:\n        result.append(\' \'.join(map(str, path)))\n        return\n    for i in range(1, n + 1):\n        path.append(i)\n        backtrack()\n        path.pop()\n\nbacktrack()\nsys.stdout.write(\'\\n\'.join(result))',
                cpp: '#include <cstdio>\n\nint n, m;\nint path[8];\n\nvoid backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            printf("%d%c", path[i], i < m-1 ? \' \' : \'\\n\');\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1);\n    }\n}\n\nint main() {\n    scanf("%d %d", &n, &m);\n    backtrack(0);\n}'
            },
            solutions: [{
                approach: 'Unrestricted permutation with repetition',
                description: 'Generate all combinations without a used array',
                timeComplexity: 'O(N^M)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: 'Setup', desc: 'Collect results for batch output -- N^M sequences can be very many.', code: 'import sys\n\nn, m = map(int, sys.stdin.readline().split())\npath = []\nresult = []' },
                        { title: 'Backtracking (no used)', desc: 'Repetition allowed, so no used check -- freely pick from 1~N each time.', code: 'def backtrack():\n    if len(path) == m:\n        result.append(\' \'.join(map(str, path)))\n        return\n    for i in range(1, n + 1):  # Unrestricted 1~N\n        path.append(i)\n        backtrack()\n        path.pop()' },
                        { title: 'Batch output optimization', desc: 'Print all at once with stdout.write to reduce I/O bottleneck.', code: 'backtrack()\nsys.stdout.write(\'\\n\'.join(result))' }
                    ],
                    cpp: [
                        { title: 'Setup', desc: 'Fast output with printf -- N^M sequences can be many.', code: '#include <cstdio>\n\nint n, m;\nint path[8];' },
                        { title: 'Backtracking (no used)', desc: 'Repetition allowed, so no used check -- iterate all 1~N.', code: 'void backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            printf("%d%c", path[i], i < m-1 ? \' \' : \'\\n\');\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1);\n    }\n}' },
                        { title: 'Input and execution', desc: 'Fast input with scanf -- pairs with printf.', code: 'int main() {\n    scanf("%d %d", &n, &m);\n    backtrack(0);\n}' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-15652',
            title: 'BOJ 15652 - N and M (4)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15652',
            simIntro: 'Observe the process of generating combinations with repetition. The key is passing i (not i+1) to start!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given natural numbers N and M, write a program that prints all sequences of length M satisfying the following conditions.</p>
                <ul><li>A sequence of M numbers chosen from 1 to N</li><li>The same number can be chosen multiple times.</li><li>The chosen sequence must be in non-decreasing order.</li></ul>
                <h4>Input</h4>
                <p>The first line contains natural numbers N and M. (1 ≤ M ≤ N ≤ 8)</p>
                <h4>Output</h4>
                <p>Print one sequence per line satisfying the conditions. Do not print duplicate sequences, and separate numbers in each sequence with spaces.</p>
                <p>Sequences must be printed in lexicographic (dictionary) ascending order.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3 1</pre></div>
                    <div><strong>Output</strong><pre>1\n2\n3</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 2</pre></div>
                    <div><strong>Output</strong><pre>1 1\n1 2\n1 3\n1 4\n2 2\n2 3\n2 4\n3 3\n3 4\n4 4</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 ≤ M ≤ N ≤ 8</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Non-decreasing + repetition allowed... Generate everything like (3) and filter out non-ascending ones? Or take (2)\'s ascending code and just allow repetition?' },
                { title: 'But there\'s a problem with this', content: 'Generating everything like (3) and filtering is wasteful, and (2)\'s code passes <code>i+1</code> so it can\'t re-pick the same number. So what do we change?<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.85rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--accent);margin-bottom:3px;">(2) Ascending</div><code>backtrack(i+1)</code><div style="font-size:0.75rem;color:var(--text3);margin-top:2px;">Next num only → no repeats</div></div><div style="font-size:1.3rem;color:var(--text3);">→</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">(4) Non-decreasing</div><code>backtrack(i)</code><div style="font-size:0.75rem;color:var(--text3);margin-top:2px;">Same num ok → repeats!</div></div></div>' },
                { title: 'What if we try this?', content: 'Just change one character from (2)! Pass <code>i</code> instead of <code>i+1</code> in the recursive call, allowing the same number to be picked again. Since <code>start</code> doesn\'t increase, you can pick the same number repeatedly.<br><br><strong>N and M Series Summary:</strong><br>(1) Order matters, no repetition \u2192 <code>used</code> array<br>(2) Order doesn\'t matter, no repetition \u2192 <code>start</code>, <code>i+1</code><br>(3) Order matters, repetition allowed \u2192 no restrictions<br>(4) Order doesn\'t matter, repetition allowed \u2192 <code>start</code>, <code>i</code>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\n\ndef backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):\n        path.append(i)\n        backtrack(i)    # i, not i+1!\n        path.pop()\n\nbacktrack(1)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\n\nvoid backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1, i);  // i, not i+1!\n    }\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(0);\n    cin >> n >> m;\n    backtrack(0, 1);\n}'
            },
            solutions: [{
                approach: 'Combination with repetition using start parameter',
                description: 'Generate non-decreasing combinations with repetition by passing i to start',
                timeComplexity: 'O(C(N+M-1,M))',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: 'Setup', desc: 'Same structure as N and M (2) -- only the recursive argument differs.', code: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []' },
                        { title: 'start parameter', desc: 'Iterating from start ensures non-decreasing order.', code: 'def backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):' },
                        { title: 'Recurse with i (not i+1)', desc: 'Passing i allows re-picking the same number, creating combinations with repetition.', code: '        path.append(i)\n        backtrack(i)    # i, not i+1!\n        path.pop()\n\nbacktrack(1)' }
                    ],
                    cpp: [
                        { title: 'Setup', desc: 'Same structure as N and M (2) -- only the recursive argument differs.', code: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];' },
                        { title: 'start parameter', desc: 'Iterate only numbers >= start to maintain non-decreasing order.', code: 'void backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {' },
                        { title: 'Recurse with i (not i+1)', desc: 'i instead of i+1 \u2192 allows re-picking the same number.', code: '        path[depth] = i;\n        backtrack(depth + 1, i);  // i, not i+1!\n    }\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(0);\n    cin >> n >> m;\n    backtrack(0, 1);\n}' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[3].templates; }
            }]
        },
        // ========== Stage 2: Applied Backtracking ==========
        {
            id: 'boj-14888',
            title: 'BOJ 14888 - Operator Insertion',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14888',
            simIntro: 'Observe the backtracking process of placing operators to find max/min values.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>A sequence of N numbers A1, A2, ..., AN is given. Also, N-1 operators to insert between the numbers are given. The operators consist only of addition(+), subtraction(-), multiplication(\u00d7), and division(\u00f7).</p>
                <p>The expression is evaluated left to right, ignoring operator precedence. Division is integer division (as in C++14), taking only the quotient. When dividing a negative number by a positive, first convert to positive, take the quotient, then negate.</p>
                <h4>Input</h4>
                <p>The first line contains the count of numbers N (2 ≤ N ≤ 11). The second line contains A<sub>1</sub>, A<sub>2</sub>, ..., A<sub>N</sub>. (1 ≤ A<sub>i</sub> ≤ 100) The third line contains 4 integers whose sum equals N-1, representing the counts of addition(+), subtraction(-), multiplication(x), and division(÷) in order.</p>
                <h4>Output</h4>
                <p>Print the maximum result of the expression on the first line and the minimum on the second line. The result of any operator arrangement is always between -1 billion and 1 billion inclusive.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>2\n5 6\n0 0 1 0</pre></div>
                    <div><strong>Output</strong><pre>30\n30</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3\n3 4 5\n1 0 1 0</pre></div>
                    <div><strong>Output</strong><pre>35\n17</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6\n1 2 3 4 5 6\n2 1 1 1</pre></div>
                    <div><strong>Output</strong><pre>54\n-24</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>2 \u2264 N \u2264 11</li><li>1 \u2264 A<sub>i</sub> \u2264 100</li><li>Total operator count must beN-1</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'We\'re inserting N-1 operators between numbers... Try every possible <strong>ordering</strong> of operators? For example, if we have [+, -, \u00d7], generate all permutations and evaluate each.' },
                { title: 'But there\'s a problem with this', content: 'There can be multiple operators of the same type! For example, with 2 pluses and 1 times, permutations create duplicate arrangements and are inefficient. Managing operators as "count per type" would be much cleaner.' },
                { title: 'What if we try this?', content: 'Manage remaining counts with <code>ops = [+count, -count, \u00d7count, \u00f7count]</code>! At each position, check all 4 types and use those with count > 0.<br><br><div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><span style="padding:4px 8px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">Choose</span><span style="color:var(--text3);">ops[i] -= 1</span><span style="font-size:1.2rem;color:var(--text3);">→</span><span style="padding:4px 8px;border-radius:6px;background:var(--yellow);color:white;font-weight:600;">Recurse</span><span style="color:var(--text3);">backtrack()</span><span style="font-size:1.2rem;color:var(--text3);">→</span><span style="padding:4px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">Undo</span><span style="color:var(--text3);">ops[i] += 1</span></div>' },
                { title: 'Watch out: Division!', content: 'Division in this problem <strong>truncates toward zero</strong>. No issue with positive numbers, but be careful with negatives!<br><span class="lang-py">Python: <code>a // b</code> floors toward negative infinity, giving different results. Use <code>int(a / b)</code> for truncation toward zero!</span><span class="lang-cpp">C++: <code>a / b</code> truncates toward zero by default, so just use it as-is.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\nops = list(map(int, input().split()))  # +, -, *, //\n\nmax_val = -1e9\nmin_val = 1e9\n\ndef backtrack(idx, current):\n    global max_val, min_val\n    if idx == n:\n        max_val = max(max_val, current)\n        min_val = min(min_val, current)\n        return\n    for i in range(4):\n        if ops[i] > 0:\n            ops[i] -= 1\n            if i == 0:   nxt = current + nums[idx]\n            elif i == 1: nxt = current - nums[idx]\n            elif i == 2: nxt = current * nums[idx]\n            else:        nxt = int(current / nums[idx])  # truncate toward zero\n            backtrack(idx + 1, nxt)\n            ops[i] += 1\n\nbacktrack(1, nums[0])\nprint(max_val)\nprint(min_val)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint n, nums[12], ops[4];\nint maxVal = -1e9, minVal = 1e9;\n\nvoid backtrack(int idx, int cur) {\n    if (idx == n) {\n        maxVal = max(maxVal, cur);\n        minVal = min(minVal, cur);\n        return;\n    }\n    for (int i = 0; i < 4; i++) {\n        if (ops[i] > 0) {\n            ops[i]--;\n            int nxt;\n            if (i == 0) nxt = cur + nums[idx];\n            else if (i == 1) nxt = cur - nums[idx];\n            else if (i == 2) nxt = cur * nums[idx];\n            else nxt = cur / nums[idx];\n            backtrack(idx + 1, nxt);\n            ops[i]++;\n        }\n    }\n}\n\nint main() {\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    for (int i = 0; i < 4; i++) cin >> ops[i];\n    backtrack(1, nums[0]);\n    cout << maxVal << "\\n" << minVal << endl;\n}'
            },
            solutions: [{
                approach: 'Operator placement backtracking',
                description: 'Consume/restore operator counts to try all placements',
                timeComplexity: 'O(4^(N-1))',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Process Input', desc: 'Manage remaining count of each operator (+, -, *, //) with the ops list.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\nops = list(map(int, input().split()))\n\nmax_val = -1e9\nmin_val = 1e9' },
                        { title: 'Consume/Restore operators', desc: 'Use an operator (ops[i]-=1), recurse, then restore (ops[i]+=1) to try all placements.', code: 'def backtrack(idx, current):\n    global max_val, min_val\n    if idx == n:\n        max_val = max(max_val, current)\n        min_val = min(min_val, current)\n        return\n    for i in range(4):\n        if ops[i] > 0:\n            ops[i] -= 1\n            if i == 0:   nxt = current + nums[idx]\n            elif i == 1: nxt = current - nums[idx]\n            elif i == 2: nxt = current * nums[idx]\n            else:        nxt = int(current / nums[idx])\n            backtrack(idx + 1, nxt)\n            ops[i] += 1' },
                        { title: 'Update max/min', desc: 'Start from the first number (nums[0]) and find max/min across all operator placements.', code: 'backtrack(1, nums[0])\nprint(max_val)\nprint(min_val)' }
                    ],
                    cpp: [
                        { title: 'Process Input', desc: 'Manage remaining count of each operator (+, -, *, /) with ops[4].', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint n, nums[12], ops[4];\nint maxVal = -1e9, minVal = 1e9;' },
                        { title: 'Consume/Restore operators', desc: 'C++ integer division truncates toward zero by default -- no special handling needed.', code: 'void backtrack(int idx, int cur) {\n    if (idx == n) {\n        maxVal = max(maxVal, cur);\n        minVal = min(minVal, cur);\n        return;\n    }\n    for (int i = 0; i < 4; i++) {\n        if (ops[i] > 0) {\n            ops[i]--;\n            int nxt;\n            if (i == 0) nxt = cur + nums[idx];\n            else if (i == 1) nxt = cur - nums[idx];\n            else if (i == 2) nxt = cur * nums[idx];\n            else nxt = cur / nums[idx];  // truncate toward zero (C++ default)\n            backtrack(idx + 1, nxt);\n            ops[i]++;  // Undo\n        }\n    }\n}' },
                        { title: 'Update max/min', desc: 'Start from nums[0] as the initial value and explore all placements.', code: 'int main() {\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    for (int i = 0; i < 4; i++) cin >> ops[i];\n    backtrack(1, nums[0]);\n    cout << maxVal << "\\n" << minVal << endl;\n}' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-14889',
            title: 'BOJ 14889 - Start and Link',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14889',
            simIntro: 'Observe the process of splitting N people into two teams while minimizing the synergy difference.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Split even number N people into two teams of N/2 each. S<sub>ij</sub> is the ability when person i and person j are on the same team. A team's ability is the sum of S<sub>ij</sub> for all pairs in the team. Find the minimum difference in ability between the two teams.</p>
                <h4>Input</h4>
                <p>The first line contains N (4 ≤ N ≤ 20, N is even). From the second line, N lines each contain N numbers representing S. Each line's j-th number is S<sub>ij</sub>. S<sub>ii</sub> is always 0, and all other S<sub>ij</sub> are integers between 1 and 100 inclusive.</p>
                <h4>Output</h4>
                <p>Print the minimum difference between the Start team and Link team abilities on the first line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4\n0 1 2 3\n4 0 5 6\n7 1 0 2\n3 4 5 0</pre></div>
                    <div><strong>Output</strong><pre>0</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6\n0 1 2 3 4 5\n1 0 2 3 4 5\n1 2 0 3 4 5\n1 2 3 0 4 5\n1 2 3 4 0 5\n1 2 3 4 5 0</pre></div>
                    <div><strong>Output</strong><pre>2</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>4 \u2264 N \u2264 20 (even)</li><li>1 \u2264 S<sub>ij</sub> \u2264 100</li><li>S<sub>ii</sub> = 0</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'We\'re splitting N people into two teams, so why not try all possible team combinations? Pick N/2 people for the Start team, and the rest become the Link team.' },
                { title: 'But there\'s a problem with this', content: 'Right, but N can be up to 20. For each combination we must compute team synergy.<br><br><div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);">Combinations</div><div style="font-size:1.1rem;font-weight:700;color:var(--accent);">C(20,10) = 184,756</div></div><div style="font-size:1rem;color:var(--text3);">x</div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);">Synergy calc</div><div style="font-size:1.1rem;font-weight:700;color:var(--accent);">O(N<sup>2</sup>)</div></div><div style="font-size:1rem;color:var(--text3);">=</div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);">Total</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">Feasible!</div></div></div>Synergy sums <code>S[i][j] + S[j][i]</code> for all pairs. Can we do better?' },
                { title: 'What if we try this?', content: 'Implement team splitting as backtracking: for each person starting from 0, decide "put in Start team or not?" Similar to the combination pattern from N and M (2)!<br><br>Pruning tip: Choosing {1,2,3} for Start and {4,5,6} for Start produce mirror results (symmetry). So if we <strong>always fix person 0 on the Start team</strong>, the search space is cut in half!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ns = [list(map(int, input().split())) for _ in range(n)]\nans = float(\'inf\')\n\ndef calc(team):\n    total = 0\n    for i in range(len(team)):\n        for j in range(i+1, len(team)):\n            total += s[team[i]][team[j]] + s[team[j]][team[i]]\n    return total\n\ndef backtrack(idx, team):\n    global ans\n    if len(team) == n // 2:\n        other = [i for i in range(n) if i not in set(team)]\n        diff = abs(calc(team) - calc(other))\n        ans = min(ans, diff)\n        return\n    if idx >= n:\n        return\n    if n - idx < n // 2 - len(team):\n        return\n    team.append(idx)\n    backtrack(idx + 1, team)\n    team.pop()\n    backtrack(idx + 1, team)\n\nbacktrack(0, [])\nprint(ans)',
                cpp: '#include <iostream>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\nint n, s[20][20];\nbool team[20];\nint ans = 1e9;\n\nvoid backtrack(int idx, int cnt) {\n    if (cnt == n / 2) {\n        int s1 = 0, s2 = 0;\n        for (int i = 0; i < n; i++)\n            for (int j = i+1; j < n; j++) {\n                if (team[i] && team[j])\n                    s1 += s[i][j] + s[j][i];\n                else if (!team[i] && !team[j])\n                    s2 += s[i][j] + s[j][i];\n            }\n        ans = min(ans, abs(s1 - s2));\n        return;\n    }\n    if (idx >= n) return;\n    if (n - idx < n/2 - cnt) return;\n    team[idx] = true;\n    backtrack(idx + 1, cnt + 1);\n    team[idx] = false;\n    backtrack(idx + 1, cnt);\n}\n\nint main() {\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            cin >> s[i][j];\n    backtrack(0, 0);\n    cout << ans << endl;\n}'
            },
            solutions: [{
                approach: 'Team split backtracking',
                description: 'Select N/2 out of N people to minimize the synergy difference',
                timeComplexity: 'O(C(N,N/2)*N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input and initialization', desc: 'Read the N*N synergy matrix and initialize the minimum to infinity.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ns = [list(map(int, input().split())) for _ in range(n)]\nans = float(\'inf\')' },
                        { title: 'Select N/2 people', desc: 'Include or exclude each person from the team, exploring C(N,N/2) combinations.', code: 'def backtrack(idx, team):\n    global ans\n    if len(team) == n // 2:\n        other = [i for i in range(n) if i not in set(team)]\n        diff = abs(calc(team) - calc(other))\n        ans = min(ans, diff)\n        return\n    if idx >= n or n - idx < n // 2 - len(team):\n        return\n    team.append(idx)\n    backtrack(idx + 1, team)\n    team.pop()\n    backtrack(idx + 1, team)' },
                        { title: 'Synergy calculation and difference', desc: 'Sum S[i][j]+S[j][i] for all team member pairs to get the difference between two teams.', code: 'def calc(team):\n    total = 0\n    for i in range(len(team)):\n        for j in range(i+1, len(team)):\n            total += s[team[i]][team[j]] + s[team[j]][team[i]]\n    return total\n\nbacktrack(0, [])\nprint(ans)' }
                    ],
                    cpp: [
                        { title: 'Input and initialization', desc: 'Manage team membership with bool team[].\nUse bool toggle instead of Python\'s list.append/pop.', code: '#include <iostream>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\nint n, s[20][20];\nbool team[20];\nint ans = 1e9;' },
                        { title: 'Select N/2 people', desc: 'Pruning: early termination if remaining people are insufficient.', code: 'void backtrack(int idx, int cnt) {\n    if (cnt == n / 2) {\n        int s1 = 0, s2 = 0;\n        for (int i = 0; i < n; i++)\n            for (int j = i + 1; j < n; j++) {\n                if (team[i] && team[j])\n                    s1 += s[i][j] + s[j][i];\n                else if (!team[i] && !team[j])\n                    s2 += s[i][j] + s[j][i];\n            }\n        ans = min(ans, abs(s1 - s2));\n        return;\n    }\n    if (idx >= n || n - idx < n/2 - cnt) return;\n    team[idx] = true;\n    backtrack(idx + 1, cnt + 1);\n    team[idx] = false;  // Undo\n    backtrack(idx + 1, cnt);\n}' },
                        { title: 'Synergy calculation and difference', desc: 'Classify teams using team[] array, then compare pairwise synergy sums.', code: 'int main() {\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            cin >> s[i][j];\n    backtrack(0, 0);\n    cout << ans << endl;\n}' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[5].templates; }
            }]
        },
        // ========== Stage 3: Advanced Backtracking ==========
        {
            id: 'boj-9663',
            title: 'BOJ 9663 - N-Queen',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/9663',
            simIntro: 'Observe the process of placing queens on a 4x4 board and checking for conflicts.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Place N queens on an N\u00d7N chessboard so that no two queens attack each other. Given N, write a program to find the number of ways to place the queens.</p>
                <h4>Input</h4>
                <p>The first line contains N. (1 ≤ N &lt; 15)</p>
                <h4>Output</h4>
                <p>Print the number of ways to place N queens so that they cannot attack each other on the first line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>8</pre></div>
                    <div><strong>Output</strong><pre>92</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 \u2264 N \u2264 15 (time limit: 10 seconds)</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Try placing queens on every cell of the N\u00d7N board? Try all ways to place N queens in N<sup>2</sup> cells... it would work, right?' },
                { title: 'But there\'s a problem with this', content: 'For N=8, choosing 8 from 64 cells is C(64, 8) \u2248 4.4 billion! Way too many.<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">All cell combos</div><div style="font-size:1.1rem;font-weight:700;color:var(--red);">C(64,8) \u2248 4.4B</div></div><div style="font-size:1.2rem;color:var(--text3);">\u2192</div><div style="text-align:center;"><div style="font-weight:600;color:var(--yellow);margin-bottom:3px;">One per row</div><div style="font-size:1.1rem;font-weight:700;color:var(--yellow);">8<sup>8</sup> = 16.7M</div></div><div style="font-size:1.2rem;color:var(--text3);">\u2192</div><div style="text-align:center;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">+ Pruning</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">Much less!</div></div></div>Since no two queens can be in the same row, placing <strong>one per row</strong> and pruning conflicts makes it fast.' },
                { title: 'What if we try this?', content: 'Backtrack by choosing a <strong>column</strong> for each row! Row conflicts are structurally impossible, so we just check three things:<br>1. Is there already a queen in this column? \u2192 <code>col[c]</code><br>2. Is there a queen on the \u2198 diagonal? \u2192 Same diagonal has same <code>row - col</code> value! \u2192 <code>diag1[r-c+N]</code><br>3. Is there a queen on the \u2197 diagonal? \u2192 Same diagonal has same <code>row + col</code> value! \u2192 <code>diag2[r+c]</code>' },
                { title: 'We can make it even faster!', content: 'Instead of a 2D board, use just <strong>3 one-dimensional arrays</strong> (col, diag1, diag2) for O(1) conflict checking. No need to scan the board each time -- just check one array index. This is fast enough to handle N=15 within 10 seconds!' }
            ],
            templates: {
                python: 'import sys\n\nn = int(sys.stdin.readline())\ncol = [False] * n\ndiag1 = [False] * (2 * n)  # row - col + n\ndiag2 = [False] * (2 * n)  # row + col\ncount = 0\n\ndef solve(row):\n    global count\n    if row == n:\n        count += 1\n        return\n    for c in range(n):\n        if not col[c] and not diag1[row - c + n] and not diag2[row + c]:\n            col[c] = diag1[row - c + n] = diag2[row + c] = True\n            solve(row + 1)\n            col[c] = diag1[row - c + n] = diag2[row + c] = False\n\nsolve(0)\nprint(count)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, cnt = 0;\nbool col[15], diag1[30], diag2[30];\n\nvoid solve(int row) {\n    if (row == n) { cnt++; return; }\n    for (int c = 0; c < n; c++) {\n        if (!col[c] && !diag1[row-c+n] && !diag2[row+c]) {\n            col[c] = diag1[row-c+n] = diag2[row+c] = true;\n            solve(row + 1);\n            col[c] = diag1[row-c+n] = diag2[row+c] = false;\n        }\n    }\n}\n\nint main() {\n    cin >> n;\n    solve(0);\n    cout << cnt << endl;\n}'
            },
            solutions: [{
                approach: 'Column/diagonal check backtracking',
                description: 'O(1) conflict checking with col, diag1, diag2 arrays',
                timeComplexity: 'O(N!)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Conflict array setup', desc: 'Three arrays (col/diag1/diag2) for O(1) checking of column and both diagonal conflicts.', code: 'import sys\n\nn = int(sys.stdin.readline())\ncol = [False] * n\ndiag1 = [False] * (2 * n)  # row - col + n\ndiag2 = [False] * (2 * n)  # row + col\ncount = 0' },
                        { title: 'Place queen per row', desc: 'Since only one queen per row, recursively select a column for each row.', code: 'def solve(row):\n    global count\n    if row == n:\n        count += 1\n        return\n    for c in range(n):' },
                        { title: 'Diagonal conflict check', desc: 'row-c+n (\u2198 diagonal), row+c (\u2197 diagonal) as indices to detect conflicts.', code: '        if not col[c] and not diag1[row - c + n] and not diag2[row + c]:\n            col[c] = diag1[row - c + n] = diag2[row + c] = True\n            solve(row + 1)\n            col[c] = diag1[row - c + n] = diag2[row + c] = False\n\nsolve(0)\nprint(count)' }
                    ],
                    cpp: [
                        { title: 'Conflict array setup', desc: 'col: column usage, diag1/diag2: diagonal usage.\nThree bool arrays for O(1) conflict checking.', code: '#include <iostream>\nusing namespace std;\n\nint n, cnt = 0;\nbool col[15], diag1[30], diag2[30];' },
                        { title: 'Place queen per row', desc: 'Select one column per row -- row conflicts are structurally impossible.', code: 'void solve(int row) {\n    if (row == n) {\n        cnt++;\n        return;\n    }\n    for (int c = 0; c < n; c++) {' },
                        { title: 'Diagonal conflict check', desc: 'row-c+n: \u2198 diagonal index (prevents negative).\nrow+c: \u2197 diagonal index.', code: '        if (!col[c] && !diag1[row-c+n] && !diag2[row+c]) {\n            col[c] = diag1[row-c+n] = diag2[row+c] = true;\n            solve(row + 1);\n            col[c] = diag1[row-c+n] = diag2[row+c] = false;\n        }\n    }\n}\n\nint main() {\n    cin >> n;\n    solve(0);\n    cout << cnt << endl;\n}' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[6].templates; }
            }]
        },
        {
            id: 'boj-2580',
            title: 'BOJ 2580 - Sudoku',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2580',
            simIntro: 'Observe the backtracking process of filling blank cells in a 4x4 mini Sudoku.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Sudoku originates from the 'Latin Square' puzzle created by an 18th-century Swiss mathematician. It is a puzzle where you fill numbers 1 through 9 into a 9-row, 9-column grid.</p>
                <p>Fill in the blank cells (0) such that no number repeats in the same row, same column, or same 3\u00d73 box. If there are multiple answers, print only one.</p>
                <h4>Input</h4>
                <p>Nine lines, each containing 9 numbers separated by spaces, represent the initial Sudoku board. Blank cells are given as 0. No unsolvable input is given.</p>
                <h4>Output</h4>
                <p>Print the completed Sudoku board over nine lines, each containing 9 numbers separated by spaces.</p>
                <p>If there are multiple solutions, print only one.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>0 3 5 4 6 9 2 7 8\n7 8 2 1 0 5 6 0 9\n0 6 0 2 7 8 1 3 5\n3 2 1 0 4 6 8 9 7\n8 0 4 9 1 3 5 0 6\n5 9 6 8 2 0 4 1 3\n9 1 7 6 5 2 0 8 0\n6 0 3 7 0 1 9 5 2\n2 5 8 3 9 4 7 6 0</pre></div>
                    <div><strong>Output</strong><pre>1 3 5 4 6 9 2 7 8\n7 8 2 1 3 5 6 4 9\n4 6 9 2 7 8 1 3 5\n3 2 1 5 4 6 8 9 7\n8 7 4 9 1 3 5 2 6\n5 9 6 8 2 7 4 1 3\n9 1 7 6 5 2 3 8 4\n6 4 3 7 8 1 9 5 2\n2 5 8 3 9 4 7 6 1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>Blank cells are represented as 0</li><li>If there are multiple answers, print only one</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'How about trying 1~9 in each blank cell? Put 1 in the first blank, then 1 in the second blank... try every possibility like this.' },
                { title: 'But there\'s a problem with this', content: 'With many blanks, we\'d try 9<sup>blanks</sup> possibilities! But Sudoku has strict rules -- no repeats in the same row, column, or 3\u00d73 box. If we check these constraints <strong>at the moment of placing</strong>, we can prune impossible branches early.' },
                { title: 'What if we try this?', content: 'Collect all blank cell coordinates upfront, then fill them one by one with backtracking!<br><br>Each time we place a number, check three things:<br><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;color:var(--accent);">1. Row check</div><div style="display:flex;gap:2px;margin-top:4px;"><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">5</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">3</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">?</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">7</span></div></div><div style="border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;color:var(--green);">2. Col check</div><div style="display:flex;flex-direction:column;gap:2px;margin-top:4px;align-items:center;"><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;">6</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">?</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">9</span></div></div><div style="border:1.5px solid var(--yellow);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;color:var(--yellow);">3. 3x3 box</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:4px;"><span style="padding:2px 5px;border-radius:3px;background:var(--yellow);color:white;font-size:0.7rem;">5</span><span style="padding:2px 5px;border-radius:3px;background:var(--yellow);color:white;font-size:0.7rem;">3</span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;">?</span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;">6</span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;"> </span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;"> </span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;"> </span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;">9</span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;">8</span></div></div></div>The 3x3 box starting point is <code>(row//3*3, col//3*3)</code>. If it fails, reset to 0 and try the next number!' },
                { title: 'Final point: Immediate termination!', content: 'There may be multiple answers, but we only need to <strong>print one</strong>. Once all blanks are filled, print immediately and terminate the program.<br><span class="lang-py">Python: Terminate immediately with <code>sys.exit()</code></span><span class="lang-cpp">C++: Terminate immediately with <code>exit(0)</code></span><br><br>Want it faster? Fill blanks with the <strong>fewest possible numbers</strong> first for stronger pruning!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nboard = [list(map(int, input().split())) for _ in range(9)]\nblanks = [(r, c) for r in range(9) for c in range(9) if board[r][c] == 0]\n\ndef is_valid(r, c, num):\n    if num in board[r]: return False\n    for i in range(9):\n        if board[i][c] == num: return False\n    sr, sc = r // 3 * 3, c // 3 * 3\n    for i in range(sr, sr + 3):\n        for j in range(sc, sc + 3):\n            if board[i][j] == num: return False\n    return True\n\ndef solve(idx):\n    if idx == len(blanks):\n        for row in board:\n            print(*row)\n        sys.exit()\n    r, c = blanks[idx]\n    for num in range(1, 10):\n        if is_valid(r, c, num):\n            board[r][c] = num\n            solve(idx + 1)\n            board[r][c] = 0\n\nsolve(0)',
                cpp: '#include <iostream>\n#include <vector>\n#include <cstdlib>\nusing namespace std;\n\nint board[9][9];\nvector<pair<int,int>> blanks;\n\nbool isValid(int r, int c, int num) {\n    for (int i = 0; i < 9; i++) {\n        if (board[r][i] == num) return false;\n        if (board[i][c] == num) return false;\n    }\n    int sr = r/3*3, sc = c/3*3;\n    for (int i = sr; i < sr+3; i++)\n        for (int j = sc; j < sc+3; j++)\n            if (board[i][j] == num) return false;\n    return true;\n}\n\nvoid solve(int idx) {\n    if (idx == blanks.size()) {\n        for (int i = 0; i < 9; i++) {\n            for (int j = 0; j < 9; j++)\n                cout << board[i][j] << (j < 8 ? " " : "\\n");\n        }\n        exit(0);\n    }\n    auto [r, c] = blanks[idx];\n    for (int num = 1; num <= 9; num++) {\n        if (isValid(r, c, num)) {\n            board[r][c] = num;\n            solve(idx + 1);\n            board[r][c] = 0;\n        }\n    }\n}\n\nint main() {\n    for (int i = 0; i < 9; i++)\n        for (int j = 0; j < 9; j++) {\n            cin >> board[i][j];\n            if (board[i][j] == 0) blanks.push_back({i, j});\n        }\n    solve(0);\n}'
            },
            solutions: [{
                approach: 'Blank cell filling backtracking',
                description: 'Try 1~9 in each blank cell sequentially with conflict checking',
                timeComplexity: 'O(9^blanks)',
                spaceComplexity: 'O(81)',
                codeSteps: {
                    python: [
                        { title: 'Collect blanks', desc: 'Gather blank (0) cell coordinates upfront so we just fill them in order.', code: 'import sys\ninput = sys.stdin.readline\n\nboard = [list(map(int, input().split())) for _ in range(9)]\nblanks = [(r, c) for r in range(9) for c in range(9) if board[r][c] == 0]' },
                        { title: 'Row/Column/Box validation', desc: 'Check there are no duplicates in the same row, column, or 3x3 box.', code: 'def is_valid(r, c, num):\n    if num in board[r]: return False\n    for i in range(9):\n        if board[i][c] == num: return False\n    sr, sc = r // 3 * 3, c // 3 * 3\n    for i in range(sr, sr + 3):\n        for j in range(sc, sc + 3):\n            if board[i][j] == num: return False\n    return True' },
                        { title: 'Fill and output', desc: 'Try 1~9, reset to 0 on failure; when complete, immediately exit with sys.exit().', code: 'def solve(idx):\n    if idx == len(blanks):\n        for row in board:\n            print(*row)\n        sys.exit()\n    r, c = blanks[idx]\n    for num in range(1, 10):\n        if is_valid(r, c, num):\n            board[r][c] = num\n            solve(idx + 1)\n            board[r][c] = 0\n\nsolve(0)' }
                    ],
                    cpp: [
                        { title: 'Collect blanks', desc: 'Structured binding with auto [r, c] (C++17).\nexit(0) terminates immediately when answer is found.', code: '#include <iostream>\n#include <vector>\n#include <cstdlib>\nusing namespace std;\n\nint board[9][9];\nvector<pair<int,int>> blanks;' },
                        { title: 'Row/Column/Box validation', desc: 'Compute 3x3 box starting point with r/3*3, c/3*3.', code: 'bool isValid(int r, int c, int num) {\n    for (int i = 0; i < 9; i++) {\n        if (board[r][i] == num) return false;  // row\n        if (board[i][c] == num) return false;  // column\n    }\n    int sr = r/3*3, sc = c/3*3;  // 3x3 box start\n    for (int i = sr; i < sr+3; i++)\n        for (int j = sc; j < sc+3; j++)\n            if (board[i][j] == num) return false;\n    return true;\n}' },
                        { title: 'Fill and output', desc: 'Try 1~9, reset to 0 on failure; exit(0) terminates immediately on first answer.', code: 'void solve(int idx) {\n    if (idx == (int)blanks.size()) {\n        for (int i = 0; i < 9; i++) {\n            for (int j = 0; j < 9; j++)\n                cout << board[i][j] << (j < 8 ? " " : "\\n");\n        }\n        exit(0);  // Print one answer and terminate\n    }\n    auto [r, c] = blanks[idx];\n    for (int num = 1; num <= 9; num++) {\n        if (isValid(r, c, num)) {\n            board[r][c] = num;\n            solve(idx + 1);\n            board[r][c] = 0;  // Undo\n        }\n    }\n}\n\nint main() {\n    for (int i = 0; i < 9; i++)\n        for (int j = 0; j < 9; j++) {\n            cin >> board[i][j];\n            if (board[i][j] == 0)\n                blanks.push_back({i, j});\n        }\n    solve(0);\n}' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[7].templates; }
            }]
        }
    ],

    // ===== Legacy Stub =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', function() { backtrackingTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.backtracking = backtrackingTopic;
