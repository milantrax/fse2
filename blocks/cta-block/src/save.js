import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { title, description, buttonText, buttonUrl, backgroundColor, textColor } = attributes;

    const blockProps = useBlockProps.save({
        className: 'wp-block-my-theme-cta',
        style: {
            backgroundColor: backgroundColor,
            color: textColor,
        },
    });

    return (
        <div {...blockProps}>
            <div className="wp-block-my-theme-cta__content">
                <RichText.Content tagName="h2" className="wp-block-my-theme-cta__title" value={title} />
                <RichText.Content tagName="p" className="wp-block-my-theme-cta__description" value={description} />
                {buttonText && (
                    <div className="wp-block-my-theme-cta__button-wrapper">
                        <a href={buttonUrl || '#'} className="wp-block-my-theme-cta__button">
                            {buttonText}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
