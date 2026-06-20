# TOTOSHA Verification Template

Этот файл фиксирует, какие данные нужно получить от владельца сайта для подключения Google Search Console и Яндекс Вебмастер.

## Google Search Console

Ожидаем один из вариантов:

### Вариант A — HTML-файл

Владелец присылает имя файла и содержимое, например:

```text
googleXXXXXXXXXXXX.html
```

```text
google-site-verification: googleXXXXXXXXXXXX.html
```

Файл будет размещён в `public/`, чтобы он открывался по адресу:

```text
https://www.totoshakids.kz/googleXXXXXXXXXXXX.html
```

### Вариант B — meta-tag

Владелец присылает тег вида:

```html
<meta name="google-site-verification" content="XXXXXXXXXXXX" />
```

Тег будет добавлен в `app/layout.tsx` metadata/viewport head-зону.

## Яндекс Вебмастер

Ожидаем один из вариантов:

### Вариант A — HTML-файл

```text
yandex_XXXXXXXXXXXX.html
```

Файл будет размещён в `public/`, чтобы он открывался по адресу:

```text
https://www.totoshakids.kz/yandex_XXXXXXXXXXXX.html
```

### Вариант B — meta-tag

```html
<meta name="yandex-verification" content="XXXXXXXXXXXX" />
```

Тег будет добавлен в head сайта.

## После внедрения

1. Сделать commit.
2. Дождаться Vercel success.
3. Проверить URL verification-файла или наличие meta-tag.
4. Запустить Release Gate.
5. В Google/Yandex нажать Verify/Проверить.
6. Отправить sitemap.xml.
