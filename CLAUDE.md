@AGENTS.md

# Project Rules & Coding Standards

## Stack versions — ALWAYS check before writing any code

> **Critical:** This is Next.js 16.2.5 and React 19.2.4. APIs differ significantly from earlier versions. These versions affect every area: routing, components, hooks, forms, SEO metadata, security, server actions, and more. Apply the correct APIs for these exact versions in ALL tasks without exception.

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

## shared/ui — Component Reuse

**Never rewrite UI primitives that already exist in `shared/ui`.**
Before writing any UI element — button, input, table, badge, modal, tooltip, avatar, spinner, dropdown, etc. — first check `shared/ui`. If it exists there, import it. Never use bare HTML elements in feature/widget/page JSX directly.

```tsx
// ❌ wrong — bare HTML, bypasses the design system
const SaveButton = () => (
	<button className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
);

const SearchField = () => (
	<input
		type="text"
		className="border rounded px-3 py-2"
		placeholder="Search..."
	/>
);

// ✅ correct — reuse from shared/ui
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

const SaveButton = () => <Button variant="primary">Save</Button>;

const SearchField = () => <Input type="text" placeholder="Search..." />;
```

### Polymorphic rendering — use `asChild` (Radix/shadcn pattern)

Never create wrapper variants (`LinkButton`, `AnchorButton`). Use `asChild` to delegate rendering to another element.

```tsx
// ❌ wrong — unnecessary wrapper component
const LinkButton = ({ href, children }) => (
	<a href={href} className="btn btn-primary">
		{children}
	</a>
);

// ✅ correct — asChild delegates Button styles to Link
import { Button } from "@/shared/ui/button";
import Link from "next/link";

const ProfileLink = () => (
	<Button asChild>
		<Link href="/profile">Profile</Link>
	</Button>
);
```

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

#### One component per file — enforced

**Never define more than one component in a single file.** This is `react/no-multi-comp` — enforced unconditionally.

```tsx
// ❌ wrong — two components in one file
const Avatar = ({ src }: { src: string }) => <img src={src} />;
const UserCard = ({ user }: { user: User }) => (
  <div><Avatar src={user.avatar} /><span>{user.name}</span></div>
);

// ✅ correct — each component in its own file
// ui/avatar.tsx
export const Avatar = ({ src }: { src: string }) => <img src={src} />;

// ui/user-card.tsx
import { Avatar } from './avatar';
export const UserCard = ({ user }: { user: User }) => (
  <div><Avatar src={user.avatar} /><span>{user.name}</span></div>
);
```

**Only exception:** a props interface stays in the same file as its component — it is not a component.

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

### Component Composition — SRP-driven decomposition

Split a component when it has **multiple independent reasons to change**. Always in combination with the Custom Hooks rule: logic goes into a hook, JSX is then split by visual section.

```tsx
// ✅ Step 1 — Custom Hooks rule: вся логика в хуке
// model/use-admin-side-nav.ts
export const useAdminSideNav = () => {
	const [isExpandedOnSmall, setIsExpandedOnSmall] = useState(false);
	const isCompactMode = !isExpandedOnSmall;
	const handleToggleExpanded = () => setIsExpandedOnSmall(prev => !prev);
	return { isCompactMode, isExpandedOnSmall, handleToggleExpanded };
};

// ❌ Step 2 — без декомпозиции: три независимых секции в одном файле,
//    три причины для изменения — header / контент / toggle
export const AdminSideNav = () => {
	const { isCompactMode, isExpandedOnSmall, handleToggleExpanded } =
		useAdminSideNav();
	return (
		<nav>
			{/* 50 строк header JSX */}
			{/* 60 строк content JSX */}
			{/* 30 строк toggle JSX */}
		</nav>
	);
};

// ✅ Step 2 — SRP: каждая секция — отдельная причина для изменения
// ui/admin-side-nav.tsx
export const AdminSideNav = () => {
	const { isCompactMode, isExpandedOnSmall, handleToggleExpanded } =
		useAdminSideNav();
	return (
		<nav>
			<AdminSideNavHeader isCompactMode={isCompactMode} />
			<AdminSideNavContent isCompactMode={isCompactMode} />
			<AdminSideNavToggle
				isExpandedOnSmall={isExpandedOnSmall}
				onToggle={handleToggleExpanded}
			/>
		</nav>
	);
};

// ui/admin-side-nav-header.tsx — одна причина: изменился внешний вид header
const AdminSideNavHeader = ({ isCompactMode }: { isCompactMode: boolean }) => (
	<div>{/* header JSX */}</div>
);

// ui/admin-side-nav-content.tsx — одна причина: изменился внешний вид контента
const AdminSideNavContent = ({ isCompactMode }: { isCompactMode: boolean }) => (
	<div>{/* nav content JSX */}</div>
);

// ui/admin-side-nav-toggle.tsx — одна причина: изменился внешний вид toggle
const AdminSideNavToggle = ({ isExpandedOnSmall, onToggle }: Props) => (
	<button onClick={onToggle}>{/* toggle JSX */}</button>
);
```

**Two rules, applied in order:**

1. **Custom Hooks** — logic, state, handlers → `model/use-<name>.ts`
2. **Component Composition** — if JSX still has distinct visual sections → split by SRP

Size (~100–150 lines) is a signal, not the rule. A 200-line component with one visual section stays together; a 60-line component with three unrelated sections gets split.

> **Отличие от Container/Presentational:** тот паттерн — про разные источники данных (см. выше). Этот — про визуальные секции с независимыми причинами изменения.

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

### Memoization — React Compiler handles it automatically

Do not use `useMemo` / `useCallback` / `React.memo` for performance. The compiler memoizes automatically.

```tsx
// ❌ wrong — manual memoization everywhere
const processed = useMemo(() => transform(data), [data]);
const handleClick = useCallback(() => submit(processed), [processed]);

// ✅ correct — write plain code, compiler optimises
const processed = transform(data);
const handleClick = () => submit(processed);

// ✅ exception only: semantically stable refs, heavy computations (10k+ sort, d3, canvas)
const sorted = useMemo(() => hugeList.sort(comparator), [hugeList]);
```

### forwardRef — do not use

`ref` is now a regular prop in React 19.

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

| Old pattern | React 19 |
|---|---|
| `useContext(ctx)` | `use(ctx)` — works in conditionals and loops |
| multiple `useState` for form | `useActionState()` |
| manual optimistic state | `useOptimistic()` |
| prop-drilled form pending | `useFormStatus()` |

### useActionState — replaces manual form state

```tsx
// ❌ wrong — three useState for one form
const [isPending, setIsPending] = useState(false);
const [error, setError] = useState<string | null>(null);
const handleSubmit = async (e) => {
  setIsPending(true);
  try { await submit(e) } catch (err) { setError(err.message) }
  finally { setIsPending(false) }
};

// ✅ correct
import { useActionState } from 'react';

type State = { success: boolean; error: string | null };

const [state, formAction, isPending] = useActionState<State, FormData>(
  async (prev, formData) => {
    try {
      await submitForm(formData);
      return { success: true, error: null };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  },
  { success: false, error: null }
);

return (
  <form action={formAction}>
    <SubmitButton />
    {state.error && <p>{state.error}</p>}
  </form>
);
```

### useFormStatus — must be inside a child of `<form>`

```tsx
// ❌ wrong — same level as <form>, doesn't work
const BadForm = () => {
  const { pending } = useFormStatus(); // ← not connected to the form below!
  return <form action={action}><button disabled={pending}>Submit</button></form>;
};

// ✅ correct — SubmitButton is a child rendered inside <form>
const SubmitButton = () => {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Sending…' : 'Submit'}</button>;
};

const GoodForm = () => (
  <form action={formAction}>
    <input name="title" />
    <SubmitButton />
  </form>
);
```

### useOptimistic — instant UI, auto-rollback on error

```tsx
// ❌ wrong — user waits for server
const handleLike = async () => {
  const newCount = await likePost(postId);
  setLikeCount(newCount);
};

// ✅ correct
const [optimisticLikes, addOptimisticLike] = useOptimistic(
  likes,
  (current, increment: number) => current + increment
);
const handleLike = async () => {
  addOptimisticLike(1);             // instant UI update
  try { await likePost(postId); }
  catch { /* React auto-reverts */ }
};

// ⚠️ never use useOptimistic for critical operations (payments, destructive deletes)
```

### Server Actions — `'use server'` in `api/` layer

```tsx
// features/post-form/api/actions.ts
'use server';
import { revalidatePath } from 'next/cache';

export const createPost = async (prev: unknown, formData: FormData) => {
  await db.posts.create({ data: { title: formData.get('title') as string } });
  revalidatePath('/posts');
  return { success: true };
};

// features/post-form/ui/post-form.tsx
'use client';
export const PostForm = () => {
  const [state, formAction, isPending] = useActionState(createPost, null);
  return (
    <form action={formAction}>
      <input name="title" />
      <SubmitButton />
    </form>
  );
};
```

### Server Components & Directives

- Server Components are the **default**. No `'use client'` unless hooks or event handlers are needed.
- `'use server'` marks **Server Actions only** — never put it on a Server Component file.
- **Never put `'use client'` on a layout** — it makes the entire subtree client-side.
- Fetch data directly in Server Components with `async/await`. Do not use hooks for fetching there.

```tsx
// ❌ wrong — 'use client' on layout poisons the whole tree
'use client';
export default function Layout({ children }) { return <div>{children}</div>; }

// ✅ correct — 'use client' only on the leaf that needs interactivity
// features/counter/ui/counter.tsx
'use client';
export const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
};

// app/page.tsx — stays a Server Component
export default async function Page() {
  const data = await fetchData();
  return <div><h1>{data.title}</h1><Counter /></div>;
}
```

### Document Metadata — native, no react-helmet

```tsx
// ✅ React hoists these to <head> automatically
<title>Page Title</title>
<meta name="description" content="..." />
```

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

## TanStack Query v5 — Patterns

### queryOptions — single source of truth

Never inline `queryKey` + `queryFn` directly in `useQuery`. Always define them once with `queryOptions()` and reuse everywhere:

```tsx
// ❌ wrong — key and fn duplicated across call sites
useQuery({ queryKey: ['users', id], queryFn: () => fetchUser(id) })
queryClient.prefetchQuery({ queryKey: ['users', id], queryFn: () => fetchUser(id) })

// ✅ correct — defined once in entities/user/model/queries.ts
export const userQueryOptions = (id: string) =>
  queryOptions({ queryKey: ['entities', 'user', id], queryFn: () => fetchUser(id), staleTime: 1000 * 60 * 5 })

// Used everywhere:
useQuery(userQueryOptions(id))
queryClient.prefetchQuery(userQueryOptions(id))
```

### queryKey must include all parameters

Every value the `queryFn` depends on must be in `queryKey`:

```tsx
// ❌ wrong — filters ignored in cache key
useQuery({ queryKey: ['items'], queryFn: () => fetchItems(filters) })

// ✅ correct
useQuery({ queryKey: ['items', filters], queryFn: () => fetchItems(filters) })
```

### staleTime must always be set explicitly

Default `staleTime: 0` causes refetch on every mount. Always configure intentionally.

### useSuspenseQuery — no `enabled`, condition goes to parent

```tsx
// ❌ wrong — enabled not supported in useSuspenseQuery
const { data } = useSuspenseQuery({ ...opts, enabled: !!userId })

// ✅ correct — guard in the parent, pass guaranteed value down
if (!userId) return <NoUserSelected />
// ↓ child receives guaranteed userId: string
const { data } = useSuspenseQuery(userQueryOptions(userId))
```

Always wrap `useSuspenseQuery` consumers in both `<Suspense>` and `<ErrorBoundary>`.

### isPending vs isLoading

- `isPending` — no data in cache yet (first load). Use this for skeleton screens.
- `isFetching` — request in flight (includes background refetches).
- `isLoading` — `isPending && isFetching`.

---

## useEffect — Rules

Three cases where `useEffect` is wrong:

**1. Derived state — compute during render instead:**
```tsx
// ❌ wrong
useEffect(() => { setFiltered(items.filter(i => i.active)) }, [items])

// ✅ correct
const filtered = items.filter(i => i.active)
```

**2. Event side-effects — put in the handler instead:**
```tsx
// ❌ wrong
useEffect(() => { if (query) analytics.track('search', { query }) }, [query])

// ✅ correct
const handleSearch = (q: string) => { setQuery(q); analytics.track('search', { query: q }) }
```

**3. Async fetch — always include cleanup and full deps:**
```tsx
// ❌ wrong — missing userId dep, no cancel
useEffect(() => { fetchUser(userId).then(setUser) }, [])

// ✅ correct
useEffect(() => {
  let cancelled = false
  fetchUser(userId).then(data => { if (!cancelled) setUser(data) })
  return () => { cancelled = true }
}, [userId])
```

---

## Suspense & Streaming

Wrap independent async sections in their own `<Suspense>` boundaries — never one boundary for the whole layout:

```tsx
// ❌ wrong — one boundary blocks entire screen
<Suspense fallback={<Spinner />}><Header /><MainContent /><Sidebar /></Suspense>

// ✅ correct — independent streaming
<>
  <Header />
  <Suspense fallback={<ContentSkeleton />}><MainContent /></Suspense>
  <Suspense fallback={<SidebarSkeleton />}><Sidebar /></Suspense>
</>
```

Every `<Suspense>` must be wrapped in `<ErrorBoundary>`. Use skeleton fallbacks, not spinners.

Use `loading.tsx` in Next.js App Router as an automatic Suspense boundary for the route segment.

### use() hook — promise must be created outside the component

```tsx
// ❌ wrong — new promise on every render, Suspense loops
const data = use(fetchComments(postId))

// ✅ correct — promise created outside, passed as prop
function Post({ postId }) {
  const commentsPromise = fetchComments(postId) // outside (or useMemo)
  return <Suspense fallback={<Skeleton />}><Comments promise={commentsPromise} /></Suspense>
}
function Comments({ promise }) {
  const comments = use(promise)
  return <ul>{comments.map(...)}</ul>
}
```

Prefer `useSuspenseQuery` from TanStack Query over raw `use()` for data fetching.

---

## FSD — Import Rules

- Import slices only through their public barrel: `import { X } from '@/entities/user'`, never `import { X } from '@/entities/user/model/queries'`.
- `queryOptions` live in `model/`, Server Actions in `api/`, components in `ui/`.
- Layers import only downward: `app → widgets → features → entities → shared`. Never upward.

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
