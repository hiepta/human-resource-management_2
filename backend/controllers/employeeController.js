import Employee from "../models/Employee.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import multer from "multer"
import path from "path"
import Department from '../models/Department.js'
import mongoose from "mongoose"
import SocialInsurance from "../models/SocialInsurance.js"
import Contract from "../models/Contract.js"
import Attendance from "../models/Attendance.js"
const mapDegree = (degree) => {
    const degreeMap = {
        bachelor: "Cử nhân",
        master: "Thạc sĩ",
        doctor: "Tiến sĩ",
    };
    return degreeMap[degree] || degree;
};
//Dùng để lưu file ảnh vào thư mục public/ uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

// Thêm nhân viên mới
const addEmployee = async (req, res) => {
    try{
    const {
        name, email, employeeId, dob, phoneNumber, address, identification, gender, maritalStatus, academicTitle, degree, department, salary, password, role,
        skill,certificate
    } = req.body;

    // Kiểm tra nếu email đã tồn tại trong user 
    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({success: false, error: "User alreadly registered in emp"})
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        name, 
        email,
        password: hashPassword,
        role,
        profileImage: req.file ? req.file.filename : ""
    })
    const savedUser = await newUser.save()
    let finalEmployeeId = employeeId
    if(!finalEmployeeId){
        finalEmployeeId = await calculateNextEmployeeId()
    }
    const newEmployee = new Employee({
        // userId: savedUser._id, 
        // employeeId,
        userId: savedUser._id,
        employeeId: finalEmployeeId,
        address,
        phoneNumber,
        identification,
        dob,
        gender,
        maritalStatus,
        academicTitle,
        degree,
        department: new mongoose.Types.ObjectId(department),
        oldDepartment: new mongoose.Types.ObjectId(department),
        salary,
        skill,
        certificate,
    })
    await newEmployee.save()
    return res.status(200).json({success: true, message: "employee created"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "Server error in adding employee"})
    }
}

const getEmployees = async (req, res) => {
    try{
        const {id} = req.params;
        // const employees = await Employee.find().populate('userId', {password: 0}).populate("department")
        const employees = await Employee.find()
            .populate('userId', { password: 0 })
            .populate('department')
            .populate('oldDepartment')
            .lean()

        const mapped = employees.map(emp => ({
            ...emp,
            degreeText: mapDegree(emp.degree),
        }))
        return res.status(200).json({ success: true, employees: mapped })
    }catch(error){
        return res.status(500).json({success: false, error: "get employees server error"})
    }
}

const calculateNextEmployeeId = async () => {
    const result = await Employee.aggregate([
        { $addFields: { numericId: { $toInt: "$employeeId" } } },
        { $sort: { numericId: -1 } },
        { $limit: 1 }
    ]);
    if (result.length && !isNaN(result[0].numericId)) {
        return String(result[0].numericId + 1);
    }
    return '1';
};

const getEmployee = async (req, res) => {
    const {id} = req.params;
    try{
        let employee;
        // employee = await Employee.findById({_id: id}).populate('userId', {password: 0}).populate("department")
        employee = await Employee.findById({_id: id}).populate('userId', {password: 0}).populate("department").populate("oldDepartment")
        if(!employee){
            employee = await Employee.findOne({userId: id}).populate('userId', {password: 0}).populate("department").populate("oldDepartment")
        }

        if(employee){
            
            employee = employee.toObject();
            employee.degreeText = mapDegree(employee.degree);
        }


        return res.status(200).json({success: true, employee})
    }catch(error){
        return res.status(500).json({success: false, error: "get employees server error"})
    }
}

const updateEmployee = async(req, res) => {
    try{
        const {id} = req.params;
        const {
            name, maritalStatus, academicTitle, degree, department, salary, address, employeeId,skill,certificate
        } = req.body;
        const employee = await Employee.findById({_id: id})
        if(!employee){
            return res.status(404).json({success: false, error: "employee not found"})
        }
        const user = await User.findById({_id: employee.userId})

        if(!user){
            return res.status(404).json({success: false, error: "User not found"})
        }
        const updateUser = await User.findByIdAndUpdate({_id: employee.userId}, {name})
        // const updateEmployee = await Employee.findByIdAndUpdate({_id: id}, {
            const updateData = {
                maritalStatus,
                academicTitle,
                degree,
                salary,
                address,
                employeeId,
                skill,
                certificate
            }
        if(department && mongoose.Types.ObjectId.isValid(department)){
            if(employee.department.toString() !== department){
                updateData.oldDepartment = employee.department
            }
            updateData.department = new mongoose.Types.ObjectId(department)
        }
        const updateEmployee = await Employee.findByIdAndUpdate({_id: id}, updateData)
            // }
            

        if(!updateEmployee || !updateUser){
            return res.status(404).json({success: false, error: "document not found"})
        }
        return res.status(200).json({success: true, message: "Employee update"})

    }catch(error){
        return res.status(500).json({success: false, error: "update employees server error"})

    }
}

    const fetchEmployeesByDepId = async (req, res) => {
        const {id} = req.params;
        try{
            const employees = await Employee.find({ department: id })
                .populate('userId', { password: 0 })
                .populate('department')
                .populate('oldDepartment')
                .lean()

                const mapped = employees.map(emp => ({
                    ...emp,
                    degreeText: mapDegree(emp.degree),
                }))
                return res.status(200).json({ success: true, employees: mapped })
        }catch(error){
            return res.status(500).json({success: false, error: "get employeesByDepId server error"})
        }
    }


    const deleteEmployee = async (req, res) => {
        try{
            const {id} = req.params;
            const employee = await Employee.findById({_id: id})
                .populate('userId', 'name')
                .populate('department', 'dep_name')
            if(!employee){
                return res.status(404).json({success: false, error: "employee not found"})
            }
            await Attendance.updateMany({ employeeId: employee._id }, {
                employeeSnapshot: {
                    employeeId: employee.employeeId,
                    name: employee.userId?.name || '',
                    department: employee.department?.dep_name || ''
                }
            })
            await User.findByIdAndDelete(employee.userId)
            await SocialInsurance.deleteMany({ employeeId: employee._id })
            await Contract.deleteMany({ employeeId: employee._id })
            await employee.deleteOne()
            return res.status(200).json({success: true})
        }catch(error){
            return res.status(500).json({success: false, error: "delete employee server error"})
        }
    }

    const getNextEmployeeId = async (req, res) => {
        try {
            const lastEmployee = await Employee.findOne().sort({ employeeId: -1 }).select('employeeId');
            let nextId = '1';
            if (lastEmployee) {
                const lastIdNum = parseInt(lastEmployee.employeeId, 10);
                if (!isNaN(lastIdNum)) {
                    nextId = String(lastIdNum + 1);
                }
            }
            return res.status(200).json({ success: true, nextId });
        } catch (error) {
            return res.status(500).json({ success: false, error: 'get next employeeId server error' });
        }
    }    
export {addEmployee, getNextEmployeeId, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId, deleteEmployee}