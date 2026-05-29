# Hostel Management System - Complete Setup Guide

## 📋 System Requirements

- **Node.js:** v16 or higher ([Download](https://nodejs.org))
- **MongoDB:** v4.4 or higher (Local or Cloud)
- **Git:** Optional but recommended
- **RAM:** Minimum 2GB
- **Storage:** Minimum 500MB

## 🔧 Step-by-Step Installation

### Step 1: Extract Project Files

The project is already organized in:
```
d:\Programs\Web Development Project\project\
├── hostel-management-frontend/
├── hostel-management-backend/
├── PROJECT_PROGRESS.md
├── README.md
├── API_DOCUMENTATION.md
└── QUICKSTART.md
```

### Step 2: Install MongoDB

#### Option A: Local MongoDB (Windows)

1. Download from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Install MongoDB as a Service"
4. Complete installation
5. Verify installation:
   ```bash
   mongod --version
   ```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new project
4. Create a cluster (free tier)
5. Add database user with username and password
6. Get connection string
7. Add IP to whitelist (0.0.0.0/0 for development)

### Step 3: Install Node.js Dependencies

**For Backend:**
```bash
# Open PowerShell in the backend directory
cd "d:\Programs\Web Development Project\project\hostel-management-backend"

# Install dependencies
npm install
```

**For Frontend:**
```bash
# Open PowerShell in the frontend directory
cd "d:\Programs\Web Development Project\project\hostel-management-frontend"

# Install dependencies
npm install
```

### Step 4: Configure Environment Variables

**Backend Configuration:**
```bash
# Navigate to backend folder
cd "d:\Programs\Web Development Project\project\hostel-management-backend"

# Create .env file
copy .env.example .env
```

**Edit .env file with your values:**
```
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/hostel-management

# OR MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-management

# JWT secret
JWT_SECRET=your_super_secret_key_change_in_production

# Port
PORT=5000

# Environment
NODE_ENV=development
```

### Step 5: Start MongoDB

**If using Local MongoDB:**
```bash
# MongoDB runs as a Windows service, no need to start manually
# Or start manually:
mongod
```

**If using MongoDB Atlas:**
- No action needed, it's cloud-hosted

### Step 6: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd "d:\Programs\Web Development Project\project\hostel-management-backend"
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
✓ Server running on http://localhost:5000
✓ API endpoint: http://localhost:5000/api
```

**Terminal 2 - Start Frontend:**
```bash
cd "d:\Programs\Web Development Project\project\hostel-management-frontend"
npm run dev
```

You should see:
```
VITE v5.0.0  ready in ... ms

➜  Local:   http://localhost:5173/
```

### Step 7: Seed Database (Optional)

To populate with sample data:

```bash
cd "d:\Programs\Web Development Project\project\hostel-management-backend"
node seed.js
```

This creates:
- Admin user
- 4 sample students
- 4 rooms
- Fee entries
- Complaints
- Notices

### Step 8: Access the Application

1. Open browser
2. Go to http://localhost:5173
3. Login with demo account:
   - **Admin:** admin@hostel.com / admin123
   - **Student:** student@hostel.com / student123

## 🔑 Important Files

- **Frontend Entry:** `hostel-management-frontend/src/App.jsx`
- **Backend Entry:** `hostel-management-backend/server.js`
- **API Documentation:** `API_DOCUMENTATION.md`
- **Quick Start:** `QUICKSTART.md`

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
```bash
# Check if MongoDB is running
mongod

# Or verify MongoDB service is running on Windows:
# Services → MongoDB Server
```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE :::5000`

**Solution:**
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000

# Kill the process
Stop-Process -Id <PID> -Force
```

### Dependencies Not Installing

**Problem:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps
```

### Frontend Not Loading

**Problem:** Blank screen or 404 errors

**Solution:**
1. Check browser console (F12)
2. Ensure backend is running on port 5000
3. Check CORS settings in backend
4. Clear browser cache (Ctrl+Shift+Delete)

## 📚 Project Structure Overview

```
hostel-management-system/
│
├── Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/        # UI components (20+)
│   │   ├── pages/             # Page components (8)
│   │   ├── context/           # Auth & Theme
│   │   ├── services/          # API calls
│   │   ├── utils/             # Helpers
│   │   ├── App.jsx            # Main app
│   │   └── index.css          # Global styles
│   └── public/                # Static files
│
├── Backend (Node.js + Express)
│   ├── models/                # MongoDB schemas (5)
│   ├── controllers/           # Business logic (7)
│   ├── routes/                # API endpoints (7)
│   ├── middleware/            # Auth middleware
│   ├── config/                # Database config
│   ├── server.js              # Entry point
│   └── seed.js                # Sample data
│
└── Documentation
    ├── README.md              # Main documentation
    ├── QUICKSTART.md          # Quick start guide
    ├── API_DOCUMENTATION.md   # API endpoints
    └── PROJECT_PROGRESS.md    # Progress tracking
```

## ✅ Pre-Launch Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB installed/accessible
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env file created with MongoDB URI
- [ ] Backend server running on port 5000
- [ ] Frontend app running on port 5173
- [ ] Can login with demo credentials
- [ ] Admin dashboard loads
- [ ] Create new student works
- [ ] Dark mode toggle works

## 🚀 First Steps After Setup

### As Admin:
1. Login with admin@hostel.com / admin123
2. View Admin Dashboard
3. Create a new room
4. Create a new student
5. Allocate student to room
6. Create a fee entry
7. Post a notice

### As Student:
1. Signup with new account
2. View Dashboard
3. File a complaint
4. View notices
5. Check fees

## 📞 Getting Help

### Common Questions

**Q: How do I change the database?**
A: Update MONGODB_URI in .env file

**Q: How do I add more users?**
A: Use signup page or seed.js script

**Q: How do I reset the database?**
A: Run seed.js again or delete MongoDB collections

**Q: How do I deploy to production?**
A: See deployment section in README.md

## 🔐 Security Notes for Production

Before deploying to production:

1. Change JWT_SECRET to a strong random string
2. Enable MongoDB authentication
3. Set NODE_ENV=production
4. Update CORS origin to your domain
5. Enable HTTPS
6. Setup rate limiting
7. Add input validation
8. Enable database backups

## 📦 Building for Production

**Frontend:**
```bash
cd hostel-management-frontend
npm run build
# Creates dist/ folder
```

**Backend:**
- No build needed, ready to deploy

## 💾 Backup & Recovery

**Backup MongoDB:**
```bash
mongodump --uri="mongodb://localhost:27017/hostel-management" --out=./backup
```

**Restore MongoDB:**
```bash
mongorestore --uri="mongodb://localhost:27017/hostel-management" ./backup/hostel-management
```

## 📈 Next Steps

1. Customize colors in tailwind.config.js
2. Add more features as needed
3. Setup CI/CD pipeline
4. Deploy to production
5. Setup monitoring and logging
6. Configure email notifications
7. Add payment integration

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [JWT Introduction](https://jwt.io)

---

**Happy Coding! Your Hostel Management System is ready to use! 🎉**

For detailed API documentation, see `API_DOCUMENTATION.md`  
For quick start, see `QUICKSTART.md`
