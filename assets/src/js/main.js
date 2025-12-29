/**
 * Theme Main JavaScript
 */

import SmoothScroll from './modules/smooth-scroll';
import MobileMenu from './modules/mobile-menu';
import ScrollAnimations from './modules/scroll-animations';
import HeaderScroll from './modules/header-scroll';

class Main {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            new SmoothScroll();
            new MobileMenu();
            new ScrollAnimations();
            new HeaderScroll();
        });
    }
}

new Main();
