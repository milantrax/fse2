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

            console.log(`  ✓ ${relativePath} (${savings}% smaller)`);
        });

        console.log(`\n[DONE] ${files.length} image(s) optimized successfully!\n`);
    } catch (error) {
        console.error('[ERROR] Error optimizing images:', error.message);
        process.exit(1);
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
