# Онлайн-запись: Cloudflare Pages + D1

## Публичный сайт

`functions/api/bookings.ts` обслуживает `/api/bookings` в Cloudflare Pages.
Нужна D1-база с именем привязки **BOOKINGS_DB**. Пароли и API-токены не
передаются браузеру и не добавляются в Git. Публичный GET возвращает только
занятые часы, POST — только идентификатор новой записи.

Миграция: `migrations/0001_bookings.sql`. Ограничение `UNIQUE (date, time)` и
атомарный INSERT предотвращают двойную запись, включая одновременные запросы
в разных экземплярах серверной функции. Занятый слот возвращает HTTP 409.

Запись доступна на ближайшие 7 рабочих дней с завтрашнего дня по времени
Алматы, кроме воскресенья: 09:00, 10:00, 11:00, 12:00. Клиент сам отправляет
сформированное сообщение в WhatsApp. Без отправки окно остаётся занятым.

## Первое подключение

1. Войти в Cloudflare: `npx wrangler login`.
2. База `autocraft-bookings` уже создана. Её ID и привязка **BOOKINGS_DB**
   указаны в `wrangler.toml` в секции `env.production.d1_databases`.
3. Применить миграции: `npm run db:migrate:production`.
4. Развернуть обновлённый проект из GitHub: build `npm run build`, output `dist`.
   Каталог `functions` собирается Cloudflare Pages из корня репозитория.
5. Проверить `/api/bookings?date=YYYY-MM-DD` с доступной датой.

`wrangler.toml` основан на скачанной конфигурации существующего проекта
`testlanding`; добавлена только production-привязка D1. В Preview рабочая
база не подключена: API возвращает 503. При необходимости для Preview нужно
создать отдельную базу и применить к ней ту же миграцию.
`wrangler.local.jsonc` предназначен **только для локальной проверки**, его
фиктивный database_id нельзя использовать при публикации.

## Локальная проверка Cloudflare

```text
npm run build
npm run db:migrate:local
npm run dev:cloudflare
```

Эмулятор Wrangler хранит отдельную локальную D1 в `.wrangler/state`.
Он не обращается к рабочим записям и не требует входа в Cloudflare.

Обычный `npm run dev` по-прежнему использует плагин Vite и отдельный JSON
`.local-bookings/bookings.json`. Пробные записи не переносятся в D1 сами.
Файл исключён из Git и закрыт от файловой раздачи Vite.

## Проверки

`npm run test:bookings` (Node.js 24) проверяет локальный API и Cloudflare API
с настоящей SQLite и production-миграцией, включая конкурентные заявки,
неправильные даты/данные, отсутствие базы и приватность ответов.
`npm run build` проверяет TypeScript фронтенда и серверных функций.

## Просмотр и отмена

Пока записи доступны владельцу аккаунта через D1 → Console:

```sql
SELECT id, date, time, name, phone, vehicle, year, vin, description
FROM bookings ORDER BY date, time;
```

Отменить конкретную запись и освободить окно:

```sql
DELETE FROM bookings WHERE id = 'идентификатор_конкретной_записи';
```

Публичного административного API нет. Административная страница и защита от
массовых заявок (например, Cloudflare Turnstile) могут быть добавлены отдельно.
