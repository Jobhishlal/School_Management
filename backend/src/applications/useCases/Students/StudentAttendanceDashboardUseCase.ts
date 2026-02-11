
import { IAttandanceRepository } from "../../interface/RepositoryInterface/Attandance/IAttendanceRepository";
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
