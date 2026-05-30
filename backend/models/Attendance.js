import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    checkInTime: {
      type: Date,
      required: true
    },
    checkOutTime: {
      type: Date
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'on_leave'],
      default: 'present'
    },
    leaveReason: {
      type: String,
      sparse: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String
    },
    duration: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

// Index for efficient queries
attendanceSchema.index({ student: 1, date: 1 })
attendanceSchema.index({ date: 1 })

export default mongoose.model('Attendance', attendanceSchema)
