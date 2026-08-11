# Security Policy

## Reporting a vulnerability

Do **not** open a public issue for a suspected vulnerability that could expose participant data, imported reasoning paths, or private session artifacts.

Preferred reporting path:

1. Use **Security → Report a vulnerability** for this repository when GitHub private vulnerability reporting is available.
2. Otherwise email **badbanana@proton.me** with the subject `reasoning-diff-lab security report`.

Include the affected commit/version, reproduction steps, expected and observed behavior, impact, and any proposed mitigation. Do not attach real participant data when a synthetic fixture can reproduce the problem.

## Security- and privacy-relevant scope

Reports are especially useful for issues involving:

- imported path/file handling that permits unintended file access or script execution;
- browser storage or export behavior that leaks one analyst's private path to another role prematurely;
- reset/handoff failures that leave prior participant data accessible;
- local server binding outside the documented loopback-only default;
- malformed imported data bypassing role or pilot-safety invariants;
- generated reports containing data that should remain in private session logs;
- dependency/build issues with a meaningful exploit path.

The instrument is local-first, not hardened multi-user infrastructure. Exposing its local server to other hosts changes the threat model and is not a supported production deployment mode.

## Pilot data

Use synthetic/training material for security testing whenever possible. Real pilot exports, raw reasoning paths, questionnaires, and facilitator notes should be treated as research data and kept out of public issues, commits, and shared fixtures unless they have been intentionally sanitized for publication.

## Supported state

The current default branch and the explicitly frozen pilot release should be identified separately in reports. A security fix on `main` does not automatically imply that an older frozen pilot branch contains the same change.

## Disclosure

I aim to acknowledge reproducible reports within seven days. Validation and remediation timing depends on severity, reproducibility, and pilot state; no fixed remediation deadline is promised before triage.

Reporter credit is welcome unless anonymity is requested.
