#!/usr/bin/env node

/**
 * Font Builder
 *
 * Copies web font files from assets/src/fonts into assets/build/fonts.
 *
 * theme.json registers each fontFace with a `file:./assets/build/fonts/...` source,
 * and assets/build is not versioned, so without this step a clean clone builds a
 * theme whose fonts silently fall back to the system stack.
 *
 * Usage: node build/build-fonts.js
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../assets/src/fonts');
const buildDir = path.join(__dirname, '../assets/build/fonts');
const FONT_EXTENSIONS = /\.(woff2?|ttf|otf|eot)$/i;

const copyFonts = () => {
    console.log('[BUILD] Copying fonts...\n');

    if (!fs.existsSync(srcDir)) {
        console.log('[INFO] No assets/src/fonts directory. Nothing to copy.\n');
        return;
    }

    const fonts = fs.readdirSync(srcDir).filter((file) => FONT_EXTENSIONS.test(file));

    if (fonts.length === 0) {
        console.log('[INFO] No font files found in assets/src/fonts.\n');
        return;
    }

    fs.mkdirSync(buildDir, { recursive: true });

    fonts.forEach((font) => {
        const from = path.join(srcDir, font);
        const to = path.join(buildDir, font);
        fs.copyFileSync(from, to);
        const kb = (fs.statSync(to).size / 1024).toFixed(1);
        console.log(`  [OK] ${font} (${kb} KB)`);
    });

    console.log(`\n[DONE] ${fonts.length} font file(s) copied.\n`);
};

try {
    copyFonts();
} catch (error) {
    console.error('[ERROR] Error copying fonts:', error.message);
    process.exit(1);
}
