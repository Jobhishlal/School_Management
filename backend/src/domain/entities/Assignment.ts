import { AttachmentDTO } from "../../applications/dto/AssignmentDTO ";


export interface AssignmentSubmitDTO {
  studentId: string;
  url: string;
  fileName: string;
  uploadedAt: Date;
   studentDescription?: string;
}

export class AssignmentEntity {
  constructor(
    public readonly id: string,
    public Assignment_Title: string,
    public description: string,
    public subject: string,
    public classId: string,
    public Assignment_date: Date,
    public Assignment_Due_Date: Date,
    public attachments: AttachmentDTO[],
    public maxMarks: number,
    public teacherId: string,
    public className?: string,
    public division?:string,
    public assignmentSubmitFile?: AssignmentSubmitDTO[]
  ) {}
}