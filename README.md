# Reasoning Diff Lab

A local-first research instrument for pilot-testing one hypothesis:

> Comparing two independently produced structured reasoning paths can reveal useful, non-obvious divergences that improve analytical review.

**Status: v2.0.1 released, internally verified, and empirically unvalidated.** The deterministic engine, reports, included fixtures, and pilot-safety invariants pass automated verification. No human pilot has established usefulness, usability, scientific validity, or demand.

> **Pilot recruitment is open. Do not schedule participants until the host/device arrangement passes the cold rehearsal in [Issue #3](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/3).** Volunteer through [Issue #1](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/1).
>
> The pilot instrument is frozen on [`release/v2.0.1`](https://github.com/GnomeMan4201/reasoning-diff-lab/tree/release/v2.0.1). Use the [readiness audit](docs/PRE_PILOT_READINESS_AUDIT.md), [session checklist](docs/PILOT_SESSION_CHECKLIST.md), and [runbook](PILOT_RUNBOOK.md).

## Why this exists

Investigations preserve evidence and final conclusions more reliably than the assumptions, alternatives, confidence changes, and dependency chains connecting them. Reasoning Diff Lab makes two independently authored reasoning paths inspectable. A separate reviewer aligns comparable units, assesses contradiction independently, and a deterministic engine reports differences in evidence use, dependencies, confidence, declared support, and conclusions.

The tool does not determine truth, rank analysts, or decide which reasoning path is better.

## v2.0.1 safety corrections

A hostile pre-pilot review found browser-workflow defects that the original engine tests could not detect. v2.0.1 adds:

- participant-safe evidence packets separated from facilitator design notes;
- a separate non-pilot training demo;
- analyst role guards and explicit handoff flow;
- validated path download/import across devices;
- a real local reset control;
- mandatory baseline-before-structured-review gating;
- correct accepted/rejected/manual match logging;
- baseline and tool reviewer timing export;
- raw path preservation in private session logs;
- loopback-only server binding by default;
- 65 tests, built-artifact safety smoke checks, and GitHub Actions verification;
- accurate role-specific time commitments and simultaneous-analyst requirements.

The patch does not change the reasoning taxonomy, matcher weights, engine rules, event catalog, scoring thresholds, analysis formulas, or pilot questions.

## Known limitations

- Human usefulness and burden remain untested.
- Structured entry may cost more time than the review value it creates.
- The pilot taxonomy is not a universal model of human thought.
- Candidate matching is lexical and optional; every final alignment is a reviewer decision.
- Public reference paths require screening volunteers for prior exposure.
- A one-computer sequential analyst run is a protocol deviation.
- One analyst pair and one reviewer produce formative, non-generalizable evidence.
- No automated browser suite drives real file pickers, downloads, storage, or dialogs; the cold rehearsal remains mandatory.
- Local-first is not production-secure multi-user infrastructure.

## Pilot commitments

- Analyst A: about 60–90 minutes.
- Analyst B: about 60–90 minutes.
- Reviewer: about 90–120 minutes.
- Facilitator: about 2.5–3.5 hours total across role-specific blocks.

Both analysts must begin each case from the same evidence at the same time in isolated workspaces. The reviewer completes the prose-only baseline before viewing structured paths or suggestions.

## Start here

- Participant: [QUICKSTART.md](QUICKSTART.md)
- Facilitator: [PILOT_RUNBOOK.md](PILOT_RUNBOOK.md)
- Contributing and external review: [CONTRIBUTING.md](CONTRIBUTING.md)
- Go/no-go audit: [docs/PRE_PILOT_READINESS_AUDIT.md](docs/PRE_PILOT_READINESS_AUDIT.md)
- Checklist: [docs/PILOT_SESSION_CHECKLIST.md](docs/PILOT_SESSION_CHECKLIST.md)
- Coordination: [docs/PILOT_COORDINATION.md](docs/PILOT_COORDINATION.md)
- Analyst guide: [docs/ANALYST_GUIDE.md](docs/ANALYST_GUIDE.md)
- Reviewer guide: [docs/REVIEWER_GUIDE.md](docs/REVIEWER_GUIDE.md)
- Protocol: [docs/EXPERIMENT_PROTOCOL.md](docs/EXPERIMENT_PROTOCOL.md)
- Scoring: [docs/SCORING_RUBRIC.md](docs/SCORING_RUBRIC.md)
- Data contracts: [docs/DATA_DICTIONARY.md](docs/DATA_DICTIONARY.md)
- Verification boundary: [docs/VERIFICATION_REPORT.md](docs/VERIFICATION_REPORT.md)

## Run it

Requires Node.js 20 or newer and has zero runtime dependencies.

```bash
npm run verify
npm start
```

`npm start` serves on `http://127.0.0.1:4173` by default.

## Pilot flow

1. Train only with `demo-training`.
2. Analysts inspect the same participant-safe evidence simultaneously and independently.
3. Each analyst freezes and privately transfers a role-labeled path.
4. Reviewer imports both paths.
5. Reviewer completes and times the prose-only baseline first.
6. Reviewer performs the assigned structured review and assesses contradiction separately.
7. Generate and grade every event; record important missed divergences.
8. Export raw paths, reports, session logs, questionnaires, and deviations privately.
9. Run the predefined analysis and record **continue**, **pivot**, **stop**, or **not yet scoreable**.

## Verification boundary

A green `Verify` workflow establishes internal test, build, fixture-integrity, and pilot-safety invariant behavior. It does not establish useful findings, acceptable burden, complete divergence detection, reviewer-bias resistance, or practical usability. Those remain the pilot's job.

## License

[MIT](LICENSE)
