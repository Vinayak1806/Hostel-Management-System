import User from '../models/User.js'

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password')
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password')
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, rollNumber, semester } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    user = new User({
      name,
      email,
      phone,
      rollNumber,
      semester,
      role: 'student',
      password: Math.random().toString(36).slice(-8)
    })

    await user.save()
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json(userResponse)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateStudent = async (req, res) => {
  try {
    const { name, phone, semester } = req.body
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, semester },
      { new: true }
    ).select('-password')

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json({ message: 'Student deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
