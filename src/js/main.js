/*
 * to include js file write: `//= include ./path-to-file`
 */

'use strict'

// =========================
// LENIS (SMOOTH SCROLL)
// =========================
gsap.registerPlugin(Flip, SplitText, MorphSVGPlugin, ScrollTrigger);
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
// MENU (DESKTOP HOVER, BURGER
// =========================
const nav = document.querySelector(".header__nav");
const burger = document.querySelector(".burger");
const overlay = document.querySelector(".nav-overlay");
const activeBg = document.querySelector(".nav-active-bg");
const links = document.querySelectorAll(".menu__link");

let activeLink = document.querySelector(".menu__link.active");
links.forEach(link => {
    link.addEventListener("mouseenter", () => {
        if (window.innerWidth <= 1024) return;

        moveBlob(link);
    });
});

// =========================
// BLOB
// =========================
function moveBlob(target) {
    if (!target || window.innerWidth <= 1024) return;

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
// MENU CLICK SYSTEM
// =========================
nav.addEventListener("click", (e) => {
    const link = e.target.closest(".menu__link");
    if (!link) return;

    const item = link.closest(".menu__item");
    if (!item) return;


    const hasSubmenu = item.classList.contains("has-submenu");


    // =========================
    // MOBILE SUBMENU (ACCORDION)
    // =========================
    if (window.innerWidth <= 1024 && hasSubmenu) {
        e.preventDefault();

        // close others
        document.querySelectorAll(".menu__item.has-submenu").forEach(i => {
            if (i !== item) i.classList.remove("is-open");
        });

        item.classList.toggle("is-open");
        return;
    }

    // =========================
    // NORMAL LINK
    // =========================
    if (!hasSubmenu) {
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        activeLink = link;

        moveBlob(link);

        if (window.innerWidth <= 1024) {
            closeMenu();
        }
    }
});

// =========================
// BURGER
// =========================
burger.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
});

// =========================
// OPEN MENU
// =========================
function openMenu() {
    nav.classList.add("is-open");
    burger.classList.add("active");
    overlay?.classList.add("active");
    document.body.classList.add("menu-open");

    const spans = burger.querySelectorAll("span");

    gsap.to(spans[0], {rotate: 45, y: 8, duration: 0.3});
    gsap.to(spans[1], {opacity: 0, duration: 0.2});
    gsap.to(spans[2], {rotate: -45, y: -8, duration: 0.3});

    gsap.from(".menu__item", {
        x: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.3
    });
}

// =========================
// CLOSE MENU
// =========================
function closeMenu() {
    nav.classList.remove("is-open");
    burger.classList.remove("active");
    overlay?.classList.remove("active");
    document.body.classList.remove("menu-open");

    const spans = burger.querySelectorAll("span");

    gsap.to(spans, {
        rotate: 0,
        y: 0,
        opacity: 1,
        duration: 0.25
    });

    document.querySelectorAll(".menu__item.is-open").forEach(i => {
        i.classList.remove("is-open");
    });
}

// =========================
// OVERLAY
// =========================
overlay?.addEventListener("click", closeMenu);

// =========================
// ESC
// =========================
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
});

// =========================
// INIT BLOB
// =========================
window.addEventListener("load", () => {
    if (activeLink) moveBlob(activeLink);
    console.log("activeLink:", activeLink);
});

// =========================
// NAV LEAVE
// =========================
nav.addEventListener("mouseleave", () => {
    if (activeLink) moveBlob(activeLink);
    console.log("activeLink:", activeLink);
});

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
                gsap.to(textElement, {color: "#2A2A2A", duration: durationOut, ease: "power2.out", overwrite: "auto"});
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
document.querySelectorAll('.accordion__item').forEach((item) => {
    item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.accordion__item').forEach((item) => item.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// =========================
// TABS
// =========================
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
        gsap.set(element, { autoAlpha: 1 });
        gsap.set(split.lines, { yPercent: 110, opacity: 0.15 });

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
// function initHeroAnimation() {
//     // HERO ELEMENTS
//     const heroImage = document.querySelector(".section-banner__img");
//     const heroImageInner = document.querySelector(".section-banner__img img");
//     const header = document.querySelector(".header");
//
//     const revealElements = document.querySelectorAll('[data-reveal="lines"]');
//     const reveals = [];
//     revealElements.forEach((element) => {
//         const split = new SplitText(element, {
//             type: "lines",
//             linesClass: "reveal-line"
//         });
//
//         split.lines.forEach((line) => {
//             const wrapper = document.createElement("div");
//             wrapper.classList.add("reveal-mask");
//
//             line.parentNode.insertBefore(wrapper, line);
//             wrapper.appendChild(line);
//         });
//
//         // Сховане через CSS повертаємо у видимість перед стартом анімації ліній
//         gsap.set(element, {
//             autoAlpha: 1
//         });
//
//         // Початковий стан для самих рядків задаємо в JS перед анімацією
//         gsap.set(split.lines, {
//             yPercent: 110,
//             opacity: 0.15
//         });
//
//         reveals.push({
//             element,
//             lines: split.lines,
//             stagger: parseFloat(element.dataset.stagger) || 0.05,
//             duration: parseFloat(element.dataset.duration) || 1.2,
//             ease: element.dataset.ease || "expo.out"
//         });
//     });
//
//     const heroTL = gsap.timeline({
//         defaults: {
//             ease: "expo.out"
//         }
//     });
//
//     // Картинка розгортається (Залишено без змін)
//     heroTL.fromTo(heroImage,
//         { clipPath: "inset(50% 50% 50% 50% round 30px)" },
//         { clipPath: "inset(0% 0% 0% 0% round 30px)", duration: 1.8, ease: "expo.inOut" }
//     );
//     heroTL.fromTo(heroImageInner,
//         { scale: 1.25, opacity: 0.4 },
//         { scale: 1, opacity: 1, duration: 2.2 },
//         "<"
//     );
//
//     // MODIFIED: Змінено на .to(), оскільки початковий стан (y: -24, opacity: 0) вже задано в CSS
//     heroTL.to(header,
//         {
//             y: 0,
//             opacity: 1,
//             duration: 1.4
//         },
//         "-=1.5"
//     );
//
//     // MODIFIED: Змінено на .to(), оскільки початковий стан рядків задано через gsap.set вище
//     reveals.forEach((reveal) => {
//         heroTL.to(reveal.lines,
//             {
//                 yPercent: 0,
//                 opacity: 1,
//                 duration: reveal.duration,
//                 stagger: reveal.stagger,
//                 ease: reveal.ease
//             },
//             "-=1.4"
//         );
//     });
// }
function initHeroAnimation() {
    // HERO ELEMENTS
    const heroImage = document.querySelector(".section-banner__img");
    const heroImageInner = document.querySelector(".section-banner__img img");
    const header = document.querySelector(".header");

    const heroTL = gsap.timeline({
        defaults: { ease: "expo.out" }
    });

    // 1. Анімація картинок (Без змін)
    heroTL.fromTo(heroImage,
        { clipPath: "inset(50% 50% 50% 50% round 30px)" },
        { clipPath: "inset(0% 0% 0% 0% round 30px)", duration: 1.8, ease: "expo.inOut" }
    );
    heroTL.fromTo(heroImageInner,
        { scale: 1.25, opacity: 0.4 },
        { scale: 1, opacity: 1, duration: 2.2 },
        "<"
    );

    // 2. Поява хедера
    heroTL.to(header,
        { y: 0, opacity: 1, duration: 1.4 },
        "-=1.5"
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
//
//     const storySection = document.querySelector('[data-story]');
//
//     if (!storySection) return;
//
//     const pinWrap = storySection.querySelector('.story-pin-wrap');
//
//     const slides = gsap.utils.toArray('.story-slide');
//
//     const progressBar = storySection.querySelector(
//         '.story-progress__bar'
//     );
//
//     const currentEl = storySection.querySelector(
//         '.story-current'
//     );
//
//     const totalEl = storySection.querySelector(
//         '.story-total'
//     );
//
//     // =========================
//     // TOTAL
//     // =========================
//
//     totalEl.textContent = String(slides.length)
//         .padStart(2, '0');
//
//     if (currentEl) {
//         currentEl.textContent = "01";
//     }
//
//     // =========================
//     // SECTION HEIGHT & TIMINGS
//     // =========================
//     // Щоб анімація була ПОВІЛЬНІШОЮ, збільшуємо множник до 2.5
//     // Використовуємо висоту вікна, оскільки pinWrap зафіксується (pin: true)
//     const scrollDistance = window.innerHeight * slides.length * 2.5;
//
//     gsap.set(storySection, {
//         height: `${scrollDistance}px`
//     });
//
//     // =========================
//     // MASTER TL
//     // =========================
//
//     const masterTL = gsap.timeline();
//
//     // =========================
//     // SLIDES
//     // =========================
//
//     slides.forEach((slide, index) => {
//
//         const textElements = gsap.utils.toArray(slide.querySelectorAll('[data-story-text]'));
//
//         if (!textElements.length) return;
//
//         let allLines = [];
//         let allChars = [];
//
//         textElements.forEach(el => {
//             const split = new SplitText(el, {
//                 type: "lines,chars",
//                 linesClass: "story-line",
//                 charsClass: "story-char"
//             });
//             allLines.push(...split.lines);
//             allChars.push(...split.chars);
//         });
//
//         const lines = gsap.utils.toArray(allLines);
//         const chars = gsap.utils.toArray(allChars);
//
//         // =========================
//         // INITIAL STATE
//         // =========================
//
//         const isFirst = index === 0;
//
//         gsap.set(slide, {
//             autoAlpha: isFirst ? 1 : 0
//         });
//
//         gsap.set(lines, {
//             yPercent: isFirst ? 0 : 120
//         });
//
//         gsap.set(chars, {
//             opacity: 0.35
//         });
//
//         // =========================
//         // BLOCK TL
//         // =========================
//
//         const blockTL = gsap.timeline();
//
//         // =========================
//         // ACTIVE FRACTION
//         // =========================
//
//         blockTL.call(() => {
//             currentEl.textContent = String(index + 1)
//                 .padStart(2, '0');
//         });
//
//         // =========================
//         // LINES REVEAL
//         // =========================
//         if (!isFirst) {
//             blockTL.set(slides, {
//                 autoAlpha: 0
//             });
//
//             blockTL.set(slide, {
//                 autoAlpha: 1
//             });
//
//             blockTL.to(lines, {
//                 yPercent: 0,
//                 stagger: 0.14,
//                 duration: 1.8,
//                 ease: "power1.out"
//             });
//         }
//
//         // =========================
//         // LETTER ACTIVATION
//         // =========================
//
//         blockTL.to(chars, {
//             opacity: 1,
//             stagger: {
//                 each: 0.06,
//                 from: "start",
//                 ease: "power2.out"
//             },
//             duration: 3.4,
//             ease: "none"
//         });
//
//         // =========================
//         // HOLD
//         // =========================
//
//         blockTL.to({}, {
//             duration: 1.4
//         });
//
//         // =========================
//         // LINES OUT
//         // =========================
//
//         blockTL.to(lines, {
//             yPercent: -110,
//             opacity: 0,
//             stagger: 0.16,
//             duration: 1.6,
//             ease: "power1.out"
//         });
//
//         masterTL.add(blockTL);
//
//     });
//
//     // =========================
//     // SCROLLTRIGGER
//     // =========================
//
//     ScrollTrigger.create({
//
//         trigger: storySection,
//
//         start: "top top",
//
//         // MODIFIED: Точно вказуємо фініш скролу відповідно до висоти секції
//         end: "bottom bottom",
//
//         pin: pinWrap,
//
//         // MODIFIED: Додано pinSpacing: false, щоб ScrollTrigger НЕ створював білу діру знизу
//         pinSpacing: false,
//
//         scrub: 2.4,
//
//         animation: masterTL,
//
//         invalidateOnRefresh: true,
//
//         onUpdate: (self) => {
//
//             gsap.set(progressBar, {
//
//                 scaleX: self.progress,
//
//                 transformOrigin: "left center"
//
//             });
//
//         }
//
//     });
//
//     // Перераховуємо геометрію сторінки після створення тригера
//     ScrollTrigger.refresh();
// }

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

    let mm = gsap.matchMedia();

    // NEW: Тепер анімація SplitText повністю працює на Десктопах ТА Таблетах (від 768px і вище)
    mm.add("(min-width: 768px)", () => {

        // Збільшуємо коефіцієнт тривалості скролу до 2.8, щоб на планшетах скрол пальцем був дуже плавним
        const scrollDistance = window.innerHeight * slides.length * 2.8;

        gsap.set(stickyTrigger, {
            height: `${scrollDistance}px`
        });

        const masterTL = gsap.timeline();

        slides.forEach((slide, index) => {
            const textElements = gsap.utils.toArray(slide.querySelectorAll('[data-story-text]'));
            if (!textElements.length) return;

            let allLines = [];
            let allChars = [];

            textElements.forEach(el => {
                const split = new SplitText(el, {
                    type: "lines,chars",
                    linesClass: "story-line",
                    charsClass: "story-char"
                });
                allLines.push(...split.lines);
                allChars.push(...split.chars);
            });

            const lines = gsap.utils.toArray(allLines);
            const chars = gsap.utils.toArray(allChars);

            const isFirst = index === 0;
            const isLast = index === slides.length - 1;

            // Перший слайд видно одразу, текст має opacity 0.35, лінії на місці
            gsap.set(slide, {autoAlpha: isFirst ? 1 : 0});
            gsap.set(lines, {yPercent: isFirst ? 0 : 120});
            gsap.set(chars, {opacity: 0.3});

            const blockTL = gsap.timeline();

            blockTL.call(() => {
                currentEl.textContent = String(index + 1).padStart(2, '0');
            });

            // Пропускаємо заїзд рядків для першого слайду
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

            // Рівномірне проявлення літер при скролі
            blockTL.to(chars, {
                opacity: 1,
                stagger: {each: 0.06, from: "start", ease: "power2.out"},
                duration: 3.4,
                ease: "none"
            });

            // Пауза для фіксації тексту на екрані
            blockTL.to({}, {duration: 1.4});

            // Останній слайд НЕ ховаємо, він залишається видимим назавжди
            if (!isLast) {
                blockTL.to(lines, {
                    yPercent: -110,
                    opacity: 0,
                    stagger: 0.16,
                    duration: 1.6,
                    ease: "power1.out"
                });
            }

            // masterTL.add(blockTL);
            if (index === 0) {
                // Перший слайд додаємо без затримок
                masterTL.add(blockTL);
            } else {
                // Другий та наступні слайди почнуть з'являтися пізніше.
                // "+=0.8" додає штучну сліпу паузу (порожній скрол) між слайдами.
                masterTL.add(blockTL, "+=0.8");
            }
        });

        // Повністю синхронізуємо таймлайн зі скролом батьківського стікі-тригера
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

    // Вимикаємо анімацію ТІЛЬКИ на мобільних телефонах (менше 767px)
    mm.add("(max-width: 767px)", () => {
        gsap.set([stickyTrigger, storySection, slides], {clearProps: "all"});
        const allText = storySection.querySelectorAll('[data-story-text]');
        gsap.set(allText, {clearProps: "all"});
    });
}

// =========================
// SLIDER ADVANTAGE
// =========================
const advantagesSwiper = new Swiper('.advantages-swiper', {
    slidesPerView: 'auto',       // Дозволяємо карткам мати різну ширину з CSS
    centeredSlides: true,        // Активний слайд суворо по центру
    loop: true,                  // Безкінечний цикл для 4-х слайдов
    speed: 800,                  // Масляна швидкість переходу
    slideToClickedSlides: true,  // Клік на боковий слайд плавно центрує його

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

window.addEventListener("load", () => {
    initHeroAnimation();
    initPinnedStory();
    initScrollReveals();
    ScrollTrigger.refresh();
});

document.addEventListener('DOMContentLoaded', () => {
    initLiquidButtons();
});
