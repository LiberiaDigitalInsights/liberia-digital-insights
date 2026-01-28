#!/usr/bin/env node

// Liberia Digital Insights - Cross-Platform Development Startup Script
// Runs both frontend and backend servers simultaneously

import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorLog(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Function to check if port is in use
function checkPort(port) {
    return new Promise((resolve) => {
        if (process.platform === 'win32') {
            exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                resolve(stdout.includes(`:${port}`));
            });
        } else {
            exec(`lsof -i :${port}`, (error, stdout) => {
                resolve(!error && stdout.length > 0);
            });
        }
    });
}

// Function to kill process on port
async function killPort(port) {
    const inUse = await checkPort(port);
    if (inUse) {
        colorLog('yellow', `⚠️  Port ${port} is in use. Killing existing process...`);
        
        if (process.platform === 'win32') {
            exec(`for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /F /PID %a`, (error) => {
                if (!error) colorLog('green', `✅ Process on port ${port} killed`);
            });
        } else {
            exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null`, (error) => {
                if (!error) colorLog('green', `✅ Process on port ${port} killed`);
            });
        }
        
        // Wait for process to be killed
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Function to check if file exists
function fileExists(path) {
    return fs.existsSync(path);
}

// Function to check if directory exists
function dirExists(path) {
    return fs.existsSync(path) && fs.statSync(path).isDirectory();
}

// Function to install dependencies
async function installDependencies(folder) {
    return new Promise((resolve, reject) => {
        colorLog('yellow', `📥 Installing ${folder} dependencies...`);
        
        const npm = spawn('npm', ['install'], {
            cwd: join(__dirname, folder),
            stdio: 'pipe'
        });
        
        npm.on('close', (code) => {
            if (code === 0) {
                colorLog('green', `✅ ${folder} dependencies installed`);
                resolve();
            } else {
                colorLog('red', `❌ Failed to install ${folder} dependencies`);
                reject(new Error(`npm install failed with code ${code}`));
            }
        });
        
        npm.on('error', (error) => {
            colorLog('red', `❌ npm install error: ${error.message}`);
            reject(error);
        });
    });
}

// Main startup function
async function startDev() {
    colorLog('cyan', '🚀 Starting Liberia Digital Insights Development Servers...');
    colorLog('cyan', '==================================================');

    try {
        // Check and kill existing processes
        colorLog('blue', '🔍 Checking for existing processes...');
        await killPort(5173); // Frontend
        await killPort(5000); // Backend
        await killPort(4000); // Backend alternative
        await killPort(5174); // Docs

        // Check environment files
        colorLog('blue', '📋 Checking environment files...');
        
        if (!fileExists(join(__dirname, 'backend', '.env'))) {
            colorLog('red', '❌ backend/.env file not found!');
            colorLog('yellow', 'Please copy backend/.env.example to backend/.env and configure your Supabase credentials.');
            process.exit(1);
        }

        if (!fileExists(join(__dirname, 'frontend', '.env'))) {
            colorLog('red', '❌ frontend/.env file not found!');
            colorLog('yellow', 'Please copy frontend/.env.example to frontend/.env and configure your environment variables.');
            process.exit(1);
        }

        colorLog('green', '✅ Environment files found!');

        // Check dependencies
        colorLog('blue', '📦 Checking dependencies...');
        
        if (!dirExists(join(__dirname, 'backend', 'node_modules'))) {
            await installDependencies('backend');
        }

        if (!dirExists(join(__dirname, 'frontend', 'node_modules'))) {
            await installDependencies('frontend');
        }

        colorLog('green', '✅ Dependencies ready!');

        // Start backend server
        colorLog('blue', '🔧 Starting backend server...');
        const backendProcess = spawn('npm', ['run', 'dev'], {
            cwd: join(__dirname, 'backend'),
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // Redirect backend output to log file
        const backendLog = fs.createWriteStream(join(__dirname, 'backend.log'));
        backendProcess.stdout.pipe(backendLog);
        backendProcess.stderr.pipe(backendLog);

        // Wait for backend to start
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if backend started
        if (backendProcess.pid) {
            colorLog('green', `✅ Backend server started (PID: ${backendProcess.pid})`);
            colorLog('green', '📍 Backend: http://localhost:5000');
            colorLog('green', '📊 Health Check: http://localhost:5000/health');
        } else {
            colorLog('red', '❌ Backend server failed to start!');
            colorLog('yellow', 'Check backend.log for error details.');
            process.exit(1);
        }

        // Start frontend server
        colorLog('blue', '🎨 Starting frontend server...');
        const frontendProcess = spawn('npm', ['run', 'dev'], {
            cwd: join(__dirname, 'frontend'),
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // Redirect frontend output to log file
        const frontendLog = fs.createWriteStream(join(__dirname, 'frontend.log'));
        frontendProcess.stdout.pipe(frontendLog);
        frontendProcess.stderr.pipe(frontendLog);

        // Wait for frontend to start
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if frontend started
        if (frontendProcess.pid) {
            colorLog('green', `✅ Frontend server started (PID: ${frontendProcess.pid})`);
            colorLog('green', '🌐 Frontend: http://localhost:5173');
        } else {
            colorLog('red', '❌ Frontend server failed to start!');
            colorLog('yellow', 'Check frontend.log for error details.');
            process.exit(1);
        }

        // Start docs server
        colorLog('blue', '📚 Starting docs server...');
        const docsProcess = spawn('npm', ['run', 'docs:dev'], {
            cwd: join(__dirname, 'frontend'),
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // Redirect docs output to log file
        const docsLog = fs.createWriteStream(join(__dirname, 'docs.log'));
        docsProcess.stdout.pipe(docsLog);
        docsProcess.stderr.pipe(docsLog);

        // Wait for docs to start
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if docs started
        if (docsProcess.pid) {
            colorLog('green', `✅ Docs server started (PID: ${docsProcess.pid})`);
            colorLog('green', '📚 Docs: http://localhost:5174');
        } else {
            colorLog('red', '❌ Docs server failed to start!');
            colorLog('yellow', 'Check docs.log for error details.');
            process.exit(1);
        }

        // Display success message
        console.log('');
        colorLog('cyan', '==================================================');
        colorLog('green', '🎉 All servers are running!');
        colorLog('cyan', '==================================================');
        colorLog('blue', '📱 Frontend:  http://localhost:5173');
        colorLog('blue', '🔧 Backend:   http://localhost:5000');
        colorLog('blue', '📚 Docs:      http://localhost:5174');
        colorLog('blue', '📊 API Health: http://localhost:5000/health');
        colorLog('blue', '📚 API Docs:  See backend/README.md');
        console.log('');
        colorLog('yellow', '📝 Logs:');
        colorLog('yellow', '   Backend:  backend.log');
        colorLog('yellow', '   Frontend: frontend.log');
        colorLog('yellow', '   Docs:     docs.log');
        console.log('');
        colorLog('yellow', '🛑 Press Ctrl+C to stop all servers');
        colorLog('cyan', '==================================================');

        // Handle cleanup on exit
        const cleanup = () => {
            colorLog('yellow', '\n🛑 Shutting down servers...');
            
            if (backendProcess.pid) {
                backendProcess.kill('SIGTERM');
            }
            
            if (frontendProcess.pid) {
                frontendProcess.kill('SIGTERM');
            }
            
            if (docsProcess.pid) {
                docsProcess.kill('SIGTERM');
            }
            
            colorLog('green', '✅ All servers stopped.');
            process.exit(0);
        };

        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);

        // Monitor processes
        const monitorInterval = setInterval(() => {
            if (!backendProcess.pid || backendProcess.killed) {
                colorLog('red', '❌ Backend server stopped unexpectedly!');
                cleanup();
            }
            
            if (!frontendProcess.pid || frontendProcess.killed) {
                colorLog('red', '❌ Frontend server stopped unexpectedly!');
                cleanup();
            }
            
            if (!docsProcess.pid || docsProcess.killed) {
                colorLog('red', '❌ Docs server stopped unexpectedly!');
                cleanup();
            }
        }, 1000);

        // Keep script running
        process.stdin.resume();

    } catch (error) {
        colorLog('red', `❌ Startup failed: ${error.message}`);
        process.exit(1);
    }
}

// Start the development servers
startDev().catch(error => {
    colorLog('red', `❌ Fatal error: ${error.message}`);
    process.exit(1);
});
