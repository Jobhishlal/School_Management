
import mongoose, { Document, Schema } from "mongoose";
import { ExpensePaymentMode } from "../../../../domain/enums/FeeStructure/ExpensePaymentMode";
export interface IExpense extends Document {
  title: string;
  description?: string;
  amount: number;
  expenseDate: Date;

  paymentMode: ExpensePaymentMode;
  status: "PENDING" | "APPROVED" | "REJECTED";

  category: "EVENT" | "UTILITY" | "SALARY" | "MAINTENANCE" | "OTHER";

  createdBy: string;
  approvedBy?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: false,
      min: 1,
    },

    expenseDate: {
      type: Date,
      required: false,
    },

    paymentMode: {
      type: String,
      enum: ExpensePaymentMode,
      required: false,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    category: {
      type: String,
      enum: ["EVENT", "UTILITY", "SALARY", "MAINTENANCE", "OTHER"],
      required: false,
    },

    createdBy: {
    type: String,  
    required: true,
    },


    approvedBy: {
      type: String,
      ref: "Admin",
    },
  },
  {
    timestamps: true, 
  }
);

export const ExpenseModel = mongoose.model<IExpense>(
  "Expense",
  ExpenseSchema
);
