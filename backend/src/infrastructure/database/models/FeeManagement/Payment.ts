
import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  studentFeeId: Schema.Types.ObjectId;
  studentId: Schema.Types.ObjectId;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  method?: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentDate?: Date;
  meta?: any;
  createdAt: Date;
  invoiceUrl?: string; 
}

const PaymentSchema = new Schema<IPayment>(
  {
    studentFeeId: { type: Schema.Types.ObjectId, ref: "StudentFee", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Students", required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true },
    method: { type: String },
    status: {
      type: String,
      enum: ["PENDING" , "PAID" , "FAILED" , "REFUNDED"],
      default: "PENDING",
    },
    paymentDate: { type: Date },
    meta: { type: Schema.Types.Mixed },
    invoiceUrl: { type: String },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
