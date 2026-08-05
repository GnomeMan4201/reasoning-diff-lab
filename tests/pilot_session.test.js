import test from 'node:test';
import assert from 'node:assert/strict';
import {
  suggestionOutcome,
  evidenceMatches,
  resetCaseState,
  buildSessionLog,
} from '../src/pilot_session.js';

test('same-position suggestion is accepted', () => {
  assert.equal(suggestionOutcome('same_position'), 'accepted');
});

test('related suggestion is accepted', () => {
  assert.equal(suggestionOutcome('related'), 'accepted');
});

test('unrelated suggestion is rejected', () => {
  assert.equal(suggestionOutcome('unrelated'), 'rejected');
});

test('unknown reviewer decision is rejected loudly', () => {
  assert.throws(() => suggestionOutcome('maybe'), /Unknown reviewer decision/);
});

test('evidence packets must match exactly', () => {
  const expected = [{ id: 'E1', text: 'one' }, { id: 'E2', text: 'two' }];
  assert.equal(evidenceMatches(expected, structuredClone(expected)), true);
  assert.equal(evidenceMatches(expected, [{ id: 'E1', text: 'one' }]), false);
  assert.equal(evidenceMatches(expected, [{ id: 'E2', text: 'two' }, { id: 'E1', text: 'one' }]), false);
});

test('case reset clears participant work without changing role or review mode', () => {
  const state = {
    caseId: 'old', role: 'analyst_b', reviewMode: 'blind', caseDef: { title: 'old' },
    paths: { analyst_a: { id: 'a' } }, drafts: [{}], guidedUnits: [{}], decisions: [{}],
    matchLogs: [{}], sessionTimings: [{}], reviewerTimings: [{}], result: {},
    entryStartedAt: 1, reviewStartedAt: 2, entryEdits: 3, entryValidationErrors: 4,
    baselineTimeMs: 5, pathSavedRole: 'analyst_a', manualMatchStartedAt: 6,
  };
  const reset = resetCaseState(state, 'new');
  assert.equal(reset.caseId, 'new');
  assert.equal(reset.role, 'analyst_b');
  assert.equal(reset.reviewMode, 'blind');
  assert.deepEqual(reset.paths, {});
  assert.deepEqual(reset.decisions, []);
  assert.equal(reset.baselineTimeMs, null);
});

test('session export includes raw paths and both timing conditions', () => {
  const state = {
    caseId: 'case-1',
    paths: { analyst_a: { id: 'a' }, analyst_b: { id: 'b' } },
    sessionTimings: [{ analyst_id: 'analyst_a' }],
    reviewerTimings: [{ condition: 'baseline_prose' }, { condition: 'tool' }],
    matchLogs: [{ outcome: 'accepted' }],
    decisions: [{ decision: 'related' }],
    caseDef: { design_note_do_not_show_before_grading: 'must not leak' },
  };
  const exported = buildSessionLog(state);
  assert.deepEqual(Object.keys(exported).sort(), [
    'case_id', 'match_logs', 'paths', 'reviewer_decisions_flat', 'reviewer_timings', 'session_timings',
  ].sort());
  assert.equal(JSON.stringify(exported).includes('must not leak'), false);
});
