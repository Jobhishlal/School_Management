import mongoose, { Document, Schema, Types } from "mongoose";

export type AttendanceStatus = "Present" | "Absent";

export interface AttendanceItem {
  studentId: Types.ObjectId;
  fullName:string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceInterface extends Document {
  classId: Types.ObjectId;
  teacherId: Types.ObjectId;
  date: Date;
  session: "Morning" | "Afternoon";
  attendance: AttendanceItem[];
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceItemSchema = new Schema<AttendanceItem>({
  studentId: { type: Schema.Types.ObjectId, ref: "Students", required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true },
  remarks: { type: String },
});

const AttendanceSchema = new Schema<AttendanceInterface>(
  {
    classId: { type: Schema.Types.ObjectId, ref: "Classes", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    date: { type: Date, required: true },
    session: { type: String, enum: ["Morning", "Afternoon"], required: true },
    attendance: { type: [AttendanceItemSchema], default: [] },
  },
  { timestamps: true }
);

export const AttendanceModel = mongoose.model<AttendanceInterface>(
  "Attendance",
  AttendanceSchema
);
