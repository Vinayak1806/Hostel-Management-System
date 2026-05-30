import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Room from './models/Room.js'
import Payment from './models/Payment.js'
import Complaint from './models/Complaint.js'
import Notice from './models/Notice.js'
import Admission from './models/Admission.js'
import Notification from './models/Notification.js'

dotenv.config()

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel-management')
    console.log('✓ Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Room.deleteMany({})
    await Payment.deleteMany({})
    await Complaint.deleteMany({})
    await Notice.deleteMany({})
    await Admission.deleteMany({})
    await Notification.deleteMany({})
    console.log('✓ Cleared all existing data from database')

    // Create admin user
    const admin = await User.create({
      name: 'Rajesh Kumar',
      email: 'admin@hostel.com',
      phone: '9876543210',
      password: 'admin123',
      role: 'admin'
    })
    console.log('✓ Created Admin: Rajesh Kumar')

    // Create student users
    const studentsData = [
      {
        name: 'Aarav Sharma',
        email: 'aarav@hostel.com',
        phone: '9876543211',
        password: 'student123',
        rollNumber: '21CS001',
        semester: 5,
        role: 'student'
      },
      {
        name: 'Priyanshu Patel',
        email: 'priyanshu@hostel.com',
        phone: '9876543212',
        password: 'student123',
        rollNumber: '21CS002',
        semester: 3,
        role: 'student'
      },
      {
        name: 'Rohan Verma',
        email: 'rohan@hostel.com',
        phone: '9876543213',
        password: 'student123',
        rollNumber: '21CS003',
        semester: 3,
        role: 'student'
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya@hostel.com',
        phone: '9876543214',
        password: 'student123',
        rollNumber: '21CS004',
        semester: 7,
        role: 'student'
      }
    ]

    const students = []
    for (const studentData of studentsData) {
      const student = await User.create(studentData)
      students.push(student)
    }
    console.log('✓ Created 4 Indian student users')

    // Create rooms
    const rooms = await Room.insertMany([
      {
        roomNumber: '101',
        floor: 1,
        capacity: 2,
        currentOccupancy: 2,
        allocatedStudents: [students[0]._id, students[1]._id],
        status: 'full'
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
    await User.findByIdAndUpdate(students[0]._id, { roomNumber: '101', isActive: true })
    await User.findByIdAndUpdate(students[1]._id, { roomNumber: '101', isActive: true })
    await User.findByIdAndUpdate(students[2]._id, { roomNumber: '102', isActive: true })
    await User.findByIdAndUpdate(students[3]._id, { roomNumber: '201', isActive: true })

    // Create fees/payments using correct Payment model schema
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    
    await Payment.insertMany([
      {
        student: students[0]._id,
        amount: 5000,
        dueDate: nextMonth,
        status: 'completed',
        paidAt: new Date(),
        description: 'Hostel Fee - May 2026',
        paymentMethod: 'razorpay',
        semester: 5
      },
      {
        student: students[1]._id,
        amount: 5000,
        dueDate: nextMonth,
        status: 'pending',
        description: 'Hostel Fee - May 2026',
        paymentMethod: 'razorpay',
        semester: 3
      },
      {
        student: students[2]._id,
        amount: 5000,
        dueDate: nextMonth,
        status: 'completed',
        paidAt: new Date(),
        description: 'Hostel Fee - May 2026',
        paymentMethod: 'razorpay',
        semester: 3
      },
      {
        student: students[3]._id,
        amount: 5000,
        dueDate: nextMonth,
        status: 'pending',
        description: 'Hostel Fee - May 2026',
        paymentMethod: 'razorpay',
        semester: 7
      }
    ])
    console.log('✓ Created 4 payment entries')

    // Create complaints
    await Complaint.insertMany([
      {
        student: students[0]._id,
        studentName: students[0].name,
        title: 'Water tap is leaking',
        description: 'The bathroom water tap in room 101 is leaking constantly.',
        category: 'maintenance',
        status: 'resolved',
        priority: 'high',
        resolution: 'Tap has been replaced',
        resolvedDate: new Date()
      },
      {
        student: students[1]._id,
        studentName: students[1].name,
        title: 'Mess food quality issue',
        description: 'The food served at breakfast today was cold and poorly prepared.',
        category: 'food',
        status: 'in-progress',
        priority: 'medium'
      },
      {
        student: students[2]._id,
        studentName: students[2].name,
        title: 'WiFi connection drops',
        description: 'The WiFi router on the 1st floor drops connectivity frequently.',
        category: 'maintenance',
        status: 'pending',
        priority: 'low'
      }
    ])
    console.log('✓ Created 3 complaints')

    // Create notices
    await Notice.insertMany([
      {
        title: 'Hostel Maintenance Schedule',
        content: 'Hostel maintenance checkups will be conducted on the first Saturday of every month. Please ensure your rooms are accessible.',
        category: 'maintenance',
        postedBy: admin._id,
        isActive: true
      },
      {
        title: 'Sports Day Announcement',
        content: 'Annual hostel sports and athletic meet will be held on June 15, 2026. All students are invited to register.',
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

    // Create admission records with new fields
    await Admission.insertMany([
      {
        student: students[0]._id,
        rollNumber: students[0].rollNumber,
        course: 'B.Tech CSE',
        year: 3,
        semester: 5,
        address: 'Sector 15, Rohini, New Delhi, 110089',
        collegeName: 'Delhi Technological University',
        fatherName: 'Sanjay Sharma',
        motherName: 'Ritu Sharma',
        bloodGroup: 'A+',
        phone: students[0].phone || '9876543211',
        parentPhone: '9999999999',
        status: 'approved',
        approvedDate: new Date(),
        approvedBy: admin._id,
        roomAssigned: '101',
        feeGenerated: true
      },
      {
        student: students[1]._id,
        rollNumber: students[1].rollNumber,
        course: 'B.Tech CSE',
        year: 2,
        semester: 3,
        address: 'Flat 402, Oakwood Towers, Mumbai, 400053',
        collegeName: 'Indian Institute of Technology Bombay',
        fatherName: 'Deepak Patel',
        motherName: 'Meena Patel',
        bloodGroup: 'O+',
        phone: students[1].phone || '9876543212',
        parentPhone: '9999999998',
        status: 'approved',
        approvedDate: new Date(),
        approvedBy: admin._id,
        roomAssigned: '101',
        feeGenerated: true
      },
      {
        student: students[2]._id,
        rollNumber: students[2].rollNumber,
        course: 'B.Tech IT',
        year: 2,
        semester: 3,
        address: 'H-20, Indira Nagar, Lucknow, 226016',
        collegeName: 'IIIT Allahabad',
        fatherName: 'Alok Verma',
        motherName: 'Sunita Verma',
        bloodGroup: 'B+',
        phone: students[2].phone || '9876543213',
        parentPhone: '9999999997',
        status: 'approved',
        approvedDate: new Date(),
        approvedBy: admin._id,
        roomAssigned: '102',
        feeGenerated: true
      },
      {
        student: students[3]._id,
        rollNumber: students[3].rollNumber,
        course: 'M.Tech AI',
        year: 4,
        semester: 7,
        address: 'Mylapore, Chennai, 600004',
        collegeName: 'Anna University, Chennai',
        fatherName: 'Venkat Iyer',
        motherName: 'Lalitha Iyer',
        bloodGroup: 'AB+',
        phone: students[3].phone || '9876543214',
        parentPhone: '9999999996',
        status: 'approved',
        approvedDate: new Date(),
        approvedBy: admin._id,
        roomAssigned: '201',
        feeGenerated: true
      }
    ])
    console.log('✓ Created 4 approved admission records')

    // Create custom pending admission for Priyanshu and Rohan to demonstrate flow
    // Wiping Priyanshu and Rohan's room assignments and active states to put them in pending
    await User.findByIdAndUpdate(students[1]._id, { roomNumber: null, isActive: false })
    await User.findByIdAndUpdate(students[2]._id, { roomNumber: null, isActive: false })
    
    // Deallocating them from rooms 101 and 102
    await Room.findOneAndUpdate({ roomNumber: '101' }, { currentOccupancy: 1, allocatedStudents: [students[0]._id], status: 'available' })
    await Room.findOneAndUpdate({ roomNumber: '102' }, { currentOccupancy: 0, allocatedStudents: [], status: 'available' })

    // Setting their admissions to pending
    await Admission.findOneAndUpdate({ student: students[1]._id }, { status: 'pending', roomAssigned: null, feeGenerated: false })
    await Admission.findOneAndUpdate({ student: students[2]._id }, { status: 'pending', roomAssigned: null, feeGenerated: false })

    console.log('✓ Set Priyanshu Patel and Rohan Verma admissions to PENDING status to demonstrate workflow')

    // Create system notification for all students
    await Notification.insertMany(students.map(s => ({
      recipient: s._id,
      sender: admin._id,
      title: 'Welcome to HMS! 🏠',
      message: `Namaste ${s.name}, welcome to the new Hostel Management System. Please review your profile and pending dues.`,
      type: 'announcement',
      category: 'info'
    })))
    console.log('✓ Sent welcome notifications to all students')

    console.log('\n✅ Database seeded successfully!')
    console.log('\nDemo Accounts:')
    console.log('Admin: admin@hostel.com / admin123')
    console.log('Student Accounts (Password: student123):')
    console.log('1. aarav@hostel.com     (Aarav Sharma - Approved, Room 101)')
    console.log('2. priyanshu@hostel.com (Priyanshu Patel - Pending Admission)')
    console.log('3. rohan@hostel.com     (Rohan Verma - Pending Admission)')
    console.log('4. ananya@hostel.com    (Ananya Iyer - Approved, Room 201)')
    
    console.log('\nAdmission Workflow Demo:')
    console.log('- Aarav and Ananya have approved status, rooms, and payments ready.')
    console.log('- Priyanshu and Rohan have pending admission requests waiting for Admin review.')
    
    await mongoose.connection.close()
  } catch (error) {
    console.error('✗ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
