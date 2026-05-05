# 100 Day Planner

An interactive single-page planner for the CENTUM 100-day build + marketing campaign.
Real-time backend on Convex. Designed in the Gene Humphreys Brand System v2.4.

## What's inside

- **Overview** — current phase prominent at top, glowing progress ring + timeline strip, overall completion tracker, all 15 phase cards, milestones, tech stack, marketing channels.
- **Gantt** — split into MARKETING (10 tracks) and DEVELOPMENT (15 phases). Each bar lights up as the project progresses.
- **Calendar** — 100-day grid with TODAY badge, past-day cross-off, and a click-to-open day flyout with dev + marketing tasks.
- **Dev Tasks** + **Marketing** — searchable / filterable tables. Tick tasks to mark done; state persists across devices via Convex.
- **Social** — 100-day social media planner. 10×10 grid of days; click any day to edit concept / hook / format / platforms / caption / script / shot list / hashtags / notes / per-day asset uploads.
- **Files** — drag-and-drop file storage organized by phase + marketing category, real-time synced via Convex.

## Stack

- **Frontend** — single `index.html`, vanilla JS, three Google Fonts (Gemunu Libre, Geist, Geist Mono), inline-SVG icon set
- **Backend** — Convex (`schema.ts`, `ticks.ts`, `files.ts`, `social.ts`)
- **Deployment** — currently dev only; production-ready for Vercel + Convex Cloud

## Local setup

```bash
pnpm install                    # installs convex
echo "CONVEX_DEPLOYMENT=dev:your-deployment" > .env.local
pnpm convex:dev                 # provisions / pushes schema + functions
python3 -m http.server 4567     # serve index.html
```

Then visit `http://localhost:4567`.

## Design system

`design-system/` contains the reusable Gene Humphreys Brand System v2.4 — `README.md`, `tokens.css`, and `template.html` for forking into other projects.

---

Built with Claude.
