// ===== Greedy Algorithm Topic Module =====
var greedyTopic = {
    id: 'greedy',
    title: 'Greedy',
    icon: '🏆',
    category: 'Problem Solving (Silver~Gold)',
    order: 13,
    description: 'A technique that repeatedly makes the best choice at each moment',
    relatedNote: 'Greedy is often used together with sorting and priority queues. The key is proving whether it guarantees an optimal solution.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-11047': { type: 'Coin Problem', color: 'var(--accent)', vizMethod: '_renderVizCoin', suffix: '-coin' },
        'boj-11399': { type: 'Sort-based', color: 'var(--green)', vizMethod: '_renderVizATM', suffix: '-atm' },
        'boj-1931':  { type: 'Activity Selection', color: '#e17055', vizMethod: '_renderVizMeeting', suffix: '-meet' },
        'boj-1541':  { type: 'Bracket Placement', color: '#6c5ce7', vizMethod: '_renderVizBracket', suffix: '-brk' },
        'boj-13305': { type: 'Minimum Cost', color: '#00b894', vizMethod: '_renderVizGas', suffix: '-gas' }
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
            sim:     { intro: prob.simIntro || 'See how the greedy algorithm actually works in practice.', icon: '🎮' },
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
                <h2>🏆 Greedy</h2>
                <p class="hero-sub">If you choose the best-looking option at every moment, the overall answer will also be optimal</p>
            </div>

            <!-- 1. What is Greedy? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> What is Greedy?</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Imagine making change at a convenience store.<br>
                    If you need to give back <strong>$12.60</strong> in change?<br><br>
                    Use the <strong>largest coins first</strong> as much as possible:<br>
                    $10 x 1 &rarr; remaining $2.60<br>
                    $1 x 2 &rarr; remaining $0.60<br>
                    $0.50 x 1 &rarr; remaining $0.10<br>
                    $0.10 x 1 &rarr; remaining $0.00<br><br>
                    Always <strong>choosing the largest coin you can give</strong> at each step -- that is greedy!
                </div>

                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Change-making problem (Greedy)
coins = [1000, 500, 100, 50, 10]  # Largest first
change = 1260
count = 0

for coin in coins:
    count += change // coin   # Use this coin as many times as possible
    change %= coin            # Update remaining amount

print(count)  # 5 coins</code></pre></div></span>
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;

int main() {
    // Change-making problem (Greedy)
    vector&lt;int&gt; coins = {1000, 500, 100, 50, 10};  // Largest first
    int change = 1260;
    int count = 0;

    for (int coin : coins) {
        count += change / coin;   // Use this coin as many times as possible
        change %= coin;           // Update remaining amount
    }

    cout &lt;&lt; count &lt;&lt; endl;  // 5 coins
    return 0;
}</code></pre></div></span>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Greedy Coin Change</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">Change:
                            <input type="number" id="gr-demo-coin-input" value="1260" min="10" step="10" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:100px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="gr-demo-coin-go">Start Coin Selection</button>
                        <button class="concept-demo-btn green" id="gr-demo-coin-reset" style="display:none;">Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="gr-demo-coin-coins" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;"></div>
                        <div id="gr-demo-coin-remain" style="text-align:center;font-size:1rem;font-weight:600;color:var(--text);min-height:2em;"></div>
                        <div id="gr-demo-coin-result" style="text-align:center;font-size:0.9rem;color:var(--text2);min-height:1.5em;margin-top:6px;"></div>
                    </div>
                    <div class="concept-demo-msg" id="gr-demo-coin-msg">Watch the process of using the largest coin first, one step at a time.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">If the change is 4,730 won, what is the minimum number of coins needed? (1000, 500, 100, 50, 10 won)</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>11 coins</strong>!<br>
                        1000 x 4 = 4000 (remaining 730)<br>
                        500 x 1 = 500 (remaining 230)<br>
                        100 x 2 = 200 (remaining 30)<br>
                        50 x 0 (remaining 30)<br>
                        10 x 3 = 30 (remaining 0)<br>
                        Total: 4 + 1 + 2 + 0 + 3 = <strong>11 coins</strong>
                    </div>
                </div>
            </div>

            <!-- 2. When Does Greedy Work? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> When Does Greedy Work?</div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="40" r="22" fill="none" stroke="var(--green)" stroke-width="3"/>
                                <path d="M30 40 L37 48 L52 32" fill="none" stroke="var(--green)" stroke-width="3"/>
                            </svg>
                        </div>
                        <h3>Local Best = Global Best</h3>
                        <p>The best choice at each moment must combine to form the best solution overall. This is called the <strong>"Greedy Choice Property"</strong>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="15" y="25" width="20" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="3"/>
                                <rect x="45" y="25" width="20" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="3"/>
                                <path d="M35 40 L45 40" stroke="var(--text3)" stroke-width="2" stroke-dasharray="3,3"/>
                            </svg>
                        </div>
                        <h3>Earlier Choices Don't Affect Later Ones</h3>
                        <p>A choice you make must not ruin the options available later. Each choice must be <strong>independent</strong>.</p>
                    </div>
                </div>
                <div style="margin-top:0.6rem;">
                    <a href="https://en.wikipedia.org/wiki/Greedy_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Greedy Algorithm (Greedy Choice Property & Optimal Substructure) ↗</a>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — When Greedy Fails</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">With coins <strong>[1, 3, 4]</strong> and change of <strong>6</strong>, compare greedy vs optimal.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <button class="concept-demo-btn" id="gr-demo-fail-go">Start Comparison</button>
                        <button class="concept-demo-btn green" id="gr-demo-fail-reset" style="display:none;">Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;">Greedy (largest first)</div>
                                <div id="gr-demo-fail-greedy" style="min-height:60px;"></div>
                                <div id="gr-demo-fail-greedy-result" style="margin-top:8px;font-size:0.85rem;min-height:1.5em;"></div>
                            </div>
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;">Optimal (DP)</div>
                                <div id="gr-demo-fail-optimal" style="min-height:60px;"></div>
                                <div id="gr-demo-fail-optimal-result" style="margin-top:8px;font-size:0.85rem;min-height:1.5em;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="gr-demo-fail-msg">Greedy uses 4+1+1 = 3 coins, but optimal is 3+3 = 2 coins. When coins are not multiples of each other, greedy can be wrong!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">If only 100, 70, and 10 won coins are available, what happens when you greedily make change for 120 won?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Greedy: 100 x 1 + 10 x 2 = <strong>3 coins</strong><br>
                        But optimal: 70 x 1 + 10 x 5 = <strong>6 coins</strong>... no, that's worse!<br>
                        Actually, <strong>70 + 50 is impossible</strong>,<br>
                        Real comparison: 100 x 1 + 10 x 2 = 3 coins vs 70 x 1 + 10 x 5 = 6 coins<br><br>
                        In this case greedy is correct, but what about <strong>140 won</strong>?<br>
                        Greedy: 100 x 1 + 10 x 4 = <strong>5 coins</strong><br>
                        Optimal: 70 x 2 = <strong>2 coins</strong><br><br>
                        When coins are not multiples of each other, greedy <strong>can be wrong!</strong><br>
                        In such cases, you need to use DP.
                    </div>
                </div>
            </div>

            <!-- 3. Greedy vs DP -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> Greedy vs DP</div>
                <div class="approach-grid">
                    <div class="approach-card featured">
                        <h4>🏆 Greedy</h4>
                        <ul style="list-style:none; padding:0; margin:0.5rem 0;">
                            <li>✅ Choose the best at each moment</li>
                            <li>✅ Never go back once chosen</li>
                            <li>✅ Fast -- usually O(N) or O(N log N)</li>
                            <li>⚠️ May not always be optimal</li>
                        </ul>
                    </div>
                    <div class="approach-card">
                        <h4>🧩 DP</h4>
                        <ul style="list-style:none; padding:0; margin:0.5rem 0;">
                            <li>✅ Compare all cases, then choose the best</li>
                            <li>✅ Always guarantees optimal solution</li>
                            <li>✅ Stores repeated calculations for speed</li>
                            <li>⚠️ Can be slower than greedy</li>
                        </ul>
                    </div>
                </div>

                <div class="key-difference-box">
                    <strong>Key difference:</strong>
                    Greedy <strong>decides immediately based on "what's best right now"</strong>. DP <strong>considers all future outcomes before deciding</strong>.<br>
                    <span style="color:var(--text2)">When greedy works for a problem, it's much faster and simpler!</span>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Activity Selection Timeline</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Select activities that end earliest to maximize the number of non-overlapping activities.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <button class="concept-demo-btn" id="gr-demo-activity-go">Step ▶</button>
                        <button class="concept-demo-btn green" id="gr-demo-activity-reset">Reset ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="gr-demo-activity-timeline" style="position:relative;min-height:220px;"></div>
                        <div id="gr-demo-activity-result" style="text-align:center;font-size:0.9rem;color:var(--text2);margin-top:10px;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="gr-demo-activity-msg">Sort by end time, then select non-overlapping activities one by one.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"Select as many non-overlapping meetings as possible from N meetings" -- Greedy? DP?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>Greedy</strong>!<br>
                        Selecting meetings that end earliest always gives the optimal answer.<br>
                        Because choosing meetings that end early leaves the most remaining time available.<br>
                        This is the famous <strong>"Activity Selection Problem"</strong>.
                    </div>
                </div>
            </div>

            <!-- 4. Common Greedy Patterns -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> Common Greedy Patterns</div>
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="15" y="55" width="10" height="15" rx="2" fill="var(--accent)" opacity="0.4"/>
                                <rect x="30" y="40" width="10" height="30" rx="2" fill="var(--accent)" opacity="0.6"/>
                                <rect x="45" y="25" width="10" height="45" rx="2" fill="var(--accent)" opacity="0.8"/>
                                <rect x="60" y="10" width="10" height="60" rx="2" fill="var(--accent)" opacity="1"/>
                            </svg>
                        </div>
                        <h3>Sort Then Select</h3>
                        <p>Sort by a criterion, then select one by one from the front. (ATM, Meeting Room Assignment)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="35" r="22" fill="none" stroke="var(--green)" stroke-width="3"/>
                                <text x="40" y="42" text-anchor="middle" fill="var(--green)" font-size="18" font-weight="bold">MAX</text>
                            </svg>
                        </div>
                        <h3>Largest/Smallest First</h3>
                        <p>Process the largest or smallest items first. (Coin Change)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <line x1="15" y1="45" x2="65" y2="45" stroke="var(--yellow)" stroke-width="3"/>
                                <rect x="15" y="35" width="20" height="10" rx="3" fill="var(--green)" opacity="0.7"/>
                                <rect x="40" y="35" width="25" height="10" rx="3" fill="var(--accent)" opacity="0.7"/>
                            </svg>
                        </div>
                        <h3>By End Time</h3>
                        <p>Select activities that end earliest to maximize remaining time. (Meeting Room Assignment)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <path d="M15 60 L35 30 L55 50 L65 20" fill="none" stroke="var(--red)" stroke-width="3"/>
                                <circle cx="35" cy="30" r="4" fill="var(--green)"/>
                            </svg>
                        </div>
                        <h3>Track Min/Max</h3>
                        <p>Keep track of the minimum (or maximum) value seen so far. (Gas Station)</p>
                    </div>
                </div>
                <div style="margin-top:0.6rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/functions.html#sorted" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: sorted() & key parameter ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/sort" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: std::sort ↗</a></span>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"Rearrange the queue order to minimize total waiting time" -- what criterion should you sort by?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>Put people with the shortest time first</strong>!<br>
                        The time of each person in front must be waited by all people behind them,<br>
                        so shorter times in front reduces the total waiting sum.<br>
                        This is the key idea behind "queue optimization" problems.
                    </div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — ATM Queue</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Given each person's withdrawal time, arrange the queue to minimize total waiting time.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">Withdrawal times:
                            <input type="text" id="gr-demo-atm-input" value="3,1,4,3,2" placeholder="comma separated" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:140px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="gr-demo-atm-go">Step ▶</button>
                        <button class="concept-demo-btn green" id="gr-demo-atm-reset">Reset ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;">Original Order</div>
                                <div id="gr-demo-atm-original" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
                                <div id="gr-demo-atm-orig-total" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>
                            </div>
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;">Sorted (shortest first)</div>
                                <div id="gr-demo-atm-sorted" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
                                <div id="gr-demo-atm-sort-total" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="gr-demo-atm-msg">Putting people with shorter times first reduces the waiting time for everyone behind them.</div>
                </div>
            </div>

            <!-- 5. 3 Steps to Solve Greedy Problems -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 3 Steps to Solve Greedy Problems</div>
                <p style="color:var(--text2); margin-bottom:1rem;">When you encounter a greedy problem, follow these 3 steps.</p>
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="40" r="22" fill="none" stroke="var(--accent)" stroke-width="3"/>
                                <text x="40" y="46" text-anchor="middle" fill="var(--accent)" font-size="20" font-weight="bold">?</text>
                            </svg>
                        </div>
                        <h3>Step 1: Define the Criterion</h3>
                        <p>Decide "what to base your selection on". The largest? The earliest to finish? The cheapest?</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="55" width="12" height="15" rx="2" fill="var(--green)" opacity="0.5"/>
                                <rect x="27" y="40" width="12" height="30" rx="2" fill="var(--green)" opacity="0.65"/>
                                <rect x="44" y="25" width="12" height="45" rx="2" fill="var(--green)" opacity="0.8"/>
                                <rect x="61" y="10" width="12" height="60" rx="2" fill="var(--green)" opacity="1"/>
                            </svg>
                        </div>
                        <h3>Step 2: Sort</h3>
                        <p>Sort the data according to your chosen criterion. Sorting is the core of most greedy solutions.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <path d="M20 60 L40 20 L60 60" fill="none" stroke="var(--yellow)" stroke-width="3"/>
                                <circle cx="40" cy="20" r="5" fill="var(--yellow)"/>
                            </svg>
                        </div>
                        <h3>Step 3: Select One by One</h3>
                        <p>Go through from the front, selecting items that meet the condition. Never go back!</p>
                    </div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Meeting Room Assignment in 3 Steps</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Given a list of meetings: Step 1: Sort by end time -> Step 2: Select non-overlapping meetings -> Step 3: Check result</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <button class="concept-demo-btn" id="gr-demo-meet-go">Start 3 Steps</button>
                        <button class="concept-demo-btn green" id="gr-demo-meet-reset" style="display:none;">Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="gr-demo-meet-step-label" style="font-weight:600;font-size:1rem;margin-bottom:10px;min-height:1.5em;color:var(--accent);"></div>
                        <div id="gr-demo-meet-timeline" style="position:relative;min-height:200px;"></div>
                        <div id="gr-demo-meet-result" style="text-align:center;font-size:0.9rem;color:var(--text2);margin-top:10px;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="gr-demo-meet-msg">Sort by end time -> select if no overlap -> check maximum meeting count. Watch all 3 steps.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">How can you verify "is it okay to solve this with greedy"?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>Try to find a counterexample!</strong><br>
                        After defining your greedy criterion, test with small examples: "Is this criterion always optimal?"<br>
                        If no counterexample exists, you can use greedy.<br>
                        If a counterexample exists, you should consider DP or another approach.
                    </div>
                </div>
            </div>
        `;

        this._initConceptInteractions(container);
        this._initConceptDemos(container);
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    _initConceptDemos(container) {
        // === Demo 1: Greedy Coin Change ===
        {
            var coins = [500, 100, 50, 10];
            var goBtn = container.querySelector('#gr-demo-coin-go');
            var resetBtn = container.querySelector('#gr-demo-coin-reset');
            var inputEl = container.querySelector('#gr-demo-coin-input');
            var coinsEl = container.querySelector('#gr-demo-coin-coins');
            var remainEl = container.querySelector('#gr-demo-coin-remain');
            var resultEl = container.querySelector('#gr-demo-coin-result');
            var msgEl = container.querySelector('#gr-demo-coin-msg');
            var animating = false;

            function renderCoinState(usedMap, highlight) {
                coinsEl.innerHTML = '';
                coins.forEach(function(c) {
                    var cnt = usedMap[c] || 0;
                    var isHL = (highlight === c);
                    var div = document.createElement('div');
                    div.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;gap:4px;padding:10px 14px;border-radius:12px;border:2px solid ' + (isHL ? 'var(--yellow)' : (cnt > 0 ? 'var(--green)' : 'var(--border)')) + ';background:' + (isHL ? 'var(--yellow)15' : (cnt > 0 ? 'var(--green)10' : 'var(--bg2)')) + ';transition:all 0.3s;' + (isHL ? 'box-shadow:0 0 12px var(--yellow)40;transform:scale(1.05);' : '');
                    div.innerHTML = '<div style="width:44px;height:44px;border-radius:50%;background:' + (cnt > 0 || isHL ? 'var(--accent)' : 'var(--text3)') + ';color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">' + c + '</div><div style="font-size:0.85rem;font-weight:600;">' + (cnt > 0 ? cnt + ' used' : '-') + '</div>';
                    coinsEl.appendChild(div);
                });
            }
            renderCoinState({});
            remainEl.textContent = '';

            goBtn.addEventListener('click', function() {
                if (animating) return;
                animating = true;
                goBtn.style.display = 'none';
                resetBtn.style.display = '';
                var K = parseInt(inputEl.value) || 1260;
                if (K < 10) K = 10;
                var rem = K, totalCount = 0, usedMap = {};
                renderCoinState({});
                remainEl.innerHTML = 'Remaining: <strong>' + K + '</strong>';
                resultEl.textContent = '';

                var steps = [];
                coins.forEach(function(coin) {
                    var cnt = Math.floor(rem / coin);
                    if (cnt > 0) {
                        steps.push({ coin: coin, cnt: cnt, newRem: rem - coin * cnt });
                        rem -= coin * cnt;
                        totalCount += cnt;
                    }
                });

                var idx = 0;
                var curRem = K;
                function nextStep() {
                    if (idx >= steps.length) {
                        renderCoinState(usedMap);
                        remainEl.innerHTML = 'Remaining: <strong>0</strong>';
                        resultEl.innerHTML = 'Used <strong>' + totalCount + '</strong> coins total! Always chose the largest coin first.';
                        resultEl.style.color = 'var(--green)';
                        msgEl.textContent = 'Using the largest coins first minimizes the number of coins!';
                        animating = false;
                        return;
                    }
                    var s = steps[idx];
                    renderCoinState(usedMap, s.coin);
                    remainEl.innerHTML = s.coin + ' x ' + s.cnt + ' used! Remaining: <strong>' + curRem + '</strong> -> <strong>' + s.newRem + '</strong>';
                    setTimeout(function() {
                        usedMap[s.coin] = s.cnt;
                        curRem = s.newRem;
                        renderCoinState(usedMap);
                        remainEl.innerHTML = 'Remaining: <strong>' + curRem + '</strong>';
                        idx++;
                        setTimeout(nextStep, 500);
                    }, 600);
                }
                nextStep();
            });

            resetBtn.addEventListener('click', function() {
                animating = false;
                goBtn.style.display = '';
                resetBtn.style.display = 'none';
                renderCoinState({});
                remainEl.textContent = '';
                resultEl.textContent = '';
                resultEl.style.color = '';
                msgEl.textContent = 'Watch the process of using the largest coin first, one step at a time.';
            });
        }

        // === Demo 2: When Greedy Fails ===
        {
            var failGoBtn = container.querySelector('#gr-demo-fail-go');
            var failResetBtn = container.querySelector('#gr-demo-fail-reset');
            var greedyEl = container.querySelector('#gr-demo-fail-greedy');
            var greedyResEl = container.querySelector('#gr-demo-fail-greedy-result');
            var optimalEl = container.querySelector('#gr-demo-fail-optimal');
            var optimalResEl = container.querySelector('#gr-demo-fail-optimal-result');
            var failMsgEl = container.querySelector('#gr-demo-fail-msg');

            function coinBox(val, color) {
                return '<div style="display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:' + color + ';color:white;font-weight:700;font-size:0.9rem;margin:3px;">' + val + '</div>';
            }

            failGoBtn.addEventListener('click', function() {
                failGoBtn.style.display = 'none';
                failResetBtn.style.display = '';
                var greedyCoins = [4, 1, 1];
                var optCoins = [3, 3];
                greedyEl.innerHTML = '';
                optimalEl.innerHTML = '';
                greedyResEl.textContent = '';
                optimalResEl.textContent = '';

                var gIdx = 0;
                function showGreedy() {
                    if (gIdx >= greedyCoins.length) {
                        greedyResEl.innerHTML = '<span style="color:var(--red);font-weight:600;">3 coins used (4+1+1=6)</span>';
                        var oIdx = 0;
                        function showOpt() {
                            if (oIdx >= optCoins.length) {
                                optimalResEl.innerHTML = '<span style="color:var(--green);font-weight:600;">2 coins used (3+3=6)</span>';
                                failMsgEl.textContent = 'Greedy picks 4 first and needs 3 coins, but 3+3 = 2 coins is optimal!';
                                return;
                            }
                            optimalEl.innerHTML += coinBox(optCoins[oIdx], 'var(--green)');
                            oIdx++;
                            setTimeout(showOpt, 400);
                        }
                        setTimeout(showOpt, 300);
                        return;
                    }
                    greedyEl.innerHTML += coinBox(greedyCoins[gIdx], 'var(--red)');
                    gIdx++;
                    setTimeout(showGreedy, 400);
                }
                showGreedy();
            });

            failResetBtn.addEventListener('click', function() {
                failGoBtn.style.display = '';
                failResetBtn.style.display = 'none';
                greedyEl.innerHTML = '';
                optimalEl.innerHTML = '';
                greedyResEl.textContent = '';
                optimalResEl.textContent = '';
                failMsgEl.textContent = 'Greedy uses 4+1+1 = 3 coins, but optimal is 3+3 = 2 coins. When coins are not multiples of each other, greedy can be wrong!';
            });
        }

        // === Demo 3: Activity Selection Timeline ===
        {
            var activities = [
                {name:'A', s:1, e:4}, {name:'B', s:3, e:5}, {name:'C', s:0, e:6},
                {name:'D', s:5, e:7}, {name:'E', s:3, e:9}, {name:'F', s:5, e:9},
                {name:'G', s:6, e:10}, {name:'H', s:8, e:11}
            ];
            var sorted = activities.slice().sort(function(a,b) { return a.e - b.e || a.s - b.s; });
            var actGoBtn = container.querySelector('#gr-demo-activity-go');
            var actResetBtn = container.querySelector('#gr-demo-activity-reset');
            var timelineEl = container.querySelector('#gr-demo-activity-timeline');
            var actResultEl = container.querySelector('#gr-demo-activity-result');
            var actMsgEl = container.querySelector('#gr-demo-activity-msg');
            var maxTime = 12;
            var colors = ['var(--accent)', 'var(--green)', '#e17055', '#6c5ce7', '#fdcb6e', '#00b894', '#d63031', '#0984e3'];

            function renderTimeline(acts, selectedSet, currentIdx) {
                var html = '<div style="position:relative;padding:10px 0 30px 0;">';
                html += '<div style="position:relative;height:20px;margin-bottom:10px;">';
                for (var t = 0; t <= maxTime; t++) {
                    var left = (t / maxTime * 100);
                    html += '<span style="position:absolute;left:' + left + '%;transform:translateX(-50%);font-size:0.7rem;color:var(--text3);">' + t + '</span>';
                }
                html += '</div>';
                acts.forEach(function(act, i) {
                    var leftP = (act.s / maxTime * 100);
                    var widthP = ((act.e - act.s) / maxTime * 100);
                    var isSelected = selectedSet && selectedSet[act.name];
                    var isCurrent = (currentIdx === i);
                    var isRejected = (currentIdx !== undefined && currentIdx > i && !isSelected);
                    var bg = isSelected ? 'var(--green)' : (isCurrent ? 'var(--yellow)' : (isRejected ? 'var(--red)' : colors[i % colors.length]));
                    var opacity = isRejected ? '0.3' : '1';
                    html += '<div style="position:relative;height:28px;margin-bottom:4px;">' +
                        '<div style="position:absolute;left:' + leftP + '%;width:' + widthP + '%;height:100%;background:' + bg + ';border-radius:6px;opacity:' + opacity + ';display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:0.8rem;transition:all 0.3s;' + (isCurrent ? 'box-shadow:0 0 10px var(--yellow)60;' : '') + (isSelected ? 'box-shadow:0 0 10px var(--green)60;' : '') + '">' +
                        act.name + ' [' + act.s + '-' + act.e + ']</div></div>';
                });
                html += '</div>';
                timelineEl.innerHTML = html;
            }

            // Pre-compute steps for manual control
            var actState = { stepIdx: -1, steps: [] };

            function actBuildSteps() {
                var steps = [];
                var selectedSet = {};
                var selectedCount = 0;
                var lastEnd = 0;
                for (var i = 0; i < sorted.length; i++) {
                    var act = sorted[i];
                    if (act.s >= lastEnd) {
                        // Step: highlight current, show comparison
                        (function(idx, a, le, ss) {
                            var snapBefore = JSON.parse(JSON.stringify(ss));
                            steps.push({ apply: function() {
                                renderTimeline(sorted, snapBefore, idx);
                                actResultEl.innerHTML = a.name + ' [' + a.s + '-' + a.e + ']: start(' + a.s + ') >= last end(' + le + ') → <span style="color:var(--green);font-weight:600;">Selected!</span>';
                            }});
                        })(i, act, lastEnd, selectedSet);
                        // Step: mark as selected
                        selectedSet[act.name] = true;
                        selectedCount++;
                        lastEnd = act.e;
                        (function(ss) {
                            var snapAfter = JSON.parse(JSON.stringify(ss));
                            steps.push({ apply: function() {
                                renderTimeline(sorted, snapAfter);
                                actResultEl.innerHTML = '';
                            }});
                        })(selectedSet);
                    } else {
                        // Step: highlight current, show rejection
                        (function(idx, a, le, ss) {
                            var snap = JSON.parse(JSON.stringify(ss));
                            steps.push({ apply: function() {
                                renderTimeline(sorted, snap, idx);
                                actResultEl.innerHTML = a.name + ' [' + a.s + '-' + a.e + ']: start(' + a.s + ') < last end(' + le + ') → <span style="color:var(--red);">Overlap! Skip</span>';
                            }});
                        })(i, act, lastEnd, selectedSet);
                    }
                }
                // Final step: show result
                var finalSS = JSON.parse(JSON.stringify(selectedSet));
                var finalCount = selectedCount;
                steps.push({ apply: function() {
                    renderTimeline(sorted, finalSS);
                    actResultEl.innerHTML = 'Selected activities: <strong>' + finalCount + '</strong> (selected non-overlapping in order of earliest end time)';
                    actResultEl.style.color = 'var(--green)';
                    actMsgEl.textContent = 'After sorting by end time, selecting non-overlapping activities in order gives the maximum count!';
                }});
                return steps;
            }

            function actReset() {
                actState.steps = actBuildSteps();
                actState.stepIdx = -1;
                renderTimeline(sorted, {});
                actResultEl.textContent = '';
                actResultEl.style.color = '';
                actMsgEl.textContent = 'Sort by end time, then select non-overlapping activities one by one.';
            }

            actReset();

            actGoBtn.addEventListener('click', function() {
                if (actState.stepIdx >= actState.steps.length - 1) return;
                actState.stepIdx++;
                actState.steps[actState.stepIdx].apply();
            });

            actResetBtn.addEventListener('click', function() {
                actReset();
            });
        }

        // === Demo 4: ATM Queue ===
        {
            var atmGoBtn = container.querySelector('#gr-demo-atm-go');
            var atmResetBtn = container.querySelector('#gr-demo-atm-reset');
            var atmInput = container.querySelector('#gr-demo-atm-input');
            var origEl = container.querySelector('#gr-demo-atm-original');
            var sortedEl = container.querySelector('#gr-demo-atm-sorted');
            var origTotalEl = container.querySelector('#gr-demo-atm-orig-total');
            var sortTotalEl = container.querySelector('#gr-demo-atm-sort-total');
            var atmMsgEl = container.querySelector('#gr-demo-atm-msg');

            function personBox(val, wait, color, glow) {
                return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 12px;border-radius:10px;border:2px solid ' + (color || 'var(--border)') + ';background:' + (color ? color + '15' : 'var(--bg2)') + ';' + (glow ? 'box-shadow:0 0 8px ' + color + '50;' : '') + '">' +
                    '<div style="font-size:1.2rem;">🧑</div>' +
                    '<div style="font-weight:600;font-size:0.9rem;">' + val + ' min</div>' +
                    (wait !== undefined ? '<div style="font-size:0.75rem;color:var(--text2);">wait:' + wait + ' min</div>' : '') +
                    '</div>';
            }

            function calcTotal(arr) {
                var total = 0, acc = 0;
                arr.forEach(function(v) { acc += v; total += acc; });
                return total;
            }

            // Pre-compute steps for manual control
            var atmState = { stepIdx: -1, steps: [] };

            function atmBuildSteps() {
                var arr = atmInput.value.split(',').map(function(v) { return parseInt(v.trim()); }).filter(function(v) { return !isNaN(v) && v > 0; });
                if (arr.length < 2) arr = [3, 1, 4, 3, 2];
                var sortedArr = arr.slice().sort(function(a, b) { return a - b; });
                var origTotal = calcTotal(arr);

                var steps = [];

                // Step 0: Show original order with cumulative wait
                steps.push({ apply: function() {
                    var origHtml = '', acc1 = 0;
                    arr.forEach(function(v) { acc1 += v; origHtml += personBox(v, acc1, 'var(--text3)'); });
                    origEl.innerHTML = origHtml;
                    origTotalEl.innerHTML = 'Total wait: <strong style="color:var(--red);">' + origTotal + ' min</strong>';
                    sortedEl.innerHTML = '';
                    sortTotalEl.textContent = '';
                    atmMsgEl.textContent = 'Original order total wait is ' + origTotal + ' min. Will sorting reduce it?';
                }});

                // Steps 1..N: Add each sorted person one by one
                var acc2 = 0, sTotal = 0;
                for (var i = 0; i < sortedArr.length; i++) {
                    acc2 += sortedArr[i];
                    sTotal += acc2;
                    (function(idx, cumWait, runTotal, sArr) {
                        steps.push({ apply: function() {
                            var html = '';
                            var a = 0;
                            for (var j = 0; j <= idx; j++) {
                                a += sArr[j];
                                html += personBox(sArr[j], a, 'var(--green)', j === idx);
                            }
                            sortedEl.innerHTML = html;
                            sortTotalEl.textContent = '';
                            atmMsgEl.textContent = sArr[idx] + ' min person added → cumulative wait: ' + cumWait + ' min';
                        }});
                    })(i, acc2, sTotal, sortedArr);
                }

                // Final step: show totals and comparison
                var finalSTotal = sTotal;
                steps.push({ apply: function() {
                    sortTotalEl.innerHTML = 'Total wait: <strong style="color:var(--green);">' + finalSTotal + ' min</strong>';
                    atmMsgEl.textContent = 'Sorted total wait: ' + finalSTotal + ' min (original: ' + origTotal + ' min). Saved ' + (origTotal - finalSTotal) + ' min!';
                }});

                return steps;
            }

            function atmReset() {
                atmState.steps = atmBuildSteps();
                atmState.stepIdx = -1;
                origEl.innerHTML = '';
                sortedEl.innerHTML = '';
                origTotalEl.textContent = '';
                sortTotalEl.textContent = '';
                atmMsgEl.textContent = 'Putting people with shorter times first reduces the waiting time for everyone behind them.';
            }

            atmReset();

            atmGoBtn.addEventListener('click', function() {
                if (atmState.stepIdx >= atmState.steps.length - 1) return;
                atmState.stepIdx++;
                atmState.steps[atmState.stepIdx].apply();
            });

            atmResetBtn.addEventListener('click', function() {
                atmReset();
            });
        }

        // === Demo 5: Meeting Room Assignment 3 Steps ===
        {
            var meetings = [
                {s:1, e:4}, {s:3, e:5}, {s:0, e:6}, {s:5, e:7},
                {s:3, e:8}, {s:5, e:9}, {s:6, e:10}, {s:8, e:11}
            ];
            var meetGoBtn = container.querySelector('#gr-demo-meet-go');
            var meetResetBtn = container.querySelector('#gr-demo-meet-reset');
            var meetStepLabel = container.querySelector('#gr-demo-meet-step-label');
            var meetTimeline = container.querySelector('#gr-demo-meet-timeline');
            var meetResultEl = container.querySelector('#gr-demo-meet-result');
            var meetMsgEl = container.querySelector('#gr-demo-meet-msg');
            var meetMaxTime = 12;
            var meetColors = ['#6c5ce7', '#e17055', '#00b894', '#fdcb6e', '#0984e3', '#d63031', '#a29bfe', '#fab1a0'];

            function renderMeetTimeline(list, selectedSet, phase) {
                var html = '<div style="position:relative;padding:10px 0 30px 0;">';
                html += '<div style="position:relative;height:20px;margin-bottom:10px;">';
                for (var t = 0; t <= meetMaxTime; t++) {
                    html += '<span style="position:absolute;left:' + (t / meetMaxTime * 100) + '%;transform:translateX(-50%);font-size:0.7rem;color:var(--text3);">' + t + '</span>';
                }
                html += '</div>';
                list.forEach(function(m, i) {
                    var leftP = (m.s / meetMaxTime * 100);
                    var widthP = ((m.e - m.s) / meetMaxTime * 100);
                    var sel = selectedSet && selectedSet[i];
                    var bg = sel ? 'var(--green)' : meetColors[i % meetColors.length];
                    var op = (phase === 3 && !sel) ? '0.25' : '1';
                    html += '<div style="position:relative;height:26px;margin-bottom:3px;">' +
                        '<div style="position:absolute;left:' + leftP + '%;width:' + widthP + '%;height:100%;background:' + bg + ';border-radius:5px;opacity:' + op + ';display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:0.75rem;transition:all 0.4s;' + (sel ? 'box-shadow:0 0 8px var(--green)60;' : '') + '">' +
                        '[' + m.s + '-' + m.e + ']</div></div>';
                });
                html += '</div>';
                meetTimeline.innerHTML = html;
            }

            renderMeetTimeline(meetings, {}, 0);

            meetGoBtn.addEventListener('click', function() {
                meetGoBtn.style.display = 'none';
                meetResetBtn.style.display = '';

                // Step 1: Sort
                meetStepLabel.textContent = 'Step 1: Sort by end time';
                meetResultEl.textContent = 'Sorting by earliest end time...';
                var sorted2 = meetings.slice().sort(function(a, b) { return a.e - b.e || a.s - b.s; });
                setTimeout(function() {
                    renderMeetTimeline(sorted2, {}, 1);
                    meetResultEl.textContent = 'Sorted! End time order: ' + sorted2.map(function(m) { return '[' + m.s + '-' + m.e + ']'; }).join(', ');

                    // Step 2: Select
                    setTimeout(function() {
                        meetStepLabel.textContent = 'Step 2: Select non-overlapping meetings';
                        var selSet = {};
                        var lastEnd = 0, count = 0, idx2 = 0;
                        function selectStep() {
                            if (idx2 >= sorted2.length) {
                                // Step 3: Result
                                setTimeout(function() {
                                    meetStepLabel.textContent = 'Step 3: Result';
                                    renderMeetTimeline(sorted2, selSet, 3);
                                    meetResultEl.innerHTML = 'Maximum <strong style="color:var(--green);">' + count + '</strong> meetings can be scheduled!';
                                    meetMsgEl.textContent = '3 steps complete! Sort by end time -> select non-overlapping -> check result.';
                                }, 500);
                                return;
                            }
                            var m = sorted2[idx2];
                            if (m.s >= lastEnd) {
                                selSet[idx2] = true;
                                lastEnd = m.e;
                                count++;
                                meetResultEl.innerHTML = '[' + m.s + '-' + m.e + '] -> <span style="color:var(--green);">Selected!</span> (start ' + m.s + ' >= last end ' + (m.s === 0 ? 0 : lastEnd - (m.e - m.s)) + ')';
                            } else {
                                meetResultEl.innerHTML = '[' + m.s + '-' + m.e + '] -> <span style="color:var(--red);">Overlap, skip</span>';
                            }
                            renderMeetTimeline(sorted2, selSet, 2);
                            idx2++;
                            setTimeout(selectStep, 600);
                        }
                        selectStep();
                    }, 800);
                }, 700);
            });

            meetResetBtn.addEventListener('click', function() {
                meetGoBtn.style.display = '';
                meetResetBtn.style.display = 'none';
                meetStepLabel.textContent = '';
                renderMeetTimeline(meetings, {}, 0);
                meetResultEl.textContent = '';
                meetMsgEl.textContent = 'Sort by end time -> select if no overlap -> check maximum meeting count. Watch all 3 steps.';
            });
        }
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
        var state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var s = suffix || '';
        var prevBtn = container.querySelector('#viz-prev' + s);
        var nextBtn = container.querySelector('#viz-next' + s);
        var indicator = container.querySelector('#viz-step-counter' + s);
        var desc = container.querySelector('#viz-step-desc' + s);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { indicator.textContent = 'Before start'; desc.textContent = '▶ Click Next to start'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.innerHTML = '<span>' + state.steps[idx].description + '</span>'; }
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
    // Simulation 1: Coin 0 (boj-11047)
    // ====================================================================
    _renderVizCoin(container) {
        var self = this, suffix = '-coin';
        var coins = [1000, 500, 100, 50, 10, 1];
        var DEFAULT_K = 4200;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Coin Change -- Largest Coin First</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Change (K): <input type="number" id="gr-coin-input" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
                '<button class="btn btn-primary" id="gr-coin-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="cn-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="cn-coins' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="cn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var descEl = container.querySelector('#cn-desc' + suffix);
        var coinsEl = container.querySelector('#cn-coins' + suffix);
        var infoEl = container.querySelector('#cn-info' + suffix);

        function buildAndRun(K) {
            self._clearVizState();
            descEl.innerHTML = 'Making change for K=<strong>' + K + '</strong> using coins [' + coins.join(', ') + '].';
            var usedSoFar = {};
            function renderCoins(usedMap) {
                coinsEl.innerHTML = coins.map(function(c) {
                    var cnt = usedMap[c] || 0;
                    var active = cnt > 0;
                    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;margin-bottom:4px;border-radius:8px;background:' + (active ? 'var(--accent)10' : 'var(--bg2)') + ';border:2px solid ' + (active ? 'var(--accent)' : 'transparent') + ';">' +
                        '<div style="width:48px;height:48px;border-radius:50%;background:' + (active ? 'var(--accent)' : 'var(--text3)') + ';color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">' + c + '</div>' +
                        '<span style="font-weight:600;font-size:1rem;">' + (active ? cnt + ' used' : '-') + '</span></div>';
                }).join('');
            }
            renderCoins({});
            infoEl.innerHTML = '<span style="color:var(--text2);">Remaining: <strong>' + K + '</strong></span>';
            var steps = [];
            var rem = K, totalCount = 0;
            coins.forEach(function(coin) {
                var cnt = Math.floor(rem / coin);
                if (cnt > 0) {
                    var prevRem = rem;
                    rem -= cnt * coin;
                    totalCount += cnt;
                    var afterRem = rem, afterTotal = totalCount;
                    (function(coin, cnt, prevRem, afterRem, afterTotal) {
                        steps.push({
                            description: coin + ': ' + prevRem + ' / ' + coin + ' = ' + cnt + ' used -> remaining: ' + afterRem + ' — <em>use the largest coin first to minimize total coin count</em> (multiples guarantee optimality)',
                            action: function() { usedSoFar[coin] = cnt; renderCoins(usedSoFar); infoEl.innerHTML = coin + ' x ' + cnt + ' = ' + (coin * cnt) + ' used -> remaining: <strong>' + afterRem + '</strong>'; },
                            undo: function() { delete usedSoFar[coin]; renderCoins(usedSoFar); infoEl.innerHTML = '<span style="color:var(--text2);">Remaining: <strong>' + prevRem + '</strong></span>'; }
                        });
                    })(coin, cnt, prevRem, afterRem, afterTotal);
                }
            });
            var finalTotal = totalCount;
            steps.push({
                description: 'Done! Made change for ' + K + ' using ' + finalTotal + ' coins total.',
                action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Total coins: ' + finalTotal + '</strong>'; },
                undo: function() { infoEl.innerHTML = 'Remaining: <strong>0</strong>'; }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#gr-coin-reset').addEventListener('click', function() {
            var val = parseInt(container.querySelector('#gr-coin-input').value);
            if (isNaN(val) || val <= 0) val = DEFAULT_K;
            buildAndRun(val);
        });
        buildAndRun(DEFAULT_K);
    },

    // ====================================================================
    // Simulation 2: ATM (boj-11399)
    // ====================================================================
    _renderVizATM(container) {
        var self = this, suffix = '-atm';
        var DEFAULT_ARR = '3, 1, 4, 3, 2';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">ATM Waiting Time Minimization</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Withdrawal time: <input type="text" id="gr-atm-input" value="' + DEFAULT_ARR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<button class="btn btn-primary" id="gr-atm-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="atm-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="atm-bars' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="atm-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var descEl = container.querySelector('#atm-desc' + suffix);
        var barsEl = container.querySelector('#atm-bars' + suffix);
        var infoEl = container.querySelector('#atm-info' + suffix);

        function buildAndRun(original) {
            self._clearVizState();
            var sorted = original.slice().sort(function(a, b) { return a - b; });
            descEl.innerHTML = 'Withdrawal times: [' + original.join(', ') + '] -> Sorted: [' + sorted.join(', ') + ']';
            var maxVal = Math.max.apply(null, sorted);
            function renderBars(highlight, accValues) {
                barsEl.innerHTML = sorted.map(function(v, i) {
                    var pct = maxVal > 0 ? (v / maxVal) * 100 : 0;
                    var isHl = (highlight === i);
                    var accText = accValues && accValues[i] !== undefined ? ' (cumulative: ' + accValues[i] + ')' : '';
                    return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
                        '<div style="width:30px;text-align:right;font-size:0.85rem;font-weight:600;color:' + (isHl ? 'var(--accent)' : 'var(--text2)') + ';">P' + (i + 1) + '</div>' +
                        '<div style="flex:1;height:28px;border-radius:6px;overflow:hidden;background:var(--bg2);">' +
                        '<div style="width:' + pct + '%;height:100%;background:' + (isHl ? 'var(--accent)' : 'var(--green)') + ';border-radius:6px;display:flex;align-items:center;padding-left:8px;color:white;font-weight:600;font-size:0.8rem;">' + v + 'min' + accText + '</div></div></div>';
                }).join('');
            }
            renderBars(-1, null);
            infoEl.innerHTML = '<span style="color:var(--text2);">Process shortest times first to minimize total waiting time.</span>';
            var steps = [];
            var acc = 0, total = 0, accArr = [];
            sorted.forEach(function(v, i) {
                acc += v;
                total += acc;
                var curAcc = acc, curTotal = total;
                accArr.push(curAcc);
                var snapshot = accArr.slice();
                (function(i, v, curAcc, curTotal, snapshot) {
                    steps.push({
                        description: 'P' + (i + 1) + '=' + v + 'min: cumulative wait = ' + curAcc + 'min, total = ' + curTotal + 'min — <em>shorter person first reduces wait for everyone behind</em>',
                        action: function() { renderBars(i, snapshot); infoEl.innerHTML = 'P' + (i + 1) + ': wait <strong>' + curAcc + 'min</strong>, cumulative total: <strong>' + curTotal + 'min</strong>'; },
                        undo: function() { renderBars(-1, null); infoEl.innerHTML = '<span style="color:var(--text2);">Process shortest times first to minimize total waiting time.</span>'; }
                    });
                })(i, v, curAcc, curTotal, snapshot);
            });
            var finalTotal = total;
            steps.push({
                description: 'Done! Minimum total waiting time = ' + finalTotal + 'min',
                action: function() { renderBars(-1, accArr); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Minimum total waiting time: ' + finalTotal + 'min</strong>'; },
                undo: function() { renderBars(-1, null); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#gr-atm-reset').addEventListener('click', function() {
            var arr = container.querySelector('#gr-atm-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            if (arr.length === 0) arr = [3, 1, 4, 3, 2];
            buildAndRun(arr);
        });
        buildAndRun([3, 1, 4, 3, 2]);
    },

    // ====================================================================
    // Simulation 3: Meeting Room Assignment (boj-1931)
    // ====================================================================
    _renderVizMeeting(container) {
        var self = this, suffix = '-meet';
        var DEFAULT_MEETINGS = '1 4, 3 5, 0 6, 5 7, 3 8, 5 9, 6 10, 8 11, 8 12, 2 13, 12 14';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Meeting Room Assignment -- Sort by End Time</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Meetings (start end, ...): <input type="text" id="gr-meet-input" value="' + DEFAULT_MEETINGS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:360px;"></label>' +
                '<button class="btn btn-primary" id="gr-meet-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="mt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="mt-area' + suffix + '" style="position:relative;margin-bottom:12px;border-left:2px solid var(--border);padding-left:40px;"></div>' +
            '<div id="mt-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var descEl = container.querySelector('#mt-desc' + suffix);
        var areaEl = container.querySelector('#mt-area' + suffix);
        var infoEl = container.querySelector('#mt-info' + suffix);

        function buildAndRun(meetings) {
            self._clearVizState();
            var sorted = meetings.slice().sort(function(a, b) { return a[1] !== b[1] ? a[1] - b[1] : a[0] - b[0]; });
            var maxTime = 0;
            for (var i = 0; i < sorted.length; i++) { if (sorted[i][1] > maxTime) maxTime = sorted[i][1]; }
            descEl.innerHTML = 'Sorting ' + sorted.length + ' meetings by end time, then selecting greedily.';
            areaEl.style.minHeight = (sorted.length * 32 + 30) + 'px';
            var timelineHTML = '';
            var tickStep = maxTime <= 15 ? 1 : maxTime <= 30 ? 2 : 5;
            for (var ti = 0; ti <= maxTime; ti += tickStep) {
                timelineHTML += '<div style="position:absolute;left:' + (40 + (ti / maxTime) * 80) + '%;top:0;font-size:0.65rem;color:var(--text3);transform:translateX(-50%);">' + ti + '</div>';
            }
            sorted.forEach(function(m, i) {
                var left = 40 + (m[0] / maxTime) * 80;
                var width = ((m[1] - m[0]) / maxTime) * 80;
                timelineHTML += '<div id="mt-bar-' + i + suffix + '" style="position:absolute;left:' + left + '%;top:' + (18 + i * 30) + 'px;width:' + width + '%;height:24px;border-radius:6px;background:var(--bg2);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600;color:var(--text2);transition:all 0.3s;">(' + m[0] + ',' + m[1] + ')</div>';
            });
            areaEl.innerHTML = timelineHTML;
            infoEl.innerHTML = '<span style="color:var(--text2);">Sorted by end time in ascending order</span>';
            var steps = [];
            var lastEnd = -1, selectedCount = 0;
            sorted.forEach(function(m, i) {
                var start = m[0], end = m[1];
                if (start >= lastEnd) {
                    var prevEnd = lastEnd;
                    lastEnd = end;
                    selectedCount++;
                    var cnt = selectedCount;
                    (function(i, start, end, prevEnd, cnt) {
                        steps.push({
                            description: 'Meeting (' + start + '~' + end + '): start(' + start + ') >= prev end(' + (prevEnd < 0 ? 'none' : prevEnd) + ') -> <strong>Selected!</strong> (#' + cnt + ') — <em>choosing the earliest-ending meeting maximizes remaining time for more meetings</em>',
                            action: function() {
                                var bar = container.querySelector('#mt-bar-' + i + suffix);
                                if (bar) { bar.style.background = 'var(--green)'; bar.style.borderColor = 'var(--green)'; bar.style.color = 'white'; }
                                infoEl.innerHTML = 'Selected: <strong style="color:var(--green);">' + cnt + '</strong> | last end: ' + end;
                            },
                            undo: function() {
                                var bar = container.querySelector('#mt-bar-' + i + suffix);
                                if (bar) { bar.style.background = 'var(--bg2)'; bar.style.borderColor = 'var(--border)'; bar.style.color = 'var(--text2)'; }
                                infoEl.innerHTML = prevEnd < 0 ? '<span style="color:var(--text2);">Sorted by end time in ascending order</span>' : 'Selected: <strong style="color:var(--green);">' + (cnt - 1) + '</strong>';
                            }
                        });
                    })(i, start, end, prevEnd, cnt);
                } else {
                    var curEnd = lastEnd;
                    (function(i, start, end, curEnd) {
                        steps.push({
                            description: 'Meeting (' + start + '~' + end + '): start(' + start + ') < prev end(' + curEnd + ') -> <strong>Overlap! Skipped</strong> — <em>including this would force dropping the previous meeting, resulting in fewer total meetings</em>',
                            action: function() {
                                var bar = container.querySelector('#mt-bar-' + i + suffix);
                                if (bar) { bar.style.background = 'var(--red)15'; bar.style.borderColor = 'var(--red)'; bar.style.color = 'var(--red)'; bar.style.opacity = '0.5'; }
                            },
                            undo: function() {
                                var bar = container.querySelector('#mt-bar-' + i + suffix);
                                if (bar) { bar.style.background = 'var(--bg2)'; bar.style.borderColor = 'var(--border)'; bar.style.color = 'var(--text2)'; bar.style.opacity = '1'; }
                            }
                        });
                    })(i, start, end, curEnd);
                }
            });
            var finalCount = selectedCount;
            steps.push({
                description: 'Done! Assigned a maximum of ' + finalCount + ' non-overlapping meetings! — <em>sort by end time + select non-overlapping is the optimal strategy</em>',
                action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Maximum ' + finalCount + ' meetings assigned!</strong>'; },
                undo: function() { infoEl.innerHTML = 'Selected: <strong style="color:var(--green);">' + finalCount + '</strong>'; }
            });
            self._initStepController(container, steps, suffix);
        }
        function parseMeetings(str) {
            var pairs = str.split(',');
            var result = [];
            for (var i = 0; i < pairs.length; i++) {
                var nums = pairs[i].trim().split(/\s+/).map(Number);
                if (nums.length >= 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
                    result.push([nums[0], nums[1]]);
                }
            }
            return result;
        }
        container.querySelector('#gr-meet-reset').addEventListener('click', function() {
            var meetings = parseMeetings(container.querySelector('#gr-meet-input').value);
            if (meetings.length === 0) meetings = [[1,4],[3,5],[0,6],[5,7],[3,8],[5,9],[6,10],[8,11],[8,12],[2,13],[12,14]];
            buildAndRun(meetings);
        });
        buildAndRun([[1,4],[3,5],[0,6],[5,7],[3,8],[5,9],[6,10],[8,11],[8,12],[2,13],[12,14]]);
    },

    // ====================================================================
    // Simulation 4: Lost Bracket (boj-1541)
    // ====================================================================
    _renderVizBracket(container) {
        var self = this, suffix = '-brk';
        var DEFAULT_EXPR = '55-50+40-30+20-10';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Lost Bracket -- Minimize the Value</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Expression: <input type="text" id="gr-bracket-input" value="' + DEFAULT_EXPR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="gr-bracket-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="bk-expr' + suffix + '" style="font-size:1.3rem;font-weight:700;text-align:center;padding:16px;background:var(--bg);border-radius:8px;margin-bottom:12px;font-family:monospace;"></div>' +
            '<div id="bk-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var exprEl = container.querySelector('#bk-expr' + suffix);
        var infoEl = container.querySelector('#bk-info' + suffix);

        function buildAndRun(expr) {
            self._clearVizState();
            // parse expression into groups split by '-'
            var groups = expr.split('-');
            var sums = [];
            var groupTexts = [];
            for (var g = 0; g < groups.length; g++) {
                var parts = groups[g].split('+').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
                var s = 0;
                for (var p = 0; p < parts.length; p++) s += parts[p];
                sums.push(s);
                groupTexts.push(groups[g].trim());
            }
            var result = sums[0];
            for (var r = 1; r < sums.length; r++) result -= sums[r];

            exprEl.innerHTML = expr;
            infoEl.innerHTML = '<span style="color:var(--text2);">Place parentheses after "-" to maximize the value being subtracted.</span>';

            var steps = [];
            // Step 1: split by '-'
            var groupLabels = groups.map(function(gt, gi) {
                return gi === 0
                    ? '<span style="color:var(--accent);">' + gt.trim() + '</span>'
                    : '<span style="color:#e17055;">' + gt.trim() + '</span>';
            });
            var splitDisplay = groupLabels.join(' <span style="color:var(--red);font-size:1.5rem;">-</span> ');
            var groupDescParts = groups.map(function(gt, gi) { return 'Group ' + (gi + 1) + ': <strong>' + gt.trim() + '</strong>'; });
            steps.push({
                description: 'Step 1: Split the expression into ' + groups.length + ' groups by "-". — <em>placing parentheses after "-" turns all "+" inside into subtractions</em>',
                action: function() {
                    exprEl.innerHTML = splitDisplay;
                    infoEl.innerHTML = groupDescParts.join(', ');
                },
                undo: function() { exprEl.innerHTML = expr; infoEl.innerHTML = '<span style="color:var(--text2);">Place parentheses after "-" to maximize the value being subtracted.</span>'; }
            });
            // Step 2: wrap groups after first '-' in parentheses
            if (groups.length > 1) {
                var bracketParts = groups.slice(1).map(function(gt) { return gt.trim(); });
                var bracketExpr = bracketParts.join('+');
                var wrappedDisplay = '<span style="color:var(--accent);">' + groups[0].trim() + '</span> - <span style="color:#e17055;border:2px dashed #e17055;padding:2px 8px;border-radius:6px;">(' + bracketExpr + ')</span>';
                steps.push({
                    description: 'Step 2: Wrap the groups after "-" in parentheses. — <em>"+" inside parentheses all become subtractions, maximizing what we subtract</em>',
                    action: function() {
                        exprEl.innerHTML = wrappedDisplay;
                        infoEl.innerHTML = 'With parentheses: ' + groups[0].trim() + ' - <strong>(' + bracketExpr + ')</strong>';
                    },
                    undo: function() {
                        exprEl.innerHTML = splitDisplay;
                        infoEl.innerHTML = groupDescParts.join(', ');
                    }
                });
                // Step 3: compute each group sum
                var restSum = 0;
                for (var rs = 1; rs < sums.length; rs++) restSum += sums[rs];
                var sumDescs = groups.map(function(gt, gi) {
                    return 'Group ' + (gi + 1) + ' sum: ' + (groupTexts[gi].indexOf('+') >= 0 ? groupTexts[gi] + ' = ' : '') + '<strong>' + sums[gi] + '</strong>';
                });
                steps.push({
                    description: 'Step 3: Compute the sum of each group. — <em>inside parentheses the "+" connects numbers, so we sum each group first</em>',
                    action: function() {
                        exprEl.innerHTML = '<span style="color:var(--accent);">' + sums[0] + '</span> - <span style="color:#e17055;">(' + restSum + ')</span>';
                        infoEl.innerHTML = sumDescs.join(', ');
                    },
                    undo: function() {
                        exprEl.innerHTML = wrappedDisplay;
                        infoEl.innerHTML = 'With parentheses: ' + groups[0].trim() + ' - <strong>(' + bracketExpr + ')</strong>';
                    }
                });
                // Step 4: compute result
                steps.push({
                    description: 'Step 4: Add the first group and subtract the rest -> ' + sums[0] + ' - ' + restSum + ' = ' + result + ' — <em>subtracting everything after the first "-" yields the minimum</em>',
                    action: function() {
                        exprEl.innerHTML = sums[0] + ' - ' + restSum + ' = <span style="color:var(--green);font-size:1.5rem;">' + result + '</span>';
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Minimum value: ' + result + '</strong>';
                    },
                    undo: function() {
                        exprEl.innerHTML = '<span style="color:var(--accent);">' + sums[0] + '</span> - <span style="color:#e17055;">(' + restSum + ')</span>';
                        infoEl.innerHTML = sumDescs.join(', ');
                    }
                });
                // Step 5: final confirmation
                steps.push({
                    description: 'Done! Key insight: wrapping all numbers after the first "-" in parentheses gives the minimum!',
                    action: function() {
                        exprEl.innerHTML = sums[0] + ' - <span style="border:2px solid var(--green);padding:2px 8px;border-radius:6px;color:var(--green);">(' + bracketExpr + ')</span> = <strong style="color:var(--green);">' + result + '</strong>';
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Answer: ' + result + ' (subtract everything after "-" using parentheses!)</strong>';
                    },
                    undo: function() {
                        exprEl.innerHTML = sums[0] + ' - ' + restSum + ' = <span style="color:var(--green);font-size:1.5rem;">' + result + '</span>';
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Minimum value: ' + result + '</strong>';
                    }
                });
            } else {
                // No '-' in expression — result is just the sum
                steps.push({
                    description: 'No "-" in the expression, so the result is simply ' + sums[0] + '.',
                    action: function() {
                        exprEl.innerHTML = '<span style="color:var(--green);font-size:1.5rem;">' + sums[0] + '</span>';
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Result: ' + sums[0] + '</strong>';
                    },
                    undo: function() {
                        exprEl.innerHTML = splitDisplay;
                        infoEl.innerHTML = groupDescParts.join(', ');
                    }
                });
            }
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#gr-bracket-reset').addEventListener('click', function() {
            var val = container.querySelector('#gr-bracket-input').value.trim();
            if (!val) val = DEFAULT_EXPR;
            buildAndRun(val);
        });
        buildAndRun(DEFAULT_EXPR);
    },

    // ====================================================================
    // Simulation 5: Gas Station (boj-13305)
    // ====================================================================
    _renderVizGas(container) {
        var self = this, suffix = '-gas';
        var DEFAULT_DIST = '2, 3, 1';
        var DEFAULT_PRICE = '5, 2, 4, 1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Gas Station -- Minimum Cost Travel</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Distances: <input type="text" id="gr-gas-dist" value="' + DEFAULT_DIST + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
                '<label style="font-weight:600;">Fuel prices: <input type="text" id="gr-gas-price" value="' + DEFAULT_PRICE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:160px;"></label>' +
                '<button class="btn btn-primary" id="gr-gas-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="gs-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="gs-road' + suffix + '" style="position:relative;height:100px;margin:16px 0;"></div>' +
            '<div id="gs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var descEl = container.querySelector('#gs-desc' + suffix);
        var roadEl = container.querySelector('#gs-road' + suffix);
        var infoEl = container.querySelector('#gs-info' + suffix);

        function buildAndRun(dist, price) {
            self._clearVizState();
            var N = price.length;
            descEl.innerHTML = N + ' cities, distances: [' + dist.join(', ') + '], fuel prices: [' + price.join(', ') + ']';
            var totalDist = 0;
            for (var d = 0; d < dist.length; d++) totalDist += dist[d];
            function renderRoad(curCity, minP, costs) {
                var html = '<div style="position:absolute;left:5%;right:5%;top:45px;height:4px;background:var(--border);border-radius:2px;"></div>';
                var cumDist = 0;
                for (var i = 0; i < N; i++) {
                    var pct = totalDist > 0 ? 5 + (cumDist / totalDist) * 90 : 5 + (i / (N - 1)) * 90;
                    var isCur = (curCity === i);
                    var usedPrice = costs && costs[i] !== undefined;
                    html += '<div style="position:absolute;left:' + pct + '%;top:20px;transform:translateX(-50%);text-align:center;">' +
                        '<div style="font-size:0.75rem;color:var(--text3);">City ' + (i + 1) + '</div>' +
                        '<div style="width:16px;height:16px;border-radius:50%;margin:4px auto;background:' + (isCur ? 'var(--accent)' : usedPrice ? 'var(--green)' : 'var(--text3)') + ';"></div>' +
                        '<div style="font-size:0.8rem;font-weight:600;color:' + (isCur ? 'var(--accent)' : 'var(--text2)') + ';">' + price[i] + '/L</div></div>';
                    if (i < N - 1) {
                        var nextCum = cumDist + dist[i];
                        var nextPct = totalDist > 0 ? 5 + (nextCum / totalDist) * 90 : 5 + ((i + 1) / (N - 1)) * 90;
                        var midPct = (pct + nextPct) / 2;
                        html += '<div style="position:absolute;left:' + midPct + '%;top:54px;transform:translateX(-50%);font-size:0.7rem;color:var(--text3);">' + dist[i] + 'km</div>';
                        cumDist += dist[i];
                    }
                }
                roadEl.innerHTML = html;
            }
            renderRoad(-1, -1, null);
            infoEl.innerHTML = '<span style="color:var(--text2);">Refuel at the lowest price seen so far.</span>';
            var steps = [];
            var minPrice = price[0], totalCost = 0, costMap = {};
            for (var ci = 0; ci < N - 1; ci++) {
                if (price[ci] < minPrice) minPrice = price[ci];
                var segCost = minPrice * dist[ci];
                totalCost += segCost;
                costMap[ci] = segCost;
                var cMinP = minPrice, cTotal = totalCost, cCity = ci, cSegCost = segCost, cDist = dist[ci];
                (function(cCity, cMinP, cTotal, cSegCost, cDist) {
                    steps.push({
                        description: 'City ' + (cCity + 1) + ': min price ' + cMinP + ' x ' + cDist + 'km = ' + cSegCost + ' (cumulative: ' + cTotal + ') — <em>always refuel at the cheapest price seen so far for optimal cost</em>',
                        action: function() { renderRoad(cCity, cMinP, costMap); infoEl.innerHTML = 'City ' + (cCity + 1) + ': <strong>' + cMinP + '/L</strong> x ' + cDist + 'km = ' + cSegCost + ', cumulative: <strong>' + cTotal + '</strong>'; },
                        undo: function() { renderRoad(-1, -1, null); infoEl.innerHTML = '<span style="color:var(--text2);">Refuel at the lowest price seen so far.</span>'; }
                    });
                })(cCity, cMinP, cTotal, cSegCost, cDist);
            }
            var finalCost = totalCost;
            steps.push({
                description: 'Done! Minimum cost = ' + finalCost,
                action: function() { renderRoad(N - 1, -1, costMap); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Minimum cost: ' + finalCost + '</strong>'; },
                undo: function() { renderRoad(-1, -1, null); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#gr-gas-reset').addEventListener('click', function() {
            var distArr = container.querySelector('#gr-gas-dist').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            var priceArr = container.querySelector('#gr-gas-price').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            // price should have exactly distArr.length + 1 elements
            if (distArr.length === 0 || priceArr.length === 0) { distArr = [2, 3, 1]; priceArr = [5, 2, 4, 1]; }
            if (priceArr.length < distArr.length + 1) {
                while (priceArr.length < distArr.length + 1) priceArr.push(1);
            } else if (priceArr.length > distArr.length + 1) {
                priceArr = priceArr.slice(0, distArr.length + 1);
            }
            buildAndRun(distArr, priceArr);
        });
        buildAndRun([2, 3, 1], [5, 2, 4, 1]);
    },

    // ===== Empty Stub =====
    renderVisualize(container) {},
    renderProblem(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: 'Basic Greedy', desc: 'Simple greedy choices (Silver IV)', problemIds: ['boj-11047', 'boj-11399'] },
        { num: 2, title: 'Sort + Greedy', desc: 'Greedy where sorting is key (Silver I~II)', problemIds: ['boj-1931', 'boj-1541'] },
        { num: 3, title: 'Applied Greedy', desc: 'Greedy with complex conditions (Silver III)', problemIds: ['boj-13305'] }
    ],

    // ===== Problem List =====
    problems: [
        // ========== Stage 1: Basic Greedy ==========
        {
            id: 'boj-11047',
            title: 'BOJ 11047 - Coin 0',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11047',
            simIntro: 'Observe the greedy process of using the largest coins first.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Jungyu has N types of coins, and he has a very large number of each type. He wants to use the coins to make the total value exactly K. Write a program to find the minimum number of coins needed.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10 4200\n1\n5\n10\n50\n100\n500\n1000\n5000\n10000\n50000</pre></div>
                    <div><strong>Output</strong><pre>6</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10 4790\n1\n5\n10\n50\n100\n500\n1000\n5000\n10000\n50000</pre></div>
                    <div><strong>Output</strong><pre>12</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains N and K. (1 ≤ N ≤ 10, 1 ≤ K ≤ 100,000,000)</p>
                <p>From the second line, N lines each contain the coin value A<sub>i</sub> in ascending order. (1 ≤ A<sub>i</sub> ≤ 1,000,000, A<sub>1</sub> = 1, and for i ≥ 2, A<sub>i</sub> is a multiple of A<sub>i-1</sub>)</p>
                <h4>Output</h4>
                <p>Output the minimum number of coins needed to make K.</p>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 10</li>
                    <li>1 ≤ K ≤ 100,000,000</li>
                    <li>A<sub>1</sub> = 1</li>
                    <li>A<sub>i</sub> is a multiple of A<sub>i-1</sub></li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'We have N types of coins and need to make the amount K. How about starting with the <strong>smallest coin (1 won)</strong> and filling up one by one?<br>Using K coins of value 1 would always work, but the number of coins would be way too many...' },
                { title: 'But there\'s a problem with this', content: 'K can be up to 100 million. 100 million coins of value 1? That makes no sense!<br>To <strong>minimize</strong> the number of coins, should we not use the largest coins as much as possible?<br>For example, to make 4200 won, using four 1000-won coins already gives us 4000.' },
                { title: 'What if we try this?', content: 'Use the <strong>largest coins first</strong> as much as possible, then handle the remainder with the next coin!<br><br><div style="padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="font-weight:600;margin-bottom:6px;text-align:center;">Example: Make 4200 won</div><div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap;"><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">1000x4</span><span style="color:var(--text3);">→ 200 left →</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">100x2</span><span style="color:var(--text3);">→ 0 left</span></div><div style="text-align:center;margin-top:6px;font-weight:600;color:var(--green);">Total 6 coins!</div></div>In this problem, coins are in a <strong>multiple relationship</strong>, so this strategy is always optimal. Multiple small coins can always be replaced by one large coin.' },
                { title: 'In Python/C++!', content: 'Iterate in reverse from the largest coin:<br><span class="lang-py"><code>count += K // coin</code> -> quotient = number of coins used<br><code>K %= coin</code> -> remainder = remaining amount</span><span class="lang-cpp"><code>count += K / coins[i]</code> -> quotient = number of coins used<br><code>K %= coins[i]</code> -> remainder = remaining amount</span><br>Just N iterations and done! Super fast at O(N).' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\ncoins = [int(input()) for _ in range(N)]\n\ncount = 0\nfor coin in reversed(coins):    # Largest coin first\n    count += K // coin\n    K %= coin\n\nprint(count)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n\n    int coins[10];\n    for (int i = 0; i < N; i++) cin >> coins[i];\n\n    int count = 0;\n    for (int i = N - 1; i >= 0; i--) {\n        count += K / coins[i];\n        K %= coins[i];\n    }\n    cout << count << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Greedy from largest coin',
                description: 'Minimize the number of coins by using the largest coin as much as possible.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read N types of coins and target amount K.', code: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\ncoins = [int(input()) for _ in range(N)]' },
                        { title: 'Greedy from largest coin', desc: 'Using the largest coins first minimizes the total count.\nSince coins are multiples of each other, greedy is always optimal.', code: 'count = 0\nfor coin in reversed(coins):    # Largest coin first\n    count += K // coin\n    K %= coin' },
                        { title: 'Output', desc: 'Print the minimum number of coins.', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Read N types of coins and target amount K.', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    int coins[10];\n    for (int i = 0; i < N; i++) cin >> coins[i];' },
                        { title: 'Greedy from largest coin', desc: 'Iterate in reverse from the largest coin.\nQuotient = number used, remainder = amount left.', code: '    int count = 0;\n    for (int i = N - 1; i >= 0; i--) {\n        count += K / coins[i];  // quotient = number used\n        K %= coins[i];          // remainder = amount left\n    }' },
                        { title: 'Output', desc: 'Print the minimum number of coins.', code: '    cout << count << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return greedyTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-11399',
            title: 'BOJ 11399 - ATM',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11399',
            simIntro: 'Observe how sorting by shortest time minimizes total waiting time.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Inha Bank has only 1 ATM. Currently, N people are standing in line. Given the withdrawal time Pi for each person, write a program to find the minimum sum of time each person needs to withdraw money.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5\n3 1 4 3 2</pre></div>
                    <div><strong>Output</strong><pre>32</pre></div>
                </div><p>If you rearrange the order to 1, 2, 3, 3, 4, then 1 + 3 + 6 + 9 + 13 = 32</p></div>
                <h4>Input</h4>
                <p>The first line contains the number of people N (1 ≤ N ≤ 1,000). The second line contains each person's withdrawal time P<sub>i</sub>. (1 ≤ P<sub>i</sub> ≤ 1,000)</p>
                <h4>Output</h4>
                <p>Output the minimum sum of time each person needs to withdraw money.</p>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000</li>
                    <li>1 ≤ P<sub>i</sub> ≤ 1,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'N people are standing in line at the ATM. How about trying all possible line orderings to find the one with the minimum total waiting time?<br>Trying all permutations... that is N! (factorial) cases.' },
                { title: 'But there\'s a problem with this', content: 'If N is up to 1,000, then 1000! is impossibly large...<br>Wait, think about it. If the person in front takes a long time, <strong>everyone behind has to wait</strong>.<br><br><div style="display:flex;flex-direction:column;gap:6px;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;"><span style="font-weight:600;color:var(--red);min-width:60px;">[3, 1]</span><span style="color:var(--text3);">→ 3 + (3+1) =</span><span style="font-weight:700;color:var(--red);">7 min</span></div><div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;"><span style="font-weight:600;color:var(--green);min-width:60px;">[1, 3]</span><span style="color:var(--text3);">→ 1 + (1+3) =</span><span style="font-weight:700;color:var(--green);">5 min</span></div></div><strong>Shorter people first is better!</strong>' },
                { title: 'What if we try this?', content: 'Just <strong>sort by shortest time</strong> and you are done! Here is why:<br>Each person\'s time gets added to the waiting time of <em>all</em> people behind them. So putting shorter times first reduces the total wait for everyone behind.<br>After sorting, each person\'s actual wait = <strong>prefix sum</strong> of all times before them, and the sum of all prefix sums is the answer.' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Sort with <code>P.sort()</code>, compute prefix sums with <code>acc += p</code>, and accumulate with <code>total += acc</code>. Done!</span><span class="lang-cpp">Sort with <code>sort(P, P + N)</code>, compute prefix sums with <code>acc += P[i]</code>, and accumulate with <code>total += acc</code>!</span><br>Sorting O(N log N) + traversal O(N) = overall O(N log N). Clean!' }
            ],
            templates: {
                python: 'N = int(input())\nP = list(map(int, input().split()))\n\nP.sort()    # Shortest time first\n\ntotal = 0\nacc = 0\nfor p in P:\n    acc += p        # Cumulative waiting time\n    total += acc    # Add each person\'s waiting time\n\nprint(total)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    int P[1000];\n    for (int i = 0; i < N; i++) cin >> P[i];\n\n    sort(P, P + N);\n\n    int total = 0, acc = 0;\n    for (int i = 0; i < N; i++) {\n        acc += P[i];\n        total += acc;\n    }\n    cout << total << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Sort + Prefix Sum',
                description: 'Sort in ascending order, then compute the sum of cumulative waiting times.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read the number of people N and each withdrawal time.', code: 'N = int(input())\nP = list(map(int, input().split()))' },
                        { title: 'Sort', desc: 'Sorting by shortest time first reduces waiting time for everyone behind.', code: 'P.sort()    # Shortest time first' },
                        { title: 'Prefix Sum', desc: 'Each person\'s actual wait = prefix sum of all previous times.\nThe sum of all prefix sums is the total waiting time.', code: 'total = 0\nacc = 0\nfor p in P:\n    acc += p        # Cumulative wait\n    total += acc    # Add each person\'s wait' },
                        { title: 'Output', desc: 'Print the minimum total waiting time.', code: 'print(total)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Read the number of people N and each withdrawal time.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    int P[1000];\n    for (int i = 0; i < N; i++) cin >> P[i];' },
                        { title: 'Sort', desc: 'Sort in ascending order to place shorter times first.', code: '    sort(P, P + N);  // Shortest time first' },
                        { title: 'Prefix Sum', desc: 'Each person\'s actual wait = prefix sum of all previous times.\nThe sum of all prefix sums is the total waiting time.', code: '    int total = 0, acc = 0;\n    for (int i = 0; i < N; i++) {\n        acc += P[i];    // Cumulative wait\n        total += acc;   // Add each person\'s wait\n    }' },
                        { title: 'Output', desc: 'Print the minimum total waiting time.', code: '    cout << total << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return greedyTopic.problems[1].templates; }
            }]
        },

        // ========== Stage 2: Sort + Greedy ==========
        {
            id: 'boj-1931',
            title: 'BOJ 1931 - Meeting Room Assignment',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1931',
            simIntro: 'Observe the activity selection process: sort by end time and select.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There is one meeting room that N meetings want to use. Given the start and end times for each meeting I, find the maximum number of meetings that can be scheduled without overlapping. A new meeting can start at the same time a previous one ends. The start and end times can be equal (in which case the meeting is considered to start and end immediately).</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>11\n1 4\n3 5\n0 6\n5 7\n3 8\n5 9\n6 10\n8 11\n8 12\n2 13\n12 14</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains the number of meetings N (1 ≤ N ≤ 100,000). From the second line, N lines each contain the start and end times of each meeting. Start and end times are natural numbers or 0, no greater than 2<sup>31</sup>-1.</p>
                <h4>Output</h4>
                <p>Output the maximum number of meetings that can be scheduled.</p>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>0 ≤ start time < end time ≤ 2<sup>31</sup> - 1</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'How about generating all non-overlapping combinations of N meetings and finding the one with the most meetings?<br>Checking all subsets means... 2<sup>N</sup> cases. With N up to 100,000, that is absolutely impossible!' },
                { title: 'But there\'s a problem with this', content: 'Then how about sorting by some criterion and picking one by one?<br><br><div style="display:flex;flex-direction:column;gap:6px;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div><span style="font-weight:600;color:var(--red);">Start time?</span> A long early meeting <span style="display:inline-block;width:100px;height:10px;background:var(--red);border-radius:3px;vertical-align:middle;opacity:0.7;"></span> blocks everything!</div><div><span style="font-weight:600;color:var(--red);">Duration?</span> A short meeting <span style="display:inline-block;width:20px;height:10px;background:var(--red);border-radius:3px;vertical-align:middle;opacity:0.7;"></span> might overlap with many others!</div><div><span style="font-weight:600;color:var(--green);">End time!</span> Early finish = more time left <span style="display:inline-block;width:30px;height:10px;background:var(--green);border-radius:3px;vertical-align:middle;"></span> <span style="display:inline-block;width:30px;height:10px;background:var(--green);border-radius:3px;vertical-align:middle;"></span> <span style="display:inline-block;width:30px;height:10px;background:var(--green);border-radius:3px;vertical-align:middle;"></span></div></div>' },
                { title: 'What if we try this?', content: 'Sort by <strong>end time</strong>! Selecting meetings that end earliest <strong>maximizes the remaining time available</strong>, so you can fit in more meetings.<br>Just pick meetings that start after the previous one ends: <code>if start &gt;= last_end -> select!</code><br>If end times are equal? Pick the one with the earlier start time (so zero-duration meetings are not missed!).' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Store as <code>(end, start)</code> tuples, and a single <code>sort()</code> sorts by end time automatically!</span><span class="lang-cpp">Store as <code>pair&lt;int,int&gt;</code> with <code>{end, start}</code>, and <code>sort()</code> automatically sorts by the first element!</span><br>Sorting O(N log N) + traversal O(N) = overall O(N log N).' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmeetings = []\nfor _ in range(N):\n    s, e = map(int, input().split())\n    meetings.append((e, s))     # Store as (end, start)\n\nmeetings.sort()     # Sort by end time\n\ncount = 0\nlast_end = 0\nfor end, start in meetings:\n    if start >= last_end:\n        count += 1\n        last_end = end\n\nprint(count)',
                cpp: '#include <iostream>\n#include <algorithm>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N;\n    cin >> N;\n    vector<pair<int,int>> meetings(N);\n    for (int i = 0; i < N; i++) {\n        int s, e;\n        cin >> s >> e;\n        meetings[i] = {e, s};  // {end, start}\n    }\n    sort(meetings.begin(), meetings.end());\n\n    int count = 0, lastEnd = 0;\n    for (auto& [end, start] : meetings) {\n        if (start >= lastEnd) {\n            count++;\n            lastEnd = end;\n        }\n    }\n    cout << count << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Sort by end time + Greedy',
                description: 'Sort by end time and select non-overlapping meetings.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Storing as (end, start) makes sort() automatically sort by end time.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmeetings = []\nfor _ in range(N):\n    s, e = map(int, input().split())\n    meetings.append((e, s))' },
                        { title: 'Sort by end time', desc: 'Selecting meetings that end earliest maximizes remaining time.', code: 'meetings.sort()     # Sort by end time' },
                        { title: 'Greedy selection', desc: 'Only select meetings that start after the previous one ends.\nSkip overlapping meetings to maximize the count.', code: 'count = 0\nlast_end = 0\nfor end, start in meetings:\n    if start >= last_end:\n        count += 1\n        last_end = end' },
                        { title: 'Output', desc: 'Print the maximum number of non-overlapping meetings selected.', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Store as pair<int,int> {end, start}.\nsort() automatically sorts by end time!', code: '#include <iostream>\n#include <algorithm>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int,int>> meetings(N);\n    for (int i = 0; i < N; i++) {\n        int s, e; cin >> s >> e;\n        meetings[i] = {e, s};  // {end, start}\n    }' },
                        { title: 'Sort by end time', desc: 'pair sorts by first element automatically, so it sorts by end time.', code: '    sort(meetings.begin(), meetings.end());' },
                        { title: 'Greedy selection', desc: 'Structured binding with auto& [end, start].', code: '    int count = 0, lastEnd = 0;\n    for (auto& [end, start] : meetings) {\n        if (start >= lastEnd) {\n            count++;\n            lastEnd = end;\n        }\n    }' },
                        { title: 'Output', desc: 'Print the maximum number of non-overlapping meetings selected.', code: '    cout << count << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return greedyTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-1541',
            title: 'BOJ 1541 - Lost Bracket',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1541',
            simIntro: 'Observe how placing parentheses after "-" minimizes the value.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Sejun has an expression consisting of positive integers and +, - operators. He wants to insert parentheses to minimize the value of the expression. Write a program that minimizes the value by placing parentheses appropriately.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>55-50+40</pre></div>
                    <div><strong>Output</strong><pre>-35</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10+20+30+40</pre></div>
                    <div><strong>Output</strong><pre>100</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>00009-00009</pre></div>
                    <div><strong>Output</strong><pre>0</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains the expression. The expression consists only of '0'~'9', '+', and '-'. The first and last characters are numbers. Two or more consecutive operators do not appear, and no number has more than 5 consecutive digits. Numbers can start with 0. The length of the expression is at most 50.</p>
                <h4>Output</h4>
                <p>Output the minimum value of the expression on the first line.</p>
                <h4>Constraints</h4>
                <ul>
                    <li>The expression contains only '0'~'9', '+', '-'</li>
                    <li>Expression length ≤ 50</li>
                    <li>Each number ≤ 5 digits</li>
                    <li>Numbers can start with 0</li>
                    <li>The expression starts and ends with a number</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Should we try all possible positions for parentheses? If the expression has many operators, the number of combinations could get quite large...<br>How about just computing the expression left to right?' },
                { title: 'But there\'s a problem with this', content: 'Just computing left to right might not give the minimum!<br>Example: <code>55-50+40</code> -> left to right gives 55-50+40 = 45, but with parentheses <code>55-(50+40)</code> = 55-90 = <strong>-35</strong> is smaller!<br>The key insight is: <strong>the more numbers you subtract after a minus sign, the smaller the result</strong>.' },
                { title: 'What if we try this?', content: 'Once the first <code>-</code> appears, wrap all the <code>+</code> expressions after it in parentheses!<br><br><div style="padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;text-align:center;"><div style="margin-bottom:6px;"><code>55 - 50 + 40</code> → <code>55 - <span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;">(50 + 40)</span></code></div><div style="display:flex;gap:8px;justify-content:center;align-items:center;"><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">55</span><span style="font-weight:700;">-</span><span style="padding:3px 8px;border-radius:6px;background:var(--red);color:white;font-weight:600;">90</span><span style="font-weight:700;">=</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">-35</span></div></div><strong>Implementation</strong>: split by <code>-</code>, sum <code>+</code>-connected numbers within each group. Add the first group, subtract all the rest!' },
                { title: 'In Python/C++!', content: '<span class="lang-py"><code>expr.split(\'-\')</code> to split by <code>-</code> -> split each group by <code>split(\'+\')</code> and sum with <code>sum(map(int, ...))</code>!</span><span class="lang-cpp"><code>getline(stream, segment, \'-\')</code> to split by <code>-</code> -> then <code>getline(gs, num, \'+\')</code> to split by <code>+</code> and convert with <code>stoi()</code>!</span><br>Overall O(N), just one pass through the expression length and done.' }
            ],
            templates: {
                python: 'expr = input()\n\n# Split by \'-\'\ngroups = expr.split(\'-\')\n\n# Sum numbers within each group\nsums = []\nfor group in groups:\n    sums.append(sum(map(int, group.split(\'+\'))))\n\n# Add first group, subtract the rest\nresult = sums[0]\nfor i in range(1, len(sums)):\n    result -= sums[i]\n\nprint(result)',
                cpp: '#include <iostream>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string expr;\n    cin >> expr;\n\n    int result = 0;\n    bool isFirst = true;\n\n    stringstream full(expr);\n    string segment;\n    while (getline(full, segment, \'-\')) {\n        int groupSum = 0;\n        stringstream gs(segment);\n        string num;\n        while (getline(gs, num, \'+\')) {\n            groupSum += stoi(num);\n        }\n        if (isFirst) {\n            result += groupSum;\n            isFirst = false;\n        } else {\n            result -= groupSum;\n        }\n    }\n\n    cout << result << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '"Subtract everything after -" Greedy',
                description: 'Split into groups by "-", add only the first group, and subtract all the rest.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read the expression consisting of positive integers, +, and -.', code: 'expr = input()' },
                        { title: 'Split by "-"', desc: 'Wrapping "+" after "-" in parentheses turns them all into subtractions,\nso we split into groups by "-".', code: 'groups = expr.split(\'-\')' },
                        { title: 'Sum each group', desc: 'Sum the numbers connected by "+" within each group.\nHandled concisely with map(int, ...) + sum.', code: 'sums = []\nfor group in groups:\n    sums.append(sum(map(int, group.split(\'+\'))))' },
                        { title: 'Add first, subtract rest', desc: 'Adding only the first group and subtracting all others gives the minimum.\nThe key is to subtract as much as possible after "-".', code: 'result = sums[0]\nfor i in range(1, len(sums)):\n    result -= sums[i]\n\nprint(result)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Include <sstream> to use stringstream.', code: '#include <iostream>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string expr;\n    cin >> expr;' },
                        { title: 'Split by "-"', desc: 'Split strings using getline(stream, var, delimiter).\nUse stringstream to treat a string like a stream.', code: '    int result = 0;\n    bool isFirst = true;\n    stringstream full(expr);\n    string segment;' },
                        { title: 'Sum each group', desc: 'After splitting by "-", split again by "+" and sum.\nConvert strings to integers with stoi().', code: '    while (getline(full, segment, \'-\')) {\n        int groupSum = 0;\n        stringstream gs(segment);\n        string num;\n        while (getline(gs, num, \'+\'))\n            groupSum += stoi(num);' },
                        { title: 'Add first, subtract rest', desc: 'Add only the first group and subtract all others to get the minimum.', code: '        if (isFirst) { result += groupSum; isFirst = false; }\n        else result -= groupSum;\n    }\n    cout << result << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return greedyTopic.problems[3].templates; }
            }]
        },

        // ========== Stage 3: Applied Greedy ==========
        {
            id: 'boj-13305',
            title: 'BOJ 13305 - Gas Station',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/13305',
            simIntro: 'Observe how comparing fuel prices at each city leads to minimum cost travel.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There are N cities on a straight road. You want to travel from the leftmost city to the rightmost city. Each city has a gas station with a different price per liter. Given the distances between cities and the fuel prices at each city, find the minimum cost to travel from the leftmost to the rightmost city.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4\n2 3 1\n5 2 4 1</pre></div>
                    <div><strong>Output</strong><pre>18</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4\n3 3 4\n1 1 1 1</pre></div>
                    <div><strong>Output</strong><pre>10</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains the number of cities N (2 ≤ N ≤ 100,000). The second line contains N-1 integers representing the road lengths between adjacent cities, from left to right. The third line contains N integers representing the gas price per liter at each city, from left to right. (1 ≤ road length, price per liter ≤ 1,000,000,000)</p>
                <h4>Output</h4>
                <p>Output the minimum cost to travel from the leftmost city to the rightmost city.</p>
                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ N ≤ 100,000</li>
                    <li>1 ≤ distance ≤ 10<sup>9</sup></li>
                    <li>1 ≤ price per liter ≤ 10<sup>9</sup></li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'At each city, how about refueling "just enough to reach the next cheaper gas station"?<br>But you would need to check all future gas station prices at every city... that is O(N<sup>2</sup>).' },
                { title: 'But there\'s a problem with this', content: 'With N up to 100,000, O(N<sup>2</sup>) means 10 billion operations... time limit exceeded!<br>And looking at all future gas stations is complicated. Is there a simpler way?<br>Wait, rethink the key point: when traveling a segment, you should have refueled at <strong>the cheapest gas station seen so far</strong>!' },
                { title: 'What if we try this?', content: 'Scan left to right just once, keeping track of the <strong>minimum price seen so far</strong>!<br><br><div style="padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="display:flex;gap:4px;align-items:end;justify-content:center;flex-wrap:wrap;margin-bottom:6px;"><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);">5</div><div style="width:30px;height:25px;background:var(--accent);border-radius:4px;"></div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);">2</div><div style="width:30px;height:10px;background:var(--green);border-radius:4px;"></div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);">4</div><div style="width:30px;height:20px;background:var(--green);border-radius:4px;"></div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);">1</div><div style="width:30px;height:5px;background:var(--green);border-radius:4px;"></div></div></div><div style="text-align:center;font-size:0.75rem;color:var(--text3);">Min price: <span style="color:var(--accent);">5</span> → <span style="color:var(--green);">2</span> → <span style="color:var(--green);">2</span> → <span style="color:var(--green);">1</span> (update when cheaper!)</div></div>Each segment cost = <code>min price x road length</code>. Solved in O(N) with a single pass!' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Update min price with <code>min_price = min(min_price, price[i])</code>, accumulate cost with <code>total += min_price * dist[i]</code>. Python handles big numbers automatically!</span><span class="lang-cpp">Update with <code>minPrice = min(minPrice, price[i])</code>, accumulate with <code>total += minPrice * dist[i]</code>. Values can reach 10<sup>9</sup> x 10<sup>5</sup>, so <strong>long long</strong> is required!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ndist = list(map(int, input().split()))\nprice = list(map(int, input().split()))\n\nmin_price = price[0]\ntotal = 0\n\nfor i in range(N - 1):\n    min_price = min(min_price, price[i])\n    total += min_price * dist[i]\n\nprint(total)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n\n    long long dist[100000], price[100000];\n    for (int i = 0; i < N - 1; i++) cin >> dist[i];\n    for (int i = 0; i < N; i++) cin >> price[i];\n\n    long long minPrice = price[0];\n    long long total = 0;\n\n    for (int i = 0; i < N - 1; i++) {\n        minPrice = min(minPrice, price[i]);\n        total += minPrice * dist[i];\n    }\n\n    cout << total << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Min price tracking Greedy',
                description: 'Maintain the minimum fuel price seen so far and compute the cost of each segment.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read the number of cities, distances between cities, and fuel prices.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ndist = list(map(int, input().split()))\nprice = list(map(int, input().split()))' },
                        { title: 'Initial min price', desc: 'Set the first city\'s fuel price as the initial minimum.', code: 'min_price = price[0]\ntotal = 0' },
                        { title: 'Greedy traversal', desc: 'Travel each segment at the lowest fuel price seen so far.\nUpdate the minimum price immediately when a cheaper station is found.', code: 'for i in range(N - 1):\n    min_price = min(min_price, price[i])\n    total += min_price * dist[i]' },
                        { title: 'Output', desc: 'Print the minimum travel cost.', code: 'print(total)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Handle large numbers with long long.\nValues can go up to 10^9 x 10^5!', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    long long dist[100000], price[100000];\n    for (int i = 0; i < N-1; i++) cin >> dist[i];\n    for (int i = 0; i < N; i++) cin >> price[i];' },
                        { title: 'Initial min price', desc: 'Set the first city\'s fuel price as the initial minimum.', code: '    long long minPrice = price[0];\n    long long total = 0;' },
                        { title: 'Greedy traversal', desc: 'Travel each segment at the lowest fuel price seen so far.\nUpdate the minimum price immediately when a cheaper station is found.', code: '    for (int i = 0; i < N-1; i++) {\n        minPrice = min(minPrice, price[i]);\n        total += minPrice * dist[i];\n    }' },
                        { title: 'Output', desc: 'Print the minimum travel cost.', code: '    cout << total << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return greedyTopic.problems[4].templates; }
            }]
        }
    ],

    // ===== Legacy Stub =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', function() { greedyTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.greedy = greedyTopic;
