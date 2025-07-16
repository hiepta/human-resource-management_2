import mongoose from "mongoose";
import { Schema } from "mongoose";

const attendanceSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    employeeSnapshot: {
        employeeId: String,
        name: String,
        department: String,
    },
    date: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: {
        type: String,
        enum: ["Present", "Late", "Absent"],
        default: "Absent"
    },
    isCompleted: { type: Boolean, default: false },
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;