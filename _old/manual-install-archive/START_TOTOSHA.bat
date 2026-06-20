@echo off
chcp 65001 >nul
title TOTOSHA Production

echo.
echo ============================================
echo   TOTOSHA Production — запуск сайта
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ОШИБКА: Node.js не установлен.
  echo Установите Node.js LTS с сайта https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ОШИБКА: npm не найден.
  pause
  exit /b 1
)

echo Настраиваю официальный npm registry...
call npm config set registry https://registry.npmjs.org/

if not exist "node_modules\next" (
  echo.
  echo Зависимости не найдены. Выполняю первичную установку...
  echo Это нужно сделать только один раз.
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo ОШИБКА: npm install не завершился.
    echo Проверьте интернет и повторите запуск.
    pause
    exit /b 1
  )
)

echo.
echo Запускаю сайт...
echo После запуска откройте: http://localhost:3000
echo Для остановки нажмите Ctrl + C
echo.

call npm run dev
pause