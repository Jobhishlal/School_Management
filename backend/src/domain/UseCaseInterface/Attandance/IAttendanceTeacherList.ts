
import { TodayAttendanceResponse } from "../../../applications/dto/Attendance/TodayAttendanceDTO";
export interface IAttendanceList {
  execute(classId: string): Promise<TodayAttendanceResponse>;
}