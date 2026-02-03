@echo off
REM StitchSpace Vercel Deployment Script
REM This script helps convert localhost links to Vercel URLs

echo.
echo ============================================
echo   StitchSpace Vercel Deployment Script
echo ============================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo.
echo Step 1: Authenticate with Vercel
echo Before proceeding, you need to:
echo 1. Go to https://vercel.com and create an account
echo 2. Create a new project in your Vercel dashboard
echo 3. Get your Vercel tokens ready
echo.
pause

echo.
echo Step 2: Deploy Backend to Vercel
echo.
cd "%~dp0"
vercel --env-file .env

echo.
echo Step 3: Enter your Vercel Backend URL
set /p BACKEND_URL="Enter your Vercel Backend URL (e.g., https://stitchspace-api.vercel.app): "

REM Update client environment
echo REACT_APP_API_URL=%BACKEND_URL% > client\.env.production

echo.
echo Step 4: Deploy Frontend to Vercel
cd "%~dp0\client"
vercel

echo.
echo ============================================
echo   Deployment Complete!
echo ============================================
echo.
echo Your application is now on Vercel:
echo - Backend API: %BACKEND_URL%
echo - Check your Vercel dashboard for Frontend URL
echo.
pause
