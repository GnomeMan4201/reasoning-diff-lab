import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const dist = path.join(root, 'dist');

const { compare } = await import(path.join(dist, 'src', 'engine.js'));
const { toMarkdown, toCsv } = await import(path.join(dist, 'src', 'report.js'));
const { suggestionOutcome, evidenceMatches } = await import(path.join(dist, 'src', 'pilot_session.js'));

let totalEvents = 0;
for (const dir of ['case-01-straightforward', 'case-02-ambiguous', 'case-03-noisy']) {
  const base = path.join(dist, 'fixtures', 'cases', dir);
  const a = JSON.parse(fs.readFileSync(path.join(base, 'path-a.json'), 'utf8'));
  const b = JSON.parse(fs.readFileSync(path.join(base, 'path-b.json'), 'utf8'));
  const participant = JSON.parse(fs.readFileSync(path.join(base, 'participant.json'), 'utf8'));
  const rd = JSON.parse(fs.readFileSync(path.join(base, 'reviewer-decisions.json'), 'utf8'));

  assert.ok(Array.isArray(participant.evidence) && participant.evidence.length > 0, `${dir} has no participant evidence`);
  assert.equal('design_note_do_not_show_before_grading' in participant, false, `${dir} participant packet leaks design notes`);
  assert.equal(evidenceMatches(participant.evidence, a.evidence), true, `${dir} participant evidence differs from path A`);
  assert.equal(evidenceMatches(participant.evidence, b.evidence), true, `${dir} participant evidence differs from path B`);

  const out = compare(a, b, rd.decisions);
  assert.ok(out.events.length > 0, `${dir} produced no events`);
  const md = toMarkdown(out);
  assert.ok(md.includes('does not determine truth'));
  const csv = toCsv(out);
  assert.ok(csv.split('\n').length === out.events.length + 1);
  totalEvents += out.events.length;
  console.log(`  ${dir}: ${out.events.length} events, participant packet OK`);
}

for (const file of ['case.json', 'path-a.json', 'path-b.json']) {
  assert.ok(fs.existsSync(path.join(dist, 'fixtures', 'demo', file)), `missing demo ${file}`);
}

const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(dist, 'app.js'), 'utf8');
for (const id of ['resetSessionBtn', 'importPathA', 'importPathB', 'downloadBaselineBtn', 'handoffDialog']) {
  assert.ok(html.includes(`id="${id}"`), `built UI missing ${id}`);
}
assert.ok(app.includes("participant.json"), 'pilot UI does not load participant-safe packets');
assert.ok(app.includes("../fixtures/demo"), 'pilot UI does not use a separate demo fixture');
assert.ok(app.includes("Analyst roles cannot open reviewer materials"), 'pilot UI lacks reviewer-screen guard');
assert.equal(suggestionOutcome('unrelated'), 'rejected');

console.log(`Smoke test passed on built artifact: ${totalEvents} total events across 3 cases; pilot safety boundaries present.`);
