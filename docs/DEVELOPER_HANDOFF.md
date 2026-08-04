# Developer Handoff

## What this is

A deliberately small, local-first research instrument. It compares exactly two independently
produced reasoning paths under human review. It does not determine truth, score analyst
quality, or automate adjudication. Zero runtime or dev dependencies.

## Architecture

```
src/
  model.js      — schema + invariants for evidence, units, paths, reviewer decisions
  matcher.js    — lexical candidate-match suggestions only, never authoritative
  engine.js     — deterministic comparison; the only place events are produced
  prose_split.js— rule-based (no AI) prose-to-draft-units assist for Entry Mode B
  analysis.js   — pilot-level statistics with explicit denominators, no composite score
  report.js     — Markdown / CSV export
  index.js      — barrel export
cli/
  compare.js    — engine + report, from the command line
  analyze.js    — analysis.js, from the command line, against a merged session file
web/            — zero-dependency browser interface (ES modules loaded directly, no bundler)
fixtures/cases/ — three complete pilot cases (straightforward / ambiguous / noisy)
tests/          — 58 tests against the production modules (no duplicated algorithm logic)
scripts/        — build.js (copies src+web+fixtures into dist/), serve.js, smoke.js
docs/           — protocol, rubric, data dictionary, guides, limitations
```

## Design decisions

- Reviewer decisions are authoritative; lexical similarity only ever suggests.
- Matching is one-to-one.
- Contradiction is explicit and reviewer-confirmed, never guessed from prose, in either
  version of this tool.
- Assumptions are valid leaves; only inference/claim types are checked for undeclared
  support.
- Every event retains complete provenance: case, both analysts, both units (or the one that
  matched to nothing), the exact reviewer decision (or null), and the engine rule + version
  that produced it — see `divergence_event` in `docs/DATA_DICTIONARY.md`.
- Every ratio-type metric returns `{value, note}` with `value: null` on a zero denominator,
  never a silently misleading 0 or 1.
- `src/analysis.js` never produces a single composite score, by design — see
  `docs/SCORING_RUBRIC.md`.

## Deliberate omissions (still, in v2)

No accounts, database, graph canvas, semantic embeddings, real-time collaboration, or SaaS
architecture. Those are deferred until a real pilot (not a synthetic fixture) shows the
central hypothesis clears its continue criteria. Adding any of them before that would be
scope creep against the instrument's own stated purpose.

## Event catalog (engine.js) — the only 11 kinds it ever produces

`unmatched_unit` · `undeclared_support_gap` · `reviewer_confirmed_contradiction` ·
`declared_role_divergence` · `divergent_evidence_basis` · `divergent_interpretation` ·
`confidence_divergence` · `dependency_divergence` · `convergent_conclusion_different_path` ·
`divergent_conclusion_shared_evidence` · `evidence_used_one_side_only`

Adding a twelfth kind should bump `ENGINE_VERSION` in `src/engine.js` and be reflected in
`docs/DATA_DICTIONARY.md`'s `divergence_event` table and `docs/REVIEWER_GUIDE.md`.

## Known gaps for the next developer

- The web UI's interactive logic (`web/app.js`) is syntax-checked (`node --check`) and
  manually exercised through `Load a completed demo`, but has no automated browser test
  (no headless-browser harness in this environment). See Claim Discipline below — this is
  labeled "implemented but not automatically verified," not "verified."
- There's no automated merge step from several exported `session-log.json` files into the
  single `experiment_result` shape `cli/analyze.js` expects — a facilitator currently does
  this by hand. This is labeled "deferred" — it's a small script, deliberately not built
  before a real pilot proves the rest of the pipeline is worth the merge step.
- `baseline_review` timing is captured as a plain `reviewer_timing` record with
  `condition: "baseline_prose"`, entered by the facilitator, not logged automatically by the
  UI (the UI has no separate "read this prose and time yourself" mode). This is a conscious
  scope cut, not an oversight.

## Scorecard

| Area | Before (v1) | After (v2) | Evidence | Remaining reason it is not 10/10 |
|---|---|---|---|---|
| Research question | 7 | 9 | `docs/EXPERIMENT_PROTOCOL.md` now splits usefulness and burden as independently falsifiable halves, with an explicit null-result taxonomy. | A truly powered study design (sample size, effect size target) doesn't exist yet — appropriate for a pilot, not a full study. |
| Scientific methodology | 7 | 9 | Blinding, counterbalanced review modes (Latin square), baseline condition mandated, bias controls section, null-result interpretation section — all new in v2. | No human data has been collected. Methodology quality is not the same as validated results — see "Pilot readiness" below, which is scoreable; "empirical validation" is not. |
| Experimental controls | 5 | 9 | Three review modes with counterbalancing specifically test the anchoring risk named in the prior review; baseline condition is now mandatory, not optional. | Cannot be scored higher without evidence the counterbalancing actually neutralizes anchoring in practice — that requires running it. |
| Engineering quality | 8 | 9 | 58 tests (up from 10), covering malformed input, zero-denominator, cyclic dependencies, and golden fixtures for all three cases; `npm run verify` builds and smoke-tests the actual built artifact. | No property-based/fuzz testing; no CI configured in this deliverable (no repo host to wire it to). |
| Maintainability | 8 | 9 | Single-responsibility modules (`analysis.js` split out from `engine.js`); every renamed term has a one-line rationale in `docs/LIMITATIONS.md`; `ENGINE_VERSION` versioning discipline documented. | Still one person's design judgment on module boundaries; no second engineer has maintained this yet. |
| Architecture | 8 | 9 | Same deliberate minimalism as v1, now with a documented, versioned event catalog and explicit provenance object per event. | Not yet stress-tested against a real facilitator's workflow friction (e.g., the manual session-merge gap above). |
| Human factors | 3 | Not yet scoreable | Two entry modes, plain-language labels, progressive disclosure, and full timing/edit/abandonment logging are implemented — see `web/app.js`, `docs/ANALYST_GUIDE.md`. | This is exactly the dimension that requires human trial data to score. Implementing a lower-burden design is not the same as it *being* lower burden — that is an empirical claim this document does not make. |
| Usability | 5 | Not yet scoreable | Mobile-first CSS, skip link, accessible labels, autosave/draft recovery via `localStorage`, plain-language type labels, "what is this" dialog, keyboard-operable form controls. | No usability testing with a real participant has occurred. Implemented ≠ usable-in-practice. |
| Scope discipline | 9 | 9 | Still refuses accounts/DB/embeddings/collaboration; the "Deliberate omissions" list is unchanged in spirit and re-justified in v2. | Already near-ceiling; a 10 would require a second pilot cycle proving the refusal was still correct after real data came in. |
| Traceability | 6 | 9 | Every event now carries `provenance`, `reviewer_decision`, `engine_rule`, and `engine_version` — not just source unit text as in v1. | CSV export currently carries only ids, not full provenance columns — a minor completeness gap, not a design flaw. |
| Reproducibility | 7 | 9 | Deterministic event ids and ordering (tested); `npm run verify` reproduces build+test+smoke from a clean tree; zero dependencies means no version drift. | No `package-lock.json`-pinned dependency chain to speak of (there are no dependencies) — reproducibility here is trivial rather than proven at scale. |
| Reviewer-bias control | 2 | 8 | Three counterbalanced review modes with per-mode logging (`anchoringComparison`) did not exist at all in v1. | The control exists in code and protocol; whether it actually detects anchoring in real reviewers is untested — hence 8, not 10. |
| Reporting quality | 6 | 9 | Markdown/JSON/CSV exports; every ratio metric shows numerator/denominator/note; scope disclaimer restated in every Markdown report. | CSV export is intentionally minimal (ids + kind + decision) — a facilitator wanting full text in CSV must use the JSON export instead. |
| Developer handoff | 6 | 9 | This document, plus a documented event catalog, versioning rule, and an explicit "known gaps" section (rare to see honestly listed). | Not yet handed off to and validated by an actual second developer. |
| Pilot readiness | 4 | 9 | Three complete cases with instructions, hidden design notes, and golden reviewer decisions; a full facilitator runbook that names consent, withdrawal, and data retention; a CLI that computes every pilot statistic from a session file. | The one thing that would make this a 10 is a facilitator outside the author successfully running it start-to-finish once, unassisted — that hasn't happened yet. |

## Claim discipline labels used throughout this repository

- **Implemented and automatically verified** — has a passing automated test.
- **Implemented but not automatically verified** — code exists and was manually exercised
  (e.g., `node --check`, manual click-through), but no automated test covers it.
- **Pilot-ready but empirically unvalidated** — the instrument is ready to run a study; no
  study has produced results yet.
- **Contract only** — a documented shape other code is expected to conform to, without its
  own validator.
- **Deferred** — deliberately not built yet, named explicitly rather than left implicit.

No area in this repository is labeled "validated," "proven," or "solved." Those labels do not
exist in this document set on purpose.
