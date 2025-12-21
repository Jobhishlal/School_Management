import { AttendanceEntity ,AttendanceSession} from "../../entities/AttandanceEntity";
import { TakeAttendance } from "../../../applications/dto/Attendance/TakeAttendanceDTO";
import { Types } from "mongoose";
import { Class } from "../../entities/Class";


export interface IAttandanceRepository{
    create(data:TakeAttendance):Promise<AttendanceEntity>
  findByDateSession(classId: Types.ObjectId | string, date: Date, session: AttendanceSession): Promise<AttendanceEntity | null>;
  findclassTeacher(id:string):Promise<Class>
}