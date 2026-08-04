# Pilot Runbook

Audience: whoever is facilitating a pilot session. You should be able to run this without
contacting the author. If something here is ambiguous, log it as a protocol deviation
(see docs/DATA_DICTIONARY.md#protocol_deviation) rather than guessing silently.

## Before the session

1. Confirm you have: two analysts who will work independently, one reviewer who authored
   neither path, and roughly 90–120 minutes total across three cases.
2. Run `npm install --package-lock-only` is unnecessary — there are no dependencies. Run
   `npm test && npm run build` and confirm both succeed. If either fails, stop and do not
   run the pilot on this checkout.
3. Run `npm start` and open the printed URL on the machine(s) participants will use. The
   interface works on a phone browser; a laptop is easier for the analyst entry step.
4. Decide and record, in advance, the review-mode order for the three cases (counterbalance
   across sessions if you are running more than one pilot — see "Counterbalancing" below).
5. Print or share `docs/SCORING_RUBRIC.md` (analysts do not need it; only the reviewer does).
6. Read the consent language below to all participants and get their agreement before
   starting.

## Consent language (read aloud or share verbatim)

> You're being asked to take part in a short pilot test of a research prototype. You will
> either write a short analysis of a scenario, or review two people's analyses and note
> where you think they differ. Sessions take about 20–40 minutes per case. Your timing,
> edits, and typed responses will be logged locally on this machine only, tied to a role
> label (Analyst A / Analyst B / Reviewer) rather than your name, unless you choose to give
> your name for follow-up. Nothing you write is sent anywhere over a network - this tool runs
> entirely on this machine. You can stop at any point without giving a reason, and anything
> you've entered will simply not be exported. Do you agree to take part on these terms?

If anyone declines, do not proceed with them in that role.

## Withdrawal procedure

- A participant may withdraw at any time by telling the facilitator.
- Do not export or analyze that participant's session data. Delete their entries from
  local storage (in the browser: the "reset" action described in `docs/LIMITATIONS.md`, or
  simply do not click any export button and close the tab without saving).
- Log the withdrawal as a protocol deviation with reason "withdrawal", no other detail
  required.

## Roles

- **Analyst A / Analyst B**: work independently. Do not let them discuss the case with each
  other before both have saved a path. If they are in the same room, seat them so they
  cannot see each other's screens.
- **Reviewer**: must not be one of the two analysts on that case. Should not see either
  analyst's raw prose beforehand.
- **Facilitator (you)**: sets the review mode per case, times the baseline condition,
  administers the post-session interview, and holds the master copy of `case.json` files
  (which contain the design notes analysts and reviewers should not see before grading).

## Inclusion / exclusion criteria

- Include: anyone comfortable reading a short written scenario and typing in a web form.
- Exclude: anyone who authored or reviewed these specific fixture cases before (their
  responses would not be naive) — use different cases for them, or skip the pilot for them.

## Case ordering and counterbalancing

- With three cases and (if running more than one trio of participants) more than one
  session, rotate which review mode (`blind`, `suggested_hidden_score`,
  `suggested_visible_score`) is assigned to which case, so no single mode is always paired
  with the same difficulty level. A simple Latin square for three sessions:

  | Session | Case 1 mode | Case 2 mode | Case 3 mode |
  |---|---|---|---|
  | 1 | blind | suggested_hidden_score | suggested_visible_score |
  | 2 | suggested_hidden_score | suggested_visible_score | blind |
  | 3 | suggested_visible_score | blind | suggested_hidden_score |

- Present the three cases in a fixed order (1, 2, 3) unless you are running enough sessions
  to counterbalance case order too; if you do, log the order used per session.

## Blinding

- Analysts never see each other's work or the case's `design_note_do_not_show_before_grading`.
- The reviewer grades every event (see `docs/SCORING_RUBRIC.md`) **before** you reveal the
  design note to them, if you choose to reveal it at all.

## Training procedure

- Give each analyst the Quickstart (five minutes) and let them try the demo case
  (`Load a completed demo`) once before their real case, so their first real attempt isn't
  also their first exposure to the interface.
- Give the reviewer a two-minute walkthrough of the three decision buttons and the
  contradiction checkbox, using the demo case's generated report as an example.

## Timing procedure

- The tool logs analyst entry time and reviewer match-decision time automatically once you
  navigate steps in order; you do not need a separate stopwatch for those.
- For the baseline (prose-only) condition, time the reviewer manually from when they start
  reading to when they say they are done, and enter it as a `reviewer_timings` record with
  `condition: "baseline_prose"` in the session file (see `docs/DATA_DICTIONARY.md`).

## Baseline condition

For each case, in addition to the tool-assisted review, give the reviewer the two analysts'
raw prose (or, if they used guided entry, a plain read-out of their units as prose) with no
structure, no candidate matches, and no report. Ask them to list what they consider the
important differences within a fixed time box (10 minutes is reasonable for these case
sizes), then time them. This is the comparison condition the study needs — the tool must
be measured against this, not evaluated in isolation.

## Reviewer grading

After the tool-assisted report is generated for a case, the reviewer grades **every** listed
event using the six grades in `docs/SCORING_RUBRIC.md`, before any group discussion. The
reviewer also lists any divergence they believe is real and important but that they did not
see reported — these become `missing_divergences` entries.

## Post-session interview

Ask each participant, briefly:
1. Would you use this again for real work? (Not at all / Maybe / Yes) — this feeds
   `reuse_intent`.
2. What made this harder or easier than writing/reading normal prose?
3. Was anything about the terminology or workflow confusing?
4. (Reviewer only) Did seeing candidate match scores change how you decided, compared to
   when scores were hidden or absent?

## Data retention

- Session logs (timings, decisions, match logs) exported via the interface are plain JSON
  files on the facilitator's machine. Keep them only as long as needed for analysis, store
  them with role labels rather than names unless the participant explicitly consented to be
  named, and delete them once the pilot's `docs/EXPERIMENT_PROTOCOL.md` decision has been
  made and recorded.

## Protocol deviations

Log any deviation from this runbook — technical failure, a participant seeing something they
shouldn't have, a skipped step — as a `protocol_deviation` entry
(`docs/DATA_DICTIONARY.md#protocol_deviation`) rather than silently adjusting the numbers.
Deviations do not have to sink a case; they have to be visible in the writeup.

## After the session

1. Export the report (JSON/Markdown/CSV) and the session log from the Results screen for
   each case.
2. Merge the three cases' session data into one file matching the shape
   `fixtures/sample-session.json` demonstrates, and run:
   ```bash
   npm run analyze -- your-merged-session.json
   ```
3. Compare the output against the continue / pivot / stop criteria in
   `docs/SCORING_RUBRIC.md`. Record the decision and why, including any metric that was
   "not yet scoreable" due to missing data.
