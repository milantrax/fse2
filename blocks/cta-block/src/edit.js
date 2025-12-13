import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  RichText,
  InspectorControls,
  PanelColorSettings
} from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { title, description, buttonText, buttonUrl, backgroundColor, textColor } = attributes;

  const blockProps = useBlockProps({
    className: 'wp-block-my-theme-cta',
    style: {
      backgroundColor: backgroundColor,
      color: textColor
    }
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Button Settings', 'my-fse-theme')}>
          <TextControl
            label={__('Button URL', 'my-fse-theme')}
            value={buttonUrl}
            onChange={(value) => setAttributes({ buttonUrl: value })}
            placeholder="https://example.com"
          />
        </PanelBody>
        <PanelColorSettings
          title={__('Color Settings', 'my-fse-theme')}
          colorSettings={[
            {
              value: backgroundColor,
              onChange: (value) => setAttributes({ backgroundColor: value }),
              label: __('Background Color', 'my-fse-theme')
            },
            {
              value: textColor,
              onChange: (value) => setAttributes({ textColor: value }),
              label: __('Text Color', 'my-fse-theme')
            }
          ]}
        />
      </InspectorControls>
      <div {...blockProps}>
        <div className="wp-block-my-theme-cta__content">
          <RichText
            tagName="h2"
            className="wp-block-my-theme-cta__title"
            value={title}
            onChange={(value) => setAttributes({ title: value })}
            placeholder={__('Enter CTA title...', 'my-fse-theme')}
          />
          <RichText
            tagName="p"
            className="wp-block-my-theme-cta__description"
            value={description}
            onChange={(value) => setAttributes({ description: value })}
            placeholder={__('Enter description...', 'my-fse-theme')}
          />
          <div className="wp-block-my-theme-cta__button-wrapper">
            <RichText
              tagName="span"
              className="wp-block-my-theme-cta__button"
              value={buttonText}
              onChange={(value) => setAttributes({ buttonText: value })}
              placeholder={__('Button text', 'my-fse-theme')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
