# Hostel Hub - Complete Project Documentation

Welcome to the **Hostel Hub** project documentation. This file serves as a comprehensive guide to understanding the architecture, file structure, and functionality of the entire application. 

Hostel Hub is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for smart hostel management, featuring role-based access for Admins and Students.

---

## 🏗️ 1. Architecture Overview

The project is split into two distinct parts:
- **Backend (`/backend`)**: A Node.js/Express REST API connected to a MongoDB database using Mongoose.
- **Frontend (`/frontend`)**: A React application built with Vite, utilizing React Router for navigation and Tailwind CSS for styling.

---

## 💾 2. Backend Structure (`/backend`)

The backend is responsible for all business logic, database interactions, and authentication.

### Core Files
- **`server.js`**: The main entry point. It configures Express, sets up CORS, connects to MongoDB, and registers all API routes.
- **`.env`**: Stores environment variables like `MONGO_URI`, `JWT_SECRET`, and `PORT`.

### `models/` - Database Schemas
These files define the structure of data stored in MongoDB using Mongoose.
- **`User.js`**: Stores user data (Admins and Students). Handles password hashing.
- **`Admission.js`**: Tracks student admission requests (course, year, parent info) and their status.
- **`Room.js`**: Manages hostel rooms, capacity, current occupants, and status (available/full).
- **`Payment.js`**: Tracks fee payments, amounts, due dates, and transactions.
- **`Notification.js`**: Stores system alerts, payment reminders, and announcements.
- **`Attendance.js`**: Records daily student check-ins and check-outs.
- **`Complaint.js`**: Manages student issues and tracks their resolution status.
- **`Notice.js`**: Global notice board announcements.

### `controllers/` - Business Logic
These files contain the functions that actually process API requests.
- **`authController.js`**: Handles `login` and `signup`. Issues JWT tokens.
- **`studentController.js`**: CRUD operations for managing student profiles.
- **`admissionController.js`**: Handles submitting requests, approving, and rejecting admissions.
- **`notificationController.js`**: Logic for sending bulk notifications, fetching unread counts, and marking as read.
- **`paymentController.js`**: Processing fee payments and generating stats.
- *(Other controllers follow the same pattern for their respective models)*.

### `routes/` - API Endpoints
Maps URL paths to the functions in the controllers.
- **`authRoutes.js`**: `POST /login`, `POST /signup`.
- **`notificationRoutes.js`**: Maps endpoints like `POST /send` to `notificationController.sendBulkNotifications`.
- *(Other routes follow the same RESTful pattern)*.

### `middleware/` - Request Interceptors
- **`auth.js`**: Contains `authMiddleware` (verifies JWT token from headers) and `adminMiddleware` (ensures the logged-in user is an admin).

---

## 🎨 3. Frontend Structure (`/frontend`)

The frontend is a modern React application. It communicates with the backend via Axios.

### Core Configuration
- **`src/App.jsx`**: The root component. Sets up `react-router-dom`. Contains the `<ProtectedRoute>` wrapper to prevent unauthorized access to specific routes based on user roles.
- **`src/main.jsx`**: Mounts the React tree to the DOM.

### `src/context/` - Global State
- **`AuthContext.jsx`**: Manages the user's login state globally. Stores the JWT token in `localStorage`, decodes user info, and provides `login()` and `logout()` functions to all components.
- **`ThemeContext.jsx`**: Manages Light/Dark mode toggling.

### `src/services/` - API Integration
- **`apiClient.js`**: An Axios instance configured to automatically attach the JWT token to every outgoing request.
- **`index.js`**: Exports organized API objects (`authAPI`, `studentAPI`, `notificationAPI`, etc.) containing methods that call specific backend routes. Pages use these instead of calling `fetch` directly.

### `src/components/` - Reusable UI Elements
- **`index.jsx`**: A central export file for basic UI components.
  - **`Alert`**: A global toast notification component fixed to the top right of the screen for displaying success/error messages.
  - **`Card`, `Input`, `Button`, `Table`, `Modal`**: Consistent building blocks used across all pages.
- **`Sidebar.jsx`**: The main navigation menu. Renders different links based on whether the user is an Admin or Student.
- **`Navbar.jsx`**: Top bar showing the current page title and theme toggle.

### `src/pages/` - Application Views
This is where the actual screens of the application live.

#### Public Pages
- **`LandingPage.jsx`**: The welcome screen for unauthenticated users.
- **`LoginPage.jsx` & `SignupPage.jsx`**: Authentication screens featuring a modern split-screen design.

#### Admin Pages
- **`AdminDashboard.jsx`**: High-level overview, statistics, and charts.
- **`AdminNotificationPanel.jsx`**: Allows admins to compose and send system-wide toast notifications and alerts to all students.
- **`AdmissionManagement.jsx`**: Review pending student admission requests and allocate rooms.
- **`RoomManagement.jsx`**: Add/edit physical rooms and monitor occupancy.
- **`StudentManagement.jsx`**: View all registered students and their details.
- **`AdminPaymentDashboard.jsx`**: Overview of collected fees and pending dues.

#### Student Pages
- **`StudentDashboard.jsx`**: The student's home page, showing quick stats (room info, pending dues, recent notices).
- **`AdmissionPage.jsx`**: Where a newly registered student fills out detailed information (course, parent info) to request a hostel room.
- **`NotificationCenter.jsx`**: A dedicated inbox for students to view alerts and messages sent by the admin.
- **`PaymentDashboard.jsx`**: View fee history and pay upcoming dues.
- **`ComplaintManagement.jsx`**: Submit maintenance or hostel complaints.

---

## 🔄 4. How Data Flows (Example: Sending a Notification)

To understand how the pieces connect, here is the flow of an Admin sending a notification:

1. **User Action**: The admin types a message in `AdminNotificationPanel.jsx` and clicks "Send Notification".
2. **Frontend Service**: The page calls `notificationAPI.sendBulkNotifications(data)` from `src/services/index.js`.
3. **HTTP Request**: The `apiClient` attaches the Admin's JWT token and makes a `POST` request to `/api/notifications/bulk`.
4. **Backend Route**: In `server.js`, `/api/notifications` is routed to `notificationRoutes.js`, which hits `POST /bulk`.
5. **Middleware check**: The request passes through `authMiddleware` (valid token?) and `adminMiddleware` (is user admin?).
6. **Controller Logic**: `notificationController.sendBulkNotifications` maps over all student IDs and runs `Notification.insertMany()` to save them to the database.
7. **Response**: The backend sends a `201 Success` response.
8. **UI Update**: `AdminNotificationPanel.jsx` catches the success and renders a global `<Alert>` toast in the top right corner saying "Notification sent successfully!". 
9. **Student View**: When a student logs in, `NotificationCenter.jsx` calls `notificationAPI.getNotifications()`, retrieving their unread messages from the database.
