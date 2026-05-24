# Перенос web-аналитики Dosham → читалка (mott-larbe-backend)

Самописная privacy-friendly аналитика (аналог Plausible/Fathom).
Цель переноса — трекинг `word_click`, `pageview`, `text_open` в читалке.

---

## Исходники для копирования

### Бэкенд — `src/analytics/` (Dosham)

| Файл | Что делает | Менять? |
|------|-----------|---------|
| `analytics.service.ts` | Ядро: visitorId, sessionId, Redis-очередь, realtime ZSET | Нет |
| `analytics-queue.worker.ts` | @Interval 10s → батч 500 → `createMany` в Postgres | Нет |
| `analytics-aggregator.service.ts` | @Cron EVERY_HOUR → upsert `AnalyticsDailyStats` за последние 3 дня | Нет |
| `geoip.service.ts` | MaxMind GeoLite2 mmdb → IP → country/city, graceful если файла нет | Нет |
| `referrer-categorization.ts` | Классификация referrer: search/direct/social/other | Нет |
| `analytics.controller.ts` | `POST /analytics/track` — публичный, rate 120/min/IP | Нет |
| `analytics-admin.service.ts` | Запросы для admin-дашборда (overview, timeseries, geo, devices…) | Нет |
| `analytics-admin.controller.ts` | 28 admin-эндпоинтов под `/admin/analytics/*`, требует `CAN_VIEW_ANALYTICS` | Нет |

### Фронтенд — `src/features/admin-analytics/` (Dosham)

| Файл | Что делает | Менять? |
|------|-----------|---------|
| `types.ts` | Все TS-типы. Поменять только `LIVE_EVENT_TYPES` | Только `LIVE_EVENT_TYPES` |
| `api.ts` | Все axios-вызовы к `/admin/analytics/*` | Нет |
| `queries.ts` | React Query хуки поверх `api.ts` | Нет |
| `use-analytics-range.ts` | Хук диапазона дат (today/7d/30d/90d/custom) с URL-синхронизацией | Нет |

---

## Что добавить/изменить при переносе

### 1. Prisma — две новые модели

```prisma
model AnalyticsEvent {
  id        String   @id @default(cuid())
  visitorId String
  sessionId String
  userId    String?

  eventType String
  path      String?
  referrer  String?
  device    String?
  browser   String?
  os        String?
  country   String?
  city      String?
  metadata  Json?

  createdAt DateTime @default(now())

  @@index([createdAt])
  @@index([visitorId, createdAt])
  @@index([eventType, createdAt])
  @@index([path, createdAt])
  @@map("analytics_event")
}

model AnalyticsDailyStats {
  date             DateTime @id
  uniqueVisitors   Int
  sessions         Int
  pageviews        Int
  totalEvents      Int
  avgSessionSec    Int
  bounceRate       Float
  topPaths         Json
  topReferrers     Json
  topCountries     Json
  topCities        Json
  topEventTypes    Json
  deviceBreakdown  Json
  browserBreakdown Json
  osBreakdown      Json

  @@map("analytics_daily_stats")
}
```

### 2. `AnalyticsModule` — создать новый файл

```typescript
// src/analytics/analytics.module.ts
@Module({
  imports: [ScheduleModule, PrismaModule, RedisModule],
  providers: [
    AnalyticsService,
    AnalyticsQueueWorker,
    AnalyticsAggregatorService,
    AnalyticsAdminService,
    GeoIpService,
  ],
  controllers: [AnalyticsController, AnalyticsAdminController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
```

Подключить в `app.module.ts`.

### 3. Типы событий — заменить `LIVE_EVENT_TYPES` в `types.ts`

```typescript
// БЫЛО (Dosham):
export const LIVE_EVENT_TYPES = [
  "pageview", "search", "entry_view", "favorite_add",
  "random_word", "word_of_day", "phraseology_view", ...
] as const;

// СТАНЕТ (читалка):
export const LIVE_EVENT_TYPES = [
  "pageview",       // переход на страницу
  "text_open",      // открыл текст
  "text_finish",    // дочитал до конца
  "word_click",     // кликнул на слово → попап с переводом
  "word_add_dict",  // добавил слово в словарь из попапа
  "word_dismiss",   // закрыл попап без действия
  "ai_translation", // запросил AI-перевод
  "search",         // поиск в каталоге текстов
] as const;
```

### 4. `token.controller.ts` — встроить трекинг `word_click`

```typescript
// Добавить OptionalJwtAuthGuard и вызов analytics.track()
@Post('lookup')
@UseGuards(OptionalJwtAuthGuard)
async lookup(@Body() dto: LookupDto, @Req() req) {
  const result = await this.tokenService.lookup(dto);

  void this.analytics.track({
    type: 'word_click',
    path: req.headers['referer'] ?? null,
    ip: extractIp(req),
    userAgent: req.headers['user-agent'],
    userId: req.user?.id,
    metadata: {
      word: dto.word,
      textId: dto.textId,
      hasTranslation: !!result.translation,
      cacheHit: result.fromCache,
    },
  });

  return result;
}
```

`OptionalJwtAuthGuard` обязателен — без него `req.user` всегда `undefined`.

### 5. `text.controller.ts` — встроить трекинг `text_open`

```typescript
void this.analytics.track({
  type: 'text_open',
  path: `/texts/${textId}`,
  ip: extractIp(req),
  userAgent: req.headers['user-agent'],
  userId: req.user?.id,
  metadata: { textId, title: text.title },
});
```

### 6. Фронт — хук `usePageAnalytics()`

Написать самому (маленький кусок, в Dosham это делал `<Analytics />` от Vercel):

```typescript
// hooks/use-page-analytics.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // или usePathname в Next.js
import { apiClient } from '@/shared/api';

export function usePageAnalytics() {
  const location = useLocation();

  useEffect(() => {
    void apiClient.post('/analytics/track', {
      type: 'pageview',
      path: location.pathname,
      referrer: document.referrer || undefined,
    }).catch(() => {});
  }, [location.pathname]);
}
```

Подключить один раз в корневом layout.

### 7. Фронт — `word_click` из компонента попапа (если нет HTTP-запроса)

Если попап открывается без запроса на бэк:
```typescript
useEffect(() => {
  void apiClient.post('/analytics/track', {
    type: 'word_click',
    path: window.location.pathname,
    metadata: { word, textId },
  }).catch(() => {});
}, [word]);
```

Если word_click уходит как HTTP lookup на бэк — трекать там, с фронта **не дублировать**.

---

## MaxMind GeoIP (опционально)

GeoIP нужен для страницы Geography в дашборде (топ стран/городов). Без него поля `country`/`city` у событий = `null`, всё остальное работает нормально.

### Как работает `geoip.service.ts`

- При `onModuleInit` ищет mmdb-файл по приоритету:
  1. `GEOIP_MMDB_PATH` из env (если задан)
  2. `/data/geoip/GeoLite2-City.mmdb`
  3. `/data/geoip/GeoLite2-Country.mmdb`
- Если файл не найден — логирует предупреждение, `reader = null`, `lookup()` возвращает `{ country: null, city: null }`. Приложение не падает.
- Тип базы определяется автоматически по `metadata.databaseType`. City-база даёт и страну, и город; Country-база — только страну.
- LRU-кэш на 1000 IP внутри maxmind-reader — повторные lookup бесплатны.

### Как получить файл

MaxMind GeoLite2 бесплатен, нужна регистрация:
1. Зарегистрироваться на [maxmind.com](https://www.maxmind.com/en/geolite2/signup)
2. Скачать `GeoLite2-City.mmdb` (или `GeoLite2-Country.mmdb` — меньше, только страны)
3. Положить в `/data/geoip/GeoLite2-City.mmdb` или задать `GEOIP_MMDB_PATH` в `.env`

### docker-compose — монтирование файла

```yaml
# docker-compose.yml
services:
  app:
    volumes:
      - ./data/geoip:/data/geoip:ro  # mmdb монтируется как read-only
    environment:
      GEOIP_MMDB_PATH: /data/geoip/GeoLite2-City.mmdb  # опционально
```

### npm-зависимость

```bash
npm install maxmind
```

### Admin-эндпоинт для проверки статуса

`GET /admin/analytics/geography/status` — возвращает:
```json
{
  "configured": true,
  "databasePath": "/data/geoip/GeoLite2-City.mmdb",
  "databaseExists": true,
  "databaseType": "GeoLite2-City",
  "supportsCity": true,
  "loadedAt": "2026-05-24T10:00:00.000Z",
  "fileSize": 67108864,
  "buildEpoch": "2026-05-01T00:00:00.000Z",
  "recent": {
    "windowDays": 7,
    "totalEvents": 5000,
    "eventsWithCountry": 4800,
    "coverage": 0.96
  }
}
```

Фронт по `configured: false` показывает setup-панель вместо карты.

---

## Порядок шагов для Claude

```
1. Добавить две модели в schema.prisma: AnalyticsEvent, AnalyticsDailyStats
2. npm install maxmind ua-parser-js (если не установлены)
3. Скопировать в src/analytics/:
   analytics.service.ts, analytics-queue.worker.ts,
   analytics-aggregator.service.ts, analytics-admin.service.ts,
   analytics-admin.controller.ts, analytics.controller.ts,
   geoip.service.ts, referrer-categorization.ts
4. Создать analytics.module.ts, подключить в app.module.ts
5. token.controller.ts: добавить OptionalJwtAuthGuard + track(word_click)
6. text.controller.ts: добавить track(text_open)
7. Фронт: скопировать features/admin-analytics/ (api.ts, types.ts, queries.ts,
   use-analytics-range.ts) из Dosham
8. Фронт: заменить LIVE_EVENT_TYPES в types.ts
9. Фронт: добавить usePageAnalytics() в корневой layout
10. (Опционально) Скачать GeoLite2-City.mmdb, добавить volume в docker-compose
```

---

## Что самое ценное

`word_click` с `metadata.word` — главное событие читалки. Через неделю сбора данных сразу видно:
- Какие слова чаще всего незнакомы читателям
- Какие тексты вызывают больше кликов (= сложнее)
- В какое время суток пользователи читают
- Конверсия: `word_click` → `word_add_dict` (насколько полезны переводы)
