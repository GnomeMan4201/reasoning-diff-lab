#!/usr/bin/env node
// Consumes a single "session file" — see docs/DATA_DICTIONARY.md#experiment_result for the
// exact shape — and prints every formula from src/analysis.js with numerator/denominator
// shown. Never prints a single composite pass/fail number.
import fs from 'node:fs';
import * as A from '../src/analysis.js';

const file = process.argv[2];
if (!file) { console.error('Usage: node cli/analyze.js session.json'); process.exit(1); }
const s = JSON.parse(fs.readFileSync(file, 'utf8'));
const excluded = new Set((s.protocol_deviations || []).filter(d => d.exclude_event_id).map(d => d.exclude_event_id));

const report = {
  useful_precision: A.usefulPrecision(s.graded_events || [], excluded),
  misleading_rate: A.misleadingRate(s.graded_events || [], excluded),
  important_divergence_recall: A.importantDivergenceRecall(s.graded_events || [], s.missing_divergences || []),
  entry_burden_median_minutes: A.entryBurdenMedianMinutes(s.session_timings || []),
  reviewer_time_delta_minutes: A.reviewerTimeDeltaMinutes(s.reviewer_timings || []),
  matcher_acceptance_rate: A.matcherAcceptanceRate(s.match_logs || []),
  manual_match_rate: A.manualMatchRate(s.reviewer_decisions_flat || []),
  reuse_intent_median: A.reuseIntentMedian(s.questionnaires || []),
  anchoring_by_mode: A.anchoringComparison(s.match_logs || []),
};

console.log(JSON.stringify(report, null, 2));
