import { genAI } from '../config/gemini.js'
import Payment from '../models/Payment.js'
import Attendance from '../models/Attendance.js'
import Complaint from '../models/Complaint.js'
import Notice from '../models/Notice.js'
import Room from '../models/Room.js'
import User from '../models/User.js'

export const handleChatMessage = async (req, res) => {
  try {
    const { message, history, currentUrl } = req.body
    const userId = req.user.id
    const userRole = req.user.role

    if (!genAI) {
      return res.status(503).json({
        message: 'Chatbot is not configured on the server. Please set GEMINI_API_KEY in the backend environment.'
      })
    }

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    let contextData = ''

    if (userRole === 'student') {
      // Fetch student data
      const payments = await Payment.find({ student: userId, status: 'pending' })
      const complaints = await Complaint.find({ student: userId, status: { $ne: 'resolved' } })
      const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 }).limit(3)
      
      // Calculate attendance this month
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const attendances = await Attendance.find({ student: userId, date: { $gte: startOfMonth } })
      
      const user = await User.findById(userId)

      contextData = `
        User Profile: Name: ${user.name}, Room: ${user.roomNumber || 'Not assigned'}.
        Pending Payments: ${payments.length} pending. ${payments.map(p => `Rs. ${p.amount} due on ${new Date(p.dueDate).toLocaleDateString()}`).join(', ')}.
        Active Complaints: ${complaints.length} active. ${complaints.map(c => `${c.title} (${c.status})`).join(', ')}.
        Recent Notices: ${notices.map(n => n.title).join(', ')}.
        Attendance this month: ${attendances.length} days recorded.
      `
    } else if (userRole === 'admin') {
      // Fetch admin aggregate data
      const totalStudents = await User.countDocuments({ role: 'student' })
      const rooms = await Room.find()
      const totalRooms = rooms.length
      const vacantRooms = rooms.filter(r => r.currentOccupancy < r.capacity).length
      
      const pendingPayments = await Payment.countDocuments({ status: 'pending' })
      const pendingComplaints = await Complaint.countDocuments({ status: 'pending' })
      
      contextData = `
        Admin Stats:
        Total Students: ${totalStudents}.
        Rooms: ${totalRooms} total, ${vacantRooms} with available capacity.
        Pending Payments: ${pendingPayments} total pending across all students.
        Pending Complaints: ${pendingComplaints} total pending across all students.
      `
    }

    const systemPrompt = `
      You are the AI assistant for "Hostel Hub", a hostel management system.
      The user asking is a ${userRole}.
      
      Here is the latest data context for this user:
      ${contextData}
      
      Current Page: The user is currently viewing the page path: "${currentUrl || 'unknown'}".
      
      Guidelines:
      1. Answer questions concisely and helpfully.
      2. Use the provided context data to answer questions about their payments, attendance, rooms, etc.
      3. If they ask to perform an action, DO NOT tell them to do it manually. Instead, use the provided tools (functions) to act on their behalf (e.g., file a complaint, navigate to a page).
      4. Do not make up data. If you don't know, say you don't know based on the provided context.
    `

    const tools = [{
      functionDeclarations: [
        {
          name: 'file_complaint',
          description: 'Files a new complaint for the student.',
          parameters: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING', description: 'Brief title of the complaint' },
              description: { type: 'STRING', description: 'Detailed description' },
              type: { type: 'STRING', description: 'Category: maintenance, food, cleaning, security, or other' }
            },
            required: ['title', 'description', 'type']
          }
        },
        {
          name: 'navigate_to',
          description: 'Navigates the user to a specific page. Use when they want to go to a section.',
          parameters: {
            type: 'OBJECT',
            properties: {
              route: { type: 'STRING', description: 'The route path to navigate to, e.g. /payments, /complaints, /dashboard, /attendance, /notices' }
            },
            required: ['route']
          }
        }
      ]
    }]

    // Create a new model instance for this specific chat so we can inject the dynamic system prompt
    const userModel = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
      tools: tools
    })

    // Create chat session with history
    const chat = userModel.startChat({
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }))
    })

    const result = await chat.sendMessage(message)
    const response = result.response
    
    // Check if the model called a function
    const functionCalls = response.functionCalls()
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0]
      if (call.name === 'file_complaint') {
        const { title, description, type } = call.args
        
        // Execute the complaint filing
        await Complaint.create({
          student: userId,
          title,
          description,
          type,
          status: 'pending'
        })

        // Send function response back to Gemini so it can answer the user
        const functionResponseResult = await chat.sendMessage([{
          functionResponse: {
            name: 'file_complaint',
            response: { success: true, message: 'Complaint filed successfully' }
          }
        }])
        
        return res.json({ reply: functionResponseResult.response.text() })
      } else if (call.name === 'navigate_to') {
        const { route } = call.args
        
        // We handle navigation immediately by sending the action flag back to the frontend
        return res.json({ 
          reply: `Redirecting you to ${route}...`,
          action: 'NAVIGATE',
          path: route
        })
      }
    }

    const responseText = response.text()
    res.json({ reply: responseText })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ message: 'Failed to process chat message', error: error.message })
  }
}
