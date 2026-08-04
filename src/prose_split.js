// prose_split.js — Entry Mode B assist: "Prose-first assisted structuring".
//
// This is a fixed, deterministic, keyword-based heuristic. It is NOT a model and has no
// hidden dependency on any AI service — the core workflow (Entry Mode A: guided structured
// entry) never touches this file. Every unit this function proposes is a DRAFT
// (confirmed:false) and cannot enter a comparison until the analyst explicitly edits/confirms
// it (see model.js: assertReasoningUnit requires confirmed === true).
'use strict';

const TYPE_CUES = [
  // Order matters: first matching cue wins. Keep cues narrow to avoid false precision.
  { type: 'unknown', re: /\b(unknown|unclear|not clear|don'?t know|no way to (tell|know)|cannot determine|can'?t determine)\b/i },
  { type: 'assumption', re: /\b(assum\w+|presum\w+|taking it as given|treat(ing)? .* as (true|given))\b/i },
  { type: 'claim', re: /\b(conclu\w+|root cause|the (primary|main) cause|was the cause|caused by|most likely caused|overall,? the)\b/i },
  { type: 'inference', re: /\b(therefore|thus|suggests?|indicates?|implies|likely|because|this means|points to)\b/i },
];

function splitSentences(text) {
  return String(text)
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function guessType(sentence) {
  for (const cue of TYPE_CUES) if (cue.re.test(sentence)) return cue.type;
  return 'observation'; // default: the least presumptive label
}

function guessEvidenceRefs(sentence, evidence) {
  // Only proposes a reference when an evidence id is explicitly typed in the sentence
  // (e.g. "E1", "E3") or when a long substring of the evidence text literally recurs.
  // Deliberately conservative: false negatives are safer than fabricated links.
  const refs = new Set();
  for (const e of evidence || []) {
    const idPattern = new RegExp(`\\b${e.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (idPattern.test(sentence)) refs.add(e.id);
  }
  return [...refs];
}

/**
 * Split raw analyst prose into DRAFT reasoning units.
 * @param {string} prose
 * @param {{id:string,text:string}[]} evidence
 * @returns {Array} draft units — every field is analyst-editable, confirmed is always false.
 */
export function splitProse(prose, evidence = []) {
  const sentences = splitSentences(prose);
  return sentences.map((text, i) => ({
    id: `draft-${i + 1}`,
    type: guessType(text),
    text,
    evidence_refs: guessEvidenceRefs(text, evidence),
    depends_on: i > 0 ? [`draft-${i}`] : [], // naive default: each sentence follows the last: analyst must edit real dependency structure
    confidence: null,
    source: 'prose_assisted',
    confirmed: false,
  }));
}

/** Renumbers/relinks a confirmed set of drafts into final unit ids scoped to an analyst prefix. */
export function finalizeDrafts(drafts, idPrefix) {
  const idMap = new Map(drafts.map((d, i) => [d.id, `${idPrefix}${i + 1}`]));
  return drafts.map(d => ({
    id: idMap.get(d.id),
    type: d.type,
    text: d.text,
    evidence_refs: d.evidence_refs || [],
    depends_on: (d.depends_on || []).map(x => idMap.get(x)).filter(Boolean),
    confidence: d.confidence,
    source: 'prose_assisted',
    confirmed: true,
  }));
}
