
import mongoose, { Document, Schema } from "mongoose";

export interface IStudentFeeItem {
  feeTypeId: Schema.Types.ObjectId;
  name: string;     
  amount: number;   
  paid: number;       
  pending: number;   
  frequency: "ONCE" | "MONTHLY" | "YEARLY";
  isOptional: boolean;
  period?: string;   
}

export interface IStudentFee extends Document {
  studentId: Schema.Types.ObjectId;
  classId: Schema.Types.ObjectId;
  academicYear: string;
  feeStructureId: Schema.Types.ObjectId;
  month:string;
  items: IStudentFeeItem[];
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: "PENDING" | "PARTIALLY_PAID" | "PAID";
  dueDate?: Date;
  generatedAt: Date;
  notes?: string;
}

const StudentFeeItemSchema = new Schema<IStudentFeeItem>({
  feeTypeId: { type: Schema.Types.ObjectId, ref: "FeeType", required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  pending: { type: Number, required: true },
  frequency: { type: String, enum: ["ONCE", "MONTHLY", "YEARLY"], required: true },
  isOptional: { type: Boolean, default: false },
  period: { type: String }
}, { _id: false });

const StudentFeeSchema = new Schema<IStudentFee>({
  studentId: { type: Schema.Types.ObjectId, ref: "Students", required: true },
  classId: { type: Schema.Types.ObjectId, ref: "Classes", required: true },
  academicYear: { type: String, required: true },
  feeStructureId: { type: Schema.Types.ObjectId, ref: "FeeStructure", required: true },

  month: { type: String, required: true }, 

  items: { type: [StudentFeeItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, required: true },
  status: { type: String, enum: ["PENDING", "PARTIALLY_PAID", "PAID"], default: "PENDING" },

  dueDate: { type: Date },
  generatedAt: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });


export const StudentFeeModel = mongoose.model<IStudentFee>("StudentFee", StudentFeeSchema);
