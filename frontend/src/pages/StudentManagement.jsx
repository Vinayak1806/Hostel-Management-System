import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Input, Table, Modal, Alert } from '../components'
import { studentAPI } from '../services'
import { Trash2, Edit2, Plus } from 'lucide-react'

export default function StudentManagement() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    semester: '1'
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const data = await studentAPI.getAll()
      setStudents(data)
    } catch (err) {
      setError('Failed to load students')
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
      if (editingId) {
        await studentAPI.update(editingId, formData)
      } else {
        await studentAPI.create(formData)
      }
      fetchStudents()
      setShowModal(false)
      setFormData({ name: '', email: '', phone: '', rollNumber: '', semester: '1' })
      setEditingId(null)
    } catch (err) {
      setError('Failed to save student')
    }
  }

  const handleEdit = (student) => {
    setFormData(student)
    setEditingId(student._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await studentAPI.delete(id)
        fetchStudents()
      } catch (err) {
        setError('Failed to delete student')
      }
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'rollNumber', label: 'Roll Number' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'semester', label: 'Semester' }
  ]

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Student Management" />

        <main className="container py-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h2>
            <Button
              variant="primary"
              onClick={() => {
                setFormData({ name: '', email: '', phone: '', rollNumber: '', semester: '1' })
                setEditingId(null)
                setShowModal(true)
              }}
              className="flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Student</span>
            </Button>
          </div>

          <Card>
            <Table
              columns={columns}
              data={students}
              loading={loading}
              actions={(student) => (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            />
          </Card>

          <Modal
            isOpen={showModal}
            title={editingId ? 'Edit Student' : 'Add Student'}
            onClose={() => setShowModal(false)}
            footer={
              <Button
                variant="primary"
                onClick={handleSubmit}
              >
                {editingId ? 'Update' : 'Add'} Student
              </Button>
            }
          >
            <form className="space-y-4">
              <Input
                type="text"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                type="tel"
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                type="text"
                name="rollNumber"
                label="Roll Number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="semester"
                label="Semester"
                value={formData.semester}
                onChange={handleChange}
                min="1"
                max="8"
              />
            </form>
          </Modal>
        </main>
      </div>
    </div>
  )
}
