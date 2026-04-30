import { AttendanceEntity } from "../../../domain/entities/AttandanceEntity";

export function validateAttendanceTake(data: ReturnType<typeof JSON.parse>): void {
    AttendanceEntity.validate(data);
}

export function validateAttendanceFilter(startDate: ReturnType<typeof JSON.parse>, endDate: ReturnType<typeof JSON.parse>): void {
    AttendanceEntity.validateFilter(startDate, endDate);
}
