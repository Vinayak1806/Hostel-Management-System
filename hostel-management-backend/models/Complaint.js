import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: String,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['maintenance', 'cleanliness', 'food', 'water', 'other'],
      default: 'maintenance'
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    resolution: String,
    resolvedDate: {
      type: Date,
      sparse: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Complaint', complaintSchema)
