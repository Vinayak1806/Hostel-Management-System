import { useState, useEffect } from 'react'
import { CreditCard, DollarSign, Clock, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Table, Badge, Button } from '../components'
import { paymentAPI } from '../services'

export default function PaymentDashboard() {
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await paymentAPI.getStudentPayments()
      setPayments(response.payments)
      setSummary(response.summary)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = async (paymentId) => {
    try {
      setLoading(true)
      const invoiceData = await paymentAPI.generateInvoice(paymentId)
      
      // Create a downloadable text file with the invoice data
      const invoiceText = `
INVOICE
-----------------------------
Invoice Number: ${invoiceData.invoiceNumber}
Date: ${invoiceData.date}
Student: ${invoiceData.student?.name || 'N/A'} (Roll No: ${invoiceData.student?.rollNumber || 'N/A'})

Description: ${invoiceData.description}
Amount: Rs. ${invoiceData.amount}
Status: ${invoiceData.status}
Paid At: ${invoiceData.paidAt ? new Date(invoiceData.paidAt).toLocaleString() : 'N/A'}
Transaction ID: ${invoiceData.transactionId || 'N/A'}
-----------------------------
Thank you for your payment!
`
      const blob = new Blob([invoiceText], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${invoiceData.invoiceNumber}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to generate invoice')
    } finally {
      setLoading(false)
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
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const columns = [
    { key: 'createdAt', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
    { key: 'description', label: 'Description' },
    { key: 'semester', label: 'Semester', render: (sem) => `Sem ${sem}` },
    { key: 'amount', label: 'Amount', render: (amt) => <span className="font-semibold">{formatCurrency(amt)}</span> },
    { key: 'dueDate', label: 'Due Date', render: (date) => new Date(date).toLocaleDateString() },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          {status}
        </span>
      )
    }
  ]

  const tableActions = (payment) => (
    <div className="flex items-center gap-2">
      {payment.status === 'completed' && (
        <button 
          onClick={() => handleDownloadInvoice(payment._id)}
          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-1.5 font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          Invoice
        </button>
      )}
      {payment.status === 'pending' && (
        <Button 
          size="sm"
          onClick={async () => {
            try {
              setLoading(true)
              await paymentAPI.processPayment(payment._id)
              fetchPayments()
            } catch (err) {
              setError(err.message || 'Payment failed')
              setLoading(false)
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          Pay Now
        </Button>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 md:ml-64">
          <Navbar title="Payments" />
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
        <Navbar title="Payment Management" />
        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-800 p-6 text-white rounded-2xl border-0 shadow-lg shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium text-sm">Total Amount</p>
                <p className="text-3xl font-bold mt-2 tracking-tight">{formatCurrency(summary.totalAmount || 0)}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-teal-400 to-emerald-600 dark:from-teal-600 dark:to-emerald-800 p-6 text-white rounded-2xl border-0 shadow-lg shadow-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 font-medium text-sm">Paid Amount</p>
                <p className="text-3xl font-bold mt-2 tracking-tight">{formatCurrency(summary.paidAmount || 0)}</p>
                <p className="text-xs text-emerald-100 mt-1.5 font-medium bg-white/20 inline-block px-2 py-0.5 rounded-full">{summary.completedPayments || 0} payments</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 p-6 text-white rounded-2xl border-0 shadow-lg shadow-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-medium text-sm">Pending Amount</p>
                <p className="text-3xl font-bold mt-2 tracking-tight">{formatCurrency(summary.pendingAmount || 0)}</p>
                <p className="text-xs text-orange-100 mt-1.5 font-medium bg-white/20 inline-block px-2 py-0.5 rounded-full">{summary.pendingPayments || 0} payments</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-rose-400 to-pink-600 dark:from-rose-600 dark:to-pink-800 p-6 text-white rounded-2xl border-0 shadow-lg shadow-pink-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 font-medium text-sm">Failed Payments</p>
                <p className="text-3xl font-bold mt-2 tracking-tight">{summary.failedPayments || 0}</p>
                <p className="text-xs text-pink-100 mt-1.5 font-medium bg-white/20 inline-block px-2 py-0.5 rounded-full">Needs action</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Payment History */}
      <Card className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            Payment History
          </h2>
        </div>
        <Table columns={columns} data={payments} actions={tableActions} />
      </Card>
        </main>
      </div>
    </div>
  )
}