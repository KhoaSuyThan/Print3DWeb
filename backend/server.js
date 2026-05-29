const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ các file tĩnh (Frontend) từ thư mục gốc
app.use(express.static(path.join(__dirname, '..')));

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin.html'));
});

const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_NAME};Trusted_Connection=yes;`;
const dbConfig = {
    connectionString: connectionString
};

// 1. Lấy danh sách nhựa
app.get('/api/resins', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Resins WHERE IsActive = 1');
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL Error:', err);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu nhựa' });
    }
});

// 2. Gửi yêu cầu báo giá
app.post('/api/quote-requests', async (req, res) => {
    const { fullName, email, phone, resin, message } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('FullName', sql.NVarChar(100), fullName)
            .input('Email', sql.NVarChar(100), email)
            .input('PhoneNumber', sql.NVarChar(20), phone)
            .input('InterestedResin', sql.NVarChar(100), resin)
            .input('Message', sql.NVarChar(sql.MAX), message)
            .query(`
                INSERT INTO QuoteRequests (FullName, Email, PhoneNumber, InterestedResin, Message)
                VALUES (@FullName, @Email, @PhoneNumber, @InterestedResin, @Message)
            `);
        res.status(201).json({ message: 'Yêu cầu báo giá đã được ghi nhận' });
    } catch (err) {
        console.error('SQL Error:', err);
        res.status(500).json({ error: 'Lỗi khi lưu yêu cầu' });
    }
});

// 3. Đăng ký đại lý
app.post('/api/distributors', async (req, res) => {
    const { companyName, contactPerson, zaloPhone, city, estimatedVolume } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('CompanyName', sql.NVarChar(200), companyName)
            .input('ContactPerson', sql.NVarChar(100), contactPerson)
            .input('ZaloPhone', sql.NVarChar(20), zaloPhone)
            .input('City', sql.NVarChar(100), city)
            .input('EstimatedVolume', sql.NVarChar(100), estimatedVolume)
            .query(`
                INSERT INTO DistributorApplications (CompanyName, ContactPerson, ZaloPhone, City, EstimatedVolume)
                VALUES (@CompanyName, @ContactPerson, @ZaloPhone, @City, @EstimatedVolume)
            `);
        res.status(201).json({ message: 'Đăng ký đại lý đã được ghi nhận' });
    } catch (err) {
        console.error('SQL Error:', err);
        res.status(500).json({ error: 'Lỗi khi lưu đăng ký đại lý' });
    }
});

// 4. API Lưu vết (Analytics)
app.post('/api/analytics/calculator', async (req, res) => {
    const { resinCode, volume, layerHeight } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('ResinCode', sql.NVarChar(50), resinCode)
            .input('Volume', sql.Decimal(10, 2), volume)
            .input('LayerHeight', sql.Decimal(10, 2), layerHeight)
            .query(`
                INSERT INTO CalculatorLogs (ResinCode, Volume, LayerHeight)
                VALUES (@ResinCode, @Volume, @LayerHeight)
            `);
        res.status(201).json({ message: 'Log saved' });
    } catch (err) {
        console.error('Analytics Error:', err);
        res.status(500).json({ error: 'Failed to save log' });
    }
});

// 5. Admin Login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('Username', sql.NVarChar(50), username)
            .input('PasswordHash', sql.NVarChar(255), password)
            .query('SELECT Id, Username, Role FROM AdminUsers WHERE Username = @Username AND PasswordHash = @PasswordHash');
            
        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const token = jwt.sign(
                { id: user.Id, username: user.Username, role: user.Role }, 
                process.env.JWT_SECRET || 'secret123', 
                { expiresIn: '1d' }
            );
            res.json({ token, user: { username: user.Username, role: user.Role } });
        } else {
            res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
        }
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Middleware xác thực JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(403).json({ error: 'Yêu cầu đăng nhập' });
    
    jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
        req.user = decoded;
        next();
    });
};

// 6. Lấy danh sách báo giá (Yêu cầu Admin)
app.get('/api/admin/quotes', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM QuoteRequests ORDER BY CreatedAt DESC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy dữ liệu' });
    }
});

// 7. Lấy danh sách đại lý (Yêu cầu Admin)
app.get('/api/admin/distributors', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM DistributorApplications ORDER BY CreatedAt DESC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy dữ liệu' });
    }
});

// 8. Lấy dữ liệu Analytics (Yêu cầu Admin)
app.get('/api/admin/analytics', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM CalculatorLogs ORDER BY CreatedAt ASC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy dữ liệu analytics' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
