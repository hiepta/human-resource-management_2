import Contract from "../models/Contract.js";

const addContract = async (req, res) => {
    try {
        const { employeeId, startDate, endDate, signDate, signTimes, salaryCoefficient, term } = req.body;
        const newContract = new Contract({
            employeeId,
            startDate,
            endDate,
            signDate,
            signTimes,
            salaryCoefficient,
            term,
        });
        await newContract.save();
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
        const { employeeId, startDate, endDate, signDate, signTimes, salaryCoefficient, term } = req.body;
        const updateContract = await Contract.findByIdAndUpdate(
            { _id: id },
            { employeeId, startDate, endDate, signDate, signTimes, salaryCoefficient, term }
        );
        return res.status(200).json({ success: true, contract: updateContract });
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

export { addContract, getContracts, getContract, updateContract, deleteContract };