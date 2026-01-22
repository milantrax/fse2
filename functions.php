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
use Granola\FSE2\Block_Registry;
use Granola\FSE2\Asset_Manager;
use Granola\FSE2\Theme_Setup;
use Granola\FSE2\Media_Handler;
use Granola\FSE2\CLI_Bootstrap;

// Initialize core theme components
$block_registry = new Block_Registry();
$block_registry->register();

$asset_manager = new Asset_Manager();
$asset_manager->register();

$theme_setup = new Theme_Setup();
$theme_setup->register();

$media_handler = new Media_Handler();
$media_handler->register();

// Register WP-CLI commands
if (defined('WP_CLI') && WP_CLI) {
    CLI_Bootstrap::register();
}
