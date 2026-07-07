import User from '../models/User.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, permanentAddress, parentPhone, rollNumber, semester, course, collegeName } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name,
          phone,
          permanentAddress,
          parentPhone,
          rollNumber,
          semester,
          course,
          collegeName
        }
      },
      { new: true, runValidators: true }
    ).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'Profile updated successfully', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const uploadPhoto = async (req, res) => {
  try {
    const { profilePhoto } = req.body
    
    if (!profilePhoto) {
      return res.status(400).json({ message: 'Profile photo is required' })
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profilePhoto } },
      { new: true }
    ).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'Photo uploaded successfully', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
