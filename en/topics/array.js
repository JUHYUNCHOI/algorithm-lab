// =========================================================
// Array Topic Module
// =========================================================
const arrayTopic = {
    id: 'array',
    title: 'Array',
    icon: '📊',
    category: 'Data Structures',
    order: 2,
    description: 'Key patterns for solving array problems: Two Pointers, Sliding Window, and range processing',
    relatedNote: 'Other techniques like Kadane\'s algorithm, Monotone Stack, and Dutch National Flag are also commonly used in array problems.',

    sidebarExpandable: true,

    // Single unified tab (for topic overview)
    tabs: [{ id: 'concept', label: 'Learn' }],

    // Problem-type mapping
    problemMeta: {
        'lc-1':     { type: 'Hash Map Lookup',    color: 'var(--accent)', vizMethod: '_renderVizTwoSum' },
        'lc-121':   { type: 'Single Pass',        color: 'var(--green)',  vizMethod: '_renderVizStock' },
        'lc-15':    { type: 'Two Pointers',       color: '#e17055',      vizMethod: '_renderViz3Sum' },
        'boj-2003': { type: 'Sliding Window',     color: '#6c5ce7',      vizMethod: '_renderVizSlidingWindow' }
    },

    // ===== Problem tab definitions =====
    getProblemTabs(problemId) {
        const prob = this.problems.find(p => p.id === problemId);
        // New structure: approach-based tabs when solutions have hints
        if (prob && prob.solutions && prob.solutions.length > 0 && prob.solutions[0].hints) {
            const icons = ['🔨', '⚡', '🚀'];
            const tabs = [{ id: 'problem', label: 'Problem', icon: '📋' }];
            prob.solutions.forEach((sol, i) => {
                tabs.push({ id: 'approach-' + i, label: sol.approach, icon: icons[i] || '📌' });
            });
            if (prob.library) {
                tabs.push({ id: 'library', label: 'Learn More', icon: '📦' });
            }
            return tabs;
        }
        // Legacy: original 4-tab structure
        return [
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Approach', icon: '💡' },
            { id: 'sim', label: 'Simulation', icon: '🎮' },
            { id: 'code', label: 'Code', icon: '💻' }
        ];
    },

    // ===== Problem content rendering (called from app.js) =====
    renderProblemContent(container, problemId, tabId) {
        const self = this;
        const prob = self.problems.find(p => p.id === problemId);
        if (!prob) { container.innerHTML = '<p>Problem not found.</p>'; return; }

        const meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>Problem metadata not found.</p>'; return; }

        self._clearVizState();

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);

        const flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the I/O format.', icon: '📋' },
            think:   { intro: 'Don\'t jump to coding — open the hints step by step to build your strategy.', icon: '💡' },
            sim:     { intro: prob.simIntro || 'See how the concepts from the hints actually work in practice.', icon: '🎮' },
            code:    { intro: 'Now let\'s turn the approach into code!', icon: '💻' }
        };
        const ft = flowMap[tabId];
        if (ft) {
            const introDiv = document.createElement('div');
            introDiv.className = 'flow-intro';
            introDiv.innerHTML = '<span class="flow-intro-icon">' + ft.icon + '</span><span>' + ft.intro + '</span>';
            container.appendChild(introDiv);
        }

        const contentDiv = document.createElement('div');
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';
        container.appendChild(contentDiv);

        // Approach-based tabs or legacy tabs
        if (tabId.startsWith('approach-')) {
            const idx = parseInt(tabId.split('-')[1]);
            self._renderApproachContent(contentDiv, prob, idx);
        } else if (tabId === 'library') {
            self._renderLibraryTab(contentDiv, prob);
        } else {
            switch (tabId) {
                case 'problem': self._renderProblemTab(contentDiv, prob); break;
                case 'think':   self._renderThinkTab(contentDiv, prob); break;
                case 'sim':     if (meta.vizMethod) self[meta.vizMethod](contentDiv); break;
                case 'code':    self._renderCodeTab(contentDiv, prob); break;
            }
        }

        // Next tab navigation button
        const allTabs = self.getProblemTabs(problemId);
        const curIdx = allTabs.findIndex(t => t.id === tabId);
        if (curIdx >= 0 && curIdx < allTabs.length - 1) {
            const nextTab = allTabs[curIdx + 1];
            // CTA text
            let ctaText = 'Continue to next step';
            if (tabId === 'problem') ctaText = 'Understood the problem?';
            else if (tabId.startsWith('approach-')) ctaText = 'Got this approach?';
            else if (tabId === 'think') ctaText = 'Reviewed all hints?';
            else if (tabId === 'sim') ctaText = 'Understand how it works?';
            const nextDiv = document.createElement('div');
            nextDiv.className = 'flow-next';
            nextDiv.innerHTML = '<button class="flow-next-btn">' + ctaText + ' → ' + nextTab.label + ' →</button>';
            nextDiv.querySelector('button').addEventListener('click', function() { window._switchToTab(nextTab.id); });
            container.appendChild(nextDiv);
        }
    },

    // ===== Problem sub-tab: Problem =====
    _renderProblemTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    // ===== Problem sub-tab: Approach =====
    _renderThinkTab(contentEl, prob) {
        const guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click each step to reveal hints';
        contentEl.appendChild(guide);

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';
        const openedState = {};

        prob.hints.forEach(function(hint, idx) {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML =
                '<div class="hint-step-header">' +
                '<span class="hint-step-num">' + (idx + 1) + '</span>' +
                '<span class="hint-step-title">' + hint.title + '</span>' +
                '<span class="hint-step-toggle">▾</span></div>' +
                '<div class="hint-step-body">' + hint.content + '</div>';

            // If viz exists, add container in advance
            if (hint.viz) {
                var vizArea = document.createElement('div');
                vizArea.className = 'hint-viz-area';
                step.querySelector('.hint-step-body').appendChild(vizArea);
            }

            step.querySelector('.hint-step-header').addEventListener('click', function() {
                if (step.classList.contains('locked')) return;
                var wasOpened = step.classList.contains('opened');
                step.classList.toggle('opened');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('opened') ? '▴' : '▾';
                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < prob.hints.length) {
                        var nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
                // viz lifecycle management
                if (hint.viz) {
                    var va = step.querySelector('.hint-viz-area');
                    if (!wasOpened) {
                        // Opened: start viz (clean up previous one first)
                        if (step._vizCtrl) { step._vizCtrl.destroy(); }
                        va.innerHTML = '';
                        step._vizCtrl = hint.viz(va);
                    } else {
                        // Closed: stop viz
                        if (step._vizCtrl) { step._vizCtrl.stop(); }
                    }
                }
            });
            hintsDiv.appendChild(step);
        });
        contentEl.appendChild(hintsDiv);

        // Apply hljs highlighting + line-by-line animation to code blocks
        if (window.hljs) {
            hintsDiv.querySelectorAll('pre code').forEach(function(codeEl) {
                hljs.highlightElement(codeEl);
                var lines = codeEl.innerHTML.split('\n');
                codeEl.innerHTML = lines.map(function(line, i) {
                    return '<div class="code-line" style="--i:' + i + '">' + (line || '&nbsp;') + '</div>';
                }).join('');
            });
        }
    },

    // ===== Problem sub-tab: Code =====
    _renderCodeTab(contentEl, prob) {
        if (prob.solutions && prob.solutions.length > 0) {
            window.renderSolutionsCodeTab(contentEl, prob);
            return;
        }
        const isLC = prob.link.includes('leetcode');
        const wrapper = document.createElement('div');
        wrapper.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">' +
            '<select class="str-lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--card);color:var(--text);">' +
            '<option value="python">Python</option><option value="cpp">C++</option></select>' +
            '<a href="' + prob.link + '" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">' +
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>' +
            '<div class="code-block"><pre><code class="language-python"></code></pre></div>';
        var codeEl = wrapper.querySelector('code');
        codeEl.textContent = prob.templates.python;
        if (window.hljs) hljs.highlightElement(codeEl);
        wrapper.querySelector('.str-lang-select').addEventListener('change', function() {
            var lang = this.value;
            var langMap = { python: 'language-python', cpp: 'language-cpp' };
            codeEl.className = langMap[lang];
            codeEl.textContent = prob.templates[lang];
            if (window.hljs) hljs.highlightElement(codeEl);
        });
        contentEl.appendChild(wrapper);
    },

    // ===== Unified approach renderer (hints + simulation + code + limitation/comparison) =====
    _renderApproachContent(contentEl, prob, approachIdx) {
        const sol = prob.solutions[approachIdx];
        const self = this;

        // Approach description + complexity badges
        const descDiv = document.createElement('div');
        descDiv.className = 'approach-desc-header';
        descDiv.innerHTML =
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:0.8rem;flex-wrap:wrap;">' +
            '<span class="approach-meta-badge time">⏱ ' + sol.timeComplexity + '</span>' +
            '<span class="approach-meta-badge space">💾 ' + sol.spaceComplexity + '</span>' +
            '</div>' +
            '<p style="color:var(--text2);font-size:0.95rem;line-height:1.6;margin:0;">' + sol.description + '</p>';
        contentEl.appendChild(descDiv);

        // 1) 💡 Think About It
        if (sol.hints && sol.hints.length > 0) {
            var section1 = document.createElement('div');
            section1.className = 'approach-flow-section';
            section1.innerHTML = '<div class="approach-flow-title"><span class="approach-flow-icon">💡</span>Think About It</div>';
            self._renderHints(section1, sol.hints);
            contentEl.appendChild(section1);
        }

        // 2) 📊 Simulation
        if (sol.vizMethod) {
            var section2 = document.createElement('div');
            section2.className = 'approach-flow-section';
            section2.innerHTML = '<div class="approach-flow-title"><span class="approach-flow-icon">📊</span>Simulation</div>';
            if (sol.simIntro) {
                var intro = document.createElement('p');
                intro.style.cssText = 'color:var(--text2);font-size:0.9rem;margin:0 0 1rem;';
                intro.textContent = sol.simIntro;
                section2.appendChild(intro);
            }
            var simDiv = document.createElement('div');
            section2.appendChild(simDiv);
            self[sol.vizMethod](simDiv);
            contentEl.appendChild(section2);
        }

        // 3) 💻 Code
        var section3 = document.createElement('div');
        section3.className = 'approach-flow-section';
        section3.innerHTML = '<div class="approach-flow-title"><span class="approach-flow-icon">💻</span>Code</div>';
        self._renderSingleSolutionCode(section3, sol, prob);
        contentEl.appendChild(section3);

        // 4) ⚠️ Limitation or ✅ Comparison
        if (sol.limitation) {
            var limitDiv = document.createElement('div');
            limitDiv.className = 'approach-callout limitation';
            limitDiv.innerHTML = '<div class="approach-callout-icon">⚠️</div><div class="approach-callout-body"><div class="approach-callout-title">Limitation of this approach</div>' + sol.limitation + '</div>';
            contentEl.appendChild(limitDiv);
        }
        if (sol.comparison) {
            var compDiv = document.createElement('div');
            compDiv.className = 'approach-callout comparison';
            compDiv.innerHTML = '<div class="approach-callout-icon">✅</div><div class="approach-callout-body"><div class="approach-callout-title">Improvement</div>' + sol.comparison + '</div>';
            contentEl.appendChild(compDiv);
        }
    },

    // ===== Hints renderer (renders hint arrays per approach) =====
    _renderHints(contentEl, hints) {
        var guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click each step to reveal hints';
        contentEl.appendChild(guide);

        var hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';
        var openedState = {};

        hints.forEach(function(hint, idx) {
            var step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML =
                '<div class="hint-step-header">' +
                '<span class="hint-step-num">' + (idx + 1) + '</span>' +
                '<span class="hint-step-title">' + hint.title + '</span>' +
                '<span class="hint-step-toggle">▾</span></div>' +
                '<div class="hint-step-body">' + hint.content + '</div>';
            if (hint.viz) {
                var vizArea = document.createElement('div');
                vizArea.className = 'hint-viz-area';
                step.querySelector('.hint-step-body').appendChild(vizArea);
            }
            step.querySelector('.hint-step-header').addEventListener('click', function() {
                if (step.classList.contains('locked')) return;
                var wasOpened = step.classList.contains('opened');
                step.classList.toggle('opened');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('opened') ? '▴' : '▾';
                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < hints.length) {
                        var nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
                if (hint.viz) {
                    var va = step.querySelector('.hint-viz-area');
                    if (!wasOpened) {
                        if (step._vizCtrl) { step._vizCtrl.destroy(); }
                        va.innerHTML = '';
                        step._vizCtrl = hint.viz(va);
                    } else {
                        if (step._vizCtrl) { step._vizCtrl.stop(); }
                    }
                }
            });
            hintsDiv.appendChild(step);
        });
        contentEl.appendChild(hintsDiv);

        if (window.hljs) {
            hintsDiv.querySelectorAll('pre code').forEach(function(codeEl) {
                hljs.highlightElement(codeEl);
                var lines = codeEl.innerHTML.split('\n');
                codeEl.innerHTML = lines.map(function(line, i) {
                    return '<div class="code-line" style="--i:' + i + '">' + (line || '&nbsp;') + '</div>';
                }).join('');
            });
        }
    },

    // ===== Single approach code renderer =====
    _renderSingleSolutionCode(contentEl, sol, prob) {
        var isLC = prob.link.includes('leetcode');
        var wrapper = document.createElement('div');
        var langs = Object.keys(sol.templates);
        var langNames = { python: 'Python', cpp: 'C++' };
        var currentLang = langs[0] || 'python';
        var currentStep = -1;

        // Control bar: language selector + step controls (top-right)
        var controls = document.createElement('div');
        controls.style.cssText = 'display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap;';
        var stepBtnHTML = '';
        if (sol.codeSteps) {
            stepBtnHTML =
                '<div style="display:flex;gap:6px;align-items:center;margin-left:auto;">' +
                '<button class="btn code-step-btn cs-prev" disabled style="font-size:0.8rem;padding:4px 10px;">← Prev</button>' +
                '<span class="code-step-counter" style="font-size:0.82rem;font-weight:600;color:var(--accent);min-width:50px;text-align:center;">Before Start</span>' +
                '<button class="btn btn-primary code-step-btn cs-next pulse-hint" style="font-size:0.8rem;padding:4px 10px;">Start →</button></div>';
        }
        controls.innerHTML =
            '<select class="lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--bg2);color:var(--text);font-family:inherit;">' +
            langs.map(function(l) { return '<option value="' + l + '">' + (langNames[l] || l) + '</option>'; }).join('') +
            '</select>' + stepBtnHTML;
        wrapper.appendChild(controls);
        var select = controls.querySelector('.lang-select');

        var stepDesc;
        var topPrev, topNext, topCounter, botPrev, botNext, botCounter;
        if (sol.codeSteps) {
            topPrev = controls.querySelector('.cs-prev');
            topNext = controls.querySelector('.cs-next');
            topCounter = controls.querySelector('.code-step-counter');

            stepDesc = document.createElement('div');
            stepDesc.className = 'code-step-desc';
            stepDesc.textContent = '▶ Click Next to walk through the code step by step';
            wrapper.appendChild(stepDesc);
        }

        // Code block (macOS editor style)
        var codeBlock = document.createElement('div');
        codeBlock.className = 'code-block';
        codeBlock.innerHTML =
            '<div class="code-block-header">' +
            '<div class="code-block-dots"><span></span><span></span><span></span></div>' +
            '<span class="code-block-title">solution.py</span>' +
            '</div>' +
            '<pre><code class="language-python"></code></pre>';
        wrapper.appendChild(codeBlock);

        // Step controls — bottom-right (sticky, same small size)
        if (sol.codeSteps) {
            var botCtrl = document.createElement('div');
            botCtrl.style.cssText = 'display:flex;gap:6px;align-items:center;justify-content:flex-end;position:sticky;bottom:12px;z-index:100;margin-top:12px;padding:8px 0;';
            botCtrl.innerHTML =
                '<button class="btn code-step-btn cs-prev" disabled style="font-size:0.8rem;padding:4px 10px;">← Prev</button>' +
                '<span class="code-step-counter" style="font-size:0.82rem;font-weight:600;color:var(--accent);min-width:50px;text-align:center;">Before Start</span>' +
                '<button class="btn btn-primary code-step-btn cs-next" style="font-size:0.8rem;padding:4px 10px;">Next →</button>';
            wrapper.appendChild(botCtrl);

            botPrev = botCtrl.querySelector('.cs-prev');
            botNext = botCtrl.querySelector('.cs-next');
            botCounter = botCtrl.querySelector('.code-step-counter');
        }
        var codeEl = codeBlock.querySelector('code');
        var codeTitle = codeBlock.querySelector('.code-block-title');

        function langClass(l) { return l === 'cpp' ? 'cpp' : l; }
        function getSteps() { return sol.codeSteps ? (sol.codeSteps[currentLang] || []) : []; }

        function highlightNewLines(codeElm, newLineNums) {
            if (!newLineNums || !newLineNums.length) return;
            var html = codeElm.innerHTML;
            var lines = html.split('\n');
            codeElm.innerHTML = lines.map(function(line, i) {
                return newLineNums.indexOf(i + 1) !== -1 ? '<mark class="code-line-new">' + line + '</mark>' : line;
            }).join('\n');
        }

        function render() {
            var titleMap = { python: 'solution.py', cpp: 'solution.cpp' };
            codeEl.className = 'language-' + langClass(currentLang);
            codeTitle.textContent = titleMap[currentLang] || 'solution';

            var steps = getSteps();

            if (steps.length > 0 && currentStep >= 0 && currentStep < steps.length) {
                var step = steps[currentStep];
                // Build accumulated code
                var fragments = steps.slice(0, currentStep + 1).filter(function(s) { return s.code; }).map(function(s) { return s.code; });
                var accumulated = fragments.join('\n\n');
                codeEl.textContent = accumulated;
                codeEl.removeAttribute('data-highlighted');
                if (window.hljs) hljs.highlightElement(codeEl);
                // Highlight new lines
                if (step.code) {
                    var prevFrags = steps.slice(0, currentStep).filter(function(s) { return s.code; }).map(function(s) { return s.code; });
                    var prevAcc = prevFrags.join('\n\n');
                    var prevCount = prevAcc ? prevAcc.split('\n').length : 0;
                    var totalCount = accumulated.split('\n').length;
                    var startNew = prevCount > 0 ? prevCount + 2 : 1;
                    var newLines = [];
                    for (var ln = startNew; ln <= totalCount; ln++) newLines.push(ln);
                    highlightNewLines(codeEl, newLines);
                }
                if (stepDesc) {
                    stepDesc.innerHTML = '<span class="step-desc-title">' + step.title + '</span><span class="step-desc-body">' + step.desc.replace(/\n/g, '<br>') + '</span>';
                    stepDesc.style.display = 'block';
                }
            } else {
                codeEl.textContent = sol.templates[currentLang] || '';
                codeEl.removeAttribute('data-highlighted');
                if (window.hljs) hljs.highlightElement(codeEl);
                if (stepDesc) {
                    if (currentStep < 0 && steps.length > 0) {
                        stepDesc.textContent = '▶ Click Next to walk through the code step by step';
                    } else if (steps.length === 0) {
                        stepDesc.style.display = 'none';
                    }
                }
            }

            // Step control state update (sync top/bottom)
            if (sol.codeSteps) {
                [
                    [topPrev, topNext, topCounter],
                    [botPrev, botNext, botCounter]
                ].forEach(function(trio) {
                    if (!trio[0]) return;
                    trio[0].disabled = currentStep < 0;
                    trio[1].disabled = currentStep >= steps.length - 1;
                    if (currentStep < 0) {
                        trio[2].textContent = 'Before Start';
                        trio[1].textContent = 'Start →';
                    } else {
                        trio[2].textContent = 'Step ' + (currentStep + 1) + '/' + steps.length;
                        trio[1].textContent = 'Next →';
                    }
                });
            }
        }

        // Events
        select.addEventListener('change', function() {
            currentLang = this.value;
            currentStep = -1;
            render();
        });
        if (sol.codeSteps) {
            function doPrev() { if (currentStep > -1) { currentStep--; render(); } }
            function doNext() {
                topNext.classList.remove('pulse-hint');
                botNext.classList.remove('pulse-hint');
                var steps = getSteps();
                if (currentStep < steps.length - 1) { currentStep++; render(); }
            }
            topPrev.addEventListener('click', doPrev);
            topNext.addEventListener('click', doNext);
            botPrev.addEventListener('click', doPrev);
            botNext.addEventListener('click', doNext);
        }

        render();
        contentEl.appendChild(wrapper);
    },

    // ===== Library/Module tab =====
    _renderLibraryTab(contentEl, prob) {
        if (!prob.library) {
            contentEl.innerHTML = '<p>No library information available for this problem yet.</p>';
            return;
        }
        var lib = prob.library;
        var section = document.createElement('div');
        section.className = 'approach-flow-section';
        section.innerHTML =
            '<div class="approach-flow-title"><span class="approach-flow-icon">📦</span>' + lib.title + '</div>' +
            '<p style="color:var(--text2);line-height:1.7;margin-bottom:1rem;">' + lib.description + '</p>' +
            '<div class="code-block"><div class="code-block-header"><div class="code-block-dots"><span></span><span></span><span></span></div><span class="code-block-title">module.py</span></div>' +
            '<pre><code class="language-python">' + lib.code + '</code></pre></div>' +
            (lib.note ? '<div class="approach-callout comparison" style="margin-top:1rem;"><div class="approach-callout-icon">💡</div><div class="approach-callout-body">' + lib.note + '</div></div>' : '');
        contentEl.appendChild(section);
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) {
            if (window.hljs) hljs.highlightElement(codeEl);
        });
    },

    // ===== Concept Tab =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>📊 Array</h2>
                <p class="hero-sub">Learn the key patterns for solving array problems efficiently!</p>
            </div>

            <!-- Section 1: Array Basics -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> Array Basics
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> An array is like <em>"numbered lockers"</em>!
                    Locker 0, Locker 1... lined up in order, and if you know the number, you can open it instantly (O(1)).
                    However, inserting a locker in the middle means shifting everything after it (O(n)).
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — Index O(1) Access vs Value Search O(n)</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-index-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">Index:
                                <input type="number" id="arr-demo-index-input" min="0" max="7" value="0" style="width:56px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                            </label>
                            <button class="concept-demo-btn" id="arr-demo-index-go">⚡ O(1) Direct Access</button>
                            <button class="concept-demo-btn" id="arr-demo-index-search" style="background:var(--yellow);color:#333;">🔍 Start O(n) Search</button>
                        </div>
                        <div id="arr-demo-search-controls" style="display:none;gap:12px;justify-content:center;align-items:center;margin-top:4px;">
                            <button id="arr-demo-search-prev" class="concept-demo-btn">← Prev</button>
                            <span id="arr-demo-search-counter" style="font-size:0.85rem;color:var(--text2);">Before Start</span>
                            <button id="arr-demo-search-next" class="concept-demo-btn">Next →</button>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-index-msg">👆 Enter an index and click a button! Feel the difference between "direct access" and "value search."</div>
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.3"/><rect x="14" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.6"/><rect x="26" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.9"/></svg>
                        </div>
                        <h3>Index Access O(1)</h3>
                        <p>Access any position instantly with <code>arr[i]</code>. This is the biggest advantage of arrays!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">O(n)</text></svg>
                        </div>
                        <h3>Traversal</h3>
                        <p>Visiting every element once takes O(n). This is the foundation of most array problems.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="12" font-weight="bold" fill="var(--yellow)">insert</text></svg>
                        </div>
                        <h3>Insert/Delete O(n)</h3>
                        <p>Inserting or removing in the middle requires shifting all elements after it. Operations at the end are O(1)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">sorted</text></svg>
                        </div>
                        <h3>Sorted Array</h3>
                        <p>When sorted, binary search (O(log n)) becomes possible. Two pointers also work after sorting.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Array (list) basic operations
arr = [3, 1, 4, 1, 5, 9, 2, 6]

print(arr[0])       # 3 — first element
print(arr[-1])      # 6 — last element
print(len(arr))     # 8 — length

arr.append(7)       # Append to end: O(1)
arr.sort()          # Sort: O(n log n)
print(arr)          # [1, 1, 2, 3, 4, 5, 6, 7, 9]

# List comprehension — filter even numbers
evens = [x for x in arr if x % 2 == 0]
print(evens)        # [2, 4, 6]</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
using namespace std;

int main() {
    vector&lt;int&gt; arr = {3, 1, 4, 1, 5, 9, 2, 6};

    cout &lt;&lt; arr[0] &lt;&lt; endl;       // 3 — first element
    cout &lt;&lt; arr.back() &lt;&lt; endl;   // 6 — last element
    cout &lt;&lt; arr.size() &lt;&lt; endl;   // 8 — length

    arr.push_back(7);              // Append to end: O(1)
    sort(arr.begin(), arr.end());  // Sort: O(n log n)

    // Filter even numbers
    vector&lt;int&gt; evens;
    for (int x : arr) {
        if (x % 2 == 0) evens.push_back(x);
    }
    // evens = {2, 4, 6}
}</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#list" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: list ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/vector" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: vector ↗</a></span>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — Insert/Delete Cost</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-insert-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;min-height:60px;align-items:flex-end;"></div>
                        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <button class="concept-demo-btn" id="arr-demo-insert-mid">📥 Insert in Middle (O(n))</button>
                            <button class="concept-demo-btn green" id="arr-demo-insert-end">📥 Append to End (O(1))</button>
                            <button class="concept-demo-btn danger" id="arr-demo-insert-reset">🔄 Reset</button>
                        </div>
                        <div id="arr-demo-insert-controls" style="display:none;gap:12px;justify-content:center;align-items:center;margin-top:4px;">
                            <button id="arr-demo-insert-prev" class="concept-demo-btn">← Prev</button>
                            <span id="arr-demo-insert-counter" style="font-size:0.85rem;color:var(--text2);">Before Start</span>
                            <button id="arr-demo-insert-next" class="concept-demo-btn">Next →</button>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-insert-msg">👆 Click "Insert in Middle" to see how elements shift one by one!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What is the time complexity of inserting an element at the middle (index 3) of an array? Why?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>O(n)</strong>! Because all elements after index 3 must be shifted back by one position.
                        If the array length is n, up to n-3 elements need to be moved.
                    </div>
                </div>
            </div>

            <!-- Section 2: Two Pointers -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> Two Pointers
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Think of <em>"two people walking toward each other from opposite ends"</em>!
                    When finding two numbers that sum to a target in a sorted array, if the sum is too large, move the right pointer left; if too small, move the left pointer right.
                    Instead of a double for loop (O(n²)), you can solve it in <strong>O(n)</strong>!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — Find a Sum with Two Pointers</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">Target sum:
                                <input type="number" id="arr-demo-tp-target" value="10" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                            </label>
                            <button class="concept-demo-btn" id="arr-demo-tp-step">▶ Next Step</button>
                            <button class="concept-demo-btn danger" id="arr-demo-tp-reset">🔄 Reset</button>
                        </div>
                        <div id="arr-demo-tp-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div id="arr-demo-tp-pointers" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;font-size:0.75rem;font-weight:700;min-height:20px;"></div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-tp-msg">👆 Click "Next Step" to see how the L and R pointers move!</div>
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">L→</text></svg>
                        </div>
                        <h3>Start from Left</h3>
                        <p>Start at <code>left = 0</code> and move rightward.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">←R</text></svg>
                        </div>
                        <h3>Start from Right</h3>
                        <p>Start at <code>right = n-1</code> and move leftward.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="22" font-size="18" font-weight="bold" fill="var(--yellow)">↔</text></svg>
                        </div>
                        <h3>Move by Condition</h3>
                        <p>If sum is too large, right--; if too small, left++. Done in O(n)!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Two Pointers: find two numbers summing to target in sorted array
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1      # Sum too small, move left up
        else:
            right -= 1     # Sum too large, move right down
    return [-1, -1]        # Not found

arr = [1, 2, 4, 6, 8, 10]
print(two_sum_sorted(arr, 10))  # [1, 4] → 2+8=10</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;iostream&gt;
using namespace std;

// Two Pointers: find two numbers summing to target in sorted array
vector&lt;int&gt; two_sum_sorted(vector&lt;int&gt;&amp; arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left &lt; right) {
        int s = arr[left] + arr[right];
        if (s == target)
            return {left, right};
        else if (s &lt; target)
            left++;        // Sum too small, move left up
        else
            right--;       // Sum too large, move right down
    }
    return {-1, -1};       // Not found
}

int main() {
    vector&lt;int&gt; arr = {1, 2, 4, 6, 8, 10};
    auto res = two_sum_sorted(arr, 10);
    cout &lt;&lt; res[0] &lt;&lt; ", " &lt;&lt; res[1] &lt;&lt; endl;  // 1, 4 → 2+8=10
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">How many comparisons does Two Pointers need to find two numbers summing to 12 in sorted [1, 3, 5, 7, 9]?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>Just 2!</strong> 1+9=10 (too small, L++), 3+9=12 (found!). It only takes 2 comparisons.
                        A double for loop would need up to 10 comparisons — Two Pointers is much faster.
                    </div>
                </div>
            </div>

            <!-- Section 3: Sliding Window -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> Sliding Window
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Think of <em>"sliding a window across to see the view"</em>!
                    Slide a fixed-size window one position at a time across the array,
                    tracking the sum/max/min of the elements visible in the window.
                    Instead of recalculating from scratch each time, just subtract what left and add what entered!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="12" width="20" height="14" rx="3" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4,2"/><rect x="6" y="14" width="6" height="10" rx="1" fill="var(--green)" opacity="0.4"/><rect x="13" y="14" width="6" height="10" rx="1" fill="var(--green)" opacity="0.4"/></svg>
                        </div>
                        <h3>Fixed-size Window</h3>
                        <p>Slide a window of size K one position at a time, updating the sum. O(n)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="12" width="28" height="14" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="4,2"/><text x="10" y="22" font-size="8" fill="var(--text2)">flex</text></svg>
                        </div>
                        <h3>Variable-size Window</h3>
                        <p>Shrink the left side when the condition is met, expand the right side otherwise.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Sliding Window: max sum of subarray of size K
def max_subarray_sum(arr, k):
    # Sum of the first window
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide one step: add new element, subtract old one
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

arr = [2, 1, 5, 1, 3, 2]
print(max_subarray_sum(arr, 3))  # 9 (= 5+1+3)</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;iostream&gt;
using namespace std;

// Sliding Window: max sum of subarray of size K
int max_subarray_sum(vector&lt;int&gt;&amp; arr, int k) {
    // Sum of the first window
    int window_sum = 0;
    for (int i = 0; i &lt; k; i++)
        window_sum += arr[i];
    int max_sum = window_sum;

    // Slide one step: add new element, subtract old one
    for (int i = k; i &lt; (int)arr.size(); i++) {
        window_sum += arr[i] - arr[i - k];
        max_sum = max(max_sum, window_sum);
    }
    return max_sum;
}

int main() {
    vector&lt;int&gt; arr = {2, 1, 5, 1, 3, 2};
    cout &lt;&lt; max_subarray_sum(arr, 3) &lt;&lt; endl;  // 9 (= 5+1+3)
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What is the maximum sum of a subarray of size 4 in [1, 4, 2, 10, 2, 3, 1, 0, 20]?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>24</strong>! From [2, 3, 1, 0, 20], the window [3, 1, 0, 20] = 24.
                        Other windows: [10, 2, 3, 1] = 16, [2, 3, 1, 0] = 6, [3, 1, 0, 20] = 24. The answer is 24!
                    </div>
                </div>
            </div>

            <!-- Section 4: Array Problem-Solving Strategies -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> Array Problem-Solving Strategies
                </div>
                <div class="analogy-box">
                    <strong>Know the patterns and the solution reveals itself!</strong> When you see an array problem, ask yourself:
                    Does sorting help? → Two Pointers. Looking at ranges? → Sliding Window.
                    Precompute results per element? → Preprocessing (Prefix Sum / Product Array).
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">sort</text></svg>
                        </div>
                        <h3>Sort then Search</h3>
                        <p>Sort O(n log n) + Two Pointers O(n) = O(n log n) total. Faster than brute force O(n²)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">←→</text></svg>
                        </div>
                        <h3>Left-Right Preprocessing</h3>
                        <p>Scan left-to-right and right-to-left to precompute information at each position.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">max</text></svg>
                        </div>
                        <h3>State Tracking</h3>
                        <p>Track min/max/cumulative values in variables as you traverse — get the answer in a single pass.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Example: max stock profit (single pass, tracking min)
def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)        # Lowest price so far
        max_profit = max(max_profit, price - min_price)  # What if we sell now?
    return max_profit

prices = [7, 1, 5, 3, 6, 4]
print(max_profit(prices))  # 5 (buy at 1, sell at 6)</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;climits&gt;
#include &lt;iostream&gt;
using namespace std;

// Example: max stock profit (single pass, tracking min)
int max_profit(vector&lt;int&gt;&amp; prices) {
    int min_price = INT_MAX;
    int profit = 0;
    for (int price : prices) {
        min_price = min(min_price, price);        // Lowest price so far
        profit = max(profit, price - min_price);   // What if we sell now?
    }
    return profit;
}

int main() {
    vector&lt;int&gt; prices = {7, 1, 5, 3, 6, 4};
    cout &lt;&lt; max_profit(prices) &lt;&lt; endl;  // 5 (buy at 1, sell at 6)
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">A double for loop solution is O(n²), but the approach above is O(?). Why?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>O(n)</strong>! We traverse the array just once, tracking the minimum price so far in a single variable.
                        At each position, we can instantly calculate "what profit would we make if we sold now?"
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
                box.classList.add('revealed');
                btn.style.display = 'none';
            });
        });

        // --- helper: create array box ---
        var _mkBox = function(val, idx) {
            var d = document.createElement('div');
            d.className = 'str-char-box';
            d.innerHTML = '<span class="str-char-idx">' + idx + '</span><span class="str-char-val">' + val + '</span>';
            return d;
        };

        // --- 1. Index O(1) Access Demo ---
        {
            var idxArr = [10, 25, 8, 42, 17, 33, 5, 61];
            var boxesEl = container.querySelector('#arr-demo-index-boxes');
            var inputEl = container.querySelector('#arr-demo-index-input');
            var goBtn = container.querySelector('#arr-demo-index-go');
            var searchBtn = container.querySelector('#arr-demo-index-search');
            var msgEl = container.querySelector('#arr-demo-index-msg');
            var animating = false;

            var renderBoxes = function() {
                boxesEl.innerHTML = '';
                for (var i = 0; i < idxArr.length; i++) {
                    boxesEl.appendChild(_mkBox(idxArr[i], i));
                }
            };
            renderBoxes();

            var clearHighlights = function() {
                boxesEl.querySelectorAll('.str-char-box').forEach(function(b) {
                    b.classList.remove('comparing', 'matched');
                    b.style.borderColor = '';
                    b.style.background = '';
                    b.style.transform = '';
                    b.style.boxShadow = '';
                });
            };

            goBtn.addEventListener('click', function() {
                if (animating) return;
                clearHighlights();
                var idx = parseInt(inputEl.value);
                if (isNaN(idx) || idx < 0 || idx >= idxArr.length) {
                    msgEl.textContent = 'Index must be between 0 and ' + (idxArr.length - 1) + '!';
                    return;
                }
                var boxes = boxesEl.querySelectorAll('.str-char-box');
                boxes[idx].classList.add('matched');
                msgEl.textContent = 'arr[' + idx + '] = ' + idxArr[idx] + ' → Direct access! 0 comparisons, O(1). Just knowing the index is enough.';
            });

            // --- Linear search: manual step controls ---
            var searchControlsEl = container.querySelector('#arr-demo-search-controls');
            var searchPrevBtn = container.querySelector('#arr-demo-search-prev');
            var searchNextBtn = container.querySelector('#arr-demo-search-next');
            var searchCounterEl = container.querySelector('#arr-demo-search-counter');
            var searchSteps = [];
            var searchStep = -1;
            var searchActive = false;

            var buildSearchSteps = function(targetIdx) {
                var targetVal = idxArr[targetIdx];
                var steps = [];
                for (var i = 0; i <= targetIdx; i++) {
                    (function(si) {
                        if (si < targetIdx) {
                            steps.push({
                                desc: 'arr[' + si + '] = ' + idxArr[si] + ' → Not ' + targetVal + '. Next!',
                                action: function() {
                                    var boxes = boxesEl.querySelectorAll('.str-char-box');
                                    boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                                    for (var j = 0; j < si; j++) { boxes[j].style.opacity = '0.5'; }
                                    boxes[si].style.opacity = '';
                                    boxes[si].classList.add('comparing');
                                    for (var j = si + 1; j < boxes.length; j++) { boxes[j].style.opacity = ''; }
                                }
                            });
                        } else {
                            steps.push({
                                desc: 'Found value ' + targetVal + '! ' + (si + 1) + ' comparisons made. O(n) — worst case requires ' + idxArr.length + ' comparisons!',
                                action: function() {
                                    var boxes = boxesEl.querySelectorAll('.str-char-box');
                                    boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                                    for (var j = 0; j < si; j++) { boxes[j].style.opacity = '0.5'; }
                                    boxes[si].style.opacity = '';
                                    boxes[si].classList.add('matched');
                                    for (var j = si + 1; j < boxes.length; j++) { boxes[j].style.opacity = ''; }
                                }
                            });
                        }
                    })(i);
                }
                return steps;
            };

            var updateSearchUI = function() {
                if (searchStep < 0) {
                    searchCounterEl.textContent = 'Before Start';
                    searchPrevBtn.disabled = true;
                    searchNextBtn.disabled = false;
                } else if (searchStep >= searchSteps.length - 1) {
                    searchCounterEl.textContent = (searchStep + 1) + ' / ' + searchSteps.length;
                    searchPrevBtn.disabled = false;
                    searchNextBtn.disabled = true;
                } else {
                    searchCounterEl.textContent = (searchStep + 1) + ' / ' + searchSteps.length;
                    searchPrevBtn.disabled = false;
                    searchNextBtn.disabled = false;
                }
                if (searchStep >= 0 && searchStep < searchSteps.length) {
                    msgEl.textContent = searchSteps[searchStep].desc;
                    searchSteps[searchStep].action();
                } else {
                    clearHighlights();
                    boxesEl.querySelectorAll('.str-char-box').forEach(function(b) { b.style.opacity = ''; });
                }
            };

            var resetSearch = function() {
                searchActive = false;
                searchStep = -1;
                searchSteps = [];
                searchControlsEl.style.display = 'none';
                goBtn.disabled = false;
                searchBtn.disabled = false;
                searchBtn.textContent = '🔍 Start O(n) Search';
                inputEl.disabled = false;
                clearHighlights();
                boxesEl.querySelectorAll('.str-char-box').forEach(function(b) { b.style.opacity = ''; });
                msgEl.textContent = '👆 Enter an index and click a button! Feel the difference between "direct access" and "value search."';
            };

            searchBtn.addEventListener('click', function() {
                if (searchActive) {
                    resetSearch();
                    return;
                }
                clearHighlights();
                var idx = parseInt(inputEl.value);
                if (isNaN(idx) || idx < 0 || idx >= idxArr.length) {
                    msgEl.textContent = 'Index must be between 0 and ' + (idxArr.length - 1) + '!';
                    return;
                }
                searchSteps = buildSearchSteps(idx);
                searchStep = -1;
                searchActive = true;
                goBtn.disabled = true;
                inputEl.disabled = true;
                searchBtn.textContent = '🔄 Reset Search';
                searchControlsEl.style.display = 'flex';
                msgEl.textContent = 'Searching for value ' + idxArr[idx] + ' by checking one by one from the start. Click "Next →"!';
                updateSearchUI();
            });

            searchNextBtn.addEventListener('click', function() {
                if (searchStep < searchSteps.length - 1) {
                    searchStep++;
                    updateSearchUI();
                }
            });

            searchPrevBtn.addEventListener('click', function() {
                if (searchStep > -1) {
                    searchStep--;
                    updateSearchUI();
                    if (searchStep < 0) {
                        msgEl.textContent = 'Checking values one by one from the start to find it. Click "Next →"!';
                    }
                }
            });
        }

        // --- 2. Insert/Delete Cost Demo ---
        {
            var insertArr = [3, 7, 1, 9, 4, 6];
            var insertBoxesEl = container.querySelector('#arr-demo-insert-boxes');
            var insertMidBtn = container.querySelector('#arr-demo-insert-mid');
            var insertEndBtn = container.querySelector('#arr-demo-insert-end');
            var insertResetBtn = container.querySelector('#arr-demo-insert-reset');
            var insertMsgEl = container.querySelector('#arr-demo-insert-msg');
            var insertControlsEl = container.querySelector('#arr-demo-insert-controls');
            var insertPrevBtn = container.querySelector('#arr-demo-insert-prev');
            var insertNextBtn = container.querySelector('#arr-demo-insert-next');
            var insertCounterEl = container.querySelector('#arr-demo-insert-counter');
            var insertCount = 0;
            var insertSteps = [];
            var insertStep = -1;
            var insertActive = false;

            var renderInsertBoxes = function() {
                insertBoxesEl.innerHTML = '';
                for (var i = 0; i < insertArr.length; i++) {
                    insertBoxesEl.appendChild(_mkBox(insertArr[i], i));
                }
            };
            renderInsertBoxes();

            var buildInsertSteps = function(arr, midIdx, newVal) {
                var steps = [];
                var arrCopy = arr.slice();
                // Step for each element shifting (from right to left)
                for (var si = arrCopy.length - 1; si >= midIdx; si--) {
                    (function(shiftI, totalShifts) {
                        steps.push({
                            desc: 'Shifting arr[' + shiftI + '] = ' + arrCopy[shiftI] + ' one position to the right... (' + (arrCopy.length - shiftI) + '/' + totalShifts + ')',
                            action: function() {
                                var boxes = insertBoxesEl.querySelectorAll('.str-char-box');
                                boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                                if (boxes[shiftI]) {
                                    boxes[shiftI].classList.add('comparing');
                                }
                            }
                        });
                    })(si, arrCopy.length - midIdx);
                }
                // Final step: insert the element
                steps.push({
                    desc: 'Inserted ' + newVal + ' at index ' + midIdx + '! Shifted ' + (arrCopy.length - midIdx) + ' elements → O(n)',
                    action: function() {
                        insertArr.splice(midIdx, 0, newVal);
                        renderInsertBoxes();
                        var newBoxes = insertBoxesEl.querySelectorAll('.str-char-box');
                        newBoxes[midIdx].classList.add('matched');
                    },
                    isFinal: true
                });
                return steps;
            };

            var updateInsertUI = function() {
                if (insertStep < 0) {
                    insertCounterEl.textContent = 'Before Start';
                    insertPrevBtn.disabled = true;
                    insertNextBtn.disabled = false;
                } else if (insertStep >= insertSteps.length - 1) {
                    insertCounterEl.textContent = (insertStep + 1) + ' / ' + insertSteps.length;
                    insertPrevBtn.disabled = false;
                    insertNextBtn.disabled = true;
                } else {
                    insertCounterEl.textContent = (insertStep + 1) + ' / ' + insertSteps.length;
                    insertPrevBtn.disabled = false;
                    insertNextBtn.disabled = false;
                }
                if (insertStep >= 0 && insertStep < insertSteps.length) {
                    insertMsgEl.textContent = insertSteps[insertStep].desc;
                    insertSteps[insertStep].action();
                }
            };

            var resetInsertDemo = function() {
                insertActive = false;
                insertStep = -1;
                insertSteps = [];
                insertControlsEl.style.display = 'none';
                insertMidBtn.disabled = insertArr.length >= 10;
                insertEndBtn.disabled = insertArr.length >= 10;
                insertMidBtn.textContent = '📥 Insert in Middle (O(n))';
                var boxes = insertBoxesEl.querySelectorAll('.str-char-box');
                boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                insertMsgEl.textContent = '👆 Click "Insert in Middle" to see how elements shift one by one!';
            };

            insertMidBtn.addEventListener('click', function() {
                if (insertArr.length >= 10) return;
                if (insertActive) {
                    resetInsertDemo();
                    return;
                }
                var midIdx = Math.floor(insertArr.length / 2);
                var newVal = [0, 8, 2, 5, 11, 15][insertCount % 6];
                insertSteps = buildInsertSteps(insertArr, midIdx, newVal);
                insertStep = -1;
                insertActive = true;
                insertEndBtn.disabled = true;
                insertMidBtn.textContent = '🔄 Reset Insert';
                insertControlsEl.style.display = 'flex';
                insertMsgEl.textContent = 'Inserting ' + newVal + ' at index ' + midIdx + '. First, we need to shift the elements after it! Click "Next →"!';
                updateInsertUI();
            });

            insertNextBtn.addEventListener('click', function() {
                if (insertStep < insertSteps.length - 1) {
                    insertStep++;
                    updateInsertUI();
                    // If final step reached, finish the insertion
                    if (insertSteps[insertStep] && insertSteps[insertStep].isFinal) {
                        insertCount++;
                        // Auto-finish after a moment
                        setTimeout(function() {
                            insertActive = false;
                            insertSteps = [];
                            insertStep = -1;
                            insertControlsEl.style.display = 'none';
                            insertMidBtn.textContent = '📥 Insert in Middle (O(n))';
                            insertMidBtn.disabled = insertArr.length >= 10;
                            insertEndBtn.disabled = insertArr.length >= 10;
                        }, 1200);
                    }
                }
            });

            insertPrevBtn.addEventListener('click', function() {
                if (insertStep > -1) {
                    // If we were on the final step, undo the splice
                    if (insertSteps[insertStep] && insertSteps[insertStep].isFinal) {
                        var midIdx = Math.floor((insertArr.length - 1) / 2);
                        insertArr.splice(midIdx, 1);
                        renderInsertBoxes();
                        insertCount--;
                    }
                    insertStep--;
                    if (insertStep >= 0) {
                        updateInsertUI();
                    } else {
                        insertCounterEl.textContent = 'Before Start';
                        insertPrevBtn.disabled = true;
                        insertNextBtn.disabled = false;
                        var boxes = insertBoxesEl.querySelectorAll('.str-char-box');
                        boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                        insertMsgEl.textContent = 'Inserting value at index. Click "Next →"!';
                    }
                }
            });

            insertEndBtn.addEventListener('click', function() {
                if (insertActive || insertArr.length >= 10) return;
                var newVal = [0, 8, 2, 5, 11, 15][insertCount % 6];
                insertArr.push(newVal);
                renderInsertBoxes();
                var newBoxes = insertBoxesEl.querySelectorAll('.str-char-box');
                newBoxes[newBoxes.length - 1].classList.add('matched');
                insertMsgEl.textContent = 'Appended ' + newVal + ' to the end! Nothing to shift → O(1). Just add it at the back!';
                insertMidBtn.disabled = insertArr.length >= 10;
                insertEndBtn.disabled = insertArr.length >= 10;
                insertCount++;
            });

            insertResetBtn.addEventListener('click', function() {
                if (insertActive) {
                    resetInsertDemo();
                }
                insertArr = [3, 7, 1, 9, 4, 6];
                insertCount = 0;
                renderInsertBoxes();
                resetInsertDemo();
            });
        }

        // --- 3. Two Pointers Demo ---
        {
            var tpArr = [1, 2, 4, 6, 8, 10, 13, 15];
            var tpBoxesEl = container.querySelector('#arr-demo-tp-boxes');
            var tpPointersEl = container.querySelector('#arr-demo-tp-pointers');
            var tpStepBtn = container.querySelector('#arr-demo-tp-step');
            var tpResetBtn = container.querySelector('#arr-demo-tp-reset');
            var tpTargetEl = container.querySelector('#arr-demo-tp-target');
            var tpMsgEl = container.querySelector('#arr-demo-tp-msg');
            var tpL, tpR, tpDone;

            var renderTpBoxes = function() {
                tpBoxesEl.innerHTML = '';
                tpPointersEl.innerHTML = '';
                for (var i = 0; i < tpArr.length; i++) {
                    tpBoxesEl.appendChild(_mkBox(tpArr[i], i));
                    var ptr = document.createElement('span');
                    ptr.style.cssText = 'display:inline-block;width:44px;text-align:center;';
                    ptr.id = 'arr-demo-tp-ptr-' + i;
                    tpPointersEl.appendChild(ptr);
                }
            };

            var updateTpPointers = function() {
                for (var i = 0; i < tpArr.length; i++) {
                    var ptr = container.querySelector('#arr-demo-tp-ptr-' + i);
                    if (ptr) {
                        var labels = [];
                        if (i === tpL) labels.push('L');
                        if (i === tpR) labels.push('R');
                        ptr.textContent = labels.join(' ');
                        ptr.style.color = i === tpL ? 'var(--green)' : i === tpR ? 'var(--accent)' : '';
                    }
                }
                var boxes = tpBoxesEl.querySelectorAll('.str-char-box');
                boxes.forEach(function(b, idx) {
                    b.classList.remove('comparing', 'matched');
                    b.style.borderColor = '';
                    b.style.boxShadow = '';
                    if (idx === tpL) {
                        b.style.borderColor = 'var(--green)';
                        b.style.boxShadow = '0 0 8px rgba(0,184,148,0.4)';
                    }
                    if (idx === tpR) {
                        b.style.borderColor = 'var(--accent)';
                        b.style.boxShadow = '0 0 8px rgba(108,92,231,0.4)';
                    }
                });
            };

            var tpInit = function() {
                tpL = 0;
                tpR = tpArr.length - 1;
                tpDone = false;
                renderTpBoxes();
                updateTpPointers();
                tpStepBtn.disabled = false;
                tpMsgEl.textContent = '👆 Click "Next Step" to see how the L and R pointers move!';
            };
            tpInit();

            tpStepBtn.addEventListener('click', function() {
                if (tpDone || tpL >= tpR) {
                    tpMsgEl.textContent = 'Search is complete! Click 🔄 Reset to try again.';
                    tpStepBtn.disabled = true;
                    return;
                }
                var target = parseInt(tpTargetEl.value) || 10;
                var sum = tpArr[tpL] + tpArr[tpR];
                var boxes = tpBoxesEl.querySelectorAll('.str-char-box');

                if (sum === target) {
                    boxes[tpL].classList.add('matched');
                    boxes[tpR].classList.add('matched');
                    tpMsgEl.textContent = 'arr[' + tpL + '] + arr[' + tpR + '] = ' + tpArr[tpL] + ' + ' + tpArr[tpR] + ' = ' + sum + ' ✓ Found the answer!';
                    tpDone = true;
                    tpStepBtn.disabled = true;
                } else if (sum < target) {
                    boxes[tpL].classList.add('comparing');
                    boxes[tpR].classList.add('comparing');
                    tpMsgEl.textContent = 'arr[' + tpL + '] + arr[' + tpR + '] = ' + tpArr[tpL] + ' + ' + tpArr[tpR] + ' = ' + sum + ' < ' + target + ' → Sum too small, move L right!';
                    setTimeout(function() {
                        tpL++;
                        updateTpPointers();
                    }, 500);
                } else {
                    boxes[tpL].classList.add('comparing');
                    boxes[tpR].classList.add('comparing');
                    tpMsgEl.textContent = 'arr[' + tpL + '] + arr[' + tpR + '] = ' + tpArr[tpL] + ' + ' + tpArr[tpR] + ' = ' + sum + ' > ' + target + ' → Sum too large, move R left!';
                    setTimeout(function() {
                        tpR--;
                        updateTpPointers();
                    }, 500);
                }
            });

            tpResetBtn.addEventListener('click', function() {
                tpInit();
            });
        }
    },

    // ===== Visualization Tab =====
    renderVisualize(container) { container.innerHTML = ''; },

    // ===== Visualization: Two Sum (Hash Map) =====
    _renderVizTwoSum(container) {
        const self = this;
        self._clearVizState();

        const DEFAULT_ARR = [2, 7, 11, 4, 1, 5, 3, 8];

        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">Target sum:
                    <input type="number" id="arr-target" value="9"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;">
                    <button class="viz-input-reset" id="arr-viz-reset" title="Reset after input change">🔄</button>
                </label>
            </div>

            ${self._createStepDesc()}
            <div id="arr-sim-box" class="sim-card" style="overflow:visible;padding:0;position:relative;">
                <div id="arr-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>
                <div style="padding:24px;display:flex;flex-direction:column;align-items:center;gap:16px;">
                    <div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">
                        <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--accent);background:rgba(108,92,231,0.15);vertical-align:middle;"></span> Checking</span>
                        <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> Answer</span>
                    </div>
                    <div id="arr-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                    <div id="arr-pointer-info" style="font-size:1.1rem;font-weight:600;color:var(--text2);text-align:center;min-height:28px;"></div>
                </div>

                <div style="display:flex;gap:24px;padding:0 24px 16px;flex-wrap:wrap;">
                    <div style="flex:1;min-width:150px;">
                        <div style="font-weight:700;margin-bottom:6px;font-size:0.85rem;color:var(--text3);">seen (hash map)</div>
                        <div id="sw-seen" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 12px;font-family:'SF Mono','Consolas',monospace;font-size:0.85rem;">{ }</div>
                    </div>
                    <div style="flex:1;min-width:150px;">
                        <div style="font-weight:700;margin-bottom:6px;font-size:0.85rem;color:var(--text3);">Status</div>
                        <div id="arr-status" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">—</div>
                    </div>
                </div>

                <div id="arr-step-bar" style="display:flex;align-items:center;justify-content:center;gap:1rem;padding:12px 24px;border-top:1px solid var(--bg3);background:var(--bg1);">
                    <button id="arr-prev-btn" class="btn code-step-btn" disabled style="font-size:0.85rem;">← Prev</button>
                    <span id="arr-step-counter" style="font-size:0.85rem;font-weight:600;color:var(--accent);min-width:60px;text-align:center;">Before Start</span>
                    <button id="arr-next-btn" class="btn btn-primary code-step-btn" style="font-size:0.85rem;">Next →</button>
                </div>
            </div>
        `;

        const boxes = container.querySelector('#arr-boxes');
        const ptrEl = container.querySelector('#arr-pointer-info');
        const seenEl = container.querySelector('#sw-seen');
        const statusEl = container.querySelector('#arr-status');
        const flyEl = container.querySelector('#arr-fly');
        const wrapEl = container.querySelector('#arr-sim-box');

        function renderBoxes(arr) {
            boxes.innerHTML = '';
            arr.forEach((v, i) => {
                const box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = `<div class="str-char-idx">${i}</div><div class="str-char-val">${v}</div>`;
                boxes.appendChild(box);
            });
        }

        function setBoxState(idx, cls) {
            const box = boxes.querySelector(`[data-idx="${idx}"]`);
            if (box) box.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }

        function renderSeen(seen) {
            if (Object.keys(seen).length === 0) { seenEl.innerHTML = '{ }'; return; }
            seenEl.innerHTML = Object.entries(seen).map(([k, v]) =>
                `<span id="seen-key-${k}" style="background:rgba(0,0,0,0.05);padding:2px 8px;border-radius:5px;border:1px solid rgba(0,0,0,0.08);transition:all 0.3s;"><span style="color:#d63384;font-weight:600;">${k}</span><span style="color:#999;">:</span><span style="color:#0d6efd;">${v}</span></span>`
            ).join(' ');
        }

        function highlightSeenKey(key, found) {
            const el = seenEl.querySelector('#seen-key-' + key);
            if (found && el) {
                el.style.background = 'rgba(0,184,148,0.4)';
                el.style.transform = 'scale(1.15)';
                el.style.display = 'inline-block';
            } else {
                // not found — briefly dim all
                seenEl.querySelectorAll('span[id^="seen-key"]').forEach(s => { s.style.opacity = '0.4'; });
            }
        }

        function clearSeenHighlight() {
            seenEl.querySelectorAll('span[id^="seen-key"]').forEach(s => {
                s.style.background = 'rgba(0,0,0,0.05)'; s.style.transform = ''; s.style.opacity = '';
            });
        }

        function saveState() {
            return {
                boxClasses: Array.from(boxes.querySelectorAll('.str-char-box')).map(b => b.className),
                pointer: ptrEl.innerHTML,
                seen: seenEl.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            boxes.querySelectorAll('.str-char-box').forEach((b, i) => { b.className = s.boxClasses[i]; });
            ptrEl.innerHTML = s.pointer;
            seenEl.innerHTML = s.seen;
            statusEl.innerHTML = s.status;
        }

        renderBoxes(DEFAULT_ARR);

        const prevBtn = container.querySelector('#arr-prev-btn');
        const nextBtn = container.querySelector('#arr-next-btn');
        const stepCounter = container.querySelector('#arr-step-counter');
        const state = self._vizState;

        function buildSteps() {
            const target = parseInt(container.querySelector('#arr-target').value) || 9;
            const nums = DEFAULT_ARR;
            const steps = [];
            const seen = {};

            for (let idx = 0; idx < nums.length; idx++) {
                const i = idx, num = nums[i], comp = target - num;
                const found = seen.hasOwnProperty(comp);
                const foundIdx = found ? seen[comp] : -1;

                steps.push({
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        flyEl.innerHTML = '';
                        for (let j = 0; j < nums.length; j++) setBoxState(j, '');
                        setBoxState(i, 'current');
                        ptrEl.innerHTML = `Looking for complement <strong>${comp}</strong> of <strong>${num}</strong>…`;
                        if (found) {
                            highlightSeenKey(comp, true);
                            statusEl.innerHTML = `<span style="color:var(--green);">${comp} found! 🎉</span>`;
                        } else {
                            highlightSeenKey(comp, false);
                            statusEl.innerHTML = `<span style="color:var(--text3);">${comp} not found → save and move on</span>`;
                        }
                    },
                    undo: function() { flyEl.innerHTML = ''; restoreState(this._before); }
                });

                if (found) {
                    steps.push({
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            flyEl.innerHTML = '';
                            for (let j = 0; j < nums.length; j++) setBoxState(j, '');
                            setBoxState(foundIdx, 'matched');
                            setBoxState(i, 'matched');
                            clearSeenHighlight();
                            ptrEl.innerHTML = `<span style="color:var(--green);">${nums[foundIdx]} + ${num} = ${target} ✅</span>`;
                            statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;">Found! [${foundIdx}, ${i}]</span>`;
                        },
                        undo: function() { flyEl.innerHTML = ''; restoreState(this._before); }
                    });
                    break;
                } else {
                    const seenSnap = Object.assign({}, seen);
                    seenSnap[num] = i;
                    steps.push({
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            flyEl.innerHTML = '';
                            var srcBox = boxes.querySelector('[data-idx="' + i + '"]');
                            var srcRect = srcBox ? srcBox.getBoundingClientRect() : null;
                            clearSeenHighlight();
                            setBoxState(i, '');
                            renderSeen(seenSnap);
                            statusEl.innerHTML = `Saved ${num} to seen ✓`;
                            // Flying ghost: array box → hashmap entry
                            var dstKey = seenEl.querySelector('#seen-key-' + num);
                            if (srcRect && dstKey && wrapEl) {
                                var wr = wrapEl.getBoundingClientRect();
                                var dr = dstKey.getBoundingClientRect();
                                dstKey.style.opacity = '0';
                                var ghost = document.createElement('div');
                                ghost.textContent = num;
                                ghost.style.cssText = 'position:absolute;z-index:20;padding:4px 10px;' +
                                    'left:' + (srcRect.left - wr.left) + 'px;top:' + (srcRect.top - wr.top) + 'px;' +
                                    'font-weight:700;font-size:0.9rem;background:var(--accent);color:white;border-radius:8px;' +
                                    'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
                                flyEl.appendChild(ghost);
                                requestAnimationFrame(function() { requestAnimationFrame(function() {
                                    ghost.style.left = (dr.left - wr.left) + 'px';
                                    ghost.style.top = (dr.top - wr.top) + 'px';
                                }); });
                                setTimeout(function() {
                                    if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                                    if (dstKey) {
                                        dstKey.style.opacity = '1';
                                        dstKey.style.background = 'rgba(108,92,231,0.3)';
                                        dstKey.style.transform = 'scale(1.15)';
                                        dstKey.style.display = 'inline-block';
                                        setTimeout(function() {
                                            dstKey.style.background = 'rgba(0,0,0,0.05)';
                                            dstKey.style.transform = '';
                                        }, 400);
                                    }
                                }, 550);
                            }
                        },
                        undo: function() { flyEl.innerHTML = ''; restoreState(this._before); }
                    });
                    seen[num] = i;
                }
            }
            return steps;
        }

        function resetAll() {
            state.steps = [];
            state.currentStep = -1;
            flyEl.innerHTML = '';
            renderBoxes(DEFAULT_ARR);
            ptrEl.textContent = ''; seenEl.innerHTML = '{ }'; statusEl.textContent = '—';
            stepCounter.textContent = 'Before Start';
            prevBtn.disabled = true;
            nextBtn.disabled = false;
            nextBtn.textContent = 'Next →';
        }

        function updateUI() {
            const idx = state.currentStep;
            const total = state.steps.length;
            prevBtn.disabled = idx <= 0;
            nextBtn.disabled = idx >= total - 1;
            if (idx >= 0) {
                stepCounter.textContent = `${idx + 1} / ${total}`;
            }
            if (idx >= total - 1) {
                nextBtn.disabled = false;
                nextBtn.textContent = '▶ Replay';
            } else {
                nextBtn.textContent = 'Next →';
            }
        }

        // Next button
        nextBtn.addEventListener('click', function() {
            // First click: build steps
            if (state.steps.length === 0) {
                renderBoxes(DEFAULT_ARR);
                ptrEl.textContent = ''; seenEl.innerHTML = '{ }'; statusEl.textContent = 'Ready to search';
                state.steps = buildSteps();
                state.currentStep = -1;
            }
            // Reset if at last step
            if (state.currentStep >= state.steps.length - 1) {
                resetAll();
                return;
            }
            state.currentStep++;
            state.steps[state.currentStep].action();
            updateUI();
        });

        // Previous button
        prevBtn.addEventListener('click', function() {
            if (state.currentStep > 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
                updateUI();
            }
        });

        // Reset button
        container.querySelector('#arr-viz-reset').addEventListener('click', resetAll);

        // Keyboard support
        state.keydownHandler = function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ') { nextBtn.click(); e.preventDefault(); }
            if (e.key === 'ArrowLeft') { prevBtn.click(); e.preventDefault(); }
        };
        document.addEventListener('keydown', state.keydownHandler);
    },

    // ===== Visualization State Management =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null, buildSteps: null },

    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1; s.buildSteps = null;
        // Clean up hint mini simulations
        document.querySelectorAll('.hint-step').forEach(function(step) {
            if (step._vizCtrl && step._vizCtrl.destroy) { step._vizCtrl.destroy(); step._vizCtrl = null; }
        });
    },

    _createStepDesc(suffix) {
        const s = suffix || '';
        return `<div class="viz-step-desc" data-role="desc" data-step-group="${s}" style="display:none;"></div>`;
    },
    _createStepControls(suffix) {
        const s = suffix || '';
        return `
            <div class="viz-step-controls initial-state" data-step-group="${s}">
                <button class="btn viz-step-btn viz-step-prev" data-role="prev" disabled>&larr; Prev</button>
                <span class="viz-step-counter" data-role="counter"></span>
                <button class="btn btn-primary viz-step-btn" data-role="next">Next &rarr;</button>
            </div>
        `;
    },

    // stepsOrFn: steps array or buildSteps callback function
    _initStepController(el, stepsOrFn, suffix) {
        const state = this._vizState;
        // Clean up existing keyboard handler
        if (state.keydownHandler) {
            document.removeEventListener('keydown', state.keydownHandler);
            state.keydownHandler = null;
        }
        const group = suffix || '';
        const isLazy = typeof stepsOrFn === 'function';
        state.steps = isLazy ? [] : stepsOrFn;
        state.buildSteps = isLazy ? stepsOrFn : null;
        state.currentStep = -1;

        const controls = el.querySelector(`.viz-step-controls[data-step-group="${group}"]`);
        const prevBtn = controls.querySelector('[data-role="prev"]');
        const nextBtn = controls.querySelector('[data-role="next"]');
        const counter = controls.querySelector('[data-role="counter"]');
        const desc = el.querySelector(`.viz-step-desc[data-step-group="${group}"]`);

        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            const isInitial = idx < 0;
            const isLast = total > 0 && idx >= total - 1;

            // Initial state toggle
            controls.classList.toggle('initial-state', isInitial);

            // Previous button
            prevBtn.disabled = (idx <= 0);

            // Next/restart button
            if (isLast) {
                nextBtn.innerHTML = '🔄 Restart';
                nextBtn.classList.remove('btn-primary');
                nextBtn.classList.add('restart-btn');
                nextBtn.disabled = false;
            } else {
                nextBtn.innerHTML = 'Next &rarr;';
                nextBtn.classList.add('btn-primary');
                nextBtn.classList.remove('restart-btn');
                nextBtn.disabled = false;
            }

            // Counter + description
            if (isInitial) {
                counter.textContent = '';
                if (desc) desc.style.display = 'none';
            } else {
                counter.textContent = `${idx + 1} / ${total}`;
                if (desc) { desc.textContent = state.steps[idx].description; desc.style.display = ''; }
            }
        };

        var actionDelay = 350;
        nextBtn.addEventListener('click', () => {
            // Last step → Restart
            if (state.steps.length > 0 && state.currentStep >= state.steps.length - 1) {
                while (state.currentStep >= 0) {
                    if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                    state.currentStep--;
                }
                if (state.buildSteps) state.steps = [];
                updateUI();
                return;
            }
            // Initial state + lazy → build steps
            if (state.currentStep === -1 && state.buildSteps && state.steps.length === 0) {
                state.steps = state.buildSteps();
                if (!state.steps || state.steps.length === 0) return;
            }
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            updateUI();
            setTimeout(() => { state.steps[state.currentStep].action(); }, actionDelay);
        });

        prevBtn.addEventListener('click', () => {
            if (state.currentStep <= 0) {
                // Step 0, go prev → back to initial state
                var stepToUndo = state.currentStep;
                state.currentStep = -1;
                updateUI();
                setTimeout(() => {
                    if (stepToUndo === 0 && state.steps[0] && state.steps[0].undo) state.steps[0].undo();
                    if (state.buildSteps) state.steps = [];
                }, actionDelay);
                return;
            }
            var stepToUndo = state.currentStep;
            state.currentStep--;
            updateUI();
            setTimeout(() => { if (state.steps[stepToUndo] && state.steps[stepToUndo].undo) state.steps[stepToUndo].undo(); }, actionDelay);
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

    // ===== Visualization: Best Time to Buy and Sell Stock =====
    _renderVizStock(container) {
        const self = this;
        self._clearVizState();
        const PRICES = [7, 1, 5, 3, 6, 4, 2, 8, 1];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Prices: <input type="text" id="stock-input" value="7, 1, 5, 3, 6, 4, 2, 8, 1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;">' +
            '<button class="viz-input-reset" id="stock-reset" title="Reset after input change">🔄</button></label></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> Checking</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> Min Price</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--accent);background:rgba(108,92,231,0.15);vertical-align:middle;"></span> Best Sell</span></div>' +
            '<div id="stock-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Min Price</div>' +
            '<div id="stock-min" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Current Profit</div>' +
            '<div id="stock-profit" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Max Profit</div>' +
            '<div id="stock-maxprofit" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

        const boxes = container.querySelector('#stock-boxes');
        const minEl = container.querySelector('#stock-min');
        const profitEl = container.querySelector('#stock-profit');
        const maxProfitEl = container.querySelector('#stock-maxprofit');

        function renderBoxes(data) {
            boxes.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">Day ' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxes.appendChild(box);
            });
        }
        function setBoxState(idx, cls) { var b = boxes.querySelector('[data-idx="' + idx + '"]'); if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : ''); }
        function saveState(data) {
            return { boxClasses: Array.from(boxes.querySelectorAll('.str-char-box')).map(function(b){return b.className;}), min: minEl.innerHTML, profit: profitEl.innerHTML, maxP: maxProfitEl.innerHTML };
        }
        function restoreState(s) {
            boxes.querySelectorAll('.str-char-box').forEach(function(b,i){ b.className = s.boxClasses[i]; });
            minEl.innerHTML = s.min; profitEl.innerHTML = s.profit; maxProfitEl.innerHTML = s.maxP;
        }

        function buildSteps() {
            var input = container.querySelector('#stock-input').value;
            var data = input.split(',').map(function(s){ return parseInt(s.trim()); }).filter(function(n){ return !isNaN(n); });
            if (data.length < 2) { data = PRICES; }
            renderBoxes(data);
            minEl.textContent = '—'; profitEl.textContent = '—'; maxProfitEl.textContent = '—';

            var minPrice = Infinity, maxProfit = 0, minIdx = -1, bestBuy = -1, bestSell = -1;
            var steps = [];

            data.forEach(function(price, i) {
                var curMin = minPrice, curMinIdx = minIdx, curMax = maxProfit, curBestBuy = bestBuy, curBestSell = bestSell;
                var newMin = false, newProfit = false;
                if (price < minPrice) { minPrice = price; minIdx = i; newMin = true; }
                var profit = price - minPrice;
                if (profit > maxProfit) { maxProfit = profit; bestBuy = minIdx; bestSell = i; newProfit = true; }
                var _i = i, _price = price, _minPrice = minPrice, _minIdx = minIdx, _profit = profit, _maxProfit = maxProfit, _newMin = newMin, _newProfit = newProfit, _bestBuy = bestBuy, _bestSell = bestSell;

                steps.push({
                    description: _newProfit ? 'Profit ' + _profit + ' → new best! 🎉' : _newMin ? 'Lowest price ' + _price + ' → buy here! 🏷️' : _profit > 0 ? 'Profit ' + _profit + ', not beating best (' + _maxProfit + ')' : 'No profit, skip',
                    _before: null,
                    action: function() {
                        this._before = saveState(data);
                        for (var j = 0; j < data.length; j++) setBoxState(j, '');
                        setBoxState(_minIdx, 'matched');
                        setBoxState(_i, 'comparing');
                        if (_bestSell >= 0 && _bestSell !== _i) setBoxState(_bestSell, 'visited');
                        minEl.innerHTML = '<strong>' + _minPrice + '</strong> (Day ' + _minIdx + ')';
                        profitEl.innerHTML = _price + ' - ' + _minPrice + ' = <strong>' + _profit + '</strong>';
                        maxProfitEl.innerHTML = '<strong>' + _maxProfit + '</strong>' + (_bestBuy >= 0 ? ' (Day ' + _bestBuy + '→' + _bestSell + ')' : '');
                    },
                    undo: function() { restoreState(this._before); }
                });
            });

            return steps;
        }

        // 🔄 Reset button
        container.querySelector('#stock-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderBoxes(PRICES);
            minEl.textContent = '—'; profitEl.textContent = '—'; maxProfitEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(PRICES);
        self._initStepController(container, buildSteps);
    },

    // ===== Visualization: 3Sum =====
    _renderViz3Sum(container) {
        const self = this;
        self._clearVizState();
        const DEFAULT_DATA = [-1, 0, 1, 2, -1, -4, 3, -2];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="three-input" value="-1, 0, 1, 2, -1, -4, 3, -2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;">' +
            '<button class="viz-input-reset" id="three-reset" title="Reset after input change">🔄</button></label></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid #e17055;background:rgba(225,112,85,0.2);vertical-align:middle;"></span> i (fixed)</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> L / R</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> Found</span></div>' +
            '<div id="three-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="three-pointer" style="font-size:0.95rem;font-weight:600;color:var(--text2);text-align:center;min-height:24px;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Current Sum</div>' +
            '<div id="three-sum" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Found Triplets</div>' +
            '<div id="three-results" style="font-weight:600;font-size:0.9rem;color:var(--text2);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

        var boxesEl = container.querySelector('#three-boxes');
        var ptrEl = container.querySelector('#three-pointer');
        var sumEl = container.querySelector('#three-sum');
        var resultsEl = container.querySelector('#three-results');

        function renderBoxes(data) {
            boxesEl.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxesEl.appendChild(box);
            });
        }
        function setBoxState(idx, cls) { var b = boxesEl.querySelector('[data-idx="' + idx + '"]'); if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : ''); }
        function saveState() {
            return { bc: Array.from(boxesEl.querySelectorAll('.str-char-box')).map(function(b){return b.className;}), ptr: ptrEl.innerHTML, sum: sumEl.innerHTML, res: resultsEl.innerHTML };
        }
        function restoreState(s) {
            boxesEl.querySelectorAll('.str-char-box').forEach(function(b,i){b.className=s.bc[i];}); ptrEl.innerHTML=s.ptr; sumEl.innerHTML=s.sum; resultsEl.innerHTML=s.res;
        }

        function buildSteps() {
            var input = container.querySelector('#three-input').value;
            var data = input.split(',').map(function(s){return parseInt(s.trim());}).filter(function(n){return !isNaN(n);});
            if (data.length < 3) data = DEFAULT_DATA.slice();
            data.sort(function(a,b){return a-b;});
            renderBoxes(data);
            ptrEl.textContent = ''; sumEl.textContent = '—'; resultsEl.textContent = '—';

            var steps = [];
            var foundResults = [];

            // helper: show negative in parentheses
            function fv(v) { return v < 0 ? '(' + v + ')' : '' + v; }

            // Step 1: sort
            steps.push({
                description: 'First, sort the array',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = 'Sort complete';
                    sumEl.textContent = '—'; resultsEl.textContent = '—';
                },
                undo: function() { restoreState(this._before); }
            });

            for (var i = 0; i < data.length - 2; i++) {
                // Skip duplicate i
                if (i > 0 && data[i] === data[i-1]) {
                    let _i = i;
                    steps.push({
                        description: 'i=' + _i + ' same as previous value, skip',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_i, 'fixed');
                            ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + ' (skip duplicate)</span>';
                            sumEl.textContent = '—';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    continue;
                }

                var left = i + 1, right = data.length - 1;

                // Fix i + set up pointers step
                (function(_i, _l, _r) {
                    steps.push({
                        description: 'i=' + _i + ' (' + data[_i] + ') fixed, narrowing from both sides',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_i, 'fixed');
                            setBoxState(_l, 'comparing');
                            setBoxState(_r, 'comparing');
                            ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--yellow);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                            sumEl.textContent = '—';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                })(i, left, right);

                while (left < right) {
                    var s = data[i] + data[left] + data[right];
                    let _i = i, _l = left, _r = right, _s = s, _match = (s === 0);
                    let _foundBefore = foundResults.slice();

                    if (_match) {
                        let _foundAfter = _foundBefore.slice();
                        _foundAfter.push('[' + data[_i] + ',' + data[_l] + ',' + data[_r] + ']');

                        steps.push({
                            description: 'Sum = 0! Triplet found! 🎉',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(_i, 'matched');
                                setBoxState(_l, 'matched');
                                setBoxState(_r, 'matched');
                                ptrEl.innerHTML = '<span style="color:var(--green);">i=' + _i + '</span> &nbsp; <span style="color:var(--green);">L=' + _l + '</span> &nbsp; <span style="color:var(--green);">R=' + _r + '</span>';
                                sumEl.innerHTML = data[_i] + ' + ' + fv(data[_l]) + ' + ' + fv(data[_r]) + ' = <strong style="color:var(--green);">0</strong>';
                                resultsEl.innerHTML = _foundAfter.join(', ');
                            },
                            undo: function() { restoreState(this._before); }
                        });

                        foundResults.push('[' + data[i] + ',' + data[left] + ',' + data[right] + ']');
                        while (left < right && data[left] === data[left+1]) left++;
                        while (left < right && data[right] === data[right-1]) right--;
                        left++; right--;
                    } else if (s < 0) {
                        let _foundCopy = _foundBefore.slice();
                        steps.push({
                            description: 'Sum =' + _s + ' → Too small! Move L right',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(_i, 'fixed');
                                setBoxState(_l, 'comparing');
                                setBoxState(_r, 'comparing');
                                ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--yellow);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                                sumEl.innerHTML = data[_i] + ' + ' + fv(data[_l]) + ' + ' + fv(data[_r]) + ' = <strong>' + _s + '</strong>';
                                resultsEl.innerHTML = _foundCopy.length > 0 ? _foundCopy.join(', ') : '—';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                        left++;
                    } else {
                        let _foundCopy = _foundBefore.slice();
                        steps.push({
                            description: 'Sum =' + _s + ' → Too large! Move R left',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(_i, 'fixed');
                                setBoxState(_l, 'comparing');
                                setBoxState(_r, 'comparing');
                                ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--yellow);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                                sumEl.innerHTML = data[_i] + ' + ' + fv(data[_l]) + ' + ' + fv(data[_r]) + ' = <strong>' + _s + '</strong>';
                                resultsEl.innerHTML = _foundCopy.length > 0 ? _foundCopy.join(', ') : '—';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                        right--;
                    }
                }
            }

            // Final completion step
            var _finalResults = foundResults.slice();
            steps.push({
                description: 'Done! ' + (_finalResults.length > 0 ? _finalResults.length + ' triplet(s) found' : 'No triplets found'),
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '<span style="color:var(--green);">✓ Search complete</span>';
                    sumEl.textContent = '—';
                    resultsEl.innerHTML = _finalResults.length > 0 ? _finalResults.join(', ') : 'None';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // 🔄 Reset button
        container.querySelector('#three-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderBoxes(DEFAULT_DATA);
            ptrEl.textContent = ''; sumEl.textContent = '—'; resultsEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(DEFAULT_DATA);
        self._initStepController(container, buildSteps);
    },

    // ===== Visualization: Sliding Window (Sum of Numbers) =====
    _renderVizSlidingWindow(container) {
        const self = this;
        self._clearVizState();
        const DEFAULT_ARR = [1, 2, 3, 1, 1, 2, 1, 3];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="sw-arr" value="1, 2, 3, 1, 1, 2, 1, 3" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<label style="font-weight:600;">Target Sum M: <input type="number" id="sw-target" value="5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="viz-input-reset" id="sw-reset" title="Reset after input change">🔄</button></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> Window</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> Sum = M</span></div>' +
            '<div id="sw-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="sw-pointer" style="font-size:0.95rem;font-weight:600;color:var(--text2);text-align:center;min-height:24px;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:100px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Subarray Sum</div>' +
            '<div id="sw-sum" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:100px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Match Count</div>' +
            '<div id="sw-count" style="font-weight:700;font-size:1.1rem;color:var(--text);">0</div></div>' +
            '<div style="flex:1;min-width:100px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Status</div>' +
            '<div id="sw-status" style="font-weight:600;font-size:0.9rem;color:var(--text2);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

        var boxesEl = container.querySelector('#sw-boxes');
        var ptrEl = container.querySelector('#sw-pointer');
        var sumEl = container.querySelector('#sw-sum');
        var countEl = container.querySelector('#sw-count');
        var statusEl = container.querySelector('#sw-status');

        function renderBoxes(data) {
            boxesEl.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxesEl.appendChild(box);
            });
        }
        function setBoxState(idx, cls) { var b = boxesEl.querySelector('[data-idx="' + idx + '"]'); if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : ''); }
        function saveState() {
            return { bc: Array.from(boxesEl.querySelectorAll('.str-char-box')).map(function(b){return b.className;}), ptr: ptrEl.innerHTML, sum: sumEl.innerHTML, cnt: countEl.innerHTML, st: statusEl.innerHTML };
        }
        function restoreState(s) {
            boxesEl.querySelectorAll('.str-char-box').forEach(function(b,i){b.className=s.bc[i];}); ptrEl.innerHTML=s.ptr; sumEl.innerHTML=s.sum; countEl.innerHTML=s.cnt; statusEl.innerHTML=s.st;
        }

        function buildSteps() {
            var input = container.querySelector('#sw-arr').value;
            var data = input.split(',').map(function(s){return parseInt(s.trim());}).filter(function(n){return !isNaN(n);});
            if (data.length < 1) data = DEFAULT_ARR.slice();
            var M = parseInt(container.querySelector('#sw-target').value) || 3;
            renderBoxes(data);
            ptrEl.textContent = ''; sumEl.textContent = '—'; countEl.textContent = '0'; statusEl.textContent = '—';

            var steps = [];
            var start = 0, end = 0, curSum = 0, count = 0;

            // Step 0: initial state
            steps.push({
                description: 'Find contiguous subarrays summing to ' + M + ' in [' + data.join(', ') + ']!',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '<span style="color:var(--green);">start=0</span> &nbsp; <span style="color:var(--accent);">end=0</span>';
                    sumEl.textContent = '0'; countEl.textContent = '0'; statusEl.textContent = 'Two pointers ready!';
                },
                undo: function() { restoreState(this._before); }
            });

            while (true) {
                if (curSum >= M) {
                    let _s = start, _e = end, _sum = curSum, _matched = (curSum === M);
                    if (_matched) {
                        count++;
                        // Match found step (green)
                        let _cnt = count;
                        let windowStr = '[' + data.slice(_s, _e).join(', ') + ']';
                        steps.push({
                            description: '🎉 ' + windowStr + ' = ' + _sum + ' Found! (count=' + _cnt + ')',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                for (var j = _s; j < _e; j++) setBoxState(j, 'matched');
                                ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + '</span> &nbsp; <span style="color:var(--accent);">end=' + _e + '</span>';
                                sumEl.innerHTML = '<strong style="color:var(--green);">' + _sum + '</strong>';
                                countEl.innerHTML = '<strong style="color:var(--green);">' + _cnt + '</strong>';
                                statusEl.innerHTML = '<span style="color:var(--green);">✓ Sum =' + M + '! count++</span>';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                    }
                    // Move start step
                    let _cnt2 = count, _removeVal = data[start];
                    let _sAfter = start + 1;
                    steps.push({
                        description: (_matched ? 'To find next subarray,' : 'Sum(' + _sum + ') > M(' + M + '), so') + ' remove arr[' + _s + ']=' + _removeVal + ' → move start',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_s, 'removing');
                            for (var j = _sAfter; j < _e; j++) setBoxState(j, 'comparing');
                            ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + ' → ' + _sAfter + '</span> &nbsp; <span style="color:var(--accent);">end=' + _e + '</span>';
                            sumEl.innerHTML = '<strong>' + (_sum - _removeVal) + '</strong>';
                            countEl.innerHTML = '<strong>' + _cnt2 + '</strong>';
                            statusEl.innerHTML = _sum + ' - ' + _removeVal + ' = ' + (_sum - _removeVal);
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    curSum -= data[start]; start++;
                } else if (end >= data.length) {
                    break;
                } else {
                    let _s = start, _e = end, _val = data[end];
                    curSum += data[end]; end++;
                    let _sum = curSum, _endAfter = end;
                    let windowStr = '[' + data.slice(_s, _endAfter).join(', ') + ']';
                    let desc = 'arr[' + _e + ']=' + _val + ' added → ' + windowStr + ' Sum =' + _sum;
                    if (_sum < M) desc += ' (Less than M, keep expanding!)';
                    else if (_sum === M) desc += ' (Exact match!)';
                    steps.push({
                        description: desc, _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            for (var j = _s; j < _endAfter; j++) setBoxState(j, 'comparing');
                            ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + '</span> &nbsp; <span style="color:var(--accent);">end=' + _endAfter + '</span>';
                            sumEl.innerHTML = '<strong>' + _sum + '</strong>';
                            statusEl.innerHTML = _sum < M ? 'Sum < M → expand right!' : _sum === M ? 'Sum = M! Check in next step' : 'Sum ≥ M → need to shrink';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                }
            }

            // Final completion step
            let _finalCount = count;
            steps.push({
                description: '✅ Search complete! Contiguous subarrays with sum ' + M + ' = total ' + _finalCount,
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '<span style="color:var(--green);">✓ Search complete</span>';
                    sumEl.textContent = '—';
                    countEl.innerHTML = '<strong style="color:var(--green);font-size:1.3rem;">' + _finalCount + '</strong>';
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.05rem;">✓ Found ' + _finalCount + ' total!</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // 🔄 Reset button
        container.querySelector('#sw-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderBoxes(DEFAULT_ARR);
            ptrEl.textContent = ''; sumEl.textContent = '—'; countEl.textContent = '0'; statusEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(DEFAULT_ARR);
        self._initStepController(container, buildSteps);
    },

    // ===== Problems tab =====
    stages: [
        { num: 1, title: 'Array Basics', desc: 'Single pass, Two Pointers basics (Easy~Silver)', problemIds: ['lc-1', 'lc-121'] },
        { num: 2, title: 'Array Advanced', desc: 'Advanced Two Pointers, preprocessing (Medium~Gold)', problemIds: ['lc-15', 'boj-2003'] }
    ],

    problems: [
        {
            id: 'lc-1',
            title: 'LeetCode 1 - Two Sum',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/two-sum/',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an array of integers <code>nums</code> and an integer <code>target</code>,
                return <strong>indices of the two numbers</strong> such that they add up to <code>target</code>.</p>
                <p>You may not use the same element twice, and exactly one answer exists.
                You may return the answer in any order.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [2,7,11,15], target = 9</pre></div>
                    <div><strong>Output</strong><pre>[0, 1]</pre></div>
                </div>
                <p class="example-explain">Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1].</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [3,2,4], target = 6</pre></div>
                    <div><strong>Output</strong><pre>[1, 2]</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [3,3], target = 6</pre></div>
                    <div><strong>Output</strong><pre>[0, 1]</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ nums.length ≤ 10<sup>4</sup></li>
                    <li>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li>
                    <li>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></li>
                    <li>Exactly one valid answer exists.</li>
                </ul>

                <div class="hint-key">💡 Follow-up</div>
                <p>Can you come up with an algorithm that is better than O(n²)?</p>
            `,
            inputDefault: 0,
            solve() { return '[0, 1]'; },
            templates: {
                python: `class Solution:
    def twoSum(self, nums, target):
        seen = {}  # value → index
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i`,
                cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums[i];
            if (seen.count(comp)) return {seen[comp], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check all pairs with nested loops to find a pair that sums to target',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                hints: [
                    { title: 'First thought: Nested loops', content: '<div class="hint-key">💡 Simplest approach: Check every pair!</div><p>Compare all two-number combinations in the array one by one.</p><span class="lang-py"><pre><code class="language-python">for i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n        if nums[i] + nums[j] == target:\n            return [i, j]</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">for (int i = 0; i < nums.size(); i++)\n    for (int j = i+1; j < nums.size(); j++)\n        if (nums[i] + nums[j] == target)\n            return {i, j};</code></pre></span>' },
                    {
                        title: 'Try it yourself',
                        content: '<div class="hint-key">🔍 Find it with Brute Force!</div><div class="hint-sub">Tap to compare one pair at a time</div>',
                        viz: function(container) {
                            var nums = [1, 3, 4, 9, 2, 7], target = 9;
                            container.setAttribute('data-clickable', '');
                            container.innerHTML =
                                '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                                '<div class="hint-viz-cells"></div>' +
                                '<div class="hint-viz-msg"></div>' +
                                '<div class="hint-viz-tap">👆 Tap for next comparison</div>' +
                                '<div class="hint-viz-replay" style="display:none"><button>▶ From start</button></div>';
                            var cellsEl = container.querySelector('.hint-viz-cells');
                            var msgEl = container.querySelector('.hint-viz-msg');
                            var tapEl = container.querySelector('.hint-viz-tap');
                            var replayEl = container.querySelector('.hint-viz-replay');
                            nums.forEach(function(v, i) {
                                var cell = document.createElement('div');
                                cell.className = 'hint-viz-cell';
                                cell.dataset.idx = i;
                                cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                                cellsEl.appendChild(cell);
                            });
                            function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                            function clearCells() {
                                cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                            }
                            // Generate all brute force pairs
                            var pairs = [];
                            for (var i = 0; i < nums.length; i++) {
                                for (var j = i + 1; j < nums.length; j++) {
                                    pairs.push([i, j]);
                                    if (nums[i] + nums[j] === target) { i = nums.length; break; }
                                }
                            }
                            var si = 0, done = false, timer = null;
                            function advance() {
                                if (done) return;
                                if (si >= pairs.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                                var pi = pairs[si][0], pj = pairs[si][1];
                                var sum = nums[pi] + nums[pj];
                                var isMatch = sum === target;
                                var c = si + 1;
                                // Compare: yellow highlight
                                clearCells();
                                getCell(pi).classList.add('comparing');
                                getCell(pj).classList.add('comparing');
                                msgEl.innerHTML = '<span style="color:var(--text3)">#' + c + '</span> i=' + pi + ', j=' + pj + ': <strong>' + nums[pi] + ' + ' + nums[pj] + ' = ' + sum + '</strong>';
                                // Show result after short delay
                                clearTimeout(timer);
                                timer = setTimeout(function() {
                                    if (isMatch) {
                                        getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                        getCell(pi).classList.add('matched'); getCell(pj).classList.add('matched');
                                        msgEl.innerHTML = '<span class="viz-result">✅ Found! [' + pi + ', ' + pj + '] — ' + c + ' comparisons</span>';
                                        done = true; tapEl.style.display = 'none'; replayEl.style.display = '';
                                    } else {
                                        getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                        getCell(pi).classList.add('mismatch'); getCell(pj).classList.add('mismatch');
                                        msgEl.innerHTML += ' ❌';
                                    }
                                }, 400);
                                si++;
                            }
                            function reset() {
                                clearTimeout(timer); si = 0; done = false;
                                clearCells(); msgEl.innerHTML = '';
                                tapEl.style.display = ''; replayEl.style.display = 'none';
                            }
                            container.addEventListener('click', function(e) {
                                if (e.target.closest('.hint-viz-replay')) return;
                                advance();
                            });
                            replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                            return {
                                stop: function() { clearTimeout(timer); },
                                reset: function() { reset(); },
                                play: function() {},
                                destroy: function() { clearTimeout(timer); }
                            };
                        }
                    }
                ],
                limitation: '<p>If n is <strong>10,000</strong>, that\'s about <strong>50 million</strong> comparisons! 😱</p><p>Having to scan all remaining numbers every time causes TLE.</p><div class="hint-key">💡 "What if we could remember numbers we\'ve already seen?"</div>',
                templates: {
                    python: `class Solution:\n    def twoSum(self, nums, target):\n        for i in range(len(nums)):\n            for j in range(i + 1, len(nums)):\n                if nums[i] + nums[j] == target:\n                    return [i, j]`,
                    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        for (int i = 0; i < nums.size(); i++) {\n            for (int j = i + 1; j < nums.size(); j++) {\n                if (nums[i] + nums[j] == target)\n                    return {i, j};\n            }\n        }\n        return {};\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Pick first number', desc: 'Fix the first number one at a time\nto check all possible pairs.', code: 'class Solution:\n    def twoSum(self, nums, target):\n        # Check all pairs (i, j) → O(n²)\n        for i in range(len(nums)):' },
                        { title: 'Search second number', desc: 'Only check numbers after i.\nStarting from j = i+1 → never check the same pair twice!', code: '            for j in range(i + 1, len(nums)):' },
                        { title: 'Check sum + return', desc: 'If the two numbers sum to target, return indices immediately!\nThe problem guarantees "exactly one answer exists", so we can return right away.', code: '                if nums[i] + nums[j] == target:\n                    return [i, j]' }
                    ],
                    cpp: [
                        { title: 'Pick first number', desc: 'Fix i to check all pairs.\nO(n²) but the most intuitive approach.', code: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Check all pairs (i, j) → O(n²)\n        for (int i = 0; i < nums.size(); i++) {' },
                        { title: 'Search second number', desc: 'Start from j = i+1 → never check the same pair twice', code: '            for (int j = i + 1; j < nums.size(); j++) {' },
                        { title: 'Check sum + return', desc: 'If sum equals target, return immediately!', code: '                if (nums[i] + nums[j] == target)\n                    return {i, j};\n            }\n        }\n        return {};\n    }\n};' }
                    ]
                }
            }, {
                approach: 'HashMap',
                description: 'Single pass using a hash map (dictionary) to check for complement',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                hints: [
                    { title: 'Key idea: Remember the "complement"!', content: '<div class="hint-key">💡 target - num = complement</div><p>For each number, calculate <strong>target - that number = complement</strong>,<br>then check if the complement exists among previously seen numbers using a <strong>hash map in O(1)</strong>!</p>' },
                    {
                        title: 'HashMap in one pass!',
                        content: '<div class="hint-key">✨ Find the "complement" with a hash map</div><div class="hint-sub">Instantly check if each number\'s complement has already appeared!<br>Brute force: 15 comparisons vs hash map: how many? Tap to compare!</div>',
                        viz: function(container) {
                            var nums = [1, 3, 4, 9, 2, 7], target = 9;
                            container.setAttribute('data-clickable', '');
                            container.innerHTML =
                                '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                                '<div class="hint-viz-split">' +
                                '  <div><div class="hint-viz-label" style="margin-bottom:4px">Array</div><div class="hint-viz-cells"></div></div>' +
                                '  <div><div class="hint-viz-label" style="margin-bottom:4px">seen { }</div><div class="hint-viz-hashmap"></div></div>' +
                                '</div>' +
                                '<div class="hint-viz-msg"></div>' +
                                '<div class="hint-viz-tap">👆 Tap for next step</div>' +
                                '<div class="hint-viz-replay" style="display:none"><button>▶ From start</button></div>';
                            var cellsEl = container.querySelector('.hint-viz-cells');
                            var hmEl = container.querySelector('.hint-viz-hashmap');
                            var msgEl = container.querySelector('.hint-viz-msg');
                            var tapEl = container.querySelector('.hint-viz-tap');
                            var replayEl = container.querySelector('.hint-viz-replay');
                            nums.forEach(function(v, i) {
                                var cell = document.createElement('div');
                                cell.className = 'hint-viz-cell';
                                cell.dataset.idx = i;
                                cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                                cellsEl.appendChild(cell);
                            });
                            function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                            function clearCells() {
                                cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                            }
                            function addHmRow(key, val) {
                                var row = document.createElement('div');
                                row.className = 'hm-row';
                                row.dataset.key = key;
                                row.innerHTML = '<span class="hm-key">' + key + '</span><span class="hm-val">→ ' + val + '</span>';
                                hmEl.appendChild(row);
                            }
                            function clearHmHighlight() {
                                hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.remove('hm-found', 'hm-miss'); });
                            }
                            function highlightHmRow(key, found) {
                                clearHmHighlight();
                                if (found) {
                                    var row = hmEl.querySelector('[data-key="' + key + '"]');
                                    if (row) row.classList.add('hm-found');
                                } else {
                                    hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.add('hm-miss'); });
                                }
                            }
                            // Pre-generate steps
                            var steps = [], seen = {}, foundI = -1, foundJ = -1;
                            for (var idx = 0; idx < nums.length; idx++) {
                                (function(i) {
                                    var num = nums[i], comp = target - num;
                                    if (seen.hasOwnProperty(comp)) {
                                        foundI = seen[comp]; foundJ = i;
                                        steps.push(function() {
                                            clearCells(); getCell(i).classList.add('current');
                                            highlightHmRow(comp, true);
                                            msgEl.innerHTML = '<strong>' + num + '</strong>\\\'s complement = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 searching seen… ✨ <strong>Found!</strong>';
                                        });
                                        steps.push(function() {
                                            clearHmHighlight();
                                            getCell(foundI).classList.add('matched');
                                            getCell(i).classList.remove('current'); getCell(i).classList.add('matched');
                                            msgEl.innerHTML = '<span class="viz-result">✅ Answer! [' + foundI + ', ' + i + '] — just' + (i + 1) + ' lookups and done! (brute force needed 15)</span>';
                                        });
                                    } else {
                                        steps.push(function() {
                                            clearCells(); getCell(i).classList.add('current');
                                            highlightHmRow(comp, false);
                                            msgEl.innerHTML = '<strong>' + num + '</strong>\\\'s complement = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 searching seen… None';
                                        });
                                        steps.push(function() {
                                            clearHmHighlight();
                                            addHmRow(num, i);
                                            msgEl.innerHTML = num + ' not found, remember it → seen[' + num + '] = ' + i;
                                        });
                                        seen[num] = i;
                                    }
                                    if (foundJ >= 0) return;
                                })(idx);
                                if (foundJ >= 0) break;
                            }
                            var si = 0, done = false;
                            function advance() {
                                if (done) return;
                                if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                                steps[si]();
                                si++;
                                if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; }
                            }
                            function reset() {
                                si = 0; done = false;
                                clearCells(); hmEl.innerHTML = ''; msgEl.innerHTML = '';
                                tapEl.style.display = ''; replayEl.style.display = 'none';
                                // Regenerate steps (reset seen)
                                steps = []; seen = {}; foundI = -1; foundJ = -1;
                                for (var idx2 = 0; idx2 < nums.length; idx2++) {
                                    (function(i) {
                                        var num = nums[i], comp = target - num;
                                        if (seen.hasOwnProperty(comp)) {
                                            foundI = seen[comp]; foundJ = i;
                                            steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, true); msgEl.innerHTML = '<strong>' + num + '</strong>\\\'s complement = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 searching seen… ✨ <strong>Found!</strong>'; });
                                            steps.push(function() { clearHmHighlight(); getCell(foundI).classList.add('matched'); getCell(i).classList.remove('current'); getCell(i).classList.add('matched'); msgEl.innerHTML = '<span class="viz-result">✅ Answer! [' + foundI + ', ' + i + '] — just' + (i + 1) + ' lookups and done! (brute force needed 15)</span>'; });
                                        } else {
                                            steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, false); msgEl.innerHTML = '<strong>' + num + '</strong>\\\'s complement = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 searching seen… None'; });
                                            steps.push(function() { clearHmHighlight(); addHmRow(num, i); msgEl.innerHTML = num + ' not found, remember it → seen[' + num + '] = ' + i; });
                                            seen[num] = i;
                                        }
                                        if (foundJ >= 0) return;
                                    })(idx2);
                                    if (foundJ >= 0) break;
                                }
                            }
                            container.addEventListener('click', function(e) {
                                if (e.target.closest('.hint-viz-replay')) return;
                                advance();
                            });
                            replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                            return {
                                stop: function() {},
                                reset: function() { reset(); },
                                play: function() {},
                                destroy: function() {}
                            };
                        }
                    }
                ],
                vizMethod: '_renderVizTwoSum',
                simIntro: 'Watch step-by-step how the hash map finds the complement!',
                comparison: '<p><strong>O(n²) → O(n)</strong> — trading space (hash map) for time!</p><p>Brute force needed 15 comparisons, but hash map finds the answer in just <strong>6</strong> lookups.</p>',
                templates: {
                    python: `class Solution:\n    def twoSum(self, nums, target):\n        seen = {}  # value → index\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in seen:\n                return [seen[complement], i]\n            seen[num] = i`,
                    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Initialize hash map', desc: 'Key idea: check "Have I seen this number before?" in O(1)!\nStore {value: index} in a dictionary.', code: 'class Solution:\n    def twoSum(self, nums, target):\n        seen = {}  # {value: index} → O(1) lookup' },
                        { title: 'Iterate array', desc: 'enumerate gives both index (i) and value (num) at once.', code: '        for i, num in enumerate(nums):' },
                        { title: 'Compute complement + check', desc: 'Key: target - num = "complement"!\nIf complement is already in seen → answer found!\nHash map lookup is O(1), so overall O(n).', code: '            complement = target - num  # compute complement\n            if complement in seen:      # O(1) lookup!\n                return [seen[complement], i]' },
                        { title: 'Store current value', desc: 'If complement not found, record the current value.\n→ Future numbers may find this value as their complement!', code: '            seen[num] = i  # store so future numbers can find it' }
                    ],
                    cpp: [
                        { title: 'Initialize hash map', desc: 'unordered_map → O(1) lookup!\nStore {value: index} to quickly find complements.', code: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen; // {value: index}' },
                        { title: 'Iterate array', desc: 'Loop through indices and values with a for loop.', code: '        for (int i = 0; i < nums.size(); i++) {' },
                        { title: 'Compute complement + check', desc: 'Key: target - nums[i] = complement!\nIf complement exists in seen, return answer (O(1) lookup).', code: '            int comp = target - nums[i]; // complement\n            if (seen.count(comp)) return {seen[comp], i};' },
                        { title: 'Store current value + finish', desc: 'If not found, record current value → future numbers can find it', code: '            seen[nums[i]] = i; // store so it can be found later\n        }\n        return {};\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'lc-121',
            title: 'LeetCode 121 - Best Time to Buy and Sell Stock',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
            simIntro: 'Watch step-by-step how we track the minimum price and compute profit!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>You are given an array <code>prices</code> where
                <code>prices[i]</code> is the price of a given stock on the i-th day.</p>
                <p>You want to maximize your profit by choosing a <strong>single day to buy</strong> and a different day in the future to sell.
                Return the <strong>maximum profit</strong>. If no profit is possible, return <code>0</code>.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>prices = [7,1,5,3,6,4]</pre></div>
                    <div><strong>Output</strong><pre>5</pre></div>
                </div>
                <p class="example-explain">Buy on day 1 (price = 1) and sell on day 4 (price = 6), profit = 6 - 1 = 5</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>prices = [7,6,4,3,1]</pre></div>
                    <div><strong>Output</strong><pre>0</pre></div>
                </div>
                <p class="example-explain">Prices keep falling, so no profit is possible.</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ prices.length ≤ 10⁵</li>
                    <li>0 ≤ prices[i] ≤ 10⁴</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it in a single pass through the array?</p>
            `,
            hints: [
                { title: 'First Thought: How to Solve?', content: 'You must buy on some day and sell on a later day. The simplest approach? A double for loop checking all (buy day, sell day) combinations!<br><code>profit = prices[j] - prices[i]</code> (j &gt; i) find the maximum.' },
                { title: 'Let\'s Try It!', content: 'Let\'s try with <code>prices = [7, 1, 5, 3, 6, 4]</code>:<br>• Buy at 7? → 1(-6), 5(-2), 3(-4), 6(-1), 4(-3) → all losses!<br>• Buy at 1? → 5(+4), 3(+2), 6(<strong>+5</strong>), 4(+3) → max +5!<br>• Check the rest... buying at 1 and selling at 6 is the best.' },
                { title: 'Problem Found!', content: 'A double for loop is <strong>O(n²)</strong>. With n = 100,000, that\'s about 5 billion operations! 😱<br><br>Key observation: When selling on any day, the maximum profit comes from <strong>"buying at the lowest price seen so far"</strong>.<br>So we just need to track the minimum price seen so far as we iterate!' },
                { title: 'A Better Approach!', content: 'Iterate through the array <strong>just once</strong>:<br>• <code>min_price</code>: Track the lowest price seen so far<br>• <code>max_profit</code>: Track the maximum profit so far<br><br>If <code>price - min_price</code> is greater than the current max profit, update it.' },
                { title: 'Key Idea Summary', content: '"State tracking" pattern using just 2 variables:<br>① <code>min_price = min(min_price, price)</code> — Update the lowest price so far<br>② <code>max_profit = max(max_profit, price - min_price)</code> — Update the maximum profit<br><br><strong>O(n²) → O(n) time, O(1) space</strong> — Solved with just variables, no extra data structures!' }
            ],
            inputDefault: 0,
            solve() { return '5'; },
            templates: {
                python: `class Solution:
    def maxProfit(self, prices):
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit`,
                cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minP = INT_MAX, maxP = 0;
        for (int p : prices) {
            minP = min(minP, p);
            maxP = max(maxP, p - minP);
        }
        return maxP;
    }
};`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check all (buy day, sell day) combinations with a double for loop',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def maxProfit(self, prices):\n        max_profit = 0\n        for i in range(len(prices)):\n            for j in range(i + 1, len(prices)):\n                profit = prices[j] - prices[i]\n                max_profit = max(max_profit, profit)\n        return max_profit`,
                    cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int maxP = 0;\n        for (int i = 0; i < prices.size(); i++) {\n            for (int j = i + 1; j < prices.size(); j++) {\n                maxP = max(maxP, prices[j] - prices[i]);\n            }\n        }\n        return maxP;\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Initialize Max Profit', desc: 'Start at 0 for the case when no profit is possible.\nThe problem says "return 0 if no profit"!', code: 'class Solution:\n    def maxProfit(self, prices):\n        max_profit = 0  # return 0 if no profit' },
                        { title: 'Select Buy Day', desc: 'Try buying on each day i.\nConsider every day as a potential buy day.', code: '        for i in range(len(prices)):' },
                        { title: 'Search Sell Day', desc: 'Can only sell after buy day, so j starts from i+1.\nCan\'t go back in time to sell!', code: '            for j in range(i + 1, len(prices)):' },
                        { title: 'Calculate Profit + Update Max', desc: '(sell price - buy price) and update max profit.\nO(n²) — slow because it checks all pairs', code: '                profit = prices[j] - prices[i]\n                max_profit = max(max_profit, profit)\n        return max_profit' }
                    ],
                    cpp: [
                        { title: 'Initialize', desc: 'Start at 0 to return 0 if no profit', code: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int maxP = 0; // 0 if no profit' },
                        { title: 'Double For Loop', desc: 'Check all (buy day i, sell day j) combos.\nj = i+1 → can\'t sell in the past', code: '        for (int i = 0; i < prices.size(); i++) {\n            for (int j = i + 1; j < prices.size(); j++) {' },
                        { title: 'Calculate Profit + Return', desc: 'Update max of (sell - buy) and return', code: '                maxP = max(maxP, prices[j] - prices[i]);\n            }\n        }\n        return maxP;\n    }\n};' }
                    ]
                }
            }, {
                approach: 'Single Pass',
                description: 'Track minimum price and calculate max profit from the difference with current price',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def maxProfit(self, prices):\n        min_price = float('inf')\n        max_profit = 0\n        for price in prices:\n            min_price = min(min_price, price)\n            max_profit = max(max_profit, price - min_price)\n        return max_profit`,
                    cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Initialize Variables', desc: 'Key idea: Remember "the cheapest day so far"!\nmin_price = ∞ → any price will update it initially.\nmax_profit = 0 → return 0 if no profit.', code: 'class Solution:\n    def maxProfit(self, prices):\n        min_price = float(\'inf\')  # lowest price seen so far\n        max_profit = 0             # max profit' },
                        { title: 'Iterate Prices', desc: 'Solved in a single pass! O(n)\nFor each day\'s price, ask "what if I sell today?"', code: '        for price in prices:' },
                        { title: 'Update Minimum', desc: 'If today\'s price is lower than the lowest so far, update it.\n→ Future days can buy at this price and sell later!', code: '            min_price = min(min_price, price)  # Update min price' },
                        { title: 'Calculate Profit', desc: 'Key: "What if I sell today?" → price - min_price\nIf this exceeds the current max profit, update it.', code: '            max_profit = max(max_profit, price - min_price)  # What if I sell today?' },
                        { title: 'Return Result', desc: 'Found the maximum profit in a single pass!\nO(n) time, O(1) space — optimal solution.', code: '        return max_profit' }
                    ],
                    cpp: [
                        { title: 'Initialize variables', desc: 'Key: Remember "the cheapest day so far"!\nINT_MAX → any price will update it initially.', code: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0; // min price, max profit' },
                        { title: 'Iterate + Update Minimum', desc: 'Update min price at each step.\n→ Future days can buy at this price', code: '        for (int p : prices) {\n            minP = min(minP, p); // update min price' },
                        { title: 'Calculate Profit + Result', desc: '"What if I sell today?" → p - minP\nO(n) single pass for optimal solution.', code: '            maxP = max(maxP, p - minP); // what if I sell today?\n        }\n        return maxP;\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'lc-15',
            title: 'LeetCode 15 - 3Sum',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/3sum/',
            simIntro: 'Watch how fixing one number and using two pointers narrows down the search!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>In the integer array <code>nums</code>, find all
                combinations of <strong>three numbers</strong> that sum to <code>0</code>.</p>
                <p>Duplicate combinations must be removed.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [-1,0,1,2,-1,-4]</pre></div>
                    <div><strong>Output</strong><pre>[[-1,-1,2],[-1,0,1]]</pre></div>
                </div>
                <p class="example-explain">(-1)+(-1)+2 = 0, (-1)+0+1 = 0</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [0,1,1]</pre></div>
                    <div><strong>Output</strong><pre>[]</pre></div>
                </div>
                <p class="example-explain">There are no three numbers that sum to 0.</p>
                </div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [0,0,0]</pre></div>
                    <div><strong>Output</strong><pre>[[0,0,0]]</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>3 ≤ nums.length ≤ 3000</li>
                    <li>-10⁵ ≤ nums[i] ≤ 10⁵</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it faster than O(n³)?</p>
            `,
            hints: [
                { title: 'First Thought: How to Solve?', content: 'We need to find all combinations of three numbers that sum to 0. The simplest approach? A triple for loop checking all three-number combinations!<br><code>if nums[i] + nums[j] + nums[k] == 0</code> then add to results.' },
                { title: 'Let\'s Try It!', content: '<code>nums = [-1, 0, 1, 2, -1, -4]</code> let\'s try:<br>• (-1)+0+1=0 ✅, (-1)+2+(-1)=0 ✅, 0+1+(-1)=0 → this is the same combination as above!<br><br>We get duplicates! [-1, 0, 1] can appear multiple times. We can use a Set to remove duplicates, but... the triple for loop itself is too slow.' },
                { title: 'Problem Found!', content: 'A triple for loop is <strong>O(n³)</strong>! with n = 3,000 that\'s 27 billion operations! 😱<br><br><strong>Key question:</strong> What benefit does sorting the array give us?<br>Sorting enables ① easy duplicate skipping and ② using <strong>two pointers</strong> to find the other two numbers!' },
                { title: 'A Better Approach!', content: 'After sorting, <strong>fix one number</strong> and find the other two with <strong>two pointers</strong>!<br>• Fix i → left=i+1, right=end<br>• If the sum of three is less than 0, left++; if greater, right--<br><br>This gives O(n) × O(n) = <strong>O(n²)</strong>!' },
                { title: 'Key Idea Summary', content: '① Sort the array — O(n log n)<br>② Iterate i from 0, skip if <code>nums[i] == nums[i-1]</code> (remove duplicates)<br>③ Two pointer search with left=i+1, right=end<br>④ If sum is 0, add to results + skip left/right duplicates<br><br><strong>O(n³) → O(n²)</strong> improvement! Sorting is the key.' }
            ],
            inputDefault: 0,
            solve() { return '[[-1, -1, 2], [-1, 0, 1]]'; },
            templates: {
                python: `class Solution:
    def threeSum(self, nums):
        nums.sort()
        result = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue  # skip duplicates
            left, right = i + 1, len(nums) - 1
            while left < right:
                s = nums[i] + nums[left] + nums[right]
                if s == 0:
                    result.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]: left += 1
                    while left < right and nums[right] == nums[right - 1]: right -= 1
                    left += 1; right -= 1
                elif s < 0:
                    left += 1
                else:
                    right -= 1
        return result`,
                cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                } else if (s < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check all three-number combinations with triple for loop, remove duplicates with Set',
                timeComplexity: 'O(n³)',
                spaceComplexity: 'O(n)',
                templates: {
                    python: `class Solution:\n    def threeSum(self, nums):\n        result = set()\n        n = len(nums)\n        for i in range(n):\n            for j in range(i + 1, n):\n                for k in range(j + 1, n):\n                    if nums[i] + nums[j] + nums[k] == 0:\n                        triplet = tuple(sorted([nums[i], nums[j], nums[k]]))\n                        result.add(triplet)\n        return [list(t) for t in result]`,
                    cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        set<vector<int>> resultSet;\n        int n = nums.size();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                for (int k = j + 1; k < n; k++) {\n                    if (nums[i] + nums[j] + nums[k] == 0) {\n                        vector<int> triplet = {nums[i], nums[j], nums[k]};\n                        sort(triplet.begin(), triplet.end());\n                        resultSet.insert(triplet);\n                    }\n                }\n            }\n        }\n        return vector<vector<int>>(resultSet.begin(), resultSet.end());\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Initialize Result Set', desc: 'Use set to prevent duplicate combinations.\n[-1,0,1] and [0,-1,1] are the same → sort then add to set for dedup!', code: 'class Solution:\n    def threeSum(self, nums):\n        result = set()  # automatically removes duplicate combos\n        n = len(nums)' },
                        { title: 'Triple For Loop', desc: 'Check all (i, j, k) combinations one by one.\nO(n³) — most intuitive but slow approach.', code: '        for i in range(n):\n            for j in range(i + 1, n):\n                for k in range(j + 1, n):' },
                        { title: 'Check Sum + Remove Duplicates', desc: 'If sum is 0, add as sorted tuple to set.\nsorted → same combination regardless of order becomes same tuple!', code: '                    if nums[i] + nums[j] + nums[k] == 0:\n                        triplet = tuple(sorted([nums[i], nums[j], nums[k]]))\n                        result.add(triplet)  # set auto-removes duplicates' },
                        { title: 'Convert Results', desc: 'Convert set of tuples to list of lists and return.', code: '        return [list(t) for t in result]' }
                    ],
                    cpp: [
                        { title: 'Initialize Set', desc: 'Use set<vector<int>> for dedup.\nSorted vectors automatically deduplicate identical combinations.', code: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        set<vector<int>> resultSet; // remove duplicates\n        int n = nums.size();' },
                        { title: 'Triple For Loop + Check Sum', desc: 'Check all (i,j,k) combinations → O(n³).\nIf sum is 0, sort and insert into set.', code: '        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                for (int k = j + 1; k < n; k++) {\n                    if (nums[i] + nums[j] + nums[k] == 0) {\n                        vector<int> triplet = {nums[i], nums[j], nums[k]};\n                        sort(triplet.begin(), triplet.end());\n                        resultSet.insert(triplet);\n                    }\n                }\n            }\n        }' },
                        { title: 'Return Result', desc: 'Convert set → vector and return.', code: '        return vector<vector<int>>(resultSet.begin(), resultSet.end());\n    }\n};' }
                    ]
                }
            }, {
                approach: 'Sort + Two Pointers',
                description: 'Sort, fix one number, and search for the other two with two pointers',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def threeSum(self, nums):\n        nums.sort()\n        result = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:\n                continue\n            left, right = i + 1, len(nums) - 1\n            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s == 0:\n                    result.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]: left += 1\n                    while left < right and nums[right] == nums[right - 1]: right -= 1\n                    left += 1; right -= 1\n                elif s < 0:\n                    left += 1\n                else:\n                    right -= 1\n        return result`,
                    cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Sort', desc: 'Key: sorting enables two pointers!\nIn a sorted array, if sum is too small → left↑, too large → right↓.', code: 'class Solution:\n    def threeSum(self, nums):\n        nums.sort()  # Sort → enables two pointers!\n        result = []' },
                        { title: 'Fix First Number + Skip Duplicates', desc: 'Fix i and find the other two with two pointers.\nSkip duplicate values of i to prevent duplicate combinations!', code: '        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:  # skip duplicate\n                continue' },
                        { title: 'Set Up Two Pointers', desc: 'left = right after i, right = end of array.\nNarrow these two pointers until they meet.', code: '            left, right = i + 1, len(nums) - 1' },
                        { title: 'Compare Sum + Move Pointers', desc: 'Sum == 0 → Answer! Add to results and skip duplicates.\nSum < 0 → need larger value → left++\nSum > 0 → need smaller value → right--', code: '            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s == 0:\n                    result.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]: left += 1\n                    while left < right and nums[right] == nums[right - 1]: right -= 1\n                    left += 1; right -= 1\n                elif s < 0:   # sum too small → move left right\n                    left += 1\n                else:          # sum too large → move right left\n                    right -= 1' },
                        { title: 'Return Result', desc: 'O(n²) — Sort O(n log n) + two pointers O(n) for each i\nMuch faster than O(n³) brute force!', code: '        return result' }
                    ],
                    cpp: [
                        { title: 'Sort + Initialize', desc: 'Sorting enables two pointers!\nIf sum too small → left↑, too large → right↓.', code: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end()); // Sort → two pointers!\n        vector<vector<int>> res;' },
                        { title: 'Fix i + Skip Duplicates', desc: 'Fix i, find rest with two pointers.\nSkip same values → prevent duplicate combinations!', code: '        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue; // skip duplicates' },
                        { title: 'Two Pointer Search', desc: 'Sum == 0 → Answer! Skip duplicates, move both.\nSum < 0 → left++, Sum > 0 → right--', code: '            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;  // sum small → move left\n                else r--;               // sum large → move right\n            }\n        }\n        return res;\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'boj-2003',
            title: 'BOJ 2003 - Sum of Numbers 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2003',
            simIntro: 'Watch how the sliding window maintains the sum as it moves!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a sequence of N numbers,
                find the number of <strong>contiguous subsequences</strong> whose sum equals M.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>N = 4, M = 2
sequence =[1, 1, 1, 1]</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">[1,1](index 0~1), [1,1](1~2), [1,1](2~3) → 3 total</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>N = 10, M = 5
sequence =[1, 2, 3, 4, 2, 5, 3, 1, 1, 2]</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">[2,3](index 1~2), [3,2](3~4), [5](5) → 3 total</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 10,000</li>
                    <li>1 ≤ M ≤ 300,000,000</li>
                    <li>Each element of the sequence is a natural number (≥ 1)</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it faster than O(n²)? (Two Pointers / Sliding Window)</p>
            `,
            hints: [
                {
                    title: 'What is a contiguous subarray sum?',
                    content: `<strong>"Sum of consecutive numbers"</strong> is the key. You can\'t pick any numbers you want — only <strong>adjacent numbers</strong> can be summed!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:16px 0;">
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i>=1&&i<=2?'#6c5ce7':'#dfe6e9'};color:${i>=1&&i<=2?'white':'#636e72'};border-radius:8px;font-weight:700;font-size:1.1em;">${v}</span>`).join('')}
                        </div>
                        <div style="font-weight:600;">[2, 3] → Sum =<strong style="color:var(--green);">5</strong> ✅ Contiguous — OK!</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:12px 0;padding:12px;background:rgba(255,118,117,0.08);border-radius:10px;">
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i===0||i===3?'#e17055':'#dfe6e9'};color:${i===0||i===3?'white':'#636e72'};border-radius:8px;font-weight:700;font-size:1.1em;">${v}</span>`).join('')}
                        </div>
                        <div style="color:#e17055;font-weight:600;">[1, 4] → Sum = 5 but ❌ not adjacent — doesn't count!</div>
                    </div>
                    <p style="margin-top:16px;padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">Check all contiguous ranges and count those with sum = M! 🤔<br>But how do we check all contiguous ranges?</p>`
                },
                {
                    title: 'Easiest approach: Try everything!',
                    content: `From every starting point, expand one at a time and compute the sum.<br>Why? Since it\'s <strong>contiguous, once you fix the start, you just extend the end one by one and check the sum</strong>!
                    <div style="margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;font-size:0.9em;line-height:1.8;border:1px solid var(--bg3);">
                        <code>[1, 2, 3, 4, 2]</code>, M=5:<br>
                        • From i=0: [1]=1, [1,2]=3, [1,2,3]=6... can't find 5<br>
                        • From i=1: [2]=2, [<strong>2,3</strong>]=<strong style="color:var(--green);">5 ✅</strong><br>
                        • From i=2: [3]=3, [3,4]=7... can't find 5<br>
                        • From i=3: [4]=4, [<strong>4,2</strong>... that's 6] can't find 5<br>
                        • Wait, [5] alone is 5! → at i=5... hmm, there might be some we missed..
                    </div>
                    <p style="margin-top:10px;">This is doable with <strong>nested for loops</strong>. But...</p>
                    <p style="margin-top:8px;padding:10px 14px;background:rgba(255,118,117,0.1);border-radius:8px;font-size:0.92em;color:#e17055;">⏱ Time complexity is <strong>O(n²)</strong>! If N = 10,000, that\'s 100 million operations... could be slow!</p>`
                },
                {
                    title: 'Key insight: Slide the window!',
                    content: `Wait — what happens if we slide the range one position to the right?
                    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin:14px 0;">
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i>=0&&i<=2?'var(--yellow)':'#dfe6e9'};color:${i>=0&&i<=2?'var(--text)':'#636e72'};border-radius:8px;font-weight:700;">${v}</span>`).join('')}
                        </div>
                        <div>[1,2,3] Sum =6</div>
                        <div style="font-size:1.5em;">⬇️ Slide one step?</div>
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i>=1&&i<=3?'var(--yellow)':'#dfe6e9'};color:${i>=1&&i<=3?'var(--text)':'#636e72'};border-radius:8px;font-weight:700;">${v}</span>`).join('')}
                        </div>
                        <div>[2,3,4] Sum =6 - <strong style="color:#e17055;">1</strong> + <strong style="color:var(--green);">4</strong> = 9</div>
                    </div>
                    <p style="margin-top:10px;padding:12px 14px;background:rgba(0,184,148,0.1);border-radius:8px;">💡 <strong>No need to recompute the sum from scratch each time!</strong><br>Subtract the element that leaves the front, add the element that enters the back.<br>This is the <strong>"Sliding Window"</strong> idea!</p>`
                },
                {
                    title: 'Smart with Two Pointers!',
                    content: `Use two pointers, start and end, to control the window size!
                    <div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:10px;font-size:0.93em;line-height:2;border:1px solid var(--bg3);">
                        📌 <strong>If sum &lt; M</strong> → move end right (add more numbers to increase sum)<br>
                        📌 <strong>If sum ≥ M</strong> → move start right (remove from front to decrease sum)<br>
                        📌 <strong>If sum == M</strong> → found one! count++
                    </div>
                    <p style="margin-top:10px;">Why does this work? Because all numbers are <strong>positive (≥ 1)</strong>!<br>Adding a number always increases the sum, removing always decreases it — guaranteed.</p>
                    <p style="margin-top:12px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;">⏱ start and end each move at most N times → <strong>O(n)</strong>!<br>From O(n²) to O(n) — a huge improvement! 💪</p>
                    <p style="margin-top:8px;font-size:0.88em;color:var(--text3);">📝 Check the Simulation tab to watch the window slide in action!</p>`
                }
            ],
            inputDefault: 0,
            solve() { return '3'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M = map(int, input().split())
arr = list(map(int, input().split()))

start, end = 0, 0
current_sum = 0
count = 0

while True:
    if current_sum >= M:
        current_sum -= arr[start]
        start += 1
    elif end >= N:
        break
    else:
        current_sum += arr[end]
        end += 1

    if current_sum == M:
        count += 1

print(count)`,
                cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<int> arr(N);
    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);

    int s = 0, e = 0, sum = 0, cnt = 0;
    while (true) {
        if (sum >= M) sum -= arr[s++];
        else if (e >= N) break;
        else sum += arr[e++];
        if (sum == M) cnt++;
    }
    printf("%d\\n", cnt);
}`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check all contiguous subarray sums with nested loops',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\ncount = 0\nfor i in range(N):\n    total = 0\n    for j in range(i, N):\n        total += arr[j]\n        if total == M:\n            count += 1\n\nprint(count)`,
                    cpp: `#include <iostream>
#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int cnt = 0;\n    for (int i = 0; i < N; i++) {\n        int total = 0;\n        for (int j = i; j < N; j++) {\n            total += arr[j];\n            if (total == M) cnt++;\n        }\n    }\n    printf("%d\\n", cnt);\n}`
                },
                codeSteps: {
                    python: [
                        { title: 'Input + Initialize', desc: 'Read N, M and array, initialize count to 0.\nsys.stdin.readline for faster input.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\ncount = 0' },
                        { title: 'Iterate Starting Points', desc: 'Check contiguous sums starting from index i.\nReset total to 0 for each starting point.', code: 'for i in range(N):\n    total = 0  # Reset sum for new start' },
                        { title: 'Extend Endpoint + Check Sum', desc: 'Extend j from i to end, computing cumulative sum.\nO(n^2) checks all contiguous ranges.', code: '    for j in range(i, N):\n        total += arr[j]       # sum of range [i..j]\n        if total == M:\n            count += 1' },
                        { title: 'Output Result', desc: 'Output the count of contiguous ranges summing to M.', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: 'Input + Initialize', desc: 'Read N, M and array, initialize count.', code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int cnt = 0;' },
                        { title: 'Double For Loop Subarray Check', desc: 'Compute cumulative sum from start i to end j.\nKeep adding to total, so O(1) update in inner loop.', code: '    for (int i = 0; i < N; i++) {\n        int total = 0; // Reset for new start\n        for (int j = i; j < N; j++) {\n            total += arr[j]; // sum of range [i..j]\n            if (total == M) cnt++;\n        }\n    }' },
                        { title: 'Output Result', desc: 'Output the count of ranges summing to M.', code: '    printf("%d\\n", cnt);\n}' }
                    ]
                }
            }, {
                approach: 'Two Pointers',
                description: 'Use two pointers to maintain subarray sum and find cases equaling M',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\nstart, end = 0, 0\ncurrent_sum = 0\ncount = 0\n\nwhile True:\n    if current_sum >= M:\n        current_sum -= arr[start]\n        start += 1\n    elif end >= N:\n        break\n    else:\n        current_sum += arr[end]\n        end += 1\n\n    if current_sum == M:\n        count += 1\n\nprint(count)`,
                    cpp: `#include <iostream>
#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int s = 0, e = 0, sum = 0, cnt = 0;\n    while (true) {\n        if (sum >= M) sum -= arr[s++];\n        else if (e >= N) break;\n        else sum += arr[e++];\n        if (sum == M) cnt++;\n    }\n    printf("%d\\n", cnt);\n}`
                },
                codeSteps: {
                    python: [
                        { title: 'Input + Initialize Pointers', desc: 'Key idea: Adjust the range with two pointers start and end!\nIf sum too small extend end, if too large shrink start.\nO(n) since each pointer moves at most N times.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\nstart, end = 0, 0    # range [start, end)\ncurrent_sum = 0       # current subarray sum\ncount = 0' },
                        { title: 'Main Loop: Adjust Range', desc: 'Sum >= M means range too large, subtract start and advance.\nIf end reaches the end, stop.\nSum < M means range too small, add end and expand.', code: 'while True:\n    if current_sum >= M:\n        current_sum -= arr[start]  # remove start element\n        start += 1                 # shrink range\n    elif end >= N:\n        break                      # cannot expand more\n    else:\n        current_sum += arr[end]    # add end element\n        end += 1                   # expand range' },
                        { title: 'Check Sum', desc: 'After adjusting, if current sum equals M, increment count!\nThe if check runs every iteration.', code: '    if current_sum == M:\n        count += 1  # Found a range summing to M!' },
                        { title: 'Output Result', desc: 'Found all ranges in a single O(n) pass.\nstart, end each move at most N times, so O(2N) = O(n).', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: 'Input + Initialize Pointers', desc: 'Manage range [s, e) with two pointers.\nIf sum too small extend e, too large shrink s, so O(n).', code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int s = 0, e = 0, sum = 0, cnt = 0; // range [s, e)' },
                        { title: 'Main Loop + Check Sum', desc: 'Sum >= M means subtract s and advance (shrink).\nIf e reaches end, stop.\nSum < M means add e and expand.\nCheck sum == M each iteration.', code: '    while (true) {\n        if (sum >= M) sum -= arr[s++];     // shrink range\n        else if (e >= N) break;            // End\n        else sum += arr[e++];              // expand range\n        if (sum == M) cnt++;               // sum equals M!\n    }' },
                        { title: 'Output Result', desc: 'O(n) since s and e each move at most N times.', code: '    printf("%d\\n", cnt);\n}' }
                    ]
                }
            }]
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
                    <span class="stage-num">Stage ${stage.num}</span>
                    <h3>${stage.title}</h3>
                    <p>${stage.desc}</p>
                </div>
                <div class="stage-problems"></div>
            `;
            const problemsDiv = stageCard.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid);
                if (!prob) return;
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                const btn = document.createElement('button');
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `<span class="problem-title">${prob.title}</span><span class="problem-diff">${diffMap[prob.difficulty] || prob.difficulty}</span>`;
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob));
                problemsDiv.appendChild(btn);
            });
            stageList.appendChild(stageCard);
        });
        container.appendChild(stageList);
    },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        const backBtn = document.createElement('button');
        backBtn.className = 'btn'; backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLC = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗'}</a></div>${problem.descriptionHTML}`;
        container.appendChild(descDiv);

        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>Step-by-step Hints</h3>';
        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hints-steps';
        const openedState = {};

        problem.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `<div class="hint-step-header"><span class="hint-step-num">${idx + 1}</span><span class="hint-step-title">${hint.title}</span><span class="hint-step-toggle">▶</span></div><div class="hint-step-content">${hint.content}</div>`;
            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('open') ? '▼' : '▶';
                if (!openedState[idx]) { openedState[idx] = true; if (idx + 1 < problem.hints.length) { const ns = hintsDiv.children[idx + 1]; if (ns) ns.classList.remove('locked'); } }
            });
            hintsDiv.appendChild(step);
        });
        hintsSection.appendChild(hintsDiv);
        container.appendChild(hintsSection);

        const solveArea = document.createElement('div');
        solveArea.className = 'solve-area';
        solveArea.innerHTML = `
            <div class="editor-header"><h3>Write Solution</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option></select></div>
            <textarea id="code-editor" spellcheck="false" placeholder="Write your code here..."></textarea>
            <div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ Run</button><button id="check-btn" class="btn btn-success">✓ Check Answer</button></div>
            <div id="output-area" class="output-area"><div class="output-label">Output</div><pre id="output-text"></pre></div>
        `;
        container.appendChild(solveArea);

        container.querySelectorAll('pre code').forEach(codeEl => { if (window.hljs) hljs.highlightElement(codeEl); });

        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;
        langSelect.addEventListener('change', () => { editor.value = problem.templates[langSelect.value]; });
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 4; }
        });

        const site = isLC ? 'LeetCode' : 'BOJ';
        container.querySelector('#run-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `Expected Answer:\n${expected}\n\n(Your code should output the above result)`);
        });
        container.querySelector('#check-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `Expected Answer:\n${expected}\n\n💡 Submit your code to ${site} to verify your answer!`);
        });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.array = arrayTopic;
