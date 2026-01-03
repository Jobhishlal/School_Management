import { TakeAttendance } from "../../../applications/dto/Attendance/TakeAttendanceDTO";
import { AttendanceEntity } from "../../entities/AttandanceEntity";


export interface IAttendanceCreateUseCase {
    execute(data:TakeAttendance):Promise<AttendanceEntity>
}