@echo off
set GIT_PATH="C:\Program Files\Git\cmd\git.exe"
echo --- SkillBridge Sync to GitHub ---
echo.
echo 1. Adding files...
%GIT_PATH% add .
echo.
echo 2. Committing progress...
%GIT_PATH% commit -m "Continuous Sync: %date% %time%"
echo.
echo 3. Pushing to GitHub...
%GIT_PATH% push origin main
echo.
echo --- SYNC COMPLETE ---
echo You can now see your changes at: https://github.com/KrrishKamathh/Skill_Bridge
echo.
pause
