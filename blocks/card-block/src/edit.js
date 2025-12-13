import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  RichText,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck
} from '@wordpress/block-editor';
import {
  PanelBody,
  TextControl,
  Button
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { mediaId, mediaUrl, icon, title, description, linkUrl, linkText } = attributes;

  const blockProps = useBlockProps({
    className: 'wp-block-my-theme-card'
  });

  const onSelectMedia = (media) => {
    setAttributes({
      mediaId: media.id,
      mediaUrl: media.url
    });
  };

  const onRemoveMedia = () => {
    setAttributes({
      mediaId: 0,
      mediaUrl: ''
    });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Card Image', 'my-fse-theme')} initialOpen={true}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectMedia}
              allowedTypes={['image']}
              value={mediaId}
              render={({ open }) => (
                <div className="editor-post-featured-image">
                  {!mediaUrl && (
                    <Button
                      onClick={open}
                      className="editor-post-featured-image__toggle"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {__('Set card image', 'my-fse-theme')}
                    </Button>
                  )}
                  {mediaUrl && (
                    <>
                      <img
                        src={mediaUrl}
                        alt={__('Card image', 'my-fse-theme')}
                        style={{ width: '100%', marginBottom: '10px' }}
                      />
                      <Button
                        onClick={open}
                        variant="secondary"
                        style={{ marginRight: '8px' }}
                      >
                        {__('Replace', 'my-fse-theme')}
                      </Button>
                      <Button
                        onClick={onRemoveMedia}
                        variant="tertiary"
                        isDestructive
                      >
                        {__('Remove', 'my-fse-theme')}
                      </Button>
                    </>
                  )}
                </div>
              )}
            />
          </MediaUploadCheck>
        </PanelBody>
        <PanelBody title={__('Card Settings', 'my-fse-theme')}>
          <TextControl
            label={__('Icon (emoji or text)', 'my-fse-theme')}
            value={icon}
            onChange={(value) => setAttributes({ icon: value })}
            help={__('Shows when no image is set', 'my-fse-theme')}
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
        {mediaUrl ? (
          <div className="wp-block-my-theme-card__image">
            <MediaUploadCheck>
              <MediaUpload
                onSelect={onSelectMedia}
                allowedTypes={['image']}
                value={mediaId}
                render={({ open }) => (
                  <img
                    src={mediaUrl}
                    alt={title || __('Card image', 'my-fse-theme')}
                    onClick={open}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              />
            </MediaUploadCheck>
          </div>
        ) : (
          <div className="wp-block-my-theme-card__icon">
            {icon}
          </div>
        )}
        <div className="wp-block-my-theme-card__content">
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
      </div>
    </>
  );
}
