import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { icon, title, description, linkUrl, linkText } = attributes;

  const blockProps = useBlockProps.save({
    className: 'wp-block-my-theme-card'
  });

  return (
    <div {...blockProps}>
      <div className="wp-block-my-theme-card__icon">
        {icon}
      </div>
      <RichText.Content
        tagName="h3"
        className="wp-block-my-theme-card__title"
        value={title}
      />
      <RichText.Content
        tagName="p"
        className="wp-block-my-theme-card__description"
        value={description}
      />
      {linkText && linkUrl && (
        <a href={linkUrl} className="wp-block-my-theme-card__link">
          {linkText} →
        </a>
      )}
    </div>
  );
}
