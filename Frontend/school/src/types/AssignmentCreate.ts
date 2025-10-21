
interface FileAttachment {
  fileObj: File;      
  fileName: string;
  uploadedAt: Date;
}


export interface CreateAssignmentDTO {
  id:string;
  Assignment_Title: string;
  description: string;
  subject: string;
  classId:string;
  division:string;
  Assignment_date: Date;
  Assignment_Due_Date: Date;
  attachments?: FileAttachment[];
  maxMarks: number;
  teacherId: string;
}
