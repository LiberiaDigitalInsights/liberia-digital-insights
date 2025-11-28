@echo off
REM Liberia Digital Insights - Development Startup Script (Windows)
REM Runs both frontend and backend servers simultaneously

echo 🚀 Starting Liberia Digital Insights Development Servers...
echo ==================================================

REM Enable delayed expansion
setlocal enabledelayedexpansion

REM Function to check if a port is in use
:check_port
netstat -ano | findstr ":%1" >nul
goto :eof

REM Function to kill process on port
:kill_port
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%1"') do (
    echo ⚠️  Port %1 is in use. Killing existing process...
    taskkill /F /PID %%a >nul 2>&1
)
goto :eof

REM Check and kill existing processes
echo 🔍 Checking for existing processes...
call :kill_port 5173
call :kill_port 5000
call :kill_port 4000
timeout /t 2 /nobreak >nul

REM Check if .env files exist
echo 📋 Checking environment files...

if not exist "backend\.env" (
    echo ❌ backend\.env file not found!
    echo Please copy backend\.env.example to backend\.env and configure your Supabase credentials.
    pause
    exit /b 1
)

if not exist "frontend\.env" (
    echo ❌ frontend\.env file not found!
    echo Please copy frontend\.env.example to frontend\.env and configure your environment variables.
    pause
    exit /b 1
)

echo ✅ Environment files found!

REM Check if node_modules exist
echo 📦 Checking dependencies...

if not exist "backend\node_modules" (
    echo 📥 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 📥 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

echo ✅ Dependencies ready!

REM Start backend server
echo 🔧 Starting backend server...
cd backend
start "Backend Server" cmd /c "npm run dev > ../backend.log 2>&1"
cd ..

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🎨 Starting frontend server...
cd frontend
start "Frontend Server" cmd /c "npm run dev > ../frontend.log 2>&1"
cd ..

REM Wait for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo ==================================================
echo 🎉 Both servers are running!
echo ==================================================
echo 📱 Frontend:  http://localhost:5173
echo 🔧 Backend:   http://localhost:5000
echo 📊 API Health: http://localhost:5000/health
echo 📚 API Docs:  See backend\README.md
echo.
echo 📝 Logs:
echo    Backend:  backend.log
echo    Frontend: frontend.log
echo.
echo 🛑 Close these windows to stop both servers
echo ==================================================
echo.
echo 💡 Tips:
echo    - Backend will start on port 5000 (or 4000 if 5000 is busy)
echo    - Frontend will start on port 5173 (or next available port)
echo    - Check the log files if you encounter any issues
echo.

REM Keep the script running
pause
