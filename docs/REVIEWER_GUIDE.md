# Reviewer Guide

You did not write either reasoning path. Your job is to judge how the two relate, and then
to judge how useful the tool's report actually was. Both jobs matter.

## Matching

For each pair the tool shows you (or each pair you add manually), pick one:

- **Same position** — both units assert the same substantive point. This does not require
  identical wording.
- **Related, distinct** — the two units are clearly about the same thing but assert
  different things (a different cause, a different confidence, a different scope).
- **Unrelated** — no meaningful connection; this pair will not be compared further.

If you check **"reviewer-confirmed contradiction,"** you are asserting that both statements
cannot be true at the same time given the shared evidence — not merely that they disagree in
emphasis or tone. The tool never guesses this for you; if it's not checked, no contradiction
event is produced, no matter how the text reads.

## Review modes

You may be assigned one of three modes for a given case:

- **Blind**: you see no suggested pairs at all. Match everything manually. This is slower,
  but it is the condition that tells us whether the suggestion feature is actually helping
  or just making you faster at rubber-stamping.
- **Suggested, hidden score**: you see candidate pairs, but not how confident the matcher is.
- **Suggested, visible score**: you see the pairs and a percentage score.

Do not try to "beat" whichever mode you're in — just match as carefully as you would if no
tool existed. If a suggested pair looks wrong, reject it and match the units yourself; the
score is a hint from a simple keyword-overlap calculation, not a semantic judgment, and it
will sometimes be wrong.

## Grading

Once the report is generated, grade every event using these six labels — see
`docs/SCORING_RUBRIC.md` for the full definitions:

`useful, non-obvious` · `useful, but obvious` · `accurate, low value` · `misleading` ·
`wrong` · (separately) `missing` — an important divergence you believe is real that the
report didn't surface at all.

Grade honestly even if a grade makes the tool look bad. A pilot where every event is
"useful, non-obvious" is more likely to indicate lenient grading than a strong tool.

## Things the report will never tell you

- Which analyst is more skilled.
- Whether either analyst's conclusion is actually correct.
- Whether a "contradiction" you didn't check is secretly there — it only reports what you
  confirmed.
- Whether an "Undeclared Support Gap" means the reasoning is bad — it only means no evidence
  or dependency was declared for that unit. People sometimes have good reasons they simply
  didn't type in.

If you find yourself wanting the tool to make a judgment call for you, that's useful
information for the pilot — write it down for the post-session interview.
