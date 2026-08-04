# Scoring Rubric (v2)

This file defines exact formulas, thresholds, and decision rules. Implementations of every
formula live in `src/analysis.js` and are unit-tested in `tests/analysis.test.js`. Do not
hand-compute these differently than the code does — if you disagree with a formula, change
`src/analysis.js` and its tests, not just this document.

## Event grading (reviewer applies one grade per generated event)

| Grade | Meaning |
|---|---|
| `useful_nonobvious` | Accurate, and changed a question, decision, or follow-up the reviewer would not have reached quickly on their own. |
| `useful_obvious` | Accurate, but a normal prose review would have found it immediately anyway. |
| `accurate_low_value` | True, but has no practical consequence for the reviewer's task. |
| `misleading` | Technically defensible given the declared structure, but likely to cause a wrong impression. |
| `wrong` | Not supported by the underlying paths as declared. |
| `missing` | Not a grade on a generated event — instead, logged separately as a `missing_divergences` entry when the reviewer identifies an important divergence the report did not surface. |

## Formulas

All formulas below show numerator, denominator, and the exact zero-denominator behavior.
"n/a" always means the code returns `value: null` with an explanatory `note` — never a
silent 0 or 1.

### Useful precision
`useful_nonobvious + useful_obvious` graded events ÷ all graded events (after excluding any
event ids logged as a `protocol_deviation` exclusion).
Zero denominator (no graded events): n/a — "no graded events."

### Misleading-event rate
`misleading + wrong` graded events ÷ all graded events (same exclusions as above).
Zero denominator: n/a.

### Important-divergence recall
`useful_nonobvious` events marked `importance: "important"` ÷ (that count + `missing_divergences`
marked `importance: "important"`).
Zero denominator (no important divergences identified by anyone): n/a, explicitly noted as
**not the same as perfect recall** — it means the case did not surface anything either side
considered important.

### Entry burden
Median `total_ms` across **completed** (`completion: true`) analyst sessions, converted to
minutes. Incomplete/abandoned sessions are excluded and the exclusion count is reported, not
silently dropped.
Zero denominator (no completed sessions): n/a.

### Reviewer time delta (tool vs. baseline)
Mean `total_ms` in the `tool` condition minus mean `total_ms` in the `baseline_prose`
condition, in minutes. Negative = tool was faster.
Missing a condition entirely: n/a (not zero, and not assumed favorable or unfavorable).

### Matcher acceptance rate
`accepted` ÷ (`accepted` + `rejected`) among logged suggested-match decisions. Manual-only
logs (e.g. blind mode) are excluded from this denominator, not counted as rejections.
Zero denominator: n/a.

### Manual-match rate
Reviewer decisions with `match_source: "manual"` ÷ all reviewer decisions.
Zero denominator (no decisions logged): n/a.

### Reuse intent
Median of 1–5 self-reported reuse intent across all participants who answered.
Zero denominator: n/a.

### Anchoring comparison
Per review mode (`blind`, `suggested_hidden_score`, `suggested_visible_score`): n, matcher
acceptance rate, median time-to-match. Reported as three side-by-side groups. **There is no
single anchoring score** — a reader must compare the groups directly, because collapsing
three conditions into one number is exactly the kind of composite this rubric forbids.

## Continue criteria

Continue past this pilot only if **all** of the following hold across the three cases:

- Useful precision ≥ 0.70 (computed with the case-2 caveat below).
- Misleading-event rate ≤ 0.10.
- At least one `useful_nonobvious` event in at least two of the three cases.
- Median entry burden ≤ 15 minutes for the straightforward case (case 1); noisier cases may
  run longer but should be reported, not silently excluded from the decision.
- Reviewer time delta (tool vs. baseline) is negative (tool faster) **or** important-
  divergence recall with the tool is clearly higher than what the reviewer found unassisted
  in the baseline condition — the tool must win on at least one of these, not merely look
  interesting.
- At least two of three participants report reuse intent of 4 or 5.
- Matcher acceptance rate in `suggested_visible_score` is not dramatically higher than in
  `blind`/`suggested_hidden_score` in a way that coincides with a higher misleading rate
  (i.e., no clear anchoring-driven quality drop).

**Case 2 caveat**: case 2 has no designed correct answer. Compute useful precision for case 2
using only the reviewer's own grading (never against a hidden key), and report it alongside,
not blended into, the case 1/3 numbers, since case 2 is testing a different thing
(tolerance of genuine ambiguity, including a real contradiction) than cases 1 and 3.

## Pivot criteria

Pivot (redesign a specific component, then re-run a small check before a full pilot) if:

- Entry burden is high specifically in Mode B (prose-assisted) but not Mode A, or vice versa
  — pivot the underspecified mode's UI, not the whole tool.
- Acceptance rate is much higher in `suggested_visible_score` than in `blind`, with a
  corresponding rise in misleading/wrong grades — pivot the default review mode toward
  hidden-score or blind before re-testing usefulness.
- Reviewers can consistently point to specific report language that reads as more certain
  than the engine actually established — pivot the terminology/report wording, not the
  underlying logic.

## Stop criteria

Pause or redesign the whole approach — not just a component — if any of these persist across
all three cases:

- Useful precision below 0.50.
- Reviewer time with the tool exceeds baseline time in every case.
- Analysts cannot reliably distinguish observation / assumption / inference / claim even
  after training (validation errors stay high on the second case after the first case's
  errors were explained).
- Most of the value reviewers describe comes from re-reading the raw prose themselves, not
  from the structured comparison.
- Important divergences are repeatedly found in `missing_divergences`, not in the report.
- All three participants report reuse intent of 1 or 2.

## What "not yet scoreable" means

Any metric above that returns `value: null` in a real pilot's `analyze` output should be
reported in the writeup as **"not yet scoreable"**, with the reason from its `note` field —
never rounded to 0, omitted, or explained away. A metric with no data is a gap in the pilot,
not a negative result.
