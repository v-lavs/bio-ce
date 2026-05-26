// Initialization module
import Splide from '@splidejs/splide';


export function init() {
    gsap.registerPlugin(Flip, SplitText, MorphSVGPlugin, ScrollTrigger);

// =========================
// LENIS (SMOOTH SCROLL)
// =========================
    window.lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        smoothTouch: true,
        touchMultiplier: 1.5
    });

    window.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        window.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

// =========================
// INITIALIZATION MENU
// =========================
    const nav = document.querySelector(".header__nav");
    const burger = document.querySelector(".burger");
    const activeBg = document.querySelector(".nav-active-bg");
    const links = document.querySelectorAll(".menu__link");

    const isMobileMQL = window.matchMedia("(max-width: 1080px)");
// ========================================================
// 0. АВТОМАТИЧНЕ ВИЗНАЧЕННЯ АКТИВНОЇ СТОРІНКИ ПРИ СТАРТІ
// ========================================================
    function initActiveMenuItem() {
        const currentPath = window.location.pathname;

        links.forEach(link => {
            const linkPath = link.getAttribute("href");

            // Перевіряємо, чи збігається шлях у браузері з href посилання
            // Додаткова перевірка на головну сторінку (корінь або index.html)
            if (currentPath === linkPath ||
                (currentPath === "/" && linkPath === "/index.html") ||
                (currentPath.includes(linkPath) && linkPath !== "/")) {

                // Знімаємо active з першого пункту та вішаємо на поточний
                links.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            }
        });
    }
// Запускаємо пошук активної сторінки відразу при завантаженні скрипта
    initActiveMenuItem();

    function toggleLenisScroll(disable) {
        if (window.lenis) {
            if (disable) {
                window.lenis.stop();
            } else {
                window.lenis.start();
            }
        } else {
            // Фолбек, якщо Lenis раптом не ініціалізований глобально
            document.body.classList.toggle("menu-open", disable);
        }
    }
    function closeMobileMenu() {
        if (!nav || !burger) return;
        nav.classList.remove("is-open");
        burger.classList.remove("active");
        toggleLenisScroll(false); // Вмикаємо скрол назад
        document.querySelectorAll(".menu__item.has-submenu").forEach(i => i.classList.remove("is-open"));
    }
// ========================================================
// 2. СИСТЕМА КЛІКІВ
// ========================================================
    if (burger && nav) {
        // Клік по бургеру
        burger.addEventListener("click", (e) => {
            e.stopPropagation();
            const isCurrentlyOpen = nav.classList.contains("is-open");
            if (isCurrentlyOpen) {
                // Якщо меню було відкрите — закриваємо його через нашу функцію,
                // яка обнулить і Lenis, і всі відкриті акордеони
                closeMobileMenu();
            } else {
                // Якщо меню закрите — відкриваємо його
                nav.classList.add("is-open");
                burger.classList.add("active");
                toggleLenisScroll(true);
            }
        });

        // Кліки всередині меню
        // nav.addEventListener("click", (e) => {
        //     // 1. ПЕРЕВІРКА: Клік по лінці ВСЕРЕДИНІ субменю
        //     const submenuLink = e.target.closest(".submenu a");
        //     if (submenuLink && isMobileMQL.matches) {
        //         // Клікнули по лінці в підменю — дозволяємо перехід і закриваємо все мобільне меню
        //         closeMobileMenu();
        //         return; // Виходимо, щоб код нижче не перехопив цей клік
        //     }
        //
        //     // Мобільне підменю: перевіряємо клік по лінку АБО по стрілочці поруч
        //     const isArrow = e.target.closest(".arrow");
        //     const link = e.target.closest(".menu__link");
        //
        //     if (!link && !isArrow) return;
        //
        //     const item = (link || isArrow).closest(".menu__item");
        //     if (!item) return;
        //
        //     const hasSubmenu = item.classList.contains("has-submenu");
        //
        //     // Мобільний акордеон (спрацьовує ТІЛЬКИ на батьківський лінк або стрілку)
        //     if (isMobileMQL.matches && hasSubmenu) {
        //         if (link) e.preventDefault(); // Блокуємо перехід лише для батьківського лінка-дропдауна
        //
        //         // Тогл поточного акордеону
        //         item.classList.toggle("is-open");
        //         return;
        //     }
        //
        //     // Клік по звичайному посиланню верхнього рівня (без сабменю)
        //     if (link && !hasSubmenu) {
        //         links.forEach(l => l.classList.remove("active"));
        //         link.classList.add("active");
        //
        //         // Якщо екран мобільний — закриваємо меню повністю
        //         if (isMobileMQL.matches) {
        //             closeMobileMenu();
        //         } else if (activeBg) {
        //             moveBlob(link); // Ваша функція для плаваючого фону
        //         }
        //     }
        // });
        nav.addEventListener("click", (e) => {
            // 1. ПЕРЕВІРКА: Клік по лінці ВСЕРЕДИНІ підменю (субменю)
            const submenuLink = e.target.closest(".submenu a");
            if (submenuLink && isMobileMQL.matches) {
                e.preventDefault(); // Блокуємо миттєвий перехід
                const targetUrl = submenuLink.getAttribute("href");

                closeMobileMenu(); // Запускаємо красиве закриття меню

                // Чекаємо 300 мілісекунд, поки меню закриється, і переходимо
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300);
                return;
            }

            const isArrow = e.target.closest(".arrow");
            const link = e.target.closest(".menu__link");

            if (!link && !isArrow) return;

            const item = (link || isArrow).closest(".menu__item");
            if (!item) return;

            const hasSubmenu = item.classList.contains("has-submenu");

            // ========================================================
            // 2. МОБІЛЬНИЙ АКОРДЕОН (СТРІЛОЧКА ТА ЛІНК З СУБМЕНЮ)
            // ========================================================
            if (isMobileMQL.matches && hasSubmenu) {
                if (isArrow) {
                    e.preventDefault();
                    e.stopPropagation();
                    item.classList.toggle("is-open");
                    return;
                }

                if (link && !isArrow) {
                    e.preventDefault(); // Блокуємо миттєвий перехід батьківського лінка
                    const targetUrl = link.getAttribute("href");

                    closeMobileMenu(); // Запускаємо анімацію закриття бургера

                    // Перехід після завершення анімації
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 300);
                    return;
                }
            }

            // ========================================================
            // 3. КЛІК ПО ЗВИЧАЙНОМУ ПОСИЛАННЮ ВЕРХНЬОГО РІВНЯ (БЕЗ СУБМЕНЮ)
            // ========================================================
            if (link && !hasSubmenu) {
                if (isMobileMQL.matches) {
                    e.preventDefault(); // Блокуємо для мобілки
                    const targetUrl = link.getAttribute("href");

                    links.forEach(l => l.classList.remove("active"));
                    link.classList.add("active");

                    closeMobileMenu(); // Закриваємо

                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 300);
                } else {
                    // На десктопі перехід залишається миттєвим за замовчуванням
                    links.forEach(l => l.classList.remove("active"));
                    link.classList.add("active");
                    if (activeBg) moveBlob(link);
                }
            }
        });



    }

// Глобальне закриття через ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeMobileMenu();
            }
        });

// ========================================================
// 3. ЛОГІКА ДЕСКТОПНОГО БЛОБА (GSAP ХОВЕРИ)
// ========================================================
    if (activeBg && nav && links.length > 0) {
        // Початкова позиція блобу при завантаженні (тільки для десктопа)
        const initialActive = document.querySelector(".menu__link.active");
        if (initialActive && !isMobileMQL.matches) {
            setTimeout(() => {
                moveBlob(initialActive);
            }, 50);
        }

        // Ховер події
        links.forEach(link => {
            link.addEventListener("mouseenter", () => {
                if (isMobileMQL.matches) return;
                moveBlob(link);
            });
        });

        // Повернення блобу на активний лінк
        nav.addEventListener("mouseleave", () => {
            if (isMobileMQL.matches) return;
            const currentActive = document.querySelector(".menu__link.active");
            if (currentActive) moveBlob(currentActive);
        });
    }

// Глобальна функція розрахунку координат для блоба
    function moveBlob(target) {
        if (!target || !activeBg || !nav || isMobileMQL.matches) return;

        const item = target.closest(".menu__item");
        if (!item) return;

        const navRect = nav.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        gsap.to(activeBg, {
            x: itemRect.left - navRect.left,
            width: itemRect.width,
            duration: 0.35,
            ease: "power2.out"
        });
    }

// =========================
// LIQUIDS BTNS
// =========================

    function initLiquidButtons() {
        document.querySelectorAll('.btn').forEach(btn => {
            const textPath = btn.querySelector('.text-path-main');
            const iconPath = btn.querySelector('.icon-path-main');
            const textElement = btn.querySelector('.btn__text');
            const arrowPath = btn.querySelector('.arrow-path');

            const textBlock = btn.querySelector('.btn__text-block');
            const iconWrapper = btn.querySelector('.btn__icon');

            if (!textPath || !iconPath) return;

            const textIndexPath = textPath.getAttribute('d');
            const iconIndexPath = iconPath.getAttribute('d');

            const durationIn = 0.45;
            const durationOut = 0.4;
            const smoothEase = "power2.out";

            gsap.set(iconWrapper, {scale: 1, transformOrigin: "center"});

            btn.addEventListener('mouseenter', () => {
                gsap.to(textPath, {
                    morphSVG: {shape: "#text-hover-target", map: "position", type: "linear"},
                    duration: durationIn,
                    ease: smoothEase,
                    overwrite: "auto"
                });

                gsap.to(iconPath, {
                    morphSVG: {shape: "#icon-hover-target", map: "position"},
                    duration: durationIn,
                    ease: smoothEase,
                    overwrite: "auto"
                });

                gsap.to(iconWrapper, {scale: 0.91, duration: durationIn, ease: smoothEase, overwrite: "auto"});

                gsap.to(textPath, {
                    attr: {"fill-opacity": 1},
                    duration: durationIn,
                    ease: smoothEase,
                    overwrite: "auto"
                });

                if (textElement) {
                    gsap.to(textElement, {color: "#FFFFFF", duration: durationIn, ease: smoothEase, overwrite: "auto"});
                }

                if (arrowPath) {
                    gsap.to(arrowPath, {x: 5, duration: durationIn, ease: smoothEase, overwrite: "auto"});
                }
            });

            btn.addEventListener('mouseleave', () => {
                // Повернення контурів у початковий стан
                gsap.to(textPath, {
                    morphSVG: {shape: textIndexPath, map: "position", type: "linear"},
                    duration: durationOut,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                gsap.to(iconPath, {
                    morphSVG: {shape: iconIndexPath, map: "position"},
                    duration: durationOut,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                gsap.to(iconWrapper, {scale: 1, duration: durationOut, ease: "power2.out", overwrite: "auto"});

                gsap.to(textPath, {
                    attr: {"fill-opacity": 0},
                    duration: durationOut,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                if (textElement) {
                    gsap.to(textElement, {
                        color: "#2A2A2A",
                        duration: durationOut,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }

                if (arrowPath) {
                    gsap.to(arrowPath, {x: 0, duration: durationOut, ease: "power2.out", overwrite: "auto"});
                }
            });
        });
    }

// =========================
// ACCORDION
// =========================
    function initAccordion() {
        document.querySelectorAll('.accordion__item').forEach((item) => {
            item.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                console.log(1111)
                // 1. Clear 'active' from all items using a different variable name ('el')
                document.querySelectorAll('.accordion__item').forEach((el) => el.classList.remove('active'));

                // 2. Safely toggle the clicked 'item'
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

// =========================
// TABS
// =========================
    function initTabs() {
        const tabs = document.querySelector('[data-tabs]');

        if (tabs) {
            const buttons = tabs.querySelectorAll('.tabs-nav__link');
            const contents = tabs.querySelectorAll('.tab-content');
            const indicator = tabs.querySelector('.tab-active-border');

            const moveIndicator = (button) => {
                indicator.style.width = `${button.offsetWidth}px`;
                indicator.style.transform = `translateX(${button.offsetLeft}px)`;
            };

            const activateTab = (button) => {
                const tabId = button.dataset.tab;

                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });

                contents.forEach(content => {
                    content.classList.remove('active');
                });

                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');

                document.getElementById(tabId).classList.add('active');
                moveIndicator(button);
            };

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    activateTab(button);
                });
            });

            const activeButton = tabs.querySelector('.tabs-nav__link.active');

            if (activeButton) {
                moveIndicator(activeButton);
            }

            window.addEventListener('resize', () => {
                const current = tabs.querySelector('.tabs-nav__link.active');

                if (current) {
                    moveIndicator(current);
                }
            });
        }
    }

    /**
     * Універсальна функція для створення анімації появи тексту по рядках
     * @param {HTMLElement|NodeList|Array|String} targets - Елементи з текстом (селектор або DOM-вузли)
     * @returns {gsap.core.Timeline} - Готовий таймлайн GSAP
     */
    function createRevealTimeline(targets) {
        const elements = gsap.utils.toArray(targets);
        const revealTL = gsap.timeline();

        elements.forEach((element) => {
            // Розбиваємо текст на лінії
            const split = new SplitText(element, {
                type: "lines",
                linesClass: "reveal-line"
            });

            // Створюємо маски для кожного рядка (захист від FOUC)
            split.lines.forEach((line) => {
                const wrapper = document.createElement("div");
                wrapper.classList.add("reveal-mask");
                line.parentNode.insertBefore(wrapper, line);
                wrapper.appendChild(line);
            });

            // Отримуємо параметри з data-атрибутів або ставимо дефолтні
            const stagger = parseFloat(element.dataset.stagger) || 0.05;
            const duration = parseFloat(element.dataset.duration) || 1.2;
            const ease = element.dataset.ease || "expo.out";

            // Робимо батьківський блок видимим, а самі рядки ховаємо вниз маски
            gsap.set(element, {autoAlpha: 1});
            gsap.set(split.lines, {yPercent: 110, opacity: 0.15});

            // Додаємо анімацію появи цих ліній у загальний таймлайн функції
            revealTL.to(split.lines, {
                yPercent: 0,
                opacity: 1,
                duration: duration,
                stagger: stagger,
                ease: ease
            }, 0); // 0 означає, що якщо елементів кілька, вони почнуть анімуватися одночасно
        });

        return revealTL;
    }

    function initScrollReveals() {
        // Знаходимо всі текстові блоки на сайті (крім першої секції Hero)
        const otherReveals = document.querySelectorAll('section:not(.section-banner) [data-reveal="lines"]');

        otherReveals.forEach((element) => {
            // Створюємо індивідуальний таймлайн для кожного текстового блоку
            const revealTL = createRevealTimeline(element);

            // Прив'язуємо його до ScrollTrigger, щоб він спрацьовував при доскролюванні
            ScrollTrigger.create({
                trigger: element,
                start: "top 85%", // Анімація почнеться, коли верх блоку перетне 85% висоти екрана
                animation: revealTL,
                toggleActions: "play none none none" // Програти один раз і не ховати назад
            });
        });
    }

// =========================
//SECTIONS ANIM GSAP
// =========================

    function initHeroAnimation() {
        // HERO ELEMENTS
        const heroImage = document.querySelector(".section-banner__img");
        const heroImageInner = document.querySelector(".section-banner__img img");
        const header = document.querySelector(".header");

        const heroTL = gsap.timeline({
            defaults: {ease: "expo.out"}
        });

        // 1. Анімація картинок (Без змін)
        heroTL.fromTo(heroImage,
            {clipPath: "inset(50% 50% 50% 50% round 30px)"},
            {clipPath: "inset(0% 0% 0% 0% round 30px)", duration: 1.8, ease: "expo.inOut"}
        );
        heroTL.fromTo(heroImageInner,
            {scale: 1.25, opacity: 0.4},
            {scale: 1, opacity: 1, duration: 2.2},
            "<"
        );

        // 2. Поява хедера
        heroTL.to(header,
            {y: 0, opacity: 1, duration: 1.4},
            "-=1.4"
        );

        // 3. ПЕРЕВИКОРИСТАННЯ: Отримуємо таймлайн ліній для Hero і додаємо його в основний
        const heroRevealElements = document.querySelectorAll('.section-banner [data-reveal="lines"]');
        if (heroRevealElements.length > 0) {
            const textRevealTL = createRevealTimeline(heroRevealElements);
            heroTL.add(textRevealTL, "-=1.4"); // Вставляємо з тим самим таймінгом 1:1
        }
    }

// =========================
// PINNED STORY
// =========================
    function initPinnedStory() {
        const stickyTrigger = document.querySelector('[data-story-trigger]');
        if (!stickyTrigger) return;

        const storySection = stickyTrigger.querySelector('[data-story]');
        const slides = gsap.utils.toArray('.story-slide');
        const progressBar = storySection.querySelector('.story-progress__bar');
        const currentEl = storySection.querySelector('.story-current');
        const totalEl = storySection.querySelector('.story-total');

        totalEl.textContent = String(slides.length).padStart(2, '0');
        if (currentEl) currentEl.textContent = "01";

        let masterTL;
        let ST;
        let allSplits = []; // Тут зберігатимемо спліти, щоб скидати їх при ресайзі

        function buildAnimation() {
            // 1. Повне очищення перед кожним перерахунком (ресайзом)
            if (ST) ST.kill();
            if (masterTL) masterTL.kill();
            allSplits.forEach(split => split.revert());
            allSplits = [];
            gsap.set([stickyTrigger, storySection, slides, '.story-line', '.story-char'], {clearProps: "all"});

            // 2. Розрахунок висоти (для мобільних робимо трохи менший скрол-фактор, щоб не затягувати)
            const isMobile = window.innerWidth < 768;
            const scrollFactor = isMobile ? 1.8 : 2.8;
            const scrollDistance = window.innerHeight * slides.length * scrollFactor;

            gsap.set(stickyTrigger, {height: `${scrollDistance}px`});

            masterTL = gsap.timeline();

            slides.forEach((slide, index) => {
                const textElements = gsap.utils.toArray(slide.querySelectorAll('[data-story-text]'));
                if (!textElements.length) return;

                // Створюємо новий SplitText
                const split = new SplitText(textElements, {
                    type: "lines,chars",
                    linesClass: "story-line",
                    charsClass: "story-char"
                });
                allSplits.push(split); // Запам'ятовуємо його

                const lines = gsap.utils.toArray(split.lines);
                const chars = gsap.utils.toArray(split.chars);

                const isFirst = index === 0;
                const isLast = index === slides.length - 1;

                // Стартові стани
                gsap.set(slide, {autoAlpha: isFirst ? 1 : 0});
                gsap.set(lines, {yPercent: isFirst ? 0 : 120});
                gsap.set(chars, {opacity: 0.3});

                const blockTL = gsap.timeline();

                blockTL.call(() => {
                    if (currentEl) currentEl.textContent = String(index + 1).padStart(2, '0');
                }, null, isFirst ? 0 : ">-50%");

                // Анімація появи слайду (пропускаємо для першого)
                if (!isFirst) {
                    blockTL.set(slides[index - 1], {autoAlpha: 0})
                        .set(slide, {autoAlpha: 1})
                        .to(lines, {
                            yPercent: 0,
                            stagger: 0.14,
                            duration: 1.8,
                            ease: "power1.out"
                        }, "-=0.2");
                }

                // Проявлення літер (однаково для всіх екранів)
                blockTL.to(chars, {
                    opacity: 1,
                    stagger: {each: 0.06, from: "start", ease: "power2.out"},
                    duration: 3.4,
                    ease: "none"
                });

                // Пауза
                blockTL.to({}, {duration: 1.4});

                // Анімація зникнення (крім останнього)
                if (!isLast) {
                    blockTL.to(lines, {
                        yPercent: -110,
                        opacity: 0,
                        stagger: 0.16,
                        duration: 1.6,
                        ease: "power1.out"
                    });
                }

                // Додаємо в головний таймлайн
                masterTL.add(blockTL, index === 0 ? 0 : "+=0.8");
            });

            // Створення ScrollTrigger з урахуванням тач-скрінів
            ST = ScrollTrigger.create({
                trigger: stickyTrigger,
                start: "top top",
                end: "bottom bottom",
                scrub: isMobile ? 1.5 : 2.4, // На мобільних менший scrub прибирає "желейність" при гортанні пальцем
                animation: masterTL,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    gsap.set(progressBar, {
                        scaleX: self.progress,
                        transformOrigin: "left center"
                    });
                }
            });
        }

        // Ініціалізація першого запуску
        buildAnimation();

        // Головний фікс для ресайзу: при кожному оновленні ScrollTrigger робимо реверт тексту
        ScrollTrigger.addEventListener("refreshInit", () => {
            allSplits.forEach(split => split.revert());
        });

        // Після того, як ScrollTrigger перерахував координати, будуємо анімацію на основі нових розмірів
        ScrollTrigger.addEventListener("refresh", () => {
            buildAnimation();
        });
    }

// =========================
// SLIDER ADVANTAGE
// =========================
    function initAdvantageSlider() {
        const track = document.getElementById('sliderTrack');
        const viewport = document.getElementById('sliderViewport');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressBar = document.getElementById('progressBar');

        const originalSlides = Array.from(track.querySelectorAll('.slider-advantages .slide'));
        const totalSteps = originalSlides.length;

        let isDesktop = window.matchMedia('(min-width: 1081px)').matches;
        if (totalSteps > 0 && isDesktop) {

            const firstSlideClone = originalSlides[0].cloneNode(true);
            track.querySelectorAll('.slide-clone').forEach(el => el.remove());
            firstSlideClone.classList.add('slide-clone');
            track.appendChild(firstSlideClone);
        }

        let slides = Array.from(track.querySelectorAll('.slider-advantages .slide'));
        let activeIndex = 1;

        const SIDE_WIDTH = 287;
        const ACTIVE_WIDTH = 547;
        const GAP = 43;

        function updateSlider(animate = true) {
            isDesktop = window.matchMedia('(min-width: 1081px)').matches;

            if (!slides[activeIndex]) return;
            const logicalIndex = parseInt(slides[activeIndex].getAttribute('data-index')) || 0;

            //PROGRESS BAR
            let progressPercent;
            if (isDesktop) {
                progressPercent = ((logicalIndex + 1) / totalSteps) * 100;
            } else {
                if (window.innerWidth >= 601 && window.innerWidth < 1081) {
                    const maxTabletIndex = totalSteps - 2;
                    const currentProgressIndex = Math.min(activeIndex, maxTabletIndex);
                    progressPercent = (currentProgressIndex / maxTabletIndex) * 100;
                } else {
                    progressPercent = ((activeIndex + 1) / totalSteps) * 100;
                }
            }

            gsap.to(progressBar, {
                width: `${progressPercent}%`,
                duration: animate ? 0.6 : 0,
                ease: "power2.out"
            });

            if (isDesktop) {
                // anim cards
                const currentViewportWidth = viewport.offsetWidth;
                let scaleFactor = currentViewportWidth / 1207;
                if (scaleFactor > 1) scaleFactor = 1;

                const DYNAMIC_SIDE_WIDTH = SIDE_WIDTH * scaleFactor;
                const DYNAMIC_ACTIVE_WIDTH = ACTIVE_WIDTH * scaleFactor;
                const DYNAMIC_GAP = GAP * scaleFactor;

                const DYNAMIC_SIDE_HEIGHT = 323 * scaleFactor;
                const DYNAMIC_ACTIVE_HEIGHT = 376 * scaleFactor;
                //anim cards
                slides.forEach((slide, index) => {
                    const desc = slide.querySelector('.slider-advantages .description-wrap');
                    const icon = slide.querySelector('.slider-advantages .icon');
                    const DYNAMIC_SIDE_ICON = 90 * scaleFactor;
                    const DYNAMIC_ACTIVE_ICON = 112 * scaleFactor;

                    if (index === activeIndex) {
                        slide.classList.add('active');
                        gsap.to(slide, {
                            width: DYNAMIC_ACTIVE_WIDTH,
                            height: DYNAMIC_ACTIVE_HEIGHT,
                            duration: animate ? 0.6 : 0,
                            ease: "power2.out"
                        });
                        if (icon) {
                            gsap.to(icon, {
                                width: DYNAMIC_ACTIVE_ICON,
                                height: DYNAMIC_ACTIVE_ICON,
                                duration: animate ? 0.6 : 0,
                                ease: "power2.out"
                            });
                        }
                        gsap.to(desc, {
                            height: "auto",
                            opacity: 1,
                            duration: animate ? 0.6 : 0,
                            delay: animate ? 0.5 : 0
                        });

                    } else {
                        slide.classList.remove('active');
                        gsap.to(slide, {
                            width: DYNAMIC_SIDE_WIDTH,
                            height: DYNAMIC_SIDE_HEIGHT,
                            duration: animate ? 0.6 : 0,
                            ease: "power2.out"
                        });
                        if (icon) {
                            gsap.to(icon, {
                                width: DYNAMIC_SIDE_ICON,
                                height: DYNAMIC_SIDE_ICON,
                                duration: animate ? 0.6 : 0,
                                ease: "power2.out"
                            });
                        }
                        if (desc) {
                            gsap.killTweensOf(desc);
                            gsap.to(desc, {height: 0, opacity: 0, duration: animate ? 0.3 : 0});
                        }
                    }
                });

                //center-slide
                let accumulatedLeft = 0;
                for (let i = 0; i < activeIndex; i++) {
                    accumulatedLeft += DYNAMIC_SIDE_WIDTH + DYNAMIC_GAP;
                }

                const activeSlideCenter = accumulatedLeft + (DYNAMIC_ACTIVE_WIDTH / 2);
                const containerCenter = currentViewportWidth / 2;
                const trackX = containerCenter - activeSlideCenter;

                gsap.to(track, {
                    x: trackX,
                    gap: `${DYNAMIC_GAP}px`,
                    duration: animate ? 0.6 : 0,
                    ease: "power2.out"
                });
            } else {
                //tab, mob
                const isTablet = window.innerWidth >= 601 && window.innerWidth < 1081;

                slides.forEach((slide, index) => {
                    slide.classList.remove('active');
                    const desc = slide.querySelector('.slider-advantages .description-wrap');
                    const isVisible = (index === activeIndex) || (isTablet && index === activeIndex + 1);

                    if (isVisible) {
                        gsap.to(desc, {
                            height: "auto",
                            opacity: 1,
                            duration: animate ? 0.5 : 0,
                            ease: "power2.out",
                            delay: animate ? 0.1 : 0
                        });
                    } else {
                        gsap.killTweensOf(desc);
                        gsap.to(desc, {
                            height: 0,
                            opacity: 0,
                            duration: animate ? 0.3 : 0,
                            ease: "power2.in"
                        });
                    }
                });

                const MOBILE_GAP = 20;
                const currentSlideWidth = slides[activeIndex].offsetWidth;
                const trackX = -(activeIndex * (currentSlideWidth + MOBILE_GAP));

                gsap.to(track, {
                    x: trackX,
                    duration: animate ? 0.8 : 0,
                    ease: "power2.out"
                });
            }
        }

        // touches, swipes
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let dragStartTrackX = 0;
        let isRealMove = false;

        function getX(e) {
            if (e.type.includes('mouse')) {
                return e.pageX;
            }
            const touch = e.touches[0] || e.changedTouches[0];
            return touch ? touch.pageX : 0;
        }

        const onDragStart = (e) => {
            if (e.type.includes('mouse') && e.button !== 0) return;
            isDragging = true;
            isRealMove = false;
            startX = getX(e);
            currentX = startX;
            dragStartTrackX = gsap.getProperty(track, "x");
        };

        const onDragMove = (e) => {
            if (!isDragging) return;
            currentX = getX(e);
            const diff = currentX - startX;

            if (Math.abs(diff) > 10) {
                isRealMove = true;

                if (e.cancelable) {
                    e.preventDefault();
                }

                gsap.set(track, {x: dragStartTrackX + diff});
            }
        };

        const onDragEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;

            currentX = getX(e);

            if (!isRealMove) return;

            const diff = currentX - startX;
            if (Math.abs(diff) > 40) {
                if (diff > 0 && activeIndex > 0) {
                    activeIndex--;
                } else if (diff < 0 && activeIndex < slides.length - 1) {
                    if (window.innerWidth >= 601 && window.innerWidth < 1081 && activeIndex >= slides.length - 2) {
                        // Стоп на таблеті
                    } else {
                        activeIndex++;
                    }
                }
            }
            updateSlider();
        };

        track.addEventListener('mousedown', onDragStart);
        track.addEventListener('mousemove', onDragMove);
        track.addEventListener('mouseup', onDragEnd);
        track.addEventListener('mouseleave', onDragEnd);

        track.addEventListener('touchstart', onDragStart, {passive: true});
        track.addEventListener('touchmove', onDragMove, {passive: false});
        track.addEventListener('touchend', onDragEnd);
        track.addEventListener('touchcancel', onDragEnd);
        nextBtn.addEventListener('click', () => {
            if (window.innerWidth >= 601 && window.innerWidth < 1081 && activeIndex >= slides.length - 2) return;
            if (activeIndex < slides.length - 1) {
                activeIndex++;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (activeIndex > 0) {
                activeIndex--;
                updateSlider();
            }
        });

        // click cards
        slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                if (isRealMove) return;

                if (index === activeIndex) return;

                if (window.innerWidth >= 1080) {
                    activeIndex = index;
                    updateSlider();
                }
            });
        });
        //resize
        window.addEventListener('resize', () => {
            const isDesktopNow = window.matchMedia('(min-width: 1081px)').matches;
            const hasClone = track.querySelector('.slide-clone');

            if (isDesktopNow) {
                if (!hasClone && totalSteps > 0) {
                    const firstSlideClone = originalSlides[0].cloneNode(true);
                    firstSlideClone.classList.add('slide-clone');
                    track.appendChild(firstSlideClone);
                    if (activeIndex === 0) activeIndex = 1;
                }
            } else {
                if (hasClone) {
                    hasClone.remove();
                }
                activeIndex = 0;
                const allCurrentSlides = track.querySelectorAll('.slider-advantages .slide');
                allCurrentSlides.forEach(slide => {
                    slide.classList.remove('active');
                    slide.style.width = '';
                    slide.style.height = '';

                    const icon = slide.querySelector('.slider-advantages .icon');
                    if (icon) {
                        icon.style.width = '';
                        icon.style.height = '';
                    }

                    const desc = slide.querySelector('.slider-advantages .description-wrap');
                    if (desc) {
                        desc.style.height = '';
                        desc.style.opacity = '';
                    }
                });
            }

            slides = Array.from(track.querySelectorAll('.slider-advantages .slide'));

            updateSlider(false);
        });

        updateSlider(false);
    }

// =========================
// SLIDER CATEGORY
// =========================
    function initCategorySlider() {
        const sliderCatEl = document.querySelector('.slider-category');
        if (!sliderCatEl) return;

        const totalSlides = sliderCatEl.querySelectorAll('.splide__slide').length;

        const sliderCategory = new Splide('.slider-category', {
            direction   : 'ttb',
            height      : '416px',
            fixedHeight : '46px',
            perPage     : 7,
            perMove     : 1,
            type        : 'slide',
            focus       : 0,
            trimSpace   : true,
            omitEnd     : true,
            pagination  : false,
            updateOnMove: true,
            arrows      : true,
            gap         : '6px',
            wheel       : true,
            releaseWheel: true,
            waitForTransition: true,
            classes: {
                arrows: 'splide__arrows custom__arrows',
                arrow : 'splide__arrow',
                prev  : 'splide__arrow--prev',
                next  : 'splide__arrow--next',
            },
        });

        sliderCategory.mount();

        const activeIndex = Array.from(sliderCatEl.querySelectorAll('.splide__slide'))
            .findIndex(slide => slide.classList.contains('is-selected-category'));

        if (activeIndex !== -1) {
            sliderCategory.go(activeIndex);
        }

        initSelectionLogic(sliderCatEl, sliderCategory);
    }

    function initSelectionLogic(container, splideInstance = null) {
        const links = container.querySelectorAll('.splide__slide a');

        links.forEach((link, index) => {
            link.addEventListener('click', function (e) {
                // e.preventDefault();

                const currentSlide = link.closest('.splide__slide');

                container.querySelector('.is-selected-category')?.classList.remove('is-selected-category');

                currentSlide.classList.add('is-selected-category');
            });
        });
    }


    initAccordion();
    initTabs();
    initLiquidButtons();
    initCategorySlider();

    window.addEventListener("load", () => {
        initHeroAnimation();
        initPinnedStory();
        initScrollReveals();
        initAdvantageSlider();

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });
}