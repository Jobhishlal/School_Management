import mongoose, { Document, Schema, Types } from "mongoose";

export interface ClassAttrs {
  className: string;
  division: string;
  rollNumber: string;
  department?: "LP" | "UP" | "HS";
  subjects?: string[];
  classTeacher?: Types.ObjectId;
}

export interface ClassInterface extends Document, ClassAttrs {
  students?: any[];
}

const ClassSchema = new Schema<ClassInterface>(
  {
    className: { type: String, required: true },
    division: { type: String, required: true },
    rollNumber: { type: String, required: false },
    department: { type: String },
    subjects: { type: [String], default: [] },
    classTeacher: { type: Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ClassSchema.virtual("students", {
  ref: "Students",   
  localField: "_id",  
  foreignField: "classId", 
});

ClassSchema.set("toJSON", { virtuals: true });
ClassSchema.set("toObject", { virtuals: true });

export const ClassModel = mongoose.model<ClassInterface>("Classes", ClassSchema);