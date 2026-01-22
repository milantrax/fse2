<?php
/**
 * CLI Bootstrap
 *
 * Handles WP-CLI command registration.
 *
 * @package Granola\FSE2
 * @since 1.0.0
 */

namespace Granola\FSE2;

use WP_CLI;

/**
 * Class CLI_Bootstrap
 *
 * Manages WP-CLI command registration.
 */
class CLI_Bootstrap
{
    /**
     * Register WP-CLI commands
     *
     * @return void
     */
    public static function register()
    {
        self::suppressDeprecationWarnings(function() {
            self::registerCommands();
        });
    }

    /**
     * Register all CLI commands
     *
     * @return void
     */
    private static function registerCommands()
    {
        WP_CLI::add_command('global-styles', 'Granola\FSE2\Global_Styles_Command');
    }

    /**
     * Suppress deprecation warnings during execution
     *
     * @param callable $callable Callable to execute.
     * @return void
     */
    private static function suppressDeprecationWarnings($callable)
    {
        $previousErrorReporting = error_reporting();
        error_reporting($previousErrorReporting & ~E_DEPRECATED);

        $callable();

        error_reporting($previousErrorReporting);
    }
}
