import express from 'express'
import {
  getAllFees,
  getFeeById,
  createFee,
  updateFee,
  markFeePaid,
  getStudentFees
} from '../controllers/feeController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, adminMiddleware, getAllFees)
router.get('/student/my-fees', authMiddleware, getStudentFees)
router.get('/:id', authMiddleware, getFeeById)
router.post('/', authMiddleware, adminMiddleware, createFee)
router.put('/:id', authMiddleware, adminMiddleware, updateFee)
router.patch('/:id/mark-paid', authMiddleware, adminMiddleware, markFeePaid)

export default router
