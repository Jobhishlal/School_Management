
import mongoose, { Document, Schema } from "mongoose";

export interface IFeeStructureItem {
  feeTypeId: Schema.Types.ObjectId;
  name?: string;          
  amount: number;       
  frequency: "ONCE" | "MONTHLY" | "YEARLY";
  isOptional: boolean;
}

export interface IFeeStructure extends Document {
  name: string;           
  classId: Schema.Types.ObjectId;
  academicYear: string;  
  feeItems: IFeeStructureItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeeStructureItemSchema = new Schema<IFeeStructureItem>({
  feeTypeId: { type: Schema.Types.ObjectId, ref: "FeeType" },
  name: { type: String }, 
  amount: { type: Number },
  frequency: { type: String, enum: ["ONCE", "MONTHLY", "YEARLY"] },
  isOptional: { type: Boolean, default: false }
}, { _id: false });

const FeeStructureSchema = new Schema<IFeeStructure>({
  name: { type: String },
  classId: { type: Schema.Types.ObjectId, ref: "Classes"},
  academicYear: { type: String},
  feeItems: { type: [FeeStructureItemSchema], default: [] },
  notes: { type: String }
}, { timestamps: true });

export const FeeStructureModel = mongoose.model<IFeeStructure>("FeeStructure", FeeStructureSchema);
