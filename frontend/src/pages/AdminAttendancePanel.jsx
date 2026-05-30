import { useState, useEffect } from 'react'
import { Calendar, Users, TrendingUp, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card } from '../components'
import { attendanceAPI } from '../services'

export default function AdminAttendancePanel() {
  const [attendance, setAttendance] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [showMarkModal, setShowMarkModal] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present'
  })

  useEffect(() => {
    fetchAttendance()
  }, [month, year])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await attendanceAPI.getAllAttendance({ month, year })
      setAttendance(response.records || [])
      setStats(response.summary)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = async (e) => {
    e.preventDefault()
    try {
      const userStr = localStorage.getItem('user')
      const adminUser = JSON.parse(userStr)
      await attendanceAPI.markAttendance(adminUser._id, {
        student: formData.studentId,
        date: formData.date,
        status: formData.status
      })
      setShowMarkModal(false)
      setFormData({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present'
      })
      fetchAttendance()
    } catch (err) {
      setError(err.message || 'Failed to mark attendance')
    }
  }

  const handleStatusChange = async (studentId, date, newStatus) => {
    try {
      const userStr = localStorage.getItem('user')
      const adminUser = JSON.parse(userStr)
      await attendanceAPI.markAttendance(adminUser._id, {
        student: studentId,
        date: date,
        status: newStatus
      })
      fetchAttendance()
    } catch (err) {
      setError(err.message || 'Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'on_leave':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      case 'absent':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      case 'on_leave':
        return <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <Navbar title="Admin - Attendance" />
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
        <Navbar title="Admin - Attendance" />
        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRecords || 0}</p>
              </Card>
              <Card className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.present || 0}</p>
              </Card>
              <Card className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.absent || 0}</p>
              </Card>
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Late</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.late || 0}</p>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">On Leave</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.onLeave || 0}</p>
              </Card>
            </div>
          )}

          {/* Controls */}
          <Card className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex gap-4 flex-wrap">
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
              {new Date(2024, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
            <button
              onClick={() => setShowMarkModal(true)}
              className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Mark Attendance
            </button>
          </Card>

          {/* Mark Attendance Modal */}
          {showMarkModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Mark Attendance</h2>
                <form onSubmit={handleMarkAttendance} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Student ID</label>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg flex-1 transition"
                    >
                      Mark
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMarkModal(false)}
                      className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 flex-1 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Attendance Table */}
          <Card className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Check In</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Check Out</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Duration</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((record) => (
                      <tr key={record._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{record.student?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {record.checkInTime
                            ? new Date(record.checkInTime).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {record.checkOutTime
                            ? new Date(record.checkOutTime).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {record.duration ? `${Math.floor(record.duration / 60)}h ${record.duration % 60}m` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={record.status}
                            onChange={(e) => handleStatusChange(record.student?._id, record.date, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)} border-0 outline-none cursor-pointer`}
                          >
                            <option value="present" className="bg-white text-gray-900">Present</option>
                            <option value="absent" className="bg-white text-gray-900">Absent</option>
                            <option value="late" className="bg-white text-gray-900">Late</option>
                            <option value="on_leave" className="bg-white text-gray-900">On Leave</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
