import mongoose from 'mongoose'
import Attendance from './backend/models/Attendance.js'
import User from './backend/models/User.js'

mongoose.connect('mongodb://localhost:27017/hostel-management')
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
