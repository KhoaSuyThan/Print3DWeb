/**
 * RightChoiceVN - Core JavaScript Interactions
 * --------------------------------------------------
 * Handles all premium interactivity, custom calculator engine,
 * smooth navigation, responsive menus, dynamic multi-language (i18n) support,
 * and realistic toast simulations.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 0. Multi-language Translation Engine (i18n)
    // ==========================================================================
    const translations = {
        vi: {
            title: "RightChoiceVN | Nhà Sản Xuất Resin In 3D Nội Địa Cao Cấp",
            "nav.about": "Giới Thiệu",
            "nav.products": "Sản Phẩm",
            "nav.calculator": "Bộ Tính Toán",
            "nav.industries": "Ngành Phục Vụ",
            "nav.quote": "Nhận Báo Giá",
            "nav.slaBtn": "Yêu Cầu SLA",
            "nav.quoteBtn": "Nhận Báo Giá",
            "hero.tag": "Nhà sản xuất Resin In 3D nội địa hàng đầu",
            "hero.title": "Nhựa Nội Địa,<br><span class=\"gradient-text\">Tốc Độ Toàn Cầu</span>",
            "hero.desc": "Vật liệu nhựa in 3D photopolymer cao cấp tương thích hoàn hảo với Anycubic, Phrozen, Elegoo & các dòng máy LCD/SLA. Cam kết giao hàng siêu tốc trong vòng 2–5 ngày trên toàn quốc. Đầy đủ mã kiểm soát chất lượng (QC Batch Code) trên từng chai sản phẩm.",
            "hero.btnProducts": "Tìm Hiểu Sản Phẩm",
            "hero.btnCalculator": "Tính Toán In 3D",
            "hero.featDelivery": "Giao hàng 2-5 ngày",
            "hero.featQC": "QC Batch Code đầy đủ",
            "hero.featRD": "Phòng R&D nội địa",
            "about.title": "Về Chúng Tôi",
            "about.subtitle": "RightChoiceVN là nhà sản xuất nhựa in 3D đầu tiên tại Việt Nam chuyên về các vật liệu quang trùng hợp (photopolymer) hiệu năng cao.",
            "about.heading": "Tiên Phong Công Nghệ Hạt Nhựa 3D Nội Địa",
            "about.desc1": "Chúng tôi sở hữu phòng R&D đặt tại Khu Công nghệ cao TP.HCM, tập trung phát triển các giải pháp vật liệu quang học tiên tiến. Từng lô nhựa xuất xưởng đều được kiểm định bằng máy đo quang phổ và in mẫu thực tế để đảm bảo chất lượng đồng nhất.",
            "about.desc2": "Với ưu thế sản xuất nội địa trực tiếp, chúng tôi loại bỏ hoàn toàn các chi phí trung gian nhập khẩu, đem lại giá thành tối ưu nhất cùng dịch vụ giao hàng chỉ trong 2–5 ngày.",
            "about.pillar1Title": "Nghiên Cứu Nội Địa",
            "about.pillar1Desc": "Phát triển công thức tối ưu cho khí hậu nóng ẩm tại Việt Nam.",
            "about.pillar2Title": "Giao Hàng Siêu Tốc",
            "about.pillar2Desc": "Hàng luôn sẵn kho, giao toàn quốc từ 2–5 ngày làm việc.",
            "about.pillar3Title": "Kiểm Soát Từng Lô",
            "about.pillar3Desc": "Mã QC Batch Code trên từng sản phẩm, truy xuất nguồn gốc dễ dàng.",
            "about.pillar4Title": "Thân Thiện & An Toàn",
            "about.pillar4Desc": "Sử dụng monomers cao cấp ít mùi, thân thiện hơn với người dùng.",
            "products.title": "Dòng Nhựa In 3D RightChoiceVN",
            "products.subtitle": "Vật liệu photopolymer cao cấp, đa dạng đặc tính cơ lý phù hợp cho mọi nhu cầu từ giáo dục, kỹ thuật đến nha khoa thẩm mỹ chuyên sâu.",
            "products.badgeGeneral": "Dòng Phổ Thông",
            "products.badgePrecision": "Độ Chính Xác Cao",
            "products.badgeDurability": "Độ Bền Cao",
            "products.badgeSpecialized": "Chuyên Dụng",
            "products.badgeEngineering": "Dòng Kỹ Thuật",
            "products.badgeAesthetic": "Dòng Thẩm Mỹ",
            "products.descBasic": "Độ bền kéo tốt, độ co ngót cực thấp, dễ in và làm sạch. Dòng nhựa lý tưởng cho người mới bắt đầu, đào tạo STEM và in mẫu thử cơ bản.",
            "products.descArt": "Tái tạo hoàn hảo các chi tiết nhỏ nhất như nếp nhăn trang phục, thớ tóc. Bề mặt nhẵn mịn, độ chuẩn xác góc cạnh tối ưu.",
            "products.descFlexible": "Đàn hồi tốt, khả năng uốn dẻo và giảm chấn tuyệt vời. Phù hợp làm gioăng cao su, đệm giảm chấn và các chi tiết dẻo chức năng.",
            "products.descDental": "Độ cứng bề mặt cao, độ ổn định kích thước vượt trội theo thời gian. Chuyên dùng in máng hướng dẫn, mô hình cắm ghép nha khoa.",
            "products.descRigid": "Khả năng chịu va đập cực tốt, độ cứng cao tương đương nhựa kỹ thuật. Dễ dàng khoan, taro ren mà không nứt vỡ.",
            "products.descClear": "Trong suốt như thủy tinh — Kháng ố vàng vượt trội, lý tưởng cho mô hình quang học, trang sức và sa bàn tinh xảo.",
            "products.exposureLabel": "Thời gian phơi sáng",
            "products.hardnessLabel": "Độ Cứng",
            "products.precisionLabel": "Độ Chi Tiết",
            "products.shrinkageLabel": "Độ Co Ngót",
            "products.elasticityLabel": "Độ Đàn Hồi",
            "products.tensileLabel": "Độ Bền Kéo",
            "products.impactLabel": "Chịu Va Đập",
            "products.clarityLabel": "Độ Trong",
            "products.yellowingLabel": "Kháng Ố",
            "products.yellowingValExcel": "Cực Tốt",
            "products.yellowingValGood": "Tốt",
            "products.btnCalc": "Tính Toán In",
            "calc.title": "Hỗ Trợ Tính Toán Thông Số In 3D",
            "calc.subtitle": "Chọn loại nhựa, nhập thể tích in và ước lượng nhanh thông số kỹ thuật, cấu hình in chi tiết tức thời.",
            "calc.inputsTitle": "Nhập thông tin in ấn",
            "calc.resinLabel": "Chọn dòng nhựa sử dụng",
            "calc.optBasic": "Basic v.18 (Đa dụng / Dẻo dai)",
            "calc.optArt": "Art Resin (Chính xác cao / Sắc nét)",
            "calc.optFlexible": "Flexible Resin (Đàn hồi / Chống va đập)",
            "calc.optDental": "Dental Model (Chuyên dụng Nha khoa)",
            "calc.optRigid": "Rigid One (Cực cứng / Kỹ thuật cơ khí)",
            "calc.optClear": "Crystal Clear (Trong suốt / Kháng ố vàng)",
            "calc.volumeLabel": "Thể tích mẫu in (ml) hoặc Số lượng (Chai 1kg)",
            "calc.layerLabel": "Độ dày lớp in (Layer Height)",
            "calc.optL25": "25 microns (Cực kỳ mịn / In lâu)",
            "calc.optL50": "50 microns (Tiêu chuẩn / Đẹp)",
            "calc.optL100": "100 microns (In nhanh / Thô)",
            "calc.resultsTitle": "Kết quả dự báo in 3D",
            "calc.resExposureLabel": "Thời gian phơi sáng khuyến nghị",
            "calc.resWeightLabel": "Tổng khối lượng ước tính",
            "calc.resLayersLabel": "Số lớp in (Layers) ước tính",
            "calc.resStabilityLabel": "Độ ổn định kích thước dự báo",
            "calc.adviceHeader": "💡 Lời khuyên kỹ thuật từ RightChoiceVN:",
            "calc.btnContact": "Liên hệ báo giá loại nhựa này",
            "ind.title": "Giải Pháp Theo Từng Ngành Nghề",
            "ind.subtitle": "Chúng tôi tối ưu hóa các đặc tính vật lý của polyme để tạo ra dòng sản phẩm nhựa phục vụ riêng biệt cho nhu cầu khắt khe của từng lĩnh vực.",
            "ind.tabDental": "🦷 Nha khoa",
            "ind.tabEngineering": "⚙️ Kỹ thuật & Tạo mẫu",
            "ind.tabEducation": "🎓 Giáo dục & NCKH",
            "ind.tabArchitecture": "🏛️ Kiến trúc & Sa bàn",
            "ind.tabManufacturing": "🏭 Sản xuất & OEM",
            "ind.tabCreative": "🎨 Nghệ thuật & Cosplay",
            "ind.dentalTitle": "Phòng Lab Nha Khoa & Nha Sĩ Thẩm Mỹ",
            "ind.dentalDesc": "Ứng dụng nhựa in trong việc chế tạo các mẫu hàm thử nghiệm, máng hướng dẫn phẫu thuật cấy ghép implant, và khay chỉnh nha không mắc cài (clear aligners).",
            "ind.recommendedResins": "Nhựa khuyên dùng:",
            "ind.dentalH1": "Sai số kích thước dưới 50 microns.",
            "ind.dentalH2": "Kháng vỡ nứt khi lấy mẫu thermoforming.",
            "ind.dentalH3": "An toàn sinh học, không gây kích ứng.",
            "ind.engTitle": "Tạo Mẫu Thử Nghiệm Kỹ Thuật Chịu Lực",
            "ind.engDesc": "Các ứng dụng trong thiết kế cơ khí chế tạo, kiểm thử chức năng lắp ráp vật lý, làm đồ gá lắp ráp chuyên dụng và vỏ hộp thiết bị điện tử.",
            "ind.engH1": "Độ bền kéo và độ bền nén tối ưu.",
            "ind.engH2": "Khả năng gia công taro ren trực tiếp cực tốt.",
            "ind.engH3": "Chịu nhiệt độ liên tục lên tới 100°C.",
            "ind.eduTitle": "Giảng Dạy & Nghiên Cứu Tại Trường Học",
            "ind.eduDesc": "Giải pháp tối ưu ngân sách và đảm bảo an toàn tuyệt đối cho học sinh, sinh viên tại các phòng thí nghiệm STEM, trường đại học kỹ thuật và mỹ thuật công nghiệp.",
            "ind.eduH1": "Mức giá nội địa tiết kiệm ngân sách giáo dục.",
            "ind.eduH2": "Hương thơm dịu, giảm thiểu mùi khó chịu tối đa.",
            "ind.eduH3": "Dễ lau rửa và làm sạch bằng cồn y tế thông thường.",
            "ind.archTitle": "Thiết Kế Kiến Trúc & Sa Bàn Quy Hoạch",
            "ind.archDesc": "Chuyên dụng cho in các cấu trúc sa bàn thu nhỏ, mô hình nội thất tỉ lệ nhỏ đòi hỏi thể hiện đường thẳng, độ phẳng tuyệt đối và độ chuẩn không cong vênh.",
            "ind.archH1": "Không cong góc, đảm bảo ghép khối chuẩn 100%.",
            "ind.archH2": "Bề mặt mờ mịn dễ phủ sơn, trang trí ngoại thất.",
            "ind.archH3": "Khả năng tái hiện các chi tiết chỉ mỏng 0.2mm.",
            "ind.manTitle": "Sản Xuất Loạt Nhỏ & Gia Công OEM",
            "ind.manDesc": "Giải pháp thay thế khuôn đúc nhựa phun áp lực đắt đỏ bằng cách in trực tiếp các loạt nhỏ linh kiện, hoặc đúc sáp chế tác khuôn silicone chuyên nghiệp.",
            "ind.manH1": "Khả năng in liên tục 24/7 ổn định cao.",
            "ind.manH2": "Sẵn sàng cung cấp số lượng lớn ở quy mô công nghiệp.",
            "ind.manH3": "Dịch vụ gia công pha chế màu sắc theo yêu cầu riêng.",
            "ind.creTitle": "Nghệ Thuật, Cosplay & Mô Hình Sưu Tầm",
            "ind.creDesc": "Giải pháp cho các nghệ sĩ sáng tạo, làm nhân vật anime, figure siêu chi tiết, phụ kiện trang phục cosplay có khả năng chống rơi vỡ cực tốt.",
            "ind.creH1": "Tái hiện từng sợi tóc, biểu cảm nhỏ nhất trên mô hình.",
            "ind.creH2": "Kết hợp nhựa dẻo để làm các chi tiết mỏng, đàn hồi chống gãy.",
            "ind.creH3": "Dễ chà nhám gọt tỉa và có độ bám sơn phủ tuyệt vời.",
            "form.quoteTitle": "Nhận Báo Giá Siêu Tốc ⚡",
            "form.quoteDesc": "Hãy để lại thông tin của bạn, đội ngũ hỗ trợ kỹ thuật của chúng tôi sẽ gọi lại và gửi báo giá chi tiết trong vòng 10 phút làm việc.",
            "form.labelName": "Họ và tên của bạn",
            "form.placeholderName": "Nguyễn Văn A",
            "form.labelEmail": "Email liên hệ",
            "form.placeholderEmail": "viethan@gmail.com",
            "form.labelPhone": "Số điện thoại",
            "form.placeholderPhone": "0398 xxx xxx",
            "form.labelResin": "Loại nhựa bạn đang quan tâm",
            "form.optBasic": "Basic v.18 - Đa dụng",
            "form.optArt": "Art Resin - Siêu nét",
            "form.optFlexible": "Flexible Resin - Siêu dẻo",
            "form.optDental": "Dental Model - Nha khoa",
            "form.optRigid": "Rigid One - Siêu cứng",
            "form.optClear": "Crystal Clear - Trong suốt",
            "form.optMultiple": "Tôi muốn nhận báo giá tất cả các loại",
            "form.labelMsg": "Nhu cầu in ấn cụ thể hoặc câu hỏi kỹ thuật",
            "form.placeholderMsg": "Nhập yêu cầu của bạn tại đây...",
            "form.btnSubmitQuote": "Gửi Yêu Cầu Báo Giá",
            "form.distBadge": "Cơ Hội Hợp Tác",
            "form.distTitle": "Đăng Ký Làm Đại Lý Phân Phối 🤝",
            "form.distDesc": "RightChoiceVN cam kết chính sách chiết khấu đại lý tốt nhất, hỗ trợ kỹ thuật trực tiếp từ nhà máy và đảm bảo nguồn cung dồi dào, ổn định cao.",
            "form.labelCompany": "Tên Đơn vị / Công ty / Studio in",
            "form.placeholderCompany": "Công ty TNHH Giải pháp 3D Việt Nam",
            "form.labelContact": "Người liên hệ",
            "form.placeholderContact": "Trần Thị B",
            "form.labelZaloPhone": "Số điện thoại Zalo",
            "form.placeholderZaloPhone": "0905 xxx xxx",
            "form.labelCity": "Tỉnh / Thành phố hoạt động",
            "form.placeholderCity": "Hà Nội / TP. Hồ Chí Minh",
            "form.labelVolume": "Sản lượng tiêu thụ nhựa ước tính hàng tháng",
            "form.optSmall": "Dưới 10 kg/tháng",
            "form.optMedium": "Từ 10 - 50 kg/tháng",
            "form.optLarge": "Từ 50 - 200 kg/tháng",
            "form.optHuge": "Trên 200 kg/tháng (Đối tác lớn)",
            "form.btnSubmitDist": "Đăng Ký Đại Lý Phân Phối",
            "footer.desc": "Where Local Innovation Meets Global Standards. Tự hào là nhà sản xuất hạt nhựa quang học 3D polymer nghiên cứu và chế tạo tại Việt Nam.",
            "footer.titleQuickLinks": "Liên Kết Nhanh",
            "footer.titleContact": "Liên Hệ Trực Tiếp",
            "footer.address": "Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh, Việt Nam",
            "footer.deliverySla": "Cam kết Giao hàng 3D-Resin 2–5 Ngày Toàn Quốc",
            "footer.copyright": "&copy; 2026 RightChoiceVN. Tất cả quyền được bảo lưu. Sản xuất tại Việt Nam với công nghệ quốc tế.",
            
            // Toast & Dynamic Messages
            "toast.resinSelectedTitle": "Đã chọn nhựa!",
            "toast.resinSelectedMsg": "Đã cập nhật máy tính thông số cho dòng {name}.",
            "toast.quoteSuccessTitle": "Đăng ký báo giá thành công!",
            "toast.quoteSuccessMsg": "Xin chào {name}, RightChoiceVN đã tiếp nhận yêu cầu và sẽ liên hệ lại qua SĐT trong 10 phút.",
            "toast.distSuccessTitle": "Đã ghi nhận đăng ký Đại lý!",
            "toast.distSuccessMsg": "Hồ sơ của đại lý \"{company}\" đã được gửi tới Giám đốc phát triển kinh doanh.",
            "form.submittingQuote": "Đang xử lý yêu cầu...",
            "form.submittingDist": "Đang gửi thông tin đối tác...",
            "calc.layerUnits": " lớp",
            "calc.resExposureVal": "{val} s",
            "calc.resWeightVal": "{val} g"
        },
        en: {
            title: "RightChoiceVN | Premium Local 3D Printing Resin Manufacturer",
            "nav.about": "About Us",
            "nav.products": "Products",
            "nav.calculator": "Calculator",
            "nav.industries": "Industries",
            "nav.quote": "Get Quote",
            "nav.slaBtn": "Request SLA",
            "nav.quoteBtn": "Get Quote",
            "hero.tag": "Leading Domestic 3D Resin Manufacturer",
            "hero.title": "Local Resin,<br><span class=\"gradient-text\">Global Speed</span>",
            "hero.desc": "Premium 3D photopolymer resins perfectly compatible with Anycubic, Phrozen, Elegoo & LCD/SLA printers. Nationwide fast shipping within 2–5 days. Full quality control batch tracking (QC Batch Code) on every bottle.",
            "hero.btnProducts": "Explore Products",
            "hero.btnCalculator": "3D Print Calculator",
            "hero.featDelivery": "2-5 days shipping",
            "hero.featQC": "Full QC Batch Code",
            "hero.featRD": "Local R&D lab",
            "about.title": "About Us",
            "about.subtitle": "RightChoiceVN is the first 3D printing resin manufacturer in Vietnam specializing in high-performance photopolymers.",
            "about.heading": "Pioneering Domestic 3D Resin Technology",
            "about.desc1": "We operate a dedicated R&D facility in Saigon Hi-Tech Park, focusing on advanced optical formulations. Every batch is tested with spectrophotometers and validated through real print jobs to ensure absolute batch consistency.",
            "about.desc2": "As a direct domestic manufacturer, we eliminate import costs and distributor markups, offering competitive prices alongside 2–5 days nationwide shipping.",
            "about.pillar1Title": "Local R&D Lab",
            "about.pillar1Desc": "Formulations optimized specifically for Vietnam's hot and humid environment.",
            "about.pillar2Title": "Express Delivery",
            "about.pillar2Desc": "Always in stock, domestic dispatch reaching you in 2–5 business days.",
            "about.pillar3Title": "Batch-level Quality Control",
            "about.pillar3Desc": "QC Batch Code labeled on every bottle for complete quality traceability.",
            "about.pillar4Title": "User Friendly & Safe",
            "about.pillar4Desc": "Formulated with high-grade, low-odor monomers for a safer work space.",
            "products.title": "RightChoiceVN 3D Resin Series",
            "products.subtitle": "Premium photopolymer materials with diverse physical properties tailored for education, engineering, and professional dental labs.",
            "products.badgeGeneral": "General Purpose",
            "products.badgePrecision": "High Precision",
            "products.badgeDurability": "High Durability",
            "products.badgeSpecialized": "Specialized",
            "products.badgeEngineering": "Engineering Grade",
            "products.badgeAesthetic": "Aesthetic Grade",
            "products.descBasic": "Good tensile strength, ultra-low shrinkage, easy to print and clean. Ideal for beginners, STEM classrooms, and general prototyping.",
            "products.descArt": "Perfect reproduction of micro details like miniatures, texturing and hair. Smooth matte finish and outstanding edge precision.",
            "products.descFlexible": "High elongation at break, excellent flexibility and shock absorption. Perfect for gaskets, seals, and functional dampers.",
            "products.descDental": "High surface hardness, excellent dimensional stability over time. Specifically designed for dental study models and surgical guides.",
            "products.descRigid": "Outstanding impact resistance, high stiffness matching engineering plastics. Easy to drill, tap and machine without cracking.",
            "products.descClear": "Glass-like transparency - superior yellowing resistance, ideal for optical components, jewelry models, and architectural models.",
            "products.exposureLabel": "Exposure Time",
            "products.hardnessLabel": "Hardness",
            "products.precisionLabel": "Detail Resolution",
            "products.shrinkageLabel": "Shrinkage Rate",
            "products.elasticityLabel": "Elasticity",
            "products.tensileLabel": "Tensile Strength",
            "products.impactLabel": "Impact Resistance",
            "products.clarityLabel": "Clarity",
            "products.yellowingLabel": "Yellowing Resistance",
            "products.yellowingValExcel": "Excellent",
            "products.yellowingValGood": "Good",
            "products.btnCalc": "Calculate Print Settings",
            "calc.title": "3D Print Settings Calculator",
            "calc.subtitle": "Select a resin, enter model volume, and get instant recommendations for print configuration and estimates.",
            "calc.inputsTitle": "Input Parameters",
            "calc.resinLabel": "Select 3D Resin Type",
            "calc.optBasic": "Basic v.18 (General Purpose / Tough)",
            "calc.optArt": "Art Resin (High Precision / Sharp)",
            "calc.optFlexible": "Flexible Resin (Elastic / Impact Resistant)",
            "calc.optDental": "Dental Model (Dental Specialist)",
            "calc.optRigid": "Rigid One (Ultra Rigid / Engineering)",
            "calc.optClear": "Crystal Clear (Clear / Yellowing Resistant)",
            "calc.volumeLabel": "Model Volume (ml) or Weight (1kg bottle equivalent)",
            "calc.layerLabel": "Layer Thickness (Layer Height)",
            "calc.optL25": "25 microns (Ultra Fine / Long Print)",
            "calc.optL50": "50 microns (Standard / Balanced)",
            "calc.optL100": "100 microns (Fast Print / Draft)",
            "calc.resultsTitle": "Estimated 3D Printing Results",
            "calc.resExposureLabel": "Recommended Exposure Time",
            "calc.resWeightLabel": "Estimated Total Weight",
            "calc.resLayersLabel": "Estimated Number of Layers",
            "calc.resStabilityLabel": "Predicted Dimensional Stability",
            "calc.adviceHeader": "💡 Technical tips from RightChoiceVN:",
            "calc.btnContact": "Contact for pricing of this resin",
            "ind.title": "Solutions for Every Industry",
            "ind.subtitle": "We optimize polymer physical properties to create specialized resins meeting strict demands of various sectors.",
            "ind.tabDental": "🦷 Dental Labs",
            "ind.tabEngineering": "⚙️ Engineering",
            "ind.tabEducation": "🎓 STEM & Education",
            "ind.tabArchitecture": "🏛️ Architecture",
            "ind.tabManufacturing": "🏭 Manufacturing",
            "ind.tabCreative": "🎨 Creative & Cosplay",
            "ind.dentalTitle": "Dental Laboratories & Aesthetic Dentistry",
            "ind.dentalDesc": "Resin applications in fabrication of dental study models, surgical implant placement guides, and clear aligners.",
            "ind.recommendedResins": "Recommended resins:",
            "ind.dentalH1": "Dimensional deviation under 50 microns.",
            "ind.dentalH2": "High fracture resistance during thermoforming.",
            "ind.dentalH3": "Biocompatible and non-irritating.",
            "ind.engTitle": "Functional Mechanical Prototyping",
            "ind.engDesc": "Applications in mechanical design, physical assembly testing, assembly jigs, and electronics enclosures.",
            "ind.engH1": "Optimized tensile and compressive strength.",
            "ind.engH2": "Excellent direct thread-tapping capability.",
            "ind.engH3": "Withstands continuous temperatures up to 100°C.",
            "ind.eduTitle": "STEM Education & Academic Research",
            "ind.eduDesc": "Budget-friendly and safe solutions for students in STEM labs, engineering colleges, and industrial design academies.",
            "ind.eduH1": "Local manufacturer pricing saving education budgets.",
            "ind.eduH2": "Very low odor formulation for classroom comfort.",
            "ind.eduH3": "Easy washing and post-processing with regular medical alcohol.",
            "ind.archTitle": "Architectural Design & Urban Models",
            "ind.archDesc": "Designed for scale town planning models and micro-furniture requiring absolute flat planes and zero warping.",
            "ind.archH1": "No edge warping, ensuring perfect modular assembly.",
            "ind.archH2": "Matte finish ideal for post-painting and texturing.",
            "ind.archH3": "Captures fine wall and pillar details as thin as 0.2mm.",
            "ind.manTitle": "Low-Volume Production & OEM Supply",
            "ind.manDesc": "Cost-effective alternative to expensive injection molds by direct printing of small-batch parts or casting master patterns.",
            "ind.manH1": "High dimensional stability for continuous 24/7 print farm operations.",
            "ind.manH2": "Industrial scale production capabilities for large volume supply.",
            "ind.manH3": "Custom formulation and color matching services available.",
            "ind.creTitle": "Arts, Cosplay & Figure Collectibles",
            "ind.creDesc": "Solutions for creative artists, highly detailed anime figures, and tough cosplay accessories with drop resistance.",
            "ind.creH1": "Recreates fine hair strands and subtle facial expressions.",
            "ind.creH2": "Blendable with flexible resins to create thin, break-resistant details.",
            "ind.creH3": "Easy to sand, trim, and features excellent primer and paint adhesion.",
            "form.quoteTitle": "Get Instant Quote ⚡",
            "form.quoteDesc": "Leave your details, our technical team will call you back and send a detailed quotation within 10 business minutes.",
            "form.labelName": "Your Full Name",
            "form.placeholderName": "e.g., John Doe",
            "form.labelEmail": "Email Address",
            "form.placeholderEmail": "john.doe@example.com",
            "form.labelPhone": "Phone Number",
            "form.placeholderPhone": "e.g. +84 398 xxx xxx",
            "form.labelResin": "Resin you are interested in",
            "form.optBasic": "Basic v.18 - General Purpose",
            "form.optArt": "Art Resin - High Precision",
            "form.optFlexible": "Flexible Resin - High Elastic",
            "form.optDental": "Dental Model - Specialty",
            "form.optRigid": "Rigid One - Engineering",
            "form.optClear": "Crystal Clear - Transparent",
            "form.optMultiple": "I want a quote for all types",
            "form.labelMsg": "Specific printing requirements or technical questions",
            "form.placeholderMsg": "Describe your project or requirements here...",
            "form.btnSubmitQuote": "Submit Quote Request",
            "form.distBadge": "Partnership Opportunity",
            "form.distTitle": "Apply as Authorized Distributor 🤝",
            "form.distDesc": "RightChoiceVN guarantees industry-leading distribution margins, direct technical support from the factory, and stable supply.",
            "form.labelCompany": "Company / Studio Name",
            "form.placeholderCompany": "e.g., Vietnam 3D Solutions LLC",
            "form.labelContact": "Contact Person",
            "form.placeholderContact": "e.g., Sarah Jenkins",
            "form.labelZaloPhone": "Zalo Phone Number",
            "form.placeholderZaloPhone": "e.g., Zalo number",
            "form.labelCity": "Operating Province / City",
            "form.placeholderCity": "e.g., Hanoi / HCMC",
            "form.labelVolume": "Estimated Monthly Consumption",
            "form.optSmall": "Less than 10 kg/month",
            "form.optMedium": "10 to 50 kg/month",
            "form.optLarge": "50 to 200 kg/month",
            "form.optHuge": "Over 200 kg/month (Key Partner)",
            "form.btnSubmitDist": "Submit Distributor Application",
            "footer.desc": "Where Local Innovation Meets Global Standards. Proudly researching and manufacturing premium 3D optical resins in Vietnam.",
            "footer.titleQuickLinks": "Quick Links",
            "footer.titleContact": "Direct Contact",
            "footer.address": "Saigon Hi-Tech Park, Thu Duc City, Ho Chi Minh City, Vietnam",
            "footer.deliverySla": "Nationwide Delivery SLA within 2-5 Days Guaranteed",
            "footer.copyright": "&copy; 2026 RightChoiceVN. All rights reserved. Made in Vietnam with international technology.",
            
            // Toast & Dynamic Messages
            "toast.resinSelectedTitle": "Resin Selected!",
            "toast.resinSelectedMsg": "Updated settings calculator for {name} series.",
            "toast.quoteSuccessTitle": "Quote Request Submitted!",
            "toast.quoteSuccessMsg": "Hello {name}, RightChoiceVN has received your request and will contact you via phone in 10 minutes.",
            "toast.distSuccessTitle": "Application Received!",
            "toast.distSuccessMsg": "Distributor application for \"{company}\" has been forwarded to our Business Development Director.",
            "form.submittingQuote": "Processing request...",
            "form.submittingDist": "Submitting partner details...",
            "calc.layerUnits": " layers",
            "calc.resExposureVal": "{val} s",
            "calc.resWeightVal": "{val} g"
        }
    };

    let currentLang = localStorage.getItem('preferredLang') || 'vi';

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        
        // 1. Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });

        // 2. Update placeholders with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[currentLang][key]) {
                el.setAttribute('placeholder', translations[currentLang][key]);
            }
        });

        // 3. Update active states on language switch buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 4. Update document title
        document.title = translations[currentLang].title;

        // 5. Re-run calculator to update text languages
        runCalculator();
    }

    // Bind language selector buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });


    // ==========================================================================
    // 1. Sticky Header & Back To Top Button
    // ==========================================================================
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Sticky Header transition
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollPos > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Smooth scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ==========================================================================
    // 2. Mobile Menu (Hamburger Drawer)
    // ==========================================================================
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });


    // ==========================================================================
    // 3. Dynamic Section Highlighting (Active Nav Links)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px' // Trigger active state when section occupies main viewport
    });

    sections.forEach(section => activeNavObserver.observe(section));


    // ==========================================================================
    // 4. Scroll Fade-in Animations (Intersection Observer)
    // ==========================================================================
    const animatedElements = [
        '.section-header', 
        '.about-grid', 
        '.pillar-card', 
        '.product-card', 
        '.calculator-wrapper', 
        '.industries-tabs-wrapper', 
        '.form-card'
    ];

    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('fade-in');
        });
    });

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                animationObserver.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        animationObserver.observe(el);
    });


    // ==========================================================================
    // 5. Interactive Resin & Print Calculator Engine
    // ==========================================================================
    const resinDb = {
        basic: {
            name: 'Basic v.18',
            baseExposure: 2.8, // for 50 microns
            density: 1.1,      // g/ml
            stabilityVi: 'Khá Tốt (85%)',
            stabilityEn: 'Good (85%)',
            adviceVi: 'Dòng nhựa Basic v.18 có độ tương thích máy in cực rộng. Rất phù hợp cho các mô hình nghiên cứu đa dụng học tập, cấu trúc dày. Khuyến nghị thời gian phơi sáng lớp đáy (bottom exposure) là 25s - 35s cho 6 lớp đầu để bám bàn chắc chắn.',
            adviceEn: 'Basic v.18 resin has extremely wide printer compatibility. Ideal for general purpose learning, research, and thick models. Recommended bottom exposure is 25s - 35s for the first 6 layers to ensure bed adhesion.'
        },
        art: {
            name: 'Art Resin',
            baseExposure: 2.2,
            density: 1.15,
            stabilityVi: 'Tuyệt Vời (90%)',
            stabilityEn: 'Excellent (90%)',
            adviceVi: 'Art Resin chuyên dùng cho các chi tiết mỹ thuật đòi hỏi độ phân giải siêu nét (như nhân vật Anime, kiến trúc thu nhỏ). Khuyên dùng màn hình in Mono 4K/8K. Rửa sạch mô hình bằng cồn IPA 95% và phơi đèn UV bổ sung trong 3-5 phút để đạt độ cứng tối đa.',
            adviceEn: 'Art Resin is specialized for art parts requiring ultra-sharp details (like Anime figures, miniature architecture). Mono 4K/8K printer screens recommended. Wash model in 95% IPA and post-cure under UV light for 3-5 minutes to reach maximum hardness.'
        },
        flexible: {
            name: 'Flexible Resin',
            baseExposure: 3.2,
            density: 1.05,
            stabilityVi: 'Tốt & Đàn Hồi (80%)',
            stabilityEn: 'Good & Elastic (80%)',
            adviceVi: 'Flexible Resin tạo ra mô hình có độ dẻo đàn hồi cao. Chú ý: Hãy giảm tốc độ nhấc bàn in (Lift Speed) xuống khoảng 40-55 mm/min để tránh lực hút chân không làm rách màng FEP đáy khay chứa. Cần thiết kế lực chống support dày hơn thông thường.',
            adviceEn: 'Flexible Resin produces parts with high elasticity. Note: Reduce build plate lift speed to 40-55 mm/min to prevent vacuum forces from tearing FEP film. Thicker support tips than standard are recommended.'
        },
        dental: {
            name: 'Dental Model',
            baseExposure: 2.8,
            density: 1.1,
            stabilityVi: 'Cực Tốt & Chính Xác (95%)',
            stabilityEn: 'Excellent & Accurate (95%)',
            adviceVi: 'Dòng nhựa Nha khoa Dental Model yêu cầu độ sạch tối đa ở khay chứa (VAT) và màn hình in. Nên in ở nhiệt độ phòng ổn định từ 25-30°C để đảm bảo độ mịn bề mặt hoàn hảo và sai lệch kích thước nhỏ nhất. Thích hợp in máng chỉnh nha, hướng dẫn implant.',
            adviceEn: 'Dental Model resin requires maximum cleanliness in the vat and LCD screen. Keep room temperature stable at 25-30°C for perfect surface finish and minimal dimensional deviation. Ideal for ortho models and implant guides.'
        },
        rigid: {
            name: 'Rigid One',
            baseExposure: 2.8,
            density: 1.2,
            stabilityVi: 'Hoàn Hảo & Siêu Cứng (98%)',
            stabilityEn: 'Perfect & Ultra Rigid (98%)',
            adviceVi: 'Rigid One lý tưởng cho các chi tiết kết cấu kỹ thuật chịu lực nén ép hoặc ren xoắn ốc trực tiếp. Sau khi rửa sạch bằng cồn, bắt buộc phải sấy nhiệt nhẹ (50°C) kết hợp phơi UV trong vòng 10-15 phút để tăng tối đa liên kết ngang phân tử và độ bền cơ lý học.',
            adviceEn: 'Rigid One is ideal for engineering structural parts subject to compression or direct threading. After washing in alcohol, hot-curing at 50°C combined with 10-15 mins UV curing is mandatory to maximize cross-linking and mechanical properties.'
        },
        clear: {
            name: 'Crystal Clear',
            baseExposure: 2.6,
            density: 1.12,
            stabilityVi: 'Tuyệt Vời & Kháng Ố (92%)',
            stabilityEn: 'Excellent & Yellowing Resistant (92%)',
            adviceVi: 'Crystal Clear mang lại độ trong suốt vượt trội như thủy tinh. Chú ý: Tránh rửa trong cồn IPA quá lâu (quá 3 phút) để tránh bề mặt bị mờ sương trắng. Khuyên dùng cồn sạch 99% để rửa, sau đó phủ một lớp sơn Clear Coat Acrylic kháng UV mỏng để mẫu đạt độ trong quang học tối ưu nhất.',
            adviceEn: 'Crystal Clear delivers glass-like transparency. Warning: Avoid washing in IPA for over 3 minutes to prevent surface frosting. Recommend using fresh 99% alcohol, then applying a thin UV-resistant clear acrylic coating for optimal optical clarity.'
        }
    };

    const selectResin = document.getElementById('calc-resin');
    const inputVolume = document.getElementById('calc-volume');
    const rangeVolume = document.getElementById('calc-range');
    const selectLayerHeight = document.getElementById('calc-layer-height');

    // Outputs
    const resExposure = document.getElementById('res-exposure');
    const resWeight = document.getElementById('res-weight');
    const resLayers = document.getElementById('res-layers');
    const resStability = document.getElementById('res-stability');
    const resAdvice = document.getElementById('res-advice');

    function runCalculator() {
        const resinType = selectResin.value;
        const volumeVal = parseFloat(inputVolume.value) || 0;
        const layerHeightVal = parseFloat(selectLayerHeight.value);

        if (!resinDb[resinType]) return;

        const resin = resinDb[resinType];

        // 1. Calculate exposure based on layer height
        let exposureFactor = 1.0;
        if (layerHeightVal === 0.025) {
            exposureFactor = 0.8;
        } else if (layerHeightVal === 0.1) {
            exposureFactor = 1.5;
        }
        const recommendedExposure = (resin.baseExposure * exposureFactor).toFixed(1);

        // 2. Calculate weight
        const totalWeight = Math.round(volumeVal * resin.density);

        // 3. Estimated layers (simulate typical model height of 100mm)
        const modelHeightMm = 100;
        const estimatedLayers = Math.round(modelHeightMm / layerHeightVal);

        // Update UI
        const t = translations[currentLang] || translations.vi;
        
        resExposure.textContent = t["calc.resExposureVal"].replace('{val}', recommendedExposure);
        resWeight.textContent = t["calc.resWeightVal"].replace('{val}', totalWeight);
        resLayers.textContent = `${estimatedLayers.toLocaleString()}${t["calc.layerUnits"]}`;
        resStability.textContent = currentLang === 'vi' ? resin.stabilityVi : resin.stabilityEn;
        resAdvice.textContent = currentLang === 'vi' ? resin.adviceVi : resin.adviceEn;
    }

    // Connect slider range inputs
    if (inputVolume && rangeVolume) {
        inputVolume.addEventListener('input', () => {
            rangeVolume.value = inputVolume.value;
            runCalculator();
        });

        rangeVolume.addEventListener('input', () => {
            inputVolume.value = rangeVolume.value;
            runCalculator();
        });
    }

    if (selectResin) selectResin.addEventListener('change', runCalculator);
    if (selectLayerHeight) selectLayerHeight.addEventListener('change', runCalculator);


    // ==========================================================================
    // 6. Showcase Cards - Select Resin Shortcut
    // ==========================================================================
    document.querySelectorAll('.card-action-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const resinType = button.getAttribute('data-select');
            if (resinType && selectResin) {
                selectResin.value = resinType;
                
                // average volumes per application
                if (resinType === 'dental') {
                    inputVolume.value = 150;
                    rangeVolume.value = 150;
                } else if (resinType === 'rigid') {
                    inputVolume.value = 350;
                    rangeVolume.value = 350;
                } else {
                    inputVolume.value = 250;
                    rangeVolume.value = 250;
                }

                runCalculator();
                
                // Scroll to calculator smoothly
                const calculatorSection = document.getElementById('calculator');
                if (calculatorSection) {
                    calculatorSection.scrollIntoView({ behavior: 'smooth' });
                }

                // Alert the user via toast in selected language
                const t = translations[currentLang];
                const msg = t["toast.resinSelectedMsg"].replace('{name}', resinDb[resinType].name);
                showToast(t["toast.resinSelectedTitle"], msg, 'info');
            }
        });
    });


    // ==========================================================================
    // 7. Industries Tab Switcher
    // ==========================================================================
    const tabButtons = document.querySelectorAll('#industry-tabs .tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');

            // Deactivate all buttons & tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Activate current
            button.classList.add('active');
            const activePane = document.getElementById(targetTabId);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });


    // ==========================================================================
    // 8. Dynamic Toast Notification System
    // ==========================================================================
    const toastContainer = document.getElementById('toast-container');

    function showToast(title, message, type = 'success') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let icon = '✓';
        if (type === 'info') icon = 'ℹ️';
        if (type === 'error') icon = '⚠️';

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <span class="toast-title">${title}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Slide out after 3.7s
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-30px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3700);
    }


    // ==========================================================================
    // 9. Form Submission Simulations
    // ==========================================================================
    const quoteForm = document.getElementById('quote-form');
    const distributorForm = document.getElementById('distributor-form');

    // Quote Request Form
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const t = translations[currentLang];
            
            // Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = t["form.submittingQuote"];
            submitBtn.style.opacity = '0.75';

            setTimeout(() => {
                // Success state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';

                const name = document.getElementById('q-name').value;
                const successMsg = t["toast.quoteSuccessMsg"].replace('{name}', name);
                showToast(t["toast.quoteSuccessTitle"], successMsg, 'success');

                quoteForm.reset();
            }, 1200);
        });
    }

    // Distributor Registration Form
    if (distributorForm) {
        distributorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = distributorForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const t = translations[currentLang];

            // Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = t["form.submittingDist"];
            submitBtn.style.opacity = '0.75';

            setTimeout(() => {
                // Success state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';

                const company = document.getElementById('d-company').value;
                const successMsg = t["toast.distSuccessMsg"].replace('{company}', company);
                showToast(t["toast.distSuccessTitle"], successMsg, 'success');

                distributorForm.reset();
            }, 1500);
        });
    }

    // Initialize Language settings
    setLanguage(currentLang);

});
