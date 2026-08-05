# Pilot Session Checklist

Use this short operational checklist for the first Reasoning Diff Lab pilot. The authoritative rules remain in [`PILOT_RUNBOOK.md`](../PILOT_RUNBOOK.md), [`EXPERIMENT_PROTOCOL.md`](EXPERIMENT_PROTOCOL.md), and [`PRE_PILOT_READINESS_AUDIT.md`](PRE_PILOT_READINESS_AUDIT.md).

## Freeze the instrument

- [ ] Use the frozen `release/v2.0.1` branch.
- [ ] Record the exact commit used.
- [ ] Do not change taxonomy, cases, comparison rules, thresholds, or review modes during a session.
- [ ] Record unavoidable deviations instead of silently correcting them.

## Confirm the people

- [ ] Analyst A confirmed.
- [ ] Analyst B confirmed.
- [ ] Reviewer confirmed and did not author either path.
- [ ] Facilitator confirmed.
- [ ] Nobody has inspected fixture reference paths, reviewer decisions, or design notes.
- [ ] Everyone understands that the first pilot uses synthetic evidence only.
- [ ] Private scheduling and transfer channel established.

Do not put participant names, schedules, contact details, credentials, private case material, client information, or medical information in public GitHub issues.

## Technical preflight

- [ ] Clone or download `release/v2.0.1`.
- [ ] Confirm Node.js 20 or newer.
- [ ] Run `npm run verify` and confirm 65 tests, build, and safety smoke test pass.
- [ ] Run `npm start`; confirm the URL uses `127.0.0.1` unless a separately rehearsed setup requires otherwise.
- [ ] Load the separate training demo.
- [ ] Confirm participant evidence appears for all three pilot cases.
- [ ] Confirm Analyst roles cannot open Reviewer Matching or Results.
- [ ] Confirm path download and reviewer import work.
- [ ] Confirm a wrong-case or modified-evidence path is rejected.
- [ ] Confirm the baseline packet downloads.
- [ ] Confirm Reviewer Matching stays locked until baseline duration is entered.
- [ ] Mark one suggestion unrelated and confirm the session log records `rejected`.
- [ ] Confirm report and session-log exports reopen successfully.
- [ ] Confirm **Reset all local session data** removes previous work.

Stop if any preflight check fails.

## Prepare the session

- [ ] Choose and record the review-mode assignment before starting.
- [ ] Prepare a private export folder and untouched-raw subfolder.
- [ ] Prepare a manual timer as a cross-check.
- [ ] Keep analysts physically or digitally separated until both paths are frozen.
- [ ] Use only the separate demo for training.
- [ ] Hide reference paths, reviewer decisions, and design notes.
- [ ] Give analysts the Quickstart.
- [ ] Give reviewer the Reviewer Guide and Scoring Rubric.
- [ ] Read consent language verbatim.
- [ ] Confirm each participant agrees before logging begins.

## Run each case

- [ ] Load the participant evidence packet and exact question.
- [ ] Start Analyst A and Analyst B independently.
- [ ] Freeze Analyst A path.
- [ ] Freeze Analyst B path.
- [ ] Transfer/import paths privately if different browsers or devices are used.
- [ ] Confirm both paths are present in Reviewer setup.
- [ ] Download the plain prose-only baseline packet.
- [ ] Run and time the baseline **before** opening Reviewer Matching.
- [ ] Enter baseline duration.
- [ ] Open Reviewer Matching under the preassigned mode.
- [ ] Have reviewer confirm, reject, or add matches without group discussion.
- [ ] Assess contradiction separately from semantic similarity.
- [ ] Generate the report.
- [ ] Grade every event before revealing protected design notes.
- [ ] Record important divergences the report missed.
- [ ] Conduct the post-session questions.
- [ ] Export path files, report formats, and session log before changing cases.

## Record failures honestly

- [ ] Log technical failures and transfer problems.
- [ ] Log skipped or misunderstood steps.
- [ ] Log early exposure to paths, structure, suggestions, or design notes.
- [ ] Log abandoned or repeatedly reclassified units.
- [ ] Log misleading, trivial, duplicated, and missed findings.
- [ ] Log participant withdrawal without unnecessary personal detail.
- [ ] Record inclusion, exclusion, rerun, or caveat decision for each deviation.

Do not repair the protocol mid-session to produce a cleaner result.

## End the session

- [ ] Confirm all raw exports are readable.
- [ ] Preserve untouched originals and make analysis copies.
- [ ] Confirm files use role labels rather than names.
- [ ] Assemble all three cases into the experiment-result shape.
- [ ] Run `npm run analyze -- your-merged-session.json`.
- [ ] Report numerator, denominator, exclusions, and `not yet scoreable` notes.
- [ ] Compare with `SCORING_RUBRIC.md`.
- [ ] Record **continue**, **pivot**, **stop**, or **not yet scoreable**.

## Afterward

- [ ] Do not publish identifying or raw participant material.
- [ ] Report negative and null findings alongside positive findings.
- [ ] Open narrowly scoped issues for observed failures.
- [ ] Do not change the instrument based on one person's preference alone.
- [ ] Build v2.1 only from repeated or materially important evidence.
