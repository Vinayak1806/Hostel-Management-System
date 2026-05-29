import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel-management'
    await mongoose.connect(mongoURI)
    console.log('✓ MongoDB connected successfully')
    return true
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

export default connectDB
