/**
 * Theme Main JavaScript
 */

(function () {
    'use strict';

    /**
     * Initialize theme functionality on DOM ready
     */
    document.addEventListener('DOMContentLoaded', function () {
        initSmoothScroll();
        initMobileMenu();
        initScrollAnimations();
    });

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        const anchors = document.querySelectorAll('a[href^="#"]');

        anchors.forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            });
        });
    }

    /**
     * Mobile menu toggle
     */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.wp-block-navigation__responsive-container-open');
        const menuClose = document.querySelector('.wp-block-navigation__responsive-container-close');
        const menuContainer = document.querySelector('.wp-block-navigation__responsive-container');

        if (menuToggle && menuContainer) {
            menuToggle.addEventListener('click', function () {
                menuContainer.classList.add('is-menu-open');
                document.body.style.overflow = 'hidden';
            });
        }

        if (menuClose && menuContainer) {
            menuClose.addEventListener('click', function () {
                menuContainer.classList.remove('is-menu-open');
                document.body.style.overflow = '';
            });
        }
    }

    /**
     * Scroll animations using Intersection Observer
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if (!animatedElements.length) return;

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        animatedElements.forEach(function (element) {
            observer.observe(element);
        });
    }

    /**
     * Add scroll class to header
     */
    function handleHeaderScroll() {
        const header = document.querySelector('header');

        if (!header) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }
})();
