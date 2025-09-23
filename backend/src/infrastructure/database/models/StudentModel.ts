import mongoose, { Document, Types, Schema } from "mongoose";

export interface Photo {
  url: string;
  filename: string;
  uploadedAt: Date;
}

export interface StudentInterface extends Document {
   _id:string; 
  fullName: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  photos: Photo[];
  studentId: string;
  parent: Types.ObjectId;
  address: Types.ObjectId;
  classId: Types.ObjectId;
  Password:string
}

const PhotoSchema = new Schema<Photo>({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const StudentSchema = new Schema<StudentInterface>(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    photos: { type: [PhotoSchema], default: [] },
    studentId: { type: String, required: true, unique: true },
    parent: { type: Schema.Types.ObjectId, ref: "Parents", required: true },
    address: { type: Schema.Types.ObjectId, ref: "Addresses", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Classes", required: true },
    Password:{type:String,required:true}
  },
  { timestamps: true }
);

export const StudentModel = mongoose.model<StudentInterface>("Students", StudentSchema);
