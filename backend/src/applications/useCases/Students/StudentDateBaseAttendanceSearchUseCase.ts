
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { ParentAttendanceHistory } from "../../dto/Attendance/ParentAttendanceHistory";

import { ValidateParentAttendanceFilter } from "../../validators/AttendanceValidation/ParentAttendanceFilterValidation";

export class StudentDateBaseAttendanceSearchUseCase {

    constructor(
        private attendanceRepo: IAttandanceRepository
    ) { }

    async execute(studentId: string, startDate: Date, endDate: Date): Promise<ParentAttendanceHistory> {
        ValidateParentAttendanceFilter(startDate, endDate);
        const data = await this.attendanceRepo.getStudentOwnAttendanceByDateRange(studentId, startDate, endDate)
        return data
    }
}
