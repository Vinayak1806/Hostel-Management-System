import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true
    },
    floor: {
      type: Number,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0
    },
    allocatedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance'],
      default: 'available'
    }
  },
  { timestamps: true }
)

export default mongoose.model('Room', roomSchema)
