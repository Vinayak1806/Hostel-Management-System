import { useState, useEffect } from 'react'
import { FileText, CheckCircle, AlertCircle, Clock, Ban, Percent, Heart, User, MapPin, Phone } from 'lucide-react'
import { Navbar, Sidebar, Card, Button, Table, Modal, Select, Textarea, Alert } from '../components'
import { admissionAPI, roomAPI } from '../services'

export default function AdmissionManagement() {
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [stats, setStats] = useState(null)
  
  // State for modals and actions
  const [selectedAdmission, setSelectedAdmission] = useState(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [filterStatus])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [admissionsRes, roomsRes, statsRes] = await Promise.all([
        admissionAPI.getAll(filterStatus),
        roomAPI.getAll(),
        admissionAPI.getStats().catch(() => null)
      ])
      setAdmissions(admissionsRes)
      setRooms(roomsRes.filter(r => r.status !== 'full'))
      setStats(statsRes)
      setError('')
    } catch (err) {
      setError('Failed to load admissions data')
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
      
      const matchedRoom = rooms.find(r => r._id === selectedRoom)
      const roomNum = matchedRoom ? matchedRoom.roomNumber : ''
      setSuccess(`Admission approved successfully! Assigned room is: ${roomNum}`)
      setShowApproveModal(false)
      setSelectedRoom('')
      setTimeout(fetchData, 1000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to approve admission')
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
      setSuccess('Admission request rejected successfully')
      setShowRejectModal(false)
      setRejectReason('')
      setTimeout(fetchData, 1000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reject admission')
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
      render: (value) => `${value}${value === 1 ? 'st' : value === 2 ? 'nd' : value === 3 ? 'rd' : 'th'} Year`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          value === 'pending'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            : value === 'approved'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    }
  ]

  const actions = (admission) => (
    <div className="flex items-center gap-2">
      {admission.status === 'pending' ? (
        <>
          <Button
            size="sm"
            onClick={() => handleApprove(admission)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Review & Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleReject(admission)}
          >
            Reject
          </Button>
        </>
      ) : admission.status === 'approved' ? (
        <div className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded">
          Allocated: Room {admission.roomAssigned}
        </div>
      ) : (
        <div className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded max-w-xs truncate" title={admission.rejectionReason}>
          Reason: {admission.rejectionReason}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Admission Management" />
        
        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          {/* Statistics Section */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Card className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalRequests || 0}</p>
              </Card>

              <Card className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pendingRequests || 0}</p>
              </Card>

              <Card className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.approvedRequests || 0}</p>
              </Card>

              <Card className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Ban className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.rejectedRequests || 0}</p>
              </Card>

              <Card className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Percent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.approvalRate || 0}%</p>
              </Card>
            </div>
          )}

          {/* Status Tabs Controls */}
          <Card className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 mr-2">Filter by Status:</span>
            {['all', 'pending', 'approved', 'rejected'].map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => setFilterStatus(statusOption === 'all' ? '' : statusOption)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  (statusOption === 'all' && !filterStatus) || filterStatus === statusOption
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
              </button>
            ))}
          </Card>

          {/* Admissions Table Card */}
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {filterStatus ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Admissions` : 'All Admissions'}
              </h2>
              <span className="text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold px-3 py-1 rounded-full">
                Count: {admissions.length}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : admissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No admission requests found in this category.
              </div>
            ) : (
              <Table columns={columns} data={admissions} actions={actions} />
            )}
          </Card>

          {/* Approve Modal */}
          <Modal
            isOpen={showApproveModal}
            title="Review Admission & Allocate Room"
            onClose={() => {
              setShowApproveModal(false)
              setSelectedRoom('')
            }}
            showCloseButton={false}
          >
            {selectedAdmission && (
              <div className="space-y-4 pt-2">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 text-gray-800 dark:text-gray-200">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 border-b pb-1 text-sm">Application Details</h4>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <p className="text-gray-500">Student Name</p>
                      <p className="font-semibold">{selectedAdmission.student?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Roll Number</p>
                      <p className="font-semibold">{selectedAdmission.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">College Name</p>
                      <p className="font-semibold">{selectedAdmission.collegeName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Course & Year</p>
                      <p className="font-semibold">{selectedAdmission.course} (Year {selectedAdmission.year})</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Father's Name</p>
                      <p className="font-semibold">{selectedAdmission.fatherName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Emergency Phone</p>
                      <p className="font-semibold">{selectedAdmission.parentPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Blood Group</p>
                      <p className="font-semibold">{selectedAdmission.bloodGroup || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Student Phone</p>
                      <p className="font-semibold">{selectedAdmission.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="text-xs pt-1 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-gray-500">Permanent Address</p>
                    <p className="font-semibold mt-0.5 leading-tight">{selectedAdmission.address}</p>
                  </div>
                </div>

                <Select
                  label="Select Available Room"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  options={rooms.map(room => ({
                    value: room._id,
                    label: `Room ${room.roomNumber} (${room.currentOccupancy}/${room.capacity} beds filled) - ${room.status}`
                  }))}
                  required
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={approveAdmission}
                    disabled={actionLoading || !selectedRoom}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {actionLoading ? 'Allocating...' : 'Approve & Allocate'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowApproveModal(false)
                      setSelectedRoom('')
                    }}
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
            title="Reject Admission Request"
            onClose={() => {
              setShowRejectModal(false)
              setRejectReason('')
            }}
            showCloseButton={false}
          >
            {selectedAdmission && (
              <div className="space-y-4 pt-2">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  <p className="text-sm"><strong>Student Name:</strong> {selectedAdmission.student?.name}</p>
                  <p className="text-sm"><strong>Roll Number:</strong> {selectedAdmission.rollNumber}</p>
                </div>

                <Textarea
                  label="Reason for Rejection"
                  placeholder="Provide feedback on why this request is being rejected."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  required
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="danger"
                    onClick={rejectAdmission}
                    disabled={actionLoading || !rejectReason.trim()}
                    className="flex-1"
                  >
                    {actionLoading ? 'Rejecting...' : 'Reject Request'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowRejectModal(false)
                      setRejectReason('')
                    }}
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
