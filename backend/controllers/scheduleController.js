import TeachingSchedule from "../models/TeachingSchedule.js";
import Employee from "../models/Employee.js";

const addSchedule = async (req, res) => {
    try {
        const { employeeId, subject, classRoom, date, startTime, endTime } = req.body;
        const newSchedule = new TeachingSchedule({
            employeeId,
            subject,
            classRoom,
            date,
            startTime,
            endTime,
        });
        await newSchedule.save();
        return res.status(200).json({ success: true, schedule: newSchedule });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Schedule add server error" });
    }
};

const getSchedules = async (req, res) => {
    try {
        const schedules = await TeachingSchedule.find().populate({
            path: 'employeeId',
            populate: { path: 'userId', select: 'name' },
            select: 'employeeId department'
        }).populate({
            path: 'employeeId',
            populate: { path: 'department', select: 'dep_name' }
        });
        return res.status(200).json({ success: true, schedules });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Schedule list server error" });
    }
};

const getSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await TeachingSchedule.findById(id).populate({
            path: 'employeeId',
            populate: [
                { path: 'userId', select: 'name' },
                { path: 'department', select: 'dep_name' }
            ]
        });
        return res.status(200).json({ success: true, schedule });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Schedule detail server error" });
    }
};

const getSchedulesByRole = async (req, res) => {
    try {
        const { id, role } = req.params;
        let schedules;
        if (role === 'admin') {
            schedules = await TeachingSchedule.find({ employeeId: id }).populate({
                path: 'employeeId',
                populate: [
                    { path: 'userId', select: 'name' },
                    { path: 'department', select: 'dep_name' }
                ]
            });
        } else {
            const employee = await Employee.findOne({ userId: id });
            if (!employee) {
                return res.status(404).json({ success: false, error: 'Employee not found' });
            }
            schedules = await TeachingSchedule.find({ employeeId: employee._id }).populate({
                path: 'employeeId',
                populate: [
                    { path: 'userId', select: 'name' },
                    { path: 'department', select: 'dep_name' }
                ]
            });
        }
        return res.status(200).json({ success: true, schedules });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Schedule list server error" });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const update = { ...req.body, updatedAt: Date.now() };
        const schedule = await TeachingSchedule.findByIdAndUpdate(id, update, { new: true });
        if (!schedule) {
            return res.status(404).json({ success: false, error: 'Schedule not found' });
        }
        return res.status(200).json({ success: true, schedule });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Schedule update server error" });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await TeachingSchedule.findById(id);
        if (!schedule) {
            return res.status(404).json({ success: false, error: 'Schedule not found' });
        }
        await schedule.deleteOne();
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Schedule delete server error" });
    }
};

export { addSchedule, getSchedules, getSchedule, updateSchedule, deleteSchedule, getSchedulesByRole };