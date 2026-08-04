# Verification Report (v2)

Generated in this environment. Sandbox clock read 2026-08-04 04:10 UTC at generation time;
noting this explicitly rather than silently normalizing it, since an unexplained date
mismatch was flagged as a minor provenance concern in the v1 review.

## Executed in this environment

| Check | Result | Evidence |
|---|---|---|
| Production-module tests | PASS | `npm test`: 58 passed, 0 failed, 0 skipped, 0 cancelled |
| Static build | PASS | `npm run build`: generated `dist/` mirroring `src/`, `web/`, `fixtures/` |
| Built-artifact smoke test | PASS | `node scripts/smoke.js` against `dist/`, not `src/`: case-01 → 6 events, case-02 → 10 events, case-03 → 6 events, 22 total |
| `npm run verify` (test + build + smoke, one command) | PASS | full output re-run and captured above |
| CLI comparison, all three cases | PASS | `cli/compare.js` produced `reports/case-0{1,2,3}-*.{md,json,csv}`; each case's Markdown includes its designed signature event kind (verified by grep against `### ` headers) |
| CLI analysis | PASS | `cli/analyze.js fixtures/sample-session.json` produced every statistic in `src/analysis.js`, correctly returning `null` for `suggested_visible_score` (no data logged in that mode in the sample file) |
| Web app syntax | PASS (syntax only) | `node --check web/app.js` — this parses the module but does not execute it; see "What is not claimed" |
| Dependency reproducibility | PASS | `package-lock.json` generated via `npm install --package-lock-only`; zero runtime or dev dependencies |
| Golden fixture coverage | PASS | Each of the three shipped cases has a dedicated golden test in `tests/engine.test.js` asserting its designed signature event (`convergent_conclusion_different_path` for case 1, `reviewer_confirmed_contradiction` + `divergent_conclusion_shared_evidence` for case 2, `undeclared_support_gap` + `reviewer_confirmed_contradiction` for case 3) |

## What is not claimed

- No claim that the research hypothesis is validated, refuted, or even meaningfully tested.
  Zero human sessions have been run. Every number in `fixtures/sample-session.json` is
  explicitly labeled synthetic and illustrative in that file itself.
- No claim that lexical candidate-matching establishes semantic equivalence.
- No claim that the tool determines truth, ranks analysts, or infers contradiction from
  wording — the engine's tests specifically assert the negative (contradiction is never
  inferred without an explicit reviewer relation).
- No claim that entry burden is actually low, or that the prose-assisted mode actually
  reduces it relative to guided entry. Both modes are implemented and logged; whether either
  is low-burden in practice is precisely what the pilot must measure.
- No claim that the web interface is usable in practice. It has been syntax-checked and
  manually exercised via the "Load a completed demo" path during development, but has not
  been driven end-to-end by an automated browser test, nor by anyone other than its author.
  This is labeled **"implemented but not automatically verified"** in
  `docs/DEVELOPER_HANDOFF.md`, not "verified."
- No claim that the three review modes actually neutralize or even reliably reveal reviewer
  anchoring. The counterbalanced design exists to test that; it has not yet been run.
- No claim that this is a production, multi-user, or persistent platform — it deliberately
  is not.

## Current status

The v2 package is technically executable and internally verified for its stated narrow
behavior, at a broader scope than v1 (58 tests vs. 10, three cases vs. one, 11 event kinds
vs. 6, plus a full pilot protocol, runbook, and analysis pipeline). The central open question
is unchanged from v1: empirical usefulness and empirical human-factors burden, neither of
which can be established by code review, static analysis, or a synthetic fixture, no matter
how thorough. That question requires the pilot described in `docs/EXPERIMENT_PROTOCOL.md`
and `PILOT_RUNBOOK.md` to actually be run.
