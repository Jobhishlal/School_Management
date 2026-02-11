import { IGetClassStudentLeavesUseCase } from "../../interface/UseCaseInterface/StudentLeave/IGetClassStudentLeavesUseCase";
import { IStudentLeaveRepository } from "../../../domain/repositories/StudentLeave/IStudentLeaveRepository";
import { StudentLeaveEntity } from "../../../domain/entities/StudentLeave/StudentLeaveEntity";

export class GetClassStudentLeavesUseCase implements IGetClassStudentLeavesUseCase {
    constructor(private readonly studentLeaveRepo: IStudentLeaveRepository) { }

    async execute(classId: string): Promise<StudentLeaveEntity[]> {
        return await this.studentLeaveRepo.getPendingLeavesByClassId(classId);
    }
}
