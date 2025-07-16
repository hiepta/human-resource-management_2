import mongoose from "mongoose";
const { Schema } = mongoose;

const teachingScheduleSchema = new Schema({
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    subject: { type: String, required: true },
    classRoom: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const TeachingSchedule = mongoose.model("TeachingSchedule", teachingScheduleSchema);
export default TeachingSchedule;