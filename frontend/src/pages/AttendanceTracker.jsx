import { useState, useEffect } from 'react'
import { Calendar, Clock, BarChart3, AlertCircle, CheckCircle } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Table, Modal, Button, Badge } from '../components'
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
        return <CheckCircle className="w-4 h-4" />
      case 'absent':
        return <AlertCircle className="w-4 h-4" />
      case 'late':
        return <Clock className="w-4 h-4" />
      case 'on_leave':
        return <Calendar className="w-4 h-4" />
      default:
        return null
    }
  }

  const columns = [
    { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'checkInTime', label: 'Check In', render: (val) => val ? formatTime(val) : '-' },
    { key: 'checkOutTime', label: 'Check Out', render: (val) => val ? formatTime(val) : '-' },
    { key: 'duration', label: 'Duration', render: (val) => val ? `${Math.floor(val / 60)}h ${val % 60}m` : '-' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (status) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          {status.replace('_', ' ')}
        </span>
      )
    }
  ]

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
            <Card className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Days</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1.5">{summary.totalDays || 0}</p>
            </Card>
            <Card className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800/30 shadow-sm text-center">
              <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Present</p>
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1.5">{summary.present || 0}</p>
            </Card>
            <Card className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-800/30 shadow-sm text-center">
              <p className="text-rose-600 dark:text-rose-400 text-sm font-medium">Absent</p>
              <p className="text-3xl font-bold text-rose-700 dark:text-rose-300 mt-1.5">{summary.absent || 0}</p>
            </Card>
            <Card className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-800/30 shadow-sm text-center">
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">Late</p>
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 mt-1.5">{summary.late || 0}</p>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800/30 shadow-sm text-center">
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">On Leave</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1.5">{summary.onLeave || 0}</p>
            </Card>
          </div>
        )}

        {/* Month/Year Filter */}
        <Card className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex gap-4 flex-wrap">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
          <div className="ml-auto">
            <Button
              onClick={() => setShowLeaveModal(true)}
              className="flex items-center gap-2 rounded-xl px-5"
            >
              <Calendar className="w-4 h-4" />
              Request Leave
            </Button>
          </div>
        </Card>

        {/* Leave Modal */}
        <Modal
          isOpen={showLeaveModal}
          title="Request Leave"
          onClose={() => setShowLeaveModal(false)}
          showCloseButton={false}
        >
          <form onSubmit={handleRequestLeave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Leave Date</label>
              <input
                type="date"
                value={leaveData.date}
                onChange={(e) => setLeaveData({ ...leaveData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Reason</label>
              <textarea
                value={leaveData.reason}
                onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                rows="3"
                required
                placeholder="Why do you need leave?"
              ></textarea>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Submit Request
              </Button>
              <Button variant="secondary" onClick={() => setShowLeaveModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

          {/* Attendance History */}
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Attendance History
              </h2>
            </div>
            <Table columns={columns} data={attendance} />
          </Card>
        </main>
      </div>
    </div>
  )
}