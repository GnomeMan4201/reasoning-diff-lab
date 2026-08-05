# Changelog

## v2.0.1

Pre-pilot safety and measurement patch. This release does not change the reasoning taxonomy, matcher weights, engine rules, event catalog, scoring thresholds, analysis formulas, or the three pilot research questions.

Fixed:

- Participant UI now loads dedicated evidence packets instead of case files containing facilitator-only design notes.
- Added a separate non-pilot training demo; the demo control can no longer expose a selected pilot case's reference paths.
- Analysts are no longer redirected to reviewer materials after freezing a path.
- Reviewer and Results screens are locked for analyst roles.
- Added analyst path download and reviewer import for independent devices or browser profiles, with exact role, case, question, and evidence validation.
- Added a real local reset control for withdrawal and between-session cleanup.
- Enforced prose-only baseline completion and timing before tool-assisted reviewer matching.
- Session export now preserves raw paths and both baseline/tool reviewer timings.
- Suggested pairs marked `unrelated` are logged as `rejected`, not accepted.
- Manual and suggested match logs include pair provenance.
- Case changes clear case-specific browser state after an explicit warning.
- Local server binds to `127.0.0.1` by default, rejects traversal attempts, disables caching, and adds `nosniff`.

Added:

- Participant-safe `participant.json` packet for each pilot case.
- Separate `fixtures/demo` training case and paths.
- Pilot session safety helper module and seven tests, bringing the suite to 65 tests.
- Expanded built-artifact smoke checks for evidence integrity, demo separation, role guards, transfer controls, reset controls, and rejection logging.
- GitHub Actions verification workflow.
- Comprehensive pre-pilot readiness audit and updated operating documents.

## v2.0.0

Full rewrite in response to independent critical review. Not a superset of v1 in every file — several v1 files were removed or replaced rather than extended, per that review's instruction not to preserve weak choices out of politeness.

Added:
- Second entry mode (`src/prose_split.js`): rule-based, offline prose-to-units assist with mandatory explicit confirmation before any draft unit is comparable.
- Three review modes (`blind`, `suggested_hidden_score`, `suggested_visible_score`) with per-mode logging and an `anchoringComparison` analysis function.
- Expanded event catalog: 6 kinds in v1 → 11 kinds in v2, including `convergent_conclusion_different_path`, `divergent_conclusion_shared_evidence`, `dependency_divergence`, and `evidence_used_one_side_only`.
- `src/analysis.js`: every pilot-level statistic named in the spec, with explicit numerator/denominator/exclusion handling and no composite score.
- Three complete pilot cases (was: one), each with facilitator-only design notes, expected methodological risks, and a baseline-condition instruction.
- `PILOT_RUNBOOK.md`: consent language, withdrawal procedure, inclusion/exclusion criteria, counterbalancing, training, timing, and data-retention procedures.
- Full documentation set: `QUICKSTART.md`, `docs/DATA_DICTIONARY.md`, `docs/REVIEWER_GUIDE.md`, `docs/ANALYST_GUIDE.md`, `docs/LIMITATIONS.md`.
- CLI `analyze.js` for pilot-level statistics.
- CSV export.
- 58 automated tests (was: 10), including malformed-input, zero-denominator, cyclic-dependency, and golden fixture cases.

Changed:
- Terminology renamed throughout to avoid implying more certainty than the engine has: "unsupported reasoning" → "Undeclared Support Gap"; "equivalent unit" → "Candidate Match" / `same_position`; inferred contradiction language → "Reviewer-confirmed contradiction".
- `src/similarity.js` renamed to `src/matcher.js`.
- Ratio metrics return `{value, numerator, denominator, note}` instead of bare numbers.

## v1.0.0

Initial prototype: single synthetic case, 10 tests, CLI + web UI, six-kind event catalog, no pilot documentation beyond a short protocol sketch. Superseded by v2.0.0.
