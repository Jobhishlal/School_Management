export interface CreateExamDTO {
  examId?: string;
  title: string;
  type: "UNIT_TEST" | "MIDTERM" | "FINAL";

  classId: string;
  className: string;
  division: string;

  subject: string;

  teacherId: string;
  teacherName: string;

  examDate: Date;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passMarks: number;
  description?: string;
}
