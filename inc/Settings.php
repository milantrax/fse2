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
 * Manages theme supports and block pattern categories.
 */
class Settings
{
    /**
     * Constructor
     *
     * Initializes the theme setup.
     */
    public function __construct()
    {
        // Initialization code if needed
    }

    /**
     * Initialize hooks
     *
     * @return void
     */
    public function init()
    {
        add_action('after_setup_theme', [$this, 'setup']);
        add_action('init', [$this, 'registerPatternCategories']);
        add_action('init', [$this, 'removeDefaultPatterns']);
    }

    /**
     * Theme setup
     *
     * Configure theme supports and features.
     *
     * @return void
     */
    public function setup()
    {
        load_theme_textdomain('fse2', get_template_directory() . '/languages');
        
        add_theme_support('automatic-feed-links');
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('responsive-embeds');
        add_theme_support('wp-block-styles');
        add_theme_support('editor-styles');
        add_theme_support('align-wide');
    }

    /**
     * Register block pattern categories
     *
     * @return void
     */
    public function registerPatternCategories()
    {
        register_block_pattern_category('my-theme', [
            'label' => __('My Theme Patterns', 'fse2'),
        ]);
    }

    /**
     * Remove default WordPress patterns
     *
     * Removes core WordPress patterns and remote pattern library,
     * allowing only custom theme patterns.
     *
     * @return void
     */
    public function removeDefaultPatterns()
    {
        remove_theme_support('core-block-patterns');
    }
}
