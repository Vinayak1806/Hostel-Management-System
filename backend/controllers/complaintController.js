import Complaint from '../models/Complaint.js'
import Notification from '../models/Notification.js'
import { sendEmail, emailTemplates } from '../utils/emailService.js'

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('student', 'name email')
    res.json(complaints)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('student', 'name email')
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    res.json(complaint)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body

    const complaint = new Complaint({
      student: req.user.id,
      title,
      description,
      category,
      priority: priority || 'medium',
      status: 'pending'
    })

    await complaint.save()
    const populatedComplaint = await complaint.populate('student', 'name')

    const complaintResponse = complaint.toObject()
    complaintResponse.studentName = populatedComplaint.student.name

    res.status(201).json(complaintResponse)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolution } = req.body

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        resolution: resolution || undefined,
        resolvedDate: status === 'resolved' ? new Date() : undefined
      },
      { new: true }
    ).populate('student', 'name email')

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }

    // Send system notification
    new Notification({
      recipient: complaint.student._id,
      title: 'Complaint Updated',
      message: `Your complaint "${complaint.title}" is now ${status}.`,
      type: 'complaint',
      category: status === 'resolved' ? 'success' : 'info',
      relatedId: complaint._id,
      relatedModel: 'Complaint',
      actionUrl: '/dashboard/complaints'
    }).save()

    // Send email
    if (status === 'resolved' && complaint.student.email) {
      await sendEmail({
        to: complaint.student.email,
        subject: 'Complaint Resolved',
        html: emailTemplates.complaintUpdate(complaint.student.name, complaint.title, status)
      })
    }

    res.json(complaint)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id)
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    res.json({ message: 'Complaint deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user.id })
    res.json(complaints)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
