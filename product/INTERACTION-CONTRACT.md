# Program finder interaction contract

The product answers: "What is worth applying for with my actual situation?" The current catalog contains only reviewed official-source claims. It does not promise an award or claim that every provider condition is encoded.

## Useful flow

1. Ask whether the visitor is building an open source project, a startup or both. Let them answer "unsure" without blocking browsing.
2. Ask only the facts relevant to the selected program. For Google's Start tier: age in months, working MVP, near-term venture funding plans and previous credits beyond the free trial.
3. Show which published conditions pass, fail or need an answer. Never convert a blank, a malformed value or "unsure" into a yes.
4. Show the provider source and its actual review date alongside the reason. Label the result "Needs review" even when the encoded conditions pass. The provider decides full eligibility.
5. Let the visitor compare useful coverage, exclusions, application effort and potential paid commitments. A CRM discount is different from inference credits. A closed program is different from rejection of one applicant.
6. Export a checklist containing the selected program, remaining facts, source link and review date. Save the visitor's checklist locally. Do not collect private contact details to answer eligibility questions.

## Engine contract

Import `assessFit` from `product/fit-engine.mjs`. Pass one source-reviewed program and a plain profile object.

Returned states:

- `not_listed`: no reviewed official evidence.
- `closed`: applications not open.
- `criteria_not_met`: at least one encoded published condition fails.
- `needs_review`: missing facts or remaining provider conditions require review.

There is deliberately no `approved`, `guaranteed` or `you_qualify` state.

The engine returns source, review date, missing facts and the next action. It makes no network calls and stores no profile data. Rules currently cover eight programs. Other reviewed programs return their listed conditions for manual review.

## Product measurement

Measure whether a visitor reaches a source-supported next step. Useful observed events are opening the source, resolving a missing fact, exporting a checklist and reporting a confirmed stale claim.

Do not call these real metrics until people actually use the feature. Do not infer startup revenue, application approval or provider spend from a button click.

## Website handoff

The owner is reviewing the website design. Keep the current styling and layout. The new data, fit engine and conservative text changes are prepared in this branch for integration. Do not restore hard-coded star thresholds, unsupported monetary equivalents or "no investor needed" as a default.
