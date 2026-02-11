import { ParentAttendanceDashboardDTO } from "../../../dto/Attendance/ParentAttendanceDashboardDTO";

export interface IParentAttendanceUseCase {
  execute(parentId: string): Promise<ParentAttendanceDashboardDTO>;
}
