import { useState, useEffect } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Button, Input, Table, Modal, Alert, Badge } from '../components'
import { roomAPI } from '../services'
import { Trash2, Edit2, Plus } from 'lucide-react'

export default function RoomManagement() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: '',
    capacity: '',
    currentOccupancy: '0'
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const data = await roomAPI.getAll()
      setRooms(data)
    } catch (err) {
      setError('Failed to load rooms')
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
        await roomAPI.update(editingId, formData)
      } else {
        await roomAPI.create(formData)
      }
      fetchRooms()
      setShowModal(false)
      setFormData({ roomNumber: '', floor: '', capacity: '', currentOccupancy: '0' })
      setEditingId(null)
    } catch (err) {
      setError('Failed to save room')
    }
  }

  const handleEdit = (room) => {
    setFormData(room)
    setEditingId(room._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await roomAPI.delete(id)
        fetchRooms()
      } catch (err) {
        setError('Failed to delete room')
      }
    }
  }

  const getStatus = (room) => {
    const occupancyPercent = (room.currentOccupancy / room.capacity) * 100
    if (occupancyPercent === 100) return 'occupied'
    if (occupancyPercent > 0) return 'partial'
    return 'available'
  }

  const columns = [
    { key: 'roomNumber', label: 'Room Number' },
    { key: 'floor', label: 'Floor' },
    { key: 'capacity', label: 'Capacity' },
    {
      key: 'currentOccupancy',
      label: 'Occupancy',
      render: (occupancy, room) => `${occupancy}/${room.capacity}`
    },
    {
      key: '_id',
      label: 'Status',
      render: (_, room) => <Badge status={getStatus(room)} />
    }
  ]

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Room Management" />

        <main className="container py-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rooms</h2>
            <Button
              variant="primary"
              onClick={() => {
                setFormData({ roomNumber: '', floor: '', capacity: '', currentOccupancy: '0' })
                setEditingId(null)
                setShowModal(true)
              }}
              className="flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Room</span>
            </Button>
          </div>

          <Card>
            <Table
              columns={columns}
              data={rooms}
              loading={loading}
              actions={(room) => (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
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
            title={editingId ? 'Edit Room' : 'Add Room'}
            onClose={() => setShowModal(false)}
            footer={
              <Button
                variant="primary"
                onClick={handleSubmit}
              >
                {editingId ? 'Update' : 'Add'} Room
              </Button>
            }
          >
            <form className="space-y-4">
              <Input
                type="text"
                name="roomNumber"
                label="Room Number"
                value={formData.roomNumber}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="floor"
                label="Floor"
                value={formData.floor}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="capacity"
                label="Capacity"
                value={formData.capacity}
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
