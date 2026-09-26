@echo off
REM Rebuilds the site and pushes it live to GitHub Pages.
REM Run this after changing anything in data\ or static\.
cd /d "%~dp0"
node build.js || exit /b 1
git add -A
git commit -m "site: update" || echo (nothing to commit)
git push
echo.
echo Pushed. GitHub Pages usually updates within a minute.
