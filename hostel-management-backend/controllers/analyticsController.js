import User from '../models/User.js'
import Room from '../models/Room.js'
import Fee from '../models/Fee.js'
import Complaint from '../models/Complaint.js'

export const getDashboardAnalytics = async (req, res) => {
  try {
    // Count total students
    const totalStudents = await User.countDocuments({ role: 'student' })

    // Count total rooms
    const totalRooms = await Room.countDocuments()

    // Get occupancy information
    const rooms = await Room.find()
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0)
    const totalOccupied = rooms.reduce((sum, room) => sum + room.currentOccupancy, 0)
    const occupancyPercentage = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0

    // Fee statistics
    const fees = await Fee.find()
    const paidFees = fees.filter(f => f.status === 'paid')
    const unpaidFees = fees.filter(f => f.status === 'unpaid')
    const totalRevenue = paidFees.reduce((sum, f) => sum + f.amount, 0)
    const pendingFees = unpaidFees.reduce((sum, f) => sum + f.amount, 0)
    const feeCollectionPercentage = fees.length > 0 ? Math.round((paidFees.length / fees.length) * 100) : 0
    const feesPaid = paidFees.length
    const feesUnpaid = unpaidFees.length

    // Complaint statistics
    const complaints = await Complaint.find()
    const openComplaints = complaints.filter(c => c.status !== 'resolved').length
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length

    res.json({
      totalStudents,
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
      totalComplaints: complaints.length
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
