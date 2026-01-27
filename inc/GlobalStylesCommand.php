<?php
/**
 * WP-CLI Global Styles Export Command
 *
 * Exports WordPress Site Editor customizations from the database back to theme.json.
 *
 * @package Granola\FSE2
 * @since 1.0.0
 */

namespace Granola\FSE2;

use WP_CLI;
use WP_Theme_JSON_Resolver;

/**
 * Class GlobalStylesCommand
 *
 * WP-CLI command for exporting global styles from WordPress database to theme.json.
 */
class GlobalStylesCommand
{
    /**
     * Path to theme.json file
     *
     * @var string
     */
    private $themeJsonPath;

    /**
     * Path to config directory
     *
     * @var string
     */
    private $configDir;

    /**
     * Path to backup directory
     *
     * @var string
     */
    private $backupDir;

    /**
     * Constructor
     *
     * Initializes file paths and ensures backup directory exists.
     */
    public function __construct()
    {
        $this->themeJsonPath = get_stylesheet_directory() . '/theme.json';
        $this->configDir = get_stylesheet_directory() . '/assets/src/config';
        $this->backupDir = get_stylesheet_directory() . '/backups';

        // Ensure backup directory exists
        if (!file_exists($this->backupDir)) {
            wp_mkdir_p($this->backupDir);
        }
    }

    /**
     * Exports global styles from WordPress database to config modules
     *
     * ## OPTIONS
     *
     * [--merge]
     * : Merge with existing config modules (this is now the default, flag kept for backwards compatibility)
     *
     * [--overwrite]
     * : Overwrite config modules instead of merging (not recommended - may lose settings)
     *
     * [--backup]
     * : Create timestamped backup before modifying (default: true)
     * ---
     * default: true
     * ---
     *
     * [--dry-run]
     * : Show what would change without writing files
     *
     * [--clear-database]
     * : Remove customizations from database after successful export
     *
     * [--run-sync]
     * : Automatically run npm run sync and build:theme-json after export
     *
     * ## EXAMPLES
     *
     *     # Basic export (merges with existing config modules - recommended)
     *     $ wp global-styles export
     *     Success: Global styles merged with config modules
     *
     *     # Preview changes without writing
     *     $ wp global-styles export --dry-run
     *
     *     # Export and rebuild theme.json + sync SCSS variables
     *     $ wp global-styles export --run-sync
     *     Success: Global styles merged with config modules
     *     Success: theme.json rebuilt from config modules
     *     Success: SCSS variables synced from config modules
     *
     *     # Overwrite mode (not recommended - may lose settings)
     *     $ wp global-styles export --overwrite
     *     Warning: Overwrite mode may lose config module settings. Use with caution.
     *     Success: Global styles exported to config modules
     *
     * @when after_wp_load
     *
     * @param array $args       Positional arguments.
     * @param array $assocArgs  Associative arguments (flags and options).
     */
    public function export($args, $assocArgs)
    {
        // Default to merge mode (safer), unless --overwrite is explicitly specified
        $overwrite = isset($assocArgs['overwrite']);
        // Merge is the default, but also accept explicit --merge flag for backwards compatibility
        $merge = !$overwrite;

        $backup = !isset($assocArgs['backup']) || $assocArgs['backup'] !== false;
        $dryRun = isset($assocArgs['dry-run']);
        $clearDatabase = isset($assocArgs['clear-database']);
        $runSync = isset($assocArgs['run-sync']);

        // Warn if using overwrite mode
        if ($overwrite) {
            WP_CLI::warning('Overwrite mode may lose important config module settings. Consider using the default merge mode instead.');
        }

        WP_CLI::log('Retrieving global styles from database...');

        // Get user customizations from database
        $userStyles = $this->getUserGlobalStyles();

        if (is_wp_error($userStyles)) {
            WP_CLI::error($userStyles->get_error_message());
        }

        WP_CLI::log('Cleaning internal WordPress flags and normalizing formats...');

        // Remove internal WordPress flags and normalize formats
        $userStyles = $this->cleanInternalFlags($userStyles);

        // Create backup if requested and not dry-run
        if ($backup && !$dryRun) {
            $timestamp = date('Y-m-d_H-i-s');
            $backupPath = $this->backupConfigModules($timestamp);

            if (is_wp_error($backupPath)) {
                WP_CLI::error('Backup failed: ' . $backupPath->get_error_message());
            }

            WP_CLI::success('Backup created: config-modules.backup.' . $timestamp);
        }

        if ($merge) {
            WP_CLI::log('Merging with existing config modules...');
        } else {
            WP_CLI::log('Overwriting config modules with global styles...');
        }

        // Write to module files
        $writeResult = $this->writeModuleFiles($userStyles, $dryRun);

        if (is_wp_error($writeResult)) {
            WP_CLI::error('Failed to write module files: ' . $writeResult->get_error_message());
        }

        if ($dryRun) {
            WP_CLI::success('Dry run complete. No files were modified.');
            return;
        }

        // Rebuild theme.json from modules
        WP_CLI::log('Rebuilding theme.json from modules...');
        $this->runBuildThemeJson();

        // Clear WordPress caches
        WP_CLI::log('Clearing WordPress caches...');
        $this->clearCaches();

        // Show success message
        if ($merge) {
            WP_CLI::success('Global styles merged with config modules');
        } else {
            WP_CLI::success('Global styles exported to config modules');
        }

        // Optionally run npm sync
        if ($runSync) {
            WP_CLI::log('Running npm sync...');
            $this->runNpmSync();
        }

        // Optionally clear database
        if ($clearDatabase) {
            WP_CLI::confirm('Are you sure you want to remove global styles from the database? This cannot be undone.');
            $this->clearDatabaseStyles();
            WP_CLI::success('Global styles removed from database');
        }
    }

    /**
     * Get user global styles from database
     *
     * @return array|\WP_Error User global styles data or WP_Error on failure.
     */
    private function getUserGlobalStyles()
    {
        $theme = wp_get_theme();

        // Get user customizations from database
        $userCpt = WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles($theme);

        // Check if customizations exist
        if (empty($userCpt) || !isset($userCpt['post_content'])) {
            return new \WP_Error(
                'no_customizations',
                'No global style customizations found in database. Customize styles in Appearance > Editor first.'
            );
        }

        // Decode JSON
        $userData = json_decode($userCpt['post_content'], true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new \WP_Error(
                'json_decode_error',
                'Failed to decode global styles JSON: ' . json_last_error_msg()
            );
        }

        // Check if there are actually meaningful customizations
        // WordPress may create a post with minimal/empty data
        $hasSettings = isset($userData['settings']) && !empty($userData['settings']) && $this->hasNonEmptyData($userData['settings']);
        $hasStyles = isset($userData['styles']) && !empty($userData['styles']) && $this->hasNonEmptyData($userData['styles']);

        if (!$hasSettings && !$hasStyles) {
            return new \WP_Error(
                'no_customizations',
                'No meaningful customizations found in database. The global styles post exists but contains no actual style changes.'
            );
        }

        return $userData;
    }

    /**
     * Check if data contains non-empty values (not just empty arrays/objects)
     *
     * @param mixed $data Data to check.
     * @return bool True if data has meaningful content.
     */
    private function hasNonEmptyData($data)
    {
        if (!is_array($data)) {
            return !empty($data);
        }

        if (empty($data)) {
            return false;
        }

        // Check if array/object has any non-empty values
        foreach ($data as $value) {
            if (is_array($value)) {
                if ($this->hasNonEmptyData($value)) {
                    return true;
                }
            } elseif (!empty($value)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Create backup of theme.json
     *
     * @param string $timestamp Timestamp for backup filename.
     * @return string|\WP_Error Backup file path or WP_Error on failure.
     */
    private function backupThemeJson($timestamp)
    {
        if (!file_exists($this->themeJsonPath)) {
            return new \WP_Error('file_not_found', 'theme.json not found');
        }

        $backupPath = $this->backupDir . '/theme.json.backup.' . $timestamp;

        if (!copy($this->themeJsonPath, $backupPath)) {
            return new \WP_Error('backup_failed', 'Failed to create backup file');
        }

        // Clean up old backups (keep last 10)
        $backups = glob($this->backupDir . '/theme.json.backup.*');

        if (count($backups) > 10) {
            // Sort by modification time (oldest first)
            usort($backups, function ($a, $b) {
                return filemtime($a) - filemtime($b);
            });

            // Delete oldest backups
            $toDelete = array_slice($backups, 0, count($backups) - 10);
            foreach ($toDelete as $oldBackup) {
                unlink($oldBackup);
            }
        }

        return $backupPath;
    }

    /**
     * Create backup of config modules directory
     *
     * @param string $timestamp Timestamp for backup filename.
     * @return string|\WP_Error Backup file path or WP_Error on failure.
     */
    private function backupConfigModules($timestamp)
    {
        if (!file_exists($this->configDir)) {
            return new \WP_Error('config_dir_not_found', 'Config directory not found');
        }

        $backupPath = $this->backupDir . '/config-modules.backup.' . $timestamp . '.tar.gz';

        // Create tar.gz backup of config directory
        $command = sprintf(
            'cd %s && tar -czf %s -C %s .',
            escapeshellarg(dirname($this->configDir)),
            escapeshellarg($backupPath),
            escapeshellarg(basename($this->configDir))
        );

        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            return new \WP_Error('backup_failed', 'Failed to create config modules backup');
        }

        // Clean up old backups (keep last 10)
        $backups = glob($this->backupDir . '/config-modules.backup.*.tar.gz');

        if (count($backups) > 10) {
            // Sort by modification time (oldest first)
            usort($backups, function ($a, $b) {
                return filemtime($a) - filemtime($b);
            });

            // Delete oldest backups
            $toDelete = array_slice($backups, 0, count($backups) - 10);
            foreach ($toDelete as $oldBackup) {
                unlink($oldBackup);
            }
        }

        return $backupPath;
    }

    /**
     * Deep merge user styles with existing theme.json
     *
     * @param array $existing Existing theme.json data.
     * @param array $user     User customizations from database.
     * @return array Merged data.
     */
    private function mergeStyles($existing, $user)
    {
        foreach ($user as $key => $value) {
            if (is_array($value) && isset($existing[$key]) && is_array($existing[$key])) {
                $existing[$key] = $this->mergeStyles($existing[$key], $value);
            } else {
                $existing[$key] = $value;
            }
        }

        return $existing;
    }

    /**
     * Validate JSON structure
     *
     * @param array $json JSON data to validate.
     * @return true|\WP_Error True if valid, WP_Error otherwise.
     */
    private function validateJsonStructure($json)
    {
        // Check required keys
        if (!isset($json['version'])) {
            return new \WP_Error('missing_version', 'Missing required key: version');
        }

        // Version should be an integer
        if (!is_int($json['version']) && !ctype_digit($json['version'])) {
            return new \WP_Error('invalid_version', 'Version must be an integer');
        }

        // Should have either settings or styles
        if (!isset($json['settings']) && !isset($json['styles'])) {
            return new \WP_Error('missing_content', 'JSON must contain settings or styles');
        }

        return true;
    }

    /**
     * Write theme.json to file or return formatted JSON string
     *
     * @param array  $data     JSON data to write.
     * @param bool   $dryRun   Whether this is a dry run.
     * @param string $filePath Output file path.
     * @return true|string|\WP_Error True on success, formatted JSON on dry run, WP_Error on failure.
     */
    private function writeThemeJson($data, $dryRun = false, $filePath = null)
    {
        if ($filePath === null) {
            $filePath = $this->themeJsonPath;
        }

        // Format JSON
        $jsonOutput = json_encode(
            $data,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new \WP_Error('json_encode_error', 'Failed to encode JSON: ' . json_last_error_msg());
        }

        // Return formatted JSON for dry run
        if ($dryRun) {
            return $jsonOutput;
        }

        // Check if file is writable
        if (file_exists($filePath) && !is_writable($filePath)) {
            return new \WP_Error(
                'file_not_writable',
                'Cannot write to file. Check permissions: chmod 644 ' . $filePath
            );
        }

        // Check if directory is writable for new files
        $dir = dirname($filePath);
        if (!file_exists($filePath) && !is_writable($dir)) {
            return new \WP_Error(
                'directory_not_writable',
                'Cannot write to directory. Check permissions: chmod 755 ' . $dir
            );
        }

        // Write to file
        if (file_put_contents($filePath, $jsonOutput) === false) {
            return new \WP_Error('write_failed', 'Failed to write file');
        }

        return true;
    }

    /**
     * Remove internal WordPress flags from global styles data
     *
     * @param array $data Global styles data.
     * @return array Cleaned data.
     */
    private function cleanInternalFlags($data)
    {
        // Remove WordPress internal flag
        unset($data['isGlobalStylesUserThemeJSON']);

        // Normalize fontFamilies structure for theme.json v3
        // WordPress may export with nested "theme" and "custom" keys
        // but theme.json v3 expects a flat array
        if (isset($data['settings']['typography']['fontFamilies'])) {
            $data['settings']['typography']['fontFamilies'] = $this->normalizeFontFamilies(
                $data['settings']['typography']['fontFamilies']
            );
        }

        // Normalize fontSizes structure
        if (isset($data['settings']['typography']['fontSizes'])) {
            $data['settings']['typography']['fontSizes'] = $this->normalizeFontSizes(
                $data['settings']['typography']['fontSizes']
            );
        }

        // Normalize color palettes
        if (isset($data['settings']['color']['palette'])) {
            $data['settings']['color']['palette'] = $this->normalizeColorPalette(
                $data['settings']['color']['palette']
            );
        }

        // Normalize spacing sizes
        if (isset($data['settings']['spacing']['spacingSizes'])) {
            $data['settings']['spacing']['spacingSizes'] = $this->normalizeSpacingSizes(
                $data['settings']['spacing']['spacingSizes']
            );
        }

        return $data;
    }

    /**
     * Normalize fontFamilies structure to flat array for theme.json v3
     *
     * WordPress may export fontFamilies with nested "theme" and "custom" keys,
     * but theme.json v3 expects a flat array.
     *
     * @param array $fontFamilies Font families data.
     * @return array Normalized font families array.
     */
    private function normalizeFontFamilies($fontFamilies)
    {
        // If already a flat array with slug keys, return as-is
        if (isset($fontFamilies[0]['slug'])) {
            // Normalize font src for each font family
            return array_map([$this, 'normalizeFontSrc'], $fontFamilies);
        }

        // If nested with "theme" and "custom" keys, flatten it
        $normalized = [];

        if (isset($fontFamilies['theme']) && is_array($fontFamilies['theme'])) {
            $normalized = array_merge($normalized, $fontFamilies['theme']);
        }

        if (isset($fontFamilies['custom']) && is_array($fontFamilies['custom'])) {
            $normalized = array_merge($normalized, $fontFamilies['custom']);
        }

        // If we found nested data, return the flattened array with normalized src
        if (!empty($normalized)) {
            return array_map([$this, 'normalizeFontSrc'], $normalized);
        }

        // Otherwise return original (might be empty or another format)
        return $fontFamilies;
    }

    /**
     * Normalize font src format to use file: protocol with arrays
     *
     * Converts: "src": "https://example.com/font.woff2"
     * To: "src": ["file:./assets/fonts/font.woff2"]
     *
     * @param array $fontFamily Font family data.
     * @return array Normalized font family data.
     */
    private function normalizeFontSrc($fontFamily)
    {
        if (!isset($fontFamily['fontFace']) || !is_array($fontFamily['fontFace'])) {
            return $fontFamily;
        }

        foreach ($fontFamily['fontFace'] as &$fontFace) {
            if (!isset($fontFace['src'])) {
                continue;
            }

            // If src is a string URL, convert to file: array format
            if (is_string($fontFace['src'])) {
                // Extract filename from URL
                $filename = basename(parse_url($fontFace['src'], PHP_URL_PATH));

                // Try to determine the font folder from the font family slug
                $slug = isset($fontFamily['slug']) ? $fontFamily['slug'] : 'fonts';

                // Convert to file: format
                $fontFace['src'] = ["file:./assets/fonts/{$slug}/{$filename}"];
            } elseif (is_array($fontFace['src'])) {
                // If already an array, normalize each URL
                $fontFace['src'] = array_map(function($src) use ($fontFamily) {
                    if (is_string($src) && (strpos($src, 'http://') === 0 || strpos($src, 'https://') === 0)) {
                        $filename = basename(parse_url($src, PHP_URL_PATH));
                        $slug = isset($fontFamily['slug']) ? $fontFamily['slug'] : 'fonts';
                        return "file:./assets/fonts/{$slug}/{$filename}";
                    }
                    return $src;
                }, $fontFace['src']);
            }
        }

        return $fontFamily;
    }

    /**
     * Normalize fontSizes structure to flat array for theme.json v3
     *
     * @param array $fontSizes Font sizes data.
     * @return array Normalized font sizes array.
     */
    private function normalizeFontSizes($fontSizes)
    {
        // If already a flat array with slug keys, return as-is
        if (isset($fontSizes[0]['slug'])) {
            return $fontSizes;
        }

        // If nested with "default", "theme", "custom" keys, flatten it
        $normalized = [];

        if (isset($fontSizes['default']) && is_array($fontSizes['default'])) {
            $normalized = array_merge($normalized, $fontSizes['default']);
        }

        if (isset($fontSizes['theme']) && is_array($fontSizes['theme'])) {
            $normalized = array_merge($normalized, $fontSizes['theme']);
        }

        if (isset($fontSizes['custom']) && is_array($fontSizes['custom'])) {
            $normalized = array_merge($normalized, $fontSizes['custom']);
        }

        if (!empty($normalized)) {
            return $normalized;
        }

        return $fontSizes;
    }

    /**
     * Normalize color palette structure to flat array for theme.json v3
     *
     * @param array $palette Color palette data.
     * @return array Normalized palette array.
     */
    private function normalizeColorPalette($palette)
    {
        // If already a flat array with slug keys, return as-is
        if (isset($palette[0]['slug'])) {
            return $palette;
        }

        // If nested with "default", "theme", "custom" keys, flatten it
        $normalized = [];

        if (isset($palette['default']) && is_array($palette['default'])) {
            $normalized = array_merge($normalized, $palette['default']);
        }

        if (isset($palette['theme']) && is_array($palette['theme'])) {
            $normalized = array_merge($normalized, $palette['theme']);
        }

        if (isset($palette['custom']) && is_array($palette['custom'])) {
            $normalized = array_merge($normalized, $palette['custom']);
        }

        if (!empty($normalized)) {
            return $normalized;
        }

        return $palette;
    }

    /**
     * Normalize spacing sizes structure to flat array for theme.json v3
     *
     * @param array $spacingSizes Spacing sizes data.
     * @return array Normalized spacing sizes array.
     */
    private function normalizeSpacingSizes($spacingSizes)
    {
        // If already a flat array with slug keys, return as-is
        if (isset($spacingSizes[0]['slug'])) {
            return $spacingSizes;
        }

        // If nested with "default", "theme", "custom" keys, flatten it
        $normalized = [];

        if (isset($spacingSizes['default']) && is_array($spacingSizes['default'])) {
            $normalized = array_merge($normalized, $spacingSizes['default']);
        }

        if (isset($spacingSizes['theme']) && is_array($spacingSizes['theme'])) {
            $normalized = array_merge($normalized, $spacingSizes['theme']);
        }

        if (isset($spacingSizes['custom']) && is_array($spacingSizes['custom'])) {
            $normalized = array_merge($normalized, $spacingSizes['custom']);
        }

        if (!empty($normalized)) {
            return $normalized;
        }

        return $spacingSizes;
    }

    /**
     * Clear WordPress theme and global styles caches
     *
     * @return void
     */
    private function clearCaches()
    {
        // Clear theme cache
        wp_clean_themes_cache();

        // Clear global styles cache
        WP_Theme_JSON_Resolver::clean_cached_data();

        // Clear object cache if available
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
        }
    }

    /**
     * Run npm sync command
     *
     * @return void
     */
    private function runNpmSync()
    {
        $themeDir = get_stylesheet_directory();
        $packageJson = $themeDir . '/package.json';

        if (!file_exists($packageJson)) {
            WP_CLI::warning('package.json not found. Skipping npm sync.');
            return;
        }

        // Check if sync script exists
        $packageData = json_decode(file_get_contents($packageJson), true);
        if (!isset($packageData['scripts']['sync'])) {
            WP_CLI::warning('npm sync script not found in package.json. Skipping npm sync.');
            return;
        }

        // Execute npm sync
        $command = sprintf('cd %s && npm run sync 2>&1', escapeshellarg($themeDir));
        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            WP_CLI::warning('npm sync failed. Run manually: npm run sync');
            WP_CLI::log('Output: ' . implode("\n", $output));
            return;
        }

        WP_CLI::success('SCSS variables synced from config modules');
    }

    /**
     * Run npm build:theme-json command to rebuild theme.json from modules
     *
     * @return void
     */
    private function runBuildThemeJson()
    {
        $themeDir = get_stylesheet_directory();
        $packageJson = $themeDir . '/package.json';

        if (!file_exists($packageJson)) {
            WP_CLI::warning('package.json not found. Skipping theme.json build.');
            return;
        }

        // Check if build:theme-json script exists
        $packageData = json_decode(file_get_contents($packageJson), true);
        if (!isset($packageData['scripts']['build:theme-json'])) {
            WP_CLI::warning('npm build:theme-json script not found in package.json. Skipping theme.json build.');
            return;
        }

        // Execute npm run build:theme-json
        $command = sprintf('cd %s && npm run build:theme-json 2>&1', escapeshellarg($themeDir));
        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            WP_CLI::warning('npm build:theme-json failed. Run manually: npm run build:theme-json');
            WP_CLI::log('Output: ' . implode("\n", $output));
            return;
        }

        WP_CLI::success('theme.json rebuilt from config modules');
    }

    /**
     * Write user styles to modular config files
     *
     * @param array $userStyles User customizations from database.
     * @param bool  $dryRun     Whether this is a dry run.
     * @return true|\WP_Error True on success, WP_Error on failure.
     */
    private function writeModuleFiles($userStyles, $dryRun = false)
    {
        $modulesToUpdate = [];

        // Map settings to module files
        if (isset($userStyles['settings'])) {
            foreach ($userStyles['settings'] as $key => $value) {
                switch ($key) {
                    case 'color':
                        $modulesToUpdate['settings/color.json'] = $value;
                        break;
                    case 'custom':
                        $modulesToUpdate['settings/custom.json'] = $value;
                        break;
                    case 'layout':
                        $modulesToUpdate['settings/layout.json'] = $value;
                        break;
                    case 'shadow':
                        $modulesToUpdate['settings/shadow.json'] = $value;
                        break;
                    case 'spacing':
                        $modulesToUpdate['settings/spacing.json'] = $value;
                        break;
                    case 'typography':
                        $modulesToUpdate['settings/typography.json'] = $value;
                        break;
                    default:
                        // Single-keyed properties go to settings.json
                        if (!isset($modulesToUpdate['settings.json'])) {
                            $modulesToUpdate['settings.json'] = [];
                        }
                        $modulesToUpdate['settings.json'][$key] = $value;
                        break;
                }
            }
        }

        // Map styles to module files
        if (isset($userStyles['styles'])) {
            foreach ($userStyles['styles'] as $key => $value) {
                switch ($key) {
                    case 'blocks':
                        $modulesToUpdate['styles/blocks.json'] = $value;
                        break;
                    case 'color':
                        $modulesToUpdate['styles/color.json'] = $value;
                        break;
                    case 'elements':
                        $modulesToUpdate['styles/elements.json'] = $value;
                        break;
                    case 'spacing':
                        $modulesToUpdate['styles/spacing.json'] = $value;
                        break;
                    case 'typography':
                        $modulesToUpdate['styles/typography.json'] = $value;
                        break;
                    default:
                        // Single-keyed properties go to styles.json
                        if (!isset($modulesToUpdate['styles.json'])) {
                            $modulesToUpdate['styles.json'] = [];
                        }
                        $modulesToUpdate['styles.json'][$key] = $value;
                        break;
                }
            }
        }

        // Handle top-level keys
        if (isset($userStyles['customTemplates'])) {
            $modulesToUpdate['customTemplates.json'] = $userStyles['customTemplates'];
        }

        if (isset($userStyles['templateParts'])) {
            $modulesToUpdate['templateParts.json'] = $userStyles['templateParts'];
        }

        // Write each module file
        foreach ($modulesToUpdate as $moduleFile => $data) {
            $filePath = $this->configDir . '/' . $moduleFile;

            // Read existing module data
            $existingData = [];
            if (file_exists($filePath)) {
                $existingContent = file_get_contents($filePath);
                $existingData = json_decode($existingContent, true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    return new \WP_Error(
                        'json_decode_error',
                        'Failed to decode ' . $moduleFile . ': ' . json_last_error_msg()
                    );
                }
            }

            // Merge with existing data
            $mergedData = $this->mergeStyles($existingData, $data);

            // Write the module file
            $result = $this->writeJsonFile($filePath, $mergedData, $dryRun);

            if (is_wp_error($result)) {
                return $result;
            }

            if (!$dryRun) {
                WP_CLI::log('Updated: ' . $moduleFile);
            }
        }

        return true;
    }

    /**
     * Write JSON data to a file
     *
     * @param string $filePath File path.
     * @param array  $data     JSON data to write.
     * @param bool   $dryRun   Whether this is a dry run.
     * @return true|string|\WP_Error True on success, formatted JSON on dry run, WP_Error on failure.
     */
    private function writeJsonFile($filePath, $data, $dryRun = false)
    {
        // Format JSON
        $jsonOutput = json_encode(
            $data,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new \WP_Error('json_encode_error', 'Failed to encode JSON: ' . json_last_error_msg());
        }

        // Return formatted JSON for dry run
        if ($dryRun) {
            return $jsonOutput;
        }

        // Ensure directory exists
        $dir = dirname($filePath);
        if (!file_exists($dir)) {
            wp_mkdir_p($dir);
        }

        // Check if file is writable
        if (file_exists($filePath) && !is_writable($filePath)) {
            return new \WP_Error(
                'file_not_writable',
                'Cannot write to file. Check permissions: chmod 644 ' . $filePath
            );
        }

        // Check if directory is writable for new files
        if (!file_exists($filePath) && !is_writable($dir)) {
            return new \WP_Error(
                'directory_not_writable',
                'Cannot write to directory. Check permissions: chmod 755 ' . $dir
            );
        }

        // Write to file
        if (file_put_contents($filePath, $jsonOutput) === false) {
            return new \WP_Error('write_failed', 'Failed to write file: ' . $filePath);
        }

        return true;
    }

    /**
     * Clear global styles from database
     *
     * @return void
     */
    private function clearDatabaseStyles()
    {
        $theme = wp_get_theme();
        $postId = WP_Theme_JSON_Resolver::get_user_global_styles_post_id();

        if ($postId) {
            wp_delete_post($postId, true);
        }
    }
}
