import { IGetAttendanceReportUseCase } from "../../../domain/UseCaseInterface/Attandance/IGetAttendanceReportUseCase";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";

export class GetAttendanceReportUseCase implements IGetAttendanceReportUseCase {
    constructor(private repo: IAttandanceRepository) { }

    async execute(classId: string, startDate: Date, endDate: Date): Promise<any> {
        return await this.repo.getAttendanceByDateRange(classId, startDate, endDate);
    }
}
