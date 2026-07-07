import express from 'express'
import { signup, login, logout, getCurrentUser, forgotPassword, resetPassword } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authMiddleware, getCurrentUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
