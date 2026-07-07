import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, User, Phone, MapPin, Award, Heart, ClipboardCheck, Sparkles, Ban } from 'lucide-react'
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
    rollNumber: '',
    course: '',
    year: 1,
    semester: 1,
    address: '',
    parentPhone: '',
    collegeName: '',
    fatherName: '',
    motherName: '',
    bloodGroup: ''
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
      await admissionAPI.submitRequest(formData)
      setSuccess('Hostel admission request submitted successfully! Pending admin review.')
      setShowForm(false)
      setTimeout(() => fetchAdmissionStatus(), 1000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit admission request')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
      case 'approved': return 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      case 'rejected': return 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      case 'not_applied': return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
      default: return 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '⏳ Pending - Your application is currently under admin review.'
      case 'approved': return '✅ Approved - Congratulations! Your room has been allocated.'
      case 'rejected': return '❌ Rejected - Please review the reasoning below and try applying again.'
      case 'not_applied': return '📝 Ready to Apply - Create your hostel admission request now.'
      default: return status
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="Admission Portal" />
        <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="max-w-4xl mx-auto">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Current Status Card */}
                <Card className="mb-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                  <div className={`p-6 border-l-4 border-blue-500 ${getStatusColor(admissionStatus?.status)}`}>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-gray-900 dark:text-white">
                      <ClipboardCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Admission Status Details
                    </h3>
                    <p className="text-sm font-semibold">{getStatusText(admissionStatus?.status)}</p>
                  </div>
                </Card>

                {/* Show form only if not applied or rejected */}
                {(admissionStatus?.status === 'not_applied' || admissionStatus?.status === 'rejected') && (
                  <>
                    {!showForm ? (
                      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
                        <Sparkles className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-bounce" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Apply for Hostel Admission</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                          Complete your application profile to apply for room allocation, dining plan, and other premium hostel amenities.
                        </p>
                        <Button onClick={() => setShowForm(true)} size="lg" className="px-8 shadow-md">
                          Fill Admission Application Form
                        </Button>
                      </div>
                    ) : (
                      <Card className="p-8 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-gray-700">
                          Hostel Admission Form
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Academic Information */}
                          <div>
                            <h3 className="text-base font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                              <Building2 className="w-4.5 h-4.5" /> Academic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                label="College Name"
                                name="collegeName"
                                type="text"
                                placeholder="e.g., Indian Institute of Technology"
                                value={formData.collegeName}
                                onChange={handleChange}
                                required
                              />

                              <Input
                                label="Course Name"
                                name="course"
                                type="text"
                                placeholder="e.g., B.Tech CSE"
                                value={formData.course}
                                onChange={handleChange}
                                required
                              />

                              <Input
                                label="Roll Number"
                                name="rollNumber"
                                type="text"
                                placeholder="e.g., 2023CS101"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                required
                              />

                              <Select
                                label="Year of Study"
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
                            </div>
                          </div>

                          {/* Guardian & Emergency Contact */}
                          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-base font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                              <User className="w-4.5 h-4.5" /> Parent / Guardian Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                label="Father's Name"
                                name="fatherName"
                                type="text"
                                placeholder="Father's Full Name"
                                value={formData.fatherName}
                                onChange={handleChange}
                                required
                              />

                              <Input
                                label="Mother's Name"
                                name="motherName"
                                type="text"
                                placeholder="Mother's Full Name"
                                value={formData.motherName}
                                onChange={handleChange}
                                required
                              />

                              <Input
                                label="Parent Phone Number"
                                name="parentPhone"
                                type="tel"
                                placeholder="Emergency Mobile Number"
                                value={formData.parentPhone}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          {/* Personal Details */}
                          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-base font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                              <Heart className="w-4.5 h-4.5" /> Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-1">
                                <Select
                                  label="Blood Group"
                                  name="bloodGroup"
                                  value={formData.bloodGroup}
                                  onChange={handleChange}
                                  options={[
                                    { value: 'A+', label: 'A+' },
                                    { value: 'A-', label: 'A-' },
                                    { value: 'B+', label: 'B+' },
                                    { value: 'B-', label: 'B-' },
                                    { value: 'AB+', label: 'AB+' },
                                    { value: 'AB-', label: 'AB-' },
                                    { value: 'O+', label: 'O+' },
                                    { value: 'O-', label: 'O-' }
                                  ]}
                                  required
                                />
                              </div>
                              <div className="md:col-span-3">
                                <Textarea
                                  label="Permanent Address"
                                  name="address"
                                  placeholder="Provide complete residential address for communications"
                                  value={formData.address}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Button type="submit" disabled={submitting} className="flex-1 shadow-md">
                              {submitting ? 'Submitting Application...' : 'Submit Application'}
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setShowForm(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Card>
                    )}
                  </>
                )}

                {/* Redesigned Premium Details Card if Application is Approved or Pending */}
                {admissionStatus?.admission && (
                  <Card className="p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md space-y-8">
                    <div className="flex justify-between items-center border-b pb-4 border-gray-100 dark:border-gray-700">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Admission Request Summary</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Submitted on {new Date(admissionStatus.admission.createdAt).toLocaleDateString()}</p>
                      </div>
                      {admissionStatus.admission.roomAssigned && (
                        <div className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 shadow-sm">
                          <Building2 className="w-4 h-4" />
                          Allocated Room: {admissionStatus.admission.roomAssigned}
                        </div>
                      )}
                    </div>

                    {/* Three Column Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Column 1: Academic details */}
                      <div className="space-y-4 bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2 uppercase tracking-wide">
                          <Award className="w-4 h-4" /> Academic Info
                        </h4>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">College / Institution</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{admissionStatus.admission.collegeName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Course & Year</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{admissionStatus.admission.course} (Year {admissionStatus.admission.year})</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Semester & Roll Number</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">Sem {admissionStatus.admission.semester} - {admissionStatus.admission.rollNumber}</p>
                        </div>
                      </div>

                      {/* Column 2: Guardian Details */}
                      <div className="space-y-4 bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2 uppercase tracking-wide">
                          <User className="w-4 h-4" /> Guardian Details
                        </h4>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Father's Name</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{admissionStatus.admission.fatherName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Mother's Name</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{admissionStatus.admission.motherName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Parent Phone / Emergency</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" /> {admissionStatus.admission.parentPhone || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Column 3: Personal & Address Details */}
                      <div className="space-y-4 bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-2 uppercase tracking-wide">
                          <Heart className="w-4 h-4" /> Contact & Health
                        </h4>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{admissionStatus.admission.bloodGroup || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Student Phone Number</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" /> {admissionStatus.admission.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Permanent Address</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5 flex items-start gap-1.5 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" /> 
                            <span className="leading-tight">{admissionStatus.admission.address}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Display */}
                    {admissionStatus.admission.rejectionReason && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800 flex items-start gap-3">
                        <Ban className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Application Rejection Feedback</h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{admissionStatus.admission.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
