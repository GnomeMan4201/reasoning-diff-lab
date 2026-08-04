import test from 'node:test';
import assert from 'node:assert/strict';
import * as A from '../src/analysis.js';

test('usefulPrecision computes numerator/denominator correctly', () => {
  const graded = [
    { event_id: '1', grade: 'useful_nonobvious' },
    { event_id: '2', grade: 'useful_obvious' },
    { event_id: '3', grade: 'wrong' },
    { event_id: '4', grade: 'accurate_low_value' },
  ];
  const r = A.usefulPrecision(graded);
  assert.equal(r.value, 0.5);
  assert.equal(r.numerator, 2);
  assert.equal(r.denominator, 4);
});

test('usefulPrecision returns null (not 0) on zero denominator', () => {
  const r = A.usefulPrecision([]);
  assert.equal(r.value, null);
  assert.match(r.note, /zero/);
});

test('usefulPrecision honors excluded ids from logged protocol deviations', () => {
  const graded = [{ event_id: '1', grade: 'wrong' }, { event_id: '2', grade: 'useful_nonobvious' }];
  const r = A.usefulPrecision(graded, new Set(['1']));
  assert.equal(r.denominator, 1);
  assert.equal(r.value, 1);
  assert.equal(r.excluded, 1);
});

test('misleadingRate counts misleading and wrong together', () => {
  const graded = [{ event_id: '1', grade: 'misleading' }, { event_id: '2', grade: 'wrong' }, { event_id: '3', grade: 'useful_obvious' }];
  const r = A.misleadingRate(graded);
  assert.equal(r.value, Number((2 / 3).toFixed(3)));
});

test('importantDivergenceRecall handles zero-important case distinctly from perfect recall', () => {
  const r = A.importantDivergenceRecall([], []);
  assert.equal(r.value, null);
  assert.match(r.note, /no important divergences/);
});

test('importantDivergenceRecall computes recall against missed important divergences', () => {
  const graded = [{ event_id: '1', grade: 'useful_nonobvious', importance: 'important' }];
  const missing = [{ case_id: 'c1', importance: 'important' }];
  const r = A.importantDivergenceRecall(graded, missing);
  assert.equal(r.value, 0.5);
});

test('entryBurdenMedianMinutes excludes incomplete sessions and reports the exclusion count', () => {
  const timings = [
    { total_ms: 5 * 60000, completion: true },
    { total_ms: 15 * 60000, completion: true },
    { total_ms: 1 * 60000, completion: false },
  ];
  const r = A.entryBurdenMedianMinutes(timings);
  assert.equal(r.value, 10);
  assert.equal(r.excluded, 1);
});

test('reviewerTimeDeltaMinutes returns null when a condition is missing entirely', () => {
  const r = A.reviewerTimeDeltaMinutes([{ condition: 'tool', total_ms: 60000 }]);
  assert.equal(r.value, null);
});

test('matcherAcceptanceRate ignores manual-only logs (no suggestions to accept/reject)', () => {
  const r = A.matcherAcceptanceRate([{ outcome: 'manual' }]);
  assert.equal(r.value, null);
});

test('manualMatchRate computes share of manual matches among all decisions', () => {
  const r = A.manualMatchRate([{ match_source: 'manual' }, { match_source: 'suggested' }, { match_source: 'suggested' }]);
  assert.equal(r.value, Number((1 / 3).toFixed(3)));
});

test('reuseIntentMedian ignores non-finite responses', () => {
  const r = A.reuseIntentMedian([{ reuse_intent: 4 }, { reuse_intent: 5 }, { reuse_intent: NaN }]);
  assert.equal(r.value, 4.5);
  assert.equal(r.n, 2);
});

test('anchoringComparison reports per-mode aggregates without a single composite score', () => {
  const logs = [
    { mode: 'blind', outcome: 'manual', time_to_match_ms: 1000 },
    { mode: 'suggested_hidden_score', outcome: 'accepted', time_to_match_ms: 500 },
    { mode: 'suggested_visible_score', outcome: 'accepted', time_to_match_ms: 300 },
  ];
  const r = A.anchoringComparison(logs);
  assert.ok('blind' in r && 'suggested_hidden_score' in r && 'suggested_visible_score' in r);
  assert.equal(typeof r, 'object');
  assert.equal('composite' in r, false);
});
