import express from 'express'
import { getAllNotices, createNotice, deleteNotice } from '../controllers/noticeController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, getAllNotices)
router.post('/', authMiddleware, adminMiddleware, createNotice)
router.delete('/:id', authMiddleware, adminMiddleware, deleteNotice)

export default router
