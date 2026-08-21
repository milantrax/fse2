#!/usr/bin/env node

/**
 * Image Builder
 *
 * Optimizes and compresses images from assets/src/images and outputs them to assets/build/images.
 * Supports SVG, PNG, and JPEG formats with appropriate optimization for each type.
 *
 * Usage: node build/build-images.js
 */

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const srcDir = path.join(__dirname, '../assets/src/images');
const buildDir = path.join(__dirname, '../assets/build/images');

const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

/**
 * Copy images through unoptimised.
 *
 * Used when the native optimiser binaries are unavailable. The imagemin *-bin
 * packages fetch platform binaries in a postinstall step, which fails on clean
 * installs behind a proxy, with --ignore-scripts, or on unsupported platforms.
 * A missing optimiser must not mean a missing image: theme.json and the templates
 * reference these files, so delivery matters more than compression.
 *
 * @param {string[]} images Source-relative image paths.
 * @return {void}
 */
const copyImages = (images) => {
    images.forEach((relPath) => {
        const from = path.join(srcDir, relPath);
        const to = path.join(buildDir, relPath);

        ensureDirectoryExists(path.dirname(to));
        fs.copyFileSync(from, to);

        console.log(`  - ${relPath} (copied, not optimized)`);
    });
};

const optimizeImages = async () => {
    console.log('[BUILD] Optimizing images...\n');

    ensureDirectoryExists(buildDir);

    const srcImages = await glob('**/*.{jpg,jpeg,png,svg}', {
        cwd: srcDir,
        nodir: true
    });

    if (srcImages.length === 0) {
        console.log('[INFO] No images found in assets/src/images');
        return;
    }

    console.log(`[INFO] Found ${srcImages.length} image(s) to optimize\n`);

    try {
        const files = await imagemin([`${srcDir}/**/*.{jpg,jpeg,png,svg}`], {
            destination: buildDir,
            plugins: [
                imageminMozjpeg({
                    quality: 85,
                    progressive: true
                }),
                imageminPngquant({
                    quality: [0.65, 0.9],
                    speed: 4
                }),
                imageminSvgo({
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                    cleanupIds: false
                                }
                            }
                        }
                    ]
                })
            ]
        });

        console.log('[SUCCESS] Image optimization complete:\n');

        files.forEach(file => {
            const relativePath = path.relative(buildDir, file.destinationPath);
            const originalSize = fs.statSync(file.sourcePath).size;
            const optimizedSize = fs.statSync(file.destinationPath).size;
            const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

            console.log(`  - ${relativePath} (${savings}% smaller)`);
        });

        console.log(`\n[DONE] ${files.length} image(s) optimized successfully!\n`);
    } catch (error) {
        console.warn('[WARN] Image optimizer unavailable, copying originals instead.');
        console.warn(`[WARN] ${error.message.split('\n')[0]}`);
        console.warn('[WARN] Reinstall with scripts enabled to restore optimization.\n');

        copyImages(srcImages);

        console.log(`\n[DONE] ${srcImages.length} image(s) copied (unoptimized).\n`);
    }
};

if (!fs.existsSync(srcDir)) {
    console.log('[INFO] Source directory does not exist. Creating assets/src/images...');
    ensureDirectoryExists(srcDir);
    console.log('[INFO] No images to optimize yet. Add images to assets/src/images and run this script again.\n');
    process.exit(0);
}

optimizeImages().catch(error => {
    console.error('[ERROR] Unexpected error:', error);
    process.exit(1);
});
