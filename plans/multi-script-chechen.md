# Plan: Multi-Script Support for Chechen Texts

**Objective:** Add Latin (1992) and Arabic (2.0 with diacritics) script versions to all Chechen texts. Cyrillic is always the master/storage script. Latin and Arabic are generated automatically from Cyrillic TipTap JSON, stored as separate editable versions, and displayed in the reader with a script switcher. Arabic supports show/hide diacritics toggle.

**Date:** 2026-06-11  
**Stack:** Next.js 16.2.5 · React 19.2.4 · NestJS · Prisma · TanStack Query v5 · Zustand v5 · Tailwind CSS v4 · FSD

---

## Dependency Graph

```
Step 1 (Prisma schema)
  └── Step 2 (TransliterationService)
        └── Step 3 (NestJS module + API)
              ├── Step 4 (Frontend entity)
              │     ├── Step 5 (reader-script store)
              │     │     ├── Step 6 (ScriptSwitcher UI)
              │     │     └── Step 7 (ReaderBody integration)
              │     └── Step 8 (editor generate buttons)
Step 9 (stress mark TipTap extension)   ← parallel with Steps 4–8
Step 10 (i18n keys)                     ← parallel with Steps 4–9
```

**Parallel opportunities:**
- Steps 4–8 can begin as soon as Step 3 is merged (backend contract defined)
- Step 9 (stress mark) is fully independent of Steps 4–8
- Step 10 (i18n) can be done any time after Step 4

---

## Anti-patterns to avoid

- Never store transliterated content in `TextPage.contentRich` — always in separate `TextScriptPage`
- Never run transliteration synchronously in HTTP request — use background job (Bull queue already in project)
- Never hardcode Arabic font in global CSS — scope to `.arabic-script` class only
- Never apply `dir="rtl"` to the whole page — only to the article container
- Never skip `lang` attribute update when switching scripts — affects screen readers and browser spell-check
- Never add `useMemo`/`useCallback` for script switching — React Compiler handles it
- Do not put `'use client'` on layout files when adding script context
- Do not duplicate transliteration logic on frontend — backend is single source of truth

---

## Step 1 — Backend: Prisma Schema — Script Version Models

**Skill:** none (pure schema edit)  
**Branch:** `main` (direct, per project convention)  
**Effort:** ~1h  
**Depends on:** nothing  
**Parallel with:** nothing

### Context brief

The backend is a NestJS app at `F:\programming\mott-larbe\mott-larbe-backend`. The Prisma schema is at `prisma/schema.prisma`. Existing relevant models: `Text` (lines ~638), `TextPage` (lines ~680), `UserText` (lines ~1902). Existing enums: `Language`, `ProcessingStatus`.

We need four new models:
- `TextScriptVersion` — one per (textId, script), tracks generation status
- `TextScriptPage` — one per (versionId, pageNumber), stores transliterated TipTap JSON
- `UserTextScriptVersion` — same for UserText
- `UserTextScriptPage` — same for UserText

And one new enum: `ChScript` (LATIN | ARABIC).

### Tasks

- [ ] Add enum `ChScript { LATIN ARABIC }` to schema
- [ ] Add model `TextScriptVersion` with fields: `id`, `textId` (FK→Text cascade), `script` (ChScript), `status` (ProcessingStatus default IDLE), `errorMessage String?`, `createdAt`, `updatedAt`; unique constraint `[textId, script]`; map `text_script_version`
- [ ] Add model `TextScriptPage` with fields: `id`, `versionId` (FK→TextScriptVersion cascade), `pageNumber Int`, `contentRich Json`; unique `[versionId, pageNumber]`; map `text_script_page`
- [ ] Add relation `scriptVersions TextScriptVersion[]` to `Text` model
- [ ] Add model `UserTextScriptVersion` — same structure but `userTextId` FK→UserText; map `user_text_script_version`
- [ ] Add model `UserTextScriptPage` — same as TextScriptPage but FK→UserTextScriptVersion; map `user_text_script_page`
- [ ] Add relation `scriptVersions UserTextScriptVersion[]` to `UserText` model
- [ ] Run `npx prisma migrate dev --name add_script_versions`
- [ ] Run `npx prisma generate`

### Verification

```bash
cd F:\programming\mott-larbe\mott-larbe-backend
npx prisma validate
npx prisma migrate status
```

### Exit criteria

- `prisma validate` passes with no errors
- Migration file created in `prisma/migrations/`
- `@prisma/client` regenerated with new types visible

---

## Step 2 — Backend: TransliterationService

**Skill:** none (pure TypeScript logic)  
**Branch:** `main`  
**Effort:** ~3h  
**Depends on:** Step 1 (Prisma types needed for return types)  
**Parallel with:** nothing

### Context brief

NestJS backend at `F:\programming\mott-larbe\mott-larbe-backend\src`. Modules follow pattern: `src/<name>/<name>.module.ts`, `<name>.service.ts`, `<name>.controller.ts`, `dto/`. 

Text content is stored as TipTap JSON (`contentRich: Json`). Structure:
```json
{ "type": "doc", "content": [ { "type": "paragraph", "content": [ { "type": "text", "text": "нана", "marks": [] } ] } ] }
```

Key TipTap node/mark types in use: `paragraph`, `heading`, `blockquote`, `text`; marks: `bold`, `italic`, `underline`, `superscript`, `textStyle` (color), `stress` (NEW — long vowel marker, added in Step 9).

The service must:
1. Walk TipTap JSON recursively
2. For each `text` node: transliterate the `text` field using the appropriate map
3. Preserve all marks, attrs, structure unchanged
4. Handle `superscript` mark on `н` → nazalization in Arabic
5. Handle `stress` mark → long vowel in Arabic

### Transliteration maps (implement exactly)

**Cyrillic → Latin 1992** (bigrams checked BEFORE single chars, longest match first):

| Cyrillic | Latin |
|----------|-------|
| гӀ | Ġ (lowercase ġ) |
| хь | Ẋ (lowercase ẋ) |
| хӀ | H h |
| цӀ | Ċ ċ |
| чӀ | Ç̇ ç̇ |
| кх | Q q |
| къ | Q̇ q̇ |
| кӀ | Kh kh |
| пӀ | Ph ph |
| тӀ | Th th |
| аь | Ä ä |
| оь | Ö ö |
| уь | Ü ü |
| юь | Yü yü |
| яь | Yä yä |
| а | A a |
| б | B b |
| в | V v |
| г | G g |
| д | D d |
| е | E e (mid-word) / Ye ye (word-start) |
| ж | Ƶ ƶ |
| з | Z z |
| и | I i |
| й | Y y |
| к | K k |
| л | L l |
| м | M m |
| н | N n (or Ŋ ŋ if superscript nazalization) |
| о | O o |
| п | P p |
| р | R r |
| с | S s |
| т | T t |
| у | U u |
| ф | F f |
| х | X x |
| ц | C c |
| ч | Ç ç |
| ш | Ş ş |
| щ | Şç şç |
| ъ | ' (apostrophe) |
| ы | i |
| э | E e |
| ю | Yu yu |
| я | Ya ya |
| ё | Yo yo |
| Ӏ (palochka) | J j |

**Cyrillic → Arabic 2.0** (consonants — initial pass without full diacritics):

| Cyrillic | Arabic |
|----------|--------|
| б | ب |
| в | و |
| г | گ |
| гӀ | غ |
| д | د |
| ж | ج |
| з | ز |
| й | ي |
| к | ك |
| кх | ڤ |
| къ | ق |
| кӀ | ࢰ |
| л | ل |
| м | م |
| н | ن (or nazalized танвин if superscript — see §4.4 of spec) |
| п | پ |
| пӀ | ڥ |
| р | ر |
| с | س |
| т | ت |
| тӀ | ط |
| ф | ف |
| х | خ |
| хь | ح |
| хӀ | ه |
| ц | ﮃ |
| цӀ | ڗ |
| ч | چ |
| чӀ | ݗ |
| ш | ش |
| ъ | ء (position-dependent: see hamza rule) |
| Ӏ | ع |
| а | َ (fatha, U+064E) — أَ word-start |
| аь | َ۬ (fatha + U+06EC) — أَ۬ word-start |
| и | ِ (kasra, U+0650) — إِ word-start |
| э | ِ۬ (kasra + U+06EC) — إِ۬ word-start |
| у | ُ (damma, U+064F) — أُ word-start |
| уь | ُ۬ (damma + U+06EC) |
| о | ٗ (inv damma, U+0657) — أٗ word-start |
| оь | ٗ۬ (inv damma + U+06EC) |
| е | يِ۬ word-start / ِ۬ medial |
| ю | يُ |
| юь | يُ۬ |
| я | يَ |
| яь | يَ۬ |
| Long vowel (stress mark) | add ا after fatha/inv-damma, و after damma, ي after kasra |

**Nazalization rule (superscript н):**
- Final А → ـًا (U+064B + alif)
- Final И → ـٍي (U+064D)  
- Final У → ـٌو (U+064C)
- Final Аь/Э/Уь/О/Оь → ـۨ (U+06E8)

### Tasks

- [ ] Create `src/transliteration/transliteration.module.ts`
- [ ] Create `src/transliteration/transliteration.service.ts` with:
  - `transliterateTiptapJson(doc: object, script: ChScript): object` — main entry point, deep-clones input
  - `transliterateText(text: string, script: ChScript, isWordStart: boolean, prevChar: string, nextChar: string, isNasalized: boolean): string` — per-text-node
  - `walkNode(node: object, script: ChScript): object` — recursive TipTap walker
  - `detectNasalization(marks: object[]): boolean` — checks superscript mark on н
  - `detectStress(marks: object[]): boolean` — checks stress mark
  - `cyrillicToLatin(text: string, context: TranslitContext): string`
  - `cyrillicToArabic(text: string, context: TranslitContext): string`
- [ ] Create `src/transliteration/maps/cyrillic-to-latin.map.ts` — ordered bigram-first map as const
- [ ] Create `src/transliteration/maps/cyrillic-to-arabic.map.ts` — consonant + vowel map
- [ ] Register `TransliterationModule` in `app.module.ts`
- [ ] Write unit tests: `src/transliteration/transliteration.service.spec.ts` covering: simple word, bigrams (гӀ, хь, кх), word-start vowel (а→أَ), superscript-н nazalization, stress mark long vowel

### Verification

```bash
cd F:\programming\mott-larbe\mott-larbe-backend
npx jest src/transliteration --no-coverage
```

### Exit criteria

- All unit tests pass
- `нана` → `nana` (Latin), `نَانَا` (Arabic)  
- `гӀала` → `Ġala` (Latin), `غَالَا` (Arabic)
- `хьан` → `ẋan` (Latin), `حًا` (Arabic, nazalized)

---

## Step 3 — Backend: NestJS Module + API Endpoints

**Skill:** `security-review` (run after implementing auth guards)  
**Branch:** `main`  
**Effort:** ~2h  
**Depends on:** Steps 1, 2  
**Parallel with:** nothing

### Context brief

Pattern from `src/user-texts/`: module imports AuthModule, provides service + controller. Auth guard: `@Auth()` decorator. DTOs use `class-validator`. Background processing: project uses Bull queues (see tokenizer pattern in `src/user-text-reader/user-text-tokenizer.processor.ts`).

New module: `src/text-script/` covering both Text and UserText script versions.

### API design

```
# Library texts (admin only for generate, public for read)
POST   /admin/texts/:id/script-versions          { script: 'LATIN'|'ARABIC' }  → 202 Accepted
GET    /admin/texts/:id/script-versions          → ScriptVersionStatus[]
PATCH  /admin/texts/:id/script-versions/:script/pages/:pageNumber  { contentRich } → updated page
DELETE /admin/texts/:id/script-versions/:script  → 204

# Public read (for reader)
GET    /texts/:id/pages/:page?script=LATIN       → TextPageResponse (with transliterated contentRich)

# User texts
POST   /user-texts/:id/script-versions           { script } → 202
GET    /user-texts/:id/script-versions           → ScriptVersionStatus[]
PATCH  /user-texts/:id/script-versions/:script/pages/:pageNumber  { contentRich } → page
DELETE /user-texts/:id/script-versions/:script  → 204
GET    /user-texts/:id/pages/:page?script=LATIN  → page with transliterated content
```

### Tasks

- [ ] Create `src/text-script/text-script.module.ts`
- [ ] Create `src/text-script/text-script.service.ts`:
  - `generateScriptVersion(textId, script, userId)` — creates TextScriptVersion record (RUNNING), queues job
  - `getScriptVersions(textId)` → status list
  - `updateScriptPage(textId, script, pageNumber, contentRich)` → save edit
  - `deleteScriptVersion(textId, script)` → delete cascade
  - `getPageWithScript(textId, pageNumber, script)` → returns page contentRich from TextScriptPage if exists, else null
  - Same 4 methods for UserText variant
- [ ] Create `src/text-script/text-script.processor.ts` (Bull job processor):
  - Reads all TextPages for textId
  - Calls `TransliterationService.transliterateTiptapJson()` per page
  - Saves results to TextScriptPage
  - Updates TextScriptVersion.status → COMPLETED (or ERROR)
- [ ] Create `src/text-script/text-script.controller.ts` with routes above; admin routes guarded by `@Roles('ADMIN')`; user-texts routes by `@Auth()`
- [ ] Create DTOs: `GenerateScriptVersionDto`, `UpdateScriptPageDto`
- [ ] Modify existing `GET /texts/:id/pages/:page` in `src/text/text.controller.ts` to accept optional `?script=` query param and delegate to TextScriptService
- [ ] Modify existing `GET /user-text-reader/...` similarly
- [ ] Register `TextScriptModule` in `app.module.ts`
- [ ] Run security-review skill on the new controller

### Verification

```bash
# Start backend and test
curl -X POST http://localhost:3000/admin/texts/{id}/script-versions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"script":"LATIN"}'
# Should return 202

curl http://localhost:3000/admin/texts/{id}/script-versions \
  -H "Authorization: Bearer $TOKEN"
# Should return array with status RUNNING or COMPLETED
```

### Exit criteria

- Generation job runs and sets status COMPLETED
- `GET /texts/:id/pages/1?script=LATIN` returns Latin contentRich
- `GET /texts/:id/pages/1` (no script param) returns unchanged Cyrillic contentRich
- Auth guards reject unauthenticated requests to admin routes

---

## Step 4 — Frontend: Entity `text-script-version`

**Skill:** `react19` (check before writing hooks/queries)  
**Branch:** `main`  
**Effort:** ~1h  
**Depends on:** Step 3 (API contract)  
**Parallel with:** Steps 9, 10

### Context brief

Frontend at `f:\programming\mott-larbe\mott-larbe-frontend`. FSD architecture. Entities live in `src/entities/`. Pattern: `api/types.ts`, `api/<name>-api.ts`, `api/<name>-keys.ts`, `model/` for queryOptions/mutations, `index.ts` barrel.

Existing similar entity: `src/entities/reader-context/` — study its structure.

### Tasks

- [ ] Create `src/entities/text-script-version/api/types.ts`:
  ```ts
  export type ChScript = 'LATIN' | 'ARABIC'
  export type ScriptVersionStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'ERROR'
  export interface TextScriptVersionInfo {
    script: ChScript
    status: ScriptVersionStatus
    errorMessage: string | null
    updatedAt: string
  }
  export interface TextScriptPage {
    pageNumber: number
    contentRich: TipTapDoc  // import from entities/text
  }
  ```
- [ ] Create `src/entities/text-script-version/api/text-script-version-api.ts` — fetch functions for all endpoints
- [ ] Create `src/entities/text-script-version/api/text-script-version-keys.ts` — typed query key factory
- [ ] Create `src/entities/text-script-version/model/queries.ts` — `scriptVersionsQueryOptions(textId)`, `scriptPageQueryOptions(textId, pageNumber, script)`; `staleTime: 1000 * 60 * 5`
- [ ] Create `src/entities/text-script-version/model/mutations.ts` — `useGenerateScriptVersion()`, `useUpdateScriptPage()`, `useDeleteScriptVersion()`
- [ ] Create `src/entities/text-script-version/index.ts` barrel exporting all public API

### Verification

- TypeScript compiles: `npx tsc --noEmit`
- No `any` types
- All query keys include all parameters the queryFn depends on

### Exit criteria

- `npx tsc --noEmit` passes
- Barrel exports all needed types and hooks

---

## Step 5 — Frontend: Feature `reader-script` (Zustand Store)

**Skill:** `react19`  
**Branch:** `main`  
**Effort:** ~30min  
**Depends on:** Step 4  
**Parallel with:** Steps 9, 10

### Context brief

Pattern from `src/features/reader-font-family/model/font-family-store.ts`:
```ts
export const useReaderFontFamily = create<State>()(persist((set) => ({ ... }), { name: 'reader-font-family' }))
```

New store: `src/features/reader-script/`.

### Tasks

- [ ] Create `src/features/reader-script/model/reader-script-store.ts`:
  ```ts
  export type ReaderScript = 'CYRILLIC' | 'LATIN' | 'ARABIC'
  interface ReaderScriptState {
    script: ReaderScript
    showDiacritics: boolean   // Arabic only — show/hide vowel diacritics
    setScript: (s: ReaderScript) => void
    setShowDiacritics: (v: boolean) => void
  }
  export const useReaderScript = create<ReaderScriptState>()(persist(..., { name: 'reader-script' }))
  ```
- [ ] Create `src/features/reader-script/model/use-reader-script-availability.ts` hook — takes `versions: TextScriptVersionInfo[]`, returns which scripts are available (COMPLETED status only), including CYRILLIC always
- [ ] Create `src/features/reader-script/index.ts` barrel

### Verification

- `npx tsc --noEmit` passes
- Store persists to localStorage key `reader-script`

### Exit criteria

- Types exported correctly
- `showDiacritics` defaults to `true`
- `script` defaults to `'CYRILLIC'`

---

## Step 6 — Frontend: ScriptSwitcher UI Component

**Skill:** `react19`, `shadcn-claude-skill-main` (for button group pattern)  
**Branch:** `main`  
**Effort:** ~1.5h  
**Depends on:** Steps 4, 5  
**Parallel with:** Steps 7, 8, 9, 10

### Context brief

Pattern from `src/widgets/reader-settings-sheet/ui/reader-settings-body.tsx` — uses `SegmentedGroup` component from `src/features/reader-text-width`. Study that component for the button-group pattern.

The switcher shows above/below article text. Only shows scripts with `status === 'COMPLETED'` (or CYRILLIC which is always available). When Arabic is active, shows a diacritics toggle button.

New feature slice: `src/features/reader-script/ui/`.

RTL: Arabic requires `dir="rtl"` and font `Scheherazade New`. Add font to `src/app/layout.tsx` via `next/font/google`.

### Tasks

- [ ] Create `src/features/reader-script/ui/script-switcher.tsx`:
  - Props: `availableScripts: ReaderScript[]`, `textId: string`
  - Uses `useReaderScript` store
  - Renders 3 labeled buttons: `Кр` / `Lat` / `عر`
  - Only shows buttons for available scripts (always includes CYRILLIC)
  - Active state styled with `aria-pressed`
- [ ] Create `src/features/reader-script/ui/diacritics-toggle.tsx`:
  - Only visible when `script === 'ARABIC'`
  - Toggle button: "Огласовки" show/hide
  - Uses `showDiacritics` from store
- [ ] Add `Scheherazade New` font via `next/font/google` in root layout (weight 400 + 700), expose as CSS variable `--font-scheherazade`
- [ ] Add CSS class `.arabic-script` to `src/app/globals.css`:
  ```css
  .arabic-script {
    font-family: var(--font-scheherazade), 'Amiri', serif;
    direction: rtl;
    text-align: right;
  }
  ```
- [ ] Add diacritics hide CSS: `.arabic-script.hide-diacritics [class*="diacritic"]` — or use Unicode range filter to strip diacritic characters via CSS `font-variant` or JS strip function
- [ ] Update `src/features/reader-script/index.ts` to export new UI components

### Arabic diacritics hide approach

Use a JS strip function (not CSS — CSS cannot strip Unicode combining chars reliably):
```ts
// src/features/reader-script/lib/strip-diacritics.ts
const ARABIC_DIACRITIC_RANGE = /[ؐ-ًؚ-ٟۖ-ۜ۟-۪ۤۧۨ-ۭ]/g
export const stripArabicDiacritics = (text: string) => text.replace(ARABIC_DIACRITIC_RANGE, '')
```

Apply in `ArticleRich` render path when `script === 'ARABIC' && !showDiacritics`.

### Verification

- `npx tsc --noEmit`
- Visually: switcher appears above text, Arabic script renders with correct RTL direction and Scheherazade New font

### Exit criteria

- Switcher only shows available scripts
- Arabic text renders RTL with correct font
- Diacritics toggle works (strip/restore Unicode combining chars)
- Accessibility: `aria-pressed`, `aria-label` on all buttons

---

## Step 7 — Frontend: Reader Integration

**Skill:** `react19`, `vercel-react-best-practices` (streaming, no waterfalls)  
**Branch:** `main`  
**Effort:** ~2h  
**Depends on:** Steps 4, 5, 6  
**Parallel with:** Steps 8, 9, 10

### Context brief

Key files:
- `src/widgets/reader-body/ui/reader-body.tsx` — renders `ArticleRich`, receives `data: TextPageResponse`
- `src/entities/text/ui/article-rich/article-rich.tsx` — receives `contentRich` + `tokens`
- `src/entities/text/ui/article-token/article-token.tsx` — renders individual word; `token.original` is always Cyrillic (for popups/translation)
- `src/widgets/reader-page/ui/reader-page.tsx` — top-level, has `textId` and `pageNumber`

**Key invariant:** Tokens always come from Cyrillic version. Only `contentRich` is swapped per script. Token `original` field stays Cyrillic → word popup always shows Cyrillic + translation.

**Data flow with script support:**
1. `ReaderPage` fetches `scriptVersionsQueryOptions(textId)` → knows which scripts are available
2. When user selects LATIN/ARABIC → fetches `scriptPageQueryOptions(textId, pageNumber, 'LATIN')` → gets transliterated `contentRich`
3. Passes transliterated `contentRich` to `ArticleRich` but keeps original `tokens` (Cyrillic offsets)
4. `ArticleRich` renders with swapped content — token click still fires with Cyrillic `token.original`

**Important:** Token `startOffset`/`endOffset` are positions in Cyrillic `contentRaw`. The transliterated `contentRich` has different text lengths. The `renderRichContent()` function uses offset matching — this will break if we pass transliterated contentRich with Cyrillic tokens.

**Solution:** For Latin/Arabic scripts, render `ArticleRich` in **display-only mode** — no token highlighting by offset (since offsets don't match). Instead use token `position` field to match by word index. Update `renderRichContent()` to support a `displayOnly` mode where tokens are matched by sequential word position rather than character offset.

### Tasks

- [ ] Modify `src/widgets/reader-page/ui/reader-page.tsx`:
  - Add `useQuery(scriptVersionsQueryOptions(textId))` to fetch available scripts
  - Pass `versions` to `ReaderBody`
- [ ] Modify `src/widgets/reader-body/ui/reader-body.tsx`:
  - Accept `scriptVersions?: TextScriptVersionInfo[]` prop
  - Add `useQuery(scriptPageQueryOptions(textId, pageNumber, script))` when `script !== 'CYRILLIC'`
  - Choose `contentRich`: script page if available, else original
  - Pass `scriptVersions` to `ScriptSwitcher`
  - Apply `dir="rtl"` and `arabic-script` CSS class when `script === 'ARABIC'`
  - Apply `stripArabicDiacritics` when `script === 'ARABIC' && !showDiacritics`
  - Update `lang` attribute: `'che-Latn'` for Latin, `'che-Arab'` for Arabic, `'che'` for Cyrillic
- [ ] Modify `src/entities/text/lib/render-rich-content/render-rich-content.ts`:
  - Add optional `displayOnly?: boolean` parameter
  - In displayOnly mode: match tokens by sequential word index, not character offset
- [ ] Render `ScriptSwitcher` above article in `reader-body.tsx`
- [ ] Render `DiacriticsToggle` next to switcher (only when Arabic)

### Performance notes

- Script page query has `staleTime: 5min` — no refetch on every page navigation
- Script versions list prefetched server-side in `page.tsx` (add to `dehydratedState`)
- Do NOT add a loading spinner for script switch — show previous content while loading (TanStack Query `placeholderData: keepPreviousData`)

### Verification

- Switch Кр→Lat: text changes, token popups still work with Cyrillic definitions
- Switch Lat→عر: text changes to Arabic, RTL layout, Scheherazade New font
- Diacritics toggle: Arabic diacritics appear/disappear
- `lang` attribute on article element changes correctly
- No layout shift on script switch (use `keepPreviousData`)

### Exit criteria

- All three scripts render correctly
- Word popup always shows Cyrillic original + translation
- RTL layout for Arabic only
- No regression in highlight/notes/phrases features (still use Cyrillic offsets)

---

## Step 8 — Frontend: Generate Buttons in Editors

**Skill:** `react19`  
**Branch:** `main`  
**Effort:** ~1.5h  
**Depends on:** Step 4  
**Parallel with:** Steps 7, 9, 10

### Context brief

Two editor widgets:
1. `src/widgets/admin-text-edit/ui/text-edit-meta-panel.tsx` — right sidebar in admin editor
2. `src/widgets/user-text-edit/ui/user-text-edit-meta-panel.tsx` — meta panel in user editor

Both have sections for metadata. We add a new "Script versions" section at the bottom of each panel.

Pattern for mutations: `useGenerateScriptVersion()` from entity created in Step 4.

### Tasks

- [ ] Create `src/features/reader-script/ui/script-versions-panel.tsx`:
  - Props: `textId: string`, `isUserText?: boolean`
  - Uses `useQuery(scriptVersionsQueryOptions(textId))` — polls every 3s when any version has status RUNNING (use `refetchInterval`)
  - Renders two rows: Latin and Arabic
  - Each row shows: script name, status badge (Нет / Генерируется... / Готово / Ошибка), generate button, delete button (if COMPLETED/ERROR)
  - "Создать на латинице" / "Создать на арабице" buttons call `useGenerateScriptVersion()`
  - When COMPLETED: "Редактировать" link → future edit page (Step 9 extension — show as disabled for now)
  - Disabled during RUNNING state
- [ ] Add `ScriptVersionsPanel` to `text-edit-meta-panel.tsx` as last section with label "Версии скриптов"
- [ ] Add `ScriptVersionsPanel` to `user-text-edit-meta-panel.tsx` as last section
- [ ] Export `ScriptVersionsPanel` from `src/features/reader-script/index.ts`

### Verification

- Click "Создать на латинице" → status changes to RUNNING → then COMPLETED (after backend job)
- Delete removes the version
- No double-click generation (button disabled while RUNNING)

### Exit criteria

- Both editors show script versions panel
- Status updates in real time (polling)
- Generate/delete mutations work
- Loading states shown correctly

---

## Step 9 — Backend + Frontend: Stress Mark (Long Vowel) TipTap Extension

**Skill:** `react19`  
**Branch:** `main`  
**Effort:** ~1h  
**Depends on:** nothing (fully parallel)  
**Parallel with:** Steps 4–8

### Context brief

TipTap extensions in `src/shared/ui/notion-editor/`. Pattern: see `palochka-decoration-extension.ts` for decoration extension, or `src/shared/ui/notion-editor/notion-editor.tsx` for how extensions are registered via `extraExtensions` prop.

Stress mark = a custom Mark extension that visually renders a combining acute accent (´) over the vowel. Stored as mark `stress` in TipTap JSON.

### Backend impact

`TransliterationService` (Step 2) already handles the `stress` mark — this step just adds the frontend editing capability.

### Tasks

**Frontend:**
- [ ] Create `src/shared/ui/notion-editor/stress-mark-extension.ts`:
  - TipTap `Mark.create({ name: 'stress' })`
  - `renderHTML`: `['span', { class: 'stress-mark' }, 0]`
  - `parseHTML`: matches `span.stress-mark`
- [ ] Add CSS to `src/app/globals.css`:
  ```css
  .stress-mark { position: relative; }
  .stress-mark::after { content: '́'; position: absolute; top: -0.1em; left: 50%; }
  ```
  OR use Unicode combining acute directly: mark adds U+0301 after the character (simpler, no CSS needed)
- [ ] Add stress mark button to TipTap bubble menu in `src/shared/ui/notion-editor/bubble-menu-content.tsx` — small `´` button, visible only when `language === 'CHE'`
- [ ] Register extension in `notion-editor.tsx` extraExtensions when language is CHE

**Backend:**
- Already handled in Step 2's `detectStress()` function. No additional backend work.

### Verification

- Select a vowel in editor → bubble menu shows `´` button
- Toggle stress mark → visual accent appears
- Save → TipTap JSON contains `{ "type": "text", "text": "а", "marks": [{ "type": "stress" }] }`
- Generate Latin/Arabic with stressed vowel → long vowel rendered correctly

### Exit criteria

- Stress mark saved in TipTap JSON
- Visual representation clear in editor
- Transliteration uses it correctly

---

## Step 10 — Frontend: i18n Keys

**Skill:** none  
**Branch:** `main`  
**Effort:** ~30min  
**Depends on:** nothing (parallel with all frontend steps)  
**Parallel with:** Steps 4–9

### Context brief

Locale files at `src/locales/che.json`, `ru.json`, `en.json`. All three must be updated simultaneously. Keys follow dot-notation nesting: `reader.script.latin`, etc.

### Tasks

- [ ] Add to all three locale files under `reader`:
  ```json
  "script": {
    "cyrillic": "Кириллица / Kirilliċa / Кириллица",
    "cyrillicShort": "Кр / Кр / Кр",
    "latin": "Латиница / Latiniċa / Латиница",
    "latinShort": "Lat / Lat / Lat",
    "arabic": "Арабица / Arаbiċa / Арабица",
    "arabicShort": "عر / عر / عر",
    "switchScript": "...",
    "diacritics": "...",
    "diacriticsShow": "...",
    "diacriticsHide": "..."
  }
  ```
- [ ] Add to all three locale files under `admin` (and shared):
  ```json
  "scriptVersions": {
    "title": "Версии скриптов / ...",
    "generateLatin": "Создать на латинице / ...",
    "generateArabic": "Создать на арабице / ...",
    "statusNone": "Нет / ...",
    "statusRunning": "Генерируется... / ...",
    "statusDone": "Готово / ...",
    "statusError": "Ошибка / ...",
    "delete": "Удалить / ...",
    "edit": "Редактировать / ..."
  }
  ```
- [ ] Use `t('reader.script.cyrillicShort')` etc. in all new components (no hardcoded strings)

### Verification

- `npx tsc --noEmit` (locale types should match if typed)
- All three locale files have identical key structure

### Exit criteria

- Zero hardcoded UI strings in new components
- All three languages have all keys

---

## Execution Order

```
Week 1:
  Day 1: Step 1 (Prisma schema, 1h)
  Day 1–2: Step 2 (TransliterationService, 3h) + Step 9 parallel (stress mark, 1h)
  Day 2–3: Step 3 (NestJS API, 2h)

Week 2:
  Day 1: Step 4 (entity, 1h) + Step 10 parallel (i18n, 30min)
  Day 1: Step 5 (Zustand store, 30min)
  Day 2: Step 6 (ScriptSwitcher UI, 1.5h)
  Day 3: Step 7 (Reader integration, 2h)
  Day 4: Step 8 (Editor generate buttons, 1.5h)

Total: ~14h implementation
```

---

## Rollback Strategy

Each step is independently reversible:
- Steps 1–3 (backend): revert Prisma migration (`prisma migrate reset` dev only), delete module files
- Steps 4–10 (frontend): delete new files, revert modifications to existing files
- No data loss risk — Cyrillic master content is never modified

---

## Security Checklist (per `security-review` skill)

- [ ] Admin generate endpoint requires ADMIN role — non-admins cannot generate library text scripts
- [ ] User-text generate endpoint requires auth + ownership check — users can only generate their own texts
- [ ] `contentRich` PATCH accepts only valid TipTap JSON — validate schema, reject `<script>` nodes
- [ ] Script page size limit — reject `contentRich` > 500KB
- [ ] Rate limit on generate endpoint — prevent spam generation jobs
- [ ] No user-supplied data injected into transliteration maps (maps are static code)

---

## SEO / SSR Notes (Next.js 16.2.5)

- Script versions list should be prefetched server-side and added to `dehydratedState` in `page.tsx`
- `lang` attribute on `<html>` stays as route lang; inner article uses `lang="che-Latn"` / `lang="che-Arab"` attributes
- Arabic script page: add `hreflang` variants if separate URLs are introduced (not in this plan — single URL with client switch)
- `ScriptSwitcher` is client-only (Zustand) — wrap in `<Suspense>` with skeleton fallback to avoid hydration mismatch
- Font preloading: `Scheherazade New` loaded via `next/font/google` with `display: 'swap'`

---

## Performance Notes

- Script page data: `staleTime: 5min`, `gcTime: 30min` — rarely changes after generation
- Polling in editor (Step 8): `refetchInterval: 3000` only when `status === 'RUNNING'`, stop when COMPLETED
- `keepPreviousData` on script page query — no flash of empty content during script switch
- Arabic transliteration is CPU-heavy — always run in Bull background job, never in HTTP request
- Translation maps are static `as const` objects — no runtime allocation

---

*Plan generated: 2026-06-11*  
*Next session: Start with Step 1 — Prisma schema*
