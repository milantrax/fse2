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
        // Add default posts and comments RSS feed links to head
        add_theme_support('automatic-feed-links');

        // Let WordPress manage the document title
        add_theme_support('title-tag');

        // Enable support for Post Thumbnails
        add_theme_support('post-thumbnails');

        // Add support for responsive embedded content
        add_theme_support('responsive-embeds');

        // Add support for block styles
        add_theme_support('wp-block-styles');

        // Add support for editor styles
        add_theme_support('editor-styles');

        // Add support for wide alignment
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
            'label' => __('My Theme Patterns', 'my-fse-theme'),
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
        // Remove core block patterns
        remove_theme_support('core-block-patterns');
    }
}
