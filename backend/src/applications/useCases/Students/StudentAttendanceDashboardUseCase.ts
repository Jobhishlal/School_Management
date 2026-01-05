
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { ParentAttendanceDashboardDTO } from "../../dto/Attendance/ParentAttendanceDashboardDTO";

export class StudentAttendanceDashboardUseCase {

    constructor(
        private attendanceRepo: IAttandanceRepository
    ) { }

    async execute(studentId: string): Promise<ParentAttendanceDashboardDTO> {
        const data = await this.attendanceRepo.getStudentOwnAttendanceDashboard(studentId)
        return data
    }
}
