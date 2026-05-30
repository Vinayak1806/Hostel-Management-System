import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info, Trash2, Eye, EyeOff } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card } from '../components'
import { notificationAPI } from '../services'

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchNotifications()
    fetchStats()
  }, [filter, page])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const unreadOnly = filter === 'unread'
      const response = await notificationAPI.getNotifications({
        page,
        limit: 10,
        unreadOnly
      })
      setNotifications(response.notifications || [])
      setUnreadCount(response.unreadCount || 0)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await notificationAPI.getStats()
      setStats(response)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId)
      fetchNotifications()
      fetchStats()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      fetchNotifications()
      fetchStats()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId)
      fetchNotifications()
      fetchStats()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleClearAll = async () => {
    if (window.confirm('Clear all notifications?')) {
      try {
        await notificationAPI.clearAll()
        fetchNotifications()
        fetchStats()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      case 'error':
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
      case 'error':
      case 'alert':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diff = now - notifDate
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return notifDate.toLocaleDateString()
  }

  if (loading && notifications.length === 0) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <Navbar title="Notifications" />
          <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Notifications" />
        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
              </Card>
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">Unread</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unread || 0}</p>
              </Card>
              <Card className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">Success</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.byCategory?.success || 0}</p>
              </Card>
              <Card className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-700">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.byCategory?.alert || 0}</p>
              </Card>
            </div>
          )}

          {/* Controls */}
          <Card className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
            <button
              onClick={() => { setFilter('all'); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setFilter('unread'); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Unread ({unreadCount})
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 rounded-lg font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition"
              >
                Mark All as Read
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-lg font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition ml-auto"
            >
              Clear All
            </button>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                <Bell className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No notifications</p>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification._id}
                  className={`rounded-lg border p-4 transition ${
                    notification.isRead 
                      ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                      : `${getCategoryColor(notification.category)} border`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">
                      {getCategoryIcon(notification.category)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{notification.message}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}