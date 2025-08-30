@echo off
REM SkillUp Frontend Deployment Script for Vercel (Windows)

echo 🚀 Starting SkillUp Frontend Deployment to Vercel

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Installing...
    npm install -g vercel
)

REM Function to deploy website
:deploy_website
echo 📱 Deploying SkillUp Website...
cd skillup-website

REM Install dependencies
echo 📦 Installing website dependencies...
npm install

REM Test build locally
echo 🔨 Testing website build...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Website build successful
    cd ..
    
    REM Deploy to Vercel
    echo 🌐 Deploying to Vercel...
    vercel --prod
    
    echo ✅ Website deployment completed!
) else (
    echo ❌ Website build failed. Please fix the errors before deploying.
    exit /b 1
)
goto :eof

REM Function to deploy admin dashboard
:deploy_admin
echo 👑 Deploying Admin Dashboard...
cd admin-dashboard

REM Install dependencies
echo 📦 Installing admin dashboard dependencies...
npm install

REM Test build locally
echo 🔨 Testing admin dashboard build...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Admin dashboard build successful
    cd ..
    
    REM Deploy to Vercel using admin config
    echo 🌐 Deploying admin dashboard to Vercel...
    vercel --prod --local-config vercel-admin.json
    
    echo ✅ Admin dashboard deployment completed!
) else (
    echo ❌ Admin dashboard build failed. Please fix the errors before deploying.
    exit /b 1
)
goto :eof

REM Main deployment logic
if "%1"=="website" goto deploy_website
if "%1"=="admin" goto deploy_admin
if "%1"=="both" goto deploy_both
if "%1"=="" goto deploy_both

echo Usage: %0 [website^|admin^|both]
echo   website - Deploy only the SkillUp website
echo   admin   - Deploy only the admin dashboard
echo   both    - Deploy both applications (default)
exit /b 1

:deploy_both
call :deploy_website
call :deploy_admin

echo 🎉 Deployment process completed!
echo.
echo 📝 Next steps:
echo 1. Set up environment variables in Vercel dashboard
echo 2. Configure custom domains if needed
echo 3. Check the deployment URLs in your Vercel dashboard
