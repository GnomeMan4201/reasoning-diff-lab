import { assertReasoningPath, assertReviewerDecisions } from '../src/model.js';
import { suggestCandidateMatches } from '../src/matcher.js';
import { compare } from '../src/engine.js';
import { toMarkdown, toCsv } from '../src/report.js';
import { splitProse, finalizeDrafts } from '../src/prose_split.js';

const $ = id => document.getElementById(id);
const STORAGE_KEY = 'rdl-session-v2';

const state = load() || {
  caseId: 'case-01-straightforward',
  role: 'analyst_a',
  reviewMode: 'blind',
  caseDef: null,
  paths: {},          // { analyst_a: ReasoningPath, analyst_b: ReasoningPath }
  drafts: [],         // prose-assist drafts pending confirmation
  guidedUnits: [],    // in-progress guided units for the current role
  decisions: [],      // reviewer decisions
  matchLogs: [],      // { mode, outcome, time_to_match_ms }
  sessionTimings: [], // { analyst_id, case_id, mode, total_ms, edits, abandoned_fields, validation_errors, completion }
  result: null,
  entryStartedAt: null,
  entryEdits: 0,
  entryValidationErrors: 0,
};

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; } }

// ---------- navigation ----------
document.querySelectorAll('.step').forEach(btn => btn.addEventListener('click', () => showStep(btn.dataset.step)));
function showStep(step) {
  document.querySelectorAll('.step').forEach(b => b.classList.toggle('active', b.dataset.step === step));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === step));
}

$('whatIsThisLink').addEventListener('click', e => { e.preventDefault(); $('whatIsThisDialog').showModal(); });
$('closeWhatIsThis').addEventListener('click', () => $('whatIsThisDialog').close());

// ---------- setup ----------
$('caseSelect').value = state.caseId;
$('roleSelect').value = state.role;
$('reviewModeSelect').value = state.reviewMode;

$('caseSelect').addEventListener('change', async () => { state.caseId = $('caseSelect').value; save(); await loadCase(); });
$('roleSelect').addEventListener('change', () => { state.role = $('roleSelect').value; resetEntryTimer(); save(); renderGuidedUnits(); });
$('reviewModeSelect').addEventListener('change', () => { state.reviewMode = $('reviewModeSelect').value; save(); renderMatchList(); });

async function loadCase() {
  try {
    const res = await fetch(`../fixtures/cases/${state.caseId}/case.json`);
    state.caseDef = await res.json();
  } catch {
    state.caseDef = null;
  }
  renderCaseSummary();
  save();
}

function renderCaseSummary() {
  const c = state.caseDef;
  $('caseSummary').innerHTML = c
    ? `<p><strong>${esc(c.title)}</strong></p><p>${esc(c.research_question)}</p><p class="hint">${esc(c.analyst_instructions)}</p>`
    : '<p class="hint">Could not load case metadata — you can still enter paths manually.</p>';
}

$('loadDemoBtn').addEventListener('click', async () => {
  const base = `../fixtures/cases/${state.caseId}`;
  const [a, b] = await Promise.all(['path-a.json', 'path-b.json'].map(f => fetch(`${base}/${f}`).then(r => r.json())));
  state.paths.analyst_a = a; state.paths.analyst_b = b;
  save();
  showStep('review'); renderMatchList();
});

// ---------- entry mode tabs ----------
document.querySelectorAll('.mode-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.mode-tab').forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
  document.querySelectorAll('.mode-panel').forEach(p => p.classList.toggle('active', p.dataset.modePanel === tab.dataset.mode));
}));

function resetEntryTimer() {
  state.entryStartedAt = Date.now();
  state.entryEdits = 0;
  state.entryValidationErrors = 0;
  state.guidedUnits = [];
  state.drafts = [];
}
if (!state.entryStartedAt) resetEntryTimer();

// ---------- guided entry ----------
function currentEvidence() { return (state.caseDef?.evidenceInline) || evidenceForCase(); }
function evidenceForCase() {
  const existing = state.paths.analyst_a || state.paths.analyst_b;
  return existing ? existing.evidence : [];
}

$('addUnitBtn').addEventListener('click', () => {
  state.guidedUnits.push({ id: `${roleTag()}${state.guidedUnits.length + 1}`, type: 'observation', text: '', evidence_refs: [], depends_on: [], confidence: null, source: 'guided', confirmed: true });
  state.entryEdits++;
  save(); renderGuidedUnits();
});

function roleTag() { return state.role === 'analyst_a' ? 'A' : 'B'; }

function renderGuidedUnits() {
  const box = $('guidedUnits');
  const evidence = evidenceForCase();
  box.innerHTML = state.guidedUnits.map((u, i) => `
    <fieldset class="unit-card">
      <legend>Unit ${u.id}</legend>
      <label>Type
        <select data-i="${i}" data-f="type">
          ${['observation', 'assumption', 'inference', 'claim', 'unknown'].map(t => `<option value="${t}" ${u.type === t ? 'selected' : ''}>${label(t)}</option>`).join('')}
        </select>
      </label>
      <label>What you observed, assumed, inferred, or concluded
        <textarea data-i="${i}" data-f="text" rows="2">${esc(u.text)}</textarea>
      </label>
      <label>Evidence used (optional)
        <span class="checks">${evidence.map(e => `<label class="chk"><input type="checkbox" data-i="${i}" data-f="ev" value="${e.id}" ${u.evidence_refs.includes(e.id) ? 'checked' : ''}> ${e.id}</label>`).join('')}</span>
      </label>
      <label>Builds on which earlier unit(s)? (optional)
        <span class="checks">${state.guidedUnits.filter((_, j) => j < i).map(d => `<label class="chk"><input type="checkbox" data-i="${i}" data-f="dep" value="${d.id}" ${u.depends_on.includes(d.id) ? 'checked' : ''}> ${d.id}</label>`).join('') || '<span class="hint">none yet</span>'}</span>
      </label>
      <label>Your confidence (optional)
        <input type="range" min="0" max="1" step="0.05" data-i="${i}" data-f="confidence" value="${u.confidence ?? 0.5}">
        <output>${u.confidence ?? '—'}</output>
      </label>
      <button data-i="${i}" data-f="remove">Remove</button>
    </fieldset>`).join('') || '<p class="hint">No units yet. Add your first one.</p>';

  box.querySelectorAll('[data-f="type"]').forEach(el => el.addEventListener('change', () => { state.guidedUnits[el.dataset.i].type = el.value; state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="text"]').forEach(el => el.addEventListener('input', () => { state.guidedUnits[el.dataset.i].text = el.value; state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="ev"]').forEach(el => el.addEventListener('change', () => { toggleArr(state.guidedUnits[el.dataset.i].evidence_refs, el.value, el.checked); state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="dep"]').forEach(el => el.addEventListener('change', () => { toggleArr(state.guidedUnits[el.dataset.i].depends_on, el.value, el.checked); state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="confidence"]').forEach(el => el.addEventListener('input', () => { state.guidedUnits[el.dataset.i].confidence = Number(el.value); el.nextElementSibling.textContent = el.value; state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="remove"]').forEach(el => el.addEventListener('click', () => { state.guidedUnits.splice(Number(el.dataset.i), 1); state.entryEdits++; save(); renderGuidedUnits(); }));
}
function toggleArr(arr, val, on) { const i = arr.indexOf(val); if (on && i === -1) arr.push(val); if (!on && i !== -1) arr.splice(i, 1); }
function label(t) { return { observation: 'Observation', assumption: 'Assumption', inference: 'Inference', claim: 'Claim / conclusion', unknown: 'Unknown / open question' }[t]; }

// ---------- prose-assisted entry ----------
$('splitProseBtn').addEventListener('click', () => {
  state.drafts = splitProse($('proseInput').value, evidenceForCase()).map(d => ({ ...d, confirmed: false }));
  state.entryEdits++;
  save(); renderDraftUnits();
});

function renderDraftUnits() {
  const box = $('draftUnits');
  const evidence = evidenceForCase();
  box.innerHTML = state.drafts.map((d, i) => `
    <fieldset class="unit-card draft">
      <legend>Draft ${i + 1} — ${d.confirmed ? 'confirmed' : 'unconfirmed, edit and confirm'}</legend>
      <label>Type
        <select data-i="${i}" data-f="type">
          ${['observation', 'assumption', 'inference', 'claim', 'unknown'].map(t => `<option value="${t}" ${d.type === t ? 'selected' : ''}>${label(t)}</option>`).join('')}
        </select>
      </label>
      <label>Text
        <textarea data-i="${i}" data-f="text" rows="2">${esc(d.text)}</textarea>
      </label>
      <label>Evidence used
        <span class="checks">${evidence.map(e => `<label class="chk"><input type="checkbox" data-i="${i}" data-f="ev" value="${e.id}" ${d.evidence_refs.includes(e.id) ? 'checked' : ''}> ${e.id}</label>`).join('')}</span>
      </label>
      <label class="chk"><input type="checkbox" data-i="${i}" data-f="confirm" ${d.confirmed ? 'checked' : ''}> I confirm this unit as written</label>
    </fieldset>`).join('') || '<p class="hint">Write prose above, then click "Suggest a structure".</p>';

  box.querySelectorAll('[data-f="type"]').forEach(el => el.addEventListener('change', () => { state.drafts[el.dataset.i].type = el.value; state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="text"]').forEach(el => el.addEventListener('input', () => { state.drafts[el.dataset.i].text = el.value; state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="ev"]').forEach(el => el.addEventListener('change', () => { toggleArr(state.drafts[el.dataset.i].evidence_refs, el.value, el.checked); state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="confirm"]').forEach(el => el.addEventListener('change', () => { state.drafts[el.dataset.i].confirmed = el.checked; save(); }));
}

// ---------- save path ----------
$('submitPathBtn').addEventListener('click', () => {
  const activeMode = document.querySelector('.mode-tab.active').dataset.mode;
  let units;
  if (activeMode === 'guided') {
    units = state.guidedUnits;
  } else {
    const confirmed = state.drafts.filter(d => d.confirmed);
    units = finalizeDrafts(confirmed, roleTag());
  }
  const abandoned = units.filter(u => !u.text.trim()).length;
  const path = {
    id: `${state.caseId}-${state.role}`, case_id: state.caseId, analyst_id: state.role,
    question: state.caseDef?.research_question || '(question not loaded)',
    evidence: evidenceForCase(), units,
  };
  try {
    assertReasoningPath(path, state.role);
  } catch (err) {
    state.entryValidationErrors++;
    showError(err.message);
    logTiming(false, abandoned);
    return;
  }
  state.paths[state.role] = path;
  logTiming(true, abandoned);
  clearError();
  save();
  showStep('review'); renderMatchList();
});

function logTiming(completion, abandoned) {
  state.sessionTimings.push({
    analyst_id: state.role, case_id: state.caseId, mode: document.querySelector('.mode-tab.active').dataset.mode,
    total_ms: Date.now() - (state.entryStartedAt || Date.now()),
    edits: state.entryEdits, abandoned_fields: abandoned, validation_errors: state.entryValidationErrors,
    completion,
  });
  save();
}

// ---------- reviewer matching ----------
const MODE_HINTS = {
  blind: 'Blind mode: no candidate suggestions are shown. Add every match manually.',
  suggested_hidden_score: 'Suggested mode: candidate pairs are shown, but the match score is hidden.',
  suggested_visible_score: 'Suggested mode: candidate pairs are shown with their match score.',
};

function renderMatchList() {
  $('reviewModeHint').textContent = MODE_HINTS[state.reviewMode];
  const a = state.paths.analyst_a, b = state.paths.analyst_b;
  const box = $('matchList');
  if (!a || !b) { box.innerHTML = '<p class="hint">Both Analyst A and Analyst B must save a path first (or load the demo).</p>'; return; }

  const suggestions = state.reviewMode === 'blind' ? [] : suggestCandidateMatches(a, b);
  box.innerHTML = suggestions.map((s, idx) => {
    const ua = a.units.find(u => u.id === s.a), ub = b.units.find(u => u.id === s.b);
    const existing = state.decisions.find(d => d.a === s.a && d.b === s.b);
    const scoreLabel = state.reviewMode === 'suggested_visible_score' ? `${Math.round(s.score * 100)}%` : '?';
    return `<article class="match-card" data-idx="${idx}" data-a="${s.a}" data-b="${s.b}">
      <div class="match-grid">
        <div><span class="tag">A · ${ua.type}</span><p>${esc(ua.text)}</p></div>
        <div class="score">${scoreLabel}</div>
        <div><span class="tag">B · ${ub.type}</span><p>${esc(ub.text)}</p></div>
      </div>
      <div class="decision-buttons">
        ${['same_position', 'related', 'unrelated'].map(d => `<button data-decision="${d}" class="${existing?.decision === d ? 'active' : ''}">${decisionLabel(d)}</button>`).join('')}
        <label class="chk"><input type="checkbox" data-relation="contradiction" ${existing?.relation === 'contradiction' ? 'checked' : ''}> Reviewer-confirmed contradiction</label>
      </div>
    </article>`;
  }).join('') + renderManualMatches(a, b);

  box.querySelectorAll('.match-card').forEach(card => {
    const startedAt = Date.now();
    card.querySelectorAll('[data-decision]').forEach(btn => btn.addEventListener('click', () => {
      const aId = card.dataset.a, bId = card.dataset.b;
      const relationBox = card.querySelector('[data-relation]');
      upsertDecision(aId, bId, btn.dataset.decision, relationBox.checked ? 'contradiction' : null, 'suggested');
      state.matchLogs.push({ mode: state.reviewMode, outcome: 'accepted', time_to_match_ms: Date.now() - startedAt });
      save(); renderMatchList();
    }));
  });
}

function decisionLabel(d) { return { same_position: 'Same position', related: 'Related, distinct', unrelated: 'Unrelated' }[d]; }

function upsertDecision(a, b, decision, relation, match_source) {
  state.decisions = state.decisions.filter(d => !(d.a === a && d.b === b));
  state.decisions.push({ a, b, decision, relation: relation || undefined, match_source });
}

let manualDraft = { a: '', b: '' };
function renderManualMatches(a, b) {
  const manual = state.decisions.filter(d => d.match_source === 'manual');
  return `<h3>Manual matches</h3>` + manual.map(m => `<p class="manual-row">${m.a} ↔ ${m.b} — ${decisionLabel(m.decision)}${m.relation ? ` (${m.relation})` : ''}</p>`).join('')
    + `<div class="manual-picker">
        <select id="manualA"><option value="">Unit from A…</option>${a.units.map(u => `<option value="${u.id}">${u.id} — ${esc(u.text.slice(0, 40))}</option>`).join('')}</select>
        <select id="manualB"><option value="">Unit from B…</option>${b.units.map(u => `<option value="${u.id}">${u.id} — ${esc(u.text.slice(0, 40))}</option>`).join('')}</select>
        <select id="manualDecision">${['same_position', 'related', 'unrelated'].map(d => `<option value="${d}">${decisionLabel(d)}</option>`).join('')}</select>
        <label class="chk"><input type="checkbox" id="manualContradiction"> contradiction</label>
      </div>`;
}

$('addManualMatchBtn').addEventListener('click', () => {
  const startedAt = state._manualStartedAt || Date.now();
  const aSel = $('manualA'), bSel = $('manualB'), dSel = $('manualDecision'), cChk = $('manualContradiction');
  if (!aSel || !bSel || !aSel.value || !bSel.value) { showError('Pick a unit from A and a unit from B first.'); return; }
  upsertDecision(aSel.value, bSel.value, dSel.value, cChk.checked ? 'contradiction' : null, 'manual');
  state.matchLogs.push({ mode: state.reviewMode, outcome: 'manual', time_to_match_ms: Date.now() - startedAt });
  clearError();
  save(); renderMatchList();
});

$('runCompareBtn').addEventListener('click', () => {
  const a = state.paths.analyst_a, b = state.paths.analyst_b;
  if (!a || !b) { showError('Both paths are required before comparing.'); return; }
  try {
    assertReviewerDecisions(state.decisions, a, b);
    state.result = compare(a, b, state.decisions);
  } catch (err) {
    showError(err.message);
    return;
  }
  clearError();
  save();
  showStep('results'); renderResults();
});

// ---------- results ----------
function renderResults() {
  const r = state.result;
  if (!r) { $('metrics').innerHTML = '<p class="hint">Run a comparison first.</p>'; return; }
  $('metrics').innerHTML = Object.entries(r.metrics).map(([k, v]) => {
    const display = (v && typeof v === 'object' && 'value' in v) ? (v.value == null ? `n/a` : v.value) : v;
    return `<div class="metric"><strong>${display}</strong>${k}</div>`;
  }).join('');
  $('events').innerHTML = r.events.length ? r.events.map(e => `
    <article class="event">
      <span class="tag">${e.kind.replaceAll('_', ' ')}</span>
      ${e.a ? `<p><b>A (${e.a.id}):</b> ${esc(e.a.text)}</p>` : ''}
      ${e.b ? `<p><b>B (${e.b.id}):</b> ${esc(e.b.text)}</p>` : ''}
      ${e.details?.reason ? `<p class="muted">${esc(e.details.reason)}</p>` : ''}
    </article>`).join('') : '<p class="hint">No divergence events.</p>';
  const tbody = document.querySelector('#evidenceTable tbody');
  tbody.innerHTML = r.evidence_usage.map(e => `<tr><td>${e.id}</td><td>${e.status}</td><td>${e.a_units.join(', ')}</td><td>${e.b_units.join(', ')}</td></tr>`).join('');
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
$('exportJsonBtn').addEventListener('click', () => state.result && download('report.json', JSON.stringify(state.result, null, 2), 'application/json'));
$('exportMdBtn').addEventListener('click', () => state.result && download('report.md', toMarkdown(state.result), 'text/markdown'));
$('exportCsvBtn').addEventListener('click', () => state.result && download('report.csv', toCsv(state.result), 'text/csv'));
$('exportSessionBtn').addEventListener('click', () => download('session-log.json', JSON.stringify({
  case_id: state.caseId, session_timings: state.sessionTimings, match_logs: state.matchLogs, reviewer_decisions_flat: state.decisions,
}, null, 2), 'application/json'));

// ---------- helpers ----------
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function showError(msg) { $('errorBox').textContent = msg; }
function clearError() { $('errorBox').textContent = ''; }

// ---------- init ----------
loadCase();
renderGuidedUnits();
renderDraftUnits();
renderMatchList();
if (state.result) renderResults();
