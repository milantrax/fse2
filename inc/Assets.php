<?php
/**
 * Assets
 *
 * Handles enqueuing of theme CSS and JavaScript assets.
 *
 * @package FSE2
 * @since 1.0.0
 */

namespace FSE2;

/**
 * Class Assets
 *
 * Manages theme asset enqueuing.
 */
class Assets
{
    /**
     * Assets directory path
     *
     * @var string
     */
    private static $assetsDir;

    /**
     * Assets URI
     *
     * @var string
     */
    private static $assetsUri;

    /**
     * Theme version
     *
     * @var string
     */
    private static $version;

    /**
     * Initialize static properties
     *
     * @return void
     */
    private static function initProperties()
    {
        if (self::$assetsDir === null) {
            self::$assetsDir = get_template_directory() . '/assets/build';
            self::$assetsUri = get_template_directory_uri() . '/assets/build';
            self::$version = wp_get_theme()->get('Version');
        }
    }

    /**
     * Initialize hooks
     *
     * @return void
     */
    public static function init()
    {
        self::initProperties();
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueueAssets']);
    }

    /**
     * Enqueue theme assets
     *
     * @return void
     */
    public static function enqueueAssets()
    {
        self::enqueueStyles();
        self::enqueueScripts();
    }

    /**
     * Enqueue CSS assets
     *
     * @return void
     */
    private static function enqueueStyles()
    {
        $cssPath = self::$assetsDir . '/main.css';

        if (!file_exists($cssPath)) {
            return;
        }

        wp_enqueue_style(
            'my-fse-theme-styles',
            self::$assetsUri . '/main.css',
            [],
            self::$version
        );
    }

    /**
     * Enqueue JavaScript assets
     *
     * @return void
     */
    private static function enqueueScripts()
    {
        $jsPath = self::$assetsDir . '/main.js';

        if (!file_exists($jsPath)) {
            return;
        }

        wp_enqueue_script(
            'my-fse-theme-scripts',
            self::$assetsUri . '/main.js',
            [],
            self::$version,
            true
        );
    }
}
