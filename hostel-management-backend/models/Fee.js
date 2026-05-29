import mongoose from 'mongoose'

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentName: String,
    studentRoll: String,
    amount: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    paidDate: {
      type: Date,
      sparse: true
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid'
    },
    description: String
  },
  { timestamps: true }
)

export default mongoose.model('Fee', feeSchema)
