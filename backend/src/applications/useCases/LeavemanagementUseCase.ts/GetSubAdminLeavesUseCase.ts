import { InterfaceLeaveManagement } from "../../interface/RepositoryInterface/ILeaveManagement/ILeaveManagement";
import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";
import { IGetTeacherUseCase } from "../../interface/UseCaseInterface/LeaveManagement/IGetTeacherUseCase";



export interface IGetSubAdminLeavesUseCase {
    execute(subAdminId: string): Promise<LeaveManagementEntity[]>;
}

export class GetSubAdminLeavesUseCase implements IGetSubAdminLeavesUseCase {
    constructor(private readonly leaveRepo: InterfaceLeaveManagement) { }

    async execute(subAdminId: string): Promise<LeaveManagementEntity[]> {
        return await this.leaveRepo.getLeavesBySubAdminId(subAdminId);
    }
}
