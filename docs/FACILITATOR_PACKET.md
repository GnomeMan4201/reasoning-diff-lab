# Pilot Facilitator Packet — One-Page Summary

## What you're agreeing to run

A feasibility test of one research question: *does comparing two independently produced reasoning paths surface non-obvious, useful divergences that a prose-only review misses?* This is a three-case session, approximately 90–120 minutes total. No special expertise is required. The tool runs locally in a browser.

---

## Participant roles

| Role | Count | What they do |
|---|---|---|
| **Analyst A** | 1 | Records their reasoning on each case independently |
| **Analyst B** | 1 | Records their reasoning on the same case independently — no contact with A until both paths are frozen |
| **Reviewer** | 1 | Did not write either path; matches units across the two paths and grades the report |
| **Facilitator (you)** | 1 | Starts the server, enforces isolation, holds the timer, administers consent, collects exports |

---

## Exact time commitment

| Activity | Estimated time |
|---|---|
| Setup and consent | 10 min |
| Per case: analyst entry (each analyst, independently) | 10–20 min |
| Per case: reviewer matching and report generation | 10–15 min |
| Per case: reviewer grading | 5–10 min |
| Per case: baseline prose review (separate timer) | 10 min |
| Post-session interview (all participants) | 10–15 min |
| **Total (3 cases)** | **90–120 min** |

---

## Hardware and access requirements

- One laptop or desktop running Node.js ≥ 20
- `npm test && npm run build && npm start` in the project directory
- Browser at `http://localhost:4173` — works on phone too, but a keyboard is faster for entry
- No internet connection required after startup
- If analysts are in the same room: two screens, or run two browser tabs on one machine in separate windows

---

## Isolation rules

Before either analyst saves a path for a given case:

1. Do not let Analyst A and Analyst B discuss the case or see each other's screens.
2. Do not show either analyst the reviewer's questions or the candidate match list.
3. Do not reveal the `design_note_do_not_show_before_grading` field in each `case.json` to anyone until after the reviewer has finished grading.

These rules are procedural — the current tool does not enforce them technically.

---

## Evidence packet distribution

Each case's evidence is pre-loaded in the tool. Select the case in Setup, select the analyst's role, and the evidence items appear automatically. No files to distribute separately.

---

## Freeze procedure

When an analyst clicks **"Save my path"** and the tool confirms, that path is saved to `localStorage`. From that point, the analyst should not edit it. Log the time. If a participant asks to edit after saving, log it as a protocol deviation (see below) and allow it — but record the original and revised versions if possible.

---

## Reviewer sequence (per case)

1. Baseline condition first: give the reviewer the two analysts' raw prose write-ups (or read their units aloud as plain prose) and time them finding differences, with a 10-minute cap. Record what they found and the time elapsed. Do this **before** they open the tool for that case.
2. Tool condition: reviewer opens the interface in Reviewer role, matches units under the assigned review mode (see counterbalancing schedule below), and generates the report.
3. Reviewer grades every event in the generated report using the six-grade rubric in `docs/SCORING_RUBRIC.md`. They also list any important difference they believe is real but was not in the report (`missing_divergences`).

**Counterbalancing schedule (3 cases):**

| Case | Review mode |
|---|---|
| case-01-straightforward | blind |
| case-02-ambiguous | suggested, hidden score |
| case-03-noisy | suggested, visible score |

Rotate this assignment across sessions if you run more than one pilot trio.

---

## Timer and interaction logging

The tool logs entry start and end times, edit counts, and validation errors automatically. Export the session log from the Results screen after each case (**"Download session log"** button). Also log manually:
- baseline review start and end time per case
- any deviation from this packet

---

## Post-task questionnaire (all participants)

Ask each person, verbally:
1. Would you use this for real work? (1 = definitely not, 5 = definitely yes)
2. What made entry harder or easier than writing normal prose?
3. Was any label or interface element confusing?
4. (Reviewer only) Did seeing match scores change which pairs you accepted?

Record answers in a shared note; they feed `questionnaires` in the session file.

---

## Data retention and consent

Read this aloud before starting:

> "You're helping test a research prototype. Your reasoning and timing will be logged locally on this machine only, tied to a role label, not your name. Nothing is sent anywhere over a network. You can stop at any point without giving a reason — anything you've entered will simply not be exported. Do you agree?"

If anyone declines, do not proceed with them in that role.

Retain exports only as long as needed for analysis. Delete them once the pilot's continue/pivot/stop decision is recorded.

---

## Protocol deviations

If anything does not go as written here — a participant saw something they shouldn't, a step was skipped, a path was edited after freezing — log it in the session file as a `protocol_deviation` entry with a brief reason. Do not silently adjust the numbers. Deviations do not have to disqualify a case; they have to be visible.

---

## What constitutes pilot completion

The pilot is complete when:
- All three cases have been run with both analyst paths saved and the reviewer report generated and graded.
- Baseline review times and findings have been recorded for all three cases.
- Session logs (timing + match logs) have been exported for all three cases.
- The post-session interview notes are written down.
- All exports are merged into a single session file and `npm run analyze -- session.json` has been run.
- The output of `analyze` has been compared against the continue/pivot/stop criteria in `docs/SCORING_RUBRIC.md` and a decision is recorded with the reason.

That decision — continue, pivot, or stop — is the deliverable of this session.
