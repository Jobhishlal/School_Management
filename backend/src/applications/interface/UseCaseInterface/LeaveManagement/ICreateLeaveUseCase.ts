import { CreateLeaveDTO } from "../../../dto/LeaveManagement/CreateLeaveManagementDTO"
import { LeaveManagementEntity } from "../../../../domain/entities/LeaveManagement/LeaveManagementEntity"
export interface ICreateLeaveusecase {
    execute(teacherId:string,data:CreateLeaveDTO):Promise<LeaveManagementEntity>
}