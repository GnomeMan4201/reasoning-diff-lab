import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compare, ENGINE_VERSION } from '../src/engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const read = p => JSON.parse(fs.readFileSync(path.join(__dirname, p), 'utf8'));

function u(id, type, text, extra = {}) {
  return { id, type, text, evidence_refs: [], depends_on: [], confidence: null, confirmed: true, ...extra };
}
function path_(id, units, extra = {}) {
  return { id, case_id: 'synthetic', analyst_id: `analyst-${id}`, question: 'Q?', evidence: [{ id: 'E1', text: 'ev1' }, { id: 'E2', text: 'ev2' }], units, ...extra };
}

test('same-position pair with confidence delta >= 0.2 emits confidence_divergence', () => {
  const a = path_('a', [u('A1', 'claim', 'x', { confidence: 0.9, evidence_refs: ['E1'] })]);
  const b = path_('b', [u('B1', 'claim', 'x', { confidence: 0.6, evidence_refs: ['E1'] })]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'same_position' }]);
  assert.ok(out.events.some(e => e.kind === 'confidence_divergence'));
});

test('same-position pair with delta below threshold emits nothing for that pair', () => {
  const a = path_('a', [u('A1', 'claim', 'x', { confidence: 0.9, evidence_refs: ['E1'] })]);
  const b = path_('b', [u('B1', 'claim', 'x', { confidence: 0.85, evidence_refs: ['E1'] })]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'same_position' }]);
  assert.equal(out.events.filter(e => e.a?.id === 'A1').length, 0);
});

test('never infers contradiction without an explicit reviewer relation', () => {
  const a = path_('a', [u('A1', 'claim', 'x is true')]);
  const b = path_('b', [u('B1', 'claim', 'x is false')]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'related' }]);
  assert.equal(out.events.some(e => e.kind === 'reviewer_confirmed_contradiction'), false);
});

test('records reviewer-confirmed contradiction only when explicitly declared', () => {
  const a = path_('a', [u('A1', 'claim', 'x is true')]);
  const b = path_('b', [u('B1', 'claim', 'x is false')]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'related', relation: 'contradiction' }]);
  assert.ok(out.events.some(e => e.kind === 'reviewer_confirmed_contradiction'));
});

test('declared_role_divergence fires when matched types differ on a related decision', () => {
  const a = path_('a', [u('A1', 'observation', 'x')]);
  const b = path_('b', [u('B1', 'assumption', 'x')]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'related' }]);
  assert.ok(out.events.some(e => e.kind === 'declared_role_divergence'));
});

test('divergent_evidence_basis fires when related same-type units share no direct evidence but at least one cites some', () => {
  const a = path_('a', [u('A1', 'inference', 'x', { evidence_refs: ['E1'] })]);
  const b = path_('b', [u('B1', 'inference', 'x', { evidence_refs: ['E2'] })]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'related' }]);
  assert.ok(out.events.some(e => e.kind === 'divergent_evidence_basis'));
});

test('undeclared_support_gap fires only for inference/claim with no evidence and no dependency', () => {
  const a = path_('a', [
    u('A1', 'claim', 'unsupported claim'),
    u('A2', 'assumption', 'bare assumption'),
    u('A3', 'inference', 'has dep', { depends_on: ['A1'] }),
  ]);
  const b = path_('b', [u('B1', 'observation', 'x')]);
  const out = compare(a, b, []);
  const gaps = out.events.filter(e => e.kind === 'undeclared_support_gap');
  assert.ok(gaps.some(g => g.a?.id === 'A1'));
  assert.equal(gaps.some(g => g.a?.id === 'A2'), false);
  assert.equal(gaps.some(g => g.a?.id === 'A3'), false);
});

test('unmatched_unit fires for every unit not covered by a reviewer decision', () => {
  const a = path_('a', [u('A1', 'observation', 'x'), u('A2', 'observation', 'y')]);
  const b = path_('b', [u('B1', 'observation', 'x')]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'related' }]);
  assert.ok(out.events.some(e => e.kind === 'unmatched_unit' && e.details.side === 'a' && e.a.id === 'A2'));
});

test('unrelated decisions consume the pair but generate no divergence event', () => {
  const a = path_('a', [u('A1', 'observation', 'x')]);
  const b = path_('b', [u('B1', 'observation', 'y')]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'unrelated' }]);
  assert.equal(out.events.filter(e => e.a?.id === 'A1' || e.b?.id === 'B1').length, 0);
});

test('convergent_conclusion_different_path fires when same_position claims have different transitive evidence', () => {
  const a = path_('a', [
    u('A1', 'observation', 'obs', { evidence_refs: ['E1'] }),
    u('A2', 'claim', 'concl', { depends_on: ['A1'], evidence_refs: ['E2'] }),
  ]);
  const b = path_('b', [u('B1', 'claim', 'concl', { evidence_refs: ['E1'] })]);
  const out = compare(a, b, [{ a: 'A2', b: 'B1', decision: 'same_position' }]);
  assert.ok(out.events.some(e => e.kind === 'convergent_conclusion_different_path'));
});

test('divergent_conclusion_shared_evidence fires for related, distinct claims sharing transitive evidence', () => {
  const a = path_('a', [u('A1', 'claim', 'concl one', { evidence_refs: ['E1'] })]);
  const b = path_('b', [u('B1', 'claim', 'concl two', { evidence_refs: ['E1'] })]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'related' }]);
  assert.ok(out.events.some(e => e.kind === 'divergent_conclusion_shared_evidence'));
});

test('dependency_divergence fires when declared dependency roles differ', () => {
  const a = path_('a', [
    u('A1', 'observation', 'o'),
    u('A2', 'inference', 'i', { depends_on: ['A1'] }),
  ]);
  const b = path_('b', [
    u('B1', 'assumption', 'as'),
    u('B2', 'inference', 'i', { depends_on: ['B1'] }),
  ]);
  const out = compare(a, b, [{ a: 'A2', b: 'B2', decision: 'related' }]);
  assert.ok(out.events.some(e => e.kind === 'dependency_divergence'));
});

test('evidence_used_one_side_only fires per evidence id, not per unit', () => {
  const a = path_('a', [u('A1', 'observation', 'o', { evidence_refs: ['E1'] })]);
  const b = path_('b', [u('B1', 'observation', 'o')]);
  const out = compare(a, b, []);
  assert.ok(out.events.some(e => e.kind === 'evidence_used_one_side_only' && e.details.evidence_id === 'E1' && e.details.used_only_in === 'a'));
});

test('cyclic depends_on does not infinite-loop transitive evidence collection', () => {
  const a = path_('a', [
    u('A1', 'claim', 'c1', { depends_on: ['A2'], evidence_refs: ['E1'] }),
    u('A2', 'claim', 'c2', { depends_on: ['A1'], evidence_refs: ['E2'] }),
  ]);
  const b = path_('b', [u('B1', 'claim', 'c1', { evidence_refs: ['E1'] })]);
  assert.doesNotThrow(() => compare(a, b, [{ a: 'A1', b: 'B1', decision: 'same_position' }]));
});

test('rejects paths that answer different questions', () => {
  const a = path_('a', [u('A1', 'observation', 'x')], { question: 'Q1' });
  const b = path_('b', [u('B1', 'observation', 'x')], { question: 'Q2' });
  assert.throws(() => compare(a, b, []), /same exact question/);
});

test('ratio metrics report null (not 0 or 1) on a zero denominator', () => {
  const a = path_('a', []); const b = path_('b', []);
  const out = compare(a, b, []);
  assert.equal(out.metrics.evidence_overlap_ratio.value, null);
  assert.ok(out.metrics.evidence_overlap_ratio.note.length > 0);
});

test('engine result carries schema_version and engine_version for provenance', () => {
  const a = path_('a', [u('A1', 'observation', 'x')]);
  const b = path_('b', [u('B1', 'observation', 'x')]);
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'same_position' }]);
  assert.equal(out.engine_version, ENGINE_VERSION);
  assert.equal(out.schema_version, '2.0');
});

// --- Golden tests against the three shipped pilot cases ---
for (const dir of ['case-01-straightforward', 'case-02-ambiguous', 'case-03-noisy']) {
  test(`golden fixture ${dir} validates and compares without throwing`, () => {
    const a = read(`../fixtures/cases/${dir}/path-a.json`);
    const b = read(`../fixtures/cases/${dir}/path-b.json`);
    const rd = read(`../fixtures/cases/${dir}/reviewer-decisions.json`);
    const out = compare(a, b, rd.decisions);
    assert.equal(out.case_id, a.case_id);
    assert.ok(out.events.length > 0);
  });
}

test('golden case-01: convergent_conclusion_different_path and unmatched units as designed', () => {
  const a = read('../fixtures/cases/case-01-straightforward/path-a.json');
  const b = read('../fixtures/cases/case-01-straightforward/path-b.json');
  const rd = read('../fixtures/cases/case-01-straightforward/reviewer-decisions.json');
  const out = compare(a, b, rd.decisions);
  assert.ok(out.events.some(e => e.kind === 'convergent_conclusion_different_path' && e.a.id === 'A3' && e.b.id === 'B4'));
  assert.equal(out.metrics.unmatched_a, 1);
  assert.equal(out.metrics.unmatched_b, 3);
});

test('golden case-02: reviewer-confirmed contradiction and shared-evidence divergent conclusion as designed', () => {
  const a = read('../fixtures/cases/case-02-ambiguous/path-a.json');
  const b = read('../fixtures/cases/case-02-ambiguous/path-b.json');
  const rd = read('../fixtures/cases/case-02-ambiguous/reviewer-decisions.json');
  const out = compare(a, b, rd.decisions);
  assert.ok(out.events.some(e => e.kind === 'reviewer_confirmed_contradiction' && e.a.id === 'A4' && e.b.id === 'B3'));
  assert.ok(out.events.some(e => e.kind === 'divergent_conclusion_shared_evidence' && e.a.id === 'A4' && e.b.id === 'B3'));
});

test('golden case-03: undeclared support gap and reviewer-confirmed contradiction as designed', () => {
  const a = read('../fixtures/cases/case-03-noisy/path-a.json');
  const b = read('../fixtures/cases/case-03-noisy/path-b.json');
  const rd = read('../fixtures/cases/case-03-noisy/reviewer-decisions.json');
  const out = compare(a, b, rd.decisions);
  assert.ok(out.events.some(e => e.kind === 'undeclared_support_gap' && e.a?.id === 'A4'));
  assert.ok(out.events.some(e => e.kind === 'reviewer_confirmed_contradiction' && e.a.id === 'A4' && e.b.id === 'B3'));
  const evidenceE4 = out.evidence_usage.find(e => e.id === 'E4');
  assert.equal(evidenceE4.status, 'unused');
});
