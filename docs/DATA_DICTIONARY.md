# Data Dictionary

Every type below is either validated in code (`src/model.js`) or is a documented plain-JSON
shape consumed by `src/analysis.js` / `cli/analyze.js`. Types marked **(contract only)** are
not run through an automated validator yet — see the Claim Discipline label at the end of
each section.

## case
File: `fixtures/cases/<case-id>/case.json`. **(Contract only** — read by the UI as plain JSON,
no schema validator; malformed case files fail loudly in `loadCase()`'s catch, showing "could
not load case metadata," not silently.**)**

| Field | Type | Notes |
|---|---|---|
| case_id | string | matches the directory name |
| title | string | |
| research_question | string | must match `question` in both paths exactly |
| difficulty | 'straightforward'\|'ambiguous'\|'noisy' | |
| analyst_instructions | string | shown to analysts |
| reviewer_instructions | string | shown to reviewer |
| baseline_prose_instructions | string | shown to facilitator for the baseline condition |
| expected_methodological_risks | string[] | named in advance, not discovered after the fact |
| has_designed_correct_answer | boolean | false for case 2 |
| design_note_do_not_show_before_grading | string | facilitator-only until grading is complete |

## evidence
Inline array on a reasoning path. **Implemented and automatically verified** —
`assertEvidenceItem` in `src/model.js`, tested in `tests/model.test.js`.

| Field | Type | Notes |
|---|---|---|
| id | string | unique within the path |
| text | string | |

## reasoning_unit
**Implemented and automatically verified** — `assertReasoningUnit`, tested extensively
including malformed-input cases.

| Field | Type | Notes |
|---|---|---|
| id | string | unique within the path |
| type | 'observation'\|'assumption'\|'inference'\|'claim'\|'unknown' | |
| text | string | |
| evidence_refs | string[] | must exist in the path's evidence |
| depends_on | string[] | must exist among earlier/other units; no self-reference |
| confidence | number 0..1 or null | optional |
| source | 'guided'\|'prose_assisted' | optional, defaults undefined (treated as guided) |
| confirmed | boolean, **must be true** | prose-assisted drafts start false and are rejected until edited/confirmed |

## reasoning_path (analyst submission)
**Implemented and automatically verified** — `assertReasoningPath`.

| Field | Type | Notes |
|---|---|---|
| id | string | |
| case_id | string | |
| analyst_id | string | role/participant label, not necessarily a real name |
| question | string | must match exactly across both paths in a comparison |
| evidence | evidence[] | |
| units | reasoning_unit[] | |

## candidate_match
Output of `src/matcher.js`. **Implemented and automatically verified.** Never persisted as a
decision; always a proposal.

| Field | Type | Notes |
|---|---|---|
| a, b | string | unit ids |
| score | number | 0..1, method: weighted Jaccard + evidence overlap + type match — see `src/matcher.js` for exact weights |
| reasons | object | `{text, evidence, same_type}` — the components behind the score |

## reviewer_decision
**Implemented and automatically verified** — `assertReviewerDecisions`.

| Field | Type | Notes |
|---|---|---|
| a, b | string | unit ids, one-to-one across all decisions for a pair |
| decision | 'same_position'\|'related'\|'unrelated' | |
| relation | 'contradiction' or absent | only valid when decision is 'related' |
| confidence | 'low'\|'medium'\|'high', optional | reviewer's own confidence in the decision |
| match_source | 'suggested'\|'manual', optional | for matcher-acceptance/manual-rate analysis |
| note | string, optional | free text |

## divergence_event
**Implemented and automatically verified** — produced only by `src/engine.js`, covered by
`tests/engine.test.js` per event kind.

| Field | Type | Notes |
|---|---|---|
| id | string | deterministic, includes kind + unit ids |
| kind | string | one of the 11 kinds listed in `docs/DEVELOPER_HANDOFF.md` |
| schema_version | string | |
| engine_rule | string | equals `kind`, kept separate for forward-compatibility if rules are ever renamed independently of kinds |
| engine_version | string | see `ENGINE_VERSION` in `src/engine.js` |
| provenance | object | `{case_id, path_a, path_b, analyst_a, analyst_b}` |
| reviewer_decision | object or null | the exact decision record that produced this event, if any |
| a, b | unit snapshot or null | full unit fields as declared at comparison time |
| details | object | event-specific fields, e.g. `confidence_delta`, `shared_evidence`, `evidence_only_in_a` |

## baseline_review **(contract only)**
Not yet schema-validated in code; shape used by `docs/EXPERIMENT_PROTOCOL.md` and expected in
a merged session file.

| Field | Type |
|---|---|
| case_id | string |
| reviewer_id | string |
| important_differences_listed | string[] |
| time_ms | number |

## session_timing
Consumed by `src/analysis.js:entryBurdenMedianMinutes`. **(Contract only** for the shape;
the arithmetic over it is automatically tested.**)**

| Field | Type |
|---|---|
| analyst_id | string |
| case_id | string |
| mode | 'guided'\|'prose' |
| total_ms | number |
| edits | number |
| abandoned_fields | number |
| validation_errors | number |
| completion | boolean |

## reviewer_timing
Consumed by `reviewerTimeDeltaMinutes`. **(Contract only** for the shape.**)**

| Field | Type |
|---|---|
| case_id | string |
| condition | 'tool'\|'baseline_prose' |
| total_ms | number |

## match_log
Consumed by `matcherAcceptanceRate` / `anchoringComparison`. **(Contract only** for the
shape.**)**

| Field | Type |
|---|---|
| mode | 'blind'\|'suggested_hidden_score'\|'suggested_visible_score' |
| outcome | 'accepted'\|'rejected'\|'manual' |
| time_to_match_ms | number |

## participant_questionnaire
Consumed by `reuseIntentMedian`. **(Contract only** for the shape.**)**

| Field | Type |
|---|---|
| participant_id | string |
| reuse_intent | integer 1..5 |
| workload | integer 1..5, optional |
| notes | string, optional |

## protocol_deviation **(contract only)**

| Field | Type | Notes |
|---|---|---|
| case_id | string | |
| reason | string | free text, e.g. "withdrawal", "case note shown early" |
| exclude_event_id | string, optional | if set, `analyze.js` excludes this event id from precision/misleading-rate denominators |

## experiment_result (merged session file)
The file `cli/analyze.js` consumes. See `fixtures/sample-session.json` for a fully worked,
explicitly-labeled-synthetic example. **(Contract only** as a container shape — its parts are
individually validated/tested as listed above.**)**

| Field | Type |
|---|---|
| graded_events | `{event_id, grade, importance?}[]` |
| missing_divergences | `{case_id, importance}[]` |
| session_timings | session_timing[] |
| reviewer_timings | reviewer_timing[] |
| match_logs | match_log[] |
| reviewer_decisions_flat | reviewer_decision[] (with match_source) |
| questionnaires | participant_questionnaire[] |
| protocol_deviations | protocol_deviation[] |

## Exports

- **JSON** (`report.json`): the full `divergence_event`-bearing comparison result, exactly as
  produced by `compare()` — deterministic given identical inputs, re-importable as data (not
  currently re-ingested by any tool, but valid JSON matching the shapes above).
- **Markdown** (`report.md`): human-readable, generated by `src/report.js:toMarkdown`.
- **CSV** (`report.csv`): one row per event, machine-readable, generated by
  `src/report.js:toCsv`.
- **Session log** (`session-log.json`, from the web UI's "Download session log" button):
  `{case_id, session_timings, match_logs, reviewer_decisions_flat}` — merge several of these
  by hand (or a short script) into the `experiment_result` shape before running
  `cli/analyze.js`. There is currently no automated merge step — **(deferred)**.
