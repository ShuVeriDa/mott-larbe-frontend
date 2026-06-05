# Plan: In-App Notification System (Колокольчик)

**Objective:** Реализовать систему in-app уведомлений с колокольчиком, badge, дропдауном/drawer и real-time доставкой через WebSocket.

**Platform:** Mott Larbe — языковая платформа (Next.js 16.2.5 + React 19.2.4 + NestJS 11 + PostgreSQL/Prisma)

**Total steps:** 7 (Steps 3 & 4 параллельны; Steps 5 начинается после Step 2)

**Skills per step:** указаны в каждом шаге

---

## Dependency Graph

```
Step 1 (Prisma schema)
  └─► Step 2 (Backend notification module)
        ├─► Step 3 (EventEmitter интеграция)   ─┐ параллельно
        ├─► Step 4 (WebSocket gateway)          ─┘
        └─► Step 5 (Frontend entity)
              └─► Step 6 (Frontend features)
                    └─► Step 7 (Widget: колокольчик)
```

---

## Invariants (проверять после каждого шага)

- `pnpm build` проходит без ошибок TypeScript
- `pnpm prisma validate` (после Step 1, 2)
- Ни один существующий тест не сломан
- Нет `any` типов в новом коде
- Все пользовательские строки локализованы (che / ru / en)
- FSD слои не нарушены (нет импортов снизу вверх)
- Один компонент на файл

## Исправления по результатам adversarial review

Все 6 критических проблем зафиксированы и учтены в шагах:


| #   | Проблема                                                                                   | Шаг       | Фикс                                                                          |
| --- | ------------------------------------------------------------------------------------------ | --------- | ----------------------------------------------------------------------------- |
| 1   | WS handshake: `req.cookies` не заполняется (Express middleware не работает при WS upgrade) | Step 4    | Парсить raw `Cookie` header вручную                                           |
| 2   | Token rotation vs long-lived socket: access_token истекает, reconnect цикл ломается        | Steps 4+7 | Reconnect детектирует auth (4001) vs transport ошибку; не hot-loop            |
| 3   | `useMediaQuery` не существует в проекте                                                    | Step 7    | Создать `shared/lib/media-query/` как под-задачу Step 7                       |
| 4   | Fire-and-forget admin fan-out: emit до коммита транзакции, N отдельных create              | Step 3    | Emit только после commit; `createMany` для admin notifications                |
| 5   | Optimistic updates без rollback: 3 writer'а конфликтуют за кэш                             | Steps 6+7 | Полный TanStack v5 паттерн: `cancelQueries` + snapshot + rollback в `onError` |
| 6   | IDOR: userId для всех запросов должен браться из JWT, не из параметров                     | Step 2    | Явно задокументировано в контексте Step 2                                     |


---

## Step 1 — Prisma Schema: модель Notification

**Branch:** `feat/notifications-schema`
**Skills:** `postgres-patterns`, `security-review`
**Model tier:** strongest (schema — критическое решение)
**Depends on:** —
**Blocks:** Step 2

### Context brief

Проект: NestJS 11 + Prisma 7 + PostgreSQL. Backend в `F:\programming\mott-larbe\mott-larbe-backend`. Prisma schema находится в `prisma/schema.prisma`. Уведомлений в проекте ещё нет — нужно добавить новую модель.

### Tasks

1. Добавить enum `NotificationType` в `prisma/schema.prisma`:
  ```prisma
   enum NotificationType {
     // Для пользователя
     FEEDBACK_REPLY
     SUGGESTION_APPROVED
     SUGGESTION_REJECTED
     TEXT_SUBMISSION_APPROVED
     TEXT_SUBMISSION_REJECTED
     // Для администратора
     NEW_FEEDBACK_THREAD
     NEW_TEXT_SUBMISSION
     NEW_SUGGESTION
   }
  ```
2. Добавить модель `Notification`:
  ```prisma
   model Notification {
     id        String           @id @default(cuid())
     userId    String
     type      NotificationType
     entityId  String?          // threadId / suggestionId / submissionId
     isRead    Boolean          @default(false)
     createdAt DateTime         @default(now())
     user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)

     @@index([userId, isRead])
     @@index([userId, createdAt(sort: Desc)])
   }
  ```
3. Добавить обратную связь в модель `User`:
  ```prisma
   notifications Notification[]
  ```
4. Сгенерировать миграцию:
  ```bash
   pnpm prisma migrate dev --name add-notifications
  ```
5. Сгенерировать клиент:
  ```bash
   pnpm prisma generate
  ```

### Security checklist

- `onDelete: Cascade` — уведомления удаляются вместе с пользователем (GDPR)
- Индексы покрывают основные запросы: `[userId, isRead]` для unread count, `[userId, createdAt DESC]` для списка
- `entityId` — опциональное строковое поле, не FK (уведомление может пережить удаление сущности)

### Verification

```bash
pnpm prisma validate
pnpm prisma migrate status
```

### Exit criteria

- `prisma/schema.prisma` содержит модель `Notification` и enum `NotificationType`
- Миграция применена
- Prisma Client сгенерирован

---

## Step 2 — Backend: notification модуль (CRUD + API)

**Branch:** `feat/notifications-backend-module`
**Skills:** `security-review`, `coding-standards`
**Model tier:** strongest
**Depends on:** Step 1
**Blocks:** Steps 3, 4, 5

### Context brief

Backend: NestJS 11 монолит, `F:\programming\mott-larbe\mott-larbe-backend\src`. Prisma модель `Notification` уже существует (Step 1). Нужно создать изолированный `NotificationModule`. `@nestjs/event-emitter` — устанавливается в этом шаге. Паттерн других модулей: `service + controller + module`, инъекция через конструктор. Аутентификация: JWT через HttpOnly cookie, guard называется `JwtAuthGuard`. HTTP клиент фронтенда: axios с `withCredentials: true`.

Существующий паттерн модуля (пример из feedback):

```typescript
// feedback.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
```

### Tasks

1. Установить зависимости:
  ```bash
   pnpm add @nestjs/event-emitter
  ```
2. Подключить `EventEmitterModule` в `app.module.ts`:
  ```typescript
   import { EventEmitterModule } from '@nestjs/event-emitter';
   // В imports:
   EventEmitterModule.forRoot({ wildcard: false, delimiter: '.' }),
  ```
3. Создать `src/notification/notification.module.ts`
4. Создать `src/notification/notification.service.ts` с методами:
  - `create(data: CreateNotificationDto): Promise<Notification>` — создать уведомление
  - `findAllForUser(userId: string, limit = 20): Promise<Notification[]>` — последние N уведомлений
  - `getUnreadCount(userId: string): Promise<number>` — кол-во непрочитанных
  - `markRead(userId: string, notificationId: string): Promise<void>` — отметить прочитанным
  - `markAllRead(userId: string): Promise<void>` — отметить все прочитанными
  - `handleCreateEvent(payload: CreateNotificationPayload): Promise<void>` — обработчик EventEmitter
   Метод `handleCreateEvent` декорируется `@OnEvent('notification.create')`.
5. Создать `src/notification/notification.controller.ts`:
  - `GET /notifications?limit=20` — список уведомлений (JwtAuthGuard)
  - `GET /notifications/unread-count` — кол-во непрочитанных (JwtAuthGuard)
  - `PATCH /notifications/:id/read` — отметить прочитанным (JwtAuthGuard)
  - `PATCH /notifications/read-all` — отметить все прочитанными (JwtAuthGuard)
6. Создать DTO файлы:
  - `dto/create-notification.dto.ts` — `{ userId, type: NotificationType, entityId? }`
  - `dto/notification-response.dto.ts` — shape ответа
7. Создать `src/notification/notification-events.ts` — константы имён событий:
  ```typescript
   export const NOTIFICATION_EVENTS = {
     CREATE: 'notification.create',
   } as const;
  ```
8. Зарегистрировать `NotificationModule` в `app.module.ts`

### Security checklist

- Все эндпоинты защищены `JwtAuthGuard`
- `findAllForUser` и `markRead` фильтруют по `userId` из токена — пользователь не видит чужие уведомления
- `markRead` проверяет что `notification.userId === currentUser.id` перед обновлением (иначе 403)
- Нет раскрытия внутренних ID других пользователей

### Verification

```bash
pnpm build
# Проверить эндпоинты вручную через curl или Postman
curl -X GET http://localhost:3000/notifications \
  -H "Cookie: access_token=<jwt>"
```

### Exit criteria

- `NotificationModule` зарегистрирован и компилируется
- Все 4 эндпоинта отвечают корректно
- `@OnEvent('notification.create')` зарегистрирован в сервисе

### ⚠️ IDOR защита (из adversarial review)

`userId` для ВСЕХ операций (findAllForUser, getUnreadCount, markRead, markAllRead) берётся ТОЛЬКО из JWT principal (`@CurrentUser()` / `req.user.id`). Никогда из route params, query params или body. Нарушение — тривиальный IDOR, пользователь видит чужие уведомления.

---

## Step 3 — Backend: EventEmitter интеграция в существующие модули

**Branch:** `feat/notifications-events`
**Skills:** `coding-standards`, `security-review`
**Model tier:** default
**Depends on:** Step 2
**Parallel with:** Step 4
**Blocks:** Step 7 (косвенно — без событий нет уведомлений)

### Context brief

Backend `F:\programming\mott-larbe\mott-larbe-backend\src`. `EventEmitter2` и `NOTIFICATION_EVENTS` константы уже доступны из Step 2. Нужно добавить `this.eventEmitter.emit(...)` в 3 существующих сервиса. Не менять бизнес-логику — только добавить emit после успешных операций.

**Файлы для изменения:**


| Файл                                               | Метод                       | Условие emit                                                                   |
| -------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| `src/admin/feedback/admin-feedback.service.ts`     | `reply()` (line ~277)       | После создания PUBLIC_REPLY сообщения — emit для `thread.userId`               |
| `src/suggestions/suggestions.service.ts`           | метод approve/reject        | После изменения статуса Suggestion — emit для `suggestion.userId`              |
| `src/text-submissions/text-submissions.service.ts` | метод review/approve/reject | После изменения статуса Submission — emit для `submission.userId`              |
| `src/feedback/feedback.service.ts`                 | `createThread()`            | После создания треда — emit `NEW_FEEDBACK_THREAD` для всех admin пользователей |
| `src/suggestions/suggestions.service.ts`           | `create()`                  | После создания suggestion — emit `NEW_SUGGESTION` для admin                    |
| `src/text-submissions/text-submissions.service.ts` | `create()`                  | После создания submission — emit `NEW_TEXT_SUBMISSION` для admin               |


### Tasks

1. Инжектировать `EventEmitter2` в каждый из 3 сервисов через конструктор:
  ```typescript
   import { EventEmitter2 } from '@nestjs/event-emitter';
   constructor(
     private readonly prisma: PrismaService,
     private readonly eventEmitter: EventEmitter2,
   ) {}
  ```
2. В `admin-feedback.service.ts` метод `reply()` добавить после создания сообщения (только если `!dto.isInternal`):
  ```typescript
   this.eventEmitter.emit(NOTIFICATION_EVENTS.CREATE, {
     userId: thread.userId,
     type: NotificationType.FEEDBACK_REPLY,
     entityId: threadId,
   });
  ```
3. В `suggestions.service.ts` найти метод изменения статуса (approve/reject) и добавить:
  ```typescript
   // После approve:
   this.eventEmitter.emit(NOTIFICATION_EVENTS.CREATE, {
     userId: suggestion.userId,
     type: NotificationType.SUGGESTION_APPROVED,
     entityId: suggestion.id,
   });
   // После reject:
   this.eventEmitter.emit(NOTIFICATION_EVENTS.CREATE, {
     userId: suggestion.userId,
     type: NotificationType.SUGGESTION_REJECTED,
     entityId: suggestion.id,
   });
  ```
4. В `text-submissions.service.ts` найти метод `review()` (или approve/reject) и добавить аналогично для `TEXT_SUBMISSION_APPROVED` / `TEXT_SUBMISSION_REJECTED`.
5. Для уведомлений **администраторам** (NEW_FEEDBACK_THREAD, NEW_SUGGESTION, NEW_TEXT_SUBMISSION): получить список adminId из БД (`prisma.user.findMany({ where: { role: 'ADMIN' } })`) и эмитить для каждого. Делать это **асинхронно** (не блокировать ответ пользователю):
  ```typescript
   // fire-and-forget, не await
   void this.notifyAdmins(NotificationType.NEW_FEEDBACK_THREAD, thread.id);
  ```
6. Добавить приватный метод `notifyAdmins` в каждый сервис (или вынести в shared helper).
7. Обновить `imports` модулей (`FeedbackModule`, `SuggestionsModule`, `TextSubmissionsModule`) чтобы они импортировали `EventEmitterModule` если нужно (обычно достаточно глобальной регистрации в app.module).

### ⚠️ Критические детали реализации (из adversarial review)

**Emit только после коммита транзакции:**
`@nestjs/event-emitter` работает синхронно в процессе. Если emit происходит до коммита `$transaction`, уведомление будет создано для операции которая откатилась. Правило: emit всегда в `onSuccess` пути, после завершения `await prisma.$transaction(...)`.

**createMany для admin уведомлений:**
Не делать N отдельных `prisma.notification.create()` для каждого admin. Использовать `prisma.notification.createMany()`:

```typescript
const admins = await this.prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
await this.prisma.notification.createMany({
  data: admins.map(a => ({ userId: a.id, type, entityId })),
});
```

**Fire-and-forget с логированием (не глухое void):**

```typescript
// ✅ fire-and-forget, не блокирует response, но ошибки логируются
this.notifyAdmins(type, entityId).catch(err =>
  this.logger.error('Failed to notify admins', err)
);
```

### Security checklist

- `entityId` передаётся только ID сущности, без чувствительных данных
- `notifyAdmins` не блокирует response (fire-and-forget с логированием ошибок)
- Emit происходит только после успешной операции в БД (после `await prisma.$transaction`), никогда до коммита

### Verification

```bash
pnpm build
# Протестировать: admin отвечает на тикет → проверить таблицу Notification в БД
```

### Exit criteria

- При ответе admin на тикет создаётся запись в `Notification` для пользователя
- При approve/reject suggestion/submission создаётся уведомление
- При создании нового тикета/submission/suggestion создаётся уведомление для admin

---

## Step 4 — Backend: WebSocket Gateway для real-time доставки

**Branch:** `feat/notifications-websocket`
**Skills:** `security-review`, `coding-standards`
**Model tier:** strongest
**Depends on:** Step 2
**Parallel with:** Step 3
**Blocks:** Step 7

### Context brief

Backend `F:\programming\mott-larbe\mott-larbe-backend\src`. `@nestjs/websockets` и `ws` — устанавливаются здесь. `NotificationService` из Step 2 уже существует. JWT доставляется через HttpOnly cookie (`access_token`). WebSocket handshake должен верифицировать JWT из cookie.

### Tasks

1. Установить зависимости:
  ```bash
   pnpm add @nestjs/websockets @nestjs/platform-ws ws
   pnpm add -D @types/ws
  ```
2. Создать `src/notification/notification.gateway.ts`:
  ```typescript
   @WebSocketGateway({
     path: '/ws/notifications',
     transports: ['websocket'],
   })
   export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
     // Map userId → Set<WebSocket> (один пользователь может иметь несколько вкладок)
     private readonly clients = new Map<string, Set<WebSocket>>();

     handleConnection(client: WebSocket, req: IncomingMessage): void { ... }
     handleDisconnect(client: WebSocket): void { ... }
     sendToUser(userId: string, notification: Notification): void { ... }
   }
  ```
3. В `handleConnection` — извлечь JWT из cookie заголовка, верифицировать через `JwtService`, получить `userId`. При ошибке — закрыть соединение с кодом 4001.
4. Хранить mapping `userId → Set<WebSocket>` (поддержка нескольких вкладок).
5. Метод `sendToUser(userId, notification)` — отправить JSON всем сокетам пользователя.
6. В `NotificationService.handleCreateEvent` после сохранения в БД вызвать `gateway.sendToUser(...)`:
  ```typescript
   @OnEvent('notification.create')
   async handleCreateEvent(payload: CreateNotificationPayload) {
     const notification = await this.create(payload);
     this.gateway.sendToUser(payload.userId, notification);
   }
  ```
7. Добавить `NotificationGateway` в `providers` и `exports` `NotificationModule`.
8. Обработка отключения: удалить сокет из `clients` map, удалить userId если Set пустой.

### ⚠️ Критические детали реализации (из adversarial review)

**Cookie parsing на WS handshake:**
Express middleware (`cookie-parser`) НЕ выполняется для WS upgrade запросов. `req.cookies` будет пустым. Необходимо парсить raw `Cookie` header вручную:

```typescript
import { parse as parseCookie } from 'cookie';

handleConnection(client: WebSocket, req: IncomingMessage): void {
  const cookieHeader = req.headers.cookie ?? '';
  const cookies = parseCookie(cookieHeader);
  const token = cookies['access_token'];
  if (!token) { client.close(4001, 'Unauthorized'); return; }
  // Верифицировать через тот же JWT_ACCESS_SECRET что использует jwt.strategy.ts
  // Вынести verify-функцию в общий хелпер чтобы не дублировать логику
}
```

**Token rotation vs long-lived socket:**
Access token ротируется. После истечения reconnect получит 4001 даже при живой сессии пользователя. Логика reconnect в Step 7 должна:

- Различать код 4001 (auth error) от транспортных ошибок
- При 4001: НЕ hot-loop; подождать до следующего успешного REST запроса (который через interceptor обновит cookie), затем retry
- Добавить max attempts с backoff и остановкой при повторных 4001

### Security checklist

- **JWT извлекается из raw `Cookie` header** — `req.cookies` не используется (не заполняется при WS upgrade)
- JWT верифицируется через общий хелпер (не дублировать логику из `jwt.strategy.ts`)
- При невалидном JWT — `client.close(4001, 'Unauthorized')` немедленно
- `sendToUser` отправляет только уведомления для конкретного userId (не broadcast)
- Нет утечки уведомлений других пользователей
- Heartbeat/ping-pong для детекции мёртвых соединений (опционально, но рекомендуется)
- Ограничение на кол-во одновременных соединений от одного пользователя (max 5 вкладок)

### Verification

```bash
pnpm build
# Тест WebSocket соединения:
wscat -c "ws://localhost:3000/ws/notifications" --header "Cookie: access_token=<jwt>"
```

### Exit criteria

- WebSocket gateway принимает авторизованные соединения
- Неавторизованные соединения отклоняются с кодом 4001
- При создании уведомления (через EventEmitter) сообщение доставляется online-клиенту в реальном времени

---

## Step 5 — Frontend: entity/notification (API, типы, queryOptions)

**Branch:** `feat/notifications-frontend-entity`
**Skills:** `react19`, `coding-standards`
**Model tier:** default
**Depends on:** Step 2
**Blocks:** Step 6

### Context brief

Frontend `F:\programming\mott-larbe\mott-larbe-frontend\src`. FSD архитектура. HTTP клиент: `axios` instance из `@/shared/api` (экспортируется как `http`). TanStack Query v5 — `queryOptions()` как единый источник истины. Все типы в `model/types.ts`. Пример структуры entity: `src/entities/feedback/` — `api/`, `model/`, `index.ts`.

**Правила CLAUDE.md:**

- Arrow functions везде
- Типы в `model/types.ts` (кроме props)
- `queryOptions()` с явным `staleTime`
- Нет `any`
- Импорты только через barrel `index.ts`

### Tasks

1. Создать `src/entities/notification/model/types.ts`:
  ```typescript
   export type NotificationType =
     | 'FEEDBACK_REPLY'
     | 'SUGGESTION_APPROVED'
     | 'SUGGESTION_REJECTED'
     | 'TEXT_SUBMISSION_APPROVED'
     | 'TEXT_SUBMISSION_REJECTED'
     | 'NEW_FEEDBACK_THREAD'
     | 'NEW_TEXT_SUBMISSION'
     | 'NEW_SUGGESTION';

   export interface Notification {
     id: string;
     userId: string;
     type: NotificationType;
     entityId: string | null;
     isRead: boolean;
     createdAt: string;
   }

   export interface UnreadCountResponse {
     count: number;
   }
  ```
2. Создать `src/entities/notification/api/notification-api.ts`:
  ```typescript
   import { http } from '@/shared/api';
   import type { Notification, UnreadCountResponse } from '../model/types';

   export const notificationApi = {
     getList: (limit = 20) =>
       http.get<Notification[]>('/notifications', { params: { limit } }).then(r => r.data),
     getUnreadCount: () =>
       http.get<UnreadCountResponse>('/notifications/unread-count').then(r => r.data),
     markRead: (id: string) =>
       http.patch(`/notifications/${id}/read`).then(r => r.data),
     markAllRead: () =>
       http.patch('/notifications/read-all').then(r => r.data),
   };
  ```
3. Создать `src/entities/notification/api/notification-keys.ts`:
  ```typescript
   export const notificationKeys = {
     all: ['entities', 'notification'] as const,
     list: () => [...notificationKeys.all, 'list'] as const,
     unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
   };
  ```
4. Создать `src/entities/notification/model/queries.ts`:
  ```typescript
   import { queryOptions } from '@tanstack/react-query';
   import { notificationApi } from '../api/notification-api';
   import { notificationKeys } from '../api/notification-keys';

   export const notificationListQueryOptions = (limit = 20) =>
     queryOptions({
       queryKey: notificationKeys.list(),
       queryFn: () => notificationApi.getList(limit),
       staleTime: 1000 * 30, // 30 секунд — уведомления обновляются через WS
     });

   export const notificationUnreadCountQueryOptions = () =>
     queryOptions({
       queryKey: notificationKeys.unreadCount(),
       queryFn: () => notificationApi.getUnreadCount(),
       staleTime: 1000 * 30,
     });
  ```
5. Создать `src/entities/notification/api/index.ts` и `src/entities/notification/model/index.ts` — barrel exports.
6. Создать `src/entities/notification/index.ts` — публичный barrel:
  ```typescript
   export { notificationApi } from './api';
   export { notificationKeys } from './api';
   export { notificationListQueryOptions, notificationUnreadCountQueryOptions } from './model';
   export type { Notification, NotificationType, UnreadCountResponse } from './model/types';
  ```

### Verification

```bash
pnpm build
pnpm tsc --noEmit
```

### Exit criteria

- `src/entities/notification/` создана с правильной FSD структурой
- Все типы без `any`
- `queryOptions` с явным `staleTime`
- Barrel экспорты работают

---

## Step 6 — Frontend: features mark-notification-read и mark-all-notifications-read

**Branch:** `feat/notifications-frontend-features`
**Skills:** `react19`, `coding-standards`
**Model tier:** default
**Depends on:** Step 5
**Blocks:** Step 7

### Context brief

Frontend FSD. Пример существующей feature: `src/features/bookmark-text/` — `model/use-*.ts` + `index.ts`. TanStack Query v5 `useMutation`. Cache invalidation через `queryClient.invalidateQueries` и `queryClient.setQueryData`. `notificationKeys` из `@/entities/notification`.

**Правила CLAUDE.md:**

- Логика в хуках (`model/`), никакого JSX в features без ui/
- Arrow functions
- Нет `useCallback` (React Compiler)

### Tasks

### ⚠️ Критические детали реализации (из adversarial review)

Три writer'а конкурируют за один кэш: мутации (Step 6), WebSocket onmessage (Step 7), 30s refetch (Step 5). Без `cancelQueries` + rollback оптимистичные обновления конфликтуют и счётчик может десинхронизироваться.

**Обязательный TanStack v5 optimistic pattern** для каждой мутации:

1. Создать `src/features/mark-notification-read/model/use-mark-notification-read.ts`:
  ```typescript
   import { useMutation, useQueryClient } from '@tanstack/react-query';
   import { notificationApi, notificationKeys } from '@/entities/notification';
   import type { Notification } from '@/entities/notification';

   export const useMarkNotificationRead = () => {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: (id: string) => notificationApi.markRead(id),
       onMutate: async (id) => {
         // Отменить in-flight запросы чтобы не перезатереть оптимистичное обновление
         await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
         // Снапшот для rollback
         const previousList = queryClient.getQueryData<Notification[]>(notificationKeys.list());
         // Оптимистичное обновление
         queryClient.setQueryData<Notification[]>(
           notificationKeys.list(),
           old => old?.map(n => n.id === id ? { ...n, isRead: true } : n),
         );
         return { previousList };
       },
       onError: (_err, _id, context) => {
         // Rollback при ошибке
         if (context?.previousList) {
           queryClient.setQueryData(notificationKeys.list(), context.previousList);
         }
       },
       onSettled: () => {
         // Сервер — источник истины
         void queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
         void queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
       },
     });
   };
  ```
2. Создать `src/features/mark-notification-read/index.ts` — barrel export.
3. Создать `src/features/mark-all-notifications-read/model/use-mark-all-notifications-read.ts`:
  ```typescript
   export const useMarkAllNotificationsRead = () => {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: () => notificationApi.markAllRead(),
       onMutate: async () => {
         await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
         await queryClient.cancelQueries({ queryKey: notificationKeys.unreadCount() });
         const previousList = queryClient.getQueryData<Notification[]>(notificationKeys.list());
         const previousCount = queryClient.getQueryData<UnreadCountResponse>(notificationKeys.unreadCount());
         queryClient.setQueryData<Notification[]>(
           notificationKeys.list(),
           old => old?.map(n => ({ ...n, isRead: true })),
         );
         queryClient.setQueryData(notificationKeys.unreadCount(), { count: 0 });
         return { previousList, previousCount };
       },
       onError: (_err, _vars, context) => {
         if (context?.previousList) queryClient.setQueryData(notificationKeys.list(), context.previousList);
         if (context?.previousCount) queryClient.setQueryData(notificationKeys.unreadCount(), context.previousCount);
       },
       onSettled: () => {
         void queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
         void queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
       },
     });
   };
  ```
4. Создать `src/features/mark-all-notifications-read/index.ts` — barrel export.

### Verification

```bash
pnpm tsc --noEmit
```

### Exit criteria

- Две feature-директории созданы
- Мутации корректно инвалидируют и обновляют кэш
- Нет `any`, нет `useCallback`

---

## Step 7 — Frontend: widget notification-bell (колокольчик + WebSocket)

**Branch:** `feat/notifications-frontend-widget`
**Skills:** `react19`, `shadcn-claude-skill-main`, `ui-ux-pro-max`, `coding-standards`
**Model tier:** strongest
**Depends on:** Steps 4, 6
**Blocks:** —

### Context brief

Frontend FSD. Widget — составной блок. `src/shared/ui/` содержит: `badge`, `button`, `dropdown-menu`, `drawer`, `dialog`. Используй эти компоненты — не создавай новые примитивы. `app-shell` виджет находится в `src/widgets/app-shell/` — туда нужно добавить `NotificationBell`. Локаль: che/ru/en, файлы `src/locales/`. WebSocket URL: `ws://localhost:3000/ws/notifications` (из env var `NEXT_PUBLIC_WS_URL`).

**Правила CLAUDE.md:**

- Один компонент на файл
- Логика в `model/`, JSX в `ui/`
- `e.currentTarget` не `e.target`
- Named imports из react
- `asChild` вместо wrapper компонентов
- Нет inline handlers
- Mobile-first, touch targets ≥ 44px
- ARIA roles для accessibility
- Нет `useMemo`/`useCallback`

### Tasks

#### 7.0 — Создать shared/lib/media-query (prerequisite)

Создать `src/shared/lib/media-query/use-media-query.ts` (хук не существует в проекте):

```typescript
'use client';
import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false); // SSR-safe: false до hydration

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
};
```

Создать `src/shared/lib/media-query/index.ts` — barrel export.

#### 7.1 — WebSocket хук

Создать `src/widgets/notification-bell/model/use-notification-socket.ts`:

- Подключается к `NEXT_PUBLIC_WS_URL/ws/notifications` при монтировании (cookie отправляется автоматически браузером как same-origin)
- При получении сообщения — добавляет уведомление в начало списка через `queryClient.setQueryData`, инкрементирует `unreadCount`
- Автоматический реконнект при транспортных ошибках (exponential backoff: 1s, 2s, 4s, max 30s)
- **При закрытии с кодом 4001 (auth error): НЕ hot-loop** — ждать до следующего успешного REST запроса и только потом retry (max 3 auth retries)
- Cleanup при размонтировании
- Не реконнектится если `!isAuthenticated`

```typescript
// Примерная логика reconnect
const handleClose = (event: CloseEvent) => {
  if (event.code === 4001) {
    // Auth error — не hot-loop, ждать обновления cookie через REST
    authRetries.current += 1;
    if (authRetries.current > 3) return; // сдаёмся
    setTimeout(connect, 5000 * authRetries.current); // медленный backoff
  } else {
    // Transport error — exponential backoff
    const delay = Math.min(1000 * 2 ** attempt.current, 30000);
    setTimeout(connect, delay);
  }
};
```

#### 7.2 — Хук данных

Создать `src/widgets/notification-bell/model/use-notifications.ts`:

- `useQuery(notificationListQueryOptions())`
- `useQuery(notificationUnreadCountQueryOptions())`
- Возвращает `{ notifications, unreadCount, isLoading }`

#### 7.3 — Хук состояния дропдауна

Создать `src/widgets/notification-bell/model/use-notification-bell.ts`:

- Управляет `isOpen: boolean`
- `handleOpen`, `handleClose`, `handleToggle`
- При открытии — триггерит `markAllRead` после 2 секунд (debounce)

#### 7.4 — Компонент: notification-item.tsx

Создать `src/widgets/notification-bell/ui/notification-item.tsx`:

- Props: `notification: Notification`, `onRead: (id: string) => void`
- Клик → `onRead(notification.id)` + навигация через `router.push(getNotificationHref(notification))`
- Визуально: непрочитанные имеют dot-индикатор
- Touch target: min-h-[44px]
- ARIA: `role="listitem"`

Создать `src/widgets/notification-bell/lib/get-notification-href.ts`:

```typescript
export const getNotificationHref = (lang: string, n: Notification): string => {
  switch (n.type) {
    case 'FEEDBACK_REPLY':            return `/${lang}/feedback/${n.entityId}`;
    case 'SUGGESTION_APPROVED':
    case 'SUGGESTION_REJECTED':       return `/${lang}/suggestions`;
    case 'TEXT_SUBMISSION_APPROVED':
    case 'TEXT_SUBMISSION_REJECTED':  return `/${lang}/my-texts`;
    case 'NEW_FEEDBACK_THREAD':       return `/${lang}/admin/feedback/${n.entityId}`;
    case 'NEW_TEXT_SUBMISSION':       return `/${lang}/admin/submissions`;
    case 'NEW_SUGGESTION':            return `/${lang}/admin/suggestions`;
  }
};
```

#### 7.5 — Компонент: notification-list.tsx

Создать `src/widgets/notification-bell/ui/notification-list.tsx`:

- Props: `notifications: Notification[]`, `onRead: (id: string) => void`, `onReadAll: () => void`
- Список с `role="list"`, кнопка "Прочитать все"
- Пустое состояние — иконка + i18n текст
- Skeleton при загрузке

#### 7.6 — Компонент: notification-dropdown.tsx (desktop)

Создать `src/widgets/notification-bell/ui/notification-dropdown.tsx`:

- Использует `DropdownMenu` из `@/shared/ui/dropdown-menu`
- Ширина: `w-80` (320px)
- Заголовок "Уведомления" + кнопка "Прочитать все"
- Список через `NotificationList`

#### 7.7 — Компонент: notification-drawer.tsx (mobile)

Создать `src/widgets/notification-bell/ui/notification-drawer.tsx`:

- Использует `Drawer` из `@/shared/ui/drawer`
- Bottom sheet на мобайле
- Тот же `NotificationList`

#### 7.8 — Компонент: notification-bell.tsx (оркестратор)

Создать `src/widgets/notification-bell/ui/notification-bell.tsx`:

- `'use client'`
- Использует `useNotifications`, `useNotificationBell`, `useNotificationSocket`
- Колокольчик: `Button` с иконкой Bell из lucide-react
- Badge: `Badge` из `@/shared/ui/badge` с числом непрочитанных
- На desktop: `NotificationDropdown`, на mobile: `NotificationDrawer`
- Детектить mobile через `useMediaQuery` из `@/shared/lib/media-query`
- ARIA: `aria-label={t('notifications.bell.label')}`, `aria-expanded`, `aria-haspopup="listbox"`

#### 7.9 — i18n ключи

Добавить в `src/locales/ru.json`, `en.json`, `che.json` секцию `notifications`:

```json
{
  "notifications": {
    "bell": { "label": "Уведомления" },
    "title": "Уведомления",
    "empty": "Нет новых уведомлений",
    "markAllRead": "Прочитать все",
    "types": {
      "FEEDBACK_REPLY": "Администратор ответил на ваш запрос",
      "SUGGESTION_APPROVED": "Ваше предложение по словарю принято",
      "SUGGESTION_REJECTED": "Ваше предложение по словарю отклонено",
      "TEXT_SUBMISSION_APPROVED": "Ваш текст опубликован в библиотеке",
      "TEXT_SUBMISSION_REJECTED": "Ваш текст не прошёл модерацию",
      "NEW_FEEDBACK_THREAD": "Новый запрос от пользователя",
      "NEW_TEXT_SUBMISSION": "Новый текст ожидает модерации",
      "NEW_SUGGESTION": "Новое предложение по словарю"
    }
  }
}
```

#### 7.10 — Интеграция в app-shell

Добавить `NotificationBell` в `src/widgets/app-shell/ui/app-shell.tsx` (или в header компонент внутри app-shell) рядом с user menu.

#### 7.11 — Barrel exports

Создать `src/widgets/notification-bell/index.ts`:

```typescript
export { NotificationBell } from './ui/notification-bell';
```

### UX/UI checklist

- Desktop: дропдаун шириной 320px, открывается вниз
- Mobile: bottom sheet (drawer) на весь экран
- Badge скрыт когда count = 0
- Badge показывает "99+" если count > 99
- Непрочитанные уведомления визуально выделены (dot или фон)
- Пустое состояние с иконкой и текстом
- Skeleton при загрузке
- Touch targets ≥ 44px
- Keyboard nav: Escape закрывает, Tab/Enter работает
- ARIA labels на колокольчике и списке

### Performance checklist

- WebSocket — одно соединение на сессию (не на компонент)
- `staleTime: 30s` — не рефетчит при каждом ре-рендере
- Нет `useMemo`/`useCallback` (React Compiler)
- Drawer/Dropdown — ленивый рендер (не рендерится пока закрыт)

### SEO checklist

- `'use client'` — не влияет на SSR страниц
- Нет metadata-breaking side effects
- Колокольчик не рендерится на сервере (только Client Component)

### Verification

```bash
pnpm build
pnpm tsc --noEmit
# Запустить dev server, проверить:
# - колокольчик отображается в хедере
# - badge появляется при непрочитанных
# - дропдаун открывается на desktop
# - drawer открывается на mobile
# - клик по уведомлению навигирует и отмечает прочитанным
# - WebSocket доставляет новые уведомления без перезагрузки
```

### Exit criteria

- Колокольчик виден в хедере для авторизованных пользователей
- Badge отображает кол-во непрочитанных
- Дропдаун (desktop) / Drawer (mobile) открывается по клику
- Клик по уведомлению → навигация + mark as read
- "Прочитать все" работает
- WebSocket обновляет badge в реальном времени
- Все строки локализованы на 3 языках
- Нет TypeScript ошибок

---

## Rollback Strategy


| Шаг       | Rollback                                                                           |
| --------- | ---------------------------------------------------------------------------------- |
| Step 1    | `pnpm prisma migrate reset` (только dev), или `DOWN` миграция                      |
| Steps 2-4 | Удалить `NotificationModule` из `app.module.ts`, удалить папку `src/notification/` |
| Steps 3   | Откатить emit-вызовы в feedback/suggestions/submissions сервисах                   |
| Steps 5-7 | Удалить директории FSD слайсов, убрать из app-shell                                |


---

## Anti-patterns (не делать)

- ❌ Не использовать `any` — только `unknown` с type guards
- ❌ Не использовать `function` declarations — только arrow functions
- ❌ Не ставить `'use client'` на layout — только на leaf-компоненты
- ❌ Не хранить JWT в localStorage — используется HttpOnly cookie (уже так настроено)
- ❌ Не делать `broadcast` WebSocket сообщений — только точечная доставка по userId
- ❌ Не инлайнить handlers в JSX — всегда именованные `handle*` функции
- ❌ Не создавать несколько компонентов в одном файле
- ❌ Не использовать `useMemo`/`useCallback`/`React.memo` (React Compiler)
- ❌ Не хардкодить строки — только i18n ключи
- ❌ Не импортировать из внутренних путей слайса — только через `index.ts` barrel
- ❌ Не добавлять `entityId` как FK в Prisma (уведомление должно пережить удаление сущности)
- ❌ Не блокировать response при notifyAdmins — fire-and-forget (`void`)

