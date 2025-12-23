
export type StudentProgress =
  | "EXCELLENT"
  | "GOOD"
  | "NEEDS_IMPROVEMENT"
  | "POOR";

export interface CreateExamMarkDTO {
  examId: string;
  studentId: string;
  teacherId: string;

  marksObtained: number;
  progress: StudentProgress;
  remarks?: string;
}
