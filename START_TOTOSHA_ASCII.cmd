@echo off
title TOTOSHA Production
echo.
echo TOTOSHA Production launcher
echo.
call npm config set registry https://registry.npmjs.org/
if not exist "node_modules\next" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)
echo Starting website...
echo Open http://localhost:3000
call npm run dev
pause
