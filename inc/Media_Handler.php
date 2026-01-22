<?php
/**
 * Media Handler
 *
 * Handles media uploads and mime types (SVG support).
 *
 * @package Granola\FSE2
 * @since 1.0.0
 */

namespace Granola\FSE2;

/**
 * Class Media_Handler
 *
 * Manages media upload support, including SVG files.
 */
class Media_Handler
{
    /**
     * Constructor
     *
     * Initializes the media handler.
     */
    public function __construct()
    {
        // Initialization code if needed
    }

    /**
     * Register hooks
     *
     * @return void
     */
    public function register()
    {
        add_filter('upload_mimes', [$this, 'enableSvgUpload']);
        add_filter('wp_check_filetype_and_ext', [$this, 'fixSvgFiletypeCheck'], 10, 4);
    }

    /**
     * Enable SVG upload support
     *
     * @param array $mimes Existing mime types.
     * @return array Modified mime types.
     */
    public function enableSvgUpload($mimes)
    {
        $mimes['svg'] = 'image/svg+xml';
        $mimes['svgz'] = 'image/svg+xml';
        return $mimes;
    }

    /**
     * Fix SVG mime type check
     *
     * @param array  $data     File data.
     * @param string $file     File path.
     * @param string $filename File name.
     * @param array  $mimes    Mime types.
     * @return array Modified file data.
     */
    public function fixSvgFiletypeCheck($data, $file, $filename, $mimes)
    {
        $filetype = wp_check_filetype($filename, $mimes);

        return [
            'ext' => $filetype['ext'],
            'type' => $filetype['type'],
            'proper_filename' => $data['proper_filename'],
        ];
    }
}
