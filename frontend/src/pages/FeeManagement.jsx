import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Table, Modal, Alert, Badge } from '../components'
import { feeAPI } from '../services'
import { Check } from 'lucide-react'

export default function FeeManagement() {
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedFee, setSelectedFee] = useState(null)

  useEffect(() => {
    fetchFees()
  }, [])

  const fetchFees = async () => {
    try {
      const data = await feeAPI.getAll()
      setFees(data)
    } catch (err) {
      setError('Failed to load fees')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (feeId) => {
    try {
      await feeAPI.markPaid(feeId)
      fetchFees()
      setShowModal(false)
    } catch (err) {
      setError('Failed to mark fee as paid')
    }
  }

  const columns = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'studentRoll', label: 'Roll Number' },
    { key: 'amount', label: 'Amount', render: (amount) => `₹${amount}` },
    { key: 'dueDate', label: 'Due Date', render: (date) => new Date(date).toLocaleDateString() },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge status={status} />
    }
  ]

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Fee Management" />

        <main className="container py-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Fees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{fees.reduce((sum, f) => sum + f.amount, 0)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">Paid Fees</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0)}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Fees</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{fees.filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0)}
              </p>
            </Card>
          </div>

          <Card>
            <Table
              columns={columns}
              data={fees}
              loading={loading}
              actions={(fee) => (
                fee.status === 'unpaid' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleMarkPaid(fee._id)}
                    className="flex items-center space-x-1"
                  >
                    <Check size={16} />
                    <span>Mark Paid</span>
                  </Button>
                ) : (
                  <Badge status="paid" label="Paid" />
                )
              )}
            />
          </Card>
        </main>
      </div>
    </div>
  )
}
