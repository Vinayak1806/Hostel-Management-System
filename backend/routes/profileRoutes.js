import express from 'express'
import { getProfile, updateProfile, uploadPhoto } from '../controllers/profileController.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, getProfile)
router.put('/', authMiddleware, updateProfile)
router.put('/photo', authMiddleware, uploadPhoto)

export default router
