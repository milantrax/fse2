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
     * Initialize hooks
     *
     * @return void
     */
    public static function init()
    {
        if (self::$assetsDir === null) {
            self::$assetsDir = get_template_directory() . '/assets/build';
            self::$assetsUri = get_template_directory_uri() . '/assets/build';
        }

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

        if (!self::hasContent($cssPath)) {
            return;
        }

        wp_enqueue_style(
            'theme-styles',
            self::$assetsUri . '/main.css',
            [],
            self::assetVersion($cssPath)
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

        if (!self::hasContent($jsPath)) {
            return;
        }

        wp_enqueue_script(
            'theme-scripts',
            self::$assetsUri . '/main.js',
            [],
            self::assetVersion($jsPath),
            true
        );
    }

    /**
     * Check that an asset exists and is not empty
     *
     * An empty bundle still costs a render-blocking request, so a build that
     * produced nothing should not be enqueued at all.
     *
     * @param string $path Absolute path to the asset.
     * @return bool True when the file exists and has content.
     */
    private static function hasContent($path)
    {
        return file_exists($path) && filesize($path) > 0;
    }

    /**
     * Build a cache-busting version string for an asset
     *
     * The theme version only changes at release, so it cannot invalidate a rebuilt
     * bundle. File modification time tracks the build instead.
     *
     * @param string $path Absolute path to the asset.
     * @return string Version string.
     */
    private static function assetVersion($path)
    {
        return (string) filemtime($path);
    }
}
