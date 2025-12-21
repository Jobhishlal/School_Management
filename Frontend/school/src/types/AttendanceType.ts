export interface AttendanceItemPayload {
  studentId: string;
  status: "Present" | "Absent";
  remarks?: string;
}

export interface TakeAttendancePayload {
  classId: string;
  teacherId: string;
  date: string;
  session:  "Morning" | "Afternoon"
  attendance: AttendanceItemPayload[];
}