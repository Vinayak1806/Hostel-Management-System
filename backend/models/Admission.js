import mongoose from 'mongoose'

const admissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rollNumber: {
      type: String,
      required: true
    },
    course: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    address: {
      type: String,
      required: true
    },
    collegeName: {
      type: String
    },
    fatherName: {
      type: String
    },
    motherName: {
      type: String
    },
    bloodGroup: {
      type: String
    },
    phone: {
      type: String,
      required: true
    },
    parentPhone: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      sparse: true
    },
    approvedDate: {
      type: Date,
      sparse: true
    },
    rejectedDate: {
      type: Date,
      sparse: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      sparse: true
    },
    roomAssigned: {
      type: String,
      sparse: true
    },
    feeGenerated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default mongoose.model('Admission', admissionSchema)
