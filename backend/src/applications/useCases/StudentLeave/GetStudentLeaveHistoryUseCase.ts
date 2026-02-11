import { IGetStudentLeaveHistoryUseCase } from "../../interface/UseCaseInterface/StudentLeave/IGetStudentLeaveHistoryUseCase";
import { IStudentLeaveRepository } from "../../../domain/repositories/StudentLeave/IStudentLeaveRepository";
import { StudentLeaveEntity } from "../../../domain/entities/StudentLeave/StudentLeaveEntity";

export class GetStudentLeaveHistoryUseCase implements IGetStudentLeaveHistoryUseCase {
    constructor(private readonly studentLeaveRepo: IStudentLeaveRepository) { }

    async execute(studentId: string): Promise<StudentLeaveEntity[]> {
        return await this.studentLeaveRepo.getLeavesByStudentId(studentId);
    }
}
