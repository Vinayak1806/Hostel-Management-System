# Hostel Management System

A modern, full-stack web application for managing hostel operations including student records, room allocation, fee tracking, complaints, and announcements. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### For Students
- ✅ User authentication with JWT
- ✅ View personal dashboard with room info
- ✅ File complaints with status tracking
- ✅ View notices and announcements
- ✅ Track fees and payment status
- ✅ Dark mode support

### For Administrators
- ✅ Complete student management (Add/Edit/Delete)
- ✅ Room allocation with capacity checking
- ✅ Fee management and payment tracking
- ✅ Complaint management with status updates
- ✅ Post and manage notices
- ✅ Analytics dashboard with charts
  - Total students, rooms, occupancy
  - Pending fees, open complaints
  - Fee collection progress
- ✅ Role-based access control

### Technical Features
- ✅ JWT authentication with role-based access
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark/Light theme toggle
- ✅ Real-time data updates
- ✅ Error handling and validation
- ✅ MVC architecture in backend
- ✅ RESTful API endpoints

## 🛠 Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

**Database:**
- MongoDB (local or cloud)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or Atlas)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone or Extract Project
```bash
cd "d:\Programs\Web Development Project\project"
```

### 2. Backend Setup
```bash
cd hostel-management-backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/hostel-management
# JWT_SECRET=your_secret_key_here

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../hostel-management-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# App runs on http://localhost:5173
```

## 📊 Database Setup

### Option 1: Local MongoDB
```bash
# Make sure MongoDB is running
mongod

# Create database (automatic on first insert)
# Database name: hostel-management
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-management
   ```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Students (Admin only)
- `GET /api/students` - List all students
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Rooms (Admin)
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room
- `POST /api/rooms/:id/allocate` - Allocate student to room

### Fees (Admin)
- `GET /api/fees` - List all fees
- `GET /api/fees/student/my-fees` - Student's fees
- `POST /api/fees` - Create fee entry
- `PATCH /api/fees/:id/mark-paid` - Mark fee as paid

### Complaints
- `GET /api/complaints` - List all complaints (admin)
- `GET /api/complaints/student/my-complaints` - Student's complaints
- `POST /api/complaints` - File complaint
- `PATCH /api/complaints/:id/status` - Update status (admin)
- `DELETE /api/complaints/:id` - Delete complaint

### Notices
- `GET /api/notices` - List all notices
- `POST /api/notices` - Create notice (admin)
- `DELETE /api/notices/:id` - Delete notice (admin)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard data (admin)

## 👤 Demo Accounts

### Admin
- **Email:** admin@hostel.com
- **Password:** admin123

### Student
- **Email:** student@hostel.com
- **Password:** student123

## 📁 Project Structure

```
hostel-management-system/
├── hostel-management-frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth & Theme context
│   │   ├── services/        # API calls
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── hostel-management-backend/
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & validation
│   ├── config/              # Database config
│   ├── server.js            # Main server file
│   └── package.json
│
└── PROJECT_PROGRESS.md      # Project tracking
```

## 🎨 UI Components

- **Navbar** - Top navigation with theme toggle
- **Sidebar** - Navigation menu (responsive)
- **Card** - Reusable card component
- **Button** - Button variants (primary, secondary, danger)
- **Input** - Text input with validation
- **Select** - Dropdown select
- **Textarea** - Multi-line text input
- **Badge** - Status badges
- **Table** - Data table with sorting
- **Modal** - Dialog component
- **Alert** - Notification alerts
- **LoadingSpinner** - Loading indicator

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based access control
- ✅ Protected API endpoints
- ✅ CORS configuration
- ✅ Input validation

## 🧪 Testing

### Test Student Registration
1. Go to http://localhost:5173/signup
2. Fill in details
3. Click Sign Up

### Test Admin Login
1. Go to http://localhost:5173/login
2. Use: admin@hostel.com / admin123
3. View admin dashboard

### Test Features
- Create/Update/Delete students
- Allocate rooms
- Manage fees
- File complaints
- Create notices

## 📈 Deployment

### Backend (Heroku/Railway)
```bash
# Set environment variables
heroku config:set MONGODB_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
# Update API base URL in apiClient.js
npm run build
# Deploy dist folder
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify username/password for Atlas

### CORS Error
- Check CORS configuration in server.js
- Verify frontend URL matches

### Port Already in Use
```bash
# Backend (5000)
lsof -i :5000
kill -9 <PID>

# Frontend (5173)
lsof -i :5173
kill -9 <PID>
```

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and improve this project for your needs.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for hostel management**
