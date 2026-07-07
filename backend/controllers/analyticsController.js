import User from '../models/User.js'
import Room from '../models/Room.js'
import Payment from '../models/Payment.js'
import Complaint from '../models/Complaint.js'
import Attendance from '../models/Attendance.js'
import Notification from '../models/Notification.js'
import Notice from '../models/Notice.js'

export const getDashboardAnalytics = async (req, res) => {
  try {
    // Student statistics
    const totalStudents = await User.countDocuments({ role: 'student' })
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true })
    
    // Room statistics
    const rooms = await Room.find()
    const totalRooms = rooms.length
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0)
    const totalOccupied = rooms.reduce((sum, room) => sum + room.currentOccupancy, 0)
    const occupancyPercentage = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0

    // Fee & Payment statistics
    const payments = await Payment.find()
    const paidPayments = payments.filter(p => p.status === 'completed')
    const pendingPaymentsList = payments.filter(p => p.status === 'pending')
    
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0)
    const pendingFees = pendingPaymentsList.reduce((sum, p) => sum + p.amount, 0)
    const feeCollectionPercentage = payments.length > 0 ? Math.round((paidPayments.length / payments.length) * 100) : 0
    
    const feesPaid = paidPayments.length
    const feesUnpaid = pendingPaymentsList.length

    // Complaint statistics
    const complaints = await Complaint.find()
    const openComplaints = complaints.filter(c => c.status !== 'resolved').length
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length

    // Attendance statistics (Last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentAttendance = await Attendance.find({ date: { $gte: thirtyDaysAgo } })
    const presentCount = recentAttendance.filter(r => r.status === 'present' || r.status === 'late').length
    const attendancePercentage = recentAttendance.length > 0 ? Math.round((presentCount / recentAttendance.length) * 100) : 0

    // Recent Activity - Broadcasts/Notices
    const recentNotices = await Notice.find({ isActive: true }).sort({ createdAt: -1 }).limit(5)
    const recentNotifications = recentNotices.map(notice => ({
      title: notice.title,
      message: notice.content,
      createdAt: notice.createdAt
    }))
    
    const recentPayments = await Payment.find().sort({ createdAt: -1 }).populate('student', 'name').limit(5)

    res.json({
      totalStudents,
      activeStudents,
      totalRooms,
      occupancyPercentage,
      totalOccupied,
      totalCapacity,
      totalRevenue,
      pendingFees,
      openComplaints,
      resolvedComplaints,
      feeCollectionPercentage,
      feesPaid,
      feesUnpaid,
      totalComplaints: complaints.length,
      attendancePercentage,
      recentNotifications,
      recentPayments,
      chartData: {
        occupancyData: [
          { name: 'Occupied', value: totalOccupied },
          { name: 'Vacant', value: totalCapacity - totalOccupied }
        ],
        monthlyRevenue: await getMonthlyRevenue(),
        complaintTrends: await getComplaintTrends()
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function getMonthlyRevenue() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  
  const payments = await Payment.find({
    status: 'completed',
    createdAt: { $gte: sixMonthsAgo }
  })
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dataMap = {}
  
  for (let i = 0; i < 6; i++) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    dataMap[months[d.getMonth()]] = 0
  }
  
  payments.forEach(p => {
    const month = months[p.createdAt.getMonth()]
    if (dataMap[month] !== undefined) {
      dataMap[month] += p.amount
    }
  })
  
  return Object.keys(dataMap).map(name => ({ name, revenue: dataMap[name] })).reverse()
}

async function getComplaintTrends() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  
  const complaints = await Complaint.find({
    createdAt: { $gte: sixMonthsAgo }
  })
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dataMap = {}
  
  for (let i = 0; i < 6; i++) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    dataMap[months[d.getMonth()]] = 0
  }
  
  complaints.forEach(c => {
    const month = months[c.createdAt.getMonth()]
    if (dataMap[month] !== undefined) {
      dataMap[month] += 1
    }
  })
  
  return Object.keys(dataMap).map(name => ({ name, count: dataMap[name] })).reverse()
}
