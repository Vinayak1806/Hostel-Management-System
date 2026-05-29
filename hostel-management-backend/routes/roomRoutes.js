import express from 'express'
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  allocateStudent
} from '../controllers/roomController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, getAllRooms)
router.get('/:id', authMiddleware, getRoomById)
router.post('/', authMiddleware, adminMiddleware, createRoom)
router.put('/:id', authMiddleware, adminMiddleware, updateRoom)
router.delete('/:id', authMiddleware, adminMiddleware, deleteRoom)
router.post('/:id/allocate', authMiddleware, adminMiddleware, allocateStudent)

export default router
