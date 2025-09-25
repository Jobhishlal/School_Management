import mongoose, { Document, Schema } from "mongoose";

export interface ParentInterface extends Document {
  name: string;
  relationship?: "Son" | "Daughter";
  contactNumber: string;
  whatsappNumber: string;
  email?: string;
  password?: string;
}

const ParentSchema = new Schema<ParentInterface>(
  {
    name: { type: String, required: true },
    relationship: { type: String, enum: ["Son", "Daughter"], required: false },
    contactNumber: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    email: { type: String, required: false },
    password: { type: String, required: false },
  },
  { timestamps: true }
);

export const ParentModel = mongoose.model<ParentInterface>("Parents", ParentSchema);
