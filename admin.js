document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = 'http://localhost:3000/api';
    
    // Screens
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    
    // Auth Check
    let currentUser = localStorage.getItem('adminUser');
    
    // Check login via API (Cookie)
    fetch(`${API_BASE}/admin/me`)
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Chưa đăng nhập');
        })
        .then(data => {
            currentUser = data.user.username;
            localStorage.setItem('adminUser', currentUser);
            showDashboard();
        })
        .catch(() => {
            loginScreen.classList.add('active');
        });

    // --- LOGIN ---
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const res = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                currentUser = data.user.username;
                localStorage.setItem('adminUser', currentUser);
                showDashboard();
            } else {
                loginError.textContent = data.error || 'Đăng nhập thất bại';
            }
        } catch (err) {
            loginError.textContent = 'Không thể kết nối đến máy chủ';
        }
    });

    // --- LOGOUT ---
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await fetch(`${API_BASE}/admin/logout`, { method: 'POST' });
        localStorage.removeItem('adminUser');
        dashboardScreen.classList.remove('active');
        loginScreen.classList.add('active');
    });

    // --- DASHBOARD ROUTING ---
    function showDashboard() {
        loginScreen.classList.remove('active');
        dashboardScreen.classList.add('active');
        document.getElementById('user-name-display').textContent = currentUser;
        
        // Setup tabs
        const navLinks = document.querySelectorAll('.nav-links li[data-target]');
        const tabContents = document.querySelectorAll('.tab-content');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(t => t.classList.remove('active'));
                
                link.classList.add('active');
                const target = link.getAttribute('data-target');
                document.getElementById(`tab-${target}`).classList.add('active');
                
                if (target === 'overview') {
                    loadAnalytics();
                } else if (target === 'quotes' || target === 'distributors') {
                    loadData(target);
                } else if (target === 'resins') {
                    loadResins();
                } else if (target === 'ai-config') {
                    loadAiConfig();
                }
            });
        });

        // Tải tab mặc định
        loadAnalytics();
    }

    // --- FETCH DATA ---
    async function loadData(type) {
        const url = type === 'quotes' ? `${API_BASE}/admin/quotes` : `${API_BASE}/admin/distributors`;
        const tbodyId = type === 'quotes' ? 'quotes-table' : 'distributors-table';
        const tbody = document.querySelector(`#${tbodyId} tbody`);
        
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center">Đang tải dữ liệu...</td></tr>';
        
        try {
            const res = await fetch(url);
            
            if (res.status === 401 || res.status === 403) {
                alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                document.getElementById('logout-btn').click();
                return;
            }
            
            const data = await res.json();
            renderTable(type, data, tbody);
        } catch (err) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color:#ff4757">Lỗi tải dữ liệu</td></tr>';
        }
    }

    function renderTable(type, data, tbody) {
        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align:center">Chưa có dữ liệu</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            const dateStr = new Date(item.CreatedAt).toLocaleString('vi-VN');
            
            if (type === 'quotes') {
                tr.innerHTML = `
                    <td>#${item.Id}</td>
                    <td>${dateStr}</td>
                    <td><b>${item.FullName}</b><br><small>${item.Email}</small></td>
                    <td>${item.PhoneNumber}</td>
                    <td><span style="color:var(--primary)">${item.InterestedResin}</span></td>
                    <td>${item.Message || '-'}</td>
                `;
            } else {
                tr.innerHTML = `
                    <td>#${item.Id}</td>
                    <td>${dateStr}</td>
                    <td><b>${item.CompanyName}</b></td>
                    <td>${item.ContactPerson}</td>
                    <td>${item.ZaloPhone}</td>
                    <td>${item.City}</td>
                    <td>${item.EstimatedVolume}</td>
                `;
            }
            tbody.appendChild(tr);
        });
    }

    // --- ANALYTICS CHARTS ---
    let pieChartInstance = null;
    let layerChartInstance = null;
    let volumeChartInstance = null;

    async function loadAnalytics() {
        try {
            const res = await fetch(`${API_BASE}/admin/analytics`);
            if (!res.ok) return;
            const data = await res.json();
            
            renderCharts(data);
        } catch (err) {
            console.error('Error loading analytics:', err);
        }
    }

    function renderCharts(data) {
        // Hủy chart cũ trước khi vẽ lại
        if (pieChartInstance) pieChartInstance.destroy();
        if (layerChartInstance) layerChartInstance.destroy();
        if (volumeChartInstance) volumeChartInstance.destroy();

        const pieColors = ['#00f2fe', '#4facfe', '#00b8c2', '#a8ff78', '#78ffd6', '#f093fb'];

        // 1. Dữ liệu Pie Chart (Tỷ lệ Nhựa)
        const resinCounts = {};
        data.forEach(log => {
            resinCounts[log.ResinCode] = (resinCounts[log.ResinCode] || 0) + 1;
        });
        const ctxPie = document.getElementById('pieChart').getContext('2d');
        pieChartInstance = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: Object.keys(resinCounts),
                datasets: [{
                    data: Object.values(resinCounts),
                    backgroundColor: pieColors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#8e95a5' } } }
            }
        });

        // 2. Dữ liệu Layer Height Chart (Tỷ lệ Độ dày Lớp in)
        const layerCounts = {};
        data.forEach(log => {
            layerCounts[log.LayerHeight] = (layerCounts[log.LayerHeight] || 0) + 1;
        });
        const ctxLayer = document.getElementById('layerChart').getContext('2d');
        layerChartInstance = new Chart(ctxLayer, {
            type: 'doughnut',
            data: {
                labels: Object.keys(layerCounts).map(l => l + ' mm'),
                datasets: [{
                    data: Object.values(layerCounts),
                    backgroundColor: ['#f093fb', '#f5576c', '#4facfe'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#8e95a5' } } }
            }
        });

        // 3. Dữ liệu Volume Chart (Phân bổ Thể tích)
        // Tạo các khoảng bucket: 10-100, 101-200, ... 901-1000, >1000
        const volumeBuckets = [
            '10-100', '101-200', '201-300', '301-400', '401-500',
            '501-600', '601-700', '701-800', '801-900', '901-1000', '>1000'
        ];
        const volumeCounts = new Array(volumeBuckets.length).fill(0);
        
        data.forEach(log => {
            const vol = parseFloat(log.Volume);
            if (vol <= 100) volumeCounts[0]++;
            else if (vol <= 200) volumeCounts[1]++;
            else if (vol <= 300) volumeCounts[2]++;
            else if (vol <= 400) volumeCounts[3]++;
            else if (vol <= 500) volumeCounts[4]++;
            else if (vol <= 600) volumeCounts[5]++;
            else if (vol <= 700) volumeCounts[6]++;
            else if (vol <= 800) volumeCounts[7]++;
            else if (vol <= 900) volumeCounts[8]++;
            else if (vol <= 1000) volumeCounts[9]++;
            else volumeCounts[10]++;
        });

        const ctxVolume = document.getElementById('volumeChart').getContext('2d');
        volumeChartInstance = new Chart(ctxVolume, {
            type: 'bar',
            data: {
                labels: volumeBuckets,
                datasets: [{
                    label: 'Số lượt yêu cầu',
                    data: volumeCounts,
                    backgroundColor: '#00f2fe',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { 
                        beginAtZero: true, 
                        ticks: { color: '#8e95a5', stepSize: 1 },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#8e95a5' },
                        grid: { display: false }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // --- RESINS CMS ---
    const resinModal = document.getElementById('resin-modal');
    const closeBtn = document.querySelector('.close-modal');
    const addResinBtn = document.getElementById('add-resin-btn');
    const resinForm = document.getElementById('resin-form');
    
    if (addResinBtn) {
        addResinBtn.addEventListener('click', () => {
            resinForm.reset();
            document.getElementById('r-id').value = '';
            document.getElementById('resin-modal-title').textContent = 'Thêm Sản Phẩm Mới';
            resinModal.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            resinModal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === resinModal) resinModal.classList.remove('active');
    });

    async function loadResins() {
        const tbody = document.querySelector('#resins-table tbody');
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Đang tải...</td></tr>';
        try {
            const res = await fetch(`${API_BASE}/admin/resins`);
            if (res.status === 401 || res.status === 403) return;
            const data = await res.json();
            
            tbody.innerHTML = '';
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.Id}</td>
                    <td><b>${item.Code}</b></td>
                    <td>${item.Name}</td>
                    <td>${item.IsActive ? '<span style="color:var(--green)">Có</span>' : '<span style="color:var(--red)">Không</span>'}</td>
                    <td>${item.IsFeatured ? 'Nổi bật' : '-'}</td>
                    <td>
                        <button class="btn-outline edit-btn" style="padding:4px 8px; font-size:12px; border-color:var(--primary); color:white">Sửa</button>
                        <button class="btn-outline del-btn" style="padding:4px 8px; font-size:12px; border-color:var(--red); color:white">Xóa</button>
                    </td>
                `;
                
                // Edit Event
                tr.querySelector('.edit-btn').addEventListener('click', () => {
                    document.getElementById('r-id').value = item.Id;
                    document.getElementById('r-code').value = item.Code;
                    document.getElementById('r-name').value = item.Name;
                    document.getElementById('r-badgeColor').value = item.BadgeColor || '';
                    document.getElementById('r-image').value = item.ImageUrl || '';
                    document.getElementById('r-badgeVi').value = item.BadgeTextVi || '';
                    document.getElementById('r-badgeEn').value = item.BadgeTextEn || '';
                    document.getElementById('r-baseExp').value = item.BaseExposure;
                    document.getElementById('r-density').value = item.Density;
                    document.getElementById('r-statExp').value = item.StatExposureText || '';
                    document.getElementById('r-statWidth').value = item.StatBarWidth || '';
                    document.getElementById('r-stabVi').value = item.StabilityVi;
                    document.getElementById('r-stabEn').value = item.StabilityEn;
                    document.getElementById('r-descVi').value = item.DescriptionVi || '';
                    document.getElementById('r-descEn').value = item.DescriptionEn || '';
                    
                    document.getElementById('r-p1lVi').value = item.Prop1LabelVi || '';
                    document.getElementById('r-p1lEn').value = item.Prop1LabelEn || '';
                    document.getElementById('r-p1vVi').value = item.Prop1ValueVi || '';
                    document.getElementById('r-p1vEn').value = item.Prop1ValueEn || '';
                    
                    document.getElementById('r-p2lVi').value = item.Prop2LabelVi || '';
                    document.getElementById('r-p2lEn').value = item.Prop2LabelEn || '';
                    document.getElementById('r-p2vVi').value = item.Prop2ValueVi || '';
                    document.getElementById('r-p2vEn').value = item.Prop2ValueEn || '';
                    
                    document.getElementById('r-p3lVi').value = item.Prop3LabelVi || '';
                    document.getElementById('r-p3lEn').value = item.Prop3LabelEn || '';
                    document.getElementById('r-p3vVi').value = item.Prop3ValueVi || '';
                    document.getElementById('r-p3vEn').value = item.Prop3ValueEn || '';
                    
                    document.getElementById('r-advVi').value = item.AdviceVi || '';
                    document.getElementById('r-advEn').value = item.AdviceEn || '';
                    
                    document.getElementById('r-featured').checked = item.IsFeatured;
                    document.getElementById('r-active').checked = item.IsActive;
                    
                    document.getElementById('resin-modal-title').textContent = 'Sửa Sản Phẩm';
                    resinModal.classList.add('active');
                });
                
                // Delete Event
                tr.querySelector('.del-btn').addEventListener('click', async () => {
                    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                        await fetch(`${API_BASE}/admin/resins/${item.Id}`, { method: 'DELETE' });
                        loadResins();
                    }
                });
                
                tbody.appendChild(tr);
            });
        } catch (err) {}
    }

    if (resinForm) {
        resinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('r-id').value;
            const payload = {
                Code: document.getElementById('r-code').value,
                Name: document.getElementById('r-name').value,
                BadgeColor: document.getElementById('r-badgeColor').value,
                ImageUrl: document.getElementById('r-image').value,
                BadgeTextVi: document.getElementById('r-badgeVi').value,
                BadgeTextEn: document.getElementById('r-badgeEn').value,
                BaseExposure: document.getElementById('r-baseExp').value,
                Density: document.getElementById('r-density').value,
                StatExposureText: document.getElementById('r-statExp').value,
                StatBarWidth: document.getElementById('r-statWidth').value || 0,
                StabilityVi: document.getElementById('r-stabVi').value,
                StabilityEn: document.getElementById('r-stabEn').value,
                DescriptionVi: document.getElementById('r-descVi').value,
                DescriptionEn: document.getElementById('r-descEn').value,
                Prop1LabelVi: document.getElementById('r-p1lVi').value,
                Prop1LabelEn: document.getElementById('r-p1lEn').value,
                Prop1ValueVi: document.getElementById('r-p1vVi').value,
                Prop1ValueEn: document.getElementById('r-p1vEn').value,
                Prop2LabelVi: document.getElementById('r-p2lVi').value,
                Prop2LabelEn: document.getElementById('r-p2lEn').value,
                Prop2ValueVi: document.getElementById('r-p2vVi').value,
                Prop2ValueEn: document.getElementById('r-p2vEn').value,
                Prop3LabelVi: document.getElementById('r-p3lVi').value,
                Prop3LabelEn: document.getElementById('r-p3lEn').value,
                Prop3ValueVi: document.getElementById('r-p3vVi').value,
                Prop3ValueEn: document.getElementById('r-p3vEn').value,
                AdviceVi: document.getElementById('r-advVi').value,
                AdviceEn: document.getElementById('r-advEn').value,
                IsFeatured: document.getElementById('r-featured').checked ? 1 : 0,
                IsActive: document.getElementById('r-active').checked ? 1 : 0
            };
            
            const url = id ? `${API_BASE}/admin/resins/${id}` : `${API_BASE}/admin/resins`;
            const method = id ? 'PUT' : 'POST';
            
            try {
                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    resinModal.classList.remove('active');
                    loadResins();
                } else {
                    alert('Lỗi lưu sản phẩm');
                }
            } catch (err) {
                alert('Lỗi kết nối máy chủ');
            }
        });
    }

    // --- AI CONFIG MANAGEMENT ---  
    async function loadAiConfig() {  
        try {  
            const res = await fetch(`${API_BASE}/admin/ai-config`);  
            if (!res.ok) return;  
            const data = await res.json();  
            if (data) {  
                document.getElementById('ai-api-key').value = data.GroqApiKey || '';
                document.getElementById('ai-model-name').value = data.ModelName || 'llama-3.1-8b-instant';
                document.getElementById('ai-prompt-rules').value = data.SystemPromptRules || '';
            }  
        } catch (err) {  
            console.error('Error loading AI config:', err);  
        }  
    }  

    const aiConfigForm = document.getElementById('ai-config-form');  
    if (aiConfigForm) {  
        aiConfigForm.addEventListener('submit', async (e) => {  
            e.preventDefault();  
            const submitBtn = document.getElementById('save-ai-config-btn');  
            const originalText = submitBtn.innerHTML;  
            submitBtn.innerHTML = 'Đang lưu...';  
            submitBtn.disabled = true;  

            const aiData = {  
                GroqApiKey: document.getElementById('ai-api-key').value,  
                ModelName: document.getElementById('ai-model-name').value,  
                SystemPromptRules: document.getElementById('ai-prompt-rules').value  
            };  

            try {  
                const res = await fetch(`${API_BASE}/admin/ai-config`, {  
                    method: 'PUT',  
                    headers: { 'Content-Type': 'application/json' },  
                    body: JSON.stringify(aiData)  
                });  

                if (res.ok) {  
                    alert('Lưu cấu hình AI thành công!');  
                } else {  
                    alert('Có lỗi xảy ra khi lưu cấu hình.');  
                }  
            } catch (err) {  
                alert('Lỗi kết nối máy chủ.');  
            } finally {  
                submitBtn.innerHTML = originalText;  
                submitBtn.disabled = false;  
            }  
        });  
    }  
    const toggleApiKeyBtn = document.getElementById('toggle-api-key-btn');
    if (toggleApiKeyBtn) {
        toggleApiKeyBtn.addEventListener('click', () => {
            const apiKeyInput = document.getElementById('ai-api-key');
            const icon = toggleApiKeyBtn.querySelector('i');
            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
                icon.classList.remove('ph-eye');
                icon.classList.add('ph-eye-slash');
            } else {
                apiKeyInput.type = 'password';
                icon.classList.remove('ph-eye-slash');
                icon.classList.add('ph-eye');
            }
        });
    }

});
