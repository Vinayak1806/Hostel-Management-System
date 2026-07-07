import { useEffect, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, LoadingSpinner, Alert } from '../components'
import { analyticsAPI, exportAPI } from '../services'
import { Users, Bed, DollarSign, AlertCircle, FileSpreadsheet, TrendingUp, Calendar, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        {label && <p className="text-gray-900 dark:text-white font-semibold text-sm mb-1">{label}</p>}
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color || entry.fill || '#3B82F6' }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('en-IN') : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsAPI.getDashboard()
        setAnalytics(data)
      } catch (err) {
        setError('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportAPI.downloadExcel()
    } catch (err) {
      console.error('Export failed:', err)
      alert('Failed to export data. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const statCards = [
    {
      label: 'Active Students',
      value: analytics?.activeStudents || 0,
      subtext: `${analytics?.totalStudents || 0} Total Enrolled`,
      icon: Users,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30'
    },
    {
      label: 'Total Revenue',
      value: `₹${(analytics?.totalRevenue || 0).toLocaleString('en-IN')}`,
      subtext: `${analytics?.feeCollectionPercentage || 0}% Collection Rate`,
      icon: DollarSign,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/30'
    },
    {
      label: 'Pending Fees',
      value: `₹${(analytics?.pendingFees || 0).toLocaleString('en-IN')}`,
      subtext: `From ${analytics?.feesUnpaid || 0} Students`,
      icon: AlertCircle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-900/30'
    },
    {
      label: 'Room Occupancy',
      value: `${analytics?.occupancyPercentage || 0}%`,
      subtext: `${analytics?.totalOccupied || 0} / ${analytics?.totalCapacity || 0} Beds Full`,
      icon: Bed,
      iconColor: 'text-violet-600 dark:text-violet-400',
      iconBg: 'bg-violet-50 dark:bg-violet-900/30'
    }
  ]

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Admin Dashboard" />

        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {error && <Alert type="error" message={error} />}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Header with Export Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Dashboard Overview
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Welcome back! Here's what's happening with your hostel today.
                  </p>
                </div>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileSpreadsheet size={18} />
                  <span className="text-sm font-medium">{exporting ? 'Exporting...' : 'Export All Data'}</span>
                </button>
              </div>

              {/* Refined Stat Cards */}
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

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Occupancy Status
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Current breakdown of room availability</p>
                  <div className="flex-1 min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics?.chartData?.occupancyData || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="value"
                          strokeWidth={0}
                          cornerRadius={6}
                        >
                          {(analytics?.chartData?.occupancyData || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          wrapperStyle={{ fontSize: '13px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Monthly Revenue
                    </h2>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                      <TrendingUp size={12} />
                      Last 6 Months
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Overview of collected payments</p>
                  <div className="flex-1 min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics?.chartData?.monthlyRevenue || []} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                        <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(156, 163, 175, 0.05)' }} />
                        <Bar dataKey="revenue" fill="#3B82F6" name="Revenue (₹)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Complaint Trends - Full Width */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Complaint Trends
                  </h2>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                    <Calendar size={12} />
                    Last 6 Months
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Volume of complaints logged over time</p>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics?.chartData?.complaintTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                      <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        name="Complaints"
                        dot={{ fill: '#8B5CF6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#8B5CF6', strokeWidth: 3, stroke: '#fff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Payments */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Recent Payments
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">Latest Activity</span>
                  </div>
                  <div className="space-y-4">
                    {analytics?.recentPayments?.length > 0 ? (
                      analytics.recentPayments.map((payment, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                              {(payment.student?.name || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                {payment.student?.name || 'Unknown'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'completed'
                              ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                              : 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                          }`}>
                            ₹{payment.amount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="mx-auto mb-2 text-gray-300 dark:text-gray-600" size={32} />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No recent payments</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Notifications */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      System Notifications
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">Broadcasts</span>
                  </div>
                  <div className="space-y-4">
                    {analytics?.recentNotifications?.length > 0 ? (
                      analytics.recentNotifications.map((notif, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 items-start group"
                        >
                          <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{notif.title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-snug">{notif.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="mx-auto mb-2 text-gray-300 dark:text-gray-600" size={32} />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No recent notifications</p>
                      </div>
                    )}
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
