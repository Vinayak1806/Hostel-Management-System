import Room from '../models/Room.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'
import { sendEmail, emailTemplates } from '../utils/emailService.js'

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('allocatedStudents', 'name rollNumber')
    res.json(rooms)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('allocatedStudents', 'name rollNumber')
    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }
    res.json(room)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createRoom = async (req, res) => {
  try {
    const { roomNumber, floor, capacity } = req.body

    let room = await Room.findOne({ roomNumber })
    if (room) {
      return res.status(400).json({ message: 'Room already exists' })
    }

    room = new Room({
      roomNumber,
      floor,
      capacity,
      currentOccupancy: 0
    })

    await room.save()
    res.status(201).json(room)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateRoom = async (req, res) => {
  try {
    const { floor, capacity } = req.body
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { floor, capacity },
      { new: true }
    )

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    res.json(room)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id)
    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }
    res.json({ message: 'Room deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const allocateStudent = async (req, res) => {
  try {
    const { studentId } = req.body
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({ message: 'Room is full' })
    }

    if (room.allocatedStudents.includes(studentId)) {
      return res.status(400).json({ message: 'Student already allocated to this room' })
    }

    room.allocatedStudents.push(studentId)
    room.currentOccupancy += 1

    if (room.currentOccupancy === room.capacity) {
      room.status = 'occupied'
    }

    await room.save()

    // Update student's room number
    const studentUser = await User.findByIdAndUpdate(studentId, { roomNumber: room.roomNumber }, { new: true })

    // Send system notification
    new Notification({
      recipient: studentId,
      title: 'Room Allocated',
      message: `You have been allocated Room ${room.roomNumber} on floor ${room.floor}.`,
      type: 'general',
      category: 'success'
    }).save()

    // Send email
    if (studentUser && studentUser.email) {
      await sendEmail({
        to: studentUser.email,
        subject: 'Room Allocated',
        html: emailTemplates.roomAllocation(studentUser.name, room.roomNumber, room.floor)
      })
    }

    res.json(room)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
