import Employee from '../models/Employee.js'
import Leave from '../models/Leave.js'


const addLeave = async (req, res) => {
    try{
        const {userId, leaveType, startDate, endDate, reason} = req.body
        const employee = await Employee.findOne({userId})
        const newLeave = new Leave({
            employeeId: employee._id, leaveType, startDate, endDate, reason
        })

        await newLeave.save()
        return res.status(200).json({success: true})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "Leave add server error"})
    }
}

const getLeave = async(req, res) => {
    try{
        const {id, role} = req.params;
        let leaves
        if(role === "admin"){
            leaves = await Leave.find({employeeId: id})
        }else{
            const employee = await Employee.findOne({userId: id})
            leaves = await Leave.find({employeeId: employee?._id})
        }
        const currentYear = new Date().getFullYear()
        const daysTaken = leaves.reduce((acc, leave) => {
            if(leave.status === "Approved"){
                const start = new Date(leave.startDate)
                if(start.getFullYear() === currentYear){
                    const end = new Date(leave.endDate)
                    acc += end.getDate() - start.getDate()
                }
            }
            return acc
        }, 0)
        const daysLeft = 12 - daysTaken
        return res.status(200).json({success: true, leaves, daysLeft})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "Leave add server error"})
    }
}

const getLeaves = async(req, res) => {
    try{
        const leaves = await Leave.find().populate({
            path: "employeeId",
            populate: [
                {   
                    path: 'department',
                    select: 'dep_name'
                },

                {
                    path: 'userId',
                    select: 'name'
                }
            ]
        })
        const currentYear = new Date().getFullYear()
        const daysByEmployee = {}
        leaves.forEach((leave) => {
            if(!leave.employeeId) return
            if(leave.status !== "Approved") return
            const id = leave.employeeId._id.toString()
            const start = new Date(leave.startDate)
            if(start.getFullYear() === currentYear){
                const end = new Date(leave.endDate)
                daysByEmployee[id] = (daysByEmployee[id] || 0) + (end.getDate() - start.getDate())
            }
        })
        const leavesWithDays = leaves.map((leave) => {
            const obj = leave.toObject()
            if(leave.employeeId){
                const id = leave.employeeId._id.toString()
                const taken = daysByEmployee[id] || 0
                obj.daysLeft = 12 - taken
            }else{
                obj.daysLeft = null
            }
            return obj
        })
        return res.status(200).json({success: true, leaves: leavesWithDays})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "Leave add server error"})
    }
}

const getLeaveDetail = async(req, res) => {
    try{
        const {id} = req.params;
        const leave = await Leave.findById({_id: id}).populate({
            path: "employeeId",
            populate: [
                {   
                    path: 'department',
                    select: 'dep_name'
                },

                {
                    path: 'userId',
                    select: 'name profileImage'
                }
            ]
        })
        return res.status(200).json({success: true, leave})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "Leave detail server error"})
    }
}

const updateLeave = async (req, res) => {
    try{
        const {id} = req.params;
        const leave = await Leave.findByIdAndUpdate({_id: id}, {status: req.body.status})
        if(!leave){
            return res.status(404).json({success: false, error: "Leave not founded"})
        }
            return res.status(200).json({success: true})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({success: false, error: "Leave update server error"})
    }
}

export {addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave} 