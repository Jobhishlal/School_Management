import mongoose, { Document, Schema } from "mongoose";

export interface ParentSignupInterface extends Document {
  email: string;
  password: string;
  student: Schema.Types.ObjectId;
}

const ParentSignupSchema = new Schema<ParentSignupInterface>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    student: { type: Schema.Types.ObjectId, ref: "Students", required: true },
  },
  { timestamps: true }
);

export const ParentSignupModel =
  mongoose.models.ParentSignup ||
  mongoose.model<ParentSignupInterface>("ParentSignup", ParentSignupSchema);
