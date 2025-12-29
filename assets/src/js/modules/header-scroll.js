/**
 * Add scroll class to header
 */
export default class HeaderScroll {
    constructor(selector = 'header') {
        this.header = document.querySelector(selector);
        this.init();
    }

    init() {
        if (!this.header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('is-scrolled');
            } else {
                this.header.classList.remove('is-scrolled');
            }
        });
    }
}
