import Complaint from '../models/Complaint.js'

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
