@echo off
set GIT_PATH="C:\Program Files\Git\cmd\git.exe"
:: Clear problematic variables that trigger recursion checks
set TERM=
set PAGER=cat
set GIT_PAGER=cat
set GIT_FOR_WINDOWS_FORK_BOMB_CHECK=0

echo --- SkillBridge Ultra-Sync (Stability Mode) 🚀 ---
echo.
echo 1. Force-adding components...
%GIT_PATH% add src/app/components/*
%GIT_PATH% add .
echo.
echo 2. Committing refinements...
%GIT_PATH% commit -m "Abyssal Sync: Meteor and Build Fixes"
echo.
echo 3. Pushing to GitHub...
%GIT_PATH% push origin main -f
echo.
echo --- SYNC COMPLETE ---
echo Your friend can view the progress at: https://skill-bridge-khaki-gamma.vercel.app
echo.
pause
