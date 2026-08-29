# CodeQuest

A gamified, browser-based coding app: a shared "Programming Foundations"
track (Python), then a choice between an "AI Developer" (Python) or "Game
Developer" (C++) specialization — with a full dashboard/sidebar app shell,
achievements, mastery tracking, and an optional AI tutor.

## What's here

- **App shell** — a persistent sidebar (Dashboard, Map, Lessons, Challenges,
  Projects, Achievements, Community, Store) and a header with a real,
  XP-derived Level badge (100 XP/level), streak, and light/dark toggle.
  Collapses to a drawer on mobile.
- **Dashboard** — a mascot greeting, an illustrated horizontal "Learning
  Map" of the active track, a Continue Learning card, and your most recent
  achievement. The mascot, the C++/Python track icons, and the map's
  floating-islands background are real art (`src/assets/`, from the
  project's own asset pack) — not emoji or hand-drawn placeholders.
- **Map** — the same learning-map visualization full-page, with tabs to
  switch between every track you've unlocked.
- **Lessons** — the classic locked/unlocked/completed list, with a
  per-lesson mastery indicator (★★★ solved first try, down to ★☆☆ after
  several attempts).
- **Challenges** — every challenge you've unlocked so far, browsable in one
  flat list for review, tagged by type.
- **Projects** — the track's capstone project lessons as cards.
- **Achievements** — milestones the app already tracks (first lesson, a
  first-try solve, visit streaks, XP totals, finishing a track, choosing a
  path) — a pop-in toast on unlock, plus a grid of all of them.
- **Community / Store** — both need real backend features (accounts,
  payments) this app doesn't have, so they're honest "coming soon" pages
  rather than faked functionality.
- Each lesson: explanation → code example → challenge → immediate feedback
  → XP award → unlock next lesson, with quick-jump pills (Explain / Example
  / Challenge) and, for Fix-the-Bug challenges, a "Boss Challenge" visual
  treatment. Three challenge types: Predict-the-Output, Fill-in-the-Blank,
  and Fix-the-Bug.
- **Two specializations after Foundations**: AI Developer (Python — Lists &
  Dictionaries, Files, a Quiz Game project) and Game Developer (C++ —
  Variables & Types through References, ending in a Health Bar project).
  Both are real content. C++ has no in-browser compiler (that's a genuinely
  separate, much larger project), so its examples show correct, hand-verified
  output rather than a live-executed one — same fallback mode Python uses
  when Pyodide can't load.
- An on-demand AI Tutor: after a wrong answer, an "Ask AI Tutor" button
  calls a small backend that asks Claude for a hint. Hints escalate across
  attempts — a gentle nudge on the first miss, a more specific pointer on
  the second, a full worked explanation from the third on — grounded in
  the lesson's own explanation and reference hint so it can't wander
  off-topic. It's on-demand rather than automatic so the free, instant
  static hint is never blocked on a network call, and the app works
  exactly as before if the tutor isn't configured.
- Progress (XP, completed lessons, streak, chosen path, mastery,
  achievements) is saved to `localStorage` — refreshing the page does not
  lose it. Still no accounts, no fabricated user identity anywhere.
- Lesson content lives in one place: `src/data/lessons.ts`, organized into
  `Track`s. This is the seam later phases extend — add lessons/tracks/
  challenge types there, not inline in components.
- Python code examples run for real, client-side, via
  [Pyodide](https://pyodide.org) (loaded from a CDN at runtime) so the shown
  output is computed live rather than hand-typed. If Pyodide can't load
  (offline, blocked network), the lesson falls back to the pre-written
  output stored in the lesson data — the same fallback C++ always uses.

## Stack

Vite + React + TypeScript + Tailwind CSS, deployed as a static site to
GitHub Pages. The AI tutor is the one piece that needs a server: a small
[Cloudflare Worker](https://workers.cloudflare.com/) in `worker/`, calling
the Claude API via the official Anthropic SDK.

## Running the frontend locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build   # type-checks then builds to dist/
npm run preview # serve the production build locally
```

## Setting up the AI Tutor (optional — the app works fine without it)

The frontend calls `VITE_TUTOR_API_URL` if it's set; if it's unset, or the
call fails for any reason, lessons just show the static hint/explanation
as before. To turn the tutor on:

1. **Deploy the worker.**
   ```bash
   cd worker
   npm install
   npx wrangler login          # one-time, opens a browser
   npx wrangler deploy
   ```
   This prints the worker's URL (`https://codequest-tutor.<your-subdomain>.workers.dev`).

2. **Give the worker an Anthropic API key** (get one at
   [console.anthropic.com](https://console.anthropic.com/)):
   ```bash
   npx wrangler secret put ANTHROPIC_API_KEY
   ```
   Without this, the worker responds `503` and the app just falls back to
   static hints — nothing breaks, the tutor button just says it's
   unavailable.

3. **Point the deployed frontend at the worker.** In the GitHub repo:
   **Settings → Secrets and variables → Actions → Variables**, add
   `TUTOR_API_URL` = the worker URL from step 1. The next push (or a
   manual re-run of the "Deploy to GitHub Pages" workflow) builds it in.

4. **(Optional) Let CI deploy the worker for you** instead of running
   `wrangler deploy` by hand on every change. Add these as **repository
   secrets** (Settings → Secrets and variables → Actions → Secrets):
   - `CLOUDFLARE_API_TOKEN` — a Cloudflare API token with Workers edit
     permission ([create one](https://dash.cloudflare.com/profile/api-tokens))
   - `CLOUDFLARE_ACCOUNT_ID` — found on the Cloudflare dashboard's
     right sidebar
   - `ANTHROPIC_API_KEY` — the same key from step 2 (the workflow pushes
     it to the worker as a secret on every deploy, so it stays in sync)

   Once those are set, `.github/workflows/deploy-worker.yml` deploys the
   worker automatically on any push that touches `worker/`.

**A note on scope:** this endpoint is public and unauthenticated (there
are no accounts anywhere in this app). CORS is restricted to this app's
own origin, which stops casual browser-based reuse from other sites, but
it doesn't stop someone from calling the worker directly — there's no
rate limiting. That's an acceptable tradeoff for a small personal/hobby
deployment; if usage grows, add real rate limiting (e.g. Cloudflare's
built-in rate limiting rules, or a KV-based per-IP counter) before
sharing the URL widely.

### Local worker development

```bash
cd worker
npm install
npx wrangler dev   # runs at http://127.0.0.1:8787
```

Then in the repo root, create `.env.local` (see `.env.example`) pointing
`VITE_TUTOR_API_URL` at that local URL, and `npm run dev` as usual. The
local worker also needs its own key — `wrangler dev` reads it from a
gitignored `worker/.dev.vars` file:
```
ANTHROPIC_API_KEY=sk-ant-...
```
