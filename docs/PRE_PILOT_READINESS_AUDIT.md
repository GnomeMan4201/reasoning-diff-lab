# Pre-Pilot Readiness Audit

This is the hostile go/no-go review for the first Reasoning Diff Lab human pilot. It separates implementation verification from operational readiness and empirical validity.

## Current judgment

**Do not schedule the session on v2.0.0.** The deterministic engine is internally verified, but a deeper browser-workflow review found participant-exposure and measurement defects that would contaminate the pilot. Those defects are addressed in the v2.0.1 safety patch candidate and must pass CI plus a cold-machine rehearsal before promotion.

Recruitment may continue while the patch is verified. Do not promise a session date until a host computer is identified and the final technical preflight passes.

## 1. Research question and scope

| Check | Status | Boundary |
|---|---|---|
| One falsifiable pilot question | Ready | Usefulness and burden are reported separately. |
| Pilot distinguished from powered study | Ready | One analyst pair, one reviewer, and three cases cannot support general population claims. |
| Continue / pivot / stop thresholds frozen | Ready | Do not revise after seeing participant data. |
| Prose-only comparison condition | Ready | It must occur before tool-assisted review. |
| Review modes counterbalanced | Ready | Assign modes before the session. |
| Instrument changes frozen during a session | Ready | Record deviations instead of repairing the procedure mid-run. |

## 2. Participant protection and consent

| Check | Status | Required action |
|---|---|---|
| Plain-language consent | Ready | Read the runbook language verbatim. |
| Voluntary withdrawal | Ready | Stop, do not export, and reset local data. |
| Role labels instead of names | Ready | Use Analyst A, Analyst B, Reviewer, Facilitator. |
| Synthetic evidence only | Ready | Reject real client, patient, employer, or case data for this first pilot. |
| Public-issue privacy warning | Ready | Move schedules and contact details to a private channel. |
| Compensation and incentives | Undecided | If compensation is offered, define it before recruitment and provide it regardless of whether feedback is positive. |
| Formal ethics review | Not claimed | This is a small independent formative pilot, not an institutionally approved human-subjects study. Do not describe it as IRB-approved or equivalent. Seek appropriate review before institutional, clinical, academic, or publishable human-subjects research. |

## 3. Recruitment and screening

| Check | Status | Required action |
|---|---|---|
| Recruitment issue | Ready | Keep one public source of truth. |
| Two analysts and one reviewer | Open | Do not collapse analyst and reviewer roles. |
| Prior fixture exposure screening | Required | Ask directly before scheduling. |
| Independence between analysts | Required | Avoid pairs likely to coordinate or share an established case narrative. |
| Volunteer sample limitation | Known | Report self-selection and domain-background bias. |
| Public reference paths | Known risk | The repository contains reference paths. Ask volunteers not to inspect fixture answers and exclude anyone who has. For a later confirmatory study, use privately held or newly generated cases. |

## 4. Technical integrity

| Check | v2.0.0 | v2.0.1 candidate |
|---|---:|---:|
| Production model / engine tests | Pass | Must remain passing |
| Static build and smoke test | Pass | Expanded safety smoke test pending CI |
| Participant evidence visible in UI | Blocked | Added participant-safe packets |
| Facilitator design note absent from participant UI | Unsafe | Separated from participant packet |
| Separate non-pilot training demo | Blocked | Added |
| Analyst reviewer-screen guard | Blocked | Added |
| Analyst path export / reviewer import | Blocked | Added with exact case/question/evidence validation |
| Real local reset control | Blocked | Added |
| Baseline-before-tool enforcement | Documentation only | Enforced in UI |
| Reviewer baseline and tool timing export | Incomplete | Added |
| Suggested rejection logging | Incorrect | Corrected (`unrelated` → `rejected`) |
| Raw path preservation in session export | Incomplete | Added |
| Default network binding | All interfaces possible | Loopback by default |
| Automated CI | Missing | Added |

## 5. Blinding and information control

Before each case:

- Analysts receive only the participant packet and exact question.
- Analysts do not see each other's paths before both are frozen.
- The completed training demo uses a separate case and cannot load pilot reference paths.
- Reviewer matching remains inaccessible to analyst roles.
- The reviewer completes the prose-only baseline before opening structured review.
- Design notes and reference answers remain facilitator-only until event grading is finished.
- If a protected note or reference path is exposed, record the exposure and decide whether the affected case must be excluded.

The browser guard is an operational boundary, not an authentication system. The facilitator still controls the device and role selector.

## 6. Session equipment and environment

Required:

- one working laptop or desktop with Node.js 20 or newer;
- a supported modern browser;
- permission to run a loopback HTTP server;
- a private folder for exports;
- a manual fallback timer;
- a quiet 90–120 minute block;
- power supply and stable device storage;
- a private transfer channel if analyst path files move between devices.

Preferred first format: co-located and facilitator-controlled. Separate analyst devices are acceptable after path export/import is rehearsed. Remote participation adds transfer, timing, privacy, and blinding failure modes and must be rehearsed before use.

## 7. Cold-machine rehearsal

Run this on the actual host machine before scheduling:

1. Download the final frozen release branch.
2. Confirm `node --version` is 20 or newer.
3. Run `npm run verify` and save the terminal result.
4. Run `npm start` and confirm it binds to `127.0.0.1` by default.
5. Load the separate training demo.
6. Reset all local session data.
7. Enter and save a temporary Analyst A path.
8. Download the path JSON.
9. Reset, switch to reviewer, and import valid Analyst A and Analyst B demo paths.
10. Attempt a wrong-case import and confirm it is rejected.
11. Download the prose-only baseline packet.
12. Confirm Reviewer Matching is locked until baseline duration is entered.
13. Mark one suggestion unrelated and confirm the exported log records `rejected`.
14. Generate and reopen JSON, Markdown, CSV, and session-log exports.
15. Confirm the session log contains both baseline and tool reviewer timings.
16. Reset and confirm the prior paths and report are gone.

A failure in steps 1–16 blocks scheduling. Fix or reschedule; do not improvise during the human session.

## 8. Data collection and retention

Private raw artifacts per case:

- Analyst A frozen path;
- Analyst B frozen path;
- prose-only baseline packet and notes;
- comparison report JSON, Markdown, and CSV;
- session log with analyst timing, reviewer timing, match logs, and final decisions;
- event grades;
- missing-divergence entries;
- participant questionnaires and interview notes;
- protocol deviations.

Preserve untouched raw exports and analyze copies. Do not commit completed session records, raw participant prose, identifying details, or timing data to the public repository. Delete retained participant data after the predeclared pilot decision and writeup unless a longer period was explicitly agreed in advance.

## 9. Analysis integrity

- Use `cli/analyze.js`; do not hand-recalculate formulas differently.
- Report numerator, denominator, exclusions, and every `not yet scoreable` result.
- Keep case 2 separate where required because it has no designed correct answer.
- Do not combine usefulness and burden into one favorable composite.
- Report misleading findings and missed divergences as prominently as useful findings.
- Treat one trio's results as formative evidence only.
- Preserve rejected suggestions and manual matches when examining anchoring.
- Do not change thresholds after seeing the output.

## 10. Failure and contingency rules

| Failure | Action |
|---|---|
| Test, build, or smoke failure | Stop; do not run the pilot on that checkout. |
| Export failure | Stop; do not reconstruct missing data from memory. |
| Analyst collaboration before freeze | Record deviation and assess exclusion. |
| Reviewer sees structure before baseline | Exclude or rerun the affected baseline; do not call it uncontaminated. |
| Participant sees design note/reference answer | Record exposure and assess case exclusion. |
| Participant withdraws | Stop, do not export, reset their local data. |
| One role cancels | Replace or reschedule; do not merge roles. |
| Real sensitive evidence offered | Decline and return to synthetic cases. |
| Remote transfer cannot preserve privacy/blinding | Switch to co-located format or reschedule. |
| Session exceeds time box due to setup trouble | Record the burden and deviation; do not silently remove it. |

## 11. Communication discipline

Accurate statements:

- the implementation is internally verified against included fixtures;
- the v2.0.1 candidate corrects pre-pilot workflow defects;
- the usefulness hypothesis remains empirically unvalidated;
- negative, null, or stop results are acceptable.

Do not claim:

- the tool improves investigations;
- the taxonomy captures how people actually think;
- the pilot proves effectiveness;
- automated tests establish usability or scientific validity;
- the tool determines truth or identifies the better analyst.

## 12. Post-pilot outputs

After the session:

1. Freeze and inventory raw data.
2. Record all deviations before looking for favorable interpretations.
3. Assemble the merged session file.
4. Run the predefined analysis.
5. Record **continue**, **pivot**, **stop**, or **not yet scoreable**.
6. Write a results note separating facts, interpretations, and unknowns.
7. Open narrowly scoped issues tied to observed failures.
8. Do not build v2.1 from hypothetical improvements unsupported by session evidence.

## Go / no-go gate

The first human session may be scheduled only when every item below is true:

- [ ] v2.0.1 verification workflow passes.
- [ ] Final `release/v2.0.1` branch is frozen.
- [ ] Actual host computer identified.
- [ ] Cold-machine rehearsal passes all 16 steps.
- [ ] Analyst A confirmed and screened.
- [ ] Analyst B confirmed and screened.
- [ ] Reviewer confirmed and screened.
- [ ] Private scheduling channel established.
- [ ] Primary and backup dates agreed.
- [ ] Private storage location prepared.
- [ ] Review-mode assignment recorded before starting.
- [ ] Consent, withdrawal, and failure rules understood by the facilitator.

Until then: recruit, screen, and prepare—but do not run the session.
