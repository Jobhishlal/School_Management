export interface AttendanceItemPayload {
  studentId: string;
  status: "Present" | "Absent"|"Leave";
  remarks?: string;
}

export interface TakeAttendancePayload {
  classId: string;
  teacherId: string;
  date: Date;
  session:  "Morning" | "Afternoon"
  attendance: AttendanceItemPayload[];
}