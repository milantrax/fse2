# Build Scripts

This directory contains build scripts for managing the theme's modular configuration system.

## Scripts

### build-theme-json.js

Combines modular JSON configuration files into the main `theme.json` file.

**Usage:**
```bash
npm run build:theme-json
```

**What it does:**
- Reads all module files from `assets/src/config/`
- Merges them into a single `theme.json` structure
- Writes the result to the theme root

**Module Structure:**
- `base.json` - Schema and version
- `customTemplates.json` - Custom page templates
- `templateParts.json` - Header, footer, sidebar
- `settings.json` - Base settings (appearanceTools, etc.)
- `settings/color.json` - Color palette, duotone, gradients
- `settings/custom.json` - Color pairings, radius, space
- `settings/layout.json` - contentSize, wideSize
- `settings/shadow.json` - Shadow presets
- `settings/spacing.json` - Spacing sizes and units
- `settings/typography.json` - Font families and sizes
- `styles.json` - Base styles
- `styles/blocks.json` - Block-specific styles
- `styles/color.json` - Global color styles
- `styles/elements.json` - Button, heading, link styles
- `styles/spacing.json` - Global spacing styles
- `styles/typography.json` - Global typography styles

### sync-theme-vars.js

Syncs theme configuration modules to SCSS variables.

**Usage:**
```bash
npm run sync
```

**What it does:**
- Reads modular config files from `assets/src/config/`
- Generates SCSS variable files in `assets/src/scss/variables/`
- Creates files for colors, typography, spacing, shadows, radius, and layout

**Generated Files:**
- `_colors.scss` - Color palette and duotone variables
- `_typography.scss` - Font families, sizes, weights, line heights
- `_spacing.scss` - Spacing sizes and custom space variables
- `_shadows.scss` - Shadow preset variables
- `_radius.scss` - Border radius variables
- `_layout.scss` - Layout size variables

## WordPress Integration

### WP-CLI Global Styles Command

Export WordPress Site Editor customizations back to the modular config files.

**Usage:**
```bash
# Basic export (recommended - merges with existing modules)
wp global-styles export

# Preview changes without writing files
wp global-styles export --dry-run

# Export and rebuild theme.json + sync SCSS
wp global-styles export --run-sync

# Remove customizations from database after export
wp global-styles export --clear-database
```

**What it does:**
1. Retrieves customizations from WordPress database
2. Normalizes font src format (converts URLs to `file:./assets/fonts/...`)
3. Updates individual module files in `assets/src/config/`
4. Rebuilds `theme.json` from modules
5. Optionally syncs SCSS variables
6. Clears WordPress caches

**Font Format Normalization:**

The command automatically converts font URLs to the correct format:

```json
// Before (from WordPress database)
"src": "https://example.com/fonts/font.woff2"

// After (normalized)
"src": ["file:./assets/fonts/{slug}/font.woff2"]
```

## Workflow

### Development Workflow

1. Edit config modules in `assets/src/config/`
2. Run `npm run build:theme-json` to rebuild theme.json
3. Run `npm run sync` to update SCSS variables
4. Build your theme assets with `npm run build`

Or use the combined dev command:
```bash
npm run dev
```

### Site Editor Workflow

When customizing styles in WordPress Site Editor:

1. Make changes in Appearance > Editor
2. Export back to modules: `wp global-styles export --run-sync`
3. Commit the updated module files to version control

### Full Build

```bash
npm run build
```

This runs:
1. `build:theme-json` - Build theme.json from modules
2. `sync` - Sync SCSS variables from modules
3. `build:theme` - Build theme assets with webpack
4. `build:blocks` - Build custom blocks

## Variable Naming Convention

The scripts convert theme.json slugs to SCSS variable names:

- **Colors:** `slug: "primary"` → `$color-primary`
- **Font sizes:** `slug: "body-large"` → `$font-size-body-large`
- **Spacing:** `slug: "xl"` → `$space-xl`
- **Shadows:** `slug: "medium"` → `$shadow-medium`
- **Radius:** `sm: "8px"` → `$radius-sm`

## Benefits of Modular System

1. **Better Organization** - Each setting type in its own file
2. **Easier Maintenance** - Update specific settings without touching others
3. **Version Control** - Smaller, focused commits
4. **Team Collaboration** - Fewer merge conflicts
5. **Reusability** - Share modules between themes
6. **WordPress Integration** - WP-CLI command keeps modules in sync with Site Editor

## Example: Adding a New Color

1. Edit `assets/src/config/settings/color.json`:
```json
{
  "palette": [
    {
      "slug": "new-color",
      "color": "#FF5733",
      "name": "New Color"
    }
  ]
}
```

2. Run the build:
```bash
npm run build:theme-json
npm run sync
```

3. Use in your SCSS:
```scss
.my-element {
  background-color: $color-new-color;
}
```

4. The color is now available in WordPress Site Editor and your theme styles!
