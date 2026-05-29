import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import feeRoutes from './routes/feeRoutes.js'
import complaintRoutes from './routes/complaintRoutes.js'
import noticeRoutes from './routes/noticeRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
app.use('/api/fees', feeRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/analytics', analyticsRoutes)

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
