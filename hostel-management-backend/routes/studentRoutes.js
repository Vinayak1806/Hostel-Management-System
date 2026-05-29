import express from 'express'
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, adminMiddleware, getAllStudents)
router.get('/:id', authMiddleware, getStudentById)
router.post('/', authMiddleware, adminMiddleware, createStudent)
router.put('/:id', authMiddleware, adminMiddleware, updateStudent)
router.delete('/:id', authMiddleware, adminMiddleware, deleteStudent)

export default router
