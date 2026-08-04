import test from 'node:test';
import assert from 'node:assert/strict';
import { compare } from '../src/engine.js';
import { toMarkdown, toCsv } from '../src/report.js';

function u(id, type, text, extra = {}) { return { id, type, text, evidence_refs: [], depends_on: [], confidence: null, confirmed: true, ...extra }; }
function path_(id) {
  return { id, case_id: 'c1', analyst_id: `analyst-${id}`, question: 'Q?', evidence: [{ id: 'E1', text: 'ev' }], units: [u(`${id.toUpperCase()}1`, 'observation', 'x')] };
}

test('markdown report carries the scope disclaimer and does not overclaim', () => {
  const out = compare(path_('a'), path_('b'), []);
  const md = toMarkdown(out);
  assert.ok(md.includes('does not determine truth'));
  assert.ok(md.includes('open empirical question'));
});

test('markdown renders a null-valued ratio metric as n/a with its note, not as 0', () => {
  const out = compare(path_('a'), path_('b'), []);
  const md = toMarkdown(out);
  assert.ok(/evidence_overlap_ratio \| n\/a/.test(md));
});

test('csv has one row per event plus header, and cells with commas are quoted', () => {
  const a = path_('a'), b = path_('b');
  const out = compare(a, b, [{ a: 'A1', b: 'B1', decision: 'related', note: 'has, a comma' }]);
  const csv = toCsv(out);
  const lines = csv.split('\n');
  assert.equal(lines.length, 1 + out.events.length);
  assert.ok(lines[0].startsWith('event_id,kind,case_id'));
});
