# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.1.4]: https://github.com/chloeburroughs/PostCSS-Custom-Supports/releases/tag/v0.1.4
[0.1.3]: https://github.com/chloeburroughs/PostCSS-Custom-Supports/releases/tag/v0.1.3
[0.1.0]: https://github.com/chloeburroughs/PostCSS-Custom-Supports/releases/tag/v0.1.0
