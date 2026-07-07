import express from 'express'
import * as chatController from '../controllers/chatController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware, chatController.handleChatMessage)

export default router
