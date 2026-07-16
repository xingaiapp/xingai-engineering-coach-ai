# XingAI Engineering Communication Coach

**Version:** 0.2.2  
**Repo:** [xingaiapp/xingai-engineering-coach-ai](https://github.com/xingaiapp/xingai-engineering-coach-ai)  
**Planned URL:** https://engineering-coach.xingai.app

Help non-native English-speaking engineers communicate like Senior Engineers, Architects, Tech Leads, and Engineering Managers — trust, conflict, feedback, charisma, and leadership English in real workplace scenarios.

**Tagline:** Communicate like a senior engineer—not just a fluent English speaker.

中文: [README.zh.md](README.zh.md)

## Status (0.2.2) — Communication & Charisma + ship checklist

- Core Master Prompt: Engineering Communication & Charisma Coach (`lib/prompts.ts`)
- **14-day curriculum** + advanced cycle (`lib/curriculum.ts`) — ADR: [`002-14-day-communication-curriculum.md`](docs/adr/002-14-day-communication-curriculum.md) · [中文](docs/adr/002-14-day-communication-curriculum.zh.md)
- Decision ledger: [`001-decision-ledger-adoption.md`](docs/adr/001-decision-ledger-adoption.md)
- Mobile-first chrome: top / drawer / bottom tabs / desktop side nav; safe areas; 44px targets
- Review UI: stacked sentence cards on phone (not wide 4-col tables); expression table scrolls
- Visible homepage FAQ + FAQPage / SoftwareApplication JSON-LD (synced with `llms.txt`)
- SEO: metadataBase, canonical, OG/Twitter, robots (`Disallow: /api/`), sitemap, apple-touch-icon
- Locales en/zh/ko; light/dark no-flash boot; legal EN+中文+한국어
- Registered on xingai.app as **coming soon** (`engineering-coach`)

### Project-init checklist

- [x] Mobile-first ~375px; safe areas; bottom nav clearance
- [x] Top bar, drawer, footbar, desktop side menu open/collapsed
- [x] Logo, favicon, apple-touch-icon, OG separate from hero
- [x] In-app hero light + dark (mobile strip + desktop column)
- [x] EN / zh / ko; light / dark
- [x] Privacy, Terms, Disclaimer linked
- [x] SEO metadata + robots + sitemap
- [x] llms.txt + FAQ + JSON-LD
- [x] Registered in xingai-dot-app (`src` + `srcDark`)
- [x] .env.example + README
- [ ] Login / Google OAuth — N/A (no auth yet)
- [ ] Live domain deploy — planned

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

**Still not production-ready:** in-memory session storage only; no Email/Push; no weekly report worker.

## Architecture

- Thin API routes; generation/scoring in `lib/*-engine.ts`
- Decision ledger: `docs/adr/001-decision-ledger-adoption.md`
- Theme tokens in `app/globals.css` (`data-theme`)

## Disclaimer

Educational / informational only. See [DISCLAIMER.md](DISCLAIMER.md).
XingAI gives no warranty. Verify suggested wording before sending it.
