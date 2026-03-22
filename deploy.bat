@echo off
echo --- SkillBridge Permanent GitHub Linker ---
echo.
echo 1. Initializing Git in this folder...
git init
echo.
echo 2. Linking to your repository (Skill_Bridge)...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/KrrishKamathh/Skill_Bridge.git
echo.
echo 3. Adding refined files...
git add .
echo.
echo 4. Committing updates...
git commit -m "Permanent folder link: Refined animation and UI cleanup"
echo.
echo 5. Pushing directly to GitHub (Force-Sync)...
git push -u origin main -f
echo.
echo --- SUCCESS! ---
echo.
echo Your "skillbridge" folder is now PERMANENTLY linked to GitHub.
echo You can now safely DELETE the "Skill_Bridge" copy folder.
echo From now on, just run this script to make your website live!
echo.
pause
