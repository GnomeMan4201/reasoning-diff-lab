# Pre-Pilot Readiness Audit

This is the hostile go/no-go review for the first Reasoning Diff Lab human pilot. It separates internal implementation verification, operational readiness, and empirical validity.

## Current judgment

- **Do not use v2.0.0 for participants.** Its deterministic engine passed tests, but its browser workflow had evidence-delivery, blinding, reset, timing, logging, and transfer defects.
- The v2.0.1 candidate corrects those defects without changing the research questions, taxonomy, matcher weights, engine rules, event catalog, scoring thresholds, or analysis formulas.
- The candidate has passed GitHub Actions on Node.js 20 with 65 tests, a successful build, 22 expected fixture events, and expanded pilot-safety smoke checks.
- Recruitment may continue. Scheduling remains blocked until `release/v2.0.1` is frozen and the actual device arrangement passes the cold rehearsal.

## 1. Research design

| Check | Status | Boundary |
|---|---|---|
| Narrow falsifiable question | Ready | Usefulness and burden remain separate outcomes. |
| Prose-only baseline | Ready | Must occur before structured review. |
| Three review modes | Ready | Assign before participant work; rotate across sessions. |
| Three case types | Ready | Straightforward, ambiguous, and noisy/incomplete. |
| Thresholds frozen | Ready | Do not revise after seeing human data. |
| Pilot distinguished from study | Ready | One trio is formative and non-generalizable. |
| Simultaneous analyst exposure | Required | A sequential one-host run is a protocol deviation. |

## 2. Participant protection

| Check | Status | Action |
|---|---|---|
| Plain-language consent | Ready | Read the runbook language verbatim. |
| Withdrawal | Ready | Stop, do not export/analyze, reset local data. |
| Role labels | Ready | Use Analyst A, Analyst B, Reviewer, Facilitator. |
| Synthetic evidence only | Ready | Reject real client, patient, employer, or case data. |
| Private coordination | Ready | Move schedules, contact details, and path files off public issues. |
| Compensation | Undecided | Define before recruitment; never condition it on favorable feedback. |
| Formal ethics approval | Not claimed | Do not describe this as IRB-approved or equivalent. Seek appropriate review before institutional, clinical, academic, or publishable human-subjects research. |

## 3. Recruitment truthfulness

- Analyst commitment: approximately 60–90 minutes each.
- Reviewer commitment: approximately 90–120 minutes.
- Facilitator commitment: approximately 2.5–3.5 hours total, which may be split into role-specific blocks.
- Do not advertise the complete three-case workflow as one 90-minute all-role session.
- Screen every volunteer for exposure to public fixture paths, reviewer decisions, design notes, and scoring materials.
- Report self-selection and domain-background bias.

## 4. Technical integrity

| Check | v2.0.0 | v2.0.1 candidate |
|---|---|---|
| Model/engine/report tests | Pass | Pass, expanded to 65 total tests |
| Static build and fixture smoke | Pass | Pass: 22 events across three cases |
| Participant evidence in UI | Missing | Dedicated participant packets |
| Facilitator-note separation | Unsafe | Participant packets omit protected notes |
| Training demo | Could expose pilot references | Separate non-pilot fixture |
| Analyst reviewer-screen guard | Missing | Added |
| Path download/import | Missing | Added with role/case/question/evidence validation |
| Local reset | Missing | Added |
| Baseline-first enforcement | Prose only | UI gate added |
| Reviewer timing export | Incomplete | Baseline and tool conditions exported |
| Suggested rejection logging | Incorrect | `unrelated` records `rejected` |
| Raw path preservation | Incomplete | Included in private session log |
| Server binding | Potentially broad | Loopback by default |
| CI | Missing | Passing GitHub Actions workflow |

## 5. Blinding and information control

Before each case:

- Both analysts receive the same participant-safe evidence and exact question at the same time.
- Analysts work independently and cannot open reviewer/results screens.
- Only `demo-training` is used for training.
- Public reference paths, reviewer decisions, expected risks, and facilitator design notes remain unseen until event grading finishes.
- Reviewer completes the prose-only baseline before viewing structured paths or suggestions.
- Early exposure is logged immediately and triggers rerun, exclusion, or explicit caveat.

Browser controls support this boundary but do not provide authentication. The facilitator remains responsible for supervision.

## 6. Equipment and environment

Required for a protocol-conforming session:

- one verified facilitator/reviewer laptop or desktop with Node.js 20+;
- two simultaneous isolated analyst workspaces, normally separate laptops/desktops or independently verified devices;
- modern browsers and permission to run the local application;
- private storage for raw exports;
- a private path-transfer method;
- manual backup timer;
- power supplies and stable storage;
- quiet analyst and reviewer blocks;
- 2.5–3.5 hours of facilitator availability.

A single laptop may support a sequential rehearsal, but not clean simultaneous analyst exposure. Record such use as `sequential_analyst_entry_single_host` and treat the result mainly as operational/burden evidence.

A network-accessible local server must be deliberately configured, rehearsed on a trusted network, and risk-reviewed. The default remains `127.0.0.1`.

## 7. Cold-machine rehearsal

Run on the exact final setup before scheduling:

1. Download the frozen `release/v2.0.1` tree.
2. Confirm Node.js 20 or newer.
3. Run `npm run verify` and retain the result.
4. Run `npm start` and confirm loopback binding by default.
5. Load the separate training demo.
6. Reset all local session data.
7. Enter and freeze a temporary demo Analyst A path.
8. Download that path JSON.
9. Create/download a demo Analyst B path from the second analyst workspace.
10. Import both paths into the reviewer browser.
11. Attempt a wrong-case or modified-evidence import and confirm rejection.
12. Download the prose-only baseline packet.
13. Confirm Reviewer Matching remains locked until baseline duration is entered.
14. Mark a suggestion unrelated and confirm the session log records `rejected`.
15. Generate, download, and reopen JSON, Markdown, CSV, and session-log exports; confirm both reviewer timing conditions.
16. Reset every participant/reviewer workspace and confirm prior paths and reports are gone.

Any failure blocks scheduling. Fix or reschedule; do not improvise during the human session.

## 8. Data inventory and retention

Private raw artifacts per case:

- Analyst A frozen path;
- Analyst B frozen path;
- baseline packet, timing, and difference notes;
- report JSON, Markdown, and CSV;
- session log with paths, analyst timings, reviewer timings, match logs, and decisions;
- event grades;
- missing-divergence records;
- role-labeled questionnaires and interviews;
- protocol deviations.

Preserve untouched originals and analyze copies. Do not commit participant prose, path files, raw timing, completed records, names, schedules, or contact details publicly. Minimize identifying free text. Delete retained participant data after the predeclared decision and writeup unless another period was agreed in advance.

## 9. Analysis integrity

- Use `cli/analyze.js`; do not substitute favorable hand calculations.
- Report numerator, denominator, exclusions, and every `not yet scoreable` result.
- Keep case 2 separate where the protocol requires it.
- Never collapse usefulness and burden into one composite score.
- Report misleading, wrong, duplicated, low-value, and missed findings alongside useful findings.
- Preserve accepted, rejected, and manual match interactions for anchoring analysis.
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
| Analysts start at different times | Log the sequential-exposure deviation. |
| Reviewer sees structure before baseline | Rerun with eligible reviewer or exclude/caveat baseline. |
| Protected reference/design material exposed | Log and assess case exclusion. |
| Participant withdraws | Stop, do not export/analyze, reset their data. |
| Role cancels | Replace or reschedule; never merge analyst/reviewer roles. |
| Sensitive real evidence offered | Decline and return to synthetic material. |
| Privacy or blinding cannot be maintained | Reschedule or change to a rehearsed setup. |
| Work takes longer than estimated | Preserve the actual time as burden evidence. |

## 11. Communication discipline

Accurate:

- the candidate passes its internal automated verification;
- v2.0.1 fixes identified pre-pilot workflow defects;
- usefulness and human burden remain empirically unvalidated;
- negative, null, pivot, stop, and not-yet-scoreable outcomes are acceptable.

Do not claim:

- the tool improves investigations;
- it detects bad reasoning or determines truth;
- the taxonomy accurately models human thought;
- automated tests establish usability or scientific validity;
- one trio demonstrates effectiveness;
- a one-laptop sequential run is protocol-equivalent;
- the full workflow requires only 90 minutes from everyone.

## 12. Post-pilot outputs

1. Freeze and inventory raw data.
2. Record deviations before interpretation.
3. Assemble the merged experiment result.
4. Run the predefined analysis.
5. Record **continue**, **pivot**, **stop**, or **not yet scoreable**.
6. Publish a results note separating facts, interpretations, limitations, and unknowns.
7. Open narrow issues tied to observed failures.
8. Build v2.1 only from repeated or materially important participant evidence.

## Go/no-go gate

Do not schedule the human pilot until all are true:

- [ ] Final candidate CI passes.
- [ ] `release/v2.0.1` is frozen at the verified commit.
- [ ] Facilitator/reviewer computer identified.
- [ ] Two simultaneous analyst workspaces identified.
- [ ] All 16 cold-rehearsal steps pass.
- [ ] Analyst A confirmed and screened.
- [ ] Analyst B confirmed and screened.
- [ ] Reviewer confirmed and screened.
- [ ] Private coordination and transfer channels established.
- [ ] Role-specific time commitments accepted.
- [ ] Primary and backup blocks agreed.
- [ ] Private storage and manual timer prepared.
- [ ] Review-mode assignment recorded.
- [ ] Facilitator understands consent, withdrawal, contamination, failure, and deviation rules.

Until then: recruit, screen, and prepare—but do not run the session.
