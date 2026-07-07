import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Input, Table, Modal, Alert } from '../components'
import { studentAPI } from '../services'
import { Trash2, Edit2, Plus, Search, Users } from 'lucide-react'

export default function StudentManagement() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
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

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Students" />

        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Student Directory</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Browse, search, and manage enrolled students</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{students.length} total students registered</p>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setFormData({ name: '', email: '', phone: '', rollNumber: '', semester: '1' })
                setEditingId(null)
                setShowModal(true)
              }}
              className="flex items-center gap-2 rounded-xl px-5"
            >
              <Plus size={18} />
              <span>Add Student</span>
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
            />
          </div>

          <Card>
            <Table
              columns={columns}
              data={filteredStudents}
              loading={loading}
              actions={(student) => (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(student)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
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
