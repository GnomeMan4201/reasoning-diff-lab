import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const dist = path.join(root, 'dist');

const { compare } = await import(path.join(dist, 'src', 'engine.js'));
const { toMarkdown, toCsv } = await import(path.join(dist, 'src', 'report.js'));

let totalEvents = 0;
for (const dir of ['case-01-straightforward', 'case-02-ambiguous', 'case-03-noisy']) {
  const base = path.join(dist, 'fixtures', 'cases', dir);
  const a = JSON.parse(fs.readFileSync(path.join(base, 'path-a.json'), 'utf8'));
  const b = JSON.parse(fs.readFileSync(path.join(base, 'path-b.json'), 'utf8'));
  const rd = JSON.parse(fs.readFileSync(path.join(base, 'reviewer-decisions.json'), 'utf8'));
  const out = compare(a, b, rd.decisions);
  assert.ok(out.events.length > 0, `${dir} produced no events`);
  const md = toMarkdown(out);
  assert.ok(md.includes('does not determine truth'));
  const csv = toCsv(out);
  assert.ok(csv.split('\n').length === out.events.length + 1);
  totalEvents += out.events.length;
  console.log(`  ${dir}: ${out.events.length} events, OK`);
}
console.log(`Smoke test passed on built artifact: ${totalEvents} total events across 3 cases.`);
