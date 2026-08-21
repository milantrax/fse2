<?php
/**
 * Blocks
 *
 * Handles registration of custom blocks from the blocks directory.
 *
 * @package FSE2
 * @since 1.0.0
 */

namespace FSE2;

/**
 * Class Blocks
 *
 * Manages registration of custom Gutenberg blocks.
 */
class Blocks
{
    /**
     * Blocks directory path
     *
     * @var string
     */
    private static $blocksDir;

    /**
     * Resolved block directory paths, keyed by block directory name
     *
     * @var array|null
     */
    private static $blocks;

    /**
     * Initialize hooks
     *
     * @return void
     */
    public static function init()
    {
        if (self::$blocksDir === null) {
            self::$blocksDir = get_template_directory() . '/blocks';
        }

        add_action('init', [__CLASS__, 'registerBlocks']);
    }

    /**
     * Register all custom blocks
     *
     * @return void
     */
    public static function registerBlocks()
    {
        foreach (self::getBlockPaths() as $blockPath) {
            self::registerMetadataCollection($blockPath);
            register_block_type($blockPath);
        }
    }

    /**
     * Register a block's generated metadata collection, when one exists
     *
     * `wp-scripts build --blocks-manifest` emits a blocks-manifest.php beside the
     * built block. Registering it lets WordPress read the block's metadata from that
     * one PHP file instead of opening and decoding block.json on every request.
     *
     * @param string $blockPath Absolute path to the built block directory.
     * @return void
     */
    private static function registerMetadataCollection($blockPath)
    {
        if (!function_exists('wp_register_block_metadata_collection')) {
            return;
        }

        $manifest = $blockPath . '/blocks-manifest.php';

        if (!file_exists($manifest)) {
            return;
        }

        // The manifest is keyed by directory name relative to its parent, so the
        // collection root is the directory above the built block.
        wp_register_block_metadata_collection(dirname($blockPath), $manifest);
    }

    /**
     * Get the registerable path for every block in the blocks directory
     *
     * Resolved once per request and cached, since this runs on every page load.
     *
     * @return array List of absolute block paths.
     */
    private static function getBlockPaths()
    {
        if (self::$blocks !== null) {
            return self::$blocks;
        }

        self::$blocks = [];

        // A built block keeps its block.json in build/; an unbuilt one keeps it at the
        // block root. Two glob() calls resolve both, rather than a scandir plus a pair
        // of file_exists() checks per block on every request.
        $candidates = array_merge(
            (array) glob(self::$blocksDir . '/*/build/block.json'),
            (array) glob(self::$blocksDir . '/*/block.json')
        );

        $resolved = [];

        foreach ($candidates as $manifestPath) {
            $blockPath = dirname($manifestPath);
            $blockName = basename(str_replace('/build', '', $blockPath));

            // Built output wins over its own unbuilt source.
            if (!isset($resolved[$blockName])) {
                $resolved[$blockName] = $blockPath;
            }
        }

        self::$blocks = array_values($resolved);

        return self::$blocks;
    }
}
