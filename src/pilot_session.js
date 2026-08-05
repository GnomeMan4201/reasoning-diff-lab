// pilot_session.js — pure helpers for the browser pilot workflow.
// These functions keep case changes, path transfer, and measurement logging deterministic
// enough to test without requiring a browser DOM.

const VALID_SUGGESTION_DECISIONS = new Set(['same_position', 'related', 'unrelated']);

export function suggestionOutcome(decision) {
  if (!VALID_SUGGESTION_DECISIONS.has(decision)) {
    throw new Error(`Unknown reviewer decision: ${decision}`);
  }
  return decision === 'unrelated' ? 'rejected' : 'accepted';
}

export function evidenceMatches(expected = [], actual = []) {
  if (!Array.isArray(expected) || !Array.isArray(actual) || expected.length !== actual.length) return false;
  return expected.every((item, index) => {
    const candidate = actual[index];
    return candidate && item.id === candidate.id && item.text === candidate.text;
  });
}

export function resetCaseState(state, nextCaseId = state.caseId) {
  return {
    ...state,
    caseId: nextCaseId,
    caseDef: null,
    paths: {},
    drafts: [],
    guidedUnits: [],
    decisions: [],
    matchLogs: [],
    sessionTimings: [],
    reviewerTimings: [],
    result: null,
    entryStartedAt: null,
    reviewStartedAt: null,
    entryEdits: 0,
    entryValidationErrors: 0,
    baselineTimeMs: null,
    pathSavedRole: null,
    manualMatchStartedAt: null,
  };
}

export function buildSessionLog(state) {
  return {
    case_id: state.caseId,
    paths: state.paths || {},
    session_timings: state.sessionTimings || [],
    reviewer_timings: state.reviewerTimings || [],
    match_logs: state.matchLogs || [],
    reviewer_decisions_flat: state.decisions || [],
  };
}
