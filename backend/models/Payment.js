import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: 'Hostel Fee'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'stripe', 'bank_transfer', 'cash'],
      default: 'razorpay'
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    razorpayOrderId: {
      type: String,
      sparse: true
    },
    razorpayPaymentId: {
      type: String,
      sparse: true
    },
    paidAt: {
      type: Date
    },
    dueDate: {
      type: Date
    },
    semester: {
      type: Number,
      min: 1,
      max: 8
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
)

export default mongoose.model('Payment', paymentSchema)
