import mongoose, { Document, Schema } from "mongoose";

export interface AddressAttrs {
  street: string;
  city: string;
  state: string;
  pincode: string;
}


export interface AddressInterface extends AddressAttrs, Document {}

const AddressSchema = new Schema<AddressInterface>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { timestamps: true }
);

export const AddressModel = mongoose.model<AddressInterface>("Addresses", AddressSchema);
