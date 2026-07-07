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

    const mayDate = new Date('2026-05-15T10:00:00Z')
    const juneDate = new Date('2026-06-20T14:30:00Z')
    const julyDate = new Date('2026-07-05T09:15:00Z')

    // Create admin user
    const admin = await User.create({
      name: 'Vinayak Pawate',
      email: 'admin@hostelhub.com',
      phone: '9823456780',
      password: 'admin123',
      role: 'admin',
      createdAt: mayDate
    })
    console.log('✓ Created Admin: Vinayak Pawate')

    // Create 15 student users with realistic Indian (Maharashtra) data
    const studentsData = [
      { name: 'Saurabh Patil', email: 'saurabh.patil@hostelhub.com', phone: '9823014501', rollNumber: 'COEP24CS042', semester: 5, course: 'B.Tech Computer Science', collegeName: 'College of Engineering, Pune (COEP)', permanentAddress: 'Plot 12, Shivaji Nagar, Satara, Maharashtra 415001', parentPhone: '9890123451' },
      { name: 'Aditya Bhosale', email: 'aditya.bhosale@hostelhub.com', phone: '9823014502', rollNumber: 'COEP24EC012', semester: 5, course: 'B.Tech Electronics', collegeName: 'College of Engineering, Pune (COEP)', permanentAddress: 'Flat 201, Sahyadri Complex, Sangli, Maharashtra 416416', parentPhone: '9890123452' },
      { name: 'Omkar Kulkarni', email: 'omkar.kulkarni@hostelhub.com', phone: '9823014503', rollNumber: 'VIT24ME031', semester: 3, course: 'B.Tech Mechanical', collegeName: 'Vishwakarma Institute of Technology, Pune', permanentAddress: 'House 7, Peth Road, Kolhapur, Maharashtra 416001', parentPhone: '9890123453' },
      { name: 'Pooja Gaikwad', email: 'pooja.gaikwad@hostelhub.com', phone: '9823014504', rollNumber: 'VIT24CS045', semester: 5, course: 'B.Tech Computer Science', collegeName: 'Vishwakarma Institute of Technology, Pune', permanentAddress: 'Row House 14, Ambedkar Nagar, Aurangabad, Maharashtra 431001', parentPhone: '9890123454' },
      { name: 'Rutuja Shinde', email: 'rutuja.shinde@hostelhub.com', phone: '9823014505', rollNumber: 'PICT24CS058', semester: 7, course: 'B.E. Computer Engineering', collegeName: 'PICT - Pune Institute of Computer Technology', permanentAddress: '23/A, MG Road, Solapur, Maharashtra 413001', parentPhone: '9890123455' },
      { name: 'Yash Chavan', email: 'yash.chavan@hostelhub.com', phone: '9823014506', rollNumber: 'PICT24IT021', semester: 3, course: 'B.E. Information Technology', collegeName: 'PICT - Pune Institute of Computer Technology', permanentAddress: 'Flat 10, Suyog Nagar, Jalgaon, Maharashtra 425001', parentPhone: '9890123456' },
      { name: 'Tejas Pawar', email: 'tejas.pawar@hostelhub.com', phone: '9823014507', rollNumber: 'COEP24ME088', semester: 1, course: 'B.Tech Mechanical', collegeName: 'College of Engineering, Pune (COEP)', permanentAddress: 'Sector 4, Vashi, Navi Mumbai, Maharashtra 400703', parentPhone: '9890123457' },
      { name: 'Neha Joshi', email: 'neha.joshi@hostelhub.com', phone: '9823014508', rollNumber: 'VIT24IT045', semester: 5, course: 'B.Tech Information Tech', collegeName: 'Vishwakarma Institute of Technology, Pune', permanentAddress: 'Plot 45, Ramdas Peth, Nagpur, Maharashtra 440010', parentPhone: '9890123458' },
      { name: 'Prathamesh Kale', email: 'prathamesh.kale@hostelhub.com', phone: '9823014509', rollNumber: 'PICT24CS112', semester: 7, course: 'B.E. Computer Engineering', collegeName: 'PICT - Pune Institute of Computer Technology', permanentAddress: 'A-2, Godavari Apartments, Nanded, Maharashtra 431602', parentPhone: '9890123459' },
      { name: 'Shruti Desai', email: 'shruti.desai@hostelhub.com', phone: '9823014510', rollNumber: 'COEP24EE034', semester: 3, course: 'B.Tech Electrical', collegeName: 'College of Engineering, Pune (COEP)', permanentAddress: 'Bungalow 3, Camp, Belgaum, Maharashtra border 590001', parentPhone: '9890123460' },
      { name: 'Kunal Jadhav', email: 'kunal.jadhav@hostelhub.com', phone: '9823014511', rollNumber: 'VIT24AI012', semester: 1, course: 'B.Tech AI & Data Science', collegeName: 'Vishwakarma Institute of Technology, Pune', permanentAddress: '12/B, Sadar Bazaar, Satara, Maharashtra 415002', parentPhone: '9890123461' },
      { name: 'Vaishnavi Mane', email: 'vaishnavi.mane@hostelhub.com', phone: '9823014512', rollNumber: 'PICT24EC067', semester: 5, course: 'B.E. Electronics', collegeName: 'PICT - Pune Institute of Computer Technology', permanentAddress: 'Shree Niwas, Main Road, Pandharpur, Maharashtra 413304', parentPhone: '9890123462' },
      { name: 'Siddhant Wagh', email: 'siddhant.wagh@hostelhub.com', phone: '9823014513', rollNumber: 'COEP24CE055', semester: 7, course: 'B.Tech Civil Engineering', collegeName: 'College of Engineering, Pune (COEP)', permanentAddress: 'Flat 502, Green Park, Dhule, Maharashtra 424001', parentPhone: '9890123463' },
      // The last two will be pending admission
      { name: 'Sneha Deshmukh', email: 'sneha.deshmukh@hostelhub.com', phone: '9823014514', rollNumber: 'COEP24IT019', semester: 3, course: 'B.Tech Information Technology', collegeName: 'College of Engineering, Pune (COEP)', permanentAddress: 'Flat 304, Mangal Residency, Nashik, Maharashtra 422001', parentPhone: '9890123464' },
      { name: 'Sahil More', email: 'sahil.more@hostelhub.com', phone: '9823014515', rollNumber: 'PICT24IT027', semester: 3, course: 'B.E. Information Technology', collegeName: 'PICT - Pune Institute of Computer Technology', permanentAddress: 'B-wing, Sai Towers, Latur, Maharashtra 413512', parentPhone: '9890123465' }
    ]

    const students = []
    for (let i = 0; i < studentsData.length; i++) {
      const date = i % 3 === 0 ? mayDate : (i % 3 === 1 ? juneDate : julyDate)
      const student = await User.create({
        ...studentsData[i],
        password: 'student123',
        role: 'student',
        createdAt: date
      })
      students.push(student)
    }
    console.log(`✓ Created ${students.length} student users`)

    // Create rooms (5 floors, realistic layout)
    // We will assign students 0 through 12 into these rooms serially
    const rooms = await Room.insertMany([
      { roomNumber: '101', floor: 1, capacity: 2, currentOccupancy: 2, allocatedStudents: [students[0]._id, students[1]._id], status: 'full' },
      { roomNumber: '102', floor: 1, capacity: 2, currentOccupancy: 2, allocatedStudents: [students[2]._id, students[3]._id], status: 'full' },
      { roomNumber: '103', floor: 1, capacity: 3, currentOccupancy: 3, allocatedStudents: [students[4]._id, students[5]._id, students[6]._id], status: 'full' },
      { roomNumber: '104', floor: 1, capacity: 2, currentOccupancy: 2, allocatedStudents: [students[7]._id, students[8]._id], status: 'full' },
      { roomNumber: '201', floor: 2, capacity: 2, currentOccupancy: 2, allocatedStudents: [students[9]._id, students[10]._id], status: 'full' },
      { roomNumber: '202', floor: 2, capacity: 2, currentOccupancy: 2, allocatedStudents: [students[11]._id, students[12]._id], status: 'full' },
      { roomNumber: '203', floor: 2, capacity: 3, currentOccupancy: 0, allocatedStudents: [], status: 'available' },
      { roomNumber: '301', floor: 3, capacity: 3, currentOccupancy: 0, allocatedStudents: [], status: 'available' },
      { roomNumber: '302', floor: 3, capacity: 2, currentOccupancy: 0, allocatedStudents: [], status: 'available' },
      { roomNumber: '401', floor: 4, capacity: 2, currentOccupancy: 0, allocatedStudents: [], status: 'available' },
      { roomNumber: '402', floor: 4, capacity: 3, currentOccupancy: 0, allocatedStudents: [], status: 'available' },
      { roomNumber: '501', floor: 5, capacity: 2, currentOccupancy: 0, allocatedStudents: [], status: 'available' },
    ])
    console.log(`✓ Created ${rooms.length} rooms`)

    // Update approved students with room assignments
    const roomAssignments = {
      0: '101', 1: '101',
      2: '102', 3: '102',
      4: '103', 5: '103', 6: '103',
      7: '104', 8: '104',
      9: '201', 10: '201',
      11: '202', 12: '202'
    }

    for (const [idx, roomNum] of Object.entries(roomAssignments)) {
      await User.findByIdAndUpdate(students[idx]._id, { roomNumber: roomNum, isActive: true })
    }

    // Create payments
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 15)

    const payments = []
    for (let i = 0; i < 13; i++) {
      const isPaid = i % 2 === 0
      payments.push({
        student: students[i]._id,
        amount: 8500,
        dueDate: nextMonth,
        status: isPaid ? 'completed' : 'pending',
        paidAt: isPaid ? (i % 3 === 0 ? mayDate : juneDate) : undefined,
        description: `Hostel Fee – ${isPaid ? 'June' : 'July'} 2026`,
        paymentMethod: isPaid ? 'razorpay' : undefined,
        semester: students[i].semester,
        createdAt: isPaid ? (i % 3 === 0 ? mayDate : juneDate) : julyDate
      })
    }
    await Payment.insertMany(payments)
    console.log(`✓ Created ${payments.length} payment entries`)

    // Create complaints
    await Complaint.insertMany([
      { student: students[0]._id, studentName: students[0].name, title: 'Geyser not working in bathroom', description: 'The geyser in room 101 bathroom has stopped heating water.', category: 'maintenance', status: 'resolved', priority: 'high', resolution: 'Heating element replaced.', resolvedDate: new Date('2026-05-20T10:00:00Z'), createdAt: mayDate },
      { student: students[4]._id, studentName: students[4].name, title: 'Ceiling fan making loud noise', description: 'The ceiling fan in room 103 is making a constant rattling noise.', category: 'maintenance', status: 'in-progress', priority: 'medium', createdAt: juneDate },
      { student: students[9]._id, studentName: students[9].name, title: 'Water pressure issue on 2nd floor', description: 'Water pressure in room 201 has been very low during morning hours.', category: 'maintenance', status: 'pending', priority: 'high', createdAt: julyDate },
      { student: students[11]._id, studentName: students[11].name, title: 'Window lock broken', description: 'The latch on the main window of room 202 is broken.', category: 'maintenance', status: 'pending', priority: 'low', createdAt: juneDate },
      { student: students[7]._id, studentName: students[7].name, title: 'WiFi router restarting', description: 'WiFi router near 104 is restarting constantly.', category: 'maintenance', status: 'resolved', priority: 'medium', resolution: 'Replaced adapter.', resolvedDate: new Date('2026-06-15T10:00:00Z'), createdAt: juneDate },
    ])
    console.log('✓ Created 5 complaints')

    // Create notices
    await Notice.insertMany([
      { title: 'Monthly Room Inspection – July 2026', content: 'Room inspections will be conducted on Saturday, 12th July 2026 between 10 AM and 1 PM.', category: 'maintenance', postedBy: admin._id, isActive: true, createdAt: julyDate },
      { title: 'Hostel Sports Tournament – Registrations Open', content: 'Inter-hostel cricket and badminton tournament will be held on 20th July 2026.', category: 'event', postedBy: admin._id, isActive: true, createdAt: juneDate },
      { title: 'Fee Submission Deadline Extended', content: 'The deadline for July 2026 hostel fee submission has been extended to 20th July 2026.', category: 'rules', postedBy: admin._id, isActive: true, createdAt: mayDate },
    ])
    console.log('✓ Created 3 notices')

    // Create admission records
    const admissions = []
    for (let i = 0; i < studentsData.length; i++) {
      const isApproved = i < 13
      admissions.push({
        student: students[i]._id,
        rollNumber: students[i].rollNumber,
        course: students[i].course,
        year: Math.ceil(students[i].semester / 2),
        semester: students[i].semester,
        address: students[i].permanentAddress,
        collegeName: students[i].collegeName,
        fatherName: 'Father of ' + students[i].name.split(' ')[0],
        motherName: 'Mother of ' + students[i].name.split(' ')[0],
        bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'O-'][i % 6],
        phone: students[i].phone,
        parentPhone: students[i].parentPhone,
        status: isApproved ? 'approved' : 'pending',
        approvedDate: isApproved ? (i % 2 === 0 ? mayDate : juneDate) : undefined,
        approvedBy: isApproved ? admin._id : undefined,
        roomAssigned: isApproved ? roomAssignments[i] : null,
        feeGenerated: isApproved,
        createdAt: i % 2 === 0 ? mayDate : (i % 3 === 0 ? juneDate : julyDate)
      })
    }
    await Admission.insertMany(admissions)
    console.log(`✓ Created ${admissions.length} admission records (${13} approved, 2 pending)`)

    // Set pending students inactive with no room
    await User.findByIdAndUpdate(students[13]._id, { roomNumber: null, isActive: false })
    await User.findByIdAndUpdate(students[14]._id, { roomNumber: null, isActive: false })

    console.log('✓ Set Sneha and Sahil admissions to PENDING status')

    // Create notifications
    await Notification.insertMany(students.map((s, index) => ({
      recipient: s._id,
      sender: admin._id,
      title: 'Welcome to Hostel Hub! 🏠',
      message: `Namaskar ${s.name.split(' ')[0]}, welcome to the Hostel Hub Management System.`,
      type: 'announcement',
      category: 'info',
      createdAt: index % 2 === 0 ? mayDate : juneDate
    })))
    console.log('✓ Sent welcome notifications to all students')

    console.log('\n✅ Database seeded successfully!')
    console.log('\n─────────────────────────────────────────')
    console.log('  DEMO ACCOUNTS')
    console.log('─────────────────────────────────────────')
    console.log('  Admin:    admin@hostelhub.com / admin123')
    console.log('')
    console.log(`  Created ${students.length} Students. 13 are fully assigned to rooms 101, 102, 103, 104, 201, 202.`)
    console.log(`  The last 2 students are pending.`)
    console.log('─────────────────────────────────────────')

    await mongoose.connection.close()
  } catch (error) {
    console.error('✗ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
