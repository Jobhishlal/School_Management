
import { TodayAttendanceResponse } from "../../../applications/dto/Attendance/TodayAttendanceDTO";
export interface IAttendanceList {
  execute(classId: string, status?: string): Promise<TodayAttendanceResponse>;
}