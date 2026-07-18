(() => {
    const initResponsiveNav = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');
        const dropdown = document.querySelector('.dropdown');
        const dropdownTrigger = dropdown?.querySelector(':scope > a');

        if (!menuToggle || !navLinks) return;

        const closeMenu = () => {
            navLinks.classList.remove('active');
            dropdown?.classList.remove('touch-open');
            const icon = menuToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-times', 'fa-bars');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active') ? 'true' : 'false');

        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            if (!isOpen) dropdown?.classList.remove('touch-open');
        });

        document.addEventListener('click', (event) => {
            if (window.innerWidth <= 850 && dropdownTrigger?.contains(event.target)) {
                event.preventDefault();
                event.stopPropagation();
                dropdown.classList.toggle('touch-open');
                return;
            }

            const selectedLink = event.target.closest('.nav-links a');
            if (selectedLink) {
                closeMenu();
            } else if (dropdown && !dropdown.contains(event.target)) {
                dropdown.classList.remove('touch-open');
            }
        }, true);

        window.addEventListener('resize', () => {
            if (window.innerWidth > 850) closeMenu();
        });
    };

    const initScrollToTop = () => {
        const scrollToTopButton = document.getElementById('scroll-to-top');

        if (!scrollToTopButton) return;

        const navLinks = document.getElementById('nav-links');
        const footer = document.querySelector('footer');
        let updateScheduled = false;

        const updateButton = () => {
            updateScheduled = false;

            const menuIsOpen = navLinks?.classList.contains('active') ?? false;
            const shouldShow = window.scrollY >= 350 && !menuIsOpen;
            const footerOverlap = footer
                ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top)
                : 0;

            scrollToTopButton.classList.toggle('is-visible', shouldShow);
            scrollToTopButton.setAttribute('aria-hidden', String(!shouldShow));
            scrollToTopButton.tabIndex = shouldShow ? 0 : -1;
            scrollToTopButton.style.setProperty(
                '--scroll-to-top-footer-offset',
                `${Math.round(footerOverlap)}px`
            );
        };

        const scheduleUpdate = () => {
            if (updateScheduled) return;

            updateScheduled = true;
            window.requestAnimationFrame(updateButton);
        };

        const scrollToPageTop = () => {
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: reducedMotion ? 'auto' : 'smooth'
            });
        };

        scrollToTopButton.addEventListener('click', scrollToPageTop);

        scrollToTopButton.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;

            event.preventDefault();
            scrollToPageTop();
        });

        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate, { passive: true });

        if (navLinks) {
            const menuObserver = new MutationObserver(scheduleUpdate);
            menuObserver.observe(navLinks, { attributes: true, attributeFilter: ['class'] });
        }

        updateButton();
    };

    const normalizeCleanUrl = () => {
        const indexSuffix = '/index.html';

        if (!window.location.pathname.endsWith(indexSuffix)) return;

        const cleanPath = window.location.pathname.slice(0, -'index.html'.length);
        window.location.replace(
            `${cleanPath}${window.location.search}${window.location.hash}`
        );
    };

    const init = () => {
        normalizeCleanUrl();
        initResponsiveNav();
        initScrollToTop();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
