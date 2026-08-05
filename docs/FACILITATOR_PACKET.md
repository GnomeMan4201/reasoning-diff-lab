# Pilot Facilitator Packet — One-Page Summary

## Purpose

Run a formative test of one question: does comparing two independently produced reasoning paths reveal useful, non-obvious differences that prose-only review misses, without imposing unacceptable entry or review burden?

This is not a validation study. The deliverable is a documented **continue**, **pivot**, **stop**, or **not yet scoreable** decision.

## Roles and realistic time

| Role | Count | Expected commitment |
|---|---:|---:|
| Analyst A | 1 | about 60–90 minutes across training, three cases, handoff, and interview |
| Analyst B | 1 | about 60–90 minutes across training, three cases, handoff, and interview |
| Reviewer | 1 | about 90–120 minutes across three baselines, structured review, grading, and interview |
| Facilitator | 1 | reserve about 2.5–3.5 hours total including setup, transfers, exports, and resets |

The roles do not need to remain present for the entire facilitator window. Analysts can complete all frozen paths first; the reviewer can work afterward. A single 90-minute all-role session is not a safe planning assumption.

## Required setup

- Verified frozen `release/v2.0.1` build
- Node.js 20 or newer
- `npm run verify` passing
- Actual host/device arrangement rehearsed
- Two simultaneous isolated analyst workspaces for protocol-conforming data
- Private path-transfer and export location
- Manual timer
- Primary and backup session dates

The default local server is `http://127.0.0.1:4173`. A network-accessible setup requires separate rehearsal and risk review.

## Participant sequence

### Analysts

1. Read consent and complete only the separate training demo.
2. Begin the same pilot case simultaneously in isolated workspaces.
3. Use the participant-safe evidence packet shown by the interface.
4. Freeze each path without discussion.
5. Download the role-labeled path JSON and return control to the facilitator.
6. Repeat for all three cases.
7. Complete the analyst interview.

### Reviewer

For each case:

1. Import or confirm both frozen paths.
2. Download and review the plain prose-only baseline packet first.
3. Record baseline duration.
4. Open Reviewer Matching under the preassigned mode.
5. Confirm, reject, or manually add matches; assess contradiction separately.
6. Generate the report.
7. Grade every event before design-note disclosure or group discussion.
8. Record important divergences the report missed.
9. Export report and session log.

Then complete the reviewer interview.

## Timing plan

| Work | Typical range |
|---|---:|
| Consent and separate demo | 10–15 min |
| Analyst entry per case, simultaneous | 10–20 min |
| Baseline review per case | up to 10 min |
| Tool-assisted matching per case | 10–15 min |
| Event grading and missing-divergence capture per case | 5–10 min |
| Interviews and export verification | 15–25 min |

Plan for variation. Setup trouble and long structured entry are findings, not reasons to hide elapsed time.

## Isolation rules

- Analysts receive the same evidence at the same time.
- No analyst sees the other path before both are frozen.
- Only `demo-training` is used for training.
- Reference paths, reviewer decisions, expected risks, and design notes remain protected until grading finishes.
- Reviewer completes baseline before seeing structured paths or suggestions.

A single-computer sequential analyst run is a documented protocol deviation and should be treated primarily as an operational or burden rehearsal, not clean evidence for the central claim.

## Consent summary

Read the full language in `PILOT_RUNBOOK.md`. Participants must understand:

- scenarios are synthetic;
- timing, edits, decisions, and text are logged locally under role labels;
- they can stop without giving a reason;
- withdrawn work is not exported or analyzed;
- no real client, patient, employer, or case data should be entered.

## Exports per case

- Analyst A path
- Analyst B path
- baseline packet and baseline notes
- report JSON, Markdown, and CSV
- session log containing paths, analyst timings, reviewer timings, match logs, and final decisions
- event grades
- missing divergences
- protocol deviations

Reopen every exported file before changing cases. Preserve untouched originals privately.

## Counterbalancing

| Session | Case 1 | Case 2 | Case 3 |
|---|---|---|---|
| 1 | blind | hidden score | visible score |
| 2 | hidden score | visible score | blind |
| 3 | visible score | blind | hidden score |

Assign modes before starting and never change them based on observed performance.

## Stop conditions

Stop or reschedule when:

- `npm run verify` fails;
- participant evidence does not load;
- path transfer/import fails;
- reset or exports fail;
- baseline is contaminated;
- protected material is exposed;
- a participant withdraws;
- privacy or blinding cannot be maintained.

Record the failure; do not reconstruct missing data from memory or patch the procedure during the session.

## Completion

The pilot is complete only when all three cases have frozen paths, uncontaminated baseline records, structured reviewer output, event grades, missing-divergence records, questionnaires, private exports, deviations, merged analysis data, and a recorded decision under the predefined rubric.
