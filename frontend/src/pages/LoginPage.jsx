import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services'
import { Input, Button, Alert } from '../components'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
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
    setLoading(true)

    try {
      const response = await authAPI.login(formData.email, formData.password)
      login(response.user, response.token)
      navigate(response.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">HMS</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Hostel Management System</p>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Demo Admin:</strong> admin@hostel.com / admin123
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Demo Student:</strong> student@hostel.com / student123
          </p>
        </div>
      </div>
    </div>
  )
}
