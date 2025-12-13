import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { title, subtitle, buttonText, buttonUrl, backgroundColor, textColor } = attributes;

  const blockProps = useBlockProps.save({
    className: 'wp-block-my-theme-hero',
    style: {
      backgroundColor: backgroundColor,
      color: textColor
    }
  });

  return (
    <div {...blockProps}>
      <div className="wp-block-my-theme-hero__content">
        <RichText.Content
          tagName="h1"
          className="wp-block-my-theme-hero__title"
          value={title}
        />
        <RichText.Content
          tagName="p"
          className="wp-block-my-theme-hero__subtitle"
          value={subtitle}
        />
        {buttonText && (
          <div className="wp-block-my-theme-hero__button-wrapper">
            <a
              href={buttonUrl || '#'}
              className="wp-block-my-theme-hero__button"
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
