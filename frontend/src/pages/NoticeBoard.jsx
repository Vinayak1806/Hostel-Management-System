import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Input, Textarea, Alert } from '../components'
import { noticeAPI } from '../services'
import { useAuth } from '../context/AuthContext'
import { Plus, Trash2, Megaphone, Calendar, Wrench, BookOpen } from 'lucide-react'

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
      'general': 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
      'event': 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800/50',
      'maintenance': 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
      'rules': 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50'
    }
    return colors[category] || colors['general']
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'general': <Megaphone size={14} />,
      'event': <Calendar size={14} />,
      'maintenance': <Wrench size={14} />,
      'rules': <BookOpen size={14} />
    }
    return icons[category] || icons['general']
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Notice Board" />

        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Notice Board</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{notices.length} notices posted</p>
            </div>
            {isAdmin && (
              <Button
                variant="primary"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 rounded-xl px-5"
              >
                <Plus size={18} />
                <span>{showForm ? 'Cancel' : 'Post Notice'}</span>
              </Button>
            )}
          </div>

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
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
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
                <div className="flex gap-3">
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
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-12">
                <Megaphone size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No notices available</p>
              </div>
            ) : (
              notices.map((notice) => (
                <Card key={notice._id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{notice.title}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryColor(notice.category)}`}>
                          {getCategoryIcon(notice.category)}
                          {notice.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">{notice.content}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Posted on {new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors ml-4"
                        title="Delete"
                      >
                        <Trash2 size={16} />
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
