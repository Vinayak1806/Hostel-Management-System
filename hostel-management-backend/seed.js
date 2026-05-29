import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Room from './models/Room.js'
import Fee from './models/Fee.js'
import Complaint from './models/Complaint.js'
import Notice from './models/Notice.js'

dotenv.config()

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel-management')
    console.log('✓ Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Room.deleteMany({})
    await Fee.deleteMany({})
    await Complaint.deleteMany({})
    await Notice.deleteMany({})
    console.log('✓ Cleared existing data')

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hostel.com',
      phone: '9876543210',
      password: 'admin123',
      role: 'admin'
    })
    console.log('✓ Created admin user')

    // Create student users
    const students = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@hostel.com',
        phone: '9876543211',
        password: 'student123',
        rollNumber: '21CS001',
        semester: 3,
        role: 'student'
      },
      {
        name: 'Jane Smith',
        email: 'jane@hostel.com',
        phone: '9876543212',
        password: 'student123',
        rollNumber: '21CS002',
        semester: 3,
        role: 'student'
      },
      {
        name: 'Bob Wilson',
        email: 'bob@hostel.com',
        phone: '9876543213',
        password: 'student123',
        rollNumber: '21CS003',
        semester: 2,
        role: 'student'
      },
      {
        name: 'Alice Brown',
        email: 'alice@hostel.com',
        phone: '9876543214',
        password: 'student123',
        rollNumber: '21CS004',
        semester: 4,
        role: 'student'
      }
    ])
    console.log('✓ Created 4 student users')

    // Create rooms
    const rooms = await Room.insertMany([
      {
        roomNumber: '101',
        floor: 1,
        capacity: 2,
        currentOccupancy: 2,
        allocatedStudents: [students[0]._id, students[1]._id],
        status: 'occupied'
      },
      {
        roomNumber: '102',
        floor: 1,
        capacity: 2,
        currentOccupancy: 1,
        allocatedStudents: [students[2]._id],
        status: 'available'
      },
      {
        roomNumber: '201',
        floor: 2,
        capacity: 3,
        currentOccupancy: 1,
        allocatedStudents: [students[3]._id],
        status: 'available'
      },
      {
        roomNumber: '202',
        floor: 2,
        capacity: 2,
        currentOccupancy: 0,
        allocatedStudents: [],
        status: 'available'
      }
    ])
    console.log('✓ Created 4 rooms')

    // Update students with room numbers
    await User.findByIdAndUpdate(students[0]._id, { roomNumber: '101' })
    await User.findByIdAndUpdate(students[1]._id, { roomNumber: '101' })
    await User.findByIdAndUpdate(students[2]._id, { roomNumber: '102' })
    await User.findByIdAndUpdate(students[3]._id, { roomNumber: '201' })

    // Create fees
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    
    await Fee.insertMany([
      {
        student: students[0]._id,
        studentName: students[0].name,
        studentRoll: students[0].rollNumber,
        amount: 5000,
        dueDate: nextMonth,
        status: 'paid',
        paidDate: new Date(),
        description: 'Hostel Fee - May 2026'
      },
      {
        student: students[1]._id,
        studentName: students[1].name,
        studentRoll: students[1].rollNumber,
        amount: 5000,
        dueDate: nextMonth,
        status: 'unpaid',
        description: 'Hostel Fee - May 2026'
      },
      {
        student: students[2]._id,
        studentName: students[2].name,
        studentRoll: students[2].rollNumber,
        amount: 5000,
        dueDate: nextMonth,
        status: 'paid',
        paidDate: new Date(),
        description: 'Hostel Fee - May 2026'
      },
      {
        student: students[3]._id,
        studentName: students[3].name,
        studentRoll: students[3].rollNumber,
        amount: 5000,
        dueDate: nextMonth,
        status: 'unpaid',
        description: 'Hostel Fee - May 2026'
      }
    ])
    console.log('✓ Created 4 fee entries')

    // Create complaints
    await Complaint.insertMany([
      {
        student: students[0]._id,
        studentName: students[0].name,
        title: 'Water tap is leaking',
        description: 'The water tap in room 101 is leaking constantly.',
        category: 'maintenance',
        status: 'resolved',
        priority: 'high',
        resolution: 'Tap has been replaced',
        resolvedDate: new Date()
      },
      {
        student: students[1]._id,
        studentName: students[1].name,
        title: 'Food quality issue',
        description: 'The food served today was not fresh.',
        category: 'food',
        status: 'in-progress',
        priority: 'medium'
      },
      {
        student: students[2]._id,
        studentName: students[2].name,
        title: 'Cleanliness issue in corridor',
        description: 'The corridors are not being cleaned regularly.',
        category: 'cleanliness',
        status: 'pending',
        priority: 'low'
      }
    ])
    console.log('✓ Created 3 complaints')

    // Create notices
    await Notice.insertMany([
      {
        title: 'Hostel Maintenance Schedule',
        content: 'Hostel maintenance will be conducted on the first Saturday of every month. Please ensure your rooms are accessible.',
        category: 'maintenance',
        postedBy: admin._id,
        isActive: true
      },
      {
        title: 'Sports Day Announcement',
        content: 'Annual hostel sports day will be held on June 15, 2026. All students are invited to participate.',
        category: 'event',
        postedBy: admin._id,
        isActive: true
      },
      {
        title: 'Important: Fee Submission Deadline',
        content: 'Please submit your hostel fees by the end of this month. Late submission will attract a penalty.',
        category: 'rules',
        postedBy: admin._id,
        isActive: true
      }
    ])
    console.log('✓ Created 3 notices')

    console.log('\n✅ Database seeded successfully!')
    console.log('\nDemo Accounts:')
    console.log('Admin: admin@hostel.com / admin123')
    console.log('Student: john@hostel.com / student123')

    await mongoose.connection.close()
  } catch (error) {
    console.error('✗ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
