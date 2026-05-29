import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Textarea, Table, Modal, Alert, Badge, Select } from '../components'
import { complaintAPI } from '../services'
import { useAuth } from '../context/AuthContext'
import { Plus, Trash2 } from 'lucide-react'

export default function ComplaintManagement() {
  const { isAdmin, user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'maintenance'
  })

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const data = await complaintAPI.getAll()
      setComplaints(data)
    } catch (err) {
      setError('Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await complaintAPI.create(formData)
      fetchComplaints()
      setShowModal(false)
      setFormData({ title: '', description: '', category: 'maintenance' })
    } catch (err) {
      setError('Failed to create complaint')
    }
  }

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await complaintAPI.updateStatus(complaintId, newStatus)
      fetchComplaints()
    } catch (err) {
      setError('Failed to update complaint status')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await complaintAPI.delete(id)
        fetchComplaints()
      } catch (err) {
        setError('Failed to delete complaint')
      }
    }
  }

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'studentName', label: 'Student' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge status={status} />
    },
    { key: 'createdAt', label: 'Date', render: (date) => new Date(date).toLocaleDateString() }
  ]

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title={isAdmin ? 'Complaint Management' : 'My Complaints'} />

        <main className="container py-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complaints</h2>
            {!isAdmin && (
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>File Complaint</span>
              </Button>
            )}
          </div>

          <Card>
            <Table
              columns={columns}
              data={complaints}
              loading={loading}
              actions={(complaint) => (
                <div className="flex space-x-2">
                  {isAdmin && (
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                      className="text-sm px-2 py-1 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  )}
                  {(!isAdmin || isAdmin) && (
                    <button
                      onClick={() => handleDelete(complaint._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              )}
            />
          </Card>

          <Modal
            isOpen={showModal}
            title="File a Complaint"
            onClose={() => setShowModal(false)}
            footer={
              <Button
                variant="primary"
                onClick={handleSubmit}
              >
                Submit Complaint
              </Button>
            }
          >
            <form className="space-y-4">
              <input
                type="text"
                name="title"
                label="Title"
                placeholder="Brief title of the complaint"
                value={formData.title}
                onChange={handleChange}
                className="input"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                <option value="maintenance">Maintenance</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="food">Food & Dining</option>
                <option value="water">Water & Electricity</option>
                <option value="other">Other</option>
              </select>
              <Textarea
                name="description"
                label="Description"
                placeholder="Provide detailed description of your complaint"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </form>
          </Modal>
        </main>
      </div>
    </div>
  )
}
