# Pilot Session Record Template

Copy this file into a private working location for each pilot session. Do **not** commit completed copies containing participant availability, contact details, names, or raw session data to the public repository.

## Session identity

- Session ID: `RDL-PILOT-YYYYMMDD-01`
- Instrument branch: `release/v2.0.0`
- Instrument commit:
- Session date:
- Time zone:
- Format: co-located / remote
- Facilitator role label:

## Role confirmation

Use role labels only.

| Role | Confirmed | Consent obtained | No prior fixture exposure | Completed session |
|---|---:|---:|---:|---:|
| Analyst A | No | No | No | No |
| Analyst B | No | No | No | No |
| Reviewer | No | No | No | No |

## Technical preflight

- [ ] Node.js 20 or newer confirmed.
- [ ] `npm test` completed with 58 passing tests and 0 failures.
- [ ] `npm run build` completed successfully.
- [ ] `npm start` served the frozen build.
- [ ] Browser storage reset was tested.
- [ ] Report export was tested.
- [ ] Session-log export was tested.
- [ ] Private storage destination was prepared.

Preflight notes:

## Case and mode assignment

| Case | Review mode | Case order | Baseline time box | Completed |
|---|---|---:|---:|---:|
| Case 1 — straightforward |  | 1 | 10 minutes | No |
| Case 2 — ambiguous |  | 2 | 10 minutes | No |
| Case 3 — noisy |  | 3 | 10 minutes | No |

## Timing summary

Record authoritative timing in the exported session data. This table is only a facilitator cross-check.

| Stage | Start | End | Notes |
|---|---|---|---|
| Consent and demo |  |  |  |
| Analyst entry |  |  |  |
| Reviewer alignment |  |  |  |
| Prose-only baseline |  |  |  |
| Event grading |  |  |  |
| Post-session interview |  |  |  |
| Export and reset |  |  |  |

## Protocol deviations

Record deviations as they happen. Do not silently fix or omit them.

| Time | Case | Stage | What happened | Likely impact | Action taken |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Export inventory

| Required artifact | Saved | Private filename or storage reference | Sanitized public summary allowed? |
|---|---:|---|---:|
| Case 1 report | No |  | No |
| Case 1 session log | No |  | No |
| Case 2 report | No |  | No |
| Case 2 session log | No |  | No |
| Case 3 report | No |  | No |
| Case 3 session log | No |  | No |
| Prose baseline notes | No |  | No |
| Missing-divergence list | No |  | No |
| Interview notes | No |  | No |

## Immediate facilitator observations

Separate direct observations from interpretation.

### Directly observed

- 

### Preliminary interpretation

- 

## Participant reuse intent

| Role | Not at all | Maybe | Yes | Reason given |
|---|---:|---:|---:|---|
| Analyst A |  |  |  |  |
| Analyst B |  |  |  |  |
| Reviewer |  |  |  |  |

## Post-session questions

### Analyst A

- What made structured entry harder or easier than prose?
- Which terms or steps were confusing?
- What did you avoid recording, and why?

Notes:

### Analyst B

- What made structured entry harder or easier than prose?
- Which terms or steps were confusing?
- What did you avoid recording, and why?

Notes:

### Reviewer

- Did the alignment interface help locate meaningful divergence?
- Were any findings technically accurate but misleading or trivial?
- What important differences were missing?
- Did candidate-match visibility influence decisions?

Notes:

## Sanitization check

Before creating any public issue or write-up:

- [ ] No participant names.
- [ ] No contact details or availability windows.
- [ ] No credentials or private system information.
- [ ] No client, employer, patient, or source identities.
- [ ] No raw participant text unless explicit permission was obtained.
- [ ] No exported session file attached to a public issue.
- [ ] Claims distinguish observations, interpretations, and unknowns.

## Analysis and decision

- Merged session file created: Yes / No
- `npm run analyze -- <session-file>` completed: Yes / No
- Useful-difference precision:
- Material-difference coverage:
- Misleading-output rate:
- Entry overhead:
- Review-time comparison:
- Reviewer stability: scoreable / not yet scoreable
- Decision: continue / pivot / stop / not yet scoreable

Decision rationale:

## Follow-up actions

Only list changes supported by observed failures or results.

- [ ] Documentation correction:
- [ ] Bug fix:
- [ ] Protocol clarification:
- [ ] Instrument change proposed for a future version:
- [ ] No change; gather another session:
