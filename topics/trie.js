// =========================================================
// 트라이 (Trie) 토픽 모듈
// =========================================================
var trieTopic = {
    id: 'trie',
    title: '트라이',
    icon: '🔠',
    category: '심화 (Gold~Platinum)',
    order: 18,
    description: '문자열을 효율적으로 저장하고 검색하는 트리 자료구조',
    relatedNote: '트라이는 자동완성, 맞춤법 검사, IP 라우팅 등에 활용되며, 압축 트라이(Radix Tree)로 메모리를 절약할 수 있습니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'lc-208':    { type: '트라이 구현',     color: 'var(--accent)', vizMethod: '_renderVizImplement' },
        'boj-14425': { type: '문자열 집합',     color: 'var(--green)',  vizMethod: '_renderVizStringSet' },
        'boj-5052':  { type: '접두사 판별',     color: '#e17055',       vizMethod: '_renderVizPhoneBook' },
        'lc-14':     { type: '공통 접두사',     color: '#6c5ce7',       vizMethod: '_renderVizLCP' }
    },

    getProblemTabs: function(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    renderProblemContent: function(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }
        self._clearVizState();
        var diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '트라이가 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
            case 'problem': self._renderProblemTab(contentDiv, prob); break;
            case 'think':   self._renderThinkTab(contentDiv, prob); break;
            case 'sim':     self[meta.vizMethod](contentDiv); break;
            case 'code':    self._renderCodeTab(contentDiv, prob); break;
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

    _renderProblemTab: function(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab: function(contentEl, prob) {
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

    _renderCodeTab: function(contentEl, prob) {
        if (window.renderSolutionsCodeTab) {
            window.renderSolutionsCodeTab(contentEl, prob);
        } else {
            contentEl.innerHTML = '<p>코드 탭 로딩 중...</p>';
        }
    },

    // ===== 개념 설명 렌더링 =====
    renderConcept: function(container) {
        container.innerHTML = '\
            <div class="hero">\
                <h2>🔠 트라이 (Trie)</h2>\
                <p class="hero-sub">문자열을 빠르게 저장하고 검색하는 특별한 트리를 배워봅시다!</p>\
            </div>\
\
            <!-- 섹션 1: 트라이란? -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">1</span> 트라이란?\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> <em>"전화번호부의 색인(인덱스)"</em>을 떠올려 보세요!<br><br>\
                    전화번호부에서 "김"씨를 찾으려면 ㄱ → ㅣ → ㅁ 순서로 따라가면 됩니다.<br>\
                    마찬가지로 트라이는 문자열을 <strong>한 글자씩 트리에 저장</strong>합니다.<br>\
                    "cat"을 찾으려면 루트에서 c → a → t 순서로 내려가면 됩니다!<br><br>\
                    같은 접두사를 가진 단어들은 <strong>같은 경로를 공유</strong>합니다.\
                    "cat"과 "car"는 "ca"까지 같은 길을 걷다가 갈라집니다.\
                    덕분에 <strong>접두사 검색이 매우 빠릅니다!</strong>\
                </div>\
                <div style="margin:0.5rem 0 0.8rem;">\
                    <a href="https://en.wikipedia.org/wiki/Trie" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Trie (Prefix Tree) ↗</a>\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="8" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="10" cy="28" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="28" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="17" y1="12" x2="12" y2="24" stroke="var(--accent)" stroke-width="2"/><line x1="21" y1="12" x2="26" y2="24" stroke="var(--accent)" stroke-width="2"/></svg>\
                        </div>\
                        <h3>트리 구조</h3>\
                        <p>트라이는 <strong>트리(Tree)</strong> 자료구조입니다. 루트에서 시작하여 한 글자씩 자식 노드로 내려갑니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--green)">O(L)</text></svg>\
                        </div>\
                        <h3>O(L) 검색</h3>\
                        <p>문자열 길이가 L이면 <strong>딱 L번</strong>만에 검색이 끝납니다! 해시 충돌 걱정 없이 정확합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="16" font-size="10" fill="var(--text2)">cat</text><text x="2" y="30" font-size="10" fill="var(--text2)">car</text><text x="22" y="23" font-size="12" fill="var(--yellow)">ca...</text></svg>\
                        </div>\
                        <h3>접두사 공유</h3>\
                        <p>같은 접두사를 가진 단어들은 <strong>같은 경로를 공유</strong>합니다. 메모리를 절약할 수 있습니다!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">Pre*</text></svg>\
                        </div>\
                        <h3>접두사 검색 최적</h3>\
                        <p>"app"으로 시작하는 단어 찾기! 트라이는 접두사(prefix) 검색에 <strong>최적의 자료구조</strong>입니다.</p>\
                    </div>\
                </div>\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># 트라이 vs 다른 방법 비교\n# N개의 문자열, 평균 길이 L\n\n# 1) 리스트에서 검색: O(N × L) — 하나씩 비교\n# 2) 집합(set)에서 검색: O(L) 평균 — 해시 사용\n# 3) 트라이에서 검색: O(L) 최악 — 항상 빠름!\n\n# 트라이의 진짜 강점: 접두사 검색!\n# "app"으로 시작하는 단어 모두 찾기\n# → 리스트/집합: O(N × L) 전부 확인해야 함\n# → 트라이: O(접두사 길이) + O(결과 수) 매우 빠름!</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// 트라이 vs 다른 방법 비교\n// N개의 문자열, 평균 길이 L\n\n// 1) vector에서 검색: O(N × L) — 하나씩 비교\n// 2) unordered_set에서 검색: O(L) 평균 — 해시 사용\n// 3) 트라이에서 검색: O(L) 최악 — 항상 빠름!\n\n// 트라이의 진짜 강점: 접두사 검색!\n// "app"으로 시작하는 단어 모두 찾기\n// → vector/set: O(N × L) 전부 확인해야 함\n// → 트라이: O(접두사 길이) + O(결과 수) 매우 빠름!</code></pre>\
                </div></span>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 트라이 만들기</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">단어를 입력하고 "삽입"을 누르면, 한 글자씩 트라이에 추가되는 과정을 볼 수 있습니다!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="text" id="trie-demo-build-input" value="cat" placeholder="단어 입력" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:120px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="trie-demo-build-insert">+ 삽입</button>\
                        <button class="concept-demo-btn" id="trie-demo-build-step" style="display:none;">Step ▶</button>\
                        <button class="concept-demo-btn" id="trie-demo-build-reset" style="background:var(--bg2);color:var(--text2);">초기화</button>\
                        <span id="trie-demo-build-counter" style="font-size:0.8rem;color:var(--text3);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">트라이 구조</div>\
                        <svg id="trie-demo-build-svg" width="400" height="260" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);display:block;margin:0 auto;"></svg>\
                        <div style="margin-top:10px;font-weight:600;color:var(--text);">삽입된 단어</div>\
                        <div id="trie-demo-build-words" style="display:flex;gap:8px;flex-wrap:wrap;min-height:30px;margin-top:4px;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="trie-demo-build-msg">"cat", "car", "card" 등을 넣어보세요! 같은 접두사를 공유하는 모습을 관찰하세요.</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">"apple", "app", "apt", "bat"을 트라이에 넣으면, 루트의 자식 노드는 몇 개일까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        정답은 <strong>2개</strong>입니다! 첫 글자가 \'a\'와 \'b\' 두 종류이므로,\
                        루트에서 \'a\' 자식과 \'b\' 자식, 2개의 자식 노드가 생깁니다.\
                        "apple", "app", "apt"는 모두 \'a\'로 시작하므로 같은 자식을 공유합니다.\
                    </div>\
                </div>\
            </div>\
\
            <!-- 섹션 2: 트라이 vs 해시맵 -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">2</span> 트라이 vs 해시맵 — 왜 트라이가 필요할까?\
                </div>\
                <div class="analogy-box">\
                    <strong>핵심 질문:</strong> 해시맵(<span class="lang-py"><code>set</code></span><span class="lang-cpp"><code>unordered_set</code></span>)도 O(1)에 검색할 수 있는데, 왜 트라이가 필요할까요?\
                    답은 <strong>"접두사"</strong>에 있습니다!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card" style="border-color: var(--green);">\
                        <h3>해시맵 (Set)</h3>\
                        <p><strong>정확한 단어 검색</strong>: O(L) 평균 ✅<br>\
                        <strong>"app"으로 시작하는 단어 찾기</strong>: 전체를 순회해야 함 → O(N×L) ❌<br>\
                        <strong>사전순 정렬</strong>: 별도 정렬 필요 ❌</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--accent);">\
                        <h3>트라이 (Trie)</h3>\
                        <p><strong>정확한 단어 검색</strong>: O(L) 최악 ✅<br>\
                        <strong>"app"으로 시작하는 단어 찾기</strong>: 접두사 경로만 따라감 → O(L+결과수) ✅<br>\
                        <strong>사전순 정렬</strong>: 자연스럽게 정렬됨 ✅</p>\
                    </div>\
                </div>\
                <div class="key-difference-box" style="margin-top:16px;padding:16px;background:var(--bg);border-radius:var(--radius);border-left:4px solid var(--accent);">\
                    <strong>핵심 차이!</strong><br>\
                    • <strong>해시맵</strong>: "이 단어가 있는가?" → ✅ 빠름 | "이 접두사로 시작하는 단어들은?" → ❌ 느림<br>\
                    • <strong>트라이</strong>: 둘 다 빠름! 접두사 검색이 필요하면 트라이가 정답<br><br>\
                    <strong>언제 트라이를 쓰나?</strong> 자동완성, 접두사 매칭, 사전순 탐색, 문자열 집합에서 접두사 관계 확인\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 정확 검색 vs 접두사 검색</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">검색어를 입력하고 정확 검색(해시맵 OK)과 접두사 검색(트라이 필요)의 차이를 확인하세요!</p>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">\
                            <input type="text" id="trie-s2-input" value="app" placeholder="검색어" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:100px;background:var(--card);color:var(--text);">\
                            <button class="concept-demo-btn" id="trie-s2-exact">정확 검색</button>\
                            <button class="concept-demo-btn" id="trie-s2-prefix">접두사 검색</button>\
                        </div>\
                        <div style="font-size:0.8rem;color:var(--text2);margin-bottom:6px;">저장된 단어: apple, app, application, apt, bat, ball, banana</div>\
                        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:150px;">\
                                <div style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">해시맵 (Set)</div>\
                                <div id="trie-s2-hash" style="font-size:0.85rem;color:var(--text2);min-height:2em;"></div>\
                            </div>\
                            <div style="flex:1;min-width:150px;">\
                                <div style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">트라이 (Trie)</div>\
                                <div id="trie-s2-trie" style="font-size:0.85rem;color:var(--text2);min-height:2em;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="trie-s2-msg">정확 검색은 둘 다 빠르지만, 접두사 검색은 트라이만 효율적입니다!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">10만 개의 단어가 저장된 상태에서, "pre"로 시작하는 단어를 모두 찾으려면 해시맵과 트라이 중 어디가 빠를까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>트라이가 압도적으로 빠릅니다!</strong><br>\
                        해시맵: 10만 개를 전부 확인하며 startsWith("pre")를 체크 → O(100,000 × L)<br>\
                        트라이: p → r → e 노드로 3번 이동한 뒤, 그 아래 단어만 수집 → O(3 + 결과 수)<br>\
                        단어 수가 많을수록 차이가 커집니다!\
                    </div>\
                </div>\
            </div>\
\
            <!-- 섹션 3: 트라이 구현 -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">3</span> 트라이 구현\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 각 노드는 <em>"갈림길에 있는 이정표"</em>입니다!<br>\
                    이정표에는 다음 글자로 갈 수 있는 화살표(children)가 있고,\
                    "여기서 단어가 끝납니다"라는 깃발(is_end)이 있습니다.\
                    "cat"을 넣으면 c → a → t 이정표를 만들고, t에 깃발을 꽂습니다!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" fill="var(--accent)">{ }</text></svg>\
                        </div>\
                        <h3>TrieNode</h3>\
                        <p><code>children</code>: 자식 노드 딕셔너리<br><code>is_end</code>: 단어 끝 표시(깃발)</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">insert</text></svg>\
                        </div>\
                        <h3>삽입 (insert)</h3>\
                        <p>글자를 하나씩 따라가며, 없는 노드는 새로 만듭니다. 마지막에 <code>is_end = True</code>!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">search</text></svg>\
                        </div>\
                        <h3>검색 (search)</h3>\
                        <p>글자를 따라가다가 없는 글자가 나오면 False. 끝까지 가서 <code>is_end</code>가 True면 존재!</p>\
                    </div>\
                </div>\
                <div style="margin:0.8rem 0 0.5rem;">\
                    <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#dict" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: dict ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: unordered_map ↗</a></span>\
                </div>\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python">class TrieNode:\n    def __init__(self):\n        self.children = {}   # {\'a\': TrieNode, \'b\': TrieNode, ...}\n        self.is_end = False  # 이 노드에서 단어가 끝나는가?\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        """단어를 트라이에 삽입합니다."""\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()  # 없으면 새로 만들기\n            node = node.children[ch]\n        node.is_end = True  # 단어의 끝 표시!\n\n    def search(self, word):\n        """단어가 트라이에 존재하는지 확인합니다."""\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False  # 경로가 없으면 단어도 없다!\n            node = node.children[ch]\n        return node.is_end  # 끝 표시가 있어야 진짜 단어!\n\n    def startsWith(self, prefix):\n        """접두사로 시작하는 단어가 있는지 확인합니다."""\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True  # 경로만 있으면 OK! (is_end 불필요)\n\n# 사용 예시\ntrie = Trie()\ntrie.insert("apple")\ntrie.insert("app")\nprint(trie.search("apple"))      # True\nprint(trie.search("app"))        # True\nprint(trie.search("ap"))         # False (is_end가 False!)\nprint(trie.startsWith("app"))    # True\nprint(trie.startsWith("b"))      # False</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// C++ 트라이 구현\n#include &lt;iostream&gt;\n#include &lt;string&gt;\n#include &lt;unordered_map&gt;\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map&lt;char, TrieNode*&gt; children;\n    bool is_end = false;\n};\n\nclass Trie {\n    TrieNode* root;\npublic:\n    Trie() { root = new TrieNode(); }\n\n    void insert(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new TrieNode();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }\n\n    bool search(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n\n    bool startsWith(const string& prefix) {\n        TrieNode* node = root;\n        for (char ch : prefix) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return true;\n    }\n};\n\n// 사용 예시\nint main() {\n    Trie trie;\n    trie.insert("apple");\n    trie.insert("app");\n    cout &lt;&lt; trie.search("apple") &lt;&lt; endl;      // 1 (true)\n    cout &lt;&lt; trie.search("app") &lt;&lt; endl;        // 1 (true)\n    cout &lt;&lt; trie.search("ap") &lt;&lt; endl;         // 0 (false, is_end가 false!)\n    cout &lt;&lt; trie.startsWith("app") &lt;&lt; endl;    // 1 (true)\n    cout &lt;&lt; trie.startsWith("b") &lt;&lt; endl;      // 0 (false)\n}</code></pre>\
                </div></span>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 트라이에서 검색</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">트라이에 "apple", "app", "apt", "bat"이 들어있습니다. 검색할 단어를 입력하면 한 글자씩 경로를 따라가며 결과를 보여줍니다!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="text" id="trie-demo-search-input" value="app" placeholder="검색할 단어" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:120px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="trie-demo-search-step">다음 글자 ▶</button>\
                        <button class="concept-demo-btn" id="trie-demo-search-reset" style="background:var(--bg2);color:var(--text2);">초기화</button>\
                        <span id="trie-demo-search-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <svg id="trie-demo-search-svg" width="400" height="260" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);display:block;margin:0 auto;"></svg>\
                    </div>\
                    <div class="concept-demo-msg" id="trie-demo-search-msg">"apple", "app", "bat" 등을 검색해보세요! 경로를 따라가다가 없으면 실패, 끝에 is_end가 있으면 성공!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">트라이에 "app"과 "apple"을 넣은 뒤, search("app")과 startsWith("app")의 결과 차이는?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        둘 다 <strong>True</strong>입니다! "app"을 넣었기 때문에 \'p\' 노드에 <code>is_end = True</code>가 표시됩니다.\
                        만약 "app"을 넣지 않고 "apple"만 넣었다면, <code>search("app")</code>은 <strong>False</strong>이고\
                        <code>startsWith("app")</code>은 <strong>True</strong>입니다. search는 is_end를 확인하고, startsWith는 경로만 확인하기 때문입니다!\
                    </div>\
                </div>\
            </div>\
\
            <!-- 섹션 4: 트라이 활용 -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">4</span> 트라이 활용\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 여러분이 스마트폰에서 글자를 입력할 때\
                    <em>"자동완성 추천"</em>이 뜨는 것을 본 적이 있을 것입니다!\
                    "app"을 입력하면 "apple", "application", "appetite" 등을 추천해 줍니다.\
                    이런 자동완성 기능이 바로 트라이를 활용한 대표적인 예입니다!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--accent)">🔍</text></svg>\
                        </div>\
                        <h3>자동완성</h3>\
                        <p>입력한 접두사로 시작하는 단어를 빠르게 찾아 추천합니다. 검색 엔진, 입력기에서 널리 사용됩니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--green)">📖</text></svg>\
                        </div>\
                        <h3>사전 검색</h3>\
                        <p>대량의 단어를 저장하고 빠르게 존재 여부를 확인합니다. 맞춤법 검사기에서도 활용됩니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--yellow)">📞</text></svg>\
                        </div>\
                        <h3>접두사 매칭</h3>\
                        <p>전화번호 목록에서 어떤 번호가 다른 번호의 접두사인지 빠르게 확인할 수 있습니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--accent)">🗂️</text></svg>\
                        </div>\
                        <h3>문자열 집합 관리</h3>\
                        <p>많은 문자열의 삽입/삭제/검색을 효율적으로 처리합니다. IP 라우팅 테이블에서도 사용됩니다.</p>\
                    </div>\
                </div>\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># 트라이 활용 예: 자동완성 구현\nclass AutocompleteTrie(Trie):\n    def _collect(self, node, prefix, results):\n        """현재 노드부터 모든 단어를 수집합니다."""\n        if node.is_end:\n            results.append(prefix)\n        for ch, child in sorted(node.children.items()):\n            self._collect(child, prefix + ch, results)\n\n    def autocomplete(self, prefix):\n        """접두사로 시작하는 모든 단어를 반환합니다."""\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return []  # 접두사 자체가 없으면 빈 리스트\n            node = node.children[ch]\n        results = []\n        self._collect(node, prefix, results)\n        return results\n\n# 사용 예시\ntrie = AutocompleteTrie()\nfor word in ["apple", "app", "application", "apt", "bat"]:\n    trie.insert(word)\n\nprint(trie.autocomplete("app"))\n# [\'app\', \'apple\', \'application\']\nprint(trie.autocomplete("b"))\n# [\'bat\']</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// 트라이 활용 예: 자동완성 구현\n#include &lt;iostream&gt;\n#include &lt;string&gt;\n#include &lt;vector&gt;\n#include &lt;map&gt;\nusing namespace std;\n\nstruct TrieNode {\n    map&lt;char, TrieNode*&gt; children;  // 정렬된 순서 유지\n    bool is_end = false;\n};\n\nclass AutocompleteTrie {\n    TrieNode* root;\n\n    // 현재 노드부터 모든 단어를 수집\n    void collect(TrieNode* node, string& prefix, vector&lt;string&gt;& results) {\n        if (node-&gt;is_end)\n            results.push_back(prefix);\n        for (auto& [ch, child] : node-&gt;children) {\n            prefix.push_back(ch);\n            collect(child, prefix, results);\n            prefix.pop_back();\n        }\n    }\n\npublic:\n    AutocompleteTrie() { root = new TrieNode(); }\n\n    void insert(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node-&gt;children.count(ch))\n                node-&gt;children[ch] = new TrieNode();\n            node = node-&gt;children[ch];\n        }\n        node-&gt;is_end = true;\n    }\n\n    vector&lt;string&gt; autocomplete(const string& prefix) {\n        TrieNode* node = root;\n        for (char ch : prefix) {\n            if (!node-&gt;children.count(ch))\n                return {};  // 접두사 자체가 없으면 빈 벡터\n            node = node-&gt;children[ch];\n        }\n        vector&lt;string&gt; results;\n        string p = prefix;\n        collect(node, p, results);\n        return results;\n    }\n};\n\n// 사용 예시\nint main() {\n    AutocompleteTrie trie;\n    for (auto& w : {"apple", "app", "application", "apt", "bat"})\n        trie.insert(w);\n\n    for (auto& s : trie.autocomplete("app"))\n        cout &lt;&lt; s &lt;&lt; " ";  // app apple application\n    cout &lt;&lt; endl;\n    for (auto& s : trie.autocomplete("b"))\n        cout &lt;&lt; s &lt;&lt; " ";  // bat\n}</code></pre>\
                </div></span>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 자동완성</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">접두사를 입력하면, 트라이에 저장된 단어 중 해당 접두사로 시작하는 단어를 즉시 추천합니다!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="text" id="trie-demo-auto-input" value="" placeholder="접두사 입력 (예: ap)" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:160px;background:var(--card);color:var(--text);">\
                        <span style="font-size:0.85rem;color:var(--text2);">단어 목록:</span>\
                        <input type="text" id="trie-demo-auto-words" value="apple,app,application,apt,bat,ball,banana" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:260px;background:var(--card);color:var(--text);">\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">추천 결과</div>\
                        <div id="trie-demo-auto-results" style="display:flex;gap:8px;flex-wrap:wrap;min-height:36px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="trie-demo-auto-msg">접두사를 한 글자씩 입력해보세요! 실시간으로 추천 목록이 바뀝니다. "ap" → apple, app, application, apt</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">전화번호 목록 ["119", "1195", "112"]가 있을 때, "119"는 "1195"의 접두사입니다. 이를 트라이로 어떻게 판별할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        모든 번호를 트라이에 넣으면서, 삽입 도중 이미 <code>is_end = True</code>인 노드를 지나가면\
                        <strong>기존 번호가 현재 번호의 접두사</strong>라는 뜻입니다!\
                        반대로, 삽입이 끝난 노드에 이미 자식이 있으면 <strong>현재 번호가 다른 번호의 접두사</strong>입니다.\
                        이 방법으로 "전화번호 목록" 유형의 문제를 풀 수 있습니다.\
                    </div>\
                </div>\
            </div>\
        ';

        this._initConceptInteractions(container);
    },

    _initConceptInteractions: function(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // ====== 섹션 2 데모: 정확 검색 vs 접두사 검색 ======
        (function() {
            var inputEl = container.querySelector('#trie-s2-input');
            var hashEl = container.querySelector('#trie-s2-hash');
            var trieEl = container.querySelector('#trie-s2-trie');
            var msgEl = container.querySelector('#trie-s2-msg');
            if (!inputEl) return;
            var words = ['apple','app','application','apt','bat','ball','banana'];
            var wordSet = {};
            words.forEach(function(w) { wordSet[w] = true; });
            container.querySelector('#trie-s2-exact').addEventListener('click', function() {
                var q = inputEl.value.trim().toLowerCase();
                if (wordSet[q]) {
                    hashEl.innerHTML = '<span style="color:var(--green);font-weight:600;">O(L) — 찾음!</span> "' + q + '" 존재.';
                    trieEl.innerHTML = '<span style="color:var(--green);font-weight:600;">O(L) — 찾음!</span> "' + q + '" 존재.';
                    msgEl.textContent = '정확 검색은 해시맵도 트라이도 O(L)로 빠릅니다!';
                } else {
                    hashEl.innerHTML = '<span style="color:var(--red);">O(L) — 없음.</span>';
                    trieEl.innerHTML = '<span style="color:var(--red);">O(L) — 없음.</span>';
                    msgEl.textContent = '둘 다 빠르게 "없음"을 알 수 있습니다.';
                }
            });
            container.querySelector('#trie-s2-prefix').addEventListener('click', function() {
                var q = inputEl.value.trim().toLowerCase();
                var matches = words.filter(function(w) { return w.indexOf(q) === 0; });
                hashEl.innerHTML = '<span style="color:var(--red);font-weight:600;">O(N×L)</span> — 전부 확인해야 함!<br>7개 단어 모두 startsWith 체크';
                trieEl.innerHTML = '<span style="color:var(--green);font-weight:600;">O(' + q.length + ' + ' + matches.length + ')</span> — ' + q.length + '글자 이동 후 결과만 수집!<br>결과: ' + (matches.length ? matches.join(', ') : '없음');
                msgEl.textContent = '접두사 검색에서 트라이가 압도적으로 유리합니다! 데이터가 많을수록 차이가 커져요.';
            });
        })();

        // ===== Trie data structure shared across demos =====
        function TrieNode() { this.children = {}; this.isEnd = false; }
        function TrieDS() { this.root = new TrieNode(); }
        TrieDS.prototype.insert = function(word) {
            var node = this.root;
            for (var i = 0; i < word.length; i++) {
                var ch = word[i];
                if (!node.children[ch]) node.children[ch] = new TrieNode();
                node = node.children[ch];
            }
            node.isEnd = true;
        };
        TrieDS.prototype.search = function(word) {
            var node = this.root;
            for (var i = 0; i < word.length; i++) {
                if (!node.children[word[i]]) return null;
                node = node.children[word[i]];
            }
            return node;
        };
        TrieDS.prototype.collect = function(node, prefix) {
            var results = [];
            if (node.isEnd) results.push(prefix);
            var keys = Object.keys(node.children).sort();
            for (var i = 0; i < keys.length; i++) {
                results = results.concat(this.collect(node.children[keys[i]], prefix + keys[i]));
            }
            return results;
        };
        TrieDS.prototype.autocomplete = function(prefix) {
            var node = this.search(prefix);
            if (!node) return [];
            return this.collect(node, prefix);
        };

        // ===== Shared trie rendering helper =====
        function layoutTrie(root) {
            // BFS to assign positions to each node
            var levels = [];
            var queue = [{node:root, ch:'root', depth:0, parent:null, idx:0}];
            var allNodes = [];
            while (queue.length > 0) {
                var cur = queue.shift();
                if (!levels[cur.depth]) levels[cur.depth] = [];
                cur.levelIdx = levels[cur.depth].length;
                levels[cur.depth].push(cur);
                allNodes.push(cur);
                var keys = Object.keys(cur.node.children).sort();
                for (var i = 0; i < keys.length; i++) {
                    queue.push({node:cur.node.children[keys[i]], ch:keys[i], depth:cur.depth+1, parent:cur, idx:i});
                }
            }
            // assign x positions
            var svgW = 400, yGap = 50, startY = 30;
            allNodes.forEach(function(n) {
                n.y = startY + n.depth * yGap;
            });
            // bottom-up x positioning
            for (var d = levels.length - 1; d >= 0; d--) {
                var lvl = levels[d];
                for (var i = 0; i < lvl.length; i++) {
                    var n = lvl[i];
                    var childKeys = Object.keys(n.node.children).sort();
                    if (childKeys.length === 0) {
                        // leaf: assign spacing
                        n.x = null; // will assign later
                    } else {
                        // center over children
                        var childNodes = allNodes.filter(function(c) { return c.parent === n; });
                        var sumX = 0, cnt = 0;
                        childNodes.forEach(function(c) { if (c.x !== null && c.x !== undefined) { sumX += c.x; cnt++; } });
                        if (cnt > 0) n.x = sumX / cnt;
                    }
                }
            }
            // assign leaf positions with spacing
            var leafCounter = 0;
            var leaves = allNodes.filter(function(n) { return Object.keys(n.node.children).length === 0; });
            var spacing = Math.min(50, (svgW - 40) / Math.max(leaves.length, 1));
            var startX = (svgW - spacing * (leaves.length - 1)) / 2;
            leaves.forEach(function(n) { n.x = startX + leafCounter * spacing; leafCounter++; });
            // re-center parents bottom-up
            for (var d = levels.length - 1; d >= 0; d--) {
                levels[d].forEach(function(n) {
                    var childNodes = allNodes.filter(function(c) { return c.parent === n; });
                    if (childNodes.length > 0) {
                        var sumX = 0;
                        childNodes.forEach(function(c) { sumX += c.x; });
                        n.x = sumX / childNodes.length;
                    }
                });
            }
            // clamp
            allNodes.forEach(function(n) { n.x = Math.max(20, Math.min(svgW - 20, n.x || svgW/2)); });
            return allNodes;
        }

        function renderTrieSvg(svgEl, allNodes, highlightPath, highlightResult) {
            var html = '';
            // edges
            allNodes.forEach(function(n) {
                if (n.parent) {
                    var edgeColor = 'var(--bg3)';
                    if (highlightPath && highlightPath.indexOf(n) >= 0 && highlightPath.indexOf(n.parent) >= 0) {
                        edgeColor = highlightResult === 'searching' ? 'var(--yellow)' : (highlightResult === 'found' ? 'var(--green)' : (highlightResult === 'fail' ? 'var(--red)' : 'var(--accent)'));
                    }
                    html += '<line x1="'+n.parent.x+'" y1="'+n.parent.y+'" x2="'+n.x+'" y2="'+n.y+'" stroke="'+edgeColor+'" stroke-width="2.5"/>';
                }
            });
            // nodes
            allNodes.forEach(function(n) {
                var r = 16, fill = 'var(--card)', stroke = 'var(--bg3)', txtColor = 'var(--text)';
                if (n.node.isEnd) { stroke = 'var(--green)'; }
                if (highlightPath && highlightPath.indexOf(n) >= 0) {
                    if (highlightResult === 'searching') { fill = 'var(--yellow)'; stroke = 'var(--yellow)'; txtColor = '#333'; }
                    else if (highlightResult === 'found') { fill = 'var(--green)'; stroke = 'var(--green)'; txtColor = 'white'; }
                    else if (highlightResult === 'fail') { fill = 'var(--red)'; stroke = 'var(--red)'; txtColor = 'white'; }
                    else { fill = 'var(--accent)'; stroke = 'var(--accent)'; txtColor = 'white'; }
                }
                html += '<circle cx="'+n.x+'" cy="'+n.y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.5"/>';
                html += '<text x="'+n.x+'" y="'+(n.y+5)+'" text-anchor="middle" font-size="13" font-weight="700" fill="'+txtColor+'">'+n.ch+'</text>';
                if (n.node.isEnd) {
                    html += '<circle cx="'+(n.x+12)+'" cy="'+(n.y-12)+'" r="5" fill="var(--green)"/>';
                }
            });
            svgEl.innerHTML = html;
        }

        // ========== Demo 1: 트라이 만들기 ==========
        (function() {
            var trie = new TrieDS();
            var insertedWords = [];
            var svgEl = container.querySelector('#trie-demo-build-svg');
            var wordsEl = container.querySelector('#trie-demo-build-words');
            var inputEl = container.querySelector('#trie-demo-build-input');
            var insertBtn = container.querySelector('#trie-demo-build-insert');
            var stepBtn = container.querySelector('#trie-demo-build-step');
            var resetBtn = container.querySelector('#trie-demo-build-reset');
            var counterEl = container.querySelector('#trie-demo-build-counter');
            var msgEl = container.querySelector('#trie-demo-build-msg');

            // State for step-by-step insertion
            var buildState = { word: '', stepIdx: 0, node: null, inserting: false };

            function renderBuild() {
                var allNodes = layoutTrie(trie.root);
                renderTrieSvg(svgEl, allNodes, null, null);
                wordsEl.innerHTML = '';
                insertedWords.forEach(function(w) {
                    var span = document.createElement('span');
                    span.style.cssText = 'padding:4px 12px;background:var(--green)15;color:var(--green);border-radius:8px;font-weight:600;font-size:0.85rem;border:1px solid var(--green)30;';
                    span.textContent = w;
                    wordsEl.appendChild(span);
                });
                if (insertedWords.length === 0) {
                    wordsEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">아직 삽입된 단어가 없습니다</span>';
                }
            }

            function renderBuildWords() {
                wordsEl.innerHTML = '';
                insertedWords.forEach(function(w) {
                    var span = document.createElement('span');
                    span.style.cssText = 'padding:4px 12px;background:var(--green)15;color:var(--green);border-radius:8px;font-weight:600;font-size:0.85rem;border:1px solid var(--green)30;';
                    span.textContent = w;
                    wordsEl.appendChild(span);
                });
            }

            function buildStepExec() {
                var word = buildState.word;
                var i = buildState.stepIdx;
                // Total steps: word.length (one per char) + 1 (final is_end marking)
                if (i >= word.length) {
                    // Final step: mark is_end
                    buildState.node.isEnd = true;
                    insertedWords.push(word);
                    var allNodes = layoutTrie(trie.root);
                    var hp = [allNodes[0]];
                    var cur = trie.root;
                    for (var j = 0; j < word.length; j++) {
                        cur = cur.children[word[j]];
                        var found = allNodes.filter(function(n) { return n.node === cur; });
                        if (found.length > 0) hp.push(found[0]);
                    }
                    renderTrieSvg(svgEl, allNodes, hp, 'found');
                    renderBuildWords();
                    msgEl.textContent = '"' + word + '" 삽입 완료! is_end 표시(초록 점)를 확인하세요.';
                    msgEl.style.color = 'var(--green)';
                    counterEl.textContent = (i + 1) + ' / ' + (word.length + 1);
                    // Done — hide step, show insert again
                    buildState.inserting = false;
                    stepBtn.style.display = 'none';
                    insertBtn.disabled = false;
                    return;
                }
                var ch = word[i];
                if (!buildState.node.children[ch]) {
                    buildState.node.children[ch] = new TrieNode();
                    msgEl.textContent = '"' + ch + '" 노드가 없으므로 새로 만듭니다! (깊이 ' + (i+1) + ')';
                    msgEl.style.color = 'var(--accent)';
                } else {
                    msgEl.textContent = '"' + ch + '" 노드가 이미 있으므로 따라갑니다. (공유!)';
                    msgEl.style.color = 'var(--yellow)';
                }
                buildState.node = buildState.node.children[ch];
                var allNodes = layoutTrie(trie.root);
                var hp = [allNodes[0]];
                var cur = trie.root;
                for (var j = 0; j <= i; j++) {
                    cur = cur.children[word[j]];
                    var found = allNodes.filter(function(n) { return n.node === cur; });
                    if (found.length > 0) hp.push(found[0]);
                }
                renderTrieSvg(svgEl, allNodes, hp, 'searching');
                counterEl.textContent = (i + 1) + ' / ' + (word.length + 1);
                buildState.stepIdx++;
            }

            insertBtn.addEventListener('click', function() {
                if (buildState.inserting) return;
                var word = inputEl.value.trim().toLowerCase();
                if (!word || !/^[a-z]+$/.test(word)) {
                    msgEl.textContent = '영문 소문자 단어를 입력하세요!';
                    msgEl.style.color = 'var(--red)';
                    return;
                }
                if (insertedWords.indexOf(word) >= 0) {
                    msgEl.textContent = '"' + word + '"는 이미 삽입되었습니다!';
                    msgEl.style.color = 'var(--yellow)';
                    return;
                }
                // Begin step-by-step insertion
                buildState.word = word;
                buildState.stepIdx = 0;
                buildState.node = trie.root;
                buildState.inserting = true;
                insertBtn.disabled = true;
                stepBtn.style.display = '';
                counterEl.textContent = '0 / ' + (word.length + 1);
                msgEl.textContent = '"' + word + '" 삽입을 시작합니다. Step 버튼을 눌러 한 글자씩 진행하세요.';
                msgEl.style.color = 'var(--text2)';
            });

            stepBtn.addEventListener('click', function() {
                if (!buildState.inserting) return;
                buildStepExec();
            });

            resetBtn.addEventListener('click', function() {
                trie = new TrieDS();
                insertedWords = [];
                buildState.inserting = false;
                buildState.word = '';
                buildState.stepIdx = 0;
                buildState.node = null;
                stepBtn.style.display = 'none';
                insertBtn.disabled = false;
                counterEl.textContent = '';
                renderBuild();
                msgEl.textContent = '"cat", "car", "card" 등을 넣어보세요! 같은 접두사를 공유하는 모습을 관찰하세요.';
                msgEl.style.color = 'var(--text2)';
            });

            renderBuild();
        })();

        // ========== Demo 2: 트라이에서 검색 ==========
        (function() {
            var trie2 = new TrieDS();
            ['apple','app','apt','bat'].forEach(function(w) { trie2.insert(w); });

            var svgEl = container.querySelector('#trie-demo-search-svg');
            var inputEl = container.querySelector('#trie-demo-search-input');
            var stepBtn = container.querySelector('#trie-demo-search-step');
            var resetBtn = container.querySelector('#trie-demo-search-reset');
            var counterEl = container.querySelector('#trie-demo-search-counter');
            var msgEl = container.querySelector('#trie-demo-search-msg');

            var searchWord, searchIdx, searchNode, searchPath, allNodes2, searching;

            function resetSearch() {
                searchWord = ''; searchIdx = -1; searchNode = null; searchPath = []; searching = false;
                allNodes2 = layoutTrie(trie2.root);
                renderTrieSvg(svgEl, allNodes2, null, null);
                counterEl.textContent = '';
                stepBtn.disabled = false;
                msgEl.textContent = '"apple", "app", "bat" 등을 검색해보세요! 경로를 따라가다가 없으면 실패, 끝에 is_end가 있으면 성공!';
                msgEl.style.color = 'var(--text2)';
            }

            stepBtn.addEventListener('click', function() {
                if (!searching) {
                    // start search
                    searchWord = inputEl.value.trim().toLowerCase();
                    if (!searchWord || !/^[a-z]+$/.test(searchWord)) {
                        msgEl.textContent = '영문 소문자 단어를 입력하세요!';
                        msgEl.style.color = 'var(--red)';
                        return;
                    }
                    searching = true;
                    searchIdx = 0;
                    searchNode = trie2.root;
                    allNodes2 = layoutTrie(trie2.root);
                    searchPath = [allNodes2[0]]; // root
                    renderTrieSvg(svgEl, allNodes2, searchPath, 'searching');
                    msgEl.textContent = '"' + searchWord + '" 검색 시작! 루트에서 출발합니다.';
                    msgEl.style.color = 'var(--accent)';
                    counterEl.textContent = '0 / ' + searchWord.length;
                    return;
                }

                if (searchIdx >= searchWord.length) {
                    // check is_end
                    if (searchNode.isEnd) {
                        renderTrieSvg(svgEl, allNodes2, searchPath, 'found');
                        msgEl.textContent = '"' + searchWord + '" 검색 성공! is_end = true이므로 이 단어는 트라이에 존재합니다.';
                        msgEl.style.color = 'var(--green)';
                    } else {
                        renderTrieSvg(svgEl, allNodes2, searchPath, 'fail');
                        msgEl.textContent = '"' + searchWord + '" 검색 실패! 경로는 있지만 is_end = false이므로 이 단어는 저장되지 않았습니다.';
                        msgEl.style.color = 'var(--red)';
                    }
                    stepBtn.disabled = true;
                    searching = false;
                    return;
                }

                var ch = searchWord[searchIdx];
                if (!searchNode.children[ch]) {
                    // not found
                    renderTrieSvg(svgEl, allNodes2, searchPath, 'fail');
                    msgEl.textContent = '"' + ch + '" 자식 노드가 없습니다! "' + searchWord + '" 검색 실패.';
                    msgEl.style.color = 'var(--red)';
                    stepBtn.disabled = true;
                    searching = false;
                    return;
                }

                searchNode = searchNode.children[ch];
                // find this node in allNodes2
                var found = allNodes2.filter(function(n) { return n.node === searchNode; });
                if (found.length > 0) searchPath.push(found[0]);
                searchIdx++;
                counterEl.textContent = searchIdx + ' / ' + searchWord.length;
                renderTrieSvg(svgEl, allNodes2, searchPath, 'searching');
                msgEl.textContent = '"' + ch + '" 노드를 찾았습니다! 따라갑니다. (' + searchIdx + '/' + searchWord.length + ' 글자)';
                msgEl.style.color = 'var(--yellow)';

                if (searchIdx >= searchWord.length) {
                    msgEl.textContent += ' 모든 글자를 따라갔습니다. 다음 스텝에서 is_end를 확인합니다!';
                }
            });

            resetBtn.addEventListener('click', resetSearch);
            resetSearch();
        })();

        // ========== Demo 3: 자동완성 ==========
        (function() {
            var autoInput = container.querySelector('#trie-demo-auto-input');
            var wordsInput = container.querySelector('#trie-demo-auto-words');
            var resultsEl = container.querySelector('#trie-demo-auto-results');
            var msgEl = container.querySelector('#trie-demo-auto-msg');

            function buildTrieFromWords(words) {
                var t = new TrieDS();
                words.forEach(function(w) { var ww = w.trim().toLowerCase(); if (ww) t.insert(ww); });
                return t;
            }

            function update() {
                var words = wordsInput.value.split(',').map(function(w) { return w.trim(); }).filter(function(w) { return w.length > 0; });
                var t = buildTrieFromWords(words);
                var prefix = autoInput.value.trim().toLowerCase();
                resultsEl.innerHTML = '';

                if (!prefix) {
                    resultsEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">접두사를 입력하면 추천 결과가 표시됩니다</span>';
                    msgEl.textContent = '접두사를 한 글자씩 입력해보세요! 실시간으로 추천 목록이 바뀝니다.';
                    msgEl.style.color = 'var(--text2)';
                    return;
                }

                var results = t.autocomplete(prefix);
                if (results.length === 0) {
                    resultsEl.innerHTML = '<span style="color:var(--red);font-size:0.85rem;">"' + prefix + '"로 시작하는 단어가 없습니다</span>';
                    msgEl.textContent = '해당 접두사로 시작하는 단어가 트라이에 없습니다. 다른 접두사를 시도하거나 단어를 추가하세요!';
                    msgEl.style.color = 'var(--red)';
                } else {
                    results.forEach(function(w) {
                        var span = document.createElement('span');
                        span.style.cssText = 'padding:6px 14px;background:var(--accent)12;color:var(--accent);border-radius:8px;font-weight:600;font-size:0.9rem;border:1.5px solid var(--accent)30;';
                        // bold the prefix part
                        span.innerHTML = '<strong>' + w.substring(0, prefix.length) + '</strong>' + w.substring(prefix.length);
                        resultsEl.appendChild(span);
                    });
                    msgEl.textContent = '"' + prefix + '"로 시작하는 단어 ' + results.length + '개 발견! 트라이에서 접두사 경로를 따라간 뒤, 하위 노드를 모두 수집합니다.';
                    msgEl.style.color = 'var(--green)';
                }
            }

            autoInput.addEventListener('input', update);
            wordsInput.addEventListener('change', update);
            update();
        })();
    },

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState: function() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepDesc: function(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls: function(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>◀ 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 ▶</button>' +
            '</div>';
    },

    _initStepController: function(container, steps, suffix) {
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
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
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

    // ===== 개념 시각화 탭 =====
    renderVisualize: function(container) {
        var self = this;
        self._clearVizState();
        var suffix = 'concept-trie';

        container.innerHTML =
            '<div class="hero" style="padding-bottom:12px;">' +
            '<h2>트라이 삽입 시각화</h2>' +
            '<p class="hero-sub">"cat", "car", "card"를 트라이에 하나씩 넣는 과정을 단계별로 봅시다.</p>' +
            '</div>' +
            '<div class="graph-svg-container" style="min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px;position:relative;">' +
            '<div id="str-tree-' + suffix + '" style="display:flex;flex-direction:column;align-items:center;gap:0;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>' +
            '<div id="str-status-' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">다음 버튼을 눌러 시작하세요</div>' +
            '</div>' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">삽입된 단어</div>' +
            '<div id="str-words-' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">없음</div>' +
            '</div>' +
            '</div>' +
            self._createStepDesc(suffix) +
            self._createStepControls(suffix) +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span class="str-char-box" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">R</span> 기존 노드</span>' +
            '<span><span class="str-char-box comparing" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">A</span> 현재 방문 중</span>' +
            '<span><span class="str-char-box matched" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">N</span> 새로 생성</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--green);vertical-align:middle;"></span> 단어 끝 (is_end)</span>' +
            '</div>';

        var treeEl = container.querySelector('#str-tree-' + suffix);
        var statusEl = container.querySelector('#str-status-' + suffix);
        var wordsEl = container.querySelector('#str-words-' + suffix);

        var nodeIdCounter = 0;
        function makeNode(ch) {
            return { ch: ch, children: {}, is_end: false, id: 'tn-' + (nodeIdCounter++) };
        }

        function renderTrie(root, highlightIds, newIds, endIds) {
            highlightIds = highlightIds || {};
            newIds = newIds || {};
            endIds = endIds || {};

            function renderNode(node) {
                var childKeys = Object.keys(node.children).sort();
                var isHighlight = highlightIds[node.id];
                var isNew = newIds[node.id];
                var isEnd = node.is_end || endIds[node.id];

                var cls = 'str-char-box';
                if (isNew) cls += ' matched';
                else if (isHighlight) cls += ' comparing';

                var label = node.ch === '' ? 'root' : node.ch;
                var endMarker = isEnd ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-left:4px;vertical-align:middle;" title="단어 끝"></span>' : '';

                var html = '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div class="' + cls + '" style="min-width:36px;min-height:36px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:0.95rem;position:relative;" data-node-id="' + node.id + '">' + label + endMarker + '</div>';

                if (childKeys.length > 0) {
                    html += '<div style="width:2px;height:16px;background:var(--border);"></div>';
                    html += '<div style="display:flex;gap:12px;align-items:flex-start;">';
                    childKeys.forEach(function(k) {
                        html += renderNode(node.children[k]);
                    });
                    html += '</div>';
                }

                html += '</div>';
                return html;
            }

            return renderNode(root);
        }

        var words = ['cat', 'car', 'card'];
        var rootBuild = makeNode('');
        var allSteps = [];
        var doneWords = [];

        var initialHTML = renderTrie(rootBuild, {}, {}, {});

        words.forEach(function(word) {
            var wordCopy = word;
            var beforeHTML = renderTrie(rootBuild, {}, {}, {});
            var beforeWordsHTML = doneWords.length > 0
                ? doneWords.map(function(w) { return '<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">' + w + '</span>'; }).join(' ')
                : '없음';

            allSteps.push({
                description: '"' + wordCopy + '"를 삽입합니다.',
                treeHTML: beforeHTML,
                statusHTML: '<strong>"' + wordCopy + '"</strong> 삽입을 시작합니다.',
                wordsHTML: beforeWordsHTML
            });

            var node = rootBuild;
            for (var i = 0; i < word.length; i++) {
                var ch = word[i];
                var isNew = !(ch in node.children);
                var lettersSoFar = word.substring(0, i + 1);

                if (isNew) {
                    node.children[ch] = makeNode(ch);
                }

                var currentNodeId = node.children[ch].id;
                var hl = {};
                hl[currentNodeId] = true;
                var nw = {};
                if (isNew) nw[currentNodeId] = true;

                var snapHTML = renderTrie(rootBuild, hl, isNew ? nw : {}, {});
                var descText = isNew
                    ? '"' + wordCopy + '": \'' + ch + '\' 노드를 새로 생성합니다. (경로: ' + lettersSoFar + ')'
                    : '"' + wordCopy + '": \'' + ch + '\' 노드가 이미 있습니다. 재사용합니다. (경로: ' + lettersSoFar + ')';
                var statHTML = isNew
                    ? '<span style="color:var(--green);">\'' + ch + '\' 노드 생성!</span> (' + lettersSoFar + ')'
                    : '<span style="color:var(--yellow);">\'' + ch + '\' 재사용</span> (' + lettersSoFar + ')';

                allSteps.push({
                    description: descText,
                    treeHTML: snapHTML,
                    statusHTML: statHTML,
                    wordsHTML: beforeWordsHTML
                });

                node = node.children[ch];
            }

            node.is_end = true;
            doneWords.push(wordCopy);

            var doneHTML = renderTrie(rootBuild, {}, {}, {});
            var doneWordsHTML = doneWords.map(function(w) { return '<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">' + w + '</span>'; }).join(' ');

            allSteps.push({
                description: '"' + wordCopy + '" 삽입 완료! \'' + word[word.length - 1] + '\' 노드에 is_end 표시를 합니다.',
                treeHTML: doneHTML,
                statusHTML: '<strong style="color:var(--green);">"' + wordCopy + '" 삽입 완료!</strong>',
                wordsHTML: doneWordsHTML
            });
        });

        var finalHTML = renderTrie(rootBuild, {}, {}, {});
        var finalWordsHTML = doneWords.map(function(w) { return '<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">' + w + '</span>'; }).join(' ');
        allSteps.push({
            description: '모든 단어 삽입 완료! "cat", "car", "card"가 "ca" 접두사를 공유합니다.',
            treeHTML: finalHTML,
            statusHTML: '<strong style="color:var(--green);">완료!</strong> "cat", "car", "card" 모두 "ca" 경로를 공유합니다.',
            wordsHTML: finalWordsHTML
        });

        treeEl.innerHTML = initialHTML;

        var vizSteps = [];
        allSteps.forEach(function(snap) {
            vizSteps.push({
                description: snap.description,
                _before: null,
                action: function() {
                    this._before = {
                        tree: treeEl.innerHTML,
                        status: statusEl.innerHTML,
                        words: wordsEl.innerHTML
                    };
                    treeEl.innerHTML = snap.treeHTML;
                    statusEl.innerHTML = snap.statusHTML;
                    wordsEl.innerHTML = snap.wordsHTML;
                },
                undo: function() {
                    treeEl.innerHTML = this._before.tree;
                    statusEl.innerHTML = this._before.status;
                    wordsEl.innerHTML = this._before.words;
                }
            });
        });

        self._initStepController(container, vizSteps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 1: 트라이 구현 (lc-208)
    // ====================================================================
    _renderVizImplement: function(container) {
        var self = this;
        var suffix = '-impl';
        var DEFAULT_WORDS = 'apple, app';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">트라이 구현 시뮬레이션</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">단어를 삽입한 뒤 search/startsWith를 테스트합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">삽입할 단어: <input type="text" id="trie-impl-input" value="' + DEFAULT_WORDS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="trie-impl-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="str-tree' + suffix + '" style="display:flex;flex-direction:column;align-items:center;min-height:180px;margin-bottom:12px;"></div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var treeEl = container.querySelector('#str-tree' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        var nodeIdCounter = 0;
        function makeNode(ch) { return { ch: ch, children: {}, is_end: false, id: 'tn-' + (nodeIdCounter++) }; }

        function renderTrie(root, hlIds, newIds) {
            hlIds = hlIds || {}; newIds = newIds || {};
            function renderNode(node) {
                var keys = Object.keys(node.children).sort();
                var cls = 'str-char-box';
                if (newIds[node.id]) cls += ' matched';
                else if (hlIds[node.id]) cls += ' comparing';
                var label = node.ch === '' ? 'root' : node.ch;
                var endM = node.is_end ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-left:3px;vertical-align:middle;"></span>' : '';
                var html = '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div class="' + cls + '" style="min-width:32px;min-height:32px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;">' + label + endM + '</div>';
                if (keys.length > 0) {
                    html += '<div style="width:2px;height:12px;background:var(--border);"></div>';
                    html += '<div style="display:flex;gap:10px;align-items:flex-start;">';
                    keys.forEach(function(k) { html += renderNode(node.children[k]); });
                    html += '</div>';
                }
                html += '</div>';
                return html;
            }
            return renderNode(root);
        }

        function buildSteps(words) {
            nodeIdCounter = 0;
            var root = makeNode('');
            var steps = [];
            var builtHTML = renderTrie(root, {}, {});
            treeEl.innerHTML = builtHTML;
            infoEl.innerHTML = '<span style="color:var(--text2);">단어를 삽입하고 검색합니다.</span>';

            // Insert words step by step
            words.forEach(function(word) {
                var prevHTML = renderTrie(root, {}, {});
                var node = root;
                for (var i = 0; i < word.length; i++) {
                    var ch = word[i];
                    var isNew = !(ch in node.children);
                    if (isNew) node.children[ch] = makeNode(ch);
                    node = node.children[ch];
                }
                node.is_end = true;
                var afterHTML = renderTrie(root, {}, {});

                (function(word, prevHTML, afterHTML) {
                    steps.push({
                        description: 'insert("' + word + '") — 트라이에 삽입합니다.',
                        action: function() { treeEl.innerHTML = afterHTML; infoEl.innerHTML = '<strong style="color:var(--green);">"' + word + '" 삽입 완료!</strong>'; },
                        undo: function() { treeEl.innerHTML = prevHTML; infoEl.innerHTML = '<span style="color:var(--text2);">단어를 삽입하고 검색합니다.</span>'; }
                    });
                })(word, prevHTML, afterHTML);
            });

            // Build search queries from the inserted words
            var searches = [];
            words.forEach(function(w) {
                searches.push({ word: w, type: 'search', expected: true });
            });
            // Add a prefix-only search (first word minus last char) if possible
            if (words.length > 0 && words[0].length > 1) {
                var prefix = words[0].substring(0, words[0].length - 1);
                // Check if prefix itself was inserted
                var prefixInserted = words.indexOf(prefix) >= 0;
                searches.push({ word: prefix, type: 'search', expected: prefixInserted });
            }
            // Add a startsWith query for common prefix
            if (words.length > 0) {
                var sw = words[0].length > 2 ? words[0].substring(0, 3) : words[0].substring(0, 1);
                searches.push({ word: sw, type: 'startsWith', expected: true });
            }

            // Search/startsWith steps
            var stableHTML = renderTrie(root, {}, {});
            searches.forEach(function(s) {
                // Actually compute the result against the trie
                var node = root;
                var found = true;
                var hlIds = {};
                for (var i = 0; i < s.word.length; i++) {
                    if (!(s.word[i] in node.children)) { found = false; break; }
                    node = node.children[s.word[i]];
                    hlIds[node.id] = true;
                }
                var result;
                if (s.type === 'search') { result = found && node.is_end; }
                else { result = found; }

                var typeLabel = s.type === 'search' ? 'search' : 'startsWith';
                var resultStr = result ? '<span style="color:var(--green);font-weight:700;">True</span>' : '<span style="color:var(--red);font-weight:700;">False</span>';
                var reason = '';
                if (s.type === 'search' && found && !node.is_end) reason = ' (is_end가 False이므로)';
                else if (s.type === 'search' && !found) reason = ' (경로가 없음)';
                else if (s.type === 'startsWith' && result) reason = ' (경로만 있으면 OK)';
                var hlHTML = renderTrie(root, hlIds, {});

                (function(typeLabel, word, result, resultStr, reason, hlHTML, stableHTML) {
                    steps.push({
                        description: typeLabel + '("' + word + '") → ' + (result ? 'True' : 'False') + reason,
                        action: function() { treeEl.innerHTML = hlHTML; infoEl.innerHTML = '<code>' + typeLabel + '("' + word + '")</code> → ' + resultStr + reason; },
                        undo: function() { treeEl.innerHTML = stableHTML; infoEl.innerHTML = '<span style="color:var(--text2);">검색을 시작합니다.</span>'; }
                    });
                })(typeLabel, s.word, result, resultStr, reason, hlHTML, stableHTML);
            });

            return steps;
        }

        function parseAndBuild() {
            var raw = container.querySelector('#trie-impl-input').value;
            var words = raw.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (words.length === 0) words = DEFAULT_WORDS.split(',').map(function(s) { return s.trim(); });
            var steps = buildSteps(words);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#trie-impl-reset').addEventListener('click', function() {
            self._clearVizState();
            parseAndBuild();
        });

        parseAndBuild();
    },

    // ====================================================================
    // 시뮬레이션 2: 문자열 집합 (boj-14425)
    // ====================================================================
    _renderVizStringSet: function(container) {
        var self = this, suffix = '-strset';
        var DEFAULT_SET = 'baekjoon, codeplus, startlink';
        var DEFAULT_QUERIES = 'baekjoon, codeminus, startlink, lucky';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">문자열 집합 시뮬레이션</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">집합 S에 단어를 넣고, 문자열이 집합에 있는지 확인합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">집합 S: <input type="text" id="trie-set-input" value="' + DEFAULT_SET + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<label style="font-weight:600;">검색어: <input type="text" id="trie-set-query" value="' + DEFAULT_QUERIES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="trie-set-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div style="display:flex;gap:24px;margin-bottom:12px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:180px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">집합 S</div>' +
            '<div id="str-set' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px;font-weight:600;"></div></div>' +
            '<div style="flex:1;min-width:180px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">검색 결과</div>' +
            '<div id="str-result' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px;font-weight:600;"></div></div>' +
            '</div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var setEl = container.querySelector('#str-set' + suffix);
        var resultEl = container.querySelector('#str-result' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        function buildSteps(setWords, queries) {
            setEl.innerHTML = '비어있음';
            resultEl.innerHTML = '—';
            infoEl.innerHTML = '<span style="color:var(--text2);">트라이에 단어를 넣고 검색합니다.</span>';

            var setLookup = {};
            setWords.forEach(function(w) { setLookup[w] = true; });

            var insertedSet = [];
            var foundCount = 0;
            var searchResults = [];
            var steps = [];

            // Insert steps
            setWords.forEach(function(w) {
                var prevInserted = insertedSet.slice();
                insertedSet.push(w);
                var afterInserted = insertedSet.slice();

                (function(w, prevInserted, afterInserted) {
                    steps.push({
                        description: '집합 S에 "' + w + '"를 삽입합니다.',
                        action: function() {
                            setEl.innerHTML = afterInserted.map(function(x) { return '<span style="background:var(--accent)15;padding:2px 8px;border-radius:6px;color:var(--accent);">' + x + '</span>'; }).join(' ');
                            infoEl.innerHTML = '<strong>"' + w + '"</strong> 삽입 완료. 집합 크기: ' + afterInserted.length;
                        },
                        undo: function() {
                            setEl.innerHTML = prevInserted.length > 0 ? prevInserted.map(function(x) { return '<span style="background:var(--accent)15;padding:2px 8px;border-radius:6px;color:var(--accent);">' + x + '</span>'; }).join(' ') : '비어있음';
                            infoEl.innerHTML = '<span style="color:var(--text2);">트라이에 단어를 넣고 검색합니다.</span>';
                        }
                    });
                })(w, prevInserted, afterInserted);
            });

            // Search steps
            queries.forEach(function(q) {
                var found = !!setLookup[q];
                var prevResults = searchResults.slice();
                var prevCount = foundCount;
                searchResults.push({ word: q, found: found });
                if (found) foundCount++;
                var afterResults = searchResults.slice();
                var afterCount = foundCount;

                (function(q, found, prevResults, prevCount, afterResults, afterCount) {
                    steps.push({
                        description: 'search("' + q + '") → ' + (found ? 'YES (집합에 있음)' : 'NO (집합에 없음)'),
                        action: function() {
                            resultEl.innerHTML = afterResults.map(function(r) {
                                var bg = r.found ? 'background:var(--green)20;color:var(--green);' : 'background:var(--red)15;color:var(--red);';
                                return '<span style="padding:2px 8px;border-radius:6px;' + bg + '">' + r.word + (r.found ? ' ✓' : ' ✗') + '</span>';
                            }).join(' ');
                            infoEl.innerHTML = '"' + q + '" → ' + (found ? '<span style="color:var(--green);font-weight:700;">있음!</span>' : '<span style="color:var(--red);font-weight:700;">없음</span>') + ' (포함된 수: ' + afterCount + ')';
                        },
                        undo: function() {
                            resultEl.innerHTML = prevResults.length > 0 ? prevResults.map(function(r) {
                                var bg = r.found ? 'background:var(--green)20;color:var(--green);' : 'background:var(--red)15;color:var(--red);';
                                return '<span style="padding:2px 8px;border-radius:6px;' + bg + '">' + r.word + (r.found ? ' ✓' : ' ✗') + '</span>';
                            }).join(' ') : '—';
                            infoEl.innerHTML = '검색 중...';
                        }
                    });
                })(q, found, prevResults, prevCount, afterResults, afterCount);
            });

            // Final step
            var totalFound = foundCount;
            steps.push({
                description: '완료! 집합 S에 포함된 문자열: ' + totalFound + '개',
                action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 정답: ' + totalFound + '개</strong>'; },
                undo: function() { infoEl.innerHTML = '검색 중...'; }
            });

            return steps;
        }

        function parseAndBuild() {
            var rawSet = container.querySelector('#trie-set-input').value;
            var rawQ = container.querySelector('#trie-set-query').value;
            var setWords = rawSet.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            var queries = rawQ.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (setWords.length === 0) setWords = DEFAULT_SET.split(',').map(function(s) { return s.trim(); });
            if (queries.length === 0) queries = DEFAULT_QUERIES.split(',').map(function(s) { return s.trim(); });
            var steps = buildSteps(setWords, queries);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#trie-set-reset').addEventListener('click', function() {
            self._clearVizState();
            parseAndBuild();
        });

        parseAndBuild();
    },

    // ====================================================================
    // 시뮬레이션 3: 전화번호 목록 (boj-5052)
    // ====================================================================
    _renderVizPhoneBook: function(container) {
        var self = this, suffix = '-phone';
        var DEFAULT_NUMBERS = '911, 97625999, 91125426';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">전화번호 목록 — 접두사 판별</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">전화번호를 트라이에 넣으며 접두사 관계를 확인합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">전화번호: <input type="text" id="trie-phone-input" value="' + DEFAULT_NUMBERS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="trie-phone-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="str-tree' + suffix + '" style="display:flex;flex-direction:column;align-items:center;min-height:160px;margin-bottom:12px;overflow-x:auto;"></div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var treeEl = container.querySelector('#str-tree' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        var nodeIdCounter = 0;
        function makeNode(ch) { return { ch: ch, children: {}, is_end: false, id: 'pn-' + (nodeIdCounter++) }; }

        function renderTrie(root, hlIds, alertIds) {
            hlIds = hlIds || {}; alertIds = alertIds || {};
            function renderNode(node) {
                var keys = Object.keys(node.children).sort();
                var cls = 'str-char-box';
                if (alertIds[node.id]) cls += ' matched';
                else if (hlIds[node.id]) cls += ' comparing';
                var label = node.ch === '' ? 'root' : node.ch;
                var endM = node.is_end ? '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green);margin-left:3px;vertical-align:middle;"></span>' : '';
                var html = '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div class="' + cls + '" style="min-width:28px;min-height:28px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">' + label + endM + '</div>';
                if (keys.length > 0) {
                    html += '<div style="width:2px;height:10px;background:var(--border);"></div>';
                    html += '<div style="display:flex;gap:6px;align-items:flex-start;">';
                    keys.forEach(function(k) { html += renderNode(node.children[k]); });
                    html += '</div>';
                }
                html += '</div>';
                return html;
            }
            return renderNode(root);
        }

        function buildSteps(numbers) {
            nodeIdCounter = 0;
            var root = makeNode('');
            var steps = [];
            var consistent = true;

            treeEl.innerHTML = renderTrie(root, {}, {});
            infoEl.innerHTML = '<span style="color:var(--text2);">전화번호를 트라이에 넣으며 접두사 관계를 확인합니다.</span>';

            numbers.forEach(function(num) {
                var prevHTML = renderTrie(root, {}, {});
                var node = root;
                var prefixFound = false;
                for (var i = 0; i < num.length; i++) {
                    var ch = num[i];
                    if (node.is_end) prefixFound = true;
                    if (!(ch in node.children)) node.children[ch] = makeNode(ch);
                    node = node.children[ch];
                }
                node.is_end = true;
                if (Object.keys(node.children).length > 0) prefixFound = true;
                if (prefixFound) consistent = false;

                var afterHTML = renderTrie(root, {}, {});
                var isOk = !prefixFound;

                (function(num, prevHTML, afterHTML, isOk) {
                    steps.push({
                        description: '"' + num + '" 삽입 → ' + (isOk ? '접두사 문제 없음' : '접두사 관계 발견!'),
                        action: function() {
                            treeEl.innerHTML = afterHTML;
                            infoEl.innerHTML = '"' + num + '" 삽입 → ' + (isOk
                                ? '<span style="color:var(--green);">OK</span>'
                                : '<span style="color:var(--red);font-weight:700;">접두사 관계 발견!</span>');
                        },
                        undo: function() {
                            treeEl.innerHTML = prevHTML;
                            infoEl.innerHTML = '<span style="color:var(--text2);">전화번호를 트라이에 넣으며 접두사 관계를 확인합니다.</span>';
                        }
                    });
                })(num, prevHTML, afterHTML, isOk);
            });

            var finalConsistent = consistent;
            steps.push({
                description: '완료! 일관성: ' + (finalConsistent ? 'YES' : 'NO'),
                action: function() {
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:' + (finalConsistent ? 'var(--green)' : 'var(--red)') + ';">✅ 결과: ' + (finalConsistent ? 'YES (일관성 있음)' : 'NO (일관성 없음)') + '</strong>';
                },
                undo: function() { infoEl.innerHTML = '확인 중...'; }
            });

            return steps;
        }

        function parseAndBuild() {
            var raw = container.querySelector('#trie-phone-input').value;
            var numbers = raw.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (numbers.length === 0) numbers = DEFAULT_NUMBERS.split(',').map(function(s) { return s.trim(); });
            var steps = buildSteps(numbers);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#trie-phone-reset').addEventListener('click', function() {
            self._clearVizState();
            parseAndBuild();
        });

        parseAndBuild();
    },

    // ====================================================================
    // 시뮬레이션 4: 최장 공통 접두사 (lc-14)
    // ====================================================================
    _renderVizLCP: function(container) {
        var self = this, suffix = '-lcp';
        var DEFAULT_STRS = 'flower, flow, flight';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">최장 공통 접두사 (LCP)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">문자열의 공통 접두사를 찾습니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">문자열: <input type="text" id="trie-lcp-input" value="' + DEFAULT_STRS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="trie-lcp-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="str-chars' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var charsEl = container.querySelector('#str-chars' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        function buildSteps(strs) {
            function renderChars(colIdx, status) {
                var html = '';
                strs.forEach(function(s) {
                    html += '<div style="display:flex;gap:3px;margin-bottom:6px;align-items:center;">' +
                        '<span style="width:80px;font-size:0.8rem;color:var(--text3);text-align:right;margin-right:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + s + ':</span>';
                    for (var ci = 0; ci < s.length; ci++) {
                        var bg = 'background:var(--bg2);';
                        if (colIdx >= 0 && ci < colIdx) bg = 'background:var(--green)20;border:2px solid var(--green);';
                        if (ci === colIdx && status === 0) bg = 'background:var(--accent);color:white;';
                        if (ci === colIdx && status === 1) bg = 'background:var(--green);color:white;';
                        if (ci === colIdx && status === 2) bg = 'background:var(--red);color:white;';
                        html += '<div style="width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;font-size:0.85rem;' + bg + '">' + s[ci] + '</div>';
                    }
                    html += '</div>';
                });
                charsEl.innerHTML = html;
            }

            renderChars(-1, -1);
            infoEl.innerHTML = '<span style="color:var(--text2);">각 위치의 문자를 비교하여 공통 접두사를 찾습니다.</span>';

            var steps = [];
            if (strs.length === 0) {
                steps.push({
                    description: '빈 배열 — 공통 접두사 없음.',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">빈 배열입니다.</strong>'; },
                    undo: function() { infoEl.innerHTML = '<span style="color:var(--text2);">비교 시작 전</span>'; }
                });
                return steps;
            }

            var minLen = Math.min.apply(null, strs.map(function(s) { return s.length; }));
            var lcpLen = 0;

            for (var col = 0; col < minLen; col++) {
                var ch = strs[0][col];
                var allMatch = strs.every(function(s) { return s[col] === ch; });
                var capturedCol = col;
                var capturedCh = ch;

                if (allMatch) {
                    lcpLen = col + 1;
                    (function(capturedCol, capturedCh, renderChars) {
                        steps.push({
                            description: '위치 ' + capturedCol + ': 모두 \'' + capturedCh + '\' → 일치!',
                            action: function() { renderChars(capturedCol, 1); infoEl.innerHTML = '위치 ' + capturedCol + ': 모두 <strong>\'' + capturedCh + '\'</strong> → <span style="color:var(--green);">일치!</span>'; },
                            undo: function() { renderChars(capturedCol - 1, capturedCol > 0 ? 1 : -1); infoEl.innerHTML = '<span style="color:var(--text2);">비교 중...</span>'; }
                        });
                    })(capturedCol, capturedCh, renderChars);
                } else {
                    (function(capturedCol, renderChars) {
                        steps.push({
                            description: '위치 ' + capturedCol + ': 불일치 발견! 여기서 멈춤.',
                            action: function() { renderChars(capturedCol, 2); infoEl.innerHTML = '위치 ' + capturedCol + ': <span style="color:var(--red);font-weight:700;">불일치!</span> 공통 접두사가 여기서 끝납니다.'; },
                            undo: function() { renderChars(capturedCol - 1, capturedCol > 0 ? 1 : -1); infoEl.innerHTML = '<span style="color:var(--text2);">비교 중...</span>'; }
                        });
                    })(capturedCol, renderChars);
                    break;
                }
            }

            var result = strs[0].substring(0, lcpLen);
            steps.push({
                description: '완료! 최장 공통 접두사: "' + result + '" (길이 ' + lcpLen + ')',
                action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ LCP = "' + result + '" (길이 ' + lcpLen + ')</strong>'; },
                undo: function() { infoEl.innerHTML = '비교 중...'; }
            });

            return steps;
        }

        function parseAndBuild() {
            var raw = container.querySelector('#trie-lcp-input').value;
            var strs = raw.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (strs.length === 0) strs = DEFAULT_STRS.split(',').map(function(s) { return s.trim(); });
            var steps = buildSteps(strs);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#trie-lcp-reset').addEventListener('click', function() {
            self._clearVizState();
            parseAndBuild();
        });

        parseAndBuild();
    },

    // ===== 빈 스텁 =====
    renderProblem: function(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '접두사와 문자열 집합', desc: '공통 접두사, 문자열 집합 확인 (Easy~Silver)', problemIds: ['lc-14', 'boj-14425'] },
        { num: 2, title: '트라이 구현과 응용', desc: '트라이 직접 구현, 접두사 관계 판별 (Medium~Gold)', problemIds: ['lc-208', 'boj-5052'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        {
            id: 'lc-14',
            title: 'LeetCode 14 - Longest Common Prefix',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/longest-common-prefix/',
            simIntro: '문자열을 세로로 비교하여 공통 접두사를 찾는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>문자열 배열에서 가장 긴 공통 접두사(prefix)를 찾으세요. 공통 접두사가 없으면 빈 문자열 ""을 반환합니다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>strs = ["flower","flow","flight"]</pre></div>
                    <div><strong>출력</strong><pre>"fl"</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>strs = ["dog","racecar","car"]</pre></div>
                    <div><strong>출력</strong><pre>""</pre></div>
                </div><p class="example-explain">공통 접두사가 없습니다.</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ strs.length ≤ 200</li>
                    <li>0 ≤ strs[i].length ≤ 200</li>
                    <li>strs[i]는 영어 소문자로만 구성</li>
                </ul>
            `,
            hints: [
                { title: '처음 생각: 첫 문자열과 하나씩 비교', content: '첫 번째 문자열을 기준으로 나머지와 <strong>한 글자씩</strong> 비교하면 어떨까요?<br>i번째 글자를 모든 문자열에서 확인하고, 다른 글자가 나오면 거기까지가 공통 접두사!<br>이 방법은 O(S) (S = 전체 문자 수)로 충분히 빠릅니다.' },
                { title: '더 효율적인 방법은?', content: '문자열 배열을 <strong>사전순 정렬</strong>하면, <strong>첫 번째</strong>와 <strong>마지막</strong> 문자열만 비교하면 돼요!<br>사전순으로 가장 다른 두 문자열의 공통 접두사 = 전체 공통 접두사이기 때문이죠.<br><span class="lang-py">Python: <code>min(strs)</code>와 <code>max(strs)</code>가 사전순 양 끝을 바로 줍니다!</span><span class="lang-cpp">C++: <code>*min_element(strs.begin(), strs.end())</code>와 <code>*max_element(...)</code>로 사전순 양 끝을 구합니다!</span>' },
                { title: '트라이 활용', content: '모든 문자열을 트라이에 넣고, 루트에서 출발합니다.<br><strong>자식이 1개뿐이고 is_end가 아닌</strong> 노드를 따라 쭉 내려가면 — 분기점이나 is_end를 만나는 지점까지가 공통 접두사!<br><br><div style="display:flex;flex-direction:column;align-items:center;gap:2px;margin:10px 0;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.82rem;"><div style="padding:3px 8px;border-radius:12px;border:2px solid var(--green);background:var(--green)15;font-weight:700;color:var(--green);">f</div><div style="width:2px;height:8px;background:var(--green);"></div><div style="padding:3px 8px;border-radius:12px;border:2px solid var(--green);background:var(--green)15;font-weight:700;color:var(--green);">l</div><div style="font-size:0.65rem;color:var(--green);font-weight:600;">↑ 공통 접두사 "fl"</div><div style="display:flex;gap:20px;margin-top:4px;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:2px;height:8px;background:var(--text2);"></div><div style="padding:3px 8px;border-radius:12px;border:1.5px solid var(--accent);font-weight:600;">o</div><div style="font-size:0.6rem;color:var(--text2);">flower, flow</div></div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:2px;height:8px;background:var(--text2);"></div><div style="padding:3px 8px;border-radius:12px;border:1.5px solid var(--accent);font-weight:600;">i</div><div style="font-size:0.6rem;color:var(--text2);">flight</div></div></div><div style="font-size:0.65rem;color:var(--red);font-weight:600;margin-top:4px;">자식 2개 → 여기서 멈춤!</div></div>트라이가 공통 접두사를 "구조적으로" 보여주는 좋은 예시입니다.' }
            ],
            templates: {
                python: 'class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        if not strs:\n            return ""\n        for i in range(len(strs[0])):\n            ch = strs[0][i]\n            for s in strs[1:]:\n                if i >= len(s) or s[i] != ch:\n                    return strs[0][:i]\n        return strs[0]',
                cpp: 'class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        if (strs.empty()) return "";\n        string prefix = strs[0];\n        for (int i = 1; i < strs.size(); i++) {\n            while (strs[i].find(prefix) != 0) {\n                prefix = prefix.substr(0, prefix.size() - 1);\n                if (prefix.empty()) return "";\n            }\n        }\n        return prefix;\n    }\n};'
            },
            solutions: [{
                approach: '세로 스캔',
                description: '첫 번째 문자열의 각 위치를 기준으로 모든 문자열과 비교합니다.',
                timeComplexity: 'O(S) (S = 전체 문자 수)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '예외 처리', desc: '빈 배열이면 공통 접두사가 없으므로 빈 문자열을 반환합니다.', code: 'class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        if not strs:\n            return ""' },
                        { title: '세로 스캔', desc: '첫 문자열의 i번째 글자를 기준으로 나머지와 비교합니다.\n글자가 다르거나 문자열이 짧으면 그 지점까지가 공통 접두사입니다.', code: '        for i in range(len(strs[0])):\n            ch = strs[0][i]\n            for s in strs[1:]:\n                if i >= len(s) or s[i] != ch:\n                    return strs[0][:i]' },
                        { title: '전체 일치 시', desc: '루프를 끝까지 돌았다면 첫 문자열 전체가 공통 접두사입니다.', code: '        return strs[0]' }
                    ],
                    cpp: [
                        { title: '예외 처리', desc: '빈 벡터면 빈 문자열을 즉시 반환합니다.', code: 'class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        if (strs.empty()) return "";' },
                        { title: '접두사 축소법', desc: '첫 문자열을 prefix로 시작.\n각 문자열과 비교하며 안 맞으면 prefix를 줄임.', code: '        string prefix = strs[0];\n        for (int i = 1; i < strs.size(); i++) {\n            while (strs[i].find(prefix) != 0) {\n                prefix = prefix.substr(0, prefix.size() - 1);\n                if (prefix.empty()) return "";\n            }\n        }' },
                        { title: '결과 반환', desc: '모든 문자열과 매칭된 최종 prefix를 반환합니다.', code: '        return prefix;\n    }\n};' }
                    ]
                },
                get templates() { return trieTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-14425',
            title: 'BOJ 14425 - 문자열 집합',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14425',
            simIntro: '트라이에 문자열을 넣고 검색하여 집합 포함 여부를 확인하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>총 N개의 문자열로 이루어진 집합 S가 주어진다. 입력으로 주어지는 M개의 문자열 중에서 집합 S에 포함되어 있는 것이 총 몇 개인지 구하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 문자열의 개수 N과 M (1 &le; N &le; 10,000, 1 &le; M &le; 10,000)이 주어진다. 다음 N개의 줄에는 집합 S에 포함되어 있는 문자열들이 주어진다. 다음 M개의 줄에는 검사해야 하는 문자열들이 주어진다. 입력으로 주어지는 문자열은 알파벳 소문자로만 이루어져 있으며, 길이는 500을 넘지 않는다. 집합 S에 같은 문자열이 여러 번 주어지는 경우는 없다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 M개의 문자열 중에 총 몇 개가 집합 S에 포함되어 있는지 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 11
baekjoononlinejudge
startlink
codeplus
sundaycoding
codingsh
baekjoononlinejudge
codeplus
codeminus
startlink
starlink
sundaycoding
codingsh
codingho
lucky
judge</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div><p class="example-explain">집합 S = {baekjoononlinejudge, startlink, codeplus, sundaycoding, codingsh}이고, 검사할 11개 문자열 중 baekjoononlinejudge, codeplus, startlink, sundaycoding의 4개가 S에 포함됩니다.</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N, M ≤ 10,000</li>
                    <li>문자열 길이 ≤ 500</li>
                    <li>문자열은 소문자로만 구성</li>
                </ul>
            `,
            hints: [
                { title: '처음 생각: 하나씩 비교', content: 'M개 문자열마다 N개 문자열과 하나씩 비교하면 되겠죠?<br>근데 이러면 <strong>O(N × M × L)</strong>이에요. N, M이 각각 10,000이고 문자열이 길면... 꽤 느릴 수 있어요!<br><br><div style="display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin:8px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;"><div style="text-align:center;"><div style="width:28px;height:90px;background:var(--red)40;border:1.5px solid var(--red);border-radius:4px 4px 0 0;"></div><div style="font-size:0.7rem;font-weight:600;color:var(--red);margin-top:4px;">브루트포스</div><div style="font-size:0.6rem;color:var(--text2);">N×M×L</div></div><div style="text-align:center;"><div style="width:28px;height:25px;background:var(--green)40;border:1.5px solid var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.7rem;font-weight:600;color:var(--green);margin-top:4px;">set/trie</div><div style="font-size:0.6rem;color:var(--text2);">(N+M)×L</div></div></div>' },
                { title: '집합(set)으로 O(1) 검색', content: '<span class="lang-py">Python: <code>set()</code>에 N개 문자열을 넣으면 <code>in</code> 연산이 평균 O(L)!</span><span class="lang-cpp">C++: <code>unordered_set</code>에 넣으면 <code>find</code>가 평균 O(L)!</span><br>M개를 검사해도 <strong>O((N+M) × L)</strong>로 충분히 빠릅니다. 간단하고 효율적!' },
                { title: '트라이로도 가능', content: '이 문제는 set으로 간단히 풀 수 있지만, <strong>트라이 구현 연습</strong>에 아주 좋은 문제입니다!<br>N개 문자열을 트라이에 <code>insert</code>한 뒤, M개를 <code>search</code>하여 True인 개수를 세면 됩니다.<br>접두사 활용은 없지만, 기본 insert/search 구현을 확실히 익힐 수 있어요.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\n# 방법 1: set 사용 (간단)\nN, M = map(int, input().split())\nS = set(input().strip() for _ in range(N))\ncount = sum(1 for _ in range(M) if input().strip() in S)\nprint(count)',
                cpp: '#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool is_end = false;\n};\n\nclass Trie {\n    TrieNode* root;\npublic:\n    Trie() { root = new TrieNode(); }\n\n    void insert(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new TrieNode();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }\n\n    bool search(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n};\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    Trie trie;\n    string s;\n    for (int i = 0; i < N; i++) {\n        cin >> s;\n        trie.insert(s);\n    }\n\n    int count = 0;\n    for (int i = 0; i < M; i++) {\n        cin >> s;\n        if (trie.search(s)) count++;\n    }\n    cout << count << endl;\n}'
            },
            solutions: [{
                approach: 'set 또는 트라이',
                description: 'set에 집합 S를 넣고 M개를 검사하거나, 트라이로 insert/search합니다.',
                timeComplexity: 'O((N+M) × L)',
                spaceComplexity: 'O(N × L)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'sys.stdin.readline으로 빠른 입력을 받습니다.\nN개는 집합, M개는 검사할 문자열입니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())' },
                        { title: '집합 생성', desc: 'set에 N개를 넣으면 in 연산이 평균 O(1)입니다.\n트라이보다 간결하지만 원리 학습에는 트라이가 유용합니다.', code: 'S = set(input().strip() for _ in range(N))' },
                        { title: '검사 및 출력', desc: 'M개를 하나씩 집합에 있는지 확인하여 카운트합니다.\nsum + 제너레이터로 간결하게 처리합니다.', code: 'count = sum(1 for _ in range(M) if input().strip() in S)\nprint(count)' }
                    ],
                    cpp: [
                        { title: '입력 + 트라이 준비', desc: 'C++에서는 트라이로 직접 구현하는 연습!', code: '#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool is_end = false;\n};\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);' },
                        { title: '트라이 삽입', desc: 'N개의 문자열을 트라이에 insert합니다.\nchar 배열 + buf[j]로 한 글자씩 순회합니다.', code: '    TrieNode* root = new TrieNode();\n    char buf[501];\n    for (int i = 0; i < N; i++) {\n        scanf("%s", buf);\n        TrieNode* node = root;\n        for (int j = 0; buf[j]; j++) {\n            if (!node->children.count(buf[j]))\n                node->children[buf[j]] = new TrieNode();\n            node = node->children[buf[j]];\n        }\n        node->is_end = true;\n    }' },
                        { title: '검색 및 출력', desc: 'M개를 트라이에서 search하여 is_end인 것만 카운트합니다.\n경로가 끊기면 바로 break하여 불필요한 탐색을 줄입니다.', code: '    int count = 0;\n    for (int i = 0; i < M; i++) {\n        scanf("%s", buf);\n        TrieNode* node = root;\n        bool found = true;\n        for (int j = 0; buf[j]; j++) {\n            if (!node->children.count(buf[j])) { found = false; break; }\n            node = node->children[buf[j]];\n        }\n        if (found && node->is_end) count++;\n    }\n    printf("%d\\n", count);\n}' }
                    ]
                },
                get templates() { return trieTopic.problems[1].templates; }
            }]
        },

        // ===== 2단계: 트라이 응용 =====,
        {
            id: 'lc-208',
            title: 'LeetCode 208 - Implement Trie',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
            simIntro: '트라이에 단어를 삽입하고 search/startsWith가 어떻게 동작하는지 확인하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>트라이(접두사 트리)를 구현하세요. Trie 클래스에는 다음 메서드가 있습니다:</p>
                <ul>
                    <li><code>Trie()</code> - 트라이 객체를 초기화합니다.</li>
                    <li><code>void insert(String word)</code> - 문자열 word를 트라이에 삽입합니다.</li>
                    <li><code>boolean search(String word)</code> - 문자열 word가 트라이에 있으면 true, 없으면 false를 반환합니다.</li>
                    <li><code>boolean startsWith(String prefix)</code> - 이전에 삽입된 문자열 중 접두사 prefix를 가진 것이 있으면 true를 반환합니다.</li>
                </ul>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]</pre></div>
                    <div><strong>출력</strong><pre>[null, null, true, false, true, null, true]</pre></div>
                </div><p class="example-explain">insert("apple") → search("apple") = true, search("app") = false (app은 삽입된 적 없음), startsWith("app") = true (apple이 app으로 시작), insert("app") → search("app") = true</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ word.length, prefix.length ≤ 2,000</li>
                    <li>word와 prefix는 영어 소문자로만 구성</li>
                    <li>insert, search, startsWith 호출은 합쳐서 최대 3 × 10<sup>4</sup>번</li>
                </ul>
            `,
            hints: [
                { title: '가장 단순한 방법: 리스트에 저장', content: '일단 모든 단어를 <strong>리스트</strong>에 저장하면 어떨까요?<br><code>search</code>는 리스트에서 <code>in</code> 연산으로 찾고, <code>startsWith</code>는 for문으로 하나씩 접두사를 비교하면 되겠죠.<br>근데... 단어가 수만 개 쌓이면? search는 O(N), startsWith는 매번 모든 단어를 순회하니까 점점 느려져요!' },
                { title: '접두사를 빠르게 찾으려면?', content: '트라이는 <strong>글자 하나씩 노드로 내려가는 트리 구조</strong>입니다.<br>"apple"과 "app"을 넣으면 "a→p→p" 경로를 <strong>공유</strong>해요.<br><br><div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin:10px 0;padding:12px;background:var(--bg2);border-radius:10px;"><div style="display:flex;align-items:center;gap:0;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;background:var(--accent)15;">root</div></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--green)15;color:var(--green);">a</div></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--green)15;color:var(--green);">p</div></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--yellow);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--yellow)20;box-shadow:0 0 6px var(--yellow);">p</div><span style="font-size:0.65rem;color:var(--yellow);font-weight:600;margin-left:6px;">isEnd (app)</span></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--accent)10;">l</div></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--yellow);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--yellow)20;box-shadow:0 0 6px var(--yellow);">e</div><span style="font-size:0.65rem;color:var(--yellow);font-weight:600;margin-left:6px;">isEnd (apple)</span></div></div>공통 접두사를 공유하니까 메모리도 절약되고, 탐색도 <strong>O(L)</strong> (L = 단어 길이)로 끝나요!<br><div style="display:flex;gap:12px;flex-wrap:wrap;margin:8px 0;"><div style="padding:6px 10px;background:var(--red)12;border:1.5px solid var(--red);border-radius:6px;font-size:0.82rem;text-align:center;"><div style="color:var(--red);font-weight:600;">리스트</div>O(N) 탐색</div><div style="padding:6px 10px;background:var(--green)12;border:1.5px solid var(--green);border-radius:6px;font-size:0.82rem;text-align:center;"><div style="color:var(--green);font-weight:600;">트라이</div>O(L) 탐색</div></div>' },
                { title: '노드 구조 설계', content: '각 노드에는 두 가지가 필요합니다:<br>① <strong>children</strong> — 자식 노드를 저장하는 공간 (다음 글자로 가는 길)<br>② <strong>isEnd</strong> — 이 노드에서 단어가 끝나는지 표시하는 플래그<br><span class="lang-py">Python: <code>children = {}</code> 딕셔너리로 자식 관리. 글자를 키로 사용하면 유연해요.</span><span class="lang-cpp">C++: <code>unordered_map&lt;char, Node*&gt;</code> 또는 <code>Node* children[26]</code> 배열로 자식 관리. 배열이 더 빠르지만, map이 더 유연합니다.</span>' }
            ],
            templates: {
                python: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\n    def search(self, word: str) -> bool:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True',
                cpp: 'class Trie {\n    struct Node {\n        unordered_map<char, Node*> children;\n        bool is_end = false;\n    };\n    Node* root;\npublic:\n    Trie() { root = new Node(); }\n\n    void insert(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new Node();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }\n\n    bool search(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n\n    bool startsWith(string prefix) {\n        Node* node = root;\n        for (char ch : prefix) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return true;\n    }\n};'
            },
            solutions: [{
                approach: '트라이 직접 구현',
                description: 'TrieNode에 children 맵과 is_end 플래그를 두고 insert/search/startsWith를 구현합니다.',
                timeComplexity: 'O(L) per operation',
                spaceComplexity: 'O(총 문자 수)',
                codeSteps: {
                    python: [
                        { title: 'TrieNode 정의', desc: 'children 딕셔너리로 자식 노드를 저장합니다.\nis_end 플래그로 단어의 끝을 표시합니다.', code: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False' },
                        { title: 'Trie 초기화', desc: '빈 루트 노드를 생성합니다.\n모든 삽입/검색은 루트에서 시작합니다.', code: 'class Trie:\n    def __init__(self):\n        self.root = TrieNode()' },
                        { title: 'insert 구현', desc: '한 글자씩 따라가며 없는 노드는 새로 생성합니다.\n마지막 노드에 is_end = True로 단어 끝을 표시합니다.', code: '    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True' },
                        { title: 'search / startsWith', desc: 'search는 경로 끝에서 is_end를 확인합니다.\nstartsWith는 경로 존재만 확인하므로 is_end 무관합니다.', code: '    def search(self, word: str) -> bool:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True' }
                    ],
                    cpp: [
                        { title: 'Node 구조체 정의', desc: 'unordered_map으로 자식 관리.\nPython dict와 동일한 역할.', code: 'class Trie {\n    struct Node {\n        unordered_map<char, Node*> children;\n        bool is_end = false;\n    };\n    Node* root;' },
                        { title: 'Trie 초기화', desc: 'new Node()로 빈 루트 생성.\nPython의 self.root = TrieNode()과 동일합니다.', code: 'public:\n    Trie() { root = new Node(); }' },
                        { title: 'insert 구현', desc: 'count()로 키 존재 확인 → 없으면 new Node().\n->로 포인터 멤버 접근.', code: '    void insert(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new Node();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }' },
                        { title: 'search / startsWith', desc: 'search는 is_end 확인, startsWith는 경로만 확인.', code: '    bool search(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n\n    bool startsWith(string prefix) {\n        Node* node = root;\n        for (char ch : prefix) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return true;\n    }\n};' }
                    ]
                },
                get templates() { return trieTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-5052',
            title: 'BOJ 5052 - 전화번호 목록',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/5052',
            simIntro: '트라이에 전화번호를 넣으며 접두사 관계를 탐지하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>전화번호 목록이 주어진다. 이때, 이 목록이 일관성이 있는지 없는지를 구해야 한다.</p>
                <p>전화번호 목록이 일관성을 유지하려면, 한 번호가 다른 번호의 접두어인 경우가 없어야 한다. 예를 들어, 긴급전화가 911이고, 선영이의 집 전화번호가 91125426이면 선영이에게 전화를 걸 수 없다. 911을 누르는 순간 긴급전화가 걸리기 때문이다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 테스트 케이스의 수 t(1 &le; t &le; 50)가 주어진다. 각 테스트 케이스의 첫째 줄에는 전화번호의 수 n(1 &le; n &le; 10,000)이 주어진다. 다음 n개의 줄에는 목록에 포함되어 있는 전화번호가 하나씩 주어진다. 전화번호의 길이는 최대 10자리이며, 목록에 같은 전화번호가 중복해서 들어있는 경우는 없다.</p>
                <h4>출력</h4>
                <p>각 테스트 케이스에 대해서, 일관성 있는 목록인 경우에는 "YES", 그렇지 않은 경우에는 "NO"를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2
3
911
97625999
91125426
5
113
12340
123440
12345
98346</pre></div>
                    <div><strong>출력</strong><pre>NO
YES</pre></div>
                </div><p class="example-explain">첫 번째 케이스: 911이 91125426의 접두어이므로 일관성 없음(NO). 두 번째 케이스: 어떤 번호도 다른 번호의 접두어가 아니므로 일관성 있음(YES).</p></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ t ≤ 50 (테스트 케이스 수)</li>
                    <li>1 ≤ n ≤ 10,000 (전화번호 수)</li>
                    <li>전화번호 길이 ≤ 10</li>
                    <li>전화번호는 숫자로만 구성</li>
                </ul>
            `,
            hints: [
                { title: '처음 생각: 모든 쌍 비교', content: 'N개 번호 중 하나가 다른 것의 접두어인지 확인하려면... 모든 쌍을 비교하면 되겠죠?<br>근데 이러면 <strong>O(N<sup>2</sup> × L)</strong>이에요. N이 10,000이면 1억 번 비교... 느려요!' },
                { title: '정렬하면 인접한 것만 비교!', content: '<strong>사전순 정렬</strong>하면 접두어 관계는 반드시 <strong>인접한 번호 사이</strong>에만 존재합니다!<br>예: ["911", "91125426", "97625999"] → 911과 91125426이 나란히 오죠.<br>정렬 후 이웃한 쌍만 비교하면 <strong>O(N log N × L)</strong>로 해결!' },
                { title: '트라이로 접두어 판별', content: '번호를 하나씩 트라이에 삽입하면서 접두어 관계를 바로 탐지할 수 있어요!<br><br><div style="display:flex;gap:16px;flex-wrap:wrap;margin:10px 0;"><div style="flex:1;min-width:140px;padding:10px;border:2px solid var(--red);border-radius:8px;background:var(--red)06;"><div style="font-size:0.75rem;font-weight:700;color:var(--red);margin-bottom:6px;">① 경로에 isEnd 발견</div><div style="display:flex;align-items:center;gap:4px;font-size:0.8rem;"><span style="padding:3px 6px;border-radius:4px;border:1.5px solid var(--green);background:var(--green)15;font-weight:600;">9</span><span>→</span><span style="padding:3px 6px;border-radius:4px;border:1.5px solid var(--green);background:var(--green)15;font-weight:600;">1</span><span>→</span><span style="padding:3px 6px;border-radius:4px;border:2px solid var(--yellow);background:var(--yellow)25;font-weight:700;box-shadow:0 0 4px var(--yellow);">1</span><span>→</span><span style="padding:3px 6px;border-radius:4px;border:1.5px dashed var(--text2);color:var(--text2);">2...</span></div><div style="font-size:0.68rem;color:var(--red);margin-top:4px;">911이 91125426의 접두어!</div></div><div style="flex:1;min-width:140px;padding:10px;border:2px solid var(--red);border-radius:8px;background:var(--red)06;"><div style="font-size:0.75rem;font-weight:700;color:var(--red);margin-bottom:6px;">② 끝 노드에 자식 존재</div><div style="display:flex;align-items:center;gap:4px;font-size:0.8rem;"><span style="padding:3px 6px;border-radius:4px;border:1.5px solid var(--green);background:var(--green)15;font-weight:600;">9</span><span>→</span><span style="padding:3px 6px;border-radius:4px;border:1.5px solid var(--green);background:var(--green)15;font-weight:600;">1</span><span>→</span><span style="padding:3px 6px;border-radius:4px;border:2px solid var(--yellow);background:var(--yellow)25;font-weight:700;box-shadow:0 0 4px var(--yellow);">1</span></div><div style="font-size:0.68rem;color:var(--red);margin-top:4px;">자식(2,5...)이 있으면 접두어!</div></div></div>두 방향 모두 체크하는 게 핵심입니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nclass TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        """삽입하면서 접두사 관계 확인. 문제 있으면 False 반환"""\n        node = self.root\n        prefix_found = False\n        for ch in word:\n            if node.is_end:\n                prefix_found = True\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n        if len(node.children) > 0:\n            prefix_found = True\n        return not prefix_found\n\nt = int(input())\nfor _ in range(t):\n    n = int(input())\n    trie = Trie()\n    numbers = [input().strip() for _ in range(n)]\n    consistent = True\n    for num in numbers:\n        if not trie.insert(num):\n            consistent = False\n    print("YES" if consistent else "NO")',
                cpp: '#include <cstdio>\n#include <cstring>\n#include <string>\n#include <vector>\nusing namespace std;\n\nstruct TrieNode {\n    TrieNode* children[10] = {};\n    bool is_end = false;\n};\n\nbool insert(TrieNode* root, const string& s) {\n    TrieNode* node = root;\n    bool ok = true;\n    for (char ch : s) {\n        int idx = ch - \'0\';\n        if (node->is_end) ok = false;\n        if (!node->children[idx])\n            node->children[idx] = new TrieNode();\n        node = node->children[idx];\n    }\n    node->is_end = true;\n    for (int i = 0; i < 10; i++)\n        if (node->children[i]) ok = false;\n    return ok;\n}\n\nvoid deleteTrie(TrieNode* node) {\n    for (int i = 0; i < 10; i++)\n        if (node->children[i]) deleteTrie(node->children[i]);\n    delete node;\n}\n\nint main() {\n    int t;\n    scanf("%d", &t);\n    while (t--) {\n        int n;\n        scanf("%d", &n);\n        TrieNode* root = new TrieNode();\n        vector<string> nums(n);\n        bool ok = true;\n        for (int i = 0; i < n; i++) {\n            char buf[11];\n            scanf("%s", buf);\n            nums[i] = buf;\n        }\n        for (auto& s : nums) {\n            if (!insert(root, s)) ok = false;\n        }\n        puts(ok ? "YES" : "NO");\n        deleteTrie(root);\n    }\n}'
            },
            solutions: [{
                approach: '트라이 삽입 + 접두사 체크',
                description: '삽입 중 is_end 노드를 만나거나 삽입 후 자식이 있으면 접두사 관계입니다.',
                timeComplexity: 'O(N × L)',
                spaceComplexity: 'O(N × L)',
                codeSteps: {
                    python: [
                        { title: 'TrieNode + Trie 정의', desc: '기본 트라이 구조를 정의합니다.\ninsert 시 접두사 관계를 동시에 탐지하는 것이 핵심입니다.', code: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()' },
                        { title: 'insert + 접두사 판별', desc: '경로 중간에 is_end를 만나면 기존 번호가 접두사입니다.\n삽입 후 자식이 있으면 현재 번호가 다른 번호의 접두사입니다.', code: '    def insert(self, word):\n        node = self.root\n        prefix_found = False\n        for ch in word:\n            if node.is_end:\n                prefix_found = True\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n        if len(node.children) > 0:\n            prefix_found = True\n        return not prefix_found' },
                        { title: '테스트 케이스 처리', desc: '각 테스트 케이스마다 새 트라이를 만들어 번호를 삽입합니다.\n하나라도 접두사 관계가 발견되면 NO를 출력합니다.', code: 't = int(input())\nfor _ in range(t):\n    n = int(input())\n    trie = Trie()\n    numbers = [input().strip() for _ in range(n)]\n    consistent = True\n    for num in numbers:\n        if not trie.insert(num):\n            consistent = False\n    print("YES" if consistent else "NO")' }
                    ],
                    cpp: [
                        { title: 'TrieNode 정의', desc: '숫자 0~9만 → children[10] 배열로 충분.\nmap 대신 배열이라 더 빠름!', code: 'struct TrieNode {\n    TrieNode* children[10] = {};\n    bool is_end = false;\n};' },
                        { title: 'insert + 접두사 판별', desc: '경로 중 is_end 발견 → 접두사 관계.\n삽입 후 자식 존재 → 현재가 접두사.', code: 'bool insert(TrieNode* root, const string& s) {\n    TrieNode* node = root;\n    bool ok = true;\n    for (char ch : s) {\n        int idx = ch - \'0\';\n        if (node->is_end) ok = false;  // 경로 중간에 끝 표시!\n        if (!node->children[idx])\n            node->children[idx] = new TrieNode();\n        node = node->children[idx];\n    }\n    node->is_end = true;\n    for (int i = 0; i < 10; i++)\n        if (node->children[i]) ok = false;  // 자식 있으면 내가 접두사!\n    return ok;\n}' },
                        { title: '테스트 케이스 처리', desc: '테스트 케이스마다 새 루트를 생성하여 독립적으로 처리합니다.\ninsert가 false를 반환하면 접두사 관계가 존재합니다.', code: 'int main() {\n    int t; scanf("%d", &t);\n    while (t--) {\n        int n; scanf("%d", &n);\n        TrieNode* root = new TrieNode();\n        bool ok = true;\n        for (int i = 0; i < n; i++) {\n            char buf[11]; scanf("%s", buf);\n            if (!insert(root, string(buf))) ok = false;\n        }\n        puts(ok ? "YES" : "NO");\n    }\n}' }
                    ]
                },
                get templates() { return trieTopic.problems[2].templates; }
            }]
        }
    ]
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.trie = trieTopic;
