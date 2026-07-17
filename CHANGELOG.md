# CHANGELOG - RightChoiceVN

Nhật ký thay đổi mã nguồn của dự án RightChoiceVN.

---

## [2026-07-17] - Sửa lỗi: Cấu hình Cơ sở dữ liệu và Dependencies khi clone dự án

### ⚙️ Hệ thống & Sửa lỗi
- **Cập nhật CSDL tự động**: Thêm các câu lệnh kiểm tra và tạo database `RightChoiceVN` tự động ở đầu tệp `database.sql` để tránh lỗi khi chạy script.
- **Sửa tài liệu hướng dẫn**: Đính chính hệ quản trị CSDL yêu cầu là **Microsoft SQL Server** trong `README.md`, đồng thời cập nhật đúng mô tả file cấu hình `.env` khớp với backend.
- **Đồng bộ Dependencies**: Gộp toàn bộ các thư viện backend (`express`, `cors`, `jsonwebtoken`, `mssql`, `msnodesqlv8`, `dotenv`) vào tệp `package.json` ở thư mục gốc của dự án, giúp người dùng cài đặt toàn bộ dependencies chỉ với một lệnh duy nhất.

## [2026-07-15] - UI/UX: Nâng cấp tương phản và phối màu pastel cho Light Mode

### 🎨 Cải thiện UI / UX
- **Màu nền xám đậm rõ rệt**: Đưa màu nền chính của trang (`--bg-main`) từ trắng tinh/xám nhạt sang màu xám Slate (`#dee2e6`) để làm nổi bật các thẻ (cards) nổi phía trên.
- **Màu nền pastel cho từng loại nhựa**: Tô màu nền nhạt tương ứng với từng chủ đề thẻ nhựa (Basic màu xanh trời nhạt, Art màu tím nhạt, Flexible màu xanh ngọc nhạt, v.v.) kèm viền 2px tương phản cao để tạo chiều sâu và phân cấp trực quan đẹp mắt.
- **Khắc phục lỗi tương phản nút bấm**: Thiết lập thuộc tính `!important` màu chữ trắng (`#ffffff`) cho nút bấm `.btn-primary` và `.btn-secondary` trong Light Mode, tránh việc chữ bị chuyển màu tối trên nền gradient.
- **Đồng bộ nút bấm "Tính Toán In"**: Đồng bộ toàn bộ nút bấm ở các thẻ sản phẩm sang dạng nút đặc (Solid) có màu thương hiệu riêng biệt và chữ trắng (`#ffffff`) sắc nét thay vì dùng dạng viền (Outline) có chữ tối khó đọc.
- **Làm nổi bật ô nhập liệu**: Đặt viền 1.5px tối (`rgba(0,0,0,0.3)`) và nền trắng tinh cho `.form-control`, ngăn chặn hiện tượng mất ranh giới ô nhập liệu trên nền thẻ.
- **Sửa lỗi tương phản thẻ thống kê (99.8%)**: Chuyển nền `.mini-stat-card` sang màu trắng mờ kính (`rgba(255, 255, 255, 0.95)`) để chữ số xanh/tím và chữ mô tả màu xám hiển thị rõ ràng trên hình nền phòng thí nghiệm.
- **Sửa lỗi chữ biến trắng khi hover thẻ trụ cột**: Khóa màu chữ mô tả khi hover thẻ trụ cột (`.pillar-card:hover p`) ở màu xám đậm (`var(--text-secondary)`) thay vì màu trắng nhạt để tránh bị lóa trên nền sáng.

## [2026-07-15] - UI/UX & Tính năng: Tối ưu hóa giao diện toàn trang và Đồng bộ đa ngôn ngữ

### 🎨 Cải thiện UI / UX & Bố cục
- **Tối ưu hóa Light Mode**: Sửa lỗi tương phản chữ tối trên nền tối ở phần Ngành nghề bằng cách đưa nền của `.tab-content-container` về dạng sáng mờ kính. Đồng bộ màu nền sáng mờ kính cho cả hai thẻ Form (`.quote-form-card` và `.dist-form-card`), giữ nguyên viền thương hiệu Soft Blue/Purple. Làm nổi bật tab đang hoạt động với màu gradient thương hiệu và chữ trắng sắc nét. Tối ưu hóa viền các thẻ bộ tính toán (Calculator) và thanh trượt để hài hòa trong giao diện sáng.
- **Footer**: Thu nhỏ khoảng cách (padding/gap), cỡ chữ và margin để chân trang nhỏ gọn, tinh tế.
- **Form Đăng ký & Báo giá**: Chia đôi màn hình cân đối (50/50), đồng bộ phong cách glassmorphism với màu sắc Cyan/Purple, đưa dropdown Tỉnh & Quận/Huyện lên cùng dòng. Loại bỏ badge "Cơ Hội Hợp Tác".
- **Về Chúng Tôi**: Gộp phần giới thiệu sứ mệnh/khát vọng thành 1 câu duy nhất. Ảnh lab nâng chiều cao lên `310px` kèm 2 thẻ stats bay nổi mờ kính.
- **Sản phẩm & Ngành nghề**: Bố cục lại grid sản phẩm 3 cột (ảnh chiếm diện tích lớn hơn, 160px). Thanh chọn tab ngành nghề thu gọn trên 1 dòng duy nhất có thể cuộn ngang, thu nhỏ font chữ chi tiết.
- **Bộ tính toán (Calculator)**: Thu nhỏ chữ, khoảng cách kết quả dự báo và bổ sung nút liên hệ lưu analytics.
- **Tối ưu hóa layout Hero/About**: Giảm padding, margin và cỡ chữ tiêu đề trên toàn trang (compact view).

### 🌐 Đa ngôn ngữ & Bản địa hóa
- **Dịch ngôn ngữ tại chỗ (In-place Translation)**: Tối ưu hàm `renderResins` để dịch trực tiếp các thuộc tính nhựa in (badge, description, labels, values như hardness/flexibility, button text) trên DOM hiện có mà không xóa/vẽ lại, loại bỏ lỗi chớp nháy hoặc lặp lại hiệu ứng fade-in.
- **Cascade Dropdown & Placeholders**: Triển khai cascade dropdown Tỉnh -> Huyện bằng dữ liệu 34 tỉnh thành mới theo NQ 202/2025/QH15. Tự động dịch tiêu đề placeholder của dropdown tỉnh thành và dịch nhãn "Quận / Huyện" -> "District".
- **State Preservation**: Giữ nguyên loại nhựa đang chọn trong Calculator khi chuyển đổi ngôn ngữ.

### ⚙️ Hệ thống & Sửa lỗi
- **Ràng buộc số điện thoại**: Giới hạn chỉ nhập ký tự số/kí tự đặc biệt số điện thoại cho các ô nhập số điện thoại Zalo.
- **Sửa lỗi crash Form**: Đổi ID trường liên hệ từ `d-contact` sang `d-name` đồng bộ giữa HTML và JS, khắc phục lỗi crash `null value` khi submit đăng ký đại lý.
