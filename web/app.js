import { assertReasoningPath, assertReviewerDecisions } from '../src/model.js';
import { suggestCandidateMatches } from '../src/matcher.js';
import { compare } from '../src/engine.js';
import { toMarkdown, toCsv } from '../src/report.js';
import { splitProse, finalizeDrafts } from '../src/prose_split.js';
import {
  suggestionOutcome,
  evidenceMatches,
  resetCaseState,
  buildSessionLog,
} from '../src/pilot_session.js';

const $ = id => document.getElementById(id);
const STORAGE_KEY = 'rdl-session-v2.0.1';
const DEMO_CASE_ID = 'demo-training';

function emptyState() {
  return {
    caseId: 'case-01-straightforward',
    role: 'analyst_a',
    reviewMode: 'blind',
    caseDef: null,
    paths: {},
    drafts: [],
    guidedUnits: [],
    decisions: [],
    matchLogs: [],
    sessionTimings: [],
    reviewerTimings: [],
    result: null,
    entryStartedAt: null,
    reviewStartedAt: null,
    entryEdits: 0,
    entryValidationErrors: 0,
    baselineTimeMs: null,
    pathSavedRole: null,
    manualMatchStartedAt: null,
  };
}

function normalizeState(value) {
  const base = emptyState();
  return {
    ...base,
    ...(value || {}),
    // Always reload the participant-safe packet rather than trusting an older cached case file.
    caseDef: null,
    paths: value?.paths || {},
    drafts: value?.drafts || [],
    guidedUnits: value?.guidedUnits || [],
    decisions: value?.decisions || [],
    matchLogs: value?.matchLogs || [],
    sessionTimings: value?.sessionTimings || [],
    reviewerTimings: value?.reviewerTimings || [],
  };
}

let state = normalizeState(load());

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
  catch { return null; }
}

// ---------- navigation and role boundaries ----------
document.querySelectorAll('.step').forEach(btn => btn.addEventListener('click', () => showStep(btn.dataset.step)));

function showStep(step) {
  clearError();
  if (state.role !== 'reviewer' && (step === 'review' || step === 'results')) {
    showError('Analyst roles cannot open reviewer materials. Hand the device back to the facilitator.');
    return;
  }
  if (state.role === 'reviewer' && step === 'entry') {
    showError('Switch to an analyst role before entering a reasoning path.');
    return;
  }
  if (step === 'review') {
    if (!state.paths.analyst_a || !state.paths.analyst_b) {
      showError('Both frozen analyst paths are required before reviewer matching.');
      return;
    }
    if (state.caseId !== DEMO_CASE_ID && !(state.baselineTimeMs > 0)) {
      showError('Complete the prose-only baseline and record its duration before opening reviewer matching.');
      return;
    }
    if (!state.reviewStartedAt) state.reviewStartedAt = Date.now();
    save();
    renderMatchList();
  }
  if (step === 'results' && !state.result) {
    showError('Generate a report before opening Results.');
    return;
  }
  document.querySelectorAll('.step').forEach(b => b.classList.toggle('active', b.dataset.step === step));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === step));
}

function updateRoleUi() {
  const reviewer = state.role === 'reviewer';
  $('reviewerControls').hidden = !reviewer;
  document.querySelector('[data-step="entry"]').disabled = reviewer;
  document.querySelector('[data-step="review"]').disabled = !reviewer;
  document.querySelector('[data-step="results"]').disabled = !reviewer;
  $('pathSavedBox').hidden = !(state.pathSavedRole && state.pathSavedRole === state.role && !reviewer);
  renderPathImportStatus();
}

$('whatIsThisLink').addEventListener('click', e => { e.preventDefault(); $('whatIsThisDialog').showModal(); });
$('closeWhatIsThis').addEventListener('click', () => $('whatIsThisDialog').close());

// ---------- setup ----------
$('caseSelect').value = state.caseId;
$('roleSelect').value = state.role;
$('reviewModeSelect').value = state.reviewMode;
$('baselineMinutes').value = state.baselineTimeMs ? String(state.baselineTimeMs / 60000) : '';

$('caseSelect').addEventListener('change', async () => {
  const nextCaseId = $('caseSelect').value;
  if (nextCaseId === state.caseId) return;
  if (hasCaseWork() && !confirm('Switching cases clears the current browser work. Export the current report and session log first. Continue?')) {
    $('caseSelect').value = state.caseId;
    return;
  }
  state = resetCaseState(state, nextCaseId);
  save();
  await loadCase();
  renderAll();
  showStep('setup');
});

$('roleSelect').addEventListener('change', () => {
  state.role = $('roleSelect').value;
  if (state.role !== 'reviewer') resetEntryTimer();
  else state.reviewStartedAt = null;
  save();
  updateRoleUi();
  renderGuidedUnits();
  renderDraftUnits();
  showStep('setup');
});

$('reviewModeSelect').addEventListener('change', () => {
  state.reviewMode = $('reviewModeSelect').value;
  state.decisions = [];
  state.matchLogs = [];
  state.result = null;
  state.reviewStartedAt = null;
  save();
  renderMatchList();
});

$('baselineMinutes').addEventListener('input', () => {
  const minutes = Number($('baselineMinutes').value);
  state.baselineTimeMs = Number.isFinite(minutes) && minutes > 0 ? minutes * 60000 : null;
  save();
});

function caseBase(caseId = state.caseId) {
  return caseId === DEMO_CASE_ID ? '../fixtures/demo' : `../fixtures/cases/${caseId}`;
}

async function loadCase() {
  try {
    const file = state.caseId === DEMO_CASE_ID ? 'case.json' : 'participant.json';
    const res = await fetch(`${caseBase()}/${file}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const candidate = await res.json();
    if (!Array.isArray(candidate.evidence) || !candidate.research_question) throw new Error('participant packet is incomplete');
    state.caseDef = candidate;
  } catch (err) {
    state.caseDef = null;
    showError(`Could not load the participant evidence packet: ${err.message}`);
  }
  renderCaseSummary();
  renderEvidencePackets();
  save();
}

function renderCaseSummary() {
  const c = state.caseDef;
  $('caseSummary').innerHTML = c
    ? `<p><strong>${esc(c.title)}</strong></p><p>${esc(c.research_question)}</p><p class="hint">${esc(c.analyst_instructions)}</p>`
    : '<p class="hint">The case packet did not load. Do not begin the pilot on this browser.</p>';
}

function renderEvidencePackets() {
  const evidence = evidenceForCase();
  const html = evidence.length
    ? `<h3>Evidence packet</h3><ol class="evidence-list">${evidence.map(e => `<li><strong>${esc(e.id)}</strong> — ${esc(e.text)}</li>`).join('')}</ol>`
    : '<p class="hint">No participant evidence is loaded. Stop and contact the facilitator.</p>';
  $('evidencePacket').innerHTML = html;
  $('entryEvidencePacket').innerHTML = html;
}

$('loadDemoBtn').addEventListener('click', async () => {
  if (hasCaseWork() && !confirm('Loading the training demo clears the current browser work. Continue?')) return;
  state = resetCaseState(state, DEMO_CASE_ID);
  state.role = 'reviewer';
  state.reviewMode = 'suggested_visible_score';
  $('caseSelect').value = DEMO_CASE_ID;
  $('roleSelect').value = 'reviewer';
  $('reviewModeSelect').value = state.reviewMode;
  await loadCase();
  try {
    const [a, b] = await Promise.all(['path-a.json', 'path-b.json'].map(async file => {
      const res = await fetch(`${caseBase(DEMO_CASE_ID)}/${file}`);
      if (!res.ok) throw new Error(`Could not load ${file}`);
      return res.json();
    }));
    assertReasoningPath(a, 'demo analyst A');
    assertReasoningPath(b, 'demo analyst B');
    state.paths.analyst_a = a;
    state.paths.analyst_b = b;
    save();
    updateRoleUi();
    renderAll();
    showStep('review');
  } catch (err) {
    showError(err.message);
  }
});

// ---------- entry mode tabs ----------
document.querySelectorAll('.mode-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.mode-tab').forEach(t => {
    t.classList.toggle('active', t === tab);
    t.setAttribute('aria-selected', String(t === tab));
  });
  document.querySelectorAll('.mode-panel').forEach(p => p.classList.toggle('active', p.dataset.modePanel === tab.dataset.mode));
}));

function resetEntryTimer() {
  state.entryStartedAt = Date.now();
  state.entryEdits = 0;
  state.entryValidationErrors = 0;
  state.guidedUnits = [];
  state.drafts = [];
  state.pathSavedRole = null;
  if ($('proseInput')) $('proseInput').value = '';
}
if (!state.entryStartedAt) resetEntryTimer();

function evidenceForCase() { return state.caseDef?.evidence || []; }

$('addUnitBtn').addEventListener('click', () => {
  if (state.role === 'reviewer') { showError('Select an analyst role first.'); return; }
  state.guidedUnits.push({
    id: `${roleTag()}${state.guidedUnits.length + 1}`,
    type: 'observation', text: '', evidence_refs: [], depends_on: [], confidence: null,
    source: 'guided', confirmed: true,
  });
  state.entryEdits++;
  save();
  renderGuidedUnits();
});

function roleTag() {
  if (state.role === 'analyst_a') return 'A';
  if (state.role === 'analyst_b') return 'B';
  throw new Error('Reviewer cannot author a reasoning path');
}

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
        <span class="checks">${evidence.map(e => `<label class="chk"><input type="checkbox" data-i="${i}" data-f="ev" value="${e.id}" ${u.evidence_refs.includes(e.id) ? 'checked' : ''}> ${esc(e.id)}</label>`).join('')}</span>
      </label>
      <label>Builds on which earlier unit(s)? (optional)
        <span class="checks">${state.guidedUnits.filter((_, j) => j < i).map(d => `<label class="chk"><input type="checkbox" data-i="${i}" data-f="dep" value="${d.id}" ${u.depends_on.includes(d.id) ? 'checked' : ''}> ${esc(d.id)}</label>`).join('') || '<span class="hint">none yet</span>'}</span>
      </label>
      <label>Your confidence (optional)
        <input type="range" min="0" max="1" step="0.05" data-i="${i}" data-f="confidence" value="${u.confidence ?? 0.5}">
        <output>${u.confidence ?? '—'}</output>
      </label>
      <button data-i="${i}" data-f="remove" class="secondary">Remove</button>
    </fieldset>`).join('') || '<p class="hint">No units yet. Add your first one.</p>';

  box.querySelectorAll('[data-f="type"]').forEach(el => el.addEventListener('change', () => { state.guidedUnits[el.dataset.i].type = el.value; state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="text"]').forEach(el => el.addEventListener('input', () => { state.guidedUnits[el.dataset.i].text = el.value; state.entryEdits++; save(); renderEntryStats(); }));
  box.querySelectorAll('[data-f="ev"]').forEach(el => el.addEventListener('change', () => { toggleArr(state.guidedUnits[el.dataset.i].evidence_refs, el.value, el.checked); state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="dep"]').forEach(el => el.addEventListener('change', () => { toggleArr(state.guidedUnits[el.dataset.i].depends_on, el.value, el.checked); state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="confidence"]').forEach(el => el.addEventListener('input', () => { state.guidedUnits[el.dataset.i].confidence = Number(el.value); el.nextElementSibling.textContent = el.value; state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="remove"]').forEach(el => el.addEventListener('click', () => { state.guidedUnits.splice(Number(el.dataset.i), 1); state.entryEdits++; save(); renderGuidedUnits(); renderEntryStats(); }));
  renderEntryStats();
}

function toggleArr(arr, val, on) {
  const i = arr.indexOf(val);
  if (on && i === -1) arr.push(val);
  if (!on && i !== -1) arr.splice(i, 1);
}

function label(t) {
  return {
    observation: 'Observation', assumption: 'Assumption', inference: 'Inference',
    claim: 'Claim / conclusion', unknown: 'Unknown / open question',
  }[t];
}

// ---------- prose-assisted entry ----------
$('splitProseBtn').addEventListener('click', () => {
  state.drafts = splitProse($('proseInput').value, evidenceForCase()).map(d => ({ ...d, confirmed: false }));
  state.entryEdits++;
  save();
  renderDraftUnits();
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
        <span class="checks">${evidence.map(e => `<label class="chk"><input type="checkbox" data-i="${i}" data-f="ev" value="${e.id}" ${d.evidence_refs.includes(e.id) ? 'checked' : ''}> ${esc(e.id)}</label>`).join('')}</span>
      </label>
      <label class="chk"><input type="checkbox" data-i="${i}" data-f="confirm" ${d.confirmed ? 'checked' : ''}> I confirm this unit as written</label>
    </fieldset>`).join('') || '<p class="hint">Write prose above, then click “Suggest a structure.”</p>';

  box.querySelectorAll('[data-f="type"]').forEach(el => el.addEventListener('change', () => { state.drafts[el.dataset.i].type = el.value; state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="text"]').forEach(el => el.addEventListener('input', () => { state.drafts[el.dataset.i].text = el.value; state.entryEdits++; save(); renderEntryStats(); }));
  box.querySelectorAll('[data-f="ev"]').forEach(el => el.addEventListener('change', () => { toggleArr(state.drafts[el.dataset.i].evidence_refs, el.value, el.checked); state.entryEdits++; save(); }));
  box.querySelectorAll('[data-f="confirm"]').forEach(el => el.addEventListener('change', () => { state.drafts[el.dataset.i].confirmed = el.checked; save(); renderEntryStats(); }));
  renderEntryStats();
}

function renderEntryStats() {
  const activeMode = document.querySelector('.mode-tab.active')?.dataset.mode || 'guided';
  const count = activeMode === 'guided' ? state.guidedUnits.length : state.drafts.filter(d => d.confirmed).length;
  $('entryStats').textContent = `${count} confirmed unit${count === 1 ? '' : 's'} · ${state.entryEdits} recorded edit${state.entryEdits === 1 ? '' : 's'}`;
}

// ---------- save, export, and import paths ----------
$('submitPathBtn').addEventListener('click', () => {
  if (state.role === 'reviewer') { showError('A reviewer cannot save an analyst path.'); return; }
  if (!state.caseDef || !evidenceForCase().length) { showError('The participant evidence packet is not loaded.'); return; }
  const activeMode = document.querySelector('.mode-tab.active').dataset.mode;
  let units;
  if (activeMode === 'guided') units = state.guidedUnits;
  else units = finalizeDrafts(state.drafts.filter(d => d.confirmed), roleTag());

  const abandoned = units.filter(u => !u.text.trim()).length;
  const path = {
    id: `${state.caseId}-${state.role}`,
    case_id: state.caseId,
    analyst_id: state.role,
    question: state.caseDef.research_question,
    evidence: structuredClone(evidenceForCase()),
    units,
  };
  try {
    assertReasoningPath(path, state.role);
  } catch (err) {
    state.entryValidationErrors++;
    showError(err.message);
    logTiming(false, abandoned, activeMode);
    return;
  }
  state.paths[state.role] = path;
  state.pathSavedRole = state.role;
  state.decisions = [];
  state.matchLogs = [];
  state.result = null;
  logTiming(true, abandoned, activeMode);
  clearError();
  save();
  updateRoleUi();
  $('pathSavedBox').hidden = false;
  $('handoffDialog').showModal();
});

function logTiming(completion, abandoned, mode) {
  state.sessionTimings.push({
    analyst_id: state.role,
    case_id: state.caseId,
    mode: mode === 'prose' ? 'prose' : 'guided',
    total_ms: Date.now() - (state.entryStartedAt || Date.now()),
    edits: state.entryEdits,
    abandoned_fields: abandoned,
    validation_errors: state.entryValidationErrors,
    completion,
  });
  save();
}

function downloadCurrentPath() {
  const path = state.paths[state.role];
  if (!path) { showError('No saved path exists for the current analyst role.'); return; }
  download(`${state.caseId}-${state.role}-path.json`, JSON.stringify(path, null, 2), 'application/json');
}

$('downloadPathBtn').addEventListener('click', downloadCurrentPath);
$('handoffDownloadPathBtn').addEventListener('click', downloadCurrentPath);
$('closeHandoffBtn').addEventListener('click', () => {
  $('handoffDialog').close();
  showStep('setup');
});

$('importPathA').addEventListener('change', () => importPathFile($('importPathA').files[0], 'analyst_a'));
$('importPathB').addEventListener('change', () => importPathFile($('importPathB').files[0], 'analyst_b'));

async function importPathFile(file, expectedRole) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const path = parsed.path || parsed;
    assertReasoningPath(path, expectedRole);
    if (path.case_id !== state.caseId) throw new Error(`Expected case ${state.caseId}, received ${path.case_id}`);
    if (path.analyst_id !== expectedRole) throw new Error(`Expected ${expectedRole}, received ${path.analyst_id}`);
    if (path.question !== state.caseDef?.research_question) throw new Error('The imported question does not match the selected case.');
    if (!evidenceMatches(evidenceForCase(), path.evidence)) throw new Error('The imported path does not use the frozen participant evidence packet.');
    state.paths[expectedRole] = path;
    state.decisions = [];
    state.matchLogs = [];
    state.reviewerTimings = [];
    state.result = null;
    state.reviewStartedAt = null;
    save();
    clearError();
    renderPathImportStatus();
    renderMatchList();
  } catch (err) {
    showError(`Could not import ${expectedRole}: ${err.message}`);
  } finally {
    if (expectedRole === 'analyst_a') $('importPathA').value = '';
    else $('importPathB').value = '';
  }
}

function renderPathImportStatus() {
  const a = state.paths.analyst_a ? 'ready' : 'missing';
  const b = state.paths.analyst_b ? 'ready' : 'missing';
  $('pathImportStatus').innerHTML = `<strong>Frozen paths:</strong> Analyst A — ${a}; Analyst B — ${b}.`;
  $('downloadBaselineBtn').disabled = !(state.paths.analyst_a && state.paths.analyst_b);
}

$('downloadBaselineBtn').addEventListener('click', () => {
  const a = state.paths.analyst_a, b = state.paths.analyst_b;
  if (!a || !b) { showError('Both analyst paths are required.'); return; }
  const plain = path => path.units.map((unit, index) => `${index + 1}. ${unit.text}`).join('\n');
  const content = [
    `CASE: ${state.caseDef?.title || state.caseId}`,
    `QUESTION: ${state.caseDef?.research_question || ''}`,
    '',
    'ANALYST A — PLAIN PROSE-ONLY READOUT',
    plain(a),
    '',
    'ANALYST B — PLAIN PROSE-ONLY READOUT',
    plain(b),
    '',
    'Reviewer instruction: list the important differences without using structure, evidence links, confidence values, candidate matches, or the generated report.',
  ].join('\n');
  download(`${state.caseId}-baseline-prose.txt`, content, 'text/plain');
});

// ---------- reviewer matching ----------
const MODE_HINTS = {
  blind: 'Blind mode: no candidate suggestions are shown. Add every match manually.',
  suggested_hidden_score: 'Suggested mode: candidate pairs are shown, but the match score is hidden.',
  suggested_visible_score: 'Suggested mode: candidate pairs are shown with their lexical match score.',
};

function renderMatchList() {
  $('reviewModeHint').textContent = MODE_HINTS[state.reviewMode];
  const a = state.paths.analyst_a, b = state.paths.analyst_b;
  const box = $('matchList');
  if (!a || !b) {
    box.innerHTML = '<p class="hint">Both frozen analyst paths are required.</p>';
    return;
  }

  const suggestions = state.reviewMode === 'blind' ? [] : suggestCandidateMatches(a, b);
  box.innerHTML = suggestions.map(s => {
    const ua = a.units.find(u => u.id === s.a);
    const ub = b.units.find(u => u.id === s.b);
    const existing = state.decisions.find(d => d.a === s.a && d.b === s.b);
    const scoreLabel = state.reviewMode === 'suggested_visible_score' ? `${Math.round(s.score * 100)}%` : '?';
    return `<article class="match-card" data-a="${s.a}" data-b="${s.b}">
      <div class="match-grid">
        <div><span class="tag">A · ${esc(ua.type)}</span><p>${esc(ua.text)}</p></div>
        <div class="score">${scoreLabel}</div>
        <div><span class="tag">B · ${esc(ub.type)}</span><p>${esc(ub.text)}</p></div>
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
      const relationChecked = card.querySelector('[data-relation]').checked;
      const decision = btn.dataset.decision;
      const relation = decision === 'related' && relationChecked ? 'contradiction' : null;
      upsertDecision(aId, bId, decision, relation, 'suggested');
      replaceSuggestionLog({
        a: aId,
        b: bId,
        mode: state.reviewMode,
        outcome: suggestionOutcome(decision),
        time_to_match_ms: Date.now() - startedAt,
      });
      save();
      renderMatchList();
    }));
    card.querySelector('[data-relation]').addEventListener('change', event => {
      const existing = state.decisions.find(d => d.a === card.dataset.a && d.b === card.dataset.b);
      if (!existing || existing.decision !== 'related') return;
      upsertDecision(existing.a, existing.b, existing.decision, event.target.checked ? 'contradiction' : null, 'suggested');
      save();
      renderMatchList();
    });
  });

  ['manualA', 'manualB', 'manualDecision', 'manualContradiction'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('change', () => { if (!state.manualMatchStartedAt) state.manualMatchStartedAt = Date.now(); });
  });
}

function decisionLabel(d) {
  return { same_position: 'Same position', related: 'Related, distinct', unrelated: 'Unrelated' }[d];
}

function upsertDecision(a, b, decision, relation, match_source) {
  // Final decisions are one-to-one. A later manual correction replaces a prior rejected or
  // suggested pairing that used either unit; the interaction log remains preserved.
  state.decisions = state.decisions.filter(d => d.a !== a && d.b !== b);
  state.decisions.push({ a, b, decision, relation: relation || undefined, match_source });
}

function replaceSuggestionLog(log) {
  state.matchLogs = state.matchLogs.filter(existing => !(
    existing.a === log.a && existing.b === log.b && existing.mode === log.mode
  ));
  state.matchLogs.push(log);
}

function renderManualMatches(a, b) {
  const manual = state.decisions.filter(d => d.match_source === 'manual');
  return `<h3>Manual matches</h3>`
    + manual.map(m => `<p class="manual-row">${esc(m.a)} ↔ ${esc(m.b)} — ${decisionLabel(m.decision)}${m.relation ? ` (${esc(m.relation)})` : ''}</p>`).join('')
    + `<div class="manual-picker">
        <select id="manualA"><option value="">Unit from A…</option>${a.units.map(u => `<option value="${u.id}">${esc(u.id)} — ${esc(u.text.slice(0, 40))}</option>`).join('')}</select>
        <select id="manualB"><option value="">Unit from B…</option>${b.units.map(u => `<option value="${u.id}">${esc(u.id)} — ${esc(u.text.slice(0, 40))}</option>`).join('')}</select>
        <select id="manualDecision">${['same_position', 'related', 'unrelated'].map(d => `<option value="${d}">${decisionLabel(d)}</option>`).join('')}</select>
        <label class="chk"><input type="checkbox" id="manualContradiction"> contradiction</label>
      </div>`;
}

$('addManualMatchBtn').addEventListener('click', () => {
  const aSel = $('manualA'), bSel = $('manualB'), dSel = $('manualDecision'), cChk = $('manualContradiction');
  if (!aSel || !bSel || !aSel.value || !bSel.value) { showError('Pick a unit from A and a unit from B first.'); return; }
  const decision = dSel.value;
  upsertDecision(aSel.value, bSel.value, decision, decision === 'related' && cChk.checked ? 'contradiction' : null, 'manual');
  state.matchLogs.push({
    a: aSel.value,
    b: bSel.value,
    mode: state.reviewMode,
    outcome: 'manual',
    time_to_match_ms: Date.now() - (state.manualMatchStartedAt || Date.now()),
  });
  state.manualMatchStartedAt = null;
  clearError();
  save();
  renderMatchList();
});

$('runCompareBtn').addEventListener('click', () => {
  const a = state.paths.analyst_a, b = state.paths.analyst_b;
  if (!a || !b) { showError('Both paths are required before comparing.'); return; }
  if (state.caseId !== DEMO_CASE_ID && !(state.baselineTimeMs > 0)) {
    showError('The prose-only baseline must be completed and timed first.');
    return;
  }
  try {
    assertReviewerDecisions(state.decisions, a, b);
    state.result = compare(a, b, state.decisions);
  } catch (err) {
    showError(err.message);
    return;
  }
  if (state.caseId !== DEMO_CASE_ID) {
    state.reviewerTimings = state.reviewerTimings.filter(t => t.case_id !== state.caseId);
    state.reviewerTimings.push(
      { case_id: state.caseId, condition: 'baseline_prose', total_ms: state.baselineTimeMs },
      { case_id: state.caseId, condition: 'tool', total_ms: Date.now() - (state.reviewStartedAt || Date.now()) },
    );
  }
  clearError();
  save();
  showStep('results');
  renderResults();
});

// ---------- results and exports ----------
function renderResults() {
  const r = state.result;
  if (!r) { $('metrics').innerHTML = '<p class="hint">Run a comparison first.</p>'; return; }
  $('metrics').innerHTML = Object.entries(r.metrics).map(([k, v]) => {
    const display = v && typeof v === 'object' && 'value' in v ? (v.value == null ? 'n/a' : v.value) : v;
    return `<div class="metric"><strong>${esc(display)}</strong>${esc(k)}</div>`;
  }).join('');
  $('events').innerHTML = r.events.length ? r.events.map(e => `
    <article class="event">
      <span class="tag">${esc(e.kind.replaceAll('_', ' '))}</span>
      ${e.a ? `<p><b>A (${esc(e.a.id)}):</b> ${esc(e.a.text)}</p>` : ''}
      ${e.b ? `<p><b>B (${esc(e.b.id)}):</b> ${esc(e.b.text)}</p>` : ''}
      ${e.details?.reason ? `<p class="muted">${esc(e.details.reason)}</p>` : ''}
    </article>`).join('') : '<p class="hint">No divergence events.</p>';
  const tbody = document.querySelector('#evidenceTable tbody');
  tbody.innerHTML = r.evidence_usage.map(e => `<tr><td>${esc(e.id)}</td><td>${esc(e.status)}</td><td>${esc(e.a_units.join(', '))}</td><td>${esc(e.b_units.join(', '))}</td></tr>`).join('');
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

$('exportJsonBtn').addEventListener('click', () => state.result && download('report.json', JSON.stringify(state.result, null, 2), 'application/json'));
$('exportMdBtn').addEventListener('click', () => state.result && download('report.md', toMarkdown(state.result), 'text/markdown'));
$('exportCsvBtn').addEventListener('click', () => state.result && download('report.csv', toCsv(state.result), 'text/csv'));
$('exportSessionBtn').addEventListener('click', () => download('session-log.json', JSON.stringify(buildSessionLog(state), null, 2), 'application/json'));

$('resetSessionBtn').addEventListener('click', () => {
  if (!confirm('Delete every locally stored path, decision, timing record, and report in this browser? Export anything you need first.')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

function hasCaseWork() {
  return Boolean(
    Object.keys(state.paths || {}).length || state.decisions.length || state.matchLogs.length
    || state.sessionTimings.length || state.reviewerTimings.length || state.result
    || state.guidedUnits.length || state.drafts.length
  );
}

function renderAll() {
  renderCaseSummary();
  renderEvidencePackets();
  renderGuidedUnits();
  renderDraftUnits();
  renderPathImportStatus();
  renderMatchList();
  if (state.result) renderResults();
  updateRoleUi();
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
function showError(msg) { $('errorBox').textContent = msg; }
function clearError() { $('errorBox').textContent = ''; }

// ---------- init ----------
updateRoleUi();
loadCase().then(() => {
  renderAll();
  showStep('setup');
});
