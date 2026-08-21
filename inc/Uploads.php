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
 *
 * SVG is intentionally restricted to users who can already inject arbitrary
 * markup. SVG is an executable document format: an uploaded file can carry
 * scripts, external references and event handlers that run in the origin of
 * whoever opens it. Anyone able to upload one is effectively able to run code
 * as any user who views it, so the capability required to upload an SVG must
 * match the capability required to post raw HTML.
 */
class Uploads
{
    /**
     * Capability required to upload SVG files
     *
     * @var string
     */
    private const SVG_CAPABILITY = 'unfiltered_html';

    /**
     * Initialize hooks
     *
     * @return void
     */
    public static function init()
    {
        add_filter('upload_mimes', [__CLASS__, 'enableSvgUpload']);
        add_filter('wp_check_filetype_and_ext', [__CLASS__, 'fixSvgFiletypeCheck'], 10, 4);
        add_filter('wp_handle_upload_prefilter', [__CLASS__, 'sanitizeSvgUpload']);
    }

    /**
     * Enable SVG upload support for privileged users only
     *
     * @param array $mimes Existing mime types.
     * @return array Modified mime types.
     */
    public static function enableSvgUpload($mimes)
    {
        if (!self::userCanUploadSvg()) {
            return $mimes;
        }

        $mimes['svg'] = 'image/svg+xml';
        $mimes['svgz'] = 'image/svg+xml';

        return $mimes;
    }

    /**
     * Allow SVG through the filetype check
     *
     * WordPress verifies an upload's real contents against its extension. That
     * check has no signature to match for SVG, so it rejects the file. This
     * filter re-allows SVG and nothing else: every other file type keeps core's
     * content-based verification untouched.
     *
     * @param array  $data     File data.
     * @param string $file     File path.
     * @param string $filename File name.
     * @param array  $mimes    Mime types.
     * @return array Modified file data.
     */
    public static function fixSvgFiletypeCheck($data, $file, $filename, $mimes) // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter -- fixed filter signature.
    {
        if (!self::isSvgFilename($filename)) {
            return $data;
        }

        if (!self::userCanUploadSvg()) {
            return $data;
        }

        $data['ext'] = 'svg';
        $data['type'] = 'image/svg+xml';

        return $data;
    }

    /**
     * Strip active content from an SVG before it is stored
     *
     * This is a deny-list pass over the raw markup, not a parser. It removes the
     * constructs that are known to execute, but a determined attacker can still
     * find shapes it does not anticipate. It is a second line of defence behind
     * the capability check in enableSvgUpload(), never a replacement for it. For
     * sites that must accept SVG from untrusted authors, use a maintained
     * allow-list sanitizer such as the Safe SVG plugin instead.
     *
     * @param array $file Upload payload from wp_handle_upload_prefilter.
     * @return array Possibly modified upload payload.
     */
    public static function sanitizeSvgUpload($file)
    {
        if (empty($file['name']) || !self::isSvgFilename($file['name'])) {
            return $file;
        }

        if (!self::userCanUploadSvg()) {
            $file['error'] = __('You are not allowed to upload SVG files.', 'fse2');
            return $file;
        }

        if (empty($file['tmp_name']) || !is_readable($file['tmp_name'])) {
            return $file;
        }

        // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- reading the local upload temp file; WP_Filesystem targets the site filesystem, not PHP's upload staging area.
        $markup = file_get_contents($file['tmp_name']);

        if ($markup === false || stripos($markup, '<svg') === false) {
            $file['error'] = __('This file could not be read as an SVG image.', 'fse2');
            return $file;
        }

        $sanitized = self::stripActiveContent($markup);

        if ($sanitized !== $markup) {
            // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents -- same: the upload temp file must be rewritten in place before WordPress moves it.
            file_put_contents($file['tmp_name'], $sanitized);
        }

        return $file;
    }

    /**
     * Remove scriptable constructs from SVG markup
     *
     * @param string $markup Raw SVG markup.
     * @return string Sanitized markup.
     */
    private static function stripActiveContent($markup)
    {
        $patterns = [
            '#<\s*(script|foreignObject|iframe|embed|object|handler|set)\b[^>]*>.*?<\s*/\s*\1\s*>#is',
            '#<\s*(script|foreignObject|iframe|embed|object|handler|set)\b[^>]*/?>#is',
            '#<\s*!\s*(DOCTYPE|ENTITY)\b[^>]*>#is',
            '#<\?[^>]*\?>#s',
            '#\son[a-z]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)#is',
            '#\s(href|xlink:href|src|from|to|values|begin)\s*=\s*("|\')\s*(javascript|data|vbscript)\s*:[^"\']*\2#is',
        ];

        return preg_replace($patterns, '', $markup);
    }

    /**
     * Check whether a filename looks like an SVG
     *
     * @param string $filename File name.
     * @return bool True when the extension is svg or svgz.
     */
    private static function isSvgFilename($filename)
    {
        return (bool) preg_match('/\.svgz?$/i', (string) $filename);
    }

    /**
     * Check whether the current user may upload SVG files
     *
     * @return bool True when the user holds the required capability.
     */
    private static function userCanUploadSvg()
    {
        return current_user_can(self::SVG_CAPABILITY);
    }
}
