import { LeaveManagementEntity } from "../../../domain/entities/LeaveManagement/LeaveManagementEntity";

export function validateLeaveCreate(data: ReturnType<typeof JSON.parse>): void {
    LeaveManagementEntity.validate(data);
}
