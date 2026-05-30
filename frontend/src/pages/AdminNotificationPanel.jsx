import { useState, useEffect } from 'react'
import { Bell, Send, Mail, Zap, Plus, Users } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card } from '../components'
import { notificationAPI, studentAPI } from '../services'

export default function AdminNotificationPanel() {
  const [notifications, setNotifications] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSendModal, setShowSendModal] = useState(false)
  const [isBulk, setIsBulk] = useState(false)
  const [formData, setFormData] = useState({
    recipient: '',
    recipients: [],
    title: '',
    message: '',
    type: 'announcement',
    category: 'info'
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await studentAPI.getAll()
      setStudents(response.students || [])
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotification = async (e) => {
    e.preventDefault()
    try {
      if (isBulk) {
        await notificationAPI.sendBulkNotifications({
          recipients: formData.recipients,
          title: formData.title,
          message: formData.message,
          type: formData.type,
          category: formData.category
        })
      } else {
        await notificationAPI.sendNotification({
          recipient: formData.recipient,
          title: formData.title,
          message: formData.message,
          type: formData.type,
          category: formData.category
        })
      }
      setShowSendModal(false)
      setFormData({
        recipient: '',
        recipients: [],
        title: '',
        message: '',
        type: 'announcement',
        category: 'info'
      })
      setIsBulk(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSelectRecipient = (studentId) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.includes(studentId)
        ? prev.recipients.filter(id => id !== studentId)
        : [...prev.recipients, studentId]
    }))
  }

  const handleSelectAll = () => {
    if (formData.recipients.length === students.length) {
      setFormData(prev => ({ ...prev, recipients: [] }))
    } else {
      setFormData(prev => ({
        ...prev,
        recipients: students.map(s => s._id)
      }))
    }
  }

  const handleApplyTemplate = (template) => {
    setIsBulk(true)
    setFormData(prev => ({
      ...prev,
      title: template.title,
      message: template.message,
      type: template.type,
      category: template.category,
      recipients: students.map(s => s._id) // Default to all students
    }))
    setShowSendModal(true)
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'error':
      case 'alert':
        return 'text-red-600 dark:text-red-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'info':
      default:
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment':
        return '💳'
      case 'attendance':
        return '📋'
      case 'announcement':
        return '📢'
      case 'alert':
        return '⚠️'
      default:
        return '📨'
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <Navbar title="Admin - Notifications" />
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
        <Navbar title="Admin - Notifications" />
        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Quick Send Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-lg p-6 transition cursor-pointer border-0"
              onClick={() => {
                setIsBulk(false)
                setShowSendModal(true)
              }}
            >
              <Mail className="w-8 h-8 mb-2" />
              <p className="font-semibold">Send Individual</p>
              <p className="text-sm text-blue-100">To single student</p>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 hover:from-green-600 hover:to-green-700 dark:hover:from-green-600 dark:hover:to-green-700 text-white rounded-lg p-6 transition cursor-pointer border-0"
              onClick={() => {
                setIsBulk(true)
                setShowSendModal(true)
              }}
            >
              <Users className="w-8 h-8 mb-2" />
              <p className="font-semibold">Send Bulk</p>
              <p className="text-sm text-green-100">To multiple students</p>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 hover:from-purple-600 hover:to-purple-700 dark:hover:from-purple-600 dark:hover:to-purple-700 text-white rounded-lg p-6 transition cursor-pointer border-0"
              onClick={() => {
                setIsBulk(true)
                setFormData(prev => ({
                  ...prev,
                  recipients: students.map(s => s._id)
                }))
                setShowSendModal(true)
              }}
            >
              <Zap className="w-8 h-8 mb-2" />
              <p className="font-semibold">Send System-wide</p>
              <p className="text-sm text-purple-100">To all students</p>
            </Card>
          </div>

          {/* Send Modal */}
          {showSendModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-2xl max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  {isBulk ? 'Send Bulk Notification' : 'Send Individual Notification'}
                </h2>
                <form onSubmit={handleSendNotification} className="space-y-4">
                  {!isBulk && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Recipient</label>
                      <select
                        value={formData.recipient}
                        onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Select student</option>
                        {students.map(student => (
                          <option key={student._id} value={student._id}>
                            {student.name} ({student.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {isBulk && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">Recipients</label>
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {formData.recipients.length === students.length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2 bg-white dark:bg-gray-700">
                        {students.map(student => (
                          <label key={student._id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.recipients.includes(student._id)}
                              onChange={() => handleSelectRecipient(student._id)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-900 dark:text-gray-300">{student.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-24"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="announcement">Announcement</option>
                        <option value="payment">Payment</option>
                        <option value="attendance">Attendance</option>
                        <option value="alert">Alert</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="alert">Alert</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 flex-1 transition"
                    >
                      <Send className="w-4 h-4" />
                      Send {isBulk && `to ${formData.recipients.length} recipients`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSendModal(false)}
                      className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 flex-1 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Templates Section */}
          <Card className="rounded-lg p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => handleApplyTemplate({
                  title: 'Important Announcement',
                  message: 'Please review the latest updates on the notice board.',
                  type: 'announcement',
                  category: 'info'
                })}
                className="text-left p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800"
              >
                <p className="font-semibold text-gray-900 dark:text-white">📢 Announcement</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Send important announcements to students</p>
              </button>
              <button 
                onClick={() => handleApplyTemplate({
                  title: 'Payment Reminder',
                  message: 'This is a gentle reminder that your fee payment is due soon. Please clear your dues.',
                  type: 'payment',
                  category: 'warning'
                })}
                className="text-left p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800"
              >
                <p className="font-semibold text-gray-900 dark:text-white">💳 Payment Reminder</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Remind students about upcoming fees</p>
              </button>
              <button 
                onClick={() => handleApplyTemplate({
                  title: 'Attendance Alert',
                  message: 'Your attendance is falling below the required threshold. Please ensure regular attendance.',
                  type: 'attendance',
                  category: 'alert'
                })}
                className="text-left p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800"
              >
                <p className="font-semibold text-gray-900 dark:text-white">📋 Attendance Alert</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Notify about low attendance records</p>
              </button>
              <button 
                onClick={() => handleApplyTemplate({
                  title: 'System Alert',
                  message: 'The hostel management system will undergo maintenance tonight at 12:00 AM.',
                  type: 'alert',
                  category: 'error'
                })}
                className="text-left p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition bg-white dark:bg-gray-800"
              >
                <p className="font-semibold text-gray-900 dark:text-white">⚠️ System Alert</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Send urgent system notifications</p>
              </button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}