import mongoose, { Schema, Document } from "mongoose";

export interface IStudentLeaveModel extends Document {
    studentId: mongoose.Types.ObjectId;
    classId: mongoose.Types.ObjectId;
    parentId: mongoose.Types.ObjectId;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    appliedAt: Date;
    actionBy?: mongoose.Types.ObjectId;
    actionAt?: Date;
    responseMessage?: string;
}

const StudentLeaveSchema = new Schema<IStudentLeaveModel>({
    studentId: { type: Schema.Types.ObjectId, ref: "Students", required: true, index: true },
    classId: { type: Schema.Types.ObjectId, ref: "Classes", required: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: "ParentSignup", required: true },
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING", index: true },
    appliedAt: { type: Date, default: Date.now },
    actionBy: { type: Schema.Types.ObjectId, ref: "Teacher" },
    actionAt: { type: Date },
    responseMessage: { type: String }
}, {
    timestamps: true
});

export const StudentLeaveModel = mongoose.model<IStudentLeaveModel>("StudentLeave", StudentLeaveSchema);
