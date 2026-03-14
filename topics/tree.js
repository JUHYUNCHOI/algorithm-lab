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
                <div style="margin-top:1.2rem;padding:1.2rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.92rem;line-height:1.75;">\
                    <strong style="font-size:0.95rem;">트리 종류가 왜 중요할까?</strong><br>\
                    <strong>완전 이진 트리(Complete)</strong>: 왼쪽부터 빈틈없이 채우기 때문에 <strong>배열로 저장</strong>할 수 있습니다. 이것이 바로 <strong>힙(Heap)</strong>의 기반입니다! (인덱스 i의 자식 = 2i+1, 2i+2)<br>\
                    <strong>균형 트리</strong>: 높이가 <strong>O(log n)</strong>으로 유지됩니다. 노드가 100만 개여도 높이가 약 20 — 그래서 탐색/삽입이 빠릅니다.<br>\
                    <strong>편향 트리</strong>: 한쪽으로만 치우치면 사실상 <strong>연결 리스트</strong>와 같습니다. 높이가 O(n)이 되어 모든 연산이 느려집니다.<br>\
                    <span style="color:var(--accent);font-weight:600;">핵심:</span> "트리가 균형인지 아닌지"가 성능의 핵심입니다! 균형이면 O(log n), 편향이면 O(n)으로 퇴화합니다.\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 이진 트리 노드 정의\n\
class TreeNode:\n\
    def __init__(self, val=0, left=None, right=None):\n\
        self.val = val\n\
        self.left = left    # 왼쪽 자식\n\
        self.right = right  # 오른쪽 자식\n\
\n\
# 높이가 h인 이진 트리의 최대 노드 수: 2^(h+1) - 1\n\
# 노드가 N개인 완전 이진 트리의 높이: O(log N)\n\
# 예) N = 1,000,000이면 높이 ≈ 20 (아주 낮습니다!)</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 이진 트리 노드 정의\n\
struct TreeNode {\n\
    int val;\n\
    TreeNode *left, *right;\n\
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}\n\
};\n\
\n\
// 높이가 h인 이진 트리의 최대 노드 수: 2^(h+1) - 1\n\
// 노드가 N개인 완전 이진 트리의 높이: O(log N)\n\
// 예) N = 1,000,000이면 높이 ≈ 20 (아주 낮습니다!)</code></pre></div></span>\
                <div style="margin-top:8px;"><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/language/nullptr" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: nullptr ↗</a></span></div>\
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
                <div style="margin-top:1.5rem;overflow-x:auto;">\
                    <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">\
                        <thead><tr style="background:var(--bg2);">\
                            <th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--bg3);font-weight:700;">순회 방법</th>\
                            <th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--bg3);font-weight:700;">방문 순서</th>\
                            <th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--bg3);font-weight:700;">자료구조</th>\
                            <th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--bg3);font-weight:700;">대표 활용</th>\
                        </tr></thead>\
                        <tbody>\
                            <tr style="border-bottom:1px solid var(--bg3);">\
                                <td style="padding:10px 12px;font-weight:600;color:var(--accent);">전위 (Preorder)</td>\
                                <td style="padding:10px 12px;">루트 → 왼 → 오</td>\
                                <td style="padding:10px 12px;">스택/재귀</td>\
                                <td style="padding:10px 12px;">트리 복사, 직렬화</td>\
                            </tr>\
                            <tr style="border-bottom:1px solid var(--bg3);">\
                                <td style="padding:10px 12px;font-weight:600;color:var(--green);">중위 (Inorder)</td>\
                                <td style="padding:10px 12px;">왼 → 루트 → 오</td>\
                                <td style="padding:10px 12px;">스택/재귀</td>\
                                <td style="padding:10px 12px;">BST 정렬 출력</td>\
                            </tr>\
                            <tr style="border-bottom:1px solid var(--bg3);">\
                                <td style="padding:10px 12px;font-weight:600;color:var(--yellow);">후위 (Postorder)</td>\
                                <td style="padding:10px 12px;">왼 → 오 → 루트</td>\
                                <td style="padding:10px 12px;">스택/재귀</td>\
                                <td style="padding:10px 12px;">트리 삭제, 수식 계산</td>\
                            </tr>\
                            <tr>\
                                <td style="padding:10px 12px;font-weight:600;color:var(--red);">레벨 순서 (BFS)</td>\
                                <td style="padding:10px 12px;">레벨 0→1→2...</td>\
                                <td style="padding:10px 12px;">큐</td>\
                                <td style="padding:10px 12px;">레벨별 처리</td>\
                            </tr>\
                        </tbody>\
                    </table>\
                </div>\
\
                <div style="margin-top:1.2rem;padding:1.2rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.92rem;line-height:1.75;">\
                    <strong style="font-size:0.95rem;">DFS (전/중/후위) vs BFS (레벨) — 언제 뭘 쓸까?</strong><br>\
                    <span style="color:var(--accent);font-weight:600;">DFS</span>: 리프까지 깊이 탐색해야 할 때 — 높이 계산, 경로 합, 서브트리 판별 등<br>\
                    <span style="color:var(--red);font-weight:600;">BFS</span>: 레벨별로 처리해야 할 때 — 레벨 순서 출력, 최소 깊이, 레벨 평균 등<br>\
                    <span style="color:var(--text2);">DFS는 스택(재귀 콜스택 포함)을, BFS는 큐를 사용합니다. 문제가 "깊이/경로" 관련이면 DFS, "레벨/너비" 관련이면 BFS를 먼저 떠올리세요!</span>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 전위 순회 (Preorder): 루트 → 왼쪽 → 오른쪽\n\
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
        if node.right: queue.append(node.right)</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 전위 순회 (Preorder): 루트 → 왼쪽 → 오른쪽\n\
void preorder(TreeNode* node) {\n\
    if (node == nullptr) return;\n\
    cout &lt;&lt; node-&gt;val &lt;&lt; " ";  // 루트 먼저!\n\
    preorder(node-&gt;left);\n\
    preorder(node-&gt;right);\n\
}\n\
\n\
// 중위 순회 (Inorder): 왼쪽 → 루트 → 오른쪽\n\
void inorder(TreeNode* node) {\n\
    if (node == nullptr) return;\n\
    inorder(node-&gt;left);\n\
    cout &lt;&lt; node-&gt;val &lt;&lt; " ";  // 중간에!\n\
    inorder(node-&gt;right);\n\
}\n\
\n\
// 후위 순회 (Postorder): 왼쪽 → 오른쪽 → 루트\n\
void postorder(TreeNode* node) {\n\
    if (node == nullptr) return;\n\
    postorder(node-&gt;left);\n\
    postorder(node-&gt;right);\n\
    cout &lt;&lt; node-&gt;val &lt;&lt; " ";  // 마지막에!\n\
}\n\
\n\
// 레벨 순회 (BFS): 큐 사용\n\
#include &lt;queue&gt;\n\
void level_order(TreeNode* root) {\n\
    if (!root) return;\n\
    queue&lt;TreeNode*&gt; q;\n\
    q.push(root);\n\
    while (!q.empty()) {\n\
        TreeNode* node = q.front(); q.pop();\n\
        cout &lt;&lt; node-&gt;val &lt;&lt; " ";\n\
        if (node-&gt;left)  q.push(node-&gt;left);\n\
        if (node-&gt;right) q.push(node-&gt;right);\n\
    }\n\
}</code></pre></div></span>\
                <div style="margin-top:8px;"><span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: collections.deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: std::queue ↗</a></span></div>\
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
                <div style="margin-top:1.2rem;padding:1.2rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.92rem;line-height:1.75;">\
                    <strong style="font-size:0.95rem;">왜 이렇게 동작할까?</strong><br><br>\
                    <strong style="color:var(--accent);">maxDepth: 왜 <code>1 + max(left, right)</code>인가?</strong><br>\
                    현재 노드가 <strong>1층</strong>을 차지하고, 왼쪽/오른쪽 자식 서브트리 중 <strong>더 깊은 쪽</strong>이 전체 깊이를 결정합니다. 리프 노드(자식 없음)에 도달하면 0을 반환하고, 올라가면서 1씩 더해집니다.<br><br>\
                    <strong style="color:var(--accent);">invertTree: 왜 재귀가 자연스러운가?</strong><br>\
                    "서브트리를 뒤집는다"는 작은 문제가 "전체 트리를 뒤집는다"는 큰 문제와 <strong>완전히 동일한 구조</strong>입니다. 현재 노드에서 좌우를 바꾸고, 왼쪽/오른쪽 서브트리도 각각 뒤집으면 끝! 이것이 바로 재귀의 핵심 — <strong>자기 자신을 더 작은 입력으로 호출</strong>하는 것입니다.<br><br>\
                    <strong style="color:var(--accent);">LCA: 왜 양쪽 다 non-null이면 현재 노드가 LCA인가?</strong><br>\
                    왼쪽 서브트리에서 p(또는 q)를 찾고, 오른쪽 서브트리에서 q(또는 p)를 찾았다는 것은 두 노드가 <strong>서로 다른 서브트리</strong>에 있다는 뜻입니다. 그러면 현재 노드가 두 노드를 동시에 포함하는 <strong>가장 낮은(가까운) 조상</strong>이 됩니다.\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 최대 깊이 구하기\n\
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
    return left or right  # 한쪽에서만 발견</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 최대 깊이 구하기\n\
int maxDepth(TreeNode* root) {\n\
    if (!root) return 0;\n\
    return 1 + max(maxDepth(root-&gt;left), maxDepth(root-&gt;right));\n\
}\n\
\n\
// 트리 뒤집기\n\
TreeNode* invertTree(TreeNode* root) {\n\
    if (!root) return nullptr;\n\
    swap(root-&gt;left, root-&gt;right);  // 좌우 교환!\n\
    invertTree(root-&gt;left);\n\
    invertTree(root-&gt;right);\n\
    return root;\n\
}\n\
\n\
// LCA (최소 공통 조상) - 이진 트리\n\
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n\
    if (!root || root == p || root == q)\n\
        return root;\n\
    TreeNode* left = lowestCommonAncestor(root-&gt;left, p, q);\n\
    TreeNode* right = lowestCommonAncestor(root-&gt;right, p, q);\n\
    if (left &amp;&amp; right) return root;  // 양쪽 다 발견 → 현재 노드가 LCA\n\
    return left ? left : right;       // 한쪽에서만 발견\n\
}</code></pre></div></span>\
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
    // 공통 헬퍼: level-order 문자열 → 트리 노드 배열
    // ====================================================================
    _parseLevelOrder: function(str) {
        // "3, 9, 20, null, null, 15, 7" → [{val, left, right, idx}, ...]
        var tokens = str.split(',').map(function(s) { return s.trim(); });
        if (!tokens.length || tokens[0] === '' || tokens[0] === 'null' || tokens[0] === 'n') return [];
        var arr = tokens.map(function(t) {
            if (t === 'null' || t === 'n' || t === '') return null;
            var n = Number(t);
            return isNaN(n) ? t : n;  // 숫자면 숫자, 아니면 문자 그대로(A,B,C...)
        });
        // Build node objects
        var nodes = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== null) {
                nodes.push({ val: arr[i], left: null, right: null, idx: i });
            } else {
                nodes.push(null);
            }
        }
        // Link children
        var childIdx = 1;
        for (var i = 0; i < nodes.length && childIdx < nodes.length; i++) {
            if (nodes[i] === null) continue;
            if (childIdx < nodes.length) { nodes[i].left = nodes[childIdx]; childIdx++; }
            if (childIdx < nodes.length) { nodes[i].right = nodes[childIdx]; childIdx++; }
        }
        return nodes;
    },

    // level-order 트리에서 실제 노드만 추출 (null 제외)
    _getTreeNodes: function(parsed) {
        return parsed.filter(function(n) { return n !== null; });
    },

    // 트리 레이아웃 계산: BFS 기반 좌표 할당
    _computeTreeLayout: function(root, width, levelHeight, topY) {
        if (!root) return { positions: {}, edges: [], nodeOrder: [] };
        width = width || 400;
        levelHeight = levelHeight || 70;
        topY = topY || 40;
        var positions = {};
        var edges = [];
        var nodeOrder = [];
        // BFS with position ranges
        var queue = [{ node: root, xMin: 0, xMax: width, depth: 0 }];
        while (queue.length > 0) {
            var item = queue.shift();
            var nd = item.node, xMin = item.xMin, xMax = item.xMax, depth = item.depth;
            var cx = (xMin + xMax) / 2;
            var cy = topY + depth * levelHeight;
            var key = String(nd.val);
            // 같은 값이 여러 개일 수 있으므로 idx 기반 키 사용
            var uniqueKey = key + '_' + nd.idx;
            positions[uniqueKey] = { x: cx, y: cy, val: nd.val };
            nodeOrder.push(uniqueKey);
            if (nd.left) {
                var lKey = String(nd.left.val) + '_' + nd.left.idx;
                edges.push([uniqueKey, lKey]);
                queue.push({ node: nd.left, xMin: xMin, xMax: cx, depth: depth + 1 });
            }
            if (nd.right) {
                var rKey = String(nd.right.val) + '_' + nd.right.idx;
                edges.push([uniqueKey, rKey]);
                queue.push({ node: nd.right, xMin: cx, xMax: xMax, depth: depth + 1 });
            }
        }
        return { positions: positions, edges: edges, nodeOrder: nodeOrder };
    },

    // SVG 렌더: positions + edges + highlights → SVG 문자열
    _makeTreeSvg: function(layout, highlights, viewWidth, viewHeight, nodeRadius, extraLabels) {
        highlights = highlights || {};
        viewWidth = viewWidth || 460;
        viewHeight = viewHeight || 220;
        nodeRadius = nodeRadius || 22;
        extraLabels = extraLabels || {};
        var positions = layout.positions;
        var edges = layout.edges;
        var nodeOrder = layout.nodeOrder;
        var svg = '<svg viewBox="0 0 ' + viewWidth + ' ' + viewHeight + '" width="100%" height="' + viewHeight + '">';
        // edges
        edges.forEach(function(e) {
            var p1 = positions[e[0]], p2 = positions[e[1]];
            if (p1 && p2) {
                svg += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="var(--border)" stroke-width="2"/>';
            }
        });
        // nodes
        nodeOrder.forEach(function(key) {
            var n = positions[key];
            var hl = highlights[key] || '';
            var fill = hl === 'active' ? 'var(--accent)' : hl === 'done' ? 'var(--green)' : hl === 'current' ? 'var(--accent)' : hl === 'swap' ? '#e17055' : hl === 'pre' ? 'var(--accent)' : hl === 'in' ? 'var(--green)' : hl === 'post' ? '#e17055' : 'var(--bg2)';
            var textFill = (hl && hl !== '') ? 'white' : 'var(--text)';
            if (!hl) textFill = 'var(--text)';
            svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="' + nodeRadius + '" fill="' + fill + '" stroke="var(--border)" stroke-width="2"/>';
            svg += '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle" font-size="14" font-weight="600" fill="' + textFill + '">' + n.val + '</text>';
            if (extraLabels[key] !== undefined) {
                svg += '<text x="' + (n.x + nodeRadius + 6) + '" y="' + (n.y - 8) + '" font-size="11" fill="var(--accent)" font-weight="600">' + extraLabels[key] + '</text>';
            }
        });
        svg += '</svg>';
        return svg;
    },

    // 트리 높이 계산
    _getTreeHeight: function(root) {
        if (!root) return 0;
        var self = this;
        return 1 + Math.max(self._getTreeHeight(root.left), self._getTreeHeight(root.right));
    },

    // ====================================================================
    // 시뮬레이션 1: Maximum Depth (lc-104)
    // ====================================================================
    _renderVizMaxDepth: function(container) {
        var self = this;
        var suffix = '-depth';
        var DEFAULT_TREE = '3, 9, 20, null, null, 15, 7';

        function buildDepthSteps(treeStr, svgEl, infoEl) {
            var parsed = self._parseLevelOrder(treeStr);
            if (!parsed.length || !parsed[0]) return [];
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);

            function renderSvg(highlights, depthLabels) {
                return self._makeTreeSvg(layout, highlights, 460, svgH, 22, depthLabels);
            }

            // DFS post-order to build steps: visit node, recurse left, recurse right, compute depth
            var steps = [];
            var currentHL = {};   // key → 'active'|'done'
            var depthMap = {};    // key → depth number
            var depthVals = {};   // key → computed depth value

            function dfs(node, parentKey) {
                if (!node) return 0;
                var key = String(node.val) + '_' + node.idx;
                var isLeaf = (!node.left && !node.right);
                var childDesc = '';
                if (node.left && node.right) childDesc = ' → 왼쪽 자식으로 이동';
                else if (node.left) childDesc = ' → 왼쪽 자식으로 이동';
                else if (node.right) childDesc = ' → 오른쪽 자식으로 이동';

                // Step: visit this node
                (function(k, isL, cDesc, v) {
                    var prevHL = JSON.parse(JSON.stringify(currentHL));
                    var prevDepth = JSON.parse(JSON.stringify(depthMap));
                    currentHL[k] = 'active';
                    var snapHL = JSON.parse(JSON.stringify(currentHL));
                    var snapDepth = JSON.parse(JSON.stringify(depthMap));
                    var desc = isL
                        ? '노드 ' + v + ' 방문 (리프 노드)'
                        : '노드 ' + v + ' 방문' + cDesc;
                    var info = isL
                        ? '노드 <strong>' + v + '</strong> 방문 — 리프 노드 (자식 없음)'
                        : '노드 <strong>' + v + '</strong> 방문' + cDesc;
                    steps.push({
                        description: desc,
                        action: function() { svgEl.innerHTML = renderSvg(snapHL, snapDepth); infoEl.innerHTML = info; },
                        undo: function() { svgEl.innerHTML = renderSvg(prevHL, prevDepth); infoEl.innerHTML = steps.length > 1 ? '' : '<span style="color:var(--text2);">현재 깊이: 0</span>'; }
                    });
                })(key, isLeaf, childDesc, node.val);

                var leftD = dfs(node.left, key);
                var rightD = dfs(node.right, key);
                var d = 1 + Math.max(leftD, rightD);

                // Step: compute depth for this node
                (function(k, v, leftD, rightD, d) {
                    var prevHL = JSON.parse(JSON.stringify(currentHL));
                    var prevDepth = JSON.parse(JSON.stringify(depthMap));
                    currentHL[k] = 'done';
                    depthMap[k] = 'd=' + d;
                    var snapHL = JSON.parse(JSON.stringify(currentHL));
                    var snapDepth = JSON.parse(JSON.stringify(depthMap));
                    var desc = '노드 ' + v + ': max(' + leftD + ', ' + rightD + ') + 1 = 깊이 ' + d;
                    var info = '노드 ' + v + ': max(' + leftD + ', ' + rightD + ') + 1 = <strong>깊이 ' + d + '</strong>';
                    steps.push({
                        description: desc,
                        action: function() { svgEl.innerHTML = renderSvg(snapHL, snapDepth); infoEl.innerHTML = info; },
                        undo: function() { svgEl.innerHTML = renderSvg(prevHL, prevDepth); }
                    });
                })(key, node.val, leftD, rightD, d);

                depthVals[key] = d;
                return d;
            }

            var totalDepth = dfs(root, null);

            // Final step
            var finalHL = JSON.parse(JSON.stringify(currentHL));
            var finalDepth = JSON.parse(JSON.stringify(depthMap));
            var prevHL2 = steps.length > 0 ? null : {};
            steps.push({
                description: '완료! 최대 깊이 = ' + totalDepth,
                action: function() {
                    svgEl.innerHTML = renderSvg(finalHL, finalDepth);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최대 깊이 = ' + totalDepth + '</strong>';
                },
                undo: function() {}
            });

            // Fix undo references: each step's undo should restore the state from the previous step's action
            for (var i = 1; i < steps.length; i++) {
                (function(idx) {
                    var prevAction = steps[idx - 1].action;
                    steps[idx].undo = function() { prevAction(); };
                })(i);
            }
            steps[0].undo = function() {
                svgEl.innerHTML = renderSvg({}, {});
                infoEl.innerHTML = '<span style="color:var(--text2);">현재 깊이: 0</span>';
            };

            return steps;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Maximum Depth — DFS 재귀</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">트리 (level-order): <input type="text" id="tree-depth-input" value="' + DEFAULT_TREE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="tree-depth-reset">🔄</button></div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-bottom:12px;">BFS 순서로 입력. null = 빈 노드. 예: 3, 9, 20, null, null, 15, 7</p>' +
            self._createStepDesc(suffix) +
            '<div id="depth-svg' + suffix + '"></div>' +
            '<div id="depth-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">현재 깊이: 0</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#depth-svg' + suffix);
        var infoEl = container.querySelector('#depth-info' + suffix);

        function initSim(treeStr) {
            var steps = buildDepthSteps(treeStr, svgEl, infoEl);
            if (steps.length === 0) {
                svgEl.innerHTML = '<p style="color:var(--red);text-align:center;">유효한 트리를 입력하세요.</p>';
                return;
            }
            // Show initial SVG
            var parsed = self._parseLevelOrder(treeStr);
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);
            svgEl.innerHTML = self._makeTreeSvg(layout, {}, 460, svgH, 22, {});
            infoEl.innerHTML = '<span style="color:var(--text2);">현재 깊이: 0</span>';
            self._initStepController(container, steps, suffix);
        }

        initSim(DEFAULT_TREE);

        container.querySelector('#tree-depth-reset').addEventListener('click', function() {
            var val = container.querySelector('#tree-depth-input').value.trim();
            if (!val) val = DEFAULT_TREE;
            self._clearVizState();
            initSim(val);
        });
    },

    // ====================================================================
    // 시뮬레이션 2: Invert Binary Tree (lc-226)
    // ====================================================================
    _renderVizInvert: function(container) {
        var self = this;
        var suffix = '-invert';
        var DEFAULT_TREE = '4, 2, 7, 1, 3, 6, 9';

        function cloneNode(node) {
            if (!node) return null;
            var c = { val: node.val, left: null, right: null, idx: node.idx };
            c.left = cloneNode(node.left);
            c.right = cloneNode(node.right);
            return c;
        }

        function invertNode(node) {
            if (!node) return;
            var tmp = node.left;
            node.left = node.right;
            node.right = tmp;
            invertNode(node.left);
            invertNode(node.right);
        }

        function treeToLevelOrder(root) {
            if (!root) return '';
            var result = [];
            var queue = [root];
            while (queue.length > 0) {
                var node = queue.shift();
                if (node === null) { result.push('null'); continue; }
                result.push(String(node.val));
                queue.push(node.left);
                queue.push(node.right);
            }
            // Trim trailing nulls
            while (result.length > 0 && result[result.length - 1] === 'null') result.pop();
            return result.join(', ');
        }

        function buildInvertSteps(treeStr, svgEl, infoEl) {
            var parsed = self._parseLevelOrder(treeStr);
            if (!parsed.length || !parsed[0]) return [];
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var svgW = 460;

            // We track tree mutations: at each step we clone, swap, and recompute layout
            var steps = [];
            var highlightState = {};  // key → 'swap'|'done'

            // Pre-order traversal to build inversion steps
            function buildSteps(node) {
                if (!node) return;
                var key = String(node.val) + '_' + node.idx;
                var isLeaf = (!node.left && !node.right);

                if (isLeaf) {
                    // Leaf: just mark as done
                    (function(k, v) {
                        var prevHL = JSON.parse(JSON.stringify(highlightState));
                        highlightState[k] = 'done';
                        var snapHL = JSON.parse(JSON.stringify(highlightState));
                        steps.push({
                            description: '노드 ' + v + ': 리프 노드 (교환할 자식 없음)',
                            hl: snapHL, prevHL: prevHL,
                            swapNode: null,
                            info: '노드 ' + v + ': 리프 노드 (교환 불필요)'
                        });
                    })(key, node.val);
                } else {
                    // Has children: swap them
                    var leftVal = node.left ? node.left.val : 'null';
                    var rightVal = node.right ? node.right.val : 'null';
                    (function(k, v, lv, rv) {
                        var prevHL = JSON.parse(JSON.stringify(highlightState));
                        highlightState[k] = 'swap';
                        var snapHL = JSON.parse(JSON.stringify(highlightState));
                        steps.push({
                            description: '노드 ' + v + ': 왼쪽(' + lv + ')과 오른쪽(' + rv + ')을 교환!',
                            hl: snapHL, prevHL: prevHL,
                            swapNode: k,
                            info: '노드 ' + v + ': <strong>' + lv + ' ↔ ' + rv + '</strong> 교환 완료!'
                        });
                    })(key, node.val, leftVal, rightVal);

                    // Actually swap in tree for subsequent steps
                    var tmp = node.left;
                    node.left = node.right;
                    node.right = tmp;

                    highlightState[key] = 'done';

                    // Recurse on children (now swapped)
                    buildSteps(node.left);
                    buildSteps(node.right);
                }
            }

            // Clone so we can mutate
            var workRoot = cloneNode(root);
            buildSteps(workRoot);

            // Now build actual step objects with SVG rendering
            // We need to replay the tree mutations to get correct layouts
            var actualSteps = [];
            var replayRoot = cloneNode(root);
            var replayHL = {};

            // Initial SVG
            var initLayout = self._computeTreeLayout(replayRoot, svgW, 70, 40);
            var initSvg = self._makeTreeSvg(initLayout, {}, svgW, svgH, 22);

            for (var si = 0; si < steps.length; si++) {
                var stepInfo = steps[si];
                // Apply swap if needed
                if (stepInfo.swapNode) {
                    // Find the node to swap in replayRoot
                    (function swapInTree(node, targetKey) {
                        if (!node) return;
                        var k = String(node.val) + '_' + node.idx;
                        if (k === targetKey) {
                            var tmp = node.left;
                            node.left = node.right;
                            node.right = tmp;
                            return;
                        }
                        swapInTree(node.left, targetKey);
                        swapInTree(node.right, targetKey);
                    })(replayRoot, stepInfo.swapNode);
                }

                // Compute layout after potential swap
                var layout = self._computeTreeLayout(replayRoot, svgW, 70, 40);
                // Build highlight map
                replayHL = JSON.parse(JSON.stringify(stepInfo.hl));

                (function(lay, hl, desc, info, prevLay, prevHL) {
                    actualSteps.push({
                        description: desc,
                        action: function() {
                            svgEl.innerHTML = self._makeTreeSvg(lay, hl, svgW, svgH, 22);
                            infoEl.innerHTML = info;
                        },
                        undo: function() {} // will be patched below
                    });
                })(
                    JSON.parse(JSON.stringify(layout)),
                    JSON.parse(JSON.stringify(replayHL)),
                    stepInfo.description,
                    stepInfo.info,
                    null, null
                );
            }

            // Get inverted level-order for final message
            var finalRoot = cloneNode(root);
            invertNode(finalRoot);
            var invertedStr = treeToLevelOrder(finalRoot);

            // Final completion step
            var finalLayout = self._computeTreeLayout(finalRoot, svgW, 70, 40);
            var allDone = {};
            var finalNodes = [];
            (function collectKeys(node) {
                if (!node) return;
                var k = String(node.val) + '_' + node.idx;
                allDone[k] = 'done';
                finalNodes.push(k);
                collectKeys(node.left);
                collectKeys(node.right);
            })(finalRoot);

            actualSteps.push({
                description: '완성! 트리가 좌우 반전되었습니다: [' + invertedStr + ']',
                action: function() {
                    svgEl.innerHTML = self._makeTreeSvg(finalLayout, allDone, svgW, svgH, 22);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Invert 완료! [' + invertedStr + ']</strong>';
                },
                undo: function() {}
            });

            // Patch undo: each step's undo calls previous step's action
            for (var i = 1; i < actualSteps.length; i++) {
                (function(idx) {
                    var prevAction = actualSteps[idx - 1].action;
                    actualSteps[idx].undo = function() { prevAction(); };
                })(i);
            }
            actualSteps[0].undo = function() {
                var origLayout = self._computeTreeLayout(root, svgW, 70, 40);
                svgEl.innerHTML = self._makeTreeSvg(origLayout, {}, svgW, svgH, 22);
                infoEl.innerHTML = '<span style="color:var(--text2);">각 노드에서 왼쪽, 오른쪽 자식을 교환합니다.</span>';
            };

            return actualSteps;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Invert Binary Tree — 재귀적 좌우 교환</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">트리 (level-order): <input type="text" id="tree-invert-input" value="' + DEFAULT_TREE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="tree-invert-reset">🔄</button></div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-bottom:12px;">BFS 순서로 입력. null = 빈 노드. 예: 4, 2, 7, 1, 3, 6, 9</p>' +
            self._createStepDesc(suffix) +
            '<div id="inv-svg' + suffix + '"></div>' +
            '<div id="inv-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">각 노드에서 왼쪽, 오른쪽 자식을 교환합니다.</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#inv-svg' + suffix);
        var infoEl = container.querySelector('#inv-info' + suffix);

        function initSim(treeStr) {
            var steps = buildInvertSteps(treeStr, svgEl, infoEl);
            if (steps.length === 0) {
                svgEl.innerHTML = '<p style="color:var(--red);text-align:center;">유효한 트리를 입력하세요.</p>';
                return;
            }
            // Show initial SVG
            var parsed = self._parseLevelOrder(treeStr);
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);
            svgEl.innerHTML = self._makeTreeSvg(layout, {}, 460, svgH, 22);
            infoEl.innerHTML = '<span style="color:var(--text2);">각 노드에서 왼쪽, 오른쪽 자식을 교환합니다.</span>';
            self._initStepController(container, steps, suffix);
        }

        initSim(DEFAULT_TREE);

        container.querySelector('#tree-invert-reset').addEventListener('click', function() {
            var val = container.querySelector('#tree-invert-input').value.trim();
            if (!val) val = DEFAULT_TREE;
            self._clearVizState();
            initSim(val);
        });
    },

    // ====================================================================
    // 시뮬레이션 3: Level Order Traversal (lc-102)
    // ====================================================================
    _renderVizLevelOrder: function(container) {
        var self = this;
        var suffix = '-level';
        var DEFAULT_TREE = '3, 9, 20, null, null, 15, 7';

        function buildLevelSteps(treeStr, svgEl, queueEl, resultEl, infoEl) {
            var parsed = self._parseLevelOrder(treeStr);
            if (!parsed.length || !parsed[0]) return [];
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var svgW = 460;
            var layout = self._computeTreeLayout(root, svgW, 70, 40);

            function renderSvg(highlights) {
                return self._makeTreeSvg(layout, highlights, svgW, svgH, 22);
            }
            function showQueue(arr) { queueEl.innerHTML = '<strong>Queue:</strong> ' + (arr.length ? '[' + arr.join(', ') + ']' : '<span style="color:var(--text3);">비어있음</span>'); }
            function showResult(arr) { resultEl.innerHTML = '<strong>Result:</strong> [' + arr.map(function(a) { return '[' + a.join(', ') + ']'; }).join(', ') + ']'; }

            // BFS level-by-level to build steps
            var steps = [];
            var highlights = {};
            var result = [];

            // Step 0: Init — put root in queue
            var rootKey = String(root.val) + '_' + root.idx;
            steps.push({
                description: '초기화: 루트(' + root.val + ')를 큐에 넣습니다.',
                action: function() {
                    var hl = {}; hl[rootKey] = 'current';
                    svgEl.innerHTML = renderSvg(hl);
                    showQueue([root.val]);
                    showResult([]);
                    infoEl.innerHTML = 'Queue = [' + root.val + '], 레벨 0 시작';
                },
                undo: function() {
                    svgEl.innerHTML = renderSvg({});
                    showQueue([]);
                    resultEl.innerHTML = '<strong>Result:</strong> <span style="color:var(--text3);">[]</span>';
                    infoEl.innerHTML = '<span style="color:var(--text2);">BFS로 레벨별 순회를 시작합니다.</span>';
                }
            });

            // BFS level by level
            var bfsQueue = [root];
            var doneKeys = {};
            var levelNum = 0;

            while (bfsQueue.length > 0) {
                var levelSize = bfsQueue.length;
                var levelVals = [];
                var levelCurrentHL = {};
                var nextQueue = [];

                // Process current level
                for (var i = 0; i < levelSize; i++) {
                    var node = bfsQueue[i];
                    var key = String(node.val) + '_' + node.idx;
                    levelVals.push(node.val);
                    doneKeys[key] = true;
                    if (node.left) nextQueue.push(node.left);
                    if (node.right) nextQueue.push(node.right);
                }

                result.push(levelVals.slice());
                var snapResult = result.map(function(a) { return a.slice(); });
                var snapDone = JSON.parse(JSON.stringify(doneKeys));
                var nextVals = nextQueue.map(function(n) { return n.val; });
                var snapNextVals = nextVals.slice();

                // Highlight: done keys as 'done', current level nodes as 'current' (during processing)
                var stepHL = {};
                Object.keys(snapDone).forEach(function(k) { stepHL[k] = 'done'; });
                // Mark current level as 'current' for display during step
                for (var i = 0; i < levelSize; i++) {
                    var node = bfsQueue[i];
                    var key = String(node.val) + '_' + node.idx;
                    stepHL[key] = 'current';
                }

                var childDesc = '';
                if (nextQueue.length > 0) {
                    var childNames = nextQueue.map(function(n) { return n.val; });
                    childDesc = '. 자식 ' + childNames.join(', ') + '을 큐에 추가';
                } else {
                    childDesc = '. 큐가 비었습니다!';
                }

                var lvlN = levelNum;
                var lvlVals = levelVals.slice();

                (function(hl, sResult, sNextVals, desc, lvlN, lvlVals) {
                    steps.push({
                        description: '레벨 ' + lvlN + ': 노드 ' + lvlVals.join(', ') + '을 처리합니다.',
                        action: function() {
                            svgEl.innerHTML = renderSvg(hl);
                            showQueue(sNextVals);
                            showResult(sResult);
                            infoEl.innerHTML = '레벨 ' + lvlN + ' 완료: [' + lvlVals.join(', ') + ']' + desc;
                        },
                        undo: function() {} // patched below
                    });
                })(JSON.parse(JSON.stringify(stepHL)), snapResult, snapNextVals, childDesc, lvlN, lvlVals);

                bfsQueue = nextQueue;
                levelNum++;
            }

            // Final step
            var allDone = {};
            layout.nodeOrder.forEach(function(k) { allDone[k] = 'done'; });
            var finalResult = result.map(function(a) { return a.slice(); });
            var resultStr = '[' + finalResult.map(function(a) { return '[' + a.join(', ') + ']'; }).join(', ') + ']';
            steps.push({
                description: '완성! 큐가 비었으므로 BFS 종료. 결과: ' + resultStr,
                action: function() {
                    svgEl.innerHTML = renderSvg(allDone);
                    showQueue([]);
                    showResult(finalResult);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 결과: ' + resultStr + '</strong>';
                },
                undo: function() {}
            });

            // Patch undo
            for (var i = 1; i < steps.length; i++) {
                (function(idx) {
                    var prevAction = steps[idx - 1].action;
                    steps[idx].undo = function() { prevAction(); };
                })(i);
            }

            return steps;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Level Order Traversal — BFS</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">트리 (level-order): <input type="text" id="tree-level-input" value="' + DEFAULT_TREE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="tree-level-reset">🔄</button></div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-bottom:12px;">BFS 순서로 입력. null = 빈 노드. 예: 3, 9, 20, null, null, 15, 7</p>' +
            self._createStepDesc(suffix) +
            '<div id="lvl-svg' + suffix + '"></div>' +
            '<div id="lvl-queue' + suffix + '" style="margin-bottom:8px;text-align:center;font-size:0.9rem;"><strong>Queue:</strong> <span style="color:var(--text3);">비어있음</span></div>' +
            '<div id="lvl-result' + suffix + '" style="margin-bottom:12px;text-align:center;font-size:0.9rem;"><strong>Result:</strong> <span style="color:var(--text3);">[]</span></div>' +
            '<div id="lvl-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">BFS로 레벨별 순회를 시작합니다.</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#lvl-svg' + suffix);
        var queueEl = container.querySelector('#lvl-queue' + suffix);
        var resultEl = container.querySelector('#lvl-result' + suffix);
        var infoEl = container.querySelector('#lvl-info' + suffix);

        function initSim(treeStr) {
            var steps = buildLevelSteps(treeStr, svgEl, queueEl, resultEl, infoEl);
            if (steps.length === 0) {
                svgEl.innerHTML = '<p style="color:var(--red);text-align:center;">유효한 트리를 입력하세요.</p>';
                return;
            }
            // Show initial SVG
            var parsed = self._parseLevelOrder(treeStr);
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);
            svgEl.innerHTML = self._makeTreeSvg(layout, {}, 460, svgH, 22);
            queueEl.innerHTML = '<strong>Queue:</strong> <span style="color:var(--text3);">비어있음</span>';
            resultEl.innerHTML = '<strong>Result:</strong> <span style="color:var(--text3);">[]</span>';
            infoEl.innerHTML = '<span style="color:var(--text2);">BFS로 레벨별 순회를 시작합니다.</span>';
            self._initStepController(container, steps, suffix);
        }

        initSim(DEFAULT_TREE);

        container.querySelector('#tree-level-reset').addEventListener('click', function() {
            var val = container.querySelector('#tree-level-input').value.trim();
            if (!val) val = DEFAULT_TREE;
            self._clearVizState();
            initSim(val);
        });
    },

    // ====================================================================
    // 시뮬레이션 4: Tree Traversal (boj-1991)
    // ====================================================================
    _renderVizTreeTraversal: function(container) {
        var self = this;
        var suffix = '-order';
        // Default: A-B-C-D-E-F-G mapped to level-order for input
        // The BOJ problem uses letters, so we keep letter support
        var DEFAULT_TREE = 'A, B, C, D, null, E, F, null, null, null, null, null, G';

        function buildTraversalSteps(treeStr, svgEl, preEl, inEl, postEl, infoEl) {
            var parsed = self._parseLevelOrder(treeStr);
            if (!parsed.length || !parsed[0]) return [];
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var svgW = 460;
            var layout = self._computeTreeLayout(root, svgW, 70, 40);

            // Compute traversal orders
            var preOrder = [], inOrder = [], postOrder = [];
            function preorderDFS(node) {
                if (!node) return;
                preOrder.push({ val: node.val, key: String(node.val) + '_' + node.idx });
                preorderDFS(node.left);
                preorderDFS(node.right);
            }
            function inorderDFS(node) {
                if (!node) return;
                inorderDFS(node.left);
                inOrder.push({ val: node.val, key: String(node.val) + '_' + node.idx });
                inorderDFS(node.right);
            }
            function postorderDFS(node) {
                if (!node) return;
                postorderDFS(node.left);
                postorderDFS(node.right);
                postOrder.push({ val: node.val, key: String(node.val) + '_' + node.idx });
            }
            preorderDFS(root);
            inorderDFS(root);
            postorderDFS(root);

            var sep = (typeof preOrder[0].val === 'string') ? '' : ' ';

            function renderSvg(highlights) {
                return self._makeTreeSvg(layout, highlights, svgW, svgH, 20);
            }

            var steps = [];

            // === Phase 1: Preorder ===
            var preCur = [];
            for (var pi = 0; pi < preOrder.length; pi++) {
                var item = preOrder[pi];
                preCur.push(item.val);
                var snapPre = preCur.slice();
                var hl = {};
                for (var j = 0; j < pi; j++) hl[preOrder[j].key] = 'done';
                hl[item.key] = 'pre';
                var isFirst = (pi === 0);
                var isLast = (pi === preOrder.length - 1);
                var desc = isFirst
                    ? '전위: 루트 ' + item.val + ' 방문 (출력 → 왼쪽 → 오른쪽)'
                    : '전위: ' + item.val + ' 방문';
                if (isLast) {
                    // Mark all done
                    for (var j = 0; j < preOrder.length; j++) hl[preOrder[j].key] = 'done';
                    desc = '전위 순회 완료!';
                }
                (function(snapPre, hl, desc) {
                    steps.push({
                        description: desc,
                        action: function() {
                            svgEl.innerHTML = renderSvg(hl);
                            preEl.textContent = snapPre.join(sep);
                            inEl.textContent = '';
                            postEl.textContent = '';
                            infoEl.innerHTML = desc;
                        },
                        undo: function() {}
                    });
                })(snapPre, JSON.parse(JSON.stringify(hl)), desc);
            }

            // === Phase 2: Inorder ===
            var fullPre = preOrder.map(function(x) { return x.val; }).join(sep);
            var inCur = [];
            for (var ii = 0; ii < inOrder.length; ii++) {
                var item = inOrder[ii];
                inCur.push(item.val);
                var snapIn = inCur.slice();
                var hl = {};
                for (var j = 0; j < ii; j++) hl[inOrder[j].key] = 'done';
                hl[item.key] = 'in';
                var isFirst = (ii === 0);
                var isLast = (ii === inOrder.length - 1);
                var desc = isFirst
                    ? '중위: 가장 왼쪽 ' + item.val + ' 먼저 방문 (왼쪽 → 출력 → 오른쪽)'
                    : '중위: ' + item.val + ' 방문';
                if (isLast) {
                    for (var j = 0; j < inOrder.length; j++) hl[inOrder[j].key] = 'done';
                    desc = '중위 순회 완료!';
                }
                (function(snapIn, hl, desc) {
                    steps.push({
                        description: desc,
                        action: function() {
                            svgEl.innerHTML = renderSvg(hl);
                            preEl.textContent = fullPre;
                            inEl.textContent = snapIn.join(sep);
                            postEl.textContent = '';
                            infoEl.innerHTML = desc;
                        },
                        undo: function() {}
                    });
                })(snapIn, JSON.parse(JSON.stringify(hl)), desc);
            }

            // === Phase 3: Postorder ===
            var fullIn = inOrder.map(function(x) { return x.val; }).join(sep);
            var postCur = [];
            for (var pti = 0; pti < postOrder.length; pti++) {
                var item = postOrder[pti];
                postCur.push(item.val);
                var snapPost = postCur.slice();
                var hl = {};
                for (var j = 0; j < pti; j++) hl[postOrder[j].key] = 'done';
                hl[item.key] = 'post';
                var isFirst = (pti === 0);
                var isLast = (pti === postOrder.length - 1);
                var desc = isFirst
                    ? '후위: 가장 깊은 왼쪽 ' + item.val + ' 먼저 (왼쪽 → 오른쪽 → 출력)'
                    : '후위: ' + item.val + ' 방문';
                if (isLast) {
                    for (var j = 0; j < postOrder.length; j++) hl[postOrder[j].key] = 'done';
                    desc = '후위: 루트 ' + item.val + ' 마지막 출력 — 후위 순회 완료!';
                }
                (function(snapPost, hl, desc) {
                    steps.push({
                        description: desc,
                        action: function() {
                            svgEl.innerHTML = renderSvg(hl);
                            preEl.textContent = fullPre;
                            inEl.textContent = fullIn;
                            postEl.textContent = snapPost.join(sep);
                            infoEl.innerHTML = desc;
                        },
                        undo: function() {}
                    });
                })(snapPost, JSON.parse(JSON.stringify(hl)), desc);
            }

            // Final step
            var fullPost = postOrder.map(function(x) { return x.val; }).join(sep);
            var allDone = {};
            layout.nodeOrder.forEach(function(k) { allDone[k] = 'done'; });
            steps.push({
                description: '완성! 전위: ' + fullPre + ', 중위: ' + fullIn + ', 후위: ' + fullPost,
                action: function() {
                    svgEl.innerHTML = renderSvg(allDone);
                    preEl.textContent = fullPre;
                    inEl.textContent = fullIn;
                    postEl.textContent = fullPost;
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 세 가지 순회 완료!</strong>';
                },
                undo: function() {}
            });

            // Patch undo
            for (var i = 1; i < steps.length; i++) {
                (function(idx) {
                    var prevAction = steps[idx - 1].action;
                    steps[idx].undo = function() { prevAction(); };
                })(i);
            }
            steps[0].undo = function() {
                svgEl.innerHTML = renderSvg({});
                preEl.textContent = '';
                inEl.textContent = '';
                postEl.textContent = '';
                infoEl.innerHTML = '<span style="color:var(--text2);">세 가지 순회를 단계별로 진행합니다.</span>';
            };

            return steps;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">트리 순회 — 전위/중위/후위</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">트리 (level-order): <input type="text" id="tree-trav-input" value="' + DEFAULT_TREE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:380px;"></label>' +
            '<button class="btn btn-primary" id="tree-trav-reset">🔄</button></div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-bottom:12px;">BFS 순서로 입력. null = 빈 노드. 예: A, B, C, D, null, E, F</p>' +
            self._createStepDesc(suffix) +
            '<div id="trav-svg' + suffix + '"></div>' +
            '<div id="trav-pre' + suffix + '" style="margin-bottom:4px;font-size:0.9rem;"><strong style="color:var(--accent);">전위:</strong> <span id="trav-pre-val' + suffix + '"></span></div>' +
            '<div id="trav-in' + suffix + '" style="margin-bottom:4px;font-size:0.9rem;"><strong style="color:var(--green);">중위:</strong> <span id="trav-in-val' + suffix + '"></span></div>' +
            '<div id="trav-post' + suffix + '" style="margin-bottom:12px;font-size:0.9rem;"><strong style="color:#e17055;">후위:</strong> <span id="trav-post-val' + suffix + '"></span></div>' +
            '<div id="trav-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">세 가지 순회를 단계별로 진행합니다.</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#trav-svg' + suffix);
        var preEl = container.querySelector('#trav-pre-val' + suffix);
        var inEl = container.querySelector('#trav-in-val' + suffix);
        var postEl = container.querySelector('#trav-post-val' + suffix);
        var infoEl = container.querySelector('#trav-info' + suffix);

        function initSim(treeStr) {
            var steps = buildTraversalSteps(treeStr, svgEl, preEl, inEl, postEl, infoEl);
            if (steps.length === 0) {
                svgEl.innerHTML = '<p style="color:var(--red);text-align:center;">유효한 트리를 입력하세요.</p>';
                return;
            }
            // Show initial SVG
            var parsed = self._parseLevelOrder(treeStr);
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);
            svgEl.innerHTML = self._makeTreeSvg(layout, {}, 460, svgH, 20);
            preEl.textContent = '';
            inEl.textContent = '';
            postEl.textContent = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">세 가지 순회를 단계별로 진행합니다.</span>';
            self._initStepController(container, steps, suffix);
        }

        initSim(DEFAULT_TREE);

        container.querySelector('#tree-trav-reset').addEventListener('click', function() {
            var val = container.querySelector('#tree-trav-input').value.trim();
            if (!val) val = DEFAULT_TREE;
            self._clearVizState();
            initSim(val);
        });
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>이진 트리의 <code>root</code>가 주어졌을 때, 최대 깊이를 반환하세요. 이진 트리의 <strong>최대 깊이</strong>는 루트 노드에서 가장 먼 리프 노드까지의 가장 긴 경로에 있는 노드의 수입니다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>root = [3,9,20,null,null,15,7]</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>root = [1,null,2]</pre></div>
                    <div><strong>출력</strong><pre>2</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>노드 수는 <code>[0, 10<sup>4</sup>]</code> 범위입니다.</li>
                    <li><code>-100 ≤ Node.val ≤ 100</code></li>
                </ul>
            `,
            hints: [
                { title: '트리의 깊이를 어떻게 잴까?', content: '트리의 "최대 깊이"를 구하려면 결국 <strong>모든 노드를 방문</strong>하면서 깊이를 추적해야 합니다.<br><br>방법은 두 가지가 떠오릅니다:<br>1. <strong>BFS</strong>로 레벨별로 내려가면서 레벨 수를 세기<br>2. <strong>DFS</strong>로 깊이 내려가면서 최대 깊이를 추적하기<br><br>어느 쪽이든 "모든 노드 방문"은 피할 수 없으니, 더 간결한 방법을 찾아봅시다.' },
                { title: '재귀적으로 생각해보자', content: '트리 문제는 재귀와 찰떡입니다. 이렇게 생각해보세요:<br><br><strong>"이 노드의 최대 깊이 = 1 + max(왼쪽 깊이, 오른쪽 깊이)"</strong><br><br>왼쪽 서브트리의 깊이와 오른쪽 서브트리의 깊이 중 큰 값에 현재 노드(+1)를 더하면 됩니다.<br><br>기저 조건: 노드가 없으면(<span class="lang-py"><code>None</code></span><span class="lang-cpp"><code>nullptr</code></span>) 깊이는 <strong>0</strong>입니다.' },
                { title: '코드 한 줄로!', content: '재귀의 힘을 느껴보세요 — 이 한 줄이 전부입니다:<br><br><span class="lang-py"><code>return 0 if not root else 1 + max(depth(root.left), depth(root.right))</code></span><span class="lang-cpp"><code>return !root ? 0 : 1 + max(maxDepth(root->left), maxDepth(root->right));</code></span><br><br>"빈 노드면 0, 아니면 1 + 자식 중 큰 깊이" — 이게 전부입니다!' }
            ],
            templates: {
                python: '# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\nclass Solution:\n    def maxDepth(self, root) -> int:\n        if not root:\n            return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))',
                cpp: '/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n * };\n */\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (!root) return 0;\n        return 1 + max(maxDepth(root->left), maxDepth(root->right));\n    }\n};'
            },
            solutions: [{
                approach: '재귀 DFS',
                description: '빈 노드면 0을 반환하고, 그렇지 않으면 왼쪽/오른쪽 서브트리 깊이 중 큰 값 + 1을 반환합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(h)',
                codeSteps: {
                    python: [
                        { title: '기저 조건', desc: '빈 노드면 깊이 0을 반환하여 재귀를 멈춘다.', code: 'if not root:\n    return 0' },
                        { title: '재귀 호출', desc: '왼쪽/오른쪽 서브트리의 깊이를 각각 재귀로 구한다.', code: 'left = self.maxDepth(root.left)\nright = self.maxDepth(root.right)' },
                        { title: '결과 반환', desc: '현재 노드(+1)와 자식 중 더 깊은 쪽을 합치면 전체 깊이가 된다.', code: 'return 1 + max(left, right)' }
                    ],
                    cpp: [
                        { title: '기저 조건', desc: '빈 노드(nullptr)면 깊이 0.', code: 'if (!root) return 0;' },
                        { title: '재귀 호출', desc: '->로 포인터의 멤버 접근.', code: 'int left = maxDepth(root->left);\nint right = maxDepth(root->right);' },
                        { title: '결과 반환', desc: '현재 노드(+1) + 자식 중 큰 깊이 = 전체 최대 깊이.', code: 'return 1 + max(left, right);' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>이진 트리의 <code>root</code>가 주어졌을 때, 트리를 좌우 반전(뒤집기)하여 반환하세요. 모든 노드의 왼쪽 자식과 오른쪽 자식을 서로 바꿉니다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>root = [4,2,7,1,3,6,9]</pre></div>
                    <div><strong>출력</strong><pre>[4,7,2,9,6,3,1]</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>root = [2,1,3]</pre></div>
                    <div><strong>출력</strong><pre>[2,3,1]</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>root = []</pre></div>
                    <div><strong>출력</strong><pre>[]</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>노드 수는 <code>[0, 100]</code> 범위입니다.</li>
                    <li><code>-100 ≤ Node.val ≤ 100</code></li>
                </ul>
            `,
            hints: [
                { title: '뒤집기 = 왼쪽과 오른쪽을 바꾸기', content: '"트리를 뒤집는다"는 말이 거창해 보이지만, 사실 <strong>모든 노드에서 왼쪽 자식과 오른쪽 자식을 swap</strong>하면 끝입니다.<br><br>모든 노드를 방문해야 하므로 DFS든 BFS든 어떤 순회 방법이든 OK. 핵심은 "빠짐없이 모든 노드에서 swap"입니다.' },
                { title: '재귀로 간단하게', content: '재귀로 구현하면 아주 깔끔합니다:<br><br>1. 현재 노드의 <code>left</code>와 <code>right</code>를 <strong>swap</strong><br>2. 왼쪽 서브트리를 재귀로 뒤집기<br>3. 오른쪽 서브트리를 재귀로 뒤집기<br><br>기저 조건: 노드가 없으면(<span class="lang-py"><code>None</code></span><span class="lang-cpp"><code>nullptr</code></span>) 그냥 return.' },
                { title: '순서가 중요할까?', content: '흥미로운 점 — swap과 재귀의 순서에 따라 전위/후위가 달라집니다:<br><br><strong>전위</strong> (swap 먼저 → 재귀): 현재 노드를 swap한 뒤 자식들을 뒤집기<br><strong>후위</strong> (재귀 먼저 → swap): 자식들을 먼저 뒤집고 나서 현재 노드를 swap<br><br>둘 다 정상 동작합니다. 하지만 <strong>중위</strong>(왼쪽 재귀 → swap → 오른쪽 재귀)는 주의! swap 후에 왼쪽/오른쪽이 바뀌어서, 같은 쪽을 두 번 뒤집게 됩니다.' }
            ],
            templates: {
                python: 'class Solution:\n    def invertTree(self, root):\n        if not root:\n            return None\n        root.left, root.right = root.right, root.left\n        self.invertTree(root.left)\n        self.invertTree(root.right)\n        return root',
                cpp: 'class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (!root) return nullptr;\n        swap(root->left, root->right);\n        invertTree(root->left);\n        invertTree(root->right);\n        return root;\n    }\n};'
            },
            solutions: [{
                approach: '재귀 좌우 교환',
                description: '각 노드에서 왼쪽/오른쪽 자식을 교환하고, 재귀적으로 서브트리도 반전합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(h)',
                codeSteps: {
                    python: [
                        { title: '기저 조건', desc: '빈 노드면 교환할 게 없으므로 None 반환.', code: 'if not root:\n    return None' },
                        { title: '좌우 교환', desc: '현재 노드의 왼쪽/오른쪽 자식을 동시에 교환한다.', code: 'root.left, root.right = root.right, root.left' },
                        { title: '재귀 호출 + 반환', desc: '교환 후 자식 서브트리도 재귀적으로 반전시킨다.', code: 'self.invertTree(root.left)\nself.invertTree(root.right)\nreturn root' }
                    ],
                    cpp: [
                        { title: '기저 조건', desc: 'nullptr이면 교환할 자식이 없으므로 바로 반환.', code: 'if (!root) return nullptr;' },
                        { title: '좌우 교환', desc: 'swap()으로 포인터 교환. Python의 동시 대입과 동일.', code: 'swap(root->left, root->right);' },
                        { title: '재귀 호출 + 반환', desc: '교환 후 자식 서브트리도 재귀적으로 반전 처리.', code: 'invertTree(root->left);\ninvertTree(root->right);\nreturn root;' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>이진 트리의 <code>root</code>가 주어졌을 때, 노드 값의 <strong>레벨 순서 순회(level order traversal)</strong>를 반환하세요. 즉, 왼쪽에서 오른쪽으로, 레벨별로 노드 값을 반환합니다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>root = [3,9,20,null,null,15,7]</pre></div>
                    <div><strong>출력</strong><pre>[[3],[9,20],[15,7]]</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>root = [1]</pre></div>
                    <div><strong>출력</strong><pre>[[1]]</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>root = []</pre></div>
                    <div><strong>출력</strong><pre>[]</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>노드 수는 <code>[0, 2000]</code> 범위입니다.</li>
                    <li><code>-1000 ≤ Node.val ≤ 1000</code></li>
                </ul>
            `,
            hints: [
                { title: '레벨별로 나누려면?', content: '트리를 위에서 아래로, <strong>같은 레벨끼리 묶어야</strong> 합니다.<br><br>DFS로도 가능합니다 — 깊이를 추적하면서 해당 레벨의 리스트에 추가하면 됩니다. 하지만 더 자연스러운 방법이 있습니다...' },
                { title: 'BFS가 딱이다!', content: '<strong>BFS(너비 우선 탐색)</strong>는 원래 레벨별로 탐색하는 알고리즘이니, 이 문제에 딱입니다!<br><br>핵심 트릭: <strong>현재 큐의 크기(size)만큼만 pop</strong>하면 정확히 한 레벨이 끝납니다.<br><br>큐에서 노드를 꺼내면서 자식을 넣으면, 다음 레벨이 자연스럽게 큐에 쌓입니다.' },
                { title: '<span class="lang-py">Python: collections.deque</span><span class="lang-cpp">C++: queue</span>', content: '<span class="lang-py">Python의 <code>collections.deque</code>를 사용하면 <code>popleft()</code>가 O(1)입니다. 일반 리스트의 <code>pop(0)</code>은 O(n)이라 느립니다!<br><br><code>for _ in range(len(queue)):</code>로 현재 레벨 크기만큼만 처리하고, <code>queue.append()</code>로 자식을 추가합니다.</span><span class="lang-cpp">C++의 <code>queue&lt;TreeNode*&gt;</code>를 사용합니다. <code>q.front()</code>으로 꺼내고 <code>q.pop()</code>으로 제거.<br><br>중요: <code>int sz = q.size();</code>를 <strong>반복문 전에 미리 저장</strong>해야 합니다. 반복 중에 <code>q.push()</code>로 자식을 추가하면 <code>q.size()</code>가 바뀌니까요!</span>' }
            ],
            templates: {
                python: 'from collections import deque\n\nclass Solution:\n    def levelOrder(self, root):\n        if not root:\n            return []\n        result = []\n        queue = deque([root])\n        while queue:\n            level = []\n            for _ in range(len(queue)):\n                node = queue.popleft()\n                level.append(node.val)\n                if node.left:  queue.append(node.left)\n                if node.right: queue.append(node.right)\n            result.append(level)\n        return result',
                cpp: 'class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        vector<vector<int>> result;\n        if (!root) return result;\n        queue<TreeNode*> q;\n        q.push(root);\n        while (!q.empty()) {\n            int sz = q.size();\n            vector<int> level;\n            for (int i = 0; i < sz; i++) {\n                TreeNode* node = q.front(); q.pop();\n                level.push_back(node->val);\n                if (node->left)  q.push(node->left);\n                if (node->right) q.push(node->right);\n            }\n            result.push_back(level);\n        }\n        return result;\n    }\n};'
            },
            solutions: [{
                approach: 'BFS (큐 사용)',
                description: '큐에 루트를 넣고, 매 레벨마다 큐 크기만큼 노드를 꺼내 처리합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '초기화', desc: '결과 리스트와 BFS용 큐를 준비하고, 루트를 큐에 넣는다.', code: 'result = []\nqueue = deque([root])' },
                        { title: '레벨별 처리', desc: '큐의 현재 크기만큼만 꺼내면 같은 레벨 노드만 처리된다.', code: 'while queue:\n    level = []\n    for _ in range(len(queue)):\n        node = queue.popleft()\n        level.append(node.val)' },
                        { title: '자식 추가 + 결과 반환', desc: '꺼낸 노드의 자식을 큐에 넣으면 다음 레벨이 자동으로 구성된다.', code: '        if node.left:  queue.append(node.left)\n        if node.right: queue.append(node.right)\n    result.append(level)\nreturn result' }
                    ],
                    cpp: [
                        { title: '초기화', desc: '결과 벡터와 BFS용 큐를 준비하고, 루트를 큐에 넣는다.', code: 'vector<vector<int>> result;\nqueue<TreeNode*> q;\nq.push(root);' },
                        { title: '레벨별 처리', desc: 'q.size()를 미리 저장 → 현재 레벨 크기만큼만 처리.', code: 'while (!q.empty()) {\n    int sz = q.size();  // 현재 레벨 크기\n    vector<int> level;\n    for (int i = 0; i < sz; i++) {\n        TreeNode* node = q.front(); q.pop();\n        level.push_back(node->val);' },
                        { title: '자식 추가 + 결과 반환', desc: '자식 노드를 큐에 넣으면 다음 레벨이 자연스럽게 구성된다.', code: '        if (node->left)  q.push(node->left);\n        if (node->right) q.push(node->right);\n    }\n    result.push_back(level);\n}\nreturn result;' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>이진 트리를 입력받아 전위 순회(preorder), 중위 순회(inorder), 후위 순회(postorder)한 결과를 출력하는 프로그램을 작성하시오.</p>
                <p>예를 들어 위와 같은 이진 트리가 입력되면,</p>
                <ul>
                    <li>전위 순회한 결과: ABDCEFG</li>
                    <li>중위 순회한 결과: DBAECFG</li>
                    <li>후위 순회한 결과: DBEGFCA</li>
                </ul>
                <p>가 된다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>7
A B C
B D .
C E F
D . .
E . .
F . G
G . .</pre></div>
                    <div><strong>출력</strong><pre>ABDCEFG
DBAECFG
DBEGFCA</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li><code>1 ≤ N ≤ 26</code></li>
                    <li>노드 이름은 A부터 차례대로 대문자 알파벳으로 매겨진다.</li>
                    <li>항상 A가 루트 노드가 된다.</li>
                </ul>
            `,
            hints: [
                { title: '전위·중위·후위, 순서만 다르다', content: '세 순회 모두 <strong>왼쪽 → 오른쪽</strong> 방향으로 방문하되, <strong>"현재 노드를 언제 출력하느냐"</strong>만 다릅니다:<br><br><strong>전위</strong>: 먼저 출력 → 왼 → 오 (루트가 맨 앞)<br><strong>중위</strong>: 왼 → 출력 → 오 (루트가 가운데)<br><strong>후위</strong>: 왼 → 오 → 출력 (루트가 맨 뒤)<br><br>이걸 기억하면 재귀 코드가 바로 나옵니다!' },
                { title: '입력을 어떻게 저장할까?', content: '입력이 <code>A B C</code> 형태로 주어지니, 이걸 어딘가에 저장해야 합니다.<br><br><span class="lang-py"><code>dict</code>에 <code>tree[node] = (left, right)</code> 형태로 저장하면, 재귀 호출 시 <code>tree["A"]</code>로 바로 자식에 접근 가능!</span><span class="lang-cpp"><code>map&lt;char, pair&lt;char, char&gt;&gt;</code>에 저장하면, <code>tree[\'A\'].first</code>로 왼쪽 자식, <code>.second</code>로 오른쪽 자식에 접근 가능!</span><br><br>자식이 없으면 <code>.</code>으로 표시되니, <code>.</code>이면 재귀를 멈추면 됩니다.' },
                { title: '재귀 함수 하나로 세 가지 순회', content: '재귀 함수의 구조는 동일하고, <strong><span class="lang-py"><code>print(node)</code></span><span class="lang-cpp"><code>cout &lt;&lt; node</code></span> 위치만 바꾸면</strong> 세 가지 순회가 완성됩니다:<br><br><span class="lang-py"><pre>def traverse(node):\n    if node == \'.\': return\n    # print(node) ← 여기면 전위\n    traverse(tree[node][0])\n    # print(node) ← 여기면 중위\n    traverse(tree[node][1])\n    # print(node) ← 여기면 후위</pre></span><span class="lang-cpp"><pre>void traverse(char node) {\n    if (node == \'.\') return;\n    // cout << node; ← 여기면 전위\n    traverse(tree[node].first);\n    // cout << node; ← 여기면 중위\n    traverse(tree[node].second);\n    // cout << node; ← 여기면 후위\n}</pre></span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ntree = {}\nfor _ in range(N):\n    node, left, right = input().split()\n    tree[node] = (left, right)\n\ndef preorder(node):\n    if node == \'.\':\n        return\n    print(node, end=\'\')\n    preorder(tree[node][0])\n    preorder(tree[node][1])\n\ndef inorder(node):\n    if node == \'.\':\n        return\n    inorder(tree[node][0])\n    print(node, end=\'\')\n    inorder(tree[node][1])\n\ndef postorder(node):\n    if node == \'.\':\n        return\n    postorder(tree[node][0])\n    postorder(tree[node][1])\n    print(node, end=\'\')\n\npreorder(\'A\')\nprint()\ninorder(\'A\')\nprint()\npostorder(\'A\')\nprint()',
                cpp: '#include <iostream>\n#include <map>\nusing namespace std;\n\nmap<char, pair<char, char>> tree;\n\nvoid preorder(char node) {\n    if (node == \'.\') return;\n    cout << node;\n    preorder(tree[node].first);\n    preorder(tree[node].second);\n}\n\nvoid inorder(char node) {\n    if (node == \'.\') return;\n    inorder(tree[node].first);\n    cout << node;\n    inorder(tree[node].second);\n}\n\nvoid postorder(char node) {\n    if (node == \'.\') return;\n    postorder(tree[node].first);\n    postorder(tree[node].second);\n    cout << node;\n}\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    for (int i = 0; i < N; i++) {\n        char node, left, right;\n        scanf(" %c %c %c", &node, &left, &right);\n        tree[node] = {left, right};\n    }\n    preorder(\'A\'); cout << "\\n";\n    inorder(\'A\');  cout << "\\n";\n    postorder(\'A\'); cout << "\\n";\n    return 0;\n}'
            },
            solutions: [{
                approach: '재귀 순회',
                description: '트리를 딕셔너리에 저장한 뒤, 재귀 함수로 전위/중위/후위 순회를 수행합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '트리 입력 저장', desc: '딕셔너리에 각 노드의 왼쪽/오른쪽 자식을 저장한다.', code: 'tree = {}\nfor _ in range(N):\n    node, left, right = input().split()\n    tree[node] = (left, right)' },
                        { title: '전위 순회', desc: '출력→왼쪽→오른쪽 순서. 루트를 가장 먼저 방문한다.', code: 'def preorder(node):\n    if node == \'.\':\n        return\n    print(node, end=\'\')\n    preorder(tree[node][0])\n    preorder(tree[node][1])' },
                        { title: '중위/후위 순회', desc: '중위: 왼→출력→오, 후위: 왼→오→출력. 출력 위치만 다르다.', code: 'def inorder(node):\n    if node == \'.\': return\n    inorder(tree[node][0])\n    print(node, end=\'\')\n    inorder(tree[node][1])\n\ndef postorder(node):\n    if node == \'.\': return\n    postorder(tree[node][0])\n    postorder(tree[node][1])\n    print(node, end=\'\')' }
                    ],
                    cpp: [
                        { title: '트리 입력 저장', desc: 'map<char, pair<char,char>>로 자식 저장.\nPython의 dict와 같은 역할.', code: 'map<char, pair<char, char>> tree;\nfor (int i = 0; i < N; i++) {\n    char node, left, right;\n    scanf(" %c %c %c", &node, &left, &right);\n    tree[node] = {left, right};\n}' },
                        { title: '전위 순회', desc: '출력 → 왼쪽 → 오른쪽 순서.\n.first = 왼쪽, .second = 오른쪽.', code: 'void preorder(char node) {\n    if (node == \'.\') return;\n    cout << node;\n    preorder(tree[node].first);\n    preorder(tree[node].second);\n}' },
                        { title: '중위/후위 순회', desc: '중위: 왼→출력→오, 후위: 왼→오→출력. cout 위치만 다르다.', code: 'void inorder(char node) {\n    if (node == \'.\') return;\n    inorder(tree[node].first);\n    cout << node;\n    inorder(tree[node].second);\n}\n\nvoid postorder(char node) {\n    if (node == \'.\') return;\n    postorder(tree[node].first);\n    postorder(tree[node].second);\n    cout << node;\n}' }
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
