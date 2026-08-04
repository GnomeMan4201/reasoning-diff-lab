// engine.js — deterministic, rule-based comparison of two REVIEWER-DECIDED reasoning paths.
//
// Hard constraints (do not relax these without a version bump — see ENGINE_VERSION):
//   - Never infers truth or analyst quality.
//   - Never infers contradiction from wording; only from an explicit reviewer relation.
//   - Never labels a claim "unsupported" — only "undeclared_support_gap" (a syntactic fact:
//     no evidence_refs and no depends_on were declared, nothing more).
//   - Every event carries full provenance back to case, analysts, units, evidence, and the
//     exact reviewer decision (or absence of one) that produced it.
'use strict';

import { assertReasoningPath, assertReviewerDecisions } from './model.js';

export const ENGINE_VERSION = '2.0.0';

export function compare(pathA, pathB, decisions = []) {
  assertReasoningPath(pathA, 'pathA');
  assertReasoningPath(pathB, 'pathB');
  assertReviewerDecisions(decisions, pathA, pathB, 'decisions');
  if (pathA.question.trim() !== pathB.question.trim()) {
    throw new Error('Paths must answer the same exact question');
  }

  const mapA = new Map(pathA.units.map(u => [u.id, u]));
  const mapB = new Map(pathB.units.map(u => [u.id, u]));
  const matchedA = new Set(), matchedB = new Set();
  const events = [];
  const prov = {
    case_id: pathA.case_id, path_a: pathA.id, path_b: pathB.id,
    analyst_a: pathA.analyst_id, analyst_b: pathB.analyst_id,
  };

  for (const d of decisions) {
    const a = mapA.get(d.a), b = mapB.get(d.b);
    matchedA.add(a.id); matchedB.add(b.id);
    if (d.decision === 'unrelated') continue;

    const sharedEvidenceDirect = intersect(a.evidence_refs || [], b.evidence_refs || []);
    const confidenceDelta = (a.confidence == null || b.confidence == null)
      ? null : Number(Math.abs(a.confidence - b.confidence).toFixed(3));
    const effA = transitiveEvidence(a, mapA), effB = transitiveEvidence(b, mapB);
    const depRoleA = depRoles(a, mapA), depRoleB = depRoles(b, mapB);
    const decisionRef = { a: a.id, b: b.id, decision: d.decision, relation: d.relation || null, note: d.note || null };

    if (d.decision === 'same_position') {
      if (confidenceDelta != null && confidenceDelta >= 0.2) {
        events.push(mkEvent('confidence_divergence', a, b, prov, decisionRef,
          { confidence_delta: confidenceDelta, shared_evidence: sharedEvidenceDirect }));
      }
      if (a.type === 'claim' && b.type === 'claim' && !setsEqual(effA, effB)) {
        events.push(mkEvent('convergent_conclusion_different_path', a, b, prov, decisionRef, {
          reason: 'Reviewer judged both units assert the same position, but the declared evidence/dependency chains behind them differ.',
          evidence_only_in_a: [...effA].filter(x => !effB.has(x)).sort(),
          evidence_only_in_b: [...effB].filter(x => !effA.has(x)).sort(),
        }));
      }
      continue;
    }

    // decision === 'related'
    if (d.relation === 'contradiction') {
      events.push(mkEvent('reviewer_confirmed_contradiction', a, b, prov, decisionRef, { shared_evidence: sharedEvidenceDirect }));
    } else if (a.type !== b.type) {
      events.push(mkEvent('declared_role_divergence', a, b, prov, decisionRef, { type_a: a.type, type_b: b.type }));
    } else if (!sharedEvidenceDirect.length && ((a.evidence_refs || []).length || (b.evidence_refs || []).length)) {
      events.push(mkEvent('divergent_evidence_basis', a, b, prov, decisionRef, { evidence_a: a.evidence_refs || [], evidence_b: b.evidence_refs || [] }));
    } else {
      events.push(mkEvent('divergent_interpretation', a, b, prov, decisionRef, { confidence_delta: confidenceDelta, shared_evidence: sharedEvidenceDirect }));
    }

    if (!setsEqual(depRoleA, depRoleB)) {
      events.push(mkEvent('dependency_divergence', a, b, prov, decisionRef, {
        declared_dependency_roles_a: [...depRoleA].sort(), declared_dependency_roles_b: [...depRoleB].sort(),
      }));
    }
    if (a.type === 'claim' && b.type === 'claim') {
      const sharedTransitive = [...effA].filter(x => effB.has(x)).sort();
      if (sharedTransitive.length) {
        events.push(mkEvent('divergent_conclusion_shared_evidence', a, b, prov, decisionRef, {
          reason: 'Reviewer judged these are distinct conclusions, but their declared evidence chains overlap.',
          shared_transitive_evidence: sharedTransitive,
        }));
      }
    }
  }

  for (const a of pathA.units) if (!matchedA.has(a.id)) {
    events.push(mkEvent('unmatched_unit', a, null, prov, null, { side: 'a', evidence_refs: a.evidence_refs || [] }));
  }
  for (const b of pathB.units) if (!matchedB.has(b.id)) {
    events.push(mkEvent('unmatched_unit', null, b, prov, null, { side: 'b', evidence_refs: b.evidence_refs || [] }));
  }

  for (const u of pathA.units) { const g = undeclaredSupportGap(u, prov, 'a'); if (g) events.push(g); }
  for (const u of pathB.units) { const g = undeclaredSupportGap(u, prov, 'b'); if (g) events.push(g); }

  const evidenceUsage = compareEvidenceUsage(pathA, pathB);
  for (const row of evidenceUsage) {
    if (row.status === 'only_a' || row.status === 'only_b') {
      events.push({
        id: `evidence_used_one_side_only:${row.id}`, kind: 'evidence_used_one_side_only',
        schema_version: '2.0', engine_rule: 'evidence_used_one_side_only', engine_version: ENGINE_VERSION,
        provenance: prov, a: null, b: null,
        details: { evidence_id: row.id, evidence_text: row.text, used_only_in: row.status === 'only_a' ? 'a' : 'b', units: row.status === 'only_a' ? row.a_units : row.b_units },
      });
    }
  }

  const deduped = dedupe(events);
  return {
    schema_version: '2.0',
    engine_version: ENGINE_VERSION,
    case_id: pathA.case_id,
    question: pathA.question,
    path_a: pathA.id, path_b: pathB.id,
    analyst_a: pathA.analyst_id, analyst_b: pathB.analyst_id,
    events: deduped,
    evidence_usage: evidenceUsage,
    metrics: metrics(pathA, pathB, decisions, deduped, evidenceUsage),
  };
}

function mkEvent(kind, a, b, prov, decisionRef, details = {}) {
  return {
    id: `${kind}:${a?.id || '-'}:${b?.id || '-'}`,
    kind,
    schema_version: '2.0',
    engine_rule: kind,
    engine_version: ENGINE_VERSION,
    provenance: prov,
    reviewer_decision: decisionRef,
    a: a ? pick(a) : null,
    b: b ? pick(b) : null,
    details,
  };
}

function pick(u) {
  return { id: u.id, type: u.type, text: u.text, confidence: u.confidence ?? null, evidence_refs: u.evidence_refs || [], depends_on: u.depends_on || [] };
}

function undeclaredSupportGap(u, prov, side) {
  if (!['inference', 'claim'].includes(u.type)) return null;
  if ((u.depends_on || []).length || (u.evidence_refs || []).length) return null;
  return {
    id: `undeclared_support_gap:${side}:${u.id}`, kind: 'undeclared_support_gap',
    schema_version: '2.0', engine_rule: 'undeclared_support_gap', engine_version: ENGINE_VERSION,
    provenance: prov, reviewer_decision: null,
    a: side === 'a' ? pick(u) : null, b: side === 'b' ? pick(u) : null,
    details: { side, reason: 'This inference or claim declares no evidence reference and no dependency. This is a syntactic observation about what was declared, not a judgment that the reasoning is wrong or unsupported in reality.' },
  };
}

// Collects a unit's own evidence plus all evidence declared by its transitive depends_on
// ancestors, guarding against cycles (cycles are otherwise not excluded by model.js).
function transitiveEvidence(unit, map, seen = new Set()) {
  if (seen.has(unit.id)) return new Set();
  seen.add(unit.id);
  const out = new Set(unit.evidence_refs || []);
  for (const dep of unit.depends_on || []) {
    const parent = map.get(dep);
    if (!parent) continue;
    for (const e of transitiveEvidence(parent, map, seen)) out.add(e);
  }
  return out;
}

function depRoles(unit, map) {
  return new Set((unit.depends_on || []).map(id => map.get(id)?.type).filter(Boolean));
}

function compareEvidenceUsage(a, b) {
  const use = p => {
    const m = new Map();
    for (const e of p.evidence) m.set(e.id, { id: e.id, text: e.text, units: [] });
    for (const u of p.units) for (const r of u.evidence_refs || []) {
      if (!m.has(r)) m.set(r, { id: r, text: '', units: [] });
      m.get(r).units.push(u.id);
    }
    return m;
  };
  const A = use(a), B = use(b);
  const ids = [...new Set([...A.keys(), ...B.keys()])].sort();
  return ids.map(id => ({
    id, text: A.get(id)?.text || B.get(id)?.text || '',
    a_units: A.get(id)?.units || [], b_units: B.get(id)?.units || [],
    status: A.get(id)?.units.length && B.get(id)?.units.length ? 'both'
      : A.get(id)?.units.length ? 'only_a'
      : B.get(id)?.units.length ? 'only_b' : 'unused',
  }));
}

function metrics(a, b, decisions, events, evidence) {
  const reviewed = decisions.length;
  const samePosition = decisions.filter(x => x.decision === 'same_position').length;
  const related = decisions.filter(x => x.decision === 'related').length;
  const structural = events.filter(e => e.kind === 'undeclared_support_gap').length;
  return {
    units_a: a.units.length, units_b: b.units.length,
    reviewed_pairs: reviewed, same_position_pairs: samePosition, related_pairs: related,
    unmatched_a: events.filter(e => e.kind === 'unmatched_unit' && e.details.side === 'a').length,
    unmatched_b: events.filter(e => e.kind === 'unmatched_unit' && e.details.side === 'b').length,
    divergence_events: events.length - structural,
    undeclared_support_gaps: structural,
    evidence_overlap_ratio: ratio(
      evidence.filter(e => e.status === 'both').length,
      evidence.filter(e => e.status !== 'unused').length,
      'no evidence referenced by either analyst'),
    review_coverage_ratio: ratio(reviewed, Math.max(a.units.length, b.units.length, 1), 'no units to review'),
  };
}

// Explicit zero-denominator handling: never silently returns 0 or 1 for an undefined ratio.
function ratio(numerator, denominator, zeroNote) {
  if (!denominator) return { value: null, numerator, denominator, note: zeroNote };
  return { value: Number((numerator / denominator).toFixed(3)), numerator, denominator, note: null };
}

function intersect(a, b) { const B = new Set(b); return [...new Set(a)].filter(x => B.has(x)).sort(); }
function setsEqual(a, b) { if (a.size !== b.size) return false; for (const x of a) if (!b.has(x)) return false; return true; }
function dedupe(xs) { return [...new Map(xs.map(x => [x.id, x])).values()].sort((x, y) => x.id.localeCompare(y.id)); }
