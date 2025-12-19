import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    SelectControl,
    __experimentalUnitControl as UnitControl,
} from '@wordpress/components';

const ALLOWED_BLOCKS = ['my-theme/card'];

const TEMPLATE = [
    ['my-theme/card', { icon: '🚀', title: 'Feature One', description: 'Description for feature one goes here.' }],
    ['my-theme/card', { icon: '⚡', title: 'Feature Two', description: 'Description for feature two goes here.' }],
    ['my-theme/card', { icon: '🎯', title: 'Feature Three', description: 'Description for feature three goes here.' }],
];

export default function Edit({ attributes, setAttributes }) {
    const { heading, description, cardsPerRow, alignment, gap, headingAlignment } = attributes;

    const blockProps = useBlockProps({
        className: 'wp-block-my-theme-cards',
    });

    const gridStyle = {
        '--cards-per-row': cardsPerRow,
        '--cards-gap': gap,
        '--cards-alignment': alignment,
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout Settings', 'my-fse-theme')}>
                    <RangeControl
                        label={__('Cards per Row', 'my-fse-theme')}
                        value={cardsPerRow}
                        onChange={(value) => setAttributes({ cardsPerRow: value })}
                        min={1}
                        max={6}
                    />
                    <SelectControl
                        label={__('Card Alignment', 'my-fse-theme')}
                        value={alignment}
                        options={[
                            { label: __('Start', 'my-fse-theme'), value: 'flex-start' },
                            { label: __('Center', 'my-fse-theme'), value: 'center' },
                            { label: __('End', 'my-fse-theme'), value: 'flex-end' },
                            { label: __('Stretch', 'my-fse-theme'), value: 'stretch' },
                        ]}
                        onChange={(value) => setAttributes({ alignment: value })}
                    />
                    <UnitControl
                        label={__('Gap Between Cards', 'my-fse-theme')}
                        value={gap}
                        onChange={(value) => setAttributes({ gap: value })}
                        units={[
                            { value: 'px', label: 'px' },
                            { value: 'rem', label: 'rem' },
                            { value: 'em', label: 'em' },
                        ]}
                    />
                    <SelectControl
                        label={__('Heading Alignment', 'my-fse-theme')}
                        value={headingAlignment}
                        options={[
                            { label: __('Left', 'my-fse-theme'), value: 'left' },
                            { label: __('Center', 'my-fse-theme'), value: 'center' },
                            { label: __('Right', 'my-fse-theme'), value: 'right' },
                        ]}
                        onChange={(value) => setAttributes({ headingAlignment: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps} style={gridStyle}>
                <div className="wp-block-my-theme-cards__header" style={{ textAlign: headingAlignment }}>
                    <RichText
                        tagName="h2"
                        className="wp-block-my-theme-cards__heading"
                        value={heading}
                        onChange={(value) => setAttributes({ heading: value })}
                        placeholder={__('Enter section heading...', 'my-fse-theme')}
                    />
                    <RichText
                        tagName="p"
                        className="wp-block-my-theme-cards__description"
                        value={description}
                        onChange={(value) => setAttributes({ description: value })}
                        placeholder={__('Enter section description...', 'my-fse-theme')}
                    />
                </div>
                <div className="wp-block-my-theme-cards__grid">
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        templateLock={false}
                        orientation="horizontal"
                    />
                </div>
            </div>
        </>
    );
}
