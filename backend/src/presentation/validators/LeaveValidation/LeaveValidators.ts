import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";

export function validateLeaveCreate(data: any): void {
    LeaveManagementEntity.validate(data);
}
