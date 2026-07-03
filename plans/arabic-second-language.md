# Добавление арабского как второго изучаемого языка

## Контекст

Сейчас платформа обучает **только чеченскому**. Пользователь хочет добавить **арабский как второй изучаемый язык** (курс/контент), наравне с чеченским.

**Важно не путать с существующей фичей:** в проекте уже есть модуль транслитерации чеченского в арабскую письменность (`ChScript` enum `LATIN`/`ARABIC`, `TextScriptVersion`/`TextScriptPage`, `script-guide-page`). Это **не то же самое** — там арабица используется как алфавит для записи чеченских слов. В этой задаче арабский — самостоятельный **изучаемый язык** со своими текстами, словами, переводами. Оба механизма должны сосуществовать в коде, не пересекаясь.

**Ограничение доступа (важно, определяет весь rollout):** арабский **не должен быть виден обычным пользователям** на этом этапе. Доступ — только у админов и у тех пользователей, кому админ явно выдал доступ. В будущем это станет частью платных подписок, но интеграция с подписками — **не в этом плане**. Механизм ограничения — через уже существующую (но недоиспользуемую) систему `/admin/feature-flags` с per-user overrides, а не через статический билд-тайм конфиг `LANGUAGES` (см. шаг 3.5).

### Что уже готово (аудит подтверждён чтением кода)

- **Backend Prisma**: `enum Language { CHE, RU, AR, EN }` уже существует и используется как FK на `Text`, `Lemma` (`@@unique([normalized, language])`), `TextPhrase`, `PhrasebookPhrase`, `MorphologyRule`, `User.language`.
- **Backend tokenizer** (`tokenizer.service.ts`): работает по Unicode-классам `\p{L}\p{M}`, языково-агностичен, корректно бьёт и арабский текст на токены (но не знает арабской морфологии).
- **Frontend уже содержит готовый механизм фичефлага языков** — `src/shared/lib/languages/languages.ts`:
  ```ts
  export type AppLanguage = "CHE" | "RU" | "EN" | "AR";
  export const LANGUAGES: readonly LanguageConfig[] = [
    { code: "CHE", enabled: true },
    { code: "RU", enabled: false },
    { code: "EN", enabled: false },
    { code: "AR", enabled: false },   // ← уже задуман, просто выключен
  ];
  ```
  Используется в `library-filter-bar-lang-group.tsx`, `library-filter-bar-mobile-selects.tsx`, `phrasebook-filters.tsx`, `phrasebook-mobile-filters.tsx`. Это единственный правильный источник истины — **включение арабского в итоге сводится к `enabled: true` здесь**, но только после того как остальная система готова его поддержать.
- Frontend RTL CSS и арабские шрифты (`Scheherazade New`, `Amiri`, `Lateef`) уже подключены в `layout.tsx`/`globals.css`/`reader-body.tsx` — но зашиты под `ChScript`-переключатель, а не под `language === "AR"`.

### Что сломано / не готово

1. **4 разных локальных типа языка вместо единого `AppLanguage`:**
   - `entities/admin-text/api/types.ts` — `"CHE"|"RU"|"AR"|"EN"` (полный, но независимо объявлен)
   - `entities/text/api/types.ts` — `"CHE"|"RU"|"EN"|string` (без `AR`)
   - `entities/library-text/api/types.ts` — `"CHE"|"RU"|"EN"` (без `AR`)
   - `shared/ui/admin-text-editor/admin-text-meta-panel-shell.tsx:6` и `admin-text-meta-status-section.tsx:9` — **`"CHE"|"RU"` только**, i18n-лейблы только `langChe`/`langRu` — админка физически не даёт создать/пометить арабский текст.
2. **Backend AI-translation промпты хардкодят "Chechen":**
   `ai-translation.service.ts:480,507,529` — `"You are a Chechen language assistant..."`; `ai-translation.service.ts:546` — отдельная формулировка батч-промпта `"You are a Chechen-Russian language assistant"` (менять отдельно, не тем же заменяемым текстом). Поле `notChechen` — это поле встроенного TS-интерфейса результата парсинга (не отдельный DTO-класс): используется в тексте промпта (:481), в парсинге ответа `if (parsed.notChechen)` (:172) → `BadRequestException({ code: ErrorCode.NOT_CHECHEN })` (:173), интерфейс возврата — :677. `ErrorCode.NOT_CHECHEN` подтверждён на фронте: `src/shared/api/error-i18n.ts:84`, локали `che.json`/`en.json`/`ru.json`, потребители — `ai-word-sheet-body.tsx`, `ai-word-panel-body.tsx`, `ai-word-popup-body.tsx`, `use-ai-word-lookup.ts`. Существует только `targetLanguage` (язык **перевода**), нет `sourceLanguage` (язык **исходного слова** — сейчас всегда неявно чеченский).
3. **`SpellingEntry`** (текущая фича, в разработке) не имеет `language` — подразумевает единый чеченский словарь.
4. **`MorphologyRule`** — суффиксный движок, спроектирован под агглютинацию чеченского. Арабская морфология (корень+паттерн) в эту модель не ложится — нужно явное решение, а не молчаливое применение чеченских правил к арабским текстам.
5. **Нет UI выбора "изучаемого языка"** — `User.language` есть в схеме, но нигде не используется на фронте.
6. **RTL для реального арабского текста** не отделён от RTL для арабской *письменности чеченского* — нужно завести переключение по `language === "AR"`, а не по `ChScript`.
7. **Система feature flags существует, но не подключена к рантайму.** В коде уже есть полноценный админский UI управления флагами (`/admin/feature-flags` — CRUD, per-user overrides, история, `overridesCount` и т.д., см. `entities/feature-flag`, `widgets/admin-feature-flags-page`) и backend-сервис `src/feature-flags/feature-flags.service.ts` с готовым методом `isFeatureEnabled(userId, key)` (приоритет: per-user override → global `isEnabled`/`rolloutPercent`/`environments`). Но этот сервис **нигде не заинжекчен** — нет `FeatureFlagsModule`, нет ни одного модуля, который его provide'ит, и нет ни одного публичного (не-admin) эндпоинта, который бы фронтенд мог дёрнуть, чтобы узнать "включена ли фича у меня". Это первая задача, которая реально начнёт использовать эту систему для гейтинга функциональности конечных пользователей.

---

## Глобальные технические требования

Обязательны на каждом шаге.

### Стек
- **Next.js 16.2.5** — сверяться с `node_modules/next/dist/docs/` перед новым кодом.
- **React 19.2.4** — `use()`, `useActionState`, `useOptimistic`, `useFormStatus`; никакого `forwardRef`; никакого ручного `useMemo`/`useCallback`.
- **TypeScript** — без `any`, только `unknown` + type guards.
- **TanStack Query v5** — `queryOptions()`, явный `staleTime`, `queryKey` включает все параметры фильтра/языка.
- **Tailwind v4** — `cn()`, никаких инлайн-стилей.

### Архитектура (CLAUDE.md)
- Строгий FSD, импорт только вниз по слоям, только через публичный barrel.
- Логика → `model/use-*.ts`, компонент — только JSX. Именованные `handle*`.
- Общие типы → `model/types.ts` / `shared/lib/languages`, не дублировать по слайсам.
- NestJS: DTO с `class-validator`, Swagger `@ApiProperty`.

### Безопасность
- Backend: `sanitize()` уже применяется к пользовательскому вводу в промптах — сохранить при добавлении `sourceLanguage`.
- `sourceLanguage`/`language` — валидировать через `@IsIn` по enum, никогда не интерполировать сырой пользовательский ввод в промпт напрямую как имя языка.

---

## Зависимости шагов

```
Backend:
  Шаг 1 (AI-translation: sourceLanguage + миграция кэша)  ─┐
  Шаг 2 (SpellingEntry.language)                           ├── независимы друг от друга
  Шаг 3 (морфология: решение по AR)                        ─┘
  Шаг 3.5 (feature-flags: FeatureFlagsModule + /me + enforcement) — независим от 1-3, но нужен ДО шага 8

Frontend:
  Шаг 4 (унификация TextLanguage → AppLanguage)
    ├── Шаг 5 (админка: полный список языков в create/edit) ──┐
    ├── Шаг 6 (User.language UI — профиль/онбординг, гейтится флагом из 3.5) ├── 5 не публикует AR
    └── Шаг 7 (RTL для language === "AR" в ридере)  ──────────┘   пока 7 не готов (см. ниже)

  Шаг 8 (проверка сквозного гейтинга через feature-flag override + сквозная функциональная проверка) — зависит от 1 (включая миграцию кэша), 2, 3, 3.5, 5, 6, 7
  Шаг 9 (polish/verify) — зависит от 8
```

Шаги 1–3 и 3.5 (backend) и шаг 4 (frontend) можно делать параллельно. Шаги 5–7 параллельны между собой по коду, **но публикация арабских текстов через 5 должна быть заблокирована до готовности шага 7** (иначе админ создаст и опубликует AR-текст, который в ридере отрендерится без RTL) — черновики создавать можно, паблик — нет. Шаг 8 не может стартовать без завершённой миграции кэша из шага 1 (иначе включение доступа приведёт к порче данных существующего чеченского кэша переводов) и без шага 3.5 (иначе арабский откроется всем, а не только тем, кому выдан доступ).

**Предпосылка перед шагом 8:** в системе должен существовать хотя бы один реальный тестовый арабский текст (создан вручную через шаг 5) и хотя бы один override, выданный тестовому пользователю через `/admin/feature-flags` — иначе сквозную проверку гейтинга выполнить не на чем.

---

## Шаг 1 — Backend: параметризация AI-translation по исходному языку

**Репозиторий:** `f:\programming\mott-larbe\mott-larbe-backend`, папка `src/ai-translation`.

**Что делаем:** Убираем хардкод "Chechen" из промптов Gemini, добавляем `sourceLanguage` как параметр. Этот шаг **включает Prisma-миграцию** для кэша (см. ниже) — это не чисто аддитивное изменение, оценка трудозатрат пересмотрена.

> ⚠️ **Подтверждено ревью:** AI-cache — это не application-level ключ, а Prisma unique-constraint `@@unique([lemma, cacheType, targetLanguage])` на модели **`AiTranslationCache`** (`prisma/schema.prisma:1316-1347`, constraint — строка 1338; поле `targetLanguage` — `String`, не enum `Language`, дефолт `"ru"`). Без миграции арабское слово и его чеченский омограф коллизируют на `(lemma, WORD_ONLY, ru)` и будут перезаписывать чужой перевод в кэше. Это критический баг, а не опциональная доработка.

### Скиллы
- `/api-design` — форма DTO, enum-валидация
- `/postgres-patterns` — миграция unique-constraint
- `/security-review` — санитизация промптов при добавлении нового интерполируемого поля

### Изменения

**`src/ai-translation/dto/translation-language.ts`** — добавить аналогичный список для исходного языка (или переиспользовать `Language` enum из Prisma, если он уже импортируется в модуль):
```ts
export const SUPPORTED_SOURCE_LANGUAGES = ["che", "ar"] as const;
export type SourceLanguage = (typeof SUPPORTED_SOURCE_LANGUAGES)[number];

export const SOURCE_LANGUAGE_NAMES: Record<SourceLanguage, string> = {
  che: "Chechen",
  ar: "Arabic",
};
```

**`dto/translate-word.dto.ts`, `translate-phrase.dto.ts`, `refine-phrase.dto.ts`, `batch-translate.dto.ts`, `save-refinement.dto.ts`** — добавить опциональное поле:
```ts
@ApiPropertyOptional({
  description: "Source language of the word/phrase being translated",
  enum: SUPPORTED_SOURCE_LANGUAGES,
  default: "che",
})
@IsOptional()
@IsString()
@IsIn(SUPPORTED_SOURCE_LANGUAGES)
sourceLanguage?: SourceLanguage;
```
Дефолт `"che"` — существующие вызовы без этого поля продолжают работать как раньше (backward-compatible).

**`ai-translation.service.ts`** — во всех `build*Prompt` методах (строки ~464–552):
- Принимать `sourceLanguage: SourceLanguage = "che"` параметром.
- Заменить `"You are a Chechen language assistant"` → `` `You are a ${SOURCE_LANGUAGE_NAMES[sourceLanguage]} language assistant` ``.
- Переименовать смысл поля `"notChechen"` в промпте и в парсинге ответа на language-agnostic `"notInSourceLanguage"` — но проверить, где на фронте потребляется `notChechen`/`NOT_CHECHEN` (`ErrorCode.NOT_CHECHEN`), и либо синхронно обновить оба конца, либо оставить старое имя поля в JSON-контракте и просто параметризовать текст промпта (это безопаснее — меньше связанных изменений). **Решение: оставить имя поля `notChechen` в JSON-контракте как есть (breaking rename не нужен), параметризовать только текст промпта.**
- `buildBatchPrompt` и метод `batchTranslate` (service:261, 542) — **сейчас хардкодят `targetLanguage: "ru"` и "Chechen-Russian" безусловно**. Это основной путь click-to-translate в ридере (используется при массовой подгрузке переводов слов на странице) — если его не параметризовать, арабский текст будет молча получать чеченские переводы-мусор. Добавить `sourceLanguage` в `buildBatchPrompt`, пробросить через `batchTranslate` от DTO до промпта и до записи в кэш.
- **Миграция кэша (обязательна, не опция):** добавить `sourceLanguage` полем в модель AI-cache (`prisma/schema.prisma`, модель с constraint `@@unique([lemma, cacheType, targetLanguage])` на строке ~1338) → новый constraint `@@unique([lemma, cacheType, sourceLanguage, targetLanguage])`. Обновить все 6 мест upsert/find по этому ключу в `ai-translation.service.ts` (строки ~118, 137, 177, 306, 345) — добавить `sourceLanguage` во все `where`/`create`/`update`.
- Существующие записи кэша при миграции получают `sourceLanguage = "che"` по умолчанию (backward-compatible, данные не теряются).

### Требования к реализации
- Не менять поведение по умолчанию (`sourceLanguage` не передан → ведёт себя как раньше, чеченский).
- `LANGUAGE_NAMES` (для `targetLanguage`) и новый `SOURCE_LANGUAGE_NAMES` — разные словари, не путать «в какой язык переводим» и «с какого языка переводим».
- Контроллер (`ai-translation.controller.ts`) — обновить `@ApiOperation summary` с "Translate a Chechen word" на language-agnostic формулировку.
- **До завершения этого шага** поле `notChechen` в ответе Gemini будет ошибочно срабатывать на легитимные арабские слова (промпт ещё не знает про арабский) — это ожидаемо и блокирует любую проверку арабского перевода до полного мёржа шага 1. Пользовательский текст ошибки `"not_chechen"` (`ErrorCode.NOT_CHECHEN`) — genericize в i18n на что-то вроде "слово не распознано на выбранном языке", а не оставлять чеченский по смыслу текст для арабских текстов.

---

## Шаг 2 — Backend: `SpellingEntry.language`

**Репозиторий:** backend, модуль spelling-dictionary (текущая незакоммиченная фича в этом фронтенд-репо имеет зеркальный API-клиент в `src/entities/spelling-dictionary/`).

**Что делаем:** Добавляем поле `language: Language @default(CHE)` в модель `SpellingEntry` в Prisma-схеме, миграция, фильтрация по языку в сервисе/контроллере.

### Скиллы
- `/postgres-patterns` — миграция, индекс
- `/api-design` — query-параметр фильтра

### Изменения
- Prisma: `language Language @default(CHE)` + `@@index([language])` на `SpellingEntry`.
- `npx prisma migrate dev --name add_language_to_spelling_entry`.
- Backend spelling-dictionary controller/service — принимать `language` как query-параметр в списке/поиске, дефолт `CHE` для обратной совместимости с текущим UI.
- Frontend `src/entities/spelling-dictionary/api/types.ts` и `spelling-dictionary-api.ts` — добавить `language` в тип `SpellingEntry` и в параметры запросов (это уже открытая фича в разработке — синхронизировать, а не ломать).

### Требования
- Существующие записи (все чеченские) получают `language = CHE` по умолчанию через миграцию — данные не теряются.
- Admin-spelling-dictionary-page — добавить фильтр по языку только если шаг 4 (унификация типа языка) уже сделан, иначе будет ещё один дублирующийся тип.

---

## Шаг 3 — Backend: решение по морфологии для арабского

**Что делаем:** Не реализация нового движка, а явное архитектурное решение + guard, чтобы чеченские суффиксные правила не применялись молча к арабским текстам.

### Скиллы
- `/api-design`

### Изменения
- В `admin-morphology.service.ts` — там, где выбирается `language = dto.language ?? Language.CHE`, убрать implicit default там, где вызов происходит в контексте конкретного текста (лемматизация должна получать язык текста явно, а не подставлять чеченский по умолчанию).
- Задокументировать (комментарий в коде на `MorphologyRule` в schema.prisma) — для арабского в MVP лемматизация через `MorphologyRule` **не используется**; арабские слова получают перевод через AI-translation (шаг 1) напрямую по surface-форме, без суффиксного разбора. Полноценная арабская морфология (корень+паттерн) — отдельная будущая задача, не в этом плане.
- Проверить точки, где `MorphologyRule`-движок автоматически запускается при импорте/публикации текста (Bull-очередь) — добавить условие: запускать только для `text.language === "CHE"`.

### Требования
- Никакого молчаливого «арабский текст обработан чеченскими суффиксными правилами и получил мусорные леммы» — либо явный skip, либо явная ошибка/лог.

---

## Шаг 3.5 — Backend + Frontend: доступ к арабскому только для админов и пользователей с override

**Что делаем:** Подключаем существующий, но нигде не заинжекченный `FeatureFlagsService` к реальным точкам входа, чтобы арабский был виден и доступен только тем, кому явно выдан доступ через `/admin/feature-flags`.

### Скиллы
- `/security-review` — enforcement на сервере, не только скрытие в UI
- `/api-design`
- `/react19` — клиентский хук на TanStack Query

### Backend

- **Зарегистрировать `FeatureFlagsService` как provider.** Создать `src/feature-flags/feature-flags.module.ts` (`providers: [FeatureFlagsService]`, `exports: [FeatureFlagsService]`) и импортировать в `AppModule` (и в модули, которым он нужен: text/library-module, где будет вызываться `isFeatureEnabled`).
- **Публичный эндпоинт "мои флаги"** — новый контроллер (не `admin/feature-flags`, отдельный, доступный обычным авторизованным пользователям): `GET /feature-flags/me?keys=arabic_language` → `{ [key: string]: boolean }`. Использует `@User()` decorator (как в `admin-feature-flags.controller.ts`) для получения `userId`, вызывает `flags.isFeatureEnabled(userId, key)` для каждого запрошенного ключа.
- **Server-side enforcement, не только UI-скрытие.** В листинге библиотеки (`/texts`) и получении конкретного текста — если `text.language === "AR"` и `isFeatureEnabled(userId, "arabic_language")` === false, текст исключается из списка / запрос на конкретный текст возвращает 404 (не 403 — чтобы не палить существование текста). Это обязательно: скрытие опции в фильтре библиотеки не защищает от прямого запроса по известному id текста.
- **Данные флага** — создаются не миграцией, а через уже готовый admin UI (`/admin/feature-flags` → "создать флаг"): `key: "arabic_language"`, `category: FUNCTIONAL`, `isEnabled: false` (глобально выключено), `rolloutPercent: 0`, `environments: [PROD, STAGE, DEV]`.
- **Выдача доступа** — через уже существующий UI, двумя равнозначными путями (оба реально рабочие, проверено кодом): (а) `/admin/feature-flags` → таблица overrides (`POST /admin/feature-flags/overrides`), (б) точечно с карточки конкретного пользователя `/admin/users/[id]` → секция "Feature flags" → тумблер (`PUT /admin/users/:id/feature-flags/:flagId`). Оба пути пишут в одну и ту же таблицу `UserFeatureFlag`. Для раздачи доступа ограниченному кругу тестовых людей путь (б) удобнее — не нужно искать пользователя по email в модалке. **Специальный код-level "admin bypass" не делаем** — админу, которому нужен доступ, достаточно выдать override самому себе тем же UI.

> ⚠️ **Флаг `arabic_language` — временный, только на период до интеграции с подписками.** Как только арабский станет частью платной подписки (см. требования ниже), доступ будет решаться статусом подписки, а не этим флагом — сам флаг и все его overrides на этом этапе удаляются из `/admin/feature-flags` (тем же способом, каким проект уже один раз чистил неиспользуемые demo-флаги: `ai_translation`, `audio_pronunciation`, `beta_deck_v2`, `export_dictionary`, `word_frequency_hints` — см. `prisma/helpers/featureFlagsHelper.ts` в истории репозитория). Не делать этот флаг постоянным operational kill-switch «про запас» — заводить отдельный kill-switch имеет смысл только при конкретной технической причине в момент интеграции с подписками, а не заранее.

### Frontend

- Новый `shared/lib/feature-flags/` — хук `useFeatureFlag(key: string): boolean` на TanStack Query (`queryOptions` с ключом `["feature-flags", "me", key]`, короткий `staleTime` — значение может измениться сразу после того как админ выдал override, кэш не должен долго врать).
- Библиотека (`library-filter-bar-lang-group.tsx` и мобильный вариант), study-language picker (шаг 6), админ-панель создания текста (шаг 5, если решено ограничивать и там) — показывают "арабский" **только** если `useFeatureFlag("arabic_language")` вернул `true`. При `false` — язык не отображается вообще (полное отсутствие пункта, не задизейбленная опция), чтобы не провоцировать вопросы у обычных пользователей.

### Требования к реализации
- **Не путать с `LANGUAGES`/`AppLanguage.enabled`** (`shared/lib/languages/languages.ts`) — это статический билд-тайм переключатель "фича готова к GA для всех", он остаётся `AR.enabled: false` и **этим шагом не трогается**. Динамический доступ по флагу накладывается поверх: реальный видимый список языков = `ENABLED_LANGUAGES` (статически, сейчас только `CHE`) ∪ (`AR`, если флаг включён для текущего пользователя).
- Будущая интеграция с подписками (озвучена пользователем, но не в скоупе этого плана) технически сведётся к замене источника правды внутри `isFeatureEnabled`/`useFeatureFlag` на проверку активной подписки — расширять точку сейчас заранее не нужно (не проектировать под гипотетическое будущее), достаточно, что сегодня это уже единственное место проверки. **После этой замены флаг `arabic_language` и его overrides удаляются** (см. предупреждение выше) — доступ дальше полностью решает биллинг, никакой "полу-флаговой" прослойки не остаётся.

> **Аудит подтвердил (2026-07-03):** механизм для этой будущей замены уже существует в биллинг-модуле — `Plan.limits` (Json, типизирован через `PlanLimits` в `src/billing/plan-limits.ts`) уже содержит булевы фичи по плану (`hasComplexTexts`, `hasFlashcards`, `personalDictionary` и т.д.), и паттерн `subscription (ACTIVE/TRIALING) → plan.limits.<field>` уже трижды используется в реальных сервисах (`token.service.ts`, `dictionary.service.ts`, `folders.service.ts`). Будущая интеграция — это добавление поля `arabicLanguageAccess: boolean` в `PlanLimits` и `limits` конкретных планов, без новой инфраструктуры.
>
> **Сознательно не делаем это сейчас**, хотя механизм уже есть: оплата на проекте пока `PaymentProvider.MANUAL`-заглушка (нет реальной интеграции с платёжным провайдером), и **лимиты у всех планов (FREE/PREMIUM/PRO) сейчас искусственно открыты** — в `billingHelper.ts` явный комментарий, что все планы временно имеют лимиты уровня PRO. Привязать арабский к `PlanLimits` в этом состоянии означало бы открыть его вообще всем пользователям (FREE тоже "PRO" по факту), а не ограниченному кругу — то есть решать задачу текущего шага (ограниченный доступ) через ещё не настроенную систему монетизации. Феча-флаг с per-user override для этого подходит лучше именно сейчас; переход на `PlanLimits` — отдельная будущая задача, которая должна выполняться вместе с реальной настройкой лимитов по планам, а не раньше.
- `GET /feature-flags/me` — рейт-лимит/кэш на бэкенде не требуется (простой indexed lookup), но результат на фронте не должен кэшироваться агрессивно (см. `staleTime` выше).

---

## Шаг 4 — Frontend: унификация типа языка в `AppLanguage`

**Что делаем:** Убираем 4 дублирующихся локальных типа, везде используем `AppLanguage` из `shared/lib/languages`.

### Скиллы
- `/coding-standards`
- `/react19`

### Изменения

> ⚠️ **Уточнено ревью (2026-07-03):** 4 типа языка на фронте **уже не идентичны друг другу** — унификация частично и стихийно продвинулась до текущего момента. Проверять фактическое состояние каждого файла перед правкой, не полагаться на то, что все четыре стартуют одинаково:
> - `entities/admin-text/api/types.ts:4` — **уже** `"CHE" | "RU" | "AR" | "EN"` (полный набор).
> - `entities/user-text/api/types.ts:5` — **уже** `"CHE" | "RU" | "AR" | "EN"` (полный набор).
> - `entities/text/api/types.ts:6` — всё ещё `"CHE" | "RU" | "EN" | string` (без `AR`, плюс небезопасный `| string`).
> - `entities/library-text/api/types.ts:3` — всё ещё `"CHE" | "RU" | "EN"` (без `AR`).

Заменить локальные объявления импортом `AppLanguage`:
- `src/entities/admin-text/api/types.ts:4` — `export type TextLanguage = AppLanguage;` (или прямой re-export/alias, сохраняя имя `TextLanguage` как публичный тип entity, но без дублирования значений).
- `src/entities/text/api/types.ts:6` — заменить `"CHE"|"RU"|"EN"|string` на `AppLanguage` (убрать небезопасный `| string`).
- `src/entities/library-text/api/types.ts:3` — `LibraryTextLanguage` → `AppLanguage`.
- `src/entities/user-text/api/types.ts` и `shared/lib/script-detector/index.ts` — уже используют полный `"CHE"|"RU"|"AR"|"EN"`, заменить на импорт `AppLanguage` вместо повторного объявления.
- **Критично:** `src/shared/ui/admin-text-editor/admin-text-meta-panel-shell.tsx:6` и `admin-text-meta-status-section.tsx:9` — заменить локальный `type TextLanguage = "CHE" | "RU"` на импорт `AppLanguage` из `@/shared/lib/languages`. Это разблокирует шаг 5.

### Требования
- Каждый импорт — через публичный barrel слоя (`@/shared/lib/languages`, `@/entities/text` и т.д.), не из внутренних путей.
- Алиасы `TextLanguage`/`LibraryTextLanguage` оставлять только там, где есть реальные внешние потребители имени типа за пределами этого шага; если после перехода на `AppLanguage` алиас больше нигде не используется как отдельное имя — удалять его, а не оставлять "на будущее" (против принципа CLAUDE.md не проектировать под гипотетические сценарии).
- После этого шага — `grep -rn '"CHE" | "RU"' src/` не должен находить самодельных языковых union-типов вне `shared/lib/languages`.

---

## Шаг 5 — Frontend: админка создания/редактирования текста поддерживает все языки

**Что делаем:** `AdminTextMetaPanelShell`/`AdminTextMetaStatusSection` должны рендерить весь список `LANGUAGES` (включая выключенные для паблика, админ должен иметь возможность создать арабский текст даже пока фича-флаг для публичной библиотеки выключен), а не хардкод CHE/RU.

### Скиллы
- `/react19`
- `/ui-ux-pro-max` — доступность выбора языка (radio-группа/select)
- `/coding-standards`

### Изменения
- `admin-text-meta-status-section.tsx` — заменить два хардкодных пункта (`langChe`/`langRu` лейблы, судя по коду в `admin-text-meta-panel-shell.tsx:134-135`) на `.map()` по `LANGUAGES` (все, не только `ENABLED_LANGUAGES` — админ работает с полным списком).
- Добавить i18n-ключи `admin.texts.createPage.langAr`, `langEn` в `ru.json`/`che.json`/`en.json` (уже есть `langChe`, `langRu`).
- `use-admin-text-create-page.ts`, `use-admin-text-edit-page.ts` — убедиться, что `language` пробрасывается как `AppLanguage`, без сужения типа.

### Требования
- Именованный `handleLanguageSelect` вместо инлайн-стрелки в `.map()`.
- Создание черновика с `language: AR` разрешено сразу (нужно для тестовых данных перед шагом 8). **Публикация** (перевод статуса в `published`) для `language !== "CHE"` должна быть заблокирована в UI/сервисе до завершения шага 7 — иначе в паблик уйдёт арабский текст без RTL-рендера.

---

## Шаг 6 — Frontend: выбор изучаемого языка пользователем

**Что делаем:** UI для `User.language` — до этого поле существовало в схеме, но не использовалось клиентом.

### Скиллы
- `/react19` — `useActionState` для формы сохранения
- `/ui-ux-pro-max`
- `/coding-standards`

### Изменения
- Новая фича `features/study-language-picker/` (или расширение существующей `features/profile-*`, если она уже есть — проверить перед созданием новой) — селектор из `ENABLED_LANGUAGES` (статически включённые языки) **плюс** `AR`, если `useFeatureFlag("arabic_language")` (шаг 3.5) вернул `true` для текущего пользователя — сохраняющий выбор в `User.language` через существующий profile-update эндпоинт (нужно добавить `language` в DTO обновления профиля на бэкенде, если его там нет).
- Библиотека (`use-library-filters.ts`) — дефолтный фильтр языка при первом заходе = `user.language`, а не всегда `"all"`/`"CHE"`.
- Разместить в онбординге (если есть шаг онбординга) и/или в настройках профиля.

### Требования
- `useSuspenseQuery` с гардом на `userId` в родителе, если используется саспенс-паттерн профиля.
- Селектор не ломает существующий UX для пользователей без явного выбора (дефолт `CHE`, как в схеме).
- Пользователь без выданного override **не видит** пункт "арабский" в селекторе вообще — не задизейбленную опцию с подсказкой "скоро", а полное отсутствие пункта (см. шаг 3.5).

---

## Шаг 7 — Frontend: RTL для реального арабского текста в ридере

**Что делаем:** Развести два независимых переключателя RTL: (а) существующий `ChScript === "ARABIC"` (чеченский в арабской графике) и (б) новый `text.language === "AR"` (настоящий арабский текст). Оба должны корректно рендериться, не мешая друг другу.

### Скиллы
- `/react19`
- `/vercel-react-best-practices` — не удваивать RTL-логику, переиспользовать существующие CSS-классы/шрифты
- `/ui-ux-pro-max` — направление интерфейса вокруг текста (кнопки/тулбар остаются LTR, если UI-локаль не арабская — это разные вещи)

### Изменения
- `src/widgets/reader-body/ui/reader-body.tsx` — сейчас RTL применяется через хук `useReaderScript()` (:78): `isArabicScript = script === "ARABIC"` → `dir={isArabicScript ? "rtl" : undefined}` (:220, :245). Добавить независимое условие: если `text.language === "AR"`, применять `dir="rtl"` и арабский шрифт **напрямую от языка текста**, не от `useReaderScript()`. Если оба условия истинны одновременно (в теории невозможно — `AR`-язык текста не имеет ChScript-переключателя, т.к. этот переключатель существует только для чеченских текстов) — задокументировать инвариант явно в коде (комментарий), чтобы будущий разработчик не свёл их в одну переменную.
- `script-switcher-footer.tsx` / `ScriptSwitcher` — скрыть полностью для текстов с `language !== "CHE"` (эта фича транслитерации осмысленна только для чеченского).
- Переиспользовать существующие шрифты (`Scheherazade New`, `Amiri`, `Lateef`) и CSS-классы RTL из `globals.css` — не дублировать.

### Требования
- Не трогать существующую логику `ChScript` для чеченских текстов — только добавлять параллельную ветку для `language === "AR"`.
- Проверить Tiptap-редактор (`admin-text-editor`) — направление ввода текста для арабского языка (RTL editing), если админы будут писать/вставлять арабские тексты напрямую в редактор.

---

## Шаг 8 — Включение доступа через override + сквозная проверка

**Что делаем:** **Не** трогаем статический `LANGUAGES`/`AR.enabled` в `src/shared/lib/languages/languages.ts` — он остаётся `false` (арабский не готов к GA для всех). Вместо этого через `/admin/feature-flags` создаём флаг `arabic_language` (см. шаг 3.5) и выдаём override тестовому пользователю. Полный прогон сценария от лица (а) обычного пользователя без доступа, (б) пользователя с выданным override.

### Скиллы
- `/verify`
- `/security-review` — проверка что путь (а) действительно ничего не видит и не может получить арабский текст напрямую по id

### Проверка

**Без доступа (обычный пользователь, флаг выключен):**
- [ ] Библиотека: фильтр по языку не показывает "Арабский".
- [ ] Study-language picker: пункт "арабский" отсутствует.
- [ ] Прямой запрос к arabic-тексту по известному id (например через API-клиент/devtools) — не отдаёт контент.

**С доступом (override выдан через `/admin/feature-flags`):**
- [ ] Библиотека: фильтр по языку показывает "Арабский", можно отфильтровать тексты.
- [ ] Админка: можно создать новый текст с `language: AR`, ввести арабский текст в редакторе (RTL ввод).
- [ ] Ридер: арабский текст рендерится RTL, шрифт корректный, click-to-translate работает (слово → AI-translation с `sourceLanguage: "ar"`).
- [ ] Словарь/vocabulary: арабские леммы сохраняются отдельно от чеченских (`@@unique([normalized, language])` не даёт коллизий).
- [ ] Spelling dictionary: фильтр по языку не мешает существующему чеченскому словарю.
- [ ] Профиль: пользователь может выбрать "изучаю арабский", библиотека по умолчанию фильтруется под это.
- [ ] После удаления override (`DELETE /admin/feature-flags/overrides/:id`) — доступ пропадает сразу же (без перезахода, учитывая короткий `staleTime` хука `useFeatureFlag`).

---

## Шаг 9 — Polish

### Скиллы
- `/security-review` — проверка новых DTO-полей (`sourceLanguage`, `language`) на инъекции в промпты
- `/ui-ux-pro-max` — RTL доступность (aria, направление фокуса Tab в арабском тексте)
- `/verify` — ручная сквозная проверка в браузере

### Чеклист
- [ ] `grep -rn '"CHE" | "RU"'` в src/ фронтенда — пусто вне `shared/lib/languages`
- [ ] AI-cache не путает арабские и чеченские переводы одного слова (разные ключи кэша)
- [ ] Ни один текст с `language !== "CHE"` не проходит через `MorphologyRule`-движок молча
- [ ] i18n: все новые ключи (`langAr`, `langEn`, study-language-picker) добавлены в `ru.json`, `che.json`, `en.json` одновременно
- [ ] Метаданные страниц библиотеки/ридера не сломаны для существующих чеченских текстов (регрессия)

---

## Итоговый список файлов

### Backend — новые/изменяемые
| Файл | Что меняется |
|---|---|
| `src/ai-translation/dto/translation-language.ts` | + `SUPPORTED_SOURCE_LANGUAGES`, `SOURCE_LANGUAGE_NAMES` |
| `src/ai-translation/dto/*.dto.ts` | + опциональное поле `sourceLanguage` |
| `src/ai-translation/ai-translation.service.ts` | промпты параметризованы по `sourceLanguage`; кэш-ключ включает язык |
| `src/ai-translation/ai-translation.controller.ts` | обновлены `@ApiOperation summary` |
| `prisma/schema.prisma` | `SpellingEntry.language`, комментарий про MorphologyRule/AR |
| `admin-morphology.service.ts` | явный guard: не запускать суффиксные правила для не-CHE текстов |
| `src/feature-flags/feature-flags.module.ts` (новый) | регистрирует существующий `FeatureFlagsService` как provider/export |
| `src/feature-flags/feature-flags.controller.ts` (новый) | публичный `GET /feature-flags/me?keys=...` |
| текстовый/библиотечный модуль (листинг + detail) | server-side фильтрация/404 для `language: AR` без доступа |

### Frontend — новые/изменяемые
| Файл | Что меняется |
|---|---|
| `entities/admin-text/api/types.ts`, `entities/text/api/types.ts`, `entities/library-text/api/types.ts`, `entities/user-text/api/types.ts`, `shared/lib/script-detector/index.ts` | локальные типы языка → импорт `AppLanguage` |
| `shared/ui/admin-text-editor/admin-text-meta-panel-shell.tsx`, `admin-text-meta-status-section.tsx` | полный список языков вместо `"CHE"\|"RU"` |
| `entities/spelling-dictionary/api/types.ts`, `spelling-dictionary-api.ts` | + `language` поле/параметр |
| `shared/lib/feature-flags/` (новая) | хук `useFeatureFlag(key)` на TanStack Query |
| `features/study-language-picker/` (новая) | выбор изучаемого языка, арабский виден только при включённом флаге |
| `features/library-filters/model/use-library-filters.ts` | дефолтный фильтр = `user.language`; арабский в списке фильтров только при флаге |
| `widgets/reader-body/ui/reader-body.tsx` | независимая RTL-ветка для `language === "AR"` |
| `widgets/reader-footer/ui/script-switcher-footer.tsx` | скрыт для `language !== "CHE"` |
| `src/locales/ru.json`, `che.json`, `en.json` | новые ключи (langAr/langEn, study-language-picker, RTL hints) |

### Не затрагивается
- Модуль транслитерации чеченского (`ChScript`, `TextScriptVersion`) — существующая логика для чеченских текстов не меняется, только явно исключается для нечеченских.
- `MorphologyRule`-движок как таковой — не переписывается, только скоуп ограничивается CHE.
- `shared/lib/languages/languages.ts` — `AR.enabled` остаётся `false`; переключение видимости для конкретных пользователей идёт исключительно через `/admin/feature-flags` (шаг 3.5), а не через этот статический конфиг.

---

## Оценка трудозатрат

| Шаг | Оценка |
|---|---|
| 1 — AI-translation sourceLanguage + миграция кэша + batch-путь | ~4 ч |
| 2 — SpellingEntry.language | ~1 ч |
| 3 — Морфология: решение + guard | ~1 ч |
| 3.5 — Feature-flags: модуль, /me эндпоинт, server-side enforcement, useFeatureFlag | ~3 ч |
| 4 — Унификация TextLanguage | ~1.5 ч |
| 5 — Админка все языки (+ блокировка публикации до шага 7) | ~1.5 ч |
| 6 — User.language UI (гейтится флагом) | ~2 ч |
| 7 — RTL для языка текста | ~2.5 ч |
| 8 — Override + сквозная проверка (нужен тестовый AR-текст) | ~1.5 ч |
| 9 — Polish | ~1 ч |
| **Итого** | **~19 ч** |

## Дополнительно не покрыто планом (зафиксировано ревью, не блокирует MVP)

- SEO-метаданные и `hreflang`/`dir` для арабских маршрутов ридера — отдельная доработка после MVP.
- Полнотекстовый поиск с учётом языка (сейчас есть только фильтр по языку в библиотеке, а не в поиске) — не в скоупе этого плана.
