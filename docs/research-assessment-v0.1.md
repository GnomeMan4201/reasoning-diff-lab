# Reasoning Diff Lab — Research Assessment, Prior Art, Failure Modes, and Pilot Protocol

**Version:** 0.1  
**Date:** 2026-08-04  
**Status:** Pre-pilot. No pilot results exist. All thresholds, architectural recommendations, and design choices marked below are proposals or untested assumptions, not findings.  
**Change log:** Initial version. To be updated after each pilot cycle.

---

## Claim labels used throughout

- **[ESTABLISHED PRIOR ART]** — supported by cited literature
- **[DESIGN DECISION]** — a deliberate choice in the current prototype, not empirically validated
- **[UNTESTED ASSUMPTION]** — plausible, but not yet verified by running the tool with real participants
- **[PROPOSED THRESHOLD]** — a suggested pilot success criterion; has no external derivation
- **[RESEARCH QUESTION]** — the pilot is intended to answer this; it is not answered here

---

## Executive judgment

Reasoning Diff Lab addresses a real and well-documented problem. **[ESTABLISHED PRIOR ART]** Intelligence-community analytic standards already require analysts to distinguish information from assumptions and judgments, evaluate source quality, explain uncertainty, consider alternatives, expose logical structure, and identify significant analytic disagreements (ODNI ICD 203, 2015; Heuer & Pherson, 2015). Structured-analytic-technique literature makes the same case: reasoning becomes more reviewable when externalized rather than left inside an analyst's mental model (Heuer & Pherson, 2015; Chang et al., 2018).

The idea is **not wholly unprecedented**. **[ESTABLISHED PRIOR ART]** Structured argumentation systems, analytic-provenance research, evidence-mapping tools, and collaborative intelligence platforms have pursued parts of the same objective for decades. SEAS, CISpaces, Compendium-style argument mapping, and KTGraph have all captured evidence-to-conclusion relationships, analytic history, competing hypotheses, and collaborative discussion. W3C PROV provides a general vocabulary for tracing entities, activities, agents, attribution, and derivation (Moreau & Missier, 2013).

What appears differentiated is the **specific combination** proposed here: **[DESIGN DECISION]**

- two independently authored reasoning paths over the same evidence;
- a reviewer-governed alignment between their reasoning units;
- contradiction treated as a separate human judgment rather than an inferred text relation;
- mechanically generated differences whose provenance includes the evidence, dependency chain, authors, and reviewer decisions;
- no attempt to merge the paths, rank investigators, or declare truth.

That is narrower than a general argument-mapping platform and more useful than a textual report comparison. The strongest technical description is a **reviewer-governed semantic diff over independently authored reasoning graphs**.

The principal research risk is not whether a graph can be compared — it plainly can. **[RESEARCH QUESTION]** The risk is whether investigators will capture reasoning at sufficient fidelity, consistently enough, and cheaply enough for the resulting comparison to reveal more value than the capture process consumes. A related RAND review reached a closely analogous conclusion: structured analytic techniques are promoted for rigor and transparency, but evidence about their actual benefits, opportunity costs, and unintended consequences remains limited and requires controlled evaluation (Artner, Bruce & Girven, 2016).

**Overall assessment:** The prototype is worth testing. Its conceptual foundation is credible, its proposed boundaries are unusually responsible, and the pilot asks the correct core question. The current three-case test should be treated as a formative feasibility study, not as evidence that the system improves investigative quality. **[PROPOSED THRESHOLD]** The project should proceed only if the pilot shows that it surfaces material, non-obvious disagreements with tolerable capture overhead and a very low rate of misleading implications.

---

## Research lineage and nearest prior art

**[ESTABLISHED PRIOR ART]** The intellectual foundation begins with structured analytic techniques. These techniques externalize assumptions, evidence relationships, alternative hypotheses, and uncertainty so that analysts and reviewers can inspect the reasoning rather than only its output. The CIA's structured-analysis primer describes their purpose as challenging judgments, identifying mental models, managing uncertainty, stimulating alternative explanations, and making analysis more systematic. ODNI's analytic standards go further by requiring analysts to distinguish underlying information from assumptions and judgments, explain uncertainty, consider plausible alternatives, and make the logical basis of judgments clear (ODNI ICD 203, 2015; Heuer & Pherson, 2015).

**[ESTABLISHED PRIOR ART]** Reasoning Diff Lab also belongs to the field of analytic provenance: the study of how an analyst moved from source material through interactions and interpretations to a conclusion. Provenance systems have been developed to support handoff, collaboration, auditability, reflection, and recovery of investigative context. KTGraph, for example, linked concepts, source material, comments, tags, and interaction history so that another analyst could reconstruct an investigation rather than receiving only its final output. Its evaluation found that incomplete externalizations often failed to communicate the investigative process, while richer provenance could improve awareness and handoff strategies (Gotz & Zhou, 2009).

The closest systems, compared:

| System or lineage | What it preserves | Primary comparison or review model | Difference from Reasoning Diff Lab |
|---|---|---|---|
| **SEAS** | Evidence, interpretations, structured arguments, conclusions, and reusable analytic templates | Analysts collaboratively populate and inspect a common structured argument | Focuses on building and aggregating an argument, not explicitly diffing two frozen, independently authored reasoning paths |
| **CISpaces** | Arguments, evidence provenance, hypotheses, conflicts, critical questions, and report history | Collaborative analysis with software-agent support and multiple views | Supports conflict and provenance, but does not center a reviewer-authored pairwise semantic alignment as the main artifact |
| **KTGraph / analytic-provenance tools** | Source use, concepts, notes, interactions, and investigative process history | Handoff and process reconstruction | Replays or communicates process but does not directly compare equivalent, overlapping, or divergent reasoning units |
| **Compendium / IBIS-style mapping** | Issues, positions, ideas, arguments, and decision rationale | Collaborative deliberation and organizational memory | Captures discussion structure; independent-path comparison and contradiction governance are not the central operation |
| **W3C PROV** | Entities, activities, agents, derivation, attribution, delegation, and provenance bundles | Generic provenance interchange and consistency constraints | Supplies infrastructure semantics, not an investigative ontology or a disagreement-review workflow |

**[ESTABLISHED PRIOR ART]** SEAS was explicitly designed to record and coordinate human reasoning through structured evidence-to-conclusion arguments, allowing analysts to associate evidence and interpretations with claims, debate their significance, and build conclusions using reusable templates (Stech & Elsaesser, 2004).

**[ESTABLISHED PRIOR ART]** CISpaces combined argumentation, provenance, crowdsourcing, and software agents. It supported multiple views, conflicting information, evidence and hypothesis audit trails, and report generation. An evaluation with professional analysts suggested value for training and analytic work, while also finding that formalization and integration with existing organisational formats presented adoption difficulties (Toniolo et al., 2015; Cerutti et al., 2023).

**[ESTABLISHED PRIOR ART]** W3C PROV separates provenance into entities, activities, and agents, then represents derivation, attribution, generation, use, association, and related relationships. It also defines constraints for validating provenance structures (Moreau & Missier, 2013). Reasoning Diff Lab does not need to expose PROV terminology in its interface, but PROV is a candidate for its interchange and archival layer. **[DESIGN DECISION]**

Based on this literature, the broad claim "nobody has structured or preserved reasoning before" is indefensible. The narrower claim is more credible: **existing systems have generally focused on constructing, collaborating on, replaying, or auditing an argument; Reasoning Diff Lab centers the controlled comparison of two independent reasoning artifacts and preserves the human alignment decisions that make that comparison possible.** That combination appears meaningfully differentiated, though this is not an exhaustive commercial-product, patentability, or prior-art determination.

---

## What is genuinely distinctive

**[DESIGN DECISION]** The most important design choice is treating alignment itself as a reviewed artifact.

A conventional textual diff assumes the units being compared are already identifiable. Human reasoning does not offer that convenience. Two analysts may express equivalent claims at different levels of abstraction, split one inference into several steps, combine several observations into one statement, omit intermediate reasoning, or use the same words for materially different propositions. The system cannot honestly diff the paths until someone decides what corresponds to what.

Reasoning Diff Lab makes that decision explicit and accountable:

| Dimension | Conventional source-code diff | Human-reasoning diff |
|---|---|---|
| Unit identity | Usually exact or position-based text | Semantic proposition with variable wording and granularity |
| Matching | Mostly mechanical | Interpretive and contestable |
| Change meaning | Addition, deletion, or textual modification | Different evidence use, interpretation, dependency, scope, confidence, or epistemic status |
| Contradiction | Sometimes detectable syntactically | Often depends on context, scope, time, definitions, and assumptions |
| Authority | Tool computes the alignment | Reviewer owns and signs the alignment |
| Objective | Reconstruct textual change | Make the relationship between reasoning paths inspectable |

**[DESIGN DECISION]** The separation between similarity and contradiction is also deliberate. Two statements can be closely related without contradicting each other, and statements can appear linguistically dissimilar while being logically incompatible. A reviewer must evaluate scope and context before declaring incompatibility. This is consistent with analytic standards that require alternatives and uncertainty to be exposed rather than prematurely collapsed (ODNI ICD 203, 2015; Heuer & Pherson, 2015). **[ESTABLISHED PRIOR ART]**

**[DESIGN DECISION]** The workflow preserves independence before comparison. **[ESTABLISHED PRIOR ART]** This is not a cosmetic choice. If analysts see one another's graphs, match suggestions, node vocabulary choices, or reviewer questions before freezing their initial paths, their paths cease to be independent samples of interpretation. Research on cognitive bias in forensic work has emphasized regulating the order and relevance of information exposure, including through Linear Sequential Unmasking and its expanded variants, which aim to reduce the influence of task-irrelevant or biasing context by controlling when information becomes available (Dror et al., 2015; Dror & Kukucka, 2021).

For that reason, a defensible comparison workflow should require both analysts to freeze a signed snapshot before either path, suggested matches, or reviewer comments become visible to the other. **[UNTESTED ASSUMPTION]** Whether the current `PILOT_RUNBOOK.md` procedure is sufficient to enforce this in practice, or whether it needs technical enforcement in the interface, is an open question.

---

## Data model and comparison semantics

**[DESIGN DECISION]** The current taxonomy — observation, assumption, inference, claim, and unknown — is a reasonable pilot vocabulary. **[UNTESTED ASSUMPTION]** Several boundaries are likely to become unstable in actual use. An "observation" may be either a raw evidence record or an analyst's interpretation of that record. A "claim" may be indistinguishable from an "inference" unless one is defined as a proposition and the other as the reasoning operation that supports it. A hypothesis may be treated as a tentative claim by one analyst and an unknown by another.

**[ESTABLISHED PRIOR ART]** Formal argumentation systems have repeatedly faced this usability tradeoff: more precise schemas can improve machine processing and review, but formalization can feel unnatural and require substantial user training. CISpaces research and work on natural-language interfaces for argumentation both identify this as a practical adoption problem (Toniolo et al., 2015; Cerutti et al., 2023).

**[DESIGN DECISION]** The minimum useful edge vocabulary should distinguish at least: *cites*, where a node points to an evidence artifact; *supports*, where a proposition increases support for another; *attacks*, where it weakens or conflicts with another; *derived-from*, where an inference depends on prior nodes; *qualifies*, where a node narrows scope or introduces a condition; and *answers*, where a claim addresses an explicit question or unknown. The current `depends_on` field handles derived-from only, collapsing the others. **[UNTESTED ASSUMPTION]** Whether that is sufficient for the pilot cases as designed, or creates ambiguity reviewers need to resolve manually, is unknown.

**[DESIGN DECISION]** Confidence is currently a single float in [0,1]. **[ESTABLISHED PRIOR ART]** ODNI standards distinguish probability or likelihood judgments from confidence in the underlying analytic basis and require uncertainty to be explained. A source's credibility is not the same thing as the analyst's confidence in a conclusion (ODNI ICD 203, 2015). **[UNTESTED ASSUMPTION]** A single percentage may create false precision. Verbal bands (low, moderate, high) may be more defensible for the pilot; a shift in confidence value should be versioned as a belief revision associated with new evidence, not merely overwrite the old value.

**[DESIGN DECISION]** The pairwise alignment vocabulary (`same_position`, `related`, `unrelated`) may be too coarse. A more informative model would distinguish at minimum: equivalent (same material proposition despite wording differences), compatible overlap, refinement (one proposition is narrower than the other), alternative explanation (competing accounts of the same evidence), and unrelated. **[UNTESTED ASSUMPTION]** Whether reviewers need that vocabulary or find it over-specified is an empirical question the pilot can answer partially.

---

## Failure modes and constraints

**Post-hoc rationalization is the deepest validity problem.** **[UNTESTED ASSUMPTION]** A structured graph may capture the reasoning an analyst is prepared to defend, not the reasoning that actually occurred. Investigators often discover a conclusion through intuition or exploratory work and later construct a cleaner evidentiary path. The resulting graph can still be useful as an explicit justification, but the system should not call it a complete cognitive history unless capture occurred contemporaneously. The current implementation does not distinguish contemporaneous from retrospective entries — that is a known gap. **[DESIGN DECISION — DEFERRED]**

**Reasoning capture changes reasoning.** **[ESTABLISHED PRIOR ART]** Requiring analysts to type, classify, link, and score every step may encourage reflection, but it can also interrupt exploratory work, privilege what is easy to formalize, and discourage weak or speculative ideas. Research on analytic provenance has found that richer interaction-history representations can consume additional time and, in some conditions, reduce confidence or relevant information gathering (Gotz & Zhou, 2009). RAND similarly warns that the opportunity costs and negative consequences of structured techniques are insufficiently understood (Artner, Bruce & Girven, 2016; Chang et al., 2018). **[RESEARCH QUESTION]** Whether entry burden stays below tolerable limits is the pilot's most important measurement.

**Granularity can manufacture disagreement.** **[UNTESTED ASSUMPTION]** One analyst may produce twenty atomic nodes while another writes five broad propositions. The denser graph will appear to contain more assumptions, more undeclared-support gaps, and more unique evidence simply because it was decomposed differently. The reviewer must be allowed to align one-to-many and many-to-many node groups. **[DESIGN DECISION — DEFERRED]** The current prototype enforces one-to-one matching only. This is a known limitation for the pilot.

**Reviewer decisions introduce a new authority layer.** **[UNTESTED ASSUMPTION]** The reviewer determines which propositions correspond and whether a contradiction exists. A reviewer who aligns aggressively may suppress meaningful differences; a conservative reviewer may inflate uniqueness. **[RESEARCH QUESTION]** Measuring inter-reviewer agreement on a subset of cases is needed to quantify how much reviewer-specific variation contributes to the reported divergences.

**Numeric confidence can become theater.** **[UNTESTED ASSUMPTION]** Analysts may use different internal meanings for "70%," and precise numbers can create the appearance of calibration without evidence. **[ESTABLISHED PRIOR ART]** ODNI's standards require uncertainty and confidence to be communicated clearly but do not treat confidence as interchangeable with likelihood (ODNI ICD 203, 2015). Confidence divergence should therefore be interpreted as an invitation to ask why, not as evidence that one analyst is better calibrated.

**Independence can be contaminated.** **[DESIGN DECISION]** Analysts should not see one another's graphs, match suggestions, node vocabulary choices, or reviewer questions before freezing their initial paths. **[ESTABLISHED PRIOR ART]** Bias-reduction research in forensic science emphasizes controlling exposure to potentially influential contextual information (Dror et al., 2015; Dror & Kukucka, 2021). The current prototype relies on procedural separation in `PILOT_RUNBOOK.md` rather than technical enforcement — a known gap for any session where both analysts are on the same machine.

**Sensitive reasoning records create security and governance risks.** **[DESIGN DECISION]** Local-first architecture is used precisely because a reasoning graph may expose investigative hypotheses, weaknesses in a case, identities of sources, unverified allegations, or internal uncertainty that would never appear in a final report. "Local-first" alone is not a security model. A production version would need encryption at rest, role-scoped access, tamper-evident audit logs, configurable retention, and secure deletion semantics. **[DESIGN DECISION — DEFERRED]** None of that is built for the pilot.

---

## Pilot protocol

**[UNTESTED ASSUMPTION]** The proposed two-analyst, one-reviewer, three-case test is appropriate as a formative feasibility study. It can reveal whether the interface is usable, whether the taxonomy makes sense, where analysts resist structured capture, and whether the output occasionally surfaces something valuable. It cannot support strong claims about review speed, error reduction, reliability, or general applicability, because each condition would effectively have a single observation.

**Feasibility round.** The three shipped cases cover:

- a straightforward incident with a relatively clear evidentiary answer (case-01);
- an ambiguous question where multiple explanations can reasonably survive (case-02);
- a noisy and incomplete case containing distracting, missing, or conflicting evidence (case-03).

Both analysts complete each case independently using the structured tool. Paths are frozen before review. The reviewer completes mappings, records contradiction decisions, and rates every generated finding for usefulness, non-obviousness, and misleadingness.

**[DESIGN DECISION — DEFERRED]** The baseline condition (prose-only comparison) should ideally use different but difficulty-matched cases, or different reviewers, to avoid carryover. **[ESTABLISHED PRIOR ART]** Having the same reviewer inspect the same case first in prose and then in structured form creates a serious carryover problem — the reviewer has already learned the disagreements during the first condition. Crossover-trial methodology treats order and carryover as central design concerns and recommends counterbalancing or otherwise separating conditions (Senn, 2002; Jones & Kenward, 2014). **[UNTESTED ASSUMPTION]** For the three-case pilot, alternating which condition comes first per case is a partial mitigation. The pilot facilitator should log condition order explicitly.

**The feasibility round should collect** screen recordings or interaction logs, timestamps, abandoned nodes, revised classifications, and brief post-task interviews. **[RESEARCH QUESTION]** The question is not yet "does the tool work?" but: can participants express their reasoning in the model, can a reviewer perform alignment without excessive confusion, and do the resulting findings justify a larger test?

**Evaluation round (if pilot clears continue criteria).** **[PROPOSED THRESHOLD — UNTESTED]** A pragmatic next study could use four to six analyst pairs and two or three reviewers. A formal power calculation should follow the feasibility round rather than using an arbitrary sample size.

---

## Primary metrics, exact formulas, and zero-denominator handling

All formulas are implemented in `src/analysis.js` and unit-tested in `tests/analysis.test.js`. Every ratio-type metric returns `{value, numerator, denominator, note}` with `value: null` on a zero denominator — never a silent 0 or 1.

**Useful-difference precision:** `(useful_nonobvious + useful_obvious)` graded events ÷ all graded events, after excluding events logged as protocol-deviation exclusions. **[PROPOSED THRESHOLD]** ≥ 0.70 to continue.

**Misleading-event rate:** `(misleading + wrong)` graded events ÷ all graded events. **[PROPOSED THRESHOLD]** ≤ 0.10 to continue.

**Important-divergence recall:** `useful_nonobvious` events marked `importance: important` ÷ (that count + `missing_divergences` marked `importance: important`). Zero denominator explicitly reported as "no important divergences identified by anyone" — not as perfect recall.

**Entry burden:** Median `total_ms` across completed analyst sessions, in minutes. Incomplete sessions excluded and exclusion count reported. **[PROPOSED THRESHOLD]** ≤ 15 minutes for the straightforward case.

**Reviewer time delta:** Mean `total_ms` in tool condition minus mean `total_ms` in baseline-prose condition, in minutes. Missing a condition returns `null`, not zero.

**Matcher acceptance rate:** `accepted` ÷ (`accepted` + `rejected`) among suggested-match decisions. Manual-only logs (blind mode) excluded from denominator.

**Reuse intent:** Median self-reported 1–5 score across all participants who answered.

**Anchoring comparison:** Per-mode aggregates (`blind`, `suggested_hidden_score`, `suggested_visible_score`) — no composite score. See `src/analysis.js:anchoringComparison`.

For workload and usability measures in a larger evaluation round: **[ESTABLISHED PRIOR ART]** NASA Task Load Index covers mental demand, physical demand, temporal demand, performance, effort, and frustration (Hart & Staveland, 1988). The System Usability Scale is a ten-item instrument for global usability measurement (Brooke, 1996).

---

## Continue / pivot / stop criteria

**[PROPOSED THRESHOLDS — no external derivation; proposed for this specific pilot only]**

Continue only if all of the following hold:

- Useful precision ≥ 0.70 across the three cases (case-02 reported separately — no designed correct answer).
- Misleading-event rate ≤ 0.10 with no high-severity false implications.
- At least one `useful_nonobvious` event in at least two of the three cases.
- Median entry burden ≤ 15 minutes for case-01.
- Reviewer time delta is negative (tool faster), or important-divergence recall with the tool is higher than what the reviewer found unassisted. Tool must win on at least one of these.
- At least two of three participants report reuse intent ≥ 4.
- Matcher acceptance rate in `suggested_visible_score` does not diverge sharply from `blind` in a way that coincides with a higher misleading rate.

Pivot if burden is high specifically in one entry mode, or if acceptance rate is higher in `suggested_visible_score` with a corresponding rise in misleading/wrong grades.

Stop if: useful precision below 0.50; reviewer time exceeds baseline in every case; analysts cannot reliably distinguish unit types even after training; most reported value comes from re-reading raw prose; important divergences appear repeatedly in `missing_divergences`, not in the report; all participants report reuse intent of 1 or 2.

---

## Null-result interpretation

A null result is informative and must be reported as such. Distinguished outcomes:

- **Clean null:** both usefulness and recall are low; burden is acceptable; reuse intent is low. Interpretation: the comparison method likely does not add value over prose review for this task type.
- **Burden-confounded null:** usefulness is inconclusive because burden was so high that analysts visibly disengaged. Interpretation: hypothesis untested, not refuted. Pivot to lower-burden entry design.
- **Anchoring-confounded null:** reviewers rubber-stamped suggested matches at a much higher rate in `suggested_visible_score` mode, and misleading rate rose accordingly. Interpretation: hypothesis may still hold; pivot default review mode to blind or hidden-score.
- **Small-n noise:** any one case producing an outlier result is not evidence for or against the hypothesis at n=1 case per condition. Report as a data point.

---

## Reference list

Artner, N. L., Bruce, J. B., & Girven, R. S. (2016). *Assessing the value of structured analytic techniques in the U.S. Intelligence Community*. RAND Corporation. https://www.rand.org/pubs/research_reports/RR1408.html

Brooke, J. (1996). SUS: A "quick and dirty" usability scale. In P. W. Jordan, B. Thomas, B. A. Weerdmeester, & A. L. McClelland (Eds.), *Usability Evaluation in Industry* (pp. 189–194). Taylor and Francis.

Cerutti, F., Toniolo, A., Norman, T. J., & others. (2023). Human-machine collaboration in intelligence analysis: An expert evaluation. *Intelligent Systems with Applications*, 17, 200151. https://doi.org/10.1016/j.iswa.2022.200151

Chang, W., Berdini, E., Mandel, D., & Tetlock, P. (2018). Restructuring structured analytic techniques in intelligence. *Intelligence and National Security*, 33(3), 337–356. https://doi.org/10.1080/02684527.2017.1400230

Dror, I. E., Thompson, W. C., Meissner, C. A., Kornfield, I., Krane, D., Saks, M., & Risinger, M. (2015). Context management toolbox: A Linear Sequential Unmasking (LSU) approach for minimizing cognitive bias in forensic decision making. *Journal of Forensic Sciences*, 60(4), 1111–1112. https://doi.org/10.1111/1556-4029.12805

Dror, I. E., & Kukucka, J. (2021). Linear Sequential Unmasking–Expanded (LSU-E): A general approach for improving decision making as well as minimizing noise and bias. *Forensic Science International: Synergy*, 3, 100161. https://doi.org/10.1016/j.fsisyn.2021.100161

Gotz, D., & Zhou, M. X. (2009). Characterizing users' visual analytic activity for insight provenance. *Information Visualization*, 8(1), 42–55. https://doi.org/10.1057/ivs.2008.31

Hart, S. G., & Staveland, L. E. (1988). Development of NASA-TLX (Task Load Index): Results of empirical and theoretical research. *Advances in Psychology*, 52, 139–183. https://doi.org/10.1016/S0166-4115(08)62386-9

Heuer, R. J., & Pherson, R. H. (2015). *Structured Analytic Techniques for Intelligence Analysis* (3rd ed.). CQ Press / SAGE.

Jones, B., & Kenward, M. G. (2014). *Design and Analysis of Cross-Over Trials* (3rd ed.). CRC Press.

Moreau, L., & Missier, P. (Eds.). (2013). PROV-DM: The PROV data model. W3C Recommendation, 30 April 2013. https://www.w3.org/TR/prov-dm/

Office of the Director of National Intelligence. (2015). *Intelligence Community Directive 203: Analytic Standards*. ODNI. https://www.dni.gov/files/documents/ICD/ICD%20203%20Analytic%20Standards.pdf

Senn, S. (2002). *Cross-over Trials in Clinical Research* (2nd ed.). Wiley.

Stech, F., & Elsaesser, C. (2004). *Midway: Modeling influence diffusion, wheels, and actors for inference*. MITRE Corporation. *(Note: SEAS and related structured evidential argumentation system work; cite the specific SEAS publication available for your context.)*

Toniolo, A., Norman, T. J., Etuk, A., Cerutti, F., Ouyang, R. W., Srivastava, M., Oren, N., Liao, T., Kalfoglou, Y., & Julier, S. (2015). Supporting reasoning with different types of evidence in intelligence analysis. In *Proceedings of the 14th International Conference on Autonomous Agents and Multiagent Systems (AAMAS 2015)* (pp. 781–789).

---

## Known gaps not addressed by this document

- No GitOfThoughts citation verified — described in the assessment document as "a recent parallel in version-controlled reasoning for software agents" but a reliable citation was not confirmed before this version was finalized. Add when identified.
- Compendium/IBIS: the original IBIS method is from Rittel & Webber (1973); Conklin's Compendium work is the primary implementation. Full citation to be added.
- KTGraph: Gotz & Zhou (2009) is cited for analytic provenance; the specific KTGraph system evaluation citation should be confirmed against the original paper.
- The SEAS citation above is a placeholder — the specific Stech/Elsaesser paper varies across versions of the assessment document. Confirm before external publication.
