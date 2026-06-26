# Mood Photo Journal

A local single-person mood photo diary demo. Record a day with 1-3 photos,
a mood color, and a short note, then revisit the month as a visual calendar.

## Features

- Create photo journal entries with 1-3 photos.
- Choose today or a past date for backfilling memories.
- Pick a mood represented by color.
- Add a short note for the day.
- Review the current month as a full calendar.
- Empty days are shown, so the month feels complete.
- Recorded days show representative photos and mood colors.
- Full-screen oil-painting style background with subtle motion.

## Tech Stack

- Frontend: Vue 3, TypeScript, Less, Vite, Pinia, Vue Router.
- Backend: Fastify, TypeScript, zod.
- Database: SQLite for local demo, PostgreSQL-ready migrations.

## Quick Start

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start the backend:

```bash
cd backend
npm run dev
```

On Windows, if `better-sqlite3` fails with a Node native dependency issue, use
the included Node 20 helper after installing dependencies with Node 20:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/dev-backend-node20.ps1
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open:

```text
http://127.0.0.1:5173/
```

The frontend proxies `/api` to `http://localhost:3000`.

## Online Demo

The GitHub Pages build runs as a browser-only demo. It does not require the
backend, and each visitor's diary data is saved in their own browser storage:

```text
https://lin01149977.github.io/mood-photo-journal/
```

To build the same static demo locally:

```bash
cd frontend
VITE_STATIC_DEMO=true VITE_APP_BASE=/mood-photo-journal/ npm run build
```

## Project Structure

```text
backend/src/modules/journal/    Journal API, schema, repository, migrations
frontend/src/modules/journal/   Journal UI, routes, store, API client
frontend/src/assets/journal/    Mood background assets
docs/                           Project docs and Feishu introduction
```

## Verification

Run type-check and lint:

```bash
cd backend
npm run type-check
npm run lint

cd ../frontend
npm run type-check
npm run lint
```

Architecture checks:

```bash
node .agents/skills/vibecoding-verify/scripts/check-modules.mjs .
node .agents/skills/vibecoding-verify/scripts/check-migrations.mjs .
node .agents/skills/vibecoding-verify/scripts/check-db-design.mjs .
node .agents/skills/vibecoding-verify/scripts/check-api.mjs .
```

## Notes

- This is a local demo. It does not include login, cloud sync, sharing, or
  production file upload.
- Photos are compressed in the browser and saved as lightweight data URL
  strings for demo use.
- Backend request body limit is set to `6MB` for the local photo workflow.
