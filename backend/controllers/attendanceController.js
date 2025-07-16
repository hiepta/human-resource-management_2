import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const TLU_LAT = 21.005425;
const TLU_LNG = 105.836963;
const EARTH_RADIUS = 6371000; // meters

const distanceMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c;
};

const checkIn = async (req, res) => {
    try {
        // const { userId } = req.body;
        const { userId, latitude, longitude } = req.body;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ success: false, error: 'Location required' });
        }
        const dist = distanceMeters(latitude, longitude, TLU_LAT, TLU_LNG);
        if (dist > 25000) {
            return res.status(400).json({ success: false, error: 'Bạn phải checkin ở Đại học Thủy Lợi' });
        }
        // const employee = await Employee.findOne({ userId });
        const employee = await Employee.findOne({ userId })
            .populate('userId', 'name')
            .populate('department', 'dep_name');
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        const today = new Date();
        const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const minutes = today.getHours() * 60 + today.getMinutes();
        let status = "Present";
        if (minutes >= 8 * 60 && minutes <= 23 * 60) {
            status = "Present";
        } else if (minutes > 23 * 60) {
            status = "Late";
        }

        let attendance = await Attendance.findOne({ employeeId: employee._id, date: dateOnly });
        if (!attendance) {
            attendance = new Attendance({
                employeeId: employee._id,
                employeeSnapshot: {
                    employeeId: employee.employeeId,
                    name: employee.userId?.name || '',
                    department: employee.department?.dep_name || '',
                },
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
        const { latitude, longitude } = req.body;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ success: false, error: 'Location required' });
        }
        const dist = distanceMeters(latitude, longitude, TLU_LAT, TLU_LNG);
        if (dist > 25000) {
            return res.status(400).json({ success: false, error: 'Bạn phải checkout ở Đại học Thủy lợi' });
        }
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
        const employee = await Employee.findOne({ userId })
            .populate('userId', 'name')
            .populate('department', 'dep_name');
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        const today = new Date();
        const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        // const attendance = await Attendance.findOne({ employeeId: employee._id, date: dateOnly });
        let attendance = await Attendance.findOne({ employeeId: employee._id, date: dateOnly });
        const minutes = today.getHours() * 60 + today.getMinutes();
        
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

        const stats = await Attendance.aggregate([
            { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
            {
                $group: {
                    _id: '$employeeId',
                    present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
                    late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } }
                }
            }
        ]);

        const statMap = {};
        stats.forEach(item => {
            statMap[item._id.toString()] = { present: item.present, late: item.late };
        });

        const employees = await Employee.find()
            .populate('userId', 'name')
            .populate('department', 'dep_name');

        const result = employees.map(emp => {
            // const count = countMap[emp._id.toString()] || 0;
            // const isReward = count > 3;
            const { present = 0, late = 0 } = statMap[emp._id.toString()] || {};
            const reward = present >= 3 ? 300000 : 0;
            const fine = late > 0 ? 100000 : 0;
            return {
                employeeId: emp.employeeId,
                name: emp.userId?.name || '',
                department: emp.department?.dep_name || '',
                presentDays: present,
                lateDays: late,
                reward,
                fine
            };
        });

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: 'Reward-Discipline server error' });
    }
};

const getEmployeeRewardDiscipline = async (req, res) => {
    try {
        const { id, role } = req.params;
        let employee;
        if (role === 'admin') {
            employee = await Employee.findById(id);
        } else {
            employee = await Employee.findOne({ userId: id });
        }
        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const stats = await Attendance.aggregate([
            {
                $match: {
                    employeeId: employee._id,
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: '$employeeId',
                    present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
                    late: { $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] } }
                }
            }
        ]);

        const { present = 0, late = 0 } = stats[0] || {};
        const reward = present >= 3 ? 300000 : 0;
        const fine = late > 0 ? 100000 : 0;

        return res.status(200).json({ success: true, record: { presentDays: present, lateDays: late, reward, fine } });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: 'Reward-Discipline server error' });
    }
};
export { checkIn, checkOut, getAttendances, getTodayAttendance, getRewardDiscipline, getEmployeeRewardDiscipline }
