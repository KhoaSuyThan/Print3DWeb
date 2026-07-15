/**
 * Dữ liệu hành chính Việt Nam - Cập nhật theo Nghị quyết 202/2025/QH15
 * Hiệu lực từ 01/07/2025: Việt Nam còn 34 đơn vị hành chính cấp tỉnh
 * (28 tỉnh + 6 thành phố trực thuộc TW). Cấp huyện đã bị bãi bỏ.
 * Cột 2 liệt kê các vùng/địa danh kinh tế chính của từng tỉnh/TP.
 */
const VIETNAM_PROVINCES = {

  // ── 6 THÀNH PHỐ TRỰC THUỘC TRUNG ƯƠNG ───────────────────────────────────
  "Hà Nội": [
    "Ba Đình","Hoàn Kiếm","Tây Hồ","Long Biên","Cầu Giấy","Đống Đa",
    "Hai Bà Trưng","Hoàng Mai","Thanh Xuân","Hà Đông","Sơn Tây",
    "Sóc Sơn","Đông Anh","Gia Lâm","Nam Từ Liêm","Bắc Từ Liêm",
    "Thanh Trì","Mê Linh","Ba Vì","Phúc Thọ","Đan Phượng","Hoài Đức",
    "Quốc Oai","Thạch Thất","Chương Mỹ","Thanh Oai","Thường Tín",
    "Phú Xuyên","Ứng Hòa","Mỹ Đức"
  ],

  // TP.HCM sáp nhập Bình Dương + Bà Rịa - Vũng Tàu (NQ 202/2025)
  "TP. Hồ Chí Minh": [
    "Quận 1","Quận 3","Quận 4","Quận 5","Quận 6","Quận 7","Quận 8",
    "Quận 10","Quận 11","Quận 12","Bình Thạnh","Gò Vấp","Phú Nhuận",
    "Tân Bình","Tân Phú","Bình Tân","TP. Thủ Đức","Bình Chánh",
    "Cần Giờ","Củ Chi","Hóc Môn","Nhà Bè",
    // Vùng Bình Dương (sáp nhập)
    "Thủ Dầu Một","Dĩ An","Thuận An","Bến Cát","Tân Uyên","Bàu Bàng","Dầu Tiếng","Phú Giáo","Bắc Tân Uyên",
    // Vùng Bà Rịa - Vũng Tàu (sáp nhập)
    "Vũng Tàu","Phú Mỹ","Bà Rịa","Châu Đức","Côn Đảo","Đất Đỏ","Long Điền","Xuyên Mộc"
  ],

  // Hải Phòng sáp nhập Hải Dương (NQ 202/2025)
  "Hải Phòng": [
    "Hồng Bàng","Lê Chân","Ngô Quyền","Kiến An","Hải An","Đồ Sơn","Dương Kinh",
    "Thủy Nguyên","An Dương","An Lão","Kiến Thụy","Tiên Lãng","Vĩnh Bảo","Cát Hải",
    // Vùng Hải Dương (sáp nhập)
    "Hải Dương","Chí Linh","Kinh Môn","Bình Giang","Cẩm Giàng","Gia Lộc",
    "Kim Thành","Nam Sách","Ninh Giang","Thanh Hà","Thanh Miện","Tứ Kỳ"
  ],

  "Đà Nẵng": [
    "Hải Châu","Thanh Khê","Sơn Trà","Ngũ Hành Sơn","Liên Chiểu","Cẩm Lệ","Hòa Vang"
  ],

  "Cần Thơ": [
    "Ninh Kiều","Bình Thủy","Cái Răng","Ô Môn","Thốt Nốt","Vĩnh Thạnh","Cờ Đỏ","Phong Điền","Thới Lai"
  ],

  "Huế": [
    "TP. Huế","A Lưới","Hương Thủy","Hương Trà","Nam Đông","Phong Điền","Phú Lộc","Phú Vang","Quảng Điền"
  ],

  // ── 28 TỈNH ──────────────────────────────────────────────────────────────

  // Không sáp nhập
  "Cao Bằng": ["TP. Cao Bằng","Bảo Lạc","Bảo Lâm","Hà Quảng","Hạ Lang","Nguyên Bình","Quảng Hòa","Thạch An","Trà Lĩnh","Trùng Khánh"],
  "Điện Biên": ["TP. Điện Biên Phủ","Mường Lay","Điện Biên","Điện Biên Đông","Mường Ảng","Mường Chà","Mường Nhé","Nậm Pồ","Tủa Chùa","Tuần Giáo"],
  "Hà Tĩnh": ["TP. Hà Tĩnh","Hồng Lĩnh","Kỳ Anh","Cẩm Xuyên","Can Lộc","Đức Thọ","Hương Khê","Hương Sơn","Lộc Hà","Nghi Xuân","Thạch Hà","Vũ Quang"],
  "Lai Châu": ["TP. Lai Châu","Mường Tè","Nậm Nhùn","Phong Thổ","Sìn Hồ","Tam Đường","Tân Uyên","Than Uyên"],
  "Lạng Sơn": ["TP. Lạng Sơn","Bắc Sơn","Bình Gia","Cao Lộc","Chi Lăng","Đình Lập","Hữu Lũng","Lộc Bình","Tràng Định","Văn Lãng","Văn Quan"],
  "Nghệ An": ["TP. Vinh","Cửa Lò","Thái Hòa","Anh Sơn","Con Cuông","Diễn Châu","Đô Lương","Hưng Nguyên","Kỳ Sơn","Nam Đàn","Nghi Lộc","Nghĩa Đàn","Quế Phong","Quỳ Châu","Quỳ Hợp","Quỳnh Lưu","Tân Kỳ","Thanh Chương","Tương Dương","Yên Thành"],
  "Quảng Ninh": ["TP. Hạ Long","Cẩm Phả","Uông Bí","Móng Cái","Đông Triều","Quảng Yên","Ba Chẽ","Bình Liêu","Cô Tô","Đầm Hà","Hải Hà","Tiên Yên","Vân Đồn"],
  "Sơn La": ["TP. Sơn La","Bắc Yên","Mai Sơn","Mộc Châu","Mường La","Phù Yên","Quỳnh Nhai","Sông Mã","Sốp Cộp","Thuận Châu","Vân Hồ","Yên Châu"],
  "Thanh Hóa": ["TP. Thanh Hóa","Bỉm Sơn","Sầm Sơn","Bá Thước","Cẩm Thủy","Đông Sơn","Hà Trung","Hậu Lộc","Hoằng Hóa","Lang Chánh","Mường Lát","Nga Sơn","Ngọc Lặc","Như Thanh","Như Xuân","Nông Cống","Quan Hóa","Quan Sơn","Quảng Xương","Thạch Thành","Thiệu Hóa","Thọ Xuân","Thường Xuân","Tĩnh Gia","Triệu Sơn","Vĩnh Lộc","Yên Định"],

  // Sáp nhập
  // Tuyên Quang = Tuyên Quang + Hà Giang
  "Tuyên Quang": [
    "TP. Tuyên Quang","Chiêm Hóa","Hàm Yên","Lâm Bình","Na Hang","Sơn Dương","Yên Sơn",
    // Vùng Hà Giang (sáp nhập)
    "TP. Hà Giang","Bắc Mê","Bắc Quang","Đồng Văn","Hoàng Su Phì","Mèo Vạc","Quản Bạ","Quang Bình","Vị Xuyên","Xín Mần","Yên Minh"
  ],

  // Lào Cai = Lào Cai + Yên Bái
  "Lào Cai": [
    "TP. Lào Cai","Bắc Hà","Bảo Thắng","Bảo Yên","Bát Xát","Mường Khương","Sa Pa","Si Ma Cai","Văn Bàn",
    // Vùng Yên Bái (sáp nhập)
    "TP. Yên Bái","Nghĩa Lộ","Lục Yên","Mù Cang Chải","Trấn Yên","Trạm Tấu","Văn Chấn","Văn Yên","Yên Bình"
  ],

  // Thái Nguyên = Thái Nguyên + Bắc Kạn
  "Thái Nguyên": [
    "TP. Thái Nguyên","Phổ Yên","Sông Công","Định Hóa","Đại Từ","Đồng Hỷ","Phú Bình","Phú Lương","Võ Nhai",
    // Vùng Bắc Kạn (sáp nhập)
    "TP. Bắc Kạn","Ba Bể","Bạch Thông","Chợ Đồn","Chợ Mới","Na Rì","Ngân Sơn","Pác Nặm"
  ],

  // Phú Thọ = Phú Thọ + Vĩnh Phúc + Hòa Bình
  "Phú Thọ": [
    "TP. Việt Trì","TX. Phú Thọ","Cẩm Khê","Đoan Hùng","Hạ Hòa","Lâm Thao","Phù Ninh","Tam Nông","Tân Sơn","Thanh Ba","Thanh Sơn","Thanh Thủy","Yên Lập",
    // Vùng Vĩnh Phúc (sáp nhập)
    "TP. Vĩnh Yên","Phúc Yên","Bình Xuyên","Lập Thạch","Sông Lô","Tam Đảo","Tam Dương","Vĩnh Tường","Yên Lạc",
    // Vùng Hòa Bình (sáp nhập)
    "TP. Hòa Bình","Cao Phong","Đà Bắc","Kim Bôi","Lạc Sơn","Lạc Thủy","Lương Sơn","Mai Châu","Tân Lạc","Yên Thủy"
  ],

  // Bắc Ninh = Bắc Ninh + Bắc Giang
  "Bắc Ninh": [
    "TP. Bắc Ninh","Từ Sơn","Gia Bình","Lương Tài","Quế Võ","Thuận Thành","Tiên Du","Yên Phong",
    // Vùng Bắc Giang (sáp nhập)
    "TP. Bắc Giang","Hiệp Hòa","Lạng Giang","Lục Nam","Lục Ngạn","Sơn Động","Tân Yên","Việt Yên","Yên Dũng","Yên Thế"
  ],

  // Hưng Yên = Hưng Yên + Thái Bình
  "Hưng Yên": [
    "TP. Hưng Yên","Mỹ Hào","Ân Thi","Khoái Châu","Kim Động","Phù Cừ","Tiên Lữ","Văn Giang","Văn Lâm","Yên Mỹ",
    // Vùng Thái Bình (sáp nhập)
    "TP. Thái Bình","Đông Hưng","Hưng Hà","Kiến Xương","Quỳnh Phụ","Thái Thụy","Tiền Hải","Vũ Thư"
  ],

  // Ninh Bình = Ninh Bình + Hà Nam + Nam Định
  "Ninh Bình": [
    "TP. Ninh Bình","Tam Điệp","Gia Viễn","Hoa Lư","Kim Sơn","Nho Quan","Yên Khánh","Yên Mô",
    // Vùng Hà Nam (sáp nhập)
    "TP. Phủ Lý","Bình Lục","Duy Tiên","Kim Bảng","Lý Nhân","Thanh Liêm",
    // Vùng Nam Định (sáp nhập)
    "TP. Nam Định","Giao Thủy","Hải Hậu","Mỹ Lộc","Nam Trực","Nghĩa Hưng","Trực Ninh","Vụ Bản","Xuân Trường","Ý Yên"
  ],

  // Quảng Trị (giữ + sáp nhập Quảng Bình)
  "Quảng Trị": [
    "TP. Đông Hà","TX. Quảng Trị","Cam Lộ","Cồn Cỏ","Đakrông","Gio Linh","Hải Lăng","Hướng Hóa","Triệu Phong","Vĩnh Linh",
    // Vùng Quảng Bình (sáp nhập)
    "TP. Đồng Hới","Ba Đồn","Bố Trạch","Lệ Thủy","Minh Hóa","Quảng Ninh","Quảng Trạch","Tuyên Hóa"
  ],

  // Quảng Ngãi (giữ + sáp nhập Quảng Nam)
  "Quảng Ngãi": [
    "TP. Quảng Ngãi","Bình Sơn","Đức Phổ","Lý Sơn","Minh Long","Mộ Đức","Nghĩa Hành","Sơn Hà","Sơn Tây","Tây Trà","Trà Bồng","Tư Nghĩa",
    // Vùng Quảng Nam (sáp nhập)
    "TP. Tam Kỳ","TP. Hội An","Bắc Trà My","Đại Lộc","Điện Bàn","Đông Giang","Duy Xuyên","Hiệp Đức","Nam Giang","Nam Trà My","Nông Sơn","Núi Thành","Phú Ninh","Phước Sơn","Quế Sơn","Tây Giang","Thăng Bình","Tiên Phước"
  ],

  // Gia Lai (giữ + sáp nhập Kon Tum)
  "Gia Lai": [
    "TP. Pleiku","An Khê","Ayun Pa","Chư Păh","Chư Prông","Chư Pưh","Chư Sê","Đắk Đoa","Đắk Pơ","Đức Cơ","Ia Grai","Ia Pa","K'Bang","Kông Chro","Krông Pa","Mang Yang","Phú Thiện",
    // Vùng Kon Tum (sáp nhập)
    "TP. Kon Tum","Đắk Glei","Đắk Hà","Đắk Tô","Ia H'Drai","Kon Plông","Kon Rẫy","Ngọc Hồi","Sa Thầy","Tu Mơ Rông"
  ],

  // Khánh Hòa (giữ + sáp nhập Ninh Thuận + Phú Yên + Bình Định)
  "Khánh Hòa": [
    "TP. Nha Trang","Cam Ranh","Ninh Hòa","Cam Lâm","Diên Khánh","Khánh Sơn","Khánh Vĩnh","Trường Sa","Vạn Ninh",
    // Vùng Ninh Thuận (sáp nhập)
    "TP. Phan Rang - Tháp Chàm","Bác Ái","Ninh Hải","Ninh Phước","Ninh Sơn","Thuận Bắc","Thuận Nam",
    // Vùng Phú Yên (sáp nhập)
    "TP. Tuy Hòa","Sông Cầu","Đông Hòa","Đồng Xuân","Phú Hòa","Sông Hinh","Sơn Hòa","Tây Hòa","Tuy An",
    // Vùng Bình Định (sáp nhập)
    "TP. Quy Nhơn","An Lão","An Nhơn","Hoài Ân","Hoài Nhơn","Phù Cát","Phù Mỹ","Tây Sơn","Tuy Phước","Vĩnh Thạnh"
  ],

  // Lâm Đồng (giữ + sáp nhập Đắk Nông + Bình Thuận)
  "Lâm Đồng": [
    "TP. Đà Lạt","Bảo Lộc","Bảo Lâm","Cát Tiên","Đạ Huoai","Đạ Tẻh","Đam Rông","Di Linh","Đơn Dương","Đức Trọng","Lạc Dương","Lâm Hà",
    // Vùng Đắk Nông (sáp nhập)
    "TP. Gia Nghĩa","Cư Jút","Đắk Glong","Đắk Mil","Đắk R'Lấp","Đắk Song","Krông Nô","Tuy Đức",
    // Vùng Bình Thuận (sáp nhập)
    "TP. Phan Thiết","La Gi","Bắc Bình","Đức Linh","Hàm Tân","Hàm Thuận Bắc","Hàm Thuận Nam","Phú Quí","Tánh Linh","Tuy Phong"
  ],

  // Đắk Lắk (giữ nguyên)
  "Đắk Lắk": [
    "TP. Buôn Ma Thuột","TX. Buôn Hồ","Buôn Đôn","Cư Kuin","Cư M'Gar","Ea H'Leo","Ea Kar","Ea Súp","Krông A Na","Krông Búk","Krông Năng","Krông Pắc","Lắk","M'Đrắk"
  ],

  // Đồng Nai (giữ + sáp nhập Bình Phước)
  "Đồng Nai": [
    "TP. Biên Hòa","Long Khánh","Cẩm Mỹ","Định Quán","Long Thành","Nhơn Trạch","Tân Phú","Thống Nhất","Trảng Bom","Vĩnh Cửu","Xuân Lộc",
    // Vùng Bình Phước (sáp nhập)
    "TX. Đồng Xoài","Bình Long","Phước Long","Bù Đăng","Bù Đốp","Bù Gia Mập","Chơn Thành","Đồng Phú","Hớn Quản","Lộc Ninh","Phú Riềng"
  ],

  // Tây Ninh (giữ + sáp nhập Long An)
  "Tây Ninh": [
    "TP. Tây Ninh","Bến Cầu","Châu Thành","Dương Minh Châu","Gò Dầu","Hòa Thành","Tân Biên","Tân Châu","Trảng Bàng",
    // Vùng Long An (sáp nhập)
    "TP. Tân An","Kiến Tường","Bến Lức","Cần Đước","Cần Giuộc","Châu Thành","Đức Hòa","Đức Huệ","Mộc Hóa","Tân Hưng","Tân Thạnh","Tân Trụ","Thạnh Hóa","Thủ Thừa","Vĩnh Hưng"
  ],

  // Vĩnh Long (giữ + sáp nhập Trà Vinh + Bến Tre)
  "Vĩnh Long": [
    "TP. Vĩnh Long","Bình Minh","Bình Tân","Long Hồ","Mang Thít","Tam Bình","Trà Ôn","Vũng Liêm",
    // Vùng Trà Vinh (sáp nhập)
    "TP. Trà Vinh","Càng Long","Cầu Kè","Cầu Ngang","Châu Thành","Duyên Hải","Tiểu Cần","Trà Cú",
    // Vùng Bến Tre (sáp nhập)
    "TP. Bến Tre","Ba Tri","Bình Đại","Châu Thành","Chợ Lách","Giồng Trôm","Mỏ Cày Bắc","Mỏ Cày Nam","Thạnh Phú"
  ],

  // Đồng Tháp (giữ + sáp nhập Tiền Giang)
  "Đồng Tháp": [
    "TP. Cao Lãnh","TX. Sa Đéc","TX. Hồng Ngự","Cao Lãnh","Châu Thành","Hồng Ngự","Lai Vung","Lấp Vò","Tam Nông","Tân Hồng","Thanh Bình","Tháp Mười",
    // Vùng Tiền Giang (sáp nhập)
    "TP. Mỹ Tho","Gò Công","Cai Lậy","Cái Bè","Châu Thành","Chợ Gạo","Gò Công Đông","Gò Công Tây","Tân Phú Đông","Tân Phước"
  ],

  // Cà Mau (giữ + sáp nhập Bạc Liêu + Sóc Trăng)
  "Cà Mau": [
    "TP. Cà Mau","Cái Nước","Đầm Dơi","Năm Căn","Ngọc Hiển","Phú Tân","Thới Bình","Trần Văn Thời","U Minh",
    // Vùng Bạc Liêu (sáp nhập)
    "TP. Bạc Liêu","Đông Hải","Giá Rai","Hòa Bình","Hồng Dân","Phước Long","Vĩnh Lợi",
    // Vùng Sóc Trăng (sáp nhập)
    "TP. Sóc Trăng","Ngã Năm","Vĩnh Châu","Châu Thành","Cù Lao Dung","Kế Sách","Long Phú","Mỹ Tú","Mỹ Xuyên","Thạnh Trị","Trần Đề"
  ],

  // An Giang (giữ + sáp nhập Kiên Giang + Hậu Giang + Cần Thơ đã tách riêng)
  "An Giang": [
    "TP. Long Xuyên","Châu Đốc","Tân Châu","An Phú","Châu Phú","Châu Thành","Chợ Mới","Phú Tân","Thoại Sơn","Tịnh Biên","Tri Tôn",
    // Vùng Kiên Giang (sáp nhập)
    "TP. Rạch Giá","Hà Tiên","Phú Quốc","An Biên","An Minh","Châu Thành","Giang Thành","Giồng Riềng","Gò Quao","Hòn Đất","Kiên Hải","Kiên Lương","Tân Hiệp","U Minh Thượng","Vĩnh Thuận",
    // Vùng Hậu Giang (sáp nhập)
    "TP. Vị Thanh","Long Mỹ","Ngã Bảy","Châu Thành A","Phụng Hiệp","Vị Thủy"
  ]
};
