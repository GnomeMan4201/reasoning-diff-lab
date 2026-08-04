# Limitations

## What this tool cannot do, on principle

- It cannot determine which analyst is correct.
- It cannot detect a contradiction from wording — only from an explicit reviewer decision.
- It cannot tell you whether an "Undeclared Support Gap" reflects bad reasoning or just
  reasoning the analyst didn't bother to fully declare under time pressure. It reports a
  syntactic fact, not a quality judgment.
- Its candidate-match score is plain lexical (Jaccard) overlap plus evidence/type overlap.
  It has no semantic understanding: paraphrases, synonyms, and negation can all fool it in
  either direction. This is why every match is a proposal a human must confirm, never a
  decision the system makes on its own.
- Its prose-splitting assist is a fixed set of keyword regexes (`src/prose_split.js`), not a
  model. It will misclassify sentences that don't contain its cue words; that's expected,
  which is why every draft unit requires explicit confirmation before it counts.

## Terminology and why it was changed from v1

| v1 term | v2 term | Reason |
|---|---|---|
| "unsupported reasoning" | **Undeclared Support Gap** | "Unsupported" implies the reasoning is actually weak. The engine only knows that no evidence_ref or depends_on was typed in — it cannot see whether the analyst had a real reason they simply didn't record. |
| "equivalent unit" (matched pair) | **Candidate Match**, then reviewer decision `same_position` | "Equivalent" implies a verified, provable equality. A lexical score is a proposal; a human decision that the units assert the same position is still a judgment, not a proof — hence "same position," not "equivalent." |
| inferred contradiction | **Reviewer-confirmed contradiction** | The engine has never inferred contradiction from wording, in v1 or v2 — this rename makes that guarantee explicit in the label itself, not just in the code comments. |
| "truth disagreement" / implied verdict | **Observed divergence** | Every event this tool produces is a structural fact about what was declared and how it was matched — never a claim about which side is true. |

## The largest unresolved risk: ecological validity of structured entry

Forcing analysts into five typed categories, explicit evidence references, and explicit
dependencies is a real cognitive cost compared to writing prose. Two specific ways this could
undermine any future finding, even a positive one:

1. **Burden dominates signal.** If entry burden is high, analysts may rush, under-declare
   evidence/dependencies, and produce artificially many "Undeclared Support Gap" events that
   reflect time pressure rather than actual reasoning quality. The pilot logs
   `validation_errors` and `abandoned_fields` specifically to catch this — a high count on
   either is a warning sign to flag in the writeup, not a number to quietly average away.
2. **The two entry modes may not be equivalent.** Mode B (prose-first) exists specifically to
   test whether removing the upfront structuring burden changes the result. If Mode A and
   Mode B produce very different entry-burden numbers, that is itself a finding worth
   reporting on its own, independent of whether the core hypothesis holds.

Nothing in this codebase resolves this risk — it can only be resolved by running the pilot
and reading the entry-burden and validation-error numbers honestly.

## Known engine limitations by design (not bugs)

- `undeclared_support_gap` will fire on a genuinely well-supported claim if the analyst
  simply forgot to tick the evidence checkbox. This is accepted as a known false-positive
  mode in exchange for never guessing support that wasn't declared.
- `convergent_conclusion_different_path` and `divergent_conclusion_shared_evidence` only
  compare `depends_on`/`evidence_refs` as declared; if either analyst under-declares
  dependencies, these events may under- or over-fire. They cannot see reasoning that
  happened in the analyst's head but never got typed into the tool.
- The matcher never traverses synonyms or negation. "Caused" and "did not cause" will
  register some lexical overlap and could be suggested as a candidate match; only the
  reviewer's decision (and, if applicable, the explicit contradiction checkbox) determines
  what the engine does with that pair.

## What would invalidate a future positive result

If a pilot run shows strong useful precision and low burden, treat that as provisional until
you can rule out:

- The reviewer grading their own suggested matches generously because they picked them
  (a version of the anchoring risk — this is why `blind` mode exists as a comparison arm).
- The three shipped cases being unrepresentative of real analytic work the tool would
  actually be used for (all three are incident/cause-style questions; a next-stage study
  should include other domains before generalizing).
- A single enthusiastic reviewer's reuse-intent score standing in for a real user base.

## Data and privacy

Everything runs locally; the only network activity `web/app.js` performs is `fetch()` calls
to files under `../fixtures/` on the same server the facilitator started with `npm start`.
Session data lives in the browser's `localStorage` (for autosave/draft recovery within a
session) and is only written to a file on disk when a participant clicks an export button.
There is no remote server, account system, or telemetry.
