import mongoose from 'mongoose'

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['general', 'event', 'maintenance', 'rules'],
      default: 'general'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Notice', noticeSchema)
