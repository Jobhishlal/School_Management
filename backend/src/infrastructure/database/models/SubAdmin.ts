import mongoose, { Schema, Document, Types } from "mongoose";

import { AdminRole } from "../../../domain/enums/AdminRole";



export interface SubAdminDocument {
  url: string;
  filename: string;
  uploadedAt: Date;
}


export interface SubAdminPhoto {
  url: string;
  filename: string;
  uploadedAt: Date;
}


export interface SubAdmin extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
  blocked: boolean,
  major_role: string,
  dateOfBirth: Date,
  gender: "Male" | "Female" | "Other",
  documents: SubAdminDocument[],
  address: Types.ObjectId,
  photo: SubAdminPhoto[],
  leaveBalance: {
    sickLeave: number;
    casualLeave: number;
  }

}

const SubAdminDocumentSchema = new Schema<SubAdminDocument>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SubAdminPhoto = new Schema<SubAdminDocument>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);


const SubAdminSchema = new Schema<SubAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(AdminRole), required: true },
    blocked: { type: Boolean, default: false },
    major_role: { type: String, default: "sub_admin" },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: false },
    documents: { type: [SubAdminDocumentSchema], default: [] },
    address: { type: Schema.Types.ObjectId, ref: "Addresses" },
    photo: { type: [SubAdminPhoto], default: [] },
    leaveBalance: {
      sickLeave: { type: Number, default: 5 },
      casualLeave: { type: Number, default: 5 }
    }
  },
  { timestamps: true }
)
export const SubAdminModel = mongoose.model<SubAdmin>("SubAdmin", SubAdminSchema)