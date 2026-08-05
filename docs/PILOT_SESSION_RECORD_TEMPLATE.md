# Pilot Session Record Template

Copy this file into a private working location for each pilot. Do **not** commit completed copies containing participant availability, contact details, names, raw paths, prose, timing, or session data to the public repository.

## Session identity

- Session ID: `RDL-PILOT-YYYYMMDD-01`
- Instrument branch: `release/v2.0.1`
- Instrument commit:
- Session date:
- Time zone:
- Format: one-host sequential / separate devices / remote
- Facilitator role label:
- Private storage location:

## Role confirmation

Use role labels only.

| Role | Confirmed | Consent obtained | Fixture exposure screened | Completed session |
|---|---:|---:|---:|---:|
| Analyst A | No | No | No | No |
| Analyst B | No | No | No | No |
| Reviewer | No | No | No | No |

## Technical preflight

- [ ] Node.js 20 or newer confirmed.
- [ ] `npm run verify` completed with 65 tests, successful build, and safety smoke check.
- [ ] Server bound to `127.0.0.1` unless another setup was explicitly rehearsed.
- [ ] Separate training demo loaded.
- [ ] Participant evidence visible for all pilot cases.
- [ ] Analyst reviewer-screen lock confirmed.
- [ ] Path download confirmed.
- [ ] Path import confirmed.
- [ ] Wrong-case or altered-evidence import rejected.
- [ ] Baseline packet download confirmed.
- [ ] Baseline-duration gate confirmed.
- [ ] Rejected suggestion logging confirmed.
- [ ] Report and session-log exports reopened.
- [ ] Local reset confirmed.

Preflight notes:

## Case and mode assignment

| Case | Review mode | Case order | Baseline time box | Completed |
|---|---|---:|---:|---:|
| Case 1 — straightforward |  | 1 | 10 minutes | No |
| Case 2 — ambiguous |  | 2 | 10 minutes | No |
| Case 3 — noisy |  | 3 | 10 minutes | No |

Assignment recorded before participant work began: Yes / No

## Path handling

| Artifact | Created | Transfer needed | Imported/available in reviewer browser | Private filename/reference |
|---|---:|---:|---:|---|
| Analyst A path | No | No | No |  |
| Analyst B path | No | No | No |  |
| Prose-only baseline packet | No | N/A | N/A |  |

Transfer method:

Transfer or import problems:

## Timing summary

Authoritative timing belongs in the exported session data. This table is a facilitator cross-check. The order below is mandatory: baseline precedes tool-assisted review.

| Stage | Start | End | Notes |
|---|---|---|---|
| Consent and training demo |  |  |  |
| Analyst entry and path freeze |  |  |  |
| Prose-only baseline |  |  |  |
| Tool-assisted reviewer alignment |  |  |  |
| Event grading and missing divergences |  |  |  |
| Post-session interview |  |  |  |
| Export and reset |  |  |  |

## Protocol deviations

Record deviations as they happen. Do not silently fix or omit them.

| Time | Case | Stage | What happened | Likely impact | Action: include / exclude / rerun / caveat |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Export inventory

| Required artifact | Saved | Reopened | Private filename/reference | Public summary allowed? |
|---|---:|---:|---|---:|
| Case 1 Analyst A path | No | No |  | No |
| Case 1 Analyst B path | No | No |  | No |
| Case 1 report JSON/Markdown/CSV | No | No |  | Sanitized only |
| Case 1 session log | No | No |  | No |
| Case 2 Analyst A path | No | No |  | No |
| Case 2 Analyst B path | No | No |  | No |
| Case 2 report JSON/Markdown/CSV | No | No |  | Sanitized only |
| Case 2 session log | No | No |  | No |
| Case 3 Analyst A path | No | No |  | No |
| Case 3 Analyst B path | No | No |  | No |
| Case 3 report JSON/Markdown/CSV | No | No |  | Sanitized only |
| Case 3 session log | No | No |  | No |
| Baseline notes | No | No |  | No |
| Event grades | No | No |  | Aggregated only |
| Missing-divergence list | No | No |  | Aggregated only |
| Questionnaires and interview notes | No | No |  | Sanitized only |
| Protocol-deviation record | No | No |  | Sanitized summary |

## Immediate facilitator observations

Separate directly observed facts from interpretation.

### Directly observed

-

### Preliminary interpretation

-

## Participant responses

### Analyst A

- Reuse intent, 1–5:
- What was harder/easier than normal prose?
- Confusing terms or steps:

### Analyst B

- Reuse intent, 1–5:
- What was harder/easier than normal prose?
- Confusing terms or steps:

### Reviewer

- Reuse intent, 1–5:
- What was harder/easier than normal review?
- Confusing terms or steps:
- Effect of suggestions or visible scores:

## Data assembly

- [ ] Raw exports preserved untouched.
- [ ] Analysis copies created.
- [ ] `graded_events` completed.
- [ ] `missing_divergences` completed.
- [ ] `session_timings` merged.
- [ ] `reviewer_timings` contains baseline and tool conditions.
- [ ] `match_logs` merged with accepted, rejected, and manual outcomes.
- [ ] `reviewer_decisions_flat` merged.
- [ ] `questionnaires` completed.
- [ ] `protocol_deviations` completed.
- [ ] Merged file matches `fixtures/sample-session.json` shape.

## Analysis output

Command:

```bash
npm run analyze -- your-merged-session.json
```

Record each metric with numerator, denominator, exclusions, and note:

- Useful precision:
- Misleading-event rate:
- Important-divergence recall:
- Entry burden by mode:
- Reviewer time delta:
- Matcher acceptance rate:
- Manual-match rate:
- Reuse intent:
- Anchoring comparison by mode:
- Not-yet-scoreable metrics and reasons:

## Final pilot decision

- [ ] Continue
- [ ] Pivot
- [ ] Stop
- [ ] Not yet scoreable

Evidence supporting the decision:

Evidence against the decision:

Known limitations and deviations:

Next action permitted by the evidence:
