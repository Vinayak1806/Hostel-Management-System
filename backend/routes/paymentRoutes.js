import express from 'express'
import * as paymentController from '../controllers/paymentController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Student routes
router.get('/student', authMiddleware, paymentController.getStudentPayments)
router.get('/invoice/:paymentId', authMiddleware, paymentController.generateInvoice)
router.post('/process/:paymentId', authMiddleware, paymentController.processPayment)

// Admin routes
router.get('/', authMiddleware, adminMiddleware, paymentController.getAllPayments)
router.post('/', authMiddleware, adminMiddleware, paymentController.createPayment)
router.put('/:paymentId', authMiddleware, adminMiddleware, paymentController.updatePaymentStatus)
router.delete('/:paymentId', authMiddleware, adminMiddleware, paymentController.deletePayment)

export default router
