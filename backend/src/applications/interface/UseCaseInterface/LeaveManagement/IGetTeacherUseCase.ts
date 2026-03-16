import { LeaveManagementEntity } from "../../../../domain/entities/LeaveManagement/LeaveManagementEntity";

export interface IGetTeacherUseCase {
    execute(teacherId:string):Promise<LeaveManagementEntity[]>
}