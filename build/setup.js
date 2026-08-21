#!/usr/bin/env node

/**
 * Theme Setup
 *
 * Prepares the theme for use after a fresh clone: checks prerequisites, installs
 * Node and Composer dependencies, runs the full build, and verifies that every file
 * the theme references at runtime actually exists.
 *
 * Uses Node builtins only - it has to run before anything is installed.
 *
 * Usage:
 *   node build/setup.js                 Full development setup
 *   node build/setup.js --production    Skip dev dependencies, optimize autoloader
 *   node build/setup.js --check         Diagnose only; install and build nothing
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const themeRoot = path.join(__dirname, '..');
const args = process.argv.slice(2);
const isProduction = args.includes('--production');
const checkOnly = args.includes('--check');

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, text) => (useColor ? `\u001b[${code}m${text}\u001b[0m` : text);
const bold = (text) => paint('1', text);
const dim = (text) => paint('2', text);
const green = (text) => paint('32', text);
const yellow = (text) => paint('33', text);
const red = (text) => paint('31', text);

const problems = [];
const warnings = [];

const heading = (text) => console.log(`\n${bold(text)}\n${dim('-'.repeat(text.length))}`);
const ok = (text) => console.log(`  ${green('OK')}    ${text}`);

const warn = (text) => {
    warnings.push(text);
    console.log(`  ${yellow('WARN')}  ${text}`);
};

const fail = (text) => {
    problems.push(text);
    console.log(`  ${red('FAIL')}  ${text}`);
};

/**
 * Run a command, streaming its output.
 *
 * @param {string}   command Executable to run.
 * @param {string[]} params  Arguments.
 * @return {boolean} True when the command exited cleanly.
 */
const run = (command, params) => {
    console.log(dim(`\n  $ ${command} ${params.join(' ')}\n`));

    const result = spawnSync(command, params, {
        cwd: themeRoot,
        stdio: 'inherit',
        shell: process.platform === 'win32',
    });

    return result.status === 0;
};

/**
 * Capture a command's stdout without streaming it.
 *
 * @param {string}   command Executable to run.
 * @param {string[]} params  Arguments.
 * @return {string|null} Trimmed stdout, or null when the command is unavailable.
 */
const capture = (command, params) => {
    const result = spawnSync(command, params, {
        cwd: themeRoot,
        encoding: 'utf-8',
        shell: process.platform === 'win32',
    });

    if (result.status !== 0 || !result.stdout) {
        return null;
    }

    return result.stdout.trim();
};

/**
 * Compare two dotted version strings.
 *
 * @param {string} a First version.
 * @param {string} b Second version.
 * @return {number} Negative when a < b, positive when a > b, zero when equal.
 */
const compareVersions = (a, b) => {
    const left = a.split('.').map(Number);
    const right = b.split('.').map(Number);

    for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
        const diff = (left[i] || 0) - (right[i] || 0);

        if (diff !== 0) {
            return diff;
        }
    }

    return 0;
};

/**
 * Check that the tools the build needs are present and new enough.
 *
 * @return {void}
 */
const checkPrerequisites = () => {
    heading('Prerequisites');

    const nvmrcPath = path.join(themeRoot, '.nvmrc');
    const nodeActual = process.versions.node;

    if (fs.existsSync(nvmrcPath)) {
        const expected = fs.readFileSync(nvmrcPath, 'utf-8').trim().replace(/^v/, '');

        if (expected.split('.')[0] === nodeActual.split('.')[0]) {
            ok(`Node ${nodeActual} (.nvmrc wants ${expected})`);
        } else {
            warn(`Node ${nodeActual}, but .nvmrc wants ${expected}. Run \`nvm use\` if the build misbehaves.`);
        }
    } else {
        ok(`Node ${nodeActual}`);
    }

    const npmVersion = capture('npm', ['--version']);

    if (npmVersion) {
        ok(`npm ${npmVersion}`);
    } else {
        fail('npm not found on PATH.');
    }

    // The PHP floor is read from composer.json so the two cannot drift apart.
    let phpFloor = '7.4';

    try {
        const composerJson = JSON.parse(
            fs.readFileSync(path.join(themeRoot, 'composer.json'), 'utf-8')
        );
        const match = (composerJson.require?.php || '').match(/(\d+\.\d+)/);

        if (match) {
            phpFloor = match[1];
        }
    } catch (error) {
        warn('Could not read composer.json; assuming PHP 7.4 as the floor.');
    }

    const phpVersion = capture('php', ['-r', 'echo PHP_VERSION;']);

    if (!phpVersion) {
        fail('PHP not found on PATH. Required to run the theme and phpcs.');
    } else if (compareVersions(phpVersion, phpFloor) < 0) {
        fail(`PHP ${phpVersion} is below the required ${phpFloor}.`);
    } else {
        ok(`PHP ${phpVersion} (composer.json requires >= ${phpFloor})`);
    }

    const composerVersion = capture('composer', ['--version', '--no-ansi']);

    if (!composerVersion) {
        fail('Composer not found on PATH. Install it from https://getcomposer.org/download/');
    } else {
        ok(composerVersion.split('\n')[0]);
    }
};

/**
 * Install Node dependencies, including the block workspaces.
 *
 * @return {boolean} True on success.
 */
const installNode = () => {
    heading('Node dependencies');

    if (!fs.existsSync(path.join(themeRoot, 'package-lock.json'))) {
        warn('No package-lock.json; falling back to `npm install`, which may resolve different versions.');

        return run('npm', ['install']);
    }

    // npm ci installs exactly what the lockfile pins, and fails loudly when
    // package.json and the lockfile have drifted apart.
    return run('npm', ['ci']);
};

/**
 * Install Composer dependencies and generate the autoloader.
 *
 * inc/ is PSR-4 autoloaded, so without vendor/autoload.php functions.php loads no
 * classes at all and the theme silently does nothing.
 *
 * @return {boolean} True on success.
 */
const installComposer = () => {
    heading('Composer dependencies');

    const params = ['install', '--no-interaction'];

    if (!fs.existsSync(path.join(themeRoot, 'composer.lock'))) {
        warn('No composer.lock; Composer will resolve latest versions instead of installing pinned ones.');
    }

    if (isProduction) {
        params.push('--no-dev', '--optimize-autoloader');
    }

    return run('composer', params);
};

/**
 * Run the full asset build.
 *
 * @return {boolean} True on success.
 */
const build = () => {
    heading('Build');

    return run('npm', ['run', 'build']);
};

/**
 * Collect every path the theme needs at runtime.
 *
 * @return {string[]} Theme-relative paths.
 */
const collectRequiredPaths = () => {
    const required = [
        'vendor/autoload.php',
        'theme.json',
        'assets/build/main.css',
        'assets/build/main.js',
    ];

    // Font paths come from theme.json rather than a hardcoded list, so adding a
    // typeface cannot silently escape this check.
    try {
        const themeJson = JSON.parse(
            fs.readFileSync(path.join(themeRoot, 'theme.json'), 'utf-8')
        );

        (themeJson.settings?.typography?.fontFamilies || []).forEach((family) => {
            (family.fontFace || []).forEach((face) => {
                (face.src || []).forEach((src) => {
                    if (typeof src === 'string' && src.startsWith('file:./')) {
                        required.push(src.replace('file:./', ''));
                    }
                });
            });
        });
    } catch (error) {
        warn('Could not read theme.json to resolve font paths.');
    }

    // Every block with a source manifest must have produced a built one for
    // inc/Blocks.php to register it.
    const blocksDir = path.join(themeRoot, 'blocks');

    if (fs.existsSync(blocksDir)) {
        fs.readdirSync(blocksDir, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .forEach((entry) => {
                const source = path.join(blocksDir, entry.name, 'src', 'block.json');

                if (fs.existsSync(source)) {
                    required.push(`blocks/${entry.name}/build/block.json`);
                }
            });
    }

    return required;
};

/**
 * Confirm every runtime path exists and is non-empty.
 *
 * @return {void}
 */
const verify = () => {
    heading('Verification');

    collectRequiredPaths().forEach((relPath) => {
        const full = path.join(themeRoot, relPath);

        if (!fs.existsSync(full)) {
            fail(`Missing: ${relPath}`);
            return;
        }

        if (fs.statSync(full).size === 0) {
            fail(`Empty: ${relPath}`);
            return;
        }

        ok(relPath);
    });
};

/**
 * Print the closing summary and set the exit code.
 *
 * @return {void}
 */
const summarize = () => {
    console.log('');

    if (problems.length > 0) {
        console.log(red(bold(`Setup incomplete - ${problems.length} problem(s):`)));
        problems.forEach((problem) => console.log(`  ${red('*')} ${problem}`));
        console.log('');
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.log(yellow(`Finished with ${warnings.length} warning(s).`));
    }

    console.log(green(bold('Theme ready.')));
    console.log('');
    console.log(`  ${dim('npm run dev')}     watch and rebuild while developing`);
    console.log(`  ${dim('npm run build')}   one-off production build`);
    console.log(`  ${dim('npm run lint')}    lint theme and block styles`);
    console.log(`  ${dim('composer lint')}   check PHP against phpcs.xml`);
    console.log('');
};

const main = () => {
    console.log('');
    console.log(bold(checkOnly ? 'FSE2 setup check' : 'FSE2 theme setup'));
    console.log(dim(isProduction ? 'production mode (no dev dependencies)' : 'development mode'));

    checkPrerequisites();

    if (checkOnly) {
        verify();
        summarize();
        return;
    }

    if (problems.length > 0) {
        console.log('');
        console.log(red(bold('Cannot continue until the failures above are resolved.')));
        console.log('');
        process.exit(1);
    }

    const steps = [
        [installNode, 'Node dependency installation failed.'],
        [installComposer, 'Composer dependency installation failed.'],
        [build, 'Build failed.'],
    ];

    for (const [step, message] of steps) {
        if (!step()) {
            fail(message);
            summarize();
            return;
        }
    }

    verify();
    summarize();
};

main();
