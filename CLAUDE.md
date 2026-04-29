@AGENTS.md

# Project Rules & Coding Standards

## Stack versions

- **Next.js**: 16.2.5 — before writing any code, read `node_modules/next/dist/docs/` for current API. APIs differ from earlier versions.
- **React**: 19.2.4 — use React 19 APIs (use(), useOptimistic, useActionState, etc. where appropriate).
- **TypeScript**, Tailwind CSS v4, shadcn/ui (radix-ui), TanStack Query v5, Zustand v5.

---

## Architecture: Feature-Sliced Design (FSD)

The project follows strict FSD layering. Layers from top (most dependent) to bottom (least dependent):

```
src/
  app/          ← Next.js App Router (routing, layouts, providers, metadata)
  widgets/      ← Composite UI blocks assembled from features + entities
  features/     ← User interactions with business value (auth, search, favorites, …)
  entities/     ← Business domain models (user, dictionary, …)
  shared/       ← Reusable infra: ui/, api/, lib/, config/, types/
```

**Rules:**

- A layer may only import from layers **below** it. `features` → `entities` → `shared` ✓. Never the reverse.
- Each slice has `ui/`, `model/` (hooks/store), `api/`, `lib/` sub-folders as needed, plus a barrel `index.ts`.
- Do not place business logic in `app/` — keep pages as thin orchestrators.
- Do not create new files outside these layers without explicit reason.

### Segment internals: group by purpose, not by technical type

Inside `lib/` and `model/` (both in `shared/` and inside slices), **never create folders named after technical types** like `hooks/`, `utils/`, `helpers/`, `types/`, `constants/`. This is an anti-pattern in FSD — it's the layered structure FSD is explicitly moving away from.

Instead, group files by **what they do** (the domain/topic they solve):

```
shared/lib/
  debounce/              ← useDebounce + pure debounce + types, all together
    use-debounce.ts
    debounce.ts
    index.ts
  media-query/
    use-media-query.ts
    index.ts
  split-leading-digits.ts  ← single-file utilities stay flat
  utils.ts
```

```
features/search/model/
  query/                 ← everything about the search query
    use-search-query.ts
    query-store.ts
    index.ts
  filters/
    use-filters.ts
    filter-schema.ts
    index.ts
  use-search.ts          ← top-level orchestration hook stays flat
```

**Rule of thumb:** one file → keep it flat in `lib/` or `model/`. Two or more files that solve the same task (hook + pure helper + types) → wrap them in a topic folder. A hook is an implementation detail of the task it solves, not its own category.

---

## Functions & Components

- **Always use Arrow Functions** — never `function` declarations for components, hooks, or utilities.

  ```ts
  // ✅ correct
  const MyComponent = () => { ... }
  const useMyHook = () => { ... }
  const formatDate = (date: Date) => { ... }

  // ❌ wrong
  function MyComponent() { ... }
  function useMyHook() { ... }
  ```

- **Extract logic into custom hooks** (Client Components only — hooks cannot be used in Server Components). Components contain only JSX and event wiring. Any state, effects, derived data, or async calls go into a `use<Name>.ts` hook inside the slice's `model/` folder.

  ```ts
  // features/search/model/useSearch.ts
  export const useSearch = () => { ... }

  // features/search/ui/SearchBar.tsx
  const SearchBar = () => {
    const { query, results, handleChange } = useSearch()
    return <input value={query} onChange={handleChange} />
  }
  ```

- Components are named with **PascalCase**, hooks with **camelCase** prefixed `use`.
- Prefer named exports. Default exports only in `app/` page/layout files (Next.js requirement).

---

## SEO Best Practices (Next.js App Router)

- **Every page must export metadata** — either a static object or a dynamic async function. Check the exact API shape in `node_modules/next/dist/docs/` (it may differ from earlier versions). The metadata must include at minimum: title, description, openGraph, and `alternates` with canonical URL and `hreflang` for all `[lang]` routes (che / ru / en).
- Use **semantic HTML**: `<main>`, `<nav>`, `<article>`, `<section>`, `<h1>`–`<h6>` in correct hierarchy. One `<h1>` per page.
- Images must use `next/image` with explicit `width`, `height`, and meaningful `alt` text. Never bare `<img>`.
- Links must use `next/link`. Never bare `<a>` for internal navigation.
- `robots.ts` and `sitemap.ts` live in `src/app/` and must be kept up to date when new routes are added.
- Structured data (JSON-LD) goes in a `<script type="application/ld+json">` inside the relevant page/layout, not in `_document`.
- Canonical URLs and `hreflang` for all `[lang]` routes (che / ru / en) are mandatory.
- Core Web Vitals: prefer Server Components for static content; use `loading.tsx` for Suspense boundaries; avoid layout shift by sizing all media.

---

## TypeScript

- No `any`. Use `unknown` and narrow with type guards.
- Define shared domain types in `src/shared/types/` or the entity's `model/` — not inline in components.
- Prefer `interface` for object shapes that may be extended; `type` for unions, intersections, and primitives.

---

## Styling

- Tailwind CSS v4 only. No inline styles, no CSS modules unless absolutely unavoidable.
- Use `cn()` (`clsx` + `tailwind-merge`) for conditional classes.
- Variants via `class-variance-authority` (CVA) for components with multiple visual states.

---

## State & Data Fetching

- **Server-rendered data**: use async Server Components with `fetch()`. Add `loading.tsx` siblings for Suspense boundaries. Do not use hooks here.
- **Client-side remote data** (requires reactivity, caching, refetching): TanStack Query v5 (`useQuery`, `useMutation`) inside Client Components. Query keys are typed arrays defined in the entity/feature `api/` folder.
- **Client/UI state**: Zustand v5. Stores live in `shared/` or the feature's `model/` folder.

---

## i18n

- Routing is handled via `[lang]` dynamic segment (che / ru / en).
- Translations come from `src/locales/`. Access via `src/i18n/` utilities.
- All user-facing strings must be localised — no hardcoded English text in components.

---

## General

- Keep files small and focused: one component or one hook per file.
- No unused imports, no commented-out code.
- Do not add features, refactors, or improvements beyond what is explicitly asked.
