<?php
/**
 * Settings
 *
 * Handles theme configuration and block pattern registration.
 *
 * @package FSE2
 * @since 1.0.0
 */

namespace FSE2;

/**
 * Class Settings
 *
 * Manages theme supports, block styles and block pattern categories.
 */
class Settings
{
    /**
     * Pattern category slug
     *
     * @var string
     */
    private const PATTERN_CATEGORY = 'fse2';

    /**
     * Initialize hooks
     *
     * @return void
     */
    public static function init()
    {
        add_action('after_setup_theme', [__CLASS__, 'setup']);

        // Core registers its patterns on `init` at priority 10, and registers that
        // callback before the theme loads. Removing the theme support from `init`
        // therefore runs too late to have any effect.
        add_action('after_setup_theme', [__CLASS__, 'removeDefaultPatterns']);

        add_action('init', [__CLASS__, 'registerPatternCategories']);
        add_action('init', [__CLASS__, 'registerBlockStyles']);
    }

    /**
     * Theme setup
     *
     * Configure theme supports and features.
     *
     * Block themes already receive post-thumbnails, responsive-embeds,
     * editor-styles, automatic-feed-links and title-tag from core's
     * _add_default_theme_supports(). Only the additions core does not make are
     * declared here.
     *
     * @return void
     */
    public static function setup()
    {
        load_theme_textdomain('fse2', get_template_directory() . '/languages');

        add_theme_support('wp-block-styles');
        add_theme_support('align-wide');
    }

    /**
     * Register block pattern categories
     *
     * @return void
     */
    public static function registerPatternCategories()
    {
        register_block_pattern_category(self::PATTERN_CATEGORY, [
            'label' => __('FSE2', 'fse2'),
        ]);
    }

    /**
     * Register block style variations
     *
     * The section style carries the theme's vertical block rhythm. It is opt-in so
     * that nesting groups - which every template does - cannot compound the padding.
     *
     * @return void
     */
    public static function registerBlockStyles()
    {
        register_block_style('core/group', [
            'name'  => 'section',
            'label' => __('Section', 'fse2'),
        ]);
    }

    /**
     * Remove default WordPress patterns
     *
     * Removes the bundled core patterns and stops WordPress fetching the remote
     * pattern directory, leaving only this theme's own patterns in the inserter.
     *
     * @return void
     */
    public static function removeDefaultPatterns()
    {
        remove_theme_support('core-block-patterns');
        add_filter('should_load_remote_block_patterns', '__return_false');
    }
}
