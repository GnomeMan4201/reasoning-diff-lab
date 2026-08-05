# Pilot Coordination Guide

This guide covers logistics between a volunteer comment and a completed Reasoning Diff Lab pilot. It does not change the frozen cases, taxonomy, engine rules, scoring thresholds, or experiment protocol.

## What happens after someone volunteers

1. A volunteer comments on [Issue #1](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/1) with the role they want, relevant background, general availability, and whether they can reserve the role-specific time.
2. Reply publicly only to acknowledge the volunteer and confirm whether the role is open.
3. Move scheduling and contact details to a private channel.
4. Ask whether they inspected fixture reference paths, reviewer decisions, or facilitator design notes. Do not use an exposed volunteer with these cases.
5. Confirm they accept synthetic evidence, independent work, blunt criticism, and role-labeled data.
6. Once two analysts and one reviewer are confirmed, assign only Analyst A, Analyst B, Reviewer, and Facilitator labels.
7. Agree on role-specific blocks, one primary date plan, and one backup date.
8. Use the frozen `release/v2.0.1` branch and complete the readiness audit before starting.

## Honest time commitment

- **Analyst A:** about 60–90 minutes total.
- **Analyst B:** about 60–90 minutes total.
- **Reviewer:** about 90–120 minutes total.
- **Facilitator:** reserve about 2.5–3.5 hours across setup, participant blocks, transfers, exports, and resets.

The roles do not all need to remain present for the entire facilitator window. Analysts can complete their paths first and the reviewer can work afterward. Do not advertise the full three-case workflow as a single 90-minute session.

## Participant selection

This is a formative feasibility pilot, not a representative study. Prefer volunteers who can:

- read short technical scenarios;
- explain uncertainty and assumptions;
- work independently without early discussion;
- reserve their full role block without multitasking;
- accept that stop or null results are useful.

Relevant backgrounds include incident response, digital forensics, threat intelligence, debugging, journalism, medicine, intelligence analysis, scientific review, or other evidence-heavy work. Formal credentials are not required.

Do not select two analysts whose normal working relationship is likely to defeat independence. Do not use anyone who helped author or inspect the cases, reference paths, design notes, reviewer decisions, or scoring rules.

## Session format

### Protocol-conforming

Both analysts begin each case at the same time in isolated workspaces. Each freezes and privately transfers their path. The reviewer completes all three baselines and structured reviews later.

### Single-computer sequential fallback

This is a protocol deviation because analyst evidence exposure is not simultaneous. Record order and use the result mainly for operational or burden observations rather than treating it as clean evidence for the central claim.

### Remote session

Attempt only after a complete rehearsal. Preserve independence, baseline-first ordering, private transfers, timing, and protected-material boundaries. Log every unplanned setup change.

## Suggested schedule

### Analyst block — 60–90 minutes

- 10–15 minutes: consent and separate demo;
- 10–20 minutes per case, with both analysts working simultaneously;
- 10–15 minutes: path-transfer verification and analyst interviews.

### Reviewer block — 90–120 minutes

- 5–10 minutes: consent/demo refresher and path import;
- up to 10 minutes baseline per case;
- 10–15 minutes structured matching per case;
- 5–10 minutes event grading per case;
- 10–15 minutes: interview and export verification.

The runbook is authoritative when any summary conflicts.

## Public reply template

> Thanks for volunteering for the **[Analyst / Reviewer]** role. That role is currently open. I’ll move scheduling and contact details to a private channel. Analysts should expect about 60–90 minutes; the reviewer should expect about 90–120 minutes. The pilot uses synthetic evidence and the frozen `release/v2.0.1` build.

## Private confirmation template

> Thanks for volunteering for the Reasoning Diff Lab pilot. Before scheduling, please confirm:
>
> 1. You have not opened the pilot fixture reference paths, reviewer decisions, or facilitator design notes.
> 2. You can reserve about 60–90 minutes as an analyst or 90–120 minutes as the reviewer.
> 3. Analysts can preserve independence until both paths are frozen.
> 4. You are comfortable using synthetic evidence only and giving blunt feedback, including that the workflow may not be useful.
> 5. You understand that participant names should not be included in exported session data.
> 6. You can use a laptop/desktop browser or coordinate a private path-file transfer with the facilitator.
>
> Please send two or three broad availability windows and your time zone. Do not send client data, credentials, medical information, private case evidence, or other sensitive material.

## Private role record

| Role | Confirmed | Fixture exposure screened | Availability received | Private contact | Device plan |
|---|---:|---:|---:|---:|---:|
| Analyst A | No | No | No | No | No |
| Analyst B | No | No | No | No | No |
| Reviewer | No | No | No | No | No |
| Facilitator | Yes | N/A | Yes | N/A | No |

Do not commit names or contact details publicly.

## Cancellation and replacement

- Replace the missing role or reschedule.
- Do not merge Analyst and Reviewer roles.
- Screen every replacement for fixture exposure.
- Keep a backup date rather than pressuring someone through technical or scheduling problems.
