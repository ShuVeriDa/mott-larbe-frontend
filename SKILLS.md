# Skills — Справочник

## Как работают скиллы

`/skill-name` в начале сообщения — Claude загружает правила скилла и применяет их к задаче.

Два режима использования:

- **Написать новое** — скилл направляет как писать правильно
- **Проверить существующее** — скилл проверяет реализацию и исправляет отклонения

---

## /react19

**Когда:** любой React/Next.js код — компоненты, хуки, формы, data fetching, FSD структура.

### Написать новое

```
/react19 напиши хук для пагинации в src/features/dictionary/model/
```

```
/react19 создай форму логина в src/features/auth/ui/ с useActionState и Server Action
```

### Проверить реализацию

```
/react19 проверь src/features/auth/ui/login-form.tsx — правильно ли использован useActionState,
нет ли нарушений FSD, все ли хуки на верхнем уровне
```

```
/react19 проверь src/widgets/reader-body/ рекурсивно по импортам —
соответствие React 19, FSD слоям, Server/Client Components. Исправь.
```

```
/react19 проверь страницу src/app/[lang]/reader/page.tsx и все компоненты которые она использует.
Составь список файлов по импортам, затем проверь каждый. Исправь несоответствия.
```

```
/react19 проверь все файлы из git diff на соответствие правилам. Исправь.
```

### Что проверяет

- Хуки не вызываются условно / в циклах
- `useActionState` вместо набора `useState` для форм
- `useFormStatus` внутри дочернего компонента `<form>`, не на том же уровне
- `useOptimistic` не используется для критических операций
- `'use client'` только на листовых компонентах, не на layout
- Server Actions в `api/`, компоненты в `ui/`, хуки в `model/`
- Импорты только через `index.ts` слайса
- `queryOptions()` как единый источник, `staleTime` явно задан
- `useSuspenseQuery` без `enabled`, обёрнут в `<Suspense>` + `<ErrorBoundary>`
- `useEffect` не используется для производного состояния или событий

---

## /vercel-react-best-practices

**Когда:** страница медленная, bundle большой, много ре-рендеров, оптимизация загрузки.

### Проверить реализацию

```
/vercel-react-best-practices проверь src/app/[lang]/reader/page.tsx —
нет ли waterfall запросов, правильно ли расставлены Suspense границы
```

```
/vercel-react-best-practices проверь src/widgets/dictionary-list/ —
не ли лишних ре-рендеров, правильно ли устроен data fetching
```

```
/vercel-react-best-practices в src/features/search/ есть подозрение на waterfall —
проверь и исправь на параллельные запросы
```

### Что проверяет

- Waterfall запросов (последовательные fetch вместо параллельных)
- Bundle size: barrel imports, dynamic imports для тяжёлых компонентов
- Дублирование данных в RSC props
- Статичные данные (шрифты, иконки) не вынесены на уровень модуля
- Лишние ре-рендеры из-за нестабильных ссылок в пропсах

---

## /shadcn-ui

**Когда:** добавляешь shadcn компонент, строишь форму с валидацией, data table, настраиваешь тему.

### Написать новое

```
/shadcn-ui создай форму регистрации с полями email, password, confirm password.
Валидация через Zod, submit через Server Action
```

```
/shadcn-ui создай data table для src/features/admin/ui/ — колонки: имя, email, роль, дата.
Сортировка и пагинация
```

### Проверить реализацию

```
/shadcn-ui проверь src/features/auth/ui/login-form.tsx —
правильно ли подключен React Hook Form, корректна ли Zod схема, верные ли импорты shadcn
```

```
/shadcn-ui проверь темизацию в src/app/globals.css —
используются ли oklch переменные, корректен ли dark mode
```

### Что проверяет

- Компоненты установлены через `npx shadcn@latest add`, не через npm
- Импорты из `@/components/ui/...`
- Формы используют React Hook Form + Zod + shadcn Form компоненты
- CSS переменные в oklch формате
- `"use client"` там где нужен интерактив

---

## /frontend-design

**Когда:** нужно уйти от generic AI-look, выбрать визуальный стиль, типографику, цветовую схему.

### Написать новое

```
/frontend-design создай landing page для словаря чеченского языка.
Стиль — культурный, самобытный, не generic. Tailwind + shadcn
```

```
/frontend-design предложи типографику и цветовую схему для читалки текстов.
Акцент на читаемость, минимализм
```

### Проверить реализацию

```
/frontend-design проверь src/widgets/hero/ — выглядит ли как generic AI-дизайн?
Что улучшить чтобы выглядело уникально
```

### Что проверяет

- Нет generic шрифтов (Inter, Roboto, Arial)
- Нет типичных AI-паттернов (фиолетовые градиенты, centered layout везде)
- Есть чёткое эстетическое направление
- Типографика, цвет, spacing работают как система

---

## /ui-ux-pro-max

**Когда:** ревью UX, проверка accessibility, touch targets, анимации, цветовые палитры.

### Проверить реализацию

```
/ui-ux-pro-max проверь src/shared/ui/button.tsx на accessibility —
contrast ratio, aria-label, keyboard navigation, focus states
```

```
/ui-ux-pro-max проверь src/features/auth/ui/login-form.tsx —
видны ли лейблы, корректно ли показываются ошибки, есть ли feedback при submit
```

```
/ui-ux-pro-max проверь анимации в src/widgets/sidebar/ —
правильный ли timing (150-300ms), используется ли transform/opacity
```

### Что проверяет

- Контраст текста ≥ 4.5:1
- Touch targets ≥ 44×44px
- Видимые focus states
- Ошибки формы рядом с полем, не только наверху
- Анимации 150-300ms, только transform/opacity
- Скелетон вместо спиннера для загрузки > 300ms

---

## /api-design

**Когда:** проектируешь новый endpoint, добавляешь пагинацию, делаешь публичный API.

### Написать новое

```
/api-design спроектируй endpoint для получения списка слов словаря с пагинацией,
фильтрацией по категории и поиском
```

### Проверить реализацию

```
/api-design проверь src/app/api/dictionary/ — правильные ли URL, HTTP методы,
статус коды, формат ответов и ошибок
```

```
/api-design проверь src/app/api/suggestions/route.ts —
есть ли валидация input, правильные ли статус коды, не течёт ли стек в ошибках
```

### Что проверяет

- URL: множественное число, kebab-case, без глаголов
- Правильные HTTP статус коды (не 200 для всего)
- Формат ошибок с `code` и `message`
- Пагинация (offset или cursor)
- Валидация входящих данных через Zod
- `Location` header при 201 Created

---

## /postgres-patterns

**Когда:** пишешь SQL запросы, миграции, настраиваешь индексы или RLS в Supabase.

### Написать новое

```
/postgres-patterns напиши миграцию для таблицы suggestions —
поля: id, word_id, user_id, proposed_translation, status, created_at
```

### Проверить реализацию

```
/postgres-patterns проверь миграции в supabase/migrations/ —
есть ли нужные индексы, корректен ли RLS, нет ли SELECT *
```

```
/postgres-patterns этот запрос работает медленно — проверь и оптимизируй:
SELECT * FROM words WHERE translation LIKE '%search%'
```

### Что проверяет

- Индексы на часто фильтруемых и join полях
- RLS политики на всех таблицах с пользовательскими данными
- `SELECT` только нужных колонок, не `*`
- Cursor-based пагинация для больших таблиц
- Правильные типы данных (uuid, timestamptz)

---

## /security-review

**Когда:** добавляешь auth, создаёшь API endpoint, работаешь с пользовательским вводом.

### Проверить реализацию

```
/security-review проверь src/features/auth/ — безопасна ли реализация логина,
правильно ли хранятся токены, есть ли защита от brute force
```

```
/security-review проверь src/app/api/suggestions/route.ts —
валидируется ли input, авторизован ли пользователь, не течёт ли чувствительная информация
```

```
/security-review проверь все API routes в src/app/api/ —
есть ли аутентификация там где нужна, корректна ли авторизация
```

### Что проверяет

- Валидация всего пользовательского ввода (Zod)
- Аутентификация на защищённых endpoints
- Авторизация: пользователь имеет доступ только к своим данным
- Секреты не попадают в client bundle
- Нет SQL injection, XSS, CSRF уязвимостей
- Ошибки не раскрывают внутренние детали

---

## /verification-loop

**Когда:** завершил фичу, перед созданием PR, после большого рефакторинга.

### Использование

```
/verification-loop
```

Запускать без аргументов — скилл сам проверит build, types, lint, tests, security, diff.

---

## /code-review

**Когда:** хочешь ревью текущих изменений перед коммитом.

### Использование

```
/code-review           — найти проблемы, не исправлять
/code-review --fix     — найти и исправить
/code-review --fix high  — только высокоприоритетные проблемы
```

---

## /blueprint

**Когда:** задача на несколько PR или сессий — нужен пошаговый план.

### Использование

```
/blueprint реализовать систему избранных слов: сохранение, синхронизация с сервером,
отображение в профиле, экспорт
```

Вернёт пошаговый план где каждый шаг можно выполнить отдельно.

**Не использовать** для задач на один PR — избыточно.

---

## /webapp-testing и /verify

**Когда:** нужно проверить что UI реально работает в браузере.

```
/verify убедись что форма логина корректно показывает ошибки валидации
```

```
/webapp-testing сделай скриншот страницы /ru/reader и проверь что нет layout shift
```

---

## Workflows

> Все workflows следуют одному порядку: **Архитектура → Качество → Производительность → Безопасность → Верификация**

---

### Много изменений перед PR

**Когда:** перед открытием PR, затрагивающего несколько файлов или фич.

```
# 1. Архитектура
/react19 проверь все файлы из git diff на соответствие правилам. Исправь.

# 2. Качество
/code-review --fix high

# 3. Производительность (если diff затрагивает data fetching или тяжёлые компоненты)
/vercel-react-best-practices проверь изменённые файлы из git diff

# 4. Безопасность (если diff затрагивает API routes, auth или пользовательский ввод)
/security-review проверь все изменённые API routes и auth файлы из git diff

# 5. Верификация
/verification-loop
```

---

### Новая фича с UI

**Когда:** создание нового feature-слайса с компонентами, формой и стилями.

```
# 1. Архитектура
/react19 проверь src/features/[name]/ рекурсивно — FSD слои, Server/Client split,
useActionState для форм, queryOptions. Исправь.

# 2. Качество (если есть shadcn компоненты или формы)
/shadcn-ui проверь src/features/[name]/ui/ — подключение компонентов, Zod схема, импорты

# 3. Производительность (если есть data fetching)
/vercel-react-best-practices проверь src/features/[name]/ — waterfall, ре-рендеры

# 4. UX / Безопасность
/ui-ux-pro-max проверь src/features/[name]/ui/ — contrast, touch targets, focus states,
form error placement, animation timing

# 5. Верификация
/verification-loop
```

---

### Новый API endpoint

**Когда:** добавление нового Next.js API route или Server Action.

```
# 1. Архитектура (REST-контракт)
/api-design проверь src/app/api/[name]/route.ts — URL, HTTP методы, статус коды,
формат ответов и ошибок, пагинация

# 2. Качество
/code-review --fix src/app/api/[name]/route.ts

# 3. Безопасность (обязательно для каждого endpoint)
/security-review проверь src/app/api/[name]/route.ts — валидация input, аутентификация,
авторизация, утечка чувствительных данных

# 4. Верификация
/verification-loop
```

---

### Новая страница

**Когда:** добавление новой страницы в Next.js App Router с data fetching, SEO и компонентами.

```
# 1. Архитектура
/react19 проверь src/app/[lang]/[page]/page.tsx и все компоненты которые она использует.
Составь список файлов по импортам, затем проверь каждый. Исправь.

# 2. Качество
/code-review --fix src/app/[lang]/[page]/

# 3. Производительность
/vercel-react-best-practices проверь src/app/[lang]/[page]/page.tsx — waterfall запросы,
Suspense boundaries, дублирование данных в RSC props

# 4. UX + Безопасность (если страница делает user-specific вызовы)
/ui-ux-pro-max проверь src/app/[lang]/[page]/page.tsx — heading hierarchy, contrast,
keyboard nav, loading states
/security-review проверь API routes и Server Actions используемые на этой странице

# 5. Верификация
/verification-loop
```

---

### Работа с базой данных

**Когда:** написание миграций, запросов или настройка RLS в Supabase.

```
# 1. Архитектура (схема, индексы, RLS)
/postgres-patterns проверь supabase/migrations/ — индексы на FK и filter-полях,
RLS на всех таблицах с пользовательскими данными, типы данных, нет ли SELECT *

# 2. Качество
/code-review --fix supabase/migrations/

# 3. Безопасность (если таблицы содержат пользовательские данные)
/security-review проверь RLS политики и API routes которые используют изменённые таблицы

# 4. Верификация
/verification-loop
```

---

### Рефакторинг существующего кода

**Когда:** очистка или реструктуризация без добавления новых фич.

```
# 1. Архитектура
/react19 проверь src/features/[name]/ — нарушения FSD, неправильные хуки,
устаревшие паттерны (forwardRef, ручная мемоизация). Исправь.

# 2. Качество
/code-review --fix

# 3. Производительность (если рефакторинг затрагивает data fetching или тяжёлые компоненты)
/vercel-react-best-practices проверь рефакторенные файлы — waterfall, ре-рендеры, barrel imports

# 4. Верификация (безопасность не нужна — новый код не добавлялся)
/verification-loop
```

---

### Аудит страницы и её дерева

**Когда:** глубокий аудит одной страницы и всех импортируемых ею компонентов.

```
# 1. Архитектура
/react19 проверь src/app/[lang]/[page]/page.tsx и все компоненты которые она использует.
Составь список файлов по импортам, затем проверь каждый. Исправь несоответствия.

# 2. Качество
/code-review --fix src/app/[lang]/[page]/

# 3. Производительность
/vercel-react-best-practices проверь src/app/[lang]/[page]/page.tsx —
waterfall, Suspense boundaries, bundle splits

# 4. UX / Безопасность
/ui-ux-pro-max проверь src/app/[lang]/[page]/page.tsx — heading hierarchy, contrast ratio,
focus states, form UX, animation timing
/security-review проверь API routes и Server Actions используемые на этой странице

# 5. Верификация
/verification-loop
```

---

## Порядок приоритетов

Общий принцип для всех workflows:

1. **Архитектура первой** — FSD, React 19, Server/Client split. Некорректная структура делает бессмысленными проверки качества и безопасности поверх неё.
2. **Затем качество** — баги, мёртвый код, сложность — на чистой архитектурной основе.
3. **Затем производительность** — waterfalls, ре-рендеры, bundle — после того как структура и логика верны.
4. **Затем безопасность** — на уже корректном коде; на сломанном даёт ложное чувство безопасности.
5. **Верификация последней** — `/verification-loop` всегда финальный шаг.

---

## Важно

Скиллы не читают весь проект автоматически. Всегда указывать:

- конкретный файл: `src/features/auth/ui/login-form.tsx`
- папку: `src/features/auth/`
- или: `"все файлы из текущего git diff"`

Иначе Claude будет угадывать scope.