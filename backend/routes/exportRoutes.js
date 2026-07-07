import express from 'express'
import {
  exportPaymentsPDF,
  exportPaymentsExcel,
  exportStudentsPDF,
  exportStudentsExcel,
  exportAttendancePDF,
  exportAttendanceExcel,
  exportAllDataPDF,
  exportAllDataExcel
} from '../controllers/exportController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// All exports should be admin-only
router.use(authMiddleware, adminMiddleware)

router.get('/payments/pdf', exportPaymentsPDF)
router.get('/payments/excel', exportPaymentsExcel)

router.get('/students/pdf', exportStudentsPDF)
router.get('/students/excel', exportStudentsExcel)

router.get('/attendance/pdf', exportAttendancePDF)
router.get('/attendance/excel', exportAttendanceExcel)

router.get('/all/pdf', exportAllDataPDF)
router.get('/all/excel', exportAllDataExcel)

export default router
