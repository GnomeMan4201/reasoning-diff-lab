import test from 'node:test';
import assert from 'node:assert/strict';
import { assertReasoningPath, assertReviewerDecisions } from '../src/model.js';

function basePath(overrides = {}) {
  return {
    id: 'p1', case_id: 'c1', analyst_id: 'a1', question: 'Q?',
    evidence: [{ id: 'E1', text: 'evidence' }],
    units: [{ id: 'U1', type: 'observation', text: 'obs', evidence_refs: ['E1'], depends_on: [], confidence: 0.9, confirmed: true }],
    ...overrides,
  };
}

test('valid minimal path passes', () => {
  assert.equal(assertReasoningPath(basePath()), true);
});

test('rejects missing case_id / analyst_id', () => {
  assert.throws(() => assertReasoningPath({ id: 'p1', question: 'Q?', evidence: [], units: [] }), /case_id is required/);
});

test('rejects unconfirmed unit', () => {
  const p = basePath({ units: [{ id: 'U1', type: 'observation', text: 'obs', confirmed: false }] });
  assert.throws(() => assertReasoningPath(p), /confirmed must be true/);
});

test('rejects invalid unit type', () => {
  const p = basePath({ units: [{ id: 'U1', type: 'vibe', text: 'x', confirmed: true }] });
  assert.throws(() => assertReasoningPath(p), /type invalid/);
});

test('rejects unknown evidence ref', () => {
  const p = basePath({ units: [{ id: 'U1', type: 'observation', text: 'x', evidence_refs: ['E9'], confirmed: true }] });
  assert.throws(() => assertReasoningPath(p), /references unknown evidence/);
});

test('rejects self-dependency', () => {
  const p = basePath({ units: [{ id: 'U1', type: 'inference', text: 'x', depends_on: ['U1'], confirmed: true }] });
  assert.throws(() => assertReasoningPath(p), /cannot depend on itself/);
});

test('rejects duplicate ids', () => {
  const p = basePath({ units: [
    { id: 'U1', type: 'observation', text: 'a', confirmed: true },
    { id: 'U1', type: 'observation', text: 'b', confirmed: true },
  ] });
  assert.throws(() => assertReasoningPath(p), /duplicate unit id/);
});

test('confidence out of range rejected', () => {
  const p = basePath({ units: [{ id: 'U1', type: 'observation', text: 'x', confidence: 1.5, confirmed: true }] });
  assert.throws(() => assertReasoningPath(p), /confidence must be/);
});

test('reviewer decisions: rejects unknown units, invalid decision, many-to-one, orphan contradiction', () => {
  const a = basePath(), b = basePath({ id: 'p2', analyst_id: 'a2', units: [{ id: 'V1', type: 'claim', text: 'x', confirmed: true }] });
  assert.throws(() => assertReviewerDecisions([{ a: 'ZZ', b: 'V1', decision: 'related' }], a, b), /unknown A unit/);
  assert.throws(() => assertReviewerDecisions([{ a: 'U1', b: 'V1', decision: 'maybe' }], a, b), /invalid decision/);
  assert.throws(() => assertReviewerDecisions([
    { a: 'U1', b: 'V1', decision: 'related' },
    { a: 'U1', b: 'V1', decision: 'related' },
  ], a, b), /one-to-one/);
  assert.throws(() => assertReviewerDecisions([{ a: 'U1', b: 'V1', decision: 'unrelated', relation: 'contradiction' }], a, b), /must be declared on a 'related'/);
});

test('reviewer decisions: valid same_position with contradiction on related passes', () => {
  const a = basePath(), b = basePath({ id: 'p2', analyst_id: 'a2', units: [{ id: 'V1', type: 'claim', text: 'x', confirmed: true }] });
  assert.equal(assertReviewerDecisions([{ a: 'U1', b: 'V1', decision: 'related', relation: 'contradiction' }], a, b), true);
});
