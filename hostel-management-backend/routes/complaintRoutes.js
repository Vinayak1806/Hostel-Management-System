import express from 'express'
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  deleteComplaint,
  getStudentComplaints
} from '../controllers/complaintController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, adminMiddleware, getAllComplaints)
router.get('/student/my-complaints', authMiddleware, getStudentComplaints)
router.get('/:id', authMiddleware, getComplaintById)
router.post('/', authMiddleware, createComplaint)
router.patch('/:id/status', authMiddleware, adminMiddleware, updateComplaintStatus)
router.delete('/:id', authMiddleware, deleteComplaint)

export default router
