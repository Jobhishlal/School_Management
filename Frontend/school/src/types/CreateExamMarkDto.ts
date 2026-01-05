export type StudentProgress =
  | "EXCELLENT"
  | "GOOD"
  | "NEEDS_IMPROVEMENT"
  | "POOR";

export interface CreateExamMarkRequestDTO {
  examId: string;
  classId:string
  studentId: string;
  marksObtained: number;
  progress: StudentProgress;
  remarks?: string;
}
