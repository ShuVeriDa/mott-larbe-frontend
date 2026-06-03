# User Content Submission Plan
Status: READY
Created: 2026-06-03
Steps: 12

> Executed by fresh agents who have not seen the planning conversation. Each step's **Context brief** is self-contained — read it plus the listed files and you can execute the step cold. Read `AGENTS.md` and `CLAUDE.md` at repo root before writing any frontend code; this is **Next.js 16.2.5 / React 19.2.4** and APIs differ from earlier versions.

---

## Version constraints (apply to ALL frontend steps — read once)

**React 19.2.4:**
- No `forwardRef` — `ref` is a regular prop.
- No `useMemo`/`useCallback` for performance — React Compiler handles memoization automatically. Exception: semantically stable refs or computations > 10k items.
- No `React.FC`, no `React.*` namespace — use named imports (`import { useState, useRef } from "react"`).
- Forms: use `useActionState(action, initialState)` instead of multiple `useState` for form state + `useFormStatus()` inside submit button child.
- Optimistic UI: `useOptimistic()` — never for payments/destructive deletes.
- Context: prefer `use(ctx)` over `useContext(ctx)`.
- Server Components are the default — add `'use client'` only when hooks or event handlers are needed. Never `'use client'` on a layout.
- `'use server'` marks Server Actions only — never put it on a Server Component file.

**Next.js 16.2.5:**
- Before writing routing, metadata, or caching code: check `node_modules/next/dist/docs/` — APIs differ from earlier versions.
- Metadata: export `generateMetadata` (async function) or static `metadata` object per page. Required fields: `title`, `description`, `openGraph`, `alternates` with canonical + hreflang `che`/`ru`/`en`. Check the exact `Metadata` type shape in `node_modules/next/dist/types`.
- Routing: App Router only (`src/app/`). File conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`. Dynamic segments: `[lang]`, `[id]`.
- Data fetching in Server Components: `async/await` directly — no hooks.
- `loading.tsx` is an automatic Suspense boundary for the route segment.
- Images: `next/image` with explicit `width`/`height`. Links: `next/link`. Never bare `<img>` or `<a>` for internal nav.
- Server Actions: `'use server'` in `api/` layer files, not in component files.

## Performance, Security & SEO standards (apply to ALL steps — read once)

### Backend — apply in Steps 1–4

**Performance & Optimization:**
- All Prisma queries on lists MUST include `take`/`skip` (pagination) and `orderBy`. Never `findMany` without a limit.
- Index coverage: every column used in `where` filters must have `@@index`. `UserText`: `userId` ✓ (in schema). `TextSubmission`: confirm `userId` index exists for the new owner-scoped GETs.
- Select only needed fields: use `select: { id, title, ... }` on list endpoints — never return full `content Json` / `contentRich Json` in list responses (these can be kilobytes). Return the full content only on single-item GETs.
- Avoid N+1: use Prisma `include` (e.g. `user: { select: { id, name, username } }`) in one query, not separate calls.
- Redis throttle: the existing global rate-limit (100 req/60s) covers new endpoints automatically. No extra config needed unless a specific endpoint is abuse-prone (e.g. `POST /:id/submit` could be rate-limited more aggressively — add `@Throttle` if the reviewer deems it necessary).

**Security:**
- Every owner-scoped endpoint MUST check `submission.userId === userId` (or use `where: { id, userId }` in Prisma — prefer the Prisma form as it is atomic). Never trust the client-sent userId for writes.
- DTO validation: `ValidationPipe` is global (whitelist + forbidNonWhitelisted). DTOs MUST use `@IsString()`, `@IsEnum()`, `@IsOptional()`, etc. — never accept raw untyped objects.
- `contentRich` is a TipTap JSON blob stored as `Json`. Do NOT eval or execute it server-side. Sanitization of rendered HTML is the frontend's responsibility (the renderer must escape / not use `dangerouslySetInnerHTML` without a sanitizer).
- `sourceUrl`: validate with `@IsUrl()` + `@ValidateIf` (guard against empty string — see m3 fix). Reject URLs with `file://`, `javascript:`, `data:` schemes implicitly via `@IsUrl()`.
- `publicationYear`: `@IsInt()` + `@Min(1000)` + `@Max(currentYear)` — prevent absurd values.
- Never log PII (user names, emails) in error messages. Use `userId` (UUID) in logs only.
- Swagger docs at `/api/docs` are already disabled in production — do NOT change that.

**Best Practices:**
- Follow existing module structure: controller → service → module. No business logic in controllers.
- Throw `NotFoundException` / `ForbiddenException` / `BadRequestException` using NestJS built-ins + the existing `ErrorCode` enum for machine-readable codes.
- Use `@ApiTags`, `@ApiOperation`, `@ApiBearerAuth` on all new controllers for Swagger consistency.
- Add `@ApiResponse` decorators for the main success + error shapes.
- **TypeScript strict mode:** the backend already runs with strict settings — never use `any`, never cast with `as any`. Use `unknown` and narrow types explicitly.
- **Connection pooling:** the backend uses `@prisma/adapter-pg` with a pg connection pool. Do NOT create additional PrismaClient instances — always inject `PrismaService` (singleton). Unhandled parallel queries on a small pool cause timeouts.
- **Concurrent edit conflicts (optimistic locking):** `PATCH /user-texts/:id` and `PATCH /text-submissions/:id` do not need full optimistic locking for this feature, but services must check the owner's `status` guard atomically within the same `prisma.update({ where: { id, userId, status: { in: [...] } } })` — if the row has been concurrently moved to `APPROVED`, Prisma returns 0 updated rows → throw `TEXT_SUBMISSION_NOT_EDITABLE`. Never fetch-then-update in two separate calls.
- **UserEvent audit:** on `POST /:id/submit` (DRAFT → PENDING), consider emitting a `UserEvent` of type relevant to content submission (check existing `UserEvent` types in the schema). If no matching type exists, skip — do not invent a new enum value here; that is a separate task.
- **Response shape consistency:** all paginated list responses MUST use the existing `{ data: T[], meta: { total, limit, offset } }` shape — match `getMySubmissions` return shape exactly.

---

### Frontend — apply in Steps 5–11

---

#### CLAUDE.md rules (mandatory — apply to every frontend file without exception)

All rules from `CLAUDE.md` apply unconditionally. Key points that are most likely to be violated:

- **Arrow functions everywhere** — never `function` declarations for components, hooks, or utilities.
- **One component per file** — `react/no-multi-comp` enforced. Props interface stays in the same file as its component; all other shared types go to `model/types.ts`.
- **Logic in hooks, JSX in components** — all state, effects, derived data, and handlers live in `model/use-*.ts`. Components return JSX only.
- **Named `handle*` handlers** — never inline anonymous functions in JSX (`onClick={() => ...}`). Always extract to named `handle*` inside the hook or component body. This includes inside `.map()` — see feedback memory.
- **`e.currentTarget` not `e.target`** in all event handlers.
- **Named exports everywhere** — default exports only in `app/` page/layout files.
- **No `useMemo`/`useCallback`** for performance — React Compiler handles it. No `forwardRef` — ref is a regular prop.
- **No bare HTML** — never `<button>`, `<input>`, `<a>`, `<img>` directly in feature/widget JSX. Always check `shared/ui` first.
- **FSD import direction** — `app → widgets → features → entities → shared`. Import only through barrel `index.ts`, never deep paths.
- **`use(ctx)` not `useContext`**, **`useActionState`** for forms, **`useFormStatus`** inside form child only.
- **Tailwind CSS v4 only** — no inline styles. Use `cn()` for conditional classes, CVA for component variants.
- **All user-facing strings localized** — no hardcoded text in components.
- **No `any`** — use `unknown` + type guards.
- **Group files by purpose, not technical type** — no folders named `hooks/`, `utils/`, `helpers/` inside `lib/` or `model/`.

---

#### Design system (verified against existing codebase — apply to ALL new UI)

Match the existing visual language exactly. Do not invent new patterns.

**Color tokens (use these, never raw Tailwind colors):**
- Backgrounds: `bg-surf`, `bg-surf-2`, `bg-surf-3`
- Text: `text-t-1` (primary), `text-t-2` (secondary), `text-t-3` (muted), `text-t-4` (placeholder/icons)
- Borders: `border-bd-1`, `border-bd-2`
- Accent: `bg-acc`, `text-acc`

**Status badge colors (match existing `TextSubmissionStatusBadge` exactly):**
- `DRAFT`: `bg-surf-2 text-t-3 dark:bg-surf-3` (neutral — not submitted yet)
- `PENDING`: `bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`
- `APPROVED`: `bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`
- `REJECTED`: `bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`

**Status left bar on cards (match `MyTextSubmissionCard`):**
- `DRAFT`: `bg-surf-3`
- `PENDING`: `bg-yellow-400`
- `APPROVED`: `bg-green-500`
- `REJECTED`: `bg-red-400`

**Card anatomy (match `MyTextSubmissionCard` structure):**
```tsx
<article className="flex overflow-hidden rounded-xl border border-bd-1 bg-surf">
  {/* left status bar */}
  <div className="w-1 shrink-0 bg-<status-color>" />
  {/* content */}
  <div className="flex flex-1 flex-col gap-2.5 px-4 py-3.5">
    {/* title: text-[13px] font-medium text-t-1 font-display */}
    {/* meta: text-[11.5px] text-t-3, items separated by · */}
    {/* status badge: rounded-full px-2 py-0.5 text-[11px] font-medium */}
  </div>
</article>
```

**Typography sizes used in the project:**
- Page/section title (`<h1>`): `text-[13.5px] font-semibold text-t-1`
- Card title: `text-[13px] font-medium text-t-1 font-display`
- Meta / secondary: `text-[11.5px] text-t-3`
- Label / badge: `text-[11px]` or `text-[12px] font-medium`
- Body / form labels: `text-[12.5px]` or `text-[13px]`

**Page layout (match `suggestions-page` and `feedback` pages):**
```tsx
<div className="flex h-full flex-col overflow-hidden">
  {/* topbar */}
  <header className="flex shrink-0 items-center gap-3 border-b border-bd-1 bg-surf px-[22px] py-3 max-sm:px-4">
    <h1 className="text-[13.5px] font-semibold text-t-1">...</h1>
  </header>
  {/* two-column body (desktop) / stacked (mobile) */}
  <div className="relative flex flex-1 overflow-hidden">
    {/* left: w-[300px] shrink-0 border-r border-bd-1 bg-surf overflow-y-auto */}
    {/* right: flex-1 border-l border-bd-1 bg-surf (detail/editor panel) */}
  </div>
</div>
```

**Tab pattern (use existing `shared/ui` Tabs — `<TabBar>` + `<TabItem>`):**
- Root: `<Tabs>` (flex flex-col)
- Bar: `gap-[2px] p-[3px] bg-surf-2 rounded-[8px]`
- Item: `px-[14px] py-[5px] rounded-[6px] text-[12px]`
- If `shared/ui/tabs` exists, use it. Fallback: custom buttons wrapped in `gap-[2px] rounded-[8px] border border-bd-1 bg-surf-2 p-[3px]`

**Empty state (match `ReviewPanelEmpty` / `AdminListColumn` empty):**
```tsx
<div className="flex flex-col items-center px-4 py-12 text-center">
  <Inbox className="mb-3 size-8 text-t-4" />
  <p className="text-[12.5px] text-t-3">{t("myTexts.empty")}</p>
  {/* CTA button below for actionable empty states */}
</div>
```

**Loading skeleton (match `ReviewListItemSkeleton`):**
```tsx
<div className="border-b border-bd-1 px-3 py-2.5 last:border-b-0">
  <div className="mb-1.5 h-3 w-2/3 animate-pulse rounded bg-surf-3" />
  <div className="h-2.5 w-1/2 animate-pulse rounded bg-surf-3" />
</div>
```
Card-level skeleton: `h-[96px] animate-pulse rounded-xl border border-bd-1 bg-surf-2`

**Nav item for `/my-texts` (add to `nav.contribute` section in `nav-config.ts`):**
```tsx
{ href: (lang: string) => `/${lang}/my-texts`, icon: Library, labelKey: "nav.myTexts" }
```
Icon: `Library` from `lucide-react` (represents personal text collection; distinct from existing `BookPlus` and `BookOpen`).

**Border radius:**
- Cards: `rounded-xl`
- Buttons/badges: `rounded-card` or `rounded-[6px]`
- Tab bars: `rounded-[8px]`
- Tab items: `rounded-[6px]`
- Pills (status): `rounded-full`

**Spacing patterns:**
- Topbar padding: `px-[22px] py-3` (desktop), `px-4` (mobile via `max-sm:px-4`)
- Card content padding: `px-4 py-3.5`
- List item padding: `px-3 py-2.5`
- Empty state vertical padding: `py-12`
- Section gaps: `gap-2`, `gap-2.5`, `gap-3`

---

**Performance:**
- Server Components by default — push `'use client'` to the lowest possible leaf. A Server Component that fetches data eliminates a client-side waterfall entirely.
- Prefetch detail queries server-side (`queryClient.prefetchQuery`) in `[id]` and `[id]/edit` page server components so the page is hydrated on arrival (Step 10).
- `staleTime` on all queries: user-text list → `60_000` (1 min); detail → `120_000` (2 min); submission detail → `30_000` (30 s, since draft state changes frequently). Never leave `staleTime: 0` (causes refetch on every mount).
- Never import the TipTap editor (NotionEditor) on pages where it is not needed — it is heavy. Editor routes and reader routes are separate pages; the reader never imports the editor bundle.
- `next/image` for any cover or avatar images: always explicit `width`/`height`; use `sizes` prop for responsive images. No raw `<img>`.
- `next/link` for all internal navigation. No raw `<a>`.
- `loading.tsx` skeleton screens — all six route segments (Step 10). Skeletons must match the layout dimensions of the real content to avoid layout shift (CLS = 0).

**Security:**
- TipTap read-only renderer (`render-rich-content`): verify it does NOT use raw `dangerouslySetInnerHTML` without DOMPurify or equivalent. If it does, add a sanitization step before rendering. User-submitted content MUST be treated as untrusted.
- Owner-scope on the client: after fetching a draft (`useOwnedTextSubmission`), if the returned `submission.userId !== currentUserId`, redirect to `/my-texts` — double-check even though the backend already enforces this (defense in depth).
- No sensitive data in URL params: `?from=<userTextId>` is fine (UUID only, no content). Never put tokens, emails, or names in query strings.
- CSRF: the existing Axios config sends `X-Requested-With: XMLHttpRequest` on all requests — new API calls use the same `http` client, so CSRF is covered automatically.
- Form inputs: use controlled components with the existing `Input`/`Textarea` from `shared/ui` — these already apply proper escaping in rendering.

**SEO (for public-facing routes only — Steps 9–10):**
- Private `/my-texts/**` routes: `robots: { index: false, follow: false }` in `generateMetadata` — these pages must NOT appear in search results.
- Sitemap: exclude all `/my-texts/**` paths from `src/app/sitemap.ts`.
- Semantic HTML: `<main>`, `<article>`, `<section>`, `<h1>`–`<h6>` hierarchy. One `<h1>` per page. The list page title is an `<h1>`; card titles are `<h3>` (or `<h2>` if no section heading above).
- `alternates.canonical` + `hreflang` are required in every `generateMetadata` — even for noindexed private pages (canonical prevents duplicate-content issues if the page is ever unindexed).
- Open Graph: `og:title`, `og:description`, `og:type: "website"`. No OG image needed for private pages.

**Accessibility (UX best practices):**
- All interactive elements (buttons, tabs, cards with onClick) must have keyboard focus styles and ARIA labels where the visible label is absent.
- Delete/submit confirm dialogs: use `shared/ui/dialog` or `AlertDialog` — never `window.confirm()`.
- Tab panel content: use `role="tabpanel"` + `aria-labelledby` matching the tab button id.
- Touch targets: minimum 44×44px for all interactive elements (cards, buttons, tab triggers).
- Error states: form field errors displayed next to the field, not just in a toast.

**Error boundaries & resilience:**
- Every route segment MUST have both a `loading.tsx` (Suspense) AND an `error.tsx` (ErrorBoundary) file. `loading.tsx` handles async waits; `error.tsx` handles thrown errors and failed queries. Without `error.tsx`, a failed fetch crashes the whole route to a white screen.
- `error.tsx` must export a default `'use client'` component receiving `{ error, reset }` props — show a localized error message + a "Try again" button that calls `reset()`.

**TypeScript:**
- No `any` anywhere in new frontend code. Use `unknown` + type guards, or narrow with `as` only when the shape is guaranteed (e.g. Prisma-typed responses).
- `TipTapDoc` from `@/shared/ui/notion-editor` is the canonical type for TipTap JSON. Never use `object` or `Record<string, unknown>` as a substitute.

**Auto-save (editor UX):**
- The `UserTextEditorForm` (Step 7) and `SubmissionEditorForm` (Step 8) should auto-save the draft periodically (debounced, every ~30s of inactivity) using `useUpdateUserText` / `useUpdateTextSubmission` mutations. This prevents data loss if the user navigates away or the tab crashes. Show a subtle "Saved" / "Saving…" indicator — not a toast for every auto-save. Implement with a `useDebounce` hook (check `shared/lib/debounce/`) on the content state.

**Network resilience:**
- TanStack Query already retries failed queries 3 times by default. For **mutations** (create, update, submit), set `retry: 0` — do not silently retry write operations, as they may have partially succeeded. On mutation error, show a clear error message and let the user decide to retry.
- On `POST /:id/submit`, if the network drops mid-request, the user must not be left in an ambiguous state. After error, re-fetch the submission status (`invalidateQueries`) before showing the error toast — so the UI reflects the actual server state.

---

## Glossary & top-level decisions (read once)

Two distinct objects, do NOT conflate them:

| Object | Visibility | Moderation | Stored as |
|---|---|---|---|
| **UserText** | private to its owner | none | new `user_text` table |
| **TextSubmission** | submitted for publication | admin reviews | existing `text_submission` table (extended) |

Agreed architecture (do not redesign):

1. **UserText and TextSubmission are separate rows.** "Submit for publication" from a UserText *copies* its fields into a new TextSubmission. The original UserText is never mutated or deleted by submission.
2. **Author for `ORIGINAL` type = the user's own name, set server-side, not editable in the form.** For `EXTERNAL` the author field is free text and required.
3. Admin approves a TextSubmission via the **existing** admin moderation UI (`widgets/admin-text-submissions-page`). Approval is where a real library `Text` gets created — that flow already exists and is **out of scope** here except for the schema/DTO additions in Steps 1–4 that the admin UI must surface (Step 11).
4. **TipTap rich text** for `UserText.content` and `TextSubmission.contentRich`, stored as JSON (same shape as `TextPage.contentRich`). The reusable editor lives at `src/shared/ui/notion-editor`.
5. On admin **reject with comment**, the TextSubmission status goes `REJECTED`; the user may edit and **resubmit** — see the **state machine** below (Step 2 preamble). Follow it exactly.

### DECISION C2 — `content` vs `contentRich` (the fallback rule — referenced by EVERY read step)

State once here, every step references this:

- **`TextSubmission.content String? @db.Text`** stays UNTOUCHED for backward compatibility. Do not change its type, do not drop it. Old submissions and the existing admin UI rely on it.
- A NEW column **`contentRich Json?`** is added for TipTap rich content written by the new flow.
- **THE FALLBACK RULE (read-side, mandatory everywhere):** any code that *renders* or *reads* a submission's body MUST try `contentRich` first; if `contentRich` is `null`/absent, render the plain `content` string as plain text (escaped). Never assume one or the other exists. This applies to: Step 9 (reader/detail), Step 11 (admin panel). Reference this rule by name — "the C2 fallback rule".
- `UserText` is new and has no legacy content, so it uses a single non-null `content Json` (TipTap). No fallback needed for UserText itself.

### DECISION C3 — ORIGINAL author derivation (server-side, the shared `create` endpoint)

The existing `POST /text-submissions` `create` is shared by old and new clients. New rule, enforced in the **service** (Step 4 — `TextSubmissionsService.create` and `.submit`):

- If `dto.submissionType === "ORIGINAL"`: backend **IGNORES** `dto.author` and derives `author = user.name + " " + user.surname` (fetch the user by `userId`; trim; if `surname` is null/empty use `name` alone).
- If `dto.submissionType === "EXTERNAL"` **or `submissionType` is absent** (old clients that never send it): use `dto.author` exactly as before. This preserves backward compatibility for existing callers.
- The same derivation rule applies to `UserText` (Step 3 service) for `type === "ORIGINAL"`.

### Naming caution (verified during planning)
The schema already contains `UserTextProgress`, `UserTextBookmark`, `UserTextHighlight`, `UserTextNote` (these relate to the **library** `Text`, NOT to the new feature). There is **no** `model UserText` yet, so the name is free, but it is conceptually adjacent. Use the model name **`UserText`** exactly as specified, map it to table **`user_text`**, and when adding the relation to `User` use a clear relation name `@relation("UserOwnedTexts")` to avoid Prisma ambiguity with the existing `UserText*` relations. Double-check `prisma format`/`validate` passes (Step 1 verification) precisely because of this adjacency.

### Repo facts (VERIFIED against source on 2026-06-03)
- Backend: `F:\programming\mott-larbe\mott-larbe-backend`. Schema: `prisma/schema.prisma`. Migrations are **sequential numbered folders** (`0001_…`); create the next via `npm run migrate:dev -- --name <name>`. Client regen: `npm run prisma:generate`.
- `enum TextSubmissionStatus` = `PENDING | APPROVED | REJECTED` (no DRAFT yet). `TextPage.contentRich` is `Json` — the canonical TipTap-JSON shape.
- Backend module `src/text-submissions/`. **VERIFIED current controller endpoints:**
  - `POST /text-submissions` — `@Auth()`, `create(userId, dto)`. **Verified service behavior:** throws `TEXT_SUBMISSION_SOURCE_REQUIRED` unless `dto.sourceUrl || dto.content`; writes `userId,title,language,author,sourceUrl,content,comment`; uses `dto.author` directly (NO author derivation today).
  - `GET /text-submissions/my` — `@Auth()`, `getMySubmissions(userId, limit, offset)`. **No status filter today.**
  - `GET /text-submissions/stats` — `@AdminPermission(CAN_MANAGE_SUGGESTIONS)`, returns `{total,pending,approved,rejected}`. (Stats endpoint EXISTS — no need to add it.)
  - `GET /text-submissions` — admin list with `status/limit/offset/order/q`.
  - `GET /text-submissions/:id` — **ADMIN-ONLY** (`findOne(id)`, no ownership check). Owners currently CANNOT load a single submission. Step 4 fixes this.
  - `POST /text-submissions/:id/review` — admin approve/reject. `review()` requires status `PENDING`, else throws `TEXT_SUBMISSION_ALREADY_REVIEWED`; sets `status, reviewedBy, reviewedAt, reviewComment`.
  - **No PATCH, DELETE, or `/submit` endpoints exist.** They must be ADDED in Step 4.
- Auth decorators: `@Auth()` (logged-in), `@AdminPermission(PermissionCode.CAN_MANAGE_SUGGESTIONS)` (admin). `@User("id")` injects userId. Error codes: `src/common/errors/error-codes.ts` (`ErrorCode` enum) — existing: `TEXT_SUBMISSION_NOT_FOUND`, `TEXT_SUBMISSION_ALREADY_REVIEWED`, `TEXT_SUBMISSION_INVALID_STATUS`, `TEXT_SUBMISSION_SOURCE_REQUIRED`. PrismaService: `import { PrismaService } from "src/prisma.service"`.
- DTOs: `src/text-submissions/dto/create-text-submission.dto.ts`, `review-text-submission.dto.ts`. `ReviewTextSubmissionDto` has `decision: "approve"|"reject"` + `reviewComment?`.
- Frontend: `F:\programming\mott-larbe\mott-larbe-frontend`. FSD `app → widgets → features → entities → shared`. HTTP: `import { http } from "@/shared/api"`. i18n: `useI18n()` from `@/shared/lib/i18n` (client), `getDictionary(lang)` from `@/i18n/locales` (server). Toast: `useToast()` from `@/shared/lib/toast`. Locales: `src/locales/{che,ru,en}.json`.
- **VERIFIED frontend feature `src/features/text-submission/`** (`api.ts`, `queries.ts`, `types.ts`, `index.ts`). `api.ts` (verified) exposes `textSubmissionsApi.create/getMine/getStats/getAll/getById/review`. NOTE: existing `getById` calls the **admin** `GET /:id` endpoint — for the owner draft-load flow Step 6 adds a SEPARATE `getOwnedById` calling the new owner endpoint (Step 4). Reuse and extend, do NOT recreate or rename.
- Existing widgets: `src/widgets/suggest-text-page/` (plain-form create), `src/widgets/suggestions-page/` (MyTextSubmissionsTab), `src/widgets/admin-text-submissions-page/` (admin moderation).
- TipTap editor: `src/shared/ui/notion-editor/notion-editor.tsx`, types `TipTapDoc`, `TipTapNode`, props `NotionEditorProps`. Read-only renderer: `src/entities/text/lib/render-rich-content/`.
- Main nav config: `src/widgets/app-shell/lib/nav-config.ts` — `buildNavSections(lang)`; `nav.contribute` section already has `/suggestions`. Icons from `lucide-react`.
- Routes under `src/app/[lang]/(main)/`. Each page: `generateMetadata` (title/description/openGraph/`alternates` canonical + hreflang che/ru/en) + thin default-export server component that `notFound()`s on `!hasLocale(lang)`. Reader example: `src/app/[lang]/(main)/reader/[textId]/p/[pageNumber]/page.tsx`.

### Per-step git workflow
Branch per step from `main`: `git checkout main && git pull && git checkout -b feat/uct-step-<N>-<slug>`. Commit when exit criteria pass. Open a PR; end the PR body with the Generated-with line. Backend steps commit in the backend repo, frontend steps in the frontend repo.

### Dependency graph (quick view)
```
1 (UserText schema) ── 2 (TextSubmission schema, serial: same file)
1 ── 3 (UserText backend module)         ┐ 3 & 4 parallel
2 ── 4 (TextSubmission backend ext)      ┘
3,4 ── 5 (FE entities/user-text)         ┐ 5 & 6 parallel
4   ── 6 (FE features/text-submission ext)┘
5      ── 7 (FE features/user-text-editor)        — sequential after 5,6
5 AND 6 ── 8 (FE features/my-texts)               — sequential after 5,6
7,8 ── 9 (FE widgets/my-texts-page + reader)
9   ── 10 (FE routes + nav)
4,6 ── 11 (admin UI surfacing)            ‖ parallel with 9/10
all ── 12 (i18n che/ru/en)
```
**Parallelizable pairs:** **{3,4}**, **{5,6}**. After 5 AND 6 both land, **Step 7 and Step 8 are SEQUENTIAL** (not parallel): Step 8 (`features/my-texts`) depends on BOTH Step 5 (`entities/user-text`) AND Step 6 (`features/text-submission` updates). Step 7 depends only on Step 5. Run 7 then 8 (or 8 then 7) — do not assume they are an independent pair. **{11}** runs independently of {9,10} once {4,6} land. Steps 1 and 2 touch `schema.prisma` so run **serially** (1 then 2).

---

## Step 1 — Backend: add `UserText` model + `UserTextType` enum

**Depends on:** none.
**Model tier:** default.
**Skills:** none required (pure backend/DB — NestJS + Prisma, no frontend code).

### Context brief
Add a brand-new private-library table. Backend repo `F:\programming\mott-larbe\mott-larbe-backend`, schema `prisma/schema.prisma`. `content` mirrors `TextPage.contentRich` which is `Json`. The existing `Language` enum (values `CHE | RU | AR | EN` — verify exact members in `schema.prisma`) already exists and is used by other text models; **`UserText.language` MUST use this `Language` enum, NOT a plain `String`** (fix M6). The `User` model already has relations `textSubmissions`, `reviewedTextSubmissions`, `bookmarks`, etc.; `UserTextProgress/Bookmark/Highlight/Note` are for the **library** Text and are unrelated — do not touch them. Add the new relation to `User` with a distinct relation name.

### Performance & Security notes (Step 1)
- `@@index([userId])` is already in the model above — mandatory for all owner-scoped list queries.
- `@@index([userId, type])` — ADD this compound index. `GET /user-texts?type=ORIGINAL` filters by both `userId` and `type` simultaneously; the compound index is more efficient than two separate indexes.
- `onDelete: Cascade` on the User relation: deleting a user removes all their UserTexts — correct behavior, no orphan rows.
- `content Json` stores TipTap JSON — no size limit at the DB level. The DTO in Step 3 adds a `@MaxLength` / `@IsObject` guard to prevent unbounded payloads.
- **No `updatedAt` index needed** — `updatedAt` is used only for ordering in the list, and list queries are already filtered by `userId` first (using the index), so a full scan of the small per-user result set is acceptable.

### Tasks
- Edit `prisma/schema.prisma`:
  - Confirm the existing `enum Language` members (`CHE | RU | AR | EN`). Do NOT redefine it.
  - Add enum:
    ```prisma
    enum UserTextType {
      ORIGINAL
      EXTERNAL
    }
    ```
  - Add model (note `language Language`, not String — fix M6):
    ```prisma
    model UserText {
      id        String       @id @default(uuid())
      userId    String
      title     String
      language  Language     @default(CHE)
      author    String?
      sourceUrl String?
      type      UserTextType @default(EXTERNAL)
      content   Json
      createdAt DateTime     @default(now())
      updatedAt DateTime     @updatedAt
      user      User         @relation("UserOwnedTexts", fields: [userId], references: [id], onDelete: Cascade)

      @@index([userId])
      @@map("user_text")
    }
    ```
  - Add to `model User`: `ownedTexts UserText[] @relation("UserOwnedTexts")`.
- Run `npm run prisma:format`, then `npm run migrate:dev -- --name add_user_text`, then `npm run prisma:generate`.

### Verification
- `npm run prisma:validate` exits 0 (or `npx prisma validate`).
- A new migration folder `00NN_add_user_text` exists under `prisma/migrations`.
- `npx prisma generate` produces a `UserText` type and `UserTextType` enum. `language` field is typed `Language`.

### Exit criteria
Schema validates, migration created and applied, client regenerated with `UserText` + `UserTextType`, `language` uses the `Language` enum. No edits to existing `UserText*` models.

---

## Step 2 — Backend: extend `TextSubmission` (DRAFT status + new enums/fields) + STATE MACHINE

**Depends on:** Step 1 (same file — serial after 1 to avoid migration ordering conflicts).
**Model tier:** default.
**Skills:** none required (pure backend/DB).

### Context brief
Extend the existing publication-flow table. `enum TextSubmissionStatus` = `PENDING|APPROVED|REJECTED` today. Add `DRAFT`, a submission-type enum, a license enum, optional `publicationYear`, and the new `contentRich Json?` column (DECISION C2 — `content` stays untouched).

### THE STATE MACHINE (M1 — the service in Step 4 enforces this EXACTLY)
```
DRAFT      → PENDING     via POST /text-submissions/:id/submit (owner)
PENDING    → APPROVED    via POST /:id/review decision=approve  (admin only) — EXISTING
PENDING    → REJECTED    via POST /:id/review decision=reject   (admin only) — EXISTING
REJECTED   → DRAFT       this happens IMPLICITLY: admin reject sets status=REJECTED;
                         the owner may then PATCH /:id to re-edit while status is REJECTED
                         (REJECTED is an editable state — the row stays REJECTED until resubmit).
REJECTED   → PENDING     via POST /:id/submit again; this transition MUST clear
                         reviewComment=null, reviewedBy=null, reviewedAt=null.
APPROVED   → (terminal)  no transitions out. PATCH/DELETE/submit on APPROVED → error.
```
Editable states (owner PATCH/DELETE allowed): `DRAFT`, `REJECTED`. Submittable states (owner `/submit` allowed): `DRAFT`, `REJECTED`.
`licenseType` + `publicationYear` apply only to `EXTERNAL`; enforced in DTO/service (Step 4).

### Performance & Security notes (Step 2)
- **Compound index `@@index([userId, status])`** — ADD this to `TextSubmission`. The `GET /my?status=DRAFT` query filters by both `userId` AND `status`; a compound index is significantly faster than two separate single-column indexes for this pattern.
- Verify `@@index([status])` already exists. If it does, the compound `[userId, status]` covers the `status`-only admin query too (leading-column rule doesn't help here, so keep both if the admin list query filters by status alone without userId).
- `contentRich Json?` is nullable — old rows have `null`. No default value needed. The fallback rule (C2) handles the null case on read.
- `publicationYear Int?`: no DB constraint — range validation (`@Min(1000)`, `@Max`) is enforced in the DTO (Step 4).
- **Stats endpoint update (Step 4 concern, flag here):** the existing `GET /stats` returns `{ total, pending, approved, rejected }`. After adding `DRAFT`, consider whether `draft` count should be included in stats — relevant for admin visibility. If yes, update the `stats()` service method in Step 4 to also count `DRAFT`. Mark this as a decision for the Step 4 implementer.

### Tasks
- Edit `prisma/schema.prisma`:
  - `enum TextSubmissionStatus { PENDING APPROVED REJECTED DRAFT }` (add `DRAFT`).
  - Add:
    ```prisma
    enum SubmissionType { ORIGINAL EXTERNAL }
    enum SubmissionLicenseType { PUBLIC_DOMAIN CC PERMISSION UNKNOWN }
    ```
  - In `model TextSubmission` add (DECISION C2 — keep existing `content String? @db.Text` AS-IS; add new column):
    ```prisma
    submissionType  SubmissionType         @default(EXTERNAL)
    licenseType     SubmissionLicenseType?
    publicationYear Int?
    contentRich     Json?
    ```
  - Add a code comment above `model TextSubmission` documenting the state machine above.
- Run `npm run prisma:format`, `npm run migrate:dev -- --name extend_text_submission`, `npm run prisma:generate`.

### Verification
- `npm run prisma:validate` exits 0.
- New migration folder created and applied.
- Generated client exposes `DRAFT`, `SubmissionType`, `SubmissionLicenseType`, `contentRich`. The old `content` column type is unchanged (`String? @db.Text`).

### Exit criteria
Schema validates and migrates; existing `content` untouched; `contentRich`, `submissionType`, `licenseType`, `publicationYear`, `DRAFT` present; state machine documented as a comment.

---

## Step 3 — Backend: `user-texts` NestJS module (CRUD, owner-scoped)

**Depends on:** Step 1.
**Model tier:** default. **Parallel with:** Step 4.
**Skills:** none required (pure backend — NestJS controllers/services/DTOs).

### Context brief
New owner-private CRUD module. Mirror `src/text-submissions/` structure (controller + service + module + `dto/`). Auth: every endpoint `@Auth()` + `@User("id") userId`. Every read/write **scoped to owner** (`where: { id, userId }`) — never expose another user's UserText. Register in `src/app.module.ts` (find the `TextSubmissionsModule` import, add alongside). Add `USER_TEXT_NOT_FOUND` to `src/common/errors/error-codes.ts`. PrismaService: `src/prisma.service`. Use the existing `Language` enum for the `language` DTO field. ORIGINAL author derivation (DECISION C3): for `type === "ORIGINAL"`, set `author = user.name + " " + user.surname` server-side (trim; fall back to `name` alone if no surname), ignoring any client-sent `author`.

### Performance & Security notes (Step 3)
- **List endpoint — select fields, not full content:** `GET /user-texts` (list) MUST use `select: { id, userId, title, language, author, sourceUrl, type, createdAt, updatedAt }` — do NOT include `content` (the TipTap JSON) in list responses. `content` is returned only by `GET /user-texts/:id` (single). This prevents returning kilobytes of JSON per card in the list.
- **`updatedAt` in list select:** include `updatedAt` in the list response — the frontend uses it as the default sort key ("recently edited first") and to show "Last edited" in the card.
- **Pagination defaults:** `limit` default `20`, max `100` (use `@Max(100)` on the DTO query param or `DefaultValuePipe`). `offset` default `0`.
- **Owner-scoped Prisma pattern:** use `where: { id, userId }` — one atomic query, not fetch-then-check. If Prisma returns `null`, throw `NotFoundException`. Never return a 403 that leaks existence; return 404 for both "not found" and "not yours".
- **Input size guard on `content`:** `@IsObject()` alone doesn't limit size. Add a custom validator or `@Transform` that checks `JSON.stringify(dto.content).length <= 500_000` (500 KB) and throws if exceeded.
- **`sourceUrl` security:** `@IsUrl({ require_protocol: true })` — this rejects `javascript:` and `data:` automatically. Combine with `@ValidateIf`.
- **`@ApiOperation` + `@ApiResponse`:** add to all five endpoints for Swagger completeness.

### Tasks
- `src/user-texts/dto/create-user-text.dto.ts`: `title` (`@IsString()`, `@MinLength(1)`, `@MaxLength(500)`), `language` (`@IsEnum(Language)`, default `CHE`), `author?` (`@IsString()`, `@MaxLength(300)`), `sourceUrl?` (`@ValidateIf(o => o.sourceUrl !== undefined && o.sourceUrl !== "")` then `@IsUrl({ require_protocol: true })` — fix m3), `type` (`@IsEnum(UserTextType)`), `content` (TipTap JSON — `@IsObject()` + size guard ≤ 500 KB).
- `src/user-texts/dto/update-user-text.dto.ts`: `PartialType(CreateUserTextDto)`.
- `src/user-texts/user-texts.service.ts`: `create(userId, dto)`, `findMine(userId, { type?, limit, offset })` — **select only list fields (no content)**, `findOneOwned(userId, id)` — **full select including content** (throws `NotFoundException`/`USER_TEXT_NOT_FOUND` via `where: { id, userId }`), `update(userId, id, dto)`, `remove(userId, id)`. For `type === "ORIGINAL"`, derive `author` per DECISION C3.
- `src/user-texts/user-texts.controller.ts` (`@Controller("user-texts")`, `@ApiTags("user-texts")`, all `@Auth()` + `@ApiBearerAuth()`):
  - `POST /user-texts` create
  - `GET /user-texts` list mine (`?type=&limit=&offset=`, ParseIntPipe + DefaultValuePipe)
  - `GET /user-texts/:id` one owned (`ParseUUIDPipe`)
  - `PATCH /user-texts/:id` update
  - `DELETE /user-texts/:id` delete
- `src/user-texts/user-texts.module.ts` (imports `AuthModule`, providers `UserTextsService, PrismaService`); register in `src/app.module.ts`.
- Add `USER_TEXT_NOT_FOUND` to `ErrorCode`.

### Verification
- `npm run build` (backend) compiles.
- Manual: with a JWT, `POST /user-texts` then `GET /user-texts` returns it; `GET /user-texts/:id` with a different user's token → 404; `DELETE` removes it; `POST` with `type=ORIGINAL` ignores client `author` and stores the user's name.

### Exit criteria
Five endpoints, all owner-scoped, ORIGINAL author derived (C3), `language` validated against `Language` enum, build passes, module registered.

---

## Step 4 — Backend: extend `text-submissions` (owner GETs + DRAFT lifecycle: PATCH/DELETE/submit) + author derivation

**Depends on:** Step 2.
**Model tier:** default. **Parallel with:** Step 3.
**Skills:** none required (pure backend — extending existing NestJS module).

### Context brief
Add the draft lifecycle AND owner-scoped read endpoints to `src/text-submissions/`. **Verified current state:** `POST /` (create, `@Auth()`), `GET /my` (`@Auth()`, no status filter), `GET /stats` (admin — EXISTS, do not re-add), `GET /` (admin list), `GET /:id` (ADMIN-only, no ownership check), `POST /:id/review` (admin). There are **no** PATCH/DELETE/submit/owner-GET-single endpoints. Enforce the **state machine from Step 2**. DECISION C3 author derivation applies on create and submit. The existing `create` requires `sourceUrl || content` — extend so `contentRich` also satisfies that requirement.

### NEW / CHANGED ENDPOINTS (this step must deliver all of these — fixes C1, M3)
1. **`GET /text-submissions/my`** — CHANGE: add a `status?` query filter (owner-scoped list, for the draft listing). Update `getMySubmissions(userId, { status?, limit, offset })` to filter by status when provided.
2. **`GET /text-submissions/:id/draft`** — NEW owner-scoped single GET. Returns the submission only if `submission.userId === userId`, else `NotFoundException`/`TEXT_SUBMISSION_NOT_FOUND`. This lets an owner load their own DRAFT/REJECTED into the editor WITHOUT admin permission. (Use a distinct path `/:id/draft` to avoid colliding with the existing admin `GET /:id`. Place its route BEFORE or with non-overlapping matching; `:id/draft` and `:id` do not collide.)
3. **`PATCH /text-submissions/:id`** — `@Auth()`. Owner-only; allowed only when status ∈ {`DRAFT`,`REJECTED`} (else `TEXT_SUBMISSION_NOT_EDITABLE`); not-owner → `TEXT_SUBMISSION_FORBIDDEN`.
4. **`DELETE /text-submissions/:id`** — `@Auth()`. Owner-only; only own `DRAFT`/`REJECTED`.
5. **`POST /text-submissions/:id/submit`** — `@Auth()`. Transition `DRAFT|REJECTED → PENDING`; on `REJECTED → PENDING` clear `reviewComment/reviewedBy/reviewedAt` (state machine M1). Validate required fields (title, and `sourceUrl || content || contentRich`); for `EXTERNAL` require `licenseType`; APPROVED → `TEXT_SUBMISSION_NOT_EDITABLE`.
6. `GET /text-submissions/stats` already exists — leave as-is.

### Performance & Security notes (Step 4)
- **List vs detail select:** `GET /my` list → same pattern as Step 3: exclude `contentRich` and `content` from list select. Return only: `id, userId, title, language, author, submissionType, licenseType, publicationYear, status, reviewComment, reviewedAt, createdAt, updatedAt`. Full content only in `GET /:id/draft`.
- **`updatedAt` in list:** include it — the user's "My submissions" tab sorts by most recently edited, and the card shows "Last edited X ago".
- **`@@index([userId])` on TextSubmission:** verify it exists in the schema (used by `GET /my?status=` filter). If absent, add it in Step 2's migration.
- **Submit action atomicity:** `POST /:id/submit` must update status + clear review fields in a **single** `prisma.textSubmission.update()` call — not two separate calls.
- **`publicationYear` validation:** `@IsInt()` + `@Min(1000)` + `@Max(new Date().getFullYear())`. Reject years like `0` or `9999`.
- **`contentRich` size guard:** same as Step 3 — `JSON.stringify(dto.contentRich).length <= 500_000`.
- **No info leak on 404:** `findOneOwned` must return the same `TEXT_SUBMISSION_NOT_FOUND` error whether the submission doesn't exist OR belongs to another user.
- **`@ApiOperation` + `@ApiResponse`:** add to all new endpoints.

### Tasks
- Extend `CreateTextSubmissionDto` (`dto/create-text-submission.dto.ts`): add `submissionType` (`@IsEnum(SubmissionType)`, optional — absence means EXTERNAL/legacy per C3); optional `licenseType` (`@IsEnum`, required when `submissionType === EXTERNAL` via `@ValidateIf`); optional `publicationYear` (`@IsInt`, `@Min(0)`); optional `contentRich` (`@IsObject()`); optional `status` (`@IsEnum(TextSubmissionStatus)`) to allow creating directly as `DRAFT`. Default new-flow creates to `DRAFT`; preserve ability to create `PENDING`. Apply the m3 sourceUrl `@ValidateIf` empty-string guard here too.
- Create `dto/update-text-submission.dto.ts`: `PartialType(CreateTextSubmissionDto)`.
- `text-submissions.service.ts`:
  - `create`: accept `contentRich`; the source-required check becomes `if (!dto.sourceUrl && !dto.content && !dto.contentRich)`. Apply DECISION C3 author derivation (fetch user; if `submissionType === "ORIGINAL"` set `author` from `name + " " + surname`, ignoring `dto.author`; otherwise use `dto.author`). Write `submissionType/licenseType/publicationYear/contentRich` and honor `dto.status` (default `DRAFT`).
  - `getMySubmissions(userId, { status?, limit, offset })`: add optional status filter.
  - `findOneOwned(userId, id)`: owner-scoped single (`where: { id }` then check `userId`, else `TEXT_SUBMISSION_NOT_FOUND`) — backs `GET /:id/draft`.
  - `update(userId, id, dto)`: status guard (DRAFT/REJECTED only) + ownership; re-apply C3 author derivation if `submissionType` is ORIGINAL.
  - `remove(userId, id)`: own DRAFT/REJECTED only.
  - `submit(userId, id)`: state machine + field validation + EXTERNAL license + clear review fields on REJECTED→PENDING + C3 author derivation.
- `text-submissions.controller.ts`: add `findOwned` (`GET :id/draft`, `@Auth()`), `update` (`PATCH :id`, `@Auth()`), `remove` (`DELETE :id`, `@Auth()`), `submit` (`POST :id/submit`, `@Auth()`). Pass `@User("id")`. Add the `status` query param to the existing `my` handler.
- Add `ErrorCode`s `TEXT_SUBMISSION_FORBIDDEN`, `TEXT_SUBMISSION_NOT_EDITABLE`.

### Verification
- `npm run build` passes.
- Manual: create `status=DRAFT`; `GET /:id/draft` as owner returns it, as another user → 404; `PATCH` it; `POST /:id/submit` → PENDING; admin `review` reject → REJECTED; `GET /my?status=REJECTED` lists it; `PATCH` then `submit` → PENDING with review fields cleared; `DELETE` an APPROVED → error; `create` with `submissionType=ORIGINAL` stores the user's name as author and ignores client `author`.

### Exit criteria
`GET /my` filterable by status; owner `GET /:id/draft`, `PATCH`, `DELETE`, `POST /:id/submit` exist and enforce the Step 2 state machine; ORIGINAL author derived (C3); `contentRich` satisfies source-required; EXTERNAL license required on submit; build passes.

---

## Step 5 — Frontend: `entities/user-text` (api, queries, types)

**Depends on:** Step 3.
**Model tier:** default. **Parallel with:** Step 6.
**Skills:** `/react19` (TanStack Query v5 patterns: `queryOptions`, `staleTime`, `useSuspenseQuery` guards), `/coding-standards` (FSD slice shape, arrow functions, named exports).

### Context brief
UserText is a business domain model owned by the current user → **entities** layer (`src/entities/user-text/`). FSD slice shape: `api/`, `model/`, `index.ts` barrel. HTTP via `import { http } from "@/shared/api"`. TanStack Query v5: define `queryOptions()` once in `model/`, set `staleTime` explicitly, include all params in `queryKey`. TipTap doc type: reuse `TipTapDoc` from `@/shared/ui/notion-editor`. `language` is the union `"CHE"|"RU"|"AR"|"EN"` (mirror backend `Language` enum — M6). Mirror conventions in `src/entities/text/api/` and `src/features/text-submission/queries.ts`. Arrow functions only; named exports; no `useMemo/useCallback` (React Compiler — see version constraints above).

### Performance & Security notes (Step 5)
- **List type vs detail type:** define two separate TypeScript types — `UserTextListItem` (no `content` field, matches the list API response) and `UserText` (full, includes `content: TipTapDoc`). Using the full type for list cards would allow accidentally rendering `content` and hydrating kilobytes of JSON into the page unnecessarily.
- **`staleTime` values:** list → `60_000`; detail → `120_000`. Explicit, never default 0.
- **`queryKey` completeness:** `userTextQueryOptions({ type, limit, offset })` must include ALL params in the key. If `type` is `undefined`, include it as `undefined` (not omit) so the key is deterministic.
- **No `useMemo`/`useCallback`** anywhere in this slice — React Compiler handles it.
- **Mutation `retry: 0`:** set `retry: 0` on `useCreateUserText`, `useUpdateUserText`, `useDeleteUserText`. Write operations must not be silently retried — if creation partially succeeded and the network dropped, a retry could create a duplicate.
- **`onError` pattern:** each mutation hook should accept an optional `onError` callback prop, or internally call `useToast()` to show the localized API error. Never swallow errors silently.

### Tasks
- `src/entities/user-text/api/types.ts`: `UserTextType = "ORIGINAL" | "EXTERNAL"`; `UserTextLanguage = "CHE"|"RU"|"AR"|"EN"`; `UserText` (id, userId, title, language: UserTextLanguage, author?, sourceUrl?, type, content: TipTapDoc, createdAt, updatedAt); `CreateUserTextDto`, `UpdateUserTextDto`, `GetUserTextsParams` ({ type?, limit?, offset? }), `UserTextsListResponse` ({ data, meta }).
- `src/entities/user-text/api/user-text-api.ts`: `userTextApi.create/list/getById/update/remove` against `/user-texts`.
- `src/entities/user-text/model/queries.ts`: `userTextKeys` factory + `userTextQueryOptions(params)` + `userTextDetailQueryOptions(id)` + mutation hooks `useCreateUserText`, `useUpdateUserText`, `useDeleteUserText` (invalidate list on success).
- `src/entities/user-text/index.ts` barrel re-exporting types + api + hooks/options.

### Verification
- `npx tsc --noEmit` passes (frontend).
- No imports from layers above `entities`; imports go only to `shared`.

### Exit criteria
Entity slice compiles, exposes typed CRUD hooks + `queryOptions`, barrel complete, no upward imports.

---

## Step 6 — Frontend: extend `features/text-submission` (new fields, owner-GET, DRAFT hooks)

**Depends on:** Step 4.
**Model tier:** default. **Parallel with:** Step 5.
**Skills:** `/react19` (TanStack Query v5: additive extension of existing `queryOptions`, mutation invalidation patterns), `/coding-standards` (FSD additive-only extension, no renames).

### Context brief
Extend the EXISTING slice `src/features/text-submission/` (`types.ts`, `api.ts`, `queries.ts`, `index.ts`). **Verified current state:** `TextSubmissionStatus = "PENDING"|"APPROVED"|"REJECTED"`; `textSubmissionsApi` = `create/getMine/getStats/getAll/getById/review` (and `getById` hits the ADMIN `GET /:id`); `queries.ts` has `textSubmissionKeys` + hooks `useMyTextSubmissions/useTextSubmissions/useTextSubmission/useTextSubmissionStats/useCreateTextSubmission/useReviewTextSubmission`. Do NOT rename existing exports — only add. TipTap doc type from `@/shared/ui/notion-editor`. The C2 fallback rule means `content?: string` AND `contentRich?: TipTapDoc` both exist on the type.

### Performance & Security notes (Step 6)
- **Additive-only:** existing exports must remain byte-for-byte identical. Run `npx tsc --noEmit` against existing widget consumers to confirm nothing breaks.
- **`staleTime` on new queries:** `useOwnedTextSubmission` → `30_000` (drafts change frequently); do not inherit the default `0`.
- **Owner-scope on client (defense in depth):** after `useOwnedTextSubmission(id)` resolves, if `data.userId !== currentUserId`, the calling component should redirect — implement this check in the hook, not in the component.
- **No sensitive data in mutation error toasts:** display only the translated error message, never raw API error bodies.
- **Mutation `retry: 0`** on all new mutations (`useUpdateTextSubmission`, `useDeleteTextSubmission`, `useSubmitTextSubmission`) — same reasoning as Step 5.
- **`useSubmitTextSubmission` post-error refetch:** on error, call `queryClient.invalidateQueries(textSubmissionKeys.mine())` inside `onError` — re-sync the actual server status before showing the error toast, so the UI doesn't show a stale optimistic state.

### Tasks
- `types.ts`: add `"DRAFT"` to `TextSubmissionStatus`; add `SubmissionType = "ORIGINAL"|"EXTERNAL"`, `SubmissionLicenseType = "PUBLIC_DOMAIN"|"CC"|"PERMISSION"|"UNKNOWN"`; extend `TextSubmission` with `submissionType`, `licenseType?`, `publicationYear?`, `contentRich?: TipTapDoc` (keep existing `content?: string`). Extend `CreateTextSubmissionDto` (add `submissionType?`, `licenseType?`, `publicationYear?`, `contentRich?`, `status?`); add `UpdateTextSubmissionDto`. Add `status?` to `GetMyTextSubmissionsParams`.
- `api.ts`: add `getOwnedById(id)` → `GET /text-submissions/:id/draft` (owner-scoped — SEPARATE from the existing admin `getById`); `update(id, dto)` → `PATCH /text-submissions/:id`; `remove(id)` → `DELETE /text-submissions/:id`; `submit(id)` → `POST /text-submissions/:id/submit`. Ensure `getMine` forwards the `status` param.
- `queries.ts`: add `useOwnedTextSubmission(id)` (query, explicit `staleTime`), `useUpdateTextSubmission`, `useDeleteTextSubmission`, `useSubmitTextSubmission` (each invalidates `textSubmissionKeys.mine()` and the relevant `detail`).
- `index.ts`: export new types + hooks.

### Verification
- `npx tsc --noEmit` passes.
- Existing consumers (`widgets/suggestions-page`, `widgets/admin-text-submissions-page`, `widgets/suggest-text-page`) still typecheck (additive only).

### Exit criteria
Slice exposes owner GET + DRAFT lifecycle mutations + new typed fields; existing exports unchanged; compiles; existing widgets unaffected.

---

## Step 7 — Frontend: `features/user-text-editor` (create/edit form + hooks)

**Depends on:** Step 5.
**Model tier:** default.
**Skills:** `/react19` (form with `useActionState` + `useFormStatus` in submit button child — see version constraints), `/shadcn-claude-skill-main` (Input, Select, Button, Label from `shared/ui`; never bare HTML), `/coding-standards` (one component per file, arrow functions, named `handle*` handlers extracted from JSX).

### Version notes
- Form state: use `useActionState(action, initialState)` — not multiple `useState` for loading/error/success. The submit button MUST be a separate component using `useFormStatus()` (it must be a child of `<form>`, not a sibling).
- No `forwardRef` on any input wrappers — pass `ref` as a regular prop.
- No `useMemo`/`useCallback` anywhere in this feature.
- `'use client'` on the form component only (it has hooks + event handlers). The `get-language-options.ts` and `get-type-options.ts` config files are plain `.ts` — no directive needed.

### Context brief
A user interaction with business value → **features** layer. Build the create/edit experience for a UserText. Logic in `model/use-*.ts` hooks; components are JSX + event wiring only (one component per file, arrow functions, named `handle*` handlers, no inline JSX handlers). Form: use React 19 `useActionState` for submit state; mutations come from `entities/user-text` (Step 5). Editor = `NotionEditor` from `@/shared/ui/notion-editor` (props `{ content: TipTapDoc, onUpdate, slashMenuItems, placeholder, minHeight }`). For `type === "ORIGINAL"`, hide/disable the author input (author derived server-side, C3). Reuse `shared/ui` primitives — never bare HTML. i18n via `useI18n()`.

### Performance & Security notes (Step 7)
- **Editor bundle isolation:** `NotionEditor` is a heavy component (TipTap + ProseMirror). The editor form page is already a separate route (`/my-texts/new`, `/my-texts/[id]/edit`) — the editor is never imported on the list or reader routes. Do NOT import it in any barrel that is used by non-editor routes. If `UserTextEditorForm` is ever used in a shared widget, wrap with `next/dynamic({ ssr: false })` to code-split it.
- **Auto-save draft:** implement debounced auto-save (~30s inactivity) using `useDebounce` from `@/shared/lib/debounce/` on the `content` state. On each debounced change (edit mode only), call `useUpdateUserText` silently. Show a small "Saved" / "Saving…" indicator in the editor toolbar — NOT a toast. Do not auto-save on `create` mode (no `id` yet); only after first explicit save creates the record.
- **Content size warning:** if `JSON.stringify(content).length > 400_000` (near the 500 KB server limit), show an inline warning to the user before submit — do not silently let the backend reject it.
- **Input validation on submit:** before calling the mutation, validate client-side: `title` non-empty, `language` is a valid enum value, `sourceUrl` (if set) starts with `http://` or `https://`. Show field-level errors next to the input, not just a toast.
- **Unsaved changes guard:** when the user navigates away with unsaved changes (content differs from last saved state), prompt with a `beforeunload` event warning OR a custom confirmation dialog. Use `useEffect` with `window.addEventListener("beforeunload", ...)` — clean up in the effect return. This is one of the few valid `useEffect` use cases (external browser API).
- **No `dangerouslySetInnerHTML`** in the editor or any preview — TipTap renders its own DOM.
- **Redirect after success:** use `router.push` (Next.js `useRouter` from `next/navigation`) to navigate after create/update. Do NOT use `window.location` — it triggers a full page reload.

### Tasks
- `src/features/user-text-editor/model/use-user-text-editor.ts`: manages title, language, author, sourceUrl, type, content (TipTapDoc); `mode: "create" | "edit"`; on submit calls `useCreateUserText`/`useUpdateUserText`; toast + redirect callback prop. Initialize from optional `initial?: UserText`.
- `src/features/user-text-editor/model/types.ts`: shared form types (only if used by >1 file).
- `src/features/user-text-editor/lib/get-language-options.ts` and `get-type-options.ts`: config arrays returning option descriptors (takes `t`).
- `src/features/user-text-editor/ui/user-text-editor-form.tsx`: top-level form.
- `src/features/user-text-editor/ui/user-text-meta-fields.tsx`: title/author/source/type/language inputs.
- `src/features/user-text-editor/ui/user-text-editor-submit-button.tsx`: `useFormStatus` (must be a child of the `<form>`).
- `src/features/user-text-editor/index.ts` barrel.

### Verification
- `npx tsc --noEmit` and `npm run lint` pass.
- No upward imports; uses `entities/user-text` + `shared` only.
- `react/no-multi-comp`: one component per file.

### Exit criteria
Reusable `UserTextEditorForm` (create + edit) wired to entity mutations; ORIGINAL hides author; TipTap content captured as JSON; compiles + lints.

---

## Step 8 — Frontend: `features/my-texts` (draft submission editor + submit + copy-from-UserText)

**Depends on:** Step 5 AND Step 6 (fix M2 — needs `entities/user-text` for the copy source AND `features/text-submission` for the draft lifecycle). Sequential after both.
**Model tier:** default.
**Skills:** `/react19` (`useActionState` for the submission form, `useOptimistic` for instant status update after submit — but NOT for the final submit action since status change is critical), `/shadcn-claude-skill-main` (Select for licenseType, Input for publicationYear, Dialog for copy-picker), `/coding-standards` (value-copy mandate M4, one component per file).

### Context brief
Feature for editing a publication submission as a DRAFT and sending it to moderation, including copying from a UserText. Uses extended `features/text-submission` hooks (`useCreateTextSubmission` with `status: "DRAFT"`, `useUpdateTextSubmission`, `useSubmitTextSubmission`, `useOwnedTextSubmission` for loading a draft) AND `entities/user-text` (`useUserTexts` list for the copy picker). Fields beyond UserText: `submissionType`, and for `EXTERNAL` → `licenseType` (required) + `publicationYear`. TipTap content via `NotionEditor`.

### Performance & Security notes (Step 8)
- **Copy picker lazy load:** the `CopyFromUserTextPicker` (Dialog with a list of UserTexts) should only fetch the user's text list when the dialog opens — use a conditional query (`enabled: isOpen`) or fetch inside the Dialog's render subtree.
- **No content in the copy picker list:** the picker fetches `UserTextListItem[]` (no `content` field) to populate the list. Full content (`UserText.content`) is fetched only after the user selects one item — one additional `getById` call. This avoids loading all TipTap JSON blobs upfront.
- **Value-copy security:** `structuredClone(userText.content)` is safe. Ensure the cloned object is passed as `contentRich` to the new draft — never as a reference. After clone, the picker closes and `userText` can be garbage-collected.
- **Submit confirmation dialog:** `POST /:id/submit` is a significant status change. Show a `shared/ui/AlertDialog` ("Send to moderation? You won't be able to edit after submission.") — do not fire the mutation on a single click.
- **Auto-save for submission draft too:** same debounced auto-save pattern as Step 7 — apply to `SubmissionEditorForm` in edit mode (existing DRAFT). On network error during auto-save, show a subtle inline warning "Auto-save failed" — do not block the user.
- **`retry: 0` on `useSubmitTextSubmission`** — this is a critical state transition. On error, re-fetch the current status before showing the error (see Step 6 notes).
- **Unsaved changes guard:** same `beforeunload` pattern as Step 7 for the submission editor.

### VALUE-COPY MANDATE (M4 — state in code comments and honor it)
"Copy from my text" takes a `UserText` and **deep-copies its `content`/`contentRich` JSON BY VALUE** into a brand-new TextSubmission draft. There is **NO foreign key** from TextSubmission to UserText — only a snapshot. Deleting or later editing the source UserText has **no effect** on the submission. Implement the copy as `structuredClone(userText.content)` (or `JSON.parse(JSON.stringify(...))`) into the new draft's `contentRich`; never store a reference/id back to the UserText.

### Tasks
- `src/features/my-texts/model/use-submission-editor.ts`: form state incl. `submissionType`, `licenseType`, `publicationYear`, `contentRich`; create-as-draft / update / submit handlers; validation (EXTERNAL requires license before submit). Load existing draft via `useOwnedTextSubmission(id)` in edit mode.
- `src/features/my-texts/model/use-copy-from-user-text.ts`: given a `UserText`, returns initial draft form values via a deep value-copy of content (M4); no id linkage.
- `src/features/my-texts/lib/get-license-options.ts`, `get-submission-type-options.ts` (config, takes `t`).
- `src/features/my-texts/ui/submission-editor-form.tsx`.
- `src/features/my-texts/ui/submission-license-fields.tsx` (conditional EXTERNAL block: license + year).
- `src/features/my-texts/ui/submission-submit-button.tsx` (Save draft vs Send to moderation actions).
- `src/features/my-texts/ui/copy-from-user-text-picker.tsx` (select a UserText to copy).
- `src/features/my-texts/index.ts` barrel.

### Verification
- `npx tsc --noEmit` and `npm run lint` pass.
- Conditional fields only render for EXTERNAL; submit blocked without license for EXTERNAL; copy creates a NEW draft and does not mutate the source (verify the picker calls no UserText mutation).

### Exit criteria
Draft submission can be created, edited, submitted; EXTERNAL license/year captured + validated; copy-from-UserText prefills a NEW draft via value-copy (M4) without mutating or referencing the source; compiles + lints.

---

## Step 9 — Frontend: `widgets/my-texts-page` (list + reader + tabs assembly)

**Depends on:** Steps 7, 8.
**Model tier:** default.
**Skills:** `/react19` (`useSuspenseQuery` for the list — wrap consumer in `<Suspense>` + `<ErrorBoundary>`; use `use(ctx)` not `useContext` if context is needed; no `useCallback` for tab handlers), `/shadcn-claude-skill-main` (Tabs, Card, Badge, Skeleton for loading states), `/ui-ux-pro-max` (touch targets ≥ 44px for card actions, keyboard nav on tabs, ARIA labels), `/coding-standards` (named `handle*` per `.map()` item — see feedback memory).

### Performance & Security notes (Step 9)
- **No content in list cards:** `UserTextCard` renders data from `UserTextListItem` (no `content` field). The full TipTap JSON is only fetched when the user navigates to the reader route. Verify the list query uses `userTextQueryOptions` that hits the list endpoint (which excludes `content` per Step 3).
- **`useSuspenseQuery` + boundaries:** wrap each `useSuspenseQuery` consumer in `<Suspense fallback={<Skeleton />}>` + `<ErrorBoundary>`. The `loading.tsx` handles route-level loading; the internal Suspense handles per-section streaming.
- **Reader `render-rich-content` safety:** before rendering, check that `content` is a valid object (not null/undefined/string). Wrap in `try/catch` inside the ErrorBoundary — a malformed TipTap doc must show a fallback message, not crash.
- **Delete confirmation:** `DELETE /user-texts/:id` is destructive. Show an `AlertDialog` before calling `useDeleteUserText` — same pattern as the library's existing delete flows.
- **Tab state in URL:** store the active tab in a `?tab=` query param (using `useSearchParams` from `next/navigation`) so the user lands on the right tab after navigating back. This is important for mobile UX — "back" should restore the tab, not reset to default.
- **List size & virtualization:** if a user has many private texts (>50), the list can become slow. For this initial version, a `limit=20` + "Load more" pagination button is sufficient — do NOT implement infinite scroll yet, as it complicates scroll restoration. Add a `TODO:` comment for future virtualization (e.g. `@tanstack/react-virtual`) if the list grows.
- **Empty state with CTA:** `MyTextsEmptyState` must show different content per tab: "All" tab → "Add your first text" + button to `/my-texts/new`; "My Works" tab → "Publish your first original work" + button; "External" tab → "Add a text by another author" + button. Empty states with a clear CTA significantly reduce bounce rate.
- **Skeleton dimensions:** the `loading.tsx` skeleton for the list must match the `UserTextCard` height exactly (title line + meta line + status badge) to prevent layout shift on hydration.

### Version notes
- Server Component for the outer route page; `'use client'` only on `my-texts-tabs.tsx` and `user-text-list.tsx` (they have tab state / delete handlers).
- `useSuspenseQuery` inside client components — the parent page passes a guaranteed non-null `userId` (guard in the server component with `notFound()` if no session).
- No `useEffect` for derived tab filter state — compute the filtered query key during render.
- `loading.tsx` next to the page file handles the Suspense boundary for initial load (Next.js 16 App Router).

### Context brief
Composite page-section widget assembling the two features + a read view. Tabs: **All / My Works (ORIGINAL) / External (EXTERNAL)** for the private library; plus access to draft submissions. Read view reuses the read-only TipTap renderer at `src/entities/text/lib/render-rich-content/` (study its `render-rich-content.ts` + reader widget `src/widgets/reader-page`). Master-detail pattern exists in `src/widgets/suggestions-page` (`my-text-submission-card.tsx`, `text-submission-detail-panel.tsx`) — match it. Logic in `model/use-*.ts`; one component per file; named `handle*` per item in `.map` (no anon arrow in JSX). Data via `entities/user-text` + `features/text-submission` for drafts. Use `shared/ui` Tabs if present.

**C2 fallback rule (read-side):** the reader/detail must render `contentRich` first, falling back to plain `content` text when `contentRich` is null. **Wrap the rich-content render in an ErrorBoundary** (fix m4) so a malformed TipTap doc cannot crash the page — fall back to a friendly error or the plain `content`.

### Tasks
- `src/widgets/my-texts-page/model/use-my-texts-page.ts`: tab state, filtered queries (`userTextQueryOptions({ type })`), delete handlers, navigation helpers.
- `src/widgets/my-texts-page/ui/my-texts-page.tsx` (top-level).
- `src/widgets/my-texts-page/ui/my-texts-tabs.tsx`.
- `src/widgets/my-texts-page/ui/user-text-card.tsx`.
- `src/widgets/my-texts-page/ui/user-text-list.tsx` (named `handle*` per item).
- `src/widgets/my-texts-page/ui/my-texts-empty-state.tsx`.
- `src/widgets/my-text-reader` (separate widget) `ui/my-text-reader.tsx` + `model/use-my-text-reader.ts`: fetch one UserText (`userTextDetailQueryOptions`), render `content` via the read-only renderer **inside an ErrorBoundary** (m4).
- `src/widgets/my-texts-page/index.ts`, `src/widgets/my-text-reader/index.ts` barrels.

### Verification
- `npx tsc --noEmit`, `npm run lint` pass.
- Tabs filter correctly (All/Works/External); delete removes from list; reader renders TipTap JSON read-only; a deliberately malformed doc shows the ErrorBoundary fallback, not a crash.

### Exit criteria
List widget with three tabs + delete + navigation, and a read-only reader widget (C2 fallback + ErrorBoundary), both compiling, no anon handlers in maps, using `shared/ui`.

---

## Step 10 — Frontend: routes under `/[lang]/my-texts/**` + nav entry

**Depends on:** Step 9 (and Step 8 for the submit routes).
**Model tier:** default.
**Skills:** `/react19` (Server Components as default — fetch session/user in the page server component; `'use client'` pushed down to widgets only), `/vercel-react-best-practices` (avoid waterfalls: prefetch `userTextDetailQueryOptions` in the `[id]` page server component via `queryClient.prefetchQuery`), `/ui-ux-pro-max` (loading skeletons via `loading.tsx`, not spinners; noindex on private pages).

### Performance & Security notes (Step 10)
- **`error.tsx` for ALL six segments (not just `loading.tsx`):** add an `error.tsx` alongside each `loading.tsx`. Each must be `'use client'`, receive `{ error, reset }` props, show a localized error message (`t("common.error")` or equivalent), and a "Try again" button calling `reset()`. Without this, a failed query crashes the route to a white screen with no recovery path.
- **Server-side prefetch:** in the `[id]/page.tsx` and `[id]/edit/page.tsx` server components, call `queryClient.prefetchQuery(userTextDetailQueryOptions(id))` before returning the page shell. This populates the React Query cache before hydration, so the client sees data immediately (no waterfall spinner).
- **Private route protection:** the `(main)` layout already requires authentication (verify in `src/app/[lang]/(main)/layout.tsx`). Do NOT add redundant auth checks in each page — rely on the layout guard. But DO add `notFound()` if `!hasLocale(lang)`.
- **SEO — robots:** `robots: { index: false, follow: false }` on ALL `/my-texts/**` pages. No exceptions. Private content must not appear in Google.
- **SEO — canonical:** even for noindexed private pages, include `alternates.canonical` to prevent any duplicate-content penalty if the page is later made public. Pattern: `https://mott-larbe.com/{lang}/my-texts`.
- **Sitemap exclusion:** open `src/app/sitemap.ts` and confirm it generates routes only from published texts and static pages. Add an explicit exclusion comment for `/my-texts/**` so future developers don't accidentally add it.
- **CLS (Cumulative Layout Shift):** `loading.tsx` skeletons must match the real layout dimensions. The list page skeleton = N card skeletons of the same height as `UserTextCard`. The reader skeleton = title block + content block of approximate content height.
- **Bundle size:** do not import `NotionEditor` in any route that does not need editing (list, reader). Use dynamic import `next/dynamic` with `{ ssr: false }` if the editor is conditionally rendered within a page that also has non-editor content.

### Version notes (Next.js 16.2.5)
- **Read `node_modules/next/dist/docs/`** before writing `generateMetadata` — the exact `Metadata` type and `alternates.languages` shape must match 16.2.5, not earlier versions.
- Page files: `export default async function Page(...)` — default export required by Next.js convention; everything else in this repo uses named exports, but `page.tsx`/`layout.tsx` files are the exception.
- `generateMetadata` is an `async` function (not a static object) when it needs `params` for canonical URLs.
- Private pages: `robots: { index: false, follow: false }` in `generateMetadata`. Also exclude from `src/app/sitemap.ts`.
- `loading.tsx` files: these are automatic Suspense boundaries — no manual `<Suspense>` wrapper needed in the page itself for route-level loading.
- Prefetch on server: import `getQueryClient` from `@/shared/lib/query-client` (check the actual export in that file before using) and call `prefetchQuery` inside the page server component for detail routes (`[id]`, `[id]/edit`, `submit/[id]/edit`) to avoid client-side waterfall.

### Context brief
Thin App-Router pages (Next.js 16.2.5 — verify metadata API shape in `node_modules/next/dist/docs/`). Each page: `generateMetadata` with title/description/openGraph/`alternates` (canonical + hreflang che/ru/en) and a default-export async server component that `notFound()`s on `!hasLocale(lang)` and renders the widget. Pattern reference: `src/app/[lang]/(main)/suggest-text/page.tsx` and the reader page. Routes under `(main)`. Nav: add to `src/widgets/app-shell/lib/nav-config.ts` inside `nav.contribute` (`{ href: ..., icon: <e.g. BookPlus/Library from lucide-react>, labelKey: "nav.myTexts" }`). These pages are user-private → set `robots: { index: false, follow: false }` in their metadata.

### Tasks
- `src/app/[lang]/(main)/my-texts/page.tsx` → `MyTextsPage` widget (list, tabs).
- `src/app/[lang]/(main)/my-texts/new/page.tsx` → `UserTextEditorForm` (create).
- `src/app/[lang]/(main)/my-texts/[id]/page.tsx` → `MyTextReader`.
- `src/app/[lang]/(main)/my-texts/[id]/edit/page.tsx` → `UserTextEditorForm` (edit; prefetch detail).
- `src/app/[lang]/(main)/my-texts/submit/new/page.tsx` → submission editor (new draft; optional `?from=<userTextId>` copy).
- `src/app/[lang]/(main)/my-texts/submit/[id]/edit/page.tsx` → submission editor (edit draft).
- **`loading.tsx` for ALL SIX route segments (M7):** `my-texts`, `my-texts/new`, `my-texts/[id]`, `my-texts/[id]/edit`, `my-texts/submit/new`, `my-texts/submit/[id]/edit` — each a skeleton fallback next to its `page.tsx`.
- **`error.tsx` for ALL SIX route segments:** alongside each `loading.tsx` — `'use client'` component with `{ error, reset }` props, localized error message + "Try again" button calling `reset()`.
- Edit `src/widgets/app-shell/lib/nav-config.ts`: add `my-texts` nav item (`labelKey: "nav.myTexts"`; label added in Step 12).
- `src/app/sitemap.ts`: ensure these private routes are EXCLUDED from the sitemap (they are owner-private + noindexed).

### Verification
- `npm run build` (frontend) succeeds; all six routes compile.
- Manual: navigate each route in dev; nav link appears; each segment has a `loading.tsx`; private pages set `noindex`; routes absent from generated sitemap.

### Exit criteria
Six routes render their widgets; metadata + canonical/hreflang present; private pages noindexed and sitemap-excluded; six `loading.tsx` + six `error.tsx` present; nav link added; build green.

---

## Step 11 — Admin: surface new TextSubmission fields in moderation UI

**Depends on:** Steps 4, 6.
**Model tier:** default. **Parallel with:** Steps 9–10.
**Skills:** `/react19` (no `useMemo`/`useCallback` in the updated hook; additive-only — do not rewrite existing logic), `/shadcn-claude-skill-main` (Badge for new `submissionType`/`licenseType` chips), `/coding-standards` (one new presentational component per new UI block, e.g. `text-submission-license-info.tsx`).

### Performance & Security notes (Step 11)
- **DRAFT exclusion is mandatory for security:** the admin list query must filter `status: { in: ["PENDING", "APPROVED", "REJECTED"] }` (or equivalent). A user's DRAFT must NEVER appear in the admin queue — it is private until submitted.
- **Stats `draft` count:** the existing `GET /stats` returns `{ total, pending, approved, rejected }`. In Step 4, add `draft` to the stats response. In this step, surface the `draft` count in `AdminTextSubmissionsStats` — even as a small chip "N drafts (not visible to admin)" — so admins know submissions exist that are being edited. If the backend Step 4 implementer skipped adding `draft` to stats, flag it here.
- **`contentRich` rendering in admin:** the admin panel renders user-submitted TipTap JSON. Apply the same ErrorBoundary + fallback pattern as Step 9. Consider sanitizing the rendered HTML output if `render-rich-content` produces raw HTML — use DOMPurify or verify the renderer escapes all user content.
- **List vs detail in admin:** the admin list already loads `content` (old flow). After Step 6, `contentRich` is only fetched on the detail view (`GET /:id` admin endpoint). Confirm the admin list query does not accidentally include `contentRich` in the list response (it would double the payload for PENDING submissions).
- **`submissionType` chip in admin list:** show `ORIGINAL` / `EXTERNAL` as a small badge on `TextSubmissionListItem` — helps admins quickly spot personal works vs. external texts and apply different review criteria (copyright check for EXTERNAL, quality check for ORIGINAL).
- **Additive changes only:** do NOT refactor `use-admin-text-submissions-page.ts`. Only add the DRAFT filter and the new field display. Existing approve/reject flow is out of scope.

### Version notes
- This widget is already `'use client'` — no directive changes needed.
- New presentational sub-components (`text-submission-license-info.tsx` etc.) are purely JSX, no hooks → they do NOT need `'use client'` themselves if only used inside an already-client component tree. But add the directive if they receive event handler props.
- Do NOT add `useMemo` to wrap the new field derivations — the compiler handles it.

### Context brief
The admin moderation widget `src/widgets/admin-text-submissions-page/` lists/reviews submissions (`text-submission-review-panel.tsx`, `text-submission-list-item.tsx`, `text-submission-status-badge.tsx`, `admin-text-submissions-stats.tsx`, model hook `use-admin-text-submissions-page.ts`). After Step 6 the `TextSubmission` type carries `submissionType`, `licenseType`, `publicationYear`, `contentRich`, and `DRAFT`. Admin must SEE these; **DRAFT items must NOT appear in the admin queue** (admin reviews PENDING). Approve/reject already works — do not rewrite it; library `Text` creation on approve is existing/out-of-scope.

**C2 fallback rule (read-side):** render `contentRich` first via `src/entities/text/lib/render-rich-content/`, falling back to plain `content`/`sourceUrl` when `contentRich` is null. Wrap the rich render in an ErrorBoundary (consistent with m4).

### Tasks
- Update `text-submission-status-badge.tsx` to handle `DRAFT`; ensure the admin list query excludes DRAFT (confirm/adjust the status filter in `use-admin-text-submissions-page.ts` — admin queue is PENDING/APPROVED/REJECTED only).
- Update `text-submission-review-panel.tsx` to display `submissionType`, `licenseType`, `publicationYear`, and render `contentRich` read-only (C2 fallback to `content`/`sourceUrl`).
- Add small presentational components if the panel grows (one per file): e.g. `text-submission-license-info.tsx`.
- Confirm reject-with-comment still flows (sets `REJECTED`) — verify, no change expected.

### Verification
- `npx tsc --noEmit`, `npm run lint` pass.
- Manual: a PENDING EXTERNAL submission shows license/year + rich content (C2 fallback works for legacy `content`-only rows); DRAFT items absent from admin queue; reject with comment works.

### Exit criteria
Admin panel surfaces all new fields read-only (C2 fallback), DRAFTs excluded from the queue, existing approve/reject untouched, compiles + lints.

---

## Step 12 — i18n: add che / ru / en locale keys

**Depends on:** Steps 7–11.
**Model tier:** default.
**Skills:** none required (JSON editing only). Use `/coding-standards` as a reminder that no hardcoded English strings should remain in any component from Steps 7–11.

### Context brief
All user-facing strings must be localized — no hardcoded text. Locale files: `src/locales/che.json`, `ru.json`, `en.json`. Keys accessed via `t("path.to.key")` (`useI18n`) and `dict.<...>` in server `generateMetadata`. Identical key shape across all three files.

### Performance & Security notes (Step 12)
- **Key collision check:** before adding keys, grep all three locale files for any existing `myTexts` key. If it exists from a previous partial implementation, merge carefully — do not overwrite.
- **No hardcoded strings audit:** after adding keys, grep all new `.tsx`/`.ts` files from Steps 7–11 for any string literals used as UI text (e.g. `"My texts"`, `"Save"`, `"Submit"` in JSX). Every one must use `t("myTexts.…")`.
- **Build verification:** `npm run build` (not just `tsc`) catches missing `t()` key references that TypeScript alone might not catch (depends on i18n typing setup). Run it.

### che.json PROCEDURE (M5 — follow exactly)
**Do NOT touch existing keys. Add ONLY the `myTexts` namespace (plus the two single keys below). Read the current `che.json` first, then append the new keys after the last existing key.** The working tree already has uncommitted `che.json` edits — do NOT clobber them; append only. Apply the identical addition to `ru.json` and `en.json` with translated values, keeping the key tree identical across all three.

### EXACT keys to add (M5 — all three files, same tree)
```
myTexts.title, myTexts.empty, myTexts.tabs.all, myTexts.tabs.myWorks, myTexts.tabs.external
myTexts.create, myTexts.edit, myTexts.delete, myTexts.submit, myTexts.resubmit
myTexts.status.draft, myTexts.status.pending, myTexts.status.approved, myTexts.status.rejected
myTexts.type.original, myTexts.type.external
myTexts.fields.title, myTexts.fields.author, myTexts.fields.language, myTexts.fields.sourceUrl
myTexts.fields.licenseType, myTexts.fields.publicationYear, myTexts.fields.comment
myTexts.license.publicDomain, myTexts.license.cc, myTexts.license.permission, myTexts.license.unknown
myTexts.submit.confirmTitle, myTexts.submit.confirmBody, myTexts.submit.success
myTexts.rejection.label, myTexts.rejection.resubmit
```
Plus the two standalone keys:
```
nav.myTexts            (nav label — add under existing `nav`)
```
And a `DRAFT` status label wherever statuses are already localized (search existing `myTextSubmissions` / admin status label keys and add the `DRAFT` member alongside the existing PENDING/APPROVED/REJECTED labels).
Add `meta` (title/description) sub-keys under `myTexts` for each new route as needed by `generateMetadata`.

### Verification
- `npx tsc --noEmit`, `npm run build` pass.
- Grep check: every new `t("myTexts.…")` / `dict.myTexts.…` key used in Steps 7–11 exists in all three locale files (diff the `myTexts` key sets across che/ru/en — they must be identical).
- App renders each new route in che/ru/en with no raw key strings showing.

### Exit criteria
All new strings localized in che/ru/en with identical key trees; `nav.myTexts` and `DRAFT` status present; existing keys (incl. uncommitted che.json edits) untouched; no hardcoded UI text; build green.

---

## Final acceptance (after Step 12)
- Backend `npm run build` + `npm run migrate:status` clean; both new migrations applied.
- Frontend `npm run build` + `npm run lint` + `npx tsc --noEmit` clean.
- E2E happy path: user creates a UserText → reads it → "submit for publication" **value-copies** it into a DRAFT TextSubmission (original UserText intact, no FK) → user sends draft to moderation → admin sees PENDING with license/rich content (C2 fallback works) → admin rejects with comment (status REJECTED) → user edits & resubmits (review fields cleared) → status PENDING. Private `my-texts` routes are owner-scoped, noindexed, and sitemap-excluded.
