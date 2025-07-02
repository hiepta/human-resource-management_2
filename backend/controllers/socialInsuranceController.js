import SocialInsurance from '../models/SocialInsurance.js';
import Employee from '../models/Employee.js';

const addSocialInsurance = async (req, res) => {
    try {
        const { employeeId, socialInsuranceNumber, startDate, status, note, monthlyAmount } = req.body;
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }
        const newRecord = new SocialInsurance({
            employeeId,
            socialInsuranceNumber,
            startDate,
            salary: employee.salary,
            status,
            note,
            monthlyAmount,
        });
        await newRecord.save();
        return res.status(200).json({ success: true, socialInsurance: newRecord });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Social insurance add server error' });
    }
};

const getSocialInsurances = async (req, res) => {
    try {
        const records = await SocialInsurance.find().populate('employeeId', 'employeeId');
        return res.status(200).json({ success: true, records });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Social insurance get server error' });
    }
};

const getSocialInsurance = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await SocialInsurance.findById(id).populate('employeeId', 'employeeId');
        if (!record) return res.status(404).json({ success: false, error: 'Record not found' });
        return res.status(200).json({ success: true, record });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Social insurance detail server error' });
    }
};

const getEmployeeSocialInsurance = async (req, res) => {
    try {
        const { id, role } = req.params;
        let records;
        if (role === 'admin') {
            records = await SocialInsurance.find({ employeeId: id }).populate('employeeId', 'employeeId');
        } else {
            const employee = await Employee.findOne({ userId: id });
            if (!employee) {
                return res.status(404).json({ success: false, error: 'Employee not found' });
            }
            records = await SocialInsurance.find({ employeeId: employee._id }).populate('employeeId', 'employeeId');
        }
        return res.status(200).json({ success: true, records });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Social insurance get server error' });
    }
};

const updateSocialInsurance = async (req, res) => {
    try {
        const { id } = req.params;
        const { socialInsuranceNumber, startDate, status, note, monthlyAmount } = req.body;
        const record = await SocialInsurance.findById(id);
        if (!record) return res.status(404).json({ success: false, error: 'Record not found' });
        record.socialInsuranceNumber = socialInsuranceNumber;
        record.startDate = startDate;
        record.status = status;
        record.note = note;
        record.monthlyAmount = monthlyAmount;
        await record.save();
        return res.status(200).json({ success: true, record });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Social insurance update server error' });
    }
};

const deleteSocialInsurance = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await SocialInsurance.findById(id);
        if (!record) return res.status(404).json({ success: false, error: 'Record not found' });
        await record.deleteOne();
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Social insurance delete server error' });
    }
};

export {getEmployeeSocialInsurance, addSocialInsurance, getSocialInsurances, getSocialInsurance, updateSocialInsurance, deleteSocialInsurance };