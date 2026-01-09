import { InterLeaveManagement } from "../../infrastructure/database/models/Leavemanagement/LeaveManagement";
import { LeaveManagementEntity } from "../entities/LeaveManagement/LeaveManagementEntity";


export const toLeaveManagementEntity = (
  doc: InterLeaveManagement
): LeaveManagementEntity => {
  const teacherIdAny = doc.teacherId as any;

  const teacherIdStr = (teacherIdAny && typeof teacherIdAny === 'object' && '_id' in teacherIdAny)
    ? teacherIdAny._id.toString()
    : teacherIdAny.toString();

  const teacherName = (teacherIdAny && typeof teacherIdAny === 'object' && 'name' in teacherIdAny)
    ? teacherIdAny.name
    : undefined;

  return new LeaveManagementEntity(
    doc.id.toString(),

    teacherIdStr,

    doc.leaveType,

    doc.startDate,
    doc.endDate,
    doc.totalDays,

    doc.reason,

    doc.status,

    doc.appliedAt,

    doc.actionBy?.toString(),
    doc.actionAt,
    doc.adminRemark,
    doc.warningMessage,
    teacherName
  );
};