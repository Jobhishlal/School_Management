
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { ParentAttendanceHistory } from "../../dto/Attendance/ParentAttendanceHistory";

export class StudentDateBaseAttendanceSearchUseCase {

    constructor(
        private attendanceRepo: IAttandanceRepository
    ) { }

    async execute(studentId: string, startDate: Date, endDate: Date): Promise<ParentAttendanceHistory> {
        const data = await this.attendanceRepo.getStudentOwnAttendanceByDateRange(studentId, startDate, endDate)
        return data
    }
}
