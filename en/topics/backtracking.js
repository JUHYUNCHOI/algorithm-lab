// ===== Backtracking Topic Module =====
var backtrackingTopic = {
    id: 'backtracking',
    title: 'Backtracking',
    icon: '🔙',
    category: 'Algorithm Techniques',
    order: 10,
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
        container.appendChild(contentDiv);
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
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>';
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

            <!-- 3. What is Pruning? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> What is Pruning?</div>
                <p style="margin-bottom: 1rem;">The most important technique in backtracking is
                    <strong>pruning</strong>.
                    It means <strong>filtering out invalid choices early</strong> so they are never explored at all.</p>

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

            <!-- 4. Backtracking vs Brute Force -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> Backtracking vs Brute Force</div>
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

            <!-- 5. 4 Steps to Solve Backtracking Problems -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 4 Steps to Solve Backtracking Problems</div>
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

    _createStepControls(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ Prev</button>' +
            '<span id="str-indicator-' + suffix + '">Before Start</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">Next ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ Click Next to start</div>';
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
            if (idx < 0) { indicator.textContent = 'Before Start'; desc.textContent = '▶ Click Next to start'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
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
    // Simulation 1: N and M (1) — Permutation (boj-15649)
    // ====================================================================
    _renderVizNM1(contentEl) {
        var self = this;
        var suffix = '-nm1';
        var defaultN = 4, defaultM = 2;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N and M (1) — Permutation Generation</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="bt-nm1-n" value="' + defaultN + '" min="1" max="7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">M: <input type="number" id="bt-nm1-m" value="' + defaultM + '" min="1" max="7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt-nm1-reset">🔄</button>' +
            '</div>' +
            '<p id="nm1-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;">{1..' + defaultN + '}, pick' + defaultM + ' without repetition to generate permutations.</p>' +
            '<div id="nm1-path' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;">path = [ ]</div>' +
            '<div id="nm1-used' + suffix + '" style="text-align:center;margin-bottom:8px;"></div>' +
            '<div id="nm1-results' + suffix + '" style="padding:8px;background:var(--bg);border-radius:8px;min-height:32px;margin-bottom:12px;text-align:center;font-size:0.85rem;"></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm1-path' + suffix);
        var usedEl = contentEl.querySelector('#nm1-used' + suffix);
        var resultsEl = contentEl.querySelector('#nm1-results' + suffix);
        var descEl = contentEl.querySelector('#nm1-desc' + suffix);
        var inputN = contentEl.querySelector('#bt-nm1-n');
        var inputM = contentEl.querySelector('#bt-nm1-m');
        var resetBtn = contentEl.querySelector('#bt-nm1-reset');
        function buildAndRun(N, M) {
            descEl.textContent = '{1..' + N + '}, pick' + M + ' without repetition to generate permutations.';
            function renderUsed(u) { var h = ''; for (var i = 1; i <= N; i++) h += '<span style="display:inline-block;width:30px;height:30px;line-height:30px;text-align:center;margin:2px;border-radius:6px;font-weight:600;font-size:0.85rem;' + (u[i] ? 'background:var(--accent);color:white;' : 'background:var(--bg2);') + '">' + i + '</span>'; usedEl.innerHTML = h; }
            var initUsed = []; for (var i = 0; i <= N; i++) initUsed.push(false);
            renderUsed(initUsed);
            pathEl.textContent = 'path = [ ]'; pathEl.style.color = '';
            resultsEl.innerHTML = '<span style="color:var(--text3);">Sequences will appear here</span>';
            var steps = [], path = [], used = initUsed.slice(), found = [];
            var solve = function(depth) {
                if (depth === M) { var snap = path.slice(); found.push(snap); var rc = found.length;
                    (function(s,r) { steps.push({ description: 'Sequence [' + s.join(', ') + '] complete! (#' + r + ')',
                        action: function() { pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)'; resultsEl.innerHTML = found.slice(0,r).map(function(x){return '['+x.join(',')+']';}).join(' '); },
                        undo: function() { var p = s.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; resultsEl.innerHTML = r>1 ? found.slice(0,r-1).map(function(x){return '['+x.join(',')+']';}).join(' ') : '<span style="color:var(--text3);">Sequences will appear here</span>'; }
                    }); })(snap, rc); return; }
                for (var i = 1; i <= N; i++) {
                    if (used[i]) { (function(ci,sp,su) { steps.push({ description: ci + ' is in use → Skip (pruning)',
                        action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ':'') + ci + '? ]'; pathEl.style.color = 'var(--red)'; renderUsed(su); },
                        undo: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; renderUsed(su); }
                    }); })(i,path.slice(),used.slice()); continue; }
                    used[i] = true; path.push(i);
                    (function(ci,sp,su) { steps.push({ description: ci + ' chosen → path = [' + sp.join(', ') + ']',
                        action: function() { pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length<M?', ___':'') + ' ]'; pathEl.style.color = ''; renderUsed(su); },
                        undo: function() { var p = sp.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ]'; var pu = su.slice(); pu[ci] = false; renderUsed(pu); }
                    }); })(i,path.slice(),used.slice());
                    solve(depth + 1);
                    path.pop(); used[i] = false;
                    (function(ci,sp,su) { steps.push({ description: ci + ' undone',
                        action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; renderUsed(su); },
                        undo: function() { var r = sp.slice(); r.push(ci); pathEl.textContent = 'path = [ ' + r.join(', ') + (r.length<M?', ___':'') + ' ]'; var ru = su.slice(); ru[ci] = true; renderUsed(ru); }
                    }); })(i,path.slice(),used.slice());
                }
            };
            solve(0);
            steps.push({ description: 'Search complete! Total: ' + found.length, action: function(){}, undo: function(){} });
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var N = Math.max(1, Math.min(7, parseInt(inputN.value) || defaultN));
            var M = Math.max(1, Math.min(N, parseInt(inputM.value) || defaultM));
            inputN.value = N; inputM.value = M;
            self._clearVizState();
            buildAndRun(N, M);
        });
        buildAndRun(defaultN, defaultM);
    },

    // ====================================================================
    // Simulation 2: N and M (2) — Combination (boj-15650)
    // ====================================================================
    _renderVizNM2(contentEl) {
        var self = this, suffix = '-nm2';
        var defaultN = 4, defaultM = 2;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N and M (2) — Combination Generation</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="bt-nm2-n" value="' + defaultN + '" min="1" max="7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">M: <input type="number" id="bt-nm2-m" value="' + defaultM + '" min="1" max="7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt-nm2-reset">🔄</button>' +
            '</div>' +
            '<p id="nm2-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;">{1..' + defaultN + '}, pick' + defaultM + ' in ascending order. The start parameter prevents duplicates.</p>' +
            '<div id="nm2-path' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;">path = [ ], start = 1</div>' +
            '<div id="nm2-results' + suffix + '" style="padding:8px;background:var(--bg);border-radius:8px;min-height:32px;margin-bottom:12px;text-align:center;font-size:0.85rem;"></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm2-path' + suffix);
        var resultsEl = contentEl.querySelector('#nm2-results' + suffix);
        var descEl = contentEl.querySelector('#nm2-desc' + suffix);
        var inputN = contentEl.querySelector('#bt-nm2-n');
        var inputM = contentEl.querySelector('#bt-nm2-m');
        var resetBtn = contentEl.querySelector('#bt-nm2-reset');
        function buildAndRun(N, M) {
            descEl.textContent = '{1..' + N + '}, pick' + M + ' in ascending order. The start parameter prevents duplicates.';
            pathEl.textContent = 'path = [ ], start = 1'; pathEl.style.color = '';
            resultsEl.innerHTML = '<span style="color:var(--text3);">Combinations will appear here</span>';
            var steps = [], path = [], found = [];
            var solve = function(start) {
                if (path.length === M) { var snap = path.slice(); found.push(snap); var rc = found.length;
                    (function(s,r) { steps.push({ description: 'Combination [' + s.join(', ') + '] complete! (#' + r + ')',
                        action: function() { pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)'; resultsEl.innerHTML = found.slice(0,r).map(function(x){return '['+x.join(',')+']';}).join(' '); },
                        undo: function() { var p = s.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ], start = ' + s[s.length-1]; pathEl.style.color = ''; resultsEl.innerHTML = r>1 ? found.slice(0,r-1).map(function(x){return '['+x.join(',')+']';}).join(' ') : '<span style="color:var(--text3);">Combinations will appear here</span>'; }
                    }); })(snap,rc); return; }
                for (var i = start; i <= N; i++) {
                    path.push(i);
                    (function(ci,sp,st) { steps.push({ description: ci + ' chosen (start=' + st + ') → path = [' + sp.join(', ') + ']',
                        action: function() { pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length<M?', ___':'') + ' ], start = ' + (ci+1); pathEl.style.color = ''; },
                        undo: function() { var p = sp.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ], start = ' + st; }
                    }); })(i,path.slice(),start);
                    solve(i + 1);
                    path.pop();
                    (function(ci,sp,st) { steps.push({ description: ci + ' undone',
                        action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ], start = ' + st; pathEl.style.color = ''; },
                        undo: function() { var r = sp.slice(); r.push(ci); pathEl.textContent = 'path = [ ' + r.join(', ') + (r.length<M?', ___':'') + ' ], start = ' + (ci+1); }
                    }); })(i,path.slice(),start);
                }
            };
            solve(1);
            steps.push({ description: 'Search complete! Total:' + found.length + ' combinations', action: function(){}, undo: function(){} });
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var N = Math.max(1, Math.min(7, parseInt(inputN.value) || defaultN));
            var M = Math.max(1, Math.min(N, parseInt(inputM.value) || defaultM));
            inputN.value = N; inputM.value = M;
            self._clearVizState();
            buildAndRun(N, M);
        });
        buildAndRun(defaultN, defaultM);
    },

    // ====================================================================
    // Simulation 3: N and M (3) — Perm. w/ Repetition (boj-15651)
    // ====================================================================
    _renderVizNM3(contentEl) {
        var self = this, suffix = '-nm3';
        var defaultN = 3, defaultM = 2;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N and M (3) — Perm. w/ Repetition</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="bt-nm3-n" value="' + defaultN + '" min="1" max="5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">M: <input type="number" id="bt-nm3-m" value="' + defaultM + '" min="1" max="5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt-nm3-reset">🔄</button>' +
            '</div>' +
            '<p id="nm3-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;">{1..' + defaultN + '}, pick' + defaultM + ' with repetition allowed. No used array needed!</p>' +
            '<div id="nm3-path' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;">path = [ ]</div>' +
            '<div id="nm3-results' + suffix + '" style="padding:8px;background:var(--bg);border-radius:8px;min-height:32px;margin-bottom:12px;text-align:center;font-size:0.85rem;"></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm3-path' + suffix);
        var resultsEl = contentEl.querySelector('#nm3-results' + suffix);
        var descEl = contentEl.querySelector('#nm3-desc' + suffix);
        var inputN = contentEl.querySelector('#bt-nm3-n');
        var inputM = contentEl.querySelector('#bt-nm3-m');
        var resetBtn = contentEl.querySelector('#bt-nm3-reset');
        function buildAndRun(N, M) {
            descEl.textContent = '{1..' + N + '}, pick' + M + ' with repetition allowed. No used array needed!';
            pathEl.textContent = 'path = [ ]'; pathEl.style.color = '';
            resultsEl.innerHTML = '<span style="color:var(--text3);">Permutations w/ repetition will appear here</span>';
            var steps = [], path = [], found = [];
            var solve = function() {
                if (path.length === M) { var snap = path.slice(); found.push(snap); var rc = found.length;
                    (function(s,r) { steps.push({ description: '[' + s.join(', ') + '] complete! (#' + r + ')',
                        action: function() { pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)'; resultsEl.innerHTML = found.slice(0,r).map(function(x){return '['+x.join(',')+']';}).join(' '); },
                        undo: function() { var p = s.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; resultsEl.innerHTML = r>1 ? found.slice(0,r-1).map(function(x){return '['+x.join(',')+']';}).join(' ') : '<span style="color:var(--text3);">Permutations w/ repetition will appear here</span>'; }
                    }); })(snap,rc); return; }
                for (var i = 1; i <= N; i++) {
                    path.push(i);
                    (function(ci,sp) { steps.push({ description: ci + ' chosen → path = [' + sp.join(', ') + '] (repetition allowed)',
                        action: function() { pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length<M?', ___':'') + ' ]'; pathEl.style.color = ''; },
                        undo: function() { var p = sp.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ]'; }
                    }); })(i,path.slice());
                    solve();
                    path.pop();
                    (function(ci,sp) { steps.push({ description: ci + ' undone',
                        action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; },
                        undo: function() { var r = sp.slice(); r.push(ci); pathEl.textContent = 'path = [ ' + r.join(', ') + (r.length<M?', ___':'') + ' ]'; }
                    }); })(i,path.slice());
                }
            };
            solve();
            steps.push({ description: 'Search complete! Total:' + found.length + ' (N^M = ' + N + '^' + M + ' = ' + Math.pow(N,M) + ')', action: function(){}, undo: function(){} });
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var N = Math.max(1, Math.min(5, parseInt(inputN.value) || defaultN));
            var M = Math.max(1, Math.min(5, parseInt(inputM.value) || defaultM));
            inputN.value = N; inputM.value = M;
            self._clearVizState();
            buildAndRun(N, M);
        });
        buildAndRun(defaultN, defaultM);
    },

    // ====================================================================
    // Simulation 4: N and M (4) — Comb. w/ Repetition (boj-15652)
    // ====================================================================
    _renderVizNM4(contentEl) {
        var self = this, suffix = '-nm4';
        var defaultN = 3, defaultM = 2;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N and M (4) — Comb. w/ Repetition</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="bt-nm4-n" value="' + defaultN + '" min="1" max="5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">M: <input type="number" id="bt-nm4-m" value="' + defaultM + '" min="1" max="5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt-nm4-reset">🔄</button>' +
            '</div>' +
            '<p id="nm4-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;">{1..' + defaultN + '}, pickrepetition allowed + non-decreasing order,' + defaultM + '. Pass start as i (not i+1!).</p>' +
            '<div id="nm4-path' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;">path = [ ], start = 1</div>' +
            '<div id="nm4-results' + suffix + '" style="padding:8px;background:var(--bg);border-radius:8px;min-height:32px;margin-bottom:12px;text-align:center;font-size:0.85rem;"></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm4-path' + suffix);
        var resultsEl = contentEl.querySelector('#nm4-results' + suffix);
        var descEl = contentEl.querySelector('#nm4-desc' + suffix);
        var inputN = contentEl.querySelector('#bt-nm4-n');
        var inputM = contentEl.querySelector('#bt-nm4-m');
        var resetBtn = contentEl.querySelector('#bt-nm4-reset');
        function buildAndRun(N, M) {
            descEl.textContent = '{1..' + N + '}, pickrepetition allowed + non-decreasing order,' + M + '. Pass start as i (not i+1!).';
            pathEl.textContent = 'path = [ ], start = 1'; pathEl.style.color = '';
            resultsEl.innerHTML = '<span style="color:var(--text3);">Combinations w/ repetition will appear here</span>';
            var steps = [], path = [], found = [];
            var solve = function(start) {
                if (path.length === M) { var snap = path.slice(); found.push(snap); var rc = found.length;
                    (function(s,r) { steps.push({ description: '[' + s.join(', ') + '] complete! (#' + r + ')',
                        action: function() { pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)'; resultsEl.innerHTML = found.slice(0,r).map(function(x){return '['+x.join(',')+']';}).join(' '); },
                        undo: function() { var p = s.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ], start = ' + s[s.length-1]; pathEl.style.color = ''; resultsEl.innerHTML = r>1 ? found.slice(0,r-1).map(function(x){return '['+x.join(',')+']';}).join(' ') : '<span style="color:var(--text3);">Combinations w/ repetition will appear here</span>'; }
                    }); })(snap,rc); return; }
                for (var i = start; i <= N; i++) {
                    path.push(i);
                    (function(ci,sp,st) { steps.push({ description: ci + ' chosen (start=' + st + ') → path = [' + sp.join(', ') + ']',
                        action: function() { pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length<M?', ___':'') + ' ], start = ' + ci; pathEl.style.color = ''; },
                        undo: function() { var p = sp.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ], start = ' + st; }
                    }); })(i,path.slice(),start);
                    solve(i); // i, not i+1!
                    path.pop();
                    (function(ci,sp,st) { steps.push({ description: ci + ' undone',
                        action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ], start = ' + st; pathEl.style.color = ''; },
                        undo: function() { var r = sp.slice(); r.push(ci); pathEl.textContent = 'path = [ ' + r.join(', ') + (r.length<M?', ___':'') + ' ], start = ' + ci; }
                    }); })(i,path.slice(),start);
                }
            };
            solve(1);
            steps.push({ description: 'Search complete! Total:' + found.length + ' combinations w/ repetition', action: function(){}, undo: function(){} });
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var N = Math.max(1, Math.min(5, parseInt(inputN.value) || defaultN));
            var M = Math.max(1, Math.min(5, parseInt(inputM.value) || defaultM));
            inputN.value = N; inputM.value = M;
            self._clearVizState();
            buildAndRun(N, M);
        });
        buildAndRun(defaultN, defaultM);
    },
    // ====================================================================
    // Simulation 5: Operator Insertion (boj-14888)
    // ====================================================================
    _renderVizOperator(contentEl) {
        var self = this, suffix = '-op';
        var defaultNums = [1, 2, 3], defaultOps = [1, 1, 0, 0]; // +1, -1
        var opSyms = ['+', '-', '*', '/'];
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">Operator Insertion</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Numbers:<input type="text" id="bt-op-nums" value="' + defaultNums.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:120px;" placeholder="1,2,3"></label>' +
            '<label style="font-weight:600;">Operators(+,-,*,/):<input type="text" id="bt-op-ops" value="' + defaultOps.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:100px;" placeholder="1,1,0,0"></label>' +
            '<button class="btn btn-primary" id="bt-op-reset">🔄</button>' +
            '</div>' +
            '<p id="op-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></p>' +
            '<div id="op-expr' + suffix + '" style="text-align:center;font-size:1.2rem;font-weight:600;margin-bottom:8px;"></div>' +
            '<div id="op-ops' + suffix + '" style="text-align:center;margin-bottom:8px;font-size:0.85rem;"></div>' +
            '<div id="op-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var exprEl = contentEl.querySelector('#op-expr' + suffix);
        var opsEl = contentEl.querySelector('#op-ops' + suffix);
        var infoEl = contentEl.querySelector('#op-info' + suffix);
        var descEl = contentEl.querySelector('#op-desc' + suffix);
        var inputNums = contentEl.querySelector('#bt-op-nums');
        var inputOps = contentEl.querySelector('#bt-op-ops');
        var resetBtn = contentEl.querySelector('#bt-op-reset');
        function buildAndRun(nums, ops) {
            var initExpr = nums.join(' ☐ ');
            descEl.textContent = 'Numbers [' + nums.join(', ') + '], operators: +' + ops[0] + ' -' + ops[1] + ' *' + ops[2] + ' /' + ops[3] + '. Try all arrangements to find max/min.';
            exprEl.textContent = initExpr; exprEl.style.color = '';
            function renderOps(o) { opsEl.innerHTML = 'Remaining operators: +' + o[0] + ', -' + o[1] + ', * ' + o[2] + ', /' + o[3] + ''; }
            renderOps(ops);
            infoEl.innerHTML = '<span style="color:var(--text2);">Finding max and min values</span>';
            var steps = [], results = [], maxV = -Infinity, minV = Infinity;
            var curOps = ops.slice();
            var solve = function(idx, current, expr) {
                if (idx === nums.length) {
                    results.push({ expr: expr, val: current });
                    if (current > maxV) maxV = current;
                    if (current < minV) minV = current;
                    var rc = results.length, cm = maxV, cn = minV, ce = expr, cv = current;
                    (function(rc, cm, cn, ce, cv) {
                        steps.push({ description: ce + ' = ' + cv + ' (current max=' + cm + ', min=' + cn + ')',
                            action: function() { exprEl.textContent = ce + ' = ' + cv; exprEl.style.color = 'var(--green)'; infoEl.innerHTML = 'Result' + rc + ' |<strong>max = ' + cm + '</strong>, <strong>min = ' + cn + '</strong>'; },
                            undo: function() { exprEl.textContent = initExpr; exprEl.style.color = ''; var prev = rc > 1 ? results[rc-2] : null; infoEl.innerHTML = prev ? 'Result' + (rc-1) + '' : '<span style="color:var(--text2);">Finding max and min values</span>'; }
                        });
                    })(rc, cm, cn, ce, cv);
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
                        (function(ci, ne, so, prevExpr) {
                            steps.push({ description: opSyms[ci] + ' ' + nums[idx] + ' try →' + ne,
                                action: function() { exprEl.textContent = ne + (idx < nums.length - 1 ? ' ☐ ...' : ''); exprEl.style.color = ''; renderOps(so); },
                                undo: function() { var po = so.slice(); po[ci]++; exprEl.textContent = prevExpr + ' ☐ ...'; renderOps(po); }
                            });
                        })(i, newExpr, snapOps, expr);
                        solve(idx + 1, nxt, newExpr);
                        curOps[i]++;
                    }
                }
            };
            solve(1, nums[0], '' + nums[0]);
            var fm = maxV, fn = minV;
            steps.push({ description: 'Done! max =' + fm + ', min =' + fn,
                action: function() { exprEl.textContent = 'max = ' + fm + ', min = ' + fn; exprEl.style.color = 'var(--green)'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ max =' + fm + ', min =' + fn + '</strong>'; },
                undo: function() { exprEl.textContent = initExpr; exprEl.style.color = ''; }
            });
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var nums = inputNums.value.split(',').map(function(x) { return parseInt(x.trim()); }).filter(function(x) { return !isNaN(x); });
            if (nums.length < 2) nums = defaultNums.slice();
            if (nums.length > 8) nums = nums.slice(0, 8);
            var opsArr = inputOps.value.split(',').map(function(x) { return Math.max(0, parseInt(x.trim()) || 0); });
            while (opsArr.length < 4) opsArr.push(0);
            opsArr = opsArr.slice(0, 4);
            var totalOps = opsArr[0] + opsArr[1] + opsArr[2] + opsArr[3];
            if (totalOps !== nums.length - 1) {
                alert('Total operator count must be' + (nums.length - 1) + ' (numbers:' + nums.length + ' - 1). Current:' + totalOps);
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
            '<p id="nq-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></p>' +
            '<div id="nq-board' + suffix + '" style="display:grid;gap:2px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="nq-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var boardEl = contentEl.querySelector('#nq-board' + suffix);
        var infoEl = contentEl.querySelector('#nq-info' + suffix);
        var descEl = contentEl.querySelector('#nq-desc' + suffix);
        var inputN = contentEl.querySelector('#bt-queen-n');
        var resetBtn = contentEl.querySelector('#bt-queen-reset');
        function buildAndRun(n) {
            descEl.textContent = n + '\u00d7' + n + ' chessboard: place' + n + ' queens so none attack each other.';
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
            var steps = [], queens = [], solCount = 0;
            for (var i = 0; i < n; i++) queens.push(-1);
            function isValid(row, col) { for (var r = 0; r < row; r++) { if (queens[r] === col || Math.abs(queens[r]-col) === Math.abs(r-row)) return false; } return true; }
            var solve = function(row) {
                if (row === n) {
                    solCount++;
                    var sc = solCount, qs = queens.slice();
                    (function(sc, qs) {
                        steps.push({ description: sc + 'th solution found!',
                            action: function() { for (var r = 0; r < n; r++) getCell(r, qs[r]).style.background = '#00b894'; infoEl.innerHTML = '<strong style="color:var(--green);">' + sc + 'th solution found!</strong>'; },
                            undo: function() { for (var r = 0; r < n; r++) getCell(r, qs[r]).style.background = (r+qs[r])%2===0 ? '#f0d9b5' : '#b58863'; }
                        });
                    })(sc, qs);
                    return;
                }
                for (var col = 0; col < n; col++) {
                    var cr = row, cc = col;
                    (function(cr, cc) {
                        steps.push({ description: (cr+1) + 'row' + (cc+1) + 'col: try queen...',
                            action: function() { getCell(cr, cc).textContent = '?'; getCell(cr, cc).style.background = '#fdcb6e'; },
                            undo: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }
                        });
                    })(cr, cc);
                    if (isValid(row, col)) {
                        queens[row] = col;
                        (function(cr, cc) {
                            steps.push({ description: '\u2705 ' + (cr+1) + 'row' + (cc+1) + 'col: No conflict! Place queen',
                                action: function() { getCell(cr, cc).textContent = '\u265b'; getCell(cr, cc).style.background = '#d63031'; getCell(cr,cc).style.color = 'white'; },
                                undo: function() { getCell(cr, cc).textContent = '?'; getCell(cr, cc).style.background = '#fdcb6e'; getCell(cr,cc).style.color = ''; }
                            });
                        })(cr, cc);
                        solve(row + 1);
                        queens[row] = -1;
                        (function(cr, cc) {
                            steps.push({ description: '\u21a9\ufe0f ' + (cr+1) + 'row' + (cc+1) + 'col: remove queen',
                                action: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; getCell(cr,cc).style.color = ''; },
                                undo: function() { getCell(cr, cc).textContent = '\u265b'; getCell(cr, cc).style.background = '#d63031'; getCell(cr,cc).style.color = 'white'; }
                            });
                        })(cr, cc);
                    } else {
                        (function(cr, cc) {
                            steps.push({ description: '\u274c ' + (cr+1) + 'row' + (cc+1) + 'col: Conflict! Skip',
                                action: function() { getCell(cr, cc).textContent = '\u2715'; getCell(cr, cc).style.background = '#e17055'; setTimeout(function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }, 400); },
                                undo: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }
                            });
                        })(cr, cc);
                    }
                }
            };
            solve(0);
            var fsc = solCount;
            steps.push({ description: 'Search complete!' + fsc + ' solutions found', action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">\u2705 Total:' + fsc + ' solutions</strong>'; }, undo: function(){} });
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
                { title: 'But there\'s a problem with this', content: 'M is given as <strong>input</strong>. If M=2 we need 2 nested loops, if M=5 we need 5 nested loops... we can\'t write "M nested for loops" in code! Plus we\'d need to manually check for duplicates each time.' },
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
                { title: 'But there\'s a problem with this', content: 'Then we\'d generate N!/(N-M)! sequences and discard most of them. For example, with N=8, M=4, that\'s generating 1680 to keep only 70. Can\'t we filter <strong>before generating</strong>?' },
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
                { title: 'What if we try this?', content: 'Just <strong>completely remove</strong> the <code>used</code> array! Freely pick from all of 1~N every time. The code is actually simpler than (1).<br><br>However, the output can be enormous (N<sup>M</sup> sequences), so fast output is essential!<br><span class="lang-py">Python: Collect results and print all at once with <code>sys.stdout.write()</code></span><span class="lang-cpp">C++: Use <code>printf</code> or <code>ios::sync_with_stdio(false)</code></span>' }
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
                { title: 'But there\'s a problem with this', content: 'Generating everything like (3) and filtering is wasteful, and (2)\'s code passes <code>i+1</code> so it can\'t re-pick the same number. So what do we need to change to "allow picking the same number again"?' },
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
                { title: 'What if we try this?', content: 'Manage remaining counts with <code>ops = [+count, -count, \u00d7count, \u00f7count]</code>! At each position, check all 4 operator types and use only those with count > 0. Consume with <code>ops[i] -= 1</code>, restore with <code>ops[i] += 1</code> -- the core backtracking pattern.' },
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
                { title: 'But there\'s a problem with this', content: 'Right, but N can be up to 20. C(20, 10) = 184,756 combinations, and for each one we must compute the team synergy. Synergy requires summing <code>S[i][j] + S[j][i]</code> for all pairs (i, j), which takes O(N<sup>2</sup>). Overall it\'s still feasible, but can we do better?' },
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
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>8</pre></div>
                    <div><strong>Output</strong><pre>92</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 \u2264 N \u2264 15 (time limit: 10 seconds)</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Try placing queens on every cell of the N\u00d7N board? Try all ways to place N queens in N<sup>2</sup> cells... it would work, right?' },
                { title: 'But there\'s a problem with this', content: 'For N=8, choosing 8 from 64 cells is C(64, 8) \u2248 4.4 billion! Way too many. But wait -- since no two queens can be in the same row, placing <strong>one per row</strong> reduces it to N<sup>N</sup>, and conflict checking prunes it much further.' },
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
                { title: 'What if we try this?', content: 'Collect all blank cell coordinates upfront, then fill them one by one with backtracking!<br><br>Each time we place a number, check three things:<br>1. Is this number already in the same <strong>row</strong>?<br>2. Is this number already in the same <strong>column</strong>?<br>3. Is this number already in the same <strong>3\u00d73 box</strong>?<br><br>The 3\u00d73 box starting point is <code>(row//3*3, col//3*3)</code>. If it fails, reset to 0 and try the next number!' },
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
