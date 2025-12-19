<?php
/**
 * Theme Functions
 *
 * @package My_FSE_Theme
 */

// Composer autoload
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Register custom blocks
function my_fse_theme_register_blocks()
{
    $blocks = [
        'hero-block',
        'cta-block',
        'card-block',
        'cards-block',
    ];

    foreach ($blocks as $block) {
        $block_path = __DIR__ . '/blocks/' . $block;
        if (file_exists($block_path . '/block.json')) {
            register_block_type($block_path);
        }
    }
}
add_action('init', 'my_fse_theme_register_blocks');

// Enqueue theme assets
function my_fse_theme_enqueue_assets()
{
    $asset_path = get_template_directory() . '/assets/build/main.css';

    if (file_exists($asset_path)) {
        wp_enqueue_style(
            'my-fse-theme-styles',
            get_template_directory_uri() . '/assets/build/main.css',
            [],
            wp_get_theme()->get('Version')
        );
    }

    $script_path = get_template_directory() . '/assets/build/main.js';

    if (file_exists($script_path)) {
        wp_enqueue_script(
            'my-fse-theme-scripts',
            get_template_directory_uri() . '/assets/build/main.js',
            [],
            wp_get_theme()->get('Version'),
            true
        );
    }
}
//add_action('wp_enqueue_scripts', 'my_fse_theme_enqueue_assets');

// Register block patterns
function my_fse_theme_register_patterns()
{
    register_block_pattern_category('my-theme', [
        'label' => __('My Theme Patterns', 'my-fse-theme'),
    ]);
}
add_action('init', 'my_fse_theme_register_patterns');

// Theme setup
function my_fse_theme_setup()
{
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails
    add_theme_support('post-thumbnails');

    // Add support for responsive embedded content
    add_theme_support('responsive-embeds');

    // Add support for block styles
    add_theme_support('wp-block-styles');

    // Add support for editor styles
    add_theme_support('editor-styles');

    // Add support for wide alignment
    add_theme_support('align-wide');
}
add_action('after_setup_theme', 'my_fse_theme_setup');

// Enable SVG upload support
function my_fse_theme_enable_svg_upload($mimes)
{
    $mimes['svg'] = 'image/svg+xml';
    $mimes['svgz'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'my_fse_theme_enable_svg_upload');


// Fix SVG mime type check
function my_fse_theme_check_svg_filetype($data, $file, $filename, $mimes)
{
    $filetype = wp_check_filetype($filename, $mimes);

    return [
        'ext' => $filetype['ext'],
        'type' => $filetype['type'],
        'proper_filename' => $data['proper_filename'],
    ];
}
add_filter('wp_check_filetype_and_ext', 'my_fse_theme_check_svg_filetype', 10, 4);

// AI Client Integration
/*
use WordPress\AI_Client\AI_Client;

add_action('init', array('WordPress\AI_Client\AI_Client', 'init'));
add_action(
    'admin_enqueue_scripts',
    static function () {
        wp_enqueue_script('wp-ai-client');
    }
);

if (is_singular() && !is_admin()) {
    $text = AI_Client::prompt( 'Write a haiku about WordPress.' )
        ->generate_text();

    echo '<pre>';
    echo '<h2>AI Generated Haiku:</h2>';
    echo wp_kses_post( $text );
    echo '</pre>';
}
*/
