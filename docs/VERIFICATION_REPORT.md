# Verification Report — v2.0.1 Pilot-Safety Candidate

## Verification identity

- Repository: `GnomeMan4201/reasoning-diff-lab`
- Candidate branch: `fix/pilot-safety-preflight`
- Verified candidate commit before this report update: `cd1d6d9eabe33e5d0b31988487815ae3306cbfbb`
- GitHub Actions workflow: `Verify`
- Successful workflow run: `30974826697`
- Runtime selected by the workflow: Node.js `20.20.2`

The report commit itself must receive a new successful workflow run before the final `release/v2.0.1` branch is frozen.

## Automated result

| Check | Result | Evidence |
|---|---|---|
| Production and safety-helper tests | PASS | 65 passed, 0 failed, 0 skipped, 0 cancelled |
| Static build | PASS | `npm run build` generated `dist/` |
| Built-artifact engine smoke | PASS | case 1: 6 events; case 2: 10 events; case 3: 6 events; 22 total |
| Participant evidence packets | PASS | all three packets contain evidence matching both frozen reference paths |
| Design-note separation | PASS | participant packets omit facilitator design notes |
| Separate training demo | PASS | built artifact contains independent demo case and paths |
| Analyst/reviewer boundary controls | PASS at built-file invariant level | required role-guard and handoff controls are present |
| Path transfer controls | PASS at unit/invariant level | role, case, question, and evidence matching helpers tested |
| Baseline gate and reset controls | PASS at built-file invariant level | required controls and guard text present |
| Suggested rejection logging | PASS | `unrelated` maps to `rejected` in automated tests |
| Session export shape | PASS | includes raw paths, analyst timings, reviewer timings, match logs, and final decisions |
| Local server hardening | PASS by code review/build | defaults to `127.0.0.1`, rejects traversal, disables caching, adds `nosniff` |
| GitHub Actions | PASS | `npm run verify` completed successfully on Ubuntu with Node.js 20.20.2 |

## What changed from v2.0.0

The original deterministic engine tests passed, but a hostile browser-workflow audit found defects that would have blocked or contaminated a human pilot:

- no participant evidence source for fresh analyst entry;
- participant browser loading facilitator-only case metadata;
- a demo control capable of exposing selected pilot reference paths;
- analyst-to-reviewer blinding failure after path save;
- no actual reset control;
- no path handoff across devices or browser profiles;
- no enforced baseline-first sequence;
- incorrect acceptance logging for `unrelated` suggestions;
- incomplete reviewer timing and session export;
- broad default server binding;
- contradictory operating instructions and an unrealistic universal 90-minute commitment.

v2.0.1 corrects these as a patch-level safety and measurement release without changing the taxonomy, matcher weights, engine rules, event catalog, scoring thresholds, analysis formulas, or pilot questions.

## Human/browser checks still required

Automated verification does **not** replace the cold-machine rehearsal. Before scheduling participants, the actual host arrangement must demonstrate:

1. Node.js 20 or newer;
2. `npm run verify` passes locally;
3. the server opens on loopback;
4. participant packets render correctly;
5. separate demo training works;
6. analyst paths freeze and download;
7. correct paths import successfully;
8. wrong-case or modified-evidence paths are rejected;
9. analysts cannot enter reviewer/results screens;
10. baseline packet downloads;
11. Reviewer Matching remains locked until baseline duration is recorded;
12. report JSON, Markdown, CSV, and session-log downloads work and reopen;
13. reviewer timings contain baseline and tool conditions;
14. rejected and manual matches appear correctly in the session log;
15. reset removes prior work;
16. the exact two-analyst device/transfer arrangement preserves simultaneous exposure and isolation.

Any failure blocks scheduling.

## Known remaining limitations

- No automated headless-browser interaction suite drives real clicks, file pickers, downloads, local storage, and dialogs.
- Public reference paths require screening volunteers for prior exposure.
- A one-computer sequential analyst run is a protocol deviation because evidence exposure is not simultaneous.
- Manual supplements are still needed for event grades, missing divergences, questionnaires, interviews, and deviations.
- Per-case exports must still be merged into `experiment_result` manually.
- One analyst pair and one reviewer produce formative evidence only, not a powered generalizable study.
- No human data currently establishes usability, burden, usefulness, completeness, or resistance to reviewer anchoring.

## Claim boundary

The verified claim is:

> The v2.0.1 candidate passes its automated model, engine, analysis, reporting, session-safety-helper, build, and built-artifact checks against the included synthetic fixtures.

The verified claim is **not**:

- that the tool improves investigations;
- that its findings are useful or complete;
- that its taxonomy models human thought accurately;
- that reviewer anchoring is controlled in practice;
- that the interface is usable under real participant conditions;
- that the pilot has validated or refuted the hypothesis.

Those questions require the human pilot and honest reporting of unfavorable results.
