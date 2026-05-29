import { getStatusColor } from '../utils/helpers'
export { Navbar } from './Navbar'
export { Sidebar } from './Sidebar'

export const Badge = ({ status, label = null }) => {
  const colorClass = getStatusColor(status)
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {label || status}
    </span>
  )
}

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  )
}

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'btn font-medium rounded-lg transition-all'
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  }
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <input
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export const Select = ({ label, options, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <select
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export const Textarea = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <textarea
        className={`input resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        rows="4"
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export const Modal = ({ isOpen, title, children, onClose, footer = null }) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 z-50">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <div className="mb-6">{children}</div>
        <div className="flex justify-end space-x-3">
          {footer}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </>
  )
}

export const Table = ({ columns, data, actions = null, loading = false }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-3 text-sm text-gray-900 dark:text-gray-100"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-3 text-sm space-x-2">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const Alert = ({ type = 'info', message, onClose = null }) => {
  const colors = {
    info: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200',
    success: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200'
  }

  return (
    <div className={`p-4 rounded-lg border ${colors[type]} flex justify-between items-center`}>
      <p>{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold cursor-pointer">
          ×
        </button>
      )}
    </div>
  )
}

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

export { LogoutConfirmModal } from './LogoutConfirmModal'
