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

## Separation of Concerns

### Custom Hooks — primary approach

All logic (state, effects, derived data, async calls, event handlers) lives in a custom hook. The component is a pure render function: it calls the hook and returns JSX.

```ts
// features/auth/model/use-login-form.ts
export const useLoginForm = () => {
  const [email, setEmail] = useState('')
  const { mutate, isPending } = useMutation({ ... })
  const handleSubmit = (e: SyntheticEvent) => { ... }
  return { email, setEmail, isPending, handleSubmit }
}

// features/auth/ui/LoginForm.tsx
const LoginForm = () => {
  const { email, setEmail, isPending, handleSubmit } = useLoginForm()
  return <form onSubmit={handleSubmit}>...</form>
}
```

This is the **default pattern** for all Client Components.

### Component Decomposition — default bias: split

Small, focused files are always preferred over large ones. When in doubt — extract.
Hesitate to keep things together, not to split them apart.

Extract into a **separate file** when **any** of the following is true:

- **Named** — it has a name and a clear props interface, even if used only once.
- **Reuse** — the same JSX block appears in more than one place (DRY).
- **Responsibility** — it has its own distinct meaning (SRP).
- **Logic** — it contains event handlers, derived state, or conditional rendering.
- **Data / config** — it is a function or array that produces JSX config or static data.

#### What may stay inline

Only truly anonymous JSX with zero props and zero logic may stay inline in the parent file.
As soon as a piece of JSX or logic gets a name — it gets its own file.

#### File structure inside a slice

Named sub-components → `ui/`, utilities and config → `lib/`, hooks → `model/`:

#### Config and data arrays — extract to `lib/`

Any named array or object that builds config, options, or action descriptors belongs in `lib/`,
even if it depends on runtime arguments like `t` or `editor`.
A function that returns an array is still config — not logic — and does not belong in a hook or component.

#### Types — extract to a dedicated file

All named types and interfaces that are shared across more than one file in a slice
belong in `model/types.ts`.

**Exception: props interfaces stay in the same file as their component.**
A props type is part of the component's definition — it is never extracted.

```
// ✅ props interface stays with the component
interface ButtonProps { ... }
const Button = ({ ... }: ButtonProps) => { ... }

// ❌ shared types do not live in a component or hook file
type ToolbarActionIconKey = "bold" | "italic" | ...  // → model/types.ts
interface ToolbarActionItem { ... }                   // → model/types.ts
```

Keep components small and focused. Extract a part into a separate component when **any** of the following is true:

- **Size** — the file exceeds ~100–150 lines.
- **Reuse** — the same JSX block appears in more than one place (DRY).
- **Responsibility** — the block has its own distinct meaning and can be reasoned about independently (SRP).
- **Readability** — the JSX nesting is deep enough that the parent becomes hard to scan.

This project follows **Atomic Design**:

```
atoms      → shared/ui/button, shared/ui/input, shared/ui/badge …
molecules  → shared/ui/input-group, shared/ui/modal …
organisms  → entities/*/ui/*, features/*/ui/* (assembled from atoms + molecules)
templates  → widgets/* (page sections assembled from organisms)
pages      → app/* (thin orchestrators)
```

Place extracted components at the appropriate Atomic Design level inside the FSD layer they belong to. Do **not** extract prematurely — three similar lines are better than a premature abstraction.

```tsx
// ❌ one giant component
const ProfilePage = () => (
	<div>
		{/* 50 lines of avatar + bio JSX */}
		{/* 60 lines of stats JSX */}
		{/* 40 lines of activity feed JSX */}
	</div>
);

// ✅ decomposed
const ProfilePage = () => (
	<div>
		<ProfileHeader />
		<ProfileStats />
		<ActivityFeed />
	</div>
);
```

### Handler Extraction — always extract event handlers

Never pass anonymous functions directly in JSX for any event (`onClick`, `onChange`, `onSubmit`, `onKeyDown`, etc.). Always extract event handlers into named `handle*` functions inside the hook or component body.

```tsx
// ❌ inline handlers
<button onClick={() => setOpen(true)}>Open</button>
<input onChange={e => setValue(e.target.value)} />
<form onSubmit={e => { e.preventDefault(); save() }}>

// ✅ extracted handlers
const handleOpen = () => setOpen(true)
const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); save() }

<button onClick={handleOpen}>Open</button>
<input onChange={handleValueChange} />
<form onSubmit={handleSubmit}>
```

This keeps JSX readable and gives a named location to add logic later without restructuring.

### Container/Presentational (Smart/Dumb) — use only when justified

Use this pattern only when there is a clear reason: the same presentational component is reused with different data sources, or the component needs to be tested in Storybook in isolation without any data-fetching context.

```ts
// ✅ justified: ProductCard is reused in search results, recommendations, and cart
const ProductCardContainer = ({ id }: { id: string }) => {
  const product = useProduct(id)
  return <ProductCard product={product} />
}

const ProductCard = ({ product }: { product: Product }) => (
  <div>...</div>
)
```

Do **not** split a component into container + presentational just because it fetches data — a custom hook already solves that.

---

## React Imports

Always use named imports from `react`. Never use the `React.*` namespace.

```tsx
// ❌ wrong
React.ComponentProps;
React.ReactNode;
React.FC;
React.useState;
React.useRef;
React.MouseEvent;
React.CSSProperties;
React.HTMLAttributes;

// ✅ correct
import {
	ComponentProps,
	ReactNode,
	FC,
	useState,
	useRef,
	MouseEvent,
	CSSProperties,
	HTMLAttributes,
} from "react";
```

---

## Event Handlers

Always use `e.currentTarget` instead of `e.target` in event handlers.

```tsx
// ❌ wrong
const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
	e.target.value;
};

// ✅ correct
const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
	e.currentTarget.value;
};
```

`e.currentTarget` always refers to the element the handler is attached to and is correctly typed by TypeScript. `e.target` can be any descendant element and loses type safety.

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

## React 19 — Rules & Best Practices

Project uses **React 19** (stable, released December 5, 2024).

### Memoization — do not use manually

React Compiler handles memoization automatically.

```ts
// ❌ wrong
useMemo(() => compute(a, b), [a, b]);
useCallback(fn, [deps]);
memo(MyComponent);

// ✅ exception only: explicitly heavy computations (sorting 10k+ items, d3, canvas)
```

### forwardRef — do not use

`ref` now works as a regular prop.

```tsx
// ❌ wrong
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => (
	<input ref={ref} {...props} />
));

// ✅ correct
const Input = ({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) => (
	<input ref={ref} {...props} />
);
```

### New hooks — use instead of old patterns

| Old pattern               | React 19           |
| ------------------------- | ------------------ |
| `useContext()`            | `use(Context)`     |
| manual form state         | `useActionState()` |
| manual optimistic UI      | `useOptimistic()`  |
| prop drilling form status | `useFormStatus()`  |

```tsx
// use() — works in conditionals and loops
const user = use(UserContext);
const data = use(fetchDataPromise); // + Suspense

// useActionState() — for forms
const [state, action, isPending] = useActionState(submitForm, initialState);

// useOptimistic() — optimistic UI
const [optimisticList, addOptimistic] = useOptimistic(list);

// useFormStatus() — parent form status
const { pending } = useFormStatus();
```

### Actions — instead of onSubmit

```tsx
// ❌ wrong
<form onSubmit={handleSubmit}>

// ✅ correct
<form action={submitAction}>
```

### Document Metadata — native, no react-helmet

```tsx
// ✅ works directly inside a component — React hoists to <head>
<title>Page Title</title>
<meta name="description" content="..." />
```

### Resource Loading APIs

```tsx
import { preload, preinit } from "react-dom";

preload("/fonts/font.woff2", { as: "font" });
preinit("/scripts/analytics.js", { as: "script" });
```

### Server Components & Directives

- Server Components are the **default** in Next.js App Router.
- Add `'use client'` **only** when hooks or interactivity are required.
- `'use server'` is for **Server Actions only** — not for Server Components.
- Think twice before adding `'use client'`.

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
