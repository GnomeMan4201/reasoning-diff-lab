# Changelog

## v2.0.0

Full rewrite in response to independent critical review. Not a superset of v1 in every file —
several v1 files were removed or replaced rather than extended, per that review's instruction
not to preserve weak choices out of politeness.

Added:
- Second entry mode (`src/prose_split.js`): rule-based, offline prose-to-units assist with
  mandatory explicit confirmation before any draft unit is comparable.
- Three review modes (`blind`, `suggested_hidden_score`, `suggested_visible_score`) with
  per-mode logging and an `anchoringComparison` analysis function.
- Expanded event catalog: 6 kinds in v1 → 11 kinds in v2, including
  `convergent_conclusion_different_path`, `divergent_conclusion_shared_evidence`,
  `dependency_divergence`, and `evidence_used_one_side_only`.
- `src/analysis.js`: every pilot-level statistic named in the spec, with explicit
  numerator/denominator/exclusion handling and no composite score.
- Three complete pilot cases (was: one), each with facilitator-only design notes, expected
  methodological risks, and a baseline-condition instruction.
- `PILOT_RUNBOOK.md`: consent language, withdrawal procedure, inclusion/exclusion criteria,
  counterbalancing (Latin square), training, timing, and data-retention procedures.
- Full documentation set: `QUICKSTART.md`, `docs/DATA_DICTIONARY.md`,
  `docs/REVIEWER_GUIDE.md`, `docs/ANALYST_GUIDE.md`, `docs/LIMITATIONS.md`.
- CLI `analyze.js` for pilot-level statistics.
- CSV export.
- 58 automated tests (was: 10), including malformed-input, zero-denominator, and cyclic-
  dependency cases, plus golden tests for all three shipped cases.

Changed:
- Terminology renamed throughout to avoid implying more certainty than the engine has (see
  `docs/LIMITATIONS.md` for the full table): "unsupported reasoning" →
  "Undeclared Support Gap"; "equivalent unit" → "Candidate Match" / `same_position`;
  inferred contradiction language → "Reviewer-confirmed contradiction" (the underlying
  behavior — never inferring contradiction from wording — is unchanged from v1; only the
  label changed, to make the guarantee explicit).
- `src/similarity.js` renamed to `src/matcher.js` to match the "Candidate Match" terminology.
- `metrics()` ratio fields now return `{value, numerator, denominator, note}` instead of a
  bare number, so zero-denominator cases are never silently reported as 0 or 1.

Removed:
- Nothing from v1's core guarantees was weakened. The one-to-one matching constraint,
  reviewer authority over all decisions, and refusal to infer contradiction from wording are
  all unchanged and still enforced in `src/model.js`.

## v1.0.0

Initial prototype: single synthetic case, 10 tests, CLI + web UI, six-kind event catalog,
no pilot documentation beyond a short protocol sketch. Superseded by v2.0.0 above.
