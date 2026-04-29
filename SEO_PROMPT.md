Ты — старший SEO-инженер и эксперт по Next.js 16 (App Router). Проведи полный SEO-аудит проекта. Проверяй каждый файл, каждый маршрут, каждый компонент на соответствие перечисленным ниже правилам. Результат представь в формате структурированного отчёта с категориями: ✅ OK, ⚠️ Warning, ❌ Error — и конкретными рекомендациями по исправлению для каждой проблемы. Указывай путь к файлу и номер строки, где обнаружена проблема.

---

## 1. Metadata API

### 1.1 Статические метаданные

- [ ] В корневом `app/layout.tsx` экспортирован объект `metadata` (тип `Metadata` из `next`) с полями `title`, `description`, `keywords`, `authors`, `creator`.
- [ ] Используется `title.template` в корневом layout для единообразия заголовков: `title: { template: '%s | Название сайта', default: 'Название сайта' }`.
- [ ] Каждая страница (`page.tsx`) имеет собственный `export const metadata` или `generateMetadata`, переопределяющий как минимум `title` и `description`.
- [ ] `description` — от 120 до 160 символов, содержит ключевые слова страницы.
- [ ] `title` — до 60 символов, уникален для каждого маршрута.

### 1.2 Динамические метаданные

- [ ] Для динамических маршрутов (`[slug]`, `[id]`) используется `generateMetadata()`, а не статический объект.
- [ ] `generateMetadata` является `async` функцией и получает данные из того же источника, что и компонент страницы (для дедупликации запросов через `fetch` с кэшированием или `React.cache`).
- [ ] Возвращаемый объект включает `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`.
- [ ] Обработан случай, когда данные не найдены — вызывается `notFound()`.

### 1.3 Антипаттерны

- [ ] НЕ используется библиотека `next-seo` (она конфликтует с встроенным Metadata API).
- [ ] НЕ используется `<Head>` из `next/head` — это Pages Router API, несовместимый с App Router.
- [ ] Нет дублирования тегов `<title>` или `<meta name="description">` через обычный JSX и Metadata API одновременно.

---

## 2. Open Graph и Twitter Cards

- [ ] Корневой layout задаёт базовые OG-теги: `openGraph.siteName`, `openGraph.locale`, `openGraph.type`.
- [ ] Каждая публичная страница имеет `openGraph.title`, `openGraph.description`, `openGraph.url`, `openGraph.images`.
- [ ] OG-изображения имеют размер 1200×630 px.
- [ ] Настроены `twitter.card` (`summary_large_image`), `twitter.title`, `twitter.description`, `twitter.images`.
- [ ] Для динамических OG-изображений используется `opengraph-image.tsx` / `twitter-image.tsx` с `ImageResponse` из `next/og`.
- [ ] OG-URL соответствует каноническому URL страницы.

---

## 3. Канонические URL и alternates

- [ ] Каждая страница задаёт `alternates.canonical` с абсолютным URL.
- [ ] `metadataBase` установлен в корневом layout: `metadataBase: new URL('https://example.com')`.
- [ ] Для мультиязычных сайтов настроены `alternates.languages` с `hreflang`.
- [ ] Нет дублей: один контент — один канонический URL.
- [ ] Пагинация (`?page=2`) либо использует `rel="next"/"prev"`, либо канонизирует на первую страницу.

---

## 4. Файлы robots.txt и sitemap.xml

### 4.1 robots.txt

- [ ] Файл `app/robots.ts` экспортирует функцию, возвращающую `MetadataRoute.Robots`.
- [ ] `allow: "/"` для публичных разделов.
- [ ] `disallow` для `/admin/`, `/api/`, `/dashboard/`, `/_next/` и других внутренних маршрутов.
- [ ] Указана ссылка на `sitemap`: `sitemap: 'https://example.com/sitemap.xml'`.
- [ ] НЕ заблокированы CSS/JS-ресурсы (Googlebot должен рендерить страницу).

### 4.2 sitemap.xml

- [ ] Файл `app/sitemap.ts` экспортирует функцию, возвращающую `MetadataRoute.Sitemap`.
- [ ] Все публичные маршруты включены в карту сайта.
- [ ] Каждый URL включает `lastModified`, `changeFrequency`, `priority`.
- [ ] Динамические маршруты генерируются из источника данных (БД/CMS).
- [ ] Для больших сайтов (>50,000 URL) используется `generateSitemaps()` для создания нескольких файлов.
- [ ] URL в sitemap совпадают с каноническими URL.

---

## 5. Структурированные данные (JSON-LD)

- [ ] На главной странице присутствует `Organization` или `WebSite` schema.
- [ ] Страницы статей/блога содержат `Article` или `BlogPosting` schema.
- [ ] Страницы товаров содержат `Product` schema с `offers`, `aggregateRating`.
- [ ] FAQ-страницы содержат `FAQPage` schema.
- [ ] JSON-LD внедрён через `<script type="application/ld+json">` в серверном компоненте.
- [ ] Данные валидны по спецификации Schema.org (проверить через Rich Results Test).
- [ ] Нет конфликтов между несколькими блоками JSON-LD на одной странице.

---

## 6. Рендеринг и производительность

### 6.1 Server-Side Rendering

- [ ] Все SEO-критичные страницы рендерятся на сервере (Server Components по умолчанию в App Router).
- [ ] `'use client'` применяется только к интерактивным компонентам, а не к целым страницам.
- [ ] SEO-контент (заголовки, текст, ссылки) НЕ загружается через клиентский `useEffect` / `fetch`.
- [ ] Для динамического контента, который должен быть виден поисковикам, используются Server Components или SSR.

### 6.2 Cache Components и PPR

- [ ] Используются Cache Components (`'use cache'`) для статичных частей страниц.
- [ ] Partial Prerendering (PPR) применён: статическая оболочка отдаётся мгновенно, динамические части стримятся.
- [ ] `<Suspense>` с fallback оборачивает динамические серверные компоненты.

### 6.3 Core Web Vitals

- [ ] LCP (Largest Contentful Paint) < 2.5 с — главное изображение оптимизировано.
- [ ] CLS (Cumulative Layout Shift) < 0.1 — заданы `width`/`height` для изображений и медиа.
- [ ] INP (Interaction to Next Paint) < 200 мс — интерактивные элементы не блокируют основной поток.
- [ ] Шрифты загружаются через `next/font` (preload + `font-display: swap`).
- [ ] Критический CSS встроен, некритический — загружен асинхронно.

---

## 7. Изображения

- [ ] Все изображения используют компонент `<Image>` из `next/image`.
- [ ] У каждого `<Image>` задан информативный `alt` (не пустой, не "image", не имя файла).
- [ ] Декоративные изображения имеют `alt=""` и `aria-hidden="true"`.
- [ ] Задан `sizes` для адаптивных изображений.
- [ ] LCP-изображение имеет атрибут `priority={true}`.
- [ ] Формат — WebP/AVIF (Next.js оптимизирует автоматически при использовании Image Optimization API).
- [ ] Для внешних доменов настроен `images.remotePatterns` в `next.config.ts`.

---

## 8. Маршрутизация и URL

- [ ] URL чистые, читаемые, в нижнем регистре: `/blog/my-article`, не `/Blog/My_Article` и не `/blog?id=123`.
- [ ] Настроены редиректы для старых URL через `redirects()` в `next.config.ts` (301 для постоянных).
- [ ] Trailing slashes единообразны (задано `trailingSlash: true` или `false` в конфиге).
- [ ] Нет цепочек редиректов (A → B → C).
- [ ] 404-страница кастомная (`not-found.tsx`) с полезным содержимым и ссылками.
- [ ] Для динамических маршрутов реализован `generateStaticParams` где возможно (SSG).

---

## 9. Ссылки и навигация

- [ ] Внутренние ссылки используют `<Link>` из `next/link`.
- [ ] Якорные ссылки (`<a>`) используются только для внешних URL.
- [ ] Внешние ссылки имеют `rel="noopener noreferrer"` и при необходимости `rel="nofollow"`.
- [ ] Навигация по сайту доступна без JavaScript (SSR-контент).
- [ ] Хлебные крошки (breadcrumbs) реализованы и содержат `BreadcrumbList` structured data.
- [ ] Нет битых ссылок (внутренних и внешних).

---

## 10. Интернационализация (i18n)

- [ ] Если сайт мультиязычный: настроена маршрутизация через `[locale]` сегмент или middleware.
- [ ] Тег `<html lang="xx">` устанавливается динамически в зависимости от языка.
- [ ] `hreflang` теги настроены через `alternates.languages` в metadata.
- [ ] Контент переведён, а не просто дублирован с тем же текстом.
- [ ] Есть `x-default` hreflang для страницы выбора языка.

---

## 11. Безопасность и технические заголовки

- [ ] Настроены Security Headers в `next.config.ts` → `headers()`:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` или `SAMEORIGIN`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy` (хотя бы базовый).
- [ ] HTTPS принудителен (редирект с HTTP).
- [ ] Нет mixed content (HTTP-ресурсы на HTTPS-странице).

---

## 12. Доступность (a11y) для SEO

- [ ] Семантическая разметка: `<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>`.
- [ ] Один `<h1>` на страницу, иерархия заголовков последовательна (h1 → h2 → h3, без пропусков).
- [ ] Формы имеют `<label>` для каждого `<input>`.
- [ ] Интерактивные элементы доступны с клавиатуры.
- [ ] Контрастность текста соответствует WCAG 2.1 AA.
- [ ] Язык страницы задан в `<html lang="...">`.

---

## 13. Proxy.ts и Middleware

- [ ] `proxy.ts` (замена middleware в Next.js 16) используется корректно:
  - Редиректы для SEO (www → non-www или наоборот).
  - Geo-редиректы для i18n.
- [ ] Proxy/Middleware не блокирует краулеры и не перенаправляет ботов в петлю.
- [ ] User-Agent проверки для SEO-ботов (Googlebot, Bingbot) не создают cloaking.

---

## 14. Мониторинг и инструменты

- [ ] Google Search Console подключена и верифицирована.
- [ ] Google Analytics / Vercel Analytics интегрированы через `<Script strategy="afterInteractive">` или `@next/third-parties`.
- [ ] Lighthouse CI или PageSpeed Insights проверяются регулярно.
- [ ] Настроен мониторинг Core Web Vitals в продакшене.

---

## Формат отчёта

Для каждого найденного элемента выводи:

| Статус | Категория | Файл:строка                | Проблема                        | Рекомендация                                                            |
| ------ | --------- | -------------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| ❌     | Metadata  | app/blog/[slug]/page.tsx:1 | Отсутствует `generateMetadata`  | Добавить async функцию generateMetadata с title, description, OG-тегами |
| ⚠️     | Images    | components/Hero.tsx:24     | `<img>` вместо `<Image>`        | Заменить на `next/image` с alt и sizes                                  |
| ✅     | Sitemap   | app/sitemap.ts             | Карта сайта настроена корректно | —                                                                       |

В конце отчёта дай:

1. **SEO Score** — оценку от 0 до 100.
2. **Топ-5 критических проблем** — что починить в первую очередь.
3. **Quick Wins** — что можно исправить за 5 минут с максимальным эффектом.
