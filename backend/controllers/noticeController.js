import Notice from '../models/Notice.js'

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
