# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

**Backend:**
```bash
cd hostel-management-backend
npm install
```

**Frontend:**
```bash
cd hostel-management-frontend
npm install
```

### Step 2: Setup Environment

**Backend .env file:**
```bash
cd hostel-management-backend
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/hostel-management
JWT_SECRET=your_super_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
- Create account at https://www.mongodb.com/cloud/atlas
- Update MONGODB_URI in .env

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd hostel-management-backend
npm run dev
```
Server will run at: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd hostel-management-frontend
npm run dev
```
App will run at: http://localhost:5173

### Step 5: Login with Demo Account

1. Go to http://localhost:5173
2. Click "Sign In"
3. Use:
   - **Admin:** admin@hostel.com / admin123
   - **Student:** student@hostel.com / student123

## 📊 Create Sample Data

### Add Admin User (via MongoDB)
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@hostel.com",
  phone: "9876543210",
  password: "hashed_password_here",
  role: "admin"
})
```

### Add Test Room
```javascript
db.rooms.insertOne({
  roomNumber: "101",
  floor: 1,
  capacity: 2,
  currentOccupancy: 0,
  status: "available"
})
```

### Add Test Student
```javascript
db.users.insertOne({
  name: "John Doe",
  email: "john@hostel.com",
  phone: "9876543211",
  password: "hashed_password",
  rollNumber: "21CS001",
  semester: 3,
  role: "student"
})
```

## 🎯 Main Features to Test

### Admin Dashboard
- View total students, rooms, occupancy
- See pending fees and complaints
- Charts showing statistics

### Student Management
- Add new students
- Update student details
- View all students
- Delete students

### Room Management
- Create rooms with capacity
- Allocate students to rooms
- Check occupancy status

### Fee Management
- Create fee entries
- Mark fees as paid
- View fee collection status

### Complaint System
- File complaints (as student)
- View all complaints (as admin)
- Update complaint status
- Track resolution

### Notice Board
- Post announcements (admin)
- View notices (all users)
- Delete notices (admin)

## 🔗 API Testing with Postman

1. Import collection from requests
2. Set authorization header:
   ```
   Authorization: Bearer <token>
   ```
3. Test endpoints

## 🆘 Common Issues

### Issue: MongoDB not connecting
**Solution:** Ensure MongoDB is running on port 27017

### Issue: CORS error
**Solution:** Check frontend URL in server.js CORS config

### Issue: Port already in use
**Solution:** 
```bash
# Kill process on port 5000 or 5173
lsof -i :5000
kill -9 <PID>
```

### Issue: Blank screen on frontend
**Solution:** Check browser console for errors, ensure backend is running

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)

## ✅ Checklist

- [ ] MongoDB installed/running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] .env file created with correct values
- [ ] Backend server running on port 5000
- [ ] Frontend app running on port 5173
- [ ] Can login with demo account
- [ ] Can view admin dashboard
- [ ] Can create new students
- [ ] Can file complaints

Once all checkboxes are ticked, your system is ready! 🎉

---

**Happy Coding!**
