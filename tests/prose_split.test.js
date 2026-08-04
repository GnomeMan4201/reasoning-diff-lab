import test from 'node:test';
import assert from 'node:assert/strict';
import { splitProse, finalizeDrafts } from '../src/prose_split.js';
import { assertReasoningPath } from '../src/model.js';

test('splitProse produces unconfirmed drafts, one per sentence', () => {
  const drafts = splitProse('Failures began at 14:02. This suggests the deployment caused it. It is unknown why validation missed it.');
  assert.equal(drafts.length, 3);
  assert.ok(drafts.every(d => d.confirmed === false));
});

test('splitProse guesses inference/unknown/observation types from cues, defaulting to observation', () => {
  const drafts = splitProse('The server restarted at noon. This suggests a crash loop. It is unknown what triggered it.');
  assert.equal(drafts[0].type, 'observation');
  assert.equal(drafts[1].type, 'inference');
  assert.equal(drafts[2].type, 'unknown');
});

test('splitProse only proposes an evidence ref when the id literally appears', () => {
  const evidence = [{ id: 'E1', text: 'anything' }];
  const drafts = splitProse('This matches E1 exactly. This does not mention any id.', evidence);
  assert.deepEqual(drafts[0].evidence_refs, ['E1']);
  assert.deepEqual(drafts[1].evidence_refs, []);
});

test('unconfirmed drafts fail schema validation until finalized and confirmed', () => {
  const drafts = splitProse('A claim with no support.');
  const path = { id: 'p', case_id: 'c', analyst_id: 'a', question: 'Q?', evidence: [], units: drafts };
  assert.throws(() => assertReasoningPath(path), /confirmed must be true/);
  const finalized = finalizeDrafts(drafts, 'A');
  const path2 = { ...path, units: finalized };
  assert.equal(assertReasoningPath(path2), true);
});

test('finalizeDrafts remaps dependency ids consistently', () => {
  const drafts = splitProse('First sentence here. Second sentence follows.');
  const finalized = finalizeDrafts(drafts, 'X');
  assert.equal(finalized[0].id, 'X1');
  assert.equal(finalized[1].id, 'X2');
  assert.deepEqual(finalized[1].depends_on, ['X1']);
});
