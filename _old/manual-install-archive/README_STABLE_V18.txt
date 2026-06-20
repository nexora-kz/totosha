TOTOSHA Production Server v18 Stable

Это откат на стабильную базу v9.
Версия v17 отменена.

Запуск:
1) Распакуйте архив.
2) Откройте PowerShell в папке проекта.
3) Выполните:

npm config set registry https://registry.npmjs.org/
npm install
npm run dev

Открыть:
http://localhost:3000

Можно также после установки зависимостей запускать двойным кликом:
START_TOTOSHA_STABLE.bat

Важно:
- Дизайн восстановлен на стабильной v9.
- Telegram-фото не внедрены в главный экран, чтобы не ломать структуру.