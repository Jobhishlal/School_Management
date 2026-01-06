import mongoose, { Schema, Document, Types } from "mongoose";

export interface ExamDocument extends Document {
  examId: string;
  title: string;
  type: "UNIT_TEST" | "MIDTERM" | "FINAL";

  classId: Types.ObjectId;
  className: string;
  division: string;

  subject: string;

  teacherId: Types.ObjectId;
  teacherName: string;

  examDate: Date;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passMarks: number;
  description?: string;
  status: "DRAFT" | "PUBLISHED";
}

const ExamSchema = new Schema<ExamDocument>(
  {
    examId: { type: String, required: true, unique: true },
    title: { type: String, required: true },

    type: { type: String, enum: ["UNIT_TEST", "MIDTERM", "FINAL"], required: true },

    classId: { type: Schema.Types.ObjectId, ref: "Classes", required: true },
    className: { type: String, required: true },
    division: { type: String, required: true },

    subject: { type: String, required: true },

    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    teacherName: { type: String, required: true },

    examDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    maxMarks: { type: Number, required: true },
    passMarks: { type: Number, required: true },
    description: { type: String, default: "" },

    status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "DRAFT" },
  },
  { timestamps: true }
);

export const ExamModel = mongoose.model<ExamDocument>("Exam", ExamSchema);
