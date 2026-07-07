import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services'
import { Input, Button, Alert } from '../components'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP + New Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const navigate = useNavigate()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await authAPI.forgotPassword(email)
      setSuccess('OTP sent to your email. Please check your inbox.')
      setStep(2)
    } catch (err) {
      setError(err?.message || (typeof err === 'string' ? err : 'Failed to send OTP'))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await authAPI.resetPassword({ email, otp, newPassword })
      setSuccess('Password reset successfully. Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err?.message || (typeof err === 'string' ? err : 'Failed to reset password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4 before:absolute before:w-[500px] before:h-[500px] before:bg-blue-500/20 before:blur-3xl before:rounded-full before:-top-40 before:-left-40 after:absolute after:w-[500px] after:h-[500px] after:bg-purple-500/20 after:blur-3xl after:rounded-full after:-bottom-40 after:-right-40">
      
      <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden w-full max-w-md relative z-10 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-gray-400 tracking-wide">
            {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}
        
        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess('')} />
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-5 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 text-white font-bold py-3 px-4 text-sm rounded-2xl transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                OTP
              </label>
              <Input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2 tracking-wide">
                New Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white/10 border border-white/10 text-white rounded-2xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 text-white font-bold py-3 px-4 text-sm rounded-2xl transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}

        <p className="text-center text-gray-400 mt-6 text-sm">
          Remember your password?{' '}
          <Link
            to="/login"
            className="text-blue-400 hover:text-white font-semibold transition-all duration-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
