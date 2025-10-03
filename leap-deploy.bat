@echo off
REM Leap Cell deployment script for WebSight Pro (Windows)

echo 🚀 Starting Leap Cell deployment for WebSight Pro...

REM Check if Leap CLI is installed
leap --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Leap CLI not found. Please install it first:
    echo    npm install -g @leap/cli
    exit /b 1
)

REM Check for required environment variables
if "%GROQ_API_KEY%"=="" (
    echo ❌ GROQ_API_KEY environment variable is required
    echo    Please set it before deployment:
    echo    set GROQ_API_KEY=your-api-key-here
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building project...
npm run build

REM Set environment variables for Leap Cell
echo 🔧 Setting environment variables...
leap env set GROQ_API_KEY="%GROQ_API_KEY%"
leap env set NODE_ENV="production"

REM Deploy to Leap Cell
echo 🚀 Deploying to Leap Cell...
leap deploy

echo ✅ Deployment completed!
echo 🌐 Your WebSight Pro analyzer is now live on Leap Cell!

REM Show deployment info
leap info