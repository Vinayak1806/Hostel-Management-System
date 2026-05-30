import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Alert } from '../components'
import { useAuth } from '../context/AuthContext'
import { User, Bed, DollarSign, FileText, Bell, AlertCircle, Clock, CalendarCheck } from 'lucide-react'
import { paymentAPI, noticeAPI, attendanceAPI } from '../services'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [feeStatus, setFeeStatus] = useState({ amount: 0, paid: 0, due: 0, dueDate: '-' })
  const [attendance, setAttendance] = useState(null)
  const [recentNotices, setRecentNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [paymentRes, noticeRes, attendanceRes] = await Promise.all([
          paymentAPI.getStudentPayments().catch(() => ({ summary: { totalAmount: 0, paidAmount: 0, pendingAmount: 0 }, payments: [] })),
          noticeAPI.getAll().catch(() => ([])),
          attendanceAPI.getStudentAttendance().catch(() => null)
        ])
        
        const summary = paymentRes.summary || { totalAmount: 0, paidAmount: 0, pendingAmount: 0 }
        const payments = paymentRes.payments || []
        
        const pendingPayments = payments.filter(p => p.status === 'pending').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        const nextDueDate = pendingPayments.length > 0 ? new Date(pendingPayments[0].dueDate).toLocaleDateString() : '-'

        setFeeStatus({
          amount: summary.totalAmount,
          paid: summary.paidAmount,
          due: summary.pendingAmount,
          dueDate: nextDueDate
        })
        
        if (Array.isArray(noticeRes)) {
            setRecentNotices(noticeRes.slice(0, 3).map(n => ({
                id: n._id,
                title: n.title,
                date: new Date(n.createdAt).toLocaleDateString()
            })))
        }

        if (attendanceRes && attendanceRes.summary) {
          const { totalDays, present, late } = attendanceRes.summary
          const attendancePercentage = totalDays > 0 ? Math.round(((present + late) / totalDays) * 100) : 0
          setAttendance(attendancePercentage)
        } else {
          setAttendance(0)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const roomNumber = user?.roomNumber || null
  const occupancyPercentage = roomNumber ? 100 : 0

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="My Dashboard" />

        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {loading && (
             <div className="flex items-center justify-center h-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
          )}
          {/* Welcome Banner */}
          <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white rounded-xl p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                <p className="text-blue-100">Here's an overview of your hostel status and important updates</p>
              </div>
              <div className="text-5xl opacity-20">🏠</div>
            </div>
          </Card>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Room Status Card */}
            <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Bed className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                {roomNumber && <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">Allocated</span>}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Room Number</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{roomNumber || 'Not Allocated'}</p>
              {roomNumber && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Occupancy: {occupancyPercentage}%</p>}
            </Card>

            {/* Fee Status Card */}
            <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  feeStatus.due === 0
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {feeStatus.due === 0 ? 'Paid' : 'Pending'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Fee</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{feeStatus.amount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Due: ₹{feeStatus.due}</p>
            </Card>

            {/* Personal Info Card */}
            <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Roll Number</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.rollNumber || 'N/A'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Semester: {user?.semester || 'N/A'}</p>
            </Card>

            {/* Attendance Overview Card */}
            <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <CalendarCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  (attendance || 0) >= 75
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {(attendance || 0) >= 75 ? 'Good' : 'Warning'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Attendance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendance !== null ? attendance + '%' : 'N/A'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Target: 75%</p>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Details Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Full Name</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Email Address</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Roll Number</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{user?.rollNumber}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Room Assignment Details */}
              <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-green-600" />
                  Room Assignment
                </h2>
                {roomNumber ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Room Number</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{roomNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Floor</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{parseInt(roomNumber) > 100 ? '1st' : '2nd'}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">✓ Room successfully allocated</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check-in completed</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <p className="text-yellow-800 dark:text-yellow-200 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Room not yet allocated
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                      Submit your admission request to get a room allocated
                    </p>
                    <Link to="/admission">
                      <Button variant="primary" size="sm" className="mt-3">
                        Submit Admission Request
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>

              {/* Fee Status Details */}
              <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Fee Status
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{feeStatus.amount}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">₹{feeStatus.paid}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <span className="text-gray-600 dark:text-gray-400">Amount Due</span>
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">₹{feeStatus.due}</span>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      Due Date: <strong>{feeStatus.dueDate}</strong>
                    </div>
                  </div>
                  <Link to="/payments">
                    <Button variant="primary" className="w-full mt-2">Pay Now</Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Sidebar Sections */}
            <div className="space-y-6">
              {/* Recent Notices */}
              <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Recent Notices
                </h2>
                <div className="space-y-3">
                  {recentNotices.length > 0 ? (
                    recentNotices.map((notice) => (
                      <div key={notice.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer border-l-4 border-blue-600 bg-white dark:bg-gray-800 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{notice.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notice.date}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 p-3">No recent notices</p>
                  )}
                </div>
                <Link to="/notices" className="block mt-4">
                  <Button variant="secondary" className="w-full">View All Notices</Button>
                </Link>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link to="/admission">
                    <Button variant="primary" className="w-full">Admission Request</Button>
                  </Link>
                  <Link to="/complaints">
                    <Button variant="secondary" className="w-full">File a Complaint</Button>
                  </Link>
                  <Link to="/notices">
                    <Button variant="secondary" className="w-full">View Announcements</Button>
                  </Link>
                </div>
              </Card>

              {/* Help & Support */}
              <Card className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
                  Contact the hostel administration for any queries or issues.
                </p>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">📞 +91 98765 43210</p>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">✉️ admin@hostel.com</p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
