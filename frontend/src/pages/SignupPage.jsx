import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services'
import { Input, Button, Alert } from '../components'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student'
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
        role: formData.role
      })

      login(response.user, response.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.message || (typeof err === 'string' ? err : 'Signup failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4 before:absolute before:w-[500px] before:h-[500px] before:bg-blue-500/20 before:blur-3xl before:rounded-full before:-top-40 before:-left-40 after:absolute after:w-[500px] after:h-[500px] after:bg-purple-500/20 after:blur-3xl after:rounded-full after:-bottom-40 after:-right-40">
      
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden w-full max-w-5xl relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[88vh]">
          
          {/* Left Side */}
          <div className="bg-[#0f172a]/90 backdrop-blur-xl p-8 lg:p-10 flex flex-col justify-start">
            
            <div className="mb-4">
              <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                Create Account
              </h1>

              <p className="text-sm text-gray-400 tracking-wide">
                Join Hostel Hub and manage everything smarter.
              </p>
            </div>

            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError('')}
              />
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 overflow-y-auto hide-scrollbar pr-2 mt-4"
              style={{ maxHeight: 'calc(88vh - 120px)' }}
            >

              {/* Name + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                    Full Name
                  </label>

                  <Input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                    Phone Number
                  </label>

                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                  Email Address
                </label>

                <Input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  required
                />
              </div>


              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                    Password
                  </label>

                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                    Confirm Password
                  </label>

                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Button */}
              <Button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 text-white font-bold py-3 px-4 text-sm rounded-2xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            {/* Login */}
            <p className="text-center text-gray-400 mt-6 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-400 hover:text-white font-semibold transition-all duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-blue-800 to-purple-900 p-10 text-white relative overflow-hidden">
            
            <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center">
              
              <div className="inline-block bg-white/10 backdrop-blur-lg rounded-full p-2 mb-6 border border-white/20 shadow-xl overflow-hidden">
                <img src="/logo.jpeg" alt="Hostel Hub" className="w-20 h-20 rounded-full object-cover" />
              </div>

              <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
                Welcome to Hostel Hub
              </h2>

              <p className="text-lg mb-8 text-blue-100 leading-relaxed">
                Your perfect hostel home awaits
              </p>

              <div className="space-y-4 text-left">
                
                <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="font-semibold text-base">
                      Safe & Secure
                    </p>

                    <p className="text-sm text-blue-100/80">
                      24/7 security monitoring
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="font-semibold text-base">
                      World-Class Facilities
                    </p>

                    <p className="text-sm text-blue-100/80">
                      WiFi, dining, recreation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="font-semibold text-base">
                      Vibrant Community
                    </p>

                    <p className="text-sm text-blue-100/80">
                      500+ happy students
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}