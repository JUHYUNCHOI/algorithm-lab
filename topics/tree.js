// ===== 트리 토픽 모듈 =====
var treeTopic = {
    id: 'tree',
    title: '트리',
    icon: '🌳',
    category: '재귀와 트리',
    order: 9,
    description: '계층 구조를 표현하는 트리와 다양한 순회 방법을 배웁니다',
    relatedNote: '이 외에도 이진 탐색 트리(BST), 세그먼트 트리, AVL/레드블랙 트리 등의 심화 트리 자료구조가 있습니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'lc-104':   { type: 'DFS/재귀',   color: 'var(--accent)', vizMethod: '_renderVizMaxDepth',      suffix: '-depth' },
        'lc-226':   { type: '트리 변환',   color: 'var(--green)',  vizMethod: '_renderVizInvert',        suffix: '-invert' },
        'lc-102':   { type: 'BFS',         color: '#e17055',       vizMethod: '_renderVizLevelOrder',    suffix: '-level' },
        'boj-1991': { type: '트리 순회',   color: '#6c5ce7',       vizMethod: '_renderVizTreeTraversal', suffix: '-order' }
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
            sim:     { intro: prob.simIntro || '트리가 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
        container.appendChild(contentDiv);
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
                <h2>🌳 트리 (Tree)</h2>\
                <p class="hero-sub">계층 구조를 표현하는 트리 자료구조와 순회 방법을 배웁니다</p>\
            </div>\
\
            <!-- ① 트리란? -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> 트리란?</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 여러분의 <strong>가족 관계도</strong>를 떠올려 보세요!<br><br>\
                    맨 위에 <strong>할아버지(루트)</strong>가 계시고, 아래로 <strong>아버지, 삼촌(자식 노드)</strong>이 있습니다.<br>\
                    아버지 아래에는 <strong>나와 동생(손자 노드)</strong>이 있고요.<br>\
                    더 이상 아래에 아무도 없는 사람이 <strong>리프(잎) 노드</strong>입니다.<br><br>\
                    이렇게 위에서 아래로 뻗어 나가는 구조가 바로 <strong>트리</strong>입니다!<br>\
                    폴더 구조, 조직도, HTML DOM 모두 트리입니다.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="14" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="21" y1="14" x2="16" y2="26" stroke="currentColor" stroke-width="2"/><line x1="27" y1="14" x2="32" y2="26" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>노드(Node)와 간선(Edge)</h3>\
                        <p>노드는 데이터를 담는 점이고, 간선은 노드 사이를 연결하는 줄입니다.<br>N개의 노드가 있으면 간선은 <strong>N-1개</strong>입니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="5" fill="#e17055" stroke="currentColor" stroke-width="2"/><text x="24" y="11" text-anchor="middle" font-size="8" fill="white">R</text><circle cx="14" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="24" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="24" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>루트(Root)</h3>\
                        <p>트리의 <strong>가장 꼭대기</strong>에 있는 노드입니다.<br>부모가 없는 유일한 노드입니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="42" r="4" fill="#00b894" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="42" r="4" fill="#00b894" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="24" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="24" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="31" x2="9" y2="38" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="31" x2="19" y2="38" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>리프(Leaf)</h3>\
                        <p>자식이 없는 노드를 <strong>리프(잎)</strong> 노드라고 합니다.<br>트리의 맨 끝 노드들입니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="8" y="20" width="32" height="24" rx="4" fill="none" stroke="#0984e3" stroke-width="2" stroke-dasharray="4,2"/><circle cx="14" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="42" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="20" cy="42" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="21" y1="12" x2="16" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="33" x2="9" y2="39" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="33" x2="19" y2="39" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>서브트리(Subtree)</h3>\
                        <p>어떤 노드를 루트로 하는 <strong>부분 트리</strong>입니다.<br>트리의 재귀적 성질을 이용할 때 핵심입니다!</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">노드가 7개인 트리에서 간선은 몇 개일까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>6개</strong>입니다!<br>\
                        트리에서 노드가 N개이면 간선은 항상 <strong>N-1개</strong>입니다.<br>\
                        루트를 제외한 모든 노드는 정확히 하나의 부모와 연결되기 때문입니다.\
                    </div>\
                </div>\
            </div>\
\
            <!-- ② 이진 트리 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> 이진 트리</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> <strong>"예/아니오 퀴즈"</strong>를 생각해 보세요!<br><br>\
                    "동물인가요?" → 예 → "날 수 있나요?" → 아니오 → "다리가 4개인가요?" → ...<br>\
                    매 질문마다 <strong>왼쪽(예) 또는 오른쪽(아니오)</strong>, 두 갈래로 나뉩니다.<br><br>\
                    이렇게 각 노드가 <strong>최대 2개의 자식</strong>만 가지는 트리를 <strong>이진 트리</strong>라고 합니다!<br>\
                    알고리즘에서 가장 많이 다루는 트리 형태입니다.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="14" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="21" y1="14" x2="16" y2="26" stroke="currentColor" stroke-width="2"/><line x1="27" y1="14" x2="32" y2="26" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>이진 트리</h3>\
                        <p>각 노드가 <strong>최대 2개</strong>의 자식(왼쪽, 오른쪽)을 가집니다.<br>가장 기본적인 트리 형태입니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="6" r="4" fill="currentColor" opacity="0.7"/><circle cx="14" cy="20" r="4" fill="currentColor" opacity="0.7"/><circle cx="34" cy="20" r="4" fill="currentColor" opacity="0.7"/><circle cx="8" cy="34" r="4" fill="currentColor" opacity="0.7"/><circle cx="20" cy="34" r="4" fill="currentColor" opacity="0.7"/><circle cx="28" cy="34" r="4" fill="currentColor" opacity="0.7"/><line x1="21" y1="9" x2="16" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="9" x2="32" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="23" x2="9" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="23" x2="19" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="31" y1="23" x2="29" y2="31" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>완전 이진 트리</h3>\
                        <p>마지막 레벨을 제외하고 모든 레벨이 꽉 차 있으며,<br>마지막 레벨은 <strong>왼쪽부터</strong> 채웁니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="6" r="4" fill="currentColor" opacity="0.8"/><circle cx="14" cy="20" r="4" fill="currentColor" opacity="0.8"/><circle cx="34" cy="20" r="4" fill="currentColor" opacity="0.8"/><circle cx="8" cy="34" r="4" fill="currentColor" opacity="0.8"/><circle cx="20" cy="34" r="4" fill="currentColor" opacity="0.8"/><circle cx="28" cy="34" r="4" fill="currentColor" opacity="0.8"/><circle cx="40" cy="34" r="4" fill="currentColor" opacity="0.8"/><line x1="21" y1="9" x2="16" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="9" x2="32" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="23" x2="9" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="23" x2="19" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="31" y1="23" x2="29" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="37" y1="23" x2="39" y2="31" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>포화 이진 트리</h3>\
                        <p>모든 레벨이 <strong>완전히</strong> 채워진 트리입니다.<br>높이 h일 때 노드 수 = <strong>2^(h+1) - 1</strong></p>\
                    </div>\
                </div>\
\
                <div class="code-block"><pre><code class="language-python"># 이진 트리 노드 정의\n\
class TreeNode:\n\
    def __init__(self, val=0, left=None, right=None):\n\
        self.val = val\n\
        self.left = left    # 왼쪽 자식\n\
        self.right = right  # 오른쪽 자식\n\
\n\
# 높이가 h인 이진 트리의 최대 노드 수: 2^(h+1) - 1\n\
# 노드가 N개인 완전 이진 트리의 높이: O(log N)\n\
# 예) N = 1,000,000이면 높이 ≈ 20 (아주 낮습니다!)</code></pre></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">높이가 3인 포화 이진 트리의 노드 수는 몇 개일까요? (루트의 높이 = 0)</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>15개</strong>입니다!<br>\
                        높이 h인 포화 이진 트리의 노드 수 = 2^(h+1) - 1 = 2^4 - 1 = <strong>15</strong><br>\
                        레벨 0: 1개, 레벨 1: 2개, 레벨 2: 4개, 레벨 3: 8개 → 합계 15개입니다.\
                    </div>\
                </div>\
            </div>\
\
            <!-- ③ 트리 순회 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> 트리 순회</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> <strong>미술관 관람</strong>을 생각해 보세요!<br><br>\
                    미술관의 각 방(노드)을 어떤 순서로 돌지에 따라 방법이 달라집니다.<br>\
                    <strong>전위(Preorder)</strong>: 방에 들어가자마자 <strong>먼저 감상</strong>하고, 왼쪽 방 → 오른쪽 방으로 이동합니다.<br>\
                    <strong>중위(Inorder)</strong>: 왼쪽 방을 먼저 보고, <strong>돌아와서 감상</strong>한 후, 오른쪽 방으로 갑니다.<br>\
                    <strong>후위(Postorder)</strong>: 왼쪽, 오른쪽 방을 다 보고 <strong>마지막에 감상</strong>합니다.<br>\
                    <strong>레벨(BFS)</strong>: 1층 방을 다 보고, 2층, 3층... 순서대로 봅니다.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card" style="border-color: var(--accent);">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="var(--accent)" opacity="0.8"/><text x="24" y="13" text-anchor="middle" font-size="8" fill="white">1</text><circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="14" y="33" text-anchor="middle" font-size="8" fill="currentColor">2</text><circle cx="34" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="33" text-anchor="middle" font-size="8" fill="currentColor">3</text><line x1="20" y1="15" x2="16" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="32" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>전위 순회 (Preorder)</h3>\
                        <p><strong>루트 → 왼쪽 → 오른쪽</strong><br>부모를 먼저 방문합니다.<br>트리 복사, 직렬화에 사용됩니다.</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--green);">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="13" text-anchor="middle" font-size="8" fill="currentColor">2</text><circle cx="14" cy="30" r="6" fill="var(--green)" opacity="0.8"/><text x="14" y="33" text-anchor="middle" font-size="8" fill="white">1</text><circle cx="34" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="33" text-anchor="middle" font-size="8" fill="currentColor">3</text><line x1="20" y1="15" x2="16" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="32" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>중위 순회 (Inorder)</h3>\
                        <p><strong>왼쪽 → 루트 → 오른쪽</strong><br>BST에서 <strong>정렬된 순서</strong>로 출력됩니다!<br>가장 자주 나오는 순회입니다.</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--yellow);">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="13" text-anchor="middle" font-size="8" fill="currentColor">3</text><circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="14" y="33" text-anchor="middle" font-size="8" fill="currentColor">1</text><circle cx="34" cy="30" r="6" fill="var(--yellow)" opacity="0.8"/><text x="34" y="33" text-anchor="middle" font-size="8" fill="white">2</text><line x1="20" y1="15" x2="16" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="32" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>후위 순회 (Postorder)</h3>\
                        <p><strong>왼쪽 → 오른쪽 → 루트</strong><br>자식을 먼저 처리한 후 부모를 처리합니다.<br>트리 삭제, 수식 평가에 사용됩니다.</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--red);">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="5" fill="var(--red)" opacity="0.7"/><text x="24" y="11" text-anchor="middle" font-size="7" fill="white">1</text><circle cx="14" cy="24" r="5" fill="var(--red)" opacity="0.5"/><text x="14" y="27" text-anchor="middle" font-size="7" fill="white">2</text><circle cx="34" cy="24" r="5" fill="var(--red)" opacity="0.5"/><text x="34" y="27" text-anchor="middle" font-size="7" fill="white">2</text><circle cx="8" cy="40" r="5" fill="var(--red)" opacity="0.3"/><text x="8" y="43" text-anchor="middle" font-size="7" fill="white">3</text><circle cx="20" cy="40" r="5" fill="var(--red)" opacity="0.3"/><text x="20" y="43" text-anchor="middle" font-size="7" fill="white">3</text><line x1="20" y1="12" x2="16" y2="20" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="12" x2="32" y2="20" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="28" x2="9" y2="36" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="28" x2="19" y2="36" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>레벨 순회 (BFS)</h3>\
                        <p><strong>레벨 0 → 레벨 1 → 레벨 2 → ...</strong><br>큐(Queue)를 사용합니다.<br>레벨별 처리가 필요할 때 사용합니다.</p>\
                    </div>\
                </div>\
\
                <div class="code-block"><pre><code class="language-python"># 전위 순회 (Preorder): 루트 → 왼쪽 → 오른쪽\n\
def preorder(node):\n\
    if node is None:\n\
        return\n\
    print(node.val, end=\' \')  # 루트 먼저!\n\
    preorder(node.left)\n\
    preorder(node.right)\n\
\n\
# 중위 순회 (Inorder): 왼쪽 → 루트 → 오른쪽\n\
def inorder(node):\n\
    if node is None:\n\
        return\n\
    inorder(node.left)\n\
    print(node.val, end=\' \')  # 중간에!\n\
    inorder(node.right)\n\
\n\
# 후위 순회 (Postorder): 왼쪽 → 오른쪽 → 루트\n\
def postorder(node):\n\
    if node is None:\n\
        return\n\
    postorder(node.left)\n\
    postorder(node.right)\n\
    print(node.val, end=\' \')  # 마지막에!\n\
\n\
# 레벨 순회 (BFS): 큐 사용\n\
from collections import deque\n\
def level_order(root):\n\
    if not root:\n\
        return\n\
    queue = deque([root])\n\
    while queue:\n\
        node = queue.popleft()\n\
        print(node.val, end=\' \')\n\
        if node.left:  queue.append(node.left)\n\
        if node.right: queue.append(node.right)</code></pre></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">이진 트리 [1, 2, 3, 4, 5, 6, 7]의 중위 순회 결과는 무엇일까요? (1이 루트, 2/3이 자식, 4/5/6/7이 손자)</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        중위 순회 (왼쪽 → 루트 → 오른쪽) 결과: <strong>4 2 5 1 6 3 7</strong><br><br>\
                        왼쪽 서브트리(4→2→5)를 먼저 방문하고, 루트(1), 오른쪽 서브트리(6→3→7)를 방문합니다.<br>\
                        전위 순회: 1 2 4 5 3 6 7 | 후위 순회: 4 5 2 6 7 3 1\
                    </div>\
                </div>\
            </div>\
\
            <!-- ④ 트리 활용 패턴 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> 트리 활용 패턴</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="36" r="4" fill="#0984e3" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="25" x2="9" y2="33" stroke="#0984e3" stroke-width="2.5"/><path d="M4 42 L8 36 L12 42" fill="none" stroke="#0984e3" stroke-width="2"/></svg></span></div>\
                        <h3>깊이 구하기 (DFS)</h3>\
                        <p>루트에서 리프까지의 <strong>깊이</strong>를 DFS로 구합니다.<br><code>depth(node) = 1 + max(depth(left), depth(right))</code></p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="36" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="36" r="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="25" x2="9" y2="33" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="25" x2="19" y2="33" stroke="currentColor" stroke-width="1.5"/><text x="40" y="10" font-size="10" fill="var(--accent)">h=2</text></svg></span></div>\
                        <h3>최대 깊이</h3>\
                        <p>트리의 <strong>가장 깊은 리프</strong>까지의 거리입니다.<br>재귀로 왼쪽/오른쪽 중 큰 값 + 1</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="30" r="5" fill="none" stroke="#e17055" stroke-width="2"/><circle cx="34" cy="30" r="5" fill="none" stroke="#0984e3" stroke-width="2"/><path d="M17 28 L31 32" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="3,2"/><path d="M31 28 L17 32" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="3,2"/><line x1="20" y1="14" x2="16" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="14" x2="32" y2="26" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>트리 뒤집기 (Invert)</h3>\
                        <p>모든 노드에서 <strong>왼쪽 ↔ 오른쪽</strong> 교환!<br>재귀로 간단하게 구현할 수 있습니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="#fdcb6e" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="36" r="4" fill="#e17055" stroke="currentColor" stroke-width="2"/><circle cx="40" cy="36" r="4" fill="#0984e3" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="25" x2="9" y2="33" stroke="currentColor" stroke-width="1.5"/><line x1="37" y1="25" x2="39" y2="33" stroke="currentColor" stroke-width="1.5"/><path d="M10 40 L24 12 L38 40" fill="none" stroke="var(--yellow)" stroke-width="1.5" stroke-dasharray="3,2"/></svg></span></div>\
                        <h3>LCA (최소 공통 조상)</h3>\
                        <p>두 노드의 <strong>가장 가까운 공통 조상</strong>을 찾습니다.<br>재귀적으로 양쪽 서브트리를 탐색합니다.</p>\
                    </div>\
                </div>\
\
                <div class="code-block"><pre><code class="language-python"># 최대 깊이 구하기\n\
def maxDepth(root):\n\
    if not root:\n\
        return 0\n\
    return 1 + max(maxDepth(root.left), maxDepth(root.right))\n\
\n\
# 트리 뒤집기\n\
def invertTree(root):\n\
    if not root:\n\
        return None\n\
    root.left, root.right = root.right, root.left  # 좌우 교환!\n\
    invertTree(root.left)\n\
    invertTree(root.right)\n\
    return root\n\
\n\
# LCA (최소 공통 조상) - 이진 트리\n\
def lowestCommonAncestor(root, p, q):\n\
    if not root or root == p or root == q:\n\
        return root\n\
    left = lowestCommonAncestor(root.left, p, q)\n\
    right = lowestCommonAncestor(root.right, p, q)\n\
    if left and right:   # 양쪽 다 발견 → 현재 노드가 LCA\n\
        return root\n\
    return left or right  # 한쪽에서만 발견</code></pre></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">트리 [1, 2, 3, 4, 5]에서 노드 4와 5의 LCA(최소 공통 조상)는 무엇일까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>노드 2</strong>입니다!<br>\
                        노드 4는 2의 왼쪽 자식, 노드 5는 2의 오른쪽 자식입니다.<br>\
                        노드 2에서 양쪽 서브트리에서 각각 하나씩 발견되므로, 2가 LCA입니다.\
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
    },

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState: function() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls: function(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ 이전</button>' +
            '<span id="str-indicator-' + suffix + '">시작 전</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _initStepController: function(container, steps, suffix) {
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
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
        }
        nextBtn.addEventListener('click', function() {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; state.steps[state.currentStep].action(); updateUI();
        });
        prevBtn.addEventListener('click', function() {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo(); state.currentStep--; updateUI();
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
    // 시뮬레이션 1: Maximum Depth (lc-104)
    // ====================================================================
    _renderVizMaxDepth: function(container) {
        var self = this;
        var suffix = '-depth';
        // Tree: [3, 9, 20, null, null, 15, 7]
        var nodes = {
            3:  { x: 200, y: 40,  l: 9,    r: 20 },
            9:  { x: 100, y: 110, l: null,  r: null },
            20: { x: 300, y: 110, l: 15,    r: 7 },
            15: { x: 240, y: 180, l: null,  r: null },
            7:  { x: 360, y: 180, l: null,  r: null }
        };
        var edges = [[3,9],[3,20],[20,15],[20,7]];

        function makeSvg(highlights, depthLabels) {
            var svg = '<svg viewBox="0 0 460 220" width="100%" height="220">';
            edges.forEach(function(e) {
                svg += '<line x1="' + nodes[e[0]].x + '" y1="' + nodes[e[0]].y + '" x2="' + nodes[e[1]].x + '" y2="' + nodes[e[1]].y + '" stroke="var(--border)" stroke-width="2"/>';
            });
            var keys = [3, 9, 20, 15, 7];
            keys.forEach(function(k) {
                var n = nodes[k];
                var hl = highlights[k] || '';
                var fill = hl === 'active' ? 'var(--accent)' : hl === 'done' ? 'var(--green)' : 'var(--bg2)';
                var textFill = (hl === 'active' || hl === 'done') ? 'white' : 'var(--text)';
                svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="22" fill="' + fill + '" stroke="var(--border)" stroke-width="2"/>';
                svg += '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle" font-size="14" font-weight="600" fill="' + textFill + '">' + k + '</text>';
                if (depthLabels[k] !== undefined) {
                    svg += '<text x="' + (n.x + 28) + '" y="' + (n.y - 8) + '" font-size="11" fill="var(--accent)" font-weight="600">d=' + depthLabels[k] + '</text>';
                }
            });
            svg += '</svg>';
            return svg;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Maximum Depth — DFS 재귀</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">트리 [3, 9, 20, null, null, 15, 7]의 최대 깊이를 DFS로 구합니다.</p>' +
            '<div id="depth-svg' + suffix + '">' + makeSvg({}, {}) + '</div>' +
            '<div id="depth-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">현재 깊이: 0</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#depth-svg' + suffix);
        var infoEl = container.querySelector('#depth-info' + suffix);

        var steps = [
            { description: 'DFS 시작: 루트 노드 3 방문',
              action: function() { svgEl.innerHTML = makeSvg({3:'active'}, {}); infoEl.innerHTML = '노드 <strong>3</strong> 방문 → 왼쪽 자식으로 이동'; },
              undo: function() { svgEl.innerHTML = makeSvg({}, {}); infoEl.innerHTML = '<span style="color:var(--text2);">현재 깊이: 0</span>'; }
            },
            { description: '노드 9 방문 (리프 노드)',
              action: function() { svgEl.innerHTML = makeSvg({3:'active',9:'active'}, {}); infoEl.innerHTML = '노드 <strong>9</strong> 방문 — 리프 노드 (자식 없음)'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'active'}, {}); infoEl.innerHTML = '노드 <strong>3</strong> 방문 → 왼쪽 자식으로 이동'; }
            },
            { description: '노드 9: 왼쪽=0, 오른쪽=0 → 깊이 = 1',
              action: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done'}, {9:1}); infoEl.innerHTML = '노드 9: max(0, 0) + 1 = <strong>깊이 1</strong> 반환'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'active',9:'active'}, {}); infoEl.innerHTML = '노드 <strong>9</strong> 방문 — 리프 노드 (자식 없음)'; }
            },
            { description: '노드 20 방문 → 왼쪽 자식으로',
              action: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done',20:'active'}, {9:1}); infoEl.innerHTML = '노드 <strong>20</strong> 방문 → 왼쪽 자식 15로 이동'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done'}, {9:1}); infoEl.innerHTML = '노드 9: max(0, 0) + 1 = <strong>깊이 1</strong> 반환'; }
            },
            { description: '노드 15 방문 (리프) → 깊이 1',
              action: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done',20:'active',15:'done'}, {9:1,15:1}); infoEl.innerHTML = '노드 15: 리프 → max(0, 0) + 1 = <strong>깊이 1</strong>'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done',20:'active'}, {9:1}); infoEl.innerHTML = '노드 <strong>20</strong> 방문 → 왼쪽 자식 15로 이동'; }
            },
            { description: '노드 7 방문 (리프) → 깊이 1',
              action: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done',20:'active',15:'done',7:'done'}, {9:1,15:1,7:1}); infoEl.innerHTML = '노드 7: 리프 → max(0, 0) + 1 = <strong>깊이 1</strong>'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done',20:'active',15:'done'}, {9:1,15:1}); infoEl.innerHTML = '노드 15: 리프 → max(0, 0) + 1 = <strong>깊이 1</strong>'; }
            },
            { description: '노드 20: max(1, 1) + 1 = 깊이 2',
              action: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done',20:'done',15:'done',7:'done'}, {9:1,15:1,7:1,20:2}); infoEl.innerHTML = '노드 20: max(1, 1) + 1 = <strong>깊이 2</strong>'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done',20:'active',15:'done',7:'done'}, {9:1,15:1,7:1}); infoEl.innerHTML = '노드 7: 리프 → max(0, 0) + 1 = <strong>깊이 1</strong>'; }
            },
            { description: '노드 3: max(1, 2) + 1 = 깊이 3 — 완료!',
              action: function() { svgEl.innerHTML = makeSvg({3:'done',9:'done',20:'done',15:'done',7:'done'}, {9:1,15:1,7:1,20:2,3:3}); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최대 깊이 = 3 (루트 3 → 20 → 15 or 7)</strong>'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'active',9:'done',20:'done',15:'done',7:'done'}, {9:1,15:1,7:1,20:2}); infoEl.innerHTML = '노드 20: max(1, 1) + 1 = <strong>깊이 2</strong>'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: Invert Binary Tree (lc-226)
    // ====================================================================
    _renderVizInvert: function(container) {
        var self = this;
        var suffix = '-invert';
        // Tree: [4, 2, 7, 1, 3, 6, 9]
        var posOrig = {
            4: {x:200,y:40}, 2: {x:100,y:110}, 7: {x:300,y:110},
            1: {x:55,y:180}, 3: {x:145,y:180}, 6: {x:255,y:180}, 9: {x:345,y:180}
        };

        // Track current tree structure (which child is left/right)
        var treeState = [
            { id: 4, l: 2, r: 7 },
            { id: 2, l: 1, r: 3 },
            { id: 7, l: 6, r: 9 },
            { id: 1, l: null, r: null },
            { id: 3, l: null, r: null },
            { id: 6, l: null, r: null },
            { id: 9, l: null, r: null }
        ];

        function getPos(treeArr) {
            // Compute positions based on tree structure using BFS
            var pos = {};
            pos[4] = { x: 200, y: 40 };
            function setChildren(parentId, lx, rx, cy) {
                var node = null;
                for (var i = 0; i < treeArr.length; i++) { if (treeArr[i].id === parentId) { node = treeArr[i]; break; } }
                if (!node) return;
                if (node.l !== null) { pos[node.l] = { x: lx, y: cy }; }
                if (node.r !== null) { pos[node.r] = { x: rx, y: cy }; }
            }
            setChildren(4, 100, 300, 110);
            var n4 = null; for (var i = 0; i < treeArr.length; i++) { if (treeArr[i].id === 4) { n4 = treeArr[i]; break; } }
            if (n4.l !== null) setChildren(n4.l, 55, 145, 180);
            if (n4.r !== null) setChildren(n4.r, 255, 345, 180);
            return pos;
        }

        function makeSvg(treeArr, highlights) {
            var pos = getPos(treeArr);
            var svg = '<svg viewBox="0 0 400 220" width="100%" height="220">';
            // edges
            treeArr.forEach(function(n) {
                if (n.l !== null && pos[n.id] && pos[n.l]) {
                    svg += '<line x1="' + pos[n.id].x + '" y1="' + pos[n.id].y + '" x2="' + pos[n.l].x + '" y2="' + pos[n.l].y + '" stroke="var(--border)" stroke-width="2"/>';
                }
                if (n.r !== null && pos[n.id] && pos[n.r]) {
                    svg += '<line x1="' + pos[n.id].x + '" y1="' + pos[n.id].y + '" x2="' + pos[n.r].x + '" y2="' + pos[n.r].y + '" stroke="var(--border)" stroke-width="2"/>';
                }
            });
            // nodes
            var allIds = [4,2,7,1,3,6,9];
            allIds.forEach(function(k) {
                if (!pos[k]) return;
                var hl = highlights[k] || '';
                var fill = hl === 'swap' ? '#e17055' : hl === 'done' ? 'var(--green)' : 'var(--bg2)';
                var textFill = (hl === 'swap' || hl === 'done') ? 'white' : 'var(--text)';
                svg += '<circle cx="' + pos[k].x + '" cy="' + pos[k].y + '" r="22" fill="' + fill + '" stroke="var(--border)" stroke-width="2"/>';
                svg += '<text x="' + pos[k].x + '" y="' + (pos[k].y + 5) + '" text-anchor="middle" font-size="14" font-weight="600" fill="' + textFill + '">' + k + '</text>';
            });
            svg += '</svg>';
            return svg;
        }

        function cloneTree(t) { return t.map(function(n) { return { id: n.id, l: n.l, r: n.r }; }); }
        function swapChildren(treeArr, nodeId) {
            for (var i = 0; i < treeArr.length; i++) {
                if (treeArr[i].id === nodeId) {
                    var tmp = treeArr[i].l;
                    treeArr[i].l = treeArr[i].r;
                    treeArr[i].r = tmp;
                    break;
                }
            }
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Invert Binary Tree — 재귀적 좌우 교환</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">트리 [4, 2, 7, 1, 3, 6, 9]의 좌우를 교환합니다.</p>' +
            '<div id="inv-svg' + suffix + '">' + makeSvg(treeState, {}) + '</div>' +
            '<div id="inv-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">각 노드에서 왼쪽, 오른쪽 자식을 교환합니다.</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#inv-svg' + suffix);
        var infoEl = container.querySelector('#inv-info' + suffix);

        // Pre-order swap: 4 → 2 → 1 → 3 → 7 → 6 → 9
        // But leaves (1,3,6,9) have no children to swap, so meaningful swaps at: 4, 2, 7
        var state0 = cloneTree(treeState);
        var state1 = cloneTree(state0); swapChildren(state1, 4);   // swap 4's children: l=7,r=2
        var state2 = cloneTree(state1); swapChildren(state2, 7);   // swap 7 (now left child): l=9,r=6
        var state3 = cloneTree(state2); // 9 is leaf - no swap needed
        var state4 = cloneTree(state3); // 6 is leaf - no swap needed
        var state5 = cloneTree(state4); swapChildren(state5, 2);   // swap 2 (now right child): l=3,r=1
        var state6 = cloneTree(state5); // 3 is leaf
        var state7 = cloneTree(state6); // 1 is leaf — done

        var steps = [
            { description: '루트 노드 4: 왼쪽(2)과 오른쪽(7)을 교환!',
              action: function() { svgEl.innerHTML = makeSvg(state1, {4:'swap'}); infoEl.innerHTML = '노드 4: <strong>2 ↔ 7</strong> 교환 완료!'; },
              undo: function() { svgEl.innerHTML = makeSvg(state0, {}); infoEl.innerHTML = '<span style="color:var(--text2);">각 노드에서 왼쪽, 오른쪽 자식을 교환합니다.</span>'; }
            },
            { description: '노드 7 (현재 왼쪽): 왼쪽(6)과 오른쪽(9)을 교환!',
              action: function() { svgEl.innerHTML = makeSvg(state2, {4:'done',7:'swap'}); infoEl.innerHTML = '노드 7: <strong>6 ↔ 9</strong> 교환 완료!'; },
              undo: function() { svgEl.innerHTML = makeSvg(state1, {4:'swap'}); infoEl.innerHTML = '노드 4: <strong>2 ↔ 7</strong> 교환 완료!'; }
            },
            { description: '노드 9, 6은 리프 — 교환할 자식 없음',
              action: function() { svgEl.innerHTML = makeSvg(state4, {4:'done',7:'done',9:'done',6:'done'}); infoEl.innerHTML = '노드 9, 6: 리프 노드 (교환 불필요)'; },
              undo: function() { svgEl.innerHTML = makeSvg(state2, {4:'done',7:'swap'}); infoEl.innerHTML = '노드 7: <strong>6 ↔ 9</strong> 교환 완료!'; }
            },
            { description: '노드 2 (현재 오른쪽): 왼쪽(1)과 오른쪽(3)을 교환!',
              action: function() { svgEl.innerHTML = makeSvg(state5, {4:'done',7:'done',9:'done',6:'done',2:'swap'}); infoEl.innerHTML = '노드 2: <strong>1 ↔ 3</strong> 교환 완료!'; },
              undo: function() { svgEl.innerHTML = makeSvg(state4, {4:'done',7:'done',9:'done',6:'done'}); infoEl.innerHTML = '노드 9, 6: 리프 노드 (교환 불필요)'; }
            },
            { description: '노드 3, 1은 리프 — 교환할 자식 없음',
              action: function() { svgEl.innerHTML = makeSvg(state7, {4:'done',7:'done',9:'done',6:'done',2:'done',3:'done',1:'done'}); infoEl.innerHTML = '노드 3, 1: 리프 노드 (교환 불필요)'; },
              undo: function() { svgEl.innerHTML = makeSvg(state5, {4:'done',7:'done',9:'done',6:'done',2:'swap'}); infoEl.innerHTML = '노드 2: <strong>1 ↔ 3</strong> 교환 완료!'; }
            },
            { description: '완성! 트리가 좌우 반전되었습니다: [4, 7, 2, 9, 6, 3, 1]',
              action: function() { svgEl.innerHTML = makeSvg(state7, {4:'done',7:'done',9:'done',6:'done',2:'done',3:'done',1:'done'}); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Invert 완료! [4, 7, 2, 9, 6, 3, 1]</strong>'; },
              undo: function() { svgEl.innerHTML = makeSvg(state7, {4:'done',7:'done',9:'done',6:'done',2:'done',3:'done',1:'done'}); infoEl.innerHTML = '노드 3, 1: 리프 노드 (교환 불필요)'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: Level Order Traversal (lc-102)
    // ====================================================================
    _renderVizLevelOrder: function(container) {
        var self = this;
        var suffix = '-level';
        // Tree: [3, 9, 20, null, null, 15, 7]
        var nodes = {
            3:  { x: 200, y: 40 },
            9:  { x: 100, y: 110 },
            20: { x: 300, y: 110 },
            15: { x: 240, y: 180 },
            7:  { x: 360, y: 180 }
        };
        var edges = [[3,9],[3,20],[20,15],[20,7]];

        function makeSvg(highlights) {
            var svg = '<svg viewBox="0 0 460 220" width="100%" height="220">';
            edges.forEach(function(e) {
                svg += '<line x1="' + nodes[e[0]].x + '" y1="' + nodes[e[0]].y + '" x2="' + nodes[e[1]].x + '" y2="' + nodes[e[1]].y + '" stroke="var(--border)" stroke-width="2"/>';
            });
            var keys = [3, 9, 20, 15, 7];
            keys.forEach(function(k) {
                var n = nodes[k];
                var hl = highlights[k] || '';
                var fill = hl === 'current' ? 'var(--accent)' : hl === 'done' ? 'var(--green)' : 'var(--bg2)';
                var textFill = (hl === 'current' || hl === 'done') ? 'white' : 'var(--text)';
                svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="22" fill="' + fill + '" stroke="var(--border)" stroke-width="2"/>';
                svg += '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle" font-size="14" font-weight="600" fill="' + textFill + '">' + k + '</text>';
            });
            svg += '</svg>';
            return svg;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Level Order Traversal — BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">트리 [3, 9, 20, null, null, 15, 7]을 레벨별로 순회합니다.</p>' +
            '<div id="lvl-svg' + suffix + '">' + makeSvg({}) + '</div>' +
            '<div id="lvl-queue' + suffix + '" style="margin-bottom:8px;text-align:center;font-size:0.9rem;"><strong>Queue:</strong> <span style="color:var(--text3);">비어있음</span></div>' +
            '<div id="lvl-result' + suffix + '" style="margin-bottom:12px;text-align:center;font-size:0.9rem;"><strong>Result:</strong> <span style="color:var(--text3);">[]</span></div>' +
            '<div id="lvl-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">BFS로 레벨별 순회를 시작합니다.</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#lvl-svg' + suffix);
        var queueEl = container.querySelector('#lvl-queue' + suffix);
        var resultEl = container.querySelector('#lvl-result' + suffix);
        var infoEl = container.querySelector('#lvl-info' + suffix);

        function showQueue(arr) { queueEl.innerHTML = '<strong>Queue:</strong> ' + (arr.length ? '[' + arr.join(', ') + ']' : '<span style="color:var(--text3);">비어있음</span>'); }
        function showResult(arr) { resultEl.innerHTML = '<strong>Result:</strong> [' + arr.map(function(a) { return '[' + a.join(', ') + ']'; }).join(', ') + ']'; }

        var steps = [
            { description: '초기화: 루트(3)를 큐에 넣습니다.',
              action: function() { svgEl.innerHTML = makeSvg({3:'current'}); showQueue([3]); showResult([]); infoEl.innerHTML = 'Queue = [3], 레벨 0 시작'; },
              undo: function() { svgEl.innerHTML = makeSvg({}); showQueue([]); resultEl.innerHTML = '<strong>Result:</strong> <span style="color:var(--text3);">[]</span>'; infoEl.innerHTML = '<span style="color:var(--text2);">BFS로 레벨별 순회를 시작합니다.</span>'; }
            },
            { description: '레벨 0: 노드 3을 꺼내고, 자식 9, 20을 큐에 넣습니다.',
              action: function() { svgEl.innerHTML = makeSvg({3:'done'}); showQueue([9, 20]); showResult([[3]]); infoEl.innerHTML = '레벨 0 완료: [3]. 자식 9, 20을 큐에 추가'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'current'}); showQueue([3]); showResult([]); infoEl.innerHTML = 'Queue = [3], 레벨 0 시작'; }
            },
            { description: '레벨 1: 노드 9, 20을 꺼냅니다. (큐 크기=2)',
              action: function() { svgEl.innerHTML = makeSvg({3:'done',9:'current',20:'current'}); showQueue([15, 7]); showResult([[3],[9,20]]); infoEl.innerHTML = '레벨 1 완료: [9, 20]. 20의 자식 15, 7을 추가'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'done'}); showQueue([9, 20]); showResult([[3]]); infoEl.innerHTML = '레벨 0 완료: [3]. 자식 9, 20을 큐에 추가'; }
            },
            { description: '레벨 2: 노드 15, 7을 꺼냅니다. (리프 노드들)',
              action: function() { svgEl.innerHTML = makeSvg({3:'done',9:'done',20:'done',15:'current',7:'current'}); showQueue([]); showResult([[3],[9,20],[15,7]]); infoEl.innerHTML = '레벨 2 완료: [15, 7]. 큐가 비었습니다!'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'done',9:'current',20:'current'}); showQueue([15, 7]); showResult([[3],[9,20]]); infoEl.innerHTML = '레벨 1 완료: [9, 20]. 20의 자식 15, 7을 추가'; }
            },
            { description: '완성! 큐가 비었으므로 BFS 종료. 결과: [[3], [9, 20], [15, 7]]',
              action: function() { svgEl.innerHTML = makeSvg({3:'done',9:'done',20:'done',15:'done',7:'done'}); showQueue([]); showResult([[3],[9,20],[15,7]]); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 결과: [[3], [9, 20], [15, 7]]</strong>'; },
              undo: function() { svgEl.innerHTML = makeSvg({3:'done',9:'done',20:'done',15:'current',7:'current'}); showQueue([]); showResult([[3],[9,20],[15,7]]); infoEl.innerHTML = '레벨 2 완료: [15, 7]. 큐가 비었습니다!'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: Tree Traversal (boj-1991)
    // ====================================================================
    _renderVizTreeTraversal: function(container) {
        var self = this;
        var suffix = '-order';
        // Tree from problem: A-B-C, B-D-., C-E-F, D-.., E-.., F-.-G, G-..
        var nodes = {
            A: {x:200,y:35}, B: {x:100,y:100}, C: {x:300,y:100},
            D: {x:55,y:170}, E: {x:255,y:170}, F: {x:345,y:170},
            G: {x:375,y:230}
        };
        var edges = [['A','B'],['A','C'],['B','D'],['C','E'],['C','F'],['F','G']];

        function makeSvg(highlights) {
            var svg = '<svg viewBox="0 0 430 260" width="100%" height="260">';
            edges.forEach(function(e) {
                svg += '<line x1="' + nodes[e[0]].x + '" y1="' + nodes[e[0]].y + '" x2="' + nodes[e[1]].x + '" y2="' + nodes[e[1]].y + '" stroke="var(--border)" stroke-width="2"/>';
            });
            var keys = ['A','B','C','D','E','F','G'];
            keys.forEach(function(k) {
                var n = nodes[k];
                var hl = highlights[k] || '';
                var fill = hl === 'pre' ? 'var(--accent)' : hl === 'in' ? 'var(--green)' : hl === 'post' ? '#e17055' : hl === 'done' ? '#6c5ce7' : 'var(--bg2)';
                var textFill = hl ? 'white' : 'var(--text)';
                svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="20" fill="' + fill + '" stroke="var(--border)" stroke-width="2"/>';
                svg += '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle" font-size="14" font-weight="600" fill="' + textFill + '">' + k + '</text>';
            });
            svg += '</svg>';
            return svg;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">트리 순회 — 전위/중위/후위</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">트리 A-B-C-D-E-F-G에서 세 가지 순회를 수행합니다.</p>' +
            '<div id="trav-svg' + suffix + '">' + makeSvg({}) + '</div>' +
            '<div id="trav-pre' + suffix + '" style="margin-bottom:4px;font-size:0.9rem;"><strong style="color:var(--accent);">전위:</strong> <span id="trav-pre-val' + suffix + '"></span></div>' +
            '<div id="trav-in' + suffix + '" style="margin-bottom:4px;font-size:0.9rem;"><strong style="color:var(--green);">중위:</strong> <span id="trav-in-val' + suffix + '"></span></div>' +
            '<div id="trav-post' + suffix + '" style="margin-bottom:12px;font-size:0.9rem;"><strong style="color:#e17055;">후위:</strong> <span id="trav-post-val' + suffix + '"></span></div>' +
            '<div id="trav-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">세 ��지 순회를 단계별로 진행합니다.</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#trav-svg' + suffix);
        var preEl = container.querySelector('#trav-pre-val' + suffix);
        var inEl = container.querySelector('#trav-in-val' + suffix);
        var postEl = container.querySelector('#trav-post-val' + suffix);
        var infoEl = container.querySelector('#trav-info' + suffix);

        // Preorder:  A B D C E F G
        // Inorder:   D B A E C F G
        // Postorder: D B E G F C A
        var preSeq  = ['A','B','D','C','E','F','G'];
        var inSeq   = ['D','B','A','E','C','F','G'];
        var postSeq = ['D','B','E','G','F','C','A'];

        var steps = [];
        var preResult = [], inResult = [], postResult = [];

        // Phase 1: Preorder (4 steps)
        var preStates = [
            { add: 'A', hl: {A:'pre'}, desc: '전위: 루트 A 방문 (출력 → 왼쪽 → 오른쪽)' },
            { add: 'B', hl: {A:'done',B:'pre'}, desc: '전위: A의 왼쪽 자식 B 방문' },
            { add: 'D', hl: {A:'done',B:'done',D:'pre'}, desc: '전위: B의 왼쪽 자식 D 방문 (리프)' },
            { add: 'C,E,F,G', hl: {A:'done',B:'done',C:'done',D:'done',E:'done',F:'done',G:'done'}, desc: '전위: 오른쪽 서브트리 C→E→F→G 방문 완료' }
        ];

        var curPre = [];
        preStates.forEach(function(ps, idx) {
            var prevPre = curPre.slice();
            var additions = ps.add.split(',');
            additions.forEach(function(a) { curPre.push(a); });
            var snapPre = curPre.slice();
            (function(snapPre, prevPre, hl, desc) {
                steps.push({
                    description: desc,
                    action: function() { svgEl.innerHTML = makeSvg(hl); preEl.textContent = snapPre.join(''); inEl.textContent = ''; postEl.textContent = ''; infoEl.innerHTML = desc; },
                    undo: function() {
                        var prevHl = idx > 0 ? preStates[idx-1].hl : {};
                        svgEl.innerHTML = makeSvg(prevHl); preEl.textContent = prevPre.join(''); inEl.textContent = ''; postEl.textContent = '';
                        infoEl.innerHTML = idx > 0 ? preStates[idx-1].desc : '<span style="color:var(--text2);">세 가지 순회를 단계별로 진행합니다.</span>';
                    }
                });
            })(snapPre, prevPre, ps.hl, ps.desc);
        });

        // Phase 2: Inorder (4 steps)
        var inStates = [
            { add: 'D', hl: {D:'in'}, desc: '중위: 가장 왼쪽 D 먼저 방문 (왼쪽 → 출력 → 오른쪽)' },
            { add: 'B,A', hl: {D:'done',B:'in',A:'in'}, desc: '중위: D 완료 → B 출력 → 왼쪽 서브트리 완료 → A 출력' },
            { add: 'E,C', hl: {D:'done',B:'done',A:'done',E:'in',C:'in'}, desc: '중위: 오른쪽 서브트리 → E → C' },
            { add: 'F,G', hl: {D:'done',B:'done',A:'done',E:'done',C:'done',F:'done',G:'done'}, desc: '중위: F → G (F의 오른쪽 자식) — 중위 순회 완료!' }
        ];

        var curIn = [];
        var fullPre = preSeq.join('');
        inStates.forEach(function(is, idx) {
            var prevIn = curIn.slice();
            var additions = is.add.split(',');
            additions.forEach(function(a) { curIn.push(a); });
            var snapIn = curIn.slice();
            (function(snapIn, prevIn, hl, desc) {
                steps.push({
                    description: desc,
                    action: function() { svgEl.innerHTML = makeSvg(hl); preEl.textContent = fullPre; inEl.textContent = snapIn.join(''); postEl.textContent = ''; infoEl.innerHTML = desc; },
                    undo: function() {
                        var prevHl = idx > 0 ? inStates[idx-1].hl : preStates[preStates.length-1].hl;
                        svgEl.innerHTML = makeSvg(prevHl); preEl.textContent = fullPre; inEl.textContent = prevIn.join(''); postEl.textContent = '';
                        infoEl.innerHTML = idx > 0 ? inStates[idx-1].desc : preStates[preStates.length-1].desc;
                    }
                });
            })(snapIn, prevIn, is.hl, is.desc);
        });

        // Phase 3: Postorder (4 steps)
        var postStates = [
            { add: 'D,B', hl: {D:'post',B:'post'}, desc: '후위: 왼쪽 서브트리 → D(리프) → B (왼쪽 → 오른쪽 → 출력)' },
            { add: 'E', hl: {D:'done',B:'done',E:'post'}, desc: '후위: 오른쪽 서브트리의 왼쪽 → E(리프)' },
            { add: 'G,F,C', hl: {D:'done',B:'done',E:'done',G:'post',F:'post',C:'post'}, desc: '후위: G → F → C (자식들 먼저, 부모 마지막)' },
            { add: 'A', hl: {D:'done',B:'done',E:'done',G:'done',F:'done',C:'done',A:'done'}, desc: '후위: 루트 A 마지막 출력 — 후위 순회 완료!' }
        ];

        var curPost = [];
        var fullIn = inSeq.join('');
        postStates.forEach(function(ps, idx) {
            var prevPost = curPost.slice();
            var additions = ps.add.split(',');
            additions.forEach(function(a) { curPost.push(a); });
            var snapPost = curPost.slice();
            (function(snapPost, prevPost, hl, desc) {
                steps.push({
                    description: desc,
                    action: function() { svgEl.innerHTML = makeSvg(hl); preEl.textContent = fullPre; inEl.textContent = fullIn; postEl.textContent = snapPost.join(''); infoEl.innerHTML = desc; },
                    undo: function() {
                        var prevHl = idx > 0 ? postStates[idx-1].hl : inStates[inStates.length-1].hl;
                        svgEl.innerHTML = makeSvg(prevHl); preEl.textContent = fullPre; inEl.textContent = fullIn; postEl.textContent = prevPost.join('');
                        infoEl.innerHTML = idx > 0 ? postStates[idx-1].desc : inStates[inStates.length-1].desc;
                    }
                });
            })(snapPost, prevPost, ps.hl, ps.desc);
        });

        // Final step
        var fullPost = postSeq.join('');
        steps.push({
            description: '완성! 전위: ABDCEFG, 중위: DBAECFG, 후위: DBEGFCA',
            action: function() {
                svgEl.innerHTML = makeSvg({A:'done',B:'done',C:'done',D:'done',E:'done',F:'done',G:'done'});
                preEl.textContent = fullPre; inEl.textContent = fullIn; postEl.textContent = fullPost;
                infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 세 가지 순회 완료!</strong>';
            },
            undo: function() {
                var hl = postStates[postStates.length-1].hl;
                svgEl.innerHTML = makeSvg(hl);
                preEl.textContent = fullPre; inEl.textContent = fullIn; postEl.textContent = fullPost;
                infoEl.innerHTML = postStates[postStates.length-1].desc;
            }
        });

        self._initStepController(container, steps, suffix);
    },

    // ===== 빈 스텁 =====
    renderVisualize: function(container) {},
    renderProblem: function(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '기본 트리', desc: '트리의 기본적인 DFS/BFS 문제를 연습합니다 (Easy)', problemIds: ['lc-104', 'lc-226'] },
        { num: 2, title: '트리 응용', desc: '트리 순회와 레벨별 처리를 연습합니다 (Medium ~ Silver)', problemIds: ['lc-102', 'boj-1991'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ===== 1단계: 기본 트리 =====
        {
            id: 'lc-104',
            title: 'LeetCode 104 - Maximum Depth of Binary Tree',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
            simIntro: 'DFS 재귀로 트리의 최대 깊이를 구하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>이진 트리의 <strong>최대 깊이</strong>를 구하세요. 최대 깊이는 루트 노드에서 가장 먼 리프 노드까지의 경로에 있는 노드의 수입니다.</p><div class="problem-io"><div><h4>입력</h4><p>이진 트리의 루트 노드</p></div><div><h4>출력</h4><p>최대 깊이 (정수)</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>[3, 9, 20, null, null, 15, 7]</pre></div><div><strong>출력</strong><pre>3</pre></div></div></div>',
            hints: [
                { title: '재귀적 접근', content: '빈 노드(None)이면 깊이는 0입니다. 그렇지 않으면 <strong>왼쪽과 오른쪽 서브트리의 깊이 중 큰 값 + 1</strong>이 답입니다.' },
                { title: 'BFS 접근도 가능', content: '큐를 사용하여 레벨 순회를 하면서, 레벨의 수를 세면 됩니다.' },
                { title: '핵심 코드', content: '<code>return 1 + max(maxDepth(root.left), maxDepth(root.right))</code><br>이 한 줄이 핵심입니다! 재귀의 아름다움을 느껴보세요.' }
            ],
            templates: {
                python: '# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\nclass Solution:\n    def maxDepth(self, root) -> int:\n        if not root:\n            return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))',
                cpp: '/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n * };\n */\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (!root) return 0;\n        return 1 + max(maxDepth(root->left), maxDepth(root->right));\n    }\n};',
                java: '/**\n * Definition for a binary tree node.\n * public class TreeNode {\n *     int val;\n *     TreeNode left;\n *     TreeNode right;\n * }\n */\nclass Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}'
            },
            solutions: [{
                approach: '재귀 DFS',
                description: '빈 노드면 0을 반환하고, 그렇지 않으면 왼쪽/오른쪽 서브트리 깊이 중 큰 값 + 1을 반환합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(h)',
                codeSteps: {
                    python: [
                        { title: '기저 조건', code: 'if not root:\n    return 0' },
                        { title: '재귀 호출', code: 'left = self.maxDepth(root.left)\nright = self.maxDepth(root.right)' },
                        { title: '결과 반환', code: 'return 1 + max(left, right)' }
                    ]
                },
                get templates() { return treeTopic.problems[0].templates; }
            }]
        },
        {
            id: 'lc-226',
            title: 'LeetCode 226 - Invert Binary Tree',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/invert-binary-tree/',
            simIntro: '재귀적으로 트리의 좌우 자식을 교환하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>이진 트리가 주어졌을 때, <strong>좌우를 반전(뒤집기)</strong>시킨 트리를 반환하세요.</p><div class="problem-io"><div><h4>입력</h4><p>이진 트리의 루트 노드</p></div><div><h4>출력</h4><p>좌우 반전된 트리의 루트 노드</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>[4, 2, 7, 1, 3, 6, 9]</pre></div><div><strong>출력</strong><pre>[4, 7, 2, 9, 6, 3, 1]</pre></div></div></div>',
            hints: [
                { title: '재귀적 접근', content: '각 노드에서 <strong>왼쪽 자식과 오른쪽 자식을 교환</strong>하면 됩니다. 그런 다음 왼쪽, 오른쪽 서브트리에 대해 재귀적으로 반복합니다.' },
                { title: '종료 조건', content: 'root가 None이면 None을 반환합니다. 이것이 재귀의 종료 조건입니다.' },
                { title: '핵심 코드', content: '<code>root.left, root.right = root.right, root.left</code><br>이 한 줄로 좌우 교환! 그 후 양쪽에 재귀 호출합니다.' }
            ],
            templates: {
                python: 'class Solution:\n    def invertTree(self, root):\n        if not root:\n            return None\n        root.left, root.right = root.right, root.left\n        self.invertTree(root.left)\n        self.invertTree(root.right)\n        return root',
                cpp: 'class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (!root) return nullptr;\n        swap(root->left, root->right);\n        invertTree(root->left);\n        invertTree(root->right);\n        return root;\n    }\n};',
                java: 'class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left;\n        root.left = root.right;\n        root.right = temp;\n        invertTree(root.left);\n        invertTree(root.right);\n        return root;\n    }\n}'
            },
            solutions: [{
                approach: '재귀 좌우 교환',
                description: '각 노드에서 왼쪽/오른쪽 자식을 교환하고, 재귀적으로 서브트리도 반전합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(h)',
                codeSteps: {
                    python: [
                        { title: '기저 조건', code: 'if not root:\n    return None' },
                        { title: '좌우 교환', code: 'root.left, root.right = root.right, root.left' },
                        { title: '재귀 호출 + 반환', code: 'self.invertTree(root.left)\nself.invertTree(root.right)\nreturn root' }
                    ]
                },
                get templates() { return treeTopic.problems[1].templates; }
            }]
        },
        // ===== 2단계: 트리 응용 =====
        {
            id: 'lc-102',
            title: 'LeetCode 102 - Binary Tree Level Order Traversal',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
            simIntro: 'BFS로 트리를 레벨별로 순회하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>이진 트리가 주어졌을 때, <strong>레벨별로</strong> 노드 값을 반환하세요. (왼쪽에서 오른쪽 순서)</p><div class="problem-io"><div><h4>입력</h4><p>이진 트리의 루트 노드</p></div><div><h4>출력</h4><p>레벨별 노드 값 리스트의 리스트</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>[3, 9, 20, null, null, 15, 7]</pre></div><div><strong>출력</strong><pre>[[3], [9, 20], [15, 7]]</pre></div></div></div>',
            hints: [
                { title: 'BFS 활용!', content: '<strong>큐(Queue)</strong>를 사용한 BFS로 레벨별 순회를 합니다. 핵심은 매 레벨마다 큐의 크기를 미리 구해서, 그만큼만 꺼내는 것입니다.' },
                { title: '레벨 구분 방법', content: '<code>for _ in range(len(queue))</code>로 현재 레벨의 노드만 처리합니다. 반복문 안에서 자식 노드를 큐에 넣으면 다음 레벨이 됩니다.' },
                { title: '시간/공간 복잡도', content: '시간: O(N) — 모든 노드를 한 번씩 방문합니다.<br>공간: O(N) — 큐에 최대 한 레벨의 노드가 들어갑니다.' }
            ],
            templates: {
                python: 'from collections import deque\n\nclass Solution:\n    def levelOrder(self, root):\n        if not root:\n            return []\n        result = []\n        queue = deque([root])\n        while queue:\n            level = []\n            for _ in range(len(queue)):\n                node = queue.popleft()\n                level.append(node.val)\n                if node.left:  queue.append(node.left)\n                if node.right: queue.append(node.right)\n            result.append(level)\n        return result',
                cpp: 'class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        vector<vector<int>> result;\n        if (!root) return result;\n        queue<TreeNode*> q;\n        q.push(root);\n        while (!q.empty()) {\n            int sz = q.size();\n            vector<int> level;\n            for (int i = 0; i < sz; i++) {\n                TreeNode* node = q.front(); q.pop();\n                level.push_back(node->val);\n                if (node->left)  q.push(node->left);\n                if (node->right) q.push(node->right);\n            }\n            result.push_back(level);\n        }\n        return result;\n    }\n};',
                java: 'class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> result = new ArrayList<>();\n        if (root == null) return result;\n        Queue<TreeNode> queue = new LinkedList<>();\n        queue.add(root);\n        while (!queue.isEmpty()) {\n            int size = queue.size();\n            List<Integer> level = new ArrayList<>();\n            for (int i = 0; i < size; i++) {\n                TreeNode node = queue.poll();\n                level.add(node.val);\n                if (node.left != null)  queue.add(node.left);\n                if (node.right != null) queue.add(node.right);\n            }\n            result.add(level);\n        }\n        return result;\n    }\n}'
            },
            solutions: [{
                approach: 'BFS (큐 사용)',
                description: '큐에 루트를 넣고, 매 레벨마다 큐 크기만큼 노드를 꺼내 처리합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '초기화', code: 'result = []\nqueue = deque([root])' },
                        { title: '레벨별 처리', code: 'while queue:\n    level = []\n    for _ in range(len(queue)):\n        node = queue.popleft()\n        level.append(node.val)' },
                        { title: '자식 추가 + 결과 반환', code: '        if node.left:  queue.append(node.left)\n        if node.right: queue.append(node.right)\n    result.append(level)\nreturn result' }
                    ]
                },
                get templates() { return treeTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-1991',
            title: 'BOJ 1991 - 트리 순회',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1991',
            simIntro: '전위/중위/후위 순회가 노드를 방문하는 순서를 확인하세요.',
            descriptionHTML: '<h3>문제</h3><p>이진 트리가 주어졌을 때, <strong>전위 순회(preorder)</strong>, <strong>중위 순회(inorder)</strong>, <strong>후위 순회(postorder)</strong> 결과를 각각 출력하세요.</p><p>노드 이름은 A부터 시작하며, 항상 A가 루트입니다. 자식이 없으면 .으로 표시됩니다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄: 노드 수 N (1 ≤ N ≤ 26)<br>이후 N줄: 노드, 왼쪽 자식, 오른쪽 자식</p></div><div><h4>출력</h4><p>전위 순회 결과<br>중위 순회 결과<br>후위 순회 결과</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>7\nA B C\nB D .\nC E F\nD . .\nE . .\nF . G\nG . .</pre></div><div><strong>출력</strong><pre>ABDCEFG\nDBAECFG\nDBEGFCA</pre></div></div></div>',
            hints: [
                { title: '트리 저장 방법', content: '딕셔너리(해시맵)에 각 노드의 <strong>왼쪽/오른쪽 자식</strong>을 저장합니다. <code>tree[node] = (left, right)</code>' },
                { title: '순회 구현', content: '전위: <strong>출력 → 왼쪽 → 오른쪽</strong><br>중위: <strong>왼쪽 → 출력 → 오른쪽</strong><br>후위: <strong>왼쪽 → 오른쪽 → 출력</strong><br>재귀로 구현하면 아주 간단합니다!' },
                { title: '종료 조건', content: '자식이 <code>.</code>이면 재귀를 멈춥니다. <code>if node == ".": return</code>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ntree = {}\nfor _ in range(N):\n    node, left, right = input().split()\n    tree[node] = (left, right)\n\ndef preorder(node):\n    if node == \'.\':\n        return\n    print(node, end=\'\')\n    preorder(tree[node][0])\n    preorder(tree[node][1])\n\ndef inorder(node):\n    if node == \'.\':\n        return\n    inorder(tree[node][0])\n    print(node, end=\'\')\n    inorder(tree[node][1])\n\ndef postorder(node):\n    if node == \'.\':\n        return\n    postorder(tree[node][0])\n    postorder(tree[node][1])\n    print(node, end=\'\')\n\npreorder(\'A\')\nprint()\ninorder(\'A\')\nprint()\npostorder(\'A\')\nprint()',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nmap<char, pair<char, char>> tree;\n\nvoid preorder(char node) {\n    if (node == \'.\') return;\n    cout << node;\n    preorder(tree[node].first);\n    preorder(tree[node].second);\n}\n\nvoid inorder(char node) {\n    if (node == \'.\') return;\n    inorder(tree[node].first);\n    cout << node;\n    inorder(tree[node].second);\n}\n\nvoid postorder(char node) {\n    if (node == \'.\') return;\n    postorder(tree[node].first);\n    postorder(tree[node].second);\n    cout << node;\n}\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    for (int i = 0; i < N; i++) {\n        char node, left, right;\n        scanf(" %c %c %c", &node, &left, &right);\n        tree[node] = {left, right};\n    }\n    preorder(\'A\'); cout << "\\n";\n    inorder(\'A\');  cout << "\\n";\n    postorder(\'A\'); cout << "\\n";\n    return 0;\n}',
                java: 'import java.util.*;\n\npublic class Main {\n    static Map<Character, char[]> tree = new HashMap<>();\n\n    static void preorder(char node) {\n        if (node == \'.\') return;\n        System.out.print(node);\n        preorder(tree.get(node)[0]);\n        preorder(tree.get(node)[1]);\n    }\n\n    static void inorder(char node) {\n        if (node == \'.\') return;\n        inorder(tree.get(node)[0]);\n        System.out.print(node);\n        inorder(tree.get(node)[1]);\n    }\n\n    static void postorder(char node) {\n        if (node == \'.\') return;\n        postorder(tree.get(node)[0]);\n        postorder(tree.get(node)[1]);\n        System.out.print(node);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt();\n        for (int i = 0; i < N; i++) {\n            char node = sc.next().charAt(0);\n            char left = sc.next().charAt(0);\n            char right = sc.next().charAt(0);\n            tree.put(node, new char[]{left, right});\n        }\n        preorder(\'A\'); System.out.println();\n        inorder(\'A\');  System.out.println();\n        postorder(\'A\'); System.out.println();\n    }\n}'
            },
            solutions: [{
                approach: '재귀 순회',
                description: '트리를 딕셔너리에 저장한 뒤, 재귀 함수로 전위/중위/후위 순회를 수행합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '트리 입력 저장', code: 'tree = {}\nfor _ in range(N):\n    node, left, right = input().split()\n    tree[node] = (left, right)' },
                        { title: '전위 순회', code: 'def preorder(node):\n    if node == \'.\':\n        return\n    print(node, end=\'\')\n    preorder(tree[node][0])\n    preorder(tree[node][1])' },
                        { title: '중위/후위 순회', code: 'def inorder(node):\n    if node == \'.\': return\n    inorder(tree[node][0])\n    print(node, end=\'\')\n    inorder(tree[node][1])\n\ndef postorder(node):\n    if node == \'.\': return\n    postorder(tree[node][0])\n    postorder(tree[node][1])\n    print(node, end=\'\')' }
                    ]
                },
                get templates() { return treeTopic.problems[3].templates; }
            }]
        }
    ]
};

// ===== 등록 =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.tree = treeTopic;
