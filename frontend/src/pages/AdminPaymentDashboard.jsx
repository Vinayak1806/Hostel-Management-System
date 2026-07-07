import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Users, CheckCircle, AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Table, Modal, Badge } from '../components'
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

  const columns = [
    { key: 'student', label: 'Student', render: (val) => val?.name || 'N/A' },
    { key: 'amount', label: 'Amount', render: (amt) => <span className="font-semibold">{formatCurrency(amt)}</span> },
    { key: 'semester', label: 'Semester', render: (sem) => `Semester ${sem}` },
    { key: 'dueDate', label: 'Due Date', render: (date) => new Date(date).toLocaleDateString() },
    { key: 'paymentMethod', label: 'Method', render: (val) => <span className="capitalize">{val}</span> },
    { key: 'status', label: 'Status', render: (status) => <Badge status={status} /> }
  ]

  const actions = (payment) => (
    <div className="flex items-center gap-2">
      <select
        value={payment.status}
        onChange={(e) => handleStatusChange(payment._id, e.target.value)}
        className="text-xs px-2 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button 
        onClick={() => handleDelete(payment._id)}
        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )

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
              <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-800 p-6 text-white rounded-2xl border-0 shadow-lg shadow-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 font-medium text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold mt-2 tracking-tight">{formatCurrency(stats.totalRevenue || 0)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-teal-400 to-emerald-600 dark:from-teal-600 dark:to-emerald-800 p-6 text-white rounded-2xl border-0 shadow-lg shadow-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 font-medium text-sm">Completed</p>
                    <p className="text-3xl font-bold mt-2 tracking-tight">{stats.completedCount || 0}</p>
                    <p className="text-xs text-emerald-100 mt-1.5 font-medium bg-white/20 inline-block px-2 py-0.5 rounded-full">{formatCurrency(stats.completedAmount || 0)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 p-6 text-white rounded-2xl border-0 shadow-lg shadow-orange-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 font-medium text-sm">Pending</p>
                    <p className="text-3xl font-bold mt-2 tracking-tight">{stats.pendingCount || 0}</p>
                    <p className="text-xs text-orange-100 mt-1.5 font-medium bg-white/20 inline-block px-2 py-0.5 rounded-full">{formatCurrency(stats.pendingAmount || 0)}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-rose-400 to-pink-600 dark:from-rose-600 dark:to-pink-800 p-6 text-white rounded-2xl border-0 shadow-lg shadow-pink-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 font-medium text-sm">Failed</p>
                    <p className="text-3xl font-bold mt-2 tracking-tight">{stats.failedCount || 0}</p>
                    <p className="text-xs text-pink-100 mt-1.5 font-medium bg-white/20 inline-block px-2 py-0.5 rounded-full">Requires Action</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
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
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition h-[42px]"
              >
                <Plus className="w-4 h-4" />
                New Payment
              </button>
            </div>
          </Card>

          {/* Create Modal */}
          <Modal
            isOpen={showCreateModal}
            title="Create New Payment"
            onClose={() => setShowCreateModal(false)}
            showCloseButton={false}
          >
            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Student ID</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    required
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
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
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Create Payment
                </Button>
                <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </Modal>

          {/* Payments Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Records</h2>
            </div>
            <Table columns={columns} data={payments} actions={actions} />
          </Card>
        </main>
      </div>
    </div>
  )
}