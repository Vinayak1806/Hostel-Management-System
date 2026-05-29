import { useState, useEffect } from 'react'
import { Navbar, Sidebar, Card, Button, Table, Modal, Select, Textarea, Alert } from '../components'
import { admissionAPI, roomAPI } from '../services'

export default function AdmissionManagement() {
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedAdmission, setSelectedAdmission] = useState(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [admissionsRes, roomsRes] = await Promise.all([
        admissionAPI.getPending(),
        roomAPI.getAll()
      ])
      setAdmissions(admissionsRes)
      setRooms(roomsRes.filter(r => r.status !== 'full'))
      setError('')
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (admission) => {
    setSelectedAdmission(admission)
    setShowApproveModal(true)
  }

  const handleReject = (admission) => {
    setSelectedAdmission(admission)
    setShowRejectModal(true)
  }

  const approveAdmission = async () => {
    if (!selectedRoom) {
      setError('Please select a room')
      return
    }

    try {
      setActionLoading(true)
      await admissionAPI.approve(selectedAdmission._id, selectedRoom)
      setSuccess(`Admission approved! Room allocated: ${selectedRoom}`)
      setShowApproveModal(false)
      setSelectedRoom('')
      setTimeout(fetchData, 1000)
    } catch (err) {
      setError(err.message || 'Failed to approve admission')
    } finally {
      setActionLoading(false)
    }
  }

  const rejectAdmission = async () => {
    if (!rejectReason.trim()) {
      setError('Please provide rejection reason')
      return
    }

    try {
      setActionLoading(true)
      await admissionAPI.reject(selectedAdmission._id, rejectReason)
      setSuccess('Admission rejected')
      setShowRejectModal(false)
      setRejectReason('')
      setTimeout(fetchData, 1000)
    } catch (err) {
      setError(err.message || 'Failed to reject admission')
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      key: 'student',
      label: 'Student Name',
      render: (value) => value?.name || 'N/A'
    },
    { key: 'rollNumber', label: 'Roll Number' },
    { key: 'course', label: 'Course' },
    {
      key: 'year',
      label: 'Year',
      render: (value) => `${value}${value === 1 ? 'st' : value === 2 ? 'nd' : 'th'} Year`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    }
  ]

  const actions = (admission) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handleApprove(admission)}
        className="bg-green-600 hover:bg-green-700"
      >
        Approve
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => handleReject(admission)}
      >
        Reject
      </Button>
    </div>
  )

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar title="Admission Management" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          <Card className="mb-6 p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Pending Admissions</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Total Pending: <span className="font-bold text-lg">{admissions.length}</span>
            </p>

            {admissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending admission requests
              </div>
            ) : (
              <Table columns={columns} data={admissions} actions={actions} />
            )}
          </Card>

          {/* Approve Modal */}
          <Modal
            isOpen={showApproveModal}
            title="Approve Admission & Allocate Room"
            onClose={() => {
              setShowApproveModal(false)
              setSelectedRoom('')
            }}
          >
            {selectedAdmission && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <p className="text-sm"><strong>Name:</strong> {selectedAdmission.student?.name}</p>
                  <p className="text-sm"><strong>Roll Number:</strong> {selectedAdmission.rollNumber}</p>
                  <p className="text-sm"><strong>Course:</strong> {selectedAdmission.course}</p>
                </div>

                <Select
                  label="Select Room"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  options={rooms.map(room => ({
                    value: room._id,
                    label: `Room ${room.roomNumber} (${room.currentOccupancy}/${room.capacity}) - ${room.status}`
                  }))}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={approveAdmission}
                    disabled={actionLoading || !selectedRoom}
                    className="flex-1"
                  >
                    {actionLoading ? 'Processing...' : 'Approve & Allocate'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowApproveModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          {/* Reject Modal */}
          <Modal
            isOpen={showRejectModal}
            title="Reject Admission"
            onClose={() => {
              setShowRejectModal(false)
              setRejectReason('')
            }}
          >
            {selectedAdmission && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <p className="text-sm"><strong>Name:</strong> {selectedAdmission.student?.name}</p>
                  <p className="text-sm"><strong>Roll Number:</strong> {selectedAdmission.rollNumber}</p>
                </div>

                <Textarea
                  label="Rejection Reason"
                  placeholder="Enter reason for rejection"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />

                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={rejectAdmission}
                    disabled={actionLoading || !rejectReason}
                    className="flex-1"
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  )
}
