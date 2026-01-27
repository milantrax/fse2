# Theme JSON to SCSS Sync Utility

## Overview

This utility automatically synchronizes design tokens from `theme.json` to SCSS variable files in `assets/src/scss/variables/`.

## Usage

### Run Sync Manually
```bash
npm run sync
```

### Automatic Sync
The sync runs automatically before every build:
```bash
npm run build    # Syncs then builds for production
npm run dev      # Syncs then watches for development
```

## Generated Files

The script generates the following SCSS variable files:

- **`_colors.scss`** - Color palette, duotone, and color pairings
- **`_typography.scss`** - Font families, sizes, line heights, and weights
- **`_spacing.scss`** - Spacing scale and custom spacing values
- **`_shadows.scss`** - Box shadow presets
- **`_radius.scss`** - Border radius values
- **`_layout.scss`** - Layout sizes (content and wide)

## How It Works

1. Reads `theme.json` from the theme root
2. Parses the `settings` object
3. Converts theme.json values to SCSS variables
4. Writes organized variable files to `assets/src/scss/variables/`
5. Converts CSS custom properties (e.g., `var(--wp--preset--color--primary)`) to SCSS variables (e.g., `$color-primary`)

## Editing Design Tokens

**Always edit `theme.json` as the source of truth.** The SCSS files are auto-generated and will be overwritten on the next sync.

### Workflow

1. Edit `theme.json` with your design token changes
2. Run `npm run sync` (or let it run automatically during build)
3. The SCSS variables will be updated
4. Use the variables in your SCSS files

## Variable Naming Convention

The script converts theme.json slugs to SCSS variable names:

- **Colors:** `slug: "primary"` → `$color-primary`
- **Font sizes:** `slug: "body-large"` → `$font-size-body-large`
- **Spacing:** `slug: "xl"` → `$space-xl`
- **Shadows:** `slug: "medium"` → `$shadow-medium`
- **Radius:** `sm: "8px"` → `$radius-sm`

## Example

After editing theme.json:

```json
{
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "new-color",
          "color": "#FF5733",
          "name": "New Color"
        }
      ]
    }
  }
}
```

Run sync:
```bash
npm run sync
```

The generated `_colors.scss` will include:
```scss
$color-new-color: #FF5733;
```

Use in your SCSS:
```scss
.my-element {
  background-color: $color-new-color;
}
```
