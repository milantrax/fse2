# Coding & Review Guidelines

## WordPress Best Practices

- You're a WordPress expert.
- Use modern WordPress development best practices.
- Assume code will run in a custom theme or plugin.
- Use proper hooks (`add_action`, `add_filter`), follow WordPress Coding Standards, and **escape output for security** (`esc_html`, `esc_attr`, etc.).
- Always use localization functions (`__()`, `_e()`) for user-facing text.
- Prefer `wp_enqueue_script` and `wp_enqueue_style` for assets.
- Avoid deprecated functions.
- When registering custom post types or taxonomies, **include labels and public UI options**.
- If using AJAX, support both logged-in and non-logged-in users.
- Comment code clearly. Only output production-ready code.

## JavaScript Coding Standards

- Use Airbnb coding standard.
- Always write ES6 JavaScript as **class and methods**, never as function.
- Use `async/await` for asynchronous code.
- Use arrow functions for anonymous functions.
- Use `const` and `let` instead of `var`.
- Use template literals instead of string concatenation.
- Use destructuring assignment for objects and arrays.
- Use spread operator for arrays and objects.
- Use default parameters for functions.
- Use rest parameters for functions.
- Use object shorthand syntax for objects.
- Start class with `constructor` method which accepts parameters or HTML element.
- Always check in `_src/scripts/helpers/*.js` for existing helpers before creating new ones.
- Always check in current folder scripts and `/scripts/*.js` for existing scripts before creating new ones.

## CSS/SCSS Coding Standards

- Generate SCSS code with CSS custom properties and mixins.
- Avoid SCSS/SASS variables unless absolutely necessary.
- Use SCSS/SASS mixins for reusable styles.
- Use SCSS/SASS functions for reusable calculations.
- Use SCSS/SASS maps for reusable values.
- Use SCSS/SASS loops for repetitive styles.
- Use SCSS/SASS conditionals for conditional styles.
- Use SCSS/SASS placeholders for reusable selectors.
- Use SCSS/SASS extends for reusable styles.
- Always check in `_src/styles/1-tools/mixins/*.scss`, `_src/styles/1-tools/functions/*.scss`, `_src/styles/3-pattern-mixins/*.scss` for existing mixins and functions before creating new ones.
- Always check in `_src/styles/2-variables/*.scss` for existing variables before creating new ones.

## PHP Coding Standards

- Follow WordPress coding standard **without extra spaces after opening and before closing parenthesis**.
- Always add space after PHP keyword before opening parenthesis, and space after closing parenthesis.
- Always use `{` and `}` to open and close PHP statements.
- Use OOP methodology, namespaces, PSR-4 with autoloader to structure code PHP.
- Use camelCase for method, functions and variable names.
- Use PascalCase for class names.
- Use kebab-case for file names.
- Use underscore for field names.

## Gutenberg & Block Development (WordPress Scripts)

- All block development must follow the official Gutenberg architecture.

### Tooling & Build System

- Always use `@wordpress/scripts` for building blocks.
- Do not introduce custom Webpack, Vite, or Rollup unless explicitly requested.
- Use:
    - npm run start
    - npm run build
- Treat `block.json` as the single source of truth for block metadata.

### Required Block Structure

Every block must follow this structure:
/blocks/{block-name}/
├─ block.json
├─ index.js
├─ edit.js
├─ save.js
├─ style.scss
├─ editor.scss
└─ render.php
`render.php` is only used for dynamic blocks.

### block.json Rules

- All blocks must be registered via `block.json`.
- Use `supports`, `attributes`, `styles`, and `variations` where applicable.
- Use `"render": "file:./render.php"` for dynamic blocks.
- Do not register blocks manually with `registerBlockType()` unless PHP rendering is required.

### React & Gutenberg Standards

- Always use:
  - `@wordpress/block-editor`
  - `@wordpress/components`
  - `@wordpress/data`
  - `@wordpress/i18n`
- Do not use React DOM directly.
- Do not use third-party UI libraries.
- Use WordPress UI components only.

### Edit vs Save

- `edit.js` controls the editor experience only.
- `save.js` must return pure static markup.
- For dynamic blocks:
  - `save.js` must return `null`
  - Rendering must happen in `render.php`

### Data Flow

- Always use `useBlockProps()` and `useInnerBlocksProps()`.
- Do not hardcode class names unless they follow BEM or WordPress conventions.

### Styling Rules

- `editor.scss` is editor-only.
- `style.scss` is frontend-only.
- Never mix editor and frontend styles.
- Avoid inline styles unless absolutely necessary.

### Internationalization

- All strings must use:
import { __ } from '@wordpress/i18n';

markdown
Copy code
- Do not hardcode UI text.

### PHP for Blocks

- Dynamic blocks must use `render.php`.
- Always escape output using `esc_html`, `wp_kses_post`, or `esc_attr`.
- Always validate attributes before use.

### No Legacy APIs

- Do not use:
- `wp.blocks.registerBlockType`
- `wp.editor`
- `wp.element.createElement`
- Always use ESNext with module imports.

### Asset Loading

- Never enqueue block JavaScript or CSS manually.
- Let `block.json` handle all assets.

### InnerBlocks Rules

- Use `template` and `allowedBlocks` for structure.
- Lock structure when needed using:
templateLock="all"

### Reusable Patterns

- Prefer block styles, block variations, or block patterns over creating new blocks when possible.

### Performance

- Prefer static blocks whenever possible.
- Use dynamic blocks only when content depends on runtime data.

## The Art of Minimal Intervention

- When approached with a request to modify code, remember that true wisdom lies not in showcasing all you can build, but in understanding what shouldn't be touched.

**Principles:**
- **Honor the Existing System:**
  Understand its place in the larger architecture before modifying.
  *"The mark of wisdom is not how much you add, but how precisely you can target what needs changing."*

## Seek Minimal Viable Intervention

- For every requested change, ask:
  - What is the smallest change that would fulfill the requirement?
  - Which parts of the system can remain untouched?
  - How can I preserve existing patterns while addressing the need?

## Preserve Working Systems

- Working code has value beyond its visible functionality.
- Default to surgical precision.
  *"Moving a doorknob doesn't require rebuilding the house."*

## Three-Tier Approach to Changes

- First offer: Minimal, focused change that addresses the request.
- If needed: Moderate refactoring in the immediate area.
- Only when explicitly requested: Comprehensive restructuring.

## Ask for Scope Clarification

- If unsure whether the request implies a broader change, **ask for clarification** rather than assuming the broadest interpretation.
  - *"I can make this specific change to line 42 as requested. Would you also like me to update the related functions, or should I focus solely on this particular line?"*

## Less is Often More

- A single, precise change demonstrates deeper understanding than a complete rewrite.
  *"To move a mountain, you need not carry away the whole mountain; you need only change its location."*

## Document the Path Not Taken

- Note potential improvements beyond the scope without implementing them.
  - _"I've made the requested change to function X. Note that functions Y and Z use similar patterns and might benefit from similar updates in the future if needed."_
- In your restraint, reveal your wisdom. In your precision, demonstrate your mastery.

## Embrace the Power of Reversion

- Be prepared to revert changes if the desired outcome isn't achieved.
  *"In the world of code, sometimes the best change is no change at all."*

## Clarity and Readability

- Use meaningful variable and function names.
- Keep functions short and focused on a single responsibility.
- Format code consistently according to established style guides (e.g., PEP 8 for Python, Prettier for JavaScript/TypeScript).

## Consistency

- Follow existing patterns and conventions within the project.
- Use the same libraries and frameworks unless there's a strong reason to introduce new ones.

## Robust Error Handling

- Anticipate potential failure points (e.g., network requests, file I/O, invalid input).
- Use appropriate error handling mechanisms (try-catch blocks, error codes, specific exception types).
- Provide informative error messages.

## Security

- Sanitize user inputs to prevent injection attacks (SQL, XSS, etc.).
- Avoid hardcoding sensitive information like API keys or passwords. Use environment variables or config management tools.
- Be mindful of vulnerabilities when using external libraries.

## Testable Code

- Design functions and modules with testability in mind (e.g., dependency injection).
- Aim for high test coverage for critical components.

## Documentation

- Include comments to explain complex logic, assumptions, or non-obvious code sections.
- Use standard documentation formats (e.g., JSDoc, DocStrings) for functions, classes, and modules.

## Performance

- Identify and address performance bottlenecks (e.g., inefficient algorithms, excessive memory usage).
- Use profiling tools to measure performance and identify areas for improvement.

## Cross-Platform Compatibility

- Test code on different platforms (Windows, macOS, Linux) if applicable.
- Use platform-independent libraries and APIs when possible.

## Version Control

- Commit changes frequently with clear, descriptive messages.
- Use branches for new features or bug fixes.

## Change Management

- **Never edit parts of the code which the user has updated during the process.**
- Always work with the latest version of the code.