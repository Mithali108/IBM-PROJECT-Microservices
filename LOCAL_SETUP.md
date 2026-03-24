# Local Development Setup (Without Docker)

## Quick Start

### Windows
```powershell
.\local-start.bat start
```

### macOS/Linux
```bash
bash local-start.sh start
```

## What Gets Started

The script will automatically:
1. ✅ Install dependencies for all services
2. ✅ Start 6 services in separate windows/terminals:
   - API Gateway (Port 5000)
   - Backend (Port 5000 internally, main server)
   - Book Service (Port 5002)
   - Order Service (Port 5003)
   - User Service (Port 5004)
   - Notification Service (Port 5005)

## Service URLs

Once running, access services at:

| Service | URL |
|---------|-----|
| API Gateway | http://localhost:5000 |
| Book Service | http://localhost:5002 |
| Order Service | http://localhost:5003 |
| User Service | http://localhost:5004 |
| Notification | http://localhost:5005 |
| Frontend | Open `Frontend/pages/client/index.html` in browser |

## Manual Setup (If Script Doesn't Work)

### 1. Install Dependencies
```powershell
npm install
cd api-gateway && npm install && cd ..
cd Backend && npm install && cd ..
cd book-service && npm install && cd ..
cd order-service && npm install && cd ..
cd user-service && npm install && cd ..
cd notification-service && npm install && cd ..
```

### 2. Start Each Service in Separate Terminal

**Terminal 1: API Gateway**
```powershell
cd api-gateway
npm start
# Runs on port 5000
```

**Terminal 2: Backend**
```powershell
cd Backend
npm start
# Runs on port 5000
```

**Terminal 3: Book Service**
```powershell
cd book-service
npm start
# Runs on port 5002
```

**Terminal 4: Order Service**
```powershell
cd order-service
npm start
# Runs on port 5003
```

**Terminal 5: User Service**
```powershell
cd user-service
npm start
# Runs on port 5004
```

**Terminal 6: Notification Service**
```powershell
cd notification-service
npm start
# Runs on port 5005
```

**Terminal 7: Frontend (Optional - Static Files)**
Open in browser:
```
Frontend/pages/client/index.html
```

## Prerequisites

- ✅ **Node.js 18+** - Download from https://nodejs.org/
- ✅ **npm** - Comes with Node.js
- ✅ **Text Editor/IDE** - VS Code recommended

Verify installation:
```powershell
node --version
npm --version
```

## Stopping Services

- **Windows**: Close each command window or press `Ctrl+C` in the terminal
- **macOS/Linux**: Press `Ctrl+C` in the main terminal

## Troubleshooting

### Ports Already in Use

**Windows:**
```powershell
# Find what's using a port
netstat -ano | findstr :5000

# Kill the process (if needed)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find what's using a port
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Dependencies Installation Fails

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Service Won't Start

Check the port isn't in use:
```powershell
netstat -ano | findstr :5000
```

Or check for errors in the service:
```powershell
cd book-service
npm start
# Look for error messages in the console
```

## Development Tips

1. **Check service logs** - Each service prints to its own window
2. **Use Postman or Curl** to test API endpoints
3. **Browser DevTools** (F12) to check frontend issues
4. **Hot Reload** - Some services support automatic restart on file changes (nodemon)
5. **Database** - Services currently use in-memory storage

## Comparison: Docker vs Local

| Aspect | Docker | Local |
|--------|--------|-------|
| Setup Complexity | Medium (install Docker) | Low (install Node.js) |
| Start Time | Slower (build images) | Faster |
| Isolation | Complete | None |
| Resource Usage | Higher (VM) | Lower |
| Port Conflicts | Avoided | Possible |
| Development | Slower (rebuild images) | Faster (no rebuild) |

## Next Steps

1. Run `.\local-start.bat start` on Windows or `bash local-start.sh start` on Mac/Linux
2. Open http://localhost:5000 in your browser
3. Test the API endpoints
4. Open `Frontend/pages/client/index.html` to see the frontend
5. Check terminal windows for any errors

## Need Docker Later?

When you're ready to use Docker:
1. Install Docker Desktop
2. Run `docker-compose up -d --build`
3. Read [DOCKER.md](./DOCKER.md) for detailed guidance

---

**Happy coding! 🚀**
