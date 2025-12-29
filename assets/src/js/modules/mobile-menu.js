/**
 * Mobile menu toggle
 */
export default class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.wp-block-navigation__responsive-container-open');
        this.menuClose = document.querySelector('.wp-block-navigation__responsive-container-close');
        this.menuContainer = document.querySelector('.wp-block-navigation__responsive-container');
        this.init();
    }

    init() {
        if (this.menuToggle && this.menuContainer) {
            this.menuToggle.addEventListener('click', () => {
                this.menuContainer.classList.add('is-menu-open');
                document.body.style.overflow = 'hidden';
            });
        }

        if (this.menuClose && this.menuContainer) {
            this.menuClose.addEventListener('click', () => {
                this.menuContainer.classList.remove('is-menu-open');
                document.body.style.overflow = '';
            });
        }
    }
}
