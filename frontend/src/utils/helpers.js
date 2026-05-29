export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getStatusColor = (status) => {
  const colors = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'unpaid': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'occupied': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'available': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

export const getInitials = (name) => {
  return name
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}

export const showNotification = (message, type = 'info') => {
  // Simple notification - can be enhanced with toast library
  console.log(`[${type.toUpperCase()}] ${message}`)
}
