import Admission from '../models/Admission.js'
import User from '../models/User.js'
import Room from '../models/Room.js'
import Payment from '../models/Payment.js'
import Notification from '../models/Notification.js'

// Student submits admission request
export const submitAdmissionRequest = async (req, res) => {
  try {
    const { course, year, semester, address, parentPhone, collegeName, fatherName, motherName, bloodGroup, rollNumber } = req.body
    const studentId = req.user.id

    // Check if student already has a pending or approved admission
    const existingAdmission = await Admission.findOne({
      student: studentId,
      status: { $in: ['pending', 'approved'] }
    })

    if (existingAdmission) {
      return res.status(400).json({
        message: existingAdmission.status === 'pending' 
          ? 'You already have a pending admission request' 
          : 'You are already admitted'
      })
    }

    // Get student details
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    // Create admission request
    const admission = await Admission.create({
      student: studentId,
      rollNumber,
      course,
      year,
      semester,
      address,
      collegeName,
      fatherName,
      motherName,
      bloodGroup,
      phone: student.phone,
      parentPhone
    })

    res.status(201).json({
      message: 'Admission request submitted successfully',
      admission
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: Get all pending admission requests
export const getPendingAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({ status: 'pending' })
      .populate('student', 'name email phone')
      .sort({ createdAt: -1 })

    res.json(admissions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: Approve admission and assign room
export const approveAdmission = async (req, res) => {
  try {
    const { admissionId, roomId } = req.body
    const adminId = req.user.id

    // Find admission
    const admission = await Admission.findById(admissionId)
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' })
    }

    if (admission.status !== 'pending') {
      return res.status(400).json({ message: 'Admission already processed' })
    }

    // Find room
    const room = await Room.findById(roomId)
    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    // Check if room has space
    if (!room.hasSpace()) {
      return res.status(400).json({ message: 'Room is full' })
    }

    // Update room occupancy
    room.currentOccupancy += 1
    room.allocatedStudents.push(admission.student)
    room.updateStatus()
    await room.save()

    // Update student with room number, academic info, and mark as active
    const student = await User.findByIdAndUpdate(
      admission.student,
      { 
        roomNumber: room.roomNumber, 
        isActive: true,
        rollNumber: admission.rollNumber,
        semester: admission.semester,
        course: admission.course
      },
      { new: true }
    )

    // Update admission
    admission.status = 'approved'
    admission.approvedDate = new Date()
    admission.approvedBy = adminId
    admission.roomAssigned = room.roomNumber
    await admission.save()

    // Auto-generate fee record
    if (!admission.feeGenerated) {
      const today = new Date()
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())

      await Payment.create({
        student: admission.student,
        amount: 5000,
        dueDate: nextMonth,
        status: 'pending',
        description: `Hostel Fee - ${today.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        paymentMethod: 'razorpay'
      })

      admission.feeGenerated = true
      await admission.save()
    }

    // Create notification for student
    await new Notification({
      recipient: admission.student,
      sender: adminId,
      title: 'Hostel Admission Approved! 🎉',
      message: `Congratulations! Your hostel admission request has been approved. Room ${room.roomNumber} has been allocated to you.`,
      type: 'admission',
      category: 'success',
      relatedId: admission._id,
      relatedModel: 'Admission',
      actionUrl: '/admission'
    }).save()

    res.json({
      message: 'Admission approved and room allocated successfully',
      admission,
      roomNumber: room.roomNumber
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: Reject admission
export const rejectAdmission = async (req, res) => {
  try {
    const { admissionId, reason } = req.body

    const admission = await Admission.findById(admissionId)
    if (!admission) {
      return res.status(404).json({ message: 'Admission not found' })
    }

    if (admission.status !== 'pending') {
      return res.status(400).json({ message: 'Admission already processed' })
    }

    admission.status = 'rejected'
    admission.rejectionReason = reason
    admission.rejectedDate = new Date()
    await admission.save()

    // Create notification for student
    await new Notification({
      recipient: admission.student,
      title: 'Hostel Admission Rejected ❌',
      message: `Your hostel admission request was rejected. Reason: ${reason}`,
      type: 'admission',
      category: 'error',
      relatedId: admission._id,
      relatedModel: 'Admission',
      actionUrl: '/admission'
    }).save()

    res.json({
      message: 'Admission rejected successfully',
      admission
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Student: Get their admission status
export const getMyAdmissionStatus = async (req, res) => {
  try {
    const studentId = req.user.id

    const admission = await Admission.findOne({ student: studentId })
      .sort({ createdAt: -1 })
      .populate('approvedBy', 'name email')

    if (!admission) {
      return res.json({ status: 'not_applied', admission: null })
    }

    res.json({
      status: admission.status,
      admission
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Admin: Get all admissions (approved, rejected, pending)
export const getAllAdmissions = async (req, res) => {
  try {
    const { status } = req.query

    let query = {}
    if (status) {
      query.status = status
    }

    const admissions = await Admission.find(query)
      .populate('student', 'name email phone rollNumber')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })

    res.json(admissions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get admission statistics
export const getAdmissionStats = async (req, res) => {
  try {
    const totalRequests = await Admission.countDocuments()
    const pendingRequests = await Admission.countDocuments({ status: 'pending' })
    const approvedRequests = await Admission.countDocuments({ status: 'approved' })
    const rejectedRequests = await Admission.countDocuments({ status: 'rejected' })

    res.json({
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      approvalRate: totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
