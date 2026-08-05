# Pilot Status

**Instrument:** v2.0.1 safety patch candidate in [PR #2](https://github.com/GnomeMan4201/reasoning-diff-lab/pull/2)  
**Current phase:** recruitment plus pre-pilot verification  
**Empirical status:** no human pilot completed  
**Scheduling status:** blocked until v2.0.1 CI and host-machine rehearsal pass

## Roles

| Role | Status | Notes |
|---|---|---|
| Analyst A | Open | Must not have inspected reference paths, reviewer decisions, or design notes |
| Analyst B | Open | Must work independently from Analyst A |
| Reviewer | Open | Must not author either analyst path; baseline occurs before structured review |
| Facilitator | Available | Controls role changes, protected material, exports, and deviations |

Volunteer through [Issue #1](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/1). Move schedules and contact details to a private channel.

## Readiness

### Instrument and method

- [x] Deterministic reasoning model and comparison engine implemented
- [x] Three synthetic pilot cases included
- [x] Experiment protocol and predefined scoring rules included
- [x] Analyst, reviewer, facilitator, coordination, and data documents included
- [x] Recruitment issue open
- [x] v2.0.0 browser defects identified through hostile pre-pilot review
- [x] v2.0.1 candidate adds participant packets, separate demo, path transfer, role guards, reset, baseline gate, timing, rejection logging, loopback binding, tests, and CI
- [ ] v2.0.1 GitHub Actions verification passes on final candidate commit
- [ ] `release/v2.0.1` frozen from verified commit

### Host environment

- [ ] Working laptop or desktop identified
- [ ] Node.js 20 or newer confirmed
- [ ] Sixteen-step cold-machine rehearsal passes
- [ ] Private export location prepared
- [ ] Manual timer prepared
- [ ] Path transfer method rehearsed if multiple devices are used

### People and scheduling

- [ ] Analyst A confirmed and screened for fixture exposure
- [ ] Analyst B confirmed and screened for fixture exposure
- [ ] Reviewer confirmed and screened for fixture exposure
- [ ] Private coordination channel established
- [ ] Primary session date agreed
- [ ] Backup date agreed

### Completion

- [ ] Pilot session completed
- [ ] Raw exports inventoried and preserved privately
- [ ] Session data assembled and analyzed
- [ ] Continue / pivot / stop / not-yet-scoreable decision recorded
- [ ] Results note reports favorable, negative, null, misleading, and missing findings

## Change boundary

Before the first pilot, changes are allowed only when they correct a reproducible defect that would block or contaminate the session, repair contradictory operating instructions, or improve recruitment/coordination without changing the research question.

Do not change matcher weights, taxonomy, event rules, scoring thresholds, analysis formulas, research questions, or protected fixture expectations during recruitment or an active session.

## Source of truth

- Go/no-go: [`PRE_PILOT_READINESS_AUDIT.md`](PRE_PILOT_READINESS_AUDIT.md)
- Session rules: [`PILOT_RUNBOOK.md`](../PILOT_RUNBOOK.md)
- Short checklist: [`PILOT_SESSION_CHECKLIST.md`](PILOT_SESSION_CHECKLIST.md)
- Research design: [`EXPERIMENT_PROTOCOL.md`](EXPERIMENT_PROTOCOL.md)
- Scoring: [`SCORING_RUBRIC.md`](SCORING_RUBRIC.md)
