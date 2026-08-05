# Experiment Protocol — v2.0.1

## Research question

Does structured comparison of two independently produced reasoning paths reveal accurate, useful, non-obvious divergences that normal prose-only review misses or takes longer to find—without analyst or reviewer burden outweighing the benefit?

Treat **usefulness** and **cost** as failure-independent outcomes. A result may pass one and fail the other; never collapse them into a favorable composite.

## Participants and scope

- Two analysts who work independently and begin from the same evidence simultaneously.
- One reviewer who authored neither path.
- Three synthetic cases: straightforward, genuinely ambiguous, and noisy/incomplete.
- One separate training demo that is excluded from pilot analysis.

This is a formative pilot: two analysts × one reviewer × three cases. It produces a continue/pivot/stop/not-yet-scoreable decision and surfaces failure modes. It cannot produce a generalizable effect size.

Expected role commitments are approximately 60–90 minutes per analyst and 90–120 minutes for the reviewer. Role blocks may be scheduled separately; the facilitator should reserve 2.5–3.5 hours total.

## Participant-safe evidence

The frozen participant question, instructions, and evidence are stored in:

```text
fixtures/cases/<case-id>/participant.json
```

Facilitator-only methodology and design notes remain in `case.json`. Public reference paths and reviewer decisions are not participant material. Screen volunteers for prior exposure.

## Analyst entry modes

Each analyst chooses one mode per case:

- **Guided structured entry:** units authored directly in typed fields.
- **Prose-first assisted structuring:** normal prose is split by a fixed offline heuristic into editable drafts that must be explicitly confirmed.

Record the selected mode automatically. Optional demo comparison between modes may be used for training observations but is not pilot evidence and must not extend or contaminate the three cases.

## Reviewer modes

- **Blind:** no candidate suggestions.
- **Suggested, hidden score:** candidate pairs without score.
- **Suggested, visible score:** candidate pairs with lexical score.

Counterbalance modes with the Latin square in `PILOT_RUNBOOK.md`. Assign before participant work. Do not switch after observing performance.

## Mandatory baseline

For every case, the reviewer first receives only the two analysts' unit text as a plain prose-only readout. The baseline contains no types, evidence links, dependencies, confidence, suggestions, or generated report. It is completed under a fixed time box before structured review.

The central usefulness comparison is relative to this baseline. A baseline viewed after structured review is contaminated and must be rerun, excluded, or explicitly treated as uninterpretable.

## Procedure

1. Freeze the participant-safe packet and exact question.
2. Give both analysts the packet simultaneously in isolated workspaces.
3. Analysts record, confirm, and freeze their reasoning without discussion.
4. Download and privately transfer the two role-labeled paths to the reviewer browser when separate workspaces are used.
5. Validate imported role, case, question, and exact evidence packet.
6. Reviewer completes the prose-only baseline first and the facilitator records duration and differences found.
7. Reviewer opens the assigned structured mode, confirms/rejects/adds matches, and assesses contradiction separately.
8. Generate the deterministic report.
9. Reviewer grades every reported event before group discussion or facilitator-note disclosure.
10. Reviewer separately records every important divergence they believe was missed.
11. Conduct role-specific post-session interviews.
12. Repeat for all three cases and export private raw data after each.

A one-computer sequential analyst workflow does not satisfy simultaneous exposure. Log it as `sequential_analyst_entry_single_host`; use it primarily for operational or burden observations rather than clean evidence for the central claim.

## Primary measures

Exact formulas are in `src/analysis.js` and `docs/SCORING_RUBRIC.md`:

- useful precision;
- misleading-event rate;
- important-divergence recall;
- entry burden by mode;
- tool-assisted reviewer time versus baseline;
- matcher acceptance rate;
- manual-match rate;
- reuse-intent median;
- anchoring comparison by review mode.

Report numerator, denominator, exclusions, and zero-denominator notes.

## Event grading

Use these grades for reported events:

- `useful_nonobvious`
- `useful_obvious`
- `accurate_low_value`
- `misleading`
- `wrong`

Record important unreported differences separately as `missing_divergences`; `missing` is not a grade attached to a generated event.

## Continue / pivot / stop criteria

Use the predefined thresholds in `docs/SCORING_RUBRIC.md`. Continue only when usefulness clears its bar, burden clears its bar, and the tool improves reviewer time or important-divergence recall relative to baseline. A precise tool that is slower, exhausting, or unwanted does not continue merely because one metric is favorable.

## Bias and contamination controls

- Simultaneous analyst exposure and independent work.
- Counterbalanced reviewer modes.
- Baseline before structured review.
- Separate training demo.
- Participant packets separated from facilitator notes and reference answers.
- Event grading before discussion or design-note disclosure.
- Preservation of accepted, rejected, and manual interactions.
- Frozen rubric and thresholds.
- Role-labeled raw paths, timing, decisions, grades, interviews, and deviations.
- Equal prominence for failures, misleading events, and missed divergences.

## Null-result interpretation

- **Clean null:** usefulness and recall remain low with tolerable burden and low reuse intent. Stop for this task class.
- **Burden-confounded null:** people rush, disengage, abandon fields, or cannot complete the workflow. The hypothesis remains insufficiently tested; pivot entry/review burden before retesting.
- **Anchoring-confounded result:** visible suggestions sharply change acceptance or misleading rates relative to blind mode. Pivot matcher presentation before interpreting usefulness.
- **Contaminated baseline:** reviewer saw structure or suggestions first. Rerun or exclude baseline comparisons.
- **Sequential-exposure limitation:** analyst start times differ on one host. Do not treat ordering as neutral.
- **Small-n noise:** a single case or trio is a data point, not a population conclusion.

## Next-stage study

Only after the pilot clears continue criteria:

- recruit at least 6–10 analyst pairs and 3–4 reviewers;
- use a broader and preferably privately held case set;
- pre-register thresholds again;
- plan sample size and target effects;
- test inter-reviewer reliability;
- consider semantic matching only when pilot evidence shows lexical matching is the bottleneck;
- add persistent or collaborative infrastructure only for observed workflow needs.
