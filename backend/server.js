import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/database.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import complaintRoutes from './routes/complaintRoutes.js'
import noticeRoutes from './routes/noticeRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import admissionRoutes from './routes/admissionRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import exportRoutes from './routes/exportRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Connect to database
await connectDB()

// Health check
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/admissions', admissionRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/exports', exportRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal Server Error', error: err.message })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
  console.log(`✓ API endpoint: http://localhost:${PORT}/api`)
})
