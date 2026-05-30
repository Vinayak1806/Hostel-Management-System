import mongoose from 'mongoose'
import Payment from '../models/Payment.js'
import User from '../models/User.js'
import Notification from '../models/Notification.js'
import { sendEmail, emailTemplates } from '../utils/emailService.js'

// Get all payments for a student
export const getStudentPayments = async (req, res) => {
  try {
    const userId = req.user.id
    
    const payments = await Payment.find({ student: userId })
      .populate('student', 'name email rollNumber')
      .sort({ createdAt: -1 })

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const paidAmount = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
    const pendingAmount = totalAmount - paidAmount

    res.json({
      payments,
      summary: {
        totalAmount,
        paidAmount,
        pendingAmount,
        completedPayments: payments.filter(p => p.status === 'completed').length,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        failedPayments: payments.filter(p => p.status === 'failed').length
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all payments (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const { status, semester, page = 1, limit = 10 } = req.query

    let query = {}
    if (status) query.status = status
    if (semester) query.semester = semester

    const skip = (page - 1) * limit
    
    const payments = await Payment.find(query)
      .populate('student', 'name email rollNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Payment.countDocuments(query)

    res.json({
      payments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create payment (Admin)
export const createPayment = async (req, res) => {
  try {
    const { student, studentId: studentIdField, amount, description, dueDate, semester } = req.body

    // Accept either 'student' or 'studentId' from the request
    const studentIdentifier = student || studentIdField
    if (!studentIdentifier) {
      return res.status(400).json({ message: 'Student identifier is required' })
    }

    // Resolve student: could be a roll number, email, or ObjectId
    let resolvedStudentId = studentIdentifier
    if (!mongoose.Types.ObjectId.isValid(studentIdentifier)) {
      const studentUser = await User.findOne({
        $or: [
          { rollNumber: studentIdentifier },
          { email: studentIdentifier }
        ]
      })
      if (!studentUser) {
        return res.status(404).json({ message: `Student not found with identifier: ${studentIdentifier}` })
      }
      resolvedStudentId = studentUser._id
    }

    const payment = new Payment({
      student: resolvedStudentId,
      amount,
      description,
      dueDate,
      semester,
      status: 'pending'
    })

    await payment.save()

    // Create notification
    new Notification({
      recipient: resolvedStudentId,
      title: 'New Payment Due',
      message: `Payment of Rs. ${amount} is due. Please pay before ${new Date(dueDate).toLocaleDateString()}`,
      type: 'payment',
      category: 'alert',
      relatedId: payment._id,
      relatedModel: 'Payment',
      actionUrl: '/dashboard/payments'
    }).save()

    // Send email
    if (resolvedStudentId) {
      const studentUser = await User.findById(resolvedStudentId)
      if (studentUser && studentUser.email) {
        await sendEmail({
          to: studentUser.email,
          subject: 'New Fee Generated',
          html: emailTemplates.feeGeneration(studentUser.name, amount, dueDate, description)
        })
      }
    }

    res.status(201).json({ message: 'Payment created successfully', payment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update payment status (after Razorpay/Stripe confirmation)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params
    const { status, transactionId, razorpayPaymentId } = req.body

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status,
        transactionId,
        razorpayPaymentId,
        paidAt: status === 'completed' ? new Date() : undefined
      },
      { new: true }
    ).populate('student', 'name email')

    // Create notification
    if (status === 'completed') {
      new Notification({
        recipient: payment.student._id,
        title: 'Payment Successful',
        message: `Your payment of Rs. ${payment.amount} has been received successfully`,
        type: 'payment',
        category: 'success',
        relatedId: payment._id,
        relatedModel: 'Payment'
      }).save()

      // Send email
      if (payment.student && payment.student.email) {
        await sendEmail({
          to: payment.student.email,
          subject: 'Payment Successful',
          html: emailTemplates.paymentConfirmation(payment.student.name, payment.amount, transactionId || razorpayPaymentId)
        })
      }
    } else if (status === 'failed') {
      new Notification({
        recipient: payment.student._id,
        title: 'Payment Failed',
        message: `Your payment of Rs. ${payment.amount} could not be processed. Please try again.`,
        type: 'payment',
        category: 'error',
        relatedId: payment._id,
        relatedModel: 'Payment'
      }).save()
    }

    res.json({ message: 'Payment updated successfully', payment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Process payment (Simulated student payment)
export const processPayment = async (req, res) => {
  try {
    const { paymentId } = req.params
    const userId = req.user.id

    const payment = await Payment.findOne({ _id: paymentId, student: userId })
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment is already completed' })
    }

    payment.status = 'completed'
    payment.paidAt = new Date()
    payment.transactionId = 'SIM-' + Date.now()
    await payment.save()

    // Notify student
    new Notification({
      recipient: userId,
      title: 'Payment Successful',
      message: `Your payment of Rs. ${payment.amount} has been received successfully`,
      type: 'payment',
      category: 'success',
      relatedId: payment._id,
      relatedModel: 'Payment'
    }).save()
    
    // Send email
    const studentUser = await User.findById(userId)
    if (studentUser && studentUser.email) {
      await sendEmail({
        to: studentUser.email,
        subject: 'Payment Successful',
        html: emailTemplates.paymentConfirmation(studentUser.name, payment.amount, payment.transactionId)
      })
    }
    
    // Notify admins
    const admins = await User.find({ role: 'admin' })
    admins.forEach(admin => {
      new Notification({
        recipient: admin._id,
        title: 'Payment Received',
        message: `Received payment of Rs. ${payment.amount} from student`,
        type: 'payment',
        category: 'success',
        relatedId: payment._id,
        relatedModel: 'Payment',
        actionUrl: '/admin/payments'
      }).save()
    })

    res.json({ message: 'Payment processed successfully', payment })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Generate invoice
export const generateInvoice = async (req, res) => {
  try {
    const { paymentId } = req.params
    
    const payment = await Payment.findById(paymentId)
      .populate('student', 'name email phone rollNumber collegeName')

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    const invoice = {
      invoiceNumber: `INV-${payment._id}`,
      date: new Date().toLocaleDateString(),
      student: payment.student,
      amount: payment.amount,
      description: payment.description,
      status: payment.status,
      paidAt: payment.paidAt,
      transactionId: payment.transactionId
    }

    res.json(invoice)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete payment (Admin)
export const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params
    const payment = await Payment.findByIdAndDelete(paymentId)
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }
    
    res.json({ message: 'Payment deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
