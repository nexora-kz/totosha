# TOTOSHA SEO Indexing Plan

Дата: 2026-06-21
Статус сайта: Stable Web v037
Домен: https://www.totoshakids.kz
Sitemap: https://www.totoshakids.kz/sitemap.xml
Robots: https://www.totoshakids.kz/robots.txt

## Цель

Подключить сайт детского сада Тотоша к Google Search Console и Яндекс Вебмастер, подтвердить права владения, отправить sitemap и начать контроль индексации.

## Обязательные URL для индексации

- https://www.totoshakids.kz/
- https://www.totoshakids.kz/about
- https://www.totoshakids.kz/programs
- https://www.totoshakids.kz/parents
- https://www.totoshakids.kz/cabinet
- https://www.totoshakids.kz/franchise
- https://www.totoshakids.kz/contacts
- https://www.totoshakids.kz/life

## Что уже готово технически

- Реальные SEO-страницы созданы.
- Верхнее меню открывает реальные URL.
- Sitemap подключён.
- Robots подключён.
- JSON-LD Preschool schema добавлен.
- OpenGraph metadata добавлены.
- Release Gate проверяет обязательные страницы.
- Дизайн сайта зафиксирован как Stable Web v037.

## Что должен сделать владелец

### Google Search Console

1. Открыть Google Search Console.
2. Добавить ресурс сайта.
3. Рекомендуемый вариант: URL-prefix property `https://www.totoshakids.kz/`.
4. Выбрать подтверждение через HTML-файл или meta-tag.
5. Передать код подтверждения в чат.
6. После внедрения кода нажать Verify.
7. Отправить sitemap: `https://www.totoshakids.kz/sitemap.xml`.

### Яндекс Вебмастер

1. Открыть Яндекс Вебмастер.
2. Добавить сайт `https://www.totoshakids.kz/`.
3. Выбрать подтверждение через meta-tag или HTML-файл.
4. Передать код подтверждения в чат.
5. После внедрения кода нажать Проверить.
6. Отправить sitemap: `https://www.totoshakids.kz/sitemap.xml`.

## Что делает NEXORA/ChatGPT

- Добавляет meta-tag или verification-файл в репозиторий.
- Проверяет Vercel deploy status.
- Проверяет Release Gate.
- Проверяет доступность verification на живом домене.
- Контролирует sitemap/robots/основные страницы.
- Не меняет визуальный дизайн сайта ради SEO.

## Правила безопасности SEO-работ

- Не добавлять видимые технические блоки на страницы.
- Не ломать премиальный дизайн сайта.
- Не использовать глобальные грубые JS-костыли без проверки.
- Не считать релиз готовым без Release Gate PASS.
- Не закрывать `/_next/` в robots, чтобы поисковики могли видеть CSS/JS сайта.
- Фотоархив `/totosha-media/` закрыт от прямой индексации/скачивания.

## Финальный критерий готовности индексации

- Google Search Console: сайт подтверждён.
- Google Search Console: sitemap отправлен.
- Яндекс Вебмастер: сайт подтверждён.
- Яндекс Вебмастер: sitemap отправлен.
- Release Gate: PASS.
- Основные страницы доступны по реальным URL.
