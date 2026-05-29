import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">Page Not Found</p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-all"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}
