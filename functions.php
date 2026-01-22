<?php
/**
 * Theme Functions - Bootstrap File
 *
 * @package Granola\FSE2
 */

// Composer autoload
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Use statements
use Granola\FSE2\BlockRegistry;
use Granola\FSE2\AssetManager;
use Granola\FSE2\ThemeSetup;
use Granola\FSE2\MediaHandler;
use Granola\FSE2\CLIBootstrap;

// Initialize core theme components
$block_registry = new BlockRegistry();
$block_registry->init();

$asset_manager = new AssetManager();
$asset_manager->init();

$theme_setup = new ThemeSetup();
$theme_setup->init();

$media_handler = new MediaHandler();
$media_handler->init();

// Initialize WP-CLI commands
if (defined('WP_CLI') && WP_CLI) {
    CLIBootstrap::init();
}
