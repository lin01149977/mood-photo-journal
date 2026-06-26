# Journal Review Demo Design

## Product Intent

Build a local, single-person mood photo diary demo. The app helps a user keep
small visual traces of ordinary days before they blur together: one daily entry,
one to three photos, one mood color, and a short note. The review experience
should make the month easy to revisit through photos and color.

## Current Structure

- Backend modules live under `backend/src/modules/<name>/` with zod schemas,
  repositories, services, controllers, routes, paired migrations, and `index.ts`.
- Frontend modules live under `frontend/src/modules/<name>/` with API client,
  store, composables, routes, views, components, and types.
- Existing `todo` module provides the CRUD, routing, Pinia, and request patterns.
- Root routes currently register `todo` in `backend/src/routes.ts` and
  `frontend/src/router/index.ts`.

## Target Architecture

Create a new full-stack `journal` module. The backend owns persisted journal
entries in SQLite/Postgres-compatible tables. The frontend owns the visual diary
experience and talks to the backend only through `modules/journal/api`.

The demo stores lightweight photo data as strings inside the journal record.
This supports local image preview persistence without file upload, cloud sync,
or auth. The UI treats those strings as preview URLs/data URLs.

## Data Contract

| Backend field | Frontend field | Notes |
| --- | --- | --- |
| `id: string` | `id: string` | Generated with `nanoid()` |
| `entryDate: string` | `entryDate: string` | Day key, `YYYY-MM-DD` |
| `mood: string` | `mood: string` | Mood id such as `calm`, `joy`, `tired` |
| `moodColor: string` | `moodColor: string` | Hex color used by review visuals |
| `note: string` | `note: string` | Short optional text, stored as empty string |
| `photos: string[]` | `photos: string[]` | One to three local preview strings |
| `createdAt: string` | `createdAt: string` | ISO string |
| `updatedAt: string` | `updatedAt: string` | ISO string |

Validation:

- Create requires `entryDate`, `mood`, `moodColor`, and `photos`.
- `photos` must contain one to three strings.
- `note` is optional and capped at 500 characters.
- Update accepts partial fields but must include at least one changed field.

## User Experience

The default route opens the journal list. The page has a warm, polished visual
style with a month preview strip, a quick entry composer, and a photo-first
timeline. Entries are designed as small memory cards rather than admin records.

The review page focuses on a monthly calendar. Every day in the current month
is visible, including days without photo records. Recorded days show a
representative photo and mood color; empty days stay quiet but present.

## Change Boundary

Expected changes:

- Add backend `journal` module and register it.
- Add frontend `journal` module and register it.
- Change the frontend home redirect from todo list to journal list.
- Add docs/spec and docs/plan files.

Out of scope:

- Login, multi-user data, cloud sync, sharing, native camera integration, real
  file upload, search, tags, and advanced analytics.

## Verification

Run the project verification gate from the repository root:

```bash
bash .agents/skills/vibecoding-verify/scripts/verify.sh
```

The work is complete only when verification exits with code `0` and prints
`verify: ALL PASSED`, or when a blocking environment issue is documented.
