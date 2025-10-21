import { AttachmentDTO } from "../../applications/dto/AssignmentDTO ";

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
    public division?:string
  ) {}
}