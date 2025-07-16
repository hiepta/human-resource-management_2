import Employee from '../models/Employee.js'
import Leave from '../models/Leave.js'
import SocialInsurance from '../models/SocialInsurance.js'
import Contract from '../models/Contract.js'
import Attendance from '../models/Attendance.js'
const getDaysOffLeft = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await Employee.findOne({ userId: id })
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' })
    }
    const leaves = await Leave.find({ employeeId: employee._id, status: 'Approved' })
    const currentYear = new Date().getFullYear()
    let daysTaken = 0
    leaves.forEach((leave) => {
      const start = new Date(leave.startDate)
      const end = new Date(leave.endDate)
      if (start.getFullYear() === currentYear) {
        const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
        daysTaken += diff
      }
    })
    const daysLeft = Math.max(12 - daysTaken, 0)
    return res.status(200).json({ success: true, daysLeft })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}


const getSocialInsuranceAmount = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await Employee.findOne({ userId: id })
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' })
    }
    const record = await SocialInsurance.findOne({ employeeId: employee._id }).sort({ startDate: -1 })
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found' })
    }
    return res.status(200).json({ success: true, monthlyAmount: record.monthlyAmount })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}

const getContractDate = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await Employee.findOne({ userId: id })
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' })
    }
    const contract = await Contract.findOne({ employeeId: employee._id }).sort({ startDate: -1 })
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' })
    }
    return res.status(200).json({ success: true, startDate: contract.startDate })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}

const requestLeaveToday = async (req, res) => {
  try {
    const { userId } = req.body
    const employee = await Employee.findOne({ userId })
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' })
    }
    const today = new Date()
    const leave = new Leave({
      employeeId: employee._id,
      leaveType: 'Casual Leave',
      startDate: today,
      endDate: today,
      reason: 'Chatbot day off'
    })
    await leave.save()
    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}

const getSalaryAmount = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await Employee.findOne({ userId: id })
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' })
    }
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    const presentDays = await Attendance.countDocuments({
      employeeId: employee._id,
      status: 'Present',
      date: { $gte: start, $lte: end }
    })
    const baseSalary = employee.salary
    const salaryAmount = (baseSalary / 26) * presentDays - baseSalary * 0.105
    return res.status(200).json({ success: true, salary: Math.round(salaryAmount) })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}


const getRetirement = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await Employee.findOne({ userId: id })
    if (!employee || !employee.dob) {
      return res.status(404).json({ success: false, error: 'Employee not found' })
    }
    const birthYear = new Date(employee.dob).getFullYear()
    const yearsLeft = 55 - (new Date().getFullYear() - birthYear)
    return res.status(200).json({ success: true, yearsLeft })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: 'Server error' })
  }
}

export { getDaysOffLeft, getSocialInsuranceAmount, getContractDate, requestLeaveToday, getSalaryAmount, getRetirement }