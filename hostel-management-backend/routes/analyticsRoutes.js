import express from 'express'
import { getDashboardAnalytics } from '../controllers/analyticsController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardAnalytics)

export default router
