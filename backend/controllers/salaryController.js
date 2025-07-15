import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const calculateSalary = async (req, res) => {
  try {
    const { id, role } = req.params;
    let employee;
    if (role === "admin") {
      employee = await Employee.findById(id);
    } else {
      employee = await Employee.findOne({ userId: id });
    }
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    const now = new Date();
    const month = parseInt(req.query.month || now.getMonth() + 1);
    const year = parseInt(req.query.year || now.getFullYear());
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const presentDays = await Attendance.countDocuments({
      employeeId: employee._id,
      status: "Present",
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const baseSalary = employee.salary;
    const salary = (baseSalary / 26) * presentDays - baseSalary * 0.105;

    return res.status(200).json({
      success: true,
      baseSalary,
      presentDays,
      salary: Math.round(salary),
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: "Salary server error" });
  }
};

export { calculateSalary };