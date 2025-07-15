import mongoose from "mongoose";
import { Schema } from "mongoose";

const salarySchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

salarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

const Salary = mongoose.model('Salary', salarySchema);
export default Salary;