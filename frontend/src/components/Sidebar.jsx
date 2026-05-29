import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Home, Users, Bed, DollarSign, AlertCircle, Clipboard, LogOut, Menu, X, FileText
} from 'lucide-react'
import { useState } from 'react'
import { LogoutConfirmModal } from './LogoutConfirmModal'

export const Sidebar = () => {
  const { isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    try {
      logout()
      navigate('/')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  const adminMenuItems = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/admissions', label: 'Admissions', icon: FileText },
    { path: '/admin/students', label: 'Students', icon: Users },
    { path: '/admin/rooms', label: 'Rooms', icon: Bed },
    { path: '/admin/fees', label: 'Fees', icon: DollarSign },
    { path: '/admin/complaints', label: 'Complaints', icon: AlertCircle },
    { path: '/admin/notices', label: 'Notices', icon: Clipboard }
  ]

  const studentMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admission', label: 'Admission', icon: FileText },
    { path: '/complaints', label: 'Complaints', icon: AlertCircle },
    { path: '/notices', label: 'Notices', icon: Clipboard }
  ]

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems

  const isActive = (path) => location.pathname === path

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">HMS</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Hostel Management</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogoutClick}
        className="m-4 flex items-center space-x-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-800 shadow-md border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setIsOpen(false)} />
        )}

        <div
          className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg z-40 transform transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        isLoading={isLoggingOut}
      />
    </>
  )
}

export default Sidebar
