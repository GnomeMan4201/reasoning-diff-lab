# Pilot Runbook

Audience: the pilot facilitator. When this document is ambiguous, record a protocol deviation rather than guessing silently.

## Before scheduling

1. Confirm two independent analysts, one reviewer who authored neither path, one facilitator, and 90–120 minutes.
2. Use the frozen `release/v2.0.1` branch.
3. On the actual host machine, run `npm run verify` and complete all 16 cold-rehearsal steps in `docs/PRE_PILOT_READINESS_AUDIT.md`.
4. Prepare two analyst workspaces capable of beginning from the same evidence at the same time. Separate devices are preferred.
5. Decide and record all three review modes before participant work begins.
6. Prepare private storage, a manual timer, the scoring rubric, and the private session record.
7. Read the consent language below and obtain agreement before logging begins.

## Consent language

> You're being asked to take part in a short pilot test of a research prototype. You will either write a short analysis of a synthetic scenario or review two people's analyses and note where they differ. The full session is expected to take roughly 90–120 minutes. Your timing, edits, decisions, and typed responses will be logged locally under a role label such as Analyst A, Analyst B, or Reviewer rather than your name unless you separately agree to be named for follow-up. The tool does not send your typed reasoning to an external service. You may stop at any point without giving a reason. If you withdraw, your session data will not be exported or analyzed. Do you agree to take part on these terms?

Do not proceed with anyone who declines.

## Withdrawal

- Stop their participation immediately.
- Do not export or analyze their work.
- Use **Reset all local session data** on their browser and confirm the path and report are gone.
- Record only a role-labeled deviation with reason `withdrawal` unless the participant volunteers further detail.

## Roles

- **Analyst A / Analyst B:** receive the same evidence and question simultaneously, work independently, and never see the other path before both are frozen.
- **Reviewer:** authored neither path, completes the prose-only baseline first, then performs structured matching and event grading.
- **Facilitator:** controls protected materials, case and mode assignment, timing, path transfer, exports, consent, and deviations.

The browser role selector is an operating guard, not an authentication system. Supervision remains necessary.

## Eligibility and fixture exposure

Include people comfortable reading a short technical scenario, typing in a browser, and describing uncertainty. Formal credentials are not required for this formative pilot.

Exclude anyone who authored or inspected the fixture reference paths, reviewer decisions, facilitator design notes, or scoring rules. Because these materials are public in the repository, ask about exposure directly before scheduling. A later confirmatory study should use privately held or newly generated cases.

## Review-mode counterbalancing

| Session | Case 1 | Case 2 | Case 3 |
|---|---|---|---|
| 1 | blind | suggested_hidden_score | suggested_visible_score |
| 2 | suggested_hidden_score | suggested_visible_score | blind |
| 3 | suggested_visible_score | blind | suggested_hidden_score |

Use case order 1, 2, 3 unless enough sessions exist to counterbalance case order too. Record every departure.

## Protected material and blinding

- Participants receive only the participant-safe packet loaded by the interface.
- Use only `demo-training` for training.
- Do not show pilot `path-a.json`, `path-b.json`, reviewer decisions, expected risks, or design notes before grading finishes.
- Do not permit analyst discussion before both paths are frozen.
- Do not open Reviewer Matching before the prose-only baseline is complete.
- Record early exposure immediately and determine whether the affected result must be rerun, excluded, or reported with a caveat.

## Training

- Analysts practice only with **Training demo — not pilot data**.
- Reviewer receives a short walkthrough of the three decisions and contradiction control using the demo.
- Demo output is never merged into pilot data.

## Device arrangements

### Protocol-conforming arrangement

Both analysts begin from the same frozen evidence packet at the same time on separate devices or isolated workspaces. Each freezes and downloads a role-labeled path. The files move through the preselected private transfer channel to the reviewer browser, which validates role, case, question, and evidence.

Each analyst device may run its own verified local copy. Alternatively, a deliberately configured trusted local-network setup may be used only after rehearsal and explicit risk review; the default server remains loopback-only.

### Single-computer sequential fallback

A single browser can preserve visual separation while Analyst A and Analyst B take turns, but it cannot satisfy simultaneous evidence exposure. Treat this as a **protocol deviation**, not an equivalent session.

When unavoidable:

1. Record `sequential_analyst_entry_single_host` before analysis begins.
2. Preserve which analyst went first.
3. Do not compare timing or fatigue as though ordering were neutral.
4. Report the limitation prominently.
5. Prefer using the run as an operational rehearsal or burden/usability check rather than clean evidence for the central comparison claim.

## Run each case

1. Confirm the selected participant packet and exact question.
2. Start both analysts simultaneously in isolated workspaces.
3. Each analyst records and freezes a path without discussion.
4. Privately transfer/import both paths into the reviewer browser.
5. Download the prose-only baseline packet. It contains unit text only and omits structure, evidence links, dependencies, confidence, suggestions, and report output.
6. Give the baseline packet to the reviewer under the fixed time box **before** structured review.
7. Enter the baseline duration.
8. Open Reviewer Matching under the preassigned mode; tool-assisted timing starts.
9. Reviewer confirms, rejects, or manually adds matches. Contradiction is assessed separately.
10. Generate the report; tool-assisted timing ends.
11. Reviewer grades every event before seeing facilitator design notes or joining a group discussion.
12. Reviewer records every important divergence they believe the report missed.
13. Conduct the post-session questions.
14. Export both paths, all report formats, and the session log before changing cases.
15. Reopen the exports and preserve untouched originals.

## Timing

- Analyst timing, edits, validation errors, abandoned fields, and completion are recorded automatically.
- The baseline is timed manually and entered before Reviewer Matching.
- Tool-assisted reviewer time starts when Reviewer Matching opens and ends when the report is generated.
- The session log must contain both `baseline_prose` and `tool` timing records.
- Keep a manual timer as a cross-check and record discrepancies.

## Baseline contamination rule

If the reviewer sees structured paths, unit types, evidence links, dependencies, confidence, candidate suggestions, or report output before completing the baseline, that baseline is contaminated. Rerun it with an eligible reviewer when possible; otherwise exclude it or report it as not independently interpretable.

## Event grading

Use the exact labels and formulas in `docs/SCORING_RUBRIC.md`. Grade every generated event before discussion. Record important unreported differences separately as `missing_divergences`.

## Post-session questions

Ask each participant:

1. Reuse intent on the predefined 1–5 scale.
2. What was harder or easier than normal prose/review?
3. Which terms or workflow steps were confusing?
4. Reviewer only: did suggestions or visible scores affect decisions?

Separate direct observations from interpretation.

## Data handling

- Use role labels, not names, in analysis files.
- Store raw paths, reports, timings, decisions, grades, interviews, and deviations privately.
- Preserve untouched originals and work from copies.
- Do not commit participant prose, path files, completed logs, schedules, or contact details publicly.
- Minimize identifying free text; do not promise anonymity when writing style or details could indirectly identify someone.
- Delete retained participant data after the predeclared decision and writeup unless another period was agreed in advance.

## Protocol deviations

Record technical failures, transfer failures, sequential analyst entry, skipped steps, early exposure, timing problems, withdrawal, facilitator intervention, and any unplanned change. For each, record whether the affected result was included, excluded, rerun, or reported with caveat.

## After the session

1. Inventory both paths, baseline material, reports, session logs, event grades, missing divergences, questionnaires, interviews, and deviations for all cases.
2. Preserve raw originals and create analysis copies.
3. Assemble the `experiment_result` shape shown in `fixtures/sample-session.json`.
4. Run:
   ```bash
   npm run analyze -- your-merged-session.json
   ```
5. Report every numerator, denominator, exclusion, and `not yet scoreable` note.
6. Apply the predefined scoring rubric.
7. Record **continue**, **pivot**, **stop**, or **not yet scoreable**.
8. Report negative, null, misleading, and missing findings as prominently as favorable findings.
