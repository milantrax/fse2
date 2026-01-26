/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props Block props.
 * @param {Object} props.attributes Block attributes.
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const {
		backgroundType,
		backgroundImage,
		backgroundVideo,
		minHeight,
		verticalAlignment,
		horizontalAlignment,
		hasOverlay,
		overlayColor,
		overlayOpacity,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: `hero-block align-vertical-${ verticalAlignment } align-horizontal-${ horizontalAlignment }`,
		style: {
			minHeight,
		},
	} );

	return (
		<div { ...blockProps }>
			{ backgroundType === 'image' && backgroundImage && (
				<div
					className="hero-block__background hero-block__background-image"
					style={ {
						backgroundImage: `url(${ backgroundImage.url })`,
					} }
					role="img"
					aria-label={ backgroundImage.alt || '' }
				/>
			) }

			{ backgroundType === 'video' && backgroundVideo && (
				<video
					className="hero-block__background hero-block__background-video"
					autoPlay
					muted
					loop
					playsInline
				>
					<source src={ backgroundVideo.url } type="video/mp4" />
				</video>
			) }

			{ hasOverlay && (
				<div
					className="hero-block__overlay"
					style={ {
						backgroundColor: overlayColor,
						opacity: overlayOpacity,
					} }
				/>
			) }

			<div className="hero-block__content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
