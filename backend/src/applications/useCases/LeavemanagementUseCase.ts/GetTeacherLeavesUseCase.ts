import { InterfaceLeaveManagement } from "../../../domain/repositories/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { IGetTeacherUseCase } from "../../../domain/UseCaseInterface/LeaveManagement/IGetTeacherUseCase";

export class GetTeacherLeavesUseCase  implements IGetTeacherUseCase{
    constructor(private leaveRepo: InterfaceLeaveManagement) { }


    async execute(teacherId: string): Promise<LeaveManagementEntity[]> {
        return this.leaveRepo.getLeavesByTeacherId(teacherId)
    }
}

