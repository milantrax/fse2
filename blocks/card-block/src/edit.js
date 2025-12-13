import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  RichText,
  InspectorControls
} from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { icon, title, description, linkUrl, linkText } = attributes;

  const blockProps = useBlockProps({
    className: 'wp-block-my-theme-card'
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Card Settings', 'my-fse-theme')}>
          <TextControl
            label={__('Icon (emoji or text)', 'my-fse-theme')}
            value={icon}
            onChange={(value) => setAttributes({ icon: value })}
            help={__('Enter an emoji or icon character', 'my-fse-theme')}
          />
          <TextControl
            label={__('Link URL', 'my-fse-theme')}
            value={linkUrl}
            onChange={(value) => setAttributes({ linkUrl: value })}
            placeholder="https://example.com"
          />
          <TextControl
            label={__('Link Text', 'my-fse-theme')}
            value={linkText}
            onChange={(value) => setAttributes({ linkText: value })}
            placeholder={__('Learn more', 'my-fse-theme')}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <div className="wp-block-my-theme-card__icon">
          {icon}
        </div>
        <RichText
          tagName="h3"
          className="wp-block-my-theme-card__title"
          value={title}
          onChange={(value) => setAttributes({ title: value })}
          placeholder={__('Card title...', 'my-fse-theme')}
        />
        <RichText
          tagName="p"
          className="wp-block-my-theme-card__description"
          value={description}
          onChange={(value) => setAttributes({ description: value })}
          placeholder={__('Card description...', 'my-fse-theme')}
        />
        {linkText && (
          <div className="wp-block-my-theme-card__link">
            {linkText} →
          </div>
        )}
      </div>
    </>
  );
}
