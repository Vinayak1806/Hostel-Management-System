import Fee from '../models/Fee.js'

export const getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student', 'name email')
    res.json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student', 'name email')
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' })
    }
    res.json(fee)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createFee = async (req, res) => {
  try {
    const { student, amount, dueDate, description } = req.body

    const fee = new Fee({
      student,
      amount,
      dueDate,
      description,
      status: 'unpaid'
    })

    await fee.save()
    await fee.populate('student', 'name rollNumber email')

    // Populate student name and roll
    const populatedFee = await fee.populate('student')
    const feeResponse = fee.toObject()
    feeResponse.studentName = populatedFee.student.name
    feeResponse.studentRoll = populatedFee.student.rollNumber

    res.status(201).json(feeResponse)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateFee = async (req, res) => {
  try {
    const { amount, dueDate, description } = req.body
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { amount, dueDate, description },
      { new: true }
    ).populate('student', 'name email')

    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' })
    }

    res.json(fee)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const markFeePaid = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paidDate: new Date() },
      { new: true }
    ).populate('student', 'name email')

    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' })
    }

    res.json(fee)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getStudentFees = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.user.id })
    res.json(fees)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
