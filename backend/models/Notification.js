import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['payment', 'admission', 'attendance', 'announcement', 'complaint', 'maintenance', 'general'],
      default: 'general'
    },
    category: {
      type: String,
      enum: ['alert', 'info', 'success', 'warning', 'error'],
      default: 'info'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      sparse: true
    },
    relatedModel: {
      type: String,
      enum: ['Payment', 'Admission', 'Attendance', 'Complaint', 'Announcement'],
      sparse: true
    },
    actionUrl: {
      type: String,
      sparse: true
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
)

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1 })
notificationSchema.index({ createdAt: -1 })
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model('Notification', notificationSchema)
