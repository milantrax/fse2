<?php
/**
 * Title: Post meta
 * Slug: fse2/post-meta
 * Categories: fse2
 * Description: Date, author and category for a single post, separated by dots.
 *
 * @package FSE2
 */

?>
<!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap"},"style":{"spacing":{"blockGap":"var:preset|spacing|xxs"}},"fontSize":"small"} -->
<div class="wp-block-group has-small-font-size">
    <!-- wp:post-date /-->
    <!-- wp:paragraph -->
    <p>·</p>
    <!-- /wp:paragraph -->
    <!-- wp:post-author {"showAvatar":false} /-->
    <!-- wp:paragraph -->
    <p>·</p>
    <!-- /wp:paragraph -->
    <!-- wp:post-terms {"term":"category"} /-->
</div>
<!-- /wp:group -->
