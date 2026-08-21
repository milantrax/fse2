<?php
/**
 * Title: Footer
 * Slug: fse2/footer
 * Categories: fse2, footer
 * Block Types: core/template-part/footer
 * Description: Site footer with tagline, quick links, contact details and social icons.
 *
 * @package FSE2
 */

?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|xl"}}},"backgroundColor":"blueberry","textColor":"pure-white","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-pure-white-color has-blueberry-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--xl);padding-bottom:var(--wp--preset--spacing--xl)">
    <!-- wp:columns {"align":"wide"} -->
    <div class="wp-block-columns alignwide">
        <!-- wp:column -->
        <div class="wp-block-column">
            <!-- wp:site-title {"style":{"elements":{"link":{"color":{"text":"var:preset|color|pure-white"}}}}} /-->
            <!-- wp:site-tagline {"fontSize":"small"} /-->
        </div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column">
            <!-- wp:heading {"level":3,"fontSize":"body-large"} -->
            <h3 class="wp-block-heading has-body-large-font-size"><?php echo esc_html_x('Quick Links', 'Footer heading', 'fse2'); ?></h3>
            <!-- /wp:heading -->
            <!-- wp:navigation {"layout":{"type":"flex","orientation":"vertical"},"style":{"spacing":{"blockGap":"var:preset|spacing|xxs"}},"overlayMenu":"never"} /-->
        </div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column">
            <!-- wp:heading {"level":3,"fontSize":"body-large"} -->
            <h3 class="wp-block-heading has-body-large-font-size"><?php echo esc_html_x('Contact', 'Footer heading', 'fse2'); ?></h3>
            <!-- /wp:heading -->
            <!-- wp:paragraph {"fontSize":"small"} -->
            <p class="has-small-font-size"><?php echo esc_html__('Add your contact details in the Site Editor.', 'fse2'); ?></p>
            <!-- /wp:paragraph -->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->

    <!-- wp:separator {"style":{"spacing":{"margin":{"top":"var:preset|spacing|l","bottom":"var:preset|spacing|l"}}},"className":"is-style-wide"} -->
    <hr class="wp-block-separator has-alpha-channel-opacity is-style-wide" style="margin-top:var(--wp--preset--spacing--l);margin-bottom:var(--wp--preset--spacing--l)"/>
    <!-- /wp:separator -->

    <!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
    <div class="wp-block-group">
        <!-- wp:paragraph {"fontSize":"small"} -->
        <p class="has-small-font-size">
            <?php
            printf(
                /* translators: 1: current year, 2: site title. */
                esc_html__('© %1$s %2$s. All rights reserved.', 'fse2'),
                esc_html(gmdate('Y')),
                esc_html(get_bloginfo('name'))
            );
            ?>
        </p>
        <!-- /wp:paragraph -->

        <!-- wp:social-links {"iconColor":"pure-white","iconColorValue":"#FFFFFF","className":"is-style-logos-only"} -->
        <ul class="wp-block-social-links has-icon-color is-style-logos-only"></ul>
        <!-- /wp:social-links -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->
