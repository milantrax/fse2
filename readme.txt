=== FSE2 ===
Contributors: milantrax
Requires at least: 6.6
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 0.1.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Tags: full-site-editing, block-patterns, block-styles, translation-ready, wide-blocks

A modern WordPress full-site editing theme with custom blocks.

== Description ==

FSE2 is a block theme. Global settings and styles are compiled into theme.json from
modular configuration under assets/src/config, and the same configuration is synced
into SCSS variables so the stylesheet and the block editor never drift apart.

== Installation ==

1. Upload the theme directory to wp-content/themes.
2. Activate the theme through Appearance > Themes.
3. Edit templates, parts and global styles under Appearance > Editor.

Building from source requires Node (see .nvmrc) and Composer:

    npm ci && composer install
    npm run build

== Copyright ==

FSE2 WordPress Theme, (C) 2026 Milan Trajkovic.
FSE2 is distributed under the terms of the GNU GPL v2 or later.

Cormorant Garamond, Copyright (c) Christian Thalmann
License: SIL Open Font License, 1.1, https://scripts.sil.org/OFL

Manrope, Copyright (c) Mikhail Sharanda
License: SIL Open Font License, 1.1, https://scripts.sil.org/OFL

== Changelog ==

= 0.1.0 =
* Initial release.
