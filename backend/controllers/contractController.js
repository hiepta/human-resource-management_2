import Contract from "../models/Contract.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
const addContract = async (req, res) => {
    try {
        const { employeeId, startDate, endDate, signDate, salaryCoefficient } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const term = diffDays <= 90 ? 'Thực tập sinh' : 'Nhân viên';
        const last = await Contract.findOne({ employeeId }).sort({ signTimes: -1 });
        const signTimes = last ? last.signTimes + 1 : 1;
        const newContract = new Contract({
            employeeId,
            startDate,
            endDate,
            signDate,
            signTimes,
            salaryCoefficient,
            duration: diffDays,
            term,
        });
        await newContract.save();
        if (Number(signTimes) >= 2) {
            const employee = await Employee.findById(employeeId);
            if (employee) {
                await User.findByIdAndUpdate(employee.userId, { role: 'employee' });
            }
        }
        return res.status(200).json({ success: true, contract: newContract });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Contract add server error" });
    }
};

const getContracts = async (req, res) => {
    try {
        // const contracts = await Contract.find().populate("employeeId", "employeeId");
        const contracts = await Contract.find().populate({path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'name',
        }});
        return res.status(200).json({ success: true, contracts });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Contract get server error" });
    }
};

const getContract = async (req, res) => {
    try {
        const { id } = req.params;
        // const contract = await Contract.findById({ _id: id }).populate("employeeId", "employeeId");
        const contract = await Contract.findById({ _id: id }).populate({path: 'employeeId',
        populate: {
          path: 'userId',
          select: 'name',
        }});

        return res.status(200).json({ success: true, contract });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Contract detail server error" });
    }
};


const updateContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { employeeId, startDate, endDate, signDate, salaryCoefficient } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const term = diffDays <= 90 ? 'Thực tập sinh' : 'Nhân viên';
        const last = await Contract.findOne({ employeeId }).sort({ signTimes: -1 });
        const signTimes = last ? last.signTimes + 1 : 1;
        const update = {
            employeeId,
            startDate,
            endDate,
            signDate,
            signTimes,
            salaryCoefficient,
            duration: diffDays,
            term,
            updatedAt: Date.now(),
            signTimes
        };
        const updatedContract = await Contract.findByIdAndUpdate(id, update, { new: true });
        if (updateContract && Number(signTimes) >= 2) {
            const employee = await Employee.findById(employeeId);
            if (employee) {
                await User.findByIdAndUpdate(employee.userId, { role: 'employee' });
            }
        }

        if (!updatedContract) {
            return res.status(404).json({ success: false, error: "Contract not found" });
        }
        return res.status(200).json({ success: true, contract: updatedContract });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Contract update server error" });
    }
};

const deleteContract = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await Contract.findById({ _id: id });
        if (!contract) {
            return res.status(404).json({ success: false, error: "Contract not found" });
        }
        await contract.deleteOne();
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Contract delete server error" });
    }
};
const getContractsByRole = async (req, res) => {
    try {
        const { id, role } = req.params;
        let contracts;
        if(role === "admin"){
            contracts = await Contract.find({ employeeId: id }).populate({
                path: 'employeeId',
                populate: { path: 'userId', select: 'name' }
            });
        }else{
            const employee = await Employee.findOne({ userId: id });
            contracts = await Contract.find({ employeeId: employee._id }).populate({
                path: 'employeeId',
                populate: { path: 'userId', select: 'name' }
            });
        }
        return res.status(200).json({ success: true, contracts });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Contract get server error" });
    }
};

const getNextSignTimes = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const last = await Contract.findOne({ employeeId }).sort({ signTimes: -1 });
        const signTimes = last ? last.signTimes + 1 : 1;
        return res.status(200).json({ success: true, signTimes });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Contract sign time server error" });
    }
};
export { addContract, getContracts, getContract, updateContract, deleteContract, getContractsByRole, getNextSignTimes };