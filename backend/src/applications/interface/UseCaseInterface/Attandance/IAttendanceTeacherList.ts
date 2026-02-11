
import { TodayAttendanceResponse } from "../../../dto/Attendance/TodayAttendanceDTO";
export interface IAttendanceList {
  execute(classId: string, status?: string): Promise<TodayAttendanceResponse>;
}