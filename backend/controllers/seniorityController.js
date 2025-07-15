import Contract from "../models/Contract.js";
import Employee from "../models/Employee.js";

const getSeniorityInfo = async (req, res) => {
    try {
        const { id, role } = req.params;
        let employee;
        if (role === 'admin') {
            employee = await Employee.findById(id);
        } else {
            employee = await Employee.findOne({ userId: id });
        }
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        const contract = await Contract.findOne({ employeeId: employee._id }).sort({ endDate: -1 });
        if (!contract) {
            return res.status(200).json({ success: true, message: "Bạn phải có hợp đồng" }); 
        }
        let nextSigningSalary = employee.salary;
        const diffYears = (contract.endDate - contract.startDate) / (1000 * 60 * 60 * 24 * 365);
        if (diffYears > 1) {
            nextSigningSalary = employee.salary * contract.salaryCoefficient;
        }
        const birthYear = new Date(employee.dob).getFullYear();
        const currentYear = new Date().getFullYear();
        const yearsUntilRetirement = Math.max(55 - (currentYear - birthYear), 0);
        // const yearsUntilRetirement = 55 - birthYear;
        return res.status(200).json({ success: true, nextSigningSalary: Math.round(nextSigningSalary), yearsUntilRetirement });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Seniority server error" });
    }
};

export { getSeniorityInfo };