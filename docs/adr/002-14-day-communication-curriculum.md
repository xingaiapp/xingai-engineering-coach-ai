# ADR-002: 14-Day Communication & Charisma Curriculum

**Date:** 2026-07-16  
**Status:** Accepted  
**Author:** Xing @ XingAI  
**Also available:** [中文](002-14-day-communication-curriculum.zh.md)

## Context

ADR-001 fixed the **memory** shape (Decision Ledger) for exercise reviews. It did not define **what** to practice each day.

Without a curriculum contract, the product drifts toward:

- random scenario rotation with no skill progression,
- grammar-only review (Grammarly clone),
- or LLM free-form “coaching” with no reusable structure.

The product brief for Engineering Communication & Charisma Coach requires a fixed 10–15 minute daily loop: skill → real engineering scenario → user writes first → structured review (levels, expressions, voice, one focus).

## Decision

1. **Curriculum owns skill sequencing.** `lib/curriculum.ts` defines days 1–14 (core) and advanced topics that cycle after day 14. `UserLearningProfile.curriculumDay` selects the day; Accept advances the day.

2. **Scenario bank maps 1:1 to curriculum days** (Azure / .NET / microservices-first templates in `lib/scenario-bank.ts`). Deterministic generation works with zero API keys; LLM path must still emit the same opening structure (skill ZH why, scenario, hints, closing prompt) — see `lib/prompts.ts`.

3. **Review contract is sections 4–10**, not grammar-only:
   - line-by-line table,
   - Level 1 Correct / Level 2 Natural / Level 3 Senior,
   - final professional version,
   - reusable expressions,
   - voice coaching,
   - micro practice,
   - progress with **one** focus area.

4. **Reviews still write only through the Decision Ledger** (ADR-001). Curriculum day is profile/session state, not a second memory schema.

## Consequences

Positive:

- Practice compounds across days instead of reshuffling the same PR comment forever.
- Offline and LLM paths share one shape — easier to test and localize (en/zh/ko UI; ZH skill explanations).

Tradeoffs:

- Fixed day templates can feel repetitive until advanced cycle / LLM freshness kicks in.
- Curriculum text is product content — changing day meanings is an ADR-worthy change, not a silent copy tweak.

## Follow-ups

- Tech blog: curriculum + ledger for communication coaching
- Enterprise design: skill-curriculum pattern for workplace AI
- Persist curriculum day server-side when storage graduates from in-memory/localStorage

## Links

- ADR-001: [Decision Ledger Adoption](001-decision-ledger-adoption.md)
- Code: `lib/curriculum.ts`, `lib/scenario-bank.ts`, `lib/prompts.ts`, `lib/review-engine.ts`
