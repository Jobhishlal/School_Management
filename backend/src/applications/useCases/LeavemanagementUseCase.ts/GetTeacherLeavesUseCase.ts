import { InterfaceLeaveManagement } from "../../interface/RepositoryInterface/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { IGetTeacherUseCase } from "../../interface/UseCaseInterface/LeaveManagement/IGetTeacherUseCase";

export class GetTeacherLeavesUseCase  implements IGetTeacherUseCase{
    constructor(private _leaveRepo: InterfaceLeaveManagement) { }


    async execute(teacherId: string): Promise<LeaveManagementEntity[]> {
        return this._leaveRepo.getLeavesByTeacherId(teacherId)
    }
}

