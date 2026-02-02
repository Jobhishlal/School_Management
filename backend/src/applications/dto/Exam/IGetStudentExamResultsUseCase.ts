

export interface StudentProfileDTO {
  id: string;
  fullName: string;
  studentId: string;
  classId: string;

  classDetails?: {
    className: string;
    division: string;
    department: string;
    rollNumber: string;
  };
}

export interface StudentExamResultDTO {
  examId: string;
  examTitle: string;
  subject: string;
  examDate: Date;
  maxMarks: number;
  marksObtained: number | null;
  percentage: number | null;
  progress: string | null;
  remarks: string | null;
  _id?: string;
  concern?: string | null;
  concernStatus?: "Pending" | "Resolved" | "Rejected" | null;
  concernResponse?: string | null;
  updatedAt?: Date | null;
  status: "Pending" | "Passed" | "Failed";
  className?: string;
  division?: string;
}

export interface StudentExamResultResponse {
  student: StudentProfileDTO;
  results: StudentExamResultDTO[];
}
