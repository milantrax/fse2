<?php
/**
 * Title: Hero Section
 * Slug: my-theme/hero-section
 * Categories: my-theme, featured
 */
?>

<!-- wp:cover {"overlayColor":"primary","minHeight":500,"align":"full"} -->
<div class="wp-block-cover alignfull" style="min-height:500px">
    <span aria-hidden="true" class="wp-block-cover__background has-primary-background-color has-background-dim-100 has-background-dim"></span>
    <div class="wp-block-cover__inner-container">
        <!-- wp:group {"layout":{"type":"constrained"}} -->
        <div class="wp-block-group">
            <!-- wp:heading {"textAlign":"center","level":1,"textColor":"white","style":{"typography":{"fontSize":"3rem"}}} -->
            <h1 class="wp-block-heading has-text-align-center has-white-color has-text-color" style="font-size:3rem">Transform Your Business</h1>
            <!-- /wp:heading -->
            
            <!-- wp:paragraph {"align":"center","textColor":"white","fontSize":"large"} -->
            <p class="has-text-align-center has-white-color has-text-color has-large-font-size">Discover innovative solutions for modern challenges</p>
            <!-- /wp:paragraph -->
            
            <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
            <div class="wp-block-buttons">
                <!-- wp:button {"backgroundColor":"white","textColor":"primary"} -->
                <div class="wp-block-button"><a class="wp-block-button__link has-primary-color has-white-background-color has-text-color has-background wp-element-button" href="#contact">Learn More</a></div>
                <!-- /wp:button -->
                
                <!-- wp:button {"className":"is-style-outline","style":{"elements":{"link":{"color":{"text":"var:preset|color|white"}}}}} -->
                <div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-link-color wp-element-button" href="#services" style="border-color:var(--wp--preset--color--white);color:var(--wp--preset--color--white)">Our Services</a></div>
                <!-- /wp:button -->
            </div>
            <!-- /wp:buttons -->
        </div>
        <!-- /wp:group -->
    </div>
</div>
<!-- /wp:cover -->
