@echo off
cd /d "%~dp0"
echo Starting DnD App...
echo.
echo Please wait, this may take a few seconds...
echo.
npm run dev
echo.
echo The app has stopped. You can close this window.
pause