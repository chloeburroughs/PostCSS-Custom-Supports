# postcss-custom-supports

_Note: I created this plugin for a specific project because I was tired of remembering the advanced attributes @supports query and fighting VS Code's parser. I'm releasing it because I hope it’s helpful. It was built with Claude Opus 4.6._

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

Real-world `@supports` conditions are often verbose (`x: attr(x type(*))`), brittle to type, and visually noisy when repeated across a stylesheet. They also confuse some editor parsers when the value uses bleeding-edge syntax. Aliasing them behind a stable `--name` mirrors how `@custom-media` keeps breakpoints readable.

## Install

```sh
npm install --save-dev postcss-custom-supports
```

## Usage

```js
const postcss = require('postcss');
const customSupports = require('postcss-custom-supports');

postcss([customSupports(/* options */)]).process(css);
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

`<condition>` is any string that would be valid inside the parentheses of a normal `@supports` query — typically `property: value`, but also `selector(...)`, `font-tech(...)`, etc.

A reference is the literal token `(--<name>)`, used anywhere a parenthesized supports condition is allowed:

```css
@supports (--name) { … }
@supports not (--name) { … }
@supports (--a) and (--b) { … }
```

References inside function calls (`var(--name)`, `attr(--name)`, etc.) are **not** rewritten, so it is safe to reference custom properties in supports conditions.

## Warnings

The plugin emits PostCSS warnings (not errors) for:

- Malformed `@custom-supports` declarations (missing condition).
- Redefinition of a name (the last definition wins).
- References to undefined names (left untouched in the output).

## License

MIT
