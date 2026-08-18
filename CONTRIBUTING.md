# Contributing to Reasoning Diff Lab

Reasoning Diff Lab is a research instrument before it is a general-purpose product. Contributions are welcome when they improve correctness, reproducibility, reviewability, pilot safety, or the clarity of the evidence produced by the instrument.

The current public release is **v2.0.1** and is **internally verified but empirically unvalidated**. Please preserve that distinction in code, documentation, issues, and pull requests.

## Good contribution targets

Useful contributions include:

- regression tests for observed bugs or protocol invariants;
- reproducibility and fresh-install improvements;
- accessibility and usability fixes that do not silently change pilot semantics;
- documentation corrections where behavior and docs have drifted;
- fixture-integrity and export/import validation;
- analysis/reporting fixes with explicit expected behavior;
- pilot feedback submitted through the existing pilot-feedback issue template;
- clearly bounded refactors that preserve deterministic outputs.

Before opening a larger design change, start with an issue that explains the problem, the evidence for it, and the smallest proposed change.

## Changes that need extra scrutiny

The following are part of the research protocol, not ordinary UI preferences:

- reasoning taxonomy;
- matcher weights;
- engine rules;
- event catalog;
- scoring thresholds;
- analysis formulas;
- pilot questions;
- baseline-before-structured-review ordering;
- analyst/reviewer separation or timing requirements.

Changes to these surfaces must include a protocol rationale, updated documentation, and regression coverage. Do not change them merely to make a result look better or to remove an inconvenient negative outcome.

## Development setup

Requirements:

- Node.js 20 or newer;
- no runtime package dependencies beyond the repository itself.

Run the full verification path before submitting a pull request:

```bash
npm run verify
```

That executes the test suite, rebuilds the browser artifact, and runs the repository smoke validation.

For local use:

```bash
npm start
```

The server binds to `127.0.0.1:4173` by default.

## Pull request expectations

Keep pull requests narrow and evidence-backed.

A useful PR description should state:

1. the observed problem or limitation;
2. the smallest change that addresses it;
3. which behavior is intentionally unchanged;
4. the validation performed;
5. any remaining uncertainty or protocol impact.

For behavior changes, add or update tests that fail on the old behavior and pass on the proposed behavior. Avoid unrelated cleanup in the same PR.

## Research and evidence discipline

Please preserve the repository's claim boundaries:

- internal verification is not evidence of human usefulness;
- one pilot is formative, not generalizable validation;
- generated comparison events are review aids, not truth judgments;
- candidate matches are suggestions until the reviewer accepts, rejects, or manually aligns them;
- negative and null results are valid outcomes and should remain visible.

If a contribution changes what the instrument can legitimately claim, update the relevant verification or protocol documentation in the same PR.

## Pilot feedback and participant data

Use `.github/ISSUE_TEMPLATE/pilot-feedback.md` for public pilot feedback.

Do **not** commit or paste participant-identifying data, private session exports, raw analyst paths containing sensitive material, secrets, or unredacted local logs into issues or pull requests. Public examples should use the repository's included fixtures or sanitized synthetic material.

The pilot instrument is frozen on `release/v2.0.1`; follow `PILOT_RUNBOOK.md` and the linked readiness/checklist documents when conducting an actual pilot.

## Security reports

Do not file sensitive security findings as public issues. Follow [`SECURITY.md`](SECURITY.md) for the repository's reporting boundary.

## Review standard

A contribution is ready when another reviewer can understand **what changed, why it changed, how it was verified, and what the change does not prove** without relying on private context.
