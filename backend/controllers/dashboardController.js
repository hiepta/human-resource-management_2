import Employee from "../models/Employee.js"
import Department from "../models/Department.js"
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";
const getSummary = async (req, res) => {
    try{
        const totalEmployees = await Employee.countDocuments();
        const totalDepartments = await Department.countDocuments();
        // const totalSalaries = await Employee.aggregate([
        //     {$group: {_id: null, totalSalary: {$sum: "$salary"}}}
        // ])
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const stats = await Attendance.aggregate([
            { $match: { date: { $gte: start, $lte: end }, status: "Present" } },
            { $group: { _id: "$employeeId", present: { $sum: 1 } } }
        ]);

        const presentMap = {};
        stats.forEach((s) => {
            presentMap[s._id.toString()] = s.present;
        });

        const employees = await Employee.find();
        let totalSalaryReceived = 0;
        employees.forEach(emp => {
            const presentDays = presentMap[emp._id.toString()] || 0;
            const amount = (emp.salary / 26) * presentDays - emp.salary * 0.105;
            totalSalaryReceived += Math.round(amount);
        });
        const employeeAppliedForLeave = await Leave.distinct('employeeId')

        const leaveStatus = await Leave.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {$sum: 1}
                }
            }
        ])
        const leaveSummary = {
            appliedFor: employeeAppliedForLeave.length, 
            approved: leaveStatus.find(item => item._id === "Approved") ?.count || 0,
            rejected: leaveStatus.find(item => item._id === "Rejected") ?.count || 0,
            pending: leaveStatus.find(item => item._id === "Pending") ?.count || 0,
        }
        return res.status(200).json({
            success: true,
            totalEmployees,
            totalDepartments,
            totalSalaryReceived,
            leaveSummary
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "Dashboard summary error"})
    }
}

export {getSummary}