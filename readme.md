# FSE2

A modern Full-Site Editing WordPress theme with automatic block registration and custom pattern support.

## Project Structure

```
fse2/
├── style.css                    # Theme header file
├── theme.json                   # Global settings and styles
├── functions.php                # Theme bootstrap
├── composer.json                # PHP dependencies
├── package.json                 # Build dependencies
│
├── inc/                         # PHP classes
│   ├── AssetManager.php         # Asset compilation and enqueuing
│   ├── BlockRegistry.php        # Automatic block registration
│   ├── ThemeSetup.php           # Theme configuration
│   ├── MediaHandler.php         # Media handling
│   ├── GlobalStylesCommand.php  # WP-CLI commands
│   └── CLIBootstrap.php         # WP-CLI initialization
│
├── assets/
│   ├── src/
│   │   ├── scss/                # Source Sass files
│   │   │   ├── main.scss
│   │   │   ├── blocks/          # Block-specific styles
│   │   │   └── variables/       # Design tokens
│   │   └── js/
│   │       └── main.js          # Theme JavaScript
│   └── build/                   # Compiled assets
│
├── blocks/                      # Drop-in custom blocks
│   └── [block-name]/            # Each block is self-contained
│       ├── package.json         # Block metadata
│       ├── src/                 # Block source files
│       │   ├── block.json       # Block configuration
│       │   └── ...              # JS, SCSS files
│       └── build/               # Compiled block assets
│
├── templates/                   # Block templates
│   ├── index.html
│   ├── single.html
│   └── page.html
│
├── parts/                       # Template parts
│   ├── header.html
│   └── footer.html
│
└── patterns/                    # Custom block patterns
```

## Key Features

### Automatic Block Registration

The theme uses the `BlockRegistry` class to automatically discover and register all blocks in the `/blocks` directory. This means:

- **Drop-in Blocks**: Simply add a new block folder to `/blocks` and it will be automatically registered
- **No manual registration**: No need to update `functions.php` when adding new blocks
- **Flexible structure**: Blocks can have `block.json` in root or `/build` subdirectory
- **Self-contained**: Each block is a complete package with its own dependencies

### Custom Pattern Support

The `ThemeSetup` class handles pattern configuration:

- **Custom-only patterns**: Default WordPress core patterns are hidden
- **Theme patterns**: Only custom patterns from `/patterns` directory are shown
- **Pattern categories**: Custom pattern categories for organization

### Modern Architecture

- **OOP structure**: Organized into namespaced PHP classes
- **Composer autoloading**: PSR-4 autoloading for clean code organization
- **Asset management**: Centralized asset compilation and enqueuing
- **WP-CLI integration**: Custom CLI commands for global styles management

## Working with Custom Blocks

### Drop-in Block System

Custom blocks in the `/blocks` directory are automatically registered. Each block is a self-contained package with its own build configuration.

**Block Structure**:
```
blocks/
└── [block-name]/
    ├── package.json         # Block dependencies and scripts
    ├── src/                 # Source files
    │   ├── block.json       # Block configuration
    │   ├── index.js         # Block registration
    │   ├── edit.js          # Editor component
    │   ├── save.js          # Frontend output
    │   ├── view.js          # Frontend interactivity (optional)
    │   ├── editor.scss      # Editor styles
    │   └── style.scss       # Frontend styles
    └── build/               # Compiled assets (auto-generated)
        └── block.json       # Copied from src
```

### Adding a New Block

1. Create a new directory in `/blocks/[your-block-name]`
2. Add `package.json` with build scripts
3. Create `/src` directory
4. Add `block.json` in the `/src` folder with block configuration
5. Add other source files (`index.js`, `edit.js`, `save.js`, etc.) in `/src`
6. Run build command
7. The block is automatically registered (no code changes needed)

**Note**: Blocks are modular and portable. You can copy an entire block folder from one theme to another as a drop-in component.

### Block Build Commands

Each block has its own build configuration:

```bash
# Build a specific block
cd blocks/[block-name]
npm run build

# Watch mode for development
npm run dev
```

## Asset Management

### Theme Assets

The `AssetManager` class handles compilation and enqueuing of theme assets:

- **Source files**: Located in `/assets/src/`
- **Compiled files**: Output to `/assets/build/`
- **Sass compilation**: Uses structured variable system
- **Auto-versioning**: Based on theme version

### Sass Structure

```
assets/src/scss/
├── main.scss              # Main entry point
├── blocks/                # Block-specific styles
└── variables/             # Design tokens
    ├── _colors.scss
    ├── _spacing.scss
    ├── _typography.scss
    └── _radius.scss
```

## Block Patterns

Custom patterns are stored in `/patterns` and automatically registered. The theme hides all default WordPress core patterns to keep the pattern library focused on custom designs.

**Pattern Structure**:
```php
<?php
/**
 * Title: Pattern Name
 * Slug: theme-slug/pattern-name
 * Categories: category-name
 */
?>
<!-- Block markup here -->
```

## Development Workflow

### Initial Setup

```bash
# Install PHP dependencies
composer install

# Install theme build dependencies
npm install

# Install block dependencies (for each block)
cd blocks/[block-name]
npm install
```

### Building Assets

```bash
# Build theme assets
npm run build

# Watch theme assets during development
npm run dev

# Build a specific block
cd blocks/[block-name]
npm run build
```

### WP-CLI Commands

The theme includes custom WP-CLI commands for global styles management:

```bash
# List all available commands
wp

# Global styles commands
wp global-styles <command>
```

## Theme Configuration

### Core Components

The theme initializes these core components in `functions.php`:

- **BlockRegistry**: Automatic block discovery and registration
- **AssetManager**: Asset compilation and enqueuing
- **ThemeSetup**: Theme supports and pattern configuration
- **MediaHandler**: Media handling functionality
- **CLIBootstrap**: WP-CLI command registration

### Pattern Library

- Default WordPress core patterns are **hidden**
- Only custom patterns from `/patterns` directory are available
- Custom pattern category: "My Theme Patterns"

## Requirements

- WordPress 6.4+
- PHP 7.4+
- Composer (for autoloading)
- Node.js & npm (for asset building)