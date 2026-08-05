# Data Dictionary

Every type below is either validated in code (`src/model.js`) or is a documented plain-JSON shape consumed by the browser, `src/analysis.js`, or `cli/analyze.js`. Types marked **contract only** are not yet passed through a complete schema validator.

## facilitator case

File: `fixtures/cases/<case-id>/case.json`. **Contract only.**

| Field | Type | Notes |
|---|---|---|
| case_id | string | matches directory name |
| title | string | |
| research_question | string | must match both paths exactly |
| difficulty | `straightforward`\|`ambiguous`\|`noisy` | |
| analyst_instructions | string | facilitator source copy |
| reviewer_instructions | string | facilitator source copy |
| baseline_prose_instructions | string | |
| expected_methodological_risks | string[] | named before the pilot |
| has_designed_correct_answer | boolean | false for case 2 |
| design_note_do_not_show_before_grading | string | protected until grading completes |

The browser does **not** load this file for pilot participants in v2.0.1.

## participant case

File: `fixtures/cases/<case-id>/participant.json`; the training demo uses `fixtures/demo/case.json`. **Contract only**, with built-artifact smoke checks.

| Field | Type | Notes |
|---|---|---|
| case_id | string | selected case id |
| title | string | participant-facing title |
| research_question | string | exact question used in paths |
| difficulty | string | pilot difficulty or `demo` |
| analyst_instructions | string | participant-safe |
| reviewer_instructions | string | participant-safe |
| evidence | evidence[] | frozen shared evidence packet |

A participant case must not contain design notes, reference answers, golden reviewer decisions, or methodological expectations.

## evidence

**Implemented and automatically verified** by `assertEvidenceItem` in `src/model.js`.

| Field | Type | Notes |
|---|---|---|
| id | string | unique within path/packet |
| text | string | frozen evidence text |

Imported analyst paths must use the exact participant evidence packet in the same order. `src/pilot_session.js:evidenceMatches` enforces the browser handoff check.

## reasoning_unit

**Implemented and automatically verified** by `assertReasoningUnit`.

| Field | Type | Notes |
|---|---|---|
| id | string | unique within path |
| type | `observation`\|`assumption`\|`inference`\|`claim`\|`unknown` | |
| text | string | |
| evidence_refs | string[] | ids must exist in path evidence |
| depends_on | string[] | ids must exist in path units; no self-reference |
| confidence | number 0..1 or null | optional |
| source | `guided`\|`prose_assisted` | optional |
| confirmed | boolean, must be true | unconfirmed drafts cannot be compared |

## reasoning_path

Analyst submission. **Implemented and automatically verified** by `assertReasoningPath`.

| Field | Type | Notes |
|---|---|---|
| id | string | |
| case_id | string | must match selected participant case |
| analyst_id | `analyst_a`\|`analyst_b` in browser pilot | role label, not a name |
| question | string | must match participant case question |
| evidence | evidence[] | exact participant packet |
| units | reasoning_unit[] | |

v2.0.1 can download a path as JSON and import it into another reviewer browser. Import rejects mismatched role, case, question, or evidence.

## candidate_match

Output of `src/matcher.js`. **Implemented and automatically verified.** It is a proposal, never a decision.

| Field | Type | Notes |
|---|---|---|
| a, b | string | unit ids |
| score | number 0..1 | weighted lexical/evidence/type score |
| reasons | object | `{text, evidence, same_type}` |

## reviewer_decision

**Implemented and automatically verified** by `assertReviewerDecisions`.

| Field | Type | Notes |
|---|---|---|
| a, b | string | one-to-one final unit pairing |
| decision | `same_position`\|`related`\|`unrelated` | |
| relation | `contradiction` or absent | valid only when decision is `related` |
| confidence | `low`\|`medium`\|`high`, optional | reviewer confidence |
| match_source | `suggested`\|`manual`, optional | |
| note | string, optional | |

A later manual correction may replace a final decision using the same A or B unit. Interaction history remains in `match_logs`.

## divergence_event

**Implemented and automatically verified** by `src/engine.js` and engine tests.

| Field | Type | Notes |
|---|---|---|
| id | string | deterministic kind + unit ids |
| kind | string | one of 11 event kinds |
| schema_version | string | |
| engine_rule | string | rule identifier |
| engine_version | string | |
| provenance | object | case/path/analyst labels |
| reviewer_decision | object or null | exact producing decision |
| a, b | unit snapshot or null | |
| details | object | event-specific fields |

## baseline_review

**Contract only.**

| Field | Type |
|---|---|
| case_id | string |
| reviewer_id | string |
| important_differences_listed | string[] |
| time_ms | number |

The baseline must occur before tool-assisted review.

## session_timing

Consumed by `entryBurdenMedianMinutes`. **Contract only for shape; arithmetic tested.**

| Field | Type |
|---|---|
| analyst_id | string |
| case_id | string |
| mode | `guided`\|`prose` |
| total_ms | number |
| edits | number |
| abandoned_fields | number |
| validation_errors | number |
| completion | boolean |

## reviewer_timing

Consumed by `reviewerTimeDeltaMinutes`. **Contract only for shape.** v2.0.1 exports both conditions.

| Field | Type |
|---|---|
| case_id | string |
| condition | `tool`\|`baseline_prose` |
| total_ms | number |

## match_log

Consumed by matcher acceptance and anchoring analysis. **Contract only for shape.**

| Field | Type | Notes |
|---|---|---|
| a, b | string, optional | pair provenance added by v2.0.1 |
| mode | `blind`\|`suggested_hidden_score`\|`suggested_visible_score` | |
| outcome | `accepted`\|`rejected`\|`manual` | `unrelated` suggestion is `rejected` |
| time_to_match_ms | number | interaction timing |

## participant_questionnaire

Consumed by reuse-intent analysis. **Contract only.**

| Field | Type |
|---|---|
| participant_id | string role label |
| reuse_intent | integer 1..5 |
| workload | integer 1..5, optional |
| notes | string, optional |

## protocol_deviation

**Contract only.**

| Field | Type | Notes |
|---|---|---|
| case_id | string | |
| reason | string | e.g. withdrawal, early exposure, transfer failure |
| exclude_event_id | string, optional | excludes event from selected denominators |

## browser session log

Downloaded as `session-log.json` from v2.0.1:

```json
{
  "case_id": "case-01-straightforward",
  "paths": {
    "analyst_a": {},
    "analyst_b": {}
  },
  "session_timings": [],
  "reviewer_timings": [],
  "match_logs": [],
  "reviewer_decisions_flat": []
}
```

This is private raw participant data. Do not commit completed logs to the public repository.

## experiment_result

Merged file consumed by `cli/analyze.js`. See `fixtures/sample-session.json`. **Contract only as a container shape.**

| Field | Type |
|---|---|
| graded_events | `{event_id, grade, importance?}[]` |
| missing_divergences | `{case_id, importance}[]` |
| session_timings | session_timing[] |
| reviewer_timings | reviewer_timing[] |
| match_logs | match_log[] |
| reviewer_decisions_flat | reviewer_decision[] |
| questionnaires | participant_questionnaire[] |
| protocol_deviations | protocol_deviation[] |

Raw paths remain in the per-case private logs and are not required by `cli/analyze.js`.

## Exports

- **Analyst path JSON:** one validated `reasoning_path`, used for private browser/device handoff.
- **Baseline text:** unit text only, without types, evidence links, dependencies, confidence, candidate matches, or report output.
- **Report JSON:** full comparison result with divergence events.
- **Report Markdown:** human-readable deterministic report.
- **Report CSV:** one row per event.
- **Session log JSON:** raw paths, analyst timing, reviewer timing, match interactions, and final decisions.

Event grades, missing divergences, questionnaires, interview notes, and protocol deviations are still captured outside the browser and assembled into `experiment_result` before analysis.
