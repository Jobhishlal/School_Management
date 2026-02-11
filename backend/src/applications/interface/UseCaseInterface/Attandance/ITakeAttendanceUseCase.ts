import { TakeAttendance } from "../../../dto/Attendance/TakeAttendanceDTO";
import { AttendanceEntity } from "../../../../domain/entities/AttandanceEntity";


export interface IAttendanceCreateUseCase {
    execute(data:TakeAttendance):Promise<AttendanceEntity>
}