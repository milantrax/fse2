/**
 * Smooth scroll for anchor links
 */
export default class SmoothScroll {
    constructor(selector = 'a[href^="#"]') {
        this.anchors = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        if (!this.anchors.length) return;

        this.anchors.forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

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
}
