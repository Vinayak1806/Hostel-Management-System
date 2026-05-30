import Notification from '../models/Notification.js'

// Get notifications for user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 20, unreadOnly = false } = req.query

    let query = { recipient: userId }
    if (unreadOnly === 'true') {
      query.isRead = false
    }

    const skip = (page - 1) * limit

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    })

    res.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    )

    res.json({ message: 'Notification marked as read', notification })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    )

    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params

    await Notification.findByIdAndDelete(notificationId)

    res.json({ message: 'Notification deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Clear all notifications for user
export const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id

    await Notification.deleteMany({ recipient: userId })

    res.json({ message: 'All notifications cleared' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get notification statistics
export const getNotificationStats = async (req, res) => {
  try {
    const userId = req.user.id

    const stats = {
      total: await Notification.countDocuments({ recipient: userId }),
      unread: await Notification.countDocuments({ recipient: userId, isRead: false }),
      byType: {},
      byCategory: {}
    }

    const types = ['payment', 'admission', 'attendance', 'announcement', 'complaint', 'maintenance', 'general']
    for (const type of types) {
      stats.byType[type] = await Notification.countDocuments({
        recipient: userId,
        type
      })
    }

    const categories = ['alert', 'info', 'success', 'warning', 'error']
    for (const category of categories) {
      stats.byCategory[category] = await Notification.countDocuments({
        recipient: userId,
        category
      })
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Send notification (Admin/System)
export const sendNotification = async (req, res) => {
  try {
    const { recipient, title, message, type, category, actionUrl } = req.body
    const { userId } = req.params // Admin/System user

    const notification = new Notification({
      recipient,
      sender: userId,
      title,
      message,
      type,
      category,
      actionUrl
    })

    await notification.save()

    res.status(201).json({ message: 'Notification sent successfully', notification })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Send bulk notifications
export const sendBulkNotifications = async (req, res) => {
  try {
    const { recipients, title, message, type, category } = req.body
    const { userId } = req.params

    const notifications = recipients.map(recipientId => ({
      recipient: recipientId,
      sender: userId,
      title,
      message,
      type,
      category
    }))

    await Notification.insertMany(notifications)

    res.status(201).json({
      message: `${notifications.length} notifications sent successfully`,
      count: notifications.length
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Import Notification model at the top of the file if not already imported
import User from '../models/User.js'
