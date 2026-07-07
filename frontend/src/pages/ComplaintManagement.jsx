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
      let data
      if (isAdmin) {
        data = await complaintAPI.getAll()
        // Map student name from populated field for admin view
        data = data.map(c => ({ ...c, studentName: c.student?.name || 'Unknown' }))
      } else {
        data = await complaintAPI.getStudentComplaints()
        data = data.map(c => ({ ...c, studentName: user?.name || 'Me' }))
      }
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

        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Complaints</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{complaints.length} total complaints</p>
            </div>
            {!isAdmin && (
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl px-5"
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
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                      className="text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  )}
                  <button
                    onClick={() => handleDelete(complaint._id)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
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
