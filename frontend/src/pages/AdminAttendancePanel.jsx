import { useState, useEffect } from 'react'
import { Calendar, Users, TrendingUp, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Table, Modal } from '../components'
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

  const columns = [
    { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { 
      key: 'student', 
      label: 'Student', 
      render: (_, record) => (
        <div>
          <span>{record.student?.name || 'N/A'}</span>
          {record.student?.rollNumber && (
            <span className="block text-xs text-gray-500 mt-1">ID: {record.student.rollNumber}</span>
          )}
        </div>
      )
    },
    { 
      key: 'checkInTime', 
      label: 'Check In', 
      render: (val) => val ? new Date(val).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '-' 
    },
    { 
      key: 'checkOutTime', 
      label: 'Check Out', 
      render: (val) => val ? new Date(val).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '-' 
    },
    { key: 'duration', label: 'Duration', render: (val) => val ? `${Math.floor(val / 60)}h ${val % 60}m` : '-' },
    {
      key: 'status',
      label: 'Status',
      render: (status, record) => (
        <select
          value={status}
          onChange={(e) => handleStatusChange(record.student?._id, record.date, e.target.value)}
          className={`px-2 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(status)} border-0 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500`}
        >
          <option value="present" className="bg-white text-gray-900">Present</option>
          <option value="absent" className="bg-white text-gray-900">Absent</option>
          <option value="late" className="bg-white text-gray-900">Late</option>
          <option value="on_leave" className="bg-white text-gray-900">On Leave</option>
        </select>
      )
    }
  ]

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
              <Card className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Records</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1.5">{stats.totalRecords || 0}</p>
              </Card>
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800/30 shadow-sm text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Present</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1.5">{stats.present || 0}</p>
              </Card>
              <Card className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-800/30 shadow-sm text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                </div>
                <p className="text-rose-600 dark:text-rose-400 text-sm font-medium">Absent</p>
                <p className="text-3xl font-bold text-rose-700 dark:text-rose-300 mt-1.5">{stats.absent || 0}</p>
              </Card>
              <Card className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-800/30 shadow-sm text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">Late</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 mt-1.5">{stats.late || 0}</p>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800/30 shadow-sm text-center">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">On Leave</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1.5">{stats.onLeave || 0}</p>
              </Card>
            </div>
          )}

          {/* Controls */}
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
            <div className="ml-auto flex gap-2">
              <Button
                onClick={() => setShowMarkModal(true)}
                className="flex items-center gap-2 rounded-xl px-5"
              >
                <Plus className="w-4 h-4" />
                Mark Attendance
              </Button>
            </div>
          </Card>

          {/* Mark Attendance Modal */}
          <Modal
            isOpen={showMarkModal}
            title="Mark Attendance"
            onClose={() => setShowMarkModal(false)}
            showCloseButton={false}
          >
            <form onSubmit={handleMarkAttendance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Student ID</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Mark
                </Button>
                <Button variant="secondary" onClick={() => setShowMarkModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </Modal>

          {/* Attendance Table */}
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendance Records</h2>
            </div>
            <Table columns={columns} data={attendance} />
          </Card>
        </main>
      </div>
    </div>
  )
}
