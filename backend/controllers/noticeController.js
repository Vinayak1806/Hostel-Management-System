import Notice from '../models/Notice.js'
import User from '../models/User.js'
import { sendEmail } from '../utils/emailService.js'

export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
    res.json(notices)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createNotice = async (req, res) => {
  try {
    const { title, content, category } = req.body

    const notice = new Notice({
      title,
      content,
      category,
      postedBy: req.user.id,
      isActive: true
    })

    await notice.save()
    await notice.populate('postedBy', 'name email')

    // Send email to all active students
    const activeStudents = await User.find({ role: 'student', isActive: true }).select('email name')
    
    const subject = `New Hostel Notice: ${title}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb;">New Notice Posted</h2>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">${title}</h3>
          <p style="white-space: pre-wrap; color: #4b5563;">${content}</p>
        </div>
        <p>Please log in to your student dashboard for more details.</p>
        <p>Best regards,<br>Hostel Administration</p>
      </div>
    `
    
    // Send emails in background to not block the response
    Promise.all(
      activeStudents.map(student => 
        sendEmail({ to: student.email, subject, html })
      )
    ).catch(console.error)

    res.status(201).json(notice)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' })
    }

    res.json({ message: 'Notice deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
