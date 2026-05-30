import express from 'express'
import * as attendanceController from '../controllers/attendanceController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Student routes
router.post('/check-in', authMiddleware, attendanceController.checkIn)
router.post('/check-out', authMiddleware, attendanceController.checkOut)
router.get('/student', authMiddleware, attendanceController.getStudentAttendance)
router.post('/leave-request', authMiddleware, attendanceController.requestLeave)

// Admin routes
router.get('/', authMiddleware, adminMiddleware, attendanceController.getAllAttendance)
router.post('/mark/:userId', authMiddleware, adminMiddleware, attendanceController.markAttendance)

export default router
