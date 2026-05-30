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


// Complaint endpoints
export const complaintAPI = {
  getAll: (params) => apiClient.get('/complaints', { params }),
  getStudentComplaints: () => apiClient.get('/complaints/student/my-complaints'),
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

// Admission endpoints
export const admissionAPI = {
  submitRequest: (data) => apiClient.post('/admissions/submit', data),
  getMyStatus: () => apiClient.get('/admissions/my-status'),
  getPending: () => apiClient.get('/admissions/pending'),
  approve: (admissionId, roomId) => apiClient.post('/admissions/approve', { admissionId, roomId }),
  reject: (admissionId, reason) => apiClient.post('/admissions/reject', { admissionId, reason }),
  getAll: (status) => apiClient.get('/admissions/all', { params: { status } }),
  getStats: () => apiClient.get('/admissions/stats')
}

// Payment endpoints
export const paymentAPI = {
  getStudentPayments: () => apiClient.get('/payments/student'),
  getAllPayments: (params) => apiClient.get('/payments', { params }),
  createPayment: (data) => apiClient.post('/payments', data),
  updatePaymentStatus: (paymentId, data) => apiClient.put(`/payments/${paymentId}`, data),
  processPayment: (paymentId) => apiClient.post(`/payments/process/${paymentId}`),
  generateInvoice: (paymentId) => apiClient.get(`/payments/invoice/${paymentId}`),
  deletePayment: (paymentId) => apiClient.delete(`/payments/${paymentId}`)
}

// Attendance endpoints
export const attendanceAPI = {
  checkIn: () => apiClient.post('/attendance/check-in'),
  checkOut: () => apiClient.post('/attendance/check-out'),
  getStudentAttendance: (params) => apiClient.get('/attendance/student', { params }),
  getAllAttendance: (params) => apiClient.get('/attendance', { params }),
  markAttendance: (userId, data) => apiClient.post(`/attendance/mark/${userId}`, data),
  requestLeave: (data) => apiClient.post('/attendance/leave-request', data)
}

// Notification endpoints
export const notificationAPI = {
  getNotifications: (params) => apiClient.get('/notifications', { params }),
  getStats: () => apiClient.get('/notifications/stats'),
  markAsRead: (notificationId) => apiClient.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  deleteNotification: (notificationId) => apiClient.delete(`/notifications/${notificationId}`),
  clearAll: () => apiClient.delete('/notifications/clear-all'),
  sendNotification: (userId, data) => apiClient.post(`/notifications/send/${userId}`, data),
  sendBulkNotifications: (data) => apiClient.post('/notifications/bulk', data)
}
