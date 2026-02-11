import { AttendanceEntity } from "../../../domain/entities/AttandanceEntity";

export function validateAttendanceTake(data: any): void {
    AttendanceEntity.validate(data);
}

export function validateAttendanceFilter(startDate: any, endDate: any): void {
    AttendanceEntity.validateFilter(startDate, endDate);
}
