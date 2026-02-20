// ===== Algorithm Lab - Main App Engine =====

(function() {
    const sidebarNav = document.getElementById('sidebar-nav');
    const tabNav = document.getElementById('tab-nav');
    const topicTitle = document.getElementById('topic-title');
    const content = document.getElementById('content');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    let currentTopic = null;
    let currentTab = 'concept';

    // ===== 사이드바 토글 (모바일) =====
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        }
        overlay.classList.toggle('active');
    });

    // ===== 주제 목록 렌더링 =====
    function renderSidebar() {
        const topics = window.AlgoTopics || {};
        sidebarNav.innerHTML = '';

        Object.values(topics).forEach(topic => {
            const btn = document.createElement('button');
            btn.className = 'sidebar-item';
            btn.dataset.topicId = topic.id;
            btn.innerHTML = `
                <span class="item-icon">${topic.icon}</span>
                <span class="item-label">${topic.title}</span>
                <span class="item-badge">${topic.problems ? topic.problems.length + '문제' : ''}</span>
            `;
            btn.addEventListener('click', () => selectTopic(topic.id));
            sidebarNav.appendChild(btn);
        });
    }

    // ===== 주제 선택 =====
    function selectTopic(topicId) {
        const topics = window.AlgoTopics || {};
        const topic = topics[topicId];
        if (!topic) return;

        currentTopic = topic;
        currentTab = 'concept';

        // 사이드바 활성화
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.toggle('active', item.dataset.topicId === topicId);
        });

        // 헤더 업데이트
        topicTitle.textContent = `${topic.icon} ${topic.title}`;

        // 탭 버튼 렌더링
        renderTabs();

        // 콘텐츠 렌더링
        renderContent();

        // 모바일 사이드바 닫기
        sidebar.classList.remove('open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    // ===== 탭 버튼 렌더링 =====
    function renderTabs() {
        const tabs = [
            { id: 'concept', label: '개념 설명' },
            { id: 'visualize', label: '시각화' },
            { id: 'problem', label: '문제풀이' }
        ];

        tabNav.innerHTML = '';
        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn' + (tab.id === currentTab ? ' active' : '');
            btn.textContent = tab.label;
            btn.addEventListener('click', () => {
                currentTab = tab.id;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderContent();
            });
            tabNav.appendChild(btn);
        });
    }

    // ===== 콘텐츠 렌더링 =====
    function renderContent() {
        if (!currentTopic) return;

        content.innerHTML = '';
        const section = document.createElement('div');
        section.className = 'tab-content active';

        switch (currentTab) {
            case 'concept':
                currentTopic.renderConcept(section);
                break;
            case 'visualize':
                currentTopic.renderVisualize(section);
                break;
            case 'problem':
                currentTopic.renderProblem(section);
                break;
        }

        content.appendChild(section);
    }

    // ===== 초기화 =====
    renderSidebar();

    // 자동으로 첫 번째 주제 선택
    const topics = window.AlgoTopics || {};
    const firstTopicId = Object.keys(topics)[0];
    if (firstTopicId) {
        selectTopic(firstTopicId);
    }
})();
