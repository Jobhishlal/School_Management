import { InterLeaveManagement } from "../database/models/Leavemanagement/LeaveManagement";
import { LeaveManagementEntity } from "../../domain/entities/LeaveManagement/LeaveManagementEntity";


export const toLeaveManagementEntity = (
  doc: InterLeaveManagement
): LeaveManagementEntity => {
  const teacherIdAny = doc.teacherId as any;

  const subAdminIdAny = doc.subAdminId as any;
  const subAdminIdStr = (subAdminIdAny && typeof subAdminIdAny === 'object' && '_id' in subAdminIdAny)
    ? subAdminIdAny._id.toString()
    : subAdminIdAny ? subAdminIdAny.toString() : undefined;

  const subAdminName = (subAdminIdAny && typeof subAdminIdAny === 'object' && 'name' in subAdminIdAny)
    ? subAdminIdAny.name
    : undefined;

  const teacherIdStr = (teacherIdAny && typeof teacherIdAny === 'object' && '_id' in teacherIdAny)
    ? teacherIdAny._id.toString()
    : teacherIdAny ? teacherIdAny.toString() : undefined;

  const teacherName = (teacherIdAny && typeof teacherIdAny === 'object' && 'name' in teacherIdAny)
    ? teacherIdAny.name
    : undefined;

  return new LeaveManagementEntity(
    (doc._id || doc.id).toString(),

    teacherIdStr,
    subAdminIdStr,
    doc.applicantRole,

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
    teacherName,
    subAdminName
  );
};