/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	InnerBlocks,
	BlockControls,
} from '@wordpress/block-editor';

import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	Button,
	ColorPicker,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to set block attributes.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
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

	const blockProps = useBlockProps( {
		className: `hero-block align-vertical-${ verticalAlignment } align-horizontal-${ horizontalAlignment }`,
		style: {
			minHeight,
		},
	} );

	const ALLOWED_BLOCKS = [
		'core/heading',
		'core/paragraph',
		'core/button',
		'core/buttons',
		'core/image',
	];

	const TEMPLATE = [
		[
			'core/heading',
			{
				level: 1,
				placeholder: __( 'Add heading...', 'telex-hero-block' ),
			},
		],
		[
			'core/paragraph',
			{
				placeholder: __( 'Add description...', 'telex-hero-block' ),
			},
		],
		[ 'core/buttons', {}, [ [ 'core/button' ] ] ],
	];

	const onSelectMedia = ( media ) => {
		if ( backgroundType === 'image' ) {
			setAttributes( {
				backgroundImage: {
					id: media.id,
					url: media.url,
					alt: media.alt,
				},
			} );
		} else {
			setAttributes( {
				backgroundVideo: {
					id: media.id,
					url: media.url,
				},
			} );
		}
	};

	const removeMedia = () => {
		if ( backgroundType === 'image' ) {
			setAttributes( { backgroundImage: null } );
		} else {
			setAttributes( { backgroundVideo: null } );
		}
	};

	const backgroundMedia =
		backgroundType === 'image' ? backgroundImage : backgroundVideo;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="align-left"
						label={ __( 'Align content left', 'telex-hero-block' ) }
						isPressed={ horizontalAlignment === 'left' }
						onClick={ () =>
							setAttributes( { horizontalAlignment: 'left' } )
						}
					/>
					<ToolbarButton
						icon="align-center"
						label={ __( 'Align content center', 'telex-hero-block' ) }
						isPressed={ horizontalAlignment === 'center' }
						onClick={ () =>
							setAttributes( { horizontalAlignment: 'center' } )
						}
					/>
					<ToolbarButton
						icon="align-right"
						label={ __( 'Align content right', 'telex-hero-block' ) }
						isPressed={ horizontalAlignment === 'right' }
						onClick={ () =>
							setAttributes( { horizontalAlignment: 'right' } )
						}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody
					title={ __( 'Background Settings', 'telex-hero-block' ) }
					initialOpen={ true }
				>
					<SelectControl
						label={ __( 'Background Type', 'telex-hero-block' ) }
						value={ backgroundType }
						options={ [
							{
								label: __( 'Image', 'telex-hero-block' ),
								value: 'image',
							},
							{
								label: __( 'Video', 'telex-hero-block' ),
								value: 'video',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { backgroundType: value } )
						}
					/>

					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMedia }
							allowedTypes={
								backgroundType === 'image'
									? [ 'image' ]
									: [ 'video' ]
							}
							value={ backgroundMedia?.id }
							render={ ( { open } ) => (
								<>
									<Button
										variant="secondary"
										onClick={ open }
										style={ { marginBottom: '10px' } }
									>
										{ backgroundMedia
											? __(
													'Replace Media',
													'telex-hero-block'
											  )
											: __(
													'Select Media',
													'telex-hero-block'
											  ) }
									</Button>
									{ backgroundMedia && (
										<Button
											variant="tertiary"
											isDestructive
											onClick={ removeMedia }
										>
											{ __(
												'Remove Media',
												'telex-hero-block'
											) }
										</Button>
									) }
								</>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>

				<PanelBody
					title={ __( 'Overlay Settings', 'telex-hero-block' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Enable Overlay', 'telex-hero-block' ) }
						checked={ hasOverlay }
						onChange={ ( value ) =>
							setAttributes( { hasOverlay: value } )
						}
					/>

					{ hasOverlay && (
						<>
							<p>
								{ __(
									'Overlay Color',
									'telex-hero-block'
								) }
							</p>
							<ColorPicker
								color={ overlayColor }
								onChangeComplete={ ( value ) =>
									setAttributes( {
										overlayColor: value.hex,
									} )
								}
							/>

							<RangeControl
								label={ __(
									'Overlay Opacity',
									'telex-hero-block'
								) }
								value={ overlayOpacity }
								onChange={ ( value ) =>
									setAttributes( {
										overlayOpacity: value,
									} )
								}
								min={ 0 }
								max={ 1 }
								step={ 0.1 }
							/>
						</>
					) }
				</PanelBody>

				<PanelBody
					title={ __( 'Layout Settings', 'telex-hero-block' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __(
							'Vertical Alignment',
							'telex-hero-block'
						) }
						value={ verticalAlignment }
						options={ [
							{
								label: __( 'Top', 'telex-hero-block' ),
								value: 'top',
							},
							{
								label: __( 'Center', 'telex-hero-block' ),
								value: 'center',
							},
							{
								label: __( 'Bottom', 'telex-hero-block' ),
								value: 'bottom',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { verticalAlignment: value } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Height Settings', 'telex-hero-block' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Minimum Height', 'telex-hero-block' ) }
						value={ minHeight }
						options={ [
							{
								label: __( '30vh', 'telex-hero-block' ),
								value: '30vh',
							},
							{
								label: __( '40vh', 'telex-hero-block' ),
								value: '40vh',
							},
							{
								label: __( '50vh', 'telex-hero-block' ),
								value: '50vh',
							},
							{
								label: __( '60vh', 'telex-hero-block' ),
								value: '60vh',
							},
							{
								label: __( '70vh', 'telex-hero-block' ),
								value: '70vh',
							},
							{
								label: __( '80vh', 'telex-hero-block' ),
								value: '80vh',
							},
							{
								label: __( '90vh', 'telex-hero-block' ),
								value: '90vh',
							},
							{
								label: __( '100vh', 'telex-hero-block' ),
								value: '100vh',
							},
							{
								label: __( '300px', 'telex-hero-block' ),
								value: '300px',
							},
							{
								label: __( '400px', 'telex-hero-block' ),
								value: '400px',
							},
							{
								label: __( '500px', 'telex-hero-block' ),
								value: '500px',
							},
							{
								label: __( '600px', 'telex-hero-block' ),
								value: '600px',
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { minHeight: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ backgroundType === 'image' && backgroundImage && (
					<div
						className="hero-block__background hero-block__background-image"
						style={ {
							backgroundImage: `url(${ backgroundImage.url })`,
						} }
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
						<source
							src={ backgroundVideo.url }
							type="video/mp4"
						/>
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
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ TEMPLATE }
					/>
				</div>
			</div>
		</>
	);
}
