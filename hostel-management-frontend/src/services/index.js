import apiClient from './apiClient'

// Auth endpoints
export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  signup: (data) => apiClient.post('/auth/signup', data),
  logout: () => apiClient.post('/auth/logout')
}

// Student endpoints
export const studentAPI = {
  getAll: (params) => apiClient.get('/students', { params }),
  getById: (id) => apiClient.get(`/students/${id}`),
  create: (data) => apiClient.post('/students', data),
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  delete: (id) => apiClient.delete(`/students/${id}`)
}

// Room endpoints
export const roomAPI = {
  getAll: () => apiClient.get('/rooms'),
  getById: (id) => apiClient.get(`/rooms/${id}`),
  create: (data) => apiClient.post('/rooms', data),
  update: (id, data) => apiClient.put(`/rooms/${id}`, data),
  delete: (id) => apiClient.delete(`/rooms/${id}`),
  allocateStudent: (roomId, studentId) => apiClient.post(`/rooms/${roomId}/allocate`, { studentId })
}

// Fee endpoints
export const feeAPI = {
  getAll: (params) => apiClient.get('/fees', { params }),
  getById: (id) => apiClient.get(`/fees/${id}`),
  create: (data) => apiClient.post('/fees', data),
  update: (id, data) => apiClient.put(`/fees/${id}`, data),
  markPaid: (id) => apiClient.patch(`/fees/${id}/mark-paid`)
}

// Complaint endpoints
export const complaintAPI = {
  getAll: (params) => apiClient.get('/complaints', { params }),
  getById: (id) => apiClient.get(`/complaints/${id}`),
  create: (data) => apiClient.post('/complaints', data),
  updateStatus: (id, status) => apiClient.patch(`/complaints/${id}/status`, { status }),
  delete: (id) => apiClient.delete(`/complaints/${id}`)
}

// Notice endpoints
export const noticeAPI = {
  getAll: () => apiClient.get('/notices'),
  create: (data) => apiClient.post('/notices', data),
  delete: (id) => apiClient.delete(`/notices/${id}`)
}

// Analytics endpoints
export const analyticsAPI = {
  getDashboard: () => apiClient.get('/analytics/dashboard')
}
