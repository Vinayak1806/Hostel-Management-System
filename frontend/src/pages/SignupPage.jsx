import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services'
import { Input, Button, Select, Alert } from '../components'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    rollNumber: '',
    semester: '1'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        rollNumber: formData.rollNumber,
        semester: formData.semester
      })
      login(response.user, response.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">HMS</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Create Your Account</p>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="tel"
            name="phone"
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {formData.role === 'student' && (
            <>
              <Input
                type="text"
                name="rollNumber"
                label="Roll Number"
                placeholder="21CS001"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
              <Select
                name="semester"
                label="Semester"
                value={formData.semester}
                onChange={handleChange}
                options={[
                  { value: '1', label: '1st Semester' },
                  { value: '2', label: '2nd Semester' },
                  { value: '3', label: '3rd Semester' },
                  { value: '4', label: '4th Semester' },
                  { value: '5', label: '5th Semester' },
                  { value: '6', label: '6th Semester' },
                  { value: '7', label: '7th Semester' },
                  { value: '8', label: '8th Semester' }
                ]}
              />
            </>
          )}

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
