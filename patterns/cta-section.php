<?php
/**
 * Title: Call to Action
 * Slug: my-theme/cta-section
 * Categories: my-theme, call-to-action
 */
?>

<!-- wp:group {"align":"full","backgroundColor":"primary","textColor":"white","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}}} -->
<div class="wp-block-group alignfull has-primary-background-color has-white-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
    <!-- wp:heading {"textAlign":"center","textColor":"white"} -->
    <h2 class="wp-block-heading has-text-align-center has-white-color has-text-color">Ready to Get Started?</h2>
    <!-- /wp:heading -->
    
    <!-- wp:paragraph {"align":"center","textColor":"white","fontSize":"medium"} -->
    <p class="has-text-align-center has-white-color has-text-color has-medium-font-size">Join thousands of satisfied customers who have transformed their business with our solutions.</p>
    <!-- /wp:paragraph -->
    
    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
    <div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--40)">
        <!-- wp:button {"backgroundColor":"white","textColor":"primary"} -->
        <div class="wp-block-button"><a class="wp-block-button__link has-primary-color has-white-background-color has-text-color has-background wp-element-button" href="#signup">Sign Up Now</a></div>
        <!-- /wp:button -->
        
        <!-- wp:button {"className":"is-style-outline","style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}}}} -->
        <div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-link-color wp-element-button" href="#contact" style="border-color:var(--wp--preset--color--white);color:var(--wp--preset--color--white)">Contact Us</a></div>
        <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
</div>
<!-- /wp:group -->
