<?php
/**
 * Title: Header
 * Slug: fse2/header
 * Categories: fse2, header
 * Block Types: core/template-part/header
 * Description: Site logo with a navigation menu that collapses to an overlay on small screens.
 *
 * @package FSE2
 */

?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|m","bottom":"var:preset|spacing|m"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--m);padding-bottom:var(--wp--preset--spacing--m)">
    <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
    <div class="wp-block-group">
        <!-- wp:site-logo {"width":150,"shouldSyncIcon":true} /-->
        <!-- wp:navigation {"layout":{"type":"flex","setCascadingProperties":true,"justifyContent":"right"}} /-->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->
