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
      enum: ['available', 'almost_full', 'full', 'maintenance'],
      default: 'available'
    }
  },
  { timestamps: true }
)

// Method to calculate and update room status based on occupancy
roomSchema.methods.updateStatus = function () {
  if (this.currentOccupancy === 0) {
    this.status = 'available'
  } else if (this.currentOccupancy >= this.capacity) {
    this.status = 'full'
  } else if (this.currentOccupancy >= this.capacity * 0.75) {
    this.status = 'almost_full'
  } else {
    this.status = 'available'
  }
}

// Get occupancy percentage
roomSchema.methods.getOccupancyPercentage = function () {
  return Math.round((this.currentOccupancy / this.capacity) * 100)
}

// Check if room is full
roomSchema.methods.isFull = function () {
  return this.currentOccupancy >= this.capacity
}

// Check if room has space
roomSchema.methods.hasSpace = function () {
  return this.currentOccupancy < this.capacity
}

export default mongoose.model('Room', roomSchema)

