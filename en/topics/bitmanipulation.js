// =========================================================
// Bit Manipulation Topic Module
// =========================================================
var bitManipulationTopic = {
    id: 'bitmanipulation',
    title: 'Bit Manipulation',
    icon: '💻',
    category: 'Advanced (Gold~Platinum)',
    order: 20,
    description: 'Efficient problem-solving techniques using bitwise operations and bitmasks',
    relatedNote: 'Bitwise operations form the foundation for various optimization techniques such as bitmask DP, subset enumeration, and XOR tricks.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'lc-191':    { type: 'Bit Counting',        color: 'var(--accent)', vizMethod: '_renderVizHammingWeight' },
        'lc-136':    { type: 'XOR Trick',           color: 'var(--green)',  vizMethod: '_renderVizSingleNumber' },
        'boj-11723': { type: 'Bitmask',             color: '#e17055',       vizMethod: '_renderVizBitmaskSet' },
        'lc-78':     { type: 'Subset Enumeration',  color: '#6c5ce7',       vizMethod: '_renderVizSubsets' }
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
            sim:     { intro: prob.simIntro || 'See how bitwise operations actually work in practice.', icon: '🎮' },
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
                <h2>💻 Bit Manipulation</h2>
                <p class="hero-sub">Let's work directly with the language of computers: 0s and 1s!</p>
            </div>

            <!-- Section 1: What is a Bit? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> What is a Bit?
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> A bit is like a <em>"light switch"</em>!
                    A switch has only two states: <strong>ON (1)</strong> and <strong>OFF (0)</strong>.
                    If you line up 8 light switches, you can represent numbers from 0 to 255.
                    For example, <code>00001010</code> means switches 2 and 4 are ON, representing the number 10!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">0 1</text></svg>
                        </div>
                        <h3>Bit</h3>
                        <p>The smallest unit a computer handles. It can only have two values: 0 or 1.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--green)">8 bit</text></svg>
                        </div>
                        <h3>Byte</h3>
                        <p>8 bits grouped together make 1 byte. With 8 bits, you can represent values from 0 to 255 (2<sup>8</sup>-1).</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">1010₂</text></svg>
                        </div>
                        <h3>Binary</h3>
                        <p>Instead of decimal (base 10), binary uses only 0 and 1. <code>1010₂</code> = 8+0+2+0 = <strong>10</strong>.</p>
                    </div>
                    <span class="lang-py"><div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--accent)">bin()</text></svg>
                        </div>
                        <h3>bin() Function</h3>
                        <p>In Python, <code>bin(10)</code> returns <code>'0b1010'</code>. An easy way to see the binary representation!<br>
                        <a href="https://docs.python.org/3/library/functions.html#bin" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: bin() ↗</a></p>
                    </div></span>
                    <span class="lang-cpp"><div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--accent)">bitset</text></svg>
                        </div>
                        <h3>bitset Class</h3>
                        <p>In C++, <code>bitset&lt;8&gt;(10)</code> outputs <code>00001010</code>. An easy way to see the binary representation!<br>
                        <a href="https://en.cppreference.com/w/cpp/utility/bitset" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: bitset ↗</a></p>
                    </div></span>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Binary representation
print(bin(10))      # '0b1010' — 10 in binary
print(bin(255))     # '0b11111111' — max value for 8 bits
print(0b1010)       # 10 — binary to decimal

# Convert to binary string
print(format(10, '08b'))  # '00001010' — pad to 8 digits
print(f"{10:08b}")        # '00001010' — f-string method</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;bitset&gt;
using namespace std;

int main() {
    // Binary representation
    cout &lt;&lt; bitset&lt;8&gt;(10) &lt;&lt; endl;   // 00001010 — 10 in binary
    cout &lt;&lt; bitset&lt;8&gt;(255) &lt;&lt; endl;  // 11111111 — max value for 8 bits
    cout &lt;&lt; 0b1010 &lt;&lt; endl;           // 10 — binary to decimal

    // Pad to specific number of digits
    cout &lt;&lt; bitset&lt;8&gt;(10) &lt;&lt; endl;   // 00001010 — auto 8 digits
    cout &lt;&lt; bitset&lt;4&gt;(10) &lt;&lt; endl;   // 1010 — 4 digits
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Decimal ↔ Binary Converter</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Enter a decimal number to see its binary, or click bits to toggle them!</p>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
                            <div style="display:flex;flex-direction:column;gap:4px;">
                                <label style="font-size:0.75rem;color:var(--text2);">Decimal</label>
                                <input type="number" id="bit-s1-dec" value="10" min="0" max="255" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;background:var(--card);color:var(--text);">
                            </div>
                            <span style="font-size:1.2rem;color:var(--accent);font-weight:700;">⇄</span>
                            <div style="display:flex;flex-direction:column;gap:4px;">
                                <label style="font-size:0.75rem;color:var(--text2);">Binary (8-bit)</label>
                                <div id="bit-s1-bits" style="display:flex;gap:2px;"></div>
                            </div>
                        </div>
                        <div id="bit-s1-calc" style="margin-top:8px;font-size:0.85rem;color:var(--text2);"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-s1-msg">Change the decimal or click bits to see the conversion process!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What is <code>0b11001</code> in decimal?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        The answer is <strong>25</strong>!
                        <code>1×16 + 1×8 + 0×4 + 0×2 + 1×1 = 25</code>.
                        Multiply each bit by its place value (1, 2, 4, 8, 16...) from right to left, then add them up.
                    </div>
                </div>
            </div>

            <!-- Section 2: Bitwise Operators -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> Bitwise Operators
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Bitwise operations are like <em>"flipping light switches according to rules"</em>!
                    AND means "both must be ON to stay ON", OR means "ON if at least one is ON",
                    and XOR means "ON only when they differ".
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="26" font-size="18" font-weight="bold" fill="var(--accent)">&amp;</text></svg>
                        </div>
                        <h3>AND (&)</h3>
                        <p>1 only if both are 1, else 0.<br><code>1010 & 1100 = 1000</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="10" y="26" font-size="18" font-weight="bold" fill="var(--green)">|</text></svg>
                        </div>
                        <h3>OR (|)</h3>
                        <p>1 if at least one is 1.<br><code>1010 | 1100 = 1110</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="8" y="26" font-size="18" font-weight="bold" fill="var(--yellow)">^</text></svg>
                        </div>
                        <h3>XOR (^)</h3>
                        <p>1 if they differ, 0 if they match.<br><code>1010 ^ 1100 = 0110</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="8" y="26" font-size="18" font-weight="bold" fill="var(--red, #e17055)">~</text></svg>
                        </div>
                        <h3>NOT (~)</h3>
                        <p>Flips 0 to 1 and 1 to 0.<br><code>~1010 = 0101</code> (bit inversion)<br>
                        <a href="https://en.wikipedia.org/wiki/Two%27s_complement" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Two's complement ↗</a></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="26" font-size="14" font-weight="bold" fill="var(--accent)">&lt;&lt;</text></svg>
                        </div>
                        <h3>Left Shift (&lt;&lt;)</h3>
                        <p>Shifts bits left and fills with 0s.<br><code>1 &lt;&lt; 3 = 1000₂ = 8</code> (×2<sup>n</sup>)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="26" font-size="14" font-weight="bold" fill="var(--green)">&gt;&gt;</text></svg>
                        </div>
                        <h3>Right Shift (&gt;&gt;)</h3>
                        <p>Shifts bits to the right.<br><code>8 &gt;&gt; 2 = 10₂ = 2</code> (÷2<sup>n</sup>)</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Bitwise operator examples
a = 0b1010  # 10
b = 0b1100  # 12

print(bin(a & b))   # '0b1000' → 8  (AND)
print(bin(a | b))   # '0b1110' → 14 (OR)
print(bin(a ^ b))   # '0b0110' → 6  (XOR)
print(bin(~a))      # '-0b1011'     (NOT, complement)

# Shift operations
print(1 << 3)       # 8  (shift 1 left by 3 → 2³)
print(16 >> 2)      # 4  (shift 16 right by 2 → 16÷4)</code></pre>
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
    cout &lt;&lt; bitset&lt;4&gt;(~a) &lt;&lt; endl;     // 0101     (NOT, inversion)

    // Shift operations
    cout &lt;&lt; (1 &lt;&lt; 3) &lt;&lt; endl;   // 8  (shift 1 left by 3 → 2³)
    cout &lt;&lt; (16 >> 2) &lt;&lt; endl;  // 4  (shift 16 right by 2 → 16÷4)
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Bit Operation Quiz</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Guess the result of the bit operation!</p>
                    <div class="concept-demo-body">
                        <div id="bit-s2-quiz" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;"></div>
                        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;" id="bit-s2-choices"></div>
                        <div id="bit-s2-feedback" style="margin-top:8px;text-align:center;font-size:0.9rem;min-height:1.5em;"></div>
                    </div>
                    <div style="margin-top:8px;text-align:center;"><button class="concept-demo-btn" id="bit-s2-new">🎲 New Problem</button></div>
                    <div class="concept-demo-msg" id="bit-s2-msg">Pick the correct answer to see a bit-by-bit explanation!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What is the result of <code>5 & 3</code>? Try solving it in binary!</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        The answer is <strong>1</strong>!
                        5 = <code>101</code>, 3 = <code>011</code>, so
                        <code>101 & 011 = 001</code> = 1. Only positions where both are 1 result in 1.
                    </div>
                </div>
            </div>

            <!-- Section 3: Bitmask -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> Bitmask
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> A bitmask is like a <em>"checklist"</em>!
                    If you have 5 items on a checklist, each slot is either checked (1) or unchecked (0).
                    For example, <code>10110</code> means items 1, 2, and 4 are completed.
                    This way, you can represent a <strong>set as a single integer</strong>!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">Check</text></svg>
                        </div>
                        <h3>Check i-th Bit</h3>
                        <p><code>num & (1 &lt;&lt; i)</code> checks if the i-th bit is 1. Non-zero means it's set!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--green)">Set</text></svg>
                        </div>
                        <h3>Set i-th Bit</h3>
                        <p><code>num | (1 &lt;&lt; i)</code> turns the i-th bit ON (to 1). Safe even if already 1.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">Toggle</text></svg>
                        </div>
                        <h3>Toggle i-th Bit</h3>
                        <p><code>num ^ (1 &lt;&lt; i)</code> flips the i-th bit. 0 becomes 1, 1 becomes 0.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--red, #e17055)">Clear</text></svg>
                        </div>
                        <h3>Clear i-th Bit</h3>
                        <p><code>num & ~(1 &lt;&lt; i)</code> turns the i-th bit OFF (to 0). Safe even if already 0.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Bitmask basic operations
S = 0b10110  # Set {1, 2, 4}

# Check i-th bit (check i=2)
print(bool(S & (1 << 2)))  # True — bit 2 is 1

# Set i-th bit (add i=0)
S = S | (1 << 0)
print(bin(S))  # '0b10111' — {0, 1, 2, 4}

# Toggle i-th bit (flip i=1)
S = S ^ (1 << 1)
print(bin(S))  # '0b10101' — {0, 2, 4}

# Clear i-th bit (remove i=2)
S = S & ~(1 << 2)
print(bin(S))  # '0b10001' — {0, 4}

# Full set (5 elements: {0,1,2,3,4})
ALL = (1 << 5) - 1  # 0b11111 = 31</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;bitset&gt;
using namespace std;

int main() {
    int S = 0b10110;  // Set {1, 2, 4}

    // Check i-th bit (check i=2)
    cout &lt;&lt; ((S & (1 &lt;&lt; 2)) != 0) &lt;&lt; endl;  // 1 — bit 2 is 1

    // Set i-th bit (add i=0)
    S = S | (1 &lt;&lt; 0);
    cout &lt;&lt; bitset&lt;5&gt;(S) &lt;&lt; endl;  // 10111 — {0, 1, 2, 4}

    // Toggle i-th bit (flip i=1)
    S = S ^ (1 &lt;&lt; 1);
    cout &lt;&lt; bitset&lt;5&gt;(S) &lt;&lt; endl;  // 10101 — {0, 2, 4}

    // Clear i-th bit (remove i=2)
    S = S & ~(1 &lt;&lt; 2);
    cout &lt;&lt; bitset&lt;5&gt;(S) &lt;&lt; endl;  // 10001 — {0, 4}

    // Full set (5 elements: {0,1,2,3,4})
    int ALL = (1 &lt;&lt; 5) - 1;  // 0b11111 = 31
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Bitmask Operations</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Add, remove, or toggle elements in a set and see the bitmask change!</p>
                    <div class="concept-demo-body">
                        <div style="margin-bottom:8px;font-size:0.85rem;">Current set: <strong id="bit-s3-set">{}</strong> = <code id="bit-s3-bin">00000</code> = <strong id="bit-s3-dec">0</strong></div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;" id="bit-s3-elems"></div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;">
                            <select id="bit-s3-op" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.85rem;background:var(--card);color:var(--text);">
                                <option value="add">Add (OR)</option>
                                <option value="remove">Remove (AND ~)</option>
                                <option value="toggle">Toggle (XOR)</option>
                                <option value="check">Check (AND)</option>
                            </select>
                            <select id="bit-s3-idx" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.85rem;background:var(--card);color:var(--text);">
                                <option>0</option><option>1</option><option>2</option><option>3</option><option>4</option>
                            </select>
                            <button class="concept-demo-btn" id="bit-s3-go">Run</button>
                            <button class="concept-demo-btn green" id="bit-s3-reset">↺</button>
                        </div>
                        <div id="bit-s3-log" style="margin-top:8px;font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-s3-msg">Choose an operation and element index, then click "Run"!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">How do you represent the set {0, 3, 4} as a bitmask? What is it in binary and decimal?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Binary: <strong>11001</strong>, Decimal: <strong>25</strong>!
                        Bit 0 (1) + Bit 3 (8) + Bit 4 (16) = 25.
                        You can create it with <code>1 | (1 &lt;&lt; 3) | (1 &lt;&lt; 4) = 25</code>.
                    </div>
                </div>
            </div>

            <!-- Section 4: XOR Magic -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> XOR Magic
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> XOR is like a <em>"pair matching game"</em>!
                    When you XOR the same number with itself, it cancels out (becomes 0), and only the unpaired number remains.
                    It's like pairing up students: the one left alone is the answer!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">a^a=0</text></svg>
                        </div>
                        <h3>XOR with Itself</h3>
                        <p>XOR of a number with itself is 0. All bits are the same, so the result is all zeros.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--green)">a^0=a</text></svg>
                        </div>
                        <h3>XOR with 0</h3>
                        <p>XOR of any number with 0 gives the number itself. 0 has no effect.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">Unique!</text></svg>
                        </div>
                        <h3>Find the Unique Number</h3>
                        <p>If every number appears twice except one, XOR them all and only the unique number remains!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--red, #e17055)">swap</text></svg>
                        </div>
                        <h3>XOR Swap</h3>
                        <p>Swap two variables without a temp variable: <code>a^=b; b^=a; a^=b;</code></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># XOR properties
print(7 ^ 7)    # 0 — XOR with itself = 0
print(7 ^ 0)    # 7 — XOR with 0 = itself

# Find the unique number (Single Number)
nums = [2, 3, 1, 3, 2]
result = 0
for n in nums:
    result ^= n     # 2^3^1^3^2 = (2^2)^(3^3)^1 = 0^0^1 = 1
print(result)       # 1 — the unpaired number!

# XOR swap (no temp variable!)
a, b = 5, 10
a ^= b    # a = 5^10
b ^= a    # b = 10^(5^10) = 5
a ^= b    # a = (5^10)^5 = 10
print(a, b)  # 10, 5

# n & (n-1): remove the lowest set bit
n = 0b10110  # 22
print(bin(n & (n - 1)))  # '0b10100' → 20 (lowest 1 bit removed!)</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;bitset&gt;
using namespace std;

int main() {
    // XOR properties
    cout &lt;&lt; (7 ^ 7) &lt;&lt; endl;    // 0 — XOR with itself = 0
    cout &lt;&lt; (7 ^ 0) &lt;&lt; endl;    // 7 — XOR with 0 = itself

    // Find the unique number (Single Number)
    int nums[] = {2, 3, 1, 3, 2};
    int result = 0;
    for (int n : nums)
        result ^= n;     // 2^3^1^3^2 = (2^2)^(3^3)^1 = 0^0^1 = 1
    cout &lt;&lt; result &lt;&lt; endl;  // 1 — the unpaired number!

    // XOR swap (no temp variable!)
    int a = 5, b = 10;
    a ^= b;    // a = 5^10
    b ^= a;    // b = 10^(5^10) = 5
    a ^= b;    // a = (5^10)^5 = 10
    cout &lt;&lt; a &lt;&lt; " " &lt;&lt; b &lt;&lt; endl;  // 10, 5

    // n & (n-1): remove the lowest set bit
    int n = 0b10110;  // 22
    cout &lt;&lt; bitset&lt;5&gt;(n & (n - 1)) &lt;&lt; endl;  // 10100 → 20 (lowest 1 bit removed!)
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — XOR Properties</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">XOR two numbers and see what happens. Try the same number twice!</p>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;">
                            <input type="number" id="bit-s4-a" value="7" min="0" max="255" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:60px;background:var(--card);color:var(--text);">
                            <span style="font-weight:700;color:var(--yellow);">^</span>
                            <input type="number" id="bit-s4-b" value="7" min="0" max="255" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:60px;background:var(--card);color:var(--text);">
                            <span style="font-weight:700;">=</span>
                            <span id="bit-s4-result" style="font-weight:700;font-size:1.1rem;color:var(--accent);"></span>
                            <button class="concept-demo-btn" id="bit-s4-calc">Calculate</button>
                        </div>
                        <div id="bit-s4-detail" style="font-size:0.85rem;color:var(--text2);font-family:monospace;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-s4-msg">Try same numbers (7^7) → 0! Then try different numbers!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What is the result of XORing all elements in [4, 1, 2, 1, 2]?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        The answer is <strong>4</strong>!
                        <code>4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4</code>.
                        The paired numbers 1 and 2 cancel out, leaving only the unpaired number 4.
                    </div>
                </div>
            </div>

            <!-- Section 5: Demo — Binary Conversion -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">5</span> Demo: Decimal → Binary Conversion
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Division by 2 animation</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="number" id="bit-demo-conv-input" value="42" min="0" max="255" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:80px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="bit-demo-conv-btn">⚙️ Start Conversion</button>
                        <button class="concept-demo-btn green" id="bit-demo-conv-reset" style="display:none;">↺ Again</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="bit-demo-conv-steps" style="font-family:monospace;font-size:0.9rem;color:var(--text);line-height:2;"></div>
                        <div id="bit-demo-conv-result" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-demo-conv-msg">👆 Enter a number and click "Start Conversion"! Watch how repeatedly dividing by 2 and collecting remainders builds the binary representation.</div>
                </div>
            </div>

            <!-- Section 6: Demo — Bitwise Operation Visualization -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">6</span> Demo: Bitwise Operation Visualization
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — AND, OR, XOR, NOT, Shift</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="number" id="bit-demo-op-a" value="10" min="0" max="255" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:70px;background:var(--card);color:var(--text);">
                        <select id="bit-demo-op-sel" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--card);color:var(--text);">
                            <option value="and">AND (&)</option>
                            <option value="or">OR (|)</option>
                            <option value="xor">XOR (^)</option>
                            <option value="not">NOT (~)</option>
                            <option value="shl">Left Shift (<<)</option>
                            <option value="shr">Right Shift (>>)</option>
                        </select>
                        <input type="number" id="bit-demo-op-b" value="12" min="0" max="255" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:70px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="bit-demo-op-btn">⚡ Calculate</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="bit-demo-op-viz" style="font-family:monospace;font-size:0.95rem;line-height:2;color:var(--text);"></div>
                        <div id="bit-demo-op-result" style="margin-top:8px;font-size:0.9rem;color:var(--text2);"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-demo-op-msg">👆 Choose two numbers and an operation, then click "Calculate"! See how it works bit by bit.</div>
                </div>
            </div>

            <!-- Section 7: Demo — Bitmask Set -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">7</span> Demo: Bitmask = Set
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Toggle bits to add/remove elements</div>
                    <div style="margin-bottom:12px;">
                        <div id="bit-demo-mask-bits" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;"></div>
                        <div id="bit-demo-mask-info" style="font-size:0.9rem;color:var(--text2);margin-bottom:8px;font-family:monospace;"></div>
                        <div id="bit-demo-mask-set" style="font-size:0.9rem;color:var(--text);padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-demo-mask-msg">👆 Click bits to toggle them on and off! The position of each ON bit represents an element in the set.</div>
                </div>
            </div>

            <!-- Section 8: Demo — XOR Unpaired Number -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">8</span> Demo: Find the Unpaired Number with XOR
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — XOR all numbers and the unpaired one remains</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <input type="text" id="bit-demo-xor-input" value="4,1,2,1,2" placeholder="Comma-separated numbers" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:180px;background:var(--card);color:var(--text);">
                        <button class="concept-demo-btn" id="bit-demo-xor-btn">Step ▶</button>
                        <button class="concept-demo-btn green" id="bit-demo-xor-reset">Reset ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="bit-demo-xor-arr" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>
                        <div id="bit-demo-xor-steps" style="font-family:monospace;font-size:0.9rem;color:var(--text);line-height:2;"></div>
                        <div id="bit-demo-xor-result" style="margin-top:8px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bit-demo-xor-msg">👆 Change the numbers and click "Step" to advance one step at a time! Paired numbers cancel out and only the unpaired one remains.</div>
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
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // ====== Section 1 demo: Decimal ↔ Binary converter ======
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

        // ====== Section 2 demo: Bit operation quiz ======
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
                            feedbackEl.innerHTML = '<span style="color:var(--green);font-weight:700;">Correct!</span> ' + pad4(a) + ' ' + opNames[op] + ' ' + pad4(b) + ' = ' + pad4(ans) + ' (' + ans + ')';
                        } else {
                            feedbackEl.innerHTML = '<span style="color:var(--red);">Wrong!</span> The answer is <strong>' + ans + '</strong>.';
                        }
                    });
                    choicesEl.appendChild(btn);
                });
            }
            genQuiz();
            newBtn.addEventListener('click', genQuiz);
        })();

        // ====== Section 3 demo: Bitmask operations ======
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
                if (op === 'add') { S = S | (1 << idx); logEl.innerHTML = 'S | (1<<' + idx + ') — element ' + idx + ' added!'; }
                else if (op === 'remove') { S = S & ~(1 << idx); logEl.innerHTML = 'S & ~(1<<' + idx + ') — element ' + idx + ' removed!'; }
                else if (op === 'toggle') { S = S ^ (1 << idx); logEl.innerHTML = 'S ^ (1<<' + idx + ') — element ' + idx + ' toggled!'; }
                else { logEl.innerHTML = 'S & (1<<' + idx + ') = ' + (S & (1<<idx)) + ' — element ' + idx + (S & (1<<idx) ? ' exists!' : ' not found!'); return; }
                render();
            });
            container.querySelector('#bit-s3-reset').addEventListener('click', function() { S = 0; render(); logEl.textContent = ''; });
        })();

        // ====== Section 4 demo: XOR properties ======
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
                    (a === b ? '<br><span style="color:var(--green);">Same numbers XOR → 0!</span>' : '');
            }
            doCalc();
            calcBtn.addEventListener('click', doCalc);
        })();

        // ====== Demo 1: Binary Conversion ======
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
                    stepsEl.innerHTML = '<div>0 in binary is also <strong>0</strong>!</div>';
                    resultEl.innerHTML = '<strong>Result:</strong> 0 → <strong style="color:var(--green);">0</strong>';
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
                        resultEl.innerHTML = '<strong>Result:</strong> ' + num + ' → <strong style="color:var(--green);">' + binary + '</strong> (read the remainders from bottom to top!)';
                        animating = false;
                        return;
                    }
                    var s = steps[idx];
                    var line = document.createElement('div');
                    line.style.animation = 'fadeIn 0.3s ease';
                    line.innerHTML = s.n + ' \u00F7 2 = ' + s.q + ' ... <strong style="color:var(--accent);">remainder ' + s.r + '</strong>';
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

        // ====== Demo 2: Bitwise Operation Visualization ======
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

                lines.push('&nbsp;&nbsp;' + colorBits(bitsA, hA) + '  \u2190 ' + a);
                if (showB && (op !== 'shl' && op !== 'shr')) {
                    lines.push(opSymbol + ' ' + colorBits(bitsB, hB) + '  \u2190 ' + b);
                } else if (op === 'shl' || op === 'shr') {
                    lines.push(opSymbol + ' ' + b + ' positions');
                } else {
                    lines.push(opSymbol);
                }
                lines.push('\u2500'.repeat(bits + 2));
                lines.push('= ' + colorBits(bitsR, hR) + '  \u2190 <strong>' + result + '</strong>');

                vizEl.innerHTML = lines.map(function(l) { return '<div>' + l + '</div>'; }).join('');

                var explanations = {
                    and: 'Only positions where both are 1 become 1.',
                    or: 'If at least one is 1, the result is 1.',
                    xor: 'Only positions where they differ become 1.',
                    not: '0s and 1s are flipped. (8-bit basis)',
                    shl: 'Bits shifted left by ' + b + ' position(s), effectively \u00D72' + (b > 1 ? '^' + b : '') + '.',
                    shr: 'Bits shifted right by ' + b + ' position(s), effectively \u00F72' + (b > 1 ? '^' + b : '') + '.'
                };
                resultEl.textContent = explanations[op];
            });
        })();

        // ====== Demo 3: Bitmask Set ======
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

                infoEl.textContent = 'Binary: ' + (mask >>> 0).toString(2).padStart(BITS, '0') + ' | Decimal: ' + mask;

                var elements = [];
                for (var i = 0; i < BITS; i++) {
                    if ((mask >> i) & 1) elements.push(i);
                }
                setEl.innerHTML = 'Set: <strong>{' + (elements.length ? elements.join(', ') : 'empty') + '}</strong>' +
                    ' | Size: ' + elements.length;
            }
            render();
        })();

        // ====== Demo 4: XOR Unpaired Number ======
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
                if (nums.length < 2) { resultEl.textContent = 'Please enter at least 2 numbers!'; return false; }
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
                    resultEl.innerHTML = '<strong style="color:var(--green);">Unpaired number: ' + xorState.xorVal + '</strong> — Paired numbers cancel out via XOR, leaving only the unique one!';
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

    // ===== Visualization Tab =====
    renderVisualize(container) {
        var self = this;
        self._clearVizState();
        var suffix = 'concept-bit';

        container.innerHTML =
            '<div class="hero" style="padding-bottom:12px;">' +
            '<h2>Visualizing XOR to Find the Unique Number</h2>' +
            '<p class="hero-sub">Let\'s see step by step how XORing all elements leaves only the unpaired number.</p>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: ' +
            '<input type="text" id="bit-viz-input-' + suffix + '" value="4, 1, 2, 1, 2, 3, 4" ' +
            'style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;">' +
            '</label>' +
            '<button class="btn btn-primary" id="bit-viz-start-' + suffix + '">Start</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div class="graph-svg-container" style="min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">' +
            '<div id="bit-array-display-' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="bit-xor-display-' + suffix + '" style="display:flex;flex-direction:column;align-items:center;gap:10px;width:100%;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:150px;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Status</div>' +
            '<div id="bit-status-' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">Press Start</div>' +
            '</div></div>' +
            self._createStepControls(suffix) +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> Waiting</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> Currently XORing</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> Processed</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(108,92,231,0.3);border:2px solid var(--accent);vertical-align:middle;"></span> Changed bits</span>' +
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
                statusEl.innerHTML = '<span style="color:var(--red,#e17055);">Please enter numbers!</span>';
                return;
            }

            renderArrayBoxes(nums);
            xorDisplay.innerHTML = '';
            statusEl.innerHTML = 'Ready';

            var steps = [];
            var runningXor = 0;

            steps.push({
                description: 'Start with result = 0. Since <em>0 is the identity element of XOR</em> (a ^ 0 = a), XORing with any number returns that number itself.',
                _before: null,
                action: function() {
                    this._before = saveState();
                    xorDisplay.innerHTML = renderBitRow('result = 0', 0, null);
                    statusEl.innerHTML = 'Initialized result to 0.';
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
                        description: 'result ^= ' + num + ': XOR yields 0 for matching bits, 1 for differing bits. ' + prevXor + ' ^ ' + num + ' = <strong>' + newXor + '</strong> — paired numbers cancel out (a ^ a = 0), leaving only the unpaired one.',
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
                            statusEl.innerHTML = 'result ^= ' + num + ' → <strong>' + newXor + '</strong> (binary: ' + newBin + ')';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                })(i, num, prevXor, newXor, prevBin, numBin, newBin, changedBits);

                runningXor = newXor;
            }

            var finalResult = runningXor;
            steps.push({
                description: 'Done! Paired numbers cancelled out via a ^ a = 0, leaving only the unpaired number <strong>' + finalResult + '</strong>.',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < nums.length; j++) setArrayBoxState(j, 'matched');
                    var html = renderBitRow('Final result', finalResult, null);
                    xorDisplay.innerHTML = html;
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.2rem;">✓ The unpaired number is <strong>' + finalResult + '</strong>!</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            self._initStepController(container, steps, suffix);
        });
    },

    // ===== Visualization State Management =====
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
    // Simulation 1: Number of 1 Bits (lc-191)
    // ====================================================================
    _renderVizHammingWeight(container) {
        var self = this, suffix = '-hw1';
        var DEFAULT_N = 11;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Counting 1-bits with the n & (n-1) trick</h3>' +
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
                        description: '<strong>n & (n-1)</strong> clears the lowest set bit. n=' + prev + ' (' + prevBin + ') AND (n-1)=' + (prev - 1) + ' (' + prevMinusBin + ') turns off the rightmost 1-bit, giving ' + next + ' (' + nextBin + '). → count=' + count,
                        action: function() { renderBits(next, removedBit, numBits); infoEl.innerHTML = 'n = ' + prev + ' & ' + (prev - 1) + ' = <strong>' + next + '</strong> — count = <strong>' + count + '</strong>'; },
                        undo: function() { renderBits(prev, -1, numBits); infoEl.innerHTML = '<span style="color:var(--text2);">n = ' + prev + ', count = ' + (count - 1) + '</span>'; }
                    });
                })(prev, next, count, removedBit, prevBin, prevMinusBin, nextBin, numBits);
                cur = next;
            }
            var finalCount = count;
            steps.push({
                description: 'Done! n is 0, meaning there are no more 1-bits to clear. The number of times we applied <strong>n & (n-1)</strong> = <strong>' + finalCount + '</strong> is the 1-bit count.',
                action: function() { renderBits(0, -1, numBits); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Number of 1-bits = ' + finalCount + '</strong>'; },
                undo: function() { renderBits(0, -1, numBits); infoEl.innerHTML = 'n = 0, count = ' + finalCount; }
            });
            return steps;
        }

        function initSim(n) {
            descEl.innerHTML = 'Counting the number of 1-bits in n = ' + n + ' (binary: ' + (n >>> 0).toString(2) + '). <em>n & (n-1)</em> removes one 1-bit each time, so the iteration count equals the 1-bit count.';
            var numBits = Math.max(8, (n >>> 0).toString(2).length);
            renderBits(n, -1, numBits);
            infoEl.innerHTML = '<span style="color:var(--text2);">n = ' + n + ', count = 0 — repeatedly applying n & (n-1).</span>';
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
    // Simulation 2: Single Number — XOR (lc-136)
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
            '<h3 style="margin-bottom:8px;">Finding the unpaired number with XOR</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="bit-single-input" value="' + DEFAULT_NUMS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
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
                description: 'Start with result = 0. Since <em>0 is the identity element of XOR</em> (a ^ 0 = a), XORing with any number returns that number itself.',
                _before: null,
                action: function() { this._before = saveState(); xorEl.innerHTML = renderBitRow('result = 0', 0, null); infoEl.innerHTML = 'Initialized result to 0.'; },
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
                        description: 'result ^= ' + num + ': XOR yields 0 for matching bits, 1 for differing bits. ' + prevXor + ' ^ ' + num + ' = <strong>' + newXor + '</strong> — paired numbers cancel out, leaving only the unpaired one.',
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
                description: 'Done! All paired numbers cancelled out via a ^ a = 0, leaving only the unpaired number <strong>' + finalResult + '</strong>.',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < numsLen; j++) setArrState(j, 'matched');
                    xorEl.innerHTML = renderBitRow('Final result', finalResult, null);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Unpaired number = ' + finalResult + '</strong>';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        function initSim(nums) {
            descEl.textContent = 'XOR all elements of array [' + nums.join(', ') + '].';
            renderArrayBoxes(nums);
            xorEl.innerHTML = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting with result = 0.</span>';
            var steps = buildSteps(nums);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#bit-single-reset').addEventListener('click', function() {
            self._clearVizState();
            var raw = container.querySelector('#bit-single-input').value;
            var nums = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (nums.length === 0) {
                infoEl.innerHTML = '<span style="color:var(--red,#e17055);">Please enter numbers! (e.g., 2, 3, 1, 3, 2)</span>';
                return;
            }
            initSim(nums);
        });

        var defaultNums = DEFAULT_NUMS.split(',').map(function(s) { return parseInt(s.trim(), 10); });
        initSim(defaultNums);
    },

    // ====================================================================
    // Simulation 3: Bitmask Set (boj-11723)
    // ====================================================================
    _renderVizBitmaskSet(container) {
        var self = this, suffix = '-bms';
        var DEFAULT_OPS = 'add 1, add 2, check 1, toggle 3, remove 2, all, check 10, empty';
        var SHOW_BITS = 8;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Set operations with bitmasks</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Operations: <input type="text" id="bit-mask-input" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:400px;"></label>' +
            '<button class="btn btn-primary" id="bit-mask-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-top:-12px;margin-bottom:16px;">Format: add N, remove N, check N, toggle N, all, empty (comma-separated)</p>' +
            self._createStepDesc(suffix) +
            '<p id="bms-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;">Represent a set with a single integer and perform add/remove/toggle/check operations.</p>' +
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
            setEl.textContent = 'S = {' + elems.join(', ') + '} (integer: ' + S + ')';
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
                    desc = 'add ' + op.x + ': OR turns on a specific bit. <code>1 &lt;&lt; ' + op.x + '</code> creates a mask with only bit ' + op.x + ' set, so OR <strong>preserves all other bits</strong> while setting bit ' + op.x + ' to 1. → S = ' + newS;
                    hlBit = op.x;
                    infoText = 'add ' + op.x + ': S |= (1 &lt;&lt; ' + op.x + ') — OR: 0|1=1, so only bit ' + op.x + ' turns on';
                } else if (op.cmd === 'remove') {
                    newS = S & ~(1 << op.x);
                    desc = 'remove ' + op.x + ': NOT flips the mask, then AND clears the bit. <code>~(1 &lt;&lt; ' + op.x + ')</code> is 0 only at bit ' + op.x + ' and 1 everywhere else, so AND <strong>clears only bit ' + op.x + '</strong> while preserving the rest. → S = ' + newS;
                    hlBit = op.x;
                    infoText = 'remove ' + op.x + ': S &= ~(1 &lt;&lt; ' + op.x + ') — AND: 1&0=0, so only bit ' + op.x + ' cleared';
                } else if (op.cmd === 'toggle') {
                    newS = S ^ (1 << op.x);
                    desc = 'toggle ' + op.x + ': XOR yields 0 for matching bits and 1 for differing bits, so it <strong>flips</strong> the current value. If bit ' + op.x + ' was 1, it becomes 0; if 0, it becomes 1. → S = ' + newS;
                    hlBit = op.x;
                    infoText = 'toggle ' + op.x + ': S ^= (1 &lt;&lt; ' + op.x + ') — XOR: 1^1=0, 0^1=1, so bit flips';
                } else if (op.cmd === 'check') {
                    var result = (S >> op.x) & 1;
                    newS = S;
                    desc = 'check ' + op.x + ': Right-shift by ' + op.x + ' moves bit ' + op.x + ' to the lowest position, then <code>& 1</code> extracts just that bit. → ' + result + ' (' + (result ? 'present in set' : 'absent from set') + ')';
                    hlBit = op.x < showBits ? op.x : -1;
                    infoText = 'check ' + op.x + ' → <strong>' + result + '</strong> — shift then AND 1 to extract a specific bit (' + (result ? 'present' : 'absent') + ')';
                } else if (op.cmd === 'all') {
                    newS = (1 << showBits) - 1;
                    desc = 'all: <code>(1 &lt;&lt; ' + showBits + ') - 1</code> produces a number with all lower ' + showBits + ' bits set to 1. This means elements 0 through ' + (showBits-1) + ' are all included in the set. → S = ' + newS;
                    infoText = 'all: 2<sup>' + showBits + '</sup>-1 = ' + newS + ' → all bits are 1 (full set)';
                } else if (op.cmd === 'empty') {
                    newS = 0;
                    desc = 'empty: Setting S to 0 clears all bits, representing the <strong>empty set</strong>. In bitmask representation, 0 means no elements are included.';
                    infoText = 'empty: S = 0 → all bits cleared (empty set)';
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting with S = 0 (empty set).</span>';
            self._initStepController(container, result.steps, suffix);
        }

        container.querySelector('#bit-mask-reset').addEventListener('click', function() {
            self._clearVizState();
            var raw = container.querySelector('#bit-mask-input').value;
            var ops = parseOps(raw);
            if (ops.length === 0) {
                infoEl.innerHTML = '<span style="color:var(--red,#e17055);">Please enter operations! (e.g., add 1, add 3, check 1)</span>';
                return;
            }
            initSim(ops);
        });

        initSim(parseOps(DEFAULT_OPS));
    },

    // ====================================================================
    // Simulation 4: Subset Enumeration (lc-78)
    // ====================================================================
    _renderVizSubsets(container) {
        var self = this, suffix = '-sub';
        var DEFAULT_NUMS = '1, 2, 3';
        var MAX_ELEMENTS = 6;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Enumerating subsets with bitmasks</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="bit-subset-input" value="' + DEFAULT_NUMS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
            '<button class="btn btn-primary" id="bit-subset-reset">🔄</button>' +
            '<span style="font-size:0.8rem;color:var(--text3);">Max ' + MAX_ELEMENTS + ' elements</span>' +
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
                        description: 'mask = ' + mask + ' (' + maskBin + '): Each bit decides whether to <strong>include (1) or exclude (0)</strong> the element at that position. → Subset: [' + subset.join(', ') + ']',
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
                            infoEl.innerHTML = '<span style="color:var(--text2);">mask = 0 ~ ' + ((1 << n) - 1) + ' iterating through masks.</span>';
                        }
                    });
                })(mask, subset, maskBin, collectedSubsets.slice(), nums, n);
                collectedSubsets.push(subset);
            }

            // Reset collectedSubsets for interactivity
            collectedSubsets = [];

            var total = (1 << n);
            steps.push({
                description: 'Done! An array of n elements has 2<sup>n</sup> = <strong>' + total + '</strong> subsets. Each integer from 0 to 2<sup>n</sup>-1 maps to exactly one subset, so bitmasks enumerate them all without missing any.',
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
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ All ' + total + ' subsets enumerated!</strong>';
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
            descEl.textContent = 'Enumerate all subsets of nums = [' + nums.join(', ') + '] using bitmasks 0 to ' + ((1 << n) - 1) + '.';
            renderMask(0, n);
            renderArr(0, nums);
            resultEl.innerHTML = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">mask = 0 ~ ' + ((1 << n) - 1) + ' generating subsets.</span>';
            var steps = buildSteps(nums);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#bit-subset-reset').addEventListener('click', function() {
            self._clearVizState();
            var raw = container.querySelector('#bit-subset-input').value;
            var nums = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (nums.length === 0) {
                infoEl.innerHTML = '<span style="color:var(--red,#e17055);">Please enter numbers! (e.g., 1, 2, 3)</span>';
                return;
            }
            if (nums.length > MAX_ELEMENTS) {
                nums = nums.slice(0, MAX_ELEMENTS);
                container.querySelector('#bit-subset-input').value = nums.join(', ');
                infoEl.innerHTML = '<span style="color:var(--yellow);">Exceeded ' + MAX_ELEMENTS + ' elements. Only the first ' + MAX_ELEMENTS + ' will be used.</span>';
            }
            initSim(nums);
        });

        var defaultNums = DEFAULT_NUMS.split(',').map(function(s) { return parseInt(s.trim(), 10); });
        initSim(defaultNums);
    },

    // ===== Problem List =====
    stages: [
        {
            num: 1,
            title: 'Basic Bit Operations',
            desc: 'Fundamentals of bit operations and XOR usage (Easy)',
            problemIds: ['lc-191', 'lc-136']
        },
        {
            num: 2,
            title: 'Bitmask Applications',
            desc: 'Using bitmasks to handle sets and subsets (Silver~Medium)',
            problemIds: ['boj-11723', 'lc-78']
        }
    ],

    problems: [
        // ===== Stage 1: Basic Bit Operations =====
        {
            id: 'lc-191',
            title: 'LeetCode 191 - Number of 1 Bits',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/number-of-1-bits/',
            simIntro: 'Observe how the n & (n-1) trick removes one set bit at a time.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a positive integer <code>n</code>, return the number of set bits (1-bits) in its binary representation (also known as the Hamming weight).</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>n = 11</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div><p>The binary representation of 11 is 1011, which has 3 set bits.</p></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>n = 128</pre></div>
                    <div><strong>Output</strong><pre>1</pre></div>
                </div><p>The binary representation of 128 is 10000000, which has 1 set bit.</p></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>n = 2147483645</pre></div>
                    <div><strong>Output</strong><pre>30</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 &le; n &le; 2<sup>31</sup> - 1</li></ul>
                <h4>Follow-up</h4>
                <p>If this function is called many times, how would you optimize it?</p>
            `,
            hints: [
                {
                    title: 'First intuition',
                    content: 'We need to count the number of 1s in binary... how about checking each bit one by one?<br><br>Starting from the rightmost bit, use <code>&amp; 1</code> to check if it is 1, then right-shift (<code>&gt;&gt; 1</code>) to move to the next bit.<br>For a 32-bit integer, just repeat 32 times!'
                },
                {
                    title: 'But there is a downside',
                    content: 'Looping 32 times is not exactly slow, but what if there are only 2 set bits and we still loop 32 times?<br><br>For example, <code>10000000 00000000 00000000 00000001</code> has only 2 ones, yet we check all 30 zeros too. Is there a way to <strong>loop only as many times as there are set bits</strong>?'
                },
                {
                    title: 'What if we try this?',
                    content: 'There is a magical trick: <code>n &amp; (n-1)</code> removes exactly <strong>the lowest set bit</strong>!<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-family:monospace;font-size:0.9em;"><div style="margin-bottom:10px;font-weight:600;font-family:inherit;text-align:center;">How n &amp; (n-1) works</div><div style="display:flex;flex-direction:column;gap:4px;align-items:center;"><div style="display:flex;gap:4px;"><span style="color:var(--text2);width:70px;text-align:right;">n&nbsp;&nbsp;=</span> <span style="padding:2px 4px;background:var(--accent);color:#fff;border-radius:3px;">1</span><span style="padding:2px 4px;background:var(--accent);color:#fff;border-radius:3px;">1</span><span style="padding:2px 4px;background:var(--yellow);color:#000;border-radius:3px;font-weight:700;">0</span><span style="padding:2px 4px;background:var(--yellow);color:#000;border-radius:3px;font-weight:700;">0</span></div><div style="display:flex;gap:4px;"><span style="color:var(--text2);width:70px;text-align:right;">n-1 =</span> <span style="padding:2px 4px;background:var(--accent);color:#fff;border-radius:3px;">1</span><span style="padding:2px 4px;background:var(--red);color:#fff;border-radius:3px;">0</span><span style="padding:2px 4px;background:var(--red);color:#fff;border-radius:3px;">1</span><span style="padding:2px 4px;background:var(--red);color:#fff;border-radius:3px;">1</span></div><div style="border-top:2px solid var(--text2);width:180px;margin:4px 0;"></div><div style="display:flex;gap:4px;"><span style="color:var(--text2);width:70px;text-align:right;">AND =</span> <span style="padding:2px 4px;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">1</span><span style="padding:2px 4px;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">0</span><span style="padding:2px 4px;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">0</span><span style="padding:2px 4px;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">0</span></div></div><div style="text-align:center;margin-top:6px;color:var(--green);font-weight:600;font-family:inherit;">Lowest set bit removed!</div></div>Why does this work? <code>n-1</code> flips the lowest set bit to 0 and turns all bits below it to 1.<br>Repeat this <strong>until n becomes 0</strong>, and the number of iterations = the number of set bits! This runs in O(k) where k = number of 1s.'
                },
                {
                    title: 'In Python/C++!',
                    content: 'Now that you understand the principle, there are also built-in functions:<br><br><span class="lang-py">Python: <code>bin(n).count("1")</code> — convert to binary string and count the "1"s in one line!</span><span class="lang-cpp">C++: <code>__builtin_popcount(n)</code> — a GCC built-in that directly returns the number of set bits!</span><br><br>However, in interviews you are expected to implement the <code>n &amp; (n-1)</code> trick yourself, so know both approaches!'
                }
            ],
            templates: {
                python: 'class Solution:\n    def hammingWeight(self, n: int) -> int:\n        # Approach 1: n & (n-1) trick\n        count = 0\n        while n:\n            n &= (n - 1)  # Remove the lowest set bit\n            count += 1\n        return count\n\n    # Approach 2: Simple method\n    # def hammingWeight(self, n: int) -> int:\n    #     return bin(n).count(\'1\')',
                cpp: 'class Solution {\npublic:\n    int hammingWeight(int n) {\n        int count = 0;\n        while (n) {\n            n &= (n - 1);  // Remove the lowest set bit\n            count++;\n        }\n        return count;\n    }\n};'
            },
            solutions: [{
                approach: 'n & (n-1) Trick',
                description: 'Use n & (n-1) to remove the lowest set bit one at a time and count.',
                timeComplexity: 'O(k) (k = number of set bits)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: 'Initialize', desc: 'Prepare a counter to count the number of set bits.', code: 'count = 0' },
                        { title: 'n & (n-1) Loop', desc: 'n & (n-1) is a trick that removes the lowest set bit.\nRepeat until all bits become 0 to find the count of 1s.', code: 'while n:\n    n &= (n - 1)  # Remove the lowest set bit\n    count += 1' },
                        { title: 'Return Result', desc: 'The number of removals equals the number of set bits, so return it directly.', code: 'return count' }
                    ],
                    cpp: [
                        { title: 'Initialize', desc: 'Declare counter as int. Using unsigned int avoids negative number handling.', code: 'int count = 0;' },
                        { title: 'n & (n-1) Loop', desc: 'n &= (n-1) removes the lowest set bit.\nRepeat until n becomes 0.', code: 'while (n) {\n    n &= (n - 1);  // Remove the lowest set bit\n    count++;\n}' },
                        { title: 'Return Result', desc: 'You could also use __builtin_popcount(n) as a one-liner,\nbut understanding the trick itself is what matters.', code: 'return count;\n// One-liner: return __builtin_popcount(n);' }
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
            simIntro: 'Observe how XOR traverses all elements to find the unpaired number.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a non-empty array of integers <code>nums</code>, every element appears twice except for one. Find that single one.</p>
                <p>You must implement a solution with a linear runtime complexity and use only constant extra space.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [2,2,1]</pre></div>
                    <div><strong>Output</strong><pre>1</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [4,1,2,1,2]</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [1]</pre></div>
                    <div><strong>Output</strong><pre>1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; nums.length &le; 3 &times; 10<sup>4</sup></li>
                    <li>-3 &times; 10<sup>4</sup> &le; nums[i] &le; 3 &times; 10<sup>4</sup></li>
                    <li>Each element appears exactly twice, except for one element which appears once</li>
                </ul>
            `,
            hints: [
                {
                    title: 'First intuition',
                    content: 'If every element appears twice and only one appears once... how about counting how many times each number appears?<br><br>Use a dictionary (hash map) to count frequencies, then find the number that appears only once. Solved in O(n) time!'
                },
                {
                    title: 'But there\'s a problem with this',
                    content: 'The dictionary approach works well, but look at the constraints again: <strong>"use only constant extra space"</strong>.<br><br>A dictionary uses O(n) space, so it does not meet the requirement. Sorting and comparing adjacent elements is O(n log n), which is also not ideal. Is there a way to solve it in <strong>O(n) time + O(1) space</strong>?'
                },
                {
                    title: 'What if we try this?',
                    content: 'Recall two key properties of XOR (^):<br><br>1. <code>a ^ a = 0</code> — XOR of the same number is 0!<br>2. <code>a ^ 0 = a</code> — XOR with 0 gives the number itself!<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">XOR accumulation: [4, 1, 2, 1, 2]</div><div style="display:flex;flex-direction:column;gap:4px;align-items:center;font-family:monospace;"><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">0 ^ <strong>4</strong> =</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">4 (100)</span></div><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">4 ^ <strong>1</strong> =</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">5 (101)</span></div><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">5 ^ <strong>2</strong> =</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">7 (111)</span></div><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">7 ^ <strong>1</strong> =</span><span style="padding:3px 10px;background:var(--yellow);color:#000;border-radius:4px;">6 (110)</span><span style="color:var(--text2);font-size:0.85em;">← 1 cancelled!</span></div><div style="display:flex;gap:8px;align-items:center;"><span style="color:var(--text2);width:100px;text-align:right;">6 ^ <strong>2</strong> =</span><span style="padding:3px 10px;background:var(--green);color:#fff;border-radius:4px;font-weight:700;">4 (100)</span><span style="color:var(--text2);font-size:0.85em;">← 2 cancelled! Only 4 remains</span></div></div></div>So what if we <strong>XOR all elements</strong> in the array?<br>Numbers appearing twice cancel out to 0, and only the single number remains!'
                },
                {
                    title: 'In Python/C++!',
                    content: '<span class="lang-py">Python: <code>functools.reduce(lambda a, b: a ^ b, nums)</code> lets you XOR everything in one line!<br><code>reduce</code> is a function that collapses a list into a single value.</span><span class="lang-cpp">C++: <code>accumulate(nums.begin(), nums.end(), 0, bit_xor&lt;int&gt;())</code> gives you a one-liner solution!<br>Requires the <code>&lt;numeric&gt;</code> and <code>&lt;functional&gt;</code> headers.</span>'
                }
            ],
            templates: {
                python: 'class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        result = 0\n        for n in nums:\n            result ^= n  # Pairs cancel out, only the single one remains\n        return result\n\n    # One-liner:\n    # from functools import reduce\n    # def singleNumber(self, nums): return reduce(lambda a,b: a^b, nums)',
                cpp: 'class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int result = 0;\n        for (int n : nums) {\n            result ^= n;  // Pairs cancel out\n        }\n        return result;\n    }\n};'
            },
            solutions: [{
                approach: 'XOR Full Traversal',
                description: 'XOR all elements together — paired numbers cancel out, leaving only the unique one.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: 'Initialize', desc: 'Start result at 0.\nSince a ^ 0 = a, 0 is the identity element for XOR.', code: 'result = 0' },
                        { title: 'XOR All', desc: 'Since a ^ a = 0, numbers appearing twice cancel out.\nOnly the number appearing once remains.', code: 'for n in nums:\n    result ^= n  # Pairs cancel out' },
                        { title: 'Return Result', desc: 'Found the unique number in O(n) time and O(1) space.', code: 'return result' }
                    ],
                    cpp: [
                        { title: 'Initialize', desc: 'Start with 0, the identity element for XOR.', code: 'int result = 0;' },
                        { title: 'XOR All', desc: 'Use range-based for loop for conciseness.\na ^ a = 0, so paired numbers cancel out.', code: 'for (int n : nums) {\n    result ^= n;  // Pairs cancel out\n}' },
                        { title: 'Return Result', desc: 'All paired numbers cancel to 0, leaving only the unique number.', code: 'return result;' }
                    ]
                },
                get templates() { return bitManipulationTopic.problems[1].templates; }
            }]
        },

        // ===== Stage 2: Bitmask Applications =====
        {
            id: 'boj-11723',
            title: 'BOJ 11723 - Set',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11723',
            simIntro: 'Observe how bitmask operations handle add, remove, toggle, check, all, and empty.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an initially empty set S, write a program that performs the following operations.</p>
                <ul style="margin:8px 0 8px 20px;">
                    <li><code>add x</code>: Add x to S</li>
                    <li><code>remove x</code>: Remove x from S</li>
                    <li><code>check x</code>: Print 1 if x is in S, 0 otherwise</li>
                    <li><code>toggle x</code>: Remove x if it is in S, add it otherwise</li>
                    <li><code>all</code>: Change S to {1, 2, ..., 20}</li>
                    <li><code>empty</code>: Change S to the empty set</li>
                </ul>
                <h4>Input</h4>
                <p>The first line contains the number of operations M (1 &le; M &le; 3,000,000).</p>
                <p>From the second line, each of the M lines contains one operation to perform.</p>
                <h4>Output</h4>
                <p>For each <code>check</code> operation, print the result.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>26\nadd 1\nadd 2\ncheck 1\ncheck 2\nremove 2\ncheck 1\ncheck 2\ntoggle 3\ncheck 1\ncheck 2\ncheck 3\ncheck 4\nall\ncheck 10\ncheck 15\nempty\ncheck 1\ntoggle 1\ncheck 1\ntoggle 1\ncheck 1\nall\ncheck 5\ntoggle 5\ncheck 5\ncheck 1</pre></div>
                    <div><strong>Output</strong><pre>1\n1\n1\n0\n1\n0\n1\n0\n1\n1\n0\n1\n1\n0\n1\n0\n1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; M &le; 3,000,000</li>
                    <li>1 &le; x &le; 20</li>
                </ul>
            `,
            hints: [
                {
                    title: 'First intuition',
                    content: 'Since these are set operations... why not just use <span class="lang-py">Python\'s <code>set()</code></span><span class="lang-cpp">C++\'s <code>set&lt;int&gt;</code></span>?<br><br><code>add</code>, <code>remove</code>, <code>check</code> are all built-in, so we can implement it right away. With elements only from 1 to 20, it seems simple!'
                },
                {
                    title: 'But there\'s a problem with this',
                    content: 'M can be up to <strong>3 million</strong>! A set data structure has O(log n) per operation, which can be slow, and has memory overhead too.<br><br>But notice that the element range is only 1 to 20. For a set of just 20 elements, do we really need a heavy data structure like set? If we could represent the set with <strong>a single integer</strong>, every operation would be O(1)...'
                },
                {
                    title: 'What if we try this?',
                    content: 'Represent the set using the bits of an integer S! If the x-th bit is 1, then x is in the set.<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.85em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">Bitmask set representation (S = {1, 3, 4})</div><div style="display:flex;gap:2px;justify-content:center;font-family:monospace;margin-bottom:10px;"><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">5</div><div style="padding:3px 0;background:var(--bg3);border-radius:3px;">0</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">4</div><div style="padding:3px 0;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">1</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">3</div><div style="padding:3px 0;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">1</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">2</div><div style="padding:3px 0;background:var(--bg3);border-radius:3px;">0</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">1</div><div style="padding:3px 0;background:var(--green);color:#fff;border-radius:3px;font-weight:700;">1</div></div><div style="text-align:center;width:28px;"><div style="font-size:0.7em;color:var(--text2);">0</div><div style="padding:3px 0;background:var(--bg3);border-radius:3px;">0</div></div></div><div style="text-align:center;font-family:monospace;color:var(--text2);">S = 0b011010 = 26</div></div>Each operation becomes a single bit operation:<br>• <code>add x</code> → <code>S |= (1 &lt;&lt; x)</code> — turn the x-th bit ON<br>• <code>remove x</code> → <code>S &amp;= ~(1 &lt;&lt; x)</code> — turn the x-th bit OFF<br>• <code>check x</code> → <code>(S &gt;&gt; x) &amp; 1</code> — check if the x-th bit is 1<br>• <code>toggle x</code> → <code>S ^= (1 &lt;&lt; x)</code> — flip the x-th bit<br>• <code>all</code> → <code>S = (1 &lt;&lt; 21) - 1</code> — set bits 1 through 20 all to 1<br>• <code>empty</code> → <code>S = 0</code> — reset all bits to 0'
                },
                {
                    title: 'Avoiding TLE!',
                    content: 'With M up to 3 million, I/O speed matters a lot!<br><br><span class="lang-py">Python: You must use <code>sys.stdin.readline</code>. The default <code>input()</code> is too slow!<br>Also, collect outputs in a list and print with <code>"\\n".join(out)</code> at the end for much faster I/O.</span><span class="lang-cpp">C++: Use <code>ios::sync_with_stdio(false)</code> and <code>cin.tie(nullptr)</code> to speed up I/O!</span>'
                }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nM = int(input())\nS = 0\nout = []\n\nfor _ in range(M):\n    line = input().split()\n    cmd = line[0]\n\n    if cmd == \'add\':\n        x = int(line[1])\n        S |= (1 << x)\n    elif cmd == \'remove\':\n        x = int(line[1])\n        S &= ~(1 << x)\n    elif cmd == \'check\':\n        x = int(line[1])\n        out.append(\'1\' if (S >> x) & 1 else \'0\')\n    elif cmd == \'toggle\':\n        x = int(line[1])\n        S ^= (1 << x)\n    elif cmd == \'all\':\n        S = (1 << 21) - 1\n    elif cmd == \'empty\':\n        S = 0\n\nprint(\'\\n\'.join(out))',
                cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int M;\n    cin >> M;\n    int S = 0;\n\n    while (M--) {\n        string cmd;\n        cin >> cmd;\n\n        if (cmd == "add") {\n            int x; cin >> x;\n            S |= (1 << x);\n        } else if (cmd == "remove") {\n            int x; cin >> x;\n            S &= ~(1 << x);\n        } else if (cmd == "check") {\n            int x; cin >> x;\n            cout << ((S >> x) & 1) << \'\\n\';\n        } else if (cmd == "toggle") {\n            int x; cin >> x;\n            S ^= (1 << x);\n        } else if (cmd == "all") {\n            S = (1 << 21) - 1;\n        } else { // empty\n            S = 0;\n        }\n    }\n}'
            },
            solutions: [{
                approach: 'Bitmask Set Operations',
                description: 'Represent the set using bits of a single integer, making each operation O(1).',
                timeComplexity: 'O(M)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: 'Input & Init', desc: 'M can be up to 3 million, so sys.stdin.readline is required.\nManage set S as a bitmask integer starting at 0.', code: 'import sys\ninput = sys.stdin.readline\n\nM = int(input())\nS = 0\nout = []' },
                        { title: 'Process Operations', desc: 'Each operation is handled with a single bit operation.\nOR(add), AND+NOT(remove), XOR(toggle), shift(check).', code: 'for _ in range(M):\n    line = input().split()\n    cmd = line[0]\n    if cmd == \'add\':     S |= (1 << int(line[1]))\n    elif cmd == \'remove\': S &= ~(1 << int(line[1]))\n    elif cmd == \'check\':  out.append(str((S >> int(line[1])) & 1))\n    elif cmd == \'toggle\': S ^= (1 << int(line[1]))\n    elif cmd == \'all\':    S = (1 << 21) - 1\n    elif cmd == \'empty\':  S = 0' },
                        { title: 'Output', desc: 'Collecting results in a list and printing at once reduces I/O calls for speed.', code: 'print(\'\\n\'.join(out))' }
                    ],
                    cpp: [
                        { title: 'Input & Init', desc: 'ios::sync_with_stdio(false) speeds up I/O.\nWith M up to 3 million, fast I/O is essential!', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int M, S = 0;\n    cin >> M;' },
                        { title: 'Process Operations', desc: 'Bit operations are exactly the same as in Python!', code: '    while (M--) {\n        string cmd; cin >> cmd;\n        if (cmd == "add")    { int x; cin >> x; S |= (1 << x); }\n        else if (cmd == "remove") { int x; cin >> x; S &= ~(1 << x); }\n        else if (cmd == "check")  { int x; cin >> x; cout << ((S >> x) & 1) << \'\\n\'; }\n        else if (cmd == "toggle") { int x; cin >> x; S ^= (1 << x); }\n        else if (cmd == "all")    S = (1 << 21) - 1;\n        else S = 0;  // empty\n    }' },
                        { title: 'Output', desc: 'In C++, we print immediately on each check, so no separate output step is needed.', code: '    return 0;\n}' }
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
            simIntro: 'Observe how bitmasks from 0 to 2^n-1 enumerate all subsets.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an integer array <code>nums</code> of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the subsets in any order.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [1,2,3]</pre></div>
                    <div><strong>Output</strong><pre>[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [0]</pre></div>
                    <div><strong>Output</strong><pre>[[],[0]]</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; nums.length &le; 10</li>
                    <li>-10 &le; nums[i] &le; 10</li>
                    <li>All the numbers of nums are unique</li>
                </ul>
            `,
            hints: [
                {
                    title: 'First intuition',
                    content: 'We need to generate all subsets... how about using backtracking (recursion)?<br><br>For each element, decide "include or not include" and recursively explore to generate all combinations. This approach actually works well!'
                },
                {
                    title: 'Is there a simpler way?',
                    content: 'Backtracking works, but the recursive call structure can get complex.<br><br>Wait — each element has only two choices: "include (1)" or "exclude (0)".<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.85em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">nums = [a, b, c] → binary = subset</div><table style="border-collapse:collapse;width:100%;font-family:monospace;"><tr style="background:var(--bg3);"><th style="padding:4px 8px;border:1px solid var(--bg3);">Mask</th><th style="padding:4px 8px;border:1px solid var(--bg3);">Binary</th><th style="padding:4px 8px;border:1px solid var(--bg3);">Selected</th><th style="padding:4px 8px;border:1px solid var(--bg3);">Subset</th></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">0</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">000</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">___</td><td style="padding:4px 8px;border:1px solid var(--bg3);">[]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">1</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">00<span style="color:var(--green);font-weight:700;">1</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">__a</td><td style="padding:4px 8px;border:1px solid var(--bg3);">[a]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">5</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;"><span style="color:var(--green);font-weight:700;">1</span>0<span style="color:var(--green);font-weight:700;">1</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">c_a</td><td style="padding:4px 8px;border:1px solid var(--bg3);">[a, c]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">7</td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;"><span style="color:var(--green);font-weight:700;">111</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">cba</td><td style="padding:4px 8px;border:1px solid var(--bg3);">[a, b, c]</td></tr></table></div>With n elements, there are 2<sup>n</sup> subsets — this maps exactly to <strong>all combinations of n-bit binary numbers</strong>!'
                },
                {
                    title: 'What if we try this?',
                    content: 'Use integers from 0 to 2<sup>n</sup>-1 as "bitmasks"!<br><br>If the j-th bit of an integer is 1, include nums[j].<br>Example: in <code>[1,2,3]</code>, mask <code>101</code>(=5) → bits 0 and 2 are 1 → select <code>[1, 3]</code>!<br><br>This way, we can generate all subsets with just a <strong>nested for loop</strong> and no recursion:<br>Outer loop: iterate mask from 0 to 2<sup>n</sup>-1<br>Inner loop: check if each bit is 1 → <code>mask &amp; (1 &lt;&lt; j)</code>'
                },
                {
                    title: 'In Python/C++!',
                    content: '<span class="lang-py">Python: <code>for mask in range(1 &lt;&lt; n)</code> iterates over all masks,<br>and <code>if mask &amp; (1 &lt;&lt; j)</code> checks whether the j-th element is included.<br>Also possible with list comprehension: <code>[nums[j] for j in range(n) if mask &amp; (1 &lt;&lt; j)]</code></span><span class="lang-cpp">C++: <code>for (int mask = 0; mask &lt; (1 &lt;&lt; n); mask++)</code> iterates over all masks,<br>and <code>if (mask &amp; (1 &lt;&lt; j))</code> determines inclusion.<br>Store results in a <code>vector&lt;vector&lt;int&gt;&gt;</code>.</span>'
                }
            ],
            templates: {
                python: 'class Solution:\n    def subsets(self, nums: list[int]) -> list[list[int]]:\n        n = len(nums)\n        result = []\n\n        for mask in range(1 << n):  # 0 ~ 2^n - 1\n            subset = []\n            for j in range(n):\n                if mask & (1 << j):  # Select if j-th bit is 1\n                    subset.append(nums[j])\n            result.append(subset)\n\n        return result\n\n    # Backtracking solution (for comparison):\n    # def subsets(self, nums):\n    #     res = []\n    #     def bt(start, curr):\n    #         res.append(curr[:])\n    #         for i in range(start, len(nums)):\n    #             curr.append(nums[i])\n    #             bt(i + 1, curr)\n    #             curr.pop()\n    #     bt(0, [])\n    #     return res',
                cpp: 'class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        int n = nums.size();\n        vector<vector<int>> result;\n\n        for (int mask = 0; mask < (1 << n); mask++) {\n            vector<int> subset;\n            for (int j = 0; j < n; j++) {\n                if (mask & (1 << j)) {\n                    subset.push_back(nums[j]);\n                }\n            }\n            result.push_back(subset);\n        }\n\n        return result;\n    }\n};'
            },
            solutions: [{
                approach: 'Bitmask Subset Enumeration',
                description: 'Iterate from 0 to 2^n-1, selecting elements corresponding to each set bit.',
                timeComplexity: 'O(n * 2^n)',
                spaceComplexity: 'O(n * 2^n)',
                codeSteps: {
                    python: [
                        { title: 'Initialize', desc: 'n elements → 2^n subsets.\nBitmasks from 0 to 2^n-1 correspond to each subset.', code: 'n = len(nums)\nresult = []' },
                        { title: 'Mask Iteration', desc: 'For each mask, if the j-th bit is 1, include nums[j].\nExample: mask 101 → select nums[0] and nums[2].', code: 'for mask in range(1 << n):  # 0 ~ 2^n - 1\n    subset = []\n    for j in range(n):\n        if mask & (1 << j):  # Select if j-th bit is 1\n            subset.append(nums[j])\n    result.append(subset)' },
                        { title: 'Return Result', desc: 'Return the list containing all 2^n subsets.', code: 'return result' }
                    ],
                    cpp: [
                        { title: 'Initialize', desc: 'Get the element count with nums.size() and prepare the result vector.', code: 'int n = nums.size();\nvector<vector<int>> result;' },
                        { title: 'Mask Iteration', desc: 'Iterate through all bit combinations from 0 to 2^n-1.\nIf the j-th bit is 1, include nums[j].', code: 'for (int mask = 0; mask < (1 << n); mask++) {\n    vector<int> subset;\n    for (int j = 0; j < n; j++) {\n        if (mask & (1 << j))  // Select if j-th bit is 1\n            subset.push_back(nums[j]);\n    }\n    result.push_back(subset);\n}' },
                        { title: 'Return Result', desc: 'After iterating all bit combinations, all 2^n subsets are complete.', code: 'return result;' }
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

// Module registration
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.bitmanipulation = bitManipulationTopic;
