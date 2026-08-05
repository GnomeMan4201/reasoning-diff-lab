# Pilot Coordination Guide

This guide covers logistics between a volunteer comment and a completed Reasoning Diff Lab pilot. It does not change the frozen cases, taxonomy, engine rules, scoring thresholds, or experiment protocol.

## What happens after someone volunteers

1. A volunteer comments on [Issue #1](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/1) with the role they want, relevant background, general availability, and whether they can reserve roughly 90–120 minutes.
2. Reply publicly only to acknowledge the volunteer and confirm whether the role is open.
3. Move scheduling and contact details to a private channel. Do not request email addresses, phone numbers, employer details, or precise schedules in the public issue.
4. Ask whether they inspected fixture `path-a.json`, `path-b.json`, reviewer decisions, or facilitator design notes. Do not use an exposed volunteer with those cases.
5. Confirm the volunteer accepts synthetic evidence, independent work, blunt criticism, and role-labeled data.
6. Once two analysts and one reviewer are confirmed, assign only Analyst A, Analyst B, Reviewer, and Facilitator labels.
7. Agree on one session date and one backup date.
8. Use the frozen `release/v2.0.1` branch and complete the Pilot Session Checklist before starting.

## Participant selection

This is a formative feasibility pilot, not a representative study. Prefer volunteers who can:

- read short technical scenarios;
- explain uncertainty and assumptions;
- work independently without early discussion;
- reserve the full session without multitasking;
- accept that stop or null results are useful.

Relevant backgrounds include incident response, digital forensics, threat intelligence, debugging, journalism, medicine, intelligence analysis, scientific review, or other evidence-heavy work. Formal credentials are not required.

Do not select two analysts whose normal working relationship is likely to defeat independence. Do not use anyone who helped author or inspect the cases, reference paths, design notes, reviewer decisions, or scoring rules.

## Recommended session format

The preferred first format is co-located and facilitator-controlled.

### One host browser

- Analyst A enters and freezes a path.
- Facilitator changes to Analyst B; reviewer screens remain locked.
- Analyst B enters and freezes a path.
- Facilitator changes to Reviewer.

Record the sequential order because the experiment protocol prefers simultaneous evidence exposure.

### Separate devices

- Every device uses the same frozen v2.0.1 build and selected case.
- Each analyst downloads their frozen path.
- Files move through a private channel.
- Reviewer/facilitator imports both paths.
- The UI must reject a wrong case, role, question, or altered evidence packet.

Rehearse the exact transfer flow before using it. Do not publish participant path files.

### Remote session

Attempt a remote session only after a complete rehearsal. Preserve independence, baseline-first ordering, private transfers, timing, and protected-material boundaries. Log any unplanned setup change as a protocol deviation.

## Scheduling block

Reserve 90–120 minutes. A practical order is:

- 10 minutes: consent, role confirmation, and separate training demo;
- 20–30 minutes: analyst work and path freeze;
- up to 10 minutes: prose-only baseline review;
- 20–30 minutes: tool-assisted reviewer alignment and report generation;
- 10–15 minutes: event grading, missing-divergence capture, and interviews;
- remaining time: exports, reset, and deviation notes.

The baseline must happen before tool-assisted reviewer matching. The runbook is authoritative if any summary conflicts.

## Public reply template

> Thanks for volunteering for the **[Analyst / Reviewer]** role. That role is currently open. I’ll move scheduling and contact details to a private channel so nothing personal is posted here. The pilot uses synthetic evidence, runs against the frozen `release/v2.0.1` branch, and takes roughly 90–120 minutes.

## Private confirmation template

> Thanks for volunteering for the Reasoning Diff Lab pilot. Before scheduling, please confirm:
>
> 1. You have not opened the pilot fixture reference paths, reviewer decisions, or facilitator design notes.
> 2. You can reserve roughly 90–120 minutes and preserve analyst independence until both paths are frozen.
> 3. You are comfortable using synthetic evidence only and giving blunt feedback, including that the workflow may not be useful.
> 4. You understand that participant names should not be included in exported session data.
> 5. You can use a laptop/desktop browser or coordinate a private path-file transfer with the facilitator.
>
> Please send two or three broad availability windows and your time zone. Do not send client data, credentials, medical information, private case evidence, or other sensitive material.

## Role confirmation record

Track privately:

| Role | Confirmed | Fixture exposure screened | Availability received | Private contact established | Device plan confirmed |
|---|---:|---:|---:|---:|---:|
| Analyst A | No | No | No | No | No |
| Analyst B | No | No | No | No | No |
| Reviewer | No | No | No | No | No |
| Facilitator | Yes | N/A | Yes | N/A | No |

Do not commit participant names or contact details to the public repository.

## Cancellation and replacement

- If a participant cancels before the session, replace that role or reschedule.
- Do not collapse Analyst and Reviewer roles into one person.
- If a replacement has seen protected fixture material, use a different eligible participant.
- Keep one backup date rather than pressuring someone to continue through technical or scheduling problems.
