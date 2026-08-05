# Pre-Pilot Readiness Audit

This is the hostile go/no-go review for the first Reasoning Diff Lab human pilot. It separates internal implementation verification, operational readiness, and empirical validity.

## Current judgment

- **v2.0.0 must not be used for participants.** Its deterministic engine passed tests, but its browser workflow had evidence-delivery, blinding, reset, timing, logging, and transfer defects.
- **v2.0.1 is released and frozen.** It corrects those defects without changing the research questions, taxonomy, matcher weights, engine rules, event catalog, scoring thresholds, or analysis formulas.
- The release code passed the pull-request verification gate with 65 tests, a successful build, 22 expected fixture events, and expanded pilot-safety smoke checks. Final release-state commits change documentation only; the cold-machine rehearsal remains the required end-to-end confirmation.
- Recruitment may continue. **Do not schedule participants until the actual hardware arrangement passes Issue #3 and all participants are screened and confirmed.**

## 1. Research design

| Check | Status | Boundary |
|---|---|---|
| Narrow falsifiable question | Ready | Usefulness and burden remain separate outcomes. |
| Prose-only baseline | Ready | Must occur before structured review. |
| Three review modes | Ready | Assign before participant work; rotate across sessions. |
| Three case types | Ready | Straightforward, ambiguous, and noisy/incomplete. |
| Thresholds frozen | Ready | Do not revise after seeing human data. |
| Pilot distinguished from study | Ready | One trio is formative and non-generalizable. |
| Simultaneous analyst exposure | Required | Sequential one-host use is a deviation. |

## 2. Participant protection

| Check | Status | Action |
|---|---|---|
| Plain-language consent | Ready | Read the runbook language verbatim. |
| Withdrawal | Ready | Stop, do not export/analyze, reset local data. |
| Role labels | Ready | Use Analyst A, Analyst B, Reviewer, Facilitator. |
| Synthetic evidence only | Ready | Reject real client, patient, employer, or case data. |
| Private coordination | Ready | Keep schedules, contacts, and path files off public issues. |
| Compensation | Undecided | Define before recruitment and never condition it on favorable feedback. |
| Formal ethics approval | Not claimed | Do not describe this as IRB-approved or equivalent. Seek appropriate review before institutional, clinical, academic, or publishable human-subjects research. |

## 3. Recruitment truthfulness

- Analyst A: approximately 60–90 minutes.
- Analyst B: approximately 60–90 minutes.
- Reviewer: approximately 90–120 minutes.
- Facilitator: approximately 2.5–3.5 hours total, split into role-specific blocks when useful.
- Never advertise the complete workflow as one 90-minute all-role session.
- Screen every volunteer for exposure to public reference paths, reviewer decisions, design notes, and scoring materials.
- Report self-selection and domain-background bias.

## 4. Technical integrity

| Check | v2.0.0 | v2.0.1 |
|---|---|---|
| Model/engine/report tests | Pass | 65-test suite passed |
| Static build and fixture smoke | Pass | 22 events across three cases |
| Participant evidence in UI | Missing | Dedicated participant packets |
| Facilitator-note separation | Unsafe | Protected notes excluded from participant packets |
| Training demo | Could expose references | Separate non-pilot fixture |
| Analyst reviewer-screen guard | Missing | Added |
| Path download/import | Missing | Added with exact validation |
| Local reset | Missing | Added |
| Baseline-first enforcement | Documentation only | UI gate added |
| Reviewer timing export | Incomplete | Baseline and tool timing exported |
| Suggestion outcome logging | Incorrect | `unrelated` records `rejected` |
| Raw path preservation | Incomplete | Included in private session log |
| Server binding | Potentially broad | Loopback by default |
| CI | Missing | Verification workflow added and passed on the release candidate |

## 5. Blinding and information control

- Analysts receive the same participant-safe evidence and exact question at the same time.
- Analysts work independently and cannot open reviewer/results screens.
- Only `demo-training` is used for training.
- Reference paths, reviewer decisions, expected risks, and design notes remain hidden until grading finishes.
- Reviewer completes the prose-only baseline before viewing structured paths or suggestions.
- Early exposure triggers immediate logging and a rerun, exclusion, or explicit caveat decision.

Browser controls support this boundary but do not provide authentication. The facilitator remains responsible for supervision.

## 6. Equipment and environment

Required for a protocol-conforming session:

- one facilitator/reviewer laptop or desktop with Node.js 20+;
- two simultaneous isolated analyst workspaces;
- modern browsers and permission to run the local application;
- private raw-export storage;
- private path transfer;
- manual backup timer;
- power supplies and stable storage;
- quiet role-specific blocks;
- 2.5–3.5 hours of facilitator availability.

A single laptop supports only a sequential rehearsal or deviation. Record `sequential_analyst_entry_single_host` and treat the result mainly as operational/burden evidence.

A network-accessible local server must be deliberately configured and rehearsed on a trusted network. The default remains `127.0.0.1`.

## 7. Cold-machine rehearsal

Run on the exact final setup before scheduling:

1. Download `release/v2.0.1`.
2. Confirm Node.js 20 or newer.
3. Run `npm run verify` and retain the result.
4. Run `npm start` and confirm loopback binding by default.
5. Load the separate training demo.
6. Reset all local session data.
7. Enter and freeze a demo Analyst A path.
8. Download the Analyst A path JSON.
9. Create/download a demo Analyst B path from the second workspace.
10. Import both paths into the reviewer browser.
11. Confirm wrong-case and modified-evidence imports are rejected.
12. Download the prose-only baseline packet.
13. Confirm Reviewer Matching remains locked until baseline duration is entered.
14. Mark a suggestion unrelated and confirm the session log records `rejected`.
15. Download and reopen JSON, Markdown, CSV, and session-log exports; confirm both reviewer timing conditions.
16. Reset every workspace and confirm prior paths and reports are gone.

Any failure blocks scheduling. Fix or reschedule; do not improvise during the human session.

## 8. Data inventory and retention

Private raw artifacts per case:

- both frozen analyst paths;
- baseline packet, timing, and notes;
- report JSON, Markdown, and CSV;
- session log with paths, timings, match logs, and decisions;
- event grades;
- missing divergences;
- role-labeled questionnaires and interviews;
- protocol deviations.

Preserve untouched originals and analyze copies. Do not commit participant prose, path files, raw timing, completed records, names, schedules, or contacts publicly. Minimize identifying free text. Delete retained participant data after the predeclared decision and writeup unless another period was agreed in advance.

## 9. Analysis integrity

- Use `cli/analyze.js`; do not substitute favorable hand calculations.
- Report numerator, denominator, exclusions, and every `not yet scoreable` result.
- Keep case 2 separate where required.
- Never collapse usefulness and burden into one composite.
- Report misleading, wrong, duplicated, low-value, and missed findings with useful findings.
- Preserve accepted, rejected, and manual interactions for anchoring analysis.
- Treat one trio as formative evidence only.
- Do not move thresholds after seeing results.

## 10. Failure rules

| Failure | Required action |
|---|---|
| Test/build/smoke failure | Stop; do not run that checkout. |
| Participant packet missing | Stop. |
| Path transfer/import failure | Stop or reschedule; do not retype from memory. |
| Export cannot reopen | Stop; do not reconstruct data. |
| Analysts discuss before freeze | Log and assess exclusion. |
| Analysts start at different times | Log sequential-exposure deviation. |
| Reviewer sees structure before baseline | Rerun or exclude/caveat baseline. |
| Protected material exposed | Log and assess case exclusion. |
| Participant withdraws | Stop, do not export/analyze, reset. |
| Role cancels | Replace or reschedule; never merge roles. |
| Sensitive real evidence offered | Decline and use synthetic material. |
| Privacy or blinding fails | Reschedule or use a rehearsed setup. |
| Work exceeds estimate | Preserve actual time as burden evidence. |

## 11. Communication discipline

Accurate:

- v2.0.1 is released and internally verified;
- it fixes identified pre-pilot workflow defects;
- usefulness and human burden remain empirically unvalidated;
- negative, null, pivot, stop, and not-yet-scoreable outcomes are acceptable.

Do not claim:

- improved investigations;
- detection of bad reasoning or determination of truth;
- accurate modeling of human thought;
- usability or scientific validity from tests alone;
- effectiveness from one trio;
- protocol equivalence for sequential one-laptop use;
- a universal 90-minute commitment.

## 12. Post-pilot outputs

1. Freeze and inventory raw data.
2. Record deviations before interpretation.
3. Assemble the merged experiment result.
4. Run predefined analysis.
5. Record **continue**, **pivot**, **stop**, or **not yet scoreable**.
6. Publish facts, interpretations, limitations, and unknowns separately.
7. Open narrow issues tied to observed failures.
8. Build v2.1 only from repeated or materially important participant evidence.

## Go/no-go gate

Completed software gates:

- [x] v2.0.1 safety patch reviewed and merged.
- [x] 65-test/build/smoke verification passed on the release candidate.
- [x] `release/v2.0.1` created.
- [x] Recruitment issue corrected.
- [x] Hardware rehearsal tracked in Issue #3.

Remaining gates:

- [ ] Facilitator/reviewer computer identified.
- [ ] Two simultaneous analyst workspaces identified.
- [ ] All 16 cold-rehearsal steps pass.
- [ ] Analyst A confirmed and screened.
- [ ] Analyst B confirmed and screened.
- [ ] Reviewer confirmed and screened.
- [ ] Private coordination and transfer channels established.
- [ ] Role-specific commitments accepted.
- [ ] Primary and backup blocks agreed.
- [ ] Private storage and timer prepared.
- [ ] Review-mode assignment recorded.
- [ ] Facilitator understands consent, withdrawal, contamination, failure, and deviation rules.

Until every remaining gate is checked: recruit, screen, and prepare—but do not run the session.
