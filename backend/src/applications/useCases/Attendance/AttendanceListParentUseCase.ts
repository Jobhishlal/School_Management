import { IParentAttendanceUseCase } from "../../../domain/UseCaseInterface/Attandance/IParentAttendanceListUseCase";
import { IAttandanceRepository } from "../../../domain/repositories/Attandance/IAttendanceRepository";
import { ParentAttendanceDashboardDTO } from "../../dto/Attendance/ParentAttendanceDashboardDTO";
export class ParentAttendanceListUseCase implements IParentAttendanceUseCase {

  constructor(
    private attendanceRepo: IAttandanceRepository
  ) {}

  async execute(parentId: string): Promise<ParentAttendanceDashboardDTO> {
      const data = await this.attendanceRepo.getParentAttendanceDashboard(parentId)
      return data
  }

   
}
