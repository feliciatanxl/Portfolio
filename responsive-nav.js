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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResponsiveNav);
    } else {
        initResponsiveNav();
    }
})();
