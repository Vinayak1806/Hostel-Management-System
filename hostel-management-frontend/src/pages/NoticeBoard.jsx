import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Input, Textarea, Alert } from '../components'
import { noticeAPI } from '../services'
import { useAuth } from '../context/AuthContext'
import { Plus, Trash2 } from 'lucide-react'

export default function NoticeBoard() {
  const { isAdmin } = useAuth()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general'
  })

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      const data = await noticeAPI.getAll()
      setNotices(data)
    } catch (err) {
      setError('Failed to load notices')
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
      await noticeAPI.create(formData)
      fetchNotices()
      setShowForm(false)
      setFormData({ title: '', content: '', category: 'general' })
    } catch (err) {
      setError('Failed to create notice')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notice?')) {
      try {
        await noticeAPI.delete(id)
        fetchNotices()
      } catch (err) {
        setError('Failed to delete notice')
      }
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'general': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'event': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'rules': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[category] || colors['general']
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Notice Board" />

        <main className="container py-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          {isAdmin && (
            <div className="mb-6">
              <Button
                variant="primary"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>{showForm ? 'Cancel' : 'Post Notice'}</span>
              </Button>
            </div>
          )}

          {showForm && isAdmin && (
            <Card className="mb-6">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Post New Notice</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="title"
                  label="Title"
                  placeholder="Notice title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="general">General</option>
                  <option value="event">Event</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="rules">Rules</option>
                </select>
                <Textarea
                  name="content"
                  label="Content"
                  placeholder="Notice content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
                <div className="flex space-x-3">
                  <Button variant="primary" type="submit">
                    Post Notice
                  </Button>
                  <Button variant="secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-8">Loading notices...</p>
            ) : notices.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No notices available</p>
            ) : (
              notices.map((notice) => (
                <Card key={notice._id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{notice.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(notice.category)}`}>
                          {notice.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">{notice.content}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Posted on {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
