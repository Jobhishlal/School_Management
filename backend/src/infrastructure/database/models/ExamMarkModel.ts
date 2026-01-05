import mongoose, { Document, Types, Schema } from "mongoose";

export type StudentProgress =
  | "EXCELLENT"
  | "GOOD"
  | "NEEDS_IMPROVEMENT"
  | "POOR";

export interface ExamMarkDocument extends Document {
  examId: Types.ObjectId;
  studentId: Types.ObjectId;
  teacherId: Types.ObjectId;

  marksObtained: number;
  progress: StudentProgress;
  remarks?: string;
  concern?: string;
  concernStatus?: "Pending" | "Resolved" | "Rejected";
  concernResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamMarkSchema = new Schema<ExamMarkDocument>(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },

    progress: {
      type: String,
      enum: ["EXCELLENT", "GOOD", "NEEDS_IMPROVEMENT", "POOR"],
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },
    concern: {
      type: String,
      default: null,
    },
    concernStatus: {
      type: String,
      enum: ["Pending", "Resolved", "Rejected"],
      default: null,
    },
    concernResponse: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

ExamMarkSchema.index(
  { examId: 1, studentId: 1 },
  { unique: true }
);

export const ExamMarkModel = mongoose.model<ExamMarkDocument>(
  "ExamMark",
  ExamMarkSchema
);
