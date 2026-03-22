// =========================================================
// String Manipulation Topic Module
// =========================================================

// ===== Multi-solution approach rendering (shared function) =====
window.renderSolutionsCodeTab = function(el, prob) {
    const wrapper = document.createElement('div');
    const tabBar = document.createElement('div');
    tabBar.className = 'approach-tabs';

    prob.solutions.forEach((sol, i) => {
        const tab = document.createElement('button');
        tab.className = 'approach-tab' + (i === 0 ? ' active' : '');
        tab.dataset.index = i;
        tab.innerHTML =
            '<span class="approach-num">' + (i + 1) + '</span>' +
            '<span>' + sol.approach + '</span>' +
            '<span class="approach-complexity">' + sol.timeComplexity + '</span>';
        tab.addEventListener('click', () => showApproach(i));
        tabBar.appendChild(tab);
    });
    wrapper.appendChild(tabBar);
    tabBar.style.display = 'none';

    const panel = document.createElement('div');
    panel.className = 'approach-panel';
    wrapper.appendChild(panel);

    function langClass(l) { return l === 'cpp' ? 'cpp' : l; }

    function highlightNewLines(codeEl, newLines) {
        if (!newLines || !newLines.length) return;
        var html = codeEl.innerHTML;
        var lines = html.split('\n');
        codeEl.innerHTML = lines.map(function(line, i) {
            if (newLines.indexOf(i + 1) !== -1) {
                return '<mark class="code-line-new">' + line + '</mark>';
            }
            return line;
        }).join('\n');
    }

    function showApproach(idx) {
        const sol = prob.solutions[idx];
        tabBar.querySelectorAll('.approach-tab').forEach((t, i) => {
            t.classList.toggle('active', i === idx);
        });
        panel.innerHTML = '';

        // Description
        if (sol.description) {
            const desc = document.createElement('div');
            desc.className = 'approach-desc';
            desc.innerHTML = '<span>' + sol.description + '</span>';
            panel.appendChild(desc);
        }

        // Complexity badges
        const meta = document.createElement('div');
        meta.className = 'approach-meta';
        meta.innerHTML =
            '<span class="approach-meta-badge time">⏱ ' + sol.timeComplexity + '</span>' +
            '<span class="approach-meta-badge space">💾 ' + sol.spaceComplexity + '</span>';
        panel.appendChild(meta);

        // Language selector
        const langs = Object.keys(sol.templates);
        const langNames = { python: 'Python', cpp: 'C++' };

        const controls = document.createElement('div');
        controls.style.cssText = 'display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap;';
        controls.innerHTML =
            '<select class="lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--bg2);color:var(--text);font-family:inherit;">' +
            langs.map(l => '<option value="' + l + '">' + (langNames[l] || l) + '</option>').join('') +
            '</select>';
        panel.appendChild(controls);
        const select = controls.querySelector('.lang-select');

        // Set initial value based on global language setting
        var initLang = (langs.indexOf(window._algoLang) !== -1) ? window._algoLang : langs[0];
        if (select.value !== initLang) select.value = initLang;

        // === Progressive code step mode ===
        if (sol.codeSteps) {
            let currentLang = (langs.indexOf(window._algoLang) !== -1) ? window._algoLang : langs[0];
            let currentStep = -1;
            let isFullView = false;

            // Top step controls — right-aligned inside controls bar
            const stepCtrlTop = document.createElement('div');
            stepCtrlTop.style.cssText = 'display:flex;gap:6px;align-items:center;margin-left:auto;';
            stepCtrlTop.innerHTML =
                '<button class="btn code-step-btn cs-prev" disabled style="font-size:0.8rem;padding:4px 10px;">&larr; Prev</button>' +
                '<span class="code-step-counter" style="font-size:0.82rem;font-weight:600;color:var(--accent);min-width:50px;text-align:center;">Before Start</span>' +
                '<button class="btn btn-primary code-step-btn cs-next pulse-hint" style="font-size:0.8rem;padding:4px 10px;">Next &rarr;</button>';
            controls.appendChild(stepCtrlTop);
            const topPrev = stepCtrlTop.querySelector('.cs-prev');
            const topNext = stepCtrlTop.querySelector('.cs-next');
            const topCounter = stepCtrlTop.querySelector('.code-step-counter');

            const stepDesc = document.createElement('div');
            stepDesc.className = 'code-step-desc';
            stepDesc.textContent = '▶ Click Next to view the code step by step';
            panel.appendChild(stepDesc);

            const explainerArea = document.createElement('div');
            explainerArea.className = 'code-step-explainer';
            explainerArea.style.display = 'none';
            panel.appendChild(explainerArea);

            const codeBlock = document.createElement('div');
            codeBlock.className = 'code-block';
            codeBlock.innerHTML =
                '<div class="code-block-header">' +
                    '<div class="code-block-dots"><span></span><span></span><span></span></div>' +
                    '<span class="code-block-title">solution.' + (currentLang === 'python' ? 'py' : 'cpp') + '</span>' +
                '</div>' +
                '<pre><code></code></pre>';
            codeBlock.style.display = 'none';
            panel.appendChild(codeBlock);
            const codeEl = codeBlock.querySelector('code');
            const codeTitle = codeBlock.querySelector('.code-block-title');

            // Bottom step controls — right-aligned sticky
            const stepCtrlBot = document.createElement('div');
            stepCtrlBot.style.cssText = 'display:flex;gap:6px;align-items:center;justify-content:flex-end;position:sticky;bottom:12px;z-index:100;margin-top:12px;padding:8px 0;';
            stepCtrlBot.innerHTML =
                '<button class="btn code-step-btn cs-prev" disabled style="font-size:0.8rem;padding:4px 10px;">&larr; Prev</button>' +
                '<span class="code-step-counter" style="font-size:0.82rem;font-weight:600;color:var(--accent);min-width:50px;text-align:center;">Before Start</span>' +
                '<button class="btn btn-primary code-step-btn cs-next" style="font-size:0.8rem;padding:4px 10px;">Next &rarr;</button>';
            panel.appendChild(stepCtrlBot);
            const botPrev = stepCtrlBot.querySelector('.cs-prev');
            const botNext = stepCtrlBot.querySelector('.cs-next');
            const botCounter = stepCtrlBot.querySelector('.code-step-counter');

            // aliases for renderStep compatibility
            const prevBtn = topPrev;
            const nextBtn = topNext;
            const counter = topCounter;

            const fullViewBtn = document.createElement('button');
            fullViewBtn.className = 'code-fullview-btn';
            fullViewBtn.textContent = 'View Full Code';
            panel.appendChild(fullViewBtn);

            function getSteps() {
                return (sol.codeSteps[currentLang]) || [];
            }

            function syncControls() {
                const steps = getSteps();
                [[topPrev, topNext, topCounter], [botPrev, botNext, botCounter]].forEach(function(trio) {
                    trio[0].disabled = currentStep < 0;
                    trio[1].disabled = currentStep >= steps.length - 1;
                    if (currentStep < 0) {
                        trio[2].textContent = 'Before Start';
                    } else {
                        trio[2].textContent = 'Step ' + (currentStep + 1) + ' / ' + steps.length;
                    }
                });
            }

            function renderStep() {
                const steps = getSteps();
                syncControls();

                if (currentStep < 0) {
                    stepDesc.textContent = '▶ Click Next to view the code step by step';
                    explainerArea.style.display = 'none';
                    codeBlock.style.display = 'none';
                    return;
                }

                const step = steps[currentStep];
                stepDesc.innerHTML = '<span class="step-desc-title">' + step.title + '</span><span class="step-desc-body">' + step.desc.replace(/\n/g, '<br>') + '</span>';

                // Explanation card
                if (step.explanation) {
                    explainerArea.innerHTML = step.explanation;
                    explainerArea.style.display = 'block';
                } else {
                    explainerArea.style.display = 'none';
                }

                // Accumulate code — detect if steps use full-code or fragment style
                const codeStepsWithCode = steps.slice(0, currentStep + 1).filter(s => s.code);
                let accumulated = '';
                if (codeStepsWithCode.length >= 2 && codeStepsWithCode[1].code.includes(codeStepsWithCode[0].code)) {
                    // Full-code style: each step has complete code, just use the last one
                    accumulated = codeStepsWithCode[codeStepsWithCode.length - 1].code;
                } else {
                    // Fragment style: join all fragments
                    accumulated = codeStepsWithCode.map(s => s.code).join('\n\n');
                }

                if (accumulated) {
                    codeBlock.style.display = 'block';
                    codeEl.textContent = accumulated;
                    codeEl.className = 'language-' + langClass(currentLang);
                    codeEl.removeAttribute('data-highlighted');
                    if (window.hljs) hljs.highlightElement(codeEl);

                    // Calculate new lines
                    if (step.code) {
                        const isFullStyle = codeStepsWithCode.length >= 2 && codeStepsWithCode[1].code.includes(codeStepsWithCode[0].code);
                        let prevCount = 0;
                        if (isFullStyle) {
                            // Full-code: compare with previous step's full code
                            const prevSteps = steps.slice(0, currentStep).filter(s => s.code);
                            prevCount = prevSteps.length > 0 ? prevSteps[prevSteps.length - 1].code.split('\n').length : 0;
                        } else {
                            const prevFrags = steps.slice(0, currentStep).filter(s => s.code).map(s => s.code);
                            const prevAcc = prevFrags.join('\n\n');
                            prevCount = prevAcc ? prevAcc.split('\n').length : 0;
                        }
                        const totalCount = accumulated.split('\n').length;
                        const startNew = prevCount > 0 ? prevCount + 1 : 1;
                        const newLines = [];
                        for (let ln = startNew; ln <= totalCount; ln++) newLines.push(ln);
                        highlightNewLines(codeEl, newLines);
                    }
                } else {
                    codeBlock.style.display = 'none';
                }
            }

            function doNext() {
                const steps = getSteps();
                if (currentStep >= steps.length - 1) return;
                topNext.classList.remove('pulse-hint');
                botNext.classList.remove('pulse-hint');
                currentStep++;
                if (isFullView) {
                    isFullView = false;
                    fullViewBtn.textContent = 'View Full Code';
                    stepCtrlTop.style.display = 'flex';
                    stepCtrlBot.style.display = 'flex';
                    stepDesc.style.display = 'flex';
                }
                renderStep();
                setTimeout(() => {
                    if (codeBlock.style.display === 'none') return;
                    var cb = codeBlock.getBoundingClientRect();
                    if (cb.bottom > window.innerHeight * 0.6) {
                        window.scrollBy({ top: cb.bottom - window.innerHeight * 0.6, behavior: 'smooth' });
                    }
                }, 50);
            }
            function doPrev() {
                if (currentStep < 0) return;
                currentStep--;
                renderStep();
            }
            topNext.addEventListener('click', doNext);
            botNext.addEventListener('click', doNext);
            topPrev.addEventListener('click', doPrev);
            botPrev.addEventListener('click', doPrev);

            fullViewBtn.addEventListener('click', () => {
                if (isFullView) {
                    isFullView = false;
                    fullViewBtn.textContent = 'View Full Code';
                    stepCtrlTop.style.display = 'flex'; stepCtrlBot.style.display = 'flex';
                    stepDesc.style.display = 'flex';
                    renderStep();
                } else {
                    isFullView = true;
                    fullViewBtn.textContent = 'Step-by-Step View';
                    explainerArea.style.display = 'none';
                    codeBlock.style.display = 'block';
                    codeEl.textContent = sol.templates[currentLang] || '';
                    codeEl.className = 'language-' + langClass(currentLang);
                    codeEl.removeAttribute('data-highlighted');
                    if (window.hljs) hljs.highlightElement(codeEl);
                    stepCtrlTop.style.display = 'none'; stepCtrlBot.style.display = 'none';
                    stepDesc.style.display = 'none';
                }
            });

            select.addEventListener('change', () => {
                currentLang = select.value;
                if (window._setAlgoLang) window._setAlgoLang(currentLang);
                currentStep = -1;
                isFullView = false;
                fullViewBtn.textContent = 'View Full Code';
                stepCtrlTop.style.display = 'flex'; stepCtrlBot.style.display = 'flex';
                stepDesc.style.display = 'flex';
                nextBtn.classList.add('pulse-hint');
                var extMap = { python: 'py', cpp: 'cpp' };
                if (codeTitle) codeTitle.textContent = 'solution.' + (extMap[currentLang] || currentLang);

                if (!sol.codeSteps[currentLang]) {
                    stepCtrlTop.style.display = 'none'; stepCtrlBot.style.display = 'none';
                    stepDesc.style.display = 'none';
                    explainerArea.style.display = 'none';
                    codeBlock.style.display = 'block';
                    codeEl.textContent = sol.templates[currentLang] || '// No solution available for this language.';
                    codeEl.className = 'language-' + langClass(currentLang);
                    codeEl.removeAttribute('data-highlighted');
                    if (window.hljs) hljs.highlightElement(codeEl);
                    fullViewBtn.style.display = 'none';
                } else {
                    fullViewBtn.style.display = 'block';
                    renderStep();
                }
            });

            if (!sol.codeSteps[currentLang]) {
                stepCtrlTop.style.display = 'none'; stepCtrlBot.style.display = 'none';
                stepDesc.style.display = 'none';
                codeBlock.style.display = 'block';
                codeEl.textContent = sol.templates[currentLang] || '';
                codeEl.className = 'language-' + langClass(currentLang);
                codeEl.removeAttribute('data-highlighted');
                if (window.hljs) hljs.highlightElement(codeEl);
                fullViewBtn.style.display = 'none';
            } else {
                renderStep();
            }

        } else {
            // === Fallback: full code display ===
            const codeBlock = document.createElement('div');
            codeBlock.className = 'code-block';
            var extMap2 = { python: 'py', cpp: 'cpp' };
            codeBlock.innerHTML =
                '<div class="code-block-header">' +
                    '<div class="code-block-dots"><span></span><span></span><span></span></div>' +
                    '<span class="code-block-title">solution.' + (extMap2[initLang] || initLang) + '</span>' +
                '</div>' +
                '<pre><code></code></pre>';
            panel.appendChild(codeBlock);

            const codeEl = codeBlock.querySelector('code');
            const codeTitle2 = codeBlock.querySelector('.code-block-title');
            function showCode(lang) {
                codeEl.textContent = sol.templates[lang] || '// No solution available for this language.';
                codeEl.className = 'language-' + langClass(lang);
                codeEl.removeAttribute('data-highlighted');
                if (window.hljs) hljs.highlightElement(codeEl);
                if (codeTitle2) codeTitle2.textContent = 'solution.' + (extMap2[lang] || lang);
            }
            select.addEventListener('change', () => {
                if (window._setAlgoLang) window._setAlgoLang(select.value);
                showCode(select.value);
            });
            showCode(initLang);
        }
    }

    // Display optimal solution as main (last solution)
    var mainIdx = prob.solutions.length - 1;
    showApproach(mainIdx);

    // Add remaining solutions (brute force, etc.) as collapsed reference sections
    for (var ri = 0; ri < mainIdx; ri++) {
        (function(refSol) {
            var details = document.createElement('details');
            details.className = 'brute-ref';

            var summary = document.createElement('summary');
            summary.className = 'brute-ref-summary';
            summary.innerHTML =
                '<span class="brute-ref-icon">📝</span>' +
                '<span class="brute-ref-label">' + refSol.approach + ' Code Reference</span>' +
                '<span class="brute-ref-badge">' + refSol.timeComplexity + '</span>';
            details.appendChild(summary);

            var refContent = document.createElement('div');
            refContent.className = 'brute-ref-content';

            if (refSol.description) {
                var desc = document.createElement('p');
                desc.className = 'brute-ref-desc';
                desc.innerHTML = '<span>' + refSol.description + '</span>';
                refContent.appendChild(desc);
            }

            var refMeta = document.createElement('div');
            refMeta.className = 'approach-meta';
            refMeta.innerHTML =
                '<span class="approach-meta-badge time">⏱ ' + refSol.timeComplexity + '</span>' +
                '<span class="approach-meta-badge space">💾 ' + refSol.spaceComplexity + '</span>';
            refContent.appendChild(refMeta);

            // Language selector
            var refLangs = Object.keys(refSol.templates);
            var langNamesRef = { python: 'Python', cpp: 'C++' };
            var refSelect = document.createElement('select');
            refSelect.className = 'lang-select';
            refSelect.style.cssText = 'padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--bg2);color:var(--text);font-family:inherit;margin-bottom:8px;';
            refLangs.forEach(function(l) {
                var opt = document.createElement('option');
                opt.value = l;
                opt.textContent = langNamesRef[l] || l;
                refSelect.appendChild(opt);
            });
            // Set initial value based on global language setting
            var refInitLang = (refLangs.indexOf(window._algoLang) !== -1) ? window._algoLang : refLangs[0];
            if (refSelect.value !== refInitLang) refSelect.value = refInitLang;
            refContent.appendChild(refSelect);

            // Code block
            var refCodeBlock = document.createElement('div');
            refCodeBlock.className = 'code-block';
            var extMap = { python: 'py', cpp: 'cpp' };
            refCodeBlock.innerHTML =
                '<div class="code-block-header">' +
                    '<div class="code-block-dots"><span></span><span></span><span></span></div>' +
                    '<span class="code-block-title">brute.' + (extMap[refInitLang] || refInitLang) + '</span>' +
                '</div>' +
                '<pre><code></code></pre>';
            refContent.appendChild(refCodeBlock);

            var refCodeEl = refCodeBlock.querySelector('code');
            var refCodeTitle = refCodeBlock.querySelector('.code-block-title');

            function showRefCode(lang) {
                refCodeEl.textContent = refSol.templates[lang] || '';
                refCodeEl.className = 'language-' + langClass(lang);
                refCodeEl.removeAttribute('data-highlighted');
                if (window.hljs) hljs.highlightElement(refCodeEl);
                if (refCodeTitle) refCodeTitle.textContent = 'brute.' + (extMap[lang] || lang);
            }

            refSelect.addEventListener('change', function() {
                if (window._setAlgoLang) window._setAlgoLang(refSelect.value);
                showRefCode(refSelect.value);
            });

            // Lazy code highlighting on toggle open
            var refInited = false;
            details.addEventListener('toggle', function() {
                if (details.open && !refInited) {
                    refInited = true;
                    showRefCode(refInitLang);
                }
            });

            details.appendChild(refContent);
            wrapper.appendChild(details);
        })(prob.solutions[ri]);
    }

    el.appendChild(wrapper);
};

const stringTopic = {
    id: 'string',
    title: 'String Manipulation',
    icon: '🔤',
    category: 'Fundamentals (Bronze~Silver)',
    order: 1,
    description: 'Key string problem types and solutions: frequency analysis, palindromes, anagrams, and more',

    // Sidebar expandable
    sidebarExpandable: true,

    // Single unified tab (for topic overview)
    tabs: [{ id: 'concept', label: 'Learn' }],

    // Problem-type mapping (top-level)
    problemMeta: {
        'boj-10809': { type: 'Alphabet Find', color: '#00b894', vizMethod: '_renderVizAlphaFind' },
        'boj-1157':  { type: 'Frequency Analysis', color: 'var(--accent)', vizMethod: '_renderVizFrequency' },
        'lc-125':    { type: 'Palindrome Check', color: 'var(--green)', vizMethod: '_renderVizPalindrome' },
        'lc-49':     { type: 'Anagram Grouping', color: '#e17055', vizMethod: '_renderVizAnagram' },
        'boj-1213':  { type: 'String Reconstruction', color: '#6c5ce7', vizMethod: '_renderVizReconstruct' }
    },

    // Learning stages (sequential roadmap)
    stages: [
        { num: 1, title: 'Alphabet Find', desc: 'String traversal basics', problemIds: ['boj-10809'] },
        { num: 2, title: 'Frequency Analysis', desc: 'Counting character occurrences', problemIds: ['boj-1157'] },
        { num: 3, title: 'Palindrome Check', desc: 'Basic two-pointer pattern', problemIds: ['lc-125'] },
        { num: 4, title: 'Anagram Grouping', desc: 'Sort key + hashmap', problemIds: ['lc-49'] },
        { num: 5, title: 'String Reconstruction', desc: 'Rearranging with frequency counts', problemIds: ['boj-1213'] },
    ],

    // Additional type notes
    relatedNote: 'Other techniques frequently used in string problems include two pointers, sliding window, KMP string matching, and string parsing.',

    // ===== Problem tab definitions (called from app.js) =====
    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Hints', icon: '💡' },
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
        if (!meta) { container.innerHTML = '<p>Problem meta information not found.</p>'; return; }

        self._clearVizState();

        const diffMap = { bronze: 'Bronze', gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

        // Problem header (type badge + difficulty)
        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML = `
            <span style="padding:4px 12px;background:${meta.color}15;border-radius:8px;font-size:0.85rem;color:${meta.color};font-weight:600;">${meta.type}</span>
            <span class="problem-diff ${prob.difficulty}">${diffMap[prob.difficulty] || ''}</span>
        `;
        container.appendChild(header);

        // Flow Intro (added directly to container — so tab renderer doesn't overwrite innerHTML)
        const flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the input/output format.', icon: '📋' },
            think:   { intro: 'Don\'t jump into code right away — open the step-by-step hints to plan your approach.', icon: '💡' },
            sim:     { intro: prob.simIntro || 'See how the concepts from the hints actually work in action.', icon: '🎮' },
            code:    { intro: 'Now let\'s turn the approach we outlined into code!', icon: '💻' }
        };
        const ft = flowMap[tabId];
        if (ft) {
            const introDiv = document.createElement('div');
            introDiv.className = 'flow-intro';
            introDiv.innerHTML = '<span class="flow-intro-icon">' + ft.icon + '</span><span>' + ft.intro + '</span>';
            container.appendChild(introDiv);
        }

        // Tab-specific content
        const contentDiv = document.createElement('div');
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';
        container.appendChild(contentDiv);
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

        // Flow Next CTA
        const tabOrder = ['problem', 'think', 'sim', 'code'];
        const tabLabels = { problem: 'Problem', think: 'Hints', sim: 'Simulation', code: 'Code' };
        const ctaTexts = { problem: 'If you understand the problem', think: 'If you\'ve checked all hints', sim: 'If you understand how it works' };
        const curIdx = tabOrder.indexOf(tabId);
        if (curIdx >= 0 && curIdx < tabOrder.length - 1) {
            const nextId = tabOrder[curIdx + 1];
            const nextDiv = document.createElement('div');
            nextDiv.className = 'flow-next';
            nextDiv.innerHTML = '<button class="flow-next-btn">' + ctaTexts[tabId] + ' → ' + tabLabels[nextId] + ' →</button>';
            nextDiv.querySelector('button').addEventListener('click', function() { window._switchToTab(nextId); });
            container.appendChild(nextDiv);
        }
    },

    // ===== Topic overview (display all problem cards) =====
    renderConcept(container) {
        const self = this;
        self._clearVizState();

        const problemMeta = self.problemMeta;

        const diffMap = { bronze: 'Bronze', gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

        // --- Hero + concept demos + problem list container ---
        container.innerHTML = `
            <div class="hero">
                <h2>🔤 String Manipulation</h2>
                <p class="hero-sub">Pick a problem, think it through, understand it with a simulation, then check the code!</p>
            </div>

            <!-- Section 1: Strings = Arrays of Characters -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> Strings Are Arrays of Characters</div>
                <div class="analogy-box">
                    You know how lockers in a hallway each have a number on them? A string works the same way -- each character sits in its own numbered slot. The first character is at position 0, then 1, 2, and so on.
                    So if you write <code>s[2]</code>, you instantly grab the character in slot 2, no searching needed!
                    <span class="lang-py">And just like cutting a piece of tape, you can slice out a chunk with <code>s[1:4]</code> or flip the whole thing backwards with <code>s[::-1]</code>.</span><span class="lang-cpp">And you can grab a piece with <code>s.substr(1,3)</code> or flip the whole thing backwards with <code>string(s.rbegin(), s.rend())</code>.</span>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Index, Slicing, Reversing</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="str-concept-idx-btn">Index Access [2]</button>
                        <button class="concept-demo-btn" id="str-concept-slice-btn">Slicing [1:4]</button>
                        <button class="concept-demo-btn" id="str-concept-reverse-btn">Reverse [::-1]</button>
                        <button class="concept-demo-btn green" id="str-concept-reset-btn">↺ Reset</button>
                    </div>
                    <div class="concept-demo-body" style="justify-content:center;">
                        <div class="str-concept-char-row" id="str-concept-char-row">
                            <div class="str-concept-char-box" data-idx="0"><span class="str-concept-char">H</span><span class="str-concept-idx">0</span></div>
                            <div class="str-concept-char-box" data-idx="1"><span class="str-concept-char">E</span><span class="str-concept-idx">1</span></div>
                            <div class="str-concept-char-box" data-idx="2"><span class="str-concept-char">L</span><span class="str-concept-idx">2</span></div>
                            <div class="str-concept-char-box" data-idx="3"><span class="str-concept-char">L</span><span class="str-concept-idx">3</span></div>
                            <div class="str-concept-char-box" data-idx="4"><span class="str-concept-char">O</span><span class="str-concept-idx">4</span></div>
                        </div>
                    </div>
                    <div class="str-concept-result" id="str-concept-result" style="display:none;"></div>
                    <div class="concept-demo-msg" id="str-concept-demo1-msg">👆 Click a button to try string operations yourself!</div>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <h3>s[i] — Index Access</h3>
                        <p>Gets the i-th character directly. Very fast at <code>O(1)</code> — instant lookup!</p>
                        <span class="lang-py"><code style="font-size:0.85rem;color:var(--accent);">s = "HELLO"<br>s[2]  → 'L'</code></span><span class="lang-cpp"><code style="font-size:0.85rem;color:var(--accent);">string s = "HELLO";<br>s[2]  → 'L'</code></span>
                    </div>
                    <div class="concept-card">
                        <span class="lang-py"><h3>s[a:b] — Slicing</h3></span><span class="lang-cpp"><h3>s.substr(a,len) — Substring</h3></span>
                        <span class="lang-py"><p>Extracts a substring from index a to b-1.</p></span><span class="lang-cpp"><p>Extracts len characters starting from index a.</p></span>
                        <span class="lang-py"><code style="font-size:0.85rem;color:var(--accent);">s[1:4]  → "ELL"</code></span><span class="lang-cpp"><code style="font-size:0.85rem;color:var(--accent);">s.substr(1,3)  → "ELL"</code></span>
                    </div>
                    <div class="concept-card">
                        <span class="lang-py"><h3>s[::-1] — Reverse</h3></span><span class="lang-cpp"><h3>reverse — Reverse</h3></span>
                        <p>Reverses the entire string. Frequently used for palindrome checks!</p>
                        <span class="lang-py"><code style="font-size:0.85rem;color:var(--accent);">s[::-1]  → "OLLEH"</code></span><span class="lang-cpp"><code style="font-size:0.85rem;color:var(--accent);">string(s.rbegin(), s.rend())  → "OLLEH"</code></span>
                    </div>
                </div>
            </div>

            <!-- Section 2: ASCII Codes -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> ASCII Codes — The Link Between Characters and Numbers</div>
                <div class="analogy-box">
                    Here's a secret: computers don't actually understand letters. Behind the scenes, every character is stored as a number. The letter 'A' is really 65, 'B' is 66, and so on. This numbering system is called <strong>ASCII</strong>.
                    <span class="lang-py">You can peek at a character's secret number with <code>ord('A')</code> which gives 65, and go back from number to character with <code>chr(65)</code> which gives 'A'.</span><span class="lang-cpp">In C++ you just cast: <code>(int)'A'</code> gives 65, and <code>(char)65</code> gives 'A'.</span>
                    <br>
                    <span class="lang-py"><a href="https://docs.python.org/3/library/functions.html#ord" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: ord() ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/language/explicit_cast" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: Type Casting ↗</a></span>
                    &nbsp;|&nbsp;
                    <a href="https://www.asciitable.com/" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Full ASCII Table ↗</a>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — <span class="lang-py">ord() &amp; chr()</span><span class="lang-cpp">(int) &amp; (char) Casting</span> Conversion</div>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;flex-wrap:wrap;">
                        <label style="font-size:0.9rem;font-weight:600;color:var(--text);">Enter character:</label>
                        <input type="text" id="str-concept-ascii-input" maxlength="1" value="A"
                            style="width:50px;text-align:center;padding:8px;font-size:1.2rem;font-weight:700;border:2px solid var(--accent);border-radius:8px;background:var(--bg);color:var(--text);font-family:'Fira Code',monospace;">
                        <button class="concept-demo-btn" id="str-concept-ascii-convert">Convert</button>
                        <button class="concept-demo-btn" id="str-concept-ascii-prev">&larr; Prev Char</button>
                        <button class="concept-demo-btn" id="str-concept-ascii-next">Next Char &rarr;</button>
                    </div>
                    <div class="concept-demo-body" style="justify-content:center;">
                        <div class="str-concept-ascii-flow" id="str-concept-ascii-flow">
                            <div class="str-concept-ascii-box str-concept-ascii-char" id="str-concept-ascii-char">'A'</div>
                            <div class="str-concept-ascii-arrow">→ <span class="lang-py"><code>ord()</code></span><span class="lang-cpp"><code>(int)</code></span> →</div>
                            <div class="str-concept-ascii-box str-concept-ascii-num" id="str-concept-ascii-num">65</div>
                            <div class="str-concept-ascii-arrow">→ <span class="lang-py"><code>chr()</code></span><span class="lang-cpp"><code>(char)</code></span> →</div>
                            <div class="str-concept-ascii-box str-concept-ascii-char" id="str-concept-ascii-back">'A'</div>
                        </div>
                    </div>
                    <div class="str-concept-ascii-table-wrap" style="margin-top:1.2rem;">
                        <div style="font-size:0.85rem;font-weight:700;color:var(--text);margin-bottom:8px;">📋 Key ASCII Ranges</div>
                        <div class="str-concept-ascii-table">
                            <div class="str-concept-ascii-range">
                                <span class="str-concept-ascii-range-label">A-Z</span>
                                <span class="str-concept-ascii-range-val">65 ~ 90</span>
                            </div>
                            <div class="str-concept-ascii-range">
                                <span class="str-concept-ascii-range-label">a-z</span>
                                <span class="str-concept-ascii-range-val">97 ~ 122</span>
                            </div>
                            <div class="str-concept-ascii-range">
                                <span class="str-concept-ascii-range-label">0-9</span>
                                <span class="str-concept-ascii-range-val">48 ~ 57</span>
                            </div>
                        </div>
                        <div style="font-size:0.82rem;color:var(--text2);margin-top:6px;">💡 The difference between uppercase and lowercase is always 32! (A=65, a=97 → 97-65=32)</div>
                    </div>
                    <div class="concept-demo-msg" id="str-concept-demo2-msg">👆 Enter a character and click "Convert" to see its ASCII code!</div>
                </div>
            </div>

            <!-- Section 3: String Comparison -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> String Comparison — Lexicographic Comparison</div>
                <div class="analogy-box">
                    <strong>Key Concept:</strong> String comparison is like <em>looking up words in a dictionary</em>.
                    Characters are compared one by one from the front, and as soon as a <strong>difference is found</strong>, the ASCII values determine the order.
                    For example, <code>"abc" < "abd"</code> because the 3rd character <code>'c'(99) < 'd'(100)</code>.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Character-by-Character Comparison</div>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;flex-wrap:wrap;">
                        <label style="font-size:0.9rem;font-weight:600;color:var(--text);">String 1:</label>
                        <input type="text" id="str-concept-cmp-input1" value="abc"
                            style="width:120px;padding:8px 12px;font-size:1rem;font-weight:600;border:2px solid var(--accent);border-radius:8px;background:var(--bg);color:var(--text);font-family:'Fira Code',monospace;">
                        <label style="font-size:0.9rem;font-weight:600;color:var(--text);">String 2:</label>
                        <input type="text" id="str-concept-cmp-input2" value="abd"
                            style="width:120px;padding:8px 12px;font-size:1rem;font-weight:600;border:2px solid var(--accent);border-radius:8px;background:var(--bg);color:var(--text);font-family:'Fira Code',monospace;">
                        <button class="concept-demo-btn" id="str-concept-cmp-btn">Compare</button>
                    </div>
                    <div class="concept-demo-body" style="flex-direction:column;align-items:center;gap:16px;">
                        <div class="str-concept-cmp-rows" id="str-concept-cmp-rows">
                            <div class="str-concept-cmp-row">
                                <span class="str-concept-cmp-label">String 1</span>
                                <div class="str-concept-cmp-boxes" id="str-concept-cmp-boxes1"></div>
                            </div>
                            <div class="str-concept-cmp-row">
                                <span class="str-concept-cmp-label">String 2</span>
                                <div class="str-concept-cmp-boxes" id="str-concept-cmp-boxes2"></div>
                            </div>
                        </div>
                    </div>
                    <div class="str-concept-cmp-result" id="str-concept-cmp-result" style="display:none;"></div>
                    <div class="concept-demo-msg" id="str-concept-demo3-msg">👆 Enter two strings and click "Compare" to see the character-by-character comparison!</div>
                </div>
            </div>

            <!-- Section 4: Common String Methods -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> Common String Methods</div>
                <div class="analogy-box">
                    <strong>Key Point:</strong> Knowing these methods makes string problems much easier to solve.
                    You don't need to memorize them — just know <strong>"these exist"</strong> and look them up when needed!<br>
                    <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#string-methods" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: String Methods ↗</a></span>
                    <span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/string/basic_string" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: std::string ↗</a></span>
                </div>
                <span class="lang-py"><div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <h3>Transform & Check</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
s.upper() / s.lower()<br>
s.isalpha() / s.isdigit()<br>
s.isalnum()<br>
ord('A') → 65 / chr(65) → 'A'
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">Case conversion, character type checks</p>
                    </div>
                    <div class="concept-card">
                        <h3>Find & Count</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
s.find('abc') → index (-1 if none)<br>
s.count('a') → occurrence count<br>
s.startswith('pre')<br>
s.endswith('.txt')
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">Substring position, frequency, prefix/suffix</p>
                    </div>
                    <div class="concept-card">
                        <h3>Split & Join</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
s.split(',') → ['a','b','c']<br>
','.join(['a','b','c']) → 'a,b,c'<br>
s.strip() / s.lstrip() / s.rstrip()<br>
s.replace('old', 'new')
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">Split by delimiter, list→string, whitespace trim</p>
                    </div>
                    <div class="concept-card">
                        <h3>Other Useful</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
list(s) → ['H','E','L','L','O']<br>
''.join(reversed(s))<br>
s[::-1]  # reverse<br>
sorted(s) → sorted list
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">List conversion, reverse, sort</p>
                    </div>
                </div></span>
                <span class="lang-cpp"><div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <h3>Transform & Check</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
toupper(c) / tolower(c)<br>
isalpha(c) / isdigit(c)<br>
isalnum(c)<br>
(int)'A' → 65 / (char)65 → 'A'
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">Case conversion, character type checks (per char)</p>
                    </div>
                    <div class="concept-card">
                        <h3>Find & Count</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
s.find("abc") → index (npos if none)<br>
count(s.begin(), s.end(), 'a')<br>
s.substr(0, 3) == "pre"<br>
s.compare(other)
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">Substring position, frequency, comparison</p>
                    </div>
                    <div class="concept-card">
                        <h3>Extract & Replace</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
getline(cin, s)<br>
s.substr(start, len)<br>
s.erase(pos, len)<br>
s.replace(pos, len, "new")
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">Input, extract substring, delete, replace</p>
                    </div>
                    <div class="concept-card">
                        <h3>Other Useful</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
to_string(42) → "42"<br>
stoi("42") → 42<br>
reverse(s.begin(), s.end())<br>
sort(s.begin(), s.end())
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">Number↔string conversion, reverse, sort</p>
                    </div>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Method Playground</div>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;flex-wrap:wrap;">
                        <label style="font-size:0.9rem;font-weight:600;color:var(--text);">String:</label>
                        <input type="text" id="str-concept-method-input" value="Hello, World! 123"
                            style="width:240px;padding:8px 12px;font-size:1rem;font-weight:600;border:2px solid var(--accent);border-radius:8px;background:var(--bg);color:var(--text);font-family:'Fira Code',monospace;">
                    </div>
                    <div class="concept-demo-btns" id="str-concept-method-btns" style="flex-wrap:wrap;gap:6px;">
                        <button class="concept-demo-btn" data-method="upper">upper()</button>
                        <button class="concept-demo-btn" data-method="lower">lower()</button>
                        <button class="concept-demo-btn" data-method="find">find('o')</button>
                        <button class="concept-demo-btn" data-method="count">count('l')</button>
                        <button class="concept-demo-btn" data-method="replace">replace('l','★')</button>
                        <button class="concept-demo-btn" data-method="split">split(',')</button>
                        <button class="concept-demo-btn" data-method="strip">strip()</button>
                        <button class="concept-demo-btn" data-method="isalpha">isalpha()</button>
                        <button class="concept-demo-btn" data-method="reverse">reverse</button>
                        <button class="concept-demo-btn" data-method="sorted">sorted()</button>
                    </div>
                    <div class="concept-demo-body" style="flex-direction:column;gap:12px;margin-top:12px;">
                        <div id="str-concept-method-before" style="display:none;"></div>
                        <div id="str-concept-method-arrow" style="display:none;font-size:1.1rem;text-align:center;color:var(--accent);font-weight:700;"></div>
                        <div id="str-concept-method-after" style="display:none;"></div>
                    </div>
                    <div class="concept-demo-msg" id="str-concept-demo4-msg">👆 Click a method button to see how the string transforms!</div>
                </div>
            </div>

        `;

        // ========== Concept demo interactions ==========

        // --- Demo 1: String = Array of Characters ---
        {
            const charRow = container.querySelector('#str-concept-char-row');
            const boxes = charRow.querySelectorAll('.str-concept-char-box');
            const resultEl = container.querySelector('#str-concept-result');
            const msgEl = container.querySelector('#str-concept-demo1-msg');

            function resetBoxes() {
                boxes.forEach(b => {
                    b.classList.remove('str-concept-highlight', 'str-concept-slice', 'str-concept-swap-left', 'str-concept-swap-right');
                    b.style.order = '';
                });
                resultEl.style.display = 'none';
                resultEl.textContent = '';
                msgEl.textContent = '👆 Click a button to try string operations yourself!';
            }

            // Index access
            container.querySelector('#str-concept-idx-btn').addEventListener('click', () => {
                resetBoxes();
                boxes[2].classList.add('str-concept-highlight');
                resultEl.style.display = 'block';
                resultEl.innerHTML = '<code>s[2]</code> → <strong>\'L\'</strong> &nbsp; (directly retrieves the character at index 2)';
                msgEl.textContent = 'Character "L" at index 2 is highlighted!';
            });

            // Slicing
            container.querySelector('#str-concept-slice-btn').addEventListener('click', () => {
                resetBoxes();
                [1, 2, 3].forEach(i => boxes[i].classList.add('str-concept-slice'));
                resultEl.style.display = 'block';
                resultEl.innerHTML = '<span class="lang-py"><code>s[1:4]</code> → <strong>"ELL"</strong> &nbsp; (index 1 to 3, 4 is excluded!)</span><span class="lang-cpp"><code>s.substr(1,3)</code> → <strong>"ELL"</strong> &nbsp; (extracts 3 characters starting from index 1!)</span>';
                msgEl.textContent = 'Characters at indices 1, 2, 3 are selected!';
            });

            // Reverse animation
            container.querySelector('#str-concept-reverse-btn').addEventListener('click', () => {
                resetBoxes();
                const chars = ['H', 'E', 'L', 'L', 'O'];
                const reversed = [...chars].reverse();
                let step = 0;
                const totalSwaps = Math.floor(chars.length / 2);

                function doSwap() {
                    if (step >= totalSwaps) {
                        // Show final state
                        boxes.forEach((b, i) => {
                            b.querySelector('.str-concept-char').textContent = reversed[i];
                            b.classList.remove('str-concept-swap-left', 'str-concept-swap-right');
                            b.classList.add('str-concept-slice');
                        });
                        resultEl.style.display = 'block';
                        resultEl.innerHTML = '<span class="lang-py"><code>s[::-1]</code></span><span class="lang-cpp"><code>string(s.rbegin(), s.rend())</code></span> → <strong>"OLLEH"</strong> &nbsp; (swap from the outside inward!)';
                        msgEl.textContent = 'Reverse complete! Characters swap from the outer edges inward.';
                        return;
                    }
                    const left = step;
                    const right = chars.length - 1 - step;
                    // Highlight
                    boxes.forEach(b => b.classList.remove('str-concept-highlight', 'str-concept-swap-left', 'str-concept-swap-right'));
                    boxes[left].classList.add('str-concept-swap-left');
                    boxes[right].classList.add('str-concept-swap-right');

                    msgEl.textContent = `Swap ${step + 1}: s[${left}]='${chars[left]}' ↔ s[${right}]='${chars[right]}'`;

                    setTimeout(() => {
                        // Perform swap
                        const temp = chars[left];
                        chars[left] = chars[right];
                        chars[right] = temp;
                        boxes[left].querySelector('.str-concept-char').textContent = chars[left];
                        boxes[right].querySelector('.str-concept-char').textContent = chars[right];
                        step++;
                        setTimeout(doSwap, 400);
                    }, 500);
                }
                doSwap();
            });

            // Reset
            container.querySelector('#str-concept-reset-btn').addEventListener('click', () => {
                const original = ['H', 'E', 'L', 'L', 'O'];
                boxes.forEach((b, i) => {
                    b.querySelector('.str-concept-char').textContent = original[i];
                });
                resetBoxes();
            });
        }

        // --- Demo 2: ASCII Codes ---
        {
            const asciiInput = container.querySelector('#str-concept-ascii-input');
            const charEl = container.querySelector('#str-concept-ascii-char');
            const numEl = container.querySelector('#str-concept-ascii-num');
            const backEl = container.querySelector('#str-concept-ascii-back');
            const msgEl = container.querySelector('#str-concept-demo2-msg');

            function updateAscii(ch) {
                if (!ch || ch.length === 0) return;
                const c = ch.charAt(0);
                const code = c.charCodeAt(0);
                asciiInput.value = c;
                charEl.textContent = "'" + c + "'";
                numEl.textContent = code;
                backEl.textContent = "'" + c + "'";

                // Animation
                [charEl, numEl, backEl].forEach(el => {
                    el.classList.remove('str-concept-ascii-pop');
                    void el.offsetWidth; // reflow
                    el.classList.add('str-concept-ascii-pop');
                });

                msgEl.innerHTML = "'" + c + "' → <span class=\"lang-py\">ord()</span><span class=\"lang-cpp\">(int)</span> → " + code + " → <span class=\"lang-py\">chr()</span><span class=\"lang-cpp\">(char)</span> → '" + c + "'";
            }

            container.querySelector('#str-concept-ascii-convert').addEventListener('click', () => {
                updateAscii(asciiInput.value);
            });

            asciiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') updateAscii(asciiInput.value);
            });

            container.querySelector('#str-concept-ascii-next').addEventListener('click', () => {
                const c = asciiInput.value.charAt(0);
                if (c) {
                    const next = String.fromCharCode(c.charCodeAt(0) + 1);
                    updateAscii(next);
                }
            });

            container.querySelector('#str-concept-ascii-prev').addEventListener('click', () => {
                const c = asciiInput.value.charAt(0);
                if (c) {
                    const prev = String.fromCharCode(c.charCodeAt(0) - 1);
                    updateAscii(prev);
                }
            });
        }

        // --- Demo 3: String Comparison ---
        {
            const input1 = container.querySelector('#str-concept-cmp-input1');
            const input2 = container.querySelector('#str-concept-cmp-input2');
            const boxes1 = container.querySelector('#str-concept-cmp-boxes1');
            const boxes2 = container.querySelector('#str-concept-cmp-boxes2');
            const resultEl = container.querySelector('#str-concept-cmp-result');
            const msgEl = container.querySelector('#str-concept-demo3-msg');
            var cmpTimer = null;

            function renderCmpBoxes(str, targetEl) {
                targetEl.innerHTML = '';
                for (var i = 0; i < str.length; i++) {
                    var box = document.createElement('div');
                    box.className = 'str-concept-cmp-box';
                    box.innerHTML = '<span class="str-concept-char">' + str[i] + '</span><span class="str-concept-idx">' + i + '</span>';
                    targetEl.appendChild(box);
                }
            }

            function runComparison() {
                if (cmpTimer) { clearTimeout(cmpTimer); cmpTimer = null; }
                var s1 = input1.value || '';
                var s2 = input2.value || '';
                renderCmpBoxes(s1, boxes1);
                renderCmpBoxes(s2, boxes2);
                resultEl.style.display = 'none';

                var maxLen = Math.max(s1.length, s2.length);
                var step = 0;

                function nextStep() {
                    if (step >= maxLen) {
                        // All characters equal, compare lengths
                        resultEl.style.display = 'block';
                        if (s1.length === s2.length) {
                            resultEl.innerHTML = '<span class="str-concept-cmp-eq">✓ "' + s1 + '" == "' + s2 + '" (all characters match and same length)</span>';
                            msgEl.textContent = 'The two strings are exactly equal!';
                        } else if (s1.length < s2.length) {
                            resultEl.innerHTML = '<span class="str-concept-cmp-lt">"' + s1 + '" < "' + s2 + '" (prefix matches but "' + s1 + '" is shorter)</span>';
                            msgEl.textContent = 'Prefixes match, but the shorter one comes first lexicographically.';
                        } else {
                            resultEl.innerHTML = '<span class="str-concept-cmp-gt">"' + s1 + '" > "' + s2 + '" (prefix matches but "' + s1 + '" is longer)</span>';
                            msgEl.textContent = 'Prefixes match, but the longer one comes later lexicographically.';
                        }
                        return;
                    }

                    var b1 = boxes1.children[step];
                    var b2 = boxes2.children[step];

                    // One string is shorter
                    if (step >= s1.length || step >= s2.length) {
                        resultEl.style.display = 'block';
                        if (step >= s1.length) {
                            resultEl.innerHTML = '<span class="str-concept-cmp-lt">"' + s1 + '" < "' + s2 + '" (position ' + (step + 1) + ': "' + s1 + '" ended, "' + s2 + '" has \'' + s2[step] + '\' remaining)</span>';
                        } else {
                            resultEl.innerHTML = '<span class="str-concept-cmp-gt">"' + s1 + '" > "' + s2 + '" (position ' + (step + 1) + ': "' + s2 + '" ended, "' + s1 + '" has \'' + s1[step] + '\' remaining)</span>';
                        }
                        msgEl.textContent = 'One string ended first. The shorter one comes first lexicographically!';
                        return;
                    }

                    // Character comparison
                    var c1 = s1.charCodeAt(step);
                    var c2 = s2.charCodeAt(step);

                    if (c1 === c2) {
                        b1.classList.add('str-concept-cmp-match');
                        b2.classList.add('str-concept-cmp-match');
                        msgEl.textContent = 'Char ' + (step + 1) + ': \'' + s1[step] + '\'(' + c1 + ') == \'' + s2[step] + '\'(' + c2 + ') → equal, move to next!';
                        step++;
                        cmpTimer = setTimeout(nextStep, 600);
                    } else {
                        b1.classList.add(c1 < c2 ? 'str-concept-cmp-less' : 'str-concept-cmp-greater');
                        b2.classList.add(c2 < c1 ? 'str-concept-cmp-less' : 'str-concept-cmp-greater');
                        resultEl.style.display = 'block';
                        if (c1 < c2) {
                            resultEl.innerHTML = '<span class="str-concept-cmp-lt">"' + s1 + '" < "' + s2 + '" (char ' + (step + 1) + ': \'' + s1[step] + '\'(' + c1 + ') < \'' + s2[step] + '\'(' + c2 + '))</span>';
                        } else {
                            resultEl.innerHTML = '<span class="str-concept-cmp-gt">"' + s1 + '" > "' + s2 + '" (char ' + (step + 1) + ': \'' + s1[step] + '\'(' + c1 + ') > \'' + s2[step] + '\'(' + c2 + '))</span>';
                        }
                        msgEl.textContent = 'Found the first different character! Order is determined by ASCII values.';
                    }
                }
                nextStep();
            }

            // Initial box rendering
            renderCmpBoxes(input1.value, boxes1);
            renderCmpBoxes(input2.value, boxes2);

            container.querySelector('#str-concept-cmp-btn').addEventListener('click', runComparison);
        }

        // --- Demo 4: Method Playground ---
        {
            var methodInput = container.querySelector('#str-concept-method-input');
            var beforeEl = container.querySelector('#str-concept-method-before');
            var arrowEl = container.querySelector('#str-concept-method-arrow');
            var afterEl = container.querySelector('#str-concept-method-after');
            var msgEl4 = container.querySelector('#str-concept-demo4-msg');

            function renderCharBoxes(targetEl, str, highlights) {
                targetEl.style.display = 'flex';
                targetEl.style.cssText = 'display:flex;gap:3px;flex-wrap:wrap;justify-content:center;';
                targetEl.innerHTML = '';
                for (var i = 0; i < str.length; i++) {
                    var box = document.createElement('span');
                    var ch = str[i] === ' ' ? '␣' : str[i];
                    var hl = highlights && highlights.indexOf(i) !== -1;
                    box.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:30px;height:34px;border-radius:6px;font-weight:700;font-size:0.95rem;font-family:"Fira Code",monospace;' +
                        (hl ? 'background:var(--accent);color:white;' : 'background:var(--bg2);color:var(--text);border:1px solid var(--border);');
                    box.textContent = ch;
                    targetEl.appendChild(box);
                }
            }

            function renderResultBoxes(targetEl, parts, colors) {
                targetEl.style.display = 'flex';
                targetEl.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center;';
                targetEl.innerHTML = '';
                for (var i = 0; i < parts.length; i++) {
                    var chip = document.createElement('span');
                    chip.style.cssText = 'display:inline-flex;align-items:center;padding:6px 12px;border-radius:8px;font-weight:600;font-size:0.9rem;font-family:"Fira Code",monospace;' +
                        'background:' + (colors && colors[i] ? colors[i] : 'rgba(0,184,148,0.15)') + ';color:var(--text);';
                    chip.textContent = parts[i];
                    targetEl.appendChild(chip);
                }
            }

            function showResult(methodLabel, codeStr, beforeStr, result, highlights) {
                renderCharBoxes(beforeEl, beforeStr, highlights || []);
                arrowEl.style.display = 'block';
                arrowEl.innerHTML = '⬇️ <code style="font-size:0.85rem;">' + codeStr + '</code>';
                if (typeof result === 'string') {
                    renderCharBoxes(afterEl, result, []);
                } else if (Array.isArray(result)) {
                    renderResultBoxes(afterEl, result);
                } else {
                    afterEl.style.display = 'flex';
                    afterEl.style.cssText = 'display:flex;justify-content:center;';
                    afterEl.innerHTML = '<span style="padding:8px 16px;background:rgba(0,184,148,0.15);border-radius:8px;font-weight:700;font-size:1.1rem;color:var(--green);">' + result + '</span>';
                }
                msgEl4.textContent = methodLabel;
            }

            container.querySelector('#str-concept-method-btns').addEventListener('click', function(e) {
                var btn = e.target.closest('[data-method]');
                if (!btn) return;
                var s = methodInput.value;
                var method = btn.dataset.method;

                switch (method) {
                    case 'upper':
                        showResult('Converted to uppercase! Only lowercase letters change.', 's.upper()', s, s.toUpperCase());
                        break;
                    case 'lower':
                        showResult('Converted to lowercase! Only uppercase letters change.', 's.lower()', s, s.toLowerCase());
                        break;
                    case 'find': {
                        var idx = s.indexOf('o');
                        var hl = idx >= 0 ? [idx] : [];
                        showResult(idx >= 0 ? 'Found \'o\' at index ' + idx + '!' : '\'o\' not found → returns -1', "s.find('o')", s, idx, hl);
                        break;
                    }
                    case 'count': {
                        var cnt = 0;
                        var cntHl = [];
                        for (var ci = 0; ci < s.length; ci++) {
                            if (s[ci] === 'l') { cnt++; cntHl.push(ci); }
                        }
                        showResult('\'l\' appears ' + cnt + ' time(s)!', "s.count('l')", s, cnt, cntHl);
                        break;
                    }
                    case 'replace':
                        showResult('All \'l\' replaced with \'★\'!', "s.replace('l','★')", s, s.replace(/l/g, '★'));
                        break;
                    case 'split': {
                        var parts = s.split(',');
                        renderCharBoxes(beforeEl, s, []);
                        arrowEl.style.display = 'block';
                        arrowEl.innerHTML = "⬇️ <code style=\"font-size:0.85rem;\">s.split(',')</code>";
                        renderResultBoxes(afterEl, parts.map(function(p) { return '"' + p.trim() + '"'; }));
                        msgEl4.textContent = 'Split into ' + parts.length + ' pieces by comma!';
                        break;
                    }
                    case 'strip':
                        showResult('Leading/trailing whitespace removed! Inner spaces stay.', 's.strip()', s, s.trim());
                        break;
                    case 'isalpha': {
                        var alphaHl = [];
                        var nonAlpha = [];
                        for (var ai = 0; ai < s.length; ai++) {
                            if (/[a-zA-Z]/.test(s[ai])) alphaHl.push(ai);
                            else nonAlpha.push(ai);
                        }
                        var allAlpha = nonAlpha.length === 0 && s.length > 0;
                        renderCharBoxes(beforeEl, s, alphaHl);
                        arrowEl.style.display = 'block';
                        arrowEl.innerHTML = '⬇️ <code style="font-size:0.85rem;">s.isalpha()</code>';
                        afterEl.style.display = 'flex';
                        afterEl.style.cssText = 'display:flex;justify-content:center;';
                        afterEl.innerHTML = '<span style="padding:8px 16px;border-radius:8px;font-weight:700;font-size:1.1rem;' +
                            (allAlpha ? 'background:rgba(0,184,148,0.15);color:var(--green);">True ✅' : 'background:rgba(255,118,117,0.15);color:var(--red);">False ❌') + '</span>';
                        msgEl4.textContent = allAlpha ? 'All alphabetic — True!' : nonAlpha.length + ' non-alpha character(s) found — False!';
                        break;
                    }
                    case 'reverse':
                        showResult('String reversed! Useful for palindrome checks.', 's[::-1]', s, s.split('').reverse().join(''));
                        break;
                    case 'sorted': {
                        var sorted = s.split('').sort().join('');
                        showResult('All characters sorted by ASCII order! (space→digits→uppercase→lowercase)', 'sorted(s)', s, sorted);
                        break;
                    }
                }
            });
        }

    },

    // ===== Unused tabs (merged) =====
    renderVisualize(container) {
        container.innerHTML = '';
    },

    renderProblem(container) {
        container.innerHTML = '';
    },

    // ===== Problem sub-tab: Problem =====
    _renderProblemTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        contentEl.innerHTML = `
            ${prob.descriptionHTML}
            <div style="text-align:right;margin-top:1.2rem;">
                <a href="${prob.link}" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">
                    ${isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗'}
                </a>
            </div>
        `;
        contentEl.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });
    },

    // ===== Problem sub-tab: Hints =====
    _renderThinkTab(contentEl, prob) {
        // Guide text
        const guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click each step to reveal the hints';
        contentEl.appendChild(guide);

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';
        const openedState = {};

        prob.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `
                <div class="hint-step-header">
                    <span class="hint-step-num">${idx + 1}</span>
                    <span class="hint-step-title">${hint.title}</span>
                    <span class="hint-step-toggle">▾</span>
                </div>
                <div class="hint-step-body">${hint.content}</div>
            `;

            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('opened');
                step.querySelector('.hint-step-toggle').textContent =
                    step.classList.contains('opened') ? '▴' : '▾';

                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < prob.hints.length) {
                        const nextStep = hintsDiv.children[idx + 1];
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
            if (prob.id === 'boj-1157') {
                this._renderBonusSpeedComparison(contentEl);
            }
            if (prob.id === 'lc-125') {
                this._renderBonusPalindromeComparison(contentEl);
            }
            if (prob.id === 'boj-1213') {
                this._renderBonusMakePalindromeComparison(contentEl);
            }
            return;
        }
        const isLC = prob.link.includes('leetcode');
        const wrapper = document.createElement('div');

        wrapper.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
                <select class="str-lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--card);color:var(--text);">
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                </select>
                <a href="${prob.link}" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">
                    ${isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗'}
                </a>
            </div>
            <div class="code-block"><pre><code class="language-python"></code></pre></div>
        `;

        const codeEl = wrapper.querySelector('code');
        codeEl.textContent = prob.templates.python;
        if (window.hljs) hljs.highlightElement(codeEl);

        const select = wrapper.querySelector('.str-lang-select');
        select.addEventListener('change', () => {
            const lang = select.value;
            const langMap = { python: 'language-python', cpp: 'language-cpp' };
            codeEl.className = langMap[lang];
            codeEl.textContent = prob.templates[lang];
            codeEl.removeAttribute('data-highlighted');
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        contentEl.appendChild(wrapper);
    },

    // ===== Bonus: Counter speed comparison =====
    _renderBonusSpeedComparison(contentEl) {
        const bonus = document.createElement('div');
        bonus.className = 'bonus-speed-section';
        bonus.innerHTML = `
            <div class="bonus-divider">
                <span class="bonus-divider-line"></span>
                <span class="bonus-divider-label">📦 Bonus: One-Liner?</span>
                <span class="bonus-divider-toggle">▼</span>
                <span class="bonus-divider-line"></span>
            </div>

            <div class="bonus-content"><div class="bonus-card">
                <p style="margin-bottom:12px;color:var(--text2);font-size:0.95rem;">
                    With Python's <code>collections.Counter</code>, frequency counting becomes a one-liner!
                </p>
                <div class="code-block" style="margin-bottom:16px;">
                    <div class="code-block-header">
                        <div class="code-block-dots"><span></span><span></span><span></span></div>
                        <div class="code-block-title">counter_solution.py</div>
                    </div>
                    <pre style="margin:0;padding:1rem;"><code class="language-python hljs"><span class="hljs-keyword">from</span> collections <span class="hljs-keyword">import</span> Counter

word = <span class="hljs-built_in">input</span>().upper()
cnt = Counter(word)
top = cnt.most_common(<span class="hljs-number">2</span>)

<span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(top) > <span class="hljs-number">1</span> <span class="hljs-keyword">and</span> top[<span class="hljs-number">0</span>][<span class="hljs-number">1</span>] == top[<span class="hljs-number">1</span>][<span class="hljs-number">1</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">"?"</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(top[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>])</code></pre>
                </div>

                <div class="bonus-speed-title">⚡ Speed Comparison: Dictionary vs Counter</div>
                <p style="margin-bottom:16px;color:var(--text2);font-size:0.9rem;">
                    Move the slider to see how the speed difference changes as data gets larger!
                </p>

                <div class="speed-slider-row">
                    <span class="speed-slider-label">Data Size</span>
                    <input type="range" class="speed-slider" min="0" max="100" step="1" value="0">
                    <span class="speed-size-display">100 chars</span>
                </div>

                <div class="speed-bars-container">
                    <div class="speed-bar-row">
                        <span class="speed-bar-label">Dictionary</span>
                        <div class="speed-bar-track">
                            <div class="speed-bar-fill dict-bar" style="width:3%"></div>
                        </div>
                        <span class="speed-bar-time dict-time">0.02ms</span>
                    </div>
                    <div class="speed-bar-row">
                        <span class="speed-bar-label">Counter</span>
                        <div class="speed-bar-track">
                            <div class="speed-bar-fill counter-bar" style="width:2%"></div>
                        </div>
                        <span class="speed-bar-time counter-time">0.015ms</span>
                    </div>
                </div>

                <div class="speed-ratio-badge">
                    Similar Speed 🤝
                </div>

                <div class="speed-explanation" style="margin-top:16px;padding:14px 18px;background:var(--bg2);border-radius:10px;border:1px solid var(--bg3);">
                    <p style="font-size:0.9rem;color:var(--text);margin:0 0 10px 0;font-weight:700;">
                        💡 Why is Counter faster?
                    </p>
                    <div style="display:flex;flex-direction:column;gap:8px;font-size:0.88rem;color:var(--text2);line-height:1.6;">
                        <div>🐍 <strong>Dictionary</strong>: Python iterates character by character with <code>for c in word:</code>, executing <code>freq[c] += 1</code> each time. This loop is interpreted line-by-line by the Python interpreter.</div>
                        <div>⚡ <strong>Counter</strong>: Calling <code>Counter(word)</code> internally runs <strong>a C-written <code>_count_elements</code></strong> function. It's the same loop, but compiled C code runs much faster!</div>
                        <div style="padding:8px 12px;background:rgba(0,184,148,0.08);border-radius:8px;margin-top:4px;">📌 <strong>Key point</strong>: Both are O(n), but the <strong>constant factor difference</strong> between Python loops vs C loops becomes apparent as data grows.</div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Bonus toggle
        const divider1 = bonus.querySelector('.bonus-divider');
        divider1.addEventListener('click', () => {
            bonus.classList.toggle('bonus-open');
            divider1.querySelector('.bonus-divider-toggle').textContent = bonus.classList.contains('bonus-open') ? '▲' : '▼';
        });

        // Continuous interpolation: slider 0~100 maps to 100 ~ 1,000,000 chars (log scale)
        const slider = bonus.querySelector('.speed-slider');
        const sizeDisplay = bonus.querySelector('.speed-size-display');
        const dictBar = bonus.querySelector('.dict-bar');
        const counterBar = bonus.querySelector('.counter-bar');
        const dictTime = bonus.querySelector('.dict-time');
        const counterTime = bonus.querySelector('.counter-time');
        const ratioBadge = bonus.querySelector('.speed-ratio-badge');

        function formatSize(n) {
            if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M chars';
            if (n >= 1000) return Math.round(n / 1000).toLocaleString() + 'K chars';
            return n.toLocaleString() + ' chars';
        }

        function formatTime(ms) {
            if (ms >= 1) return ms.toFixed(1) + 'ms';
            return ms.toFixed(3) + 'ms';
        }

        function update(val) {
            // Log scale: 0→100 chars, 100→1,000,000 chars
            const t = val / 100;
            const size = Math.round(100 * Math.pow(10000, t));  // 100 ~ 1,000,000

            // Realistic speed curves (ms)
            // Both have ~0.03ms fixed overhead (function call, object creation)
            // dict: +0.00015ms per char (Python for-loop)
            // Counter: +0.000015ms per char (C-optimized internal loop)
            // Small data → overhead dominates → similar speed
            // Large data → per-char cost dominates → Counter wins big
            const dictMs = 0.00015 * size + 0.03;
            const counterMs = 0.000015 * size + 0.03;

            sizeDisplay.textContent = formatSize(size);

            const maxMs = 0.00015 * 1000000 + 0.005; // ~150ms
            const dictPct = Math.max(3, (dictMs / maxMs) * 100);
            const counterPct = Math.max(3, (counterMs / maxMs) * 100);

            dictBar.style.width = dictPct + '%';
            counterBar.style.width = counterPct + '%';

            dictTime.textContent = formatTime(dictMs);
            counterTime.textContent = formatTime(counterMs);

            const ratio = dictMs / counterMs;
            if (ratio < 1.5) {
                ratioBadge.textContent = 'Similar Speed 🤝';
                ratioBadge.className = 'speed-ratio-badge ratio-similar';
            } else if (ratio < 5) {
                ratioBadge.textContent = 'Counter is ' + ratio.toFixed(1) + 'x faster! ⚡';
                ratioBadge.className = 'speed-ratio-badge ratio-fast';
            } else {
                ratioBadge.textContent = 'Counter is ' + ratio.toFixed(1) + 'x faster! 🚀';
                ratioBadge.className = 'speed-ratio-badge ratio-super';
            }
        }

        slider.addEventListener('input', () => update(parseInt(slider.value)));
        update(0);

        contentEl.appendChild(bonus);
    },

    // ===== Bonus: Valid Palindrome comparison =====
    _renderBonusPalindromeComparison(contentEl) {
        const bonus = document.createElement('div');
        bonus.className = 'bonus-speed-section';
        bonus.innerHTML = `
            <div class="bonus-divider">
                <span class="bonus-divider-line"></span>
                <span class="bonus-divider-label">📦 Bonus: One-Shot with Regex!</span>
                <span class="bonus-divider-toggle">▼</span>
                <span class="bonus-divider-line"></span>
            </div>

            <div class="bonus-content"><div class="bonus-card">
                <p style="margin-bottom:12px;color:var(--text2);font-size:0.95rem;">
                    With Python's <code>re</code> module and slicing, it's done in 3 lines!
                </p>
                <div class="code-block" style="margin-bottom:16px;">
                    <div class="code-block-header">
                        <div class="code-block-dots"><span></span><span></span><span></span></div>
                        <div class="code-block-title">one_liner.py</div>
                    </div>
                    <pre style="margin:0;padding:1rem;"><code class="language-python hljs"><span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">isPalindrome</span>(s):
    s = re.sub(<span class="hljs-string">r'[^a-zA-Z0-9]'</span>, <span class="hljs-string">''</span>, s).lower()
    <span class="hljs-keyword">return</span> s == s[::<span class="hljs-number">-1</span>]</code></pre>
                </div>

                <div class="bonus-speed-title">⚡ Slicing vs Two Pointer — What's the Difference?</div>
                <p style="margin-bottom:16px;color:var(--text2);font-size:0.9rem;">
                    Move the slider to see how the difference changes as the string gets longer!
                </p>

                <div class="speed-slider-row">
                    <span class="speed-slider-label">String Length</span>
                    <input type="range" class="speed-slider pal-slider" min="0" max="100" step="1" value="0">
                    <span class="speed-size-display pal-size">100 chars</span>
                </div>

                <div class="speed-bars-container">
                    <div class="speed-bar-row">
                        <span class="speed-bar-label" style="min-width:80px">Slicing</span>
                        <div class="speed-bar-track">
                            <div class="speed-bar-fill dict-bar pal-slice-bar" style="width:3%"></div>
                        </div>
                        <span class="speed-bar-time pal-slice-time">0.01ms</span>
                    </div>
                    <div class="speed-bar-row">
                        <span class="speed-bar-label" style="min-width:80px">Two Pointer</span>
                        <div class="speed-bar-track">
                            <div class="speed-bar-fill counter-bar pal-tp-bar" style="width:3%"></div>
                        </div>
                        <span class="speed-bar-time pal-tp-time">0.02ms</span>
                    </div>
                </div>

                <div class="speed-ratio-badge pal-badge">
                    Similar Speed 🤝
                </div>

                <div style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap;">
                    <div style="flex:1;min-width:180px;padding:12px;background:rgba(253,203,110,0.08);border:1px solid rgba(253,203,110,0.25);border-radius:10px;">
                        <div style="font-weight:700;font-size:0.9rem;margin-bottom:6px;">🔄 Slicing <code>[::-1]</code></div>
                        <div style="font-size:0.85rem;color:var(--text2);line-height:1.5;">
                            Speed: <strong>Fast</strong> (C-optimized)<br>
                            Memory: <strong>O(n)</strong> creates a copy<br>
                            Code: Short and intuitive
                        </div>
                    </div>
                    <div style="flex:1;min-width:180px;padding:12px;background:rgba(0,184,148,0.06);border:1px solid rgba(0,184,148,0.2);border-radius:10px;">
                        <div style="font-weight:700;font-size:0.9rem;margin-bottom:6px;">👆 Two Pointer</div>
                        <div style="font-size:0.85rem;color:var(--text2);line-height:1.5;">
                            Speed: Python loop (slower)<br>
                            Memory: <strong>O(1)</strong> no extra!<br>
                            Code: Preferred in interviews
                        </div>
                    </div>
                </div>

                <div style="margin-top:14px;display:flex;gap:12px;flex-wrap:wrap;">
                    <div class="pal-mem-card" style="flex:1;min-width:120px;text-align:center;padding:10px;background:var(--bg);border-radius:10px;border:1px solid var(--bg3);">
                        <div style="font-size:0.8rem;color:var(--text2);">Slicing Memory</div>
                        <div class="pal-mem-slice" style="font-size:1.1rem;font-weight:700;color:#e17055;font-family:'Fira Code',monospace;">~100B</div>
                    </div>
                    <div class="pal-mem-card" style="flex:1;min-width:120px;text-align:center;padding:10px;background:var(--bg);border-radius:10px;border:1px solid var(--bg3);">
                        <div style="font-size:0.8rem;color:var(--text2);">Two Pointer Memory</div>
                        <div style="font-size:1.1rem;font-weight:700;color:var(--green);font-family:'Fira Code',monospace;">~16B fixed</div>
                    </div>
                </div>

                <div style="margin-top:14px;padding:12px 16px;background:var(--bg2);border-radius:10px;border:1px solid var(--bg3);">
                    <p style="font-size:0.9rem;color:var(--text);margin:0 0 8px 0;font-weight:700;">
                        💡 So which should you use?
                    </p>
                    <div style="font-size:0.88rem;color:var(--text2);line-height:1.6;">
                        <div>✅ <strong>Coding tests</strong>: Slicing is fast and concise — great advantage</div>
                        <div>✅ <strong>Interviews</strong>: Two pointer — impressive when you can explain "O(1) space"</div>
                        <div>✅ <strong>Production</strong>: Slicing for small data, two pointer when memory is constrained</div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Bonus toggle
        const divider2 = bonus.querySelector('.bonus-divider');
        divider2.addEventListener('click', () => {
            bonus.classList.toggle('bonus-open');
            divider2.querySelector('.bonus-divider-toggle').textContent = bonus.classList.contains('bonus-open') ? '▲' : '▼';
        });

        const slider = bonus.querySelector('.pal-slider');
        const sizeDisplay = bonus.querySelector('.pal-size');
        const sliceBar = bonus.querySelector('.pal-slice-bar');
        const tpBar = bonus.querySelector('.pal-tp-bar');
        const sliceTime = bonus.querySelector('.pal-slice-time');
        const tpTime = bonus.querySelector('.pal-tp-time');
        const badge = bonus.querySelector('.pal-badge');
        const memSlice = bonus.querySelector('.pal-mem-slice');

        function formatSize(n) {
            if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M chars';
            if (n >= 1000) return Math.round(n / 1000).toLocaleString() + 'K chars';
            return n.toLocaleString() + ' chars';
        }
        function formatTime(ms) {
            return ms >= 1 ? ms.toFixed(1) + 'ms' : ms.toFixed(3) + 'ms';
        }
        function formatMem(bytes) {
            if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'MB';
            if (bytes >= 1024) return (bytes / 1024).toFixed(0) + 'KB';
            return '~' + bytes + 'B';
        }

        function update(val) {
            const t = val / 100;
            const size = Math.round(100 * Math.pow(2000, t)); // 100 ~ 200,000

            sizeDisplay.textContent = formatSize(size);

            // Slicing: C-optimized, very fast, but O(n) memory
            const sliceMs = 0.000005 * size + 0.005;
            // Two pointer: Python loop, slower, but O(1) memory
            const tpMs = 0.00008 * size + 0.008;

            const maxMs = 0.00008 * 200000 + 0.008; // ~16ms
            sliceBar.style.width = Math.max(3, (sliceMs / maxMs) * 100) + '%';
            tpBar.style.width = Math.max(3, (tpMs / maxMs) * 100) + '%';

            sliceTime.textContent = formatTime(sliceMs);
            tpTime.textContent = formatTime(tpMs);

            memSlice.textContent = formatMem(size);

            const ratio = tpMs / sliceMs;
            if (ratio < 2) {
                badge.textContent = 'Similar Speed 🤝';
                badge.className = 'speed-ratio-badge pal-badge ratio-similar';
            } else if (ratio < 8) {
                badge.textContent = 'Slicing is ' + ratio.toFixed(1) + 'x faster! ⚡';
                badge.className = 'speed-ratio-badge pal-badge ratio-fast';
            } else {
                badge.textContent = 'Slicing is ' + ratio.toFixed(0) + 'x faster! 🚀';
                badge.className = 'speed-ratio-badge pal-badge ratio-super';
            }
        }

        slider.addEventListener('input', () => update(parseInt(slider.value)));
        update(0);

        contentEl.appendChild(bonus);
    },

    // ===== Bonus: Make Palindrome — Array vs Counter speed comparison =====
    _renderBonusMakePalindromeComparison(contentEl) {
        const bonus = document.createElement('div');
        bonus.className = 'bonus-speed-section';
        bonus.innerHTML = `
            <div class="bonus-divider">
                <span class="bonus-divider-line"></span>
                <span class="bonus-divider-label">📦 Bonus: Shorter with Counter?</span>
                <span class="bonus-divider-toggle">▼</span>
                <span class="bonus-divider-line"></span>
            </div>
            <div class="bonus-content"><div class="bonus-card">
                <p style="margin:0 0 12px;color:var(--text-secondary);">With Python's <code>Counter</code>, frequency counting + odd check becomes much more concise!</p>
                <div style="background:#282c34;border-radius:12px;overflow:hidden;">
                    <div style="display:flex;align-items:center;padding:8px 16px;background:#21252b;">
                        <span style="display:flex;gap:6px;">
                            <span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;display:inline-block;"></span>
                            <span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;display:inline-block;"></span>
                            <span style="width:12px;height:12px;border-radius:50%;background:#27c93f;display:inline-block;"></span>
                        </span>
                        <span style="flex:1;text-align:center;color:#888;font-size:0.85em;font-family:monospace;">palindrome_counter.py</span>
                    </div>
                    <pre style="margin:0;padding:20px;color:#d4d8e0;font-size:0.95rem;line-height:1.8;overflow-x:auto;"><code><span style="color:#c678dd;">from</span> <span style="color:#d4d8e0;">collections</span> <span style="color:#c678dd;">import</span> Counter

<span style="color:#d4d8e0;">cnt</span> = Counter(<span style="color:#56b6c2;">input</span>())
<span style="color:#d4d8e0;">odds</span> = [c <span style="color:#c678dd;">for</span> c, v <span style="color:#c678dd;">in</span> cnt.items() <span style="color:#c678dd;">if</span> v % <span style="color:#d19a66;">2</span>]

<span style="color:#c678dd;">if</span> <span style="color:#56b6c2;">len</span>(odds) > <span style="color:#d19a66;">1</span>:
    <span style="color:#56b6c2;">print</span>(<span style="color:#98c379;">"I'm Sorry Hansoo"</span>)
<span style="color:#c678dd;">else</span>:
    <span style="color:#d4d8e0;">half</span> = <span style="color:#98c379;">""</span>.join(c * (v // <span style="color:#d19a66;">2</span>) <span style="color:#c678dd;">for</span> c, v <span style="color:#c678dd;">in</span> <span style="color:#56b6c2;">sorted</span>(cnt.items()))
    <span style="color:#d4d8e0;">mid</span> = odds[<span style="color:#d19a66;">0</span>] <span style="color:#c678dd;">if</span> odds <span style="color:#c678dd;">else</span> <span style="color:#98c379;">""</span>
    <span style="color:#56b6c2;">print</span>(half + mid + half[::<span style="color:#d19a66;">-1</span>])</code></pre>
                </div>
            </div>
            <h3 style="margin:28px 0 8px;font-size:1.1em;">⚡ Array Counting vs Counter — What's the Difference?</h3>
            <p style="color:var(--text-secondary);margin-bottom:16px;">Move the slider to see how the difference changes as the string gets longer!</p>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                <span style="font-weight:600;white-space:nowrap;">String Length</span>
                <input type="range" min="0" max="100" value="0" class="speed-slider mkpal-slider" />
                <span class="mkpal-size-label" style="color:var(--accent);font-weight:700;min-width:60px;text-align:right;">10 chars</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="min-width:70px;text-align:right;font-weight:500;">Array</span>
                    <div style="flex:1;background:var(--bg-secondary);border-radius:8px;height:28px;overflow:hidden;position:relative;">
                        <div class="speed-bar-fill mkpal-bar-arr" style="height:100%;border-radius:8px;width:50%;background:linear-gradient(90deg,#e17055,#fdcb6e);"></div>
                    </div>
                    <span class="mkpal-time-arr" style="min-width:70px;font-size:0.85em;color:var(--text-secondary);">0.01ms</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="min-width:70px;text-align:right;font-weight:500;">Counter</span>
                    <div style="flex:1;background:var(--bg-secondary);border-radius:8px;height:28px;overflow:hidden;position:relative;">
                        <div class="speed-bar-fill mkpal-bar-ctr" style="height:100%;border-radius:8px;width:50%;background:linear-gradient(90deg,#6c5ce7,#a29bfe);"></div>
                    </div>
                    <span class="mkpal-time-ctr" style="min-width:70px;font-size:0.85em;color:var(--text-secondary);">0.01ms</span>
                </div>
            </div>
            <div class="speed-ratio-badge mkpal-badge" style="margin-top:16px;">Similar Speed 🤝</div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px;">
                <div style="background:rgba(225,112,85,0.08);border:1px solid rgba(225,112,85,0.2);border-radius:12px;padding:16px;">
                    <h4 style="margin:0 0 8px;">📊 Array Counting</h4>
                    <p style="margin:0;font-size:0.9em;color:var(--text-secondary);">Method: <code>[0]*26</code> + <code>ord()</code><br>Pros: Fixed memory, works in C++ too<br>Cons: Code is a bit longer</p>
                </div>
                <div style="background:var(--bg2);border:1px solid var(--bg3);border-radius:12px;padding:16px;">
                    <h4 style="margin:0 0 8px;">⚡ Counter</h4>
                    <p style="margin:0;font-size:0.9em;color:var(--text-secondary);">Method: <code>Counter(s)</code> one line<br>Pros: Pythonic and concise!<br>Cons: Python only</p>
                </div>
            </div>

            <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;margin-top:16px;">
                <h4 style="margin:0 0 8px;">💡 So which should you use?</h4>
                <p style="margin:0;font-size:0.9em;color:var(--text-secondary);">
                    ✅ <strong>Python coding tests</strong>: Counter — short and fewer mistakes<br>
                    ✅ <strong>Interviews (C++)</strong>: Array — shows language-agnostic thinking<br>
                    ✅ <strong>This problem (length ≤ 50)</strong>: Both are fast enough! Use what's comfortable
                </p>
            </div>
        </div>
        `;

        // Bonus toggle
        const divider4 = bonus.querySelector('.bonus-divider');
        divider4.addEventListener('click', () => {
            bonus.classList.toggle('bonus-open');
            divider4.querySelector('.bonus-divider-toggle').textContent = bonus.classList.contains('bonus-open') ? '▲' : '▼';
        });

        const slider = bonus.querySelector('.mkpal-slider');
        const sizeLabel = bonus.querySelector('.mkpal-size-label');
        const barArr = bonus.querySelector('.mkpal-bar-arr');
        const barCtr = bonus.querySelector('.mkpal-bar-ctr');
        const timeArr = bonus.querySelector('.mkpal-time-arr');
        const timeCtr = bonus.querySelector('.mkpal-time-ctr');
        const badge = bonus.querySelector('.mkpal-badge');

        function update(val) {
            const t = val / 100;
            // Log scale: 10 ~ 1,000,000
            const size = Math.round(10 * Math.pow(100000, t));
            if (size >= 1000000) sizeLabel.textContent = (size/1000000).toFixed(0) + 'M chars';
            else if (size >= 1000) sizeLabel.textContent = (size/1000).toFixed(0) + 'K chars';
            else sizeLabel.textContent = size + ' chars';

            // Array: Python loop per char
            const arrMs = 0.00015 * size + 0.02;
            // Counter: C-optimized _count_elements
            const ctrMs = 0.000015 * size + 0.02;

            const maxMs = Math.max(arrMs, ctrMs);
            barArr.style.width = (arrMs / maxMs * 80 + 10) + '%';
            barCtr.style.width = (ctrMs / maxMs * 80 + 10) + '%';
            timeArr.textContent = arrMs < 1 ? arrMs.toFixed(3) + 'ms' : arrMs.toFixed(1) + 'ms';
            timeCtr.textContent = ctrMs < 1 ? ctrMs.toFixed(3) + 'ms' : ctrMs.toFixed(1) + 'ms';

            const ratio = arrMs / ctrMs;
            if (ratio < 1.5) {
                badge.textContent = 'Similar Speed 🤝';
                badge.className = 'speed-ratio-badge mkpal-badge ratio-similar';
            } else if (ratio < 5) {
                badge.textContent = 'Counter is ' + ratio.toFixed(1) + 'x faster! ⚡';
                badge.className = 'speed-ratio-badge mkpal-badge ratio-fast';
            } else {
                badge.textContent = 'Counter is ' + ratio.toFixed(0) + 'x faster! 🚀';
                badge.className = 'speed-ratio-badge mkpal-badge ratio-super';
            }
        }

        slider.addEventListener('input', () => update(parseInt(slider.value)));
        update(0);

        contentEl.appendChild(bonus);
    },

    // ===== Alphabet Find visualization =====
    _renderVizAlphaFind(container) {
        const self = this;
        container.innerHTML = `
            <div id="alpha-find-section" style="padding:16px;background:var(--bg2);border-radius:12px;border:1px solid var(--border);border-left:4px solid #00b894;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
                    <span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:1rem;color:#00b894;">
                        <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:#00b894;color:#fff;font-size:0.8rem;font-weight:700;">1</span>
                        Alphabet Find
                    </span>
                    <span class="approach-meta-badge time">⏱ O(n)</span>
                    <span class="approach-meta-badge space">💾 O(1)</span>
                </div>
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                    <label style="font-weight:600;">String:
                        <input type="text" id="alpha-find-input" value="baekjoon"
                            style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;">
                    </label>
                    <button class="btn btn-primary" id="alpha-find-start" style="font-size:1rem;">🔍 Start Search</button>
                </div>
                <div id="alpha-find-viz-area" style="display:none;">
                    ${self._createStepDesc('-alphafind')}
                    <div class="sim-card" style="padding:24px;">
                        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;">
                            <div id="alpha-find-char-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        </div>
                        <div style="margin-top:16px;width:100%;">
                            <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Result Array (first position of a~z, -1 if absent)</div>
                            <div id="alpha-find-result" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;font-family:var(--font-mono);font-size:0.85rem;"></div>
                        </div>
                        <div style="min-width:140px;margin-top:12px;">
                            <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Current Status</div>
                            <div id="alpha-find-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                        </div>
                        <div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-top:12px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> Waiting</span>
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> Currently checking</span>
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> Processed</span>
                        </div>
                    </div>
                    ${self._createStepControls('-alphafind')}
                </div>
            </div>
        `;

        var section = container.querySelector('#alpha-find-section');
        var vizArea = section.querySelector('#alpha-find-viz-area');
        var charBoxes = section.querySelector('#alpha-find-char-boxes');
        var resultArea = section.querySelector('#alpha-find-result');
        var statusEl = section.querySelector('#alpha-find-status');

        function renderBoxes(str) {
            charBoxes.innerHTML = '';
            for (var i = 0; i < str.length; i++) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + str[i] + '</div>';
                charBoxes.appendChild(box);
            }
        }

        function renderResult(arr) {
            resultArea.innerHTML = '';
            for (var i = 0; i < 26; i++) {
                var ch = String.fromCharCode(97 + i); // a~z
                var cell = document.createElement('div');
                cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:4px 5px;border-radius:6px;min-width:28px;' +
                    (arr[i] >= 0 ? 'background:rgba(0,184,148,0.15);color:var(--green);font-weight:700;' : 'background:var(--bg);color:var(--text3);');
                cell.innerHTML = '<span style="font-size:0.75rem;font-weight:600;">' + ch + '</span><span>' + arr[i] + '</span>';
                cell.id = 'alpha-result-' + i;
                resultArea.appendChild(cell);
            }
        }

        function saveState() {
            return {
                boxes: Array.from(charBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                result: resultArea.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.boxes[i]; });
            resultArea.innerHTML = s.result;
            statusEl.innerHTML = s.status;
        }

        section.querySelector('#alpha-find-start').addEventListener('click', function() {
            self._clearVizState();
            var str = section.querySelector('#alpha-find-input').value.toLowerCase();
            if (!str.length) return;

            vizArea.style.display = '';
            this.textContent = '🔄 Restart';

            renderBoxes(str);
            var result = new Array(26).fill(-1);
            renderResult(result);
            statusEl.innerHTML = 'Ready';

            var steps = [];

            // Check each character in order
            for (let i = 0; i < str.length; i++) {
                let idx = i, ch = str[i];
                let alphaIdx = ch.charCodeAt(0) - 97;
                let isFirst = result[alphaIdx] === -1;
                if (isFirst) result[alphaIdx] = i; // pre-calculate

                steps.push({
                    description: isFirst
                        ? 'str[' + idx + '] = \'' + ch + '\' → \'' + ch + '\'\'s first occurrence! Recording position ' + idx
                        : 'str[' + idx + '] = \'' + ch + '\' → already appeared at position ' + result[alphaIdx] + ', skipping',
                    _before: null,
                    _isFirst: isFirst,
                    _alphaIdx: alphaIdx,
                    _idx: idx,
                    _ch: ch,
                    action: function() {
                        this._before = saveState();
                        // Update box states up to current
                        for (var j = 0; j < str.length; j++) {
                            var box = charBoxes.querySelector('[data-idx="' + j + '"]');
                            if (!box) continue;
                            box.className = j < this._idx ? 'str-char-box matched' : j === this._idx ? 'str-char-box comparing' : 'str-char-box';
                        }
                        // Highlight the alphabet in result array
                        var cell = resultArea.querySelector('#alpha-result-' + this._alphaIdx);
                        if (cell && this._isFirst) {
                            cell.style.background = 'rgba(0,184,148,0.15)';
                            cell.style.color = 'var(--green)';
                            cell.style.fontWeight = '700';
                            cell.querySelector('span:last-child').textContent = this._idx;
                        }
                        statusEl.innerHTML = this._isFirst
                            ? '<span style="color:var(--green);">\'' + this._ch + '\' First occurrence! → result[' + this._alphaIdx + '] = ' + this._idx + '</span>'
                            : '\'' + this._ch + '\' → Already recorded (skipping)';
                    },
                    undo: function() {
                        restoreState(this._before);
                    }
                });
            }

            // Completion step
            steps.push({
                description: 'Done! Found the first occurrence position of all 26 alphabets 🎉',
                _before: null,
                action: function() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(function(b) { b.className = 'str-char-box matched'; });
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.05rem;">Done! Alphabets with -1 in the result array are not in the string.</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            // Reset result for simulation
            result = new Array(26).fill(-1);
            renderResult(result);

            self._initLocalStepController(section, steps, '-alphafind');
            section.querySelector('#viz-next-alphafind').click();
        });
    },

    // ===== Frequency counting visualization =====
    _renderVizFrequency(container) {
        const self = this;
        container.innerHTML = `
            <div id="freq-section" style="padding:16px;background:var(--bg2);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--accent);">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
                    <span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:1rem;color:var(--accent);">
                        <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:var(--accent);color:#fff;font-size:0.8rem;font-weight:700;">1</span>
                        Frequency Analysis
                    </span>
                    <span class="approach-meta-badge time">⏱ O(n)</span>
                    <span class="approach-meta-badge space">💾 O(1)</span>
                </div>
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                    <label style="font-weight:600;">String:
                        <input type="text" id="str-viz-input" value="Mississippi"
                            style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;">
                    </label>
                    <button class="btn btn-primary" id="str-viz-start" style="font-size:1rem;">🔍 Start Scan</button>
                </div>
                <div id="freq-viz-area" style="display:none;">
                    ${self._createStepDesc('-freq')}
                    <div class="sim-card" style="padding:24px;">
                        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;">
                            <div id="str-char-boxes-freq" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        </div>
                        <div style="display:flex;gap:24px;margin-top:16px;flex-wrap:wrap;width:100%;">
                            <div style="flex:1;min-width:200px;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Frequency Dictionary</div>
                                <div id="str-freq-display-freq" class="graph-queue-display" style="min-height:50px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">
                                    <span style="color:var(--text2);">{ }</span>
                                </div>
                            </div>
                            <div style="min-width:140px;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Current Status</div>
                                <div id="str-status-freq" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                            </div>
                        </div>
                        <div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-top:12px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> Waiting</span>
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> Currently Checking</span>
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> Done</span>
                        </div>
                    </div>
                    ${self._createStepControls('-freq')}
                </div>
            </div>
        `;

        var section = container.querySelector('#freq-section');
        var vizArea = section.querySelector('#freq-viz-area');
        var charBoxes = section.querySelector('#str-char-boxes-freq');
        var freqDisplay = section.querySelector('#str-freq-display-freq');
        var statusEl = section.querySelector('#str-status-freq');

        function renderBoxes(str) {
            charBoxes.innerHTML = '';
            for (var i = 0; i < str.length; i++) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + str[i] + '</div>';
                charBoxes.appendChild(box);
            }
        }

        function renderFreq(freq) {
            if (Object.keys(freq).length === 0) {
                freqDisplay.innerHTML = '<span style="color:var(--text2);">{ }</span>';
                return;
            }
            freqDisplay.innerHTML = Object.entries(freq)
                .map(function(e) { return '<span class="graph-queue-item" style="min-width:50px;text-align:center;"><strong>\'' + e[0] + '\'</strong>: ' + e[1] + '</span>'; })
                .join('');
        }

        function saveState() {
            return {
                boxes: Array.from(charBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                freq: freqDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.boxes[i]; });
            freqDisplay.innerHTML = s.freq;
            statusEl.innerHTML = s.status;
        }

        section.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            var str = section.querySelector('#str-viz-input').value;
            if (!str.length) return;

            // Show visualization area + change start button to "Restart"
            vizArea.style.display = '';
            this.textContent = '🔄 Restart';

            renderBoxes(str);
            renderFreq({});
            statusEl.innerHTML = 'Ready';

            var steps = [];
            var freq = {};
            var buildFreq = {};

            for (let i = 0; i < str.length; i++) {
                let idx = i, ch = str[i];
                let prevCount = buildFreq[ch] || 0;
                buildFreq[ch] = prevCount + 1;
                steps.push({
                    description: prevCount ? '\'' + ch + '\' → ' + (prevCount+1) + ' time! Increment count to track this character\'s frequency.' : '\'' + ch + '\' first appearance! Add to frequency table to track how many times this character occurs.',
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        for (let j = 0; j < str.length; j++) {
                            let box = charBoxes.querySelector('[data-idx="' + j + '"]');
                            if (!box) continue;
                            box.className = j < idx ? 'str-char-box matched' : j === idx ? 'str-char-box comparing' : 'str-char-box';
                        }
                        freq[ch] = (freq[ch] || 0) + 1;
                        renderFreq(freq);
                        statusEl.innerHTML = '\'' + ch + '\' → count = <strong>' + freq[ch] + '</strong>';
                    },
                    undo: function() {
                        freq[ch]--;
                        if (freq[ch] === 0) delete freq[ch];
                        restoreState(this._before);
                    }
                });
            }

            var finalFreq = {};
            for (var c = 0; c < str.length; c++) finalFreq[str[c]] = (finalFreq[str[c]] || 0) + 1;
            var entries = Object.entries(finalFreq).sort(function(a, b) { return b[1] - a[1]; });
            var maxChar = entries[0];

            steps.push({
                description: 'Done! Most frequent: \'' + maxChar[0] + '\' (' + maxChar[1] + ' times) 🎉',
                _before: null,
                action: function() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(function(b) { b.className = 'str-char-box matched'; });
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;">Done! Most frequent character: <strong>\'' + maxChar[0] + '\'</strong> (' + maxChar[1] + ' times)</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            self._initLocalStepController(section, steps, '-freq');
            // Enter Step 1 immediately upon starting
            section.querySelector('#viz-next-freq').click();
        });
    },

    // ===== Palindrome Check Visualization =====
    // ===== Valid Palindrome Simulation Coordinator =====
    _renderVizPalindrome(container) {
        const self = this;

        function sectionHeader(num, name, time, space, color) {
            var c = color || 'var(--accent)';
            return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:1rem;color:' + c + ';">' +
                    '<span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:' + c + ';color:#fff;font-size:0.8rem;font-weight:700;">' + num + '</span>' +
                    name +
                '</span>' +
                '<span class="approach-meta-badge time">⏱ ' + time + '</span>' +
                '<span class="approach-meta-badge space">💾 ' + space + '</span>' +
            '</div>';
        }

        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">
                <label style="font-weight:600;">String:
                    <input type="text" id="str-viz-input" value="A man, a plan, a canal: Panama"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;">
                </label>
                <button class="btn btn-primary" id="str-viz-start">Start</button>
            </div>
            <div id="palindrome-section-1" style="margin-bottom:8px;padding:16px;background:var(--bg2);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--accent);">
                ${sectionHeader('1', 'Reverse & Compare', 'O(n)', 'O(n)', 'var(--accent)')}
                <div style="text-align:center;color:var(--text2);padding:1.5rem;">▶ Click the Start button</div>
            </div>
            <div id="palindrome-section-2" style="padding:16px;background:rgba(9,132,227,0.04);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--blue);">
                ${sectionHeader('2', 'Two Pointers', 'O(n)', 'O(1)', 'var(--blue)')}
                <div style="text-align:center;color:var(--text2);padding:1.5rem;">▶ Click the Start button</div>
            </div>
        `;

        var section1 = container.querySelector('#palindrome-section-1');
        var section2 = container.querySelector('#palindrome-section-2');

        container.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            var raw = container.querySelector('#str-viz-input').value;
            var cleaned = raw.split('').filter(function(c) { return /[a-zA-Z0-9]/.test(c); })
                             .map(function(c) { return c.toLowerCase(); }).join('');
            if (!cleaned.length) {
                section1.innerHTML = '<div style="color:#e17055;padding:1rem;">Please enter a string!</div>';
                section2.innerHTML = '';
                return;
            }

            section1.innerHTML = sectionHeader('1', 'Reverse & Compare', 'O(n)', 'O(n)', 'var(--accent)') + '<div id="panel-1"></div>';
            section1.style.cssText = 'margin-bottom:8px;padding:16px;background:var(--bg2);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--accent);';
            section2.innerHTML = sectionHeader('2', 'Two Pointers', 'O(n)', 'O(1)', 'var(--blue)') + '<div id="panel-2"></div>';
            section2.style.cssText = 'padding:16px;background:rgba(9,132,227,0.04);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--blue);';

            self._renderVizPalinCleanReverse(section1.querySelector('#panel-1'), cleaned);
            self._renderVizPalinTwoPointer(section2.querySelector('#panel-2'), cleaned);
        });
    },

    // ===== Method 1: Reverse & Compare Simulation =====
    _renderVizPalinCleanReverse(panel, cleaned) {
        const self = this;
        const reversed = cleaned.split('').reverse().join('');

        panel.innerHTML = `
            ${self._createStepDesc('-1')}
            <div class="sim-card" style="padding:24px;">
                <div style="margin-bottom:12px;width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Alphanumeric Only</div>
                    <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                        <div id="str-cleaned-boxes-1" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                    </div>
                </div>
                <div style="margin-bottom:12px;width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Reversed String</div>
                    <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                        <div id="str-reversed-boxes-1" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                    </div>
                </div>
                <div style="width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Comparison Status</div>
                    <div id="str-status-1" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
                <div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-top:12px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> Waiting</span>
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> Comparing</span>
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> Match</span>
                </div>
            </div>
            ${self._createStepControls('-1')}
        `;

        var cleanedBoxes = panel.querySelector('#str-cleaned-boxes-1');
        var reversedBoxes = panel.querySelector('#str-reversed-boxes-1');
        var statusEl = panel.querySelector('#str-status-1');

        function renderBoxRow(containerEl, str) {
            containerEl.innerHTML = '';
            for (var i = 0; i < str.length; i++) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + str[i] + '</div>';
                containerEl.appendChild(box);
            }
        }

        function saveState() {
            return {
                cleanedClasses: Array.from(cleanedBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                reversedClasses: Array.from(reversedBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                reversedHTML: reversedBoxes.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            cleanedBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.cleanedClasses[i]; });
            reversedBoxes.innerHTML = s.reversedHTML;
            reversedBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { if (s.reversedClasses[i]) b.className = s.reversedClasses[i]; });
            statusEl.innerHTML = s.status;
        }

        var steps = [];

        // Step 1: Alphanumeric extraction done
        steps.push({
            description: 'Remove special chars → "' + cleaned + '"',
            _before: null,
            action: function() {
                this._before = saveState();
                renderBoxRow(cleanedBoxes, cleaned);
                reversedBoxes.innerHTML = '<span style="color:var(--text3);padding:8px;">Not yet created</span>';
                statusEl.innerHTML = 'Alphanumeric extraction done: length ' + cleaned.length;
            },
            undo: function() { restoreState(this._before); }
        });

        // Step 2: Reverse
        steps.push({
            description: 'Reverse → "' + reversed + '" (space O(n))',
            _before: null,
            action: function() {
                this._before = saveState();
                renderBoxRow(reversedBoxes, reversed);
                statusEl.innerHTML = 'reversed = cleaned[::-1] — <strong style="color:#e17055;">Uses O(n) extra space!</strong>';
            },
            undo: function() { restoreState(this._before); }
        });

        // Step 3~n: Comparison
        var isPalin = true;
        for (let i = 0; i < cleaned.length; i++) {
            let idx = i;
            let match = cleaned[idx] === reversed[idx];
            if (!match) isPalin = false;
            steps.push({
                description: match
                    ? '\'' + cleaned[idx] + '\' == \'' + reversed[idx] + '\' → match! ✓'
                    : '\'' + cleaned[idx] + '\' != \'' + reversed[idx] + '\' → mismatch! ✗',
                _before: null,
                action: function() {
                    this._before = saveState();
                    cleanedBoxes.querySelectorAll('.str-char-box').forEach(function(b, j) {
                        if (j < idx) b.className = 'str-char-box matched';
                        else if (j === idx) b.className = 'str-char-box comparing';
                        else b.className = 'str-char-box';
                    });
                    reversedBoxes.querySelectorAll('.str-char-box').forEach(function(b, j) {
                        if (j < idx) b.className = 'str-char-box matched';
                        else if (j === idx) b.className = 'str-char-box comparing';
                        else b.className = 'str-char-box';
                    });
                    statusEl.innerHTML = match
                        ? '<span style="color:var(--green);">\'' + cleaned[idx] + "' == '" + reversed[idx] + "' ✓</span>"
                        : '<span style="color:#e17055;">\'' + cleaned[idx] + "' != '" + reversed[idx] + "' ✗</span>";
                },
                undo: function() { restoreState(this._before); }
            });
            if (!match) break;
        }

        // Final result
        var finalIsPalin = isPalin;
        steps.push({
            description: finalIsPalin ? 'Palindrome! All matched 🎉' : 'Not a palindrome! Mismatch found ✗',
            _before: null,
            action: function() {
                this._before = saveState();
                if (finalIsPalin) {
                    cleanedBoxes.querySelectorAll('.str-char-box').forEach(function(b) { b.className = 'str-char-box matched'; });
                    reversedBoxes.querySelectorAll('.str-char-box').forEach(function(b) { b.className = 'str-char-box matched'; });
                }
                statusEl.innerHTML = finalIsPalin
                    ? '<span style="color:var(--green);font-size:1.1rem;"><strong>It\'s a palindrome!</strong> cleaned == reversed ✓</span>'
                    : '<span style="color:#e17055;font-size:1.1rem;"><strong>Not a palindrome</strong> cleaned != reversed ✗</span>';
            },
            undo: function() { restoreState(this._before); }
        });

        self._initLocalStepController(panel, steps, '-1');
    },

    // ===== Method 2: Two Pointers Simulation =====
    _renderVizPalinTwoPointer(panel, cleaned) {
        const self = this;

        panel.innerHTML = `
            ${self._createStepDesc('-2')}
            <div class="sim-card" style="padding:24px;">
                <div style="margin-bottom:12px;width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Alphanumeric Only</div>
                    <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                        <div id="str-char-boxes-2" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                    </div>
                </div>
                <div style="width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Comparison Status</div>
                    <div id="str-status-2" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
                <div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-top:12px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> Waiting</span>
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> L / R Pointer</span>
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> Match Confirmed</span>
                </div>
            </div>
            ${self._createStepControls('-2')}
        `;

        var charBoxes = panel.querySelector('#str-char-boxes-2');
        var statusEl = panel.querySelector('#str-status-2');

        // Box rendering
        charBoxes.innerHTML = '';
        for (var i = 0; i < cleaned.length; i++) {
            var box = document.createElement('div');
            box.className = 'str-char-box';
            box.dataset.idx = i;
            box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + cleaned[i] + '</div>';
            charBoxes.appendChild(box);
        }
        statusEl.innerHTML = 'Alphanumeric extraction done (length ' + cleaned.length + ')';

        function saveState() {
            return {
                boxes: Array.from(charBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.boxes[i]; });
            statusEl.innerHTML = s.status;
        }

        var steps = [];
        var L = 0, R = cleaned.length - 1;

        while (L < R) {
            (function(l, r) {
                var match = cleaned[l] === cleaned[r];
                steps.push({
                    description: match
                        ? '\'' + cleaned[l] + '\' == \'' + cleaned[r] + '\' → match! Move inward'
                        : '\'' + cleaned[l] + '\' != \'' + cleaned[r] + '\' → mismatch!',
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        charBoxes.querySelectorAll('.str-char-box').forEach(function(b) {
                            var idx = parseInt(b.dataset.idx);
                            if (idx === l || idx === r) b.className = 'str-char-box comparing';
                            else if (idx < l || idx > r) b.className = 'str-char-box matched';
                            else b.className = 'str-char-box';
                        });
                        statusEl.innerHTML = match
                            ? '<span style="color:var(--green);">\'' + cleaned[l] + "' == '" + cleaned[r] + "' ✓</span>"
                            : '<span style="color:#e17055;">\'' + cleaned[l] + "' != '" + cleaned[r] + "' ✗</span>";
                    },
                    undo: function() { restoreState(this._before); }
                });
            })(L, R);

            if (cleaned[L] !== cleaned[R]) break;
            L++; R--;
        }

        var isPalin = L >= R;
        steps.push({
            description: isPalin ? 'Palindrome! All pairs matched 🎉' : 'Not a palindrome! Mismatch found ✗',
            _before: null,
            action: function() {
                this._before = saveState();
                charBoxes.querySelectorAll('.str-char-box').forEach(function(b) {
                    b.className = isPalin ? 'str-char-box matched' : b.className;
                });
                statusEl.innerHTML = isPalin
                    ? '<span style="color:var(--green);font-size:1.1rem;"><strong>It\'s a palindrome!</strong> ✓</span>'
                    : '<span style="color:#e17055;font-size:1.1rem;"><strong>Not a palindrome</strong> ✗</span>';
            },
            undo: function() { restoreState(this._before); }
        });

        self._initLocalStepController(panel, steps, '-2');
    },

    // ===== Anagram Grouping Visualization =====
    _renderVizAnagram(container) {
        const self = this;
        self._clearVizState();
        const DEFAULT_WORDS = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Words: <input type="text" id="ag-input" value="eat, tea, tan, ate, nat, bat" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="viz-input-reset" id="ag-reset" title="Reset after changing input">🔄</button></div>' +
            self._createStepDesc() +
            '<div class="sim-card" style="padding:24px;">' +
            '<div style="margin-bottom:16px;width:100%;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Word List</div>' +
            '<div class="graph-svg-container" style="min-height:50px;display:flex;align-items:center;justify-content:center;padding:16px;gap:8px;flex-wrap:wrap;" id="ag-words"></div></div>' +
            '<div style="margin-bottom:16px;width:100%;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Currently Processing</div>' +
            '<div id="ag-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div></div>' +
            '<div style="margin-bottom:16px;width:100%;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Groups (Sort Key → Words)</div>' +
            '<div id="ag-groups" style="display:flex;flex-direction:column;gap:10px;min-height:60px;"></div></div>' +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);vertical-align:middle;"></span> Currently Processing</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--green);vertical-align:middle;"></span> Done</span></div>' +
            '</div>' +
            self._createStepControls();

        var wordsEl = container.querySelector('#ag-words');
        var statusEl = container.querySelector('#ag-status');
        var groupsEl = container.querySelector('#ag-groups');
        var groupColors = ['var(--accent)', 'var(--green)', 'var(--yellow)', '#e17055', '#00cec9', '#fd79a8'];

        function renderWords(words) {
            wordsEl.innerHTML = '';
            words.forEach(function(w, i) {
                var span = document.createElement('span');
                span.className = 'str-char-box';
                span.dataset.widx = i;
                span.style.cssText = 'padding:6px 14px;font-size:1rem;';
                span.innerHTML = '<div class="str-char-val">' + w + '</div>';
                wordsEl.appendChild(span);
            });
        }

        function renderGroups(groups) {
            groupsEl.innerHTML = '';
            var colorIdx = 0;
            for (var key in groups) {
                var vals = groups[key];
                var color = groupColors[colorIdx % groupColors.length];
                var div = document.createElement('div');
                div.className = 'graph-queue-display';
                div.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;flex-wrap:wrap;border-left:4px solid ' + color + ';';
                div.innerHTML = '<span style="font-weight:700;color:' + color + ';min-width:50px;">"' + key + '"</span>' +
                    '<span style="color:var(--text2);">→</span>' +
                    vals.map(function(v) { return '<span class="graph-queue-item">' + v + '</span>'; }).join('');
                groupsEl.appendChild(div);
                colorIdx++;
            }
        }

        function saveState() {
            return {
                words: Array.from(wordsEl.querySelectorAll('[data-widx]')).map(function(w) { return w.className; }),
                status: statusEl.innerHTML,
                groups: groupsEl.innerHTML
            };
        }
        function restoreState(s) {
            wordsEl.querySelectorAll('[data-widx]').forEach(function(w, i) { w.className = s.words[i]; });
            statusEl.innerHTML = s.status;
            groupsEl.innerHTML = s.groups;
        }

        function buildSteps() {
            var input = container.querySelector('#ag-input').value;
            var words = input.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (words.length < 1) words = DEFAULT_WORDS.slice();
            renderWords(words);
            statusEl.innerHTML = '—';
            groupsEl.innerHTML = '';

            var steps = [];
            var groups = {};
            var buildGroups = {};

            // Step 0: Initial state
            steps.push({
                description: words.length + ' words — let\'s group them by anagram!',
                _before: null,
                action: function() {
                    this._before = saveState();
                    statusEl.innerHTML = words.length + ' words ready!';
                },
                undo: function() { restoreState(this._before); }
            });

            words.forEach(function(word, i) {
                var sorted = word.split('').sort().join('');
                var isNew = !buildGroups[sorted];
                if (!buildGroups[sorted]) buildGroups[sorted] = [];
                buildGroups[sorted].push(word);

                // Show sorting process
                var _sorted = sorted, _isNew = isNew, _word = word, _i = i;
                var _groupSnap = {};
                for (var k in buildGroups) _groupSnap[k] = buildGroups[k].slice();

                steps.push({
                    description: '"' + _word + '" → Sort its letters to get "' + _sorted + '". Anagrams have the same letters, so they produce the same sorted result! → ' + (_isNew ? 'First time seeing this sorted key, so create a new group!' : 'Same sorted key already exists, so add to existing group!'),
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        var wordEls = wordsEl.querySelectorAll('[data-widx]');
                        wordEls.forEach(function(w, j) {
                            if (j < _i) { w.className = 'str-char-box matched'; }
                            else if (j === _i) { w.className = 'str-char-box comparing'; }
                            else { w.className = 'str-char-box'; }
                            w.style.cssText = 'padding:6px 14px;font-size:1rem;';
                        });
                        if (!groups[_sorted]) groups[_sorted] = [];
                        groups[_sorted].push(_word);
                        renderGroups(groups);
                        statusEl.innerHTML = '"<strong>' + _word + '</strong>" → sorted → "<strong>' + _sorted + '</strong>" → ' +
                            (_isNew ? '<span style="color:var(--accent);">New group!</span>' : '<span style="color:var(--green);">Added to existing group!</span>');
                    },
                    undo: function() {
                        groups[_sorted].pop();
                        if (groups[_sorted].length === 0) delete groups[_sorted];
                        restoreState(this._before);
                    }
                });
            });

            // Final completion step
            var totalGroups = {};
            words.forEach(function(w) { var k = w.split('').sort().join(''); if (!totalGroups[k]) totalGroups[k] = []; totalGroups[k].push(w); });
            var _totalCount = Object.keys(totalGroups).length;

            steps.push({
                description: '✅ Done! ' + _totalCount + ' groups!',
                _before: null,
                action: function() {
                    this._before = saveState();
                    wordsEl.querySelectorAll('[data-widx]').forEach(function(w) {
                        w.className = 'str-char-box matched';
                        w.style.cssText = 'padding:6px 14px;font-size:1rem;';
                    });
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;"><strong>✅ Done!</strong> ' + _totalCount + ' groups</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // Reset button
        container.querySelector('#ag-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderWords(DEFAULT_WORDS);
            statusEl.innerHTML = '—';
            groupsEl.innerHTML = '';
            self._initStepController(container, buildSteps);
        });

        renderWords(DEFAULT_WORDS);
        self._initStepController(container, buildSteps);
    },

    // ===== String Reconstruction Visualization =====
    _renderVizReconstruct(container) {
        const self = this;
        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">Input String:
                    <input type="text" id="str-viz-input" value="ABACABA"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;text-transform:uppercase;">
                </label>
                <button class="btn btn-primary" id="str-viz-start">Start</button>
            </div>
            ${self._createStepDesc()}
            <div class="sim-card" style="padding:24px;">
                <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;">
                    <div id="str-char-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                </div>
                <div style="display:flex;gap:24px;margin-top:16px;flex-wrap:wrap;width:100%;">
                    <div style="flex:1;min-width:180px;">
                        <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Frequency</div>
                        <div id="str-freq-display" class="graph-queue-display" style="min-height:50px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">
                            <span style="color:var(--text2);">Click Start</span>
                        </div>
                    </div>
                    <div style="flex:1;min-width:180px;">
                        <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Result Assembly</div>
                        <div id="str-result-display" class="graph-queue-display" style="min-height:50px;display:flex;gap:4px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">—</div>
                    </div>
                </div>
                <div style="margin-top:16px;width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Current Status</div>
                    <div id="str-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
            </div>
            ${self._createStepControls()}
        `;

        const charBoxes = container.querySelector('#str-char-boxes');
        const freqDisplay = container.querySelector('#str-freq-display');
        const resultDisplay = container.querySelector('#str-result-display');
        const statusEl = container.querySelector('#str-status');

        function saveState() {
            return {
                boxes: charBoxes.innerHTML,
                freq: freqDisplay.innerHTML,
                result: resultDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.innerHTML = s.boxes;
            freqDisplay.innerHTML = s.freq;
            resultDisplay.innerHTML = s.result;
            statusEl.innerHTML = s.status;
        }

        container.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            const input = container.querySelector('#str-viz-input').value.toUpperCase();
            if (!input.length) { statusEl.innerHTML = '<span style="color:#e17055;">Please enter a string!</span>'; return; }

            // Input character boxes
            charBoxes.innerHTML = input.split('').map((c, i) =>
                `<div class="str-char-box" data-idx="${i}"><div class="str-char-idx">${i}</div><div class="str-char-val">${c}</div></div>`
            ).join('');
            freqDisplay.innerHTML = '<span style="color:var(--text2);">{ }</span>';
            resultDisplay.innerHTML = '—';
            statusEl.innerHTML = 'Ready';

            const steps = [];

            // Frequency calculation
            const count = {};
            for (const c of input) count[c] = (count[c] || 0) + 1;

            // Step 1: Count frequencies
            steps.push({
                description: `Count frequencies → ${Object.entries(count).sort((a,b) => a[0].localeCompare(b[0])).map(([k,v]) => `${k}:${v}`).join(', ')}`,
                _before: null,
                action() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(b => b.className = 'str-char-box matched');
                    freqDisplay.innerHTML = Object.entries(count)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([k, v]) => `<span class="graph-queue-item" style="min-width:50px;text-align:center;"><strong>'${k}'</strong>: ${v}</span>`)
                        .join('');
                    statusEl.innerHTML = 'Frequency counting done!';
                },
                undo() { restoreState(this._before); }
            });

            // Step 2: Check odd count
            const oddChars = Object.entries(count).filter(([, v]) => v % 2 === 1);
            const canMake = oddChars.length <= 1;

            steps.push({
                description: canMake
                    ? `${oddChars.length} odd → possible! ✓`
                    : `${oddChars.length} odd → impossible! ✗`,
                _before: null,
                action() {
                    this._before = saveState();
                    freqDisplay.innerHTML = Object.entries(count)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([k, v]) => {
                            const isOdd = v % 2 === 1;
                            const bg = isOdd ? 'rgba(225,112,85,0.2)' : 'rgba(0,184,148,0.15)';
                            const border = isOdd ? '#e17055' : 'var(--green)';
                            return `<span class="graph-queue-item" style="min-width:50px;text-align:center;background:${bg};border-color:${border};"><strong>'${k}'</strong>: ${v} ${isOdd ? '(odd)' : '(even)'}</span>`;
                        }).join('');
                    statusEl.innerHTML = canMake
                        ? `<span style="color:var(--green);">${oddChars.length} odd freq. ≤ 1 → palindrome possible!</span>`
                        : `<span style="color:#e17055;">${oddChars.length} odd freq. > 1 → impossible! "I'm Sorry Hansoo"</span>`;
                },
                undo() { restoreState(this._before); }
            });

            if (canMake) {
                // Step 3: Assemble front half + middle + back half
                let half = '';
                let mid = '';
                const sorted = Object.keys(count).sort();
                for (const c of sorted) {
                    if (count[c] % 2 === 1) mid = c;
                    half += c.repeat(Math.floor(count[c] / 2));
                }
                const revHalf = half.split('').reverse().join('');

                steps.push({
                    description: `"${half}"${mid ? ` + "${mid}"` : ''} + "${revHalf}" assembled!`,
                    _before: null,
                    action() {
                        this._before = saveState();
                        let html = '';
                        html += '<span style="color:var(--text2);font-size:0.8rem;margin-right:4px;">Front:</span>';
                        html += half.split('').map(c =>
                            `<span class="str-char-box matched" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${c}</div></span>`
                        ).join('');
                        if (mid) {
                            html += '<span style="color:var(--text2);margin:0 6px;font-weight:700;">+</span>';
                            html += '<span style="color:var(--text2);font-size:0.8rem;margin-right:4px;">Mid:</span>';
                            html += `<span class="str-char-box comparing" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${mid}</div></span>`;
                        }
                        html += '<span style="color:var(--text2);margin:0 6px;font-weight:700;">+</span>';
                        html += '<span style="color:var(--text2);font-size:0.8rem;margin-right:4px;">Back:</span>';
                        html += revHalf.split('').map(c =>
                            `<span class="str-char-box matched" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${c}</div></span>`
                        ).join('');
                        resultDisplay.innerHTML = html;
                        statusEl.innerHTML = `Front: "${half}" ${mid ? `+ Mid: "${mid}" ` : ''}+ Back: "${revHalf}"`;
                    },
                    undo() { restoreState(this._before); }
                });

                // Step 4: Final result
                const result = half + mid + revHalf;
                steps.push({
                    description: `Done! "${result}" 🎉`,
                    _before: null,
                    action() {
                        this._before = saveState();
                        resultDisplay.innerHTML = result.split('').map(c =>
                            `<span class="str-char-box matched" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${c}</div></span>`
                        ).join('');
                        statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;"><strong>Done!</strong> Palindrome: "${result}"</span>`;
                    },
                    undo() { restoreState(this._before); }
                });
            }

            self._initStepController(container, steps);
        });
    },

    // ===== Visualization State Management =====
    _vizState: {
        steps: [],
        currentStep: -1,
        keydownHandler: null
    },

    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) {
            document.removeEventListener('keydown', s.keydownHandler);
            s.keydownHandler = null;
        }
        s.steps = [];
        s.currentStep = -1;
    },

    _createStepDesc(suffix) {
        const s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ Click Next to start</div>';
    },
    _createStepControls(suffix) {
        const s = suffix || '';
        const inlineClass = s ? ' viz-inline' : '';
        return `
            <div class="viz-step-controls${inlineClass}">
                <button class="btn viz-step-btn" id="viz-prev${s}" disabled>&larr; Prev</button>
                <span id="viz-step-counter${s}" class="viz-step-counter">Before Start</span>
                <button class="btn btn-primary viz-step-btn" id="viz-next${s}">Next &rarr;</button>
            </div>
        `;
    },

    _initLocalStepController(el, steps, suffix) {
        const s = suffix || '';
        let currentStep = -1;

        const prevBtn = el.querySelector('#viz-prev' + s);
        const nextBtn = el.querySelector('#viz-next' + s);
        const counter = el.querySelector('#viz-step-counter' + s);
        const desc = el.querySelector('#viz-step-desc' + s);

        const updateUI = () => {
            prevBtn.disabled = (currentStep < 0);
            nextBtn.disabled = (currentStep >= steps.length - 1);
            if (currentStep < 0) {
                counter.textContent = 'Before Start';
                desc.textContent = '▶ Click Next to begin';
            } else {
                counter.textContent = `Step ${currentStep + 1} / ${steps.length}`;
                desc.innerHTML = '<span>' + steps[currentStep].description + '</span>';
            }
        };

        var actionDelay = 350;
        nextBtn.addEventListener('click', () => {
            if (currentStep >= steps.length - 1) return;
            currentStep++;
            updateUI();
            setTimeout(() => { steps[currentStep].action(); }, actionDelay);
        });

        prevBtn.addEventListener('click', () => {
            if (currentStep < 0) return;
            var stepToUndo = currentStep;
            currentStep--;
            updateUI();
            setTimeout(() => { steps[stepToUndo].undo(); }, actionDelay);
        });

        updateUI();
    },

    _initStepController(el, stepsOrFn) {
        const state = this._vizState;
        state.steps = typeof stepsOrFn === 'function' ? stepsOrFn() : stepsOrFn;
        state.currentStep = -1;

        const prevBtn = el.querySelector('#viz-prev');
        const nextBtn = el.querySelector('#viz-next');
        const counter = el.querySelector('#viz-step-counter');
        const desc = el.querySelector('#viz-step-desc');

        const updateUI = () => {
            const idx = state.currentStep;
            const total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) {
                counter.textContent = 'Before Start';
                desc.textContent = '▶ Click Next to begin';
            } else {
                counter.textContent = `Step ${idx + 1} / ${total}`;
                desc.innerHTML = '<span>' + state.steps[idx].description + '</span>';
            }
        };

        var actionDelay = 350;
        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            updateUI();
            setTimeout(() => { state.steps[state.currentStep].action(); }, actionDelay);
        });

        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            var stepToUndo = state.currentStep;
            state.currentStep--;
            updateUI();
            setTimeout(() => { state.steps[stepToUndo].undo(); }, actionDelay);
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

    // ===== Problem Data =====
    problems: [
        {
            id: 'boj-10809',
            title: 'BOJ 10809 - 알파벳 찾기',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/10809',
            simIntro: 'Watch how each character is checked one by one and the first occurrence position is recorded for each alphabet!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>A word S consisting only of lowercase alphabets is given. For each alphabet, if it is included in the word, print the <strong>position of its first occurrence</strong>; if not, print <strong>-1</strong>.</p>

                <h4>Input</h4>
                <p>The first line contains a word S. The word length does not exceed 100 and consists only of lowercase alphabets.</p>

                <h4>Output</h4>
                <p>For each alphabet, print the first occurrence position of a, b, ... z separated by spaces.</p>
                <p>If an alphabet is not in the word, print -1. The first character is at position 0, the second at position 1.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>baekjoon</pre></div>
                    <div><strong>Output</strong><pre>1 0 -1 -1 2 -1 -1 -1 -1 4 3 -1 -1 7 5 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1</pre></div>
                </div>
                <p class="example-explain">b→0, a→1, e→2, k→3, j→4, o→5, n→7 first appear at these positions. Other alphabets are -1</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>Word length is between 1 and 100</li>
                    <li>Consists only of lowercase alphabets</li>
                </ul>
            `,
            hints: [
                {
                    title: "Let's understand the problem",
                    content: 'In "baekjoon", at which position does \'a\' <strong>first</strong> appear?<br>b→0, a→1, e→2… We need to find the <strong>first occurrence position</strong> of each of the 26 alphabets!<br>Alphabets not in the string get <code>-1</code>.'
                },
                {
                    title: 'Create an array of size 26!',
                    content: 'There are exactly <strong>26</strong> alphabets a~z, so create an array of size 26 filled with <code>-1</code>.<br><span class="lang-py">Python: <code>result = [-1] * 26</code></span><span class="lang-cpp">C++: <code>int result[26]; fill(result, result+26, -1);</code></span><br><br>Map a→slot 0, b→slot 1, … z→slot 25!'
                },
                {
                    title: 'Converting characters to numbers',
                    content: 'To convert an alphabet to an array index:<br><span class="lang-py">Python: <code>ord(\'a\') - ord(\'a\') = 0</code>, <code>ord(\'b\') - ord(\'a\') = 1</code></span><span class="lang-cpp">C++: <code>\'a\' - \'a\' = 0</code>, <code>\'b\' - \'a\' = 1</code> (char is already a number!)</span><div style="display:flex;align-items:end;gap:6px;margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;flex-wrap:wrap;"><div style="text-align:center;"><div style="background:#6c5ce7;color:white;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">a</div><div style="font-size:0.75rem;color:var(--text3);margin-top:4px;">0</div></div><div style="text-align:center;"><div style="background:#6c5ce7;color:white;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">b</div><div style="font-size:0.75rem;color:var(--text3);margin-top:4px;">1</div></div><div style="text-align:center;"><div style="background:#6c5ce7;color:white;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">c</div><div style="font-size:0.75rem;color:var(--text3);margin-top:4px;">2</div></div><div style="color:var(--text3);font-size:1.2em;padding:0 4px;">...</div><div style="text-align:center;"><div style="background:#00b894;color:white;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">z</div><div style="font-size:0.75rem;color:var(--text3);margin-top:4px;">25</div></div></div>This converts any alphabet to an index between 0~25.'
                },
                {
                    title: 'Key: Record only the "first" occurrence',
                    content: 'Traverse the string from left to right:<br>1. Calculate the index of the current character (<code>ch - \'a\'</code>)<br>2. Is <code>result[index]</code> equal to <code>-1</code>? → <strong>First occurrence!</strong> Record current position<br>3. Not <code>-1</code>? → Already recorded, <strong>skip</strong><br><br>This one condition ensures we only record the first occurrence!'
                }
            ],
            solutions: [
                {
                    approach: 'Array Traversal',
                    description: 'Initialize a size-26 array with -1, traverse the string and record only first occurrences',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `s = input()
result = [-1] * 26  # a~z 26 slots, all start as -1

for i in range(len(s)):
    idx = ord(s[i]) - ord('a')  # alphabet → array index
    if result[idx] == -1:        # record only first occurrence
        result[idx] = i

print(' '.join(map(str, result)))`,
                        cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    cin >> s;
    int result[26];
    fill(result, result + 26, -1);  // initialize all to -1

    for (int i = 0; i < s.size(); i++) {
        int idx = s[i] - 'a';      // alphabet → array index
        if (result[idx] == -1)      // record only first occurrence
            result[idx] = i;
    }

    for (int i = 0; i < 26; i++)
        cout << result[i] << (i < 25 ? " " : "\\n");
}`
                    }
                },
                {
                    approach: 'find Method',
                    description: 'Use find() for each alphabet to directly get the first occurrence position',
                    timeComplexity: 'O(26·n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `s = input()

# Use find() for each alphabet — returns -1 if not found!
result = [s.find(chr(i + ord('a'))) for i in range(26)]

print(' '.join(map(str, result)))`,
                        cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;

    for (int i = 0; i < 26; i++) {
        char ch = 'a' + i;
        // find() returns string::npos if not found
        size_t pos = s.find(ch);
        cout << (pos == string::npos ? -1 : (int)pos);
        if (i < 25) cout << ' ';
    }
    cout << endl;
}`
                    }
                }
            ]
        },
        {
            id: 'boj-1157',
            title: 'BOJ 1157 - Word Study',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1157',
            simIntro: 'See how a dictionary counts letter frequencies step by step! (The Code tab also shows the array approach)',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>A word consisting of uppercase and lowercase letters is given.
                Print the <strong>most frequently used letter</strong> in uppercase.
                If there are multiple letters tied for the most frequent, print <code>?</code>.</p>
                <h4>Input</h4>
                <p>A word consisting of uppercase and lowercase letters is given. The length of the word does not exceed 1,000,000.</p>
                <h4>Output</h4>
                <p>Print the most frequently used letter in uppercase. If there are multiple letters tied for the most frequent, print <code>?</code>.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>Mississipi</pre></div>
                    <div><strong>Output</strong><pre>?</pre></div>
                </div>
                <p class="example-explain">I and S each appear 4 times, tied for most → print <code>?</code></p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>zZa</pre></div>
                    <div><strong>Output</strong><pre>Z</pre></div>
                </div>
                <p class="example-explain">Ignoring case, Z appears 2 times (most frequent) → print uppercase <code>Z</code></p>
                </div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>z</pre></div>
                    <div><strong>Output</strong><pre>Z</pre></div>
                </div>
                <p class="example-explain">Only one letter, so print it in uppercase</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>Word length is between 1 and 1,000,000</li>
                    <li>Consists of uppercase and lowercase letters only</li>
                </ul>
            `,
            hints: [
                {
                    title: 'Understanding the problem',
                    content: 'Which letter appears most in <code>"Mississipi"</code>?<br>Since case doesn\'t matter, first convert everything to uppercase (or lowercase).<br>Then count how many times each letter appears!'
                },
                {
                    title: 'Letters as numbers? — ASCII codes',
                    content: 'Computers store characters as <strong>numbers (ASCII codes)</strong>.<br><code>\'A\' = 65</code>, <code>\'B\' = 66</code>, … <code>\'Z\' = 90</code><br><br><span class="lang-py">Python: <code>ord(\'A\')</code> → 65, <code>chr(65)</code> → \'A\'</span><span class="lang-cpp">C++: <code>(int)\'A\'</code> → 65, <code>(char)65</code> → \'A\' (char itself is a number!)</span><br><br><a href="https://en.wikipedia.org/wiki/ASCII" target="_blank" style="color: var(--accent); text-decoration: underline; font-size: 0.9em;">📎 View full ASCII table →</a>'
                },
                {
                    title: 'Method 1: Count with an array',
                    content: 'There are exactly <strong>26</strong> letters A~Z, so we create an array of size 26.<br><span class="lang-py">Python: <code>count = [0] * 26</code></span><span class="lang-cpp">C++: <code>int count[26] = {0};</code></span><br><br>To put A in slot 0:<br><code>\'A\' - \'A\' = 65 - 65 = <strong>0</strong></code> ✓<br><code>\'B\' - \'A\' = 66 - 65 = <strong>1</strong></code> ✓<br><code>\'Z\' - \'A\' = 90 - 65 = <strong>25</strong></code> ✓<br><br>So we count with <code>count[c - \'A\'] += 1</code>!'
                },
                {
                    title: 'Method 2: Count with a hashmap',
                    content: 'Using a hashmap is more intuitive!<br><span class="lang-py">Python: <code>freq = {}</code> (dictionary)</span><span class="lang-cpp">C++: <code>unordered_map&lt;char, int&gt; freq;</code></span><br><br>Every time a letter appears, count with <code>freq[c] += 1</code>!<br>Result: <code>{"M": 1, "I": 4, "S": 4, "P": 1}</code><br>The simulation demonstrates this approach!'
                },
                {
                    title: 'What if there are multiple maximums?',
                    content: 'After finding the highest frequency, if <strong>2 or more</strong> letters share that frequency, print <code>?</code>.<div style="display:flex;gap:16px;margin:14px 0;align-items:end;justify-content:center;"><div style="text-align:center;"><div style="background:#6c5ce7;color:white;width:40px;height:80px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;font-weight:700;font-size:0.85rem;">4</div><div style="font-size:0.8rem;margin-top:4px;font-weight:600;">I</div></div><div style="text-align:center;"><div style="background:#e17055;color:white;width:40px;height:80px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;font-weight:700;font-size:0.85rem;">4</div><div style="font-size:0.8rem;margin-top:4px;font-weight:600;">S</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:40px;height:40px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;font-weight:700;font-size:0.85rem;">2</div><div style="font-size:0.8rem;margin-top:4px;">P</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:40px;height:20px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;font-weight:700;font-size:0.85rem;">1</div><div style="font-size:0.8rem;margin-top:4px;">M</div></div></div><div style="text-align:center;color:#e17055;font-weight:700;">Both I and S are max (4 times) → print <code>?</code>!</div>'
                }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

word = input().strip().upper()
count = [0] * 26

for c in word:
    count[ord(c) - ord('A')] += 1

max_count = max(count)

if count.count(max_count) > 1:
    print('?')
else:
    print(chr(count.index(max_count) + ord('A')))`,
                cpp: `#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    string word;
    cin >> word;

    int cnt[26] = {};
    for (char c : word) cnt[toupper(c) - 'A']++;

    int mx = *max_element(cnt, cnt + 26);
    int idx = -1, dup = 0;
    for (int i = 0; i < 26; i++) {
        if (cnt[i] == mx) { idx = i; dup++; }
    }
    printf("%c\\n", dup > 1 ? '?' : 'A' + idx);
}`
            },
            solutions: [
                {
                    approach: 'Array Counting',
                    description: 'Count each letter\'s frequency using a size-26 array, then find the character with the maximum',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `word = input().upper()
cnt = [0] * 26
for c in word:
    cnt[ord(c) - ord('A')] += 1

mx = max(cnt)
if cnt.count(mx) > 1:
    print('?')
else:
    print(chr(cnt.index(mx) + ord('A')))`,
                        cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int cnt[26] = {};
    for (char c : s) cnt[toupper(c) - 'A']++;

    int mx = 0, idx = 0, dup = 0;
    for (int i = 0; i < 26; i++) {
        if (cnt[i] > mx) { mx = cnt[i]; idx = i; dup = 1; }
        else if (cnt[i] == mx && mx > 0) dup++;
    }
    cout << (dup > 1 ? "?" : string(1, 'A' + idx)) << endl;
}`
                    }
                },
                {
                    approach: 'Dictionary',
                    description: 'Count per-letter frequency using a dictionary (hashmap), then find the maximum',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `word = input().upper()
freq = {}
for c in word:
    if c in freq:
        freq[c] += 1
    else:
        freq[c] = 1

mx = max(freq.values())
candidates = [k for k, v in freq.items() if v == mx]
print('?' if len(candidates) > 1 else candidates[0])`,
                        cpp: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    string s;
    cin >> s;
    unordered_map<char, int> freq;
    for (char c : s) freq[toupper(c)]++;

    int mx = 0;
    for (auto& [ch, cnt] : freq) mx = max(mx, cnt);

    int dup = 0;
    char ans = '?';
    for (auto& [ch, cnt] : freq) {
        if (cnt == mx) { ans = ch; dup++; }
    }
    cout << (dup > 1 ? '?' : ans) << endl;
}`
                    }
                },
                {
                    approach: 'Counter',
                    description: 'Use Counter\'s most_common() to directly get the most frequent character',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `from collections import Counter

word = input().upper()
counter = Counter(word)
top = counter.most_common()

if len(top) > 1 and top[0][1] == top[1][1]:
    print('?')
else:
    print(top[0][0])`,
                        cpp: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    string word;
    cin >> word;
    // Convert to uppercase
    for (char& c : word) c = toupper(c);

    // Count frequencies — unordered_map instead of Counter
    unordered_map<char, int> freq;
    for (char c : word) freq[c]++;

    // Find maximum frequency
    int mx = 0;
    for (auto& [ch, cnt] : freq)
        if (cnt > mx) mx = cnt;

    // If 2+ characters have max frequency, print '?'
    char ans = '?';
    int dup = 0;
    for (auto& [ch, cnt] : freq)
        if (cnt == mx) { ans = ch; dup++; }

    cout << (dup > 1 ? '?' : ans) << endl;
}`
                    }
                }
            ]
        },
        {
            id: 'lc-125',
            title: 'LeetCode 125 - Valid Palindrome',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/valid-palindrome/',
            simIntro: 'See how the two pointers from Hint 3 narrow in from both ends!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a string <code>s</code>,
                determine whether it is a palindrome (reads the same forward and backward),
                considering <strong>only alphanumeric characters</strong> and ignoring case.</p>
                <p>An empty string is considered a palindrome.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "A man, a plan, a canal: Panama"</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div>
                <p class="example-explain">"amanaplanacanalpanama" reads the same forwards and backwards — it is a palindrome.</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "race a car"</pre></div>
                    <div><strong>Output</strong><pre>false</pre></div>
                </div>
                <p class="example-explain">"raceacar" reversed is "racaecar", which is different — not a palindrome.</p>
                </div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = " "</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div>
                <p class="example-explain">After removing non-alphanumeric characters, the result is "" (empty string), which is a palindrome.</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ s.length ≤ 2 × 10⁵</li>
                    <li>s consists of printable ASCII characters only.</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it in O(1) space without creating an additional string?</p>
            `,
            hints: [
                {
                    title: 'What is a palindrome?',
                    content: `A string that reads the <strong>same forwards and backwards</strong>!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin:16px 0;">
                        <div style="display:flex;gap:4px;">
                            ${'racecar'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="font-size:1.3em;">🔄 Reversed?</div>
                        <div style="display:flex;gap:4px;">
                            ${'racecar'.split('').reverse().map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#00b894;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="color:#00b894;font-weight:700;">✅ Same! → Palindrome!</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin:12px 0;padding:12px;background:rgba(255,118,117,0.08);border-radius:10px;">
                        <div style="display:flex;gap:4px;">
                            ${'hello'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#e17055;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="font-size:1.3em;">🔄 Reversed?</div>
                        <div style="display:flex;gap:4px;">
                            ${'olleh'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#636e72;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="color:#e17055;font-weight:700;">❌ Different! → Not a palindrome</div>
                    </div>
                    <p style="margin-top:24px;margin-bottom:4px;">But <code>"A man, a plan, a canal: Panama"</code> is also a palindrome.<br>Spaces, commas, and colons are ignored, and case doesn\'t matter!</p>
                    <p style="margin-top:14px;padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">So how do we compare such strings? 🤔<br>With spaces and special characters mixed in, <strong>simply reversing won\'t work!</strong></p>`
                },
                {
                    title: 'First, clean it up!',
                    content: `Why do we need to clean? <code>"A man, a plan..."</code> reversed as-is becomes <code>"...nalp a ,nam A"</code>which doesn't match. Spaces and commas cause the problem!
                    <p style="margin-top:8px;">So we <strong>keep only letters/numbers and remove everything else.</strong> This is called "preprocessing".</p>
                    <div style="display:flex;flex-wrap:wrap;gap:3px;margin:14px 0;">
                        ${'A man, a plan, a canal: Panama'.split('').map(c => {
                            const keep = /[a-zA-Z0-9]/.test(c);
                            return `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:32px;border-radius:6px;font-weight:600;font-size:0.95em;${keep ? 'background:#6c5ce7;color:white;' : 'background:#dfe6e9;color:#b2bec3;text-decoration:line-through;'}">${c === ' ' ? '␣' : c}</span>`;
                        }).join('')}
                    </div>
                    <div style="text-align:center;font-size:1.2em;margin:8px 0;">⬇️</div>
                    <div style="display:flex;flex-wrap:wrap;gap:3px;margin:8px 0;">
                        ${'amanaplanacanalpanama'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:32px;background:#00b894;color:white;border-radius:6px;font-weight:600;font-size:0.95em;">${c}</span>`).join('')}
                    </div>
                    <p style="margin-top:10px;"><span class="lang-py">Python: use <code>isalnum()</code> to check for letters/numbers → <code>lower()</code> to normalize to lowercase</span><span class="lang-cpp">C++: use <code>isalnum(c)</code> to check → <code>tolower(c)</code> to normalize to lowercase</span></p>`
                },
                {
                    title: 'Easiest method: Reverse and compare!',
                    content: `Since a palindrome reads the same reversed, <strong>just reverse and check if it matches the original</strong>. The most intuitive approach!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin:14px 0;">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="min-width:40px;font-weight:600;text-align:right;">Original</span>
                            <div style="display:flex;gap:2px;">
                                ${'abcba'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}
                            </div>
                        </div>
                        <div style="font-size:1.1em;">🔄 Reverse</div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="min-width:40px;font-weight:600;text-align:right;">Reversed</span>
                            <div style="display:flex;gap:2px;">
                                ${'abcba'.split('').reverse().map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#00b894;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}
                            </div>
                        </div>
                        <div style="color:#00b894;font-weight:700;">All match → True! ✅</div>
                    </div>
                    <p style="margin-top:8px;">This approach is perfectly fine for coding tests! 👍</p>
                    <p style="margin-top:6px;padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">However, you need to <strong>create a new reversed string</strong>, using O(n) memory.<br>For very long strings, this could be costly... Is there a more efficient way?</p>`
                },
                {
                    title: 'Smarter method: Two Pointers',
                    content: `Reversing works, but you can check without creating a new string!<br><strong>Start from both ends</strong> and narrow toward the center, comparing as you go.
                    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:14px 0;padding:16px;background:var(--bg2);border-radius:12px;">
                        <div style="display:flex;gap:4px;position:relative;">
                            ${'racecar'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;${i===0||i===6?'background:#6c5ce7;color:white;':'background:#dfe6e9;color:#2d3436;'}border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="display:flex;gap:4px;width:100%;justify-content:center;">
                            <span style="width:36px;text-align:center;color:#6c5ce7;font-weight:700;">L→</span>
                            <span style="width:180px;"></span>
                            <span style="width:36px;text-align:center;color:#6c5ce7;font-weight:700;">←R</span>
                        </div>
                        <div style="color:#00b894;font-weight:600;">r == r ✓ → move inward!</div>
                        <div style="display:flex;gap:4px;">
                            ${'racecar'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;${i===1||i===5?'background:#00b894;color:white;':i===0||i===6?'background:#b2bec3;color:white;':'background:#dfe6e9;color:#2d3436;'}border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="display:flex;gap:4px;width:100%;justify-content:center;">
                            <span style="width:36px;"></span>
                            <span style="width:36px;text-align:center;color:#00b894;font-weight:700;">L→</span>
                            <span style="width:108px;"></span>
                            <span style="width:36px;text-align:center;color:#00b894;font-weight:700;">←R</span>
                            <span style="width:36px;"></span>
                        </div>
                        <div style="color:#00b894;font-weight:600;">a == a ✓ → keep going!</div>
                    </div>
                    <p>① If equal → move inward<br>② If different → immediately <code>False</code>!<br>③ L ≥ R → all matched → <code>True</code></p>
                    <p style="margin-top:8px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;font-size:0.92em;">No new string is created, so <strong>almost no extra memory is needed!</strong> O(1) space!<br>Explaining this in an interview shows you think about memory efficiency — great impression.</p>`
                }
            ],
            templates: {
                python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Method 1: Simple approach
        s = ''.join(c.lower() for c in s if c.isalnum())
        return s == s[::-1]

    def isPalindrome_twopointer(self, s: str) -> bool:
        # Method 2: Two pointers (memory efficient)
        left, right = 0, len(s) - 1
        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
        return True`,
                cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`
            },
            solutions: [
                {
                    approach: 'Reverse & Compare',
                    description: 'Extract only alphanumeric characters, convert to lowercase, then compare with the reversed string',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    templates: {
                        python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        cleaned = ''
        for c in s:
            if c.isalnum():
                cleaned += c.lower()
        return cleaned == cleaned[::-1]

    # 💡 One-liner (using regex)
    # import re
    # s = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
    # return s == s[::-1]`,
                        cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        string cleaned;
        for (char c : s) {
            if (isalnum(c)) cleaned += tolower(c);
        }
        string rev = cleaned;
        reverse(rev.begin(), rev.end());
        return cleaned == rev;
    }
};`
                    }
                },
                {
                    approach: 'Two Pointers',
                    description: 'Compare from both ends inward — O(1) space without creating extra strings',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        left, right = 0, len(s) - 1
        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
        return True`,
                        cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`
                    }
                }
            ]
        },
        {
            id: 'lc-49',
            title: 'LeetCode 49 - Group Anagrams',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/group-anagrams/',
            simIntro: 'See how sorted keys group anagrams together!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an array of strings <code>strs</code>,
                group the <strong>anagrams (words made of the same letters)</strong> together.</p>
                <p>The order of the output does not matter.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>strs = ["eat","tea","tan","ate","nat","bat"]</pre></div>
                    <div><strong>Output</strong><pre>[["bat"],["nat","tan"],["ate","eat","tea"]]</pre></div>
                </div>
                <p class="example-explain">"eat","tea","ate" are all anagrams made of e,a,t</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>strs = [""]</pre></div>
                    <div><strong>Output</strong><pre>[[""]]</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>strs = ["a"]</pre></div>
                    <div><strong>Output</strong><pre>[["a"]]</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ strs.length ≤ 10<sup>4</sup></li>
                    <li>0 ≤ strs[i].length ≤ 100</li>
                    <li><code>strs[i]</code> consists of lowercase English letters only.</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it in O(NK) time without sorting?</p>
            `,
            hints: [
                {
                    title: 'What is an anagram?',
                    content: `Words made by <strong>rearranging the same letters</strong>!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin:16px 0;">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div style="display:flex;gap:3px;">
                                ${'eat'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                            </div>
                            <span style="font-size:1.3em;">🔄</span>
                            <div style="display:flex;gap:3px;">
                                ${'tea'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#00b894;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                            </div>
                            <span style="color:#00b894;font-weight:700;">✅ Same letters!</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div style="display:flex;gap:3px;">
                                ${'eat'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                            </div>
                            <span style="font-size:1.3em;">vs</span>
                            <div style="display:flex;gap:3px;">
                                ${'bat'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#e17055;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                            </div>
                            <span style="color:#e17055;font-weight:700;">❌ Different letters!</span>
                        </div>
                    </div>
                    <p>This problem asks us to <strong>group anagrams together</strong>.</p>
                    <p style="margin-top:10px;padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">But if there are thousands of words... we can\'t compare letters one by one, right? 🤔<br>We need a way to <strong>quickly determine if words are anagrams</strong>!</p>`
                },
                {
                    title: 'Key idea: Sort the letters!',
                    content: `Since anagrams share the same letter composition, <strong>sorting them alphabetically yields the same result!</strong>
                    <div style="display:flex;flex-direction:column;gap:12px;margin:16px 0;padding:16px;background:var(--bg2);border-radius:12px;">
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <code style="min-width:50px;">"eat"</code><span>→ sort →</span>
                            <div style="display:flex;gap:2px;">${'aet'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <code style="min-width:50px;">"tea"</code><span>→ sort →</span>
                            <div style="display:flex;gap:2px;">${'aet'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}</div>
                            <span style="color:#00b894;font-weight:700;">← same!</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <code style="min-width:50px;">"ate"</code><span>→ sort →</span>
                            <div style="display:flex;gap:2px;">${'aet'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}</div>
                            <span style="color:#00b894;font-weight:700;">← same!</span>
                        </div>
                        <div style="border-top:1px dashed #ccc;padding-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <code style="min-width:50px;">"bat"</code><span>→ sort →</span>
                            <div style="display:flex;gap:2px;">${'abt'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:#e17055;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}</div>
                            <span style="color:#e17055;font-weight:700;">← different!</span>
                        </div>
                    </div>
                    <p><strong>If sorted results are the same = same anagram!</strong> We can use this as a "key".</p>`
                },
                {
                    title: 'Collect groups in a dictionary!',
                    content: `Use the sorted result as the <strong>key</strong> and <strong>append the original word to a list</strong> — groups form automatically!
                    <div style="margin:16px 0;padding:16px;background:var(--bg2);border-radius:12px;font-family:'Fira Code',monospace;font-size:0.9em;line-height:2;">
                        <div><span style="color:#e17055;">"eat"</span> → key=<span style="color:#6c5ce7;font-weight:700;">"aet"</span> → groups[<span style="color:#6c5ce7;">"aet"</span>] = [<span style="color:#e17055;">"eat"</span>]</div>
                        <div><span style="color:#e17055;">"tea"</span> → key=<span style="color:#6c5ce7;font-weight:700;">"aet"</span> → groups[<span style="color:#6c5ce7;">"aet"</span>] = [<span style="color:#e17055;">"eat"</span>, <span style="color:#e17055;">"tea"</span>]</div>
                        <div><span style="color:#00b894;">"tan"</span> → key=<span style="color:#00b894;font-weight:700;">"ant"</span> → groups[<span style="color:#00b894;">"ant"</span>] = [<span style="color:#00b894;">"tan"</span>]</div>
                        <div><span style="color:#e17055;">"ate"</span> → key=<span style="color:#6c5ce7;font-weight:700;">"aet"</span> → groups[<span style="color:#6c5ce7;">"aet"</span>] = [<span style="color:#e17055;">"eat"</span>, <span style="color:#e17055;">"tea"</span>, <span style="color:#e17055;">"ate"</span>]</div>
                        <div>...</div>
                    </div>
                    <p style="margin-top:8px;"><span class="lang-py">Python: <code>defaultdict(list)</code> auto-creates empty lists</span><span class="lang-cpp">C++: <code>unordered_map&lt;string, vector&lt;string&gt;&gt;</code> implements the same pattern</span></p>
                    <p style="margin-top:10px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;font-size:0.92em;">✅ Just return <code>groups.values()</code> at the end! The core logic is only 3 lines.</p>`
                },
                {
                    title: 'Is there another way besides sorting?',
                    content: `The <strong>sort key</strong> approach we learned is perfectly sufficient! Use this in practice. 👍
                    <p style="margin-top:10px;">But in interviews, they might ask: <em>"Is there a faster method than sorting?"</em></p>
                    <p>The idea is: instead of sorting, <strong>count how many times each letter appears</strong> and use that as the key.</p>
                    <div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:12px;">
                        <div style="display:flex;flex-direction:column;gap:6px;">
                            <div><code>"eat"</code> → a:1, e:1, t:1 → <code>(1,0,0,0,1,...,0,0,1,0,0)</code></div>
                            <div><code>"tea"</code> → a:1, e:1, t:1 → <code>(1,0,0,0,1,...,0,0,1,0,0)</code></div>
                        </div>
                        <p style="margin:8px 0 0;font-size:0.9em;">Since the letter composition is the same, the frequencies are identical → same key! No sorting needed.</p>
                    </div>
                    <p style="margin-top:10px;">Honestly, this approach is <strong>more complex to implement and harder to think of than sorting.</strong><br>
                    But theoretically, sorting is O(K log K) while counting is O(K), so it\'s faster.</p>
                    <div style="margin-top:14px;padding:14px;background:rgba(0,184,148,0.08);border:1px solid rgba(0,184,148,0.15);border-radius:10px;">
                        <div style="font-weight:700;margin-bottom:6px;">💡 Conclusion</div>
                        <div style="font-size:0.9em;color:var(--text-body);">
                            ✅ <strong>Coding tests</strong>: Use <code>sorted()</code> as the key. Done in 3 lines!<br>
                            ✅ <strong>Interviews</strong>: Mentioning "frequency counting also works" is a plus<br>
                            ⚠️ Frequency keys work well <strong>only with alphabets</strong> (26-slot array). For Unicode, sorting is better.
                        </div>
                    </div>`
                }
            ],
            templates: {
                python: `from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for s in strs:
            key = ''.join(sorted(s))  # sort key
            groups[key].append(s)
        return list(groups.values())

    # Alternative: Counter-based (O(NK))
    def groupAnagrams_counter(self, strs):
        groups = defaultdict(list)
        for s in strs:
            count = [0] * 26
            for c in s:
                count[ord(c) - ord('a')] += 1
            groups[tuple(count)].append(s)
        return list(groups.values())`,
                cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> mp;
        for (auto& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            mp[key].push_back(s);
        }
        vector<vector<string>> res;
        for (auto& [k, v] : mp) res.push_back(v);
        return res;
    }
};`
            },
            solutions: [
                {
                    approach: 'Sort Key',
                    description: 'Use the sorted result of each word as a key to group anagrams together',
                    timeComplexity: 'O(NK log K)',
                    spaceComplexity: 'O(NK)',
                    templates: {
                        python: `class Solution:
    def groupAnagrams(self, strs):
        groups = {}
        for s in strs:
            key = ''.join(sorted(s))
            if key not in groups:
                groups[key] = []
            groups[key].append(s)
        return list(groups.values())`,
                        cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> mp;
        for (auto& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            mp[key].push_back(s);
        }
        vector<vector<string>> res;
        for (auto& [k, v] : mp) res.push_back(v);
        return res;
    }
};`
                    }
                }
            ]
        },
        {
            id: 'boj-1213',
            title: 'BOJ 1213 - Making Palindromes',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1213',
            simIntro: 'See how frequencies are counted and halves are placed! (The Code tab also shows the array approach)',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>A name consisting of uppercase English letters is given.
                Rearrange the letters to form a <strong>palindrome</strong>.
                Print the lexicographically smallest palindrome possible.</p>
                <p>If a palindrome cannot be formed, print <code>I'm Sorry Hansoo</code>.</p>
                <h4>Input</h4>
                <p>The first line contains the name. It consists of uppercase letters only and has a maximum length of 50.</p>
                <h4>Output</h4>
                <p>Print the palindrome formed by rearranging the letters. If multiple palindromes are possible, print the lexicographically smallest one. If a palindrome cannot be formed, print "I'm Sorry Hansoo".</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>AABB</pre></div>
                    <div><strong>Output</strong><pre>ABBA</pre></div>
                </div>
                <p class="example-explain">A:2, B:2 → half "AB" + reverse "BA" = "ABBA"</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>AAABB</pre></div>
                    <div><strong>Output</strong><pre>ABABA</pre></div>
                </div>
                <p class="example-explain">A:3, B:2 → half "AB" + middle "A" + reverse "BA" = "ABABA"</p>
                </div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>ABACABA</pre></div>
                    <div><strong>Output</strong><pre>AABCBAA</pre></div>
                </div>
                <p class="example-explain">A:4, B:2, C:1 → half "AAB" + middle "C" + reverse "BAA"</p>
                </div>

                <div class="problem-example"><h4>Example 4</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>ABC</pre></div>
                    <div><strong>Output</strong><pre>I'm Sorry Hansoo</pre></div>
                </div>
                <p class="example-explain">A:1, B:1, C:1 — 3 characters with odd frequency, so impossible</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>The name consists of uppercase English letters only.</li>
                    <li>1 ≤ name length ≤ 50</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you quickly determine impossibility by first counting how many letters appear an odd number of times?</p>
            `,
            hints: [
                {
                    title: 'What does it take to be a palindrome?',
                    content: `Since we need to make a palindrome, let's revisit <strong>what a palindrome is</strong>. It reads the same forwards and backwards!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin:14px 0;">
                        <div style="display:flex;gap:4px;">
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.2em;">A</span>
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#00b894;color:white;border-radius:8px;font-weight:700;font-size:1.2em;">B</span>
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#fdcb6e;color:#2d3436;border-radius:8px;font-weight:700;font-size:1.2em;">C</span>
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#00b894;color:white;border-radius:8px;font-weight:700;font-size:1.2em;">B</span>
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.2em;">A</span>
                        </div>
                        <div style="display:flex;gap:4px;font-size:0.8em;color:var(--text-secondary);">
                            <span style="width:40px;text-align:center;">←</span>
                            <span style="width:40px;text-align:center;">←</span>
                            <span style="width:40px;text-align:center;">Middle</span>
                            <span style="width:40px;text-align:center;">→</span>
                            <span style="width:40px;text-align:center;">→</span>
                        </div>
                        <div style="color:#6c5ce7;font-weight:600;">🪞 Mirror symmetry around the center!</div>
                    </div>
                    <p>Since it\'s mirror-symmetric, each letter must appear <strong>equally on both sides</strong>. Therefore:</p>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0;">
                        <div style="background:rgba(0,184,148,0.1);border:1px solid rgba(0,184,148,0.3);border-radius:10px;padding:12px;text-align:center;">
                            <div style="font-weight:700;color:#00b894;">Letters with even count</div>
                            <div style="font-size:0.9em;margin-top:4px;">Split in half and place on both sides ✅</div>
                        </div>
                        <div style="background:rgba(253,203,110,0.15);border:1px solid rgba(253,203,110,0.4);border-radius:10px;padding:12px;text-align:center;">
                            <div style="font-weight:700;color:#e17055;">Letters with odd count</div>
                            <div style="font-size:0.9em;margin-top:4px;">1 left over, so it goes in the middle!</div>
                        </div>
                    </div>
                    <p style="padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">If <strong>2 or more</strong> letters have odd counts? There\'s only 1 middle spot, so a palindrome can\'t be made! → <code>"I'm Sorry Hansoo"</code></p>`
                },
                {
                    title: 'Count the frequencies (array or dictionary)',
                    content: `How do we know if each letter has even or odd count? <strong>Just count how many times each letter appears!</strong>
                    <div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:10px;">
                        <div style="font-weight:600;margin-bottom:8px;">Example: "ABACABA"</div>
                        <div style="display:flex;gap:4px;margin-bottom:10px;">
                            ${'ABACABA'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:${c==='A'?'#6c5ce7':c==='B'?'#00b894':'#fdcb6e'};color:${c==='C'?'#2d3436':'white'};border-radius:6px;font-weight:700;">${c}</span>`).join('')}
                        </div>
                        <div style="display:flex;gap:16px;flex-wrap:wrap;">
                            <div><span style="display:inline-block;width:24px;height:24px;background:#6c5ce7;border-radius:4px;vertical-align:middle;"></span> A: <strong>4</strong> times (even ✅)</div>
                            <div><span style="display:inline-block;width:24px;height:24px;background:#00b894;border-radius:4px;vertical-align:middle;"></span> B: <strong>2</strong> times (even ✅)</div>
                            <div><span style="display:inline-block;width:24px;height:24px;background:#fdcb6e;border-radius:4px;vertical-align:middle;"></span> C: <strong>1</strong> times (odd → middle!)</div>
                        </div>
                    </div>
                    <p style="margin-top:10px;">There are two ways to count:</p>
                    <strong>Array</strong>: Since there are 26 letters, use a size-26 array with <code>count[c - 'A'] += 1</code><br>
                    <strong>Hashmap</strong>: <span class="lang-py">Python <code>dict</code></span><span class="lang-cpp">C++ <code>unordered_map</code></span> to count directly using letters as keys<br>
                    <p style="margin-top:8px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;font-size:0.92em;">Either way gives the same result. Arrays are faster, dictionaries are more readable!</p>
                    <a href="https://en.wikipedia.org/wiki/ASCII" target="_blank" style="color: var(--accent); text-decoration: underline; font-size: 0.9em;">📎 View ASCII Table →</a>`
                },
                {
                    title: 'Placing halves',
                    content: `Now that we confirmed it's possible from the frequency count, it's time to <strong>actually build the palindrome</strong>! How do we arrange it?
                    <div style="margin:10px 0;">
                        <div style="font-weight:600;margin-bottom:10px;">Example: A:4, B:2, C:1</div>
                        <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin:12px 0;">
                            <div style="text-align:center;">
                                <div style="font-size:0.8em;color:var(--text-secondary);margin-bottom:4px;">Left Half</div>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:6px;font-weight:700;">B</span>
                                </div>
                                <div style="font-size:0.75em;color:var(--text-secondary);margin-top:2px;">A×(4÷2) + B×(2÷2)</div>
                            </div>
                            <span style="font-size:1.5em;color:var(--text-secondary);">+</span>
                            <div style="text-align:center;">
                                <div style="font-size:0.8em;color:var(--text-secondary);margin-bottom:4px;">Middle</div>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#fdcb6e;color:#2d3436;border-radius:6px;font-weight:700;">C</span>
                                </div>
                                <div style="font-size:0.75em;color:var(--text-secondary);margin-top:2px;">1 odd</div>
                            </div>
                            <span style="font-size:1.5em;color:var(--text-secondary);">+</span>
                            <div style="text-align:center;">
                                <div style="font-size:0.8em;color:var(--text-secondary);margin-bottom:4px;">🔄 Reverse</div>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:6px;font-weight:700;">B</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                </div>
                                <div style="font-size:0.75em;color:var(--text-secondary);margin-top:2px;">Reverse of left</div>
                            </div>
                        </div>
                        <div style="text-align:center;font-size:1.2em;margin:8px 0;">⬇️</div>
                        <div style="display:flex;justify-content:center;gap:3px;">
                            ${'AABCBAA'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:${c==='A'?'#6c5ce7':c==='B'?'#00b894':'#fdcb6e'};color:${c==='C'?'#2d3436':'white'};border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="text-align:center;color:#00b894;font-weight:700;margin-top:8px;">AABCBAA complete! 🎉</div>
                    </div>
                    <p style="padding:10px 14px;background:var(--bg2);border-radius:8px;font-size:0.92em;">In summary: Build the <strong>left half</strong> + if there\'s an odd letter, put it in the <strong>middle</strong> + <strong>reverse</strong> the left half and append it to the right!</p>`
                },
                {
                    title: 'How to make it lexicographically smallest?',
                    content: `Multiple palindromes may be possible. For example, "AABB" can form ABBA or BAAB. The problem wants the <strong>lexicographically smallest</strong>, so building the left half in <strong>ABC order</strong> automatically ensures this!
                    <div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:10px;">
                        <div style="font-weight:600;margin-bottom:10px;">Example: "AABB" → frequency A:2, B:2</div>
                        <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:0.85em;min-width:50px;text-align:right;color:var(--text-secondary);">Half</span>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:6px;font-weight:700;">B</span>
                                </div>
                                <span style="font-size:0.85em;color:var(--text-secondary);">← Start from A!</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:0.85em;min-width:50px;text-align:right;color:var(--text-secondary);">Reversed</span>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:6px;font-weight:700;">B</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                </div>
                            </div>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:0.85em;min-width:50px;text-align:right;color:#00b894;font-weight:700;">Result</span>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;box-shadow:0 2px 8px rgba(108,92,231,0.3);">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:8px;font-weight:700;box-shadow:0 2px 8px rgba(0,184,148,0.3);">B</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:8px;font-weight:700;box-shadow:0 2px 8px rgba(0,184,148,0.3);">B</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;box-shadow:0 2px 8px rgba(108,92,231,0.3);">A</span>
                                </div>
                                <span style="font-size:1.1em;">🎉</span>
                            </div>
                        </div>
                    </div>`
                }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

name = input().strip()
count = [0] * 26

for c in name:
    count[ord(c) - ord('A')] += 1

# If 2+ letters have odd frequency, impossible
odd_count = sum(1 for c in count if c % 2 == 1)
if odd_count > 1:
    print("I'm Sorry Hansoo")
else:
    half = ''
    mid = ''
    for i in range(26):
        if count[i] % 2 == 1:
            mid = chr(i + ord('A'))
        half += chr(i + ord('A')) * (count[i] // 2)
    print(half + mid + half[::-1])`,
                cpp: `#include <iostream>
using namespace std;

int main() {
    string name;
    cin >> name;

    int cnt[26] = {};
    for (char c : name) cnt[c - 'A']++;

    int odd = 0;
    for (int i = 0; i < 26; i++) if (cnt[i] % 2) odd++;
    if (odd > 1) { puts("I'm Sorry Hansoo"); return 0; }

    string half = "", mid = "";
    for (int i = 0; i < 26; i++) {
        if (cnt[i] % 2) mid = string(1, 'A' + i);
        half += string(cnt[i] / 2, 'A' + i);
    }
    string rev = half;
    reverse(rev.begin(), rev.end());
    cout << half + mid + rev << endl;
}`
            },
            solutions: [
                {
                    approach: 'Array Counting',
                    description: 'Count frequencies using a size-26 array; impossible if 2+ characters have odd frequency',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    templates: {
                        python: `import sys
input = sys.stdin.readline

name = input().strip()
cnt = [0] * 26
for c in name:
    cnt[ord(c) - ord('A')] += 1

odd_count = sum(1 for x in cnt if x % 2 != 0)
if odd_count > 1:
    print("I'm Sorry Hansoo")
else:
    half = ''
    mid = ''
    for i in range(26):
        if cnt[i] % 2 == 1:
            mid = chr(i + ord('A'))
        half += chr(i + ord('A')) * (cnt[i] // 2)
    print(half + mid + half[::-1])`,
                        cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    cin >> s;
    int cnt[26] = {};
    for (char c : s) cnt[c - 'A']++;

    int odd = 0;
    for (int i = 0; i < 26; i++) if (cnt[i] % 2) odd++;
    if (odd > 1) { cout << "I'm Sorry Hansoo" << endl; return 0; }

    string half = "", mid = "";
    for (int i = 0; i < 26; i++) {
        if (cnt[i] % 2) mid = string(1, 'A' + i);
        half += string(cnt[i] / 2, 'A' + i);
    }
    string rev = half;
    reverse(rev.begin(), rev.end());
    cout << half + mid + rev << endl;
}`
                    }
                },
                {
                    approach: 'Using Counter',
                    description: 'Count frequencies with collections.Counter and construct the palindrome Pythonically',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    templates: {
                        python: `from collections import Counter

name = input().strip()
counter = Counter(name)

odd_chars = [c for c, v in counter.items() if v % 2 != 0]
if len(odd_chars) > 1:
    print("I'm Sorry Hansoo")
else:
    half = ''
    mid = ''
    for c in sorted(counter):
        if counter[c] % 2 == 1:
            mid = c
        half += c * (counter[c] // 2)
    print(half + mid + half[::-1])`,
                        cpp: `#include <iostream>
#include <string>
#include <map>
#include <algorithm>
using namespace std;

int main() {
    string name;
    cin >> name;

    // Count frequencies — map auto-sorts keys
    map<char, int> freq;
    for (char c : name) freq[c]++;

    // If 2+ characters have odd frequency, palindrome is impossible
    int oddCnt = 0;
    for (auto& [ch, cnt] : freq)
        if (cnt % 2 != 0) oddCnt++;

    if (oddCnt > 1) {
        cout << "I'm Sorry Hansoo" << endl;
    } else {
        string half = "", mid = "";
        for (auto& [ch, cnt] : freq) {
            if (cnt % 2 == 1) mid = ch;
            half += string(cnt / 2, ch); // collect only half
        }
        string rev = half;
        reverse(rev.begin(), rev.end());
        cout << half + mid + rev << endl;
    }
}`
                    }
                }
            ]
        }
    ]
};

// ===== Code Step-by-Step Data =====
const _counterExplainHTML = '<h4>What is Counter?</h4>' +
    '<p>The <code>Counter</code> class from Python\'s <code>collections</code> module ' +
    'is a dictionary subclass that counts elements.</p>' +
    '<p style="margin:0.6rem 0;"><code>from collections import Counter</code></p>' +
    '<p style="margin:0.4rem 0;"><code>Counter("hello")</code> → <code>{\'l\': 2, \'h\': 1, \'e\': 1, \'o\': 1}</code></p>' +
    '<p style="margin-top:0.8rem;"><strong>Key features:</strong></p>' +
    '<ul>' +
    '<li><code>most_common(n)</code> — returns n most frequent items</li>' +
    '<li><code>counter[key]</code> — count for the key (0 if missing)</li>' +
    '<li><code>counter.items()</code> — iterate over (element, count) pairs</li>' +
    '</ul>';

(function assignCodeSteps() {
    const p = stringTopic.problems;
    function findProb(id) { return p.find(function(x) { return x.id === id; }); }

    // ── boj-10809 Array Traversal ──
    findProb('boj-10809').solutions[0].codeSteps = {
        python: [
            { title: 'Read Input', desc: 'Read a word consisting of lowercase alphabets.', code: 's = input()' },
            { title: 'Initialize Result Array', desc: 'Array for 26 alphabets (a~z) to store first positions.\nAll start as -1 → means "not yet found"!', code: 'result = [-1] * 26  # first position of each a~z' },
            { title: 'Traverse + Record', desc: 'Key: Convert each character to index 0~25!\nord(\'a\') - ord(\'a\') = 0, ord(\'b\') - ord(\'a\') = 1, ...\nOnly record when -1 → stores "first occurrence" only.', code: 'for i in range(len(s)):\n    idx = ord(s[i]) - ord(\'a\')  # alphabet → 0~25 index\n    if result[idx] == -1:        # only if first occurrence\n        result[idx] = i          # record current position' },
            { title: 'Output', desc: 'Print 26 values separated by spaces.\nmap(str, result) → converts number list to strings.', code: 'print(\' \'.join(map(str, result)))' }
        ],
        cpp: [
            { title: 'Input + Initialize', desc: 'Read string and fill size-26 array with -1.\nfill() initializes the entire array at once!', code: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    int result[26];\n    fill(result, result + 26, -1);  // initialize all to -1' },
            { title: 'Traverse + Record', desc: 'In C++, char IS a number!\ns[i] - \'a\' → converts to 0~25 index.\nOnly record when -1 → stores first occurrence only.', code: '    for (int i = 0; i < s.size(); i++) {\n        int idx = s[i] - \'a\';      // alphabet → 0~25 index\n        if (result[idx] == -1)      // only if first occurrence\n            result[idx] = i;        // record current position\n    }' },
            { title: 'Output', desc: 'Print 26 values separated by spaces.', code: '    for (int i = 0; i < 26; i++)\n        cout << result[i] << (i < 25 ? " " : "\\n");\n}' }
        ]
    };

    // ── boj-10809 find Method ──
    findProb('boj-10809').solutions[1].codeSteps = {
        python: [
            { title: 'What is find()?', desc: 'Python\'s str.find(ch) returns the\nfirst occurrence position of ch in the string.\nReturns -1 if not found — exactly what we need!', code: 's = input()' },
            { title: 'find() for each a~z', desc: 'List comprehension processes all 26 at once!\nchr(i + ord(\'a\')) → 0→\'a\', 1→\'b\', ..., 25→\'z\'', code: '# Use find() to get first position of each alphabet\nresult = [s.find(chr(i + ord(\'a\'))) for i in range(26)]' },
            { title: 'Output', desc: 'Print result. find() returns -1 automatically, no extra handling needed!', code: 'print(\' \'.join(map(str, result)))' }
        ],
        cpp: [
            { title: 'What is string::find()?', desc: 'C++\'s string::find(ch) returns the\nfirst occurrence position of a character.\nReturns string::npos (very large number) if not found.', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;' },
            { title: 'find() for each a~z', desc: 'Call find() for each alphabet.\nConvert npos to -1 for output.', code: '    for (int i = 0; i < 26; i++) {\n        char ch = \'a\' + i;\n        size_t pos = s.find(ch);\n        cout << (pos == string::npos ? -1 : (int)pos);\n        if (i < 25) cout << \' \';\n    }\n    cout << endl;\n}' }
        ]
    };

    // ── boj-1157 array counting ──
    findProb('boj-1157').solutions[0].codeSteps = {
        python: [
            { title: 'Input + Uppercase Conversion', desc: 'Need case-insensitive counting, so unify with upper().\n"Mississipi" → "MISSISSIPI"', code: 'word = input().upper()  # unify case' },
            { title: 'Frequency Array Counting', desc: 'Key: Count letter frequencies with a size-26 array.\nord(c) - ord(\'A\') → A=0, B=1, ..., Z=25 index mapping.', code: 'cnt = [0] * 26  # frequency of A~Z\nfor c in word:\n    cnt[ord(c) - ord(\'A\')] += 1  # increment for each letter' },
            { title: 'Find Maximum', desc: 'Find the highest occurrence count.', code: 'mx = max(cnt)' },
            { title: 'Duplicate Check + Output', desc: 'Multiple maximums → more than one most frequent letter → print "?".\nIf only one, print that letter.', code: 'if cnt.count(mx) > 1:       # multiple maximums?\n    print(\'?\')\nelse:\n    print(chr(cnt.index(mx) + ord(\'A\')))  # index → letter' }
        ],
        cpp: [
            { title: 'Read Input', desc: 'Read the input string.', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;' },
            { title: 'Frequency Array Counting', desc: 'Count letter frequencies with a size-26 array.\ntoupper() unifies case.', code: '    int cnt[26] = {};  // A~Z frequencies\n    for (char c : s) cnt[toupper(c) - \'A\']++;' },
            { title: 'Max + Duplicate Check', desc: 'Find max and check duplicates in a single pass.\nNew max found → reset dup. Same max → increment dup.', code: '    int mx = 0, idx = 0, dup = 0;\n    for (int i = 0; i < 26; i++) {\n        if (cnt[i] > mx) { mx = cnt[i]; idx = i; dup = 1; }\n        else if (cnt[i] == mx && mx > 0) dup++;\n    }' },
            { title: 'Output', desc: 'If duplicates, print "?"; otherwise, print the letter.', code: '    cout << (dup > 1 ? "?" : string(1, \'A\' + idx)) << endl;\n}' }
        ]
    };

    // ── boj-1157 dictionary ──
    findProb('boj-1157').solutions[1].codeSteps = {
        python: [
            { title: 'Input + Uppercase Conversion', desc: 'Unify with upper() for case-insensitive counting.', code: 'word = input().upper()  # unify case' },
            { title: 'Dictionary Counting', desc: 'Count frequencies with a dictionary instead of an array.\nInitialize to 1 if key missing, otherwise +1.\n→ Can count any character, more versatile!', code: 'freq = {}  # {letter: count}\nfor c in word:\n    if c in freq:\n        freq[c] += 1   # already exists → +1\n    else:\n        freq[c] = 1     # first seen → start at 1' },
            { title: 'Find Maximum', desc: 'Find the maximum among all dictionary values (frequencies).', code: 'mx = max(freq.values())  # max frequency' },
            { title: 'Candidate Check + Output', desc: 'If multiple characters share max frequency, print "?".\nExtract candidates with list comprehension.', code: 'candidates = [k for k, v in freq.items() if v == mx]\nprint(\'?\' if len(candidates) > 1 else candidates[0])' }
        ],
        cpp: [
            { title: 'Input + Hashmap Setup', desc: 'Store per-character frequencies with unordered_map.\nUnlike arrays, any character can be used as a key!', code: '#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;' },
            { title: 'Frequency Counting', desc: 'Convert to uppercase with toupper(), then record in hashmap.\nfreq[key]++ → starts at 0 if missing, otherwise +1.', code: '    unordered_map<char, int> freq;\n    for (char c : s) freq[toupper(c)]++; // unify to uppercase, then count' },
            { title: 'Find Maximum', desc: 'Iterate all frequencies in the hashmap to find the maximum.', code: '    int mx = 0;\n    for (auto& [ch, cnt] : freq) mx = max(mx, cnt);' },
            { title: 'Candidate Check + Output', desc: 'If multiple characters have max frequency → "?"; if one → that character.', code: '    int dup = 0;\n    char ans = \'?\';\n    for (auto& [ch, cnt] : freq) {\n        if (cnt == mx) { ans = ch; dup++; }\n    }\n    cout << (dup > 1 ? \'?\' : ans) << endl;\n}' }
        ]
    };

    // ── boj-1157 Counter ──
    findProb('boj-1157').solutions[2].codeSteps = {
        python: [
            { title: 'What is Counter?', desc: 'Python\'s dedicated frequency counting class!\nMuch more concise than building a dictionary manually.', explanation: _counterExplainHTML, code: null },
            { title: 'Count with Counter', desc: 'Counter(word) builds a frequency dict in one line!\nmost_common() → returns a list sorted by frequency descending.', code: 'from collections import Counter\n\nword = input().upper()\ncounter = Counter(word)  # one-line frequency counting!\ntop = counter.most_common()  # [(char, freq)] descending' },
            { title: 'Output Result', desc: 'If 1st and 2nd have the same frequency → tie → print "?".\nIf 1st is unique, print that character.', code: 'if len(top) > 1 and top[0][1] == top[1][1]:  # 1st == 2nd?\n    print(\'?\')\nelse:\n    print(top[0][0])  # print 1st character' }
        ],
        cpp: [
            { title: 'What is max_element?', desc: 'C++ <algorithm>\'s max_element()!\nFinds the position of the max value in an iterator range in O(n).\nSimilar role to Python\'s Counter.most_common().', explanation: _counterExplainHTML, code: null },
            { title: 'Count with unordered_map', desc: 'Count frequencies with unordered_map<char,int>.\nUnify to uppercase with toupper(), then freq[c]++.', code: '#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    unordered_map<char, int> freq;\n    for (char c : s) freq[toupper(c)]++;  // unify to uppercase, then count' },
            { title: 'Max + Tie Check', desc: 'Find max frequency with max_element.\nIf 2+ characters share max → print "?".', code: '    // Find maximum frequency\n    int mx = max_element(freq.begin(), freq.end(),\n        [](auto& a, auto& b) { return a.second < b.second; }\n    )->second;\n\n    // tie check\n    int dup = 0; char ans;\n    for (auto& [ch, cnt] : freq) {\n        if (cnt == mx) { ans = ch; dup++; }\n    }\n    cout << (dup > 1 ? \'?\' : ans) << endl;\n}' }
        ]
    };

    // ── lc-125 reverse & compare ──
    findProb('lc-125').solutions[0].codeSteps = {
        python: [
            { title: 'Function Definition', desc: 'A function to determine if a string is a palindrome.', code: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:' },
            { title: 'Extract Alphanumerics', desc: 'Key: Ignore spaces and special characters, keep only alphanumerics!\nisalnum() → checks if character is a letter or digit.\nlower() → for case-insensitive comparison.', code: '        cleaned = \'\'\n        for c in s:\n            if c.isalnum():        # alphanumeric only\n                cleaned += c.lower()  # normalize to lowercase' },
            { title: 'Reverse & Compare', desc: 'Reverse the string with Python\'s [::-1] slicing!\nIf original equals reversed → palindrome.', code: '        return cleaned == cleaned[::-1]  # same when reversed → palindrome!' }
        ],
        cpp: [
            { title: 'Function Definition', desc: 'A function to determine if a string is a palindrome.', code: 'class Solution {\npublic:\n    bool isPalindrome(string s) {' },
            { title: 'Extract Alphanumerics', desc: 'Keep only alphanumerics with isalnum(), normalize to lowercase with tolower().\n→ Spaces and special characters are ignored.', code: '        string cleaned;\n        for (char c : s) {\n            if (isalnum(c)) cleaned += tolower(c); // alphanumeric only, lowercase\n        }' },
            { title: 'Reverse & Compare', desc: 'Compare with a reversed copy using reverse().\nIf they match, it\'s a palindrome.', code: '        string rev = cleaned;\n        reverse(rev.begin(), rev.end());\n        return cleaned == rev;  // same when reversed → palindrome!\n    }\n};' }
        ]
    };

    // ── lc-125 two pointers ──
    findProb('lc-125').solutions[1].codeSteps = {
        python: [
            { title: 'Initialize Pointers', desc: 'Key: Two pointers starting from both ends!\nNo new string created → O(1) space.', code: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        left, right = 0, len(s) - 1  # start from both ends' },
            { title: 'Compare from Both Sides', desc: 'Skip non-alphanumeric characters and compare.\nIf different → immediately False! Direct check without full cleaning.\nlower() ignores case.', code: '        while left < right:\n            while left < right and not s[left].isalnum():  # skip non-alnum\n                left += 1\n            while left < right and not s[right].isalnum(): # skip non-alnum\n                right -= 1\n            if s[left].lower() != s[right].lower():  # different → not palindrome!\n                return False\n            left += 1\n            right -= 1' },
            { title: 'Return Result', desc: 'If no mismatch was found → palindrome!\nO(n) time, O(1) space — more efficient than reversing.', code: '        return True' }
        ],
        cpp: [
            { title: 'Initialize Pointers', desc: 'Start from both ends → O(1) space palindrome check!', code: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        int l = 0, r = s.size() - 1; // both ends' },
            { title: 'Compare from Both Sides', desc: 'Skip non-alphanumeric chars; if different → immediately false.\ntolower() ignores case.', code: '        while (l < r) {\n            while (l < r && !isalnum(s[l])) l++;  // skip\n            while (l < r && !isalnum(s[r])) r--;  // skip\n            if (tolower(s[l]) != tolower(s[r])) return false;\n            l++; r--;\n        }' },
            { title: 'Return Result', desc: 'Passed all checks → palindrome! O(n) time, O(1) space.', code: '        return true;\n    }\n};' }
        ]
    };

    // ── lc-49 sort key ──
    findProb('lc-49').solutions[0].codeSteps = {
        python: [
            { title: 'Prepare Hashmap', desc: 'Key idea: Anagrams become the same string when sorted!\n"eat" → "aet", "tea" → "aet" → same group!\n→ Use sorted result as key for automatic grouping.', code: 'class Solution:\n    def groupAnagrams(self, strs):\n        groups = {}  # {sorted key: [original words]}' },
            { title: 'Group by Sort Key', desc: 'Sort each word with sorted() → use as key.\nAnagrams share the same key!\nO(n × k log k) — n words, average length k.', code: '        for s in strs:\n            key = \'\'.join(sorted(s))  # "eat" → "aet"\n            if key not in groups:\n                groups[key] = []\n            groups[key].append(s)     # collect under same key' },
            { title: 'Return Result', desc: 'Return the dictionary values (group lists).', code: '        return list(groups.values())' }
        ],
        cpp: [
            { title: 'Prepare Hashmap', desc: 'Key: Anagrams → same string when sorted!\nUse sorted result as key for grouping.', code: 'class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        unordered_map<string, vector<string>> mp; // {sort key: [words]}' },
            { title: 'Group by Sort Key', desc: 'Sort each word → anagrams get the same key.\nmp[key] automatically push_backs.', code: '        for (auto& s : strs) {\n            string key = s;\n            sort(key.begin(), key.end()); // "eat" → "aet"\n            mp[key].push_back(s);         // collect under same key\n        }' },
            { title: 'Return Result', desc: 'Collect map values (groups) into a vector and return.', code: '        vector<vector<string>> res;\n        for (auto& [k, v] : mp) res.push_back(v);\n        return res;\n    }\n};' }
        ]
    };

    // ── boj-1213 array counting ──
    findProb('boj-1213').solutions[0].codeSteps = {
        python: [
            { title: 'Input + Count Frequencies', desc: 'Count each letter\'s occurrences with a size-26 array.\nord(c) - ord(\'A\') → A=0, B=1, ..., Z=25', code: 'import sys\ninput = sys.stdin.readline\n\nname = input().strip()\ncnt = [0] * 26  # A~Z frequency\nfor c in name:\n    cnt[ord(c) - ord(\'A\')] += 1' },
            { title: 'Odd Count Check', desc: 'Key: In a palindrome, at most 1 character can have odd frequency!\n(Only the middle position can be odd)\nIf 2+ are odd → impossible.', code: 'odd_count = sum(1 for x in cnt if x % 2 != 0)\nif odd_count > 1:  # 2+ odd frequency chars → impossible\n    print("I\'m Sorry Hansoo")' },
            { title: 'Build Palindrome Half', desc: 'Place each character\'s half (cnt//2) in the front.\nOdd-frequency characters go in the middle (mid).\ni=0~25 order → lexicographic order guaranteed!', code: 'else:\n    half = \'\'\n    mid = \'\'\n    for i in range(26):\n        if cnt[i] % 2 == 1:  # odd → middle\n            mid = chr(i + ord(\'A\'))\n        half += chr(i + ord(\'A\')) * (cnt[i] // 2)  # half each' },
            { title: 'Assemble + Output', desc: 'Front half + middle + reversed half = palindrome!\nExample: "AB" + "C" + "BA" = "ABCBA"', code: '    print(half + mid + half[::-1])  # front + mid + back(reversed)' }
        ],
        cpp: [
            { title: 'Input + Count Frequencies', desc: 'Count each uppercase letter\'s frequency with a size-26 array.', code: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    int cnt[26] = {}; // A~Z frequency\n    for (char c : s) cnt[c - \'A\']++;' },
            { title: 'Odd Count Check', desc: 'In a palindrome, at most 1 character can have odd frequency!\n2+ means impossible.', code: '    int odd = 0;\n    for (int i = 0; i < 26; i++) if (cnt[i] % 2) odd++;\n    if (odd > 1) { cout << "I\'m Sorry Hansoo" << endl; return 0; }' },
            { title: 'Build Palindrome Half', desc: 'Place each character\'s half (cnt/2).\nOdd-frequency characters go to the middle (mid).\ni=0~25 order → lexicographic order guaranteed.', code: '    string half = "", mid = "";\n    for (int i = 0; i < 26; i++) {\n        if (cnt[i] % 2) mid = string(1, \'A\' + i);  // odd → middle\n        half += string(cnt[i] / 2, \'A\' + i);        // half each\n    }' },
            { title: 'Assemble + Output', desc: 'Front half + middle + reversed half = palindrome!\n"AB" + "C" + "BA" = "ABCBA"', code: '    string rev = half;\n    reverse(rev.begin(), rev.end());\n    cout << half + mid + rev << endl; // front + mid + back\n}' }
        ]
    };

    // ── boj-1213 using Counter ──
    findProb('boj-1213').solutions[1].codeSteps = {
        python: [
            { title: 'What is Counter?', desc: 'Python\'s dedicated frequency counting class!\nUsing Counter instead of arrays is more concise.', explanation: _counterExplainHTML, code: null },
            { title: 'Count with Counter', desc: 'Counter(name) builds {letter: freq} in one line!\nNo more array creation and ord() conversion.', code: 'from collections import Counter\n\nname = input().strip()\ncounter = Counter(name)  # one-line frequency counting!' },
            { title: 'Odd Check', desc: '2+ characters with odd frequency → palindrome impossible.\nExtract odd-frequency characters with list comprehension.', code: 'odd_chars = [c for c, v in counter.items() if v % 2 != 0]\nif len(odd_chars) > 1:  # 2+ odd frequencies → impossible\n    print("I\'m Sorry Hansoo")' },
            { title: 'Assemble + Output', desc: 'sorted(counter) guarantees lexicographic order.\nBuild half, then front + middle + reversed = palindrome!', code: 'else:\n    half = \'\'\n    mid = \'\'\n    for c in sorted(counter):       # lexicographic order\n        if counter[c] % 2 == 1:\n            mid = c                 # odd → middle\n        half += c * (counter[c] // 2)  # half each\n    print(half + mid + half[::-1])  # front + mid + back' }
        ],
        cpp: [
            { title: 'Using unordered_map', desc: 'In C++, unordered_map<char,int>\nplays the same role as Python\'s Counter.\nThe counting method is the same!', explanation: _counterExplainHTML, code: null },
            { title: 'Count with map', desc: 'Count frequencies with map<char,int>.\nmap auto-sorts keys → lexicographic order guaranteed!', code: '#include <iostream>\n#include <string>\n#include <map>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string name;\n    cin >> name;\n    map<char, int> cnt;  // map: auto-sorts keys (chars)!\n    for (char c : name) cnt[c]++;' },
            { title: 'Odd Check', desc: '2+ characters with odd frequency means palindrome is impossible.\nIterate cnt to count odd frequencies.', code: '    int odd = 0;\n    for (auto& [ch, v] : cnt) if (v % 2) odd++;\n    if (odd > 1) {\n        cout << "I\'m Sorry Hansoo" << endl;\n        return 0;\n    }' },
            { title: 'Assemble + Output', desc: 'map is in lexicographic order, so halves are built in order.\nFront half + middle + reversed half = palindrome!', code: '    string half = "", mid = "";\n    for (auto& [ch, v] : cnt) {\n        if (v % 2) mid = string(1, ch);  // odd → middle\n        half += string(v / 2, ch);       // half each\n    }\n    string rev = half;\n    reverse(rev.begin(), rev.end());\n    cout << half + mid + rev << endl;  // front + mid + back\n}' }
        ]
    };
})();

// Module registration
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.string = stringTopic;
