# Full-Site Editing WordPress Theme - Development Plan

## Project Structure

```
my-fse-theme/
├── style.css                    # Theme header file
├── theme.json                   # Global settings and styles
├── functions.php                # Theme setup and block registration
├── package.json                 # Dependencies and build scripts
├── webpack.config.js            # Unified build configuration
├── .gitignore
│
├── assets/
│   ├── src/
│   │   ├── scss/
│   │   │   ├── main.scss        # Main theme styles
│   │   │   ├── _variables.scss
│   │   │   ├── _mixins.scss
│   │   │   └── _utilities.scss
│   │   └── js/
│   │       └── main.js          # Theme JavaScript
│   └── build/                   # Compiled theme assets
│       ├── main.css
│       └── main.js
│
├── blocks/                      # Custom Gutenberg blocks
│   ├── hero-block/
│   │   ├── block.json
│   │   ├── src/
│   │   │   ├── edit.js
│   │   │   ├── save.js
│   │   │   ├── editor.scss
│   │   │   └── style.scss
│   │   └── build/              # Compiled block assets
│   │       ├── index.js
│   │       ├── editor.css
│   │       └── style.css
│   ├── cta-block/
│   └── card-block/
│
├── templates/                   # Block templates
│   ├── index.html              # Main template
│   ├── single.html             # Single post
│   ├── page.html               # Default page
│   ├── page-no-sidebar.html    # Page without sidebar
│   ├── page-with-sidebar.html  # Page with sidebar
│   ├── archive.html
│   └── 404.html
│
├── parts/                       # Template parts
│   ├── header.html
│   ├── footer.html
│   ├── sidebar.html
│   └── post-meta.html
│
└── patterns/                    # Block patterns
    ├── hero-section.php
    ├── cta-section.php
    ├── card-grid.php
    ├── testimonials.php
    └── features.php
```

## Phase 1: Theme Foundation Setup

### 1.1 Core Theme Files

**style.css** - Theme header with metadata:
```css
/*
Theme Name: My FSE Theme
Theme URI: https://example.com
Author: Your Name
Author URI: https://example.com
Description: A modern full-site editing theme
Version: 1.0.0
Requires at least: 6.4
Tested up to: 6.7
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: my-fse-theme
*/
```

**functions.php** - Theme setup and block registration:
```php
<?php
// Register custom blocks
function my_fse_theme_register_blocks() {
    $blocks = [
        'hero-block',
        'cta-block',
        'card-block',
    ];
    
    foreach ($blocks as $block) {
        register_block_type(__DIR__ . '/blocks/' . $block . '/build');
    }
}
add_action('init', 'my_fse_theme_register_blocks');

// Enqueue theme assets
function my_fse_theme_enqueue_assets() {
    wp_enqueue_style(
        'my-fse-theme-styles',
        get_template_directory_uri() . '/assets/build/main.css',
        [],
        wp_get_theme()->get('Version')
    );
    
    wp_enqueue_script(
        'my-fse-theme-scripts',
        get_template_directory_uri() . '/assets/build/main.js',
        [],
        wp_get_theme()->get('Version'),
        true
    );
}
add_action('wp_enqueue_scripts', 'my_fse_theme_enqueue_assets');

// Register block patterns
function my_fse_theme_register_patterns() {
    register_block_pattern_category('my-theme', [
        'label' => __('My Theme Patterns', 'my-fse-theme'),
    ]);
}
add_action('init', 'my_fse_theme_register_patterns');
```

### 1.2 theme.json Configuration

**theme.json** - Global settings and styles:
```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "appearanceTools": true,
    "layout": {
      "contentSize": "800px",
      "wideSize": "1200px"
    },
    "color": {
      "palette": [
        {
          "slug": "primary",
          "color": "#0066cc",
          "name": "Primary"
        },
        {
          "slug": "secondary",
          "color": "#333333",
          "name": "Secondary"
        },
        {
          "slug": "white",
          "color": "#ffffff",
          "name": "White"
        }
      ]
    },
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          "slug": "system",
          "name": "System Font"
        }
      ],
      "fontSizes": [
        {
          "slug": "small",
          "size": "0.875rem",
          "name": "Small"
        },
        {
          "slug": "medium",
          "size": "1rem",
          "name": "Medium"
        },
        {
          "slug": "large",
          "size": "1.5rem",
          "name": "Large"
        },
        {
          "slug": "x-large",
          "size": "2rem",
          "name": "Extra Large"
        }
      ]
    },
    "spacing": {
      "units": ["px", "em", "rem", "vh", "vw", "%"],
      "padding": true,
      "margin": true
    }
  },
  "styles": {
    "color": {
      "background": "var(--wp--preset--color--white)",
      "text": "var(--wp--preset--color--secondary)"
    },
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--system)",
      "fontSize": "var(--wp--preset--font-size--medium)",
      "lineHeight": "1.6"
    }
  },
  "templateParts": [
    {
      "name": "header",
      "title": "Header",
      "area": "header"
    },
    {
      "name": "footer",
      "title": "Footer",
      "area": "footer"
    },
    {
      "name": "sidebar",
      "title": "Sidebar",
      "area": "uncategorized"
    }
  ]
}
```

## Phase 2: Build System Configuration

### 2.1 Package Dependencies

**package.json**:
```json
{
  "name": "my-fse-theme",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "build:blocks": "npm run build --workspaces",
    "dev:blocks": "npm run dev --workspaces"
  },
  "workspaces": [
    "blocks/*"
  ],
  "devDependencies": {
    "@wordpress/scripts": "^27.0.0",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "sass": "^1.69.5",
    "sass-loader": "^13.3.2",
    "css-loader": "^6.8.1",
    "mini-css-extract-plugin": "^2.7.6",
    "postcss": "^8.4.32",
    "postcss-loader": "^7.3.3",
    "autoprefixer": "^10.4.16"
  }
}
```

### 2.2 Unified Webpack Configuration

**webpack.config.js**:
```javascript
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');

// Get all block directories
const blockDirs = glob.sync('./blocks/*/');

// Create entry points for all blocks
const blockEntries = {};
blockDirs.forEach(dir => {
  const blockName = path.basename(dir);
  const srcIndex = path.join(dir, 'src/index.js');
  if (require('fs').existsSync(srcIndex)) {
    blockEntries[`blocks/${blockName}/build/index`] = srcIndex;
  }
});

module.exports = {
  entry: {
    'assets/build/main': [
      './assets/src/js/main.js',
      './assets/src/scss/main.scss'
    ],
    ...blockEntries
  },
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@wordpress/babel-preset-default']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  externals: {
    '@wordpress/blocks': ['wp', 'blocks'],
    '@wordpress/block-editor': ['wp', 'blockEditor'],
    '@wordpress/components': ['wp', 'components'],
    '@wordpress/element': ['wp', 'element'],
    '@wordpress/i18n': ['wp', 'i18n'],
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};
```

## Phase 3: Custom Block Development

### 3.1 Block Structure (Example: Hero Block)

Each block in the `blocks/` folder follows this structure:

**blocks/hero-block/package.json**:
```json
{
  "name": "hero-block",
  "version": "1.0.0",
  "main": "build/index.js",
  "scripts": {
    "build": "wp-scripts build src/index.js --output-path=build",
    "dev": "wp-scripts start src/index.js --output-path=build"
  }
}
```

**blocks/hero-block/block.json**:
```json
{
  "apiVersion": 3,
  "name": "my-theme/hero",
  "title": "Hero Section",
  "category": "design",
  "icon": "cover-image",
  "description": "A hero section with title, subtitle, and CTA",
  "textdomain": "my-fse-theme",
  "editorScript": "file:./build/index.js",
  "editorStyle": "file:./build/editor.css",
  "style": "file:./build/style.css",
  "attributes": {
    "title": {
      "type": "string",
      "default": "Welcome to Our Site"
    },
    "subtitle": {
      "type": "string",
      "default": "Your journey starts here"
    },
    "buttonText": {
      "type": "string",
      "default": "Get Started"
    },
    "buttonUrl": {
      "type": "string",
      "default": ""
    }
  }
}
```

**blocks/hero-block/src/index.js**:
```javascript
import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

registerBlockType('my-theme/hero', {
  edit,
  save
});
```

### 3.2 Additional Block Examples

Create similar structures for:
- **CTA Block** (`blocks/cta-block/`)
- **Card Block** (`blocks/card-block/`)

Each with their own `block.json`, `src/` folder, and SCSS files.

## Phase 4: Templates

### 4.1 Page Template - No Sidebar

**templates/page-no-sidebar.html**:
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
    <!-- wp:post-title {"level":1} /-->
    <!-- wp:post-content /-->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

### 4.2 Page Template - With Sidebar

**templates/page-with-sidebar.html**:
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
    <!-- wp:columns -->
    <div class="wp-block-columns">
        <!-- wp:column {"width":"66.66%"} -->
        <div class="wp-block-column" style="flex-basis:66.66%">
            <!-- wp:post-title {"level":1} /-->
            <!-- wp:post-content /-->
        </div>
        <!-- /wp:column -->

        <!-- wp:column {"width":"33.33%"} -->
        <div class="wp-block-column" style="flex-basis:33.33%">
            <!-- wp:template-part {"slug":"sidebar"} /-->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

## Phase 5: Block Patterns

### 5.1 Hero Section Pattern

**patterns/hero-section.php**:
```php
<?php
/**
 * Title: Hero Section
 * Slug: my-theme/hero-section
 * Categories: my-theme, featured
 */
?>

<!-- wp:my-theme/hero {"title":"Transform Your Business","subtitle":"Discover innovative solutions for modern challenges","buttonText":"Learn More","buttonUrl":"#contact"} /-->
```

### 5.2 CTA Pattern

**patterns/cta-section.php**:
```php
<?php
/**
 * Title: Call to Action
 * Slug: my-theme/cta-section
 * Categories: my-theme, call-to-action
 */
?>

<!-- wp:group {"align":"full","backgroundColor":"primary","textColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-primary-background-color has-white-color has-text-color has-background">
    <!-- wp:my-theme/cta {"title":"Ready to Get Started?","description":"Join thousands of satisfied customers","buttonText":"Sign Up Now"} /-->
</div>
<!-- /wp:group -->
```

### 5.3 Card Grid Pattern

**patterns/card-grid.php**:
```php
<?php
/**
 * Title: Card Grid
 * Slug: my-theme/card-grid
 * Categories: my-theme, featured
 */
?>

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- wp:columns {"align":"wide"} -->
    <div class="wp-block-columns alignwide">
        <!-- wp:column -->
        <div class="wp-block-column">
            <!-- wp:my-theme/card {"title":"Feature One","description":"Description of feature one"} /-->
        </div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column">
            <!-- wp:my-theme/card {"title":"Feature Two","description":"Description of feature two"} /-->
        </div>
        <!-- /wp:column -->

        <!-- wp:column -->
        <div class="wp-block-column">
            <!-- wp:my-theme/card {"title":"Feature Three","description":"Description of feature three"} /-->
        </div>
        <!-- /wp:column -->
    </div>
    <!-- /wp:columns -->
</div>
<!-- /wp:group -->
```

## Phase 6: Styling

### 6.1 Main Theme SCSS

**assets/src/scss/main.scss**:
```scss
@import 'variables';
@import 'mixins';
@import 'utilities';

// Global styles
body {
  font-family: var(--wp--preset--font-family--system);
  line-height: 1.6;
}

// Block-specific overrides
.wp-block-group {
  &.has-background {
    padding: 4rem 2rem;
  }
}
```

## Development Workflow

### Initial Setup
1. Run `npm install` to install dependencies
2. Create custom blocks using `@wordpress/create-block` or manually
3. Configure each block's `block.json` and source files

### Development
- **Start theme development**: `npm run dev`
- **Build for production**: `npm run build`
- **Watch block changes**: Each block auto-compiles via main webpack config

### Testing
1. Activate theme in WordPress
2. Create pages and test both template types
3. Insert patterns from the pattern library
4. Verify custom blocks work correctly

## Deployment Checklist

- [ ] Run production build: `npm run build`
- [ ] Remove node_modules and source files
- [ ] Test on clean WordPress installation
- [ ] Verify all blocks load correctly
- [ ] Check responsive design
- [ ] Test template switching
- [ ] Validate theme with Theme Check plugin
- [ ] Create theme documentation

## Additional Recommendations

1. **Version Control**: Add `.gitignore` for node_modules, build files during development
2. **Documentation**: Document custom blocks and their attributes
3. **Accessibility**: Ensure WCAG compliance in templates and blocks
4. **Performance**: Optimize images and minimize CSS/JS
5. **Testing**: Test across different WordPress versions and PHP versions
6. **i18n**: Make all strings translatable using `__()` function