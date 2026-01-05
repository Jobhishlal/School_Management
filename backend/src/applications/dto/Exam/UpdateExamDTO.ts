import { Types } from "mongoose";

export interface UpdateExamDTO {
    id:string;
  title?: string;
  type?: "UNIT_TEST" | "MIDTERM" | "FINAL";

  classId?: Types.ObjectId;
  className?: string;
  division?: string;

  subject?: string;

  teacherId?: Types.ObjectId;
  teacherName?: string;

  examDate?: Date;
  startTime?: string;
  endTime?: string;
  maxMarks?: number;
  description?: string;
}
