# Reasoning Diff Lab

A local-first research instrument for pilot-testing one hypothesis:

> Comparing two independently produced structured reasoning paths can reveal useful,
> non-obvious divergences that improve analytical review.

**Status: pilot-ready, empirically unvalidated.** No human trial has been run. Nothing in
this repository should be read as evidence that the hypothesis is true. See
[docs/VERIFICATION_REPORT.md](docs/VERIFICATION_REPORT.md) for exactly what has and has not
been checked, and [docs/LIMITATIONS.md](docs/LIMITATIONS.md) for what this tool cannot do.

## What changed from v1

v1 was a working prototype with one synthetic case and no run trials. v2 (this repository) is
the pre-pilot package: the same narrow engine, hardened and re-scoped around the specific
risks named in review — reviewer anchoring, analyst entry burden, and the gap between "the
code runs" and "the hypothesis is supported." See the scorecard at the bottom of
[docs/DEVELOPER_HANDOFF.md](docs/DEVELOPER_HANDOFF.md).

## Start here

- New participant in a pilot? Read [QUICKSTART.md](QUICKSTART.md) — under five minutes.
- Facilitating a pilot session? Read [PILOT_RUNBOOK.md](PILOT_RUNBOOK.md).
- Analyst? Read [docs/ANALYST_GUIDE.md](docs/ANALYST_GUIDE.md).
- Reviewer? Read [docs/REVIEWER_GUIDE.md](docs/REVIEWER_GUIDE.md).
- Developer taking this over? Read [docs/DEVELOPER_HANDOFF.md](docs/DEVELOPER_HANDOFF.md).

## Run it

```bash
npm test      # 58 tests against the production modules
npm run build # static build into dist/
npm start     # serves dist/ at http://localhost:4173
npm run verify # test + build + smoke test against the BUILT artifact
```

CLI:

```bash
npm run compare -- \
  --a fixtures/cases/case-01-straightforward/path-a.json \
  --b fixtures/cases/case-01-straightforward/path-b.json \
  --decisions fixtures/cases/case-01-straightforward/reviewer-decisions.json \
  --out reports/case-01.md --json reports/case-01.json --csv reports/case-01.csv

npm run analyze -- fixtures/sample-session.json   # pilot-level statistics (sample data only)
```

## Terminology (see docs/LIMITATIONS.md for the full rationale)

| Old / avoided term | Used term | Why |
|---|---|---|
| unsupported reasoning | Undeclared Support Gap | it is a syntactic fact about what was declared, not a truth judgment |
| equivalent unit | Candidate Match / same_position | a suggestion is never a verified equivalence |
| inferred contradiction | Reviewer-confirmed contradiction | the engine never infers contradiction from wording |
| truth disagreement | Observed divergence | the engine reports structure, not truth |

## Three pilot cases

`fixtures/cases/case-01-straightforward`, `case-02-ambiguous`, `case-03-noisy` — each with its
own `case.json` (instructions, expected risks, and a design note not to be shown to
participants before grading), two reasoning paths, and golden reviewer decisions. See
[docs/EXPERIMENT_PROTOCOL.md](docs/EXPERIMENT_PROTOCOL.md) for the full pilot design.

## Next step

Do not add scope. Run the pilot in `docs/EXPERIMENT_PROTOCOL.md` with two analysts, one
reviewer, and these three cases, using `PILOT_RUNBOOK.md`. Feed the results into
`cli/analyze.js`. Only expand this tool after a real pilot clears the continue criteria in
`docs/SCORING_RUBRIC.md`.
