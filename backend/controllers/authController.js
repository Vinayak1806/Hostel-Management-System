import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../utils/emailService.js'

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
    { expiresIn: '7d' }
  )
}

export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'student' } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    user = new User({
      name,
      email,
      phone,
      password,
      role
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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(404).json({ message: 'User with this email not found' })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set OTP and expiry (15 mins)
    user.resetOTP = otp
    user.resetOTPExpiry = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()

    const subject = 'Hostel Hub - Password Reset OTP'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
        <h2 style="color: #3b82f6; text-align: center;">Hostel Hub Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Your One Time Password (OTP) is:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="margin: 0; color: #1f2937; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This OTP is valid for 15 minutes. If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>Hostel Hub Team</p>
      </div>
    `
    
    await sendEmail({ to: user.email, subject, html })
    
    res.json({ message: 'OTP sent to your email' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    
    const user = await User.findOne({ 
      email,
      resetOTP: otp,
      resetOTPExpiry: { $gt: new Date() }
    })
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    user.password = newPassword
    user.resetOTP = undefined
    user.resetOTPExpiry = undefined
    await user.save()

    res.json({ message: 'Password reset successful' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
