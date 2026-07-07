import { useState, useEffect, useRef } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Navbar, Card, Input, Button, Alert, LoadingSpinner } from '../components'
import { profileAPI, admissionAPI } from '../services'
import { useAuth } from '../context/AuthContext'
import { Camera, Save, X, Edit2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    permanentAddress: '',
    parentPhone: '',
    rollNumber: '',
    semester: '',
    course: '',
    collegeName: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let profileData = null
        let admissionData = null

        if (user?.role === 'student') {
          const [profRes, admRes] = await Promise.all([
            profileAPI.getProfile().catch(() => null),
            admissionAPI.getMyStatus().catch(() => null)
          ])
          profileData = profRes
          admissionData = admRes?.admission
        } else {
          profileData = await profileAPI.getProfile()
        }

        // Merge admission data into profile for display as source of truth
        const mergedProfile = { ...profileData }
        if (admissionData) {
          mergedProfile.rollNumber = admissionData.rollNumber || mergedProfile.rollNumber
          mergedProfile.course = admissionData.course || mergedProfile.course
          mergedProfile.semester = admissionData.semester || mergedProfile.semester
          mergedProfile.collegeName = admissionData.collegeName || mergedProfile.collegeName
          mergedProfile.year = admissionData.year || mergedProfile.year
          // Prefer admission address/parent phone if not in profile
          mergedProfile.permanentAddress = mergedProfile.permanentAddress || admissionData.address
          mergedProfile.parentPhone = mergedProfile.parentPhone || admissionData.parentPhone
        }

        setProfile(mergedProfile)
        setFormData({
          name: mergedProfile.name || '',
          phone: mergedProfile.phone || '',
          permanentAddress: mergedProfile.permanentAddress || '',
          parentPhone: mergedProfile.parentPhone || '',
          rollNumber: mergedProfile.rollNumber || '',
          semester: mergedProfile.semester || '',
          course: mergedProfile.course || '',
          collegeName: mergedProfile.collegeName || ''
        })
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user?.role])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const response = await profileAPI.updateProfile(formData)
      setProfile(response.user)
      updateUser(response.user) // Sync to global state
      setSuccess('Profile updated successfully')
      setIsEditing(false) // Exit edit mode on success
    } catch (err) {
      setError(err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result
      try {
        setLoading(true)
        const response = await profileAPI.uploadPhoto({ profilePhoto: base64String })
        setProfile(response.user)
        updateUser(response.user) // Sync to global state
        setSuccess('Profile photo updated')
      } catch (err) {
        setError(err?.message || 'Failed to upload photo')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCancelEdit = () => {
    // Revert form data to profile state
    setFormData({
      name: profile.name || '',
      phone: profile.phone || '',
      permanentAddress: profile.permanentAddress || '',
      parentPhone: profile.parentPhone || '',
      rollNumber: profile.rollNumber || '',
      semester: profile.semester || '',
      course: profile.course || '',
      collegeName: profile.collegeName || ''
    })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  const ReadOnlyField = ({ label, value }) => (
    <div className="mb-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-white">{value || '-'}</p>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar title="My Profile" />

        <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

          {/* Profile Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current.click()}>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-50 dark:border-blue-900/30 bg-gray-100 dark:bg-gray-800 shadow-sm transition-transform group-hover:scale-105">
                {profile?.profilePhoto ? (
                  <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-500">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white mb-1" size={24} />
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
            </div>
            
            <div className="flex flex-col justify-center h-full pt-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                {profile?.name}
              </h1>
              <div className="flex items-center gap-3 justify-center md:justify-start mt-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-sm font-semibold capitalize border border-emerald-100 dark:border-emerald-800/50">
                  {profile?.role}
                </span>
                {profile?.role === 'student' && profile?.roomNumber && (
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Room {profile.roomNumber}
                  </span>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <div className="md:ml-auto self-center mt-4 md:mt-0">
                <Button type="button" onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <Edit2 size={16} /> Edit Profile
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h2>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl border border-gray-100 dark:border-gray-700 font-medium">
                      {profile?.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" />
                  </div>
                  {profile?.role === 'student' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Parent's Phone</label>
                        <Input name="parentPhone" value={formData.parentPhone} onChange={handleChange} placeholder="+91" />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                  <ReadOnlyField label="Full Name" value={profile?.name} />
                  <ReadOnlyField label="Email Address" value={profile?.email} />
                  <ReadOnlyField label="Phone Number" value={profile?.phone} />
                  {profile?.role === 'student' && (
                    <ReadOnlyField label="Parent's Phone" value={profile?.parentPhone} />
                  )}
                </div>
              )}
            </div>

            {/* Academic Information Card (Students Only) */}
            {profile?.role === 'student' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Academic Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6">
                  <ReadOnlyField label="College Name" value={profile?.collegeName} />
                  <ReadOnlyField label="Course" value={profile?.course} />
                  <ReadOnlyField label="Roll Number" value={profile?.rollNumber} />
                  <ReadOnlyField label="Semester" value={profile?.semester} />
                </div>
              </div>
            )}

            {/* Address Card (Students Only) */}
            {profile?.role === 'student' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Address Details</h2>
                </div>

                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Permanent Address</label>
                    <textarea
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                    ></textarea>
                  </div>
                ) : (
                  <div>
                    <ReadOnlyField label="Permanent Address" value={profile?.permanentAddress} />
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons for Edit Mode */}
            {isEditing && (
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={handleCancelEdit} className="px-6 rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex items-center gap-2 px-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  )
}
