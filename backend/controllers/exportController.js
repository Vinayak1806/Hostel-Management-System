import PDFDocument from 'pdfkit'
import ExcelJS from 'exceljs'
import Payment from '../models/Payment.js'
import User from '../models/User.js'
import Attendance from '../models/Attendance.js'

// Generic helper to set PDF response headers
const setPdfHeaders = (res, filename) => {
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=${filename}.pdf`)
}

// Generic helper to set Excel response headers
const setExcelHeaders = (res, filename) => {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`)
}

export const exportPaymentsPDF = async (req, res) => {
  try {
    const payments = await Payment.find().populate('student', 'name email rollNumber')

    const doc = new PDFDocument()
    setPdfHeaders(res, 'Payments_Report')
    doc.pipe(res)

    doc.fontSize(20).text('Payments Report', { align: 'center' })
    doc.moveDown()

    payments.forEach((payment, index) => {
      doc.fontSize(12).text(`${index + 1}. Student: ${payment.student?.name || 'Unknown'}`)
      doc.fontSize(10).text(`Amount: Rs. ${payment.amount}`)
      doc.fontSize(10).text(`Status: ${payment.status}`)
      doc.fontSize(10).text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`)
      doc.moveDown()
    })

    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const exportPaymentsExcel = async (req, res) => {
  try {
    const payments = await Payment.find().populate('student', 'name email rollNumber')

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Payments')

    worksheet.columns = [
      { header: 'Student Name', key: 'name', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date', key: 'date', width: 20 }
    ]

    payments.forEach(payment => {
      worksheet.addRow({
        name: payment.student?.name || 'Unknown',
        amount: payment.amount,
        status: payment.status,
        date: new Date(payment.createdAt).toLocaleDateString()
      })
    })

    setExcelHeaders(res, 'Payments_Report')
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const exportStudentsPDF = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })

    const doc = new PDFDocument()
    setPdfHeaders(res, 'Students_Report')
    doc.pipe(res)

    doc.fontSize(20).text('Students Report', { align: 'center' })
    doc.moveDown()

    students.forEach((student, index) => {
      doc.fontSize(12).text(`${index + 1}. Name: ${student.name}`)
      doc.fontSize(10).text(`Email: ${student.email}`)
      doc.fontSize(10).text(`Room: ${student.roomNumber || 'Not Assigned'}`)
      doc.moveDown()
    })

    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const exportStudentsExcel = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Students')

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Room', key: 'room', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ]

    students.forEach(student => {
      worksheet.addRow({
        name: student.name,
        email: student.email,
        room: student.roomNumber || 'Not Assigned',
        status: student.isActive ? 'Active' : 'Inactive'
      })
    })

    setExcelHeaders(res, 'Students_Report')
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const exportAttendancePDF = async (req, res) => {
  try {
    const records = await Attendance.find().populate('student', 'name roomNumber').sort({ date: -1 })

    const doc = new PDFDocument()
    setPdfHeaders(res, 'Attendance_Report')
    doc.pipe(res)

    doc.fontSize(20).text('Attendance Report', { align: 'center' })
    doc.moveDown()

    records.forEach((record, index) => {
      doc.fontSize(12).text(`${index + 1}. Student: ${record.student?.name || 'Unknown'}`)
      doc.fontSize(10).text(`Date: ${new Date(record.date).toLocaleDateString()}`)
      doc.fontSize(10).text(`Status: ${record.status}`)
      doc.moveDown()
    })

    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const exportAttendanceExcel = async (req, res) => {
  try {
    const records = await Attendance.find().populate('student', 'name roomNumber').sort({ date: -1 })

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Attendance')

    worksheet.columns = [
      { header: 'Student Name', key: 'name', width: 25 },
      { header: 'Room', key: 'room', width: 15 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ]

    records.forEach(record => {
      worksheet.addRow({
        name: record.student?.name || 'Unknown',
        room: record.student?.roomNumber || 'N/A',
        date: new Date(record.date).toLocaleDateString(),
        status: record.status
      })
    })

    setExcelHeaders(res, 'Attendance_Report')
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const exportAllDataPDF = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
    const payments = await Payment.find().populate('student', 'name email rollNumber')
    const records = await Attendance.find().populate('student', 'name roomNumber').sort({ date: -1 })
    
    const doc = new PDFDocument({ margin: 50, size: 'A4' })
    setPdfHeaders(res, 'Hostel_Hub_All_Data_Report')
    doc.pipe(res)

    // Title and Header
    doc.fillColor('#2563EB').fontSize(26).text('Hostel Hub', { align: 'center' })
    doc.fillColor('#4B5563').fontSize(16).text('Comprehensive System Data Report', { align: 'center' })
    doc.moveDown(0.5)
    doc.fillColor('#9CA3AF').fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' })
    doc.moveDown(2)

    // Helper for Section Headers
    const drawSectionHeader = (title) => {
      doc.rect(doc.x, doc.y, doc.page.width - 100, 25).fill('#F3F4F6')
      doc.fillColor('#1F2937').fontSize(14).font('Helvetica-Bold').text(title, doc.x + 10, doc.y + 6)
      doc.moveDown(1)
      doc.font('Helvetica').fontSize(11).fillColor('#4B5563')
    }

    // 1. Students Section
    drawSectionHeader('1. Students Overview')
    let studentY = doc.y
    students.forEach((student, index) => {
      if (doc.y > doc.page.height - 100) { doc.addPage(); studentY = doc.y }
      doc.text(`${index + 1}.`, 50, studentY)
      doc.text(student.name, 80, studentY)
      doc.text(student.email, 250, studentY)
      doc.text(student.roomNumber || 'Unassigned', 450, studentY)
      studentY += 20
      doc.y = studentY
    })
    doc.moveDown(2)

    // 2. Payments Section
    if (doc.y > doc.page.height - 150) doc.addPage()
    drawSectionHeader('2. Payments Overview')
    let paymentY = doc.y
    payments.forEach((payment, index) => {
      if (doc.y > doc.page.height - 100) { doc.addPage(); paymentY = doc.y }
      const status = (payment.status || 'N/A').toUpperCase()
      doc.text(`${index + 1}.`, 50, paymentY)
      doc.text(payment.student?.name || 'Unknown', 80, paymentY)
      doc.text(`Rs. ${payment.amount}`, 250, paymentY)
      doc.text(new Date(payment.createdAt).toLocaleDateString(), 350, paymentY)
      doc.text(status, 450, paymentY)
      paymentY += 20
      doc.y = paymentY
    })
    doc.moveDown(2)

    // 3. Attendance Section
    if (doc.y > doc.page.height - 150) doc.addPage()
    drawSectionHeader('3. Recent Attendance Records (Last 50)')
    let attY = doc.y
    records.slice(0, 50).forEach((record, index) => {
      if (doc.y > doc.page.height - 100) { doc.addPage(); attY = doc.y }
      const status = (record.status || 'N/A').toUpperCase()
      doc.text(`${index + 1}.`, 50, attY)
      doc.text(record.student?.name || 'Unknown', 80, attY)
      doc.text(record.student?.roomNumber || 'N/A', 250, attY)
      doc.text(new Date(record.date).toLocaleDateString(), 350, attY)
      doc.text(status, 450, attY)
      attY += 20
      doc.y = attY
    })

    // Footer
    const pages = doc.bufferedPageRange()
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i)
      doc.fontSize(8).fillColor('#9CA3AF').text(
        `Page ${i + 1} of ${pages.count}`,
        50,
        doc.page.height - 40,
        { align: 'center' }
      )
    }

    doc.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const exportAllDataExcel = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
    const payments = await Payment.find().populate('student', 'name email rollNumber')
    const records = await Attendance.find().populate('student', 'name roomNumber').sort({ date: -1 })
    
    const workbook = new ExcelJS.Workbook()
    
    // --- Summary Sheet ---
    const summarySheet = workbook.addWorksheet('Summary Dashboard')
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 }
    ]
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
    summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }
    
    const totalRevenue = payments.reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0)
    summarySheet.addRows([
      { metric: 'Total Students', value: students.length },
      { metric: 'Active Students', value: students.filter(s => s.isActive).length },
      { metric: 'Total Revenue Received (Rs)', value: totalRevenue },
      { metric: 'Total Payments Recorded', value: payments.length },
      { metric: 'Total Attendance Records', value: records.length }
    ])
    
    // --- Students Sheet ---
    const studentsSheet = workbook.addWorksheet('Students')
    studentsSheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 35 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Room', key: 'room', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ]
    studentsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
    studentsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } }

    students.forEach(student => {
      studentsSheet.addRow({
        name: student.name,
        email: student.email,
        phone: student.phone || 'N/A',
        room: student.roomNumber || 'Not Assigned',
        status: student.isActive ? 'Active' : 'Inactive'
      })
    })

    // --- Payments Sheet ---
    const paymentsSheet = workbook.addWorksheet('Payments')
    paymentsSheet.columns = [
      { header: 'Student Name', key: 'name', width: 25 },
      { header: 'Amount (Rs)', key: 'amount', width: 15 },
      { header: 'Semester', key: 'semester', width: 15 },
      { header: 'Method', key: 'method', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date', key: 'date', width: 20 }
    ]
    paymentsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
    paymentsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } }

    payments.forEach(payment => {
      paymentsSheet.addRow({
        name: payment.student?.name || 'Unknown',
        amount: payment.amount,
        semester: payment.semester || 'N/A',
        method: (payment.paymentMethod || 'N/A').toUpperCase(),
        status: (payment.status || 'N/A').toUpperCase(),
        date: new Date(payment.createdAt).toLocaleDateString()
      })
    })

    // --- Attendance Sheet ---
    const attendanceSheet = workbook.addWorksheet('Attendance')
    attendanceSheet.columns = [
      { header: 'Student Name', key: 'name', width: 25 },
      { header: 'Room', key: 'room', width: 15 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ]
    attendanceSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
    attendanceSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } }

    records.forEach(record => {
      attendanceSheet.addRow({
        name: record.student?.name || 'Unknown',
        room: record.student?.roomNumber || 'N/A',
        date: new Date(record.date).toLocaleDateString(),
        status: (record.status || 'N/A').toUpperCase()
      })
    })

    setExcelHeaders(res, 'Hostel_Hub_All_Data')
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
