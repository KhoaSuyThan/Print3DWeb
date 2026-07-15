# CHANGELOG - RightChoiceVN

Nhật ký thay đổi mã nguồn của dự án RightChoiceVN.

---

## [2026-07-15] - UI/UX & Tính năng: Tối ưu hóa giao diện toàn trang và Đồng bộ đa ngôn ngữ

### 🎨 Cải thiện UI / UX & Bố cục
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
