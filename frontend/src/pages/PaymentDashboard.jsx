import { useState, useEffect } from 'react'
import { CreditCard, DollarSign, Clock, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card } from '../components'
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
        return <CheckCircle className="w-5 h-5" />
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'failed':
        return <AlertCircle className="w-5 h-5" />
      default:
        return null
    }
  }

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
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-6 text-white rounded-xl border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Amount</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(summary.totalAmount || 0)}</p>
              </div>
              <DollarSign className="w-12 h-12 opacity-20" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 p-6 text-white rounded-xl border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Paid Amount</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(summary.paidAmount || 0)}</p>
                <p className="text-sm text-green-100 mt-1">{summary.completedPayments || 0} payments</p>
              </div>
              <CheckCircle className="w-12 h-12 opacity-20" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-700 dark:to-yellow-800 p-6 text-white rounded-xl border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Pending Amount</p>
                <p className="text-3xl font-bold mt-2">{formatCurrency(summary.pendingAmount || 0)}</p>
                <p className="text-sm text-yellow-100 mt-1">{summary.pendingPayments || 0} payments</p>
              </div>
              <Clock className="w-12 h-12 opacity-20" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 p-6 text-white rounded-xl border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Failed Payments</p>
                <p className="text-3xl font-bold mt-2">{summary.failedPayments || 0}</p>
                <p className="text-sm text-red-100 mt-1">Needs action</p>
              </div>
              <AlertCircle className="w-12 h-12 opacity-20" />
            </div>
          </Card>
        </div>
      )}

      {/* Payment History */}
      <Card className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Payment History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Semester</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Action</th>
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
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">{payment.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Sem {payment.semester}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-300">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'completed' && (
                        <button 
                          onClick={() => handleDownloadInvoice(payment._id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                      )}
                      {payment.status === 'pending' && (
                        <button 
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
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-semibold"
                        >
                          Pay Now
                        </button>
                      )}
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