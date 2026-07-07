import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Alert } from '../components'
import { useAuth } from '../context/AuthContext'
import { User, Bed, DollarSign, FileText, Bell, AlertCircle, Clock, CalendarCheck, ArrowRight, CheckCircle2, ChevronRight, Activity } from 'lucide-react'
import { paymentAPI, noticeAPI, attendanceAPI, admissionAPI } from '../services'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [feeStatus, setFeeStatus] = useState({ amount: 0, paid: 0, due: 0, dueDate: '-' })
  const [attendance, setAttendance] = useState(null)
  const [recentNotices, setRecentNotices] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [admissionData, setAdmissionData] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [paymentRes, noticeRes, attendanceRes, admRes] = await Promise.all([
          paymentAPI.getStudentPayments().catch(() => ({ summary: { totalAmount: 0, paidAmount: 0, pendingAmount: 0 }, payments: [] })),
          noticeAPI.getAll().catch(() => ([])),
          attendanceAPI.getStudentAttendance().catch(() => null),
          admissionAPI.getMyStatus().catch(() => null)
        ])
        
        const summary = paymentRes.summary || { totalAmount: 0, paidAmount: 0, pendingAmount: 0 }
        const payments = paymentRes.payments || []
        
        const pendingPayments = payments.filter(p => p.status === 'pending').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        const nextDueDate = pendingPayments.length > 0 ? new Date(pendingPayments[0].dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

        setFeeStatus({
          amount: summary.totalAmount,
          paid: summary.paidAmount,
          due: summary.pendingAmount,
          dueDate: nextDueDate
        })

        setRecentTransactions(payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3))
        
        if (Array.isArray(noticeRes)) {
            setRecentNotices(noticeRes.slice(0, 3).map(n => ({
                id: n._id,
                title: n.title,
                date: new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
            })))
        }

        if (attendanceRes && attendanceRes.summary) {
          const { totalDays, present, late } = attendanceRes.summary
          const attendancePercentage = totalDays > 0 ? Math.round(((present + late) / totalDays) * 100) : 0
          setAttendance(attendancePercentage)
        } else {
          setAttendance(0)
        }

        if (admRes && admRes.admission) {
          setAdmissionData(admRes.admission)
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
  const isAllocated = !!roomNumber

  const statCards = [
    {
      label: 'Room Allocation',
      value: roomNumber || 'Pending',
      subtext: isAllocated ? 'Successfully allocated' : 'Awaiting assignment',
      icon: Bed,
      iconColor: isAllocated ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400',
      iconBg: isAllocated ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-amber-50 dark:bg-amber-900/30'
    },
    {
      label: 'Pending Dues',
      value: `₹${(feeStatus.due || 0).toLocaleString('en-IN')}`,
      subtext: feeStatus.due > 0 ? `Due by ${feeStatus.dueDate}` : 'All clear!',
      icon: DollarSign,
      iconColor: feeStatus.due > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400',
      iconBg: feeStatus.due > 0 ? 'bg-rose-50 dark:bg-rose-900/30' : 'bg-emerald-50 dark:bg-emerald-900/30'
    },
    {
      label: 'Roll Number',
      value: user?.rollNumber || admissionData?.rollNumber || 'N/A',
      subtext: `Semester ${user?.semester || admissionData?.semester || 'N/A'}`,
      icon: User,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30'
    },
    {
      label: 'Attendance',
      value: attendance !== null ? `${attendance}%` : 'N/A',
      subtext: (attendance || 0) >= 75 ? 'On track (75% min)' : 'Below target (75% min)',
      icon: CalendarCheck,
      iconColor: (attendance || 0) >= 75 ? 'text-violet-600 dark:text-violet-400' : 'text-amber-600 dark:text-amber-400',
      iconBg: (attendance || 0) >= 75 ? 'bg-violet-50 dark:bg-violet-900/30' : 'bg-amber-50 dark:bg-amber-900/30'
    }
  ]

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Student Portal" />

        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {loading ? (
             <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
             </div>
          ) : (
            <>
              {/* Refined Welcome Header */}
              <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Here's a quick overview of your hostel status and recent updates.
                  </p>
                </div>
                {!isAllocated && (
                   <Link to="/admission">
                     <Button variant="primary" className="flex items-center gap-2 rounded-xl px-5">
                       Request Room <ArrowRight size={16} />
                     </Button>
                   </Link>
                )}
              </div>

              {/* Key Stats Grid - Matching Admin Dashboard Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${card.iconBg} ${card.iconColor} group-hover:scale-110 transition-transform`}>
                        <card.icon size={24} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{card.label}</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                        {card.value}
                      </h3>
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                        <Activity size={12} />
                        {card.subtext}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Fee Status Summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="text-emerald-500" /> Financial Overview
                      </h2>
                      <Link to="/payments" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        View Details <ChevronRight size={16} />
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Fee</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">₹{feeStatus.amount.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Amount Paid</p>
                        <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">₹{feeStatus.paid.toLocaleString('en-IN')}</p>
                      </div>
                      <div className={`p-4 rounded-xl border ${feeStatus.due > 0 ? 'bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:border-rose-900/30' : 'bg-gray-50 border-gray-100 dark:bg-gray-700/30 dark:border-gray-700'}`}>
                        <p className={`text-sm mb-1 ${feeStatus.due > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400'}`}>Amount Due</p>
                        <p className={`text-xl font-bold ${feeStatus.due > 0 ? 'text-rose-700 dark:text-rose-300' : 'text-gray-900 dark:text-white'}`}>₹{feeStatus.due.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {feeStatus.due > 0 && (
                      <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-between border border-amber-100 dark:border-amber-900/30">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400">
                            <Clock size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Payment Due Soon</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400">Clear your pending dues of ₹{feeStatus.due.toLocaleString('en-IN')} by {feeStatus.dueDate}</p>
                          </div>
                        </div>
                        <Link to="/payments">
                          <Button variant="primary" size="sm" className="shrink-0 bg-amber-600 hover:bg-amber-700 border-none">Pay Now</Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Room & Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Room Assignment */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Bed className="text-blue-500" /> Accommodation
                      </h2>
                      
                      {isAllocated ? (
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                              <span className="text-2xl font-bold">{roomNumber}</span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Floor</p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">{parseInt(roomNumber) > 100 ? '1st Floor' : '2nd Floor'}</p>
                            </div>
                          </div>
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 size={16} /> Room Successfully Allocated
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 mb-3">
                            <AlertCircle size={24} />
                          </div>
                          <p className="text-gray-900 dark:text-white font-semibold mb-1">No Room Assigned</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please submit an admission request to get a room.</p>
                        </div>
                      )}
                    </div>

                    {/* Personal Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <User className="text-purple-500" /> Profile Overview
                      </h2>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Phone</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.phone || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Roll No.</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.rollNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mt-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity className="text-emerald-500" /> Recent Transactions
                      </h2>
                      <Link to="/payments" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        View All <ChevronRight size={16} />
                      </Link>
                    </div>
                    
                    <div className="space-y-4">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((tx, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${tx.status === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                <DollarSign size={20} />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                  {tx.description || `Semester ${tx.semester} Fee`}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                            </div>
                            <span className={`font-bold ${tx.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              ₹{tx.amount?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500 dark:text-gray-400">No recent transactions found.</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                  
                  {/* Recent Announcements */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell className="text-blue-500" /> Notice Board
                      </h2>
                    </div>
                    <div className="space-y-4 mb-4">
                      {recentNotices.length > 0 ? (
                        recentNotices.map((notice) => (
                          <div key={notice.id} className="group relative pl-4 border-l-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {notice.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notice.date}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500 dark:text-gray-400">No recent announcements</p>
                        </div>
                      )}
                    </div>
                    <Link to="/notices" className="block">
                      <Button variant="outline" className="w-full text-sm font-medium rounded-xl">View All Notices</Button>
                    </Link>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
                    <div className="space-y-2">
                      <Link to="/complaints" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                        <span className="text-sm font-medium flex items-center gap-2"><AlertCircle size={16} className="text-purple-500"/> Register Complaint</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                      </Link>
                      <Link to="/attendance" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                        <span className="text-sm font-medium flex items-center gap-2"><CalendarCheck size={16} className="text-indigo-500"/> Check Attendance</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                      </Link>
                      <Link to="/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                        <span className="text-sm font-medium flex items-center gap-2"><User size={16} className="text-emerald-500"/> Update Profile</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                      </Link>
                    </div>
                  </div>

                  {/* Help Support */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30">
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Need Support?</h3>
                    <p className="text-sm text-blue-800/80 dark:text-blue-200/80 mb-4 leading-relaxed">
                      Reach out to the administration for queries, emergencies, or general assistance.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        📞 +91 98765 43210
                      </p>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        ✉️ hostelhubgo@gmail.com
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
