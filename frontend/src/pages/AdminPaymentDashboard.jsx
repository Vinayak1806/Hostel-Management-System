import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Users, CheckCircle, AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card } from '../components'
import { paymentAPI } from '../services'

export default function AdminPaymentDashboard() {
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    description: '',
    semester: '',
    dueDate: '',
    paymentMethod: 'bank_transfer'
  })

  useEffect(() => {
    fetchPayments()
  }, [filter])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await paymentAPI.getAllPayments(params)
      setPayments(response.payments || [])
      setStats(response.stats)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePayment = async (e) => {
    e.preventDefault()
    try {
      await paymentAPI.createPayment(formData)
      setShowCreateModal(false)
      setFormData({
        studentId: '',
        amount: '',
        description: '',
        semester: '',
        dueDate: '',
        paymentMethod: 'bank_transfer'
      })
      fetchPayments()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      await paymentAPI.updatePaymentStatus(paymentId, { status: newStatus })
      fetchPayments()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await paymentAPI.deletePayment(paymentId)
        fetchPayments()
      } catch (err) {
        setError(err.message || 'Failed to delete payment')
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <Navbar title="Admin - Payments" />
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
        <Navbar title="Admin - Payments" />
        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Summary Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-lg p-6 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Revenue</p>
                    <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalRevenue || 0)}</p>
                  </div>
                  <DollarSign className="w-12 h-12 opacity-20" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 rounded-lg p-6 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Completed</p>
                    <p className="text-3xl font-bold mt-2">{stats.completedCount || 0}</p>
                    <p className="text-sm text-green-100 mt-1">{formatCurrency(stats.completedAmount || 0)}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 opacity-20" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-700 dark:to-yellow-800 rounded-lg p-6 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Pending</p>
                    <p className="text-3xl font-bold mt-2">{stats.pendingCount || 0}</p>
                    <p className="text-sm text-yellow-100 mt-1">{formatCurrency(stats.pendingAmount || 0)}</p>
                  </div>
                  <TrendingUp className="w-12 h-12 opacity-20" />
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 rounded-lg p-6 text-white border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Failed</p>
                    <p className="text-3xl font-bold mt-2">{stats.failedCount || 0}</p>
                    <p className="text-sm text-red-100 mt-1">Requires Action</p>
                  </div>
                  <AlertCircle className="w-12 h-12 opacity-20" />
                </div>
              </Card>
            </div>
          )}

          {/* Controls */}
          <Card className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex gap-4 flex-wrap">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              New Payment
            </button>
          </Card>

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
              <Card className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-2xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create New Payment</h2>
                <form onSubmit={handleCreatePayment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Amount</label>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Semester</label>
                      <select
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Select semester</option>
                        {Array.from({ length: 8 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Semester {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Due Date</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Payment Method</label>
                      <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cash">Cash</option>
                        <option value="razorpay">Razorpay</option>
                        <option value="stripe">Stripe</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Payments Table */}
          <Card className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Semester</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Due Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Method</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{payment.student?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-300">{formatCurrency(payment.amount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Semester {payment.semester}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{new Date(payment.dueDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 capitalize">{payment.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(payment.status)}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <select
                            value={payment.status}
                            onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                            className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(payment.status)} border-0 outline-none cursor-pointer`}
                          >
                            <option value="pending" className="bg-white text-gray-900">Pending</option>
                            <option value="completed" className="bg-white text-gray-900">Completed</option>
                            <option value="failed" className="bg-white text-gray-900">Failed</option>
                            <option value="cancelled" className="bg-white text-gray-900">Cancelled</option>
                          </select>
                          <button 
                            onClick={() => handleDelete(payment._id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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