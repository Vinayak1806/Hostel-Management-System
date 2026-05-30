import mongoose from 'mongoose'
import Attendance from '../models/Attendance.js'
import Notification from '../models/Notification.js'
import User from '../models/User.js'
import { sendEmail, emailTemplates } from '../utils/emailService.js'

// Check-in student
export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if already checked in today
    const existingRecord = await Attendance.findOne({
      student: userId,
      date: today
    })

    if (existingRecord) {
      return res.status(400).json({ message: existingRecord.checkOutTime ? 'Already completed attendance for today' : 'Already checked in today' })
    }

    const attendance = new Attendance({
      student: userId,
      checkInTime: new Date(),
      date: today,
      status: 'present'
    })

    await attendance.save()

    res.status(201).json({ message: 'Check-in successful', attendance })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Check-out student
export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const attendance = await Attendance.findOne({
      student: userId,
      date: today,
      checkOutTime: null
    })

    if (!attendance) {
      return res.status(404).json({ message: 'No active check-in found' })
    }

    attendance.checkOutTime = new Date()
    
    // Calculate duration in minutes
    const duration = Math.round((attendance.checkOutTime - attendance.checkInTime) / 60000)
    attendance.duration = duration

    await attendance.save()

    res.json({ message: 'Check-out successful', attendance })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get attendance record for student
export const getStudentAttendance = async (req, res) => {
  try {
    const userId = req.user.id
    const { month, year, page = 1, limit = 30 } = req.query

    let query = { student: userId }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)
      query.date = { $gte: startDate, $lte: endDate }
    }

    const skip = (page - 1) * limit

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Attendance.countDocuments(query)

    const summary = {
      totalDays: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      onLeave: records.filter(r => r.status === 'on_leave').length,
      averageDuration: Math.round(
        records.reduce((sum, r) => sum + (r.duration || 0), 0) / records.length || 0
      )
    }

    res.json({
      records,
      summary,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all attendance records (Admin)
export const getAllAttendance = async (req, res) => {
  try {
    const { studentId, status, date, month, year, page = 1, limit = 20 } = req.query

    let query = {}
    
    // Resolve studentId filter if provided
    if (studentId) {
      if (mongoose.Types.ObjectId.isValid(studentId)) {
        query.student = studentId
      } else {
        const studentUser = await User.findOne({
          $or: [
            { rollNumber: studentId },
            { email: studentId }
          ]
        })
        if (studentUser) {
          query.student = studentUser._id
        } else {
          // No matching student, return empty
          return res.json({ records: [], summary: { totalRecords: 0, present: 0, absent: 0, late: 0, onLeave: 0 }, pagination: { total: 0, pages: 0, currentPage: 1 } })
        }
      }
    }
    
    if (status) query.status = status
    
    // Support month/year filtering
    if (month && year) {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59, 999)
      query.date = { $gte: startDate, $lte: endDate }
    } else if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      query.date = { $gte: startDate, $lte: endDate }
    }

    const skip = (page - 1) * limit

    const records = await Attendance.find(query)
      .populate('student', 'name rollNumber email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Attendance.countDocuments(query)

    // Compute summary for the queried data
    const allQueryRecords = await Attendance.find(query)
    const summary = {
      totalRecords: total,
      present: allQueryRecords.filter(r => r.status === 'present').length,
      absent: allQueryRecords.filter(r => r.status === 'absent').length,
      late: allQueryRecords.filter(r => r.status === 'late').length,
      onLeave: allQueryRecords.filter(r => r.status === 'on_leave').length
    }

    res.json({
      records,
      summary,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark attendance manually (Admin)
export const markAttendance = async (req, res) => {
  try {
    const { student, date, status, leaveReason } = req.body
    const { userId } = req.params // Admin ID

    // Resolve student: could be a roll number, email, or ObjectId
    let studentId = student
    if (!mongoose.Types.ObjectId.isValid(student)) {
      // Look up student by roll number or email
      const studentUser = await User.findOne({
        $or: [
          { rollNumber: student },
          { email: student }
        ]
      })
      if (!studentUser) {
        return res.status(404).json({ message: `Student not found with identifier: ${student}` })
      }
      studentId = studentUser._id
    }

    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    let attendance = await Attendance.findOne({
      student: studentId,
      date: attendanceDate
    })

    if (!attendance) {
      attendance = new Attendance({
        student: studentId,
        date: attendanceDate,
        checkInTime: new Date(),
        status
      })
    } else {
      attendance.status = status
    }

    if (leaveReason) {
      attendance.leaveReason = leaveReason
      attendance.approvedBy = userId
    }

    await attendance.save()

    // Check attendance percentage if status is absent or late
    if (status === 'absent') {
      const allRecords = await Attendance.find({ student: studentId })
      const totalDays = allRecords.length
      const presentDays = allRecords.filter(r => r.status === 'present' || r.status === 'late').length
      const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

      if (attendancePercentage < 75 && totalDays >= 5) { // Only warn if they have at least 5 days of records
        const studentUser = await User.findById(studentId)
        
        new Notification({
          recipient: studentId,
          title: 'Low Attendance Warning',
          message: `Your attendance is ${attendancePercentage}%, which is below the 75% requirement.`,
          type: 'attendance',
          category: 'warning'
        }).save()

        if (studentUser && studentUser.email) {
          await sendEmail({
            to: studentUser.email,
            subject: 'Attendance Warning',
            html: emailTemplates.attendanceWarning(studentUser.name, attendancePercentage)
          })
        }
      }
    }

    res.json({ message: 'Attendance marked successfully', attendance })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Request leave
export const requestLeave = async (req, res) => {
  try {
    const userId = req.user.id
    const { date, reason } = req.body

    const attendanceDate = new Date(date)
    attendanceDate.setHours(0, 0, 0, 0)

    const attendance = new Attendance({
      student: userId,
      date: attendanceDate,
      status: 'on_leave',
      leaveReason: reason,
      checkInTime: new Date()
    })

    await attendance.save()

    // Notify admin
    const admins = await User.find({ role: 'admin' })
    admins.forEach(admin => {
      new Notification({
        recipient: admin._id,
        sender: userId,
        title: 'Leave Request',
        message: `A student has requested leave for ${attendanceDate.toLocaleDateString()}`,
        type: 'attendance',
        category: 'info',
        relatedId: attendance._id,
        relatedModel: 'Attendance',
        actionUrl: '/admin/attendance'
      }).save()
    })

    res.status(201).json({ message: 'Leave request submitted', attendance })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
