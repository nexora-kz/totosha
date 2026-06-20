TOTOSHA Production v20 AutoStart

Запуск:
1) Распакуйте архив.
2) Дважды нажмите START_TOTOSHA.bat

Скрипт сам:
- включит UTF-8 в окне CMD
- настроит registry npm
- проверит node_modules
- при первом запуске выполнит npm install
- запустит сайт

Открыть:
http://localhost:3000

Если запускаете вручную:
npm config set registry https://registry.npmjs.org/
npm install
npm run dev