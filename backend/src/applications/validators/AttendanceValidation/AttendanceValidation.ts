import { AttendanceErrors } from "../../../domain/enums/Attendance/Attendance";
import { TakeAttendance } from "../../dto/Attendance/TakeAttendanceDTO";
import { Types } from "mongoose";




export function ValidateAttendanceCreate(data: TakeAttendance) {
  if (!data.classId || !data.teacherId || !data.attendance) {
    throw new Error(AttendanceErrors.REQUIRED);
  }

  if (!Types.ObjectId.isValid(data.classId)) {
    throw new Error(`${AttendanceErrors.INVALID_ID}: classId`);
  }

  if (!Types.ObjectId.isValid(data.teacherId)) {
    throw new Error(`${AttendanceErrors.INVALID_ID}: teacherId`);
  }

  if (!Array.isArray(data.attendance) || data.attendance.length === 0) {
    throw new Error(AttendanceErrors.EMPTY_ATTENDANCE);
  }

  const uniqueStudents = new Set<string>();

  data.attendance.forEach(item => {
    if (!item.studentId || !Types.ObjectId.isValid(item.studentId)) {
      throw new Error(`${AttendanceErrors.INVALID_ID}: studentId`);
    }

    if (!["Present", "Absent"].includes(item.status)) {
      throw new Error(AttendanceErrors.INVALID_STATUS);
    }

    if (uniqueStudents.has(item.studentId)) {
      throw new Error(AttendanceErrors.DUPLICATE_STUDENT);
    }

    uniqueStudents.add(item.studentId);

    if (item.remarks && item.remarks.length > 200) {
      throw new Error(AttendanceErrors.REMARK_LENGTH);
    }
  });

  return true;
}




