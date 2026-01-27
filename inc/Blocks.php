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
    private $blocksDir;

    /**
     * Block names to register
     *
     * @var array
     */
    private $blocks;

    /**
     * Constructor
     *
     * Initializes the block registry with default configuration.
     */
    public function __construct()
    {
        $this->blocksDir = get_template_directory() . '/blocks';
        $this->blocks = $this->getBlocksFromDirectory();
    }

    /**
     * Get all valid blocks from the blocks directory
     *
     * @return array Array of block directory names.
     */
    private function getBlocksFromDirectory()
    {
        $blocks = [];

        if (!is_dir($this->blocksDir)) {
            return $blocks;
        }

        $items = scandir($this->blocksDir);

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }

            $blockPath = $this->blocksDir . '/' . $item;

            if (is_dir($blockPath) && $this->isValidBlock($blockPath)) {
                $blocks[] = $item;
            }
        }

        return $blocks;
    }

    /**
     * Initialize hooks
     *
     * @return void
     */
    public function init()
    {
        add_action('init', [$this, 'registerBlocks']);
    }

    /**
     * Register all custom blocks
     *
     * @return void
     */
    public function registerBlocks()
    {
        foreach ($this->blocks as $block) {
            $this->registerBlock($block);
        }
    }

    /**
     * Register a single block
     *
     * @param string $blockName Block directory name.
     * @return bool True if registered successfully.
     */
    private function registerBlock($blockName)
    {
        $blockPath = $this->blocksDir . '/' . $blockName;

        if (!$this->isValidBlock($blockPath)) {
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
    private function isValidBlock($blockPath)
    {
        // Check for block.json in root or build/ subdirectory
        return file_exists($blockPath . '/block.json') ||
               file_exists($blockPath . '/build/block.json');
    }
}
