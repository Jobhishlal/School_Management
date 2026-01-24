import mongoose, { Document, Types, Schema } from "mongoose";


export interface IParentsComplaints extends Document {
  parentId: Types.ObjectId;
  concernTitle: string;
  concernDate: Date;
  description: string;
  ticketStatus: 'Pending' | 'Solved';
  adminFeedback?: string;
}

const ParentComplaints = new Schema<IParentsComplaints>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "ParentSignup",
      required: true,
    },
    concernTitle: { type: String },
    concernDate: { type: Date, default: Date.now },
    description: { type: String },
    ticketStatus: {
      type: String,
      enum: ["Pending", "Solved"],
      default: "Pending",
    },
    adminFeedback: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const ParentComplaintsSchema = mongoose.model<IParentsComplaints>("Parentcomplaints", ParentComplaints);