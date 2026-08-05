# Pilot Status

**Instrument:** frozen [`release/v2.0.1`](https://github.com/GnomeMan4201/reasoning-diff-lab/tree/release/v2.0.1)  
**Implementation status:** internally verified  
**Empirical status:** no human pilot completed  
**Current phase:** recruitment plus hardware/cold-rehearsal preparation  
**Scheduling status:** blocked only by [Issue #3](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/3), participant confirmation, and session logistics

## Roles

| Role | Status | Commitment | Notes |
|---|---|---:|---|
| Analyst A | Open | 60–90 min | Must not have inspected protected fixtures |
| Analyst B | Open | 60–90 min | Begins simultaneously and works independently |
| Reviewer | Open | 90–120 min | Authored neither path; baseline occurs first |
| Facilitator | Available | 2.5–3.5 hr total | Controls devices, transfers, timing, exports, and deviations |

Volunteer through [Issue #1](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/1). Keep schedules, contact details, and path files private.

## Completed readiness

- [x] Deterministic model and comparison engine implemented
- [x] Three synthetic cases and separate training demo included
- [x] Participant-safe evidence packets separated from facilitator notes
- [x] Analyst/reviewer role guards implemented
- [x] Validated path download/import implemented
- [x] Reset, baseline gate, reviewer timings, and complete session export implemented
- [x] Suggested rejection logging corrected
- [x] Loopback server default and safety headers implemented
- [x] 65 tests passing
- [x] Static build and 22-event fixture smoke test passing
- [x] GitHub Actions verification passing
- [x] v2.0.1 safety patch merged through PR #2
- [x] `release/v2.0.1` frozen
- [x] Recruitment issue updated with accurate role-specific times
- [x] Comprehensive readiness audit, protocol, runbook, guides, checklist, and private session template aligned

## Remaining host gate

- [ ] Facilitator/reviewer computer identified
- [ ] Two simultaneous isolated analyst workspaces identified
- [ ] Node.js 20+ confirmed where required
- [ ] Private path-transfer and export storage prepared
- [ ] Sixteen-step cold rehearsal passes
- [ ] Manual backup timer prepared

Track these in [Issue #3](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/3).

## Remaining people and scheduling gate

- [ ] Analyst A confirmed and screened for fixture exposure
- [ ] Analyst B confirmed and screened for fixture exposure
- [ ] Reviewer confirmed and screened for fixture exposure
- [ ] Private coordination channel established
- [ ] Role-specific time commitments accepted
- [ ] Primary and backup role blocks agreed
- [ ] Review-mode assignment recorded before participant work

## Pilot completion gate

- [ ] Three cases completed under the protocol or deviations explicitly recorded
- [ ] Raw exports inventoried and preserved privately
- [ ] Event grades and missing divergences completed
- [ ] Session data assembled and analyzed
- [ ] Continue / pivot / stop / not-yet-scoreable decision recorded
- [ ] Results note reports favorable, negative, null, misleading, and missing findings

## Change boundary

Before the first pilot, change only reproducible defects that block or contaminate the session or correct contradictory instructions. Do not alter matcher weights, taxonomy, event rules, scoring thresholds, analysis formulas, research questions, or protected fixture expectations during recruitment or an active session.

## Sources of truth

- Go/no-go: [`PRE_PILOT_READINESS_AUDIT.md`](PRE_PILOT_READINESS_AUDIT.md)
- Session rules: [`PILOT_RUNBOOK.md`](../PILOT_RUNBOOK.md)
- Checklist: [`PILOT_SESSION_CHECKLIST.md`](PILOT_SESSION_CHECKLIST.md)
- Protocol: [`EXPERIMENT_PROTOCOL.md`](EXPERIMENT_PROTOCOL.md)
- Scoring: [`SCORING_RUBRIC.md`](SCORING_RUBRIC.md)
- Verification: [`VERIFICATION_REPORT.md`](VERIFICATION_REPORT.md)
