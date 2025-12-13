
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Attachment {
  url: string;
  fileName: string;
  uploadedAt: Date;
}

export interface AssignmentSubmitFile{ 
  studentId: Types.ObjectId;
  url:string;
  fileName:string;
  uploadedAt:Date;
  studentDescription:string;
}

export interface AssignmentDocument extends Document {
  Assignment_Title: string;
  description: string;
  subject: string;
  classId: Types.ObjectId; 
  Assignment_date: Date;
  Assignment_Due_Date: Date;
  attachments: Attachment[];
  maxMarks: number;
  teacherId: Types.ObjectId; 
  assignmentSubmitFile:AssignmentSubmitFile[];
 
}

const AssignmentSchema = new Schema<AssignmentDocument>(
  {
    Assignment_Title: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Classes", required: true },
    Assignment_date: { type: Date, required: true },
    Assignment_Due_Date: { type: Date, required: true },
    attachments: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: "Student" },
        url: { type: String },
        fileName: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    maxMarks: { type: Number, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    assignmentSubmitFile:[
      {
        url:{type:String},
        fileName:{type:String},
        uploadedAt:{type:Date,default:Date.now},
        studentDescription:{type:String}
      }
    ],

  },
  { timestamps: true }
);

export const AssignmentModel = mongoose.model<AssignmentDocument>(
  "Assignment",
  AssignmentSchema
);
