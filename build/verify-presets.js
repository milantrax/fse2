#!/usr/bin/env node

/**
 * Preset Reference Verifier
 *
 * Cross-checks every preset slug referenced from templates, parts, patterns and the
 * theme.json styles themselves against the presets theme.json actually defines.
 *
 * theme.json is generated from assets/src/config/**, so a slug can be renamed in one
 * place and left dangling in another. WordPress fails silently when that happens: the
 * reference resolves to an undeclared custom property and the declaration is dropped,
 * so spacing collapses or a hover state stops working with nothing in any log.
 *
 * Usage: node build/verify-presets.js
 */

const fs = require('fs');
const path = require('path');

const themeRoot = path.join(__dirname, '..');
const themeJsonPath = path.join(themeRoot, 'theme.json');
const scanDirs = ['templates', 'parts', 'patterns'];

const PRESET_GROUPS = [
    { key: 'color', settings: (s) => s.color?.palette, css: 'color' },
    { key: 'spacing', settings: (s) => s.spacing?.spacingSizes, css: 'spacing' },
    { key: 'font-size', settings: (s) => s.typography?.fontSizes, css: 'font-size' },
    { key: 'font-family', settings: (s) => s.typography?.fontFamilies, css: 'font-family' },
    { key: 'shadow', settings: (s) => s.shadow?.presets, css: 'shadow' },
];

/**
 * Mirror of WordPress's _wp_to_kebab_case(), which is applied to preset slugs
 * before they become CSS custom properties (so `h1` becomes `h-1`).
 */
const toKebabCase = (slug) => slug
    .replace(/(?<=[a-z])(?=[A-Z])/g, '-')
    .replace(/(?<=[A-Z])(?=[A-Z][a-z])/g, '-')
    .replace(/(?<=[0-9])(?=[a-z][A-Z])/g, '-')
    .replace(/(?<=[a-zA-Z])(?=[0-9])/g, '-')
    .toLowerCase();

const collectFiles = (dir, acc = []) => {
    const full = path.join(themeRoot, dir);
    if (!fs.existsSync(full)) {
        return acc;
    }
    for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
        const rel = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectFiles(rel, acc);
        } else if (/\.(html|php|json)$/.test(entry.name)) {
            acc.push(rel);
        }
    }
    return acc;
};

const verify = () => {
    if (!fs.existsSync(themeJsonPath)) {
        console.error('[ERROR] theme.json not found. Run `npm run build:theme-json` first.');
        process.exit(1);
    }

    const themeJson = JSON.parse(fs.readFileSync(themeJsonPath, 'utf-8'));
    const settings = themeJson.settings || {};

    const defined = {};
    PRESET_GROUPS.forEach((group) => {
        const presets = group.settings(settings) || [];
        defined[group.css] = new Set(presets.map((p) => toKebabCase(p.slug)));
    });

    const files = scanDirs.flatMap((dir) => collectFiles(dir));
    files.push('theme.json');

    const problems = [];

    files.forEach((relPath) => {
        const content = fs.readFileSync(path.join(themeRoot, relPath), 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            // Block-markup form: var:preset|spacing|m
            for (const match of line.matchAll(/var:preset\|([a-z-]+)\|([a-zA-Z0-9_-]+)/g)) {
                const [, group, slug] = match;
                if (defined[group] && !defined[group].has(toKebabCase(slug))) {
                    problems.push({ relPath, line: index + 1, group, slug });
                }
            }
            // CSS custom property form: var(--wp--preset--spacing--m)
            for (const match of line.matchAll(/--wp--preset--([a-z-]+?)--([a-zA-Z0-9_-]+)/g)) {
                const [, group, slug] = match;
                if (defined[group] && !defined[group].has(toKebabCase(slug))) {
                    problems.push({ relPath, line: index + 1, group, slug });
                }
            }
        });
    });

    if (problems.length === 0) {
        const summary = PRESET_GROUPS
            .map((g) => `${defined[g.css].size} ${g.css}`)
            .join(', ');
        console.log(`[OK] All preset references resolve (${summary}).\n`);
        return;
    }

    console.error(`[FAIL] ${problems.length} reference(s) to presets theme.json does not define:\n`);

    const seen = new Set();
    problems.forEach(({ relPath, line, group, slug }) => {
        const key = `${relPath}:${line}:${group}:${slug}`;
        if (seen.has(key)) {
            return;
        }
        seen.add(key);
        const available = [...defined[group]].join(', ');
        console.error(`  ${relPath}:${line}`);
        console.error(`    unknown ${group} preset "${slug}"`);
        console.error(`    defined: ${available}\n`);
    });

    process.exit(1);
};

try {
    verify();
} catch (error) {
    console.error('[ERROR] Error verifying presets:', error.message);
    process.exit(1);
}
