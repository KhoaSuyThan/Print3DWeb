const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ các file tĩnh (Frontend) từ thư mục gốc
app.use(express.static(path.join(__dirname, '..')));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
