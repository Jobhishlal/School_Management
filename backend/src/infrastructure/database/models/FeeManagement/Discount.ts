import mongoose, { Document, Schema } from "mongoose";

export interface IDiscount extends Document {
  name: string;
  type: "AMOUNT" | "PERCENT";
  value: number;
  applicableTo?: Schema.Types.ObjectId[]; 
  active: boolean;
}

const DiscountSchema = new Schema<IDiscount>({
  name: { type: String, required: true },
  type: { type: String, enum: ["AMOUNT", "PERCENT"], required: true },
  value: { type: Number, required: true },
  applicableTo: { type: [Schema.Types.ObjectId], default: [] },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const DiscountModel = mongoose.model<IDiscount>("Discount", DiscountSchema);