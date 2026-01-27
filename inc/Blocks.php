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
     * Block names to register
     *
     * @var array
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
            self::$blocks = self::getBlocksFromDirectory();
        }

        add_action('init', [__CLASS__, 'registerBlocks']);
    }

    /**
     * Get all valid blocks from the blocks directory
     *
     * @return array Array of block directory names.
     */
    private static function getBlocksFromDirectory()
    {
        $blocks = [];

        if (!is_dir(self::$blocksDir)) {
            return $blocks;
        }

        $items = scandir(self::$blocksDir);

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            $blockPath = self::$blocksDir . '/' . $item;

            if (is_dir($blockPath) && self::isValidBlock($blockPath)) {
                $blocks[] = $item;
            }
        }

        return $blocks;
    }

    /**
     * Register all custom blocks
     *
     * @return void
     */
    public static function registerBlocks()
    {
        foreach (self::$blocks as $block) {
            self::registerBlock($block);
        }
    }

    /**
     * Register a single block
     *
     * @param string $blockName Block directory name.
     * @return bool True if registered successfully.
     */
    private static function registerBlock($blockName)
    {
        $blockPath = self::$blocksDir . '/' . $blockName;

        if (!self::isValidBlock($blockPath)) {
            return false;
        }

        // If block.json is in build/, register from build/ directory
        if (file_exists($blockPath . '/build/block.json')) {
            $blockPath = $blockPath . '/build';
        }

        register_block_type($blockPath);
        return true;
    }

    /**
     * Check if block directory is valid
     *
     * @param string $blockPath Full path to block directory.
     * @return bool True if valid block directory.
     */
    private static function isValidBlock($blockPath)
    {
        // Check for block.json in root or build/ subdirectory
        return file_exists($blockPath . '/block.json') ||
               file_exists($blockPath . '/build/block.json');
    }
}
