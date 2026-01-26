/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props Block properties.
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const { beforeImageUrl, beforeImageAlt, afterImageUrl, afterImageAlt, beforeLabel, afterLabel, customHeight, heightUnit } = attributes;

	if ( ! beforeImageUrl || ! afterImageUrl ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: 'wp-block-telex-image-comparison-slider',
	} );

	// Calculate inline styles for custom height
	const wrapperStyle = {};
	if ( customHeight ) {
		wrapperStyle.height = `${customHeight}${heightUnit}`;
	}

	const imageStyle = customHeight ? { height: '100%', objectFit: 'cover' } : {};

	// Check if any labels have content
	const hasLabels = ( beforeLabel && beforeLabel.trim() ) || ( afterLabel && afterLabel.trim() );

	return (
		<div { ...blockProps }>
			<div className="image-comparison-container" data-comparison-slider="true">
				<div className="image-comparison-wrapper" style={ wrapperStyle }>
					<img
						className="image-comparison-after"
						src={ afterImageUrl }
						alt={ afterImageAlt || 'After image' }
						style={ imageStyle }
					/>
					<div className="image-comparison-before-wrapper" style={ { clipPath: 'inset(0 50% 0 0)' } }>
						<img
							className="image-comparison-before"
							src={ beforeImageUrl }
							alt={ beforeImageAlt || 'Before image' }
							style={ imageStyle }
						/>
					</div>
					<div className="image-comparison-divider" style={ { left: '50%' } }>
						<div className="image-comparison-handle">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
					</div>
				</div>
				{ hasLabels && (
					<div className="image-comparison-labels">
						{ beforeLabel && beforeLabel.trim() && (
							<span className="image-comparison-label image-comparison-label-before">{ beforeLabel }</span>
						) }
						{ afterLabel && afterLabel.trim() && (
							<span className="image-comparison-label image-comparison-label-after">{ afterLabel }</span>
						) }
					</div>
				) }
			</div>
		</div>
	);
}