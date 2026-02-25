// ===== 트리 토픽 모듈 =====
const treeTopic = {
    id: 'tree',
    title: '트리',
    icon: '🌳',
    category: '재귀와 트리',
    order: 9,
    description: '계층 구조를 표현하는 트리와 다양한 순회 방법을 배웁니다',
    relatedNote: '이 외에도 이진 탐색 트리(BST), 세그먼트 트리, AVL/레드블랙 트리 등의 심화 트리 자료구조가 있습니다.',

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🌳 트리 (Tree)</h2>
                <p class="hero-sub">계층 구조를 표현하는 트리 자료구조와 순회 방법을 배웁니다</p>
            </div>

            <!-- ① 트리란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 트리란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 여러분의 <strong>가족 관계도</strong>를 떠올려 보세요!<br><br>
                    맨 위에 <strong>할아버지(루트)</strong>가 계시고, 아래로 <strong>아버지, 삼촌(자식 노드)</strong>이 있습니다.<br>
                    아버지 아래에는 <strong>나와 동생(손자 노드)</strong>이 있고요.<br>
                    더 이상 아래에 아무도 없는 사람이 <strong>리프(잎) 노드</strong>입니다.<br><br>
                    이렇게 위에서 아래로 뻗어 나가는 구조가 바로 <strong>트리</strong>입니다!<br>
                    폴더 구조, 조직도, HTML DOM 모두 트리입니다.
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="14" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="21" y1="14" x2="16" y2="26" stroke="currentColor" stroke-width="2"/><line x1="27" y1="14" x2="32" y2="26" stroke="currentColor" stroke-width="2"/></svg></span></div>
                        <h3>노드(Node)와 간선(Edge)</h3>
                        <p>노드는 데이터를 담는 점이고, 간선은 노드 사이를 연결하는 줄입니다.<br>N개의 노드가 있으면 간선은 <strong>N-1개</strong>입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="5" fill="#e17055" stroke="currentColor" stroke-width="2"/><text x="24" y="11" text-anchor="middle" font-size="8" fill="white">R</text><circle cx="14" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="24" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="24" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>루트(Root)</h3>
                        <p>트리의 <strong>가장 꼭대기</strong>에 있는 노드입니다.<br>부모가 없는 유일한 노드입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="42" r="4" fill="#00b894" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="42" r="4" fill="#00b894" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="24" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="24" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="31" x2="9" y2="38" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="31" x2="19" y2="38" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>리프(Leaf)</h3>
                        <p>자식이 없는 노드를 <strong>리프(잎)</strong> 노드라고 합니다.<br>트리의 맨 끝 노드들입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="8" y="20" width="32" height="24" rx="4" fill="none" stroke="#0984e3" stroke-width="2" stroke-dasharray="4,2"/><circle cx="14" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="42" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="20" cy="42" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="21" y1="12" x2="16" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="33" x2="9" y2="39" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="33" x2="19" y2="39" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>서브트리(Subtree)</h3>
                        <p>어떤 노드를 루트로 하는 <strong>부분 트리</strong>입니다.<br>트리의 재귀적 성질을 이용할 때 핵심입니다!</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">노드가 7개인 트리에서 간선은 몇 개일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>6개</strong>입니다!<br>
                        트리에서 노드가 N개이면 간선은 항상 <strong>N-1개</strong>입니다.<br>
                        루트를 제외한 모든 노드는 정확히 하나의 부모와 연결되기 때문입니다.
                    </div>
                </div>
            </div>

            <!-- ② 이진 트리 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 이진 트리</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> <strong>"예/아니오 퀴즈"</strong>를 생각해 보세요!<br><br>
                    "동물인가요?" → 예 → "날 수 있나요?" → 아니오 → "다리가 4개인가요?" → ...<br>
                    매 질문마다 <strong>왼쪽(예) 또는 오른쪽(아니오)</strong>, 두 갈래로 나뉩니다.<br><br>
                    이렇게 각 노드가 <strong>최대 2개의 자식</strong>만 가지는 트리를 <strong>이진 트리</strong>라고 합니다!<br>
                    알고리즘에서 가장 많이 다루는 트리 형태입니다.
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="14" cy="28" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="28" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="21" y1="12" x2="16" y2="24" stroke="currentColor" stroke-width="2"/><line x1="27" y1="12" x2="32" y2="24" stroke="currentColor" stroke-width="2"/></svg></span></div>
                        <h3>이진 트리</h3>
                        <p>각 노드가 <strong>최대 2개</strong>의 자식(왼쪽, 오른쪽)을 가집니다.<br>가장 기본적인 트리 형태입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="6" r="4" fill="currentColor" opacity="0.7"/><circle cx="14" cy="20" r="4" fill="currentColor" opacity="0.7"/><circle cx="34" cy="20" r="4" fill="currentColor" opacity="0.7"/><circle cx="8" cy="34" r="4" fill="currentColor" opacity="0.7"/><circle cx="20" cy="34" r="4" fill="currentColor" opacity="0.7"/><circle cx="28" cy="34" r="4" fill="currentColor" opacity="0.7"/><line x1="21" y1="9" x2="16" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="9" x2="32" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="23" x2="9" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="23" x2="19" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="31" y1="23" x2="29" y2="31" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>완전 이진 트리</h3>
                        <p>마지막 레벨을 제외하고 모든 레벨이 꽉 차 있으며,<br>마지막 레벨은 <strong>왼쪽부터</strong> 채웁니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="6" r="4" fill="currentColor" opacity="0.8"/><circle cx="14" cy="20" r="4" fill="currentColor" opacity="0.8"/><circle cx="34" cy="20" r="4" fill="currentColor" opacity="0.8"/><circle cx="8" cy="34" r="4" fill="currentColor" opacity="0.8"/><circle cx="20" cy="34" r="4" fill="currentColor" opacity="0.8"/><circle cx="28" cy="34" r="4" fill="currentColor" opacity="0.8"/><circle cx="40" cy="34" r="4" fill="currentColor" opacity="0.8"/><line x1="21" y1="9" x2="16" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="9" x2="32" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="23" x2="9" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="23" x2="19" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="31" y1="23" x2="29" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="37" y1="23" x2="39" y2="31" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>포화 이진 트리</h3>
                        <p>모든 레벨이 <strong>완전히</strong> 채워진 트리입니다.<br>높이 h일 때 노드 수 = <strong>2^(h+1) - 1</strong></p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 이진 트리 노드 정의
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left    # 왼쪽 자식
        self.right = right  # 오른쪽 자식

# 높이가 h인 이진 트리의 최대 노드 수: 2^(h+1) - 1
# 노드가 N개인 완전 이진 트리의 높이: O(log N)
# 예) N = 1,000,000이면 높이 ≈ 20 (아주 낮습니다!)</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">높이가 3인 포화 이진 트리의 노드 수는 몇 개일까요? (루트의 높이 = 0)</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>15개</strong>입니다!<br>
                        높이 h인 포화 이진 트리의 노드 수 = 2^(h+1) - 1 = 2^4 - 1 = <strong>15</strong><br>
                        레벨 0: 1개, 레벨 1: 2개, 레벨 2: 4개, 레벨 3: 8개 → 합계 15개입니다.
                    </div>
                </div>
            </div>

            <!-- ③ 트리 순회 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 트리 순회</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> <strong>미술관 관람</strong>을 생각해 보세요!<br><br>
                    미술관의 각 방(노드)을 어떤 순서로 돌지에 따라 방법이 달라집니다.<br>
                    <strong>전위(Preorder)</strong>: 방에 들어가자마자 <strong>먼저 감상</strong>하고, 왼쪽 방 → 오른쪽 방으로 이동합니다.<br>
                    <strong>중위(Inorder)</strong>: 왼쪽 방을 먼저 보고, <strong>돌아와서 감상</strong>한 후, 오른쪽 방으로 갑니다.<br>
                    <strong>후위(Postorder)</strong>: 왼쪽, 오른쪽 방을 다 보고 <strong>마지막에 감상</strong>합니다.<br>
                    <strong>레벨(BFS)</strong>: 1층 방을 다 보고, 2층, 3층... 순서대로 봅니다.
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card" style="border-color: var(--accent);">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="var(--accent)" opacity="0.8"/><text x="24" y="13" text-anchor="middle" font-size="8" fill="white">1</text><circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="14" y="33" text-anchor="middle" font-size="8" fill="currentColor">2</text><circle cx="34" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="33" text-anchor="middle" font-size="8" fill="currentColor">3</text><line x1="20" y1="15" x2="16" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="32" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>전위 순회 (Preorder)</h3>
                        <p><strong>루트 → 왼쪽 → 오른쪽</strong><br>부모를 먼저 방문합니다.<br>트리 복사, 직렬화에 사용됩니다.</p>
                    </div>
                    <div class="concept-card" style="border-color: var(--green);">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="13" text-anchor="middle" font-size="8" fill="currentColor">2</text><circle cx="14" cy="30" r="6" fill="var(--green)" opacity="0.8"/><text x="14" y="33" text-anchor="middle" font-size="8" fill="white">1</text><circle cx="34" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="33" text-anchor="middle" font-size="8" fill="currentColor">3</text><line x1="20" y1="15" x2="16" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="32" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>중위 순회 (Inorder)</h3>
                        <p><strong>왼쪽 → 루트 → 오른쪽</strong><br>BST에서 <strong>정렬된 순서</strong>로 출력됩니다!<br>가장 자주 나오는 순회입니다.</p>
                    </div>
                    <div class="concept-card" style="border-color: var(--yellow);">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="13" text-anchor="middle" font-size="8" fill="currentColor">3</text><circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="14" y="33" text-anchor="middle" font-size="8" fill="currentColor">1</text><circle cx="34" cy="30" r="6" fill="var(--yellow)" opacity="0.8"/><text x="34" y="33" text-anchor="middle" font-size="8" fill="white">2</text><line x1="20" y1="15" x2="16" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="32" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>후위 순회 (Postorder)</h3>
                        <p><strong>왼쪽 → 오른쪽 → 루트</strong><br>자식을 먼저 처리한 후 부모를 처리합니다.<br>트리 삭제, 수식 평가에 사용됩니다.</p>
                    </div>
                    <div class="concept-card" style="border-color: var(--red);">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="5" fill="var(--red)" opacity="0.7"/><text x="24" y="11" text-anchor="middle" font-size="7" fill="white">1</text><circle cx="14" cy="24" r="5" fill="var(--red)" opacity="0.5"/><text x="14" y="27" text-anchor="middle" font-size="7" fill="white">2</text><circle cx="34" cy="24" r="5" fill="var(--red)" opacity="0.5"/><text x="34" y="27" text-anchor="middle" font-size="7" fill="white">2</text><circle cx="8" cy="40" r="5" fill="var(--red)" opacity="0.3"/><text x="8" y="43" text-anchor="middle" font-size="7" fill="white">3</text><circle cx="20" cy="40" r="5" fill="var(--red)" opacity="0.3"/><text x="20" y="43" text-anchor="middle" font-size="7" fill="white">3</text><line x1="20" y1="12" x2="16" y2="20" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="12" x2="32" y2="20" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="28" x2="9" y2="36" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="28" x2="19" y2="36" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>레벨 순회 (BFS)</h3>
                        <p><strong>레벨 0 → 레벨 1 → 레벨 2 → ...</strong><br>큐(Queue)를 사용합니다.<br>레벨별 처리가 필요할 때 사용합니다.</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 전위 순회 (Preorder): 루트 → 왼쪽 → 오른쪽
def preorder(node):
    if node is None:
        return
    print(node.val, end=' ')  # 루트 먼저!
    preorder(node.left)
    preorder(node.right)

# 중위 순회 (Inorder): 왼쪽 → 루트 → 오른쪽
def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.val, end=' ')  # 중간에!
    inorder(node.right)

# 후위 순회 (Postorder): 왼쪽 → 오른쪽 → 루트
def postorder(node):
    if node is None:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.val, end=' ')  # 마지막에!

# 레벨 순회 (BFS): 큐 사용
from collections import deque
def level_order(root):
    if not root:
        return
    queue = deque([root])
    while queue:
        node = queue.popleft()
        print(node.val, end=' ')
        if node.left:  queue.append(node.left)
        if node.right: queue.append(node.right)</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">이진 트리 [1, 2, 3, 4, 5, 6, 7]의 중위 순회 결과는 무엇일까요? (1이 루트, 2/3이 자식, 4/5/6/7이 손자)</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        중위 순회 (왼쪽 → 루트 → 오른쪽) 결과: <strong>4 2 5 1 6 3 7</strong><br><br>
                        왼쪽 서브트리(4→2→5)를 먼저 방문하고, 루트(1), 오른쪽 서브트리(6→3→7)를 방문합니다.<br>
                        전위 순회: 1 2 4 5 3 6 7 | 후위 순회: 4 5 2 6 7 3 1
                    </div>
                </div>
            </div>

            <!-- ④ 트리 활용 패턴 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 트리 활용 패턴</div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="36" r="4" fill="#0984e3" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="25" x2="9" y2="33" stroke="#0984e3" stroke-width="2.5"/><path d="M4 42 L8 36 L12 42" fill="none" stroke="#0984e3" stroke-width="2"/></svg></span></div>
                        <h3>깊이 구하기 (DFS)</h3>
                        <p>루트에서 리프까지의 <strong>깊이</strong>를 DFS로 구합니다.<br><code>depth(node) = 1 + max(depth(left), depth(right))</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="36" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="36" r="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="25" x2="9" y2="33" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="25" x2="19" y2="33" stroke="currentColor" stroke-width="1.5"/><text x="40" y="10" font-size="10" fill="var(--accent)">h=2</text></svg></span></div>
                        <h3>최대 깊이</h3>
                        <p>트리의 <strong>가장 깊은 리프</strong>까지의 거리입니다.<br>재귀로 왼쪽/오른쪽 중 큰 값 + 1</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="30" r="5" fill="none" stroke="#e17055" stroke-width="2"/><circle cx="34" cy="30" r="5" fill="none" stroke="#0984e3" stroke-width="2"/><path d="M17 28 L31 32" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="3,2"/><path d="M31 28 L17 32" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="3,2"/><line x1="20" y1="14" x2="16" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="14" x2="32" y2="26" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>트리 뒤집기 (Invert)</h3>
                        <p>모든 노드에서 <strong>왼쪽 ↔ 오른쪽</strong> 교환!<br>재귀로 간단하게 구현할 수 있습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="#fdcb6e" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="36" r="4" fill="#e17055" stroke="currentColor" stroke-width="2"/><circle cx="40" cy="36" r="4" fill="#0984e3" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="25" x2="9" y2="33" stroke="currentColor" stroke-width="1.5"/><line x1="37" y1="25" x2="39" y2="33" stroke="currentColor" stroke-width="1.5"/><path d="M10 40 L24 12 L38 40" fill="none" stroke="var(--yellow)" stroke-width="1.5" stroke-dasharray="3,2"/></svg></span></div>
                        <h3>LCA (최소 공통 조상)</h3>
                        <p>두 노드의 <strong>가장 가까운 공통 조상</strong>을 찾습니다.<br>재귀적으로 양쪽 서브트리를 탐색합니다.</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 최대 깊이 구하기
def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))

# 트리 뒤집기
def invertTree(root):
    if not root:
        return None
    root.left, root.right = root.right, root.left  # 좌우 교환!
    invertTree(root.left)
    invertTree(root.right)
    return root

# LCA (최소 공통 조상) - 이진 트리
def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right:   # 양쪽 다 발견 → 현재 노드가 LCA
        return root
    return left or right  # 한쪽에서만 발견</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">트리 [1, 2, 3, 4, 5]에서 노드 4와 5의 LCA(최소 공통 조상)는 무엇일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>노드 2</strong>입니다!<br>
                        노드 4는 2의 왼쪽 자식, 노드 5는 2의 오른쪽 자식입니다.<br>
                        노드 2에서 양쪽 서브트리에서 각각 하나씩 발견되므로, 2가 LCA입니다.
                    </div>
                </div>
            </div>
        `;

        this._initConceptInteractions(container);
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(el => {
            if (window.hljs) hljs.highlightElement(el);
        });
    },

    // ===== 시각화 렌더링 =====
    renderVisualize(container) {
        this._clearVizState();

        const NODE_POS = {
            1: { x: 250, y: 40 },
            2: { x: 130, y: 120 },
            3: { x: 370, y: 120 },
            4: { x: 70, y: 200 },
            5: { x: 190, y: 200 },
            6: { x: 310, y: 200 },
            7: { x: 430, y: 200 }
        };
        const EDGES = [[1,2],[1,3],[2,4],[2,5],[3,6],[3,7]];
        const TREE = { 1:{l:2,r:3}, 2:{l:4,r:5}, 3:{l:6,r:7}, 4:{l:null,r:null}, 5:{l:null,r:null}, 6:{l:null,r:null}, 7:{l:null,r:null} };

        let svgEdges = '';
        EDGES.forEach(([a, b]) => {
            svgEdges += `<line id="te-${a}-${b}" class="graph-edge" x1="${NODE_POS[a].x}" y1="${NODE_POS[a].y}" x2="${NODE_POS[b].x}" y2="${NODE_POS[b].y}"/>`;
        });

        let svgNodes = '';
        for (let id = 1; id <= 7; id++) {
            const { x, y } = NODE_POS[id];
            svgNodes += `<circle id="tn-${id}" class="graph-node" cx="${x}" cy="${y}" r="22"/>`;
            svgNodes += `<text class="graph-node-label" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${id}</text>`;
        }

        container.innerHTML = `
            <div class="viz-card">
                <h3>이진 트리 중위 순회 (Inorder Traversal)</h3>
                <p style="color:var(--text2);margin-bottom:12px;">왼쪽 → 루트 → 오른쪽 순서로 노드를 방문합니다. 결과: 4, 2, 5, 1, 6, 3, 7</p>
                <div class="graph-svg-container">
                    <svg viewBox="0 0 500 240" width="100%" height="240">
                        ${svgEdges}
                        ${svgNodes}
                    </svg>
                </div>
                <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap;align-items:flex-start;">
                    <div style="flex:1;min-width:200px;">
                        <div style="font-weight:600;margin-bottom:4px;">방문 결과</div>
                        <div class="graph-queue-display" id="tree-visit-order"></div>
                    </div>
                </div>
                ${this._createStepControls()}
            </div>
            <div class="graph-legend" style="margin-top:12px;">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid var(--border);vertical-align:middle;margin-right:4px;"></span> 미방문</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--yellow);vertical-align:middle;margin-right:4px;"></span> 현재 처리 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,var(--accent-vivid),var(--accent2));vertical-align:middle;margin-right:4px;"></span> 방문 완료</span>
            </div>
        `;

        const self = this;
        const svgEl = container.querySelector('svg');
        const visitOrderEl = container.querySelector('#tree-visit-order');

        // Inorder traversal: 4, 2, 5, 1, 6, 3, 7
        const inorderSeq = [4, 2, 5, 1, 6, 3, 7];
        const nodeStates = {};
        for (let i = 1; i <= 7; i++) nodeStates[i] = '';
        const visitedOrder = [];

        function setNodeClass(id, cls) {
            svgEl.querySelector(`#tn-${id}`).setAttribute('class', 'graph-node ' + cls);
        }
        function setEdgeClass(a, b, cls) {
            const el = svgEl.querySelector(`#te-${a}-${b}`) || svgEl.querySelector(`#te-${b}-${a}`);
            if (el) el.setAttribute('class', 'graph-edge ' + cls);
        }
        function renderVisitOrder() {
            visitOrderEl.innerHTML = visitedOrder.map(v => `<span class="graph-queue-item visited">${v}</span>`).join('');
        }
        function saveState() {
            return {
                nodeStates: { ...nodeStates },
                visitedOrder: [...visitedOrder]
            };
        }
        function restoreState(s) {
            for (let i = 1; i <= 7; i++) {
                nodeStates[i] = s.nodeStates[i];
                setNodeClass(i, s.nodeStates[i]);
            }
            visitedOrder.length = 0;
            visitedOrder.push(...s.visitedOrder);
            renderVisitOrder();
        }

        const steps = [];

        // Pre-compute all snapshots by simulating the traversal
        // Each step stores the state BEFORE and the state AFTER
        const descriptions = [
            '왼쪽 끝에 도달! 노드 4를 방문합니다. (리프 노드)',
            '노드 4 방문 완료!',
            '돌아와서 노드 2를 방문합니다. (왼쪽 완료 → 루트)',
            '노드 2 방문 완료!',
            '노드 2의 오른쪽 자식, 노드 5를 방문합니다. (리프 노드)',
            '노드 5 방문 완료!',
            '루트 노드 1을 방문합니다. (왼쪽 서브트리 완료 → 루트)',
            '노드 1 방문 완료!',
            '오른쪽 서브트리의 왼쪽 끝, 노드 6을 방문합니다. (리프 노드)',
            '노드 6 방문 완료!',
            '돌아와서 노드 3을 방문합니다. (왼쪽 완료 → 루트)',
            '노드 3 방문 완료!',
            '노드 3의 오른쪽 자식, 노드 7을 방문합니다. (리프 노드)',
            '노드 7 방문 완료!',
            '중위 순회 완료! 결과: 4, 2, 5, 1, 6, 3, 7'
        ];

        // Simulate to build snapshots
        const snapshots = [saveState()]; // snapshot[0] = initial state
        const simNodeStates = {};
        for (let i = 1; i <= 7; i++) simNodeStates[i] = '';
        const simVisitedOrder = [];

        inorderSeq.forEach((nodeId, idx) => {
            // Active step
            simNodeStates[nodeId] = 'active';
            simVisitedOrder.push(nodeId);
            snapshots.push({ nodeStates: { ...simNodeStates }, visitedOrder: [...simVisitedOrder] });

            // Visited step
            simNodeStates[nodeId] = 'visited';
            snapshots.push({ nodeStates: { ...simNodeStates }, visitedOrder: [...simVisitedOrder] });
        });

        // Final step: all visited
        const finalSnap = { nodeStates: {}, visitedOrder: [...inorderSeq] };
        for (let i = 1; i <= 7; i++) finalSnap.nodeStates[i] = 'visited';
        snapshots.push(finalSnap);

        function applySnapshot(snap) {
            for (let i = 1; i <= 7; i++) {
                nodeStates[i] = snap.nodeStates[i];
                setNodeClass(i, snap.nodeStates[i]);
            }
            visitedOrder.length = 0;
            visitedOrder.push(...snap.visitedOrder);
            renderVisitOrder();
            EDGES.forEach(([a, b]) => {
                if (nodeStates[a] === 'visited' && nodeStates[b] === 'visited') {
                    setEdgeClass(a, b, 'visited');
                } else {
                    setEdgeClass(a, b, '');
                }
            });
        }

        // Build steps from snapshots: step i transitions from snapshot[i] to snapshot[i+1]
        for (let i = 0; i < descriptions.length; i++) {
            const afterSnap = snapshots[i + 1];
            const beforeSnap = snapshots[i];
            steps.push({
                description: descriptions[i],
                action() { applySnapshot(afterSnap); },
                undo() { applySnapshot(beforeSnap); }
            });
        }

        self._initStepController(container, steps);
    },

    // ===== 공유 메서드: 시각화 상태 =====
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
            <div id="viz-step-desc" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>이진 트리의 <strong>최대 깊이</strong>를 구하세요. 최대 깊이는 루트 노드에서 가장 먼 리프 노드까지의 경로에 있는 노드의 수입니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>이진 트리의 루트 노드</p></div>
                    <div><h4>출력</h4><p>최대 깊이 (정수)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>[3, 9, 20, null, null, 15, 7]</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div></div>`,
            hints: [
                { title: '재귀적 접근', content: '빈 노드(None)이면 깊이는 0입니다. 그렇지 않으면 <strong>왼쪽과 오른쪽 서브트리의 깊이 중 큰 값 + 1</strong>이 답입니다.' },
                { title: 'BFS 접근도 가능', content: '큐를 사용하여 레벨 순회를 하면서, 레벨의 수를 세면 됩니다.' },
                { title: '핵심 코드', content: '<code>return 1 + max(maxDepth(root.left), maxDepth(root.right))</code><br>이 한 줄이 핵심입니다! 재귀의 아름다움을 느껴보세요.' }
            ],
            inputDefault: 0,
            solve() { return '3'; },
            templates: {
                python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxDepth(self, root) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,
                cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 * };
 */
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};`,
                java: `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 * }
 */
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`
            }
        },
        {
            id: 'lc-226',
            title: 'LeetCode 226 - Invert Binary Tree',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/invert-binary-tree/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>이진 트리가 주어졌을 때, <strong>좌우를 반전(뒤집기)</strong>시킨 트리를 반환하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>이진 트리의 루트 노드</p></div>
                    <div><h4>출력</h4><p>좌우 반전된 트리의 루트 노드</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>[4, 2, 7, 1, 3, 6, 9]</pre></div>
                    <div><strong>출력</strong><pre>[4, 7, 2, 9, 6, 3, 1]</pre></div>
                </div></div>`,
            hints: [
                { title: '재귀적 접근', content: '각 노드에서 <strong>왼쪽 자식과 오른쪽 자식을 교환</strong>하면 됩니다. 그런 다음 왼쪽, 오른쪽 서브트리에 대해 재귀적으로 반복합니다.' },
                { title: '종료 조건', content: 'root가 None이면 None을 반환합니다. 이것이 재귀의 종료 조건입니다.' },
                { title: '핵심 코드', content: '<code>root.left, root.right = root.right, root.left</code><br>이 한 줄로 좌우 교환! 그 후 양쪽에 재귀 호출합니다.' }
            ],
            inputDefault: 0,
            solve() { return '[4, 7, 2, 9, 6, 3, 1]'; },
            templates: {
                python: `class Solution:
    def invertTree(self, root):
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root`,
                cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        swap(root->left, root->right);
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};`,
                java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
        invertTree(root.left);
        invertTree(root.right);
        return root;
    }
}`
            }
        },
        // ===== 2단계: 트리 응용 =====
        {
            id: 'lc-102',
            title: 'LeetCode 102 - Binary Tree Level Order Traversal',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>이진 트리가 주어졌을 때, <strong>레벨별로</strong> 노드 값을 반환하세요. (왼쪽에서 오른쪽 순서)</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>이진 트리의 루트 노드</p></div>
                    <div><h4>출력</h4><p>레벨별 노드 값 리스트의 리스트</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>[3, 9, 20, null, null, 15, 7]</pre></div>
                    <div><strong>출력</strong><pre>[[3], [9, 20], [15, 7]]</pre></div>
                </div></div>`,
            hints: [
                { title: 'BFS 활용!', content: '<strong>큐(Queue)</strong>를 사용한 BFS로 레벨별 순회를 합니다. 핵심은 매 레벨마다 큐의 크기를 미리 구해서, 그만큼만 꺼내는 것입니다.' },
                { title: '레벨 구분 방법', content: '<code>for _ in range(len(queue))</code>로 현재 레벨의 노드만 처리합니다. 반복문 안에서 자식 노드를 큐에 넣으면 다음 레벨이 됩니다.' },
                { title: '시간/공간 복잡도', content: '시간: O(N) — 모든 노드를 한 번씩 방문합니다.<br>공간: O(N) — 큐에 최대 한 레벨의 노드가 들어갑니다.' }
            ],
            inputDefault: 0,
            solve() { return '[[3], [9, 20], [15, 7]]'; },
            templates: {
                python: `from collections import deque

class Solution:
    def levelOrder(self, root):
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:  queue.append(node.left)
                if node.right: queue.append(node.right)
            result.append(level)
        return result`,
                cpp: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (!root) return result;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int sz = q.size();
            vector<int> level;
            for (int i = 0; i < sz; i++) {
                TreeNode* node = q.front(); q.pop();
                level.push_back(node->val);
                if (node->left)  q.push(node->left);
                if (node->right) q.push(node->right);
            }
            result.push_back(level);
        }
        return result;
    }
};`,
                java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null)  queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
            result.add(level);
        }
        return result;
    }
}`
            }
        },
        {
            id: 'boj-1991',
            title: 'BOJ 1991 - 트리 순회',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1991',
            descriptionHTML: `
                <h3>문제</h3>
                <p>이진 트리가 주어졌을 때, <strong>전위 순회(preorder)</strong>, <strong>중위 순회(inorder)</strong>, <strong>후위 순회(postorder)</strong> 결과를 각각 출력하세요.</p>
                <p>노드 이름은 A부터 시작하며, 항상 A가 루트입니다. 자식이 없으면 .으로 표시됩니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄: 노드 수 N (1 ≤ N ≤ 26)<br>이후 N줄: 노드, 왼쪽 자식, 오른쪽 자식</p></div>
                    <div><h4>출력</h4><p>전위 순회 결과<br>중위 순회 결과<br>후위 순회 결과</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
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
                </div></div>`,
            hints: [
                { title: '트리 저장 방법', content: '딕셔너리(해시맵)에 각 노드의 <strong>왼쪽/오른쪽 자식</strong>을 저장합니다. <code>tree[node] = (left, right)</code>' },
                { title: '순회 구현', content: '전위: <strong>출력 → 왼쪽 → 오른쪽</strong><br>중위: <strong>왼쪽 → 출력 → 오른쪽</strong><br>후위: <strong>왼쪽 → 오른쪽 → 출력</strong><br>재귀로 구현하면 아주 간단합니다!' },
                { title: '종료 조건', content: '자식이 <code>.</code>이면 재귀를 멈춥니다. <code>if node == ".": return</code>' }
            ],
            inputDefault: 0,
            solve() { return 'ABDCEFG\nDBAECFG\nDBEGFCA'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
tree = {}
for _ in range(N):
    node, left, right = input().split()
    tree[node] = (left, right)

def preorder(node):
    if node == '.':
        return
    print(node, end='')
    preorder(tree[node][0])
    preorder(tree[node][1])

def inorder(node):
    if node == '.':
        return
    inorder(tree[node][0])
    print(node, end='')
    inorder(tree[node][1])

def postorder(node):
    if node == '.':
        return
    postorder(tree[node][0])
    postorder(tree[node][1])
    print(node, end='')

preorder('A')
print()
inorder('A')
print()
postorder('A')
print()`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

map<char, pair<char, char>> tree;

void preorder(char node) {
    if (node == '.') return;
    cout << node;
    preorder(tree[node].first);
    preorder(tree[node].second);
}

void inorder(char node) {
    if (node == '.') return;
    inorder(tree[node].first);
    cout << node;
    inorder(tree[node].second);
}

void postorder(char node) {
    if (node == '.') return;
    postorder(tree[node].first);
    postorder(tree[node].second);
    cout << node;
}

int main() {
    int N;
    scanf("%d", &N);
    for (int i = 0; i < N; i++) {
        char node, left, right;
        scanf(" %c %c %c", &node, &left, &right);
        tree[node] = {left, right};
    }
    preorder('A'); cout << "\\n";
    inorder('A');  cout << "\\n";
    postorder('A'); cout << "\\n";
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    static Map<Character, char[]> tree = new HashMap<>();

    static void preorder(char node) {
        if (node == '.') return;
        System.out.print(node);
        preorder(tree.get(node)[0]);
        preorder(tree.get(node)[1]);
    }

    static void inorder(char node) {
        if (node == '.') return;
        inorder(tree.get(node)[0]);
        System.out.print(node);
        inorder(tree.get(node)[1]);
    }

    static void postorder(char node) {
        if (node == '.') return;
        postorder(tree.get(node)[0]);
        postorder(tree.get(node)[1]);
        System.out.print(node);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        for (int i = 0; i < N; i++) {
            char node = sc.next().charAt(0);
            char left = sc.next().charAt(0);
            char right = sc.next().charAt(0);
            tree.put(node, new char[]{left, right});
        }
        preorder('A'); System.out.println();
        inorder('A');  System.out.println();
        postorder('A'); System.out.println();
    }
}`
            }
        }
    ],

    // ===== 문제 렌더링 =====
    renderProblem(container) {
        container.innerHTML = '';

        const stageList = document.createElement('div');
        stageList.className = 'problem-stages';

        this.stages.forEach(stage => {
            const stageCard = document.createElement('div');
            stageCard.className = 'stage-card';
            stageCard.innerHTML = `
                <div class="stage-header">
                    <span class="stage-num">단계 ${stage.num}</span>
                    <h3>${stage.title}</h3>
                    <p>${stage.desc}</p>
                </div>
                <div class="stage-problems"></div>
            `;

            const problemsDiv = stageCard.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid);
                if (!prob) return;
                const btn = document.createElement('button');
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `
                    <span class="problem-title">${prob.title}</span>
                    <span class="problem-diff">${diffMap[prob.difficulty] || prob.difficulty}</span>
                `;
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob));
                problemsDiv.appendChild(btn);
            });

            stageList.appendChild(stageCard);
        });

        container.appendChild(stageList);
    },

    // ===== 문제 상세 렌더링 =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLeetCode = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `
            <div class="problem-meta">
                <a href="${problem.link}" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">${isLeetCode ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}</a>
            </div>
            ${problem.descriptionHTML}
        `;
        container.appendChild(descDiv);

        // 힌트 섹션
        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>단계별 힌트</h3>';

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hints-steps';
        const openedState = {};

        problem.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `
                <div class="hint-step-header">
                    <span class="hint-step-num">${idx + 1}</span>
                    <span class="hint-step-title">${hint.title}</span>
                    <span class="hint-step-toggle">▶</span>
                </div>
                <div class="hint-step-content">${hint.content}</div>
            `;

            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent =
                    step.classList.contains('open') ? '▼' : '▶';

                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < problem.hints.length) {
                        const nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
            });
            hintsDiv.appendChild(step);
        });

        hintsSection.appendChild(hintsDiv);
        container.appendChild(hintsSection);

        // 코드 에디터
        const solveArea = document.createElement('div');
        solveArea.className = 'solve-area';
        solveArea.innerHTML = `
            <div class="editor-header">
                <h3>풀이 작성</h3>
                <select id="lang-select">
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                </select>
            </div>
            <textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea>
            <div class="editor-actions">
                <button id="run-btn" class="btn btn-primary">▶ 실행</button>
                <button id="check-btn" class="btn btn-success">✓ 정답 확인</button>
            </div>
            <div id="output-area" class="output-area">
                <div class="output-label">실행 결과</div>
                <pre id="output-text"></pre>
            </div>
        `;
        container.appendChild(solveArea);

        container.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;

        langSelect.addEventListener('change', () => {
            editor.value = problem.templates[langSelect.value];
        });

        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = editor.selectionStart;
                editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = s + 4;
            }
        });

        container.querySelector('#run-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });

        container.querySelector('#check-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            const site = isLeetCode ? 'LeetCode' : 'BOJ';
            this._showOutput(container, `예상 정답:\n${expected}\n\n💡 코드를 ${site}에 제출하여 정답을 확인하세요!`);
        });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

// ===== 등록 =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.tree = treeTopic;
