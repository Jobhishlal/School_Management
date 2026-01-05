import { IGetStudentAttendanceHistoryUseCase } from "../../../domain/UseCaseInterface/Attandance/IGetStudentAttendanceHistoryUseCase";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";

export class GetStudentAttendanceHistoryUseCase implements IGetStudentAttendanceHistoryUseCase {
    constructor(private repo: IAttandanceRepository) { }

    async execute(studentId: string, month: number, year: number): Promise<any> {
        return await this.repo.getStudentAttendanceHistory(studentId, month, year);
    }
}
