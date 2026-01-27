<?php
/**
 * CLI
 *
 * Handles WP-CLI command registration.
 *
 * @package FSE2
 * @since 1.0.0
 */

namespace FSE2;

use WP_CLI;

/**
 * Class CLI
 *
 * Manages WP-CLI command registration.
 */
class CLI
{
    /**
     * Initialize WP-CLI commands
     *
     * @return void
     */
    public static function init()
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
        WP_CLI::add_command('global-styles', 'FSE2\CLI\GlobalStylesCommand');
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
