# Pilot Runbook

Audience: whoever is facilitating a pilot session. You should be able to run this without contacting the author. If something here is ambiguous, log it as a protocol deviation (`docs/DATA_DICTIONARY.md#protocol_deviation`) rather than guessing silently.

## Before the session

1. Confirm two analysts who will work independently, one reviewer who authored neither path, one facilitator, and roughly 90–120 minutes.
2. Use the frozen `release/v2.0.1` branch. Run `npm run verify` and confirm all 65 tests, the static build, and the built-artifact smoke check pass. If verification fails, stop.
3. Run `npm start`. The server binds to `127.0.0.1` by default. Do not expose it to a wider network merely for convenience.
4. Complete the 16-step cold-machine rehearsal in `docs/PRE_PILOT_READINESS_AUDIT.md` on the actual host computer.
5. Decide and record the review-mode order for all three cases before participants begin. Counterbalance across sessions as described below.
6. Prepare a private storage folder, a manual timer, `docs/SCORING_RUBRIC.md`, and `docs/PILOT_SESSION_RECORD_TEMPLATE.md`.
7. Read the consent language below to every participant and get agreement before logging begins.

## Consent language (read aloud or share verbatim)

> You're being asked to take part in a short pilot test of a research prototype. You will either write a short analysis of a synthetic scenario, or review two people's analyses and note where you think they differ. The full session is expected to take roughly 90–120 minutes. Your timing, edits, decisions, and typed responses will be logged locally, tied to a role label (Analyst A / Analyst B / Reviewer) rather than your name unless you separately agree to be named for follow-up. The tool does not send your typed reasoning to an external service. You may stop at any point without giving a reason. If you withdraw, your session data will not be exported or analyzed. Do you agree to take part on these terms?

If anyone declines, do not proceed with them in that role.

## Withdrawal procedure

- A participant may withdraw at any time by telling the facilitator.
- Do not export or analyze that participant's work.
- Use **Reset all local session data** and confirm the prior paths and report are gone.
- Log the withdrawal as a protocol deviation with reason `withdrawal`; no additional personal detail is required.

## Roles

- **Analyst A / Analyst B:** work independently and never see each other's path before both are frozen. Analysts use only the participant evidence packet shown in the interface. After saving, they download their path if transfer is required and return the device to the facilitator.
- **Reviewer:** authored neither path. Completes the prose-only baseline before structured review, then performs matching and event grading.
- **Facilitator:** controls role changes, case selection, review mode, timing, protected materials, exports, and protocol-deviation records.

The browser role boundary is not authentication. Supervision still matters.

## Inclusion / exclusion criteria

- Include anyone comfortable reading a short technical scenario, typing into a browser form, and describing uncertainty.
- Exclude anyone who authored or reviewed the fixture cases, reference paths, design notes, scoring rules, or who has already inspected those protected materials.
- Formal credentials are not required for this formative feasibility round.

## Public-fixture exposure risk

Reference paths remain visible in the public repository. Before scheduling, ask each volunteer whether they opened the fixture reference paths or design notes. Exclude exposed volunteers from these cases. A later confirmatory study should use privately held or newly generated cases.

## Case ordering and counterbalancing

With three cases and more than one session, rotate review modes so no mode is always paired with the same case difficulty:

| Session | Case 1 mode | Case 2 mode | Case 3 mode |
|---|---|---|---|
| 1 | blind | suggested_hidden_score | suggested_visible_score |
| 2 | suggested_hidden_score | suggested_visible_score | blind |
| 3 | suggested_visible_score | blind | suggested_hidden_score |

Present cases in fixed order (1, 2, 3) unless enough sessions exist to counterbalance case order too. Record any alternate order.

## Blinding and protected material

- Analysts receive only `participant.json` content through the interface: title, question, instructions, and evidence.
- Analysts never see each other's path before both are frozen.
- Use only the separate `demo-training` fixture for training.
- Do not show `path-a.json`, `path-b.json`, reviewer decisions, or `design_note_do_not_show_before_grading` to participants before grading.
- The reviewer must complete the prose-only baseline before opening Reviewer Matching.
- If protected material is exposed early, record it immediately and assess exclusion or rerun.

## Training procedure

- Give analysts the Quickstart and allow them to practice with **Training demo — not pilot data**.
- The demo is separate from all three pilot cases and must not be included in session analysis.
- Give the reviewer a two-minute walkthrough of decision buttons and the contradiction checkbox using the demo report.

## Technical and device formats

### One host browser, sequential handoff

1. Analyst A enters and freezes a path.
2. Facilitator switches to Analyst B; the first path remains stored but reviewer screens stay locked.
3. Analyst B enters and freezes a path.
4. Facilitator switches to Reviewer.

### Separate devices or browser profiles

1. Each analyst uses the same frozen v2.0.1 build and selected case.
2. Each analyst freezes and downloads their own path JSON.
3. Files move through a private channel to the facilitator.
4. Reviewer/facilitator selects the same case and imports Analyst A and Analyst B paths.
5. The UI rejects a mismatched case, role, question, or evidence packet.

Rehearse the exact transfer method before using it with participants. Do not post path files publicly.

## Run each case

1. Select the assigned case and confirm the participant evidence packet loaded.
2. Start both analysts independently. Simultaneous work is preferred; sequential work is acceptable for the first formative pilot if separation is maintained and the ordering is recorded.
3. Each analyst freezes their path. Export path files if another browser or device will be used.
4. Confirm both frozen paths are present in the reviewer browser.
5. Download the prose-only baseline packet. It contains unit text only and omits types, evidence links, dependencies, confidence, candidate matches, and report output.
6. Give the baseline packet to the reviewer under the fixed time box. Do this **before** opening Reviewer Matching.
7. Enter the baseline duration in minutes.
8. Open Reviewer Matching. The tool starts the tool-assisted reviewer timer.
9. Reviewer confirms, rejects, or adds matches. An `unrelated` suggestion is logged as rejected; manual matches are logged separately.
10. Generate the deterministic report. The tool records tool-assisted reviewer time.
11. Reviewer grades every event before any design note or group discussion is revealed.
12. Reviewer lists important divergences the report missed.
13. Conduct the post-session interview.
14. Export the report formats and private session log before changing cases.
15. Reset or switch cases only after confirming exports are readable.

## Timing procedure

- Analyst entry timing, edits, validation errors, and completion status are logged automatically.
- The baseline is timed manually and entered before structured review.
- Tool-assisted reviewer time starts when Reviewer Matching opens and ends when the report is generated.
- The session export contains both `baseline_prose` and `tool` reviewer timing records.
- Keep a manual timer as a cross-check and log discrepancies.

## Baseline condition

For each case, give the reviewer only the two analysts' plain text, with no structure, evidence references, confidence, match suggestions, or report. Ask them to list important differences within a fixed time box; 10 minutes is reasonable for the included cases. The baseline must occur first to avoid contamination from the structured view.

If the reviewer sees structured paths or suggestions before the baseline, do not call that baseline uncontaminated. Record a deviation and rerun or exclude it.

## Reviewer grading

After the tool-assisted report is generated, the reviewer grades every listed event using the six grades in `docs/SCORING_RUBRIC.md` before group discussion. The reviewer separately lists important unreported differences as `missing_divergences`.

## Post-session interview

Ask each participant:

1. Would you use this again for real work? (1–5; preserve the exact scale.)
2. What made this harder or easier than normal prose?
3. Was any term or workflow step confusing?
4. Reviewer only: did candidate suggestions or visible scores affect your decisions?

Record direct observations separately from interpretation.

## Data retention

- Store role-labeled raw exports privately.
- Preserve untouched originals and analyze copies.
- Do not commit participant prose, path files, timing logs, contact details, or completed session records to the public repository.
- Retain data only as long as needed for the predeclared pilot decision and writeup unless another period was agreed in advance.
- Do not promise anonymity if free-text content could indirectly identify someone; minimize identifying content instead.

## Protocol deviations

Log technical failures, skipped steps, early exposure, timing problems, withdrawals, transfer problems, and facilitator interventions as `protocol_deviation` entries. Record whether each affected result was included, excluded, rerun, or reported with caveat.

## After the session

1. Inventory Analyst A path, Analyst B path, report JSON/Markdown/CSV, session log, baseline notes, event grades, missing divergences, questionnaires, interviews, and deviations for each case.
2. Preserve raw files and create analysis copies.
3. Merge case data into the `experiment_result` shape shown in `fixtures/sample-session.json`.
4. Run:
   ```bash
   npm run analyze -- your-merged-session.json
   ```
5. Compare output with `docs/SCORING_RUBRIC.md`.
6. Record **continue**, **pivot**, **stop**, or **not yet scoreable** with numerator, denominator, exclusions, and reasons.
7. Report null, negative, misleading, and missing results as prominently as favorable findings.
