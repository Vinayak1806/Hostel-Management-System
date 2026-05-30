import express from 'express'
import * as notificationController from '../controllers/notificationController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// User routes
router.get('/', authMiddleware, notificationController.getNotifications)
router.get('/stats', authMiddleware, notificationController.getNotificationStats)
router.put('/read-all', authMiddleware, notificationController.markAllAsRead)
router.put('/:notificationId/read', authMiddleware, notificationController.markAsRead)
router.delete('/clear-all', authMiddleware, notificationController.clearAllNotifications)
router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification)

// Admin routes
router.post('/send', authMiddleware, adminMiddleware, notificationController.sendNotification)
router.post('/bulk', authMiddleware, adminMiddleware, notificationController.sendBulkNotifications)

export default router
