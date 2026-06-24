# postcss-custom-supports

[![CI](https://github.com/chloeburroughs/PostCSS-Custom-Supports/actions/workflows/ci.yml/badge.svg)](https://github.com/chloeburroughs/PostCSS-Custom-Supports/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/postcss-custom-supports.svg)](https://www.npmjs.com/package/postcss-custom-supports)
[![license](https://img.shields.io/npm/l/postcss-custom-supports.svg)](./LICENSE.md)

A [PostCSS](https://postcss.org/) plugin that brings the [`@custom-media`](https://www.w3.org/TR/mediaqueries-5/#custom-mq) authoring pattern to `@supports` queries. Define a feature-detection condition once, give it a `--name`, and reference it from any number of `@supports` rules.

```css
@custom-supports --inert interactivity: inert;
@custom-supports --scroll animation-timeline: scroll();
@custom-supports --attr x: attr(x type(*));

@supports (--inert) {
  [hidden-while-animating] { interactivity: inert; }
}

@supports not (--scroll) {
  /* IntersectionObserver fallback */
}

@supports (--attr) and (--inert) {
  /* combined */
}
```

becomes

```css
@supports (interactivity: inert) {
  [hidden-while-animating] { interactivity: inert; }
}

@supports not (animation-timeline: scroll()) {
  /* IntersectionObserver fallback */
}

@supports (x: attr(x type(*))) and (interactivity: inert) {
  /* combined */
}
```

## Why

Using `@supports` kind of sucks. The queries are verbose, brittle, and sometimes a little nonsensical. The [CSS-Tricks recommended query](https://css-tricks.com/almanac/functions/a/attr/) for typed `attr()` is `@supports (x: attr(x type(*))) {}`, which is borderline nonsensical until you actually break down the logic. It also breaks VS Code's CSS parser, so everything after that line gets flagged as invalid.

Enabling PostCSS parsing in VS Code makes the errors go away — but you're still writing the same complex, brittle query every time you need that gate. Progressive enhancement means `@supports` conditions aren't one-offs: the same feature check shows up once per component that uses it, repeated across your stylesheet. That's multiple places to update when a draft spec changes syntax mid-cycle, and multiple opportunities for a silent typo that breaks the fallback entirely.

Aliasing behind a stable name solves both problems at once. Define the condition once, reference it everywhere, update in one place. The same pattern [postcss-custom-media](https://www.npmjs.com/package/postcss-custom-media) uses for
breakpoints — just for `@supports`.

**TL;DR:** Get rid of parser errors, reuse complicated and verbose `@supports` queries.

## Install

```sh
npm install --save-dev postcss-custom-supports
```

## Usage

**CommonJS**

```js
const postcss = require('postcss');
const customSupports = require('postcss-custom-supports');

postcss([customSupports(/* options */)]).process(css);
```

**Vite** — add to `css.postcss` in `vite.config.js` / `vite.config.ts`:

```js
import { defineConfig } from 'vite';
import customSupports from 'postcss-custom-supports';

export default defineConfig({
  css: {
    postcss: {
      plugins: [customSupports(/* options */)],
    },
  },
});
```

**Tailwind CSS v3** — add to `postcss.config.mjs` alongside your other PostCSS plugins:

```js
import tailwindcss from 'tailwindcss';
import customSupports from 'postcss-custom-supports';

export default {
  plugins: [
    tailwindcss,
    customSupports(/* options */),
  ],
};
```

**Tailwind CSS v4 + Vite** — Tailwind ships as a Vite plugin in v4; add this plugin to `css.postcss` in `vite.config.js`:

```js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import customSupports from 'postcss-custom-supports';

export default defineConfig({
  plugins: [tailwindcss()],
  css: {
    postcss: {
      plugins: [customSupports(/* options */)],
    },
  },
});
```

**Tailwind CSS v4 + PostCSS** (non-Vite) — use `@tailwindcss/postcss` in `postcss.config.mjs`:

```js
import tailwindcss from '@tailwindcss/postcss';
import customSupports from 'postcss-custom-supports';

export default {
  plugins: [
    tailwindcss,
    customSupports(/* options */),
  ],
};
```

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `preserve` | `boolean` | `false` | Keep `@custom-supports` declarations in the output (useful for downstream tools that consume the source CSS). |

## Syntax

A declaration:

```
@custom-supports --<name> <condition>;
```

`<condition>` is any string that would be valid as a `@supports` condition. Two forms are supported:

- **Property declarations** — `property: value`. The plugin wraps these in parentheses when substituting, producing `(property: value)`.
- **Functional notations** — `selector(...)`, `at-rule(...)`, `font-tech(...)`, etc. These are self-delimiting and are substituted as-is, without extra parentheses.

```css
@custom-supports --grid display: grid;
@custom-supports --layer at-rule(@layer);
@custom-supports --has selector(:has(a));
```

A reference is the literal token `(--<name>)`, used anywhere a parenthesized supports condition is allowed:

```css
@supports (--name) { … }
@supports not (--name) { … }
@supports (--a) and (--b) { … }
```

The output form depends on the condition type:

```css
@supports (display: grid) { … }       /* property declaration */
@supports at-rule(@layer) { … }       /* functional notation */
@supports not selector(:has(a)) { … } /* functional notation */
```

References inside function calls (`var(--name)`, `attr(--name)`, etc.) are **not** rewritten, so it is safe to reference custom properties in supports conditions.

_Note: When we call a custom supports token, we wrap it in parentheses. This follows the structure of postcss-custom-media, but it also gives an easier visual indicator of the token, compared to without parentheses. It’s a taste thing, but it made sense to me._

## Warnings

The plugin emits PostCSS warnings (not errors) for:

- Malformed `@custom-supports` declarations (missing condition).
- Redefinition of a name (the last definition wins).
- References to undefined names (left untouched in the output).

## Why I made this

_Note: I created this plugin for a specific project because I was tired of remembering the advanced attributes @supports query and fighting VS Code's parser. I'm releasing it because I hope it’s helpful. It was built with Claude Opus 4.6._

## License

MIT
