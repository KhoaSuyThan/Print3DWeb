-- ==============================================================================
-- RightChoiceVN Database Schema
-- Description: Bảng cơ sở dữ liệu để lưu trữ thông tin từ Landing Page
-- ==============================================================================

-- 1. Bảng lưu trữ Yêu cầu báo giá (Quote Requests)
CREATE TABLE QuoteRequests (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    InterestedResin NVARCHAR(100) NOT NULL,
    Message NVARCHAR(MAX) NULL,
    Status NVARCHAR(50) DEFAULT 'New', -- Trạng thái: New, Contacted, Completed, Cancelled
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 2. Bảng lưu trữ Đăng ký làm đại lý (Distributor Applications)
CREATE TABLE DistributorApplications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CompanyName NVARCHAR(200) NOT NULL,
    ContactPerson NVARCHAR(100) NOT NULL,
    ZaloPhone NVARCHAR(20) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    EstimatedVolume NVARCHAR(100) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Pending', -- Trạng thái: Pending, Reviewed, Approved, Rejected
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- 3. (Tùy chọn) Bảng lưu trữ thông số các dòng nhựa (Resins/Products)
-- Đã chuyển hoàn toàn sang Dynamic CMS
CREATE TABLE Resins (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Code NVARCHAR(50) NOT NULL UNIQUE, -- VD: basic, art, flexible...
    Name NVARCHAR(100) NOT NULL,
    BaseExposure DECIMAL(4,2) NOT NULL,
    Density DECIMAL(4,2) NOT NULL,
    StabilityVi NVARCHAR(200) NOT NULL,
    StabilityEn NVARCHAR(200) NOT NULL,
    AdviceVi NVARCHAR(MAX) NOT NULL,
    AdviceEn NVARCHAR(MAX) NOT NULL,
    
    -- Các trường mở rộng cho trang hiển thị Sản phẩm (CMS)
    DescriptionVi NVARCHAR(500) NULL,
    DescriptionEn NVARCHAR(500) NULL,
    BadgeColor NVARCHAR(50) NULL,      -- VD: badge-blue
    BadgeTextVi NVARCHAR(100) NULL,    -- VD: Dòng Phổ Thông
    BadgeTextEn NVARCHAR(100) NULL,    -- VD: Standard Resin
    
    StatExposureText NVARCHAR(100) NULL, -- VD: 2.5 - 3.2 s/layer
    StatBarWidth INT NULL,               -- VD: 80 (%)
    
    Prop1LabelVi NVARCHAR(50) NULL,
    Prop1LabelEn NVARCHAR(50) NULL,
    Prop1ValueVi NVARCHAR(50) NULL,
    Prop1ValueEn NVARCHAR(50) NULL,
    
    Prop2LabelVi NVARCHAR(50) NULL,
    Prop2LabelEn NVARCHAR(50) NULL,
    Prop2ValueVi NVARCHAR(50) NULL,
    Prop2ValueEn NVARCHAR(50) NULL,
    
    Prop3LabelVi NVARCHAR(50) NULL,
    Prop3LabelEn NVARCHAR(50) NULL,
    Prop3ValueVi NVARCHAR(50) NULL,
    Prop3ValueEn NVARCHAR(50) NULL,
    
    ImageUrl NVARCHAR(255) NULL,       -- Đường dẫn ảnh sản phẩm
    IsFeatured BIT DEFAULT 0,          -- 1: Nổi bật (hiển thị thẻ to)
    
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Script INSERT dữ liệu có thể tham khảo từ /backend/migrate.js (đã bị xóa sau khi di chuyển dữ liệu)
GO

-- 4. Bảng lưu trữ tài khoản Admin (AdminUsers)
CREATE TABLE AdminUsers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL, -- Sẽ lưu mật khẩu dạng plaintext tĩnh hoặc hash đơn giản
    Role NVARCHAR(50) DEFAULT 'Admin',
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Thêm tài khoản admin mặc định (Mật khẩu là 123456)
INSERT INTO AdminUsers (Username, PasswordHash) VALUES ('admin', '123456');
GO

-- 5. Bảng lưu vết tính toán (CalculatorLogs)
CREATE TABLE CalculatorLogs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ResinCode NVARCHAR(50) NOT NULL,
    Volume DECIMAL(10,2) NOT NULL,
    LayerHeight DECIMAL(10,2) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO
