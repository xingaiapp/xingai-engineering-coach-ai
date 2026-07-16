# XingAI Engineering English Coach

**Version:** 0.1.1  
**Repo:** [xingaiapp/xingai-engineering-coach-ai](https://github.com/xingaiapp/xingai-engineering-coach-ai)  
**Planned URL:** https://engineering-coach.xingai.app

Help non-native English-speaking engineers communicate like senior engineers and
engineering managers — risk, decision, impact, ownership, and next-step language.

**Tagline:** Communicate like a senior engineer—not just a fluent English speaker.

中文: [README.zh.md](README.zh.md)

## Status (0.1.1) — project-init baseline

- Mobile-first chrome: top bar, drawer, bottom tabs, desktop side nav (open/collapsed)
- Locales: **en / zh / ko** (persisted); light + dark theme (no-flash boot)
- Hero light/dark pair: `public/brand/hero-bg-light-visual.png` + `hero-bg-visual.png`
- Favicon / app icon: `app/icon.svg` + `public/icon.svg`
- Legal (EN+中文+한국어 on each page): `/legal/privacy`, `/legal/terms`, `/legal/disclaimer`
- SEO/AEO: metadata + OG/Twitter, `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`, FAQ + SoftwareApplication JSON-LD
- Registered on [xingai.app](https://xingai.app) apps catalog as **coming soon** (`engineering-coach`)
- Deterministic scenario + review engines; optional Anthropic upgrade via `ANTHROPIC_API_KEY`
- Decision ledger shape: `docs/adr/001-decision-ledger-adoption.md`

### Getting started

```bash
cp .env.example .env.local   # optional ANTHROPIC_API_KEY
npm install
npm run dev
# http://localhost:3006
```

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local Next.js on port 3006 |
| `npm run build` | Production build |
| `npm run lint` | `tsc --noEmit` |

### Deploy notes

- Vercel: see `vercel.json` (`npm ci` + `next build`)
- Set `SITE_URL=https://engineering-coach.xingai.app` in production
- Domain not required for local demo; mark **Soon** on marketing until live

**Still not production-ready:** in-memory session storage only; no Email/Push; no weekly report worker.

## Architecture

- Thin API routes; generation/scoring in `lib/*-engine.ts`
- Theme tokens in `app/globals.css` (`data-theme`)

## Disclaimer

Educational / informational only. See [DISCLAIMER.md](DISCLAIMER.md).
XingAI gives no warranty. Verify suggested wording before sending it.
