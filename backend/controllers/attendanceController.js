import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const checkIn = async (req, res) => {
    try {
        const { userId } = req.body;
        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        const today = new Date();
        const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const hour = today.getHours();
        let status = "Absent";
        if (hour >= 8 && hour < 10) {
            status = "Present";
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
        const attendance = await Attendance.findOne({ employeeId: employee._id, date: dateOnly });
        return res.status(200).json({ success: true, attendance });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Get today attendance error" });
    }
};

export { checkIn, checkOut, getAttendances, getTodayAttendance };