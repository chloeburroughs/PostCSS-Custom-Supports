'use strict';

// Matches a single @custom-supports declaration:
//   @custom-supports --name <condition>;
// PostCSS strips the trailing semicolon and normalizes whitespace before
// handing us `rule.params`, so a single space between name and condition
// is all we need to require here.
const DEFINITION_RE = /^(--[\w-]+)\s+(.+)$/;

// Matches a (--name) reference inside an @supports condition. The negative
// lookbehind prevents accidental rewrites of identifiers like var(--foo) or
// attr(--bar), where the leading character before "(" is an ident-char.
const REFERENCE_RE = /(?<![\w-])\(--[\w-]+\)/g;

const creator = (opts = {}) => {
  const preserve = opts.preserve === true;

  return {
    postcssPlugin: 'postcss-custom-supports',
    Once(root, { result }) {
      const customs = new Map();

      root.walkAtRules('custom-supports', rule => {
        const match = rule.params.match(DEFINITION_RE);
        if (!match) {
          rule.warn(result, `Invalid @custom-supports declaration: "${rule.params}"`);
          if (!preserve) rule.remove();
          return;
        }

        const [, name, condition] = match;
        if (customs.has(name)) {
          rule.warn(result, `@custom-supports ${name} is redefined; the last definition wins`);
        }
        customs.set(name, condition.trim());

        if (!preserve) rule.remove();
      });

      root.walkAtRules('supports', rule => {
        rule.params = rule.params.replace(REFERENCE_RE, token => {
          const name = token.slice(1, -1);
          const value = customs.get(name);
          if (value === undefined) {
            rule.warn(result, `Unknown @custom-supports reference: ${name}`);
            return token;
          }
          return `(${value})`;
        });
      });
    },
  };
};

creator.postcss = true;

module.exports = creator;
