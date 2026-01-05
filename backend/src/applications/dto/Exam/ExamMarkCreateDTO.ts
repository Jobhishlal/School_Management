export interface ExamMarkResponseDTO {
  id: string;

  examId: string;
  studentId: string;
  teacherId: string;

  marksObtained: number;
  progress: "EXCELLENT" | "GOOD" | "NEEDS_IMPROVEMENT" | "POOR";
  remarks: string;

  createdAt: Date;
  updatedAt: Date;
}
