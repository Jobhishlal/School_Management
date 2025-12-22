import { ParentAttendanceDashboardDTO } from "../../../applications/dto/Attendance/ParentAttendanceDashboardDTO";

export interface IParentAttendanceUseCase {
  execute(parentId: string): Promise<ParentAttendanceDashboardDTO>;
}
