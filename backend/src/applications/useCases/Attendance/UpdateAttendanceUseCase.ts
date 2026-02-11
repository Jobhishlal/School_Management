import { IUpdateAttendanceUseCase } from "../../interface/UseCaseInterface/Attandance/IUpdateAttendanceUseCase";
import { IAttandanceRepository } from "../../interface/RepositoryInterface/Attandance/IAttendanceRepository";

export class UpdateAttendanceUseCase implements IUpdateAttendanceUseCase {
    constructor(private attendanceRepo: IAttandanceRepository) { }

    async execute(studentId: string, date: Date, session: string, status: string): Promise<boolean> {
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
