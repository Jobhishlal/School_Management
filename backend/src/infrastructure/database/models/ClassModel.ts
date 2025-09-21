import mongoose, { Document, Schema } from "mongoose";

export interface ClassAttrs {
  className: string;
  division: string;
  rollNumber: string;
  department: "LP" | "UP" | "HS";
  subjects?: string;
}

export interface ClassInterface extends Document, ClassAttrs {}

const ClassSchema = new Schema<ClassInterface>(
  {
    className: { type: String, required: true },
    division: { type: String, required: true },
    rollNumber: { type: String, required: true },
    department: { type: String, required: true, enum: ["LP", "UP", "HS"] },
    subjects: { type: [String], default: [] }, 
  },
  { timestamps: true }
);

export const ClassModel = mongoose.model<ClassInterface>("Classes", ClassSchema);
