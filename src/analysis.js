// analysis.js — study-level statistics for a completed pilot session.
//
// None of these numbers can be computed from the engine alone: they require a human reviewer
// to grade events (useful/misleading/wrong/missing) and require logged timing/questionnaire
// data. This module never returns a single composite score — see docs/SCORING_RUBRIC.md
// ("Do not create a single composite score that can hide failure").
'use strict';

export const EVENT_GRADES = new Set(['useful_nonobvious', 'useful_obvious', 'accurate_low_value', 'misleading', 'wrong']);

function na(reason, extra = {}) { return { value: null, note: reason, ...extra }; }
function ok(value, extra = {}) { return { value, note: null, ...extra }; }

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}
function mean(nums) { return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null; }

/**
 * gradedEvents: [{event_id, grade, importance?: 'important'|'minor'}]
 * excludeIds: Set of event ids excluded for a logged protocol deviation (documented, not silent).
 */
export function usefulPrecision(gradedEvents, excludeIds = new Set()) {
  const g = gradedEvents.filter(e => !excludeIds.has(e.event_id));
  if (!g.length) return na('no graded events (denominator is zero)', { numerator: 0, denominator: 0, excluded: excludeIds.size });
  const useful = g.filter(e => e.grade === 'useful_nonobvious' || e.grade === 'useful_obvious').length;
  return ok(Number((useful / g.length).toFixed(3)), { numerator: useful, denominator: g.length, excluded: excludeIds.size });
}

export function misleadingRate(gradedEvents, excludeIds = new Set()) {
  const g = gradedEvents.filter(e => !excludeIds.has(e.event_id));
  if (!g.length) return na('no graded events (denominator is zero)', { numerator: 0, denominator: 0, excluded: excludeIds.size });
  const bad = g.filter(e => e.grade === 'misleading' || e.grade === 'wrong').length;
  return ok(Number((bad / g.length).toFixed(3)), { numerator: bad, denominator: g.length, excluded: excludeIds.size });
}

/**
 * missingDivergences: [{case_id, importance:'important'|'minor'}] — divergences the reviewer
 * identified as real and important but the engine/report never surfaced.
 */
export function importantDivergenceRecall(gradedEvents, missingDivergences) {
  const foundImportant = gradedEvents.filter(e => e.grade === 'useful_nonobvious' && e.importance === 'important').length;
  const missedImportant = missingDivergences.filter(m => m.importance === 'important').length;
  const denom = foundImportant + missedImportant;
  if (!denom) return na('no important divergences identified by anyone in this case (denominator is zero) — not the same as perfect recall', { numerator: foundImportant, denominator: 0 });
  return ok(Number((foundImportant / denom).toFixed(3)), { numerator: foundImportant, denominator: denom, missed: missedImportant });
}

/** sessionTimings: [{analyst_id, case_id, mode, total_ms, completion:boolean}] */
export function entryBurdenMedianMinutes(sessionTimings) {
  const complete = sessionTimings.filter(t => t.completion);
  const excluded = sessionTimings.length - complete.length;
  if (!complete.length) return na('no completed entry sessions logged', { excluded });
  return ok(Number((median(complete.map(t => t.total_ms)) / 60000).toFixed(2)), { n: complete.length, excluded });
}

/** reviewerTimings: [{case_id, condition:'tool'|'baseline_prose', total_ms}] */
export function reviewerTimeDeltaMinutes(reviewerTimings) {
  const tool = reviewerTimings.filter(t => t.condition === 'tool').map(t => t.total_ms);
  const base = reviewerTimings.filter(t => t.condition === 'baseline_prose').map(t => t.total_ms);
  if (!tool.length || !base.length) return na('missing a condition — need both tool and baseline_prose timings', { n_tool: tool.length, n_baseline: base.length });
  const delta = (mean(tool) - mean(base)) / 60000;
  return ok(Number(delta.toFixed(2)), { n_tool: tool.length, n_baseline: base.length, interpretation: delta < 0 ? 'tool condition was faster' : 'tool condition was slower' });
}

/** matchLogs: [{mode, outcome:'accepted'|'rejected'}] for suggested-match modes only */
export function matcherAcceptanceRate(matchLogs) {
  const suggested = matchLogs.filter(m => m.outcome === 'accepted' || m.outcome === 'rejected');
  if (!suggested.length) return na('no suggested-match decisions logged (blind mode or empty log)');
  const accepted = suggested.filter(m => m.outcome === 'accepted').length;
  return ok(Number((accepted / suggested.length).toFixed(3)), { numerator: accepted, denominator: suggested.length });
}

/** decisions: reviewer decision records with match_source: 'suggested'|'manual' */
export function manualMatchRate(decisions) {
  if (!decisions.length) return na('no reviewer decisions logged');
  const manual = decisions.filter(d => d.match_source === 'manual').length;
  return ok(Number((manual / decisions.length).toFixed(3)), { numerator: manual, denominator: decisions.length });
}

/** questionnaires: [{participant_id, reuse_intent: 1..5}] */
export function reuseIntentMedian(questionnaires) {
  const vals = questionnaires.map(q => q.reuse_intent).filter(v => Number.isFinite(v));
  if (!vals.length) return na('no questionnaire responses logged');
  return ok(median(vals), { n: vals.length });
}

/**
 * Anchoring check across review modes. Returns per-mode aggregates, never a single
 * "anchoring score" — the reader must compare the groups themselves.
 * matchLogs: [{mode, outcome, time_to_match_ms}]
 */
export function anchoringComparison(matchLogs) {
  const modes = ['blind', 'suggested_hidden_score', 'suggested_visible_score'];
  const byMode = {};
  for (const m of modes) {
    const rows = matchLogs.filter(x => x.mode === m);
    byMode[m] = rows.length
      ? { n: rows.length, acceptance_rate: matcherAcceptanceRate(rows), median_time_to_match_ms: median(rows.map(r => r.time_to_match_ms).filter(Number.isFinite)) }
      : na('no logged decisions in this mode');
  }
  return byMode;
}
