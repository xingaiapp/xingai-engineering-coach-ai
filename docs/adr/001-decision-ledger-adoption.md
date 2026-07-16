# ADR-001: Decision Ledger Adoption

**Date:** 2026-07-16
**Status:** Accepted
**Author:** Xing @ XingAI
**Also available:** [中文](001-decision-ledger-adoption.zh.md)

## Context

`xingai-invest-decision-engine`'s [ADR-016 (Cross-Product Decision Ledger)](https://github.com/xingaiapp/xingai-invest-decision-engine/blob/main/docs/adr/016-cross-product-decision-ledger.md)
defines a shared, thin `Decision` shape (`id, product, domain, question,
recommendation, reasoning, confidence, alternatives, risks, action_taken,
outcome, outcome_recorded_at, created_at, source_ref`) and an adoption order
for XingAI products: Meal AI → Invest AI → Opportunity Radar → Polymarket AI.

This product (`xingai-engineering-coach-ai`) was not in that original list —
it's a new product built after ADR-016 was accepted. Its own PRD originally
proposed a bespoke memory schema (`weak_areas`, `saved_phrases`,
`improvementScore` as independently-maintained tables). That would have been
the second time in one day a new XingAI product invented its own memory
shape instead of reusing the one already proven by `xingai-invest-decision-engine`
and `xingai-meal-coach-ai`.

## Decision

This product adopts the shared Decision Ledger shape as its **only** write
path for exercise review results. There is no separate `ExerciseReview`
table as a source of truth.

Field mapping:

| Product concept | Decision field |
|---|---|
| Daily exercise scenario + goal | `question` |
| Professional Polished Version | `recommendation` |
| Per-sentence "Why" explanations | `reasoning[]` |
| Reusable phrases | `alternatives[]` |
| Improvement areas flagged | `risks[]` |
| Accept / Edit / Reject | `action_taken` via `record_outcome` equivalent (`followed` / `modified` / `ignored`) |
| "Used in a real email" | `outcome` (free text) |
| `domain` | `"engineering-english-exercise/<category>"` |
| `source_ref` | the exercise id, to avoid double-counting |

`weak_areas` in `UserLearningProfile` is a **derived, read-time view**
(aggregated from recent `decisions.risks` — see `deriveWeakAreas()` in
`lib/decision-ledger.ts`), not a separately hand-maintained table. This
matches ADR-016's rule that normalization/aggregation is a read-time concern,
not a write-time schema addition.

Storage is in-memory per Next.js process (same as Meal AI v1) — acceptable
for local/demo use; swap for a real database-backed worker before durable
multi-session history is required.

## Consequences

Positive:
- No new memory schema invented; this product proves the shared shape
  generalizes to a fourth kind of recommendation (language coaching, not
  investing/meals/opportunities).
- A future unified cross-product "Decision History" page can read this
  product's `GET /api/decisions` endpoint the same way it would read Meal
  AI's or Invest AI's, once one exists.

Tradeoffs:
- The `Decision` shape is generic; some engineering-English-specific detail
  (full sentence-level diff) lives in the API response payload, not in the
  ledger row itself. That's intentional — the ledger row is the *thin*
  cross-product record, not the full product-specific detail.

## Related

- [xingai-invest-decision-engine: ADR-015 (Decision Ledger — local adoption)](https://github.com/xingaiapp/xingai-invest-decision-engine/blob/main/docs/adr/015-decision-ledger.md)
- [xingai-invest-decision-engine: ADR-016 (Cross-Product Decision Ledger)](https://github.com/xingaiapp/xingai-invest-decision-engine/blob/main/docs/adr/016-cross-product-decision-ledger.md)
- [xingai-engineering-system: patterns/decision-ledger-schema.md](https://github.com/xingaiapp/xingai-engineering-system/blob/main/patterns/decision-ledger-schema.md)
- `xingai-meal-coach-ai/meal_v4/app/api/decisions/route.ts` — the other TypeScript/Next.js adopter of this shape.
