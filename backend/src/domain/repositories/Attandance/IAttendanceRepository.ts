import { AttendanceEntity ,AttendanceSession} from "../../entities/AttandanceEntity";
import { TakeAttendance } from "../../../applications/dto/Attendance/TakeAttendanceDTO";
import { Types } from "mongoose";
import { Class } from "../../entities/Class";
import { TodayAttendanceResponse,TodayAttendanceItemDTO } from "../../../applications/dto/Attendance/TodayAttendanceDTO";
import { ParentAttendanceDashboardDTO } from "../../../applications/dto/Attendance/ParentAttendanceDashboardDTO";


export interface IAttandanceRepository{
    create(data:TakeAttendance):Promise<AttendanceEntity>
    findByDateSession(classId: Types.ObjectId | string, date: Date, session: AttendanceSession): Promise<AttendanceEntity | null>;
    findclassTeacher(id:string):Promise<Class>
    getTodayAttendanceByClass(classId: string): Promise<TodayAttendanceItemDTO[]>;
    findParentWithStudent(parentId: string): Promise<{
    studentId: string;
  }>;

 getParentAttendanceDashboard(
    parentId: string
  ): Promise<ParentAttendanceDashboardDTO>;
}