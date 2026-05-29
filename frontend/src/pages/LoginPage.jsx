import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services'
import { Input, Button, Alert } from '../components'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [selectedRole, setSelectedRole] = useState('student')
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

      if (response.user.role !== selectedRole) {
        setError(`This account is registered as ${response.user.role}`)
        setLoading(false)
        return
      }

      login(response.user, response.token)
      navigate(response.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <LogIn className="text-blue-300" />
            </div>

            <h1 className="text-3xl font-extrabold text-white">
              Welcome Back
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Login to continue to HostelHub
            </p>
          </div>

          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          {/* Role Toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedRole === 'student'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Student
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Email Address
              </label>

              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Password
              </label>

              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="#"
                className="text-xs text-gray-400 hover:text-blue-400 transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:scale-[1.02] transition-all duration-300 text-white font-bold py-3 rounded-2xl shadow-lg"
            >
              {loading ? 'Signing In...' : 'Login'}
            </Button>
          </form>

          {/* Signup */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don’t have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-white font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © HostelHub — Smart Hostel Management System
        </p>
      </div>
    </div>
  )
}