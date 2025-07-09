import Employee from '../models/Employee.js'
import Attendance from '../models/Attendance.js'

const calculateSalary = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }
        const basicSalary = employee.salary;
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const attendances = await Attendance.find({
            employeeId,
            date: { $gte: start, $lte: end }
        });

        let actualWorkingDays = 0;
        attendances.forEach(att => {
            if (att.status !== 'Absent') {
                actualWorkingDays += 1;
            }
        });
        const netSalary = ((basicSalary / 26) * actualWorkingDays) - (basicSalary * 0.105);
        return res.status(200).json({ success: true, netSalary: Math.round(netSalary), actualWorkingDays });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Calculate salary server error' });
    }
}
export { calculateSalary }