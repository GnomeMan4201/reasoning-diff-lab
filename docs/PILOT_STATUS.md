# Pilot Status

**Instrument:** frozen on [`release/v2.0.0`](https://github.com/GnomeMan4201/reasoning-diff-lab/tree/release/v2.0.0)  
**Current phase:** participant recruitment  
**Empirical status:** no human pilot completed yet

## Roles

| Role | Status | Notes |
|---|---|---|
| Analyst A | Open | Must not have seen the fixture design notes or reference paths |
| Analyst B | Open | Must work independently from Analyst A |
| Reviewer | Open | Must not author either analyst path |
| Facilitator | Available | Uses the runbook and records protocol deviations |

Volunteer through [Issue #1](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/1). Do not post sensitive or private case material.

## Readiness

- [x] v2.0.0 implementation imported
- [x] 58 automated tests passing in the verification environment
- [x] Static build and smoke test documented
- [x] Three synthetic fixture cases included
- [x] Experiment protocol included
- [x] Analyst and reviewer guides included
- [x] Facilitator packet and full runbook included
- [x] Scoring rubric and data dictionary included
- [x] Pilot session checklist included
- [x] Recruitment issue open
- [ ] Analyst A confirmed
- [ ] Analyst B confirmed
- [ ] Reviewer confirmed
- [ ] Session date agreed
- [ ] Technical preflight completed on the facilitator machine
- [ ] Pilot session completed
- [ ] Session data analyzed
- [ ] Continue / pivot / stop / not-yet-scoreable decision recorded

## Change boundary

Until the first pilot is complete, changes to `main` should be limited to:

- broken links;
- documentation corrections that do not alter the protocol;
- reproducible defects that prevent the frozen instrument from running;
- recruitment and session-coordination material.

Do not change the taxonomy, fixture content, diff rules, reviewer decision model, scoring thresholds, or experimental conditions during recruitment or an active session. Record discovered problems for a later version instead.
