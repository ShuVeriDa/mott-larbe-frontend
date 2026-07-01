# Переключение чеченской орфографии: новая ↔ старая

## Контекст

Тексты в проекте пишутся по **новой орфографии** (дифтонги `уо`/`иэ`, `й` вместо `ъ` и вместо `я`/`ю`/`е`).
Читатели, привыкшие к старой орфографии, должны иметь возможность переключиться.

Алгоритм конвертации **новая → старая** уже реализован в проекте `dosham` (функция `modernToOld` в `utils.ts`).
Задача — портировать его на фронтенд и встроить в существующую инфраструктуру переключения скриптов.

**Конвертация происходит только на фронтенде**, бэкенд не затрагивается.

---

## Глобальные технические требования

Эти правила обязательны на **каждом шаге** без исключений. Перед написанием любого кода — сверяться с ними.

### Фреймворк и версии
- **Next.js 16.2.5** — перед написанием кода читать `node_modules/next/dist/docs/`. APIs отличаются от более ранних версий.
- **React 19.2.4** — использовать React 19 APIs: `use()`, `useOptimistic`, `useActionState`, `useFormStatus`. Не использовать `forwardRef` (ref — обычный проп). Не использовать `useMemo`/`useCallback` вручную — React Compiler мemoизирует автоматически.
- **TypeScript** — без `any`. Только `unknown` + type guards. Типы выносить в `model/types.ts` (кроме props-интерфейсов).
- **Tailwind CSS v4** — только utility-классы, никаких inline-стилей и CSS-модулей. `cn()` для условных классов.

### Архитектура (CLAUDE.md)
- Строгий FSD: `shared → entities → features → widgets → app`. Импорты только вниз по слоям.
- Только через публичный barrel: `import { X } from '@/features/reader-script'`, никогда из внутренних путей.
- Одна стрелочная функция на файл для компонентов и хуков. Никаких `function` деклараций.
- Именованные экспорты везде кроме `app/` (там default по требованию Next.js).
- Логика → в хук `model/use-*.ts`. Компонент — только JSX + вызов хука.
- Именованные `handle*`-функции для событий, никаких анонимных стрелок в JSX.

### Производительность
- Server Components по умолчанию — `'use client'` только там где нужны хуки или события.
- Конвертация `modernToOld` — чистая функция без side-effects. Вызывается во время рендера (derived state), не в `useEffect`.
- Не использовать `useEffect` для derived state — вычислять во время рендера напрямую.
- Конвертер не делает копию всего документа при каждом рендере если `orthography === "NEW"` — возвращать оригинал без изменений.

### UI/UX и адаптивность
- Все интерактивные элементы — Tier 1 анимации (Tailwind transitions). Hover + active состояния обязательны.
- Touch targets минимум 44×44px на мобильных. Кнопки в футере — минимум `h-[44px]` на мобильном, `h-[26px]` на десктопе.
- Адаптив: `sm:` брейкпоинт для переключения между короткими и полными подписями (паттерн уже есть в `ScriptSwitcherFooter`).
- `aria-pressed`, `aria-label` — обязательны на toggle-кнопках (как в существующем `ScriptSwitcher`).
- Tooltip с подсказкой для пользователей, не знакомых с термином "орфография".

### Безопасность
- Конвертер работает только со строками из БД (уже валидированными) — дополнительной санитизации не требуется.
- `localStorage` через Zustand `persist` — только примитивы `"NEW" | "OLD"`, XSS-риска нет.
- Никаких `dangerouslySetInnerHTML` — текст рендерится через существующий `ArticleRich`.

### SSR / SEO
- Zustand store с `persist` — использует `localStorage`, недоступный на сервере. Компоненты, читающие `orthography`, должны быть `'use client'`. Серверный рендер всегда отдаёт **новую орфографию** (дефолт `"NEW"`) — гидрация на клиенте применит сохранённый выбор. Это корректное поведение.
- Текст в ридере индексируется в **новой орфографии** (серверный рендер). Конвертация в старую — только клиентская. SEO получает новую орфографию — это намеренно, т.к. тексты написаны по новым правилам.
- Метаданные страниц не меняются — конвертация не затрагивает `metadata` exports.

---

## Архитектурное решение

Добавляем новое измерение `orthography: "NEW" | "OLD"` в существующий Zustand-стор `useReaderScript`.
В ридере применяем конвертер к токенам и TipTap-документу перед рендером — тот же паттерн, что уже используется для арабских огласовок (`stripDiacriticsFromDoc`).

Новые файлы следуют строгой FSD-архитектуре и не нарушают существующих слоёв.

---

## Зависимости шагов

```
Шаг 1 (конвертер)
  └── Шаг 2 (store)
        └── Шаг 3 (применение в ридере)
              └── Шаг 4 (UI toggle)
                    └── Шаг 5 (i18n)
                          └── Шаг 7 (polish)
Шаг 3 ──────────────────────── Шаг 6 (редактор — превью, независим от 4–5)
```

Шаги 1–5 строго последовательны. Шаг 6 независим от шагов 4–5 (можно после шага 3).

---

## Шаг 1 — Конвертер `shared/lib/chechen-ortho/`

**Что делаем:** Портируем `modernToOld` из `dosham` на фронтенд в виде чистых функций.

### Скиллы для этого шага
- `/coding-standards` — стрелочные функции, именование, структура файлов
- `/react19` — чистые функции вместо useEffect для derived state
- `/vercel-react-best-practices` — производительность: конвертер должен быть O(n) по длине текста, без лишних аллокаций

### Новые файлы

**`src/shared/lib/chechen-ortho/modern-to-old.ts`**

Прямой порт `modernToOld` и `resolveIe` из
`F:\programming\mott-larbe\dosham\mott-larbe-dosham-backend\src\merge\parsers\utils.ts`
(строки 1802–1919).

Константы для порта:
```ts
// Гласные чеченского языка (из CHECHEN_VOWELS в dosham)
const CHECHEN_VOWELS = "аеёиоуыэюяАЕЁИОУЫЭЮЯаьАьоьОьуьУь";
const CHECHEN_VOWEL_RE = /[аеёиоуыэюяАЕЁИОУЫЭЮЯ]/;

// Словарь э-корней (из E_ROOTS в dosham — исчерпывающий список)
const E_ROOTS = [
  "эрчавала", "эрмало", "эшийна", "эккха", "эккхо", "эдала", "эгӀа", "эгӀо",
  "эцна", "эшна", "эдан", "элча", "эрча", "этка", "эшо", "эша", "эца",
  "эхь", "эрз", "эго", "эн", "эр", "эс",
];
```

Функции:
- `resolveIe(charBefore: string, suffix: string): string` — хелпер, не экспортируется
- `modernToOld(word: string): string | undefined` — экспортируется

### Полная спецификация алгоритма `modernToOld`

**Правило 0 — Детектор.** Слово затронуто только если содержит хотя бы одно из:
```
/уо|иэ|^й[аеёиоуыэюяАЕЁИОУЫЭЮЯ]/
```
Если не совпало — вернуть `undefined` сразу (слово не трогать). Это главная оптимизация — большинство слов пропускается.

**Шаг 1 — Классные показатели в начале слова (фиксируем ДО любых замен).**

```ts
const initialYodUo = /^йуо/.test(word)  // й+уо → классный маркер глагола, й остаётся
const initialYodIe = /^йиэ/.test(word)  // й+иэ → классный маркер, й остаётся, иэ→е
```

- `й+уо` в начале → й — классный маркер. После шага 3 получим `й+о` → `йо`.
- `й+иэ` в начале → классный маркер. `иэ=е` в новой орфографии, `йиэха → йеха`. й остаётся.
- `й+простая гласная` в начале (й+а, й+у, й+е…) → йотация, й убирается (шаг 5).

**Шаг 2 — Убрать `й` перед `иэ` в середине слова.**

`й` перед `иэ` в середине — разделитель, в старой орфографии его нет. `й+иэ` в начале слова — **не трогать** (обработано как классный показатель в шаге 1).

```ts
w = w.replace(/(?<!^)й(?=иэ)/g, "")
// тӀейиэтталуо → тӀеиэтталуо
```

**Шаг 3 — `уо` → `о` (безусловно, везде).**

```ts
w = w.replace(/уо/g, "о")
// дуоттагӀ → доттагӀ
```

**Шаг 4 — `иэ` → `е` или `э` (контекстно, итеративно).**

> ⚠️ **Обязательно итеративный обход, не regex с жадным суффиксом** — regex поглотит второй `иэ` в том же слове.

```ts
let out = "", i = 0;
while (i < w.length) {
  const idx = w.indexOf("иэ", i);
  if (idx === -1) { out += w.slice(i); break; }
  out += w.slice(i, idx);
  const charBefore = idx > 0 ? w[idx - 1] : "";
  out += resolveIe(charBefore, w.slice(idx + 2));
  i = idx + 2;
}
w = out;
// кӀиэгарлиэлла → кӀегарлелла (два иэ в одном слове)
```

Логика `resolveIe(charBefore, suffix)`:
- После **согласной** → всегда `"е"`. Составные согласные `хь`, `гӀ`, `пӀ`, `тӀ` — буква `ь`/`Ӏ` является частью согласного: `хьиэ → хье`.
- В начале слова или после **гласной** → проверить словарь э-корней: `"э" + suffix` начинается с одного из `E_ROOTS` → `"э"`, иначе → `"е"`.

**Шаг 5 — `й` в начале слова (три случая).**

```
initialYodIe  → ничего (й уже на месте, иэ заменён шагом 4)
initialYodUo  → ничего (й уже на месте, уо заменён шагом 3)
иначе (йотация) → заменить по таблице (порядок важен: сначала с ь):
  ^йуь → юь
  ^йаь → яь
  ^йу  → ю   (только если не следует ь)
  ^йа  → я   (только если не следует ь)
  ^йе  → е
```

**Шаг 6 — `й` после гласной перед гласной в середине слова.**

```ts
// порядок важен: сначала с ь
w = w.replace(/(?<=[ГЛАСНЫЕ])йаь/g, "яь")
w = w.replace(/(?<=[ГЛАСНЫЕ])йуь/g, "юь")
w = w.replace(/(?<=[ГЛАСНЫЕ])йа(?!ь)/g, "я")
w = w.replace(/(?<=[ГЛАСНЫЕ])йу(?!ь)/g, "ю")
w = w.replace(/(?<=[ГЛАСНЫЕ])й(?=[еёэ])/g, "")
// [ГЛАСНЫЕ] = символьный класс из CHECHEN_VOWELS
```

**Шаг 7 — `й` после согласной → `ъ` (только перед а/е/у/я/ю).**

`йо`, `йи`, `йэ`, `йы` — **старая орфография**, й там был всегда, не трогать.

```ts
// Обычные согласные
w = w.replace(/([бвгджзклмнпрстфхцчшщ])й([аеуяюАЕУЯЮ])/g, "$1ъ$2")
// Палочка (гортанная смычка) — отдельно, т.к. Unicode
w = w.replace(/([Ӏӏ])й([аеуяюАЕУЯЮ])/g, "$1ъ$2")
// ларйе → ларъе, лелйо → лелйо (не трогаем)
```

**Возврат:** если `w === word` — вернуть `undefined` (слово не изменилось, детектор ошибся или замены отменили друг друга).

**`src/shared/lib/chechen-ortho/convert-doc.ts`**

Функция для конвертации целого TipTap-документа — аналог существующего `stripDiacriticsFromDoc`:

```ts
// Рекурсивно обходит TipTapDoc, применяет modernToOld к каждому text-узлу
// Возвращает doc без изменений если ни один узел не затронут (структурное равенство)
export const convertDocToOld = (doc: TipTapDoc): TipTapDoc
```

**`src/shared/lib/chechen-ortho/convert-tokens.ts`**

Функция для конвертации массива токенов:

```ts
// Применяет modernToOld к token.displayText каждого токена
// Не мутирует оригинальный массив — возвращает новый с изменёнными displayText
export const convertTokensToOld = (tokens: TextToken[]): TextToken[]
```

**`src/shared/lib/chechen-ortho/index.ts`**

Barrel-экспорт:
```ts
export { modernToOld } from "./modern-to-old";
export { convertDocToOld } from "./convert-doc";
export { convertTokensToOld } from "./convert-tokens";
```

### Тестовые пары для ручной проверки (из документации dosham)

| Вход | Ожидаемый выход | Правило |
|---|---|---|
| `йиэха` | `йеха` | й+иэ в начале — классный показатель |
| `тӀейиэтталуо` | `тӀееттало` | й+иэ в середине + уо→о |
| `лиэлйуо` | `лелйо` | иэ→е, уо→о, йо не трогаем |
| `дуоттагӀ` | `доттагӀ` | уо→о |
| `йуьртан` | `юьртан` | йуь→юь (йотация) |
| `йуоллу` | `йоллу` | й+уо — классный показатель |
| `йара` | `яра` | й+а — йотация |
| `хьиэхар` | `хьехар` | иэ после ь (составной согл.) → е |
| `иэс` | `эс` | иэ в начале + э-корень "эс" |
| `схьаиэцна` | `схьаэцна` | иэ после гласной а + э-корень "эцна" |
| `кӀиэгарлиэлла` | `кӀегарлелла` | два иэ подряд, оба после согласной |
| `ларйе` | `ларъе` | й после согл. перед е → ъ |
| `лелйо` | `лелйо` (не меняется) | йо — старая орфография |
| `велла` | `велла` (не меняется) | детектор пропускает — нет маркеров |

### Требования к реализации шага
- Только стрелочные функции (arrow functions)
- Никаких `any` — входные типы `string`, выходные `string | undefined`
- Константы `E_ROOTS`, `CHECHEN_VOWELS`, `CHECHEN_VOWEL_RE` — в том же файле `modern-to-old.ts`, не выносить в отдельный файл (один файл — одна тема)
- `convertDocToOld` и `convertTokensToOld` — **иммутабельны**: не мутируют входные данные, возвращают новые объекты только если были изменения
- Регрессия: ударения (`́`, `̄`) внутри слов не должны мешать regex-паттернам (проверить на `йуккъе́ра`, `буо́рз`)

---

## Шаг 2 — Расширение Zustand-стора

**Что делаем:** Добавляем `orthography` в существующий стор `useReaderScript`.

### Скиллы для этого шага
- `/coding-standards` — именование типов, экспорты
- `/react19` — клиентский стор, `'use client'`

### Что меняем: `src/features/reader-script/model/reader-script-store.ts`

Добавляем поле `orthography` и сеттер:

```ts
export type ReaderOrthography = "NEW" | "OLD";

interface ReaderScriptState {
  script: ReaderScript;
  showDiacritics: boolean;
  orthography: ReaderOrthography;                      // ← новое
  setScript: (script: ReaderScript) => void;
  setShowDiacritics: (value: boolean) => void;
  setOrthography: (o: ReaderOrthography) => void;     // ← новое
}

// В create():
orthography: "NEW",
setOrthography: (orthography) => set({ orthography }),
```

Персистентность: `orthography` попадает в тот же `localStorage`-ключ `"reader-script"` автоматически через `persist`. Hydration mismatch невозможен — компоненты, читающие `orthography`, помечены `'use client'`.

### Что меняем: `src/features/reader-script/model/index.ts`

```ts
export { useReaderScript, type ReaderScript, type ReaderOrthography } from "./reader-script-store";
```

### Что меняем: `src/features/reader-script/index.ts`

Добавляем `ReaderOrthography` в barrel-экспорт фичи.

### Требования к реализации шага
- Тип `ReaderOrthography` — только `"NEW" | "OLD"`, без расширения
- Дефолт `"NEW"` — новая орфография показывается при первом визите
- Не трогать остальные поля стора — минимальные изменения

---

## Шаг 3 — Применение конвертера в ридере

**Что делаем:** В `reader-body.tsx` добавляем второй слой преобразования после существующего (скрипт → орфография).

### Скиллы для этого шага
- `/react19` — derived state во время рендера, не в useEffect; `'use client'` только на листе
- `/vercel-react-best-practices` — избегать лишних ре-рендеров; конвертация — pure derived value
- `/coding-standards` — именование переменных, структура

### Что меняем: `src/widgets/reader-body/ui/reader-body.tsx`

В секции где формируются `displayContentRich` и `displayTokens` (строки ~74–91, ~213–216):

```ts
const { script, showDiacritics, orthography } = useReaderScript();
const isOldOrtho = orthography === "OLD";

// Существующий код: script → contentRichForDisplay, tokensForDisplay
// ...

// Новый слой: орфография
const contentRichForRender = isOldOrtho
  ? convertDocToOld(contentRichForDisplay)
  : contentRichForDisplay;  // без копирования — оригинал

const tokensForRender = isOldOrtho
  ? convertTokensToOld(tokensForDisplay)
  : tokensForDisplay;  // без копирования — оригинал
```

Передавать `contentRichForRender` и `tokensForRender` в `ArticleRich` вместо предыдущих переменных.

> **Критически важно:** `cyrillicRaw` и `cyrillicContentRich` **не трогаются** — они нужны для маппинга highlights/notes/phrases. Конвертер применяется только к display-переменным.

### SSR-поведение
- На сервере `orthography` всегда `"NEW"` (дефолт стора)
- На клиенте после гидрации Zustand `persist` восстанавливает сохранённый выбор
- Hydration mismatch: `reader-body.tsx` уже `'use client'` — проблемы нет

### Требования к реализации шага
- Конвертация — **derived value во время рендера**, не `useState` + `useEffect`
- Импортировать `convertDocToOld`, `convertTokensToOld` из `@/shared/lib/chechen-ortho`
- Импортировать `ReaderOrthography` из `@/features/reader-script` (через barrel)
- Не переименовывать другие переменные в файле — минимальный diff

---

## Шаг 4 — UI: OrthographyToggle

**Что делаем:** Новый компонент кнопки переключения орфографии + интеграция в футер ридера.

### Скиллы для этого шага
- `/ui-ux-pro-max` — touch targets, aria, keyboard nav, адаптивность
- `/frontend-design` — визуальная согласованность с существующими кнопками (`ScriptSwitcherFooter`)
- `/coding-standards` — одна стрелочная функция, именованные обработчики
- `/react19` — `'use client'`, named export

### Новый файл: `src/features/reader-script/ui/orthography-toggle.tsx`

```tsx
"use client";
// Показывается только когда script === "CYRILLIC"
// Паттерн: идентичен DiacriticsToggle
export const OrthographyToggle = () => { ... }
```

**Дизайн-требования:**
- Визуально идентично кнопкам в `ScriptSwitcherFooter` — тот же `h-[26px]`, `rounded-[5px]`, `border-[0.5px] border-bd-1`, шрифт `text-[11px]`
- Активное состояние: `border-acc/20 bg-acc-bg text-acc-t` (как у активного скрипта)
- Неактивное: `bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1`
- Transition: `transition-colors duration-100 ease-out`
- Адаптив: `px-2.5 sm:px-3`, короткая подпись на мобильном (`hidden sm:inline` / `inline sm:hidden`)
- `aria-pressed={isOld}` + `aria-label` с i18n-ключом
- Touch: на мобильном высота через паддинг компенсируется родительским контейнером (паттерн существующего футера)

### Что меняем: `src/widgets/reader-footer/ui/script-switcher-footer.tsx`

Добавляем `<OrthographyToggle />` после блока скриптов, перед разделителем `?`-ссылки:

```tsx
<OrthographyToggle />
{/* существующий разделитель и ссылка на гайд */}
```

### Что меняем: `src/features/reader-script/index.ts`

```ts
export { OrthographyToggle } from "./ui/orthography-toggle";
```

### Требования к реализации шага
- Никаких голых HTML-тегов — только `Button` из `@/shared/ui/button`
- Обработчик: именованная `handleToggle`, не анонимная стрелка в `onClick`
- `e.currentTarget` если нужен доступ к элементу события (не `e.target`)
- Компонент скрывается при `script !== "CYRILLIC"` — `return null` в начале
- Анимация: Tier 1 (Tailwind) — уже включена через `transition-colors duration-100 ease-out`

---

## Шаг 5 — i18n

**Что делаем:** Добавляем ключи локализации во все три локали.

### Скиллы для этого шага
- `/coding-standards` — структура JSON, консистентность ключей

### Новые ключи в секцию `reader.settings.script`

Файлы: `src/locales/ru.json`, `src/locales/che.json`, `src/locales/en.json`

| Ключ | ru | che | en |
|---|---|---|---|
| `orthographyToggle` | Орфография | Йозанан бакъо | Orthography |
| `orthographyNew` | Новая орф. | Керла йозанан бакъо | New spelling |
| `orthographyOld` | Старая орф. | Хьалхара йозанан бакъо | Old spelling |
| `orthographyNewShort` | Нов | Керл | New |
| `orthographyOldShort` | Стар | Хьал | Old |
| `orthographyHint` | Тексты написаны по новой орфографии. Переключите, чтобы читать в привычном написании. | Текасташ керла йозанан бакъонца яздина. Хьалхарчу йозанан бакъоне хийца. | Texts are written in the new orthography. Switch to read in the familiar spelling. |

### Требования к реализации шага
- Ключи добавляются строго внутри существующего объекта `"script": { ... }` — не на верхнем уровне
- Все три файла (`ru.json`, `che.json`, `en.json`) обновляются одновременно
- Не менять существующие ключи

---

## Шаг 6 — Превью в редакторе (опционально, после шагов 1–3)

**Что делаем:** Кнопка в тулбаре редактора — автор видит как текст выглядит в старой орфографии.

### Скиллы для этого шага
- `/react19` — `'use client'`, паттерн хук + компонент
- `/ui-ux-pro-max` — UX превью: не должно блокировать редактирование
- `/frontend-design` — визуальный стиль тулбара
- `/coding-standards` — выносить логику в хук, компонент — только JSX

### Новый файл: `src/features/reader-script/ui/orthography-preview-toggle.tsx`

Кнопка в тулбаре редактора (показывается только для `language === "CHE"`):
- Состояние превью хранится в локальном `useState` — не в Zustand (это редакторский UI, не читательский)
- При включении: применяет `convertDocToOld` к `editor.getJSON()` и показывает результат в readonly `Sheet` или `Dialog`
- Редактор при этом не меняется — превью только для просмотра

> Реализация этого шага может быть отложена — она не влияет на функционал ридера (шаги 1–5).

### Требования к реализации шага
- Превью отображается в `Sheet` (боковая панель) — не заменяет редактор
- Readonly режим — нельзя редактировать текст в превью
- Анимация Sheet: Tier 3 (framer-motion + AnimatePresence) — Sheet unmount'ится при закрытии
- Импортировать `convertDocToOld` из `@/shared/lib/chechen-ortho`

---

## Шаг 7 — Polish

**Что делаем:** Финальная проверка качества всей фичи целиком.

### Скиллы для этого шага
- `/ui-ux-pro-max` — accessibility финальная проверка
- `/vercel-react-best-practices` — проверка производительности
- `/security-review` — localStorage, XSS
- `/verify` — ручная проверка в браузере на реальных текстах

### Чеклист

**Функциональность:**
- [ ] Конвертер корректно обрабатывает ударения (`й́`, `е́`, `о́` и др.) — они не должны ломать regex
- [ ] Конвертер корректен на словах из реальных текстов проекта
- [ ] `highlights`/`notes`/`phrases` корректно маппятся после конвертации (`cyrillicRaw` не тронут)
- [ ] Toggle скрыт при `script === "LATIN"` или `"ARABIC"` — проверить визуально
- [ ] При смене скрипта на non-CYRILLIC и обратно — `orthography` сохраняется как была

**Адаптивность:**
- [ ] Футер ридера на мобильном (< 640px): кнопка видна, не обрезается
- [ ] На десктопе: кнопки в ряд, не переполняют футер
- [ ] Touch targets: удобно нажимать на мобильном (тест на реальном девайсе или DevTools)

**Доступность:**
- [ ] `aria-pressed` корректно меняется при переключении
- [ ] Keyboard nav: кнопка доступна через Tab, срабатывает через Enter/Space
- [ ] Tooltip с `orthographyHint` добавлен к кнопке

**Производительность:**
- [ ] При `orthography === "NEW"` конвертер не вызывается вообще (проверить условие)
- [ ] При переключении нет лишних сетевых запросов — только derived state
- [ ] Переключение отзывчивое (<16ms на типичной странице из ~500 слов)

**SSR/SEO:**
- [ ] Серверный HTML содержит новую орфографию (до гидрации)
- [ ] После гидрации — применяется сохранённый выбор без layout shift
- [ ] Метаданные страницы не изменились

---

## Итоговый список файлов

### Новые файлы
| Файл | Назначение |
|---|---|
| `src/shared/lib/chechen-ortho/modern-to-old.ts` | Конвертер слова (порт из dosham) |
| `src/shared/lib/chechen-ortho/convert-doc.ts` | Конвертер TipTap-документа |
| `src/shared/lib/chechen-ortho/convert-tokens.ts` | Конвертер массива токенов |
| `src/shared/lib/chechen-ortho/index.ts` | Barrel-экспорт |
| `src/features/reader-script/ui/orthography-toggle.tsx` | UI кнопка переключения |

### Изменяемые файлы
| Файл | Что меняется |
|---|---|
| `src/features/reader-script/model/reader-script-store.ts` | + `orthography`, `setOrthography`, `ReaderOrthography` |
| `src/features/reader-script/model/index.ts` | + экспорт `ReaderOrthography` |
| `src/features/reader-script/index.ts` | + экспорт `OrthographyToggle`, `ReaderOrthography` |
| `src/widgets/reader-body/ui/reader-body.tsx` | + применение конвертера перед рендером |
| `src/widgets/reader-footer/ui/script-switcher-footer.tsx` | + `<OrthographyToggle />` |
| `src/locales/ru.json` | + 6 новых ключей в `reader.settings.script` |
| `src/locales/che.json` | + 6 новых ключей в `reader.settings.script` |
| `src/locales/en.json` | + 6 новых ключей в `reader.settings.script` |

### Не затрагиваются
- Бэкенд, база данных, Prisma-схема
- `ArticleRich` и `render-rich-content` (принимают готовый документ)
- `TextToken` типы в БД (меняется только `displayText` в runtime-копии)
- `ScriptSwitcher`, `DiacriticsToggle` (независимые компоненты)
- `metadata` exports в `app/` — SEO не затрагивается

---

## Оценка трудозатрат

| Шаг | Скиллы | Оценка |
|---|---|---|
| Шаг 1 — Конвертер | coding-standards, react19, vercel-react-best-practices | ~1.5 ч |
| Шаг 2 — Store | coding-standards, react19 | ~15 мин |
| Шаг 3 — Ридер | react19, vercel-react-best-practices, coding-standards | ~30 мин |
| Шаг 4 — UI | ui-ux-pro-max, frontend-design, coding-standards, react19 | ~30 мин |
| Шаг 5 — i18n | coding-standards | ~15 мин |
| Шаг 6 — Редактор (опц.) | react19, ui-ux-pro-max, frontend-design, coding-standards | ~1 ч |
| Шаг 7 — Polish | ui-ux-pro-max, vercel-react-best-practices, security-review, verify | ~30 мин |
| **Итого (без шага 6)** | | **~3.5 ч** |
