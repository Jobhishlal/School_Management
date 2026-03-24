import { IUpdateAttendanceUseCase } from "../../interface/UseCaseInterface/Attandance/IUpdateAttendanceUseCase";
import { IAttandanceRepository } from "../../interface/RepositoryInterface/Attandance/IAttendanceRepository";
import { UpdateAttendanceDTO } from "../../dto/Attendance/UpdateAttendanceDTO";

export class UpdateAttendanceUseCase implements IUpdateAttendanceUseCase {
    constructor(private attendanceRepo: IAttandanceRepository) { }

    async execute(dto: UpdateAttendanceDTO): Promise<boolean> {
        const { studentId, date, session, status } = dto;
        if (!studentId || !date || !session || !status) {
            throw new Error("Missing required fields");
        }

        const validStatuses = ["Present", "Absent", "Leave"];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid status");
        }

        return await this.attendanceRepo.updateStudentAttendance(studentId, date, session, status);
    }
}
