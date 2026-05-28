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
-- Để sau này không cần hardcode trong main.js
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
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Insert dữ liệu mẫu cho bảng Resins dựa trên main.js hiện tại
INSERT INTO Resins (Code, Name, BaseExposure, Density, StabilityVi, StabilityEn, AdviceVi, AdviceEn)
VALUES 
('basic', 'Basic v.18', 2.8, 1.1, N'Khá Tốt (85%)', 'Good (85%)', N'Dòng nhựa Basic v.18 có độ tương thích máy in cực rộng. Rất phù hợp cho các mô hình nghiên cứu đa dụng học tập, cấu trúc dày. Khuyến nghị thời gian phơi sáng lớp đáy (bottom exposure) là 25s - 35s cho 6 lớp đầu để bám bàn chắc chắn.', 'Basic v.18 resin has extremely wide printer compatibility. Ideal for general purpose learning, research, and thick models. Recommended bottom exposure is 25s - 35s for the first 6 layers to ensure bed adhesion.'),
('art', 'Art Resin', 2.2, 1.15, N'Tuyệt Vời (90%)', 'Excellent (90%)', N'Art Resin chuyên dùng cho các chi tiết mỹ thuật đòi hỏi độ phân giải siêu nét (như nhân vật Anime, kiến trúc thu nhỏ). Khuyên dùng màn hình in Mono 4K/8K. Rửa sạch mô hình bằng cồn IPA 95% và phơi đèn UV bổ sung trong 3-5 phút để đạt độ cứng tối đa.', 'Art Resin is specialized for art parts requiring ultra-sharp details (like Anime figures, miniature architecture). Mono 4K/8K printer screens recommended. Wash model in 95% IPA and post-cure under UV light for 3-5 minutes to reach maximum hardness.'),
('flexible', 'Flexible Resin', 3.2, 1.05, N'Tốt & Đàn Hồi (80%)', 'Good & Elastic (80%)', N'Flexible Resin tạo ra mô hình có độ dẻo đàn hồi cao. Chú ý: Hãy giảm tốc độ nhấc bàn in (Lift Speed) xuống khoảng 40-55 mm/min để tránh lực hút chân không làm rách màng FEP đáy khay chứa. Cần thiết kế lực chống support dày hơn thông thường.', 'Flexible Resin produces parts with high elasticity. Note: Reduce build plate lift speed to 40-55 mm/min to prevent vacuum forces from tearing FEP film. Thicker support tips than standard are recommended.'),
('dental', 'Dental Model', 2.8, 1.1, N'Cực Tốt & Chính Xác (95%)', 'Excellent & Accurate (95%)', N'Dòng nhựa Nha khoa Dental Model yêu cầu độ sạch tối đa ở khay chứa (VAT) và màn hình in. Nên in ở nhiệt độ phòng ổn định từ 25-30°C để đảm bảo độ mịn bề mặt hoàn hảo và sai lệch kích thước nhỏ nhất. Thích hợp in máng chỉnh nha, hướng dẫn implant.', 'Dental Model resin requires maximum cleanliness in the vat and LCD screen. Keep room temperature stable at 25-30°C for perfect surface finish and minimal dimensional deviation. Ideal for ortho models and implant guides.'),
('rigid', 'Rigid One', 2.8, 1.2, N'Hoàn Hảo & Siêu Cứng (98%)', 'Perfect & Ultra Rigid (98%)', N'Rigid One lý tưởng cho các chi tiết kết cấu kỹ thuật chịu lực nén ép hoặc ren xoắn ốc trực tiếp. Sau khi rửa sạch bằng cồn, bắt buộc phải sấy nhiệt nhẹ (50°C) kết hợp phơi UV trong vòng 10-15 phút để tăng tối đa liên kết ngang phân tử và độ bền cơ lý học.', 'Rigid One is ideal for engineering structural parts subject to compression or direct threading. After washing in alcohol, hot-curing at 50°C combined with 10-15 mins UV curing is mandatory to maximize cross-linking and mechanical properties.'),
('clear', 'Crystal Clear', 2.6, 1.12, N'Tuyệt Vời & Kháng Ố (92%)', 'Excellent & Yellowing Resistant (92%)', N'Crystal Clear mang lại độ trong suốt vượt trội như thủy tinh. Chú ý: Tránh rửa trong cồn IPA quá lâu (quá 3 phút) để tránh bề mặt bị mờ sương trắng. Khuyên dùng cồn sạch 99% để rửa, sau đó phủ một lớp sơn Clear Coat Acrylic kháng UV mỏng để mẫu đạt độ trong quang học tối ưu nhất.', 'Crystal Clear delivers glass-like transparency. Warning: Avoid washing in IPA for over 3 minutes to prevent surface frosting. Recommend using fresh 99% alcohol, then applying a thin UV-resistant clear acrylic coating for optimal optical clarity.');
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
