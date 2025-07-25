import mongoose from "mongoose";
import { Schema } from "mongoose"
const employeeSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    employeeId: {type: String, required: true, unique: true},
    address: {type: String},
    phoneNumber: {type: Number, required: true},
    identification: {type: Number, required: true},
    dob: {type: Date},
    gender: {type: String},
    certificate: {type: String},
    skill: {type: String},
    maritalStatus: {type: String},
    academicTitle: {type: String, enum: ["PGS", "GS"], required: false},
    degree: {type: String, enum: ["bachelor", "master", "doctor"], required: true},
    department: {type: Schema.Types.ObjectId, ref:"Department", required: true},
    oldDepartment: {type: Schema.Types.ObjectId, ref:"Department"},
    salary: {type: Number, required: true, default: 2340000},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
})

const Employee = mongoose.model("Employee", employeeSchema)
export default Employee;