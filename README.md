# CodeQuest

A gamified, browser-only lesson loop for the "Programming Foundations"
Python track: Variables through Return Values.

## What's here

- Home screen listing all 9 lessons with locked/unlocked/completed state.
- Each lesson: explanation → live-run code example → challenge → immediate
  feedback → XP award → unlock next lesson. Three challenge types:
  Predict-the-Output, Fill-in-the-Blank, and Fix-the-Bug.
- A persistent header with total XP, a daily visit streak, the current
  lesson name, and a light/dark mode toggle.
- Progress (XP, completed lessons, streak) is saved to `localStorage` —
  refreshing the page does not lose it. No accounts, no backend.
- Lesson content lives in one place: `src/data/lessons.ts`. This is the seam
  later phases extend — add lessons/tracks/challenge types there, not
  inline in components.
- Python code examples run for real, client-side, via
  [Pyodide](https://pyodide.org) (loaded from a CDN at runtime) so the shown
  output is computed live rather than hand-typed. If Pyodide can't load
  (offline, blocked network), the lesson falls back to the pre-written
  output stored in the lesson data.

## Stack

Vite + React + TypeScript + Tailwind CSS. All state is React state +
`localStorage`. Builds to a static site (`npm run build` → `dist/`).

## Running locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build   # type-checks then builds to dist/
npm run preview # serve the production build locally
```
