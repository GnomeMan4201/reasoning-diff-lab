# Verification Report — v2.0.1

## Verification identity

The release source of truth is the exact tip of `release/v2.0.1`. That commit must have a successful GitHub Actions `Verify` run before participant scheduling.

Workflow contract:

- Ubuntu GitHub-hosted runner;
- Node.js 20 selected by `actions/setup-node`;
- `npm run verify`;
- 65 tests;
- static build;
- built-artifact engine and pilot-safety smoke checks.

Do not infer readiness from this document alone. Confirm the green workflow check on the release commit and repeat `npm run verify` during the cold-machine rehearsal.

## Automated verification scope

| Check | Expected verified result |
|---|---|
| Production and safety-helper tests | 65 passed, 0 failed |
| Static build | `dist/` generated successfully |
| Built-artifact engine smoke | 6 + 10 + 6 events = 22 across the three pilot cases |
| Participant packets | evidence matches both frozen reference paths |
| Facilitator-note separation | participant packets contain no design notes |
| Separate training demo | independent demo case and paths present |
| Analyst/reviewer boundary controls | guard and handoff controls present in built UI |
| Path transfer invariants | role, case, question, and evidence matching tested |
| Baseline gate and reset | required controls and guard logic present |
| Suggested rejection logging | `unrelated` maps to `rejected` |
| Session export | paths, analyst timing, reviewer timing, match logs, and decisions included |
| Local server | loopback default, traversal rejection, no-store, and `nosniff` |

## Why v2.0.1 exists

v2.0.0's deterministic model and engine tests passed, but a hostile browser-workflow audit found defects that would have blocked or contaminated a human pilot:

- no participant evidence source for fresh analyst entry;
- participant browser loading facilitator-only case metadata;
- training demo capable of exposing selected pilot reference paths;
- analyst-to-reviewer blinding failure after path save;
- no actual reset control;
- no cross-device/browser path handoff;
- no enforced baseline-first sequence;
- incorrect acceptance logging for unrelated suggestions;
- incomplete reviewer timing and session export;
- broad default server binding;
- contradictory device instructions;
- an unrealistic universal 90-minute commitment.

v2.0.1 corrects those issues without changing the research questions, taxonomy, matcher weights, engine rules, event catalog, scoring thresholds, or analysis formulas.

## Human/browser rehearsal still required

Before scheduling, the actual setup must demonstrate all 16 steps in `PRE_PILOT_READINESS_AUDIT.md`, including:

- two simultaneous isolated analyst workspaces;
- participant packet rendering;
- separate demo training;
- path freeze, download, private transfer, and validated import;
- rejection of wrong-case or modified-evidence paths;
- analyst reviewer-screen lock;
- baseline packet and baseline-duration gate;
- report and session-log download/reopen;
- baseline and tool reviewer timings;
- accepted, rejected, and manual match logging;
- complete reset on every workspace.

Any failure blocks scheduling.

## Known limitations

- No automated headless-browser suite drives real clicks, file pickers, downloads, storage, or dialogs.
- Public reference paths require screening volunteers for prior exposure.
- One-computer sequential analyst entry is a protocol deviation.
- Event grades, missing divergences, questionnaires, interviews, and deviations are assembled outside the browser.
- Per-case data still requires manual merge into `experiment_result`.
- One analyst pair and one reviewer provide formative, non-generalizable evidence.
- No human data establishes usability, burden, usefulness, completeness, or anchoring resistance.

## Claim boundary

Verified after a green release workflow:

> The released v2.0.1 tree passes its automated model, engine, analysis, reporting, session-safety-helper, build, fixture-integrity, and built-artifact checks.

Not verified:

- improved investigations;
- useful or complete findings;
- accurate modeling of human thought;
- practical reviewer-bias control;
- real-participant usability;
- scientific validation of the hypothesis.

Those require the pilot and equal reporting of favorable, unfavorable, null, misleading, and missing results.
