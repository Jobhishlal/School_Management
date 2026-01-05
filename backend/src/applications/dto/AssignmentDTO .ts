export interface AttachmentDTO {
  url: string;
  filename: string;
  uploadedAt: Date;
}



import { Types } from "mongoose";


export interface IAssignmentDTO {
  id?: string;
  Assignment_Title: string;
  description: string;
  subject: string;
  classId: Types.ObjectId;
  Assignment_date: Date;
  Assignment_Due_Date: Date;
  attachments: AttachmentDTO[];
  maxMarks: number;
  teacherId: Types.ObjectId;
}


export interface CreateAssignmentDTO {
  id: string;
  Assignment_Title: string;
  description: string;
  subject: string;
  classId: string;
  Assignment_date: Date;
  Assignment_Due_Date: Date;
  attachments?: { url: string; fileName: string, uploadedAt: Date }[];
  maxMarks: number;
  teacherId: string;
}


export interface AssignmentDTO {
  id: string;
  Assignment_Title: string;
  description: string;
  subject: string;
  classId: string;
  Assignment_date: Date;
  Assignment_Due_Date: Date;
  attachments?: { url: string; fileName: string; uploadedAt: Date }[];
  maxMarks: number;
  teacherId: string;
}




export interface SubmitDTO {
  assignmentId: string;
  studentId: string;
  fileUrl: string;
  fileName: string;
  studentDescription?: string;
}

export interface ValidationDTO {
  assignmentId: string;
  studentId: string;
  grade: number;
  feedback: string;
  badge: string;
  status?: string;
}
