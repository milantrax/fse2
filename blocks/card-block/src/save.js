import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { mediaUrl, icon, title, description, linkUrl, linkText } = attributes;

    const blockProps = useBlockProps.save({
        className: 'wp-block-my-theme-card',
    });

    return (
        <div {...blockProps}>
            {mediaUrl ? (
                <div className="wp-block-my-theme-card__image">
                    <img src={mediaUrl} alt={title || ''} />
                </div>
            ) : (
                <div className="wp-block-my-theme-card__icon">{icon}</div>
            )}
            <div className="wp-block-my-theme-card__content">
                <RichText.Content tagName="h3" className="wp-block-my-theme-card__title" value={title} />
                <RichText.Content tagName="p" className="wp-block-my-theme-card__description" value={description} />
                {linkText && linkUrl && (
                    <a href={linkUrl} className="wp-block-my-theme-card__link">
                        {linkText} →
                    </a>
                )}
            </div>
        </div>
    );
}
