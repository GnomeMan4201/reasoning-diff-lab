// model.js — core domain invariants.
// Renamed terms (see docs/LIMITATIONS.md #2 Terminology):
//   "equivalent unit"      -> reviewer decision "same_position"
//   "unsupported reasoning"-> event kind "undeclared_support_gap"
//   "inferred contradiction"-> "reviewer_confirmed_contradiction" (never inferred by the engine)
'use strict';

export const UNIT_TYPES = new Set(['observation', 'assumption', 'inference', 'claim', 'unknown']);
export const UNIT_SOURCES = new Set(['guided', 'prose_assisted']);
// Decision vocabulary intentionally avoids "equivalent" (implies verified sameness) and
// "identical" (implies textual match). "same_position" means: the reviewer judges both
// units assert the same substantive point, not that the engine proved it.
export const DECISIONS = new Set(['same_position', 'related', 'unrelated']);
export const RELATIONS = new Set(['contradiction']); // extend only with reviewer-observable, not inferred, relations
export const CONFIDENCE_LABELS = new Set(['low', 'medium', 'high']);
export const MATCH_SOURCES = new Set(['suggested', 'manual']);
export const REVIEW_MODES = new Set(['blind', 'suggested_hidden_score', 'suggested_visible_score']);

function pushIf(errors, cond, msg) { if (cond) errors.push(msg); }

export function assertEvidenceItem(e, label, errors) {
  if (!e || typeof e !== 'object') { errors.push(`${label} must be an object`); return; }
  pushIf(errors, !e.id, `${label}.id is required`);
  pushIf(errors, !e.text, `${label}.text is required`);
}

export function assertReasoningUnit(u, label, errors, evidenceIds) {
  if (!u || typeof u !== 'object') { errors.push(`${label} must be an object`); return; }
  pushIf(errors, !u.id, `${label}.id is required`);
  pushIf(errors, !u.text, `${label}.text is required`);
  pushIf(errors, !UNIT_TYPES.has(u.type), `${label}.type invalid: ${u.type}`);
  pushIf(errors, u.source != null && !UNIT_SOURCES.has(u.source), `${label}.source invalid: ${u.source}`);
  // Units drafted by the prose-assist splitter start unconfirmed and MUST be explicitly
  // confirmed by the analyst before they are eligible for comparison. This enforces the
  // "no hidden structuring" rule: the engine only ever compares analyst-confirmed structure.
  pushIf(errors, u.confirmed !== true, `${label}.confirmed must be true — unconfirmed draft units cannot be compared`);
  if (u.confidence != null) {
    pushIf(errors, !Number.isFinite(u.confidence) || u.confidence < 0 || u.confidence > 1,
      `${label}.confidence must be a number in [0,1]`);
  }
  for (const ref of u.evidence_refs || []) {
    pushIf(errors, !evidenceIds.has(ref), `${label}.evidence_refs references unknown evidence ${ref}`);
  }
}

export function assertReasoningPath(path, label = 'path') {
  const errors = [];
  if (!path || typeof path !== 'object') { throw new Error(`${label} must be an object`); }
  pushIf(errors, !path.id, `${label}.id is required`);
  pushIf(errors, !path.case_id, `${label}.case_id is required`);
  pushIf(errors, !path.analyst_id, `${label}.analyst_id is required`);
  pushIf(errors, !path.question, `${label}.question is required`);
  pushIf(errors, !Array.isArray(path.evidence), `${label}.evidence must be an array`);
  pushIf(errors, !Array.isArray(path.units), `${label}.units must be an array`);
  if (errors.length) throw new Error(errors.join('\n'));

  const evidenceIds = new Set();
  (path.evidence || []).forEach((e, i) => {
    assertEvidenceItem(e, `${label}.evidence[${i}]`, errors);
    if (e && e.id) {
      pushIf(errors, evidenceIds.has(e.id), `${label}: duplicate evidence id ${e.id}`);
      evidenceIds.add(e.id);
    }
  });

  const unitIds = new Set();
  (path.units || []).forEach((u, i) => {
    assertReasoningUnit(u, `${label}.units[${i}]`, errors, evidenceIds);
    if (u && u.id) {
      pushIf(errors, unitIds.has(u.id), `${label}: duplicate unit id ${u.id}`);
      unitIds.add(u.id);
    }
  });
  for (const u of path.units || []) {
    for (const dep of u.depends_on || []) {
      pushIf(errors, !unitIds.has(dep), `${label}.${u.id}: unknown dependency ${dep}`);
      pushIf(errors, dep === u.id, `${label}.${u.id}: a unit cannot depend on itself`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return true;
}

export function assertReviewerDecisions(decisions, pathA, pathB, label = 'decisions') {
  const errors = [];
  const aIds = new Set(pathA.units.map(u => u.id));
  const bIds = new Set(pathB.units.map(u => u.id));
  const seenA = new Set(), seenB = new Set();
  (decisions || []).forEach((m, i) => {
    const tag = `${label}[${i}]`;
    pushIf(errors, !aIds.has(m.a), `${tag}: unknown A unit ${m.a}`);
    pushIf(errors, !bIds.has(m.b), `${tag}: unknown B unit ${m.b}`);
    pushIf(errors, !DECISIONS.has(m.decision), `${tag}: invalid decision ${m.decision}`);
    pushIf(errors, m.relation != null && !RELATIONS.has(m.relation), `${tag}: invalid relation ${m.relation}`);
    pushIf(errors, m.relation === 'contradiction' && m.decision !== 'related',
      `${tag}: a contradiction must be declared on a 'related' decision, not inferred elsewhere`);
    pushIf(errors, m.confidence != null && !CONFIDENCE_LABELS.has(m.confidence), `${tag}: invalid confidence label ${m.confidence}`);
    pushIf(errors, m.match_source != null && !MATCH_SOURCES.has(m.match_source), `${tag}: invalid match_source ${m.match_source}`);
    if (aIds.has(m.a) || bIds.has(m.b)) {
      pushIf(errors, seenA.has(m.a) || seenB.has(m.b), `${tag}: decisions must be one-to-one; duplicate ${m.a}/${m.b}`);
    }
    seenA.add(m.a); seenB.add(m.b);
  });
  if (errors.length) throw new Error(errors.join('\n'));
  return true;
}
