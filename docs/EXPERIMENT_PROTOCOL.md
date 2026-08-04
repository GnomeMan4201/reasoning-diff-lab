# Experiment Protocol (v2)

## Research question

Does structured comparison of two independently produced reasoning paths reveal accurate,
useful, non-obvious divergences that a normal (prose-only) review misses or takes longer to
find — without a burden on analysts or reviewers that outweighs that benefit?

This is one research question with two failure-independent halves: **usefulness** (does it
find good things a baseline misses?) and **cost** (is entry/review burden acceptable?). A
result can pass one half and fail the other; report them separately, not as one pass/fail.

## Participants

- Two analysts who work independently (see inclusion/exclusion in `PILOT_RUNBOOK.md`).
- One reviewer who authored neither path.
- Three cases, shipped in `fixtures/cases/`: straightforward, genuinely ambiguous, and
  noisy/incomplete. None of the three cases is designed merely to force a divergence; case 2
  has no single correct answer, and case 3 is designed to test whether the tool over-flags
  noise as signal.

This is a **pilot**, not a powered study: n=2 analysts × 1 reviewer × 3 cases. Its purpose is
to produce a continue/pivot/stop decision and to surface failure modes cheaply, not to
produce a publishable effect size. See "Next-stage study" below for what a powered study
would need.

## Two entry modes, tested within the same pilot

Every analyst may use either:
- **Mode A — Guided structured entry**: units authored directly in typed fields.
- **Mode B — Prose-first assisted structuring**: prose written first, then split by a fixed
  keyword heuristic (`src/prose_split.js`, no AI, fully offline) into editable drafts that
  must be explicitly confirmed before they count.

Record which mode each analyst used for each case (the tool logs this automatically). If time
allows, have each analyst use the *other* mode on a spare/demo case so you have within-subject
signal on which mode has lower burden — but do not require this if it would extend the
pilot past a single sitting.

## Three review modes, counterbalanced

- **Blind**: no candidate suggestions shown at all.
- **Suggested, hidden score**: candidate pairs shown, match score hidden.
- **Suggested, visible score**: candidate pairs shown with match score.

Assign modes to cases per the Latin square in `PILOT_RUNBOOK.md` so no mode is confounded
with case difficulty. This directly tests the anchoring-bias risk named in the prior review:
if acceptance rate or match agreement in `suggested_visible_score` diverges sharply from
`blind`, the matcher is very possibly anchoring reviewers rather than merely assisting them.

## Baseline condition (mandatory)

For every case, the reviewer also completes an unassisted, prose-only review (raw analyst
write-ups, no structure, no candidate matches, no report) under a fixed time box, timed
separately. The pilot's central usefulness measures are computed **relative to this
baseline**, not in isolation — see Primary measures below.

## Procedure

1. Freeze the shared evidence packet and exact research question for the case (already done
   in each `fixtures/cases/*/case.json` + `path-a.json`/`path-b.json` evidence blocks).
2. Give both analysts the evidence simultaneously; prevent collaboration.
3. Each analyst records their reasoning in their chosen entry mode, with evidence
   references, dependencies, and confidence. The tool logs entry time, edits, abandoned
   fields, and validation errors automatically.
4. Reviewer completes the **baseline condition** first for that case (to avoid contaminating
   their prose-only judgment with structure they've already seen), timed manually.
5. Reviewer then completes tool-assisted matching under the case's assigned review mode,
   confirms/rejects/adds matches, and generates the report.
6. Reviewer grades every generated event using `docs/SCORING_RUBRIC.md`, and separately lists
   any important divergence they believe is real but was not reported (`missing_divergences`).
7. Post-session interview (see `PILOT_RUNBOOK.md`) with all participants.
8. Repeat for all three cases; export session data after each.

## Event grading (see docs/SCORING_RUBRIC.md for the exact rubric table)

Six grades: useful & non-obvious, useful but obvious, accurate but low value, misleading,
wrong, missing. Grading happens per event, by the reviewer, before any group discussion of
the case's design note.

## Primary measures (exact formulas in src/analysis.js and docs/SCORING_RUBRIC.md)

- Useful precision
- Misleading-event rate
- Important-divergence recall
- Entry burden (median minutes, by mode)
- Reviewer time: tool-assisted vs. baseline (minutes, signed — negative means the tool was
  faster)
- Matcher acceptance rate and manual-match rate (by review mode, for anchoring comparison)
- Reuse intent (median, 1–5)

## Continue / pivot / stop criteria

See `docs/SCORING_RUBRIC.md` for the exact predefined thresholds. In short: continue only if
usefulness clears its bar **and** burden clears its bar **and** the tool beats baseline on
reviewer time or important-divergence recall. A tool that finds good things slower than
prose review, or a tool nobody wants to use twice, does not get to continue merely because
its precision number looks fine in isolation.

## Bias controls

- Counterbalance review mode across cases (Latin square above).
- Do not reveal any case's `design_note_do_not_show_before_grading` to analysts or the
  reviewer before grading is complete.
- Freeze the six-grade rubric before any session starts; do not add or redefine grades
  mid-pilot.
- Preserve raw paths, all reviewer decisions (including rejected suggestions), full timing
  logs, and interview notes — not only the final report.
- Report failures and missed divergences as prominently as successes in the writeup.
- Log every deviation from `PILOT_RUNBOOK.md` as a `protocol_deviation`, and report how each
  was handled (excluded / included with caveat / re-run).

## Null-result interpretation

A null result here is not "nothing happened" — it is informative and must be reported as
such. Distinguish between these outcomes explicitly in the writeup:

- **Clean null**: useful precision and recall are both low across all three cases, burden is
  acceptable, and reuse intent is low. Interpretation: the comparison method itself likely
  does not add value over prose review for this kind of task. Stop, per
  `docs/SCORING_RUBRIC.md`.
- **Burden-confounded null**: usefulness measures are inconclusive because entry/review
  burden was so high that analysts or the reviewer visibly disengaged (rushed entries, many
  validation errors, terse grading). Interpretation: the hypothesis is untested, not
  refuted. Pivot to a lower-burden entry design before concluding anything about
  usefulness.
- **Anchoring-confounded null**: reviewers rubber-stamped suggested matches in
  `suggested_visible_score` mode at a much higher rate than in `blind` mode, and misleading
  rate was correspondingly higher. Interpretation: the *hypothesis* may still be true, but
  the current matcher/UI is contaminating the measurement. Pivot the review-mode default to
  blind or hidden-score before re-testing usefulness.
- **Small-n noise**: any one case producing an outlier result (e.g., one case has zero
  divergences) is not, by itself, evidence for or against the hypothesis at n=1 case per
  condition. Report it as a data point, not a conclusion.

## Next-stage study (if the pilot clears continue criteria)

- Increase to at least 6–10 analyst pairs and 3–4 reviewers across a wider case set spanning
  multiple domains (not just incident-review-style cases), to test generalization.
- Pre-register the continue/stop thresholds again for the larger study; do not reuse the
  pilot's thresholds as if they were confirmed.
- Consider replacing the lexical matcher with a semantically aware one only after the
  lexical version has been shown, empirically, to be a bottleneck (e.g., low acceptance rate
  driven by missed paraphrases) — not before.
- Only at this stage does multi-user, persistent, or collaborative infrastructure become
  worth considering, and only for the specific bottlenecks the pilot data identifies.
