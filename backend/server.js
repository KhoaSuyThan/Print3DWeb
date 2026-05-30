const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const { Groq } = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Rate limit config: 5 requests per hour per IP for forms
const formLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 1 giờ.' }
});

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
app.post('/api/quote-requests', formLimiter, [
    body('fullName').notEmpty().withMessage('Họ tên không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('phone').isNumeric().withMessage('Số điện thoại không hợp lệ').isLength({ min: 8, max: 15 }).withMessage('Số điện thoại phải từ 8-15 số')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
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
app.post('/api/distributors', formLimiter, [
    body('companyName').notEmpty().withMessage('Tên công ty không được để trống'),
    body('contactPerson').notEmpty().withMessage('Người liên hệ không được để trống'),
    body('zaloPhone').isNumeric().withMessage('Số Zalo không hợp lệ').isLength({ min: 8, max: 15 }).withMessage('Số Zalo phải từ 8-15 số'),
    body('city').notEmpty().withMessage('Tỉnh/Thành phố không được để trống')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
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
            res.cookie('adminToken', token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 24 * 60 * 60 * 1000 
            });
            res.json({ user: { username: user.Username, role: user.Role } });
        } else {
            res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
        }
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Kiểm tra trạng thái đăng nhập
app.get('/api/admin/me', (req, res) => {
    const token = req.cookies.adminToken;
    if (!token) return res.status(401).json({ error: 'Chưa đăng nhập' });
    
    jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token không hợp lệ' });
        res.json({ user: { username: decoded.username, role: decoded.role } });
    });
});

// Đăng xuất
app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.json({ message: 'Đã đăng xuất' });
});

// Middleware xác thực JWT
const verifyToken = (req, res, next) => {
    const token = req.cookies.adminToken;
    
    if (!token) return res.status(403).json({ error: 'Yêu cầu đăng nhập' });
    
    jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
        req.user = decoded;
        next();
    });
};

// 5.5. AI Chatbot (Groq API)
app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const chatHistory = req.body.history || [];

        let pool = await sql.connect(dbConfig);
        
        // 1. Lấy cấu hình AI từ DB
        let aiConfigResult = await pool.request().query('SELECT TOP 1 * FROM AiConfig ORDER BY Id DESC');
        if (aiConfigResult.recordset.length === 0) {
            return res.status(500).json({ error: 'Chưa cấu hình AI' });
        }
        const aiConfig = aiConfigResult.recordset[0];
        
        if (!aiConfig.GroqApiKey) {
            return res.status(500).json({ error: 'Thiếu API Key cho AI' });
        }

        // Khởi tạo lại Groq client với Key từ DB
        const dynamicGroq = new Groq({ apiKey: aiConfig.GroqApiKey });

        // 2. Lấy thông tin resins từ database để làm ngữ cảnh
        let result = await pool.request().query('SELECT * FROM Resins WHERE IsActive = 1');
        const resinsData = result.recordset;

        let contextInfo = "Bạn là trợ lý ảo AI chuyên nghiệp của RightChoiceVN, chuyên tư vấn về nhựa in 3D.\n";
        contextInfo += "Dưới đây là thông số các loại nhựa hiện có (Lấy từ Database của chúng tôi):\n\n";
        
        resinsData.forEach(r => {
            contextInfo += `- Dòng sản phẩm: ${r.Name}:\n`;
            contextInfo += `  + Ứng dụng/Mô tả: ${r.DescriptionVi}\n`;
            contextInfo += `  + Thời gian phơi sáng khuyên dùng: ${r.StatExposureText} (Base Exposure: ${r.BaseExposure})\n`;
            contextInfo += `  + Tỉ trọng (Density): ${r.Density}\n`;
            contextInfo += `  + Đặc tính cơ lý: ${r.Prop1LabelVi}: ${r.Prop1ValueVi}, ${r.Prop2LabelVi}: ${r.Prop2ValueVi}, ${r.Prop3LabelVi}: ${r.Prop3ValueVi}\n`;
            contextInfo += `  + Lời khuyên kỹ thuật: ${r.AdviceVi}\n\n`;
        });

        // 3. Gắn luật Prompt từ DB
        contextInfo += aiConfig.SystemPromptRules || "";

        const messages = [
            { role: "system", content: contextInfo },
            ...chatHistory,
            { role: "user", content: userMessage }
        ];

        const completion = await dynamicGroq.chat.completions.create({
            messages: messages,
            model: aiConfig.ModelName || "llama-3.1-8b-instant",
            temperature: 0.5,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "Xin lỗi, tôi đang gặp lỗi kết nối với trung tâm dữ liệu.";
        res.json({ reply });

    } catch (err) {
        console.error('Chatbot API Error:', err);
        res.status(500).json({ error: 'Chatbot service unavailable.' });
    }
});

// 5.6. Quản lý cấu hình AI (Yêu cầu Admin)
app.get('/api/admin/ai-config', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT TOP 1 * FROM AiConfig ORDER BY Id DESC');
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.json(null);
        }
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy cấu hình AI' });
    }
});

app.put('/api/admin/ai-config', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('GroqApiKey', sql.NVarChar(255), req.body.GroqApiKey)
            .input('ModelName', sql.NVarChar(100), req.body.ModelName)
            .input('SystemPromptRules', sql.NVarChar(sql.MAX), req.body.SystemPromptRules)
            .query(`
                IF EXISTS (SELECT * FROM AiConfig)
                BEGIN
                    UPDATE AiConfig SET 
                        GroqApiKey = @GroqApiKey,
                        ModelName = @ModelName,
                        SystemPromptRules = @SystemPromptRules
                END
                ELSE
                BEGIN
                    INSERT INTO AiConfig (GroqApiKey, ModelName, SystemPromptRules)
                    VALUES (@GroqApiKey, @ModelName, @SystemPromptRules)
                END
            `);
        res.json({ message: 'Lưu cấu hình AI thành công' });
    } catch (err) {
        console.error('Update AiConfig Error:', err);
        res.status(500).json({ error: 'Lỗi cập nhật cấu hình AI' });
    }
});

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
// 9. Lấy danh sách nhựa (Admin)
app.get('/api/admin/resins', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Resins ORDER BY Id DESC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi lấy dữ liệu nhựa' });
    }
});

// 10. Thêm nhựa mới
app.post('/api/admin/resins', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Code', sql.NVarChar(50), req.body.Code)
            .input('Name', sql.NVarChar(100), req.body.Name)
            .input('BaseExposure', sql.Decimal(4,2), req.body.BaseExposure)
            .input('Density', sql.Decimal(4,2), req.body.Density)
            .input('StabilityVi', sql.NVarChar(200), req.body.StabilityVi)
            .input('StabilityEn', sql.NVarChar(200), req.body.StabilityEn)
            .input('AdviceVi', sql.NVarChar(sql.MAX), req.body.AdviceVi)
            .input('AdviceEn', sql.NVarChar(sql.MAX), req.body.AdviceEn)
            .input('DescriptionVi', sql.NVarChar(500), req.body.DescriptionVi)
            .input('DescriptionEn', sql.NVarChar(500), req.body.DescriptionEn)
            .input('BadgeColor', sql.NVarChar(50), req.body.BadgeColor)
            .input('BadgeTextVi', sql.NVarChar(100), req.body.BadgeTextVi)
            .input('BadgeTextEn', sql.NVarChar(100), req.body.BadgeTextEn)
            .input('StatExposureText', sql.NVarChar(100), req.body.StatExposureText)
            .input('StatBarWidth', sql.Int, req.body.StatBarWidth)
            .input('Prop1LabelVi', sql.NVarChar(50), req.body.Prop1LabelVi)
            .input('Prop1LabelEn', sql.NVarChar(50), req.body.Prop1LabelEn)
            .input('Prop1ValueVi', sql.NVarChar(50), req.body.Prop1ValueVi)
            .input('Prop1ValueEn', sql.NVarChar(50), req.body.Prop1ValueEn)
            .input('Prop2LabelVi', sql.NVarChar(50), req.body.Prop2LabelVi)
            .input('Prop2LabelEn', sql.NVarChar(50), req.body.Prop2LabelEn)
            .input('Prop2ValueVi', sql.NVarChar(50), req.body.Prop2ValueVi)
            .input('Prop2ValueEn', sql.NVarChar(50), req.body.Prop2ValueEn)
            .input('Prop3LabelVi', sql.NVarChar(50), req.body.Prop3LabelVi)
            .input('Prop3LabelEn', sql.NVarChar(50), req.body.Prop3LabelEn)
            .input('Prop3ValueVi', sql.NVarChar(50), req.body.Prop3ValueVi)
            .input('Prop3ValueEn', sql.NVarChar(50), req.body.Prop3ValueEn)
            .input('ImageUrl', sql.NVarChar(255), req.body.ImageUrl)
            .input('IsFeatured', sql.Bit, req.body.IsFeatured)
            .input('IsActive', sql.Bit, req.body.IsActive)
            .query(`
                INSERT INTO Resins (
                    Code, Name, BaseExposure, Density, StabilityVi, StabilityEn, AdviceVi, AdviceEn,
                    DescriptionVi, DescriptionEn, BadgeColor, BadgeTextVi, BadgeTextEn, StatExposureText, StatBarWidth,
                    Prop1LabelVi, Prop1LabelEn, Prop1ValueVi, Prop1ValueEn, Prop2LabelVi, Prop2LabelEn, Prop2ValueVi, Prop2ValueEn,
                    Prop3LabelVi, Prop3LabelEn, Prop3ValueVi, Prop3ValueEn, ImageUrl, IsFeatured, IsActive
                ) VALUES (
                    @Code, @Name, @BaseExposure, @Density, @StabilityVi, @StabilityEn, @AdviceVi, @AdviceEn,
                    @DescriptionVi, @DescriptionEn, @BadgeColor, @BadgeTextVi, @BadgeTextEn, @StatExposureText, @StatBarWidth,
                    @Prop1LabelVi, @Prop1LabelEn, @Prop1ValueVi, @Prop1ValueEn, @Prop2LabelVi, @Prop2LabelEn, @Prop2ValueVi, @Prop2ValueEn,
                    @Prop3LabelVi, @Prop3LabelEn, @Prop3ValueVi, @Prop3ValueEn, @ImageUrl, @IsFeatured, @IsActive
                )
            `);
        res.json({ message: 'Thêm sản phẩm thành công' });
    } catch (err) {
        console.error('Error inserting resin:', err);
        res.status(500).json({ error: 'Lỗi thêm sản phẩm' });
    }
});

// 11. Cập nhật nhựa
app.put('/api/admin/resins/:id', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Id', sql.Int, req.params.id)
            .input('Code', sql.NVarChar(50), req.body.Code)
            .input('Name', sql.NVarChar(100), req.body.Name)
            .input('BaseExposure', sql.Decimal(4,2), req.body.BaseExposure)
            .input('Density', sql.Decimal(4,2), req.body.Density)
            .input('StabilityVi', sql.NVarChar(200), req.body.StabilityVi)
            .input('StabilityEn', sql.NVarChar(200), req.body.StabilityEn)
            .input('AdviceVi', sql.NVarChar(sql.MAX), req.body.AdviceVi)
            .input('AdviceEn', sql.NVarChar(sql.MAX), req.body.AdviceEn)
            .input('DescriptionVi', sql.NVarChar(500), req.body.DescriptionVi)
            .input('DescriptionEn', sql.NVarChar(500), req.body.DescriptionEn)
            .input('BadgeColor', sql.NVarChar(50), req.body.BadgeColor)
            .input('BadgeTextVi', sql.NVarChar(100), req.body.BadgeTextVi)
            .input('BadgeTextEn', sql.NVarChar(100), req.body.BadgeTextEn)
            .input('StatExposureText', sql.NVarChar(100), req.body.StatExposureText)
            .input('StatBarWidth', sql.Int, req.body.StatBarWidth)
            .input('Prop1LabelVi', sql.NVarChar(50), req.body.Prop1LabelVi)
            .input('Prop1LabelEn', sql.NVarChar(50), req.body.Prop1LabelEn)
            .input('Prop1ValueVi', sql.NVarChar(50), req.body.Prop1ValueVi)
            .input('Prop1ValueEn', sql.NVarChar(50), req.body.Prop1ValueEn)
            .input('Prop2LabelVi', sql.NVarChar(50), req.body.Prop2LabelVi)
            .input('Prop2LabelEn', sql.NVarChar(50), req.body.Prop2LabelEn)
            .input('Prop2ValueVi', sql.NVarChar(50), req.body.Prop2ValueVi)
            .input('Prop2ValueEn', sql.NVarChar(50), req.body.Prop2ValueEn)
            .input('Prop3LabelVi', sql.NVarChar(50), req.body.Prop3LabelVi)
            .input('Prop3LabelEn', sql.NVarChar(50), req.body.Prop3LabelEn)
            .input('Prop3ValueVi', sql.NVarChar(50), req.body.Prop3ValueVi)
            .input('Prop3ValueEn', sql.NVarChar(50), req.body.Prop3ValueEn)
            .input('ImageUrl', sql.NVarChar(255), req.body.ImageUrl)
            .input('IsFeatured', sql.Bit, req.body.IsFeatured)
            .input('IsActive', sql.Bit, req.body.IsActive)
            .query(`
                UPDATE Resins SET 
                    Code = @Code, Name = @Name, BaseExposure = @BaseExposure, Density = @Density, 
                    StabilityVi = @StabilityVi, StabilityEn = @StabilityEn, AdviceVi = @AdviceVi, AdviceEn = @AdviceEn,
                    DescriptionVi = @DescriptionVi, DescriptionEn = @DescriptionEn, BadgeColor = @BadgeColor, 
                    BadgeTextVi = @BadgeTextVi, BadgeTextEn = @BadgeTextEn, StatExposureText = @StatExposureText, StatBarWidth = @StatBarWidth,
                    Prop1LabelVi = @Prop1LabelVi, Prop1LabelEn = @Prop1LabelEn, Prop1ValueVi = @Prop1ValueVi, Prop1ValueEn = @Prop1ValueEn, 
                    Prop2LabelVi = @Prop2LabelVi, Prop2LabelEn = @Prop2LabelEn, Prop2ValueVi = @Prop2ValueVi, Prop2ValueEn = @Prop2ValueEn,
                    Prop3LabelVi = @Prop3LabelVi, Prop3LabelEn = @Prop3LabelEn, Prop3ValueVi = @Prop3ValueVi, Prop3ValueEn = @Prop3ValueEn, 
                    ImageUrl = @ImageUrl, IsFeatured = @IsFeatured, IsActive = @IsActive
                WHERE Id = @Id
            `);
        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        console.error('Error updating resin:', err);
        res.status(500).json({ error: 'Lỗi cập nhật sản phẩm' });
    }
});

// 12. Xóa/Ẩn nhựa
app.delete('/api/admin/resins/:id', verifyToken, async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Id', sql.Int, req.params.id)
            .query('DELETE FROM Resins WHERE Id = @Id');
        res.json({ message: 'Xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi xóa sản phẩm' });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
