# Security Policy

## Reporting a vulnerability

If you discover a security issue in `postcss-custom-supports`, please report it privately rather than opening a public issue.

Preferred channel: [GitHub's private vulnerability reporting](https://github.com/chloeburroughs/PostCSS-Custom-Supports/security/advisories/new).

Alternative: email `chloe@pfr.wtf` with subject line `[security] postcss-custom-supports`.

Please include:

- A description of the issue and its potential impact.
- Steps to reproduce, including a minimal CSS fixture if relevant.
- The affected version(s).
- Any suggested mitigation if you have one.

I aim to acknowledge reports within 7 days, confirm or rule out the issue within 14 days, and ship a fix within 30 days for confirmed vulnerabilities. Coordinated disclosure is welcome — once a fix is released, I'll credit the reporter in the changelog and security advisory unless you ask to remain anonymous.

## Scope

In scope:

- The plugin code in `index.js`.
- Build and publish workflows in `.github/workflows/` that could affect package integrity.

Out of scope:

- Issues in PostCSS itself (report to <https://github.com/postcss/postcss>).
- Issues in transitive dependencies — please report directly to the affected project, though I'm happy to be CC'd.

## Supported versions

Only the latest published minor version receives security updates. Pre-1.0 releases follow this rule strictly; once `1.0.0` ships, the policy will be reviewed.

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |
| < 0.1.0 | No        |
