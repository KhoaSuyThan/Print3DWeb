/**
 * RightChoiceVN - Core JavaScript Interactions
 * --------------------------------------------------
 * Handles all premium interactivity, custom calculator engine,
 * smooth navigation, responsive menus, and realistic toast simulations.
 */

document.addEventListener('DOMContentLoaded', () => {

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
    // Add fade-in classes to dynamic elements first
    const animatedElements = [
        '.section-header', 
        '.about-intro', 
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
            stability: 'Khá Tốt (85%)',
            advice: 'Dòng nhựa Basic v.18 có độ tương thích máy in cực rộng. Rất phù hợp cho các mô hình nghiên cứu đa dụng học tập, cấu trúc dày. Khuyến nghị thời gian phơi sáng lớp đáy (bottom exposure) là 25s - 35s cho 6 lớp đầu để bám bàn chắc chắn.'
        },
        art: {
            name: 'Art Resin',
            baseExposure: 2.2,
            density: 1.15,
            stability: 'Tuyệt Vời (90%)',
            advice: 'Art Resin chuyên dùng cho các chi tiết mỹ thuật đòi hỏi độ phân giải siêu nét (như nhân vật Anime, kiến trúc thu nhỏ). Khuyên dùng màn hình in Mono 4K/8K. Rửa sạch mô hình bằng cồn IPA 95% và phơi đèn UV bổ sung trong 3-5 phút để đạt độ cứng tối đa.'
        },
        flexible: {
            name: 'Flexible Resin',
            baseExposure: 3.2,
            density: 1.05,
            stability: 'Tốt & Đàn Hồi (80%)',
            advice: 'Flexible Resin tạo ra mô hình có độ dẻo đàn hồi cao. Chú ý: Hãy giảm tốc độ nhấc bàn in (Lift Speed) xuống khoảng 40-55 mm/min để tránh lực hút chân không làm rách màng FEP đáy khay chứa. Cần thiết kế lực chống support dày hơn thông thường.'
        },
        dental: {
            name: 'Dental Model',
            baseExposure: 2.8,
            density: 1.1,
            stability: 'Cực Tốt & Chính Xác (95%)',
            advice: 'Dòng nhựa Nha khoa Dental Model yêu cầu độ sạch tối đa ở khay chứa (VAT) và màn hình in. Nên in ở nhiệt độ phòng ổn định từ 25-30°C để đảm bảo độ mịn bề mặt hoàn hảo và sai lệch kích thước nhỏ nhất. Thích hợp in máng chỉnh nha, hướng dẫn implant.'
        },
        rigid: {
            name: 'Rigid One',
            baseExposure: 2.8,
            density: 1.2,
            stability: 'Hoàn Hảo & Siêu Cứng (98%)',
            advice: 'Rigid One lý tưởng cho các chi tiết kết cấu kỹ thuật chịu lực nén ép hoặc ren xoắn ốc trực tiếp. Sau khi rửa sạch bằng cồn, bắt buộc phải sấy nhiệt nhẹ (50°C) kết hợp phơi UV trong vòng 10-15 phút để tăng tối đa liên kết ngang phân tử và độ bền cơ lý học.'
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
        // 25 microns (0.025) takes slightly less, 100 microns (0.1) takes significantly more
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
        // height in mm = 100
        const modelHeightMm = 100;
        const estimatedLayers = Math.round(modelHeightMm / layerHeightVal);

        // Update UI
        resExposure.textContent = `${recommendedExposure} s`;
        resWeight.textContent = `${totalWeight} g`;
        resLayers.textContent = `${estimatedLayers.toLocaleString()} lớp`;
        resStability.textContent = resin.stability;
        resAdvice.textContent = resin.advice;
    }

    // Connect slider range inputs
    inputVolume.addEventListener('input', () => {
        rangeVolume.value = inputVolume.value;
        runCalculator();
    });

    rangeVolume.addEventListener('input', () => {
        inputVolume.value = rangeVolume.value;
        runCalculator();
    });

    selectResin.addEventListener('change', runCalculator);
    selectLayerHeight.addEventListener('change', runCalculator);

    // Run once at start to populate values
    runCalculator();


    // ==========================================================================
    // 6. Showcase Cards - Select Resin Shortcut
    // ==========================================================================
    document.querySelectorAll('.card-action-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const resinType = button.getAttribute('data-select');
            if (resinType && selectResin) {
                selectResin.value = resinType;
                
                // If it is dental or rigid, let's also update input value slightly to represent a realistic average volume
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
                calculatorSection.scrollIntoView({ behavior: 'smooth' });

                // Alert the user via toast
                showToast(
                    'Đã chọn nhựa!', 
                    `Đã cập nhật máy tính thông số cho dòng ${resinDb[resinType].name}.`, 
                    'info'
                );
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
            
            // Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang xử lý yêu cầu...';
            submitBtn.style.opacity = '0.75';

            setTimeout(() => {
                // Success state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';

                const name = document.getElementById('q-name').value;
                showToast(
                    'Đăng ký báo giá thành công!', 
                    `Xin chào ${name}, RightChoiceVN đã tiếp nhận yêu cầu và sẽ liên hệ lại qua SĐT trong 10 phút.`, 
                    'success'
                );

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

            // Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang gửi thông tin đối tác...';
            submitBtn.style.opacity = '0.75';

            setTimeout(() => {
                // Success state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';

                const company = document.getElementById('d-company').value;
                showToast(
                    'Đã ghi nhận đăng ký Đại lý!', 
                    `Hồ sơ của đại lý "${company}" đã được gửi tới Giám đốc phát triển kinh doanh.`, 
                    'success'
                );

                distributorForm.reset();
            }, 1500);
        });
    }

});
