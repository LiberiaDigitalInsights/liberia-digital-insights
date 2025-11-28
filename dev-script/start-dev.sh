#!/bin/bash

# Liberia Digital Insights - Development Startup Script
# Runs both frontend and backend servers simultaneously

echo "🚀 Starting Liberia Digital Insights Development Servers..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0 # Port is in use
    else
        return 1 # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}⚠️  Port $1 is in use. Killing existing process...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

# Check and kill existing processes
echo -e "${BLUE}🔍 Checking for existing processes...${NC}"
kill_port 5173  # Frontend default port
kill_port 5000  # Backend default port
kill_port 4000  # Backend alternative port

# Check if .env files exist
echo -e "${BLUE}📋 Checking environment files...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env file not found!${NC}"
    echo -e "${YELLOW}Please copy backend/.env.example to backend/.env and configure your Supabase credentials.${NC}"
    exit 1
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${RED}❌ frontend/.env file not found!${NC}"
    echo -e "${YELLOW}Please copy frontend/.env.example to frontend/.env and configure your environment variables.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment files found!${NC}"

# Check if node_modules exist
echo -e "${BLUE}📦 Checking dependencies...${NC}"

if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📥 Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📥 Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

echo -e "${GREEN}✅ Dependencies ready!${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    
    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    echo -e "${GREEN}✅ All servers stopped.${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
echo -e "${BLUE}🔧 Starting backend server...${NC}"
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
    echo -e "${GREEN}📍 Backend: http://localhost:5000${NC}"
    echo -e "${GREEN}📊 Health Check: http://localhost:5000/health${NC}"
else
    echo -e "${RED}❌ Backend server failed to start!${NC}"
    echo -e "${YELLOW}Check backend.log for error details.${NC}"
    cleanup
fi

# Start frontend server
echo -e "${BLUE}🎨 Starting frontend server...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
    echo -e "${GREEN}🌐 Frontend: http://localhost:5173${NC}"
else
    echo -e "${RED}❌ Frontend server failed to start!${NC}"
    echo -e "${YELLOW}Check frontend.log for error details.${NC}"
    cleanup
fi

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 Both servers are running!${NC}"
echo "=================================================="
echo -e "${BLUE}📱 Frontend:${NC}  http://localhost:5173"
echo -e "${BLUE}🔧 Backend:${NC}   http://localhost:5000"
echo -e "${BLUE}📊 API Health:${NC} http://localhost:5000/health"
echo -e "${BLUE}📚 API Docs:${NC}  See backend/README.md"
echo ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo -e "   Backend:  backend.log"
echo -e "   Frontend: frontend.log"
echo ""
echo -e "${YELLOW}🛑 Press Ctrl+C to stop both servers${NC}"
echo "=================================================="

# Wait for user interrupt
while true; do
    # Check if servers are still running
    if ! ps -p $BACKEND_PID > /dev/null; then
        echo -e "${RED}❌ Backend server stopped unexpectedly!${NC}"
        break
    fi
    
    if ! ps -p $FRONTEND_PID > /dev/null; then
        echo -e "${RED}❌ Frontend server stopped unexpectedly!${NC}"
        break
    fi
    
    sleep 1
done

cleanup
