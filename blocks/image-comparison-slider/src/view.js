
/**
 * Image Comparison Slider - Frontend Interaction
 *
 * Handles the draggable slider functionality for comparing before/after images.
 * Supports both mouse and touch events for desktop and mobile devices.
 */

document.addEventListener( 'DOMContentLoaded', function() {
	const sliders = document.querySelectorAll( '[data-comparison-slider="true"]' );

	sliders.forEach( function( slider ) {
		initializeSlider( slider );
	} );
} );

/**
 * Initialize a single comparison slider
 *
 * @param {HTMLElement} container The slider container element
 */
function initializeSlider( container ) {
	const wrapper = container.querySelector( '.image-comparison-wrapper' );
	const divider = container.querySelector( '.image-comparison-divider' );
	const beforeWrapper = container.querySelector( '.image-comparison-before-wrapper' );

	if ( ! wrapper || ! divider || ! beforeWrapper ) {
		return;
	}

	let isDragging = false;
	let startX = 0;
	let startLeft = 50;

	/**
	 * Start dragging
	 *
	 * @param {MouseEvent|TouchEvent} e Event object
	 */
	function startDrag( e ) {
		isDragging = true;
		startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
		startLeft = parseFloat( divider.style.left ) || 50;

		// Prevent text selection and default behaviors
		e.preventDefault();

		// Add grabbing cursor
		divider.style.cursor = 'grabbing';
		wrapper.style.cursor = 'grabbing';

		// Add event listeners for move and end
		if ( e.type === 'mousedown' ) {
			document.addEventListener( 'mousemove', drag );
			document.addEventListener( 'mouseup', stopDrag );
		} else {
			document.addEventListener( 'touchmove', drag, { passive: false } );
			document.addEventListener( 'touchend', stopDrag );
		}
	}

	/**
	 * Drag the divider
	 *
	 * @param {MouseEvent|TouchEvent} e Event object
	 */
	function drag( e ) {
		if ( ! isDragging ) {
			return;
		}

		const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
		const rect = wrapper.getBoundingClientRect();
		const deltaX = currentX - startX;
		const deltaPercent = ( deltaX / rect.width ) * 100;
		let newLeft = startLeft + deltaPercent;

		// Clamp between 0 and 100
		newLeft = Math.max( 0, Math.min( 100, newLeft ) );

		// Update divider position
		divider.style.left = newLeft + '%';

		// Update clip path for before image
		const clipPercent = 100 - newLeft;
		beforeWrapper.style.clipPath = `inset(0 ${clipPercent}% 0 0)`;

		// Prevent default to avoid scrolling on touch devices
		e.preventDefault();
	}

	/**
	 * Stop dragging
	 */
	function stopDrag() {
		isDragging = false;

		// Reset cursors
		divider.style.cursor = 'ew-resize';
		wrapper.style.cursor = 'default';

		// Remove event listeners
		document.removeEventListener( 'mousemove', drag );
		document.removeEventListener( 'mouseup', stopDrag );
		document.removeEventListener( 'touchmove', drag );
		document.removeEventListener( 'touchend', stopDrag );
	}

	/**
	 * Handle click/tap on the wrapper to move divider to that position
	 *
	 * @param {MouseEvent|TouchEvent} e Event object
	 */
	function handleWrapperClick( e ) {
		// Don't handle if clicking on the divider itself
		if ( e.target.closest( '.image-comparison-divider' ) ) {
			return;
		}

		const rect = wrapper.getBoundingClientRect();
		const clickX = e.type === 'click' ? e.clientX : e.touches[0].clientX;
		const offsetX = clickX - rect.left;
		const newLeft = ( offsetX / rect.width ) * 100;

		// Clamp between 0 and 100
		const clampedLeft = Math.max( 0, Math.min( 100, newLeft ) );

		// Animate the transition
		divider.style.transition = 'left 0.3s ease';
		beforeWrapper.style.transition = 'clip-path 0.3s ease';

		divider.style.left = clampedLeft + '%';
		const clipPercent = 100 - clampedLeft;
		beforeWrapper.style.clipPath = `inset(0 ${clipPercent}% 0 0)`;

		// Remove transition after animation completes
		setTimeout( function() {
			divider.style.transition = '';
			beforeWrapper.style.transition = '';
		}, 300 );
	}

	// Add mouse event listeners
	divider.addEventListener( 'mousedown', startDrag );

	// Add touch event listeners
	divider.addEventListener( 'touchstart', startDrag, { passive: false } );

	// Add click/tap on wrapper to move divider
	wrapper.addEventListener( 'click', handleWrapperClick );
	wrapper.addEventListener( 'touchstart', function( e ) {
		// Only handle single touch
		if ( e.touches.length === 1 && ! e.target.closest( '.image-comparison-divider' ) ) {
			handleWrapperClick( e );
		}
	}, { passive: false } );

	// Improve accessibility with keyboard support
	divider.setAttribute( 'tabindex', '0' );
	divider.setAttribute( 'role', 'slider' );
	divider.setAttribute( 'aria-label', 'Image comparison slider' );
	divider.setAttribute( 'aria-valuemin', '0' );
	divider.setAttribute( 'aria-valuemax', '100' );
	divider.setAttribute( 'aria-valuenow', '50' );

	divider.addEventListener( 'keydown', function( e ) {
		let currentLeft = parseFloat( divider.style.left ) || 50;
		let newLeft = currentLeft;

		// Arrow keys to move divider
		if ( e.key === 'ArrowLeft' ) {
			newLeft = Math.max( 0, currentLeft - 1 );
			e.preventDefault();
		} else if ( e.key === 'ArrowRight' ) {
			newLeft = Math.min( 100, currentLeft + 1 );
			e.preventDefault();
		} else if ( e.key === 'Home' ) {
			newLeft = 0;
			e.preventDefault();
		} else if ( e.key === 'End' ) {
			newLeft = 100;
			e.preventDefault();
		} else {
			return;
		}

		divider.style.left = newLeft + '%';
		const clipPercent = 100 - newLeft;
		beforeWrapper.style.clipPath = `inset(0 ${clipPercent}% 0 0)`;
		divider.setAttribute( 'aria-valuenow', Math.round( newLeft ) );
	} );
}
