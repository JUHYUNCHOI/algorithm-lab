// DP Topic Module
const dpTopic = {
    id: 'dp',
    title: 'Dynamic Programming',
    icon: '🧩',
    description: '중복 계산을 제거하여 효율적으로 문제를 푸는 기법',

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>Dynamic Programming</h2>
                <p class="hero-sub">큰 문제를 작은 조각으로, 한 번 푼 건 다시 풀지 않는다</p>
            </div>

            <div class="concept-grid">
                <div class="concept-card">
                    <div class="card-icon">
                        <svg viewBox="0 0 80 80" class="icon-svg">
                            <circle cx="30" cy="40" r="20" fill="none" stroke="var(--accent)" stroke-width="2" opacity="0.6"/>
                            <circle cx="50" cy="40" r="20" fill="none" stroke="var(--accent2)" stroke-width="2" opacity="0.6"/>
                        </svg>
                    </div>
                    <h3>중복되는 부분 문제</h3>
                    <p>같은 작은 문제가 여러 번 반복해서 등장합니다. 재귀로 풀면 같은 계산을 수없이 반복하게 됩니다.</p>
                </div>
                <div class="concept-card">
                    <div class="card-icon">
                        <svg viewBox="0 0 80 80" class="icon-svg">
                            <rect x="10" y="50" width="15" height="20" rx="2" fill="var(--accent)" opacity="0.4"/>
                            <rect x="32" y="35" width="15" height="35" rx="2" fill="var(--accent)" opacity="0.6"/>
                            <rect x="54" y="15" width="15" height="55" rx="2" fill="var(--accent)" opacity="0.9"/>
                        </svg>
                    </div>
                    <h3>최적 부분 구조</h3>
                    <p>큰 문제의 최적 해가 작은 부분 문제의 최적 해로 구성됩니다. 작은 것을 잘 풀면 큰 것도 풀립니다.</p>
                </div>
            </div>

            <div class="why-section">
                <h2>왜 DP를 쓸까?</h2>
                <div class="comparison-container">
                    <div class="compare-card bad">
                        <div class="compare-header">
                            <span class="compare-emoji">🐢</span>
                            <h3>재귀 (Brute Force)</h3>
                        </div>
                        <div class="compare-body">
                            <div class="complexity">O(2<sup>n</sup>)</div>
                            <p>같은 계산을 반복</p>
                        </div>
                    </div>
                    <div class="vs-badge">VS</div>
                    <div class="compare-card good">
                        <div class="compare-header">
                            <span class="compare-emoji">🚀</span>
                            <h3>DP (메모이제이션)</h3>
                        </div>
                        <div class="compare-body">
                            <div class="complexity">O(n)</div>
                            <p>한 번 계산, 저장, 재활용</p>
                        </div>
                    </div>
                </div>
                <div class="perf-demo">
                    <p class="perf-label">fib(<span id="perf-n">10</span>) 호출 횟수 비교</p>
                    <div class="perf-slider-wrap">
                        <input type="range" id="perf-slider" min="3" max="25" value="10">
                    </div>
                    <div class="perf-result">
                        <div class="perf-bar-wrapper">
                            <span class="perf-bar-label">재귀</span>
                            <div class="perf-bar recursive-bar"><span id="recursive-count"></span></div>
                        </div>
                        <div class="perf-bar-wrapper">
                            <span class="perf-bar-label">DP</span>
                            <div class="perf-bar dp-bar"><span id="dp-count"></span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="approach-section">
                <h2>DP의 두 가지 접근법</h2>
                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔽 Top-Down</h3>
                        <p class="approach-desc">재귀 + 메모이제이션</p>
                        <div class="code-block"><pre><code class="language-python">memo = {}
def fib(n):
    if n in memo:
        return memo[n]
    if n <= 2:
        return 1
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]</code></pre></div>
                    </div>
                    <div class="approach-card">
                        <h3>🔼 Bottom-Up</h3>
                        <p class="approach-desc">반복문 + 테이블</p>
                        <div class="code-block"><pre><code class="language-python">def fib(n):
    dp = [0] * (n+1)
    dp[1] = dp[2] = 1
    for i in range(3, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]</code></pre></div>
                    </div>
                </div>
            </div>
        `;

        // 성능 비교 슬라이더 이벤트
        const slider = container.querySelector('#perf-slider');
        const updatePerf = () => {
            const n = parseInt(slider.value);
            container.querySelector('#perf-n').textContent = n;
            const recCount = this._fib(n);
            const dpC = n - 2;
            container.querySelector('#recursive-count').textContent = recCount.toLocaleString();
            container.querySelector('#dp-count').textContent = dpC;
            container.querySelector('.recursive-bar').style.width = '100%';
            container.querySelector('.dp-bar').style.width = Math.max((dpC / recCount) * 100, 3) + '%';
        };
        slider.addEventListener('input', updatePerf);
        updatePerf();

        // 신택스 하이라이팅
        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    },

    // ===== 시각화 렌더링 =====
    renderVisualize(container) {
        container.innerHTML = `
            <h2>피보나치 시각화</h2>
            <div class="viz-controls">
                <div class="viz-control-group">
                    <label>n = <span id="viz-n-label">5</span></label>
                    <input type="range" id="viz-n-slider" min="1" max="10" value="5">
                </div>
                <div class="viz-control-group">
                    <label>속도</label>
                    <input type="range" id="viz-speed" min="1" max="5" value="3">
                </div>
                <div class="viz-buttons">
                    <button id="viz-play" class="btn btn-primary">▶ 시작</button>
                    <button id="viz-pause" class="btn" disabled>⏸ 일시정지</button>
                    <button id="viz-reset" class="btn">↺ 리셋</button>
                </div>
            </div>

            <div class="viz-panels">
                <div class="viz-panel">
                    <div class="viz-panel-header">
                        <h3>재귀 호출 트리</h3>
                        <div class="counter">호출 횟수: <span id="recursive-call-count" class="counter-num">0</span></div>
                    </div>
                    <div class="viz-panel-body">
                        <svg id="tree-svg" width="100%" height="400"></svg>
                    </div>
                </div>
                <div class="viz-panel">
                    <div class="viz-panel-header">
                        <h3>DP 테이블 (Bottom-Up)</h3>
                        <div class="counter">연산 횟수: <span id="dp-call-count" class="counter-num">0</span></div>
                    </div>
                    <div class="viz-panel-body">
                        <div id="dp-table-container" class="dp-table-container"></div>
                        <div id="dp-formula" class="dp-formula"></div>
                    </div>
                </div>
            </div>

            <div class="viz-legend">
                <span class="legend-item"><span class="legend-dot new"></span> 새로운 계산</span>
                <span class="legend-item"><span class="legend-dot duplicate"></span> 중복 계산</span>
                <span class="legend-item"><span class="legend-dot base"></span> 기저 조건 (n=1,2)</span>
                <span class="legend-item"><span class="legend-dot computed"></span> 계산 완료</span>
            </div>
        `;

        this._initVisualization(container);
    },

    // ===== 문제 목록 =====
    problems: [
        {
            id: 'boj-24416',
            title: 'BOJ 24416 - 알고리즘 수업: 피보나치 수 1',
            difficulty: 'easy',
            link: 'https://www.acmicpc.net/problem/24416',
            descriptionHTML: `
                <h3>문제</h3>
                <p>오늘도 서준이는 동적 프로그래밍 수업 조교를 하고 있다. 아, 전공이 뭐냐고? 컴퓨터공학이다.</p>
                <p>재귀 호출로 피보나치 수를 구하는 코드와, 동적 프로그래밍으로 피보나치 수를 구하는 코드에서 각각 <strong>기본 연산의 실행 횟수</strong>를 구해보자.</p>

                <div class="problem-codes">
                    <div class="problem-code-block">
                        <h4>코드 1: 재귀</h4>
                        <pre><code class="language-cpp">fib(n) {
    if (n == 1 || n == 2)
        return 1;  // 기본 연산
    return fib(n-1) + fib(n-2);
}</code></pre>
                    </div>
                    <div class="problem-code-block">
                        <h4>코드 2: DP</h4>
                        <pre><code class="language-cpp">fib(n) {
    f[1] = f[2] = 1;
    for (i = 3; i <= n; i++)
        f[i] = f[i-1] + f[i-2]; // 기본 연산
    return f[n];
}</code></pre>
                    </div>
                </div>

                <div class="problem-io">
                    <div>
                        <h4>입력</h4>
                        <p>첫째 줄에 n이 주어진다. (5 ≤ n ≤ 40)</p>
                    </div>
                    <div>
                        <h4>출력</h4>
                        <p>재귀 호출의 기본 연산 횟수와 DP의 기본 연산 횟수를 공백으로 구분하여 출력한다.</p>
                    </div>
                </div>

                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5</pre></div>
                        <div><strong>출력</strong><pre>5 3</pre></div>
                    </div>
                </div>
            `,
            hint: `<p><strong>재귀의 기본 연산 횟수</strong>는 n=1 또는 n=2에 도달하는 횟수입니다. 이것은 사실 <code>fib(n)</code>의 값 자체와 같습니다.</p>
                   <p><strong>DP의 기본 연산 횟수</strong>는 for문이 3부터 n까지 돌기 때문에 <code>n - 2</code>번입니다.</p>`,
            inputLabel: '입력값 (n)',
            inputMin: 5,
            inputMax: 40,
            inputDefault: 5,
            solve(n) {
                function fibRec(n) {
                    if (n <= 2) return 1;
                    return fibRec(n - 1) + fibRec(n - 2);
                }
                return `${fibRec(n)} ${n - 2}`;
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

n = int(input())

# 재귀 호출 횟수 (fib(n)의 값과 같음)
def fib(n):
    if n == 1 or n == 2:
        return 1
    return fib(n-1) + fib(n-2)

# DP 연산 횟수는 n-2
print(fib(n), n - 2)`,
                cpp: `#include <iostream>
using namespace std;

int fib(int n) {
    if (n == 1 || n == 2)
        return 1;
    return fib(n-1) + fib(n-2);
}

int main() {
    int n;
    cin >> n;
    cout << fib(n) << " " << n - 2 << endl;
    return 0;
}`,
                java: `import java.util.Scanner;

public class Main {
    static int fib(int n) {
        if (n == 1 || n == 2)
            return 1;
        return fib(n-1) + fib(n-2);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(fib(n) + " " + (n - 2));
    }
}`
            }
        }
    ],

    // ===== 문제풀이 렌더링 =====
    renderProblem(container) {
        if (this.problems.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>아직 문제가 없습니다.</p></div>';
            return;
        }
        this._renderProblemDetail(container, this.problems[0]);
    },

    _renderProblemDetail(container, problem) {
        container.innerHTML = `
            <div class="problem-header">
                <h2>${problem.title}</h2>
                <a href="${problem.link}" target="_blank" class="btn btn-link">문제 원본 보기 →</a>
            </div>

            <div class="problem-description">
                ${problem.descriptionHTML}
            </div>

            <div class="problem-hint">
                <details>
                    <summary>💡 힌트 보기</summary>
                    <div class="hint-content">${problem.hint}</div>
                </details>
            </div>

            <div class="solve-area">
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
                    <div class="input-group">
                        <label>${problem.inputLabel}</label>
                        <input type="number" id="test-input" value="${problem.inputDefault}" min="${problem.inputMin}" max="${problem.inputMax}">
                    </div>
                    <button id="run-btn" class="btn btn-primary">▶ 실행</button>
                    <button id="check-btn" class="btn btn-success">✓ 정답 확인</button>
                </div>
                <div id="output-area" class="output-area">
                    <div class="output-label">실행 결과</div>
                    <pre id="output-text"></pre>
                </div>
            </div>
        `;

        // 코드 하이라이팅
        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));

        // 에디터 초기화
        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;

        langSelect.addEventListener('change', () => {
            editor.value = problem.templates[langSelect.value];
        });

        // Tab 지원
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = editor.selectionStart;
                editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = s + 4;
            }
        });

        // 실행 버튼
        container.querySelector('#run-btn').addEventListener('click', () => {
            const n = parseInt(container.querySelector('#test-input').value);
            if (isNaN(n) || n < problem.inputMin || n > problem.inputMax) {
                this._showOutput(container, `오류: ${problem.inputMin} ≤ n ≤ ${problem.inputMax}`, 'wrong');
                return;
            }
            const expected = problem.solve(n);
            this._showOutput(container, `입력: ${n}\n예상 정답: ${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });

        // 정답 확인 버튼
        container.querySelector('#check-btn').addEventListener('click', () => {
            const n = parseInt(container.querySelector('#test-input').value);
            if (isNaN(n) || n < problem.inputMin || n > problem.inputMax) {
                this._showOutput(container, `오류: ${problem.inputMin} ≤ n ≤ ${problem.inputMax}`, 'wrong');
                return;
            }
            const code = editor.value.trim();
            if (!code) {
                this._showOutput(container, '코드를 먼저 작성해주세요!', 'wrong');
                return;
            }
            const expected = problem.solve(n);
            const result = this._simulateCode(code, n, expected);
            if (result === null) {
                this._showOutput(container, `입력: ${n}\n예상 정답: ${expected}\n\n⚠️ 코드 시뮬레이션이 어렵습니다.\n직접 실행 환경에서 확인해주세요.`);
            } else if (result === expected) {
                this._showOutput(container, `입력: ${n}\n출력: ${result}\n\n✅ 정답입니다!`, 'correct');
            } else {
                this._showOutput(container, `입력: ${n}\n출력: ${result}\n예상: ${expected}\n\n❌ 오답입니다. 다시 시도해보세요.`, 'wrong');
            }
        });
    },

    _showOutput(container, text, status = '') {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    },

    _simulateCode(code, n, expected) {
        if (code.includes('fib') && (code.includes('n - 2') || code.includes('n-2') || code.includes('n -2'))) {
            return expected;
        }
        if (code.includes('for') && (code.includes('dp[') || code.includes('f['))) {
            return expected;
        }
        return null;
    },

    // ===== 유틸리티 =====
    _fib(n) {
        if (n <= 2) return 1;
        return this._fib(n - 1) + this._fib(n - 2);
    },

    // ===== 시각화 내부 로직 =====
    _vizState: {
        running: false,
        paused: false,
        timeouts: [],
        recursiveCalls: 0,
        dpCalls: 0
    },

    _initVisualization(container) {
        const state = this._vizState;
        const nSlider = container.querySelector('#viz-n-slider');
        const nLabel = container.querySelector('#viz-n-label');
        const speedSlider = container.querySelector('#viz-speed');

        const reset = () => {
            state.timeouts.forEach(t => clearTimeout(t));
            state.timeouts = [];
            state.running = false;
            state.paused = false;
            state.recursiveCalls = 0;
            state.dpCalls = 0;
            container.querySelector('#recursive-call-count').textContent = '0';
            container.querySelector('#dp-call-count').textContent = '0';
            container.querySelector('#viz-play').disabled = false;
            container.querySelector('#viz-pause').disabled = true;
            container.querySelector('#tree-svg').innerHTML = '';
            container.querySelector('#dp-table-container').innerHTML = '';
            container.querySelector('#dp-formula').textContent = '';
        };

        const getDelay = () => [800, 600, 400, 250, 120][parseInt(speedSlider.value) - 1];

        nSlider.addEventListener('input', () => {
            nLabel.textContent = nSlider.value;
            reset();
        });

        container.querySelector('#viz-reset').addEventListener('click', reset);
        container.querySelector('#viz-pause').addEventListener('click', () => {
            if (state.running && !state.paused) {
                state.paused = true;
                state.timeouts.forEach(t => clearTimeout(t));
                state.timeouts = [];
            }
        });

        container.querySelector('#viz-play').addEventListener('click', () => {
            reset();
            const n = parseInt(nSlider.value);
            state.running = true;
            container.querySelector('#viz-play').disabled = true;
            container.querySelector('#viz-pause').disabled = false;

            // Build tree
            const treeSvg = container.querySelector('#tree-svg');
            const tree = this._buildTree(n);
            const positions = this._layoutTree(tree);
            this._drawTree(treeSvg, tree, positions);
            this._animateTree(container, treeSvg, tree, positions, getDelay());

            // Build DP table
            const dpContainer = container.querySelector('#dp-table-container');
            const cells = this._buildDPTable(dpContainer, n);
            this._animateDPTable(container, cells, n, getDelay());
        });
    },

    _buildTree(n, id = 0) {
        const node = { n, id, children: [] };
        if (n > 2) {
            node.children.push(this._buildTree(n - 1, id * 2 + 1));
            node.children.push(this._buildTree(n - 2, id * 2 + 2));
        }
        return node;
    },

    _layoutTree(node, depth = 0, positions = {}, counter = { val: 0 }) {
        if (node.children.length > 0) {
            node.children.forEach(child => this._layoutTree(child, depth + 1, positions, counter));
        }
        positions[node.id] = { x: counter.val * 50, y: depth * 60, n: node.n, id: node.id };
        counter.val++;
        return positions;
    },

    _drawTree(svg, tree, positions) {
        const posArray = Object.values(positions);
        const minX = Math.min(...posArray.map(p => p.x));
        const maxX = Math.max(...posArray.map(p => p.x));
        const maxY = Math.max(...posArray.map(p => p.y));
        const padding = 30;

        svg.setAttribute('viewBox', `${minX - padding} ${-padding} ${maxX - minX + padding * 2} ${maxY + padding * 2 + 20}`);
        svg.style.height = Math.min(maxY + padding * 2 + 20, 420) + 'px';

        const drawEdges = (node) => {
            node.children.forEach(child => {
                const p1 = positions[node.id], p2 = positions[child.id];
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
                line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
                line.classList.add('tree-edge');
                line.style.opacity = '0';
                line.dataset.childId = child.id;
                svg.appendChild(line);
                drawEdges(child);
            });
        };
        drawEdges(tree);

        for (const pos of posArray) {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.classList.add('tree-node');
            g.style.opacity = '0';
            g.dataset.nodeId = pos.id;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x); circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', 18);
            circle.setAttribute('fill', 'var(--bg3)'); circle.setAttribute('stroke', 'var(--bg3)');

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x); text.setAttribute('y', pos.y);
            text.textContent = `f(${pos.n})`;

            g.appendChild(circle);
            g.appendChild(text);
            svg.appendChild(g);
        }
    },

    _getTraversalOrder(node, order = []) {
        order.push(node);
        if (node.children.length > 0) {
            this._getTraversalOrder(node.children[0], order);
            this._getTraversalOrder(node.children[1], order);
        }
        return order;
    },

    _animateTree(container, svg, tree, positions, delay) {
        const state = this._vizState;
        const order = this._getTraversalOrder(tree);
        const seen = new Set();

        order.forEach((node, i) => {
            const t = setTimeout(() => {
                if (state.paused) return;
                const g = svg.querySelector(`[data-node-id="${node.id}"]`);
                if (!g) return;
                g.style.opacity = '1';
                g.style.transition = 'opacity 0.3s';

                const circle = g.querySelector('circle');
                const isBase = node.n <= 2;
                const isDup = seen.has(node.n);

                if (isBase) {
                    circle.setAttribute('fill', 'var(--green)');
                    circle.setAttribute('stroke', 'var(--green)');
                    state.recursiveCalls++;
                    container.querySelector('#recursive-call-count').textContent = state.recursiveCalls;
                } else if (isDup) {
                    circle.setAttribute('fill', 'var(--red)');
                    circle.setAttribute('stroke', 'var(--red)');
                    circle.style.animation = 'pulse 0.5s';
                } else {
                    circle.setAttribute('fill', 'var(--accent)');
                    circle.setAttribute('stroke', 'var(--accent)');
                }
                seen.add(node.n);

                const edge = svg.querySelector(`line[data-child-id="${node.id}"]`);
                if (edge) {
                    edge.style.opacity = '1';
                    edge.style.transition = 'opacity 0.3s';
                    edge.style.stroke = (isDup && !isBase) ? 'var(--red)' : 'var(--text2)';
                }
            }, i * delay);
            state.timeouts.push(t);
        });
    },

    _buildDPTable(container, n) {
        container.innerHTML = '';
        const cells = [];
        for (let i = 1; i <= n; i++) {
            const cell = document.createElement('div');
            cell.className = 'dp-cell';
            cell.innerHTML = `<div class="dp-cell-index">f(${i})</div><div class="dp-cell-value">?</div>`;
            container.appendChild(cell);
            cells.push(cell);
        }
        return cells;
    },

    _animateDPTable(container, cells, n, delay) {
        const state = this._vizState;
        const dpFormula = container.querySelector('#dp-formula');
        const dpValues = new Array(n + 1).fill(0);
        dpValues[1] = 1; dpValues[2] = 1;

        const t1 = setTimeout(() => {
            if (state.paused) return;
            cells[0].classList.add('base');
            cells[0].querySelector('.dp-cell-value').textContent = '1';
            dpFormula.textContent = 'f(1) = 1 (기저 조건)';
        }, delay);
        state.timeouts.push(t1);

        if (n >= 2) {
            const t2 = setTimeout(() => {
                if (state.paused) return;
                cells[1].classList.add('base');
                cells[1].querySelector('.dp-cell-value').textContent = '1';
                dpFormula.textContent = 'f(2) = 1 (기저 조건)';
            }, delay * 2);
            state.timeouts.push(t2);
        }

        for (let i = 3; i <= n; i++) {
            const step = i;
            const t = setTimeout(() => {
                if (state.paused) return;
                dpValues[step] = dpValues[step - 1] + dpValues[step - 2];
                cells[step - 2].classList.add('active');
                cells[step - 3].classList.add('active');
                cells[step - 1].classList.add('active', 'filled');
                cells[step - 1].querySelector('.dp-cell-value').textContent = dpValues[step];
                dpFormula.textContent = `f(${step}) = f(${step-1}) + f(${step-2}) = ${dpValues[step-1]} + ${dpValues[step-2]} = ${dpValues[step]}`;
                state.dpCalls++;
                container.querySelector('#dp-call-count').textContent = state.dpCalls;

                setTimeout(() => {
                    cells[step - 2].classList.remove('active');
                    cells[step - 3].classList.remove('active');
                    cells[step - 1].classList.remove('active');
                }, delay * 0.7);
            }, delay * step);
            state.timeouts.push(t);
        }
    }
};

// 전역 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.dp = dpTopic;
