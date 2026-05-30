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
});
