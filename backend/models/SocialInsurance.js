import mongoose from "mongoose";
import { Schema } from "mongoose";

const socialInsuranceSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    socialInsuranceNumber: { type: String, required: true },
    startDate: { type: Date, required: true },
    salary: { type: Number, required: true },
    status: { type: String, enum: ["active", "paused", "stopped"], default: "active" },
    note: { type: String },
    monthlyAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const SocialInsurance = mongoose.model("SocialInsurance", socialInsuranceSchema);
export default SocialInsurance;