import { AttendanceEntity, AttendanceSession } from "../../entities/AttandanceEntity";
import { TakeAttendance } from "../../../applications/dto/Attendance/TakeAttendanceDTO";
import { Types } from "mongoose";
import { Class } from "../../entities/Class";
import { TodayAttendanceResponse, TodayAttendanceItemDTO } from "../../../applications/dto/Attendance/TodayAttendanceDTO";
import { ParentAttendanceDashboardDTO } from "../../../applications/dto/Attendance/ParentAttendanceDashboardDTO";
import { ParentAttendanceHistory } from "../../../applications/dto/Attendance/ParentAttendanceHistory";

export interface IAttandanceRepository {
  create(data: TakeAttendance): Promise<AttendanceEntity>
  findByDateSession(classId: Types.ObjectId | string, date: Date, session: AttendanceSession): Promise<AttendanceEntity | null>;
  findclassTeacher(id: string): Promise<Class>
  getTodayAttendanceByClass(classId: string, status?: string): Promise<TodayAttendanceItemDTO[]>;
  findParentWithStudent(parentId: string): Promise<{
    studentId: string;
  }>;

  getParentAttendanceDashboard(parentId: string): Promise<ParentAttendanceDashboardDTO>;

  getAttendanceByDateRange(classId: string, startDate: Date, endDate: Date): Promise<any[]>;
  getStudentAttendanceHistory(studentId: string, month: number, year: number): Promise<any>;
  updateStudentAttendance(studentId: string, date: Date, session: string, status: string): Promise<boolean>;
  getParentAttendanceByDateRange(parentId: string, startDate: Date, endDate: Date): Promise<ParentAttendanceHistory>;
  getStudentOwnAttendanceDashboard(studentId: string): Promise<ParentAttendanceDashboardDTO>;
  getStudentOwnAttendanceByDateRange(studentId: string, startDate: Date, endDate: Date): Promise<ParentAttendanceHistory>;
  calculateClassAttendancePercentage(classId: string): Promise<{ percentage: number, trend: number }>;
  getAttendancePercentages(studentIds: string[]): Promise<Record<string, number>>;
}