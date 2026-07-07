import { useState, useEffect } from 'react'
import { Bell, Send, Mail, Zap, Plus, Users } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Alert, Button } from '../components'
import { notificationAPI, studentAPI } from '../services'

export default function AdminNotificationPanel() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [audience, setAudience] = useState('all') // 'all' or 'specific'
  const [formData, setFormData] = useState({
    recipient: '',
    title: '',
    message: '',
    type: 'announcement'
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await studentAPI.getAll()
      // Fix: API returns array directly, not an object with a students property
      setStudents(Array.isArray(response) ? response : (response.students || []))
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotification = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      if (students.length === 0) {
        setError('No students available to send notifications to.')
        return
      }

      const allStudentIds = students.map(s => s._id)
      
      await notificationAPI.sendBulkNotifications({
        recipients: allStudentIds,
        title: formData.title,
        message: formData.message,
        type: formData.type,
        category: formData.type === 'alert' ? 'error' : 'info'
      })
      
      setSuccess(`Notification successfully sent to all ${students.length} students!`)
      setFormData({
        title: '',
        message: '',
        type: 'announcement'
      })
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Failed to send notification')
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
        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          
          <div className="max-w-3xl mx-auto">
            <Card className="rounded-2xl p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System-wide Notification</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Send a message to all registered students</p>
                </div>
              </div>

              {error && (
                <Alert type="error" message={error} onClose={() => setError('')} />
              )}
              
              {success && (
                <Alert type="success" message={success} onClose={() => setSuccess('')} />
              )}

              <form onSubmit={handleSendNotification} className="space-y-6 mt-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-1">
                     <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notification Type</label>
                     <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    >
                      <option value="announcement">Announcement</option>
                      <option value="payment">Payment</option>
                      <option value="attendance">Attendance</option>
                      <option value="alert">Alert</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Important Update regarding Hostel Fees"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white min-h-[150px] resize-y focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Notification
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}