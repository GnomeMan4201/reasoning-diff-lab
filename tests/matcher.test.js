import test from 'node:test';
import assert from 'node:assert/strict';
import { jaccard, overlap, suggestCandidateMatches } from '../src/matcher.js';

test('jaccard is deterministic and symmetric', () => {
  const a = 'The deployment caused the outage', b = 'The outage was caused by the deployment';
  const s1 = jaccard(a, b), s2 = jaccard(b, a);
  assert.equal(s1, s2);
  assert.ok(s1 > 0.3);
});

test('jaccard of two empty strings is 1 (both sides equally empty, not a false negative)', () => {
  assert.equal(jaccard('the a an', 'the a an'), 1);
});

test('overlap on empty arrays is 0, not NaN', () => {
  assert.equal(overlap([], []), 0);
});

test('suggestions are sorted descending and every entry meets the threshold', () => {
  const pathA = { units: [{ id: 'A1', text: 'deployment caused outage', evidence_refs: ['E1'], type: 'claim' }] };
  const pathB = { units: [
    { id: 'B1', text: 'deployment caused the outage', evidence_refs: ['E1'], type: 'claim' },
    { id: 'B2', text: 'unrelated text about weather', evidence_refs: [], type: 'observation' },
  ] };
  const out = suggestCandidateMatches(pathA, pathB, { threshold: 0.18 });
  assert.ok(out.every(s => s.score >= 0.18));
  assert.ok(out.length >= 1);
  for (let i = 1; i < out.length; i++) assert.ok(out[i - 1].score >= out[i].score);
});

test('candidate matches never carry a decision field — they are proposals only', () => {
  const pathA = { units: [{ id: 'A1', text: 'x y z', evidence_refs: [], type: 'claim' }] };
  const pathB = { units: [{ id: 'B1', text: 'x y z', evidence_refs: [], type: 'claim' }] };
  const out = suggestCandidateMatches(pathA, pathB);
  for (const s of out) assert.equal('decision' in s, false);
});
