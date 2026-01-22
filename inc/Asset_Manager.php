<?php
/**
 * Asset Manager
 *
 * Handles enqueuing of theme CSS and JavaScript assets.
 *
 * @package Granola\FSE2
 * @since 1.0.0
 */

namespace Granola\FSE2;

/**
 * Class Asset_Manager
 *
 * Manages theme asset enqueuing.
 */
class Asset_Manager
{
    /**
     * Assets directory path
     *
     * @var string
     */
    private $assetsDir;

    /**
     * Assets URI
     *
     * @var string
     */
    private $assetsUri;

    /**
     * Theme version
     *
     * @var string
     */
    private $version;

    /**
     * Constructor
     *
     * Initializes asset paths and theme version.
     */
    public function __construct()
    {
        $this->assetsDir = get_template_directory() . '/assets/build';
        $this->assetsUri = get_template_directory_uri() . '/assets/build';
        $this->version = wp_get_theme()->get('Version');
    }

    /**
     * Register hooks
     *
     * @return void
     */
    public function register()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
    }

    /**
     * Enqueue theme assets
     *
     * @return void
     */
    public function enqueueAssets()
    {
        $this->enqueueStyles();
        $this->enqueueScripts();
    }

    /**
     * Enqueue CSS assets
     *
     * @return void
     */
    private function enqueueStyles()
    {
        $cssPath = $this->assetsDir . '/main.css';

        if (!file_exists($cssPath)) {
            return;
        }

        wp_enqueue_style(
            'my-fse-theme-styles',
            $this->assetsUri . '/main.css',
            [],
            $this->version
        );
    }

    /**
     * Enqueue JavaScript assets
     *
     * @return void
     */
    private function enqueueScripts()
    {
        $jsPath = $this->assetsDir . '/main.js';

        if (!file_exists($jsPath)) {
            return;
        }

        wp_enqueue_script(
            'my-fse-theme-scripts',
            $this->assetsUri . '/main.js',
            [],
            $this->version,
            true
        );
    }
}
