import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const getSalary = async (req, res) => {
  try {
    const { id, role } = req.params;
    const { month, year } = req.query;
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
    const m = month ? parseInt(month, 10) - 1 : now.getMonth();
    const y = year ? parseInt(year, 10) : now.getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0, 23, 59, 59);

    const presentDays = await Attendance.countDocuments({
      employeeId: employee._id,
      status: "Present",
      // date: { $gte: startOfMonth, $lte: endOfMonth },
      date: { $gte: start, $lte: end },
    });

    const baseSalary = employee.salary;
    // const salary = (baseSalary / 26) * presentDays - baseSalary * 0.105;
    const salaryAmount = (baseSalary / 26) * presentDays - baseSalary * 0.105;
    return res.status(200).json({
      success: true,
      baseSalary,
      presentDays,
      // salary: Math.round(salary),
      salary: Math.round(salaryAmount),
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, error: "Salary server error" });
  }
};

const getAllSalaries = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = month ? parseInt(month, 10) - 1 : now.getMonth();
    const y = year ? parseInt(year, 10) : now.getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0, 23, 59, 59);

    const stats = await Attendance.aggregate([
      {
        $match: { date: { $gte: start, $lte: end }, status: "Present" },
      },
      {
        $group: { _id: "$employeeId", present: { $sum: 1 } },
      },
    ]);

    const presentMap = {};
    stats.forEach((s) => {
      presentMap[s._id.toString()] = s.present;
    });

    const employees = await Employee.find()
      .populate("userId", "name")
      .populate("department", "dep_name");

    const data = employees.map((emp) => {
      const presentDays = presentMap[emp._id.toString()] || 0;
      const baseSalary = emp.salary;
      const amount = (baseSalary / 26) * presentDays - baseSalary * 0.105;
      return {
        employeeId: emp.employeeId,
        name: emp.userId?.name || "",
        department: emp.department?.dep_name || "",
        baseSalary,
        presentDays,
        salary: Math.round(amount),
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ success: false, error: "Salary server error" });
  }
};


export { getSalary, getAllSalaries };