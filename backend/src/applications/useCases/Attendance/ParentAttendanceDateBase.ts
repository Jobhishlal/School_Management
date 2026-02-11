import { IParentDateBaseAttendance } from "../../interface/UseCaseInterface/Attandance/IParentDateBaseAttendance";
import { IAttandanceRepository } from "../../interface/RepositoryInterface/Attandance/IAttendanceRepository";

export class ParentDateBaseAttendanceSearch implements IParentDateBaseAttendance {
    constructor(private readonly repo: IAttandanceRepository) { }

    async execute(parentId: string, startDate: Date, endDate: Date): Promise<any> {
        const data = await this.repo.getParentAttendanceByDateRange(parentId, startDate, endDate)
        if (!data) {
            throw new Error("students not found")
        }
        return data
    }
}