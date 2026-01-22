<?php
/**
 * Block Registry
 *
 * Handles registration of custom blocks from the blocks directory.
 *
 * @package Granola\FSE2
 * @since 1.0.0
 */

namespace Granola\FSE2;

/**
 * Class BlockRegistry
 *
 * Manages registration of custom Gutenberg blocks.
 */
class BlockRegistry
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
        $this->blocks = [
            'hero-block',
            'cta-block',
            'card-block',
            'cards-block',
        ];
    }

    /**
     * Register hooks
     *
     * @return void
     */
    public function register()
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
        return file_exists($blockPath . '/block.json');
    }
}
