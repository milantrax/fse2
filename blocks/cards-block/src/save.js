import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { 
    heading, 
    description, 
    cardsPerRow, 
    alignment, 
    gap,
    headingAlignment 
  } = attributes;

  const blockProps = useBlockProps.save({
    className: 'wp-block-my-theme-cards'
  });

  const gridStyle = {
    '--cards-per-row': cardsPerRow,
    '--cards-gap': gap,
    '--cards-alignment': alignment
  };

  return (
    <div {...blockProps} style={gridStyle}>
      <div className="wp-block-my-theme-cards__header" style={{ textAlign: headingAlignment }}>
        <RichText.Content
          tagName="h2"
          className="wp-block-my-theme-cards__heading"
          value={heading}
        />
        <RichText.Content
          tagName="p"
          className="wp-block-my-theme-cards__description"
          value={description}
        />
      </div>
      <div className="wp-block-my-theme-cards__grid">
        <InnerBlocks.Content />
      </div>
    </div>
  );
}
