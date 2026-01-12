import { ApplyStudentLeaveDTO } from "../../dto/StudentLeave/ApplyStudentLeaveDTO";
import { IApplyStudentLeaveUseCase } from "../../../domain/UseCaseInterface/StudentLeave/IApplyStudentLeaveUseCase";
import { IStudentLeaveRepository } from "../../../domain/repositories/StudentLeave/IStudentLeaveRepository";
import { StudentLeaveEntity } from "../../../domain/entities/StudentLeave/StudentLeaveEntity";

export class ApplyStudentLeaveUseCase implements IApplyStudentLeaveUseCase {
    constructor(private readonly studentLeaveRepo: IStudentLeaveRepository) { }

    async execute(data: ApplyStudentLeaveDTO): Promise<StudentLeaveEntity> {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (startDate > endDate) {
            throw new Error("Start date cannot be after end date");
        }

        if (startDate < new Date(new Date().setHours(0, 0, 0, 0))) {

        }

        const leave = new StudentLeaveEntity(
            "", 
            data.studentId,
            data.classId,
            data.parentId,
            data.leaveType,
            startDate,
            endDate,
            data.reason,
            "PENDING",
            new Date(),
            undefined,
            undefined,
            undefined
        );

        return await this.studentLeaveRepo.applyLeave(leave);
    }
}
