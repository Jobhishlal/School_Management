import mongoose, { Document, Schema, Types } from "mongoose";

export interface TeacherDocument {
  url: string;
  filename: string;
  uploadedAt: Date;
}
interface Subject {
  name: string;
  code: string;
}

export interface Teachers extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  gender: string;
  phone: string;
  Password: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  blocked: boolean;
  documents?: TeacherDocument[];
  subjects: Subject[],
  department?: "LP" | "UP" | "HS";
  leaveBalance: {
    sickLeave: number;
    casualLeave: number;
  };
}

const TeacherDocumentSchema = new Schema<TeacherDocument>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const TeacherSchema = new Schema<Teachers>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: "Teacher" },
    blocked: { type: Boolean, default: false },
    Password: { type: String },
    documents: { type: [TeacherDocumentSchema], default: [] },
    subjects: [
      {
        name: { type: String, required: true },
        code: { type: String, required: true },
      }
    ],
    department: { type: String, enum: ["LP", "UP", "HS"] },
    leaveBalance: {
      sickLeave: { type: Number, default: 5 },
      casualLeave: { type: Number, default: 5 }
    }
  },
  { timestamps: true }
);

export const TeacherModel = mongoose.model<Teachers>("Teacher", TeacherSchema);
