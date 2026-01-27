#!/usr/bin/env node

/**
 * Theme Styles Synchronizer
 *
 * Generates SCSS variable files from WordPress theme.json configuration modules.
 * Reads modular JSON config files (color, typography, spacing, shadow, layout) and converts
 * them into SCSS variables for use in stylesheets. This ensures theme configuration stays
 * synchronized between WordPress theme.json and custom SCSS files.
 *
 * Generated files:
 * - _colors.scss: Color palette, duotone, and color pairings
 * - _typography.scss: Font families, sizes, line heights, and weights
 * - _spacing.scss: Spacing sizes and custom spacing values
 * - _shadows.scss: Shadow presets
 * - _radius.scss: Border radius values
 * - _layout.scss: Content and wide layout sizes
 *
 * Usage: node build/sync-theme-styles.js
 */

const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '../assets/src/config');
const variablesDir = path.join(__dirname, '../assets/src/scss/variables');

const kebabToCamel = (str) => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

const slugToVar = (slug) => {
    return slug.replace(/-/g, '-');
};

const generateColorsFile = (palette, duotone, colorPairings) => {
    let content = '// Color Palette\n';

    palette.forEach(color => {
        content += `$color-${slugToVar(color.slug)}: ${color.color};\n`;
    });

    content += '\n// Duotone\n';
    duotone.forEach(duo => {
        const colors = duo.colors.map(c => c).join(', ');
        content += `$duotone-${slugToVar(duo.slug)}: (${colors});\n`;
    });

    if (colorPairings) {
        content += '\n// Color Pairings\n';
        Object.entries(colorPairings).forEach(([key, pairing]) => {
            const varName = key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
            content += `$color-pairing-${varName}: (\n`;
            content += `    foreground: ${pairing.foreground.replace('var(--wp--preset--color--', '$color-').replace(')', '')},\n`;
            content += `    link: ${pairing.link.replace('var(--wp--preset--color--', '$color-').replace(')', '')},\n`;
            content += `    link-hover: ${pairing.linkHover.replace('var(--wp--preset--color--', '$color-').replace(')', '')}\n`;
            content += ');\n\n';
        });
    }

    return content;
};

const generateTypographyFile = (fontFamilies, fontSizes) => {
    let content = '// Font Families\n';

    fontFamilies.forEach(font => {
        content += `$font-${slugToVar(font.slug)}: ${font.fontFamily};\n`;
    });

    content += '\n// Font Sizes\n';
    fontSizes.forEach(size => {
        content += `$font-size-${slugToVar(size.slug)}: ${size.size};\n`;
    });

    content += '\n// Line Heights\n';
    content += '$line-height-base: 1.45;\n';
    content += '$line-height-button: 1;\n';
    content += '$line-height-h1: 1.15;\n';
    content += '$line-height-h2: 1.2;\n';
    content += '$line-height-h3: 1.2;\n';
    content += '$line-height-h4: 1.22;\n';
    content += '$line-height-h5: 1.32;\n';
    content += '$line-height-h6: 1.32;\n';

    content += '\n// Font Weights\n';
    content += '$font-weight-regular: 400;\n';
    content += '$font-weight-semibold: 600;\n';
    content += '$font-weight-light: 300;\n';

    return content;
};

const generateSpacingFile = (spacingSizes, customSpace) => {
    let content = '// Spacing Sizes\n';

    spacingSizes.forEach(space => {
        content += `$space-${slugToVar(space.slug)}: ${space.size};\n`;
    });

    if (customSpace) {
        content += '\n// Custom Spacing\n';
        Object.entries(customSpace).forEach(([key, value]) => {
            const varName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            const scssValue = value.replace(/var\(--wp--preset--spacing--([^)]+)\)/g, (match, slug) => {
                return `$space-${slugToVar(slug)}`;
            });
            content += `$space-${varName}: ${scssValue};\n`;
        });
    }

    content += '\n// Spacing Units\n';
    content += `$spacing-units: (px, em, rem, vh, vw, '%');\n`;

    return content;
};

const generateShadowsFile = (shadowPresets) => {
    let content = '// Shadow Presets\n';

    shadowPresets.forEach(shadow => {
        content += `$shadow-${slugToVar(shadow.slug)}: ${shadow.shadow};\n`;
    });

    return content;
};

const generateRadiusFile = (customRadius) => {
    let content = '// Border Radius\n';

    if (customRadius) {
        Object.entries(customRadius).forEach(([key, value]) => {
            content += `$radius-${key}: ${value};\n`;
        });
    }

    return content;
};

const generateLayoutFile = (layout) => {
    let content = '// Layout Sizes\n';

    if (layout.contentSize) {
        content += `$layout-content-size: ${layout.contentSize};\n`;
    }
    if (layout.wideSize) {
        content += `$layout-wide-size: ${layout.wideSize};\n`;
    }

    return content;
};

const readJsonFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
};

const syncThemeVars = () => {
    console.log('[SYNC] Syncing theme config modules to SCSS variables...\n');

    if (!fs.existsSync(variablesDir)) {
        fs.mkdirSync(variablesDir, { recursive: true });
    }

    const colorConfig = readJsonFile(path.join(configDir, 'settings', 'color.json'));
    const customConfig = readJsonFile(path.join(configDir, 'settings', 'custom.json'));
    const typographyConfig = readJsonFile(path.join(configDir, 'settings', 'typography.json'));
    const spacingConfig = readJsonFile(path.join(configDir, 'settings', 'spacing.json'));
    const shadowConfig = readJsonFile(path.join(configDir, 'settings', 'shadow.json'));
    const layoutConfig = readJsonFile(path.join(configDir, 'settings', 'layout.json'));

    const files = [
        {
            name: '_colors.scss',
            content: generateColorsFile(
                colorConfig?.palette || [],
                colorConfig?.duotone || [],
                customConfig?.colorPairings
            )
        },
        {
            name: '_typography.scss',
            content: generateTypographyFile(
                typographyConfig?.fontFamilies || [],
                typographyConfig?.fontSizes || []
            )
        },
        {
            name: '_spacing.scss',
            content: generateSpacingFile(
                spacingConfig?.spacingSizes || [],
                customConfig?.space
            )
        },
        {
            name: '_shadows.scss',
            content: generateShadowsFile(shadowConfig?.presets || [])
        },
        {
            name: '_radius.scss',
            content: generateRadiusFile(customConfig?.radius)
        },
        {
            name: '_layout.scss',
            content: generateLayoutFile(layoutConfig || {})
        }
    ];

    files.forEach(file => {
        const filePath = path.join(variablesDir, file.name);
        fs.writeFileSync(filePath, file.content);
        console.log(`[OK] Generated ${file.name}`);
    });

    console.log('\n[DONE] Theme variables synced successfully!\n');
};

try {
    syncThemeVars();
} catch (error) {
    console.error('[ERROR] Error syncing theme variables:', error.message);
    process.exit(1);
}
