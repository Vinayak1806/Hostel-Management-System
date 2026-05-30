import nodemailer from 'nodemailer'

// Create reusable transporter object using the default SMTP transport
// Configure your environment variables for this to work
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com', // fallback for dev
    pass: process.env.EMAIL_PASS || 'password123'
  }
})

// General email sender function
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Hostel Management Admin" <${process.env.EMAIL_USER || 'admin@hostel.com'}>`,
      to,
      subject,
      html
    })
    console.log('Message sent: %s', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    // Don't throw error to prevent breaking the main flow if email fails
    return null
  }
}

// Pre-defined templates
export const emailTemplates = {
  feeGeneration: (studentName, amount, dueDate, description) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2563eb;">New Fee Generated</h2>
      <p>Dear ${studentName},</p>
      <p>A new fee has been generated for your account.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Amount:</strong> Rs. ${amount}</p>
        <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
      </div>
      <p>Please log in to your student dashboard to make the payment before the due date.</p>
      <p>Best regards,<br>Hostel Administration</p>
    </div>
  `,

  paymentConfirmation: (studentName, amount, transactionId) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #16a34a;">Payment Successful</h2>
      <p>Dear ${studentName},</p>
      <p>We have successfully received your payment.</p>
      <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Amount Paid:</strong> Rs. ${amount}</p>
        <p><strong>Transaction ID:</strong> ${transactionId || 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p>You can download your invoice from the student dashboard.</p>
      <p>Best regards,<br>Hostel Administration</p>
    </div>
  `,

  roomAllocation: (studentName, roomNumber, floor) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #9333ea;">Room Allocated</h2>
      <p>Dear ${studentName},</p>
      <p>A room has been allocated to you in the hostel.</p>
      <div style="background-color: #faf5ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Room Number:</strong> ${roomNumber}</p>
        <p><strong>Floor:</strong> ${floor}</p>
      </div>
      <p>Please check the student dashboard for more details.</p>
      <p>Best regards,<br>Hostel Administration</p>
    </div>
  `,

  attendanceWarning: (studentName, attendancePercentage) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #dc2626;">Attendance Warning</h2>
      <p>Dear ${studentName},</p>
      <p>Your current attendance is <strong>${attendancePercentage}%</strong>, which is below the required threshold.</p>
      <p>Please ensure you maintain regular attendance to avoid any disciplinary actions.</p>
      <p>Best regards,<br>Hostel Administration</p>
    </div>
  `,

  complaintUpdate: (studentName, title, status) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2563eb;">Complaint Status Update</h2>
      <p>Dear ${studentName},</p>
      <p>The status of your complaint has been updated.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Complaint Title:</strong> ${title}</p>
        <p><strong>New Status:</strong> <span style="text-transform: capitalize;">${status}</span></p>
      </div>
      <p>Please check the student dashboard for more details.</p>
      <p>Best regards,<br>Hostel Administration</p>
    </div>
  `
}
