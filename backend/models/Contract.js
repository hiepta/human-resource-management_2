import mongoose from "mongoose";
import { Schema } from "mongoose";

const contractSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    signDate: { type: Date, required: true },
    signTimes: { type: Number, required: true, default: 1 },
    salaryCoefficient: { type: Number, required: true },
    duration: { type: Number, required: true },
    term: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Contract = mongoose.model("Contract", contractSchema);
export default Contract;