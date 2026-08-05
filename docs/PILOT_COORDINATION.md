# Pilot Coordination Guide

This guide covers the logistics between a volunteer comment and a completed Reasoning Diff Lab pilot session. It does not change the frozen instrument, case materials, scoring rules, or experiment protocol.

## What happens after someone volunteers

1. A volunteer comments on [Issue #1](https://github.com/GnomeMan4201/reasoning-diff-lab/issues/1) with the role they want, relevant background, general availability, and whether they can commit roughly 90 minutes.
2. The facilitator replies publicly only to acknowledge the volunteer and confirm the requested role is still open.
3. Scheduling and any contact details move to a private channel. Do not ask people to post email addresses, phone numbers, employer details, or private case information in the issue.
4. The facilitator confirms that the volunteer has not previously seen the fixture design notes or reference paths.
5. Once two analysts and one reviewer are confirmed, assign role labels only: Analyst A, Analyst B, Reviewer, and Facilitator.
6. Agree on one session date and one backup date.
7. Use the frozen [`release/v2.0.0`](https://github.com/GnomeMan4201/reasoning-diff-lab/tree/release/v2.0.0) branch and complete the [Pilot Session Checklist](PILOT_SESSION_CHECKLIST.md) before starting.

## Participant selection

The first pilot is a formative feasibility test, not a representative population study. Prefer volunteers who:

- can read short technical incident scenarios;
- are comfortable explaining uncertainty and assumptions;
- can work independently without discussing the case first;
- can complete the full session without multitasking;
- accept that negative results are useful.

Useful backgrounds include incident response, digital forensics, threat intelligence, security research, debugging, journalism, medicine, intelligence analysis, scientific review, or other evidence-based investigative work. Formal credentials are not required for the first feasibility round.

Do not select both analysts from a pair who routinely work together on the same cases if that relationship is likely to reduce independence. Do not use anyone who helped author the fixture cases, reference paths, design notes, or scoring rules.

## Recommended session format

The preferred first-session format is synchronous and facilitator-controlled. Co-located participation is easiest because the facilitator can enforce separation, control case exposure, and collect exports without inventing a new transfer workflow.

A remote session should be attempted only after the facilitator verifies the complete workflow in advance. Each participant must use the same frozen branch, preserve analyst independence, prevent early exposure to the other path, and return exports through a private channel. Any remote transfer or setup change not already covered by the runbook must be recorded as a protocol deviation.

Do not post exported session files in the public repository. Even synthetic sessions can contain participant-written text and timing data.

## Scheduling block

Reserve 90–120 minutes. A practical allocation is:

- 10 minutes: consent, role confirmation, technical preflight, and demo;
- 20–30 minutes: analyst work;
- 20–30 minutes: reviewer alignment and contradiction decisions;
- 10 minutes: prose-only baseline review;
- 10–15 minutes: grading, missing-divergence capture, and interview;
- remaining time: exports, reset, and protocol-deviation notes.

The runbook remains authoritative if timing guidance conflicts with this summary.

## Public reply template

> Thanks for volunteering for the **[Analyst / Reviewer]** role. That role is currently open. I’ll move scheduling and contact details to a private channel so nothing personal is posted in this public issue. The pilot uses synthetic evidence, runs against the frozen `release/v2.0.0` branch, and takes roughly 90 minutes.

## Private confirmation template

> Thanks for volunteering for the Reasoning Diff Lab pilot. Before scheduling, please confirm:
>
> 1. You have not previously read the fixture design notes or reference reasoning paths.
> 2. You can reserve roughly 90 minutes without discussing the case with the other analyst before both paths are frozen.
> 3. You are comfortable using synthetic evidence only and giving blunt feedback, including that the workflow may not be useful.
> 4. You understand that participant names should not be included in exported session data.
>
> Please send two or three broad availability windows and your time zone. Do not send client data, case evidence, credentials, medical information, or other sensitive material.

## Role confirmation record

Track this privately until the session is complete:

| Role | Confirmed | Previously exposed to fixtures? | Availability received | Private contact established |
|---|---:|---:|---:|---:|
| Analyst A | No | No | No | No |
| Analyst B | No | No | No | No |
| Reviewer | No | No | No | No |
| Facilitator | Yes | N/A | Yes | N/A |

Do not commit participant names or contact details to the public repository.

## Cancellation and replacement

- If one participant cancels before the session, reschedule or replace that role. Do not collapse Analyst and Reviewer roles into one person.
- If an analyst withdraws after seeing a case, do not reuse that person as the reviewer for that case.
- If the reviewer withdraws after seeing both paths, replace the reviewer and record the exposure and replacement as a protocol deviation.
- If technical preflight fails, stop. Fix the environment and reschedule rather than changing the instrument during the session.

## After the session

1. Confirm all required exports were saved privately.
2. Record deviations before discussing results.
3. Remove any accidental names or sensitive details from working copies.
4. Use the [Pilot Feedback issue template](../.github/ISSUE_TEMPLATE/pilot-feedback.md) only for sanitized findings that are safe to publish.
5. Update [PILOT_STATUS.md](PILOT_STATUS.md) without adding participant names.
6. Analyze the session exactly as described in `PILOT_RUNBOOK.md` and `EXPERIMENT_PROTOCOL.md`.
