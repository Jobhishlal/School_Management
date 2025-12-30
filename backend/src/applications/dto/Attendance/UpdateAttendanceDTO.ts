export interface UpdateAttendanceDTO {
  studentId: string;
  date: Date;
  session: "Morning" | "Afternoon";
  status: "Present" | "Absent" | "Leave";
  teacherId: string;
}

export interface UpdateAttendanceResultDTO {
  success: boolean;
  message: string;
}
