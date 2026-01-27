#!/usr/bin/env node

/**
 * theme.json Builder
 *
 * Compiles modular configuration files from assets/src/config into a single theme.json file.
 * This script reads base configuration, custom templates, template parts, and modular settings
 * (color, custom, layout, shadow, spacing, typography) and styles (blocks, color, elements,
 * spacing, typography), merging them into the WordPress theme.json format.
 *
 * Usage: node build/build-theme-json.js
 */

const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '../assets/src/config');
const themeJsonPath = path.join(__dirname, '../theme.json');

const readJsonFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
};

const deepMerge = (target, source) => {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }

    return output;
};

const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

const buildThemeJson = () => {
    console.log('[BUILD] Building theme.json from modules...\n');

    const themeJson = readJsonFile(path.join(configDir, 'base.json'));

    if (!themeJson) {
        console.error('[ERROR] Failed to read base.json');
        process.exit(1);
    }

    const customTemplates = readJsonFile(path.join(configDir, 'customTemplates.json'));
    if (customTemplates) {
        themeJson.customTemplates = customTemplates;
        console.log('[OK] Added customTemplates');
    }

    const templateParts = readJsonFile(path.join(configDir, 'templateParts.json'));
    if (templateParts) {
        themeJson.templateParts = templateParts;
        console.log('[OK] Added templateParts');
    }

    themeJson.settings = {};

    const baseSettings = readJsonFile(path.join(configDir, 'settings.json'));
    if (baseSettings) {
        themeJson.settings = { ...baseSettings };
        console.log('[OK] Added base settings');
    }

    const settingsModules = ['color', 'custom', 'layout', 'shadow', 'spacing', 'typography'];
    settingsModules.forEach(module => {
        const modulePath = path.join(configDir, 'settings', `${module}.json`);
        const moduleData = readJsonFile(modulePath);
        if (moduleData) {
            themeJson.settings[module] = moduleData;
            console.log(`[OK] Added settings/${module}`);
        }
    });

    themeJson.styles = {};

    const baseStyles = readJsonFile(path.join(configDir, 'styles.json'));
    if (baseStyles && Object.keys(baseStyles).length > 0) {
        themeJson.styles = { ...baseStyles };
        console.log('[OK] Added base styles');
    }

    const stylesModules = ['blocks', 'color', 'elements', 'spacing', 'typography'];
    stylesModules.forEach(module => {
        const modulePath = path.join(configDir, 'styles', `${module}.json`);
        const moduleData = readJsonFile(modulePath);
        if (moduleData) {
            themeJson.styles[module] = moduleData;
            console.log(`[OK] Added styles/${module}`);
        }
    });

    try {
        fs.writeFileSync(themeJsonPath, JSON.stringify(themeJson, null, 4));
        console.log('\n[DONE] theme.json built successfully!\n');
    } catch (error) {
        console.error('[ERROR] Error writing theme.json:', error.message);
        process.exit(1);
    }
};

try {
    buildThemeJson();
} catch (error) {
    console.error('[ERROR] Error building theme.json:', error.message);
    process.exit(1);
}
