/* ============================================================
   Da Yeon & Prannoy — interactions
   ============================================================ */

(function () {
    'use strict';

    /* ───── Countdown to the ceremony (24 Oct 2026, 15:00 KST) ───── */

    const WEDDING = new Date('2026-10-24T15:00:00+09:00').getTime();
    const countdown = document.getElementById('countdown');

    if (countdown) {
        const fields = {};
        countdown.querySelectorAll('[data-unit]').forEach(el => {
            fields[el.dataset.unit] = el;
        });

        const pad = n => String(n).padStart(2, '0');

        const tick = () => {
            const diff = WEDDING - Date.now();

            if (diff <= 0) {
                countdown.innerHTML = '<p class="count-done">Today is the day. See you there 💕</p>';
                clearInterval(timer);
                return;
            }

            const s = Math.floor(diff / 1000);
            fields.days.textContent = Math.floor(s / 86400);
            fields.hours.textContent = pad(Math.floor(s / 3600) % 24);
            fields.minutes.textContent = pad(Math.floor(s / 60) % 60);
            fields.seconds.textContent = pad(s % 60);
        };

        tick();
        const timer = setInterval(tick, 1000);
    }

    /* ───── Mobile nav ───── */

    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        const closeMenu = () => {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
        };

        navToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(open));
            navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });

        navMenu.addEventListener('click', e => {
            if (e.target.tagName === 'A') closeMenu();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    /* ───── Scroll progress + sticky shadow + back-to-top ───── */

    const progress = document.getElementById('scrollProgress');
    const topBtn = document.getElementById('goToTopBtn');
    let frame = null;

    const onScroll = () => {
        const y = window.scrollY || document.documentElement.scrollTop;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        if (progress) {
            progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
        }
        if (nav) {
            nav.classList.toggle('is-stuck', y > 8);
        }
        if (topBtn) {
            topBtn.classList.toggle('is-visible', y > 600);
        }
    };

    window.addEventListener('scroll', () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
            onScroll();
            frame = null;
        });
    }, { passive: true });

    onScroll();

    if (topBtn) {
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ───── Reveal sections on scroll ───── */

    const revealables = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealables.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

        revealables.forEach(el => observer.observe(el));
    } else {
        revealables.forEach(el => el.classList.add('is-visible'));
    }

    /* ───── Highlight the nav link for the section in view ───── */

    const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'is-current',
                        link.getAttribute('href') === '#' + entry.target.id
                    );
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(section => spy.observe(section));
    }

    /* ───── Restaurant area filter ───── */

    const filters = document.getElementById('foodFilters');
    const foodGrid = document.getElementById('foodGrid');

    if (filters && foodGrid) {
        const cards = Array.from(foodGrid.querySelectorAll('.food'));

        filters.addEventListener('click', e => {
            const button = e.target.closest('.filter');
            if (!button) return;

            filters.querySelectorAll('.filter').forEach(f => {
                f.classList.toggle('is-active', f === button);
            });

            const area = button.dataset.area;
            cards.forEach(card => {
                card.hidden = area !== 'all' && card.dataset.area !== area;
            });
        });
    }
})();
