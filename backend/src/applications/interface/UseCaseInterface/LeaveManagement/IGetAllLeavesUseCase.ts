import { LeaveManagementEntity } from "../../../../domain/entities/LeaveManagement/LeaveManagementEntity";


export interface IGetAllLeavesUseCase{
    execute():Promise<LeaveManagementEntity[]>
}