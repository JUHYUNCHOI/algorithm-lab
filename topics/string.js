// =========================================================
// 문자열 조작 (String Manipulation) 토픽 모듈
// =========================================================
const stringTopic = {
    id: 'string',
    title: '문자열 조작',
    icon: '🔤',
    category: '자료구조 활용',
    order: 1,
    description: '빈도수 분석, 팰린드롬, 애너그램 등 문자열 핵심 유형과 풀이법',

    // 사이드바 확장형
    sidebarExpandable: true,

    // 단일 통합 탭 (토픽 개요용)
    tabs: [{ id: 'concept', label: '학습하기' }],

    // 문제-유형 매핑 (top-level)
    problemMeta: {
        'boj-1157':  { type: '빈도수 분석', color: 'var(--accent)', vizMethod: '_renderVizFrequency' },
        'lc-125':    { type: '팰린드롬 판별', color: 'var(--green)', vizMethod: '_renderVizPalindrome' },
        'lc-49':     { type: '애너그램 그룹화', color: '#e17055', vizMethod: '_renderVizAnagram' },
        'boj-1213':  { type: '문자열 재구성', color: '#6c5ce7', vizMethod: '_renderVizReconstruct' }
    },

    // 학습 스테이지 (순차 로드맵용)
    stages: [
        { num: 1, title: '팰린드롬 판별', desc: '투 포인터 기본 패턴', problemIds: ['lc-125'] },
        { num: 2, title: '빈도수 분석', desc: '문자 등장 횟수 세기', problemIds: ['boj-1157'] },
        { num: 3, title: '문자열 재구성', desc: '빈도수 활용한 재배열', problemIds: ['boj-1213'] },
        { num: 4, title: '애너그램 그룹화', desc: '정렬 키 + 해시맵', problemIds: ['lc-49'] },
    ],

    // 추가 유형 안내
    relatedNote: '이 외에도 투 포인터, 슬라이딩 윈도우, KMP 문자열 매칭, 문자열 파싱 등의 기법이 문자열 문제에 자주 활용됩니다.',

    // ===== 문제별 탭 정의 (app.js에서 호출) =====
    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    // ===== 문제별 콘텐츠 렌더링 (app.js에서 호출) =====
    renderProblemContent(container, problemId, tabId) {
        const self = this;
        const prob = self.problems.find(p => p.id === problemId);
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }

        const meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }

        self._clearVizState();

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

        // 문제 헤더 (타입 배지 + 난이도)
        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML = `
            <span style="padding:4px 12px;background:${meta.color}15;border-radius:8px;font-size:0.85rem;color:${meta.color};font-weight:600;">${meta.type}</span>
            <span class="problem-diff ${prob.difficulty}">${diffMap[prob.difficulty] || ''}</span>
        `;
        container.appendChild(header);

        // 탭별 콘텐츠
        const contentDiv = document.createElement('div');
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
        container.appendChild(contentDiv);
    },

    // ===== 토픽 개요 (전체 문제 카드 표시) =====
    renderConcept(container) {
        const self = this;
        self._clearVizState();

        const problemMeta = self.problemMeta;

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

        // --- 히어로 + 문제 리스트 컨테이너 ---
        container.innerHTML = `
            <div class="hero">
                <h2>🔤 문자열 조작</h2>
                <p class="hero-sub">문제를 선택하고, 생각해보고, 시뮬레이션으로 이해한 뒤, 코드를 확인해봅시다!</p>
            </div>
            <div id="str-problem-list"></div>
        `;

        const listContainer = container.querySelector('#str-problem-list');

        // --- 문제 카드 생성 ---
        self.problems.forEach(prob => {
            const meta = problemMeta[prob.id];
            if (!meta) return;

            const card = document.createElement('div');
            card.className = 'str-problem-card';
            card.style.borderLeft = `4px solid ${meta.color}`;

            card.innerHTML = `
                <div class="str-problem-header">
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <span style="font-weight:700;font-size:0.95rem;">${prob.title}</span>
                        <span style="padding:2px 8px;background:${meta.color}15;border-radius:6px;font-size:0.75rem;color:${meta.color};font-weight:600;">${meta.type}</span>
                    </div>
                    <span class="problem-diff ${prob.difficulty}">${diffMap[prob.difficulty]}</span>
                </div>
                <div class="str-sub-tabs">
                    <button class="str-sub-tab active" data-sub="problem">문제</button>
                    <button class="str-sub-tab" data-sub="think">생각해볼것</button>
                    <button class="str-sub-tab" data-sub="sim">시뮬레이션</button>
                    <button class="str-sub-tab" data-sub="code">코드</button>
                </div>
                <div class="str-sub-content"></div>
            `;

            const contentEl = card.querySelector('.str-sub-content');
            const tabs = card.querySelectorAll('.str-sub-tab');

            function showTab(tabId) {
                tabs.forEach(t => t.classList.toggle('active', t.dataset.sub === tabId));
                contentEl.innerHTML = '';
                self._clearVizState();

                switch (tabId) {
                    case 'problem':
                        self._renderProblemTab(contentEl, prob);
                        break;
                    case 'think':
                        self._renderThinkTab(contentEl, prob);
                        break;
                    case 'sim':
                        self[meta.vizMethod](contentEl);
                        break;
                    case 'code':
                        self._renderCodeTab(contentEl, prob);
                        break;
                }
            }

            tabs.forEach(tab => {
                tab.addEventListener('click', () => showTab(tab.dataset.sub));
            });

            showTab('problem');
            listContainer.appendChild(card);
        });
    },

    // ===== 사용하지 않는 탭 (통합됨) =====
    renderVisualize(container) {
        container.innerHTML = '';
    },

    renderProblem(container) {
        container.innerHTML = '';
    },

    // ===== 문제 서브탭: 문제 =====
    _renderProblemTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        contentEl.innerHTML = `
            ${prob.descriptionHTML}
            <div style="text-align:right;margin-top:1.2rem;">
                <a href="${prob.link}" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">
                    ${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}
                </a>
            </div>
        `;
        contentEl.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });
    },

    // ===== 문제 서브탭: 생각해볼것 =====
    _renderThinkTab(contentEl, prob) {
        // 안내 텍스트
        const guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = '단계별로 눌러서 힌트를 확인하세요';
        contentEl.appendChild(guide);

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hints-steps';
        const openedState = {};

        prob.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `
                <div class="hint-step-header">
                    <span class="hint-step-num">${idx + 1}</span>
                    <span class="hint-step-title">${hint.title}</span>
                    <span class="hint-step-toggle">열기</span>
                </div>
                <div class="hint-step-content">${hint.content}</div>
            `;

            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent =
                    step.classList.contains('open') ? '닫기' : '열기';

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

    // ===== 문제 서브탭: 코드 =====
    _renderCodeTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        const wrapper = document.createElement('div');

        wrapper.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
                <select class="str-lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--card);color:var(--text);">
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                </select>
                <a href="${prob.link}" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">
                    ${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}
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
            const langMap = { python: 'language-python', cpp: 'language-cpp', java: 'language-java' };
            codeEl.className = langMap[lang];
            codeEl.textContent = prob.templates[lang];
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        contentEl.appendChild(wrapper);
    },

    // ===== 빈도수 세기 시각화 =====
    _renderVizFrequency(container) {
        const self = this;
        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">문자열:
                    <input type="text" id="str-viz-input" value="banana"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;">
                </label>
                <button class="btn btn-primary" id="str-viz-start">시작</button>
            </div>
            <div class="graph-svg-container" style="min-height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">
                <div id="str-char-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
            </div>
            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:200px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">빈도수 딕셔너리</div>
                    <div id="str-freq-display" class="graph-queue-display" style="min-height:50px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">
                        <span style="color:var(--text2);">시작을 눌러주세요</span>
                    </div>
                </div>
                <div style="min-width:140px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>
                    <div id="str-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
            </div>
            ${self._createStepControls()}
            <div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 현재 확인 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 처리 완료</span>
            </div>
        `;

        const charBoxes = container.querySelector('#str-char-boxes');
        const freqDisplay = container.querySelector('#str-freq-display');
        const statusEl = container.querySelector('#str-status');

        function renderBoxes(str) {
            charBoxes.innerHTML = '';
            for (let i = 0; i < str.length; i++) {
                const box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = `<div class="str-char-idx">${i}</div><div class="str-char-val">${str[i]}</div>`;
                charBoxes.appendChild(box);
            }
        }

        function renderFreq(freq) {
            if (Object.keys(freq).length === 0) {
                freqDisplay.innerHTML = '<span style="color:var(--text2);">{ }</span>';
                return;
            }
            freqDisplay.innerHTML = Object.entries(freq)
                .map(([k, v]) => `<span class="graph-queue-item" style="min-width:50px;text-align:center;"><strong>'${k}'</strong>: ${v}</span>`)
                .join('');
        }

        function saveState() {
            return {
                boxes: Array.from(charBoxes.querySelectorAll('.str-char-box')).map(b => b.className),
                freq: freqDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.querySelectorAll('.str-char-box').forEach((b, i) => { b.className = s.boxes[i]; });
            freqDisplay.innerHTML = s.freq;
            statusEl.innerHTML = s.status;
        }

        container.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            const str = container.querySelector('#str-viz-input').value;
            if (!str.length) { statusEl.innerHTML = '<span style="color:#e17055;">문자열을 입력해주세요!</span>'; return; }

            renderBoxes(str);
            renderFreq({});
            statusEl.innerHTML = '준비 완료';

            const steps = [];
            const freq = {};

            for (let i = 0; i < str.length; i++) {
                const idx = i, ch = str[i];
                steps.push({
                    description: `인덱스 ${idx}: '${ch}' 확인 → ${freq[ch] ? `이미 ${freq[ch]}번 → ${freq[ch]+1}번으로 증가` : '처음 등장! 1로 추가'}`,
                    _before: null,
                    action() {
                        this._before = saveState();
                        for (let j = 0; j < str.length; j++) {
                            const box = charBoxes.querySelector(`[data-idx="${j}"]`);
                            if (!box) continue;
                            box.className = j < idx ? 'str-char-box matched' : j === idx ? 'str-char-box comparing' : 'str-char-box';
                        }
                        freq[ch] = (freq[ch] || 0) + 1;
                        renderFreq(freq);
                        statusEl.innerHTML = `'${ch}' → count = <strong>${freq[ch]}</strong>`;
                    },
                    undo() {
                        freq[ch]--;
                        if (freq[ch] === 0) delete freq[ch];
                        restoreState(this._before);
                    }
                });
            }

            const finalFreq = {};
            for (const c of str) finalFreq[c] = (finalFreq[c] || 0) + 1;
            const maxChar = Object.entries(finalFreq).sort((a, b) => b[1] - a[1])[0];

            steps.push({
                description: `완료! 가장 많은 글자: '${maxChar[0]}' (${maxChar[1]}번)`,
                _before: null,
                action() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(b => { b.className = 'str-char-box matched'; });
                    statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;">완료! 가장 많은 글자: <strong>'${maxChar[0]}'</strong> (${maxChar[1]}번)</span>`;
                },
                undo() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        });
    },

    // ===== 팰린드롬 판별 시각화 =====
    _renderVizPalindrome(container) {
        const self = this;
        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">문자열:
                    <input type="text" id="str-viz-input" value="A man, a plan, a canal: Panama"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;">
                </label>
                <button class="btn btn-primary" id="str-viz-start">시작</button>
            </div>
            <div style="margin-bottom:12px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">정제된 문자열</div>
                <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                    <div id="str-char-boxes" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                </div>
            </div>
            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:200px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">비교 상태</div>
                    <div id="str-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
            </div>
            ${self._createStepControls()}
            <div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> L / R 포인터</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 일치 확인</span>
            </div>
        `;

        const charBoxes = container.querySelector('#str-char-boxes');
        const statusEl = container.querySelector('#str-status');

        function renderBoxes(cleaned) {
            charBoxes.innerHTML = '';
            for (let i = 0; i < cleaned.length; i++) {
                const box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = `<div class="str-char-idx">${i}</div><div class="str-char-val">${cleaned[i]}</div>`;
                charBoxes.appendChild(box);
            }
        }

        function saveState() {
            return {
                boxes: Array.from(charBoxes.querySelectorAll('.str-char-box')).map(b => b.className),
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.querySelectorAll('.str-char-box').forEach((b, i) => { b.className = s.boxes[i]; });
            statusEl.innerHTML = s.status;
        }

        container.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            const raw = container.querySelector('#str-viz-input').value;
            const cleaned = raw.split('').filter(c => /[a-zA-Z0-9]/.test(c)).map(c => c.toLowerCase()).join('');
            if (!cleaned.length) { statusEl.innerHTML = '<span style="color:#e17055;">문자열을 입력해주세요!</span>'; return; }

            renderBoxes(cleaned);
            statusEl.innerHTML = `정제 완료: "${cleaned}" (길이 ${cleaned.length})`;

            const steps = [];
            let L = 0, R = cleaned.length - 1;

            while (L < R) {
                const l = L, r = R;
                const match = cleaned[l] === cleaned[r];
                steps.push({
                    description: match
                        ? `L=${l} ('${cleaned[l]}') == R=${r} ('${cleaned[r]}') → 일치! 안쪽으로 이동`
                        : `L=${l} ('${cleaned[l]}') != R=${r} ('${cleaned[r]}') → 불일치! 팰린드롬이 아닙니다`,
                    _before: null,
                    action() {
                        this._before = saveState();
                        charBoxes.querySelectorAll('.str-char-box').forEach((b) => {
                            const idx = parseInt(b.dataset.idx);
                            if (idx === l || idx === r) b.className = 'str-char-box comparing';
                            else if (idx < l || idx > r) b.className = 'str-char-box matched';
                            else b.className = 'str-char-box';
                        });
                        statusEl.innerHTML = match
                            ? `<span style="color:var(--green);">'${cleaned[l]}' == '${cleaned[r]}' ✓</span>`
                            : `<span style="color:#e17055;">'${cleaned[l]}' != '${cleaned[r]}' ✗</span>`;
                    },
                    undo() { restoreState(this._before); }
                });

                if (!match) break;
                L++; R--;
            }

            const isPalin = L >= R;
            steps.push({
                description: isPalin ? '팰린드롬입니다! 모든 쌍이 일치했습니다.' : '팰린드롬이 아닙니다. 불일치가 발견되었습니다.',
                _before: null,
                action() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(b => {
                        b.className = isPalin ? 'str-char-box matched' : b.className;
                    });
                    statusEl.innerHTML = isPalin
                        ? `<span style="color:var(--green);font-size:1.1rem;"><strong>팰린드롬입니다!</strong> ✓</span>`
                        : `<span style="color:#e17055;font-size:1.1rem;"><strong>팰린드롬이 아닙니다</strong> ✗</span>`;
                },
                undo() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        });
    },

    // ===== 애너그램 그룹화 시각화 =====
    _renderVizAnagram(container) {
        const self = this;
        const words = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];

        container.innerHTML = `
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">단어 목록</div>
                <div class="graph-svg-container" style="min-height:50px;display:flex;align-items:center;justify-content:center;padding:16px;gap:8px;flex-wrap:wrap;">
                    ${words.map((w, i) => `<span class="str-char-box" data-widx="${i}" style="padding:6px 14px;font-size:1rem;"><div class="str-char-val">${w}</div></span>`).join('')}
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 처리</div>
                <div id="str-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">시작 버튼을 눌러주세요</div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">그룹 (정렬 키 → 단어들)</div>
                <div id="str-groups" style="display:flex;flex-direction:column;gap:10px;min-height:60px;"></div>
            </div>
            <div style="margin-bottom:12px;">
                <button class="btn btn-primary" id="str-viz-start">시작</button>
            </div>
            ${self._createStepControls()}
        `;

        const statusEl = container.querySelector('#str-status');
        const groupsEl = container.querySelector('#str-groups');
        const wordEls = container.querySelectorAll('[data-widx]');

        const groupColors = ['var(--accent)', 'var(--green)', 'var(--yellow)', '#e17055', '#00cec9', '#fd79a8'];

        function saveState() {
            return {
                words: Array.from(wordEls).map(w => w.className),
                status: statusEl.innerHTML,
                groups: groupsEl.innerHTML
            };
        }

        function restoreState(s) {
            wordEls.forEach((w, i) => { w.className = s.words[i]; });
            statusEl.innerHTML = s.status;
            groupsEl.innerHTML = s.groups;
        }

        function renderGroups(groups) {
            groupsEl.innerHTML = '';
            let colorIdx = 0;
            for (const [key, vals] of Object.entries(groups)) {
                const color = groupColors[colorIdx % groupColors.length];
                const div = document.createElement('div');
                div.className = 'graph-queue-display';
                div.style.cssText = `display:flex;align-items:center;gap:10px;padding:10px 14px;flex-wrap:wrap;border-left:4px solid ${color};`;
                div.innerHTML = `
                    <span style="font-weight:700;color:${color};min-width:50px;">"${key}"</span>
                    <span style="color:var(--text2);">→</span>
                    ${vals.map(v => `<span class="graph-queue-item">${v}</span>`).join('')}
                `;
                groupsEl.appendChild(div);
                colorIdx++;
            }
        }

        container.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            groupsEl.innerHTML = '';
            wordEls.forEach(w => { w.className = 'str-char-box'; w.style.cssText = 'padding:6px 14px;font-size:1rem;'; });
            statusEl.innerHTML = '준비 완료';

            const steps = [];
            const groups = {};

            words.forEach((word, i) => {
                const sorted = word.split('').sort().join('');
                const isNew = !groups[sorted];
                const descSnippet = isNew
                    ? `"${word}" → sorted: "${sorted}" → 새 그룹 생성!`
                    : `"${word}" → sorted: "${sorted}" → 기존 그룹에 추가`;

                steps.push({
                    description: descSnippet,
                    _before: null,
                    action() {
                        this._before = saveState();
                        wordEls.forEach((w, j) => {
                            if (j < i) w.className = 'str-char-box matched';
                            else if (j === i) w.className = 'str-char-box comparing';
                            else w.className = 'str-char-box';
                            w.style.cssText = 'padding:6px 14px;font-size:1rem;';
                        });
                        if (!groups[sorted]) groups[sorted] = [];
                        groups[sorted].push(word);
                        renderGroups(groups);
                        statusEl.innerHTML = `"${word}" → <strong>sorted("${word}") = "${sorted}"</strong> → ${isNew ? '새 그룹!' : '기존 그룹에 추가'}`;
                    },
                    undo() {
                        groups[sorted].pop();
                        if (groups[sorted].length === 0) delete groups[sorted];
                        restoreState(this._before);
                    }
                });
            });

            const totalGroups = {};
            words.forEach(w => { const k = w.split('').sort().join(''); if (!totalGroups[k]) totalGroups[k] = []; totalGroups[k].push(w); });

            steps.push({
                description: `완료! 총 ${Object.keys(totalGroups).length}개 그룹으로 분류되었습니다.`,
                _before: null,
                action() {
                    this._before = saveState();
                    wordEls.forEach(w => { w.className = 'str-char-box matched'; w.style.cssText = 'padding:6px 14px;font-size:1rem;'; });
                    statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;"><strong>완료!</strong> ${Object.keys(totalGroups).length}개 그룹: ${Object.values(totalGroups).map(g => '[' + g.join(', ') + ']').join(', ')}</span>`;
                },
                undo() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        });
    },

    // ===== 문자열 재구성 시각화 =====
    _renderVizReconstruct(container) {
        const self = this;
        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">입력 문자열:
                    <input type="text" id="str-viz-input" value="AABB"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;text-transform:uppercase;">
                </label>
                <button class="btn btn-primary" id="str-viz-start">시작</button>
            </div>
            <div class="graph-svg-container" style="min-height:60px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">
                <div id="str-char-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
            </div>
            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:180px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">빈도수</div>
                    <div id="str-freq-display" class="graph-queue-display" style="min-height:50px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">
                        <span style="color:var(--text2);">시작을 눌러주세요</span>
                    </div>
                </div>
                <div style="flex:1;min-width:180px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">결과 조립</div>
                    <div id="str-result-display" class="graph-queue-display" style="min-height:50px;display:flex;gap:4px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">—</div>
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>
                <div id="str-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
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
            if (!input.length) { statusEl.innerHTML = '<span style="color:#e17055;">문자열을 입력해주세요!</span>'; return; }

            // 입력 글자 박스
            charBoxes.innerHTML = input.split('').map((c, i) =>
                `<div class="str-char-box" data-idx="${i}"><div class="str-char-idx">${i}</div><div class="str-char-val">${c}</div></div>`
            ).join('');
            freqDisplay.innerHTML = '<span style="color:var(--text2);">{ }</span>';
            resultDisplay.innerHTML = '—';
            statusEl.innerHTML = '준비 완료';

            const steps = [];

            // 빈도수 계산
            const count = {};
            for (const c of input) count[c] = (count[c] || 0) + 1;

            // Step 1: 빈도수 세기
            steps.push({
                description: `각 알파벳의 빈도수를 셉니다: ${Object.entries(count).sort((a,b) => a[0].localeCompare(b[0])).map(([k,v]) => `${k}:${v}`).join(', ')}`,
                _before: null,
                action() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(b => b.className = 'str-char-box matched');
                    freqDisplay.innerHTML = Object.entries(count)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([k, v]) => `<span class="graph-queue-item" style="min-width:50px;text-align:center;"><strong>'${k}'</strong>: ${v}</span>`)
                        .join('');
                    statusEl.innerHTML = '빈도수 세기 완료!';
                },
                undo() { restoreState(this._before); }
            });

            // Step 2: 홀수 개수 확인
            const oddChars = Object.entries(count).filter(([, v]) => v % 2 === 1);
            const canMake = oddChars.length <= 1;

            steps.push({
                description: canMake
                    ? `홀수 빈도 글자: ${oddChars.length}개 (≤1) → 팰린드롬 만들 수 있습니다!`
                    : `홀수 빈도 글자: ${oddChars.length}개 (>1) → 팰린드롬 불가능!`,
                _before: null,
                action() {
                    this._before = saveState();
                    freqDisplay.innerHTML = Object.entries(count)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([k, v]) => {
                            const isOdd = v % 2 === 1;
                            const bg = isOdd ? 'rgba(225,112,85,0.2)' : 'rgba(0,184,148,0.15)';
                            const border = isOdd ? '#e17055' : 'var(--green)';
                            return `<span class="graph-queue-item" style="min-width:50px;text-align:center;background:${bg};border-color:${border};"><strong>'${k}'</strong>: ${v} ${isOdd ? '(홀)' : '(짝)'}</span>`;
                        }).join('');
                    statusEl.innerHTML = canMake
                        ? `<span style="color:var(--green);">홀수 빈도 ${oddChars.length}개 ≤ 1 → 팰린드롬 가능!</span>`
                        : `<span style="color:#e17055;">홀수 빈도 ${oddChars.length}개 > 1 → 불가능! "I'm Sorry Hansoo"</span>`;
                },
                undo() { restoreState(this._before); }
            });

            if (canMake) {
                // Step 3: 앞 절반 + 가운데 + 뒤 절반 조립
                let half = '';
                let mid = '';
                const sorted = Object.keys(count).sort();
                for (const c of sorted) {
                    if (count[c] % 2 === 1) mid = c;
                    half += c.repeat(Math.floor(count[c] / 2));
                }
                const revHalf = half.split('').reverse().join('');

                steps.push({
                    description: `조립: 앞 절반 "${half}" ${mid ? `+ 가운데 "${mid}" ` : ''}+ 뒤 절반 "${revHalf}"`,
                    _before: null,
                    action() {
                        this._before = saveState();
                        let html = '';
                        html += '<span style="color:var(--text2);font-size:0.8rem;margin-right:4px;">앞:</span>';
                        html += half.split('').map(c =>
                            `<span class="str-char-box matched" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${c}</div></span>`
                        ).join('');
                        if (mid) {
                            html += '<span style="color:var(--text2);margin:0 6px;font-weight:700;">+</span>';
                            html += '<span style="color:var(--text2);font-size:0.8rem;margin-right:4px;">가운데:</span>';
                            html += `<span class="str-char-box comparing" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${mid}</div></span>`;
                        }
                        html += '<span style="color:var(--text2);margin:0 6px;font-weight:700;">+</span>';
                        html += '<span style="color:var(--text2);font-size:0.8rem;margin-right:4px;">뒤:</span>';
                        html += revHalf.split('').map(c =>
                            `<span class="str-char-box matched" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${c}</div></span>`
                        ).join('');
                        resultDisplay.innerHTML = html;
                        statusEl.innerHTML = `앞: "${half}" ${mid ? `+ 가운데: "${mid}" ` : ''}+ 뒤: "${revHalf}"`;
                    },
                    undo() { restoreState(this._before); }
                });

                // Step 4: 최종 결과
                const result = half + mid + revHalf;
                steps.push({
                    description: `완료! 결과: "${result}"`,
                    _before: null,
                    action() {
                        this._before = saveState();
                        resultDisplay.innerHTML = result.split('').map(c =>
                            `<span class="str-char-box matched" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${c}</div></span>`
                        ).join('');
                        statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;"><strong>완료!</strong> 팰린드롬: "${result}"</span>`;
                    },
                    undo() { restoreState(this._before); }
                });
            }

            self._initStepController(container, steps);
        });
    },

    // ===== 시각화 상태 관리 =====
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

    _createStepControls() {
        return `
            <div class="viz-step-controls">
                <button class="btn viz-step-btn" id="viz-prev" disabled>&larr; 이전</button>
                <span id="viz-step-counter" class="viz-step-counter">시작 전</span>
                <button class="btn btn-primary viz-step-btn" id="viz-next">다음 &rarr;</button>
            </div>
            <div id="viz-step-desc" class="viz-step-desc">▶ 위의 시작 버튼을 눌러주세요</div>
        `;
    },

    _initStepController(el, steps) {
        const state = this._vizState;
        state.steps = steps;
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
                counter.textContent = '시작 전';
                desc.textContent = '▶ 다음 버튼을 눌러 시작하세요';
            } else {
                counter.textContent = `Step ${idx + 1} / ${total}`;
                desc.textContent = state.steps[idx].description;
            }
        };

        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            state.steps[state.currentStep].action();
            updateUI();
        });

        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo();
            state.currentStep--;
            updateUI();
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

    // ===== 문제 데이터 =====
    problems: [
        {
            id: 'boj-1157',
            title: 'BOJ 1157 - 단어 공부',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1157',
            descriptionHTML: `
                <h3>문제</h3>
                <p>알파벳 대소문자로 이루어진 단어가 주어집니다.
                이 단어에서 <strong>가장 많이 사용된 알파벳</strong>을 대문자로 출력하세요.
                가장 많이 사용된 알파벳이 여러 개라면 <code>?</code>를 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>알파벳 대소문자로 이루어진 단어 (길이 &le; 1,000,000)</p></div>
                    <div><h4>출력</h4>
                    <p>가장 많이 사용된 알파벳을 대문자로 출력. 여러 개면 ?</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>Mississipi</pre></div>
                    <div><strong>출력</strong><pre>?</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떤 자료구조를 쓸까?',
                    content: '알파벳은 26개뿐입니다. 크기 26인 <strong>배열(리스트)</strong>을 만들어서 각 알파벳의 개수를 세면 됩니다!'
                },
                {
                    title: '핵심 아이디어',
                    content: '모든 글자를 대문자(또는 소문자)로 바꾼 뒤, <code>count[ord(c) - ord(\'A\')] += 1</code>로 빈도를 셉니다.<br>최댓값을 찾고, 같은 값이 2개 이상이면 <code>?</code>를 출력합니다.'
                },
                {
                    title: '정답 코드 구조',
                    content: '<code>count = [0] * 26</code>으로 배열 초기화 → 순회하며 카운트 → <code>max(count)</code>로 최대 빈도 → <code>count.count(max_val)</code>로 개수 확인'
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
                cpp: `#include <bits/stdc++.h>
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
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String word = br.readLine().toUpperCase();

        int[] cnt = new int[26];
        for (char c : word.toCharArray()) cnt[c - 'A']++;

        int mx = 0, idx = 0, dup = 0;
        for (int i = 0; i < 26; i++) {
            if (cnt[i] > mx) { mx = cnt[i]; idx = i; dup = 1; }
            else if (cnt[i] == mx && mx > 0) dup++;
        }
        System.out.println(dup > 1 ? "?" : (char)('A' + idx));
    }
}`
            }
        },
        {
            id: 'lc-125',
            title: 'LeetCode 125 - Valid Palindrome',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/valid-palindrome/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>문자열 <code>s</code>가 주어집니다.
                <strong>영문자와 숫자만</strong> 남기고, 대소문자를 무시했을 때
                팰린드롬(앞뒤가 같은 문자열)인지 판별하세요.</p>
                <p>빈 문자열은 팰린드롬으로 간주합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>문자열 s (1 &le; len(s) &le; 200,000)</p></div>
                    <div><h4>출력</h4>
                    <p>팰린드롬이면 true, 아니면 false</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>"A man, a plan, a canal: Panama"</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '전처리가 핵심!',
                    content: '먼저 영문자/숫자가 아닌 문자를 제거하고, 모두 소문자로 바꿉니다. <code>isalnum()</code>과 <code>lower()</code>를 사용하세요.'
                },
                {
                    title: '풀이 방법 2가지',
                    content: '방법 1: 정제 후 <code>s == s[::-1]</code> (간단!)<br>방법 2: 투 포인터로 양쪽에서 비교 (메모리 절약!)'
                },
                {
                    title: '투 포인터 풀이',
                    content: '<code>left, right</code>를 양 끝에서 시작. 영문자/숫자가 아닌 건 건너뛰고, 같으면 이동, 다르면 False'
                }
            ],
            templates: {
                python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # 방법 1: 간단한 풀이
        s = ''.join(c.lower() for c in s if c.isalnum())
        return s == s[::-1]

    def isPalindrome_twopointer(self, s: str) -> bool:
        # 방법 2: 투 포인터 (메모리 절약)
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
};`,
                java: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) !=
                Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`
            }
        },
        {
            id: 'lc-49',
            title: 'LeetCode 49 - Group Anagrams',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/group-anagrams/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>문자열 배열 <code>strs</code>가 주어집니다.
                <strong>애너그램(같은 글자로 이루어진 단어)</strong>끼리 그룹으로 묶어서 반환하세요.</p>
                <p>결과의 순서는 상관없습니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>문자열 배열 strs (1 &le; len &le; 10,000)</p></div>
                    <div><h4>출력</h4>
                    <p>애너그램 그룹 리스트</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>["eat","tea","tan","ate","nat","bat"]</pre></div>
                    <div><strong>출력</strong><pre>[["bat"],["nat","tan"],["ate","eat","tea"]]</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '애너그램의 특징은?',
                    content: '애너그램은 <strong>같은 글자를 재배열</strong>한 것입니다. 정렬하면 모두 같은 문자열이 됩니다! "eat" → "aet", "tea" → "aet"'
                },
                {
                    title: '핵심 아이디어',
                    content: '각 단어를 정렬한 결과를 <strong>키(key)</strong>로, 원본 단어를 <strong>값(value)</strong>으로 딕셔너리에 넣습니다.<br><code>defaultdict(list)</code>를 사용하면 편합니다.'
                },
                {
                    title: '시간 복잡도',
                    content: '단어 수 N, 최대 길이 K일 때: <strong>O(N × K log K)</strong> (정렬 때문)<br>Counter 튜플을 키로 쓰면 O(N × K)도 가능합니다.'
                }
            ],
            templates: {
                python: `from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for s in strs:
            key = ''.join(sorted(s))  # 정렬 키
            groups[key].append(s)
        return list(groups.values())

    # 대안: Counter 기반 (O(NK))
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
};`,
                java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] arr = s.toCharArray();
            Arrays.sort(arr);
            String key = new String(arr);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`
            }
        },
        {
            id: 'boj-1213',
            title: 'BOJ 1213 - 팰린드롬 만들기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1213',
            descriptionHTML: `
                <h3>문제</h3>
                <p>영어 대문자로만 이루어진 이름이 주어집니다.
                이 이름의 글자들을 재배열해서 <strong>팰린드롬</strong>을 만드세요.
                가능한 팰린드롬 중 사전순으로 가장 앞서는 것을 출력합니다.</p>
                <p>팰린드롬을 만들 수 없으면 <code>I'm Sorry Hansoo</code>를 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>영어 대문자로 이루어진 이름 (길이 &le; 50)</p></div>
                    <div><h4>출력</h4>
                    <p>사전순 가장 앞서는 팰린드롬 또는 I'm Sorry Hansoo</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>AABB</pre></div>
                    <div><strong>출력</strong><pre>ABBA</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '팰린드롬이 되려면?',
                    content: '팰린드롬에서 <strong>홀수 번 등장하는 글자는 최대 1개</strong>여야 합니다!<br>홀수 글자가 2개 이상이면 팰린드롬을 만들 수 없습니다.'
                },
                {
                    title: '어떻게 구성할까?',
                    content: '각 글자의 빈도를 센 뒤, <strong>절반씩</strong> 양쪽에 배치합니다.<br>홀수인 글자가 있으면 그건 가운데에 놓습니다. 사전순으로 만들려면 앞부분을 ABC 순서로!'
                },
                {
                    title: '정답 코드 구조',
                    content: '빈도 배열 count[26] → 홀수 개수 체크 → half = 각 글자 count//2개씩 → mid = 홀수인 글자 → <code>half + mid + reverse(half)</code>'
                }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

name = input().strip()
count = [0] * 26

for c in name:
    count[ord(c) - ord('A')] += 1

# 홀수 개수인 알파벳이 2개 이상이면 불가능
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
                cpp: `#include <bits/stdc++.h>
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
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String name = br.readLine().trim();

        int[] cnt = new int[26];
        for (char c : name.toCharArray()) cnt[c - 'A']++;

        int odd = 0;
        for (int c : cnt) if (c % 2 != 0) odd++;
        if (odd > 1) { System.out.println("I'm Sorry Hansoo"); return; }

        StringBuilder half = new StringBuilder();
        String mid = "";
        for (int i = 0; i < 26; i++) {
            if (cnt[i] % 2 == 1) mid = String.valueOf((char)('A' + i));
            for (int j = 0; j < cnt[i] / 2; j++) half.append((char)('A' + i));
        }
        System.out.println(half.toString() + mid + half.reverse().toString());
    }
}`
            }
        }
    ]
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.string = stringTopic;
