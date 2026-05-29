import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Pages
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'
import StudentManagement from './pages/StudentManagement'
import RoomManagement from './pages/RoomManagement'
import FeeManagement from './pages/FeeManagement'
import ComplaintManagement from './pages/ComplaintManagement'
import NoticeBoard from './pages/NoticeBoard'
import AdmissionPage from './pages/AdmissionPage'
import AdmissionManagement from './pages/AdmissionManagement'
import NotFound from './pages/NotFound'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isAdmin ? '/admin' : '/dashboard'} />} />
      <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to={isAdmin ? '/admin' : '/dashboard'} />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute requiredRole="admin">
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute requiredRole="admin">
            <RoomManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/fees"
        element={
          <ProtectedRoute requiredRole="admin">
            <FeeManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute requiredRole="admin">
            <ComplaintManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notices"
        element={
          <ProtectedRoute requiredRole="admin">
            <NoticeBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/admissions"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdmissionManagement />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admission"
        element={
          <ProtectedRoute>
            <AdmissionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <ComplaintManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notices"
        element={
          <ProtectedRoute>
            <NoticeBoard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
