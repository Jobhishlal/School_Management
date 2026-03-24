import { UpdateAttendanceDTO } from "../../../dto/Attendance/UpdateAttendanceDTO";

export interface IUpdateAttendanceUseCase {
    execute(dto: UpdateAttendanceDTO): Promise<boolean>;
}
