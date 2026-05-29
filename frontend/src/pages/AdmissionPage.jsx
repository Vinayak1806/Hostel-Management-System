import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar, Sidebar, Card, Button, Input, Select, Textarea, Alert } from '../components'
import { admissionAPI } from '../services'

export default function AdmissionPage() {
  const navigate = useNavigate()
  const [admissionStatus, setAdmissionStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    course: '',
    year: 1,
    semester: 1,
    address: '',
    parentPhone: ''
  })

  useEffect(() => {
    fetchAdmissionStatus()
  }, [])

  const fetchAdmissionStatus = async () => {
    try {
      const response = await admissionAPI.getMyStatus()
      setAdmissionStatus(response)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching admission status:', err)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'semester' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const response = await admissionAPI.submitRequest(formData)
      setSuccess('Admission request submitted successfully! Please wait for admin approval.')
      setShowForm(false)
      setTimeout(() => fetchAdmissionStatus(), 1000)
    } catch (err) {
      setError(err.message || 'Failed to submit admission request')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'approved': return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300'
      case 'not_applied': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '⏳ Pending - Waiting for admin approval'
      case 'approved': return '✅ Approved - Room allocated'
      case 'rejected': return '❌ Rejected'
      case 'not_applied': return '📝 Apply for admission'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar title="Admission" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            {/* Current Status */}
            <Card className="mb-6">
              <div className={`p-6 rounded-lg border ${getStatusColor(admissionStatus?.status)}`}>
                <p className="text-lg font-semibold mb-2">Admission Status</p>
                <p className="text-base">{getStatusText(admissionStatus?.status)}</p>
              </div>
            </Card>

            {/* Show form only if not applied or rejected */}
            {(admissionStatus?.status === 'not_applied' || admissionStatus?.status === 'rejected') && (
              <>
                {!showForm ? (
                  <Button onClick={() => setShowForm(true)} className="w-full mb-6">
                    Submit Admission Request
                  </Button>
                ) : (
                  <Card className="p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">Admission Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        label="Course"
                        name="course"
                        type="text"
                        placeholder="e.g., B.Tech CSE"
                        value={formData.course}
                        onChange={handleChange}
                        required
                      />

                      <Select
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        options={[
                          { value: 1, label: '1st Year' },
                          { value: 2, label: '2nd Year' },
                          { value: 3, label: '3rd Year' },
                          { value: 4, label: '4th Year' }
                        ]}
                      />

                      <Select
                        label="Semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        options={[
                          { value: 1, label: 'Semester 1' },
                          { value: 2, label: 'Semester 2' },
                          { value: 3, label: 'Semester 3' },
                          { value: 4, label: 'Semester 4' },
                          { value: 5, label: 'Semester 5' },
                          { value: 6, label: 'Semester 6' },
                          { value: 7, label: 'Semester 7' },
                          { value: 8, label: 'Semester 8' }
                        ]}
                      />

                      <Textarea
                        label="Address"
                        name="address"
                        placeholder="Enter your permanent address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />

                      <Input
                        label="Parent Phone Number"
                        name="parentPhone"
                        type="tel"
                        placeholder="Enter parent's phone number"
                        value={formData.parentPhone}
                        onChange={handleChange}
                      />

                      <div className="flex gap-3">
                        <Button type="submit" disabled={submitting}>
                          {submitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}
              </>
            )}

            {/* Show details if admission is approved or pending */}
            {admissionStatus?.admission && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Admission Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Roll Number:</span>
                    <span className="dark:text-gray-200">{admissionStatus.admission.rollNumber}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Course:</span>
                    <span className="dark:text-gray-200">{admissionStatus.admission.course}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Year:</span>
                    <span className="dark:text-gray-200">{admissionStatus.admission.year}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Semester:</span>
                    <span className="dark:text-gray-200">{admissionStatus.admission.semester}</span>
                  </div>
                  {admissionStatus.admission.roomAssigned && (
                    <div className="flex justify-between border-b pb-2 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      <span className="font-medium text-green-600 dark:text-green-400">Room Assigned:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {admissionStatus.admission.roomAssigned}
                      </span>
                    </div>
                  )}
                  {admissionStatus.admission.rejectionReason && (
                    <div className="border-b pb-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                      <span className="font-medium text-red-600 dark:text-red-400">Rejection Reason:</span>
                      <p className="text-red-600 dark:text-red-400 mt-1">
                        {admissionStatus.admission.rejectionReason}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Submitted:</span>
                    <span className="dark:text-gray-200">
                      {new Date(admissionStatus.admission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
