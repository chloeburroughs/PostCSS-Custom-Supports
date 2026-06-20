# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-20

### Changed

- Replaced the regex-based `@supports` param rewriting with
  [`postcss-value-parser`](https://github.com/nickhiggs/postcss-value-parser)
  for correct CSS value tokenization. The structural parse naturally excludes
  named function calls (`var(--x)`, `attr(--x)`) and quoted strings containing
  `(--name)` patterns — cases the previous lookbehind regex could not guard
  against without additional heuristics.
- Rewrote the `OnceExit` replacement pass to use a bottom-up recursive
  `container.each()` traversal instead of `root.walkAtRules()`. This allows
  `node.replaceWith(node.clone({ params }))` to be used safely: inner
  `@supports` rules are fully expanded before the outer rule is cloned, so the
  clone always contains the final content. The `.clone()` call preserves the
  original node's `source` position for accurate PostCSS source map output.

### Added

- `postcss-value-parser` as a runtime dependency.
- `c8` as a dev dependency; `npm test` now reports statement, branch, function,
  and line coverage inline.
- Tests for quoted-string safety and `selector()` condition form.

### Documentation

- Expanded the Usage section with ESM setup examples for Vite
  (`vite.config.js`), Tailwind CSS v3 (`postcss.config.mjs`), Tailwind CSS v4
  with the Vite plugin (`@tailwindcss/vite`), and Tailwind CSS v4 with the
  standalone PostCSS plugin (`@tailwindcss/postcss`).

## [0.1.4] - 2026-05-31

### Changed

- Refactored to use a typed `AtRule['custom-supports']` visitor for collection
  and `OnceExit` for `@supports` rewriting, following the [PostCSS plugin
  guidelines][fast-scanning] on fast node scanning. Behavior is unchanged; all
  existing tests pass without modification.
- Moved per-process state into `prepare()` so the definition map is freshly
  created for each `process()` call rather than scoped to the `Once` closure.

### Documentation

- Added this changelog.

[fast-scanning]: https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#23-use-fast-nodes-scanning

## [0.1.3] - 2026-05-31

### Added

- `repository`, `author`, `bugs`, and `homepage` fields in `package.json`.
  These are required for npm provenance attestation verification and improve
  discoverability on the npm registry.
- `postcss` declared as a `devDependency` in addition to `peerDependency` so
  test setup is deterministic across npm, pnpm, and yarn.

### Infrastructure

- First release published through the GitHub Actions trusted-publisher
  workflow with Sigstore provenance attestation.

## [0.1.0] - 2026-05-30

### Added

- Initial release.
- `@custom-supports --name <condition>;` declaration syntax, mirroring
  `@custom-media`.
- `(--name)` token expansion inside `@supports` queries, including
  `@supports not (--name)` and compound `@supports (--a) and (--b)` forms.
- `preserve: true` option to retain `@custom-supports` declarations in the
  output for downstream tooling.
- PostCSS warnings emitted via `result.warn()` for malformed declarations,
  redefinitions, and unknown references.
- Negative-lookbehind guard preventing accidental rewrites of `(--name)`
  tokens nested inside function calls like `var(--name)` or `attr(--name)`.

[1.0.0]: https://github.com/chloeburroughs/PostCSS-Custom-Supports/releases/tag/v1.0.0
[0.1.4]: https://github.com/chloeburroughs/PostCSS-Custom-Supports/releases/tag/v0.1.4
[0.1.3]: https://github.com/chloeburroughs/PostCSS-Custom-Supports/releases/tag/v0.1.3
[0.1.0]: https://github.com/chloeburroughs/PostCSS-Custom-Supports/releases/tag/v0.1.0
