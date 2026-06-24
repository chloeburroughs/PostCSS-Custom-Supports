## General

```css
@custom-supports --inert interactivity: inert;
@custom-supports --advanced-attr x: attr(x type(*));
```

```css
/* --inert: gate interactive enhancements that require inert support */
.modal-backdrop {
  display: block;
}

@supports (--inert) {
  .modal-backdrop[data-state="closed"] {
    interactivity: inert;
  }
}
```

```css
.modal-backdrop {
  display: block;
}

@supports (interactivity: inert) {
  .modal-backdrop[data-state="closed"] {
    interactivity: inert;
  }
}
```

```css
/* --advanced-attr: gate CSS that reads typed data attributes */
.progress {
  width: 50%;
}

@supports (--advanced-attr) {
  .progress {
    width: attr(data-value type(<percentage>));
  }
}
```

```css
.progress {
  width: 50%;
}

@supports (x: attr(x type(*))) {
  .progress {
    width: attr(data-value type(<percentage>));
  }
}
```

---

## Font Features

```css
@custom-supports --font-alternates font-variant-alternates: swash(custom-ident);
@custom-supports --font-palette font-palette: normal;
@custom-supports --font-variation font-variation-settings: normal;
```

```css
/* --font-alternates: enhance display headings with swash alternates */
.display-heading {
  font-variant-alternates: normal;
}

@supports (--font-alternates) {
  .display-heading {
    font-variant-alternates: swash(fancy);
  }
}
```

```css
.display-heading {
  font-variant-alternates: normal;
}

@supports (font-variant-alternates: swash(custom-ident)) {
  .display-heading {
    font-variant-alternates: swash(fancy);
  }
}
```

```css
/* --font-palette: use brand palette in color fonts */
@font-palette-values --brand {
  font-family: "Bungee Color";
  override-colors: 0 oklch(55% 0.2 250);
}

@supports (--font-palette) {
  .logo {
    font-palette: --brand;
  }
}
```

```css
@font-palette-values --brand {
  font-family: "Bungee Color";
  override-colors: 0 oklch(55% 0.2 250);
}

@supports (font-palette: normal) {
  .logo {
    font-palette: --brand;
  }
}
```

---

## Anchors & Positioning

```css
@custom-supports --anchor-positioning anchor-name: --x;
@custom-supports --position-try position-try-fallbacks: flip-block;
```

```css
/* --anchor-positioning: attach tooltip to trigger without JS */
.tooltip {
  position: absolute;
  top: 0;
}

@supports (--anchor-positioning) {
  .trigger {
    anchor-name: --trigger;
  }

  .tooltip {
    position: absolute;
    position-anchor: --trigger;
    top: anchor(bottom);
    left: anchor(center);
  }
}
```

```css
.tooltip {
  position: absolute;
  top: 0;
}

@supports (anchor-name: --x) {
  .trigger {
    anchor-name: --trigger;
  }

  .tooltip {
    position: absolute;
    position-anchor: --trigger;
    top: anchor(bottom);
    left: anchor(center);
  }
}
```

```css
/* --position-try: add overflow fallbacks where supported */
@supports (--position-try) {
  .tooltip {
    position-try-fallbacks: flip-block, flip-inline;
  }
}
```

```css
@supports (position-try-fallbacks: flip-block) {
  .tooltip {
    position-try-fallbacks: flip-block, flip-inline;
  }
}
```

---

## Color

```css
@custom-supports --oklch color: oklch(0% 0 0);
@custom-supports --color-mix color: color-mix(in oklch, red, blue);
@custom-supports --wide-gamut color: color(display-p3 0 0 0);
```

```css
/* --oklch: use perceptually uniform brand colors */
.button {
  background: #c00;
}

@supports (--oklch) {
  .button {
    background: oklch(50% 0.2 29);
  }
}
```

```css
.button {
  background: #c00;
}

@supports (color: oklch(0% 0 0)) {
  .button {
    background: oklch(50% 0.2 29);
  }
}
```

```css
/* --color-mix: tint a surface relative to a brand token */
.card {
  background: var(--color-surface);
}

@supports (--color-mix) {
  .card {
    background: color-mix(in oklch, var(--color-brand) 10%, var(--color-surface));
  }
}
```

```css
.card {
  background: var(--color-surface);
}

@supports (color: color-mix(in oklch, red, blue)) {
  .card {
    background: color-mix(in oklch, var(--color-brand) 10%, var(--color-surface));
  }
}
```

```css
/* --wide-gamut: vivid display-p3 accents on capable screens */
.hero-image {
  border: 2px solid hsl(160 80% 40%);
}

@supports (--wide-gamut) {
  .hero-image {
    border-color: color(display-p3 0 0.8 0.4);
  }
}
```

```css
.hero-image {
  border: 2px solid hsl(160 80% 40%);
}

@supports (color: color(display-p3 0 0 0)) {
  .hero-image {
    border-color: color(display-p3 0 0.8 0.4);
  }
}
```

---

## Containers

```css
@custom-supports --container-query container-type: size;
@custom-supports --container-units width: 1cqi;
```

```css
/* --container-query: responsive card without a media query */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  grid-template-rows: auto 1fr;
}

@supports (--container-query) {
  @container card (inline-size > 40ch) {
    .card {
      grid-template-rows: unset;
      grid-template-columns: auto 1fr;
    }
  }
}
```

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

.card {
  display: grid;
  grid-template-rows: auto 1fr;
}

@supports (container-type: size) {
  @container card (inline-size > 40ch) {
    .card {
      grid-template-rows: unset;
      grid-template-columns: auto 1fr;
    }
  }
}
```

---

## Transitions & Animations

```css
@custom-supports --view-transition view-transition-name: custom-ident;
@custom-supports --scroll-animation animation-timeline: scroll();
@custom-supports --scroll-timeline scroll-timeline-name: --x;
```

```css
/* --view-transition: enhance page navigation with a fade */
@supports (--view-transition) {
  ::view-transition-old(root) {
    animation: fade-out 120ms ease-out;
  }

  ::view-transition-new(root) {
    animation: fade-in 120ms ease-in;
  }
}
```

```css
@supports (view-transition-name: custom-ident) {
  ::view-transition-old(root) {
    animation: fade-out 120ms ease-out;
  }

  ::view-transition-new(root) {
    animation: fade-in 120ms ease-in;
  }
}
```

```css
/* --scroll-animation: animate a reading progress indicator */
.progress-bar {
  display: none;
}

@supports (--scroll-animation) {
  .progress-bar {
    display: block;
    transform-origin: left;
    animation: grow linear;
    animation-timeline: scroll(root);
  }
}
```

```css
.progress-bar {
  display: none;
}

@supports (animation-timeline: scroll()) {
  .progress-bar {
    display: block;
    transform-origin: left;
    animation: grow linear;
    animation-timeline: scroll(root);
  }
}
```

```css
/* --scroll-timeline: drive a sticky header fade with a named timeline */
.site-header {
  opacity: 1;
}

@supports (--scroll-timeline) {
  html {
    scroll-timeline-name: --page;
  }

  .site-header {
    animation: header-fade linear both;
    animation-timeline: --page;
    animation-range: 0 200px;
  }
}
```

```css
.site-header {
  opacity: 1;
}

@supports (scroll-timeline-name: --x) {
  html {
    scroll-timeline-name: --page;
  }

  .site-header {
    animation: header-fade linear both;
    animation-timeline: --page;
    animation-range: 0 200px;
  }
}
```

## Grid

```css
@custom-supports --subgrid grid-template-columns: subgrid;
@custom-supports --masonry grid-template-rows: masonry;
```

```css
/* --subgrid: align labels and inputs across a nested form grid */
.form {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1rem;
}

.form-row {
  display: contents;
}

@supports (--subgrid) {
  .form-row {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }
}
```

```css
.form {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1rem;
}

.form-row {
  display: contents;
}

@supports (grid-template-columns: subgrid) {
  .form-row {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }
}
```

```css
/* --masonry: Pinterest-style card layout where supported */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

@supports (--masonry) {
  .gallery {
    grid-template-rows: masonry;
  }
}
```

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

@supports (grid-template-rows: masonry) {
  .gallery {
    grid-template-rows: masonry;
  }
}
```

## AtRules and Selectors

```css
@custom-supports --has selector(:has(+ *));
@custom-supports --scope selector(:scope);
@custom-supports --cascade-layers at-rule(@layer);
@custom-supports --nth-of-i selector(:nth-child(1 of .class));
```

```css
/* --has: highlight a field group when any input inside is invalid */
.field-group {
  border: 1px solid transparent;
}

@supports (--has) {
  .field-group:has(input:invalid) {
    border-color: red;
  }
}
```

```css
.field-group {
  border: 1px solid transparent;
}

@supports selector(:has(+ *)) {
  .field-group:has(input:invalid) {
    border-color: red;
  }
}
```

```css
/* --scope: contain component styles to their subtree */
@supports (--scope) {
  @scope (.card) {
    img {
      border-radius: 4px;
    }

    h2 {
      font-size: 1.25rem;
    }
  }
}
```

```css
@supports selector(:scope) {
  @scope (.card) {
    img {
      border-radius: 4px;
    }

    h2 {
      font-size: 1.25rem;
    }
  }
}
```

```css
/* --cascade-layers: opt in to a layered architecture */
@supports (--cascade-layers) {
  @layer reset, base, components, utilities;
}
```

```css
@supports at-rule(@layer) {
  @layer reset, base, components, utilities;
}
```

```css
/* --nth-of-i: style the first .featured card in a list */
.card {
  opacity: 0.8;
}

@supports (--nth-of-i) {
  .card:nth-child(1 of .featured) {
    opacity: 1;
    outline: 2px solid var(--color-brand);
  }
}
```

```css
.card {
  opacity: 0.8;
}

@supports selector(:nth-child(1 of .class)) {
  .card:nth-child(1 of .featured) {
    opacity: 1;
    outline: 2px solid var(--color-brand);
  }
}
```
