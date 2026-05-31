'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const postcss = require('postcss');
const customSupports = require('./index.js');

async function run(input, opts) {
  return postcss([customSupports(opts)]).process(input, { from: undefined });
}

test('replaces (--name) with the defined condition', async () => {
  const { css } = await run(
    '@custom-supports --inert interactivity: inert;' +
    '@supports (--inert) { a { color: red } }'
  );
  assert.match(css, /@supports \(interactivity: inert\)/);
  assert.doesNotMatch(css, /\(--inert\)/);
});

test('removes @custom-supports declarations from output by default', async () => {
  const { css } = await run(
    '@custom-supports --inert interactivity: inert;' +
    'a { color: red }'
  );
  assert.doesNotMatch(css, /@custom-supports/);
});

test('preserves @custom-supports declarations when preserve: true', async () => {
  const { css } = await run(
    '@custom-supports --inert interactivity: inert;' +
    '@supports (--inert) { a { color: red } }',
    { preserve: true }
  );
  assert.match(css, /@custom-supports --inert/);
  assert.match(css, /@supports \(interactivity: inert\)/);
});

test('resolves references that appear before their definition', async () => {
  const { css } = await run(
    '@supports (--inert) { a { color: red } }' +
    '@custom-supports --inert interactivity: inert;'
  );
  assert.match(css, /@supports \(interactivity: inert\)/);
});

test('preserves the not keyword on negated queries', async () => {
  const { css } = await run(
    '@custom-supports --scroll animation-timeline: scroll();' +
    '@supports not (--scroll) { a { color: red } }'
  );
  assert.match(css, /@supports not \(animation-timeline: scroll\(\)\)/);
});

test('handles compound conditions with multiple references', async () => {
  const { css } = await run(
    '@custom-supports --inert interactivity: inert;' +
    '@custom-supports --scroll animation-timeline: scroll();' +
    '@supports (--inert) and (--scroll) { a { color: red } }'
  );
  assert.match(
    css,
    /@supports \(interactivity: inert\) and \(animation-timeline: scroll\(\)\)/
  );
});

test('rewrites nested @supports rules', async () => {
  const { css } = await run(
    '@custom-supports --outer display: grid;' +
    '@custom-supports --inner color: red;' +
    '@supports (--outer) { @supports (--inner) { a { color: red } } }'
  );
  assert.match(css, /@supports \(display: grid\)/);
  assert.match(css, /@supports \(color: red\)/);
});

test('handles condition values containing parentheses', async () => {
  const { css } = await run(
    '@custom-supports --attr x: attr(x type(*));' +
    '@supports (--attr) { a { color: red } }'
  );
  assert.match(css, /@supports \(x: attr\(x type\(\*\)\)\)/);
});

test('does not rewrite (--name) tokens nested inside function calls', async () => {
  // This is the bug fix: var(--my-color) must not match the (--my-color)
  // pattern even if --my-color is a defined custom-supports name.
  const { css } = await run(
    '@custom-supports --my-color color: red;' +
    '@supports (color: var(--my-color)) { a { color: red } }'
  );
  assert.match(css, /@supports \(color: var\(--my-color\)\)/);
});

test('passes through unchanged when no definitions are present', async () => {
  const input = '@supports (display: grid) { a { color: red } }';
  const { css } = await run(input);
  assert.equal(css.trim(), input.trim());
});

test('warns and leaves unknown (--name) references untouched', async () => {
  const result = await run('@supports (--undefined) { a { color: red } }');
  assert.match(result.css, /@supports \(--undefined\)/);
  const warnings = result.warnings();
  assert.equal(warnings.length, 1);
  assert.match(warnings[0].text, /Unknown @custom-supports reference: --undefined/);
});

test('warns on duplicate definitions and keeps the last one', async () => {
  const result = await run(
    '@custom-supports --x display: grid;' +
    '@custom-supports --x display: flex;' +
    '@supports (--x) { a { color: red } }'
  );
  assert.match(result.css, /@supports \(display: flex\)/);
  const warnings = result.warnings();
  assert.equal(warnings.length, 1);
  assert.match(warnings[0].text, /--x is redefined/);
});

test('warns on and removes malformed declarations', async () => {
  const result = await run(
    '@custom-supports --no-condition;' +
    'a { color: red }'
  );
  assert.doesNotMatch(result.css, /@custom-supports/);
  const warnings = result.warnings();
  assert.equal(warnings.length, 1);
  assert.match(warnings[0].text, /Invalid @custom-supports declaration/);
});

test('finds definitions nested inside @layer and @media', async () => {
  const { css } = await run(
    '@layer foo {' +
      '@media screen {' +
        '@custom-supports --inert interactivity: inert;' +
      '}' +
    '}' +
    '@supports (--inert) { a { color: red } }'
  );
  assert.match(css, /@supports \(interactivity: inert\)/);
});
