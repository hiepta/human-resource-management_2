import Employee from '../models/Employee.js'
import Leave from '../models/Leave.js'

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

export { getDaysOffLeft }