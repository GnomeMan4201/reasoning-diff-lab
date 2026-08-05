# Pilot Session Checklist

Use this checklist with `PILOT_RUNBOOK.md`, `EXPERIMENT_PROTOCOL.md`, and `PRE_PILOT_READINESS_AUDIT.md`.

## Freeze the instrument

- [ ] Use frozen `release/v2.0.1`.
- [ ] Record exact commit.
- [ ] Do not change cases, taxonomy, matcher, rules, thresholds, formulas, or modes during a session.
- [ ] Record deviations rather than silently repairing the procedure.

## Confirm people and time

- [ ] Analyst A confirmed and accepts about 60–90 minutes.
- [ ] Analyst B confirmed and accepts about 60–90 minutes.
- [ ] Reviewer confirmed, authored neither path, and accepts about 90–120 minutes.
- [ ] Facilitator reserves about 2.5–3.5 hours across role blocks.
- [ ] Nobody inspected reference paths, reviewer decisions, design notes, or scoring materials.
- [ ] Private scheduling and path-transfer channel established.
- [ ] Primary and backup role blocks agreed.

Do not post participant names, schedules, contact details, credentials, private evidence, client information, or medical information publicly.

## Technical preflight

- [ ] Facilitator/reviewer computer identified.
- [ ] Two simultaneous isolated analyst workspaces identified.
- [ ] Node.js 20 or newer confirmed where required.
- [ ] `npm run verify` passes: 65 tests, build, and safety smoke check.
- [ ] `npm start` uses `127.0.0.1` unless another setup was deliberately rehearsed.
- [ ] Separate training demo loads.
- [ ] Participant evidence appears for all three pilot cases.
- [ ] Analyst roles cannot open Reviewer Matching or Results.
- [ ] Path download and reviewer import work.
- [ ] Wrong-case or modified-evidence import is rejected.
- [ ] Baseline packet downloads.
- [ ] Reviewer Matching stays locked until baseline duration is entered.
- [ ] An unrelated suggestion exports as `rejected`.
- [ ] Report and session-log exports reopen.
- [ ] Reset removes previous local work.

Stop if any preflight check fails.

## Prepare the session

- [ ] Review-mode assignment recorded before participant work.
- [ ] Private raw-export folder and analysis-copy folder prepared.
- [ ] Manual timer prepared.
- [ ] Analysts can start each case simultaneously without seeing or contacting each other.
- [ ] Only the separate demo will be used for training.
- [ ] Reference paths, reviewer decisions, expected risks, and design notes are hidden.
- [ ] Quickstart, Analyst Guide, Reviewer Guide, and Scoring Rubric ready.
- [ ] Consent language read verbatim and accepted.

## Run each case

- [ ] Load participant-safe packet and exact question.
- [ ] Start Analyst A and Analyst B **simultaneously** in isolated workspaces.
- [ ] Freeze both paths without discussion.
- [ ] Privately transfer/import both paths.
- [ ] Confirm role, case, question, and evidence validation.
- [ ] Download plain prose-only baseline packet.
- [ ] Run and time baseline before Reviewer Matching.
- [ ] Enter baseline duration.
- [ ] Open the preassigned structured review mode.
- [ ] Reviewer confirms, rejects, or manually adds matches.
- [ ] Reviewer assesses contradiction separately.
- [ ] Generate report.
- [ ] Grade every event before discussion or protected-note disclosure.
- [ ] Record important missed divergences separately.
- [ ] Conduct role-specific post-session questions.
- [ ] Export both paths, all reports, and session log.
- [ ] Reopen exports before changing case.

## Record failures

- [ ] Technical, transfer, import, export, or reset failures logged.
- [ ] Sequential analyst start logged as `sequential_analyst_entry_single_host` or equivalent.
- [ ] Early exposure and collaboration logged.
- [ ] Baseline contamination logged.
- [ ] Abandoned/reclassified units and facilitator intervention logged.
- [ ] Misleading, wrong, trivial, duplicated, and missed findings preserved.
- [ ] Withdrawal recorded without unnecessary identifying detail.
- [ ] Every deviation marked include, exclude, rerun, or caveat.

Do not patch the protocol during the session to produce cleaner data.

## End and analyze

- [ ] Untouched raw exports preserved privately.
- [ ] Analysis copies created.
- [ ] Files use role labels rather than names.
- [ ] Three cases assembled into `experiment_result` shape.
- [ ] `npm run analyze -- your-merged-session.json` executed.
- [ ] Numerators, denominators, exclusions, and not-yet-scoreable notes reported.
- [ ] Predefined rubric applied.
- [ ] Continue, pivot, stop, or not-yet-scoreable decision recorded.
- [ ] Negative, null, misleading, and missing results reported with favorable results.
- [ ] v2.1 changes limited to repeated or materially important observed failures.
