# Pilot Session Checklist

Use this as the short operational checklist for the first Reasoning Diff Lab pilot. The full rules remain in [`PILOT_RUNBOOK.md`](../PILOT_RUNBOOK.md) and [`EXPERIMENT_PROTOCOL.md`](EXPERIMENT_PROTOCOL.md).

## Freeze the instrument

- [ ] Use the frozen [`release/v2.0.0`](https://github.com/GnomeMan4201/reasoning-diff-lab/tree/release/v2.0.0) branch.
- [ ] Do not change the taxonomy, fixture cases, comparison rules, scoring thresholds, or review modes during a session.
- [ ] Record any unavoidable deviation instead of silently correcting it.

## Confirm the people

- [ ] Analyst A confirmed.
- [ ] Analyst B confirmed.
- [ ] Reviewer confirmed and did not author either path.
- [ ] Facilitator confirmed.
- [ ] Nobody has previously seen the fixture design notes or reference answers.
- [ ] Participants understand that the initial pilot uses synthetic evidence only.

Do not put participant names, private case material, credentials, client information, medical information, or other sensitive data in public GitHub issues.

## Technical preflight

- [ ] Clone or download `release/v2.0.0`.
- [ ] Confirm Node.js 20 or newer.
- [ ] Run `npm test` and confirm 58 tests pass with 0 failures.
- [ ] Run `npm run build` successfully.
- [ ] Run `npm start` and open the local URL.
- [ ] Confirm local browser storage can be reset between participants.
- [ ] Confirm export downloads work on the facilitator machine.
- [ ] Prepare a manual timer for the prose-only baseline condition.

Stop the pilot if tests or the build fail on the checkout being used.

## Prepare the session

- [ ] Choose and record the review-mode assignment before starting.
- [ ] Keep analysts physically or digitally separated until both paths are frozen.
- [ ] Hide every `design_note_do_not_show_before_grading` field.
- [ ] Give analysts the Quickstart and completed demo only.
- [ ] Give the reviewer the reviewer guide and scoring rubric.
- [ ] Read the consent language in `PILOT_RUNBOOK.md` verbatim.
- [ ] Confirm each participant agrees before logging begins.

## Run each case

- [ ] Start Analyst A and Analyst B from the same evidence packet and exact question.
- [ ] Confirm neither analyst can see the other path.
- [ ] Freeze both initial paths before review begins.
- [ ] Run the prose-only baseline and record its duration manually.
- [ ] Have the reviewer complete alignment decisions without group discussion.
- [ ] Assess contradiction separately from semantic similarity.
- [ ] Generate the deterministic report.
- [ ] Have the reviewer grade every surfaced event before revealing design notes.
- [ ] Record important divergences the tool missed.
- [ ] Export the report and session log.

## Record failures honestly

- [ ] Log technical failures.
- [ ] Log skipped or misunderstood steps.
- [ ] Log accidental information exposure.
- [ ] Log abandoned or repeatedly reclassified reasoning units.
- [ ] Log misleading, trivial, or duplicated findings.
- [ ] Log participant withdrawal without unnecessary personal detail.

Do not repair the protocol mid-session to produce a cleaner result.

## End the session

- [ ] Ask the four post-session interview questions in `PILOT_RUNBOOK.md`.
- [ ] Record reuse intent separately for each participant.
- [ ] Confirm exported files contain role labels rather than names unless naming was explicitly agreed.
- [ ] Merge the three case logs into one session file.
- [ ] Run `npm run analyze -- your-merged-session.json`.
- [ ] Compare the output with `SCORING_RUBRIC.md`.
- [ ] Record **continue**, **pivot**, **stop**, or **not yet scoreable**, including the evidence behind that decision.

## Afterward

- [ ] Preserve the untouched raw exports.
- [ ] Create a separate working copy for analysis.
- [ ] Do not publish participant-identifying material.
- [ ] Do not change v2.0.0 based on one person's preference alone.
- [ ] Open narrowly scoped issues for observed failures.
- [ ] Build v2.1 only from repeated or materially important pilot evidence.
