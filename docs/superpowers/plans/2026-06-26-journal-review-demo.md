# Journal Review Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local single-person mood photo diary demo with visual diary
cards and a monthly review view.

**Architecture:** Add a closed-loop `journal` module on both backend and
frontend. Backend schemas define the wire contract, repositories persist records
with the shared `db` interface, and frontend views use Pinia and module API
clients only.

**Tech Stack:** Fastify, TypeScript, zod, SQLite/Postgres-compatible migrations,
Vue 3, Pinia, Vue Router, Less, Vite.

---

## File Structure

- Create `backend/src/modules/journal/*` using the backend scaffold, then replace todo-like fields with journal fields.
- Modify `backend/src/routes.ts` to register the journal module.
- Create `frontend/src/modules/journal/*` using the frontend scaffold, then replace todo UI with visual diary UI.
- Modify `frontend/src/router/index.ts` to register journal routes and redirect home to `journal-list`.
- Run `bash .agents/skills/vibecoding-verify/scripts/verify.sh` from repo root.

## Tasks

### Task 1: Scaffold Modules

- [ ] Run `node .agents/skills/vibecoding-backend-module/scripts/scaffold.mjs journal`.
- [ ] Run `node .agents/skills/vibecoding-frontend-module/scripts/scaffold.mjs journal`.
- [ ] Confirm both modules contain the required files listed in the AGENTS guides.

### Task 2: Backend Contract And Persistence

- [ ] Define `JournalCreateSchema`, `JournalUpdateSchema`, `JournalIdSchema`, and `JournalSchema`.
- [ ] Create paired sqlite/pg migrations for a `journal` table with `id`, `entry_date`, `mood`, `mood_color`, `note`, `photos`, `created_at`, and `updated_at`.
- [ ] Implement repository serialization for `photos` as JSON text.
- [ ] Implement list/get/create/update/remove service methods.
- [ ] Ensure controller parses params/body with zod and returns `success()`.
- [ ] Ensure module prefix is `/api/journal` and root backend routes register it.

### Task 3: Frontend Contract And Store

- [ ] Align frontend `Journal`, `JournalCreateInput`, and `JournalUpdateInput` with backend `JournalSchema`.
- [ ] Implement `journalApi` with list/get/create/update/remove methods using paths under `/journal`.
- [ ] Implement Pinia state for entries, loading, error, create, update, remove, and fetchAll.
- [ ] Add a composable exposing entries plus derived month groups.

### Task 4: Frontend Experience

- [ ] Build a journal list view as the first screen with month preview strip, composer, and visual entry cards.
- [ ] Build a review view with a complete monthly calendar, photo mosaic, and mood color rhythm.
- [ ] Add module routes for `/journal` and `/journal/review`.
- [ ] Redirect `/` to `journal-list`.
- [ ] Keep all business UI inside `frontend/src/modules/journal`.

### Task 5: Verification

- [ ] Run `bash .agents/skills/vibecoding-verify/scripts/verify.sh`.
- [ ] Fix `[ARCH]`, type-check, or lint failures.
- [ ] Re-run until `verify: ALL PASSED`.
