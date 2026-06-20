'use strict';

const valueParser = require('postcss-value-parser');

// Matches a single @custom-supports declaration:
//   @custom-supports --name <condition>;
// PostCSS strips the trailing semicolon and normalizes whitespace before
// handing us `rule.params`, so a single space between name and condition
// is all we need to require here.
const DEFINITION_RE = /^(--[\w-]+)\s+(.+)$/;

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
          'custom-supports'(rule, { result }) {
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
          // Recurse bottom-up so that inner @supports rules are rewritten
          // before the outer rule is cloned. If we used root.walkAtRules()
          // instead, replaceWith(clone) would cause the walker to descend into
          // the detached original rather than the clone, leaving inner
          // references unexpanded.
          const processContainer = container => {
            container.each(node => {
              if (node.nodes) processContainer(node);
              if (node.type !== 'atrule' || node.name !== 'supports') return;

              const parsed = valueParser(node.params);
              let changed = false;

              parsed.walk(valueNode => {
                // value-parser gives bare parentheses type 'function' with an
                // empty value string, which naturally excludes named functions
                // like var(--x) or attr(--x) — cleaner than the lookbehind
                // regex this replaces.
                if (valueNode.type !== 'function' || valueNode.value !== '') return;
                if (valueNode.nodes.length !== 1 || valueNode.nodes[0].type !== 'word') return;
                const name = valueNode.nodes[0].value;
                if (!/^--[\w-]+$/.test(name)) return;

                const condition = customs.get(name);
                if (condition === undefined) {
                  node.warn(result, `Unknown @custom-supports reference: ${name}`);
                  return false;
                }

                // Expand the condition into this paren node; stop descending
                // so we never re-process the freshly substituted nodes.
                valueNode.nodes = valueParser(condition).nodes;
                changed = true;
                return false;
              });

              if (changed) {
                // .clone() preserves the original node's source position so
                // PostCSS can emit accurate source maps for the rewritten rule.
                node.replaceWith(node.clone({ params: valueParser.stringify(parsed) }));
              }
            });
          };

          processContainer(root);
        },
      };
    },
  };
};

creator.postcss = true;

module.exports = creator;
