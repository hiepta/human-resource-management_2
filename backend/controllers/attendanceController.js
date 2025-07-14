import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const markAbsenteesForToday = async () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    if (minutes <= 12 * 60) return;
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const employees = await Employee.find();
    for (const emp of employees) {
        const existing = await Attendance.findOne({ employeeId: emp._id, date: dateOnly });
        if (!existing) {
            await new Attendance({ employeeId: emp._id, date: dateOnly, status: 'Absent', isCompleted: true }).save();
        }
    }
};

const checkIn = async (req, res) => {
    try {
        const { userId } = req.body;
        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        const today = new Date();
        const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const minutes = today.getHours() * 60 + today.getMinutes();
        let status = "Present";
        if (minutes >= 8 * 60 && minutes <= 10 * 60) {
            status = "Present";
        } else if (minutes > 10 * 60 && minutes <= 12 * 60) {
            status = "Late";
        } else if (minutes > 12 * 60) {
            const existing = await Attendance.findOne({ employeeId: employee._id, date: dateOnly });
            if (!existing) {
                await new Attendance({ employeeId: employee._id, date: dateOnly, status: "Absent", isCompleted: true }).save();
            }
            return res.status(400).json({ success: false, error: "Cannot check in after 12pm" });
        }

        let attendance = await Attendance.findOne({ employeeId: employee._id, date: dateOnly });
        if (!attendance) {
            attendance = new Attendance({
                employeeId: employee._id,
                date: dateOnly,
                checkIn: today,
                status,
            });
            await attendance.save();
        } else {
            return res.status(400).json({ success: false, error: "Already checked in" });
        }
        return res.status(200).json({ success: true, attendance });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Check-in server error" });
    }
};

const checkOut = async (req, res) => {
    try {
        const { id } = req.params; // attendance record id
        const attendance = await Attendance.findById(id).populate({
            path: 'employeeId',
            select: 'userId'
        });
        if (!attendance) {
            return res.status(404).json({ success: false, error: "Attendance not found" });
        }
        if (attendance.isCompleted) {
            return res.status(400).json({ success: false, error: "Already checked out" });
        }
        attendance.checkOut = new Date();
        attendance.isCompleted = true;
        await attendance.save();
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Check-out server error" });
    }
};

const getAttendances = async (req, res) => {
    try {
        await markAbsenteesForToday();
        const attendances = await Attendance.find()
            .populate({
                path: 'employeeId',
                populate: [
                    { path: 'department', select: 'dep_name' },
                    { path: 'userId', select: 'name' }
                ]
            })
            .sort({ date: -1 });
        return res.status(200).json({ success: true, attendances });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Get attendance server error" });
    }
};

const getTodayAttendance = async (req, res) => {
    try {
        const { userId } = req.params;
        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        const today = new Date();
        const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        // const attendance = await Attendance.findOne({ employeeId: employee._id, date: dateOnly });
        let attendance = await Attendance.findOne({ employeeId: employee._id, date: dateOnly });
        const minutes = today.getHours() * 60 + today.getMinutes();
        if (!attendance && minutes > 12 * 60) {
            attendance = new Attendance({ employeeId: employee._id, date: dateOnly, status: "Absent", isCompleted: true });
            await attendance.save();
        }
        return res.status(200).json({ success: true, attendance });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Get today attendance error" });
    }
};

const getRewardDiscipline = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const presentCounts = await Attendance.aggregate([
            { $match: { date: { $gte: startOfMonth, $lte: endOfMonth }, status: 'Present' } },
            { $group: { _id: '$employeeId', count: { $sum: 1 } } }
        ]);

        const countMap = {};
        presentCounts.forEach(item => {
            countMap[item._id.toString()] = item.count;
        });

        const employees = await Employee.find()
            .populate('userId', 'name')
            .populate('department', 'dep_name');

        const result = employees.map(emp => {
            const count = countMap[emp._id.toString()] || 0;
            const isReward = count > 3;
            return {
                employeeId: emp.employeeId,
                name: emp.userId?.name || '',
                department: emp.department?.dep_name || '',
                presentDays: count,
                action: isReward ? 'Reward' : 'Discipline',
                amount: isReward ? 500000 : -200000
            };
        });

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: 'Reward-Discipline server error' });
    }
};
export { checkIn, checkOut, getAttendances, getTodayAttendance, getRewardDiscipline };