You are implementing a new feature across two existing projects. Before implementing any step, read the relevant files in each project to check if that functionality already exists. Do not duplicate existing code.

## Projects

**Project 1: Dictionary (Словарь)**

- Backend only (NestJS) — standalone Chechen dictionary API service
- No frontend changes needed in this project

**Project 2: Mott Larbe**

- Backend (NestJS) — main platform API
- Frontend (Next.js, Tailwind CSS v4, Shadcn UI, TanStack Query, Axios .etc) — admin panel UI

Before starting, read both projects' structure, package.json, prisma schemas, existing modules, and auth implementations to understand conventions and what already exists.

Implement in the following order. Check each item first, implement only if missing.

---

## Phase 1: Dictionary project

### Step 1 — API Key Passport strategy

Check if `api-key` Passport strategy already exists.
If not, create `src/auth/strategies/api-key.strategy.ts`:

- Reads `X-Api-Key` header
- Finds key in `ApiKey` table via Prisma
- Validates `isActive === true` and `expiresAt > now` (if expiresAt is set)
- Returns the key record as `req.user`
- Throws `UnauthorizedException` if invalid
  ...

## Phase 2: Mott Larbe project

- Steps 6–10: backend (NestJS)
- Step 11: frontend (Next.js admin panel)
  Check if a guard that accepts both JWT and API key already exists.
  If not, create `src/auth/guards/jwt-or-api-key.guard.ts`:
- Tries JWT first, falls back to API key
- If neither works, throws `UnauthorizedException`

### Step 3 — Update `AdminPermission` decorator

Check current implementation of `AdminPermission`.
If it only supports JWT, update it to also accept API key authentication using the combined guard from Step 2.
Keep existing JWT-only behavior intact.

### Step 4 — `direct-import` endpoint

Check if `POST /admin/entries/direct-import` already exists in `EntriesAdminController`.
If not:

Add endpoint:
POST /admin/entries/direct-import
Permission: CAN_ADD_ENTRIES
Auth: JWT or API key

DTO:

```typescript
class DirectImportEntryDto {
	word: string;
	translation: string;
	transliteration?: string;
	partOfSpeech?: string;
	example?: string;
	source: string; // "mott-larbe-ai"
}

class DirectImportDto {
	entries: DirectImportEntryDto[]; // max 100
}
```

Logic:

- For each entry, check if `wordNormalized` already exists in `UnifiedEntry`
- If exists: skip (increment skipped counter)
- If not: create `UnifiedEntry` with:
  - `word`: as provided
  - `wordNormalized`: lowercase, normalized (use existing `normalizeWord` util)
  - `meanings`: `[{ translation, examples: entry.example ? [{ nah: entry.example, ru: "" }] : [] }]`
  - `partOfSpeech`: if provided
  - `sources`: `[entry.source]`
  - `entryType`: `"standard"`
  - `lastModifiedBy`: `"mott-larbe-ai"`
- Write audit log: `actorType: "api"`, `action: "create"`, `changes: { source: entry.source, word: entry.word }`
- Return `{ created: number, skipped: number, total: number }`

### Step 5 — Verify EDITOR role has CAN_ADD_ENTRIES permission

Check if `EDITOR` role exists and has `CAN_ADD_ENTRIES` permission in the database seed or migration.
If not, add it.

---

## Phase 2: Mott Larbe project

### Step 6 — Environment config

Check if `DICTIONARY_API_URL` and `DICTIONARY_API_KEY` already exist in config/env validation.
If not, add them to the env config (with validation using existing config pattern in the project).

### Step 7 — `exportedAt` field in ai_translation_cache

Check if `ai_translation_cache` table/model already has an `exportedAt` field.
If not, add:
exportedAt DateTime? // null = not yet exported
Generate and apply migration.

### Step 8 — `DictionaryExportService`

Check if this service already exists.
If not, create `src/dictionary-export/dictionary-export.service.ts`:

Logic for `exportApproved()` method:

1. Fetch records from `ai_translation_cache` where `status = "approved"` AND `exportedAt IS NULL`
2. Map each record to `DirectImportEntryDto` format:
   - `word`: lemma
   - `translation`: translation
   - `transliteration`: transliteration (if exists)
   - `partOfSpeech`: part_of_speech (if exists)
   - `example`: example (if exists)
   - `source`: `"mott-larbe-ai"`
3. Send in batches of 50 to `POST {DICTIONARY_API_URL}/admin/entries/direct-import` with header `X-Api-Key: {DICTIONARY_API_KEY}`
4. On success: update `exportedAt = now()` for exported records
5. On error: log error, do not update `exportedAt` (will retry next run)
6. Return `{ created, skipped, total, errors }`

### Step 9 — Scheduled cron job

Check if a cron job for dictionary export already exists.
If not, add a cron job that runs `DictionaryExportService.exportApproved()` once per day (configurable time).
Use existing cron/scheduler pattern in the project.

### Step 10 — Manual export endpoint

Check if `POST /api/admin/ai-cache/export-to-dictionary` already exists.
If not, add it to the admin AI-cache controller:

- Calls `DictionaryExportService.exportApproved()` immediately
- Returns result `{ created, skipped, total, errors }`
- Requires admin permission

### Step 11 — Manual export button in admin UI (frontend)

Check if the export button already exists in the AI-cache admin page.
If not, add a button "Экспортировать в словарь" in the AI-кэш section of the admin panel:

- Calls `POST /api/admin/ai-cache/export-to-dictionary`
- Shows loading state while running
- Shows result toast/notification: "Добавлено: N, пропущено: M"
- Uses existing design system, components, and patterns

---

## Requirements

- Read existing code before every step — do not assume anything
- Do not break existing functionality
- Follow existing code conventions, naming patterns, and module structure in each project
- All new endpoints must follow existing auth and permission patterns
- Handle errors gracefully — failed export should not crash the cron job
- Add proper TypeScript types everywhere

...
