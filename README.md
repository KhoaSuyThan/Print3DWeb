# RightChoiceVN
Nhà sản xuất nhựa in 3D photopolymer chất lượng cao hàng đầu tại Việt Nam.

## Giới thiệu
RightChoiceVN là dự án phát triển nền tảng website cho nhà sản xuất nhựa in 3D đầu tiên tại Việt Nam, chuyên về các vật liệu quang trùng hợp (photopolymer) hiệu năng cao. Dự án cung cấp giao diện người dùng chuyên nghiệp (Front-end) và máy chủ (Back-end) mạnh mẽ, mang đến trải nghiệm liền mạch cho cả khách hàng cá nhân và đối tác doanh nghiệp.

## Các tính năng chính
- **Giao diện hiện đại & Tương thích mọi thiết bị:** Thiết kế chuẩn UI/UX, hỗ trợ chế độ Tối/Sáng (Dark/Light mode) và đa ngôn ngữ (Tiếng Việt / Tiếng Anh).
- **Bộ tính toán in 3D thông minh (Calculator):** Giúp người dùng ước lượng nhanh thời gian phơi sáng, khối lượng, số lớp in và độ ổn định dựa trên dòng nhựa, thể tích và độ dày lớp in mong muốn.
- **Danh mục sản phẩm đa dạng:** Hiển thị và quản lý các dòng nhựa cao cấp như Basic v.18, Art Resin, Flexible Resin, Dental Model, Rigid One.
- **Giải pháp theo ngành nghề:** Tư vấn tự động dòng nhựa phù hợp cho các lĩnh vực: Nha khoa, Kỹ thuật tạo mẫu, Giáo dục, Kiến trúc, Sản xuất OEM, và Nghệ thuật (Cosplay).
- **Hệ thống báo giá & Đăng ký đại lý:** Biểu mẫu tiện lợi giúp khách hàng nhận báo giá siêu tốc hoặc đăng ký trở thành đối tác phân phối chính thức.
- **Trợ lý ảo AI (Chatbot):** Tích hợp AI tư vấn 24/7 về thông số in, chọn loại nhựa, chính sách đại lý và vận chuyển.
- **Trang quản trị (Admin Dashboard):** Quản lý danh sách sản phẩm, tin nhắn liên hệ, yêu cầu báo giá và các tính năng khác của hệ thống.

## Công nghệ sử dụng
- **Front-end:** HTML5, CSS3 (Custom properties, Flexbox/Grid, Animations), Vanilla JavaScript.
- **Back-end:** Node.js, Express.js.
- **Database:** Microsoft SQL Server (được cấu hình qua tệp `database.sql`).
- **Dependencies chính:** `express-validator`, `express-rate-limit`, `multer` (xử lý file upload), `bcrypt` (mã hóa mật khẩu), `cookie-parser`, `groq-sdk` (tích hợp trợ lý AI).

## Hướng dẫn cài đặt và chạy dự án

### Yêu cầu hệ thống
- **Node.js** (Khuyến nghị phiên bản v16.x trở lên)
- **npm** (trình quản lý gói đi kèm với Node.js)
- **Cơ sở dữ liệu SQL** (Microsoft SQL Server v16.x trở lên hoặc SQL Server Express / LocalDB)

### Các bước cài đặt

1. **Cài đặt các gói phụ thuộc (dependencies):**
   Mở terminal/command prompt tại thư mục gốc của dự án và chạy lệnh:
   ```bash
   npm install
   ```

2. **Thiết lập Cơ sở dữ liệu:**
   - Chạy script trong file `database.sql` trên SQL Server của bạn (qua SQL Server Management Studio hoặc sqlcmd) để tự động khởi tạo database `RightChoiceVN` cùng các bảng và dữ liệu mẫu cần thiết.

3. **Cấu hình biến môi trường:**
   - Tạo file `.env` trong thư mục `backend` và điền các thông tin cấu hình cần thiết:
   ```env
   DB_SERVER=localhost
   DB_NAME=RightChoiceVN
   PORT=3000
   JWT_SECRET=SieuBaoMat12345!
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Khởi chạy ứng dụng:**
   Chạy lệnh sau để khởi động server ở chế độ phát triển:
   ```bash
   npm run dev
   ```
   Hoặc chạy ở chế độ tiêu chuẩn:
   ```bash
   npm start
   ```

5. **Truy cập ứng dụng:**
   Mở trình duyệt web và truy cập vào địa chỉ: `http://localhost:3000` (hoặc cổng mà bạn đã thiết lập).

## Cấu trúc thư mục tham khảo
```text
RightChoiceVN/
│
├── assets/             # Hình ảnh (hero, lab, dental, engineering,...) và tài nguyên tĩnh
├── backend/            # Mã nguồn Node.js/Express server và cấu hình
├── node_modules/       # Thư viện phụ thuộc được quản lý bởi npm
├── index.html          # Trang chủ ứng dụng (Landing Page)
├── style.css           # Tệp định dạng giao diện chính
├── main.js             # Logic xử lý giao diện người dùng và gọi API
├── admin.html          # Giao diện trang quản trị viên
├── admin.css           # Tệp định dạng dành riêng cho trang quản trị
├── admin.js            # Logic xử lý cho trang quản trị
├── database.sql        # Script khởi tạo cơ sở dữ liệu
├── package.json        # Thông tin cấu hình dự án, scripts và danh sách thư viện
└── .gitignore          # Các tệp và thư mục bị bỏ qua khi sử dụng Git
```

## Bản quyền
© 2026 RightChoiceVN. Tất cả quyền được bảo lưu. Nơi Đổi Mới Nội Địa Đáp Ứng Tiêu Chuẩn Toàn Cầu.
