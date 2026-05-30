import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Attendance from './models/Attendance.js'
import User from './models/User.js'

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB. Cleaning up orphaned attendance records...')
    
    const records = await Attendance.find()
    let deletedCount = 0
    
    for (const record of records) {
      const userExists = await User.findById(record.student)
      if (!userExists) {
        await Attendance.findByIdAndDelete(record._id)
        deletedCount++
      }
    }
    
    console.log(`Successfully deleted ${deletedCount} orphaned attendance records!`)
    process.exit(0)
  })
  .catch(console.error)
