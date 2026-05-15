/*
 * to include js file write: `//= include ./path-to-file`
 */

'use strict'
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(Flip, SplitText, MorphSVGPlugin, ScrollTrigger);

// =========================
// LENIS (SMOOTH SCROLL)
// =========================
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        smoothTouch: true,
        touchMultiplier: 1.5
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

// =========================
// INITIALIZATION
// =========================
    // ========================================================
    // 1. ІНІЦІАЛІЗАЦІЯ ЕЛЕМЕНТІВ МЕНЮ
    // ========================================================
    const nav = document.querySelector(".header__nav");
    const burger = document.querySelector(".burger");
    const activeBg = document.querySelector(".nav-active-bg");
    const links = document.querySelectorAll(".menu__link");

    // ========================================================
    // 2. СИСТЕМА КЛІКІВ (ПРАЦЮЄ НА ВСІХ ЕКРАНАХ БЕЗ GSAP)
    // ========================================================
    if (burger && nav) {
        // Клік по бургеру
        burger.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log(22222)

            nav.classList.toggle("is-open");
            burger.classList.toggle("active");
            document.body.classList.toggle("menu-open");
        });

        // Кліки всередині меню (Посилання та мобільні підменю)
        nav.addEventListener("click", (e) => {
            const link = e.target.closest(".menu__link");
            if (!link) return;

            const item = link.closest(".menu__item");
            if (!item) return;

            const hasSubmenu = item.classList.contains("has-submenu");

            // Мобільне підменю (Клік-Акордеон)
            if (window.innerWidth <= 1080 && hasSubmenu) {
                e.preventDefault();
                e.stopPropagation();

                document.querySelectorAll(".menu__item.has-submenu").forEach(i => {
                    if (i !== item) i.classList.remove("is-open");
                });

                item.classList.toggle("is-open");
                return;
            }

            // Клік по звичайному посиланню
            if (!hasSubmenu) {
                links.forEach(l => l.classList.remove("active"));
                link.classList.add("active");

                // Якщо екран мобільний — закриваємо меню
                if (window.innerWidth <= 1080) {
                    nav.classList.remove("is-open");
                    burger.classList.remove("active");
                    document.body.classList.remove("menu-open");
                    document.querySelectorAll(".menu__item.has-submenu").forEach(i => i.classList.remove("is-open"));
                } else if (activeBg) {
                    // Якщо десктоп — рухаємо блоб через GSAP
                    moveBlob(link);
                }
            }
        });
    }

    // Глобальне закриття через ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav && burger) {
            nav.classList.remove("is-open");
            burger.classList.remove("active");
            document.body.classList.remove("menu-open");
            document.querySelectorAll(".menu__item.has-submenu").forEach(i => i.classList.remove("is-open"));
        }
    });

    // ========================================================
    // 3. ЛОГІКА ДЕСКТОПНОГО БЛОБА (GSAP ХОВЕРИ)
    // ========================================================
    if (activeBg && nav && links.length > 0) {
        // Початкова позиція блобу при завантаженні (тільки для десктопа)
        const initialActive = document.querySelector(".menu__link.active");
        if (initialActive && window.innerWidth > 1080) {
            moveBlob(initialActive);
        }

        // Ховер події
        links.forEach(link => {
            link.addEventListener("mouseenter", () => {
                if (window.innerWidth <= 1080) return;
                moveBlob(link);
            });
        });

        // Повернення блобу на активний лінк, коли мишка йде з меню
        nav.addEventListener("mouseleave", () => {
            if (window.innerWidth <= 1080) return;
            const currentActive = document.querySelector(".menu__link.active");
            if (currentActive) moveBlob(currentActive);
        });
    }

    // Глобальна функція розрахунку координат для блоба
    function moveBlob(target) {
        if (!target || !activeBg || !nav || window.innerWidth <= 1080) return;

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

    // function initPinnedStory() {
    //     const stickyTrigger = document.querySelector('[data-story-trigger]');
    //     if (!stickyTrigger) return;
    //
    //     const storySection = stickyTrigger.querySelector('[data-story]');
    //     const slides = gsap.utils.toArray('.story-slide');
    //     const progressBar = storySection.querySelector('.story-progress__bar');
    //     const currentEl = storySection.querySelector('.story-current');
    //     const totalEl = storySection.querySelector('.story-total');
    //
    //     totalEl.textContent = String(slides.length).padStart(2, '0');
    //     if (currentEl) currentEl.textContent = "01";
    //
    //     let mm = gsap.matchMedia();
    //
    //     // NEW: Тепер анімація SplitText повністю працює на Десктопах ТА Таблетах (від 768px і вище)
    //     mm.add("(min-width: 768px)", () => {
    //
    //         // Збільшуємо коефіцієнт тривалості скролу до 2.8, щоб на планшетах скрол пальцем був дуже плавним
    //         const scrollDistance = window.innerHeight * slides.length * 2.8;
    //
    //         gsap.set(stickyTrigger, {
    //             height: `${scrollDistance}px`
    //         });
    //
    //         const masterTL = gsap.timeline();
    //
    //         slides.forEach((slide, index) => {
    //             const textElements = gsap.utils.toArray(slide.querySelectorAll('[data-story-text]'));
    //             if (!textElements.length) return;
    //
    //             let allLines = [];
    //             let allChars = [];
    //
    //             textElements.forEach(el => {
    //                 const split = new SplitText(el, {
    //                     type: "lines,chars",
    //                     linesClass: "story-line",
    //                     charsClass: "story-char"
    //                 });
    //                 allLines.push(...split.lines);
    //                 allChars.push(...split.chars);
    //             });
    //
    //             const lines = gsap.utils.toArray(allLines);
    //             const chars = gsap.utils.toArray(allChars);
    //
    //             const isFirst = index === 0;
    //             const isLast = index === slides.length - 1;
    //
    //             // Перший слайд видно одразу, текст має opacity 0.35, лінії на місці
    //             gsap.set(slide, {autoAlpha: isFirst ? 1 : 0});
    //             gsap.set(lines, {yPercent: isFirst ? 0 : 120});
    //             gsap.set(chars, {opacity: 0.3});
    //
    //             const blockTL = gsap.timeline();
    //
    //             blockTL.call(() => {
    //                 currentEl.textContent = String(index + 1).padStart(2, '0');
    //             });
    //
    //             // Пропускаємо заїзд рядків для першого слайду
    //             if (!isFirst) {
    //                 blockTL.set(slides, {autoAlpha: 0});
    //                 blockTL.set(slide, {autoAlpha: 1});
    //                 blockTL.to(lines, {
    //                     yPercent: 0,
    //                     stagger: 0.14,
    //                     duration: 1.8,
    //                     ease: "power1.out"
    //                 });
    //             }
    //
    //             // Рівномірне проявлення літер при скролі
    //             blockTL.to(chars, {
    //                 opacity: 1,
    //                 stagger: {each: 0.06, from: "start", ease: "power2.out"},
    //                 duration: 3.4,
    //                 ease: "none"
    //             });
    //
    //             // Пауза для фіксації тексту на екрані
    //             blockTL.to({}, {duration: 1.4});
    //
    //             // Останній слайд НЕ ховаємо, він залишається видимим назавжди
    //             if (!isLast) {
    //                 blockTL.to(lines, {
    //                     yPercent: -110,
    //                     opacity: 0,
    //                     stagger: 0.16,
    //                     duration: 1.6,
    //                     ease: "power1.out"
    //                 });
    //             }
    //
    //             // masterTL.add(blockTL);
    //             if (index === 0) {
    //                 // Перший слайд додаємо без затримок
    //                 masterTL.add(blockTL);
    //             } else {
    //                 // Другий та наступні слайди почнуть з'являтися пізніше.
    //                 // "+=0.8" додає штучну сліпу паузу (порожній скрол) між слайдами.
    //                 masterTL.add(blockTL, "+=0.8");
    //             }
    //         });
    //
    //         // Повністю синхронізуємо таймлайн зі скролом батьківського стікі-тригера
    //         ScrollTrigger.create({
    //             trigger: stickyTrigger,
    //             start: "top top",
    //             end: "bottom bottom",
    //             scrub: 2.4,
    //             animation: masterTL,
    //             invalidateOnRefresh: true,
    //             onUpdate: (self) => {
    //                 gsap.set(progressBar, {
    //                     scaleX: self.progress,
    //                     transformOrigin: "left center"
    //                 });
    //             }
    //         });
    //
    //     });
    //
    //     // Вимикаємо анімацію ТІЛЬКИ на мобільних телефонах (менше 767px)
    //     mm.add("(max-width: 767px)", () => {
    //         gsap.set([stickyTrigger, storySection, slides], {clearProps: "all"});
    //         const allText = storySection.querySelectorAll('[data-story-text]');
    //         gsap.set(allText, {clearProps: "all"});
    //     });
    // }
    function initPinnedStory() {
        const stickyTrigger = document.querySelector('[data-story-trigger]');
        if (!stickyTrigger) return;

        const storySection = stickyTrigger.querySelector('[data-story]');
        const slides = gsap.utils.toArray('.story-slide');
        const progressBar = storySection.querySelector('.story-progress__bar');
        const currentEl = storySection.querySelector('.story-current');
        const totalEl = storySection.querySelector('.story-total');

        // 1. Спліт тексту робимо ОДРАЗУ для всіх екранів, щоб класи .story-line та .story-char з'явилися в DOM
        const allTextElements = gsap.utils.toArray(storySection.querySelectorAll('[data-story-text]'));
        const allSplits = allTextElements.map(el => {
            return new SplitText(el, {
                type: "lines,chars",
                linesClass: "story-line",
                charsClass: "story-char"
            });
        });

        totalEl.textContent = String(slides.length).padStart(2, '0');
        if (currentEl) currentEl.textContent = "01";

        let mm = gsap.matchMedia();

        // ДЕСКТОП ТА ПЛАНШЕТ (Зберігаємо вашу логіку без змін)
        mm.add("(min-width: 768px)", () => {
            const scrollDistance = window.innerHeight * slides.length * 2.8;

            gsap.set(stickyTrigger, { height: `${scrollDistance}px` });

            const masterTL = gsap.timeline();

            slides.forEach((slide, index) => {
                const slideText = gsap.utils.toArray(slide.querySelectorAll('[data-story-text]'));
                if (!slideText.length) return;

                // Збираємо лінії та літери поточного слайда, які вже були розбиті вище
                let lines = [];
                let chars = [];
                slideText.forEach(el => {
                    const foundSplit = allSplits.find(s => s.elements[0] === el);
                    if (foundSplit) {
                        lines.push(...foundSplit.lines);
                        chars.push(...foundSplit.chars);
                    }
                });

                const isFirst = index === 0;
                const isLast = index === slides.length - 1;

                gsap.set(slide, {autoAlpha: isFirst ? 1 : 0});
                gsap.set(lines, {yPercent: isFirst ? 0 : 120});
                gsap.set(chars, {opacity: 0.3});

                const blockTL = gsap.timeline();

                blockTL.call(() => {
                    currentEl.textContent = String(index + 1).padStart(2, '0');
                });

                if (!isFirst) {
                    blockTL.set(slides, {autoAlpha: 0});
                    blockTL.set(slide, {autoAlpha: 1});
                    blockTL.to(lines, {
                        yPercent: 0,
                        stagger: 0.14,
                        duration: 1.8,
                        ease: "power1.out"
                    });
                }

                blockTL.to(chars, {
                    opacity: 1,
                    stagger: {each: 0.06, from: "start", ease: "power2.out"},
                    duration: 3.4,
                    ease: "none"
                });

                blockTL.to({}, {duration: 1.4});

                if (!isLast) {
                    blockTL.to(lines, {
                        yPercent: -110,
                        opacity: 0,
                        stagger: 0.16,
                        duration: 1.6,
                        ease: "power1.out"
                    });
                }

                if (index === 0) {
                    masterTL.add(blockTL);
                } else {
                    masterTL.add(blockTL, "+=0.8");
                }
            });

            ScrollTrigger.create({
                trigger: stickyTrigger,
                start: "top top",
                end: "bottom bottom",
                scrub: 2.4,
                animation: masterTL,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    gsap.set(progressBar, {
                        scaleX: self.progress,
                        transformOrigin: "left center"
                    });
                }
            });
        });

        // МОБІЛЬНІ ПРИСТРОЇ (Нова логіка плавного ревеалу при звичайному скролі)
        mm.add("(max-width: 767px)", () => {
            // Очищаємо десктопні інлайнові стилі, які заважають мобільній верстці
            gsap.set([stickyTrigger, storySection, slides], {clearProps: "all"});

            slides.forEach((slide) => {
                const slideText = gsap.utils.toArray(slide.querySelectorAll('[data-story-text]'));
                if (!slideText.length) return;

                let lines = [];
                slideText.forEach(el => {
                    const foundSplit = allSplits.find(s => s.elements[0] === el);
                    if (foundSplit) lines.push(...foundSplit.lines);
                });

                // Початковий стан для мобільного ревеалу: ховаємо лінії з невеликим зсувом вниз
                gsap.set(lines, { yPercent: 50, opacity: 0 });

                // Створюємо окремий ScrollTrigger для кожного мобільного слайда
                gsap.to(lines, {
                    yPercent: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: slide,
                        start: "top 85%", // Анімація починається, коли слайд перетинає 85% висоти екрану
                        toggleActions: "play none none none", // Програється один раз при скролі вниз
                        invalidateOnRefresh: true
                    }
                });
            });

            // Очищення при виході з мобільного брейкпоінту
            return () => {
                allSplits.forEach(split => split.revert());
            };
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

    initAccordion();
    initTabs();
    initLiquidButtons();


    window.addEventListener("load", () => {
        initHeroAnimation();
        initPinnedStory();
        initScrollReveals();
        initAdvantageSlider();

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });
});



//# sourceMappingURL=main.js.map
