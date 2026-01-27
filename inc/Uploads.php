<?php
/**
 * Uploads
 *
 * Handles media uploads and mime types (SVG support).
 *
 * @package FSE2
 * @since 1.0.0
 */

namespace FSE2;

/**
 * Class Uploads
 *
 * Manages media upload support, including SVG files.
 */
class Uploads
{
    /**
     * Initialize hooks
     *
     * @return void
     */
    public static function init()
    {
        add_filter('upload_mimes', [__CLASS__, 'enableSvgUpload']);
        add_filter('wp_check_filetype_and_ext', [__CLASS__, 'fixSvgFiletypeCheck'], 10, 4);
    }

    /**
     * Enable SVG upload support
     *
     * @param array $mimes Existing mime types.
     * @return array Modified mime types.
     */
    public static function enableSvgUpload($mimes)
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
    public static function fixSvgFiletypeCheck($data, $file, $filename, $mimes)
    {
        $filetype = wp_check_filetype($filename, $mimes);

        return [
            'ext' => $filetype['ext'],
            'type' => $filetype['type'],
            'proper_filename' => $data['proper_filename'],
        ];
    }
}
