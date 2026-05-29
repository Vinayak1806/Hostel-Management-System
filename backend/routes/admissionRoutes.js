import express from 'express'
import {
  submitAdmissionRequest,
  getPendingAdmissions,
  approveAdmission,
  rejectAdmission,
  getMyAdmissionStatus,
  getAllAdmissions,
  getAdmissionStats
} from '../controllers/admissionController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Student routes
router.post('/submit', authMiddleware, submitAdmissionRequest) // Submit admission request
router.get('/my-status', authMiddleware, getMyAdmissionStatus) // Get own admission status

// Admin routes
router.get('/pending', authMiddleware, adminMiddleware, getPendingAdmissions) // Get pending requests
router.post('/approve', authMiddleware, adminMiddleware, approveAdmission) // Approve & allocate room
router.post('/reject', authMiddleware, adminMiddleware, rejectAdmission) // Reject admission
router.get('/all', authMiddleware, adminMiddleware, getAllAdmissions) // Get all admissions
router.get('/stats', authMiddleware, adminMiddleware, getAdmissionStats) // Admission statistics

export default router
