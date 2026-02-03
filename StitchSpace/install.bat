@echo off
REM StitchSpace Installation Script for Windows
echo.
echo ============================================
echo 🧵 Welcome to StitchSpace Installation!
echo ============================================
echo.

REM Check Node.js installation
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please download from: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js installed
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    Version: %NODE_VERSION%
echo.

REM Check npm installation
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)

echo ✅ npm installed
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo    Version: %NPM_VERSION%
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..
echo.

REM Create .env file
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Please edit .env with your configuration:
    echo    - MONGO_URI: Your MongoDB connection string
    echo    - JWT_SECRET: Your JWT secret key
    echo    - STRIPE_SECRET_KEY: Your Stripe API key (optional)
    echo.
) else (
    echo ✅ .env file already exists
    echo.
)

REM Display final message
echo ============================================
echo 🎉 Installation Complete!
echo ============================================
echo.
echo Next Steps:
echo 1. Edit .env file with your configuration
echo 2. Run: npm run dev
echo.
echo ✨ Frontend: http://localhost:3000
echo ✨ Backend: http://localhost:5000
echo.
echo ============================================
pause
