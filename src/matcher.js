// matcher.js — produces CANDIDATE MATCHES, never decisions. A candidate match is a proposal
// the reviewer may accept, reject, or ignore in favor of a manual match. This module has no
// authority: src/engine.js only ever reads reviewer-confirmed decisions.
'use strict';

const STOP = new Set('a an and are as at be been but by for from has have in is it its of on or that the this to was were will with'.split(' '));

export function tokens(text) {
  return new Set(String(text).toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(x => x.length > 1 && !STOP.has(x)));
}

export function jaccard(a, b) {
  const A = tokens(a), B = tokens(b);
  if (!A.size && !B.size) return 1;
  let n = 0; for (const x of A) if (B.has(x)) n++;
  return n / (A.size + B.size - n || 1);
}

export function overlap(xs, ys) {
  const A = new Set(xs), B = new Set(ys);
  if (!A.size && !B.size) return 0;
  let n = 0; for (const x of A) if (B.has(x)) n++;
  return n / (A.size + B.size - n || 1);
}

// Weights and threshold are DECLARED, not derived from data. They exist only to shortlist
// candidates for human review — they never resolve a match by themselves.
export const MATCH_WEIGHTS = Object.freeze({ text: 0.55, evidence: 0.30, type: 0.15 });
export const DEFAULT_THRESHOLD = 0.18;

export function suggestCandidateMatches(pathA, pathB, { threshold = DEFAULT_THRESHOLD } = {}) {
  const suggestions = [];
  for (const a of pathA.units) {
    for (const b of pathB.units) {
      const text = jaccard(a.text, b.text);
      const evidence = overlap(a.evidence_refs || [], b.evidence_refs || []);
      const type = a.type === b.type ? 1 : 0;
      const score = Number((text * MATCH_WEIGHTS.text + evidence * MATCH_WEIGHTS.evidence + type * MATCH_WEIGHTS.type).toFixed(3));
      if (score >= threshold) {
        suggestions.push({
          a: a.id, b: b.id, score,
          reasons: { text: Number(text.toFixed(3)), evidence: Number(evidence.toFixed(3)), same_type: Boolean(type) },
        });
      }
    }
  }
  return suggestions.sort((x, y) => y.score - x.score || x.a.localeCompare(y.a) || x.b.localeCompare(y.b));
}
