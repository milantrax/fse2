<?php
/**
 * Theme Functions
 *
 * @package FSE2
 */

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

use FSE2\Blocks;
use FSE2\Assets;
use FSE2\Settings;
use FSE2\Uploads;
use FSE2\CLI;

$blocks = new Blocks();
$blocks->init();

$assets = new Assets();
$assets->init();

$settings = new Settings();
$settings->init();

$uploads = new Uploads();
$uploads->init();

if (defined('WP_CLI') && WP_CLI) {
    CLI::init();
}
