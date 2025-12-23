export interface StudentExamResultResponse {
  examId: string;
  examTitle: string;
  subject: string;
  examDate: Date;
  maxMarks: number;

  marksObtained: number | null;
  progress: string | null;
  remarks: string | null;
}