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
                  icon={Bed}
                  label="Total Rooms"
                  value={analytics?.totalRooms || 0}
                  color="bg-green-600"
                />
                <StatCard
                  icon={DollarSign}
                  label="Pending Fees"
                  value={`₹${analytics?.pendingFees || 0}`}
                  color="bg-yellow-600"
                />
                <StatCard
                  icon={AlertCircle}
                  label="Open Complaints"
                  value={analytics?.openComplaints || 0}
                  color="bg-red-600"
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
              <Card className="mt-6">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left">
                    <p className="font-semibold text-blue-600 dark:text-blue-400">Add Student</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Register new student</p>
                  </button>
                  <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left">
                    <p className="font-semibold text-green-600 dark:text-green-400">Allocate Room</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Assign student to room</p>
                  </button>
                  <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left">
                    <p className="font-semibold text-purple-600 dark:text-purple-400">Post Notice</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Create announcement</p>
                  </button>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
