# Plan: Spelling Dictionary (Словарь правильного написания)

**Objective:** Admin-managed list of correct Chechen spellings and stress marks, highlighted in the text editor with click-to-fix correction. Hybrid storage: DB + TanStack Query cache (1 hour staleTime).

**Stack:** Next.js 16.2 · React 19.2 · Tiptap · TanStack Query v5 · Prisma · FSD · Tailwind v4

**Dependency order:** Steps 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8  
Steps 6 and 7 can run in parallel after step 5.

---

## Architecture Overview

```
Backend:
  SpellingEntry (Prisma model)
    id, wrongForm, correctForm, comment?, createdById, createdAt, updatedAt
  
  POST   /api/admin/spelling-dictionary        (CAN_EDIT_TEXTS)
  GET    /api/admin/spelling-dictionary        (CAN_EDIT_TEXTS) — paginated list
  PATCH  /api/admin/spelling-dictionary/:id   (CAN_EDIT_TEXTS)
  DELETE /api/admin/spelling-dictionary/:id   (CAN_EDIT_TEXTS)
  GET    /api/spelling-dictionary/all          (public, cached) — full list for editor

Frontend:
  entities/spelling-dictionary/
    api/   — queryOptions, mutation hooks, types
    model/ — useSpellingDictionary (loads all, staleTime 1h)
    index.ts

  features/spelling-correction/
    model/ — useSpellingCorrection (highlights engine, apply fix)
    ui/    — SpellingCorrectionPopup (tooltip on hover, fix button)
    index.ts

  shared/ui/notion-editor/
    spelling-correction-extension.ts  (Tiptap Decoration extension)

  widgets/admin-spelling-dictionary-page/
    — CRUD page at /[lang]/admin/spelling-dictionary
```

**Permission used:** `CAN_EDIT_TEXTS` — CONTENT, LINGUIST, ADMIN, SUPERADMIN roles can manage the dictionary. Public `GET /api/spelling-dictionary/all` is open (no auth) — same pattern as existing public endpoints.

---

## Step 1 — Backend: Prisma model

**Context brief:** Backend NestJS monorepo at `F:\programming\mott-larbe\mott-larbe-backend`. Prisma schema at `prisma/schema.prisma`. Add a new `SpellingEntry` model. Run migration. No other steps depend on this; start here.

**Permission:** `CAN_EDIT_TEXTS` (already exists in `PermissionCode` enum).

### Tasks

1. Add to `prisma/schema.prisma`:

```prisma
model SpellingEntry {
  id          String   @id @default(uuid())
  wrongForm   String   // the incorrect form to detect (lowercase stored, matching is case-insensitive)
  correctForm String   // the correct form with proper spelling/stress marks
  comment     String?  // optional explanation for the editor
  createdById String?
  createdBy   User?    @relation(fields: [createdById], references: [id], onDelete: SetNull)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([wrongForm])
  @@index([wrongForm])
  @@map("spelling_entries")
}
```

2. Add relation to `User` model: `spellingEntries SpellingEntry[]`

3. Run: `npx prisma migrate dev --name add-spelling-entry`

4. Run: `npx prisma generate`

### Verification
- `npx prisma validate` passes
- Migration file created in `prisma/migrations/`

### Exit criteria
- `SpellingEntry` model exists in DB
- `PrismaService` can query `spellingEntry`

---

## Step 2 — Backend: NestJS module

**Context brief:** Backend at `F:\programming\mott-larbe\mott-larbe-backend\src`. Pattern: `@Controller("admin/spelling-dictionary")` + `@AdminPermission(PermissionCode.CAN_EDIT_TEXTS)` on write endpoints. Public GET uses `@OptionalAuth()` or no guard. See `src/admin/users/` for the exact pattern to copy.

### Tasks

Create `src/admin/spelling-dictionary/` module with:

**`spelling-dictionary.module.ts`**
```ts
@Module({
  controllers: [SpellingDictionaryController],
  providers: [SpellingDictionaryService],
})
export class SpellingDictionaryModule {}
```

**`spelling-dictionary.service.ts`** — inject `PrismaService`, implement:
- `findAll()` → `prisma.spellingEntry.findMany({ orderBy: { wrongForm: 'asc' } })`
- `findAllPublic()` → same, no auth check (used by public endpoint)
- `create(dto, userId)` → `prisma.spellingEntry.create(...)`
- `update(id, dto)` → `prisma.spellingEntry.update(...)`
- `remove(id)` → `prisma.spellingEntry.delete(...)`
- Store `wrongForm` as `.toLowerCase().trim()` always

**`dto/create-spelling-entry.dto.ts`**
```ts
export class CreateSpellingEntryDto {
  @IsString() @MinLength(1) @MaxLength(200) wrongForm: string;
  @IsString() @MinLength(1) @MaxLength(200) correctForm: string;
  @IsOptional() @IsString() @MaxLength(500) comment?: string;
}
```

**`dto/update-spelling-entry.dto.ts`** — `PartialType(CreateSpellingEntryDto)`

**`spelling-dictionary.controller.ts`** — two controllers:
```
@Controller('admin/spelling-dictionary')   ← admin CRUD
@Controller('spelling-dictionary')         ← public GET /all
```

Or one controller with mixed guards. Endpoints:
- `GET  /api/spelling-dictionary/all` — no auth, returns `SpellingEntry[]`  
- `GET  /api/admin/spelling-dictionary` — `@AdminPermission(CAN_EDIT_TEXTS)`, paginated
- `POST /api/admin/spelling-dictionary` — `@AdminPermission(CAN_EDIT_TEXTS)`
- `PATCH /api/admin/spelling-dictionary/:id` — `@AdminPermission(CAN_EDIT_TEXTS)`
- `DELETE /api/admin/spelling-dictionary/:id` — `@AdminPermission(CAN_EDIT_TEXTS)`

Register `SpellingDictionaryModule` in `AppModule`.

### Verification
- `GET /api/spelling-dictionary/all` returns `[]` (200, no auth)
- `POST /api/admin/spelling-dictionary` with admin JWT returns `201`
- `POST /api/admin/spelling-dictionary` with no JWT returns `401`

### Exit criteria
- All 5 endpoints respond correctly
- Duplicate `wrongForm` returns `409` (Prisma unique constraint → catch and rethrow as `ConflictException`)

---

## Step 3 — Frontend: entity `spelling-dictionary`

**Context brief:** Frontend FSD at `src/`. Pattern: entities live in `src/entities/<name>/`. API layer in `api/`, hooks in `model/`, barrel in `index.ts`. TanStack Query v5 with `queryOptions()`. No `any` types. Arrow functions only.

### File structure
```
src/entities/spelling-dictionary/
  api/
    types.ts
    spelling-dictionary-api.ts
    spelling-dictionary-keys.ts
    index.ts
  model/
    use-spelling-dictionary.ts      ← public full list, staleTime 1h
    use-admin-spelling-dictionary.ts ← paginated admin list
    use-spelling-dictionary-mutations.ts
    index.ts
  index.ts
```

**`api/types.ts`**
```ts
export interface SpellingEntry {
  id: string;
  wrongForm: string;
  correctForm: string;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpellingEntryDto {
  wrongForm: string;
  correctForm: string;
  comment?: string;
}

export type UpdateSpellingEntryDto = Partial<CreateSpellingEntryDto>;
```

**`api/spelling-dictionary-keys.ts`**
```ts
export const spellingDictionaryKeys = {
  all: () => ['entities', 'spelling-dictionary', 'all'] as const,
  adminList: (page: number) => ['entities', 'spelling-dictionary', 'admin', page] as const,
} as const;
```

**`api/spelling-dictionary-api.ts`** — `fetch` calls to `/api/spelling-dictionary/all` and `/api/admin/spelling-dictionary`

**`model/use-spelling-dictionary.ts`**
```ts
export const spellingDictionaryQueryOptions = () =>
  queryOptions({
    queryKey: spellingDictionaryKeys.all(),
    queryFn: () => spellingDictionaryApi.getAll(),
    staleTime: 1000 * 60 * 60, // 1 hour — entries change rarely
    gcTime: 1000 * 60 * 60 * 2,
  });

export const useSpellingDictionary = () =>
  useQuery(spellingDictionaryQueryOptions());
```

**`model/use-spelling-dictionary-mutations.ts`** — `useMutation` for create/update/delete, invalidates both `all` and `adminList` keys on success.

### Verification
- `useSpellingDictionary()` returns `{ data: SpellingEntry[] }` type-safe
- No `any` in the entity layer

### Exit criteria
- Entity barrel exports all hooks and types
- TypeScript compiles without errors in this slice

---

## Step 4 — Frontend: Tiptap spelling correction extension

**Context brief:** `src/shared/ui/notion-editor/` contains Tiptap extensions. Pattern: `Extension.create({ name, addCommands, addKeyboardShortcuts })` or `Mark.create()`. For decorations (highlights), use `addProseMirrorPlugins()` with `DecorationSet`. Import from `framer-motion` not `motion/react`. No `any`.

The extension must:
1. Accept `entries: SpellingEntry[]` as configuration
2. Scan all text in the doc for `wrongForm` matches (case-insensitive, substring)
3. Apply a Decoration (underline + color) to each match
4. Expose a command `applySpellingFix(from, to, wrongText, correctForm)` that replaces the matched substring while preserving surrounding text and applying case-matching

### File
```
src/shared/ui/notion-editor/spelling-correction-extension.ts
```

**Key algorithm for case-preserving replacement:**

```ts
const applyCasePreserving = (original: string, correct: string): string => {
  // "Вахнера" + "вахне́ра" → "Вахне́ра"
  if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
    return correct[0].toUpperCase() + correct.slice(1);
  }
  if (original === original.toUpperCase()) return correct.toUpperCase();
  return correct; // lowercase or mixed — use correct as-is
};
```

**Scan algorithm:**
- Walk all text nodes in the doc
- For each `SpellingEntry`, search for `wrongForm` (case-insensitive) as substring in node text
- Record absolute position `{ from, to, entry, matchedText }` for each hit
- Build `DecorationSet` with inline decorations: `class="spelling-correction"` + `data-entry-id`

**Commands:**
```ts
applySpellingFix: (from: number, to: number, original: string, correctForm: string) => ...
```
Replaces `[from, to]` range with `applyCasePreserving(original, correctForm)`.

**Extension configuration** (reconfigurable when entries change):
```ts
export const SpellingCorrectionExtension = Extension.create({
  name: 'spellingCorrection',
  addOptions() { return { entries: [] as SpellingEntry[] }; },
  addCommands() { ... },
  addProseMirrorPlugins() { ... },
});
```

Parent passes `entries` via `editor.extensionManager.extensions.find(...).options.entries = newEntries` or by using `Reconfigure`.

### CSS in `notion-editor.tsx` existing classname string:
Add: `[&_.tiptap_.spelling-correction]:border-b-2 [&_.tiptap_.spelling-correction]:border-amber-400 [&_.tiptap_.spelling-correction]:cursor-pointer [&_.tiptap_.spelling-correction]:transition-colors [&_.tiptap_.spelling-correction]:hover:bg-amber-50`

### Export from `src/shared/ui/notion-editor/index.ts`
```ts
export { SpellingCorrectionExtension } from './spelling-correction-extension';
```

### Verification
- Text "вахнера" with entry `{ wrongForm: "вахнера", correctForm: "вахне́ра" }` gets decoration
- Text "Вахнера" (capital) also gets decoration
- `applySpellingFix` on "Вахнера" produces "Вахне́ра"
- Partial match: "д1аала" with entry `{ wrongForm: "аала", correctForm: "а́ла" }` highlights only "аала" portion

### Exit criteria
- Extension registered, TypeScript clean
- Decorations appear correctly in dev server

---

## Step 5 — Frontend: feature `spelling-correction`

**Context brief:** Features live in `src/features/<name>/`. One component per file. Logic in `model/` hooks, UI in `ui/`. This feature owns the popup that appears when user hovers/clicks a highlighted word.

### File structure
```
src/features/spelling-correction/
  model/
    use-spelling-correction-popup.ts   ← popup open/close state, position
  ui/
    spelling-correction-popup.tsx      ← the floating popup component
  index.ts
```

**`use-spelling-correction-popup.ts`**
```ts
interface PopupState {
  isOpen: boolean;
  anchorRect: DOMRect | null;
  from: number;
  to: number;
  matchedText: string;
  entry: SpellingEntry;
}

export const useSpellingCorrectionPopup = () => {
  const [popup, setPopup] = useState<PopupState | null>(null);
  const handleOpen = (state: PopupState) => setPopup(state);
  const handleClose = () => setPopup(null);
  const handleApplyFix = (editor: Editor) => {
    if (!popup) return;
    editor.commands.applySpellingFix(popup.from, popup.to, popup.matchedText, popup.entry.correctForm);
    handleClose();
  };
  return { popup, handleOpen, handleClose, handleApplyFix };
};
```

**`spelling-correction-popup.tsx`**
- Renders via `createPortal` to `document.body`
- Positioned below the decoration using `anchorRect`
- Shows: wrong form (strikethrough) → correct form (bold), optional comment, "Исправить" button
- `AnimatePresence` + `motion.div` with `springs.snappy` (import from `@/shared/lib/animation`)
- Closes on `Escape` (use `useEscapeToClose` from `shared/lib/escape-to-close`)
- Closes on click outside
- Accessible: `role="tooltip"`, `aria-live="polite"`
- Mobile: positions above viewport bottom with safe offset

### Popup design
```
┌─────────────────────────────────┐
│ ~~вахнера~~  →  вахне́ра        │
│ Необязательный комментарий      │
│              [Исправить]        │
└─────────────────────────────────┘
```

### Verification
- Popup opens on click of highlighted text
- "Исправить" calls `applySpellingFix` and closes popup
- Popup closes on Escape and click-outside
- Renders correctly on mobile (no overflow)

### Exit criteria
- Component renders without errors
- No TypeScript errors

---

## Step 6 — Frontend: wire correction into editor (parallel with Step 7)

**Context brief:** `src/shared/ui/admin-text-editor/admin-text-editor-shell.tsx` composes the editor. `src/widgets/admin-text-create/ui/text-create-editor.tsx` and `src/widgets/admin-text-edit/ui/text-edit-editor.tsx` are the consumers. `NotionEditor` in `src/shared/ui/notion-editor/notion-editor.tsx` accepts `extraExtensions`.

### Tasks

1. In `AdminTextEditorShell` — add prop `spellingEntries?: SpellingEntry[]`, pass to `NotionEditor` via `extraExtensions`:
```ts
SpellingCorrectionExtension.configure({ entries: spellingEntries ?? [] })
```

2. In `text-create-editor.tsx` and `text-edit-editor.tsx`:
```ts
const { data: spellingEntries = [] } = useSpellingDictionary();
```
Pass `spellingEntries` down to `AdminTextEditorShell`.

3. In `NotionEditor` — handle clicks on `.spelling-correction` elements:
```ts
// in editorProps.handleClick or via a ProseMirror plugin
// detect click on decoration, find entry by data-entry-id, open popup
```
Pass `onSpellingClick` callback from shell → editor → extension.

4. Render `SpellingCorrectionPopup` inside `TextCreateEditor` / `TextEditEditor`:
```tsx
<SpellingCorrectionPopup
  popup={popup}
  onClose={handleClose}
  onApplyFix={() => handleApplyFix(editorRef.current)}
/>
```

5. When `spellingEntries` changes (after 1h cache refresh), call:
```ts
editor.commands.reloadSpellingEntries(newEntries);
```

### Verification
- Open `/admin/texts/create`, paste text with "вахнера"
- Word gets amber underline
- Click → popup appears with correction
- "Исправить" → word changes to "вахне́ра"
- `д1аала` → only "аала" underlined, fix changes only that part

### Exit criteria
- End-to-end flow works in dev server
- No console errors
- Existing phrase/annotation highlights still work (no z-index conflicts)

---

## Step 7 — Frontend: admin dictionary management page (parallel with Step 6)

**Context brief:** Admin pages live in `src/widgets/admin-*-page/` and are routed from `src/app/[lang]/admin/`. New route: `/[lang]/admin/spelling-dictionary`. Navigation config location: check memory — see `project-admin-pages.md`.

### File structure
```
src/widgets/admin-spelling-dictionary-page/
  model/
    use-admin-spelling-dictionary-page.ts
  ui/
    admin-spelling-dictionary-page.tsx    ← main layout
    spelling-entry-list.tsx               ← table of entries
    spelling-entry-form-modal.tsx         ← create/edit modal
    spelling-entry-delete-modal.tsx       ← confirm delete
    spelling-entry-row.tsx                ← single table row
  index.ts
```

**Page features:**
- Table: `wrongForm` | `correctForm` | `comment` | actions (edit, delete)
- Search/filter by wrongForm (client-side, no extra requests)
- "Добавить слово" button → opens create modal
- Edit row → opens edit modal prefilled
- Delete → confirm modal
- Validation: `wrongForm` required, unique; `correctForm` required
- Empty state illustration + CTA

**Route:** `src/app/[lang]/admin/spelling-dictionary/page.tsx`
```tsx
export default async function SpellingDictionaryPage({ params }) {
  const { lang } = await params;
  return <AdminSpellingDictionaryPage lang={lang} />;
}
export const generateMetadata = ...
```

**Add to admin navigation** (check existing nav config file from memory).

**i18n keys needed** (add to `ru.json`, `en.json`, `che.json`):
```json
"spellingDictionary": {
  "title": "Словарь написания",
  "addEntry": "Добавить слово",
  "wrongForm": "Неправильное написание",
  "correctForm": "Правильное написание",
  "comment": "Комментарий",
  "editEntry": "Редактировать",
  "deleteEntry": "Удалить",
  "confirmDelete": "Удалить запись?",
  "confirmDeleteBody": "Запись «{form}» будет удалена.",
  "saveEntry": "Сохранить",
  "createSuccess": "Запись добавлена",
  "updateSuccess": "Запись обновлена",
  "deleteSuccess": "Запись удалена",
  "emptyState": "Словарь пуст",
  "emptyStateSub": "Добавьте первое слово",
  "searchPlaceholder": "Поиск по написанию…",
  "wrongFormHint": "Написание, которое нужно исправить",
  "correctFormHint": "Правильное написание с ударением"
}
```

### Verification
- `/admin/spelling-dictionary` loads with empty table
- Create entry → appears in table
- Edit entry → form prefilled, saves correctly
- Delete entry → removed from table
- Entry immediately visible in editor (after cache invalidation)

### Exit criteria
- Page accessible only to users with `CAN_EDIT_TEXTS`
- CRUD fully functional
- i18n keys in all 3 locales

---

## Step 8 — Polish & edge cases

**Context brief:** Final integration step. No new files — only fixes and refinements.

### Tasks

1. **Performance guard:** if `spellingEntries.length > 500`, debounce decoration scan by 100ms to avoid blocking the main thread during rapid typing. Use `requestIdleCallback` with fallback `setTimeout`.

2. **Overlapping matches:** if a text range is already decorated by `PhraseHighlightExtension` or `WordAnnotationHighlightExtension`, skip spelling decoration for that range to avoid visual conflicts.

3. **Editor-only:** `SpellingCorrectionExtension` must only activate when `spellingEntries.length > 0`. If dictionary is empty, extension is a no-op (no decorations, no click handlers).

4. **Accessibility:**
   - Highlighted spans get `title` attribute = `correctForm` for keyboard users who can't use the popup
   - Popup is reachable by keyboard: `Tab` → "Исправить" button → `Enter`

5. **Mobile popup:** on screens < 640px, popup renders as a bottom sheet anchored to bottom of screen rather than floating near the word.

6. **Cache prefetch on admin pages:** prefetch `spellingDictionaryQueryOptions()` in the RSC page component of admin text create/edit so the client gets it instantly from dehydrated state.

7. **Update `MEMORY.md`** with entry pointing to this plan.

### Verification
- TypeScript clean: `npx tsc --noEmit` → 0 errors in new files
- Dev server runs without console errors
- Popup accessible by keyboard
- Mobile layout correct on 375px viewport

### Exit criteria
- All steps integrated without regressions
- Existing phrase/annotation/spelling-mark features still work

---

## Dependency Graph

```
Step 1 (DB model)
  └─ Step 2 (NestJS module)
       └─ Step 3 (FE entity)
            └─ Step 4 (Tiptap extension)
                 └─ Step 5 (FE feature popup)
                      ├─ Step 6 (wire into editor)  ┐ parallel
                      └─ Step 7 (admin CRUD page)   ┘
                           └─ Step 8 (polish)
```

## Files Changed Per Step

| Step | Backend files | Frontend files |
|------|--------------|----------------|
| 1 | `prisma/schema.prisma`, migration | — |
| 2 | `src/admin/spelling-dictionary/**` | — |
| 3 | — | `src/entities/spelling-dictionary/**` |
| 4 | — | `src/shared/ui/notion-editor/spelling-correction-extension.ts`, `notion-editor/index.ts` |
| 5 | — | `src/features/spelling-correction/**` |
| 6 | — | `admin-text-editor-shell.tsx`, `text-create-editor.tsx`, `text-edit-editor.tsx`, `notion-editor.tsx` |
| 7 | — | `src/widgets/admin-spelling-dictionary-page/**`, `src/app/[lang]/admin/spelling-dictionary/page.tsx`, locales |
| 8 | — | Polish across steps 4–7 |

## Rollback

Each step is independently reversible:
- Steps 1–2: `prisma migrate reset` / delete module + remove from AppModule
- Steps 3–7: delete the new FSD slices; no existing code is modified until Step 6
- Step 6 modifications are additive (new props with defaults) — removing them restores prior state
