import { StudentProgress } from "./CreateExamMarkDTO";

export interface UpdateExamMarkDTO {
  marksObtained?: number;
  progress?: StudentProgress;
  remarks?: string;
}
