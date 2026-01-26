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
import { useBlockProps, MediaPlaceholder, BlockControls, MediaReplaceFlow, InspectorControls } from '@wordpress/block-editor';

import { ToolbarGroup, ToolbarButton, Placeholder, PanelBody, TextControl, __experimentalUnitControl as UnitControl, ToggleControl } from '@wordpress/components';

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
 * @param {Object} props Block properties.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { beforeImageId, beforeImageUrl, beforeImageAlt, afterImageId, afterImageUrl, afterImageAlt, beforeLabel, afterLabel, customHeight, heightUnit } = attributes;

	const onSelectBeforeImage = ( media ) => {
		setAttributes( {
			beforeImageId: media.id,
			beforeImageUrl: media.url,
			beforeImageAlt: media.alt,
		} );
	};

	const onSelectAfterImage = ( media ) => {
		setAttributes( {
			afterImageId: media.id,
			afterImageUrl: media.url,
			afterImageAlt: media.alt,
		} );
	};

	const onRemoveBeforeImage = () => {
		setAttributes( {
			beforeImageId: undefined,
			beforeImageUrl: undefined,
			beforeImageAlt: '',
		} );
	};

	const onRemoveAfterImage = () => {
		setAttributes( {
			afterImageId: undefined,
			afterImageUrl: undefined,
			afterImageAlt: '',
		} );
	};

	const blockProps = useBlockProps( {
		className: 'wp-block-telex-image-comparison-slider',
	} );

	// Calculate inline styles for custom height
	const wrapperStyle = {};
	if ( customHeight ) {
		wrapperStyle.height = `${customHeight}${heightUnit}`;
	}

	// If no images are selected, show upload placeholders
	if ( ! beforeImageUrl && ! afterImageUrl ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					label={ __( 'Image Comparison Slider', 'image-comparison-slider' ) }
					instructions={ __( 'Upload or select before and after images to create an interactive comparison slider.', 'image-comparison-slider' ) }
				>
					<div className="image-comparison-placeholders">
						<div className="image-comparison-placeholder-item">
							<h3>{ __( 'Before Image', 'image-comparison-slider' ) }</h3>
							<MediaPlaceholder
								icon="format-image"
								onSelect={ onSelectBeforeImage }
								accept="image/*"
								allowedTypes={ [ 'image' ] }
								labels={ {
									title: __( 'Before Image', 'image-comparison-slider' ),
									instructions: __( 'Upload or select the before image', 'image-comparison-slider' ),
								} }
							/>
						</div>
						<div className="image-comparison-placeholder-item">
							<h3>{ __( 'After Image', 'image-comparison-slider' ) }</h3>
							<MediaPlaceholder
								icon="format-image"
								onSelect={ onSelectAfterImage }
								accept="image/*"
								allowedTypes={ [ 'image' ] }
								labels={ {
									title: __( 'After Image', 'image-comparison-slider' ),
									instructions: __( 'Upload or select the after image', 'image-comparison-slider' ),
								} }
							/>
						</div>
					</div>
				</Placeholder>
			</div>
		);
	}

	// If only one image is selected, show placeholder for the other
	if ( ! beforeImageUrl || ! afterImageUrl ) {
		return (
			<div { ...blockProps }>
				<div className="image-comparison-editor">
					{ beforeImageUrl && (
						<div className="image-comparison-editor-section">
							<h3>{ __( 'Before Image', 'image-comparison-slider' ) }</h3>
							<div className="image-comparison-editor-image">
								<img src={ beforeImageUrl } alt={ beforeImageAlt } />
								<BlockControls>
									<ToolbarGroup>
										<MediaReplaceFlow
											mediaId={ beforeImageId }
											mediaURL={ beforeImageUrl }
											allowedTypes={ [ 'image' ] }
											accept="image/*"
											onSelect={ onSelectBeforeImage }
										/>
										<ToolbarButton
											icon="trash"
											label={ __( 'Remove before image', 'image-comparison-slider' ) }
											onClick={ onRemoveBeforeImage }
										/>
									</ToolbarGroup>
								</BlockControls>
							</div>
						</div>
					) }
					{ afterImageUrl && (
						<div className="image-comparison-editor-section">
							<h3>{ __( 'After Image', 'image-comparison-slider' ) }</h3>
							<div className="image-comparison-editor-image">
								<img src={ afterImageUrl } alt={ afterImageAlt } />
								<BlockControls>
									<ToolbarGroup>
										<MediaReplaceFlow
											mediaId={ afterImageId }
											mediaURL={ afterImageUrl }
											allowedTypes={ [ 'image' ] }
											accept="image/*"
											onSelect={ onSelectAfterImage }
										/>
										<ToolbarButton
											icon="trash"
											label={ __( 'Remove after image', 'image-comparison-slider' ) }
											onClick={ onRemoveAfterImage }
										/>
									</ToolbarGroup>
								</BlockControls>
							</div>
						</div>
					) }
					{ ! beforeImageUrl && (
						<div className="image-comparison-editor-section">
							<h3>{ __( 'Before Image', 'image-comparison-slider' ) }</h3>
							<MediaPlaceholder
								icon="format-image"
								onSelect={ onSelectBeforeImage }
								accept="image/*"
								allowedTypes={ [ 'image' ] }
								labels={ {
									title: __( 'Before Image', 'image-comparison-slider' ),
									instructions: __( 'Upload or select the before image', 'image-comparison-slider' ),
								} }
							/>
						</div>
					) }
					{ ! afterImageUrl && (
						<div className="image-comparison-editor-section">
							<h3>{ __( 'After Image', 'image-comparison-slider' ) }</h3>
							<MediaPlaceholder
								icon="format-image"
								onSelect={ onSelectAfterImage }
								accept="image/*"
								allowedTypes={ [ 'image' ] }
								labels={ {
									title: __( 'After Image', 'image-comparison-slider' ),
									instructions: __( 'Upload or select the after image', 'image-comparison-slider' ),
								} }
							/>
						</div>
					) }
				</div>
			</div>
		);
	}

	// Check if any labels have content
	const hasLabels = ( beforeLabel && beforeLabel.trim() ) || ( afterLabel && afterLabel.trim() );

	// Both images are selected, show preview
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Label Settings', 'image-comparison-slider' ) } initialOpen={ true }>
					<TextControl
						label={ __( 'Before Label', 'image-comparison-slider' ) }
						value={ beforeLabel }
						onChange={ ( value ) => setAttributes( { beforeLabel: value } ) }
						help={ __( 'Leave empty to hide the label', 'image-comparison-slider' ) }
					/>
					<TextControl
						label={ __( 'After Label', 'image-comparison-slider' ) }
						value={ afterLabel }
						onChange={ ( value ) => setAttributes( { afterLabel: value } ) }
						help={ __( 'Leave empty to hide the label', 'image-comparison-slider' ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Height Settings', 'image-comparison-slider' ) } initialOpen={ false }>
					<p className="components-base-control__help">
						{ __( 'By default, the block uses automatic height based on the image aspect ratio. Set a custom height to override this behavior.', 'image-comparison-slider' ) }
					</p>
					<UnitControl
						label={ __( 'Custom Height', 'image-comparison-slider' ) }
						value={ customHeight ? `${customHeight}${heightUnit}` : '' }
						onChange={ ( value ) => {
							if ( ! value ) {
								setAttributes( { customHeight: undefined, heightUnit: 'px' } );
								return;
							}
							const numValue = parseFloat( value );
							const unit = value.replace( numValue.toString(), '' ) || 'px';
							setAttributes( { customHeight: numValue, heightUnit: unit } );
						} }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'vh', label: 'vh' },
							{ value: 'rem', label: 'rem' },
							{ value: 'em', label: 'em' },
						] }
						help={ __( 'Leave empty to use automatic height based on image aspect ratio', 'image-comparison-slider' ) }
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<ToolbarGroup>
					<MediaReplaceFlow
						mediaId={ beforeImageId }
						mediaURL={ beforeImageUrl }
						allowedTypes={ [ 'image' ] }
						accept="image/*"
						onSelect={ onSelectBeforeImage }
						name={ __( 'Replace before image', 'image-comparison-slider' ) }
					/>
					<MediaReplaceFlow
						mediaId={ afterImageId }
						mediaURL={ afterImageUrl }
						allowedTypes={ [ 'image' ] }
						accept="image/*"
						onSelect={ onSelectAfterImage }
						name={ __( 'Replace after image', 'image-comparison-slider' ) }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...blockProps }>
				<div className="image-comparison-container">
					<div className="image-comparison-wrapper" style={ wrapperStyle }>
						<img
							className="image-comparison-after"
							src={ afterImageUrl }
							alt={ afterImageAlt || __( 'After image', 'image-comparison-slider' ) }
							style={ customHeight ? { height: '100%', objectFit: 'cover' } : {} }
						/>
						<div className="image-comparison-before-wrapper" style={ { clipPath: 'inset(0 50% 0 0)' } }>
							<img
								className="image-comparison-before"
								src={ beforeImageUrl }
								alt={ beforeImageAlt || __( 'Before image', 'image-comparison-slider' ) }
								style={ customHeight ? { height: '100%', objectFit: 'cover' } : {} }
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
								<span className="image-comparison-label image-comparison-label-before">
									{ beforeLabel }
								</span>
							) }
							{ afterLabel && afterLabel.trim() && (
								<span className="image-comparison-label image-comparison-label-after">
									{ afterLabel }
								</span>
							) }
						</div>
					) }
				</div>
			</div>
		</>
	);
}