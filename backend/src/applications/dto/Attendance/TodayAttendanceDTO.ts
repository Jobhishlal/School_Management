export type AttendanceStatusDTO ="Present" | "Absent" | "Leave";


export interface TodayAttendanceItemDTO {
  studentId: string;
  studentName: string;
  Morning: AttendanceStatusDTO;
  Afternoon: AttendanceStatusDTO;
}

export interface TodayAttendanceResponse {
  date: Date;
  totalStudents: number;
  attendance: TodayAttendanceItemDTO[];
}
