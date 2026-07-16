# XingAI Engineering English Coach

**Version:** 0.1.0 (scaffold)  
**Repo:** [xingaiapp/xingai-engineering-coach-ai](https://github.com/xingaiapp/xingai-engineering-coach-ai)

Help non-native English-speaking engineers communicate like senior engineers and
engineering managers — not just with correct grammar, but with risk, decision,
impact, ownership, and next-step language.

**Tagline:** Communicate like a senior engineer—not just a fluent English speaker.

## Status (0.1.0)

Runnable local scaffold as of 2026-07-16:

- Shared `Decision` ledger shape (`lib/decision-ledger.ts`, `lib/types.ts`),
  adopted instead of inventing a bespoke memory schema — see
  `docs/adr/001-decision-ledger-adoption.md`.
- i18n helper (`lib/i18n.ts`) — `tr(lang, en, zh)`; ko planned per XingAI foundation.
- Deterministic scenario bank + rule-based reviewer (`lib/scenario-bank.ts`,
  `lib/review-engine.ts`) — runs with zero API keys.
- Optional real-LLM path (`lib/llm-client.ts`, `lib/prompts.ts`) — upgrades
  automatically when `ANTHROPIC_API_KEY` is set, falls back to the
  deterministic path on any error.
- Full `app/` UI: profile settings, daily exercise, line-by-line review,
  polished version, reusable phrases, Accept/Edit/Reject wired to the ledger,
  recurring weak-areas view.
- API routes: `app/api/exercise`, `app/api/review`, `app/api/decisions`.
- SEO metadata + AEO `FAQPage` JSON-LD (`app/layout.tsx`).

### Getting started

```bash
npm install
npm run dev
# open http://localhost:3006
```

**Not yet:** persistent storage (in-memory only), Email/Push delivery
channels, Weekly Progress Report generation, ko locale. Do not treat this as
production-ready.

## Architecture

- **Worker-style split**: `lib/exercise-engine.ts` / `lib/review-engine.ts`
  hold all generation/scoring logic; `app/api/*/route.ts` routes stay thin
  and only orchestrate.
- **Theme**: CSS variable tokens in `app/globals.css`, light + dark pairs,
  same structure as `xingai-meal-coach-ai`.

## Disclaimer

Educational / informational scaffold only. See [DISCLAIMER.md](DISCLAIMER.md).
XingAI gives no warranty. Users are responsible for their own use, deployment,
compliance, and outcomes.
