@echo off
title TOTOSHA Production

echo.
echo ============================================
echo   TOTOSHA Production - website launcher
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed.
  echo Install Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm was not found.
  pause
  exit /b 1
)

echo Setting npm registry...
call npm config set registry https://registry.npmjs.org/

if not exist "node_modules\next" (
  echo.
  echo Dependencies not found. Running npm install...
  echo This is needed only once.
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo ERROR: npm install failed.
    echo Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo.
echo Starting TOTOSHA website...
echo Open this address in browser:
echo http://localhost:3000
echo.
echo To stop server press Ctrl + C
echo.

call npm run dev
pause
