import { useState, useEffect } from 'react'
import { Calendar, Clock, BarChart3, AlertCircle, CheckCircle } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card } from '../components'
import { attendanceAPI } from '../services'

export default function AttendanceTracker() {
  const [attendance, setAttendance] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [todayStatus, setTodayStatus] = useState(null)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaveData, setLeaveData] = useState({ date: '', reason: '' })

  useEffect(() => {
    fetchAttendance()
  }, [month, year])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await attendanceAPI.getStudentAttendance({ month, year })
      setAttendance(response.records || [])
      setSummary(response.summary)
      checkTodayStatus()
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }

  const checkTodayStatus = () => {
    const today = new Date()
    const todayRecord = attendance.find(record => {
      const recordDate = new Date(record.date)
      return recordDate.toDateString() === today.toDateString()
    })
    setTodayStatus(todayRecord)
  }

  const handleRequestLeave = async (e) => {
    e.preventDefault()
    try {
      await attendanceAPI.requestLeave(leaveData)
      setShowLeaveModal(false)
      setLeaveData({ date: '', reason: '' })
      fetchAttendance()
    } catch (err) {
      setError(err.message || 'Failed to request leave')
    }
  }



  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
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
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
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
          <Navbar title="Attendance" />
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
        <Navbar title="Attendance Tracker" />
        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Days</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{summary.totalDays || 0}</p>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
              <p className="text-green-600 dark:text-green-400 text-sm">Present</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-2">{summary.present || 0}</p>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-700">
              <p className="text-red-600 dark:text-red-400 text-sm">Absent</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-300 mt-2">{summary.absent || 0}</p>
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">Late</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-300 mt-2">{summary.late || 0}</p>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
              <p className="text-blue-600 dark:text-blue-400 text-sm">On Leave</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-300 mt-2">{summary.onLeave || 0}</p>
            </Card>
          </div>
        )}

        {/* Month/Year Filter */}
        <Card className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex gap-4 flex-wrap">
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
          </Card>

          {/* Request Leave Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition shadow-md"
            >
              <Calendar className="w-5 h-5" />
              Request Leave
            </button>
          </div>

          {/* Leave Modal */}
          {showLeaveModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Request Leave
                </h2>
                <form onSubmit={handleRequestLeave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Leave Date</label>
                    <input
                      type="date"
                      value={leaveData.date}
                      onChange={(e) => setLeaveData({ ...leaveData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Reason</label>
                    <textarea
                      value={leaveData.reason}
                      onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows="3"
                      required
                      placeholder="Why do you need leave?"
                    ></textarea>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex-1 transition"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLeaveModal(false)}
                      className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 flex-1 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Attendance History */}
          <Card className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Attendance History
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Check In</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Check Out</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Duration</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((record) => (
                      <tr key={record._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {record.checkInTime ? formatTime(record.checkInTime) : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {record.checkOutTime ? formatTime(record.checkOutTime) : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          {record.duration ? `${Math.floor(record.duration / 60)}h ${record.duration % 60}m` : '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
                            {getStatusIcon(record.status)}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('_', ' ')}
                          </span>
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