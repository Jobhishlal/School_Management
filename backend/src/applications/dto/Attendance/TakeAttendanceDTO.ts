import { Types } from "mongoose";

export type AttendanceStatusDTO = "Present" | "Absent";

export interface AttendanceItemDTO {
  studentId: Types.ObjectId;
  status: AttendanceStatusDTO;
  remarks?: string;
}

export interface TakeAttendance {
  classId: Types.ObjectId;
  teacherId: String;
  date: Date;
  session: "Morning" | "Afternoon";
  attendance: AttendanceItemDTO[];
}
