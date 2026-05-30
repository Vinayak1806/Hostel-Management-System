import { useEffect, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, LoadingSpinner, Alert } from '../components'
import { analyticsAPI } from '../services'
import { Users, Bed, DollarSign, AlertCircle } from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card className="flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </Card>
)

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Admin Dashboard" />

        <main className="container py-8">
          {error && <Alert type="error" message={error} />}

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Users}
                  label="Total Students"
                  value={analytics?.totalStudents || 0}
                  color="bg-blue-600"
                />
                <StatCard
                  icon={DollarSign}
                  label="Total Revenue"
                  value={`₹${analytics?.totalRevenue || 0}`}
                  color="bg-green-600"
                />
                <StatCard
                  icon={AlertCircle}
                  label="Pending Fees"
                  value={`₹${analytics?.pendingFees || 0}`}
                  color="bg-yellow-600"
                />
                <StatCard
                  icon={Bed}
                  label="Room Occupancy"
                  value={`${analytics?.occupancyPercentage || 0}%`}
                  color="bg-purple-600"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                    Occupancy Status
                  </h2>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white text-center">
                    <p className="text-4xl font-bold">
                      {analytics?.occupancyPercentage || 0}%
                    </p>
                    <p className="mt-2">of rooms occupied</p>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                    Fee Collection
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Paid</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full"
                          style={{ width: `${analytics?.feeCollectionPercentage || 0}%` }}
                        />
                      </div>
                      <p className="text-sm font-medium mt-1">{analytics?.feesPaid || 0} students</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Unpaid</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-red-600 h-3 rounded-full"
                          style={{ width: `${100 - (analytics?.feeCollectionPercentage || 0)}%` }}
                        />
                      </div>
                      <p className="text-sm font-medium mt-1">{analytics?.feesUnpaid || 0} students</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                    Recent Payments
                  </h2>
                  <div className="space-y-4">
                    {analytics?.recentPayments?.length > 0 ? (
                      analytics.recentPayments.map((payment, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{payment.student?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            ₹{payment.amount}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No recent payments.</p>
                    )}
                  </div>
                </Card>

                <Card>
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                    Recent System Notifications
                  </h2>
                  <div className="space-y-4">
                    {analytics?.recentNotifications?.length > 0 ? (
                      analytics.recentNotifications.map((notif, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-600">
                          <p className="font-semibold text-gray-900 dark:text-white">{notif.title}</p>
                          <p className="text-sm text-gray-500 truncate">{notif.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No recent notifications.</p>
                    )}
                  </div>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
