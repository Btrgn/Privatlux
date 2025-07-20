@echo off
echo 🚀 PrivatLux Deployment Script
echo ==============================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all

REM Build frontend
echo 🔨 Building frontend...
cd frontend
call npm run build
cd ..

echo ✅ Build completed successfully!
echo.
echo 🌐 Deployment Options:
echo 1. Vercel (Frontend) + Railway (Backend) - Recommended
echo 2. Vercel (Frontend) + Render (Backend)
echo 3. Netlify (Frontend) + Heroku (Backend)
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions
echo.
echo 🔧 Next steps:
echo 1. Push your code to GitHub
echo 2. Choose a deployment platform
echo 3. Set up environment variables
echo 4. Deploy!
pause 