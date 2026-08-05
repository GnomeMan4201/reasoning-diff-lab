# Developer Handoff

## What this is

A deliberately small, local-first research instrument. It compares exactly two independently produced reasoning paths under human review. It does not determine truth, score analyst quality, or automate adjudication. It has zero runtime or development dependencies.

## Architecture

```text
src/
  model.js          — evidence, unit, path, and reviewer-decision invariants
  matcher.js        — lexical candidate proposals only
  engine.js         — deterministic divergence events
  prose_split.js    — fixed offline prose-to-draft assist
  analysis.js       — pilot statistics with explicit denominators
  report.js         — Markdown / CSV export
  pilot_session.js  — pure browser-session safety and export helpers
  index.js          — barrel export
cli/
  compare.js        — deterministic comparison and report generation
  analyze.js        — pilot-level statistics from a merged session file
web/
  index.html        — participant/reviewer workflow
  app.js            — local state, role guards, path handoff, timing, exports
  styles.css        — responsive accessible form layout
fixtures/
  cases/*/case.json        — facilitator-only metadata and design note
  cases/*/participant.json — participant-safe question and evidence packet
  cases/*/path-*.json      — public synthetic reference paths
  demo/                    — separate non-pilot training case and paths
tests/              — 65 tests against production modules
scripts/
  build.js           — copies src/web/fixtures into dist
  serve.js           — loopback-only local server by default
  smoke.js           — built-artifact engine and pilot-safety checks
docs/                — protocol, audit, runbooks, rubric, guides, data contracts
.github/workflows/    — Node 20 verification workflow
```

## Core design guarantees

- Reviewer decisions are authoritative; lexical similarity only suggests.
- Final matching is one-to-one.
- Contradiction is explicit and reviewer-confirmed, never inferred from wording.
- Assumptions are valid leaves; only inference/claim types are checked for undeclared support.
- Every event retains case, analyst, unit, decision, rule, and engine provenance.
- Ratio metrics return explicit numerator, denominator, value, and zero-denominator note.
- Analysis never collapses usefulness and burden into one composite score.
- Participant packets exclude facilitator design notes and reference answers.
- Analyst roles cannot open reviewer/results screens in the browser workflow.
- Baseline review occurs before structured review.
- Imported paths must match role, case, question, and frozen evidence exactly.

## v2.0.1 safety patch

A hostile pre-pilot review found browser and operating defects not covered by the original 58 engine/model/report tests:

- no participant evidence source for fresh analyst entry;
- demo loader exposed whichever pilot case was selected;
- Analyst B was sent directly to reviewer material after saving;
- no actual reset control despite the runbook requiring one;
- no private path transfer across devices/browser profiles;
- baseline ordering existed in prose but was not enforced;
- `unrelated` suggestions were logged as accepted;
- total reviewer time was absent from session export;
- the local server could listen beyond loopback by default.

v2.0.1 fixes those without changing matcher weights, taxonomy, engine rules, event kinds, scoring thresholds, analysis formulas, or research questions.

## Event catalog

The engine produces only these 11 kinds:

`unmatched_unit` · `undeclared_support_gap` · `reviewer_confirmed_contradiction` · `declared_role_divergence` · `divergent_evidence_basis` · `divergent_interpretation` · `confidence_divergence` · `dependency_divergence` · `convergent_conclusion_different_path` · `divergent_conclusion_shared_evidence` · `evidence_used_one_side_only`

Adding another kind requires an `ENGINE_VERSION` bump, tests, data-dictionary changes, reviewer-guide changes, and explicit protocol impact review.

## Verification

Run:

```bash
npm run verify
```

This executes:

1. 65 Node tests;
2. static build into `dist/`;
3. smoke tests against the built artifact;
4. participant-packet evidence integrity checks;
5. design-note leakage checks;
6. demo separation, role-guard, transfer-control, reset-control, baseline-gate, and rejection-logging checks.

GitHub Actions runs the same command on pushes to main, release branches, fix branches, and pull requests.

## Remaining gaps

- No automated headless-browser interaction suite. Pure session helpers and built-file safety invariants are automated, but actual clicks, file-picker behavior, downloads, and browser storage still require the cold-machine rehearsal.
- Event grades, missing divergences, questionnaires, interviews, and protocol deviations are captured outside the browser and manually assembled into `experiment_result`.
- No automated merge tool exists for all per-case logs and manual supplements.
- Public reference paths make naive-participant screening fragile. A later confirmatory study should use private or newly generated cases.
- No human usability or burden result exists.
- No accounts, database, real-time collaboration, encrypted shared storage, or remote service exists by design.

## Change discipline

Before the first pilot:

- fix only reproducible defects that block or contaminate the study;
- repair contradictory instructions;
- preserve the frozen questions, cases, thresholds, matcher, engine, and analysis rules;
- run CI after every patch;
- freeze a new patch release rather than silently moving an existing release branch;
- record any participant-session deviation instead of altering the instrument mid-session.

After the pilot, build v2.1 only from repeated or materially important evidence.

## Claim discipline

- **Implemented and automatically verified:** covered by tests or built-artifact smoke checks.
- **Implemented but browser-rehearsal required:** code exists; real browser/device interaction remains to be cold-tested.
- **Pilot-ready candidate:** technical and operating package is ready for final verification, not yet promoted.
- **Empirically unvalidated:** no human result supports usefulness or burden claims.
- **Contract only:** documented JSON shape without a full schema validator.
- **Deferred:** deliberately unbuilt until pilot evidence justifies it.

Nothing in this repository is labeled proven, validated, or solved.
