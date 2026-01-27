#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const configDir = path.join(__dirname, '../assets/src/config');
const themeJsonPath = path.join(__dirname, '../theme.json');

// Helper to read and parse JSON file
const readJsonFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
};

// Helper to deep merge objects
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

// Build theme.json
const buildThemeJson = () => {
    console.log('🔨 Building theme.json from modules...\n');

    // Start with base configuration
    const themeJson = readJsonFile(path.join(configDir, 'base.json'));

    if (!themeJson) {
        console.error('❌ Failed to read base.json');
        process.exit(1);
    }

    // Add customTemplates
    const customTemplates = readJsonFile(path.join(configDir, 'customTemplates.json'));
    if (customTemplates) {
        themeJson.customTemplates = customTemplates;
        console.log('✅ Added customTemplates');
    }

    // Add templateParts
    const templateParts = readJsonFile(path.join(configDir, 'templateParts.json'));
    if (templateParts) {
        themeJson.templateParts = templateParts;
        console.log('✅ Added templateParts');
    }

    // Build settings
    themeJson.settings = {};

    // Add base settings (single-keyed properties)
    const baseSettings = readJsonFile(path.join(configDir, 'settings.json'));
    if (baseSettings) {
        themeJson.settings = { ...baseSettings };
        console.log('✅ Added base settings');
    }

    // Add settings modules
    const settingsModules = ['color', 'custom', 'layout', 'shadow', 'spacing', 'typography'];
    settingsModules.forEach(module => {
        const modulePath = path.join(configDir, 'settings', `${module}.json`);
        const moduleData = readJsonFile(modulePath);
        if (moduleData) {
            themeJson.settings[module] = moduleData;
            console.log(`✅ Added settings/${module}`);
        }
    });

    // Build styles
    themeJson.styles = {};

    // Add base styles (if any single-keyed properties exist)
    const baseStyles = readJsonFile(path.join(configDir, 'styles.json'));
    if (baseStyles && Object.keys(baseStyles).length > 0) {
        themeJson.styles = { ...baseStyles };
        console.log('✅ Added base styles');
    }

    // Add styles modules
    const stylesModules = ['blocks', 'color', 'elements', 'spacing', 'typography'];
    stylesModules.forEach(module => {
        const modulePath = path.join(configDir, 'styles', `${module}.json`);
        const moduleData = readJsonFile(modulePath);
        if (moduleData) {
            themeJson.styles[module] = moduleData;
            console.log(`✅ Added styles/${module}`);
        }
    });

    // Write the combined theme.json
    try {
        fs.writeFileSync(themeJsonPath, JSON.stringify(themeJson, null, 4));
        console.log('\n✨ theme.json built successfully!\n');
    } catch (error) {
        console.error('❌ Error writing theme.json:', error.message);
        process.exit(1);
    }
};

// Run the build
try {
    buildThemeJson();
} catch (error) {
    console.error('❌ Error building theme.json:', error.message);
    process.exit(1);
}
