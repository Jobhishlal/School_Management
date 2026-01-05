export type AttendanceStatusDTO = "Present" | "Absent" | "Leave";


export interface AttendanceItemDTO {
  studentId: string;         
  status: AttendanceStatusDTO;
  remarks?: string;
}

export interface TakeAttendance {
  classId: string;          
  teacherId: string;          
  date: Date;                
  session: "Morning" | "Afternoon"; 
  attendance: AttendanceItemDTO[];
}
