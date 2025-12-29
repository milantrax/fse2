/**
 * Scroll animations using Intersection Observer
 */
export default class ScrollAnimations {
    constructor(selector = '.animate-on-scroll') {
        this.animatedElements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        if (!this.animatedElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
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

        this.animatedElements.forEach((element) => {
            observer.observe(element);
        });
    }
}
