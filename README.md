<p align="center">
  <img src="frontend/public/logo.jpeg" alt="Hostel Hub Logo" width="120" height="120" style="border-radius: 50%;" />
</p>

<h1 align="center">Hostel Hub — Smart Hostel Management System</h1>

<p align="center">
  A full-stack MERN web application to digitize and streamline hostel administration for students and administrators.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

---

## 📌 Objective

**Hostel Hub** replaces traditional paper-based hostel management with a modern digital platform. It provides separate dashboards for Admins and Students, enabling efficient management of admissions, room allocation, fee payments, attendance tracking, complaints, and real-time notifications — all from a single responsive web interface.

---

## ✨ Features

### Student Side
- **Secure Authentication** — Register and login with JWT-based authentication
- **Admission Portal** — Submit hostel admission requests with academic and personal details
- **Room Details** — View allocated room information after admin approval
- **Fee Management** — Track pending fees, view payment history, and process payments
- **Attendance Tracker** — View daily attendance records and summary statistics
- **Complaint System** — Raise maintenance or hostel-related complaints
- **Notification Center** — Receive real-time alerts, announcements, and fee reminders
- **Notice Board** — Stay updated with the latest hostel notices

### Admin Side
- **Admin Dashboard** — Overview of all hostel statistics at a glance
- **Admission Management** — Review, approve, or reject student admission requests
- **Room Management** — Add rooms, manage capacity, and allocate students
- **Student Management** — View and manage all registered students
- **Payment Dashboard** — Monitor fee collection and pending dues
- **Attendance Panel** — Mark and manage student attendance records
- **System-wide Notifications** — Send broadcast alerts and announcements to all students
- **Complaint Resolution** — Track and resolve student complaints

### General
- **Dark/Light Mode** — Full theme toggle support across the application
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Toast Notifications** — Global floating alerts for success/error messages

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| **Frontend** | React.js (Vite), Tailwind CSS, React Router, Axios, Lucide Icons |
| **Backend**  | Node.js, Express.js                 |
| **Database** | MongoDB (Mongoose ODM)              |
| **Auth**     | JSON Web Tokens (JWT), Bcrypt.js    |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```
Hostel-Hub/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic for each feature
│   ├── middleware/       # JWT authentication & admin checks
│   ├── models/          # Mongoose schemas (User, Room, Payment, etc.)
│   ├── routes/          # API endpoint definitions
│   └── server.js        # Express app entry point
│
├── frontend/
│   ├── public/          # Static assets (logo)
│   └── src/
│       ├── components/  # Reusable UI components (Sidebar, Navbar, Alert)
│       ├── context/     # AuthContext & ThemeContext providers
│       ├── pages/       # All application screens
│       ├── services/    # Axios API client & endpoint methods
│       └── App.jsx      # Route configuration
│
├── logo.jpeg
├── DEPLOYMENT_GUIDE.md
├── project-documentation.md
└── README.md
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Git](https://git-scm.com/)

### Step 1 — Clone the Repository
```bash
git clone https://github.com/Vinayak1806/Hostel-Management-System.git
cd Hostel-Management-System
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend` folder:
```
MONGODB_URI=mongodb://localhost:27017/hostel-management
JWT_SECRET=your_secret_key_here
PORT=5000
```
Start the backend server:
```bash
npm run dev
```

### Step 3 — Setup Frontend
Open a new terminal:
```bash
cd frontend
npm install
```
Create a `.env` file inside the `frontend` folder:
```
VITE_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm run dev
```

### Step 4 — Open the Application
Visit **http://localhost:5173** in your browser. The application is now running locally!

---

## 🌐 Live Demo

| Service   | Link |
|-----------|------|
| **Frontend (Vercel)** | [https://hostel-hub.vercel.app](https://hostel-hub.vercel.app) |
| **Backend API (Render)** | [https://hostel-management-system-rywc.onrender.com](https://hostel-management-system-rywc.onrender.com) |

> **Note:** The Render free tier may take ~30 seconds to wake up on the first request after inactivity.

---

## 👨‍💻 Author

**Vinayak Pawate**

---
