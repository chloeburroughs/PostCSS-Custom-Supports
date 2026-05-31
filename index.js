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
    // prepare() gives us per-process state isolation: a fresh Map per file.
    // Collection runs as a typed AtRule visitor (joins the main walk for free),
    // and replacement defers to OnceExit so all definitions — including ones
    // declared after their first reference — are resolved before rewriting.
    prepare() {
      const customs = new Map();

      return {
        AtRule: {
          'custom-supports': (rule, { result }) => {
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
          },
        },
        OnceExit(root, { result }) {
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
    },
  };
};

creator.postcss = true;

module.exports = creator;
