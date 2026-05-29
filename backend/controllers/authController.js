import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
    { expiresIn: '7d' }
  )
}

export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'student', rollNumber, semester } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    user = new User({
      name,
      email,
      phone,
      password,
      role,
      rollNumber: role === 'student' ? rollNumber : undefined,
      semester: role === 'student' ? semester : undefined
    })

    await user.save()

    const token = generateToken(user)
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user)
    const userResponse = user.toObject()
    delete userResponse.password

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const logout = async (req, res) => {
  res.json({ message: 'Logout successful' })
}

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const userResponse = user.toObject()
    delete userResponse.password
    res.json(userResponse)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
