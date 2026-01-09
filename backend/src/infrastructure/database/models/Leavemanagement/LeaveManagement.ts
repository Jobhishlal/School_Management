import mongoose, { Schema, Document, Types } from "mongoose";

export interface InterLeaveManagement extends Document {
  teacherId: Types.ObjectId;

  leaveType: "CASUAL" | "SICK" | "PAID" | "UNPAID";

  startDate: Date;
  endDate: Date;
  totalDays: number;

  reason: string;

  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

  appliedAt: Date;

  actionBy?: Types.ObjectId;
  actionAt?: Date;
  adminRemark?: string;
  warningMessage?: string;

  createdAt: Date;
  updatedAt: Date;
}


const LeaveManagementSchema = new Schema<InterLeaveManagement>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",

      index: true,
    },


    leaveType: {
      type: String,
      enum: ["CASUAL", "SICK", "PAID", "UNPAID"],

    },

    startDate: {
      type: Date,

    },

    endDate: {
      type: Date,

    },

    totalDays: {
      type: Number,

    },

    reason: {
      type: String,

      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    actionBy: {
      type: Types.ObjectId,
      ref: "Admin",
    },

    actionAt: {
      type: Date,
    },

    adminRemark: {
      type: String,
      trim: true,
    },
    warningMessage: {
      type: String,
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

export const LeaveManagementModel = mongoose.model<InterLeaveManagement>(
  "LeaveManagement",
  LeaveManagementSchema
);